import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Plane,
  Bus,
  Train,
  ArrowLeftRight,
  Calendar as CalendarIcon,
  Users,
  Search,
  Clock,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Utensils,
  AirVent,
  ChevronRight,
  Filter
} from "lucide-react";

// Mock data as fallback
const mockSearchResults = {
  flights: [
    {
      id: "FL001",
      operator: "IndiGo",
      operatorLogo: "🛩️",
      routeNumber: "6E-234",
      departure: "06:00",
      arrival: "08:30",
      duration: "2h 30m",
      price: 4500,
      originalPrice: 5200,
      seatClass: "Economy",
      amenities: ["wifi", "meals", "entertainment"],
      rating: 4.2,
      stops: "Non-stop",
      baggage: "15kg",
      refundable: true,
      availableSeats: 12,
      serviceType: "flight",
      fromLocation: "Mumbai",
      toLocation: "Delhi",
      departureDate: new Date().toISOString().split('T')[0]
    }
  ],
  buses: [
    {
      id: "BUS001",
      operator: "VRL Travels",
      operatorLogo: "🚌",
      routeNumber: "VRL-502",
      departure: "22:30",
      arrival: "06:00+1",
      duration: "7h 30m",
      price: 850,
      originalPrice: 900,
      seatClass: "AC Sleeper",
      amenities: ["ac", "wifi", "charging"],
      rating: 4.1,
      stops: "2 stops",
      refundable: true,
      availableSeats: 8,
      serviceType: "bus",
      fromLocation: "Mumbai",
      toLocation: "Pune",
      departureDate: new Date().toISOString().split('T')[0]
    }
  ],
  trains: [
    {
      id: "TR001",
      operator: "Indian Railways",
      operatorLogo: "🚂",
      routeNumber: "12627 - Karnataka Express",
      departure: "08:50",
      arrival: "19:20",
      duration: "10h 30m",
      price: 1205,
      originalPrice: 1205,
      seatClass: "3AC",
      amenities: ["ac", "meals", "charging"],
      rating: 4.0,
      stops: "12 stops",
      refundable: true,
      availableSeats: 20,
      serviceType: "train",
      fromLocation: "Mumbai",
      toLocation: "Delhi",
      departureDate: new Date().toISOString().split('T')[0]
    }
  ]
};

interface SearchForm {
  serviceType: "flight" | "bus" | "train";
  from: string;
  to: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: number;
  seatClass: string;
  tripType: "oneway" | "roundtrip";
}

