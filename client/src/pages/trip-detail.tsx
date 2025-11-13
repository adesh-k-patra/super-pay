import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import QRCode from "react-qr-code";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { 
  ArrowLeft,
  Plane, 
  Bus, 
  Train, 
  Calendar, 
  Clock, 
  MapPin,
  Download,
  RefreshCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Hotel,
  Utensils,
  Car as CarIcon,
  User,
  Share2,
  CreditCard,
  FileText,
  Mail,
  Phone,
  Film,
  PartyPopper,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  category: "hotel" | "food" | "transport" | "other";
  description: string;
  amount: number;
  date: string;
}

interface Trip {
  id: string;
  type: "flight" | "bus" | "train" | "taxi" | "rental" | "hotel" | "movie" | "event" | "metro";
  reference: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  operator: string;
  route: string;
  date: string;
  time: string;
  duration: string;
  passengers: number;
  amount: number;
  status: "completed" | "upcoming" | "cancelled";
  seat?: string;
  class: string;
  fareBreakdown: {
    baseFare: number;
    taxes: number;
    convenienceFee: number;
  };
  expenses?: Expense[];
  bookingDate?: string;
  passengerDetails?: {
    name: string;
    age: number;
    gender: string;
  }[];
  contactDetails?: {
    email: string;
    phone: string;
  };
  // Movie/Event specific
  movieName?: string;
  theater?: string;
  screen?: string;
  showtime?: string;
  eventName?: string;
  venue?: string;
  // Hotel specific
  hotelName?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  // Rental specific
  vehicleType?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

// Mock data - in real app this would come from API
const mockTrips: { [key: string]: Trip } = {
  "1": {
    id: "1",
    type: "flight",
    reference: "FL2025-001",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Delhi",
    toCode: "DEL",
    operator: "IndiGo",
    route: "6E-234",
    date: "2024-12-15",
    time: "01:50",
    duration: "2h 30m",
    passengers: 1,
    amount: 8500,
    status: "upcoming",
    seat: "12A",
    class: "Economy",
    fareBreakdown: {
      baseFare: 7200,
      taxes: 1150,
      convenienceFee: 150
    },
    bookingDate: "2024-11-20",
    passengerDetails: [
      { name: "John Doe", age: 32, gender: "Male" }
    ],
    contactDetails: {
      email: "john.doe@email.com",
      phone: "+91 98765 43210"
    }
  },
  "2": {
    id: "2",
    type: "train",
    reference: "TR2025-045",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Jaipur",
    toCode: "JP",
    operator: "Indian Railways",
    route: "Shatabdi Express",
    date: "2024-12-08",
    time: "06:00",
    duration: "4h 30m",
    passengers: 1,
    amount: 650,
    status: "upcoming",
    seat: "A1-45",
    class: "AC Chair Car",
    fareBreakdown: {
      baseFare: 560,
      taxes: 60,
      convenienceFee: 30
    },
    bookingDate: "2024-11-28",
    passengerDetails: [
      { name: "Jane Smith", age: 28, gender: "Female" }
    ],
    contactDetails: {
      email: "jane.smith@email.com",
      phone: "+91 98765 43211"
    }
  },
  "3": {
    id: "3",
    type: "bus",
    reference: "BUS2025-789",
    from: "Bangalore",
    fromCode: "BLR",
    to: "Chennai",
    toCode: "CHN",
    operator: "VRL Travels",
    route: "VRL-456",
    date: "2024-12-03",
    time: "23:30",
    duration: "6h 45m",
    passengers: 1,
    amount: 950,
    status: "completed",
    seat: "15A",
    class: "Sleeper",
    fareBreakdown: {
      baseFare: 850,
      taxes: 70,
      convenienceFee: 30
    },
    bookingDate: "2024-11-25",
    expenses: [
      { id: "exp-1", category: "food", description: "Breakfast", amount: 200, date: "2024-12-04" }
    ],
    passengerDetails: [
      { name: "Alex Kumar", age: 35, gender: "Male" }
    ],
    contactDetails: {
      email: "alex.kumar@email.com",
      phone: "+91 98765 43212"
    }
  },
  "4": {
    id: "4",
    type: "taxi",
    reference: "CAB2025-456",
    from: "Pune Airport",
    fromCode: "PNQ",
    to: "Koregaon Park",
    toCode: "KP",
    operator: "Uber",
    route: "Premier",
    date: "2024-12-06",
    time: "14:20",
    duration: "45m",
    passengers: 1,
    amount: 450,
    status: "upcoming",
    class: "Premium",
    fareBreakdown: {
      baseFare: 380,
      taxes: 50,
      convenienceFee: 20
    },
    bookingDate: "2024-12-05",
    passengerDetails: [
      { name: "Sarah Lee", age: 29, gender: "Female" }
    ],
    contactDetails: {
      email: "sarah.lee@email.com",
      phone: "+91 98765 43213"
    }
  },
  "5": {
    id: "5",
    type: "hotel",
    reference: "HT2025-123",
    from: "Check-in",
    fromCode: "GOA",
    to: "Check-out",
    toCode: "GOA",
    operator: "Goa Beach Resort",
    route: "Luxury Resort",
    date: "2024-12-20",
    time: "14:00",
    duration: "3 nights",
    passengers: 2,
    amount: 12500,
    status: "upcoming",
    class: "Deluxe Room",
    hotelName: "Goa Beach Resort",
    roomType: "Deluxe Sea View Room",
    checkIn: "2024-12-20",
    checkOut: "2024-12-23",
    nights: 3,
    fareBreakdown: {
      baseFare: 10800,
      taxes: 1500,
      convenienceFee: 200
    },
    bookingDate: "2024-11-28",
    passengerDetails: [
      { name: "Mike Wilson", age: 42, gender: "Male" },
      { name: "Emily Wilson", age: 38, gender: "Female" }
    ],
    contactDetails: {
      email: "mike.wilson@email.com",
      phone: "+91 98765 43214"
    }
  },
  "6": {
    id: "6",
    type: "movie",
    reference: "MV2025-789",
    from: "PVR Cinemas Phoenix",
    fromCode: "PHX",
    to: "PVR Cinemas Phoenix",
    toCode: "PHX",
    operator: "PVR Cinemas",
    route: "Screen 2",
    date: "2024-12-07",
    time: "19:30",
    duration: "2h 30m",
    passengers: 1,
    amount: 1200,
    status: "upcoming",
    seat: "F12, F13, F14",
    class: "Recliner",
    movieName: "Avatar: The Way of Water",
    theater: "PVR Phoenix",
    screen: "Screen 2",
    showtime: "19:30",
    fareBreakdown: {
      baseFare: 1050,
      taxes: 120,
      convenienceFee: 30
    },
    bookingDate: "2024-12-02",
    passengerDetails: [
      { name: "David Brown", age: 26, gender: "Male" }
    ],
    contactDetails: {
      email: "david.brown@email.com",
      phone: "+91 98765 43215"
    }
  },
  "7": {
    id: "7",
    type: "event",
    reference: "EV2025-234",
    from: "National Stadium",
    fromCode: "NS",
    to: "National Stadium",
    toCode: "NS",
    operator: "BookMyShow",
    route: "General Admission",
    date: "2025-01-05",
    time: "18:00",
    duration: "3h 30m",
    passengers: 1,
    amount: 2500,
    status: "upcoming",
    seat: "GA-456",
    class: "Premium",
    eventName: "Rock Concert Live",
    venue: "National Stadium",
    fareBreakdown: {
      baseFare: 2200,
      taxes: 250,
      convenienceFee: 50
    },
    bookingDate: "2024-12-01",
    passengerDetails: [
      { name: "Lisa Anderson", age: 31, gender: "Female" }
    ],
    contactDetails: {
      email: "lisa.anderson@email.com",
      phone: "+91 98765 43216"
    }
  },
  "8": {
    id: "8",
    type: "metro",
    reference: "MT2025-567",
    from: "Rajiv Chowk",
    fromCode: "RJVC",
    to: "Airport",
    toCode: "IGI",
    operator: "Delhi Metro",
    route: "Yellow Line",
    date: "2024-12-05",
    time: "08:15",
    duration: "35m",
    passengers: 1,
    amount: 80,
    status: "upcoming",
    class: "Standard",
    fareBreakdown: {
      baseFare: 80,
      taxes: 0,
      convenienceFee: 0
    },
    bookingDate: "2024-12-05",
    passengerDetails: [
      { name: "Raj Patel", age: 28, gender: "Male" }
    ],
    contactDetails: {
      email: "raj.patel@email.com",
      phone: "+91 98765 43217"
    }
  },
  "9": {
    id: "9",
    type: "rental",
    reference: "RN2025-890",
    from: "Bangalore Car Rentals",
    fromCode: "BLR",
    to: "Mysore",
    toCode: "MYS",
    operator: "Zoomcar",
    route: "SUV Rental",
    date: "2024-12-10",
    time: "09:00",
    duration: "2 days",
    passengers: 1,
    amount: 3500,
    status: "upcoming",
    class: "SUV",
    vehicleType: "Mahindra XUV500",
    pickupLocation: "Bangalore Car Rentals, Koramangala",
    dropoffLocation: "Mysore City Centre",
    fareBreakdown: {
      baseFare: 3000,
      taxes: 400,
      convenienceFee: 100
    },
    bookingDate: "2024-12-05",
    passengerDetails: [
      { name: "Priya Sharma", age: 30, gender: "Female" }
    ],
    contactDetails: {
      email: "priya.sharma@email.com",
      phone: "+91 98765 43218"
    }
  },
  "10": {
    id: "10",
    type: "flight",
    reference: "FL2025-999",
    from: "Kolkata",
    fromCode: "CCU",
    to: "Mumbai",
    toCode: "BOM",
    operator: "Air India",
    route: "AI-671",
    date: "2024-11-25",
    time: "16:30",
    duration: "2h 45m",
    passengers: 1,
    amount: 7800,
    status: "completed",
    seat: "18C",
    class: "Economy",
    fareBreakdown: {
      baseFare: 6500,
      taxes: 1150,
      convenienceFee: 150
    },
    bookingDate: "2024-11-10",
    passengerDetails: [
      { name: "Amit Gupta", age: 45, gender: "Male" }
    ],
    contactDetails: {
      email: "amit.gupta@email.com",
      phone: "+91 98765 43219"
    }
  },
  "11": {
    id: "11",
    type: "train",
    reference: "TR2025-111",
    from: "Chennai Central",
    fromCode: "MAS",
    to: "Bangalore City",
    toCode: "SBC",
    operator: "Indian Railways",
    route: "Shatabdi Express",
    date: "2024-12-04",
    time: "06:00",
    duration: "5h 30m",
    passengers: 1,
    amount: 580,
    status: "cancelled",
    seat: "B2-23",
    class: "AC Chair Car",
    fareBreakdown: {
      baseFare: 500,
      taxes: 60,
      convenienceFee: 20
    },
    bookingDate: "2024-11-28",
    passengerDetails: [
      { name: "Neha Reddy", age: 27, gender: "Female" }
    ],
    contactDetails: {
      email: "neha.reddy@email.com",
      phone: "+91 98765 43220"
    }
  }
};

export default function TripDetail() {
  const [, navigate] = useLocation();
  const { tripId } = useParams<{ tripId: string }>();
  const { goBack } = useNavigationHistory();
  const trip = tripId ? mockTrips[tripId] : null;

  if (!trip) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Trip not found</h2>
          <p className="text-white/60 mb-4">The trip you're looking for doesn't exist</p>
          <Button onClick={() => navigate("/my-trips")} className="bg-white/10 hover:bg-white/15 rounded-none">
            Back to My Trips
          </Button>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: Trip["type"]) => {
    switch (type) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "bus":
        return <Bus className="h-5 w-5" />;
      case "train":
        return <Train className="h-5 w-5" />;
      case "taxi":
        return <CarIcon className="h-5 w-5" />;
      case "rental":
        return <CarIcon className="h-5 w-5" />;
      case "hotel":
        return <Hotel className="h-5 w-5" />;
      case "movie":
        return <Film className="h-5 w-5" />;
      case "event":
        return <PartyPopper className="h-5 w-5" />;
      case "metro":
        return <Ticket className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-white/80" />;
      case "upcoming":
        return <AlertCircle className="h-4 w-4 text-white/80" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-white/80" />;
    }
  };

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "completed":
        return "bg-white/5 text-white/80 border-white/20 rounded-none";
      case "upcoming":
        return "bg-white/5 text-white/80 border-blue-400/20 rounded-none";
      case "cancelled":
        return "bg-white/5 text-white/80 border-white/20 rounded-none";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hotel": return Hotel;
      case "food": return Utensils;
      case "transport": return CarIcon;
      default: return DollarSign;
    }
  };

  const calculateArrivalTime = () => {
    const [hours, minutes] = trip.time.split(':');
    const departureMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    let durationMinutes = 0;
    
    if (trip.duration.includes('h') && trip.duration.includes('m')) {
      const match = trip.duration.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        durationMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);
      }
    } else if (trip.duration.includes('h')) {
      const match = trip.duration.match(/(\d+)h/);
      if (match) {
        durationMinutes = parseInt(match[1]) * 60;
      }
    } else if (trip.duration.includes('m')) {
      const match = trip.duration.match(/(\d+)m/);
      if (match) {
        durationMinutes = parseInt(match[1]);
      }
    } else {
      return 'N/A';
    }
    
    const totalMinutes = departureMinutes + durationMinutes;
    const arrivalHours = Math.floor(totalMinutes / 60) % 24;
    const arrivalMins = totalMinutes % 60;
    return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')}`;
  };

  const totalExpenses = trip.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const grandTotal = trip.amount + totalExpenses;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">Trip Details</h1>
            <p className="text-xs text-white/60">{trip.reference}</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-24 px-4 pb-4 space-y-6">
        {/* Hybrid View - QR Code Section (Cardless) */}
        <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-4 rounded-lg">
              <QRCode value={`TICKET:${trip.reference}:${trip.type.toUpperCase()}`} size={200} />
            </div>
            <div className="text-center">
              <p className="text-white font-light text-lg">{trip.reference}</p>
              <p className="text-white/60 text-sm uppercase tracking-widest">{trip.type}</p>
            </div>
            <Badge 
              className={`${getStatusColor(trip.status)} rounded-none border text-sm px-4 py-2`}
              data-testid={`status-${trip.status}`}
            >
              {getStatusIcon(trip.status)}
              <span className="ml-1 capitalize">{trip.status}</span>
            </Badge>
          </div>
        </div>

        {/* Travel Timeline Card */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 border border-white/20">
                {getTypeIcon(trip.type)}
              </div>
              <div>
                <p className="text-sm text-white/60 uppercase tracking-wider font-light">
                  Travel Timeline
                </p>
                <p className="text-white font-light text-lg tracking-wider">{trip.operator}</p>
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-white/20"></div>

          {/* Journey Details */}
          <div className="flex items-center justify-between py-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{trip.time}</p>
              <p className="text-sm text-white/60 mt-1">{trip.from}</p>
              <p className="text-xs text-white/40">{trip.fromCode}</p>
            </div>
              <div className="flex-1 mx-6">
              <div className="flex items-center text-white/60">
                <div className="flex-1 border-t border-white/20"></div>
                <div className="px-4 text-center">
                  <Clock className="h-4 w-4 inline mr-1" />
                  <span className="text-sm">{trip.duration}</span>
                </div>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{calculateArrivalTime()}</p>
              <p className="text-sm text-white/60 mt-1">{trip.to}</p>
              <p className="text-xs text-white/40">{trip.toCode}</p>
            </div>
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Trip Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 border border-white/10">
              <Calendar className="h-4 w-4 mx-auto mb-2 text-white/60" />
              <p className="text-xs text-white/60">Travel Date</p>
              <p className="text-white font-medium text-sm mt-1">
                {new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/10">
              <User className="h-4 w-4 mx-auto mb-2 text-white/60" />
              <p className="text-xs text-white/60">Passengers</p>
              <p className="text-white font-medium text-sm mt-1">{trip.passengers}</p>
            </div>
            {trip.seat && (
              <div className="text-center p-3 bg-white/5 border border-white/10">
                <MapPin className="h-4 w-4 mx-auto mb-2 text-white/60" />
                <p className="text-xs text-white/60">Seat(s)</p>
                <p className="text-white font-medium text-sm mt-1">{trip.seat}</p>
              </div>
            )}
            <div className="text-center p-3 bg-white/5 border border-white/10">
              <CreditCard className="h-4 w-4 mx-auto mb-2 text-white/60" />
              <p className="text-xs text-white/60">Class</p>
              <p className="text-white font-medium text-sm mt-1">{trip.class}</p>
            </div>
          </div>
        </div>

        {/* Journey Summary Card */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <h3 className="text-white text-base font-light tracking-wider uppercase mb-4">Journey Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Operator</span>
              <span className="text-white font-light">{trip.operator} - {trip.route}</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">From</span>
              <span className="text-white font-light">{trip.from} ({trip.fromCode})</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">To</span>
              <span className="text-white font-light">{trip.to} ({trip.toCode})</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Date</span>
              <span className="text-white font-light">
                {new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Departure Time</span>
              <span className="text-white font-light">{trip.time}</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Arrival Time</span>
              <span className="text-white font-light">{calculateArrivalTime()}</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Duration</span>
              <span className="text-white font-light">{trip.duration}</span>
            </div>
            {trip.seat && (
              <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
                <span className="text-white/60 text-sm">Seat(s)</span>
                <span className="text-white font-light">{trip.seat}</span>
              </div>
            )}
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Class</span>
              <span className="text-white font-light">{trip.class}</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 text-sm">Passengers</span>
              <span className="text-white font-light">{trip.passengers}</span>
            </div>
          </div>
        </div>

        {/* Passenger Details (Card) */}
        {trip.passengerDetails && trip.passengerDetails.length > 0 && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-white text-base font-light tracking-wider uppercase mb-4">
              <User className="h-5 w-5" />
              Passenger Details
            </h3>
            <div className="space-y-3">
              {trip.passengerDetails.map((passenger, idx) => (
                <div key={idx} className="p-4 border border-white/20 bg-white/5" data-testid={`passenger-${idx}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-light">{passenger.name}</p>
                      <p className="text-white/60 text-sm font-light">{passenger.age} years • {passenger.gender}</p>
                    </div>
                    <Badge className="bg-white/10 text-white/80 border-white/20 rounded-none">
                      Passenger {idx + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Details (Card) */}
        {trip.contactDetails && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-white text-base font-light tracking-wider uppercase mb-4">
              <Mail className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 border border-white/20 bg-white/5">
                <Mail className="h-4 w-4 text-white/60" />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Email</p>
                  <p className="text-white font-light">{trip.contactDetails.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border border-white/20 bg-white/5">
                <Phone className="h-4 w-4 text-white/60" />
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Phone</p>
                  <p className="text-white font-light">{trip.contactDetails.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fare Breakdown (Card) */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <h3 className="flex items-center gap-2 text-white text-base font-light tracking-wider uppercase mb-4">
            <DollarSign className="h-5 w-5" />
            Fare Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 font-light">Base Fare</span>
              <span className="text-white font-light">₹{trip.fareBreakdown.baseFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 font-light">Taxes & Surcharges</span>
              <span className="text-white font-light">₹{trip.fareBreakdown.taxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 border border-white/20 bg-white/5">
              <span className="text-white/60 font-light">Convenience Fee</span>
              <span className="text-white font-light">₹{trip.fareBreakdown.convenienceFee.toLocaleString()}</span>
            </div>
            <div className="my-2 border-t border-white/20"></div>
            <div className="flex justify-between p-3 border border-white/20 bg-white/10">
              <span className="text-white font-light tracking-wider">Ticket Total</span>
              <span className="text-white font-light text-lg">₹{trip.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Trip Expenses (Card) */}
        {trip.expenses && trip.expenses.length > 0 && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-white text-base font-light tracking-wider uppercase mb-4">
              <FileText className="h-5 w-5" />
              Trip Expenses
            </h3>
            <div className="space-y-3">
              {trip.expenses.map((expense) => {
                const Icon = getCategoryIcon(expense.category);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 border border-white/20 bg-white/5" data-testid={`expense-${expense.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 border border-white/20">
                        <Icon className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-white font-light">{expense.description}</p>
                        <p className="text-xs text-white/60 capitalize font-light">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-white font-light">₹{expense.amount.toLocaleString()}</p>
                  </div>
                );
              })}
              <div className="my-2 border-t border-white/20"></div>
              <div className="flex justify-between p-3 border border-white/20 bg-white/5">
                <span className="text-white font-light">Total Expenses</span>
                <span className="text-white font-light text-lg">₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-4 border border-white/20 bg-white/10">
                <span className="text-white font-light text-lg tracking-wider">Grand Total</span>
                <span className="text-white font-light text-xl">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-none font-light"
            data-testid="button-download-ticket"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          {trip.status === "upcoming" && (
            <Button
              className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-none font-light"
              data-testid="button-modify-booking"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Modify Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
