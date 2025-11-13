import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import type { UpiTransaction } from "@shared/schema";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  Plus,
  Send,
  Receipt,
  CreditCard,
  Smartphone,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  History,
  TrendingUp,
  TrendingDown,
  Target,
  Wallet,
  IndianRupee,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeft,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
  Eye,
  Award,
  Zap,
  Home,
  Flame,
  Bell,
  Settings,
  Power,
  Shield,
  Repeat,
  User,
  Hexagon,
  BellRing,
  Timer,
  Lightbulb,
  DollarSign,
  Activity,
  FileText,
  Edit3,
  Trash2,
  RotateCcw
} from "lucide-react";

// Utility function for consistent currency formatting
function formatINR(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

interface BillPaymentHistory {
  id: string;
  serviceProvider: string;
  billType: string;
  accountNumber: string;
  amount: string;
  status: string;
  paidDate: string;
  transactionId: string;
  cashbackEarned: string;
  referenceNumber: string;
}

interface ConsolidatedTransaction {
  id: string;
  type: 'upi' | 'bill' | 'emi' | 'transfer';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  description: string;
  recipient?: string;
  category?: string;
  cashback?: number;
  transactionId?: string;
}

interface UpcomingBill {
  id: string;
  serviceProvider: string;
  billType: string;
  accountNumber: string;
  averageAmount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid';
  isRecurring: boolean;
  autoPay: boolean;
  reminderSet: boolean;
  lastPaidAmount?: number;
  lastPaidDate?: string;
}

interface BillInsight {
  category: string;
  monthlyAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  predictedNext: number;
  daysUntilDue: number;
  savingsOpportunity?: string;
}

interface SmartReminder {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'tip';
  actionRequired: boolean;
  billId?: string;
  dueDate?: string;
}

// Helper function to generate relative dates
const getRelativeDate = (daysFromToday: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

// Mock upcoming bills data with relative dates
const mockUpcomingBills: UpcomingBill[] = [
  {
    id: "bill-001",
    serviceProvider: "Airtel",
    billType: "mobile",
    accountNumber: "9876543210",
    averageAmount: 599,
    dueDate: getRelativeDate(3), // Due in 3 days
    status: "upcoming",
    isRecurring: true,
    autoPay: true,
    reminderSet: true,
    lastPaidAmount: 599,
    lastPaidDate: getRelativeDate(-28) // Paid 28 days ago
  },
  {
    id: "bill-002",
    serviceProvider: "MSEB",
    billType: "electricity",
    accountNumber: "987654321012",
    averageAmount: 2450,
    dueDate: getRelativeDate(-2), // 2 days overdue
    status: "overdue",
    isRecurring: true,
    autoPay: false,
    reminderSet: true,
    lastPaidAmount: 2450,
    lastPaidDate: getRelativeDate(-32) // Paid 32 days ago
  },
  {
    id: "bill-003",
    serviceProvider: "Tata Sky",
    billType: "dth",
    accountNumber: "1234567890",
    averageAmount: 350,
    dueDate: getRelativeDate(8), // Due in 8 days
    status: "upcoming",
    isRecurring: true,
    autoPay: true,
    reminderSet: false,
    lastPaidAmount: 350,
    lastPaidDate: getRelativeDate(-22) // Paid 22 days ago
  },
  {
    id: "bill-004",
    serviceProvider: "Reliance Gas",
    billType: "gas",
    accountNumber: "GAS123456789",
    averageAmount: 1250,
    dueDate: getRelativeDate(6), // Due in 6 days
    status: "upcoming",
    isRecurring: true,
    autoPay: false,
    reminderSet: true,
    lastPaidAmount: 1200,
    lastPaidDate: getRelativeDate(-24) // Paid 24 days ago
  }
];

// Generate bill insights with matching due dates
const generateBillInsights = (): BillInsight[] => {
  const insights: BillInsight[] = [];
  
  mockUpcomingBills.forEach(bill => {
    const daysUntilDue = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate insights based on bill type
    switch (bill.billType) {
      case "mobile":
        insights.push({
          category: "mobile",
          monthlyAverage: 649,
          trend: "increasing",
          trendPercentage: 8.5,
          predictedNext: 699,
          daysUntilDue,
          savingsOpportunity: "Switch to annual plan to save ₹1,200/year"
        });
        break;
      case "electricity":
        insights.push({
          category: "electricity",
          monthlyAverage: 2450,
          trend: "stable",
          trendPercentage: 2.1,
          predictedNext: 2500,
          daysUntilDue,
          savingsOpportunity: "Install solar panels to reduce bill by 40%"
        });
        break;
      case "dth":
        insights.push({
          category: "dth",
          monthlyAverage: 350,
          trend: "decreasing",
          trendPercentage: -5.2,
          predictedNext: 325,
          daysUntilDue,
        });
        break;
      case "gas":
        insights.push({
          category: "gas",
          monthlyAverage: 1200,
          trend: "increasing",
          trendPercentage: 12.3,
          predictedNext: 1350,
          daysUntilDue,
          savingsOpportunity: "Consider LPG subsidy eligibility"
        });
        break;
    }
  });
  
  return insights;
};

// Mock bill insights data with matching due dates
const mockBillInsights: BillInsight[] = generateBillInsights();

// Generate smart reminders based on bills and insights
const generateSmartReminders = (): SmartReminder[] => {
  const reminders: SmartReminder[] = [];
  
  // Overdue bills
  mockUpcomingBills.filter(bill => bill.status === 'overdue').forEach(bill => {
    reminders.push({
      id: `reminder-overdue-${bill.id}`,
      title: "Overdue Payment Alert",
      message: `Your ${bill.serviceProvider} ${bill.billType} bill is overdue. Pay now to avoid late fees.`,
      type: "urgent",
      actionRequired: true,
      billId: bill.id,
      dueDate: bill.dueDate
    });
  });
  
  // Bills due in next 3 days
  mockUpcomingBills.filter(bill => {
    const daysUntilDue = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return bill.status === 'upcoming' && daysUntilDue <= 3 && daysUntilDue > 0;
  }).forEach(bill => {
    reminders.push({
      id: `reminder-due-soon-${bill.id}`,
      title: "Payment Due Soon",
      message: `Your ${bill.serviceProvider} bill is due in ${Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days. ${bill.autoPay ? 'Auto-pay is enabled.' : 'Set up auto-pay?'}`,
      type: bill.autoPay ? "info" : "warning",
      actionRequired: !bill.autoPay,
      billId: bill.id,
      dueDate: bill.dueDate
    });
  });
  
  // Savings opportunities
  mockBillInsights.filter(insight => insight.savingsOpportunity).forEach(insight => {
    reminders.push({
      id: `reminder-savings-${insight.category}`,
      title: "💡 Smart Savings Tip",
      message: insight.savingsOpportunity || '',
      type: "tip",
      actionRequired: false
    });
  });
  
  return reminders;
};

export default function MyPayments() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  // Fetch all payment data
  const { data: upiTransactions = [], isLoading: isLoadingUpi } = useQuery<UpiTransaction[]>({
    queryKey: ["/api/upi/transactions"],
    enabled: isAuthenticated,
  });

  const { data: billHistory = [], isLoading: isLoadingBills } = useQuery<BillPaymentHistory[]>({
    queryKey: ["/api/bill-payment/history"],
    enabled: isAuthenticated,
  });

  // Fetch loan data to extract EMI payments
  const { data: loans = [], isLoading: isLoadingLoans } = useQuery<any[]>({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
  });

  const isLoading = isLoadingUpi || isLoadingBills || isLoadingLoans;

  // Consolidate all transactions
  const consolidatedTransactions = useMemo(() => {
    const transactions: ConsolidatedTransaction[] = [];

    // Add UPI transactions
    upiTransactions.forEach(upi => {
      transactions.push({
        id: upi.id,
        type: 'upi',
        amount: parseFloat(upi.amount || '0'),
        status: upi.status as 'success' | 'pending' | 'failed',
        date: upi.createdAt ? (typeof upi.createdAt === 'string' ? upi.createdAt : upi.createdAt.toISOString()) : new Date().toISOString(),
        description: upi.description || `Payment to ${upi.recipientName || 'Unknown'}`,
        recipient: upi.recipientName || undefined,
        category: upi.transactionType,
        cashback: parseFloat(upi.cashbackEarned || '0'),
        transactionId: upi.externalTransactionId
      });
    });

    // Add bill payments
    billHistory.forEach(bill => {
      // Normalize bill status to standard format
      const normalizedStatus = bill.status === 'paid' ? 'success' : 
                              bill.status === 'processing' ? 'pending' : 
                              bill.status as 'success' | 'pending' | 'failed';
      
      transactions.push({
        id: bill.id,
        type: 'bill',
        amount: parseFloat(bill.amount || '0'),
        status: normalizedStatus,
        date: bill.paidDate,
        description: `${bill.serviceProvider} ${bill.billType}`,
        recipient: bill.serviceProvider,
        category: bill.billType,
        cashback: parseFloat(bill.cashbackEarned || '0'),
        transactionId: bill.transactionId
      });
    });

    // Add EMI payments from loan data
    loans.forEach(loan => {
      if (loan.status === 'active' && loan.emi) {
        // Create mock EMI payment entries based on loan data
        const emiAmount = parseFloat(loan.emi || '0');
        const startDate = new Date(loan.createdAt || new Date());
        
        // Generate last 3 EMI payments as examples
        for (let i = 0; i < 3; i++) {
          const paymentDate = new Date(startDate);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          
          transactions.push({
            id: `emi-${loan.id}-${i}`,
            type: 'emi',
            amount: emiAmount,
            status: 'success' as 'success' | 'pending' | 'failed',
            date: paymentDate.toISOString(),
            description: `EMI Payment - ${loan.loanType} Loan`,
            recipient: 'HDFC Bank',
            category: loan.loanType,
            cashback: 0,
            transactionId: `EMI${loan.applicationNumber}-${i + 1}`
          });
        }
      }
    });

    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [upiTransactions, billHistory, loans]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return consolidatedTransactions.filter(transaction => {
      // Type filter
      if (selectedTab !== "all" && transaction.type !== selectedTab) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case "today":
            if (daysDiff !== 0) return false;
            break;
          case "week":
            if (daysDiff > 7) return false;
            break;
          case "month":
            if (daysDiff > 30) return false;
            break;
          case "quarter":
            if (daysDiff > 90) return false;
            break;
        }
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.recipient?.toLowerCase().includes(searchLower) ||
          transaction.transactionId?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [consolidatedTransactions, selectedTab, searchTerm, statusFilter, dateFilter]);

  // Pagination calculations
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedTransactions = filteredTransactions.slice(startIndex - 1, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchTerm, statusFilter, dateFilter]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const successfulTransactions = consolidatedTransactions.filter(t => t.status === 'success');
    const totalTransactions = consolidatedTransactions.length;
    const totalAmount = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalCashback = successfulTransactions.reduce((sum, t) => sum + (t.cashback || 0), 0);
    const successfulCount = successfulTransactions.length;
    const successRate = totalTransactions > 0 ? (successfulCount / totalTransactions) * 100 : 0;

    const thisMonth = successfulTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const monthlySpent = thisMonth.reduce((sum, t) => sum + t.amount, 0);
    const monthlyTransactions = thisMonth.length;

    return {
      totalTransactions,
      totalAmount,
      totalCashback,
      successRate,
      monthlySpent,
      monthlyTransactions,
      recentTransactions: consolidatedTransactions.slice(0, 5)
    };
  }, [consolidatedTransactions]);

  const getTransactionIcon = (type: string, category?: string) => {
    switch (type) {
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      case 'bill':
        return <Receipt className="h-5 w-5" />;
      case 'emi':
        return <CreditCard className="h-5 w-5" />;
      case 'transfer':
        return <Send className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-white/80" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-white/80" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-white/80" />;
      default:
        return null;
    }
  };

  // Bill management helper functions
  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return "bg-white/5 text-blue-700 dark:bg-blue-900 dark:text-white/70";
      case 'overdue':
        return "bg-white/5 text-red-700 dark:bg-red-900 dark:text-white/70";
      case 'paid':
        return "bg-white/5 text-white/80 dark:bg-green-900 dark:text-white/70";
      default:
        return "bg-white/10 text-white/80 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getBillTypeIcon = (billType: string) => {
    switch (billType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'electricity':
        return <Zap className="h-5 w-5" />;
      case 'dth':
        return <Eye className="h-5 w-5" />;
      case 'gas':
        return <Flame className="h-5 w-5" />;
      default:
        return <Receipt className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-600 dark:text-white/80" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-600 dark:text-white/80" />;
      case 'stable':
        return <BarChart3 className="h-4 w-4 text-white/80 dark:text-white/80" />;
      default:
        return null;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  // Calculate bill analytics
  const billAnalytics = useMemo(() => {
    const overdueBills = mockUpcomingBills.filter(bill => bill.status === 'overdue');
    const upcomingBills = mockUpcomingBills.filter(bill => bill.status === 'upcoming');
    const upcomingTotal = upcomingBills.reduce((sum, bill) => sum + bill.averageAmount, 0); // Only upcoming bills
    const autoPayBills = mockUpcomingBills.filter(bill => bill.autoPay);
    const avgMonthlyBills = mockBillInsights.reduce((sum, insight) => sum + insight.monthlyAverage, 0);
    
    return {
      upcomingTotal,
      overdueCount: overdueBills.length,
      upcomingCount: upcomingBills.length,
      autoPayCount: autoPayBills.length,
      avgMonthlyBills,
      totalBills: mockUpcomingBills.length,
      overdueBills, // Add for access to overdue bill details
      nextDueDate: upcomingBills
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate
    };
  }, []);

  // Generate smart reminders
  const smartReminders = generateSmartReminders();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Hexagon className="h-8 w-8 text-white/60" />
          </div>
          <p className="text-white/60">Loading your payments...</p>
        </div>
      </div>
    );
  }

  // Smart Reminders Section with Login Page Design
  const smartRemindersSection = (
    <GlassmorphicCard className="mb-8" data-testid="smart-reminders">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
            <BellRing className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wider">SMART REMINDERS</h3>
            <p className="text-white/60 text-sm">AI-powered alerts to never miss a payment</p>
          </div>
        </div>
        
        {/* Smart Reminders List */}
        <div className="space-y-4">
          {smartReminders.filter(reminder => reminder.type === 'urgent').map((reminder) => (
            <div key={reminder.id} className="border border-white/20 bg-white/5 p-4 rounded-none">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-white/80" />
                <span className="text-white/80 font-semibold">{reminder.title}</span>
              </div>
              <p className="text-white text-sm mb-3">{reminder.message}</p>
              {reminder.actionRequired && (
                <Button size="sm" variant="outline" className="border-red-500 text-white/80 hover:bg-white/10 hover:text-white rounded-none">
                  Pay Now
                </Button>
              )}
            </div>
          ))}
          
          {smartReminders.filter(reminder => reminder.type === 'warning').map((reminder) => (
            <div key={reminder.id} className="border border-white/20 bg-white/5 p-4 rounded-none">
              <div className="flex items-center gap-3 mb-3">
                <Timer className="h-5 w-5 text-white/80" />
                <span className="text-white/80 font-semibold">{reminder.title}</span>
              </div>
              <p className="text-white text-sm mb-3">{reminder.message}</p>
              {reminder.actionRequired && (
                <Button size="sm" variant="outline" className="border-yellow-500 text-white/80 hover:bg-white/10 hover:text-black rounded-none">
                  Set Auto-Pay
                </Button>
              )}
            </div>
          ))}
          
          {smartReminders.filter(reminder => reminder.type === 'tip').map((reminder) => (
            <div key={reminder.id} className="border border-white/20 bg-white/5 p-4 rounded-none">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="h-5 w-5 text-white/80" />
                <span className="text-white/80 font-semibold">{reminder.title}</span>
              </div>
              <p className="text-white text-sm">{reminder.message}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassmorphicCard>
  );

  // Enhanced KPI Cards with Login Page Design
  const kpiCards = (
    <>
      <GlassmorphicCard data-testid="kpi-total-spent">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-white/80" />
          </div>
          <p className="text-sm text-white/60 mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-white">{formatINR(analytics.totalAmount)}</p>
          <p className="text-xs text-white/40 mt-1">{analytics.totalTransactions} Transactions</p>
        </div>
      </GlassmorphicCard>
      
      <GlassmorphicCard data-testid="kpi-upcoming-bills">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <Timer className="h-5 w-5 text-white/80" />
          </div>
          <p className="text-sm text-white/60 mb-2">Upcoming Bills</p>
          <p className="text-2xl font-bold text-white">{formatINR(billAnalytics.upcomingTotal)}</p>
          <p className="text-xs text-white/40 mt-1">{billAnalytics.upcomingCount} bills due soon</p>
        </div>
      </GlassmorphicCard>
      
      <GlassmorphicCard data-testid="kpi-autopay">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
              <Repeat className="h-6 w-6 text-white" />
            </div>
            <Shield className="h-5 w-5 text-white/80" />
          </div>
          <p className="text-sm text-white/60 mb-2">Auto-Pay Active</p>
          <p className="text-2xl font-bold text-white">{billAnalytics.autoPayCount}</p>
          <p className="text-xs text-white/40 mt-1">{billAnalytics.totalBills} total bills</p>
        </div>
      </GlassmorphicCard>
      
      <GlassmorphicCard data-testid={billAnalytics.overdueCount > 0 ? "kpi-overdue-bills" : "kpi-success-rate"} 
                         variant={billAnalytics.overdueCount > 0 ? "red" : "default"}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
              {billAnalytics.overdueCount > 0 ? 
                <AlertTriangle className="h-6 w-6 text-white/80" /> : 
                <Target className="h-6 w-6 text-white" />
              }
            </div>
            {billAnalytics.overdueCount > 0 ? 
              <XCircle className="h-5 w-5 text-white/80" /> :
              <CheckCircle className="h-5 w-5 text-white/80" />
            }
          </div>
          <p className="text-sm text-white/60 mb-2">{billAnalytics.overdueCount > 0 ? "Overdue Bills" : "Success Rate"}</p>
          <p className={`text-2xl font-bold ${billAnalytics.overdueCount > 0 ? 'text-white/80' : 'text-white'}`}>
            {billAnalytics.overdueCount > 0 ? billAnalytics.overdueCount : `${analytics.successRate.toFixed(1)}%`}
          </p>
          <p className="text-xs text-white/40 mt-1">{billAnalytics.overdueCount > 0 ? "Need immediate attention" : "Payment Success"}</p>
        </div>
      </GlassmorphicCard>
    </>
  );

  // Quick Actions Section with Login Page Design
  const quickActions = (
    <GlassmorphicCard className="mb-8" data-testid="quick-actions">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wider">QUICK ACTIONS</h3>
            <p className="text-white/60 text-sm">Fast payments and bill management</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/upi-payment')}
            className="border border-white/20 p-4 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
            data-testid="action-send-money"
          >
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-3">
              <Send className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Send Money</h4>
            <p className="text-sm text-white/60">UPI payments</p>
          </button>
          <button
            onClick={() => navigate('/upi-collect')}
            className="border border-white/20 p-4 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
            data-testid="action-request-money"
          >
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-3">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Request Money</h4>
            <p className="text-sm text-white/60">Collect payments</p>
          </button>
          <button
            onClick={() => navigate('/bill-payment')}
            className="border border-white/20 p-4 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
            data-testid="action-pay-bills"
          >
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-3">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Pay Bills</h4>
            <p className="text-sm text-white/60">Utility & services</p>
          </button>
          <button
            onClick={() => navigate('/funds')}
            className="border border-white/20 p-4 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
            data-testid="action-add-funds"
          >
            <div className="w-12 h-12 border border-white/30 flex items-center justify-center mb-3">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Add Funds</h4>
            <p className="text-sm text-white/60">Top up wallet</p>
          </button>
        </div>
        
        {/* Bill Management Actions */}
        <div className="border-t border-white/20 mt-6 pt-6">
          <h4 className="text-white font-semibold mb-4">Bill Management</h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              className="border border-white/20 p-3 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
              data-testid="action-schedule-bills"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-white" />
                <div>
                  <p className="text-white font-medium text-sm">Schedule Bills</p>
                  <p className="text-white/60 text-xs">Auto payments</p>
                </div>
              </div>
            </button>
            <button
              className="border border-white/20 p-3 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
              data-testid="action-set-reminders"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-white" />
                <div>
                  <p className="text-white font-medium text-sm">Set Reminders</p>
                  <p className="text-white/60 text-xs">Never miss bills</p>
                </div>
              </div>
            </button>
            <button
              className="border border-white/20 p-3 hover:border-white/40 hover:bg-white/5 transition-all text-left rounded-none"
              data-testid="action-bill-analytics"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-white" />
                <div>
                  <p className="text-white font-medium text-sm">Bill Analytics</p>
                  <p className="text-white/60 text-xs">Spending insights</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );

  // Main content section with enhanced transaction history
  const mainContent = (
    <div className="space-y-8">
      {/* Smart Reminders Section */}
      {smartRemindersSection}
      
      {/* Quick Actions */}
      {quickActions}
      
      {/* Main Content */}
      <GlassmorphicCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wider">TRANSACTION HISTORY</h2>
                <p className="text-white/60 text-sm">View and manage all your payments</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 rounded-none"
                data-testid="button-export-csv"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/analytics')}
                className="border-white/30 text-white hover:bg-white/10 rounded-none"
                data-testid="button-view-analytics"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button 
                onClick={() => navigate('/upi-payment')} 
                size="sm"
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-new-payment"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Payment
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-white/20 text-white placeholder:text-white/60 rounded-none"
                data-testid="input-search-payments"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-white/20 bg-black text-white rounded-none"
              data-testid="select-status-filter"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-white/20 bg-black text-white rounded-none"
              data-testid="select-date-filter"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-black border border-white/20 rounded-none p-1" data-testid="tabs-payment-types">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="upi" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-upi">UPI</TabsTrigger>
              <TabsTrigger value="bill" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-bills">Bills</TabsTrigger>
              <TabsTrigger value="emi" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-emi">EMI</TabsTrigger>
              <TabsTrigger value="transfer" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-transfers">Transfers</TabsTrigger>
            </TabsList>

{["all", "upi", "bill", "emi", "transfer"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {filteredTransactions.length > 0 ? (
                <div className="space-y-3">
                  {paginatedTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="cursor-pointer border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all p-4 rounded-none"
                      onClick={() => navigate(`/payment-detail/${transaction.transactionId || transaction.id}`)}
                      data-testid={`transaction-${transaction.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="flex items-center justify-center w-12 h-12 border border-white/30"
                            data-testid={`icon-${transaction.type}-${transaction.id}`}
                          >
                            {getTransactionIcon(transaction.type, transaction.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 
                                className="font-semibold text-white"
                                data-testid={`text-description-${transaction.id}`}
                              >
                                {transaction.description}
                              </h3>
                              <div data-testid={`status-${transaction.status}-${transaction.id}`}>
                                {getStatusIcon(transaction.status)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <span data-testid={`text-recipient-${transaction.id}`}>{transaction.recipient || 'Unknown'}</span>
                              <span>•</span>
                              <span data-testid={`text-date-${transaction.id}`}>{new Date(transaction.date).toLocaleDateString()}</span>
                              <span>•</span>
                              <div 
                                className="text-xs px-2 py-1 border border-white/30 text-white"
                                data-testid={`badge-type-${transaction.id}`}
                              >
                                {transaction.type.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div 
                            className="font-semibold text-white"
                            data-testid={`text-amount-${transaction.id}`}
                          >
                            {formatINR(transaction.amount)}
                          </div>
                          {transaction.cashback && transaction.cashback > 0 && (
                            <div 
                              className="text-sm text-white/80"
                              data-testid={`text-cashback-${transaction.id}`}
                            >
                              +{formatINR(transaction.cashback)} cashback
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

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
                </div>
              ) : (
                <div className="border border-white/20 p-12 text-center rounded-none" data-testid="empty-payments">
                  <div className="w-16 h-16 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No {selectedTab === "all" ? "" : selectedTab} Payments</h3>
                  <p className="text-white/60 mb-6">You don't have any {selectedTab === "all" ? "" : selectedTab} payments yet.</p>
                  <Button
                    onClick={() => navigate('/upi-payment')}
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                  >
                    Make a Payment
                  </Button>
                </div>
              )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </GlassmorphicCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Brand Header - Login Page Style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/3 to-white/5"></div>
        
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-white/10 border border-white/20 backdrop-blur-sm rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            
            {/* Brand Logo and Title */}
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-white rounded-none flex items-center justify-center mx-auto mb-4">
                <Hexagon className="h-8 w-8 text-white stroke-2" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-wider" data-testid="heading-payments-title">
                SMART BILLS
              </h1>
              <p className="text-white/60 font-medium tracking-widest text-xs uppercase mt-2">
                Never Miss A Payment
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/upi-payment')}
              className="bg-white text-black hover:bg-white/90 shadow-lg rounded-none"
              data-testid="button-header-new-payment"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pay
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards with Glassmorphic Design */}
      <div className="px-6 -mt-12 relative z-10">
        <GlassmorphicCard className="mb-8 shadow-2xl backdrop-blur-sm">
          <div className="p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards}
            </div>
          </div>
        </GlassmorphicCard>
        
        {/* Main Content */}
        <div className="space-y-8 pb-20">
          {mainContent}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}