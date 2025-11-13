import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { InvestmentVendor, MarketData, InvestmentWatchlist, InvestmentOrder } from "@shared/schema";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  ArrowUp,
  ArrowDown,
  BarChart3,
  DollarSign,
  Star,
  ShoppingCart,
  Activity,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Shield,
  Gift,
  Zap,
  Trophy,
  Target,
  Package,
  Building2,
  Coins,
  X,
  Clock
} from "lucide-react";

export default function Investment() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  
  // Parse URL params
  const urlParams = new URLSearchParams(searchString);
  const tabFromUrl = urlParams.get('tab') || 'explore';
  const subTabFromUrl = urlParams.get('subtab') || 'all';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabFromUrl);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "1y">("7d");
  const [holdingsSubTab, setHoldingsSubTab] = useState<string>(subTabFromUrl);
  const [ordersSubTab, setOrdersSubTab] = useState<string>(subTabFromUrl);
  const [watchlistSubTab, setWatchlistSubTab] = useState<string>(subTabFromUrl);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [exploreWatchlist, setExploreWatchlist] = useState<Set<string>>(new Set(["RELIANCE", "BTC", "GOLD"]));
  const { toast} = useToast();
  
  // Update URL params when tab changes
  const handleTabChange = (newTab: string) => {
    setSelectedTab(newTab);
    const params = new URLSearchParams();
    params.set('tab', newTab);
    params.set('subtab', 'all');
    navigate(`/investment?${params.toString()}`, { replace: true });
  };
  
  // Update URL params when subtab changes
  const handleSubTabChange = (newSubTab: string, tabType: 'holdings' | 'orders' | 'watchlist') => {
    if (tabType === 'holdings') setHoldingsSubTab(newSubTab);
    if (tabType === 'orders') setOrdersSubTab(newSubTab);
    if (tabType === 'watchlist') setWatchlistSubTab(newSubTab);
    
    const params = new URLSearchParams();
    params.set('tab', selectedTab);
    params.set('subtab', newSubTab);
    navigate(`/investment?${params.toString()}`, { replace: true });
  };
  
  // Sync state with URL on mount and URL change
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const tab = params.get('tab');
    const subtab = params.get('subtab');
    
    if (tab && tab !== selectedTab) {
      setSelectedTab(tab);
    }
    if (subtab) {
      if (selectedTab === 'holdings') setHoldingsSubTab(subtab);
      if (selectedTab === 'orders') setOrdersSubTab(subtab);
      if (selectedTab === 'watchlist') setWatchlistSubTab(subtab);
    }
  }, [searchString]);

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useQuery<{ vendors: InvestmentVendor[] }>({
    queryKey: ["/api/vendors"],
  });

  // Fetch trending market data
  const trendingSymbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"];
  const { data: marketDataList, isLoading: marketLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/market/trending"],
    queryFn: async () => {
      const promises = trendingSymbols.map(symbol => 
        fetch(`/api/market/${symbol}`).then(res => res.json()).then(d => d.data)
      );
      return Promise.all(promises);
    },
  });

  // Fetch user watchlist
  const { data: watchlistData, isLoading: watchlistLoading } = useQuery<{ items: InvestmentWatchlist[] }>({
    queryKey: ["/api/watchlist"],
    enabled: isAuthenticated,
  });

  // Fetch live Bitcoin price
  const { data: btcLiveData } = useQuery<{ data: { priceInr: number; changePercent24h: number } }>({
    queryKey: ["/api/crypto/live/BTC"],
    refetchInterval: 60000, // Refresh every minute
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch live Ethereum price
  const { data: ethLiveData } = useQuery<{ data: { priceInr: number; changePercent24h: number } }>({
    queryKey: ["/api/crypto/live/ETH"],
    refetchInterval: 60000, // Refresh every minute
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch live Gold price
  const { data: goldLiveData } = useQuery<{ data: { pricePerGram: number; changePercent24h: number } }>({
    queryKey: ["/api/precious-metals/gold"],
    refetchInterval: 300000, // Refresh every 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch live Silver price
  const { data: silverLiveData } = useQuery<{ data: { pricePerGram: number; changePercent24h: number } }>({
    queryKey: ["/api/precious-metals/silver"],
    refetchInterval: 300000, // Refresh every 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch user portfolio (holdings) with dummy data
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<{ portfolio: any[] }>({
    queryKey: ["/api/investments/portfolio"],
    enabled: isAuthenticated,
    placeholderData: { 
      portfolio: [
        { id: "1", symbol: "RELIANCE", instrumentName: "Reliance Industries Ltd", investmentType: "Stock", quantity: "50", avgPrice: "1300.00", currentPrice: "1377.80", currentValue: "68890.00", totalInvested: "65000.00", gainLoss: "3890.00", gainLossPercentage: "5.98" },
        { id: "2", symbol: "TCS", instrumentName: "Tata Consultancy Services", investmentType: "Stock", quantity: "30", avgPrice: "2950.00", currentPrice: "3061.70", currentValue: "91851.00", totalInvested: "88500.00", gainLoss: "3351.00", gainLossPercentage: "3.79" },
        { id: "3", symbol: "TATAMOTORS", instrumentName: "Tata Motors Ltd", investmentType: "Stock", quantity: "100", avgPrice: "695.00", currentPrice: "681.10", currentValue: "68110.00", totalInvested: "69500.00", gainLoss: "-1390.00", gainLossPercentage: "-2.00" },
        { id: "4", symbol: "HINDZINC", instrumentName: "Hindustan Zinc Ltd", investmentType: "Stock", quantity: "150", avgPrice: "485.00", currentPrice: "512.25", currentValue: "76837.50", totalInvested: "72750.00", gainLoss: "4087.50", gainLossPercentage: "5.62" },
        { id: "5", symbol: "BAJAJ-AUTO", instrumentName: "Bajaj Auto Ltd", investmentType: "Stock", quantity: "10", avgPrice: "8500.00", currentPrice: "8812.00", currentValue: "88120.00", totalInvested: "85000.00", gainLoss: "3120.00", gainLossPercentage: "3.67" },
        { id: "6", symbol: "HAL", instrumentName: "Hindustan Aeronautics Ltd", investmentType: "Stock", quantity: "15", avgPrice: "4650.00", currentPrice: "4846.30", currentValue: "72694.50", totalInvested: "69750.00", gainLoss: "2944.50", gainLossPercentage: "4.22" },
        { id: "7", symbol: "GOLD", instrumentName: "Digital Gold 24K", investmentType: "Commodity", quantity: "10", avgPrice: "11800.00", currentPrice: "12415.00", currentValue: "124150.00", totalInvested: "118000.00", gainLoss: "6150.00", gainLossPercentage: "5.21" },
        { id: "8", symbol: "SILVER", instrumentName: "Digital Silver", investmentType: "Commodity", quantity: "500", avgPrice: "155.00", currentPrice: "167.00", currentValue: "83500.00", totalInvested: "77500.00", gainLoss: "6000.00", gainLossPercentage: "7.74" },
        { id: "9", symbol: "DIAMOND", instrumentName: "Diamond 1 Carat", investmentType: "Commodity", quantity: "2", avgPrice: "60000.00", currentPrice: "65000.00", currentValue: "130000.00", totalInvested: "120000.00", gainLoss: "10000.00", gainLossPercentage: "8.33" },
        { id: "10", symbol: "BTC", instrumentName: "Bitcoin", investmentType: "Crypto", quantity: "0.05", avgPrice: "9500000.00", currentPrice: "10799307.00", currentValue: "539965.35", totalInvested: "475000.00", gainLoss: "64965.35", gainLossPercentage: "13.68" },
        { id: "11", symbol: "ETH", instrumentName: "Ethereum", investmentType: "Crypto", quantity: "1.5", avgPrice: "365000.00", currentPrice: "396958.00", currentValue: "595437.00", totalInvested: "547500.00", gainLoss: "47937.00", gainLossPercentage: "8.75" },
      ]
    },
  });

  // Fetch user orders with dummy data
  const { data: ordersData, isLoading: ordersLoading } = useQuery<{ orders: InvestmentOrder[] }>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
    placeholderData: {
      orders: [
        { id: "1", userId: "user1", symbol: "RELIANCE", instrumentName: "Reliance Industries Ltd", orderType: "buy", quantity: "25", orderPrice: "1377.80", totalAmount: "34445.00", status: "executed", executedPrice: "1377.80", createdAt: new Date("2025-10-08") },
        { id: "2", userId: "user1", symbol: "TCS", instrumentName: "Tata Consultancy Services", orderType: "buy", quantity: "10", orderPrice: "3061.70", totalAmount: "30617.00", status: "executed", executedPrice: "3061.70", createdAt: new Date("2025-10-07") },
        { id: "3", userId: "user1", symbol: "TATAMOTORS", instrumentName: "Tata Motors Ltd", orderType: "buy", quantity: "80", orderPrice: "681.10", totalAmount: "54488.00", status: "executed", executedPrice: "681.10", createdAt: new Date("2025-10-06") },
        { id: "4", userId: "user1", symbol: "HAL", instrumentName: "Hindustan Aeronautics Ltd", orderType: "buy", quantity: "15", orderPrice: "4846.30", totalAmount: "72694.50", status: "executed", executedPrice: "4846.30", createdAt: new Date("2025-10-05") },
        { id: "5", userId: "user1", symbol: "HINDZINC", instrumentName: "Hindustan Zinc Ltd", orderType: "buy", quantity: "150", orderPrice: "512.25", totalAmount: "76837.50", status: "executed", executedPrice: "512.25", createdAt: new Date("2025-10-04") },
        { id: "6", userId: "user1", symbol: "GOLD", instrumentName: "Digital Gold 24K", orderType: "buy", quantity: "5", orderPrice: "12415.00", totalAmount: "62075.00", status: "executed", executedPrice: "12415.00", createdAt: new Date("2025-10-09") },
        { id: "7", userId: "user1", symbol: "SILVER", instrumentName: "Digital Silver", orderType: "buy", quantity: "250", orderPrice: "167.00", totalAmount: "41750.00", status: "executed", executedPrice: "167.00", createdAt: new Date("2025-10-08") },
        { id: "8", userId: "user1", symbol: "DIAMOND", instrumentName: "Diamond 1 Carat", orderType: "buy", quantity: "2", orderPrice: "65000.00", totalAmount: "130000.00", status: "pending", executedPrice: null, createdAt: new Date("2025-10-09") },
        { id: "9", userId: "user1", symbol: "BTC", instrumentName: "Bitcoin", orderType: "buy", quantity: "0.02", orderPrice: "10799307.00", totalAmount: "215986.14", status: "executed", executedPrice: "10799307.00", createdAt: new Date("2025-10-07") },
        { id: "10", userId: "user1", symbol: "ETH", instrumentName: "Ethereum", orderType: "buy", quantity: "1.0", orderPrice: "396958.00", totalAmount: "396958.00", status: "executed", executedPrice: "396958.00", createdAt: new Date("2025-10-06") },
        { id: "11", userId: "user1", symbol: "BAJAJ-AUTO", instrumentName: "Bajaj Auto Ltd", orderType: "buy", quantity: "10", orderPrice: "8812.00", totalAmount: "88120.00", status: "executed", executedPrice: "8812.00", createdAt: new Date("2025-10-05") },
        { id: "12", userId: "user1", symbol: "VEDL", instrumentName: "Vedanta Ltd", orderType: "buy", quantity: "200", orderPrice: "484.20", totalAmount: "96840.00", status: "pending", executedPrice: null, createdAt: new Date("2025-10-09") },
      ] as InvestmentOrder[]
    },
  });

  // Add to watchlist mutation
  const addToWatchlistMutation = useMutation({
    mutationFn: async (data: { symbol: string; instrumentName: string; assetType: string }) => {
      return apiRequest("POST", "/api/watchlist", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to Watchlist",
        description: "Asset added to your holdings",
      });
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return apiRequest("PATCH", `/api/orders/${orderId}`, { status: "cancelled" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Updated",
        description: "Latest market data loaded",
      });
    }, 1000);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    toast({
      title: "Category Selected",
      description: `Showing ${categoryId} investments`,
    });
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
  };

  const handleVendorCompare = () => {
    navigate("/investment/compare-vendors");
  };

  const handleAddToWatchlist = (symbol: string, instrumentName: string, assetType: string) => {
    addToWatchlistMutation.mutate({ symbol, instrumentName, assetType });
  };

  const toggleExploreWatchlist = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExploreWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
        toast({
          title: "Removed from Watchlist",
          description: `${symbol} has been removed from your watchlist`,
        });
      } else {
        newSet.add(symbol);
        toast({
          title: "Added to Watchlist",
          description: `${symbol} has been added to your watchlist`,
        });
      }
      return newSet;
    });
  };

  const handleCancelOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    cancelOrderMutation.mutate(orderId);
  };

  // Calculate portfolio summary from actual holdings
  const watchlistItems = watchlistData?.items || [];
  const portfolioItems = portfolioData?.portfolio || [];
  
  const portfolioValue = useMemo(() => portfolioItems.reduce((sum, item) => {
    const currentValue = parseFloat(item.currentValue || "0");
    return sum + currentValue;
  }, 0), [portfolioItems]);
  
  const investedValue = useMemo(() => portfolioItems.reduce((sum, item) => {
    const totalInvested = parseFloat(item.totalInvested || "0");
    return sum + totalInvested;
  }, 0), [portfolioItems]);
  
  const totalGainLoss = useMemo(() => portfolioValue - investedValue, [portfolioValue, investedValue]);
  const gainLossPercent = useMemo(() => investedValue > 0 ? ((totalGainLoss / investedValue) * 100) : 0, [totalGainLoss, investedValue]);

  // Filter orders
  const allOrders = ordersData?.orders || [];
  const filteredOrders = useMemo(() => allOrders.filter(order => {
    if (orderFilter === "all") return true;
    if (orderFilter === "buy") return order.orderType === "buy";
    if (orderFilter === "sell") return order.orderType === "sell";
    if (orderFilter === "pending") return order.status === "pending";
    if (orderFilter === "executed") return order.status === "executed";
    return true;
  }), [allOrders, orderFilter]);

  // Pagination for Portfolio
  const {
    currentPage: portfolioPage,
    totalPages: portfolioTotalPages,
    paginatedData: paginatedPortfolio,
    goToPage: goToPortfolioPage,
    canGoNext: canGoNextPortfolio,
    canGoPrevious: canGoPreviousPortfolio,
    startIndex: portfolioStartIndex,
    endIndex: portfolioEndIndex,
    totalItems: portfolioTotalItems,
  } = usePagination({
    data: portfolioItems,
    itemsPerPage: 10,
  });

  // Pagination for Orders
  const {
    currentPage: ordersPage,
    totalPages: ordersTotalPages,
    paginatedData: paginatedOrders,
    goToPage: goToOrdersPage,
    canGoNext: canGoNextOrders,
    canGoPrevious: canGoPreviousOrders,
    startIndex: ordersStartIndex,
    endIndex: ordersEndIndex,
    totalItems: ordersTotalItems,
  } = usePagination({
    data: filteredOrders,
    itemsPerPage: 10,
  });

  const getStatusColor = (status: string) => {
    return "bg-white/10 text-white border-white/20";
  };

  const formatCurrency = (amount: number) => {
    if (hideAmounts) return "****";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Generate mock price data for charts
  const generatePriceData = (period: "7d" | "30d" | "1y", basePrice: number = 100) => {
    const points = period === "7d" ? 7 : period === "30d" ? 30 : 365;
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * basePrice * 0.05;
      price = Math.max(price + change, basePrice * 0.7);
      
      const date = new Date();
      date.setDate(date.getDate() - (points - i - 1));
      
      data.push({
        date: period === "1y" ? date.toLocaleDateString('en-US', { month: 'short' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-lg font-semibold text-white">Investments</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideAmounts(!hideAmounts)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-toggle-amounts"
            >
              {hideAmounts ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              disabled={refreshing}
              data-testid="button-refresh"
            >
              <RefreshCw className={cn("h-5 w-5", refreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search stocks, mutual funds, bonds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:border-white/40 focus:ring-0 h-10 text-sm"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="px-0 pt-[170px]">
        <div className="fixed top-[152px] left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4">
          <TabsList className="w-full bg-transparent justify-start h-12 p-0 gap-4 overflow-x-auto">
            <TabsTrigger 
              value="explore" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full whitespace-nowrap"
              data-testid="tab-explore"
            >
              <Package className="h-4 w-4 mr-2" />
              Explore
            </TabsTrigger>
            <TabsTrigger 
              value="holdings" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full whitespace-nowrap"
              data-testid="tab-holdings"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Holdings
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full whitespace-nowrap"
              data-testid="tab-orders"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full whitespace-nowrap"
              data-testid="tab-watchlist"
            >
              <Star className="h-4 w-4 mr-2" />
              Watch List
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Explore Tab */}
        <TabsContent value="explore" className="mt-0 px-4 pb-6 space-y-6">
          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Browse by Category</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: "stocks", label: "Stocks", icon: TrendingUp, color: "from-white/10 to-white/5", iconColor: "text-white" },
                { id: "mutual_funds", label: "Mutual Funds", icon: Shield, color: "from-white/10 to-white/5", iconColor: "text-white" },
                { id: "sip", label: "SIP", icon: Target, color: "from-white/10 to-white/5", iconColor: "text-white" },
                { id: "bonds", label: "Bonds", icon: Building2, color: "from-white/10 to-white/5", iconColor: "text-white" },
                { id: "commodities", label: "Commodities", icon: Coins, color: "from-white/10 to-white/5", iconColor: "text-white" },
              ].map((category) => (
                <Card 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.label)}
                  className={cn(
                    "bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 min-w-[140px]",
                    selectedCategory === category.label && "border-white/30 bg-white/10"
                  )}
                  data-testid={`card-category-${category.id}`}
                >
                  <CardContent className="p-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r mb-3", category.color)}>
                      <category.icon className={cn("h-6 w-6", category.iconColor)} />
                    </div>
                    <p className="font-medium text-white text-sm">{category.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Stocks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Trending Stocks</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/investment/stocks")}
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                data-testid="button-view-all-trending"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            {marketLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white/5 border border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20 bg-white/10" />
                          <Skeleton className="h-3 w-32 bg-white/10" />
                        </div>
                        <div className="space-y-2 text-right">
                          <Skeleton className="h-4 w-16 bg-white/10" />
                          <Skeleton className="h-3 w-12 bg-white/10" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {marketDataList?.slice(0, 3).map((stock) => {
                  const changePercent = parseFloat(stock.dayChangePercent || "0");
                  return (
                    <Card 
                      key={stock.symbol} 
                      className="bg-white/5 border border-white/10"
                      data-testid={`card-stock-${stock.symbol}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <div>
                              <p className="font-semibold text-white">{stock.symbol}</p>
                              <p className="text-sm text-white/60">{stock.instrumentName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-white">₹{parseFloat(stock.currentPrice).toFixed(2)}</p>
                              <div className="flex items-center gap-1 text-sm text-white/80">
                                {changePercent >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                <span>{changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 flex-shrink-0 text-white/60 hover:text-white hover:bg-white/10"
                              onClick={(e) => toggleExploreWatchlist(stock.symbol, e)}
                              data-testid={`button-watchlist-${stock.symbol}`}
                            >
                              <Star className={cn("h-4 w-4", exploreWatchlist.has(stock.symbol) && "fill-current")} />
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedAsset(stock);
                            setBuyDialogOpen(true);
                          }}
                          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                          data-testid={`button-buy-stock-${stock.symbol}`}
                        >
                          Buy Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trending Crypto */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Trending Crypto</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/crypto-list")}
                data-testid="button-view-all-crypto"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { 
                  symbol: "BTC", 
                  name: "Bitcoin", 
                  price: btcLiveData?.data?.priceInr || 10799307, 
                  change: btcLiveData?.data?.changePercent24h || -1.14 
                },
                { 
                  symbol: "ETH", 
                  name: "Ethereum", 
                  price: ethLiveData?.data?.priceInr || 396958, 
                  change: ethLiveData?.data?.changePercent24h || -1.50 
                },
                { symbol: "BNB", name: "Binance Coin", price: 109840, change: 0.56 }
              ].map((crypto) => (
                <Card 
                  key={crypto.symbol} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-crypto-${crypto.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <div>
                          <p className="font-semibold text-white">{crypto.symbol}</p>
                          <p className="text-sm text-white/60">{crypto.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-white">₹{crypto.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 text-sm text-white/80">
                            {crypto.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            <span>{crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 flex-shrink-0 text-white/60 hover:text-white hover:bg-white/10"
                          onClick={(e) => toggleExploreWatchlist(crypto.symbol, e)}
                          data-testid={`button-watchlist-${crypto.symbol}`}
                        >
                          <Star className={cn("h-4 w-4", exploreWatchlist.has(crypto.symbol) && "fill-current")} />
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/crypto/${crypto.symbol}`)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid={`button-buy-crypto-${crypto.symbol}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gold */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Gold</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/gold-list")}
                data-testid="button-view-all-gold"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { 
                  id: "1", 
                  name: "24K Digital Gold", 
                  price: goldLiveData?.data?.pricePerGram || 12415, 
                  change: goldLiveData?.data?.changePercent24h || 0.18, 
                  provider: "PhonePe" 
                },
                { id: "2", name: "22K Gold Coin", price: 11380, change: 0.16, provider: "MMTC-PAMP" },
                { id: "3", name: "Digital Gold SGB", price: 12393, change: 0.15, provider: "RBI" }
              ].map((gold) => (
                <Card 
                  key={gold.id} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-gold-${gold.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{gold.name}</p>
                        <p className="text-sm text-white/60">{gold.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{gold.price.toFixed(2)}/g</p>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          {gold.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          <span>{gold.change >= 0 ? "+" : ""}{gold.change.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/gold-list")}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid={`button-buy-gold-${gold.id}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Silver */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Silver</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/silver-list")}
                data-testid="button-view-all-silver"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { 
                  id: "1", 
                  name: "99.9% Digital Silver", 
                  price: silverLiveData?.data?.pricePerGram || 167, 
                  change: silverLiveData?.data?.changePercent24h || 0.36, 
                  provider: "PhonePe" 
                },
                { id: "2", name: "Silver Coin 10g", price: 165, change: 0.30, provider: "MMTC-PAMP" },
                { id: "3", name: "Silver Bar 100g", price: 168, change: 0.42, provider: "Augmont" }
              ].map((silver) => (
                <Card 
                  key={silver.id} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-silver-${silver.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{silver.name}</p>
                        <p className="text-sm text-white/60">{silver.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{silver.price.toFixed(2)}/g</p>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          {silver.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          <span>{silver.change >= 0 ? "+" : ""}{silver.change.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/silver-list")}
                      className="w-full bg-gray-300 hover:bg-gray-400 text-black h-8"
                      data-testid={`button-buy-silver-${silver.id}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Diamond */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Diamond</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/diamond-list")}
                data-testid="button-view-all-diamond"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { id: "1", name: "Lab Grown Diamond 1ct", price: 65000, change: 0.00, provider: "BlueStone" },
                { id: "2", name: "Natural Diamond GIA 1ct", price: 150000, change: 0.00, provider: "Tiffany & Co" },
                { id: "3", name: "Lab Diamond Round 1ct", price: 60000, change: 0.00, provider: "CaratLane" }
              ].map((diamond) => (
                <Card 
                  key={diamond.id} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-diamond-${diamond.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{diamond.name}</p>
                        <p className="text-sm text-white/60">{diamond.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{diamond.price.toLocaleString()}/ct</p>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          {diamond.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          <span>{diamond.change >= 0 ? "+" : ""}{diamond.change.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/diamond-list")}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid={`button-buy-diamond-${diamond.id}`}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SIP */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">SIP Plans</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/sip-list")}
                data-testid="button-view-all-sip"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { id: "1", name: "HDFC Mid-Cap Opportunities Fund", returns: 19.44, amount: 5000, fundHouse: "HDFC MF" },
                { id: "2", name: "SBI Bluechip Fund", returns: 18.75, amount: 10000, fundHouse: "SBI MF" },
                { id: "3", name: "ICICI Prudential Technology Fund", returns: 25.93, amount: 3000, fundHouse: "ICICI Prudential" }
              ].map((sip) => (
                <Card 
                  key={sip.id} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-sip-${sip.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{sip.name}</p>
                        <p className="text-sm text-white/60">{sip.fundHouse}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{sip.amount.toLocaleString()}/mo</p>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          <TrendingUp className="h-3 w-3" />
                          <span>+{sip.returns.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/sip-list")}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid={`button-start-sip-${sip.id}`}
                    >
                      Start SIP
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mutual Funds */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Mutual Funds</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/investment/mutual-funds")}
                data-testid="button-view-all-mutual-funds"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { symbol: "MF001", name: "Axis Bluechip Fund", nav: 45.50, change: 2.3, fundHouse: "Axis MF" },
                { symbol: "MF002", name: "HDFC Mid Cap Opportunities Fund", nav: 125.75, change: -0.8, fundHouse: "HDFC MF" },
                { symbol: "MF003", name: "SBI Small Cap Fund", nav: 88.20, change: 3.5, fundHouse: "SBI MF" }
              ].map((fund) => (
                <Card 
                  key={fund.symbol} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-mutual-fund-${fund.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{fund.name}</p>
                        <p className="text-sm text-white/60">{fund.fundHouse}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{fund.nav.toFixed(2)}</p>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          {fund.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          <span>{fund.change >= 0 ? "+" : ""}{fund.change.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/investment/mutual-funds")}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid={`button-invest-fund-${fund.symbol}`}
                    >
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fixed Deposits */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Fixed Deposits</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto"
                onClick={() => navigate("/fd-list")}
                data-testid="button-view-all-fd"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { id: "1", name: "HDFC Bank FD", rate: 7.5, tenure: "1 Year", bank: "HDFC Bank" },
                { id: "2", name: "SBI Senior Citizen FD", rate: 8.25, tenure: "5 Years", bank: "SBI" },
                { id: "3", name: "ICICI Bank Tax Saver FD", rate: 7.75, tenure: "5 Years", bank: "ICICI Bank" }
              ].map((fd) => (
                <Card 
                  key={fd.id} 
                  className="bg-white/5 border border-white/10"
                  data-testid={`card-fd-${fd.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{fd.bank}</p>
                        <p className="text-sm text-white/60">{fd.tenure}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white/80">{fd.rate}% p.a.</p>
                        <p className="text-xs text-white/60">Interest Rate</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/fd-list")}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid={`button-invest-fd-${fd.id}`}
                    >
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Vendor Comparison */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Compare Brokers</h2>
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-1">Find the Best Broker</p>
                    <p className="text-sm text-white/70 mb-3">
                      {vendorsLoading ? "Loading brokers..." : `Compare ${vendorsData?.vendors.length || 0}+ brokers`}
                    </p>
                    <Button 
                      size="sm" 
                      onClick={handleVendorCompare}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-8"
                      data-testid="button-compare-brokers"
                    >
                      Compare Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="mt-0 px-4 pb-6 space-y-6">
          {/* Portfolio Summary Card */}
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Total Portfolio Value</p>
                <div className="flex items-center gap-2">
                  {totalGainLoss >= 0 ? <TrendingUp className="h-3 w-3 text-white/60" /> : <TrendingDown className="h-3 w-3 text-white/60" />}
                  <span className="text-xs text-white/60">{gainLossPercent >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight">
                {formatCurrency(portfolioValue)}
              </p>
              
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Invested</p>
                  <p className="text-lg font-light text-white">{formatCurrency(investedValue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Returns</p>
                  <p className="text-lg font-light text-white">{formatCurrency(Math.abs(totalGainLoss))}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Gain/Loss</p>
                  <p className="text-lg font-light text-white">{gainLossPercent >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="border-b border-white/10">
            <div className="flex gap-0 overflow-x-auto">
              {["all", "stocks", "crypto", "gold", "silver", "diamond"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab, 'holdings')}
                  className={cn(
                    "px-4 py-3 text-[10px] uppercase tracking-widest font-light border-b-2 whitespace-nowrap transition-colors",
                    holdingsSubTab === tab 
                      ? "border-white text-white" 
                      : "border-transparent text-white/50 hover:text-white/70"
                  )}
                  data-testid={`button-holdings-${tab}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Holdings List */}
          <div className="space-y-3">
            {portfolioLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4">
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </>
            ) : portfolioItems.length === 0 ? (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8 text-center">
                <BarChart3 className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1 font-light tracking-wide">No holdings yet</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Start investing to build your portfolio</p>
              </div>
            ) : (
              paginatedPortfolio
                .filter(item => {
                  if (holdingsSubTab === "all") return true;
                  if (holdingsSubTab === "stocks") return item.investmentType === "Stock";
                  if (holdingsSubTab === "crypto") return item.investmentType === "Crypto";
                  if (holdingsSubTab === "gold") return item.symbol.includes("GOLD");
                  if (holdingsSubTab === "silver") return item.symbol.includes("SILVER");
                  if (holdingsSubTab === "diamond") return item.symbol.includes("DIAMOND");
                  return true;
                })
                .map((item) => {
                  const currentValue = parseFloat(item.currentValue || "0");
                  const totalInvested = parseFloat(item.totalInvested || "0");
                  const gainLoss = parseFloat(item.gainLoss || "0");
                  const gainLossPercent = parseFloat(item.gainLossPercentage || "0");
                  const quantity = parseFloat(item.quantity || "0");
                  const avgPrice = parseFloat(item.avgPrice || "0");
                  
                  return (
                    <div
                      key={item.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedAsset(item);
                        setDetailSheetOpen(true);
                      }}
                      data-testid={`card-holding-${item.symbol}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{item.symbol}</h4>
                              <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-[10px] text-white/70 uppercase tracking-widest">
                                {item.investmentType}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/50 tracking-wide">{item.instrumentName}</p>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{quantity} units @ ₹{avgPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-light text-white tracking-tight mb-1">{formatCurrency(currentValue)}</p>
                            <div className="flex items-center gap-1 justify-end">
                              {gainLoss >= 0 ? 
                                <TrendingUp className="h-3 w-3 text-white/50" /> : 
                                <TrendingDown className="h-3 w-3 text-white/50" />
                              }
                              <span className="text-[10px] font-light text-white/50">
                                {gainLoss >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(item);
                              setBuyDialogOpen(true);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-light transition-all"
                            data-testid={`button-buy-${item.symbol}`}
                          >
                            Buy More
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(item);
                              setSellDialogOpen(true);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-light transition-all"
                            data-testid={`button-sell-${item.symbol}`}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}

            {/* Pagination */}
            {portfolioItems.length > 10 && (
              <PaginationControls
                currentPage={portfolioPage}
                totalPages={portfolioTotalPages}
                onPageChange={goToPortfolioPage}
                canGoNext={canGoNextPortfolio}
                canGoPrevious={canGoPreviousPortfolio}
                startIndex={portfolioStartIndex}
                endIndex={portfolioEndIndex}
                totalItems={portfolioTotalItems}
              />
            )}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-0 px-4 pb-6 space-y-6">
          {/* Sub Tabs */}
          <div className="border-b border-white/10">
            <div className="flex gap-0 overflow-x-auto">
              {["all", "stocks", "crypto", "gold", "silver", "diamond"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab, 'orders')}
                  className={cn(
                    "px-4 py-3 text-[10px] uppercase tracking-widest font-light border-b-2 whitespace-nowrap transition-colors",
                    ordersSubTab === tab 
                      ? "border-white text-white" 
                      : "border-transparent text-white/50 hover:text-white/70"
                  )}
                  data-testid={`button-orders-${tab}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {ordersLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4">
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </>
            ) : filteredOrders.length === 0 ? (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1 font-light tracking-wide">No {orderFilter !== "all" ? orderFilter : ""} orders yet</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Your buy and sell orders will appear here</p>
              </div>
            ) : (
              paginatedOrders
                .filter(order => {
                  if (ordersSubTab === "all") return true;
                  if (ordersSubTab === "stocks") return order.assetType === "Stock";
                  if (ordersSubTab === "crypto") return order.assetType === "Crypto";
                  if (ordersSubTab === "gold") return order.symbol.includes("GOLD");
                  if (ordersSubTab === "silver") return order.symbol.includes("SILVER");
                  if (ordersSubTab === "diamond") return order.symbol.includes("DIAMOND");
                  return true;
                })
                .map((order) => {
                  const totalAmount = parseFloat(order.totalAmount);
                  const quantity = parseFloat(order.quantity);
                  const price = parseFloat(order.orderPrice);
                  
                  return (
                    <div
                      key={order.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`card-order-${order.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{order.symbol}</h4>
                              <span className={cn(
                                "px-2 py-0.5 bg-white/10 border text-[10px] uppercase tracking-widest",
                                order.orderType === "buy" ? "border-white/20 text-white/70" : "border-white/20 text-white/70"
                              )}>
                                {order.orderType}
                              </span>
                              <span className={cn("px-2 py-0.5 border text-[10px] uppercase tracking-widest", getStatusColor(order.status))}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/50 tracking-wide">{order.instrumentName}</p>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                              {quantity} units @ ₹{price.toFixed(2)} • {new Date(order.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-light text-white tracking-tight mb-1">₹{totalAmount.toFixed(2)}</p>
                            {order.executedPrice && (
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                                Executed @ ₹{parseFloat(order.executedPrice).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>

                        {order.status === "pending" && (
                          <div className="pt-2 border-t border-white/10">
                            <button
                              onClick={(e) => handleCancelOrder(order.id, e)}
                              disabled={cancelOrderMutation.isPending}
                              className="w-full px-3 py-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-light transition-all"
                              data-testid={`button-cancel-${order.id}`}
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}

            {/* Pagination */}
            {filteredOrders.length > 10 && (
              <PaginationControls
                currentPage={ordersPage}
                totalPages={ordersTotalPages}
                onPageChange={goToOrdersPage}
                canGoNext={canGoNextOrders}
                canGoPrevious={canGoPreviousOrders}
                startIndex={ordersStartIndex}
                endIndex={ordersEndIndex}
                totalItems={ordersTotalItems}
              />
            )}
          </div>
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="mt-0 px-4 pb-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Watchlist</h2>
              <p className="text-sm text-white/60">15 assets</p>
            </div>
            <div className="space-y-3">
              {[
                { symbol: "RELIANCE", name: "Reliance Industries Ltd", price: 1377.80, change: 0.76, type: "Stock", dayHigh: 1389.50, dayLow: 1365.30 },
                { symbol: "TCS", name: "Tata Consultancy Services", price: 3061.70, change: 1.14, type: "Stock", dayHigh: 3078.90, dayLow: 3021.45 },
                { symbol: "TATAMOTORS", name: "Tata Motors Ltd", price: 681.10, change: -0.07, type: "Stock", dayHigh: 692.30, dayLow: 678.60 },
                { symbol: "SUZLON", name: "Suzlon Energy Ltd", price: 53.17, change: 0.76, type: "Stock", dayHigh: 54.25, dayLow: 52.45 },
                { symbol: "HAL", name: "Hindustan Aeronautics Ltd", price: 4846.30, change: 1.19, type: "Stock", dayHigh: 4899.50, dayLow: 4789.20 },
                { symbol: "HINDZINC", name: "Hindustan Zinc Ltd", price: 512.25, change: 4.43, type: "Stock", dayHigh: 522.75, dayLow: 490.50 },
                { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd", price: 8812.00, change: 0.23, type: "Stock", dayHigh: 8892.00, dayLow: 8792.00 },
                { symbol: "VEDL", name: "Vedanta Ltd", price: 484.20, change: 2.43, type: "Stock", dayHigh: 495.80, dayLow: 472.70 },
                { symbol: "TATASTEEL", name: "Tata Steel Ltd", price: 176.42, change: 2.61, type: "Stock", dayHigh: 179.90, dayLow: 171.94 },
                { symbol: "GOLD", name: "Digital Gold 24K", price: 12415.00, change: 0.18, type: "Commodity", dayHigh: 12464.00, dayLow: 12393.00 },
                { symbol: "SILVER", name: "Digital Silver", price: 167.00, change: 0.36, type: "Commodity", dayHigh: 171.00, dayLow: 161.00 },
                { symbol: "DIAMOND", name: "Diamond 1 Carat", price: 65000.00, change: 0.00, type: "Commodity", dayHigh: 65500.00, dayLow: 64500.00 },
                { symbol: "BTC", name: "Bitcoin", price: 10799307.00, change: -1.14, type: "Crypto", dayHigh: 11070472.00, dayLow: 10700726.00 },
                { symbol: "ETH", name: "Ethereum", price: 396958.00, change: -1.50, type: "Crypto", dayHigh: 406037.00, dayLow: 389000.00 },
                { symbol: "POLYCAB", name: "Polycab India Ltd", price: 7631.00, change: 0.57, type: "Stock", dayHigh: 7698.00, dayLow: 7588.00 },
              ].map((asset) => {
                const changePercent = asset.change;
                return (
                  <Card 
                    key={asset.symbol} 
                    className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setDetailSheetOpen(true);
                    }}
                    data-testid={`card-watchlist-${asset.symbol}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-white">{asset.symbol}</p>
                            <Badge className="bg-white/10 text-white border-0 text-xs">
                              {asset.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60">{asset.name}</p>
                          <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                            <span>H: ₹{asset.dayHigh.toFixed(2)}</span>
                            <span>L: ₹{asset.dayLow.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white mb-1">₹{asset.price.toFixed(2)}</p>
                          <div className={cn(
                            "flex items-center gap-1 justify-end text-sm",
                            changePercent >= 0 ? "text-white/80" : "text-white/80"
                          )}>
                            {changePercent >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            <span>{changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                            setBuyDialogOpen(true);
                          }}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 h-8"
                          data-testid={`button-buy-watchlist-${asset.symbol}`}
                        >
                          Buy Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Removed from Watchlist",
                              description: `${asset.symbol} removed from your watchlist`,
                            });
                          }}
                          className="flex-1 border-white/20 text-white/80 hover:bg-white/10 h-8"
                          data-testid={`button-remove-watchlist-${asset.symbol}`}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* SIP Tab */}
        <TabsContent value="sip" className="mt-0 px-4 pb-6 space-y-6">
          {/* Active SIPs Summary */}
          <Card className="bg-gradient-to-r from-white/10 to-white/10 border border-white/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Active SIPs</p>
                  <p className="text-3xl font-bold text-white">8</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70 mb-1">Monthly Investment</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(45000)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-1">Total Invested</p>
                  <p className="text-lg font-semibold text-white/80">{formatCurrency(540000)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70 mb-1">Current Value</p>
                  <p className="text-lg font-semibold text-white/80">{formatCurrency(612000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active SIPs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Active SIPs</h2>
              <Button 
                onClick={() => navigate("/sip-new")}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm h-8"
                data-testid="button-start-new-sip"
              >
                <Plus className="h-3 w-3 mr-1" />
                Start New SIP
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { id: "1", name: "HDFC Mid-Cap Opportunities Fund", amount: 5000, returns: 19.44, invested: 60000, current: 71664, nextDate: "15 Dec 2024", fundHouse: "HDFC MF", risk: "High" },
                { id: "2", name: "SBI Bluechip Fund", amount: 10000, returns: 18.75, invested: 120000, current: 142500, nextDate: "10 Dec 2024", fundHouse: "SBI MF", risk: "Moderate" },
                { id: "3", name: "ICICI Prudential Technology Fund", amount: 3000, returns: 25.93, invested: 36000, current: 45335, nextDate: "20 Dec 2024", fundHouse: "ICICI Prudential", risk: "High" },
                { id: "4", name: "Axis Bluechip Fund", amount: 7500, returns: 16.89, invested: 90000, current: 105201, nextDate: "5 Dec 2024", fundHouse: "Axis MF", risk: "Moderate" },
                { id: "5", name: "Kotak Emerging Equity Fund", amount: 5000, returns: 22.34, invested: 60000, current: 73404, nextDate: "25 Dec 2024", fundHouse: "Kotak MF", risk: "High" },
                { id: "6", name: "Mirae Asset Large Cap Fund", amount: 8000, returns: 17.56, invested: 96000, current: 112858, nextDate: "12 Dec 2024", fundHouse: "Mirae Asset", risk: "Low" },
                { id: "7", name: "Parag Parikh Flexi Cap Fund", amount: 4000, returns: 20.12, invested: 48000, current: 57658, nextDate: "18 Dec 2024", fundHouse: "PPFAS MF", risk: "Moderate" },
                { id: "8", name: "UTI Nifty Index Fund", amount: 2500, returns: 14.23, invested: 30000, current: 34269, nextDate: "8 Dec 2024", fundHouse: "UTI MF", risk: "Low" },
              ].map((sip) => {
                const gainLoss = sip.current - sip.invested;
                return (
                  <Card 
                    key={sip.id} 
                    className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate(`/sip/${sip.id}`)}
                    data-testid={`card-sip-${sip.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-white text-sm">{sip.name}</p>
                          </div>
                          <p className="text-xs text-white/60 mb-1">{sip.fundHouse}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "text-xs border-0",
                              sip.risk === "High" ? "bg-white/10 text-white/80" : 
                              sip.risk === "Moderate" ? "bg-white/10 text-white" : 
                              "bg-white/10 text-white/80"
                            )}>
                              {sip.risk} Risk
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">₹{sip.amount.toLocaleString()}/mo</p>
                          <div className="flex items-center gap-1 text-sm text-white/80 justify-end">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{sip.returns.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs border-t border-white/10 pt-3 mb-3">
                        <div>
                          <p className="text-white/60 mb-1">Invested</p>
                          <p className="text-white font-medium">{formatCurrency(sip.invested)}</p>
                        </div>
                        <div>
                          <p className="text-white/60 mb-1">Current</p>
                          <p className="text-white/80 font-medium">{formatCurrency(sip.current)}</p>
                        </div>
                        <div>
                          <p className="text-white/60 mb-1">Gain</p>
                          <p className="text-white/80 font-medium">+{formatCurrency(gainLoss)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Next: {sip.nextDate}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/sip/${sip.id}`);
                          }}
                          className="flex-1 border-white/20 text-white hover:bg-white/10 h-7 text-xs"
                          data-testid={`button-view-sip-${sip.id}`}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "SIP Paused",
                              description: `SIP for ${sip.name} has been paused`,
                            });
                          }}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 h-7 text-xs"
                          data-testid={`button-pause-sip-${sip.id}`}
                        >
                          Pause
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* AI-Invest Tab */}
        <TabsContent value="ai-invest" className="mt-0 px-4 pb-6 space-y-6">
          {/* AI Banner */}
          <Card className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-2">AI-Powered Investment Insights</h3>
                  <p className="text-sm text-white/70 mb-4">Get personalized recommendations based on your risk profile and goals</p>
                  <Button 
                    className="bg-violet-500 hover:bg-violet-600 text-white"
                    data-testid="button-get-ai-recommendations"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Get Recommendations
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Smart Features</h2>
            <div className="space-y-3">
              {[
                { title: "Portfolio Analysis", desc: "AI-driven insights on your holdings", icon: BarChart3 },
                { title: "Risk Assessment", desc: "Understand your investment risk level", icon: Shield },
                { title: "Market Trends", desc: "Stay ahead with AI market predictions", icon: TrendingUp },
              ].map((feature) => (
                <Card key={feature.title} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{feature.title}</p>
                        <p className="text-sm text-white/60">{feature.desc}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="mt-0 px-4 pb-6 space-y-6">
          {/* Rewards Balance */}
          <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Reward Points</p>
                    <p className="text-2xl font-bold text-white">2,450</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  data-testid="button-redeem-rewards"
                >
                  Redeem
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Zap className="h-4 w-4" />
                <span>Earn 10 points on every ₹100 invested</span>
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Available Rewards</h2>
            <div className="space-y-3">
              {[
                { title: "₹100 Cashback", points: 1000, desc: "Use for any investment" },
                { title: "₹250 Cashback", points: 2500, desc: "Use for any investment" },
                { title: "Zero Brokerage", points: 5000, desc: "1 month free trading" },
              ].map((reward) => (
                <Card key={reward.title} className="bg-white/5 border border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{reward.title}</p>
                          <p className="text-sm text-white/60">{reward.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-amber-400">{reward.points} pts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Investment Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent side="bottom" className="bg-black border-t border-white/10 text-white h-[90vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-white text-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{selectedAsset?.symbol || "Asset"}</p>
                  <p className="text-sm text-white/60 font-normal">{selectedAsset?.name || selectedAsset?.instrumentName}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDetailSheetOpen(false)}
                className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 pt-4">
            {/* Live Price & Change */}
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-white/60 mb-1">Current Price</p>
                    <p className="text-4xl font-bold text-white">
                      ₹{(selectedAsset?.currentPrice || selectedAsset?.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      "text-sm px-3 py-1",
                      (selectedAsset?.change || selectedAsset?.gainLossPercentage || 0) >= 0 
                        ? "bg-white/10 text-white/80 border-white/20" 
                        : "bg-white/10 text-white/80 border-white/20"
                    )}>
                      {(selectedAsset?.change || selectedAsset?.gainLossPercentage || 0) >= 0 ? "+" : ""}
                      {(selectedAsset?.change || selectedAsset?.gainLossPercentage || 0).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">Day High</p>
                    <p className="text-white font-medium">₹{(selectedAsset?.dayHigh || selectedAsset?.currentPrice || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Day Low</p>
                    <p className="text-white font-medium">₹{(selectedAsset?.dayLow || selectedAsset?.currentPrice || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Type</p>
                    <Badge className="bg-white/10 text-white border-0 text-xs">
                      {selectedAsset?.type || selectedAsset?.investmentType || "Stock"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base">Price Chart</CardTitle>
                  <div className="flex gap-2">
                    {["7d", "30d", "1y"].map((period) => (
                      <Button
                        key={period}
                        variant={chartPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChartPeriod(period as "7d" | "30d" | "1y")}
                        className={cn(
                          "text-xs h-7",
                          chartPeriod === period 
                            ? "bg-white text-black" 
                            : "border-white/20 text-white/80 hover:bg-white/10"
                        )}
                      >
                        {period === "7d" ? "7D" : period === "30d" ? "1M" : "1Y"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={generatePriceData(chartPeriod, selectedAsset?.currentPrice || selectedAsset?.price || 1000)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff60" 
                      tick={{ fill: '#ffffff60', fontSize: 10 }}
                    />
                    <YAxis 
                      stroke="#ffffff60" 
                      tick={{ fill: '#ffffff60', fontSize: 10 }}
                      tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={(selectedAsset?.change || 0) >= 0 ? "#4ade80" : "#f87171"} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Holdings Info (if owned) */}
            {selectedAsset?.quantity && (
              <Card className="bg-white/5 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base">Your Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Quantity</p>
                      <p className="text-white font-semibold text-lg">{selectedAsset.quantity} units</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Avg. Price</p>
                      <p className="text-white font-semibold text-lg">₹{parseFloat(selectedAsset.avgPrice || "0").toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Invested</p>
                      <p className="text-white font-semibold text-lg">{formatCurrency(parseFloat(selectedAsset.totalInvested || "0"))}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Current Value</p>
                      <p className="text-white/80 font-semibold text-lg">{formatCurrency(parseFloat(selectedAsset.currentValue || "0"))}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-xs mb-1">Total Gain/Loss</p>
                          <p className={cn(
                            "font-bold text-2xl",
                            parseFloat(selectedAsset.gainLoss || "0") >= 0 ? "text-white/80" : "text-white/80"
                          )}>
                            {parseFloat(selectedAsset.gainLoss || "0") >= 0 ? "+" : ""}
                            {formatCurrency(Math.abs(parseFloat(selectedAsset.gainLoss || "0")))}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-3xl font-bold",
                            parseFloat(selectedAsset.gainLossPercentage || "0") >= 0 ? "text-white/80" : "text-white/80"
                          )}>
                            {parseFloat(selectedAsset.gainLossPercentage || "0") >= 0 ? "+" : ""}
                            {parseFloat(selectedAsset.gainLossPercentage || "0").toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                    <span className="text-white/60 text-sm">52 Week High</span>
                    <span className="text-white font-medium">₹{((selectedAsset?.currentPrice || selectedAsset?.price || 0) * 1.15).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                    <span className="text-white/60 text-sm">52 Week Low</span>
                    <span className="text-white font-medium">₹{((selectedAsset?.currentPrice || selectedAsset?.price || 0) * 0.75).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                    <span className="text-white/60 text-sm">Volume</span>
                    <span className="text-white font-medium">{(Math.random() * 100000000).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                    <span className="text-white/60 text-sm">Market Cap</span>
                    <span className="text-white font-medium">₹{((selectedAsset?.currentPrice || selectedAsset?.price || 0) * 1000000).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Actions */}
          <div className="sticky bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 mt-6 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setDetailSheetOpen(false);
                  const currentParams = new URLSearchParams(searchString);
                  const returnTab = currentParams.get('tab') || selectedTab;
                  const returnSubTab = currentParams.get('subtab') || 'all';
                  setTimeout(() => navigate(`/stocks/${selectedAsset?.symbol}?returnTo=/investment&returnTab=${returnTab}&returnSubTab=${returnSubTab}`), 200);
                }}
                className="bg-white text-black hover:bg-white/90 h-12 text-base font-semibold"
                data-testid="button-view-details"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
              <Button
                onClick={() => {
                  setDetailSheetOpen(false);
                  setTimeout(() => {
                    setSelectedAsset(selectedAsset);
                    setSellDialogOpen(true);
                  }, 200);
                }}
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 h-12 text-base font-semibold"
                data-testid="button-sell-from-detail"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Sell
              </Button>
            </div>
            <Button
              onClick={() => {
                setDetailSheetOpen(false);
                setTimeout(() => {
                  setSelectedAsset(selectedAsset);
                  setBuyDialogOpen(true);
                }, 200);
              }}
              className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20 h-12 text-base font-semibold"
              data-testid="button-buy-more-from-detail"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buy {selectedAsset?.quantity ? "More" : "Now"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Buy {selectedAsset?.symbol || "Asset"}
              <Button variant="ghost" size="sm" onClick={() => setBuyDialogOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/80">Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                className="bg-white/5 border-white/20 text-white"
                data-testid="input-buy-quantity"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Price per unit</Label>
              <Input
                type="number"
                placeholder="₹0.00"
                defaultValue={selectedAsset?.currentPrice || "0"}
                className="bg-white/5 border-white/20 text-white"
                data-testid="input-buy-price"
              />
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Total Amount</span>
                <span className="text-white font-semibold">₹0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Platform Fee</span>
                <span className="text-white/60">₹10.00</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Payment Method</Label>
              <Select defaultValue="upi">
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="upi">UPI Payment</SelectItem>
                  <SelectItem value="wallet">Wallet Balance</SelectItem>
                  <SelectItem value="card">Debit/Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                toast({
                  title: "Order Placed",
                  description: "Your buy order has been placed successfully",
                });
                setBuyDialogOpen(false);
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
              data-testid="button-confirm-buy"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Sell {selectedAsset?.symbol || "Asset"}
              <Button variant="ghost" size="sm" onClick={() => setSellDialogOpen(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/80">Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                className="bg-white/5 border-white/20 text-white"
                data-testid="input-sell-quantity"
              />
              <p className="text-xs text-white/60">Available: {selectedAsset?.quantity || "0"} units</p>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Price per unit</Label>
              <Input
                type="number"
                placeholder="₹0.00"
                defaultValue={selectedAsset?.currentPrice || "0"}
                className="bg-white/5 border-white/20 text-white"
                data-testid="input-sell-price"
              />
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Total Amount</span>
                <span className="text-white font-semibold">₹0.00</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Platform Fee</span>
                <span className="text-white/80">-₹10.00</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-white/80">You'll Receive</span>
                <span className="text-white font-semibold">₹0.00</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Credit To</Label>
              <Select defaultValue="wallet">
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="wallet">Wallet Balance</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                toast({
                  title: "Order Placed",
                  description: "Your sell order has been placed successfully",
                });
                setSellDialogOpen(false);
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
              data-testid="button-confirm-sell"
            >
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
