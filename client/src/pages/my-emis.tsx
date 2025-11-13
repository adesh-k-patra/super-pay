import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import type { LoanApplication } from "@shared/schema";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CreditCard,
  IndianRupee,
  Eye,
  EyeOff,
  Home,
  Car,
  User,
  Briefcase,
  GraduationCap,
  Bell,
  BellOff,
  Loader2,
  Search
} from "lucide-react";

interface EmiDetail {
  id: string;
  loanId: string;
  loanType: string;
  lenderName: string;
  vehicleNumber?: string;
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid' | 'failed';
  installmentNumber: number;
  totalInstallments: number;
  interestAmount: number;
  principalAmount: number;
  outstandingBalance: number;
  paymentDate?: string;
  transactionId?: string;
  penaltyAmount?: number;
  daysPastDue?: number;
  autoPayEnabled: boolean;
  reminderEnabled: boolean;
}

const mockEmiData: EmiDetail[] = [
  {
    id: "emi-1",
    loanId: "1",
    loanType: "home",
    lenderName: "HDFC Bank",
    amount: 45000,
    dueDate: "2024-10-15",
    status: "upcoming",
    installmentNumber: 24,
    totalInstallments: 240,
    interestAmount: 35000,
    principalAmount: 10000,
    outstandingBalance: 2850000,
    autoPayEnabled: true,
    reminderEnabled: true
  },
  {
    id: "emi-2",
    loanId: "2",
    loanType: "vehicle",
    lenderName: "ICICI Bank",
    vehicleNumber: "DL-01-AB-1234",
    amount: 18500,
    dueDate: "2024-10-10",
    status: "overdue",
    installmentNumber: 36,
    totalInstallments: 60,
    interestAmount: 12000,
    principalAmount: 6500,
    outstandingBalance: 450000,
    daysPastDue: 5,
    penaltyAmount: 925,
    autoPayEnabled: false,
    reminderEnabled: true
  },
  {
    id: "emi-3",
    loanId: "3",
    loanType: "personal",
    lenderName: "SBI",
    amount: 8500,
    dueDate: "2024-09-15",
    status: "paid",
    installmentNumber: 12,
    totalInstallments: 36,
    interestAmount: 3500,
    principalAmount: 5000,
    outstandingBalance: 185000,
    paymentDate: "2024-09-14",
    transactionId: "TXN123456789",
    autoPayEnabled: true,
    reminderEnabled: true
  },
  {
    id: "emi-4",
    loanId: "4",
    loanType: "business",
    lenderName: "Axis Bank",
    amount: 25000,
    dueDate: "2024-10-20",
    status: "upcoming",
    installmentNumber: 18,
    totalInstallments: 48,
    interestAmount: 18000,
    principalAmount: 7000,
    outstandingBalance: 750000,
    autoPayEnabled: true,
    reminderEnabled: false
  },
  {
    id: "emi-5",
    loanId: "2",
    loanType: "vehicle",
    lenderName: "ICICI Bank",
    vehicleNumber: "DL-01-AB-1234",
    amount: 18500,
    dueDate: "2024-09-10",
    status: "failed",
    installmentNumber: 35,
    totalInstallments: 60,
    interestAmount: 12000,
    principalAmount: 6500,
    outstandingBalance: 468500,
    autoPayEnabled: false,
    reminderEnabled: true
  }
];

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'home': return <Home className="h-5 w-5" />;
    case 'vehicle': return <Car className="h-5 w-5" />;
    case 'personal': return <User className="h-5 w-5" />;
    case 'business': return <Briefcase className="h-5 w-5" />;
    case 'education': return <GraduationCap className="h-5 w-5" />;
    default: return <CreditCard className="h-5 w-5" />;
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'upcoming':
      return {
        className: 'bg-white/10 text-white border-white/10 rounded-none',
        icon: Clock,
        label: 'Upcoming'
      };
    case 'overdue':
      return {
        className: 'bg-white/10 text-white border-white/10 rounded-none',
        icon: AlertTriangle,
        label: 'Overdue'
      };
    case 'paid':
      return {
        className: 'bg-white/10 text-white border-white/10 rounded-none',
        icon: CheckCircle,
        label: 'Paid'
      };
    case 'failed':
      return {
        className: 'bg-white/10 text-white border-white/10 rounded-none',
        icon: AlertCircle,
        label: 'Failed'
      };
    default:
      return {
        className: 'bg-white/10 text-white border-white/10 rounded-none',
        icon: Clock,
        label: 'Unknown'
      };
  }
};

