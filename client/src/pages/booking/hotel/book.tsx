import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Users,
  Bed,
  Plus,
  Minus,
  CheckCircle,
  Building2,
  Shield,
  MapPin,
  UtensilsCrossed,
  Car,
  Hotel,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOOKING_STEPS = [
  { id: "dates", label: "Dates", icon: Calendar },
  { id: "members", label: "Members", icon: Users },
  { id: "rooms", label: "Rooms", icon: Bed },
  { id: "addons", label: "Add-ons", icon: Plus },
  { id: "details", label: "Details", icon: Info },
  { id: "payment", label: "Payment", icon: Building2 }
];

const ROOM_TYPES = [
  { id: 'deluxe', name: 'Deluxe Room', price: 12500, maxOccupancy: 3 },
  { id: 'suite', name: 'Suite', price: 25000, maxOccupancy: 4 },
  { id: 'premium', name: 'Premium Suite', price: 45000, maxOccupancy: 3 }
];

const mockBankAccounts = [
  { id: '1', bankName: 'HDFC Bank', accountNumber: '****1234', balance: 1250000, upiId: 'user@hdfcbank' },
  { id: '2', bankName: 'ICICI Bank', accountNumber: '****5678', balance: 450000, upiId: 'user@icici' },
  { id: '3', bankName: 'SBI', accountNumber: '****9012', balance: 780000, upiId: 'user@sbi' }
];

