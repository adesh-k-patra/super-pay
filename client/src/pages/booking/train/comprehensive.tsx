import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  Train,
  CheckCircle,
  Users,
  IndianRupee,
  Shield,
  Clock,
  MapPin,
  User,
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  Plus,
  ShoppingBag,
  Ticket,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainData {
  trainId: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

interface ClassInfo {
  class: string;
  name: string;
  price: number;
  available: number;
  waitlist?: number;
}

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
}

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const BOOKING_STAGES: BookingStage[] = [
  {
    id: 'train-details',
    title: 'Train Information',
    shortTitle: 'Train',
    icon: Train,
    description: 'Review train details and journey information'
  },
  {
    id: 'class-selection',
    title: 'Class Selection',
    shortTitle: 'Class',
    icon: Star,
    description: 'Choose your travel class'
  },
  {
    id: 'quota-fare',
    title: 'Quota & Fare Type',
    shortTitle: 'Quota',
    icon: Ticket,
    description: 'Select quota and fare type'
  },
  {
    id: 'passenger-details',
    title: 'Passenger Details',
    shortTitle: 'Passengers',
    icon: Users,
    description: 'Enter passenger information'
  },
  {
    id: 'payment',
    title: 'Payment',
    shortTitle: 'Payment',
    icon: CreditCard,
    description: 'Complete your booking with secure payment'
  }
];

const AVAILABLE_CLASSES: ClassInfo[] = [
  { class: "1A", name: "First AC", price: 2500, available: 15 },
  { class: "2A", name: "Second AC", price: 1500, available: 45 },
  { class: "3A", name: "Third AC", price: 1000, available: 67 },
  { class: "SL", name: "Sleeper", price: 400, available: 120 },
  { class: "CC", name: "Chair Car", price: 800, available: 30 },
  { class: "2S", name: "Second Sitting", price: 200, available: 0, waitlist: 15 },
  { class: "3E", name: "3AC Economy", price: 850, available: 25 },
];

const QUOTA_OPTIONS = [
  { id: 'general', name: 'General Quota', description: 'Regular booking quota' },
  { id: 'ladies', name: 'Ladies Quota', description: 'Reserved for female passengers' },
  { id: 'senior', name: 'Senior Citizen', description: 'For passengers 60+ years' },
  { id: 'tatkal', name: 'Tatkal', description: 'Emergency booking quota' },
  { id: 'premium-tatkal', name: 'Premium Tatkal', description: 'Premium emergency quota' },
  { id: 'divyaang', name: 'Divyaang Quota', description: 'For differently-abled passengers' }
];

const FARE_TYPES = [
  { id: 'general', name: 'General Fare', surcharge: 0, description: 'Standard fare' },
  { id: 'tatkal', name: 'Tatkal Fare', surcharge: 300, description: 'Emergency booking with surcharge' },
  { id: 'premium-tatkal', name: 'Premium Tatkal', surcharge: 500, description: 'Premium emergency booking' }
];

