export async function getHUDData(zip: string) {
  const res = await fetch(
    `https://www.huduser.gov/hudapi/public/il/data?zip=${zip}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HUD_API_KEY}`
      }
    }
  )

  if (!res.ok) {
    throw new Error("HUD API Error")
  }

  return res.json()
}
