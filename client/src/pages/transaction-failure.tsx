import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { glassmorphicTokens } from "@/lib/design-tokens";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import {
  XCircle,
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Info
} from "lucide-react";

export default function TransactionFailure() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [shake, setShake] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason") || "Transaction failed due to technical error";
  const txnId = params.get("id") || `TXN${Date.now()}`;
  const amount = params.get("amount") || "0";
  const transactionType = params.get("type") || "payment";
  const errorCode = params.get("errorCode") || "ERR_UNKNOWN";

  useEffect(() => {
    if (!txnId) {
      navigate("/home");
    }
  }, [txnId, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShake(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(value));
  };

  const getErrorSuggestion = () => {
    if (errorCode.includes("INSUFFICIENT")) {
      return "Please ensure you have sufficient balance in your account and try again.";
    } else if (errorCode.includes("NETWORK")) {
      return "Check your internet connection and retry the transaction.";
    } else if (errorCode.includes("TIMEOUT")) {
      return "The transaction timed out. Please try again.";
    } else if (errorCode.includes("DECLINED")) {
      return "Your payment was declined. Please contact your bank or try another payment method.";
    }
    return "Please try again or contact support if the issue persists.";
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 animate-pulse">
          <AlertTriangle className="h-12 w-12 text-white/80/20" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-200">
          <XCircle className="h-10 w-10 text-white/80/20" />
        </div>
        <div className="absolute top-60 left-1/3 animate-pulse delay-300">
          <AlertTriangle className="h-8 w-8 text-white/80/20" />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12">
        <div className={cn(
          "flex justify-center mb-6",
          shake && "animate-shake"
        )}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <XCircle className="h-14 w-14 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white/80" data-testid="text-failure-title">
            Transaction Failed
          </h1>
          <p className="text-white/70 text-lg">
            We couldn't complete your transaction
          </p>
        </div>

        <div className="border border-white/20 p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-white/80 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white/80 mb-1">Error Details</h3>
              <p className="text-white/80" data-testid="text-error-reason">
                {reason}
              </p>
            </div>
          </div>

          <div className="bg-white/5 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light">Transaction Amount</span>
              <span className="text-white font-bold text-lg" data-testid="text-failed-amount">
                {formatCurrency(amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light">Transaction ID</span>
              <span className="text-white font-mono" data-testid="text-transaction-id">
                {txnId}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light">Error Code</span>
              <Badge className="bg-white/10 text-white/70 border-white/20 rounded-none" data-testid="badge-error-code">
                {errorCode}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light">Time</span>
              <span className="text-white/80 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-white/20 p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-xl mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-1">What you can do</h3>
              <p className="text-sm text-white/70">
                {getErrorSuggestion()}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Need Help?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Customer Support
              </span>
              <span className="text-white font-medium">1800-123-4567</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Support
              </span>
              <span className="text-white font-medium">+91 98765 43210</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Support
              </span>
              <span className="text-white font-medium">support@kcredit.com</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-white/40 pb-32">
          <p>Your money is safe. No amount has been deducted from your account.</p>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
          <Button
            className="bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
            onClick={goBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
          <Button
            className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
            onClick={() => window.location.reload()}
            data-testid="button-retry"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Retry Payment
          </Button>
        </div>
        <Button
          className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none h-12 mt-3 max-w-2xl mx-auto font-light tracking-wider"
          onClick={() => navigate("/home")}
          data-testid="button-go-home"
        >
          <Home className="h-5 w-5 mr-2" />
          Go to Home
        </Button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
