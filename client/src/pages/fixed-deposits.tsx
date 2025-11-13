import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { TOP_FIXED_DEPOSITS } from "@/data/fixed-deposits";
import {
  ArrowLeft,
  Search,
  TrendingUp,
  Shield,
  Award,
  Building2,
  Calculator,
  ChevronRight,
  Star,
  Clock,
  Percent,
  BadgeIndianRupee,
  Info
} from "lucide-react";

const FD_SCHEMES = Object.values(TOP_FIXED_DEPOSITS).map(fd => ({
  id: fd.id,
  bankName: fd.bankName,
  bankLogo: fd.bankLogo,
  fdName: fd.fdType,
  fdType: fd.fdType.toLowerCase().replace(/\s+/g, '_'),
  interestRate: fd.interestRate,
  seniorCitizenRate: fd.seniorCitizenRate,
  minAmount: fd.minDeposit,
  maxAmount: fd.maxDeposit,
  minTenure: fd.tenure,
  maxTenure: fd.tenure,
  tenureOptions: [fd.tenure],
  compoundingFrequency: fd.compoundingFrequency.toLowerCase(),
  rating: fd.rating,
  features: fd.benefits.slice(0, 3),
  fdCategory: fd.interestRate >= 7.5 ? "best_rates" : (fd.rating >= 4.5 ? "top_rated" : "regular"),
  taxBenefitSection: fd.taxSavingBenefit ? "80C" : undefined
}));

