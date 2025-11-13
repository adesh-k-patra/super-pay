import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function CouponMartPaymentConfirm() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/payment/:id/confirm");
  const { toast } = useToast();
  
  const listingId = params?.id || "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
        description: "Unable to complete your purchase. Please contact support.",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate(`/coupon-mart/listing/${listingId}`);
      }, 2000);
    },
  });

  useEffect(() => {
    if (listingId && !buyMutation.isPending && !buyMutation.isSuccess) {
      setTimeout(() => {
        buyMutation.mutate();
      }, 1000);
    }
  }, [listingId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Confirming Your Purchase</h2>
          <p className="text-white/60">Please wait while we complete your coupon purchase...</p>
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
