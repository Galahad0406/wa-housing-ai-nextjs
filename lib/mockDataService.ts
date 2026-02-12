// lib/mockDataService.ts
import { PropertyData, RentalData, MarketData, ComparableProperty } from '@/types'

class MockDataService {
  private generateRealisticPrice(zipcode: string, sqft: number): number {
    // Zipcode-based pricing (simplified)
    const basePrice = parseInt(zipcode.slice(0, 2)) * 5000
    return basePrice + (sqft * (150 + Math.random() * 100))
  }

  async getPropertyData(address: string, zipcode: string): Promise<PropertyData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const sqft = 1200 + Math.floor(Math.random() * 2000)
    const price = this.generateRealisticPrice(zipcode, sqft)
    const bedrooms = Math.floor(sqft / 500) + 1
    const bathrooms = Math.floor(bedrooms / 1.5)

    return {
      address,
      city: 'Sample City',
      state: 'CA',
      zipcode,
      price: Math.round(price),
      bedrooms,
      bathrooms,
      squareFeet: sqft,
      lotSize: 5000 + Math.floor(Math.random() * 5000),
      yearBuilt: 1990 + Math.floor(Math.random() * 30),
      propertyType: 'Single Family',
      lastSoldDate: '2020-05-15',
      lastSoldPrice: Math.round(price * 0.85),
      taxAssessedValue: Math.round(price * 0.92),
      annualTaxes: Math.round(price * 0.012),
      hoa: Math.random() > 0.5 ? Math.round(50 + Math.random() * 200) : 0,
      zestimate: Math.round(price * (0.98 + Math.random() * 0.04)),
      redfin_estimate: Math.round(price * (0.97 + Math.random() * 0.06))
    }
  }

  async getRentalData(address: string, sqft: number, bedrooms: number): Promise<RentalData> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const baseRent = (sqft * 1.5) + (bedrooms * 200)
    const monthlyRent = Math.round(baseRent * (0.95 + Math.random() * 0.1))

    return {
      monthlyRent,
      rentLow: Math.round(monthlyRent * 0.92),
      rentHigh: Math.round(monthlyRent * 1.08),
      rentConfidence: 85 + Math.floor(Math.random() * 10),
      averageRentPerSqft: parseFloat((monthlyRent / sqft).toFixed(2)),
      occupancyRate: 94 + Math.floor(Math.random() * 5),
      marketGrowthRate: 3 + Math.random() * 3
    }
  }

  async getMarketData(zipcode: string): Promise<MarketData> {
    await new Promise(resolve => setTimeout(resolve, 400))

    const basePrice = parseInt(zipcode.slice(0, 2)) * 10000
    
    return {
      medianPrice: basePrice + Math.floor(Math.random() * 100000),
      pricePerSqft: 200 + Math.floor(Math.random() * 150),
      daysOnMarket: 20 + Math.floor(Math.random() * 40),
      monthsSupply: 2 + Math.random() * 3,
      yearOverYearAppreciation: 3 + Math.random() * 5,
      averageRent: 1800 + Math.floor(Math.random() * 1000),
      vacancyRate: 3 + Math.random() * 4,
      population: 50000 + Math.floor(Math.random() * 200000),
      medianIncome: 60000 + Math.floor(Math.random() * 50000),
      unemploymentRate: 3 + Math.random() * 3,
      crimeIndex: 40 + Math.floor(Math.random() * 40),
      schoolRating: 6 + Math.floor(Math.random() * 4)
    }
  }

  async getComparables(property: PropertyData): Promise<ComparableProperty[]> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const comparables: ComparableProperty[] = []
    for (let i = 0; i < 5; i++) {
      const sqftVariance = property.squareFeet * (0.9 + Math.random() * 0.2)
      const price = property.price * (0.92 + Math.random() * 0.16)
      
      comparables.push({
        address: `${100 + i * 100} ${['Main', 'Oak', 'Elm', 'Maple', 'Pine'][i]} St`,
        price: Math.round(price),
        pricePerSqft: Math.round(price / sqftVariance),
        bedrooms: property.bedrooms + (Math.random() > 0.5 ? 1 : -1),
        bathrooms: property.bathrooms,
        squareFeet: Math.round(sqftVariance),
        daysOnMarket: 15 + Math.floor(Math.random() * 45),
        distance: parseFloat((Math.random() * 2).toFixed(2))
      })
    }

    return comparables
  }
}

export default new MockDataService()
