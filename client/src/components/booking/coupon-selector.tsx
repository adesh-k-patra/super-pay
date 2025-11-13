import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Ticket, Tag, Check, X, Percent, Gift, AlertCircle } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "discount" | "cashback" | "free_service" | "offer";
  value: number;
  valueType: "percentage" | "fixed" | "points";
  minAmount: number;
  maxDiscount?: number;
  category: "bills" | "travel" | "investments" | "shopping" | "food" | "all";
  merchantName: string;
  validFrom: string;
  validUntil: string;
  isUsed: boolean;
  eligibleOn: string[];
  isActive: boolean;
}

interface CouponSelectorProps {
  bookingAmount: number;
  category?: string;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  className?: string;
}

const mockAvailableCoupons: Coupon[] = [
  {
    id: "1",
    code: "TRAVEL100",
    title: "₹100 Off on Travel Booking",
    description: "Flat ₹100 discount on flight & bus bookings",
    type: "discount",
    value: 100,
    valueType: "fixed",
    minAmount: 1000,
    category: "travel",
    merchantName: "InCred Travel",
    validFrom: "2024-11-01",
    validUntil: "2024-12-31",
    isUsed: false,
    eligibleOn: ["Flights", "Bus", "Train", "Metro", "Hotel", "Rental"],
    isActive: true,
  },
  {
    id: "2",
    code: "TRAVEL20",
    title: "20% Off up to ₹200",
    description: "Get 20% discount on your booking",
    type: "discount",
    value: 20,
    valueType: "percentage",
    minAmount: 500,
    maxDiscount: 200,
    category: "travel",
    merchantName: "InCred",
    validFrom: "2024-11-01",
    validUntil: "2024-12-31",
    isUsed: false,
    eligibleOn: ["Flights", "Bus", "Train", "Metro", "Hotel", "Rental", "Movie", "Event"],
    isActive: true,
  },
  {
    id: "3",
    code: "FIRST50",
    title: "₹50 Off on First Booking",
    description: "First time user discount",
    type: "discount",
    value: 50,
    valueType: "fixed",
    minAmount: 200,
    category: "all",
    merchantName: "InCred",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    isUsed: false,
    eligibleOn: ["Flights", "Bus", "Train", "Metro", "Hotel", "Rental", "Movie", "Event", "Cab"],
    isActive: true,
  },
  {
    id: "4",
    code: "MOVIE30",
    title: "30% Off on Movie Tickets",
    description: "Get 30% off on movie bookings",
    type: "discount",
    value: 30,
    valueType: "percentage",
    minAmount: 300,
    maxDiscount: 150,
    category: "travel",
    merchantName: "PVR",
    validFrom: "2024-11-01",
    validUntil: "2024-12-31",
    isUsed: false,
    eligibleOn: ["Movie"],
    isActive: true,
  },
];

