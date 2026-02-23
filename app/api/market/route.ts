import { NextResponse } from "next/server"
import { getZillowData } from "@/lib/zillow"
import { getHUDData } from "@/lib/hud"
import { getCensusData } from "@/lib/census"
import { generateForecast } from "@/lib/forecast"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get("region")
  const zip = searchParams.get("zip")

  if (!region || !zip) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  const zillow = getZillowData(region)
  const hud = await getHUDData(zip)
  const census = await getCensusData(zip)

  const forecast = generateForecast(zillow, hud, census)

  return NextResponse.json(forecast)
}
