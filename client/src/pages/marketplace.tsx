import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StandardDialog, ClickableDialogCard } from "@/components/ui/standard-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Search,
  Filter,
  Star,
  CheckCircle,
  X,
  Calculator,
  Building,
  Eye,
  Car,
  Users,
  FileText,
  Send,
  TrendingUp
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  views: number;
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
  displayLoanAmount?: number;
  displayTenureMonths?: number;
}

const calculateEMI = (principal: number, annualRate: number, months: number): number => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};

export default function Marketplace() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanOffer | null>(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [calculatedEmi, setCalculatedEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  
  // Fetch user's loans
  const { data: userLoans } = useQuery<any[]>({
    queryKey: ['/api/loans'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const mockLoans: LoanOffer[] = [
    {
      id: "hdfc-personal",
      lenderName: "HDFC Bank",
      lenderLogo: "🏦",
      productName: "Personal Loan Plus",
      interestRate: 10.5,
      maxAmount: 4000000,
      minAmount: 100000,
      tenure: "12-60 months",
      processingFee: "2.50%",
      rating: 4.5,
      views: 12450,
      features: ["Instant approval", "No collateral", "Flexible tenure", "Digital process"],
      eligibility: { minAge: 21, maxAge: 60, minSalary: 25000, employmentType: "Salaried" },
      benefits: ["Quick disbursement", "Competitive rates", "24/7 support"],
      tags: ["Popular", "Fast"],
      category: "personal",
      displayLoanAmount: 200000,
      displayTenureMonths: 24,
      emi: calculateEMI(200000, 10.5, 24),
      approvalTime: "30 mins",
      documentsRequired: ["ID Proof", "Income Proof"],
      lenderUrl: "https://hdfc.com"
    },
    {
      id: "sbi-home",
      lenderName: "SBI",
      lenderLogo: "🏛️",
      productName: "Home Loan Supreme",
      interestRate: 8.65,
      maxAmount: 10000000,
      minAmount: 500000,
      tenure: "10-30 years",
      processingFee: "0.35%",
      rating: 4.2,
      views: 8320,
      features: ["Low interest", "Tax benefits", "Flexible repayment", "Insurance coverage"],
      eligibility: { minAge: 23, maxAge: 62, minSalary: 35000, employmentType: "Salaried/Self-employed" },
      benefits: ["Lowest rates", "High amount", "Long tenure"],
      tags: ["Trusted", "Low Rate"],
      category: "home",
      displayLoanAmount: 5000000,
      displayTenureMonths: 240,
      emi: calculateEMI(5000000, 8.65, 240),
      approvalTime: "7 days",
      documentsRequired: ["ID Proof", "Income Proof", "Property Papers"],
      lenderUrl: "https://sbi.co.in"
    },
    {
      id: "icici-vehicle",
      lenderName: "ICICI Bank",
      lenderLogo: "🏪",
      productName: "Auto Loan Express",
      interestRate: 9.25,
      maxAmount: 2000000,
      minAmount: 100000,
      tenure: "12-84 months",
      processingFee: "1.00%",
      rating: 4.3,
      views: 6890,
      features: ["Quick approval", "Competitive rates", "Doorstep service", "Insurance tie-up"],
      eligibility: { minAge: 21, maxAge: 65, minSalary: 20000, employmentType: "Salaried" },
      benefits: ["Fast processing", "Doorstep delivery", "Pre-approved offers"],
      tags: ["Quick", "Convenient"],
      category: "vehicle",
      displayLoanAmount: 500000,
      displayTenureMonths: 48,
      emi: calculateEMI(500000, 9.25, 48),
      approvalTime: "2 hours",
      documentsRequired: ["ID Proof", "Income Proof", "Vehicle Invoice"],
      lenderUrl: "https://icicibank.com"
    }
  ];

  const categories = [
    { id: "all", name: "ALL LOANS", icon: FileText },
    { id: "personal", name: "PERSONAL", icon: Users },
    { id: "home", name: "HOME", icon: Building },
    { id: "vehicle", name: "VEHICLE", icon: Car }
  ];

  const filteredLoans = useMemo(() => mockLoans.filter((loan) => {
    const matchesCategory = selectedCategory === "all" || loan.category === selectedCategory;
    const matchesSearch = loan.lenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [mockLoans, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalItems = filteredLoans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedLoans = useMemo(() => filteredLoans.slice(startIndex - 1, endIndex), [filteredLoans, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Auto-calculate EMI when amount or tenure changes
  useEffect(() => {
    if (!selectedLoan || !loanAmount || !loanTenure) {
      setCalculatedEmi(null);
      setTotalInterest(0);
      return;
    }

    const principal = parseFloat(loanAmount);
    const months = parseInt(loanTenure);
    
    if (isNaN(principal) || isNaN(months) || principal <= 0 || months <= 0) {
      setCalculatedEmi(null);
      setTotalInterest(0);
      return;
    }

    const monthlyRate = selectedLoan.interestRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayable = emi * months;
    const interest = totalPayable - principal;
    
    setCalculatedEmi(Math.round(emi));
    setTotalInterest(Math.round(interest));
  }, [loanAmount, loanTenure, selectedLoan]);

  const openCalculator = (loan: LoanOffer) => {
    setSelectedLoan(loan);
    setShowCalculator(true);
    setLoanAmount(loan.displayLoanAmount?.toString() || "");
    setLoanTenure(loan.displayTenureMonths?.toString() || "");
    setCalculatedEmi(null);
    setTotalInterest(0);
  };

  const handleApplyLoan = (loanId: string, category: string) => {
    navigate(`/loan-application?loanType=${category}&productId=${loanId}`);
  };

  const handleLoanSelection = (loanId: string) => {
    setSelectedLoans(prev => {
      if (prev.includes(loanId)) {
        return prev.filter(id => id !== loanId);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, loanId];
      }
    });
  };

  const compareLoans = mockLoans.filter(loan => selectedLoans.includes(loan.id));

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MARKETPLACE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Best loan offers</p>
          </div>
          <div className="flex gap-2">
            {selectedLoans.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompare(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none relative"
                data-testid="button-compare"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedLoans.length}
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-loans")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none relative"
              data-testid="button-my-loans"
            >
              <FileText className="h-4 w-4" />
              {userLoans && userLoans.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {userLoans.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search lenders, loan types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
            data-testid="input-search-loans"
          />
        </div>

        {/* Categories Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid={`tab-${category.id}`}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Loan Cards */}
        <div className="space-y-3">
          {paginatedLoans.map((loan) => (
            <div 
              key={loan.id} 
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => navigate(`/marketplace/loan/${loan.id}`)}
              data-testid={`card-loan-${loan.id}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedLoans.includes(loan.id)}
                    onCheckedChange={() => handleLoanSelection(loan.id)}
                    className="border-white/20"
                    disabled={!selectedLoans.includes(loan.id) && selectedLoans.length >= 3}
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`checkbox-compare-${loan.id}`}
                  />
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-xl">
                    {loan.lenderLogo}
                  </div>
                  <div>
                    <h3 className="font-light text-white text-base tracking-wide">{loan.lenderName}</h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{loan.productName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {loan.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] border-white/20 text-white/70 rounded-none uppercase tracking-widest">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                  <p className="text-lg font-light text-white tracking-tight">{loan.interestRate}% p.a.</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Loan Amount</p>
                  <p className="text-lg font-light text-white tracking-tight">₹{((loan.displayLoanAmount || 0)/100000).toFixed(1)}L</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Monthly EMI</p>
                  <p className="text-lg font-light text-white tracking-tight">₹{loan.emi.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Tenure</p>
                  <p className="text-lg font-light text-white tracking-tight">{loan.displayTenureMonths} months</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Payable</p>
                  <p className="text-base font-light text-white tracking-tight">₹{((loan.emi * (loan.displayTenureMonths || 1))/100000).toFixed(2)}L</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Interest</p>
                  <p className="text-base font-light text-white tracking-tight">₹{(((loan.emi * (loan.displayTenureMonths || 1)) - (loan.displayLoanAmount || 0))/100000).toFixed(2)}L</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-3">
                  {loan.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 text-[10px] text-white/60 uppercase tracking-widest">
                      <CheckCircle className="h-3 w-3 text-white/50" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-white/60" />
                    <span className="text-[10px] text-white/60 tracking-widest">{loan.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-white/60" />
                    <span className="text-[10px] text-white/60 tracking-widest">{loan.views.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Fee: {loan.processingFee}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <Button 
                  onClick={() => handleApplyLoan(loan.id, loan.category)}
                  className="flex-1 bg-white text-black hover:bg-white/90 font-light h-11 rounded-none tracking-widest text-[10px] uppercase"
                  data-testid={`button-apply-${loan.id}`}
                >
                  Apply Loan
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openCalculator(loan)}
                  className="flex-1 border border-white/20 text-white hover:bg-white/10 font-light h-11 rounded-none tracking-widest text-[10px] uppercase"
                  data-testid={`button-calculate-${loan.id}`}
                >
                  <Calculator className="h-3 w-3 mr-2" />
                  Calculate
                </Button>
              </div>
            </div>
          ))}

          {filteredLoans.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              canGoNext={currentPage < totalPages}
              canGoPrevious={currentPage > 1}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              className="mt-8"
            />
          )}
        </div>

        {/* No Results */}
        {filteredLoans.length === 0 && (
          <div className="text-center py-16 border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <Search className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-base font-light text-white mb-2 uppercase tracking-widest">No Loans Found</h3>
            <p className="text-[10px] text-white/50 mb-6 uppercase tracking-widest">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-white text-black hover:bg-white/90 font-light rounded-none tracking-widest text-[10px] uppercase h-11"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="bg-black border border-white/20 text-white rounded-none">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold tracking-widest uppercase">EMI Calculator</DialogTitle>
            <DialogDescription className="text-[10px] text-white/50 uppercase tracking-widest">
              Calculate your monthly EMI and total interest
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="space-y-5">
              {/* Loan Info Header */}
              <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-xl">
                    {selectedLoan.lenderLogo}
                  </div>
                  <div>
                    <h3 className="font-light text-white text-base tracking-wide">{selectedLoan.lenderName}</h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{selectedLoan.productName}</p>
                  </div>
                </div>
                <div className="space-y-1 pt-3 border-t border-white/10">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                  <p className="text-lg font-light text-white tracking-tight">{selectedLoan.interestRate}% p.a.</p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2 block">Loan Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder={`Min: ${selectedLoan.minAmount.toLocaleString()}, Max: ${selectedLoan.maxAmount.toLocaleString()}`}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-none text-white h-11 text-base font-light"
                    data-testid="input-loan-amount"
                  />
                  <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">Range: ₹{selectedLoan.minAmount.toLocaleString()} - ₹{selectedLoan.maxAmount.toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2 block">Tenure (months)</label>
                  <Input
                    type="number"
                    placeholder="Enter tenure in months"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-none text-white h-11 text-base font-light"
                    data-testid="input-loan-tenure"
                  />
                  <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">Available: {selectedLoan.tenure}</p>
                </div>
              </div>

              {/* Results - Auto-calculated */}
              {calculatedEmi !== null && (
                <div className="space-y-3">
                  <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Monthly EMI Payment</p>
                    <p className="text-3xl font-light text-white tracking-tight" data-testid="text-calculated-emi">
                      ₹{calculatedEmi.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/50 mt-2 uppercase tracking-widest">
                      Per month for {loanTenure} months
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Total Amount</p>
                      <p className="text-lg font-light text-white tracking-tight">
                        ₹{(calculatedEmi * parseInt(loanTenure || "0")).toLocaleString()}
                      </p>
                    </div>
                    <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Total Interest</p>
                      <p className="text-lg font-light text-white tracking-tight">
                        ₹{totalInterest.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Principal Amount</p>
                        <p className="text-base font-light text-white tracking-tight">₹{parseFloat(loanAmount).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                        <p className="text-base font-light text-white tracking-tight">{selectedLoan.interestRate}% p.a.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!calculatedEmi && (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-8 text-center">
                  <Calculator className="h-10 w-10 text-white/40 mx-auto mb-3" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Enter loan amount and tenure to calculate EMI</p>
                </div>
              )}

              {/* Actions */}
              <Button
                variant="outline"
                onClick={() => setShowCalculator(false)}
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-11 font-light tracking-widest text-[10px] uppercase"
              >
                Close Calculator
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comparison Dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="bg-black border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-lg uppercase tracking-widest">
              Compare Loans
            </DialogTitle>
            <DialogDescription className="text-white/50 text-xs uppercase tracking-widest">
              Side-by-side comparison of selected loans
            </DialogDescription>
          </DialogHeader>
          
          {compareLoans.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-[11px] font-light text-white/50 uppercase tracking-widest w-48">
                      Features
                    </th>
                    {compareLoans.map((loan) => (
                      <th key={loan.id} className="p-4 border-l border-white/10">
                        <div className="flex flex-col items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoanSelection(loan.id)}
                            className="text-white/60 hover:text-white p-1 self-end"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="text-2xl">{loan.lenderLogo}</div>
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
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {loan.interestRate}% p.a.
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Loan Amount</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        ₹{(loan.minAmount/100000).toFixed(1)}L - ₹{(loan.maxAmount/100000).toFixed(1)}L
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Tenure</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {loan.tenure}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Processing Fee</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {loan.processingFee}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Monthly EMI</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        ₹{loan.emi.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Approval Time</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {loan.approvalTime}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Rating</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10 text-center">
                        <div className="flex items-center justify-center gap-1 text-white font-light">
                          <Star className="h-3 w-3" />
                          {loan.rating}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Key Features</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10">
                        <div className="space-y-2">
                          {loan.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-white/50 mt-0.5 flex-shrink-0" />
                              <span className="text-white/70 text-xs text-left">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Action</td>
                    {compareLoans.map((loan) => (
                      <td key={loan.id} className="p-4 border-l border-white/10">
                        <Button
                          onClick={() => {
                            setShowCompare(false);
                            handleApplyLoan(loan.id, loan.category);
                          }}
                          className="w-full bg-white text-black hover:bg-white/90 font-light h-9 rounded-none tracking-widest text-xs uppercase"
                        >
                          Apply Now
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-sm">Select loans to compare</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
