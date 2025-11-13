import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Zap,
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle,
  Trash2,
  AlertCircle
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "Home", consumerNumber: "1234567890", provider: "BSES Rajdhani", state: "Delhi", lastBillAmount: 1245, dueDate: "25 Oct 2024", status: "Due" },
  { id: "2", name: "Office", consumerNumber: "9876543210", provider: "Tata Power", state: "Maharashtra", lastBillAmount: 3450, dueDate: "20 Oct 2024", status: "Due" },
  { id: "3", name: "Shop", consumerNumber: "5551234567", provider: "BESCOM", state: "Karnataka", lastBillAmount: 2100, dueDate: "15 Oct 2024", status: "Paid" },
  { id: "4", name: "Parents Home", consumerNumber: "7778889990", provider: "MSEB", state: "Maharashtra", lastBillAmount: 1890, dueDate: "30 Oct 2024", status: "Paid" },
  { id: "5", name: "Rental Property", consumerNumber: "4445556667", provider: "TNEB", state: "Tamil Nadu", lastBillAmount: 2560, dueDate: "28 Oct 2024", status: "Due" },
  { id: "6", name: "Farmhouse", consumerNumber: "1112223334", provider: "PSPCL", state: "Punjab", lastBillAmount: 1750, dueDate: "22 Oct 2024", status: "Paid" },
  { id: "7", name: "Vacation Home", consumerNumber: "9990001112", provider: "KSEBL", state: "Kerala", lastBillAmount: 980, dueDate: "18 Oct 2024", status: "Paid" },
];

const recentTransactions = [
  { id: "1", accountId: "1", accountName: "Home", provider: "BSES Rajdhani", amount: 1189, date: "25 Sep 2024", status: "Paid", time: "02:30 PM" },
  { id: "2", accountId: "2", accountName: "Office", provider: "Tata Power", amount: 3200, date: "20 Sep 2024", status: "Paid", time: "11:45 AM" },
  { id: "3", accountId: "1", accountName: "Home", provider: "BSES Rajdhani", amount: 1156, date: "25 Aug 2024", status: "Paid", time: "03:15 PM" },
];

const allTransactions = [
  ...recentTransactions,
  { id: "4", accountId: "3", accountName: "Shop", provider: "BESCOM", amount: 1950, date: "15 Sep 2024", status: "Paid", time: "10:00 AM" },
  { id: "5", accountId: "2", accountName: "Office", provider: "Tata Power", amount: 3100, date: "20 Aug 2024", status: "Paid", time: "04:20 PM" },
  { id: "6", accountId: "1", accountName: "Home", provider: "BSES Rajdhani", amount: 1234, date: "25 Jul 2024", status: "Paid", time: "01:30 PM" },
  { id: "7", accountId: "4", accountName: "Parents Home", provider: "MSEB", amount: 1820, date: "30 Sep 2024", status: "Paid", time: "09:15 AM" },
  { id: "8", accountId: "5", accountName: "Rental Property", provider: "TNEB", amount: 2450, date: "28 Sep 2024", status: "Paid", time: "05:30 PM" },
  { id: "9", accountId: "6", accountName: "Farmhouse", provider: "PSPCL", amount: 1680, date: "22 Sep 2024", status: "Paid", time: "12:00 PM" },
  { id: "10", accountId: "3", accountName: "Shop", provider: "BESCOM", amount: 1890, date: "15 Aug 2024", status: "Paid", time: "03:45 PM" },
  { id: "11", accountId: "7", accountName: "Vacation Home", provider: "KSEBL", amount: 920, date: "18 Sep 2024", status: "Paid", time: "11:20 AM" },
  { id: "12", accountId: "2", accountName: "Office", provider: "Tata Power", amount: 3050, date: "20 Jul 2024", status: "Paid", time: "02:10 PM" },
];

const duePayments = [
  { id: "d1", accountId: "1", accountName: "Home", provider: "BSES Rajdhani", amount: 1245, dueDate: "25 Oct 2024" },
  { id: "d2", accountId: "2", accountName: "Office", provider: "Tata Power", amount: 3450, dueDate: "20 Oct 2024" },
  { id: "d3", accountId: "3", accountName: "Shop", provider: "BESCOM", amount: 2100, dueDate: "15 Oct 2024" },
];

// Quick pay amounts for electricity
const quickPayAmounts = [500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];

export default function ElectricityBill() {
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
      transactionType: 'electricity-bill',
      amount: payAmount.toString(),
      accountName: selectedAccount?.name || '',
      consumerNumber: selectedAccount?.consumerNumber || '',
      provider: selectedAccount?.provider || '',
      returnUrl: '/electricity-bill'
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
    navigate("/add-electricity-account");
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
            <h1 className="text-base font-bold tracking-wider">ELECTRICITY BILL</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Manage your bills</p>
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
        {/* Electricity Bill Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="electricity-summary">
          <div className="space-y-6">
            {/* Total Bills Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Electricity Bills</p>
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-electricity">
                ₹{(duePayments.reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(1)}K
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-paid-bills">
                <p className="text-lg font-light text-white" data-testid="text-paid-bills">
                  {recentTransactions.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Paid</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-active-connections">
                <p className="text-lg font-light text-white" data-testid="text-active-connections">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Active</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  {duePayments.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Pending</p>
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
                onClick={() => navigate(`/electricity-bill/account/${payment.accountId}`)}
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
                onClick={() => navigate(`/electricity-bill/account/${transaction.accountId}`)}
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
                onClick={() => navigate(`/electricity-bill/account/${account.id}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.provider} • {account.consumerNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteAccount(account, e)}
                      className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                      data-testid={`button-delete-${account.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Transactions</p>
            {allTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => navigate(`/electricity-bill/transaction/${transaction.id}`)}
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

        {/* Info Card */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-light mb-1 tracking-wide">Payment Reminder</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Pay your bills on time to avoid late charges and service interruption</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl tracking-wide">Pay Electricity Bill</DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase tracking-widest">
              {selectedAccount?.name} • {selectedAccount?.consumerNumber}
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
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">State</span>
                  <span className="text-white font-light">{selectedAccount?.state}</span>
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
              <div className="grid grid-cols-4 gap-3">
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

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-light text-xl tracking-wide">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 text-sm">
              Are you sure you want to delete "{selectedAccount?.name}" ({selectedAccount?.consumerNumber})? This action cannot be undone.
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
