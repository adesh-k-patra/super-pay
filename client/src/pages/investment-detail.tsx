import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, useSearch } from "wouter";
import { InvestmentTradeDialog } from "@/components/ui/investment-trade-dialog";
import { PriceChart } from "@/components/ui/price-chart";
import { InvestmentNews } from "@/components/ui/investment-news";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getMutualFund } from "@/data/mutual-funds";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import type { InsertInvestmentOrder } from "@shared/schema";
import { 
  Star,
  Heart,
  Share2,
  Bell,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  Bookmark,
  Plus,
  Award,
  Users,
  Target,
  CheckCircle,
  ArrowLeft
} from "lucide-react";


// Mock data - in real app this would come from APIs
const generateMockPriceData = (days: number = 30) => {
  const data = [];
  let price = 2800 + Math.random() * 200;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 50;
    price += change;
    
    const open = price;
    const close = price + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 10;
    const low = Math.min(open, close) - Math.random() * 10;
    const volume = 10000 + Math.random() * 50000;
    
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

const InvestmentDetail = () => {
  const [, navigate] = useLocation();
  const params = useParams();
  const searchString = useSearch();
  const { goBack } = useNavigationHistory();
  const [activeTab, setActiveTab] = useUrlTab("overview");
  const [watchlisted, setWatchlisted] = useState(false);
  const [priceData, setPriceData] = useState(generateMockPriceData());
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  // Get symbol from URL params or use default
  const symbol = params.symbol || "RELIANCE";
  
  // Parse return URL params
  const urlParams = new URLSearchParams(searchString);
  const returnTo = urlParams.get('returnTo');
  const returnTab = urlParams.get('returnTab');
  const returnSubTab = urlParams.get('returnSubTab');
  
  // Custom back navigation that preserves tab state
  const handleBack = () => {
    if (returnTo && returnTab) {
      const params = new URLSearchParams();
      params.set('tab', returnTab);
      if (returnSubTab) params.set('subtab', returnSubTab);
      navigate(`${returnTo}?${params.toString()}`);
    } else {
      goBack();
    }
  };
  
  // Mock investment data with mutual fund support (will be updated live)
  const [liveInvestmentData, setLiveInvestmentData] = useState<any>(null);
  
  // Live price updates every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveInvestmentData((prev: any) => {
        if (!prev) return prev;
        
        const randomChange = (Math.random() - 0.5) * 0.2; // Small random change  
        const changePercent = randomChange;
        const change = prev.currentPrice * (changePercent / 100);
        const newPrice = prev.currentPrice + change;
        
        return {
          ...prev,
          currentPrice: Math.max(newPrice, 100), // Ensure price doesn't go too low
          change: prev.change + change,
          changePercent: prev.changePercent + changePercent,
        };
      });
      
      // Also update chart data
      setPriceData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        const randomChange = (Math.random() - 0.5) * lastPoint.close * 0.002;
        const newClose = Math.max(lastPoint.close + randomChange, 100);
        
        const newPoint = {
          timestamp: Date.now(),
          open: lastPoint.close,
          close: newClose,
          high: Math.max(lastPoint.close, newClose) * (1 + Math.random() * 0.001),
          low: Math.min(lastPoint.close, newClose) * (1 - Math.random() * 0.001),
          volume: 10000 + Math.random() * 50000,
        };
        
        // Keep only last 100 points for performance
        const updatedData = [...prevData.slice(-99), newPoint];
        return updatedData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getInvestmentData = (symbol: string) => {
    // Mutual Fund Data - Get from comprehensive data file
    if (symbol.startsWith('mf-')) {
      const fundData = getMutualFund(symbol);
      if (fundData) {
        return {
          ...fundData,
          fundManagerName: fundData.fundManager.name
        };
      }
      // Fallback to first fund if specific symbol not found
      const defaultFund = getMutualFund('mf-1');
      return defaultFund ? { ...defaultFund, fundManagerName: defaultFund.fundManager.name } : null;
    }
    
    // Default stock data
    return {
      symbol: symbol,
      instrumentName: "Reliance Industries Ltd",
      currentPrice: 2847.50,
      change: 23.75,
      changePercent: 0.84,
      marketCap: "19.2L Cr",
      pe: 24.5,
      pb: 2.1,
      dividend: 1.2,
      sector: "Oil & Gas",
      industry: "Refineries",
      description: "Reliance Industries Limited is an Indian multinational conglomerate company headquartered in Mumbai. It has businesses in petrochemicals, oil and gas, telecommunications, and retail.",
      availableFunds: 50000,
      holdings: 25
    };
  };
  
  const staticInvestmentData = useMemo(() => getInvestmentData(symbol), [symbol]);
  const isMutualFund = symbol.startsWith('mf-');
  
  // Initialize and reset live data when symbol changes
  useEffect(() => {
    if (staticInvestmentData) {
      setLiveInvestmentData(staticInvestmentData);
      setPriceData(generateMockPriceData());
    }
  }, [symbol, staticInvestmentData]);
  
  // Use live data if available, otherwise use static data
  const investmentData = liveInvestmentData || staticInvestmentData;
  
  // If investmentData is null, return error state
  if (!investmentData) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider uppercase">INVESTMENT NOT FOUND</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Error</p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
        <div className="pt-32 px-4">
          <Card className="bg-white/5 border border-white/10 rounded-none max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <p className="text-white/60 mb-6">The requested investment could not be found.</p>
              <Button 
                onClick={handleBack}
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

  // Mock news and analysis data
  const newsData = [
    {
      id: "1",
      title: "Reliance Industries reports strong Q3 earnings",
      summary: "RIL beats estimates with 12% YoY growth in net profit",
      content: "Full news content...",
      source: "Economic Times",
      author: "Market Reporter",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive" as const,
      impact: "high" as const,
      category: "earnings" as const,
      url: "#"
    },
    {
      id: "2", 
      title: "Oil prices surge impacts refining margins",
      summary: "Rising crude oil prices could affect refining business profitability",
      content: "Full news content...",
      source: "Business Standard",
      author: "Energy Analyst",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral" as const,
      impact: "medium" as const,
      category: "market" as const,
      url: "#"
    }
  ];

  const analysisData = [
    {
      id: "1",
      type: "pro" as const,
      title: "Strong Digital Growth",
      description: "Jio continues to gain market share with robust subscriber growth",
      importance: "high" as const
    },
    {
      id: "2",
      type: "pro" as const,
      title: "Retail Expansion",
      description: "Aggressive expansion in retail business showing positive results",
      importance: "medium" as const
    },
    {
      id: "3",
      type: "con" as const,
      title: "Cyclical Commodity Business",
      description: "Oil & gas business remains sensitive to commodity price cycles",
      importance: "medium" as const
    },
    {
      id: "4",
      type: "con" as const,
      title: "High Debt Levels",
      description: "Significant debt burden despite recent reduction efforts",
      importance: "high" as const
    }
  ];

  const analystRatings = [
    {
      firm: "Morgan Stanley",
      analyst: "Mayank Maheshwari",
      rating: "buy" as const,
      targetPrice: 3200,
      currentPrice: investmentData.currentPrice,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reasoning: "Strong fundamentals and digital transformation story intact"
    },
    {
      firm: "Goldman Sachs",
      analyst: "Sumeet Rohra",
      rating: "hold" as const,
      targetPrice: 2900,
      currentPrice: investmentData.currentPrice,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reasoning: "Valuations appear stretched at current levels"
    }
  ];

  const technicalAnalysis = {
    trend: "bullish" as const,
    support: 2750,
    resistance: 2950,
    rsi: 58,
    recommendation: "The stock is in a strong uptrend with good momentum. Support at 2750 provides a good entry point for long-term investors."
  };

  const { toast } = useToast();
  
  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: Partial<InsertInvestmentOrder>) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments/portfolio"] });
      setOrderDetails(data.order);
      setPurchaseComplete(true);
      toast({
        title: "Order placed successfully!",
        description: `Your ${data.order.orderType} order has been placed.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOrderPlace = (orderData: Partial<InsertInvestmentOrder>) => {
    placeOrderMutation.mutate(orderData);
  };

  const handleResetPurchase = () => {
    setPurchaseComplete(false);
    setOrderDetails(null);
  };

  const handleTimeframeChange = (timeframe: string) => {
    const timeframeMap: { [key: string]: number } = {
      '1M': 1,
      '5M': 1,
      '10M': 1,
      '30M': 1,
      '1HR': 1,
      '3HR': 1,
      '1D': 1,
      '1 DAY': 1,
      '1W': 7,
      '1 Week': 7,
      '1MO': 30,
      '1Month': 30,
      '1Y': 365,
      '1 Year': 365,
      '5Y': 1825,
      '5 Yr': 1825,
      'YTD': 90,
    };
    const days = timeframeMap[timeframe] || 30;
    setPriceData(generateMockPriceData(days));
  };

  const isPositive = investmentData.change >= 0;

  // Show After Purchase View
  if (purchaseComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider uppercase">ORDER PLACED</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Successfully</p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
        
        <div className="pt-32 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-none flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-light mb-2 text-white">Investment Successful!</h2>
                <p className="text-white/60 mb-6">
                  Your {orderDetails.type === 'buy' ? 'purchase' : 'sale'} order has been placed successfully
                </p>
                
                <div className="bg-white/5 rounded-none p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Stock</span>
                    <span className="font-light text-white">{investmentData.instrumentName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Symbol</span>
                    <span className="font-light text-white">{investmentData.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Order Type</span>
                    <Badge className="bg-white/10 text-white border-white/20">{orderDetails.orderType.toUpperCase()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Quantity</span>
                    <span className="font-light text-white">{orderDetails.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Price</span>
                    <span className="font-light text-white">₹{orderDetails.price?.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="font-light text-white">Total Value</span>
                    <span className="text-xl font-light text-white">
                      ₹{((orderDetails.price || 0) * orderDetails.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={handleBack}
                    data-testid="button-view-portfolio"
                  >
                    Go Back
                  </Button>
                  <Button 
                    className="flex-1 bg-white text-black hover:bg-white/90"
                    onClick={handleResetPurchase}
                    data-testid="button-buy-more"
                  >
                    Buy More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Track Your Investment</p>
                    <p className="text-sm text-white/60">Monitor performance in your portfolio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Set Price Alerts</p>
                    <p className="text-sm text-white/60">Get notified of price movements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Stay Updated</p>
                    <p className="text-sm text-white/60">Read news and analysis about your stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Before Purchase View (Default)
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 mx-4 text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">{investmentData.instrumentName}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{investmentData.symbol} • {investmentData.sector}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={watchlisted ? "default" : "ghost"}
              size="sm"
              onClick={() => setWatchlisted(!watchlisted)}
              className={watchlisted ? "bg-white text-black hover:bg-white/90 rounded-none" : "text-white/60 hover:text-white hover:bg-white/10 rounded-none"}
              data-testid="button-watchlist"
            >
              {watchlisted ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 rounded-none" data-testid="button-share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-24 px-4">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          {/* Chart moved to top */}
          <div className="space-y-6">
            {/* Price Chart */}
            <PriceChart
              symbol={investmentData.symbol}
              data={priceData}
              currentPrice={investmentData.currentPrice}
              change={investmentData.change}
              changePercent={investmentData.changePercent}
              onTimeframeChange={handleTimeframeChange}
            />

            {/* Tabs for different sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={cn("bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none gap-0", isMutualFund ? "grid grid-cols-5" : "grid grid-cols-4")}>
                <TabsTrigger 
                  value="overview" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-overview"
                >
                  Overview
                </TabsTrigger>
                {isMutualFund && (
                  <TabsTrigger 
                    value="manager" 
                    className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                    data-testid="tab-fund-manager"
                  >
                    Fund Manager
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="news" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-news"
                >
                  News
                </TabsTrigger>
                <TabsTrigger 
                  value="financials" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-financials"
                >
                  {isMutualFund ? "Performance" : "Financials"}
                </TabsTrigger>
                <TabsTrigger 
                  value="screeners" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-screeners"
                >
                  Screeners
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Holdings Card */}
                {investmentData.holdings && investmentData.holdings > 0 && (
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-none backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-lg font-light tracking-wide">Your Holdings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                          <div className="text-[10px] font-light text-white/60 uppercase tracking-widest mb-2">
                            Total Quantity
                          </div>
                          <div className="text-2xl font-light text-white">
                            {investmentData.holdings} {!isMutualFund ? 'shares' : 'units'}
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                          <div className="text-[10px] font-light text-white/60 uppercase tracking-widest mb-2">
                            Total Amount
                          </div>
                          <div className="text-2xl font-light text-white">
                            ₹{(investmentData.holdings * investmentData.currentPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                          <div className="text-[10px] font-light text-white/60 uppercase tracking-widest mb-2">
                            Total Growth
                          </div>
                          <div className={cn(
                            "text-2xl font-light flex items-center gap-2",
                            investmentData.changePercent >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {investmentData.changePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                            {investmentData.changePercent >= 0 ? '+' : ''}{investmentData.changePercent.toFixed(2)}%
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                          <div className="text-[10px] font-light text-white/60 uppercase tracking-widest mb-2">
                            Total Profit/Loss
                          </div>
                          <div className={cn(
                            "text-2xl font-light",
                            investmentData.changePercent >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {investmentData.changePercent >= 0 ? '+' : ''}₹{((investmentData.holdings * investmentData.currentPrice * investmentData.changePercent) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Market Metrics - For Stocks Only - Cardless */}
                {!isMutualFund && (
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">Key Market Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-4 border border-white/10">
                        <div className="text-xs font-light text-white/60 uppercase tracking-widest mb-2">
                          Market Cap
                        </div>
                        <div className="text-2xl font-light text-white">
                          {(investmentData as any).marketCap}
                        </div>
                      </div>
                      <div className="text-center p-4 border border-white/10">
                        <div className="text-xs font-light text-white/60 uppercase tracking-widest mb-2">
                          P/E Ratio
                        </div>
                        <div className="text-2xl font-light text-white">
                          {(investmentData as any).pe}
                        </div>
                      </div>
                      <div className="text-center p-4 border border-white/10">
                        <div className="text-xs font-light text-white/60 uppercase tracking-widest mb-2">
                          P/B Ratio
                        </div>
                        <div className="text-2xl font-light text-white">
                          {(investmentData as any).pb}
                        </div>
                      </div>
                      <div className="text-center p-4 border border-white/10">
                        <div className="text-xs font-light text-white/60 uppercase tracking-widest mb-2">
                          Div Yield
                        </div>
                        <div className="text-2xl font-light text-white">
                          {(investmentData as any).dividend}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* About Section - Cardless */}
                <div className="space-y-4 pb-6 border-b border-white/10">
                  <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">About {investmentData.instrumentName}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {investmentData.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {isMutualFund ? (
                      <>
                        <div>
                          <div className="text-sm font-medium text-white">Fund House</div>
                          <div className="text-sm text-white/60">{(investmentData as any).fundHouse}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Category</div>
                          <div className="text-sm text-white/60">{(investmentData as any).category} - {(investmentData as any).subcategory}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Fund Manager</div>
                          <div className="text-sm text-white/60">{(investmentData as any).fundManagerName}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Min Investment</div>
                          <div className="text-sm text-white/60">₹{(investmentData as any).minInvestment}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Exit Load</div>
                          <div className="text-sm text-white/60">{(investmentData as any).exitLoad}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Risk Level</div>
                          <div className="text-sm text-white/60">{(investmentData as any).riskLevel}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-sm font-medium text-white">Industry</div>
                          <div className="text-sm text-white/60">{investmentData.industry}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Sector</div>
                          <div className="text-sm text-white/60">{investmentData.sector}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <Alert className="bg-white/5 border-white/10">
                  <Info className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white/70">
                    Investment in securities market are subject to market risks. Read all the related documents carefully before investing.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Fund Manager Tab - Only for Mutual Funds */}
              {isMutualFund && (
                <TabsContent value="manager" className="space-y-6">
                  <Card className="bg-white/5 border border-white/10 rounded-none">
                    <CardHeader>
                      <CardTitle>Fund Manager Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Fund Manager Header */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-none bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-light mb-1">{(investmentData as any).fundManager.name}</h3>
                          <p className="text-white/60 mb-2">{(investmentData as any).fundManager.experience} in Fund Management</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-white/10 text-white border-white/20 flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {(investmentData as any).fundManager.experience}
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20">
                              {(investmentData as any).fundManager.stats.funds_managed} Funds Managed
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20">
                              {(investmentData as any).fundManager.stats.avg_returns}% Avg Returns
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Biography */}
                      <div>
                        <h4 className="text-lg font-light mb-2">Biography</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {(investmentData as any).fundManager.bio}
                        </p>
                      </div>

                      {/* Education & Credentials */}
                      <div>
                        <h4 className="text-lg font-light mb-2">Education & Credentials</h4>
                        <p className="text-sm text-white/60">
                          {(investmentData as any).fundManager.education}
                        </p>
                      </div>

                      {/* Track Record */}
                      <div>
                        <h4 className="text-lg font-light mb-2">Track Record</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {(investmentData as any).fundManager.track_record}
                        </p>
                      </div>

                      {/* Professional Stats */}
                      <div>
                        <h4 className="text-lg font-light mb-3">Professional Statistics</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-white/5 rounded-none">
                            <div className="text-2xl font-light text-primary">{(investmentData as any).fundManager.stats.funds_managed}</div>
                            <div className="text-xs text-white/60 mt-1">Funds Managed</div>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-none">
                            <div className="text-2xl font-light text-primary">{(investmentData as any).fundManager.stats.total_aum}</div>
                            <div className="text-xs text-white/60 mt-1">Total AUM</div>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-none">
                            <div className="text-2xl font-light text-white">{(investmentData as any).fundManager.stats.avg_returns}%</div>
                            <div className="text-xs text-white/60 mt-1">Avg Returns</div>
                          </div>
                        </div>
                      </div>

                      {/* Awards & Recognition */}
                      <div>
                        <h4 className="text-lg font-light mb-3">Awards & Recognition</h4>
                        <div className="space-y-2">
                          {(investmentData as any).fundManager.awards.map((award: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-none">
                              <Award className="h-4 w-4 text-white flex-shrink-0" />
                              <p className="text-sm text-white/60">{award}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Why This Fund is Good */}
                      <div>
                        <h4 className="text-lg font-light mb-3">Why This Fund is Excellent</h4>
                        <div className="space-y-3">
                          {(investmentData as any).whyGood?.map((reason: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-white/60">{reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="news" className="space-y-6">
                <InvestmentNews
                  symbol={investmentData.symbol}
                  news={newsData}
                  analysis={analysisData}
                  analystRatings={analystRatings}
                  technicalAnalysis={technicalAnalysis}
                />
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                {/* Financial Overview Banner */}
                <Card className="bg-white/5 border-2 border-primary/20 rounded-none">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-primary/10 rounded-none">
                        <DollarSign className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-light mb-1">Financial Performance Overview</h3>
                        <p className="text-sm text-white/60">Q3 FY24 • Consolidated Results</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-white/10 text-white border-white/20 text-sm font-light px-3 py-1">
                          Strong Performance
                        </Badge>
                        <p className="text-xs text-white/60 mt-1">Last updated: 2 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Financial Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/5 group border-2 border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 rounded-none">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white/10 rounded-none">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <Badge className="bg-white/10 text-white border-white/20">+12% YoY</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white/60">Total Revenue</div>
                        <div className="text-3xl font-light">₹8.2L Cr</div>
                        <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{width: '78%'}}></div>
                          </div>
                          <span>78%</span>
                        </div>
                        <div className="text-xs text-white/60">of target achieved</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 group border-2 border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 rounded-none">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white/10 rounded-none">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <Badge className="bg-white/10 text-white border-white/20">+15% YoY</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white/60">Net Profit</div>
                        <div className="text-3xl font-light text-white">₹1.8L Cr</div>
                        <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{width: '85%'}}></div>
                          </div>
                          <span>85%</span>
                        </div>
                        <div className="text-xs text-white font-medium">Profit margin expanding</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 group border-2 border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 rounded-none">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white/10 rounded-none">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <Badge className="bg-white/10 text-white border-white/20">+8% YoY</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white/60">EBITDA</div>
                        <div className="text-3xl font-light text-white">₹2.4L Cr</div>
                        <div className="flex items-center gap-2 text-xs text-white/60 mt-2">
                          <span className="font-medium">Margin:</span>
                          <span className="text-white font-light">29.3%</span>
                        </div>
                        <div className="text-xs text-white/60">Industry avg: 24.5%</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profitability & Efficiency Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-2 border-primary/20 rounded-none">
                    <CardHeader className="pb-4 bg-white/5">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Profitability Metrics
                      </CardTitle>
                      <p className="text-xs text-white/60 mt-1">Margins and returns analysis</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-none border-l-4 border-white/20 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-light text-white/60">Operating Profit Margin</div>
                            <div className="text-xs text-white/60 mt-0.5">vs Industry: 18.5%</div>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20">Above Avg</Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-light text-white">22.1%</div>
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-none border-l-4 border-white/20 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-light text-white/60">Return on Equity (ROE)</div>
                            <div className="text-xs text-white/60 mt-0.5">Previous Year: 13.1%</div>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs">Improved</Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-light text-white">14.2%</div>
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{width: '70%'}}></div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-none border-l-4 border-white/20 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-light text-white/60">Return on Assets (ROA)</div>
                            <div className="text-xs text-white/60 mt-0.5">Asset utilization efficiency</div>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20">Strong</Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-light text-white">9.8%</div>
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-2 border-primary/20 rounded-none">
                    <CardHeader className="pb-4 bg-white/5">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Financial Health Indicators
                      </CardTitle>
                      <p className="text-xs text-white/60 mt-1">Liquidity and solvency ratios</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-none border-2 border-white/10 hover:border-primary/50 transition-colors">
                          <div className="text-xs font-medium text-white/60 uppercase mb-2">Debt/Equity</div>
                          <div className="text-3xl font-light mb-1">0.45</div>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs">Healthy</Badge>
                        </div>
                        <div className="p-4 bg-white/5 rounded-none border-2 border-white/10 hover:border-primary/50 transition-colors">
                          <div className="text-xs font-medium text-white/60 uppercase mb-2">Current Ratio</div>
                          <div className="text-3xl font-light mb-1">1.8</div>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs">Good</Badge>
                        </div>
                        <div className="p-4 bg-white/5 rounded-none border-2 border-white/10 hover:border-primary/50 transition-colors">
                          <div className="text-xs font-medium text-white/60 uppercase mb-2">Interest Coverage</div>
                          <div className="text-3xl font-light mb-1">8.5x</div>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs">Strong</Badge>
                        </div>
                        <div className="p-4 bg-white/5 rounded-none border-2 border-white/10 hover:border-primary/50 transition-colors">
                          <div className="text-xs font-medium text-white/60 uppercase mb-2">Asset Turnover</div>
                          <div className="text-3xl font-light mb-1">2.1</div>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs">Efficient</Badge>
                        </div>
                      </div>

                      <Alert className="bg-white/5 border-l-4 border-white/20">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <span className="font-light">Strong Financial Position:</span> The company maintains healthy liquidity ratios and manageable debt levels, indicating robust financial health and operational efficiency.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>

                {/* Quarterly Performance Comparison */}
                <Card className="bg-white/5 border-2 border-primary/20 rounded-none">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      Quarterly Performance Trend
                    </CardTitle>
                    <p className="text-xs text-white/60 mt-1">Last 4 quarters comparison</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-none border-2 border-primary/30">
                        <div className="text-xs font-medium text-white/60 uppercase mb-2">Q3 FY24</div>
                        <div className="text-2xl font-light text-white">₹2.05L Cr</div>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs mt-2">+15% QoQ</Badge>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-none border border-white/10">
                        <div className="text-xs font-medium text-white/60 uppercase mb-2">Q2 FY24</div>
                        <div className="text-2xl font-light">₹1.78L Cr</div>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs mt-2">+8% QoQ</Badge>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-none border border-white/10">
                        <div className="text-xs font-medium text-white/60 uppercase mb-2">Q1 FY24</div>
                        <div className="text-2xl font-light">₹1.65L Cr</div>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs mt-2">+5% QoQ</Badge>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-none border border-white/10">
                        <div className="text-xs font-medium text-white/60 uppercase mb-2">Q4 FY23</div>
                        <div className="text-2xl font-light">₹1.57L Cr</div>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs mt-2">Base</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Screeners Tab */}
              <TabsContent value="screeners" className="space-y-6">
                <Card className="bg-white/5 border border-white/10 rounded-none">
                  <CardHeader>
                    <CardTitle className="text-white">Technical Analysis & Predictions</CardTitle>
                    <p className="text-sm text-white/60">AI-powered screening across 20 different technical indicators and patterns</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Screener 1 - RSI Analysis */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">RSI Momentum</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Bullish</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">RSI (14)</span>
                            <span className="text-white font-medium">58.5</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '58.5%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Moderate bullish momentum, not overbought</p>
                        </div>
                      </div>

                      {/* Screener 2 - MACD Signal */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">MACD Signal</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Buy</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Signal</span>
                            <span className="text-white font-medium">Positive Crossover</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '75%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">MACD crossed above signal line - bullish</p>
                        </div>
                      </div>

                      {/* Screener 3 - Moving Averages */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Moving Average Cross</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Strong Buy</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">50 vs 200 SMA</span>
                            <span className="text-white font-medium">Golden Cross</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '85%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Price above both 50 and 200 day averages</p>
                        </div>
                      </div>

                      {/* Screener 4 - Bollinger Bands */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Bollinger Bands</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Neutral</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Position</span>
                            <span className="text-white font-medium">Mid-Range</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '50%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Trading within normal volatility range</p>
                        </div>
                      </div>

                      {/* Screener 5 - Volume Analysis */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Volume Trend</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Bullish</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">vs Avg Volume</span>
                            <span className="text-white font-medium">+45%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '72.5%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Higher than average buying pressure</p>
                        </div>
                      </div>

                      {/* Screener 6 - Stochastic Oscillator */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Stochastic</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Buy</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">%K/%D</span>
                            <span className="text-white font-medium">65/58</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '65%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Bullish crossover in neutral zone</p>
                        </div>
                      </div>

                      {/* Screener 7 - ADX Trend Strength */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">ADX Trend Strength</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Strong</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">ADX Value</span>
                            <span className="text-white font-medium">42.5</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '85%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Strong uptrend with good momentum</p>
                        </div>
                      </div>

                      {/* Screener 8 - Fibonacci Levels */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Fibonacci Retracement</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Support</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Level</span>
                            <span className="text-white font-medium">61.8% Support</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '61.8%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Price holding at key Fibonacci level</p>
                        </div>
                      </div>

                      {/* Screener 9 - Support/Resistance */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Support & Resistance</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Breakout</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Status</span>
                            <span className="text-white font-medium">Above Resistance</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '78%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Broke through ₹2,750 resistance level</p>
                        </div>
                      </div>

                      {/* Screener 10 - Ichimoku Cloud */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Ichimoku Cloud</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Bullish</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Position</span>
                            <span className="text-white font-medium">Above Cloud</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '82%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Strong bullish signal with upward momentum</p>
                        </div>
                      </div>

                      {/* Screener 11 - Parabolic SAR */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Parabolic SAR</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Uptrend</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Signal</span>
                            <span className="text-white font-medium">Below Price</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '70%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Dots below candles indicate uptrend</p>
                        </div>
                      </div>

                      {/* Screener 12 - CCI */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">CCI (Commodity Channel)</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Neutral</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Value</span>
                            <span className="text-white font-medium">+45</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '55%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Trading in neutral zone, watchful</p>
                        </div>
                      </div>

                      {/* Screener 13 - Williams %R */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Williams %R</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Buy Zone</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Reading</span>
                            <span className="text-white font-medium">-35</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '65%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Not oversold, room for upside</p>
                        </div>
                      </div>

                      {/* Screener 14 - OBV */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">On-Balance Volume</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Bullish</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Trend</span>
                            <span className="text-white font-medium">Accumulation</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '76%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Volume confirms price uptrend</p>
                        </div>
                      </div>

                      {/* Screener 15 - ATR Volatility */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">ATR Volatility</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Moderate</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">14-day ATR</span>
                            <span className="text-white font-medium">₹68.50</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '50%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Normal volatility, good for trading</p>
                        </div>
                      </div>

                      {/* Screener 16 - Money Flow Index */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Money Flow Index</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Bullish</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">MFI (14)</span>
                            <span className="text-white font-medium">62</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '62%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Good money inflow, not overbought</p>
                        </div>
                      </div>

                      {/* Screener 17 - Price Rate of Change */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Rate of Change</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Positive</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">12-day ROC</span>
                            <span className="text-white font-medium">+8.5%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '68%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Strong upward momentum</p>
                        </div>
                      </div>

                      {/* Screener 18 - Donchian Channel */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Donchian Channel</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Upper Band</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Position</span>
                            <span className="text-white font-medium">Near High</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '88%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Price testing 20-day high</p>
                        </div>
                      </div>

                      {/* Screener 19 - Keltner Channel */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Keltner Channel</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Neutral</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Band Position</span>
                            <span className="text-white font-medium">Mid-Range</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '52%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Trading within normal range</p>
                        </div>
                      </div>

                      {/* Screener 20 - Pivot Points */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-light text-white">Pivot Points</h4>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none">Above Pivot</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Central Pivot</span>
                            <span className="text-white font-medium">₹2,790</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{width: '58%'}}></div>
                          </div>
                          <p className="text-xs text-white/50">Price above daily pivot point</p>
                        </div>
                      </div>
                    </div>

                    {/* Overall Prediction Summary */}
                    <Card className="bg-white/5 border border-white/10 rounded-none mt-6">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-white" />
                          Overall Screener Consensus
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-3xl font-light text-white">15</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Bullish Signals</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-light text-white">5</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Neutral Signals</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-light text-white">0</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Bearish Signals</div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-none">
                          <p className="text-sm text-white/80 leading-relaxed">
                            <span className="font-light text-white">Strong Buy Recommendation:</span> The majority of technical indicators (75%) show bullish signals with strong momentum. Price action is above key moving averages, RSI indicates healthy momentum without being overbought, and volume confirms the uptrend. Consider this as a favorable entry point for long-term positions.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sticky Bottom Buy Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-white/60">Current Price</div>
                <div className="text-xl font-light flex items-center gap-2">
                  ₹{investmentData.currentPrice.toFixed(2)}
                  <Badge className={cn(
                    "text-xs border-none font-medium",
                    isPositive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                  )}>
                    {isPositive ? '+' : ''}{investmentData.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="min-w-[100px] bg-red-600/90 hover:bg-red-600 text-white border border-red-500/30 backdrop-blur-xl font-semibold shadow-lg shadow-red-500/20"
                onClick={() => setShowBuyPopup(true)}
                data-testid="button-sell"
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Sell
              </Button>
              <Button 
                className="min-w-[100px] bg-green-600/90 hover:bg-green-600 text-white border border-green-500/30 backdrop-blur-xl font-semibold shadow-lg shadow-green-500/20"
                onClick={() => setShowBuyPopup(true)}
                data-testid="button-buy"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Buy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Dialog */}
      <InvestmentTradeDialog
        open={showBuyPopup}
        onOpenChange={setShowBuyPopup}
        asset={{
          symbol: investmentData.symbol,
          instrumentName: investmentData.instrumentName,
          assetType: investmentData.type || "stock",
          currentPrice: investmentData.currentPrice,
          dayChangePercent: investmentData.changePercent,
        }}
        mode="buy"
        onConfirm={handleOrderPlace}
        availableHoldings={investmentData.holdings > 0 ? {
          quantity: investmentData.holdings,
          avgPrice: investmentData.currentPrice * 0.95, // Mock avg price
        } : undefined}
      />
    </div>
  );
};

export default InvestmentDetail;
