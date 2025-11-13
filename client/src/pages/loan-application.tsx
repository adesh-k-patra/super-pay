import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
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
import { z } from "zod";
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  Shield, 
  FileText,
  Building,
  Home,
  User,
  Car,
  GraduationCap,
  Banknote,
  Target,
  IndianRupee,
  ShieldCheck
} from "lucide-react";

const loanApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  employmentType: z.string().optional(),
  company: z.string().optional(),
  monthlyIncome: z.string().optional(),
  experience: z.string().optional(),
  propertyType: z.string().optional(),
  propertyValue: z.string().optional(),
  loanAmount: z.string().optional(),
  tenure: z.string().optional(),
  purpose: z.string().optional(),
});

type LoanApplicationForm = z.infer<typeof loanApplicationSchema>;
type LoanType = 'personal' | 'home' | 'business' | 'car' | 'education';

interface LoanStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fields: string[];
}

interface LoanConfig {
  type: LoanType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  maxAmount: string;
  rate: string;
  processingTime: string;
  stages: LoanStage[];
}

const LOAN_CONFIGURATIONS: Record<LoanType, LoanConfig> = {
  personal: {
    type: 'personal',
    name: 'Personal Loan',
    icon: User,
    maxAmount: '₹50 Lakh',
    rate: '10.99%',
    processingTime: '10 minutes',
    stages: [
      { id: 'basic-info', title: 'Basic Information', shortTitle: 'Basic', icon: User, description: 'Personal details', fields: ['Full name', 'Mobile', 'Email', 'Date of birth', 'Gender'] },
      { id: 'employment', title: 'Employment Details', shortTitle: 'Employment', icon: Banknote, description: 'Work information', fields: ['Employment type', 'Company', 'Monthly income', 'Experience'] },
      { id: 'loan-details', title: 'Loan Requirements', shortTitle: 'Loan', icon: CreditCard, description: 'Amount and purpose', fields: ['Loan amount', 'Tenure', 'Purpose'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'KYC and proof', fields: ['PAN card', 'Aadhaar', 'Salary slips', 'Bank statements'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Verify', icon: Shield, description: 'Final review', fields: ['OTP verification', 'Final review'] }
    ]
  },
  home: {
    type: 'home',
    name: 'Home Loan',
    icon: Home,
    maxAmount: '₹5 Crore',
    rate: '8.50%',
    processingTime: '7-15 days',
    stages: [
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Applicant details', fields: ['Full name', 'Contact', 'Employment'] },
      { id: 'property-details', title: 'Property Information', shortTitle: 'Property', icon: Home, description: 'Property details', fields: ['Property type', 'Location', 'Cost'] },
      { id: 'financial-details', title: 'Financial Details', shortTitle: 'Financial', icon: Banknote, description: 'Income details', fields: ['Monthly income', 'Existing loans'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'Property papers', fields: ['Property papers', 'Income proof', 'KYC'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Approval', icon: Shield, description: 'Verification', fields: ['Technical evaluation', 'Legal verification'] }
    ]
  },
  business: {
    type: 'business',
    name: 'Business Loan',
    icon: Building,
    maxAmount: '₹2 Crore',
    rate: '12.50%',
    processingTime: '3-7 days',
    stages: [
      { id: 'basic-info', title: 'Business Information', shortTitle: 'Business', icon: Building, description: 'Company details', fields: ['Business name', 'Type', 'Registration'] },
      { id: 'financial-details', title: 'Financial Performance', shortTitle: 'Financials', icon: Banknote, description: 'Business financials', fields: ['Annual turnover', 'Revenue', 'Bank statements'] },
      { id: 'loan-purpose', title: 'Loan Purpose', shortTitle: 'Purpose', icon: Target, description: 'Funding requirements', fields: ['Loan amount', 'Purpose'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'Business documents', fields: ['ITR', 'GST returns', 'Financials'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Verification', icon: Shield, description: 'Business verification', fields: ['Business verification', 'Assessment'] }
    ]
  },
  car: {
    type: 'car',
    name: 'Car Loan',
    icon: Car,
    maxAmount: '₹1 Crore',
    rate: '9.25%',
    processingTime: 'Same day',
    stages: [
      { id: 'basic-info', title: 'Personal Information', shortTitle: 'Personal', icon: User, description: 'Personal details', fields: ['Full name', 'Contact', 'Employment'] },
      { id: 'vehicle-details', title: 'Vehicle Information', shortTitle: 'Vehicle', icon: Car, description: 'Car details', fields: ['Car model', 'Variant', 'Price'] },
      { id: 'financial-details', title: 'Financial Details', shortTitle: 'Financial', icon: Banknote, description: 'Income and payment', fields: ['Monthly income', 'Down payment'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'KYC documents', fields: ['PAN', 'Aadhaar', 'Income proof', 'Driving license'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Verify', icon: Shield, description: 'Fast approval', fields: ['Document verification', 'Credit check'] }
    ]
  },
  education: {
    type: 'education',
    name: 'Education Loan',
    icon: GraduationCap,
    maxAmount: '₹1.5 Crore',
    rate: '11.50%',
    processingTime: '7-21 days',
    stages: [
      { id: 'student-info', title: 'Student Information', shortTitle: 'Student', icon: User, description: 'Student details', fields: ['Student name', 'Contact'] },
      { id: 'course-details', title: 'Course Information', shortTitle: 'Course', icon: GraduationCap, description: 'Program details', fields: ['Institution', 'Course', 'Fees'] },
      { id: 'co-applicant', title: 'Co-applicant Details', shortTitle: 'Co-applicant', icon: User, description: 'Guardian info', fields: ['Co-applicant name', 'Income'] },
      { id: 'documents', title: 'Document Upload', shortTitle: 'Documents', icon: FileText, description: 'Academic documents', fields: ['Admission letter', 'Fee structure', 'KYC'] },
      { id: 'verification', title: 'Verification', shortTitle: 'Approval', icon: Shield, description: 'Verification', fields: ['Document verification', 'Course validation'] }
    ]
  }
};

export default function LoanApplication() {
  const { goBack } = useNavigationHistory();
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>('personal');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loanType = urlParams.get('loanType') as LoanType;
    if (loanType && loanType in LOAN_CONFIGURATIONS) {
      setSelectedLoanType(loanType);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const currentConfig = LOAN_CONFIGURATIONS[selectedLoanType];
  const currentStages = currentConfig.stages;
  const currentStage = currentStages[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / currentStages.length) * 100;

  const form = useForm<LoanApplicationForm>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      fullName: "Rajesh Kumar", 
      email: "rajesh.kumar@example.com", 
      mobile: "9876543210", 
      dateOfBirth: "1990-05-15", 
      gender: "male",
      employmentType: "salaried", 
      company: "Tech Solutions Pvt Ltd", 
      monthlyIncome: "75000", 
      experience: "3-5",
      propertyType: "apartment", 
      propertyValue: "5000000", 
      loanAmount: "500000", 
      tenure: "24", 
      purpose: "debt-consolidation"
    },
  });

  const handleNextStage = () => {
    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < currentStages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      toast({
        title: "Application Submitted!",
        description: "Your loan application is being processed",
      });
      setTimeout(() => {
        navigate("/loan-congratulations");
      }, 1500);
    }
  };

  const handleStageClick = (stageIndex: number) => {
    if (completedStages.includes(stageIndex) || stageIndex <= currentStageIndex) {
      setCurrentStageIndex(stageIndex);
    }
  };

  const onSubmit = (data: LoanApplicationForm) => {
    handleNextStage();
  };

  const renderStageContent = () => {
    switch (currentStageIndex) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField control={form.control} name="fullName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-full-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Mobile *</FormLabel>
                  <FormControl>
                    <Input placeholder="10-digit number" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-mobile" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-950 border-white/20">
                      <SelectItem value="male" className="text-white">Male</SelectItem>
                      <SelectItem value="female" className="text-white">Female</SelectItem>
                      <SelectItem value="other" className="text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        );

      case 1:
        if (selectedLoanType === 'personal') {
          return (
            <div className="space-y-4">
              <FormField control={form.control} name="employmentType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Employment Type *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2" data-testid="radio-employment-type">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="salaried" id="salaried" />
                        <Label htmlFor="salaried" className="text-white font-light">Salaried</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self-employed" id="self-employed" />
                        <Label htmlFor="self-employed" className="text-white font-light">Self Employed</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Monthly Income *</FormLabel>
                    <FormControl>
                      <Input placeholder="₹25,000" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-income" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Work Experience *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-experience">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-950 border-white/20">
                        <SelectItem value="0-1" className="text-white">0-1 years</SelectItem>
                        <SelectItem value="1-3" className="text-white">1-3 years</SelectItem>
                        <SelectItem value="3-5" className="text-white">3-5 years</SelectItem>
                        <SelectItem value="5+" className="text-white">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          );
        }
        return <div className="text-center py-8"><p className="text-white/60 font-light">Complete the form to proceed</p></div>;

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
              onClick={() => goBack()}
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
        {/* Loan Info Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <currentConfig.icon className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{currentConfig.name}</p>
                <p className="text-white/60 text-xs">Up to {currentConfig.maxAmount}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-light text-sm">{currentConfig.rate} p.a.</p>
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
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Interest Rate</p>
              <p className="text-xl font-light text-white">{currentConfig.rate}</p>
            </div>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
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
