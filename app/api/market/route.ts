// app/api/market/route.ts
import { NextResponse } from 'next/server'
import analysisService from '@/lib/analysisService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { zipcode } = body

    if (!zipcode || !/^\d{5}$/.test(zipcode)) {
      return NextResponse.json(
        { error: 'Valid 5-digit zipcode is required' },
        { status: 400 }
      )
    }

    const result = await analysisService.analyzeMarket(zipcode)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Market analysis API error:', error)
    return NextResponse.json(
      { error: error.message || 'Market analysis failed' },
      { status: 500 }
    )
  }
}
