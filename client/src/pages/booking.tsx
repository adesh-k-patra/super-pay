import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { AnimatedGrid, AnimatedCard } from "@/components/ui/animated-content";
import { SlideUp } from "@/components/ui/page-transition";
import { 
  Hotel,
  Car,
  CalendarDays,
  Film,
  Train,
  Bus,
  Plane,
  Ticket,
  MapPin,
  ArrowRight,
  Package,
  CheckCircle,
  ChevronRight,
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Smartphone,
  Sparkles,
  Truck
} from "lucide-react";

interface BookingOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
}

export default function Booking() {
  const [, navigate] = useLocation();

  const bookingOptions: BookingOption[] = [
    {
      id: "hotel-food",
      title: "Hotel Food",
      description: "Order from restaurants",
      icon: UtensilsCrossed,
      route: "/delivery-now/hotel-food",
      gradient: "from-orange-500/10 to-orange-600/5"
    },
    {
      id: "medicine",
      title: "Medicine",
      description: "Quick pharmacy delivery",
      icon: Pill,
      route: "/delivery-now/medicine",
      gradient: "from-red-500/10 to-red-600/5"
    },
    {
      id: "supermart",
      title: "Supermart",
      description: "Groceries & essentials",
      icon: ShoppingCart,
      route: "/delivery-now/supermart",
      gradient: "from-green-500/10 to-green-600/5"
    },
    {
      id: "beauty",
      title: "Beauty",
      description: "Salon & spa services",
      icon: Sparkles,
      route: "/delivery-now/beauty",
      gradient: "from-pink-500/10 to-pink-600/5"
    },
    {
      id: "electronics",
      title: "Electronics",
      description: "Gadgets & accessories",
      icon: Smartphone,
      route: "/delivery-now/electronics",
      gradient: "from-blue-500/10 to-blue-600/5"
    },
    {
      id: "pick-drop",
      title: "Pick & Drop",
      description: "Courier & delivery",
      icon: Truck,
      route: "/delivery-now/courier",
      gradient: "from-purple-500/10 to-purple-600/5"
    },
    {
      id: "swapnow",
      title: "SwapNow",
      description: "Buy & sell used goods",
      icon: Package,
      route: "/swap-now/explore",
      gradient: "from-teal-500/10 to-teal-600/5"
    },
    {
      id: "hotel",
      title: "Hotel",
      description: "Book hotels & resorts",
      icon: Hotel,
      route: "/booking/hotel/search",
      gradient: "from-blue-500/10 to-blue-600/5"
    },
    {
      id: "rental",
      title: "Rental",
      description: "Car & bike rentals",
      icon: Car,
      route: "/booking/rental/search",
      gradient: "from-purple-500/10 to-purple-600/5"
    },
    {
      id: "event",
      title: "Event",
      description: "Concerts & shows",
      icon: CalendarDays,
      route: "/booking/event/search",
      gradient: "from-pink-500/10 to-pink-600/5"
    },
    {
      id: "movie",
      title: "Movie",
      description: "Cinema bookings",
      icon: Film,
      route: "/booking/movie/search",
      gradient: "from-red-500/10 to-red-600/5"
    },
    {
      id: "metro",
      title: "Metro",
      description: "Metro tickets",
      icon: Train,
      route: "/booking/metro/search",
      gradient: "from-green-500/10 to-green-600/5"
    },
    {
      id: "cab",
      title: "Cabs & Auto",
      description: "Book rides",
      icon: MapPin,
      route: "/booking/cab/search",
      gradient: "from-yellow-500/10 to-yellow-600/5"
    },
    {
      id: "flight",
      title: "Flight",
      description: "Domestic & international",
      icon: Plane,
      route: "/booking/flight/search",
      gradient: "from-cyan-500/10 to-cyan-600/5"
    },
    {
      id: "train",
      title: "Train",
      description: "Railway bookings",
      icon: Train,
      route: "/booking/train/search",
      gradient: "from-orange-500/10 to-orange-600/5"
    },
    {
      id: "bus",
      title: "Bus",
      description: "Bus tickets",
      icon: Bus,
      route: "/booking/bus/search",
      gradient: "from-indigo-500/10 to-indigo-600/5"
    }
  ];

  const pagination = usePagination({
    data: bookingOptions,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-center py-4 px-4 relative">
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Book Now</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Travel & Entertainment
            </p>
          </div>
          <Button
            onClick={() => navigate("/all-tickets")}
            variant="ghost"
            size="sm"
            className="absolute right-4 text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-my-trips"
          >
            <Ticket className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* All Booking Options */}
        <div className="mb-6">
          <SlideUp delay={0.2} className="mb-4">
            <h2 className="text-xs text-white/60 uppercase tracking-widest font-light">Individual Bookings</h2>
          </SlideUp>
          <AnimatedGrid className="grid grid-cols-3 gap-4" delay={0.3}>
            {pagination.paginatedData.map((option) => {
              const Icon = option.icon;
              return (
                <AnimatedCard key={option.id}>
                  <button
                    onClick={() => navigate(option.route)}
                    className="relative group overflow-hidden w-full h-full"
                    data-testid={`booking-option-${option.id}`}
                  >
                  {/* Background Layer with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:from-white/[0.12] group-hover:to-white/[0.04]"></div>
                  
                  {/* Colored Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                  
                  {/* Top Border Accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500"></div>
                  
                  {/* Side Glow Effect */}
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
                  
                  {/* Bottom Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 group-hover:bg-white/20 transition-all duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative p-8 flex flex-col items-center text-center">
                    {/* Icon Container with Advanced Styling */}
                    <div className="relative mb-5">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150"></div>
                      
                      {/* Icon Box */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
                        {/* Border */}
                        <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                        {/* Icon */}
                        <Icon className="relative h-8 w-8 text-white transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-light tracking-wide text-white uppercase transition-all duration-300 group-hover:text-white/90">
                        {option.title}
                      </h3>
                      <p className="text-[10px] text-white/50 font-light uppercase tracking-wider transition-all duration-300 group-hover:text-white/60">
                        {option.description}
                      </p>
                    </div>
                    
                    {/* Bottom Indicator Line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-full transition-all duration-500"></div>
                  </div>
                  </button>
                </AnimatedCard>
              );
            })}
          </AnimatedGrid>

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
        </div>

        {/* Trip Now Feature - Modern Silver Design */}
        <SlideUp delay={0.1} className="mb-6">
          <div 
            className="border-b border-white/10 cursor-pointer hover:border-white transition-all bg-white/5 hover:bg-white/10" 
            onClick={() => navigate("/trip-now")} 
            data-testid="trip-now-feature"
          >
            <div className="p-6 relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-white/60" strokeWidth={1} />
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Trip Now</h3>
                    <Badge className="bg-white/20 text-white border-white/30 rounded-none font-light text-[10px] px-2 py-0.5">
                      PREMIUM
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 font-light uppercase tracking-widest">End-to-End Travel Packages</p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="border border-white/10 p-3 bg-black/20">
                  <Plane className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                  <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Flights</p>
                </div>
                <div className="border border-white/10 p-3 bg-black/20">
                  <Hotel className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                  <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Hotels</p>
                </div>
                <div className="border border-white/10 p-3 bg-black/20">
                  <Car className="h-5 w-5 text-white/60 mb-2" strokeWidth={1} />
                  <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">Transfers</p>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-white/60 font-light">Complete travel planning in one place</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-white/60 font-light">Interactive timeline with editable components</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-white/40 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-white/60 font-light">One-click booking for entire trip</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-white font-light uppercase tracking-widest">Explore Packages</span>
                <ChevronRight className="h-4 w-4 text-white/40" strokeWidth={1} />
              </div>
            </div>
          </div>
        </SlideUp>

        {/* Quick Access Section */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="mb-4">
            <h2 className="text-xs text-white/60 uppercase tracking-widest font-light">Quick Access</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => navigate("/my-trips")}
              className="relative group overflow-hidden flex-shrink-0"
              data-testid="quick-my-trips"
            >
              {/* Background Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:from-white/[0.12] group-hover:to-white/[0.04]"></div>
              
              {/* Colored Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500"></div>
              
              {/* Side Glow Effect */}
              <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
              <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
              
              {/* Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 group-hover:bg-white/20 transition-all duration-500"></div>
              
              {/* Content */}
              <div className="relative px-6 py-4 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150"></div>
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                    <Ticket className="relative h-6 w-6 text-white transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-light text-white uppercase tracking-wider transition-all duration-300 group-hover:text-white/90">My Trips</p>
                  <p className="text-[10px] text-white/50 font-light transition-all duration-300 group-hover:text-white/60">View bookings</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="relative group overflow-hidden flex-shrink-0"
              data-testid="quick-profile"
            >
              {/* Background Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:from-white/[0.12] group-hover:to-white/[0.04]"></div>
              
              {/* Colored Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Top Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500"></div>
              
              {/* Side Glow Effect */}
              <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
              <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
              
              {/* Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 group-hover:bg-white/20 transition-all duration-500"></div>
              
              {/* Content */}
              <div className="relative px-6 py-4 flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150"></div>
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                    <MapPin className="relative h-6 w-6 text-white transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-light text-white uppercase tracking-wider transition-all duration-300 group-hover:text-white/90">Profile</p>
                  <p className="text-[10px] text-white/50 font-light transition-all duration-300 group-hover:text-white/60">Settings</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
