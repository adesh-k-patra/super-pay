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
  Tv,
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle,
  Trash2,
  Radio,
  Film,
  Clock
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "Living Room", subscriberId: "123456789", operator: "Tata Play", lastRecharge: "10 Sep 2024", validity: "Valid till 10 Oct 2024", status: "Active" },
  { id: "2", name: "Bedroom", subscriberId: "987654321", operator: "Airtel Digital TV", lastRecharge: "15 Sep 2024", validity: "Valid till 15 Oct 2024", status: "Active" },
  { id: "3", name: "Guest Room", subscriberId: "555123456", operator: "Dish TV", lastRecharge: "05 Aug 2024", validity: "Expired", status: "Inactive" },
];

const recentTransactions = [
  { id: "1", accountId: "1", accountName: "Living Room", operator: "Tata Play", amount: 499, date: "10 Sep 2024", status: "Success", plan: "Family Pack - 30 days", time: "03:30 PM" },
  { id: "2", accountId: "2", accountName: "Bedroom", operator: "Airtel Digital TV", amount: 299, date: "15 Sep 2024", status: "Success", plan: "Basic Pack - 30 days", time: "11:15 AM" },
  { id: "3", accountId: "1", accountName: "Living Room", operator: "Tata Play", amount: 499, date: "10 Aug 2024", status: "Success", plan: "Family Pack - 30 days", time: "02:45 PM" },
];

const allTransactions = [
  ...recentTransactions,
  { id: "4", accountId: "3", accountName: "Guest Room", operator: "Dish TV", amount: 299, date: "05 Aug 2024", status: "Success", plan: "Basic Pack - 30 days", time: "10:20 AM" },
  { id: "5", accountId: "2", accountName: "Bedroom", operator: "Airtel Digital TV", amount: 299, date: "15 Aug 2024", status: "Success", plan: "Basic Pack - 30 days", time: "04:00 PM" },
  { id: "6", accountId: "1", accountName: "Living Room", operator: "Tata Play", amount: 699, date: "10 Jul 2024", status: "Success", plan: "Entertainment Pack - 30 days", time: "01:30 PM" },
];

const dueRecharges = [
  { id: "d1", accountId: "3", accountName: "Guest Room", operator: "Dish TV", amount: 299, dueDate: "Expired", plan: "Recharge needed" },
];

// DTH recharge plans
const dthPlans = {
  basic: [
    { id: "b1", amount: 299, validity: "30 days", channels: "150+", hd: 10, description: "Basic entertainment" },
    { id: "b2", amount: 399, validity: "45 days", channels: "150+", hd: 10, description: "Extended basic" },
  ],
  family: [
    { id: "f1", amount: 499, validity: "30 days", channels: "250+", hd: 25, description: "Family pack" },
    { id: "f2", amount: 699, validity: "30 days", channels: "350+", hd: 50, description: "Entertainment pack" },
    { id: "f3", amount: 999, validity: "30 days", channels: "500+", hd: 100, description: "Premium pack" },
  ],
  sports: [
    { id: "s1", amount: 599, validity: "30 days", channels: "200+", hd: 30, description: "Sports special" },
    { id: "s2", amount: 799, validity: "30 days", channels: "300+", hd: 40, description: "Movie lovers" },
  ],
};

export default function DTHRecharge() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planCategory, setPlanCategory] = useState("family");

  const handleAccountClick = (account: any) => {
    setSelectedAccount(account);
    setPlanDialogOpen(true);
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

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) {
      toast({
        title: "Select a Plan",
        description: "Please select a recharge plan to continue",
        variant: "destructive",
      });
      return;
    }

    setPlanDialogOpen(false);
    
    const paymentParams = new URLSearchParams({
      transactionType: 'dth-recharge',
      amount: selectedPlan.amount.toString(),
      accountName: selectedAccount?.name || '',
      subscriberId: selectedAccount?.subscriberId || '',
      operator: selectedAccount?.operator || '',
      planDetails: selectedPlan.description,
      returnUrl: '/dth-recharge'
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
      title: "Add New Account",
      description: "Add new DTH account feature coming soon",
    });
  };

  const getCurrentPlans = () => {
    switch(planCategory) {
      case "basic":
        return dthPlans.basic;
      case "sports":
        return dthPlans.sports;
      default:
        return dthPlans.family;
    }
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
            <h1 className="text-base font-bold tracking-wider">DTH RECHARGE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">TV & Entertainment</p>
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
        {/* DTH Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="dth-summary">
          <div className="space-y-6">
            {/* Total Recharges Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total DTH Spend</p>
                <div className="flex items-center gap-2">
                  <Tv className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-dth-spend">
                ₹{recentTransactions.slice(0, 3).reduce((sum, t) => sum + t.amount, 0)}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-recharge-count">
                <p className="text-lg font-light text-white" data-testid="text-recharge-count">
                  {recentTransactions.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Recharges</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-active-accounts">
                <p className="text-lg font-light text-white" data-testid="text-active-accounts">
                  {savedAccounts.filter(acc => acc.status === "Active").length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Active</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  {dueRecharges.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Due Soon</p>
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Recharges</p>
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
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.operator}</p>
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Accounts</p>
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
                      <Tv className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator} • {account.subscriberId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${account.status === "Active" ? "bg-white/10 text-white" : "bg-white/5 text-white/40"} border-white/20 rounded-none text-[10px] uppercase tracking-widest`}>
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Due Recharges</p>
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
                      <p className="text-white font-light tracking-wide">₹{recharge.amount}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{recharge.accountName} • {recharge.operator}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-white/40" />
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{recharge.plan}</p>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      Due
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-8 text-center">
                <CheckCircle className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No pending recharges</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">All accounts are active</p>
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
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.operator}</p>
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
      </div>

      {/* Plan Selection Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl tracking-wide">Select DTH Plan</DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase tracking-widest">
              {selectedAccount?.name} • {selectedAccount?.subscriberId}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={planCategory} onValueChange={setPlanCategory} className="mt-4">
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Basic
              </TabsTrigger>
              <TabsTrigger 
                value="family" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Family
              </TabsTrigger>
              <TabsTrigger 
                value="sports" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Sports & Movies
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-3">
              {getCurrentPlans().map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className={`cursor-pointer border ${
                    selectedPlan?.id === plan.id
                      ? "border-white/40 bg-white/10"
                      : "border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20"
                  } transition-all p-4`}
                  data-testid={`card-plan-${plan.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-2xl font-light text-white tracking-tight">₹{plan.amount}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{plan.description}</p>
                    </div>
                    {selectedPlan?.id === plan.id && (
                      <CheckCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.validity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Radio className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.channels}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Film className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.hd} HD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tabs>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                setPlanDialogOpen(false);
                setSelectedAccount(null);
                setSelectedPlan(null);
              }}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-none"
              data-testid="button-cancel-plan"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              disabled={!selectedPlan}
              className="flex-1 bg-white hover:bg-white/90 text-black rounded-none disabled:opacity-50"
              data-testid="button-proceed-payment"
            >
              Pay ₹{selectedPlan?.amount || 0}
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
              Are you sure you want to delete "{selectedAccount?.name}" ({selectedAccount?.subscriberId})? This action cannot be undone.
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
