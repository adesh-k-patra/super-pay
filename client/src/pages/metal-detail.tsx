import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Activity,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Crown,
  Medal,
  Gem,
  Sparkles,
  Coins,
  Target,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Time period configurations
const TIME_PERIODS: { [key: string]: { label: string, dataPoints: number, interval: number } } = {
  "5min": { label: "Last 5 Minutes", dataPoints: 300, interval: 1000 },
  "10min": { label: "10 Minutes", dataPoints: 300, interval: 2000 },
  "1hour": { label: "1 Hour", dataPoints: 300, interval: 12000 },
  "3hour": { label: "3 Hours", dataPoints: 300, interval: 36000 },
  "1day": { label: "1 Day", dataPoints: 288, interval: 300000 },
  "1week": { label: "1 Week", dataPoints: 336, interval: 1800000 },
  "1month": { label: "1 Month", dataPoints: 300, interval: 8640000 },
  "1year": { label: "1 Year", dataPoints: 365, interval: 86400000 },
  "5year": { label: "5 Years", dataPoints: 300, interval: 432000000 },
  "ytd": { label: "YTD", dataPoints: 250, interval: 86400000 }
};

// Generate initial price history based on time period
const generateInitialPriceHistory = (basePrice: number, timePeriod: string = "5min") => {
  const config = TIME_PERIODS[timePeriod] || TIME_PERIODS["5min"];
  const history = [];
  let currentPrice = basePrice;
  
  for (let i = config.dataPoints - 1; i >= 0; i--) {
    const timestamp = Date.now() - (i * config.interval);
    
    // Adjust volatility based on time period
    const volatility = timePeriod === "5min" ? 0.001 : timePeriod === "10min" ? 0.002 : 0.01;
    const change = (Math.random() - 0.5) * volatility;
    currentPrice *= (1 + change);
    
    history.push({
      timestamp,
      price: currentPrice,
      time: new Date(timestamp).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    });
  }
  
  return history;
};

