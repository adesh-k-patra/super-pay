import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  Smartphone,
  History,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  EyeOff
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FundTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  method: 'upi' | 'bank_transfer' | 'card' | 'wallet';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  transactionId: string;
  timestamp: string;
}

interface FundManagementProps {
  currentBalance: number;
  availableForWithdrawal: number;
  onFundAdded?: (amount: number) => void;
  onFundWithdrawn?: (amount: number) => void;
}

export function FundManagement({ 
  currentBalance, 
  availableForWithdrawal, 
  onFundAdded, 
  onFundWithdrawn 
}: FundManagementProps) {
  const [activeTab, setActiveTab] = useState("add");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  const { toast } = useToast();

  // Fetch transaction history
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<FundTransaction[]>({
    queryKey: ["/api/funds/transactions"],
  });

  // Add funds mutation with Stripe integration
  const addFundsMutation = useMutation({
    mutationFn: async (data: { amount: number; method: string; upiId?: string }) => {
      if (data.method === "stripe") {
        // Create Stripe payment intent first
        const intentResponse = await apiRequest("POST", "/api/stripe/create-payment-intent", {
          amount: data.amount,
          currency: "inr"
        });
        
        // In a real implementation, you would handle Stripe payment confirmation here
        // For now, we'll proceed with the fund addition
        return apiRequest("POST", "/api/funds/add", data);
      }
      return apiRequest("POST", "/api/funds/add", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Funds Added Successfully",
        description: `₹${amount} has been added to your account`,
      });
      setAmount("");
      setUpiId("");
      setIsAddFundsOpen(false);
      onFundAdded?.(parseFloat(amount));
      queryClient.invalidateQueries({ queryKey: ["/api/funds/transactions"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to Add Funds",
        description: error.message || "There was an error processing your payment",
      });
    },
  });

  // Withdraw funds mutation
  const withdrawFundsMutation = useMutation({
    mutationFn: async (data: { amount: number; method: string }) => {
      return apiRequest("POST", "/api/funds/withdraw", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Withdrawal Initiated",
        description: `₹${amount} withdrawal has been initiated`,
      });
      setAmount("");
      setIsWithdrawOpen(false);
      onFundWithdrawn?.(parseFloat(amount));
      queryClient.invalidateQueries({ queryKey: ["/api/funds/transactions"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: error.message || "There was an error processing your withdrawal",
      });
    },
  });

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      toast({
        variant: "destructive",
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
      });
      return;
    }

    addFundsMutation.mutate({
      amount: parseFloat(amount),
      method: paymentMethod,
      upiId: paymentMethod === "upi" ? upiId : undefined,
    });
  };

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    if (parseFloat(amount) > availableForWithdrawal) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "Amount exceeds available withdrawal limit",
      });
      return;
    }

    withdrawFundsMutation.mutate({
      amount: parseFloat(amount),
      method: "bank_transfer",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer': return <Building2 className="h-4 w-4" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Available Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white hover:bg-white/10"
                data-testid="button-toggle-balance"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? formatCurrency(currentBalance) : '••••••••'}
            </div>
            <div className="text-blue-100 text-sm">Ready for investment</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Available for Withdrawal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? formatCurrency(availableForWithdrawal) : '••••••••'}
            </div>
            <div className="text-green-100 text-sm">Can be withdrawn anytime</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700" data-testid="button-add-funds">
              <Plus className="h-5 w-5 mr-2" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Funds to Your Account</DialogTitle>
              <DialogDescription>
                Choose your preferred payment method to add funds instantly.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  data-testid="input-add-amount"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="text-xs"
                    data-testid={`button-quick-${quickAmount}`}
                  >
                    ₹{quickAmount/1000}K
                  </Button>
                ))}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger data-testid="select-payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        UPI
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Debit/Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* UPI ID Input */}
              {paymentMethod === "upi" && (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="your-name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    data-testid="input-upi-id"
                  />
                </div>
              )}

              {/* Information Alert */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Funds will be added instantly after successful payment. Processing fee may apply.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                onClick={handleAddFunds}
                disabled={addFundsMutation.isPending}
                className="w-full"
                data-testid="button-confirm-add-funds"
              >
                {addFundsMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Add ₹${amount || 0}`
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 h-12" data-testid="button-withdraw-funds">
              <Minus className="h-5 w-5 mr-2" />
              Withdraw
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Withdraw funds to your linked bank account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Amount (₹)</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={availableForWithdrawal}
                  data-testid="input-withdraw-amount"
                />
                <div className="text-sm text-muted-foreground">
                  Available: {formatCurrency(availableForWithdrawal)}
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Withdrawals are processed within 2-3 business days. No charges for withdrawals.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleWithdraw}
                disabled={withdrawFundsMutation.isPending}
                className="w-full"
                data-testid="button-confirm-withdraw"
              >
                {withdrawFundsMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Withdraw ₹${amount || 0}`
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <Button variant="outline" size="sm" data-testid="button-download-statement">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded-none"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-none hover:bg-muted/50 transition-colors" data-testid={`transaction-${transaction.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(transaction.method)}
                      {transaction.type === 'credit' ? 
                        <ArrowDownLeft className="h-4 w-4 text-green-600" /> : 
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {transaction.transactionId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {getStatusIcon(transaction.status)}
                      <span className="text-sm capitalize">{transaction.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Your fund transactions will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}