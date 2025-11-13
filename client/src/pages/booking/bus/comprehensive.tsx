import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  CheckCircle,
  Users,
  Utensils,
  Shield,
  Clock,
  MapPin,
  User,
  Calendar,
  Star,
  Wifi,
  Coffee,
  UtensilsCrossed,
  Sandwich,
  Circle,
  Armchair,
  Gauge,
  RectangleHorizontal,
  CreditCard,
  Smartphone,
  Building2,
  Plus
} from "lucide-react";

interface BusData {
  id: string;
  operator: string;
  busNumber: string;
  busType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  duration: string;
  basePrice: number;
  stops: number;
  seatsAvailable: number;
  rating: number;
  amenities: string[];
}

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
}

interface SeatSelection {
  seatId: string;
  passengerId: number;
}

type SeatStatus = "available" | "booked" | "selected" | "ladies";

interface Seat {
  id: string;
  row: number;
  column: number;
  status: SeatStatus;
  price: number;
  deck: "lower" | "upper";
}

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const BOOKING_STAGES: BookingStage[] = [
  { id: 'bus-details', title: 'Bus Information', shortTitle: 'Bus', icon: Bus, description: 'Review bus details' },
  { id: 'seat-selection', title: 'Seat Selection', shortTitle: 'Seats', icon: Users, description: 'Choose seats' },
  { id: 'amenities-selection', title: 'Add-ons', shortTitle: 'Add-ons', icon: Coffee, description: 'Extra services' },
  { id: 'meal-selection', title: 'Meals', shortTitle: 'Meals', icon: Utensils, description: 'Meal preferences' },
  { id: 'traveler-info', title: 'Traveler Details', shortTitle: 'Details', icon: User, description: 'Passenger information' },
  { id: 'payment', title: 'Payment Method', shortTitle: 'Payment', icon: CreditCard, description: 'Select payment method' }
];

const AMENITY_OPTIONS = [
  { id: 'none', name: 'Standard Service', price: 0 },
  { id: 'blanket', name: 'Blanket & Pillow', price: 100 },
  { id: 'charging', name: 'Charging Points', price: 50 },
  { id: 'premium', name: 'Premium Package', price: 300 }
];

const MEAL_OPTIONS = [
  { id: 'none', name: 'No Meal', icon: UtensilsCrossed, price: 0 },
  { id: 'snack', name: 'Snack Box', icon: Coffee, price: 100 },
  { id: 'meal', name: 'Meal Box', icon: Sandwich, price: 200 },
  { id: 'combo', name: 'Meal + Beverage', icon: Utensils, price: 300 }
];

const getBusData = (id: string, date: string): BusData => {
  const mockBuses: Record<string, BusData> = {
    "1": {
      id: "1",
      operator: "Volvo Travels",
      busNumber: "VT 2024",
      busType: "AC Sleeper Multi-Axle",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "22:00",
      arrivalTime: "06:00",
      departureDate: date,
      duration: "8h 0m",
      basePrice: 1200,
      stops: 2,
      seatsAvailable: 15,
      rating: 4.5,
      amenities: ["WiFi", "Charging", "Blanket", "Water Bottle"]
    },
    "2": {
      id: "2",
      operator: "Red Bus Express",
      busNumber: "RB 1056",
      busType: "AC Seater Semi-Sleeper",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "23:30",
      arrivalTime: "07:30",
      departureDate: date,
      duration: "8h 0m",
      basePrice: 900,
      stops: 3,
      seatsAvailable: 20,
      rating: 4.2,
      amenities: ["WiFi", "Charging", "Reading Light"]
    },
    "3": {
      id: "3",
      operator: "VRL Travels",
      busNumber: "VRL 789",
      busType: "AC Sleeper Volvo",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "21:00",
      arrivalTime: "05:00",
      departureDate: date,
      duration: "8h 0m",
      basePrice: 1100,
      stops: 1,
      seatsAvailable: 10,
      rating: 4.3,
      amenities: ["WiFi", "Charging", "Blanket", "Water Bottle", "GPS"]
    }
  };
  
  return mockBuses[id] || mockBuses["1"];
};

