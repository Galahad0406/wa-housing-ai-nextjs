'use client'

import { useState } from 'react'

interface Props {
  onResults: (data: any) => void
  onSearch?: () => void
}

export default function PropertySearch({ onResults, onSearch }: Props) {
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!address.trim() || !zipcode.trim()) {
      onResults({ error: 'Please enter both address and zipcode' })
      return
    }

    if (!/^\d{5}$/.test(zipcode)) {
      onResults({ error: 'Please enter a valid 5-digit zipcode' })
      return
    }

    setLoading(true)
    if (onSearch) onSearch()

    try {
      const res = await fetch(
        `/api/property?address=${encodeURIComponent(address)}&zipcode=${zipcode}`
      )
      
      const data = await res.json()
      onResults(data)
    } catch (err: any) {
      onResults({ error: 'Failed to connect to the server. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="text"
          placeholder="Property Address (e.g., 123 Main St, City, State)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{ flex: '1 1 300px' }}
        />
        <input
          type="text"
          placeholder="Zipcode (5 digits)"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
          onKeyPress={handleKeyPress}
          disabled={loading}
          maxLength={5}
          style={{ flex: '0 1 150px' }}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Property'}
        </button>
      </div>
    </div>
  )
}
