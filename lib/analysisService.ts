// lib/analysisService.ts
import apiService from './apiService'
import investmentAnalyzer from './investmentAnalyzer'
import { PropertyAnalysisResult, MarketAnalysisResult, PropertyData, RentalData, MarketData } from '@/types'

class AnalysisService {
  
  // Analyze specific property by address
  async analyzeProperty(address: string): Promise<PropertyAnalysisResult> {
    try {
      // Get property data
      const property = await apiService.getPropertyData(address)
      if (!property || !property.price) {
        throw new Error('Property not found. Please check the address.')
      }

      // Get rental data
      const rental = await apiService.getRentalData(address, property.squareFeet)
      if (!rental || !rental.monthlyRent) {
        throw new Error('Rental data not available for this property.')
      }

      // Get market data
      const market = await apiService.getMarketData(property.zipcode)
      if (!market) {
        throw new Error('Market data not available.')
      }

      // Get comparables
      const comparables = await apiService.getComparables(property)

      // Run investment analysis
      const analysis = investmentAnalyzer.analyze({
        property,
        rental,
        market
      })

      // Run scenario analysis
      const scenarios = investmentAnalyzer.analyzeScenarios({
        property,
        rental,
        market
      })

      // Calculate scores
      const riskScore = this.calculateRiskScore(analysis, market)
      const recommendationScore = this.calculateRecommendationScore(analysis, market, property)

      // Generate insights and warnings
      const insights = this.generateInsights(analysis, market, property, rental)
      const warnings = this.generateWarnings(analysis, market, property)

      return {
        type: 'property',
        property,
        rental,
        market,
        analysis,
        scenarios,
        comparables,
        riskScore,
        recommendationScore,
        insights,
        warnings
      }
    } catch (error: any) {
      console.error('Property analysis error:', error)
      throw error
    }
  }

  // Analyze market by zipcode
  async analyzeMarket(zipcode: string): Promise<MarketAnalysisResult> {
    try {
      // Get market data
      const market = await apiService.getMarketData(zipcode)
      if (!market) {
        throw new Error('Market data not available for this zipcode.')
      }

      // Search for properties in the area
      const properties = await apiService.searchPropertiesByZipcode(zipcode, 20)

      // Calculate market metrics
      let totalPrice = 0
      let totalRent = 0
      let count = 0

      const topProperties = []

      for (const prop of properties.slice(0, 10)) {
        if (prop.price > 0) {
          totalPrice += prop.price
          count++

          // Estimate rent (simple approximation)
          const estimatedRent = (prop.sqFt || 1500) * 1.5
          totalRent += estimatedRent

          // Calculate estimated cash flow (simplified)
          const estimatedExpenses = prop.price * 0.03 // 3% annual
          const estimatedMortgage = prop.price * 0.8 * 0.07 / 12 // Rough estimate
          const monthlyCashFlow = estimatedRent - (estimatedExpenses / 12) - estimatedMortgage
          const capRate = ((estimatedRent * 12 - estimatedExpenses) / prop.price) * 100

          topProperties.push({
            address: prop.address || 'N/A',
            price: prop.price,
            estimatedRent: Math.round(estimatedRent),
            estimatedCashFlow: Math.round(monthlyCashFlow),
            capRate: parseFloat(capRate.toFixed(2))
          })
        }
      }

      const averagePropertyPrice = count > 0 ? totalPrice / count : market.medianPrice
      const averageRent = count > 0 ? totalRent / count : market.averageRent
      const priceToRentRatio = averagePropertyPrice / (averageRent * 12)

      // Determine market trend
      let marketTrend: 'hot' | 'moderate' | 'slow' = 'moderate'
      if (market.daysOnMarket < 30 && market.yearOverYearAppreciation > 5) {
        marketTrend = 'hot'
      } else if (market.daysOnMarket > 60 || market.yearOverYearAppreciation < 2) {
        marketTrend = 'slow'
      }

      // Calculate investment potential (0-100)
      let potential = 50
      if (market.yearOverYearAppreciation > 5) potential += 15
      else if (market.yearOverYearAppreciation > 3) potential += 8
      
      if (market.vacancyRate < 5) potential += 10
      else if (market.vacancyRate < 7) potential += 5
      
      if (market.daysOnMarket < 30) potential += 10
      else if (market.daysOnMarket < 45) potential += 5
      
      if (priceToRentRatio < 15) potential += 10
      else if (priceToRentRatio < 18) potential += 5
      
      if (market.medianIncome > 70000) potential += 5

      const investmentPotential = Math.min(100, Math.max(0, potential))

      // Generate market insights
      const insights = this.generateMarketInsights(market, marketTrend, priceToRentRatio, investmentPotential)

      // Sort top properties by cap rate
      topProperties.sort((a, b) => b.capRate - a.capRate)

      return {
        type: 'market',
        zipcode,
        market,
        averagePropertyPrice: Math.round(averagePropertyPrice),
        averageRent: Math.round(averageRent),
        priceToRentRatio: parseFloat(priceToRentRatio.toFixed(2)),
        marketTrend,
        investmentPotential,
        insights,
        topProperties: topProperties.slice(0, 5)
      }
    } catch (error: any) {
      console.error('Market analysis error:', error)
      throw error
    }
  }

