import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TicketHeader } from "@/components/ui/ticket-header";
import { DarkMap } from "@/components/DarkMap";
import { useToast } from "@/hooks/use-toast";
import {
  Car,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  ArrowRightLeft,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const VEHICLE_TYPES = [
  { 
    id: 'auto', 
    name: 'Auto', 
    icon: '🛺', 
    basePrice: 50, 
    capacity: 3, 
    description: 'Affordable',
    eta: '2 min'
  },
  { 
    id: 'bike', 
    name: 'Bike', 
    icon: '🏍️', 
    basePrice: 30, 
    capacity: 1, 
    description: 'Quick',
    eta: '1 min'
  },
  { 
    id: 'mini', 
    name: 'Mini', 
    icon: '🚗', 
    basePrice: 80, 
    capacity: 4, 
    description: 'Compact',
    eta: '3 min'
  },
  { 
    id: 'sedan', 
    name: 'Sedan', 
    icon: '🚙', 
    basePrice: 120, 
    capacity: 4, 
    description: 'Comfortable',
    eta: '4 min'
  },
  { 
    id: 'suv', 
    name: 'SUV', 
    icon: '🚐', 
    basePrice: 180, 
    capacity: 6, 
    description: 'Spacious',
    eta: '5 min'
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    icon: '🏎️', 
    basePrice: 300, 
    capacity: 4, 
    description: 'Premium',
    eta: '6 min'
  }
];

const POPULAR_LOCATIONS = [
  { id: '1', name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: '2', name: 'India Gate', area: 'Central Delhi', lat: 28.6129, lng: 77.2295 },
  { id: '3', name: 'IGI Airport T3', area: 'Aerocity', lat: 28.5562, lng: 77.1000 },
  { id: '4', name: 'Nehru Place', area: 'South Delhi', lat: 28.5494, lng: 77.2501 },
  { id: '5', name: 'Chandni Chowk', area: 'Old Delhi', lat: 28.6506, lng: 77.2303 },
  { id: '6', name: 'Saket', area: 'South Delhi', lat: 28.5244, lng: 77.2066 },
  { id: '7', name: 'Cyber Hub', area: 'Gurugram', lat: 28.4942, lng: 77.0869 },
  { id: '8', name: 'Khan Market', area: 'Central Delhi', lat: 28.6007, lng: 77.2259 }
];

export default function CabSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [rideType, setRideType] = useState<"now" | "later">("now");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupSearch, setPickupSearch] = useState("");
  const [dropSearch, setDropSearch] = useState("");
  const [showPickupPopover, setShowPickupPopover] = useState(false);
  const [showDropPopover, setShowDropPopover] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("");

  const filteredPickupLocations = POPULAR_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
    loc.area.toLowerCase().includes(pickupSearch.toLowerCase())
  );

  const filteredDropLocations = POPULAR_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
    loc.area.toLowerCase().includes(dropSearch.toLowerCase())
  );

  const swapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(dropLocation);
    setDropLocation(temp);
  };

  const selectedPickup = POPULAR_LOCATIONS.find(l => l.id === pickupLocation);
  const selectedDrop = POPULAR_LOCATIONS.find(l => l.id === dropLocation);

  const mapPickup = selectedPickup ? { lat: selectedPickup.lat, lng: selectedPickup.lng, address: selectedPickup.name } : undefined;
  const mapDrop = selectedDrop ? { lat: selectedDrop.lat, lng: selectedDrop.lng, address: selectedDrop.name } : undefined;

  const handleContinue = (vehicleType: string) => {
    if (!pickupLocation || !dropLocation) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select both pickup and drop locations",
        variant: "destructive"
      });
      return;
    }

    if (rideType === "later" && (!scheduleDate || !scheduleTime)) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select date and time for scheduled ride",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams({
      pickup: pickupLocation,
      drop: dropLocation,
      vehicleType: vehicleType,
      rideType,
      ...(scheduleDate && { scheduleDate: format(scheduleDate, "yyyy-MM-dd") }),
      ...(scheduleTime && { scheduleTime })
    });

    navigate(`/booking/cab/results?${params.toString()}`);
  };

  return (
    <>
      <TicketHeader 
        title="BOOK CAB" 
        subtitle="Ride with confidence"
        backPath="/home"
        ticketsPath="/all-tickets?type=taxi&status=all"
        ticketIcon={<Car className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-16 pb-0">
          
          <div className="px-4 py-6 space-y-6 max-w-screen-lg mx-auto">
            <div className="flex gap-2">
              {[
                { value: "now", label: "RIDE NOW", icon: Navigation },
                { value: "later", label: "SCHEDULE", icon: Clock }
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setRideType(type.value as any)}
                    className={cn(
                      "flex-1 py-3 px-4 border transition-all text-xs tracking-wider font-light rounded-none flex items-center justify-center gap-2",
                      rideType === type.value
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                    )}
                    data-testid={`button-ride-${type.value}`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            <div className="relative bg-white/5 border border-white/20 p-6 rounded-none space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  PICKUP LOCATION
                </Label>
                <Popover open={showPickupPopover} onOpenChange={setShowPickupPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto py-3 px-0 hover:bg-transparent hover:border-white",
                        !pickupLocation && "text-white/50"
                      )}
                      data-testid="button-pickup"
                    >
                      {selectedPickup ? (
                        <div className="flex flex-col items-start w-full">
                          <div className="text-base font-light">{selectedPickup.name}</div>
                          <span className="text-xs text-white/40 font-light">{selectedPickup.area}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-light">Enter pickup location</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] bg-black border-white/20 p-0" align="start">
                    <Input
                      placeholder="Search locations..."
                      value={pickupSearch}
                      onChange={(e) => setPickupSearch(e.target.value)}
                      className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                      data-testid="input-pickup-search"
                      autoFocus
                    />
                    <div className="max-h-64 overflow-y-auto">
                      {filteredPickupLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => {
                            setPickupLocation(location.id);
                            setPickupSearch("");
                            setShowPickupPopover(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                          data-testid={`option-pickup-${location.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-full">
                              <MapPin className="h-4 w-4 text-white/60" />
                            </div>
                            <div>
                              <div className="font-light text-white">{location.name}</div>
                              <div className="text-xs text-white/60 font-light">{location.area}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-center -my-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapLocations}
                  disabled={!pickupLocation || !dropLocation}
                  className="bg-white/10 text-white hover:bg-white/20 rounded-full h-8 w-8 p-0 disabled:opacity-30"
                  data-testid="button-swap"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  DROP LOCATION
                </Label>
                <Popover open={showDropPopover} onOpenChange={setShowDropPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto py-3 px-0 hover:bg-transparent hover:border-white",
                        !dropLocation && "text-white/50"
                      )}
                      data-testid="button-drop"
                    >
                      {selectedDrop ? (
                        <div className="flex flex-col items-start w-full">
                          <div className="text-base font-light">{selectedDrop.name}</div>
                          <span className="text-xs text-white/40 font-light">{selectedDrop.area}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-light">Enter drop location</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] bg-black border-white/20 p-0" align="start">
                    <Input
                      placeholder="Search locations..."
                      value={dropSearch}
                      onChange={(e) => setDropSearch(e.target.value)}
                      className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                      data-testid="input-drop-search"
                      autoFocus
                    />
                    <div className="max-h-64 overflow-y-auto">
                      {filteredDropLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => {
                            setDropLocation(location.id);
                            setDropSearch("");
                            setShowDropPopover(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                          data-testid={`option-drop-${location.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-full">
                              <MapPin className="h-4 w-4 text-white/60" />
                            </div>
                            <div>
                              <div className="font-light text-white">{location.name}</div>
                              <div className="text-xs text-white/60 font-light">{location.area}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {rideType === "later" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" />
                    DATE
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-12 px-4 hover:bg-transparent hover:border-white font-light",
                          !scheduleDate && "text-white/50"
                        )}
                        data-testid="button-schedule-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? format(scheduleDate, "dd MMM") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    TIME
                  </Label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 px-4 font-light focus:border-white"
                    data-testid="input-schedule-time"
                  />
                </div>
              </div>
            )}
          </div>

          <DarkMap 
            pickup={mapPickup}
            drop={mapDrop}
            className="h-[300px] w-full"
            showRoute={!!mapPickup && !!mapDrop}
          />

          {pickupLocation && dropLocation && (
            <div className="px-4 pt-6 pb-8 space-y-3 max-w-screen-lg mx-auto">
              <h3 className="text-xs uppercase tracking-widest text-white/60 font-light mb-4">Select Vehicle</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {VEHICLE_TYPES.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleContinue(vehicle.id)}
                    className={cn(
                      "relative p-4 border transition-all rounded-none text-left overflow-hidden group hover:border-yellow-500/50",
                      selectedVehicleType === vehicle.id
                        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500"
                        : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/20"
                    )}
                    data-testid={`button-vehicle-${vehicle.id}`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-2xl mb-1">{vehicle.icon}</div>
                          <div className="text-sm font-light text-white">{vehicle.name}</div>
                          <div className="text-xs text-white/60">{vehicle.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-light text-white">₹{vehicle.basePrice}</div>
                          <div className="text-[10px] text-white/40">base fare</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-white/60">
                          <Clock className="h-3 w-3" />
                          <span>{vehicle.eta}</span>
                        </div>
                        <div className="text-white/60">{vehicle.capacity} seats</div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                ))}
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-white/40 font-light">Tap on a vehicle to continue</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
