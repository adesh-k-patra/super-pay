import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Shield,
  Loader2,
  Wallet,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Info,
  Lock,
  Unlock,
  Award,
  Calendar
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UserWallet {
  totalBalance: string;
  availableBalance: string;
  lockedBalance: string;
  currency: string;
}

interface WalletSummary {
  wallet: UserWallet;
  totalInvested: number;
  todaysGainLoss: number;
  nextInstantWithdrawal: string;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  timestamp: string;
}

const Funds = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [addAmount, setAddAmount] = useState<number>(1000);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  
  // Fetch wallet data
  const { data: walletSummary, isLoading: walletLoading } = useQuery<WalletSummary>({
    queryKey: ["/api/funds/summary"],
    placeholderData: {
      wallet: {
        totalBalance: "50000",
        availableBalance: "35000",
        lockedBalance: "15000",
        currency: "INR"
      },
      totalInvested: 75000,
      todaysGainLoss: 2450,
      nextInstantWithdrawal: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    }
  });

  // Dummy transactions data
  const dummyTransactions: Transaction[] = [
    {
      id: "txn-001",
      type: "deposit",
      amount: 15000,
      status: "completed",
      method: "UPI - Google Pay",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-002",
      type: "deposit",
      amount: 25000,
      status: "completed",
      method: "Bank Transfer - HDFC",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-003",
      type: "withdrawal",
      amount: 5000,
      status: "completed",
      method: "Bank Transfer - ICICI",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-004",
      type: "deposit",
      amount: 10000,
      status: "pending",
      method: "Credit Card - Visa",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-005",
      type: "withdrawal",
      amount: 8000,
      status: "completed",
      method: "Bank Transfer - SBI",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-006",
      type: "deposit",
      amount: 20000,
      status: "completed",
      method: "UPI - PhonePe",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-007",
      type: "withdrawal",
      amount: 3000,
      status: "failed",
      method: "Bank Transfer - Axis",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-008",
      type: "deposit",
      amount: 50000,
      status: "completed",
      method: "Bank Transfer - ICICI",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-009",
      type: "withdrawal",
      amount: 12000,
      status: "completed",
      method: "UPI - Paytm",
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "txn-010",
      type: "deposit",
      amount: 7500,
      status: "completed",
      method: "UPI - Google Pay",
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Fetch transactions from API with dummy data
  const { data: apiTransactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/funds/transactions"],
  });

  const allTransactions = apiTransactions && apiTransactions.length > 0 ? apiTransactions : dummyTransactions;

  const deposits = allTransactions.filter(t => t.type === "deposit");
  const withdrawals = allTransactions.filter(t => t.type === "withdrawal");

  const getTransactions = () => {
    switch (selectedTab) {
      case "deposits":
        return deposits;
      case "withdrawals":
        return withdrawals;
      default:
        return allTransactions;
    }
  };

  // Add funds mutation
  const addFundsMutation = useMutation({
    mutationFn: async (data: { amount: number; method: string }) => {
      return apiRequest("POST", "/api/funds/add", data);
    },
    onSuccess: () => {
      toast({
        title: "Funds Added Successfully",
        description: `₹${addAmount.toLocaleString()} has been added to your wallet`,
      });
      setShowAddFundsDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/funds/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/funds/transactions"] });
    },
  });

  // Withdraw funds mutation
  const withdrawFundsMutation = useMutation({
    mutationFn: async (data: { amount: number }) => {
      return apiRequest("POST", "/api/funds/withdraw", data);
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Initiated",
        description: `₹${withdrawAmount.toLocaleString()} withdrawal is being processed`,
      });
      setShowWithdrawDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/funds/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/funds/transactions"] });
    },
  });

  const handleAddFunds = () => {
    if (addAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹100",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to UPI payment page with fund details
    const params = new URLSearchParams({
      amount: addAmount.toString(),
      transactionType: 'add-funds',
      method: paymentMethod,
      returnUrl: '/funds'
    });
    navigate(`/upi-payment?${params.toString()}`);
  };

  const handleWithdraw = () => {
    const available = parseFloat(walletSummary?.wallet.availableBalance || "0");
    if (withdrawAmount < 500) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹500",
        variant: "destructive",
      });
      return;
    }
    if (withdrawAmount > available) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough available balance",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to UPI payment page with withdrawal details
    const params = new URLSearchParams({
      amount: withdrawAmount.toString(),
      transactionType: 'withdraw-funds',
      returnUrl: '/funds'
    });
    navigate(`/upi-payment?${params.toString()}`);
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (hideAmounts) return "****";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-white/10 text-white border-white/20 rounded-none font-light';
      case 'pending': return 'bg-white/10 text-white/80 border-white/20 rounded-none font-light';
      case 'failed': return 'bg-white/10 text-white/80 border-white/20 rounded-none font-light';
      default: return 'bg-white/5 text-white/60 border-white/10 rounded-none font-light';
    }
  };

  const totalBalance = parseFloat(walletSummary?.wallet.totalBalance || "0");
  const availableBalance = parseFloat(walletSummary?.wallet.availableBalance || "0");
  const lockedBalance = parseFloat(walletSummary?.wallet.lockedBalance || "0");
  const todaysGainLoss = walletSummary?.todaysGainLoss || 0;
  const totalInvested = walletSummary?.totalInvested || 0;

  const transactions = getTransactions();

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FUNDS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Wallet Management</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="pt-20 px-4 pb-4">
        <div className="border border-white/20 p-6 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-light">Total Wallet Balance</p>
              {walletLoading ? (
                <div className="h-10 w-32 bg-white/10 animate-pulse rounded-none" />
              ) : (
                <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-balance">{formatCurrency(totalBalance)}</p>
              )}
            </div>
            <div className="bg-white/10 border border-white/20 rounded-none p-4">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-black/40 border border-white/20 rounded-none p-4 backdrop-blur-sm hover:bg-black/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Unlock className="h-4 w-4 text-white/80" />
                <p className="text-xs text-white/80 uppercase tracking-widest font-light">Available</p>
              </div>
              <p className="text-xl font-light text-white tracking-wider" data-testid="text-available-balance">{formatCurrency(availableBalance)}</p>
            </div>
            <div className="bg-black/40 border border-white/20 rounded-none p-4 backdrop-blur-sm hover:bg-black/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-white/80" />
                <p className="text-xs text-white/80 uppercase tracking-widest font-light">Invested</p>
              </div>
              <p className="text-xl font-light text-white tracking-wider" data-testid="text-locked-balance">{formatCurrency(lockedBalance)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddFundsDialog(true)}
              className="flex-1 bg-white text-black hover:bg-white/90 h-12 font-light tracking-wider rounded-none"
              data-testid="button-add-funds"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button
              onClick={() => setShowWithdrawDialog(true)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 h-12 font-light tracking-wider rounded-none"
              data-testid="button-withdraw"
            >
              <Minus className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="px-0">
        <div className="sticky top-[73px] z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4">
          <TabsList className="w-full bg-transparent justify-start h-12 p-0 gap-6">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full font-light text-xs uppercase tracking-wider"
              data-testid="tab-overview"
            >
              <Wallet className="h-3 w-3 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="deposits" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full font-light text-xs uppercase tracking-wider"
              data-testid="tab-deposits"
            >
              <ArrowDownLeft className="h-3 w-3 mr-2" />
              Deposits
            </TabsTrigger>
            <TabsTrigger 
              value="withdrawals" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 rounded-none border-b-2 border-transparent px-0 pb-3 h-full font-light text-xs uppercase tracking-wider"
              data-testid="tab-withdrawals"
            >
              <ArrowUpRight className="h-3 w-3 mr-2" />
              Withdrawals
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0 px-4 py-6 space-y-8">
          {/* Performance Stats */}
          <div>
            <h2 className="text-xs font-light text-white/60 uppercase tracking-widest mb-4">Performance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-none p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3 w-3 text-white/60" />
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Invested</p>
                </div>
                <p className="text-2xl font-light text-white" data-testid="text-total-invested">{formatCurrency(totalInvested)}</p>
              </div>

              <div className={cn(
                "border rounded-none p-5 backdrop-blur-sm",
                todaysGainLoss >= 0 ? "bg-white/5 border-white/10" : "bg-white/5 border-white/10"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {todaysGainLoss >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-white/60" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-white/60" />
                  )}
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Today's P&L</p>
                </div>
                <p className={cn(
                  "text-2xl font-light",
                  todaysGainLoss >= 0 ? "text-white" : "text-white"
                )} data-testid="text-todays-pnl">
                  {todaysGainLoss >= 0 ? "+" : ""}{formatCurrency(todaysGainLoss)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xs font-light text-white/60 uppercase tracking-widest mb-4">Features</h2>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-none p-5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 border border-white/20 rounded-none p-3 flex-shrink-0">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-light text-white mb-1 tracking-wider">Instant Deposits</p>
                    <p className="text-xs text-white/60 font-light">Add funds via UPI, cards, or bank transfer</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">Free</Badge>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-none p-5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 border border-white/20 rounded-none p-3 flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-light text-white mb-1 tracking-wider">Bank-Grade Security</p>
                    <p className="text-xs text-white/60 font-light">256-bit SSL encryption & secure gateways</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">Secure</Badge>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-none p-5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 border border-white/20 rounded-none p-3 flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-light text-white mb-1 tracking-wider">Fast Withdrawals</p>
                    <p className="text-xs text-white/60 font-light">Instant during market hours (9 AM - 5 PM)</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">2-3 days</Badge>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-none p-5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 border border-white/20 rounded-none p-3 flex-shrink-0">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-light text-white mb-1 tracking-wider">Zero Charges</p>
                    <p className="text-xs text-white/60 font-light">No fees on most payment methods</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">0%</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-light text-white mb-2 tracking-wider">Important Information</p>
                <ul className="text-xs text-white/60 space-y-1 font-light">
                  <li>• Minimum deposit: ₹100 | Minimum withdrawal: ₹500</li>
                  <li>• Withdrawals processed within 2-3 business days</li>
                  <li>• Instant withdrawals available during market hours</li>
                  <li>• Funds held in secure escrow account</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Deposits & Withdrawals Tabs */}
        <TabsContent value="deposits" className="mt-0 px-4 py-6 space-y-4">
          <div>
            <h2 className="text-xs font-light text-white/60 uppercase tracking-widest mb-4">Deposit History</h2>
            {deposits.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-none p-8 text-center backdrop-blur-sm">
                <ArrowDownLeft className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 font-light">No deposits yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deposits.map((txn) => {
                  const { date, time } = formatDateTime(txn.timestamp);
                  return (
                    <div 
                      key={txn.id} 
                      onClick={() => navigate(`/transaction-detail/${txn.id}`)}
                      className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-none p-4 backdrop-blur-sm cursor-pointer"
                      data-testid={`deposit-${txn.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-white/10 border border-white/20 rounded-none p-3 flex-shrink-0">
                            <ArrowDownLeft className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-light text-white tracking-wider">Deposit</p>
                              <Badge className={getStatusColor(txn.status)}>
                                {txn.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-white/60 font-light">{txn.method}</p>
                            <p className="text-xs text-white/40 flex items-center gap-1 mt-1 font-light">
                              <Calendar className="h-3 w-3" />
                              {date} at {time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-light text-white" data-testid={`text-amount-${txn.id}`}>
                            +{formatCurrency(txn.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-0 px-4 py-6 space-y-4">
          <div>
            <h2 className="text-xs font-light text-white/60 uppercase tracking-widest mb-4">Withdrawal History</h2>
            {withdrawals.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-none p-8 text-center backdrop-blur-sm">
                <ArrowUpRight className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 font-light">No withdrawals yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((txn) => {
                  const { date, time } = formatDateTime(txn.timestamp);
                  return (
                    <div 
                      key={txn.id} 
                      onClick={() => navigate(`/transaction-detail/${txn.id}`)}
                      className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-none p-4 backdrop-blur-sm cursor-pointer"
                      data-testid={`withdrawal-${txn.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-white/10 border border-white/20 rounded-none p-3 flex-shrink-0">
                            <ArrowUpRight className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-light text-white tracking-wider">Withdrawal</p>
                              <Badge className={getStatusColor(txn.status)}>
                                {txn.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-white/60 font-light">{txn.method}</p>
                            <p className="text-xs text-white/40 flex items-center gap-1 mt-1 font-light">
                              <Calendar className="h-3 w-3" />
                              {date} at {time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-light text-white" data-testid={`text-amount-${txn.id}`}>
                            -{formatCurrency(txn.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Funds Dialog - Black & White Glassmorphic Design */}
      <Dialog open={showAddFundsDialog} onOpenChange={setShowAddFundsDialog}>
        <DialogContent className="sm:max-w-[550px] bg-black text-white border-white/20 rounded-none overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 border border-white/20 rounded-none p-3 backdrop-blur-sm">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-light tracking-wide text-white">
                  Add Funds
                </DialogTitle>
                <DialogDescription className="text-white/50 font-light text-sm mt-1">
                  Add money to your wallet instantly
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Amount Display Card */}
            <div className="bg-white/10 border border-white/20 rounded-none p-6 backdrop-blur-sm">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light mb-3 block">
                Enter Amount
              </Label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-white/60">₹</span>
                <Input
                  id="add-amount"
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(parseInt(e.target.value) || 0)}
                  className="pl-12 pr-4 bg-transparent border-0 border-b-2 border-white/20 text-5xl font-light text-white rounded-none focus:border-white/50 h-20 placeholder:text-white/20 transition-all"
                  placeholder="0"
                  data-testid="input-add-amount"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-white/40 font-light flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Minimum: ₹100
                </p>
                <p className="text-xs text-white/60 font-light flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Instant Credit
                </p>
              </div>
            </div>

            {/* Quick Amount Selection */}
            <div className="space-y-3">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">
                Quick Select
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 5000, 10000, 25000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amount)}
                    className={cn(
                      "border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-none font-light transition-all h-12 backdrop-blur-sm",
                      addAmount === amount ? "bg-white/20 border-white/40" : "bg-white/5"
                    )}
                    data-testid={`button-quick-${amount}`}
                  >
                    ₹{amount / 1000}k
                  </Button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none font-light h-12 hover:bg-white/10 transition-all backdrop-blur-sm" data-testid="select-payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 rounded-none">
                  <SelectItem value="upi" className="text-white font-light rounded-none">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-white" />
                      <span>UPI (Instant, Free)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="card" className="text-white font-light rounded-none">Credit/Debit Card (Instant, 2% fee)</SelectItem>
                  <SelectItem value="bank" className="text-white font-light rounded-none">Bank Transfer (2-3 hrs, Free)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddFunds}
              className={cn(
                "w-full text-white border rounded-none font-light tracking-wider h-12 backdrop-blur-sm transition-all",
                addAmount > 0 
                  ? "bg-green-600 hover:bg-green-700 border-green-600" 
                  : "bg-white/10 hover:bg-white/20 border-white/20"
              )}
              disabled={addFundsMutation.isPending}
              data-testid="button-confirm-add"
            >
              {addFundsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Proceed to Pay ₹{addAmount.toLocaleString()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog - Black & White Glassmorphic Design */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-[550px] bg-black text-white border-white/20 rounded-none overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 border border-white/20 rounded-none p-3 backdrop-blur-sm">
                <ArrowUpRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-light tracking-wide text-white">
                  Withdraw Funds
                </DialogTitle>
                <DialogDescription className="text-white/50 font-light text-sm mt-1">
                  Transfer to your bank account
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Available Balance Card */}
            <div className="bg-white/10 border border-white/20 rounded-none p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/60 font-light mb-1">Available Balance</p>
                  <p className="text-3xl font-light text-white">{formatCurrency(availableBalance)}</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-none p-3 backdrop-blur-sm">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Amount Display Card */}
            <div className="bg-white/10 border border-white/20 rounded-none p-6 backdrop-blur-sm">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light mb-3 block">
                Withdrawal Amount
              </Label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-white/60">₹</span>
                <Input
                  id="withdraw-amount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseInt(e.target.value) || 0)}
                  className="pl-12 pr-4 bg-transparent border-0 border-b-2 border-white/20 text-5xl font-light text-white rounded-none focus:border-white/50 h-20 placeholder:text-white/20 transition-all"
                  placeholder="0"
                  data-testid="input-withdraw-amount"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-white/40 font-light flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Minimum: ₹500
                </p>
                <p className="text-xs text-white/60 font-light flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Instant Transfer
                </p>
              </div>
            </div>

            {/* Quick Amount Selection */}
            <div className="space-y-3">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">
                Quick Select
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 5000, 10000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount(amount)}
                    className={cn(
                      "border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-none font-light transition-all h-12 backdrop-blur-sm",
                      withdrawAmount === amount ? "bg-white/20 border-white/40" : "bg-white/5"
                    )}
                    data-testid={`button-withdraw-quick-${amount}`}
                  >
                    ₹{amount >= 1000 ? `${amount / 1000}k` : amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleWithdraw}
              className={cn(
                "w-full text-white border rounded-none font-light tracking-wider h-12 backdrop-blur-sm transition-all",
                withdrawAmount > 0 
                  ? "bg-green-600 hover:bg-green-700 border-green-600" 
                  : "bg-white/10 hover:bg-white/20 border-white/20"
              )}
              disabled={withdrawFundsMutation.isPending}
              data-testid="button-confirm-withdraw"
            >
              {withdrawFundsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Proceed to Withdraw ₹{withdrawAmount.toLocaleString()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Funds;
