import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tag, X, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { TravelCoupon } from "@shared/schema";

interface TravelCouponInputProps {
  serviceType: "flight" | "bus" | "train" | "cab" | "metro" | "rental" | "hotel" | "event" | "movie";
  bookingAmount: number;
  onCouponApply: (coupon: TravelCoupon, discount: number) => void;
  onCouponRemove: () => void;
  appliedCoupon?: TravelCoupon | null;
  discount?: number;
}

export function TravelCouponInput({
  serviceType,
  bookingAmount,
  onCouponApply,
  onCouponRemove,
  appliedCoupon = null,
  discount = 0
}: TravelCouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponSheetOpen, setCouponSheetOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<TravelCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableCoupons();
  }, [serviceType]);

  useEffect(() => {
    if (appliedCoupon) {
      const minAmount = Number(appliedCoupon.minBookingAmount);
      if (bookingAmount < minAmount) {
        onCouponRemove();
        toast({
          title: "Coupon Removed",
          description: `Minimum booking amount of ₹${minAmount} required`,
          variant: "destructive"
        });
      }
    }
  }, [bookingAmount, appliedCoupon]);

  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/travel-coupons?serviceType=${serviceType}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableCoupons(data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (coupon: TravelCoupon, amount: number): number => {
    const discountValue = Number(coupon.discountValue);
    const maxDiscount = coupon.maxDiscount ? Number(coupon.maxDiscount) : Infinity;
    
    if (coupon.type === "flat") {
      return Math.min(discountValue, maxDiscount);
    } else {
      return Math.min(Math.round(amount * (discountValue / 100)), maxDiscount);
    }
  };

  const applyCoupon = (coupon: TravelCoupon) => {
    const minAmount = Number(coupon.minBookingAmount);
    if (bookingAmount >= minAmount) {
      const discountAmount = calculateDiscount(coupon, bookingAmount);
      onCouponApply(coupon, discountAmount);
      setCouponCode(coupon.code);
      setCouponSheetOpen(false);
      toast({
        title: "Coupon Applied!",
        description: `You saved ₹${discountAmount}`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: `Minimum booking amount of ₹${minAmount} required`,
        variant: "destructive"
      });
    }
  };

  const applyCouponByCode = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/travel-coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          serviceType,
          bookingAmount
        })
      });

      if (response.ok) {
        const coupon = await response.json();
        applyCoupon(coupon);
      } else {
        const error = await response.json();
        toast({
          title: "Invalid Coupon",
          description: error.message || "Coupon code is invalid",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemove();
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your booking"
    });
  };

  return (
    <div className="border border-white/10 bg-white/5 p-4 dark:border-gray-800 dark:bg-gray-900/50">
      <h3 className="text-xs font-semibold text-white/60 dark:text-gray-400 uppercase tracking-widest mb-3">
        Apply Coupon
      </h3>
      
      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          <motion.div 
            key="applied-coupon"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border border-green-500/30 bg-green-500/5 dark:bg-green-500/10 p-3 flex items-center justify-between overflow-hidden"
            data-testid="applied-coupon"
          >
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-green-500 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-sm font-semibold text-white dark:text-gray-100" data-testid="text-coupon-code">
                  {appliedCoupon.code}
                </p>
                <p className="text-xs text-white/60 dark:text-gray-400 mt-0.5">
                  {appliedCoupon.description}
                </p>
                <p className="text-xs text-green-500 font-semibold mt-1" data-testid="text-discount">
                  You saved ₹{discount}
                </p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-white/60 hover:text-white dark:text-gray-400 dark:hover:text-gray-100"
              data-testid="button-remove-coupon"
            >
              <X className="h-4 w-4" strokeWidth={1} />
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white/5 border-white/20 text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder:text-white/30 dark:placeholder:text-gray-500 placeholder:text-sm placeholder:font-light focus:border-white/40 dark:focus:border-gray-600 rounded-none uppercase"
                data-testid="input-coupon-code"
                disabled={loading}
              />
              <Button
                onClick={applyCouponByCode}
                disabled={!couponCode || loading}
                className="bg-white text-black hover:bg-white/90 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 rounded-none px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-apply-coupon"
              >
                {loading ? "..." : "APPLY"}
              </Button>
            </div>
            <Sheet open={couponSheetOpen} onOpenChange={setCouponSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 rounded-none"
                  data-testid="button-view-coupons"
                >
                  <Tag className="h-4 w-4 mr-2" strokeWidth={1} />
                  VIEW AVAILABLE COUPONS
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="bg-black text-white dark:bg-gray-950 dark:text-gray-100 border-white/10 dark:border-gray-800 rounded-none max-h-[80vh] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="text-white dark:text-gray-100 font-bold tracking-wide">
                    AVAILABLE COUPONS
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-3">
                  {loading ? (
                    <div className="text-center py-8 text-white/60 dark:text-gray-400">
                      Loading coupons...
                    </div>
                  ) : availableCoupons.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-white/20 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-white/60 dark:text-gray-400">No coupons available</p>
                    </div>
                  ) : (
                    availableCoupons
                      .sort((a, b) => {
                        const aUsable = bookingAmount >= Number(a.minBookingAmount);
                        const bUsable = bookingAmount >= Number(b.minBookingAmount);
                        if (aUsable && !bUsable) return -1;
                        if (!aUsable && bUsable) return 1;
                        return 0;
                      })
                      .map((coupon) => {
                        const minAmount = Number(coupon.minBookingAmount);
                        const isUsable = bookingAmount >= minAmount;
                        const potentialDiscount = calculateDiscount(coupon, bookingAmount);
                        
                        return (
                          <div
                            key={coupon.id}
                            className={`border p-4 ${
                              isUsable
                                ? "border-white/20 bg-white/5 dark:border-gray-700 dark:bg-gray-800/50 cursor-pointer hover:bg-white/10 dark:hover:bg-gray-800"
                                : "border-white/10 bg-white/5 dark:border-gray-800 dark:bg-gray-900/30 opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() => isUsable && applyCoupon(coupon)}
                            data-testid={`coupon-${coupon.code}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Tag className="h-4 w-4 text-white/60 dark:text-gray-400" strokeWidth={1} />
                                  <p className="text-sm font-bold tracking-wider">{coupon.code}</p>
                                </div>
                                <p className="text-sm font-semibold mb-1">{coupon.title}</p>
                                <p className="text-xs text-white/60 dark:text-gray-400 mb-2">
                                  {coupon.description}
                                </p>
                                {isUsable ? (
                                  <p className="text-xs text-green-500 font-semibold">
                                    You will save ₹{potentialDiscount}
                                  </p>
                                ) : (
                                  <p className="text-xs text-white/40 dark:text-gray-500">
                                    Add ₹{minAmount - bookingAmount} more to use this coupon
                                  </p>
                                )}
                              </div>
                              {isUsable && (
                                <Button
                                  size="sm"
                                  className="bg-white text-black hover:bg-white/90 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 rounded-none text-xs font-semibold px-4"
                                  data-testid={`button-apply-${coupon.code}`}
                                >
                                  APPLY
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