const generateSeats = (basePrice: number): Seat[] => {
  const seats: Seat[] = [];
  const totalRows = 12;
  
  // Lower deck - standard seating layout
  for (let row = 1; row <= totalRows; row++) {
    for (let col = 1; col <= 4; col++) {
      // Skip column 2 (aisle) in most rows
      if (col === 2 && row > 1) continue;
      
      const seatNum = `L${row}${String.fromCharCode(64 + col)}`;
      const random = Math.random();
      let status: SeatStatus = "available";
      
      // Randomly assign some seats as booked or ladies
      if (random < 0.2) status = "booked";
      else if (random < 0.3 && col === 4) status = "ladies";
      
      seats.push({
        id: seatNum,
        row,
        column: col,
        status,
        price: basePrice + (row <= 2 ? 50 : 0), // Premium for front seats
        deck: "lower"
      });
    }
  }

  // Upper deck - sleeper layout
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 4; col++) {
      if (col === 2 && row > 1) continue;
      
      const seatNum = `U${row}${String.fromCharCode(64 + col)}`;
      const random = Math.random();
      let status: SeatStatus = "available";
      
      if (random < 0.15) status = "booked";
      else if (random < 0.25 && col === 4) status = "ladies";
      
      seats.push({
        id: seatNum,
        row,
        column: col,
        status,
        price: basePrice + 150, // Sleeper premium
        deck: "upper"
      });
    }
  }

  return seats;
};

