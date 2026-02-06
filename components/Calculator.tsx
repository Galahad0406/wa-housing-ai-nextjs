'use client';

import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Box,
  Paper,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function Calculator({ onCalculate }) {
  const [inputs, setInputs] = useState({
    zipCode: '98275',
    propertyType: 'Single Family House',
    condition: 'Well Maintained',
    sqft: 1406,
    lotSize: 5000,
    bedrooms: 3,
    bathrooms: 2.5,
    yearBuilt: 2006,
  });

  // Update parent component whenever inputs change
  const handleChange = (field, value) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    onCalculate(newInputs);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <HomeIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Property Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* ZIP Code */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={inputs.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              variant="outlined"
            />
          </Grid>

          {/* Property Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={inputs.propertyType}
                label="Property Type"
                onChange={(e) => handleChange('propertyType', e.target.value)}
              >
                <MenuItem value="Single Family House">Single Family House</MenuItem>
                <MenuItem value="Townhome">Townhome</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Condition */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Interior Condition</InputLabel>
              <Select
                value={inputs.condition}
                label="Interior Condition"
                onChange={(e) => handleChange('condition', e.target.value)}
              >
                <MenuItem value="New/Luxury">New/Luxury</MenuItem>
                <MenuItem value="Renovated">Renovated</MenuItem>
                <MenuItem value="Well Maintained">Well Maintained</MenuItem>
                <MenuItem value="Original">Original</MenuItem>
                <MenuItem value="Fixer-upper">Fixer-upper</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Square Footage */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Living Area (Sqft)"
              value={inputs.sqft}
              onChange={(e) => handleChange('sqft', parseInt(e.target.value) || 0)}
              variant="outlined"
            />
          </Grid>

          {/* Lot Size */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Lot Size (Sqft)"
              value={inputs.lotSize}
              onChange={(e) => handleChange('lotSize', parseInt(e.target.value) || 0)}
              variant="outlined"
            />
          </Grid>

          {/* Bedrooms Slider */}
          <Grid item xs={12}>
            <Typography gutterBottom>Bedrooms: {inputs.bedrooms}</Typography>
            <Slider
              value={inputs.bedrooms}
              onChange={(e, value) => handleChange('bedrooms', value)}
              min={1}
              max={8}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Bathrooms Slider */}
          <Grid item xs={12}>
            <Typography gutterBottom>Bathrooms: {inputs.bathrooms}</Typography>
            <Slider
              value={inputs.bathrooms}
              onChange={(e, value) => handleChange('bathrooms', value)}
              min={1}
              max={6}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Year Built */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Year Built"
              value={inputs.yearBuilt}
              onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value) || 2000)}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
