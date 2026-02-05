// County mapping and geo data
const MANUAL_COUNTY_MAP = {
  '98275': 'Snohomish',
  '98012': 'Snohomish',
  '98208': 'Snohomish',
  '98052': 'King',
  '98103': 'King',
  '98004': 'King',
  '98033': 'King',
  '98402': 'Pierce',
  '98391': 'Pierce',
  '98682': 'Clark',
};

const GEO_DATA = {
  King: {
    tax: 0.0094,
    growth: 0.045,
    lot_pps: 75,
    niche: 0.6,
    school_premium: 1.08,
    walkability_factor: 1.05,
    job_proximity: 1.12,
    crime_discount: 0.98,
    transit_premium: 1.06,
    county_premium: 1.15,
  },
  Snohomish: {
    tax: 0.0089,
    growth: 0.042,
    lot_pps: 40,
    niche: 0.4,
    school_premium: 1.04,
    walkability_factor: 1.02,
    job_proximity: 1.06,
    crime_discount: 0.99,
    transit_premium: 1.03,
    county_premium: 1.08,
  },
  Pierce: {
    tax: 0.0102,
    growth: 0.038,
    lot_pps: 25,
    niche: 0.2,
    school_premium: 1.02,
    walkability_factor: 1.01,
    job_proximity: 1.03,
    crime_discount: 0.97,
    transit_premium: 1.02,
    county_premium: 1.0,
  },
  Clark: {
    tax: 0.0091,
    growth: 0.04,
    lot_pps: 28,
    niche: 0.3,
    school_premium: 1.03,
    walkability_factor: 1.02,
    job_proximity: 1.04,
    crime_discount: 0.98,
    transit_premium: 1.02,
    county_premium: 1.03,
  },
  Default: {
    tax: 0.0092,
    growth: 0.04,
    lot_pps: 35,
    niche: 0.0,
    school_premium: 1.0,
    walkability_factor: 1.0,
    job_proximity: 1.0,
    crime_discount: 1.0,
    transit_premium: 1.0,
    county_premium: 1.0,
  },
};

// Advanced age depreciation model
function calculateAdvancedAgeFactor(yearBuilt, condition, sqft, county) {
  const age = 2026 - yearBuilt;
  const gd = GEO_DATA[county] || GEO_DATA.Default;

  if (age <= 5) {
    if (['New/Luxury', 'Renovated'].includes(condition)) {
      return 1.12 - age * 0.015;
    }
    return 1.08 - age * 0.012;
  } else if (age <= 15) {
    const baseFactor = ['New/Luxury', 'Renovated'].includes(condition) ? 1.05 : 0.98;
    return baseFactor - age * 0.003;
  } else if (age <= 30) {
    if (condition === 'Renovated') {
      return 1.02 - (age - 15) * 0.008;
    } else if (['Well Maintained', 'New/Luxury'].includes(condition)) {
      return 0.95 - (age - 15) * 0.012;
    } else {
      return 0.88 - (age - 15) * 0.015;
    }
  } else if (age <= 50) {
    if (condition === 'Renovated') {
      return 0.9 - (age - 30) * 0.006;
    } else if (condition === 'Well Maintained') {
      return 0.75 - (age - 30) * 0.008;
    } else {
      return 0.65 - (age - 30) * 0.01;
    }
  } else {
    if (['Renovated', 'New/Luxury'].includes(condition)) {
      return 0.85;
    } else if (condition === 'Well Maintained') {
      return 0.68;
    } else {
      return Math.max(0.5, 0.6 - (age - 50) * 0.005);
    }
  }
}

// Dynamic PPSF calculation
function calculateDynamicPPSF(basePPSF, sqft, county) {
  let ppsf_multiplier;

  if (sqft < 1000) {
    ppsf_multiplier = 1.18;
  } else if (sqft < 1500) {
    ppsf_multiplier = 1.1;
  } else if (sqft < 2000) {
    ppsf_multiplier = 1.05;
  } else if (sqft < 2500) {
    ppsf_multiplier = 1.0;
  } else if (sqft < 3500) {
    ppsf_multiplier = 0.96;
  } else if (sqft < 5000) {
    ppsf_multiplier = 0.92;
  } else {
    ppsf_multiplier = 0.88;
  }

  return basePPSF * ppsf_multiplier;
}

// Bedroom/bathroom value calculation
function calculateBedroomBathroomValue(beds, baths, sqft, county) {
  const expectedBeds = Math.max(2, Math.min(5, Math.floor(sqft / 500)));
  const expectedBaths = Math.max(1.5, Math.min(4, Math.floor(sqft / 700)));

  const baseBedValue = county === 'King' ? 35000 : county === 'Snohomish' ? 28000 : 22000;
  const baseBathValue = county === 'King' ? 25000 : county === 'Snohomish' ? 20000 : 16000;

  const bedDeviation = beds - expectedBeds;
  const bathDeviation = baths - expectedBaths;

  let bedValue;
  if (bedDeviation > 1) {
    bedValue = beds * baseBedValue * 0.85;
  } else if (bedDeviation > 0) {
    bedValue = beds * baseBedValue * 0.95;
  } else {
    bedValue = beds * baseBedValue;
  }

  let bathValue;
  if (bathDeviation > 0.5) {
    bathValue = baths * baseBathValue * 0.9;
  } else {
    bathValue = baths * baseBathValue;
  }

  return bedValue + bathValue;
}

