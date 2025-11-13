import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiveMarketData } from "@/hooks/use-live-market-data";
import { LoadingLogo } from "@/components/ui/loading-logo";
import type { UpiTransaction, UpiAccount, FinancialAnalytics, InvestmentPortfolio, LoanApplication } from "@shared/schema";
import { 
  Bell, 
  Eye,
  EyeOff,
  TrendingUp,
  QrCode,
  Send,
  Receipt,
  Smartphone,
  Building2,
  Zap,
  Gift,
  Star,
  User,
  ArrowRight,
  CreditCard,
  Home as HomeIcon,
  Car,
  Plane,
  Train,
  Hotel,
  Calendar,
  Ticket,
  Droplet,
  Lightbulb,
  Wifi,
  Shield,
  Calculator,
  FileText,
  Users,
  TrendingUp as TrendingUpIcon,
  Wallet,
  BarChart3,
  PieChart,
  Activity,
  History,
  Banknote,
  Map,
  Film,
  Bike,
  Gem,
  Coins,
  Target,
  Briefcase,
  Award,
  AlertCircle,
  ChevronRight,
  Crown,
  PiggyBank,
  DollarSign,
  TrendingDown,
  Newspaper,
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Sparkles,
  Truck,
  Globe,
  Heart,
  Dumbbell,
  Wrench,
  BookOpen,
  PartyPopper
} from "lucide-react";

