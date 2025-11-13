import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Settings,
  Lock,
  Unlock,
  Zap,
  Shield,
  Target,
  Activity,
  BarChart3,
  Coins,
  Receipt,
  IndianRupee,
  Percent,
  Users,
  Gift,
  Star,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  PiggyBank,
  Building,
  Hexagon,
  Link,
  ChevronRight
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountType: "savings" | "current" | "salary" | "fixed_deposit" | "recurring_deposit";
  balance: number;
  status: "active" | "blocked" | "dormant" | "closed";
  branch: string;
  ifscCode: string;
  isPrimaryAccount: boolean;
  minimumBalance: number;
  interestRate: number;
  lastTransaction: string;
  monthlyTransactions: number;
  monthlyCredits: number;
  monthlyDebits: number;
  maturityDate?: string;
  maturityAmount?: string;
  nomineeName?: string;
  linkedCards: number;
  upiEnabled: boolean;
  netBankingEnabled: boolean;
}

export default function MyBankAccounts() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock bank accounts data (in real app, this would come from APIs)
  const mockAccounts: BankAccount[] = [
    {
      id: "1",
      accountNumber: "****1234",
      bankName: "HDFC Bank",
      accountType: "salary",
      balance: 125000,
      status: "active",
      branch: "Koramangala Branch",
      ifscCode: "HDFC0001234",
      isPrimaryAccount: true,
      minimumBalance: 10000,
      interestRate: 3.5,
      lastTransaction: "2024-12-29",
      monthlyTransactions: 45,
      monthlyCredits: 95000,
      monthlyDebits: 52000,
      nomineeName: "Jane Doe",
      linkedCards: 2,
      upiEnabled: true,
      netBankingEnabled: true
    },
    {
      id: "2",
      accountNumber: "****5678",
      bankName: "ICICI Bank",
      accountType: "savings",
      balance: 45000,
      status: "active",
      branch: "Indiranagar Branch",
      ifscCode: "ICIC0005678",
      isPrimaryAccount: false,
      minimumBalance: 5000,
      interestRate: 3.25,
      lastTransaction: "2024-12-28",
      monthlyTransactions: 22,
      monthlyCredits: 25000,
      monthlyDebits: 18000,
      nomineeName: "John Doe",
      linkedCards: 1,
      upiEnabled: true,
      netBankingEnabled: true
    },
    {
      id: "3",
      accountNumber: "****9012",
      bankName: "SBI",
      accountType: "fixed_deposit",
      balance: 500000,
      status: "active",
      branch: "BTM Layout Branch",
      ifscCode: "SBIN0009012",
      isPrimaryAccount: false,
      minimumBalance: 0,
      interestRate: 6.8,
      lastTransaction: "2024-01-15",
      monthlyTransactions: 0,
      monthlyCredits: 0,
      monthlyDebits: 0,
      maturityDate: "2025-01-15",
      maturityAmount: "₹5,34,000",
      nomineeName: "Jane Doe",
      linkedCards: 0,
      upiEnabled: false,
      netBankingEnabled: true
    },
    {
      id: "4",
      accountNumber: "****3456",
      bankName: "Axis Bank",
      accountType: "current",
      balance: 75000,
      status: "active",
      branch: "Electronic City Branch",
      ifscCode: "UTIB0003456",
      isPrimaryAccount: false,
      minimumBalance: 25000,
      interestRate: 2.75,
      lastTransaction: "2024-12-27",
      monthlyTransactions: 78,
      monthlyCredits: 125000,
      monthlyDebits: 98000,
      nomineeName: "John Doe",
      linkedCards: 1,
      upiEnabled: true,
      netBankingEnabled: true
    }
  ];

  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalMonthlyCredits = mockAccounts.reduce((sum, account) => sum + account.monthlyCredits, 0);
  const totalMonthlyDebits = mockAccounts.reduce((sum, account) => sum + account.monthlyDebits, 0);
  const activeAccounts = mockAccounts.filter(account => account.status === "active").length;
  const totalLinkedCards = mockAccounts.reduce((sum, account) => sum + account.linkedCards, 0);

  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case "savings": return PiggyBank;
      case "current": return Building;
      case "salary": return Wallet;
      case "fixed_deposit": return Target;
      case "recurring_deposit": return Calendar;
      default: return Building2;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-white/10 text-white border-white/10 rounded-none";
      case "blocked": return "bg-white/10 text-white border-white/10 rounded-none";
      case "dormant": return "bg-white/10 text-white border-white/10 rounded-none";
      case "closed": return "bg-white/10 text-white border-white/10 rounded-none";
      default: return "bg-white/10 text-white border-white/10 rounded-none";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "blocked": return XCircle;
      case "dormant": return Clock;
      case "closed": return AlertTriangle;
      default: return Clock;
    }
  };

  const filteredAccounts = mockAccounts.filter(account => {
    if (selectedTab === "all") return true;
    if (selectedTab === "active") return account.status === "active";
    return account.accountType === selectedTab;
  });

  const pagination = usePagination({
    data: filteredAccounts,
    itemsPerPage: 20,
  });

  const toggleNetBanking = (accountId: string) => {
    toast({
      title: "Net Banking Updated",
      description: "Net banking settings updated successfully"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider">BANK ACCOUNTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Linked accounts & UPI</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideAmounts(!hideAmounts)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-toggle-amounts"
            >
              {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(true)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-link-account"
            >
              <Link className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Accounts Summary - Hero Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5" data-testid="accounts-summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-white">Portfolio Overview</h2>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{activeAccounts} Active Accounts</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Balance</p>
                <p className="text-3xl font-light text-white tracking-tight" data-testid="text-total-balance">
                  {hideAmounts ? "₹••••••" : `₹${(totalBalance / 100000).toFixed(1)}L`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Credits</p>
                <p className="text-lg font-light text-white" data-testid="text-monthly-credits">
                  {hideAmounts ? "₹••••••" : `₹${(totalMonthlyCredits / 100000).toFixed(1)}L`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Debits</p>
                <p className="text-lg font-light text-white" data-testid="text-monthly-debits">
                  {hideAmounts ? "₹••••••" : `₹${(totalMonthlyDebits / 100000).toFixed(1)}L`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Cards</p>
                <p className="text-lg font-light text-white">{totalLinkedCards}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-all-accounts"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="savings" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-savings"
            >
              Savings
            </TabsTrigger>
            <TabsTrigger 
              value="current" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-current"
            >
              Current
            </TabsTrigger>
            <TabsTrigger 
              value="fixed_deposit" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-fixed-deposit"
            >
              FD
            </TabsTrigger>
          </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-3">
                {pagination.paginatedData.map((account) => {
                  const AccountIcon = getAccountIcon(account.accountType);
                  const StatusIcon = getStatusIcon(account.status);
                  const netFlow = account.monthlyCredits - account.monthlyDebits;
                  
                  return (
                    <div
                      key={account.id}
                      onClick={() => navigate(`/my-bank-accounts/${account.id}`)}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      data-testid={`account-${account.id}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                            <AccountIcon className="h-4 w-4 text-white/60" />
                          </div>
                          <div>
                            <p className="text-sm text-white font-light tracking-wide">{account.bankName}</p>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest capitalize">
                              {account.accountType.replace('_', ' ')} • {account.accountNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-light text-white tracking-tight" data-testid={`text-balance-${account.id}`}>
                            {hideAmounts ? "₹••••••" : `₹${(account.balance / 1000).toFixed(0)}K`}
                          </p>
                          <Badge className={cn("mt-1 rounded-none border-0 text-[10px] px-2 py-0.5 uppercase tracking-widest bg-white/10 text-white/80")}>
                            {account.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">Branch</p>
                          <p className="text-xs text-white font-light">{account.branch}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">IFSC Code</p>
                          <p className="text-xs text-white font-light">{account.ifscCode}</p>
                        </div>
                        {account.maturityDate ? (
                          <>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Maturity</p>
                              <p className="text-xs text-white font-light">
                                {new Date(account.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Mat. Amount</p>
                              <p className="text-xs text-white font-light">{account.maturityAmount}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                              <p className="text-xs text-white font-light">{account.interestRate}% p.a.</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Monthly Flow</p>
                              <p className="text-xs text-white font-light">
                                {netFlow >= 0 ? "+" : ""}₹{(netFlow / 1000).toFixed(0)}K
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

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
            </TabsContent>
          </Tabs>
      </div>

      {/* Link Bank Account Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider">Link Bank Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-sm text-white/80 font-light">
              Select a bank to link your account. You'll be redirected to your bank's secure login page.
            </p>
            
            <div className="space-y-2">
              {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank'].map((bank) => (
                <button
                  key={bank}
                  onClick={() => {
                    toast({
                      title: "Redirecting",
                      description: `Redirecting to ${bank} login page...`,
                    });
                    setTimeout(() => setShowLinkDialog(false), 1000);
                  }}
                  className="w-full border border-white/20 bg-white/5 p-4 text-left hover:bg-white/10 transition-all flex items-center justify-between"
                  data-testid={`button-select-${bank.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-white/60" />
                    <span className="text-white font-light">{bank}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </button>
              ))}
            </div>

            <Button
              onClick={() => setShowLinkDialog(false)}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12 text-base font-light tracking-wider"
              data-testid="button-cancel-link"
            >
              CANCEL
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}