import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calculator, Star, Building, CheckCircle, Phone, MapPin, Award, Clock, DollarSign, FileText, Users, TrendingUp, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useUrlTab } from "@/hooks/use-url-tab";
import { getAuthHeaders } from "@/lib/auth";

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

// Mock loan data
const mockLoanData: Record<string, LoanOffer> = {
  "hdfc-personal": {
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
    reviews: 12450,
    features: ["Instant approval", "No collateral", "Flexible tenure", "Digital process"],
    eligibility: { minAge: 21, maxAge: 60, minSalary: 25000, employmentType: "Salaried" },
    benefits: ["Quick disbursement", "Competitive rates", "24/7 support"],
    tags: ["Popular", "Fast"],
    category: "personal",
    emi: 0,
    approvalTime: "30 mins",
    documentsRequired: ["ID Proof", "Income Proof", "Address Proof", "Bank Statement"],
    lenderUrl: "https://hdfc.com"
  }
};

const calculateEMI = (principal: number, annualRate: number, months: number): number => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};

export default function MarketplaceLoanDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [calculatedEmi, setCalculatedEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Use mock data for now
  const loan = mockLoanData[id || ""] || mockLoanData["hdfc-personal"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (loanAmount && loanTenure && loan) {
      const principal = parseFloat(loanAmount);
      const months = parseInt(loanTenure);
      
      if (!isNaN(principal) && !isNaN(months) && principal > 0 && months > 0) {
        const emi = calculateEMI(principal, loan.interestRate, months);
        const totalAmount = emi * months;
        const interest = totalAmount - principal;
        
        setCalculatedEmi(emi);
        setTotalInterest(interest);
      } else {
        setCalculatedEmi(null);
        setTotalInterest(0);
      }
    } else {
      setCalculatedEmi(null);
      setTotalInterest(0);
    }
  }, [loanAmount, loanTenure, loan]);

  if (!loan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Loan not found</h2>
          <Button onClick={() => navigate("/marketplace")} className="rounded-none bg-white text-black hover:bg-white/90">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleApply = () => {
    navigate(`/loan-application?loanType=${loan.category}&productId=${loan.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            onClick={() => navigate("/marketplace")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider uppercase">{loan.productName}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{loan.lenderName}</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Loan Info Card */}
        <div className="px-4 pb-4">
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-2xl">
                  {loan.lenderLogo}
                </div>
                <div>
                  <h2 className="text-white font-light text-base tracking-wide">{loan.lenderName}</h2>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-white fill-current" />
                    <span className="text-white/60 text-xs">{loan.rating} ({loan.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                <p className="text-white font-light text-2xl tracking-tight">{loan.interestRate}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Min Amount</p>
                <p className="text-white font-light text-sm">{formatCurrency(loan.minAmount)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Max Amount</p>
                <p className="text-white font-light text-sm">{formatCurrency(loan.maxAmount)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Tenure</p>
                <p className="text-white font-light text-sm">{loan.tenure}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with Tabs */}
      <div className="pt-[240px] px-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-calculator"
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="lender" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-lender"
            >
              Lender Info
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-4">
            {/* About Loan */}
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">About this Loan</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {loan.productName} by {loan.lenderName} offers competitive interest rates starting from {loan.interestRate}% p.a. 
                Get instant approval and quick disbursal with minimal documentation. Perfect for your personal financial needs.
              </p>
              <div className="flex flex-wrap gap-2">
                {loan.tags.map((tag, index) => (
                  <Badge key={index} className="bg-white/20 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Key Features</h3>
              <div className="space-y-2">
                {loan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Eligibility Criteria</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Age Range</p>
                    <p className="text-sm text-white">{loan.eligibility.minAge} - {loan.eligibility.maxAge} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Minimum Salary</p>
                    <p className="text-sm text-white">{formatCurrency(loan.eligibility.minSalary)}/month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Employment Type</p>
                    <p className="text-sm text-white">{loan.eligibility.employmentType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Required Documents</h3>
              <div className="grid grid-cols-1 gap-2">
                {loan.documentsRequired.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10">
                    <FileText className="h-4 w-4 text-white/60 flex-shrink-0" />
                    <span className="text-sm text-white/70">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Additional Benefits</h3>
              <div className="space-y-2">
                {loan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-white flex-shrink-0" />
                    <span className="text-sm text-white/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="mt-6 space-y-4">
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-white" />
                <h3 className="text-white font-light text-sm tracking-wide uppercase">EMI Calculator</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2 block">Loan Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder={`Min: ${loan.minAmount.toLocaleString()}, Max: ${loan.maxAmount.toLocaleString()}`}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-none text-white h-11 text-base font-light"
                    data-testid="input-loan-amount"
                  />
                  <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">
                    Range: {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
                  </p>
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
                  <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">Available: {loan.tenure}</p>
                </div>

                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Interest Rate</p>
                  <p className="text-lg font-light text-white tracking-tight">{loan.interestRate}% p.a.</p>
                </div>
              </div>

              {calculatedEmi !== null && (
                <div className="space-y-3 mt-5">
                  {/* Monthly EMI */}
                  <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Monthly EMI Payment</p>
                    <p className="text-3xl font-light text-white tracking-tight" data-testid="text-calculated-emi">
                      {formatCurrency(calculatedEmi)}
                    </p>
                    <p className="text-[10px] text-white/50 mt-2 uppercase tracking-widest">
                      Per month for {loanTenure} months
                    </p>
                  </div>

                  {/* Loan Breakdown */}
                  <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h4 className="text-white font-light text-sm tracking-wide uppercase mb-3">Loan Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Principal Amount</span>
                        <span className="text-base text-white font-light">{formatCurrency(parseFloat(loanAmount))}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Total Interest</span>
                        <span className="text-base text-white font-light">{formatCurrency(totalInterest)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-white uppercase tracking-widest">Total Payable</span>
                        <span className="text-lg text-white font-light">{formatCurrency(calculatedEmi * parseInt(loanTenure || "0"))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Principal vs Interest */}
                  <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h4 className="text-white font-light text-sm tracking-wide uppercase mb-3">Principal vs Interest</h4>
                    <div className="space-y-3">
                      {/* Visual Bar */}
                      <div className="flex h-8 overflow-hidden border border-white/20">
                        <div 
                          className="bg-white flex items-center justify-center text-[10px] text-black font-light uppercase tracking-widest"
                          style={{ width: `${(parseFloat(loanAmount) / (parseFloat(loanAmount) + totalInterest) * 100)}%` }}
                        >
                          {(parseFloat(loanAmount) / (parseFloat(loanAmount) + totalInterest) * 100).toFixed(0)}%
                        </div>
                        <div 
                          className="bg-white/30 flex items-center justify-center text-[10px] text-white font-light uppercase tracking-widest"
                          style={{ width: `${(totalInterest / (parseFloat(loanAmount) + totalInterest) * 100)}%` }}
                        >
                          {(totalInterest / (parseFloat(loanAmount) + totalInterest) * 100).toFixed(0)}%
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white"></div>
                          <span className="text-white/70 font-light">Principal ({formatCurrency(parseFloat(loanAmount))})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white/30"></div>
                          <span className="text-white/70 font-light">Interest ({formatCurrency(totalInterest)})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projection Details */}
                  <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h4 className="text-white font-light text-sm tracking-wide uppercase mb-3">Loan Duration & Costs</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Duration</p>
                        <p className="text-base font-light text-white">{loanTenure} Months</p>
                        <p className="text-[10px] text-white/40 mt-1">{Math.floor(parseInt(loanTenure) / 12)} Years {parseInt(loanTenure) % 12} Months</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Yearly Cost</p>
                        <p className="text-base font-light text-white">{formatCurrency(calculatedEmi * 12)}</p>
                        <p className="text-[10px] text-white/40 mt-1">Annual payment</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Processing Fee</p>
                        <p className="text-base font-light text-white">{loan.processingFee}</p>
                        <p className="text-[10px] text-white/40 mt-1">{formatCurrency(parseFloat(loanAmount) * parseFloat(loan.processingFee.replace('%', '')) / 100)}</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Interest Burden</p>
                        <p className="text-base font-light text-white">{((totalInterest / parseFloat(loanAmount)) * 100).toFixed(1)}%</p>
                        <p className="text-[10px] text-white/40 mt-1">Of principal</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Insights */}
                  <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h4 className="text-white font-light text-sm tracking-wide uppercase mb-3">Financial Insights</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-white/5">
                        <span className="text-white/60 mt-0.5">•</span>
                        <span className="text-white/70 text-sm font-light">
                          You'll pay {formatCurrency(totalInterest)} as interest over {Math.floor(parseInt(loanTenure) / 12)} years
                        </span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-white/5">
                        <span className="text-white/60 mt-0.5">•</span>
                        <span className="text-white/70 text-sm font-light">
                          Monthly EMI is {((calculatedEmi / loan.eligibility.minSalary) * 100).toFixed(1)}% of minimum salary requirement
                        </span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-white/5">
                        <span className="text-white/60 mt-0.5">•</span>
                        <span className="text-white/70 text-sm font-light">
                          Total payable: {formatCurrency(calculatedEmi * parseInt(loanTenure))} ({((totalInterest / parseFloat(loanAmount)) * 100).toFixed(0)}% more than borrowed)
                        </span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-white/5">
                        <span className="text-white/60 mt-0.5">•</span>
                        <span className="text-white/70 text-sm font-light">
                          Interest rate of {loan.interestRate}% will add {formatCurrency(totalInterest / parseInt(loanTenure))} to each EMI
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!calculatedEmi && (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-8 text-center mt-5">
                  <Calculator className="h-10 w-10 text-white/40 mx-auto mb-3" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Enter loan amount and tenure to calculate EMI</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Lender Info Tab */}
          <TabsContent value="lender" className="mt-6 space-y-4">
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 border border-white/20 flex items-center justify-center text-3xl">
                  {loan.lenderLogo}
                </div>
                <div>
                  <h3 className="text-white font-light text-lg tracking-wide">{loan.lenderName}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-white fill-current" />
                    <span className="text-white/60 text-sm">{loan.rating} ({loan.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-white/60 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Institution Type</p>
                    <p className="text-sm text-white">Leading Private Bank</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-white/60 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Established</p>
                    <p className="text-sm text-white">Trusted Financial Institution</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-white/60 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Approval Rate</p>
                    <p className="text-sm text-white">High Approval Success Rate</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-white/60 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Processing Time</p>
                    <p className="text-sm text-white">{loan.approvalTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-white/60 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Processing Fee</p>
                    <p className="text-sm text-white">{loan.processingFee} of loan amount</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-white/60 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Customer Support</p>
                    <p className="text-sm text-white">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose This Lender */}
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Why Choose {loan.lenderName}?</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                  <span className="text-sm text-white/70">Quick and hassle-free approval process</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                  <span className="text-sm text-white/70">Competitive interest rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                  <span className="text-sm text-white/70">Flexible repayment options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                  <span className="text-sm text-white/70">Dedicated customer support</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Apply Now Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={handleApply}
          className="w-full h-12 bg-white text-black hover:bg-white/90 font-light rounded-none text-base uppercase tracking-widest"
          data-testid="button-apply-now"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Apply Now - {loan.approvalTime} Approval
        </Button>
        <p className="text-center text-[10px] text-white/50 mt-2 uppercase tracking-widest font-light">
          Secure • No hidden charges • Quick approval
        </p>
      </div>
    </div>
  );
}
