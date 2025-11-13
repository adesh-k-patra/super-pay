import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  User,
  GraduationCap,
  Briefcase,
  UserCircle,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Star,
  Utensils,
  Shield,
  CheckCircle2,
  Circle,
  Info,
  Building2,
  Minus,
  Plus,
  Armchair,
  Camera,
  Plane,
  Hotel,
  Car,
  X,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TripData {
  id: string;
  name: string;
  destinations: string[];
  days: number;
  nights: number;
  startDate: string;
  basePrice: number;
  taxesPerPerson: number;
  convenienceFee: number;
  description?: string;
  highlights?: string[];
  includes?: string[];
}

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
}

interface PassengerClassPreferences {
  mealClass: string;
  travelClass: string;
  personalGuide: string;
  photography: boolean;
}

const BOOKING_STEPS = [
  { id: "details", label: "Details", icon: Info },
  { id: "class", label: "Booking type", icon: Armchair },
  { id: "passengers", label: "Passengers", icon: Users },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "payment", label: "Payment", icon: CreditCard }
];

const SEAT_OPTIONS = [
  { id: 'economy', name: 'Economy Seat', price: 0 },
  { id: 'comfort', name: 'Comfort Plus Seat', price: 8000 },
  { id: 'business', name: 'Business Seat', price: 25000 },
  { id: 'first', name: 'First Class Seat', price: 50000 }
];

const MEAL_CLASS_OPTIONS = [
  { id: 'standard', name: 'Standard', price: 0 },
  { id: 'premium', name: 'Premium', price: 5000 },
  { id: 'ultra-premium', name: 'Ultra Premium', price: 12000 }
];

const TRAVEL_CLASS_OPTIONS = [
  { id: 'economy', name: 'Economy', price: 0 },
  { id: 'comfort', name: 'Comfort Plus', price: 35000 },
  { id: 'business', name: 'Business', price: 85000 },
  { id: 'first', name: 'First Class', price: 150000 }
];

const PERSONAL_GUIDE_OPTIONS = [
  { id: 'no', name: 'No', price: 0 },
  { id: 'online', name: 'Online Assist', price: 5000 },
  { id: 'direct', name: 'Direct', price: 25000 }
];

const PHOTOGRAPHY_PRICE = 15000;

const BOOKING_CLASS_OPTIONS = [
  { 
    id: 'standard', 
    name: 'Standard', 
    price: 0,
    description: 'Things will be normal'
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: 45000,
    description: 'Premium meals, premium travel facilities, Online personal guide'
  },
  { 
    id: 'ultra-premium', 
    name: 'Ultra Premium', 
    price: 95000,
    description: 'Personal guide, Ultra premium meals, Ultra premium travel facilities, Photography from Travel guide'
  }
];

const getTripData = (id: string): TripData => {
  const mockTrips: Record<string, TripData> = {
    "us-west-coast": {
      id: "us-west-coast",
      name: "US West Coast Adventure",
      destinations: ["Los Angeles", "San Francisco", "Las Vegas"],
      days: 10,
      nights: 9,
      startDate: "2024-11-22",
      basePrice: 245000,
      taxesPerPerson: 18000,
      convenienceFee: 3000,
      description: "Experience the best of the US West Coast with visits to iconic cities including Los Angeles, San Francisco, and Las Vegas. Enjoy world-class attractions, stunning landscapes, and unforgettable experiences.",
      highlights: [
        "Visit Hollywood & Universal Studios",
        "Golden Gate Bridge tour",
        "Vegas casino experience",
        "Pacific Coast Highway drive"
      ],
      includes: [
        "Round-trip flights",
        "Hotel accommodations (9 nights)",
        "Daily breakfast",
        "Airport transfers",
        "Sightseeing tours",
        "Travel insurance"
      ]
    }
  };
  
  return mockTrips[id] || mockTrips["us-west-coast"];
};

