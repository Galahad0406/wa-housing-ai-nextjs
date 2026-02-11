import { NextResponse } from "next/server"
import propertyService from "@/lib/propertyService"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const zipcode = searchParams.get("zipcode")

    if (!zipcode) {
      return NextResponse.json(
        { error: "Zipcode required" },
        { status: 400 }
      )
    }

    const zipData = await propertyService.getZipData(zipcode)
    const census = await propertyService.getCensusData(zipcode)

    const grade = propertyService.calculateInvestmentScore(
      Number(census.medianIncome)
    )

    return NextResponse.json({
      zipcode,
      city: zipData.places[0]["place name"],
      state: zipData.places[0]["state abbreviation"],
      population: census.population,
      medianIncome: census.medianIncome,
      investmentGrade: grade
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
