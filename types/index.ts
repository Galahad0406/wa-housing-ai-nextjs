// types/index.ts

export interface AddressSuggestion {
  address: string
  city: string
  state: string
  zipcode: string
  fullAddress: string
}

export interface PropertyData {
  address: string
  city: string
  state: string
  zipcode: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  lotSize: number
  yearBuilt: number
  propertyType: string
  lastSoldDate?: string
  lastSoldPrice?: number
  taxAssessedValue: number
  annualTaxes: number
  hoa?: number
  zestimate?: number
  redfin_estimate?: number
}

export interface RentalData {
  monthlyRent: number
  rentLow: number
  rentHigh: number
  rentConfidence: number
  averageRentPerSqft: number
  occupancyRate: number
  marketGrowthRate: number
}

export interface MarketData {
  zipcode: string
  medianPrice: number
  pricePerSqft: number
  daysOnMarket: number
  monthsSupply: number
  yearOverYearAppreciation: number
  averageRent: number
  vacancyRate: number
  population: number
  medianIncome: number
  unemploymentRate: number
  crimeIndex: number
  schoolRating: number
  totalListings: number
  medianDaysToSell: number
}

export interface InvestmentAnalysis {
  purchasePrice: number
  downPayment: number
  loanAmount: number
  interestRate: number
  loanTerm: number
  monthlyMortgage: number
  
  monthlyRent: number
  annualRent: number
  otherIncome: number
  grossIncome: number
  
  propertyTax: number
  insurance: number
  hoa: number
  maintenance: number
  propertyManagement: number
  utilities: number
  vacancy: number
  totalExpenses: number
  
  noi: number
  monthlyCashFlow: number
  annualCashFlow: number
  
  capRate: number
  cashOnCashReturn: number
  grm: number
  dscr: number
  roi: number
  
  totalInvestment: number
  yearlyProjections: YearlyProjection[]
  irr: number
  equityBuildUp: YearlyEquity[]
}

export interface YearlyProjection {
  year: number
  propertyValue: number
  appreciation: number
  rentalIncome: number
  expenses: number
  cashFlow: number
  principalPaid: number
  equity: number
  totalReturn: number
  cumulativeCashFlow: number
}

export interface YearlyEquity {
  year: number
  loanBalance: number
  propertyValue: number
  equity: number
  equityPercentage: number
}

export interface ScenarioAnalysis {
  conservative: InvestmentAnalysis
  moderate: InvestmentAnalysis
  optimistic: InvestmentAnalysis
}

export interface ComparableProperty {
  address: string
  price: number
  pricePerSqft: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  daysOnMarket: number
  distance: number
}

export interface PropertyAnalysisResult {
  type: 'property'
  property: PropertyData
  rental: RentalData
  market: MarketData
  analysis: InvestmentAnalysis
  scenarios: ScenarioAnalysis
  comparables: ComparableProperty[]
  riskScore: number
  recommendationScore: number
  insights: string[]
  warnings: string[]
}

export interface MarketAnalysisResult {
  type: 'market'
  zipcode: string
  market: MarketData
  averagePropertyPrice: number
  averageRent: number
  priceToRentRatio: number
  marketTrend: 'hot' | 'moderate' | 'slow'
  investmentPotential: number
  insights: string[]
  topProperties: Array<{
    address: string
    price: number
    estimatedRent: number
    estimatedCashFlow: number
    capRate: number
  }>
}

export type AnalysisResult = PropertyAnalysisResult | MarketAnalysisResult

// ---------- Type Guards (Fix Vercel build error) ----------

export function isPropertyAnalysis(
  result: AnalysisResult
): result is PropertyAnalysisResult {
  return result.type === 'property'
}

export function isMarketAnalysis(
  result: AnalysisResult
): result is MarketAnalysisResult {
  return result.type === 'market'
}

