import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/queryClient";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import type { LoanApplication } from "@shared/schema";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle,
  Target,
  Home,
  Car,
  GraduationCap,
  Briefcase,
  User,
  FileText,
  BarChart3,
  Eye,
  EyeOff,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  Search
} from "lucide-react";

type LoanWithDetails = LoanApplication & {
  bankName?: string;
  approvedDate?: string | null;
};

const formatINR = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

export default function MyLoans() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [pendingLoanDialog, setPendingLoanDialog] = useState<LoanWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: loans = [], 
    isLoading, 
    error 
  } = useQuery<LoanWithDetails[]>({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
    placeholderData: [
      { id: "1", userId: "user1", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), amount: "1500000", status: "active", loanType: "home", emi: "12500", outstandingAmount: "1350000", totalPaid: "150000", interestRate: "8.5", tenure: 120, applicationNumber: "LN001", purpose: "Home purchase", approvedAmount: "1500000", disbursedAmount: "1500000", nextEmiDate: new Date("2024-12-15"), bankName: "HDFC Bank", approvedDate: "2024-01-15" },
      { id: "2", userId: "user1", createdAt: new Date("2024-02-10"), updatedAt: new Date("2024-02-10"), amount: "800000", status: "active", loanType: "vehicle", emi: "9200", outstandingAmount: "650000", totalPaid: "150000", interestRate: "9.2", tenure: 84, applicationNumber: "LN002", purpose: "Car purchase", approvedAmount: "800000", disbursedAmount: "800000", nextEmiDate: new Date("2024-12-10"), bankName: "ICICI Bank", approvedDate: "2024-02-10" },
      { id: "3", userId: "user1", createdAt: new Date("2024-03-05"), updatedAt: new Date("2024-03-05"), amount: "1000000", status: "active", loanType: "personal", emi: "12000", outstandingAmount: "800000", totalPaid: "200000", interestRate: "10.5", tenure: 60, applicationNumber: "LN003", purpose: "Personal", approvedAmount: "1000000", disbursedAmount: "1000000", nextEmiDate: new Date("2024-12-05"), bankName: "SBI", approvedDate: "2024-03-05" },
      { id: "4", userId: "user1", createdAt: new Date("2024-04-01"), updatedAt: new Date("2024-04-01"), amount: "750000", status: "pending", loanType: "personal", emi: "8500", outstandingAmount: "750000", totalPaid: "0", interestRate: "11.0", tenure: 48, applicationNumber: "LN004", purpose: "Personal", approvedAmount: null, disbursedAmount: null, nextEmiDate: null, bankName: "Axis Bank", approvedDate: null },
      { id: "5", userId: "user1", createdAt: new Date("2023-12-20"), updatedAt: new Date("2023-12-20"), amount: "1200000", status: "active", loanType: "business", emi: "14500", outstandingAmount: "980000", totalPaid: "220000", interestRate: "12.5", tenure: 60, applicationNumber: "LN005", purpose: "Business expansion", approvedAmount: "1200000", disbursedAmount: "1200000", nextEmiDate: new Date("2024-12-20"), bankName: "Kotak Bank", approvedDate: "2023-12-20" },
      { id: "6", userId: "user1", createdAt: new Date("2022-08-15"), updatedAt: new Date("2023-08-15"), amount: "600000", status: "completed", loanType: "education", emi: "0", outstandingAmount: "0", totalPaid: "600000", interestRate: "8.0", tenure: 48, applicationNumber: "LN006", purpose: "Education", approvedAmount: "600000", disbursedAmount: "600000", nextEmiDate: null, bankName: "HDFC Bank", approvedDate: "2022-08-15" },
      { id: "7", userId: "user1", createdAt: new Date("2024-04-12"), updatedAt: new Date("2024-04-12"), amount: "500000", status: "active", loanType: "personal", emi: "6800", outstandingAmount: "420000", totalPaid: "80000", interestRate: "9.8", tenure: 36, applicationNumber: "LN007", purpose: "Personal", approvedAmount: "500000", disbursedAmount: "500000", nextEmiDate: new Date("2024-12-12"), bankName: "ICICI Bank", approvedDate: "2024-04-12" },
      { id: "8", userId: "user1", createdAt: new Date("2024-05-01"), updatedAt: new Date("2024-05-01"), amount: "300000", status: "pending", loanType: "vehicle", emi: "4200", outstandingAmount: "300000", totalPaid: "0", interestRate: "8.9", tenure: 60, applicationNumber: "LN008", purpose: "Two wheeler", approvedAmount: null, disbursedAmount: null, nextEmiDate: null, bankName: "SBI", approvedDate: null },
      { id: "9", userId: "user1", createdAt: new Date("2022-06-10"), updatedAt: new Date("2023-06-10"), amount: "550000", status: "completed", loanType: "personal", emi: "0", outstandingAmount: "0", totalPaid: "550000", interestRate: "10.2", tenure: 36, applicationNumber: "LN009", purpose: "Personal", approvedAmount: "550000", disbursedAmount: "550000", nextEmiDate: null, bankName: "Yes Bank", approvedDate: "2022-06-10" },
      { id: "10", userId: "user1", createdAt: new Date("2024-01-30"), updatedAt: new Date("2024-01-30"), amount: "1400000", status: "active", loanType: "home", emi: "11200", outstandingAmount: "1250000", totalPaid: "150000", interestRate: "8.7", tenure: 120, applicationNumber: "LN010", purpose: "Home loan", approvedAmount: "1400000", disbursedAmount: "1400000", nextEmiDate: new Date("2024-12-30"), bankName: "PNB", approvedDate: "2024-01-30" }
    ]
  });

  const calculatedStats = useMemo(() => {
    const activeLoans = loans.filter(loan => loan.status === 'active');
    const pendingLoans = loans.filter(loan => loan.status === 'pending');
    const completedLoans = loans.filter(loan => loan.status === 'completed');
    
    const totalBorrowedAmount = loans.reduce((sum, loan) => sum + parseFloat(loan.amount || '0'), 0);
    const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + parseFloat(loan.amount || '0'), 0);
    const totalOutstanding = activeLoans.reduce((sum, loan) => sum + parseFloat(loan.outstandingAmount || '0'), 0);
    const monthlyEmi = activeLoans.reduce((sum, loan) => sum + parseFloat(loan.emi || '0'), 0);

    return {
      activeLoans,
      pendingLoans,
      completedLoans,
      totalBorrowedAmount,
      totalActiveAmount,
      totalOutstanding,
      monthlyEmi,
      totalLoans: loans.length
    };
  }, [loans]);

  const filteredLoans = useMemo(() => {
    let loansToFilter: LoanWithDetails[] = [];
    
    switch (selectedTab) {
      case "active":
        loansToFilter = calculatedStats.activeLoans;
        break;
      case "ended":
        loansToFilter = calculatedStats.completedLoans;
        break;
      case "pending":
        loansToFilter = calculatedStats.pendingLoans;
        break;
      case "overview":
      default:
        loansToFilter = loans;
        break;
    }
    
    // Apply search filter
    if (searchQuery) {
      loansToFilter = loansToFilter.filter(loan => 
        loan.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loan.bankName && loan.bankName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        loan.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return loansToFilter;
  }, [selectedTab, calculatedStats, loans, searchQuery]);

  // Add pagination
  const {
    paginatedData: paginatedLoans,
    currentPage,
    totalPages,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredLoans,
    itemsPerPage: 10,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'vehicle': return <Car className="h-5 w-5" />;
      case 'personal': return <User className="h-5 w-5" />;
      case 'business': return <Briefcase className="h-5 w-5" />;
      case 'education': return <GraduationCap className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    return 'bg-white/10 text-white border-white/20 rounded-none';
  };

  const getTenureProgress = (loan: LoanWithDetails) => {
    const totalTenure = loan.tenure || 60;
    const paidAmount = parseFloat(loan.totalPaid || '0');
    const loanAmount = parseFloat(loan.amount || '1');
    const repaymentProgress = (paidAmount / loanAmount) * 100;
    const tenureCompleted = (repaymentProgress / 100) * totalTenure;
    const monthsCompleted = Math.round(tenureCompleted);
    const monthsRemaining = totalTenure - monthsCompleted;
    
    return {
      progress: (monthsCompleted / totalTenure) * 100,
      monthsCompleted,
      monthsRemaining,
      totalTenure
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none">
          <CardContent className="p-12 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-lg font-medium text-white">Loading your loans...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-white mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Unable to Load Loans</h3>
            <p className="text-white/60 mb-6 max-w-md">
              We're having trouble loading your loan information. Please check your connection and try again.
            </p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/loans'] })}
              className="bg-white hover:bg-white/90 text-black rounded-none"
              data-testid="button-retry-loans"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY LOANS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All loans & repayments</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="border border-white/10 p-4 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl w-full min-w-0" data-testid="card-total-borrowed">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-xs uppercase tracking-widest font-light text-white/60 truncate">Total Borrowed</span>
            </div>
            <p className="text-xl font-light text-white break-words" data-testid="text-total-borrowed">
              {balanceVisible ? formatINR(calculatedStats.totalBorrowedAmount) : '••••••'}
            </p>
          </div>

          <div className="border border-white/10 p-4 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl w-full min-w-0" data-testid="card-outstanding">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-xs uppercase tracking-widest font-light text-white/60 truncate">Outstanding</span>
            </div>
            <p className="text-xl font-light text-white break-words" data-testid="text-outstanding">
              {balanceVisible ? formatINR(calculatedStats.totalOutstanding) : '••••••'}
            </p>
          </div>

          <div className="border border-white/10 p-4 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl w-full min-w-0" data-testid="card-monthly-emi">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-xs uppercase tracking-widest font-light text-white/60 truncate">Monthly EMI</span>
            </div>
            <p className="text-xl font-light text-white break-words" data-testid="text-monthly-emi">
              {balanceVisible ? formatINR(calculatedStats.monthlyEmi) : '••••••'}
            </p>
          </div>

          <div className="border border-white/10 p-4 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl w-full min-w-0" data-testid="card-active-loans">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-xs uppercase tracking-widest font-light text-white/60 truncate">Active Loans</span>
            </div>
            <p className="text-xl font-light text-white break-words" data-testid="text-active-loans">
              {calculatedStats.activeLoans.length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search loans by type, bank, or application number..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-loans"
          />
        </div>

        {/* Apply Loan Button */}
        <Button
          onClick={() => navigate('/marketplace')}
          className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none"
          data-testid="button-apply-loan"
        >
          <Plus className="h-4 w-4 mr-2" />
          Apply for New Loan
        </Button>

        {/* Tabs */}
        <div className="space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
                data-testid="tab-overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
                data-testid="tab-active"
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="ended" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
                data-testid="tab-ended"
              >
                Ended
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
                data-testid="tab-pending"
              >
                Pending
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value={selectedTab} className="mt-4">
              {filteredLoans.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {paginatedLoans.map((loan) => {
                    const tenureInfo = getTenureProgress(loan);
                    const repaymentProgress = ((parseFloat(loan.amount || '0') - parseFloat(loan.outstandingAmount || '0')) / parseFloat(loan.amount || '1')) * 100;
                    
                    return (
                      <div
                        key={loan.id}
                        onClick={() => {
                          if (loan.status === 'pending') {
                            setPendingLoanDialog(loan);
                          }
                        }}
                        className={`bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all duration-200 rounded-none w-full ${loan.status === 'pending' ? 'cursor-pointer' : ''}`}
                        data-testid={`loan-card-${loan.id}`}
                      >
                        <div className="space-y-4 w-full">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 w-full">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 border border-white/60 flex items-center justify-center flex-shrink-0">
                                {getTypeIcon(loan.loanType)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-white text-sm break-words capitalize">
                                  {loan.loanType} Loan
                                </h4>
                                <p className="text-xs text-white/60 break-words">{loan.bankName}</p>
                                <p className="text-xs text-white/40 truncate">ID: {loan.applicationNumber}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(loan.status)} border text-xs rounded-none flex-shrink-0`}>
                              {loan.status.toUpperCase()}
                            </Badge>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/10 pt-3">
                            <div className="min-w-0">
                              <span className="text-white/60 block mb-1">Loan Amount:</span>
                              <span className="text-white font-medium truncate block">
                                {balanceVisible ? formatINR(parseFloat(loan.amount || '0')) : '••••••'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-white/60 block mb-1">Interest Rate:</span>
                              <span className="text-white font-medium truncate block">{loan.interestRate}%</span>
                            </div>
                            {loan.status === 'active' && (
                              <>
                                <div className="min-w-0">
                                  <span className="text-white/60 block mb-1">Monthly EMI:</span>
                                  <span className="text-white font-medium truncate block">
                                    {balanceVisible ? formatINR(parseFloat(loan.emi || '0')) : '••••••'}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-white/60 block mb-1">Outstanding:</span>
                                  <span className="text-white font-medium truncate block">
                                    {balanceVisible ? formatINR(parseFloat(loan.outstandingAmount || '0')) : '••••••'}
                                  </span>
                                </div>
                              </>
                            )}
                            {loan.status === 'completed' && (
                              <div className="min-w-0 col-span-2">
                                <span className="text-white/60 block mb-1">Total Paid:</span>
                                <span className="text-white font-medium truncate block">
                                  {balanceVisible ? formatINR(parseFloat(loan.totalPaid || '0')) : '••••••'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bars for Active Loans */}
                          {loan.status === 'active' && (
                            <div className="space-y-3 border-t border-white/10 pt-3">
                              {/* Repayment Progress */}
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-white/60">Repayment Progress</span>
                                  <span className="text-xs font-medium text-white">
                                    {Math.round(repaymentProgress)}%
                                  </span>
                                </div>
                                <Progress value={repaymentProgress} className="h-2" />
                              </div>

                              {/* Tenure Progress */}
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-white/60">Tenure Progress</span>
                                  <span className="text-xs font-medium text-white">
                                    {tenureInfo.monthsCompleted} / {tenureInfo.totalTenure} months
                                  </span>
                                </div>
                                <Progress value={tenureInfo.progress} className="h-2" />
                                <p className="text-xs text-white/40 mt-1">
                                  {tenureInfo.monthsRemaining} months remaining
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 border-t border-white/10 pt-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (loan.status === 'pending') {
                                  setPendingLoanDialog(loan);
                                } else {
                                  navigate(`/loan/${loan.id}`);
                                }
                              }}
                              className="text-white/60 hover:text-white text-xs px-3 py-1 flex-1 rounded-none"
                              data-testid={`button-view-${loan.id}`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            {loan.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => navigate(`/upi-emi-payment/${loan.id}`)}
                                className="bg-white text-black hover:bg-white/90 text-xs px-3 py-1 flex-1 rounded-none"
                                data-testid={`button-pay-${loan.id}`}
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                Pay EMI
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                  
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
                </>
              ) : (
                <div className="bg-white/5 border border-white/10 p-12 text-center rounded-none">
                  <div className="w-16 h-16 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Loans Found
                  </h3>
                  <p className="text-white/60 mb-6 max-w-md mx-auto">
                    {selectedTab === 'overview' 
                      ? "You haven't applied for any loans yet."
                      : `No ${selectedTab} loans at the moment.`
                    }
                  </p>
                  <Button
                    onClick={() => navigate('/marketplace')}
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-apply-first-loan"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for Loan
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Pending Loan Dialog */}
      <Dialog open={!!pendingLoanDialog} onOpenChange={(open) => !open && setPendingLoanDialog(null)}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider">
              LOAN APPLICATION STATUS
            </DialogTitle>
          </DialogHeader>
          {pendingLoanDialog && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 border border-white/60 flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(pendingLoanDialog.loanType)}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-light text-white capitalize">
                    {pendingLoanDialog.loanType} Loan
                  </h3>
                  <p className="text-xs text-white/60">{pendingLoanDialog.bankName}</p>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                  PENDING
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-white/60 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">Application Under Review</p>
                    <p className="text-xs text-white/60 font-light">Your loan application is being processed by {pendingLoanDialog.bankName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Application ID</p>
                    <p className="text-xs font-medium text-white">{pendingLoanDialog.applicationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Applied Amount</p>
                    <p className="text-xs font-medium text-white">{formatINR(parseFloat(pendingLoanDialog.amount || '0'))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Interest Rate</p>
                    <p className="text-xs font-medium text-white">{pendingLoanDialog.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Tenure</p>
                    <p className="text-xs font-medium text-white">{pendingLoanDialog.tenure} months</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-none">
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Your application is currently being verified by the lender. You will receive a notification once the application is approved or if any additional documents are required. This process typically takes 1-3 business days.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setPendingLoanDialog(null)}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-10 text-sm font-light tracking-wider"
                data-testid="button-close-pending-dialog"
              >
                CLOSE
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
