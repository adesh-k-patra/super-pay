import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  ArrowLeft,
  Tv,
  ChevronRight,
  Calendar,
  CheckCircle,
  Trash2,
  Zap,
  AlertCircle,
  X,
  Pencil
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "Home DTH", subscriberId: "1234567890", operator: "Tata Play", packageName: "Sports Pack", balance: "₹450", dueAmount: 499, dueDate: "20 Oct 2024", lastRecharge: "15 Sep 2024" },
  { id: "2", name: "Parents DTH", subscriberId: "9876543210", operator: "Airtel Digital TV", packageName: "Family Pack", balance: "₹320", dueAmount: 599, dueDate: "22 Oct 2024", lastRecharge: "18 Sep 2024" },
  { id: "3", name: "Office", subscriberId: "5555666677", operator: "Dish TV", packageName: "News Pack", balance: "₹250", dueAmount: 299, dueDate: "25 Oct 2024", lastRecharge: "10 Sep 2024" },
];

const allTransactions = [
  { id: "1", accountId: "1", amount: 499, date: "15 Sep 2024", status: "Success", time: "10:30 AM", plan: "Sports HD Pack - Monthly" },
  { id: "2", accountId: "1", amount: 399, date: "10 Aug 2024", status: "Success", time: "03:15 PM", plan: "Basic Pack - Monthly" },
  { id: "3", accountId: "2", amount: 599, date: "18 Sep 2024", status: "Success", time: "02:45 PM", plan: "Family Entertainment Pack" },
  { id: "4", accountId: "1", amount: 499, date: "15 Jul 2024", status: "Success", time: "11:45 AM", plan: "Sports HD Pack - Monthly" },
  { id: "5", accountId: "3", amount: 299, date: "10 Sep 2024", status: "Success", time: "04:20 PM", plan: "News & Current Affairs" },
  { id: "6", accountId: "2", amount: 599, date: "18 Aug 2024", status: "Success", time: "01:15 PM", plan: "Family Entertainment Pack" },
];

const dueRecharges = [
  { id: "d1", accountId: "1", amount: 499, dueDate: "20 Oct 2024", plan: "Monthly Renewal" },
];

const dthPlans = {
  popular: [
    { id: "p1", amount: 299, validity: "1 month", description: "Basic Pack", channels: "150+ SD" },
    { id: "p2", amount: 499, validity: "1 month", description: "Sports HD Pack", channels: "200+ HD" },
    { id: "p3", amount: 599, validity: "1 month", description: "Family Entertainment", channels: "250+ HD" },
  ],
  premium: [
    { id: "pr1", amount: 799, validity: "1 month", description: "Premium HD Pack", channels: "300+ HD" },
    { id: "pr2", amount: 999, validity: "1 month", description: "Platinum Pack", channels: "400+ HD" },
  ],
  longterm: [
    { id: "lt1", amount: 2999, validity: "6 months", description: "Half Yearly Pack", channels: "200+ HD" },
    { id: "lt2", amount: 5499, validity: "12 months", description: "Annual Pack", channels: "200+ HD" },
  ],
};

