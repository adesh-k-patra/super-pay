import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import type { LoanApplication } from "@shared/schema";
import { 
  CheckCircle, 
  Clock, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Loader2,
  CreditCard,
  Home,
  Car,
  User,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'home': return <Home className="h-5 w-5" />;
    case 'vehicle': return <Car className="h-5 w-5" />;
    case 'personal': return <User className="h-5 w-5" />;
    case 'business': return <Briefcase className="h-5 w-5" />;
    default: return <CreditCard className="h-5 w-5" />;
  }
};

export default function EmiDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const emiId = params.emiId;
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedTab, setSelectedTab] = useUrlTab("overview");

  // Get EMI data from mock data
  const emiDetail = mockEmiData.find(emi => emi.id === emiId);

  const { data: loanData, isLoading } = useQuery({
    queryKey: [`/api/loans/${emiDetail?.loanId}`],
    enabled: isAuthenticated && !!emiDetail?.loanId,
  });
  
  const loan = (loanData as any)?.loan as LoanApplication | undefined;
  const emiPayments = ((loanData as any)?.emiPayments as any[]) || [];

  // Generate amortization schedule
  const generateAmortizationSchedule = () => {
    if (!loan) return [];
    
    const principal = parseFloat(loan.amount || "0");
    const tenure = parseInt(String(loan.tenure || "0"));
    const interestRate = parseFloat(loan.interestRate || "0");
    const emi = parseFloat(loan.emi || "0");
    
    if (isNaN(principal) || isNaN(tenure) || isNaN(interestRate) || isNaN(emi) || 
        principal <= 0 || tenure <= 0 || emi <= 0) {
      return [];
    }
    
    const rate = interestRate / 100 / 12;
    let balance = principal;
    const schedule = [];
    
    for (let i = 1; i <= tenure; i++) {
      const interest = balance * rate;
      const principalPayment = emi - interest;
      balance -= principalPayment;
      
      schedule.push({
        month: i,
        emi: emi,
        principal: principalPayment,
        interest: interest,
        balance: Math.max(0, balance),
      });
    }
    
    return schedule;
  };

  const amortizationSchedule = generateAmortizationSchedule();
  const emisPaid = emiPayments.filter(payment => payment.status === 'success').length;

  // Generate EMI calendar
  const generateEmiCalendar = () => {
    if (!loan) return [];
    
    const startDate = loan.createdAt ? new Date(loan.createdAt) : new Date();
    const emiDates = [];
    
    for (let i = 0; i < loan.tenure; i++) {
      const emiDate = new Date(startDate);
      emiDate.setMonth(startDate.getMonth() + i + 1);
      
      const emiPayment = emiPayments[i];
      const scheduleItem = amortizationSchedule[i];
      
      emiDates.push({
        date: emiDate,
        month: i + 1,
        amount: parseFloat(loan.emi),
        status: emiPayment ? emiPayment.status : 'pending',
        principal: scheduleItem?.principal || 0,
        interest: scheduleItem?.interest || 0,
        balance: scheduleItem?.balance || 0,
      });
    }
    
    return emiDates;
  };

  const emiCalendar = generateEmiCalendar();

  const getCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, emiInfo: null });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, monthIndex, day);
      const emiInfo = emiCalendar.find(emi => {
        const emiDate = new Date(emi.date);
        return emiDate.getDate() === day && 
               emiDate.getMonth() === monthIndex && 
               emiDate.getFullYear() === year;
      });
      
      days.push({ date: currentDate, emiInfo });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays(selectedMonth);
  const emisForMonth = emiCalendar.filter(emi => {
    const emiDate = new Date(emi.date);
    return emiDate.getMonth() === selectedMonth.getMonth() && 
           emiDate.getFullYear() === selectedMonth.getFullYear();
  });

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const formatCurrency = (amount: string | number | undefined | null) => {
    if (amount === undefined || amount === null) return '₹0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculateTotalInterest = () => {
    if (!loan) return 0;
    const emi = parseFloat(loan.emi || "0");
    const tenure = parseInt(String(loan.tenure || "0"));
    const principal = parseFloat(loan.amount || "0");
    
    if (isNaN(emi) || isNaN(tenure) || isNaN(principal) || emi <= 0 || tenure <= 0 || principal <= 0) {
      return 0;
    }
    
    const totalPayable = emi * tenure;
    const totalInterest = totalPayable - principal;
    return Math.max(0, totalInterest);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (!emiDetail) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-white/60 mx-auto" />
          <p className="text-lg font-light text-white">EMI not found</p>
          <Button onClick={() => navigate("/my-emis")} className="bg-white text-black hover:bg-white/90 rounded-none">
            Back to My EMIs
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !loan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-white/80 mx-auto" />
          <p className="text-lg font-light text-white">Loading EMI details...</p>
        </div>
      </div>
    );
  }

  const totalPaid = emiPayments.reduce((sum: number, emi: any) => {
    if (emi.status !== 'success') return sum;
    const amount = parseFloat(emi.amount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const loanAmount = parseFloat(loan.amount || "0");
  const repaymentProgress = (loanAmount > 0 && isFinite(totalPaid)) 
    ? Math.min((totalPaid / loanAmount) * 100, 100) 
    : 0;

  const canPayEmi = emiDetail.status === 'upcoming' || emiDetail.status === 'overdue' || emiDetail.status === 'failed';

  return (
    <div className={cn("min-h-screen bg-black text-white", canPayEmi && "pb-24")}>
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
            <h1 className="text-base font-bold tracking-wider" data-testid="heading-emi-detail">EMI DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              EMI #{emiDetail.installmentNumber} of {emiDetail.totalInstallments}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* EMI Hero Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                  {getTypeIcon(emiDetail.loanType)}
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white capitalize">{emiDetail.loanType} Loan EMI</h2>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{emiDetail.lenderName}</p>
                  {emiDetail.vehicleNumber && (
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{emiDetail.vehicleNumber}</p>
                  )}
                </div>
              </div>
              <Badge className="bg-white/10 text-white/80 border-0 text-[10px] rounded-none px-2 py-0.5 uppercase tracking-widest">
                {emiDetail.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">EMI Amount</p>
                <p className="text-lg font-light text-white">{formatCurrency(emiDetail.amount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Due Date</p>
                <p className="text-lg font-light text-white">
                  {new Date(emiDetail.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Outstanding</p>
                <p className="text-lg font-light text-white">{formatCurrency(emiDetail.outstandingBalance)}</p>
              </div>
            </div>

            {/* Overdue/Failed Alert */}
            {emiDetail.status === 'overdue' && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 p-3 border border-white/20 bg-white/5">
                  <AlertTriangle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-white/80 uppercase tracking-widest mb-1">Overdue Payment</p>
                    <p className="text-[10px] text-white/50">
                      {emiDetail.daysPastDue} days overdue
                      {emiDetail.penaltyAmount && ` • Penalty: ${formatCurrency(emiDetail.penaltyAmount)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {emiDetail.status === 'failed' && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-start gap-2 p-3 border border-white/20 bg-white/5">
                  <AlertTriangle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-white/80 uppercase tracking-widest mb-1">Payment Failed</p>
                    <p className="text-[10px] text-white/50">Previous payment attempt was unsuccessful. Please retry payment.</p>
                  </div>
                </div>
              </div>
            )}

            {emiDetail.status === 'paid' && emiDetail.paymentDate && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Paid On</p>
                    <p className="text-sm text-white font-light">
                      {new Date(emiDetail.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {emiDetail.transactionId && (
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Transaction ID</p>
                      <p className="text-sm text-white font-light">{emiDetail.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EMI Breakdown */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Payment Breakdown</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Principal</p>
              <p className="text-xl font-light text-white">{formatCurrency(emiDetail.principalAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest</p>
              <p className="text-xl font-light text-white">{formatCurrency(emiDetail.interestAmount)}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-overview"
            >
              Loan Overview
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-history"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-schedule"
            >
              Schedule
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-3">
              {/* Loan Summary */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Loan Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Amount</p>
                    <p className="text-xl font-light text-white">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                    <p className="text-xl font-light text-white">{loan.interestRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Tenure</p>
                    <p className="text-lg font-light text-white">{loan.tenure} months</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Monthly EMI</p>
                    <p className="text-lg font-light text-white">{formatCurrency(loan.emi)}</p>
                  </div>
                </div>
              </div>

              {/* EMI Progress */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Repayment Progress</p>
                <div className="space-y-3">
                  <div className="w-full bg-white/10 h-1.5">
                    <div 
                      className="bg-white h-1.5 transition-all duration-300"
                      style={{ width: `${Math.min(repaymentProgress, 100)}%` }}
                      data-testid="progress-repayment"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center space-y-1">
                      <p className="text-2xl font-light text-white">{emisPaid}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Paid</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-2xl font-light text-white">{parseInt(String(loan.tenure || "0")) - emisPaid}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Remaining</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-2xl font-light text-white">{loan.tenure}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lender Information */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-white/60" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Lender Information</p>
                </div>
                
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white/60" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-white">{emiDetail.lenderName}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Authorized Lender</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      Customer Care
                    </span>
                    <span className="text-xs text-white font-light">1800-258-3838</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60 flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      Email
                    </span>
                    <span className="text-xs text-white font-light">loans@{emiDetail.lenderName.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-white/60 flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Branch
                    </span>
                    <span className="text-xs text-white font-light">Mumbai Main Branch</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="space-y-3">
              {emiPayments.length > 0 ? (
                emiPayments.map((emi: any, index: number) => (
                  <div 
                    key={emi.id || index} 
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                    data-testid={`payment-history-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                          {emi.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-white/60" />
                          ) : emi.status === 'pending' ? (
                            <Clock className="h-4 w-4 text-white/60" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-white/60" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white font-light tracking-wide">EMI #{index + 1}</p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">
                            {emi.paymentDate ? new Date(emi.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-light text-white tracking-tight">{formatCurrency(emi.amount)}</p>
                        <Badge className={cn(
                          "mt-1 rounded-none border-0 text-[10px] px-2 py-0.5 uppercase tracking-widest",
                          emi.status === 'success' && "bg-white/10 text-white/80",
                          emi.status === 'pending' && "bg-white/10 text-white/80",
                          emi.status === 'failed' && "bg-white/10 text-white/80"
                        )}>
                          {emi.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-12 text-center">
                  <Clock className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 font-light mb-1">No payment history yet</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Your EMI payments will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <div className="space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={previousMonth}
                    className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                    data-testid="button-prev-month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <p className="text-sm font-light text-white tracking-wider uppercase">
                    {selectedMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextMonth}
                    className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                    data-testid="button-next-month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={idx} className="text-center text-[10px] font-light text-white/50 py-2 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                  
                  {calendarDays.map((day, idx) => {
                    if (!day.date) {
                      return <div key={idx} className="aspect-square" />;
                    }
                    
                    const hasEmi = !!day.emiInfo;
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    const emiStatus = day.emiInfo?.status;
                    
                    return (
                      <div 
                        key={idx}
                        className={cn(
                          "aspect-square border border-white/10 flex items-center justify-center text-xs relative",
                          hasEmi && "bg-white/5",
                          isToday && "border-white/30",
                          emiStatus === 'success' && "bg-white/10",
                          emiStatus === 'pending' && "bg-white/5"
                        )}
                      >
                        <span className="text-white/60">{day.date.getDate()}</span>
                        {hasEmi && (
                          <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-white/60" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* EMI Details for Selected Month */}
                {emisForMonth.length > 0 && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">EMIs This Month</p>
                    {emisForMonth.map((emi, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-2">
                          {emi.status === 'success' ? (
                            <CheckCircle className="h-3 w-3 text-white/60" />
                          ) : (
                            <Clock className="h-3 w-3 text-white/60" />
                          )}
                          <span className="text-white/60">
                            {new Date(emi.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <span className="text-white font-light">{formatCurrency(emi.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Pay EMI Button */}
      {canPayEmi && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <Button 
            onClick={() => navigate(`/upi-payment?amount=${emiDetail.amount}&returnUrl=/emi-detail/${emiDetail.id}`)}
            className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none text-[10px] uppercase tracking-widest font-light"
            data-testid="button-pay-emi"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pay EMI - {formatCurrency(emiDetail.amount)}
          </Button>
        </div>
      )}
    </div>
  );
}
