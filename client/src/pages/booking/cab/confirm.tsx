import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DarkMap } from "@/components/DarkMap";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  Star,
  Shield,
  Phone,
  MessageCircle,
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  Info,
  ChevronRight,
  Clock,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const POPULAR_LOCATIONS = [
  { id: '1', name: 'Connaught Place', area: 'Central Delhi', lat: 28.6315, lng: 77.2167 },
  { id: '2', name: 'India Gate', area: 'Central Delhi', lat: 28.6129, lng: 77.2295 },
];

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'PhonePe, GooglePay, Paytm' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Credit or Debit Card' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Digital Wallet' },
  { id: 'cash', name: 'Cash', icon: Wallet, description: 'Pay after ride' }
];

export default function CabConfirm() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const pickupId = params.get('pickup') || '1';
  const dropId = params.get('drop') || '2';
  const driverId = params.get('driverId') || '1';

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
    estimatedTime: '2 min',
    distance: '0.8 km',
    phone: '+91 98765 43210',
    photo: '',
    badges: ['Top Rated', 'Safe Driver']
  };

  const fareBreakdown = {
    baseFare: 50,
    distanceFare: 56,
    timeFare: 8,
    gst: 6,
    surge: 0,
    total: 120
  };

  const basePrice = fareBreakdown.total;

  const calculateCouponDiscount = (): number => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.valueType === "percentage") {
      const discount = (basePrice * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    }
    return appliedCoupon.value;
  };

  const couponDiscount = calculateCouponDiscount();
  const totalPrice = Math.max(0, basePrice - couponDiscount);

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "BOOKING CONFIRMED",
      description: "Your driver is on the way!",
      variant: "default"
    });

    setIsBooking(false);
    navigate(`/booking/cab/tracking?bookingId=BK${Date.now()}`);
  };

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
                navigate("/booking/cab/results" + window.location.search);
              }
            }}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CONFIRM BOOKING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Review details</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-16">
        <DarkMap 
          pickup={pickup ? { lat: pickup.lat, lng: pickup.lng, address: pickup.name } : undefined}
          drop={drop ? { lat: drop.lat, lng: drop.lng, address: drop.name } : undefined}
          className="h-[240px] w-full"
          showRoute={true}
        />

        <div className="px-4 py-6 space-y-6 max-w-screen-lg mx-auto pb-32">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Your driver will arrive in <span className="text-green-500 font-medium">2 minutes</span></span>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-white/50 text-xs mb-0.5 uppercase tracking-wider">Pickup</div>
                    <div className="text-white font-light">{pickup?.name}</div>
                    <div className="text-xs text-white/40">{pickup?.area}</div>
                  </div>
                </div>
                <div className="pl-1 border-l-2 border-dashed border-white/20 h-6 ml-[4px]"></div>
                <div className="flex items-start gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-white/50 text-xs mb-0.5 uppercase tracking-wider">Drop</div>
                    <div className="text-white font-light">{drop?.name}</div>
                    <div className="text-xs text-white/40">{drop?.area}</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 mb-1">Est. Distance</div>
                <div className="text-lg font-light text-white">8.2 km</div>
                <div className="text-xs text-white/40 mt-2">Est. Time</div>
                <div className="text-lg font-light text-white">15 min</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-5 rounded-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-widest text-white/60 font-light">Your Driver</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                    data-testid="button-call"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                    data-testid="button-message"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16 rounded-full border-2 border-white/20">
                  <AvatarImage src={driver.photo} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white rounded-full text-lg font-light">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="text-lg font-light text-white mb-1">{driver.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/driver-profile?id=${driver.id}`)}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-2"
                  data-testid="button-view-profile"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-none">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/50 mb-1 uppercase text-[10px] tracking-wider">Vehicle</div>
                    <div className="font-light text-white">{driver.vehicleModel}</div>
                    <div className="text-white/40 text-xs">{driver.vehicleColor}</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1 uppercase text-[10px] tracking-wider">Number</div>
                    <div className="font-light font-mono text-white">{driver.vehicleNumber}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-none">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light mb-4">Payment Method</h3>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={cn(
                        "relative border rounded-none p-4 cursor-pointer transition-all",
                        paymentMethod === method.id
                          ? "bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border-yellow-500/50"
                          : "bg-white/[0.02] border-white/10 hover:border-white/30"
                      )}
                      onClick={() => setPaymentMethod(method.id)}
                      data-testid={`payment-${method.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} id={method.id} className="border-white/40" />
                        <div className="bg-white/10 p-2 rounded-full">
                          <Icon className="h-5 w-5 text-white/80" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="text-white font-light cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-xs text-white/40 font-light">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          <CouponSelector
            bookingAmount={basePrice}
            category="travel"
            onApplyCoupon={setAppliedCoupon}
            appliedCoupon={appliedCoupon}
          />

          <div className="bg-white/5 border border-white/10 p-5 rounded-none">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light mb-4 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Fare Breakdown
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Base Fare</span>
                <span className="text-white font-light">₹{fareBreakdown.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Distance Fare (8.2 km)</span>
                <span className="text-white font-light">₹{fareBreakdown.distanceFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Time Fare</span>
                <span className="text-white font-light">₹{fareBreakdown.timeFare}</span>
              </div>
              {fareBreakdown.surge > 0 && (
                <div className="flex justify-between text-yellow-500">
                  <span className="font-light">Surge Pricing</span>
                  <span className="font-light">₹{fareBreakdown.surge}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/60 font-light">GST (5%)</span>
                <span className="text-white font-light">₹{fareBreakdown.gst}</span>
              </div>
              
              <Separator className="bg-white/20 my-2" />
              
              <div className="flex justify-between text-lg pt-2">
                <span className="text-white font-medium">Subtotal</span>
                <span className="text-white font-medium">₹{basePrice}</span>
              </div>

              {appliedCoupon && couponDiscount > 0 && (
                <>
                  <div className="flex justify-between text-green-500">
                    <span className="font-light">Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-light">-₹{couponDiscount.toFixed(0)}</span>
                  </div>
                  
                  <Separator className="bg-white/20 my-2" />
                  
                  <div className="flex justify-between text-lg pt-2">
                    <span className="text-white font-medium">Total Fare</span>
                    <span className="text-white font-medium">₹{totalPrice.toFixed(0)}</span>
                  </div>
                </>
              )}

              {!appliedCoupon && (
                <div className="flex justify-between text-lg pt-2">
                  <span className="text-white font-medium">Total Fare</span>
                  <span className="text-white font-medium">₹{totalPrice.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-4 rounded-none flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-full flex-shrink-0">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <div className="font-light text-sm mb-1 text-white">Safe & Secure</div>
              <div className="text-xs text-white/60 font-light leading-relaxed">
                All rides are tracked in real-time. Share trip details with family for added security.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleConfirmBooking}
          disabled={isBooking}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-confirm"
        >
          {isBooking ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2" />
              Processing...
            </>
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <span>CONFIRM BOOKING</span>
              <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
