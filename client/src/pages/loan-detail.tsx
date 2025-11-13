import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import type { LoanApplication } from "@shared/schema";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar as CalendarIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  AlertTriangle,
  DollarSign,
  Percent,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoanDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const loanId = params.loanId;
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedTab, setSelectedTab] = useUrlTab("overview");

  const { data: loanData, isLoading } = useQuery({
    queryKey: [`/api/loans/${loanId}`],
    enabled: isAuthenticated && !!loanId,
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

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (isLoading || !loan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-white/80 mx-auto" />
          <p className="text-lg font-light text-white">Loading loan details...</p>
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

  const isLoanComplete = loan.status === 'closed' || repaymentProgress >= 100;

  return (
    <div className={cn("min-h-screen bg-black text-white", !isLoanComplete && "pb-24")}>
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
            <h1 className="text-base font-bold tracking-wider" data-testid="heading-loan-detail">LOAN DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{loan.applicationNumber}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-white capitalize">{loan.loanType} Loan</h2>
                <Badge className="mt-1.5 bg-white/10 text-white/80 border-0 text-[10px] rounded-none px-2 py-0.5 uppercase tracking-widest">
                  {loan.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Principal</p>
                <p className="text-3xl font-light text-white tracking-tight">{formatCurrency(loan.amount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">EMI</p>
                <p className="text-lg font-light text-white">{formatCurrency(loan.emi || '0')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Tenure</p>
                <p className="text-lg font-light text-white">{loan.tenure} months</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Rate</p>
                <p className="text-lg font-light text-white">{loan.interestRate}%</p>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                <span>Repayment Progress</span>
                <span>{Math.round(repaymentProgress)}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5">
                <div 
                  className="bg-white h-1.5 transition-all duration-300"
                  style={{ width: `${Math.min(repaymentProgress, 100)}%` }}
                  data-testid="progress-repayment"
                />
              </div>
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
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-history"
            >
              History
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
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Outstanding</p>
                    <p className="text-xl font-light text-white">{formatCurrency((loan as any).remainingAmount || "0")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Interest</p>
                    <p className="text-lg font-light text-white">{formatCurrency(calculateTotalInterest())}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Amount Paid</p>
                    <p className="text-lg font-light text-white">{formatCurrency(totalPaid)}</p>
                  </div>
                </div>
              </div>

              {/* EMI Progress */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">EMI Progress</p>
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

              {/* Loan Details */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Loan Information</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60 uppercase tracking-wider">Disbursement Date</span>
                    <span className="text-xs text-white font-light">
                      {new Date((loan as any).disbursementDate || loan.createdAt || Date.now()).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60 uppercase tracking-wider">Maturity Date</span>
                    <span className="text-xs text-white font-light">
                      {new Date(new Date((loan as any).disbursementDate || loan.createdAt || Date.now()).setMonth(new Date((loan as any).disbursementDate || loan.createdAt || Date.now()).getMonth() + parseInt(String(loan.tenure || "0")))).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-white/60 uppercase tracking-wider">Application No.</span>
                    <span className="text-xs text-white font-light">{loan.applicationNumber}</span>
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
                    <p className="text-base font-medium text-white">{(loan as any).lender || 'HDFC Bank'}</p>
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
                    <span className="text-xs text-white font-light">loans@hdfcbank.com</span>
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
                    const isToday = day.date && 
                      day.date.toDateString() === new Date().toDateString();
                    const hasEmi = !!day.emiInfo;
                    const emiStatus = day.emiInfo?.status;
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "aspect-square p-1 border border-white/10 flex flex-col items-center justify-center relative",
                          !day.date && "bg-transparent border-transparent",
                          day.date && "bg-white/5 hover:bg-white/10 cursor-pointer",
                          isToday && "ring-1 ring-white/40",
                          hasEmi && emiStatus === 'success' && "bg-white/10 border-white/20",
                          hasEmi && emiStatus === 'pending' && "bg-white/10 border-white/20",
                          hasEmi && emiStatus === 'failed' && "bg-white/10 border-white/20"
                        )}
                        data-testid={`calendar-day-${day.date?.getDate()}`}
                      >
                        {day.date && (
                          <>
                            <span className="text-xs text-white font-light">
                              {day.date.getDate()}
                            </span>
                            {hasEmi && (
                              <div className="absolute bottom-0.5 left-0.5 right-0.5">
                                <div className={cn(
                                  "h-0.5 rounded-full",
                                  emiStatus === 'success' && "bg-white",
                                  emiStatus === 'pending' && "bg-white/50",
                                  emiStatus === 'failed' && "bg-white/30"
                                )} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* EMIs This Month */}
                {emisForMonth.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">EMIs this month ({emisForMonth.length})</p>
                    {emisForMonth.map((emi) => (
                      <div 
                        key={emi.month}
                        className="flex items-center justify-between p-3 border border-white/10 hover:border-white/20 transition-all"
                        data-testid={`emi-month-${emi.month}`}
                      >
                        <div>
                          <p className="text-sm text-white font-light">
                            {new Date(emi.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">EMI #{emi.month}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-light text-white">{formatCurrency(emi.amount)}</p>
                          <Badge className={cn(
                            "mt-0.5 rounded-none border-0 text-[9px] px-1.5 py-0 uppercase tracking-widest",
                            emi.status === 'success' && "bg-white/10 text-white/80",
                            emi.status === 'pending' && "bg-white/10 text-white/80",
                            emi.status === 'failed' && "bg-white/10 text-white/80"
                          )}>
                            {emi.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="flex gap-3 flex-wrap pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-white/10 border border-white/20" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Paid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-white/10 border border-white/20" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 ring-1 ring-white/40" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Pay Now Button - Only for incomplete loans */}
      {!isLoanComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <Button
            onClick={() => navigate('/upi-emi-payment')}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-sm font-light tracking-wider"
            data-testid="button-pay-now"
          >
            PAY NOW
          </Button>
        </div>
      )}
    </div>
  );
}
