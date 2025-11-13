import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  Shield,
  Heart,
  Car,
  Home,
  Plane,
  Briefcase,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  TrendingUp,
  Calendar,
  IndianRupee,
  FileText,
  Plus,
  Eye,
  Download,
  Upload
} from "lucide-react";

interface InsurancePolicy {
  id: string;
  policyNumber: string;
  policyName: string;
  insuranceType: "health" | "life" | "vehicle" | "home" | "travel" | "business";
  provider: string;
  status: "active" | "expired" | "pending" | "cancelled";
  premium: number;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  nextDueDate?: string;
  beneficiaries?: string[];
}

interface InsuranceApplication {
  id: string;
  policyName: string;
  insuranceType: "health" | "life" | "vehicle" | "home" | "travel" | "business";
  provider: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  appliedDate: string;
  premium: number;
  coverageAmount: number;
  rejectionReason?: string;
}

interface InsuranceTransaction {
  id: string;
  policyId: string;
  policyName: string;
  transactionType: "premium_payment" | "claim_settlement" | "refund" | "penalty";
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
  paymentMethod?: string;
}

interface InsuranceClaim {
  id: string;
  policyId: string;
  policyNumber: string;
  policyName: string;
  insuranceType: "health" | "life" | "vehicle" | "home" | "travel" | "business";
  provider: string;
  claimNumber: string;
  claimType: string;
  claimAmount: number;
  approvedAmount?: number;
  claimDate: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "settled";
  description: string;
  documents?: string[];
  rejectionReason?: string;
  settlementDate?: string;
  reviewerNotes?: string;
}

