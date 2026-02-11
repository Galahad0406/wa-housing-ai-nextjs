'use client'

import React, { useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

export default function PropertySearch() {
  const [address, setAddress] = useState('')
  const [propertyType, setPropertyType] = useState<string>('house')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!address) return

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
      console.log(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Property Investment Analyzer
      </Typography>

      <TextField
        fullWidth
        label="Property Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        select
        fullWidth
        label="Property Type"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="house">Single Family House</MenuItem>
        <MenuItem value="townhome">Townhome / Condo</MenuItem>
      </TextField>

      <Button
        variant="contained"
        fullWidth
        disabled={loading}
        onClick={handleSearch}
      >
        {loading ? 'Analyzing...' : 'Analyze Property'}
      </Button>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
