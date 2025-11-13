import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CreditCard,
  Shield
} from "lucide-react";

interface Listing {
  id: string;
  couponTitle: string;
  couponBrand: string;
  sellingPrice?: string;
}

export default function CouponMartProcessPayment() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/payment/:id/process");
  const { toast } = useToast();
  
  const listingId = params?.id || "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: listing } = useQuery<Listing>({
    queryKey: ["/api/coupon-mart/listings", listingId],
    enabled: !!listingId,
  });

  const buyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/coupon-mart/listings/${listingId}/buy`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/transactions"] });
      navigate("/coupon-mart/payment-success");
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate(`/coupon-mart/payment/${listingId}`);
      }, 2000);
    },
  });

  useEffect(() => {
    if (listing && !buyMutation.isPending && !buyMutation.isSuccess) {
      setTimeout(() => {
        buyMutation.mutate();
      }, 2000);
    }
  }, [listing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <CreditCard className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
          <p className="text-white/60">Please wait while we process your payment securely...</p>
          {listing && (
            <p className="text-sm text-white/40 mt-3">Amount: ₹{listing.sellingPrice}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-5 w-5 text-green-400" />
          <p className="text-xs text-white/50">Secure Payment Gateway</p>
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
