import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Gift,
  Percent,
  Ticket,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Tag,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Search
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "discount" | "cashback" | "free_service" | "offer";
  value: number;
  valueType: "percentage" | "fixed" | "points";
  minAmount: number;
  maxDiscount?: number;
  category: "bills" | "travel" | "investments" | "shopping" | "food" | "all";
  merchantName: string;
  validFrom: string;
  validUntil: string;
  isUsed: boolean;
  usedAt?: string;
  termsConditions: string[];
  eligibleOn: string[];
  isActive: boolean;
  isAutoApplicable: boolean;
  popularity: "high" | "medium" | "low";
  savedBy: number;
}

export default function MyCoupons() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useUrlTab("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideAmounts, setHideAmounts] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const mockCoupons: Coupon[] = [
    {
      id: "1",
      code: "BILL50",
      title: "50% Off on Bill Payments",
      description: "Get 50% cashback on electricity bill payments",
      type: "cashback",
      value: 50,
      valueType: "percentage",
      minAmount: 500,
      maxDiscount: 200,
      category: "bills",
      merchantName: "InCred",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      isUsed: false,
      termsConditions: [
        "Valid on electricity bill payments only",
        "Minimum bill amount ₹500",
        "Maximum cashback ₹200",
        "Valid once per user"
      ],
      eligibleOn: ["Electricity", "Water", "Gas"],
      isActive: true,
      isAutoApplicable: true,
      popularity: "high",
      savedBy: 1245
    },
    {
      id: "2",
      code: "TRAVEL100",
      title: "₹100 Off on Travel Booking",
      description: "Flat ₹100 discount on flight & bus bookings",
      type: "discount",
      value: 100,
      valueType: "fixed",
      minAmount: 1000,
      category: "travel",
      merchantName: "InCred Travel",
      validFrom: "2024-11-01",
      validUntil: "2024-12-31",
      isUsed: false,
      termsConditions: [
        "Valid on domestic flights and buses",
        "Minimum booking amount ₹1000",
        "Cannot be combined with other offers"
      ],
      eligibleOn: ["Flights", "Bus", "Train"],
      isActive: true,
      isAutoApplicable: false,
      popularity: "high",
      savedBy: 892
    },
    {
      id: "3",
      code: "INVEST500",
      title: "₹500 Bonus on Investments",
      description: "Get ₹500 bonus when you invest ₹5000 or more",
      type: "cashback",
      value: 500,
      valueType: "fixed",
      minAmount: 5000,
      category: "investments",
      merchantName: "InCred Wealth",
      validFrom: "2024-12-01",
      validUntil: "2024-12-31",
      isUsed: false,
      termsConditions: [
        "Valid on mutual fund investments",
        "Minimum investment amount ₹5000",
        "Bonus credited after 30 days"
      ],
      eligibleOn: ["Mutual Funds", "SIP", "Stocks"],
      isActive: true,
      isAutoApplicable: true,
      popularity: "medium",
      savedBy: 456
    },
    {
      id: "4",
      code: "FOOD30",
      title: "30% Off on Food Orders",
      description: "Get 30% off on food delivery orders",
      type: "discount",
      value: 30,
      valueType: "percentage",
      minAmount: 200,
      maxDiscount: 150,
      category: "food",
      merchantName: "Swiggy",
      validFrom: "2024-11-15",
      validUntil: "2024-11-30",
      isUsed: true,
      usedAt: "2024-11-20",
      termsConditions: [
        "Valid on Swiggy orders only",
        "Minimum order value ₹200",
        "Maximum discount ₹150"
      ],
      eligibleOn: ["Food Delivery"],
      isActive: false,
      isAutoApplicable: false,
      popularity: "high",
      savedBy: 2103
    },
    {
      id: "5",
      code: "SHOP25",
      title: "25% Cashback on Shopping",
      description: "Get 25% cashback on online shopping",
      type: "cashback",
      value: 25,
      valueType: "percentage",
      minAmount: 1500,
      maxDiscount: 500,
      category: "shopping",
      merchantName: "Amazon",
      validFrom: "2024-10-01",
      validUntil: "2024-11-30",
      isUsed: false,
      termsConditions: [
        "Valid on select categories",
        "Minimum purchase ₹1500",
        "Maximum cashback ₹500"
      ],
      eligibleOn: ["Electronics", "Fashion", "Home"],
      isActive: false,
      isAutoApplicable: false,
      popularity: "medium",
      savedBy: 678
    }
  ];

  const stats = {
    totalCoupons: mockCoupons.length,
    activeCoupons: mockCoupons.filter(c => c.isActive && !c.isUsed).length,
    usedCoupons: mockCoupons.filter(c => c.isUsed).length,
    expiredCoupons: mockCoupons.filter(c => !c.isActive && !c.isUsed).length,
    totalSavings: mockCoupons.filter(c => c.isUsed).reduce((sum, c) => sum + c.value, 0)
  };

  const filteredCoupons = mockCoupons.filter(coupon => {
    const matchesSearch = 
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedTab === "all") return true;
    if (selectedTab === "active") return coupon.isActive && !coupon.isUsed;
    if (selectedTab === "used") return coupon.isUsed;
    if (selectedTab === "expired") return !coupon.isActive && !coupon.isUsed;
    return true;
  });

  const pagination = usePagination({
    data: filteredCoupons,
    itemsPerPage: 10,
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Coupon Copied!",
      description: `Code ${code} copied to clipboard`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bills": return Ticket;
      case "travel": return ShoppingBag;
      case "investments": return TrendingUp;
      case "shopping": return ShoppingBag;
      case "food": return Gift;
      default: return Tag;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY COUPONS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Offers & discounts</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="coupons-summary">
          <div className="space-y-6">
            {/* Main Stats Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Savings</p>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">{stats.totalCoupons} Coupons</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-savings">
                {hideAmounts ? "₹••••••••" : `₹${stats.totalSavings.toLocaleString()}`}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-active">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Active</p>
                <p className="text-lg font-light text-white" data-testid="text-active-coupons">
                  {stats.activeCoupons}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-used">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Used</p>
                <p className="text-lg font-light text-white" data-testid="text-used-coupons">
                  {stats.usedCoupons}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-expired">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Expired</p>
                <p className="text-lg font-light text-white" data-testid="text-expired-coupons">
                  {stats.expiredCoupons}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by name, code, or merchant..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-coupons"
          />
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-active">Active</TabsTrigger>
              <TabsTrigger value="used" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-used">Used</TabsTrigger>
              <TabsTrigger value="expired" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-3">
                {pagination.paginatedData.map((coupon) => {
                  const CategoryIcon = getCategoryIcon(coupon.category);
                  
                  return (
                    <div
                      key={coupon.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`card-coupon-${coupon.id}`}
                    >
                      <div className="space-y-3">
                        {/* Coupon Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                              <CategoryIcon className="h-4 w-4 text-white/60" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{coupon.title}</h4>
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">{coupon.merchantName}</p>
                              <p className="text-xs text-white/40">{coupon.description}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge className={cn(
                              "bg-white/10 text-white border-white/10 rounded-none text-[10px]",
                              coupon.isUsed ? "opacity-50" : ""
                            )}>
                              {coupon.valueType === "percentage" 
                                ? `${coupon.value}% OFF` 
                                : `₹${coupon.value} OFF`}
                            </Badge>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">
                              {coupon.isUsed ? "Used" : coupon.isActive ? "Active" : "Expired"}
                            </p>
                          </div>
                        </div>

                        {/* Coupon Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-white/60">Code:</span>
                              <div className="flex items-center gap-1">
                                <span className="text-white font-mono">{coupon.code}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(coupon.code)}
                                  className="h-5 w-5 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                  data-testid={`button-copy-${coupon.id}`}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Min Amount:</span>
                              <span className="text-white font-medium">
                                {hideAmounts ? "₹•••" : `₹${coupon.minAmount.toLocaleString()}`}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-white/60">Valid Until:</span>
                              <span className="text-white font-medium">{formatDate(coupon.validUntil)}</span>
                            </div>
                            {coupon.maxDiscount && (
                              <div className="flex justify-between">
                                <span className="text-white/60">Max Save:</span>
                                <span className="text-white font-medium">
                                  {hideAmounts ? "₹•••" : `₹${coupon.maxDiscount.toLocaleString()}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredCoupons.length > 0 && (
                  <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    canGoNext={pagination.canGoNext}
                    canGoPrevious={pagination.canGoPrevious}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                    className="mt-6"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
