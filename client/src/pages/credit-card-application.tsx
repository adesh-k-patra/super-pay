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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { creditCardApplicationFormSchema } from "@shared/schema";
import { z } from "zod";
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  CreditCard, 
  Shield, 
  FileText,
  User,
  Banknote,
  Home,
  ShieldCheck
} from "lucide-react";

type CreditCardApplicationForm = z.infer<typeof creditCardApplicationFormSchema>;

interface ApplicationStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const APPLICATION_STAGES: ApplicationStage[] = [
  { 
    id: 'personal-info', 
    title: 'Personal Information', 
    shortTitle: 'Personal', 
    icon: User, 
    description: 'Basic details'
  },
  { 
    id: 'employment-details', 
    title: 'Employment Details', 
    shortTitle: 'Employment', 
    icon: Banknote, 
    description: 'Work information'
  },
  { 
    id: 'address-details', 
    title: 'Address Details', 
    shortTitle: 'Address', 
    icon: Home, 
    description: 'Residence info'
  },
  { 
    id: 'documents', 
    title: 'Document Upload', 
    shortTitle: 'Documents', 
    icon: FileText, 
    description: 'KYC documents'
  },
  { 
    id: 'verification', 
    title: 'Verification', 
    shortTitle: 'Verify', 
    icon: Shield, 
    description: 'Final review'
  }
];

