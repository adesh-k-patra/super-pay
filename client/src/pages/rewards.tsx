import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Search,
  Trophy,
  Gift,
  Coins,
  Star,
  CreditCard,
  Users,
  Zap,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
  ShoppingBag,
  Crown,
  Smartphone,
  Receipt,
  Info
} from "lucide-react";

// Mock rewards data
const REWARDS_OVERVIEW = {
  totalPoints: 2850,
  totalEarned: 12450,
  totalRedeemed: 9600,
  currentTier: "Gold",
  nextTier: "Platinum",
  pointsToNextTier: 1150,
  tierProgress: 71
};

const REWARD_CARDS = [
  {
    id: "1",
    title: "Amazon Gift Card",
    description: "₹500 Amazon shopping voucher",
    pointsRequired: 500,
    category: "Shopping",
    icon: Gift,
    color: "bg-white/10",
    gradient: "from-orange-500/20 to-orange-600/10",
    validity: "6 months",
    popular: true
  },
  {
    id: "2",
    title: "Flipkart Voucher", 
    description: "₹300 Flipkart shopping voucher",
    pointsRequired: 300,
    category: "Shopping",
    icon: ShoppingBag,
    color: "bg-white/10",
    gradient: "from-white/10 to-white/5",
    validity: "12 months",
    popular: true
  },
  {
    id: "3",
    title: "Wallet Cashback",
    description: "₹200 direct wallet cashback",
    pointsRequired: 200,
    category: "Cashback",
    icon: Coins,
    color: "bg-white/10", 
    gradient: "from-white/10/20 to-white/5/10",
    validity: "Instant",
    popular: false
  },
  {
    id: "4",
    title: "Mobile Recharge",
    description: "₹100 mobile recharge voucher",
    pointsRequired: 100,
    category: "Recharge",
    icon: Smartphone,
    color: "bg-white/10",
    gradient: "from-purple-500/20 to-purple-600/10",
    validity: "3 months",
    popular: false
  },
  {
    id: "5",
    title: "Premium Subscription",
    description: "3 months Super Pay Premium access",
    pointsRequired: 1000,
    category: "Premium",
    icon: Crown,
    color: "bg-white/10",
    gradient: "from-yellow-500/20 to-yellow-600/10",
    validity: "3 months",
    popular: true
  },
  {
    id: "6",
    title: "Paytm Cashback",
    description: "₹150 Paytm wallet cashback",
    pointsRequired: 150,
    category: "Cashback",
    icon: Coins,
    color: "bg-white/10",
    gradient: "from-cyan-500/20 to-cyan-600/10", 
    validity: "6 months",
    popular: false
  }
];

const EARNING_ACTIVITIES = [
  {
    activity: "UPI Payments",
    points: "5 pts per ₹100",
    icon: Zap,
    color: "text-white/80"
  },
  {
    activity: "Bill Payments",
    points: "10 pts per payment",
    icon: Receipt,
    color: "text-white/80"
  },
  {
    activity: "EMI Payments",
    points: "50 pts per payment",
    icon: CreditCard,
    color: "text-white/80"
  },
  {
    activity: "Friend Referrals",
    points: "500 pts per friend",
    icon: Users,
    color: "text-white/80"
  },
  {
    activity: "Daily Check-in",
    points: "10 pts daily",
    icon: Calendar,
    color: "text-white/80"
  }
];

const RECENT_ACTIVITY = [
  {
    id: "1",
    type: "redeem",
    description: "Amazon Gift Card ₹500",
    points: -500,
    date: "2 days ago",
    status: "completed"
  },
  {
    id: "2", 
    type: "earn",
    description: "UPI Payment bonus",
    points: 25,
    date: "3 days ago",
    status: "completed"
  },
  {
    id: "3",
    type: "earn", 
    description: "Bill payment reward",
    points: 10,
    date: "5 days ago",
    status: "completed"
  },
  {
    id: "4",
    type: "redeem",
    description: "Mobile recharge ₹100",
    points: -100,
    date: "1 week ago", 
    status: "completed"
  }
];

