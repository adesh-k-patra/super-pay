import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  Loader2,
  Shield,
  Lock
} from "lucide-react";

interface Listing {
  id: string;
  couponTitle: string;
  couponBrand: string;
  sellingPrice?: string;
  couponValue: string;
  couponValueType: string;
}

export default function CouponMartPayment() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/payment/:id");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "wallet">("upi");
  
  const listingId = params?.id || "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ["/api/coupon-mart/listings", listingId],
    enabled: !!listingId,
  });

  const handlePayment = () => {
    if (!listing) return;
    
    if (paymentMethod === "upi") {
      navigate(`/upi-payment?amount=${listing.sellingPrice}&transactionType=coupon-mart&listingId=${listingId}&returnUrl=/coupon-mart/payment/${listingId}/confirm`);
    } else {
      navigate(`/coupon-mart/payment/${listingId}/process`);
    }
  };

  if (isLoading || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const savings = listing.couponValueType === "percentage"
    ? `${listing.couponValue}%`
    : `₹${listing.couponValue}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate(`/coupon-mart/listing/${listingId}`)}
            className="text-white hover:text-white/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-sm font-bold tracking-wider">CHECKOUT</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 space-y-5 max-w-2xl mx-auto">
        {/* Order Summary Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{listing.couponTitle}</h2>
                <p className="text-xs text-white/50 uppercase tracking-widest">{listing.couponBrand}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Save {savings}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Amount to Pay</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-white tracking-tight">₹{listing.sellingPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider uppercase text-white/80">Payment Method</h2>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`w-full border p-4 flex items-center justify-between transition-all duration-200 ${
                paymentMethod === "upi"
                  ? "border-white bg-white/15 shadow-lg shadow-white/5"
                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
              }`}
              data-testid="button-payment-upi"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${paymentMethod === "upi" ? "bg-white/20" : "bg-white/10"}`}>
                  <Smartphone className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">UPI Payment</p>
                  <p className="text-xs text-white/50">Fast & Secure</p>
                </div>
              </div>
              {paymentMethod === "upi" && (
                <CheckCircle2 className="h-5 w-5 text-green-400" strokeWidth={2} />
              )}
            </button>

            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full border p-4 flex items-center justify-between transition-all duration-200 ${
                paymentMethod === "card"
                  ? "border-white bg-white/15 shadow-lg shadow-white/5"
                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
              }`}
              data-testid="button-payment-card"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${paymentMethod === "card" ? "bg-white/20" : "bg-white/10"}`}>
                  <CreditCard className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Card Payment</p>
                  <p className="text-xs text-white/50">Credit or Debit Card</p>
                </div>
              </div>
              {paymentMethod === "card" && (
                <CheckCircle2 className="h-5 w-5 text-green-400" strokeWidth={2} />
              )}
            </button>

            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`w-full border p-4 flex items-center justify-between transition-all duration-200 ${
                paymentMethod === "wallet"
                  ? "border-white bg-white/15 shadow-lg shadow-white/5"
                  : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
              }`}
              data-testid="button-payment-wallet"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${paymentMethod === "wallet" ? "bg-white/20" : "bg-white/10"}`}>
                  <Wallet className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Digital Wallet</p>
                  <p className="text-xs text-white/50">Instant Payment</p>
                </div>
              </div>
              {paymentMethod === "wallet" && (
                <CheckCircle2 className="h-5 w-5 text-green-400" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-white/10 bg-white/5 p-4 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-green-400" strokeWidth={1.5} />
            <p className="text-xs text-white/70 font-medium">100% Secure</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-4 text-center">
            <Lock className="h-6 w-6 mx-auto mb-2 text-green-400" strokeWidth={1.5} />
            <p className="text-xs text-white/70 font-medium">Encrypted</p>
          </div>
        </div>

        {/* Security Note */}
        <div className="border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-medium text-emerald-300 mb-1">Instant Delivery</p>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Your coupon code will be revealed immediately after successful payment and saved in your transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white rounded-lg h-14 text-base font-light uppercase tracking-wider shadow-lg shadow-white/20 transition-all duration-200 hover:shadow-xl hover:shadow-white/30"
            data-testid="button-pay"
          >
            <span className="flex items-center justify-center gap-2">
              {paymentMethod === "upi" ? "CONTINUE TO UPI" : `PAY ₹${listing.sellingPrice}`}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
