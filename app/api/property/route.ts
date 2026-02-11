// app/api/property/route.js
import { NextResponse } from 'next/server';
import redfinScraper from '../../../lib/redfinScraper';
import schoolData from '../../../lib/schoolData';
import investmentGrader from '../../../lib/investmentGrader';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Get property data from Redfin
    const propertyData = await redfinScraper.getPropertyData(address);

    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get market data for the zipcode
    const marketData = await redfinScraper.getZipcodeData(propertyData.zipcode);

    // Get school ratings
    const schools = await schoolData.getSchoolGrade(
      propertyData.zipcode,
      propertyData.latitude,
      propertyData.longitude
    );

    // Calculate investment grade
    const investment = investmentGrader.calculateGrade(
      propertyData,
      marketData,
      schools
    );

    // Calculate net yield
    const annualRent = investment.scores.priceToRent >= 70 
      ? investmentGrader.estimateRent(propertyData, marketData) * 12
      : investmentGrader.estimateRent(propertyData, marketData) * 12 * 0.95;
    
    const purchasePrice = propertyData.price || marketData.medianPrice;
    const annualExpenses = purchasePrice * 0.015; // 1.5% for taxes, insurance, maintenance
    const netAnnualIncome = annualRent - annualExpenses;
    const netYield = (netAnnualIncome / purchasePrice) * 100;

    // Calculate 5-year projection
    const projection = calculateProjection(
      propertyData,
      marketData,
      schools
    );

    return NextResponse.json({
      property: {
        address: propertyData.address,
        price: propertyData.price,
        beds: propertyData.beds,
        baths: propertyData.baths,
        sqft: propertyData.sqft,
        lotSize: propertyData.lotSize,
        propertyType: propertyData.propertyType,
        yearBuilt: propertyData.yearBuilt,
        pricePerSqft: propertyData.pricePerSqft,
        zipcode: propertyData.zipcode
      },
      market: marketData,
      schools: {
        averageGrade: schools.averageRating,
        topSchoolRating: schools.topSchoolRating,
        schoolCount: schools.schoolCount
      },
      investment: {
        grade: investment.grade,
        score: investment.score,
        explanation: investment.explanation,
        recommendation: investment.recommendation,
        detailedScores: investment.scores
      },
      financials: {
        netYield: Math.round(netYield * 100) / 100,
        estimatedRent: Math.round(annualRent / 12),
        annualRent,
        annualExpenses: Math.round(annualExpenses),
        netAnnualIncome: Math.round(netAnnualIncome),
        cashOnCashReturn: Math.round(netYield * 100) / 100
      },
      projection
    });

  } catch (error) {
    console.error('Property API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

function calculateProjection(propertyData, marketData, schools) {
  const currentPrice = propertyData.price || marketData.medianPrice;
  const baseGrowth = marketData.priceGrowth || 5.5;
  
  // Adjust growth based on school quality
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
