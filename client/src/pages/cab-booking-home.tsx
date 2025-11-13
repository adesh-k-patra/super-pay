import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Search,
  Star,
  User,
  Circle,
  ChevronDown,
  Plus,
  Sparkles
} from "lucide-react";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface AvailableCab {
  id: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleNumber: string;
  latitude: number;
  longitude: number;
  eta: number; // minutes
  distance: number; // km
}

// Mock available cabs data
const MOCK_AVAILABLE_CABS: AvailableCab[] = [
  {
    id: "cab1",
    driverId: "driver1",
    driverName: "Rajesh Kumar",
    driverRating: 4.8,
    vehicleType: "economy",
    vehicleMake: "Maruti",
    vehicleModel: "Swift Dzire",
    vehicleNumber: "DL-01-AB-1234",
    latitude: 28.6139,
    longitude: 77.2090,
    eta: 3,
    distance: 0.8
  },
  {
    id: "cab2",
    driverId: "driver2",
    driverName: "Amit Singh",
    driverRating: 4.9,
    vehicleType: "premium",
    vehicleMake: "Honda",
    vehicleModel: "City",
    vehicleNumber: "DL-02-CD-5678",
    latitude: 28.6149,
    longitude: 77.2100,
    eta: 5,
    distance: 1.2
  },
  {
    id: "cab3",
    driverId: "driver3",
    driverName: "Vikram Sharma",
    driverRating: 5.0,
    vehicleType: "luxury",
    vehicleMake: "Toyota",
    vehicleModel: "Innova Crysta",
    vehicleNumber: "DL-03-EF-9012",
    latitude: 28.6129,
    longitude: 77.2080,
    eta: 4,
    distance: 1.0
  }
];

// Mock location suggestions
const MOCK_LOCATIONS = [
  { address: "Connaught Place, New Delhi", latitude: 28.6304, longitude: 77.2177 },
  { address: "India Gate, New Delhi", latitude: 28.6129, longitude: 77.2295 },
  { address: "Qutub Minar, New Delhi", latitude: 28.5244, longitude: 77.1855 },
  { address: "Red Fort, New Delhi", latitude: 28.6562, longitude: 77.2410 },
  { address: "Lotus Temple, New Delhi", latitude: 28.5535, longitude: 77.2588 },
  { address: "IGI Airport T3, New Delhi", latitude: 28.5562, longitude: 77.1000 }
];

