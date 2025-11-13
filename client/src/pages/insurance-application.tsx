import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  Shield, 
  FileText,
  Home,
  User,
  Car,
  Bike,
  Heart,
  ShieldCheck
} from "lucide-react";

const insuranceApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  occupation: z.string().optional(),
  annualIncome: z.string().optional(),
  coverageAmount: z.string().optional(),
  policyTenure: z.string().optional(),
  premiumPayment: z.string().optional(),
  policyTerm: z.string().optional(),
  medicalHistory: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleValue: z.string().optional(),
  propertyType: z.string().optional(),
  propertyValue: z.string().optional(),
});

type InsuranceApplicationForm = z.infer<typeof insuranceApplicationSchema>;
type InsuranceType = 'car' | 'bike' | 'health' | 'home' | 'travel';

interface InsuranceStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fields: string[];
}

interface InsuranceConfig {
  type: InsuranceType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  maxCoverage: string;
  premium: string;
  processingTime: string;
  stages: InsuranceStage[];
}

const INSURANCE_CONFIGURATIONS: Record<InsuranceType, InsuranceConfig> = {
  car: {
    type: 'car',
    name: 'Car Insurance',
    icon: Car,
    maxCoverage: '₹1 Crore',
    premium: 'From ₹5,000/year',
    processingTime: 'Instant',
    stages: [
      { id: 'customize-policy', title: 'Customize Your Policy', shortTitle: 'Policy', icon: Shield, description: 'Configure coverage', fields: ['Coverage amount', 'Policy tenure', 'Premium payment'] },
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Your details', fields: ['Full name', 'Mobile', 'Email', 'Date of birth', 'Gender'] },
      { id: 'vehicle-details', title: 'Vehicle Information', shortTitle: 'Vehicle', icon: Car, description: 'Car details', fields: ['Vehicle model', 'Year', 'Value'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'KYC and proof', fields: ['PAN card', 'Aadhaar', 'RC book', 'Previous policy'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Verify', icon: ShieldCheck, description: 'Final review', fields: ['OTP verification', 'Final review'] }
    ]
  },
  bike: {
    type: 'bike',
    name: 'Bike Insurance',
    icon: Bike,
    maxCoverage: '₹25 Lakh',
    premium: 'From ₹2,000/year',
    processingTime: 'Instant',
    stages: [
      { id: 'customize-policy', title: 'Customize Your Policy', shortTitle: 'Policy', icon: Shield, description: 'Configure coverage', fields: ['Coverage amount', 'Policy tenure', 'Premium payment'] },
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Your details', fields: ['Full name', 'Mobile', 'Email'] },
      { id: 'vehicle-details', title: 'Bike Information', shortTitle: 'Bike', icon: Bike, description: 'Bike details', fields: ['Model', 'Year', 'Value'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'KYC documents', fields: ['PAN', 'Aadhaar', 'RC book'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Verify', icon: ShieldCheck, description: 'Verification', fields: ['OTP verification'] }
    ]
  },
  health: {
    type: 'health',
    name: 'Health Insurance',
    icon: Heart,
    maxCoverage: '₹1 Crore',
    premium: 'From ₹10,000/year',
    processingTime: '24 hours',
    stages: [
      { id: 'customize-policy', title: 'Customize Your Policy', shortTitle: 'Policy', icon: Shield, description: 'Configure coverage', fields: ['Coverage amount', 'Policy tenure', 'Premium payment'] },
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Applicant details', fields: ['Full name', 'Contact', 'DOB'] },
      { id: 'health-details', title: 'Health Information', shortTitle: 'Health', icon: Heart, description: 'Medical history', fields: ['Medical history', 'Pre-existing conditions'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'Medical records', fields: ['PAN', 'Aadhaar', 'Medical reports'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Approval', icon: ShieldCheck, description: 'Medical check', fields: ['Health check', 'Approval'] }
    ]
  },
  home: {
    type: 'home',
    name: 'Home Insurance',
    icon: Home,
    maxCoverage: '₹5 Crore',
    premium: 'From ₹8,000/year',
    processingTime: '48 hours',
    stages: [
      { id: 'customize-policy', title: 'Customize Your Policy', shortTitle: 'Policy', icon: Shield, description: 'Configure coverage', fields: ['Coverage amount', 'Policy tenure', 'Premium payment'] },
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Owner details', fields: ['Full name', 'Contact'] },
      { id: 'property-details', title: 'Property Information', shortTitle: 'Property', icon: Home, description: 'Home details', fields: ['Property type', 'Value', 'Location'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'Property papers', fields: ['Property papers', 'PAN', 'Aadhaar'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Verify', icon: ShieldCheck, description: 'Property check', fields: ['Property verification'] }
    ]
  },
  travel: {
    type: 'travel',
    name: 'Travel Insurance',
    icon: Shield,
    maxCoverage: '₹50 Lakh',
    premium: 'From ₹500/trip',
    processingTime: 'Instant',
    stages: [
      { id: 'customize-policy', title: 'Customize Your Policy', shortTitle: 'Policy', icon: Shield, description: 'Configure coverage', fields: ['Coverage amount', 'Policy tenure', 'Premium payment'] },
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Traveler details', fields: ['Full name', 'Contact'] },
      { id: 'travel-details', title: 'Travel Information', shortTitle: 'Travel', icon: Shield, description: 'Trip details', fields: ['Destination', 'Duration', 'Purpose'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'KYC documents', fields: ['PAN', 'Aadhaar', 'Passport'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Confirm', icon: ShieldCheck, description: 'Final review', fields: ['Verification'] }
    ]
  }
};

export default function InsuranceApplication() {
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<InsuranceType>('car');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const insuranceType = urlParams.get('insuranceType') as InsuranceType;
    if (insuranceType && insuranceType in INSURANCE_CONFIGURATIONS) {
      setSelectedInsuranceType(insuranceType);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const currentConfig = INSURANCE_CONFIGURATIONS[selectedInsuranceType];
  const currentStages = currentConfig.stages;
  const currentStage = currentStages[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / currentStages.length) * 100;

  const form = useForm<InsuranceApplicationForm>({
    resolver: zodResolver(insuranceApplicationSchema),
    defaultValues: {
      fullName: "Vikram Malhotra", 
      email: "vikram.malhotra@example.com", 
      mobile: "9876543210", 
      dateOfBirth: "1988-03-12", 
      gender: "male",
      occupation: "software-engineer", 
      annualIncome: "1200000", 
      coverageAmount: "500000", 
      policyTenure: "1", 
      premiumPayment: "monthly", 
      policyTerm: "5",
      medicalHistory: "none", 
      vehicleModel: "Honda City", 
      vehicleYear: "2020", 
      vehicleValue: "800000",
      propertyType: "apartment", 
      propertyValue: "5000000"
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      fullName: "Vikram Malhotra", 
      email: "vikram.malhotra@example.com", 
      mobile: "9876543210", 
      dateOfBirth: "1988-03-12", 
      gender: "male",
      occupation: "software-engineer", 
      annualIncome: "1200000", 
      coverageAmount: "500000", 
      policyTenure: "1", 
      premiumPayment: "monthly", 
      policyTerm: "5",
      medicalHistory: "none", 
      vehicleModel: "Honda City", 
      vehicleYear: "2020", 
      vehicleValue: "800000",
      propertyType: "apartment", 
      propertyValue: "5000000"
    });
  }, [selectedInsuranceType]);

  const handleNextStage = () => {
    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < currentStages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      toast({
        title: "Application Submitted!",
        description: "Your insurance application is being processed",
      });
      setTimeout(() => {
        navigate("/insurance-congratulations");
      }, 1500);
    }
  };

  const handleStageClick = (stageIndex: number) => {
    if (completedStages.includes(stageIndex) || stageIndex <= currentStageIndex) {
      setCurrentStageIndex(stageIndex);
    }
  };

  const onSubmit = (data: InsuranceApplicationForm) => {
    handleNextStage();
  };

  const handleContinueClick = () => {
    if (currentStageIndex === 1) {
      form.handleSubmit(onSubmit)();
    } else {
      handleNextStage();
    }
  };

  const renderStageContent = () => {
    switch (currentStageIndex) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField control={form.control} name="coverageAmount" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider mb-4 block font-light">Coverage Amount</FormLabel>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-3 gap-4" data-testid="radio-coverage-amount">
                    <Label
                      htmlFor="coverage-1l"
                      className={cn(
                        "flex flex-col items-center justify-center p-6 border-2 cursor-pointer transition-all",
                        field.value === "100000" ? "border-white bg-white/10" : "border-white/20 hover:border-white/40"
                      )}
                    >
                      <RadioGroupItem value="100000" id="coverage-1l" className="sr-only" />
                      <span className="text-2xl font-bold text-white">₹1L</span>
                      <span className="text-xs text-white/60 mt-1">Basic</span>
                    </Label>
                    <Label
                      htmlFor="coverage-5l"
                      className={cn(
                        "flex flex-col items-center justify-center p-6 border-2 cursor-pointer transition-all",
                        field.value === "500000" ? "border-white bg-white/10" : "border-white/20 hover:border-white/40"
                      )}
                    >
                      <RadioGroupItem value="500000" id="coverage-5l" className="sr-only" />
                      <span className="text-2xl font-bold text-white">₹5L</span>
                      <span className="text-xs text-white/60 mt-1">Standard</span>
                    </Label>
                    <Label
                      htmlFor="coverage-20l"
                      className={cn(
                        "flex flex-col items-center justify-center p-6 border-2 cursor-pointer transition-all",
                        field.value === "2000000" ? "border-white bg-white/10" : "border-white/20 hover:border-white/40"
                      )}
                    >
                      <RadioGroupItem value="2000000" id="coverage-20l" className="sr-only" />
                      <span className="text-2xl font-bold text-white">₹20L</span>
                      <span className="text-xs text-white/60 mt-1">Premium</span>
                    </Label>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="policyTenure" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Policy Tenure</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-policy-tenure">
                      <SelectValue placeholder="Select tenure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-950 border-white/20">
                    <SelectItem value="1" className="text-white">1 Year</SelectItem>
                    <SelectItem value="2" className="text-white">2 Years</SelectItem>
                    <SelectItem value="3" className="text-white">3 Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="premiumPayment" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Premium Payment</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-premium-payment">
                      <SelectValue placeholder="Select payment frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-950 border-white/20">
                    <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                    <SelectItem value="quarterly" className="text-white">Quarterly</SelectItem>
                    <SelectItem value="annually" className="text-white">Annually</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <FormField control={form.control} name="fullName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Full Name *</FormLabel>
                <FormControl>
                  <Input 
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="Enter your full name" 
                    className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                    data-testid="input-full-name" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Email *</FormLabel>
                  <FormControl>
                    <Input 
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      type="email" 
                      placeholder="email@example.com" 
                      className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                      data-testid="input-email" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Mobile *</FormLabel>
                  <FormControl>
                    <Input 
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="10-digit number" 
                      className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                      data-testid="input-mobile" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Date of Birth *</FormLabel>
                  <FormControl>
                    <DatePicker 
                      value={field.value} 
                      onChange={field.onChange}
                      placeholder="Select date of birth"
                      className="bg-white/5 border-white/10 text-white"
                      data-testid="input-date-of-birth"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Gender *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-950 border-white/20">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-white/60 font-light">Complete the form to proceed</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/insurance")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">{currentConfig.name.toUpperCase()}</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {currentStage.shortTitle}
              </p>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Progress Section */}
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Application Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {currentStageIndex + 1} of {currentStages.length}
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
              {currentStages.map((stage, index) => {
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

      {/* Scrollable Content */}
      <div ref={scrollableContentRef} className="pt-64 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Insurance Info Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <currentConfig.icon className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{currentConfig.name}</p>
                <p className="text-white/60 text-xs">Max Coverage: {currentConfig.maxCoverage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{currentConfig.premium}</p>
              <p className="text-white/60 text-xs">{currentConfig.processingTime}</p>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {renderStageContent()}
          </form>
        </Form>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">{currentConfig.name}</p>
              <p className="text-sm text-white font-light">Step {currentStageIndex + 1} of {currentStages.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Premium</p>
              <p className="text-xl font-light text-white">{currentConfig.premium}</p>
            </div>
          </div>
          <Button
            onClick={handleContinueClick}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === currentStages.length - 1 ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                SUBMIT APPLICATION
              </>
            ) : (
              <>
                CONTINUE
                <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
