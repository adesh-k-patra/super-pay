import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketHeader } from "@/components/ui/ticket-header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Train,
  MapPin,
  ArrowRightLeft,
  Users,
  Loader2,
  Clock,
  IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetroStation {
  id: string;
  stationName: string;
  stationCode: string;
  city: string;
  metroLine: string;
}

interface MetroRoute {
  id: string;
  fromStationId: string;
  toStationId: string;
  metroLine: string;
  fare: string;
  distance: number;
  duration: number;
  intermediateStations: string[];
}

export default function MetroBooking() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [tripType, setTripType] = useState<"single" | "return">("single");
  const [selectedCity, setSelectedCity] = useState("");
  const [fromStationId, setFromStationId] = useState("");
  const [toStationId, setToStationId] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromPopover, setShowFromPopover] = useState(false);
  const [showToPopover, setShowToPopover] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0
  });

  const { data: stationsData, isLoading: stationsLoading } = useQuery({
    queryKey: ["/api/metro/stations"],
  });

  const stations = ((stationsData as any)?.stations || []) as MetroStation[];
  const cities = Array.from(new Set(stations.map((s: MetroStation) => s.city))) as string[];
  
  const cityStations = selectedCity 
    ? stations.filter((s: MetroStation) => s.city === selectedCity)
    : [];

  const filteredFromStations = cityStations.filter(station =>
    station.stationName.toLowerCase().includes(fromSearch.toLowerCase()) ||
    station.stationCode.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToStations = cityStations.filter(station =>
    station.stationName.toLowerCase().includes(toSearch.toLowerCase()) ||
    station.stationCode.toLowerCase().includes(toSearch.toLowerCase())
  );

  const getStation = (id: string) => stations.find((s: MetroStation) => s.id === id);

  const swapStations = () => {
    const temp = fromStationId;
    setFromStationId(toStationId);
    setToStationId(temp);
  };

  const totalPassengers = passengers.adults + passengers.children;

  const handleSearch = () => {
    if (!selectedCity) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a city",
        variant: "destructive"
      });
      return;
    }

    if (!fromStationId || !toStationId) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select both departure and destination stations",
        variant: "destructive"
      });
      return;
    }

    if (fromStationId === toStationId) {
      toast({
        title: "INVALID SELECTION",
        description: "From and to stations cannot be the same",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams({
      city: selectedCity,
      fromStationId,
      toStationId,
      tripType,
      adults: passengers.adults.toString(),
      children: passengers.children.toString()
    });

    navigate(`/booking/metro/comprehensive?${params.toString()}`);
  };

  const selectedFrom = getStation(fromStationId);
  const selectedTo = getStation(toStationId);

  if (stationsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-lg font-medium text-white/80">Loading metro services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TicketHeader 
        title="BOOK METRO" 
        subtitle="Quick city transit"
        backPath="/home"
        ticketsPath="/my-metro-tickets"
        ticketIcon={<Train className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
          
          {/* Trip Type */}
          <div className="space-y-3">
            <Label className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light block">Trip Type</Label>
            <div className="flex gap-2">
              {[
                { value: "single", label: "SINGLE TRIP" },
                { value: "return", label: "RETURN TRIP" }
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

          {/* City Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              CITY
            </Label>
            <Select value={selectedCity} onValueChange={(city) => {
              setSelectedCity(city);
              setFromStationId("");
              setToStationId("");
            }}>
              <SelectTrigger
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white"
                data-testid="select-city"
              >
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                {cities.map((city: string) => (
                  <SelectItem 
                    key={city} 
                    value={city} 
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                    data-testid={`option-city-${city}`}
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From & To Stations */}
          <div className="space-y-6">
            {/* From Station */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                FROM
              </Label>
              <Popover open={showFromPopover} onOpenChange={setShowFromPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedCity}
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                      !fromStationId && "text-white/50",
                      !selectedCity && "opacity-50 cursor-not-allowed"
                    )}
                    data-testid="button-from-station"
                  >
                    {selectedFrom ? (
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-light">{selectedFrom.stationCode}</span>
                          <span className="text-xs text-white/60">{selectedFrom.stationName}</span>
                        </div>
                        <span className="text-xs text-white/40 font-light truncate w-full">{selectedFrom.metroLine}</span>
                      </div>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="font-light">Select departure station</span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                  <Input
                    placeholder="Search stations..."
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                    className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                    data-testid="input-from-search"
                  />
                  <div className="max-h-64 overflow-y-auto">
                    {filteredFromStations.map((station) => (
                      <button
                        key={station.id}
                        onClick={() => {
                          setFromStationId(station.id);
                          setFromSearch("");
                          setShowFromPopover(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                        data-testid={`option-from-${station.stationCode}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-light text-white">{station.stationName}</div>
                            <div className="text-xs text-white/60 font-light">{station.metroLine}</div>
                          </div>
                          <div className="text-lg font-light text-white/80">{station.stationCode}</div>
                        </div>
                      </button>
                    ))}
                    {filteredFromStations.length === 0 && (
                      <div className="px-4 py-8 text-center text-white/60">
                        No stations found
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={swapStations}
                disabled={!selectedCity}
                className="bg-white/10 text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 disabled:opacity-50"
                data-testid="button-swap"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* To Station */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                TO
              </Label>
              <Popover open={showToPopover} onOpenChange={setShowToPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedCity}
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                      !toStationId && "text-white/50",
                      !selectedCity && "opacity-50 cursor-not-allowed"
                    )}
                    data-testid="button-to-station"
                  >
                    {selectedTo ? (
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-light">{selectedTo.stationCode}</span>
                          <span className="text-xs text-white/60">{selectedTo.stationName}</span>
                        </div>
                        <span className="text-xs text-white/40 font-light truncate w-full">{selectedTo.metroLine}</span>
                      </div>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="font-light">Select destination station</span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                  <Input
                    placeholder="Search stations..."
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                    className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                    data-testid="input-to-search"
                  />
                  <div className="max-h-64 overflow-y-auto">
                    {filteredToStations.map((station) => (
                      <button
                        key={station.id}
                        onClick={() => {
                          setToStationId(station.id);
                          setToSearch("");
                          setShowToPopover(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                        data-testid={`option-to-${station.stationCode}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-light text-white">{station.stationName}</div>
                            <div className="text-xs text-white/60 font-light">{station.metroLine}</div>
                          </div>
                          <div className="text-lg font-light text-white/80">{station.stationCode}</div>
                        </div>
                      </button>
                    ))}
                    {filteredToStations.length === 0 && (
                      <div className="px-4 py-8 text-center text-white/60">
                        No stations found
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
                      <div className="text-xs text-white/60 font-light">Below 12 years</div>
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

          {/* Search Button */}
          <div className="pt-4">
            <Button
              onClick={handleSearch}
              className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-none font-light text-base tracking-widest"
              data-testid="button-search"
            >
              SEARCH METRO
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
