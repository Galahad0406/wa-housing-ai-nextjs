'use client'

import { PropertyAnalysisResult } from '@/types'

interface Props {
  result: PropertyAnalysisResult
}

export default function OverviewTab({ result }: Props) {
  const { property, analysis, recommendationScore, riskScore, insights, warnings } = result

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-excellent'
    if (score >= 60) return 'score-good'
    if (score >= 40) return 'score-fair'
    return 'score-poor'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div>
      <h2>Property Overview</h2>

      {/* Scores */}
      <div className="score-grid">
        <div className={`score-card ${getScoreClass(recommendationScore)}`}>
          <div className="score-label">Investment Score</div>
          <div className="score-value">{recommendationScore}</div>
          <div className="score-text">{getScoreLabel(recommendationScore)}</div>
        </div>
        <div className={`score-card ${getScoreClass(100 - riskScore)}`}>
          <div className="score-label">Risk Score</div>
          <div className="score-value">{riskScore}</div>
          <div className="score-text">{getScoreLabel(100 - riskScore)}</div>
        </div>
      </div>

      {/* Property Details */}
      <div className="card">
        <h3>Property Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <strong>Address:</strong> {property.address}
          </div>
          <div className="detail-item">
            <strong>City:</strong> {property.city}, {property.state} {property.zipcode}
          </div>
          <div className="detail-item">
            <strong>Price:</strong> {formatCurrency(property.price)}
          </div>
          <div className="detail-item">
            <strong>Bedrooms:</strong> {property.bedrooms}
          </div>
          <div className="detail-item">
            <strong>Bathrooms:</strong> {property.bathrooms}
          </div>
          <div className="detail-item">
            <strong>Square Feet:</strong> {formatNumber(property.squareFeet)}
          </div>
          <div className="detail-item">
            <strong>Lot Size:</strong> {formatNumber(property.lotSize)} sq ft
          </div>
          <div className="detail-item">
            <strong>Year Built:</strong> {property.yearBuilt}
          </div>
          <div className="detail-item">
            <strong>Property Type:</strong> {property.propertyType}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <h3>Key Investment Metrics</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Monthly Cash Flow</div>
            <div className={`metric-value ${analysis.monthlyCashFlow > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(analysis.monthlyCashFlow)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cap Rate</div>
            <div className={`metric-value ${analysis.capRate > 6 ? 'positive' : 'warning'}`}>
              {analysis.capRate.toFixed(2)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cash-on-Cash Return</div>
            <div className={`metric-value ${analysis.cashOnCashReturn > 8 ? 'positive' : 'warning'}`}>
              {analysis.cashOnCashReturn.toFixed(2)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">10-Year IRR</div>
            <div className={`metric-value ${analysis.irr > 12 ? 'positive' : 'warning'}`}>
              {analysis.irr.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
          <h3>Key Insights</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {insights.map((insight, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
          <h3>Warnings</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {warnings.map((warning, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
