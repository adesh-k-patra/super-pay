export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: string;
  volume: string;
  domain: string;
}

export const STOCK_DOMAINS = [
  { id: "all", label: "All", count: 0 },
  { id: "technology", label: "Technology", count: 0 },
  { id: "finance", label: "Finance", count: 0 },
  { id: "healthcare", label: "Healthcare", count: 0 },
  { id: "manufacturing", label: "Manufacturing", count: 0 },
  { id: "energy", label: "Energy", count: 0 },
  { id: "consumer", label: "Consumer Goods", count: 0 },
  { id: "telecom", label: "Telecom", count: 0 },
  { id: "automotive", label: "Automotive", count: 0 },
  { id: "pharma", label: "Pharmaceuticals", count: 0 },
  { id: "realestate", label: "Real Estate", count: 0 },
];

export const ALL_STOCKS: StockData[] = [
  // Technology Sector (20 stocks)
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3520.40, change: -0.85, marketCap: "12.8L Cr", volume: "1.8M", domain: "technology" },
  { symbol: "INFY", name: "Infosys Ltd", price: 1647.50, change: -0.43, marketCap: "6.8L Cr", volume: "2.1M", domain: "technology" },
  { symbol: "WIPRO", name: "Wipro Ltd", price: 428.75, change: 1.24, marketCap: "2.3L Cr", volume: "4.2M", domain: "technology" },
  { symbol: "HCLTECH", name: "HCL Technologies", price: 1234.60, change: 0.89, marketCap: "3.4L Cr", volume: "2.8M", domain: "technology" },
  { symbol: "TECHM", name: "Tech Mahindra", price: 1089.30, change: -1.12, marketCap: "1.1L Cr", volume: "3.5M", domain: "technology" },
  { symbol: "LTTS", name: "L&T Technology Services", price: 4567.80, change: 2.15, marketCap: "0.5L Cr", volume: "0.8M", domain: "technology" },
  { symbol: "PERSISTENT", name: "Persistent Systems", price: 5234.90, change: 1.87, marketCap: "0.4L Cr", volume: "0.6M", domain: "technology" },
  { symbol: "COFORGE", name: "Coforge Ltd", price: 6789.50, change: -0.65, marketCap: "0.4L Cr", volume: "0.5M", domain: "technology" },
  { symbol: "MPHASIS", name: "Mphasis Ltd", price: 2456.70, change: 0.92, marketCap: "0.5L Cr", volume: "1.2M", domain: "technology" },
  { symbol: "MINDTREE", name: "LTIMindtree", price: 5678.90, change: 1.45, marketCap: "1.7L Cr", volume: "0.9M", domain: "technology" },
  { symbol: "TATAELXSI", name: "Tata Elxsi", price: 7890.40, change: 2.34, marketCap: "0.5L Cr", volume: "0.4M", domain: "technology" },
  { symbol: "SONATSOFTW", name: "Sonata Software", price: 567.80, change: -0.78, marketCap: "0.04L Cr", volume: "0.9M", domain: "technology" },
  { symbol: "CYIENT", name: "Cyient Ltd", price: 1789.60, change: 1.23, marketCap: "0.2L Cr", volume: "0.7M", domain: "technology" },
  { symbol: "OFSS", name: "Oracle Financial Services", price: 11234.50, change: -0.95, marketCap: "1.8L Cr", volume: "0.3M", domain: "technology" },
  { symbol: "ZOMATO", name: "Zomato Ltd", price: 234.60, change: 3.45, marketCap: "2.1L Cr", volume: "28.5M", domain: "technology" },
  { symbol: "NAUKRI", name: "Info Edge (Naukri)", price: 5678.90, change: 1.89, marketCap: "0.7L Cr", volume: "0.6M", domain: "technology" },
  { symbol: "PAYTM", name: "Paytm (One97)", price: 456.70, change: -2.34, marketCap: "0.3L Cr", volume: "12.4M", domain: "technology" },
  { symbol: "POLICYBZR", name: "PB Fintech (PolicyBazaar)", price: 1234.50, change: 1.67, marketCap: "0.6L Cr", volume: "3.2M", domain: "technology" },
  { symbol: "ROUTE", name: "Route Mobile", price: 1567.80, change: -1.23, marketCap: "0.1L Cr", volume: "0.8M", domain: "technology" },
  { symbol: "TATACOMM", name: "Tata Communications", price: 1678.90, change: 0.87, marketCap: "0.5L Cr", volume: "1.4M", domain: "technology" },

  // Finance Sector (20 stocks)
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1687.90, change: 1.12, marketCap: "9.2L Cr", volume: "3.2M", domain: "finance" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1098.65, change: 1.45, marketCap: "7.7L Cr", volume: "4.5M", domain: "finance" },
  { symbol: "SBIN", name: "State Bank of India", price: 678.90, change: 1.89, marketCap: "6.0L Cr", volume: "5.2M", domain: "finance" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1789.45, change: 0.76, marketCap: "3.5L Cr", volume: "2.8M", domain: "finance" },
  { symbol: "AXISBANK", name: "Axis Bank", price: 987.60, change: -0.89, marketCap: "3.0L Cr", volume: "6.8M", domain: "finance" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank", price: 1234.70, change: 1.34, marketCap: "1.0L Cr", volume: "3.5M", domain: "finance" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7234.80, change: 2.12, marketCap: "4.5L Cr", volume: "0.8M", domain: "finance" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv", price: 1567.90, change: 1.45, marketCap: "2.5L Cr", volume: "1.9M", domain: "finance" },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance", price: 678.90, change: 0.92, marketCap: "1.5L Cr", volume: "3.2M", domain: "finance" },
  { symbol: "SBILIFE", name: "SBI Life Insurance", price: 1456.70, change: -0.67, marketCap: "1.5L Cr", volume: "1.8M", domain: "finance" },
  { symbol: "ICICIGI", name: "ICICI Lombard General", price: 1678.90, change: 1.23, marketCap: "0.8L Cr", volume: "0.9M", domain: "finance" },
  { symbol: "HDFCAMC", name: "HDFC Asset Management", price: 3456.80, change: -1.12, marketCap: "0.7L Cr", volume: "0.5M", domain: "finance" },
  { symbol: "MUTHOOTFIN", name: "Muthoot Finance", price: 1234.50, change: 0.89, marketCap: "0.5L Cr", volume: "1.2M", domain: "finance" },
  { symbol: "CHOLAFIN", name: "Cholamandalam Investment", price: 1123.40, change: 1.67, marketCap: "0.9L Cr", volume: "2.1M", domain: "finance" },
  { symbol: "MARICO", name: "Marico Ltd", price: 567.80, change: 0.45, marketCap: "0.7L Cr", volume: "2.8M", domain: "consumer" },
  { symbol: "PFC", name: "Power Finance Corporation", price: 345.60, change: 2.34, marketCap: "0.9L Cr", volume: "8.5M", domain: "finance" },
  { symbol: "RECLTD", name: "REC Ltd", price: 432.10, change: 1.89, marketCap: "1.1L Cr", volume: "7.2M", domain: "finance" },
  { symbol: "LICHSGFIN", name: "LIC Housing Finance", price: 456.70, change: -0.92, marketCap: "0.2L Cr", volume: "4.5M", domain: "finance" },
  { symbol: "PNBHOUSING", name: "PNB Housing Finance", price: 789.50, change: 1.45, marketCap: "0.2L Cr", volume: "2.8M", domain: "finance" },
  { symbol: "SBICARD", name: "SBI Cards", price: 789.60, change: 0.78, marketCap: "0.7L Cr", volume: "2.4M", domain: "finance" },

  // Healthcare Sector (15 stocks)
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals", price: 6234.50, change: 1.45, marketCap: "0.9L Cr", volume: "0.6M", domain: "healthcare" },
  { symbol: "FORTIS", name: "Fortis Healthcare", price: 389.70, change: -0.89, marketCap: "0.3L Cr", volume: "4.2M", domain: "healthcare" },
  { symbol: "MAXHEALTH", name: "Max Healthcare", price: 789.60, change: 1.23, marketCap: "0.7L Cr", volume: "2.1M", domain: "healthcare" },
  { symbol: "NARAYANA", name: "Narayana Hrudayalaya", price: 1123.40, change: 0.92, marketCap: "0.2L Cr", volume: "0.9M", domain: "healthcare" },
  { symbol: "RAINBOW", name: "Rainbow Children's Hospital", price: 678.90, change: -1.12, marketCap: "0.1L Cr", volume: "0.7M", domain: "healthcare" },
  { symbol: "KIMS", name: "KIMS Hospitals", price: 1567.80, change: 2.15, marketCap: "0.3L Cr", volume: "0.5M", domain: "healthcare" },
  { symbol: "LALPATHLAB", name: "Dr Lal PathLabs", price: 2456.70, change: 0.87, marketCap: "0.2L Cr", volume: "0.4M", domain: "healthcare" },
  { symbol: "METROPOLIS", name: "Metropolis Healthcare", price: 1789.50, change: -0.67, marketCap: "0.1L Cr", volume: "0.5M", domain: "healthcare" },
  { symbol: "THYROCARE", name: "Thyrocare Technologies", price: 678.90, change: 1.34, marketCap: "0.03L Cr", volume: "0.8M", domain: "healthcare" },
  { symbol: "STARHEALTH", name: "Star Health Insurance", price: 456.70, change: -2.15, marketCap: "0.3L Cr", volume: "3.2M", domain: "healthcare" },
  { symbol: "MEDANTA", name: "Global Health (Medanta)", price: 789.60, change: 1.67, marketCap: "0.2L Cr", volume: "1.2M", domain: "healthcare" },
  { symbol: "CARERATING", name: "Care Ratings", price: 678.90, change: 0.45, marketCap: "0.05L Cr", volume: "0.6M", domain: "healthcare" },
  { symbol: "Krishna", name: "Krishna Institute Medical", price: 1234.50, change: 1.89, marketCap: "0.1L Cr", volume: "0.4M", domain: "healthcare" },
  { symbol: "YATHARTH", name: "Yatharth Hospital", price: 345.60, change: -0.78, marketCap: "0.05L Cr", volume: "1.1M", domain: "healthcare" },
  { symbol: "SAHYADRI", name: "Sahyadri Hospitals", price: 567.80, change: 1.23, marketCap: "0.04L Cr", volume: "0.7M", domain: "healthcare" },

  // Manufacturing Sector (20 stocks)
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2456.75, change: 2.34, marketCap: "16.5L Cr", volume: "2.5M", domain: "manufacturing" },
  { symbol: "LT", name: "Larsen & Toubro", price: 3456.80, change: 1.23, marketCap: "4.8L Cr", volume: "1.9M", domain: "manufacturing" },
  { symbol: "ADANIENT", name: "Adani Enterprises", price: 2789.60, change: -1.45, marketCap: "3.2L Cr", volume: "2.8M", domain: "manufacturing" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", price: 9876.50, change: 0.89, marketCap: "2.9L Cr", volume: "0.4M", domain: "manufacturing" },
  { symbol: "GRASIM", name: "Grasim Industries", price: 2345.60, change: 1.12, marketCap: "1.6L Cr", volume: "1.2M", domain: "manufacturing" },
  { symbol: "HINDALCO", name: "Hindalco Industries", price: 567.80, change: 2.15, marketCap: "1.3L Cr", volume: "8.5M", domain: "manufacturing" },
  { symbol: "TATASTEEL", name: "Tata Steel", price: 134.50, change: -0.92, marketCap: "1.7L Cr", volume: "24.5M", domain: "manufacturing" },
  { symbol: "JSWSTEEL", name: "JSW Steel", price: 789.60, change: 1.45, marketCap: "1.9L Cr", volume: "6.8M", domain: "manufacturing" },
  { symbol: "SAIL", name: "Steel Authority of India", price: 112.30, change: 1.89, marketCap: "0.5L Cr", volume: "45.2M", domain: "manufacturing" },
  { symbol: "COALINDIA", name: "Coal India", price: 345.60, change: 0.67, marketCap: "2.1L Cr", volume: "12.5M", domain: "manufacturing" },
  { symbol: "VEDL", name: "Vedanta Ltd", price: 278.90, change: -1.23, marketCap: "1.0L Cr", volume: "18.7M", domain: "manufacturing" },
  { symbol: "APLAPOLLO", name: "APL Apollo Tubes", price: 1456.70, change: 2.34, marketCap: "0.4L Cr", volume: "0.9M", domain: "manufacturing" },
  { symbol: "JINDALSTEL", name: "Jindal Steel & Power", price: 876.50, change: 1.12, marketCap: "0.9L Cr", volume: "5.4M", domain: "manufacturing" },
  { symbol: "NMDC", name: "NMDC Ltd", price: 178.90, change: -0.45, marketCap: "0.5L Cr", volume: "15.8M", domain: "manufacturing" },
  { symbol: "HINDZINC", name: "Hindustan Zinc", price: 389.70, change: 1.67, marketCap: "1.6L Cr", volume: "8.2M", domain: "manufacturing" },
  { symbol: "NATIONALUM", name: "National Aluminium", price: 123.40, change: 0.89, marketCap: "0.2L Cr", volume: "22.5M", domain: "manufacturing" },
  { symbol: "ACC", name: "ACC Ltd", price: 2234.50, change: -0.78, marketCap: "0.4L Cr", volume: "0.8M", domain: "manufacturing" },
  { symbol: "AMBUJACEM", name: "Ambuja Cements", price: 567.80, change: 1.23, marketCap: "1.1L Cr", volume: "6.5M", domain: "manufacturing" },
  { symbol: "SHREECEM", name: "Shree Cement", price: 27890.50, change: 0.45, marketCap: "1.0L Cr", volume: "0.1M", domain: "manufacturing" },
  { symbol: "JKCEMENT", name: "JK Cement", price: 3789.60, change: 1.89, marketCap: "0.4L Cr", volume: "0.3M", domain: "manufacturing" },

  // Pharmaceuticals (15 stocks)
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", price: 1567.80, change: 0.92, marketCap: "3.8L Cr", volume: "2.8M", domain: "pharma" },
  { symbol: "DRREDDY", name: "Dr Reddy's Laboratories", price: 5678.90, change: -0.67, marketCap: "0.9L Cr", volume: "0.7M", domain: "pharma" },
  { symbol: "CIPLA", name: "Cipla Ltd", price: 1234.50, change: 1.45, marketCap: "1.0L Cr", volume: "2.5M", domain: "pharma" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories", price: 3789.60, change: 0.78, marketCap: "1.0L Cr", volume: "0.6M", domain: "pharma" },
  { symbol: "BIOCON", name: "Biocon Ltd", price: 289.70, change: -1.12, marketCap: "0.3L Cr", volume: "8.5M", domain: "pharma" },
  { symbol: "LUPIN", name: "Lupin Ltd", price: 1678.90, change: 1.89, marketCap: "0.8L Cr", volume: "1.9M", domain: "pharma" },
  { symbol: "AUROPHARMA", name: "Aurobindo Pharma", price: 1123.40, change: 0.45, marketCap: "0.7L Cr", volume: "2.4M", domain: "pharma" },
  { symbol: "TORNTPHARM", name: "Torrent Pharmaceuticals", price: 2789.60, change: -0.89, marketCap: "0.9L Cr", volume: "0.5M", domain: "pharma" },
  { symbol: "ALKEM", name: "Alkem Laboratories", price: 5234.70, change: 1.23, marketCap: "0.6L Cr", volume: "0.3M", domain: "pharma" },
  { symbol: "ABBOTINDIA", name: "Abbott India", price: 27890.50, change: 0.67, marketCap: "0.6L Cr", volume: "0.02M", domain: "pharma" },
  { symbol: "GLENMARK", name: "Glenmark Pharmaceuticals", price: 789.60, change: 1.67, marketCap: "0.2L Cr", volume: "3.2M", domain: "pharma" },
  { symbol: "CADILAHC", name: "Zydus Lifesciences", price: 789.50, change: -1.23, marketCap: "0.8L Cr", volume: "2.8M", domain: "pharma" },
  { symbol: "IPCALAB", name: "Ipca Laboratories", price: 1234.50, change: 2.15, marketCap: "0.3L Cr", volume: "0.9M", domain: "pharma" },
  { symbol: "SANOFI", name: "Sanofi India", price: 6789.40, change: 0.45, marketCap: "0.1L Cr", volume: "0.1M", domain: "pharma" },
  { symbol: "PFIZER", name: "Pfizer Ltd", price: 4567.80, change: -0.78, marketCap: "0.03L Cr", volume: "0.05M", domain: "pharma" },

  // Energy Sector (15 stocks)
  { symbol: "ADANIGREEN", name: "Adani Green Energy", price: 1789.60, change: -2.15, marketCap: "2.9L Cr", volume: "3.8M", domain: "energy" },
  { symbol: "NTPC", name: "NTPC Ltd", price: 267.80, change: 0.89, marketCap: "2.6L Cr", volume: "12.5M", domain: "energy" },
  { symbol: "POWERGRID", name: "Power Grid Corporation", price: 234.50, change: 1.23, marketCap: "2.1L Cr", volume: "15.8M", domain: "energy" },
  { symbol: "ADANIPOWER", name: "Adani Power", price: 456.70, change: 2.34, marketCap: "1.7L Cr", volume: "28.5M", domain: "energy" },
  { symbol: "TATAPOWER", name: "Tata Power", price: 278.90, change: 1.45, marketCap: "0.9L Cr", volume: "18.7M", domain: "energy" },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", price: 234.50, change: -0.67, marketCap: "2.9L Cr", volume: "22.5M", domain: "energy" },
  { symbol: "BPCL", name: "Bharat Petroleum", price: 378.90, change: 1.89, marketCap: "0.8L Cr", volume: "14.2M", domain: "energy" },
  { symbol: "IOC", name: "Indian Oil Corporation", price: 123.40, change: 0.45, marketCap: "1.7L Cr", volume: "35.8M", domain: "energy" },
  { symbol: "HINDPETRO", name: "Hindustan Petroleum", price: 289.70, change: -1.12, marketCap: "0.6L Cr", volume: "12.4M", domain: "energy" },
  { symbol: "GAIL", name: "GAIL India", price: 178.90, change: 1.67, marketCap: "1.2L Cr", volume: "18.5M", domain: "energy" },
  { symbol: "TORNTPOWER", name: "Torrent Power", price: 789.60, change: 0.92, marketCap: "0.3L Cr", volume: "2.8M", domain: "energy" },
  { symbol: "JSPL", name: "Jindal Steel Power", price: 678.90, change: -0.78, marketCap: "0.7L Cr", volume: "8.5M", domain: "energy" },
  { symbol: "ADANITRANS", name: "Adani Transmission", price: 1234.50, change: 1.23, marketCap: "1.4L Cr", volume: "1.9M", domain: "energy" },
  { symbol: "NHPC", name: "NHPC Ltd", price: 67.80, change: 2.15, marketCap: "0.7L Cr", volume: "45.2M", domain: "energy" },
  { symbol: "SJVN", name: "SJVN Ltd", price: 89.60, change: 1.45, marketCap: "0.4L Cr", volume: "28.5M", domain: "energy" },

  // Consumer Goods (15 stocks)
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2687.30, change: 0.87, marketCap: "6.3L Cr", volume: "1.2M", domain: "consumer" },
  { symbol: "ITC", name: "ITC Limited", price: 456.30, change: 0.54, marketCap: "5.7L Cr", volume: "6.7M", domain: "consumer" },
  { symbol: "NESTLEIND", name: "Nestle India", price: 23456.70, change: -0.45, marketCap: "2.3L Cr", volume: "0.2M", domain: "consumer" },
  { symbol: "BRITANNIA", name: "Britannia Industries", price: 5234.80, change: 1.23, marketCap: "1.3L Cr", volume: "0.4M", domain: "consumer" },
  { symbol: "DABUR", name: "Dabur India", price: 567.80, change: 0.67, marketCap: "1.0L Cr", volume: "3.5M", domain: "consumer" },
  { symbol: "GODREJCP", name: "Godrej Consumer", price: 1123.40, change: -0.89, marketCap: "1.2L Cr", volume: "1.9M", domain: "consumer" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products", price: 978.90, change: 1.45, marketCap: "0.9L Cr", volume: "2.8M", domain: "consumer" },
  { symbol: "COLPAL", name: "Colgate-Palmolive", price: 2789.60, change: 0.78, marketCap: "0.8L Cr", volume: "0.5M", domain: "consumer" },
  { symbol: "PGHH", name: "Procter & Gamble Health", price: 15678.90, change: -0.92, marketCap: "0.3L Cr", volume: "0.1M", domain: "consumer" },
  { symbol: "EMAMILTD", name: "Emami Ltd", price: 456.70, change: 1.89, marketCap: "0.2L Cr", volume: "2.4M", domain: "consumer" },
  { symbol: "HAVELLS", name: "Havells India", price: 1456.70, change: 1.23, marketCap: "0.9L Cr", volume: "1.2M", domain: "consumer" },
  { symbol: "VOLTAS", name: "Voltas Ltd", price: 989.60, change: -1.12, marketCap: "0.3L Cr", volume: "2.8M", domain: "consumer" },
  { symbol: "WHIRLPOOL", name: "Whirlpool India", price: 1678.90, change: 0.45, marketCap: "0.2L Cr", volume: "0.6M", domain: "consumer" },
  { symbol: "BATAINDIA", name: "Bata India", price: 1567.80, change: 2.15, marketCap: "0.2L Cr", volume: "0.8M", domain: "consumer" },
  { symbol: "TITAN", name: "Titan Company", price: 3456.70, change: 1.67, marketCap: "3.1L Cr", volume: "1.5M", domain: "consumer" },

  // Telecom (8 stocks)
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1234.55, change: -0.67, marketCap: "7.1L Cr", volume: "3.8M", domain: "telecom" },
  { symbol: "IDEA", name: "Vodafone Idea", price: 12.30, change: 3.45, marketCap: "0.9L Cr", volume: "285.5M", domain: "telecom" },
  { symbol: "INDUSTOWER", name: "Indus Towers", price: 234.50, change: 1.23, marketCap: "0.6L Cr", volume: "12.8M", domain: "telecom" },
  { symbol: "TATATEL", name: "Tata Teleservices", price: 89.60, change: -1.45, marketCap: "0.3L Cr", volume: "8.5M", domain: "telecom" },
  { symbol: "GTNIND", name: "GTN Industries", price: 456.70, change: 2.34, marketCap: "0.05L Cr", volume: "1.2M", domain: "telecom" },
  { symbol: "STERLITE", name: "Sterlite Technologies", price: 178.90, change: 1.89, marketCap: "0.1L Cr", volume: "6.5M", domain: "telecom" },
  { symbol: "TEJAS", name: "Tejas Networks", price: 789.60, change: -0.78, marketCap: "0.1L Cr", volume: "2.8M", domain: "telecom" },
  { symbol: "GTLINFRA", name: "GTL Infrastructure", price: 1.23, change: 5.67, marketCap: "0.01L Cr", volume: "125.5M", domain: "telecom" },

  // Automotive (12 stocks)
  { symbol: "MARUTI", name: "Maruti Suzuki", price: 10234.50, change: 1.67, marketCap: "3.1L Cr", volume: "0.5M", domain: "automotive" },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 678.90, change: -1.23, marketCap: "2.4L Cr", volume: "12.5M", domain: "automotive" },
  { symbol: "M&M", name: "Mahindra & Mahindra", price: 1789.60, change: 2.15, marketCap: "2.2L Cr", volume: "2.8M", domain: "automotive" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", price: 8567.80, change: 0.92, marketCap: "2.5L Cr", volume: "0.8M", domain: "automotive" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", price: 4567.90, change: -0.67, marketCap: "0.9L Cr", volume: "0.9M", domain: "automotive" },
  { symbol: "EICHERMOT", name: "Eicher Motors", price: 4789.60, change: 1.45, marketCap: "1.3L Cr", volume: "0.6M", domain: "automotive" },
  { symbol: "BOSCHLTD", name: "Bosch Ltd", price: 19876.50, change: 0.78, marketCap: "0.6L Cr", volume: "0.1M", domain: "automotive" },
  { symbol: "MOTHERSON", name: "Samvardhana Motherson", price: 123.40, change: 1.89, marketCap: "0.8L Cr", volume: "28.5M", domain: "automotive" },
  { symbol: "APOLLOTYRE", name: "Apollo Tyres", price: 389.70, change: -1.12, marketCap: "0.2L Cr", volume: "8.5M", domain: "automotive" },
  { symbol: "MRF", name: "MRF Ltd", price: 123456.70, change: 0.45, marketCap: "0.5L Cr", volume: "0.01M", domain: "automotive" },
  { symbol: "CEAT", name: "CEAT Ltd", price: 2345.60, change: 1.23, marketCap: "0.1L Cr", volume: "0.4M", domain: "automotive" },
  { symbol: "ESCORTS", name: "Escorts Kubota", price: 3456.70, change: 2.34, marketCap: "0.5L Cr", volume: "0.7M", domain: "automotive" },

  // Real Estate (10 stocks)
  { symbol: "DLF", name: "DLF Ltd", price: 789.60, change: 1.45, marketCap: "2.0L Cr", volume: "6.8M", domain: "realestate" },
  { symbol: "GODREJPROP", name: "Godrej Properties", price: 2456.70, change: 0.92, marketCap: "0.7L Cr", volume: "1.2M", domain: "realestate" },
  { symbol: "OBEROIRLTY", name: "Oberoi Realty", price: 1567.80, change: -0.67, marketCap: "0.6L Cr", volume: "0.8M", domain: "realestate" },
  { symbol: "BRIGADE", name: "Brigade Enterprises", price: 678.90, change: 1.89, marketCap: "0.1L Cr", volume: "1.5M", domain: "realestate" },
  { symbol: "PRESTIGE", name: "Prestige Estates", price: 1234.50, change: 1.23, marketCap: "0.5L Cr", volume: "1.9M", domain: "realestate" },
  { symbol: "LODHA", name: "Macrotech Developers", price: 1089.60, change: -1.12, marketCap: "1.0L Cr", volume: "2.8M", domain: "realestate" },
  { symbol: "SOBHA", name: "Sobha Ltd", price: 1456.70, change: 2.15, marketCap: "0.1L Cr", volume: "0.6M", domain: "realestate" },
  { symbol: "PHOENIXLTD", name: "Phoenix Mills", price: 2345.60, change: 0.78, marketCap: "0.5L Cr", volume: "0.7M", domain: "realestate" },
  { symbol: "SUNTECK", name: "Sunteck Realty", price: 456.70, change: 1.67, marketCap: "0.1L Cr", volume: "2.4M", domain: "realestate" },
  { symbol: "MAHLIFE", name: "Mahindra Lifespace", price: 567.80, change: -0.89, marketCap: "0.1L Cr", volume: "1.8M", domain: "realestate" },
];

// Update domain counts
STOCK_DOMAINS.forEach(domain => {
  if (domain.id === "all") {
    domain.count = ALL_STOCKS.length;
  } else {
    domain.count = ALL_STOCKS.filter(stock => stock.domain === domain.id).length;
  }
});

export function getStocksByDomain(domainId: string): StockData[] {
  if (domainId === "all") {
    return ALL_STOCKS;
  }
  return ALL_STOCKS.filter(stock => stock.domain === domainId);
}

export function searchStocks(query: string): StockData[] {
  const lowerQuery = query.toLowerCase();
  return ALL_STOCKS.filter(stock => 
    stock.name.toLowerCase().includes(lowerQuery) ||
    stock.symbol.toLowerCase().includes(lowerQuery)
  );
}
