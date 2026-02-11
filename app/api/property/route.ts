// app/api/property/route.ts

import { NextResponse } from 'next/server'
import redfinScraper from '../../../lib/redfinScraper'
import schoolData from '../../../lib/schoolData'
import investmentGrader from '../../../lib/investmentGrader'

/**
 * ✅ VERCEL FIX
 * axios + cheerio 는 Edge runtime에서 동작하지 않음
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const propertyData = await redfinScraper.getPropertyData(address)

    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const marketData = await redfinScraper.getZipcodeData(propertyData.zipcode)

    const schools = await schoolData.getSchoolGrade(
      propertyData.zipcode,
      propertyData.latitude,
      propertyData.longitude
    )

    const investment = investmentGrader.calculateGrade(
      propertyData,
      marketData,
      schools
    )

    const estimatedRent =
      investmentGrader.estimateRent(propertyData, marketData)

    const annualRent = estimatedRent * 12
    const purchasePrice =
      propertyData.price || marketData.medianPrice

    const annualExpenses = purchasePrice * 0.015
    const netAnnualIncome = annualRent - annualExpenses
    const netYield = (netAnnualIncome / purchasePrice) * 100

    const projection = calculateProjection(
      propertyData,
      marketData,
      schools
    )

    return NextResponse.json({
      property: propertyData,
      market: marketData,
      schools,
      investment,
      financials: {
        netYield: Number(netYield.toFixed(2)),
        estimatedRent,
        annualRent,
        annualExpenses: Math.round(annualExpenses),
        netAnnualIncome: Math.round(netAnnualIncome),
      },
      projection
    })
  } catch (error: any) {
    console.error('Property API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

function calculateProjection(propertyData: any, marketData: any, schools: any) {
  const currentPrice = propertyData.price || marketData.medianPrice
  const baseGrowth = marketData.priceGrowth || 5.5
  const schoolBonus = schools.averageRating >= 8.5 ? 0.5 : 0
  const annualGrowth = (baseGrowth + schoolBonus) / 100

  return [1, 2, 3, 4, 5].map(year => ({
    year,
    estimatedValue: Math.round(
      currentPrice * Math.pow(1 + annualGrowth, year)
    ),
    equityGained: Math.round(
      currentPrice * (Math.pow(1 + annualGrowth, year) - 1)
    )
  }))
}
