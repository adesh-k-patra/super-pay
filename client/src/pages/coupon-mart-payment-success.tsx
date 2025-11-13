import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, Sparkles, ArrowRight, Gift, RefreshCcw } from "lucide-react";

export default function CouponMartPaymentSuccess() {
  const [, navigate] = useLocation();
  
  // Get query params
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type"); // 'trade' or default to 'purchase'
  const isTrade = type === "trade";

  useEffect(() => {
    const celebratePayment = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
      }, 250);
    };

    celebratePayment();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center px-4 relative overflow-hidden pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent"></div>
      
      <div className="max-w-lg w-full text-center space-y-8 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative border-4 border-green-500/30 bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            {isTrade ? (
              <RefreshCcw className="h-16 w-16 text-green-400" strokeWidth={2} />
            ) : (
              <CheckCircle2 className="h-16 w-16 text-green-400" strokeWidth={2} />
            )}
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: "0.2s" }}>
            <Sparkles className="h-6 w-6 text-green-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            {isTrade ? "Trade Completed!" : "Payment Successful!"}
          </h1>
          <p className="text-lg text-white/80">
            {isTrade ? "Your coupons have been exchanged" : "Your coupon is ready to use"}
          </p>
          <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            {isTrade 
              ? "The trade has been completed successfully. Both parties have received their coupons. You can access them anytime from your transactions."
              : "The coupon code has been revealed and saved in your transactions. You can access it anytime from your transaction history."}
          </p>
        </div>

        <div className="border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gift className="h-5 w-5 text-green-400" />
            <p className="text-sm font-semibold text-green-300">What's Next?</p>
          </div>
          <p className="text-xs text-green-200/80 leading-relaxed">
            {isTrade
              ? "Check your transactions to view all your exchanged coupons and start saving on your purchases."
              : "Check your transactions to view the coupon code and start saving on your purchases immediately."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-xs text-white/40">
            {isTrade ? "Trade completed securely" : "Transaction completed securely"}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-md border-t border-white/10 px-4 py-4 z-50">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            onClick={() => navigate("/profile/coupons")}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 rounded-lg h-12 text-sm font-semibold shadow-lg shadow-green-500/20 transition-all duration-200"
            data-testid="button-view-all-coupons"
          >
            View My Coupons
          </Button>
          <Button
            onClick={() => navigate("/coupon-mart")}
            className="flex-1 bg-gradient-to-r from-zinc-700 to-zinc-800 text-white hover:from-zinc-600 hover:to-zinc-700 rounded-lg h-12 text-sm font-semibold shadow-lg transition-all duration-200"
            data-testid="button-browse-all-coupons"
          >
            Browse All Coupons
          </Button>
        </div>
      </div>
    </div>
  );
}
