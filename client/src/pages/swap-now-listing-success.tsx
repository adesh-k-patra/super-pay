import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ArrowRight, Eye, ArrowLeft, Package, ShieldCheck } from "lucide-react";

export default function SwapNowListingSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const celebrateListing = () => {
      const duration = 2 * 1000;
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
            onClick={() => navigate("/swap-now/explore")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-light">Back to Explore</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-20 px-4">
        <div className="max-w-lg mx-auto">
          {/* Success Animation */}
          <div className="relative mb-8 mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative border-4 border-white/30 bg-gradient-to-br from-white/20 to-white/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <CheckCircle2 className="h-16 w-16 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Listing Submitted!
            </h1>
            <p className="text-lg text-white/80 font-light">
              Your listing is under review
            </p>
          </div>

          {/* Waiting for Approval Card */}
          <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-white/80" />
              <p className="text-base font-semibold text-white uppercase tracking-wider">Waiting for Approval</p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed text-center mb-4">
              Our team is reviewing your listing to ensure it meets our quality standards. This usually takes 24-48 hours.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="h-4 w-4 text-white/60" />
              <p className="text-xs text-white/50">Quality Check in Progress</p>
            </div>
          </div>

          {/* Info Card */}
          <div className="border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Package className="h-5 w-5 text-white/60" />
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">What's Next?</p>
            </div>
            <p className="text-xs text-white/60 leading-relaxed text-center">
              Once approved, your listing will be visible to buyers on the marketplace. You can track your listing and manage all your items from "My Listings".
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Listing submitted successfully</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto space-y-3">
          <Button
            onClick={() => navigate("/swap-now/my-listings")}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-view-my-listings"
          >
            <Eye className="h-5 w-5 mr-2" />
            VIEW MY LISTINGS
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            onClick={() => navigate("/swap-now/explore")}
            variant="outline"
            className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none h-12 text-sm font-light tracking-wider"
            data-testid="button-browse-marketplace"
          >
            <Package className="h-4 w-4 mr-2" />
            BROWSE MARKETPLACE
          </Button>
        </div>
      </div>
    </div>
  );
}
