import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  CheckCircle,
  Users,
  Utensils,
  Luggage,
  Shield,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Briefcase,
  UserCircle,
  Calendar,
  Star,
  Wifi,
  Tv,
  UtensilsCrossed,
  Coffee,
  Sandwich,
  IceCream,
  Circle,
  CreditCard,
  Smartphone,
  Building2,
  Plus,
  ShoppingBag
} from "lucide-react";

interface FlightData {
  id: string;
  airline: string;
  flightNumber: string;
  aircraftModel: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  duration: string;
  basePrice: number;
  taxesPerPassenger: number;
  convenienceFee: number;
  stops: number;
  class: string;
  available: number;
}

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
}

interface SeatSelection {
  row: number;
  seat: string;
  passengerId: number;
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
    id: 'flight-details',
    title: 'Flight Information',
    shortTitle: 'Flight',
    icon: Plane,
    description: 'Review flight details and specifications'
  },
  {
    id: 'traveler-info',
    title: 'Traveler Details',
    shortTitle: 'Details',
    icon: UserCircle,
    description: 'Passenger and contact information'
  },
  {
    id: 'seat-selection',
    title: 'Seat Selection',
    shortTitle: 'Seats',
    icon: Users,
    description: 'Choose your preferred seats'
  },
  {
    id: 'class-selection',
    title: 'Travel Class',
    shortTitle: 'Class',
    icon: Star,
    description: 'Select your travel class'
  },
  {
    id: 'addons-selection',
    title: 'Add-ons',
    shortTitle: 'Add-ons',
    icon: ShoppingBag,
    description: 'Choose luggage and meal preferences'
  },
  {
    id: 'payment',
    title: 'Payment',
    shortTitle: 'Payment',
    icon: CreditCard,
    description: 'Complete your booking with secure payment'
  }
];

const SEAT_CLASSES = [
  { id: 'economy', name: 'Economy', price: 0, features: ['Standard seat', 'Regular check-in', '7kg cabin baggage'] },
  { id: 'premium-economy', name: 'Premium Economy', price: 2500, features: ['Extra legroom', 'Priority check-in', '10kg cabin baggage', 'Complimentary meal'] },
  { id: 'business', name: 'Business Class', price: 8500, features: ['Luxury seating', 'Priority boarding', '15kg cabin baggage', 'Premium meals', 'Lounge access'] },
  { id: 'first', name: 'First Class', price: 15000, features: ['Private suite', 'Premium boarding', '20kg cabin baggage', 'Gourmet dining', 'Exclusive lounge'] }
];

const LUGGAGE_OPTIONS = [
  { id: 'none', name: 'No Check-in Baggage', weight: '0kg', price: 0 },
  { id: 'standard', name: 'Standard Baggage', weight: '15kg', price: 500 },
  { id: 'extra', name: 'Extra Baggage', weight: '25kg', price: 1200 },
  { id: 'premium', name: 'Premium Baggage', weight: '35kg', price: 2000 }
];

const MEAL_OPTIONS = [
  { id: 'none', name: 'No Meal', icon: UtensilsCrossed, price: 0 },
  { id: 'veg', name: 'Vegetarian Meal', icon: Utensils, price: 350 },
  { id: 'non-veg', name: 'Non-Vegetarian Meal', icon: Utensils, price: 400 },
  { id: 'snack', name: 'Snack Box', icon: Coffee, price: 150 },
  { id: 'combo', name: 'Meal + Beverage Combo', icon: Sandwich, price: 500 }
];

const getFlightData = (id: string): FlightData => {
  const mockFlights: Record<string, FlightData> = {
    "1": {
      id: "1",
      airline: "Air India",
      flightNumber: "AI 505",
      aircraftModel: "Boeing 787-8 Dreamliner",
      from: "Delhi (DEL)",
      to: "Bangalore (BLR)",
      departureTime: "06:00 AM",
      arrivalTime: "08:45 AM",
      departureDate: "Dec 25, 2024",
      duration: "2h 45m",
      basePrice: 4500,
      taxesPerPassenger: 405,
      convenienceFee: 150,
      stops: 0,
      class: "Economy",
      available: 45
    },
    "2": {
      id: "2",
      airline: "IndiGo",
      flightNumber: "6E 2062",
      aircraftModel: "Airbus A320neo",
      from: "Delhi (DEL)",
      to: "Bangalore (BLR)",
      departureTime: "09:30 AM",
      arrivalTime: "12:15 PM",
      departureDate: "Dec 25, 2024",
      duration: "2h 45m",
      basePrice: 3800,
      taxesPerPassenger: 342,
      convenienceFee: 120,
      stops: 0,
      class: "Economy",
      available: 38
    },
    "3": {
      id: "3",
      airline: "SpiceJet",
      flightNumber: "SG 8192",
      aircraftModel: "Boeing 737 MAX",
      from: "Delhi (DEL)",
      to: "Bangalore (BLR)",
      departureTime: "14:00 PM",
      arrivalTime: "16:50 PM",
      departureDate: "Dec 25, 2024",
      duration: "2h 50m",
      basePrice: 3200,
      taxesPerPassenger: 288,
      convenienceFee: 100,
      stops: 0,
      class: "Economy",
      available: 52
    }
  };
  
  return mockFlights[id] || mockFlights["1"];
};

