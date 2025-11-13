import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
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
  ArrowRight,
  Bus,
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
  Coffee,
  UtensilsCrossed,
  Sandwich,
  Circle,
  AirVent
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
    id: 'bus-details',
    title: 'Bus Information',
    shortTitle: 'Bus',
    icon: Bus,
    description: 'Review bus details and specifications'
  },
  {
    id: 'seat-selection',
    title: 'Seat Selection',
    shortTitle: 'Seats',
    icon: Users,
    description: 'Choose your preferred seats'
  },
  {
    id: 'amenities-selection',
    title: 'Amenities & Add-ons',
    shortTitle: 'Amenities',
    icon: Coffee,
    description: 'Select additional services and amenities'
  },
  {
    id: 'meal-selection',
    title: 'Meal Preferences',
    shortTitle: 'Meals',
    icon: Utensils,
    description: 'Choose your meals and snacks'
  },
  {
    id: 'traveler-info',
    title: 'Traveler Details',
    shortTitle: 'Details',
    icon: UserCircle,
    description: 'Passenger and contact information'
  }
];

const AMENITY_OPTIONS = [
  { id: 'none', name: 'Standard Service', price: 0, features: ['Standard seat', 'Regular boarding'] },
  { id: 'blanket', name: 'Blanket & Pillow', price: 100, features: ['Comfortable blanket', 'Neck pillow'] },
  { id: 'charging', name: 'Charging Points', price: 50, features: ['USB charging', 'Power outlet'] },
  { id: 'premium', name: 'Premium Package', price: 300, features: ['Blanket & Pillow', 'Charging', 'Wi-Fi access', 'Snack box'] }
];

const MEAL_OPTIONS = [
  { id: 'none', name: 'No Meal', icon: UtensilsCrossed, price: 0 },
  { id: 'snack', name: 'Snack Box', icon: Coffee, price: 100 },
  { id: 'meal', name: 'Meal Box', icon: Sandwich, price: 200 },
  { id: 'combo', name: 'Meal + Beverage Combo', icon: Utensils, price: 300 }
];

const getBusData = (id: string): BusData => {
  const mockBuses: Record<string, BusData> = {
    "1": {
      id: "1",
      operator: "Volvo Travels",
      busNumber: "VT 2024",
      busType: "AC Sleeper Multi-Axle",
      from: "Delhi (DEL)",
      to: "Mumbai (MUM)",
      departureTime: "22:00",
      arrivalTime: "06:00",
      departureDate: "Dec 25, 2024",
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
      from: "Delhi (DEL)",
      to: "Mumbai (MUM)",
      departureTime: "23:30",
      arrivalTime: "07:30",
      departureDate: "Dec 25, 2024",
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
      from: "Delhi (DEL)",
      to: "Mumbai (MUM)",
      departureTime: "21:00",
      arrivalTime: "05:00",
      departureDate: "Dec 25, 2024",
      duration: "8h 0m",
      basePrice: 1100,
      stops: 1,
      seatsAvailable: 10,
      rating: 4.3,
      amenities: ["WiFi", "Charging", "Blanket", "Water Bottle", "GPS Tracking"]
    }
  };
  
  return mockBuses[id] || mockBuses["1"];
};

const generateSeats = () => {
  const seats = [];
  for (let row = 1; row <= 12; row++) {
    seats.push({ row, seats: ['A', 'B', 'C', 'D'] });
  }
  return seats;
};

