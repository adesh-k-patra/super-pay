import { useState } from "react";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Wifi,
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle,
  Trash2,
  Zap,
  TrendingUp
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "Home", accountNumber: "BB123456789", provider: "JioFiber", plan: "Premium 200 Mbps", lastBillAmount: 999, dueDate: "05 Oct 2024", status: "Due" },
  { id: "2", name: "Office", accountNumber: "BB987654321", provider: "Airtel Xstream", plan: "Business 1 Gbps", lastBillAmount: 2999, dueDate: "10 Oct 2024", status: "Due" },
  { id: "3", name: "Apartment", accountNumber: "BB456789012", provider: "ACT Fibernet", plan: "Standard 150 Mbps", lastBillAmount: 749, dueDate: "12 Oct 2024", status: "Due" },
  { id: "4", name: "Shop", accountNumber: "BB789012345", provider: "BSNL Fiber", plan: "Basic 100 Mbps", lastBillAmount: 599, dueDate: "15 Oct 2024", status: "Due" },
  { id: "5", name: "Factory", accountNumber: "BB234567890", provider: "Tata Play Fiber", plan: "Enterprise 500 Mbps", lastBillAmount: 1899, dueDate: "18 Oct 2024", status: "Due" },
  { id: "6", name: "Warehouse", accountNumber: "BB567890123", provider: "Hathway", plan: "Plus 300 Mbps", lastBillAmount: 1299, dueDate: "20 Oct 2024", status: "Due" },
  { id: "7", name: "Villa", accountNumber: "BB890123456", provider: "Excitel", plan: "Pro 250 Mbps", lastBillAmount: 899, dueDate: "22 Oct 2024", status: "Due" },
];

const recentTransactions = [
  { id: "1", accountId: "1", accountName: "Home", provider: "JioFiber", amount: 999, date: "05 Sep 2024", status: "Paid", plan: "Premium 200 Mbps", time: "03:30 PM" },
  { id: "2", accountId: "2", accountName: "Office", provider: "Airtel Xstream", amount: 2999, date: "10 Sep 2024", status: "Paid", plan: "Business 1 Gbps", time: "11:15 AM" },
  { id: "3", accountId: "1", accountName: "Home", provider: "JioFiber", amount: 799, date: "05 Aug 2024", status: "Paid", plan: "Standard 100 Mbps", time: "02:45 PM" },
];

const allTransactions = [
  ...recentTransactions,
  { id: "4", accountId: "2", accountName: "Office", provider: "Airtel Xstream", amount: 2999, date: "10 Aug 2024", status: "Paid", plan: "Business 1 Gbps", time: "10:20 AM" },
  { id: "5", accountId: "1", accountName: "Home", provider: "JioFiber", amount: 999, date: "05 Jul 2024", status: "Paid", plan: "Premium 200 Mbps", time: "04:00 PM" },
  { id: "6", accountId: "3", accountName: "Apartment", provider: "ACT Fibernet", amount: 749, date: "12 Jul 2024", status: "Paid", plan: "Standard 150 Mbps", time: "01:30 PM" },
  { id: "7", accountId: "4", accountName: "Shop", provider: "BSNL Fiber", amount: 599, date: "15 Jul 2024", status: "Paid", plan: "Basic 100 Mbps", time: "03:45 PM" },
  { id: "8", accountId: "5", accountName: "Factory", provider: "Tata Play Fiber", amount: 1899, date: "18 Jun 2024", status: "Paid", plan: "Enterprise 500 Mbps", time: "11:50 AM" },
  { id: "9", accountId: "6", accountName: "Warehouse", provider: "Hathway", amount: 1299, date: "20 Jun 2024", status: "Paid", plan: "Plus 300 Mbps", time: "02:10 PM" },
  { id: "10", accountId: "7", accountName: "Villa", provider: "Excitel", amount: 899, date: "22 Jun 2024", status: "Paid", plan: "Pro 250 Mbps", time: "04:35 PM" },
  { id: "11", accountId: "1", accountName: "Home", provider: "JioFiber", amount: 999, date: "05 Jun 2024", status: "Paid", plan: "Premium 200 Mbps", time: "03:20 PM" },
  { id: "12", accountId: "2", accountName: "Office", provider: "Airtel Xstream", amount: 2999, date: "10 May 2024", status: "Paid", plan: "Business 1 Gbps", time: "10:00 AM" },
];

const duePayments = [
  { id: "d1", accountId: "1", accountName: "Home", provider: "JioFiber", amount: 999, dueDate: "05 Oct 2024" },
  { id: "d2", accountId: "2", accountName: "Office", provider: "Airtel Xstream", amount: 2999, dueDate: "10 Oct 2024" },
];

const quickPayAmounts = [500, 999, 1500, 2000, 2999, 5000];

