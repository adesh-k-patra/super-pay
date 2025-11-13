import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Search,
  Filter,
  Star,
  Shield,
  Car,
  Bike,
  Heart,
  Building2,
  CheckCircle,
  Award,
  Calculator,
  Phone,
  FileText,
  TrendingUp,
  Zap,
  Crown,
  Users,
  Clock,
  DollarSign,
  Target,
  ArrowRight,
  Plus,
  Eye,
  Download,
  ExternalLink,
  X,
  Info
} from "lucide-react";

interface InsurancePolicy {
  id: string;
  provider: string;
  providerLogo: string;
  policyName: string;
  type: "car" | "bike" | "health" | "home" | "travel";
  coverage: number;
  premium: number;
  tenure: string;
  rating: number;
  reviews: number;
  features: string[];
  benefits: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    requirements: string[];
  };
  claimSettlement: number;
  networkHospitals?: number;
  cashlessGarages?: number;
  category: string;
  tags: string[];
  isRecommended?: boolean;
  discountPercent?: number;
}

export default function Insurance() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [ageFilter, setAgeFilter] = useState("");
  const [budgetRange, setBudgetRange] = useState({ min: "", max: "" });

  // Mock insurance data
  const mockInsurancePolicies: InsurancePolicy[] = [
    {
      id: "hdfc-car",
      provider: "HDFC ERGO",
      providerLogo: "🏦",
      policyName: "Comprehensive Car Insurance",
      type: "car",
      coverage: 500000,
      premium: 12000,
      tenure: "1 Year",
      rating: 4.6,
      reviews: 1250,
      features: ["Zero Depreciation", "Engine Protection", "24x7 Roadside Assistance", "No Claim Bonus"],
      benefits: ["Instant Policy", "Easy Claims", "Pan India Network"],
      eligibility: {
        minAge: 18,
        maxAge: 65,
        requirements: ["Valid Driving License", "Vehicle Registration"]
      },
      claimSettlement: 98.5,
      cashlessGarages: 7500,
      category: "motor",
      tags: ["Popular", "Best Value"],
      isRecommended: true,
      discountPercent: 15
    },
    {
      id: "bajaj-bike",
      provider: "Bajaj Allianz",
      providerLogo: "🏢",
      policyName: "Two Wheeler Insurance Pro",
      type: "bike",
      coverage: 200000,
      premium: 3500,
      tenure: "1 Year",
      rating: 4.4,
      reviews: 890,
      features: ["Personal Accident Cover", "Zero Depreciation", "Engine Protection"],
      benefits: ["Quick Claims", "24x7 Support", "Doorstep Service"],
      eligibility: {
        minAge: 18,
        maxAge: 65,
        requirements: ["Valid Driving License", "Vehicle Registration"]
      },
      claimSettlement: 96.8,
      cashlessGarages: 4200,
      category: "motor",
      tags: ["Affordable", "Quick Claims"]
    },
    {
      id: "star-health",
      provider: "Star Health",
      providerLogo: "⭐",
      policyName: "Star Family Health Insurance",
      type: "health",
      coverage: 1000000,
      premium: 15000,
      tenure: "1 Year",
      rating: 4.7,
      reviews: 2100,
      features: ["Family Floater", "Pre & Post Hospitalization", "Day Care Procedures", "Annual Health Checkup"],
      benefits: ["Wide Network", "Cashless Claims", "Quick Settlement"],
      eligibility: {
        minAge: 0,
        maxAge: 80,
        requirements: ["Medical History", "Age Proof"]
      },
      claimSettlement: 94.2,
      networkHospitals: 12000,
      category: "health",
      tags: ["Family Plan", "Best Coverage"],
      isRecommended: true
    },
    {
      id: "icici-car",
      provider: "ICICI Lombard",
      providerLogo: "🏦",
      policyName: "Car Insurance Platinum",
      type: "car",
      coverage: 750000,
      premium: 18000,
      tenure: "1 Year",
      rating: 4.5,
      reviews: 980,
      features: ["Zero Depreciation", "Return to Invoice", "Engine Protection", "Key Replacement"],
      benefits: ["Premium Service", "Express Claims", "Concierge Services"],
      eligibility: {
        minAge: 18,
        maxAge: 70,
        requirements: ["Valid Driving License", "Vehicle Registration"]
      },
      claimSettlement: 97.8,
      cashlessGarages: 6800,
      category: "motor",
      tags: ["Premium", "Luxury Cars"]
    },
    {
      id: "care-health",
      provider: "Care Health",
      providerLogo: "💚",
      policyName: "Care Supreme Health Plan",
      type: "health",
      coverage: 2000000,
      premium: 25000,
      tenure: "1 Year",
      rating: 4.6,
      reviews: 1680,
      features: ["Individual/Family", "Global Coverage", "Alternative Treatment", "Mental Health Cover"],
      benefits: ["Modern Treatment", "No Room Limits", "Unlimited Restoration"],
      eligibility: {
        minAge: 0,
        maxAge: 75,
        requirements: ["Medical History", "Age Proof"]
      },
      claimSettlement: 95.5,
      networkHospitals: 18000,
      category: "health",
      tags: ["Premium", "Global Coverage"]
    }
  ];

  const categories = [
    { id: "all", label: "All Insurance", icon: Shield },
    { id: "car", label: "Car Insurance", icon: Car },
    { id: "bike", label: "Bike Insurance", icon: Bike },
    { id: "health", label: "Health Insurance", icon: Heart },
    { id: "home", label: "Home Insurance", icon: Building2 }
  ];

  // Filter and search logic
  const filteredPolicies = useMemo(() => {
    return mockInsurancePolicies.filter(policy => {
      const matchesSearch = policy.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           policy.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           policy.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || policy.type === selectedCategory;
      
      // Age filter logic
      let matchesAge = true;
      if (ageFilter) {
        const [minAge, maxAge] = ageFilter.includes('+') 
          ? [parseInt(ageFilter.replace('+', '')), 100]
          : ageFilter.split('-').map(age => parseInt(age));
        
        matchesAge = minAge >= policy.eligibility.minAge && maxAge <= policy.eligibility.maxAge;
      }
      
      // Budget filter logic
      let matchesBudget = true;
      if (budgetRange.min || budgetRange.max) {
        const minBudget = budgetRange.min ? parseInt(budgetRange.min.replace(/[^\d]/g, '')) : 0;
        const maxBudget = budgetRange.max ? parseInt(budgetRange.max.replace(/[^\d]/g, '')) : Infinity;
        
        matchesBudget = policy.premium >= minBudget && policy.premium <= maxBudget;
      }
      
      return matchesSearch && matchesCategory && matchesAge && matchesBudget;
    });
  }, [searchQuery, selectedCategory, ageFilter, budgetRange, mockInsurancePolicies]);

  // Sort policies
  const sortedPolicies = useMemo(() => {
    const sorted = [...filteredPolicies];
    
    switch (sortBy) {
      case "premium-low":
        return sorted.sort((a, b) => a.premium - b.premium);
      case "premium-high":
        return sorted.sort((a, b) => b.premium - a.premium);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "coverage":
        return sorted.sort((a, b) => b.coverage - a.coverage);
      default:
        return sorted.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) || b.rating - a.rating);
    }
  }, [filteredPolicies, sortBy]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedPolicies,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: sortedPolicies,
    itemsPerPage: 6,
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId) 
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId].slice(-3) // Limit to 3 comparisons
    );
  };

  const handleApplyPolicy = (policy: InsurancePolicy) => {
    // Navigate to insurance application page
    navigate(`/insurance-application?policyId=${policy.id}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "car": return Car;
      case "bike": return Bike;
      case "health": return Heart;
      case "home": return Building2;
      default: return Shield;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "car": return "bg-white/10";
      case "bike": return "bg-white/10";
      case "health": return "bg-white/10";
      case "home": return "bg-white/10";
      default: return "bg-white/10";
    }
  };

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center py-4 px-4">
          <div className="flex-1 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/home")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">INSURANCE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Best coverage offers</p>
          </div>
          <div className="flex-1 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/insurance/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-insurance-info"
            >
              <Info className="h-5 w-5" />
            </Button>
            {selectedPolicies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompare(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none relative"
                data-testid="button-compare"
              >
                <Eye className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedPolicies.length}
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-insurance")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-my-insurance"
            >
              <Shield className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search insurance policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
            data-testid="input-search"
          />
        </div>

        {/* Categories Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-5 gap-0">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid={`tab-${category.id}`}
                >
                  {category.label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-light text-white/50 uppercase tracking-widest">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1 rounded-none"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2 block">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-none text-white text-sm font-light"
                >
                  <option value="popular">Most Popular</option>
                  <option value="premium-low">Premium: Low to High</option>
                  <option value="premium-high">Premium: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="coverage">Best Coverage</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2 block">Min Premium (₹)</label>
                  <Input 
                    placeholder="5000"
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-none text-white text-sm h-10"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2 block">Max Premium (₹)</label>
                  <Input 
                    placeholder="50000"
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-none text-white text-sm h-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Policies */}
      <div className="px-4 space-y-3 w-full max-w-screen-lg mx-auto">
        {paginatedPolicies.map((policy) => {
          const TypeIcon = getTypeIcon(policy.type);
          const isSelected = selectedPolicies.includes(policy.id);
          
          return (
            <div 
              key={policy.id} 
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => navigate(`/insurance/${policy.id}`)}
              data-testid={`card-policy-${policy.id}`}
            >
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-2xl">
                    {policy.providerLogo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-light text-white text-lg tracking-wide mb-1">{policy.provider}</h3>
                    <p className="text-[11px] text-white/60 tracking-wide">{policy.policyName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {policy.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] border-white/20 text-white/70 rounded-none uppercase tracking-widest">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white font-light">{policy.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">{policy.reviews.toLocaleString()}</span>
                </div>
                {policy.discountPercent && (
                  <div className="ml-auto">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Save {policy.discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Coverage</p>
                  <p className="text-xl font-light text-white tracking-tight">{formatCurrency(policy.coverage)}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Premium/Year</p>
                  <p className="text-xl font-light text-white tracking-tight">{formatCurrency(policy.premium)}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Claim Settlement</p>
                  <p className="text-lg font-light text-white tracking-tight">{policy.claimSettlement}%</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">
                    {policy.type === 'health' ? 'Network' : 'Garages'}
                  </p>
                  <p className="text-lg font-light text-white tracking-tight">
                    {policy.networkHospitals || policy.cashlessGarages}+
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2.5">
                  {policy.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 text-[10px] text-white/60 uppercase tracking-widest bg-white/5 px-2.5 py-1.5 border border-white/10">
                      <CheckCircle className="h-3 w-3 text-white/50" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <Button 
                  onClick={() => handleApplyPolicy(policy)}
                  className="flex-1 bg-white text-black hover:bg-white/90 font-light h-11 rounded-none tracking-widest text-[10px] uppercase"
                  data-testid={`button-apply-${policy.id}`}
                >
                  Buy Policy
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handlePolicySelect(policy.id)}
                  className={cn(
                    "flex-1 border border-white/20 text-white hover:bg-white/10 font-light h-11 rounded-none tracking-widest text-[10px] uppercase",
                    isSelected && "bg-white/10"
                  )}
                  data-testid={`button-select-${policy.id}`}
                >
                  {isSelected ? <CheckCircle className="h-3 w-3 mr-2" /> : <Plus className="h-3 w-3 mr-2" />}
                  {isSelected ? 'Selected' : 'Compare'}
                </Button>
              </div>
            </div>
          );
        })}
        
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

      {/* Empty State */}
      {sortedPolicies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <Shield className="h-16 w-16 text-white/20 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No insurance policies found</h3>
          <p className="text-center text-muted-foreground">
            Try adjusting your search or category filters
          </p>
        </div>
      )}

      {/* Comparison Dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-6xl bg-black text-white border-white/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-lg uppercase tracking-widest">
              Compare Insurance Policies
            </DialogTitle>
            <DialogDescription className="text-white/50 text-xs uppercase tracking-widest">
              Side-by-side comparison of selected policies
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-[11px] font-light text-white/50 uppercase tracking-widest w-48">
                    Features
                  </th>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <th key={policyId} className="p-4 border-l border-white/10">
                        <div className="flex flex-col items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPolicies(prev => prev.filter(id => id !== policyId))}
                            className="text-white/60 hover:text-white p-1 self-end"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className={cn("text-2xl", getTypeColor(policy.type))}>
                            {policy.providerLogo}
                          </div>
                          <div className="text-center">
                            <p className="text-white font-light text-sm mb-1">{policy.policyName}</p>
                            <p className="text-white/50 text-xs uppercase tracking-widest">{policy.provider}</p>
                          </div>
                        </div>
                      </th>
                    ) : null;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Coverage</td>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <td key={policyId} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {formatCurrency(policy.coverage)}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Annual Premium</td>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <td key={policyId} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {formatCurrency(policy.premium)}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Claim Settlement</td>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <td key={policyId} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {policy.claimSettlement}%
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Network/Garages</td>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <td key={policyId} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {policy.networkHospitals || policy.cashlessGarages}+
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Rating</td>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <td key={policyId} className="p-4 border-l border-white/10 text-center">
                        <div className="flex items-center justify-center gap-1 text-white font-light">
                          <Star className="h-3 w-3" />
                          {policy.rating}
                        </div>
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Action</td>
                  {selectedPolicies.map(policyId => {
                    const policy = mockInsurancePolicies.find(p => p.id === policyId);
                    return policy ? (
                      <td key={policyId} className="p-4 border-l border-white/10">
                        <Button
                          onClick={() => handleApplyPolicy(policy)}
                          className="w-full bg-white text-black hover:bg-white/90 font-light h-9 rounded-none tracking-widest text-xs uppercase"
                        >
                          Buy Now
                        </Button>
                      </td>
                    ) : null;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}