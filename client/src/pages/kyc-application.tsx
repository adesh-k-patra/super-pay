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
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  Shield, 
  FileText,
  User,
  MapPin,
  CreditCard,
  Camera,
  Video,
  ShieldCheck
} from "lucide-react";

const kycFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  maritalStatus: z.string().optional(),
  
  aadhaarNumber: z.string().optional(),
  panNumber: z.string().optional(),
  
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  residenceType: z.string().optional(),
});

type KYCApplicationForm = z.infer<typeof kycFormSchema>;

interface KYCStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  estimatedTime: string;
}

const KYC_STAGES: KYCStage[] = [
  { 
    id: 'basic-info', 
    title: 'Basic Information', 
    shortTitle: 'Basic',
    icon: User, 
    description: 'Personal details and contact information',
    estimatedTime: '2 mins'
  },
  { 
    id: 'identity', 
    title: 'Identity Verification', 
    shortTitle: 'Identity',
    icon: CreditCard, 
    description: 'Aadhaar and PAN card details',
    estimatedTime: '3 mins'
  },
  { 
    id: 'address', 
    title: 'Address Verification', 
    shortTitle: 'Address',
    icon: MapPin, 
    description: 'Current residential address',
    estimatedTime: '3 mins'
  },
  { 
    id: 'documents', 
    title: 'Document Upload', 
    shortTitle: 'Documents',
    icon: FileText, 
    description: 'Upload identity and address proof',
    estimatedTime: '5 mins'
  },
  { 
    id: 'video-kyc', 
    title: 'Video KYC', 
    shortTitle: 'Video',
    icon: Video, 
    description: 'Complete video verification',
    estimatedTime: '10 mins'
  }
];

export default function KYCApplication() {
  const { goBack } = useNavigationHistory();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{[key: string]: string}>({});

  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const currentStage = KYC_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / KYC_STAGES.length) * 100;

  const form = useForm<KYCApplicationForm>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      mobile: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
      gender: user?.gender || "",
      fatherName: "",
      motherName: "",
      maritalStatus: user?.maritalStatus || "",
      aadhaarNumber: "",
      panNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: user?.pincode || "",
      residenceType: user?.residenceType || "",
    },
  });

  const handleNextStage = () => {
    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < KYC_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    } else {
      toast({
        title: "KYC Application Submitted",
        description: "Your KYC verification is in progress",
      });
      setTimeout(() => {
        navigate("/profile/about");
      }, 1500);
    }
  };

  const handleStageClick = (stageIndex: number) => {
    if (completedStages.includes(stageIndex) || stageIndex <= currentStageIndex) {
      setCurrentStageIndex(stageIndex);
    }
  };

  const handleFileUpload = (docType: string, file: File | null) => {
    if (file) {
      setUploadedDocs({ ...uploadedDocs, [docType]: file.name });
      toast({
        title: "Document Uploaded",
        description: `${docType} uploaded successfully`,
      });
    }
  };

  const onSubmit = (data: KYCApplicationForm) => {
    handleNextStage();
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'basic-info':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Full Name (as per PAN)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-fullname" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Mobile</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-mobile" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker 
                        value={field.value} 
                        onChange={field.onChange}
                        placeholder="Select date of birth"
                        className="bg-white/5 border-white/10 text-white"
                        data-testid="input-dob"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Father's Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-father-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Aadhaar Number</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={12} placeholder="XXXX XXXX XXXX" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-aadhaar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">PAN Number</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={10} placeholder="ABCDE1234F" className="bg-white/5 border-white/10 text-white rounded-none uppercase h-12" data-testid="input-pan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-white/60 font-light">
                    <p className="mb-1">Your data is secure with us</p>
                    <p className="text-xs">All information is encrypted and stored securely as per government guidelines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="House/Flat No, Building Name" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-address1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Street, Area, Locality" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-address2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">City</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">State</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Pincode</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={6} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-pincode" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="residenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 font-light uppercase tracking-wider text-xs">Residence Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Parental">Parental</SelectItem>
                      <SelectItem value="Company Provided">Company Provided</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-white/60" />
                  <Label className="text-white font-light uppercase tracking-wider text-xs">Aadhaar Card</Label>
                </div>
                {uploadedDocs['aadhaar'] && (
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload('aadhaar', e.target.files?.[0] || null)}
                className="bg-white/5 border-white/10 text-white rounded-none"
                data-testid="upload-aadhaar"
              />
              {uploadedDocs['aadhaar'] && (
                <p className="text-xs text-white/60 mt-2 font-light">{uploadedDocs['aadhaar']}</p>
              )}
            </div>

            <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-white/60" />
                  <Label className="text-white font-light uppercase tracking-wider text-xs">PAN Card</Label>
                </div>
                {uploadedDocs['pan'] && (
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload('pan', e.target.files?.[0] || null)}
                className="bg-white/5 border-white/10 text-white rounded-none"
                data-testid="upload-pan"
              />
              {uploadedDocs['pan'] && (
                <p className="text-xs text-white/60 mt-2 font-light">{uploadedDocs['pan']}</p>
              )}
            </div>

            <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-white/60" />
                  <Label className="text-white font-light uppercase tracking-wider text-xs">Selfie</Label>
                </div>
                {uploadedDocs['selfie'] && (
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('selfie', e.target.files?.[0] || null)}
                className="bg-white/5 border-white/10 text-white rounded-none"
                data-testid="upload-selfie"
              />
              {uploadedDocs['selfie'] && (
                <p className="text-xs text-white/60 mt-2 font-light">{uploadedDocs['selfie']}</p>
              )}
            </div>
          </div>
        );

      case 'video-kyc':
        return (
          <div className="space-y-4">
            <Card className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/10 border border-white/20 flex items-center justify-center">
                  <Video className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-light text-white tracking-wider mb-2">Video KYC Verification</h3>
                <p className="text-sm text-white/60 font-light mb-6">
                  Complete a quick video call with our verification team to complete your KYC
                </p>
                <div className="space-y-3 text-left mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-light">Keep your documents ready</p>
                      <p className="text-xs text-white/60">Original Aadhaar and PAN card</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-light">Ensure good lighting</p>
                      <p className="text-xs text-white/60">Bright, well-lit room</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-light">Stable internet connection</p>
                      <p className="text-xs text-white/60">Minimum 2 Mbps speed recommended</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

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
              <h1 className="text-base font-bold tracking-wider">KYC VERIFICATION</h1>
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
                Step {currentStageIndex + 1} of {KYC_STAGES.length}
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
              {KYC_STAGES.map((stage, index) => {
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
        {/* Info Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <currentStage.icon className="h-5 w-5 text-white/60" />
              <div>
                <p className="text-white font-light text-sm">{currentStage.title}</p>
                <p className="text-white/60 text-xs">{currentStage.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Estimated</p>
              <p className="text-white font-light text-sm">{currentStage.estimatedTime}</p>
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
              <p className="text-xs text-white/60 font-light">KYC Verification</p>
              <p className="text-sm text-white font-light">Step {currentStageIndex + 1} of {KYC_STAGES.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 uppercase tracking-widest font-light">Estimated Time</p>
              <p className="text-xl font-light text-white">{currentStage.estimatedTime}</p>
            </div>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === KYC_STAGES.length - 1 ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                SUBMIT KYC APPLICATION
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
