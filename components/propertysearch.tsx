// components/PropertySearch.js
'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function PropertySearch({ onResults }) {
  const [searchType, setSearchType] = useState('zipcode');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [lotSize, setLotSize] = useState(7500);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2.5);
  const [propertyType, setPropertyType] = useState('house');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setLoading(true);

    try {
      let url;
      
      if (searchType === 'zipcode') {
        if (!/^\d{5}$/.test(zipcode)) {
          setError('Please enter a valid 5-digit zipcode');
          setLoading(false);
          return;
        }
        url = `/api/zipcode?zipcode=${zipcode}`;
      } else {
        if (!address || address.length < 10) {
          setError('Please enter a complete address');
          setLoading(false);
          return;
        }
        url = `/api/property?address=${encodeURIComponent(address)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      // Enhance data with user inputs if searching by zipcode
      if (searchType === 'zipcode') {
        data.userInputs = {
          lotSize,
          bedrooms,
          bathrooms,
          propertyType
        };
      }

      onResults(data, searchType);
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Property Details Search
        </Typography>

        {/* Search Type Toggle */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={searchType}
            exclusive
            onChange={(e, value) => value && setSearchType(value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="zipcode">
              <HomeIcon sx={{ mr: 1 }} />
              Search by Zipcode (Area Average)
            </ToggleButton>
            <ToggleButton value="address">
              <ApartmentIcon sx={{ mr: 1 }} />
              Search by Address (Specific Property)
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Search Input */}
        {searchType === 'zipcode' ? (
          <Box>
            <TextField
              fullWidth
              label="Zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="98052"
              sx={{ mb: 3 }}
              helperText="Enter a 5-digit Washington State zipcode"
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Property Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={propertyType}
                    label="Property Type"
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <MenuItem value="house">Single Family House</MenuItem>
                    <MenuItem value="townhome">Townhome / Condo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Lot Size */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Lot Size: {lotSize.toLocaleString()} sq ft
                </Typography>
                <Slider
                  value={lotSize}
                  onChange={(e, value) => setLotSize(value)}
                  min={2000}
                  max={20000}
                  step={500}
                  marks={[
                    { value: 2000, label: '2k' },
                    { value: 10000, label: '10k' },
                    { value: 20000, label: '20k' }
                  ]}
                />
              </Grid>

              {/* Bedrooms */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Bedrooms: {bedrooms}
                </Typography>
                <Slider
                  value={bedrooms}
                  onChange={(e, value) => setBedrooms(value)}
                  min={1}
                  max={7}
                  step={1}
                  marks
                />
              </Grid>

              {/* Bathrooms */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Bathrooms: {bathrooms}
                </Typography>
                <Slider
                  value={bathrooms}
                  onChange={(e, value) => setBathrooms(value)}
                  min={1}
                  max={5}
                  step={0.5}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2.5, label: '2.5' },
                    { value: 5, label: '5' }
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <TextField
            fullWidth
            label="Property Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Seattle, WA 98101"
            sx={{ mb: 3 }}
            helperText="Enter the complete property address"
          />
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSearch}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
        >
          {loading ? 'Searching...' : 'Analyze Property'}
        </Button>

        {/* Info Chips */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Redfin Data Accuracy"
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label="Real-time Market Data"
            size="small"
            color="success"
            variant="outlined"
          />
          <Chip
            label="School Ratings"
            size="small"
            color="info"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
