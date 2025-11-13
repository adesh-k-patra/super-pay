import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  Settings as SettingsIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Star,
  Shield,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  TrendingUp,
  Percent,
  Receipt,
  IndianRupee
} from "lucide-react";

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

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  category: string;
}

export default function BankAccountDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [, params] = useRoute("/my-bank-accounts/:accountId");
  const [hideAmounts, setHideAmounts] = useState(false);
  const [activeTab, setActiveTab] = useUrlTab("overview");
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [netBankingEnabled, setNetBankingEnabled] = useState(true);
  const [isPrimaryAccount, setIsPrimaryAccount] = useState(true);
  const [contactlessEnabled, setContactlessEnabled] = useState(true);

  // Mock bank accounts data
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
      nomineeName: "John Smith",
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
      branch: "HSR Layout Branch",
      ifscCode: "SBIN0009012",
      isPrimaryAccount: false,
      minimumBalance: 0,
      interestRate: 6.75,
      lastTransaction: "2024-12-01",
      monthlyTransactions: 0,
      monthlyCredits: 0,
      monthlyDebits: 0,
      maturityDate: "2025-12-01",
      maturityAmount: "₹5,33,750",
      nomineeName: "Jane Doe",
      linkedCards: 0,
      upiEnabled: false,
      netBankingEnabled: true
    }
  ];

  // Mock transactions
  const mockTransactions: Transaction[] = [
    {
      id: "t1",
      date: "2024-12-29",
      description: "Salary Credit",
      type: "credit",
      amount: 95000,
      balance: 125000,
      category: "Salary"
    },
    {
      id: "t2",
      date: "2024-12-28",
      description: "Rent Payment",
      type: "debit",
      amount: 25000,
      balance: 30000,
      category: "Housing"
    },
    {
      id: "t3",
      date: "2024-12-27",
      description: "UPI Transfer - Amazon",
      type: "debit",
      amount: 3499,
      balance: 55000,
      category: "Shopping"
    },
    {
      id: "t4",
      date: "2024-12-26",
      description: "Credit Card Payment",
      type: "debit",
      amount: 12500,
      balance: 58499,
      category: "Bills"
    },
    {
      id: "t5",
      date: "2024-12-25",
      description: "Freelance Payment",
      type: "credit",
      amount: 15000,
      balance: 70999,
      category: "Income"
    }
  ];

  // Pagination for transactions
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedTransactions,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: mockTransactions,
    itemsPerPage: 10,
  });

  const account = mockAccounts.find(a => a.id === params?.accountId);

  const handleUnlinkAccount = () => {
    navigate("/my-bank-accounts");
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "salary":
        return "bg-white/10 text-white/80 border-white/20";
      case "savings":
        return "bg-white/10 text-white/80 border-white/20";
      case "current":
        return "bg-white/10 text-white/80 border-white/20";
      case "fixed_deposit":
        return "bg-white/10 text-white/80 border-white/20";
      case "recurring_deposit":
        return "bg-white/10 text-white/80 border-white/20";
      default:
        return "bg-white/20 text-white border-white/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-white/10 text-white/80 border-white/20";
      case "blocked":
        return "bg-white/10 text-white/80 border-white/20";
      case "dormant":
        return "bg-white/10 text-white/80 border-white/20";
      case "closed":
        return "bg-white/10 text-white/80 border-white/20";
      default:
        return "bg-white/20 text-white border-white/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "blocked":
        return Lock;
      case "dormant":
        return Clock;
      case "closed":
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <XCircle className="h-16 w-16 text-white/80 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Account Not Found</h2>
          <p className="text-white/60 mb-6">The account you're looking for doesn't exist</p>
          <Button 
            onClick={() => navigate("/my-bank-accounts")} 
            className="bg-white text-black hover:bg-white/90"
            data-testid="button-back-to-accounts"
          >
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(account.status);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
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
            <h1 className="text-base font-bold tracking-wider">{account.bankName.toUpperCase()}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{account.accountNumber}</p>
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
        {/* Hero Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-white capitalize">{account.accountType.replace('_', ' ')} Account</h2>
                <Badge className="mt-1.5 bg-white/10 text-white/80 border-0 text-[10px] rounded-none px-2 py-0.5 uppercase tracking-widest">
                  {account.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Balance</p>
                <p className="text-3xl font-light text-white tracking-tight">
                  {hideAmounts ? "₹••••••" : `₹${account.balance.toLocaleString()}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Branch</p>
                <p className="text-sm font-light text-white">{account.branch}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">IFSC</p>
                <p className="text-sm font-light text-white">{account.ifscCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest</p>
                <p className="text-sm font-light text-white">{account.interestRate}% p.a.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-settings"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-3">
              {/* Account Summary */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Account Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Account Number</p>
                    <p className="text-lg font-light text-white tracking-wider">
                      {account.accountNumber.replace('****', '')}1234567890
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Current Balance</p>
                    <p className="text-xl font-light text-white">
                      {hideAmounts ? "₹••••••" : `₹${account.balance.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Min Balance</p>
                    <p className="text-xl font-light text-white">₹{account.minimumBalance.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Linked Cards</p>
                    <p className="text-lg font-light text-white">{account.linkedCards}</p>
                  </div>
                  {account.nomineeName && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Nominee</p>
                      <p className="text-lg font-light text-white">{account.nomineeName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Activity */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Monthly Activity</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-light text-white">{account.monthlyTransactions}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Transactions</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-light text-white">
                      {hideAmounts ? "₹•••" : `₹${(account.monthlyCredits / 1000).toFixed(0)}K`}
                    </p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Credits</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-light text-white">
                      {hideAmounts ? "₹•••" : `₹${(account.monthlyDebits / 1000).toFixed(0)}K`}
                    </p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Debits</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              {account.maturityDate && (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Fixed Deposit Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-xs text-white/60 uppercase tracking-wider">Maturity Date</span>
                      <span className="text-xs text-white font-light">
                        {new Date(account.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-white/60 uppercase tracking-wider">Maturity Amount</span>
                      <span className="text-xs text-white font-light">{account.maturityAmount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Services */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Services Status</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <Wallet className="h-3 w-3" />
                      UPI
                    </span>
                    <span className="text-xs text-white font-light">{upiEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Net Banking
                    </span>
                    <span className="text-xs text-white font-light">{netBankingEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>

              {/* Unlink Account */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/50 rounded-none"
                    data-testid="button-unlink-account"
                  >
                    Unlink Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black border border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Unlink Bank Account?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/60">
                      Are you sure you want to unlink {account.bankName} account {account.accountNumber}? This action cannot be undone and you will need to re-link the account if you want to use it again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-none"
                      data-testid="button-cancel-unlink"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleUnlinkAccount}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-none"
                      data-testid="button-confirm-unlink"
                    >
                      Unlink Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <div className="space-y-3">
              {paginatedTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                        {transaction.type === "credit" ? (
                          <ArrowDownRight className="h-4 w-4 text-white/60" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-white/60" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white font-light tracking-wide">{transaction.description}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">
                          {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-light text-white tracking-tight">
                        {transaction.type === "credit" ? "+" : "-"}
                        {hideAmounts ? "₹•••" : `₹${transaction.amount.toLocaleString()}`}
                      </p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">
                        Bal: {hideAmounts ? "₹•••" : `₹${transaction.balance.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
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
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="space-y-3">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-light tracking-wide">UPI Payments</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Enable UPI transactions</p>
                    </div>
                  </div>
                  <Switch 
                    checked={upiEnabled}
                    onCheckedChange={setUpiEnabled}
                    data-testid="switch-upi"
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-light tracking-wide">Net Banking</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Online banking access</p>
                    </div>
                  </div>
                  <Switch 
                    checked={netBankingEnabled}
                    onCheckedChange={setNetBankingEnabled}
                    data-testid="switch-netbanking"
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      <Star className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-light tracking-wide">Primary Account</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Default account preference</p>
                    </div>
                  </div>
                  <Switch 
                    checked={isPrimaryAccount}
                    onCheckedChange={setIsPrimaryAccount}
                    data-testid="switch-primary"
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-light tracking-wide">Contactless Payments</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Tap to pay feature</p>
                    </div>
                  </div>
                  <Switch 
                    checked={contactlessEnabled}
                    onCheckedChange={setContactlessEnabled}
                    data-testid="switch-contactless"
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-light tracking-wide">Transaction Alerts</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">SMS & email notifications</p>
                    </div>
                  </div>
                  <Switch 
                    defaultChecked={true}
                    data-testid="switch-alerts"
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      {account.status === "active" ? (
                        <Lock className="h-4 w-4 text-white/60" />
                      ) : (
                        <Unlock className="h-4 w-4 text-white/60" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-light tracking-wide">
                        {account.status === "active" ? "Account Active" : "Account Blocked"}
                      </p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Account status</p>
                    </div>
                  </div>
                  <Switch 
                    checked={account.status === "active"}
                    data-testid="switch-account-status"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
