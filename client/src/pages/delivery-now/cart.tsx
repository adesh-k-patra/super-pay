import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight,
  Leaf,
  Package2,
  Percent,
  MapPin,
  AlertCircle,
  Tag,
  X,
  Check
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

// Sample coupon data
const availableCoupons = [
  {
    id: "FIRST50",
    code: "FIRST50",
    title: "First Order Discount",
    description: "Get ₹50 off on your first order",
    discount: 50,
    discountType: "flat",
    minOrder: 199,
    maxDiscount: 50,
  },
  {
    id: "SAVE100",
    code: "SAVE100",
    title: "₹100 Off",
    description: "Save ₹100 on orders above ₹500",
    discount: 100,
    discountType: "flat",
    minOrder: 500,
    maxDiscount: 100,
  },
  {
    id: "PERCENT20",
    code: "PERCENT20",
    title: "20% Off",
    description: "Get 20% off up to ₹200",
    discount: 20,
    discountType: "percentage",
    minOrder: 300,
    maxDiscount: 200,
  },
  {
    id: "SAVE200",
    code: "SAVE200",
    title: "₹200 Off",
    description: "Save ₹200 on orders above ₹1000",
    discount: 200,
    discountType: "flat",
    minOrder: 1000,
    maxDiscount: 200,
  },
  {
    id: "FLAT150",
    code: "FLAT150",
    title: "Flat ₹150 Off",
    description: "Get ₹150 off on orders above ₹800",
    discount: 150,
    discountType: "flat",
    minOrder: 800,
    maxDiscount: 150,
  },
];

