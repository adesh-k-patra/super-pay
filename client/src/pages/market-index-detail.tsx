import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { PriceChart } from "@/components/ui/price-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info
} from "lucide-react";

const generateMockPriceData = (days: number = 30, basePrice: number = 25000) => {
  const data = [];
  let price = basePrice + Math.random() * 200;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 100;
    price += change;
    
    const open = price;
    const close = price + (Math.random() - 0.5) * 50;
    const high = Math.max(open, close) + Math.random() * 30;
    const low = Math.min(open, close) - Math.random() * 30;
    const volume = 100000 + Math.random() * 500000;
    
    data.push({
      timestamp: Date.now() - (days - i) * 24 * 60 * 60 * 1000,
      open,
      high,
      low,
      close,
      volume
    });
    
    price = close;
  }
  
  return data;
};

const MARKET_INDICES_DATA: any = {
  "NIFTY50": {
    symbol: "NIFTY50",
    name: "NIFTY 50",
    fullName: "Nifty 50 Index",
    currentPrice: 25181.80,
    change: 135.40,
    changePercent: 0.54,
    description: "The NIFTY 50 is a diversified 50-stock index accounting for 13 sectors of the economy. It is used for a variety of purposes such as benchmarking fund portfolios, index based derivatives and index funds.",
    basePrice: 25000,
    constituents: 50,
    exchange: "NSE",
    sector: "Index",
    yearHigh: 26277.35,
    yearLow: 21281.45,
    pe: 23.5,
    pb: 4.2,
    marketCap: "₹142.5 Lakh Cr",
    topStocks: [
      { symbol: "RELIANCE", name: "Reliance Industries", weight: "9.2%" },
      { symbol: "HDFCBANK", name: "HDFC Bank", weight: "8.1%" },
      { symbol: "INFY", name: "Infosys", weight: "6.3%" },
      { symbol: "ICICIBANK", name: "ICICI Bank", weight: "6.0%" },
      { symbol: "TCS", name: "TCS", weight: "5.8%" }
    ],
    sectorDistribution: [
      { sector: "Financial Services", weight: "35.2%" },
      { sector: "Information Technology", weight: "18.4%" },
      { sector: "Oil & Gas", weight: "12.6%" },
      { sector: "Consumer Goods", weight: "9.8%" },
      { sector: "Automobile", weight: "7.3%" }
    ]
  },
  "SENSEX": {
    symbol: "SENSEX",
    name: "SENSEX",
    fullName: "S&P BSE Sensex",
    currentPrice: 82172.10,
    change: 400.25,
    changePercent: 0.49,
    description: "The S&P BSE Sensex is a free-float market-weighted stock market index of 30 well-established and financially sound companies listed on Bombay Stock Exchange (BSE).",
    basePrice: 82000,
    constituents: 30,
    exchange: "BSE",
    sector: "Index",
    yearHigh: 85836.12,
    yearLow: 69296.14,
    pe: 24.1,
    pb: 4.5,
    marketCap: "₹138.2 Lakh Cr",
    topStocks: [
      { symbol: "RELIANCE", name: "Reliance Industries", weight: "10.5%" },
      { symbol: "HDFCBANK", name: "HDFC Bank", weight: "9.8%" },
      { symbol: "INFY", name: "Infosys", weight: "7.2%" },
      { symbol: "ICICIBANK", name: "ICICI Bank", weight: "7.0%" },
      { symbol: "TCS", name: "TCS", weight: "6.5%" }
    ],
    sectorDistribution: [
      { sector: "Financial Services", weight: "38.5%" },
      { sector: "Information Technology", weight: "16.2%" },
      { sector: "Oil & Gas", weight: "13.8%" },
      { sector: "Consumer Goods", weight: "10.1%" },
      { sector: "Healthcare", weight: "6.4%" }
    ]
  }
};

