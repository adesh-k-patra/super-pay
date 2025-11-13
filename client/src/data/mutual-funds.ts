// Top 10 Mutual Funds with Complete Details

export interface FundManager {
  name: string;
  experience: string;
  bio: string;
  education: string;
  track_record: string;
  awards: string[];
  stats: {
    funds_managed: number;
    total_aum: string;
    avg_returns: number;
  };
}

export interface MutualFund {
  symbol: string;
  instrumentName: string;
  category: string;
  subcategory: string;
  fundHouse: string;
  currentPrice: number; // NAV
  change: number;
  changePercent: number;
  aum: string;
  expenseRatio: number;
  exitLoad: string;
  minInvestment: number;
  sipMinimum: number;
  returns1y: number;
  returns3y: number;
  returns5y: number;
  returns10y?: number;
  riskLevel: string;
  rating: number;
  fundManager: FundManager;
  sector: string;
  industry: string;
  description: string;
  whyGood: string[];
  availableFunds: number;
  holdings: number;
  lockInPeriod: string;
  dividendYield: number;
  portfolioTurnover: number;
  benchmarkIndex: string;
  topHoldings: {
    name: string;
    percentage: number;
  }[];
  sectorAllocation: {
    sector: string;
    percentage: number;
  }[];
}

export const TOP_MUTUAL_FUNDS: Record<string, MutualFund> = {
  'mf-1': {
    symbol: 'mf-1',
    instrumentName: 'Axis Bluechip Fund',
    category: 'Equity',
    subcategory: 'Large Cap',
    fundHouse: 'Axis Mutual Fund',
    currentPrice: 52.35,
    change: 1.25,
    changePercent: 2.45,
    aum: '32,567 Cr',
    expenseRatio: 0.98,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 500,
    sipMinimum: 500,
    returns1y: 18.4,
    returns3y: 19.8,
    returns5y: 17.2,
    returns10y: 16.5,
    riskLevel: 'Moderate',
    rating: 5,
    fundManager: {
      name: 'Shreyash Devalkar',
      experience: '15+ years',
      bio: 'Shreyash Devalkar is a seasoned fund manager with extensive experience in large-cap equity investing. He has consistently delivered alpha over benchmarks through disciplined stock selection.',
      education: 'MBA from IIM Ahmedabad, CFA Charter holder',
      track_record: 'Managed multiple funds with over $5 billion in AUM. Known for his value-oriented investment approach.',
      awards: [
        'Best Large Cap Fund Manager 2023 - Morningstar',
        'Fund Manager of the Year 2022 - ET Wealth',
        'Excellence in Equity Investing 2021 - Mutual Fund Insights'
      ],
      stats: {
        funds_managed: 3,
        total_aum: '₹45,000 Cr',
        avg_returns: 17.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Axis Bluechip Fund invests predominantly in large-cap stocks with a focus on quality businesses. The fund follows a disciplined investment approach combining growth and value styles.',
    whyGood: [
      'Consistent top-quartile performance over 5 and 10-year periods',
      'Low expense ratio of 0.98% compared to category average',
      'Strong track record of protecting capital during market downturns',
      'Portfolio of high-quality businesses with strong competitive moats',
      'Experienced fund manager with proven track record',
      'Diversified portfolio with 40-45 holdings across sectors'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 2.1,
    portfolioTurnover: 28.5,
    benchmarkIndex: 'NIFTY 50',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 8.5 },
      { name: 'ICICI Bank', percentage: 7.2 },
      { name: 'Infosys', percentage: 6.8 },
      { name: 'Reliance Industries', percentage: 6.5 },
      { name: 'Bharti Airtel', percentage: 5.3 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 32.5 },
      { sector: 'Information Technology', percentage: 18.3 },
      { sector: 'Consumer Goods', percentage: 12.7 },
      { sector: 'Energy', percentage: 10.2 },
      { sector: 'Healthcare', percentage: 8.5 }
    ]
  },
  'mf-2': {
    symbol: 'mf-2',
    instrumentName: 'Parag Parikh Flexi Cap Fund',
    category: 'Equity',
    subcategory: 'Flexi Cap',
    fundHouse: 'PPFAS Mutual Fund',
    currentPrice: 67.84,
    change: 2.15,
    changePercent: 3.27,
    aum: '45,234 Cr',
    expenseRatio: 0.82,
    exitLoad: '2% if redeemed within 1 year, 1% within 2 years',
    minInvestment: 1000,
    sipMinimum: 1000,
    returns1y: 22.5,
    returns3y: 24.3,
    returns5y: 20.8,
    returns10y: 18.9,
    riskLevel: 'Moderate to High',
    rating: 5,
    fundManager: {
      name: 'Rajeev Thakkar',
      experience: '20+ years',
      bio: 'Rajeev Thakkar is the Chief Investment Officer and Director at PPFAS Asset Management. He is known for his contrarian investment approach and focus on international diversification.',
      education: 'MBA from Jamnalal Bajaj Institute, CFA Charter holder',
      track_record: 'Pioneer of global investing in Indian mutual funds. Consistently delivered superior risk-adjusted returns.',
      awards: [
        'CIO of the Year 2023 - Mutual Fund Awards',
        'Innovation in Fund Management 2022 - CNBC',
        'Best Flexi Cap Fund 2021 - Value Research'
      ],
      stats: {
        funds_managed: 1,
        total_aum: '₹45,234 Cr',
        avg_returns: 21.2
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Parag Parikh Flexi Cap Fund follows a value-oriented investment philosophy with exposure to both domestic and international equities. The fund is known for its contrarian investment approach.',
    whyGood: [
      'Unique strategy with 25-35% exposure to international stocks',
      'Exceptional long-term performance with 20%+ CAGR over 5 years',
      'One of the lowest expense ratios in the industry at 0.82%',
      'Strong emphasis on capital preservation and downside protection',
      'Proven contrarian approach identifying undervalued opportunities',
      'Transparent communication with investors through detailed monthly letters'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.5,
    portfolioTurnover: 18.2,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'Alphabet (Google)', percentage: 6.2 },
      { name: 'HDFC Bank', percentage: 5.8 },
      { name: 'Microsoft', percentage: 4.9 },
      { name: 'Bajaj Holdings', percentage: 4.5 },
      { name: 'Amazon', percentage: 4.2 }
    ],
    sectorAllocation: [
      { sector: 'Technology', percentage: 28.5 },
      { sector: 'Financial Services', percentage: 24.3 },
      { sector: 'Consumer Discretionary', percentage: 15.7 },
      { sector: 'Healthcare', percentage: 12.2 },
      { sector: 'Communication Services', percentage: 10.8 }
    ]
  },
  'mf-3': {
    symbol: 'mf-3',
    instrumentName: 'Mirae Asset Emerging Bluechip Fund',
    category: 'Equity',
    subcategory: 'Large & Mid Cap',
    fundHouse: 'Mirae Asset Mutual Fund',
    currentPrice: 98.45,
    change: 1.85,
    changePercent: 1.92,
    aum: '28,765 Cr',
    expenseRatio: 1.15,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 1000,
    returns1y: 24.8,
    returns3y: 26.5,
    returns5y: 22.3,
    returns10y: 19.7,
    riskLevel: 'Moderate to High',
    rating: 5,
    fundManager: {
      name: 'Neelesh Surana',
      experience: '18+ years',
      bio: 'Neelesh Surana is known for his ability to identify quality mid-cap companies with strong growth potential. His investment style combines fundamental analysis with growth-at-reasonable-price approach.',
      education: 'CA, MBA from FMS Delhi',
      track_record: 'One of the most successful mid-cap fund managers in India with consistent alpha generation.',
      awards: [
        'Best Mid Cap Fund Manager 2023 - Morningstar',
        'Star Performer 2022 - Moneycontrol',
        'Excellence Award 2021 - Economic Times'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹35,000 Cr',
        avg_returns: 23.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Mirae Asset Emerging Bluechip Fund invests in companies that are leaders in their respective segments with strong growth potential. The fund maintains a balanced portfolio of large and mid-cap stocks.',
    whyGood: [
      'Consistently outperformed benchmark by 5-7% annually',
      'Expert at identifying tomorrow\'s large-caps from today\'s mid-caps',
      'Strong risk management with lower downside capture',
      'Disciplined approach to portfolio concentration',
      'Track record of booking profits in overvalued stocks',
      'Well-diversified across sectors and market caps'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.2,
    portfolioTurnover: 35.8,
    benchmarkIndex: 'NIFTY Large Midcap 250',
    topHoldings: [
      { name: 'ICICI Bank', percentage: 7.2 },
      { name: 'Bajaj Finance', percentage: 6.5 },
      { name: 'Titan Company', percentage: 5.8 },
      { name: 'SBI Life Insurance', percentage: 5.2 },
      { name: 'IndusInd Bank', percentage: 4.9 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 35.2 },
      { sector: 'Consumer Discretionary', percentage: 18.5 },
      { sector: 'Information Technology', percentage: 15.3 },
      { sector: 'Industrials', percentage: 12.7 },
      { sector: 'Healthcare', percentage: 10.2 }
    ]
  },
  'mf-4': {
    symbol: 'mf-4',
    instrumentName: 'ICICI Prudential Technology Fund',
    category: 'Equity',
    subcategory: 'Sector - Technology',
    fundHouse: 'ICICI Prudential Mutual Fund',
    currentPrice: 145.23,
    change: 3.45,
    changePercent: 2.43,
    aum: '18,234 Cr',
    expenseRatio: 1.28,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 28.5,
    returns3y: 30.2,
    returns5y: 26.8,
    returns10y: 24.5,
    riskLevel: 'High',
    rating: 4,
    fundManager: {
      name: 'Vaibhav Dusad',
      experience: '12+ years',
      bio: 'Vaibhav Dusad specializes in technology sector investing with deep understanding of digital transformation trends. He has successfully navigated multiple technology cycles.',
      education: 'B.Tech from IIT Delhi, MBA from ISB Hyderabad',
      track_record: 'Expertise in identifying technology disruptors early. Portfolio has consistently beaten technology indices.',
      awards: [
        'Best Sectoral Fund Manager 2023 - Value Research',
        'Technology Investment Excellence 2022 - Business Today'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹22,500 Cr',
        avg_returns: 27.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'ICICI Prudential Technology Fund invests in companies benefiting from technological advancements and digital transformation across sectors including IT services, software, and emerging tech.',
    whyGood: [
      'Leading sectoral fund with 10-year track record of excellence',
      'Early identifier of technology trends and disruptive companies',
      'Balanced exposure to IT services, product companies, and new-age tech',
      'Benefits from India\'s growing role in global technology',
      'Strong understanding of technological disruption across industries',
      'Proven ability to manage volatility in technology stocks'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 0.8,
    portfolioTurnover: 42.5,
    benchmarkIndex: 'NIFTY IT',
    topHoldings: [
      { name: 'Infosys', percentage: 12.5 },
      { name: 'TCS', percentage: 11.8 },
      { name: 'HCL Technologies', percentage: 9.2 },
      { name: 'Tech Mahindra', percentage: 7.5 },
      { name: 'Wipro', percentage: 6.8 }
    ],
    sectorAllocation: [
      { sector: 'IT Services', percentage: 52.5 },
      { sector: 'Software Products', percentage: 22.3 },
      { sector: 'Technology Hardware', percentage: 12.7 },
      { sector: 'Internet & E-commerce', percentage: 8.5 },
      { sector: 'Fintech', percentage: 4.0 }
    ]
  },
  'mf-5': {
    symbol: 'mf-5',
    instrumentName: 'SBI Bluechip Fund',
    category: 'Equity',
    subcategory: 'Large Cap',
    fundHouse: 'SBI Mutual Fund',
    currentPrice: 85.67,
    change: 0.95,
    changePercent: 1.12,
    aum: '42,890 Cr',
    expenseRatio: 1.02,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 16.8,
    returns3y: 17.5,
    returns5y: 15.9,
    returns10y: 14.8,
    riskLevel: 'Moderate',
    rating: 4,
    fundManager: {
      name: 'R. Srinivasan',
      experience: '16+ years',
      bio: 'R. Srinivasan is a veteran fund manager with expertise in large-cap investing. He focuses on quality companies with sustainable competitive advantages.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Managed large-cap funds through multiple market cycles with consistent performance.',
      awards: [
        'Consistent Performance Award 2023 - ICRA',
        'Large Cap Excellence 2021 - Moneycontrol'
      ],
      stats: {
        funds_managed: 3,
        total_aum: '₹65,000 Cr',
        avg_returns: 16.2
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'SBI Bluechip Fund is one of the largest large-cap funds investing in market leaders with established business models. The fund follows a blend of growth and value investment styles.',
    whyGood: [
      'One of India\'s oldest and most established large-cap funds',
      'Massive scale advantage with AUM over ₹42,000 crores',
      'Highly liquid portfolio of blue-chip companies',
      'Consistent dividend payouts for income-seeking investors',
      'Lower volatility compared to mid and small-cap funds',
      'Strong institutional backing from SBI Group'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 2.5,
    portfolioTurnover: 25.3,
    benchmarkIndex: 'BSE Sensex',
    topHoldings: [
      { name: 'Reliance Industries', percentage: 9.2 },
      { name: 'HDFC Bank', percentage: 8.5 },
      { name: 'ICICI Bank', percentage: 7.8 },
      { name: 'Infosys', percentage: 6.9 },
      { name: 'ITC', percentage: 5.5 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 35.5 },
      { sector: 'Information Technology', percentage: 20.2 },
      { sector: 'Energy', percentage: 14.8 },
      { sector: 'Consumer Goods', percentage: 12.5 },
      { sector: 'Healthcare', percentage: 8.0 }
    ]
  },
  'mf-6': {
    symbol: 'mf-6',
    instrumentName: 'Kotak Equity Opportunities Fund',
    category: 'Equity',
    subcategory: 'Multi Cap',
    fundHouse: 'Kotak Mahindra Mutual Fund',
    currentPrice: 234.56,
    change: 2.85,
    changePercent: 1.23,
    aum: '22,456 Cr',
    expenseRatio: 0.95,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 1000,
    returns1y: 20.5,
    returns3y: 21.8,
    returns5y: 19.3,
    returns10y: 17.8,
    riskLevel: 'Moderate',
    rating: 5,
    fundManager: {
      name: 'Pankaj Tibrewal',
      experience: '14+ years',
      bio: 'Pankaj Tibrewal is known for his flexible investment approach across market capitalizations. He has a proven track record of identifying multi-bagger opportunities.',
      education: 'CA, CFA Charter holder',
      track_record: 'Successfully managed multi-cap portfolios with superior alpha generation across market cycles.',
      awards: [
        'Best Multi Cap Fund Manager 2023 - Outlook Money',
        'Star Fund Manager 2022 - ET Wealth'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹28,000 Cr',
        avg_returns: 20.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Kotak Equity Opportunities Fund has the flexibility to invest across market capitalizations based on opportunities. The fund follows a bottom-up stock selection approach.',
    whyGood: [
      'Flexibility to invest across large, mid, and small-cap stocks',
      'Strong track record of identifying value across market caps',
      'Disciplined approach to portfolio construction',
      'Consistent performance in top quartile over 5 and 10 years',
      'Experienced fund management team with deep research support',
      'Good balance between growth and value stocks'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.8,
    portfolioTurnover: 32.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 6.8 },
      { name: 'Reliance Industries', percentage: 6.2 },
      { name: 'Bajaj Finance', percentage: 5.5 },
      { name: 'Infosys', percentage: 5.2 },
      { name: 'Bharti Airtel', percentage: 4.8 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 30.5 },
      { sector: 'Information Technology', percentage: 18.8 },
      { sector: 'Consumer Discretionary', percentage: 16.2 },
      { sector: 'Industrials', percentage: 14.5 },
      { sector: 'Energy', percentage: 12.0 }
    ]
  },
  'mf-7': {
    symbol: 'mf-7',
    instrumentName: 'HDFC Mid Cap Opportunities Fund',
    category: 'Equity',
    subcategory: 'Mid Cap',
    fundHouse: 'HDFC Mutual Fund',
    currentPrice: 128.90,
    change: 2.15,
    changePercent: 1.70,
    aum: '38,567 Cr',
    expenseRatio: 1.10,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 26.5,
    returns3y: 28.3,
    returns5y: 24.8,
    returns10y: 21.5,
    riskLevel: 'High',
    rating: 5,
    fundManager: {
      name: 'Chirag Setalvad',
      experience: '17+ years',
      bio: 'Chirag Setalvad is one of India\'s most respected mid-cap fund managers. He focuses on identifying quality mid-cap companies with strong management and scalable business models.',
      education: 'CA, MBA, CFA Charter holder',
      track_record: 'Consistently delivered top-quartile performance. Known for picking winners early in their growth phase.',
      awards: [
        'Mid Cap Fund Manager of the Decade - Morningstar',
        'Excellence in Mid Cap Investing 2023 - Value Research',
        'Best Fund Manager 2022 - CNBC TV18'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹42,000 Cr',
        avg_returns: 25.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'HDFC Mid Cap Opportunities Fund invests in mid-cap companies with strong fundamentals and growth potential. The fund has one of the longest and most successful track records in the mid-cap category.',
    whyGood: [
      'Legendary track record spanning over 15 years',
      'One of the best performing mid-cap funds in India',
      'Exceptional stock picking ability with several multi-baggers',
      'Strong focus on corporate governance and management quality',
      'Disciplined sell discipline to book profits',
      'Large AUM provides access to quality deal flow'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.0,
    portfolioTurnover: 38.5,
    benchmarkIndex: 'NIFTY Midcap 150',
    topHoldings: [
      { name: 'Tube Investments', percentage: 5.2 },
      { name: 'Persistent Systems', percentage: 4.8 },
      { name: 'Coforge', percentage: 4.5 },
      { name: 'Max Healthcare', percentage: 4.2 },
      { name: 'PI Industries', percentage: 3.9 }
    ],
    sectorAllocation: [
      { sector: 'Industrials', percentage: 25.5 },
      { sector: 'Financial Services', percentage: 22.3 },
      { sector: 'Healthcare', percentage: 15.8 },
      { sector: 'Information Technology', percentage: 14.2 },
      { sector: 'Consumer Discretionary', percentage: 12.7 }
    ]
  },
  'mf-8': {
    symbol: 'mf-8',
    instrumentName: 'Nippon India Small Cap Fund',
    category: 'Equity',
    subcategory: 'Small Cap',
    fundHouse: 'Nippon India Mutual Fund',
    currentPrice: 98.75,
    change: 1.95,
    changePercent: 2.01,
    aum: '28,234 Cr',
    expenseRatio: 1.20,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 32.5,
    returns3y: 35.8,
    returns5y: 30.2,
    returns10y: 25.8,
    riskLevel: 'Very High',
    rating: 5,
    fundManager: {
      name: 'Samir Rachh',
      experience: '19+ years',
      bio: 'Samir Rachh is a pioneer in small-cap investing in India. He has the ability to identify potential winners early and has delivered exceptional long-term returns.',
      education: 'CA, CFA Charter holder',
      track_record: 'One of the longest-serving small-cap fund managers with an enviable track record of wealth creation.',
      awards: [
        'Small Cap Fund Manager of the Year 2023 - All major publications',
        'Wealth Creator Award 2022 - Economic Times',
        'Excellence in Small Cap Investing 2021 - Morningstar'
      ],
      stats: {
        funds_managed: 1,
        total_aum: '₹28,234 Cr',
        avg_returns: 31.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Nippon India Small Cap Fund has an exceptional long-term track record of identifying and investing in high-quality small-cap companies with strong growth potential. The fund focuses on companies with scalable business models.',
    whyGood: [
      'Best-in-class small-cap fund with 15+ year track record',
      'Exceptional stock picking resulting in numerous multi-baggers',
      'Deep research team dedicated to small-cap universe',
      'Focus on sustainable businesses with strong corporate governance',
      'Proven ability to manage liquidity in small-cap stocks',
      'Highest wealth creation among small-cap funds over 10 years'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 0.5,
    portfolioTurnover: 45.2,
    benchmarkIndex: 'NIFTY Smallcap 250',
    topHoldings: [
      { name: 'Dixon Technologies', percentage: 3.8 },
      { name: 'Kalyan Jewellers', percentage: 3.5 },
      { name: 'KEI Industries', percentage: 3.2 },
      { name: 'Fine Organics', percentage: 3.0 },
      { name: 'Cera Sanitaryware', percentage: 2.8 }
    ],
    sectorAllocation: [
      { sector: 'Industrials', percentage: 28.5 },
      { sector: 'Consumer Discretionary', percentage: 22.8 },
      { sector: 'Financial Services', percentage: 18.2 },
      { sector: 'Materials', percentage: 14.5 },
      { sector: 'Healthcare', percentage: 10.0 }
    ]
  },
  'mf-9': {
    symbol: 'mf-9',
    instrumentName: 'UTI Nifty Index Fund',
    category: 'Index',
    subcategory: 'Large Cap',
    fundHouse: 'UTI Mutual Fund',
    currentPrice: 156.45,
    change: 0.85,
    changePercent: 0.55,
    aum: '18,567 Cr',
    expenseRatio: 0.12,
    exitLoad: 'Nil',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 15.2,
    returns3y: 16.5,
    returns5y: 14.8,
    returns10y: 13.5,
    riskLevel: 'Moderate',
    rating: 4,
    fundManager: {
      name: 'Sharwan Kumar Goyal',
      experience: '13+ years',
      bio: 'Sharwan Kumar Goyal specializes in passive fund management with focus on minimizing tracking error and efficient portfolio construction.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Successfully manages multiple index funds with industry-leading tracking efficiency.',
      awards: [
        'Best Index Fund Manager 2023 - Value Research',
        'Excellence in Passive Management 2022'
      ],
      stats: {
        funds_managed: 5,
        total_aum: '₹35,000 Cr',
        avg_returns: 14.8
      }
    },
    sector: 'Index Fund',
    industry: 'Asset Management',
    description: 'UTI Nifty Index Fund is one of the largest and most liquid index funds tracking the NIFTY 50. It provides low-cost exposure to India\'s top 50 companies with minimal tracking error.',
    whyGood: [
      'Extremely low expense ratio of just 0.12%',
      'No exit load making it highly liquid',
      'Perfect for beginners and passive investors',
      'Minimal tracking error - closely mirrors NIFTY 50',
      'Large AUM ensures high liquidity',
      'Simple, transparent, and tax-efficient investment'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.3,
    portfolioTurnover: 8.5,
    benchmarkIndex: 'NIFTY 50',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 13.2 },
      { name: 'Reliance Industries', percentage: 10.5 },
      { name: 'ICICI Bank', percentage: 8.8 },
      { name: 'Infosys', percentage: 7.5 },
      { name: 'TCS', percentage: 6.2 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 36.5 },
      { sector: 'Information Technology', percentage: 18.2 },
      { sector: 'Energy', percentage: 12.8 },
      { sector: 'Consumer Goods', percentage: 11.5 },
      { sector: 'Automobiles', percentage: 8.0 }
    ]
  },
  'mf-10': {
    symbol: 'mf-10',
    instrumentName: 'HDFC Balanced Advantage Fund',
    category: 'Hybrid',
    subcategory: 'Dynamic Asset Allocation',
    fundHouse: 'HDFC Mutual Fund',
    currentPrice: 345.67,
    change: 1.25,
    changePercent: 0.36,
    aum: '65,890 Cr',
    expenseRatio: 0.89,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 14.5,
    returns3y: 15.8,
    returns5y: 13.9,
    returns10y: 12.8,
    riskLevel: 'Low to Moderate',
    rating: 5,
    fundManager: {
      name: 'Anil Bamboli',
      experience: '16+ years',
      bio: 'Anil Bamboli is an expert in dynamic asset allocation strategies. He has successfully navigated multiple market cycles through tactical asset allocation.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Proven track record of protecting capital during downturns while participating in market uptrends.',
      awards: [
        'Best Balanced Fund Manager 2023 - Morningstar',
        'Risk Management Excellence 2022 - Value Research'
      ],
      stats: {
        funds_managed: 3,
        total_aum: '₹85,000 Cr',
        avg_returns: 14.2
      }
    },
    sector: 'Hybrid Mutual Fund',
    industry: 'Asset Management',
    description: 'HDFC Balanced Advantage Fund dynamically manages allocation between equity and debt based on market valuations. It aims to provide equity-like returns with lower volatility.',
    whyGood: [
      'India\'s largest balanced advantage fund with proven track record',
      'Automatic rebalancing between equity and debt',
      'Better tax efficiency compared to debt funds',
      'Lower volatility than pure equity funds',
      'Ideal for conservative investors seeking equity exposure',
      'Consistent performance across market cycles'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 2.8,
    portfolioTurnover: 65.5,
    benchmarkIndex: 'CRISIL Hybrid 35+65 Index',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 4.5 },
      { name: 'ICICI Bank', percentage: 3.8 },
      { name: 'Infosys', percentage: 3.2 },
      { name: 'Reliance Industries', percentage: 2.9 },
      { name: 'Government Securities', percentage: 25.5 }
    ],
    sectorAllocation: [
      { sector: 'Debt Securities', percentage: 40.5 },
      { sector: 'Financial Services', percentage: 18.2 },
      { sector: 'Information Technology', percentage: 12.5 },
      { sector: 'Energy', percentage: 8.8 },
      { sector: 'Consumer Goods', percentage: 7.5 }
    ]
  },
  'mf-11': {
    symbol: 'mf-11',
    instrumentName: 'Motilal Oswal Flexi Cap Fund',
    category: 'Equity',
    subcategory: 'Flexi Cap',
    fundHouse: 'Motilal Oswal Mutual Fund',
    currentPrice: 72.45,
    change: 1.85,
    changePercent: 2.62,
    aum: '12,345 Cr',
    expenseRatio: 0.92,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 23.5,
    returns3y: 25.2,
    returns5y: 21.8,
    riskLevel: 'Moderate to High',
    rating: 4,
    fundManager: {
      name: 'Ajay Khandelwal',
      experience: '14+ years',
      bio: 'Ajay Khandelwal specializes in multi-cap investing with a focus on identifying growth opportunities across market caps.',
      education: 'CA, CFA Charter holder',
      track_record: 'Strong track record in flexi-cap space with consistent alpha generation.',
      awards: [
        'Rising Star Fund Manager 2023 - Outlook Money',
        'Best Flexi Cap Performance 2022'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹15,000 Cr',
        avg_returns: 22.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Motilal Oswal Flexi Cap Fund offers flexibility to invest across market capitalizations with a focus on quality growth companies.',
    whyGood: [
      'Flexible allocation strategy across market caps',
      'Focus on high-growth quality businesses',
      'Competitive expense ratio',
      'Strong performance in trending sectors',
      'Good risk-adjusted returns',
      'Active portfolio management'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.3,
    portfolioTurnover: 35.2,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'ICICI Bank', percentage: 6.5 },
      { name: 'Reliance Industries', percentage: 5.8 },
      { name: 'Infosys', percentage: 5.2 },
      { name: 'HDFC Bank', percentage: 4.9 },
      { name: 'Bajaj Finance', percentage: 4.5 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 32.5 },
      { sector: 'Information Technology', percentage: 20.3 },
      { sector: 'Consumer Discretionary', percentage: 16.2 },
      { sector: 'Healthcare', percentage: 12.5 },
      { sector: 'Industrials', percentage: 10.5 }
    ]
  },
  'mf-12': {
    symbol: 'mf-12',
    instrumentName: 'Quant Flexi Cap Fund',
    category: 'Equity',
    subcategory: 'Flexi Cap',
    fundHouse: 'Quant Mutual Fund',
    currentPrice: 89.65,
    change: 2.45,
    changePercent: 2.81,
    aum: '8,567 Cr',
    expenseRatio: 0.88,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 1000,
    returns1y: 28.5,
    returns3y: 32.8,
    returns5y: 27.5,
    riskLevel: 'High',
    rating: 5,
    fundManager: {
      name: 'Sandeep Tandon',
      experience: '22+ years',
      bio: 'Sandeep Tandon is known for his quantitative approach to investing and ability to identify market trends early.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Exceptional track record with focus on quantitative strategies and momentum investing.',
      awards: [
        'Best Performance 2023 - Multiple categories',
        'Innovation in Fund Management 2022'
      ],
      stats: {
        funds_managed: 4,
        total_aum: '₹25,000 Cr',
        avg_returns: 29.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Quant Flexi Cap Fund uses quantitative models and market momentum to invest across market capitalizations with high conviction calls.',
    whyGood: [
      'Outstanding recent performance track record',
      'Quantitative approach to stock selection',
      'High conviction portfolio with 30-40 stocks',
      'Focus on quality and momentum',
      'Aggressive growth orientation',
      'Strong sectoral rotation strategies'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 0.8,
    portfolioTurnover: 52.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'Reliance Industries', percentage: 7.5 },
      { name: 'Adani Enterprises', percentage: 6.8 },
      { name: 'Tata Motors', percentage: 6.2 },
      { name: 'L&T', percentage: 5.5 },
      { name: 'SBI', percentage: 5.2 }
    ],
    sectorAllocation: [
      { sector: 'Energy', percentage: 25.5 },
      { sector: 'Financial Services', percentage: 22.3 },
      { sector: 'Industrials', percentage: 18.7 },
      { sector: 'Automobiles', percentage: 15.2 },
      { sector: 'Materials', percentage: 10.3 }
    ]
  },
  'mf-13': {
    symbol: 'mf-13',
    instrumentName: 'DSP Flexi Cap Fund',
    category: 'Equity',
    subcategory: 'Flexi Cap',
    fundHouse: 'DSP Mutual Fund',
    currentPrice: 95.30,
    change: 1.65,
    changePercent: 1.76,
    aum: '15,890 Cr',
    expenseRatio: 1.05,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 1000,
    sipMinimum: 500,
    returns1y: 21.5,
    returns3y: 23.8,
    returns5y: 20.2,
    riskLevel: 'Moderate',
    rating: 4,
    fundManager: {
      name: 'Vinit Sambre',
      experience: '19+ years',
      bio: 'Vinit Sambre is a value-oriented investor with expertise in identifying undervalued quality businesses.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Strong long-term track record with focus on value and quality investing.',
      awards: [
        'Value Investor of the Year 2023',
        'Consistent Performance Award 2021'
      ],
      stats: {
        funds_managed: 3,
        total_aum: '₹22,000 Cr',
        avg_returns: 21.0
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'DSP Flexi Cap Fund follows a disciplined value-oriented approach investing across market caps with focus on quality businesses.',
    whyGood: [
      'Value-oriented investment philosophy',
      'Focus on quality businesses with sustainable moats',
      'Disciplined portfolio construction',
      'Good downside protection',
      'Experienced fund manager',
      'Balanced exposure across market caps'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.9,
    portfolioTurnover: 28.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 6.8 },
      { name: 'Infosys', percentage: 6.2 },
      { name: 'ITC', percentage: 5.5 },
      { name: 'Bharti Airtel', percentage: 5.0 },
      { name: 'Asian Paints', percentage: 4.8 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 30.5 },
      { sector: 'Information Technology', percentage: 22.3 },
      { sector: 'Consumer Goods', percentage: 18.2 },
      { sector: 'Telecom', percentage: 12.5 },
      { sector: 'Healthcare', percentage: 10.5 }
    ]
  },
  'mf-14': {
    symbol: 'mf-14',
    instrumentName: 'Canara Robeco Flexi Cap Fund',
    category: 'Equity',
    subcategory: 'Flexi Cap',
    fundHouse: 'Canara Robeco Mutual Fund',
    currentPrice: 78.90,
    change: 1.25,
    changePercent: 1.61,
    aum: '10,234 Cr',
    expenseRatio: 0.95,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 1000,
    returns1y: 20.8,
    returns3y: 22.5,
    returns5y: 19.8,
    riskLevel: 'Moderate',
    rating: 4,
    fundManager: {
      name: 'Shridatta Bhandwaldar',
      experience: '16+ years',
      bio: 'Shridatta Bhandwaldar focuses on quality growth investing with a balanced approach across market caps.',
      education: 'CA, CFA Charter holder',
      track_record: 'Consistent performer with focus on sustainable growth businesses.',
      awards: [
        'Quality Investing Award 2022',
        'Top Fund Manager 2021'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹18,000 Cr',
        avg_returns: 20.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Canara Robeco Flexi Cap Fund combines quality and growth investing across market capitalizations with focus on wealth creation.',
    whyGood: [
      'Quality-focused investment approach',
      'Balanced allocation across market caps',
      'Good risk management practices',
      'Transparent investment philosophy',
      'Strong corporate governance focus',
      'Reasonable expense ratio'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.6,
    portfolioTurnover: 32.0,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'ICICI Bank', percentage: 6.5 },
      { name: 'HDFC Bank', percentage: 6.0 },
      { name: 'TCS', percentage: 5.5 },
      { name: 'Reliance Industries', percentage: 5.2 },
      { name: 'Kotak Mahindra Bank', percentage: 4.8 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 33.5 },
      { sector: 'Information Technology', percentage: 21.2 },
      { sector: 'Consumer Goods', percentage: 15.8 },
      { sector: 'Energy', percentage: 12.5 },
      { sector: 'Healthcare', percentage: 10.0 }
    ]
  },
  'mf-15': {
    symbol: 'mf-15',
    instrumentName: 'UTI Flexi Cap Fund',
    category: 'Equity',
    subcategory: 'Flexi Cap',
    fundHouse: 'UTI Mutual Fund',
    currentPrice: 68.75,
    change: 0.95,
    changePercent: 1.40,
    aum: '22,567 Cr',
    expenseRatio: 1.12,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 19.5,
    returns3y: 21.2,
    returns5y: 18.8,
    riskLevel: 'Moderate',
    rating: 4,
    fundManager: {
      name: 'Swati Kulkarni',
      experience: '17+ years',
      bio: 'Swati Kulkarni is known for her balanced investment approach with focus on sustainable business models.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Strong track record in managing diversified equity portfolios.',
      awards: [
        'Women Fund Manager of the Year 2023',
        'Excellence in Equity Management 2022'
      ],
      stats: {
        funds_managed: 3,
        total_aum: '₹35,000 Cr',
        avg_returns: 19.8
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'UTI Flexi Cap Fund offers flexibility to invest across market caps with focus on quality and sustainable growth.',
    whyGood: [
      'Experienced and stable fund management',
      'Flexible allocation based on opportunities',
      'Focus on business sustainability',
      'Good diversification',
      'Consistent performance',
      'Strong institutional backing'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.7,
    portfolioTurnover: 30.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 7.2 },
      { name: 'Reliance Industries', percentage: 6.5 },
      { name: 'Infosys', percentage: 5.8 },
      { name: 'ICICI Bank', percentage: 5.5 },
      { name: 'TCS', percentage: 5.0 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 32.5 },
      { sector: 'Information Technology', percentage: 20.8 },
      { sector: 'Energy', percentage: 15.2 },
      { sector: 'Consumer Goods', percentage: 13.5 },
      { sector: 'Healthcare', percentage: 11.0 }
    ]
  },
  'mf-16': {
    symbol: 'mf-16',
    instrumentName: 'ICICI Prudential Multi-Asset Fund',
    category: 'Hybrid',
    subcategory: 'Multi Asset',
    fundHouse: 'ICICI Prudential Mutual Fund',
    currentPrice: 456.80,
    change: 1.15,
    changePercent: 0.25,
    aum: '18,234 Cr',
    expenseRatio: 1.05,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 1000,
    returns1y: 16.5,
    returns3y: 17.8,
    returns5y: 15.2,
    riskLevel: 'Moderate',
    rating: 5,
    fundManager: {
      name: 'Manish Banthia',
      experience: '18+ years',
      bio: 'Manish Banthia specializes in multi-asset allocation with expertise across equity, debt, and commodities.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Pioneer in multi-asset investing in India with strong risk-adjusted returns.',
      awards: [
        'Best Multi-Asset Fund Manager 2023',
        'Innovation Award 2022'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹25,000 Cr',
        avg_returns: 16.5
      }
    },
    sector: 'Hybrid Mutual Fund',
    industry: 'Asset Management',
    description: 'ICICI Prudential Multi-Asset Fund invests across equity, debt, gold, and other asset classes for optimal diversification.',
    whyGood: [
      'True diversification across multiple asset classes',
      'Includes gold and international equity exposure',
      'Lower volatility than pure equity funds',
      'Professional asset allocation management',
      'Good for one-stop investment solution',
      'Tax-efficient structure'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 2.2,
    portfolioTurnover: 45.5,
    benchmarkIndex: 'CRISIL Hybrid 50+50 Index',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 5.5 },
      { name: 'Gold ETF', percentage: 12.0 },
      { name: 'Government Securities', percentage: 28.5 },
      { name: 'Reliance Industries', percentage: 4.5 },
      { name: 'International Equity', percentage: 8.0 }
    ],
    sectorAllocation: [
      { sector: 'Debt Securities', percentage: 35.5 },
      { sector: 'Equity', percentage: 45.0 },
      { sector: 'Gold', percentage: 12.0 },
      { sector: 'International Equity', percentage: 7.5 }
    ]
  },
  'mf-17': {
    symbol: 'mf-17',
    instrumentName: 'Aditya Birla SL Multi Cap Fund',
    category: 'Equity',
    subcategory: 'Multi Cap',
    fundHouse: 'Aditya Birla Sun Life Mutual Fund',
    currentPrice: 112.45,
    change: 1.55,
    changePercent: 1.40,
    aum: '14,567 Cr',
    expenseRatio: 1.08,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 1000,
    sipMinimum: 500,
    returns1y: 22.5,
    returns3y: 24.2,
    returns5y: 21.0,
    riskLevel: 'Moderate to High',
    rating: 4,
    fundManager: {
      name: 'Mahesh Patil',
      experience: '15+ years',
      bio: 'Mahesh Patil is an experienced fund manager with expertise in multi-cap investing and stock selection.',
      education: 'CA, CFA Charter holder',
      track_record: 'Strong track record of identifying opportunities across market caps.',
      awards: [
        'Multi Cap Excellence 2023',
        'Stock Picker Award 2022'
      ],
      stats: {
        funds_managed: 3,
        total_aum: '₹28,000 Cr',
        avg_returns: 22.0
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Aditya Birla SL Multi Cap Fund invests across large, mid, and small cap stocks following regulatory mandates with active management.',
    whyGood: [
      'Balanced exposure across all market caps',
      'Strong research-backed investment approach',
      'Good mix of growth and value stocks',
      'Experienced fund house with strong track record',
      'Disciplined investment process',
      'Attractive risk-reward profile'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.4,
    portfolioTurnover: 38.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'ICICI Bank', percentage: 6.5 },
      { name: 'Reliance Industries', percentage: 6.0 },
      { name: 'HDFC Bank', percentage: 5.5 },
      { name: 'Infosys', percentage: 5.0 },
      { name: 'Bajaj Finance', percentage: 4.5 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 32.5 },
      { sector: 'Information Technology', percentage: 18.5 },
      { sector: 'Consumer Discretionary', percentage: 15.8 },
      { sector: 'Industrials', percentage: 14.2 },
      { sector: 'Healthcare', percentage: 11.0 }
    ]
  },
  'mf-18': {
    symbol: 'mf-18',
    instrumentName: 'SBI Multi Cap Fund',
    category: 'Equity',
    subcategory: 'Multi Cap',
    fundHouse: 'SBI Mutual Fund',
    currentPrice: 95.60,
    change: 1.20,
    changePercent: 1.27,
    aum: '16,890 Cr',
    expenseRatio: 1.15,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 21.8,
    returns3y: 23.5,
    returns5y: 20.5,
    riskLevel: 'Moderate to High',
    rating: 4,
    fundManager: {
      name: 'Dinesh Balachandran',
      experience: '16+ years',
      bio: 'Dinesh Balachandran has extensive experience in managing diversified equity portfolios across market caps.',
      education: 'MBA, CFA Charter holder',
      track_record: 'Proven ability to generate alpha through bottom-up stock selection.',
      awards: [
        'Consistent Performance Award 2023',
        'Multi Cap Manager Award 2021'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹22,000 Cr',
        avg_returns: 21.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'SBI Multi Cap Fund offers diversified exposure across market capitalizations with focus on quality businesses and growth potential.',
    whyGood: [
      'Diversified across all market cap segments',
      'Strong institutional backing from SBI',
      'Good stock selection track record',
      'Balanced portfolio construction',
      'Focus on quality and growth',
      'Competitive performance metrics'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.5,
    portfolioTurnover: 35.8,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 6.8 },
      { name: 'Reliance Industries', percentage: 6.2 },
      { name: 'Infosys', percentage: 5.5 },
      { name: 'ICICI Bank', percentage: 5.2 },
      { name: 'Larsen & Toubro', percentage: 4.8 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 33.5 },
      { sector: 'Information Technology', percentage: 19.2 },
      { sector: 'Industrials', percentage: 16.5 },
      { sector: 'Energy', percentage: 13.8 },
      { sector: 'Consumer Goods', percentage: 10.0 }
    ]
  },
  'mf-19': {
    symbol: 'mf-19',
    instrumentName: 'HDFC Multi Cap Fund',
    category: 'Equity',
    subcategory: 'Multi Cap',
    fundHouse: 'HDFC Mutual Fund',
    currentPrice: 134.50,
    change: 1.75,
    changePercent: 1.32,
    aum: '19,234 Cr',
    expenseRatio: 1.12,
    exitLoad: '1% if redeemed within 1 year',
    minInvestment: 5000,
    sipMinimum: 500,
    returns1y: 23.5,
    returns3y: 25.8,
    returns5y: 22.3,
    riskLevel: 'Moderate to High',
    rating: 5,
    fundManager: {
      name: 'Roshi Jain',
      experience: '14+ years',
      bio: 'Roshi Jain is known for her systematic approach to multi-cap investing with focus on quality and growth.',
      education: 'CA, CFA Charter holder',
      track_record: 'Strong performance track record with disciplined portfolio management.',
      awards: [
        'Rising Star Manager 2023',
        'Best Multi Cap Performance 2022'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹25,000 Cr',
        avg_returns: 23.5
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'HDFC Multi Cap Fund combines quality, growth, and value investing across market caps with disciplined approach.',
    whyGood: [
      'Strong track record from HDFC stable',
      'Balanced approach to multi-cap investing',
      'Focus on quality businesses',
      'Good risk management',
      'Consistent top-quartile performance',
      'Strong research backing'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: 'Nil',
    dividendYield: 1.6,
    portfolioTurnover: 33.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'ICICI Bank', percentage: 7.0 },
      { name: 'HDFC Bank', percentage: 6.5 },
      { name: 'Reliance Industries', percentage: 6.0 },
      { name: 'Infosys', percentage: 5.5 },
      { name: 'Bharti Airtel', percentage: 5.0 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 34.5 },
      { sector: 'Information Technology', percentage: 20.5 },
      { sector: 'Telecom', percentage: 14.5 },
      { sector: 'Consumer Goods', percentage: 13.0 },
      { sector: 'Healthcare', percentage: 10.5 }
    ]
  },
  'mf-20': {
    symbol: 'mf-20',
    instrumentName: 'Axis ELSS Tax Saver Fund',
    category: 'Equity',
    subcategory: 'ELSS',
    fundHouse: 'Axis Mutual Fund',
    currentPrice: 68.90,
    change: 1.35,
    changePercent: 2.00,
    aum: '35,678 Cr',
    expenseRatio: 0.98,
    exitLoad: 'Nil',
    minInvestment: 500,
    sipMinimum: 500,
    returns1y: 19.5,
    returns3y: 21.2,
    returns5y: 18.8,
    riskLevel: 'Moderate to High',
    rating: 5,
    fundManager: {
      name: 'Jinesh Gopani',
      experience: '17+ years',
      bio: 'Jinesh Gopani is an experienced equity fund manager with strong track record in diversified equity investing.',
      education: 'CA, CFA Charter holder',
      track_record: 'Consistently delivered superior returns in tax-saving category.',
      awards: [
        'Best ELSS Fund Manager 2023',
        'Tax Saver Excellence 2022'
      ],
      stats: {
        funds_managed: 2,
        total_aum: '₹42,000 Cr',
        avg_returns: 19.8
      }
    },
    sector: 'Equity Mutual Fund',
    industry: 'Asset Management',
    description: 'Axis ELSS Tax Saver Fund offers tax benefits under Section 80C with potential for wealth creation through equity investing.',
    whyGood: [
      'Tax deduction up to ₹1.5 lakh under Section 80C',
      'Shortest lock-in period of 3 years among tax-saving options',
      'Consistent top-quartile performance',
      'Low expense ratio',
      'Diversified portfolio across market caps',
      'Strong long-term wealth creation track record'
    ],
    availableFunds: 50000,
    holdings: 0,
    lockInPeriod: '3 years',
    dividendYield: 1.8,
    portfolioTurnover: 30.5,
    benchmarkIndex: 'NIFTY 500',
    topHoldings: [
      { name: 'HDFC Bank', percentage: 7.5 },
      { name: 'ICICI Bank', percentage: 6.8 },
      { name: 'Infosys', percentage: 6.2 },
      { name: 'Reliance Industries', percentage: 5.8 },
      { name: 'Bharti Airtel', percentage: 5.2 }
    ],
    sectorAllocation: [
      { sector: 'Financial Services', percentage: 32.5 },
      { sector: 'Information Technology', percentage: 21.5 },
      { sector: 'Consumer Goods', percentage: 15.8 },
      { sector: 'Telecom', percentage: 12.2 },
      { sector: 'Healthcare', percentage: 10.0 }
    ]
  }
};

export const getMutualFund = (symbol: string): MutualFund | undefined => {
  return TOP_MUTUAL_FUNDS[symbol];
};

export const getAllMutualFunds = (): MutualFund[] => {
  return Object.values(TOP_MUTUAL_FUNDS);
};
