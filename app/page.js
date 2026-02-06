'use client';

import { useState, useEffect } from 'react';

// 1. 데이터 및 계산 로직 (수정 불필요)
const COUNTY_MAP: { [key: string]: string } = {
  '98275': 'Snohomish', '98012': 'Snohomish', '98208': 'Snohomish',
  '98052': 'King', '98103': 'King', '98004': 'King', '98033': 'King',
  '98402': 'Pierce', '98391': 'Pierce', '98682': 'Clark',
};

const GEO_DATA: { [key: string]: any } = {
  King: { tax: 0.0094, growth: 0.045, lot_pps: 75, premium: 1.15 },
  Snohomish: { tax: 0.0089, growth: 0.042, lot_pps: 40, premium: 1.08 },
  Pierce: { tax: 0.0102, growth: 0.038, lot_pps: 25, premium: 1.00 },
  Clark: { tax: 0.0091, growth: 0.040, lot_pps: 28, premium: 1.03 },
  Default: { tax: 0.0092, growth: 0.040, lot_pps: 35, premium: 1.00 },
};

function calculateValue(inputs: any) {
  const { zipCode, sqft, lotSize, bedrooms, bathrooms, yearBuilt, propertyType, condition } = inputs;
  const county = COUNTY_MAP[zipCode] || 'King';
  const gd = GEO_DATA[county] || GEO_DATA.Default;
  
  const basePPSF = county === 'King' ? 520 : county === 'Snohomish' ? 465 : county === 'Pierce' ? 380 : 450;
  let ppsf = basePPSF;
  if (sqft < 1000) ppsf *= 1.18;
  else if (sqft < 1500) ppsf *= 1.10;
  else if (sqft < 2000) ppsf *= 1.05;
  else if (sqft < 3500) ppsf *= 0.96;
  else ppsf *= 0.88;

  const age = 2026 - yearBuilt;
  let ageFactor = 1.0;
  if (age <= 5) ageFactor = 1.10 - (age * 0.015);
  else if (age <= 15) ageFactor = 1.05 - (age * 0.003);
  else if (age <= 30) ageFactor = 0.95 - ((age - 15) * 0.010);
  else ageFactor = 0.75 - ((age - 30) * 0.008);

  const condFactors: any = { 'New/Luxury': 1.15, 'Renovated': 1.08, 'Well Maintained': 1.00, 'Original': 0.91, 'Fixer-upper': 0.79 };
  const condFactor = condFactors[condition] || 1.0;
  
  const bedValue = bedrooms * (county === 'King' ? 35000 : county === 'Snohomish' ? 28000 : 22000);
  const bathValue = bathrooms * (county === 'King' ? 25000 : county === 'Snohomish' ? 20000 : 16000);
  
  let lotPremium = 0;
  if (lotSize > 4000) {
    if (lotSize <= 8000) lotPremium = (lotSize - 4000) * gd.lot_pps * 0.85;
    else lotPremium = (4000 * gd.lot_pps * 0.85) + ((lotSize - 8000) * gd.lot_pps * 0.65);
  }

  const baseValue = (sqft * ppsf) + bedValue + bathValue + lotPremium;
  let finalValue = baseValue * ageFactor * condFactor * gd.premium;
  if (propertyType === 'Townhome') finalValue *= 0.91;

  const rentMultiplier: any = { 1: 1.28, 2: 1.18, 3: 1.00, 4: 1.15, 5: 1.35 };
  const rentEst = sqft * 2.45 * (rentMultiplier[bedrooms] || 1.0) * Math.sqrt(condFactor);
  
  const prices = [];
  for (let i = 0; i <= 5; i++) {
    prices.push(finalValue * Math.pow(1 + gd.growth, i));
  }

  return {
    value: finalValue,
    low: finalValue * 0.97,
    high: finalValue * 1.03,
    rent: rentEst,
    tax: finalValue * gd.tax,
    netYield: ((rentEst * 12 - (finalValue * gd.tax) - (finalValue * 0.013)) / finalValue) * 100,
    prices,
    county
  };
}

// 2. 메인 화면 컴포넌트
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState({
    zipCode: '98275', sqft: 1406, lotSize: 5000, bedrooms: 3, bathrooms: 2.5, yearBuilt: 2006, propertyType: 'Single Family House', condition: 'Well Maintained'
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCalculate = () => {
    setResult(calculateValue(inputs));
  };

  const fmt = (val: number) => '$' + Math.round(val).toLocaleString();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', color: '#fff', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>🏠 WA Real Estate AI Calculator</h1>
        <p style={{ color: '#94a3b8' }}>Professional Valuation for Washington State</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {/* 입력 섹션 */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Property Details</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>ZIP Code</label>
              <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} 
                value={inputs.zipCode} onChange={(e) => setInputs({...inputs, zipCode: e.target.value})} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>Sqft</label>
                <input type="number" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} 
                  value={inputs.sqft} onChange={(e) => setInputs({...inputs, sqft: Number(e.target.value)})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>Year Built</label>
                <input type="number" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }} 
                  value={inputs.yearBuilt} onChange={(e) => setInputs({...inputs, yearBuilt: Number(e.target.value)})} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>Condition</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                value={inputs.condition} onChange={(e) => setInputs({...inputs, condition: e.target.value})}>
                <option>New/Luxury</option>
                <option>Renovated</option>
                <option>Well Maintained</option>
                <option>Original</option>
                <option>Fixer-upper</option>
              </select>
            </div>

            <button onClick={handleCalculate} style={{ marginTop: '10px', width: '100%', padding: '16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Calculate Results
            </button>
          </div>
        </div>

        {/* 결과 섹션 */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px' }}>
          {!result ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center', border: '2px dashed #334155', borderRadius: '12px' }}>
              <p>Enter property info and<br/>click calculate to see AI valuation</p>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#3b82f6' }}>Valuation Analysis</h2>
              <div style={{ marginBottom: '25px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8' }}>Estimated Market Value</span>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff' }}>{fmt(result.value)}</div>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Range: {fmt(result.low)} - {fmt(result.high)}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ padding: '15px', backgroundColor: '#0f172a', borderRadius: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Monthly Rent</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{fmt(result.rent)}</div>
                </div>
                <div style={{ padding: '15px', backgroundColor: '#0f172a', borderRadius: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Net Yield</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{result.netYield.toFixed(2)}%</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#334155', borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', marginBottom: '5px' }}>5-Year Future Value</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{fmt(result.prices[5])}</div>
                <div style={{ fontSize: '12px', color: '#10b981' }}>▲ Projected Growth</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