export default function MarketIndexDetail() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { goBack } = useNavigationHistory();
  const [activeTab, setActiveTab] = useUrlTab("overview");
  const [priceData, setPriceData] = useState<any[]>([]);
  
  const symbol = (params.symbol || "NIFTY50").toUpperCase();
  const indexData = MARKET_INDICES_DATA[symbol];
  
  const [liveIndexData, setLiveIndexData] = useState<any>(indexData);

  useEffect(() => {
    if (indexData) {
      setLiveIndexData(indexData);
      setPriceData(generateMockPriceData(30, indexData.basePrice));
    }
  }, [symbol, indexData]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIndexData((prev: any) => {
        if (!prev) return prev;
        
        const randomChange = (Math.random() - 0.5) * 0.15;
        const changePercent = randomChange;
        const change = prev.currentPrice * (changePercent / 100);
        const newPrice = prev.currentPrice + change;
        
        return {
          ...prev,
          currentPrice: Math.max(newPrice, prev.basePrice * 0.9),
          change: prev.change + change,
          changePercent: prev.changePercent + changePercent,
        };
      });
      
      setPriceData(prevData => {
        if (prevData.length === 0) return prevData;
        const lastPoint = prevData[prevData.length - 1];
        const randomChange = (Math.random() - 0.5) * lastPoint.close * 0.002;
        const newClose = Math.max(lastPoint.close + randomChange, indexData?.basePrice * 0.9 || 1000);
        
        const newPoint = {
          timestamp: Date.now(),
          open: lastPoint.close,
          close: newClose,
          high: Math.max(lastPoint.close, newClose) * (1 + Math.random() * 0.001),
          low: Math.min(lastPoint.close, newClose) * (1 - Math.random() * 0.001),
          volume: 100000 + Math.random() * 500000,
        };
        
        const updatedData = [...prevData.slice(-99), newPoint];
        return updatedData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [indexData]);

  const handleTimeframeChange = (timeframe: string) => {
    const timeframeMap: { [key: string]: number } = {
      '1D': 1,
      '1W': 7,
      '1MO': 30,
      '1Y': 365,
      '5Y': 1825,
      'YTD': 90,
    };
    const days = timeframeMap[timeframe] || 30;
    setPriceData(generateMockPriceData(days, indexData?.basePrice || 25000));
  };

  if (!indexData) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider uppercase">INDEX NOT FOUND</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
        <div className="pt-32 px-4">
          <Card className="bg-white/5 border border-white/10 rounded-none max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <p className="text-white/60 mb-6">The requested market index could not be found.</p>
              <Button 
                onClick={() => navigate("/investment")}
                className="bg-white text-black hover:bg-white/90"
                data-testid="button-back-investments"
              >
                Back to Investments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isPositive = liveIndexData.change >= 0;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 mx-4 text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">{liveIndexData.fullName}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{liveIndexData.symbol} • {liveIndexData.exchange}</p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="space-y-6">
            <PriceChart
              symbol={liveIndexData.symbol}
              data={priceData}
              currentPrice={liveIndexData.currentPrice}
              change={liveIndexData.change}
              changePercent={liveIndexData.changePercent}
              onTimeframeChange={handleTimeframeChange}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-none p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="constituents" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-constituents">Top Stocks</TabsTrigger>
                <TabsTrigger value="sectors" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-sectors">Sectors</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-white/5 border border-white/10 rounded-none">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-light tracking-wide flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      About {liveIndexData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 leading-relaxed font-light">{liveIndexData.description}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border border-white/10 rounded-none">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-light tracking-wide flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">Constituents</p>
                        <p className="text-xl font-light text-white">{liveIndexData.constituents}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">P/E Ratio</p>
                        <p className="text-xl font-light text-white">{liveIndexData.pe}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">P/B Ratio</p>
                        <p className="text-xl font-light text-white">{liveIndexData.pb}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">52W High</p>
                        <p className="text-xl font-light text-white">{liveIndexData.yearHigh.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">52W Low</p>
                        <p className="text-xl font-light text-white">{liveIndexData.yearLow.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">Market Cap</p>
                        <p className="text-xl font-light text-white">{liveIndexData.marketCap}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="constituents" className="space-y-6">
                <Card className="bg-white/5 border border-white/10 rounded-none">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-light tracking-wide">Top 5 Stocks by Weight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {liveIndexData.topStocks.map((stock: any, index: number) => (
                        <div 
                          key={stock.symbol}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => navigate(`/stocks/${stock.symbol}`)}
                          data-testid={`stock-${stock.symbol}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-none flex items-center justify-center">
                              <span className="text-sm font-light text-white">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-light text-white">{stock.symbol}</p>
                              <p className="text-xs text-white/60 font-light">{stock.name}</p>
                            </div>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">{stock.weight}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sectors" className="space-y-6">
                <Card className="bg-white/5 border border-white/10 rounded-none">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-light tracking-wide">Sector Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {liveIndexData.sectorDistribution.map((sector: any) => (
                        <div key={sector.sector}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-light text-white">{sector.sector}</span>
                            <span className="text-sm font-light text-white/60">{sector.weight}</span>
                          </div>
                          <div className="w-full bg-white/10 h-2 rounded-none overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-300"
                              style={{ width: sector.weight }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
