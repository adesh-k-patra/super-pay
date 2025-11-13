import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CouponSelector } from "@/components/booking/coupon-selector";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle,
  Users,
  Shield,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Briefcase,
  UserCircle,
  Calendar,
  Star,
  Fuel,
  Settings,
  Navigation,
  Baby,
  Wifi,
  CreditCard
} from "lucide-react";

interface RentalData {
  id: string;
  vehicleType: string;
  brand: string;
  model: string;
  category: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  registrationNumber: string;
  rating: number;
  features: string[];
}

interface DriverInfo {
  firstName: string;
  lastName: string;
  age: string;
  licenseNumber: string;
  phone: string;
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
    id: 'vehicle-details',
    title: 'Vehicle Information',
    shortTitle: 'Vehicle',
    icon: Car,
    description: 'Review vehicle details and specifications'
  },
  {
    id: 'duration-selection',
    title: 'Rental Duration',
    shortTitle: 'Duration',
    icon: Clock,
    description: 'Select rental period and dates'
  },
  {
    id: 'insurance-selection',
    title: 'Insurance & Protection',
    shortTitle: 'Insurance',
    icon: Shield,
    description: 'Choose insurance coverage options'
  },
  {
    id: 'addons-selection',
    title: 'Add-ons & Extras',
    shortTitle: 'Add-ons',
    icon: Settings,
    description: 'Select additional services and equipment'
  },
  {
    id: 'driver-info',
    title: 'Driver Details',
    shortTitle: 'Details',
    icon: UserCircle,
    description: 'Driver and contact information'
  },
  {
    id: 'payment',
    title: 'Payment',
    shortTitle: 'Payment',
    icon: CreditCard,
    description: 'Apply coupons and proceed to payment'
  }
];

const DURATION_OPTIONS = [
  { id: 'daily', name: 'Daily Rental', description: 'Perfect for short trips', priceMultiplier: 1 },
  { id: 'weekly', name: 'Weekly Rental', description: 'Save 15% on weekly bookings', priceMultiplier: 6.5 },
  { id: 'monthly', name: 'Monthly Rental', description: 'Best value - Save 25%', priceMultiplier: 22.5 }
];

const INSURANCE_OPTIONS = [
  { id: 'basic', name: 'Basic Protection', price: 0, features: ['Third-party liability', 'Basic coverage up to ₹50,000'] },
  { id: 'standard', name: 'Standard Insurance', price: 500, features: ['Theft protection', 'Collision damage waiver', 'Coverage up to ₹2 lakhs'] },
  { id: 'premium', name: 'Premium Coverage', price: 1200, features: ['Zero deductible', 'Comprehensive coverage', 'Personal accident insurance', 'Coverage up to ₹5 lakhs'] }
];

const ADDON_OPTIONS = [
  { id: 'gps', name: 'GPS Navigation', price: 200, icon: Navigation },
  { id: 'child-seat', name: 'Child Safety Seat', price: 150, icon: Baby },
  { id: 'wifi', name: 'Mobile Wi-Fi Hotspot', price: 300, icon: Wifi },
  { id: 'extra-driver', name: 'Additional Driver', price: 400, icon: Users }
];

const getRentalData = (id: string): RentalData => {
  const mockRentals: Record<string, RentalData> = {
    "1": {
      id: "1",
      vehicleType: "car",
      brand: "Maruti Suzuki",
      model: "Swift VXi",
      category: "Hatchback",
      fuelType: "Petrol",
      transmission: "Manual",
      seatingCapacity: 5,
      dailyRate: 1500,
      weeklyRate: 9750,
      monthlyRate: 33750,
      registrationNumber: "DL-01-AB-1234",
      rating: 4.5,
      features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags']
    },
    "2": {
      id: "2",
      vehicleType: "car",
      brand: "Honda",
      model: "City VX",
      category: "Sedan",
      fuelType: "Petrol",
      transmission: "Automatic",
      seatingCapacity: 5,
      dailyRate: 2500,
      weeklyRate: 16250,
      monthlyRate: 56250,
      registrationNumber: "DL-02-CD-5678",
      rating: 4.8,
      features: ['Air Conditioning', 'Sunroof', 'Bluetooth', 'Cruise Control', 'Leather Seats']
    }
  };
  
  return mockRentals[id] || mockRentals["1"];
};

