import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DarkMap } from "@/components/DarkMap";
import {
  ArrowLeft,
  Clock,
  Shield,
  Car,
  Bike,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface VehicleType {
  id: string;
  name: string;
  icon: React.ReactNode;
  estimatedTime: string;
  fare: number;
  capacity: string;
  description: string;
}

const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'bike',
    name: 'Bike',
    icon: <Bike className="h-8 w-8" />,
    estimatedTime: '2 min',
    fare: 45,
    capacity: '1 Passenger',
    description: 'Quick & Affordable'
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: <Car className="h-8 w-8" />,
    estimatedTime: '3 min',
    fare: 80,
    capacity: '3 Passengers',
    description: 'Compact & Economical'
  },
  {
    id: 'group-auto',
    name: 'Group Auto',
    icon: <Users className="h-8 w-8" />,
    estimatedTime: '4 min',
    fare: 95,
    capacity: '4 Passengers',
    description: 'Extra Space'
  },
  {
    id: 'sedan',
    name: 'Sedan',
    icon: <Car className="h-8 w-8" />,
    estimatedTime: '2 min',
    fare: 120,
    capacity: '4 Passengers',
    description: 'Comfortable & Clean'
  },
  {
    id: 'cab',
    name: 'Cab',
    icon: <Car className="h-8 w-8" />,
    estimatedTime: '3 min',
    fare: 135,
    capacity: '4 Passengers',
    description: 'Standard Ride'
  },
  {
    id: 'premium',
    name: 'Premium Car',
    icon: <Car className="h-8 w-8" />,
    estimatedTime: '5 min',
    fare: 180,
    capacity: '4 Passengers',
    description: 'Luxury Experience'
  }
];

const POPULAR_LOCATIONS = [
  { id: '1', name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: '2', name: 'India Gate', area: 'Central Delhi', lat: 28.6129, lng: 77.2295 },
];

export default function CabResults() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const pickupId = params.get('pickup') || '1';
  const dropId = params.get('drop') || '2';
  
  const pickup = POPULAR_LOCATIONS.find(l => l.id === pickupId);
  const drop = POPULAR_LOCATIONS.find(l => l.id === dropId);

  const handleBookRide = (vehicleTypeId: string) => {
    navigate(`/booking/cab/confirm?driverId=1&pickup=${pickupId}&drop=${dropId}&vehicleType=${vehicleTypeId}`);
  };

  const pagination = usePagination({
    data: VEHICLE_TYPES,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.history.length > 1) {
                goBack();
              } else {
                navigate("/booking/cab/search");
              }
            }}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">AVAILABLE RIDES</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{VEHICLE_TYPES.length} vehicle types</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-16">
        <DarkMap 
          pickup={pickup ? { lat: pickup.lat, lng: pickup.lng, address: pickup.name } : undefined}
          drop={drop ? { lat: drop.lat, lng: drop.lng, address: drop.name } : undefined}
          className="h-[280px] w-full"
          showRoute={true}
        />

        <div className="px-4 py-6 space-y-6 max-w-screen-lg mx-auto pb-8">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-white/60 text-xs uppercase tracking-wider">From</span>
                </div>
                <div className="font-light text-white">{pickup?.name}</div>
                <div className="text-xs text-white/40">{pickup?.area}</div>
              </div>
              <div className="text-yellow-500 text-xl">→</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <span className="text-white/60 text-xs uppercase tracking-wider">To</span>
                </div>
                <div className="font-light text-white">{drop?.name}</div>
                <div className="text-xs text-white/40">{drop?.area}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Select Vehicle Type</h2>
              <div className="text-xs text-white/40">Sorted by ETA</div>
            </div>
            
            {pagination.paginatedData.map((vehicle) => (
              <div
                key={vehicle.id}
                className={cn(
                  "relative border transition-all rounded-none overflow-hidden group cursor-pointer",
                  selectedVehicle === vehicle.id
                    ? "bg-gradient-to-br from-white/10 to-white/5 border-white/30"
                    : "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-white/30"
                )}
                onClick={() => setSelectedVehicle(vehicle.id)}
                data-testid={`vehicle-card-${vehicle.id}`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-4 border rounded-none transition-all",
                      selectedVehicle === vehicle.id
                        ? "bg-white/10 border-white/30 text-white"
                        : "bg-white/5 border-white/10 text-white/60"
                    )}>
                      {vehicle.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-light text-lg text-white mb-0.5">{vehicle.name}</h3>
                          <p className="text-xs text-white/50">{vehicle.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-light text-white">₹{vehicle.fare}</div>
                          <div className="text-[10px] text-white/40 uppercase">Est. Fare</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-white">{vehicle.estimatedTime}</span>
                          </div>
                          <span>•</span>
                          <span>{vehicle.capacity}</span>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookRide(vehicle.id);
                          }}
                          className={cn(
                            "h-9 rounded-none font-light text-xs tracking-wider transition-all px-6",
                            selectedVehicle === vehicle.id
                              ? "bg-white text-black hover:bg-white/90"
                              : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                          )}
                          data-testid={`button-book-${vehicle.id}`}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            ))}

            {VEHICLE_TYPES.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.goToPage}
                canGoNext={pagination.canGoNext}
                canGoPrevious={pagination.canGoPrevious}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
                className="mt-6"
              />
            )}
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-4 rounded-none flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <div className="font-light text-sm mb-1 text-white">Your Safety is Our Priority</div>
              <div className="text-xs text-white/60 font-light leading-relaxed">
                All drivers are verified with background checks. Share trip details with family for added security.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
