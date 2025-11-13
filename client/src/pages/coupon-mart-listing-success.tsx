import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight, Gift, Eye, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CouponMartListingSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const celebrateListing = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
      }, 250);
    };

    celebrateListing();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pb-32">
      {/* Fixed Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-screen-lg mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate("/coupon-mart")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-light">Back to Marketplace</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-20 px-4">
        <div className="max-w-lg mx-auto">
          {/* Success Animation */}
          <div className="relative mb-8 mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative border-4 border-green-500/30 bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <CheckCircle2 className="h-16 w-16 text-green-400" strokeWidth={2} />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: "0.2s" }}>
              <Sparkles className="h-6 w-6 text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Listing Successful!
            </h1>
            <p className="text-lg text-white/80 font-light">
              Your coupon listing is now live
            </p>
            <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Your coupons are now visible to buyers on the marketplace. You'll be notified when someone shows interest in your listing.
            </p>
          </div>

          {/* Info Card */}
          <div className="border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 backdrop-blur-sm mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Gift className="h-5 w-5 text-green-400" />
              <p className="text-sm font-semibold text-green-300 uppercase tracking-wider">What's Next?</p>
            </div>
            <p className="text-xs text-green-200/80 leading-relaxed text-center">
              Track your listing performance, view interested buyers, and manage your active listings from your dashboard.
            </p>
          </div>

          {/* Success Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Listing published successfully</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto space-y-3">
          <Button
            onClick={() => navigate("/coupon-mart/my-listings")}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-view-my-listings"
          >
            <Eye className="h-5 w-5 mr-2" />
            VIEW MY LISTINGS
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            onClick={() => navigate("/coupon-mart")}
            variant="outline"
            className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none h-12 text-sm font-light tracking-wider"
            data-testid="button-browse-marketplace"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            BROWSE MARKETPLACE
          </Button>
        </div>
      </div>
    </div>
  );
}
