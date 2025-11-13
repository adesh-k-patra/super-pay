import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Car,
  Clock,
  Star,
  Users,
  Sparkles,
  Shield,
  Zap,
  Circle,
  MapPin,
  ChevronRight
} from "lucide-react";

interface CabType {
  id: string;
  name: string;
  displayName: string;
  icon: React.ReactNode;
  description: string;
  capacity: number;
  basePrice: number;
  pricePerKm: number;
  estimatedPrice: number;
  eta: number; // minutes
  available: number;
  features: string[];
  color: string;
  bgGradient: string;
}

const CAB_TYPES: CabType[] = [
  {
    id: "economy",
    name: "Economy",
    displayName: "HexRide Economy",
    icon: <Car className="h-6 w-6" />,
    description: "Affordable rides for daily commute",
    capacity: 4,
    basePrice: 50,
    pricePerKm: 12,
    estimatedPrice: 0,
    eta: 3,
    available: 12,
    features: ["AC", "Clean vehicle", "Experienced driver"],
    color: "text-blue-400",
    bgGradient: "from-blue-500/10 to-blue-500/5"
  },
  {
    id: "premium",
    name: "Premium",
    displayName: "HexRide Premium",
    icon: <Sparkles className="h-6 w-6" />,
    description: "Comfortable sedans with top-rated drivers",
    capacity: 4,
    basePrice: 100,
    pricePerKm: 18,
    estimatedPrice: 0,
    eta: 5,
    available: 8,
    features: ["Premium sedan", "5★ drivers", "Sanitized interior", "Water bottles"],
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/10 to-yellow-500/5"
  },
  {
    id: "luxury",
    name: "Luxury",
    displayName: "HexRide Luxury",
    icon: <Shield className="h-6 w-6" />,
    description: "Premium SUVs for a luxurious experience",
    capacity: 6,
    basePrice: 200,
    pricePerKm: 25,
    estimatedPrice: 0,
    eta: 4,
    available: 5,
    features: ["Luxury SUV", "Professional chauffeur", "Premium amenities", "Extra space"],
    color: "text-purple-400",
    bgGradient: "from-purple-500/10 to-purple-500/5"
  }
];

export default function CabSelection() {
  const [, navigate] = useLocation();
  const [selectedCabType, setSelectedCabType] = useState<string | null>(null);
  const [cabTypes, setCabTypes] = useState<CabType[]>([]);

  // Get query params
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get('from') || "Pickup Location";
  const to = urlParams.get('to') || "Dropoff Location";

  // Calculate estimated distance (mock - in real app, use Google Maps API)
  const estimatedDistance = 8.5; // km

  useEffect(() => {
    // Calculate prices based on distance
    const updatedCabTypes = CAB_TYPES.map(cab => ({
      ...cab,
      estimatedPrice: cab.basePrice + (cab.pricePerKm * estimatedDistance)
    }));
    setCabTypes(updatedCabTypes);
  }, []);

  const handleSelectCab = (cabTypeId: string) => {
    setSelectedCabType(cabTypeId);
    const selectedCab = cabTypes.find(c => c.id === cabTypeId);
    if (selectedCab) {
      navigate(`/booking/cab/confirm?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&type=${cabTypeId}&price=${selectedCab.estimatedPrice}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/booking/cab")}
              className="text-white hover:bg-white/10 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold tracking-wider">SELECT RIDE</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Trip Summary */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-2 pt-1">
                <Circle className="h-3 w-3 fill-green-400 text-green-400" />
                <div className="h-12 w-px bg-white/20" />
                <Circle className="h-3 w-3 fill-red-400 text-red-400" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Pickup</p>
                  <p className="text-white font-medium" data-testid="text-pickup">{from}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Dropoff</p>
                  <p className="text-white font-medium" data-testid="text-dropoff">{to}</p>
                </div>
              </div>
            </div>
            
            <Separator className="bg-white/10" />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="h-4 w-4" />
                <span>{estimatedDistance} km</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="h-4 w-4" />
                <span>~{Math.ceil(estimatedDistance / 30 * 60)} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cab Types */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-white/60 font-medium">
            Available Rides
          </h2>
          
          {cabTypes.map((cab) => (
            <div
              key={cab.id}
              onClick={() => handleSelectCab(cab.id)}
              className={`
                bg-gradient-to-r ${cab.bgGradient} 
                border border-white/10 hover:border-white/30 
                p-6 cursor-pointer transition-all duration-300
                ${selectedCabType === cab.id ? 'border-white/50 scale-[1.02]' : ''}
              `}
              data-testid={`card-cab-${cab.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Cab Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${cab.color}`}>
                      {cab.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{cab.displayName}</h3>
                      <p className="text-sm text-white/50">{cab.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-white/10 text-white/80 border-white/20 text-xs" data-testid={`badge-capacity-${cab.id}`}>
                      <Users className="h-3 w-3 mr-1" />
                      {cab.capacity} seats
                    </Badge>
                    <Badge className="bg-white/10 text-white/80 border-white/20 text-xs" data-testid={`badge-eta-${cab.id}`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {cab.eta} min
                    </Badge>
                    <Badge className="bg-white/10 text-white/80 border-white/20 text-xs" data-testid={`badge-available-${cab.id}`}>
                      {cab.available} nearby
                    </Badge>
                  </div>

                  {/* Feature List */}
                  <div className="flex flex-wrap gap-2">
                    {cab.features.map((feature, idx) => (
                      <span key={idx} className="text-xs text-white/60">
                        {feature}{idx < cab.features.length - 1 ? " •" : ""}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Price */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1" data-testid={`text-price-${cab.id}`}>
                    ₹{Math.round(cab.estimatedPrice)}
                  </div>
                  <p className="text-xs text-white/50">Estimated fare</p>
                  <ChevronRight className="h-5 w-5 text-white/40 ml-auto mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-white/5 border border-white/10 p-4">
          <p className="text-xs text-white/60 text-center">
            Prices may vary based on traffic conditions and time of day. Final fare will be calculated at trip completion.
          </p>
        </div>

        {/* Promo Section */}
        <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded">
              <Zap className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Save on your first ride!</p>
              <p className="text-white/60 text-xs">Use code FIRST50 for ₹50 off</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
