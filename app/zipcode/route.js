// app/api/zipcode/route.js
import { NextResponse } from 'next/server';
import redfinScraper from '../../../lib/redfinScraper';
import schoolData from '../../../lib/schoolData';
import investmentGrader from '../../../lib/investmentGrader';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipcode = searchParams.get('zipcode');

    if (!zipcode || !/^\d{5}$/.test(zipcode)) {
      return NextResponse.json(
        { error: 'Valid 5-digit zipcode is required' },
        { status: 400 }
      );
    }

    // Get market data for the zipcode
    const marketData = await redfinScraper.getZipcodeData(zipcode);

    // Get school ratings for the area
    const schools = await schoolData.getSchoolGrade(zipcode, null, null);

    // Create average property data for the zipcode
    const averageProperty = {
      zipcode,
      price: marketData.medianPrice,
      beds: 3,
      baths: 2.5,
      sqft: Math.round(marketData.medianPrice / marketData.avgPricePerSqft),
      lotSize: marketData.avgLotSize || 7200,
      propertyType: 'house',
      yearBuilt: 2010,
      pricePerSqft: marketData.avgPricePerSqft
    };

    // Calculate investment grade for average property
    const investment = investmentGrader.calculateGrade(
      averageProperty,
      marketData,
      schools
    );

    // Calculate average financials
    const estimatedRent = investmentGrader.estimateRent(averageProperty, marketData);
    const annualRent = estimatedRent * 12;
    const annualExpenses = marketData.medianPrice * 0.015;
    const netAnnualIncome = annualRent - annualExpenses;
    const netYield = (netAnnualIncome / marketData.medianPrice) * 100;

    // Calculate market trends
    const marketTrends = calculateMarketTrends(marketData, schools);

    // 5-year projection for average property
    const projection = calculateProjection(averageProperty, marketData, schools);

    return NextResponse.json({
      zipcode,
      marketSummary: {
        medianPrice: marketData.medianPrice,
        avgPricePerSqft: marketData.avgPricePerSqft,
        medianDaysOnMarket: marketData.medianDaysOnMarket,
        avgLotSize: marketData.avgLotSize,
        totalListings: marketData.totalListings,
        priceGrowth: marketData.priceGrowth,
        marketStrength: getMarketStrength(marketData)
      },
      averageProperty: {
        beds: averageProperty.beds,
        baths: averageProperty.baths,
        sqft: averageProperty.sqft,
        lotSize: averageProperty.lotSize,
        estimatedPrice: averageProperty.price
      },
      schools: {
        averageGrade: schools.averageRating,
        topSchoolRating: schools.topSchoolRating,
        schoolCount: schools.schoolCount,
        letterGrade: schoolData.convertToGrade(schools.averageRating)
      },
      investment: {
        grade: investment.grade,
        score: investment.score,
        explanation: investment.explanation,
        recommendation: investment.recommendation
      },
      financials: {
        netYield: Math.round(netYield * 100) / 100,
        estimatedMonthlyRent: estimatedRent,
        annualRent,
        annualExpenses: Math.round(annualExpenses),
        netAnnualIncome: Math.round(netAnnualIncome),
        capRate: Math.round(netYield * 100) / 100
      },
      marketTrends,
      projection
    });

  } catch (error) {
    console.error('Zipcode API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

function getMarketStrength(marketData) {
  const dom = marketData.medianDaysOnMarket;
  const growth = marketData.priceGrowth;

  if (dom < 20 && growth > 6) return 'Very Strong';
  if (dom < 30 && growth > 4) return 'Strong';
  if (dom < 45 && growth > 2) return 'Moderate';
  if (dom < 60 && growth > 0) return 'Weak';
  return 'Very Weak';
}

function calculateMarketTrends(marketData, schools) {
  return {
    demandIndicator: marketData.medianDaysOnMarket < 30 ? 'High' : 
                      marketData.medianDaysOnMarket < 45 ? 'Moderate' : 'Low',
    inventoryLevel: marketData.totalListings < 75 ? 'Low' :
                    marketData.totalListings < 150 ? 'Moderate' : 'High',
    appreciationTrend: marketData.priceGrowth >= 6 ? 'Strong Growth' :
                       marketData.priceGrowth >= 3 ? 'Moderate Growth' :
                       marketData.priceGrowth >= 0 ? 'Slow Growth' : 'Declining',
    schoolQualityImpact: schools.averageRating >= 8.5 ? 'Significant Premium' :
                         schools.averageRating >= 7.5 ? 'Moderate Premium' :
                         schools.averageRating >= 6.5 ? 'Neutral' : 'Discount',
    investmentOutlook: determineOutlook(marketData, schools)
  };
}

function determineOutlook(marketData, schools) {
  const factors = {
    growth: marketData.priceGrowth >= 5,
    demand: marketData.medianDaysOnMarket < 30,
    schools: schools.averageRating >= 8.0,
    inventory: marketData.totalListings < 100
  };

  const positives = Object.values(factors).filter(Boolean).length;

  if (positives >= 3) return 'Excellent';
  if (positives >= 2) return 'Good';
  if (positives >= 1) return 'Fair';
  return 'Poor';
}

function calculateProjection(propertyData, marketData, schools) {
  const currentPrice = marketData.medianPrice;
  const baseGrowth = marketData.priceGrowth || 5.5;
  const schoolBonus = schools.averageRating >= 8.5 ? 0.5 : 0;
  const annualGrowth = (baseGrowth + schoolBonus) / 100;

  const years = [1, 2, 3, 4, 5];
  return years.map(year => ({
    year,
    estimatedValue: Math.round(currentPrice * Math.pow(1 + annualGrowth, year)),
    appreciationPercent: Math.round(annualGrowth * 100 * year * 10) / 10,
    equityGained: Math.round(currentPrice * (Math.pow(1 + annualGrowth, year) - 1))
  }));
}
