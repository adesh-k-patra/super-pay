import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bus,
  ArrowLeft,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  ArrowRightLeft,
  Ticket
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TicketHeader } from "@/components/ui/ticket-header";

const popularCities = [
  { code: "DEL", name: "Delhi" },
  { code: "MUM", name: "Mumbai" },
  { code: "BLR", name: "Bangalore" },
  { code: "CHN", name: "Chennai" },
  { code: "KOL", name: "Kolkata" },
  { code: "HYD", name: "Hyderabad" },
  { code: "PUN", name: "Pune" },
  { code: "AHM", name: "Ahmedabad" },
  { code: "JAI", name: "Jaipur" },
  { code: "LKO", name: "Lucknow" },
  { code: "SUR", name: "Surat" },
  { code: "NAG", name: "Nagpur" },
];

export default function BusSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromPopover, setShowFromPopover] = useState(false);
  const [showToPopover, setShowToPopover] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [showPassengers, setShowPassengers] = useState(false);
  const [passengers, setPassengers] = useState(1);

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
      passengers: passengers.toString(),
      tripType
    });

    navigate(`/booking/bus/results?${params.toString()}`);
  };

  const selectedFrom = popularCities.find(c => c.code === from);
  const selectedTo = popularCities.find(c => c.code === to);

  return (
    <div className="min-h-screen bg-black text-white">
      <TicketHeader 
        title="BOOK BUS" 
        subtitle="Search & book your journey"
        backPath="/home"
        ticketsPath="/all-tickets?type=bus&status=all"
        ticketIcon={<Bus className="h-5 w-5" />}
      />

      <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
        {/* Trip Type */}
        <div className="space-y-3">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light block">Trip Type</Label>
          <div className="flex gap-2">
            {[
              { value: "oneway", label: "ONE WAY" },
              { value: "roundtrip", label: "ROUND TRIP" }
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
        <div className="space-y-4">
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
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 hover:bg-transparent hover:border-white px-3",
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
                    </div>
                  ) : (
                    <span className="font-light">Select departure city</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                <Input
                  placeholder="Search cities..."
                  value={fromSearch}
                  onChange={(e) => setFromSearch(e.target.value)}
                  className="border-0 border-b border-white/20 rounded-none bg-transparent text-white"
                  data-testid="input-from-search"
                />
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
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 hover:bg-transparent hover:border-white px-3",
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
                    </div>
                  ) : (
                    <span className="font-light">Select destination city</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                <Input
                  placeholder="Search cities..."
                  value={toSearch}
                  onChange={(e) => setToSearch(e.target.value)}
                  className="border-0 border-b border-white/20 rounded-none bg-transparent text-white"
                  data-testid="input-to-search"
                />
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
          <div className={cn("grid gap-6", tripType === "roundtrip" ? "grid-cols-2" : "grid-cols-1")}>
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
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 hover:bg-transparent hover:border-white px-3 font-light",
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
                        "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 hover:bg-transparent hover:border-white px-3 font-light",
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
                  className="w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 hover:bg-transparent hover:border-white px-3 font-light"
                  data-testid="button-passengers"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {passengers} Passenger{passengers !== 1 ? 's' : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-white/20 p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white font-light">Passengers</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers(p => Math.max(1, p - 1))}
                        disabled={passengers <= 1}
                        className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                        data-testid="button-passengers-decrease"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-light" data-testid="text-passengers-count">{passengers}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers(p => Math.min(9, p + 1))}
                        disabled={passengers >= 9}
                        className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                        data-testid="button-passengers-increase"
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

        {/* Popular Routes */}
        <div className="space-y-4">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light block">Popular Routes</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { from: "DEL", to: "MUM", label: "Delhi → Mumbai" },
              { from: "BLR", to: "CHN", label: "Bangalore → Chennai" },
              { from: "MUM", to: "PUN", label: "Mumbai → Pune" },
              { from: "DEL", to: "JAI", label: "Delhi → Jaipur" },
            ].map((route, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                }}
                className="px-4 py-3 border border-white/20 hover:border-white/40 transition-all text-left bg-white/5 hover:bg-white/10 rounded-none"
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
          data-testid="button-search-buses"
        >
          <Bus className="mr-2 h-5 w-5" />
          SEARCH BUSES
        </Button>
      </div>
    </div>
  );
}
