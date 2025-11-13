import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Smartphone, 
  Tv, 
  Zap, 
  Calculator,
  TrendingUp,
  Building2,
  Briefcase,
  Shield,
  Gift,
  FileText,
  BarChart3,
  Target,
  Activity,
  MessageCircle,
  Crown,
  Send,
  QrCode,
  Receipt,
  CreditCard,
  Coffee,
  Award,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  Heart,
  Wallet,
  PiggyBank,
  Banknote,
  Car,
  Filter,
  Clock,
  Flame,
  CheckCircle,
  ExternalLink,
  Home,
  Plane,
  Calendar,
  History,
  Globe,
  Headphones,
  Settings,
  Bell,
  MapPin,
  ShoppingCart,
  Gamepad2,
  Music,
  Video,
  Book,
  GraduationCap,
  Eye,
  EyeOff,
  RefreshCw,
  Hexagon
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: any;
  category: string;
  subcategory?: string;
  route: string;
  isPremium?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  color: string;
  bgGradient?: string;
  tags?: string[];
  rating?: number;
  users?: string;
  cashback?: string;
  features?: string[];
}

export default function ViewAllServices() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Comprehensive enhanced services list
  const allServices: Service[] = [
    // Financial & Banking Services
    {
      id: "upi-payment",
      title: "UPI Payments",
      description: "Send & receive money instantly",
      longDescription: "Instant money transfers to anyone with UPI, bill payments, and merchant transactions",
      icon: Send,
      category: "financial",
      subcategory: "payments",
      route: "/upi-payment",
      color: "bg-white/10",
      bgGradient: "from-blue-500 to-cyan-500",
      isPopular: true,
      isTrending: true,
      tags: ["upi", "payments", "instant", "free"],
      rating: 4.8,
      users: "50M+",
      cashback: "Up to ₹100",
      features: ["24/7 Support", "Zero Fees", "Instant Transfer", "Bank Integration"]
    },
    {
      id: "investment-platform",
      title: "Investment Hub",
      description: "Stocks, mutual funds & gold investment",
      longDescription: "Complete investment platform with stocks, mutual funds, SIP, gold, and advanced analytics",
      icon: TrendingUp,
      category: "financial",
      subcategory: "investments",
      route: "/investment",
      color: "bg-white/10",
      bgGradient: "from-green-600 to-white/5",
      isPopular: true,
      tags: ["stocks", "mutual-funds", "sip", "gold", "etf"],
      rating: 4.7,
      users: "10M+",
      features: ["Zero Brokerage", "Expert Research", "SIP Automation", "Tax Optimization"]
    },
    {
      id: "loan-services",
      title: "Loan Center",
      description: "Personal, home & business loans",
      longDescription: "Quick loan approvals with competitive rates for personal, home, education, and business needs",
      icon: Building2,
      category: "financial",
      subcategory: "loans",
      route: "/loan-application",
      color: "bg-white/10",
      bgGradient: "from-white/10 to-white/5",
      tags: ["loans", "emi", "instant-approval"],
      rating: 4.5,
      users: "2M+",
      features: ["Instant Approval", "Low Interest", "Flexible EMI", "Online Documentation"]
    },
    {
      id: "credit-management",
      title: "Credit Suite",
      description: "Credit score & card management",
      longDescription: "Monitor credit score, manage credit cards, get improvement tips, and apply for new cards",
      icon: CreditCard,
      category: "financial",
      subcategory: "credit",
      route: "/cibil-checker",
      color: "bg-white/10",
      bgGradient: "from-purple-500 to-pink-500",
      isNew: true,
      tags: ["credit-score", "cards", "cibil", "monitoring"],
      rating: 4.6,
      users: "5M+",
      features: ["Free Score Check", "Card Recommendations", "Dispute Resolution", "Score Improvement"]
    },

    // Bills & Utilities
    {
      id: "mobile-recharge",
      title: "Mobile Recharge",
      description: "Prepaid & postpaid mobile recharge",
      longDescription: "Instant mobile recharges for all operators with exclusive offers and cashback rewards",
      icon: Smartphone,
      category: "bills",
      subcategory: "recharge",
      route: "/bill-payment/mobile",
      color: "bg-white/10",
      bgGradient: "from-blue-500 to-indigo-500",
      isPopular: true,
      tags: ["mobile", "recharge", "prepaid", "postpaid"],
      rating: 4.9,
      users: "100M+",
      cashback: "Up to 5%",
      features: ["All Operators", "Instant Recharge", "Plan Comparison", "Auto Recharge"]
    },
    {
      id: "electricity-bill",
      title: "Electricity Bills",
      description: "Pay electricity bills across India",
      longDescription: "Pay electricity bills for all states with instant confirmation and reward points",
      icon: Zap,
      category: "bills",
      subcategory: "utilities",
      route: "/bill-payment/electricity",
      color: "bg-white/10",
      bgGradient: "from-yellow-500 to-amber-500",
      isPopular: true,
      tags: ["electricity", "bills", "utilities", "states"],
      rating: 4.7,
      users: "25M+",
      cashback: "Up to ₹50",
      features: ["All State Boards", "Bill Reminder", "Auto Pay", "Reward Points"]
    },
    {
      id: "dth-recharge",
      title: "DTH & Cable",
      description: "TV recharge & new connections",
      longDescription: "Recharge DTH, cable TV, and streaming services with best offers and packages",
      icon: Tv,
      category: "bills",
      subcategory: "entertainment",
      route: "/bill-payment/dth",
      color: "bg-white/10",
      bgGradient: "from-purple-600 to-violet-600",
      tags: ["dth", "cable", "tv", "streaming"],
      rating: 4.6,
      users: "15M+",
      features: ["All Operators", "Package Comparison", "Multi-Channel", "HD Support"]
    },

    // Insurance & Protection
    {
      id: "health-insurance",
      title: "Health Insurance",
      description: "Medical & health coverage plans",
      longDescription: "Comprehensive health insurance with cashless treatment and family coverage options",
      icon: Heart,
      category: "insurance",
      subcategory: "health",
      route: "/insurance/health",
      color: "bg-white/10",
      bgGradient: "from-red-500 to-rose-500",
      isNew: true,
      isTrending: true,
      tags: ["health", "medical", "family", "cashless"],
      rating: 4.5,
      users: "3M+",
      features: ["Cashless Treatment", "Family Coverage", "Pre-Existing Conditions", "Quick Claims"]
    },
    {
      id: "vehicle-insurance",
      title: "Vehicle Insurance",
      description: "Car & bike insurance plans",
      longDescription: "Comprehensive motor insurance with instant quotes and zero paperwork claims",
      icon: Car,
      category: "insurance",
      subcategory: "motor",
      route: "/insurance/vehicle",
      color: "bg-white/10",
      bgGradient: "from-blue-600 to-cyan-600",
      tags: ["car", "bike", "motor", "insurance"],
      rating: 4.4,
      users: "5M+",
      features: ["Instant Quotes", "Zero Paperwork", "Roadside Assistance", "Quick Claims"]
    },

    // Lifestyle & Entertainment
    {
      id: "shopping-deals",
      title: "Shopping Deals",
      description: "Exclusive offers & cashback deals",
      longDescription: "Discover best deals across categories with exclusive cashback and discount coupons",
      icon: ShoppingCart,
      category: "lifestyle",
      subcategory: "shopping",
      route: "/shopping-deals",
      color: "bg-white/10",
      bgGradient: "from-pink-500 to-rose-500",
      isTrending: true,
      tags: ["shopping", "deals", "cashback", "coupons"],
      rating: 4.3,
      users: "20M+",
      cashback: "Up to 15%",
      features: ["Brand Offers", "Flash Sales", "Price Comparison", "Cashback Tracking"]
    },
    {
      id: "entertainment-hub",
      title: "Entertainment Hub",
      description: "Movies, music & gaming subscriptions",
      longDescription: "Subscribe to entertainment platforms with bundled offers and exclusive content access",
      icon: Video,
      category: "lifestyle",
      subcategory: "entertainment",
      route: "/entertainment",
      color: "bg-white/10",
      bgGradient: "from-indigo-500 to-purple-500",
      isNew: true,
      tags: ["movies", "music", "gaming", "streaming"],
      rating: 4.5,
      users: "12M+",
      features: ["Multiple Platforms", "Bundle Offers", "HD Streaming", "Offline Downloads"]
    },
    {
      id: "travel-booking",
      title: "Travel Booking",
      description: "Flights, hotels & holiday packages",
      longDescription: "Book flights, hotels, and complete travel packages with best prices and 24/7 support",
      icon: Plane,
      category: "lifestyle",
      subcategory: "travel",
      route: "/travel-booking",
      color: "bg-white/10",
      bgGradient: "from-cyan-500 to-blue-500",
      tags: ["flights", "hotels", "travel", "packages"],
      rating: 4.4,
      users: "8M+",
      features: ["Best Prices", "Instant Booking", "24/7 Support", "Flexible Cancellation"]
    },

    // Business & Professional
    {
      id: "business-solutions",
      title: "Business Solutions",
      description: "Business banking & financial tools",
      longDescription: "Complete business suite with accounting, invoicing, payments, and financial management",
      icon: Briefcase,
      category: "business",
      subcategory: "finance",
      route: "/business-solutions",
      color: "bg-slate-700",
      bgGradient: "from-slate-700 to-gray-700",
      isPremium: true,
      tags: ["business", "accounting", "invoicing", "payments"],
      rating: 4.7,
      users: "500K+",
      features: ["GST Compliance", "Invoice Generation", "Expense Tracking", "Financial Reports"]
    },

    // Premium Services
    {
      id: "ai-financial-advisor",
      title: "AI Financial Coach",
      description: "Personal AI-powered financial guidance",
      longDescription: "Get personalized financial advice, investment strategies, and goal planning from AI assistant",
      icon: MessageCircle,
      category: "premium",
      subcategory: "advisory",
      route: "/ai-coach",
      color: "bg-cyan-600",
      bgGradient: "from-cyan-600 to-blue-600",
      isPremium: true,
      isNew: true,
      isTrending: true,
      tags: ["ai", "advisor", "personal", "goals"],
      rating: 4.8,
      users: "100K+",
      features: ["24/7 Availability", "Personalized Advice", "Goal Tracking", "Market Insights"]
    },
    {
      id: "premium-analytics",
      title: "Advanced Analytics",
      description: "Deep financial insights & reports",
      longDescription: "Comprehensive financial analytics with predictive insights and detailed reporting",
      icon: BarChart3,
      category: "premium",
      subcategory: "analytics",
      route: "/premium-analytics",
      color: "bg-white/10",
      bgGradient: "from-purple-600 to-indigo-600",
      isPremium: true,
      tags: ["analytics", "reports", "insights", "predictions"],
      rating: 4.7,
      users: "250K+",
      features: ["Predictive Analysis", "Custom Reports", "Real-time Insights", "Export Options"]
    }
  ];

  const categories = [
    { id: "all", label: "All Services", icon: Grid3X3, count: allServices.length, color: "bg-slate-500" },
    { id: "financial", label: "Financial", icon: Banknote, count: allServices.filter(s => s.category === "financial").length, color: "bg-white/10" },
    { id: "bills", label: "Bills & Utilities", icon: Zap, count: allServices.filter(s => s.category === "bills").length, color: "bg-white/10" },
    { id: "insurance", label: "Insurance", icon: Shield, count: allServices.filter(s => s.category === "insurance").length, color: "bg-white/10" },
    { id: "lifestyle", label: "Lifestyle", icon: Heart, count: allServices.filter(s => s.category === "lifestyle").length, color: "bg-white/10" },
    { id: "business", label: "Business", icon: Briefcase, count: allServices.filter(s => s.category === "business").length, color: "bg-slate-600" },
    { id: "premium", label: "Premium", icon: Crown, count: allServices.filter(s => s.category === "premium").length, color: "bg-white/10" }
  ];

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = allServices.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.longDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort by popularity by default
    filtered = filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

    return filtered;
  }, [searchTerm, selectedCategory]);

  // Pagination for filtered services
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedServices,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredServices,
    itemsPerPage: 10,
  });

  // Get special categories
  const trendingServices = allServices.filter(s => s.isTrending);
  const popularServices = allServices.filter(s => s.isPopular);
  const newServices = allServices.filter(s => s.isNew);
  const premiumServices = allServices.filter(s => s.isPremium);

  const handleServiceClick = (service: Service) => {
    navigate(service.route);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/20">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/home")}
                className="p-2 text-white hover:bg-white/20"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  All Services
                </h1>
                <p className="text-sm text-white/60">Complete service ecosystem</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="text-xs px-2 py-1 bg-white/10 text-white border-white/20">
                {allServices.length} Services
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2 text-white hover:bg-white/20"
                data-testid="button-toggle-view"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              SERVICE ECOSYSTEM
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              Complete Digital Hub
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services, features..."
              className="bg-black border-white/20 text-white pl-10"
              data-testid="input-search-services"
            />
          </div>
        </div>

        {/* Service Tabs */}
        <div className="space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-black border border-white/20 w-full h-auto p-1 rounded-none">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-trending">Trending</TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="space-y-6">
                {/* Featured Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Featured Services</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {popularServices.slice(0, 4).map((service) => {
                      const ServiceIcon = service.icon;
                      
                      return (
                        <div
                          key={service.id}
                          className="border border-white/20 p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                          onClick={() => handleServiceClick(service)}
                          data-testid={`service-featured-${service.id}`}
                        >
                          <div className="space-y-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                              <ServiceIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">{service.title}</h4>
                              <p className="text-xs text-white/60">{service.description}</p>
                              {service.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 text-white/80 fill-current" />
                                  <span className="text-xs text-white/60">{service.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Access */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Quick Access</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {trendingServices.slice(0, 3).map((service) => {
                      const ServiceIcon = service.icon;
                      
                      return (
                        <div
                          key={service.id}
                          className="border border-white/20 p-3 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                          onClick={() => handleServiceClick(service)}
                          data-testid={`service-trending-${service.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                              <ServiceIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">{service.title}</h4>
                              <p className="text-xs text-white/60">{service.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {service.isTrending && (
                                <Badge className="text-xs px-2 py-0 bg-white/10 text-white/80 border-white/20">
                                  TRENDING
                                </Badge>
                              )}
                              <ArrowRight className="h-4 w-4 text-white/40" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* New Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">New Services</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {newServices.slice(0, 2).map((service) => {
                      const ServiceIcon = service.icon;
                      
                      return (
                        <div
                          key={service.id}
                          className="border border-white/20 p-3 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                          onClick={() => handleServiceClick(service)}
                          data-testid={`service-new-${service.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                              <ServiceIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm">{service.title}</h4>
                              <p className="text-xs text-white/60">{service.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="text-xs px-2 py-0 bg-white/10 text-white/80 border-white/20">
                                NEW
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-white/40" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Trending Now</h3>
                {trendingServices.map((service) => {
                  const ServiceIcon = service.icon;
                  
                  return (
                    <div
                      key={service.id}
                      className="border border-white/20 p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                      onClick={() => handleServiceClick(service)}
                      data-testid={`service-trending-detail-${service.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                              <ServiceIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">{service.title}</h4>
                              <p className="text-xs text-white/60">{service.description}</p>
                              {service.longDescription && (
                                <p className="text-xs text-white/40 mt-1">{service.longDescription}</p>
                              )}
                            </div>
                          </div>
                          <Badge className="text-xs px-2 py-0 bg-white/10 text-white/80 border-white/20">
                            TRENDING
                          </Badge>
                        </div>

                        {(service.rating || service.users || service.cashback) && (
                          <div className="flex items-center gap-4 text-xs text-white/60 border-t border-white/20 pt-3">
                            {service.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-white/80 fill-current" />
                                <span>{service.rating}</span>
                              </div>
                            )}
                            {service.users && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{service.users}</span>
                              </div>
                            )}
                            {service.cashback && (
                              <div className="flex items-center gap-1">
                                <Gift className="h-3 w-3 text-white/80" />
                                <span>{service.cashback}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-4">
              <div className="space-y-6">
                {/* Category Filters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Browse Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.filter(cat => cat.id !== "all").map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            "h-16 flex flex-col items-center gap-2 text-white",
                            selectedCategory === category.id 
                              ? "bg-white text-black hover:bg-white/90" 
                              : "hover:bg-white/10 border border-white/20"
                          )}
                          data-testid={`category-${category.id}`}
                        >
                          <CategoryIcon className="h-5 w-5" />
                          <div className="text-center">
                            <p className="text-xs font-medium">{category.label}</p>
                            <p className="text-xs opacity-60">{category.count} services</p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Filtered Services */}
                {selectedCategory !== "all" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {categories.find(c => c.id === selectedCategory)?.label} Services
                    </h3>
                    <div className="space-y-3">
                      {paginatedServices.map((service) => {
                        const ServiceIcon = service.icon;
                        
                        return (
                          <div
                            key={service.id}
                            className="border border-white/20 p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                            onClick={() => handleServiceClick(service)}
                            data-testid={`service-category-${service.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                                <ServiceIcon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white text-sm">{service.title}</h4>
                                <p className="text-xs text-white/60">{service.description}</p>
                                {service.features && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {service.features.slice(0, 2).map((feature, index) => (
                                      <Badge key={index} className="text-xs px-2 py-0 bg-white/10 text-white/80 border-white/20">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                {service.isPremium && <Crown className="h-4 w-4 text-white/80 mb-1" />}
                                {service.isNew && (
                                  <Badge className="text-xs px-2 py-0 bg-white/10 text-white/80 border-white/20 mb-1">
                                    NEW
                                  </Badge>
                                )}
                                <ArrowRight className="h-4 w-4 text-white/40" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination Controls */}
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={goToPage}
                      canGoNext={canGoNext}
                      canGoPrevious={canGoPrevious}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      totalItems={totalItems}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Explore More</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => navigate("/pro-tools")}
              className="bg-white text-black hover:bg-white/90 h-12 justify-start"
              data-testid="button-pro-tools"
            >
              <Crown className="h-4 w-4 mr-2" />
              Pro Tools & Premium Services
            </Button>
            <Button
              onClick={() => navigate("/rewards")}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/20"
              data-testid="button-rewards-center"
            >
              <Gift className="h-4 w-4 mr-2" />
              Rewards Center
            </Button>
            <Button
              onClick={() => navigate("/help-center")}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/20"
              data-testid="button-help-center"
            >
              <Headphones className="h-4 w-4 mr-2" />
              Help & Support
            </Button>
          </div>
        </div>

        {/* Service Stats */}
        <div className="border border-white/20 p-4" data-testid="service-stats">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Service Ecosystem</h4>
              <p className="text-xs text-white/60">
                {allServices.length} services across {categories.length - 1} categories
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white p-1"
                onClick={() => window.location.reload()}
                data-testid="button-refresh-services"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}