import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  TrendingUp,
  Shield,
  CreditCard,
  Building,
  Calendar,
  Award,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  EyeOff,
  Info
} from "lucide-react";

interface CreditReport {
  creditScore: number;
  lastUpdated: string;
  overallHealth: number;
  creditUsage: {
    used: number;
    limit: number;
    utilization: number;
  };
  paymentHistory: {
    onTimeRate: number;
    streak: number;
    missedPayments: number;
  };
  accounts: {
    totalAccounts: number;
    activeLoans: number;
    creditCards: number;
  };
  recommendations: Array<{
    id: string;
    type: "critical" | "warning" | "improvement";
    title: string;
    description: string;
    impact: string;
  }>;
}

export default function MyReport() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [hideAmounts, setHideAmounts] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const mockLoans = [
    {
      id: "loan-1",
      type: "Home Loan",
      lender: "HDFC Bank",
      principalAmount: 2500000,
      outstanding: 1850000,
      emi: 23500,
      nextDueDate: "2024-02-05",
      interestRate: 8.5,
      tenure: 20,
      repaymentAccuracy: 100,
      missedPayments: 0
    },
    {
      id: "loan-2",
      type: "Personal Loan",
      lender: "ICICI Bank",
      principalAmount: 500000,
      outstanding: 285000,
      emi: 12800,
      nextDueDate: "2024-02-10",
      interestRate: 11.5,
      tenure: 5,
      repaymentAccuracy: 95,
      missedPayments: 2
    },
    {
      id: "loan-3",
      type: "Car Loan",
      lender: "SBI",
      principalAmount: 800000,
      outstanding: 450000,
      emi: 18200,
      nextDueDate: "2024-02-15",
      interestRate: 9.25,
      tenure: 7,
      repaymentAccuracy: 100,
      missedPayments: 0
    }
  ];

  const mockCreditCards = [
    {
      id: "card-1",
      bank: "HDFC Bank",
      cardType: "Regalia",
      limit: 200000,
      used: 56000,
      utilization: 28,
      dueAmount: 12500,
      dueDate: "2024-02-08",
      minDue: 2500
    },
    {
      id: "card-2",
      bank: "SBI Card",
      cardType: "SimplyCLICK",
      limit: 150000,
      used: 42000,
      utilization: 28,
      dueAmount: 8200,
      dueDate: "2024-02-12",
      minDue: 1640
    }
  ];

  const mockCibilFactors = [
    { factor: "Payment History", impact: "35%", status: "good", score: 98 },
    { factor: "Credit Utilization", impact: "30%", status: "good", score: 72 },
    { factor: "Credit Age", impact: "15%", status: "excellent", score: 88 },
    { factor: "Credit Mix", impact: "10%", status: "good", score: 75 },
    { factor: "Recent Inquiries", impact: "10%", status: "fair", score: 65 }
  ];

  const totalEMI = mockLoans.reduce((sum, loan) => sum + loan.emi, 0) + mockCreditCards.reduce((sum, card) => sum + card.dueAmount, 0);
  const totalOutstanding = mockLoans.reduce((sum, loan) => sum + loan.outstanding, 0);
  const avgRepaymentAccuracy = mockLoans.reduce((sum, loan) => sum + loan.repaymentAccuracy, 0) / mockLoans.length;

  const mockReportData: CreditReport = {
    creditScore: 750,
    lastUpdated: "2024-01-15",
    overallHealth: 85,
    creditUsage: {
      used: 135000,
      limit: 480000,
      utilization: 28
    },
    paymentHistory: {
      onTimeRate: 98,
      streak: 11,
      missedPayments: 1
    },
    accounts: {
      totalAccounts: 8,
      activeLoans: 3,
      creditCards: 2
    },
    recommendations: [
      {
        id: "rec1",
        type: "improvement",
        title: "Reduce Credit Utilization",
        description: "Lower your credit card usage to below 30% for better score",
        impact: "+15 points"
      },
      {
        id: "rec2",
        type: "warning",
        title: "Missed EMI Alert",
        description: "Upcoming EMI payment due in 3 days",
        impact: "Avoid penalties"
      },
      {
        id: "rec3",
        type: "critical",
        title: "High Debt-to-Income Ratio",
        description: "Consider consolidating loans for better management",
        impact: "Reduce stress"
      }
    ]
  };

  const { data: reportData = mockReportData } = useQuery({
    queryKey: ["/api/myreport"],
    enabled: isAuthenticated,
    queryFn: async () => mockReportData
  });

  const getScoreColor = (score: number) => {
    return "text-white";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider">MY CREDIT REPORT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Financial health analysis</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/myreport/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-info"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideAmounts(!hideAmounts)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-toggle-amounts"
            >
              {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Credit Score Hero Card */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
          <div className="flex flex-col items-center">
            {/* Large Circular Progress Bar */}
            <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6">
              <div className="absolute inset-0">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={getScoreColor(reportData.creditScore)}
                    style={{
                      strokeDasharray: `${2 * Math.PI * 42}`,
                      strokeDashoffset: `${2 * Math.PI * 42 * (1 - reportData.creditScore / 850)}`,
                      filter: 'drop-shadow(0 0 8px currentColor)'
                    }}
                  />
                </svg>
              </div>
              <div className="relative z-10 text-center">
                <div className={`text-5xl font-light mb-1 ${getScoreColor(reportData.creditScore)} tracking-tight`}>
                  {reportData.creditScore}
                </div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest">out of 850</div>
              </div>
            </div>
            
            <Badge className="border px-4 py-1.5 mb-4 bg-white/10 text-white border-white/20 rounded-none font-light tracking-wide">
              {getScoreStatus(reportData.creditScore)}
            </Badge>
            
            <div className="text-[10px] text-white/50 uppercase tracking-widest">
              Last updated: <span className="text-white/80 font-light">{new Date(reportData.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest truncate">Credit Usage</span>
            </div>
            <p className="text-base font-light text-white mb-1 tracking-wide">
              {hideAmounts ? "₹•••••" : `₹${(reportData.creditUsage.used / 1000).toFixed(0)}K / ₹${(reportData.creditUsage.limit / 1000).toFixed(0)}K`}
            </p>
            <Progress value={reportData.creditUsage.utilization} className="h-1.5 bg-white/10 [&>div]:bg-white mb-1" />
            <p className="text-[10px] text-white/50 uppercase tracking-widest">{reportData.creditUsage.utilization}% utilized</p>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest truncate">Payment History</span>
            </div>
            <p className="text-xl font-light text-white tracking-tight">{reportData.paymentHistory.onTimeRate}%</p>
            <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">{reportData.paymentHistory.streak} month streak</p>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest truncate">Total Accounts</span>
            </div>
            <p className="text-xl font-light text-white tracking-tight">{reportData.accounts.totalAccounts}</p>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest truncate">Health Score</span>
            </div>
            <p className="text-xl font-light text-white tracking-tight">{reportData.overallHealth}%</p>
          </div>
        </div>

        {/* Active Loans Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-light text-white tracking-wide">Active Loans ({mockLoans.length})</h3>
          {mockLoans.map((loan) => (
            <div 
              key={loan.id}
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
              data-testid={`card-loan-${loan.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-light text-white tracking-wide">{loan.type}</h4>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{loan.lender}</p>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 border rounded-none text-[10px] font-light tracking-wide">
                  {loan.repaymentAccuracy}% Accuracy
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Outstanding</p>
                  <p className="text-base font-light text-white tracking-wide">
                    {hideAmounts ? "₹•••••" : `₹${(loan.outstanding / 1000).toFixed(0)}K`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Monthly EMI</p>
                  <p className="text-base font-light text-white tracking-wide">
                    {hideAmounts ? "₹•••••" : `₹${loan.emi.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                  <p className="text-base font-light text-white tracking-wide">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Next Due</p>
                  <p className="text-base font-light text-white tracking-wide">{new Date(loan.nextDueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              {loan.missedPayments > 0 && (
                <div className="flex items-center gap-2 p-2 bg-white/10 border border-white/20">
                  <AlertTriangle className="h-4 w-4 text-white" />
                  <span className="text-[10px] text-white uppercase tracking-widest">{loan.missedPayments} missed payments</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Credit Cards Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-light text-white tracking-wide">Credit Cards ({mockCreditCards.length})</h3>
          {mockCreditCards.map((card) => (
            <div 
              key={card.id}
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
              data-testid={`card-credit-${card.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-light text-white tracking-wide">{card.bank}</h4>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{card.cardType}</p>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 border rounded-none text-[10px] font-light tracking-wide">
                  {card.utilization}% Used
                </Badge>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-white/50">Utilization</span>
                  <span className="text-white font-light">
                    {hideAmounts ? "₹••••• / ₹•••••" : `₹${(card.used / 1000).toFixed(0)}K / ₹${(card.limit / 1000).toFixed(0)}K`}
                  </span>
                </div>
                <Progress value={card.utilization} className="h-1.5 bg-white/10 [&>div]:bg-white" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Due Amount</p>
                  <p className="text-base font-light text-white tracking-wide">
                    {hideAmounts ? "₹••••" : `₹${card.dueAmount.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Min Due</p>
                  <p className="text-base font-light text-white tracking-wide">
                    {hideAmounts ? "₹••••" : `₹${card.minDue.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Due Date</p>
                  <p className="text-base font-light text-white tracking-wide">{new Date(card.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-sm font-light text-white mb-4 tracking-wide">Monthly Financial Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/50 mb-1 uppercase tracking-widest">Total EMI</p>
              <p className="text-2xl font-light text-white tracking-tight">
                {hideAmounts ? "₹••••••" : `₹${(totalEMI / 1000).toFixed(0)}K`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 mb-1 uppercase tracking-widest">Total Outstanding</p>
              <p className="text-2xl font-light text-white tracking-tight">
                {hideAmounts ? "₹••••••" : `₹${(totalOutstanding / 100000).toFixed(1)}L`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 mb-1 uppercase tracking-widest">Repayment Accuracy</p>
              <p className="text-2xl font-light text-white tracking-tight">{avgRepaymentAccuracy.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 mb-1 uppercase tracking-widest">Active Accounts</p>
              <p className="text-2xl font-light text-white tracking-tight">{mockLoans.length + mockCreditCards.length}</p>
            </div>
          </div>
        </div>

        {/* CIBIL Factors */}
        <div className="space-y-3">
          <h3 className="text-sm font-light text-white tracking-wide">Factors Affecting Your CIBIL Score</h3>
          {mockCibilFactors.map((factor, index) => (
            <div 
              key={index}
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
              data-testid={`factor-${index}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-light text-white tracking-wide">{factor.factor}</h4>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Impact: {factor.impact}</p>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 border rounded-none text-[10px] font-light tracking-wide">
                  {factor.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-white/50">Performance</span>
                  <span className="text-white font-light">{factor.score}/100</span>
                </div>
                <Progress value={factor.score} className="h-1.5 bg-white/10 [&>div]:bg-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-light text-white tracking-wide">Recommendations</h3>
          {reportData.recommendations.map((rec) => (
            <div 
              key={rec.id}
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
              data-testid={`card-recommendation-${rec.id}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border flex items-center justify-center flex-shrink-0 bg-white/10 border-white/20">
                  {rec.type === 'critical' ? <AlertTriangle className="h-5 w-5 text-white" /> :
                   rec.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-white" /> :
                   <TrendingUp className="h-5 w-5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-light text-white tracking-wide">{rec.title}</h3>
                    <Badge className="flex-shrink-0 border rounded-none text-[10px] bg-white/10 text-white border-white/20 font-light tracking-wide">
                      {rec.type}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-white/50 mb-2 tracking-wide">{rec.description}</p>
                  <div className="flex items-center gap-1 text-[10px] text-white uppercase tracking-widest">
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-light">{rec.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download Button */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6 text-center">
          <Download className="h-10 w-10 text-white/60 mx-auto mb-4" />
          <h3 className="text-base font-light text-white mb-2 tracking-wide">Download Full Report</h3>
          <p className="text-[10px] text-white/50 mb-4 uppercase tracking-widest">
            Get a comprehensive PDF report with detailed analysis
          </p>
          <Button 
            className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wide"
            data-testid="button-download-report"
          >
            Download PDF
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