  private calculateRiskScore(analysis: any, market: any): number {
    let score = 50
    
    if (analysis.dscr > 1.25) score += 10
    if (analysis.capRate > 6) score += 10
    if (analysis.cashOnCashReturn > 8) score += 10
    if (market.vacancyRate < 5) score += 5
    if (market.yearOverYearAppreciation > 4) score += 5
    if (market.unemploymentRate < 4) score += 5
    if (market.schoolRating >= 8) score += 5
    
    if (analysis.dscr < 1.0) score -= 15
    if (analysis.capRate < 4) score -= 10
    if (analysis.monthlyCashFlow < 0) score -= 20
    if (market.vacancyRate > 8) score -= 10
    if (market.crimeIndex > 70) score -= 10
    if (market.daysOnMarket > 60) score -= 5
    
    return Math.max(0, Math.min(100, score))
  }

  private calculateRecommendationScore(analysis: any, market: any, property: any): number {
    let score = 0
    
    if (analysis.monthlyCashFlow > 500) score += 30
    else if (analysis.monthlyCashFlow > 200) score += 20
    else if (analysis.monthlyCashFlow > 0) score += 10
    
    if (analysis.capRate > 8) score += 20
    else if (analysis.capRate > 6) score += 15
    else if (analysis.capRate > 4) score += 10
    
    if (analysis.cashOnCashReturn > 12) score += 20
    else if (analysis.cashOnCashReturn > 8) score += 15
    else if (analysis.cashOnCashReturn > 5) score += 10
    
    if (market.yearOverYearAppreciation > 5) score += 8
    else if (market.yearOverYearAppreciation > 3) score += 5
    if (market.vacancyRate < 5) score += 7
    else if (market.vacancyRate < 7) score += 4
    
    const pricePerSqft = property.price / property.squareFeet
    if (pricePerSqft < market.pricePerSqft * 0.9) score += 15
    else if (pricePerSqft < market.pricePerSqft) score += 10
    else if (pricePerSqft < market.pricePerSqft * 1.1) score += 5
    
    return Math.min(100, score)
  }

  private generateInsights(analysis: any, market: any, property: any, rental: any): string[] {
    const insights: string[] = []
    
    if (analysis.monthlyCashFlow > 300) {
      insights.push(`✅ Strong positive cash flow of $${analysis.monthlyCashFlow.toLocaleString()}/month`)
    } else if (analysis.monthlyCashFlow > 0) {
      insights.push(`💡 Modest cash flow of $${analysis.monthlyCashFlow.toLocaleString()}/month`)
    }
    
    if (analysis.capRate > 8) {
      insights.push(`✅ Excellent cap rate of ${analysis.capRate}% - above market average`)
    } else if (analysis.capRate > 5) {
      insights.push(`💡 Good cap rate of ${analysis.capRate}%`)
    }
    
    if (market.yearOverYearAppreciation > 5) {
      insights.push(`✅ Strong market appreciation of ${market.yearOverYearAppreciation.toFixed(1)}% annually`)
    }
    
    if (market.daysOnMarket < 30) {
      insights.push(`✅ Hot market - properties sell in ${market.daysOnMarket} days on average`)
    }
    
    const rentToPrice = (rental.monthlyRent * 12) / property.price
    if (rentToPrice > 0.01) {
      insights.push(`✅ Strong rent-to-price ratio of ${(rentToPrice * 100).toFixed(2)}%`)
    }
    
    if (market.schoolRating >= 8) {
      insights.push(`✅ Excellent school rating (${market.schoolRating}/10)`)
    }
    
    const finalYear = analysis.yearlyProjections[9]
    if (finalYear) {
      insights.push(
        `📈 10-year projection: $${finalYear.propertyValue.toLocaleString()} value, ` +
        `$${finalYear.equity.toLocaleString()} equity`
      )
    }
    
    if (analysis.irr > 15) {
      insights.push(`✅ Exceptional IRR of ${analysis.irr}%`)
    }
    
    return insights
  }

