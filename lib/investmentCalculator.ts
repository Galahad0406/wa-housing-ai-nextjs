const investmentCalculator = {
  calculate(price: number, monthlyRent: number) {
    if (!price || price <= 0) {
      throw new Error('Invalid property price')
    }

    if (!monthlyRent || monthlyRent <= 0) {
      throw new Error('Invalid monthly rent')
    }

    const annualRent = monthlyRent * 12
    const expenses = price * 0.015 // 1.5% of property value for annual expenses
    const net = annualRent - expenses
    const roi = (net / price) * 100

    return {
      annualRent: Math.round(annualRent),
      expenses: Math.round(expenses),
      net: Math.round(net),
      roi: Number(roi.toFixed(2))
    }
  }
}

export default investmentCalculator
