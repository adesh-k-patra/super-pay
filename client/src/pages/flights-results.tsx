import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Plane, 
  Clock, 
  ArrowRight, 
  Calendar,
  Filter,
  Search,
  Star,
  Zap,
  Coffee,
  Shield
} from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  stops: number;
  class: string;
  amenities: string[];
  rating: number;
}

const SAMPLE_FLIGHTS: Flight[] = [
  {
    id: "1",
    airline: "IndiGo",
    flightNumber: "6E 2345",
    from: "Delhi",
    to: "Mumbai",
    fromCode: "DEL",
    toCode: "BOM",
    departTime: "06:00",
    arriveTime: "08:15",
    duration: "2h 15m",
    price: 3499,
    stops: 0,
    class: "Economy",
    amenities: ["WiFi", "Meal"],
    rating: 4.5,
  },
  {
    id: "2",
    airline: "Air India",
    flightNumber: "AI 860",
    from: "Delhi",
    to: "Mumbai",
    fromCode: "DEL",
    toCode: "BOM",
    departTime: "09:30",
    arriveTime: "11:50",
    duration: "2h 20m",
    price: 4299,
    stops: 0,
    class: "Economy",
    amenities: ["WiFi", "Meal", "Lounge"],
    rating: 4.7,
  },
  {
    id: "3",
    airline: "SpiceJet",
    flightNumber: "SG 8156",
    from: "Delhi",
    to: "Mumbai",
    fromCode: "DEL",
    toCode: "BOM",
    departTime: "12:45",
    arriveTime: "15:00",
    duration: "2h 15m",
    price: 2999,
    stops: 0,
    class: "Economy",
    amenities: ["Meal"],
    rating: 4.2,
  },
  {
    id: "4",
    airline: "Vistara",
    flightNumber: "UK 995",
    from: "Delhi",
    to: "Mumbai",
    fromCode: "DEL",
    toCode: "BOM",
    departTime: "16:20",
    arriveTime: "18:35",
    duration: "2h 15m",
    price: 4899,
    stops: 0,
    class: "Economy",
    amenities: ["WiFi", "Meal", "Lounge", "Extra Legroom"],
    rating: 4.8,
  },
  {
    id: "5",
    airline: "AirAsia",
    flightNumber: "I5 764",
    from: "Delhi",
    to: "Mumbai",
    fromCode: "DEL",
    toCode: "BOM",
    departTime: "19:00",
    arriveTime: "21:20",
    duration: "2h 20m",
    price: 2699,
    stops: 0,
    class: "Economy",
    amenities: [],
    rating: 4.0,
  },
];

export default function FlightsResults() {
  const [location, navigate] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departDate = searchParams.get('departDate') || '';
  const passengers = searchParams.get('passengers') || '1';
  const flightClass = searchParams.get('class') || 'Economy';
  
  const [flights, setFlights] = useState<Flight[]>(SAMPLE_FLIGHTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [filterStops, setFilterStops] = useState("all");

  useEffect(() => {
    let filtered = [...SAMPLE_FLIGHTS];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(flight => 
        flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Stops filter
    if (filterStops === "nonstop") {
      filtered = filtered.filter(flight => flight.stops === 0);
    } else if (filterStops === "onestop") {
      filtered = filtered.filter(flight => flight.stops === 1);
    }
    
    // Sort
    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "duration") {
      filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "departure") {
      filtered.sort((a, b) => a.departTime.localeCompare(b.departTime));
    }
    
    setFlights(filtered);
  }, [searchQuery, sortBy, filterStops]);

  const pagination = usePagination({
    data: flights,
    itemsPerPage: 10,
  });

  const handleFlightSelect = (flightId: string) => {
    navigate(`/flights/details/${flightId}?from=${from}&to=${to}&date=${departDate}&passengers=${passengers}&class=${flightClass}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/flights/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{from} → {to}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{departDate} • {passengers} {passengers === "1" ? "Passenger" : "Passengers"}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="fixed top-[65px] left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 p-3 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search airline or flight number..."
              className="bg-white/5 border-white/10 text-white rounded-none pl-10"
              data-testid="input-search-flights"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white rounded-none text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              <SelectItem value="price">Sort: Price</SelectItem>
              <SelectItem value="duration">Sort: Duration</SelectItem>
              <SelectItem value="rating">Sort: Rating</SelectItem>
              <SelectItem value="departure">Sort: Departure</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStops} onValueChange={setFilterStops}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white rounded-none text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              <SelectItem value="all">All Flights</SelectItem>
              <SelectItem value="nonstop">Non-stop</SelectItem>
              <SelectItem value="onestop">1 Stop</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[175px] px-4 space-y-3">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/60 font-light">
            {flights.length} {flights.length === 1 ? 'flight' : 'flights'} available
          </p>
          <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-xs">
            {flightClass}
          </Badge>
        </div>

        {/* Flights List */}
        {flights.length === 0 ? (
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-8 text-center">
            <Plane className="h-12 w-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60 font-light">No flights found</p>
            <p className="text-xs text-white/40 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          pagination.paginatedData.map((flight) => (
            <button
              key={flight.id}
              onClick={() => handleFlightSelect(flight.id)}
              className="w-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all"
              data-testid={`flight-${flight.id}`}
            >
              <CardContent className="p-4">
                {/* Airline & Flight Number */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center">
                      <Plane className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-light text-white">{flight.airline}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-white/60 font-light">{flight.rating}</span>
                  </div>
                </div>

                {/* Flight Times */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-left">
                    <p className="text-lg font-light text-white">{flight.departTime}</p>
                    <p className="text-xs text-white/50">{flight.fromCode}</p>
                  </div>
                  
                  <div className="flex-1 mx-4 text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{flight.duration}</p>
                    <div className="flex items-center">
                      <div className="h-px flex-1 bg-white/20"></div>
                      <Plane className="h-3 w-3 text-white/40 mx-2" />
                      <div className="h-px flex-1 bg-white/20"></div>
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-light text-white">{flight.arriveTime}</p>
                    <p className="text-xs text-white/50">{flight.toCode}</p>
                  </div>
                </div>

                {/* Amenities */}
                {flight.amenities.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {flight.amenities.map((amenity, idx) => (
                      <Badge key={idx} className="bg-white/5 text-white/70 border-white/10 rounded-none text-[10px] font-light">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-light">Starting from</p>
                  <div className="text-right">
                    <p className="text-xl font-light text-white">₹{flight.price.toLocaleString()}</p>
                    <p className="text-[10px] text-white/40">per person</p>
                  </div>
                </div>
              </CardContent>
            </button>
          ))
        )}

        {flights.length > 0 && (
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
