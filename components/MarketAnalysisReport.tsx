'use client'

import { MarketAnalysisResult } from '@/types'

interface Props {
  result: MarketAnalysisResult
}

export default function MarketAnalysisReport({ result }: Props) {
  const { market, marketTrend, investmentPotential, insights, topProperties } = result

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'hot') return '#10b981'
    if (trend === 'moderate') return '#3b82f6'
    return '#f59e0b'
  }

  const getTrendLabel = (trend: string) => {
    if (trend === 'hot') return '🔥 HOT MARKET'
    if (trend === 'moderate') return '📊 MODERATE MARKET'
    return '❄️ SLOW MARKET'
  }

  const getPotentialClass = (score: number) => {
    if (score >= 75) return 'score-excellent'
    if (score >= 60) return 'score-good'
    if (score >= 40) return 'score-fair'
    return 'score-poor'
  }

  return (
    <div>
      <div className="card">
        <h2>Market Analysis - Zipcode {result.zipcode}</h2>

        {/* Market Trend Badge */}
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <div style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: `linear-gradient(135deg, ${getTrendColor(marketTrend)} 0%, ${getTrendColor(marketTrend)}dd 100%)`,
            color: 'white',
            borderRadius: '100px',
            fontSize: '1.5rem',
            fontWeight: 800,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            {getTrendLabel(marketTrend)}
          </div>
          <div className={`score-badge ${getPotentialClass(investmentPotential)}`} style={{ marginTop: '16px' }}>
            Investment Potential: {investmentPotential}/100
          </div>
        </div>

        {/* Market Overview */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
          <h3>Market Overview</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Average Property Price</div>
              <div className="metric-value">{formatCurrency(result.averagePropertyPrice)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Average Monthly Rent</div>
              <div className="metric-value positive">{formatCurrency(result.averageRent)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Price-to-Rent Ratio</div>
              <div className={`metric-value ${result.priceToRentRatio < 15 ? 'positive' : result.priceToRentRatio < 20 ? 'warning' : 'negative'}`}>
                {result.priceToRentRatio.toFixed(1)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Median Price</div>
              <div className="metric-value">{formatCurrency(market.medianPrice)}</div>
            </div>
          </div>
        </div>

        {/* Market Metrics */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
          <h3>Market Metrics</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Price Per Sq Ft</div>
              <div className="metric-value">{formatCurrency(market.pricePerSqft)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Days on Market</div>
              <div className={`metric-value ${market.daysOnMarket < 30 ? 'positive' : market.daysOnMarket < 60 ? 'warning' : 'negative'}`}>
                {market.daysOnMarket}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">YoY Appreciation</div>
              <div className={`metric-value ${market.yearOverYearAppreciation > 5 ? 'positive' : market.yearOverYearAppreciation > 3 ? 'warning' : 'negative'}`}>
                {market.yearOverYearAppreciation.toFixed(1)}%
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Vacancy Rate</div>
              <div className={`metric-value ${market.vacancyRate < 5 ? 'positive' : market.vacancyRate < 8 ? 'warning' : 'negative'}`}>
                {market.vacancyRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
          <h3>Area Demographics</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Population</div>
              <div className="metric-value">{market.population.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Median Income</div>
              <div className="metric-value">{formatCurrency(market.medianIncome)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Unemployment Rate</div>
              <div className={`metric-value ${market.unemploymentRate < 4 ? 'positive' : market.unemploymentRate < 6 ? 'warning' : 'negative'}`}>
                {market.unemploymentRate.toFixed(1)}%
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">School Rating</div>
              <div className={`metric-value ${market.schoolRating >= 8 ? 'positive' : market.schoolRating >= 6 ? 'warning' : 'negative'}`}>
                {market.schoolRating}/10
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="card">
          <h3>Market Insights</h3>
          <ul className="insight-list">
            {insights.map((insight, index) => (
              <li key={index} className={`insight-item ${insight.includes('⚠️') ? 'warning-item' : ''}`}>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Top Investment Opportunities */}
        {topProperties.length > 0 && (
          <div className="card">
            <h3>Top Investment Opportunities in This Area</h3>
            <p style={{ marginBottom: '20px', color: '#6b7280' }}>
              Based on estimated cap rates and cash flow potential
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Est. Monthly Rent</th>
                    <th>Est. Cash Flow</th>
                    <th>Est. Cap Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topProperties.map((prop, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 600 }}>{prop.address}</td>
                      <td>{formatCurrency(prop.price)}</td>
                      <td style={{ color: '#10b981', fontWeight: 600 }}>
                        {formatCurrency(prop.estimatedRent)}
                      </td>
                      <td style={{ 
                        color: prop.estimatedCashFlow > 0 ? '#10b981' : '#ef4444',
                        fontWeight: 600 
                      }}>
                        {formatCurrency(prop.estimatedCashFlow)}
                      </td>
                      <td style={{ 
                        color: prop.capRate > 6 ? '#10b981' : prop.capRate > 4 ? '#f59e0b' : '#ef4444',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {prop.capRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '16px', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
              * Estimates are approximations. Click "Search by Property Address" for detailed analysis.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div style={{
          marginTop: '32px',
          padding: '32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>
            Ready to Dive Deeper?
          </h3>
          <p style={{ fontSize: '1.125rem', marginBottom: '24px', opacity: 0.95 }}>
            Search for a specific property address to get a comprehensive investment analysis
            with 10-year projections, scenario comparisons, and detailed financial metrics.
          </p>
          <div style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'white',
            color: '#667eea',
            borderRadius: '100px',
            fontWeight: 700,
            fontSize: '1.125rem'
          }}>
            Use "Search by Property Address" above
          </div>
        </div>
      </div>
    </div>
  )
}
