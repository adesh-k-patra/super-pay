import { useState, useEffect, useRef, useMemo } from "react";
import type { MarketData, InvestmentOrder, InvestmentWatchlist, InvestmentPortfolio, InvestmentVendor } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { InvestmentTradeDialog } from "@/components/ui/investment-trade-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { getAllMutualFunds } from "@/data/mutual-funds";
import { getAllSIPPlans } from "@/data/sip-plans";
import { useLiveMarketData } from "@/hooks/use-live-market-data";
import { getMarketChangeColor, getHoldingChangeColor, formatPercentChange } from "@/lib/market-utils";
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
  Gem,
  PiggyBank,
  Wallet,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Store,
  Award,
  ArrowRightLeft,
  Info
} from "lucide-react";


export default function InvestmentNew() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useState("explore");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [chartPeriod, setChartPeriod] = useState<"1D" | "1W" | "1M" | "1Y">("1D");
  const [holdingsSubTab, setHoldingsSubTab] = useState<string>("all");
  const [ordersSubTab, setOrdersSubTab] = useState<string>("all");
  const [watchlistSubTab, setWatchlistSubTab] = useState<string>("all");
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{
    symbol: string;
    instrumentName: string;
    assetType: string;
    currentPrice: number;
    vendorName?: string;
    vendorId?: string;
    unit?: string;
    purity?: string;
    dayChangePercent?: number;
    holdings?: {
      quantity: number;
      avgPrice: number;
    };
    existingOrder?: {
      id: string;
      quantity: string;
      orderPrice: string;
      totalAmount: string;
    };
  } | null>(null);
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");
  const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<any | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<any | null>(null);
  const { toast } = useToast();

  // Fetch market data
  const { data: marketDataList, isLoading: marketLoading } = useQuery<MarketData[]>({
    queryKey: ["/api/market/trending"],
    enabled: isAuthenticated,
  });

  // Fetch user watchlist
  const { data: watchlistData, isLoading: watchlistLoading } = useQuery<{ items: InvestmentWatchlist[] }>({
    queryKey: ["/api/watchlist"],
    enabled: isAuthenticated,
  });

  // Fetch user portfolio
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery<{ portfolio: InvestmentPortfolio[] }>({
    queryKey: ["/api/investments/portfolio"],
    enabled: isAuthenticated,
  });

  // Fetch user orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery<{ orders: InvestmentOrder[] }>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading } = useQuery<{ vendors: InvestmentVendor[] }>({
    queryKey: ["/api/vendors"],
    enabled: isAuthenticated,
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: async (response: any) => {
      try {
        console.log("Order API response:", response);
        
        if (!response || !response.order) {
          throw new Error("Invalid response from server");
        }
        
        const order = response.order;
        
        // Create transaction confirmation
        const confirmationData = {
          orderId: order.id,
          transactionType: order.orderType,
          assetType: order.assetType,
          assetName: order.instrumentName,
          symbol: order.symbol,
          vendorName: order.vendorName,
          quantity: order.quantity.toString(),
          unit: order.unit || "shares",
          purchasePrice: order.orderPrice.toString(),
          sellPrice: order.orderType === "sell" ? order.orderPrice.toString() : null,
          totalAmount: order.totalAmount.toString(),
          fees: order.fees?.toString() || "0",
          gst: order.gst?.toString() || "0",
          executedAt: new Date(),
          paymentMethod: order.fromAccount || "wallet",
          deliveryType: "digital",
          isProfitable: 0,
        };
        
        const confirmationResponse = await apiRequest("POST", "/api/transaction-confirmation", confirmationData);
        
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        queryClient.invalidateQueries({ queryKey: ["/api/investments/portfolio"] });
        queryClient.invalidateQueries({ queryKey: ["/api/funds/summary"] });
        
        // Show success dialog
        setSuccessOrderDetails({
          ...order,
          confirmationId: (confirmationResponse as any).confirmation.id
        });
        setSuccessDialogOpen(true);
      } catch (error: any) {
        console.error("Error in order success handler:", error);
        toast({
          title: "Order Failed",
          description: error.message || "Failed to process order. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
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
        description: "Asset added to your watchlist",
      });
    },
  });

  // Remove from watchlist mutation
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/watchlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from Watchlist",
        description: "Asset removed from your watchlist",
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
      setCancelOrderDialogOpen(false);
      setOrderToCancel(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, orderData }: { orderId: string; orderData: any }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}`, orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments/portfolio"] });
      toast({
        title: "Order Updated",
        description: "Your order has been successfully modified",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Import comprehensive stock data
  const initialStocksData = useMemo(() => {
    // Use first 20 stocks from ALL_STOCKS for display (mix from different domains)
    const stocksData = [
      { symbol: "RELIANCE", name: "Reliance Industries", price: 1385.20, change: -0.51, marketCap: "18.5L Cr", volume: "2.5M" },
      { symbol: "TCS", name: "Tata Consultancy Services", price: 3061.70, change: 1.14, marketCap: "10.95L Cr", volume: "1.8M" },
      { symbol: "HDFCBANK", name: "HDFC Bank", price: 977.10, change: -0.16, marketCap: "15.01L Cr", volume: "3.2M" },
      { symbol: "INFY", name: "Infosys Ltd", price: 1510.50, change: 1.04, marketCap: "6.8L Cr", volume: "2.1M" },
      { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2517.20, change: -0.42, marketCap: "5.87L Cr", volume: "1.2M" },
      { symbol: "ICICIBANK", name: "ICICI Bank", price: 1374.00, change: 0.68, marketCap: "9.79L Cr", volume: "4.5M" },
      { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 1023.15, change: 1.23, marketCap: "4.5L Cr", volume: "0.8M" },
      { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1892.00, change: 0.52, marketCap: "7.1L Cr", volume: "3.8M" },
      { symbol: "SBIN", name: "State Bank of India", price: 858.50, change: -0.72, marketCap: "7.92L Cr", volume: "5.2M" },
      { symbol: "ITC", name: "ITC Limited", price: 399.75, change: 0.05, marketCap: "5.01L Cr", volume: "6.7M" },
      { symbol: "WIPRO", name: "Wipro Ltd", price: 244.20, change: 0.25, marketCap: "2.3L Cr", volume: "4.2M" },
      { symbol: "MARUTI", name: "Maruti Suzuki", price: 16078.00, change: 1.52, marketCap: "3.1L Cr", volume: "0.5M" },
      { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", price: 1567.80, change: 0.92, marketCap: "3.8L Cr", volume: "2.8M" },
      { symbol: "NTPC", name: "NTPC Ltd", price: 267.80, change: 0.89, marketCap: "2.6L Cr", volume: "12.5M" },
      { symbol: "TITAN", name: "Titan Company", price: 3456.70, change: 1.67, marketCap: "3.1L Cr", volume: "1.5M" },
      { symbol: "TATAMOTORS", name: "Tata Motors", price: 678.90, change: -1.23, marketCap: "2.4L Cr", volume: "12.5M" },
      { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1789.45, change: 0.76, marketCap: "3.5L Cr", volume: "2.8M" },
      { symbol: "HCLTECH", name: "HCL Technologies", price: 1234.60, change: 0.89, marketCap: "3.4L Cr", volume: "2.8M" },
      { symbol: "ULTRACEMCO", name: "UltraTech Cement", price: 9876.50, change: 0.89, marketCap: "2.9L Cr", volume: "0.4M" },
      { symbol: "ADANIGREEN", name: "Adani Green Energy", price: 1789.60, change: -2.15, marketCap: "2.9L Cr", volume: "3.8M" },
    ];
    return stocksData;
  }, []);

  const initialGoldData = useMemo(() => [
    { name: "Gold 24K", symbol: "GOLD24K", price: 12415, change: 0.45, purity: "24K", vendors: 8 },
    { name: "Gold 22K", symbol: "GOLD22K", price: 11380, change: 0.38, purity: "22K", vendors: 12 },
    { name: "Gold 18K", symbol: "GOLD18K", price: 9311, change: 0.52, purity: "18K", vendors: 6 },
  ], []);

  const initialSilverData = useMemo(() => [
    { name: "Silver 999", symbol: "SILVER999", price: 167.00, change: -0.32, purity: "999", vendors: 10 },
    { name: "Silver 925", symbol: "SILVER925", price: 153.50, change: -0.28, purity: "925", vendors: 8 },
  ], []);

  const initialDiamondData = useMemo(() => [
    { name: "Diamond 1ct D-VVS1", symbol: "DIA1CTVVS1", price: 850000, change: 0.15, clarity: "VVS1", vendors: 5 },
    { name: "Diamond 0.5ct E-VS1", symbol: "DIA05VS1", price: 550000, change: -0.08, clarity: "VS1", vendors: 7 },
    { name: "Diamond 1ct F-VS2", symbol: "DIA1VS2", price: 625000, change: 0.22, clarity: "VS2", vendors: 6 },
  ], []);

  const initialCryptoData = useMemo(() => [
    { symbol: "BTC", name: "Bitcoin", price: 10742050.00, change: 2.45, marketCap: "83L Cr", volume: "28.5B" },
    { symbol: "ETH", name: "Ethereum", price: 385612.00, change: -3.06, marketCap: "29.5L Cr", volume: "15.2B" },
    { symbol: "BNB", name: "Binance Coin", price: 114000.00, change: 2.03, marketCap: "6.5L Cr", volume: "2.8B" },
    { symbol: "SOL", name: "Solana", price: 19700.00, change: 0.37, marketCap: "6.8L Cr", volume: "3.2B" },
    { symbol: "XRP", name: "Ripple", price: 241.23, change: -2.27, marketCap: "4.9L Cr", volume: "4.5B" },
    { symbol: "ADA", name: "Cardano", price: 75.00, change: 1.20, marketCap: "2.3L Cr", volume: "1.8B" },
    { symbol: "DOGE", name: "Dogecoin", price: 22.50, change: 1.50, marketCap: "1.8L Cr", volume: "2.1B" },
    { symbol: "MATIC", name: "Polygon", price: 22.00, change: 1.80, marketCap: "0.8L Cr", volume: "1.2B" },
  ], []);

  const initialIndicesData = useMemo(() => [
    { symbol: "NIFTY50", name: "NIFTY 50", price: 25181.80, change: 0.54 },
    { symbol: "SENSEX", name: "SENSEX", price: 82172.10, change: 0.49 },
  ], []);

  // Apply live price updates using the new hook
  const liveStocksData = useLiveMarketData(initialStocksData.map(item => ({ ...item, symbol: item.symbol, changePercent: item.change })), selectedTab === "explore");
  const liveGoldData = useLiveMarketData(initialGoldData.map(item => ({ ...item, changePercent: item.change })), selectedTab === "explore");
  const liveSilverData = useLiveMarketData(initialSilverData.map(item => ({ ...item, changePercent: item.change })), selectedTab === "explore");
  const liveDiamondData = useLiveMarketData(initialDiamondData.map(item => ({ ...item, changePercent: item.change })), selectedTab === "explore");
  const liveCryptoData = useLiveMarketData(initialCryptoData.map(item => ({ ...item, changePercent: item.change })), selectedTab === "explore");
  const liveIndicesData = useLiveMarketData(initialIndicesData.map(item => ({ ...item, changePercent: item.change })), selectedTab === "explore");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Auto-refresh portfolio data every 1 second
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/market/trending"] });
      setLastUpdated(new Date());
    }, 1000); // 1 second

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries();
    setLastUpdated(new Date());
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Latest market data loaded",
      });
    }, 1000);
  };

  const handleBuyAsset = (asset: any) => {
    setSelectedAsset(asset);
    setTradeMode("buy");
    setTradeDialogOpen(true);
  };

  const handleSellAsset = (asset: any, holdings?: any) => {
    setSelectedAsset({ ...asset, holdings });
    setTradeMode("sell");
    setTradeDialogOpen(true);
  };

  const handleTradeConfirm = (orderData: any) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we're modifying an existing order
    const existingOrderId = selectedAsset?.existingOrder?.id;
    
    if (existingOrderId) {
      // Update existing order
      updateOrderMutation.mutate({
        orderId: existingOrderId,
        orderData: {
          ...orderData,
          userId: user.id,
        },
      });
    } else {
      // Create new order
      placeOrderMutation.mutate({
        ...orderData,
        userId: user.id,
      });
    }
  };

  // Dummy data for holdings
  const dummyHoldings = [
    {
      id: "1",
      symbol: "RELIANCE",
      instrumentName: "Reliance Industries",
      investmentType: "Stock",
      quantity: "50",
      avgPrice: "2450.00",
      currentPrice: "2650.00",
      currentValue: "132500.00",
      totalInvested: "122500.00",
      gainLossPercentage: "8.16",
      totalProfit: "10000.00"
    },
    {
      id: "2",
      symbol: "BTC",
      instrumentName: "Bitcoin",
      investmentType: "Crypto",
      quantity: "0.5",
      avgPrice: "4100000.00",
      currentPrice: "4235678.00",
      currentValue: "2117839.00",
      totalInvested: "2050000.00",
      gainLossPercentage: "3.31",
      totalProfit: "67839.00"
    },
    {
      id: "3",
      symbol: "GOLD24K",
      instrumentName: "24K Gold",
      investmentType: "Gold",
      quantity: "100",
      avgPrice: "6700.00",
      currentPrice: "6850.00",
      currentValue: "685000.00",
      totalInvested: "670000.00",
      gainLossPercentage: "2.24",
      totalProfit: "15000.00"
    }
  ];

  // Dummy data for orders
  const dummyOrders = [
    {
      id: "1",
      symbol: "TCS",
      instrumentName: "Tata Consultancy Services",
      investmentType: "Stock",
      orderType: "buy",
      status: "executed",
      quantity: "25",
      orderPrice: "3450.00",
      currentPrice: "3580.00",
      totalAmount: "86250.00",
      unit: "shares",
      createdAt: new Date().toISOString(),
      vendorName: "NSE"
    },
    {
      id: "2",
      symbol: "ETH",
      instrumentName: "Ethereum",
      investmentType: "Crypto",
      orderType: "buy",
      status: "pending",
      quantity: "2",
      orderPrice: "245890.00",
      currentPrice: "245890.25",
      totalAmount: "491780.00",
      unit: "units",
      createdAt: new Date().toISOString(),
      vendorName: "CoinDCX"
    },
    {
      id: "3",
      symbol: "SILVER",
      instrumentName: "Silver 999",
      investmentType: "Silver",
      orderType: "sell",
      status: "executed",
      quantity: "500",
      orderPrice: "78.50",
      buyPrice: "75.00",
      totalAmount: "39250.00",
      totalProfit: "1750.00",
      profitPercentage: "4.67",
      unit: "grams",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      soldAt: new Date(Date.now() - 3600000).toISOString(),
      vendorName: "SafeGold",
      tax: "350.00",
      fees: "100.00"
    },
    {
      id: "4",
      symbol: "RELIANCE",
      instrumentName: "Reliance Industries",
      investmentType: "Stock",
      orderType: "buy",
      status: "cancelled",
      quantity: "50",
      orderPrice: "2850.00",
      currentPrice: "2900.00",
      totalAmount: "142500.00",
      unit: "shares",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      vendorName: "NSE"
    },
    {
      id: "5",
      symbol: "BTC",
      instrumentName: "Bitcoin",
      investmentType: "Crypto",
      orderType: "buy",
      status: "executed",
      quantity: "0.5",
      orderPrice: "4200000.00",
      currentPrice: "4235678.00",
      totalAmount: "2100000.00",
      unit: "units",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      vendorName: "WazirX"
    },
    {
      id: "6",
      symbol: "GOLD24K",
      instrumentName: "24K Gold",
      investmentType: "Gold",
      orderType: "buy",
      status: "pending",
      quantity: "50",
      orderPrice: "6750.00",
      currentPrice: "6850.00",
      totalAmount: "337500.00",
      unit: "grams",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      vendorName: "SafeGold"
    },
    {
      id: "7",
      symbol: "HDFCBANK",
      instrumentName: "HDFC Bank",
      investmentType: "Stock",
      orderType: "sell",
      status: "cancelled",
      quantity: "30",
      orderPrice: "1680.00",
      buyPrice: "1650.00",
      currentPrice: "1690.00",
      totalAmount: "50400.00",
      unit: "shares",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      vendorName: "NSE"
    },
    {
      id: "8",
      symbol: "INFY",
      instrumentName: "Infosys",
      investmentType: "Stock",
      orderType: "buy",
      status: "executed",
      quantity: "40",
      orderPrice: "1625.00",
      currentPrice: "1650.00",
      totalAmount: "65000.00",
      unit: "shares",
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      vendorName: "NSE"
    },
    {
      id: "9",
      symbol: "SOL",
      instrumentName: "Solana",
      investmentType: "Crypto",
      orderType: "buy",
      status: "pending",
      quantity: "10",
      orderPrice: "12450.00",
      currentPrice: "12456.75",
      totalAmount: "124500.00",
      unit: "units",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      vendorName: "CoinDCX"
    },
    {
      id: "10",
      symbol: "WIPRO",
      instrumentName: "Wipro",
      investmentType: "Stock",
      orderType: "sell",
      status: "executed",
      quantity: "100",
      orderPrice: "485.00",
      buyPrice: "465.00",
      currentPrice: "490.00",
      totalAmount: "48500.00",
      totalProfit: "2000.00",
      profitPercentage: "4.30",
      unit: "shares",
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      soldAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      vendorName: "NSE"
    }
  ];

  // Dummy data for watchlist
  const dummyWatchlist = [
    {
      id: "1",
      symbol: "INFY",
      instrumentName: "Infosys",
      assetType: "stock",
      currentPrice: "1650.00",
      dayChangePercent: "2.35"
    },
    {
      id: "2",
      symbol: "SOL",
      instrumentName: "Solana",
      assetType: "crypto",
      currentPrice: "12456.75",
      dayChangePercent: "-0.89"
    },
    {
      id: "3",
      symbol: "DIAMOND",
      instrumentName: "Digital Diamond",
      assetType: "diamond",
      currentPrice: "350000.00",
      dayChangePercent: "0.75"
    }
  ];

  // Calculate portfolio summary with live prices
  const basePortfolioItems = portfolioData?.portfolio?.length ? portfolioData.portfolio : dummyHoldings;
  
  // Apply live market data to portfolio holdings
  const livePortfolioData = useLiveMarketData(
    basePortfolioItems.map((item: any) => ({
      ...item,
      symbol: item.symbol,
      price: parseFloat(item.currentPrice || "0")
    })),
    true,
    1000,
    5
  );

  // Update portfolio items with live prices and recalculate values
  const portfolioItems = livePortfolioData.map((liveItem: any, index: number) => {
    const baseItem = basePortfolioItems[index];
    const quantity = parseFloat(baseItem.quantity || "0");
    const avgPrice = parseFloat(baseItem.avgPrice || "0");
    const currentPrice = liveItem.price;
    const currentValue = quantity * currentPrice;
    const totalInvested = quantity * avgPrice;
    const totalProfit = currentValue - totalInvested;
    const gainLossPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;

    return {
      ...baseItem,
      currentPrice: currentPrice.toFixed(2),
      currentValue: currentValue.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      gainLossPercentage: gainLossPercentage.toFixed(2),
    };
  });

  const portfolioValue = portfolioItems.reduce((sum: number, item: any) => sum + parseFloat(item.currentValue || "0"), 0);
  const investedValue = portfolioItems.reduce((sum: number, item: any) => sum + parseFloat(item.totalInvested || "0"), 0);
  const totalGainLoss = portfolioValue - investedValue;
  const gainLossPercent = investedValue > 0 ? ((totalGainLoss / investedValue) * 100) : 0;

  // Apply live market data to orders and watchlist
  const baseOrders = ordersData?.orders?.length ? ordersData.orders : dummyOrders;
  const liveOrders = useLiveMarketData(
    baseOrders.map((order: any) => ({
      ...order,
      symbol: order.symbol,
      price: parseFloat(order.currentPrice || order.orderPrice || "0")
    })),
    true,
    1000,
    5
  );

  // Update orders with live prices
  const allOrders = liveOrders.map((order: any, index: number) => ({
    ...baseOrders[index],
    currentPrice: order.price.toFixed(2)
  }));

  const filteredOrders = allOrders.filter((order: any) => {
    if (orderFilter === "all") return true;
    if (orderFilter === "buy") return order.orderType === "buy";
    if (orderFilter === "sell") return order.orderType === "sell";
    if (orderFilter === "pending") return order.status === "pending";
    if (orderFilter === "executed") return order.status === "executed";
    if (orderFilter === "cancelled") return order.status === "cancelled";
    return true;
  });

  // Apply live market data to watchlist
  const baseWatchlist = watchlistData?.items?.length ? watchlistData.items : dummyWatchlist;
  const liveWatchlistData = useLiveMarketData(
    baseWatchlist.map((item: any) => ({
      ...item,
      symbol: item.symbol,
      price: parseFloat(item.currentPrice || "0")
    })),
    true,
    1000,
    5
  );

  // Update watchlist with live prices and changes
  const watchlistItems = liveWatchlistData.map((item: any, index: number) => ({
    ...baseWatchlist[index],
    currentPrice: item.price.toFixed(2),
    dayChangePercent: item.changePercent || 0
  }));

  // Helper function to check if item is in watchlist
  const isInWatchlist = (symbol: string, assetType: string) => {
    return watchlistItems.some(
      (item: any) => item.symbol === symbol && item.assetType === assetType
    );
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

  // Simple hash function to get deterministic pattern from symbol
  const hashSymbol = (symbol: string): number => {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Generate mock price data with dramatic wave/pulse pattern
  const generatePriceData = (basePrice: number = 100, period: string = "1D", symbol: string = "") => {
    const points = period === "1D" ? 24 : period === "1W" ? 14 : period === "1M" ? 60 : 365;
    const data = [];
    
    // Deterministic pattern type based on symbol - prevents flickering
    const waveType = hashSymbol(symbol + period) % 4; // 0: rising wave, 1: falling wave, 2: pulse, 3: zigzag
    const seed = hashSymbol(symbol); // Seed for consistent "random" noise
    
    for (let i = 0; i < points; i++) {
      let price = basePrice;
      const progress = i / (points - 1); // 0 to 1
      
      if (waveType === 0) {
        // Rising wave with peaks and valleys
        const sineWave = Math.sin(progress * Math.PI * 3) * 0.08; // 3 waves
        const upTrend = progress * 0.12; // 12% rise overall
        price = basePrice * (1 + upTrend + sineWave);
      } else if (waveType === 1) {
        // Falling wave with peaks and valleys
        const sineWave = Math.sin(progress * Math.PI * 3) * 0.08;
        const downTrend = progress * -0.12; // 12% fall overall
        price = basePrice * (1 + downTrend + sineWave);
      } else if (waveType === 2) {
        // Pulse pattern - symmetric ups and downs around baseline
        const pulseFreq = Math.floor(progress * 4); // 4 pulses
        const isUp = pulseFreq % 2 === 0;
        const pulseProgress = (progress * 4) % 1;
        const amplitude = (isUp ? 1 : -1) * pulseProgress * 0.12;
        price = basePrice * (1 + amplitude);
      } else {
        // Zigzag pattern - like candlestick movements
        const zigFreq = 6;
        const zigPhase = (progress * zigFreq) % 1;
        const zigDirection = Math.floor(progress * zigFreq) % 2 === 0 ? 1 : -1;
        const amplitude = zigPhase * zigDirection * 0.1;
        price = basePrice * (1 + amplitude);
      }
      
      // Add consistent noise based on seed (not random, to prevent flickering)
      const noisePhase = (seed + i * 13) % 1000 / 1000; // Pseudo-random but stable
      const noise = (noisePhase - 0.5) * basePrice * 0.01; // Reduced noise for smoother lines
      price += noise;
      
      data.push({
        time: i,
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return data;
  };

  const categories = [
    { id: "stocks", label: "Stocks", icon: TrendingUp, color: "from-white/10 to-white/5", iconColor: "text-white", count: 500 },
    { id: "mutual_funds", label: "Mutual Funds", icon: Shield, color: "from-white/10 to-white/5", iconColor: "text-white", count: 150 },
    { id: "fd", label: "FD", icon: Building2, color: "from-white/10 to-white/5", iconColor: "text-white", count: 75 },
    { id: "sip", label: "SIP", icon: Clock, color: "from-white/10 to-white/5", iconColor: "text-white", count: 100 },
    { id: "gold", label: "Gold", icon: Coins, color: "from-white/10 to-white/5", iconColor: "text-white", count: 10 },
    { id: "diamond", label: "Diamond", icon: Gem, color: "from-white/10 to-white/5", iconColor: "text-white", count: 25 },
    { id: "silver", label: "Silver", icon: DollarSign, color: "from-white/10 to-white/5", iconColor: "text-white", count: 8 },
  ];

  // Get mutual funds data
  const mutualFundsList = useMemo(() => getAllMutualFunds().slice(0, 20), []);
  
  // Get SIP plans data
  const sipPlansList = useMemo(() => getAllSIPPlans(), []);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold tracking-wider text-white">INVESTMENTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Explore & Trade
            </p>
          </div>
          
          <div className="flex items-center gap-2 absolute right-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/investment-new/info")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-investment-info"
            >
              <Info className="h-5 w-5" />
            </Button>
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

        {/* Portfolio Summary */}
        <div className="px-4 pb-4">
          <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">Total Portfolio Value</p>
                  {portfolioLoading ? (
                    <Skeleton className="h-8 w-32 bg-white/10" />
                  ) : (
                    <p className="text-2xl font-light text-white">{formatCurrency(portfolioValue)}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-white/80">
                    {totalGainLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-light">
                      {totalGainLoss >= 0 ? "+" : ""}{formatCurrency(Math.abs(totalGainLoss))} ({gainLossPercent >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => navigate("/funds")}
                    className="bg-white text-black hover:bg-white/90 h-9 text-sm rounded-none font-light tracking-wider"
                    data-testid="button-add-funds"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Add Funds
                  </Button>
                  <Button 
                    onClick={() => navigate("/investment-predictions")}
                    className="bg-blue-500/90 text-white hover:bg-blue-500 backdrop-blur-xl border border-blue-400/30 h-9 text-sm rounded-none font-light tracking-wider transition-colors"
                    data-testid="button-ai-invest"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Invest
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search stocks, gold, mutual funds, FD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Main Tabs - Icon Based Design */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="px-0">
        <div className="sticky top-[240px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 mt-[280px]">
          <div className="px-4 py-3">
            <div className="flex items-center justify-around gap-2">
              <button
                onClick={() => setSelectedTab("explore")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all flex-1",
                  selectedTab === "explore" 
                    ? "bg-white/10 border border-white/20" 
                    : "bg-transparent border border-transparent hover:bg-white/5"
                )}
                data-testid="tab-explore"
              >
                <Package className={cn(
                  "h-6 w-6 transition-colors",
                  selectedTab === "explore" ? "text-white" : "text-white/50"
                )} strokeWidth={1.5} />
                <span className={cn(
                  "text-[10px] uppercase tracking-widest font-light transition-colors",
                  selectedTab === "explore" ? "text-white" : "text-white/50"
                )}>
                  Explore
                </span>
              </button>
              
              <button
                onClick={() => setSelectedTab("holdings")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all flex-1",
                  selectedTab === "holdings" 
                    ? "bg-white/10 border border-white/20" 
                    : "bg-transparent border border-transparent hover:bg-white/5"
                )}
                data-testid="tab-holdings"
              >
                <BarChart3 className={cn(
                  "h-6 w-6 transition-colors",
                  selectedTab === "holdings" ? "text-white" : "text-white/50"
                )} strokeWidth={1.5} />
                <span className={cn(
                  "text-[10px] uppercase tracking-widest font-light transition-colors",
                  selectedTab === "holdings" ? "text-white" : "text-white/50"
                )}>
                  Holdings
                </span>
              </button>
              
              <button
                onClick={() => setSelectedTab("orders")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all flex-1",
                  selectedTab === "orders" 
                    ? "bg-white/10 border border-white/20" 
                    : "bg-transparent border border-transparent hover:bg-white/5"
                )}
                data-testid="tab-orders"
              >
                <ShoppingCart className={cn(
                  "h-6 w-6 transition-colors",
                  selectedTab === "orders" ? "text-white" : "text-white/50"
                )} strokeWidth={1.5} />
                <span className={cn(
                  "text-[10px] uppercase tracking-widest font-light transition-colors",
                  selectedTab === "orders" ? "text-white" : "text-white/50"
                )}>
                  Orders
                </span>
              </button>
              
              <button
                onClick={() => setSelectedTab("watchlist")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all flex-1",
                  selectedTab === "watchlist" 
                    ? "bg-white/10 border border-white/20" 
                    : "bg-transparent border border-transparent hover:bg-white/5"
                )}
                data-testid="tab-watchlist"
              >
                <Star className={cn(
                  "h-6 w-6 transition-colors",
                  selectedTab === "watchlist" ? "text-white" : "text-white/50"
                )} strokeWidth={1.5} />
                <span className={cn(
                  "text-[10px] uppercase tracking-widest font-light transition-colors",
                  selectedTab === "watchlist" ? "text-white" : "text-white/50"
                )}>
                  Watchlist
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Explore Tab */}
        <TabsContent value="explore" className="mt-0 px-4 pt-10 pb-6 space-y-6">
          {/* Categories - Horizontal Scroll */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Browse by Category</h2>
              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      toast({
                        title: "Showing All Categories",
                        description: "Browse all investment options",
                      });
                    }}
                    className="text-white/60 hover:text-white hover:bg-white/10 h-7 px-2 rounded-none"
                    data-testid="button-clear-category"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
                <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none">
                  Live Prices
                </Badge>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  onClick={() => {
                    setSelectedCategory(category.id);
                    toast({
                      title: `Showing ${category.label}`,
                      description: `Browse ${category.count}+ ${category.label.toLowerCase()} options`,
                    });
                  }}
                  className={cn(
                    "flex-shrink-0 w-[140px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-none backdrop-blur-xl",
                    selectedCategory === category.id && "border-white/30 bg-white/10"
                  )}
                  data-testid={`card-category-${category.id}`}
                >
                  <CardContent className="p-4">
                    <div className={cn("w-12 h-12 rounded-none flex items-center justify-center bg-gradient-to-r mb-3 border border-white/20 backdrop-blur-sm", category.color)}>
                      <category.icon className={cn("h-6 w-6", category.iconColor)} strokeWidth={1} />
                    </div>
                    <p className="font-light text-white mb-1 text-sm">{category.label}</p>
                    <p className="text-xs text-white/50 font-light">{category.count}+ options</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Indices */}
          {(!selectedCategory || selectedCategory === "stocks") && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Market Indices</h2>
              <div className="grid grid-cols-2 gap-3">
                {liveIndicesData.map((index) => (
                  <Card 
                    key={index.symbol}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-none backdrop-blur-xl"
                    onClick={() => navigate(`/indices/${index.symbol}`)}
                    data-testid={`card-index-${index.symbol.toLowerCase()}`}
                  >
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-widest text-white/60 mb-1 font-light">{index.name}</p>
                      <p className="text-lg font-light text-white">{index.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-light",
                        getMarketChangeColor(index.changePercent)
                      )}>
                        {index.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{index.changePercent >= 0 ? "+" : ""}{index.changePercent.toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stocks List with Live Prices */}
          {(!selectedCategory || selectedCategory === "stocks") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Stocks</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/stocks")}
                data-testid="button-view-all-stocks"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            {marketLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-[280px] flex-shrink-0 bg-white/5" />
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {liveStocksData.slice(0, 12).map((stock) => (
                  <Card 
                    key={stock.symbol} 
                    className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                    onClick={() => navigate(`/stocks/${stock.symbol}`)}
                    data-testid={`card-stock-${stock.symbol}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-light text-white truncate">{stock.symbol}</p>
                            <Badge className="bg-white/10 text-white border-white/20 text-xs flex-shrink-0 rounded-none font-light">NSE</Badge>
                          </div>
                          <p className="text-sm text-white/60 mb-1 truncate font-light">{stock.name}</p>
                          <p className="text-xs text-white/40 truncate font-light">Vol: {stock.volume}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-lg font-light text-white">₹{stock.price.toFixed(2)}</p>
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-light",
                          getMarketChangeColor(stock.changePercent)
                        )}>
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span>{stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%</span>
                        </div>
                      </div>
                      
                      {/* Mini Chart */}
                      <div className="h-12 mb-3 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={generatePriceData(stock.price, "1D", stock.symbol)}>
                            <defs>
                              <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={stock.change >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={stock.change >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke={stock.change >= 0 ? "#22c55e" : "#ef4444"} 
                              fill={`url(#gradient-${stock.symbol})`}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="actionGreen"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyAsset({
                              symbol: stock.symbol,
                              instrumentName: stock.name,
                              assetType: "stock",
                              currentPrice: stock.price,
                              dayChangePercent: stock.changePercent,
                            });
                          }}
                          className="flex-1 h-8"
                          data-testid={`button-buy-${stock.symbol}`}
                        >
                          Buy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            const inWatchlist = isInWatchlist(stock.symbol, "stock");
                            if (inWatchlist) {
                              const watchlistItem = watchlistItems.find(
                                (item: any) => item.symbol === stock.symbol && item.assetType === "stock"
                              );
                              if (watchlistItem) {
                                removeFromWatchlistMutation.mutate(watchlistItem.id);
                              }
                            } else {
                              addToWatchlistMutation.mutate({
                                symbol: stock.symbol,
                                instrumentName: stock.name,
                                assetType: "stock",
                              });
                            }
                          }}
                          className={cn(
                            "bg-white/5 border-white/20 hover:bg-white/10 rounded-none",
                            isInWatchlist(stock.symbol, "stock") ? "text-white" : "text-white/60"
                          )}
                          data-testid={`button-watchlist-${stock.symbol}`}
                        >
                          <Star className={cn(
                            "h-4 w-4",
                            isInWatchlist(stock.symbol, "stock") && "fill-white"
                          )} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Crypto List with Live Prices */}
          {(!selectedCategory || selectedCategory === "crypto") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Coins className="h-4 w-4 text-white/60" strokeWidth={1} />
                Cryptocurrency
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/crypto")}
                data-testid="button-view-all-crypto"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {liveCryptoData.map((crypto) => (
                <Card 
                  key={crypto.symbol} 
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/crypto/${crypto.symbol}`)}
                  data-testid={`card-crypto-${crypto.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-light text-white truncate">{crypto.symbol}</p>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs flex-shrink-0 rounded-none font-light">CRYPTO</Badge>
                        </div>
                        <p className="text-sm text-white/60 mb-1 truncate font-light">{crypto.name}</p>
                        <p className="text-xs text-white/40 truncate font-light">Vol: {crypto.volume}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-light text-white">₹{crypto.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-light",
                        getMarketChangeColor(crypto.changePercent)
                      )}>
                        {crypto.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%</span>
                      </div>
                    </div>
                    
                    {/* Mini Chart */}
                    <div className="h-12 mb-3 -mx-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={generatePriceData(crypto.price, "1D", crypto.symbol)}>
                          <defs>
                            <linearGradient id={`gradient-${crypto.symbol}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={crypto.change >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={crypto.change >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={crypto.change >= 0 ? "#22c55e" : "#ef4444"} 
                            fill={`url(#gradient-${crypto.symbol})`}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="actionGreen"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyAsset({
                            symbol: crypto.symbol,
                            instrumentName: crypto.name,
                            assetType: "crypto",
                            currentPrice: crypto.price,
                            dayChangePercent: crypto.change,
                          });
                        }}
                        className="flex-1 h-8"
                        data-testid={`button-buy-${crypto.symbol}`}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          const inWatchlist = isInWatchlist(crypto.symbol, "crypto");
                          if (inWatchlist) {
                            const watchlistItem = watchlistItems.find(
                              (item: any) => item.symbol === crypto.symbol && item.assetType === "crypto"
                            );
                            if (watchlistItem) {
                              removeFromWatchlistMutation.mutate(watchlistItem.id);
                            }
                          } else {
                            addToWatchlistMutation.mutate({
                              symbol: crypto.symbol,
                              instrumentName: crypto.name,
                              assetType: "crypto",
                            });
                          }
                        }}
                        className={cn(
                          "bg-white/5 border-white/20 hover:bg-white/10 rounded-none",
                          isInWatchlist(crypto.symbol, "crypto") ? "text-white" : "text-white/60"
                        )}
                        data-testid={`button-watchlist-${crypto.symbol}`}
                      >
                        <Star className={cn(
                          "h-4 w-4",
                          isInWatchlist(crypto.symbol, "crypto") && "fill-white"
                        )} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* Gold - Multiple Vendors */}
          {(!selectedCategory || selectedCategory === "gold") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Coins className="h-4 w-4 text-white/60" strokeWidth={1} />
                Gold
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/gold/providers")}
                data-testid="button-view-all-gold"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {liveGoldData.map((gold) => (
                <Card 
                  key={gold.symbol}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment/${gold.symbol}`)}
                  data-testid={`card-gold-${gold.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-light text-white">{gold.name}</p>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs rounded-none font-light">{gold.purity}</Badge>
                      </div>
                      <p className="text-xs text-white/60 font-light">{gold.vendors} vendors</p>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-light text-white">₹{gold.price.toLocaleString()}/g</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-light",
                        getMarketChangeColor(gold.changePercent)
                      )}>
                        {gold.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{gold.change >= 0 ? "+" : ""}{gold.change.toFixed(2)}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="actionGreen"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/${gold.symbol}`);
                      }}
                      className="w-full h-8"
                      data-testid={`button-compare-${gold.symbol}`}
                    >
                      Compare & Buy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* Silver - Multiple Vendors */}
          {(!selectedCategory || selectedCategory === "silver") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-white/60" strokeWidth={1} />
                Silver
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/silver/providers")}
                data-testid="button-view-all-silver"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {liveSilverData.map((silver) => (
                <Card 
                  key={silver.symbol}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment/${silver.symbol}`)}
                  data-testid={`card-silver-${silver.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-light text-white">{silver.name}</p>
                        <Badge className="bg-white/10 text-white border-white/20 text-xs rounded-none font-light">{silver.purity}</Badge>
                      </div>
                      <p className="text-xs text-white/60 font-light">{silver.vendors} vendors</p>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-light text-white">₹{silver.price.toFixed(2)}/g</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-light",
                        getMarketChangeColor(silver.changePercent)
                      )}>
                        {silver.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{silver.change >= 0 ? "+" : ""}{silver.change.toFixed(2)}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="actionGreen"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/${silver.symbol}`);
                      }}
                      className="w-full h-8"
                      data-testid={`button-compare-${silver.symbol}`}
                    >
                      Compare & Buy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* Diamond - Multiple Vendors */}
          {(!selectedCategory || selectedCategory === "diamond") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Gem className="h-4 w-4 text-white/60" strokeWidth={1} />
                Diamond
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/diamond/providers")}
                data-testid="button-view-all-diamond"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {liveDiamondData.map((diamond) => (
                <Card 
                  key={diamond.symbol}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment/${diamond.symbol}`)}
                  data-testid={`card-diamond-${diamond.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-light text-white truncate">{diamond.name}</p>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs mb-2 rounded-none font-light">{diamond.clarity}</Badge>
                      <p className="text-xs text-white/60 font-light">{diamond.vendors} vendors</p>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-light text-white">₹{diamond.price.toLocaleString()}</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-light",
                        getMarketChangeColor(diamond.changePercent)
                      )}>
                        {diamond.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{diamond.change >= 0 ? "+" : ""}{diamond.change.toFixed(2)}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="actionGreen"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/${diamond.symbol}`);
                      }}
                      className="w-full h-8"
                      data-testid={`button-compare-${diamond.symbol}`}
                    >
                      Compare & Buy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* Mutual Funds List */}
          {(!selectedCategory || selectedCategory === "mutual_funds") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Shield className="h-4 w-4 text-white/60" strokeWidth={1} />
                Mutual Funds
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/mutual-funds")}
                data-testid="button-view-all-mutual-funds"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {mutualFundsList.slice(0, 10).map((fund) => (
                <Card 
                  key={fund.symbol}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment-detail/${fund.symbol}`)}
                  data-testid={`card-mutual-fund-${fund.symbol}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-light text-white truncate">{fund.instrumentName}</p>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs mb-2 rounded-none font-light">{fund.subcategory}</Badge>
                      <p className="text-xs text-white/60 truncate mb-1 font-light">{fund.fundHouse}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/50">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={cn(
                                "h-3 w-3 inline",
                                star <= fund.rating ? "text-white fill-white" : "text-white/20"
                              )} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-white/50">AUM: {fund.aum}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-light text-white">₹{fund.currentPrice.toFixed(2)}</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-light",
                        getMarketChangeColor(fund.changePercent)
                      )}>
                        {fund.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{fund.changePercent >= 0 ? "+" : ""}{fund.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="actionGreen"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/investment-detail/${fund.symbol}`);
                        }}
                        className="flex-1 h-8"
                        data-testid={`button-invest-${fund.symbol}`}
                      >
                        Invest
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/investment/sip/new`);
                        }}
                        className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 h-8"
                        data-testid={`button-start-sip-${fund.symbol}`}
                      >
                        SIP
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* Fixed Deposits */}
          {(!selectedCategory || selectedCategory === "fd") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Building2 className="h-4 w-4 text-white/60" strokeWidth={1} />
                Fixed Deposits
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/fd/providers")}
                data-testid="button-view-all-fds"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {[
                { bank: "HDFC Bank", rate: 7.5, tenure: "1 Year", minAmount: 10000 },
                { bank: "ICICI Bank", rate: 7.25, tenure: "2 Years", minAmount: 10000 },
                { bank: "SBI", rate: 7.0, tenure: "3 Years", minAmount: 5000 },
                { bank: "Axis Bank", rate: 7.75, tenure: "18 Months", minAmount: 10000 },
                { bank: "Kotak Bank", rate: 7.60, tenure: "2 Years", minAmount: 15000 },
                { bank: "Yes Bank", rate: 7.85, tenure: "1 Year", minAmount: 25000 },
              ].map((fd, index) => (
                <Card 
                  key={index}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate("/fixed-deposits")}
                  data-testid={`card-fd-${index}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <p className="font-light text-white mb-1">{fd.bank}</p>
                      <p className="text-xs text-white/60 mb-2 font-light">{fd.tenure}</p>
                      <p className="text-xs text-white/50 font-light">Min: ₹{fd.minAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center mb-3">
                      <p className="text-2xl font-light text-white">{fd.rate}%</p>
                      <p className="text-xs text-white/60 font-light">p.a.</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/fixed-deposits");
                      }}
                      className="w-full bg-white text-black hover:bg-white/90 h-8 rounded-none font-light"
                      data-testid={`button-invest-fd-${index}`}
                    >
                      Invest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* SIP Plans */}
          {(!selectedCategory || selectedCategory === "sip") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/60" strokeWidth={1} />
                SIP Plans
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/sip")}
                data-testid="button-view-all-sips"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {sipPlansList.slice(0, 10).map((plan) => (
                <Card 
                  key={plan.id}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment/sip/${plan.id}`)}
                  data-testid={`card-sip-plan-${plan.id}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <p className="font-light text-white mb-1 truncate">{plan.name}</p>
                      <p className="text-xs text-white/60 truncate mb-2 font-light">{plan.fundHouse}</p>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs rounded-none font-light">{plan.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className="text-white/50">₹{plan.minSipAmount}/mo</span>
                      <span className="text-white/80">1Y: {plan.returns1y}%</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/sip/${plan.id}`);
                      }}
                      className="w-full bg-white text-black hover:bg-white/90 h-8 rounded-none font-light"
                      data-testid={`button-sip-invest-${plan.id}`}
                    >
                      View SIP
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* STP (Systematic Transfer Plan) */}
          {(!selectedCategory || selectedCategory === "stp") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-white/60" strokeWidth={1} />
                STP Plans
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/stp")}
                data-testid="button-view-all-stp"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {[
                { id: "hdfc-stp", name: "HDFC Liquid to Equity STP", from: "Liquid", to: "Equity", minTransfer: 500 },
                { id: "icici-stp", name: "ICICI Debt to Equity STP", from: "Debt", to: "Equity", minTransfer: 1000 },
                { id: "sbi-stp", name: "SBI Liquid to Hybrid STP", from: "Liquid", to: "Hybrid", minTransfer: 500 }
              ].map((stp) => (
                <Card 
                  key={stp.id}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment/stp/${stp.id}`)}
                  data-testid={`card-stp-${stp.id}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <p className="font-light text-white mb-1">{stp.name}</p>
                      <div className="flex items-center gap-2 text-xs text-white/60 mb-2 font-light">
                        <span>{stp.from}</span>
                        <ArrowRightLeft className="h-3 w-3" />
                        <span>{stp.to}</span>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs rounded-none font-light">Systematic Transfer</Badge>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-white/60 font-light">Min. Transfer</p>
                      <p className="text-lg font-light text-white">₹{stp.minTransfer.toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/stp/${stp.id}`);
                      }}
                      className="w-full bg-white text-black hover:bg-white/90 h-8 rounded-none font-light"
                      data-testid={`button-view-${stp.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}

          {/* SWP (Systematic Withdrawal Plan) */}
          {(!selectedCategory || selectedCategory === "swp") && (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-white/60" strokeWidth={1} />
                SWP Plans
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto rounded-none"
                onClick={() => navigate("/investment/swp")}
                data-testid="button-view-all-swp"
              >
                <span className="text-xs uppercase tracking-widest font-light">View All</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {[
                { id: "hdfc-swp", name: "HDFC Balanced Advantage SWP", fundHouse: "HDFC MF", minWithdrawal: 1000, returns: "12.5%" },
                { id: "icici-swp", name: "ICICI Equity & Debt SWP", fundHouse: "ICICI Prudential", minWithdrawal: 500, returns: "11.8%" },
                { id: "sbi-swp", name: "SBI Conservative Hybrid SWP", fundHouse: "SBI MF", minWithdrawal: 1000, returns: "10.5%" }
              ].map((swp) => (
                <Card 
                  key={swp.id}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 w-[280px] rounded-none backdrop-blur-xl"
                  onClick={() => navigate(`/investment/swp/${swp.id}`)}
                  data-testid={`card-swp-${swp.id}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <p className="font-light text-white mb-1">{swp.name}</p>
                      <p className="text-xs text-white/60 mb-2 font-light">{swp.fundHouse}</p>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs rounded-none font-light">{swp.returns} Returns</Badge>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-white/60 font-light">Min. Withdrawal</p>
                      <p className="text-lg font-light text-white">₹{swp.minWithdrawal.toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/investment/swp/${swp.id}`);
                      }}
                      className="w-full bg-white text-black hover:bg-white/90 h-8 rounded-none font-light"
                      data-testid={`button-view-${swp.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="mt-0 px-4 pt-4 pb-6 space-y-6">
          {/* Portfolio Summary Card */}
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 rounded-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Total Portfolio Value</p>
                <div className="flex items-center gap-2">
                  {gainLossPercent >= 0 ? <TrendingUp className="h-3 w-3 text-white/60" /> : <TrendingDown className="h-3 w-3 text-white/60" />}
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
                  <p className="text-lg font-light text-white">{formatCurrency(Math.abs(portfolioValue - investedValue))}</p>
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
              {["all", "stocks", "crypto", "mf", "sip", "fd", "stp", "swp", "gold", "silver", "diamond"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHoldingsSubTab(tab)}
                  className={cn(
                    "px-4 py-3 text-[10px] uppercase tracking-widest font-light border-b-2 whitespace-nowrap transition-colors",
                    holdingsSubTab === tab 
                      ? "border-white text-white" 
                      : "border-transparent text-white/50 hover:text-white/70"
                  )}
                  data-testid={`button-holdings-${tab}`}
                >
                  {tab === "mf" ? "Mutual Funds" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Holdings List */}
          <div className="space-y-3">
            {portfolioLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4 rounded-none">
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </>
            ) : portfolioItems.length === 0 ? (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8 text-center rounded-none">
                <BarChart3 className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1 font-light tracking-wide">No holdings yet</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Start investing to build your portfolio</p>
              </div>
            ) : (
              portfolioItems
                .filter((holding: any) => {
                  if (holdingsSubTab === "all") return true;
                  if (holdingsSubTab === "stocks") return holding.investmentType === "Stock";
                  if (holdingsSubTab === "crypto") return holding.investmentType === "Crypto";
                  if (holdingsSubTab === "mf") return holding.investmentType === "Mutual Fund";
                  if (holdingsSubTab === "sip") return holding.investmentType === "SIP";
                  if (holdingsSubTab === "fd") return holding.investmentType === "FD";
                  if (holdingsSubTab === "stp") return holding.investmentType === "STP";
                  if (holdingsSubTab === "swp") return holding.investmentType === "SWP";
                  if (holdingsSubTab === "gold") return holding.symbol?.includes("GOLD");
                  if (holdingsSubTab === "silver") return holding.symbol?.includes("SILVER");
                  if (holdingsSubTab === "diamond") return holding.symbol?.includes("DIAMOND");
                  return true;
                })
                .map((holding: any) => {
                  const currentPrice = parseFloat(holding.currentPrice || "0");
                  const avgPrice = parseFloat(holding.avgPrice || "0");
                  const gainLoss = currentPrice - avgPrice;
                  const gainLossPerc = avgPrice > 0 ? ((gainLoss / avgPrice) * 100) : 0;
                  
                  return (
                    <div
                      key={holding.id}
                      className="border-2 border-gray-700/60 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm p-4 transition-all cursor-pointer rounded-sm"
                      onClick={() => navigate(`/stocks/${holding.symbol}`)}
                      data-testid={`card-holding-${holding.id}`}
                    >
                      {/* Header Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white text-base tracking-wide flex-1">{holding.instrumentName}</h4>
                          <span className="px-2 py-1 bg-white/[0.08] border border-white/[0.12] text-[10px] text-white/70 uppercase tracking-widest rounded-md">
                            {holding.investmentType}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-r border-white/[0.06] pr-3">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Total Quantity</p>
                            <p className="text-sm font-medium text-white">{holding.quantity} {holding.investmentType === "Stock" ? "shares" : "units"}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Total Profit</p>
                            <p className={cn(
                              "text-sm font-medium",
                              gainLoss >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {gainLoss >= 0 ? "+" : ""}₹{Math.abs(gainLoss).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-r border-white/[0.06] pr-3">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Buy Price</p>
                            <p className="text-sm font-medium text-white">₹{parseFloat(holding.avgPrice || "0").toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Current Price</p>
                            <p className="text-sm font-medium text-white">₹{parseFloat(holding.currentPrice || "0").toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Growth Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          {gainLoss >= 0 ? 
                            <TrendingUp className="h-4 w-4 text-green-400" /> : 
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          }
                          <span className={cn(
                            "text-sm font-medium",
                            gainLoss >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {gainLoss >= 0 ? "+" : ""}{gainLossPerc.toFixed(2)}% Growth
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="actionGreen"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyAsset({
                              symbol: holding.symbol,
                              instrumentName: holding.instrumentName,
                              assetType: holding.investmentType,
                              currentPrice: parseFloat(holding.currentPrice || "0"),
                            });
                          }}
                          className="flex-1 text-[10px] uppercase tracking-widest"
                          data-testid={`button-buy-more-${holding.id}`}
                        >
                          Buy More
                        </Button>
                        <Button
                          size="sm"
                          variant="actionRed"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSellAsset({
                              symbol: holding.symbol,
                              instrumentName: holding.instrumentName,
                              assetType: holding.investmentType,
                              currentPrice: parseFloat(holding.currentPrice || "0"),
                            }, {
                              quantity: parseFloat(holding.quantity || "0"),
                              avgPrice: parseFloat(holding.avgPrice || "0"),
                            });
                          }}
                          className="flex-1 text-[10px] uppercase tracking-widest"
                          data-testid={`button-sell-${holding.id}`}
                        >
                          Sell
                        </Button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-0 pb-6">
          {/* Orders Summary Card */}
          <div className="px-4 pt-4 pb-3">
            <div className="bg-black/40 border border-white/20 rounded-none p-3 backdrop-blur-xl">
              <h3 className="text-[10px] uppercase tracking-widest text-white/60 mb-3 font-light">Order Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  onClick={() => setOrderFilter("all")}
                  className={cn(
                    "rounded-none p-3 backdrop-blur-sm cursor-pointer transition-all",
                    orderFilter === "all" 
                      ? "bg-white/20 border-2 border-white/40" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                  data-testid="card-filter-all"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ShoppingCart className="h-3 w-3 text-white/80" />
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-light">Total</p>
                  </div>
                  <p className="text-xl font-light text-white" data-testid="text-total-orders">
                    {allOrders.length}
                  </p>
                </div>
                <div 
                  onClick={() => setOrderFilter("executed")}
                  className={cn(
                    "rounded-none p-3 backdrop-blur-sm cursor-pointer transition-all",
                    orderFilter === "executed" 
                      ? "bg-green-400/20 border-2 border-green-400/40" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                  data-testid="card-filter-executed"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-light">Executed</p>
                  </div>
                  <p className="text-xl font-light text-green-400" data-testid="text-executed-orders">
                    {allOrders.filter((order: any) => order.status === "executed").length}
                  </p>
                </div>
                <div 
                  onClick={() => setOrderFilter("pending")}
                  className={cn(
                    "rounded-none p-3 backdrop-blur-sm cursor-pointer transition-all",
                    orderFilter === "pending" 
                      ? "bg-yellow-400/20 border-2 border-yellow-400/40" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                  data-testid="card-filter-pending"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="h-3 w-3 text-yellow-400" />
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-light">Active</p>
                  </div>
                  <p className="text-xl font-light text-yellow-400" data-testid="text-active-orders">
                    {allOrders.filter((order: any) => order.status === "pending").length}
                  </p>
                </div>
                <div 
                  onClick={() => setOrderFilter("cancelled")}
                  className={cn(
                    "rounded-none p-3 backdrop-blur-sm cursor-pointer transition-all",
                    orderFilter === "cancelled" 
                      ? "bg-red-400/20 border-2 border-red-400/40" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                  data-testid="card-filter-cancelled"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <X className="h-3 w-3 text-red-400" />
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-light">Cancelled</p>
                  </div>
                  <p className="text-xl font-light text-red-400" data-testid="text-cancelled-orders">
                    {allOrders.filter((order: any) => order.status === "cancelled").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Tabs - Sticky under main tabs */}
          <div className="sticky top-[340px] z-30 bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="flex gap-0 overflow-x-auto px-4">
              {["all", "stocks", "crypto", "mf", "sip", "fd", "stp", "swp", "gold", "silver", "diamond"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOrdersSubTab(tab)}
                  className={cn(
                    "px-4 py-3 text-[10px] uppercase tracking-widest font-light border-b-2 whitespace-nowrap transition-colors",
                    ordersSubTab === tab 
                      ? "border-white text-white" 
                      : "border-transparent text-white/50 hover:text-white/70"
                  )}
                  data-testid={`button-orders-${tab}`}
                >
                  {tab === "mf" ? "Mutual Funds" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="px-4 pt-6 space-y-3">
            {ordersLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4 rounded-none">
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </>
            ) : filteredOrders.length === 0 ? (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8 text-center rounded-none">
                <ShoppingCart className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1 font-light tracking-wide">No orders yet</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Your orders will appear here</p>
              </div>
            ) : (
              filteredOrders
                .filter((order: any) => {
                  if (ordersSubTab === "all") return true;
                  if (ordersSubTab === "stocks") return order.investmentType === "Stock";
                  if (ordersSubTab === "crypto") return order.investmentType === "Crypto";
                  if (ordersSubTab === "mf") return order.investmentType === "Mutual Fund";
                  if (ordersSubTab === "sip") return order.investmentType === "SIP";
                  if (ordersSubTab === "fd") return order.investmentType === "FD";
                  if (ordersSubTab === "stp") return order.investmentType === "STP";
                  if (ordersSubTab === "swp") return order.investmentType === "SWP";
                  if (ordersSubTab === "gold") return order.symbol?.includes("GOLD");
                  if (ordersSubTab === "silver") return order.symbol?.includes("SILVER");
                  if (ordersSubTab === "diamond") return order.symbol?.includes("DIAMOND");
                  return true;
                })
                .map((order: any) => {
                  const isSoldOrder = order.orderType === "sell" && order.status === "executed";
                  const currentPrice = parseFloat(order.currentPrice || "0");
                  const orderPrice = parseFloat(order.orderPrice || "0");
                  
                  const profit = isSoldOrder ? parseFloat(order.totalProfit || "0") : (currentPrice - orderPrice) * parseFloat(order.quantity || "1");
                  const profitPerc = isSoldOrder ? parseFloat(order.profitPercentage || "0") : (orderPrice > 0 ? ((currentPrice - orderPrice) / orderPrice) * 100 : 0);
                  
                  return (
                    <div
                      key={order.id}
                      className="border-2 border-gray-700/60 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm p-4 transition-all cursor-pointer rounded-sm"
                      onClick={() => navigate(`/stocks/${order.symbol}`)}
                      data-testid={`card-order-${order.id}`}
                    >
                      {/* Header Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white text-base tracking-wide flex-1">{order.instrumentName}</h4>
                          <span className={cn(
                            "px-2 py-1 border text-[10px] uppercase tracking-widest rounded-md",
                            order.orderType === "buy" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                          )}>
                            {order.orderType}
                          </span>
                          <span className="px-2 py-1 bg-white/[0.08] border border-white/[0.12] text-[10px] text-white/70 uppercase tracking-widest rounded-md">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-r border-white/[0.06] pr-3">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Total Quantity</p>
                            <p className="text-sm font-medium text-white">{order.quantity} {order.unit || "shares"}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Total Profit</p>
                            <p className={cn(
                              "text-sm font-medium",
                              profit >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {profit >= 0 ? "+" : ""}₹{Math.abs(profit).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-r border-white/[0.06] pr-3">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Order Price</p>
                            <p className="text-sm font-medium text-white">₹{orderPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Current Price</p>
                            <p className="text-sm font-medium text-white">₹{currentPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Growth Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          {profit >= 0 ? 
                            <TrendingUp className="h-4 w-4 text-green-400" /> : 
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          }
                          <span className={cn(
                            "text-sm font-medium",
                            profit >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {profit >= 0 ? "+" : ""}{profitPerc.toFixed(2)}% Growth
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {order.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Prepare asset data with existing order information
                              const assetData = {
                                symbol: order.symbol,
                                instrumentName: order.instrumentName,
                                assetType: order.investmentType,
                                currentPrice: currentPrice,
                                vendorName: order.vendorName,
                                unit: order.unit,
                                // Pass existing order data for pre-filling
                                existingOrder: {
                                  id: order.id,
                                  quantity: order.quantity,
                                  orderPrice: order.orderPrice,
                                  totalAmount: order.totalAmount,
                                },
                              };
                              
                              // Call appropriate handler based on order type
                              if (order.orderType === "sell") {
                                handleSellAsset(assetData, {
                                  quantity: parseFloat(order.quantity || "0"),
                                  avgPrice: parseFloat(order.orderPrice || "0"),
                                });
                              } else {
                                handleBuyAsset(assetData);
                              }
                            }}
                            className="flex-1 text-[10px] uppercase tracking-widest bg-white/5 border-white/20 text-white hover:bg-white/10"
                            data-testid={`button-modify-order-${order.id}`}
                          >
                            Modify Order
                          </Button>
                          <Button
                            size="sm"
                            variant="actionRed"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrderToCancel(order);
                              setCancelOrderDialogOpen(true);
                            }}
                            className="flex-1 text-[10px] uppercase tracking-widest"
                            data-testid={`button-cancel-order-${order.id}`}
                          >
                            Cancel Order
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="actionGreen"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyAsset({
                                symbol: order.symbol,
                                instrumentName: order.instrumentName,
                                assetType: order.investmentType,
                                currentPrice: currentPrice,
                              });
                            }}
                            className="flex-1 text-[10px] uppercase tracking-widest"
                            data-testid={`button-buy-more-order-${order.id}`}
                          >
                            Buy More
                          </Button>
                          <Button
                            size="sm"
                            variant="actionRed"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSellAsset({
                                symbol: order.symbol,
                                instrumentName: order.instrumentName,
                                assetType: order.investmentType,
                                currentPrice: currentPrice,
                              }, {
                                quantity: parseFloat(order.quantity || "0"),
                                avgPrice: orderPrice,
                              });
                            }}
                            className="flex-1 text-[10px] uppercase tracking-widest"
                            data-testid={`button-sell-order-${order.id}`}
                          >
                            Sell
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="mt-0 pb-6">
          {/* Sub Tabs - Sticky under main tabs */}
          <div className="sticky top-[340px] z-30 bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="flex gap-0 overflow-x-auto px-4">
              {["all", "stocks", "crypto", "mf", "sip", "fd", "stp", "swp", "gold", "silver", "diamond"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setWatchlistSubTab(tab)}
                  className={cn(
                    "px-4 py-3 text-[10px] uppercase tracking-widest font-light border-b-2 whitespace-nowrap transition-colors",
                    watchlistSubTab === tab 
                      ? "border-white text-white" 
                      : "border-transparent text-white/50 hover:text-white/70"
                  )}
                  data-testid={`button-watchlist-${tab}`}
                >
                  {tab === "mf" ? "Mutual Funds" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div className="px-4 pt-6 space-y-3">
            {watchlistLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4 rounded-none">
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </>
            ) : watchlistItems.length === 0 ? (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8 text-center rounded-none">
                <Star className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1 font-light tracking-wide">No items in watchlist</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Add items to track your favorites</p>
              </div>
            ) : (
              watchlistItems
                .filter((item: any) => {
                  if (watchlistSubTab === "all") return true;
                  if (watchlistSubTab === "stocks") return item.assetType === "stock";
                  if (watchlistSubTab === "crypto") return item.assetType === "crypto";
                  if (watchlistSubTab === "mf") return item.assetType === "mutual_fund";
                  if (watchlistSubTab === "sip") return item.assetType === "sip";
                  if (watchlistSubTab === "fd") return item.assetType === "fd";
                  if (watchlistSubTab === "stp") return item.assetType === "stp";
                  if (watchlistSubTab === "swp") return item.assetType === "swp";
                  if (watchlistSubTab === "gold") return item.symbol?.includes("GOLD");
                  if (watchlistSubTab === "silver") return item.symbol?.includes("SILVER");
                  if (watchlistSubTab === "diamond") return item.symbol?.includes("DIAMOND");
                  return true;
                })
                .map((item: any) => {
                  const dayChange = parseFloat(item.dayChangePercent || "0");
                  const currentPrice = parseFloat(item.currentPrice || "0");
                  
                  return (
                    <div
                      key={item.id}
                      className="border-2 border-gray-700/60 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm p-4 transition-all cursor-pointer rounded-sm"
                      onClick={() => navigate(`/stocks/${item.symbol}`)}
                      data-testid={`card-watchlist-${item.id}`}
                    >
                      {/* Header Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white text-base tracking-wide flex-1">{item.instrumentName}</h4>
                          <span className="px-2 py-1 bg-white/[0.08] border border-white/[0.12] text-[10px] text-white/70 uppercase tracking-widest rounded-md">
                            {item.assetType}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-r border-white/[0.06] pr-3">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Symbol</p>
                            <p className="text-sm font-medium text-white">{item.symbol}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Day Change</p>
                            <p className={cn(
                              "text-sm font-medium",
                              dayChange >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {dayChange >= 0 ? "+" : ""}{dayChange.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-r border-white/[0.06] pr-3">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Current Price</p>
                            <p className="text-sm font-medium text-white">₹{currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Market Status</p>
                            <p className="text-sm font-medium text-white">Live</p>
                          </div>
                        </div>
                      </div>

                      {/* Growth Section */}
                      <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          {dayChange >= 0 ? 
                            <TrendingUp className="h-4 w-4 text-green-400" /> : 
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          }
                          <span className={cn(
                            "text-sm font-medium",
                            dayChange >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {dayChange >= 0 ? "+" : ""}{dayChange.toFixed(2)}% Today
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="actionGreen"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyAsset({
                              symbol: item.symbol,
                              instrumentName: item.instrumentName,
                              assetType: item.assetType,
                              currentPrice: currentPrice,
                            });
                          }}
                          className="flex-1 text-[10px] uppercase tracking-widest"
                          data-testid={`button-buy-watchlist-${item.id}`}
                        >
                          Buy Now
                        </Button>
                        <Button
                          size="sm"
                          variant="actionRed"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlistMutation.mutate(item.id);
                          }}
                          className="flex-1 text-[10px] uppercase tracking-widest"
                          data-testid={`button-remove-watchlist-${item.id}`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </TabsContent>

        {/* SIP Tab */}
        <TabsContent value="sip" className="mt-0 px-4 pt-10 pb-6">
          <Card className="bg-white/5 border border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Start a SIP</h3>
                  <p className="text-white/70">Invest systematically and build wealth over time with automated monthly investments</p>
                </div>
              </div>
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 rounded-none font-light"
                onClick={() => navigate("/investment/sip/new")}
                data-testid="button-start-sip"
              >
                Start New SIP
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">All SIP Plans</h2>
              <Badge className="bg-white/10 text-white border-white/20">
                {sipPlansList.length} Plans
              </Badge>
            </div>
            <div className="space-y-3">
              {sipPlansList.map((sip) => (
                <Card 
                  key={sip.id}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/sip-detail/${sip.id}`)}
                  data-testid={`card-sip-${sip.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-light text-white">{sip.name}</p>
                          <Badge className="bg-white/10 text-white border-white/20 text-xs">
                            {sip.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/60">{sip.fundHouse}</p>
                        <p className="text-xs text-white/50 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={cn(
                                "h-3 w-3 inline",
                                star <= sip.rating ? "text-white fill-white" : "text-white/20"
                              )} 
                            />
                          ))}
                          <span className="ml-2">Min: ₹{sip.minSipAmount}/mo</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">₹{sip.navPrice.toFixed(2)}</p>
                        <p className="text-xs text-white/80">1Y: {sip.returns1y}%</p>
                        <p className="text-xs text-white/80">3Y: {sip.returns3y}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sip-detail/${sip.id}`);
                        }}
                        className="flex-1 bg-white text-black hover:bg-white/90 h-8 rounded-none font-light"
                        data-testid={`button-view-sip-${sip.id}`}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/investment/sip/new`);
                        }}
                        className="flex-1 bg-white text-black hover:bg-white/90 h-8 rounded-none font-light"
                        data-testid={`button-start-sip-${sip.id}`}
                      >
                        Start SIP
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Crypto Tab */}
        <TabsContent value="crypto" className="mt-0 px-4 pt-6 pb-6">
          <div>
            <h2 className="text-lg font-light text-white mb-4">Cryptocurrencies</h2>
            <div className="space-y-3">
              {useLiveMarketData([
                { id: 1, name: "Bitcoin", symbol: "BTC", price: 4235678.50, change: 2.45 },
                { id: 2, name: "Ethereum", symbol: "ETH", price: 245890.25, change: -1.23 },
                { id: 3, name: "Ripple", symbol: "XRP", price: 45.30, change: 5.67 },
                { id: 4, name: "Cardano", symbol: "ADA", price: 32.85, change: 3.21 },
                { id: 5, name: "Solana", symbol: "SOL", price: 12456.75, change: -0.89 }
              ], true, 1000, 5).map((crypto) => (
                <Card 
                  key={crypto.id}
                  className="bg-white/5 border border-white/10 rounded-none backdrop-blur-xl hover:bg-white/10 transition-colors"
                  data-testid={`card-crypto-${crypto.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-light text-white">{crypto.name}</p>
                        <p className="text-sm text-white/60">{crypto.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-light text-white">₹{crypto.price.toLocaleString()}</p>
                        <p className={cn(
                          "text-sm",
                          ((crypto as any).changePercent || 0) >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {((crypto as any).changePercent || 0) >= 0 ? "+" : ""}{((crypto as any).changePercent || 0).toFixed(2)}%
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="ml-4 bg-white text-black hover:bg-white/90 rounded-none font-light"
                        data-testid={`button-buy-crypto-${crypto.id}`}
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Gold Tab */}
        <TabsContent value="gold" className="mt-0 px-4 pt-6 pb-6">
          <div>
            <h2 className="text-lg font-light text-white mb-4">Gold Investments</h2>
            <div className="space-y-3">
              {useLiveMarketData([
                { id: 1, name: "24K Gold", symbol: "GOLD24K", weight: "1g", price: 6850, change: 0.45 },
                { id: 2, name: "22K Gold", symbol: "GOLD22K", weight: "1g", price: 6280, change: 0.38 },
                { id: 3, name: "Digital Gold", symbol: "GOLDDIG", weight: "1g", price: 6825, change: 0.42 },
                { id: 4, name: "Gold ETF", symbol: "GOLDETF", weight: "1 unit", price: 685, change: 0.51 },
                { id: 5, name: "Sovereign Gold Bond", symbol: "GOLDSGB", weight: "1g", price: 6790, change: 0.35 }
              ], true, 1000, 5).map((gold) => (
                <Card 
                  key={gold.id}
                  className="bg-white/5 border border-white/10 rounded-none backdrop-blur-xl hover:bg-white/10 transition-colors"
                  data-testid={`card-gold-${gold.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-light text-white">{gold.name}</p>
                        <p className="text-sm text-white/60">{gold.weight}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-light text-white">₹{gold.price.toLocaleString()}</p>
                        <p className={cn(
                          "text-sm",
                          ((gold as any).changePercent || 0) >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {((gold as any).changePercent || 0) >= 0 ? "+" : ""}{((gold as any).changePercent || 0).toFixed(2)}%
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="ml-4 bg-white text-black hover:bg-white/90 rounded-none font-light"
                        data-testid={`button-buy-gold-${gold.id}`}
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Silver Tab */}
        <TabsContent value="silver" className="mt-0 px-4 pt-6 pb-6">
          <div>
            <h2 className="text-lg font-light text-white mb-4">Silver Investments</h2>
            <div className="space-y-3">
              {useLiveMarketData([
                { id: 1, name: "Pure Silver", symbol: "SILVERPURE", weight: "1g", price: 82, change: 1.23 },
                { id: 2, name: "Silver Coins", symbol: "SILVERCOIN", weight: "10g", price: 820, change: 1.18 },
                { id: 3, name: "Digital Silver", symbol: "SILVERDIG", weight: "1g", price: 81.50, change: 1.25 },
                { id: 4, name: "Silver ETF", symbol: "SILVERETF", weight: "1 unit", price: 75, change: 1.35 },
                { id: 5, name: "Silver Bars", symbol: "SILVERBAR", weight: "100g", price: 8150, change: 1.20 }
              ], true, 1000, 5).map((silver) => (
                <Card 
                  key={silver.id}
                  className="bg-white/5 border border-white/10 rounded-none backdrop-blur-xl hover:bg-white/10 transition-colors"
                  data-testid={`card-silver-${silver.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-light text-white">{silver.name}</p>
                        <p className="text-sm text-white/60">{silver.weight}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-light text-white">₹{silver.price.toLocaleString()}</p>
                        <p className={cn(
                          "text-sm",
                          ((silver as any).changePercent || 0) >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {((silver as any).changePercent || 0) >= 0 ? "+" : ""}{((silver as any).changePercent || 0).toFixed(2)}%
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="ml-4 bg-white text-black hover:bg-white/90 rounded-none font-light"
                        data-testid={`button-buy-silver-${silver.id}`}
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Diamond Tab */}
        <TabsContent value="diamond" className="mt-0 px-4 pt-6 pb-6">
          <div>
            <h2 className="text-lg font-light text-white mb-4">Diamond Investments</h2>
            <div className="space-y-3">
              {useLiveMarketData([
                { id: 1, name: "0.5 Carat Diamond", symbol: "DIAMOND05", grade: "VS1, H", price: 125000, change: 0.85 },
                { id: 2, name: "1 Carat Diamond", symbol: "DIAMOND1", grade: "VS2, G", price: 485000, change: 1.12 },
                { id: 3, name: "Diamond ETF", symbol: "DIAMONDETF", grade: "Mixed", price: 2500, change: 0.95 },
                { id: 4, name: "2 Carat Diamond", symbol: "DIAMOND2", grade: "VVS1, E", price: 1850000, change: 0.78 },
                { id: 5, name: "Certified Diamond", symbol: "DIAMONDCERT", grade: "IF, D", price: 3250000, change: 1.05 }
              ], true, 1000, 5).map((diamond) => (
                <Card 
                  key={diamond.id}
                  className="bg-white/5 border border-white/10 rounded-none backdrop-blur-xl hover:bg-white/10 transition-colors"
                  data-testid={`card-diamond-${diamond.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-light text-white">{diamond.name}</p>
                        <p className="text-sm text-white/60">{diamond.grade}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-light text-white">₹{diamond.price.toLocaleString()}</p>
                        <p className={cn(
                          "text-sm",
                          ((diamond as any).changePercent || 0) >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {((diamond as any).changePercent || 0) >= 0 ? "+" : ""}{((diamond as any).changePercent || 0).toFixed(2)}%
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="ml-4 bg-white text-black hover:bg-white/90 rounded-none font-light"
                        data-testid={`button-buy-diamond-${diamond.id}`}
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Trade Dialog */}
      {selectedAsset && (
        <InvestmentTradeDialog
          open={tradeDialogOpen}
          onOpenChange={setTradeDialogOpen}
          mode={tradeMode}
          asset={selectedAsset}
          onConfirm={handleTradeConfirm}
        />
      )}

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={cancelOrderDialogOpen} onOpenChange={setCancelOrderDialogOpen}>
        <AlertDialogContent className="bg-black border border-white/20 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl font-light tracking-wide mb-2">Cancel Order</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 text-sm font-light">
              Review your order details before cancellation
            </AlertDialogDescription>
          </AlertDialogHeader>

          {orderToCancel && (
            <div className="space-y-3 my-4">
              {/* Order Info */}
              <div className="bg-white/5 border border-white/10 rounded-none p-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Asset Name</p>
                <p className="text-base text-white font-light">{orderToCancel.instrumentName}</p>
              </div>

              {/* Price & Quantity Section */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-none p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Quantity</p>
                  <p className="text-lg text-white font-light">{orderToCancel.quantity} {orderToCancel.unit || 'units'}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-none p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Order Type</p>
                  <p className={cn(
                    "text-lg font-light uppercase",
                    orderToCancel.orderType === "buy" ? "text-green-400" : "text-red-400"
                  )}>{orderToCancel.orderType}</p>
                </div>
              </div>

              {/* Price Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-none p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Order Price</p>
                  <p className="text-lg text-white font-light">₹{parseFloat(orderToCancel.orderPrice || "0").toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-none p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Current Price</p>
                  <p className="text-lg text-white font-light">₹{parseFloat(orderToCancel.currentPrice || "0").toFixed(2)}</p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-white/5 border border-white/10 rounded-none p-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Total Amount</p>
                <p className="text-2xl text-white font-light">₹{parseFloat(orderToCancel.totalAmount || "0").toLocaleString()}</p>
              </div>

              {/* Warning Message */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-none p-4">
                <p className="text-sm text-red-400 font-light">
                  ⚠️ This action cannot be undone. Your order will be permanently cancelled.
                </p>
              </div>
            </div>
          )}

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-none font-light tracking-wider flex-1"
              data-testid="button-cancel-dialog-no"
            >
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (orderToCancel) {
                  cancelOrderMutation.mutate(orderToCancel.id);
                }
              }}
              disabled={cancelOrderMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 rounded-none font-light tracking-wider flex-1"
              data-testid="button-cancel-dialog-confirm"
            >
              {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="bg-black border border-white/20 max-w-md">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-green-500/10 rounded-none flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <AlertDialogTitle className="text-white text-2xl font-light tracking-wide text-center">
              Order Placed Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 text-sm font-light text-center">
              Your {successOrderDetails?.orderType === "buy" ? "purchase" : "sale"} order has been placed successfully
            </AlertDialogDescription>
          </AlertDialogHeader>

          {successOrderDetails && (
            <div className="space-y-3 my-4">
              <div className="bg-white/5 border border-white/10 rounded-none p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Asset</span>
                  <span className="text-white font-light">{successOrderDetails.instrumentName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Symbol</span>
                  <span className="text-white font-light">{successOrderDetails.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Quantity</span>
                  <span className="text-white font-light">{successOrderDetails.quantity} {successOrderDetails.unit || 'units'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Price</span>
                  <span className="text-white font-light">₹{parseFloat(successOrderDetails.orderPrice || "0").toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-xl text-white font-light">
                    ₹{parseFloat(successOrderDetails.totalAmount || "0").toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="gap-2 flex-col sm:flex-row">
            <AlertDialogAction
              onClick={() => {
                setSuccessDialogOpen(false);
                setSuccessOrderDetails(null);
              }}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-none font-light tracking-wider flex-1"
              data-testid="button-success-stay"
            >
              Place Another Order
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                if (successOrderDetails?.confirmationId) {
                  navigate(`/investment-congrats?id=${successOrderDetails.confirmationId}`);
                }
                setSuccessDialogOpen(false);
                setSuccessOrderDetails(null);
              }}
              className="bg-green-600 text-white hover:bg-green-700 rounded-none font-light tracking-wider flex-1"
              data-testid="button-success-view-details"
            >
              View Details
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation />
    </div>
  );
}
