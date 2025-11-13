import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Search,
  ScanLine,
  Send,
  Smartphone,
  Building2,
  ArrowRightLeft,
  Zap,
  Tv,
  Droplets,
  Home,
  Wifi,
  Car,
  Train,
  FileText,
  CreditCard,
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PiggyBank,
  Shield,
  Award,
  Heart,
  Users,
  BookOpen,
  Target,
  MessageCircle,
  Repeat,
  Gift,
  Plane,
  Landmark,
  Wallet,
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  Crown,
  Sparkles,
  Popcorn,
  Calendar,
  ChevronRight,
  Percent,
  Receipt,
  Activity,
  Hotel,
  Music,
  Diamond,
  FileClock,
  Briefcase,
  Newspaper,
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Truck
} from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  category: string;
  isPremium?: boolean;
  isNew?: boolean;
}

export default function ProTools() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Comprehensive list of ALL tools and features
  const allTools: Tool[] = [
    // ShareWise - Split Expenses
    {
      id: "sharewise",
      title: "ShareWise",
      description: "Split expenses with friends",
      icon: Users,
      route: "/sharewise/groups",
      category: "tools",
      isPremium: true,
      isNew: true
    },
    {
      id: "booksure",
      title: "BookSure",
      description: "Expert consultant bookings",
      icon: Calendar,
      route: "/consultant/explore",
      category: "premium",
      isPremium: true,
      isNew: true
    },
    {
      id: "coupon-mart-premium",
      title: "Coupon Mart",
      description: "Trade & sell coupons marketplace",
      icon: Repeat,
      route: "/coupon-mart",
      category: "premium",
      isPremium: true,
      isNew: true
    },
    {
      id: "fitfinance",
      title: "FitFinance",
      description: "Health-financial wellness",
      icon: Heart,
      route: "/fitness",
      category: "premium",
      isPremium: true,
      isNew: true
    },
    {
      id: "swapnow",
      title: "SwapNow",
      description: "Buy & sell used goods marketplace",
      icon: Package,
      route: "/swap-now/explore",
      category: "premium",
      isPremium: true,
      isNew: true
    },
    
    // News & Market Updates
    {
      id: "market-news",
      title: "Market News",
      description: "Real-time market updates & analysis",
      icon: Newspaper,
      route: "/market-news",
      category: "news",
      isNew: true
    },
    
    // Loan Marketplace
    {
      id: "loan-marketplace",
      title: "Loan Marketplace",
      description: "Compare & apply for loans",
      icon: ShoppingBag,
      route: "/marketplace",
      category: "loans",
      isPremium: true
    },
    
    // Credit Card Marketplace
    {
      id: "credit-card-marketplace",
      title: "Credit Card Marketplace",
      description: "Compare & apply for credit cards",
      icon: CreditCard,
      route: "/credit-card-marketplace",
      category: "loans",
      isPremium: true,
      isNew: true
    },
    
    // Payment & Transfer
    {
      id: "scan-pay",
      title: "Scan & Pay",
      description: "Quick QR code payments",
      icon: ScanLine,
      route: "/upi-scanner",
      category: "payment"
    },
    {
      id: "credit-upi",
      title: "Credit UPI",
      description: "Pre-approved credit line",
      icon: CreditCard,
      route: "/credit-upi",
      category: "payment",
      isPremium: true,
      isNew: true
    },
    {
      id: "family-upi",
      title: "Family UPI",
      description: "Shared family accounts",
      icon: Users,
      route: "/family-upi",
      category: "payment",
      isPremium: true,
      isNew: true
    },
    {
      id: "cash-park",
      title: "Cash Park",
      description: "Auto-sweep savings at 7.25%",
      icon: PiggyBank,
      route: "/cash-park",
      category: "investment",
      isPremium: true,
      isNew: true
    },
    {
      id: "bank-transfer",
      title: "Bank Account",
      description: "Transfer to bank account",
      icon: Building2,
      route: "/bank-transfer",
      category: "payment"
    },
    
    // Premium Financial Tools (Starting from position 14)
    {
      id: "budget-planner",
      title: "Budget Planner",
      description: "Plan & manage monthly budget",
      icon: Calculator,
      route: "/budget-planner",
      category: "tools",
      isNew: true
    },
    {
      id: "goal-tracker",
      title: "Goal Tracker",
      description: "Track financial goals",
      icon: Target,
      route: "/goal-tracker",
      category: "tools",
      isNew: true
    },
    {
      id: "expense-tracker",
      title: "Expense Tracker",
      description: "Monitor spending habits",
      icon: TrendingDown,
      route: "/expense-tracker",
      category: "tools",
      isNew: true
    },
    {
      id: "health-insurance",
      title: "Health Insurance",
      description: "Medical insurance plans",
      icon: Heart,
      route: "/insurance",
      category: "insurance"
    },
    {
      id: "myreport",
      title: "CreditPro Report",
      description: "Boost credit score +30 points",
      icon: TrendingUp,
      route: "/myreport",
      category: "premium",
      isPremium: true,
      isNew: true
    },
    {
      id: "mypath",
      title: "Perfect Finance",
      description: "Pay debts 2x faster",
      icon: Target,
      route: "/mypath",
      category: "premium",
      isPremium: true
    },
    {
      id: "repayment-calc",
      title: "Repayment Calculator",
      description: "Reduce EMIs by 35%",
      icon: Calculator,
      route: "/repayment-calculator",
      category: "premium",
      isPremium: true
    },
    {
      id: "finadvisor",
      title: "FinAdvisor",
      description: "24/7 AI financial coach",
      icon: MessageCircle,
      route: "/coach",
      category: "premium",
      isPremium: true,
      isNew: true
    },
    {
      id: "spam-detector",
      title: "Loan Spam Detector",
      description: "Avoid fraud & scams",
      icon: Shield,
      route: "/security",
      category: "premium",
      isPremium: true
    },
    {
      id: "learn-karo",
      title: "Learn Karo",
      description: "Financial education",
      icon: BookOpen,
      route: "/learn",
      category: "premium",
      isPremium: true
    },
    {
      id: "creator-connect",
      title: "Creator Connect",
      description: "Expert consultations",
      icon: Users,
      route: "/creator-connect",
      category: "premium",
      isPremium: true
    },
    
    {
      id: "self-transfer",
      title: "Self Transfer",
      description: "Transfer between accounts",
      icon: ArrowRightLeft,
      route: "/self-transfer",
      category: "payment"
    },
    
    // Bills & Recharge
    {
      id: "mobile-recharge",
      title: "Mobile Recharge",
      description: "Prepaid & postpaid recharge",
      icon: Smartphone,
      route: "/bill-payment/mobile",
      category: "bills"
    },
    {
      id: "dth-recharge",
      title: "DTH Recharge",
      description: "TV & set-top box recharge",
      icon: Tv,
      route: "/bill-payment/dth",
      category: "bills"
    },
    {
      id: "electricity",
      title: "Pay Bills",
      description: "Electricity bill payment",
      icon: Zap,
      route: "/bill-payment/electricity",
      category: "bills"
    },
    {
      id: "water-bill",
      title: "Water Bill",
      description: "Municipal water bill",
      icon: Droplets,
      route: "/bill-payment/water",
      category: "bills"
    },
    {
      id: "gas-bill",
      title: "Gas Bill",
      description: "Pipeline gas bill payment",
      icon: Home,
      route: "/bill-payment/gas",
      category: "bills"
    },
    {
      id: "broadband",
      title: "Broadband Bill",
      description: "Internet & WiFi bills",
      icon: Wifi,
      route: "/bill-payment/broadband",
      category: "bills"
    },
    {
      id: "fastag",
      title: "FASTag Recharge",
      description: "Toll payments made easy",
      icon: Car,
      route: "/bill-payment/fastag",
      category: "bills"
    },
    {
      id: "municipal-tax",
      title: "Municipal Tax",
      description: "Property & municipal taxes",
      icon: Building2,
      route: "/bill-payment/municipal",
      category: "bills"
    },
    {
      id: "ott-subscription",
      title: "OTT Subscription",
      description: "Streaming services payment",
      icon: Tv,
      route: "/bill-payment/ott",
      category: "bills"
    },
    {
      id: "all-bills",
      title: "All Bills",
      description: "View all bill payments",
      icon: FileText,
      route: "/bill-payment",
      category: "bills"
    },
    
    // Loans
    {
      id: "my-loans",
      title: "My Loans",
      description: "All loans & repayments",
      icon: CreditCard,
      route: "/my-loans",
      category: "loans"
    },
    {
      id: "emi-calculator",
      title: "EMI Calculator",
      description: "Calculate loan EMI",
      icon: Calculator,
      route: "/emi-calculator",
      category: "loans"
    },
    {
      id: "transaction-history",
      title: "Transaction History",
      description: "Track all payments, EMIs & dues",
      icon: FileText,
      route: "/transaction-history",
      category: "loans"
    },
    
    // Investments
    {
      id: "stock-invest",
      title: "Stock Invest",
      description: "Trade stocks & equities",
      icon: BarChart3,
      route: "/investment/stocks",
      category: "investment"
    },
    {
      id: "gold-invest",
      title: "Gold Invest",
      description: "Invest in digital gold",
      icon: Award,
      route: "/investment/gold",
      category: "investment"
    },
    {
      id: "silver-invest",
      title: "Silver Invest",
      description: "Invest in digital silver",
      icon: Star,
      route: "/investment/silver",
      category: "investment"
    },
    {
      id: "diamond-invest",
      title: "Diamond Invest",
      description: "Premium diamond investments",
      icon: Diamond,
      route: "/investment/diamond",
      category: "investment",
      isPremium: true
    },
    {
      id: "crypto-invest",
      title: "Crypto Invest",
      description: "Trade cryptocurrencies",
      icon: DollarSign,
      route: "/investment/crypto",
      category: "investment"
    },
    {
      id: "mutual-funds",
      title: "Mutual Funds",
      description: "Invest in mutual funds",
      icon: TrendingUp,
      route: "/investment/mutual-funds",
      category: "investment"
    },
    {
      id: "fd-invest",
      title: "FD",
      description: "Fixed deposits & high returns",
      icon: Briefcase,
      route: "/investment/fd",
      category: "investment"
    },
    {
      id: "sip-plans",
      title: "SIP Plans",
      description: "Start systematic investments",
      icon: Repeat,
      route: "/investment/sip",
      category: "investment"
    },
    {
      id: "swp-plans",
      title: "SWP Plans",
      description: "Systematic withdrawal plans",
      icon: TrendingDown,
      route: "/investment/swp",
      category: "investment",
      isNew: true
    },
    {
      id: "stp-plans",
      title: "STP Plans",
      description: "Systematic transfer plans",
      icon: ArrowRightLeft,
      route: "/investment/stp",
      category: "investment",
      isNew: true
    },
    {
      id: "my-investments",
      title: "My Investments",
      description: "View portfolio",
      icon: PiggyBank,
      route: "/my-investments",
      category: "investment"
    },
    
    // Travel & Tickets
    {
      id: "hotel-booking",
      title: "Hotel",
      description: "Book hotels & resorts",
      icon: Hotel,
      route: "/booking/hotel/search",
      category: "bookings",
      isNew: true
    },
    {
      id: "movie-tickets",
      title: "Movie",
      description: "Cinema bookings",
      icon: Popcorn,
      route: "/booking/movie/search",
      category: "bookings",
      isNew: true
    },
    {
      id: "event-tickets",
      title: "Event",
      description: "Concerts & shows",
      icon: Music,
      route: "/booking/event/search",
      category: "bookings",
      isNew: true
    },
    {
      id: "metro-booking",
      title: "Metro",
      description: "Metro tickets",
      icon: Train,
      route: "/booking/metro/search",
      category: "bookings",
      isNew: true
    },
    {
      id: "cabs-auto",
      title: "Cabs & Auto",
      description: "Book rides",
      icon: Car,
      route: "/booking/cab/search",
      category: "bookings",
      isNew: true
    },
    {
      id: "rental-booking",
      title: "Rental",
      description: "Car & bike rentals",
      icon: Car,
      route: "/booking/rental/search",
      category: "bookings",
      isNew: true
    },
    {
      id: "flight-booking",
      title: "Flight",
      description: "Domestic & international",
      icon: Plane,
      route: "/booking/flight/search",
      category: "bookings"
    },
    {
      id: "train-booking",
      title: "Train",
      description: "Railway bookings",
      icon: Train,
      route: "/booking/train/search",
      category: "bookings"
    },
    {
      id: "bus-booking",
      title: "Bus",
      description: "Bus tickets",
      icon: Landmark,
      route: "/booking/bus/search",
      category: "bookings"
    },
    {
      id: "travel",
      title: "My Bookings",
      description: "Travel history & bookings",
      icon: Plane,
      route: "/all-tickets",
      category: "travel"
    },
    {
      id: "trip-now",
      title: "Trip Now",
      description: "End-to-end travel packages",
      icon: Package,
      route: "/trip-now",
      category: "travel",
      isNew: true
    },
    {
      id: "courier",
      title: "Pick & Drop",
      description: "Courier delivery service",
      icon: Truck,
      route: "/booking/courier/search",
      category: "bookings",
      isNew: true
    },
    
    // Food Deliver Now
    {
      id: "delivery-now-hub",
      title: "Food Deliver Now",
      description: "Food & essentials in 10-45 min",
      icon: UtensilsCrossed,
      route: "/delivery-now",
      category: "food",
      isNew: true
    },
    {
      id: "hotel-food",
      title: "Hotel Food",
      description: "Order from restaurants",
      icon: UtensilsCrossed,
      route: "/delivery-now/hotel-food",
      category: "food",
      isNew: true
    },
    {
      id: "supermart",
      title: "Supermart",
      description: "Groceries in 10 minutes",
      icon: ShoppingCart,
      route: "/delivery-now/supermart",
      category: "food",
      isNew: true
    },
    {
      id: "medicine",
      title: "Medicine",
      description: "Pharmacy & healthcare",
      icon: Pill,
      route: "/delivery-now/medicine",
      category: "food",
      isNew: true
    },
    {
      id: "food-orders",
      title: "My Food Orders",
      description: "View order history",
      icon: Receipt,
      route: "/delivery-now/orders",
      category: "food"
    },
    
    // Insurance
    {
      id: "car-insurance",
      title: "Car Insurance",
      description: "Get car insurance",
      icon: Car,
      route: "/insurance",
      category: "insurance"
    },
    {
      id: "bike-insurance",
      title: "Bike Insurance",
      description: "Two wheeler insurance",
      icon: Car,
      route: "/insurance",
      category: "insurance"
    },
    {
      id: "home-insurance",
      title: "Home Insurance",
      description: "Protect your home",
      icon: Home,
      route: "/insurance",
      category: "insurance"
    },
    
    // Other Features
    {
      id: "cibil-checker",
      title: "CIBIL Score",
      description: "Check credit score",
      icon: BarChart3,
      route: "/cibil-checker",
      category: "tools"
    },
    {
      id: "bank-accounts",
      title: "Bank Accounts",
      description: "Manage linked accounts",
      icon: Landmark,
      route: "/my-bank-accounts",
      category: "tools"
    },
    {
      id: "rewards",
      title: "My Rewards",
      description: "Points & benefits",
      icon: Award,
      route: "/my-rewards",
      category: "tools"
    },
    {
      id: "referral",
      title: "My Referrals",
      description: "Invite & earn",
      icon: Users,
      route: "/my-referrals",
      category: "tools"
    },
    {
      id: "coupons",
      title: "Coupons & Cashbacks",
      description: "Active offers",
      icon: Percent,
      route: "/profile/coupons",
      category: "tools"
    },
    {
      id: "my-bills",
      title: "My Bills",
      description: "Upcoming & paid bills",
      icon: Receipt,
      route: "/my-bills",
      category: "tools"
    },
    {
      id: "my-cards",
      title: "My Cards",
      description: "Saved cards",
      icon: CreditCard,
      route: "/my-cards",
      category: "tools"
    },
    {
      id: "my-trips",
      title: "My Trips",
      description: "Travel bookings & history",
      icon: Plane,
      route: "/my-trips",
      category: "travel"
    },
    {
      id: "my-emis",
      title: "My EMIs",
      description: "Track EMI payments",
      icon: Calendar,
      route: "/my-emis",
      category: "loans"
    },
    {
      id: "my-pay-history",
      title: "My Pay History",
      description: "Payment history & receipts",
      icon: FileClock,
      route: "/my-pay-history",
      category: "bills"
    },
    {
      id: "activity",
      title: "Activity",
      description: "Security & audit log",
      icon: Activity,
      route: "/my-activity",
      category: "tools"
    },
    {
      id: "stock-history",
      title: "Stock Purchase History",
      description: "Trade history & P/L",
      icon: TrendingUp,
      route: "/profile/stock-history",
      category: "tools"
    },
    {
      id: "pay-upi",
      title: "Pay UPI ID",
      description: "Send money via UPI ID",
      icon: Send,
      route: "/upi-payment",
      category: "payment"
    },
    {
      id: "upi-collect",
      title: "Collect",
      description: "Request money via UPI",
      icon: Repeat,
      route: "/upi-collect",
      category: "payment"
    }
  ];

  const categories = [
    { id: "all", label: "All", emoji: "✨" },
    { id: "payment", label: "Payments", emoji: "💳" },
    { id: "bills", label: "Bills", emoji: "⚡" },
    { id: "loans", label: "Loans", emoji: "🏦" },
    { id: "investment", label: "Invest", emoji: "📈" },
    { id: "insurance", label: "Insurance", emoji: "🛡️" },
    { id: "bookings", label: "Bookings", emoji: "🎫" },
    { id: "travel", label: "Travel", emoji: "✈️" },
    { id: "food", label: "Food", emoji: "🍔" },
    { id: "premium", label: "Premium", emoji: "👑" },
    { id: "news", label: "News", emoji: "📰" },
    { id: "tools", label: "Tools", emoji: "🔧" }
  ];

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white">Tools</h1>
              <p className="text-sm text-white/50 mt-0.5">{allTools.length} features available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools..."
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-tools"
            />
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto scrollbar-hide border-t border-white/10 -mx-4 px-4">
            <div className="flex gap-0 min-w-max">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-4 border-b-2 transition-all duration-200 ease-in-out",
                      isActive
                        ? "border-white text-white bg-white/10 scale-[1.06]"
                        : "border-transparent text-white/60 hover:text-white/90"
                    )}
                    data-testid={`button-category-${cat.id}`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-52 px-4 pb-8">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-white/40">
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="border border-white/10 rounded-xl p-12 text-center bg-white/5">
            <Search className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tools found</h3>
            <p className="text-white/50 mb-4">Try a different search or category</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-lg"
              data-testid="button-clear-search"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filteredTools.map((tool) => {
                const ToolIcon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => navigate(tool.route)}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all text-center relative"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    {/* Badges in corners */}
                    {tool.isPremium && (
                      <Crown className="h-3.5 w-3.5 text-yellow-500 absolute top-2 left-2" />
                    )}
                    {tool.isNew && (
                      <Badge className="bg-green-500/10 text-green-500 border-0 h-5 px-1.5 text-[10px] rounded-md absolute top-2 right-2">
                        NEW
                      </Badge>
                    )}
                    
                    <div className="flex flex-col items-center justify-center gap-3 h-full">
                      {/* Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        tool.isPremium 
                          ? "bg-yellow-500/10 text-yellow-500" 
                          : "bg-white/10 text-white group-hover:bg-white/15"
                      )}>
                        <ToolIcon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      
                      {/* Content */}
                      <div className="w-full text-center">
                        <h3 className="text-sm font-medium text-white line-clamp-1 mb-1">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
