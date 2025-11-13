import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { 
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  Activity,
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Target
} from "lucide-react";

interface LoanDetail {
  id: string;
  amount: string;
  status: string;
  loanType: string;
  emi: string;
  outstandingAmount: string;
  totalPaid: string;
  interestRate: string;
  tenure: number;
  applicationNumber: string;
  bankName: string;
  nextEmiDate?: Date | null;
  approvedDate?: string;
  disbursedAmount?: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  principal: number;
  interest: number;
}

export default function LoanDetails() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { loanId } = useParams();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: loanData } = useQuery<LoanDetail>({
    queryKey: ['/api/loans', loanId],
    enabled: isAuthenticated,
    placeholderData: {
      id: loanId || "1",
      amount: "1500000",
      status: "active",
      loanType: "home",
      emi: "12500",
      outstandingAmount: "1350000",
      totalPaid: "150000",
      interestRate: "8.5",
      tenure: 120,
      applicationNumber: "LN001",
      bankName: "HDFC Bank",
      nextEmiDate: new Date("2024-12-15"),
      approvedDate: "2024-01-15",
      disbursedAmount: "1500000"
    }
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  const loan = loanData;

  if (!loan) {
    return null;
  }

  const mockPaymentHistory: Payment[] = [
    { id: "p1", date: "2024-11-15", amount: 12500, status: "paid", principal: 7500, interest: 5000 },
    { id: "p2", date: "2024-10-15", amount: 12500, status: "paid", principal: 7450, interest: 5050 },
    { id: "p3", date: "2024-09-15", amount: 12500, status: "paid", principal: 7400, interest: 5100 },
    { id: "p4", date: "2024-08-15", amount: 12500, status: "paid", principal: 7350, interest: 5150 },
    { id: "p5", date: "2024-07-15", amount: 12500, status: "paid", principal: 7300, interest: 5200 },
    { id: "p6", date: "2024-06-15", amount: 12500, status: "paid", principal: 7250, interest: 5250 },
    { id: "p7", date: "2024-05-15", amount: 12500, status: "paid", principal: 7200, interest: 5300 },
    { id: "p8", date: "2024-04-15", amount: 12500, status: "paid", principal: 7150, interest: 5350 },
    { id: "p9", date: "2024-03-15", amount: 12500, status: "paid", principal: 7100, interest: 5400 },
    { id: "p10", date: "2024-02-15", amount: 12500, status: "paid", principal: 7050, interest: 5450 },
  ];

  const loanOfficer = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@hdfcbank.com",
    branch: "Koramangala, Bangalore"
  };

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
    switch (status) {
      case 'active': return 'bg-white/10 text-white/80 border-emerald-400/50';
      case 'pending': return 'bg-white/10 text-white/80 border-white/20';
      case 'completed': return 'bg-white/10 text-white/80 border-white/20';
      case 'rejected': return 'bg-white/10 text-white/80 border-white/20';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  const formatINR = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num) || num === null || num === undefined) {
      return '₹0';
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const repaymentProgress = (parseFloat(loan.totalPaid) / parseFloat(loan.amount)) * 100;

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const emiDay = loan.nextEmiDate ? new Date(loan.nextEmiDate).getDate() : 15;
    const currentMonthNumber = currentMonth.getMonth();
    const currentYear = currentMonth.getFullYear();

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isEmiDay = day === emiDay;
      const isPastEmi = new Date(currentYear, currentMonthNumber, day) < new Date();
      
      days.push(
        <div
          key={day}
          data-testid={`calendar-day-${day}`}
          className={`h-10 flex items-center justify-center text-sm ${
            isEmiDay 
              ? isPastEmi
                ? 'bg-white/10 text-white/80 border border-emerald-400/50 rounded-none'
                : 'bg-white/10 text-white/80 border border-white/20 rounded-none'
              : 'text-white/70'
          }`}
        >
          {day}
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="text-white/60 hover:text-white hover:bg-white/10"
            data-testid="button-prev-month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-white font-medium" data-testid="text-current-month">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="text-white/60 hover:text-white hover:bg-white/10"
            data-testid="button-next-month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-white/40 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/10 border border-emerald-400/50 rounded-none" />
            <span className="text-white/60">Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/10 border border-white/20 rounded-none" />
            <span className="text-white/60">Due</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold tracking-wider uppercase">Loan Details</h1>
            <p className="text-xs text-white/50">{loan.applicationNumber}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Loan Header Card */}
      <div className="px-4 py-6">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none" data-testid="card-loan-header">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 border border-white/10 rounded-none">
                  {getTypeIcon(loan.loanType)}
                </div>
                <div>
                  <h2 className="text-xl font-bold capitalize" data-testid="text-loan-type">{loan.loanType} Loan</h2>
                  <p className="text-sm text-white/50">{loan.bankName}</p>
                </div>
              </div>
              <Badge className={getStatusColor(loan.status)} data-testid="badge-loan-status">
                {loan.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-white/50 mb-1">Loan Amount</p>
                <p className="text-2xl font-bold" data-testid="text-loan-amount">{formatINR(loan.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold" data-testid="text-monthly-emi">{formatINR(loan.emi)}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/50">Repayment Progress</span>
                <span className="text-white" data-testid="text-repayment-progress">{repaymentProgress.toFixed(1)}%</span>
              </div>
              <Progress value={repaymentProgress} className="h-2 bg-white/10" data-testid="progress-repayment" />
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-white/50">Paid: {formatINR(loan.totalPaid)}</span>
                <span className="text-white/50">Remaining: {formatINR(loan.outstandingAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 p-1 rounded-none" data-testid="tabs-loan-details">
            <TabsTrigger 
              value="overview" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none"
              data-testid="tab-history"
            >
              History
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none"
              data-testid="tab-details"
            >
              Details
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-overview-stats">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Loan Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Interest Rate</span>
                    <span className="font-semibold" data-testid="text-interest-rate">{loan.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Tenure</span>
                    <span className="font-semibold" data-testid="text-tenure">{loan.tenure} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Total Paid</span>
                    <span className="font-semibold text-white/80" data-testid="text-total-paid">{formatINR(loan.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Outstanding</span>
                    <span className="font-semibold text-white/80" data-testid="text-outstanding">{formatINR(loan.outstandingAmount)}</span>
                  </div>
                  {loan.nextEmiDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Next EMI Date</span>
                      <span className="font-semibold" data-testid="text-next-emi-date">
                        {new Date(loan.nextEmiDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-quick-actions">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/90 rounded-none" 
                    onClick={() => navigate(`/upi-emi-payment/${loan.id}`)}
                    data-testid="button-pay-emi"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay EMI
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 text-white hover:bg-white/10 rounded-none"
                    data-testid="button-download-statement"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download Statement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan History Tab */}
          <TabsContent value="history" className="mt-4 space-y-4">
            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-payment-stats">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Payment Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white/80" data-testid="text-on-time-payments">10</p>
                    <p className="text-xs text-white/50 mt-1">On-Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" data-testid="text-total-payments">10</p>
                    <p className="text-xs text-white/50 mt-1">Total Paid</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white/80" data-testid="text-remaining-payments">{loan.tenure - 10}</p>
                    <p className="text-xs text-white/50 mt-1">Remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-payment-calendar">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Payment Calendar</h3>
                {renderCalendar()}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-payment-history">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Recent Payments</h3>
                <div className="space-y-3">
                  {mockPaymentHistory.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none" data-testid={`payment-${payment.id}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-none ${
                          payment.status === 'paid' ? 'bg-white/10' : 
                          payment.status === 'pending' ? 'bg-white/10' : 
                          'bg-white/10'
                        }`}>
                          {payment.status === 'paid' ? 
                            <CheckCircle className="h-4 w-4 text-white/80" /> :
                            <Clock className="h-4 w-4 text-white/80" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{formatINR(payment.amount)}</p>
                          <p className="text-xs text-white/50">{new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/50">P: {formatINR(payment.principal)}</p>
                        <p className="text-xs text-white/50">I: {formatINR(payment.interest)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lender Details Tab */}
          <TabsContent value="details" className="mt-4 space-y-4">
            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-lender-info">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white/10 border border-white/10 rounded-none">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" data-testid="text-bank-name">{loan.bankName}</h3>
                    <p className="text-sm text-white/50">Authorized Lender</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/50 mb-1">Loan Officer</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-white/40" />
                      <p className="font-medium" data-testid="text-officer-name">{loanOfficer.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/50 mb-1">Contact Number</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-white/40" />
                      <p className="font-medium" data-testid="text-officer-phone">{loanOfficer.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/50 mb-1">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-white/40" />
                      <p className="font-medium" data-testid="text-officer-email">{loanOfficer.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/50 mb-1">Branch Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/40" />
                      <p className="font-medium" data-testid="text-branch-location">{loanOfficer.branch}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-loan-details">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Loan Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Application Number</span>
                    <span className="font-semibold" data-testid="text-application-number">{loan.applicationNumber}</span>
                  </div>
                  {loan.approvedDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Approved Date</span>
                      <span className="font-semibold" data-testid="text-approved-date">
                        {new Date(loan.approvedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {loan.disbursedAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Disbursed Amount</span>
                      <span className="font-semibold" data-testid="text-disbursed-amount">{formatINR(loan.disbursedAmount)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-support">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Support</h3>
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 text-white hover:bg-white/10 rounded-none"
                  onClick={() => navigate("/support")}
                  data-testid="button-contact-support"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}
