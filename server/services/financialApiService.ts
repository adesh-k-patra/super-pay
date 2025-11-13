export interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  pe?: number;
  volume?: string;
  high52w?: number;
  low52w?: number;
  sector?: string;
  industry?: string;
}

export interface MutualFundData {
  symbol: string;
  name: string;
  nav: number;
  change: number;
  changePercent: number;
  aum: string;
  expenseRatio: number;
  returns1y: number;
  returns3y: number;
  returns5y: number;
  category: string;
  riskLevel: string;
  fundHouse: string;
  minInvestment: number;
}

export interface MarketPrediction {
  symbol: string;
  name: string;
  currentPrice: string;
  predictedPrice: string;
  confidence: number;
  timeframe: string;
  changePercent: string;
  riskLevel: string;
  aiRating: string;
  keyReasons: string[];
}

export interface CryptoData {
  symbol: string;
  name: string;
  currentPrice: number;
  priceInr: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface PreciousMetalData {
  name: string;
  pricePerGram: number;
  pricePerOunce: number;
  change24h: number;
  changePercent24h: number;
  currency: string;
  lastUpdated: string;
}

export interface FinancialApiService {
  getStockData(symbol: string): Promise<StockData | null>;
  getMutualFundData(symbol: string): Promise<MutualFundData | null>;
  getMarketPredictions(): Promise<MarketPrediction[]>;
  searchStocks(query: string): Promise<StockData[]>;
  searchMutualFunds(query: string): Promise<MutualFundData[]>;
  getCryptoPrice(symbol: string): Promise<CryptoData | null>;
  getGoldPrice(): Promise<PreciousMetalData | null>;
  getSilverPrice(): Promise<PreciousMetalData | null>;
}

class MockFinancialApiService implements FinancialApiService {
  
  private mockStocks: Record<string, StockData> = {
    'RELIANCE': {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      currentPrice: 2847.50,
      change: 23.75,
      changePercent: 0.84,
      marketCap: '19.2L Cr',
      pe: 24.5,
      volume: '1.2M',
      high52w: 3024.90,
      low52w: 2220.30,
      sector: 'Energy',
      industry: 'Oil & Gas'
    },
    'TCS': {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      currentPrice: 3842.30,
      change: 45.20,
      changePercent: 1.19,
      marketCap: '14.1L Cr',
      pe: 28.7,
      volume: '0.8M',
      high52w: 4043.70,
      low52w: 3000.25,
      sector: 'Technology',
      industry: 'IT Services'
    },
    'HDFCBANK': {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      currentPrice: 1678.25,
      change: 12.85,
      changePercent: 0.77,
      marketCap: '12.7L Cr',
      pe: 18.9,
      volume: '2.1M',
      high52w: 1794.50,
      low52w: 1363.55,
      sector: 'Financial Services',
      industry: 'Banking'
    },
    'INFY': {
      symbol: 'INFY',
      name: 'Infosys Ltd',
      currentPrice: 1647.50,
      change: -15.30,
      changePercent: -0.92,
      marketCap: '6.8L Cr',
      pe: 26.4,
      volume: '1.5M',
      high52w: 1889.75,
      low52w: 1351.65,
      sector: 'Technology',
      industry: 'IT Services'
    }
  };

  private mockMutualFunds: Record<string, MutualFundData> = {
    'mf-1': {
      symbol: 'mf-1',
      name: 'HDFC Top 100 Fund',
      nav: 520.85,
      change: 4.25,
      changePercent: 0.82,
      aum: '45,678 Cr',
      expenseRatio: 1.25,
      returns1y: 12.5,
      returns3y: 14.2,
      returns5y: 13.8,
      category: 'Large Cap',
      riskLevel: 'Moderate',
      fundHouse: 'HDFC Mutual Fund',
      minInvestment: 500
    },
    'mf-2': {
      symbol: 'mf-2',
      name: 'SBI Small Cap Fund',
      nav: 145.67,
      change: -2.33,
      changePercent: -1.57,
      aum: '12,456 Cr',
      expenseRatio: 1.75,
      returns1y: 18.7,
      returns3y: 16.4,
      returns5y: 15.9,
      category: 'Small Cap',
      riskLevel: 'High',
      fundHouse: 'SBI Mutual Fund',
      minInvestment: 500
    },
    'mf-3': {
      symbol: 'mf-3',
      name: 'ICICI Prudential Bluechip Fund',
      nav: 67.89,
      change: 0.45,
      changePercent: 0.67,
      aum: '23,890 Cr',
      expenseRatio: 1.05,
      returns1y: 11.3,
      returns3y: 13.7,
      returns5y: 12.9,
      category: 'Large Cap',
      riskLevel: 'Moderate',
      fundHouse: 'ICICI Prudential Mutual Fund',
      minInvestment: 1000
    }
  };

