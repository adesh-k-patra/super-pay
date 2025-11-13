import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  User,
  Building2,
  Receipt,
  Sparkles,
  Gift,
  TrendingUp
} from "lucide-react";

export default function ElectricityBillSuccess() {
  const [, navigate] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const txnId = params.get("id");
  const amount = params.get("amount") || '';
  const accountName = params.get("accountName") || '';
  const accountNumber = params.get("accountNumber") || '';
  const consumerNumber = params.get("consumerNumber") || '';
  const provider = params.get("provider") || '';
  const timestamp = params.get("timestamp");
  const returnUrl = params.get("returnUrl") || "/electricity-bill";

  useEffect(() => {
    if (!txnId) {
      navigate("/home");
    }
  }, [txnId, navigate]);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (date?: string | null) => {
    return new Date(date || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date?: string | null) => {
    return new Date(date || Date.now()).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cashbackAmount = parseFloat(amount || '0') * 0.02;
  const pointsEarned = Math.floor(parseFloat(amount || '0') / 100);

  return (
    <div className="min-h-screen bg-black text-white pb-40">
      {/* Fixed Header - Cardless */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(returnUrl)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">PAYMENT SUCCESSFUL</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Electricity Bill</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Success Icon & Message - Cardless */}
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-light tracking-wide text-white mb-3">
            Payment Successful!
          </h2>
          <p className="text-white/50 text-sm font-light">
            Transaction completed successfully
          </p>
        </div>

        {/* Transaction Details - Hybrid */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Transaction ID */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-4 w-4 text-white/40" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Transaction ID</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-base font-light text-white tracking-wider font-mono" data-testid="text-transaction-id">
                  {txnId}
                </p>
              </div>
            </div>

            {/* Amount - Prominent */}
            <div className="bg-white/5 border border-white/10 p-6">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light mb-2">Amount Paid</p>
              <p className="text-3xl font-light text-white" data-testid="text-amount">
                {formatCurrency(amount || 0)}
              </p>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Account Name</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-account-name">
                    {accountName || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Consumer Number</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-account-number">
                    {consumerNumber || accountNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Provider */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-white/40" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Provider</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-sm font-light text-white" data-testid="text-provider">
                  {provider || 'N/A'}
                </p>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Date</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-date">
                    {formatDate(timestamp)}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Time</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-time">
                    {formatTime(timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Section - Cardless */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="text-base font-light tracking-wider text-white">Rewards Unlocked!</h3>
              <p className="text-xs text-white/40">Congratulations on your payment</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Gift className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-white font-light text-sm">Instant Cashback</p>
                  <p className="text-white/40 text-xs">Credited to wallet</p>
                </div>
              </div>
              <span className="text-white font-light text-lg" data-testid="text-cashback">
                +{formatCurrency(cashbackAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-white font-light text-sm">Reward Points</p>
                  <p className="text-white/40 text-xs">Added to account</p>
                </div>
              </div>
              <span className="text-white font-light text-lg" data-testid="text-points">
                +{pointsEarned} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons - White & Black Theme */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="grid grid-cols-2 gap-3 max-w-screen-lg mx-auto">
          <Button
            onClick={() => navigate(returnUrl)}
            className="bg-white text-black hover:bg-white/90 h-12 font-light tracking-wide rounded-none"
            data-testid="button-done"
          >
            Done
          </Button>
          <Button
            onClick={() => {
              const paymentParams = new URLSearchParams({
                transactionType: 'electricity-bill',
                amount: amount,
                accountName: accountName,
                consumerNumber: consumerNumber || accountNumber,
                provider: provider,
                returnUrl: '/electricity-bill'
              });
              navigate(`/upi-payment?${paymentParams.toString()}`);
            }}
            className="bg-black text-white border border-white/20 hover:bg-white/5 h-12 font-light tracking-wide rounded-none"
            data-testid="button-pay-again"
          >
            Pay Again
          </Button>
        </div>
      </div>
    </div>
  );
}
