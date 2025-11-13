import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  ArrowRight,
  Film,
  CheckCircle,
  Users,
  Popcorn,
  MapPin,
  User,
  Calendar,
  Star,
  Clock,
  Monitor,
  Building2,
  Phone,
  UserCircle,
  Ticket,
  Crown,
  Sparkles,
  Info,
  X,
  CreditCard,
  Car,
  UtensilsCrossed,
  Accessibility,
  Volume2,
  Armchair,
  ExternalLink,
  Smartphone,
  Wallet,
  Plus,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import type { Movie } from "@shared/schema";

interface TheaterData {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  contact: string;
  screens: number;
  totalSeats: number;
  buildYear: number;
  facilities: {
    parking: boolean;
    food_court: boolean;
    wheelchair_access: boolean;
    "3d_screen": boolean;
    dolby_atmos: boolean;
  };
  amenities: {
    ac: boolean;
    recliner_seats: boolean;
    premium_seats: boolean;
    valet_parking: boolean;
  };
  otherMovies: string[];
}

interface ShowtimeData {
  id: string;
  time: string;
  format: string;
  screen: string;
  price: number;
  movieId: string;
  theaterId: string;
}

interface SeatSelection {
  row: number;
  seat: string;
  category: 'diamond' | 'gold' | 'standard';
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
    id: 'theater-details',
    title: 'Theater Information',
    shortTitle: 'Theater',
    icon: Building2,
    description: 'Review theater and show details'
  },
  {
    id: 'seat-selection',
    title: 'Seat Selection',
    shortTitle: 'Seats',
    icon: Users,
    description: 'Choose your preferred seats'
  },
  {
    id: 'fnb-selection',
    title: 'Food & Beverages',
    shortTitle: 'F&B',
    icon: Popcorn,
    description: 'Add snacks and beverages'
  },
  {
    id: 'contact-info',
    title: 'Contact Information',
    shortTitle: 'Contact',
    icon: UserCircle,
    description: 'Enter your contact details'
  },
  {
    id: 'final',
    title: 'Final Summary',
    shortTitle: 'Final',
    icon: Ticket,
    description: 'Review your booking details'
  },
  {
    id: 'payment',
    title: 'Payment Method',
    shortTitle: 'Payment',
    icon: CreditCard,
    description: 'Select payment method and pay'
  }
];

const FNB_OPTIONS = [
  { id: 'none', name: 'No F&B', price: 0 },
  { id: 'popcorn-small', name: 'Small Popcorn', price: 150 },
  { id: 'popcorn-large', name: 'Large Popcorn', price: 250 },
  { id: 'combo1', name: 'Popcorn + Coke Combo', price: 320 },
  { id: 'combo2', name: 'Nachos + Pepsi Combo', price: 280 },
  { id: 'icecream', name: 'Ice Cream', price: 100 }
];

// Mock theater data
const getMockTheater = (id: string): TheaterData => {
  const theaters: Record<string, TheaterData> = {
    "1": {
      id: "1",
      name: "PVR Cinemas - Phoenix Mall",
      area: "Whitefield",
      city: "Bangalore",
      address: "Phoenix Marketcity, Whitefield Main Road",
      contact: "+91 1800-258-4567",
      screens: 8,
      totalSeats: 1450,
      buildYear: 2018,
      facilities: {
        parking: true,
        food_court: true,
        wheelchair_access: true,
        "3d_screen": true,
        dolby_atmos: true
      },
      amenities: {
        ac: true,
        recliner_seats: true,
        premium_seats: true,
        valet_parking: true
      },
      otherMovies: ["Pushpa 2", "Game Changer", "Kalki 2898 AD"]
    },
    "2": {
      id: "2",
      name: "INOX - Forum Mall",
      area: "Koramangala",
      city: "Bangalore",
      address: "Forum Mall, 21 Hosur Road",
      contact: "+91 1800-111-0008",
      screens: 6,
      totalSeats: 980,
      buildYear: 2015,
      facilities: {
        parking: true,
        food_court: true,
        wheelchair_access: true,
        "3d_screen": true,
        dolby_atmos: false
      },
      amenities: {
        ac: true,
        recliner_seats: false,
        premium_seats: true,
        valet_parking: false
      },
      otherMovies: ["Salaar", "Animal", "Dunki"]
    },
    "3": {
      id: "3",
      name: "Cinepolis - Royal Meenakshi Mall",
      area: "Bannerghatta Road",
      city: "Bangalore",
      address: "Royal Meenakshi Mall, Bannerghatta Road",
      contact: "+91 1800-102-2555",
      screens: 10,
      totalSeats: 1850,
      buildYear: 2020,
      facilities: {
        parking: true,
        food_court: true,
        wheelchair_access: true,
        "3d_screen": true,
        dolby_atmos: true
      },
      amenities: {
        ac: true,
        recliner_seats: true,
        premium_seats: true,
        valet_parking: true
      },
      otherMovies: ["Jawan", "Pathaan", "Tiger 3"]
    }
  };
  return theaters[id] || theaters["1"];
};