export default function FlightBookingComprehensive() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const flight = getFlightData(id || "1");

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Booking selections
  const [selectedClass, setSelectedClass] = useState('economy');
  const [selectedLuggage, setSelectedLuggage] = useState('standard');
  const [selectedMeal, setSelectedMeal] = useState('none');
  const [travelerType, setTravelerType] = useState<'general' | 'student' | 'business'>('general');
  
  // Seat selection
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [currentPassengerForSeat, setCurrentPassengerForSeat] = useState(0);
  
  // Traveler details
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }
  ]);
  const [currentPassengerTab, setCurrentPassengerTab] = useState(0);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Conditional fields
  const [studentCollegeName, setStudentCollegeName] = useState("");
  const [studentCollegeId, setStudentCollegeId] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessIdCard, setBusinessIdCard] = useState("");
  const [businessGstNo, setBusinessGstNo] = useState("");

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
  const classPrice = SEAT_CLASSES.find(c => c.id === selectedClass)?.price || 0;
  const luggagePrice = LUGGAGE_OPTIONS.find(l => l.id === selectedLuggage)?.price || 0;
  const mealPrice = MEAL_OPTIONS.find(m => m.id === selectedMeal)?.price || 0;
  const perPassengerPrice = flight.basePrice + classPrice + luggagePrice + mealPrice + flight.taxesPerPassenger;
  const basePrice = (perPassengerPrice * passengers.length) + flight.convenienceFee;

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
    // Validate seat selection on seat-selection stage
    if (currentStage.id === 'seat-selection') {
      if (selectedSeats.length !== passengers.length) {
        toast({
          title: "Seat Selection Required",
          description: "Please select seats for all passengers",
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
    if (passengers.length < 9) {
      setPassengers([...passengers, { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }]);
      setCurrentPassengerTab(passengers.length);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      setSelectedSeats(selectedSeats
        .filter(s => s.passengerId !== index)
        .map(s => s.passengerId > index ? { ...s, passengerId: s.passengerId - 1 } : s)
      );
      if (currentPassengerForSeat >= passengers.length - 1) {
        setCurrentPassengerForSeat(Math.max(0, passengers.length - 2));
      }
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

  const handleSeatClick = (row: number, seat: string, passengerId: number) => {
    const existingSeat = selectedSeats.find(s => s.row === row && s.seat === seat);
    const passengerSeat = selectedSeats.find(s => s.passengerId === passengerId);

    if (existingSeat) {
      if (existingSeat.passengerId === passengerId) {
        setSelectedSeats(selectedSeats.filter(s => !(s.row === row && s.seat === seat)));
      } else {
        toast({
          title: "Seat Taken",
          description: "This seat is already selected",
          variant: "destructive"
        });
      }
    } else {
      if (passengerSeat) {
        setSelectedSeats(selectedSeats.map(s => 
          s.passengerId === passengerId ? { row, seat, passengerId } : s
        ));
      } else {
        setSelectedSeats([...selectedSeats, { row, seat, passengerId }]);
      }
    }
  };

  const isSeatSelected = (row: number, seat: string) => {
    return selectedSeats.some(s => s.row === row && s.seat === seat);
  };

  const generateSeats = () => {
    const seats = [];
    for (let row = 1; row <= 20; row++) {
      seats.push({ row, seats: ['A', 'B', 'C', 'D', 'E', 'F'] });
    }
    return seats;
  };

  const seatLayout = generateSeats();

  const handleProceedToPayment = () => {
    // Validate payment method - UPI allows direct navigation without ID
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

    const bookingData: Record<string, string> = {
      flightId: id || '1',
      passengers: JSON.stringify(passengers),
      contactEmail,
      contactPhone,
      travelerType,
      studentCollegeName,
      studentCollegeId,
      businessEmail,
      businessIdCard,
      businessGstNo,
      selectedClass,
      selectedLuggage,
      selectedMeal,
      amount: totalPrice.toString(),
      type: 'flight',
      bookingType: 'Flight Booking',
      route: `${flight.from} → ${flight.to}`,
      date: flight.departureDate,
      time: `${flight.departureTime} - ${flight.arrivalTime}`,
      seats: selectedSeats.map(s => `${s.row}${s.seat}`).join(', '),
      class: SEAT_CLASSES.find(c => c.id === selectedClass)?.name || 'Economy'
    };

    const queryParams = new URLSearchParams(bookingData);

    // Redirect based on payment method
    if (paymentMethod === 'upi') {
      navigate(`/upi-payment?${queryParams.toString()}&upiId=${upiId}`);
    } else {
      // For card and netbanking, go directly to success
      navigate(`/transaction-success?${queryParams.toString()}`);
    }
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
      case 'flight-details':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Aircraft Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Airline</Label>
                    <p className="text-white text-base mt-1">{flight.airline}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Flight Number</Label>
                    <p className="text-white text-base mt-1">{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Aircraft Model</Label>
                    <p className="text-white text-base mt-1">{flight.aircraftModel}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Travel Class</Label>
                    <p className="text-white text-base mt-1">{flight.class}</p>
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
                  <p className="text-2xl font-light text-white">{flight.departureTime}</p>
                  <p className="text-sm text-white/60">{flight.from}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <p className="text-xs text-white/60 mb-1">{flight.duration}</p>
                  <div className="h-px bg-white/20"></div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none mt-1">
                    {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{flight.arrivalTime}</p>
                  <p className="text-sm text-white/60">{flight.to}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-white/60">
                <span><Calendar className="inline h-3 w-3 mr-1" />{flight.departureDate}</span>
                <span className="flex-1 text-center"><Clock className="inline h-3 w-3 mr-1" />{flight.duration}</span>
                <span><Users className="inline h-3 w-3 mr-1" />{flight.available} seats available</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Star className="h-5 w-5" />
                Flight Offerings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Wifi, label: 'Wi-Fi Available' },
                  { icon: Tv, label: 'Entertainment' },
                  { icon: Utensils, label: 'Meals Available' },
                  { icon: Shield, label: 'Travel Insurance' }
                ].map((offering, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10">
                    <offering.icon className="h-6 w-6 text-white/60" />
                    <span className="text-xs text-white/60 text-center">{offering.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'seat-selection':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 mb-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Passenger Selection</h3>
              <div className="space-y-2">
                {passengers.map((passenger, idx) => {
                  const seat = selectedSeats.find(s => s.passengerId === idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPassengerForSeat(idx)}
                      className={`w-full p-3 border-b transition-all text-left ${
                        currentPassengerForSeat === idx
                          ? 'border-white bg-white/5'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      data-testid={`button-select-passenger-${idx}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`font-light tracking-wider ${
                          currentPassengerForSeat === idx ? 'text-white' : 'text-white/60'
                        }`}>
                          Passenger {idx + 1} {passenger.firstName && `- ${passenger.firstName} ${passenger.lastName}`}
                        </p>
                        <Badge className={`rounded-none border font-light text-xs ${
                          seat
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-white/10 text-white/60 border-white/20'
                        }`}>
                          {seat ? `Seat ${seat.row}${seat.seat}` : 'No Seat'}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-light tracking-wider text-white">Select Seat for Passenger {currentPassengerForSeat + 1}</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/10 border border-white/30"></div>
                    <span className="text-white/60">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/20 border border-green-500/40"></div>
                    <span className="text-white/60">Selected</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 p-8 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-8 text-white/40 text-sm font-light tracking-widest">
                  <Plane className="h-4 w-4" />
                  <span>FRONT OF PLANE</span>
                </div>

                <div className="mb-6 flex justify-center">
                  <div className="grid grid-cols-8 gap-3 text-xs text-white/40 font-light tracking-wider">
                    <div className="w-12"></div>
                    <div className="w-12 text-center">A</div>
                    <div className="w-12 text-center">B</div>
                    <div className="w-12 text-center">C</div>
                    <div className="w-6"></div>
                    <div className="w-12 text-center">D</div>
                    <div className="w-12 text-center">E</div>
                    <div className="w-12 text-center">F</div>
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <div className="space-y-3">
                    {seatLayout.map((row) => (
                      <div key={row.row} className="flex justify-center">
                        <div className="grid grid-cols-8 gap-3 items-center">
                          <div className="w-12 flex items-center justify-center text-sm text-white/40 font-light">
                            {row.row}
                          </div>
                          {row.seats.slice(0, 3).map((seat) => {
                            const selected = isSeatSelected(row.row, seat);
                            const selectedByCurrent = selectedSeats.find(
                              s => s.row === row.row && s.seat === seat && s.passengerId === currentPassengerForSeat
                            );
                            return (
                              <button
                                key={seat}
                                onClick={() => handleSeatClick(row.row, seat, currentPassengerForSeat)}
                                disabled={selected && !selectedByCurrent}
                                className={`w-12 h-12 border transition-all font-light text-sm ${
                                  selectedByCurrent
                                    ? 'bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30'
                                    : selected
                                    ? 'bg-white/5 border-white/20 text-white/20 cursor-not-allowed'
                                    : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20 hover:border-white/50 hover:text-white'
                                }`}
                                data-testid={`seat-${row.row}${seat}`}
                              >
                                {seat}
                              </button>
                            );
                          })}
                          <div className="w-6"></div>
                          {row.seats.slice(3).map((seat) => {
                            const selected = isSeatSelected(row.row, seat);
                            const selectedByCurrent = selectedSeats.find(
                              s => s.row === row.row && s.seat === seat && s.passengerId === currentPassengerForSeat
                            );
                            return (
                              <button
                                key={seat}
                                onClick={() => handleSeatClick(row.row, seat, currentPassengerForSeat)}
                                disabled={selected && !selectedByCurrent}
                                className={`w-12 h-12 border transition-all font-light text-sm ${
                                  selectedByCurrent
                                    ? 'bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30'
                                    : selected
                                    ? 'bg-white/5 border-white/20 text-white/20 cursor-not-allowed'
                                    : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20 hover:border-white/50 hover:text-white'
                                }`}
                                data-testid={`seat-${row.row}${seat}`}
                              >
                                {seat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'class-selection':
        return (
          <div className="space-y-3">
            {SEAT_CLASSES.map((seatClass) => (
              <button
                key={seatClass.id}
                onClick={() => setSelectedClass(seatClass.id)}
                className={`w-full p-4 border-b transition-all text-left ${
                  selectedClass === seatClass.id
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
                data-testid={`class-option-${seatClass.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-light tracking-wider transition-opacity ${
                    selectedClass === seatClass.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                  }`}>
                    {seatClass.name}
                  </p>
                  <Badge className={`rounded-none border font-light text-xs ${
                    selectedClass === seatClass.id 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-white/10 text-white/60 border-white/20'
                  }`}>
                    {seatClass.price === 0 ? 'Included' : `+${formatCurrency(seatClass.price)}`}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seatClass.features.map((feature, idx) => (
                    <span key={idx} className="text-xs text-white/40 font-light">{feature}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        );

      case 'addons-selection':
        return (
          <div className="space-y-6">
            {/* Luggage Section */}
            <div>
              <h3 className="text-sm font-light tracking-wider mb-3 text-white uppercase flex items-center gap-2">
                <Luggage className="h-4 w-4" />
                Luggage Options
              </h3>
              <div className="space-y-3">
                {LUGGAGE_OPTIONS.map((luggage) => (
                  <button
                    key={luggage.id}
                    onClick={() => setSelectedLuggage(luggage.id)}
                    className={`w-full p-4 border-b transition-all text-left ${
                      selectedLuggage === luggage.id
                        ? 'border-white bg-white/5'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    data-testid={`luggage-option-${luggage.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-light tracking-wider transition-opacity ${
                        selectedLuggage === luggage.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                      }`}>
                        {luggage.name}
                      </p>
                      <Badge className={`rounded-none border font-light text-xs ${
                        selectedLuggage === luggage.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-white/10 text-white/60 border-white/20'
                      }`}>
                        {luggage.price === 0 ? 'Free' : formatCurrency(luggage.price)}
                      </Badge>
                    </div>
                    <p className={`text-xs font-light ${
                      selectedLuggage === luggage.id ? 'text-white/60' : 'text-white/40'
                    }`}>
                      {luggage.weight}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Preferences Section */}
            <div>
              <h3 className="text-sm font-light tracking-wider mb-3 text-white uppercase flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Meal Preferences
              </h3>
              <div className="space-y-3">
                {MEAL_OPTIONS.map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`w-full p-4 border-b transition-all text-left ${
                      selectedMeal === meal.id
                        ? 'border-white bg-white/5'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    data-testid={`meal-option-${meal.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <meal.icon className="h-4 w-4 text-white/60" />
                        <p className={`font-light tracking-wider transition-opacity ${
                          selectedMeal === meal.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                        }`}>
                          {meal.name}
                        </p>
                      </div>
                      <Badge className={`rounded-none border font-light text-xs ${
                        selectedMeal === meal.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-white/10 text-white/60 border-white/20'
                      }`}>
                        {meal.price === 0 ? 'Free' : formatCurrency(meal.price)}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'payment':
        const savedCards = [
          { id: '1', name: 'HDFC Credit Card', number: '**** **** **** 1234', type: 'Visa' },
          { id: '2', name: 'ICICI Debit Card', number: '**** **** **** 5678', type: 'Mastercard' }
        ];

        const banks = [
          'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank', 
          'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'
        ];

        return (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { id: 'upi', name: 'UPI', icon: Smartphone },
                  { id: 'card', name: 'Card', icon: CreditCard },
                  { id: 'netbanking', name: 'Net Banking', icon: Building2 }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-b-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === method.id
                          ? 'border-white bg-white/5'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      data-testid={`payment-method-${method.id}`}
                    >
                      <Icon className={`h-6 w-6 ${paymentMethod === method.id ? 'text-white' : 'text-white/40'}`} />
                      <span className={`text-xs font-light tracking-wider ${
                        paymentMethod === method.id ? 'text-white' : 'text-white/60'
                      }`}>
                        {method.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'upi' && (
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Enter UPI ID</Label>
                  <Input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                    data-testid="input-upi-id"
                  />
                  <p className="text-xs text-white/40 mt-1">e.g., 9876543210@paytm, yourname@okaxis</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {!showNewCardForm && (
                    <>
                      <Label className="text-white/60 text-xs uppercase tracking-wider">Select Saved Card</Label>
                      <div className="space-y-2">
                        {savedCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => setSelectedCard(card.id)}
                            className={`w-full p-4 border transition-all text-left ${
                              selectedCard === card.id
                                ? 'border-white bg-white/5'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                            data-testid={`card-option-${card.id}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-light">{card.name}</p>
                                <p className="text-white/60 text-sm">{card.number}</p>
                              </div>
                              <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none">
                                {card.type}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={() => setShowNewCardForm(true)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none"
                        data-testid="button-add-card"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Card
                      </Button>
                    </>
                  )}

                  {showNewCardForm && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white/60 text-xs uppercase tracking-wider">Add New Card</Label>
                        <Button
                          onClick={() => setShowNewCardForm(false)}
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white"
                          data-testid="button-cancel-card"
                        >
                          Cancel
                        </Button>
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs">Card Number</Label>
                        <Input
                          type="text"
                          value={newCardNumber}
                          onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          className="bg-white/5 border-white/20 text-white rounded-none mt-1"
                          data-testid="input-card-number"
                        />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs">Cardholder Name</Label>
                        <Input
                          type="text"
                          value={newCardName}
                          onChange={(e) => setNewCardName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-white/5 border-white/20 text-white rounded-none mt-1"
                          data-testid="input-card-name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/60 text-xs">Expiry (MM/YY)</Label>
                          <Input
                            type="text"
                            value={newCardExpiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setNewCardExpiry(value);
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="bg-white/5 border-white/20 text-white rounded-none mt-1"
                            data-testid="input-card-expiry"
                          />
                        </div>
                        <div>
                          <Label className="text-white/60 text-xs">CVV</Label>
                          <Input
                            type="password"
                            value={newCardCvv}
                            onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="123"
                            maxLength={3}
                            className="bg-white/5 border-white/20 text-white rounded-none mt-1"
                            data-testid="input-card-cvv"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Select Bank</Label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 text-white rounded-none mt-2 p-3"
                      data-testid="select-bank"
                    >
                      <option value="" className="bg-black">Select your bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank} className="bg-black">
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedBank && (
                    <>
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-wider">Username / Customer ID</Label>
                        <Input
                          type="text"
                          value={netbankingUsername}
                          onChange={(e) => setNetbankingUsername(e.target.value)}
                          placeholder="Enter your username"
                          className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                          data-testid="input-netbanking-username"
                        />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs uppercase tracking-wider">Password</Label>
                        <Input
                          type="password"
                          value={netbankingPassword}
                          onChange={(e) => setNetbankingPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                          data-testid="input-netbanking-password"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-3 border border-white/10">
                        <Shield className="h-4 w-4" />
                        <p>Your credentials are encrypted and secure</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm uppercase tracking-wider">Total Amount</span>
                  <span className="text-white text-2xl font-light" data-testid="text-payment-total">{formatCurrency(totalPrice)}</span>
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

      case 'traveler-info':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light tracking-wider text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Passenger Details
                </h3>
                {passengers.length < 9 && (
                  <Button
                    onClick={handleAddPassenger}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 rounded-none"
                    data-testid="button-add-passenger"
                  >
                    + Add Passenger
                  </Button>
                )}
              </div>

              <div className="mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Traveler Type
              </h3>
              <div className="space-y-3 mb-4">
                {[
                  { value: "general", label: "General", icon: UserCircle },
                  { value: "student", label: "Student", icon: GraduationCap },
                  { value: "business", label: "Business", icon: Briefcase }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setTravelerType(type.value as any)}
                    className={`w-full p-4 border-b transition-all text-left ${
                      travelerType === type.value
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    data-testid={`button-traveler-${type.value}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <type.icon className={`h-5 w-5 ${travelerType === type.value ? 'text-white' : 'text-white/60'}`} />
                        <p className={`font-light tracking-wider transition-opacity ${
                          travelerType === type.value ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                        }`}>
                          {type.label}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {travelerType === "student" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">College Name</Label>
                    <Input
                      value={studentCollegeName}
                      onChange={(e) => setStudentCollegeName(e.target.value)}
                      placeholder="Enter college name"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-student-college-name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">College ID</Label>
                    <Input
                      value={studentCollegeId}
                      onChange={(e) => setStudentCollegeId(e.target.value)}
                      placeholder="Enter college ID"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-student-college-id"
                    />
                  </div>
                </div>
              )}

              {travelerType === "business" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Business Email</Label>
                    <Input
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="business@company.com"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-business-email"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">ID Card Number</Label>
                    <Input
                      value={businessIdCard}
                      onChange={(e) => setBusinessIdCard(e.target.value)}
                      placeholder="Enter ID card number"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-business-id"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">GST Number</Label>
                    <Input
                      value={businessGstNo}
                      onChange={(e) => setBusinessGstNo(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-business-gst"
                    />
                  </div>
                </div>
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - UPI Payment Style */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/booking/flight/results")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">FLIGHT BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{flight.airline} - {flight.flightNumber}</p>
            </div>

            <div className="w-10"></div>
          </div>

          {/* Progress Section - UPI Payment Style */}
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
            
            {/* Stage Tracker - UPI Payment Style */}
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

      {/* Scrollable Content - Cardless Design */}
      <div ref={scrollableContentRef} className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Flight Info Card - Moved below progress */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{flight.airline}</p>
                <p className="text-white/60 text-xs">{flight.flightNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{flight.departureDate}</p>
              <p className="text-white/60 text-xs">{flight.departureTime} - {flight.arrivalTime}</p>
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
          
        {/* Stage Content - Cardless */}
        <div className="space-y-3">
          {renderStageContent()}
        </div>

        {/* Price Summary - UPI Payment Style */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Fare Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
              <span className="font-light">{formatCurrency(flight.basePrice * passengers.length)}</span>
            </div>
            {classPrice > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Class Upgrade</span>
                <span className="font-light">{formatCurrency(classPrice * passengers.length)}</span>
              </div>
            )}
            {luggagePrice > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Luggage</span>
                <span className="font-light">{formatCurrency(luggagePrice * passengers.length)}</span>
              </div>
            )}
            {mealPrice > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Meals</span>
                <span className="font-light">{formatCurrency(mealPrice * passengers.length)}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Taxes & Fees</span>
              <span className="font-light">{formatCurrency(flight.taxesPerPassenger * passengers.length)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Convenience Fee</span>
              <span className="font-light">{formatCurrency(flight.convenienceFee)}</span>
            </div>
            {couponDiscount > 0 && (
              <>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-light">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span className="text-sm">Coupon Discount</span>
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

      {/* Fixed Navigation Footer - UPI Payment Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{flight.flightNumber}</p>
              <p className="text-sm text-white font-light">{flight.departureDate} • {flight.departureTime}</p>
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
                PAY
              </>
            ) : (
              <>
                NEXT
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
