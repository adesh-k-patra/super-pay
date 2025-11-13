import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Navigation, Phone, User, Package as PackageIcon, CheckCircle, Clock, Truck, Star, ChevronDown, ChevronUp } from "lucide-react";

interface TrackingStep {
  status: string;
  time: string;
  completed: boolean;
  timestamp?: string;
}

export default function CourierTracking() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/booking/courier/tracking/:id");
  const [booking, setBooking] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("pending");
  const [eta, setEta] = useState<number>(15);
  const [distanceRemaining, setDistanceRemaining] = useState<number>(8.5);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulated real-time tracking data
  const [trackingData, setTrackingData] = useState({
    driverName: "Rajesh Kumar",
    driverRating: 4.8,
    driverTrips: 2453,
    vehicleNumber: "DL 3C AB 1234",
    currentLat: 28.7041,
    currentLng: 77.1025,
  });

  useEffect(() => {
    const bookingId = params?.id;
    if (!bookingId) return;

    const saved = localStorage.getItem('currentCourierBooking');
    let bookingData = null;

    if (saved) {
      const data = JSON.parse(saved);
      if (data.bookingId === bookingId) {
        bookingData = data;
      }
    }

    // If no booking found, create dummy data for demo purposes
    if (!bookingData) {
      bookingData = {
        bookingId: bookingId,
        pickupLocation: "Connaught Place, New Delhi - 110001",
        dropLocation: "Cyber Hub, DLF Phase 2, Gurugram - 122002",
        itemType: "parcels",
        weightKg: 5.5,
        quantity: 2,
        packageDescription: "Electronics - 2 laptops",
        bookingType: "ondemand",
        vehicle: {
          id: "auto",
          code: "auto",
          name: "Auto",
          description: "Medium parcels & boxes",
          maxWeightKg: 150,
          maxDimensions: "80×60×60 cm",
          basePrice: 89,
          pricePerKm: 12,
          eta: "15-20 mins",
          features: ["GPS Tracking", "Covered", "Best for parcels"]
        },
        contactDetails: {
          pickupContactName: "Amit Sharma",
          pickupContactPhone: "9876543210",
          dropContactName: "Priya Singh",
          dropContactPhone: "9876543211"
        },
        pricing: {
          basePrice: 89,
          distanceCharge: 102,
          platformFee: 10,
          insuranceCharge: 0,
          gst: 36,
          estimatedDistance: 8.5,
          total: 237
        },
        insuranceRequired: false,
        insuranceValue: 0,
        codRequired: false,
        codAmount: 0,
        paymentMethod: "online",
        totalAmount: 237,
        status: "in_transit",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 mins ago
      };
    }

    setBooking(bookingData);
    
    // Initialize status - use stored status if available, otherwise default based on payment method
    if (bookingData.status) {
      setCurrentStatus(bookingData.status);
    } else if (bookingData.paymentMethod === "online") {
      setCurrentStatus("driver_assigned");
    } else {
      setCurrentStatus("confirmed");
    }
  }, [params?.id]);

  // Simulate real-time tracking updates
  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate status progression
      setCurrentStatus(prev => {
        switch (prev) {
          case "confirmed":
            setTimeout(() => setCurrentStatus("driver_assigned"), 10000);
            return prev;
          case "driver_assigned":
            setTimeout(() => setCurrentStatus("pickup_started"), 15000);
            return prev;
          case "pickup_started":
            setTimeout(() => setCurrentStatus("picked_up"), 20000);
            return prev;
          case "picked_up":
            setTimeout(() => setCurrentStatus("in_transit"), 5000);
            return prev;
          case "in_transit":
            setTimeout(() => setCurrentStatus("arrived"), 30000);
            return prev;
          case "arrived":
            setTimeout(() => setCurrentStatus("delivered"), 10000);
            return prev;
          default:
            return prev;
        }
      });

      // Update ETA and distance
      setEta(prev => Math.max(0, prev - 0.5));
      setDistanceRemaining(prev => Math.max(0, prev - 0.1));

      // Simulate location updates (mock GPS coordinates)
      setTrackingData(prev => ({
        ...prev,
        currentLat: prev.currentLat + (Math.random() - 0.5) * 0.001,
        currentLng: prev.currentLng + (Math.random() - 0.5) * 0.001,
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [booking]);

  const getTrackingSteps = (): TrackingStep[] => {
    const now = new Date();
    const steps: TrackingStep[] = [
      {
        status: "Booking Confirmed",
        time: "2 mins ago",
        completed: true,
        timestamp: new Date(now.getTime() - 2 * 60000).toISOString()
      },
      {
        status: "Driver Assigned",
        time: currentStatus !== "confirmed" ? "1 min ago" : "Pending",
        completed: currentStatus !== "confirmed",
        timestamp: currentStatus !== "confirmed" ? new Date(now.getTime() - 1 * 60000).toISOString() : undefined
      },
      {
        status: "Pickup Started",
        time: ["picked_up", "in_transit", "arrived", "delivered"].includes(currentStatus) ? "Just now" : currentStatus === "pickup_started" ? "Now" : "Pending",
        completed: ["picked_up", "in_transit", "arrived", "delivered"].includes(currentStatus),
        timestamp: ["picked_up", "in_transit", "arrived", "delivered"].includes(currentStatus) ? new Date(now.getTime() - 0.5 * 60000).toISOString() : undefined
      },
      {
        status: "Package Picked Up",
        time: ["in_transit", "arrived", "delivered"].includes(currentStatus) ? "Just now" : currentStatus === "picked_up" ? "Now" : "Pending",
        completed: ["in_transit", "arrived", "delivered"].includes(currentStatus),
        timestamp: ["in_transit", "arrived", "delivered"].includes(currentStatus) ? new Date().toISOString() : undefined
      },
      {
        status: "In Transit",
        time: ["arrived", "delivered"].includes(currentStatus) ? "Ongoing" : currentStatus === "in_transit" ? "Now" : "Pending",
        completed: ["arrived", "delivered"].includes(currentStatus),
      },
      {
        status: "Arrived at Destination",
        time: currentStatus === "delivered" ? "2 mins ago" : currentStatus === "arrived" ? "Now" : "Pending",
        completed: currentStatus === "delivered",
        timestamp: currentStatus === "delivered" ? new Date(now.getTime() - 2 * 60000).toISOString() : undefined
      },
      {
        status: "Delivered",
        time: currentStatus === "delivered" ? "Just now" : "Pending",
        completed: currentStatus === "delivered",
        timestamp: currentStatus === "delivered" ? new Date().toISOString() : undefined
      }
    ];
    return steps;
  };

  const getStatusInfo = () => {
    switch (currentStatus) {
      case "confirmed":
        return {
          badge: "CONFIRMED",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          title: "Booking Confirmed",
          description: "We are assigning a driver for your delivery",
          icon: CheckCircle
        };
      case "driver_assigned":
        return {
          badge: "ASSIGNED",
          badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          title: "Driver Assigned",
          description: `Driver is ${eta} mins away from pickup location`,
          icon: User
        };
      case "pickup_started":
        return {
          badge: "EN ROUTE",
          badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
          title: "Pickup in Progress",
          description: `Driver is on the way. ETA: ${Math.round(eta)} mins`,
          icon: Truck
        };
      case "picked_up":
        return {
          badge: "PICKED UP",
          badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
          title: "Package Picked Up",
          description: "Driver has collected your package",
          icon: PackageIcon
        };
      case "in_transit":
        return {
          badge: "IN TRANSIT",
          badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
          title: "In Transit",
          description: `${distanceRemaining.toFixed(1)} km away • ETA: ${Math.round(eta)} mins`,
          icon: Navigation
        };
      case "arrived":
        return {
          badge: "ARRIVED",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          title: "Arrived at Destination",
          description: "Driver has reached the drop location",
          icon: MapPin
        };
      case "delivered":
        return {
          badge: "DELIVERED",
          badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
          title: "Delivered Successfully",
          description: "Your package has been delivered",
          icon: CheckCircle
        };
      default:
        return {
          badge: "PENDING",
          badgeColor: "bg-white/20 text-white border-white/30",
          title: "Processing",
          description: "Please wait...",
          icon: Clock
        };
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Loading tracking details...</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const trackingSteps = getTrackingSteps();

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="relative flex items-center justify-center py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking")}
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider uppercase">Track Shipment</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">{booking.bookingId}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Current Status */}
        <div className="mb-6 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 border border-white/20 bg-white/10 rounded-full flex items-center justify-center">
              <StatusIcon className="h-6 w-6 text-white" strokeWidth={1} />
            </div>
            <div>
              <Badge className={`${statusInfo.badgeColor} rounded-none text-xs px-2 py-0.5 font-light tracking-widest mb-1`}>
                {statusInfo.badge}
              </Badge>
              <h2 className="text-lg font-bold tracking-wide">{statusInfo.title}</h2>
            </div>
          </div>
          <p className="text-sm text-white/60 font-light">{statusInfo.description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1} />
              <span>Updated {Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)}s ago</span>
            </div>
            {currentStatus === "in_transit" && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" strokeWidth={1} />
                <span>Live tracking active</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Location (Simulated) */}
        {["pickup_started", "picked_up", "in_transit", "arrived"].includes(currentStatus) && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Live Location</h3>
            <div className="bg-white/5 h-48 flex items-center justify-center border border-white/10 relative">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-white/40 mx-auto mb-2" strokeWidth={1} />
                <p className="text-sm text-white/40">Map View</p>
                <p className="text-xs text-white/30 mt-1">
                  Lat: {trackingData.currentLat.toFixed(4)}, Lng: {trackingData.currentLng.toFixed(4)}
                </p>
              </div>
              <div className="absolute top-2 right-2 bg-green-500 text-black text-xs px-2 py-1 font-bold uppercase">
                LIVE
              </div>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Driver location updates every 5 seconds
            </p>
          </div>
        )}

        {/* Driver Details */}
        {["driver_assigned", "pickup_started", "picked_up", "in_transit", "arrived", "delivered"].includes(currentStatus) && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-white/60" strokeWidth={1} />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Driver Details</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-white/20 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white/60" strokeWidth={1} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{trackingData.driverName}</p>
                  <div className="flex items-center gap-1 text-xs text-white/50 font-light">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" strokeWidth={0} />
                    <span>{trackingData.driverRating} • {trackingData.driverTrips.toLocaleString()} deliveries</span>
                  </div>
                </div>
              </div>
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-4"
                data-testid="button-call-driver"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60 font-light">Vehicle</span>
              <span className="font-light">{booking.vehicle?.name || booking.vehicle} • {trackingData.vehicleNumber}</span>
            </div>
          </div>
        )}

        {/* Route Progress */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Route</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-white/40 flex items-center gap-1 hover:text-white/60"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                ["picked_up", "in_transit", "arrived", "delivered"].includes(currentStatus) ? "bg-green-500" : "bg-white/40"
              }`} />
              <div className="flex-1">
                <p className="text-white/40 text-xs uppercase tracking-widest font-light mb-0.5">Pickup</p>
                <p className="font-light">{booking.pickupLocation}</p>
                {showDetails && booking.contactDetails?.pickupContactName && (
                  <p className="text-xs text-white/50 mt-1">
                    {booking.contactDetails.pickupContactName} • {booking.contactDetails.pickupContactPhone}
                  </p>
                )}
              </div>
              {["picked_up", "in_transit", "arrived", "delivered"].includes(currentStatus) && (
                <CheckCircle className="h-4 w-4 text-green-500" strokeWidth={2} />
              )}
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                currentStatus === "delivered" ? "bg-green-500" : "bg-red-500"
              }`} />
              <div className="flex-1">
                <p className="text-white/40 text-xs uppercase tracking-widest font-light mb-0.5">Drop</p>
                <p className="font-light">{booking.dropLocation}</p>
                {showDetails && booking.contactDetails?.dropContactName && (
                  <p className="text-xs text-white/50 mt-1">
                    {booking.contactDetails.dropContactName} • {booking.contactDetails.dropContactPhone}
                  </p>
                )}
              </div>
              {currentStatus === "delivered" && (
                <CheckCircle className="h-4 w-4 text-green-500" strokeWidth={2} />
              )}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Tracking Timeline</h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center shrink-0 ${
                  step.completed ? "border-white bg-white" : "border-white/30 bg-transparent"
                }`}>
                  {step.completed && (
                    <CheckCircle className="h-4 w-4 text-black" strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-light ${step.completed ? "text-white" : "text-white/40"}`}>
                      {step.status}
                    </p>
                    <p className="text-xs text-white/40 font-light">{step.time}</p>
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`w-0.5 h-8 ml-3 mt-2 ${
                      step.completed ? "bg-white/30" : "bg-white/10"
                    }`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Info */}
        <div className="border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <PackageIcon className="h-4 w-4 text-white/60" strokeWidth={1} />
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Package Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Item Type</span>
              <span className="font-light capitalize">{booking.itemType?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Weight</span>
              <span className="font-light">{booking.weightKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Amount</span>
              <span className="font-light">₹{Math.round(booking.pricing?.total || booking.totalAmount || 0)}</span>
            </div>
            {booking.insuranceRequired && (
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Insurance</span>
                <span className="font-light text-green-400">₹{booking.insuranceValue?.toLocaleString()}</span>
              </div>
            )}
            {booking.codRequired && (
              <div className="flex justify-between">
                <span className="text-white/60 font-light">COD Amount</span>
                <span className="font-light text-blue-400">₹{booking.codAmount?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          {currentStatus === "delivered" ? (
            <Button
              onClick={() => navigate("/booking")}
              className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none"
              data-testid="button-close"
            >
              CLOSE
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/booking")}
                className="h-12 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-none"
                data-testid="button-back-home"
              >
                BACK TO HOME
              </Button>
              <Button
                className="h-12 bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-get-help"
              >
                GET HELP
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
