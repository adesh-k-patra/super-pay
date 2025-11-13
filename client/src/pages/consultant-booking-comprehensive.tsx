import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CouponSelector } from "@/components/booking/coupon-selector";
import type { ConsultantService, ConsultantProvider } from "@shared/schema";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Video,
  Home,
  Briefcase,
  CheckCircle,
  Star,
  Shield,
  MessageSquare,
  Zap,
  Award
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const BOOKING_STAGES: BookingStage[] = [
  { id: 'service-details', title: 'Service Details', shortTitle: 'Service', icon: Briefcase, description: 'Review service and provider information' },
  { id: 'booking-schedule', title: 'Schedule Appointment', shortTitle: 'Schedule', icon: Calendar, description: 'Select booking type, date, and time' },
  { id: 'customer-info', title: 'Contact Information', shortTitle: 'Contact', icon: User, description: 'Provide your contact details' },
  { id: 'preferences', title: 'Preferences & Add-ons', shortTitle: 'Preferences', icon: Star, description: 'Special requests and additional services' },
  { id: 'payment', title: 'Review & Payment', shortTitle: 'Payment', icon: Shield, description: 'Review booking and complete payment' }
];

const ADD_ON_OPTIONS = [
  { id: 'priority-support', name: 'Priority Support', description: '24/7 dedicated support line', price: 200, icon: Zap },
  { id: 'insurance', name: 'Consultation Insurance', description: 'Cancel or reschedule anytime', price: 150, icon: Shield },
  { id: 'recording', name: 'Session Recording', description: 'Get a recording of the session', price: 100, icon: Video },
  { id: 'extended-time', name: 'Extended Time', description: 'Add 30 minutes to session', price: 500, icon: Clock }
];