// Mock bank accounts for payment step
const mockBankAccounts = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    accountNumber: '****1234',
    balance: 1250000,
    upiId: 'user@hdfcbank'
  },
  {
    id: '2',
    bankName: 'ICICI Bank',
    accountNumber: '****5678',
    balance: 450000,
    upiId: 'user@icici'
  },
  {
    id: '3',
    bankName: 'SBI',
    accountNumber: '****9012',
    balance: 780000,
    upiId: 'user@sbi'
  }
];

export default function TripBooking() {
  const { tripId } = useParams<{ tripId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const searchParams = {
    adults: parseInt(params.get("adults") || "2"),
    children: parseInt(params.get("children") || "0"),
    class: params.get("class") || "economy",
    mealTier: params.get("mealTier") || "standard",
    totalPrice: parseFloat(params.get("totalPrice") || "0")
  };

  const trip = getTripData(tripId || "us-west-coast");

  const [currentStep, setCurrentStep] = useState("details");
  const totalTravelers = searchParams.adults + searchParams.children;
  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    Array(totalTravelers).fill(null).map(() => ({ title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }))
  );

  // Booking type and class state
  const [bookingType, setBookingType] = useState<'group' | 'individual'>('individual');
  const [bookingClass, setBookingClass] = useState('standard');
  const [selectedSeatType, setSelectedSeatType] = useState("economy");
  const [seatCount, setSeatCount] = useState(totalTravelers);
  
  // Selected passenger for tabs
  const [selectedPassenger, setSelectedPassenger] = useState(0);
  const [selectedContactPassenger, setSelectedContactPassenger] = useState(0);

  // Per-passenger class preferences
  const [passengerPreferences, setPassengerPreferences] = useState<PassengerClassPreferences[]>(
    Array(totalTravelers).fill(null).map(() => ({
      mealClass: 'standard',
      travelClass: 'economy',
      personalGuide: 'no',
      photography: false
    }))
  );

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [travelerType, setTravelerType] = useState<'general' | 'student' | 'business'>('general');
  
  const [studentCollegeName, setStudentCollegeName] = useState("");
  const [studentCollegeId, setStudentCollegeId] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessIdCard, setBusinessIdCard] = useState("");
  const [businessGstNo, setBusinessGstNo] = useState("");

  // Payment step states
  const [selectedAccount, setSelectedAccount] = useState<string>('1');
  const [upiPin, setUpiPin] = useState(['', '', '', '']);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleAddPassenger = () => {
    if (passengers.length < 9) {
      setPassengers([...passengers, { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }]);
      setPassengerPreferences([...passengerPreferences, {
        mealClass: 'standard',
        travelClass: 'economy',
        personalGuide: 'no',
        photography: false
      }]);
      setSelectedPassenger(passengers.length);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      setPassengerPreferences(passengerPreferences.filter((_, i) => i !== index));
      if (selectedPassenger >= passengers.length - 1) {
        setSelectedPassenger(Math.max(0, passengers.length - 2));
      }
      if (selectedContactPassenger >= passengers.length - 1) {
        setSelectedContactPassenger(Math.max(0, passengers.length - 2));
      }
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handlePassengerPreferenceChange = (index: number, field: keyof PassengerClassPreferences, value: string | boolean) => {
    const updated = [...passengerPreferences];
    if (field === 'photography') {
      updated[index][field] = value as boolean;
    } else {
      updated[index][field] = value as string;
    }
    setPassengerPreferences(updated);
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
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

  const handleContinue = () => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    if (currentStepIndex < BOOKING_STEPS.length - 1) {
      setCurrentStep(BOOKING_STEPS[currentStepIndex + 1].id);
    } else {
      // Payment step - show PIN popup first, then process booking
      if (!showPinPopup) {
        setShowPinPopup(true);
        setTimeout(() => {
          const firstPinInput = document.getElementById('pin-0');
          firstPinInput?.focus();
        }, 300);
      } else {
        const pin = upiPin.join('');
        if (pin.length !== 4) {
          toast({
            title: "Invalid PIN",
            description: "Please enter a 4-digit UPI PIN",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Processing Booking",
          description: "Redirecting to confirmation...",
        });
        setTimeout(() => {
          navigate(`/booking-success?tripId=${trip.id}&amount=${totalPrice}`);
        }, 1500);
      }
    }
  };

  const handlePrevious = () => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    if (currentStepIndex > 0) {
      setCurrentStep(BOOKING_STEPS[currentStepIndex - 1].id);
    }
  };

  const seatPrice = SEAT_OPTIONS.find(s => s.id === selectedSeatType)?.price || 0;
  
  // Calculate per-passenger class preferences total (only for individual booking)
  const passengerPreferencesTotal = bookingType === 'individual' ? passengerPreferences.reduce((total, pref) => {
    const mealPrice = MEAL_CLASS_OPTIONS.find(m => m.id === pref.mealClass)?.price || 0;
    const travelPrice = TRAVEL_CLASS_OPTIONS.find(t => t.id === pref.travelClass)?.price || 0;
    const guidePrice = PERSONAL_GUIDE_OPTIONS.find(g => g.id === pref.personalGuide)?.price || 0;
    const photoPrice = pref.photography ? PHOTOGRAPHY_PRICE : 0;
    return total + mealPrice + travelPrice + guidePrice + photoPrice;
  }, 0) : 0;

  const currentTravelerCount = passengers.length;
  const bookingClassPrice = BOOKING_CLASS_OPTIONS.find(c => c.id === bookingClass)?.price || 0;
  const perPersonPrice = trip.basePrice + (seatPrice * seatCount / currentTravelerCount);
  const totalPrice = (perPersonPrice * currentTravelerCount) + passengerPreferencesTotal + (bookingClassPrice * currentTravelerCount) + trip.taxesPerPerson * currentTravelerCount + trip.convenienceFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatEndDate = (startDateString: string, nights: number) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + nights);
    return endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getCurrentStepIndex = () => BOOKING_STEPS.findIndex(step => step.id === currentStep);
  const selectedAccountData = mockBankAccounts.find(acc => acc.id === selectedAccount);
  const currentStepData = BOOKING_STEPS[getCurrentStepIndex()];
  const progressPercentage = ((getCurrentStepIndex() + 1) / BOOKING_STEPS.length) * 100;
  const completedSteps = Array.from({ length: getCurrentStepIndex() }, (_, i) => i);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header with Booking Progress */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/trip-detail/${tripId}`)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">COMPLETE BOOKING</h1>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Progress Section */}
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Booking Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {getCurrentStepIndex() + 1} of {BOOKING_STEPS.length}
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-1 mb-4">
              <div 
                className="bg-white h-1 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Step Tracker */}
            <div className="flex items-center justify-between">
              {BOOKING_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = index === getCurrentStepIndex();
                const isAccessible = isCompleted || index <= getCurrentStepIndex();
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                    className={cn(
                      "flex flex-col items-center transition-all",
                      isAccessible ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"
                    )}
                    disabled={!isAccessible}
                    data-testid={`step-button-${step.id}`}
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
                      data-testid={`step-${step.id}`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] mt-2 text-center transition-colors uppercase tracking-wider font-light",
                      isCurrent ? 'text-white' : 'text-white/40'
                    )}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-64 px-4 max-w-7xl mx-auto space-y-6 pb-40">
        {/* Trip Summary */}
        {currentStep === "details" && (
          <>
            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 border border-white/20">
                  <MapPin className="h-6 w-6 text-white" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-light tracking-wider mb-2">{trip.name}</h2>
                  <p className="text-sm text-white/60 mb-4">{trip.destinations.join(' → ')}</p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span><Calendar className="inline h-3 w-3 mr-1" />{trip.days}D/{trip.nights}N</span>
                    <span><Users className="inline h-3 w-3 mr-1" />{searchParams.adults} Adults, {searchParams.children} Children</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Trip Details */}
            <div className="bg-black border border-white/10 shadow-xl">
              <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                    <Info className="h-5 w-5 text-white/70" />
                  </div>
                  <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Complete Trip Details</h3>
                </div>
              </div>
              
              <div className="p-5 space-y-5">
                {trip.description && (
                  <div>
                    <h4 className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Description</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{trip.description}</p>
                  </div>
                )}

                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="pt-5 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                        <Star className="h-4 w-4 text-white/70" />
                      </div>
                      <h4 className="text-white/40 text-[10px] uppercase tracking-widest">Highlights</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trip.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.05] p-3">
                          <CheckCircle className="h-4 w-4 text-white/50 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70 text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {trip.includes && trip.includes.length > 0 && (
                  <div className="pt-5 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white/70" />
                      </div>
                      <h4 className="text-white/40 text-[10px] uppercase tracking-widest">What's Included</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trip.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.05] p-3">
                          <div className="w-7 h-7 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            {idx === 0 && <Plane className="h-3.5 w-3.5 text-white/60" />}
                            {idx === 1 && <Hotel className="h-3.5 w-3.5 text-white/60" />}
                            {idx === 2 && <Utensils className="h-3.5 w-3.5 text-white/60" />}
                            {idx === 3 && <Car className="h-3.5 w-3.5 text-white/60" />}
                            {idx > 3 && <CheckCircle className="h-3.5 w-3.5 text-white/60" />}
                          </div>
                          <span className="text-white/70 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Booking Type Selection */}
        {currentStep === "class" && (
          <div className="space-y-6">
            {/* 1. Booking Type */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-3 uppercase text-white/80">1. Booking Type</h3>
              <div className="space-y-2">
                {[
                  { id: 'group', name: 'Group Booking', description: 'Same class for all passengers' },
                  { id: 'individual', name: 'Individual Booking', description: 'Customize class for each passenger' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setBookingType(type.id as 'group' | 'individual')}
                    className={cn(
                      "w-full p-3 border-b transition-all text-left",
                      bookingType === type.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    )}
                    data-testid={`booking-type-${type.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn(
                          "text-sm font-light tracking-wider",
                          bookingType === type.id ? "text-white" : "text-white/60"
                        )}>
                          {type.name}
                        </p>
                        <p className="text-[10px] text-white/40 font-light mt-0.5">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Seat Type */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-3 uppercase text-white/80">2. Seat Type</h3>
              <div className="space-y-2">
                {SEAT_OPTIONS.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => setSelectedSeatType(seat.id)}
                    className={cn(
                      "w-full p-3 border-b transition-all text-left",
                      selectedSeatType === seat.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    )}
                    data-testid={`seat-type-${seat.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm font-light tracking-wider",
                        selectedSeatType === seat.id ? "text-white" : "text-white/60"
                      )}>
                        {seat.name}
                      </p>
                      <span className={cn(
                        "text-xs font-light",
                        selectedSeatType === seat.id ? "text-white" : "text-white/60"
                      )}>
                        {seat.price > 0 ? `+${formatCurrency(seat.price)}/seat` : 'Included'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Number of Seats */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-3 uppercase text-white/80">3. No of Seats</h3>
              <div className="flex items-center gap-3 py-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                  className="border-white/20 text-white hover:bg-white/10 rounded-none h-10 w-10"
                  data-testid="button-decrease-seats"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-light text-white" data-testid="text-seat-count">{seatCount}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-light">Seats</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeatCount(Math.min(9, seatCount + 1))}
                  className="border-white/20 text-white hover:bg-white/10 rounded-none h-10 w-10"
                  data-testid="button-increase-seats"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 4. Class of Booking */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider mb-3 uppercase text-white/80">4. Class of Booking</h3>
              <div className="space-y-2">
                {BOOKING_CLASS_OPTIONS.map((bookClass) => (
                  <button
                    key={bookClass.id}
                    onClick={() => setBookingClass(bookClass.id)}
                    className={cn(
                      "w-full p-3 border-b transition-all text-left",
                      bookingClass === bookClass.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    )}
                    data-testid={`booking-class-${bookClass.id}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={cn(
                        "text-sm font-light tracking-wider",
                        bookingClass === bookClass.id ? "text-white" : "text-white/60"
                      )}>
                        {bookClass.name}
                      </p>
                      <span className={cn(
                        "text-xs font-light",
                        bookingClass === bookClass.id ? "text-white" : "text-white/60"
                      )}>
                        {bookClass.price > 0 ? `+${formatCurrency(bookClass.price)}/person` : 'Included'}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 font-light leading-tight">{bookClass.description}</p>
                  </button>
                ))}
              </div>
              <div className="mt-3 p-3 bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/60 leading-relaxed font-light">
                  <strong className="text-white/80">Note:</strong> In Standard - things will be normal. 
                  In Premium - premium meals, premium travel facilities, Online personal guide. 
                  In Ultra Premium - Personal guide, Ultra premium meals, Ultra premium travel facilities, Photography from Travel guide.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Details - Cardless with Horizontal Tabs */}
        {currentStep === "passengers" && (
          <div className="space-y-4">
            {/* Header with Add Passenger Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-light tracking-wider flex items-center gap-2">
                <User className="h-5 w-5" />
                Passenger Details
              </h3>
              {passengers.length < 9 && (
                <Button
                  onClick={handleAddPassenger}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 rounded-none text-xs"
                  data-testid="button-add-passenger"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Passenger
                </Button>
              )}
            </div>

            {/* Horizontal Scrolling Tabs */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {passengers.map((passenger, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPassenger(index)}
                    className={cn(
                      "px-4 py-2 border-b-2 transition-all whitespace-nowrap text-xs font-light tracking-wider relative group",
                      selectedPassenger === index
                        ? "border-white text-white bg-white/5"
                        : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                    )}
                    data-testid={`tab-passenger-${index}`}
                  >
                    Passenger {index + 1}
                    {passengers.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePassenger(index);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-remove-passenger-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Passenger Form - Cardless */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <Label className="text-white/60 text-[10px] uppercase tracking-wider">Title</Label>
                  <Select
                    value={passengers[selectedPassenger].title}
                    onValueChange={(value) => handlePassengerChange(selectedPassenger, "title", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/60 text-[10px] uppercase tracking-wider">First Name</Label>
                  <Input
                    value={passengers[selectedPassenger].firstName}
                    onChange={(e) => handlePassengerChange(selectedPassenger, "firstName", e.target.value)}
                    className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                    data-testid={`input-firstname-${selectedPassenger}`}
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-[10px] uppercase tracking-wider">Last Name</Label>
                  <Input
                    value={passengers[selectedPassenger].lastName}
                    onChange={(e) => handlePassengerChange(selectedPassenger, "lastName", e.target.value)}
                    className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                    data-testid={`input-lastname-${selectedPassenger}`}
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-[10px] uppercase tracking-wider">Age</Label>
                  <Input
                    type="number"
                    value={passengers[selectedPassenger].age}
                    onChange={(e) => handlePassengerChange(selectedPassenger, "age", e.target.value)}
                    className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                    data-testid={`input-age-${selectedPassenger}`}
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/60 text-[10px] uppercase tracking-wider">Gender</Label>
                <Select
                  value={passengers[selectedPassenger].gender}
                  onValueChange={(value) => handlePassengerChange(selectedPassenger, "gender", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Traveler Type */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm text-white/80 font-light tracking-wider mb-3 flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Traveler Type
              </h4>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { value: "general", label: "General", icon: UserCircle },
                  { value: "student", label: "Student", icon: GraduationCap },
                  { value: "business", label: "Business", icon: Briefcase }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setTravelerType(type.value as any)}
                    className={`flex flex-col items-center gap-1 py-3 border transition-all font-light tracking-wider rounded-none ${
                      travelerType === type.value
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                    }`}
                    data-testid={`button-traveler-${type.value}`}
                  >
                    <type.icon className="h-5 w-5" />
                    <span className="text-[10px]">{type.label}</span>
                  </button>
                ))}
              </div>

              {travelerType === "student" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div>
                    <Label className="text-white/60 text-[10px] uppercase tracking-wider">College Name</Label>
                    <Input
                      value={studentCollegeName}
                      onChange={(e) => setStudentCollegeName(e.target.value)}
                      placeholder="Enter college name"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                      data-testid="input-student-college-name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-[10px] uppercase tracking-wider">College ID</Label>
                    <Input
                      value={studentCollegeId}
                      onChange={(e) => setStudentCollegeId(e.target.value)}
                      placeholder="Enter college ID"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                      data-testid="input-student-college-id"
                    />
                  </div>
                </div>
              )}

              {travelerType === "business" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div>
                    <Label className="text-white/60 text-[10px] uppercase tracking-wider">Business Email</Label>
                    <Input
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="business@company.com"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                      data-testid="input-business-email"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-[10px] uppercase tracking-wider">ID Card Number</Label>
                    <Input
                      value={businessIdCard}
                      onChange={(e) => setBusinessIdCard(e.target.value)}
                      placeholder="Enter ID card number"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                      data-testid="input-business-id"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/60 text-[10px] uppercase tracking-wider">GST Number</Label>
                    <Input
                      value={businessGstNo}
                      onChange={(e) => setBusinessGstNo(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-1 h-9 text-xs"
                      data-testid="input-business-gst"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information with Class Preferences */}
        {currentStep === "contact" && (
          <div className="space-y-6">
            {/* Contact Info Section */}
            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Email Address</Label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                    data-testid="input-email"
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
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>

            {/* Class Preferences for Individual Booking */}
            {bookingType === 'individual' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-light tracking-wider flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Class & Preferences
                  </h3>
                </div>
                <p className="text-xs text-white/60">Select preferences for each passenger</p>

                {/* Horizontal Scrolling Passenger Tabs */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-2 min-w-max">
                    {passengers.map((passenger, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedContactPassenger(index)}
                        className={cn(
                          "px-4 py-2 border-b-2 transition-all whitespace-nowrap text-xs font-light tracking-wider",
                          selectedContactPassenger === index
                            ? "border-white text-white bg-white/5"
                            : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                        )}
                        data-testid={`tab-preferences-passenger-${index}`}
                      >
                        Passenger {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferences for Selected Passenger */}
                <div className="space-y-4">
                  {/* Meal Class */}
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <Utensils className="h-3 w-3" />
                      Meal Class
                    </Label>
                    <div className="space-y-2">
                      {MEAL_CLASS_OPTIONS.map((meal) => (
                        <button
                          key={meal.id}
                          onClick={() => handlePassengerPreferenceChange(selectedContactPassenger, 'mealClass', meal.id)}
                          className={cn(
                            "w-full p-2 border-b transition-all text-left",
                            passengerPreferences[selectedContactPassenger].mealClass === meal.id
                              ? "border-white bg-white/5"
                              : "border-white/10 hover:border-white/30"
                          )}
                          data-testid={`meal-option-${selectedContactPassenger}-${meal.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-light text-xs",
                              passengerPreferences[selectedContactPassenger].mealClass === meal.id ? "text-white" : "text-white/60"
                            )}>
                              {meal.name}
                            </span>
                            <span className={cn(
                              "text-[10px] font-light",
                              passengerPreferences[selectedContactPassenger].mealClass === meal.id ? "text-white" : "text-white/60"
                            )}>
                              {meal.price > 0 ? `+${formatCurrency(meal.price)}` : 'Included'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Travel Class */}
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <Plane className="h-3 w-3" />
                      Travel Class
                    </Label>
                    <div className="space-y-2">
                      {TRAVEL_CLASS_OPTIONS.map((travel) => (
                        <button
                          key={travel.id}
                          onClick={() => handlePassengerPreferenceChange(selectedContactPassenger, 'travelClass', travel.id)}
                          className={cn(
                            "w-full p-2 border-b transition-all text-left",
                            passengerPreferences[selectedContactPassenger].travelClass === travel.id
                              ? "border-white bg-white/5"
                              : "border-white/10 hover:border-white/30"
                          )}
                          data-testid={`travel-option-${selectedContactPassenger}-${travel.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-light text-xs",
                              passengerPreferences[selectedContactPassenger].travelClass === travel.id ? "text-white" : "text-white/60"
                            )}>
                              {travel.name}
                            </span>
                            <span className={cn(
                              "text-[10px] font-light",
                              passengerPreferences[selectedContactPassenger].travelClass === travel.id ? "text-white" : "text-white/60"
                            )}>
                              {travel.price > 0 ? `+${formatCurrency(travel.price)}` : 'Included'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personal Guide */}
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <UserCircle className="h-3 w-3" />
                      Personal Guide
                    </Label>
                    <div className="space-y-2">
                      {PERSONAL_GUIDE_OPTIONS.map((guide) => (
                        <button
                          key={guide.id}
                          onClick={() => handlePassengerPreferenceChange(selectedContactPassenger, 'personalGuide', guide.id)}
                          className={cn(
                            "w-full p-2 border-b transition-all text-left",
                            passengerPreferences[selectedContactPassenger].personalGuide === guide.id
                              ? "border-white bg-white/5"
                              : "border-white/10 hover:border-white/30"
                          )}
                          data-testid={`guide-option-${selectedContactPassenger}-${guide.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-light text-xs",
                              passengerPreferences[selectedContactPassenger].personalGuide === guide.id ? "text-white" : "text-white/60"
                            )}>
                              {guide.name}
                            </span>
                            <span className={cn(
                              "text-[10px] font-light",
                              passengerPreferences[selectedContactPassenger].personalGuide === guide.id ? "text-white" : "text-white/60"
                            )}>
                              {guide.price > 0 ? `+${formatCurrency(guide.price)}` : 'No charge'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photography - Only if Direct Guide */}
                  {passengerPreferences[selectedContactPassenger].personalGuide === 'direct' && (
                    <div className="border-t border-white/10 pt-3">
                      <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Camera className="h-3 w-3" />
                        Photography Service
                      </Label>
                      <button
                        onClick={() => handlePassengerPreferenceChange(selectedContactPassenger, 'photography', !passengerPreferences[selectedContactPassenger].photography)}
                        className={cn(
                          "w-full p-3 border-b transition-all text-left",
                          passengerPreferences[selectedContactPassenger].photography
                            ? "border-white bg-white/5"
                            : "border-white/10 hover:border-white/30"
                        )}
                        data-testid={`photography-option-${selectedContactPassenger}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={cn(
                              "font-light text-xs mb-0.5",
                              passengerPreferences[selectedContactPassenger].photography ? "text-white" : "text-white/60"
                            )}>
                              Professional Photography
                            </p>
                            <p className="text-[10px] text-white/40">Capture your journey with professional photos</p>
                          </div>
                          <span className={cn(
                            "text-[10px] font-light",
                            passengerPreferences[selectedContactPassenger].photography ? "text-white" : "text-white/60"
                          )}>
                            +{formatCurrency(PHOTOGRAPHY_PRICE)}
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-white font-light tracking-wider mb-4">Price Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Base Price ({currentTravelerCount} traveler{currentTravelerCount > 1 ? 's' : ''})</span>
                  <span className="font-light">{formatCurrency(trip.basePrice * currentTravelerCount)}</span>
                </div>
                {seatPrice > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Seat Upgrade ({seatCount} seats)</span>
                    <span className="font-light">{formatCurrency(seatPrice * seatCount)}</span>
                  </div>
                )}
                {bookingClassPrice > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Booking Class</span>
                    <span className="font-light">{formatCurrency(bookingClassPrice * currentTravelerCount)}</span>
                  </div>
                )}
                {passengerPreferencesTotal > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Class & Preferences</span>
                    <span className="font-light">{formatCurrency(passengerPreferencesTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Taxes & Fees</span>
                  <span className="font-light">{formatCurrency(trip.taxesPerPerson * currentTravelerCount + trip.convenienceFee)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white text-xl">
                  <span className="font-light">Total Amount</span>
                  <span className="font-bold" data-testid="text-total-amount">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="border border-white/20 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Flexible Booking</h4>
                  <p className="text-white/70 text-xs leading-relaxed">
                    Free cancellation up to 15 days before departure. Change dates or travelers without penalties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <div className="space-y-6">
            {/* Select Bank Account - Multi-option design from UPI page */}
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
                    data-testid={`account-option-${account.id}`}
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
                      )} data-testid={`balance-${account.id}`}>
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
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

      {/* Backdrop Overlay */}
      {showPinPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setShowPinPopup(false)}
          data-testid="popup-backdrop"
        />
      )}

      {/* PIN Popup */}
      <div 
        className={cn(
          "fixed left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-[60] transition-all duration-300 ease-in-out",
          showPinPopup ? "bottom-20" : "-bottom-[400px]"
        )}
        data-testid="pin-popup"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Enter 4-Digit UPI PIN
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPin(!showPin)}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-7 px-2 font-light"
              data-testid="button-toggle-pin"
            >
              {showPin ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                id={`pin-${index}`}
                type={showPin ? "text" : "password"}
                maxLength={1}
                value={upiPin[index]}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className="w-16 h-16 text-center text-3xl font-light bg-transparent border-b-2 border-white/20 rounded-none text-white focus:border-white transition-colors"
                data-testid={`input-pin-${index}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <p className="text-xs text-white/60 font-light tracking-wider" data-testid="account-info">
              {mockBankAccounts.find(acc => acc.id === selectedAccount)?.bankName} • {mockBankAccounts.find(acc => acc.id === selectedAccount)?.upiId}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="border border-white/20 p-4 mb-3 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <p className="text-xs text-white/80 font-light mb-1">{trip.destinations.join(' → ')}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/60">
                  <span>{trip.days}D/{trip.nights}N</span>
                  <span>•</span>
                  <span>{formatDate(trip.startDate)} - {formatEndDate(trip.startDate, trip.nights)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-widest font-light mb-1">Total Amount</p>
                <p className="text-2xl font-light text-white" data-testid="text-bottom-total">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-white/70">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {passengers.length} Traveler{passengers.length > 1 ? 's' : ''}
                  </span>
                  {seatCount > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Armchair className="h-3 w-3" />
                        {seatCount} {(SEAT_OPTIONS.find(s => s.id === selectedSeatType)?.name || 'Seat') + (seatCount > 1 ? 's' : '')}
                      </span>
                    </>
                  )}
                  {bookingClass && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{bookingClass.replace('-', ' ')} Class</span>
                    </>
                  )}
                </div>
                {bookingType === 'individual' && passengerPreferencesTotal > 0 && (
                  <span className="text-white/60">
                    +{formatCurrency(passengerPreferencesTotal)} preferences
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleContinue}
            disabled={currentStep === "payment" && showPinPopup && upiPin.join('').length !== 4}
            className={cn(
              "w-full rounded-none h-14 text-base font-light tracking-wider",
              currentStep === "payment" && showPinPopup && upiPin.join('').length !== 4
                ? "bg-white/20 text-white/40 cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90"
            )}
            data-testid="button-continue"
          >
            {currentStep === "payment" ? (
              showPinPopup ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  CONFIRM PAYMENT {formatCurrency(totalPrice)}
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  PAY {formatCurrency(totalPrice)}
                </>
              )
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
