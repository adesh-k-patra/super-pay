import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { AnimatedGrid, AnimatedCard } from "@/components/ui/animated-content";
import { SlideUp } from "@/components/ui/page-transition";
import { 
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Laptop,
  Sparkles,
  PawPrint,
  Home,
  ArrowLeft,
  ShoppingBag,
  Package,
  Receipt,
  Truck,
  Heart
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: any;
  description: string;
  gradient: string;
}

export default function FoodDeliveryCategories() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const categories: Category[] = [
    {
      id: "1",
      name: "Hotel Food",
      slug: "hotel-food",
      icon: UtensilsCrossed,
      description: "Restaurants & dining",
      gradient: "from-orange-500/10 to-red-600/5"
    },
    {
      id: "2",
      name: "Supermart",
      slug: "supermart",
      icon: ShoppingCart,
      description: "Groceries in 10 min",
      gradient: "from-green-500/10 to-emerald-600/5"
    },
    {
      id: "3",
      name: "Medicine",
      slug: "medicine",
      icon: Pill,
      description: "Pharmacy & healthcare",
      gradient: "from-blue-500/10 to-cyan-600/5"
    },
    {
      id: "4",
      name: "Electronics",
      slug: "electronics",
      icon: Laptop,
      description: "Gadgets & accessories",
      gradient: "from-purple-500/10 to-indigo-600/5"
    },
    {
      id: "5",
      name: "Beauty",
      slug: "beauty",
      icon: Sparkles,
      description: "Cosmetics & wellness",
      gradient: "from-pink-500/10 to-rose-600/5"
    },
    {
      id: "6",
      name: "Pet Supplies",
      slug: "pet",
      icon: PawPrint,
      description: "For your furry friends",
      gradient: "from-yellow-500/10 to-amber-600/5"
    },
    {
      id: "7",
      name: "Home & Kitchen",
      slug: "home",
      icon: Home,
      description: "Home essentials",
      gradient: "from-cyan-500/10 to-teal-600/5"
    },
    {
      id: "8",
      name: "Pick & Drop",
      slug: "courier",
      icon: Truck,
      description: "Courier delivery",
      gradient: "from-slate-500/10 to-slate-600/5"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-center py-4 px-4 relative">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Deliver Now</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Fast & Convenient
            </p>
          </div>
          <div className="absolute right-4 flex items-center gap-2">
            <Button
              onClick={() => navigate("/delivery-now/wishlist")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate("/delivery-now/orders")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-orders"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* All Delivery Categories */}
        <div className="mb-6">
          <SlideUp delay={0.2} className="mb-4">
            <h2 className="text-xs text-white/60 uppercase tracking-widest font-light">All Categories</h2>
          </SlideUp>
          <AnimatedGrid className="grid grid-cols-3 gap-4" delay={0.3}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <AnimatedCard key={category.id}>
                  <button
                    onClick={() => {
                      if (category.slug === "courier") {
                        navigate("/booking/courier/search");
                      } else {
                        navigate(`/delivery-now/${category.slug}`);
                      }
                    }}
                    className="relative group overflow-hidden w-full h-full"
                    data-testid={`category-option-${category.id}`}
                  >
                  {/* Background Layer with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:from-white/[0.12] group-hover:to-white/[0.04]"></div>
                  
                  {/* Colored Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                  
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
                        {category.name}
                      </h3>
                      <p className="text-[10px] text-white/50 font-light uppercase tracking-wider transition-all duration-300 group-hover:text-white/60">
                        {category.description}
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
        </div>

        {/* Quick Access Section */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="mb-4">
            <h2 className="text-xs text-white/60 uppercase tracking-widest font-light">Quick Access</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => navigate("/delivery-now/orders")}
              className="relative group overflow-hidden flex-shrink-0"
              data-testid="quick-orders"
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
                    <Package className="relative h-6 w-6 text-white transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-light text-white uppercase tracking-wider transition-all duration-300 group-hover:text-white/90">My Orders</p>
                  <p className="text-[10px] text-white/50 font-light transition-all duration-300 group-hover:text-white/60">View history</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/transaction-history")}
              className="relative group overflow-hidden flex-shrink-0"
              data-testid="quick-transaction"
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
                    <Receipt className="relative h-6 w-6 text-white transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-light text-white uppercase tracking-wider transition-all duration-300 group-hover:text-white/90">Transaction</p>
                  <p className="text-[10px] text-white/50 font-light transition-all duration-300 group-hover:text-white/60">View history</p>
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
