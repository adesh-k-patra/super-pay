import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Train,
  CheckCircle,
  Users,
  Shield,
  Clock,
  MapPin,
  User,
  UserCircle,
  Calendar,
  Star,
  Wifi,
  Utensils,
  CreditCard,
  Plus,
  X,
  Mail,
  Phone,
  Smartphone,
  Building2
} from "lucide-react";

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  berth: string;
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
    id: 'traveler-info',
    title: 'Traveler Details',
    shortTitle: 'Details',
    icon: UserCircle,
    description: 'Passenger and contact information'
  },
  {
    id: 'summary',
    title: 'Booking Summary',
    shortTitle: 'Summary',
    icon: CheckCircle,
    description: 'Review your booking before payment'
  },
  {
    id: 'payment',
    title: 'Payment Method',
    shortTitle: 'Payment',
    icon: CreditCard,
    description: 'Select payment method'
  }
];

export default function TrainPassengerDetails() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(window.location.search);
  const trainId = params.get("trainId") || "";
  const trainNumber = params.get("trainNumber") || "";
  const trainName = params.get("trainName") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") || "";
  const departureTime = params.get("departureTime") || "";
  const arrivalTime = params.get("arrivalTime") || "";
  const duration = params.get("duration") || "";
  const bookingsParam = params.get("bookings") || "[]";
  const totalPassengers = parseInt(params.get("totalPassengers") || "1");
  const totalPrice = parseFloat(params.get("totalPrice") || "0");

  const classBookings = JSON.parse(bookingsParam);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Initialize passengers
  const defaultPassengers = Array.from({ length: totalPassengers }, (_, i) => ({
    title: "Mr",
    firstName: i === 0 ? "Rahul" : `Passenger${i + 1}`,
    lastName: i === 0 ? "Patel" : "LastName",
    age: i === 0 ? "28" : "25",
    gender: "Male",
    berth: "No Preference"
  }));

  const [passengers, setPassengers] = useState<PassengerInfo[]>(defaultPassengers);
  const [currentPassengerTab, setCurrentPassengerTab] = useState(0);
  const [contactEmail, setContactEmail] = useState("rahul.patel@example.com");
  const [contactPhone, setContactPhone] = useState("9876543210");
  const [irctcNumber, setIrctcNumber] = useState("");
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [netbankingUsername, setNetbankingUsername] = useState('');
  const [netbankingPassword, setNetbankingPassword] = useState('');

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const handleNextStage = () => {
    // Validation for traveler info stage
    if (currentStage.id === 'traveler-info') {
      // Check if all passengers have required info
      const allPassengersValid = passengers.every(
        p => p.firstName && p.lastName && p.age && p.gender
      );
      
      if (!allPassengersValid) {
        toast({
          title: "Incomplete Passenger Information",
          description: "Please fill in all passenger details",
          variant: "destructive"
        });
        return;
      }

      if (!contactEmail || !contactPhone) {
        toast({
          title: "Contact Information Required",
          description: "Please provide email and phone number",
          variant: "destructive"
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }

      // Validate phone format
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(contactPhone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit mobile number",
          variant: "destructive"
        });
        return;
      }
    }

    // Handle payment on summary stage
    if (currentStage.id === 'summary') {
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

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleProceedToPayment = () => {
    const bookingData: Record<string, string> = {
      trainId,
      trainNumber,
      trainName,
      from,
      to,
      departureDate,
      departureTime,
      arrivalTime,
      duration,
      bookings: bookingsParam,
      passengers: JSON.stringify(passengers),
      contactEmail,
      contactPhone,
      ...(irctcNumber && { irctcNumber }),
      amount: totalPrice.toString(),
    };

    const queryParams = new URLSearchParams(bookingData);
    navigate(`/upi-payment?${queryParams.toString()}&type=train`);
  };

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
                    <p className="text-white text-base mt-1 font-light">{trainName}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Train Number</Label>
                    <p className="text-white text-base mt-1 font-light">{trainNumber}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Booking Classes</Label>
                  <div className="mt-2 space-y-2">
                    {classBookings.map((booking: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                        <span className="text-sm text-white font-light">
                          {booking.class} × {booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-white font-light">
                          {formatCurrency(booking.price * booking.passengers)}
                        </span>
                      </div>
                    ))}
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
                  <p className="text-2xl font-light text-white">{departureTime}</p>
                  <p className="text-sm text-white/60 font-light">{from}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <p className="text-xs text-white/60 font-light mb-1">{duration}</p>
                  <div className="h-px bg-white/20"></div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none mt-1 font-light">
                    Direct Train
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{arrivalTime}</p>
                  <p className="text-sm text-white/60 font-light">{to}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-white/60 font-light">
                <span><Calendar className="inline h-3 w-3 mr-1" />{departureDate}</span>
                <span className="flex-1 text-center"><Clock className="inline h-3 w-3 mr-1" />{duration}</span>
                <span><Users className="inline h-3 w-3 mr-1" />{totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Star className="h-5 w-5" />
                Train Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Wifi, label: 'Wi-Fi Available' },
                  { icon: Utensils, label: 'Meals Available' },
                  { icon: Shield, label: 'Travel Insurance' },
                  { icon: CreditCard, label: 'IRCTC Compatible' }
                ].map((facility, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10">
                    <facility.icon className="h-6 w-6 text-white/60" />
                    <span className="text-xs text-white/60 text-center font-light">{facility.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'traveler-info':
        return (
          <div className="space-y-6">
            {/* Passenger Tabs */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-4">
              <h3 className="text-sm font-light tracking-wider mb-3 text-white uppercase flex items-center gap-2">
                <Users className="h-4 w-4" />
                Passengers ({passengers.length})
              </h3>
              <div className="flex gap-2 flex-wrap">
                {passengers.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPassengerTab(idx)}
                    className={cn(
                      "px-4 py-2 border text-xs uppercase tracking-wider transition-all rounded-none font-light",
                      currentPassengerTab === idx
                        ? "bg-white text-black border-white"
                        : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                    )}
                    data-testid={`button-passenger-tab-${idx}`}
                  >
                    Passenger {idx + 1}
                    {p.firstName && <CheckCircle className="inline h-3 w-3 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Passenger Form */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wider text-white">
                  Passenger {currentPassengerTab + 1} Details
                </h3>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                  As per Government ID
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Title</Label>
                  <Select
                    value={passengers[currentPassengerTab].title}
                    onValueChange={(value) => handlePassengerChange(currentPassengerTab, 'title', value)}
                  >
                    <SelectTrigger 
                      className="bg-transparent border-white/20 text-white rounded-none mt-2"
                      data-testid={`select-title-${currentPassengerTab}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* First Name */}
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">First Name</Label>
                  <Input
                    value={passengers[currentPassengerTab].firstName}
                    onChange={(e) => handlePassengerChange(currentPassengerTab, 'firstName', e.target.value)}
                    placeholder="As per ID"
                    className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40 mt-2"
                    data-testid={`input-firstname-${currentPassengerTab}`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Last Name</Label>
                  <Input
                    value={passengers[currentPassengerTab].lastName}
                    onChange={(e) => handlePassengerChange(currentPassengerTab, 'lastName', e.target.value)}
                    placeholder="As per ID"
                    className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40 mt-2"
                    data-testid={`input-lastname-${currentPassengerTab}`}
                  />
                </div>

                {/* Age */}
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Age</Label>
                  <Input
                    type="number"
                    value={passengers[currentPassengerTab].age}
                    onChange={(e) => handlePassengerChange(currentPassengerTab, 'age', e.target.value)}
                    placeholder="Age"
                    className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40 mt-2"
                    data-testid={`input-age-${currentPassengerTab}`}
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Gender</Label>
                  <Select
                    value={passengers[currentPassengerTab].gender}
                    onValueChange={(value) => handlePassengerChange(currentPassengerTab, 'gender', value)}
                  >
                    <SelectTrigger 
                      className="bg-transparent border-white/20 text-white rounded-none mt-2"
                      data-testid={`select-gender-${currentPassengerTab}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Berth Preference */}
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Berth Preference (Optional)</Label>
                  <Select
                    value={passengers[currentPassengerTab].berth}
                    onValueChange={(value) => handlePassengerChange(currentPassengerTab, 'berth', value)}
                  >
                    <SelectTrigger 
                      className="bg-transparent border-white/20 text-white rounded-none mt-2"
                      data-testid={`select-berth-${currentPassengerTab}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No Preference">No Preference</SelectItem>
                      <SelectItem value="Lower">Lower</SelectItem>
                      <SelectItem value="Middle">Middle</SelectItem>
                      <SelectItem value="Upper">Upper</SelectItem>
                      <SelectItem value="Side Lower">Side Lower</SelectItem>
                      <SelectItem value="Side Upper">Side Upper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Navigation between passengers */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button
                  onClick={() => setCurrentPassengerTab(Math.max(0, currentPassengerTab - 1))}
                  disabled={currentPassengerTab === 0}
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-none disabled:opacity-30"
                  data-testid="button-prev-passenger"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Passenger
                </Button>
                <Button
                  onClick={() => setCurrentPassengerTab(Math.min(passengers.length - 1, currentPassengerTab + 1))}
                  disabled={currentPassengerTab === passengers.length - 1}
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-none disabled:opacity-30"
                  data-testid="button-next-passenger"
                >
                  Next Passenger
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 space-y-4">
              <h3 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Email Address</Label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40 mt-2"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">Mobile Number</Label>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40 mt-2"
                    data-testid="input-phone"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <CreditCard className="h-3 w-3" />
                    IRCTC User ID (Optional)
                  </Label>
                  <Input
                    value={irctcNumber}
                    onChange={(e) => setIrctcNumber(e.target.value)}
                    placeholder="Enter your IRCTC User ID"
                    className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40 mt-2"
                    data-testid="input-irctc"
                  />
                  <p className="text-xs text-white/40 font-light mt-1">
                    This helps in faster ticket booking and management
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            {/* Journey Summary */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Train className="h-5 w-5" />
                Journey Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-light">Train</span>
                  <span className="text-white font-light">{trainName} ({trainNumber})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-light">Route</span>
                  <span className="text-white font-light">{from} → {to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-light">Date</span>
                  <span className="text-white font-light">{departureDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-light">Timing</span>
                  <span className="text-white font-light">{departureTime} - {arrivalTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-light">Duration</span>
                  <span className="text-white font-light">{duration}</span>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Booking Summary
              </h3>
              <div className="space-y-3">
                {classBookings.map((booking: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                    <span className="text-sm text-white/60 font-light">
                      {booking.class} × {booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-white font-light">
                      {formatCurrency(booking.price * booking.passengers)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Passenger List */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Passengers
              </h3>
              <div className="space-y-2">
                {passengers.map((passenger, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-white font-light">
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </p>
                      <p className="text-xs text-white/60 font-light">
                        Age: {passenger.age} • {passenger.gender} • {passenger.berth}
                      </p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-xs">
                      Passenger {idx + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Summary */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-white/60" />
                  <span className="text-white font-light">{contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/60" />
                  <span className="text-white font-light">+91 {contactPhone}</span>
                </div>
                {irctcNumber && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-white/60" />
                    <span className="text-white font-light">IRCTC ID: {irctcNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Price Breakdown</h3>
              <div className="space-y-2 mb-4">
                {classBookings.map((booking: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-white/60 font-light">
                      {booking.class} (₹{booking.price} × {booking.passengers})
                    </span>
                    <span className="text-white font-light">
                      {formatCurrency(booking.price * booking.passengers)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4 bg-white/10" />
              <div className="flex items-center justify-between text-lg">
                <span className="text-white font-light">Total Amount</span>
                <span className="text-white font-light">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goBack()}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">TRAIN BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {currentStage.shortTitle}
              </p>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <Progress value={progressPercentage} className="h-1 bg-white/10" />
          </div>

          {/* Stage Navigation */}
          <div className="flex items-center justify-between gap-2">
            {BOOKING_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === currentStageIndex;
              const isCompleted = completedStages.includes(index);
              const isClickable = isCompleted || index <= currentStageIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => isClickable && handleStageClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 p-2 border transition-all rounded-none",
                    isActive && "bg-white text-black border-white",
                    !isActive && isCompleted && "bg-white/10 text-white border-white/30 hover:bg-white/20",
                    !isActive && !isCompleted && "bg-white/5 text-white/40 border-white/10 cursor-not-allowed"
                  )}
                  data-testid={`button-stage-${stage.id}`}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-black", !isActive && "text-white/60")} />
                  <span className="text-[10px] uppercase tracking-wider font-light">
                    {stage.shortTitle}
                  </span>
                  {isCompleted && index !== currentStageIndex && (
                    <CheckCircle className="h-3 w-3 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollableContentRef}
        className="pt-52 pb-32 px-4 overflow-y-auto"
      >
        <div className="max-w-screen-lg mx-auto">
          {/* Stage Description */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-light tracking-wider text-white mb-2">{currentStage.title}</h2>
            <p className="text-sm text-white/60 font-light">{currentStage.description}</p>
          </div>

          {/* Stage Content */}
          {renderStageContent()}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-white/60 uppercase tracking-wider font-light">Total Amount</p>
            <p className="text-xl font-light text-white">{formatCurrency(totalPrice)}</p>
          </div>

          {currentStageIndex > 0 && (
            <Button
              onClick={handlePreviousStage}
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-none h-12 px-6"
              data-testid="button-previous-stage"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK
            </Button>
          )}

          <Button
            onClick={handleNextStage}
            className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 text-sm tracking-wider font-light"
            data-testid="button-next-stage"
          >
            {currentStage.id === 'summary' ? 'PROCEED TO PAYMENT' : 'CONTINUE'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