  private generateWarnings(analysis: any, market: any, property: any): string[] {
    const warnings: string[] = []
    
    if (analysis.dscr < 1.0) {
      warnings.push(`❌ DSCR of ${analysis.dscr.toFixed(2)} is below 1.0`)
    }
    
    if (analysis.monthlyCashFlow < -100) {
      warnings.push(`❌ Significant negative cash flow`)
    }
    
    if (market.vacancyRate > 8) {
      warnings.push(`⚠️ High vacancy rate of ${market.vacancyRate.toFixed(1)}%`)
    }
    
    if (market.crimeIndex > 70) {
      warnings.push(`⚠️ Higher crime index (${market.crimeIndex})`)
    }
    
    if (property.yearBuilt < 1980) {
      warnings.push(`⚠️ Older property (built ${property.yearBuilt})`)
    }
    
    if (market.daysOnMarket > 60) {
      warnings.push(`⚠️ Properties take ${market.daysOnMarket} days to sell`)
    }
    
    const pricePerSqft = property.price / property.squareFeet
    if (pricePerSqft > market.pricePerSqft * 1.15) {
      warnings.push(`⚠️ Price per sqft is ${((pricePerSqft / market.pricePerSqft - 1) * 100).toFixed(0)}% above market`)
    }
    
    return warnings
  }

  private generateMarketInsights(market: MarketData, trend: string, priceToRent: number, potential: number): string[] {
    const insights: string[] = []

    insights.push(`📊 Market Trend: ${trend.toUpperCase()} - ${
      trend === 'hot' ? 'High demand, fast sales' :
      trend === 'moderate' ? 'Balanced market conditions' :
      'Slower market, more negotiating power'
    }`)

    insights.push(`🎯 Investment Potential Score: ${potential}/100`)

    if (market.yearOverYearAppreciation > 5) {
      insights.push(`✅ Strong ${market.yearOverYearAppreciation.toFixed(1)}% annual appreciation`)
    } else if (market.yearOverYearAppreciation < 2) {
      insights.push(`⚠️ Low ${market.yearOverYearAppreciation.toFixed(1)}% appreciation rate`)
    }

    if (market.vacancyRate < 5) {
      insights.push(`✅ Low ${market.vacancyRate.toFixed(1)}% vacancy rate - high rental demand`)
    } else if (market.vacancyRate > 8) {
      insights.push(`⚠️ Higher ${market.vacancyRate.toFixed(1)}% vacancy rate`)
    }

    if (priceToRent < 15) {
      insights.push(`✅ Favorable price-to-rent ratio of ${priceToRent.toFixed(1)} - good for investors`)
    } else if (priceToRent > 20) {
      insights.push(`⚠️ High price-to-rent ratio of ${priceToRent.toFixed(1)} - appreciation play`)
    }

    if (market.medianIncome > 80000) {
      insights.push(`✅ High median income ($${market.medianIncome.toLocaleString()}) - quality tenants`)
    }

    if (market.daysOnMarket < 30) {
      insights.push(`✅ Fast-moving market - ${market.daysOnMarket} days average`)
    }

    if (market.population > 100000) {
      insights.push(`📈 Large population (${market.population.toLocaleString()}) - diverse rental pool`)
    }

    return insights
  }
}

export default new AnalysisService()
