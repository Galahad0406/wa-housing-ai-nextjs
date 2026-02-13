// app/api/analyze/route.ts
import { NextResponse } from 'next/server'
import analysisService from '@/lib/analysisService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address } = body

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: 'Property address is required' },
        { status: 400 }
      )
    }

    const result = await analysisService.analyzeProperty(address.trim())

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: error.message || 'Property analysis failed' },
      { status: 500 }
    )
  }
}