export default function DTHRechargeAccountDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/dth-recharge/account/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planCategory, setPlanCategory] = useState("popular");
  const [isDueCardVisible, setIsDueCardVisible] = useState(true);

  const account = savedAccounts.find(acc => acc.id === params?.id) || savedAccounts[0];
  const accountRecentTransactions = allTransactions.filter(txn => txn.accountId === params?.id).slice(0, 3);
  const accountAllTransactions = allTransactions.filter(txn => txn.accountId === params?.id);
  const accountDueRecharges = dueRecharges.filter(txn => txn.accountId === params?.id);

  const handleRecharge = () => {
    setPlanDialogOpen(true);
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
      accountName: account.name,
      subscriberId: account.subscriberId,
      operator: account.operator,
      planDetails: selectedPlan.description,
      returnUrl: `/dth-recharge/account/${account.id}`
    });
    
    navigate(`/upi-payment?${paymentParams.toString()}`);
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: `${account.name} has been removed from your saved accounts`,
    });
    setDeleteDialogOpen(false);
    navigate("/dth-recharge");
  };

  const handleTransactionClick = (transaction: any) => {
    navigate(`/dth-recharge/transaction/${transaction.id}`);
  };

  const getCurrentPlans = () => {
    switch(planCategory) {
      case "premium":
        return dthPlans.premium;
      case "longterm":
        return dthPlans.longterm;
      default:
        return dthPlans.popular;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dth-recharge")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">ACCOUNT DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{account.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams({
                  edit: 'true',
                  id: account.id,
                  name: account.name,
                  subscriberId: account.subscriberId,
                  operator: account.operator,
                  packageName: account.packageName
                });
                navigate(`/add-dth-account?${params.toString()}`);
              }}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-edit"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAccount}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-delete"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 border border-white/20 flex items-center justify-center">
              <Tv className="h-7 w-7 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-light text-xl tracking-wide mb-1">{account.name}</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator}</p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
              Active
            </Badge>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Subscriber ID</span>
              <span className="text-white font-light">{account.subscriberId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Current Package</span>
              <span className="text-white font-light">{account.packageName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Balance</span>
              <span className="text-white font-light">{account.balance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Last Recharge</span>
              <span className="text-white font-light">{account.lastRecharge}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-recent"
            >
              Recent
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
            {accountRecentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.plan}</p>
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

          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Transaction History</p>
            {accountAllTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-history-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.plan}</p>
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

      {isDueCardVisible && account.dueAmount && (
        <div className="px-4 pb-4">
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4 flex items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="h-5 w-5 text-white/60 mt-1" />
              <div>
                <h3 className="text-sm font-light text-white tracking-wide mb-2">Due Payment</h3>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-white">₹{account.dueAmount}</p>
                  <p className="text-white/60 text-xs">Due Date: <span className="text-white font-light">{account.dueDate}</span></p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  transactionType: 'dth-recharge',
                  amount: account.dueAmount.toString(),
                  accountName: account.name,
                  subscriberId: account.subscriberId,
                  operator: account.operator,
                  returnUrl: `/dth-recharge/account/${account.id}`
                });
                navigate(`/upi-payment?${params.toString()}`);
              }}
              className="bg-red-500 hover:bg-red-600 text-white h-10 px-10 font-light tracking-wide rounded-none min-w-[100px]"
              data-testid="button-pay-due"
            >
              Pay
            </Button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={() => {
            if (isDueCardVisible && account.dueAmount) {
              const params = new URLSearchParams({
                transactionType: 'dth-recharge',
                amount: account.dueAmount.toString(),
                accountName: account.name,
                subscriberId: account.subscriberId,
                operator: account.operator,
                returnUrl: `/dth-recharge/account/${account.id}`
              });
              navigate(`/upi-payment?${params.toString()}`);
            } else {
              handleRecharge();
            }
          }}
          className="w-full bg-white hover:bg-white/90 text-black h-12 font-light text-base tracking-wide rounded-none flex items-center justify-center gap-2"
          data-testid="button-recharge"
        >
          <Zap className="h-4 w-4" />
          Recharge Now
        </Button>
      </div>

      {/* Plan Selection Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl tracking-wide">Select Recharge Plan</DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase tracking-widest">
              Choose a plan for {account.subscriberId}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={planCategory} onValueChange={setPlanCategory} className="mt-4">
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
              <TabsTrigger 
                value="popular" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Popular
              </TabsTrigger>
              <TabsTrigger 
                value="premium" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Premium
              </TabsTrigger>
              <TabsTrigger 
                value="longterm" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Long Term
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
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-2xl font-light text-white tracking-tight">₹{plan.amount}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{plan.description}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{plan.validity} • {plan.channels}</p>
                    </div>
                    {selectedPlan?.id === plan.id && (
                      <CheckCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Tabs>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                setPlanDialogOpen(false);
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
              Are you sure you want to delete "{account.name}" ({account.subscriberId})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 hover:bg-white/15 text-white border-white/20 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccount}
              className="bg-white hover:bg-white/90 text-black rounded-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
