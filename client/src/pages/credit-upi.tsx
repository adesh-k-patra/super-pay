import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CreditCard, ArrowRight, Info, ArrowLeft, Calendar, TrendingUp, Zap, Shield, Clock, CheckCircle, QrCode, User, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CreditUpiAccount, CreditUpiTransaction } from "@shared/schema";
import { format } from "date-fns";
import QRCode from "react-qr-code";

export default function CreditUpi() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [upiPin, setUpiPin] = useState<string[]>(Array(6).fill(""));
  const [activating, setActivating] = useState(false);

  const { data: accountData, isLoading: accountLoading } = useQuery<{ account: CreditUpiAccount | null }>({
    queryKey: ["/api/credit-upi/account"],
  });

  const { data: transactionsData } = useQuery<{ transactions: CreditUpiTransaction[] }>({
    queryKey: ["/api/credit-upi/transactions"],
    enabled: !!accountData?.account,
  });

  const account = accountData?.account;
  const transactions = transactionsData?.transactions || [];

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...upiPin];
      newPin[index] = value;
      setUpiPin(newPin);

      if (value && index < 5) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !upiPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleActivate = async () => {
    const pinString = upiPin.join("");
    
    if (pinString.length !== 6 || !/^\d+$/.test(pinString)) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid 6-digit UPI PIN",
        variant: "destructive",
      });
      return;
    }

    setActivating(true);
    try {
      const response = await apiRequest("POST", "/api/credit-upi/activate", { upiPin: pinString });
      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Activation Failed",
          description: result.message || "Failed to activate Credit UPI",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Credit UPI activated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/credit-upi/account"] });
      setShowActivationDialog(false);
      setUpiPin(Array(6).fill(""));
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate Credit UPI",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  if (accountLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white/60 font-light text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
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
              <h1 className="text-base font-bold tracking-wider">CREDIT UPI</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Pre-Approved Credit Line</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/credit-upi/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-info"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
          {/* Welcome Icon */}
          <div className="text-center py-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <CreditCard className="h-10 w-10 text-white" strokeWidth={1} />
              </div>
            </div>
            <h2 className="text-2xl font-light tracking-wide text-white mb-2">
              Credit UPI
            </h2>
            <p className="text-white/50 text-sm font-light">
              Instant pre-approved credit line
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Credit Limit</p>
                </div>
                <p className="text-lg font-light text-white">₹1K - ₹1L</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Interest Free</p>
                </div>
                <p className="text-lg font-light text-white">15 Days</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Instant</p>
                </div>
                <p className="text-lg font-light text-white">24/7</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light">Key Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">No collateral required</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">Instant approval & activation</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">Use at any UPI merchant</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">Flexible EMI repayment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
          <DialogContent className="bg-black border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-light tracking-wider text-center">SET YOUR CREDIT UPI PIN</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <p className="text-xs text-white/60 font-light uppercase tracking-widest flex items-center justify-center gap-2">
                  <Shield className="h-3 w-3" />
                  Enter 6-Digit UPI PIN
                </p>
                <p className="text-white/40 text-xs font-light">
                  This PIN will be used to secure your Credit UPI
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={upiPin[index]}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-light bg-transparent border-b-2 border-white/20 rounded-none text-white focus:border-white transition-colors"
                    data-testid={`input-pin-${index}`}
                  />
                ))}
              </div>

              <Button
                onClick={handleActivate}
                disabled={activating || upiPin.some((digit: string) => !digit)}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider disabled:opacity-50"
                data-testid="button-confirm-activate"
              >
                {activating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ACTIVATING...
                  </div>
                ) : (
                  "ACTIVATE CREDIT UPI"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <Button 
            onClick={() => setShowActivationDialog(true)}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-activate"
          >
            ACTIVATE NOW
          </Button>
        </div>
      </div>
    );
  }

  const creditLimit = parseFloat(account.creditLimit || "0");
  const availableLimit = parseFloat(account.availableLimit || "0");
  const usedLimit = parseFloat(account.usedLimit || "0");
  const outstandingAmount = parseFloat(account.outstandingAmount || "0");
  const usagePercentage = creditLimit > 0 ? (usedLimit / creditLimit) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white pb-40">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
            <h1 className="text-base font-bold tracking-wider">CREDIT UPI</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Your Credit Line</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/credit-upi/info")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-info"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* UPI ID Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-white/40" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Credit UPI ID</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 flex items-center justify-between">
              <p className="text-base font-light text-white tracking-wider font-mono" data-testid="text-upi-id">
                {account.upiId}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQrDialog(true)}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-2 h-8 w-8 rounded-none"
                  data-testid="button-show-qr"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30 rounded-none font-light text-[10px] px-2 py-0.5">
                  ACTIVE
                </Badge>
              </div>
            </div>
          </div>

          {/* Available Limit - Prominent */}
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light mb-2">Available Credit</p>
            <p className="text-3xl font-light text-white mb-3" data-testid="text-available-limit">
              ₹{availableLimit.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center justify-between text-sm font-light pt-3 border-t border-white/10">
              <div>
                <span className="text-white/40">Total: </span>
                <span className="text-white" data-testid="text-total-limit">₹{creditLimit.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-white/40">Used: </span>
                <span className="text-white" data-testid="text-used-limit">₹{usedLimit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Outstanding Amount & Due Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-4 w-4 text-white/40" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Outstanding</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-lg font-light text-white" data-testid="text-outstanding">
                  ₹{outstandingAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-white/40" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Due Date</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-lg font-light text-white">16th of month</p>
              </div>
            </div>
          </div>

          {/* Credit Utilization */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-white/40" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Credit Utilization</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-light text-white/60">{usagePercentage.toFixed(1)}%</span>
                <span className="text-xs text-white/40">
                  {usagePercentage < 30 ? "Excellent" : usagePercentage < 70 ? "Good" : "High"}
                </span>
              </div>
              <div className="h-2 bg-white/10 border border-white/20">
                <div 
                  className="h-full bg-white transition-all"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  data-testid="progress-usage"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="border border-white/10 p-8 text-center bg-white/5">
              <CreditCard className="h-12 w-12 text-white/30 mx-auto mb-4" strokeWidth={1} />
              <p className="text-white/50 mb-1">No transactions yet</p>
              <p className="text-sm text-white/40">Start using Credit UPI</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => navigate(`/credit-upi/transaction/${transaction.id}`)}
                  className="flex items-center justify-between py-3 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors -mx-4 px-4"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-white/40" strokeWidth={1} />
                    <div>
                      <p className="text-white font-light text-sm">{transaction.merchantName}</p>
                      <p className="text-white/40 text-xs">
                        {transaction.createdAt && format(new Date(transaction.createdAt), 'dd MMM, hh:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-light text-base">
                      -₹{parseFloat(transaction.amount || "0").toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-white/40 uppercase">
                      {transaction.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="grid grid-cols-3 gap-3 max-w-screen-lg mx-auto">
          <Button
            onClick={() => navigate("/credit-upi/pay")}
            className="bg-white text-black hover:bg-white/90 h-12 font-light tracking-wide rounded-none"
            data-testid="button-make-payment"
          >
            <Zap className="h-4 w-4 mr-1" />
            Pay
          </Button>
          <Button
            onClick={() => navigate("/upi-scanner")}
            className="bg-black text-white border border-white/20 hover:bg-white/5 h-12 font-light tracking-wide rounded-none"
            data-testid="button-scan-qr"
          >
            <QrCode className="h-4 w-4 mr-1" />
            Scan
          </Button>
          <Button
            onClick={() => navigate("/credit-upi/repay")}
            className="bg-black text-white border border-white/20 hover:bg-white/5 h-12 font-light tracking-wide rounded-none"
            data-testid="button-repay"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Repay
          </Button>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center">YOUR CREDIT UPI QR</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="bg-white p-6 rounded-none mx-auto w-fit">
              <QRCode value={account.upiId || ""} size={200} />
            </div>
            <p className="text-center text-white/60 font-light mt-4 text-sm">
              Scan to pay using Credit UPI
            </p>
            <p className="text-center text-white font-mono mt-2">{account.upiId}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
