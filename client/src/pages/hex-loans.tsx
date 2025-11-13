import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getAuthHeaders } from "@/lib/auth";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Shield,
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  Award,
  Zap,
  CreditCard,
  Building,
  Car,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Percent,
  DollarSign,
  Calendar,
  Target,
  Home,
  GitCompare,
  X,
  Calculator
} from "lucide-react";

interface LoanOffer {
  id: string;
  lenderName: string;
  lenderLogo: string;
  productName: string;
  interestRate: number;
  maxAmount: number;
  minAmount: number;
  tenure: string;
  processingFee: string;
  rating: number;
  reviews: number;
  features: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    minSalary: number;
    employmentType: string;
  };
  benefits: string[];
  tags: string[];
  category: string;
  emi: number;
  approvalTime: string;
  documentsRequired: string[];
  lenderUrl: string;
}

const superPayLoans = [
  {
    id: "superpay-personal-1", 
    productName: "SuperPay Personal Loan",
    lenderName: "SuperPay Finance",
    category: "personal",
    interestRate: 10.5,
    maxAmount: 5000000,
    minAmount: 100000,
    tenure: "12-60 months",
    processingFee: "1.5% + GST",
    rating: 4.8,
    reviews: 15420,
    features: ["Instant approval", "Flexible tenure", "Minimal documentation"],
    benefits: ["No prepayment charges", "Quick disbursal", "Competitive rates"],
    approvalTime: "2 minutes",
    tags: ["Popular", "Quick approval"],
    emi: 8500,
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minSalary: 25000,
      employmentType: "Salaried/Self-employed"
    },
    documentsRequired: ["PAN Card", "Aadhaar", "Salary slips"],
    color: "bg-primary",
    lenderLogo: "HP"
  },
  {
    id: "superpay-home-1",
    productName: "SuperPay Home Loan",
    category: "home",
    interestRate: 8.75,
    maxAmount: 50000000,
    minAmount: 1000000,
    tenure: "10-30 years",
    processingFee: "0.5% + GST",
    rating: 4.9,
    reviews: 8920,
    features: ["Special rates for women", "Balance transfer option", "Top-up facility"],
    benefits: ["Zero prepayment charges", "Quick approval", "Doorstep service"],
    approvalTime: "48 hours",
    tags: ["Best rates", "Women special"],
    emi: 7250,
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minSalary: 40000,
      employmentType: "Salaried/Self-employed"
    },
    documentsRequired: ["Property papers", "Income proof", "Identity proof"],
    lenderName: "SuperPay Finance",
    lenderLogo: "HP"
  },
  {
    id: "superpay-auto-1",
    productName: "SuperPay Car Loan",
    category: "auto",
    interestRate: 9.25,
    maxAmount: 2000000,
    minAmount: 200000,
    tenure: "1-7 years",
    processingFee: "1% + GST",
    rating: 4.7,
    reviews: 12340,
    features: ["Up to 90% financing", "New & used cars", "Insurance included"],
    benefits: ["Quick approval", "Doorstep delivery", "Flexible EMI"],
    approvalTime: "4 hours",
    tags: ["Fast approval", "90% funding"],
    emi: 15200,
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minSalary: 30000,
      employmentType: "Salaried/Self-employed"
    },
    documentsRequired: ["RC copy", "Insurance", "Income proof"],
    lenderName: "SuperPay Finance",
    lenderLogo: "HP"
  },
  {
    id: "superpay-education-1",
    productName: "SuperPay Education Loan",
    category: "education",
    interestRate: 9.5,
    maxAmount: 7500000,
    minAmount: 100000,
    tenure: "5-15 years",
    processingFee: "1% + GST",
    rating: 4.8,
    reviews: 6780,
    features: ["Study abroad coverage", "Moratorium period", "No collateral for <7.5L"],
    benefits: ["Tax benefits", "Flexible repayment", "Career guidance"],
    approvalTime: "24 hours",
    tags: ["Study abroad", "No collateral"],
    emi: 9800,
    eligibility: {
      minAge: 16,
      maxAge: 35,
      minSalary: 20000,
      employmentType: "Student/Parent"
    },
    documentsRequired: ["Admission letter", "Academic records", "Income proof"],
    lenderName: "SuperPay Finance",
    lenderLogo: "HP"
  },
  {
    id: "superpay-business-1",
    productName: "SuperPay Business Loan",
    category: "business",
    interestRate: 11.5,
    maxAmount: 10000000,
    minAmount: 500000,
    tenure: "1-5 years",
    processingFee: "2% + GST",
    rating: 4.6,
    reviews: 4560,
    features: ["Working capital", "Business expansion", "Equipment financing"],
    benefits: ["Quick disbursal", "Minimal collateral", "Business support"],
    approvalTime: "3 days",
    tags: ["SME friendly", "Growth funding"],
    emi: 22000,
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minSalary: 0,
      employmentType: "Business owner"
    },
    documentsRequired: ["Business proof", "GST returns", "Bank statements"],
    lenderName: "SuperPay Finance",
    lenderLogo: "HP"
  }
];

