import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle,
  Package,
  Bike,
  Home,
  Star
} from "lucide-react";

const generateMockOrders = () => {
  return [
    {
      id: "1",
      vendorName: "The Great Punjab",
      orderId: "FD123456",
      paymentMethod: "UPI",
      billDetails: { total: 820 }
    },
    {
      id: "2",
      vendorName: "QuickMart Express",
      orderId: "SM789012",
      paymentMethod: "Card",
      billDetails: { total: 260 }
    },
    {
      id: "3",
      vendorName: "HealthPlus Pharmacy",
      orderId: "MD345678",
      paymentMethod: "Cash on Delivery",
      billDetails: { total: 25 }
    },
    {
      id: "4",
      vendorName: "Pizza Paradise",
      orderId: "FD901234",
      paymentMethod: "UPI",
      billDetails: { total: 372 }
    },
    {
      id: "SWG-001",
      vendorName: "Swiggy",
      orderId: "SWG-001",
      paymentMethod: "UPI",
      billDetails: { total: 450 }
    },
    {
      id: "ZMT-001",
      vendorName: "Zomato",
      orderId: "ZMT-001",
      paymentMethod: "Card",
      billDetails: { total: 680 }
    }
  ];
};

export default function FoodOrderTracking() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/delivery-now/track/:id");
  const [order, setOrder] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState(0);

  useEffect(() => {
    // First try localStorage for backward compatibility
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // If not in localStorage, try to find from mock orders
      const mockOrders = generateMockOrders();
      const foundOrder = mockOrders.find((o: any) => o.id === params?.id || o.orderId === params?.id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
    
    let statusIndex = 2; // Start at "Ready for Pickup" for demo
    setCurrentStatus(statusIndex);
    
    const interval = setInterval(() => {
      statusIndex = (statusIndex + 1) % 5;
      setCurrentStatus(statusIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [params?.id]);

  const deliveryPartner = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    totalDeliveries: 2500,
    vehicleNumber: "DL 01 AB 1234"
  };

  const trackingSteps = [
    { id: 0, status: "Order Placed", icon: CheckCircle, time: "2:30 PM", description: "Your order has been confirmed" },
    { id: 1, status: "Preparing", icon: Package, time: "2:35 PM", description: "Restaurant is preparing your food" },
    { id: 2, status: "Ready for Pickup", icon: Package, time: "2:50 PM", description: "Food is ready, waiting for pickup" },
    { id: 3, status: "Out for Delivery", icon: Bike, time: "2:55 PM", description: "Delivery partner is on the way" },
    { id: 4, status: "Delivered", icon: Home, time: "3:15 PM", description: "Order delivered successfully" }
  ];

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-white/40 mx-auto mb-4" strokeWidth={1} />
          <p className="text-white/60">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3 py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/delivery-now/orders")}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase">Track Order</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Order ID: {order?.orderId || params?.id}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Map Placeholder */}
        <div className="mb-6 h-64 bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 20px, rgba(255,255,255,0.05) 21px),
                               repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 20px, rgba(255,255,255,0.05) 21px)`
            }} />
          </div>
          <div className="relative z-10 text-center">
            <MapPin className="h-12 w-12 text-white/40 mx-auto mb-2" strokeWidth={1} />
            <p className="text-xs text-white/60 font-light">Live tracking map</p>
            <p className="text-[10px] text-white/40 font-light mt-1">ETA: 15 minutes</p>
          </div>
        </div>

        {/* Delivery Partner Info */}
        {currentStatus >= 3 && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Delivery Partner
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-none h-7 px-3"
                data-testid="button-call-partner"
              >
                <Phone className="h-4 w-4 mr-1" strokeWidth={1} />
                <span className="text-xs font-light tracking-widest">CALL</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border border-white/20 bg-white/10 rounded-full flex items-center justify-center">
                <User className="h-7 w-7 text-white/60" strokeWidth={1} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold mb-1">{deliveryPartner.name}</h4>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white/60" strokeWidth={1} />
                    <span>{deliveryPartner.rating}</span>
                  </div>
                  <span>{deliveryPartner.totalDeliveries} deliveries</span>
                </div>
                <p className="text-xs text-white/50 font-light mt-1">{deliveryPartner.vehicleNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Timeline */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Order Status
          </h3>
          
          <div className="space-y-0">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStatus;
              const isCurrent = index === currentStatus;
              
              return (
                <div key={step.id} className="flex gap-4 pb-6 last:pb-0 relative">
                  {/* Timeline Line */}
                  {index < trackingSteps.length - 1 && (
                    <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${
                      index < currentStatus ? "bg-white" : "bg-white/20"
                    }`} />
                  )}
                  
                  {/* Icon */}
                  <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center shrink-0 relative z-10 ${
                    isActive 
                      ? "border-white bg-white/20" 
                      : "border-white/20 bg-black"
                  }`}>
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/40"}`} strokeWidth={1} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`text-sm font-semibold ${isActive ? "text-white" : "text-white/40"}`}>
                        {step.status}
                      </h4>
                      {isActive && (
                        <span className="text-xs text-white/60 font-light">{step.time}</span>
                      )}
                    </div>
                    <p className={`text-xs font-light ${isActive ? "text-white/60" : "text-white/30"}`}>
                      {step.description}
                    </p>
                    {isCurrent && (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30 rounded-none text-[10px] px-2 py-0.5 font-light tracking-widest">
                        IN PROGRESS
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Order Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-light">Restaurant</span>
              <span className="font-semibold">{order.vendorName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-light">Order ID</span>
              <span className="font-semibold">{order?.orderId || params?.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-light">Payment</span>
              <span className="font-semibold">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60 font-light">Total Amount</span>
              <span className="font-semibold">₹{order.billDetails?.total || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