export default function TrainBookingComprehensive() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(window.location.search);
  const trainData: TrainData = {
    trainId: params.get("trainId") || "",
    trainNumber: params.get("trainNumber") || "",
    trainName: params.get("trainName") || "",
    from: params.get("from") || "",
    to: params.get("to") || "",
    departureDate: params.get("departureDate") || "",
    departureTime: params.get("departureTime") || "",
    arrivalTime: params.get("arrivalTime") || "",
    duration: params.get("duration") || ""
  };

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Booking selections
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [selectedQuota, setSelectedQuota] = useState('general');
  const [selectedFareType, setSelectedFareType] = useState('general');
  
  // Passenger details
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }
  ]);
  const [currentPassengerTab, setCurrentPassengerTab] = useState(0);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [netbankingUsername, setNetbankingUsername] = useState('');
  const [netbankingPassword, setNetbankingPassword] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  // Calculate total price
  const baseFare = selectedClass ? selectedClass.price * passengers.length : 0;
  const fareTypeSurcharge = FARE_TYPES.find(f => f.id === selectedFareType)?.surcharge || 0;
  const totalFareSurcharge = fareTypeSurcharge * passengers.length;
  const convenienceFee = 50;
  const basePrice = baseFare + totalFareSurcharge + convenienceFee;

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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const handleNextStage = () => {
    // Validate class selection
    if (currentStage.id === 'class-selection' && !selectedClass) {
      toast({
        title: "Class Selection Required",
        description: "Please select a travel class",
        variant: "destructive"
      });
      return;
    }

    // Validate passenger details
    if (currentStage.id === 'passenger-details') {
      // Check if all passengers have required fields filled
      const hasInvalidPassenger = passengers.some(p => 
        !p.firstName.trim() || !p.lastName.trim() || !p.age.trim()
      );
      
      if (hasInvalidPassenger) {
        toast({
          title: "Passenger Details Required",
          description: "Please fill in all passenger details (name and age)",
          variant: "destructive"
        });
        return;
      }

      // Validate contact information
      if (!contactEmail.trim() || !contactPhone.trim()) {
        toast({
          title: "Contact Information Required",
          description: "Please provide email and phone number",
          variant: "destructive"
        });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }

      // Basic phone validation (10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(contactPhone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit phone number",
          variant: "destructive"
        });
        return;
      }
    }

    // Handle payment submission
    if (currentStage.id === 'payment') {
      handleProceedToPayment();
      return;
    }

    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < BOOKING_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handlePreviousStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  const handleStageClick = (stageIndex: number) => {
    if (completedStages.includes(stageIndex) || stageIndex <= currentStageIndex) {
      setCurrentStageIndex(stageIndex);
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAddPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }]);
      setCurrentPassengerTab(passengers.length);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      if (currentPassengerTab >= passengers.length - 1) {
        setCurrentPassengerTab(Math.max(0, passengers.length - 2));
      }
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleProceedToPayment = () => {
    // If UPI selected, navigate directly to UPI payment page without validation
    if (paymentMethod === 'upi') {
      const upiPaymentParams = new URLSearchParams({
        amount: totalPrice.toString(),
        type: 'train',
        trainId: trainData.trainId,
        trainNumber: trainData.trainNumber,
        trainName: trainData.trainName,
        from: trainData.from,
        to: trainData.to,
        departureDate: trainData.departureDate,
        class: selectedClass?.class || '',
        className: selectedClass?.name || '',
        quota: selectedQuota,
        fareType: selectedFareType,
        passengers: JSON.stringify(passengers),
        contactEmail,
        contactPhone,
        returnUrl: `/booking/train/results`
      });
      navigate(`/upi-payment?${upiPaymentParams.toString()}`);
      return;
    }

    if (paymentMethod === 'card' && !selectedCard && !showNewCardForm) {
      toast({
        title: "Card Selection Required",
        description: "Please select a card or add a new one",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'card' && showNewCardForm) {
      if (!newCardNumber || !newCardName || !newCardExpiry || !newCardCvv) {
        toast({
          title: "Card Details Required",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
    }

    if (paymentMethod === 'netbanking' && (!selectedBank || !netbankingUsername || !netbankingPassword)) {
      toast({
        title: "Net Banking Details Required",
        description: "Please enter bank and credentials",
        variant: "destructive"
      });
      return;
    }

    // For card and netbanking, go directly to success
    const bookingData = new URLSearchParams({
      amount: totalPrice.toString(),
      type: 'train',
      bookingType: 'Train Booking',
      route: `${trainData.from} → ${trainData.to}`,
      date: trainData.departureDate,
      time: `${trainData.departureTime} - ${trainData.arrivalTime}`,
      class: selectedClass?.name || ''
    });
    navigate(`/transaction-success?${bookingData.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'train-details':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Train className="h-5 w-5" />
                Train Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Train Name</Label>
                    <p className="text-white text-base mt-1">{trainData.trainName}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Train Number</Label>
                    <p className="text-white text-base mt-1">{trainData.trainNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Journey Information
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-light text-white">{trainData.departureTime}</p>
                  <p className="text-sm text-white/60">{trainData.from}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <p className="text-xs text-white/60 mb-1">{trainData.duration}</p>
                  <div className="h-px bg-white/20"></div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none mt-1">
                    Direct
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{trainData.arrivalTime}</p>
                  <p className="text-sm text-white/60">{trainData.to}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-white/60">
                <span><Clock className="inline h-3 w-3 mr-1" />{trainData.departureDate}</span>
              </div>
            </div>
          </div>
        );

      case 'class-selection':
        return (
          <div className="space-y-4">
            {AVAILABLE_CLASSES.map((classInfo) => (
              <button
                key={classInfo.class}
                onClick={() => setSelectedClass(classInfo)}
                className={cn(
                  "w-full border p-4 transition-all text-left rounded-none",
                  selectedClass?.class === classInfo.class
                    ? "bg-white/10 border-white"
                    : "bg-white/5 border-white/20 hover:border-white/40",
                  classInfo.available === 0 && "opacity-50 cursor-not-allowed"
                )}
                disabled={classInfo.available === 0}
                data-testid={`button-class-${classInfo.class}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-light text-white">{classInfo.name}</span>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none">
                        {classInfo.class}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/60 font-light">{formatCurrency(classInfo.price)}</span>
                      <span className="text-white/40">•</span>
                      <span className={cn(
                        "font-light",
                        classInfo.available > 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {classInfo.available > 0
                          ? `${classInfo.available} Available`
                          : `Waitlist ${classInfo.waitlist || 0}`
                        }
                      </span>
                    </div>
                  </div>
                  {selectedClass?.class === classInfo.class && (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'quota-fare':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Quota Selection</h3>
              <RadioGroup value={selectedQuota} onValueChange={setSelectedQuota}>
                <div className="space-y-2">
                  {QUOTA_OPTIONS.map((quota) => (
                    <div key={quota.id} className="flex items-center space-x-3 border border-white/20 p-4 bg-white/5">
                      <RadioGroupItem value={quota.id} id={quota.id} className="border-white/40 text-white" data-testid={`radio-quota-${quota.id}`} />
                      <Label htmlFor={quota.id} className="flex-1 cursor-pointer">
                        <p className="text-white font-light">{quota.name}</p>
                        <p className="text-xs text-white/60">{quota.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Fare Type</h3>
              <RadioGroup value={selectedFareType} onValueChange={setSelectedFareType}>
                <div className="space-y-2">
                  {FARE_TYPES.map((fare) => (
                    <div key={fare.id} className="flex items-center space-x-3 border border-white/20 p-4 bg-white/5">
                      <RadioGroupItem value={fare.id} id={fare.id} className="border-white/40 text-white" data-testid={`radio-fare-${fare.id}`} />
                      <Label htmlFor={fare.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-light">{fare.name}</p>
                            <p className="text-xs text-white/60">{fare.description}</p>
                          </div>
                          {fare.surcharge > 0 && (
                            <span className="text-white/60 text-sm">+{formatCurrency(fare.surcharge)}</span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'passenger-details':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Passenger Information
              </h3>

              <div className="mb-6 overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {passengers.map((passenger, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPassengerTab(index)}
                      className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                        currentPassengerTab === index
                          ? 'border-white bg-white/5 text-white'
                          : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                      }`}
                      data-testid={`tab-passenger-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-light tracking-wider">
                          Passenger {index + 1}
                        </span>
                        {passenger.firstName && (
                          <span className="text-xs text-white/60">
                            {passenger.firstName}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-white/80 font-light uppercase tracking-wider text-xs">
                    Passenger {currentPassengerTab + 1}
                  </Label>
                  {passengers.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemovePassenger(currentPassengerTab)}
                      className="text-white/60 hover:text-white h-auto p-1"
                      data-testid={`button-remove-passenger-${currentPassengerTab}`}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Title</Label>
                    <Select
                      value={passengers[currentPassengerTab].title}
                      onValueChange={(value) => handlePassengerChange(currentPassengerTab, "title", value)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none mt-2">
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
                    <Label className="text-white/60 text-xs uppercase tracking-wider">First Name</Label>
                    <Input
                      value={passengers[currentPassengerTab].firstName}
                      onChange={(e) => handlePassengerChange(currentPassengerTab, "firstName", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid={`input-firstname-${currentPassengerTab}`}
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Last Name</Label>
                    <Input
                      value={passengers[currentPassengerTab].lastName}
                      onChange={(e) => handlePassengerChange(currentPassengerTab, "lastName", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid={`input-lastname-${currentPassengerTab}`}
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Age</Label>
                    <Input
                      type="number"
                      value={passengers[currentPassengerTab].age}
                      onChange={(e) => handlePassengerChange(currentPassengerTab, "age", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid={`input-age-${currentPassengerTab}`}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Gender</Label>
                  <Select
                    value={passengers[currentPassengerTab].gender}
                    onValueChange={(value) => handlePassengerChange(currentPassengerTab, "gender", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none mt-2">
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

              {passengers.length < 6 && (
                <Button
                  onClick={handleAddPassenger}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-none mt-6"
                  data-testid="button-add-passenger"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Passenger
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-6 text-white">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
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
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Mobile Number</Label>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="9876543210"
                    className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <CouponSelector
              category="travel"
              bookingAmount={basePrice}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
            />

            <h3 className="text-lg font-light tracking-wider text-white">Payment Method</h3>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="border border-white/20 p-4 bg-white/5">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="upi" id="upi" className="border-white/40 text-white" data-testid="radio-payment-upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-4 w-4 text-white/60" />
                      <span className="text-white font-light">UPI</span>
                    </Label>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pl-7">
                      <Label className="text-white/60 text-xs uppercase tracking-wider">UPI ID (Optional)</Label>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                        data-testid="input-upi-id"
                      />
                      <p className="text-xs text-white/40 mt-2">You can enter UPI ID on the next page</p>
                    </div>
                  )}
                </div>

                <div className="border border-white/20 p-4 bg-white/5">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" className="border-white/40 text-white" data-testid="radio-payment-card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-4 w-4 text-white/60" />
                      <span className="text-white font-light">Credit/Debit Card</span>
                    </Label>
                  </div>
                </div>

                <div className="border border-white/20 p-4 bg-white/5">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="netbanking" id="netbanking" className="border-white/40 text-white" data-testid="radio-payment-netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="h-4 w-4 text-white/60" />
                      <span className="text-white font-light">Net Banking</span>
                    </Label>
                  </div>
                </div>

                <div className="border border-white/20 p-4 bg-white/5">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="wallet" id="wallet" className="border-white/40 text-white" data-testid="radio-payment-wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-4 w-4 text-white/60" />
                      <span className="text-white font-light">Wallets</span>
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/booking/train/results")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">TRAIN BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{trainData.trainNumber} - {trainData.trainName}</p>
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
                    className={`flex flex-col items-center transition-all ${
                      isAccessible ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"
                    }`}
                    disabled={!isAccessible}
                    data-testid={`stage-button-${stage.id}`}
                  >
                    <div
                      className={`w-8 h-8 border-b-2 flex items-center justify-center text-xs font-light transition-all duration-200 ${
                        isCompleted 
                          ? 'border-white bg-white/5 text-white' 
                          : isCurrent 
                            ? 'border-white bg-white/5 text-white' 
                            : isAccessible
                              ? 'border-white/20 bg-transparent text-white/60'
                              : 'border-white/10 bg-transparent text-white/30'
                      }`}
                      data-testid={`stage-${stage.id}`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`text-[10px] mt-2 text-center transition-colors uppercase tracking-wider font-light ${
                      isCurrent ? 'text-white' : 'text-white/40'
                    }`}>
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
      <div ref={scrollableContentRef} className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Train Info Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Train className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{trainData.trainName}</p>
                <p className="text-white/60 text-xs">{trainData.trainNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{trainData.departureDate}</p>
              <p className="text-white/60 text-xs">{trainData.departureTime} - {trainData.arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Stage Title */}
        <div className="space-y-2">
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
          <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Fare Summary</h3>
          <div className="space-y-3">
            {selectedClass && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
                <span className="font-light">{formatCurrency(baseFare)}</span>
              </div>
            )}
            {totalFareSurcharge > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Fare Surcharge</span>
                <span className="font-light">{formatCurrency(totalFareSurcharge)}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Convenience Fee</span>
              <span className="font-light">{formatCurrency(convenienceFee)}</span>
            </div>
            {appliedCoupon && couponDiscount > 0 && (
              <>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-light">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-light">-{formatCurrency(couponDiscount)}</span>
                </div>
              </>
            )}
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-white text-xl">
              <span className="font-light">Total Amount</span>
              <span className="font-bold" data-testid="text-total-amount">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{trainData.trainNumber}</p>
              <p className="text-sm text-white font-light">{trainData.departureDate} • {trainData.departureTime}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Amount</p>
              <p className="text-xl font-light text-white">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
          <Button
            onClick={handleNextStage}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
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