export default function BusBookingComprehensive() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const bus = getBusData(id || "1");

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Booking selections
  const [selectedAmenity, setSelectedAmenity] = useState('none');
  const [selectedMeal, setSelectedMeal] = useState('none');
  const [travelerType, setTravelerType] = useState<'general' | 'student' | 'business'>('general');
  
  // Seat selection
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [currentPassengerForSeat, setCurrentPassengerForSeat] = useState(0);
  const seatLayout = generateSeats();
  
  // Traveler details
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }
  ]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Conditional fields
  const [studentCollegeName, setStudentCollegeName] = useState("");
  const [studentCollegeId, setStudentCollegeId] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessIdCard, setBusinessIdCard] = useState("");
  const [businessGstNo, setBusinessGstNo] = useState("");
  
  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  // Calculate total price
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

    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < BOOKING_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      // Navigate to payment
      handleProceedToPayment();
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
      setSelectedSeats(selectedSeats
        .filter(s => s.passengerId !== index)
        .map(s => s.passengerId > index ? { ...s, passengerId: s.passengerId - 1 } : s)
      );
      if (currentPassengerForSeat >= passengers.length - 1) {
        setCurrentPassengerForSeat(Math.max(0, passengers.length - 2));
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

  const getSeatPassengerId = (row: number, seat: string) => {
    const seatSelection = selectedSeats.find(s => s.row === row && s.seat === seat);
    return seatSelection?.passengerId;
  };

  const handleProceedToPayment = () => {
    // Validate traveler details
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

      // Validate conditional fields
      if (travelerType === 'student' && (!studentCollegeName || !studentCollegeId)) {
        toast({
          title: "Student Details Required",
          description: "Please enter college name and ID",
          variant: "destructive"
        });
        return;
      }

      if (travelerType === 'business' && (!businessEmail || !businessIdCard || !businessGstNo)) {
        toast({
          title: "Business Details Required",
          description: "Please enter all business information",
          variant: "destructive"
        });
        return;
      }
    }

    const bookingData: Record<string, string> = {
      busId: id || '1',
      passengers: JSON.stringify(passengers),
      contactEmail,
      contactPhone,
      travelerType,
      studentCollegeName,
      studentCollegeId,
      businessEmail,
      businessIdCard,
      businessGstNo,
      selectedAmenity,
      selectedMeal,
      seats: JSON.stringify(selectedSeats),
      amount: totalPrice.toString(),
      type: 'bus'
    };

    const queryParams = new URLSearchParams(bookingData);
    navigate(`/flight-payment?${queryParams.toString()}`);
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
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
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

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
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
                <span><Users className="inline h-3 w-3 mr-1" />{bus.seatsAvailable} seats available</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Star className="h-5 w-5" />
                Bus Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bus.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/10">
                    {amenity === 'WiFi' && <Wifi className="h-6 w-6 text-white/60" />}
                    {amenity === 'Charging' && <Coffee className="h-6 w-6 text-white/60" />}
                    {amenity === 'Blanket' && <AirVent className="h-6 w-6 text-white/60" />}
                    {amenity === 'Water Bottle' && <Coffee className="h-6 w-6 text-white/60" />}
                    {amenity === 'Reading Light' && <Star className="h-6 w-6 text-white/60" />}
                    {amenity === 'GPS Tracking' && <MapPin className="h-6 w-6 text-white/60" />}
                    <span className="text-xs text-white/60 text-center">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'seat-selection':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Select Seats</h3>
              
              <div className="mb-4">
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                  Select Passenger for Seat Assignment
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {passengers.map((p, idx) => {
                    const hasSeat = selectedSeats.some(s => s.passengerId === idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPassengerForSeat(idx)}
                        className={`px-3 py-2 border text-xs uppercase tracking-wider transition-all ${
                          currentPassengerForSeat === idx
                            ? "bg-white text-black border-white"
                            : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                        }`}
                        data-testid={`button-passenger-${idx}`}
                      >
                        Passenger {idx + 1}
                        {hasSeat && <CheckCircle className="inline h-3 w-3 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-white/40" />
                  <span className="text-white/60">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-white/60">Selected</span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {seatLayout.map((row) => (
                    <div key={row.row} className="flex items-center gap-2">
                      <span className="text-white/60 text-xs w-8">{row.row}</span>
                      <div className="flex gap-1">
                        {row.seats.map((seat) => {
                          const selected = isSeatSelected(row.row, seat);
                          return (
                            <button
                              key={seat}
                              onClick={() => handleSeatClick(row.row, seat, currentPassengerForSeat)}
                              className={`w-10 h-10 border text-xs font-light ${
                                selected
                                  ? "bg-white text-black border-white"
                                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
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

              {selectedSeats.length > 0 && (
                <div className="mt-4 p-4 bg-white/5 border border-white/10">
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Selected Seats</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat, idx) => (
                      <Badge key={idx} className="bg-white/10 text-white border-white/20 rounded-none">
                        {seat.row}{seat.seat} (P{seat.passengerId + 1})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'amenities-selection':
        return (
          <div className="space-y-3">
            {AMENITY_OPTIONS.map((amenity) => (
              <button
                key={amenity.id}
                onClick={() => setSelectedAmenity(amenity.id)}
                className={`w-full p-4 border-b transition-all text-left ${
                  selectedAmenity === amenity.id
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
                data-testid={`amenity-option-${amenity.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-light tracking-wider transition-opacity ${
                    selectedAmenity === amenity.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                  }`}>
                    {amenity.name}
                  </p>
                  <Badge className={`rounded-none border font-light text-xs ${
                    selectedAmenity === amenity.id 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-white/10 text-white/60 border-white/20'
                  }`}>
                    {amenity.price === 0 ? 'Included' : `+${formatCurrency(amenity.price)}`}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenity.features.map((feature, idx) => (
                    <span key={idx} className="text-xs text-white/40 font-light">{feature}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        );

      case 'meal-selection':
        return (
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
        );

      case 'traveler-info':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Passenger Details
              </h3>
              {passengers.map((passenger, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white/80 font-light uppercase tracking-wider text-xs">
                      Passenger {index + 1}
                    </Label>
                    {passengers.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemovePassenger(index)}
                        className="text-white/60 hover:text-white h-auto p-1"
                        data-testid={`button-remove-passenger-${index}`}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-wider">Title</Label>
                      <Select
                        value={passenger.title}
                        onValueChange={(value) => handlePassengerChange(index, "title", value)}
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
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                        className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                        data-testid={`input-firstname-${index}`}
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-wider">Last Name</Label>
                      <Input
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                        className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                        data-testid={`input-lastname-${index}`}
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-wider">Age</Label>
                      <Input
                        type="number"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                        className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                        data-testid={`input-age-${index}`}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Gender</Label>
                    <Select
                      value={passenger.gender}
                      onValueChange={(value) => handlePassengerChange(index, "gender", value)}
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
              ))}
              {passengers.length < 9 && (
                <Button
                  onClick={handleAddPassenger}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 rounded-none"
                  data-testid="button-add-passenger"
                >
                  + Add Passenger
                </Button>
              )}
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
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

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Contact Information</h3>
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
              onClick={() => navigate("/booking/bus/results")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">BUS BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{bus.operator} - {bus.busNumber}</p>
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
        {/* Bus Info Card - Moved below progress */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bus className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{bus.operator}</p>
                <p className="text-white/60 text-xs">{bus.busNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{bus.departureDate}</p>
              <p className="text-white/60 text-xs">{bus.departureTime} - {bus.arrivalTime}</p>
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

        {/* Coupon Selector */}
        <CouponSelector
          bookingAmount={basePrice}
          category="travel"
          appliedCoupon={appliedCoupon}
          onApplyCoupon={setAppliedCoupon}
        />

        {/* Price Summary - UPI Payment Style */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Fare Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
              <span className="font-light">{formatCurrency(bus.basePrice * passengers.length)}</span>
            </div>
            {amenityPrice > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Amenities</span>
                <span className="font-light">{formatCurrency(amenityPrice * passengers.length)}</span>
              </div>
            )}
            {mealPrice > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Meals</span>
                <span className="font-light">{formatCurrency(mealPrice * passengers.length)}</span>
              </div>
            )}
            {appliedCoupon && couponDiscount > 0 && (
              <div className="flex justify-between text-green-400/80">
                <span className="text-sm">Coupon Discount</span>
                <span className="font-light">-{formatCurrency(couponDiscount)}</span>
              </div>
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
              <p className="text-xs text-white/60 font-light">{bus.busNumber}</p>
              <p className="text-sm text-white font-light">{bus.departureDate} • {bus.departureTime}</p>
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
                PROCEED TO PAYMENT
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