export default function RentalBookingComprehensive() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const rental = getRentalData(id || "1");

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
  // Booking selections
  const [durationType, setDurationType] = useState('daily');
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedInsurance, setSelectedInsurance] = useState('basic');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [travelerType, setTravelerType] = useState<'general' | 'student' | 'business'>('general');
  
  // Driver details
  const [driver, setDriver] = useState<DriverInfo>({
    firstName: "",
    lastName: "",
    age: "",
    licenseNumber: "",
    phone: ""
  });
  const [contactEmail, setContactEmail] = useState("");
  
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

  // Calculate price
  const durationOption = DURATION_OPTIONS.find(d => d.id === durationType);
  const rentalBasePrice = rental.dailyRate * (durationOption?.priceMultiplier || 1) * rentalDays;
  const insurancePrice = INSURANCE_OPTIONS.find(i => i.id === selectedInsurance)?.price || 0;
  const addonsPrice = selectedAddons.reduce((total, addonId) => {
    const addon = ADDON_OPTIONS.find(a => a.id === addonId);
    return total + (addon?.price || 0);
  }, 0);
  const basePrice = rentalBasePrice + insurancePrice + addonsPrice;

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
    // Validate duration selection
    if (currentStage.id === 'duration-selection') {
      if (rentalDays < 1) {
        toast({
          title: "Duration Required",
          description: "Please select a valid rental duration",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate driver details
    if (currentStage.id === 'driver-info') {
      if (!contactEmail || !driver.firstName || !driver.lastName || !driver.age || !driver.licenseNumber || !driver.phone) {
        toast({
          title: "Details Incomplete",
          description: "Please complete all driver and contact information",
          variant: "destructive"
        });
        return;
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

  const handleDriverChange = (field: keyof DriverInfo, value: string) => {
    setDriver({ ...driver, [field]: value });
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleProceedToPayment = () => {
    const bookingData: Record<string, string> = {
      rentalId: id || '1',
      driver: JSON.stringify(driver),
      contactEmail,
      travelerType,
      studentCollegeName,
      studentCollegeId,
      businessEmail,
      businessIdCard,
      businessGstNo,
      durationType,
      rentalDays: rentalDays.toString(),
      selectedInsurance,
      selectedAddons: JSON.stringify(selectedAddons),
      amount: totalPrice.toString(),
      type: 'rental'
    };

    const queryParams = new URLSearchParams(bookingData);
    navigate(`/upi-payment?${queryParams.toString()}`);
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
      case 'vehicle-details':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Brand</Label>
                    <p className="text-white text-base mt-1">{rental.brand}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Model</Label>
                    <p className="text-white text-base mt-1">{rental.model}</p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Category</Label>
                    <p className="text-white text-base mt-1">{rental.category}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Registration</Label>
                    <p className="text-white text-base mt-1">{rental.registrationNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                  <Fuel className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-xs text-white/60">Fuel Type</p>
                    <p className="text-sm text-white">{rental.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                  <Settings className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-xs text-white/60">Transmission</p>
                    <p className="text-sm text-white">{rental.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                  <Users className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-xs text-white/60">Seating</p>
                    <p className="text-sm text-white">{rental.seatingCapacity} Persons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                  <Star className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-xs text-white/60">Rating</p>
                    <p className="text-sm text-white">{rental.rating}/5.0</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {rental.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-white/5 border border-white/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'duration-selection':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Rental Period</h3>
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDurationType(option.id)}
                  className={`w-full p-4 border-b transition-all text-left ${
                    durationType === option.id
                      ? 'border-white bg-white/5'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  data-testid={`duration-option-${option.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-light tracking-wider transition-opacity ${
                      durationType === option.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                    }`}>
                      {option.name}
                    </p>
                  </div>
                  <p className={`text-xs font-light ${
                    durationType === option.id ? 'text-white/60' : 'text-white/40'
                  }`}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">Number of {durationType === 'daily' ? 'Days' : durationType === 'weekly' ? 'Weeks' : 'Months'}</Label>
              <Input
                type="number"
                min="1"
                value={rentalDays}
                onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                className="bg-white/5 border-white/20 text-white rounded-none text-lg"
                data-testid="input-rental-days"
              />
              <p className="text-xs text-white/40 mt-2">
                Base price: {formatCurrency(basePrice)}
              </p>
            </div>
          </div>
        );

      case 'insurance-selection':
        return (
          <div className="space-y-3">
            {INSURANCE_OPTIONS.map((insurance) => (
              <button
                key={insurance.id}
                onClick={() => setSelectedInsurance(insurance.id)}
                className={`w-full p-4 border-b transition-all text-left ${
                  selectedInsurance === insurance.id
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
                data-testid={`insurance-option-${insurance.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-light tracking-wider transition-opacity ${
                    selectedInsurance === insurance.id ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                  }`}>
                    {insurance.name}
                  </p>
                  <Badge className={`rounded-none border font-light text-xs ${
                    selectedInsurance === insurance.id 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-white/10 text-white/60 border-white/20'
                  }`}>
                    {insurance.price === 0 ? 'Included' : formatCurrency(insurance.price)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insurance.features.map((feature, idx) => (
                    <span key={idx} className="text-xs text-white/40 font-light">{feature}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        );

      case 'addons-selection':
        return (
          <div className="space-y-3">
            {ADDON_OPTIONS.map((addon) => (
              <button
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`w-full p-4 border-b transition-all text-left ${
                  selectedAddons.includes(addon.id)
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
                data-testid={`addon-option-${addon.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <addon.icon className="h-4 w-4 text-white/60" />
                    <p className={`font-light tracking-wider transition-opacity ${
                      selectedAddons.includes(addon.id) ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                    }`}>
                      {addon.name}
                    </p>
                  </div>
                  <Badge className={`rounded-none border font-light text-xs ${
                    selectedAddons.includes(addon.id) 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-white/10 text-white/60 border-white/20'
                  }`}>
                    {formatCurrency(addon.price)}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        );

      case 'driver-info':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-6 text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Driver Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">First Name</Label>
                    <Input
                      value={driver.firstName}
                      onChange={(e) => handleDriverChange("firstName", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-driver-firstname"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Last Name</Label>
                    <Input
                      value={driver.lastName}
                      onChange={(e) => handleDriverChange("lastName", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-driver-lastname"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Age</Label>
                    <Input
                      type="number"
                      value={driver.age}
                      onChange={(e) => handleDriverChange("age", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-driver-age"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">License Number</Label>
                    <Input
                      value={driver.licenseNumber}
                      onChange={(e) => handleDriverChange("licenseNumber", e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-driver-license"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Phone Number</Label>
                  <Input
                    value={driver.phone}
                    onChange={(e) => handleDriverChange("phone", e.target.value)}
                    className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                    data-testid="input-driver-phone"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-6 text-white">Contact Information</h3>
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">Email Address</Label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                  data-testid="input-contact-email"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Traveler Type</h3>
              <div className="space-y-2">
                {[
                  { value: "general", label: "General", icon: User },
                  { value: "student", label: "Student", icon: GraduationCap },
                  { value: "business", label: "Business", icon: Briefcase }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setTravelerType(type.value as 'general' | 'student' | 'business')}
                    className={`w-full p-4 border-b transition-all text-left ${
                      travelerType === type.value
                        ? 'border-white bg-white/5'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    data-testid={`traveler-type-${type.value}`}
                  >
                    <div className="flex items-center gap-3">
                      <type.icon className={`h-5 w-5 ${travelerType === type.value ? 'text-white' : 'text-white/60'}`} />
                      <p className={`font-light tracking-wider transition-opacity ${
                        travelerType === type.value ? 'opacity-100 text-white' : 'opacity-60 text-white/60'
                      }`}>
                        {type.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {travelerType === "student" && (
                <div className="mt-6 space-y-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">College/University Name</Label>
                    <Input
                      value={studentCollegeName}
                      onChange={(e) => setStudentCollegeName(e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-student-college-name"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Student ID</Label>
                    <Input
                      value={studentCollegeId}
                      onChange={(e) => setStudentCollegeId(e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-student-college-id"
                    />
                  </div>
                </div>
              )}

              {travelerType === "business" && (
                <div className="mt-6 space-y-4 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
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
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Business ID Card Number</Label>
                    <Input
                      value={businessIdCard}
                      onChange={(e) => setBusinessIdCard(e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-business-id"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs uppercase tracking-wider">GST Number (Optional)</Label>
                    <Input
                      value={businessGstNo}
                      onChange={(e) => setBusinessGstNo(e.target.value)}
                      className="bg-white/5 border-white/20 text-white rounded-none mt-2"
                      data-testid="input-business-gst"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <CouponSelector
              bookingAmount={basePrice}
              category="travel"
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
            />

            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
              <h3 className="text-lg font-light tracking-wider mb-4 text-white">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Vehicle ({rental.brand} {rental.model})</span>
                  <span className="text-white">{formatCurrency(rentalBasePrice)}</span>
                </div>
                {insurancePrice > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Insurance</span>
                    <span className="text-white">{formatCurrency(insurancePrice)}</span>
                  </div>
                )}
                {addonsPrice > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Add-ons</span>
                    <span className="text-white">{formatCurrency(addonsPrice)}</span>
                  </div>
                )}
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">{formatCurrency(basePrice)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">Coupon Discount</span>
                    <span className="text-green-400">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between text-lg font-light">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatCurrency(totalPrice)}</span>
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-white/10">
        <div className="w-full max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/rental-booking')}
              className="text-white hover:bg-white/10 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-light tracking-wider text-white uppercase">
                {rental.brand} {rental.model}
              </h1>
              <p className="text-xs text-white/60">{rental.category}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progressPercentage} className="h-1 bg-white/10" />
          </div>

          {/* Stage Indicators */}
          <div className="flex items-center justify-between overflow-x-auto">
            {BOOKING_STAGES.map((stage, index) => {
              const isActive = index === currentStageIndex;
              const isCompleted = completedStages.includes(index);
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(index)}
                  className={`flex flex-col items-center gap-1 min-w-[60px] transition-opacity ${
                    isActive ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40'
                  }`}
                  data-testid={`stage-button-${stage.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : isCompleted
                      ? 'bg-white/20 text-white border-white/40'
                      : 'bg-transparent text-white/40 border-white/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-[10px] text-center font-light tracking-wider text-white/80">
                    {stage.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={scrollableContentRef} className="w-full max-w-screen-md mx-auto px-4 py-6 pb-32">
        <div className="mb-6">
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">
            {currentStage.title}
          </h2>
          <p className="text-sm text-white/60 font-light">{currentStage.description}</p>
        </div>

        {renderStageContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 z-50">
        <div className="w-full max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider">Total Amount</p>
              {couponDiscount > 0 ? (
                <div className="flex items-center gap-3">
                  <p className="text-lg font-light text-white/60 line-through">{formatCurrency(basePrice)}</p>
                  <p className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</p>
                </div>
              ) : (
                <p className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {currentStageIndex > 0 && (
              <Button
                variant="outline"
                onClick={handlePreviousStage}
                className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none h-12"
                data-testid="button-previous"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNextStage}
              className={`${currentStageIndex > 0 ? 'flex-1' : 'w-full'} bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider uppercase`}
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