export default function CreditCardApplication() {
  const { goBack } = useNavigationHistory();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const [cardId, setCardId] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('cardId');
    if (id) {
      setCardId(id);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const currentStage = APPLICATION_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / APPLICATION_STAGES.length) * 100;

  const form = useForm<CreditCardApplicationForm>({
    resolver: zodResolver(creditCardApplicationFormSchema),
    defaultValues: {
      fullName: "Ananya Singh",
      email: "ananya.singh@example.com",
      mobile: "9876543210",
      dateOfBirth: "1992-08-20",
      gender: "female",
      panCard: "ABCDE1234F",
      employmentType: "salaried",
      company: "Infosys Technologies",
      monthlyIncome: "85000",
      currentAddress: "123, MG Road, Bangalore",
      residenceType: "owned"
    },
  });

  const handleNextStage = () => {
    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < APPLICATION_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      toast({
        title: "Application Submitted!",
        description: "Your credit card application is being processed",
      });
      setTimeout(() => {
        navigate("/credit-card-congratulations");
      }, 1500);
    }
  };

  const handleStageClick = (stageIndex: number) => {
    if (completedStages.includes(stageIndex) || stageIndex <= currentStageIndex) {
      setCurrentStageIndex(stageIndex);
    }
  };

  const onSubmit = (data: CreditCardApplicationForm) => {
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
                  <Input 
                    placeholder="Enter your full name as per PAN" 
                    className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                    data-testid="input-full-name" 
                    {...field} 
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
                      type="email" 
                      placeholder="email@example.com" 
                      className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                      data-testid="input-email" 
                      {...field} 
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
                      placeholder="10-digit number" 
                      className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                      data-testid="input-mobile" 
                      {...field} 
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

            <FormField control={form.control} name="panCard" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">PAN Card Number *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="ABCDE1234F" 
                    className="bg-white/5 border-white/10 text-white rounded-none h-12 uppercase" 
                    maxLength={10}
                    data-testid="input-pan" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        );

      case 1:
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
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business" className="text-white font-light">Business Owner</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="company" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Company/Business Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter company or business name" 
                    className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                    data-testid="input-company" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Monthly Income *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="₹25,000" 
                    className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                    data-testid="input-income" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField control={form.control} name="currentAddress" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Current Address *</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Enter your complete address"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-none p-3 min-h-[100px] resize-none"
                    data-testid="input-address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="residenceType" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-light">Residence Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-residence">
                      <SelectValue placeholder="Select residence type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-950 border-white/20">
                    <SelectItem value="owned" className="text-white">Owned</SelectItem>
                    <SelectItem value="rented" className="text-white">Rented</SelectItem>
                    <SelectItem value="company-provided" className="text-white">Company Provided</SelectItem>
                    <SelectItem value="with-parents" className="text-white">With Parents</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="border border-white/20 bg-white/5 p-4 rounded-none">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-white/60" />
                <h3 className="text-white font-light text-sm uppercase tracking-widest">Required Documents</h3>
              </div>
              <div className="space-y-3">
                <div className="border border-white/10 p-3 bg-white/5">
                  <Label className="text-white/60 text-xs uppercase tracking-wider font-light mb-2 block">PAN Card</Label>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-11">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PAN Card
                  </Button>
                </div>
                <div className="border border-white/10 p-3 bg-white/5">
                  <Label className="text-white/60 text-xs uppercase tracking-wider font-light mb-2 block">Aadhaar Card</Label>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-11">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Aadhaar Card
                  </Button>
                </div>
                <div className="border border-white/10 p-3 bg-white/5">
                  <Label className="text-white/60 text-xs uppercase tracking-wider font-light mb-2 block">Income Proof</Label>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-11">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Salary Slip / ITR
                  </Button>
                </div>
                <div className="border border-white/10 p-3 bg-white/5">
                  <Label className="text-white/60 text-xs uppercase tracking-wider font-light mb-2 block">Bank Statement (Optional)</Label>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-11">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Bank Statement
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 text-center">
              <ShieldCheck className="h-16 w-16 text-white/60 mx-auto mb-4" />
              <h3 className="text-white font-light text-base uppercase tracking-widest mb-2">Application Ready</h3>
              <p className="text-white/50 text-xs uppercase tracking-widest">
                Please review all details before final submission
              </p>
            </div>

            <div className="border border-white/20 bg-white/5 p-4">
              <h4 className="text-white font-light text-sm uppercase tracking-widest mb-3">Application Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">Name</span>
                  <span className="text-white">{form.watch("fullName") || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">Email</span>
                  <span className="text-white">{form.watch("email") || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">Mobile</span>
                  <span className="text-white">{form.watch("mobile") || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">Employment</span>
                  <span className="text-white capitalize">{form.watch("employmentType") || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">Monthly Income</span>
                  <span className="text-white">{form.watch("monthlyIncome") || "-"}</span>
                </div>
              </div>
            </div>

            <div className="border border-white/20 bg-white/5 p-4">
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" id="terms" />
                <Label htmlFor="terms" className="text-white/60 text-xs font-light">
                  I agree to the terms and conditions and authorize the bank to verify my details and credit information.
                </Label>
              </div>
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
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
              <h1 className="text-base font-bold tracking-wider">CREDIT CARD APPLICATION</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {currentStage.shortTitle}
              </p>
            </div>
            <div className="w-10"></div>
          </div>

          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Application Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {currentStageIndex + 1} of {APPLICATION_STAGES.length}
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-1 mb-4">
              <div 
                className="bg-white h-1 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              {APPLICATION_STAGES.map((stage, index) => {
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

      <div ref={scrollableContentRef} className="pt-64 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        <div className="space-y-2">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <currentStage.icon className="h-3 w-3" />
            {currentStage.title}
          </Label>
          <p className="text-xs text-white/40 font-light">{currentStage.description}</p>
        </div>
          
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {renderStageContent()}
          </form>
        </Form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center gap-4">
            {currentStageIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStageIndex(currentStageIndex - 1)}
                className="flex-1 border-white/20 text-white hover:bg-white/10 font-light h-12 rounded-none tracking-widest text-xs uppercase"
                data-testid="button-previous"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={() => {
                handleNextStage();
              }}
              className="flex-1 bg-white text-black hover:bg-white/90 font-light h-12 rounded-none tracking-widest text-xs uppercase"
              data-testid="button-next"
            >
              {currentStageIndex === APPLICATION_STAGES.length - 1 ? 'Submit Application' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
