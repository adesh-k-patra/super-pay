import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  ArrowRight,
  Theater,
  CheckCircle,
  Shield,
  User,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Star,
  Crown,
  Sparkles,
  Users,
  Building2,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  Wallet,
  Trophy,
  Target,
  Utensils,
  Camera,
  Droplet,
  TruckIcon,
  X,
  CheckSquare
} from "lucide-react";
import { format } from "date-fns";

interface TicketTier {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
}

interface SeatSelection {
  section: string;
  row: number;
  seat: string;
  tier: TicketTier;
}

interface AttendeeInfo {
  name: string;
  email: string;
  phone: string;
}

interface MarathonRunner {
  id: string;
  name: string;
  number: string;
}

interface MarathonFacilities {
  dropBack: boolean;
  food: boolean;
  energyDrink: boolean;
  photography: boolean;
}

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const BOOKING_STAGES: BookingStage[] = [
  { id: 'event-details', title: 'Event Information', shortTitle: 'Event', icon: Theater, description: 'Review event details' },
  { id: 'ticket-selection', title: 'Ticket Selection', shortTitle: 'Tickets', icon: Ticket, description: 'Choose ticket type' },
  { id: 'seat-selection', title: 'Seat Selection', shortTitle: 'Seats', icon: Users, description: 'Select your seats' },
  { id: 'attendee-info', title: 'Attendee Details', shortTitle: 'Details', icon: User, description: 'Contact information' },
  { id: 'final', title: 'Final Summary', shortTitle: 'Final', icon: Ticket, description: 'Review your booking' },
  { id: 'payment', title: 'Payment Method', shortTitle: 'Payment', icon: CreditCard, description: 'Select payment method and pay' }
];

const MARATHON_BOOKING_STAGES: BookingStage[] = [
  { id: 'add-members', title: 'Add Members', shortTitle: 'Members', icon: Users, description: 'Add runner details' },
  { id: 'facilities', title: 'Facilities', shortTitle: 'Facilities', icon: CheckSquare, description: 'Select facilities' },
  { id: 'contact-details', title: 'Contact Details', shortTitle: 'Contact', icon: User, description: 'Provide contact information' },
  { id: 'review', title: 'Review', shortTitle: 'Review', icon: CheckCircle, description: 'Review your booking' },
  { id: 'payment', title: 'Payment', shortTitle: 'Payment', icon: CreditCard, description: 'Complete payment' }
];

// Mock event data - in production this would come from API
const getMockEvent = (id: string) => {
  const events: Record<string, any> = {
    "1": {
      id: "1",
      title: "Arijit Singh Live in Concert",
      category: "Music Concert",
      venue: "DY Patil Stadium",
      city: "Mumbai",
      address: "D.Y. Patil Sports Stadium, Sector 30A, Vashi, Navi Mumbai",
      date: "2025-10-15",
      time: "19:00",
      duration: "4 hours",
      rating: 4.8,
      description: "Get ready for an unforgettable evening with the voice that has captured millions of hearts!"
    },
    "2": {
      id: "2",
      title: "IPL Finals 2025",
      category: "Sports",
      venue: "Wankhede Stadium",
      city: "Mumbai",
      address: "Wankhede Stadium, D Road, Churchgate, Mumbai",
      date: "2025-10-20",
      time: "15:00",
      duration: "8 hours",
      rating: 4.9,
      description: "Witness the most thrilling cricket match of the year!"
    },
    "marathon-1": {
      id: "marathon-1",
      title: "Mumbai Marathon 2025",
      category: "Marathon",
      type: "marathon",
      organizer: "Adidas",
      venue: "Gateway of India",
      city: "Mumbai",
      address: "Gateway of India, Apollo Bandar, Colaba, Mumbai",
      date: "2025-01-15",
      time: "06:00",
      distance: "42.2 KM",
      duration: "Full Marathon",
      rating: 4.9,
      registrationFee: 2500,
      description: "Join thousands of runners in Mumbai's premier marathon event. Experience the thrill of running through the city's iconic landmarks!"
    },
    "marathon-2": {
      id: "marathon-2",
      title: "Delhi Half Marathon",
      category: "Marathon",
      type: "marathon",
      organizer: "Nike",
      venue: "Jawaharlal Nehru Stadium",
      city: "New Delhi",
      address: "Jawaharlal Nehru Stadium, Pragati Vihar, New Delhi",
      date: "2024-11-30",
      time: "07:00",
      distance: "21.1 KM",
      duration: "Half Marathon",
      rating: 4.7,
      registrationFee: 1500,
      description: "Run through the heart of the capital city in this Nike-organized half marathon. Perfect for intermediate runners looking to challenge themselves."
    }
  };
  return events[id] || events["1"];
};