export function CouponSelector({ 
  bookingAmount, 
  category = "all",
  appliedCoupon, 
  onApplyCoupon,
  className 
}: CouponSelectorProps) {
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(appliedCoupon?.id || null);

  const calculateDiscount = (coupon: Coupon): number => {
    if (coupon.valueType === "percentage") {
      const discount = (bookingAmount * coupon.value) / 100;
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
    }
    return coupon.value;
  };

  const isCouponValid = (coupon: Coupon): { valid: boolean; reason?: string } => {
    if (!coupon.isActive) {
      return { valid: false, reason: "This coupon has expired" };
    }
    if (coupon.isUsed) {
      return { valid: false, reason: "This coupon has already been used" };
    }
    if (bookingAmount < coupon.minAmount) {
      return { valid: false, reason: `Minimum booking amount ₹${coupon.minAmount} required` };
    }
    return { valid: true };
  };

  const handleApplyCouponCode = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Coupon Code Required",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    const coupon = mockAvailableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid",
        variant: "destructive",
      });
      return;
    }

    const validation = isCouponValid(coupon);
    if (!validation.valid) {
      toast({
        title: "Cannot Apply Coupon",
        description: validation.reason,
        variant: "destructive",
      });
      return;
    }

    onApplyCoupon(coupon);
    toast({
      title: "Coupon Applied!",
      description: `You saved ₹${calculateDiscount(coupon).toFixed(0)}`,
    });
    setCouponCode("");
  };

  const handleSelectFromDialog = () => {
    const coupon = mockAvailableCoupons.find(c => c.id === selectedCouponId);
    if (!coupon) return;

    const validation = isCouponValid(coupon);
    if (!validation.valid) {
      toast({
        title: "Cannot Apply Coupon",
        description: validation.reason,
        variant: "destructive",
      });
      return;
    }

    onApplyCoupon(coupon);
    setShowCouponDialog(false);
    toast({
      title: "Coupon Applied!",
      description: `You saved ₹${calculateDiscount(coupon).toFixed(0)}`,
    });
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setSelectedCouponId(null);
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your booking",
    });
  };

  const availableCoupons = mockAvailableCoupons.filter(coupon => {
    const validation = isCouponValid(coupon);
    return validation.valid;
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
        <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Apply Coupon
        </h3>

        {appliedCoupon ? (
          <div className="space-y-4">
            <div className="border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none font-mono text-sm">
                      {appliedCoupon.code}
                    </Badge>
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-white font-light mb-1">{appliedCoupon.title}</p>
                  <p className="text-xs text-white/60">{appliedCoupon.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-light">
                      You saved ₹{calculateDiscount(appliedCoupon).toFixed(0)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                  data-testid="button-remove-coupon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 uppercase font-mono focus:border-white"
                data-testid="input-coupon-code"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyCouponCode();
                  }
                }}
              />
              <Button
                onClick={handleApplyCouponCode}
                className="bg-white text-black hover:bg-white/90 rounded-none px-6 h-12"
                data-testid="button-apply-coupon"
              >
                APPLY
              </Button>
            </div>

            {availableCoupons.length > 0 && (
              <div className="pt-2">
                <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 p-0 h-auto font-light"
                      data-testid="button-view-coupons"
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      View Available Coupons ({availableCoupons.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white font-light text-xl">Available Coupons</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      <RadioGroup value={selectedCouponId || ""} onValueChange={setSelectedCouponId}>
                        {availableCoupons.map((coupon) => {
                          const discount = calculateDiscount(coupon);
                          return (
                            <div
                              key={coupon.id}
                              className={cn(
                                "border p-4 cursor-pointer transition-all",
                                selectedCouponId === coupon.id
                                  ? "bg-white/10 border-white"
                                  : "bg-white/5 border-white/20 hover:border-white/40"
                              )}
                              onClick={() => setSelectedCouponId(coupon.id)}
                              data-testid={`coupon-option-${coupon.code}`}
                            >
                              <div className="flex items-start gap-3">
                                <RadioGroupItem
                                  value={coupon.id}
                                  id={coupon.id}
                                  className="border-white/40 text-white mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge className="bg-white/10 text-white border-white/20 rounded-none font-mono">
                                      {coupon.code}
                                    </Badge>
                                    <span className="text-green-400 font-light flex items-center gap-1">
                                      <Percent className="h-3 w-3" />
                                      Save ₹{discount.toFixed(0)}
                                    </span>
                                  </div>
                                  <p className="text-white font-light mb-1">{coupon.title}</p>
                                  <p className="text-xs text-white/60 mb-2">{coupon.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-white/50">
                                    <span>Min: ₹{coupon.minAmount}</span>
                                    {coupon.maxDiscount && <span>Max discount: ₹{coupon.maxDiscount}</span>}
                                    <span>Valid till: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowCouponDialog(false)}
                        className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none"
                        data-testid="button-cancel-coupon"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSelectFromDialog}
                        disabled={!selectedCouponId}
                        className="flex-1 bg-white text-black hover:bg-white/90 rounded-none"
                        data-testid="button-select-coupon"
                      >
                        Apply Coupon
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )}

        {!appliedCoupon && availableCoupons.length === 0 && (
          <div className="p-4 bg-white/5 border border-white/10 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-white/40 mt-0.5" />
            <div>
              <p className="text-white/60 text-sm font-light">No coupons available</p>
              <p className="text-white/40 text-xs mt-1">
                Minimum booking amount of ₹{Math.min(...mockAvailableCoupons.map(c => c.minAmount))} required
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
