'use client'

import { useState } from 'react'

interface Props {
  onResults: (data: any) => void
}

export default function PropertySearch({ onResults }: Props) {
  const [address, setAddress] = useState("")
  const [zipcode, setZipcode] = useState("")

  const handleSearch = async () => {
    const res = await fetch(
      `/api/property?address=${encodeURIComponent(address)}&zipcode=${zipcode}`
    )
    const data = await res.json()
    onResults(data)
  }

  return (
    <div>
      <input
        placeholder="Property Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder="Zipcode"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
      />
      <button onClick={handleSearch}>Analyze</button>
    </div>
  )
}
