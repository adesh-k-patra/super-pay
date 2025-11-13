import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DarkMap } from "@/components/DarkMap";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Star,
  Phone,
  MessageCircle,
  Shield,
  Navigation,
  Info,
  Clock,
  MapPin,
  AlertCircle
} from "lucide-react";

const POPULAR_LOCATIONS = [
  { id: '1', name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: '2', name: 'India Gate', area: 'Central Delhi', lat: 28.6129, lng: 77.2295 },
];

export default function CabTracking() {
  const [, navigate] = useLocation();
  const [rideStatus, setRideStatus] = useState<'arriving' | 'arrived' | 'ongoing' | 'completed'>('ongoing');
  const [estimatedTime, setEstimatedTime] = useState(8);

  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('bookingId') || 'BK123456';
  const pickupId = '1';
  const dropId = '2';

  const pickup = POPULAR_LOCATIONS.find(l => l.id === pickupId);
  const drop = POPULAR_LOCATIONS.find(l => l.id === dropId);

  const driver = {
    id: '1',
    name: 'Rajesh Kumar',
    rating: 4.9,
    totalRides: 2850,
    vehicleModel: 'Honda City',
    vehicleNumber: 'DL 8C 1234',
    vehicleColor: 'White',
    photo: '',
    badges: ['Top Rated', 'Safe Driver']
  };

  const rideInfo = {
    bookingId: bookingId,
    distance: '8.2 km',
    duration: '15 min',
    fare: 120,
    paymentMethod: 'UPI'
  };

  const statusConfig = {
    arriving: {
      title: `Driver arriving in ${estimatedTime} min`,
      subtitle: 'Get ready at pickup location',
      color: 'from-blue-500/20 to-cyan-500/20',
      icon: Clock,
      animate: true
    },
    arrived: {
      title: 'Driver has arrived',
      subtitle: 'Please board the vehicle',
      color: 'from-green-500/20 to-emerald-500/20',
      icon: MapPin,
      animate: true
    },
    ongoing: {
      title: 'Ride in progress',
      subtitle: `${estimatedTime} min to destination`,
      color: 'from-yellow-500/20 to-orange-500/20',
      icon: Navigation,
      animate: false
    },
    completed: {
      title: 'Ride completed',
      subtitle: 'Thank you for riding with us',
      color: 'from-green-500/20 to-blue-500/20',
      icon: MapPin,
      animate: false
    }
  };

  const currentStatus = statusConfig[rideStatus];
  const StatusIcon = currentStatus.icon;

  const handleEndRide = () => {
    navigate(`/booking/cab/success?bookingId=${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-[55vh]">
        <DarkMap 
          pickup={pickup ? { lat: pickup.lat, lng: pickup.lng, address: pickup.name } : undefined}
          drop={drop ? { lat: drop.lat, lng: drop.lng, address: drop.name } : undefined}
          className="h-full w-full"
          showRoute={true}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/home")}
          className="absolute top-4 left-4 text-white bg-black/70 hover:bg-black/90 p-2 rounded-full border border-white/20 backdrop-blur-xl"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white bg-red-500/90 hover:bg-red-600 p-3 rounded-full border border-red-400/30 backdrop-blur-xl animate-pulse"
          data-testid="button-sos"
        >
          <AlertCircle className="h-5 w-5" />
        </Button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-none max-w-screen-lg mx-auto">
            <div className="flex items-center gap-3">
              <div className={cn(
                "bg-gradient-to-r p-2 rounded-full",
                currentStatus.color.replace('/20', '/30')
              )}>
                <StatusIcon className={cn(
                  "h-5 w-5 text-white",
                  currentStatus.animate && "animate-pulse"
                )} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-light text-white">{currentStatus.title}</div>
                <div className="text-xs text-white/60 font-light">{currentStatus.subtitle}</div>
              </div>
              {rideStatus === 'ongoing' && (
                <div className="text-right">
                  <div className="text-xs text-white/60">Distance</div>
                  <div className="text-sm font-light text-white">{rideInfo.distance}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-5 max-w-screen-lg mx-auto">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-5 rounded-none">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-16 w-16 rounded-full border-2 border-white/20">
              <AvatarImage src={driver.photo} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white rounded-full text-lg font-light">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-light text-lg text-white mb-1">{driver.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-white">{driver.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{driver.totalRides.toLocaleString()} trips</span>
                  </div>
                  {driver.badges.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {driver.badges.map((badge) => (
                        <Badge 
                          key={badge}
                          className="bg-white/10 text-white/80 border-white/20 text-[10px] px-2 py-0.5 rounded-full font-light"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full h-9 w-9 p-0"
                    data-testid="button-call"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full h-9 w-9 p-0"
                    data-testid="button-message"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-none">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-white/50 uppercase tracking-wider">Vehicle</div>
                    <div className="font-light text-white mt-0.5">{driver.vehicleModel}</div>
                    <div className="text-white/40 text-[10px]">{driver.vehicleColor}</div>
                  </div>
                  <div>
                    <div className="text-white/50 uppercase tracking-wider">Number</div>
                    <div className="font-light font-mono text-white mt-0.5">{driver.vehicleNumber}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Trip Route
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-xs text-white/60 mb-0.5">PICKUP</div>
                <div className="font-light text-white">{pickup?.name}</div>
                <div className="text-xs text-white/40">{pickup?.area}</div>
              </div>
            </div>
            
            <div className="pl-1 border-l-2 border-dashed border-white/20 h-4 ml-[4px]"></div>
            
            <div className="flex items-start gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-xs text-white/60 mb-0.5">DROP</div>
                <div className="font-light text-white">{drop?.name}</div>
                <div className="text-xs text-white/40">{drop?.area}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Ride Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Booking ID</div>
              <div className="font-mono text-sm font-light text-white">{rideInfo.bookingId}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Payment</div>
              <div className="font-light text-white">{rideInfo.paymentMethod}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Distance</div>
              <div className="font-light text-white">{rideInfo.distance}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">Fare</div>
              <div className="text-xl font-light text-white">₹{rideInfo.fare}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-4 rounded-none">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-full flex-shrink-0">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <div className="font-light text-sm mb-2 text-white">Safety Features Active</div>
              <div className="space-y-1.5 text-xs text-white/60 font-light">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Trip shared with emergency contacts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>SOS button available (top right)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Live location tracking enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {rideStatus !== 'completed' && (
          <Button
            onClick={handleEndRide}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 h-12 rounded-none font-light text-sm tracking-wider"
            data-testid="button-complete-ride"
          >
            COMPLETE RIDE (DEMO)
          </Button>
        )}
      </div>
    </div>
  );
}
