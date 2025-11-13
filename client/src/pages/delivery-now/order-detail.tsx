import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Download,
  Phone,
  MapPin,
  Clock,
  Package,
  Star,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Order {
  id: string;
  vendorName: string;
  category: string;
  items: any;
  products: any[];
  status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timestamp: string;
  deliveryAddress: any;
  billDetails: any;
  orderId: string;
}

// Mock data - same as orders page
const generateMockOrders = (): Order[] => {
  return [
    {
      id: "1",
      vendorName: "The Great Punjab",
      category: "hotel-food",
      items: { "1": 2, "2": 1 },
      products: [
        { id: "1", name: "Butter Chicken", price: 350, isVeg: 0 },
        { id: "2", name: "Naan", price: 40, isVeg: 1 }
      ],
      status: "out_for_delivery",
      timestamp: new Date().toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "123 Main Street, Delhi", 
        city: "New Delhi",
        pincode: "110001",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 740, deliveryFee: 40, platformFee: 5, gst: 35, total: 820 },
      orderId: "FD123456"
    },
    {
      id: "2",
      vendorName: "QuickMart Express",
      category: "supermart",
      items: { "3": 3, "4": 2 },
      products: [
        { id: "3", name: "Milk 1L", price: 60 },
        { id: "4", name: "Bread", price: 40 }
      ],
      status: "delivered",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      deliveryAddress: { 
        name: "Office",
        address: "456 Park Avenue, Delhi", 
        city: "New Delhi",
        pincode: "110002",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 260, deliveryFee: 0, platformFee: 0, gst: 0, total: 260 },
      orderId: "SM789012"
    },
    {
      id: "3",
      vendorName: "HealthPlus Pharmacy",
      category: "medicine",
      items: { "5": 1 },
      products: [
        { id: "5", name: "Paracetamol Strip", price: 25 }
      ],
      status: "delivered",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "789 Health Street, Delhi", 
        city: "New Delhi",
        pincode: "110003",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 25, deliveryFee: 0, platformFee: 0, gst: 0, total: 25 },
      orderId: "MD345678"
    },
    {
      id: "4",
      vendorName: "Pizza Paradise",
      category: "hotel-food",
      items: { "6": 1 },
      products: [
        { id: "6", name: "Margherita Pizza", price: 299, isVeg: 1 }
      ],
      status: "confirmed",
      timestamp: new Date(Date.now() + 3600000).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "321 Food Plaza, Delhi", 
        city: "New Delhi",
        pincode: "110004",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 299, deliveryFee: 50, platformFee: 5, gst: 18, total: 372 },
      orderId: "FD901234"
    },
    {
      id: "5",
      vendorName: "TechZone",
      category: "electronics",
      items: { "7": 1 },
      products: [
        { id: "7", name: "Wireless Mouse", price: 599 }
      ],
      status: "cancelled",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      deliveryAddress: { 
        name: "Office",
        address: "555 Tech Street, Delhi", 
        city: "New Delhi",
        pincode: "110005",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 599, deliveryFee: 40, platformFee: 8, gst: 30, total: 677 },
      orderId: "EL567890"
    },
    {
      id: "SWG-001",
      vendorName: "Swiggy",
      category: "hotel-food",
      items: { "8": 1, "9": 2 },
      products: [
        { id: "8", name: "Chicken Biryani", price: 280, isVeg: 0 },
        { id: "9", name: "Raita", price: 40, isVeg: 1 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 11, 5).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 360, deliveryFee: 50, platformFee: 10, gst: 30, total: 450 },
      orderId: "SWG-001"
    },
    {
      id: "ZMT-001",
      vendorName: "Zomato",
      category: "hotel-food",
      items: { "10": 1, "11": 1 },
      products: [
        { id: "10", name: "Paneer Tikka", price: 320, isVeg: 1 },
        { id: "11", name: "Garlic Naan", price: 60, isVeg: 1 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 11, 3).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 380, deliveryFee: 40, platformFee: 15, gst: 45, total: 680 },
      orderId: "ZMT-001"
    },
    {
      id: "AMZ-001",
      vendorName: "Amazon Fresh",
      category: "supermart",
      items: { "12": 2, "13": 1, "14": 3 },
      products: [
        { id: "12", name: "Fresh Vegetables", price: 200 },
        { id: "13", name: "Fruits Pack", price: 350 },
        { id: "14", name: "Dairy Products", price: 150 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 10, 28).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 1200, deliveryFee: 0, platformFee: 20, gst: 30, total: 1250 },
      orderId: "AMZ-001"
    },
    {
      id: "BLK-001",
      vendorName: "Blinkit",
      category: "supermart",
      items: { "15": 2, "16": 1 },
      products: [
        { id: "15", name: "Chips Pack", price: 80 },
        { id: "16", name: "Cold Drink", price: 60 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 10, 25).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 220, deliveryFee: 50, platformFee: 20, gst: 30, total: 320 },
      orderId: "BLK-001"
    },
    {
      id: "DNZ-001",
      vendorName: "Dunzo",
      category: "supermart",
      items: { "17": 1 },
      products: [
        { id: "17", name: "Medicine Delivery", price: 150 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 10, 22).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 150, deliveryFee: 30, platformFee: 0, gst: 0, total: 180 },
      orderId: "DNZ-001"
    },
    {
      id: "BBK-001",
      vendorName: "BigBasket",
      category: "supermart",
      items: { "18": 1, "19": 2, "20": 1 },
      products: [
        { id: "18", name: "Rice 10kg", price: 800 },
        { id: "19", name: "Dal 1kg", price: 150 },
        { id: "20", name: "Oil 5L", price: 850 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 10, 20).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 1950, deliveryFee: 0, platformFee: 50, gst: 100, total: 2100 },
      orderId: "BBK-001"
    },
    {
      id: "SWG-002",
      vendorName: "Swiggy Instamart",
      category: "supermart",
      items: { "21": 2, "22": 1 },
      products: [
        { id: "21", name: "Snacks Pack", price: 120 },
        { id: "22", name: "Beverages", price: 180 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 10, 18).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 420, deliveryFee: 60, platformFee: 20, gst: 40, total: 540 },
      orderId: "SWG-002"
    },
    {
      id: "ZPT-001",
      vendorName: "Zepto",
      category: "supermart",
      items: { "23": 1, "24": 1 },
      products: [
        { id: "23", name: "Ice Cream", price: 120 },
        { id: "24", name: "Cookies", price: 80 }
      ],
      status: "delivered",
      timestamp: new Date(2024, 10, 15).toISOString(),
      deliveryAddress: { 
        name: "Home",
        address: "456 MG Road, Delhi", 
        city: "New Delhi",
        pincode: "110011",
        phone: "+91 98765 43210"
      },
      billDetails: { subtotal: 200, deliveryFee: 40, platformFee: 20, gst: 30, total: 290 },
      orderId: "ZPT-001"
    }
  ];
};

