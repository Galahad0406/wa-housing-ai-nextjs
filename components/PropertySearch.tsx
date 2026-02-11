'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

interface PropertySearchProps {
  onResults: (data: any, type: string) => void
}

export default function PropertySearch({ onResults }: PropertySearchProps) {
  const [address, setAddress] = useState('')
  const [propertyType, setPropertyType] = useState<string>('property')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/property?address=${encodeURIComponent(address)}`
      )

      if (!res.ok) {
        throw new Error('Failed to fetch property data')
      }

      const data = await res.json()

      // ✅ 부모로 결과 전달
      onResults(data, 'property')

    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Property Investment Analyzer
      </Typography>

      <TextField
        fullWidth
        label="Property Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
      />

      <Select
        fullWidth
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <MenuItem value="property">Single Property</MenuItem>
        <MenuItem value="zipcode">Zipcode Analysis</MenuItem>
      </Select>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
