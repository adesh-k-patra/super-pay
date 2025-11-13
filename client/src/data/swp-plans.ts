export const swpPlans = [
  {
    id: "hdfc-swp",
    name: "HDFC Balanced Advantage SWP",
    fundHouse: "HDFC Mutual Fund",
    category: "Hybrid",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Quarterly"],
    nav: 245.80,
    rating: 4.8,
    returns1y: 12.5,
    returns3y: 14.2,
    returns5y: 13.8,
    features: ["Tax Efficient", "Flexible Withdrawal", "Auto-Rebalancing", "Low Expense Ratio"],
    logo: "💰"
  },
  {
    id: "icici-swp",
    name: "ICICI Prudential Equity & Debt SWP",
    fundHouse: "ICICI Prudential MF",
    category: "Balanced Hybrid",
    minWithdrawal: 500,
    frequency: ["Monthly", "Quarterly", "Annual"],
    nav: 198.45,
    rating: 4.7,
    returns1y: 11.8,
    returns3y: 13.5,
    returns5y: 12.9,
    features: ["Regular Income", "Capital Appreciation", "Diversified Portfolio", "Professional Management"],
    logo: "📊"
  },
  {
    id: "sbi-swp",
    name: "SBI Conservative Hybrid SWP",
    fundHouse: "SBI Mutual Fund",
    category: "Conservative Hybrid",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Quarterly"],
    nav: 156.90,
    rating: 4.6,
    returns1y: 10.5,
    returns3y: 11.8,
    returns5y: 11.2,
    features: ["Low Risk", "Steady Withdrawals", "Capital Protection Focus", "Debt Heavy"],
    logo: "🏦"
  }
];

export function getSWPPlan(id: string) {
  return swpPlans.find(plan => plan.id === id);
}