export default function Rewards() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useUrlTab("redeem");
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/home");
  };

  const handleRedeem = (rewardId: string, rewardTitle: string, pointsRequired: number) => {
    if (REWARDS_OVERVIEW.totalPoints < pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pointsRequired - REWARDS_OVERVIEW.totalPoints} more points to redeem this reward.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reward Redeemed!",
      description: `Successfully redeemed ${rewardTitle}`,
    });
  };

  const filteredRewards = REWARD_CARDS.filter(reward =>
    reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reward.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pagination = usePagination({
    data: filteredRewards,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">REWARDS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Earn & Redeem Points</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/rewards/info")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-rewards-info"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Rewards Summary */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Your Points</CardTitle>
                  <p className="text-white/60 text-sm">{REWARDS_OVERVIEW.currentTier} Member</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
                {REWARDS_OVERVIEW.currentTier}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">
                {REWARDS_OVERVIEW.totalPoints.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm">Available Points</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-lg font-semibold text-white/80">
                  +{REWARDS_OVERVIEW.totalEarned.toLocaleString()}
                </p>
                <p className="text-white/60 text-xs">Total Earned</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white/80">
                  -{REWARDS_OVERVIEW.totalRedeemed.toLocaleString()}
                </p>
                <p className="text-white/60 text-xs">Total Redeemed</p>
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Progress to {REWARDS_OVERVIEW.nextTier}</span>
                <span className="text-white/60 text-sm">{REWARDS_OVERVIEW.pointsToNextTier} pts to go</span>
              </div>
              <Progress value={REWARDS_OVERVIEW.tierProgress} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-black border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-white/40 focus:ring-0 h-12"
            data-testid="input-search-rewards"
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none p-1">
            <TabsTrigger 
              value="redeem" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-redeem"
            >
              Redeem
            </TabsTrigger>
            <TabsTrigger 
              value="earn" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-earn"
            >
              Earn Points
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-history"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="redeem" className="space-y-6 mt-6">
            {/* Popular Rewards */}
            <div>
              <h2 className="text-sm font-medium text-white/80 mb-3">Popular Rewards</h2>
              <div className="grid grid-cols-2 gap-3">
                {filteredRewards.filter(reward => reward.popular).map((reward) => (
                  <Card key={reward.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r mb-3",
                        reward.gradient
                      )}>
                        <reward.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium text-white text-sm mb-1">{reward.title}</h3>
                      <p className="text-xs text-white/60 mb-3 leading-tight">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{reward.pointsRequired} pts</p>
                          <Badge variant="secondary" className="text-xs bg-white/20 text-white/80 border-0 mt-1">
                            {reward.category}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleRedeem(reward.id, reward.title, reward.pointsRequired)}
                          disabled={REWARDS_OVERVIEW.totalPoints < reward.pointsRequired}
                          className="bg-white text-black hover:bg-white/90 text-xs h-8 px-3"
                          data-testid={`button-redeem-${reward.id}`}
                        >
                          Redeem
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Rewards */}
            <div>
              <h2 className="text-sm font-medium text-white/80 mb-3">All Rewards</h2>
              <div className="space-y-3">
                {pagination.paginatedData.map((reward) => (
                  <Card key={reward.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:bg-white/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r",
                            reward.gradient
                          )}>
                            <reward.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{reward.title}</p>
                            <p className="text-xs text-white/60">{reward.description}</p>
                            <p className="text-xs text-white/50 mt-1">Valid: {reward.validity}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-white text-sm">{reward.pointsRequired} pts</p>
                          <Button
                            size="sm"
                            onClick={() => handleRedeem(reward.id, reward.title, reward.pointsRequired)}
                            disabled={REWARDS_OVERVIEW.totalPoints < reward.pointsRequired}
                            className="bg-white text-black hover:bg-white/90 text-xs h-7 px-3 mt-1"
                            data-testid={`button-redeem-all-${reward.id}`}
                          >
                            Redeem
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

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
              </div>
            </div>

            {/* Empty state for search */}
            {searchQuery && filteredRewards.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">No rewards found matching "{searchQuery}"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="earn" className="space-y-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Ways to Earn Points</h2>
              <div className="space-y-3">
                {EARNING_ACTIVITIES.map((activity, index) => (
                  <Card key={index} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <activity.icon className={cn("h-6 w-6", activity.color)} />
                          <div>
                            <p className="font-medium text-white">{activity.activity}</p>
                            <p className="text-xs text-white/60">Easy way to earn points</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">{activity.points}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((activity) => (
                  <Card key={activity.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            activity.type === "earn" ? "bg-white/10" : "bg-white/10"
                          )}>
                            {activity.type === "earn" ? 
                              <TrendingUp className="h-4 w-4 text-white/80" /> :
                              <Gift className="h-4 w-4 text-white/80" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{activity.description}</p>
                            <p className="text-xs text-white/60">{activity.date}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={cn(
                            "font-semibold text-sm",
                            activity.points > 0 ? "text-white/80" : "text-white/80"
                          )}>
                            {activity.points > 0 ? "+" : ""}{activity.points} pts
                          </p>
                          <div className="flex items-center gap-1 justify-end">
                            <CheckCircle className="h-3 w-3 text-white/80" />
                            <span className="text-xs text-white/60">Completed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}