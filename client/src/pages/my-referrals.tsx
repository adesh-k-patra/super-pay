import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Users,
  Share2,
  Copy,
  CheckCircle,
  Clock,
  Star,
  Gift,
  Eye,
  EyeOff,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface ReferralItem {
  id: string;
  name: string;
  email: string;
  status: "pending" | "verified" | "completed" | "expired";
  dateReferred: string;
  dateJoined?: string;
  rewardEarned: number;
  milestones: {
    signup: boolean;
    firstTransaction: boolean;
    monthlyActive: boolean;
    premiumUpgrade: boolean;
  };
}

export default function MyReferrals() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const referralCode = "FINTECH2025";
  const totalReferrals = 12;
  const successfulReferrals = 8;
  const totalEarnings = 15000;
  const pendingEarnings = 3500;

  const mockReferrals: ReferralItem[] = [
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      status: "completed",
      dateReferred: "2024-12-15",
      dateJoined: "2024-12-16",
      rewardEarned: 2500,
      milestones: {
        signup: true,
        firstTransaction: true,
        monthlyActive: true,
        premiumUpgrade: true
      }
    },
    {
      id: "2",
      name: "Rahul Gupta",
      email: "rahul.gupta@email.com",
      status: "verified",
      dateReferred: "2024-12-20",
      dateJoined: "2024-12-21",
      rewardEarned: 1000,
      milestones: {
        signup: true,
        firstTransaction: true,
        monthlyActive: false,
        premiumUpgrade: false
      }
    },
    {
      id: "3",
      name: "Anjali Patel",
      email: "anjali.patel@email.com",
      status: "pending",
      dateReferred: "2024-12-25",
      rewardEarned: 0,
      milestones: {
        signup: false,
        firstTransaction: false,
        monthlyActive: false,
        premiumUpgrade: false
      }
    },
    {
      id: "4",
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      status: "completed",
      dateReferred: "2024-12-10",
      dateJoined: "2024-12-11",
      rewardEarned: 2000,
      milestones: {
        signup: true,
        firstTransaction: true,
        monthlyActive: true,
        premiumUpgrade: false
      }
    },
    {
      id: "5",
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      status: "expired",
      dateReferred: "2024-11-15",
      rewardEarned: 0,
      milestones: {
        signup: false,
        firstTransaction: false,
        monthlyActive: false,
        premiumUpgrade: false
      }
    }
  ];

  const filteredReferrals = selectedFilter === "all" 
    ? mockReferrals 
    : mockReferrals.filter(r => r.status === selectedFilter);

  const pagination = usePagination({
    data: filteredReferrals,
    itemsPerPage: 20,
  });

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard"
    });
  };

  const shareReferral = () => {
    toast({
      title: "Share Referral",
      description: `Sharing referral code: ${referralCode}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400";
      case "verified": return "text-blue-400";
      case "pending": return "text-yellow-400";
      case "expired": return "text-red-400";
      default: return "text-white/40";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "verified": return Star;
      case "pending": return Clock;
      default: return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
    { value: "expired", label: "Expired" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
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
            <h1 className="text-base font-bold tracking-wider">MY REFERRALS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Invite & Earn Rewards</p>
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

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Referral Code Card */}
        <div className="border border-white/10 p-6 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light mb-4 block flex items-center gap-2">
            <Gift className="h-3 w-3" />
            Your Referral Code
          </Label>
          
          <div className="bg-white/5 border border-white/10 p-6 mb-4">
            <p className="text-3xl font-light tracking-[0.3em] text-center mb-4" data-testid="text-referral-code">
              {referralCode}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={copyReferralCode}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-none h-12 font-light tracking-wider"
                data-testid="button-copy-code"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              <Button
                onClick={shareReferral}
                className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
                data-testid="button-share-code"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="border border-white/10 p-6 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light mb-4 block flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Earnings Overview
          </Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Total Earnings</p>
              <p className="text-2xl font-light" data-testid="text-total-earnings">
                {hideAmounts ? '••••••' : formatCurrency(totalEarnings)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Pending</p>
              <p className="text-2xl font-light" data-testid="text-pending-earnings">
                {hideAmounts ? '••••••' : formatCurrency(pendingEarnings)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Total Referrals</p>
              <p className="text-2xl font-light" data-testid="text-total-referrals">{totalReferrals}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Successful</p>
              <p className="text-2xl font-light" data-testid="text-successful-referrals">{successfulReferrals}</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="space-y-3">
          <div className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-5 gap-0">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={cn(
                  "transition-all whitespace-nowrap font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2",
                  selectedFilter === option.value
                    ? "border-white text-white"
                    : "border-transparent text-white/50"
                )}
                data-testid={`button-filter-${option.value}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Referrals List - Card Design */}
        <div className="space-y-4">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            {filteredReferrals.length} {filteredReferrals.length === 1 ? 'Referral' : 'Referrals'}
          </Label>

          {pagination.paginatedData.map((referral, index) => {
            const StatusIcon = getStatusIcon(referral.status);
            return (
              <div
                key={referral.id}
                className="border border-white/10 p-4 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl transition-all hover:border-white/30"
                data-testid={`referral-item-${index}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn(
                        "font-light tracking-wider",
                        referral.status === "completed" ? "text-white" : "text-white/60"
                      )}>
                        {referral.name}
                      </p>
                      <StatusIcon className={cn("h-3 w-3", getStatusColor(referral.status))} />
                    </div>
                    <p className="text-xs text-white/40">{referral.email}</p>
                  </div>
                  <div className="text-right">
                    {referral.rewardEarned > 0 && (
                      <p className={cn(
                        "text-sm font-light mb-1",
                        referral.status === "completed" ? "text-white" : "text-white/60"
                      )}>
                        {hideAmounts ? '••••' : formatCurrency(referral.rewardEarned)}
                      </p>
                    )}
                    <Badge className={cn(
                      "rounded-none text-xs px-2 py-0.5",
                      referral.status === "completed" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                      referral.status === "verified" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                      referral.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                      "bg-red-500/20 text-red-300 border-red-500/30"
                    )}>
                      {referral.status}
                    </Badge>
                  </div>
                </div>

                {/* Milestones */}
                {referral.status !== "expired" && referral.status !== "pending" && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {referral.milestones.signup && (
                      <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                        Signed Up
                      </Badge>
                    )}
                    {referral.milestones.firstTransaction && (
                      <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                        First Transaction
                      </Badge>
                    )}
                    {referral.milestones.monthlyActive && (
                      <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                        Active
                      </Badge>
                    )}
                    {referral.milestones.premiumUpgrade && (
                      <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                        Premium
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40">
                    Referred: {new Date(referral.dateReferred).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {referral.dateJoined && (
                    <p className="text-xs text-white/40">
                      Joined: {new Date(referral.dateJoined).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {filteredReferrals.length === 0 && (
            <div className="border border-white/10 p-12 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl text-center">
              <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No referrals found</p>
            </div>
          )}

          {filteredReferrals.length > 0 && (
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
      </div>
    </div>
  );
}