const categoryIcons = {
  personal: CreditCard,
  home: Building,
  auto: Car,
  education: GraduationCap,
  business: Briefcase
};

export default function SuperPayLoans() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const categories = [
    { id: "all", name: "All Products", count: superPayLoans.length },
    { id: "personal", name: "Personal", count: superPayLoans.filter(l => l.category === 'personal').length },
    { id: "home", name: "Home", count: superPayLoans.filter(l => l.category === 'home').length },
    { id: "auto", name: "Auto", count: superPayLoans.filter(l => l.category === 'auto').length },
    { id: "education", name: "Education", count: superPayLoans.filter(l => l.category === 'education').length },
    { id: "business", name: "Business", count: superPayLoans.filter(l => l.category === 'business').length }
  ];

  const filteredLoans = selectedCategory === "all" 
    ? superPayLoans 
    : superPayLoans.filter(loan => loan.category === selectedCategory);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedLoans,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredLoans,
    itemsPerPage: 6,
  });

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const handleApplyLoan = (loan: any) => {
    // Navigate to loan application with the loan type pre-selected
    navigate(`/loan-application?loanType=${loan.category}&productId=${loan.id}`);
  };

  const handleCompareToggle = (loanId: string) => {
    setSelectedLoans(prev => {
      if (prev.includes(loanId)) {
        return prev.filter(id => id !== loanId);
      } else if (prev.length < 3) {
        return [...prev, loanId];
      }
      return prev;
    });
  };

  const getComparisonLoans = () => {
    return superPayLoans.filter(loan => selectedLoans.includes(loan.id));
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 pt-8 pb-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="text-white p-2 hover:bg-white/20 rounded-full"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">SuperPay Loan Products</h1>
            <p className="text-white/80 text-sm">Exclusively designed for your needs</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                selectedCategory === category.id 
                  ? "bg-white text-white/80 shadow-lg" 
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
              data-testid={`button-category-${category.id}`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs h-4 px-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* SuperPay Benefits Banner */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-4 border border-white/20 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">Why Choose SuperPay?</h3>
              <p className="text-muted-foreground text-sm">Direct lender • No hidden charges • RBI registered</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Zap className="h-4 w-4 text-white/80" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">2-min approval</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Percent className="h-4 w-4 text-white/80" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Best rates</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Shield className="h-4 w-4 text-white/80" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">100% secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Bar - Shows when loans are selected */}
      {selectedLoans.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="h-5 w-5 text-white/80" />
              <span className="font-medium text-gray-900">
                {selectedLoans.length} loan{selectedLoans.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selectedLoans.length >= 2 && (
                <Button
                  onClick={() => setShowComparison(true)}
                  className="bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg"
                  data-testid="button-compare-loans"
                >
                  Compare Now
                </Button>
              )}
              <Button
                onClick={() => setSelectedLoans([])}
                variant="outline"
                size="sm"
                className="px-3"
                data-testid="button-clear-comparison"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Products List - Compact Modern Design */}
      <div className="px-4 space-y-4">
        {paginatedLoans.map((loan) => {
          const CategoryIcon = categoryIcons[loan.category as keyof typeof categoryIcons] || CreditCard;
          const isSelected = selectedLoans.includes(loan.id);
          
          // Modern compact color palette
          const loanColors = {
            personal: { gradient: "bg-primary", accent: "text-foreground", bg: "bg-card" },
            home: { gradient: "from-white/10 to-white/5", accent: "text-white/80", bg: "bg-white/5" },
            auto: { gradient: "from-white/10 to-white/5", accent: "text-white/80", bg: "bg-white/5" },
            education: { gradient: "from-white/10 to-white/5", accent: "text-white/80", bg: "bg-white/5" },
            business: { gradient: "from-white/10 to-white/5", accent: "text-white/80", bg: "bg-white/5" }
          };
          
          const colors = loanColors[loan.category as keyof typeof loanColors] || loanColors.personal;
          
          return (
            <div 
              key={loan.id}
              className={`relative group transition-all duration-300 ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              data-testid={`loan-card-${loan.id}`}
            >
              {/* Compact Modern Card */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Header with comparison checkbox */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                        <CategoryIcon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{loan.productName}</h3>
                          {loan.tags.includes("Popular") && (
                            <Badge className="bg-amber-100 text-amber-800 text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm font-medium mb-2">{loan.lenderName}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-white/80 fill-current" />
                            <span className="text-sm font-medium text-muted-foreground">{loan.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/80">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{loan.approvalTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Compare checkbox */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`compare-${loan.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleCompareToggle(loan.id)}
                          disabled={!isSelected && selectedLoans.length >= 3}
                          data-testid={`checkbox-compare-${loan.id}`}
                        />
                        <label htmlFor={`compare-${loan.id}`} className="text-sm text-muted-foreground cursor-pointer">
                          Compare
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics - Single Row */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${colors.accent}`}>{loan.interestRate}%</div>
                      <div className="text-xs text-muted-foreground">Interest Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{formatAmount(loan.maxAmount)}</div>
                      <div className="text-xs text-muted-foreground">Max Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{loan.tenure.split('-')[1] || loan.tenure}</div>
                      <div className="text-xs text-muted-foreground">Max Tenure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{formatAmount(loan.emi)}</div>
                      <div className="text-xs text-muted-foreground">EMI/month</div>
                    </div>
                  </div>

                  {/* Highlights - Compact */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {loan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                          <CheckCircle className="h-3 w-3 text-white/80" />
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons - Compact */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApplyLoan(loan)}
                      className={`flex-1 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300`}
                      data-testid={`button-apply-${loan.id}`}
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/emi-calculator?type=${loan.category}&rate=${loan.interestRate}`)}
                      className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl"
                      data-testid={`button-calculate-${loan.id}`}
                    >
                      <Calculator className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-white/20 rounded-none w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-light text-lg uppercase tracking-widest flex items-center gap-2">
                    Compare Loans
                  </h2>
                  <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Side-by-side comparison of selected loans</p>
                </div>
                <Button
                  onClick={() => setShowComparison(false)}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white/60 hover:text-white"
                  data-testid="button-close-comparison"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 text-[11px] font-light text-white/50 uppercase tracking-widest w-48">
                        Features
                      </th>
                      {getComparisonLoans().map((loan) => (
                        <th key={loan.id} className="p-4 border-l border-white/10">
                          <div className="flex flex-col items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLoans(prev => prev.filter(id => id !== loan.id))}
                              className="text-white/60 hover:text-white p-1 self-end"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="text-center">
                              <p className="text-white font-light text-sm mb-1">{loan.productName}</p>
                              <p className="text-white/50 text-xs uppercase tracking-widest">{loan.lenderName}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Interest Rate</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                          {loan.interestRate}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10 bg-white/5">
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Loan Amount</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                          {formatAmount(loan.minAmount)} - {formatAmount(loan.maxAmount)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Tenure</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                          {loan.tenure}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10 bg-white/5">
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Processing Fee</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                          {loan.processingFee}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">EMI Estimate</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                          {formatAmount(loan.emi)}/month
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10 bg-white/5">
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Approval Time</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                          {loan.approvalTime}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Action</td>
                      {getComparisonLoans().map((loan) => (
                        <td key={loan.id} className="p-4 border-l border-white/10">
                          <Button
                            onClick={() => {
                              setShowComparison(false);
                              handleApplyLoan(loan);
                            }}
                            className="w-full bg-white text-black hover:bg-white/90 font-light h-9 rounded-none tracking-widest text-xs uppercase"
                            data-testid={`button-apply-comparison-${loan.id}`}
                          >
                            Apply Now
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Footer */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 font-semibold">RBI Registered NBFC</p>
              <p className="text-white/80 text-sm">License: N-14.01999 • ISO 27001 Certified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}