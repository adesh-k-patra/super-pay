import { useState } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Search,
  MapPin,
  ShoppingBag,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

type OrderCategory = 'all' | 'hotel-food' | 'supermart' | 'medicine' | 'electronics' | 'beauty' | 'pet' | 'home';
type OrderStatusType = 'all' | 'upcoming' | 'completed' | 'cancelled';

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

// Mock data generator
const generateMockOrders = (): Order[] => {
  return [
    {
      id: "1",
      vendorName: "The Great Punjab",
      category: "hotel-food",
      items: { "1": 2, "2": 1 },
      products: [
        { id: "1", name: "Butter Chicken", price: 350 },
        { id: "2", name: "Naan", price: 40 }
      ],
      status: "out_for_delivery",
      timestamp: new Date().toISOString(),
      deliveryAddress: { address: "123 Main Street, Delhi", pincode: "110001" },
      billDetails: { subtotal: 740, deliveryFee: 40, total: 780 },
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
      deliveryAddress: { address: "456 Park Avenue, Delhi", pincode: "110002" },
      billDetails: { subtotal: 260, deliveryFee: 0, total: 260 },
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
      deliveryAddress: { address: "789 Health Street, Delhi", pincode: "110003" },
      billDetails: { subtotal: 25, deliveryFee: 0, total: 25 },
      orderId: "MD345678"
    },
    {
      id: "4",
      vendorName: "Pizza Paradise",
      category: "hotel-food",
      items: { "6": 1 },
      products: [
        { id: "6", name: "Margherita Pizza", price: 299 }
      ],
      status: "confirmed",
      timestamp: new Date(Date.now() + 3600000).toISOString(),
      deliveryAddress: { address: "321 Food Plaza, Delhi", pincode: "110004" },
      billDetails: { subtotal: 299, deliveryFee: 50, total: 349 },
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
      deliveryAddress: { address: "555 Tech Street, Delhi", pincode: "110005" },
      billDetails: { subtotal: 599, deliveryFee: 40, total: 639 },
      orderId: "EL567890"
    },
    {
      id: "6",
      vendorName: "GlowStore",
      category: "beauty",
      items: { "8": 2 },
      products: [
        { id: "8", name: "Moisturizer", price: 450 }
      ],
      status: "delivered",
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      deliveryAddress: { address: "888 Beauty Lane, Delhi", pincode: "110006" },
      billDetails: { subtotal: 900, deliveryFee: 0, total: 900 },
      orderId: "BT123456"
    },
    {
      id: "7",
      vendorName: "PetCare Plus",
      category: "pet",
      items: { "9": 1 },
      products: [
        { id: "9", name: "Dog Food 5kg", price: 1200 }
      ],
      status: "out_for_delivery",
      timestamp: new Date().toISOString(),
      deliveryAddress: { address: "999 Pet Street, Delhi", pincode: "110007" },
      billDetails: { subtotal: 1200, deliveryFee: 0, total: 1200 },
      orderId: "PT789012"
    },
    {
      id: "8",
      vendorName: "HomeEssentials",
      category: "home",
      items: { "10": 3 },
      products: [
        { id: "10", name: "Towel Set", price: 800 }
      ],
      status: "confirmed",
      timestamp: new Date(Date.now() + 7200000).toISOString(),
      deliveryAddress: { address: "111 Home Avenue, Delhi", pincode: "110008" },
      billDetails: { subtotal: 2400, deliveryFee: 50, total: 2450 },
      orderId: "HM345678"
    }
  ];
};