export default function CabBookingHome() {
  const [, navigate] = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [pickupInput, setPickupInput] = useState("");
  const [dropoffInput, setDropoffInput] = useState("");
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [availableCabs, setAvailableCabs] = useState<AvailableCab[]>([]);
  const [hoveredCabId, setHoveredCabId] = useState<string | null>(null);

  // Filter suggestions based on input
  const pickupSuggestions = MOCK_LOCATIONS.filter(loc =>
    loc.address.toLowerCase().includes(pickupInput.toLowerCase())
  );
  const dropoffSuggestions = MOCK_LOCATIONS.filter(loc =>
    loc.address.toLowerCase().includes(dropoffInput.toLowerCase())
  );

  // Load available cabs when pickup is selected
  useEffect(() => {
    if (pickupLocation) {
      setAvailableCabs(MOCK_AVAILABLE_CABS);
    }
  }, [pickupLocation]);

  const handleGetCurrentLocation = () => {
    setIsLocatingUser(true);
    // Simulate geolocation
    setTimeout(() => {
      const currentLoc = {
        address: "Your Current Location (Connaught Place, New Delhi)",
        latitude: 28.6304,
        longitude: 77.2177
      };
      setPickupLocation(currentLoc);
      setPickupInput(currentLoc.address);
      setIsLocatingUser(false);
    }, 1000);
  };

  const handlePickupSelect = (location: Location) => {
    setPickupLocation(location);
    setPickupInput(location.address);
    setShowPickupSuggestions(false);
  };

  const handleDropoffSelect = (location: Location) => {
    setDropoffLocation(location);
    setDropoffInput(location.address);
    setShowDropoffSuggestions(false);
  };

  const handleContinue = () => {
    if (pickupLocation && dropoffLocation) {
      // Pass location data to cab selection page
      navigate(`/booking/cab/select?from=${encodeURIComponent(pickupLocation.address)}&to=${encodeURIComponent(dropoffLocation.address)}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Map Container */}
      <div className="relative h-screen">
        {/* Dark Map Placeholder with Grid */}
        <div 
          ref={mapContainerRef}
          className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900"
        >
          {/* Grid overlay for map feel */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
          
          {/* Available cab markers */}
          {availableCabs.map(cab => (
            <div
              key={cab.id}
              className={`absolute transition-all duration-300 ${
                hoveredCabId === cab.id ? 'scale-125 z-20' : 'scale-100 z-10'
              }`}
              style={{
                left: `${(cab.longitude - 77.15) * 1000 + 20}%`,
                top: `${(28.70 - cab.latitude) * 1000 + 30}%`
              }}
              onMouseEnter={() => setHoveredCabId(cab.id)}
              onMouseLeave={() => setHoveredCabId(null)}
            >
              <div className={`relative ${
                cab.vehicleType === 'economy' ? 'text-blue-400' : 
                cab.vehicleType === 'premium' ? 'text-yellow-400' : 'text-purple-400'
              }`}>
                <Circle className="h-4 w-4 fill-current" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {cab.vehicleMake} - {cab.eta}min
                </div>
              </div>
            </div>
          ))}

          {/* Center location indicator */}
          {pickupLocation && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                <MapPin className="h-8 w-8 text-white drop-shadow-lg" fill="white" />
              </div>
            </div>
          )}
        </div>

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-trips")}
              className="text-white hover:bg-white/10 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur">
                <MapPin className="h-3 w-3 mr-1" />
                {availableCabs.length} cabs nearby
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom Sheet - Location Input */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black to-transparent">
          <div className="max-w-2xl mx-auto p-6 pb-8">
            {/* Title */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 border border-white/20">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-wider">BOOK A CAB</h1>
              </div>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                Enter your pickup and dropoff locations
              </p>
            </div>

            {/* Location Inputs */}
            <div className="space-y-4">
              {/* Pickup Location */}
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <Circle className="h-3 w-3 fill-green-400 text-green-400" />
                    <div className="h-8 w-px bg-white/20" />
                  </div>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Enter pickup location"
                      value={pickupInput}
                      onChange={(e) => {
                        setPickupInput(e.target.value);
                        setShowPickupSuggestions(true);
                      }}
                      onFocus={() => setShowPickupSuggestions(true)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 pr-12"
                      data-testid="input-pickup"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocatingUser}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10"
                      data-testid="button-current-location"
                    >
                      {isLocatingUser ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Navigation className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Pickup Suggestions */}
                {showPickupSuggestions && pickupInput && (
                  <div className="absolute top-full mt-2 left-10 right-0 bg-zinc-900 border border-white/20 rounded-lg overflow-hidden z-50">
                    {pickupSuggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePickupSelect(loc)}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/10 last:border-0"
                        data-testid={`suggestion-pickup-${idx}`}
                      >
                        <MapPin className="h-4 w-4 text-white/40" />
                        <span className="text-white">{loc.address}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropoff Location */}
              <div className="relative">
                <div className="flex items-center gap-3">
                  <Circle className="h-3 w-3 fill-red-400 text-red-400" />
                  <div className="flex-1">
                    <Input
                      placeholder="Enter dropoff location"
                      value={dropoffInput}
                      onChange={(e) => {
                        setDropoffInput(e.target.value);
                        setShowDropoffSuggestions(true);
                      }}
                      onFocus={() => setShowDropoffSuggestions(true)}
                      disabled={!pickupLocation}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 disabled:opacity-50"
                      data-testid="input-dropoff"
                    />
                  </div>
                </div>

                {/* Dropoff Suggestions */}
                {showDropoffSuggestions && dropoffInput && (
                  <div className="absolute top-full mt-2 left-10 right-0 bg-zinc-900 border border-white/20 rounded-lg overflow-hidden z-50">
                    {dropoffSuggestions.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDropoffSelect(loc)}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/10 last:border-0"
                        data-testid={`suggestion-dropoff-${idx}`}
                      >
                        <MapPin className="h-4 w-4 text-white/40" />
                        <span className="text-white">{loc.address}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                disabled={!pickupLocation || !dropoffLocation}
                className="w-full h-12 bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed font-semibold tracking-wider"
                data-testid="button-continue"
              >
                CONTINUE
              </Button>
            </div>

            {/* Quick Info */}
            {pickupLocation && availableCabs.length > 0 && (
              <div className="mt-6 flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Avg. arrival: 3-5 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8+ rated drivers</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
