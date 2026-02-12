'use client'

import { AnalysisResult } from '@/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Props {
  result: AnalysisResult
}

export default function FinancialsTab({ result }: Props) {
  const { analysis } = result

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const expenseBreakdown = [
    { name: 'Property Tax', value: analysis.propertyTax, color: '#ef4444' },
    { name: 'Insurance', value: analysis.insurance, color: '#f59e0b' },
    { name: 'Maintenance', value: analysis.maintenance, color: '#eab308' },
    { name: 'Property Mgmt', value: analysis.propertyManagement, color: '#84cc16' },
    { name: 'HOA', value: analysis.hoa, color: '#22c55e' },
    { name: 'Utilities', value: analysis.utilities, color: '#10b981' },
    { name: 'Vacancy', value: analysis.vacancy, color: '#14b8a6' }
  ].filter(item => item.value > 0)

  const cashFlowData = [
    { name: 'Annual Rent', value: analysis.annualRent, color: '#10b981' },
    { name: 'Total Expenses', value: analysis.totalExpenses, color: '#ef4444' },
    { name: 'Mortgage Payment', value: analysis.monthlyMortgage * 12, color: '#f59e0b' }
  ]

  return (
    <div>
      <h2>Financial Analysis</h2>

      {/* Investment Summary */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
        <h3>Investment Summary</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Purchase Price</div>
            <div className="metric-value">{formatCurrency(analysis.purchasePrice)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Down Payment (20%)</div>
            <div className="metric-value">{formatCurrency(analysis.downPayment)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Loan Amount</div>
            <div className="metric-value">{formatCurrency(analysis.loanAmount)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Investment</div>
            <div className="metric-value">{formatCurrency(analysis.totalInvestment)}</div>
          </div>
        </div>
      </div>

      {/* Income */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
        <h3>Monthly Income</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Monthly Rent</div>
            <div className="metric-value positive">{formatCurrency(analysis.monthlyRent)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Annual Rent</div>
            <div className="metric-value positive">{formatCurrency(analysis.annualRent)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Other Income</div>
            <div className="metric-value">{formatCurrency(analysis.otherIncome)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Gross Income</div>
            <div className="metric-value positive">{formatCurrency(analysis.grossIncome)}</div>
          </div>
        </div>
      </div>

      {/* Expenses */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
        <h3>Annual Expenses</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Property Tax</div>
            <div className="metric-value">{formatCurrency(analysis.propertyTax)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Insurance</div>
            <div className="metric-value">{formatCurrency(analysis.insurance)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Maintenance</div>
            <div className="metric-value">{formatCurrency(analysis.maintenance)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Property Management</div>
            <div className="metric-value">{formatCurrency(analysis.propertyManagement)}</div>
          </div>
          {analysis.hoa > 0 && (
            <div className="metric-card">
              <div className="metric-label">HOA Fees</div>
              <div className="metric-value">{formatCurrency(analysis.hoa)}</div>
            </div>
          )}
          <div className="metric-card">
            <div className="metric-label">Utilities</div>
            <div className="metric-value">{formatCurrency(analysis.utilities)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Vacancy Reserve</div>
            <div className="metric-value">{formatCurrency(analysis.vacancy)}</div>
          </div>
          <div className="metric-card" style={{ gridColumn: 'span 2' }}>
            <div className="metric-label">Total Expenses</div>
            <div className="metric-value negative">{formatCurrency(analysis.totalExpenses)}</div>
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <h4 style={{ marginBottom: '16px' }}>Expense Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow & Returns */}
      <div>
        <h3>Cash Flow & Returns</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">NOI (Net Operating Income)</div>
            <div className="metric-value positive">{formatCurrency(analysis.noi)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Mortgage</div>
            <div className="metric-value">{formatCurrency(analysis.monthlyMortgage)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Monthly Cash Flow</div>
            <div className={`metric-value ${analysis.monthlyCashFlow > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(analysis.monthlyCashFlow)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Annual Cash Flow</div>
            <div className={`metric-value ${analysis.annualCashFlow > 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(analysis.annualCashFlow)}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <h3>Performance Metrics</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Cap Rate</div>
            <div className={`metric-value ${analysis.capRate > 6 ? 'positive' : 'warning'}`}>
              {analysis.capRate}%
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', color: '#6b7280' }}>
              {analysis.capRate > 8 ? 'Excellent' : analysis.capRate > 6 ? 'Good' : analysis.capRate > 4 ? 'Fair' : 'Poor'}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cash-on-Cash Return</div>
            <div className={`metric-value ${analysis.cashOnCashReturn > 8 ? 'positive' : 'warning'}`}>
              {analysis.cashOnCashReturn}%
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', color: '#6b7280' }}>
              {analysis.cashOnCashReturn > 12 ? 'Excellent' : analysis.cashOnCashReturn > 8 ? 'Good' : analysis.cashOnCashReturn > 5 ? 'Fair' : 'Poor'}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">GRM (Gross Rent Multiplier)</div>
            <div className="metric-value">{analysis.grm}</div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', color: '#6b7280' }}>
              {analysis.grm < 12 ? 'Good' : analysis.grm < 15 ? 'Fair' : 'High'}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">DSCR (Debt Service Coverage)</div>
            <div className={`metric-value ${analysis.dscr > 1.25 ? 'positive' : analysis.dscr > 1.0 ? 'warning' : 'negative'}`}>
              {analysis.dscr.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', color: '#6b7280' }}>
              {analysis.dscr > 1.25 ? 'Strong' : analysis.dscr > 1.0 ? 'Adequate' : 'Weak'}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ROI (Return on Investment)</div>
            <div className={`metric-value ${analysis.roi > 10 ? 'positive' : 'warning'}`}>
              {analysis.roi}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">10-Year IRR</div>
            <div className={`metric-value ${analysis.irr > 12 ? 'positive' : 'warning'}`}>
              {analysis.irr}%
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px', color: '#6b7280' }}>
              {analysis.irr > 15 ? 'Excellent' : analysis.irr > 10 ? 'Good' : analysis.irr > 7 ? 'Fair' : 'Poor'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
