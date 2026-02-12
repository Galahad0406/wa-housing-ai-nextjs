// lib/analysisService.ts
import mockDataService from './mockDataService'
import realApiService from './realApiService'
import investmentAnalyzer from './investmentAnalyzer'
import { AnalysisResult } from '@/types'

class AnalysisService {
  
  private calculateRiskScore(analysis: any, market: any): number {
    let score = 50 // Base score
    
    // Positive factors
    if (analysis.dscr > 1.25) score += 10
    if (analysis.capRate > 6) score += 10
    if (analysis.cashOnCashReturn > 8) score += 10
    if (market.vacancyRate < 5) score += 5
    if (market.yearOverYearAppreciation > 4) score += 5
    if (market.unemploymentRate < 4) score += 5
    if (market.schoolRating >= 8) score += 5
    
    // Negative factors
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
    
    // Cash flow (30 points)
    if (analysis.monthlyCashFlow > 500) score += 30
    else if (analysis.monthlyCashFlow > 200) score += 20
    else if (analysis.monthlyCashFlow > 0) score += 10
    
    // Cap rate (20 points)
    if (analysis.capRate > 8) score += 20
    else if (analysis.capRate > 6) score += 15
    else if (analysis.capRate > 4) score += 10
    
    // Cash-on-cash return (20 points)
    if (analysis.cashOnCashReturn > 12) score += 20
    else if (analysis.cashOnCashReturn > 8) score += 15
    else if (analysis.cashOnCashReturn > 5) score += 10
    
    // Market conditions (15 points)
    if (market.yearOverYearAppreciation > 5) score += 8
    else if (market.yearOverYearAppreciation > 3) score += 5
    if (market.vacancyRate < 5) score += 7
    else if (market.vacancyRate < 7) score += 4
    
    // Price vs market (15 points)
    const pricePerSqft = property.price / property.squareFeet
    if (pricePerSqft < market.pricePerSqft * 0.9) score += 15
    else if (pricePerSqft < market.pricePerSqft) score += 10
    else if (pricePerSqft < market.pricePerSqft * 1.1) score += 5
    
    return Math.min(100, score)
  }

  private generateInsights(
    analysis: any,
    market: any,
    property: any,
    rental: any
  ): string[] {
    const insights: string[] = []
    
    // Cash flow insights
    if (analysis.monthlyCashFlow > 300) {
      insights.push(`✅ Strong positive cash flow of $${analysis.monthlyCashFlow.toLocaleString()}/month`)
    } else if (analysis.monthlyCashFlow > 0) {
      insights.push(`💡 Modest cash flow of $${analysis.monthlyCashFlow.toLocaleString()}/month - consider rent increases`)
    } else {
      insights.push(`⚠️ Negative cash flow of $${Math.abs(analysis.monthlyCashFlow).toLocaleString()}/month`)
    }
    
    // Cap rate insights
    if (analysis.capRate > 8) {
      insights.push(`✅ Excellent cap rate of ${analysis.capRate}% - above market average`)
    } else if (analysis.capRate > 5) {
      insights.push(`💡 Good cap rate of ${analysis.capRate}% - solid investment potential`)
    } else {
      insights.push(`⚠️ Low cap rate of ${analysis.capRate}% - appreciation play rather than cash flow`)
    }
    
    // Market insights
    if (market.yearOverYearAppreciation > 5) {
      insights.push(`✅ Strong market appreciation of ${market.yearOverYearAppreciation.toFixed(1)}% annually`)
    }
    
    if (market.daysOnMarket < 30) {
      insights.push(`✅ Hot market - properties sell in ${market.daysOnMarket} days on average`)
    }
    
    // Rent to price ratio
    const rentToPrice = (rental.monthlyRent * 12) / property.price
    if (rentToPrice > 0.01) {
      insights.push(`✅ Strong rent-to-price ratio of ${(rentToPrice * 100).toFixed(2)}%`)
    }
    
    // School rating
    if (market.schoolRating >= 8) {
      insights.push(`✅ Excellent school rating (${market.schoolRating}/10) - attracts quality tenants`)
    }
    
    // 10-year projection
    const finalYear = analysis.yearlyProjections[analysis.yearlyProjections.length - 1]
    if (finalYear) {
      insights.push(
        `📈 10-year projection: Property value $${finalYear.propertyValue.toLocaleString()}, ` +
        `Total equity $${finalYear.equity.toLocaleString()}`
      )
    }
    
    // IRR
    if (analysis.irr > 15) {
      insights.push(`✅ Exceptional IRR of ${analysis.irr}% over 10 years`)
    } else if (analysis.irr > 10) {
      insights.push(`💡 Good IRR of ${analysis.irr}% over 10 years`)
    }
    
    return insights
  }

  private generateWarnings(
    analysis: any,
    market: any,
    property: any
  ): string[] {
    const warnings: string[] = []
    
    if (analysis.dscr < 1.0) {
      warnings.push(`❌ DSCR of ${analysis.dscr.toFixed(2)} is below 1.0 - difficulty qualifying for loan`)
    }
    
    if (analysis.monthlyCashFlow < -100) {
      warnings.push(`❌ Significant negative cash flow - you'll need reserves`)
    }
    
    if (market.vacancyRate > 8) {
      warnings.push(`⚠️ High vacancy rate of ${market.vacancyRate.toFixed(1)}% in the area`)
    }
    
    if (market.crimeIndex > 70) {
      warnings.push(`⚠️ Higher crime index (${market.crimeIndex}) may affect property values`)
    }
    
    if (property.yearBuilt < 1980) {
      warnings.push(`⚠️ Older property (built ${property.yearBuilt}) - expect higher maintenance costs`)
    }
    
    if (market.daysOnMarket > 60) {
      warnings.push(`⚠️ Properties take ${market.daysOnMarket} days to sell - slower market`)
    }
    
    const pricePerSqft = property.price / property.squareFeet
    if (pricePerSqft > market.pricePerSqft * 1.15) {
      warnings.push(`⚠️ Price per sqft ($${pricePerSqft.toFixed(0)}) is ${((pricePerSqft / market.pricePerSqft - 1) * 100).toFixed(0)}% above market average`)
    }
    
    if (market.unemploymentRate > 6) {
      warnings.push(`⚠️ Higher unemployment rate (${market.unemploymentRate.toFixed(1)}%) may affect tenant quality`)
    }
    
    return warnings
  }

  async analyzeProperty(address: string, zipcode: string): Promise<AnalysisResult> {
    try {
      // Try real APIs first
      let property = await realApiService.getPropertyFromZillow(address, zipcode)
      if (!property) property = await realApiService.getPropertyFromRedfin(address)
      if (!property) property = await realApiService.getPropertyFromAttom(address, zipcode)
      
      // Fall back to mock data
      if (!property) {
        console.log('Using mock data - no API keys configured')
        property = await mockDataService.getPropertyData(address, zipcode)
      }
      
      // Get rental data
      let rental = await realApiService.getRentalData(address, property.squareFeet, property.bedrooms)
      if (!rental) {
        rental = await mockDataService.getRentalData(address, property.squareFeet, property.bedrooms)
      }
      
      // Get market data
      let market = await realApiService.getMarketData(zipcode)
      if (!market) {
        market = await mockDataService.getMarketData(zipcode)
      }
      
      // Get comparables
      const comparables = await mockDataService.getComparables(property)
      
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
      console.error('Analysis error:', error)
      throw new Error('Failed to analyze property: ' + error.message)
    }
  }
}

export default new AnalysisService()
