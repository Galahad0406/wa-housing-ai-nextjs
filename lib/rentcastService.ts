const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY

const rentcastService = {
  async getProperty(address: string) {
    if (!RENTCAST_API_KEY) {
      throw new Error('RENTCAST_API_KEY is not configured')
    }

    const res = await fetch(
      `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`,
      {
        headers: { 
          'X-Api-Key': RENTCAST_API_KEY,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`RentCast API error: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Property not found')
    }

    return data[0]
  },

  async getRent(address: string) {
    if (!RENTCAST_API_KEY) {
      throw new Error('RENTCAST_API_KEY is not configured')
    }

    const res = await fetch(
      `https://api.rentcast.io/v1/avm/rent?address=${encodeURIComponent(address)}`,
      {
        headers: { 
          'X-Api-Key': RENTCAST_API_KEY,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`RentCast Rent API error: ${res.status} - ${errorText}`)
    }

    const data = await res.json()

    if (!data || !data.rent) {
      throw new Error('Rent data not available')
    }

    return data
  }
}

export default rentcastService
