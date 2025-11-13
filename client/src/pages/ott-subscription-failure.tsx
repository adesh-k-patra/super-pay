import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Tv,
  User,
  Building2,
  Receipt,
  AlertTriangle,
  WifiOff,
  CreditCard
} from "lucide-react";

export default function OTTSubscriptionFailure() {
  const [, navigate] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const txnId = params.get("id");
  const amount = params.get("amount") || '';
  const accountName = params.get("accountName") || '';
  const accountNumber = params.get("accountNumber") || '';
  const provider = params.get("provider") || '';
  const timestamp = params.get("timestamp");
  const returnUrl = params.get("returnUrl") || "/ott-subscription";
  const errorType = params.get("errorType") || 'general';

  useEffect(() => {
    if (!errorType || !amount) {
      navigate("/home");
    }
  }, [errorType, amount, navigate]);

  const formatCurrency = (amount: number | string) => {
    if (!amount || amount === '') return '₹0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '₹0';
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

  const getErrorDetails = () => {
    switch (errorType) {
      case 'low_balance':
        return {
          icon: CreditCard,
          iconColor: 'text-red-400',
          title: 'Insufficient Balance',
          description: 'Your account does not have enough balance to complete this transaction',
          suggestion: 'Please add funds to your account and try again'
        };
      case 'connection':
        return {
          icon: WifiOff,
          iconColor: 'text-orange-400',
          title: 'Connection Failed',
          description: 'Unable to connect to the payment network',
          suggestion: 'Please check your internet connection and try again'
        };
      case 'bank_service':
        return {
          icon: Building2,
          iconColor: 'text-yellow-400',
          title: 'Bank Service Unavailable',
          description: 'The bank service is temporarily unavailable',
          suggestion: 'Please try again after some time'
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-400',
          title: 'Payment Failed',
          description: 'Unable to process your payment',
          suggestion: 'Please try again or contact support'
        };
    }
  };

  const errorDetails = getErrorDetails();
  const ErrorIcon = errorDetails.icon;

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
            <h1 className="text-base font-bold tracking-wider">PAYMENT FAILED</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">OTT Subscription Payment</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Error Icon & Message - Cardless */}
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-400" />
            </div>
          </div>
          <h2 className="text-3xl font-light tracking-wide text-white mb-3">
            {errorDetails.title}
          </h2>
          <p className="text-white/50 text-sm font-light mb-2">
            {errorDetails.description}
          </p>
          <p className="text-white/40 text-xs font-light">
            {errorDetails.suggestion}
          </p>
        </div>

        {/* Error Type Indicator */}
        <div className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10">
          <ErrorIcon className={`h-5 w-5 ${errorDetails.iconColor}`} />
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Error Type</p>
            <p className="text-sm font-light text-white capitalize">{errorType.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Transaction Details - Hybrid */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Transaction ID */}
            {txnId && (
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
            )}

            {/* Amount - Prominent */}
            <div className="bg-white/5 border border-white/10 p-6">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light mb-2">Attempted Amount</p>
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
                  <Tv className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Subscriber No.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-account-number">
                    {accountNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Provider */}
            {provider && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Provider</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-provider">
                    {provider}
                  </p>
                </div>
              </div>
            )}

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

        {/* Help Section - Cardless */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="text-base font-light tracking-wider text-white">Need Help?</h3>
              <p className="text-xs text-white/40">Common solutions</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/60">
            <div className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <p>Verify your account has sufficient balance</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <p>Check your internet connection and try again</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <p>If the issue persists, contact your bank or try a different payment method</p>
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
            data-testid="button-go-back"
          >
            Go Back
          </Button>
          <Button
            onClick={() => {
              const paymentParams = new URLSearchParams({
                transactionType: 'ott-subscription',
                amount: amount,
                accountName: accountName,
                subscriberNumber: accountNumber,
                provider: provider,
                returnUrl: '/ott-subscription'
              });
              navigate(`/upi-payment?${paymentParams.toString()}`);
            }}
            className="bg-black text-white border border-white/20 hover:bg-white/5 h-12 font-light tracking-wide rounded-none"
            data-testid="button-try-again"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
