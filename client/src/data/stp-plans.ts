export const stpPlans = [
  {
    id: "hdfc-stp",
    name: "HDFC Liquid to Equity STP",
    fundHouse: "HDFC Mutual Fund",
    fromFund: "HDFC Liquid Fund",
    toFund: "HDFC Top 100 Fund",
    category: "Liquid to Equity",
    minTransfer: 500,
    frequency: ["Daily", "Weekly", "Monthly"],
    rating: 4.8,
    features: ["Rupee Cost Averaging", "Risk Mitigation", "Auto Transfer", "Market Timing"],
    logo: "🔄"
  },
  {
    id: "icici-stp",
    name: "ICICI Debt to Equity STP",
    fundHouse: "ICICI Prudential MF",
    fromFund: "ICICI Ultra Short Term",
    toFund: "ICICI Bluechip Fund",
    category: "Debt to Equity",
    minTransfer: 1000,
    frequency: ["Weekly", "Monthly"],
    rating: 4.7,
    features: ["Gradual Entry", "Lower Risk", "Flexible Frequency", "Tax Efficient"],
    logo: "💹"
  },
  {
    id: "sbi-stp",
    name: "SBI Liquid to Hybrid STP",
    fundHouse: "SBI Mutual Fund",
    fromFund: "SBI Liquid Fund",
    toFund: "SBI Equity Hybrid Fund",
    category: "Liquid to Hybrid",
    minTransfer: 500,
    frequency: ["Daily", "Monthly"],
    rating: 4.6,
    features: ["Safe Entry", "Balanced Approach", "Systematic Transfer", "Cost Averaging"],
    logo: "🎯"
  }
];

export function getSTPPlan(id: string) {
  return stpPlans.find(plan => plan.id === id);
}