export default function DeliveryOrders() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  
  // Get category from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') as OrderCategory;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<OrderCategory>(
    categoryParam && ['all', 'hotel-food', 'supermart', 'medicine', 'electronics', 'beauty', 'pet', 'home'].includes(categoryParam) 
      ? categoryParam 
      : "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>("all");
  const [orders] = useState<Order[]>(generateMockOrders());

  const getStatusBadge = (status: Order['status']) => {
    switch(status) {
      case 'confirmed':
      case 'preparing':
      case 'out_for_delivery':
        return <Badge className="bg-green-500/10 text-green-400 border-green-400/20 rounded-none text-[10px]">UPCOMING</Badge>;
      case 'delivered':
        return <Badge className="bg-white/10 text-white/40 border-white/20 rounded-none text-[10px]">COMPLETED</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30 rounded-none text-[10px]">CANCELLED</Badge>;
    }
  };

  const getOrderStatusType = (order: Order): OrderStatusType => {
    if (order.status === 'delivered') return 'completed';
    if (order.status === 'cancelled') return 'cancelled';
    return 'upcoming';
  };

  const getCategoryEmoji = (category: string) => {
    switch(category) {
      case 'hotel-food': return '🍔';
      case 'supermart': return '🛒';
      case 'medicine': return '💊';
      case 'electronics': return '📱';
      case 'beauty': return '💄';
      case 'pet': return '🐾';
      case 'home': return '🏠';
      default: return '📦';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesCategory = selectedCategory === 'all' || order.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || getOrderStatusType(order) === selectedStatus;
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const pagination = usePagination({
    data: filteredOrders,
    itemsPerPage: 10,
  });

  // Stats by category
  const categoryStats = {
    all: orders.length,
    'hotel-food': orders.filter(o => o.category === 'hotel-food').length,
    'supermart': orders.filter(o => o.category === 'supermart').length,
    'medicine': orders.filter(o => o.category === 'medicine').length,
    'electronics': orders.filter(o => o.category === 'electronics').length,
    'beauty': orders.filter(o => o.category === 'beauty').length,
    'pet': orders.filter(o => o.category === 'pet').length,
    'home': orders.filter(o => o.category === 'home').length,
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const cartItems = Object.entries(order.items).map(([productId, quantity]) => {
      const product = order.products.find((p: any) => p.id === productId);
      return product ? { ...product, quantity } : null;
    }).filter(Boolean);

    return (
      <button
        onClick={() => navigate(`/delivery-now/order/${order.id}`)}
        className="w-full p-0 border border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left overflow-hidden group"
        data-testid={`order-${order.id}`}
      >
        <div className="flex flex-col gap-3 p-4">
          {/* Header Zone */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-2xl flex-shrink-0">
                {getCategoryEmoji(order.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold tracking-wide text-base text-white/90 truncate">
                  {order.vendorName}
                </h3>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-lg text-white leading-tight" data-testid={`text-price-${order.id}`}>
                ₹{order.billDetails?.total?.toLocaleString() || 0}
              </p>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-wider mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Middle Zone - Order Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="font-light">
                {format(new Date(order.timestamp), "dd MMM yyyy")} • {format(new Date(order.timestamp), "HH:mm")}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {cartItems.map((item: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 text-[11px] text-white/60 font-light"
                >
                  {item.name} <span className="ml-1 text-white/40">×{item.quantity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Zone */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            {order.deliveryAddress && (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <MapPin className="h-3 w-3 text-white/30 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-white/40 font-light truncate">
                  {order.deliveryAddress.address}
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-white/30 font-light uppercase tracking-wider">
                {order.orderId}
              </span>
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold tracking-wider">MY ORDERS</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-status-filter"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-white/20 text-white" align="end">
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("all")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("upcoming")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Upcoming
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("completed")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("cancelled")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
            <Input
              type="text"
              placeholder="SEARCH ORDERS"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 placeholder:text-xs placeholder:tracking-widest placeholder:font-light focus:border-white/30 rounded-none h-10"
              data-testid="input-search-orders"
            />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="pt-24">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as OrderCategory)} className="px-0">
          <div className="sticky top-[110px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 overflow-x-auto">
            <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto">
              <TabsTrigger 
                value="all" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-all"
              >
                <span className="text-lg">📋</span>
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger 
                value="hotel-food" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-hotel-food"
              >
                <span className="text-lg">🍔</span>
                <span>Hotel Food</span>
              </TabsTrigger>
              <TabsTrigger 
                value="supermart" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-supermart"
              >
                <span className="text-lg">🛒</span>
                <span>Supermart</span>
              </TabsTrigger>
              <TabsTrigger 
                value="medicine" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-medicine"
              >
                <span className="text-lg">💊</span>
                <span>Medicine</span>
              </TabsTrigger>
              <TabsTrigger 
                value="electronics" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-electronics"
              >
                <span className="text-lg">📱</span>
                <span>Electronics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="beauty" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-beauty"
              >
                <span className="text-lg">💄</span>
                <span>Beauty</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pet" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-pet"
              >
                <span className="text-lg">🐾</span>
                <span>Pet</span>
              </TabsTrigger>
              <TabsTrigger 
                value="home" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-home"
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-8 px-4">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-white/10 bg-white/5">
                <ShoppingBag className="h-16 w-16 text-white/20 mb-4" strokeWidth={1} />
                <h2 className="text-lg font-bold mb-2 tracking-wide">No orders found</h2>
                <p className="text-white/60 text-center mb-6 text-sm font-light">
                  {searchTerm ? `No results for "${searchTerm}"` : "Start ordering to see your order history"}
                </p>
                <Button 
                  onClick={() => navigate("/delivery-now")} 
                  className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 font-semibold tracking-wider text-xs" 
                  data-testid="button-browse-now"
                >
                  BROWSE NOW
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {pagination.paginatedData.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>

                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                  canGoNext={pagination.canGoNext}
                  canGoPrevious={pagination.canGoPrevious}
                  startIndex={pagination.startIndex}
                  endIndex={pagination.endIndex}
                  totalItems={pagination.totalItems}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
