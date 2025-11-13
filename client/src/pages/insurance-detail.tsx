import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsuranceClaim } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  Upload,
  Plus,
  Activity,
  AlertCircle,
  Download
} from "lucide-react";

const claimFormSchema = z.object({
  claimType: z.string().min(1, "Claim type is required"),
  incidentDate: z.string().min(1, "Incident date is required"),
  claimAmount: z.string().min(1, "Claim amount is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hospitalName: z.string().optional(),
  doctorName: z.string().optional(),
});

type ClaimFormValues = z.infer<typeof claimFormSchema>;


export default function InsuranceDetail() {
  const params = useParams();
  const policyId = params.id || params.policyId;
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [isClaimDetailOpen, setIsClaimDetailOpen] = useState(false);
  
  // Check if this is an insurance marketplace page (not my-insurance)
  const isMarketplacePage = location.startsWith('/insurance/');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock policies database
  const mockPolicies = {
    "pol-1": {
      id: "pol-1",
      policyNumber: "HLTH-2024-001234",
      policyName: "Family Health Shield",
      insuranceType: "health",
      provider: "Star Health Insurance",
      status: "active",
      premium: 25000,
      coverageAmount: 500000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      nextDueDate: "2025-01-01",
      beneficiaries: ["Self", "Spouse", "2 Children"],
      description: "Comprehensive health insurance plan covering hospitalization, pre and post hospitalization expenses, day care procedures, and ambulance charges.",
      benefits: [
        "Cashless hospitalization at 10,000+ network hospitals",
        "Pre-hospitalization expenses covered for 30 days",
        "Post-hospitalization expenses covered for 60 days",
        "No claim bonus of 10% per year (up to 50%)",
        "Annual health check-up included",
        "Maternity coverage up to ₹50,000",
        "Ambulance charges up to ₹2,000 per hospitalization"
      ],
      contact: {
        phone: "1800-XXX-XXXX",
        email: "support@starhealth.in",
        address: "Star Health Building, Chennai - 600001"
      }
    },
    "pol-2": {
      id: "pol-2",
      policyNumber: "LIFE-2023-005678",
      policyName: "Term Life Plus",
      insuranceType: "life",
      provider: "LIC of India",
      status: "active",
      premium: 15000,
      coverageAmount: 10000000,
      startDate: "2023-06-15",
      endDate: "2043-06-15",
      nextDueDate: "2025-06-15",
      beneficiaries: ["Spouse", "Children"],
      description: "Comprehensive term life insurance providing financial security for your loved ones with extensive coverage and flexible premium payment options.",
      benefits: [
        "Life coverage up to ₹1 Crore",
        "Tax benefits under Section 80C and 10(10D)",
        "Critical illness rider available",
        "Accidental death benefit rider",
        "Flexible premium payment terms",
        "Online policy management"
      ],
      contact: {
        phone: "1800-XXX-YYYY",
        email: "support@licindia.com",
        address: "LIC Building, Mumbai - 400001"
      }
    },
    "pol-3": {
      id: "pol-3",
      policyNumber: "VEH-2024-009876",
      policyName: "Comprehensive Car Insurance",
      insuranceType: "vehicle",
      provider: "HDFC ERGO",
      status: "active",
      premium: 12000,
      coverageAmount: 800000,
      startDate: "2024-03-01",
      endDate: "2025-03-01",
      nextDueDate: "2025-03-01",
      beneficiaries: undefined,
      description: "Complete protection for your vehicle with zero depreciation cover, engine protection, and 24x7 roadside assistance.",
      benefits: [
        "Zero depreciation cover",
        "Engine protection",
        "24x7 roadside assistance",
        "Cashless repairs at 7,500+ garages",
        "Personal accident cover up to ₹15 lakhs",
        "Key and lock replacement",
        "Return to invoice cover"
      ],
      contact: {
        phone: "1800-XXX-ZZZZ",
        email: "support@hdfcergo.com",
        address: "HDFC ERGO Building, Pune - 411001"
      }
    },
    "star-health": {
      id: "star-health",
      policyNumber: "STAR-2024-FH-001",
      policyName: "Star Family Health Insurance",
      insuranceType: "health",
      provider: "Star Health",
      status: "active",
      premium: 15000,
      coverageAmount: 1000000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      nextDueDate: "2025-01-01",
      beneficiaries: ["Self", "Spouse", "2 Children"],
      description: "Star Family Health Insurance provides comprehensive coverage for your entire family with a wide network of cashless hospitals, pre & post hospitalization benefits, and annual health checkups.",
      benefits: [
        "Family Floater - Cover for entire family",
        "Pre & Post Hospitalization - 60/90 days coverage",
        "Day Care Procedures - 300+ procedures covered",
        "Annual Health Checkup - Free yearly checkup",
        "Cashless hospitalization at 12,000+ network hospitals",
        "No claim bonus of 10% per year (up to 50%)",
        "Maternity coverage included",
        "Ambulance charges covered"
      ],
      contact: {
        phone: "1800-425-2255",
        email: "support@starhealth.in",
        address: "Star Health Building, Chennai - 600001"
      }
    },
    "hdfc-car": {
      id: "hdfc-car",
      policyNumber: "HDFC-2024-CAR-001",
      policyName: "Comprehensive Car Insurance",
      insuranceType: "vehicle",
      provider: "HDFC ERGO",
      status: "active",
      premium: 12000,
      coverageAmount: 500000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      nextDueDate: "2025-01-01",
      beneficiaries: undefined,
      description: "Complete protection for your vehicle with comprehensive coverage including zero depreciation, engine protection, and 24x7 roadside assistance.",
      benefits: [
        "Zero Depreciation - Full coverage without depreciation",
        "Engine Protection - Protect your engine from damage",
        "24x7 Roadside Assistance - Help anytime, anywhere",
        "No Claim Bonus - Save up to 50% on renewal",
        "Cashless repairs at 7,500+ garages",
        "Personal accident cover included",
        "Return to invoice cover available"
      ],
      contact: {
        phone: "1800-266-9966",
        email: "support@hdfcergo.com",
        address: "HDFC ERGO Building, Mumbai - 400001"
      }
    },
    "bajaj-bike": {
      id: "bajaj-bike",
      policyNumber: "BAJAJ-2024-BIKE-001",
      policyName: "Two Wheeler Insurance Pro",
      insuranceType: "vehicle",
      provider: "Bajaj Allianz",
      status: "active",
      premium: 3500,
      coverageAmount: 200000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      nextDueDate: "2025-01-01",
      beneficiaries: undefined,
      description: "Comprehensive two-wheeler insurance with personal accident cover, zero depreciation, and engine protection for complete peace of mind.",
      benefits: [
        "Personal Accident Cover - Up to ₹2 lakhs",
        "Zero Depreciation - No depreciation on claims",
        "Engine Protection - Cover for engine damage",
        "Quick Claims - Settlement within 7 days",
        "24x7 Support - Round the clock assistance",
        "Doorstep Service - Claims at your doorstep",
        "Cashless repairs at 4,200+ garages"
      ],
      contact: {
        phone: "1800-209-5858",
        email: "support@bajajallianz.com",
        address: "Bajaj Allianz Building, Pune - 411001"
      }
    },
    "icici-car": {
      id: "icici-car",
      policyNumber: "ICICI-2024-PLAT-001",
      policyName: "Car Insurance Platinum",
      insuranceType: "vehicle",
      provider: "ICICI Lombard",
      status: "active",
      premium: 18000,
      coverageAmount: 750000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      nextDueDate: "2025-01-01",
      beneficiaries: undefined,
      description: "Premium car insurance with comprehensive coverage, zero depreciation, return to invoice, and concierge services for luxury car owners.",
      benefits: [
        "Zero Depreciation - Full part replacement",
        "Return to Invoice - Get full invoice value on total loss",
        "Engine Protection - Comprehensive engine cover",
        "Key Replacement - Lost key replacement cover",
        "Premium Service - Express claim settlement",
        "Concierge Services - Premium assistance",
        "Cashless repairs at 6,800+ garages"
      ],
      contact: {
        phone: "1800-266-7766",
        email: "support@icicilombard.com",
        address: "ICICI Lombard Building, Mumbai - 400001"
      }
    },
    "care-health": {
      id: "care-health",
      policyNumber: "CARE-2024-SUP-001",
      policyName: "Care Supreme Health Plan",
      insuranceType: "health",
      provider: "Care Health",
      status: "active",
      premium: 25000,
      coverageAmount: 2000000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      nextDueDate: "2025-01-01",
      beneficiaries: ["Self", "Spouse"],
      description: "Premium health insurance with global coverage, alternative treatment benefits, and mental health cover for comprehensive healthcare protection.",
      benefits: [
        "Individual/Family - Flexible coverage options",
        "Global Coverage - Treatment anywhere in the world",
        "Alternative Treatment - AYUSH treatment covered",
        "Mental Health Cover - Psychiatric treatment included",
        "Modern Treatment - Advanced procedures covered",
        "No Room Limits - Choose any room category",
        "Unlimited Restoration - Cover restored after use",
        "Cashless hospitalization at 18,000+ network hospitals"
      ],
      contact: {
        phone: "1800-102-4488",
        email: "support@careinsurance.com",
        address: "Care Health Building, Hyderabad - 500001"
      }
    }
  };

  // Get policy by ID or show not found
  const policy = mockPolicies[policyId as keyof typeof mockPolicies];

  if (!policy) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pb-20">
        <div className="text-center">
          <Shield className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Policy Not Found</h2>
          <p className="text-white/60 mb-4">The insurance policy you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/my-insurance")} className="bg-white text-black hover:bg-white/90">
            Back to My Insurance
          </Button>
        </div>
      </div>
    );
  }

  // Fetch claims for this policy
  const { data: claims = [], isLoading: claimsLoading } = useQuery<InsuranceClaim[]>({
    queryKey: [`/api/insurance/policies/${policyId}/claims`],
    enabled: !!policyId && !!policy,
  });

  // Mock transactions by policy ID
  const transactionsByPolicy = {
    "pol-1": [
      {
        id: "ins-txn-1",
        type: "Premium Payment",
        amount: 25000,
        date: "2024-01-01",
        status: "success",
        paymentMethod: "UPI"
      },
      {
        id: "ins-txn-3",
        type: "Claim Settlement",
        amount: 45000,
        date: "2024-08-20",
        status: "success"
      }
    ],
    "pol-2": [
      {
        id: "ins-txn-2",
        type: "Premium Payment",
        amount: 15000,
        date: "2024-06-15",
        status: "success",
        paymentMethod: "Bank Transfer"
      }
    ],
    "pol-3": [
      {
        id: "ins-txn-4",
        type: "Premium Payment",
        amount: 12000,
        date: "2024-03-01",
        status: "success",
        paymentMethod: "Credit Card"
      },
      {
        id: "ins-txn-5",
        type: "Claim Settlement",
        amount: 85000,
        date: "2024-09-20",
        status: "success"
      }
    ],
    "star-health": [
      {
        id: "ins-txn-6",
        type: "Premium Payment",
        amount: 15000,
        date: "2024-01-01",
        status: "success",
        paymentMethod: "UPI"
      }
    ],
    "hdfc-car": [
      {
        id: "ins-txn-7",
        type: "Premium Payment",
        amount: 12000,
        date: "2024-01-01",
        status: "success",
        paymentMethod: "Credit Card"
      }
    ],
    "bajaj-bike": [
      {
        id: "ins-txn-8",
        type: "Premium Payment",
        amount: 3500,
        date: "2024-01-01",
        status: "success",
        paymentMethod: "UPI"
      }
    ],
    "icici-car": [
      {
        id: "ins-txn-9",
        type: "Premium Payment",
        amount: 18000,
        date: "2024-01-01",
        status: "success",
        paymentMethod: "Credit Card"
      }
    ],
    "care-health": [
      {
        id: "ins-txn-10",
        type: "Premium Payment",
        amount: 25000,
        date: "2024-01-01",
        status: "success",
        paymentMethod: "Bank Transfer"
      }
    ]
  };

  const mockTransactions = transactionsByPolicy[policyId as keyof typeof transactionsByPolicy] || [];

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      claimType: "",
      incidentDate: "",
      claimAmount: "",
      description: "",
      hospitalName: "",
      doctorName: "",
    },
  });

  // Mutation to create a new claim
  const createClaimMutation = useMutation({
    mutationFn: async (data: ClaimFormValues) => {
      const result = await apiRequest('POST', '/api/insurance/claims', {
        policyId: policyId,
        ...data,
      });
      const jsonData = await result.json();
      return jsonData as InsuranceClaim;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/insurance/policies/${policyId}/claims`] });
      toast({
        title: "Claim Submitted Successfully",
        description: `Your claim has been submitted and is under review. Claim number: ${(data as InsuranceClaim)?.claimNumber || 'N/A'}`,
      });
      setIsClaimDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitClaim = (data: ClaimFormValues) => {
    createClaimMutation.mutate(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "settled": return CheckCircle;
      case "approved": return CheckCircle;
      case "pending": return Clock;
      case "under_review": return Activity;
      case "rejected": return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "settled": return "text-green-400";
      case "approved": return "text-green-400";
      case "pending": return "text-yellow-400";
      case "under_review": return "text-blue-400";
      case "rejected": return "text-red-400";
      default: return "text-white/60";
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className={cn("min-h-screen bg-black text-white", isMarketplacePage ? "pb-24" : "pb-20")}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{policy.policyName}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{policy.policyNumber}</p>
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Policy Summary Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-white">{policy.provider}</h3>
                  <p className="text-xs text-white/60">{policy.insuranceType.toUpperCase()} Insurance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Coverage</p>
                <p className="text-lg font-light text-white">₹{(policy.coverageAmount / 100000).toFixed(1)}L</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Premium</p>
                <p className="text-lg font-light text-white">₹{(policy.premium / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Valid Until</p>
                <p className="text-lg font-light text-white">{new Date(policy.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          {isMarketplacePage ? (
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="guidelines" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-guidelines">Guidelines</TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-rules">Rules</TabsTrigger>
              <TabsTrigger value="coverage" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-coverage">Coverage</TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-transactions">Transactions</TabsTrigger>
              <TabsTrigger value="claims" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-claims">Claims</TabsTrigger>
            </TabsList>
          )}

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* About */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">About This Policy</h3>
                <p className="text-sm text-white/70 leading-relaxed">{policy.description}</p>
              </div>

              {/* Benefits */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Key Benefits</h3>
                <div className="space-y-2">
                  {policy.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/70">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Policy Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/70">Start Date</span>
                    </div>
                    <span className="text-sm text-white font-medium">{new Date(policy.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <span className="text-sm text-white/70">End Date</span>
                    </div>
                    <span className="text-sm text-white font-medium">{new Date(policy.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white/70">Next Premium Due</span>
                    </div>
                    <span className="text-sm text-yellow-400 font-medium">{new Date(policy.nextDueDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Beneficiaries */}
              {policy.beneficiaries && (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Beneficiaries</h3>
                  <div className="flex flex-wrap gap-2">
                    {policy.beneficiaries.map((beneficiary, index) => (
                      <div key={index} className="bg-white/10 px-3 py-1 rounded-none border border-white/10">
                        <span className="text-sm text-white/80">{beneficiary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policy Rules & Terms */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Policy Rules & Terms</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs text-white/80 font-medium mb-2">Waiting Period</h4>
                    <p className="text-sm text-white/60">30 days for general illnesses, 90 days for pre-existing diseases</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/80 font-medium mb-2">Claim Settlement Time</h4>
                    <p className="text-sm text-white/60">Claims processed within 7-15 business days after document verification</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/80 font-medium mb-2">Free Look Period</h4>
                    <p className="text-sm text-white/60">15 days from policy issuance to review and cancel if not satisfied</p>
                  </div>
                </div>
              </div>

              {/* Claims Eligibility */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">When Can You Claim?</h3>
                <div className="space-y-2">
                  {policy.insuranceType === "health" && (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Emergency and planned hospitalizations (min. 24 hours)</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Day care procedures and surgeries</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Pre and post hospitalization expenses</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Ambulance charges and emergency transport</p>
                      </div>
                    </>
                  )}
                  {policy.insuranceType === "vehicle" && (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Accidents causing vehicle damage</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Theft or attempted theft of vehicle</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Natural calamities (flood, earthquake, etc.)</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Third-party liability claims</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Exclusions */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">What's Not Covered (Exclusions)</h3>
                <div className="space-y-2">
                  {policy.insuranceType === "health" && (
                    <>
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Cosmetic or aesthetic treatments</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Self-inflicted injuries or substance abuse</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">War, nuclear risks, and hazardous activities</p>
                      </div>
                    </>
                  )}
                  {policy.insuranceType === "vehicle" && (
                    <>
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Driving under influence of alcohol/drugs</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Driving without valid license</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70">Wear and tear, mechanical breakdown</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Claim Process */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">How to File a Claim</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Intimate Insurer</h4>
                      <p className="text-xs text-white/60">Notify within 24 hours of incident/hospitalization</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">2</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Submit Documents</h4>
                      <p className="text-xs text-white/60">Upload bills, reports, and required forms</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">3</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Verification</h4>
                      <p className="text-xs text-white/60">Insurer reviews and verifies documents</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">4</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Settlement</h4>
                      <p className="text-xs text-white/60">Claim approved and amount credited</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-white/60" />
                    <a href={`tel:${policy.contact.phone}`} className="text-sm text-white/70 hover:text-white transition-colors">{policy.contact.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-white/60" />
                    <a href={`mailto:${policy.contact.email}`} className="text-sm text-white/70 hover:text-white transition-colors">{policy.contact.email}</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-white/60 mt-0.5" />
                    <span className="text-sm text-white/70">{policy.contact.address}</span>
                  </div>
                </div>
              </div>

              {/* Download Policy */}
              <Button
                className="w-full bg-white text-black hover:bg-white/90"
                data-testid="button-download-policy"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Policy Document
              </Button>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:bg-white/10 transition-all"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-light text-white text-sm tracking-wide">{transaction.type}</h4>
                      <p className="text-xs text-white/40">{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      {transaction.paymentMethod && (
                        <p className="text-xs text-white/50">via {transaction.paymentMethod}</p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className={cn("text-lg font-light tracking-tight", transaction.type === "Claim Settlement" ? "text-green-400" : "text-white")}>
                        {transaction.type === "Claim Settlement" ? "+" : "-"}₹{(transaction.amount / 1000).toFixed(0)}K
                      </p>
                      <div className="flex items-center gap-2 justify-end">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-white/60">Success</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {mockTransactions.length === 0 && (
                <div className="text-center py-12">
                  <IndianRupee className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-sm">No transactions found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Claims Tab */}
          <TabsContent value="claims" className="mt-6">
            <div className="space-y-4">
              <Button
                onClick={() => setIsClaimDialogOpen(true)}
                className="w-full bg-white text-black hover:bg-white/90"
                data-testid="button-new-claim"
              >
                <Plus className="h-4 w-4 mr-2" />
                File New Claim
              </Button>

              <div className="space-y-3">
                {claimsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
                    <p className="text-white/60 text-sm mt-4">Loading claims...</p>
                  </div>
                ) : claims.map((claim) => {
                  const StatusIcon = getStatusIcon(claim.status);
                  const statusColor = getStatusColor(claim.status);
                  const claimAmount = typeof claim.claimAmount === 'string' ? parseFloat(claim.claimAmount) : claim.claimAmount;
                  const settledAmount = claim.settledAmount ? (typeof claim.settledAmount === 'string' ? parseFloat(claim.settledAmount) : claim.settledAmount) : undefined;
                  
                  return (
                    <div
                      key={claim.id}
                      onClick={() => {
                        setSelectedClaim(claim);
                        setIsClaimDetailOpen(true);
                      }}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:bg-white/10 transition-all"
                      data-testid={`claim-${claim.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-light text-white text-sm tracking-wide">{claim.claimType}</h4>
                            </div>
                            <p className="text-xs text-white/40 font-mono">{claim.claimNumber}</p>
                            <p className="text-xs text-white/50">Filed: {claim.filedDate ? new Date(claim.filedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center gap-2 justify-end">
                              <StatusIcon className={cn("h-4 w-4", statusColor)} />
                              <span className={cn("text-xs font-medium", statusColor)}>{getStatusText(claim.status)}</span>
                            </div>
                            <p className="text-lg font-light text-white">₹{(claimAmount / 1000).toFixed(0)}K</p>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-3">
                          <p className="text-xs text-white/60">{claim.description}</p>
                        </div>

                        {claim.status === "settled" && settledAmount && claim.settledDate && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-green-400">Settled Amount</span>
                              <span className="text-sm text-green-400 font-medium">₹{(settledAmount / 1000).toFixed(0)}K</span>
                            </div>
                            {claim.settledDate && (
                              <p className="text-xs text-green-400/70 mt-1">Settled on: {new Date(claim.settledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            )}
                          </div>
                        )}

                        {claim.status === "rejected" && claim.rejectionReason && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                            <p className="text-xs text-red-400">{claim.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!claimsLoading && claims.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No claims filed yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Guidelines Tab - For Marketplace Pages */}
          <TabsContent value="guidelines" className="mt-6">
            <div className="space-y-6">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Eligibility Guidelines</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Age: 18-65 years for new applicants</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Valid KYC documents required (Aadhaar, PAN)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Medical examination may be required for high coverage amounts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">No pre-existing condition exclusions after 4 years</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">How to Apply</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Click Apply Button</h4>
                      <p className="text-xs text-white/60">Start your application process with our simple form</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">2</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Fill Application Form</h4>
                      <p className="text-xs text-white/60">Provide personal details and choose coverage options</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">3</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Submit Documents</h4>
                      <p className="text-xs text-white/60">Upload required documents for verification</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-xs text-white">4</span>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/80 font-medium mb-1">Get Approved</h4>
                      <p className="text-xs text-white/60">Receive policy documents within 48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Required Documents</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-white/60" />
                    <p className="text-sm text-white/70">Aadhaar Card (identity proof)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-white/60" />
                    <p className="text-sm text-white/70">PAN Card (address proof)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-white/60" />
                    <p className="text-sm text-white/70">Passport size photograph</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-white/60" />
                    <p className="text-sm text-white/70">Income proof (if applicable)</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Rules Tab - For Marketplace Pages */}
          <TabsContent value="rules" className="mt-6">
            <div className="space-y-6">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Policy Terms & Conditions</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs text-white/80 font-medium mb-2">Waiting Period</h4>
                    <p className="text-sm text-white/60">Initial waiting period of 30 days applies for all claims except accidental hospitalization. Pre-existing diseases have a 48-month waiting period.</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/80 font-medium mb-2">Renewal Terms</h4>
                    <p className="text-sm text-white/60">Policy is renewable lifelong. Premium rates may change at renewal based on age and claim history.</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/80 font-medium mb-2">Cancellation Policy</h4>
                    <p className="text-sm text-white/60">15-day free look period from policy receipt. Cancellation allowed with written notice 30 days before expiry. Pro-rata refund applicable.</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Claim Settlement Rules</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Notify insurer within 24 hours of hospitalization</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Submit all claim documents within 15 days of discharge</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Cashless facility available at network hospitals only</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Claim settlement within 7-15 days after document verification</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Important Exclusions</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Cosmetic or plastic surgery (unless medically necessary)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Dental treatment (unless due to accident)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Expenses incurred outside India (unless specified)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Treatment arising from war, terrorism, or nuclear contamination</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Coverage Details Tab - For Marketplace Pages */}
          <TabsContent value="coverage" className="mt-6">
            <div className="space-y-6">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Coverage Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Sum Insured</p>
                    <p className="text-2xl font-light text-white">₹{(policy.coverageAmount / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Annual Premium</p>
                    <p className="text-2xl font-light text-white">₹{(policy.premium / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">What's Covered</h3>
                <div className="space-y-2">
                  {policy.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/70">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Sub-Limits & Co-Payment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Room Rent Limit</span>
                    <span className="text-sm text-white">1% of Sum Insured per day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Ambulance Charges</span>
                    <span className="text-sm text-white">Up to ₹2,000 per trip</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Co-Payment</span>
                    <span className="text-sm text-green-400">NIL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Restoration Benefit</span>
                    <span className="text-sm text-white">100% of Sum Insured</span>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <h3 className="text-sm font-medium text-white mb-3 uppercase tracking-wider">Add-On Benefits Available</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Plus className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Consumables Cover - ₹2,000/year additional premium</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Plus className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Personal Accident Cover - ₹1,500/year additional premium</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Plus className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/70">Worldwide Coverage - ₹3,000/year additional premium</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Apply Button - Only for Marketplace Pages */}
      {isMarketplacePage && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
          <Button
            onClick={() => navigate("/insurance-application")}
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-light tracking-wider rounded-none"
            data-testid="button-apply-insurance"
          >
            <Shield className="h-5 w-5 mr-2" />
            Apply for this Insurance
          </Button>
        </div>
      )}

      {/* Claim Dialog */}
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogContent className="bg-black/95 border border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-light tracking-wide">File New Claim</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              Submit your claim request for review and processing
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitClaim)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="claimType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Claim Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-claim-type">
                          <SelectValue placeholder="Select claim type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="hospitalization">Hospitalization</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="medical_bills">Medical Bills</SelectItem>
                        <SelectItem value="ambulance">Ambulance</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incidentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Incident Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white/5 border-white/10 text-white"
                        data-testid="input-incident-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="claimAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Claim Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        className="bg-white/5 border-white/10 text-white"
                        data-testid="input-claim-amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Hospital/Clinic Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter hospital name"
                        className="bg-white/5 border-white/10 text-white"
                        data-testid="input-hospital-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Doctor Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter doctor name"
                        className="bg-white/5 border-white/10 text-white"
                        data-testid="input-doctor-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the incident and treatment..."
                        className="bg-white/5 border-white/10 text-white min-h-[100px]"
                        data-testid="textarea-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border border-white/10 bg-white/5 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/70">Upload Documents</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                  data-testid="button-upload-documents"
                >
                  Choose Files
                </Button>
                <p className="text-xs text-white/50 mt-2">Upload medical bills, prescriptions, discharge summary, etc.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClaimDialogOpen(false)}
                  className="flex-1 text-white border-white/20 hover:bg-white/10"
                  data-testid="button-cancel-claim"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createClaimMutation.isPending}
                  className="flex-1 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                  data-testid="button-submit-claim"
                >
                  {createClaimMutation.isPending ? "Submitting..." : "Submit Claim"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Claim Detail Dialog */}
      <Dialog open={isClaimDetailOpen} onOpenChange={setIsClaimDetailOpen}>
        <DialogContent className="bg-black/95 border border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-light tracking-wide">Claim Details</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              Complete information about your insurance claim
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-4 pt-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedClaim.status);
                      const statusColor = getStatusColor(selectedClaim.status);
                      return (
                        <>
                          <StatusIcon className={cn("h-4 w-4", statusColor)} />
                          <span className={cn("text-sm font-medium", statusColor)}>{getStatusText(selectedClaim.status)}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Claim Amount</p>
                  <p className="text-lg font-light text-white">
                    ₹{((typeof selectedClaim.claimAmount === 'string' ? parseFloat(selectedClaim.claimAmount) : selectedClaim.claimAmount) / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>

              {/* Claim Information */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Claim Number</p>
                  <p className="text-sm text-white font-mono">{selectedClaim.claimNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Claim Type</p>
                  <p className="text-sm text-white">{selectedClaim.claimType}</p>
                </div>

                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Filed Date</p>
                  <p className="text-sm text-white">
                    {selectedClaim.filedDate ? new Date(selectedClaim.filedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>

                {selectedClaim.incidentDate && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Incident Date</p>
                    <p className="text-sm text-white">
                      {selectedClaim.incidentDate instanceof Date 
                        ? selectedClaim.incidentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : new Date(selectedClaim.incidentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                      }
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Description</p>
                  <p className="text-sm text-white/70 leading-relaxed">{selectedClaim.description}</p>
                </div>

                {selectedClaim.hospitalName && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Hospital/Clinic</p>
                    <p className="text-sm text-white">{selectedClaim.hospitalName}</p>
                  </div>
                )}

                {selectedClaim.doctorName && (
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Doctor Name</p>
                    <p className="text-sm text-white">{selectedClaim.doctorName}</p>
                  </div>
                )}
              </div>

              {/* Settled Amount */}
              {selectedClaim.status === "settled" && selectedClaim.settledAmount && selectedClaim.settledDate && (
                <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                  <p className="text-xs text-green-400 uppercase tracking-widest mb-2">Settlement Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-400">Settled Amount</span>
                      <span className="text-lg text-green-400 font-medium">
                        ₹{((typeof selectedClaim.settledAmount === 'string' ? parseFloat(selectedClaim.settledAmount) : selectedClaim.settledAmount) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <p className="text-xs text-green-400/70">
                      Settled on: {new Date(selectedClaim.settledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedClaim.status === "rejected" && selectedClaim.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-4">
                  <p className="text-xs text-red-400 uppercase tracking-widest mb-2">Rejection Reason</p>
                  <p className="text-sm text-red-400">{selectedClaim.rejectionReason}</p>
                </div>
              )}

              {/* Documents */}
              {selectedClaim.documents && Array.isArray(selectedClaim.documents) && selectedClaim.documents.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-3">Uploaded Documents</p>
                  <div className="space-y-2">
                    {(selectedClaim.documents as string[]).map((doc: string, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 p-3 border border-white/10">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-white/60" />
                          <span className="text-sm text-white">{doc}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/60 hover:text-white h-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <Button
                onClick={() => setIsClaimDetailOpen(false)}
                className="w-full bg-white text-black hover:bg-white/90"
                data-testid="button-close-claim-detail"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
