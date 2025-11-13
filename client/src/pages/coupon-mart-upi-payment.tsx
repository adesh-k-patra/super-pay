import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Smartphone,
  Loader2,
  Shield,
  CheckCircle2,
  Copy
} from "lucide-react";
import QRCode from "react-qr-code";

interface Listing {
  id: string;
  couponTitle: string;
  couponBrand: string;
  sellingPrice?: string;
}

export default function CouponMartUpiPayment() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/payment/:id/upi");
  const { toast } = useToast();
  const [upiId, setUpiId] = useState("");
  const [showQr, setShowQr] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
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

  const upiPaymentString = listing 
    ? `upi://pay?pa=couponmart@upi&pn=Coupon Mart&am=${listing.sellingPrice}&cu=INR`
    : "";

  const buyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/coupon-mart/listings/${listingId}/buy`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/transactions"] });
      setPaymentProcessing(false);
      navigate("/coupon-mart/payment-success");
    },
    onError: () => {
      setPaymentProcessing(false);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("couponmart@upi");
    toast({
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    });
  };

  const handlePay = () => {
    if (!showQr && !upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return;
    }

    setPaymentProcessing(true);
    setTimeout(() => {
      buyMutation.mutate();
    }, 2000);
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

  if (paymentProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Smartphone className="h-12 w-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-white/60">Please wait while we confirm your payment...</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate(`/coupon-mart/payment/${listingId}`)}
            className="text-white hover:text-white/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-sm font-bold tracking-wider">UPI PAYMENT</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-md mx-auto">
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 text-center">
          <p className="text-sm text-white/60 mb-2">Amount to Pay</p>
          <p className="text-4xl font-bold">₹{listing.sellingPrice}</p>
          <p className="text-xs text-white/50 mt-2">{listing.couponTitle}</p>
        </div>

        <div className="space-y-4">
          <div className="flex border border-white/20 overflow-hidden">
            <button
              onClick={() => setShowQr(true)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                showQr ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
              }`}
              data-testid="button-qr-tab"
            >
              Scan QR Code
            </button>
            <button
              onClick={() => setShowQr(false)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                !showQr ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
              }`}
              data-testid="button-upi-id-tab"
            >
              Enter UPI ID
            </button>
          </div>

          {showQr ? (
            <div className="space-y-4">
              <div className="bg-white p-6 mx-auto w-fit rounded-lg">
                <QRCode
                  value={upiPaymentString}
                  size={200}
                  level="H"
                  data-testid="qr-code"
                />
              </div>
              <div className="border border-white/20 bg-white/5 p-4">
                <p className="text-xs text-white/60 mb-2">Scan using any UPI app:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">Google Pay</span>
                  <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">PhonePe</span>
                  <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">Paytm</span>
                  <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">BHIM</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Enter Your UPI ID</label>
                <Input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12"
                  data-testid="input-upi-id"
                />
              </div>
              <div className="border border-white/20 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-white/60">Pay to UPI ID:</p>
                  <button
                    onClick={handleCopyUpi}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    data-testid="button-copy-upi"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <p className="text-sm font-mono text-white">couponmart@upi</p>
              </div>
            </div>
          )}
        </div>

        <div className="border border-blue-500/30 bg-blue-500/10 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-medium text-blue-300 mb-1">Secure Payment</p>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Your payment is processed through secure UPI gateway. Complete the payment in your UPI app to proceed.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-white/50 text-center">
            After scanning QR code or making payment, click the button below
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handlePay}
            disabled={buyMutation.isPending}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-lg h-14 text-base font-bold shadow-lg shadow-green-500/20 transition-all duration-200"
            data-testid="button-confirm-payment"
          >
            {buyMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Verifying Payment...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" strokeWidth={2} />
                I Have Paid ₹{listing.sellingPrice}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
