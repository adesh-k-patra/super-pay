import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Star,
  Download,
  Share2,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CabSuccess() {
  const [, navigate] = useLocation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const driver = {
    name: 'Rajesh Kumar',
    vehicleModel: 'Swift Dzire',
    vehicleNumber: 'DL 8C 1234',
    photo: ''
  };

  const rideDetails = {
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    pickup: 'Connaught Place',
    drop: 'India Gate',
    distance: '5.2 km',
    duration: '18 min',
    baseFare: 120,
    gst: 6,
    total: 126
  };

  const handleRating = (value: number) => {
    setRating(value);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-8">
      {/* Success Animation */}
      <div className="relative pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent"></div>
        <div className="relative text-center">
          <div className="inline-block p-6 rounded-full bg-green-500/20 mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-light mb-2 tracking-wider">RIDE COMPLETED</h1>
          <p className="text-white/60">Thank you for riding with us</p>
        </div>
      </div>

      <div className="px-4 space-y-6 max-w-screen-lg mx-auto">
        {/* Driver Rating */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 rounded-none">
              <AvatarImage src={driver.photo} />
              <AvatarFallback className="bg-white/10 text-white rounded-none">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-light text-lg mb-1">{driver.name}</h3>
              <p className="text-sm text-white/60">{driver.vehicleModel} • {driver.vehicleNumber}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-white/60 mb-3">How was your ride?</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                  data-testid={`star-${value}`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoveredRating >= value || rating >= value)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-white/20"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-green-500">Thank you for your feedback!</p>
            )}
          </div>
        </div>

        {/* Ride Summary */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Ride Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Date & Time</span>
              <span className="font-light">{rideDetails.date} • {rideDetails.time}</span>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="text-xs text-white/60">PICKUP</div>
                    <div className="font-light">{rideDetails.pickup}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="text-xs text-white/60">DROP</div>
                    <div className="font-light">{rideDetails.drop}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-white/60 mb-1">DISTANCE</div>
                <div className="font-light">{rideDetails.distance}</div>
              </div>
              <div>
                <div className="text-xs text-white/60 mb-1">DURATION</div>
                <div className="font-light">{rideDetails.duration}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Fare Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Base Fare</span>
              <span className="font-light">₹{rideDetails.baseFare}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">GST (5%)</span>
              <span className="font-light">₹{rideDetails.gst}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="font-light text-lg">Total Paid</span>
              <span className="text-3xl font-light">₹{rideDetails.total}</span>
            </div>
            <div className="text-xs text-center text-white/60 pt-2">
              Paid via Cash
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-12 rounded-none font-light"
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-12 rounded-none font-light"
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Home Button */}
        <Button
          onClick={() => navigate("/home")}
          className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-none font-light text-base tracking-widest"
          data-testid="button-home"
        >
          <Home className="h-5 w-5 mr-2" />
          GO TO HOME
        </Button>
      </div>
    </div>
  );
}
