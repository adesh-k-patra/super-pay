import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Receipt,
  DollarSign,
  Calendar,
  Building,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Download,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  Coins,
  CreditCard,
  IndianRupee,
  FileText,
  Target,
  Activity,
  ArrowUpRight,
  Plus,
  Hexagon,
  Share2,
  Mail,
  MessageSquare,
  Copy
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface PaymentRecord {
  id: string;
  transactionId: string;
  type: "salary" | "bonus" | "expense" | "reimbursement" | "allowance";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  category: "income" | "expense";
  method: "bank_transfer" | "cash" | "upi" | "card";
  fromTo: string; // Company name or expense description
  taxDeducted?: number;
  reference?: string;
}

export default function MyPayHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock payment history data (in real app, this would come from APIs)
  const mockPayments: PaymentRecord[] = [
    {
      id: "1",
      transactionId: "TXN202412001",
      type: "salary",
      amount: 85000,
      description: "December Salary",
      date: "2024-12-01",
      status: "completed",
      category: "income",
      method: "bank_transfer",
      fromTo: "Tech Corp Ltd",
      taxDeducted: 12750,
      reference: "SAL-DEC-2024"
    },
    {
      id: "2",
      transactionId: "TXN202412002",
      type: "bonus",
      amount: 25000,
      description: "Performance Bonus Q4",
      date: "2024-12-15",
      status: "completed",
      category: "income",
      method: "bank_transfer",
      fromTo: "Tech Corp Ltd",
      taxDeducted: 5000,
      reference: "BON-Q4-2024"
    },
    {
      id: "3",
      transactionId: "TXN202412003",
      type: "expense",
      amount: 3500,
      description: "Client Meeting Dinner",
      date: "2024-12-20",
      status: "pending",
      category: "expense",
      method: "card",
      fromTo: "Restaurant ABC"
    },
    {
      id: "4",
      transactionId: "TXN202412004",
      type: "reimbursement",
      amount: 2800,
      description: "Travel Expense Reimbursement",
      date: "2024-12-18",
      status: "completed",
      category: "income",
      method: "upi",
      fromTo: "Tech Corp Ltd",
      reference: "REI-TRV-2024"
    },
    {
      id: "5",
      transactionId: "TXN202411001",
      type: "salary",
      amount: 85000,
      description: "November Salary",
      date: "2024-11-01",
      status: "completed",
      category: "income",
      method: "bank_transfer",
      fromTo: "Tech Corp Ltd",
      taxDeducted: 12750,
      reference: "SAL-NOV-2024"
    }
  ];

  const totalIncome = useMemo(() => mockPayments
    .filter(p => p.category === "income" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0), [mockPayments]);
  
  const totalExpenses = useMemo(() => mockPayments
    .filter(p => p.category === "expense" && p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0), [mockPayments]);

  const pendingAmount = useMemo(() => mockPayments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0), [mockPayments]);

  const totalTax = useMemo(() => mockPayments
    .filter(p => p.taxDeducted)
    .reduce((sum, p) => sum + (p.taxDeducted || 0), 0), [mockPayments]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "salary": return Building;
      case "bonus": return Award;
      case "expense": return Receipt;
      case "reimbursement": return RefreshCw;
      case "allowance": return Coins;
      default: return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    return "bg-white/10 text-white border-white/10 rounded-none";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "pending": return Clock;
      case "failed": return AlertCircle;
      default: return Clock;
    }
  };

  const filteredPayments = useMemo(() => mockPayments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.fromTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "income") return matchesSearch && payment.category === "income";
    if (selectedTab === "expense") return matchesSearch && payment.category === "expense";
    return matchesSearch && payment.status === selectedTab;
  }), [mockPayments, searchQuery, selectedTab]);

  const pagination = usePagination({
    data: filteredPayments,
    itemsPerPage: 10,
  });

  const handleShareReceipt = (payment: PaymentRecord, method: string) => {
    const receiptText = `Receipt: ${payment.description}\nTransaction ID: ${payment.transactionId}\nAmount: ₹${payment.amount.toLocaleString()}\nDate: ${new Date(payment.date).toLocaleDateString()}\nFrom/To: ${payment.fromTo}\nStatus: ${payment.status.toUpperCase()}`;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(receiptText);
        toast({ 
          title: "Copied!", 
          description: "Receipt details copied to clipboard" 
        });
        break;
      case 'email':
        window.location.href = `mailto:?subject=Receipt - ${payment.description}&body=${encodeURIComponent(receiptText)}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(receiptText)}`, '_blank');
        break;
      default:
        toast({ 
          title: "Share", 
          description: "Receipt sharing initiated" 
        });
    }
  };

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    toast({ 
      title: "Download Started", 
      description: `Downloading receipt for ${payment.description}` 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">PAY HISTORY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All transactions</p>
          </div>
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

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="payment-summary">
          <div className="space-y-6">
            {/* Net Income Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Net Income</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">+15.2%</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-net-income">
                {hideAmounts ? "₹••••••••" : `₹${((totalIncome - totalExpenses) / 1000).toFixed(0)}K`}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-total-income">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Income</p>
                <p className="text-lg font-light text-white" data-testid="text-total-income">
                  {hideAmounts ? "₹••••" : `₹${(totalIncome / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-total-expenses">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Expenses</p>
                <p className="text-lg font-light text-white" data-testid="text-total-expenses">
                  {hideAmounts ? "₹••••" : `₹${(totalExpenses / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-tax-deducted">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Tax</p>
                <p className="text-lg font-light text-white" data-testid="text-tax-deducted">
                  {hideAmounts ? "₹••••" : `₹${(totalTax / 1000).toFixed(0)}K`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none"
            data-testid="input-search-payments"
          />
        </div>

        {/* Payment Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all-payments">All</TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-income">Income</TabsTrigger>
              <TabsTrigger value="expense" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-expense">Expense</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-3">
                {pagination.paginatedData.map((payment) => {
                  const TypeIcon = getTypeIcon(payment.type);
                  const StatusIcon = getStatusIcon(payment.status);
                  const isIncome = payment.category === "income";
                  
                  return (
                    <div
                      key={payment.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`payment-${payment.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-white/60" />
                          </div>
                          <div>
                            <h4 className="font-light text-white text-sm tracking-wide">{payment.description}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">{payment.fromTo}</p>
                              <span className="text-white/30">•</span>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-light text-white tracking-tight" data-testid={`text-amount-${payment.id}`}>
                            {isIncome ? "+" : "-"}{hideAmounts ? "₹••••••" : `₹${(payment.amount / 1000).toFixed(0)}K`}
                          </p>
                          <div className="flex items-center justify-end gap-1">
                            <StatusIcon className="h-3 w-3 text-white/50" />
                            <span className="text-[10px] font-light text-white/50 uppercase tracking-widest" data-testid={`text-status-${payment.id}`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
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
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-sm font-light text-white tracking-wider mb-4 uppercase">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => navigate("/tax-summary")}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 h-10 justify-start rounded-none border border-white/10"
              data-testid="button-tax-summary"
            >
              <FileText className="h-4 w-4 mr-3" />
              <span className="text-xs uppercase tracking-widest font-light">Tax Summary</span>
            </Button>
            <Button
              onClick={() => navigate("/expense-report")}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 h-10 justify-start rounded-none border border-white/10"
              data-testid="button-expense-report"
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              <span className="text-xs uppercase tracking-widest font-light">Expense Report</span>
            </Button>
            <Button
              onClick={() => navigate("/salary-slip")}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 h-10 justify-start rounded-none border border-white/10"
              data-testid="button-salary-slip"
            >
              <Building className="h-4 w-4 mr-3" />
              <span className="text-xs uppercase tracking-widest font-light">Salary Slips</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}