// Metal data
const METAL_DATA: { [key: string]: any } = {
  gold: {
    id: "gold",
    name: "Gold",
    symbol: "GOLD",
    currentPrice: 6485.50,
    dayChange: 125.30,
    dayChangePercent: 1.97,
    weekChange: 2.4,
    monthChange: 5.8,
    yearChange: 12.5,
    marketCap: "₹15.2L Cr",
    volume: 125000,
    icon: Crown,
    color: "text-white",
    gradient: "from-white/10 to-white/5",
    description: "24K Pure Gold - Traditional store of value and hedge against inflation",
    purity: "99.99%",
    minInvestment: 100,
    specifications: {
      "Purity": "99.99% (24K)",
      "Form": "Digital Gold backed by physical gold",
      "Storage": "Secure vaults with insurance coverage",
      "Liquidity": "Instant buy/sell during market hours",
      "Tax": "3% GST on purchase, LTCG after 3 years"
    },
    keyFeatures: [
      "Inflation hedge and store of value",
      "Globally accepted precious metal",
      "Portfolio diversification benefits",
      "Physical gold backing"
    ]
  },
  silver: {
    id: "silver",
    name: "Silver",
    symbol: "SILVER", 
    currentPrice: 84.25,
    dayChange: -1.15,
    dayChangePercent: -1.34,
    weekChange: 0.8,
    monthChange: 3.2,
    yearChange: 8.7,
    marketCap: "₹2.8L Cr",
    volume: 95000,
    icon: Medal,
    color: "text-white",
    gradient: "from-white/10 to-white/5",
    description: "Pure Silver - Industrial and investment grade precious metal",
    purity: "99.9%",
    minInvestment: 50,
    specifications: {
      "Purity": "99.9% (Fine Silver)",
      "Industrial Use": "Electronics, solar panels, medical",
      "Storage": "Secure vaults with insurance",
      "Liquidity": "High liquidity in global markets",
      "Volatility": "Higher than gold, good for traders"
    },
    keyFeatures: [
      "Industrial and investment demand",
      "More affordable than gold",
      "Higher price volatility opportunities",
      "Growing technological applications"
    ]
  },
  platinum: {
    id: "platinum",
    name: "Platinum",
    symbol: "PLATINUM",
    currentPrice: 2875.80,
    dayChange: 45.60,
    dayChangePercent: 1.61,
    weekChange: 3.5,
    monthChange: 7.2,
    yearChange: 15.8,
    marketCap: "₹4.5L Cr", 
    volume: 45000,
    icon: Gem,
    color: "text-white",
    gradient: "from-white/10 to-white/5",
    description: "Premium Platinum - Rare precious metal with industrial applications",
    purity: "99.95%",
    minInvestment: 200,
    specifications: {
      "Rarity": "30x rarer than gold",
      "Industrial Use": "Automotive catalysts, jewelry",
      "Supply": "Limited mining sources",
      "Demand": "Auto industry + investment",
      "Investment": "Portfolio diversification"
    },
    keyFeatures: [
      "Rarer than gold with limited supply",
      "Essential for automotive industry",
      "Premium investment grade metal",
      "Strong correlation with economic growth"
    ]
  },
  diamond: {
    id: "diamond",
    name: "Diamond", 
    symbol: "DIAMOND",
    currentPrice: 8950.00,
    dayChange: 180.50,
    dayChangePercent: 2.06,
    weekChange: 4.1,
    monthChange: 8.5,
    yearChange: 18.2,
    marketCap: "₹8.7L Cr",
    volume: 25000,
    icon: Sparkles,
    color: "text-white",
    gradient: "from-white/10 to-white/5",
    description: "Investment Grade Diamonds - Premium category precious stones",
    purity: "VVS1 Grade",
    minInvestment: 500,
    specifications: {
      "Grade": "VVS1 - Very Very Slightly Included",
      "Certification": "GIA/IGI certified diamonds",
      "Cut": "Excellent cut quality",
      "Color": "D-F color grade (colorless)",
      "Carat": "0.5ct to 5ct available"
    },
    keyFeatures: [
      "Certified investment grade diamonds",
      "Excellent cut and clarity standards", 
      "Portfolio luxury asset allocation",
      "Strong historical value appreciation"
    ]
  },
  bronze: {
    id: "bronze",
    name: "Bronze",
    symbol: "BRONZE",
    currentPrice: 145.75,
    dayChange: 2.25, 
    dayChangePercent: 1.57,
    weekChange: 1.2,
    monthChange: 2.8,
    yearChange: 6.5,
    marketCap: "₹85K Cr",
    volume: 75000,
    icon: Coins,
    color: "text-white",
    gradient: "from-white/10 to-white/5",
    description: "Industrial Bronze - Copper-Tin alloy for industrial applications",
    purity: "90% Copper, 10% Tin",
    minInvestment: 25,
    specifications: {
      "Composition": "90% Copper + 10% Tin",
      "Industrial Use": "Bearings, bushings, marine hardware",
      "Corrosion": "Excellent corrosion resistance",
      "Demand": "Construction and manufacturing",
      "Supply": "Steady global production"
    },
    keyFeatures: [
      "Industrial commodity exposure",
      "Infrastructure development demand",
      "Affordable entry point",
      "Steady industrial applications"
    ]
  }
};

