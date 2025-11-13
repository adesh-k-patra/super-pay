import { useState } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Circle,
  MapPin,
  User,
  Star,
  Phone,
  Car,
  Clock,
  CreditCard,
  Wallet,
  Building2,
  Tag,
  ChevronRight,
  CheckCircle,
  Shield
} from "lucide-react";

export default function CabBookingConfirm() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<string>("wallet");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Get query params
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get('from') || "Pickup Location";
  const to = urlParams.get('to') || "Dropoff Location";
  const type = urlParams.get('type') || "economy";
  const price = parseFloat(urlParams.get('price') || "150");

  // Mock driver data
  const driver = {
    id: "driver1",
    name: "Rajesh Kumar",
    rating: 4.8,
    totalTrips: 1243,
    phone: "+91 98765 43210",
    vehicleMake: "Maruti",
    vehicleModel: "Swift Dzire",
    vehicleNumber: "DL 01 AB 1234",
    vehicleColor: "White",
    photo: null,
    eta: 3
  };

  // Fare breakdown
  const baseFare = price * 0.7;
  const distance = 8.5; // km
  const distanceFare = price * 0.3;
  const platformFee = 15;
  const gst = (baseFare + distanceFare + platformFee) * 0.05;
  const subtotal = baseFare + distanceFare + platformFee + gst;
  const total = subtotal - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "FIRST50") {
      setDiscount(50);
      toast({
        title: "Promo Applied!",
        description: "You saved ₹50 on this ride",
      });
    } else if (promoCode) {
      toast({
        title: "Invalid Promo Code",
        description: "Please check and try again",
        variant: "destructive"
      });
    }
  };

  const handleConfirmBooking = () => {
    if (!paymentMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please choose a payment method to continue",
        variant: "destructive"
      });
      return;
    }

    // Navigate to success page
    navigate(`/booking/cab/success?bookingId=CAB${Date.now()}&driver=${driver.name}&price=${total}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.history.length > 1) {
                  goBack();
                } else {
                  navigate("/cab-selection");
                }
              }}
              className="text-white hover:bg-white/10 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold tracking-wider">CONFIRM BOOKING</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Map Preview */}
        <div className="relative h-48 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 mb-6 overflow-hidden">
          {/* Grid overlay for map feel */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }} />
          
          {/* Route line */}
          <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-blue-500/50" />
          
          {/* Markers */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
            <Circle className="h-4 w-4 fill-green-400 text-green-400" />
          </div>
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2">
            <Circle className="h-4 w-4 fill-red-400 text-red-400" />
          </div>

          {/* Distance badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur">
              {distance} km • ~{Math.ceil(distance / 30 * 60)} min
            </Badge>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white mb-1" data-testid="text-driver-name">{driver.name}</h3>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{driver.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{driver.totalTrips} trips</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Car className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">
                    {driver.vehicleMake} {driver.vehicleModel} • {driver.vehicleNumber}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-call-driver"
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="bg-white/10 my-4" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Arrival time</span>
            <div className="flex items-center gap-2 text-white font-medium">
              <Clock className="h-4 w-4" />
              <span>{driver.eta} minutes</span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
            Trip Details
          </h3>
          
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
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
            Fare Breakdown
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Base fare</span>
              <span className="text-white">₹{Math.round(baseFare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Distance fare ({distance} km)</span>
              <span className="text-white">₹{Math.round(distanceFare)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Platform fee</span>
              <span className="text-white">₹{platformFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">GST (5%)</span>
              <span className="text-white">₹{Math.round(gst)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Promo discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            
            <Separator className="bg-white/10" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-white" data-testid="text-total">₹{Math.round(total)}</span>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
            Promo Code
          </h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              data-testid="input-promo"
            />
            <Button
              onClick={handleApplyPromo}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
              data-testid="button-apply-promo"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
            Payment Method
          </h3>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-colors" htmlFor="wallet">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white font-medium">SuperPay Wallet</p>
                    <p className="text-xs text-white/50">Balance: ₹2,450</p>
                  </div>
                </div>
                <RadioGroupItem value="wallet" id="wallet" data-testid="radio-wallet" />
              </label>

              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-colors" htmlFor="upi">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white font-medium">UPI</p>
                    <p className="text-xs text-white/50">Pay via UPI apps</p>
                  </div>
                </div>
                <RadioGroupItem value="upi" id="upi" data-testid="radio-upi" />
              </label>

              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-colors" htmlFor="card">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white font-medium">Credit/Debit Card</p>
                    <p className="text-xs text-white/50">Pay securely with card</p>
                  </div>
                </div>
                <RadioGroupItem value="card" id="card" data-testid="radio-card" />
              </label>

              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/30 cursor-pointer transition-colors" htmlFor="cash">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white font-medium">Cash</p>
                    <p className="text-xs text-white/50">Pay driver directly</p>
                  </div>
                </div>
                <RadioGroupItem value="cash" id="cash" data-testid="radio-cash" />
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Safety Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-medium text-sm mb-1">Your Safety Matters</p>
              <p className="text-white/60 text-xs">
                Share your trip with friends and family for added security. Emergency SOS available in-app.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 p-4 z-30">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={handleConfirmBooking}
            className="w-full h-14 bg-white text-black hover:bg-white/90 font-light tracking-wider text-lg"
            data-testid="button-confirm-booking"
          >
            CONFIRM BOOKING • ₹{Math.round(total)}
          </Button>
        </div>
      </div>
    </div>
  );
}