export default function MyInsurance() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useUrlTab("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock insurance policies
  const mockPolicies: InsurancePolicy[] = [
    {
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
      beneficiaries: ["Self", "Spouse", "2 Children"]
    },
    {
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
      beneficiaries: ["Spouse", "Children"]
    },
    {
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
      nextDueDate: "2025-03-01"
    }
  ];

  // Mock applications
  const mockApplications: InsuranceApplication[] = [
    {
      id: "app-1",
      policyName: "Travel Guard International",
      insuranceType: "travel",
      provider: "Bajaj Allianz",
      status: "pending",
      appliedDate: "2025-10-12",
      premium: 5000,
      coverageAmount: 200000
    },
    {
      id: "app-2",
      policyName: "Home Protector Plus",
      insuranceType: "home",
      provider: "ICICI Lombard",
      status: "under_review",
      appliedDate: "2025-10-08",
      premium: 18000,
      coverageAmount: 5000000
    },
    {
      id: "app-3",
      policyName: "Business Liability Cover",
      insuranceType: "business",
      provider: "Reliance General",
      status: "rejected",
      appliedDate: "2025-09-25",
      premium: 30000,
      coverageAmount: 10000000,
      rejectionReason: "Business premises do not meet minimum safety requirements. Please install fire safety equipment and reapply."
    }
  ];

  // Mock transactions
  const mockTransactions: InsuranceTransaction[] = [
    {
      id: "ins-txn-1",
      policyId: "pol-1",
      policyName: "Family Health Shield",
      transactionType: "premium_payment",
      amount: 25000,
      date: "2024-01-01",
      status: "success",
      paymentMethod: "UPI"
    },
    {
      id: "ins-txn-2",
      policyId: "pol-2",
      policyName: "Term Life Plus",
      transactionType: "premium_payment",
      amount: 15000,
      date: "2024-06-15",
      status: "success",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "ins-txn-3",
      policyId: "pol-1",
      policyName: "Family Health Shield",
      transactionType: "claim_settlement",
      amount: 45000,
      date: "2024-08-20",
      status: "success"
    },
    {
      id: "ins-txn-4",
      policyId: "pol-3",
      policyName: "Comprehensive Car Insurance",
      transactionType: "premium_payment",
      amount: 12000,
      date: "2024-03-01",
      status: "success",
      paymentMethod: "Credit Card"
    }
  ];

  // Mock claims
  const mockClaims: InsuranceClaim[] = [
    {
      id: "clm-1",
      policyId: "pol-1",
      policyNumber: "HLTH-2024-001234",
      policyName: "Family Health Shield",
      insuranceType: "health",
      provider: "Star Health Insurance",
      claimNumber: "CLM-HLTH-2024-7890",
      claimType: "Hospitalization",
      claimAmount: 75000,
      approvedAmount: 68000,
      claimDate: "2024-08-15",
      status: "settled",
      description: "Emergency surgery and 3-day hospitalization at Apollo Hospital",
      documents: ["Medical bills", "Discharge summary", "Doctor's prescription"],
      settlementDate: "2024-08-20",
      reviewerNotes: "Pre-existing condition deduction applied (₹7,000). Claim approved for ₹68,000."
    },
    {
      id: "clm-2",
      policyId: "pol-3",
      policyNumber: "VEH-2024-009876",
      policyName: "Comprehensive Car Insurance",
      insuranceType: "vehicle",
      provider: "HDFC ERGO",
      claimNumber: "CLM-VEH-2024-3456",
      claimType: "Accident Damage",
      claimAmount: 45000,
      claimDate: "2024-09-10",
      status: "under_review",
      description: "Front bumper and headlight damage due to collision",
      documents: ["FIR copy", "Damage photos", "Repair estimate"],
      reviewerNotes: "Survey scheduled for September 20, 2024. Awaiting surveyor report."
    },
    {
      id: "clm-3",
      policyId: "pol-1",
      policyNumber: "HLTH-2024-001234",
      policyName: "Family Health Shield",
      insuranceType: "health",
      provider: "Star Health Insurance",
      claimNumber: "CLM-HLTH-2024-5678",
      claimType: "Dental Treatment",
      claimAmount: 15000,
      claimDate: "2024-10-01",
      status: "rejected",
      description: "Root canal treatment and dental crown",
      documents: ["Dental bills", "X-ray reports"],
      rejectionReason: "Dental treatment is not covered under your current policy. Please upgrade to Premium Health Shield for dental coverage."
    },
    {
      id: "clm-4",
      policyId: "pol-1",
      policyNumber: "HLTH-2024-001234",
      policyName: "Family Health Shield",
      insuranceType: "health",
      provider: "Star Health Insurance",
      claimNumber: "CLM-HLTH-2024-9012",
      claimType: "OPD Consultation",
      claimAmount: 3500,
      claimDate: "2024-10-12",
      status: "pending",
      description: "Specialist consultation and diagnostic tests",
      documents: ["Medical bills", "Test reports"]
    },
    {
      id: "clm-5",
      policyId: "pol-3",
      policyNumber: "VEH-2024-009876",
      policyName: "Comprehensive Car Insurance",
      insuranceType: "vehicle",
      provider: "HDFC ERGO",
      claimNumber: "CLM-VEH-2024-2345",
      claimType: "Theft Recovery",
      claimAmount: 25000,
      approvedAmount: 25000,
      claimDate: "2024-07-05",
      status: "settled",
      description: "Stolen stereo system and seats recovered and repaired",
      documents: ["Police report", "Repair bills"],
      settlementDate: "2024-07-15",
      reviewerNotes: "Full claim amount approved as per policy terms."
    }
  ];

  const getInsuranceIcon = (type: string) => {
    switch (type) {
      case "health": return Heart;
      case "life": return Shield;
      case "vehicle": return Car;
      case "home": return Home;
      case "travel": return Plane;
      case "business": return Briefcase;
      default: return Shield;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "pending": return Clock;
      case "under_review": return Activity;
      case "approved": return CheckCircle;
      case "rejected": return XCircle;
      case "expired": return AlertTriangle;
      case "cancelled": return XCircle;
      case "settled": return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400";
      case "pending": return "text-yellow-400";
      case "under_review": return "text-blue-400";
      case "approved": return "text-green-400";
      case "rejected": return "text-red-400";
      case "expired": return "text-orange-400";
      case "cancelled": return "text-red-400";
      case "settled": return "text-green-400";
      default: return "text-white/60";
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "premium_payment": return "Premium Payment";
      case "claim_settlement": return "Claim Settlement";
      case "refund": return "Refund";
      case "penalty": return "Penalty";
      default: return type;
    }
  };

  const handleViewClaim = (claim: InsuranceClaim) => {
    setSelectedClaim(claim);
    setShowClaimDialog(true);
  };

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = searchQuery === "" || 
      policy.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = searchQuery === "" || 
      app.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = searchQuery === "" || 
      txn.policyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = searchQuery === "" || 
      claim.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimType.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const policyPagination = usePagination({
    data: filteredPolicies,
    itemsPerPage: 10,
  });

  const totalPremium = mockPolicies
    .filter(p => p.status === "active")
    .reduce((sum, p) => sum + p.premium, 0);

  const totalCoverage = mockPolicies
    .filter(p => p.status === "active")
    .reduce((sum, p) => sum + p.coverageAmount, 0);

  const activePolicies = mockPolicies.filter(p => p.status === "active").length;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center py-4 px-4">
          <div className="flex-1 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY INSURANCE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Coverage & Protection</p>
          </div>
          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/insurance")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-marketplace"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="insurance-summary">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-white/60" />
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Coverage</p>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-coverage">
                ₹{(totalCoverage / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-xs text-white/40">{activePolicies} Active Policies</p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="text-center space-y-2" data-testid="card-active-policies">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Active</p>
                <p className="text-2xl font-light text-white">{activePolicies}</p>
              </div>
              <div className="text-center space-y-2 border-x border-white/10" data-testid="card-annual-premium">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Annual Premium</p>
                <p className="text-2xl font-light text-white">₹{(totalPremium / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center space-y-2" data-testid="card-claims">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Claims</p>
                <p className="text-2xl font-light text-white">{mockClaims.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search insurance by name, provider, or number..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-insurance"
          />
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="active" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-active">Active</TabsTrigger>
              <TabsTrigger value="claims" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-claims">Claims</TabsTrigger>
              <TabsTrigger value="applied" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-applied">Applied</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-transactions">History</TabsTrigger>
            </TabsList>

            {/* Active Tab */}
            <TabsContent value="active" className="mt-6">
              <div className="space-y-3">
                {policyPagination.paginatedData.map((policy) => {
                  const InsuranceIcon = getInsuranceIcon(policy.insuranceType);
                  const StatusIcon = getStatusIcon(policy.status);
                  const statusColor = getStatusColor(policy.status);
                  
                  return (
                    <div
                      key={policy.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      onClick={() => navigate(`/my-insurance/${policy.id}`)}
                      data-testid={`policy-${policy.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                              <InsuranceIcon className="h-4 w-4 text-white/60" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{policy.policyName}</h4>
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">{policy.provider}</p>
                              <p className="text-xs text-white/40 font-mono tracking-wider">{policy.policyNumber}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-2 justify-end">
                              <StatusIcon className={cn("h-4 w-4", statusColor)} />
                              <span className={cn("text-xs font-medium", statusColor)}>{getStatusText(policy.status)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-white/60">Coverage:</span>
                              <span className="text-white font-medium">₹{(policy.coverageAmount / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Premium:</span>
                              <span className="text-white font-medium">₹{(policy.premium / 1000).toFixed(0)}K</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-white/60">Valid Until:</span>
                              <span className="text-white font-medium">{new Date(policy.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            {policy.nextDueDate && (
                              <div className="flex justify-between">
                                <span className="text-white/60">Next Due:</span>
                                <span className="text-white font-medium">{new Date(policy.nextDueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredPolicies.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No active policies found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Claims Tab */}
            <TabsContent value="claims" className="mt-6">
              <div className="space-y-3">
                {filteredClaims.map((claim) => {
                  const InsuranceIcon = getInsuranceIcon(claim.insuranceType);
                  const StatusIcon = getStatusIcon(claim.status);
                  const statusColor = getStatusColor(claim.status);
                  
                  return (
                    <div
                      key={claim.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`claim-${claim.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                              <InsuranceIcon className="h-4 w-4 text-white/60" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-light text-white text-sm tracking-wide">{claim.claimType}</h4>
                                <div className="flex items-center gap-2">
                                  <StatusIcon className={cn("h-4 w-4", statusColor)} />
                                  <span className={cn("text-xs font-medium", statusColor)}>{getStatusText(claim.status)}</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">{claim.policyName}</p>
                              <p className="text-xs text-white/40 font-mono tracking-wider">{claim.claimNumber}</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Claim Date:</span>
                            <span className="text-white">{new Date(claim.claimDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Claim Amount:</span>
                            <span className="text-white font-medium">₹{(claim.claimAmount / 1000).toFixed(1)}K</span>
                          </div>
                          {claim.approvedAmount && (
                            <div className="flex justify-between text-xs">
                              <span className="text-white/60">Approved Amount:</span>
                              <span className="text-green-400 font-medium">₹{(claim.approvedAmount / 1000).toFixed(1)}K</span>
                            </div>
                          )}
                          {claim.settlementDate && (
                            <div className="flex justify-between text-xs">
                              <span className="text-white/60">Settlement Date:</span>
                              <span className="text-white">{new Date(claim.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleViewClaim(claim)}
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-9 text-[10px] uppercase tracking-widest"
                          data-testid={`button-view-claim-${claim.id}`}
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {filteredClaims.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No claims found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Applied Tab */}
            <TabsContent value="applied" className="mt-6">
              <div className="space-y-3">
                {filteredApplications.map((application) => {
                  const InsuranceIcon = getInsuranceIcon(application.insuranceType);
                  const StatusIcon = getStatusIcon(application.status);
                  const statusColor = getStatusColor(application.status);
                  
                  return (
                    <div
                      key={application.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`application-${application.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                              <InsuranceIcon className="h-4 w-4 text-white/60" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{application.policyName}</h4>
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">{application.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={cn("h-4 w-4", statusColor)} />
                            <span className={cn("text-xs font-medium", statusColor)}>{getStatusText(application.status)}</span>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Applied On:</span>
                            <span className="text-white">{new Date(application.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Coverage:</span>
                            <span className="text-white">₹{(application.coverageAmount / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Premium:</span>
                            <span className="text-white">₹{(application.premium / 1000).toFixed(0)}K/year</span>
                          </div>
                          {application.status === "rejected" && application.rejectionReason && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mt-2">
                              <p className="text-xs text-red-400">{application.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No applications found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-6">
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:bg-white/10 transition-all"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-light text-white text-sm tracking-wide">{getTransactionTypeText(transaction.transactionType)}</h4>
                        <p className="text-[10px] text-white/50 tracking-widest uppercase">{transaction.policyName}</p>
                        <p className="text-xs text-white/40">{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className={cn("text-lg font-light tracking-tight", transaction.transactionType === "claim_settlement" || transaction.transactionType === "refund" ? "text-green-400" : "text-white")}>
                          {transaction.transactionType === "claim_settlement" || transaction.transactionType === "refund" ? "+" : "-"}₹{(transaction.amount / 1000).toFixed(0)}K
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          {transaction.status === "success" ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : transaction.status === "pending" ? (
                            <Clock className="h-3 w-3 text-yellow-400" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-400" />
                          )}
                          <span className={cn("text-xs", 
                            transaction.status === "success" ? "text-green-400" : 
                            transaction.status === "pending" ? "text-yellow-400" : "text-red-400"
                          )}>
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No transactions found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Claim Details Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-2xl bg-black text-white border-white/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-lg uppercase tracking-widest">
              Claim Details
            </DialogTitle>
            <DialogDescription className="text-white/50 text-xs uppercase tracking-widest">
              {selectedClaim?.claimNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="mt-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <p className="text-sm text-white/60 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedClaim.status);
                      const statusColor = getStatusColor(selectedClaim.status);
                      return (
                        <>
                          <StatusIcon className={cn("h-5 w-5", statusColor)} />
                          <span className={cn("text-lg font-medium", statusColor)}>
                            {getStatusText(selectedClaim.status)}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                {selectedClaim.status === "settled" && (
                  <Badge variant="outline" className="border-green-400/30 text-green-400 text-xs">
                    Settled
                  </Badge>
                )}
              </div>

              {/* Claim Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Policy Name</p>
                    <p className="text-sm text-white font-light">{selectedClaim.policyName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Provider</p>
                    <p className="text-sm text-white font-light">{selectedClaim.provider}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Claim Type</p>
                    <p className="text-sm text-white font-light">{selectedClaim.claimType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Claim Date</p>
                    <p className="text-sm text-white font-light">
                      {new Date(selectedClaim.claimDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm text-white/80 leading-relaxed">{selectedClaim.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div className="bg-white/5 p-4 border border-white/10">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Claim Amount</p>
                    <p className="text-2xl font-light text-white">₹{selectedClaim.claimAmount.toLocaleString('en-IN')}</p>
                  </div>
                  {selectedClaim.approvedAmount && (
                    <div className="bg-green-500/10 p-4 border border-green-500/20">
                      <p className="text-[10px] text-green-400 uppercase tracking-widest mb-2">Approved Amount</p>
                      <p className="text-2xl font-light text-green-400">₹{selectedClaim.approvedAmount.toLocaleString('en-IN')}</p>
                    </div>
                  )}
                </div>

                {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Documents Submitted</p>
                    <div className="space-y-2">
                      {selectedClaim.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-white/60" />
                            <span className="text-sm text-white/80">{doc}</span>
                          </div>
                          <Download className="h-4 w-4 text-white/40 cursor-pointer hover:text-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedClaim.reviewerNotes && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Reviewer Notes</p>
                    <p className="text-sm text-white/80">{selectedClaim.reviewerNotes}</p>
                  </div>
                )}

                {selectedClaim.status === "rejected" && selectedClaim.rejectionReason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-4">
                    <p className="text-[10px] text-red-400 uppercase tracking-widest mb-2">Rejection Reason</p>
                    <p className="text-sm text-red-400">{selectedClaim.rejectionReason}</p>
                  </div>
                )}

                {selectedClaim.settlementDate && (
                  <div className="flex items-center gap-2 text-sm text-white/60 border-t border-white/10 pt-4">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Settled on {new Date(selectedClaim.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-white/10 pt-4">
                <Button
                  onClick={() => setShowClaimDialog(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none h-10"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-10"
                  data-testid="button-download-claim"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
