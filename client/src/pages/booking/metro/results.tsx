import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Train,
  ArrowLeft,
  Clock,
  MapPin,
  TrendingUp,
  Ticket,
  ArrowRight,
  Zap,
  Star
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface MetroRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  line: string;
  duration: string;
  stops: number;
  fare: number;
  type: 'route' | 'pass';
  express?: boolean;
  rating?: number;
}

const mockRoutes: MetroRoute[] = [
  {
    id: "1",
    name: "Direct Route",
    from: "Rajiv Chowk",
    to: "Huda City Center",
    line: "Yellow Line",
    duration: "35 min",
    stops: 15,
    fare: 50,
    type: 'route',
    rating: 4.8
  },
  {
    id: "2",
    name: "Express Route",
    from: "Rajiv Chowk",
    to: "Huda City Center",
    line: "Yellow Line",
    duration: "28 min",
    stops: 8,
    fare: 65,
    type: 'route',
    express: true,
    rating: 4.9
  }
];

const featuredPasses = [
  { id: "pass-1", name: "Day Pass", validity: "24 hours", fare: 200, description: "Unlimited travel" },
  { id: "pass-2", name: "Week Pass", validity: "7 days", fare: 800, description: "Unlimited travel" },
  { id: "pass-3", name: "Month Pass", validity: "30 days", fare: 2500, description: "Unlimited travel" }
];

export default function MetroResults() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  
  const from = params.get("from") || "Rajiv Chowk";
  const to = params.get("to") || "Huda City Center";
  const initialDate = params.get("date") || format(new Date(), "yyyy-MM-dd");
  const passengers = parseInt(params.get("passengers") || "1");

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [routeFilter, setRouteFilter] = useState("all");

  const generateDateTabs = () => {
    const baseDate = new Date(initialDate);
    const dates = [];
    for (let i = 0; i <= 6; i++) {
      const date = addDays(baseDate, i);
      dates.push({
        date: format(date, "yyyy-MM-dd"),
        day: format(date, "EEE"),
        dayNum: format(date, "dd"),
        month: format(date, "MMM")
      });
    }
    return dates;
  };

  const dateTabs = generateDateTabs();

  const filteredRoutes = mockRoutes.filter(route => {
    if (routeFilter === "express") return route.express;
    if (routeFilter === "direct") return !route.express;
    return true;
  });

  const pagination = usePagination({
    data: filteredRoutes,
    itemsPerPage: 10,
  });

  const handleSelectRoute = (routeId: string) => {
    navigate(`/booking/metro/${selectedDate}/${routeId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/metro/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Available Routes</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {from} → {to}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-4 w-full max-w-screen-lg mx-auto">
        {/* Date Selection Tab Bar */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {dateTabs.map((dateTab) => (
              <button
                key={dateTab.date}
                onClick={() => setSelectedDate(dateTab.date)}
                className={cn(
                  "flex-shrink-0 px-4 py-3 border transition-all rounded-none min-w-[80px]",
                  selectedDate === dateTab.date
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid={`button-date-${dateTab.date}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-light">{dateTab.day}</span>
                  <span className="text-xl font-light">{dateTab.dayNum}</span>
                  <span className="text-[10px] uppercase tracking-wider font-light">{dateTab.month}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Route Filter Tabs */}
        <Tabs value={routeFilter} onValueChange={setRouteFilter} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-all-routes"
            >
              All Routes
            </TabsTrigger>
            <TabsTrigger 
              value="express" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-express-routes"
            >
              Express
            </TabsTrigger>
            <TabsTrigger 
              value="direct" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-direct-routes"
            >
              Direct
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Featured Passes - Cardless Design */}
        <div className="border-b-2 border-white/20 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-white" />
            <h3 className="text-sm font-light tracking-wider text-white uppercase">Featured Passes</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {featuredPasses.map((pass) => (
              <button
                key={pass.id}
                onClick={() => handleSelectRoute(pass.id)}
                className="p-4 border border-white/20 hover:border-white/40 transition-all bg-white/5 hover:bg-white/10"
                data-testid={`pass-${pass.id}`}
              >
                <div className="text-center space-y-2">
                  <Ticket className="h-6 w-6 text-white/60 mx-auto" />
                  <p className="text-xs font-light text-white">{pass.name}</p>
                  <p className="text-lg font-light text-white">{formatCurrency(pass.fare)}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">{pass.validity}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Metro Routes List - Card Based */}
        {pagination.paginatedData.map((route) => (
          <div
            key={route.id}
            onClick={() => handleSelectRoute(route.id)}
            className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 hover:border-white/40 transition-all cursor-pointer"
            data-testid={`route-card-${route.id}`}
          >
            <div className="space-y-4">
              {/* Route Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-light text-white tracking-wider">{route.name}</h3>
                    {route.express && (
                      <Badge className="bg-white/20 text-white border-white/30 rounded-none font-light text-[10px] px-2 py-0.5">
                        <Zap className="h-3 w-3 mr-1" />
                        EXPRESS
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-light">{route.line}</p>
                  {route.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white/60">{route.rating}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{formatCurrency(route.fare * passengers)}</p>
                  <p className="text-xs text-white/60 font-light">{passengers} {passengers === 1 ? 'passenger' : 'passengers'}</p>
                </div>
              </div>

              {/* Route Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">{route.from}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{route.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">{route.to}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Train className="h-4 w-4" />
                  <span className="text-xs">{route.stops} stops</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none text-xs font-light">
                  <Train className="h-3 w-3 mr-1" />
                  Metro Rail
                </Badge>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRoute(route.id);
                  }}
                  className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider text-sm uppercase"
                  data-testid={`button-book-${route.id}`}
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredRoutes.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6 mb-6"
          />
        )}
      </div>
    </div>
  );
}
