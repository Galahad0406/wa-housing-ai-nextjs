import { NextResponse } from "next/server"
import rentcastService from "@/lib/rentcastService"
import propertyService from "@/lib/propertyService"
import investmentCalculator from "@/lib/investmentCalculator"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get("address")
    const zipcode = searchParams.get("zipcode")

    if (!address || !zipcode)
      return NextResponse.json({ error: "Missing params" }, { status: 400 })

    const property = await rentcastService.getProperty(address)
    const rent = await rentcastService.getRent(address)
    const census = await propertyService.getCensusData(zipcode)

    const growth = propertyService.predictGrowth(property.price, 0.05)
    const roi = investmentCalculator.calculate(property.price, rent.rent)

    return NextResponse.json({
      property,
      rent,
      census,
      growth,
      roi
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
