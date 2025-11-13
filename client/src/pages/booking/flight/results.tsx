import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plane,
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  ChevronRight,
  Zap,
  Award,
  GraduationCap,
  Briefcase,
  Tag,
  Star
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Flight {
  id: string;
  airline: string;
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
  hasOffer: boolean;
  studentDiscount: boolean;
  businessDiscount: boolean;
  rating: number;
}

export default function FlightResults() {
  const [location, navigate] = useLocation();
  const [sortBy, setSortBy] = useState("price-low");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState([2000, 10000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string[]>([]);
  const [studentDiscountOnly, setStudentDiscountOnly] = useState(false);
  const [businessDiscountOnly, setBusinessDiscountOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);

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

  const [selectedDate, setSelectedDate] = useState(searchParams.departureDate);
  const totalPassengers = searchParams.adults + searchParams.children + searchParams.infants;

  // Seeded random function for consistent prices
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Memoized flight generation - generates once and stays stable
  const { allFlights, dateTabs, airlines } = useMemo(() => {
    // Generate flights for a specific date
    const generateFlightsForDate = (date: string): Flight[] => {
      const dateHash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const baseFlights = [
        {
          id: `${date}-1`,
          airline: "Air India",
          flightNumber: "AI 101",
          departureTime: "06:00",
          arrivalTime: "08:15",
          duration: "2h 15m",
          stops: 0,
          basePrice: 4500,
          hasOffer: true,
          studentDiscount: true,
          businessDiscount: false,
          rating: 4.5,
          availableSeats: 45
        },
        {
          id: `${date}-2`,
          airline: "IndiGo",
          flightNumber: "6E 202",
          departureTime: "09:30",
          arrivalTime: "11:55",
          duration: "2h 25m",
          stops: 0,
          basePrice: 3800,
          hasOffer: false,
          studentDiscount: true,
          businessDiscount: true,
          rating: 4.2,
          availableSeats: 23
        },
        {
          id: `${date}-3`,
          airline: "Vistara",
          flightNumber: "UK 303",
          departureTime: "14:15",
          arrivalTime: "16:30",
          duration: "2h 15m",
          stops: 0,
          basePrice: 5200,
          hasOffer: true,
          studentDiscount: false,
          businessDiscount: false,
          rating: 4.7,
          availableSeats: 67
        },
        {
          id: `${date}-4`,
          airline: "SpiceJet",
          flightNumber: "SG 404",
          departureTime: "18:45",
          arrivalTime: "21:00",
          duration: "2h 15m",
          stops: 0,
          basePrice: 3500,
          hasOffer: false,
          studentDiscount: false,
          businessDiscount: true,
          rating: 4.0,
          availableSeats: 12
        },
        {
          id: `${date}-5`,
          airline: "Air India",
          flightNumber: "AI 505",
          departureTime: "22:00",
          arrivalTime: "00:15",
          duration: "2h 15m",
          stops: 0,
          basePrice: 4200,
          hasOffer: true,
          studentDiscount: true,
          businessDiscount: true,
          rating: 4.3,
          availableSeats: 89
        },
        {
          id: `${date}-6`,
          airline: "IndiGo",
          flightNumber: "6E 606",
          departureTime: "11:30",
          arrivalTime: "15:45",
          duration: "4h 15m",
          stops: 1,
          basePrice: 2800,
          hasOffer: false,
          studentDiscount: true,
          businessDiscount: false,
          rating: 4.1,
          availableSeats: 34
        },
      ];

      return baseFlights.map((flight, idx) => ({
        ...flight,
        from: searchParams.from,
        to: searchParams.to,
        class: searchParams.class,
        departureDate: date,
        // Use seeded random for consistent prices based on date
        price: Math.round(flight.basePrice + (seededRandom(dateHash + idx) * 500 - 250))
      }));
    };

    // Generate date calendar data
    const baseDate = new Date(searchParams.departureDate);
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = i === 0 ? baseDate : (i < 0 ? subDays(baseDate, Math.abs(i)) : addDays(baseDate, i));
      const dateStr = format(date, "yyyy-MM-dd");
      dates.push({
        date: dateStr,
        day: format(date, "EEE"),
        dayNum: format(date, "dd"),
      });
    }

    // Generate all flights for all dates
    const flights = dates.flatMap(dateTab => generateFlightsForDate(dateTab.date));

    // Add min price to date tabs from generated flights
    const datesWithPrices = dates.map(dateTab => {
      const dateFlights = flights.filter(f => f.departureDate === dateTab.date);
      const minPrice = dateFlights.length > 0 ? Math.min(...dateFlights.map(f => f.price)) : 0;
      return {
        ...dateTab,
        price: minPrice
      };
    });

    // Get unique airlines
    const uniqueAirlines = Array.from(new Set(flights.map(f => f.airline)));

    return {
      allFlights: flights,
      dateTabs: datesWithPrices,
      airlines: uniqueAirlines
    };
  }, [searchParams.from, searchParams.to, searchParams.departureDate, searchParams.class]);

  // Apply filters
  const filteredFlights = useMemo(() => allFlights.filter(flight => {
    // Date filter - only show flights for selected date
    if (flight.departureDate !== selectedDate) return false;

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

    // Student discount filter
    if (studentDiscountOnly && !flight.studentDiscount) return false;

    // Business discount filter
    if (businessDiscountOnly && !flight.businessDiscount) return false;

    // Offers filter
    if (offersOnly && !flight.hasOffer) return false;

    return true;
  }), [allFlights, selectedDate, priceRange, selectedAirlines, selectedStops, departureTimeFilter, studentDiscountOnly, businessDiscountOnly, offersOnly]);

  // Apply sorting
  const sortedFlights = useMemo(() => [...filteredFlights].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      case "departure":
        return a.departureTime.localeCompare(b.departureTime);
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  }), [filteredFlights, sortBy]);

  const pagination = usePagination({
    data: sortedFlights,
    itemsPerPage: 10,
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
    setStudentDiscountOnly(false);
    setBusinessDiscountOnly(false);
    setOffersOnly(false);
  };

  const activeFiltersCount =
    (selectedAirlines.length > 0 ? 1 : 0) +
    (selectedStops.length > 0 ? 1 : 0) +
    (departureTimeFilter.length > 0 ? 1 : 0) +
    (priceRange[0] !== 2000 || priceRange[1] !== 10000 ? 1 : 0) +
    (studentDiscountOnly ? 1 : 0) +
    (businessDiscountOnly ? 1 : 0) +
    (offersOnly ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Quick Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Quick Filters</h3>
        
        <div className="flex items-center space-x-3">
          <Checkbox
            id="offers-only"
            checked={offersOnly}
            onCheckedChange={(checked) => setOffersOnly(checked as boolean)}
            className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label htmlFor="offers-only" className="text-sm text-white/80 font-light cursor-pointer flex items-center gap-2">
            <Tag className="h-3 w-3" />
            Offers & Deals Only
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="student-discount"
            checked={studentDiscountOnly}
            onCheckedChange={(checked) => setStudentDiscountOnly(checked as boolean)}
            className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label htmlFor="student-discount" className="text-sm text-white/80 font-light cursor-pointer flex items-center gap-2">
            <GraduationCap className="h-3 w-3" />
            Student ID Discount
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="business-discount"
            checked={businessDiscountOnly}
            onCheckedChange={(checked) => setBusinessDiscountOnly(checked as boolean)}
            className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label htmlFor="business-discount" className="text-sm text-white/80 font-light cursor-pointer flex items-center gap-2">
            <Briefcase className="h-3 w-3" />
            Business ID Discount
          </label>
        </div>
      </div>

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
              {allFlights.filter(f => f.airline === airline).length}
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
          </div>
        ))}
      </div>

      {/* Departure Time */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Departure Time</h3>
        {[
          { value: "morning", label: "Morning (6 AM - 12 PM)" },
          { value: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
          { value: "evening", label: "Evening (6 PM - 12 AM)" },
          { value: "night", label: "Night (12 AM - 6 AM)" }
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
              className="text-sm text-white/80 font-light cursor-pointer flex-1"
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
          className="w-full border-white/20 text-white hover:bg-white/10 rounded-none"
          data-testid="button-clear-filters"
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
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/flight/search")}
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
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none relative"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="h-5 w-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/20 w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-white font-light tracking-wider uppercase text-lg">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Date Calendar Tap Bar */}
        <div className="border-t border-white/10 overflow-x-auto">
          <div className="flex gap-2 px-4 py-3">
            {dateTabs.map((dateTab) => (
              <button
                key={dateTab.date}
                onClick={() => setSelectedDate(dateTab.date)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 border transition-all rounded-none min-w-[80px]",
                  selectedDate === dateTab.date
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid={`button-date-${dateTab.date}`}
              >
                <div className="text-center">
                  <div className="text-xs font-light uppercase tracking-wider">{dateTab.day}</div>
                  <div className="text-lg font-light">{dateTab.dayNum}</div>
                  <div className="text-xs text-white/60 font-light mt-1">₹{dateTab.price}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-44 px-4 space-y-4">
        {/* Sort & Filter Bar */}
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/20 text-white rounded-none" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="duration">Shortest Duration</SelectItem>
              <SelectItem value="departure">Earliest Departure</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-white/60 font-light">
            {sortedFlights.length} Flight{sortedFlights.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Flights List */}
        <div className="space-y-3">
          {pagination.paginatedData.map((flight) => (
            <div
              key={flight.id}
              onClick={() => navigate(`/booking/flight/${flight.id}`)}
              className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/40 transition-all cursor-pointer p-4"
              data-testid={`card-flight-${flight.id}`}
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                {flight.hasOffer && (
                  <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none">
                    <Tag className="h-3 w-3 mr-1" />
                    OFFER
                  </Badge>
                )}
                {flight.studentDiscount && (
                  <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    STUDENT
                  </Badge>
                )}
                {flight.businessDiscount && (
                  <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none">
                    <Briefcase className="h-3 w-3 mr-1" />
                    BUSINESS
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  {/* Airline */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-sm font-light text-white">{flight.airline}</div>
                    <div className="text-xs text-white/60 font-light">{flight.flightNumber}</div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-3 w-3 text-white/60" fill="currentColor" />
                      <span className="text-xs text-white/60 font-light">{flight.rating}</span>
                    </div>
                  </div>

                  {/* Time & Route */}
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-2xl font-light text-white">{flight.departureTime}</div>
                      <div className="text-xs text-white/60 font-light">{flight.from}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-white/60 font-light mb-1">{flight.duration}</div>
                      <div className="w-full h-px bg-white/20 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2">
                          <Plane className="h-3 w-3 text-white/60 rotate-90" />
                        </div>
                      </div>
                      <div className="text-xs text-white/60 font-light mt-1">
                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    <div>
                      <div className="text-2xl font-light text-white">{flight.arrivalTime}</div>
                      <div className="text-xs text-white/60 font-light">{flight.to}</div>
                    </div>
                  </div>

                  {/* Seats Available */}
                  {flight.availableSeats <= 20 && (
                    <div className="text-xs text-white/60 font-light mt-2">
                      Only {flight.availableSeats} seats left
                    </div>
                  )}
                </div>

                {/* Price & Book */}
                <div className="text-right">
                  <div className="text-2xl font-light text-white mb-1">{formatCurrency(flight.price)}</div>
                  <div className="text-xs text-white/60 font-light mb-3">per person</div>
                  <Button
                    className="bg-white text-black hover:bg-white/90 rounded-none h-8 text-xs tracking-wider font-light"
                    data-testid={`button-book-${flight.id}`}
                  >
                    BOOK
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {sortedFlights.length > 0 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              className="mt-6"
            />
          )}
        </div>

        {sortedFlights.length === 0 && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-12 text-center">
            <Plane className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <div className="text-lg font-light text-white mb-2">NO FLIGHTS FOUND</div>
            <div className="text-sm text-white/60 font-light mb-4">Try adjusting your filters</div>
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearFilters}
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-clear-filters-empty"
              >
                CLEAR ALL FILTERS
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
