import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  Check,
  User,
  Phone,
  FileText,
  ShoppingCart,
  DollarSign,
  Car,
  Shield,
  MapPin,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const BOOKING_STAGES: BookingStage[] = [
  { id: 'driver-details', title: 'Driver Details', shortTitle: 'Driver', icon: User, description: 'Provide driver information' },
  { id: 'requirements', title: 'Additional Requirements', shortTitle: 'Add-ons', icon: ShoppingCart, description: 'Select amenities and services' },
  { id: 'contact', title: 'Contact Information', shortTitle: 'Contact', icon: Phone, description: 'Emergency contact details' },
  { id: 'review', title: 'Review Booking', shortTitle: 'Review', icon: FileText, description: 'Review your booking details' },
  { id: 'payment', title: 'Payment Method', shortTitle: 'Payment', icon: DollarSign, description: 'Select payment method and pay' }
];

const AMENITIES = [
  { id: 'driver', name: 'Driver Service', price: 500 },
  { id: 'newspaper', name: 'Daily Newspaper', price: 50 },
  { id: 'umbrella', name: 'Umbrella', price: 100 },
  { id: 'gps', name: 'GPS Navigation', price: 200 },
  { id: 'child_seat', name: 'Child Seat', price: 300 }
];

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay via UPI' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Debit/Credit card' },
  { id: 'wallet', name: 'Wallet', icon: Building2, description: 'Paytm, PhonePe, etc.' }
];