const formatTimeSlot = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}.${minute.toString().padStart(2, '0')} ${period}`;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = formatTimeSlot(hour, minute);
      const endMinute = minute + 30;
      const endHour = endMinute >= 60 ? hour + 1 : hour;
      const adjustedEndMinute = endMinute >= 60 ? 0 : endMinute;
      const endTime = formatTimeSlot(endHour, adjustedEndMinute);
      const slotLabel = `${startTime} - ${endTime}`;
      const slotValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({ label: slotLabel, value: slotValue });
    }
  }
  return slots;
};

export default function ConsultantBookingComprehensive() {
  const { serviceId } = useParams();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  const [bookingType, setBookingType] = useState<"virtual" | "in_person">("virtual");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [accessInstructions, setAccessInstructions] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState<"prepaid" | "pay_at_service">("prepaid");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const { data: service } = useQuery<ConsultantService>({
    queryKey: [`/api/consultant/services/${serviceId}`],
    enabled: !!serviceId,
  });

  const { data: provider } = useQuery<ConsultantProvider>({
    queryKey: [`/api/consultant/providers/${service?.providerId}`],
    enabled: !!service?.providerId,
  });

  const { data: availability = [] } = useQuery<any[]>({
    queryKey: [`/api/consultant/providers/${service?.providerId}/availability`],
    enabled: !!service?.providerId,
  });

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;
  
  const basePrice = service ? parseFloat(service.price) : 0;
  const numberOfSlots = selectedTime.length || 1;
  const slotMultipliedPrice = basePrice * numberOfSlots;
  const travelFee = bookingType === "in_person" ? 50 : 0;
  const addOnsTotal = selectedAddOns.reduce((total, addonId) => {
    const addon = ADD_ON_OPTIONS.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);
  
  const calculateCouponDiscount = (): number => {
    if (!appliedCoupon) return 0;
    const subtotal = slotMultipliedPrice + addOnsTotal;
    if (appliedCoupon.valueType === "percentage") {
      const discount = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    }
    return appliedCoupon.value;
  };

  const couponDiscount = calculateCouponDiscount();
  const priceAfterDiscount = Math.max(0, slotMultipliedPrice + addOnsTotal - couponDiscount);
  const taxAmount = (priceAfterDiscount + travelFee) * 0.18;
  const totalAmount = priceAfterDiscount + travelFee + taxAmount;

  const getAvailableSlots = () => {
    if (!selectedDate) {
      return [];
    }
    
    const allSlots = generateTimeSlots();
    
    if (availability.length === 0) {
      return allSlots;
    }
    
    const selectedDayOfWeek = format(selectedDate, "EEEE").toLowerCase();
    const dayAvailability = availability.find((a: any) => {
      const dayOfWeek = a.dayOfWeek;
      if (typeof dayOfWeek === 'string') {
        return dayOfWeek.toLowerCase() === selectedDayOfWeek;
      }
      return false;
    });
    
    if (!dayAvailability) {
      return allSlots;
    }
    
    if (!dayAvailability.isAvailable) {
      return allSlots;
    }
    
    if (!dayAvailability.startTime || !dayAvailability.endTime) {
      return allSlots;
    }
    
    return allSlots.filter(slot => {
      return slot.value >= dayAvailability.startTime && slot.value <= dayAvailability.endTime;
    });
  };

  const availableSlots = getAvailableSlots();

  const handleTimeSlotToggle = (slotValue: string) => {
    if (selectedTime.includes(slotValue)) {
      setSelectedTime(selectedTime.filter(t => t !== slotValue));
    } else {
      setSelectedTime([...selectedTime, slotValue].sort());
    }
  };

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/consultant/bookings", data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultant/bookings"] });
      
      if (paymentMode === "prepaid") {
        navigate(`/consultant/booking/confirmation/${data.id}`);
      } else {
        toast({
          title: "Booking confirmed!",
          description: "Your service has been booked successfully.",
        });
        navigate(`/consultant/booking/confirmation/${data.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const handleNextStage = () => {
    if (currentStage.id === 'booking-schedule') {
      if (!selectedDate || selectedTime.length === 0) {
        toast({
          title: "Schedule Required",
          description: "Please select both date and time slot",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStage.id === 'customer-info') {
      if (!customerName || !customerPhone) {
        toast({
          title: "Details Required",
          description: "Please enter your name and phone number",
          variant: "destructive"
        });
        return;
      }

      if (bookingType === "in_person" && (!address || !city || !pincode)) {
        toast({
          title: "Address Required",
          description: "Please provide complete address for in-person service",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStage.id === 'payment') {
      handleConfirmBooking();
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

  const handleToggleAddOn = (addonId: string) => {
    if (selectedAddOns.includes(addonId)) {
      setSelectedAddOns(selectedAddOns.filter(id => id !== addonId));
    } else {
      setSelectedAddOns([...selectedAddOns, addonId]);
    }
  };

  const handleConfirmBooking = () => {
    if (!service || !selectedDate || selectedTime.length === 0) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    const bookingData = {
      serviceId: service.id,
      bookingType,
      scheduledDate: format(selectedDate, "yyyy-MM-dd"),
      scheduledTime: selectedTime.join(', '),
      customerName,
      customerPhone,
      customerEmail: customerEmail || "",
      address: address || "",
      city: city || "",
      pincode: pincode || "",
      accessInstructions: accessInstructions || "",
      specialRequests: specialRequests || "",
      selectedAddOns: selectedAddOns.join(','),
      addOnsTotal: addOnsTotal,
      paymentMode,
      promoCode: appliedCoupon?.code || "",
    };

    if (paymentMode === 'prepaid') {
      localStorage.setItem('consultantBookingData', JSON.stringify(bookingData));
      
      const paymentParams = new URLSearchParams({
        amount: totalAmount.toString(),
        transactionType: 'consultant-booking',
        serviceName: service.title || 'Consultant Service',
        providerName: provider?.name || 'Provider',
        returnUrl: '/consultant/explore'
      });
      
      navigate(`/upi-payment?${paymentParams.toString()}`);
    } else {
      createBookingMutation.mutate(bookingData);
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
      case 'service-details':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider">Service Name</Label>
              <p className="text-white text-lg mt-1 font-light">{service?.title}</p>
            </div>

            {service?.description && (
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Description</Label>
                <p className="text-white/80 text-sm mt-1 font-light leading-relaxed">{service.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Duration</Label>
                <p className="text-white text-base mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service?.duration} min
                </p>
              </div>
              <div className="text-right">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Price</Label>
                <p className="text-white text-lg mt-1 font-light">{formatCurrency(basePrice)}</p>
              </div>
            </div>

            {provider && (
              <>
                <Separator className="bg-white/10" />
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Provider</Label>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-light">{provider.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white/60 text-sm">{parseFloat(provider.rating || "0").toFixed(1)}</span>
                      </div>
                      {provider.bio && (
                        <p className="text-white/70 text-xs font-light mt-2 leading-relaxed">{provider.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'booking-schedule':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Select Date</Label>
              <div className="relative">
                <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  <div className="flex gap-2 min-w-max">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = addDays(new Date(), i);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const dayName = format(date, 'EEE');
                      const dayNum = format(date, 'd');
                      const monthName = format(date, 'MMM');
                      
                      return (
                        <button
                          key={i}
                          type="button"
                          data-testid={`button-date-${format(date, 'yyyy-MM-dd')}`}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime([]);
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center border transition-all min-w-[70px] px-4 py-3",
                            isSelected
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                          )}
                        >
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider mb-1",
                            isSelected ? "text-black/60" : "text-white/60"
                          )}>
                            {dayName}
                          </span>
                          <span className={cn(
                            "text-2xl font-light",
                            isSelected ? "text-black" : "text-white"
                          )}>
                            {dayNum}
                          </span>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider mt-1",
                            isSelected ? "text-black/60" : "text-white/60"
                          )}>
                            {monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-4 block">
                  Select Time Slot{selectedTime.length > 0 && ` (${selectedTime.length} selected)`}
                </Label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime.includes(slot.value);
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          data-testid={`button-timeslot-${slot.value}`}
                          onClick={() => handleTimeSlotToggle(slot.value)}
                          className={cn(
                            "relative px-4 py-3 border transition-all duration-200 group",
                            isSelected
                              ? "bg-white text-black border-white shadow-lg shadow-white/20"
                              : "bg-gradient-to-br from-white/5 to-white/[0.02] text-white border-white/20 hover:border-white/40 hover:from-white/10 hover:to-white/5"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Clock className={cn(
                              "h-3.5 w-3.5 flex-shrink-0",
                              isSelected ? "text-black" : "text-white/60 group-hover:text-white/80"
                            )} />
                            <span className={cn(
                              "text-xs font-light tracking-wide",
                              isSelected ? "text-black font-medium" : "text-white"
                            )}>
                              {slot.label}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle className="h-3 w-3 text-black" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-white/40 text-xs p-4 bg-white/5 border border-white/10 text-center">
                    No available slots for this date
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'customer-info':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Full Name *</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none"
                data-testid="input-customer-name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Phone Number *</Label>
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
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-none"
                  data-testid="input-customer-email"
                />
              </div>
            </div>

            {bookingType === "in_person" && (
              <>
                <Separator className="bg-white/10" />
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Complete Address *</Label>
                  <Textarea
                    placeholder="Enter your complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none min-h-[80px]"
                    data-testid="input-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">City *</Label>
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
                    <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Pincode *</Label>
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

                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Access Instructions</Label>
                  <Textarea
                    placeholder="Any access instructions (e.g., gate code, landmarks)"
                    value={accessInstructions}
                    onChange={(e) => setAccessInstructions(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none min-h-[60px]"
                    data-testid="input-access-instructions"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Add-on Services</Label>
              <div className="space-y-3">
                {ADD_ON_OPTIONS.map((addon) => {
                  const Icon = addon.icon;
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddOn(addon.id)}
                      data-testid={`button-addon-${addon.id}`}
                      className={cn(
                        "w-full text-left border p-4 transition-all flex items-start justify-between",
                        isSelected
                          ? "border-white bg-white/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className={cn("h-5 w-5 mt-0.5", isSelected ? "text-white" : "text-white/60")} />
                        <div className="flex-1">
                          <h4 className="text-white font-light text-sm mb-1">{addon.name}</h4>
                          <p className="text-white/60 text-xs mb-2">{addon.description}</p>
                          <div className="flex items-center gap-1 text-white">
                            <IndianRupee className="h-3 w-3" />
                            <span className="text-sm font-light">{addon.price}</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Special Requests</Label>
              <Textarea
                placeholder="Any specific requirements or topics you'd like to discuss..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none min-h-[100px]"
                data-testid="input-special-requests"
              />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Booking Summary</Label>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Service</span>
                  <span className="text-white font-light">{service?.title}</span>
                </div>

                {selectedDate && selectedTime.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Schedule</span>
                    <span className="text-white font-light">
                      {format(selectedDate, "dd MMM yyyy")} • {selectedTime.length} slot{selectedTime.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Booking Type</span>
                  <span className="text-white font-light">{bookingType === "virtual" ? "Virtual" : "In-Person"}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Contact</span>
                  <span className="text-white font-light">{customerName}</span>
                </div>

                {selectedAddOns.length > 0 && (
                  <>
                    <Separator className="bg-white/10" />
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Selected Add-ons</p>
                      {selectedAddOns.map((addonId) => {
                        const addon = ADD_ON_OPTIONS.find(a => a.id === addonId);
                        if (!addon) return null;
                        return (
                          <div key={addonId} className="flex justify-between text-sm text-white/80 mb-1">
                            <span>{addon.name}</span>
                            <span>{formatCurrency(addon.price)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            <CouponSelector
              bookingAmount={basePrice + addOnsTotal}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
              category="consultant"
            />

            <Separator className="bg-white/10" />

            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Payment Mode</Label>
              <RadioGroup
                value={paymentMode}
                onValueChange={(value) => setPaymentMode(value as "prepaid" | "pay_at_service")}
                className="space-y-3"
              >
                <div>
                  <RadioGroupItem
                    value="prepaid"
                    id="prepaid"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="prepaid"
                    data-testid="label-payment-prepaid"
                    className="flex items-center justify-between border border-white/20 bg-white/5 p-4 hover:bg-white/10 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-white" />
                      <div>
                        <span className="text-white text-sm font-light block">Pay Online Now</span>
                        <span className="text-white/60 text-xs">Secure payment gateway</span>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40 rounded-none text-xs">
                      Recommended
                    </Badge>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="pay_at_service"
                    id="pay_at_service"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="pay_at_service"
                    data-testid="label-payment-later"
                    className="flex items-center justify-between border border-white/20 bg-white/5 p-4 hover:bg-white/10 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/10 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-5 w-5 text-white" />
                      <div>
                        <span className="text-white text-sm font-light block">Pay at Service</span>
                        <span className="text-white/60 text-xs">Pay when you meet the consultant</span>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
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
              onClick={goBack}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">CONSULTANT BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{service?.category || 'Professional Service'}</p>
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
        {/* Service Info Card - Hidden on schedule step */}
        {currentStage.id !== 'booking-schedule' && (
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white font-light text-sm">{service?.title || 'Service'}</p>
                  <p className="text-white/60 text-xs">{provider?.name || 'Provider'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-light text-sm">{formatCurrency(basePrice)}</p>
                <p className="text-white/60 text-xs">{service?.duration || '60'} min</p>
              </div>
            </div>
          </div>
        )}

        {/* Stage Title - Hidden on schedule step */}
        {currentStage.id !== 'booking-schedule' && (
          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <currentStage.icon className="h-3 w-3" />
              {currentStage.title}
            </Label>
            <p className="text-xs text-white/40 font-light">{currentStage.description}</p>
          </div>
        )}
          
        {/* Stage Content - Cardless */}
        <div className={cn("space-y-3", currentStage.id === 'booking-schedule' && "mt-16")}>
          {renderStageContent()}
        </div>

        {/* Price Summary - Hidden on schedule step */}
        {currentStage.id !== 'booking-schedule' && (
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Service Price {numberOfSlots > 1 && `(${numberOfSlots} slots)`}</span>
                <span className="font-light">{formatCurrency(slotMultipliedPrice)}</span>
              </div>
              
              {selectedAddOns.length > 0 && (
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Add-ons ({selectedAddOns.length})</span>
                  <span className="font-light">{formatCurrency(addOnsTotal)}</span>
                </div>
              )}

              {bookingType === "in_person" && (
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Travel Fee</span>
                  <span className="font-light">{formatCurrency(travelFee)}</span>
                </div>
              )}

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-light">-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-white/80">
                <span className="text-sm">Tax (18%)</span>
                <span className="font-light">{formatCurrency(taxAmount)}</span>
              </div>

              <Separator className="bg-white/20" />
              <div className="flex justify-between text-white text-xl">
                <span className="font-light">Total Amount</span>
                <span className="font-bold" data-testid="text-total-amount">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Navigation Footer - UPI Payment Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{service?.title || 'Consultation Service'}</p>
              <p className="text-sm text-white font-light">
                {selectedDate ? format(selectedDate, "dd MMM yyyy") : 'Date not selected'} 
                {selectedTime.length > 0 && ` • ${selectedTime.length} slot${selectedTime.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Amount</p>
              <p className="text-xl font-light text-white">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          <Button
            onClick={handleNextStage}
            disabled={createBookingMutation.isPending}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === BOOKING_STAGES.length - 1 ? (
              createBookingMutation.isPending ? (
                <>PROCESSING...</>
              ) : (
                <>
                  {paymentMode === 'prepaid' ? `PAY ${formatCurrency(totalAmount)}` : 'CONFIRM BOOKING'}
                </>
              )
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