// Mock showtime data
const getMockShowtime = (id: string): ShowtimeData => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const times = ["09:00 AM", "12:30 PM", "03:45 PM", "06:15 PM", "09:30 PM"];
  const formats = ["2D", "3D", "4DX", "IMAX"];
  
  return {
    id: id,
    time: times[seed % times.length],
    format: formats[seed % formats.length],
    screen: `Screen ${(seed % 8) + 1}`,
    price: 250 + (seed % 200),
    movieId: "",
    theaterId: ""
  };
};

// Seat prices by category
const SEAT_PRICES = {
  diamond: 500,
  gold: 350,
  standard: 250
};

export default function MovieBookingComprehensive() {
  const { date, id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(window.location.search);
  const showtimeId = params.get('showtimeId') || '1';
  const theaterId = params.get('theaterId') || '1';

  // Fetch real movie data from API
  const { data: movieData, isLoading: movieLoading } = useQuery<{ success: boolean; movie: Movie }>({
    queryKey: ["/api/movies", id],
  });

  const movie = movieData?.movie;
  const theater = getMockTheater(theaterId);
  const showtime = getMockShowtime(showtimeId);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Booking selections
  const [selectedFnb, setSelectedFnb] = useState('none');
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  
  // Contact details
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Payment details
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
  
  // Theater info popup
  const [showTheaterInfo, setShowTheaterInfo] = useState(false);
  
  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  // Calculate total price
  const fnbPrice = FNB_OPTIONS.find(f => f.id === selectedFnb)?.price || 0;
  const seatsPrice = selectedSeats.reduce((sum, seat) => sum + SEAT_PRICES[seat.category], 0);
  const convenienceFee = selectedSeats.length * 20;
  const basePrice = seatsPrice + fnbPrice + convenienceFee;

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

    // Validate contact info
    if (currentStage.id === 'contact-info') {
      if (!contactName || !contactEmail || !contactPhone) {
        toast({
          title: "Contact Details Required",
          description: "Please fill in all contact information",
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

  const handleSeatClick = (row: number, seat: string, category: 'diamond' | 'gold' | 'standard') => {
    const existingSeat = selectedSeats.find(s => s.row === row && s.seat === seat);

    if (existingSeat) {
      setSelectedSeats(selectedSeats.filter(s => !(s.row === row && s.seat === seat)));
    } else {
      if (selectedSeats.length >= 10) {
        toast({
          title: "Maximum Seats Selected",
          description: "You can select up to 10 seats",
          variant: "destructive"
        });
        return;
      }
      setSelectedSeats([...selectedSeats, { row, seat, category }]);
    }
  };

  const isSeatSelected = (row: number, seat: string) => {
    return selectedSeats.some(s => s.row === row && s.seat === seat);
  };

  const isSeatOccupied = (row: number, seat: string) => {
    // Simulate some occupied seats
    return (row + seat.charCodeAt(0)) % 7 === 0;
  };

  // Generate theater-style seat layout with categories
  const generateTheaterSeats = () => {
    const seats = [];
    
    // Diamond section (rows 1-3, curved)
    for (let row = 1; row <= 3; row++) {
      const seatCount = row === 1 ? 6 : row === 2 ? 8 : 10;
      const startLetter = row === 1 ? 'C' : row === 2 ? 'B' : 'A';
      const rowSeats = [];
      for (let i = 0; i < seatCount; i++) {
        rowSeats.push(String.fromCharCode(startLetter.charCodeAt(0) + i));
      }
      seats.push({ row, seats: rowSeats, category: 'diamond' as const, label: row === 1 ? 'DIAMOND' : '' });
    }
    
    // Gold section (rows 4-8)
    for (let row = 4; row <= 8; row++) {
      const rowSeats = [];
      for (let i = 0; i < 12; i++) {
        rowSeats.push(String.fromCharCode('A'.charCodeAt(0) + i));
      }
      seats.push({ row, seats: rowSeats, category: 'gold' as const, label: row === 4 ? 'GOLD' : '' });
    }
    
    // Standard section (rows 9-15)
    for (let row = 9; row <= 15; row++) {
      const rowSeats = [];
      for (let i = 0; i < 14; i++) {
        rowSeats.push(String.fromCharCode('A'.charCodeAt(0) + i));
      }
      seats.push({ row, seats: rowSeats, category: 'standard' as const, label: row === 9 ? 'STANDARD' : '' });
    }
    
    return seats;
  };

  const seatLayout = generateTheaterSeats();

  const handleProceedToPayment = () => {
    // Validate payment method specific fields - UPI allows direct navigation without ID
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

    // If UPI, redirect to UPI payment page
    if (paymentMethod === 'upi') {
      const upiPaymentParams = new URLSearchParams({
        amount: totalPrice.toString(),
        type: 'movie',
        movieId: id || '1',
        theaterId,
        showtimeId,
        date: date || format(new Date(), "yyyy-MM-dd"),
        seats: JSON.stringify(selectedSeats),
        fnb: selectedFnb,
        contactName,
        contactEmail,
        contactPhone,
        returnUrl: `/movies/${id}`
      });
      navigate(`/upi-payment?${upiPaymentParams.toString()}`);
      return;
    }

    // For card and netbanking, proceed with direct payment simulation
    const bookingData: Record<string, string> = {
      movieId: id || '1',
      theaterId,
      showtimeId,
      date: date || format(new Date(), "yyyy-MM-dd"),
      seats: JSON.stringify(selectedSeats),
      fnb: selectedFnb,
      contactName,
      contactEmail,
      contactPhone,
      amount: totalPrice.toString(),
      type: 'movie'
    };

    // Simulate payment processing
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}`;
      const bookingRef = `MV${Date.now().toString().slice(-8)}`;
      
      const successParams = new URLSearchParams({
        id: transactionId,
        bookingRef: bookingRef,
        type: 'movie',
        amount: totalPrice.toString(),
        seats: selectedSeats.length.toString(),
        passengers: '1'
      });

      navigate(`/transaction-success?${successParams.toString()}`);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (movieLoading || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white/60 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'theater-details':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light tracking-wider text-white flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Movie Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/movies/${id}`)}
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
                  data-testid="button-view-movie-details"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Title</Label>
                    <p className="text-white text-base mt-1">{movie.title}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Rating</Label>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <Star className="h-4 w-4 fill-white text-white" />
                      <p className="text-white text-base">{movie.imdbRating}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Language</Label>
                    <p className="text-white text-base mt-1">{movie.language}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Duration</Label>
                    <p className="text-white text-base mt-1">{movie.duration} min</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTheaterInfo(true)}
                className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
                data-testid="button-theater-info"
              >
                <Info className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2 pr-10">
                <Building2 className="h-5 w-5" />
                Theater & Show Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Theater</Label>
                    <p className="text-white text-base mt-1">{theater.name}</p>
                    <p className="text-white/40 text-sm">{theater.area}, {theater.city}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Contact</Label>
                    <p className="text-white text-base mt-1 flex items-center justify-end gap-1">
                      <Phone className="h-3 w-3" />
                      {theater.contact}
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Date</Label>
                    <p className="text-white text-base mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {date ? format(new Date(date), "dd MMM yyyy") : "Today"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Time</Label>
                    <p className="text-white text-base mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {showtime.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Screen</Label>
                    <p className="text-white text-base mt-1 flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      {showtime.screen}
                    </p>
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Format</Label>
                    <div className="text-white text-base mt-1">
                      <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                        {showtime.format}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'seat-selection':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 mb-6">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-light tracking-wider text-white">Select Your Seats</h3>
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
                {/* Screen */}
                <div className="mb-8">
                  <div className="h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-2"></div>
                  <div className="flex items-center justify-center gap-2 text-white/40 text-sm font-light tracking-widest">
                    <Monitor className="h-4 w-4" />
                    <span>SCREEN THIS SIDE</span>
                  </div>
                </div>

                {/* Seat Layout */}
                <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <div className="space-y-4">
                    {seatLayout.map((row, idx) => (
                      <div key={row.row}>
                        {row.label && (
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-px bg-white/20 flex-1"></div>
                            <div className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider">
                              {row.category === 'diamond' && <Crown className="h-3 w-3" />}
                              {row.category === 'gold' && <Sparkles className="h-3 w-3" />}
                              <span>{row.label}</span>
                              <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px]">
                                {formatCurrency(SEAT_PRICES[row.category])}
                              </Badge>
                            </div>
                            <div className="h-px bg-white/20 flex-1"></div>
                          </div>
                        )}
                        <div className="flex justify-center">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 flex items-center justify-center text-sm text-white/40 font-light">
                              {row.row}
                            </div>
                            <div className={`flex gap-1.5 ${row.category === 'diamond' ? 'justify-center' : ''}`}>
                              {row.seats.map((seat) => {
                                const selected = isSeatSelected(row.row, seat);
                                const occupied = isSeatOccupied(row.row, seat);
                                
                                return (
                                  <button
                                    key={seat}
                                    onClick={() => !occupied && handleSeatClick(row.row, seat, row.category)}
                                    disabled={occupied}
                                    className={`w-8 h-8 border transition-all font-light text-xs rounded-sm ${
                                      selected
                                        ? 'bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30'
                                        : occupied
                                        ? 'bg-white/5 border-white/20 text-white/20 cursor-not-allowed'
                                        : row.category === 'diamond'
                                        ? 'bg-purple-500/10 border-purple-500/30 text-white/60 hover:bg-purple-500/20 hover:border-purple-500/50'
                                        : row.category === 'gold'
                                        ? 'bg-yellow-500/10 border-yellow-500/30 text-white/60 hover:bg-yellow-500/20 hover:border-yellow-500/50'
                                        : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20 hover:border-white/50'
                                    }`}
                                    data-testid={`seat-${row.row}${seat}`}
                                  >
                                    {seat}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Seats Summary */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Selected Seats:</span>
                    <span className="text-white font-light">
                      {selectedSeats.length > 0 
                        ? selectedSeats.map(s => `${s.row}${s.seat}`).join(', ')
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'fnb-selection':
        return (
          <div className="space-y-3">
            {FNB_OPTIONS.map((fnb) => (
              <button
                key={fnb.id}
                onClick={() => setSelectedFnb(fnb.id)}
                className={`w-full p-4 border-b transition-all text-left ${
                  selectedFnb === fnb.id
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
                data-testid={`fnb-option-${fnb.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-light tracking-wider transition-opacity ${
                    selectedFnb === fnb.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                  }`}>
                    {fnb.name}
                  </p>
                  <Badge className={`rounded-none border font-light text-xs ${
                    selectedFnb === fnb.id 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-white/10 text-white/60 border-white/20'
                  }`}>
                    {fnb.price === 0 ? 'Skip' : formatCurrency(fnb.price)}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        );

      case 'contact-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Full Name</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-contact-email"
                />
              </div>
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Mobile Number</Label>
              <Input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="9876543210"
                className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                data-testid="input-contact-phone"
              />
            </div>
          </div>
        );

      case 'final':
        return (
          <div className="space-y-6">
            {/* Movie & Theater Summary */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <Film className="h-4 w-4" />
                Booking Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Movie</p>
                    <p className="text-white font-light mt-1">{movie.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{movie.language} • {movie.rating}</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    {showtime.format}
                  </Badge>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Theater</p>
                    <p className="text-white font-light mt-1">{theater.name}</p>
                    <p className="text-white/60 text-xs mt-0.5">{theater.area}, {theater.city}</p>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Date</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {date ? format(new Date(date), "dd MMM yyyy") : "Today"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Time</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {showtime.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <Users className="h-4 w-4" />
                Selected Seats
              </h3>
              <div className="space-y-3">
                {selectedSeats.filter(s => s.category === 'diamond').length > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-white/60" />
                      <span className="text-white/80">Diamond ({selectedSeats.filter(s => s.category === 'diamond').length})</span>
                    </div>
                    <span className="text-white font-light">{formatCurrency(selectedSeats.filter(s => s.category === 'diamond').length * SEAT_PRICES.diamond)}</span>
                  </div>
                )}
                {selectedSeats.filter(s => s.category === 'gold').length > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-white/60" />
                      <span className="text-white/80">Gold ({selectedSeats.filter(s => s.category === 'gold').length})</span>
                    </div>
                    <span className="text-white font-light">{formatCurrency(selectedSeats.filter(s => s.category === 'gold').length * SEAT_PRICES.gold)}</span>
                  </div>
                )}
                {selectedSeats.filter(s => s.category === 'standard').length > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-white/60" />
                      <span className="text-white/80">Standard ({selectedSeats.filter(s => s.category === 'standard').length})</span>
                    </div>
                    <span className="text-white font-light">{formatCurrency(selectedSeats.filter(s => s.category === 'standard').length * SEAT_PRICES.standard)}</span>
                  </div>
                )}
                <Separator className="bg-white/10" />
                <div className="text-sm text-white/60">
                  Seats: {selectedSeats.map(s => `${s.row}${s.seat}`).join(', ')}
                </div>
              </div>
            </div>

            {/* F&B Selection */}
            {fnbPrice > 0 && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
                <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                  <Popcorn className="h-4 w-4" />
                  Food & Beverages
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">{FNB_OPTIONS.find(f => f.id === selectedFnb)?.name}</span>
                  <span className="text-white font-light">{formatCurrency(fnbPrice)}</span>
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Name</span>
                  <span className="text-white font-light">{contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Email</span>
                  <span className="text-white font-light">{contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Phone</span>
                  <span className="text-white font-light">{contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Final Amount */}
            <div className="bg-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span>Ticket Amount</span>
                  <span className="font-light">{formatCurrency(seatsPrice)}</span>
                </div>
                {fnbPrice > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span>F&B Amount</span>
                    <span className="font-light">{formatCurrency(fnbPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span>Convenience Fee</span>
                  <span className="font-light">{formatCurrency(convenienceFee)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-white text-xl">
                  <span className="font-light">Total Amount</span>
                  <span className="font-bold">{formatCurrency(totalPrice)}</span>
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
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
            />

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Base Price</span>
                  <span className="font-light">{formatCurrency(basePrice)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-light">- {formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm uppercase tracking-wider">Total Amount</span>
                  <span className="text-white text-2xl font-light" data-testid="text-payment-total">{formatCurrency(totalPrice)}</span>
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
              onClick={() => navigate("/movies")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">MOVIE BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{theater.name}</p>
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
        {/* Movie Info Card - Moved below progress */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{movie.title}</p>
                <p className="text-white/60 text-xs">{movie.language} • {movie.rating}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{date ? format(new Date(date), "dd MMM") : "Today"}</p>
              <p className="text-white/60 text-xs">{showtime.time}</p>
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
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Diamond Seats ({selectedSeats.filter(s => s.category === 'diamond').length})</span>
                  <span className="font-light">{formatCurrency(selectedSeats.filter(s => s.category === 'diamond').length * SEAT_PRICES.diamond)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Gold Seats ({selectedSeats.filter(s => s.category === 'gold').length})</span>
                  <span className="font-light">{formatCurrency(selectedSeats.filter(s => s.category === 'gold').length * SEAT_PRICES.gold)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Standard Seats ({selectedSeats.filter(s => s.category === 'standard').length})</span>
                  <span className="font-light">{formatCurrency(selectedSeats.filter(s => s.category === 'standard').length * SEAT_PRICES.standard)}</span>
                </div>
              </>
            )}
            {fnbPrice > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">F&B</span>
                <span className="font-light">{formatCurrency(fnbPrice)}</span>
              </div>
            )}
            {selectedSeats.length > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Convenience Fee</span>
                <span className="font-light">{formatCurrency(convenienceFee)}</span>
              </div>
            )}
            {appliedCoupon && couponDiscount > 0 && (
              <div className="flex justify-between text-green-400">
                <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                <span className="font-light">- {formatCurrency(couponDiscount)}</span>
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
              <p className="text-xs text-white/60 font-light">{movie.title}</p>
              <p className="text-sm text-white font-light">{date ? format(new Date(date), "dd MMM yyyy") : "Today"} • {showtime.time}</p>
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
                PAY {formatCurrency(totalPrice)}
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

      {/* Theater Information Popup */}
      <Dialog open={showTheaterInfo} onOpenChange={setShowTheaterInfo}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Theater Information
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Theater Name & Location */}
            <div className="border border-white/20 p-4 bg-white/5">
              <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-3">Theater Details</h3>
              <div className="space-y-2">
                <p className="text-white font-light text-lg">{theater.name}</p>
                <div className="flex items-start gap-2 text-white/80">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{theater.address}</p>
                    <p className="text-sm text-white/60">{theater.area}, {theater.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Phone className="h-4 w-4" />
                  <p>{theater.contact}</p>
                </div>
              </div>
            </div>

            {/* Theater Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/20 p-4 bg-white/5">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Total Screens</p>
                <p className="text-2xl font-light text-white">{theater.screens}</p>
              </div>
              <div className="border border-white/20 p-4 bg-white/5">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Total Seats</p>
                <p className="text-2xl font-light text-white">{theater.totalSeats}</p>
              </div>
              <div className="border border-white/20 p-4 bg-white/5 col-span-2">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Established</p>
                <p className="text-2xl font-light text-white">{theater.buildYear}</p>
              </div>
            </div>

            {/* Facilities */}
            <div className="border border-white/20 p-4 bg-white/5">
              <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-3">Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {theater.facilities.parking && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Car className="h-4 w-4 text-white/60" />
                    <span>Parking Available</span>
                  </div>
                )}
                {theater.facilities.food_court && (
                  <div className="flex items-center gap-2 text-white/80">
                    <UtensilsCrossed className="h-4 w-4 text-white/60" />
                    <span>Food Court</span>
                  </div>
                )}
                {theater.facilities.wheelchair_access && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Accessibility className="h-4 w-4 text-white/60" />
                    <span>Wheelchair Access</span>
                  </div>
                )}
                {theater.facilities["3d_screen"] && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Monitor className="h-4 w-4 text-white/60" />
                    <span>3D Screens</span>
                  </div>
                )}
                {theater.facilities.dolby_atmos && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Volume2 className="h-4 w-4 text-white/60" />
                    <span>Dolby Atmos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="border border-white/20 p-4 bg-white/5">
              <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {theater.amenities.ac && (
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="h-4 w-4 text-white/60" />
                    <span>Air Conditioned</span>
                  </div>
                )}
                {theater.amenities.recliner_seats && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Armchair className="h-4 w-4 text-white/60" />
                    <span>Recliner Seats</span>
                  </div>
                )}
                {theater.amenities.premium_seats && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Crown className="h-4 w-4 text-white/60" />
                    <span>Premium Seats</span>
                  </div>
                )}
                {theater.amenities.valet_parking && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Car className="h-4 w-4 text-white/60" />
                    <span>Valet Parking</span>
                  </div>
                )}
              </div>
            </div>

            {/* Now Showing */}
            {theater.otherMovies && theater.otherMovies.length > 0 && (
              <div className="border border-white/20 p-4 bg-white/5">
                <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-3">Now Showing</h3>
                <div className="flex flex-wrap gap-2">
                  {theater.otherMovies.map((movieTitle, idx) => (
                    <Badge key={idx} className="bg-white/10 text-white border-white/20 rounded-none">
                      {movieTitle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