export default function MetalDetail() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { metalId } = useParams<{ metalId: string }>();
  const { goBack } = useNavigationHistory();
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState<string>("1");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceHistory, setPriceHistory] = useState<Array<{timestamp: number, price: number, time: string}>>([]);
  const [timePeriod, setTimePeriod] = useState<string>("5min");
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  // Extract base metal type from metalId (e.g., GOLD24K -> gold, SILVER999 -> silver)
  const getBaseMetalType = (metalId: string): string => {
    const upperMetalId = metalId?.toUpperCase() || '';
    if (upperMetalId.includes('GOLD')) return 'gold';
    if (upperMetalId.includes('SILVER')) return 'silver';
    if (upperMetalId.includes('PLATINUM')) return 'platinum';
    if (upperMetalId.includes('DIAMOND') || upperMetalId.includes('DIA')) return 'diamond';
    if (upperMetalId.includes('BRONZE')) return 'bronze';
    return metalId?.toLowerCase() || '';
  };

  const baseMetalType = getBaseMetalType(metalId!);
  const metal = METAL_DATA[baseMetalType];
  
  // Initialize price history when metal is loaded or time period changes
  useEffect(() => {
    if (metal) {
      const initialHistory = generateInitialPriceHistory(metal.currentPrice, timePeriod);
      setPriceHistory(initialHistory);
      setCurrentPrice(initialHistory[initialHistory.length - 1].price);
    }
  }, [metal?.currentPrice, timePeriod]);

  // Update price based on selected time period (only for short periods)
  useEffect(() => {
    if (!metal || priceHistory.length === 0) return;
    
    // Only enable live updates for 5min and 10min periods
    if (timePeriod !== "5min" && timePeriod !== "10min") return;

    const config = TIME_PERIODS[timePeriod];
    const updateInterval = timePeriod === "5min" ? 1000 : 2000; // 1s for 5min, 2s for 10min

    const interval = setInterval(() => {
      setPriceHistory(prevHistory => {
        // Get the last price
        const lastPrice = prevHistory[prevHistory.length - 1]?.price || metal.currentPrice;
        
        // Small volatility for live updates
        const volatility = timePeriod === "5min" ? 0.001 : 0.002;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = lastPrice * (1 + change);
        
        // Create new data point
        const newPoint = {
          timestamp: Date.now(),
          price: newPrice,
          time: new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })
        };
        
        // Add new point and remove oldest to maintain window size
        const updatedHistory = [...prevHistory.slice(1), newPoint];
        
        // Update current price state
        setCurrentPrice(newPrice);
        
        return updatedHistory;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [metal, priceHistory.length, timePeriod]);
  
  if (!metal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-white mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Metal Not Found</h1>
          <p className="text-white/60 mb-4">The requested precious metal could not be found.</p>
          <Button onClick={() => goBack()} className="bg-white text-black hover:bg-white/90">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const minPrice = priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.price)) : metal.currentPrice;
  const maxPrice = priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.price)) : metal.currentPrice;

  const handleBack = () => {
    goBack();
  };

  const handleBuyOrder = () => {
    const quantity = parseFloat(orderQuantity);
    const total = quantity * metal.currentPrice;
    
    setOrderDetails({
      type: 'buy',
      quantity,
      price: metal.currentPrice,
      total,
      metal: metal.name
    });
    setPurchaseComplete(true);
    setShowBuyDialog(false);
    setOrderQuantity("1");
  };

  const handleSellOrder = () => {
    const quantity = parseFloat(orderQuantity);
    const total = quantity * metal.currentPrice;
    
    setOrderDetails({
      type: 'sell',
      quantity,
      price: metal.currentPrice,
      total,
      metal: metal.name
    });
    setPurchaseComplete(true);
    setShowSellDialog(false);
    setOrderQuantity("1");
  };

  const handleResetPurchase = () => {
    setPurchaseComplete(false);
    setOrderDetails(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPrice = (price: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  };

  // Show After Purchase View
  if (purchaseComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-white">Order Successful</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">Transaction Successful!</h2>
              <p className="text-white/70 mb-6">
                Your {orderDetails.type === 'buy' ? 'purchase' : 'sale'} order has been placed successfully
              </p>
              
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Metal</span>
                  <span className="font-semibold text-white">{orderDetails.metal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Quantity</span>
                  <span className="font-semibold text-white">{orderDetails.quantity} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Price per unit</span>
                  <span className="font-semibold text-white">{formatPrice(orderDetails.price)}</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Total Value</span>
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(orderDetails.total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={goBack}
                  data-testid="button-view-portfolio"
                >
                  Go Back
                </Button>
                <Button 
                  className="flex-1 bg-white text-black hover:bg-white/90"
                  onClick={handleResetPurchase}
                  data-testid="button-trade-more"
                >
                  Trade More
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Track Your Investment</p>
                  <p className="text-sm text-white/60">Monitor price changes in real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Set Price Alerts</p>
                  <p className="text-sm text-white/60">Get notified of market movements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Diversify Portfolio</p>
                  <p className="text-sm text-white/60">Explore other precious metals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Before Purchase View (Default)
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r",
              metal.gradient
            )}>
              <metal.icon className={cn("h-4 w-4", metal.color)} />
            </div>
            <h1 className="text-lg font-semibold text-white">{metal.name}</h1>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-28 p-4 space-y-6">
        {/* Price Header - Real-time Update */}
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white transition-all duration-300">{formatPrice(currentPrice || metal.currentPrice)}</h2>
                <p className="text-white/60 text-sm">per unit • Live</p>
              </div>
              <Badge variant="secondary" className="text-sm font-medium bg-white/10 text-white border-white/20">
                {metal.dayChange >= 0 ? "+" : ""}{metal.dayChangePercent}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm">Day Change</p>
                <div className="flex items-center gap-1 font-medium text-white">
                  {metal.dayChange >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{formatPrice(metal.dayChange)}</span>
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm">Volume</p>
                <p className="text-white font-medium">{metal.volume.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger 
              value="overview" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="chart" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-chart"
            >
              Price Chart
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
            <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs text-white/50 uppercase tracking-widest font-light">Your Holdings</p>
                    <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-holdings">
                      ₹{(metal.currentPrice * 25).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                    <div className="space-y-1 text-center">
                      <p className="text-lg font-light text-white" data-testid="text-holdings-quantity">
                        25 grams
                      </p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Quantity</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className={cn(
                        "text-lg font-light",
                        metal.dayChangePercent >= 0 ? "text-green-400" : "text-red-400"
                      )} data-testid="text-holdings-growth">
                        {metal.dayChangePercent >= 0 ? '+' : ''}{metal.dayChangePercent}%
                      </p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Growth</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className={cn(
                        "text-lg font-light",
                        metal.dayChangePercent >= 0 ? "text-green-400" : "text-red-400"
                      )} data-testid="text-holdings-pnl">
                        {metal.dayChangePercent >= 0 ? '+' : ''}₹{((metal.currentPrice * 25 * metal.dayChangePercent) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">P&L</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section - Cardless */}
            <div className="space-y-4 pb-6 border-b border-white/10">
              <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">About {metal.name}</h3>
              <p className="text-white/70 leading-relaxed text-sm">
                {metal.description}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Purity</p>
                  <p className="text-white font-semibold">{metal.purity}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Min Investment</p>
                  <p className="text-white font-semibold">₹{metal.minInvestment}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics - Cardless Grid */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border border-white/10 text-center">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">1 Week</p>
                  <p className="text-2xl font-light text-white">
                    {metal.weekChange >= 0 ? "+" : ""}{metal.weekChange}%
                  </p>
                </div>
                <div className="p-4 border border-white/10 text-center">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">1 Month</p>
                  <p className="text-2xl font-light text-white">
                    {metal.monthChange >= 0 ? "+" : ""}{metal.monthChange}%
                  </p>
                </div>
                <div className="p-4 border border-white/10 text-center">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">1 Year</p>
                  <p className="text-2xl font-light text-white">
                    {metal.yearChange >= 0 ? "+" : ""}{metal.yearChange}%
                  </p>
                </div>
                <div className="p-4 border border-white/10 text-center">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Market Cap</p>
                  <p className="text-white text-2xl font-light">{metal.marketCap}</p>
                </div>
              </div>
            </div>

            {/* Investment Highlights - Cardless */}
            <div className="space-y-4 pb-6 border-b border-white/10">
              <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">Investment Highlights</h3>
              <div className="space-y-2">
                {metal.keyFeatures.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 py-2">
                    <CheckCircle className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 text-sm font-light">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Information - Cardless */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-white/50 font-light">Market Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60 text-sm">Trading Volume</span>
                  <span className="text-white font-light">{metal.volume.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/60 text-sm">Day Change</span>
                  <span className="font-light text-white">
                    {metal.dayChange >= 0 ? "+" : ""}{formatPrice(metal.dayChange)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/60 text-sm">Purity Grade</span>
                  <span className="text-white font-light">{metal.purity}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="space-y-6">
            {/* Real-time Price Chart with Time Period Selector */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center justify-between">
                  <span>Live Price Movement</span>
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-[160px] bg-white/5 border-white/20 text-white h-8">
                      <Activity className="h-3 w-3 mr-1 animate-pulse text-white" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="5min" className="text-white hover:bg-white/10">Last 5 Minutes</SelectItem>
                      <SelectItem value="10min" className="text-white hover:bg-white/10">10 Minutes</SelectItem>
                      <SelectItem value="1hour" className="text-white hover:bg-white/10">1 Hour</SelectItem>
                      <SelectItem value="3hour" className="text-white hover:bg-white/10">3 Hours</SelectItem>
                      <SelectItem value="1day" className="text-white hover:bg-white/10">1 Day</SelectItem>
                      <SelectItem value="1week" className="text-white hover:bg-white/10">1 Week</SelectItem>
                      <SelectItem value="1month" className="text-white hover:bg-white/10">1 Month</SelectItem>
                      <SelectItem value="1year" className="text-white hover:bg-white/10">1 Year</SelectItem>
                      <SelectItem value="5year" className="text-white hover:bg-white/10">5 Years</SelectItem>
                      <SelectItem value="ytd" className="text-white hover:bg-white/10">YTD</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Period Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      {timePeriod === "5min" || timePeriod === "10min" ? "Minute" : 
                       timePeriod === "1hour" || timePeriod === "3hour" ? "Hour" : 
                       timePeriod === "1day" ? "Day" : 
                       timePeriod === "1week" ? "Week" : 
                       timePeriod === "1month" ? "Month" : 
                       timePeriod === "1year" || timePeriod === "5year" || timePeriod === "ytd" ? "Period" : "Period"} Change
                    </p>
                    <p className="text-lg font-bold text-white">
                      {metal.dayChangePercent >= 0 ? "+" : ""}{metal.dayChangePercent}%
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">High</p>
                    <p className="text-lg font-bold text-white">{formatPrice(maxPrice)}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Low</p>
                    <p className="text-lg font-bold text-white">{formatPrice(minPrice)}</p>
                  </div>
                </div>
                
                <div className="h-96 relative overflow-hidden">
                  {/* Wave visualization - updates every second */}
                  <div className="absolute inset-0 flex items-end justify-between gap-[1px]">
                    {priceHistory.length > 0 && priceHistory.map((point, index) => {
                      // Defensive calculation to prevent NaN heights
                      const priceRange = maxPrice - minPrice;
                      const height = priceRange > 0 
                        ? ((point.price - minPrice) / priceRange) * 100 
                        : 50; // Default to 50% if range is zero
                      // Highlight last 10 bars
                      const isRecent = index >= priceHistory.length - 10;
                      return (
                        <div
                          key={`${point.timestamp}-${index}`}
                          className={cn(
                            "flex-1 transition-all duration-1000 ease-out",
                            isRecent ? "bg-white opacity-100" : "bg-white/60 opacity-60"
                          )}
                          style={{ 
                            height: `${height}%`,
                            minWidth: '1px'
                          }}
                          title={`${point.time}: ${formatPrice(point.price)}`}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute top-2 left-2 text-white/60 text-xs bg-black/50 px-2 py-1 rounded">
                    High: {formatPrice(maxPrice)}
                  </div>
                  <div className="absolute bottom-2 left-2 text-white/60 text-xs bg-black/50 px-2 py-1 rounded">
                    Low: {formatPrice(minPrice)}
                  </div>
                  <div className="absolute top-2 right-2 text-white/60 text-xs bg-black/50 px-2 py-1 rounded">
                    Current: {formatPrice(currentPrice || metal.currentPrice)}
                  </div>
                </div>
                <div className="mt-4 text-center text-xs text-white/50">
                  Updates every second • Showing {priceHistory.length} data points
                </div>
              </CardContent>
            </Card>

            {/* Holdings Section */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center justify-between">
                  <span>My Holdings</span>
                  <Badge className="bg-white/10 text-white border-white/20">3 Purchases</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Holding Item 1 */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{metal.name}</p>
                      <p className="text-white/60 text-sm">Purchased: Jan 15, 2024</p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Quantity</p>
                      <p className="text-white font-semibold">10 units</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Avg Price</p>
                      <p className="text-white font-semibold">{formatPrice(metal.currentPrice * 0.9)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Invested</p>
                      <p className="text-white font-semibold">{formatCurrency(metal.currentPrice * 0.9 * 10)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Current Value</p>
                      <p className="text-white font-semibold">{formatCurrency(metal.currentPrice * 10)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <p className="text-white/60 text-sm">Profit/Loss</p>
                    <p className="text-white font-semibold text-lg">
                      +{formatCurrency((metal.currentPrice - metal.currentPrice * 0.9) * 10)}
                    </p>
                  </div>
                </div>

                {/* Holding Item 2 */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{metal.name}</p>
                      <p className="text-white/60 text-sm">Purchased: Mar 22, 2024</p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.3%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Quantity</p>
                      <p className="text-white font-semibold">5 units</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Avg Price</p>
                      <p className="text-white font-semibold">{formatPrice(metal.currentPrice * 0.92)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Invested</p>
                      <p className="text-white font-semibold">{formatCurrency(metal.currentPrice * 0.92 * 5)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Current Value</p>
                      <p className="text-white font-semibold">{formatCurrency(metal.currentPrice * 5)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <p className="text-white/60 text-sm">Profit/Loss</p>
                    <p className="text-white font-semibold text-lg">
                      +{formatCurrency((metal.currentPrice - metal.currentPrice * 0.92) * 5)}
                    </p>
                  </div>
                </div>

                {/* Holding Item 3 */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{metal.name}</p>
                      <p className="text-white/60 text-sm">Purchased: Sep 10, 2024</p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2.1%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Quantity</p>
                      <p className="text-white font-semibold">8 units</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Avg Price</p>
                      <p className="text-white font-semibold">{formatPrice(metal.currentPrice * 1.02)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Invested</p>
                      <p className="text-white font-semibold">{formatCurrency(metal.currentPrice * 1.02 * 8)}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Current Value</p>
                      <p className="text-white font-semibold">{formatCurrency(metal.currentPrice * 8)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <p className="text-white/60 text-sm">Profit/Loss</p>
                    <p className="text-white font-semibold text-lg">
                      {formatCurrency((metal.currentPrice - metal.currentPrice * 1.02) * 8)}
                    </p>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Total Holdings</p>
                      <p className="text-white font-bold text-xl">23 units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm mb-1">Total Profit/Loss</p>
                      <p className="text-white font-bold text-xl">
                        +{formatCurrency((metal.currentPrice - metal.currentPrice * 0.9) * 10 + (metal.currentPrice - metal.currentPrice * 0.92) * 5 + (metal.currentPrice - metal.currentPrice * 1.02) * 8)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {/* News Timeline */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Latest Market News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Timeline Item 1 */}
                  <div className="relative pl-8 pb-6 border-l-2 border-white/20 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-white/50">2 hours ago</span>
                      <Badge className="bg-white/10 text-white border-white/20">Positive</Badge>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{metal.name} prices surge on strong demand</h4>
                    <p className="text-sm text-white/60 mb-2">Global demand for {metal.name.toLowerCase()} continues to rise as investors seek safe-haven assets amid market uncertainty.</p>
                    <p className="text-xs text-white/40">Source: Market Watch</p>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative pl-8 pb-6 border-l-2 border-white/20 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-white/50">5 hours ago</span>
                      <Badge className="bg-white/10 text-white border-white/20">Neutral</Badge>
                    </div>
                    <h4 className="text-white font-semibold mb-1">Analysts predict steady growth in precious metals</h4>
                    <p className="text-sm text-white/60 mb-2">Market experts forecast continued stability in precious metals market with moderate gains expected over the next quarter.</p>
                    <p className="text-xs text-white/40">Source: Bloomberg</p>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative pl-8 pb-6 border-l-2 border-white/20 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-white/50">1 day ago</span>
                      <Badge className="bg-white/10 text-white border-white/20">Market Update</Badge>
                    </div>
                    <h4 className="text-white font-semibold mb-1">Central banks increase {metal.name.toLowerCase()} reserves</h4>
                    <p className="text-sm text-white/60 mb-2">Several major central banks have announced increased purchases of {metal.name.toLowerCase()} to diversify their reserves.</p>
                    <p className="text-xs text-white/40">Source: Reuters</p>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="relative pl-8 pb-6 border-l-2 border-white/20 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-white/50">2 days ago</span>
                      <Badge className="bg-white/10 text-white border-white/20">Industry News</Badge>
                    </div>
                    <h4 className="text-white font-semibold mb-1">New mining technology boosts supply</h4>
                    <p className="text-sm text-white/60 mb-2">Advanced extraction methods are expected to increase {metal.name.toLowerCase()} production by 15% this year.</p>
                    <p className="text-xs text-white/40">Source: Financial Times</p>
                  </div>

                  {/* Timeline Item 5 */}
                  <div className="relative pl-8 last:pb-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-black"></div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-white/50">3 days ago</span>
                      <Badge className="bg-white/10 text-white border-white/20">Alert</Badge>
                    </div>
                    <h4 className="text-white font-semibold mb-1">Market volatility expected due to geopolitical tensions</h4>
                    <p className="text-sm text-white/60 mb-2">Traders advised to monitor precious metals closely as global tensions may impact short-term pricing.</p>
                    <p className="text-xs text-white/40">Source: CNBC</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Sentiment */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60 text-sm">Overall Sentiment</span>
                      <Badge className="bg-white/10 text-white border-white/20">Bullish</Badge>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{width: '68%'}}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/40">Bearish</span>
                      <span className="text-xs text-white/40">68% Bullish</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Metal Specifications */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metal.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <p className="text-white/60 text-sm">{key}</p>
                      <p className="text-white text-sm font-medium">{value as string}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment Information */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Investment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Description</p>
                  <p className="text-white/80 text-sm">{metal.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Min Investment</p>
                    <p className="text-white font-semibold">{formatCurrency(metal.minInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Purity</p>
                    <p className="text-white font-semibold">{metal.purity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="max-w-md bg-black/95 text-white border border-white/20 rounded-none backdrop-blur-xl">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-2xl font-light tracking-wider text-white uppercase">Buy {metal.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Price Display */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-none p-6 backdrop-blur-sm">
              <p className="text-white/60 text-sm font-light mb-1">Current Price</p>
              <p className="text-3xl font-light text-white">{formatPrice(metal.currentPrice)}</p>
              <Badge variant="secondary" className="mt-2 bg-white/10 text-white border-white/20 rounded-none">
                {metal.dayChange >= 0 ? '+' : ''}{metal.dayChangePercent}%
              </Badge>
            </div>
            
            {/* Quantity Input */}
            <div className="space-y-2">
              <label className="block text-sm font-light text-white/70 uppercase tracking-wider">Quantity (units)</label>
              <Input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="0.01"
                step="0.01"
                className="bg-white/5 border-white/20 text-white rounded-none h-12 text-lg font-light backdrop-blur-sm"
                placeholder="0.00"
                data-testid="input-buy-quantity"
              />
            </div>
            
            {/* Total Amount */}
            <div className="bg-white/5 border border-white/20 rounded-none p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-light">Total Amount</span>
                <span className="text-2xl text-white font-light">
                  {formatCurrency((parseFloat(orderQuantity) || 0) * metal.currentPrice)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light"
              onClick={() => setShowBuyDialog(false)}
              data-testid="button-cancel-buy"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 text-white hover:bg-green-700 rounded-none h-12 font-light border border-white/20"
              onClick={handleBuyOrder}
              disabled={!orderQuantity || parseFloat(orderQuantity) <= 0}
              data-testid="button-confirm-buy"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent className="max-w-md bg-black/95 text-white border border-white/20 rounded-none backdrop-blur-xl">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-2xl font-light tracking-wider text-white uppercase">Sell {metal.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Price Display */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-none p-6 backdrop-blur-sm">
              <p className="text-white/60 text-sm font-light mb-1">Current Price</p>
              <p className="text-3xl font-light text-white">{formatPrice(metal.currentPrice)}</p>
              <Badge variant="secondary" className="mt-2 bg-white/10 text-white border-white/20 rounded-none">
                {metal.dayChange >= 0 ? '+' : ''}{metal.dayChangePercent}%
              </Badge>
            </div>
            
            {/* Quantity Input */}
            <div className="space-y-2">
              <label className="block text-sm font-light text-white/70 uppercase tracking-wider">Quantity (units)</label>
              <Input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="0.01"
                step="0.01"
                className="bg-white/5 border-white/20 text-white rounded-none h-12 text-lg font-light backdrop-blur-sm"
                placeholder="0.00"
                data-testid="input-sell-quantity"
              />
              <p className="text-xs text-white/60 font-light mt-1">Available: 10.5 units</p>
            </div>
            
            {/* Total Amount */}
            <div className="bg-white/5 border border-white/20 rounded-none p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/60 font-light">Total Amount</span>
                <span className="text-2xl text-white font-light">
                  {formatCurrency((parseFloat(orderQuantity) || 0) * metal.currentPrice)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light"
              onClick={() => setShowSellDialog(false)}
              data-testid="button-cancel-sell"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-none h-12 font-light border border-white/20"
              onClick={handleSellOrder}
              disabled={!orderQuantity || parseFloat(orderQuantity) <= 0}
              data-testid="button-confirm-sell"
            >
              <Target className="h-4 w-4 mr-2" />
              Sell Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Bottom Buy/Sell Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-white/60">Current Price</div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                {formatPrice(metal.currentPrice)}
                <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">
                  {metal.dayChange >= 0 ? '+' : ''}{metal.dayChangePercent}%
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="min-w-[100px] bg-red-600/90 hover:bg-red-600 text-white border border-red-500/30 backdrop-blur-xl font-semibold shadow-lg shadow-red-500/20 rounded-none"
              onClick={() => setShowSellDialog(true)}
              data-testid="button-sell-sticky"
            >
              <Target className="h-4 w-4 mr-2" />
              Sell
            </Button>
            <Button 
              className="min-w-[100px] bg-green-600/90 hover:bg-green-600 text-white border border-green-500/30 backdrop-blur-xl font-semibold shadow-lg shadow-green-500/20 rounded-none"
              onClick={() => setShowBuyDialog(true)}
              data-testid="button-buy-sticky"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
