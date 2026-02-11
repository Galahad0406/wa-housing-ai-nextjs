const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY

const rentcastService = {

  async getPropertyValue(address: string) {
    const res = await fetch(
      `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`,
      {
        headers: {
          "X-Api-Key": RENTCAST_API_KEY || ""
        }
      }
    )

    if (!res.ok) throw new Error("RentCast property fetch failed")

    const data = await res.json()

    return data[0]
  },

  async getRentEstimate(address: string) {
    const res = await fetch(
      `https://api.rentcast.io/v1/avm/rent?address=${encodeURIComponent(address)}`,
      {
        headers: {
          "X-Api-Key": RENTCAST_API_KEY || ""
        }
      }
    )

    if (!res.ok) throw new Error("Rent estimate failed")

    return res.json()
  }

}

export default rentcastService
