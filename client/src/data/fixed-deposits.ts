// Top 20 Fixed Deposits with Complete Details

export interface BankManager {
  name: string;
  experience: string;
  bio: string;
  education: string;
  awards: string[];
}

export interface FixedDeposit {
  id: string;
  bankName: string;
  fdType: string;
  interestRate: number;
  tenure: number; // in months
  tenureLabel: string;
  minDeposit: number;
  maxDeposit: number;
  rating: number;
  taxSavingBenefit: boolean;
  prematureWithdrawal: boolean;
  prematureWithdrawalPenalty: string;
  compoundingFrequency: string;
  payoutType: string;
  tdsCertificate: boolean;
  autoRenewal: boolean;
  nominationFacility: boolean;
  seniorCitizenRate: number;
  description: string;
  benefits: string[];
  whyChoose: string[];
  bankLogo: string;
  bankCategory: "Government" | "Private" | "Small Finance" | "Cooperative";
  specialFeature?: string;
}

export const TOP_FIXED_DEPOSITS: Record<string, FixedDeposit> = {
  'fd-1': {
    id: 'fd-1',
    bankName: 'SBI Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.10,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 1000,
    maxDeposit: 10000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '0.5% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.60,
    description: 'State Bank of India offers one of the most trusted fixed deposit schemes in India with competitive interest rates and flexible tenure options.',
    benefits: [
      'High safety with government backing',
      'Flexible tenure from 7 days to 10 years',
      'Additional 0.50% interest for senior citizens',
      'Loan facility against FD up to 90% of deposit',
      'Auto-renewal facility available',
      'Online FD booking facility'
    ],
    whyChoose: [
      'Largest public sector bank in India',
      'AAA credit rating',
      'Wide network of branches across India',
      'Trusted brand with decades of reputation',
      'Easy premature withdrawal facility',
      'Tax saving FD option available'
    ],
    bankLogo: '🏦',
    bankCategory: 'Government',
    specialFeature: 'Government Backed Security'
  },
  'fd-2': {
    id: 'fd-2',
    bankName: 'HDFC Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.25,
    tenure: 18,
    tenureLabel: '18 Months',
    minDeposit: 5000,
    maxDeposit: 50000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty on interest',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.75,
    description: 'HDFC Bank Fixed Deposit offers attractive interest rates with the reliability of India\'s largest private sector bank.',
    benefits: [
      'Higher interest rates for deposits above ₹2 crore',
      'Flexi FD facility available',
      'Additional 0.50% for senior citizens',
      'Doorstep banking for FD opening',
      'SMS and email alerts for maturity',
      'Auto-sweep facility available'
    ],
    whyChoose: [
      'Leading private sector bank',
      'Easy online FD booking',
      'Flexible tenure options',
      'Excellent customer service',
      'Multiple payout options',
      'Highest safety standards'
    ],
    bankLogo: '🏛️',
    bankCategory: 'Private',
    specialFeature: 'Flexi FD Option'
  },
  'fd-3': {
    id: 'fd-3',
    bankName: 'ICICI Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.15,
    tenure: 15,
    tenureLabel: '15 Months',
    minDeposit: 10000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% on interest earned',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.65,
    description: 'ICICI Bank Fixed Deposit provides secure investment with attractive returns and flexible features for all age groups.',
    benefits: [
      'Special rates for senior citizens',
      'Tax Saver FD available',
      'Instant FD facility',
      'Auto-renewal option',
      'Nomination facility',
      'Loan against FD up to 90%'
    ],
    whyChoose: [
      'One of India\'s leading private banks',
      'Digital-first banking experience',
      'Wide range of tenure options',
      'Competitive interest rates',
      'Easy premature withdrawal',
      '24/7 online banking'
    ],
    bankLogo: '🏢',
    bankCategory: 'Private',
    specialFeature: 'Instant FD Facility'
  },
  'fd-4': {
    id: 'fd-4',
    bankName: 'Axis Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.20,
    tenure: 24,
    tenureLabel: '2 Years',
    minDeposit: 5000,
    maxDeposit: 25000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.75,
    description: 'Axis Bank offers premium fixed deposit schemes with excellent interest rates and customer-friendly features.',
    benefits: [
      'Additional 0.50% for senior citizens',
      'Flexible payout options',
      'Online FD booking',
      'Auto-renewal facility',
      'Premature withdrawal allowed',
      'Nomination facility available'
    ],
    whyChoose: [
      'Third largest private bank in India',
      'High credit rating',
      'Quick online processing',
      'Excellent customer support',
      'Competitive rates',
      'Safe and secure investment'
    ],
    bankLogo: '🏪',
    bankCategory: 'Private',
    specialFeature: 'Premium Banking Services'
  },
  'fd-5': {
    id: 'fd-5',
    bankName: 'Post Office Time Deposit',
    fdType: 'Government Scheme',
    interestRate: 7.50,
    tenure: 60,
    tenureLabel: '5 Years',
    minDeposit: 1000,
    maxDeposit: 10000000,
    rating: 5,
    taxSavingBenefit: true,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% deduction after 1 year',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: false,
    nominationFacility: true,
    seniorCitizenRate: 7.50,
    description: 'Post Office Time Deposit is a government-backed savings scheme offering guaranteed returns with tax benefits.',
    benefits: [
      'Backed by Government of India',
      'Tax deduction under Section 80C',
      'Quarterly interest compounding',
      'Available across all post offices',
      'Joint account facility',
      'Minimum deposit just ₹1000'
    ],
    whyChoose: [
      'Sovereign guarantee',
      'Risk-free investment',
      'Tax saving benefits',
      'Easy accessibility',
      'Regular income option',
      'Trusted since decades'
    ],
    bankLogo: '📮',
    bankCategory: 'Government',
    specialFeature: 'Tax Saving under 80C'
  },
  'fd-6': {
    id: 'fd-6',
    bankName: 'Kotak Mahindra Bank FD',
    fdType: 'Regular FD',
    interestRate: 7.20,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 10000,
    maxDeposit: 50000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '0.5% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.70,
    description: 'Kotak Mahindra Bank FD offers competitive rates with flexible tenure and premium banking services.',
    benefits: [
      'Attractive interest rates',
      'Flexible tenure options',
      'Additional benefits for senior citizens',
      'Easy online FD creation',
      'Auto-sweep facility',
      'Loan against FD available'
    ],
    whyChoose: [
      'Leading private sector bank',
      'High safety standards',
      'Digital banking excellence',
      'Quick processing',
      'Customer-centric approach',
      'Wide branch network'
    ],
    bankLogo: '🏦',
    bankCategory: 'Private'
  },
  'fd-7': {
    id: 'fd-7',
    bankName: 'YES Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.75,
    tenure: 18,
    tenureLabel: '18 Months',
    minDeposit: 10000,
    maxDeposit: 100000000,
    rating: 4,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 8.25,
    description: 'YES Bank offers premium FD rates with modern banking solutions and excellent customer service.',
    benefits: [
      'Higher interest rates',
      'Special rates for senior citizens',
      'Flexible tenure periods',
      'Online FD booking',
      'Auto-renewal option',
      'Sweep-in facility'
    ],
    whyChoose: [
      'Competitive interest rates',
      'Modern digital platform',
      'Quick account opening',
      'Premium customer service',
      'Multiple payout options',
      'Safe investment'
    ],
    bankLogo: '💼',
    bankCategory: 'Private',
    specialFeature: 'Higher Interest Rates'
  },
  'fd-8': {
    id: 'fd-8',
    bankName: 'Bank of Baroda FD',
    fdType: 'Regular FD',
    interestRate: 7.05,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 1000,
    maxDeposit: 50000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% on interest',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.55,
    description: 'Bank of Baroda FD scheme offers reliable returns with the trust of a leading public sector bank.',
    benefits: [
      'Government-backed security',
      'Senior citizen benefits',
      'Wide branch network',
      'Online FD facility',
      'Loan against FD',
      'Tax saving option available'
    ],
    whyChoose: [
      'Public sector bank reliability',
      'Pan-India presence',
      'Trusted brand',
      'Easy accessibility',
      'Competitive rates',
      'Safe investment'
    ],
    bankLogo: '🏛️',
    bankCategory: 'Government'
  },
  'fd-9': {
    id: 'fd-9',
    bankName: 'IndusInd Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.75,
    tenure: 18,
    tenureLabel: '18 Months',
    minDeposit: 10000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 8.25,
    description: 'IndusInd Bank offers attractive FD rates with premium features and excellent banking services.',
    benefits: [
      'Attractive interest rates',
      'Special rates for senior citizens',
      'Flexi deposit facility',
      'Auto-renewal option',
      'Sweep-in facility',
      'Loan against FD'
    ],
    whyChoose: [
      'High interest rates',
      'Premium banking experience',
      'Flexible options',
      'Quick processing',
      'Safe and secure',
      'Excellent customer service'
    ],
    bankLogo: '🏢',
    bankCategory: 'Private',
    specialFeature: 'Attractive Senior Citizen Rates'
  },
  'fd-10': {
    id: 'fd-10',
    bankName: 'Punjab National Bank FD',
    fdType: 'Regular FD',
    interestRate: 7.00,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 1000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% on applicable interest',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.50,
    description: 'PNB Fixed Deposit offers safe investment with government backing and competitive interest rates.',
    benefits: [
      'Government bank security',
      'Senior citizen benefits',
      'Wide branch network',
      'Online booking facility',
      'Auto-renewal available',
      'Nomination facility'
    ],
    whyChoose: [
      'Second largest public sector bank',
      'Government guaranteed',
      'Pan-India presence',
      'Trusted for decades',
      'Flexible tenure',
      'Safe investment'
    ],
    bankLogo: '🏦',
    bankCategory: 'Government'
  },
  'fd-11': {
    id: 'fd-11',
    bankName: 'Bajaj Finance Fixed Deposit',
    fdType: 'Corporate FD',
    interestRate: 8.85,
    tenure: 24,
    tenureLabel: '2 Years',
    minDeposit: 15000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: 'As per terms',
    compoundingFrequency: 'Cumulative',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: false,
    nominationFacility: true,
    seniorCitizenRate: 9.10,
    description: 'Bajaj Finance FD offers highest interest rates among corporate FDs with top credit rating and flexible features.',
    benefits: [
      'Highest FD interest rates',
      'CRISIL AAA/STABLE rating',
      'Additional 0.25% for senior citizens',
      'Flexible tenure options',
      'Systematic Deposit Plan available',
      'Premature withdrawal facility'
    ],
    whyChoose: [
      'Market-leading interest rates',
      'Top credit rating',
      'Easy online application',
      'Quick processing',
      'Trusted NBFC',
      'High returns on investment'
    ],
    bankLogo: '💰',
    bankCategory: 'Private',
    specialFeature: 'Highest Interest Rates'
  },
  'fd-12': {
    id: 'fd-12',
    bankName: 'Canara Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.10,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 1000,
    maxDeposit: 50000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.60,
    description: 'Canara Bank FD provides secure investment with government backing and attractive returns.',
    benefits: [
      'Government bank guarantee',
      'Senior citizen benefits',
      'Wide network access',
      'Online FD facility',
      'Auto-renewal option',
      'Tax saving FD available'
    ],
    whyChoose: [
      'Nationalized bank security',
      'Pan-India branches',
      'Reliable returns',
      'Easy processing',
      'Trusted brand',
      'Customer friendly'
    ],
    bankLogo: '🏛️',
    bankCategory: 'Government'
  },
  'fd-13': {
    id: 'fd-13',
    bankName: 'Union Bank of India FD',
    fdType: 'Regular FD',
    interestRate: 7.00,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 1000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% on interest',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.50,
    description: 'Union Bank FD offers safe investment with government security and competitive interest rates.',
    benefits: [
      'Government backed',
      'Senior citizen additional rate',
      'Flexible tenures',
      'Online booking',
      'Auto-renewal facility',
      'Loan against FD'
    ],
    whyChoose: [
      'Public sector reliability',
      'Wide branch network',
      'Safe investment',
      'Easy access',
      'Trusted name',
      'Competitive rates'
    ],
    bankLogo: '🏦',
    bankCategory: 'Government'
  },
  'fd-14': {
    id: 'fd-14',
    bankName: 'IDFC First Bank FD',
    fdType: 'Regular FD',
    interestRate: 7.75,
    tenure: 18,
    tenureLabel: '18 Months',
    minDeposit: 10000,
    maxDeposit: 200000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 8.25,
    description: 'IDFC First Bank offers premium FD rates with modern digital banking and excellent features.',
    benefits: [
      'Higher interest rates',
      'Special senior citizen rates',
      'Digital first approach',
      'Flexible tenure',
      'Auto-renewal option',
      'Sweep facility available'
    ],
    whyChoose: [
      'Competitive rates',
      'Modern banking',
      'Easy online process',
      'Quick activation',
      'Safe and secure',
      'Customer focused'
    ],
    bankLogo: '💼',
    bankCategory: 'Private',
    specialFeature: 'Digital First Banking'
  },
  'fd-15': {
    id: 'fd-15',
    bankName: 'RBL Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.80,
    tenure: 18,
    tenureLabel: '18 Months',
    minDeposit: 10000,
    maxDeposit: 100000000,
    rating: 4,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 8.30,
    description: 'RBL Bank FD offers attractive interest rates with flexible features and premium services.',
    benefits: [
      'High interest rates',
      'Senior citizen benefits',
      'Flexible tenure options',
      'Online FD facility',
      'Auto-sweep available',
      'Loan facility'
    ],
    whyChoose: [
      'Competitive rates',
      'Easy online process',
      'Flexible options',
      'Good customer service',
      'Safe investment',
      'Quick processing'
    ],
    bankLogo: '🏪',
    bankCategory: 'Private'
  },
  'fd-16': {
    id: 'fd-16',
    bankName: 'Mahindra Finance FD',
    fdType: 'Corporate FD',
    interestRate: 8.70,
    tenure: 36,
    tenureLabel: '3 Years',
    minDeposit: 10000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: 'As per terms',
    compoundingFrequency: 'Cumulative',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: false,
    nominationFacility: true,
    seniorCitizenRate: 8.95,
    description: 'Mahindra Finance FD offers high returns with strong credit rating and trusted Mahindra brand.',
    benefits: [
      'High interest rates',
      'CRISIL AAA rated',
      'Additional senior citizen rate',
      'Flexible deposit options',
      'Easy online application',
      'Premature withdrawal available'
    ],
    whyChoose: [
      'Part of Mahindra Group',
      'High credit rating',
      'Attractive returns',
      'Trusted brand',
      'Easy process',
      'Safe investment'
    ],
    bankLogo: '💼',
    bankCategory: 'Private',
    specialFeature: 'Mahindra Group Trust'
  },
  'fd-17': {
    id: 'fd-17',
    bankName: 'Shriram Finance FD',
    fdType: 'Corporate FD',
    interestRate: 9.20,
    tenure: 60,
    tenureLabel: '5 Years',
    minDeposit: 5000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: 'Applicable charges',
    compoundingFrequency: 'Cumulative',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: false,
    nominationFacility: true,
    seniorCitizenRate: 9.45,
    description: 'Shriram Finance FD offers one of the highest interest rates with top credit rating and flexible options.',
    benefits: [
      'Highest interest rates in market',
      'CRISIL AAA/STABLE rated',
      'Senior citizen benefits',
      'Monthly interest payout option',
      'Premature withdrawal facility',
      'Easy online application'
    ],
    whyChoose: [
      'Market-leading rates',
      'Top credit rating',
      'Trusted NBFC',
      'Flexible tenure',
      'High returns',
      'Safe investment'
    ],
    bankLogo: '💰',
    bankCategory: 'Private',
    specialFeature: 'Highest Market Returns'
  },
  'fd-18': {
    id: 'fd-18',
    bankName: 'DCB Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.90,
    tenure: 18,
    tenureLabel: '18 Months',
    minDeposit: 10000,
    maxDeposit: 100000000,
    rating: 4,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 8.40,
    description: 'DCB Bank offers premium FD rates with flexible features and excellent customer service.',
    benefits: [
      'Attractive interest rates',
      'Senior citizen benefits',
      'Flexible tenure periods',
      'Online FD booking',
      'Auto-renewal facility',
      'Sweep-in option'
    ],
    whyChoose: [
      'Competitive rates',
      'Easy processing',
      'Flexible options',
      'Good service',
      'Safe investment',
      'Quick activation'
    ],
    bankLogo: '🏢',
    bankCategory: 'Private'
  },
  'fd-19': {
    id: 'fd-19',
    bankName: 'Indian Bank Fixed Deposit',
    fdType: 'Regular FD',
    interestRate: 7.00,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 1000,
    maxDeposit: 100000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% on interest',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 7.50,
    description: 'Indian Bank FD provides secure investment with government backing and reliable returns.',
    benefits: [
      'Government guaranteed',
      'Senior citizen benefits',
      'Wide branch network',
      'Online FD facility',
      'Auto-renewal option',
      'Tax saving available'
    ],
    whyChoose: [
      'Public sector security',
      'Pan-India presence',
      'Trusted bank',
      'Easy access',
      'Safe investment',
      'Competitive rates'
    ],
    bankLogo: '🏛️',
    bankCategory: 'Government'
  },
  'fd-20': {
    id: 'fd-20',
    bankName: 'Standard Chartered FD',
    fdType: 'Regular FD',
    interestRate: 7.50,
    tenure: 12,
    tenureLabel: '1 Year',
    minDeposit: 25000,
    maxDeposit: 500000000,
    rating: 5,
    taxSavingBenefit: false,
    prematureWithdrawal: true,
    prematureWithdrawalPenalty: '1% penalty',
    compoundingFrequency: 'Quarterly',
    payoutType: 'Cumulative',
    tdsCertificate: true,
    autoRenewal: true,
    nominationFacility: true,
    seniorCitizenRate: 8.00,
    description: 'Standard Chartered FD offers premium banking services with competitive rates and international banking standards.',
    benefits: [
      'International banking standards',
      'Premium customer service',
      'Competitive rates',
      'Digital banking excellence',
      'Flexible tenure options',
      'Auto-renewal facility'
    ],
    whyChoose: [
      'Global banking brand',
      'Premium services',
      'High safety standards',
      'Excellent support',
      'Modern banking',
      'Trusted worldwide'
    ],
    bankLogo: '🌐',
    bankCategory: 'Private',
    specialFeature: 'International Banking Standards'
  }
};

// Helper function to calculate FD maturity amount
export function calculateFDMaturity(
  principal: number,
  interestRate: number,
  tenureMonths: number,
  compoundingFrequency: string = 'Quarterly'
): { maturityAmount: number; interestEarned: number } {
  const rate = interestRate / 100;
  const years = tenureMonths / 12;
  
  let compoundingsPerYear = 4; // Quarterly by default
  if (compoundingFrequency === 'Monthly') compoundingsPerYear = 12;
  else if (compoundingFrequency === 'Half-Yearly') compoundingsPerYear = 2;
  else if (compoundingFrequency === 'Yearly') compoundingsPerYear = 1;
  
  const maturityAmount = principal * Math.pow(
    1 + rate / compoundingsPerYear,
    compoundingsPerYear * years
  );
  
  const interestEarned = maturityAmount - principal;
  
  return {
    maturityAmount: Math.round(maturityAmount),
    interestEarned: Math.round(interestEarned)
  };
}
