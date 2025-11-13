import { useState, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  Clock,
  IndianRupee,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  Video,
  Home,
  Star,
  FileText,
  Eye,
  CreditCard,
  Tag,
  CheckCircle2,
  Circle,
  Info
} from "lucide-react";
import { format, addDays } from "date-fns";
import { type ConsultantService, type ConsultantProvider } from "@shared/schema";
import { cn } from "@/lib/utils";

const BOOKING_STEPS = [
  { id: "service", label: "Service", icon: FileText },
  { id: "schedule", label: "Schedule", icon: CalendarIcon },
  { id: "details", label: "Details", icon: User },
  { id: "info", label: "Info", icon: Info },
  { id: "review", label: "Review", icon: Eye },
  { id: "payment", label: "Payment", icon: CreditCard }
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

const generateDateOptions = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(new Date(), i);
    dates.push({
      date: format(date, 'yyyy-MM-dd'),
      display: format(date, 'EEE, MMM dd'),
      dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEEE')
    });
  }
  return dates;
};

export default function ConsultantBooking() {
  const params = useParams<{ serviceId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState("service");
  const [bookingType, setBookingType] = useState<"virtual" | "in_person">("virtual");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const { data: service } = useQuery<ConsultantService>({
    queryKey: [`/api/consultant/services/${params.serviceId}`],
    enabled: !!params.serviceId,
  });

  const { data: provider } = useQuery<ConsultantProvider>({
    queryKey: [`/api/consultant/providers/${service?.providerId}`],
    enabled: !!service?.providerId,
  });

  const dateOptions = useMemo(() => generateDateOptions(), []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const basePrice = service ? parseFloat(service.price) : 0;
  const travelFee = bookingType === "in_person" ? 50 : 0;
  const subtotal = basePrice + travelFee;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const taxAmount = (subtotal - discount) * 0.18;
  const totalAmount = subtotal - discount + taxAmount;

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/consultant/bookings", {
        serviceId: params.serviceId,
        bookingType,
        scheduledDate: selectedDate,
        scheduledTime: selectedSlot,
        customerName,
        customerPhone,
        customerEmail,
        address,
        city,
        pincode,
        specialRequests,
        promoCode: appliedCoupon?.code || "",
        paymentMode: "prepaid"
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/consultant/bookings"] });
      toast({
        title: "Booking confirmed!",
        description: "Your service has been booked successfully.",
      });
      navigate(`/consultant/booking/confirmation/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleApplyCoupon = () => {
    const validCoupons = [
      { code: "FIRST10", discount: 10 },
      { code: "SAVE20", discount: 20 },
      { code: "DISCOUNT15", discount: 15 }
    ];

    const coupon = validCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    
    if (coupon) {
      setAppliedCoupon(coupon);
      toast({
        title: "Coupon applied!",
        description: `You saved ${coupon.discount}% on your booking.`,
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    
    // Validation for each step
    if (currentStep === "schedule" && (!selectedDate || !selectedSlot)) {
      toast({
        title: "Select date and time",
        description: "Please select a date and time slot.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === "details" && (!customerName || !customerPhone)) {
      toast({
        title: "Fill required details",
        description: "Please provide your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === "info" && bookingType === "in_person" && (!address || !city || !pincode)) {
      toast({
        title: "Address required",
        description: "Please provide complete address for in-person consultation.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === "payment") {
      createBookingMutation.mutate();
      return;
    }
    
    if (currentStepIndex < BOOKING_STEPS.length - 1) {
      setCurrentStep(BOOKING_STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentStepIndex = BOOKING_STEPS.findIndex(s => s.id === currentStep);
    if (currentStepIndex > 0) {
      setCurrentStep(BOOKING_STEPS[currentStepIndex - 1].id);
    }
  };

  const getCurrentStepIndex = () => BOOKING_STEPS.findIndex(step => step.id === currentStep);
  const progressPercentage = ((getCurrentStepIndex() + 1) / BOOKING_STEPS.length) * 100;

  if (!service || !provider) {
    return (
      <>
        <div className="min-h-screen bg-black pb-24">
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between py-4 px-4">
              <button
                onClick={() => window.history.back()}
                className="text-white hover:text-white/80"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1} />
              </button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">LOADING...</h1>
              </div>
              <div className="w-5" />
            </div>
          </div>
          <div className="pt-20 flex items-center justify-center h-96">
            <div className="text-white/60">Loading...</div>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-32">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider uppercase">{BOOKING_STEPS[getCurrentStepIndex()].label}</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                  Step {getCurrentStepIndex() + 1} of {BOOKING_STEPS.length}
                </p>
              </div>
              <div className="w-10"></div>
            </div>

            {/* Step Icons */}
            <div className="flex items-center justify-between mb-3">
              {BOOKING_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = index < getCurrentStepIndex();
                
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex flex-col items-center flex-1",
                      index > 0 && "ml-1"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-none border flex items-center justify-center mb-1 transition-all",
                        isActive && "bg-white border-white",
                        !isActive && isCompleted && "bg-white/20 border-white/30",
                        !isActive && !isCompleted && "bg-white/5 border-white/20"
                      )}
                    >
                      <StepIcon
                        className={cn(
                          "h-4 w-4",
                          isActive && "text-black",
                          !isActive && "text-white/60"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[8px] uppercase tracking-widest text-center",
                        isActive && "text-white font-semibold",
                        !isActive && "text-white/40"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-1 rounded-none overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-40 px-4 space-y-6">
          {/* SERVICE STEP */}
          {currentStep === "service" && (
            <div className="space-y-6">
              {/* Service Details */}
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Service Details</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Service Name</p>
                    <p className="text-base font-light text-white">{service.title}</p>
                  </div>
                  {service.description && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Description</p>
                      <p className="text-sm font-light text-white/70">{service.description}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Duration</p>
                      <div className="flex items-center gap-1 text-white">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-light">{service.duration} minutes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Price</p>
                      <div className="flex items-center justify-end gap-1 text-white text-xl font-light">
                        <IndianRupee className="h-5 w-5" />
                        {basePrice.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Information */}
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Provider Information</h3>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-light text-white">{provider.name}</h4>
                      {provider.rating && (
                        <div className="flex items-center gap-1 text-white/60">
                          <Star className="h-3 w-3 fill-white text-white" />
                          <span className="text-xs">{parseFloat(provider.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {provider.bio && (
                      <p className="text-sm text-white/60 font-light leading-relaxed">{provider.bio}</p>
                    )}
                    {provider.designation && (
                      <p className="text-xs text-white/40 mt-1">{provider.designation}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCHEDULE STEP */}
          {currentStep === "schedule" && (
            <div className="space-y-6">
              {/* Booking Type */}
              <div className="border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Consultation Mode</p>
                <div className="flex gap-3">
                  {service.virtualAvailable === 1 && (
                    <button
                      onClick={() => setBookingType("virtual")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 border transition-all",
                        bookingType === "virtual"
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white border-white/20 hover:border-white/40"
                      )}
                      data-testid="button-booking-type-virtual"
                    >
                      <Video className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-widest font-light">Virtual</span>
                    </button>
                  )}
                  {service.inPersonAvailable === 1 && (
                    <button
                      onClick={() => setBookingType("in_person")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-4 border transition-all",
                        bookingType === "in_person"
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white border-white/20 hover:border-white/40"
                      )}
                      data-testid="button-booking-type-in-person"
                    >
                      <Home className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-widest font-light">In-Person</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Select Date</p>
                <div className="grid grid-cols-2 gap-2">
                  {dateOptions.map((dateOption) => (
                    <button
                      key={dateOption.date}
                      onClick={() => setSelectedDate(dateOption.date)}
                      className={cn(
                        "p-3 border transition-all text-left",
                        selectedDate === dateOption.date
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white border-white/10 hover:border-white/20"
                      )}
                      data-testid={`button-date-${dateOption.date}`}
                    >
                      <div className="text-[10px] uppercase tracking-widest font-light mb-1 opacity-60">
                        {dateOption.dayLabel}
                      </div>
                      <div className="text-sm font-light">{dateOption.display}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Select Time Slot</p>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "p-3 text-xs font-mono border transition-all",
                          selectedSlot === slot
                            ? "bg-white text-black border-white"
                            : "bg-white/5 text-white border-white/10 hover:border-white/20"
                        )}
                        data-testid={`button-timeslot-${slot}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DETAILS STEP */}
          {currentStep === "details" && (
            <div className="space-y-6">
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Your Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none"
                      data-testid="input-customer-name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none font-mono"
                      data-testid="input-customer-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                      Email (Optional)
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none"
                      data-testid="input-customer-email"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INFO STEP */}
          {currentStep === "info" && (
            <div className="space-y-6">
              {bookingType === "in_person" && (
                <div className="border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="h-4 w-4 text-white/60" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Service Address</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                        Address *
                      </label>
                      <Textarea
                        placeholder="Enter complete address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none min-h-[80px]"
                        data-testid="input-address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                          City *
                        </label>
                        <Input
                          type="text"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none"
                          data-testid="input-city"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                          Pincode *
                        </label>
                        <Input
                          type="text"
                          placeholder="Pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none font-mono"
                          data-testid="input-pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Additional Information</h3>
                </div>
                
                <div>
                  <label className="text-xs text-white/60 uppercase tracking-widest block mb-2">
                    Special Requests (Optional)
                  </label>
                  <Textarea
                    placeholder="Any specific requirements..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none min-h-[100px]"
                    data-testid="input-special-requests"
                  />
                </div>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Review Your Booking</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-white/60">Service</span>
                    <span className="text-white font-light">{service.title}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-white/60">Consultant</span>
                    <span className="text-white font-light">{provider.name}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-white/60">Date & Time</span>
                    <span className="text-white font-light">
                      {dateOptions.find(d => d.date === selectedDate)?.display} at {selectedSlot}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-white/60">Mode</span>
                    <span className="text-white font-light uppercase">{bookingType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-white/60">Name</span>
                    <span className="text-white font-light">{customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                    <span className="text-white/60">Phone</span>
                    <span className="text-white font-light font-mono">{customerPhone}</span>
                  </div>
                  {customerEmail && (
                    <div className="flex justify-between text-sm pb-3 border-b border-white/10">
                      <span className="text-white/60">Email</span>
                      <span className="text-white font-light">{customerEmail}</span>
                    </div>
                  )}
                  {bookingType === "in_person" && address && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Address</span>
                      <span className="text-white font-light text-right max-w-[60%]">
                        {address}, {city} - {pincode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              {/* Coupon Code */}
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Apply Coupon</h3>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!!appliedCoupon}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none uppercase"
                    data-testid="input-coupon-code"
                  />
                  {appliedCoupon ? (
                    <Button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }}
                      className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none h-11 px-6"
                      data-testid="button-remove-coupon"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                      className="bg-white text-black hover:bg-white/90 rounded-none h-11 px-6"
                      data-testid="button-apply-coupon"
                    >
                      Apply
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{appliedCoupon.discount}% discount applied</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-white/60" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Payment Details</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span className="uppercase tracking-widest text-xs">Service Charge</span>
                    <span className="flex items-center font-mono">
                      <IndianRupee className="h-3 w-3" strokeWidth={1} />
                      {basePrice.toFixed(2)}
                    </span>
                  </div>
                  
                  {travelFee > 0 && (
                    <div className="flex justify-between text-sm text-white/70">
                      <span className="uppercase tracking-widest text-xs">Travel Fee</span>
                      <span className="flex items-center font-mono">
                        <IndianRupee className="h-3 w-3" strokeWidth={1} />
                        {travelFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span className="uppercase tracking-widest text-xs">Discount ({appliedCoupon.discount}%)</span>
                      <span className="flex items-center font-mono">
                        - <IndianRupee className="h-3 w-3" strokeWidth={1} />
                        {discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-white/70">
                    <span className="uppercase tracking-widest text-xs">Tax (18% GST)</span>
                    <span className="flex items-center font-mono">
                      <IndianRupee className="h-3 w-3" strokeWidth={1} />
                      {taxAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-semibold">
                    <span className="uppercase tracking-wider">Total Amount</span>
                    <span className="flex items-center font-mono text-xl">
                      <IndianRupee className="h-5 w-5" strokeWidth={1} />
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <div className="flex items-center gap-3">
            {getCurrentStepIndex() > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-none h-12 px-6"
                data-testid="button-previous"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleContinue}
              disabled={createBookingMutation.isPending}
              className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider uppercase"
              data-testid="button-continue"
            >
              {createBookingMutation.isPending ? "PROCESSING..." : currentStep === "payment" ? "CONFIRM & PAY" : "CONTINUE"}
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
