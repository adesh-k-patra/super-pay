import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  CheckCircle,
  MapPin,
  User,
  Star,
  Phone,
  Car,
  Clock,
  Circle,
  Navigation,
  MessageSquare,
  Share2,
  Download,
  ArrowLeft
} from "lucide-react";

export default function CabBookingSuccess() {
  const [, navigate] = useLocation();
  const [trackingStatus, setTrackingStatus] = useState<"arriving" | "enroute" | "completed">("arriving");
  const [estimatedArrival, setEstimatedArrival] = useState(3);

  // Get query params
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('bookingId') || `CAB${Date.now()}`;
  const driverName = urlParams.get('driver') || "Rajesh Kumar";
  const price = parseFloat(urlParams.get('price') || "150");

  // Mock driver data
  const driver = {
    name: driverName,
    rating: 4.8,
    phone: "+91 98765 43210",
    vehicleMake: "Maruti",
    vehicleModel: "Swift Dzire",
    vehicleNumber: "DL 01 AB 1234",
    vehicleColor: "White",
    photo: null
  };

  // Simulate tracking updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (trackingStatus === "arriving" && estimatedArrival > 0) {
        setEstimatedArrival(prev => Math.max(0, prev - 1));
      }
    }, 60000); // Update every minute

    return () => clearTimeout(timer);
  }, [trackingStatus, estimatedArrival]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-green-900/20 via-black to-black border-b border-white/10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-4 text-white hover:bg-white/10"
            onClick={() => navigate("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-wider">BOOKING CONFIRMED!</h1>
            <p className="text-white/60 mb-4">Your cab is on the way</p>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-2">
              <span className="text-xs text-white/50 uppercase tracking-wider">Booking ID:</span>
              <span className="text-white font-mono font-medium" data-testid="text-booking-id">{bookingId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl pb-32">
        {/* Live Tracking Map */}
        <div className="relative h-64 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 mb-6 overflow-hidden">
          {/* Grid overlay for map feel */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
          
          {/* Animated route */}
          <div className="absolute top-1/3 left-1/4 right-1/2 h-px bg-blue-500/50 animate-pulse" />
          
          {/* Driver location (moving) */}
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30" />
              <Car className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          
          {/* Pickup location */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Circle className="h-4 w-4 fill-green-400 text-green-400" />
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500/20 text-red-400 border-red-500 backdrop-blur animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
          </div>

          {/* ETA */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur" data-testid="badge-eta">
              <Clock className="h-3 w-3 mr-1" />
              {estimatedArrival} min away
            </Badge>
          </div>
        </div>

        {/* Driver Info Card */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-white mb-1" data-testid="text-driver-name">{driver.name}</h3>
                <div className="flex items-center gap-3 text-sm text-white/60 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{driver.rating}</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                    Verified Driver
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">
                    {driver.vehicleColor} {driver.vehicleMake} {driver.vehicleModel}
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-white mt-2" data-testid="text-vehicle-number">
                  {driver.vehicleNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex-col h-auto py-3"
              data-testid="button-call"
            >
              <Phone className="h-5 w-5 mb-1" />
              <span className="text-xs">Call</span>
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex-col h-auto py-3"
              data-testid="button-message"
            >
              <MessageSquare className="h-5 w-5 mb-1" />
              <span className="text-xs">Message</span>
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex-col h-auto py-3"
              data-testid="button-share"
            >
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Share Trip</span>
            </Button>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
            Trip Details
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-2 pt-1">
                <Circle className="h-3 w-3 fill-green-400 text-green-400" />
                <div className="h-12 w-px bg-white/20" />
                <Circle className="h-3 w-3 fill-red-400 text-red-400" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Pickup</p>
                  <p className="text-white font-medium">Connaught Place, New Delhi</p>
                  <p className="text-xs text-white/40 mt-1">In 3 minutes</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Dropoff</p>
                  <p className="text-white font-medium">India Gate, New Delhi</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10 mb-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Ride type</span>
              <span className="text-white">HexRide Economy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Estimated fare</span>
              <span className="text-white font-bold" data-testid="text-fare">₹{Math.round(price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Payment method</span>
              <span className="text-white">SuperPay Wallet</span>
            </div>
          </div>
        </div>

        {/* Safety Features */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 mb-6">
          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-medium text-sm mb-2">Safety Features Active</p>
              <ul className="space-y-1 text-xs text-white/60">
                <li>• Live trip tracking enabled</li>
                <li>• Emergency SOS available</li>
                <li>• Trip details shared with emergency contacts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="text-center">
          <p className="text-white/50 text-sm mb-2">Need help?</p>
          <Button
            variant="link"
            className="text-white underline"
            onClick={() => navigate("/support")}
            data-testid="button-support"
          >
            Contact Support
          </Button>
        </div>
      </div>

      {/* Fixed Actions at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-black/95 border-t border-white/10 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 h-12"
              data-testid="button-download-receipt"
            >
              <Download className="h-4 w-4 mr-2" />
              Receipt
            </Button>
            <Button
              onClick={() => navigate("/my-trips")}
              className="bg-white text-black hover:bg-white/90 h-12 font-semibold"
              data-testid="button-my-trips"
            >
              <Home className="h-4 w-4 mr-2" />
              My Trips
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
