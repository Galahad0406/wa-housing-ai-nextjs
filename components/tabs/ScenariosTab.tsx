'use client'

import { PropertyAnalysisResult } from '@/types'

interface Props {
  result: PropertyAnalysisResult
}

export default function ScenariosTab({ result }: Props) {
  const { scenarios } = result

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div>
      <h2>Scenario Analysis</h2>

      <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '32px' }}>
        Compare investment outcomes under different market conditions and assumptions.
      </p>

      {/* Comparison Table */}
      <div className="card">
        <h3>Scenario Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th style={{ background: '#ef4444' }}>Conservative</th>
                <th style={{ background: '#667eea' }}>Moderate (Base)</th>
                <th style={{ background: '#10b981' }}>Optimistic</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Interest Rate</strong></td>
                <td>{scenarios.conservative.interestRate}%</td>
                <td>{scenarios.moderate.interestRate}%</td>
                <td>{scenarios.optimistic.interestRate}%</td>
              </tr>
              <tr>
                <td><strong>Down Payment</strong></td>
                <td>{formatCurrency(scenarios.conservative.downPayment)}</td>
                <td>{formatCurrency(scenarios.moderate.downPayment)}</td>
                <td>{formatCurrency(scenarios.optimistic.downPayment)}</td>
              </tr>
              <tr>
                <td><strong>Monthly Rent</strong></td>
                <td>{formatCurrency(scenarios.conservative.monthlyRent)}</td>
                <td>{formatCurrency(scenarios.moderate.monthlyRent)}</td>
                <td>{formatCurrency(scenarios.optimistic.monthlyRent)}</td>
              </tr>
              <tr>
                <td><strong>Monthly Cash Flow</strong></td>
                <td style={{ color: scenarios.conservative.monthlyCashFlow > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {formatCurrency(scenarios.conservative.monthlyCashFlow)}
                </td>
                <td style={{ color: scenarios.moderate.monthlyCashFlow > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {formatCurrency(scenarios.moderate.monthlyCashFlow)}
                </td>
                <td style={{ color: scenarios.optimistic.monthlyCashFlow > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {formatCurrency(scenarios.optimistic.monthlyCashFlow)}
                </td>
              </tr>
              <tr>
                <td><strong>Annual Cash Flow</strong></td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(scenarios.conservative.annualCashFlow)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(scenarios.moderate.annualCashFlow)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(scenarios.optimistic.annualCashFlow)}</td>
              </tr>
              <tr>
                <td><strong>Cap Rate</strong></td>
                <td>{scenarios.conservative.capRate}%</td>
                <td>{scenarios.moderate.capRate}%</td>
                <td>{scenarios.optimistic.capRate}%</td>
              </tr>
              <tr>
                <td><strong>Cash-on-Cash Return</strong></td>
                <td>{scenarios.conservative.cashOnCashReturn}%</td>
                <td>{scenarios.moderate.cashOnCashReturn}%</td>
                <td>{scenarios.optimistic.cashOnCashReturn}%</td>
              </tr>
              <tr>
                <td><strong>DSCR</strong></td>
                <td>{scenarios.conservative.dscr.toFixed(2)}</td>
                <td>{scenarios.moderate.dscr.toFixed(2)}</td>
                <td>{scenarios.optimistic.dscr.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>10-Year IRR</strong></td>
                <td>{scenarios.conservative.irr}%</td>
                <td>{scenarios.moderate.irr}%</td>
                <td>{scenarios.optimistic.irr}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conservative Scenario */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
        <h3>🔴 Conservative Scenario</h3>
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          Worst-case assumptions: higher interest rate (7.5%), lower rent, higher expenses, slower appreciation (2%)
        </p>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Monthly Cash Flow</div>
            <div className={`metric-value ${scenarios.conservative.monthlyCashFlow > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(scenarios.conservative.monthlyCashFlow)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Year 10 Property Value</div>
            <div className="metric-value">
              {formatCurrency(scenarios.conservative.yearlyProjections[9]?.propertyValue || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Year 10 Total Return</div>
            <div className="metric-value">
              {formatCurrency(scenarios.conservative.yearlyProjections[9]?.totalReturn || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">10-Year IRR</div>
            <div className="metric-value">{scenarios.conservative.irr}%</div>
          </div>
        </div>
      </div>

      {/* Moderate Scenario */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <h3>🔵 Moderate Scenario (Base Case)</h3>
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          Realistic assumptions: standard terms, mid-range rent, normal market appreciation
        </p>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Monthly Cash Flow</div>
            <div className={`metric-value ${scenarios.moderate.monthlyCashFlow > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(scenarios.moderate.monthlyCashFlow)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Year 10 Property Value</div>
            <div className="metric-value">
              {formatCurrency(scenarios.moderate.yearlyProjections[9]?.propertyValue || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Year 10 Total Return</div>
            <div className="metric-value">
              {formatCurrency(scenarios.moderate.yearlyProjections[9]?.totalReturn || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">10-Year IRR</div>
            <div className="metric-value">{scenarios.moderate.irr}%</div>
          </div>
        </div>
      </div>

      {/* Optimistic Scenario */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
        <h3>🟢 Optimistic Scenario</h3>
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          Best-case assumptions: lower interest rate (6.5%), higher rent, lower expenses, strong appreciation
        </p>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Monthly Cash Flow</div>
            <div className={`metric-value ${scenarios.optimistic.monthlyCashFlow > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(scenarios.optimistic.monthlyCashFlow)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Year 10 Property Value</div>
            <div className="metric-value">
              {formatCurrency(scenarios.optimistic.yearlyProjections[9]?.propertyValue || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Year 10 Total Return</div>
            <div className="metric-value">
              {formatCurrency(scenarios.optimistic.yearlyProjections[9]?.totalReturn || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">10-Year IRR</div>
            <div className="metric-value">{scenarios.optimistic.irr}%</div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="card">
        <h3>Risk Assessment</h3>
        <ul className="insight-list">
          {scenarios.conservative.monthlyCashFlow < 0 ? (
            <li className="insight-item warning-item">
              ⚠️ Conservative scenario shows negative cash flow - ensure you have adequate reserves
            </li>
          ) : (
            <li className="insight-item">
              ✅ Even in conservative scenario, property maintains positive cash flow
            </li>
          )}
          
          {scenarios.optimistic.irr - scenarios.conservative.irr > 10 ? (
            <li className="insight-item warning-item">
              ⚠️ Large IRR variance ({scenarios.conservative.irr}% to {scenarios.optimistic.irr}%) indicates higher risk
            </li>
          ) : (
            <li className="insight-item">
              ✅ Moderate IRR variance suggests stable investment potential
            </li>
          )}
          
          {scenarios.moderate.cashOnCashReturn > 8 ? (
            <li className="insight-item">
              ✅ Base case shows strong {scenarios.moderate.cashOnCashReturn}% cash-on-cash return
            </li>
          ) : (
            <li className="insight-item warning-item">
              💡 Base case cash-on-cash return of {scenarios.moderate.cashOnCashReturn}% is modest - focus on appreciation
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