export default function BusBookingComprehensive() {
  const { goBack } = useNavigationHistory();
  const { date, id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const bus = getBusData(id || "1", date || new Date().toISOString().split('T')[0]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState('none');
  const [selectedMeal, setSelectedMeal] = useState('none');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [allSeats, setAllSeats] = useState<Seat[]>(generateSeats(bus.basePrice));
  const [selectedDeck, setSelectedDeck] = useState<"lower" | "upper">("lower");
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }
  ]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
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
  
  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  const amenityPrice = AMENITY_OPTIONS.find(a => a.id === selectedAmenity)?.price || 0;
  const mealPrice = MEAL_OPTIONS.find(m => m.id === selectedMeal)?.price || 0;
  const perPassengerPrice = bus.basePrice + amenityPrice + mealPrice;
  const basePrice = perPassengerPrice * passengers.length;

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
    if (currentStage.id === 'seat-selection') {
      if (selectedSeats.length === 0) {
        toast({
          title: "Seat Selection Required",
          description: "Please select at least one seat",
          variant: "destructive"
        });
        return;
      }
      // Auto-adjust passengers based on selected seats
      const numSeats = selectedSeats.length;
      if (numSeats !== passengers.length) {
        const newPassengers = Array.from({ length: numSeats }, (_, i) => 
          passengers[i] || { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }
        );
        setPassengers(newPassengers);
      }
    }

    // Validate traveler info before proceeding to payment
    if (currentStage.id === 'traveler-info') {
      if (!contactEmail || !contactPhone) {
        toast({
          title: "Contact Details Required",
          description: "Please enter your email and phone number",
          variant: "destructive"
        });
        return;
      }

      for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];
        if (!p.firstName || !p.lastName || !p.age) {
          toast({
            title: "Passenger Details Incomplete",
            description: `Please complete all details for Passenger ${i + 1}`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    // Handle payment stage
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
    }
  };

  const handleAddPassenger = () => {
    if (passengers.length < 9) {
      setPassengers([...passengers, { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }]);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSeatClick = (seatId: string) => {
    const seat = allSeats.find(s => s.id === seatId);
    if (!seat) return;

    if (seat.status === "booked") {
      toast({ title: "Seat Unavailable", description: "This seat is already booked", variant: "destructive" });
      return;
    }

    if (seat.status === "ladies") {
      toast({ title: "Seat Reserved", description: "This seat is reserved for ladies", variant: "destructive" });
      return;
    }

    if (seat.status === "selected") {
      // Unselect this seat
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
      setAllSeats(allSeats.map(s => s.id === seatId ? { ...s, status: "available" } : s));
    } else {
      // Select this seat
      setSelectedSeats([...selectedSeats, seatId]);
      setAllSeats(allSeats.map(s => s.id === seatId ? { ...s, status: "selected" } : s));
    }
  };

  const handleProceedToPayment = () => {
    // For UPI, go directly to UPI payment page (UPI ID is optional)
    if (paymentMethod === 'upi') {
      const upiPaymentParams = new URLSearchParams({
        amount: totalPrice.toString(),
        type: 'bus',
        busId: id || '1',
        date: date || '',
        passengers: JSON.stringify(passengers),
        contactEmail,
        contactPhone,
        seats: JSON.stringify(selectedSeats),
        selectedAmenity,
        selectedMeal,
        returnUrl: '/home'
      });
      navigate(`/upi-payment?${upiPaymentParams.toString()}`);
      return;
    }

    // For card payment, validate card details
    if (paymentMethod === 'card' && !selectedCard && !showNewCardForm) {
      toast({
        title: "Card Selection Required",
        description: "Please select a card or add a new card",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'card' && showNewCardForm) {
      if (!newCardNumber || !newCardName || !newCardExpiry || !newCardCvv) {
        toast({
          title: "Card Details Required",
          description: "Please complete all card details",
          variant: "destructive"
        });
        return;
      }
    }

    // For netbanking, validate banking details
    if (paymentMethod === 'netbanking' && (!selectedBank || !netbankingUsername || !netbankingPassword)) {
      toast({
        title: "Net Banking Details Required",
        description: "Please complete all net banking details",
        variant: "destructive"
      });
      return;
    }

    // For card and netbanking, go to UPI payment page
    const upiPaymentParams = new URLSearchParams({
      amount: totalPrice.toString(),
      type: 'bus',
      busId: id || '1',
      date: date || '',
      passengers: JSON.stringify(passengers),
      contactEmail,
      contactPhone,
      seats: JSON.stringify(selectedSeats),
      selectedAmenity,
      selectedMeal,
      returnUrl: '/home'
    });
    navigate(`/upi-payment?${upiPaymentParams.toString()}`);
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
      case 'bus-details':
        return (
          <div className="space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Bus className="h-5 w-5" />
                Bus Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Operator</Label>
                  <p className="text-white text-base mt-1">{bus.operator}</p>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Bus Number</Label>
                  <p className="text-white text-base mt-1">{bus.busNumber}</p>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Bus Type</Label>
                  <p className="text-white text-base mt-1">{bus.busType}</p>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <p className="text-white text-base">{bus.rating}/5</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Journey Information
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-light text-white">{bus.departureTime}</p>
                  <p className="text-sm text-white/60">{bus.from}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <p className="text-xs text-white/60 mb-1">{bus.duration}</p>
                  <div className="h-px bg-white/20"></div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none mt-1">
                    {bus.stops === 0 ? "Non-stop" : `${bus.stops} stop${bus.stops > 1 ? 's' : ''}`}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{bus.arrivalTime}</p>
                  <p className="text-sm text-white/60">{bus.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span><Calendar className="inline h-3 w-3 mr-1" />{bus.departureDate}</span>
                <span><Clock className="inline h-3 w-3 mr-1" />{bus.duration}</span>
                <span><Users className="inline h-3 w-3 mr-1" />{bus.seatsAvailable} seats</span>
              </div>
            </div>

            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Star className="h-5 w-5" />
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bus.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10">
                    {amenity === 'WiFi' && <Wifi className="h-6 w-6 text-white/60" />}
                    {amenity === 'Charging' && <Coffee className="h-6 w-6 text-white/60" />}
                    {amenity.includes('Blanket') && <Coffee className="h-6 w-6 text-white/60" />}
                    {amenity.includes('Water') && <Coffee className="h-6 w-6 text-white/60" />}
                    <span className="text-xs text-white/60 text-center">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'seat-selection':
        const currentDeckSeats = allSeats.filter(s => s.deck === selectedDeck);
        const maxRow = currentDeckSeats.length > 0 ? Math.max(...currentDeckSeats.map(s => s.row)) : 0;
        const maxCol = 4;

        return (
          <div className="space-y-6">
            {/* Selected Seats Counter */}
            {selectedSeats.length > 0 && (
              <div className="bg-white/10 border border-white/20 p-3">
                <p className="text-white text-sm">
                  <span className="font-semibold">{selectedSeats.length}</span> seat{selectedSeats.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Deck Selection */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDeck("lower")}
                className={cn(
                  "flex-1 py-3 border transition-all text-xs tracking-wider font-light rounded-none",
                  selectedDeck === "lower"
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid="button-deck-lower"
              >
                LOWER DECK
              </button>
              <button
                onClick={() => setSelectedDeck("upper")}
                className={cn(
                  "flex-1 py-3 border transition-all text-xs tracking-wider font-light rounded-none",
                  selectedDeck === "upper"
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid="button-deck-upper"
              >
                UPPER DECK (SLEEPER)
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-sm"></div>
                <span className="text-white/60 font-light">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border-2 border-white rounded-sm"></div>
                <span className="text-white/60 font-light">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-sm"></div>
                <span className="text-white/60 font-light">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-500/20 border border-pink-500/40 rounded-sm"></div>
                <span className="text-white/60 font-light">Ladies</span>
              </div>
            </div>

            {/* Seat Layout */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              {/* Driver Section */}
              <div className="flex items-center justify-end mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-white/40" />
                  <span className="text-xs text-white/40 uppercase tracking-wider font-light">Driver</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-2">
                {Array.from({ length: maxRow }, (_, rowIndex) => {
                  const row = rowIndex + 1;
                  return (
                    <div key={row} className="flex gap-2 justify-center">
                      {Array.from({ length: maxCol }, (_, colIndex) => {
                        const col = colIndex + 1;
                        
                        // Aisle space
                        if (col === 2 && row > 1) {
                          return (
                            <div key={`aisle-${row}-${col}`} className="w-12 flex items-center justify-center">
                              <div className="text-white/20 text-xs font-light">
                                ╎
                              </div>
                            </div>
                          );
                        }

                        const seat = currentDeckSeats.find(s => s.row === row && s.column === col);
                        if (!seat) return <div key={`empty-${row}-${col}`} className="w-12"></div>;

                        const isSelected = seat.status === "selected";
                        const isBooked = seat.status === "booked";
                        const isLadies = seat.status === "ladies";
                        const isAvailable = seat.status === "available";

                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={isBooked}
                            className={cn(
                              "w-12 h-12 border rounded-sm transition-all relative group",
                              isSelected && "bg-white border-2 border-white scale-105 shadow-lg shadow-white/20",
                              isAvailable && "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40",
                              isBooked && "bg-white/5 border-white/10 cursor-not-allowed opacity-50",
                              isLadies && "bg-pink-500/20 border-pink-500/40 hover:bg-pink-500/30"
                            )}
                            data-testid={`seat-${seat.id}`}
                          >
                            {selectedDeck === "upper" ? (
                              <RectangleHorizontal className={cn(
                                "h-6 w-6 mx-auto",
                                isSelected && "text-black",
                                isAvailable && "text-white/60",
                                isBooked && "text-white/30",
                                isLadies && "text-pink-400"
                              )} />
                            ) : (
                              <Armchair className={cn(
                                "h-6 w-6 mx-auto",
                                isSelected && "text-black",
                                isAvailable && "text-white/60",
                                isBooked && "text-white/30",
                                isLadies && "text-pink-400"
                              )} />
                            )}
                            <span className={cn(
                              "absolute bottom-0 left-0 right-0 text-[8px] font-light",
                              isSelected && "text-black",
                              isAvailable && "text-white/60",
                              isBooked && "text-white/30",
                              isLadies && "text-pink-400"
                            )}>
                              {seat.id}
                            </span>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              <p className="text-xs text-white font-light">{seat.id}</p>
                              <p className="text-xs text-white/60 font-light">{formatCurrency(seat.price)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Seats Summary */}
            {selectedSeats.length > 0 && (
              <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4">
                <h3 className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light">Selected Seats</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seatId, idx) => {
                    const seat = allSeats.find(s => s.id === seatId);
                    return (
                      <Badge
                        key={idx}
                        className="bg-white text-black border-white text-sm font-light rounded-none px-3 py-1"
                      >
                        {seat?.id} - {formatCurrency(seat?.price || 0)}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'amenities-selection':
        return (
          <div className="space-y-3">
            <Label className="text-white/60 text-xs uppercase tracking-wider">Select Add-ons</Label>
            {AMENITY_OPTIONS.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => setSelectedAmenity(amenity.id)}
                className={cn(
                  "w-full p-4 border-b transition-all text-left",
                  selectedAmenity === amenity.id
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                )}
                data-testid={`amenity-option-${amenity.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "font-light tracking-wider transition-opacity",
                    selectedAmenity === amenity.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                  )}>
                    {amenity.name}
                  </p>
                  <Badge className={cn(
                    "rounded-none border font-light text-xs",
                    selectedAmenity === amenity.id 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-white/10 text-white/60 border-white/20'
                  )}>
                    {amenity.price === 0 ? 'Included' : `+${formatCurrency(amenity.price)}`}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        );

      case 'meal-selection':
        return (
          <div className="space-y-3">
            <Label className="text-white/60 text-xs uppercase tracking-wider">Select Meals</Label>
            {MEAL_OPTIONS.map((meal) => {
              const MealIcon = meal.icon;
              return (
                <button
                  key={meal.id}
                  onClick={() => setSelectedMeal(meal.id)}
                  className={cn(
                    "w-full p-4 border-b transition-all text-left",
                    selectedMeal === meal.id
                      ? 'border-white bg-white/5'
                      : 'border-white/10 hover:border-white/30'
                  )}
                  data-testid={`meal-option-${meal.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MealIcon className="h-5 w-5 text-white/60" />
                      <p className={cn(
                        "font-light tracking-wider transition-opacity",
                        selectedMeal === meal.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                      )}>
                        {meal.name}
                      </p>
                    </div>
                    <Badge className={cn(
                      "rounded-none border font-light text-xs",
                      selectedMeal === meal.id 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-white/10 text-white/60 border-white/20'
                    )}>
                      {meal.price === 0 ? 'Free' : `+${formatCurrency(meal.price)}`}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'traveler-info':
        return (
          <div className="space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wider text-white">Passenger Details</h3>
                <Button
                  onClick={handleAddPassenger}
                  variant="outline"
                  size="sm"
                  disabled={passengers.length >= 9}
                  className="border-white/20 text-white hover:bg-white/10 rounded-none"
                  data-testid="button-add-passenger"
                >
                  Add Passenger
                </Button>
              </div>

              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-light text-white">Passenger {index + 1}</span>
                      {passengers.length > 1 && (
                        <Button
                          onClick={() => handleRemovePassenger(index)}
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white hover:bg-white/10"
                          data-testid={`button-remove-passenger-${index}`}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select value={passenger.title} onValueChange={(v) => handlePassengerChange(index, 'title', v)}>
                        <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white" data-testid={`select-title-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/20">
                          <SelectItem value="Mr" className="text-white">Mr</SelectItem>
                          <SelectItem value="Mrs" className="text-white">Mrs</SelectItem>
                          <SelectItem value="Ms" className="text-white">Ms</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        placeholder="First Name"
                        className="bg-transparent border-b border-white/20 rounded-none text-white"
                        data-testid={`input-firstname-${index}`}
                      />
                      <Input
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        placeholder="Last Name"
                        className="bg-transparent border-b border-white/20 rounded-none text-white"
                        data-testid={`input-lastname-${index}`}
                      />
                      <Input
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                        placeholder="Age"
                        type="number"
                        className="bg-transparent border-b border-white/20 rounded-none text-white"
                        data-testid={`input-age-${index}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-transparent border-b border-white/20 rounded-none text-white mt-2"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Phone</Label>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="bg-transparent border-b border-white/20 rounded-none text-white mt-2"
                    data-testid="input-contact-phone"
                  />
                </div>
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
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Enter UPI ID (Optional)</Label>
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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
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
            <h1 className="text-base font-bold tracking-wider">BUS BOOKING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{bus.operator}</p>
          </div>
          <Badge className="bg-black border border-white/30 text-white rounded-none">
            <Shield className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </div>
      </div>

      {/* Booking Progress Card */}
      <div className="fixed top-16 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-md">
        <div className="max-w-3xl mx-auto border border-white/20 bg-black/80 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center">
                <currentStage.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{currentStage.title}</h2>
                <p className="text-[10px] text-white/60">{currentStage.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Step</p>
              <p className="text-lg font-light text-white">{currentStageIndex + 1}/{BOOKING_STAGES.length}</p>
            </div>
          </div>

          <div className="w-full bg-white/10 h-1.5 mb-3">
            <div 
              className="bg-white h-1.5 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            {BOOKING_STAGES.map((stage, index) => {
              const isCompleted = completedStages.includes(index);
              const isCurrent = index === currentStageIndex;
              const isAccessible = isCompleted || index <= currentStageIndex;
              
              return (
                <button
                  key={stage.id}
                  onClick={() => isAccessible && handleStageClick(index)}
                  className={`flex flex-col items-center transition-all ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  data-testid={`stage-${stage.id}`}
                >
                  <div className={cn(
                    "w-7 h-7 border flex items-center justify-center text-xs font-semibold transition-all",
                    isCompleted ? 'bg-white text-black border-white' :
                    isCurrent ? 'bg-white text-black border-white' :
                    isAccessible ? 'bg-transparent text-white border-white/30 hover:bg-white/10' :
                    'bg-transparent text-white/30 border-white/20'
                  )}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1 text-center",
                    isCurrent ? 'text-white font-medium' : 'text-white/60'
                  )}>
                    {stage.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={scrollableContentRef} className="pt-64 px-4 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto">
          {renderStageContent()}
        </div>
      </div>

      {/* Fixed Price Summary & Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto">
          {appliedCoupon ? (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-white/60 text-xs">Bus No: <span className="text-white">{bus.busNumber}</span></span>
                  <span className="text-white/60 text-xs">Total Tickets: <span className="text-white">{selectedSeats.length || passengers.length}</span></span>
                  <span className="text-white/60 text-xs">Date & Time: <span className="text-white">{bus.departureDate} {bus.departureTime}</span></span>
                </div>
                <div className="text-right">
                  <span className="text-white/60 text-xs block">Base Amount</span>
                  <span className="text-sm font-light text-white">{formatCurrency(basePrice)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-400/80 text-sm">Coupon Discount</span>
                <span className="text-sm font-light text-green-400">-{formatCurrency(couponDiscount)}</span>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">Total Amount</span>
                <span className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-white/60 text-xs">Bus No: <span className="text-white">{bus.busNumber}</span></span>
                <span className="text-white/60 text-xs">Total Tickets: <span className="text-white">{selectedSeats.length || passengers.length}</span></span>
                <span className="text-white/60 text-xs">Date & Time: <span className="text-white">{bus.departureDate} {bus.departureTime}</span></span>
              </div>
              <div className="text-right">
                <span className="text-white/60 text-xs block">Total Amount</span>
                <span className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePreviousStage}
              disabled={currentStageIndex === 0}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 h-12 rounded-none disabled:opacity-30"
              data-testid="button-previous"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNextStage}
              className="flex-1 bg-white text-black hover:bg-white/90 h-12 rounded-none"
              data-testid="button-next"
            >
              {currentStage.id === 'payment' ? `PAY ${formatCurrency(totalPrice)}` : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
