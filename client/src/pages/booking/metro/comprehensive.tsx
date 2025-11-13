import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  ArrowRight,
  Train,
  CheckCircle,
  Shield,
  MapPin,
  User,
  Ticket,
  Users,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Plus,
  Minus,
  ArrowRightLeft
} from "lucide-react";


interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const getBookingStages = (bookingType: 'journey' | 'recharge'): BookingStage[] => {
  const baseStages: BookingStage[] = [
    { 
      id: 'booking-type', 
      title: 'Booking Type', 
      shortTitle: 'Type', 
      icon: Ticket, 
      description: 'Choose booking type' 
    },
    { 
      id: 'journey-details', 
      title: bookingType === 'journey' ? 'Journey Details' : 'Recharge Details', 
      shortTitle: bookingType === 'journey' ? 'Journey' : 'Recharge', 
      icon: Train, 
      description: bookingType === 'journey' ? 'Select route' : 'Select amount' 
    },
    { 
      id: 'contact-details', 
      title: 'Contact Details', 
      shortTitle: 'Contact', 
      icon: User, 
      description: 'Add contact info' 
    },
    { 
      id: 'payment', 
      title: 'Payment Method', 
      shortTitle: 'Payment', 
      icon: CreditCard, 
      description: 'Choose payment method' 
    }
  ];

  return baseStages;
};

const METRO_LINES = [
  { id: 'red', name: 'Red Line', color: '#EF4444' },
  { id: 'blue', name: 'Blue Line', color: '#3B82F6' },
  { id: 'yellow', name: 'Yellow Line', color: '#EAB308' },
  { id: 'green', name: 'Green Line', color: '#22C55E' },
  { id: 'violet', name: 'Violet Line', color: '#A855F7' },
  { id: 'pink', name: 'Pink Line', color: '#EC4899' },
  { id: 'magenta', name: 'Magenta Line', color: '#D946EF' },
  { id: 'orange', name: 'Orange Line', color: '#F97316' }
];

const METRO_STATIONS = [
  { id: '1', name: 'Rajiv Chowk', line: 'blue', code: 'RC' },
  { id: '2', name: 'Connaught Place', line: 'yellow', code: 'CP' },
  { id: '3', name: 'Kashmere Gate', line: 'red', code: 'KG' },
  { id: '4', name: 'Huda City Centre', line: 'yellow', code: 'HCC' },
  { id: '5', name: 'Dwarka Sector 21', line: 'blue', code: 'DS21' },
  { id: '6', name: 'Vaishali', line: 'blue', code: 'VSH' },
  { id: '7', name: 'Noida City Centre', line: 'blue', code: 'NCC' },
  { id: '8', name: 'Botanical Garden', line: 'magenta', code: 'BG' },
  { id: '9', name: 'Vishwavidyalaya', line: 'yellow', code: 'VV' },
  { id: '10', name: 'Chandni Chowk', line: 'yellow', code: 'CC' },
  { id: '11', name: 'Hauz Khas', line: 'yellow', code: 'HK' },
  { id: '12', name: 'Saket', line: 'yellow', code: 'SK' },
  { id: '13', name: 'Nehru Place', line: 'violet', code: 'NP' },
  { id: '14', name: 'Kalkaji Mandir', line: 'violet', code: 'KM' },
  { id: '15', name: 'Lajpat Nagar', line: 'pink', code: 'LN' }
];

const RECHARGE_AMOUNTS = [
  { amount: 100, bonus: 0, label: '₹100' },
  { amount: 200, bonus: 10, label: '₹200 + ₹10 bonus' },
  { amount: 500, bonus: 50, label: '₹500 + ₹50 bonus' },
  { amount: 1000, bonus: 150, label: '₹1000 + ₹150 bonus' },
  { amount: 2000, bonus: 400, label: '₹2000 + ₹400 bonus' }
];

