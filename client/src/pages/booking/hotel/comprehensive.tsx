import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  Hotel,
  Users,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Bed,
  Utensils,
  Clock,
  Plus,
  Minus,
  Shield,
  Building2,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOOKING_STAGES = [
  { id: "hotel", shortTitle: "Hotel", title: "Hotel Details", description: "Review your hotel selection", icon: Hotel },
  { id: "room", shortTitle: "Room", title: "Room Selection", description: "Choose your preferred room type", icon: Bed },
  { id: "guests", shortTitle: "Guests", title: "Number of Guests", description: "Specify number of adults and children", icon: Users },
  { id: "addons", shortTitle: "Add-ons", title: "Add-ons & Extras", description: "Enhance your stay with optional extras", icon: Plus },
  { id: "contact", shortTitle: "Contact", title: "Contact Details", description: "Enter your contact information", icon: Mail },
  { id: "payment", shortTitle: "Payment", title: "Payment", description: "Complete your booking", icon: CreditCard }
];

const ROOM_TYPES = [
  { id: 'standard', name: 'Standard Room', price: 3500, maxGuests: 2, features: ['Queen bed', 'City view', 'Free WiFi', 'Breakfast included'] },
  { id: 'deluxe', name: 'Deluxe Room', price: 5500, maxGuests: 3, features: ['King bed', 'Garden view', 'Premium WiFi', 'Breakfast & dinner', 'Mini bar'] },
  { id: 'suite', name: 'Executive Suite', price: 8500, maxGuests: 4, features: ['King bed + sofa bed', 'Panoramic view', 'High-speed WiFi', 'All meals included', 'Premium minibar', 'Lounge access'] }
];

const ADDON_OPTIONS = [
  { id: 'extra-bed', name: 'Extra Bed', price: 1000, icon: Bed },
  { id: 'extra-food', name: 'Extra Meal Plan', price: 800, icon: Utensils },
  { id: 'early-checkin', name: 'Early Check-in', price: 500, icon: Clock },
  { id: 'late-checkout', name: 'Late Check-out', price: 500, icon: Clock },
  { id: 'airport-pickup', name: 'Airport Pickup', price: 1500, icon: Home }
];

const mockBankAccounts = [
  { id: '1', bankName: 'HDFC Bank', accountNumber: '****1234', balance: 125000, upiId: 'user@hdfcbank' },
  { id: '2', bankName: 'ICICI Bank', accountNumber: '****5678', balance: 45000, upiId: 'user@icici' },
  { id: '3', bankName: 'SBI', accountNumber: '****9012', balance: 78000, upiId: 'user@sbi' }
];