const TICKET_TIERS: TicketTier[] = [
  { id: 'vip', name: 'VIP', price: 7999, available: 50, description: 'Front row seats with exclusive meet & greet' },
  { id: 'premium', name: 'Premium', price: 3999, available: 200, description: 'Premium seating with complimentary food' },
  { id: 'standard', name: 'Standard', price: 1999, available: 500, description: 'General seating with great view' },
  { id: 'general', name: 'General', price: 999, available: 1000, description: 'Standing area' }
];

const FACILITY_PRICES = {
  dropBack: 200,
  food: 150,
  energyDrink: 100,
  photography: 300
};

export default function EventBookingComprehensive() {
  const { date, id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const event = getMockEvent(id || "1");
  const isMarathon = event.type === 'marathon';

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({ vip: 0, premium: 0, standard: 0, general: 0 });
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo>({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardName, setNewCardName] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [netbankingUsername, setNetbankingUsername] = useState("");
  const [netbankingPassword, setNetbankingPassword] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const [marathonRunners, setMarathonRunners] = useState<MarathonRunner[]>([{ id: "1", name: "", number: "" }]);
  const [runnerFacilities, setRunnerFacilities] = useState<Record<string, MarathonFacilities>>({});
  const [contactDetails, setContactDetails] = useState({ name: "", email: "", phone: "" });

  const bookingStages = isMarathon ? MARATHON_BOOKING_STAGES : BOOKING_STAGES;
  const currentStage = bookingStages[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / bookingStages.length) * 100;
  
  const calculateFacilityTotal = () => {
    if (!isMarathon) return 0;
    let total = 0;
    Object.values(runnerFacilities).forEach(facilities => {
      if (facilities.dropBack) total += FACILITY_PRICES.dropBack;
      if (facilities.food) total += FACILITY_PRICES.food;
      if (facilities.energyDrink) total += FACILITY_PRICES.energyDrink;
      if (facilities.photography) total += FACILITY_PRICES.photography;
    });
    return total;
  };

  const basePrice = isMarathon 
    ? marathonRunners.length * (event.registrationFee || 1500) 
    : selectedSeats.reduce((sum, seat) => sum + seat.tier.price, 0);
  const facilityTotal = calculateFacilityTotal();
  const convenienceFee = isMarathon ? marathonRunners.length * 50 : selectedSeats.length * 50;

  const calculateCouponDiscount = (): number => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.valueType === "percentage") {
      const discount = (basePrice * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    }
    return appliedCoupon.value;
  };

  const couponDiscount = calculateCouponDiscount();
  const totalPrice = Math.max(0, basePrice + facilityTotal - couponDiscount);
  const finalPrice = totalPrice + convenienceFee;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const addMarathonRunner = () => {
    if (marathonRunners.length >= 100) {
      toast({
        title: "Maximum Runners Reached",
        description: "You can add up to 100 runners",
        variant: "destructive"
      });
      return;
    }
    const newId = String(marathonRunners.length + 1);
    setMarathonRunners([...marathonRunners, { id: newId, name: "", number: "" }]);
  };

  const removeMarathonRunner = (id: string) => {
    if (marathonRunners.length > 1) {
      setMarathonRunners(marathonRunners.filter(r => r.id !== id));
      const newFacilities = { ...runnerFacilities };
      delete newFacilities[id];
      setRunnerFacilities(newFacilities);
    }
  };

  const updateMarathonRunner = (id: string, field: keyof MarathonRunner, value: string) => {
    setMarathonRunners(marathonRunners.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const toggleRunnerFacility = (runnerId: string, facility: keyof MarathonFacilities) => {
    setRunnerFacilities(prev => ({
      ...prev,
      [runnerId]: {
        ...prev[runnerId],
        [facility]: !prev[runnerId]?.[facility]
      }
    }));
  };

  const handleNextStage = () => {
    if (isMarathon) {
      if (currentStage.id === 'add-members') {
        const hasEmptyFields = marathonRunners.some(r => !r.name || !r.number);
        if (hasEmptyFields) {
          toast({
            title: "Member Details Required",
            description: "Please provide name and number for all runners",
            variant: "destructive"
          });
          return;
        }
      }

      if (currentStage.id === 'contact-details') {
        if (!contactDetails.name || !contactDetails.email || !contactDetails.phone) {
          toast({
            title: "Contact Details Required",
            description: "Please complete all contact fields",
            variant: "destructive"
          });
          return;
        }
      }

      if (!completedStages.includes(currentStageIndex)) {
        setCompletedStages([...completedStages, currentStageIndex]);
      }
      if (currentStageIndex < bookingStages.length - 1) {
        setCurrentStageIndex(currentStageIndex + 1);
      } else {
        handleProceedToPayment();
      }
      return;
    }
    // Validate ticket selection
    if (currentStage.id === 'ticket-selection') {
      if (!selectedTier) {
        toast({
          title: "Ticket Type Required",
          description: "Please select a ticket type",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate seat selection
    if (currentStage.id === 'seat-selection') {
      if (selectedSeats.length === 0) {
        toast({
          title: "Seat Selection Required",
          description: "Please select at least one seat",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate attendee info
    if (currentStage.id === 'attendee-info') {
      if (!attendeeInfo.name || !attendeeInfo.email || !attendeeInfo.phone) {
        toast({
          title: "Details Required",
          description: "Please complete all fields",
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
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSeatClick = (section: string, row: number, seat: string) => {
    if (!selectedTier) {
      toast({
        title: "Select Ticket Type First",
        description: "Please select a ticket type before choosing seats",
        variant: "destructive"
      });
      return;
    }

    const existingSeat = selectedSeats.find(s => s.section === section && s.row === row && s.seat === seat);

    if (existingSeat) {
      setSelectedSeats(selectedSeats.filter(s => !(s.section === section && s.row === row && s.seat === seat)));
    } else {
      if (selectedSeats.length >= 10) {
        toast({
          title: "Maximum Seats Selected",
          description: "You can select up to 10 seats",
          variant: "destructive"
        });
        return;
      }
      setSelectedSeats([...selectedSeats, { section, row, seat, tier: selectedTier }]);
    }
  };

  const isSeatSelected = (section: string, row: number, seat: string) => {
    return selectedSeats.some(s => s.section === section && s.row === row && s.seat === seat);
  };

  const isSeatOccupied = (section: string, row: number, seat: string) => {
    // Simulate some occupied seats
    return (row + seat.charCodeAt(0)) % 5 === 0;
  };

  // Generate stadium-style seat layout
  const generateStadiumSeats = () => {
    const sections = [];
    
    // VIP Section (front, small curved area)
    sections.push({
      id: 'vip',
      name: 'VIP Section',
      tier: TICKET_TIERS[0],
      rows: [
        { row: 1, seats: ['A', 'B', 'C', 'D', 'E', 'F'] },
        { row: 2, seats: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
      ]
    });
    
    // Premium Section (middle area, larger)
    sections.push({
      id: 'premium',
      name: 'Premium Section',
      tier: TICKET_TIERS[1],
      rows: Array.from({ length: 5 }, (_, i) => ({
        row: i + 3,
        seats: Array.from({ length: 12 }, (_, j) => String.fromCharCode(65 + j))
      }))
    });
    
    // Standard Section (upper area)
    sections.push({
      id: 'standard',
      name: 'Standard Section',
      tier: TICKET_TIERS[2],
      rows: Array.from({ length: 8 }, (_, i) => ({
        row: i + 8,
        seats: Array.from({ length: 14 }, (_, j) => String.fromCharCode(65 + j))
      }))
    });
    
    // General Section (standing area - no specific seats)
    sections.push({
      id: 'general',
      name: 'General Admission',
      tier: TICKET_TIERS[3],
      rows: []
    });
    
    return sections;
  };

  const stadiumLayout = generateStadiumSeats();

  const handleProceedToPayment = () => {
    if (isMarathon) {
      const upiPaymentParams = new URLSearchParams({
        amount: finalPrice.toString(),
        type: 'marathon',
        eventId: id || 'marathon-1',
        date: date || format(new Date(), "yyyy-MM-dd"),
        runners: marathonRunners.length.toString(),
        returnUrl: `/fitness?tab=marathons`
      });
      navigate(`/upi-payment?${upiPaymentParams.toString()}`);
      return;
    }

    // Validate payment method specific fields
    // UPI ID is now optional - users can go directly to UPI payment page
    
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

    if (paymentMethod === 'netbanking' && (!selectedBank || !netbankingUsername || !netbankingPassword)) {
      toast({
        title: "Net Banking Details Required",
        description: "Please complete all net banking details",
        variant: "destructive"
      });
      return;
    }

    // If UPI, redirect to UPI payment page (UPI ID is optional now)
    if (paymentMethod === 'upi') {
      const upiPaymentParams = new URLSearchParams({
        amount: finalPrice.toString(),
        type: 'event',
        eventId: id || '1',
        date: date || format(new Date(), "yyyy-MM-dd"),
        seats: JSON.stringify(selectedSeats),
        attendeeInfo: JSON.stringify(attendeeInfo),
        returnUrl: `/event-detail/${id}`
      });
      navigate(`/upi-payment?${upiPaymentParams.toString()}`);
      return;
    }

    // For card and netbanking, proceed with direct payment simulation
    const bookingData: Record<string, string> = {
      eventId: id || '1',
      date: date || format(new Date(), "yyyy-MM-dd"),
      seats: JSON.stringify(selectedSeats),
      attendeeInfo: JSON.stringify(attendeeInfo),
      amount: finalPrice.toString(),
      type: 'event'
    };

    // Simulate payment processing
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}`;
      const bookingRef = `EV${Date.now().toString().slice(-8)}`;
      
      const successParams = new URLSearchParams({
        id: transactionId,
        bookingRef: bookingRef,
        type: 'event',
        amount: finalPrice.toString(),
        seats: selectedSeats.length.toString(),
        passengers: '1'
      });

      navigate(`/transaction-success?${successParams.toString()}`);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'add-members':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light tracking-wider text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Add Runners
              </h3>
              <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-xs">
                {marathonRunners.length} / 100 max
              </Badge>
            </div>

            <div className="space-y-4">
              {marathonRunners.map((runner, index) => (
                <div key={runner.id} className="border border-white/10 bg-white/5 p-4" data-testid={`runner-${index}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-light text-white uppercase tracking-widest">Runner {index + 1}</h4>
                    {marathonRunners.length > 1 && (
                      <Button
                        onClick={() => removeMarathonRunner(runner.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-none h-8"
                        data-testid={`button-remove-runner-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`runner-name-${runner.id}`} className="text-xs text-white/60 uppercase tracking-widest">
                        Runner Name *
                      </Label>
                      <Input
                        id={`runner-name-${runner.id}`}
                        value={runner.name}
                        onChange={(e) => updateMarathonRunner(runner.id, 'name', e.target.value)}
                        placeholder="Enter runner name"
                        className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                        data-testid={`input-runner-name-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`runner-number-${runner.id}`} className="text-xs text-white/60 uppercase tracking-widest">
                        Runner Number *
                      </Label>
                      <Input
                        id={`runner-number-${runner.id}`}
                        value={runner.number}
                        onChange={(e) => updateMarathonRunner(runner.id, 'number', e.target.value)}
                        placeholder="Enter runner number"
                        className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                        data-testid={`input-runner-number-${index}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={addMarathonRunner}
              disabled={marathonRunners.length >= 100}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none disabled:opacity-30"
              data-testid="button-add-member"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Runner
            </Button>

            <div className="bg-white/5 border border-white/10 p-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white/60">Registration Fee (₹{event.registrationFee} × {marathonRunners.length})</p>
                <p className="text-xl font-light">{formatCurrency(basePrice)}</p>
              </div>
            </div>
          </div>
        );

      case 'facilities':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Select Facilities
            </h3>

            {marathonRunners.map((runner, index) => (
              <div key={runner.id} className="border border-white/10 bg-white/5 p-4" data-testid={`facilities-${index}`}>
                <h4 className="text-sm font-light text-white uppercase tracking-widest mb-4">
                  Runner {index + 1}: {runner.name}
                </h4>

                <div className="space-y-3">
                  {[
                    { id: 'dropBack', label: 'Drop back to starting point', icon: TruckIcon, price: FACILITY_PRICES.dropBack },
                    { id: 'food', label: 'Food Package', icon: Utensils, price: FACILITY_PRICES.food },
                    { id: 'energyDrink', label: 'Energy Drink', icon: Droplet, price: FACILITY_PRICES.energyDrink },
                    { id: 'photography', label: 'Professional Photography', icon: Camera, price: FACILITY_PRICES.photography }
                  ].map((facility) => {
                    const Icon = facility.icon;
                    const isSelected = runnerFacilities[runner.id]?.[facility.id as keyof MarathonFacilities];
                    
                    return (
                      <div
                        key={facility.id}
                        onClick={() => toggleRunnerFacility(runner.id, facility.id as keyof MarathonFacilities)}
                        className={cn(
                          "border p-4 cursor-pointer transition-all flex items-center justify-between",
                          isSelected ? "border-white/30 bg-white/10" : "border-white/10 bg-transparent hover:border-white/20"
                        )}
                        data-testid={`facility-${facility.id}-${index}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 border rounded-sm flex items-center justify-center transition-all",
                            isSelected ? "bg-white border-white" : "border-white/30"
                          )}>
                            {isSelected && <CheckCircle className="h-4 w-4 text-black" />}
                          </div>
                          <Icon className="h-5 w-5 text-white/60" />
                          <div>
                            <p className="text-white font-light">{facility.label}</p>
                            <p className="text-xs text-white/40">{formatCurrency(facility.price)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {facilityTotal > 0 && (
              <div className="bg-white/5 border border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/60">Total Facilities</p>
                  <p className="text-xl font-light">{formatCurrency(facilityTotal)}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'contact-details':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-xs text-white/60 uppercase tracking-widest">
                  Full Name *
                </Label>
                <Input
                  id="contact-name"
                  value={contactDetails.name}
                  onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                  data-testid="input-contact-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-xs text-white/60 uppercase tracking-widest">
                  Email Address *
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactDetails.email}
                  onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                  data-testid="input-contact-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone" className="text-xs text-white/60 uppercase tracking-widest">
                  Phone Number *
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                  placeholder="+91 1234567890"
                  className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                  data-testid="input-contact-phone"
                />
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Review Booking
            </h3>

            <div className="border border-white/10 bg-white/5 p-4">
              <h4 className="text-sm font-light text-white/60 uppercase tracking-widest mb-3">Event Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Event</span>
                  <span className="text-white text-sm">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Date</span>
                  <span className="text-white text-sm">{event.date ? format(new Date(event.date), "dd MMM yyyy") : "Today"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Venue</span>
                  <span className="text-white text-sm">{event.venue}</span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-4">
              <h4 className="text-sm font-light text-white/60 uppercase tracking-widest mb-3">Runners ({marathonRunners.length})</h4>
              <div className="space-y-2">
                {marathonRunners.map((runner, index) => (
                  <div key={runner.id} className="flex justify-between text-sm">
                    <span className="text-white/60">Runner {index + 1}</span>
                    <span className="text-white">{runner.name} (#{runner.number})</span>
                  </div>
                ))}
              </div>
            </div>

            {facilityTotal > 0 && (
              <div className="border border-white/10 bg-white/5 p-4">
                <h4 className="text-sm font-light text-white/60 uppercase tracking-widest mb-3">Facilities</h4>
                <div className="space-y-2">
                  {Object.entries(runnerFacilities).map(([runnerId, facilities]) => {
                    const runner = marathonRunners.find(r => r.id === runnerId);
                    const selectedFacilities = Object.entries(facilities)
                      .filter(([, selected]) => selected)
                      .map(([facilityName]) => facilityName);
                    
                    if (selectedFacilities.length === 0) return null;
                    
                    return (
                      <div key={runnerId} className="text-sm">
                        <span className="text-white/60">{runner?.name}: </span>
                        <span className="text-white">{selectedFacilities.join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border border-white/10 bg-white/5 p-4">
              <h4 className="text-sm font-light text-white/60 uppercase tracking-widest mb-3">Contact Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Name</span>
                  <span className="text-white">{contactDetails.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Email</span>
                  <span className="text-white">{contactDetails.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Phone</span>
                  <span className="text-white">{contactDetails.phone}</span>
                </div>
              </div>
            </div>

            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
              <h4 className="text-sm font-light text-white/60 uppercase tracking-widest mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Registration Fee ({marathonRunners.length} runners)</span>
                  <span className="text-white">{formatCurrency(basePrice)}</span>
                </div>
                {facilityTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Facilities</span>
                    <span className="text-white">{formatCurrency(facilityTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Convenience Fee</span>
                  <span className="text-white">{formatCurrency(convenienceFee)}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between">
                  <span className="text-white font-light">Total Amount</span>
                  <span className="text-white text-xl font-light">{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'event-details':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Theater className="h-5 w-5" />
                Event Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Event</Label>
                    <p className="text-white text-base mt-1">{event.title}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Category</Label>
                    <p className="text-white text-base mt-1">{event.category}</p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Rating</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-white fill-white" />
                      <p className="text-white text-base">{event.rating}/5</p>
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Duration</Label>
                    <p className="text-white text-base mt-1">{event.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Venue Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Venue</Label>
                    <p className="text-white text-base mt-1">{event.venue}</p>
                    <p className="text-white/40 text-sm">{event.address}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">City</Label>
                    <p className="text-white text-base mt-1 flex items-center justify-end gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.city}
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Date</Label>
                    <p className="text-white text-base mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date ? format(new Date(event.date), "dd MMM yyyy") : "Today"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Time</Label>
                    <p className="text-white text-base mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">About</Label>
              <p className="text-white/80 text-sm mt-2 font-light">{event.description}</p>
            </div>
          </div>
        );

      case 'ticket-selection':
        const handleQuantityChange = (tierId: string, delta: number) => {
          setTicketQuantities(prev => {
            const currentQty = prev[tierId] || 0;
            const newQty = Math.max(0, Math.min(10, currentQty + delta));
            const newQuantities = { ...prev, [tierId]: newQty };
            
            // Update selectedTier based on ticket quantities
            const firstTierWithQuantity = TICKET_TIERS.find(tier => newQuantities[tier.id] > 0);
            if (firstTierWithQuantity) {
              setSelectedTier(firstTierWithQuantity);
            } else {
              setSelectedTier(null);
            }
            
            // Generate selectedSeats based on ticket quantities
            const newSeats: SeatSelection[] = [];
            TICKET_TIERS.forEach(tier => {
              const qty = newQuantities[tier.id] || 0;
              for (let i = 0; i < qty; i++) {
                newSeats.push({
                  section: tier.id,
                  row: 1,
                  seat: String.fromCharCode(65 + i), // A, B, C, etc.
                  tier: tier
                });
              }
            });
            setSelectedSeats(newSeats);
            
            return newQuantities;
          });
        };

        const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);

        return (
          <div className="space-y-4">
            {TICKET_TIERS.map((tier) => {
              const quantity = ticketQuantities[tier.id] || 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={tier.id}
                  className={cn(
                    "border-b pb-4 transition-all",
                    isSelected ? "border-white/20" : "border-white/10"
                  )}
                  data-testid={`ticket-tier-${tier.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {tier.id === 'vip' && <Crown className="h-5 w-5 text-white/60" />}
                        {tier.id === 'premium' && <Sparkles className="h-5 w-5 text-white/60" />}
                        <h3 className={cn(
                          "font-light tracking-wider text-lg",
                          isSelected ? "text-white" : "text-white/80"
                        )}>
                          {tier.name}
                        </h3>
                        <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-xs px-2 py-0.5">
                          {tier.available} Available
                        </Badge>
                      </div>
                      <p className="text-xs text-white/40 mb-2">{tier.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div>
                      <p className="text-sm text-white/40">Price per ticket</p>
                      <p className={cn(
                        "text-xl font-light",
                        isSelected ? "text-white" : "text-white/60"
                      )}>
                        {formatCurrency(tier.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleQuantityChange(tier.id, -1)}
                        disabled={quantity === 0}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-10 w-10 p-0 disabled:opacity-30"
                        data-testid={`button-decrease-${tier.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-light w-12 text-center" data-testid={`quantity-${tier.id}`}>
                        {quantity}
                      </span>
                      <Button
                        onClick={() => handleQuantityChange(tier.id, 1)}
                        disabled={quantity >= 10}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-10 w-10 p-0 disabled:opacity-30"
                        data-testid={`button-increase-${tier.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {quantity > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                      <p className="text-sm text-white/40">Subtotal for {quantity} ticket{quantity > 1 ? 's' : ''}</p>
                      <p className="text-lg font-light text-white">{formatCurrency(tier.price * quantity)}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {totalTickets > 0 && (
              <div className="bg-white/5 border border-white/10 p-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/60">Total Tickets Selected</p>
                  <p className="text-xl font-light">{totalTickets}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'seat-selection':
        return (
          <div className="space-y-6">
            {!selectedTier ? (
              <div className="text-center py-8 text-white/60">
                <p className="font-light">Please select a ticket type first</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
                <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-lg font-light tracking-wider text-white">Stadium View</h3>
                  <div className="flex gap-4 text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/10 border border-white/30"></div>
                      <span className="text-white/60">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500/20 border border-green-500/40"></div>
                      <span className="text-white/60">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/5 border border-white/20"></div>
                      <span className="text-white/60">Booked</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 p-6 rounded-lg">
                  {/* Stage/Field */}
                  <div className="mb-8">
                    <div className="h-20 bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white/40 text-sm font-light tracking-widest uppercase">Stage / Field</span>
                    </div>
                  </div>

                  {/* Stadium Sections */}
                  <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="space-y-6">
                      {stadiumLayout.filter(section => section.id !== 'general').map((section) => (
                        <div key={section.id}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-px bg-white/20 flex-1"></div>
                            <div className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider">
                              {section.id === 'vip' && <Crown className="h-3 w-3" />}
                              {section.id === 'premium' && <Sparkles className="h-3 w-3" />}
                              <span>{section.name}</span>
                              <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px]">
                                {formatCurrency(section.tier.price)}
                              </Badge>
                            </div>
                            <div className="h-px bg-white/20 flex-1"></div>
                          </div>
                          <div className="space-y-2">
                            {section.rows.map((row) => (
                              <div key={`${section.id}-${row.row}`} className="flex justify-center">
                                <div className="flex gap-2 items-center">
                                  <div className="w-8 flex items-center justify-center text-sm text-white/40 font-light">
                                    {row.row}
                                  </div>
                                  <div className="flex gap-1.5">
                                    {row.seats.map((seat) => {
                                      const selected = isSeatSelected(section.id, row.row, seat);
                                      const occupied = isSeatOccupied(section.id, row.row, seat);
                                      const isCurrentTier = selectedTier?.id === section.id;
                                      
                                      return (
                                        <button
                                          key={seat}
                                          onClick={() => isCurrentTier && !occupied && handleSeatClick(section.id, row.row, seat)}
                                          disabled={occupied || !isCurrentTier}
                                          className={`w-8 h-8 border transition-all font-light text-xs rounded-sm ${
                                            selected
                                              ? 'bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30'
                                              : occupied
                                              ? 'bg-white/5 border-white/20 text-white/20 cursor-not-allowed'
                                              : !isCurrentTier
                                              ? 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
                                              : section.id === 'vip'
                                              ? 'bg-purple-500/10 border-purple-500/30 text-white/60 hover:bg-purple-500/20 hover:border-purple-500/50'
                                              : section.id === 'premium'
                                              ? 'bg-yellow-500/10 border-yellow-500/30 text-white/60 hover:bg-yellow-500/20 hover:border-yellow-500/50'
                                              : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20 hover:border-white/50'
                                          }`}
                                          data-testid={`seat-${section.id}-${row.row}${seat}`}
                                        >
                                          {seat}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {/* General Admission (no specific seats) */}
                      {selectedTier?.id === 'general' && (
                        <div className="text-center py-8">
                          <p className="text-white/60 font-light mb-4">General Admission - Standing Area</p>
                          <p className="text-white/40 text-sm font-light">No specific seat assignment</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Seats Summary */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Selected Seats:</span>
                      <span className="text-white font-light">
                        {selectedSeats.length > 0 
                          ? selectedSeats.map(s => `${s.section.toUpperCase()}-${s.row}${s.seat}`).join(', ')
                          : 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'attendee-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Full Name</Label>
                <Input
                  value={attendeeInfo.name}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, name: e.target.value})}
                  placeholder="Enter full name"
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-attendee-name"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
                <Input
                  type="email"
                  value={attendeeInfo.email}
                  onChange={(e) => setAttendeeInfo({...attendeeInfo, email: e.target.value})}
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-attendee-email"
                />
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Phone</Label>
              <Input
                type="tel"
                value={attendeeInfo.phone}
                onChange={(e) => setAttendeeInfo({...attendeeInfo, phone: e.target.value})}
                placeholder="9876543210"
                className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                data-testid="input-attendee-phone"
              />
            </div>
          </div>
        );

      case 'final':
        return (
          <div className="space-y-6">
            {/* Event Summary */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <Theater className="h-4 w-4" />
                Event Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Event</p>
                    <p className="text-white font-light mt-1">{event.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{event.category}</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    {event.rating}
                  </Badge>
                </div>
                <Separator className="bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Date</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.date ? format(new Date(event.date), "dd MMM yyyy") : "Today"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Time</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Name</span>
                  <span className="text-white font-light">{attendeeInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Email</span>
                  <span className="text-white font-light">{attendeeInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Phone</span>
                  <span className="text-white font-light">{attendeeInfo.phone}</span>
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
            </div>

            {/* Coupon Selector */}
            <CouponSelector
              bookingAmount={basePrice}
              category="entertainment"
              onApplyCoupon={setAppliedCoupon}
              appliedCoupon={appliedCoupon}
            />

            {/* Price Summary with Discount */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Base Amount</span>
                  <span className="font-light">{formatCurrency(basePrice)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-light">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Convenience Fee</span>
                  <span className="font-light">{formatCurrency(convenienceFee)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm uppercase tracking-wider">Total Amount</span>
                  <span className="text-white text-2xl font-light" data-testid="text-payment-total">{formatCurrency(finalPrice)}</span>
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
              onClick={() => navigate(`/event-detail/${id}`)}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">EVENT BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{event.category}</p>
            </div>

            <Badge className="bg-black border border-white/30 text-white rounded-none">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
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
                  <div key={stage.id} className="flex flex-col items-center">
                    <div
                      onClick={() => isAccessible && handleStageClick(index)}
                      className={`w-8 h-8 border-b-2 flex items-center justify-center text-xs font-light transition-all duration-200 ${
                        isCompleted 
                          ? 'border-white bg-white/5 text-white cursor-pointer' 
                          : isCurrent 
                            ? 'border-white bg-white/5 text-white' 
                            : isAccessible
                              ? 'border-white/20 bg-transparent text-white/60 cursor-pointer hover:bg-white/5'
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content - Cardless Design */}
      <div ref={scrollableContentRef} className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Event Info Card - Moved below progress */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Theater className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{event.title}</p>
                <p className="text-white/60 text-xs">{event.venue}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{event.date ? format(new Date(event.date), "dd MMM") : "Today"}</p>
              <p className="text-white/60 text-xs">{event.time}</p>
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
          <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Booking Summary</h3>
          <div className="space-y-3">
            {selectedSeats.length > 0 && (
              <>
                {selectedTier && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">{selectedTier.name} Tickets ({selectedSeats.length})</span>
                    <span className="font-light">{formatCurrency(basePrice)}</span>
                  </div>
                )}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-light">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">After Discount</span>
                    <span className="font-light">{formatCurrency(totalPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Convenience Fee</span>
                  <span className="font-light">{formatCurrency(convenienceFee)}</span>
                </div>
              </>
            )}
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-white text-xl">
              <span className="font-light">Total Amount</span>
              <span className="font-bold" data-testid="text-total-amount">{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Footer - UPI Payment Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{event.title}</p>
              <p className="text-sm text-white font-light">{event.date ? format(new Date(event.date), "dd MMM yyyy") : "Today"} • {event.time}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Amount</p>
              <p className="text-xl font-light text-white">{formatCurrency(finalPrice)}</p>
            </div>
          </div>
          <Button
            onClick={handleNextStage}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === BOOKING_STAGES.length - 1 ? (
              <>
                PAY {formatCurrency(finalPrice)}
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