const MOCK_FD_SCHEMES = FD_SCHEMES.length > 0 ? FD_SCHEMES : [
  {
    id: "1",
    bankName: "HDFC Bank",
    fdName: "HDFC Regular Fixed Deposit",
    fdType: "regular",
    interestRate: 7.25,
    seniorCitizenRate: 7.75,
    minAmount: 5000,
    maxAmount: 10000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60, 120],
    compoundingFrequency: "quarterly",
    rating: 4.8,
    features: ["Premature withdrawal allowed", "Loan facility available", "Auto-renewal option"],
    fdCategory: "top_rated",
  },
  {
    id: "2",
    bankName: "SBI",
    fdName: "SBI Fixed Deposit Scheme",
    fdType: "regular",
    interestRate: 7.10,
    seniorCitizenRate: 7.60,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60, 120],
    compoundingFrequency: "quarterly",
    rating: 4.7,
    features: ["Nomination facility", "Flexible tenure", "Online booking"],
    fdCategory: "top_rated",
  },
  {
    id: "3",
    bankName: "ICICI Bank",
    fdName: "ICICI Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.15,
    seniorCitizenRate: 7.65,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.6,
    features: ["Instant FD", "Sweep-in facility", "Tax-saving options"],
    fdCategory: "best_rates",
  },
  {
    id: "4",
    bankName: "Axis Bank",
    fdName: "Axis Bank Regular Fixed Deposit",
    fdType: "regular",
    interestRate: 7.20,
    seniorCitizenRate: 7.70,
    minAmount: 5000,
    maxAmount: 50000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60, 84],
    compoundingFrequency: "quarterly",
    rating: 4.5,
    features: ["Digital account opening", "Easy renewal", "High interest rates"],
    fdCategory: "top_rated",
  },
  {
    id: "5",
    bankName: "Kotak Mahindra Bank",
    fdName: "Kotak Fixed Deposit",
    fdType: "regular",
    interestRate: 7.05,
    seniorCitizenRate: 7.55,
    minAmount: 5000,
    maxAmount: 100000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.4,
    features: ["Flexible tenure options", "Competitive rates", "Senior citizen benefits"],
    fdCategory: "best_rates",
  },
  {
    id: "6",
    bankName: "HDFC Bank",
    fdName: "HDFC Tax Saver FD",
    fdType: "tax_saver",
    interestRate: 7.00,
    seniorCitizenRate: 7.50,
    minAmount: 100,
    maxAmount: 1500000,
    minTenure: 60,
    maxTenure: 60,
    tenureOptions: [60],
    compoundingFrequency: "quarterly",
    rating: 4.7,
    features: ["Section 80C tax benefit", "5-year lock-in", "Up to ₹1.5L deduction"],
    fdCategory: "tax_saver",
    taxBenefitSection: "80C",
  },
  {
    id: "7",
    bankName: "Punjab National Bank",
    fdName: "PNB Term Deposit",
    fdType: "regular",
    interestRate: 7.00,
    seniorCitizenRate: 7.50,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.5,
    features: ["Easy online application", "Multiple tenure options", "Stable returns"],
    fdCategory: "top_rated",
  },
  {
    id: "8",
    bankName: "Yes Bank",
    fdName: "Yes Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.75,
    seniorCitizenRate: 8.25,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.3,
    features: ["Higher interest rates", "Quick processing", "Flexible options"],
    fdCategory: "best_rates",
  },
  {
    id: "9",
    bankName: "Bank of Baroda",
    fdName: "BoB Fixed Deposit",
    fdType: "regular",
    interestRate: 7.05,
    seniorCitizenRate: 7.55,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.4,
    features: ["Safe and secure", "Government bank", "Nationwide branches"],
    fdCategory: "top_rated",
  },
  {
    id: "10",
    bankName: "IDFC FIRST Bank",
    fdName: "IDFC FIRST Fixed Deposit",
    fdType: "regular",
    interestRate: 7.50,
    seniorCitizenRate: 8.00,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.5,
    features: ["High returns", "Digital banking", "Quick account opening"],
    fdCategory: "best_rates",
  },
  {
    id: "11",
    bankName: "Canara Bank",
    fdName: "Canara Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.10,
    seniorCitizenRate: 7.60,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.6,
    features: ["Trusted public sector bank", "Flexible tenure", "Easy withdrawal"],
    fdCategory: "top_rated",
  },
  {
    id: "12",
    bankName: "IndusInd Bank",
    fdName: "IndusInd Bank FD",
    fdType: "regular",
    interestRate: 7.40,
    seniorCitizenRate: 7.90,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.4,
    features: ["Competitive rates", "Easy online application", "Quick processing"],
    fdCategory: "best_rates",
  },
  {
    id: "13",
    bankName: "Union Bank of India",
    fdName: "Union Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.00,
    seniorCitizenRate: 7.50,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.5,
    features: ["Public sector security", "Pan-India presence", "Easy accessibility"],
    fdCategory: "top_rated",
  },
  {
    id: "14",
    bankName: "Federal Bank",
    fdName: "Federal Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.30,
    seniorCitizenRate: 7.80,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.3,
    features: ["Attractive rates", "Digital-first approach", "Customer-friendly"],
    fdCategory: "best_rates",
  },
  {
    id: "15",
    bankName: "Bank of India",
    fdName: "Bank of India FD Scheme",
    fdType: "regular",
    interestRate: 7.05,
    seniorCitizenRate: 7.55,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.6,
    features: ["Government backing", "Reliable returns", "Wide network"],
    fdCategory: "top_rated",
  },
  {
    id: "16",
    bankName: "RBL Bank",
    fdName: "RBL Fixed Deposit",
    fdType: "regular",
    interestRate: 7.60,
    seniorCitizenRate: 8.10,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.2,
    features: ["High interest rates", "Quick approval", "Flexible options"],
    fdCategory: "best_rates",
  },
  {
    id: "17",
    bankName: "Central Bank of India",
    fdName: "Central Bank FD",
    fdType: "regular",
    interestRate: 7.00,
    seniorCitizenRate: 7.50,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.5,
    features: ["Public sector reliability", "Easy process", "Good returns"],
    fdCategory: "top_rated",
  },
  {
    id: "18",
    bankName: "DCB Bank",
    fdName: "DCB Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.55,
    seniorCitizenRate: 8.05,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.3,
    features: ["Attractive rates", "Digital convenience", "Quick setup"],
    fdCategory: "best_rates",
  },
  {
    id: "19",
    bankName: "Indian Bank",
    fdName: "Indian Bank Fixed Deposit",
    fdType: "regular",
    interestRate: 7.05,
    seniorCitizenRate: 7.55,
    minAmount: 1000,
    maxAmount: 99999999,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.6,
    features: ["Government bank", "Safe investment", "Multiple branches"],
    fdCategory: "top_rated",
  },
  {
    id: "20",
    bankName: "Bandhan Bank",
    fdName: "Bandhan Bank FD",
    fdType: "regular",
    interestRate: 7.85,
    seniorCitizenRate: 8.35,
    minAmount: 10000,
    maxAmount: 100000000,
    minTenure: 12,
    maxTenure: 120,
    tenureOptions: [12, 18, 24, 36, 60],
    compoundingFrequency: "quarterly",
    rating: 4.4,
    features: ["Highest interest rates", "Quick processing", "Good service"],
    fdCategory: "best_rates",
  },
];

