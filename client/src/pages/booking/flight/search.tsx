import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketHeader } from "@/components/ui/ticket-header";
import {
  Plane,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  ArrowRightLeft,
  TrendingUp,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const popularCities = [
  { code: "DEL", name: "Delhi", airport: "Indira Gandhi International Airport" },
  { code: "BOM", name: "Mumbai", airport: "Chhatrapati Shivaji International Airport" },
  { code: "BLR", name: "Bangalore", airport: "Kempegowda International Airport" },
  { code: "MAA", name: "Chennai", airport: "Chennai International Airport" },
  { code: "CCU", name: "Kolkata", airport: "Netaji Subhas Chandra Bose International Airport" },
  { code: "HYD", name: "Hyderabad", airport: "Rajiv Gandhi International Airport" },
  { code: "GOI", name: "Goa", airport: "Dabolim Airport" },
  { code: "COK", name: "Kochi", airport: "Cochin International Airport" },
  { code: "AMD", name: "Ahmedabad", airport: "Sardar Vallabhbhai Patel International Airport" },
  { code: "PNQ", name: "Pune", airport: "Pune Airport" },
  { code: "JAI", name: "Jaipur", airport: "Jaipur International Airport" },
  { code: "SXR", name: "Srinagar", airport: "Sheikh ul-Alam International Airport" },
  { code: "VNS", name: "Varanasi", airport: "Lal Bahadur Shastri Airport" },
  { code: "GAU", name: "Guwahati", airport: "Lokpriya Gopinath Bordoloi International Airport" },
];

export default function FlightSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromPopover, setShowFromPopover] = useState(false);
  const [showToPopover, setShowToPopover] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [showPassengers, setShowPassengers] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [travelClass, setTravelClass] = useState("economy");

  const filteredFromCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
    city.code.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(toSearch.toLowerCase()) ||
    city.code.toLowerCase().includes(toSearch.toLowerCase())
  );

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleSearch = () => {
    if (!from || !to) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select both departure and destination cities",
        variant: "destructive"
      });
      return;
    }

    if (!departureDate) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a departure date",
        variant: "destructive"
      });
      return;
    }

    if (tripType === "roundtrip" && !returnDate) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a return date",
        variant: "destructive"
      });
      return;
    }

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

    navigate(`/booking/flight/results?${params.toString()}`);
  };

  const selectedFrom = popularCities.find(c => c.code === from);
  const selectedTo = popularCities.find(c => c.code === to);

  return (
    <>
      <TicketHeader 
        title="BOOK FLIGHTS" 
        subtitle="Search & book your journey"
        backPath="/home"
        ticketsPath="/all-tickets?type=flights&status=all"
        ticketIcon={<Plane className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">

      <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
        {/* Trip Type */}
        <div className="space-y-3">
          <Label className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light block">Trip Type</Label>
          <div className="flex gap-2">
            {[
              { value: "oneway", label: "ONE WAY" },
              { value: "roundtrip", label: "ROUND TRIP" },
              { value: "multicity", label: "MULTI CITY" }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setTripType(type.value as any)}
                className={cn(
                  "flex-1 py-3 border transition-all text-xs tracking-wider font-light rounded-none",
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

        {/* From & To */}
        <div className="space-y-6">
          {/* From */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              FROM
            </Label>
            <Popover open={showFromPopover} onOpenChange={setShowFromPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                    !from && "text-white/50"
                  )}
                  data-testid="button-from"
                >
                  {selectedFrom ? (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-light">{selectedFrom.code}</span>
                        <span className="text-xs text-white/60">{selectedFrom.name}</span>
                      </div>
                      <span className="text-xs text-white/40 font-light truncate w-full">{selectedFrom.airport}</span>
                    </div>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      <span className="font-light">Select departure city</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search cities..."
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                    data-testid="input-from-search"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredFromCities.map((city) => (
                    <button
                      key={city.code}
                      onClick={() => {
                        setFrom(city.code);
                        setFromSearch("");
                        setShowFromPopover(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                      data-testid={`option-from-${city.code}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-light text-white">{city.name}</div>
                          <div className="text-xs text-white/60 font-light">{city.airport}</div>
                        </div>
                        <div className="text-lg font-light text-white/80">{city.code}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2">
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
              TO
            </Label>
            <Popover open={showToPopover} onOpenChange={setShowToPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                    !to && "text-white/50"
                  )}
                  data-testid="button-to"
                >
                  {selectedTo ? (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-light">{selectedTo.code}</span>
                        <span className="text-xs text-white/60">{selectedTo.name}</span>
                      </div>
                      <span className="text-xs text-white/40 font-light truncate w-full">{selectedTo.airport}</span>
                    </div>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      <span className="font-light">Select destination city</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search cities..."
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                    data-testid="input-to-search"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredToCities.map((city) => (
                    <button
                      key={city.code}
                      onClick={() => {
                        setTo(city.code);
                        setToSearch("");
                        setShowToPopover(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                      data-testid={`option-to-${city.code}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-light text-white">{city.name}</div>
                          <div className="text-xs text-white/60 font-light">{city.airport}</div>
                        </div>
                        <div className="text-lg font-light text-white/80">{city.code}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <div className={cn("grid gap-4", tripType === "roundtrip" ? "grid-cols-2" : "grid-cols-1")}>
            {/* Departure Date */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                DEPARTURE
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light",
                      !departureDate && "text-white/50"
                    )}
                    data-testid="button-departure-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "EEE, dd MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Date */}
            {tripType === "roundtrip" && (
              <div className="space-y-2">
                <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  RETURN
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light",
                        !returnDate && "text-white/50"
                      )}
                      data-testid="button-return-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "EEE, dd MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => {
                        const minDate = departureDate || new Date();
                        return date < minDate;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Passengers & Class */}
        <div className="grid grid-cols-2 gap-6">
          {/* Passengers */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Users className="h-3 w-3" />
              PASSENGERS
            </Label>
            <Popover open={showPassengers} onOpenChange={setShowPassengers}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light"
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
                        <div className="text-sm text-white font-light">Adults</div>
                        <div className="text-xs text-white/60 font-light">12+ years</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                          disabled={passengers.adults <= 1}
                          className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                          data-testid="button-adults-decrease"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-light" data-testid="text-adults-count">{passengers.adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))}
                          disabled={passengers.adults >= 9}
                          className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                          data-testid="button-adults-increase"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white font-light">Children</div>
                        <div className="text-xs text-white/60 font-light">2-12 years</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                          disabled={passengers.children <= 0}
                          className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                          data-testid="button-children-decrease"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-light" data-testid="text-children-count">{passengers.children}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, children: Math.min(9, p.children + 1) }))}
                          disabled={passengers.children >= 9}
                          className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                          data-testid="button-children-increase"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white font-light">Infants</div>
                        <div className="text-xs text-white/60 font-light">Below 2 years</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                          disabled={passengers.infants <= 0}
                          className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                          data-testid="button-infants-decrease"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-light" data-testid="text-infants-count">{passengers.infants}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPassengers(p => ({ ...p, infants: Math.min(9, p.infants + 1) }))}
                          disabled={passengers.infants >= 9}
                          className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                          data-testid="button-infants-increase"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowPassengers(false)}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-none"
                      data-testid="button-passengers-done"
                    >
                      DONE
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

          {/* Class */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Plane className="h-3 w-3" />
              CLASS
            </Label>
            <Select value={travelClass} onValueChange={setTravelClass}>
              <SelectTrigger
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white"
                data-testid="select-class"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="economy" className="text-white hover:bg-white/10" data-testid="option-class-economy">Economy</SelectItem>
                <SelectItem value="premium" className="text-white hover:bg-white/10" data-testid="option-class-premium">Premium Economy</SelectItem>
                <SelectItem value="business" className="text-white hover:bg-white/10" data-testid="option-class-business">Business</SelectItem>
                <SelectItem value="first" className="text-white hover:bg-white/10" data-testid="option-class-first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="space-y-3">
          <Label className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light block">Popular Routes</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { from: "DEL", to: "BOM", label: "Delhi → Mumbai" },
              { from: "BLR", to: "DEL", label: "Bangalore → Delhi" },
              { from: "BOM", to: "GOI", label: "Mumbai → Goa" },
              { from: "DEL", to: "BLR", label: "Delhi → Bangalore" },
            ].map((route, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                }}
                className="px-4 py-3 border-b border-white/20 hover:border-white/40 transition-all text-left hover:bg-white/5"
                data-testid={`button-route-${route.from}-${route.to}`}
              >
                <div className="text-xs text-white/60 font-light uppercase tracking-wider">Popular</div>
                <div className="text-sm text-white font-light mt-1">{route.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Fixed Search Button */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <Button
            onClick={handleSearch}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base tracking-wider font-light"
            data-testid="button-search-flights"
          >
            <Plane className="mr-2 h-5 w-5" />
            SEARCH FLIGHTS
          </Button>
        </div>
      </div>
    </>
  );
}
