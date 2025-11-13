import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { InvestmentTradeDialog } from "@/components/ui/investment-trade-dialog";
import { PriceChart } from "@/components/ui/price-chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import type { InsertInvestmentOrder } from "@shared/schema";
import { 
  Star,
  Share2,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

const generateMockPriceData = (days: number = 30) => {
  const data = [];
  let price = 4200000 + Math.random() * 500000;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 100000;
    price += change;
    
    const open = price;
    const close = price + (Math.random() - 0.5) * 20000;
    const high = Math.max(open, close) + Math.random() * 10000;
    const low = Math.min(open, close) - Math.random() * 10000;
    const volume = 1000000 + Math.random() * 5000000;
    
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

const CRYPTO_DATA: { [key: string]: any } = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    currentPrice: 4235670.50,
    change: 103450.25,
    changePercent: 2.50,
    marketCap: "₹82.5L Cr",
    volume24h: "₹5.2L Cr",
    circulatingSupply: "19.5M BTC",
    maxSupply: "21M BTC",
    description: "Bitcoin is the first and most widely recognized cryptocurrency, serving as a decentralized digital currency without a central bank or single administrator.",
    holdings: 0.5, // Mock holdings for demo
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    currentPrice: 182450.75,
    change: -2340.50,
    changePercent: -1.27,
    marketCap: "₹22.8L Cr",
    volume24h: "₹1.8L Cr",
    circulatingSupply: "120.5M ETH",
    maxSupply: "Unlimited",
    description: "Ethereum is a decentralized, open-source blockchain featuring smart contract functionality. Ether is the native cryptocurrency of the platform.",
    holdings: 2, // Mock holdings for demo
  },
  BNB: {
    symbol: "BNB",
    name: "Binance Coin",
    currentPrice: 28540.00,
    change: 1025.80,
    changePercent: 3.73,
    marketCap: "₹4.5L Cr",
    volume24h: "₹85K Cr",
    circulatingSupply: "157M BNB",
    maxSupply: "200M BNB",
    description: "Binance Coin is the cryptocurrency issued by Binance exchange and trades with the BNB symbol. Used to facilitate transactions on the Binance platform.",
    holdings: 5, // Mock holdings for demo
  },
};

