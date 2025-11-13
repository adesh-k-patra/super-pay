import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Building,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Settings,
  Lock,
  Unlock,
  Zap,
  Shield,
  Target,
  Activity,
  BarChart3,
  Coins,
  Receipt,
  IndianRupee,
  Percent,
  Users,
  Gift,
  Star,
  Hexagon,
  Search
} from "lucide-react";

interface CreditCardItem {
  id: string;
  cardNumber: string;
  cardName: string;
  cardType: "credit" | "debit" | "prepaid";
  bankName: string;
  cardNetwork: "visa" | "mastercard" | "rupay" | "amex";
  status: "active" | "blocked" | "expired" | "inactive";
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
  minimumDue?: number;
  dueDate?: string;
  lastTransaction?: string;
  rewardPoints?: number;
  cashback?: number;
  expiryDate: string;
  isBlocked: boolean;
  isPrimaryCard: boolean;
  monthlySpend: number;
  annualFee?: number;
}

interface CardApplication {
  id: string;
  cardName: string;
  bankName: string;
  cardNetwork: "visa" | "mastercard" | "rupay" | "amex";
  status: "pending" | "under_review" | "approved" | "rejected";
  appliedDate: string;
  rejectionReason?: string;
}

export default function MyCards() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<CardApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock cards data (in real app, this would come from APIs)
  const mockCards: CreditCardItem[] = [
    {
      id: "card-1",
      cardNumber: "4532891234567890",
      cardName: "Premium Credit Card",
      cardType: "credit",
      bankName: "HDFC Bank",
      cardNetwork: "visa",
      status: "active",
      balance: 0,
      creditLimit: 200000,
      availableCredit: 165000,
      minimumDue: 8500,
      dueDate: "2025-01-15",
      lastTransaction: "2024-12-28",
      rewardPoints: 12500,
      cashback: 2450,
      expiryDate: "12/28",
      isBlocked: false,
      isPrimaryCard: true,
      monthlySpend: 35000,
      annualFee: 999
    },
    {
      id: "card-2",
      cardNumber: "5412345678901234",
      cardName: "Salary Account Debit",
      cardType: "debit",
      bankName: "ICICI Bank",
      cardNetwork: "mastercard",
      status: "active",
      balance: 45000,
      lastTransaction: "2024-12-29",
      rewardPoints: 1250,
      expiryDate: "03/27",
      isBlocked: false,
      isPrimaryCard: false,
      monthlySpend: 18000
    },
    {
      id: "card-3",
      cardNumber: "5555666677778888",
      cardName: "Business Platinum",
      cardType: "credit",
      bankName: "Axis Bank",
      cardNetwork: "mastercard",
      status: "active",
      balance: 0,
      creditLimit: 500000,
      availableCredit: 425000,
      minimumDue: 15000,
      dueDate: "2025-01-20",
      lastTransaction: "2024-12-27",
      rewardPoints: 25000,
      cashback: 3200,
      expiryDate: "08/26",
      isBlocked: false,
      isPrimaryCard: false,
      monthlySpend: 75000,
      annualFee: 2999
    },
    {
      id: "card-4",
      cardNumber: "6011111122223333",
      cardName: "Travel Rewards Card",
      cardType: "credit",
      bankName: "SBI",
      cardNetwork: "rupay",
      status: "blocked",
      balance: 0,
      creditLimit: 100000,
      availableCredit: 0,
      minimumDue: 0,
      lastTransaction: "2024-12-10",
      rewardPoints: 8500,
      expiryDate: "05/25",
      isBlocked: true,
      isPrimaryCard: false,
      monthlySpend: 0,
      annualFee: 499
    }
  ];

  // Mock card applications data
  const mockApplications: CardApplication[] = [
    {
      id: "app-1",
      cardName: "Rewards Plus Credit Card",
      bankName: "HDFC Bank",
      cardNetwork: "visa",
      status: "pending",
      appliedDate: "2025-10-10"
    },
    {
      id: "app-2",
      cardName: "Cashback Credit Card",
      bankName: "SBI",
      cardNetwork: "mastercard",
      status: "under_review",
      appliedDate: "2025-10-08"
    },
    {
      id: "app-3",
      cardName: "Premium Travel Card",
      bankName: "ICICI Bank",
      cardNetwork: "visa",
      status: "approved",
      appliedDate: "2025-10-05"
    },
    {
      id: "app-4",
      cardName: "Shopping Elite Card",
      bankName: "Axis Bank",
      cardNetwork: "rupay",
      status: "rejected",
      appliedDate: "2025-10-01",
      rejectionReason: "Credit score below minimum requirement (650). Please improve your credit score and reapply after 3 months."
    }
  ];

  // Function to mask first 6 digits of card number
  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length < 6) return cardNumber;
    const masked = '•'.repeat(6) + cardNumber.slice(6);
    // Format as: •••• •••• 7890
    return masked.match(/.{1,4}/g)?.join(' ') || masked;
  };

  const totalCreditLimit = mockCards
    .filter(card => card.cardType === "credit")
    .reduce((sum, card) => sum + (card.creditLimit || 0), 0);

  const totalAvailableCredit = mockCards
    .filter(card => card.cardType === "credit")
    .reduce((sum, card) => sum + (card.availableCredit || 0), 0);

  const totalMinimumDue = mockCards
    .filter(card => card.minimumDue)
    .reduce((sum, card) => sum + (card.minimumDue || 0), 0);

  const totalRewards = mockCards
    .reduce((sum, card) => sum + (card.rewardPoints || 0), 0);

  const activeCards = mockCards.filter(card => card.status === "active").length;
  const blockedCards = mockCards.filter(card => card.status === "blocked").length;

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "credit": return CreditCard;
      case "debit": return Building;
      case "prepaid": return Coins;
      default: return CreditCard;
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case "visa": return "text-white/60";
      case "mastercard": return "text-white/60";
      case "rupay": return "text-white/60";
      case "amex": return "text-white/60";
      default: return "text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-white/10 text-white border-white/10 rounded-none";
      case "blocked": return "bg-white/10 text-white border-white/10 rounded-none";
      case "expired": return "bg-white/10 text-white border-white/10 rounded-none";
      case "inactive": return "bg-white/10 text-white border-white/10 rounded-none";
      default: return "bg-white/10 text-white border-white/10 rounded-none";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "blocked": return XCircle;
      case "expired": return Clock;
      case "inactive": return AlertTriangle;
      default: return Clock;
    }
  };

  const getApplicationStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock;
      case "under_review": return Activity;
      case "approved": return CheckCircle;
      case "rejected": return XCircle;
      default: return Clock;
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-400";
      case "under_review": return "text-blue-400";
      case "approved": return "text-green-400";
      case "rejected": return "text-red-400";
      default: return "text-white/60";
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "under_review": return "Under Review";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const filteredCards = mockCards.filter(card => {
    const matchesSearch = searchQuery === "" || 
      card.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardNumber.includes(searchQuery) ||
      maskCardNumber(card.cardNumber).toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedTab === "all") return true;
    if (selectedTab === "applications") return false; // Applications tab shows applications, not cards
    if (selectedTab === "blocked") return card.status === "blocked";
    return card.cardType === selectedTab;
  });

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = searchQuery === "" || 
      app.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const pagination = usePagination({
    data: filteredCards,
    itemsPerPage: 10,
  });

  const toggleCardLock = (cardId: string) => {
    toast({
      title: "Card Status Updated",
      description: "Card lock/unlock request processed successfully"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY CARDS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Saved cards</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="cards-summary">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/credit-card-marketplace")}
            className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-marketplace"
          >
            <CreditCard className="h-5 w-5" />
          </Button>
          <div className="space-y-6">
            {/* Card Stats Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Credit Limit</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">{activeCards} Active</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-limit">
                {hideAmounts ? "₹••••••••" : `₹${(totalCreditLimit / 100000).toFixed(2)}L`}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-available-credit">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Available</p>
                <p className="text-lg font-light text-white" data-testid="text-available-credit">
                  {hideAmounts ? "₹••••" : `₹${(totalAvailableCredit / 100000).toFixed(1)}L`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-minimum-due">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Due</p>
                <p className="text-lg font-light text-white" data-testid="text-minimum-due">
                  {hideAmounts ? "₹••••" : `₹${(totalMinimumDue / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-reward-points">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Rewards</p>
                <p className="text-lg font-light text-white" data-testid="text-reward-points">
                  {totalRewards.toLocaleString()}
                </p>
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
            placeholder="Search cards by name, bank, or number..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-cards"
          />
        </div>

        {/* Cards Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all-cards">All</TabsTrigger>
              <TabsTrigger value="credit" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-credit-cards">Credit</TabsTrigger>
              <TabsTrigger value="debit" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-debit-cards">Debit</TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-applications">Pending</TabsTrigger>
            </TabsList>

{["all", "credit", "debit"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-6">
                <div className="space-y-3">
                  {pagination.paginatedData.map((card) => {
                    const CardIcon = getCardIcon(card.cardType);
                    const StatusIcon = getStatusIcon(card.status);
                    const usagePercentage = card.creditLimit ? 
                      ((card.creditLimit - (card.availableCredit || 0)) / card.creditLimit) * 100 : 0;
                    
                    return (
                      <div
                        key={card.id}
                        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => navigate(`/my-cards/${card.id}`)}
                        data-testid={`card-${card.id}`}
                      >
                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                                <CardIcon className="h-4 w-4 text-white/60" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-light text-white text-sm tracking-wide">{card.cardName}</h4>
                                <p className="text-[10px] text-white/50 tracking-widest uppercase">{card.bankName}</p>
                                <p className="text-xs text-white/40 font-mono tracking-wider">{maskCardNumber(card.cardNumber)}</p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              {card.cardType === "credit" ? (
                                <>
                                  <p className="text-lg font-light text-white tracking-tight" data-testid={`text-available-${card.id}`}>
                                    {hideAmounts ? "₹••••••" : `₹${((card.availableCredit || 0) / 1000).toFixed(0)}K`}
                                  </p>
                                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Available</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-lg font-light text-white tracking-tight" data-testid={`text-balance-${card.id}`}>
                                    {hideAmounts ? "₹••••••" : `₹${(card.balance / 1000).toFixed(0)}K`}
                                  </p>
                                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Balance</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Credit Usage (for credit cards) */}
                          {card.cardType === "credit" && card.creditLimit && (
                            <div className="space-y-2 pt-2 border-t border-white/10">
                              <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                                <span>{usagePercentage.toFixed(0)}% Used</span>
                                <span>Limit: {hideAmounts ? "₹••••••" : `₹${(card.creditLimit / 1000).toFixed(0)}K`}</span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5">
                                <div 
                                  className="bg-white h-1.5 transition-all duration-300"
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                  data-testid={`progress-usage-${card.id}`}
                                />
                              </div>
                            </div>
                          )}

                          {/* Card Details */}
                          <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                            <div className="space-y-2">
                              {card.minimumDue && (
                                <div className="flex justify-between">
                                  <span className="text-white/60">Min Due:</span>
                                  <span className="text-white font-medium">
                                    {hideAmounts ? "₹••••" : `₹${(card.minimumDue / 1000).toFixed(1)}K`}
                                  </span>
                                </div>
                              )}
                              {card.rewardPoints && (
                                <div className="flex justify-between">
                                  <span className="text-white/60">Rewards:</span>
                                  <span className="text-white font-medium">{card.rewardPoints.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {card.dueDate && (
                                <div className="flex justify-between">
                                  <span className="text-white/60">Due Date:</span>
                                  <span className="text-white font-medium">{new Date(card.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-white/60">Monthly Spend:</span>
                                <span className="text-white font-medium">
                                  {hideAmounts ? "₹••••" : `₹${(card.monthlySpend / 1000).toFixed(0)}K`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="flex items-center justify-between border-t border-white/10 pt-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={!card.isBlocked}
                                  onCheckedChange={() => toggleCardLock(card.id)}
                                  className="scale-75"
                                  data-testid={`switch-lock-${card.id}`}
                                />
                                <span className="text-xs text-white/60">
                                  {card.isBlocked ? "Blocked" : "Active"}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-white text-black hover:bg-white/90 text-xs px-3 py-1"
                                data-testid={`button-pay-${card.id}`}
                              >
                                {card.cardType === "credit" ? "Pay Bill" : "Add Money"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/60 hover:text-white text-xs px-3 py-1"
                                data-testid={`button-view-details-${card.id}`}
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredCards.length > 0 && (
                    <PaginationControls
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={pagination.goToPage}
                      canGoNext={pagination.canGoNext}
                      canGoPrevious={pagination.canGoPrevious}
                      startIndex={pagination.startIndex}
                      endIndex={pagination.endIndex}
                      totalItems={pagination.totalItems}
                      className="mt-6"
                    />
                  )}
                </div>
              </TabsContent>
            ))}

            {/* Applications Tab */}
            <TabsContent value="applications" className="mt-6">
              <div className="space-y-3">
                {filteredApplications.map((application) => {
                  const StatusIcon = getApplicationStatusIcon(application.status);
                  const statusColor = getApplicationStatusColor(application.status);
                  const statusText = getApplicationStatusText(application.status);
                  
                  return (
                    <div
                      key={application.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`application-${application.id}`}
                    >
                      <div className="space-y-3">
                        {/* Application Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-white/60" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{application.cardName}</h4>
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">{application.bankName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={cn("h-4 w-4", statusColor)} />
                            <span className={cn("text-xs font-medium", statusColor)}>{statusText}</span>
                          </div>
                        </div>

                        {/* Application Info */}
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Applied On</p>
                              <p className="text-sm text-white font-medium">{new Date(application.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/60 hover:text-white text-xs px-3 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApplication(application);
                                setIsDialogOpen(true);
                              }}
                              data-testid={`button-view-application-${application.id}`}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">No applications found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Security Tips */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4" data-testid="security-tips">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Security Reminder</h4>
              <p className="text-xs text-white/60">
                Keep your cards secure and monitor transactions regularly
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white p-1"
                onClick={() => navigate("/card-security")}
                data-testid="button-security-settings"
              >
                <Shield className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/95 border border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-light tracking-wide">Application Details</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              View your credit card application status and information
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 pt-4">
              {/* Card Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-white">{selectedApplication.cardName}</h3>
                <p className="text-sm text-white/60">{selectedApplication.bankName}</p>
              </div>

              {/* Application Date */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/50 uppercase tracking-widest">Applied On</p>
                </div>
                <p className="text-white font-medium">
                  {new Date(selectedApplication.appliedDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              {/* Status */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/50 uppercase tracking-widest">Status</p>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const StatusIcon = getApplicationStatusIcon(selectedApplication.status);
                    const statusColor = getApplicationStatusColor(selectedApplication.status);
                    const statusText = getApplicationStatusText(selectedApplication.status);
                    return (
                      <>
                        <StatusIcon className={cn("h-5 w-5", statusColor)} />
                        <span className={cn("font-medium", statusColor)}>{statusText}</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Processing Time Message */}
              {(selectedApplication.status === "pending" || selectedApplication.status === "under_review") && (
                <div className="border-t border-white/10 pt-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-white/60 mt-0.5" />
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Processing Time</p>
                        <p className="text-sm text-white">
                          Your application will take <span className="font-medium">5-7 working days</span> to process
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                <div className="border-t border-white/10 pt-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-red-400 uppercase tracking-widest mb-1">Rejection Reason</p>
                        <p className="text-sm text-white">{selectedApplication.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Message */}
              {selectedApplication.status === "approved" && (
                <div className="border-t border-white/10 pt-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-white">
                          Congratulations! Your application has been approved. You will receive your card within 5-7 working days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}