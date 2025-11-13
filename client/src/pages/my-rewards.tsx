import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  Gift,
  Star,
  Award,
  Crown,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  Calendar,
  Coins,
  Zap,
  TrendingUp,
  ShoppingCart,
  Percent,
  Users,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Download,
  Activity,
  CreditCard,
  Building,
  Coffee,
  Car,
  Plane,
  Music,
  Gamepad2,
  Hexagon,
  Copy,
  ExternalLink
} from "lucide-react";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  points: number;
  pointsRequired: number;
  category: "cashback" | "voucher" | "product" | "experience" | "discount";
  brand: string;
  brandDescription?: string;
  value: number;
  status: "available" | "redeemed" | "expired" | "out_of_stock";
  expiryDate?: string;
  redemptionDate?: string;
  image: string;
  termsAndConditions?: string;
  popularity: "high" | "medium" | "low";
  voucherCode?: string;
  visitLink?: string;
}

interface PointHistory {
  id: string;
  type: "earned" | "redeemed" | "expired" | "bonus";
  points: number;
  description: string;
  date: string;
  source: string;
  reference?: string;
}

export default function MyRewards() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRewardDetail, setSelectedRewardDetail] = useState<RewardItem | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock reward data (in real app, this would come from APIs)
  const currentPoints = 28500;
  const pointsEarnedThisMonth = 3200;
  const pointsRedeemedThisMonth = 1800;
  const membershipTier = "Gold";
  const nextTierPoints = 50000;
  const tierProgress = (currentPoints / nextTierPoints) * 100;

  const mockRewards: RewardItem[] = [
    {
      id: "1",
      title: "Amazon Voucher - ₹500",
      description: "Shop anything on Amazon with this voucher",
      points: 0,
      pointsRequired: 5000,
      category: "voucher",
      brand: "Amazon",
      brandDescription: "Amazon is the world's largest online retailer offering millions of products across various categories.",
      value: 500,
      status: "available",
      image: "amazon",
      popularity: "high",
      voucherCode: "AMZ500GIFT",
      visitLink: "https://www.amazon.in/gp/redeem"
    },
    {
      id: "2",
      title: "Starbucks Coffee Voucher",
      description: "Free grande beverage at any Starbucks outlet",
      points: 0,
      pointsRequired: 3500,
      category: "voucher",
      brand: "Starbucks",
      value: 350,
      status: "available",
      image: "coffee",
      popularity: "high"
    },
    {
      id: "3",
      title: "Uber Ride Credits - ₹300",
      description: "Credit for your next Uber rides",
      points: 0,
      pointsRequired: 2800,
      category: "voucher",
      brand: "Uber",
      value: 300,
      status: "available",
      image: "car",
      popularity: "medium"
    },
    {
      id: "4",
      title: "Netflix Premium - 1 Month",
      description: "Enjoy Netflix premium for one month",
      points: 0,
      pointsRequired: 8500,
      category: "voucher",
      brand: "Netflix",
      value: 649,
      status: "available",
      image: "music",
      popularity: "high"
    },
    {
      id: "5",
      title: "10% Cashback on Next Transaction",
      description: "Get 10% cashback on your next card transaction",
      points: 0,
      pointsRequired: 1500,
      category: "cashback",
      brand: "Bank",
      value: 0,
      status: "available",
      image: "percent",
      popularity: "medium"
    },
    {
      id: "6",
      title: "Flipkart Voucher - ₹1000",
      description: "Shop electronics, fashion and more",
      points: 2500,
      pointsRequired: 10000,
      category: "voucher",
      brand: "Flipkart",
      value: 1000,
      status: "redeemed",
      redemptionDate: "2024-12-20",
      image: "shopping-cart",
      popularity: "high"
    }
  ];

  const mockPointHistory: PointHistory[] = [
    {
      id: "1",
      type: "earned",
      points: 500,
      description: "Credit card transaction cashback",
      date: "2024-12-29",
      source: "Card Transaction",
      reference: "TXN123456"
    },
    {
      id: "2",
      type: "earned",
      points: 250,
      description: "UPI payment bonus",
      date: "2024-12-28",
      source: "UPI Payment"
    },
    {
      id: "3",
      type: "redeemed",
      points: -2500,
      description: "Amazon Voucher - ₹250",
      date: "2024-12-27",
      source: "Rewards Redemption"
    },
    {
      id: "4",
      type: "earned",
      points: 1200,
      description: "Monthly bonus points",
      date: "2024-12-25",
      source: "Monthly Bonus"
    },
    {
      id: "5",
      type: "bonus",
      points: 5000,
      description: "Tier upgrade bonus",
      date: "2024-12-20",
      source: "Tier Upgrade"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cashback": return Percent;
      case "voucher": return Gift;
      case "product": return ShoppingCart;
      case "experience": return Star;
      case "discount": return Target;
      default: return Gift;
    }
  };

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "amazon": case "flipkart": return ShoppingCart;
      case "starbucks": return Coffee;
      case "uber": case "ola": return Car;
      case "netflix": case "spotify": return Music;
      case "swiggy": case "zomato": return Coffee;
      default: return Gift;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-white/10 text-white border-white/20 rounded-none";
      case "redeemed": return "bg-white/10 text-white border-white/20 rounded-none";
      case "expired": return "bg-white/10 text-white border-white/20 rounded-none";
      case "out_of_stock": return "bg-white/10 text-white border-white/20 rounded-none";
      default: return "bg-white/10 text-white border-white/20 rounded-none";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "earned": return "text-white/60";
      case "redeemed": return "text-white/60";
      case "expired": return "text-white/60";
      case "bonus": return "text-white/60";
      default: return "text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "earned": return TrendingUp;
      case "redeemed": return Gift;
      case "expired": return Clock;
      case "bonus": return Star;
      default: return Activity;
    }
  };

  const filteredRewards = mockRewards.filter(reward => {
    const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "available") return matchesSearch && reward.status === "available" && currentPoints >= reward.pointsRequired;
    if (selectedTab === "redeemed") return matchesSearch && reward.status === "redeemed";
    return matchesSearch && reward.category === selectedTab;
  });

  const pagination = usePagination({
    data: filteredRewards,
    itemsPerPage: 20,
  });

  const redeemReward = (rewardId: string) => {
    toast({
      title: "Reward Redeemed",
      description: "Your reward has been successfully redeemed!"
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Gold": return Crown;
      case "Platinum": return Trophy;
      case "Silver": return Award;
      default: return Star;
    }
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
            <h1 className="text-base font-bold tracking-wider">MY REWARDS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Points & benefits</p>
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
        {/* Points Summary */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="points-summary">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Reward Points</p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const TierIcon = getTierIcon(membershipTier);
                    return <TierIcon className="h-4 w-4 text-white/60" />;
                  })()}
                  <span className="text-xs text-white/60">{membershipTier} Member</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-current-points">
                {hideAmounts ? "••••••" : currentPoints.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Earned</p>
                <p className="text-lg font-light text-white">
                  {hideAmounts ? "•••" : pointsEarnedThisMonth.toLocaleString()}
                </p>
                <p className="text-[10px] text-white/40">This month</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Redeemed</p>
                <p className="text-lg font-light text-white">
                  {hideAmounts ? "•••" : pointsRedeemedThisMonth.toLocaleString()}
                </p>
                <p className="text-[10px] text-white/40">This month</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Progress</p>
                <p className="text-lg font-light text-white">
                  {tierProgress.toFixed(0)}%
                </p>
                <p className="text-[10px] text-white/40">To Platinum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rewards..."
              className="bg-white/5 border-white/10 text-white pl-10"
              data-testid="input-search-rewards"
            />
          </div>
        </div>

        {/* Rewards Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Available Rewards</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white p-1"
              data-testid="button-filter-rewards"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all-rewards">All ({mockRewards.length})</TabsTrigger>
              <TabsTrigger value="available" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-available">Available ({mockRewards.filter(r => r.status === "available" && currentPoints >= r.pointsRequired).length})</TabsTrigger>
              <TabsTrigger value="voucher" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-vouchers">Vouchers ({mockRewards.filter(r => r.category === "voucher").length})</TabsTrigger>
              <TabsTrigger value="cashback" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-cashback">Cashback ({mockRewards.filter(r => r.category === "cashback").length})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pagination.paginatedData.map((reward) => {
                  const CategoryIcon = getCategoryIcon(reward.category);
                  const BrandIcon = getBrandIcon(reward.brand);
                  const canRedeem = currentPoints >= reward.pointsRequired && reward.status === "available";
                  
                  return (
                    <div
                      key={reward.id}
                      className="relative group bg-white/5 border border-white/10 rounded-none p-5 hover:border-white/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      data-testid={`reward-${reward.id}`}
                    >
                      {/* Background Glow Effect */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                      
                      <div className="relative z-10 space-y-4">
                        {/* Reward Header with Icon and Title */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <BrandIcon className="h-7 w-7 text-white" />
                            </div>
                            {reward.popularity === "high" && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                <Star className="h-3 w-3 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-base leading-tight mb-1 line-clamp-1">
                              {reward.title}
                            </h4>
                            <p className="text-sm text-white/70 line-clamp-2 mb-2">
                              {reward.description}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {reward.status === "available" && canRedeem ? (
                                <Badge className="text-xs px-3 py-1 bg-white/10 border-white/20 text-white rounded-none font-semibold flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  AVAILABLE
                                </Badge>
                              ) : (
                                <Badge className={cn("text-xs px-2 py-0.5 border rounded-full", getStatusColor(reward.status))}>
                                  {reward.status.toUpperCase().replace('_', ' ')}
                                </Badge>
                              )}
                              <Badge className="text-xs px-2 py-0.5 border border-white/20 bg-white/10 text-white/70 rounded-full uppercase">
                                {reward.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Value Display */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-white/60 mb-1">Points Required</p>
                              <p className="text-2xl font-bold text-white" data-testid={`text-points-required-${reward.id}`}>
                                {reward.pointsRequired.toLocaleString()}
                              </p>
                            </div>
                            {reward.value > 0 && (
                              <div className="text-right">
                                <p className="text-xs text-white/60 mb-1">Value</p>
                                <p className="text-xl font-bold text-white">₹{reward.value}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Redeemed Status */}
                        {reward.status === "redeemed" && reward.redemptionDate && (
                          <div className="text-xs bg-white/5 border border-white/10 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white/60 font-medium">Redeemed on:</span>
                              <span className="text-white/90">
                                {new Date(reward.redemptionDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {reward.status === "available" && (
                            <Button
                              size="sm"
                              className={cn(
                                "flex-1 rounded-xl font-semibold transition-all duration-300",
                                canRedeem 
                                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-white/15 hover:to-white/10 shadow-lg shadow-red-500/25" 
                                  : "bg-white/10 text-white/40 cursor-not-allowed border border-white/20"
                              )}
                              onClick={() => canRedeem && redeemReward(reward.id)}
                              disabled={!canRedeem}
                              data-testid={`button-redeem-${reward.id}`}
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              {canRedeem ? "Redeem Now" : "Insufficient Points"}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRewardDetail(reward);
                              setDetailsDialogOpen(true);
                            }}
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl border border-white/20"
                            data-testid={`button-view-details-${reward.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredRewards.length > 0 && (
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
            </TabsContent>
          </Tabs>
        </div>

        {/* Points History */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <div className="space-y-3">
            {mockPointHistory.slice(0, 5).map((history) => {
              const TypeIcon = getTypeIcon(history.type);
              
              return (
                <div
                  key={history.id}
                  className="bg-white/5 border border-white/10 p-3 hover:bg-white/5 transition-all duration-200"
                  data-testid={`history-${history.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-white/60 flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{history.description}</h4>
                        <p className="text-xs text-white/60">{history.source}</p>
                        <p className="text-xs text-white/40">
                          {new Date(history.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-bold",
                        getTypeColor(history.type)
                      )} data-testid={`text-points-${history.id}`}>
                        {history.points > 0 ? "+" : ""}{history.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-white/60 capitalize">{history.type}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => navigate("/earn-points")}
              className="bg-white text-black hover:bg-white/90 h-12 justify-start"
              data-testid="button-earn-points"
            >
              <Plus className="h-4 w-4 mr-2" />
              Earn More Points
            </Button>
            <Button
              onClick={() => navigate("/points-history")}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/10"
              data-testid="button-points-history"
            >
              <Activity className="h-4 w-4 mr-2" />
              View Full History
            </Button>
            <Button
              onClick={() => navigate("/refer-friends")}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/10"
              data-testid="button-refer-friends"
            >
              <Users className="h-4 w-4 mr-2" />
              Refer & Earn
            </Button>
          </div>
        </div>

        {/* Rewards Tips */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg" data-testid="rewards-tips">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Earning Tips</h4>
              <p className="text-xs text-white/60">
                Use your cards for transactions to earn more points
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white p-1"
                onClick={() => toast({ title: "Tips", description: "More earning tips coming soon!" })}
                data-testid="button-more-tips"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedRewardDetail?.title}</DialogTitle>
          </DialogHeader>
          {selectedRewardDetail && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Brand</p>
                  <p className="font-semibold">{selectedRewardDetail.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60 mb-1">Value</p>
                  <p className="text-xl font-bold text-white">₹{selectedRewardDetail.value}</p>
                </div>
              </div>

              {selectedRewardDetail.brandDescription && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/60 mb-1">About {selectedRewardDetail.brand}</p>
                  <p className="text-xs text-white/80">{selectedRewardDetail.brandDescription}</p>
                </div>
              )}

              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-sm text-white/60 mb-1">Points Required</p>
                <p className="text-2xl font-bold">{selectedRewardDetail.pointsRequired.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-white/60 mb-2">Description</p>
                <p className="text-sm text-white/80">{selectedRewardDetail.description}</p>
              </div>

              {selectedRewardDetail.voucherCode && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/60 mb-2">Voucher Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/30 px-3 py-2 rounded font-mono text-sm text-white">
                      {selectedRewardDetail.voucherCode}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedRewardDetail.voucherCode || "");
                        toast({ title: "Code Copied!", description: "Voucher code copied to clipboard" });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedRewardDetail.termsAndConditions && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Terms & Conditions</p>
                  <p className="text-xs text-white/60">{selectedRewardDetail.termsAndConditions}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs px-3 py-1", 
                  selectedRewardDetail.status === "available" ? "bg-white/10 text-white border-white/20 rounded-none" : "bg-white/10 text-white/60 border-white/20 rounded-none"
                )}>
                  {selectedRewardDetail.status.toUpperCase().replace('_', ' ')}
                </Badge>
                <Badge className="text-xs px-3 py-1 bg-white/10 text-white/70 uppercase">
                  {selectedRewardDetail.category}
                </Badge>
              </div>

              <div className="flex gap-2">
                {selectedRewardDetail.visitLink && (
                  <Button
                    onClick={() => {
                      window.open(selectedRewardDetail.visitLink, '_blank');
                    }}
                    className="flex-1 bg-white text-black hover:bg-white/90 rounded-none"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Link
                  </Button>
                )}
                {selectedRewardDetail.status === "available" && currentPoints >= selectedRewardDetail.pointsRequired && (
                  <Button
                    onClick={() => {
                      redeemReward(selectedRewardDetail.id);
                      setDetailsDialogOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-white/15 hover:to-white/10"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Redeem Now
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}