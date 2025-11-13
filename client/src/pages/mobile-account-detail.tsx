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
  Smartphone,
  ChevronRight,
  Calendar,
  Zap,
  CheckCircle,
  Trash2,
  Wifi,
  MessageSquare,
  Phone,
  Pencil
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "Personal", number: "98765 43210", operator: "Airtel", type: "Prepaid", balance: "₹45.20", lastRecharge: "15 Sep 2024", validity: "28 days remaining" },
  { id: "2", name: "Work Phone", number: "91234 56789", operator: "Jio", type: "Postpaid", balance: "₹120.50", lastRecharge: "05 Aug 2024", validity: "Monthly plan" },
  { id: "3", name: "Mom's Number", number: "98888 77777", operator: "Vi", type: "Prepaid", balance: "₹85.00", lastRecharge: "10 Jul 2024", validity: "56 days remaining" },
];

const recentTransactions = [
  { id: "1", accountId: "1", amount: 199, date: "15 Sep 2024", status: "Success", plan: "2GB/day - 28 days", time: "10:30 AM" },
  { id: "2", accountId: "1", amount: 479, date: "10 Aug 2024", status: "Success", plan: "1.5GB/day - 56 days", time: "03:15 PM" },
  { id: "3", accountId: "2", amount: 299, date: "05 Aug 2024", status: "Success", plan: "1.5GB/day - 28 days", time: "02:45 PM" },
];

const allTransactions = [
  ...recentTransactions,
  { id: "4", accountId: "1", amount: 199, date: "15 Jul 2024", status: "Success", plan: "2GB/day - 28 days", time: "11:45 AM" },
  { id: "5", accountId: "3", amount: 399, date: "10 Jul 2024", status: "Success", plan: "2.5GB/day - 56 days", time: "04:20 PM" },
  { id: "6", accountId: "2", amount: 499, date: "01 Jul 2024", status: "Success", plan: "75GB Monthly - Postpaid", time: "01:15 PM" },
];

const dueRecharges = [
  { id: "d1", accountId: "1", amount: 199, dueDate: "20 Oct 2024", plan: "Validity expiring soon" },
];

// Mobile recharge plans with different categories
const mobilePlans = {
  popular: [
    { id: "p1", amount: 199, validity: "28 days", data: "2GB/day", calls: "Unlimited", sms: "100/day", description: "Popular choice" },
    { id: "p2", amount: 299, validity: "28 days", data: "2GB/day", calls: "Unlimited", sms: "100/day", description: "Best value" },
    { id: "p3", amount: 479, validity: "56 days", data: "1.5GB/day", calls: "Unlimited", sms: "100/day", description: "Long validity" },
  ],
  data: [
    { id: "d1", amount: 299, validity: "28 days", data: "3GB/day", calls: "Unlimited", sms: "100/day", description: "Data booster" },
    { id: "d2", amount: 399, validity: "28 days", data: "4GB/day", calls: "Unlimited", sms: "100/day", description: "Heavy user" },
    { id: "d3", amount: 666, validity: "84 days", data: "2GB/day", calls: "Unlimited", sms: "100/day", description: "Quarterly plan" },
  ],
  unlimited: [
    { id: "u1", amount: 2999, validity: "365 days", data: "2GB/day", calls: "Unlimited", sms: "100/day", description: "Annual unlimited" },
    { id: "u2", amount: 839, validity: "84 days", data: "2.5GB/day", calls: "Unlimited", sms: "100/day", description: "Entertainment pack" },
  ],
};

export default function MobileAccountDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/mobile-recharge/account/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planCategory, setPlanCategory] = useState("popular");

  const account = savedAccounts.find(acc => acc.id === params?.id) || savedAccounts[0];
  const accountRecentTransactions = allTransactions.filter(txn => txn.accountId === params?.id).slice(0, 3);
  const accountAllTransactions = allTransactions.filter(txn => txn.accountId === params?.id);
  const accountDueTransactions = dueRecharges.filter(txn => txn.accountId === params?.id);

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
      transactionType: 'mobile-recharge',
      amount: selectedPlan.amount.toString(),
      accountName: account.name,
      accountNumber: account.number,
      operator: account.operator,
      planDetails: selectedPlan.description,
      returnUrl: `/mobile-recharge/account/${account.id}`
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
    navigate("/mobile-recharge");
  };

  const handleTransactionClick = (transaction: any) => {
    navigate(`/mobile-recharge/transaction/${transaction.id}`);
  };

  const getCurrentPlans = () => {
    switch(planCategory) {
      case "data":
        return mobilePlans.data;
      case "unlimited":
        return mobilePlans.unlimited;
      default:
        return mobilePlans.popular;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/mobile-recharge")}
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
                  number: account.number,
                  operator: account.operator,
                  type: account.type
                });
                navigate(`/add-mobile-account?${params.toString()}`);
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
              <Smartphone className="h-7 w-7 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-light text-xl tracking-wide mb-1">{account.name}</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator} • {account.type}</p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
              Active
            </Badge>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Mobile Number</span>
              <span className="text-white font-light">{account.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Current Balance</span>
              <span className="text-white font-light">{account.balance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Last Recharge</span>
              <span className="text-white font-light">{account.lastRecharge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Validity</span>
              <span className="text-white font-light">{account.validity}</span>
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Payments</p>
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

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={handleRecharge}
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
              Choose a plan for {account.number}
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
                value="data" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Data Packs
              </TabsTrigger>
              <TabsTrigger 
                value="unlimited" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              >
                Unlimited
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
                  <div className="grid grid-cols-4 gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.validity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.data}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.calls}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-white/60" />
                      <span className="text-[10px] text-white/60 uppercase tracking-widest">{plan.sms}</span>
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
              Are you sure you want to delete "{account.name}" ({account.number})? This action cannot be undone.
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