export default function HotelComprehensiveBooking() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Hotel data
  const hotelData = {
    name: "Grand Plaza Hotel",
    location: "Mumbai, Maharashtra",
    checkIn: "15 Oct 2024",
    checkOut: "17 Oct 2024",
    nights: 2
  };

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // Form states
  const [selectedRoom, setSelectedRoom] = useState('deluxe');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [guestName, setGuestName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('1');
  const [upiPin, setUpiPin] = useState(['', '', '', '']);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  const selectedRoomData = ROOM_TYPES.find(r => r.id === selectedRoom);
  const maxGuests = selectedRoomData?.maxGuests || 2;
  const totalGuests = adults + children;

  const handleStageClick = (index: number) => {
    if (completedStages.includes(index) || index <= currentStageIndex) {
      setCurrentStageIndex(index);
    }
  };

  const handleNextStage = () => {
    // Validation
    if (currentStage.id === 'room' && !selectedRoom) {
      toast({ title: "Please select a room type", variant: "destructive" });
      return;
    }
    if (currentStage.id === 'guests' && totalGuests === 0) {
      toast({ title: "Please add at least one guest", variant: "destructive" });
      return;
    }
    if (currentStage.id === 'guests' && totalGuests > maxGuests) {
      toast({ title: `Maximum ${maxGuests} guests allowed for selected room`, variant: "destructive" });
      return;
    }
    if (currentStage.id === 'contact' && (!contactEmail || !contactPhone || !guestName)) {
      toast({ title: "Please fill all contact details", variant: "destructive" });
      return;
    }
    if (currentStage.id === 'payment') {
      const pin = upiPin.join('');
      if (pin.length !== 4) {
        toast({ title: "Invalid PIN", description: "Please enter a 4-digit UPI PIN", variant: "destructive" });
        return;
      }
      toast({ title: "Processing Booking", description: "Redirecting to confirmation..." });
      setTimeout(() => {
        navigate(`/booking/hotel/success?hotelId=${hotelData.name}&amount=${totalPrice}`);
      }, 1500);
      return;
    }

    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < BOOKING_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newPin = [...upiPin];
      newPin[index] = value;
      setUpiPin(newPin);
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !upiPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  // Price calculation
  const roomPrice = (selectedRoomData?.price || 0) * hotelData.nights;
  const addonsPrice = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDON_OPTIONS.find(a => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);
  const convenienceFee = 200;
  const basePrice = roomPrice + addonsPrice + convenienceFee;

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'hotel':
        return (
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 border border-white/20">
                <Hotel className="h-6 w-6 text-white" strokeWidth={1} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-light tracking-wider mb-2 text-white">{hotelData.name}</h2>
                <p className="text-sm text-white/60 mb-4">{hotelData.location}</p>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <span>Check-in: {hotelData.checkIn}</span>
                  <span>•</span>
                  <span>Check-out: {hotelData.checkOut}</span>
                  <span>•</span>
                  <span>{hotelData.nights} Nights</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'room':
        return (
          <RadioGroup value={selectedRoom} onValueChange={setSelectedRoom}>
            <div className="space-y-3">
              {ROOM_TYPES.map((room) => (
                <div key={room.id} className={cn(
                  "p-4 border cursor-pointer transition-all",
                  selectedRoom === room.id 
                    ? "bg-white/10 border-white" 
                    : "bg-white/5 border-white/20 hover:border-white/40"
                )}>
                  <RadioGroupItem value={room.id} id={`room-${room.id}`} className="sr-only" />
                  <Label htmlFor={`room-${room.id}`} className="cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-base mb-1">{room.name}</h4>
                        <p className="text-white/60 text-xs">Max {room.maxGuests} guests</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold text-lg">{formatCurrency(room.price)}</p>
                        <p className="text-white/60 text-xs">per night</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {room.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-white/60" />
                          <span className="text-white/70 text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'guests':
        return (
          <div className="space-y-6">
            <div className="border border-white/20 p-5 bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white text-sm font-medium">Adults</p>
                  <p className="text-white/60 text-xs">Age 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdults(Math.max(0, adults - 1))}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                    disabled={adults === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-lg font-light w-8 text-center">{adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdults(adults + 1)}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                    disabled={totalGuests >= maxGuests}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="bg-white/20 my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Children</p>
                  <p className="text-white/60 text-xs">Age 0-12</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                    disabled={children === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-lg font-light w-8 text-center">{children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChildren(children + 1)}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                    disabled={totalGuests >= maxGuests}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {totalGuests > maxGuests && (
              <div className="border border-red-500/30 p-4 bg-red-500/10">
                <p className="text-red-400 text-sm">Maximum {maxGuests} guests allowed for {selectedRoomData?.name}. Please select a different room type.</p>
              </div>
            )}
          </div>
        );

      case 'addons':
        return (
          <div className="space-y-3">
            {ADDON_OPTIONS.map((addon) => {
              const isSelected = selectedAddons.includes(addon.id);
              const AddonIcon = addon.icon;
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={cn(
                    "w-full p-4 border transition-all text-left",
                    isSelected
                      ? "bg-white/10 border-white"
                      : "bg-white/5 border-white/20 hover:border-white/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 border flex items-center justify-center",
                        isSelected ? "border-white bg-white/10" : "border-white/20"
                      )}>
                        <AddonIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{addon.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="text-white font-semibold">{formatCurrency(addon.price)}</p>
                      {isSelected && <CheckCircle className="h-5 w-5 text-white" fill="currentColor" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Guest Name</Label>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter guest name"
                className="bg-white/5 border-white/20 text-white rounded-none mt-2"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Email Address</Label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-white/5 border-white/20 text-white rounded-none mt-2"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Phone Number</Label>
              <Input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="bg-white/5 border-white/20 text-white rounded-none mt-2"
              />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                Select Bank Account
              </Label>
              <div className="space-y-3">
                {mockBankAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={cn(
                      "w-full p-4 border-b transition-all text-left",
                      selectedAccount === account.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={cn(
                        "font-light tracking-wider transition-opacity",
                        selectedAccount === account.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                      )}>
                        {account.bankName}
                      </p>
                      <Badge className={cn(
                        "rounded-none border font-light text-xs",
                        selectedAccount === account.id 
                          ? "bg-white/20 text-white border-white/30" 
                          : "bg-white/10 text-white/60 border-white/20"
                      )}>
                        {account.accountNumber}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/40 font-light">{account.upiId}</p>
                      <p className={cn(
                        "text-sm font-light",
                        selectedAccount === account.id ? "text-white" : "text-white/60"
                      )}>
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Enter 4-Digit UPI PIN</Label>
              <div className="flex justify-center gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <Input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={upiPin[index]}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-16 h-16 text-center text-3xl font-light bg-transparent border-b-2 border-white/20 rounded-none text-white focus:border-white transition-colors"
                  />
                ))}
              </div>
            </div>

            <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="bg-white/10 border border-white/20 rounded-none p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-light text-white mb-1 tracking-wider">Secure Payment</h3>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    Your payment is secured with bank-grade encryption. UPI PIN is never stored or shared.
                  </p>
                </div>
              </div>
            </div>

            <CouponSelector
              bookingAmount={basePrice}
              category="travel"
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header with Booking Progress */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/booking/hotel/results')}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">HOTEL BOOKING</h1>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Progress Section */}
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Booking Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {currentStageIndex + 1} of {BOOKING_STAGES.length}
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-1 mb-4">
              <div 
                className="bg-white h-1 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Stage Tracker */}
            <div className="flex items-center justify-between">
              {BOOKING_STAGES.map((stage, index) => {
                const isCompleted = completedStages.includes(index);
                const isCurrent = index === currentStageIndex;
                const isAccessible = isCompleted || index <= currentStageIndex;
                
                return (
                  <button
                    key={stage.id}
                    onClick={() => isAccessible && handleStageClick(index)}
                    className={cn(
                      "flex flex-col items-center transition-all",
                      isAccessible ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"
                    )}
                    disabled={!isAccessible}
                    data-testid={`stage-button-${stage.id}`}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 border-b-2 flex items-center justify-center text-xs font-light transition-all duration-200",
                        isCompleted 
                          ? 'border-white bg-white/5 text-white' 
                          : isCurrent 
                            ? 'border-white bg-white/5 text-white' 
                            : isAccessible
                              ? 'border-white/20 bg-transparent text-white/60'
                              : 'border-white/10 bg-transparent text-white/30'
                      )}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] mt-2 text-center transition-colors uppercase tracking-wider font-light",
                      isCurrent ? 'text-white' : 'text-white/40'
                    )}>
                      {stage.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Stage Title */}
        <div className="space-y-2 mt-16">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <currentStage.icon className="h-3 w-3" />
            {currentStage.title}
          </Label>
          <p className="text-xs text-white/40 font-light">{currentStage.description}</p>
        </div>
          
        {/* Stage Content */}
        <div className="space-y-3">
          {renderStageContent()}
        </div>

        {/* Price Summary */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Booking Summary</h3>
          <div className="space-y-3">
            {selectedRoomData && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">{selectedRoomData.name} ({hotelData.nights} nights)</span>
                <span className="font-light">{formatCurrency(roomPrice)}</span>
              </div>
            )}
            {selectedAddons.length > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Add-ons ({selectedAddons.length} items)</span>
                <span className="font-light">{formatCurrency(addonsPrice)}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Convenience Fee</span>
              <span className="font-light">{formatCurrency(convenienceFee)}</span>
            </div>
            {appliedCoupon && (
              <>
                <Separator className="bg-white/20" />
                <div className="flex justify-between">
                  <span className="text-sm text-white/80">Subtotal</span>
                  <span className="font-light text-white/80">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-400/80">Coupon Discount</span>
                  <span className="font-light text-green-400">-{formatCurrency(couponDiscount)}</span>
                </div>
              </>
            )}
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-white text-xl">
              <span className="font-light">Total Amount</span>
              <span className="font-bold">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{hotelData.name}</p>
              <p className="text-sm text-white font-light">{hotelData.checkIn} • {hotelData.nights} Nights</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Amount</p>
              <p className="text-xl font-light text-white">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
          <Button
            onClick={handleNextStage}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
          >
            {currentStageIndex === BOOKING_STAGES.length - 1 ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                PAY {formatCurrency(totalPrice)}
              </>
            ) : (
              <>
                CONTINUE
                <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
