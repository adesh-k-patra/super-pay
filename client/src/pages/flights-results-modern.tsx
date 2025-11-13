import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plane,
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  class: string;
  availableSeats: number;
  departureDate: string;
}

const mockFlights: Flight[] = [
  {
    id: "1",
    airline: "Air India",
    airlineLogo: "🛫",
    flightNumber: "AI 101",
    from: "DEL",
    to: "BOM",
    departureTime: "06:00",
    arrivalTime: "08:15",
    duration: "2h 15m",
    stops: 0,
    price: 4500,
    class: "Economy",
    availableSeats: 45,
    departureDate: "2024-12-25"
  },
  {
    id: "2",
    airline: "IndiGo",
    airlineLogo: "🛩️",
    flightNumber: "6E 202",
    from: "DEL",
    to: "BOM",
    departureTime: "09:30",
    arrivalTime: "11:55",
    duration: "2h 25m",
    stops: 0,
    price: 3800,
    class: "Economy",
    availableSeats: 23,
    departureDate: "2024-12-25"
  },
  {
    id: "3",
    airline: "Vistara",
    airlineLogo: "✈️",
    flightNumber: "UK 303",
    from: "DEL",
    to: "BOM",
    departureTime: "14:15",
    arrivalTime: "16:30",
    duration: "2h 15m",
    stops: 0,
    price: 5200,
    class: "Economy",
    availableSeats: 67,
    departureDate: "2024-12-25"
  },
  {
    id: "4",
    airline: "SpiceJet",
    airlineLogo: "🛫",
    flightNumber: "SG 404",
    from: "DEL",
    to: "BOM",
    departureTime: "18:45",
    arrivalTime: "21:00",
    duration: "2h 15m",
    stops: 0,
    price: 3500,
    class: "Economy",
    availableSeats: 12,
    departureDate: "2024-12-25"
  },
  {
    id: "5",
    airline: "Air India",
    airlineLogo: "🛫",
    flightNumber: "AI 505",
    from: "DEL",
    to: "BOM",
    departureTime: "22:00",
    arrivalTime: "00:15",
    duration: "2h 15m",
    stops: 0,
    price: 4200,
    class: "Economy",
    availableSeats: 89,
    departureDate: "2024-12-25"
  },
  {
    id: "6",
    airline: "IndiGo",
    airlineLogo: "🛩️",
    flightNumber: "6E 606",
    from: "DEL",
    to: "BOM",
    departureTime: "11:30",
    arrivalTime: "15:45",
    duration: "4h 15m",
    stops: 1,
    price: 2800,
    class: "Economy",
    availableSeats: 34,
    departureDate: "2024-12-25"
  }
];