export default function DeliveryOrderDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [, params] = useRoute("/delivery-now/order/:id");
  const [order, setOrder] = useState<Order | null>(null);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const mockOrders = generateMockOrders();
    const foundOrder = mockOrders.find((o: any) => o.id === params?.id || o.orderId === params?.id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [params?.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Package className="h-12 w-12 text-white/40 mb-4" strokeWidth={1} />
      </div>
    );
  }

  const cartItems = Object.entries(order.items).map(([productId, quantity]) => {
    const product = order.products.find((p: any) => p.id === productId);
    return product ? { ...product, quantity } : null;
  }).filter(Boolean);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "preparing":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "out_for_delivery":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "delivered":
        return "bg-white/20 text-white border-white/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case "confirmed": return "CONFIRMED";
      case "preparing": return "PREPARING";
      case "out_for_delivery": return "OUT FOR DELIVERY";
      case "delivered": return "DELIVERED";
      case "cancelled": return "CANCELLED";
      default: return String(status).toUpperCase();
    }
  };

  const handleReorder = () => {
    const cartData = {
      vendorName: order.vendorName,
      category: order.category,
      items: order.items,
      products: order.products,
      type: 'vendor'
    };
    
    localStorage.setItem('deliveryCart', JSON.stringify(cartData));
    
    toast({
      title: "Items added to cart",
      description: `${order.vendorName} items have been added to your cart`,
    });
    
    navigate('/delivery-now/cart');
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Select at least 1 star to submit your review",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Review submitted!",
      description: `Thank you for rating ${order.vendorName}`,
    });
    
    setIsRatingDialogOpen(false);
    setRating(0);
    setRatingComment("");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
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
            <h1 className="text-sm font-bold tracking-wider uppercase">Order Details</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">ID: {order.orderId}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert("Download invoice")}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-download-invoice"
          >
            <Download className="h-4 w-4" strokeWidth={1} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Order Status */}
        <div className="mb-6 border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">
              {order.category === 'hotel-food' ? '🍔' :
               order.category === 'supermart' ? '🛒' :
               order.category === 'medicine' ? '💊' :
               order.category === 'electronics' ? '📱' : '📦'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{order.vendorName}</h2>
              <Badge className={`${getStatusColor(order.status)} rounded-none text-xs px-3 py-1 font-light tracking-widest mt-1`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-white/50 font-light">
            Ordered on {new Date(order.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Items */}
        <div className="mb-6 border border-white/10 bg-white/5 p-5">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Items Ordered
          </h3>
          <div className="space-y-3">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start pb-3 border-b border-white/10 last:border-0 last:pb-0">
                <div className="flex items-start gap-2 flex-1">
                  {item.isVeg !== undefined && (
                    <>
                      {item.isVeg === 1 ? (
                        <div className="w-4 h-4 border border-green-500 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-white/50 font-light">Quantity: {item.quantity}</p>
                    <p className="text-xs text-white/40 font-light">₹{item.price} each</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="mb-6 border border-white/10 bg-white/5 p-5">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Bill Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-light">
              <span className="text-white/60">Item Total</span>
              <span className="font-semibold">₹{order.billDetails?.subtotal || 0}</span>
            </div>
            {order.billDetails?.deliveryFee > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">Delivery Fee</span>
                <span className="font-semibold">₹{order.billDetails.deliveryFee}</span>
              </div>
            )}
            {order.billDetails?.platformFee > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">Platform Fee</span>
                <span className="font-semibold">₹{order.billDetails.platformFee}</span>
              </div>
            )}
            {order.billDetails?.gst > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">GST</span>
                <span className="font-semibold">₹{order.billDetails.gst}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between text-base">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold">₹{order.billDetails?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-6 border border-white/10 bg-white/5 p-5">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
            Delivery Address
          </h3>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-white/60 mt-0.5 shrink-0" strokeWidth={1} />
            <div>
              <p className="text-sm font-semibold mb-1">{order.deliveryAddress?.name}</p>
              <p className="text-xs text-white/60 font-light">{order.deliveryAddress?.address}</p>
              <p className="text-xs text-white/60 font-light">{order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</p>
              {order.deliveryAddress?.phone && (
                <div className="flex items-center gap-1 mt-2">
                  <Phone className="h-3 w-3 text-white/40" strokeWidth={1} />
                  <p className="text-xs text-white/60 font-light">{order.deliveryAddress.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-24">
          {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery') && (
            <Button
              variant="outline"
              onClick={() => navigate(`/delivery-now/track/${order.id}`)}
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-semibold tracking-wider"
              data-testid="button-track-order"
            >
              TRACK ORDER
            </Button>
          )}
          
          {order.status === 'delivered' && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleReorder}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-widest"
                data-testid="button-reorder"
              >
                REORDER
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRatingDialogOpen(true)}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-widest flex items-center justify-center gap-2"
                data-testid="button-rate-order"
              >
                <Star className="h-4 w-4" strokeWidth={1} />
                RATE ORDER
              </Button>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="border border-red-500/30 bg-red-500/10 p-4 text-center">
              <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" strokeWidth={1} />
              <p className="text-sm text-red-300 font-light">This order was cancelled</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
        <Button
          onClick={() => navigate("/delivery-now/orders")}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-semibold tracking-wider"
          data-testid="button-view-all-orders"
        >
          VIEW ALL ORDERS
        </Button>
      </div>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-wider">Rate Your Order</DialogTitle>
            <DialogDescription className="text-white/60 text-sm font-light">
              How was your experience with {order.vendorName}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-white/60 uppercase tracking-wider">Select Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-110"
                    data-testid={`star-${star}`}
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/30'
                      }`}
                      strokeWidth={1}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-white/80 font-light">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm text-white/60 uppercase tracking-wider">
                Comments (Optional)
              </label>
              <Textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your experience..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none min-h-[100px] resize-none focus:border-white/30"
                data-testid="input-rating-comment"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRatingDialogOpen(false);
                  setRating(0);
                  setRatingComment("");
                }}
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-11 font-light tracking-widest"
                data-testid="button-cancel-rating"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleSubmitRating}
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-11 font-semibold tracking-wider"
                data-testid="button-submit-rating"
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
