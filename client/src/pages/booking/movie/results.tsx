import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Film,
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Calendar,
  MapPin,
  ChevronRight,
  Star,
  Users
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface MovieShow {
  id: string;
  theater: string;
  showTime: string;
  price: number;
  availableSeats: number;
  format: string;
  language: string;
  rating: number;
  date: string;
  amenities: string[];
}

export default function MovieResults() {
  const [location, navigate] = useLocation();
  const [sortBy, setSortBy] = useState("price-low");
  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState([100, 500]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const params = new URLSearchParams(window.location.search);
  const searchParams = {
    movie: params.get("movie") || "",
    city: params.get("city") || "DEL",
    date: params.get("date") || format(new Date(), "yyyy-MM-dd"),
    tickets: parseInt(params.get("tickets") || "1"),
    showTime: params.get("showTime") || "any"
  };

  const [selectedDate, setSelectedDate] = useState(searchParams.date);

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const { allShows, dateTabs, theaters, formats, languages } = useMemo(() => {
    const generateShowsForDate = (date: string): MovieShow[] => {
      const dateHash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const baseShows = [
        { theater: "PVR Cinemas - Saket", showTime: "10:00 AM", basePrice: 250, format: "2D", language: "Hindi", rating: 4.5, amenities: ["Dolby Atmos", "Recliner Seats"] },
        { theater: "INOX Megaplex - Gurgaon", showTime: "1:30 PM", basePrice: 300, format: "3D", language: "Hindi", rating: 4.3, amenities: ["IMAX", "Premium Seating"] },
        { theater: "Cinepolis - Noida", showTime: "4:00 PM", basePrice: 220, format: "2D", language: "English", rating: 4.2, amenities: ["Dolby Atmos"] },
        { theater: "PVR Cinemas - Connaught Place", showTime: "6:30 PM", basePrice: 280, format: "4DX", language: "Hindi", rating: 4.6, amenities: ["4DX Experience", "Premium Audio"] },
        { theater: "Carnival Cinemas - Dwarka", showTime: "11:30 AM", basePrice: 180, format: "2D", language: "Hindi", rating: 4.0, amenities: ["Standard Seating"] },
        { theater: "PVR Cinemas - Select Citywalk", showTime: "2:00 PM", basePrice: 350, format: "IMAX", language: "English", rating: 4.8, amenities: ["IMAX", "Luxury Recliners"] },
        { theater: "INOX - Nehru Place", showTime: "9:00 PM", basePrice: 420, format: "2D", language: "Hindi", rating: 4.1, amenities: ["Comfortable Seating"] },
        { theater: "Fun Cinemas - Lajpat Nagar", showTime: "5:30 PM", basePrice: 550, format: "2D", language: "Hindi", rating: 3.9, amenities: ["Basic Facilities"] },
      ];

      return baseShows.map((show, idx) => ({
        ...show,
        id: `${date}-${idx}`,
        date,
        price: Math.round(show.basePrice + (seededRandom(dateHash + idx) * 100 - 50)),
        availableSeats: Math.floor(seededRandom(dateHash + idx + 1000) * 150) + 50
      }));
    };

    const baseDate = new Date(searchParams.date);
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

    const shows = dates.flatMap(dateTab => generateShowsForDate(dateTab.date));

    const datesWithPrices = dates.map(dateTab => {
      const dateShows = shows.filter(s => s.date === dateTab.date);
      const minPrice = dateShows.length > 0 ? Math.min(...dateShows.map(s => s.price)) : 0;
      return { ...dateTab, price: minPrice };
    });

    const uniqueTheaters = Array.from(new Set(shows.map(s => s.theater)));
    const uniqueFormats = Array.from(new Set(shows.map(s => s.format)));
    const uniqueLanguages = Array.from(new Set(shows.map(s => s.language)));

    return {
      allShows: shows,
      dateTabs: datesWithPrices,
      theaters: uniqueTheaters,
      formats: uniqueFormats,
      languages: uniqueLanguages
    };
  }, [searchParams.date]);

  const filteredShows = useMemo(() => allShows.filter(show => {
    if (show.date !== selectedDate) return false;
    if (show.price < priceRange[0] || show.price > priceRange[1]) return false;
    if (selectedFormats.length > 0 && !selectedFormats.includes(show.format)) return false;
    if (selectedLanguages.length > 0 && !selectedLanguages.includes(show.language)) return false;
    
    if (selectedTimes.length > 0) {
      const hour = parseInt(show.showTime.split(':')[0]);
      const isPM = show.showTime.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
      
      let timeSlot = '';
      if (hour24 >= 0 && hour24 < 12) timeSlot = 'morning';
      else if (hour24 >= 12 && hour24 < 16) timeSlot = 'afternoon';
      else if (hour24 >= 16 && hour24 < 20) timeSlot = 'evening';
      else timeSlot = 'night';
      
      if (!selectedTimes.includes(timeSlot)) return false;
    }

    return true;
  }), [allShows, selectedDate, priceRange, selectedFormats, selectedLanguages, selectedTimes]);

  const sortedShows = useMemo(() => [...filteredShows].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "time": return a.showTime.localeCompare(b.showTime);
      case "rating": return b.rating - a.rating;
      default: return 0;
    }
  }), [filteredShows, sortBy]);

  const pagination = usePagination({
    data: sortedShows,
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

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const clearFilters = () => {
    setPriceRange([100, 500]);
    setSelectedFormats([]);
    setSelectedLanguages([]);
    setSelectedTimes([]);
  };

  const activeFiltersCount =
    (selectedFormats.length > 0 ? 1 : 0) +
    (selectedLanguages.length > 0 ? 1 : 0) +
    (selectedTimes.length > 0 ? 1 : 0) +
    (priceRange[0] !== 100 || priceRange[1] !== 500 ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
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
          max={600}
          step={50}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Format</h3>
        {formats.map((format) => (
          <div key={format} className="flex items-center space-x-3">
            <Checkbox
              id={`format-${format}`}
              checked={selectedFormats.includes(format)}
              onCheckedChange={() => toggleFormat(format)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label htmlFor={`format-${format}`} className="text-sm text-white/80 font-light cursor-pointer flex-1">
              {format}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Language</h3>
        {languages.map((lang) => (
          <div key={lang} className="flex items-center space-x-3">
            <Checkbox
              id={`lang-${lang}`}
              checked={selectedLanguages.includes(lang)}
              onCheckedChange={() => toggleLanguage(lang)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label htmlFor={`lang-${lang}`} className="text-sm text-white/80 font-light cursor-pointer flex-1">
              {lang}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-light text-white tracking-wider uppercase">Show Time</h3>
        {[
          { value: "morning", label: "Morning (Before 12 PM)" },
          { value: "afternoon", label: "Afternoon (12-4 PM)" },
          { value: "evening", label: "Evening (4-8 PM)" },
          { value: "night", label: "Night (After 8 PM)" }
        ].map((time) => (
          <div key={time.value} className="flex items-center space-x-3">
            <Checkbox
              id={`time-${time.value}`}
              checked={selectedTimes.includes(time.value)}
              onCheckedChange={() => toggleTime(time.value)}
              className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label htmlFor={`time-${time.value}`} className="text-sm text-white/80 font-light cursor-pointer flex-1">
              {time.label}
            </label>
          </div>
        ))}
      </div>

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
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/movie/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider">MOVIE SHOWS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {searchParams.tickets} Ticket{searchParams.tickets !== 1 ? 's' : ''}
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
            <SheetContent side="right" className="w-full sm:max-w-md bg-black border-white/20 text-white overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-white text-lg font-light tracking-wider">FILTERS</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Selected Movie and Location */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center justify-between gap-3">
            <button 
              onClick={() => navigate("/booking/movie/search")}
              className="flex items-center gap-3 flex-1 hover:bg-white/5 p-2 -ml-2 rounded transition-all"
              data-testid="button-change-movie"
            >
              <Film className="h-5 w-5 text-white/60" />
              <div className="text-left">
                <div className="text-sm font-medium text-white" data-testid="text-selected-movie">
                  {searchParams.movie || "Select Movie"}
                </div>
                <div className="text-xs text-white/40">Tap to change</div>
              </div>
            </button>
            <button
              onClick={() => navigate("/booking/movie/search")}
              className="flex items-center gap-2 hover:bg-white/5 p-2 rounded transition-all"
              data-testid="button-change-city"
            >
              <MapPin className="h-4 w-4 text-white/60" />
              <div className="text-left">
                <span className="text-sm text-white/80" data-testid="text-selected-city">
                  {searchParams.city === "DEL" ? "Delhi" : searchParams.city}
                </span>
                <div className="text-xs text-white/40">Change</div>
              </div>
            </button>
          </div>
        </div>

        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {dateTabs.map((dateTab) => (
              <button
                key={dateTab.date}
                onClick={() => setSelectedDate(dateTab.date)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 border-b-2 transition-all min-w-[80px]",
                  selectedDate === dateTab.date
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/30"
                )}
                data-testid={`date-${dateTab.date}`}
              >
                <span className={cn(
                  "text-[10px] uppercase tracking-wider",
                  selectedDate === dateTab.date ? "text-white" : "text-white/60"
                )}>
                  {dateTab.day}
                </span>
                <span className={cn(
                  "text-lg font-light",
                  selectedDate === dateTab.date ? "text-white" : "text-white/60"
                )}>
                  {dateTab.dayNum}
                </span>
                <span className={cn(
                  "text-[10px]",
                  selectedDate === dateTab.date ? "text-white/80" : "text-white/40"
                )}>
                  {formatCurrency(dateTab.price)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10">
          <span className="text-xs text-white/60 uppercase tracking-wider">{sortedShows.length} Shows</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto h-8 text-xs bg-transparent border-white/20 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="price-low" className="text-white">Price: Low to High</SelectItem>
              <SelectItem value="price-high" className="text-white">Price: High to Low</SelectItem>
              <SelectItem value="time" className="text-white">Show Time</SelectItem>
              <SelectItem value="rating" className="text-white">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-[280px] px-4 space-y-3">
        {pagination.paginatedData.map((show) => (
          <button
            key={show.id}
            onClick={() => navigate(`/booking/movie/${show.date}/${searchParams.movie}?showtimeId=${show.id}`)}
            className="w-full text-left border border-white/30 hover:border-white/50 hover:bg-white/5 transition-all p-4 rounded-lg"
            data-testid={`show-${show.id}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-light text-white mb-1">{show.theater}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">{show.format}</Badge>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">{show.language}</Badge>
                  <span className="text-xs text-white/60">★ {show.rating}</span>
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-xl font-light text-white">{formatCurrency(show.price)}</p>
                <p className="text-[10px] text-white/60 uppercase">per ticket</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {show.showTime}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {show.availableSeats} seats
              </span>
            </div>

            {show.amenities.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {show.amenities.map((amenity, idx) => (
                  <span key={idx} className="text-[10px] text-white/40 uppercase tracking-wider">
                    {amenity}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}

        {sortedShows.length > 0 && (
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
