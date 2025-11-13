import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Search,
  Filter,
  Star,
  CreditCard,
  ShoppingCart,
  Smartphone,
  Car,
  Building,
  Eye,
  Calculator,
  CheckCircle,
  X,
  Clock,
  DollarSign,
  Users,
  Percent,
  Calendar,
  Award,
  Target,
  Zap
} from "lucide-react";

interface EMIProduct {
  id: string;
  productName: string;
  provider: string;
  providerLogo: string;
  category: string;
  subcategory: string;
  minAmount: number;
  maxAmount: number;
  tenure: string;
  interestRate: number;
  processingFee: string;
  emiAmount: number;
  features: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    minSalary: number;
    creditScore: number;
  };
  benefits: string[];
  tags: string[];
  rating: number;
  userCount: number;
  approvalTime: string;
  documentsRequired: string[];
}

export default function EMI() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [tenureFilter, setTenureFilter] = useState("");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  // Mock EMI products data
  const mockEMIProducts: EMIProduct[] = [
    {
      id: "emi-1",
      productName: "Credit Card EMI",
      provider: "HDFC Bank",
      providerLogo: "🏦",
      category: "credit_card",
      subcategory: "Purchase EMI",
      minAmount: 5000,
      maxAmount: 500000,
      tenure: "3-24 months",
      interestRate: 12.0,
      processingFee: "0%",
      emiAmount: 2167,
      features: ["No Processing Fee", "Instant Approval", "Flexible Tenure", "Online Management"],
      eligibility: { minAge: 21, maxAge: 65, minSalary: 25000, creditScore: 650 },
      benefits: ["Zero documentation", "Same day approval", "Doorstep delivery"],
      tags: ["Popular", "Instant"],
      rating: 4.4,
      userCount: 150000,
      approvalTime: "5 minutes",
      documentsRequired: ["Credit Card", "OTP Verification"]
    },
    {
      id: "emi-2",
      productName: "Mobile Phone EMI",
      provider: "Bajaj Finserv",
      providerLogo: "📱",
      category: "electronics",
      subcategory: "Mobile & Electronics",
      minAmount: 10000,
      maxAmount: 200000,
      tenure: "3-24 months",
      interestRate: 0,
      processingFee: "1.5%",
      emiAmount: 4167,
      features: ["0% Interest", "No Foreclosure Charges", "Easy Approval", "Partner Stores"],
      eligibility: { minAge: 18, maxAge: 60, minSalary: 15000, creditScore: 600 },
      benefits: ["Zero interest", "Wide store network", "Quick processing"],
      tags: ["0% Interest", "Electronics"],
      rating: 4.2,
      userCount: 85000,
      approvalTime: "10 minutes",
      documentsRequired: ["PAN Card", "Aadhaar", "Salary Slip"]
    },
    {
      id: "emi-3",
      productName: "Personal Loan EMI",
      provider: "ICICI Bank",
      providerLogo: "🏪",
      category: "personal",
      subcategory: "Personal Loan",
      minAmount: 25000,
      maxAmount: 2000000,
      tenure: "12-60 months",
      interestRate: 10.5,
      processingFee: "2.5%",
      emiAmount: 4299,
      features: ["Flexible Tenure", "Competitive Rates", "Quick Disbursal", "Online Application"],
      eligibility: { minAge: 23, maxAge: 58, minSalary: 30000, creditScore: 700 },
      benefits: ["High loan amount", "Competitive rates", "Fast approval"],
      tags: ["High Amount", "Fast"],
      rating: 4.5,
      userCount: 120000,
      approvalTime: "2 hours",
      documentsRequired: ["Income Proof", "ID Proof", "Bank Statements"]
    },
    {
      id: "emi-4",
      productName: "Vehicle EMI",
      provider: "SBI",
      providerLogo: "🏛️",
      category: "vehicle",
      subcategory: "Auto Loan",
      minAmount: 100000,
      maxAmount: 1500000,
      tenure: "12-84 months",
      interestRate: 8.9,
      processingFee: "0.5%",
      emiAmount: 3456,
      features: ["Low Interest Rate", "Long Tenure", "No Prepayment Penalty", "Insurance Included"],
      eligibility: { minAge: 21, maxAge: 65, minSalary: 25000, creditScore: 650 },
      benefits: ["Lowest rates", "Comprehensive insurance", "Doorstep service"],
      tags: ["Low Rate", "Vehicle"],
      rating: 4.3,
      userCount: 95000,
      approvalTime: "1 day",
      documentsRequired: ["Income Proof", "Vehicle Invoice", "Insurance"]
    },
    {
      id: "emi-5",
      productName: "Home Appliance EMI",
      provider: "Flipkart Pay Later",
      providerLogo: "🛒",
      category: "appliances",
      subcategory: "Home & Lifestyle",
      minAmount: 3000,
      maxAmount: 150000,
      tenure: "3-12 months",
      interestRate: 0,
      processingFee: "0%",
      emiAmount: 8333,
      features: ["No Cost EMI", "Wide Product Range", "Instant Approval", "Easy Returns"],
      eligibility: { minAge: 18, maxAge: 65, minSalary: 12000, creditScore: 550 },
      benefits: ["No hidden charges", "Easy returns", "Wide selection"],
      tags: ["No Cost", "Appliances"],
      rating: 4.0,
      userCount: 200000,
      approvalTime: "Instant",
      documentsRequired: ["Mobile OTP", "PAN Card"]
    },
    {
      id: "emi-6",
      productName: "Travel EMI",
      provider: "MakeMyTrip",
      providerLogo: "✈️",
      category: "travel",
      subcategory: "Travel & Tourism",
      minAmount: 15000,
      maxAmount: 300000,
      tenure: "3-18 months",
      interestRate: 11.5,
      processingFee: "1%",
      emiAmount: 5280,
      features: ["Travel Insurance", "Flexible Booking", "Instant Approval", "Cancellation Protection"],
      eligibility: { minAge: 21, maxAge: 60, minSalary: 20000, creditScore: 600 },
      benefits: ["Travel insurance included", "Flexible cancellation", "24/7 support"],
      tags: ["Travel", "Insurance"],
      rating: 3.9,
      userCount: 45000,
      approvalTime: "15 minutes",
      documentsRequired: ["ID Proof", "Travel Booking", "Income Proof"]
    }
  ];

  const categories = [
    { id: "all", name: "ALL", icon: Target },
    { id: "credit_card", name: "CREDIT CARD", icon: CreditCard },
    { id: "electronics", name: "ELECTRONICS", icon: Smartphone },
    { id: "personal", name: "PERSONAL", icon: DollarSign },
    { id: "vehicle", name: "VEHICLE", icon: Car },
    { id: "appliances", name: "APPLIANCES", icon: Building },
    { id: "travel", name: "TRAVEL", icon: Calendar }
  ];

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return mockEMIProducts.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      // Tenure filter logic
      let matchesTenure = true;
      if (tenureFilter) {
        const tenureMonths = parseInt(product.tenure.split('-')[1]); // Get max tenure
        switch (tenureFilter) {
          case "short":
            matchesTenure = tenureMonths <= 12;
            break;
          case "medium":
            matchesTenure = tenureMonths > 12 && tenureMonths <= 36;
            break;
          case "long":
            matchesTenure = tenureMonths > 36;
            break;
        }
      }
      
      // Amount filter logic
      let matchesAmount = true;
      if (amountRange.min || amountRange.max) {
        const minAmount = amountRange.min ? parseInt(amountRange.min.replace(/[^\d]/g, '')) : 0;
        const maxAmount = amountRange.max ? parseInt(amountRange.max.replace(/[^\d]/g, '')) : Infinity;
        
        matchesAmount = product.maxAmount >= minAmount && product.minAmount <= maxAmount;
      }
      
      return matchesSearch && matchesCategory && matchesTenure && matchesAmount;
    });
  }, [searchQuery, selectedCategory, tenureFilter, amountRange, mockEMIProducts]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "popularity":
        return sorted.sort((a, b) => b.userCount - a.userCount);
      case "rate-low":
        return sorted.sort((a, b) => a.interestRate - b.interestRate);
      case "rate-high":
        return sorted.sort((a, b) => b.interestRate - a.interestRate);
      case "amount-high":
        return sorted.sort((a, b) => b.maxAmount - a.maxAmount);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "approval":
        return sorted.sort((a, b) => {
          const aTime = a.approvalTime.includes("minute") ? 1 : a.approvalTime.includes("hour") ? 2 : 3;
          const bTime = b.approvalTime.includes("minute") ? 1 : b.approvalTime.includes("hour") ? 2 : 3;
          return aTime - bTime;
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const pagination = usePagination({
    data: sortedProducts,
    itemsPerPage: 20,
  });

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId].slice(-3) // Limit to 3 comparisons
    );
  };

  const handleApplyEMI = (product: EMIProduct) => {
    // Navigate to marketplace with EMI application details
    navigate(`/marketplace?category=emi&productId=${product.id}`);
  };

  const handleCalculateEMI = (product: EMIProduct) => {
    // Navigate to EMI calculator with product details
    navigate(`/emi-calculator?productId=${product.id}`);
  };

  const getTypeIcon = (category: string) => {
    switch (category) {
      case "credit_card": return CreditCard;
      case "electronics": return Smartphone;
      case "personal": return DollarSign;
      case "vehicle": return Car;
      case "appliances": return Building;
      case "travel": return Calendar;
      default: return Target;
    }
  };

  const getTypeColor = (category: string) => {
    switch (category) {
      case "credit_card": return "bg-white/10";
      case "electronics": return "bg-white/10";
      case "personal": return "bg-white/10";
      case "vehicle": return "bg-white/10";
      case "appliances": return "bg-white/10";
      case "travel": return "bg-white/10";
      default: return "bg-white";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-wider">EMI OPTIONS</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wider mb-2">EMI MARKETPLACE</h2>
          <p className="text-white/60">Convert your purchases into easy monthly installments</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search EMI options, providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black border border-white/30 text-white placeholder:text-white/40 focus:border-white/60 focus:ring-0 h-12"
            data-testid="input-search-emi"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-black border border-white/20 rounded-none p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
                  data-testid={`tab-category-${category.id}`}
                >
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Compare Button */}
        {selectedProducts.length > 0 && (
          <div className="mb-6 flex justify-center">
            <Button
              onClick={() => setShowCompare(true)}
              className="bg-white/10 hover:bg-white/15 text-white"
              data-testid="button-compare"
            >
              Compare ({selectedProducts.length})
            </Button>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <Card className="bg-white/5 border-white/20 mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-foreground mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Tenure</label>
                  <Select value={tenureFilter} onValueChange={setTenureFilter}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-foreground">
                      <SelectValue placeholder="Select tenure range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short Term (≤12 months)</SelectItem>
                      <SelectItem value="medium">Medium Term (13-36 months)</SelectItem>
                      <SelectItem value="long">Long Term ({'>'}36 months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Amount Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min ₹"
                      value={amountRange.min}
                      onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                      className="bg-white/5 border-white/20 text-foreground"
                    />
                    <Input
                      placeholder="Max ₹"
                      value={amountRange.max}
                      onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                      className="bg-white/5 border-white/20 text-foreground"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rate-low">Interest Rate (Low to High)</SelectItem>
                      <SelectItem value="rate-high">Interest Rate (High to Low)</SelectItem>
                      <SelectItem value="amount-high">Max Amount (High to Low)</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="approval">Fastest Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setTenureFilter("");
                      setAmountRange({ min: "", max: "" });
                    }}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 bg-white text-black hover:bg-white/90"
                    data-testid="button-apply-filters"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* EMI Products Grid */}
      <div className="px-4 space-y-4">
        {pagination.paginatedData.map((product) => {
          const TypeIcon = getTypeIcon(product.category);
          const isSelected = selectedProducts.includes(product.id);
          
          return (
            <Card 
              key={product.id} 
              className={cn(
                "bg-black border-white/20 hover:border-white/40 transition-all cursor-pointer",
                isSelected && "bg-white/10 bg-white/5"
              )}
              data-testid={`card-product-${product.id}`}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn("w-12 h-12 rounded flex items-center justify-center text-white text-2xl", getTypeColor(product.category))}>
                      {product.providerLogo}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{product.productName}</h3>
                      <p className="text-white/80 text-sm">{product.provider}</p>
                      <p className="text-white/60 text-xs">{product.subcategory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleProductSelection(product.id)}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "border-white/20 text-white hover:bg-white/10",
                        isSelected && "bg-white/10 hover:bg-white/15"
                      )}
                      data-testid={`button-select-${product.id}`}
                    >
                      {isSelected ? "✓" : "+"}
                    </Button>
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center justify-between p-3 border border-white/20">
                    <span className="text-white/80 text-sm">Interest Rate</span>
                    <span className="text-white font-bold">
                      {product.interestRate === 0 ? "0%" : `${product.interestRate}%`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-white/20">
                    <span className="text-white/80 text-sm">EMI from</span>
                    <span className="text-white font-bold">₹{product.emiAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-white/20">
                    <span className="text-white/80 text-sm">Max Amount</span>
                    <span className="text-white font-bold">{formatCurrency(product.maxAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-white/20">
                    <span className="text-white/80 text-sm">Approval Time</span>
                    <span className="text-white font-bold">{product.approvalTime}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature) => (
                      <div key={feature} className="flex items-center gap-1 text-xs text-white/80">
                        <CheckCircle className="h-3 w-3 bg-white/10" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-white/60">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 bg-white/10" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{product.userCount.toLocaleString()} users</span>
                    </div>
                  </div>
                  <span className="text-white/60">
                    Tenure: {product.tenure} | Fee: {product.processingFee}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApplyEMI(product)}
                    className="flex-1 bg-white text-black hover:bg-white/90 font-semibold h-10"
                    data-testid={`button-apply-${product.id}`}
                  >
                    APPLY NOW
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/marketplace?category=emi&productId=${product.id}&view=details`)}
                    className="flex-1 border border-white/30 text-white hover:bg-white/10 font-semibold h-10"
                    data-testid={`button-details-${product.id}`}
                  >
                    VIEW DETAILS
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCalculateEMI(product)}
                    className="border-white/20 text-white hover:bg-white/10"
                    data-testid={`button-calculate-${product.id}`}
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          canGoNext={pagination.canGoNext}
          canGoPrevious={pagination.canGoPrevious}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
        />
      </div>

      {/* No Results */}
      {sortedProducts.length === 0 && (
        <div className="px-6 py-12">
          <div className="text-center border border-white/20 py-12">
            <Search className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">NO EMI OPTIONS FOUND</h3>
            <p className="text-white/60 mb-4">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setTenureFilter("");
                setAmountRange({ min: "", max: "" });
              }}
              className="bg-white text-black hover:bg-white/90 font-semibold"
            >
              CLEAR FILTERS
            </Button>
          </div>
        </div>
      )}

      {/* Comparison Dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-4xl bg-black text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Compare EMI Options</DialogTitle>
          </DialogHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2 text-sm text-muted-foreground">Feature</th>
                  {selectedProducts.map(productId => {
                    const product = mockEMIProducts.find(p => p.id === productId);
                    return product ? (
                      <th key={productId} className="text-left p-2 min-w-48">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white text-sm", getTypeColor(product.category))}>
                            {product.providerLogo}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{product.productName}</p>
                            <p className="text-xs text-muted-foreground">{product.provider}</p>
                          </div>
                        </div>
                      </th>
                    ) : null;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-muted-foreground">Interest Rate</td>
                  {selectedProducts.map(productId => {
                    const p = mockEMIProducts.find(x => x.id === productId);
                    return p ? (
                      <td key={productId} className="p-2 font-semibold text-foreground">
                        {p.interestRate === 0 ? "0%" : `${p.interestRate}%`}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-muted-foreground">Max Amount</td>
                  {selectedProducts.map(productId => {
                    const p = mockEMIProducts.find(x => x.id === productId);
                    return p ? (
                      <td key={productId} className="p-2 font-semibold text-foreground">
                        {formatCurrency(p.maxAmount)}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-muted-foreground">Approval Time</td>
                  {selectedProducts.map(productId => {
                    const p = mockEMIProducts.find(x => x.id === productId);
                    return p ? (
                      <td key={productId} className="p-2 font-semibold bg-white/10">
                        {p.approvalTime}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-muted-foreground">Processing Fee</td>
                  {selectedProducts.map(productId => {
                    const p = mockEMIProducts.find(x => x.id === productId);
                    return p ? (
                      <td key={productId} className="p-2 font-semibold text-foreground">
                        {p.processingFee}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-muted-foreground">Rating</td>
                  {selectedProducts.map(productId => {
                    const p = mockEMIProducts.find(x => x.id === productId);
                    return p ? (
                      <td key={productId} className="p-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-white bg-white/10" />
                          <span className="font-semibold text-foreground">{p.rating}</span>
                        </div>
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr>
                  <td className="p-2 text-sm text-muted-foreground">Action</td>
                  {selectedProducts.map(productId => {
                    const p = mockEMIProducts.find(x => x.id === productId);
                    return p ? (
                      <td key={productId} className="p-2">
                        <Button
                          onClick={() => handleApplyEMI(p)}
                          size="sm"
                          className="bg-white text-black hover:bg-white/90"
                        >
                          Apply Now
                        </Button>
                      </td>
                    ) : null;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => setSelectedProducts([])}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Selection
            </Button>
            <Button
              onClick={() => setShowCompare(false)}
              className="bg-white text-black hover:bg-white/90"
            >
              Close Comparison
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}