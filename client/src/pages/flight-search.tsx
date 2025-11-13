import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Plane, Search, Calendar as CalendarIcon, Users, MapPin, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface FlightSearchResult {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  available: number;
}

const mockFlights: FlightSearchResult[] = [
  {
    id: "1",
    airline: "Air India",
    flightNumber: "AI 505",
    from: "DEL",
    to: "BLR",
    departureTime: "06:00 AM",
    arrivalTime: "08:45 AM",
    duration: "2h 45m",
    price: 4500,
    stops: 0,
    available: 45
  },
  {
    id: "2",
    airline: "IndiGo",
    flightNumber: "6E 2062",
    from: "DEL",
    to: "BLR",
    departureTime: "09:30 AM",
    arrivalTime: "12:15 PM",
    duration: "2h 45m",
    price: 3800,
    stops: 0,
    available: 38
  },
  {
    id: "3",
    airline: "SpiceJet",
    flightNumber: "SG 8192",
    from: "DEL",
    to: "BLR",
    departureTime: "14:00 PM",
    arrivalTime: "16:50 PM",
    duration: "2h 50m",
    price: 3200,
    stops: 0,
    available: 52
  }
];

export default function FlightSearch() {
  const [, navigate] = useLocation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [tripType, setTripType] = useState("one-way");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("economy");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<FlightSearchResult[]>([]);

  const handleSearch = () => {
    if (from && to && departureDate) {
      setResults(mockFlights);
      setShowResults(true);
    }
  };

  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-trips")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FLIGHT BOOKING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Search & book flights</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Trip Type Selection */}
        <div className="flex gap-3">
          {["one-way", "round-trip", "multi-city"].map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={cn(
                "px-4 py-2 border text-xs uppercase tracking-wider transition-all",
                tripType === type
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/60 border-white/20 hover:border-white/40"
              )}
              data-testid={`button-${type}`}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                From
              </Label>
              <Input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Enter origin city"
                className="bg-white/5 border-white/20 text-white rounded-none h-12"
                data-testid="input-from"
              />
            </div>

            {/* To */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  To
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSwapLocations}
                  className="text-white/60 hover:text-white p-1 h-auto"
                  data-testid="button-swap"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter destination city"
                className="bg-white/5 border-white/20 text-white rounded-none h-12"
                data-testid="input-to"
              />
            </div>

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
                      "w-full bg-white/5 border-white/20 text-white rounded-none h-12 justify-start text-left font-normal",
                      !departureDate && "text-white/50"
                    )}
                    data-testid="button-departure-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    className="bg-black text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Date (if round-trip) */}
            {tripType === "round-trip" && (
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
                        "w-full bg-white/5 border-white/20 text-white rounded-none h-12 justify-start text-left font-normal",
                        !returnDate && "text-white/50"
                      )}
                      data-testid="button-return-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      className="bg-black text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Passengers */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Users className="h-3 w-3" />
                Passengers
              </Label>
              <Select value={passengers.toString()} onValueChange={(v) => setPassengers(parseInt(v))}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none h-12" data-testid="select-passengers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Travel Class */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Class</Label>
              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none h-12" data-testid="select-class">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!from || !to || !departureDate}
            className="w-full mt-6 bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-search"
          >
            <Search className="h-5 w-5 mr-2" />
            SEARCH FLIGHTS
          </Button>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Available Flights</h2>
              <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                {results.length} flights found
              </Badge>
            </div>

            {results.map((flight) => (
              <div
                key={flight.id}
                className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:border-white/40 transition-all"
                data-testid={`flight-${flight.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 border border-white/20">
                      <Plane className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{flight.airline}</h3>
                      <p className="text-xs text-white/60">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-light text-white">{flight.departureTime}</p>
                    <p className="text-sm text-white/60">{flight.from}</p>
                  </div>
                  <div className="flex-1 mx-4 text-center">
                    <p className="text-xs text-white/60 mb-1">{flight.duration}</p>
                    <div className="h-px bg-white/20"></div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-light text-white">{flight.arrivalTime}</p>
                    <p className="text-sm text-white/60">{flight.to}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-white/60">Price per person</p>
                    <p className="text-2xl font-light text-white">{formatCurrency(flight.price)}</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/booking/flight/${flight.id}`)}
                    className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6"
                    data-testid={`button-select-${flight.id}`}
                  >
                    SELECT FLIGHT
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
