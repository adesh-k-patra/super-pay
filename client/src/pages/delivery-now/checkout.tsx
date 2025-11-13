import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MapPin,
  Plus,
  ChevronRight,
  CreditCard,
  Wallet,
  Banknote,
  Check,
  AlertCircle,
  Clock,
  User,
  Phone
} from "lucide-react";

export default function FoodCheckout() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [cart, setCart] = useState<any>(null);
  const [billDetails, setBillDetails] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("upi");

  useEffect(() => {
    const savedCart = localStorage.getItem('deliveryCart');
    const savedBill = localStorage.getItem('deliveryCartTotal');
    const savedAddresses = localStorage.getItem('deliveryAddresses');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedBill) setBillDetails(JSON.parse(savedBill));
    
    const parsedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
    setAddresses(parsedAddresses);
    
    if (parsedAddresses.length > 0) {
      setSelectedAddress(parsedAddresses[0].id);
    }
  }, []);

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Wallet, description: "Pay via UPI apps" },
    { id: "card", name: "Card", icon: CreditCard, description: "Credit/Debit Card" },
    { id: "cash", name: "Cash", icon: Banknote, description: "Cash on Delivery" }
  ];

  const handlePlaceOrder = () => {
    if (selectedPayment === "upi") {
      const orderId = `ORD${Date.now()}`;
      const orderData = {
        id: orderId,
        vendorName: cart?.vendorName || "Restaurant",
        items: cart?.items || {},
        products: cart?.products || [],
        billDetails,
        address: addresses.find(a => a.id === selectedAddress),
        paymentMethod: "UPI",
        status: "pending",
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      
      const upiParams = new URLSearchParams({
        amount: billDetails.total.toString(),
        transactionType: 'delivery-now',
        orderId: orderId,
        returnUrl: `/delivery-now/success/${orderId}`
      });
      
      navigate(`/upi-payment?${upiParams.toString()}`);
    } else {
      const orderId = `ORD${Date.now()}`;
      const orderData = {
        id: orderId,
        vendorName: cart?.vendorName || "Restaurant",
        items: cart?.items || {},
        products: cart?.products || [],
        billDetails,
        address: addresses.find(a => a.id === selectedAddress),
        paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name,
        status: "confirmed",
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      
      const existingOrders = localStorage.getItem('foodOrders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(orderData);
      localStorage.setItem('foodOrders', JSON.stringify(orders));
      
      localStorage.removeItem('deliveryCart');
      localStorage.removeItem('deliveryCartTotal');
      
      navigate(`/delivery-now/success/${orderId}`);
    }
  };

  if (!cart || !billDetails) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-white/40 mx-auto mb-4" strokeWidth={1} />
          <p className="text-white/60 mb-4">No items in cart</p>
          <Button onClick={() => navigate("/delivery-now")} className="bg-white text-black">
            Browse Categories
          </Button>
        </div>
      </div>
    );
  }

  const cartItems = Object.entries(cart.items).map(([productId, quantity]) => {
    const product = cart.products.find((p: any) => p.id === productId);
    return product ? { ...product, quantity } : null;
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="flex items-center gap-3 py-4 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </Button>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase">Checkout</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">{cart.vendorName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Delivery Address */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Delivery Address
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/delivery-now/add-address")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-7 px-3 text-[10px] font-light tracking-widest"
              data-testid="button-add-address"
            >
              <Plus className="h-3 w-3 mr-1" strokeWidth={1} />
              ADD NEW
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="border border-white/10 bg-white/5 p-6 text-center">
              <MapPin className="h-8 w-8 text-white/20 mx-auto mb-3" strokeWidth={1} />
              <p className="text-sm text-white/60 mb-3">No delivery address added</p>
              <Button
                onClick={() => navigate("/delivery-now/add-address")}
                className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 text-xs font-semibold tracking-wider"
                data-testid="button-add-first-address"
              >
                <Plus className="h-3 w-3 mr-1" strokeWidth={1.5} />
                ADD ADDRESS
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`border cursor-pointer transition-all p-4 ${
                  selectedAddress === address.id
                    ? "border-white bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
                data-testid={`address-${address.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mt-0.5 ${
                    selectedAddress === address.id
                      ? "border-white"
                      : "border-white/40"
                  }`}>
                    {selectedAddress === address.id && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-white/30 rounded-none text-[10px] px-2 py-0 font-light tracking-widest">
                        {address.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-semibold">{address.name}</span>
                    </div>
                    <p className="text-xs text-white/60 font-light mb-1">{address.address}</p>
                    <p className="text-xs text-white/60 font-light mb-1">{address.city} - {address.pincode}</p>
                    <p className="text-xs text-white/60 font-light">Phone: {address.phone}</p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Payment Method
          </h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border cursor-pointer transition-all p-4 ${
                    selectedPayment === method.id
                      ? "border-white bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                  data-testid={`payment-${method.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                      selectedPayment === method.id
                        ? "border-white"
                        : "border-white/40"
                    }`}>
                      {selectedPayment === method.id && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white/80" strokeWidth={1} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-0.5">{method.name}</h3>
                      <p className="text-xs text-white/50 font-light">{method.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 mb-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-white/60 font-light">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 space-y-2 text-sm">
            <div className="flex justify-between font-light">
              <span className="text-white/60">Item Total</span>
              <span className="font-semibold">₹{billDetails.subtotal}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Delivery Fee</span>
              <span className="font-semibold">₹{billDetails.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Platform Fee</span>
              <span className="font-semibold">₹{billDetails.platformFee}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">GST</span>
              <span className="font-semibold">₹{billDetails.gst}</span>
            </div>
            {billDetails.tipAmount > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">Delivery Tip</span>
                <span className="font-semibold">₹{billDetails.tipAmount}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between text-base">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold">₹{billDetails.total}</span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery Time */}
        <div className="flex items-start gap-3 border border-green-500/30 bg-green-500/10 p-4">
          <Clock className="h-4 w-4 text-green-400 shrink-0 mt-0.5" strokeWidth={1} />
          <div>
            <p className="text-sm font-semibold text-green-300 mb-1">Estimated Delivery Time</p>
            <p className="text-xs text-green-300/80 font-light">Your order will arrive in 30-35 minutes</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none"
            data-testid="button-place-order"
          >
            <div className="flex items-center justify-between w-full px-2">
              <span>PLACE ORDER</span>
              <div className="flex items-center gap-2">
                <span>₹{billDetails.total}</span>
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
