import { useState, useEffect } from "react";
import { useParams, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plane,
  MapPin,
  Clock,
  Users,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Circle,
  AlertCircle,
  UserCircle,
  GraduationCap,
  Briefcase
} from "lucide-react";

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

interface FlightData {
  id: string;
  airline: string;
  flightNumber: string;
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

const getFlightData = (id: string): FlightData => {
  const mockFlights: Record<string, FlightData> = {
    "1": {
      id: "1",
      airline: "Air India",
      flightNumber: "AI 505",
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

const generateSeats = () => {
  const seats = [];
  for (let row = 1; row <= 20; row++) {
    seats.push({ row, seats: ['A', 'B', 'C', 'D', 'E', 'F'] });
  }
  return seats;
};

export default function FlightBookingDetail() {
  const { id } = useParams();
  const [, navigate] = useWouterLocation();
  const { toast } = useToast();

  const flight = getFlightData(id || "1");

  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { title: "Mr", firstName: "", lastName: "", age: "", gender: "Male" }
  ]);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [currentPassengerForSeat, setCurrentPassengerForSeat] = useState(0);
  const [travelerType, setTravelerType] = useState<"general" | "student" | "business">("general");
  const [studentCollegeName, setStudentCollegeName] = useState("");
  const [studentCollegeId, setStudentCollegeId] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessIdCard, setBusinessIdCard] = useState("");
  const [businessGstNo, setBusinessGstNo] = useState("");

  const seatLayout = generateSeats();
  
  const baseFareTotal = flight.basePrice * passengers.length;
  const taxesTotal = flight.taxesPerPassenger * passengers.length;
  const totalPrice = baseFareTotal + taxesTotal + flight.convenienceFee;

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
      } else if (currentPassengerForSeat === index && index > 0) {
        setCurrentPassengerForSeat(index - 1);
      }
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSeatClick = (row: number, seat: string, passengerId: number) => {
    if (passengerId >= passengers.length || passengerId < 0) {
      toast({
        title: "Invalid Passenger",
        description: "Please select a valid passenger first",
        variant: "destructive"
      });
      return;
    }

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
    navigate(`/booking/flight/${id || '1'}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/flight/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">COMPLETE BOOKING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Review & confirm details</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 max-w-7xl mx-auto space-y-6">
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 border border-white/20">
              <Plane className="h-6 w-6 text-white" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-light tracking-wider mb-2">{flight.airline}</h2>
              <p className="text-sm text-white/60 mb-4">{flight.flightNumber}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-light">{flight.departureTime}</p>
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
                  <p className="text-2xl font-light">{flight.arrivalTime}</p>
                  <p className="text-sm text-white/60">{flight.to}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-xs text-white/60">
                <span><Calendar className="inline h-3 w-3 mr-1" />{flight.departureDate}</span>
                <span><Users className="inline h-3 w-3 mr-1" />{flight.class}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
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

        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <h3 className="text-lg font-light tracking-wider mb-4">Seat Selection</h3>
          <Button
            onClick={() => setShowSeatSelection(!showSeatSelection)}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none mb-4"
            data-testid="button-toggle-seats"
          >
            {showSeatSelection ? "Hide Seat Map" : "Show Seat Map"}
          </Button>
          
          {showSeatSelection && (
            <div className="max-h-96 overflow-y-auto">
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
              <div className="space-y-2">
                {seatLayout.map((row) => (
                  <div key={row.row} className="flex items-center gap-2">
                    <span className="text-white/60 text-xs w-8">{row.row}</span>
                    <div className="flex gap-1">
                      {row.seats.map((seat) => {
                        const selected = isSeatSelected(row.row, seat);
                        const passengerId = getSeatPassengerId(row.row, seat);
                        return (
                          <button
                            key={seat}
                            onClick={() => handleSeatClick(row.row, seat, currentPassengerForSeat)}
                            className={`w-8 h-8 border text-xs font-light ${
                              selected
                                ? "bg-white text-black border-white"
                                : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                            }`}
                            data-testid={`seat-${row.row}${seat}`}
                            title={selected ? `Passenger ${getSeatPassengerId(row.row, seat)! + 1}` : "Available"}
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
          )}
          
          {selectedSeats.length > 0 && (
            <div className="mt-4 p-4 bg-white/5 border border-white/10">
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Selected Seats</Label>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat, idx) => (
                  <Badge key={idx} className="bg-white/10 text-white border-white/20 rounded-none">
                    {seat.row}{seat.seat}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Traveler Type Selection */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <h3 className="text-lg font-light tracking-wider mb-4 flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Traveler Type
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { value: "general", label: "General", icon: UserCircle },
              { value: "student", label: "Student", icon: GraduationCap },
              { value: "business", label: "Business", icon: Briefcase }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setTravelerType(type.value as any)}
                className={`flex flex-col items-center gap-2 py-4 border transition-all font-light tracking-wider rounded-none ${
                  travelerType === type.value
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                }`}
                data-testid={`button-traveler-${type.value}`}
              >
                <type.icon className="h-6 w-6" />
                <span className="text-xs">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Student Fields */}
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

          {/* Business Fields */}
          {travelerType === "business" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Business Email</Label>
                <Input
                  type="email"
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

        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <h3 className="text-lg font-light tracking-wider mb-4">Price Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
              <span className="font-light">{formatCurrency(baseFareTotal)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Taxes & Fees ({passengers.length} × {formatCurrency(flight.taxesPerPassenger)})</span>
              <span className="font-light">{formatCurrency(taxesTotal)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Convenience Fee</span>
              <span className="font-light">{formatCurrency(flight.convenienceFee)}</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-white text-xl">
              <span className="font-light">Total Amount</span>
              <span className="font-bold" data-testid="text-total-amount">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider">Total Amount</p>
              <p className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</p>
            </div>
            <Button
              onClick={handleProceedToPayment}
              className="bg-white text-black hover:bg-white/90 rounded-none h-14 px-8 text-base font-light tracking-wider"
              data-testid="button-continue-booking"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              CONTINUE BOOKING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
