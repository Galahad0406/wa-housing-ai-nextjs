# 🏘️ Pro Real Estate Analyzer - RapidAPI Edition

Professional real estate investment analysis platform powered by RapidAPI with intelligent address search and dual analysis modes.

## ✨ Features

### 🔍 **Intelligent Address Autocomplete**
- Redfin-style address suggestions as you type
- Fast, accurate property search
- Dropdown selection with keyboard navigation

### 📊 **Dual Search Modes**
1. **Property Search**: Analyze a specific property with detailed metrics
2. **Market Search**: Get area overview and investment opportunities by zipcode

### 🎯 **Powered by RapidAPI**
All data comes from premium APIs on RapidAPI platform:
- **Redfin API**: Primary property data and market statistics
- **Zillow API**: Backup property data for better coverage
- **Realty Mole Property API**: Rental price estimates
- **Census API**: Demographics and economic data

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Get Your API Keys

#### RapidAPI (Required)
1. Go to https://rapidapi.com/
2. Sign up for a free account
3. Subscribe to these APIs:
   - **Redfin API**: Search for "Redfin" → Subscribe (Free tier available)
   - **Zillow API**: Search for "Zillow" → Subscribe (Free tier available)
   - **Realty Mole Property API**: Search for "Realty Mole" → Subscribe
4. Copy your RapidAPI key (same key works for all APIs!)

#### Census API (Optional but Recommended)
1. Go to https://api.census.gov/data/key_signup.html
2. Request a free API key
3. Check your email for the key

### 3. Environment Setup

Create `.env.local` file in the root directory:

```env
RAPIDAPI_KEY=your_rapidapi_key_here
CENSUS_API_KEY=your_census_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npm run build
```

Or push to GitHub and deploy via Vercel dashboard.

## 🔑 Vercel Environment Variables Setup

In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Click "Add Environment Variable"
3. Add these variables:

| Key | Value | Environments |
|-----|-------|--------------|
| `RAPIDAPI_KEY` | Your RapidAPI key | ✅ Production, Preview, Development |
| `CENSUS_API_KEY` | Your Census API key | ✅ Production, Preview, Development |

4. Click "Save" for each variable
5. Redeploy your project

## 📋 How to Use

### Property Search Mode

1. Click "Search by Property Address"
2. Start typing an address
3. Select from autocomplete suggestions
4. Get detailed investment analysis with:
   - Cash flow projections
   - 10-year forecasts
   - Scenario analysis
   - Market comparables
   - Risk assessment

### Market Search Mode

1. Click "Search by Zipcode"
2. Enter 5-digit zipcode
3. Get market overview including:
   - Market trend analysis
   - Investment potential score
   - Demographics
   - Top opportunities in area
   - Price-to-rent ratios

## 🎨 Features

### Property Analysis
- ✅ Comprehensive financial metrics (Cap Rate, Cash-on-Cash, IRR, DSCR, GRM)
- ✅ 10-year projections with equity build-up
- ✅ 3 scenario analysis (conservative/moderate/optimistic)
- ✅ Comparable properties analysis
- ✅ Market data integration
- ✅ Risk & recommendation scores

### Market Analysis
- ✅ Area-wide market metrics
- ✅ Investment potential scoring
- ✅ Top 5 investment opportunities
- ✅ Demographics & trends
- ✅ Price-to-rent analysis

## 🔧 API Configuration

### RapidAPI APIs Used

All these APIs use the **same RapidAPI key**:

#### 1. Redfin API (Primary)
- **Purpose**: Property details, market stats, address autocomplete
- **Endpoint**: `redfin-com-data.p.rapidapi.com`
- **Free Tier**: Yes
- **Usage**: Property search, market analysis, autocomplete

#### 2. Zillow API (Backup)
- **Purpose**: Additional property data
- **Endpoint**: `zillow-com1.p.rapidapi.com`
- **Free Tier**: Limited
- **Usage**: Fallback when Redfin data unavailable

#### 3. Realty Mole Property API
- **Purpose**: Rental price estimates
- **Endpoint**: `realty-mole-property-api.p.rapidapi.com`
- **Free Tier**: Yes
- **Usage**: Monthly rent estimates

#### 4. Census API (Optional)
- **Purpose**: Demographics data
- **Endpoint**: `api.census.gov`
- **Free Tier**: Yes (unlimited)
- **Usage**: Population, median income, unemployment

## 💡 Investment Metrics Explained

- **Cap Rate**: 4%+ Fair, 6%+ Good, 8%+ Excellent
- **Cash-on-Cash Return**: 5%+ Fair, 8%+ Good, 12%+ Excellent
- **DSCR**: >1.0 Required, >1.25 Ideal
- **IRR**: 8%+ Fair, 12%+ Good, 15%+ Excellent
- **GRM**: <12 Good, <15 Fair, >15 High

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Recharts
- Axios
- RapidAPI
- Census API

## 📦 Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze/      # Property analysis endpoint
│   │   ├── autocomplete/ # Address suggestions
│   │   └── market/       # Market analysis endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── PropertySearch.tsx           # Dual-mode search with autocomplete
│   ├── PropertyAnalysisReport.tsx   # Property results
│   ├── MarketAnalysisReport.tsx     # Market results
│   └── tabs/                        # Analysis tabs
├── lib/
│   ├── apiService.ts               # RapidAPI integration
│   ├── analysisService.ts          # Analysis logic
│   └── investmentAnalyzer.ts       # Financial calculations
└── types/
    └── index.ts                    # TypeScript definitions
```

## 🔍 Data Flow

### Property Search:
1. RapidAPI Redfin → Property data (price, beds, baths, sqft)
2. RapidAPI Zillow → Backup property data (if Redfin fails)
3. RapidAPI Realty Mole → Rental estimates
4. Census API → Demographics
5. RapidAPI Redfin → Comparables
6. Calculate → Investment analysis

### Zipcode Search:
1. Census API → Demographics
2. RapidAPI Redfin → Market stats
3. RapidAPI Redfin → Property listings
4. Calculate → Market metrics & opportunities

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables:
   - `RAPIDAPI_KEY` (required)
   - `CENSUS_API_KEY` (optional)
4. Deploy!

## 💰 API Costs

### RapidAPI
- **One key** works for all three APIs!

### Census API
- **Completely Free**: Unlimited requests

## 📝 License

MIT License - Free for personal and commercial use
