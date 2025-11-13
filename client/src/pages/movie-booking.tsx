import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Film,
  Users,
  Building2,
  Car,
  UtensilsCrossed,
  Volume2,
  Armchair,
  Plus,
  Minus,
  Sparkles,
  Phone,
  ChevronRight,
  Info,
  CheckCircle2,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TicketClass {
  id: string;
  name: string;
  price: number;
  available: number;
  quantity: number;
}

interface TheaterDetails {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  contact: string;
  screens: number;
  totalSeats: number;
  buildYear: number;
  parkingCapacity: string;
  cafeteria: boolean;
  soundSystem: string;
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
}

const BOOKING_STEPS = [
  { id: "details", label: "Details", icon: Info },
  { id: "seats", label: "Seats", icon: Users }
];

export default function MovieBooking() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState("details");

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("movieId") || "movie-1";
  const showtimeId = params.get("showtimeId") || "";
  const theaterId = params.get("theaterId") || "1";
  const showDate = params.get("date") || format(new Date(), "yyyy-MM-dd");

  const movie = {
    title: "Pushpa 2: The Rule",
    posterUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0",
    rating: "UA",
    language: "Hindi",
    duration: 180,
    genre: ["Action", "Drama", "Thriller"]
  };

  const showtime = {
    id: showtimeId,
    time: "06:15 PM",
    format: "3D",
    screen: "Screen 3"
  };

  const theater: TheaterDetails = {
    id: theaterId,
    name: "PVR Cinemas - Phoenix Mall",
    area: "Whitefield",
    city: "Bangalore",
    address: "Phoenix Marketcity, Whitefield Main Road, Bangalore - 560066",
    contact: "+91 1800-258-4567",
    screens: 8,
    totalSeats: 1450,
    buildYear: 2018,
    parkingCapacity: "500+ Cars",
    cafeteria: true,
    soundSystem: "Dolby Atmos 7.1 Surround Sound",
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
    }
  };

  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([
    { id: "normal", name: "Normal", price: 250, available: 80, quantity: 0 },
    { id: "premium", name: "Premium", price: 400, available: 45, quantity: 0 },
    { id: "recliner", name: "Recliner", price: 600, available: 20, quantity: 0 }
  ]);

  const totalTickets = ticketClasses.reduce((sum, cls) => sum + cls.quantity, 0);
  const totalAmount = ticketClasses.reduce((sum, cls) => sum + (cls.price * cls.quantity), 0);

  const updateTicketQuantity = (classId: string, delta: number) => {
    setTicketClasses(prev => prev.map(cls => {
      if (cls.id === classId) {
        const newQuantity = Math.max(0, Math.min(cls.available, cls.quantity + delta));
        return { ...cls, quantity: newQuantity };
      }
      return cls;
    }));
  };

  const handleContinue = () => {
    if (totalTickets === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue",
        variant: "destructive"
      });
      return;
    }

    const ticketsData = ticketClasses
      .filter(cls => cls.quantity > 0)
      .map(cls => ({ classId: cls.id, className: cls.name, quantity: cls.quantity, price: cls.price }));

    const bookingParams = new URLSearchParams({
      movieId,
      showtimeId,
      theaterId,
      date: showDate,
      tickets: JSON.stringify(ticketsData),
      totalTickets: totalTickets.toString(),
      totalAmount: totalAmount.toString()
    });

    navigate(`/movie-seat-selection?${bookingParams.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentStepIndex = () => BOOKING_STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/movies")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BOOK TICKETS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Event Booking</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Booking Progress Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-white/60" />
            <h3 className="text-xs font-light text-white/60 uppercase tracking-widest">Booking Progress</h3>
          </div>
          <div className="flex items-center justify-between">
            {BOOKING_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = getCurrentStepIndex() > index;
              const isAccessible = isCompleted || index <= getCurrentStepIndex();
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                    className={cn(
                      "flex flex-col items-center transition-all",
                      isAccessible ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"
                    )}
                    disabled={!isAccessible}
                    data-testid={`step-button-${step.id}`}
                  >
                    <div className={cn(
                      "w-10 h-10 border-2 flex items-center justify-center transition-all",
                      isActive ? "border-white bg-white" : isCompleted ? "border-white bg-white" : "border-white/20 bg-white/5"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-black" />
                      ) : (
                        <StepIcon className={cn("h-5 w-5", isActive ? "text-black" : "text-white/60")} />
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-2 font-light tracking-wider",
                      isActive ? "text-white" : "text-white/60"
                    )}>
                      {step.label}
                    </p>
                  </button>
                  {index < BOOKING_STEPS.length - 1 && (
                    <div className={cn(
                      "h-0.5 flex-1 mx-2 transition-all",
                      isCompleted ? "bg-white" : "bg-white/20"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs for Details and Seat Selection */}
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 rounded-none p-1">
            <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-sm rounded-none">
              <Info className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="seats" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-sm rounded-none">
              <Users className="h-4 w-4 mr-2" />
              Seat Selection
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Movie Summary Card */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Film className="h-4 w-4 text-white/60" />
                <h3 className="text-xs font-light text-white/60 uppercase tracking-widest">Movie Information</h3>
              </div>
              <div className="flex gap-4">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-20 h-28 object-cover border border-white/20"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-light tracking-wider mb-2">{movie.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                      {movie.rating}
                    </Badge>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{movie.duration} min</span>
                    </div>
                    <span>•</span>
                    <span>{movie.language}</span>
                  </div>
                  <div className="flex gap-2">
                    {movie.genre.slice(0, 3).map((g, idx) => (
                      <span key={idx} className="text-xs text-white/40">{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Theater Details Card */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-white/60" />
                <h3 className="text-xs font-light text-white/60 uppercase tracking-widest">Theater Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-light tracking-wider mb-2">{theater.name}</h4>
                  <div className="flex items-start gap-2 text-xs text-white/60">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{theater.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>Show Date</span>
                    </div>
                    <p className="text-sm font-light text-white">{format(new Date(showDate), "EEE, dd MMM yyyy")}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>Show Time</span>
                    </div>
                    <p className="text-sm font-light text-white">{showtime.time} • {showtime.format}</p>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs text-white/60 uppercase tracking-widest mb-3">Facilities & Amenities</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 border border-white/10">
                      <Volume2 className="h-3 w-3" />
                      <span>{theater.soundSystem}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 border border-white/10">
                      <Car className="h-3 w-3" />
                      <span>{theater.parkingCapacity}</span>
                    </div>
                    {theater.cafeteria && (
                      <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 border border-white/10">
                        <UtensilsCrossed className="h-3 w-3" />
                        <span>Cafeteria Available</span>
                      </div>
                    )}
                    {theater.amenities.recliner_seats && (
                      <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 border border-white/10">
                        <Armchair className="h-3 w-3" />
                        <span>Recliner Seats</span>
                      </div>
                    )}
                    {theater.amenities.valet_parking && (
                      <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 border border-white/10">
                        <Car className="h-3 w-3" />
                        <span>Valet Parking</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 border border-white/10">
                      <Phone className="h-3 w-3" />
                      <span>{theater.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-black/40 p-2 border border-white/10">
                    <p className="font-light text-white">{theater.screens}</p>
                    <p className="text-white/40 uppercase tracking-wider text-[10px]">Screens</p>
                  </div>
                  <div className="bg-black/40 p-2 border border-white/10">
                    <p className="font-light text-white">{theater.totalSeats}</p>
                    <p className="text-white/40 uppercase tracking-wider text-[10px]">Total Seats</p>
                  </div>
                  <div className="bg-black/40 p-2 border border-white/10">
                    <p className="font-light text-white">{theater.buildYear}</p>
                    <p className="text-white/40 uppercase tracking-wider text-[10px]">Est.</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("seats")}
              className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none"
              data-testid="button-proceed-to-seats"
            >
              Proceed to Seat Selection
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          {/* Seat Selection Tab */}
          <TabsContent value="seats" className="space-y-6 mt-6">
            {/* Ticket Selection */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-white/60" />
                <h3 className="text-xs font-light text-white/60 uppercase tracking-widest">Select Number of Tickets</h3>
              </div>
              <div className="space-y-3">
                {ticketClasses.map((ticketClass) => (
                  <div
                    key={ticketClass.id}
                    className={cn(
                      "w-full p-4 border transition-all",
                      ticketClass.quantity > 0
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    )}
                    data-testid={`ticket-class-${ticketClass.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className={cn(
                          "font-light tracking-wider transition-opacity",
                          ticketClass.quantity > 0 ? "opacity-100 text-white" : "opacity-60 text-white/60"
                        )}>
                          {ticketClass.name}
                        </p>
                        <p className="text-xs text-white/40 font-light">
                          {ticketClass.available} seats available
                        </p>
                      </div>
                      <Badge className={cn(
                        "rounded-none border font-light text-sm",
                        ticketClass.quantity > 0 
                          ? "bg-white/20 text-white border-white/30" 
                          : "bg-white/10 text-white/60 border-white/20"
                      )}>
                        {formatCurrency(ticketClass.price)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateTicketQuantity(ticketClass.id, -1)}
                          disabled={ticketClass.quantity === 0}
                          className="h-8 w-8 rounded-none border-white/20 hover:bg-white/10 disabled:opacity-30"
                          data-testid={`button-decrease-${ticketClass.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className={cn(
                          "text-lg font-light w-8 text-center",
                          ticketClass.quantity > 0 ? "text-white" : "text-white/40"
                        )} data-testid={`count-${ticketClass.id}`}>
                          {ticketClass.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateTicketQuantity(ticketClass.id, 1)}
                          disabled={ticketClass.quantity >= ticketClass.available}
                          className="h-8 w-8 rounded-none border-white/20 hover:bg-white/10 disabled:opacity-30"
                          data-testid={`button-increase-${ticketClass.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {ticketClass.quantity > 0 && (
                        <p className="text-sm font-light text-white">
                          {formatCurrency(ticketClass.price * ticketClass.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            {totalTickets > 0 && (
              <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white/60">Total Tickets</p>
                  <p className="text-base font-light text-white">{totalTickets}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <p className="text-base text-white/60">Total Amount</p>
                  <p className="text-2xl font-light text-white">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom CTA - Only in Seat Selection tab */}
      {currentStep === "seats" && totalTickets > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-white/60">{totalTickets} Ticket{totalTickets !== 1 ? 's' : ''}</p>
                <p className="text-sm text-white font-light">{formatCurrency(totalAmount)}</p>
              </div>
              <Button
                className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none"
                onClick={handleContinue}
                data-testid="button-continue"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