export default function FixedDeposits() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFDs = MOCK_FD_SCHEMES.filter((fd) => {
    const matchesSearch =
      fd.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fd.fdName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "top_rated" && fd.fdCategory === "top_rated") ||
      (selectedCategory === "best_rates" && fd.fdCategory === "best_rates") ||
      (selectedCategory === "tax_saver" && fd.fdCategory === "tax_saver");

    return matchesSearch && matchesCategory;
  });

  const pagination = usePagination({
    data: filteredFDs,
    itemsPerPage: 10,
  });

  useEffect(() => {
    pagination.goToPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Fixed Deposits</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Investment Plans</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/fixed-deposits/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-fixed-deposits-info"
            >
              <Info className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/fixed-deposits-calculator")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-calculator"
            >
              <Calculator className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search banks or FD schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 rounded-none"
            data-testid="input-search"
          />
        </div>

        {/* Tabs for Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 rounded-none p-1 h-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="top_rated"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-top-rated"
            >
              Top Rated
            </TabsTrigger>
            <TabsTrigger
              value="best_rates"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-best-rates"
            >
              Best Rates
            </TabsTrigger>
            <TabsTrigger
              value="tax_saver"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-tax-saver"
            >
              Tax Saver
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* FD List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              {filteredFDs.length} FD Schemes Available
            </h2>
          </div>

          {filteredFDs.length === 0 ? (
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60 mb-2">No FD schemes found</p>
                <p className="text-sm text-white/40">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pagination.paginatedData.map((fd) => (
                <Card
                  key={fd.id}
                  onClick={() => navigate(`/fixed-deposits/${fd.id}`)}
                  className="bg-white/5 border border-white/10 hover:border-white/20 rounded-none cursor-pointer transition-all"
                  data-testid={`card-fd-${fd.id}`}
                >
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-5 border-b border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-5 w-5 text-white/70" />
                            <h3 className="font-bold text-white text-lg" data-testid={`text-bank-name-${fd.id}`}>
                              {fd.bankName}
                            </h3>
                          </div>
                          <p className="text-sm text-white/60" data-testid={`text-fd-name-${fd.id}`}>
                            {fd.fdName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-white text-white" />
                          <span className="text-white/70 text-sm font-semibold" data-testid={`text-rating-${fd.id}`}>
                            {fd.rating}
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {fd.fdCategory === "tax_saver" && fd.taxBenefitSection && (
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Tax Saving
                          </Badge>
                        )}
                        {fd.rating >= 4.5 && (
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Top Rated
                          </Badge>
                        )}
                        {fd.interestRate >= 7.5 && (
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            High Returns
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Interest Rate Section */}
                    <div className="p-5 bg-white/5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Percent className="h-4 w-4 text-white/60" />
                            <p className="text-xs text-white/60 uppercase tracking-widest font-light">Interest Rate</p>
                          </div>
                          <p className="text-2xl font-bold text-white" data-testid={`text-interest-rate-${fd.id}`}>
                            {fd.interestRate}% <span className="text-sm text-white/50 font-light">p.a.</span>
                          </p>
                        </div>
                        {fd.seniorCitizenRate && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Percent className="h-4 w-4 text-white/60" />
                              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Senior Citizen</p>
                            </div>
                            <p className="text-2xl font-bold text-white" data-testid={`text-senior-rate-${fd.id}`}>
                              {fd.seniorCitizenRate}% <span className="text-sm text-white/50 font-light">p.a.</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-5 grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BadgeIndianRupee className="h-4 w-4 text-white/50" />
                        <div>
                          <p className="text-white/40 text-xs">Min Amount</p>
                          <p className="text-white font-semibold" data-testid={`text-min-amount-${fd.id}`}>
                            ₹{fd.minAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/50" />
                        <div>
                          <p className="text-white/40 text-xs">Tenure</p>
                          <p className="text-white font-semibold" data-testid={`text-tenure-${fd.id}`}>
                            {fd.minTenure}-{fd.maxTenure} months
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-5 pt-0">
                      <div className="flex items-center flex-wrap gap-2">
                        {fd.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-none border border-white/20"
                          >
                            {feature}
                          </span>
                        ))}
                        {fd.features.length > 2 && (
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-none border border-white/20">
                            +{fd.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="p-5 pt-0 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 ml-auto group rounded-none"
                        data-testid={`button-view-details-${fd.id}`}
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredFDs.length > 0 && (
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
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