export default function HotelBooking() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const hotelId = params.get('hotelId') || '1';
  const hotelName = params.get('hotelName') || 'The Taj Mahal Palace';

  const [currentStep, setCurrentStep] = useState("dates");

  // Step 1: Dates
  const [checkInDate, setCheckInDate] = useState(params.get('checkIn') || '');
  const [checkOutDate, setCheckOutDate] = useState(params.get('checkOut') || '');
  const [numberOfDays, setNumberOfDays] = useState(1);

  // Step 2: Members
  const [adults, setAdults] = useState(parseInt(params.get('guests') || '2'));
  const [kids, setKids] = useState(0);

  // Step 3: Rooms
  const [selectedRoomType, setSelectedRoomType] = useState('deluxe');
  const [roomCount, setRoomCount] = useState(parseInt(params.get('rooms') || '1'));

  // Step 4: Add-ons
  const [extraBed, setExtraBed] = useState(0);
  const [mealPlan, setMealPlan] = useState('none');
  const [pickup, setPickup] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropup, setDropup] = useState(false);
  const [dropupLocation, setDropupLocation] = useState('');

  // Step 5 & 6: Contact & Payment
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('1');
  const [upiPin, setUpiPin] = useState(['', '', '', '']);

  // Calculate days when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      setNumberOfDays(days);
    }
  }, [checkInDate, checkOutDate]);

  // Calculate minimum rooms required
  const calculateMinRooms = () => {
    const totalMembers = adults + kids;
    const membersPerRoom = 3 + 1; // 3 adults + 1 kid max per room
    return Math.ceil(totalMembers / membersPerRoom);
  };

  const handleContinue = () => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    
    // Validation
    if (currentStep === "dates" && (!checkInDate || !checkOutDate)) {
      toast({ title: "Please select check-in and check-out dates", variant: "destructive" });
      return;
    }
    
    if (currentStep === "members" && adults === 0) {
      toast({ title: "Please select at least 1 adult", variant: "destructive" });
      return;
    }

    if (currentStep === "rooms") {
      const minRooms = calculateMinRooms();
      if (roomCount < minRooms) {
        toast({ 
          title: "Insufficient rooms", 
          description: `You need at least ${minRooms} room(s) for ${adults + kids} member(s)`, 
          variant: "destructive" 
        });
        return;
      }
    }

    if (currentStep === "addons") {
      if (pickup && !pickupLocation) {
        toast({ title: "Please enter pickup location", variant: "destructive" });
        return;
      }
      if (dropup && !dropupLocation) {
        toast({ title: "Please enter dropup location", variant: "destructive" });
        return;
      }
    }

    if (currentStep === "details") {
      if (!guestName || !guestEmail || !guestPhone) {
        toast({ title: "Please fill all guest details", variant: "destructive" });
        return;
      }
    }

    if (currentStepIndex < BOOKING_STEPS.length - 1) {
      setCurrentStep(BOOKING_STEPS[currentStepIndex + 1].id);
    } else {
      // Payment
      const pin = upiPin.join('');
      if (pin.length !== 4) {
        toast({ title: "Invalid PIN", description: "Please enter a 4-digit UPI PIN", variant: "destructive" });
        return;
      }
      
      toast({ title: "Processing Booking", description: "Redirecting to confirmation..." });
      setTimeout(() => {
        navigate(`/booking-success?hotelId=${hotelId}&amount=${totalPrice}`);
      }, 1500);
    }
  };

  const handlePrevious = () => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    if (currentStepIndex > 0) {
      setCurrentStep(BOOKING_STEPS[currentStepIndex - 1].id);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...upiPin];
      newPin[index] = value;
      setUpiPin(newPin);
      if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`)?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !upiPin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  // Pricing
  const roomPrice = ROOM_TYPES.find(r => r.id === selectedRoomType)?.price || 0;
  const roomTotal = roomPrice * roomCount * numberOfDays;
  const extraBedTotal = extraBed * 2000 * numberOfDays;
  const mealTotal = mealPlan === 'breakfast' ? 500 * (adults + kids) * numberOfDays : mealPlan === 'all' ? 1500 * (adults + kids) * numberOfDays : 0;
  const pickupTotal = pickup ? 3000 : 0;
  const dropupTotal = dropup ? 3000 : 0;
  const taxes = (roomTotal + extraBedTotal + mealTotal) * 0.18;
  const totalPrice = roomTotal + extraBedTotal + mealTotal + pickupTotal + dropupTotal + taxes;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentStepIndex = () => BOOKING_STEPS.findIndex(step => step.id === currentStep);
  const progressPercentage = ((getCurrentStepIndex() + 1) / BOOKING_STEPS.length) * 100;
  const completedSteps = Array.from({ length: getCurrentStepIndex() }, (_, i) => i);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/booking/hotel/details?id=${hotelId}`)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">BOOK HOTEL</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{hotelName}</p>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Progress */}
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Booking Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {getCurrentStepIndex() + 1} of {BOOKING_STEPS.length}
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-1 mb-4">
              <div className="bg-white h-1 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              {BOOKING_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = index === getCurrentStepIndex();
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 border-b-2 flex items-center justify-center text-xs font-light transition-all duration-200",
                        isCompleted ? 'border-white bg-white/5 text-white' : isCurrent ? 'border-white bg-white/5 text-white' : 'border-white/10 bg-transparent text-white/30'
                      )}
                      data-testid={`step-${step.id}`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={cn("text-[10px] mt-2 text-center uppercase tracking-wider font-light", isCurrent ? 'text-white' : 'text-white/40')}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-64 px-4 max-w-7xl mx-auto space-y-6 pb-40">
        {/* Step 1: Date Selection */}
        {currentStep === "dates" && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Check-in Date</Label>
                <DatePicker
                  value={checkInDate}
                  onChange={setCheckInDate}
                  placeholder="Select check-in date"
                  className="bg-white/5 border-white/20 text-white mt-2"
                  data-testid="input-checkin"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Check-out Date</Label>
                <DatePicker
                  value={checkOutDate}
                  onChange={setCheckOutDate}
                  min={checkInDate}
                  placeholder="Select check-out date"
                  className="bg-white/5 border-white/20 text-white mt-2"
                  data-testid="input-checkout"
                />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Number of Days</span>
                <span className="text-2xl font-light text-white" data-testid="text-days">{numberOfDays}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Members */}
        {currentStep === "members" && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Number of Members
            </h3>
            <p className="text-sm text-white/60 mb-6">Max 3 Adults + 1 Kid per room</p>

            <div className="space-y-6">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Adults</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdults(Math.max(0, adults - 1))}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 w-12"
                    data-testid="button-decrease-adults"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 text-center">
                    <p className="text-3xl font-light text-white" data-testid="text-adults">{adults}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdults(adults + 1)}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 w-12"
                    data-testid="button-increase-adults"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Kids</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setKids(Math.max(0, kids - 1))}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 w-12"
                    data-testid="button-decrease-kids"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 text-center">
                    <p className="text-3xl font-light text-white" data-testid="text-kids">{kids}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setKids(kids + 1)}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 w-12"
                    data-testid="button-increase-kids"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Total Members</span>
                  <span className="text-xl font-light text-white" data-testid="text-total-members">
                    {adults + kids}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Rooms */}
        {currentStep === "rooms" && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Room Selection
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Minimum {calculateMinRooms()} room(s) required for {adults + kids} member(s)
            </p>

            {/* Room Type */}
            <div className="space-y-3 mb-6">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Room Type</Label>
              <div className="space-y-3">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomType(room.id)}
                    className={cn(
                      "w-full p-4 border-b transition-all text-left",
                      selectedRoomType === room.id ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"
                    )}
                    data-testid={`room-type-${room.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("font-light tracking-wider", selectedRoomType === room.id ? "text-white" : "text-white/60")}>
                          {room.name}
                        </p>
                        <p className="text-xs text-white/40 mt-1">Max {room.maxOccupancy} guests</p>
                      </div>
                      <Badge className={cn(
                        "rounded-none border font-light text-xs",
                        selectedRoomType === room.id ? "bg-white/20 text-white border-white/30" : "bg-white/10 text-white/60 border-white/20"
                      )}>
                        {formatCurrency(room.price)}/night
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Rooms */}
            <div className="border-t border-white/10 pt-6">
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Number of Rooms</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                  className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 w-12"
                  data-testid="button-decrease-rooms"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="flex-1 text-center">
                  <p className="text-3xl font-light text-white" data-testid="text-room-count">{roomCount}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider">Rooms</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRoomCount(roomCount + 1)}
                  className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 w-12"
                  data-testid="button-increase-rooms"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Add-ons */}
        {currentStep === "addons" && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <h3 className="text-lg font-light tracking-wider mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add-ons & Services
            </h3>

            <div className="space-y-6">
              {/* Extra Bed */}
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Extra Bed ({formatCurrency(2000)}/night)</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setExtraBed(Math.max(0, extraBed - 1))}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-light text-white">{extraBed}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setExtraBed(extraBed + 1)}
                    className="border-white/20 text-white hover:bg-white/10 rounded-none h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Meal Plan */}
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Meal Plan
                </Label>
                <Select value={mealPlan} onValueChange={setMealPlan}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="none">No Meals</SelectItem>
                    <SelectItem value="breakfast">Breakfast Only (+₹500/person/day)</SelectItem>
                    <SelectItem value="all">All Meals (+₹1500/person/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Pickup Service ({formatCurrency(3000)})
                  </Label>
                  <button
                    onClick={() => setPickup(!pickup)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      pickup ? "bg-white" : "bg-white/20"
                    )}
                    data-testid="toggle-pickup"
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full transition-transform",
                        pickup ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
                      )}
                    />
                  </button>
                </div>
                {pickup && (
                  <Input
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="bg-white/5 border-white/20 text-white rounded-none"
                    data-testid="input-pickup-location"
                  />
                )}
              </div>

              {/* Dropup */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Drop Service ({formatCurrency(3000)})
                  </Label>
                  <button
                    onClick={() => setDropup(!dropup)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      dropup ? "bg-white" : "bg-white/20"
                    )}
                    data-testid="toggle-dropup"
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full transition-transform",
                        dropup ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
                      )}
                    />
                  </button>
                </div>
                {dropup && (
                  <Input
                    placeholder="Enter drop location"
                    value={dropupLocation}
                    onChange={(e) => setDropupLocation(e.target.value)}
                    className="bg-white/5 border-white/20 text-white rounded-none"
                    data-testid="input-dropup-location"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Details */}
        {currentStep === "details" && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Booking Summary & Guest Details
            </h3>

            {/* Summary */}
            <div className="mb-6 p-4 bg-white/5 border border-white/20 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Check-in - Check-out</span>
                <span className="text-white font-light">{checkInDate} → {checkOutDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Duration</span>
                <span className="text-white font-light">{numberOfDays} night{numberOfDays > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Members</span>
                <span className="text-white font-light">{adults} Adult{adults > 1 ? 's' : ''} + {kids} Kid{kids !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Rooms</span>
                <span className="text-white font-light">{roomCount} × {ROOM_TYPES.find(r => r.id === selectedRoomType)?.name}</span>
              </div>
              {extraBed > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Extra Beds</span>
                  <span className="text-white font-light">{extraBed}</span>
                </div>
              )}
              {mealPlan !== 'none' && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Meal Plan</span>
                  <span className="text-white font-light">
                    {mealPlan === 'breakfast' ? 'Breakfast Only' : 'All Meals'}
                  </span>
                </div>
              )}
              {pickup && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Pickup</span>
                  <span className="text-white font-light">{pickupLocation}</span>
                </div>
              )}
              {dropup && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Drop</span>
                  <span className="text-white font-light">{dropupLocation}</span>
                </div>
              )}
            </div>

            {/* Guest Details */}
            <div className="space-y-4 mb-6">
              <h4 className="text-white/80 text-sm uppercase tracking-wider">Primary Guest Details</h4>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Full Name</Label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-guest-name"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-guest-email"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Phone</Label>
                <Input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-guest-phone"
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-white font-light tracking-wider mb-4">Price Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Rooms ({roomCount} × {numberOfDays} nights)</span>
                  <span className="font-light">{formatCurrency(roomTotal)}</span>
                </div>
                {extraBedTotal > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Extra Beds ({extraBed} × {numberOfDays} nights)</span>
                    <span className="font-light">{formatCurrency(extraBedTotal)}</span>
                  </div>
                )}
                {mealTotal > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Meals</span>
                    <span className="font-light">{formatCurrency(mealTotal)}</span>
                  </div>
                )}
                {pickupTotal > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Pickup Service</span>
                    <span className="font-light">{formatCurrency(pickupTotal)}</span>
                  </div>
                )}
                {dropupTotal > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Drop Service</span>
                    <span className="font-light">{formatCurrency(dropupTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Taxes & Fees (18%)</span>
                  <span className="font-light">{formatCurrency(taxes)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white text-xl">
                  <span className="font-light">Total Amount</span>
                  <span className="font-bold" data-testid="text-total-amount">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Payment */}
        {currentStep === "payment" && (
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
                      selectedAccount === account.id ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"
                    )}
                    data-testid={`account-option-${account.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={cn("font-light tracking-wider", selectedAccount === account.id ? "text-white" : "text-white/60")}>
                        {account.bankName}
                      </p>
                      <Badge className={cn(
                        "rounded-none border font-light text-xs",
                        selectedAccount === account.id ? "bg-white/20 text-white border-white/30" : "bg-white/10 text-white/60 border-white/20"
                      )}>
                        {account.accountNumber}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/40 font-light">{account.upiId}</p>
                      <p className={cn("text-sm font-light", selectedAccount === account.id ? "text-white" : "text-white/60")}>
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
                    data-testid={`input-pin-${index}`}
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
          </div>
        )}
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{hotelName}</p>
              <p className="text-sm text-white font-light">{numberOfDays} Night{numberOfDays > 1 ? 's' : ''} • {roomCount} Room{roomCount > 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Amount</p>
              <p className="text-xl font-light text-white">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
          <Button
            onClick={handleContinue}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-continue"
          >
            {currentStep === "payment" ? (
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
