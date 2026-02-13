'use client'

import { useState, useEffect, useRef } from 'react'
import { AddressSuggestion } from '@/types'

interface Props {
  onAnalyze: (address?: string, zipcode?: string) => void
  loading: boolean
}

export default function PropertySearch({ onAnalyze, loading }: Props) {
  const [searchMode, setSearchMode] = useState<'address' | 'zipcode'>('address')
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchMode === 'address' && address.length >= 3) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/autocomplete?query=${encodeURIComponent(address)}`)
          const data = await response.json()
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        } catch (error) {
          console.error('Autocomplete error:', error)
          setSuggestions([])
        }
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [address, searchMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchMode === 'address') {
      if (!address.trim()) {
        alert('Please enter a property address')
        return
      }
      onAnalyze(address.trim(), undefined)
    } else {
      if (!zipcode.trim() || !/^\d{5}$/.test(zipcode)) {
        alert('Please enter a valid 5-digit zipcode')
        return
      }
      onAnalyze(undefined, zipcode.trim())
    }

    setShowSuggestions(false)
  }

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setAddress(suggestion.fullAddress)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="search-box">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => setSearchMode('address')}
            style={{
              width: 'auto',
              padding: '12px 32px',
              background: searchMode === 'address' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : '#e5e7eb',
              color: searchMode === 'address' ? 'white' : '#6b7280',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            🏠 Search by Property Address
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('zipcode')}
            style={{
              width: 'auto',
              padding: '12px 32px',
              background: searchMode === 'zipcode' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : '#e5e7eb',
              color: searchMode === 'zipcode' ? 'white' : '#6b7280',
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            📍 Search by Zipcode
          </button>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '0.95rem',
          marginBottom: '16px'
        }}>
          {searchMode === 'address' 
            ? 'Get detailed analysis for a specific property' 
            : 'Get market overview and investment opportunities in an area'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {searchMode === 'address' ? (
          <div style={{ position: 'relative' }} ref={suggestionsRef}>
            <input
              type="text"
              placeholder="Enter property address (e.g., 123 Main St, Los Angeles, CA)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoComplete="off"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '2px solid #667eea',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    style={{
                      padding: '16px 20px',
                      cursor: 'pointer',
                      background: selectedIndex === index ? '#f3f4f6' : 'white',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #e5e7eb' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div style={{ fontWeight: 600, color: '#1f2937' }}>
                      {suggestion.address}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                      {suggestion.city}, {suggestion.state} {suggestion.zipcode}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Enter 5-digit zipcode (e.g., 90210)"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            disabled={loading}
            maxLength={5}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Investment'}
        </button>
      </form>
    </div>
  )
}