export default function BroadbandBill() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const handleAccountClick = (account: any) => {
    setSelectedAccount(account);
    setPaymentDialogOpen(true);
  };

  const handleDeleteAccount = (account: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: `${selectedAccount?.name} has been removed from your saved accounts`,
    });
    setDeleteDialogOpen(false);
    setSelectedAccount(null);
  };

  const handleProceedToPayment = () => {
    const payAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    if (!payAmount) {
      toast({
        title: "Select Amount",
        description: "Please select or enter an amount to proceed",
        variant: "destructive",
      });
      return;
    }

    setPaymentDialogOpen(false);
    
    const paymentParams = new URLSearchParams({
      transactionType: 'broadband-bill',
      amount: payAmount.toString(),
      accountName: selectedAccount?.name || '',
      accountNumber: selectedAccount?.accountNumber || '',
      provider: selectedAccount?.provider || '',
      returnUrl: '/broadband-bill'
    });
    
    navigate(`/upi-payment?${paymentParams.toString()}`);
  };

  const handleTransactionClick = (transaction: any) => {
    toast({
      title: "Transaction Details",
      description: `${transaction.accountName} - ₹${transaction.amount}`,
    });
  };

  const handleAddNew = () => {
    navigate("/add-broadband-account");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider">BROADBAND BILL</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Internet & Connectivity</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddNew}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-new"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Broadband Bill Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="broadband-summary">
          <div className="space-y-6">
            {/* Total Bills Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Broadband Bills</p>
                <div className="flex items-center gap-2">
                  <Wifi className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-broadband">
                ₹{(duePayments.reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(1)}K
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-paid-count">
                <p className="text-lg font-light text-white" data-testid="text-paid-count">
                  {recentTransactions.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Paid</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-connections-count">
                <p className="text-lg font-light text-white" data-testid="text-connections-count">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Connections</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  {duePayments.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Due Bills</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-recent"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="accounts" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-accounts"
            >
              Accounts
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Payments & Due Bills</p>
            {duePayments.slice(0, 2).map((payment) => (
              <div
                key={payment.id}
                onClick={() => navigate(`/broadband-bill/account/${payment.accountId}`)}
                className="cursor-pointer border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4"
                data-testid={`card-recent-due-${payment.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{payment.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{payment.accountName} • {payment.provider}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Due: {payment.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      Due
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => navigate(`/broadband-bill/account/${transaction.accountId}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.provider}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      {transaction.status}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="accounts" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Saved Accounts</p>
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => navigate(`/broadband-bill/account/${account.id}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Wifi className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.provider} • {account.plan}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/40" />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Transactions</p>
            {allTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => navigate(`/broadband-bill/transaction/${transaction.id}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-all-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.provider}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      {transaction.status}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="h-4 w-4 text-white/60" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-light tracking-wide mb-1">Upgrade to Faster Speeds</h4>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Get up to 1 Gbps with additional OTT benefits</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl tracking-wide">Pay Broadband Bill</DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase tracking-widest">
              {selectedAccount?.name} • {selectedAccount?.accountNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Provider</span>
                  <span className="text-white font-light">{selectedAccount?.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Plan</span>
                  <span className="text-white font-light">{selectedAccount?.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Due Date</span>
                  <span className="text-white font-light flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedAccount?.dueDate}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-light tracking-wide">Bill Amount</span>
                  <span className="text-2xl font-light text-white tracking-tight">₹{selectedAccount?.lastBillAmount}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Quick Pay</p>
              <div className="grid grid-cols-3 gap-3">
                {quickPayAmounts.map((amount) => (
                  <div
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`cursor-pointer border ${
                      selectedAmount === amount && !customAmount
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20"
                    } transition-all p-3 text-center`}
                    data-testid={`button-amount-${amount}`}
                  >
                    <p className="text-white font-light">₹{amount}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2">Custom Amount</p>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter amount"
                className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 rounded-none h-11 px-4 font-light"
                data-testid="input-custom-amount"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                setPaymentDialogOpen(false);
                setSelectedAccount(null);
                setSelectedAmount(null);
                setCustomAmount("");
              }}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-none"
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              className="flex-1 bg-white hover:bg-white/90 text-black rounded-none"
              data-testid="button-proceed-payment"
            >
              Pay {customAmount ? `₹${customAmount}` : selectedAmount ? `₹${selectedAmount}` : '₹0'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-light text-xl tracking-wide">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 text-sm">
              Are you sure you want to delete "{selectedAccount?.name}" ({selectedAccount?.accountNumber})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 hover:bg-white/15 text-white border-white/20 rounded-none" data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteAccount}
              className="bg-white hover:bg-white/90 text-black rounded-none"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
