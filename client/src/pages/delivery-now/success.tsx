import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  Home,
  Package,
  Download,
  Share2,
  MapPin,
  Clock,
  ChevronRight
} from "lucide-react";

export default function FoodOrderSuccess() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/delivery-now/success/:id");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      setIsLoading(false);
    } else {
      // If no order data found, show message and redirect after 2 seconds
      setIsLoading(false);
      const timeout = setTimeout(() => {
        navigate("/delivery-now");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [params?.id, navigate]);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-white/40 mx-auto mb-4 animate-pulse" strokeWidth={1} />
          <p className="text-white/60">
            {!order && !isLoading ? "Order not found. Redirecting..." : "Loading order details..."}
          </p>
        </div>
      </div>
    );
  }

  const cartItems = Object.entries(order.items).map(([productId, quantity]) => {
    const product = order.products.find((p: any) => p.id === productId);
    return product ? { ...product, quantity } : null;
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Success Animation */}
      <div className="pt-20 px-4 pb-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 border-2 border-green-500 rounded-full flex items-center justify-center bg-green-500/20 animate-pulse">
          <CheckCircle className="h-12 w-12 text-green-400" strokeWidth={1} />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 tracking-wide">Order Placed Successfully!</h1>
        <p className="text-sm text-white/60 font-light mb-6">
          Your order has been confirmed and is being prepared
        </p>

        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs px-4 py-1 font-light tracking-widest">
          ORDER ID: {params?.id}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Delivery Info */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Delivery Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-white/60 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-sm font-semibold mb-1">Estimated Delivery Time</p>
                <p className="text-xs text-white/60 font-light">30-35 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-white/60 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-sm font-semibold mb-1">Delivery Address</p>
                <p className="text-xs text-white/60 font-light">{order.address?.address}</p>
                <p className="text-xs text-white/60 font-light">{order.address?.city} - {order.address?.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  {item.isVeg === 1 ? (
                    <div className="w-3 h-3 border border-green-500 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                  ) : (
                    <div className="w-3 h-3 border border-red-500 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </div>
                  )}
                  <span className="text-white/60 font-light">
                    {item.name} × {item.quantity}
                  </span>
                </div>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-light">
              <span className="text-white/60">Item Total</span>
              <span className="font-semibold">₹{order.billDetails?.subtotal || 0}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Delivery Fee</span>
              <span className="font-semibold">₹{order.billDetails?.deliveryFee || 0}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Taxes & Charges</span>
              <span className="font-semibold">₹{(order.billDetails?.platformFee || 0) + (order.billDetails?.gst || 0)}</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between text-base">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold">₹{order.billDetails?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">
            Payment Method
          </h3>
          <p className="text-sm font-semibold">{order.paymentMethod}</p>
          <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30 rounded-none text-[10px] px-2 py-0.5 font-light tracking-widest">
            PAYMENT SUCCESSFUL
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate(`/delivery-now/track/${params?.id}`)}
            className="w-full bg-white text-black hover:bg-white/90 h-12 font-semibold tracking-wider rounded-none"
            data-testid="button-track-order"
          >
            <div className="flex items-center justify-between w-full px-2">
              <span>TRACK YOUR ORDER</span>
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </div>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                alert("Receipt downloaded!");
              }}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-widest"
              data-testid="button-download"
            >
              <Download className="h-4 w-4 mr-2" strokeWidth={1} />
              RECEIPT
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                alert("Share functionality");
              }}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-widest"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4 mr-2" strokeWidth={1} />
              SHARE
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 z-50">
        <div className="max-w-screen-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/delivery-now")}
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-14 font-semibold tracking-wider"
            data-testid="button-back-to-catalog"
          >
            <Home className="h-5 w-5 mr-2" strokeWidth={1.5} />
            BACK TO CATALOG
          </Button>
          <Button
            onClick={() => navigate("/delivery-now/orders")}
            className="flex-1 bg-white text-black hover:bg-white/90 h-14 font-semibold tracking-wider rounded-none"
            data-testid="button-view-orders"
          >
            <Package className="h-5 w-5 mr-2" strokeWidth={1.5} />
            VIEW ORDERS
          </Button>
        </div>
      </div>
    </div>
  );
}