export default function RentalBook() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // Step 1: Driver Details
  const [driverName, setDriverName] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);

  // Step 2: Additional Requirements
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Step 3: Contact
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Step 5: Payment
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isBooking, setIsBooking] = useState(false);

  const vehicle = {
    name: 'Swift',
    brand: 'Maruti Suzuki',
    pricePerDay: 1200
  };

  const booking = {
    pickupDate: '15 Oct 2024',
    pickupTime: '10:00 AM',
    dropDate: '17 Oct 2024',
    dropTime: '10:00 AM',
    duration: '2 days',
    location: 'Connaught Place, Delhi'
  };

  const currentStage = BOOKING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / BOOKING_STAGES.length) * 100;

  const rentalCost = vehicle.pricePerDay * 2;
  const amenitiesCost = selectedAmenities.reduce((sum, id) => {
    const amenity = AMENITIES.find(a => a.id === id);
    return sum + (amenity?.price || 0);
  }, 0);
  const securityDeposit = 5000;
  const gst = (rentalCost + amenitiesCost) * 0.05;
  const total = rentalCost + amenitiesCost + gst + securityDeposit;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicensePhoto(e.target.files[0]);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const validateCurrentStage = (): boolean => {
    switch (currentStage.id) {
      case 'driver-details':
        if (!driverName || !driverLicense || !driverPhone || !licensePhoto) {
          toast({
            title: "Details Required",
            description: "Please complete all driver details and upload license",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 'contact':
        if (!email || !emergencyName || !emergencyPhone) {
          toast({
            title: "Contact Details Required",
            description: "Please complete all contact information",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStage = () => {
    if (!validateCurrentStage()) return;

    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    
    if (currentStageIndex < BOOKING_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      handleBooking();
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

  const handleBooking = async () => {
    if (!validateCurrentStage()) return;

    setIsBooking(true);
    setTimeout(() => {
      toast({
        title: "BOOKING CONFIRMED",
        description: "Your car rental is confirmed"
      });
      navigate("/booking/rental/success");
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'driver-details':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Full Name</Label>
                <Input
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Enter driver name"
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-driver-name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-wider">License Number</Label>
                <Input
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="Enter license number"
                  className="bg-white/5 border-white/20 text-white rounded-none font-mono mt-2"
                  data-testid="input-license-number"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Phone Number</Label>
                <Input
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="Enter phone number"
                  type="tel"
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-phone"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Upload License Photo</Label>
                <div className="relative">
                  <input
                    type="file"
                    id="license-upload"
                    accept="image/*"
                    onChange={handleLicenseUpload}
                    className="hidden"
                    data-testid="input-file"
                  />
                  <label
                    htmlFor="license-upload"
                    className={cn(
                      "flex items-center justify-center gap-2 border-2 border-dashed h-24 cursor-pointer transition-colors mt-2",
                      licensePhoto 
                        ? "border-green-500/50 bg-green-500/10" 
                        : "border-white/20 hover:border-white/40"
                    )}
                  >
                    {licensePhoto ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-light text-green-500">
                          {licensePhoto.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-white/60" />
                        <span className="text-sm font-light text-white/60">
                          Click to upload
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-4">
            <p className="text-sm text-white/40 font-light">Select any additional amenities you need</p>
            
            <div className="space-y-3">
              {AMENITIES.map((amenity) => (
                <div
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={cn(
                    "border-b pb-4 cursor-pointer transition-all",
                    selectedAmenities.includes(amenity.id)
                      ? "border-white/20"
                      : "border-white/10"
                  )}
                  data-testid={`amenity-${amenity.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={selectedAmenities.includes(amenity.id)}
                        className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:border-white mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            "font-light tracking-wider",
                            selectedAmenities.includes(amenity.id) ? "text-white" : "text-white/80"
                          )}>
                            {amenity.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-white/40">Price per day</p>
                          <p className={cn(
                            "text-lg font-light",
                            selectedAmenities.includes(amenity.id) ? "text-white" : "text-white/60"
                          )}>
                            {formatCurrency(amenity.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedAmenities.includes(amenity.id) && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                      <p className="text-sm text-white/40">Subtotal for {booking.duration}</p>
                      <p className="text-lg font-light text-white">{formatCurrency(amenity.price * 2)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedAmenities.length > 0 && (
              <div className="bg-white/5 border border-white/10 p-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/60">Total Amenities Cost</p>
                  <p className="text-xl font-light">{formatCurrency(amenitiesCost * 2)}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                type="email"
                className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                data-testid="input-email"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs uppercase tracking-wider text-white/60 mb-4">Emergency Contact</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Name</Label>
                  <Input
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Enter emergency contact name"
                    className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                    data-testid="input-emergency-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Phone Number</Label>
                  <Input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Enter emergency contact phone"
                    type="tel"
                    className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                    data-testid="input-emergency-phone"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <Car className="h-4 w-4" />
                Booking Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Vehicle</p>
                    <p className="text-white font-light mt-1">{vehicle.brand} {vehicle.name}</p>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Duration</p>
                    <p className="text-white font-light mt-1">{booking.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Location</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {booking.location}
                    </p>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Pickup</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {booking.pickupDate} at {booking.pickupTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Drop</p>
                    <p className="text-white font-light mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {booking.dropDate} at {booking.dropTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Details Summary */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase flex items-center gap-2">
                <User className="h-4 w-4" />
                Driver Information
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Name</span>
                  <span className="text-white font-light">{driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">License</span>
                  <span className="text-white font-light font-mono">{driverLicense}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Phone</span>
                  <span className="text-white font-light">{driverPhone}</span>
                </div>
              </div>
            </div>

            {/* Selected Amenities */}
            {selectedAmenities.length > 0 && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
                <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Selected Amenities</h3>
                
                <div className="space-y-2">
                  {selectedAmenities.map(amenityId => {
                    const amenity = AMENITIES.find(a => a.id === amenityId);
                    return amenity ? (
                      <div key={amenityId} className="flex justify-between text-sm">
                        <span className="text-white/60">{amenity.name}</span>
                        <span className="font-light">{formatCurrency(amenity.price * 2)}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((method) => {
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
                      data-testid={`payment-${method.id}`}
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
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Rental ({booking.duration})</span>
                  <span className="font-light">{formatCurrency(rentalCost)}</span>
                </div>
                {amenitiesCost > 0 && (
                  <div className="flex justify-between text-white/80">
                    <span className="text-sm">Amenities ({booking.duration})</span>
                    <span className="font-light">{formatCurrency(amenitiesCost * 2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">GST (5%)</span>
                  <span className="font-light">{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span className="text-sm">Security Deposit (Refundable)</span>
                  <span className="font-light">{formatCurrency(securityDeposit)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm uppercase tracking-wider">Total Amount</span>
                  <span className="text-white text-2xl font-light" data-testid="text-payment-total">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-white/60 space-y-1 font-light">
                <p>• Valid driving license is mandatory</p>
                <p>• Security deposit will be refunded within 7 days</p>
                <p>• Vehicle must be returned with same fuel level</p>
                <p>• Any damage will be charged from deposit</p>
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
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/booking/rental/details")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">CAR RENTAL BOOKING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Vehicle Rental</p>
            </div>

            <Badge className="bg-black border border-white/30 text-white rounded-none">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          {/* Progress Section */}
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
            
            {/* Stage Tracker */}
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

      {/* Scrollable Content */}
      <div ref={scrollableContentRef} className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Vehicle Info Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{vehicle.brand} {vehicle.name}</p>
                <p className="text-white/60 text-xs">{booking.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{booking.duration}</p>
              <p className="text-white/60 text-xs">{formatCurrency(vehicle.pricePerDay)}/day</p>
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
          
        {/* Stage Content */}
        <div className="space-y-3">
          {renderStageContent()}
        </div>

        {/* Price Summary */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Rental Cost ({booking.duration})</span>
              <span className="font-light">{formatCurrency(rentalCost)}</span>
            </div>
            {amenitiesCost > 0 && (
              <div className="flex justify-between text-white/80">
                <span className="text-sm">Amenities</span>
                <span className="font-light">{formatCurrency(amenitiesCost * 2)}</span>
              </div>
            )}
            <div className="flex justify-between text-white/80">
              <span className="text-sm">GST (5%)</span>
              <span className="font-light">{formatCurrency(gst)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span className="text-sm">Security Deposit</span>
              <span className="font-light">{formatCurrency(securityDeposit)}</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-white text-xl">
              <span className="font-light">Total Amount</span>
              <span className="font-bold" data-testid="text-total-amount">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{vehicle.brand} {vehicle.name}</p>
              <p className="text-sm text-white font-light">{booking.pickupDate} - {booking.dropDate}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Amount</p>
              <p className="text-xl font-light text-white">{formatCurrency(total)}</p>
            </div>
          </div>
          <Button
            onClick={handleNextStage}
            disabled={isBooking}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === BOOKING_STAGES.length - 1 ? (
              <>
                {isBooking ? "PROCESSING..." : `PAY ${formatCurrency(total)}`}
              </>
            ) : (
              <>
                CONTINUE
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
