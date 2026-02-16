'use client'

import { PropertyAnalysisResult } from '@/types'

interface Props {
  result: PropertyAnalysisResult
}

export default function MarketTab({ result }: Props) {
  const market = result.market
  const comparables = result.comparables

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
      <h2>Market Analysis - {market.zipcode}</h2>

      {/* Market Overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <h3>Market Overview</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Home Price</div>
            <div className="metric-value">{formatCurrency(market.medianPrice)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Price per Sq Ft</div>
            <div className="metric-value">{formatCurrency(market.pricePerSqft)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Days on Market</div>
            <div className="metric-value">{market.daysOnMarket} days</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Months Supply</div>
            <div className="metric-value">{market.monthsSupply.toFixed(1)} months</div>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
        <h3>Market Trends</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">YoY Appreciation</div>
            <div className={`metric-value ${market.yearOverYearAppreciation > 4 ? 'positive' : 'warning'}`}>
              {market.yearOverYearAppreciation.toFixed(2)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Average Rent</div>
            <div className="metric-value">{formatCurrency(market.averageRent)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Vacancy Rate</div>
            <div className={`metric-value ${market.vacancyRate < 5 ? 'positive' : 'warning'}`}>
              {market.vacancyRate.toFixed(1)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Listings</div>
            <div className="metric-value">{formatNumber(market.totalListings)}</div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
        <h3>Demographics</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Population</div>
            <div className="metric-value">{formatNumber(market.population)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income</div>
            <div className="metric-value">{formatCurrency(market.medianIncome)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Unemployment Rate</div>
            <div className={`metric-value ${market.unemploymentRate < 4 ? 'positive' : 'warning'}`}>
              {market.unemploymentRate.toFixed(1)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">School Rating</div>
            <div className={`metric-value ${market.schoolRating >= 8 ? 'positive' : 'warning'}`}>
              {market.schoolRating}/10
            </div>
          </div>
        </div>
      </div>

      {/* Comparable Properties */}
      {comparables && comparables.length > 0 && (
        <div className="card">
          <h3>Comparable Properties</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>$/Sq Ft</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Beds</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Baths</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Sq Ft</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>DOM</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Distance</th>
                </tr>
              </thead>
              <tbody>
                {comparables.map((comp, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{comp.address}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(comp.price)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(comp.pricePerSqft)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{comp.bedrooms}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{comp.bathrooms}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{formatNumber(comp.squareFeet)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{comp.daysOnMarket}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{comp.distance} mi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