export default function FlightsResultsModern() {
  const [location, navigate] = useLocation();
  const [sortBy, setSortBy] = useState("price-low");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([2000, 10000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string[]>([]);

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  const searchParams = {
    from: params.get("from") || "DEL",
    to: params.get("to") || "BOM",
    departureDate: params.get("departureDate") || format(new Date(), "yyyy-MM-dd"),
    returnDate: params.get("returnDate"),
    adults: parseInt(params.get("adults") || "1"),
    children: parseInt(params.get("children") || "0"),
    infants: parseInt(params.get("infants") || "0"),
    class: params.get("class") || "economy",
    tripType: params.get("tripType") || "oneway"
  };

  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;

  // Get unique airlines
  const airlines = Array.from(new Set(mockFlights.map(f => f.airline)));

  // Apply filters
  const filteredFlights = mockFlights.filter(flight => {
    // Price filter
    if (flight.price < priceRange[0] || flight.price > priceRange[1]) return false;
    
    // Airline filter
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
    
    // Stops filter
    if (selectedStops.length > 0) {
      if (!selectedStops.includes(flight.stops.toString())) return false;
    }

    // Departure time filter
    if (departureTimeFilter.length > 0) {
      const hour = parseInt(flight.departureTime.split(':')[0]);
      let timeSlot = '';
      if (hour >= 0 && hour < 6) timeSlot = 'night';
      else if (hour >= 6 && hour < 12) timeSlot = 'morning';
      else if (hour >= 12 && hour < 18) timeSlot = 'afternoon';
      else timeSlot = 'evening';
      
      if (!departureTimeFilter.includes(timeSlot)) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      case "departure":
        return a.departureTime.localeCompare(b.departureTime);
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleAirline = (airline: string) => {
    setSelectedAirlines(prev =>
      prev.includes(airline)
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };

  const toggleStops = (stops: string) => {
    setSelectedStops(prev =>
      prev.includes(stops)
        ? prev.filter(s => s !== stops)
        : [...prev, stops]
    );
  };

  const toggleDepartureTime = (time: string) => {
    setDepartureTimeFilter(prev =>
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const clearFilters = () => {
    setPriceRange([2000, 10000]);
    setSelectedAirlines([]);
    setSelectedStops([]);
    setDepartureTimeFilter([]);
  };

  const activeFiltersCount = 
    (selectedAirlines.length > 0 ? 1 : 0) +
    (selectedStops.length > 0 ? 1 : 0) +
    (departureTimeFilter.length > 0 ? 1 : 0) +
    (priceRange[0] !== 2000 || priceRange[1] !== 10000 ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-light text-white tracking-wider uppercase">Price Range</h3>
          <span className="text-xs text-white/60">
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={1000}
          max={15000}
          step={100}
          className="w-full"
        />
      </div>

      {/* Airlines */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Airlines</h3>
        {airlines.map((airline) => (
          <div key={airline} className="flex items-center space-x-3">
            <Checkbox
              id={`airline-${airline}`}
              checked={selectedAirlines.includes(airline)}
              onCheckedChange={() => toggleAirline(airline)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label
              htmlFor={`airline-${airline}`}
              className="text-sm text-white/80 font-light cursor-pointer flex-1"
            >
              {airline}
            </label>
            <span className="text-xs text-white/60">
              {mockFlights.filter(f => f.airline === airline).length}
            </span>
          </div>
        ))}
      </div>

      {/* Stops */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Stops</h3>
        {[
          { value: "0", label: "Non-stop" },
          { value: "1", label: "1 Stop" },
          { value: "2", label: "2+ Stops" }
        ].map((stop) => (
          <div key={stop.value} className="flex items-center space-x-3">
            <Checkbox
              id={`stop-${stop.value}`}
              checked={selectedStops.includes(stop.value)}
              onCheckedChange={() => toggleStops(stop.value)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label
              htmlFor={`stop-${stop.value}`}
              className="text-sm text-white/80 font-light cursor-pointer flex-1"
            >
              {stop.label}
            </label>
            <span className="text-xs text-white/60">
              {mockFlights.filter(f => f.stops.toString() === stop.value || (stop.value === "2" && f.stops >= 2)).length}
            </span>
          </div>
        ))}
      </div>

      {/* Departure Time */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Departure Time</h3>
        {[
          { value: "morning", label: "Morning (6AM - 12PM)" },
          { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
          { value: "evening", label: "Evening (6PM - 12AM)" },
          { value: "night", label: "Night (12AM - 6AM)" }
        ].map((time) => (
          <div key={time.value} className="flex items-center space-x-3">
            <Checkbox
              id={`time-${time.value}`}
              checked={departureTimeFilter.includes(time.value)}
              onCheckedChange={() => toggleDepartureTime(time.value)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label
              htmlFor={`time-${time.value}`}
              className="text-sm text-white/80 font-light cursor-pointer"
            >
              {time.label}
            </label>
          </div>
        ))}
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
        >
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/flights/search")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-base font-bold tracking-wider">{searchParams.from} → {searchParams.to}</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''} • {searchParams.class}
              </p>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Search Summary */}
          <div className="flex items-center justify-center gap-6 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(searchParams.departureDate), "MMM dd")}
            </div>
            {searchParams.returnDate && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(searchParams.returnDate), "MMM dd")}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-32 px-4 space-y-4 w-full max-w-screen-lg mx-auto">
        {/* Filter & Sort Bar */}
        <div className="flex gap-3">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-none font-light tracking-wider relative"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-white text-black border-0 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black border-white/20 w-80">
              <SheetHeader>
                <SheetTitle className="text-white font-light tracking-wider uppercase">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger 
              className="flex-1 border-white/20 text-white rounded-none font-light"
              data-testid="select-sort"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="departure">Departure Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-4">
          <p className="text-sm text-white/80 font-light">
            {sortedFlights.length} flight{sortedFlights.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Flight Cards */}
        {sortedFlights.length > 0 ? (
          <div className="space-y-4">
            {sortedFlights.map((flight) => (
              <div
                key={flight.id}
                className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:border-white/40 transition-all cursor-pointer"
                onClick={() => navigate(`/flights/seat-selection?flightId=${flight.id}`)}
                data-testid={`card-flight-${flight.id}`}
              >
                <div className="p-6 space-y-4">
                  {/* Airline & Flight Number */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{flight.airlineLogo}</div>
                      <div>
                        <h3 className="font-light text-lg text-white tracking-wider">{flight.airline}</h3>
                        <p className="text-xs text-white/50">{flight.flightNumber}</p>
                      </div>
                    </div>
                    {flight.stops === 0 && (
                      <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                        Non-stop
                      </Badge>
                    )}
                  </div>

                  {/* Flight Times */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-3xl font-light text-white">{flight.departureTime}</p>
                      <p className="text-white/60 text-sm mt-1">{flight.from}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs text-white/40 mb-1">{flight.duration}</p>
                      <div className="w-full h-px bg-white/20 relative">
                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white/40 rotate-90" />
                      </div>
                      {flight.stops > 0 && (
                        <p className="text-xs text-white/40 mt-1">{flight.stops} stop{flight.stops !== 1 ? 's' : ''}</p>
                      )}
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-3xl font-light text-white">{flight.arrivalTime}</p>
                      <p className="text-white/60 text-sm mt-1">{flight.to}</p>
                    </div>
                  </div>

                  {/* Price & Select */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Price per passenger</p>
                      <p className="text-2xl font-light text-white">{formatCurrency(flight.price)}</p>
                    </div>
                    <Button
                      className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                      data-testid={`button-select-${flight.id}`}
                    >
                      Select <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-4 text-xs text-white/40 pt-2">
                    <span>{flight.availableSeats} seats left</span>
                    <span>•</span>
                    <span>Refundable</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-12 text-center">
            <Plane className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-light text-white mb-2">No Flights Found</h3>
            <p className="text-white/60 font-light">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