export default function MyEmis() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  const { 
    data: loans = [], 
    isLoading, 
    error 
  } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
  });

  const emiStats = useMemo(() => {
    const upcomingEmis = mockEmiData.filter(emi => emi.status === 'upcoming');
    const overdueEmis = mockEmiData.filter(emi => emi.status === 'overdue');
    const paidEmis = mockEmiData.filter(emi => emi.status === 'paid');
    const failedEmis = mockEmiData.filter(emi => emi.status === 'failed');

    const totalUpcomingAmount = upcomingEmis.reduce((sum, emi) => sum + emi.amount, 0);
    const totalOverdueAmount = overdueEmis.reduce((sum, emi) => sum + emi.amount + (emi.penaltyAmount || 0), 0);

    return {
      total: mockEmiData.length,
      upcoming: upcomingEmis.length,
      overdue: overdueEmis.length,
      paid: paidEmis.length,
      failed: failedEmis.length,
      totalUpcomingAmount,
      totalOverdueAmount,
      upcomingEmis,
      overdueEmis,
      paidEmis,
      failedEmis
    };
  }, []);

  const filteredEmis = useMemo(() => {
    let emis = mockEmiData;
    
    // Apply search filter
    if (searchQuery) {
      emis = emis.filter(emi => 
        emi.lenderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emi.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emi.vehicleNumber && emi.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply tab filter
    if (selectedTab === "all") return emis;
    return emis.filter(emi => emi.status === selectedTab);
  }, [selectedTab, searchQuery]);

  const pagination = usePagination({
    data: filteredEmis,
    itemsPerPage: 10,
  });

  const renderEmiCard = (emi: EmiDetail) => {
    const statusConfig = getStatusConfig(emi.status);
    const StatusIcon = statusConfig.icon;
    const daysUntilDue = Math.ceil((new Date(emi.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div
        key={emi.id}
        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
        data-testid={`emi-card-${emi.id}`}
      >
        <div className="space-y-4 w-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 w-full">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 border border-white/20 flex items-center justify-center flex-shrink-0">
                {getTypeIcon(emi.loanType)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-light text-white text-sm tracking-wide break-words">
                  {emi.lenderName}
                </h4>
                <p className="text-[10px] text-white/50 break-words capitalize tracking-widest">{emi.loanType} loan</p>
                {emi.vehicleNumber && (
                  <p className="text-[10px] text-white/40 truncate tracking-wide">{emi.vehicleNumber}</p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-light text-white tracking-tight whitespace-nowrap" data-testid={`text-amount-${emi.id}`}>
                {balanceVisible ? formatINR(emi.amount) : '••••••'}
              </p>
              {emi.penaltyAmount && emi.penaltyAmount > 0 && (
                <p className="text-[10px] text-white/50 whitespace-nowrap tracking-wide">
                  +₹{emi.penaltyAmount} penalty
                </p>
              )}
            </div>
          </div>

          {/* Status Badge & Due Date */}
          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <Badge className={`${statusConfig.className} border text-[10px] uppercase tracking-widest rounded-none`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
            <div className="text-right">
              <p className="text-[10px] text-white/50 tracking-wide">Due: {new Date(emi.dueDate).toLocaleDateString()}</p>
              {emi.status === 'upcoming' && daysUntilDue >= 0 && (
                <p className="text-[10px] text-white/50 tracking-wide">
                  {daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                </p>
              )}
              {emi.status === 'overdue' && emi.daysPastDue && (
                <p className="text-[10px] text-white/50 tracking-wide">{emi.daysPastDue} days overdue</p>
              )}
              {emi.status === 'paid' && emi.paymentDate && (
                <p className="text-[10px] text-white/50 tracking-wide">Paid: {new Date(emi.paymentDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
            <div className="min-w-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Installment</span>
              <span className="text-sm text-white font-light tracking-wide truncate block">
                {emi.installmentNumber}/{emi.totalInstallments}
              </span>
              <div className="w-full bg-white/10 h-1 mt-1.5">
                <div 
                  className="bg-white h-1 transition-all duration-300"
                  style={{ width: `${(emi.installmentNumber / emi.totalInstallments) * 100}%` }}
                />
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Outstanding</span>
              <span className="text-sm text-white font-light tracking-tight truncate block">
                {balanceVisible ? formatINR(emi.outstandingBalance) : '••••••'}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Principal</span>
              <span className="text-sm text-white font-light tracking-tight truncate block">
                {balanceVisible ? formatINR(emi.principalAmount) : '•••'}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">Interest</span>
              <span className="text-sm text-white font-light tracking-tight truncate block">
                {balanceVisible ? formatINR(emi.interestAmount) : '•••'}
              </span>
            </div>
          </div>

          {/* Settings & Actions */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  emi.autoPayEnabled ? "bg-white" : "bg-white/40"
                )} />
                <span className="text-white/50 tracking-wide">
                  Auto-pay {emi.autoPayEnabled ? 'on' : 'off'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {emi.reminderEnabled ? (
                  <Bell className="h-3 w-3 text-white/50" />
                ) : (
                  <BellOff className="h-3 w-3 text-white/40" />
                )}
                <span className="text-white/50 tracking-wide">
                  Reminder {emi.reminderEnabled ? 'on' : 'off'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {(emi.status === 'upcoming' || emi.status === 'overdue' || emi.status === 'failed') && (
                <Button
                  size="sm"
                  onClick={() => navigate(`/upi-payment?amount=${emi.amount}&returnUrl=/my-emis`)}
                  className="bg-white text-black hover:bg-white/90 text-[10px] uppercase tracking-widest px-3 py-1.5 flex-1 rounded-none font-light"
                  data-testid={`button-pay-${emi.id}`}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Pay Now
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/emi/${emi.id}`)}
                className="text-white border-white/20 hover:bg-white/5 text-[10px] uppercase tracking-widest px-3 py-1.5 flex-1 rounded-none font-light"
                data-testid={`button-view-loan-${emi.id}`}
              >
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = (tabValue: string) => (
    <TabsContent value={tabValue} className="mt-6">
      {filteredEmis.length > 0 ? (
        <div className="space-y-3">
          {pagination.paginatedData.map(renderEmiCard)}
          
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
        </div>
      ) : (
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <IndianRupee className="h-8 w-8 text-white/60" />
          </div>
          <h3 className="text-lg font-light text-white mb-2 tracking-wide">
            No EMIs Found
          </h3>
          <p className="text-[10px] text-white/50 mb-6 max-w-md mx-auto uppercase tracking-widest">
            {tabValue === 'all' 
              ? "You don't have any EMIs yet."
              : `No ${tabValue} EMIs found.`
            }
          </p>
          {tabValue === 'all' && (
            <Button
              onClick={() => navigate('/marketplace')}
              className="bg-white text-black hover:bg-white/90 rounded-none text-[10px] uppercase tracking-widest font-light"
              data-testid="button-apply-loan"
            >
              <Plus className="h-4 w-4 mr-2" />
              Apply for Loan
            </Button>
          )}
        </div>
      )}
    </TabsContent>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-none">
          <CardContent className="p-12 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-sm font-light text-white tracking-wide">Loading your EMIs...</p>
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
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY EMIs</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">EMI dashboard</p>
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
        {/* Hero Summary Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Upcoming EMIs</p>
              <p className="text-3xl font-light text-white tracking-tight mb-1">
                {balanceVisible ? formatINR(emiStats.totalUpcomingAmount) : '••••••'}
              </p>
              <p className="text-[10px] text-white/40 tracking-wide">
                {emiStats.upcoming} installments
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Overdue Amount</p>
              <p className="text-3xl font-light text-white tracking-tight mb-1">
                {balanceVisible ? formatINR(emiStats.totalOverdueAmount) : '••••••'}
              </p>
              <p className="text-[10px] text-white/40 tracking-wide">
                {emiStats.overdue} installments
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search by lender, loan type, or vehicle number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
            data-testid="input-search"
          />
        </div>

        <Button
          onClick={() => navigate("/marketplace")}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-new-emi"
        >
          <Plus className="h-4 w-4 mr-2" />
          Apply for New Loan
        </Button>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-5 gap-0">
              <TabsTrigger 
                value="all" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                data-testid="tab-all"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                data-testid="tab-upcoming"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger 
                value="overdue" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                data-testid="tab-overdue"
              >
                Overdue
              </TabsTrigger>
              <TabsTrigger 
                value="paid" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                data-testid="tab-paid"
              >
                Paid
              </TabsTrigger>
              <TabsTrigger 
                value="failed" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70" 
                data-testid="tab-failed"
              >
                Failed
              </TabsTrigger>
            </TabsList>

            {renderTabContent("all")}
            {renderTabContent("upcoming")}
            {renderTabContent("overdue")}
            {renderTabContent("paid")}
            {renderTabContent("failed")}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
