'use client'

import { useState } from 'react'
import PropertySearch from '@/components/PropertySearch'
import PropertyAnalysisReport from '@/components/PropertyAnalysisReport'
import MarketAnalysisReport from '@/components/MarketAnalysisReport'
import { AnalysisResult } from '@/types'

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (address?: string, zipcode?: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      if (address && address.trim()) {
        // Property-specific analysis
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: address.trim() })
        })
      } else if (zipcode && /^\d{5}$/.test(zipcode)) {
        // Market analysis by zipcode
        response = await fetch('/api/market', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zipcode })
        })
      } else {
        throw new Error('Please enter either a property address or a zipcode')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Pro Real Estate Analyzer</h1>
        <p>Professional Investment Analysis Platform</p>
      </div>

      <PropertySearch onAnalyze={handleAnalyze} loading={loading} />

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>
            Analyzing data from multiple sources...
          </p>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && !loading && (
        <>
          {result.type === 'property' ? (
            <PropertyAnalysisReport result={result} />
          ) : (
            <MarketAnalysisReport result={result} />
          )}
        </>
      )}
    </div>
  )
}