// Market News Autoscroll Component
function MarketNewsAutoscroll() {
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const marketNews = [
    {
      title: "NIFTY 50 closes at record high of 22,850 points, driven by strong buying in banking and IT stocks amid positive global cues",
      category: "INDICES",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
    },
    {
      title: "Reliance Industries reports Q4 adjusted earnings of ₹18,500 crore, beating estimates, despite challenges in retail segment",
      category: "STOCKS",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80"
    },
    {
      title: "Gold prices surge to ₹72,500 per 10 grams amid global economic uncertainty and strong demand from jewelers",
      category: "COMMODITIES",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80"
    },
    {
      title: "Tech stocks rally as IT sector gains momentum on artificial intelligence boom, with major firms announcing expanded AI divisions",
      category: "SECTOR",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80"
    },
    {
      title: "Reserve Bank of India maintains repo rate at 6.5% citing balanced inflation outlook and steady economic growth projections",
      category: "POLICY",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
    },
    {
      title: "Banking sector witnesses strong recovery as private banks lead gains with improved asset quality and declining NPA ratios",
      category: "BANKING",
      image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % marketNews.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [marketNews.length]);

  const currentNews = marketNews[currentIndex];

  return (
    <div 
      className="border-b border-white/10 cursor-pointer hover:border-white transition-all bg-white/5 hover:bg-white/10 overflow-hidden"
      onClick={() => navigate("/market-news")}
      data-testid="card-market-news"
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentNews.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        </div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-white/60" strokeWidth={1} />
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">MARKET NEWS</h3>
              <Badge className="bg-black/60 text-white border-white/30 rounded-none font-light text-[10px] px-2 py-0.5">
                LIVE
              </Badge>
            </div>
            <Badge className="bg-black/60 text-white/60 border-white/20 rounded-none font-light text-[10px] px-2 py-0.5">
              {currentNews.category}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-light text-white tracking-wide leading-relaxed">{currentNews.title}</h4>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-1.5">
              {marketNews.map((_, index) => (
                <div
                  key={index}
                  className={`h-0.5 flex-1 transition-all duration-300 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [fadeOutLoading, setFadeOutLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const justLoggedIn = sessionStorage.getItem('justLoggedIn');
      if (justLoggedIn === 'true') {
        setShowLoadingScreen(true);
        sessionStorage.removeItem('justLoggedIn');
        
        const fadeOutTimer = setTimeout(() => {
          setFadeOutLoading(true);
        }, 3500);

        const hideTimer = setTimeout(() => {
          setShowLoadingScreen(false);
        }, 4000);

        return () => {
          clearTimeout(fadeOutTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [isAuthenticated]);

  const { data: upiAccounts = [] } = useQuery<UpiAccount[]>({
    queryKey: ['/api/upi/accounts'],
    enabled: isAuthenticated,
    select: (data: UpiAccount[]) => data || []
  });

  const { data: upiTransactions = [] } = useQuery<UpiTransaction[]>({
    queryKey: ['/api/upi/transactions'],
    enabled: isAuthenticated,
    select: (data: UpiTransaction[]) => data || []
  });

  const { data: financialAnalytics } = useQuery<FinancialAnalytics>({
    queryKey: ['/api/financial-analytics'],
    enabled: isAuthenticated,
    select: (data: any) => data || null
  });

  const { data: investments = [] } = useQuery<InvestmentPortfolio[]>({
    queryKey: ['/api/investments'],
    enabled: isAuthenticated,
    select: (data: any) => data || []
  });

  const { data: portfolioData } = useQuery<{ portfolio: any[] }>({
    queryKey: ['/api/investments/portfolio'],
    enabled: isAuthenticated,
  });

  const { data: loans = [] } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
  });

  // Dummy portfolio holdings for demo when no real data
  const dummyHoldings = useMemo(() => [
    {
      id: "1",
      symbol: "RELIANCE",
      quantity: "50",
      avgPrice: "2450.00",
      currentPrice: "2650.00",
      totalInvested: "122500.00",
    },
    {
      id: "2",
      symbol: "BTC",
      quantity: "0.5",
      avgPrice: "4100000.00",
      currentPrice: "4235678.00",
      totalInvested: "2050000.00",
    },
    {
      id: "3",
      symbol: "GOLD24K",
      quantity: "100",
      avgPrice: "6700.00",
      currentPrice: "6850.00",
      totalInvested: "670000.00",
    }
  ], []);

  // Get base portfolio items
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

  // Calculate live totals with updated prices
  const { totalInvestmentValue, totalInvestedAmount, todaysProfit, profitPercentage } = useMemo(() => {
    const portfolioItems = livePortfolioData.map((liveItem: any, index: number) => {
      const baseItem = basePortfolioItems[index];
      const quantity = parseFloat(baseItem.quantity || "0");
      const avgPrice = parseFloat(baseItem.avgPrice || "0");
      const currentPrice = liveItem.price;
      const currentValue = quantity * currentPrice;
      const totalInvested = quantity * avgPrice;
      return { currentValue, totalInvested };
    });

    const totalValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0);
    const totalInvested = portfolioItems.reduce((sum, item) => sum + item.totalInvested, 0);
    const profit = totalValue - totalInvested;
    const percentage = totalInvested > 0 ? ((profit / totalInvested) * 100) : 0;

    return {
      totalInvestmentValue: totalValue,
      totalInvestedAmount: totalInvested,
      todaysProfit: profit,
      profitPercentage: percentage
    };
  }, [livePortfolioData, basePortfolioItems]);

  const activeData = useMemo(() => ({
    totalBalance: parseFloat(financialAnalytics?.totalIncome || "0") - parseFloat(financialAnalytics?.totalExpenses || "0") || 245600,
    monthlyIncome: parseFloat(financialAnalytics?.totalIncome || "0") || 85000,
    monthlyExpenses: parseFloat(financialAnalytics?.totalExpenses || "0") || 52000,
    savingsThisMonth: parseFloat(financialAnalytics?.totalSavings || "0") || 33000,
    todaysHoldings: totalInvestmentValue || 2450,
    todaysProfit: todaysProfit || 156000,
    todaysProfitPercentage: profitPercentage || 23.4,
    investmentGainsPercentage: profitPercentage || 8.7,
  }), [financialAnalytics, totalInvestmentValue, todaysProfit, profitPercentage]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const offers = [
    { id: 1, title: "New Offers", subtitle: "Get 20% cashback on all bills", icon: Gift },
    { id: 2, title: "New Deals", subtitle: "Save up to 50% on bookings", icon: Star },
    { id: 3, title: "New Features", subtitle: "AI-powered investment advisor", icon: Lightbulb },
    { id: 4, title: "New Launches", subtitle: "Crypto trading now live", icon: TrendingUp },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeLoan = useMemo(() => loans.find(loan => loan.status === "active"), [loans]);
  const nextEmiAmount = useMemo(() => activeLoan ? parseFloat(activeLoan.emi || '0') : 11250, [activeLoan]);
  const outstandingAmount = useMemo(() => activeLoan ? parseFloat(activeLoan.approvedAmount || '0') : 182500, [activeLoan]);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Premium Loading Screen Overlay */}
      {showLoadingScreen && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center animate-soft-fade-in ${
            fadeOutLoading ? 'animate-soft-fade-out' : ''
          }`}
          data-testid="loading-screen"
        >
          {/* Base Layer - Radial Gradient with Noise */}
          <div className="absolute inset-0 bg-black noise-overlay">
            <div className="absolute inset-0 bg-gradient-radial from-white/3 via-black to-black animate-radial-glow" />
          </div>

          {/* Mid Layer - Icon Particles Container */}
          <div className="relative flex items-center justify-center">
            {/* Icon Particle Layer - Floating App Icons (50+) */}
            {(() => {
              const floatingIcons = [
                // Payment & UPI
                QrCode, Send, Receipt, Wallet, CreditCard, PiggyBank, DollarSign, Coins, Banknote,
                // Bills & Utilities
                Smartphone, Droplet, Lightbulb, Zap, Wifi, Building2, Car,
                // Travel & Booking
                Plane, Train, Hotel, Calendar, Ticket, Map, Globe, Bike,
                // Food & Shopping
                UtensilsCrossed, ShoppingCart, Pill, Sparkles, Truck, Gift,
                // Finance & Investment
                TrendingUp, TrendingDown, BarChart3, PieChart, Target, Briefcase, Calculator,
                // Tools & Services
                Shield, FileText, Users, Activity, Bell, Heart, Award,
                // Entertainment & Lifestyle
                Film, PartyPopper, Dumbbell, BookOpen, Wrench, Crown,
                // Pro Tools & Analytics
                Gem, Newspaper, AlertCircle, Eye, EyeOff, ArrowRight, ChevronRight
              ];
              
              return [...Array(50)].map((_, i) => {
                const IconComponent = floatingIcons[i % floatingIcons.length];
                const angle = (i * 7.2) * Math.PI / 180;
                const layer = Math.floor(i / 10);
                const radius = 200 + layer * 110;
                const spiralOffset = (i % 10) * 36;
                const x = Math.cos(angle + spiralOffset * Math.PI / 180) * radius;
                const y = Math.sin(angle + spiralOffset * Math.PI / 180) * radius;
                const rotation = (i * 72) % 360;
                
                return (
                  <div
                    key={i}
                    className="absolute animate-particle-drift"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: '-12px',
                      marginTop: '-12px',
                      animationDelay: `${i * 40}ms`,
                      '--drift-x': `${x}px`,
                      '--drift-y': `${y}px`,
                      '--rotation': `${rotation}deg`,
                    } as React.CSSProperties}
                  >
                    <IconComponent className="h-5 w-5 text-white/50" strokeWidth={1.5} />
                  </div>
                );
              });
            })()}

            {/* Logo Layer - Center Focus with Entrance */}
            <div className="relative z-10 animate-logo-entrance" style={{ animationDelay: '150ms' }}>
              <div className="relative">
                {/* Glow Effect Behind Logo */}
                <div className="absolute inset-0 blur-3xl bg-white/15 rounded-full scale-150 animate-radial-glow" />
                <LoadingLogo size="xl" />
              </div>
            </div>
          </div>

          {/* Typography Layer - Brand Name */}
          <div className="absolute bottom-1/3 left-0 right-0 text-center">
            <h1 
              className="text-3xl font-light text-white tracking-widest animate-letter-reveal"
              style={{ animationDelay: '550ms' }}
            >
              Super Pay
            </h1>
            <p 
              className="text-xs text-white/60 font-light uppercase tracking-widest mt-2 animate-letter-reveal"
              style={{ animationDelay: '700ms' }}
            >
              Next-Gen Super UPI App
            </p>
          </div>
        </div>
      )}

      {/* Improved Fixed Header with Card-based Buttons */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-3 px-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-wider">Super Pay</h1>
            <p className="text-[10px] text-white/50 font-light tracking-widest">Hi Joshua</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/all-tickets")}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
              data-testid="button-all-tickets"
            >
              <Plane className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/transaction-history")}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
              data-testid="button-transaction-history"
            >
              <Receipt className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-trips")}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
              data-testid="button-my-trips"
            >
              <Ticket className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/notifications")}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-4 font-light tracking-wider"
              data-testid="button-profile"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Total Balance Card */}
        <div className="space-y-4">
          <div className="border border-white/20 p-6 bg-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-light">Total Balance</p>
                  <Badge className="bg-black/60 text-white border-white/20 text-xs font-light rounded-none">
                    <Star className="h-3 w-3 mr-1" />
                    2,850 pts
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  {balanceVisible ? (
                    <h2 className="text-4xl font-light tracking-tight text-white" data-testid="text-total-balance">
                      {formatCurrency(activeData.totalBalance)}
                    </h2>
                  ) : (
                    <h2 className="text-4xl font-light tracking-tight text-white" data-testid="text-hidden-balance">
                      ••••••••
                    </h2>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-white/60 hover:text-white hover:bg-white/10 p-2 h-8 w-8 rounded-none"
                    data-testid="button-toggle-balance"
                  >
                    {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="border border-white/20 rounded-none px-3 py-1.5 mb-2 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-white" />
                    <span className="text-sm text-white font-light">+8.2%</span>
                  </div>
                </div>
                <p className="text-white/40 text-xs font-light uppercase tracking-widest">This month</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
                <p className="text-xl font-light text-white" data-testid="text-monthly-income">
                  {formatCurrency(activeData.monthlyIncome)}
                </p>
                <p className="text-white/40 text-xs mt-1 font-light uppercase tracking-widest">Income</p>
              </div>
              <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
                <p className="text-xl font-light text-white" data-testid="text-monthly-expenses">
                  {formatCurrency(activeData.monthlyExpenses)}
                </p>
                <p className="text-white/40 text-xs mt-1 font-light uppercase tracking-widest">Expenses</p>
              </div>
              <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
                <p className="text-xl font-light text-white" data-testid="text-savings">
                  {formatCurrency(activeData.savingsThisMonth)}
                </p>
                <p className="text-white/40 text-xs mt-1 font-light uppercase tracking-widest">Savings</p>
              </div>
            </div>
          </div>

        </div>

        {/* Pay Now Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Pay Now</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: QrCode, title: "Scan & Pay", action: () => navigate("/upi-scanner") },
              { icon: Send, title: "Pay UPI ID", action: () => navigate("/upi-payment") },
              { icon: Receipt, title: "Pay Bills", action: () => navigate("/bill-payment") },
              { icon: Building2, title: "Bank Transfer", action: () => navigate("/bank-transfer") },
              { icon: Smartphone, title: "Mobile Recharge", action: () => navigate("/mobile-recharge") },
              { icon: ArrowRight, title: "Self Transfer", action: () => navigate("/self-transfer") },
              { icon: Car, title: "Fast Tag", action: () => navigate("/bill-payment/fastag") },
              { icon: CreditCard, title: "Credit UPI", action: () => navigate("/credit-upi") },
              { icon: PiggyBank, title: "Cash Park", action: () => navigate("/cash-park") },
              { icon: Users, title: "Family UPI", action: () => navigate("/family-upi") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-3 min-w-[90px] group"
                data-testid={`button-pay-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 w-full group-hover:bg-white/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-white mx-auto" strokeWidth={1} />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bills and Repayment Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Bills and Repayment</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: Smartphone, title: "Mobile Recharge", action: () => navigate("/mobile-recharge") },
              { icon: Zap, title: "DTH Recharge", action: () => navigate("/dth-recharge") },
              { icon: Droplet, title: "Water Bill", action: () => navigate("/bill-payment/water") },
              { icon: Lightbulb, title: "Electricity Bill", action: () => navigate("/bill-payment/electricity") },
              { icon: Zap, title: "Gas Bill", action: () => navigate("/bill-payment/gas") },
              { icon: Car, title: "FASTag Recharge", action: () => navigate("/bill-payment/fastag") },
              { icon: Wifi, title: "Broadband Bill", action: () => navigate("/bill-payment/broadband") },
              { icon: Building2, title: "Municipal Tax", action: () => navigate("/bill-payment/municipal") },
              { icon: Film, title: "OTT Subscription", action: () => navigate("/ott-subscription") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-3 min-w-[90px] group"
                data-testid={`button-bill-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 w-full group-hover:bg-white/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-white mx-auto" strokeWidth={1} />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Deliver Now - Featured Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Deliver Now</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/booking")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
              data-testid="button-view-all-food"
            >
              <span className="text-xs uppercase tracking-widest font-light">View All</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: UtensilsCrossed, title: "Hotel Food", desc: "30-40 min", action: () => navigate("/delivery-now/hotel-food") },
              { icon: ShoppingCart, title: "Supermart", desc: "10-15 min", action: () => navigate("/delivery-now/supermart") },
              { icon: Pill, title: "Medicine", desc: "15-20 min", action: () => navigate("/delivery-now/medicine") },
              { icon: Smartphone, title: "Electronics", desc: "30-45 min", action: () => navigate("/delivery-now/electronics") },
              { icon: Sparkles, title: "Beauty", desc: "20-30 min", action: () => navigate("/delivery-now/beauty") },
              { icon: Truck, title: "Pick & Drop", desc: "Same day", action: () => navigate("/delivery-now/courier") },
              { icon: ShoppingCart, title: "SwapNow", desc: "Buy & Sell", action: () => navigate("/swap-now/explore") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-3 min-w-[90px] group"
                data-testid={`button-food-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 w-full group-hover:bg-white/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-white mx-auto" strokeWidth={1} />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Holdings - Card Based Design */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Today's Holdings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/investment")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
              data-testid="button-view-holdings"
            >
              <span className="text-xs uppercase tracking-widest font-light">View All</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/60 border border-white/20 p-5 backdrop-blur-xl relative">
              <div className="mb-3">
                <p className="text-2xl font-light text-white mb-1" data-testid="text-total-holdings">
                  {formatCurrency(activeData.todaysHoldings)}
                </p>
                <p className="text-white/40 text-xs font-light uppercase tracking-widest">Total Holdings</p>
              </div>
              <div className={`absolute bottom-3 right-3 rounded-none px-2 py-1 ${activeData.todaysProfitPercentage >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                <div className="flex items-center gap-1">
                  {activeData.todaysProfitPercentage >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-white" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-white" />
                  )}
                  <span className="text-xs text-white font-light">
                    {activeData.todaysProfitPercentage >= 0 ? '+' : ''}{activeData.todaysProfitPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-black/60 border border-white/20 p-5 backdrop-blur-xl relative">
              <div className="mb-3">
                <p className="text-2xl font-light text-white mb-1" data-testid="text-total-profit">
                  {formatCurrency(Math.abs(activeData.todaysProfit))}
                </p>
                <p className="text-white/40 text-xs font-light uppercase tracking-widest">Total Profit</p>
              </div>
              <div className={`absolute bottom-3 right-3 rounded-none px-2 py-1 ${activeData.investmentGainsPercentage >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                <div className="flex items-center gap-1">
                  {activeData.investmentGainsPercentage >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-white" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-white" />
                  )}
                  <span className="text-xs text-white font-light">
                    {activeData.investmentGainsPercentage >= 0 ? '+' : ''}{activeData.investmentGainsPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invest Now Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Invest Now</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: TrendingUpIcon, title: "Stock Invest", action: () => navigate("/investment/stocks") },
              { icon: Coins, title: "Crypto Invest", action: () => navigate("/investment/crypto") },
              { icon: Award, title: "Gold Invest", action: () => navigate("/investment/gold/providers") },
              { icon: Gem, title: "Silver Invest", action: () => navigate("/investment/silver/providers") },
              { icon: Gem, title: "Diamond Invest", action: () => navigate("/investment/diamond/providers") },
              { icon: BarChart3, title: "Mutual Funds", action: () => navigate("/investment/mutual-funds") },
              { icon: Banknote, title: "FD", action: () => navigate("/investment/fd") },
              { icon: Target, title: "SIP", action: () => navigate("/investment/sip") },
              { icon: PieChart, title: "SWP", action: () => navigate("/investment/swp") },
              { icon: Activity, title: "STP", action: () => navigate("/investment/stp") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-3 min-w-[90px] group"
                data-testid={`button-invest-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 w-full group-hover:bg-white/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-white mx-auto" strokeWidth={1} />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Book Now Section - Black & White Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Book Now</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/booking")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
              data-testid="button-view-all-booking"
            >
              <span className="text-xs uppercase tracking-widest font-light">View All</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: Hotel, title: "Hotel Booking", action: () => navigate("/booking/hotel/search") },
              { icon: Train, title: "Metro Booking", action: () => navigate("/booking/metro/search") },
              { icon: Film, title: "Movie Booking", action: () => navigate("/booking/movie/search") },
              { icon: Calendar, title: "Event Booking", action: () => navigate("/booking/event/search") },
              { icon: Train, title: "Train Booking", action: () => navigate("/booking/train/search") },
              { icon: Plane, title: "Flight Booking", action: () => navigate("/booking/flight/search") },
              { icon: Car, title: "Cab & Auto Booking", action: () => navigate("/booking/cab/search") },
              { icon: Car, title: "Rental Booking", action: () => navigate("/booking/rental/search") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-3 min-w-[90px] group"
                data-testid={`button-book-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 w-full group-hover:bg-white/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-white mx-auto" strokeWidth={1} />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Market News Autoscroll - 16:9 Aspect Ratio */}
        <MarketNewsAutoscroll />

        {/* Services Section - Black & White Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Services</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/consultant/explore")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
              data-testid="button-view-all-services"
            >
              <span className="text-xs uppercase tracking-widest font-light">View All</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: Globe, title: "All", tab: "all", action: () => navigate("/consultant/explore?tab=all") },
              { icon: Heart, title: "Medical", tab: "medical", action: () => navigate("/consultant/explore?tab=medical") },
              { icon: Dumbbell, title: "Health & Wellness", tab: "health-wellness", action: () => navigate("/consultant/explore?tab=health-wellness") },
              { icon: Sparkles, title: "Personal Care & Beauty", tab: "personal-care", action: () => navigate("/consultant/explore?tab=personal-care") },
              { icon: Wrench, title: "Home, Repair & Electronics", tab: "home-repair", action: () => navigate("/consultant/explore?tab=home-repair") },
              { icon: Car, title: "Automotive & Mobility", tab: "automotive", action: () => navigate("/consultant/explore?tab=automotive") },
              { icon: Briefcase, title: "Professional & Business Services", tab: "professional", action: () => navigate("/consultant/explore?tab=professional") },
              { icon: UtensilsCrossed, title: "Food & Hospitality", tab: "food-hospitality", action: () => navigate("/consultant/explore?tab=food-hospitality") },
              { icon: BookOpen, title: "Education & Training", tab: "education", action: () => navigate("/consultant/explore?tab=education") },
              { icon: PartyPopper, title: "Entertainment & Events", tab: "entertainment", action: () => navigate("/consultant/explore?tab=entertainment") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-3 min-w-[90px] group"
                data-testid={`button-service-${item.title.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '').replace(/&/g, 'and')}`}
              >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 w-full group-hover:bg-white/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-white mx-auto" strokeWidth={1} />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* My Fin Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">My Fin</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: CreditCard, title: "My Loans", action: () => navigate("/my-loans") },
              { icon: TrendingUpIcon, title: "My Investments", action: () => navigate("/my-investments") },
              { icon: Receipt, title: "My Bills", action: () => navigate("/my-bills") },
              { icon: Map, title: "My Trips", action: () => navigate("/my-trips") },
              { icon: Calculator, title: "My EMIs", action: () => navigate("/my-emis") },
              { icon: History, title: "My Pay History", action: () => navigate("/my-pay-history") },
              { icon: Activity, title: "My Transactions", action: () => navigate("/upi-history") },
              { icon: CreditCard, title: "My Cards", action: () => navigate("/my-cards") },
              { icon: Building2, title: "My Bank Accounts", action: () => navigate("/my-bank-accounts") },
              { icon: Shield, title: "My Insurance", action: () => navigate("/my-insurance") },
              { icon: Gift, title: "My Rewards", action: () => navigate("/my-rewards") },
              { icon: Users, title: "My Referrals", action: () => navigate("/my-referrals") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 hover:bg-white/10 transition-all flex flex-col items-center gap-3"
                data-testid={`button-myfin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-black/80 border border-white/20 p-2.5">
                  <item.icon className="h-5 w-5 text-white stroke-[1]" />
                </div>
                <span className="text-xs text-white/90 font-light text-center leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TravelVIP Promotional Card - Modern Pro Design */}
        <div className="border-b border-white/10 cursor-pointer hover:border-white transition-all bg-white/5 hover:bg-white/10" onClick={() => navigate("/travelvip")} data-testid="card-travelvip">
          <div className="p-6 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-white/60" strokeWidth={1} />
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase">TravelVIP</h3>
                  <Badge className="bg-black/60 text-white border-white/30 rounded-none font-light text-[10px] px-2 py-0.5">
                    NEW
                  </Badge>
                </div>
                <p className="text-xs text-white/40 font-light uppercase tracking-widest">Premium Membership</p>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-5 border-l-2 border-white/20 pl-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-light text-white">₹299</span>
                <span className="text-xs text-white/40 font-light uppercase tracking-wider">/month</span>
              </div>
              <p className="text-xs text-white/50 font-light tracking-wide">Save up to ₹6,000 annually</p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="border border-white/10 p-3 bg-black/80">
                <Plane className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Flights</p>
              </div>
              <div className="border border-white/10 p-3 bg-black/80">
                <Train className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Trains</p>
              </div>
              <div className="border border-white/10 p-3 bg-black/80">
                <Hotel className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Hotels</p>
              </div>
            </div>

            {/* Key Features List */}
            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                <p className="text-xs text-white/60 font-light">Priority access & faster boarding</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                <p className="text-xs text-white/60 font-light">Exclusive discounts up to 25%</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                <p className="text-xs text-white/60 font-light">Free cancellation & rescheduling</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-white font-light uppercase tracking-widest">View All Benefits</span>
              <ChevronRight className="h-4 w-4 text-white/40" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Insurance & Loans - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Insurance & Loans</h2>
          <div className="space-y-3">
            {[
              { icon: Briefcase, title: "Loan Market Place", subtitle: "Compare & apply for loans", action: () => navigate("/marketplace") },
              { icon: Bike, title: "Bike Insurance", subtitle: "Comprehensive coverage", action: () => navigate("/insurance?type=bike") },
              { icon: Car, title: "Car Insurance", subtitle: "Drive with confidence", action: () => navigate("/insurance?type=car") },
              { icon: Shield, title: "Health Insurance", subtitle: "Protect your family", action: () => navigate("/insurance?type=health") },
              { icon: HomeIcon, title: "Home Insurance", subtitle: "Secure your assets", action: () => navigate("/insurance?type=home") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-4 bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all backdrop-blur-xl"
                data-testid={`button-insurance-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-black/80 border border-white/20 p-3 flex-shrink-0">
                  <item.icon className="h-6 w-6 text-white stroke-[1]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-light tracking-wide">{item.title}</p>
                  <p className="text-xs text-white/60 font-light mt-0.5">{item.subtitle}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* My Loans Card - Improved Visual Hierarchy */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">My Loans</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-loans")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
              data-testid="button-view-all-loans"
            >
              <span className="text-xs uppercase tracking-widest font-light">View All</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="bg-black/60 border border-white/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <Badge className="bg-black/60 text-white border-white/30 rounded-none font-light mb-2 text-xs backdrop-blur-sm">
                  PERSONAL LOAN
                </Badge>
                <p className="text-white font-light text-lg tracking-wide">Next EMI</p>
              </div>
              <div className="bg-black/80 border border-white/20 rounded-none px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs text-white/80 font-light uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-light text-white mb-1" data-testid="text-next-emi">
                  {formatCurrency(nextEmiAmount)}
                </p>
                <p className="text-white/40 text-xs font-light uppercase tracking-widest">EMI Amount</p>
              </div>
              <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
                <p className="text-lg font-light text-white/60 mb-1">Overdue by</p>
                <p className="text-xl font-light text-white" data-testid="text-overdue-days">596 days</p>
              </div>
            </div>
            <div className="bg-black/80 border border-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs font-light uppercase tracking-widest">Outstanding</p>
                <p className="text-2xl font-light text-white" data-testid="text-outstanding">
                  {formatCurrency(outstandingAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit UPI Feature Card - Compact */}
        <div className="border-b border-white/10 cursor-pointer hover:border-white transition-all bg-white/5 hover:bg-white/10" onClick={() => navigate("/credit-upi")} data-testid="card-credit-upi">
          <div className="p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-white/60" strokeWidth={1} />
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">CREDIT UPI</h3>
                <Badge className="bg-black/60 text-white border-white/30 rounded-none font-light text-[10px] px-2 py-0.5">
                  PRE-APPROVED
                </Badge>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40" strokeWidth={1} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-light text-white">₹1K - ₹1L</span>
              <span className="text-xs text-white/50 font-light">• 15 days interest-free</span>
            </div>
          </div>
        </div>

        {/* Cash Park Feature Card */}
        <div className="border-b border-white/10 cursor-pointer hover:border-white transition-all bg-white/5 hover:bg-white/10" onClick={() => navigate("/cash-park")} data-testid="card-cash-park">
          <div className="p-6 relative">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="h-5 w-5 text-white/60" strokeWidth={1} />
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase">CASH PARK</h3>
                  <Badge className="bg-black/60 text-white border-white/30 rounded-none font-light text-[10px] px-2 py-0.5">
                    NEW
                  </Badge>
                </div>
                <p className="text-xs text-white/40 font-light uppercase tracking-widest">Auto-Sweep Savings</p>
              </div>
            </div>

            <div className="mb-5 border-l-2 border-white/20 pl-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-light text-white">7.25%</span>
                <span className="text-xs text-white/40 font-light uppercase tracking-wider">p.a. interest</span>
              </div>
              <p className="text-xs text-white/50 font-light tracking-wide">100% liquidity with FD returns</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="border border-white/10 p-3 bg-black/80">
                <DollarSign className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">High Interest</p>
              </div>
              <div className="border border-white/10 p-3 bg-black/80">
                <Zap className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Auto-Sweep</p>
              </div>
              <div className="border border-white/10 p-3 bg-black/80">
                <TrendingUp className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Liquid</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                <p className="text-xs text-white/60 font-light">Earn FD interest with complete liquidity</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                <p className="text-xs text-white/60 font-light">No penalty on withdrawal anytime</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                <p className="text-xs text-white/60 font-light">Automatic sweep when balance exceeds threshold</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-white font-light uppercase tracking-widest">Activate Now</span>
              <ChevronRight className="h-4 w-4 text-white/40" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Other Tools - Card Based Grid with Glassmorphic Icons */}
        <div className="pb-6">
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Other Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BarChart3, title: "CreditPro Report", action: () => navigate("/myreport") },
              { icon: PieChart, title: "Perfect Finance", action: () => navigate("/my-personal-finance-dashboard") },
              { icon: Calculator, title: "Repayment Calculator", action: () => navigate("/repayment-calculator") },
              { icon: Calculator, title: "Budget Planner", action: () => navigate("/budget-planner") },
              { icon: Target, title: "Goal Tracker", action: () => navigate("/goal-tracker") },
              { icon: Receipt, title: "Expense Tracker", action: () => navigate("/expense-tracker") },
              { icon: Lightbulb, title: "FinAdvisor", action: () => navigate("/pro-tools") },
              { icon: Shield, title: "Loan Spam Detector", action: () => navigate("/pro-tools") },
              { icon: AlertCircle, title: "Avoid fraud & scams", action: () => navigate("/support") },
              { icon: FileText, title: "Learn Karo", action: () => navigate("/learn") },
              { icon: Users, title: "Creator Connect", action: () => navigate("/creator-connect") },
              { icon: User, title: "Expert consultations", action: () => navigate("/support") },
              { icon: Activity, title: "FitFinance", action: () => navigate("/fitness") },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="bg-white/5 border border-white/20 p-4 hover:bg-white/10 hover:scale-[1.02] transition-all flex items-center gap-3 backdrop-blur-sm"
                data-testid={`button-tool-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-none p-2.5">
                  <item.icon className="h-5 w-5 text-white stroke-[1.5]" />
                </div>
                <span className="text-xs text-white/90 font-light text-left flex-1">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