export default function FoodCart() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [cart, setCart] = useState<any>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponSheetOpen, setCouponSheetOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('deliveryCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    if (!cart) return;
    
    const newItems = { ...cart.items };
    const currentQty = newItems[productId] || 0;
    const newQty = currentQty + delta;
    
    if (newQty <= 0) {
      delete newItems[productId];
    } else {
      newItems[productId] = newQty;
    }
    
    const updatedCart = { ...cart, items: newItems };
    setCart(updatedCart);
    localStorage.setItem('deliveryCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem('deliveryCart');
    setCart(null);
  };

  const cartItems = useMemo(() => {
    if (!cart || !cart.items || !cart.products) return [];
    
    return Object.entries(cart.items).map(([productId, quantity]) => {
      const product = cart.products.find((p: any) => p.id === productId);
      return product ? { ...product, quantity } : null;
    }).filter(Boolean);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item: any) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon && subtotal < appliedCoupon.minOrder) {
      setAppliedCoupon(null);
      setCouponCode("");
    }
  }, [subtotal, appliedCoupon]);

  const calculateCouponDiscount = (coupon: any, subtotal: number) => {
    if (coupon.discountType === "flat") {
      return Math.min(coupon.discount, coupon.maxDiscount);
    } else {
      return Math.min(Math.round(subtotal * (coupon.discount / 100)), coupon.maxDiscount);
    }
  };

  const applyCoupon = (coupon: any) => {
    if (subtotal >= coupon.minOrder) {
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setCouponSheetOpen(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const applyCouponByCode = () => {
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      if (subtotal >= coupon.minOrder) {
        setAppliedCoupon(coupon);
      } else {
        alert(`Minimum order value of ₹${coupon.minOrder} required for this coupon`);
      }
    } else {
      alert("Invalid coupon code");
    }
  };

  const deliveryFee = 25;
  const platformFee = 5;
  const couponDiscount = appliedCoupon ? calculateCouponDiscount(appliedCoupon, subtotal) : 0;
  const gst = Math.round((subtotal + deliveryFee) * 0.05);
  const total = subtotal + deliveryFee + platformFee + gst + tipAmount - couponDiscount;

  if (!cart || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3 py-4 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/delivery-now")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </Button>
            <h1 className="text-sm font-bold tracking-wider uppercase">Your Cart</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-[70vh] px-4 pt-20">
          <ShoppingCart className="h-16 w-16 text-white/20 mb-4" strokeWidth={1} />
          <h2 className="text-xl font-bold mb-2 tracking-wide">Your cart is empty</h2>
          <p className="text-white/50 text-center mb-6 text-sm font-light">
            Add items from restaurants to get started
          </p>
          <Button 
            onClick={() => navigate("/delivery-now")} 
            className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 font-semibold tracking-wider" 
            data-testid="button-browse-restaurants"
          >
            BROWSE CATEGORIES
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
            
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="text-sm font-bold tracking-wider uppercase">Your Cart</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">{cart.vendorName}</p>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Cart Items */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Items ({cartItems.length})
            </h2>
          </div>
          
          <div className="space-y-0">
            {cartItems.map((item: any) => (
              <div 
                key={item.id} 
                className="border-b border-white/10 py-4"
                data-testid={`cart-item-${item.id}`}
              >
                <div className="flex gap-3">
                  {/* Product Image */}
                  {item.image && (
                    <div className="w-24 h-24 bg-white/5 border border-white/10 shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        {item.brand && (
                          <span className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5 block">{item.brand}</span>
                        )}
                        <h3 className="text-sm font-semibold mb-1 line-clamp-2">{item.name}</h3>
                        {item.isVeg !== undefined && (
                          <div className="flex items-center gap-1 mb-1">
                            {item.isVeg === 1 ? (
                              <>
                                <div className="w-3 h-3 border border-green-500 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                </div>
                                <span className="text-[10px] text-white/40">Vegetarian</span>
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 border border-red-500 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                </div>
                                <span className="text-[10px] text-white/40">Non-Vegetarian</span>
                              </>
                            )}
                          </div>
                        )}
                        {item.description && (
                          <p className="text-xs text-white/40 line-clamp-1 mb-1">{item.description}</p>
                        )}
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateQuantity(item.id, -item.quantity)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1} />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <motion.p 
                            key={`price-${item.id}-${item.quantity}`}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, type: "spring" }}
                            className="text-base font-bold"
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </motion.p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-white/30 line-through">₹{(item.originalPrice * item.quantity).toFixed(2)}</span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 font-light">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, -1)} 
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                          className="text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1} />
                        </motion.button>
                        <motion.span 
                          key={`qty-${item.id}-${item.quantity}`}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                          className="text-sm font-bold min-w-[24px] text-center" 
                          data-testid={`quantity-${item.id}`}
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, 1)} 
                          data-testid={`button-increase-${item.id}`}
                          className="text-white/80 hover:text-white"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Instructions */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
            Delivery Instructions
          </h3>
          <Input
            type="text"
            placeholder="Add a note (e.g., less spicy, no onions)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 placeholder:text-sm placeholder:font-light focus:border-white/40 rounded-none"
            data-testid="input-instructions"
          />
        </div>

        {/* Tip Section */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
            Tip Your Delivery Partner
          </h3>
          <div className="flex gap-2">
            {[0, 20, 30, 50].map((tip) => (
              <Button
                key={tip}
                variant={tipAmount === tip ? "default" : "outline"}
                size="sm"
                onClick={() => setTipAmount(tip)}
                className={`flex-1 rounded-none ${
                  tipAmount === tip
                    ? "bg-white text-black"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                }`}
                data-testid={`button-tip-${tip}`}
              >
                {tip === 0 ? "NO TIP" : `₹${tip}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
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
                className="border border-green-500/30 bg-green-500/5 p-3 flex items-center justify-between overflow-hidden"
              >
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-green-500 mt-0.5" strokeWidth={1} />
                  <div>
                    <p className="text-sm font-semibold text-white">{appliedCoupon.code}</p>
                    <p className="text-xs text-white/60 mt-0.5">{appliedCoupon.description}</p>
                    <p className="text-xs text-green-500 font-semibold mt-1">
                      You saved ₹{couponDiscount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-white/60 hover:text-white"
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
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 placeholder:text-sm placeholder:font-light focus:border-white/40 rounded-none uppercase"
                  data-testid="input-coupon-code"
                />
                <Button
                  onClick={applyCouponByCode}
                  disabled={!couponCode}
                  className="bg-white text-black hover:bg-white/90 rounded-none px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-apply-coupon"
                >
                  APPLY
                </Button>
              </div>
              <Sheet open={couponSheetOpen} onOpenChange={setCouponSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none"
                    data-testid="button-my-coupons"
                  >
                    <Tag className="h-4 w-4 mr-2" strokeWidth={1} />
                    VIEW MY COUPONS
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-black text-white border-white/10 rounded-none max-h-[80vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-white font-bold tracking-wide">AVAILABLE COUPONS</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-3">
                    {availableCoupons
                      .sort((a, b) => {
                        const aUsable = subtotal >= a.minOrder;
                        const bUsable = subtotal >= b.minOrder;
                        if (aUsable && !bUsable) return -1;
                        if (!aUsable && bUsable) return 1;
                        return 0;
                      })
                      .map((coupon) => {
                        const isUsable = subtotal >= coupon.minOrder;
                        const potentialDiscount = calculateCouponDiscount(coupon, subtotal);
                        
                        return (
                          <div
                            key={coupon.id}
                            className={`border p-4 ${
                              isUsable
                                ? "border-white/20 bg-white/5 cursor-pointer hover:bg-white/10"
                                : "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() => isUsable && applyCoupon(coupon)}
                            data-testid={`coupon-${coupon.id}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Tag className="h-4 w-4 text-white/60" strokeWidth={1} />
                                  <p className="text-sm font-bold tracking-wider">{coupon.code}</p>
                                </div>
                                <p className="text-sm font-semibold mb-1">{coupon.title}</p>
                                <p className="text-xs text-white/60 mb-2">{coupon.description}</p>
                                {isUsable ? (
                                  <p className="text-xs text-green-500 font-semibold">
                                    You will save ₹{potentialDiscount}
                                  </p>
                                ) : (
                                  <p className="text-xs text-white/40">
                                    Add items worth ₹{coupon.minOrder - subtotal} more to use this coupon
                                  </p>
                                )}
                              </div>
                              {isUsable && (
                                <Button
                                  size="sm"
                                  className="bg-white text-black hover:bg-white/90 rounded-none text-xs font-semibold px-4"
                                  data-testid={`button-apply-${coupon.id}`}
                                >
                                  APPLY
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </SheetContent>
              </Sheet>
            </>
            )}
          </AnimatePresence>
        </div>

        {/* Bill Details */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Bill Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-light">
              <span className="text-white/60">Item Total</span>
              <motion.span 
                key={subtotal}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, type: "spring" }}
                className="font-semibold"
              >
                ₹{subtotal}
              </motion.span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Delivery Fee</span>
              <span className="font-semibold">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Platform Fee</span>
              <span className="font-semibold">₹{platformFee}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">GST (5%)</span>
              <span className="font-semibold">₹{gst}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">Delivery Tip</span>
                <span className="font-semibold">₹{tipAmount}</span>
              </div>
            )}
            <AnimatePresence>
              {couponDiscount > 0 && (
                <motion.div 
                  key="coupon-discount"
                  initial={{ opacity: 0, height: 0, y: -5 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex justify-between font-light overflow-hidden"
                >
                  <span className="text-green-500">Coupon Discount</span>
                  <motion.span 
                    key={couponDiscount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="font-semibold text-green-500"
                  >
                    -₹{couponDiscount}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="pt-3 border-t border-white/10 flex justify-between text-base">
              <span className="font-bold">To Pay</span>
              <motion.span 
                key={total}
                initial={{ scale: 1.2, color: "rgb(34, 197, 94)" }}
                animate={{ scale: 1, color: "rgb(255, 255, 255)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="font-bold"
              >
                ₹{total}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 border border-white/10 bg-white/5 p-4 mb-6">
          <AlertCircle className="h-4 w-4 text-white/60 shrink-0 mt-0.5" strokeWidth={1} />
          <p className="text-xs text-white/60 font-light">
            Review your order and address details carefully before proceeding to checkout
          </p>
        </div>
      </div>

      {/* Fixed Bottom Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={() => {
              localStorage.setItem('deliveryCartTotal', JSON.stringify({ 
                subtotal, 
                deliveryFee, 
                platformFee, 
                gst, 
                tipAmount, 
                couponDiscount, 
                appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
                total 
              }));
              navigate("/delivery-now/checkout");
            }}
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none"
            data-testid="button-checkout"
          >
            <div className="flex items-center justify-between w-full px-2">
              <span>PROCEED TO CHECKOUT</span>
              <div className="flex items-center gap-2">
                <span>₹{total}</span>
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