// Main valuation engine
export function valuationEngineV6(inputs, marketStats, sentimentData) {
  const { zipCode, propertyType, condition, sqft, lotSize, bedrooms, bathrooms, yearBuilt } = inputs;

  // Determine county
  let countyKey = MANUAL_COUNTY_MAP[zipCode];
  if (!countyKey) {
    countyKey = 'King'; // Default
  }
  const gd = GEO_DATA[countyKey] || GEO_DATA.Default;

  // Get market stats
  let m_ppsf = 465;
  let m_s2l = 1.0;
  let m_inv = 2.5;

  if (marketStats && marketStats[zipCode]) {
    const row = marketStats[zipCode];
    m_ppsf = row.median_ppsf || 465;
    m_s2l = row.sale_to_list_ratio || 1.0;
    m_inv = row.months_of_supply || 2.5;
  }

  // Calculate components
  const adjustedPPSF = calculateDynamicPPSF(m_ppsf, sqft, countyKey);
  const ageFactor = calculateAdvancedAgeFactor(yearBuilt, condition, sqft, countyKey);

  // Sentiment and market momentum
  const sentiment = sentimentData?.[zipCode]?.sentiment || 0.02;
  const sentimentNews = sentimentData?.[zipCode]?.news || [];

  const supplyPressure = Math.max(0, (3.5 - m_inv) * 0.04);
  const demandHeat = (m_s2l - 0.97) * 1.5;
  const sentimentBoost = sentiment * 0.12;
  let marketMomentum = 1.0 + supplyPressure + demandHeat + sentimentBoost;
  marketMomentum = Math.max(0.85, Math.min(1.25, marketMomentum));

  // Condition factor
  const condFactorMap = {
    'New/Luxury': 1.15,
    Renovated: 1.08,
    'Well Maintained': 1.0,
    Original: 0.91,
    'Fixer-upper': 0.79,
  };
  const condFactor = condFactorMap[condition] || 1.0;

  // Base valuation
  const sqftValue = sqft * adjustedPPSF;
  const bedBathValue = calculateBedroomBathroomValue(bedrooms, bathrooms, sqft, countyKey);

  // Lot premium (non-linear)
  let lotPremium = 0;
  if (lotSize <= 4000) {
    lotPremium = 0;
  } else if (lotSize <= 8000) {
    lotPremium = (lotSize - 4000) * gd.lot_pps * 0.85;
  } else if (lotSize <= 15000) {
    lotPremium = 4000 * gd.lot_pps * 0.85 + (lotSize - 8000) * gd.lot_pps * 0.65;
  } else {
    lotPremium =
      4000 * gd.lot_pps * 0.85 + 7000 * gd.lot_pps * 0.65 + (lotSize - 15000) * gd.lot_pps * 0.45;
  }

  // Assemble base value
  const baseVal = sqftValue + bedBathValue + lotPremium;

  // Apply multipliers
  let finalVal = baseVal * ageFactor * marketMomentum * condFactor;

  // Micro-market adjustments
  finalVal *= gd.school_premium;
  finalVal *= gd.walkability_factor;
  finalVal *= gd.job_proximity;
  finalVal *= gd.crime_discount;
  finalVal *= gd.transit_premium;

  // Property type adjustment
  if (propertyType === 'Townhome') {
    finalVal *= 0.91;
  }

  // Confidence interval
  const confidenceRange = 0.03;
  const lowBound = finalVal * (1 - confidenceRange);
  const highBound = finalVal * (1 + confidenceRange);

  // Rental estimate
  const age = 2026 - yearBuilt;
  const rentBaseMultiplier = { 1: 1.28, 2: 1.18, 3: 1.0, 4: 1.15, 5: 1.35 }[bedrooms] || 1.0;
  const conditionRentBoost = {
    'New/Luxury': 1.15,
    Renovated: 1.08,
    'Well Maintained': 1.0,
    Original: 0.94,
    'Fixer-upper': 0.85,
  }[condition] || 1.0;
  const rentEst = sqft * 2.45 * rentBaseMultiplier * conditionRentBoost;

  // Investment metrics
  const propertyTax = finalVal * gd.tax;
  const insurance = finalVal * 0.003;
  const maint = finalVal * (age < 15 || condition === 'Renovated' ? 0.006 : 0.015);
  const hoa = propertyType === 'Single Family House' ? 0 : 250;

  const annualExpenses = propertyTax + insurance + maint + hoa * 12;
  const netYield = ((rentEst * 12 - annualExpenses) / finalVal) * 100;

  // 5-year forecast
  const baseGrowth = gd.growth;
  const sentimentGrowthBoost = sentiment * 0.015;
  const effectiveGrowth = baseGrowth + sentimentGrowthBoost;
  const prices5y = [0, 1, 2, 3, 4, 5].map((i) => finalVal * Math.pow(1 + effectiveGrowth, i));

  // Grade
  let grade;
  if (netYield > 4.5) grade = 'A+';
  else if (netYield > 3.5) grade = 'A';
  else if (netYield > 2.5) grade = 'B+';
  else grade = 'B';

  return {
    prices: prices5y,
    range: [lowBound, highBound],
    rent: rentEst,
    tax: propertyTax,
    insurance: insurance,
    maintenance: maint,
    hoa: hoa,
    grade: grade,
    yield: netYield,
    school: Math.floor(7.5 + gd.niche),
    inv: m_inv,
    s2l: m_s2l,
    county: countyKey,
    conf: 96.0,
    news: sentimentNews,
    model_type: 'Rule-Based',
    ml_available: false,
    ml_value: null,
    rule_value: finalVal,
    zipCode: zipCode,
    condition: condition,
    yearBuilt: yearBuilt,
  };
}
