import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plane, 
  ArrowLeft, 
  Search, 
  Calendar as CalendarIcon, 
  Users, 
  ArrowRightLeft,
  MapPin,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const popularCities = [
  { code: "DEL", name: "Delhi", country: "India" },
  { code: "BOM", name: "Mumbai", country: "India" },
  { code: "BLR", name: "Bangalore", country: "India" },
  { code: "MAA", name: "Chennai", country: "India" },
  { code: "CCU", name: "Kolkata", country: "India" },
  { code: "HYD", name: "Hyderabad", country: "India" },
  { code: "GOI", name: "Goa", country: "India" },
  { code: "COK", name: "Kochi", country: "India" },
  { code: "AMD", name: "Ahmedabad", country: "India" },
  { code: "PNQ", name: "Pune", country: "India" },
  { code: "JAI", name: "Jaipur", country: "India" },
  { code: "SXR", name: "Srinagar", country: "India" },
];

export default function FlightSearchModern() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState("economy");
  const [showPassengerPopup, setShowPassengerPopup] = useState(false);

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    if (!from || !to) {
      toast({
        title: "Missing Information",
        description: "Please select both departure and destination cities",
        variant: "destructive"
      });
      return;
    }

    if (!departureDate) {
      toast({
        title: "Missing Information",
        description: "Please select a departure date",
        variant: "destructive"
      });
      return;
    }

    if (tripType === "roundtrip" && !returnDate) {
      toast({
        title: "Missing Information",
        description: "Please select a return date for round trip",
        variant: "destructive"
      });
      return;
    }

    // Navigate to results page with search parameters
    const params = new URLSearchParams({
      from,
      to,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      ...(returnDate && { returnDate: format(returnDate, "yyyy-MM-dd") }),
      adults: passengers.adults.toString(),
      children: passengers.children.toString(),
      infants: passengers.infants.toString(),
      class: travelClass,
      tripType
    });
    
    navigate(`/flights/results?${params.toString()}`);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SEARCH FLIGHTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Book your journey</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-6">
        {/* Trip Type Selector */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
          <Label className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light block">Trip Type</Label>
          <div className="flex gap-3">
            {[
              { value: "oneway", label: "One Way" },
              { value: "roundtrip", label: "Round Trip" },
              { value: "multicity", label: "Multi City" }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setTripType(type.value as any)}
                className={cn(
                  "flex-1 py-3 border transition-all font-light tracking-wider",
                  tripType === type.value
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid={`button-trip-${type.value}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* From & To Locations */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 space-y-4">
          {/* From */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              From
            </Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger 
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 text-lg font-light focus:border-white"
                data-testid="select-from"
              >
                <SelectValue placeholder="Select departure city" />
              </SelectTrigger>
              <SelectContent>
                {popularCities.map((city) => (
                  <SelectItem key={city.code} value={city.code}>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">{city.name}</span>
                      <span className="text-xs text-white/60">{city.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={swapLocations}
              className="bg-white/10 text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
              data-testid="button-swap"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              To
            </Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger 
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 text-lg font-light focus:border-white"
                data-testid="select-to"
              >
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {popularCities.map((city) => (
                  <SelectItem key={city.code} value={city.code}>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-medium">{city.name}</span>
                      <span className="text-xs text-white/60">{city.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Departure Date */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                Departure
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-light bg-transparent border-b-2 border-white/20 rounded-none h-14 hover:bg-transparent hover:border-white",
                      !departureDate && "text-white/50"
                    )}
                    data-testid="button-departure-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Date */}
            {tripType === "roundtrip" && (
              <div className="space-y-2">
                <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  Return
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-light bg-transparent border-b-2 border-white/20 rounded-none h-14 hover:bg-transparent hover:border-white",
                        !returnDate && "text-white/50"
                      )}
                      data-testid="button-return-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date) => {
                        const minDate = departureDate || new Date();
                        return date < minDate;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Passengers & Class */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Passengers */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Users className="h-3 w-3" />
                Passengers
              </Label>
              <Popover open={showPassengerPopup} onOpenChange={setShowPassengerPopup}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-light bg-transparent border-b-2 border-white/20 rounded-none h-14 hover:bg-transparent hover:border-white"
                    data-testid="button-passengers"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-black border-white/20 p-4" align="start">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Adults</p>
                        <p className="text-xs text-white/60">12+ years</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="h-8 w-8 p-0 rounded-none border-white/20 text-white hover:bg-white/10"
                          data-testid="button-adults-minus"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-white">{passengers.adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(prev => ({ ...prev, adults: Math.min(9, prev.adults + 1) }))}
                          className="h-8 w-8 p-0 rounded-none border-white/20 text-white hover:bg-white/10"
                          data-testid="button-adults-plus"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Children</p>
                        <p className="text-xs text-white/60">2-12 years</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          className="h-8 w-8 p-0 rounded-none border-white/20 text-white hover:bg-white/10"
                          data-testid="button-children-minus"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-white">{passengers.children}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(prev => ({ ...prev, children: Math.min(9, prev.children + 1) }))}
                          className="h-8 w-8 p-0 rounded-none border-white/20 text-white hover:bg-white/10"
                          data-testid="button-children-plus"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Infants</p>
                        <p className="text-xs text-white/60">Under 2 years</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))}
                          className="h-8 w-8 p-0 rounded-none border-white/20 text-white hover:bg-white/10"
                          data-testid="button-infants-minus"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-white">{passengers.infants}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(prev => ({ ...prev, infants: Math.min(passengers.adults, prev.infants + 1) }))}
                          className="h-8 w-8 p-0 rounded-none border-white/20 text-white hover:bg-white/10"
                          data-testid="button-infants-plus"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowPassengerPopup(false)}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                      data-testid="button-done-passengers"
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Class
              </Label>
              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger 
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 font-light focus:border-white"
                  data-testid="select-class"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium_economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-5">
          <h3 className="text-sm font-light text-white mb-4 tracking-wider uppercase">Popular Routes</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { from: "DEL", to: "BOM", route: "Delhi → Mumbai" },
              { from: "BLR", to: "DEL", route: "Bangalore → Delhi" },
              { from: "BOM", to: "GOI", route: "Mumbai → Goa" },
              { from: "DEL", to: "BLR", route: "Delhi → Bangalore" }
            ].map((route) => (
              <button
                key={route.route}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                }}
                className="text-left p-3 bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                data-testid={`button-route-${route.from}-${route.to}`}
              >
                <p className="text-xs text-white/80 font-light">{route.route}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Search Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleSearch}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
          data-testid="button-search-flights"
        >
          <Search className="h-5 w-5 mr-2" />
          SEARCH FLIGHTS
        </Button>
      </div>
    </div>
  );
}