export default function TravelBooking() {
  const [, navigate] = useLocation();
  
  const [searchForm, setSearchForm] = useState<SearchForm>({
    serviceType: "flight",
    from: "",
    to: "",
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    seatClass: "economy",
    tripType: "oneway"
  });
  
  // Fetch popular cities for current service type
  const { data: popularCities = [] } = useQuery({
    queryKey: ['/api/travel/cities', searchForm.serviceType],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/travel/cities/${searchForm.serviceType}`);
        const data = await response.json();
        return data.cities || [];
      } catch (error) {
        // Fallback to default cities
        const fallbackCities = {
          flight: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
          bus: ["Mumbai", "Pune", "Delhi", "Bangalore", "Chennai", "Hyderabad"],
          train: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"]
        };
        return fallbackCities[searchForm.serviceType] || [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    id: string;
    operator: string;
    operatorLogo: string;
    routeNumber: string;
    departure: string;
    arrival: string;
    duration: string;
    price: number;
    originalPrice: number;
    seatClass: string;
    amenities: string[];
    rating: number;
    stops: string;
    refundable: boolean;
    baggage?: string;
  }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchForm.from || !searchForm.to || !searchForm.departureDate) {
      return;
    }

    setIsSearching(true);
    
    try {
      const searchData = {
        serviceType: searchForm.serviceType,
        fromLocation: searchForm.from,
        toLocation: searchForm.to,
        departureDate: searchForm.departureDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        passengers: searchForm.passengers
      };
      
      const response = await apiRequest('POST', '/api/travel/search', searchData);
      
      const data = await response.json();
      setSearchResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      // Search failed, show empty results
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const swapLocations = () => {
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleBooking = (result: any) => {
    navigate(`/travel-booking-details/${result.id}`);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "flight": return <Plane className="h-5 w-5" />;
      case "bus": return <Bus className="h-5 w-5" />;
      case "train": return <Train className="h-5 w-5" />;
      default: return <Plane className="h-5 w-5" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi": return <Wifi className="h-4 w-4" />;
      case "meals": return <Utensils className="h-4 w-4" />;
      case "ac": return <AirVent className="h-4 w-4" />;
      case "charging": return <Coffee className="h-4 w-4" />;
      case "entertainment": return <Coffee className="h-4 w-4" />;
      default: return <Coffee className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 tracking-wider" data-testid="page-title">
            BOOK YOUR JOURNEY
          </h1>
          <p className="text-white/60">Flights • Buses • Trains</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Form */}
        <Card className="bg-black border-white/20 rounded-none mb-8">
          <CardContent className="p-6">
            {/* Service Type Tabs */}
            <Tabs 
              value={searchForm.serviceType} 
              onValueChange={(value) => {
                setSearchForm(prev => ({ ...prev, serviceType: value as any }));
                setShowResults(false);
              }}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-3 bg-black border border-white/20 rounded-none p-1">
                <TabsTrigger 
                  value="flight" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
                  data-testid="tab-flights"
                >
                  <Plane className="h-4 w-4 mr-2" />
                  Flights
                </TabsTrigger>
                <TabsTrigger 
                  value="bus" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
                  data-testid="tab-buses"
                >
                  <Bus className="h-4 w-4 mr-2" />
                  Buses
                </TabsTrigger>
                <TabsTrigger 
                  value="train" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
                  data-testid="tab-trains"
                >
                  <Train className="h-4 w-4 mr-2" />
                  Trains
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Trip Type Toggle */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={searchForm.tripType === "oneway" ? "default" : "outline"}
                onClick={() => setSearchForm(prev => ({ ...prev, tripType: "oneway" }))}
                className="rounded-none"
                data-testid="button-oneway"
              >
                One Way
              </Button>
              <Button
                variant={searchForm.tripType === "roundtrip" ? "default" : "outline"}
                onClick={() => setSearchForm(prev => ({ ...prev, tripType: "roundtrip" }))}
                className="rounded-none"
                data-testid="button-roundtrip"
              >
                Round Trip
              </Button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* From Location */}
              <div className="space-y-2">
                <Label htmlFor="from" className="text-white/80">From</Label>
                <Select value={searchForm.from} onValueChange={(value) => setSearchForm(prev => ({ ...prev, from: value }))}>
                  <SelectTrigger className="bg-black border-white/20 text-white rounded-none" data-testid="select-from">
                    <SelectValue placeholder="Select departure city" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 rounded-none">
                    {popularCities.map((city: string) => (
                      <SelectItem key={city} value={city} className="text-white">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex items-end justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapLocations}
                  className="border-white/20 rounded-none"
                  data-testid="button-swap-locations"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* To Location */}
              <div className="space-y-2">
                <Label htmlFor="to" className="text-white/80">To</Label>
                <Select value={searchForm.to} onValueChange={(value) => setSearchForm(prev => ({ ...prev, to: value }))}>
                  <SelectTrigger className="bg-black border-white/20 text-white rounded-none" data-testid="select-to">
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 rounded-none">
                    {popularCities.map((city: string) => (
                      <SelectItem key={city} value={city} className="text-white">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <Label htmlFor="passengers" className="text-white/80">Passengers</Label>
                <Select 
                  value={searchForm.passengers.toString()} 
                  onValueChange={(value) => setSearchForm(prev => ({ ...prev, passengers: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-black border-white/20 text-white rounded-none" data-testid="select-passengers">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 rounded-none">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-white">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Departure Date */}
              <div className="space-y-2">
                <Label className="text-white/80">Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-black border-white/20 rounded-none",
                        !searchForm.departureDate && "text-white/60"
                      )}
                      data-testid="button-departure-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchForm.departureDate ? format(searchForm.departureDate, "PPP") : "Select departure date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-white/20 rounded-none">
                    <Calendar
                      mode="single"
                      selected={searchForm.departureDate}
                      onSelect={(date) => setSearchForm(prev => ({ ...prev, departureDate: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="bg-black text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              {searchForm.tripType === "roundtrip" && (
                <div className="space-y-2">
                  <Label className="text-white/80">Return Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-black border-white/20 rounded-none",
                          !searchForm.returnDate && "text-white/60"
                        )}
                        data-testid="button-return-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchForm.returnDate ? format(searchForm.returnDate, "PPP") : "Select return date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-white/20 rounded-none">
                      <Calendar
                        mode="single"
                        selected={searchForm.returnDate}
                        onSelect={(date) => setSearchForm(prev => ({ ...prev, returnDate: date }))}
                        disabled={(date) => date < (searchForm.departureDate || new Date())}
                        initialFocus
                        className="bg-black text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!searchForm.from || !searchForm.to || !searchForm.departureDate || isSearching}
              className="w-full bg-white/10 hover:bg-white/15 text-white rounded-none h-12 text-lg"
              data-testid="button-search-travel"
            >
              {isSearching ? (
                <>
                  <Search className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search {searchForm.serviceType === "flight" ? "Flights" : searchForm.serviceType === "bus" ? "Buses" : "Trains"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {showResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" data-testid="results-title">
                {searchResults.length} {searchForm.serviceType === "flight" ? "Flights" : searchForm.serviceType === "bus" ? "Buses" : "Trains"} Found
              </h2>
              <div className="flex items-center gap-4">
                <Select defaultValue="price">
                  <SelectTrigger className="w-32 bg-black border-white/20 text-white rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 rounded-none">
                    <SelectItem value="price" className="text-white">Price</SelectItem>
                    <SelectItem value="duration" className="text-white">Duration</SelectItem>
                    <SelectItem value="departure" className="text-white">Departure</SelectItem>
                    <SelectItem value="rating" className="text-white">Rating</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-white/20 rounded-none">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="bg-black border-white/20 rounded-none hover:border-white/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* Operator Info */}
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{result.operatorLogo}</div>
                          <div>
                            <h3 className="font-semibold text-white" data-testid={`result-operator-${result.id}`}>
                              {result.operator}
                            </h3>
                            <p className="text-sm text-white/60">{result.routeNumber}</p>
                          </div>
                        </div>

                        {/* Journey Info */}
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <p className="text-xl font-bold text-white" data-testid={`result-departure-${result.id}`}>
                              {result.departure}
                            </p>
                            <p className="text-sm text-white/60">{searchForm.from}</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center text-white/60">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{result.duration}</span>
                            </div>
                            <p className="text-xs text-white/40">{result.stops}</p>
                          </div>

                          <div className="text-center">
                            <p className="text-xl font-bold text-white" data-testid={`result-arrival-${result.id}`}>
                              {result.arrival}
                            </p>
                            <p className="text-sm text-white/60">{searchForm.to}</p>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex items-center space-x-2">
                          {result.amenities.slice(0, 3).map((amenity: string, index: number) => (
                            <div key={index} className="text-white/60">
                              {getAmenityIcon(amenity)}
                            </div>
                          ))}
                          {result.amenities.length > 3 && (
                            <span className="text-xs text-white/40">+{result.amenities.length - 3}</span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-white/80 fill-current" />
                          <span className="text-sm text-white">{result.rating}</span>
                        </div>
                      </div>

                      {/* Price and Book */}
                      <div className="text-right">
                        <div className="mb-2">
                          {result.originalPrice > result.price && (
                            <p className="text-sm text-white/40 line-through">₹{result.originalPrice}</p>
                          )}
                          <p className="text-2xl font-bold text-white" data-testid={`result-price-${result.id}`}>
                            ₹{result.price}
                          </p>
                          <p className="text-xs text-white/60">per person</p>
                        </div>
                        <Button
                          onClick={() => handleBooking(result)}
                          className="bg-white/10 hover:bg-white/15 text-white rounded-none"
                          data-testid={`button-book-${result.id}`}
                        >
                          Book Now
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center space-x-4">
                        <span>{result.seatClass}</span>
                        {searchForm.serviceType === "flight" && (
                          <span>Baggage: {result.baggage}</span>
                        )}
                        <span className={result.refundable ? "text-white/80" : "text-white/80"}>
                          {result.refundable ? "Refundable" : "Non-refundable"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Popular Routes */}
        {!showResults && (
          <Card className="bg-black border-white/20 rounded-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getServiceIcon(searchForm.serviceType)}
                Popular {searchForm.serviceType === "flight" ? "Flight" : searchForm.serviceType === "bus" ? "Bus" : "Train"} Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { from: "Mumbai", to: "Delhi", price: searchForm.serviceType === "flight" ? "₹4,500" : searchForm.serviceType === "bus" ? "₹850" : "₹1,200" },
                  { from: "Bangalore", to: "Chennai", price: searchForm.serviceType === "flight" ? "₹3,200" : searchForm.serviceType === "bus" ? "₹650" : "₹900" },
                  { from: "Delhi", to: "Kolkata", price: searchForm.serviceType === "flight" ? "₹5,800" : searchForm.serviceType === "bus" ? "₹1,200" : "₹1,400" },
                  { from: "Mumbai", to: "Goa", price: searchForm.serviceType === "flight" ? "₹2,800" : searchForm.serviceType === "bus" ? "₹450" : "₹750" },
                  { from: "Pune", to: "Bangalore", price: searchForm.serviceType === "flight" ? "₹3,500" : searchForm.serviceType === "bus" ? "₹700" : "₹1,000" },
                  { from: "Hyderabad", to: "Chennai", price: searchForm.serviceType === "flight" ? "₹2,900" : searchForm.serviceType === "bus" ? "₹550" : "₹800" }
                ].map((route, index) => (
                  <Card key={index} className="bg-white/5 border-white/10 rounded-none hover:bg-white/10 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{route.from} → {route.to}</p>
                          <p className="text-sm text-white/60">Starting from</p>
                        </div>
                        <p className="text-lg font-bold text-white/80">{route.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}