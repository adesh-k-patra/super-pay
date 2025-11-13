import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, PiggyBank, Plus, ArrowDownLeft, TrendingUp, Wallet, Coins, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CashParkJar, CashParkTransaction } from "@shared/schema";
import { format } from "date-fns";

export default function CashParkJarDetail() {
  const params = useParams<{ id: string }>();
  const jarId = params?.id;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("details");

  const { data: jarData, isLoading: jarLoading } = useQuery<{ jar: CashParkJar }>({
    queryKey: [`/api/cash-park/jars/${jarId}`],
    enabled: !!jarId,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const { data: transactionsData } = useQuery<{ transactions: CashParkTransaction[] }>({
    queryKey: [`/api/cash-park/jars/${jarId}/transactions`],
    enabled: !!jarId,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const jar = jarData?.jar;
  const transactions = transactionsData?.transactions || [];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    // Navigate to UPI payment page with cash park deposit parameters
    const params = new URLSearchParams({
      amount: depositAmount.toString(),
      transactionType: 'cash-park-deposit',
      jarId: jarId || '',
      jarName: jar?.name || '',
      returnUrl: `/cash-park/jar/${jarId}`
    });
    navigate(`/upi-payment?${params.toString()}`);
    setShowDepositDialog(false);
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!jar || withdrawAmount > parseFloat(jar.currentBalance || "0")) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance in this jar",
        variant: "destructive",
      });
      return;
    }

    // Navigate to UPI payment page with cash park withdraw parameters
    const params = new URLSearchParams({
      amount: withdrawAmount.toString(),
      transactionType: 'cash-park-withdraw',
      jarId: jarId || '',
      jarName: jar?.name || '',
      returnUrl: `/cash-park/jar/${jarId}`
    });
    navigate(`/upi-payment?${params.toString()}`);
    setShowWithdrawDialog(false);
  };

  const handleDelete = async () => {
    if (!jarId) return;
    
    setDeleting(true);
    try {
      const response = await apiRequest("DELETE", `/api/cash-park/jars/${jarId}`);
      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Delete Failed",
          description: result.message || "Failed to delete jar",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Jar deleted successfully",
      });
      
      // Invalidate queries and navigate back
      queryClient.invalidateQueries({ queryKey: ["/api/cash-park/jars"] });
      navigate("/cash-park");
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete jar",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (jarLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-light tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!jar) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-xl font-light tracking-wider mb-4">Jar not found</p>
          <Button
            onClick={() => navigate("/cash-park")}
            className="bg-white text-black hover:bg-white/90 rounded-none"
            data-testid="button-go-back"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const balance = parseFloat(jar.currentBalance || "0");
  const goal = parseFloat(jar.goalAmount || "0");
  const progress = goal > 0 ? (balance / goal) * 100 : 0;
  const fillHeight = Math.min((balance / (goal || balance || 1)) * 100, 100);

  const totalDeposits = transactions
    .filter(t => t.transactionType === "deposit")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const totalWithdrawals = transactions
    .filter(t => t.transactionType === "withdrawal")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cash-park")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{jar.name.toUpperCase()}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Savings Jar</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Jar Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-8" data-testid="jar-summary">
          <div className="flex flex-col items-center text-center">
            {/* Creative Jar Visual */}
            <div className="relative w-32 h-36 mb-6">
              {/* Jar Body */}
              <div className="relative w-full h-full border-4 border-white/40 bg-gradient-to-b from-white/5 to-white/10 overflow-hidden">
                {/* Liquid Fill Effect */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/50 to-white/30 transition-all duration-700"
                  style={{ height: `${fillHeight}%` }}
                >
                  {/* Coins/Money inside */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Coins className="h-10 w-10 text-white/70" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Jar Neck */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-20 h-6 border-4 border-white/40 bg-gradient-to-b from-white/10 to-white/5 border-b-0"></div>
                
                {/* Jar Lid */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-3 bg-white/30 border-2 border-white/40"></div>
              </div>
            </div>

            {/* Balance */}
            <div className="space-y-2 mb-6">
              <p className="text-xs text-white/50 uppercase tracking-widest font-light">Current Balance</p>
              <p className="text-5xl font-light text-white tracking-tight" data-testid="text-jar-balance">
                ₹{balance.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Goal Progress */}
            {goal > 0 && (
              <div className="w-full space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-light">Goal: ₹{goal.toLocaleString('en-IN')}</span>
                  <span className="text-white font-light">{Math.min(progress, 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/10 border border-white/20">
                  <div 
                    className="h-full bg-white transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    data-testid="progress-goal"
                  />
                </div>
                <p className="text-xs text-white/40 font-light">
                  {balance >= goal ? "🎉 Goal achieved!" : `₹${(goal - balance).toLocaleString('en-IN')} more to reach your goal`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowDepositDialog(true)}
            className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 text-left hover:border-white/30 transition-all"
            data-testid="button-add-money"
          >
            <div className="bg-white/10 border border-white/30 rounded-none p-3 inline-flex mb-4">
              <Plus className="h-6 w-6 text-white" strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <div className="text-base font-light text-white tracking-wider uppercase">Add Money</div>
              <div className="text-xs text-white/60 font-light tracking-wider">Deposit to this jar</div>
            </div>
          </button>

          <button
            onClick={() => setShowWithdrawDialog(true)}
            className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 text-left hover:border-white/30 transition-all"
            data-testid="button-withdraw"
          >
            <div className="bg-white/10 border border-white/30 rounded-none p-3 inline-flex mb-4">
              <ArrowDownLeft className="h-6 w-6 text-white" strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <div className="text-base font-light text-white tracking-wider uppercase">Withdraw</div>
              <div className="text-xs text-white/60 font-light tracking-wider">To main account</div>
            </div>
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
                data-testid="tab-details"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
                data-testid="tab-transactions"
              >
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-3">
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Total Deposits</p>
                      <p className="text-2xl font-light text-white tracking-tight">
                        ₹{totalDeposits.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Total Withdrawals</p>
                      <p className="text-2xl font-light text-white tracking-tight">
                        ₹{totalWithdrawals.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 border border-white/20 rounded-none p-2">
                      <TrendingUp className="h-5 w-5 text-white" strokeWidth={1} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-light text-white mb-1 tracking-wider">Interest Earning</h3>
                      <p className="text-xs text-white/60 font-light leading-relaxed">
                        Earn 7.25% annual interest on your jar balance. Interest is calculated daily and credited to your jar automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delete Jar - Only shown if balance is 0 */}
                {balance === 0 && (
                  <div className="border border-red-500/20 bg-red-500/5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-none p-2">
                          <Trash2 className="h-5 w-5 text-red-400" strokeWidth={1} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-light text-white mb-1 tracking-wider">Delete Jar</h3>
                          <p className="text-xs text-white/60 font-light leading-relaxed">
                            This jar is empty. You can delete it if you no longer need it.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-none text-xs tracking-wider"
                        data-testid="button-delete-jar"
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              {transactions.length === 0 ? (
                <div className="border border-white/10 bg-white/5 p-12 text-center">
                  <Wallet className="h-16 w-16 text-white/40 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-white/60 font-light tracking-wider mb-1 text-lg">No transactions yet</p>
                  <p className="text-sm text-white/40 font-light">Start by adding money to this jar</p>
                </div>
              ) : (
                <div className="space-y-0 border border-white/10">
                  {transactions.slice(0, 20).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border-b border-white/10 last:border-b-0 p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                      data-testid={`transaction-${transaction.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 border flex items-center justify-center flex-shrink-0 ${
                          transaction.transactionType === 'deposit' 
                            ? 'border-white/30 bg-white/10' 
                            : 'border-white/20 bg-white/5'
                        }`}>
                          {transaction.transactionType === 'deposit' ? (
                            <Plus className="h-6 w-6 text-white" strokeWidth={1} />
                          ) : (
                            <ArrowDownLeft className="h-6 w-6 text-white" strokeWidth={1} />
                          )}
                        </div>
                        <div>
                          <div className="font-light text-white tracking-wider mb-1 capitalize">
                            {transaction.transactionType}
                          </div>
                          <div className="text-xs text-white/40 font-light">
                            {transaction.createdAt && format(new Date(transaction.createdAt), 'dd MMM, hh:mm a')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-base font-light tracking-wider mb-1 ${
                          transaction.transactionType === 'deposit' ? 'text-white' : 'text-white/80'
                        }`}>
                          {transaction.transactionType === 'deposit' ? '+' : '-'}₹{parseFloat(transaction.amount || "0").toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-white/40 font-light">
                          Balance: ₹{parseFloat(transaction.postBalance || "0").toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider">Add Money to {jar.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount" className="text-white/60 text-xs uppercase tracking-widest font-light">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-white/60">₹</span>
                <Input
                  id="deposit-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setAmount(value);
                  }}
                  placeholder="0"
                  className="text-3xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none pl-10 focus:border-white h-16 placeholder:text-white/20"
                  data-testid="input-deposit-amount"
                />
              </div>
            </div>

            <Button
              onClick={handleDeposit}
              disabled={processing}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light tracking-wider"
              data-testid="button-confirm-deposit"
            >
              {processing ? "PROCESSING..." : "ADD MONEY VIA UPI"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider">Withdraw from {jar.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/60 font-light">
                Available Balance: ₹{balance.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdraw-amount" className="text-white/60 text-xs uppercase tracking-widest font-light">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-white/60">₹</span>
                <Input
                  id="withdraw-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setAmount(value);
                  }}
                  placeholder="0"
                  className="text-3xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none pl-10 focus:border-white h-16 placeholder:text-white/20"
                  data-testid="input-withdraw-amount"
                />
              </div>
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={processing}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light tracking-wider"
              data-testid="button-confirm-withdraw"
            >
              {processing ? "PROCESSING..." : "WITHDRAW VIA UPI"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider">Delete Jar?</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-white/80 font-light leading-relaxed">
                Are you sure you want to delete "{jar?.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 text-base font-light tracking-wider"
                data-testid="button-cancel-delete"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 text-white hover:bg-red-600 rounded-none h-12 text-base font-light tracking-wider"
                data-testid="button-confirm-delete"
              >
                {deleting ? "DELETING..." : "DELETE"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