export default function CryptoDetail() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { goBack } = useNavigationHistory();
  const [activeTab, setActiveTab] = useUrlTab("overview");
  const [watchlisted, setWatchlisted] = useState(false);
  const [priceData, setPriceData] = useState(generateMockPriceData());
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const symbol = params.symbol || "BTC";
  const [cryptoData, setCryptoData] = useState(CRYPTO_DATA[symbol] || CRYPTO_DATA.BTC);
  
  // Reset data when symbol changes
  useEffect(() => {
    const initialData = CRYPTO_DATA[symbol] || CRYPTO_DATA.BTC;
    setCryptoData(initialData);
    setPriceData(generateMockPriceData());
  }, [symbol]);
  
  // Live price updates every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prev: typeof CRYPTO_DATA.BTC) => {
        const randomChange = (Math.random() - 0.5) * 0.3; // Small random change
        const changePercent = randomChange;
        const change = prev.currentPrice * (changePercent / 100);
        const newPrice = prev.currentPrice + change;
        
        return {
          ...prev,
          currentPrice: Math.max(newPrice, 1000), // Ensure price doesn't go below 1000
          change: prev.change + change,
          changePercent: prev.changePercent + changePercent,
        };
      });
      
      // Also update chart data
      setPriceData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        const randomChange = (Math.random() - 0.5) * lastPoint.close * 0.002;
        const newClose = Math.max(lastPoint.close + randomChange, 1000);
        
        const newPoint = {
          timestamp: Date.now(),
          open: lastPoint.close,
          close: newClose,
          high: Math.max(lastPoint.close, newClose) * (1 + Math.random() * 0.001),
          low: Math.min(lastPoint.close, newClose) * (1 - Math.random() * 0.001),
          volume: 1000000 + Math.random() * 5000000,
        };
        
        // Keep only last 100 points for performance
        const updatedData = [...prevData.slice(-99), newPoint];
        return updatedData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
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

  const isPositive = cryptoData.change >= 0;

  if (purchaseComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-6 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold tracking-wider uppercase">Order Placed Successfully</h1>
            <div className="w-10"></div>
          </div>
        </div>
        
        <div className="pt-32 px-4">
          <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center rounded-none">
              <div className="w-20 h-20 bg-white/10 rounded-none flex items-center justify-center mx-auto mb-4 border border-white/20">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-light mb-2 text-white">Investment Successful!</h2>
              <p className="text-white/60 mb-6">
                Your {orderDetails.type === 'buy' ? 'purchase' : 'sale'} order has been placed successfully
              </p>
              
              <div className="bg-white/5 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Crypto</span>
                  <span className="font-semibold text-white">{cryptoData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Symbol</span>
                  <span className="font-semibold text-white">{cryptoData.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Quantity</span>
                  <span className="font-semibold text-white">{orderDetails.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Price</span>
                  <span className="font-semibold text-white">₹{orderDetails.price?.toFixed(2)}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Total Value</span>
                  <span className="text-xl font-light text-white">
                    ₹{((orderDetails.price || 0) * orderDetails.quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none"
                  onClick={goBack}
                  data-testid="button-view-portfolio"
                >
                  Go Back
                </Button>
                <Button 
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none"
                  onClick={handleResetPurchase}
                  data-testid="button-buy-more"
                >
                  Buy More
                </Button>
              </div>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 mx-4">
            <h1 className="text-lg font-light text-white">{cryptoData.name}</h1>
            <p className="text-xs uppercase tracking-widest text-white/60 font-light">{cryptoData.symbol}</p>
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
          <div className="space-y-6">
            {/* Price Chart */}
            <PriceChart
              symbol={cryptoData.symbol}
              data={priceData}
              currentPrice={cryptoData.currentPrice}
              change={cryptoData.change}
              changePercent={cryptoData.changePercent}
              onTimeframeChange={handleTimeframeChange}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
                <TabsTrigger 
                  value="overview" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-overview"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="news" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-news"
                >
                  News
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                  data-testid="tab-details"
                >
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Holdings Card */}
                {cryptoData.holdings && cryptoData.holdings > 0 && (
                  <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="crypto-holdings-summary">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-xs text-white/50 uppercase tracking-widest font-light">Your Holdings</p>
                        <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-holdings">
                          ₹{(cryptoData.holdings * cryptoData.currentPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                        <div className="space-y-1 text-center">
                          <p className="text-lg font-light text-white" data-testid="text-holdings-quantity">
                            {cryptoData.holdings} units
                          </p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">Quantity</p>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className={cn(
                            "text-lg font-light",
                            cryptoData.changePercent >= 0 ? "text-green-400" : "text-red-400"
                          )} data-testid="text-holdings-growth">
                            {cryptoData.changePercent >= 0 ? '+' : ''}{cryptoData.changePercent.toFixed(2)}%
                          </p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">Growth</p>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className={cn(
                            "text-lg font-light",
                            cryptoData.changePercent >= 0 ? "text-green-400" : "text-red-400"
                          )} data-testid="text-holdings-pnl">
                            {cryptoData.changePercent >= 0 ? '+' : ''}₹{((cryptoData.holdings * cryptoData.currentPrice * cryptoData.changePercent) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">P&L</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Market Metrics - Cardless */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">Market Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-4 border border-white/10">
                      <div className="text-xs uppercase tracking-widest text-white/60 font-light mb-2">
                        Market Cap
                      </div>
                      <div className="text-2xl font-light text-white">
                        {cryptoData.marketCap}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-white/10">
                      <div className="text-xs uppercase tracking-widest text-white/60 font-light mb-2">
                        24h Volume
                      </div>
                      <div className="text-2xl font-light text-white">
                        {cryptoData.volume24h}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-white/10">
                      <div className="text-xs uppercase tracking-widest text-white/60 font-light mb-2">
                        Circulating Supply
                      </div>
                      <div className="text-2xl font-light text-white">
                        {cryptoData.circulatingSupply}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-white/10">
                      <div className="text-xs uppercase tracking-widest text-white/60 font-light mb-2">
                        Max Supply
                      </div>
                      <div className="text-2xl font-light text-white/80">
                        {cryptoData.maxSupply}
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section - Cardless */}
                <div className="space-y-4 pb-6 border-b border-white/10">
                  <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">About {cryptoData.name}</h3>
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    {cryptoData.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-6">
                <div className="border border-white/10 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                  <h3 className="text-xs uppercase tracking-widest text-white/60 font-light mb-4">Latest News</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">Positive</Badge>
                        <span className="text-xs uppercase tracking-widest text-white/40 font-light">2 hours ago</span>
                      </div>
                      <h3 className="text-white font-light mb-2">{cryptoData.name} reaches new all-time high</h3>
                      <p className="text-sm text-white/60 mb-3 font-light">Bitcoin surges past previous records driven by institutional adoption and favorable regulatory developments.</p>
                      <div className="text-xs uppercase tracking-widest text-white/40 font-light">Source: CoinDesk</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">Neutral</Badge>
                        <span className="text-xs uppercase tracking-widest text-white/40 font-light">5 hours ago</span>
                      </div>
                      <h3 className="text-white font-light mb-2">Market analysis: {cryptoData.symbol} price prediction</h3>
                      <p className="text-sm text-white/60 mb-3 font-light">Experts weigh in on where {cryptoData.name} prices might head in the coming weeks.</p>
                      <div className="text-xs uppercase tracking-widest text-white/40 font-light">Source: Bloomberg Crypto</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">Alert</Badge>
                        <span className="text-xs uppercase tracking-widest text-white/40 font-light">1 day ago</span>
                      </div>
                      <h3 className="text-white font-light mb-2">Regulatory updates impact crypto markets</h3>
                      <p className="text-sm text-white/60 mb-3 font-light">New regulations announced by financial authorities may affect cryptocurrency trading.</p>
                      <div className="text-xs uppercase tracking-widest text-white/40 font-light">Source: Financial Times</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="border border-white/10 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                  <h3 className="text-xs uppercase tracking-widest text-white/60 font-light mb-4">Crypto Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5">
                      <span className="text-xs uppercase tracking-widest text-white/60 font-light">Symbol</span>
                      <span className="text-white font-light">{cryptoData.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5">
                      <span className="text-xs uppercase tracking-widest text-white/60 font-light">Name</span>
                      <span className="text-white font-light">{cryptoData.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5">
                      <span className="text-xs uppercase tracking-widest text-white/60 font-light">Current Price</span>
                      <span className="text-white font-light">₹{cryptoData.currentPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buy Section */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/60 font-light mb-1">Current Price</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-light text-white" data-testid="text-current-price">
                  ₹{cryptoData.currentPrice.toFixed(2)}
                </span>
                <Badge className={cn(
                  "rounded-none font-light text-xs",
                  isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                )}>
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {isPositive ? '+' : ''}{cryptoData.changePercent.toFixed(2)}%
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="bg-red-600/90 hover:bg-red-600 text-white border border-red-500/30 backdrop-blur-xl font-semibold shadow-lg shadow-red-500/20 rounded-none px-6"
                data-testid="button-sell"
                onClick={() => setShowBuyPopup(true)}
              >
                Sell
              </Button>
              <Button
                className="bg-green-600/90 hover:bg-green-600 text-white border border-green-500/30 backdrop-blur-xl font-semibold shadow-lg shadow-green-500/20 rounded-none px-8"
                data-testid="button-buy"
                onClick={() => setShowBuyPopup(true)}
              >
                Buy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Popup Dialog */}
      <InvestmentTradeDialog
        open={showBuyPopup}
        onOpenChange={setShowBuyPopup}
        asset={{
          symbol: cryptoData.symbol,
          instrumentName: cryptoData.name,
          assetType: "crypto",
          currentPrice: cryptoData.currentPrice,
          dayChangePercent: cryptoData.changePercent,
        }}
        mode="buy"
        onConfirm={handleOrderPlace}
        availableHoldings={cryptoData.holdings > 0 ? {
          quantity: cryptoData.holdings,
          avgPrice: cryptoData.currentPrice * 0.95, // Mock avg price
        } : undefined}
      />
    </div>
  );
}
