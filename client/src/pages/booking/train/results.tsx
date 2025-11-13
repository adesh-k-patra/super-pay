import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Train,
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  Wifi,
  Coffee,
  Shield,
  Search,
  X
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface TrainClass {
  class: string;
  available: number;
  price: number;
  waitlist?: number;
}

interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[];
  classes: TrainClass[];
  departureDate: string;
  hasFood: boolean;
  hasPantry: boolean;
  rating: number;
}

export default function TrainResults() {
  const [location, navigate] = useLocation();
  const [sortBy, setSortBy] = useState("departure");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [priceRange, setPriceRange] = useState([200, 3000]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [hasFood, setHasFood] = useState(false);

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  const searchParams = {
    from: params.get("from") || "NDLS",
    to: params.get("to") || "CSMT",
    departureDate: params.get("departureDate") || format(new Date(), "yyyy-MM-dd"),
    classes: params.get("classes") || "All"
  };

  const [selectedDate, setSelectedDate] = useState(searchParams.departureDate);

  // Seeded random function
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate trains data
  const { allTrains, dateTabs, trainClasses } = useMemo(() => {
    const generateTrainsForDate = (date: string): Train[] => {
      const dateHash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const baseTrains = [
        {
          trainNumber: "12951",
          trainName: "Mumbai Rajdhani",
          departureTime: "16:55",
          arrivalTime: "08:35",
          duration: "15h 40m",
          runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          hasFood: true,
          hasPantry: true,
          rating: 4.5,
        },
        {
          trainNumber: "12301",
          trainName: "Howrah Rajdhani",
          departureTime: "17:00",
          arrivalTime: "10:05",
          duration: "17h 05m",
          runsOn: ["Mon", "Wed", "Fri", "Sun"],
          hasFood: true,
          hasPantry: true,
          rating: 4.6,
        },
        {
          trainNumber: "12423",
          trainName: "Dibrugarh Rajdhani",
          departureTime: "14:50",
          arrivalTime: "11:00",
          duration: "20h 10m",
          runsOn: ["Tue", "Thu", "Sat"],
          hasFood: true,
          hasPantry: true,
          rating: 4.4,
        },
        {
          trainNumber: "12217",
          trainName: "Sampark Kranti",
          departureTime: "06:15",
          arrivalTime: "21:20",
          duration: "15h 05m",
          runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          hasFood: true,
          hasPantry: false,
          rating: 4.2,
        },
        {
          trainNumber: "12263",
          trainName: "Duronto Express",
          departureTime: "22:20",
          arrivalTime: "14:15",
          duration: "15h 55m",
          runsOn: ["Mon", "Wed", "Fri"],
          hasFood: true,
          hasPantry: true,
          rating: 4.7,
        },
        {
          trainNumber: "12137",
          trainName: "Punjab Mail",
          departureTime: "19:40",
          arrivalTime: "12:20",
          duration: "16h 40m",
          runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          hasFood: false,
          hasPantry: true,
          rating: 4.0,
        },
      ];

      // Define class prices based on train type
      const getClassesForTrain = (trainNumber: string, dateHash: number, idx: number) => {
        const basePrices: { [key: string]: number } = {
          "1A": 2500,
          "2A": 1500,
          "3A": 1000,
          "SL": 400,
          "CC": 800,
          "2S": 200,
          "3E": 850
        };

        const availableClasses = trainNumber.includes("Rajdhani") || trainNumber.includes("Duronto")
          ? ["1A", "2A", "3A"]
          : trainNumber.includes("Express")
          ? ["2A", "3A", "SL", "CC"]
          : ["2A", "3A", "SL", "2S", "3E"];

        return availableClasses.map(cls => {
          const variance = seededRandom(dateHash + idx + cls.charCodeAt(0)) * 200 - 100;
          const price = Math.round(basePrices[cls] + variance);
          const available = Math.floor(seededRandom(dateHash + idx + cls.charCodeAt(1)) * 100);
          const waitlist = available === 0 ? Math.floor(seededRandom(dateHash + idx + cls.charCodeAt(2)) * 50) : 0;

          return {
            class: cls,
            available,
            price,
            ...(waitlist > 0 && { waitlist })
          };
        });
      };

      return baseTrains.map((train, idx) => ({
        id: `${date}-${train.trainNumber}`,
        ...train,
        from: searchParams.from,
        to: searchParams.to,
        departureDate: date,
        classes: getClassesForTrain(train.trainNumber, dateHash, idx)
      }));
    };

    // Generate date tabs
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

    // Generate all trains
    const trains = dates.flatMap(dateTab => generateTrainsForDate(dateTab.date));

    // Calculate min prices for date tabs
    const datesWithPrices = dates.map(dateTab => {
      const dateTrains = trains.filter(t => t.departureDate === dateTab.date);
      const minPrice = dateTrains.length > 0
        ? Math.min(...dateTrains.flatMap(t => t.classes.map(c => c.price)))
        : 0;
      return {
        ...dateTab,
        price: minPrice
      };
    });

    // Get unique classes
    const uniqueClasses = Array.from(new Set(trains.flatMap(t => t.classes.map(c => c.class))));

    return {
      allTrains: trains,
      dateTabs: datesWithPrices,
      trainClasses: uniqueClasses
    };
  }, [searchParams.from, searchParams.to, searchParams.departureDate]);

  // Apply filters
  const filteredTrains = useMemo(() => allTrains.filter(train => {
    // Date filter
    if (train.departureDate !== selectedDate) return false;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = train.trainName.toLowerCase().includes(query);
      const matchesNumber = train.trainNumber.toLowerCase().includes(query);
      if (!matchesName && !matchesNumber) return false;
    }

    // Get min price from available classes
    const minPrice = Math.min(...train.classes.map(c => c.price));
    const maxPrice = Math.max(...train.classes.map(c => c.price));
    if (maxPrice < priceRange[0] || minPrice > priceRange[1]) return false;

    // Class filter
    if (selectedClasses.length > 0) {
      const hasSelectedClass = train.classes.some(c => selectedClasses.includes(c.class));
      if (!hasSelectedClass) return false;
    }

    // Departure time filter
    if (departureTimeFilter.length > 0) {
      const hour = parseInt(train.departureTime.split(':')[0]);
      let timeSlot = '';
      if (hour >= 0 && hour < 6) timeSlot = 'night';
      else if (hour >= 6 && hour < 12) timeSlot = 'morning';
      else if (hour >= 12 && hour < 18) timeSlot = 'afternoon';
      else timeSlot = 'evening';

      if (!departureTimeFilter.includes(timeSlot)) return false;
    }

    // Availability filter
    if (onlyAvailable) {
      const hasAvailableSeats = train.classes.some(c => c.available > 0);
      if (!hasAvailableSeats) return false;
    }

    // Food filter
    if (hasFood && !train.hasFood) return false;

    return true;
  }), [allTrains, selectedDate, searchQuery, priceRange, selectedClasses, departureTimeFilter, onlyAvailable, hasFood]);

  // Apply sorting
  const sortedTrains = useMemo(() => [...filteredTrains].sort((a, b) => {
    switch (sortBy) {
      case "departure":
        return a.departureTime.localeCompare(b.departureTime);
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      case "price-low":
        const minA = Math.min(...a.classes.map(c => c.price));
        const minB = Math.min(...b.classes.map(c => c.price));
        return minA - minB;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  }), [filteredTrains, sortBy]);

  const pagination = usePagination({
    data: sortedTrains,
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

  const toggleClass = (trainClass: string) => {
    setSelectedClasses(prev =>
      prev.includes(trainClass)
        ? prev.filter(c => c !== trainClass)
        : [...prev, trainClass]
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
    setPriceRange([200, 3000]);
    setSelectedClasses([]);
    setDepartureTimeFilter([]);
    setOnlyAvailable(false);
    setHasFood(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const activeFiltersCount =
    (selectedClasses.length > 0 ? 1 : 0) +
    (departureTimeFilter.length > 0 ? 1 : 0) +
    (priceRange[0] !== 200 || priceRange[1] !== 3000 ? 1 : 0) +
    (onlyAvailable ? 1 : 0) +
    (hasFood ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Quick Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Quick Filters</h3>
        
        <div className="flex items-center space-x-3">
          <Checkbox
            id="only-available"
            checked={onlyAvailable}
            onCheckedChange={(checked) => setOnlyAvailable(checked as boolean)}
            className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label htmlFor="only-available" className="text-sm text-white/80 font-light cursor-pointer flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Available Seats Only
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="has-food"
            checked={hasFood}
            onCheckedChange={(checked) => setHasFood(checked as boolean)}
            className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label htmlFor="has-food" className="text-sm text-white/80 font-light cursor-pointer flex items-center gap-2">
            <Coffee className="h-3 w-3" />
            Food Available
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
          min={100}
          max={5000}
          step={100}
          className="w-full"
        />
      </div>

      {/* Classes */}
      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Classes</h3>
        {trainClasses.map((trainClass) => (
          <div key={trainClass} className="flex items-center space-x-3">
            <Checkbox
              id={`class-${trainClass}`}
              checked={selectedClasses.includes(trainClass)}
              onCheckedChange={() => toggleClass(trainClass)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label
              htmlFor={`class-${trainClass}`}
              className="text-sm text-white/80 font-light cursor-pointer flex-1"
            >
              {trainClass}
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
            onClick={() => navigate("/booking/train/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider">{searchParams.from} → {searchParams.to}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {format(new Date(selectedDate), 'dd MMM yyyy')}
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

      <div className="pt-52 px-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by train name or number..."
            className="pl-10 pr-10 bg-white/5 border-white/20 text-white rounded-none placeholder:text-white/40 h-12"
            data-testid="input-search-trains"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              data-testid="button-clear-search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Sort Bar */}
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/20 text-white rounded-none" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="departure">Earliest Departure</SelectItem>
              <SelectItem value="duration">Shortest Duration</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-white/60 font-light">
            {sortedTrains.length} Train{sortedTrains.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Trains List */}
        <div className="space-y-3">
          {pagination.paginatedData.map((train) => (
            <div
              key={train.id}
              onClick={() => navigate(`/booking/train/classes?trainId=${train.id}&trainNumber=${train.trainNumber}&trainName=${encodeURIComponent(train.trainName)}&from=${searchParams.from}&to=${searchParams.to}&departureDate=${selectedDate}&departureTime=${train.departureTime}&arrivalTime=${train.arrivalTime}&duration=${train.duration}`)}
              className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/40 transition-all cursor-pointer p-4"
              data-testid={`card-train-${train.id}`}
            >
              {/* Train Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-light text-white">{train.trainName}</span>
                    {train.hasFood && (
                      <Coffee className="h-3 w-3 text-white/60" />
                    )}
                    {train.hasPantry && (
                      <Shield className="h-3 w-3 text-white/60" />
                    )}
                  </div>
                  <div className="text-xs text-white/60 font-light">{train.trainNumber}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-white/60" fill="currentColor" />
                  <span className="text-xs text-white/60 font-light">{train.rating}</span>
                </div>
              </div>

              {/* Time & Duration */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-light text-white">{train.departureTime}</p>
                  <p className="text-xs text-white/60">{searchParams.from}</p>
                </div>
                <div className="flex-1 mx-4 flex flex-col items-center">
                  <div className="text-xs text-white/60 mb-1">{train.duration}</div>
                  <div className="w-full h-px bg-white/20 relative">
                    <Train className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  </div>
                  <div className="text-xs text-white/60 mt-1">Direct</div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{train.arrivalTime}</p>
                  <p className="text-xs text-white/60">{searchParams.to}</p>
                </div>
              </div>

              {/* Classes Available */}
              <div className="border-t border-white/10 pt-3">
                <div className="flex flex-wrap gap-2">
                  {train.classes.map((cls) => (
                    <div
                      key={cls.class}
                      className={cn(
                        "px-3 py-1.5 border rounded-none text-xs font-light",
                        cls.available > 0
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cls.class}</span>
                        <span className="text-white/60">|</span>
                        <span className="font-light">{formatCurrency(cls.price)}</span>
                        <span className="text-white/60">|</span>
                        <span className={cls.available > 0 ? "text-green-400" : "text-red-400"}>
                          {cls.available > 0 ? `${cls.available} Avl` : cls.waitlist ? `WL ${cls.waitlist}` : "Full"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {sortedTrains.length > 0 && (
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

          {sortedTrains.length === 0 && (
            <div className="text-center py-12">
              <Train className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-light">No trains found for your search</p>
              <p className="text-white/40 text-sm font-light mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
