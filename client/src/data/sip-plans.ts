// Comprehensive SIP Plans Data

export interface SIPPlan {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  minSipAmount: number;
  recommendedAmount: number;
  frequency: string[];
  returns1y: number;
  returns3y: number;
  returns5y: number;
  riskLevel: string;
  rating: number;
  navPrice: number;
  aum: string;
  expenseRatio: number;
  lockInPeriod: string;
  taxBenefit: boolean;
  autoDebit: boolean;
  description: string;
  benefits: string[];
  idealFor: string[];
  topHoldings: { name: string; percentage: number; }[];
  fundManager: {
    name: string;
    experience: string;
    expertise: string;
  };
}

export const SIP_PLANS: SIPPlan[] = [
  {
    id: "sip-1",
    name: "Axis Bluechip SIP",
    fundHouse: "Axis Mutual Fund",
    category: "Large Cap Equity",
    minSipAmount: 500,
    recommendedAmount: 5000,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 18.4,
    returns3y: 19.8,
    returns5y: 17.2,
    riskLevel: "Moderate",
    rating: 5,
    navPrice: 52.35,
    aum: "₹32,567 Cr",
    expenseRatio: 0.98,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Invest systematically in quality large-cap stocks with proven track record of consistent returns",
    benefits: [
      "Disciplined wealth creation through rupee cost averaging",
      "Lower risk compared to mid and small-cap funds",
      "Professional fund management by experienced team",
      "Flexibility to pause, stop, or increase SIP amount",
      "Ideal for long-term wealth creation"
    ],
    idealFor: [
      "First-time mutual fund investors",
      "Conservative investors seeking steady returns",
      "Long-term wealth creation goals",
      "Retirement planning"
    ],
    topHoldings: [
      { name: "HDFC Bank", percentage: 8.5 },
      { name: "ICICI Bank", percentage: 7.2 },
      { name: "Infosys", percentage: 6.8 },
      { name: "Reliance Industries", percentage: 6.5 }
    ],
    fundManager: {
      name: "Shreyash Devalkar",
      experience: "15+ years",
      expertise: "Large-cap equity investing"
    }
  },
  {
    id: "sip-2",
    name: "Parag Parikh Flexi Cap SIP",
    fundHouse: "PPFAS Mutual Fund",
    category: "Flexi Cap Equity",
    minSipAmount: 1000,
    recommendedAmount: 10000,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 22.5,
    returns3y: 24.3,
    returns5y: 20.8,
    riskLevel: "Moderate to High",
    rating: 5,
    navPrice: 67.84,
    aum: "₹45,234 Cr",
    expenseRatio: 0.82,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Unique global diversification with exposure to both Indian and international equities",
    benefits: [
      "Exposure to 25-35% international stocks",
      "Contrarian investment approach",
      "Low expense ratio of 0.82%",
      "Currency diversification benefits",
      "Strong long-term track record"
    ],
    idealFor: [
      "Investors seeking global exposure",
      "Those with 5+ year investment horizon",
      "Wealth creation with diversification",
      "Tax-efficient long-term gains"
    ],
    topHoldings: [
      { name: "Alphabet (Google)", percentage: 6.2 },
      { name: "HDFC Bank", percentage: 5.8 },
      { name: "Microsoft", percentage: 4.9 },
      { name: "Bajaj Holdings", percentage: 4.5 }
    ],
    fundManager: {
      name: "Rajeev Thakkar",
      experience: "20+ years",
      expertise: "Value investing & global markets"
    }
  },
  {
    id: "sip-3",
    name: "Mirae Asset Emerging Bluechip SIP",
    fundHouse: "Mirae Asset Mutual Fund",
    category: "Large & Mid Cap",
    minSipAmount: 1000,
    recommendedAmount: 7500,
    frequency: ["Monthly", "Quarterly", "Weekly"],
    returns1y: 24.8,
    returns3y: 26.5,
    returns5y: 22.3,
    riskLevel: "Moderate to High",
    rating: 5,
    navPrice: 98.45,
    aum: "₹28,765 Cr",
    expenseRatio: 1.15,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Invest in tomorrow's leaders with balanced exposure to large and mid-cap companies",
    benefits: [
      "Identifies future large-caps early",
      "Balanced portfolio across market caps",
      "Strong downside protection",
      "Excellent track record of alpha generation",
      "Suitable for aggressive growth seekers"
    ],
    idealFor: [
      "Investors with moderate risk appetite",
      "Those seeking capital appreciation",
      "SIP investors with 7+ year horizon",
      "Building retirement corpus"
    ],
    topHoldings: [
      { name: "ICICI Bank", percentage: 7.2 },
      { name: "Bajaj Finance", percentage: 6.5 },
      { name: "Titan Company", percentage: 5.8 },
      { name: "SBI Life Insurance", percentage: 5.2 }
    ],
    fundManager: {
      name: "Neelesh Surana",
      experience: "18+ years",
      expertise: "Multi-cap investing"
    }
  },
  {
    id: "sip-4",
    name: "HDFC Mid Cap Opportunities SIP",
    fundHouse: "HDFC Mutual Fund",
    category: "Mid Cap Equity",
    minSipAmount: 500,
    recommendedAmount: 8000,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 26.5,
    returns3y: 28.3,
    returns5y: 24.8,
    riskLevel: "High",
    rating: 5,
    navPrice: 128.90,
    aum: "₹38,567 Cr",
    expenseRatio: 1.10,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "High-growth potential through systematic investment in quality mid-cap companies",
    benefits: [
      "Legendary fund manager with 15+ year track record",
      "Several multi-bagger stocks in portfolio",
      "Focus on quality and corporate governance",
      "Ideal for wealth multiplication",
      "SIP helps manage mid-cap volatility"
    ],
    idealFor: [
      "Aggressive investors seeking high returns",
      "Those with 10+ year investment horizon",
      "Building education or marriage corpus",
      "Experienced mutual fund investors"
    ],
    topHoldings: [
      { name: "Tube Investments", percentage: 5.2 },
      { name: "Persistent Systems", percentage: 4.8 },
      { name: "Coforge", percentage: 4.5 },
      { name: "Max Healthcare", percentage: 4.2 }
    ],
    fundManager: {
      name: "Chirag Setalvad",
      experience: "17+ years",
      expertise: "Mid-cap stock selection"
    }
  },
  {
    id: "sip-5",
    name: "SBI Small Cap SIP",
    fundHouse: "SBI Mutual Fund",
    category: "Small Cap Equity",
    minSipAmount: 500,
    recommendedAmount: 5000,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 28.5,
    returns3y: 32.8,
    returns5y: 27.5,
    riskLevel: "Very High",
    rating: 4,
    navPrice: 92.35,
    aum: "₹15,234 Cr",
    expenseRatio: 1.25,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Maximum wealth creation potential through disciplined small-cap investing",
    benefits: [
      "Highest return potential in equity category",
      "SIP reduces small-cap volatility impact",
      "Access to hidden gems before others",
      "Professional research team",
      "Early-stage business opportunities"
    ],
    idealFor: [
      "Very aggressive investors",
      "Those with 15+ year horizon",
      "Young investors building wealth",
      "Understanding small-cap risks"
    ],
    topHoldings: [
      { name: "Polycab India", percentage: 3.8 },
      { name: "Varun Beverages", percentage: 3.5 },
      { name: "KEI Industries", percentage: 3.2 },
      { name: "Fine Organics", percentage: 3.0 }
    ],
    fundManager: {
      name: "R. Srinivasan",
      experience: "14+ years",
      expertise: "Small-cap growth investing"
    }
  },
  {
    id: "sip-6",
    name: "ICICI Prudential Technology SIP",
    fundHouse: "ICICI Prudential Mutual Fund",
    category: "Sectoral - Technology",
    minSipAmount: 500,
    recommendedAmount: 6000,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 28.5,
    returns3y: 30.2,
    returns5y: 26.8,
    riskLevel: "High",
    rating: 4,
    navPrice: 145.23,
    aum: "₹18,234 Cr",
    expenseRatio: 1.28,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Ride the digital revolution with systematic investment in technology leaders",
    benefits: [
      "Exposure to India's technology prowess",
      "Benefits from global digital transformation",
      "IT services and product companies",
      "Strong sectoral expertise",
      "Growth-oriented portfolio"
    ],
    idealFor: [
      "Believers in technology sector growth",
      "Investors with sectoral conviction",
      "Diversification with tech exposure",
      "7-10 year investment horizon"
    ],
    topHoldings: [
      { name: "Infosys", percentage: 12.5 },
      { name: "TCS", percentage: 11.8 },
      { name: "HCL Technologies", percentage: 9.2 },
      { name: "Tech Mahindra", percentage: 7.5 }
    ],
    fundManager: {
      name: "Vaibhav Dusad",
      experience: "12+ years",
      expertise: "Technology sector"
    }
  },
  {
    id: "sip-7",
    name: "Kotak Balanced Advantage SIP",
    fundHouse: "Kotak Mahindra Mutual Fund",
    category: "Hybrid - Balanced",
    minSipAmount: 1000,
    recommendedAmount: 10000,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 15.8,
    returns3y: 16.5,
    returns5y: 14.2,
    riskLevel: "Moderate",
    rating: 5,
    navPrice: 78.45,
    aum: "₹42,890 Cr",
    expenseRatio: 0.95,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Dynamic asset allocation with automatic rebalancing between equity and debt",
    benefits: [
      "Automated risk management",
      "Balanced exposure to equity and debt",
      "Lower volatility than pure equity",
      "Tax-efficient compared to debt funds",
      "Suitable for moderate risk takers"
    ],
    idealFor: [
      "Conservative equity investors",
      "First-time SIP investors",
      "Balanced risk-return profile seekers",
      "Medium-term goals (5-7 years)"
    ],
    topHoldings: [
      { name: "HDFC Bank", percentage: 6.8 },
      { name: "Reliance Industries", percentage: 5.5 },
      { name: "10Y G-Sec Bonds", percentage: 15.2 },
      { name: "ICICI Bank", percentage: 4.8 }
    ],
    fundManager: {
      name: "Pankaj Tibrewal",
      experience: "14+ years",
      expertise: "Asset allocation strategies"
    }
  },
  {
    id: "sip-8",
    name: "Axis ELSS Tax Saver SIP",
    fundHouse: "Axis Mutual Fund",
    category: "ELSS - Tax Saver",
    minSipAmount: 500,
    recommendedAmount: 12500,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 19.5,
    returns3y: 21.2,
    returns5y: 18.8,
    riskLevel: "Moderate to High",
    rating: 5,
    navPrice: 68.90,
    aum: "₹28,456 Cr",
    expenseRatio: 1.05,
    lockInPeriod: "3 years",
    taxBenefit: true,
    autoDebit: true,
    description: "Save tax while building wealth - dual benefit through ELSS SIP",
    benefits: [
      "Tax deduction up to ₹1.5 lakh under 80C",
      "Shortest lock-in among tax-saving options",
      "Equity returns with tax benefits",
      "Professional fund management",
      "Ideal for salaried individuals"
    ],
    idealFor: [
      "Tax-saving requirements",
      "Long-term wealth creation",
      "Salaried professionals",
      "Investors in 20-30% tax bracket"
    ],
    topHoldings: [
      { name: "Infosys", percentage: 7.5 },
      { name: "HDFC Bank", percentage: 7.2 },
      { name: "Reliance Industries", percentage: 6.8 },
      { name: "ICICI Bank", percentage: 6.5 }
    ],
    fundManager: {
      name: "Jinesh Gopani",
      experience: "16+ years",
      expertise: "Diversified equity"
    }
  },
  {
    id: "sip-9",
    name: "UTI Nifty Index SIP",
    fundHouse: "UTI Mutual Fund",
    category: "Index Fund",
    minSipAmount: 500,
    recommendedAmount: 5000,
    frequency: ["Monthly", "Quarterly", "Weekly"],
    returns1y: 16.5,
    returns3y: 17.2,
    returns5y: 15.8,
    riskLevel: "Moderate",
    rating: 4,
    navPrice: 156.45,
    aum: "₹12,345 Cr",
    expenseRatio: 0.25,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Track market returns with India's benchmark index through disciplined SIP",
    benefits: [
      "Lowest expense ratio of 0.25%",
      "Mirrors NIFTY 50 performance",
      "Diversified across 50 top companies",
      "Passive investing strategy",
      "Ideal for index believers"
    ],
    idealFor: [
      "Passive investment believers",
      "Cost-conscious investors",
      "Long-term index trackers",
      "Diversification seekers"
    ],
    topHoldings: [
      { name: "Reliance Industries", percentage: 9.8 },
      { name: "HDFC Bank", percentage: 9.2 },
      { name: "Infosys", percentage: 8.5 },
      { name: "ICICI Bank", percentage: 7.8 }
    ],
    fundManager: {
      name: "Sharwan Kumar Goyal",
      experience: "12+ years",
      expertise: "Index fund management"
    }
  },
  {
    id: "sip-10",
    name: "SBI Hybrid Equity SIP",
    fundHouse: "SBI Mutual Fund",
    category: "Hybrid - Aggressive",
    minSipAmount: 500,
    recommendedAmount: 7500,
    frequency: ["Monthly", "Quarterly"],
    returns1y: 17.5,
    returns3y: 18.8,
    returns5y: 16.5,
    riskLevel: "Moderate",
    rating: 4,
    navPrice: 88.75,
    aum: "₹35,678 Cr",
    expenseRatio: 1.15,
    lockInPeriod: "No lock-in",
    taxBenefit: false,
    autoDebit: true,
    description: "Aggressive hybrid strategy with 65-80% equity for optimal returns",
    benefits: [
      "Equity-oriented with debt cushion",
      "Better risk-adjusted returns",
      "Professional asset allocation",
      "Tax-efficient equity taxation",
      "Suitable for moderate risk takers"
    ],
    idealFor: [
      "Balanced portfolio seekers",
      "Moderate risk appetite",
      "5-7 year investment goals",
      "First-time equity investors"
    ],
    topHoldings: [
      { name: "Reliance Industries", percentage: 8.2 },
      { name: "HDFC Bank", percentage: 7.5 },
      { name: "Corp Bonds AAA", percentage: 12.5 },
      { name: "Infosys", percentage: 6.8 }
    ],
    fundManager: {
      name: "Dinesh Ahuja",
      experience: "15+ years",
      expertise: "Hybrid fund management"
    }
  }
];

export function getAllSIPPlans(): SIPPlan[] {
  return SIP_PLANS;
}

export function getSIPPlan(id: string): SIPPlan | undefined {
  return SIP_PLANS.find(plan => plan.id === id);
}

export function getSIPPlansByCategory(category: string): SIPPlan[] {
  return SIP_PLANS.filter(plan => plan.category.toLowerCase().includes(category.toLowerCase()));
}

export function getSIPPlansByRisk(riskLevel: string): SIPPlan[] {
  return SIP_PLANS.filter(plan => plan.riskLevel.toLowerCase() === riskLevel.toLowerCase());
}
