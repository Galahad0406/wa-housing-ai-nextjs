const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY

const rentcastService = {

  async getProperty(address: string) {
    const res = await fetch(
      `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`,
      {
        headers: { "X-Api-Key": RENTCAST_API_KEY || "" }
      }
    )

    if (!res.ok) throw new Error("RentCast failed")

    const data = await res.json()
    return data[0]
  },

  async getRent(address: string) {
    const res = await fetch(
      `https://api.rentcast.io/v1/avm/rent?address=${encodeURIComponent(address)}`,
      {
        headers: { "X-Api-Key": RENTCAST_API_KEY || "" }
      }
    )

    if (!res.ok) throw new Error("Rent fetch failed")

    return res.json()
  }

}

export default rentcastService
