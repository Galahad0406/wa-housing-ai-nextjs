# Real Estate Forecast AI

AI-powered real estate investment analyzer built with Next.js

## Features

- Property value analysis
- Rental income estimation
- ROI calculation
- 5-year growth projection
- Census data integration

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory and add your API keys:
```
RENTCAST_API_KEY=your_rentcast_api_key
CENSUS_API_KEY=your_census_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## API Keys

- **RentCast API**: Get your key from https://app.rentcast.io/
- **Census API**: Get your key from https://api.census.gov/data/key_signup.html

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## Technologies

- Next.js 14
- React 18
- TypeScript
- Recharts
- RentCast API
- Census API
