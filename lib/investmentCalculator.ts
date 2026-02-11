const investmentCalculator = {

  calculateROI(price: number, monthlyRent: number) {
    const annualRent = monthlyRent * 12
    const expenses = price * 0.015
    const netIncome = annualRent - expenses
    const roi = (netIncome / price) * 100

    return {
      annualRent,
      expenses: Math.round(expenses),
      netIncome: Math.round(netIncome),
      roi: Number(roi.toFixed(2))
    }
  }

}

export default investmentCalculator