export default function MetroBookingComprehensive() {
  const { date, id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Booking type: 'journey' or 'recharge'
  const [bookingType, setBookingType] = useState<'journey' | 'recharge'>('journey');
  
  // Journey details
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [showFromPopover, setShowFromPopover] = useState(false);
  const [showToPopover, setShowToPopover] = useState(false);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  
  // Recharge details
  const [selectedRechargeAmount, setSelectedRechargeAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  // Contact details
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Payment
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

  // Get dynamic stages based on booking type
  const BOOKING_STAGES = getBookingStages(bookingType);
  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  const filteredFromStations = METRO_STATIONS.filter(station =>
    station.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
    station.code.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToStations = METRO_STATIONS.filter(station =>
    station.name.toLowerCase().includes(toSearch.toLowerCase()) ||
    station.code.toLowerCase().includes(toSearch.toLowerCase())
  );

  const selectedFromStation = METRO_STATIONS.find(s => s.id === fromStation);
  const selectedToStation = METRO_STATIONS.find(s => s.id === toStation);

  const calculateFare = () => {
    if (!selectedFromStation || !selectedToStation) return 0;
    const distance = Math.abs(parseInt(selectedFromStation.id) - parseInt(selectedToStation.id));
    return Math.min(10 + distance * 5, 60);
  };

  const basePrice = bookingType === 'journey' 
    ? calculateFare() * numberOfTickets
    : (selectedRechargeAmount || (customAmount ? parseInt(customAmount, 10) : 0) || 0);

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

  const totalBonus = bookingType === 'recharge' && selectedRechargeAmount
    ? RECHARGE_AMOUNTS.find(r => r.amount === selectedRechargeAmount)?.bonus || 0
    : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);


  // Handler for booking type change that immediately clamps stage index
  const handleBookingTypeChange = (newBookingType: 'journey' | 'recharge') => {
    setBookingType(newBookingType);
    
    // Get the new stages for the selected booking type
    const newStages = getBookingStages(newBookingType);
    
    // Clamp current stage index to valid range for new booking type
    setCurrentStageIndex(prev => {
      const maxIndex = newStages.length - 1;
      return prev > maxIndex ? maxIndex : prev;
    });
    
    // Clear completed stages that are beyond the new stage count
    setCompletedStages(prev => prev.filter(idx => idx < newStages.length));
  };

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleNextStage = () => {
    // Validate booking type selection
    if (currentStage.id === 'booking-type') {
      if (!bookingType) {
        toast({
          title: "Selection Required",
          description: "Please select a booking type",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate journey details
    if (currentStage.id === 'journey-details') {
      if (bookingType === 'journey') {
        if (!fromStation || !toStation) {
          toast({
            title: "Stations Required",
            description: "Please select both departure and arrival stations",
            variant: "destructive"
          });
          return;
        }
        if (fromStation === toStation) {
          toast({
            title: "Invalid Selection",
            description: "Departure and arrival stations cannot be the same",
            variant: "destructive"
          });
          return;
        }
      } else {
        if (!cardNumber) {
          toast({
            title: "Card Number Required",
            description: "Please enter your metro card number",
            variant: "destructive"
          });
          return;
        }
        if (!selectedRechargeAmount && !customAmount) {
          toast({
            title: "Amount Required",
            description: "Please select or enter a recharge amount",
            variant: "destructive"
          });
          return;
        }
        const amount = selectedRechargeAmount || (customAmount ? parseInt(customAmount, 10) : 0);
        if (isNaN(amount) || !amount || amount < 50) {
          toast({
            title: "Invalid Amount",
            description: customAmount && isNaN(parseInt(customAmount, 10)) 
              ? "Please enter a valid number" 
              : "Minimum recharge amount is ₹50",
            variant: "destructive"
          });
          return;
        }
        if (amount > 10000) {
          toast({
            title: "Amount Too High",
            description: "Maximum recharge amount is ₹10,000",
            variant: "destructive"
          });
          return;
        }
      }
    }

    // Validate contact details
    if (currentStage.id === 'contact-details') {
      if (!contactEmail || !contactPhone) {
        toast({
          title: "Contact Details Required",
          description: "Please enter your email and phone number",
          variant: "destructive"
        });
        return;
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

  const handleProceedToPayment = () => {
    // For UPI, go directly to UPI payment page without validation
    if (paymentMethod === 'upi') {
      const upiPaymentParams = new URLSearchParams({
        amount: totalPrice.toString(),
        type: 'metro',
        bookingType: bookingType,
        ...(bookingType === 'journey' ? {
          fromStation: selectedFromStation?.name || '',
          toStation: selectedToStation?.name || '',
          numberOfTickets: numberOfTickets.toString(),
          fare: calculateFare().toString()
        } : {
          cardNumber: cardNumber,
          rechargeAmount: totalPrice.toString(),
          bonus: totalBonus.toString()
        }),
        contactEmail,
        contactPhone,
        returnUrl: '/booking/metro/search'
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
      type: 'metro',
      bookingType: bookingType,
      ...(bookingType === 'journey' ? {
        fromStation: selectedFromStation?.name || '',
        toStation: selectedToStation?.name || '',
        numberOfTickets: numberOfTickets.toString(),
        fare: calculateFare().toString()
      } : {
        cardNumber: cardNumber,
        rechargeAmount: totalPrice.toString(),
        bonus: totalBonus.toString()
      }),
      contactEmail,
      contactPhone,
      returnUrl: '/booking/metro/search'
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
      case 'booking-type':
        return (
          <div className="space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-6 text-white">Select Booking Type</h3>
              
              <RadioGroup value={bookingType} onValueChange={(v) => handleBookingTypeChange(v as 'journey' | 'recharge')}>
                <div className="space-y-4">
                  <div 
                    className={cn(
                      "flex items-start space-x-4 border p-6 transition-all cursor-pointer",
                      bookingType === 'journey' 
                        ? "bg-white/10 border-white" 
                        : "bg-white/5 border-white/20 hover:border-white/40"
                    )}
                    onClick={() => handleBookingTypeChange('journey')}
                  >
                    <RadioGroupItem value="journey" id="journey" className="border-white/40 text-white mt-1" data-testid="radio-booking-journey" />
                    <div className="flex-1">
                      <Label htmlFor="journey" className="cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <Ticket className="h-5 w-5 text-white/80" />
                          <p className="text-white font-light text-lg">Journey Ticket</p>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Book metro tickets for your journey. Select source and destination stations.
                        </p>
                      </Label>
                    </div>
                  </div>

                  <div 
                    className={cn(
                      "flex items-start space-x-4 border p-6 transition-all cursor-pointer",
                      bookingType === 'recharge' 
                        ? "bg-white/10 border-white" 
                        : "bg-white/5 border-white/20 hover:border-white/40"
                    )}
                    onClick={() => handleBookingTypeChange('recharge')}
                  >
                    <RadioGroupItem value="recharge" id="recharge" className="border-white/40 text-white mt-1" data-testid="radio-booking-recharge" />
                    <div className="flex-1">
                      <Label htmlFor="recharge" className="cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <Wallet className="h-5 w-5 text-white/80" />
                          <p className="text-white font-light text-lg">Metro Card Recharge</p>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Recharge your metro card with bonus offers. Quick and convenient.
                        </p>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'journey-details':
        if (bookingType === 'journey') {
          return (
            <div className="space-y-6">
              <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                  <Train className="h-5 w-5" />
                  Select Journey Route
                </h3>

                {/* From Station */}
                <div className="space-y-2 mb-6">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    FROM STATION
                  </Label>
                  <Popover open={showFromPopover} onOpenChange={setShowFromPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                          !fromStation && "text-white/50"
                        )}
                        data-testid="button-from-station"
                      >
                        {selectedFromStation ? (
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-light">{selectedFromStation.code}</span>
                              <span className="text-xs text-white/60">{selectedFromStation.name}</span>
                            </div>
                            <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none mt-1">
                              {METRO_LINES.find(l => l.id === selectedFromStation.line)?.name}
                            </Badge>
                          </div>
                        ) : (
                          <>
                            <MapPin className="mr-2 h-4 w-4" />
                            <span className="font-light">Select departure station</span>
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                      <Input
                        placeholder="Search stations..."
                        value={fromSearch}
                        onChange={(e) => setFromSearch(e.target.value)}
                        className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                        data-testid="input-from-search"
                      />
                      <div className="max-h-64 overflow-y-auto">
                        {filteredFromStations.map((station) => (
                          <button
                            key={station.id}
                            onClick={() => {
                              setFromStation(station.id);
                              setFromSearch("");
                              setShowFromPopover(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                            data-testid={`option-from-${station.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-light text-white">{station.name}</div>
                                <div className="text-xs text-white/60 font-light">
                                  {METRO_LINES.find(l => l.id === station.line)?.name}
                                </div>
                              </div>
                              <div className="text-lg font-light text-white/80">{station.code}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={swapStations}
                    disabled={!fromStation || !toStation}
                    className="bg-white/10 text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                    data-testid="button-swap"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>
                </div>

                {/* To Station */}
                <div className="space-y-2 mb-6">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    TO STATION
                  </Label>
                  <Popover open={showToPopover} onOpenChange={setShowToPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                          !toStation && "text-white/50"
                        )}
                        data-testid="button-to-station"
                      >
                        {selectedToStation ? (
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-light">{selectedToStation.code}</span>
                              <span className="text-xs text-white/60">{selectedToStation.name}</span>
                            </div>
                            <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none mt-1">
                              {METRO_LINES.find(l => l.id === selectedToStation.line)?.name}
                            </Badge>
                          </div>
                        ) : (
                          <>
                            <MapPin className="mr-2 h-4 w-4" />
                            <span className="font-light">Select arrival station</span>
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                      <Input
                        placeholder="Search stations..."
                        value={toSearch}
                        onChange={(e) => setToSearch(e.target.value)}
                        className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                        data-testid="input-to-search"
                      />
                      <div className="max-h-64 overflow-y-auto">
                        {filteredToStations.map((station) => (
                          <button
                            key={station.id}
                            onClick={() => {
                              setToStation(station.id);
                              setToSearch("");
                              setShowToPopover(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                            data-testid={`option-to-${station.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-light text-white">{station.name}</div>
                                <div className="text-xs text-white/60 font-light">
                                  {METRO_LINES.find(l => l.id === station.line)?.name}
                                </div>
                              </div>
                              <div className="text-lg font-light text-white/80">{station.code}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Number of Tickets */}
                <div className="space-y-2">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    NUMBER OF TICKETS
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                      disabled={numberOfTickets <= 1}
                      className="h-12 w-12 p-0 rounded-none bg-white/5 border-white/20"
                      data-testid="button-tickets-decrease"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-light text-white" data-testid="text-tickets-count">{numberOfTickets}</span>
                      <p className="text-xs text-white/60">Ticket{numberOfTickets !== 1 ? 's' : ''}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNumberOfTickets(Math.min(6, numberOfTickets + 1))}
                      disabled={numberOfTickets >= 6}
                      className="h-12 w-12 p-0 rounded-none bg-white/5 border-white/20"
                      data-testid="button-tickets-increase"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {fromStation && toStation && (
                  <div className="mt-6 p-4 bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Fare per ticket</span>
                      <span className="text-white text-lg font-light">{formatCurrency(calculateFare())}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Metro Card Recharge
                </h3>

                {/* Card Number */}
                <div className="space-y-2 mb-6">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">
                    METRO CARD NUMBER
                  </Label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter your 16-digit card number"
                    maxLength={16}
                    className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 text-lg font-light focus:border-white"
                    data-testid="input-card-number"
                  />
                </div>

                {/* Recharge Amount Options */}
                <div className="space-y-3 mb-6">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">
                    SELECT AMOUNT
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {RECHARGE_AMOUNTS.map((option) => (
                      <button
                        key={option.amount}
                        onClick={() => {
                          setSelectedRechargeAmount(option.amount);
                          setCustomAmount('');
                        }}
                        className={cn(
                          "p-4 border transition-all text-left",
                          selectedRechargeAmount === option.amount
                            ? "bg-white/10 border-white"
                            : "bg-white/5 border-white/20 hover:border-white/40"
                        )}
                        data-testid={`button-recharge-${option.amount}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-light">{option.label}</span>
                          {option.bonus > 0 && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-none text-xs">
                              +{formatCurrency(option.bonus)}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label className="text-xs text-white/60 uppercase tracking-widest font-light">
                    OR ENTER CUSTOM AMOUNT
                  </Label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedRechargeAmount(null);
                    }}
                    placeholder="Minimum ₹50"
                    min={50}
                    className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 text-lg font-light focus:border-white"
                    data-testid="input-custom-amount"
                  />
                </div>

                {(selectedRechargeAmount || customAmount) && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Recharge Amount</span>
                        <span className="text-white text-lg font-light">
                          {formatCurrency(selectedRechargeAmount || parseInt(customAmount) || 0)}
                        </span>
                      </div>
                      {totalBonus > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-green-400/80 text-sm">Bonus Amount</span>
                          <span className="text-green-400 text-lg font-light">+{formatCurrency(totalBonus)}</span>
                        </div>
                      )}
                      <div className="h-px bg-white/20 my-2"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-light">Total Credit</span>
                        <span className="text-white text-xl font-light">
                          {formatCurrency((selectedRechargeAmount || parseInt(customAmount) || 0) + totalBonus)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

      case 'contact-details':
        return (
          <div className="space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-widest font-light mb-2 block">Email Address</Label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 focus:border-white"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-widest font-light mb-2 block">Phone Number</Label>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 focus:border-white"
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-white/5 border border-white/10">
                <p className="text-xs text-white/60 font-light">
                  Your contact details will be used for booking confirmation and updates.
                </p>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Select Payment Method
              </h3>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div 
                    className={cn(
                      "flex items-center space-x-3 border p-4 transition-all cursor-pointer",
                      paymentMethod === 'upi' 
                        ? "bg-white/10 border-white" 
                        : "bg-white/5 border-white/20 hover:border-white/40"
                    )}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <RadioGroupItem value="upi" id="upi" className="border-white/40 text-white" data-testid="radio-payment-upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-white font-light">UPI</p>
                          <p className="text-xs text-white/60">Pay using UPI ID or QR</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div 
                    className={cn(
                      "flex items-center space-x-3 border p-4 transition-all cursor-pointer",
                      paymentMethod === 'card' 
                        ? "bg-white/10 border-white" 
                        : "bg-white/5 border-white/20 hover:border-white/40"
                    )}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <RadioGroupItem value="card" id="card" className="border-white/40 text-white" data-testid="radio-payment-card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-white font-light">Debit/Credit Card</p>
                          <p className="text-xs text-white/60">Visa, Mastercard, Rupay</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div 
                    className={cn(
                      "flex items-center space-x-3 border p-4 transition-all cursor-pointer",
                      paymentMethod === 'netbanking' 
                        ? "bg-white/10 border-white" 
                        : "bg-white/5 border-white/20 hover:border-white/40"
                    )}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <RadioGroupItem value="netbanking" id="netbanking" className="border-white/40 text-white" data-testid="radio-payment-netbanking" />
                    <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-white font-light">Net Banking</p>
                          <p className="text-xs text-white/60">All major banks supported</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {paymentMethod === 'upi' && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 font-light">
                    You'll be redirected to UPI payment page where you can enter your UPI ID or use QR code.
                  </p>
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
            onClick={() => navigate('/booking/metro/search')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">METRO BOOKING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {bookingType === 'journey' ? 'Journey Ticket' : 'Card Recharge'}
            </p>
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
                <span className="text-white/60 text-sm">
                  {bookingType === 'journey' ? 'Fare' : 'Amount'}
                </span>
                <span className="text-sm font-light text-white">{formatCurrency(basePrice)}</span>
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
              <span className="text-white/60 text-sm">
                {bookingType === 'journey' ? 'Total Fare' : 'Total Amount'}
              </span>
              <span className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</span>
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
              {currentStageIndex === BOOKING_STAGES.length - 1 ? 'Proceed to Payment' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