  async getStockData(symbol: string): Promise<StockData | null> {
    // In production, this would call APIs like ICICI Breeze, TrueData, Global Datafeeds
    return this.mockStocks[symbol] || null;
  }

  async getMutualFundData(symbol: string): Promise<MutualFundData | null> {
    // In production, this would call MFAPI.in, Tarrakki, or other MF APIs
    return this.mockMutualFunds[symbol] || null;
  }

  async getMarketPredictions(): Promise<MarketPrediction[]> {
    // In production, this would use AI/ML models or financial data providers
    return [
      {
        symbol: "RELIANCE",
        name: "Reliance Industries",
        currentPrice: "2847.50",
        predictedPrice: "3125.20",
        confidence: 85,
        timeframe: "1week",
        changePercent: "9.7",
        riskLevel: "medium",
        aiRating: "4.2",
        keyReasons: [
          "Strong quarterly earnings growth",
          "Expansion in green energy sector", 
          "Positive oil price trends",
          "New retail ventures showing promise"
        ]
      },
      {
        symbol: "TCS",
        name: "Tata Consultancy Services", 
        currentPrice: "3842.30",
        predictedPrice: "4120.85",
        confidence: 91,
        timeframe: "1week",
        changePercent: "7.2",
        riskLevel: "low",
        aiRating: "4.6",
        keyReasons: [
          "Strong order book momentum",
          "Digital transformation demand",
          "Currency headwinds reducing",
          "AI/ML service expansion"
        ]
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank",
        currentPrice: "1678.25",
        predictedPrice: "1789.45",
        confidence: 88,
        timeframe: "1week", 
        changePercent: "6.6",
        riskLevel: "low",
        aiRating: "4.4",
        keyReasons: [
          "Credit growth momentum",
          "Asset quality improvement",
          "Digital banking expansion",
          "Rural recovery signs"
        ]
      }
    ];
  }

  async searchStocks(query: string): Promise<StockData[]> {
    const results = Object.values(this.mockStocks).filter(stock => 
      stock.name.toLowerCase().includes(query.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  }

  async searchMutualFunds(query: string): Promise<MutualFundData[]> {
    const results = Object.values(this.mockMutualFunds).filter(fund =>
      fund.name.toLowerCase().includes(query.toLowerCase()) ||
      fund.fundHouse.toLowerCase().includes(query.toLowerCase()) ||
      fund.category.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  }

  async getCryptoPrice(symbol: string): Promise<CryptoData | null> {
    try {
      const cryptoIdMap: Record<string, string> = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'BNB': 'binancecoin',
        'USDT': 'tether',
        'SOL': 'solana',
        'XRP': 'ripple',
        'DOGE': 'dogecoin',
        'ADA': 'cardano'
      };

      const cryptoId = cryptoIdMap[symbol.toUpperCase()];
      if (!cryptoId) {
        return null;
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd,inr&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('CoinGecko API error:', response.status);
        return null;
      }

      const data = await response.json();
      const coinData = data[cryptoId];

      if (!coinData) {
        return null;
      }

      return {
        symbol: symbol.toUpperCase(),
        name: cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1),
        currentPrice: coinData.usd || 0,
        priceInr: coinData.inr || 0,
        change24h: coinData.usd_24h_change || 0,
        changePercent24h: coinData.usd_24h_change || 0,
        marketCap: coinData.usd_market_cap || 0,
        volume24h: coinData.usd_24h_vol || 0,
        high24h: 0,
        low24h: 0,
      };
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return null;
    }
  }

  async getGoldPrice(): Promise<PreciousMetalData | null> {
    try {
      // Using current market data as of Oct 9, 2025
      // In production, you would use an API like GoldPriceZ, Metals.Dev, or MetalPriceAPI
      return {
        name: 'Gold 24K',
        pricePerGram: 12415,
        pricePerOunce: 385920,
        change24h: 22,
        changePercent24h: 0.18,
        currency: 'INR',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching gold price:', error);
      return null;
    }
  }

  async getSilverPrice(): Promise<PreciousMetalData | null> {
    try {
      // Using current market data as of Oct 9, 2025
      // In production, you would use an API like GoldPriceZ, Metals.Dev, or MetalPriceAPI
      return {
        name: 'Silver 99.9%',
        pricePerGram: 167,
        pricePerOunce: 5191,
        change24h: 0.6,
        changePercent24h: 0.36,
        currency: 'INR',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching silver price:', error);
      return null;
    }
  }
}

// For production, you would create different implementations:
// class ICICIBreezeService, class TrueDataService, class MFAPIService, etc.

export const financialApiService = new MockFinancialApiService();