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
  Car,
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle,
  Trash2,
  MapPin,
  Wallet
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "My Car", vehicleNumber: "DL 01 AB 1234", fastagId: "FT123456789", bankName: "HDFC Bank", balance: 450, lastRecharge: "15 Sep 2024", status: "Active" },
  { id: "2", name: "Bike", vehicleNumber: "DL 02 CD 5678", fastagId: "FT987654321", bankName: "ICICI Bank", balance: 120, lastRecharge: "10 Aug 2024", status: "Active" },
  { id: "3", name: "Office Car", vehicleNumber: "MH 12 EF 9012", fastagId: "FT555123456", bankName: "SBI", balance: 25, lastRecharge: "05 Jul 2024", status: "Low Balance" },
];

const recentTransactions = [
  { id: "1", accountId: "1", accountName: "My Car", amount: 200, date: "15 Sep 2024", status: "Success", type: "Recharge", time: "03:30 PM" },
  { id: "2", accountId: "1", accountName: "My Car", amount: 85, date: "12 Sep 2024", status: "Success", type: "Toll - NH1 Plaza", time: "10:15 AM" },
  { id: "3", accountId: "2", accountName: "Bike", amount: 100, date: "10 Aug 2024", status: "Success", type: "Recharge", time: "02:45 PM" },
];

const allTransactions = [
  ...recentTransactions,
  { id: "4", accountId: "1", accountName: "My Car", amount: 65, date: "08 Sep 2024", status: "Success", type: "Toll - Kherki Daula", time: "08:30 AM" },
  { id: "5", accountId: "3", accountName: "Office Car", amount: 150, date: "05 Jul 2024", status: "Success", type: "Recharge", time: "11:20 AM" },
  { id: "6", accountId: "2", accountName: "Bike", amount: 45, date: "15 Jun 2024", status: "Success", type: "Toll - Ghaziabd Plaza", time: "04:15 PM" },
];

const dueRecharges = [
  { id: "d1", accountId: "3", accountName: "Office Car", vehicleNumber: "MH 12 EF 9012", balance: 25, minBalance: 100, message: "Low balance - Recharge recommended" },
];

const quickPayAmounts = [100, 200, 300, 500, 1000, 2000];

export default function FastagPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const handleAccountClick = (account: any) => {
    setSelectedAccount(account);
    setRechargeDialogOpen(true);
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

    setRechargeDialogOpen(false);
    
    const paymentParams = new URLSearchParams({
      transactionType: 'fastag-recharge',
      amount: payAmount.toString(),
      accountName: selectedAccount?.name || '',
      vehicleNumber: selectedAccount?.vehicleNumber || '',
      fastagId: selectedAccount?.fastagId || '',
      returnUrl: '/fastag'
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
    toast({
      title: "Add New Vehicle",
      description: "Add new FASTag account feature coming soon",
    });
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
            <h1 className="text-base font-bold tracking-wider">FASTAG RECHARGE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Toll & Highway Payments</p>
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
        {/* FASTag Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="fastag-summary">
          <div className="space-y-6">
            {/* Total Balance Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total FASTag Balance</p>
                <div className="flex items-center gap-2">
                  <Wallet className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">All Vehicles</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-balance">
                ₹{savedAccounts.reduce((sum, acc) => sum + acc.balance, 0)}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-vehicles">
                <p className="text-lg font-light text-white" data-testid="text-vehicles">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Vehicles</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-active-tags">
                <p className="text-lg font-light text-white" data-testid="text-active-tags">
                  {savedAccounts.filter(acc => acc.status === "Active").length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Active</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  {savedAccounts.filter(acc => acc.balance < 100).length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Low Balance</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-recent"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="due" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-due"
            >
              Due
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Activity</p>
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.type}</p>
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

          <TabsContent value="all" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Vehicles</p>
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleAccountClick(account)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Car className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.vehicleNumber} • {account.bankName}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Balance: ₹{account.balance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${account.status === "Active" ? "bg-white/10 text-white" : "bg-white/10 text-white/60"} border-white/20 rounded-none text-[10px] uppercase tracking-widest`}>
                      {account.status}
                    </Badge>
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

          <TabsContent value="due" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Low Balance Accounts</p>
            {dueRecharges.length > 0 ? (
              dueRecharges.map((recharge) => (
                <div
                  key={recharge.id}
                  onClick={() => {
                    const account = savedAccounts.find(a => a.id === recharge.accountId);
                    if (account) handleAccountClick(account);
                  }}
                  className="cursor-pointer border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4"
                  data-testid={`card-due-${recharge.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-light tracking-wide">{recharge.accountName}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{recharge.vehicleNumber}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Wallet className="h-3 w-3 text-white/40" />
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Balance: ₹{recharge.balance} (Min: ₹{recharge.minBalance})</p>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      Low
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-8 text-center">
                <CheckCircle className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">All accounts have sufficient balance</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">No recharges needed</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Transactions</p>
            {allTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-all-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.type}</p>
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
              <MapPin className="h-4 w-4 text-white/60" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-light tracking-wide mb-1">Seamless Toll Payments</h4>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Maintain minimum balance for hassle-free highway travel</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl tracking-wide">Recharge FASTag</DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase tracking-widest">
              {selectedAccount?.name} • {selectedAccount?.vehicleNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">FASTag ID</span>
                  <span className="text-white font-light">{selectedAccount?.fastagId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Bank</span>
                  <span className="text-white font-light">{selectedAccount?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Last Recharge</span>
                  <span className="text-white font-light flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedAccount?.lastRecharge}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-light tracking-wide">Current Balance</span>
                  <span className="text-2xl font-light text-white tracking-tight">₹{selectedAccount?.balance}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Quick Recharge</p>
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
                setRechargeDialogOpen(false);
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
              Are you sure you want to delete "{selectedAccount?.name}" ({selectedAccount?.vehicleNumber})? This action cannot be undone.
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
