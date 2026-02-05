'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Box, CircularProgress } from '@mui/material';
import Calculator from '../components/Calculator';
import ResultsDisplay from '../components/ResultsDisplay';
import { valuationEngineV6 } from '../lib/valuation';

export default function Home() {
  const [results, setResults] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load market data and sentiment data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Load sentiment data (market_cache.json)
        const sentimentRes = await fetch(
          'https://raw.githubusercontent.com/seattle-housing-ai/seattle-housing-ai/main/market_cache.json'
        );
        const sentiment = await sentimentRes.json();
        setSentimentData(sentiment);

        // Load market data (wa_market_data.csv)
        const marketRes = await fetch(
          'https://raw.githubusercontent.com/seattle-housing-ai/seattle-housing-ai/main/wa_market_data.csv'
        );
        const csvText = await marketRes.text();

        // Parse CSV (simple parser for this use case)
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const marketStats = {};

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].split(',');
          if (line.length < headers.length) continue;

          const zipMatch = line[1]?.match(/(\d{5})/);
          if (!zipMatch) continue;

          const zip = zipMatch[1];
          const periodEnd = line[0];

          // Only keep latest data per ZIP
          const existing = marketStats[zip];
          if (!existing || periodEnd > existing.period_end) {
            marketStats[zip] = {
              period_end: periodEnd,
              median_ppsf: parseFloat(line[5]) || 465,
              sale_to_list_ratio: parseFloat(line[6]) || 1.0,
              months_of_supply: parseFloat(line[7]) || 2.5,
            };
          }
        }

        setMarketData(marketStats);
        setLoading(false);

        // Calculate initial results with default inputs
        const defaultInputs = {
          zipCode: '98275',
          propertyType: 'Single Family House',
          condition: 'Well Maintained',
          sqft: 1406,
          lotSize: 5000,
          bedrooms: 3,
          bathrooms: 2.5,
          yearBuilt: 2006,
        };

        const initialResults = valuationEngineV6(defaultInputs, marketStats, sentiment);
        setResults(initialResults);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleCalculate = (inputs) => {
    if (!marketData || !sentimentData) return;

    const newResults = valuationEngineV6(inputs, marketData, sentimentData);
    setResults(newResults);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left sidebar - Calculator */}
        <Grid item xs={12} md={4} lg={3}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Calculator onCalculate={handleCalculate} />
          </Box>
        </Grid>

        {/* Main content - Results */}
        <Grid item xs={12} md={8} lg={9}>
          <ResultsDisplay results={results} />
        </Grid>
      </Grid>
    </Container>
  );
}
