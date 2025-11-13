import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  Trophy,
  Crown,
  Medal,
  Star,
  Award,
  Target,
  Zap,
  Gift,
  Flame,
  Mountain,
  Heart,
  CheckCircle,
  Lock,
  Calendar,
  TrendingUp
} from "lucide-react";

interface Reward {
  id: string;
  title: string;
  description: string;
  type: "badge" | "trophy" | "achievement" | "coins";
  value: number; // coins or XP value
  icon: any;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  dateEarned?: Date;
  isUnlocked: boolean;
  progressCurrent?: number;
  progressTotal?: number;
  challengeSource?: string;
}

interface UserRewardsStats {
  totalRewards: number;
  totalCoinsEarned: number;
  totalXpEarned: number;
  badgesCollected: number;
  trophiesEarned: number;
  achievementsUnlocked: number;
  currentStreak: number;
  rarityBreakdown: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

export default function FitnessRewards() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("collected");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Mock rewards data
  const mockCollectedRewards: Reward[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first fitness challenge",
      type: "badge",
      value: 50,
      icon: Target,
      color: "bg-white/10",
      rarity: "common",
      dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isUnlocked: true,
      challengeSource: "10K Steps Challenge"
    },
    {
      id: "2",
      title: "Streak Master",
      description: "Maintain a 7-day workout streak",
      type: "trophy",
      value: 150,
      icon: Flame,
      color: "bg-white/10",
      rarity: "rare",
      dateEarned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isUnlocked: true,
      challengeSource: "30-Day Workout Streak"
    },
    {
      id: "3",
      title: "Mountain Climber",
      description: "Complete 5 endurance challenges",
      type: "achievement",
      value: 300,
      icon: Mountain,
      color: "bg-white/10",
      rarity: "epic",
      dateEarned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isUnlocked: true,
      challengeSource: "Endurance Master Series"
    },
    {
      id: "4",
      title: "Coin Collector",
      description: "Earn 1000 total coins",
      type: "coins",
      value: 100,
      icon: Award,
      color: "bg-white/10",
      rarity: "common",
      dateEarned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isUnlocked: true,
      challengeSource: "Various Challenges"
    },
    {
      id: "5",
      title: "Health Warrior",
      description: "Complete 20 health-focused challenges",
      type: "badge",
      value: 200,
      icon: Heart,
      color: "bg-white/10",
      rarity: "rare",
      dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isUnlocked: true,
      challengeSource: "Health & Wellness Series"
    }
  ];

  const mockProgressRewards: Reward[] = [
    {
      id: "6",
      title: "Champion",
      description: "Win 10 weekly leaderboard competitions",
      type: "trophy",
      value: 500,
      icon: Crown,
      color: "bg-white/10",
      rarity: "legendary",
      isUnlocked: false,
      progressCurrent: 3,
      progressTotal: 10,
      challengeSource: "Weekly Competitions"
    },
    {
      id: "7",
      title: "Consistency King",
      description: "Maintain a 30-day streak",
      type: "achievement",
      value: 400,
      icon: Zap,
      color: "bg-white/10",
      rarity: "epic",
      isUnlocked: false,
      progressCurrent: 12,
      progressTotal: 30,
      challengeSource: "Daily Challenges"
    },
    {
      id: "8",
      title: "Social Butterfly",
      description: "Join 25 group challenges",
      type: "badge",
      value: 150,
      icon: Target,
      color: "bg-white/10",
      rarity: "rare",
      isUnlocked: false,
      progressCurrent: 8,
      progressTotal: 25,
      challengeSource: "Group Activities"
    },
    {
      id: "9",
      title: "Elite Performer",
      description: "Reach top 3 in leaderboard 5 times",
      type: "trophy",
      value: 350,
      icon: Medal,
      color: "bg-white/10",
      rarity: "epic",
      isUnlocked: false,
      progressCurrent: 1,
      progressTotal: 5,
      challengeSource: "Leaderboard Rankings"
    }
  ];

  const mockUserStats: UserRewardsStats = {
    totalRewards: mockCollectedRewards.length,
    totalCoinsEarned: mockCollectedRewards.reduce((sum, reward) => sum + (reward.type === 'coins' ? reward.value : 0), 0) + 850,
    totalXpEarned: mockCollectedRewards.reduce((sum, reward) => sum + (reward.type !== 'coins' ? reward.value : 0), 0) + 1200,
    badgesCollected: mockCollectedRewards.filter(r => r.type === 'badge').length,
    trophiesEarned: mockCollectedRewards.filter(r => r.type === 'trophy').length,
    achievementsUnlocked: mockCollectedRewards.filter(r => r.type === 'achievement').length,
    currentStreak: 12,
    rarityBreakdown: {
      common: mockCollectedRewards.filter(r => r.rarity === 'common').length,
      rare: mockCollectedRewards.filter(r => r.rarity === 'rare').length,
      epic: mockCollectedRewards.filter(r => r.rarity === 'epic').length,
      legendary: mockCollectedRewards.filter(r => r.rarity === 'legendary').length
    }
  };

  // Fetch rewards data
  const { data: collectedRewards = mockCollectedRewards, isLoading: collectedLoading } = useQuery({
    queryKey: ["/api/fitness/rewards/collected"],
    enabled: isAuthenticated,
    queryFn: async () => mockCollectedRewards,
  });

  const { data: progressRewards = mockProgressRewards, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/fitness/rewards/progress"],
    enabled: isAuthenticated,
    queryFn: async () => mockProgressRewards,
  });

  const { data: userStats = mockUserStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/fitness/rewards/stats"],
    enabled: isAuthenticated,
    queryFn: async () => mockUserStats,
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-white/20 bg-white/5";
      case "rare": return "border-white/20 bg-white/5";
      case "epic": return "border-white/20 bg-white/5";
      case "legendary": return "border-white/20 bg-white/5";
      default: return "border-white/20 bg-white/5";
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-white/10 text-white/80";
      case "rare": return "bg-white/5 text-blue-700";
      case "epic": return "bg-white/5 text-purple-700";
      case "legendary": return "bg-yellow-100 text-yellow-700";
      default: return "bg-white/10 text-white/80";
    }
  };

  const activeRewards = selectedTab === "collected" ? collectedRewards : progressRewards;
  const isLoadingRewards = selectedTab === "collected" ? collectedLoading : progressLoading;

  const pagination = usePagination({
    data: activeRewards,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Red Header with Stats Cards */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 pt-8 pb-6 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={() => navigate("/fitness")}
            variant="ghost"
            size="sm"
            className="text-white p-2 hover:bg-white/20 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Rewards & Achievements</h1>
            <p className="text-white/80 text-sm">Collect badges, trophies and achievements</p>
          </div>
        </div>

        {/* Rewards Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Total Rewards Card */}
          <GlassmorphicCard variant="red" gradient={true} hover={true} className="shadow-lg shadow-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center shadow-md">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{userStats.totalRewards}</div>
                <div className="text-red-100 text-xs font-medium">Total Rewards</div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Total Coins Earned Card */}
          <GlassmorphicCard variant="yellow" gradient={true} hover={true} className="shadow-lg shadow-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{userStats.totalCoinsEarned.toLocaleString()}</div>
                <div className="text-yellow-100 text-xs font-medium">Coins Earned</div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Secondary Rewards Stats */}
        <div className="grid grid-cols-4 gap-3">
          {/* Badges */}
          <GlassmorphicCard variant="blue" gradient={true} hover={true} className="shadow-lg shadow-blue-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{userStats.badgesCollected}</div>
              <div className="text-blue-100 text-xs font-medium leading-tight">Badges</div>
            </div>
          </GlassmorphicCard>

          {/* Trophies */}
          <GlassmorphicCard variant="purple" gradient={true} hover={true} className="shadow-lg shadow-purple-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{userStats.trophiesEarned}</div>
              <div className="text-purple-100 text-xs font-medium leading-tight">Trophies</div>
            </div>
          </GlassmorphicCard>

          {/* Achievements */}
          <GlassmorphicCard variant="green" gradient={true} hover={true} className="shadow-lg shadow-green-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <Star className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{userStats.achievementsUnlocked}</div>
              <div className="text-green-100 text-xs font-medium leading-tight">Achievements</div>
            </div>
          </GlassmorphicCard>

          {/* XP Earned */}
          <GlassmorphicCard variant="teal" gradient={true} hover={true} className="shadow-lg shadow-teal-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{userStats.totalXpEarned.toLocaleString()}</div>
              <div className="text-teal-100 text-xs font-medium leading-tight">XP Earned</div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Rewards Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-none p-1">
            <TabsTrigger value="collected" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-collected">
              <CheckCircle className="h-4 w-4 mr-2" />
              Collected
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-progress">
              <TrendingUp className="h-4 w-4 mr-2" />
              In Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collected" className="space-y-4">
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-white/20/30 shadow-lg shadow-red-100/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your Collection</h3>
                <Badge className="bg-white/5 text-white/80">
                  {userStats.totalRewards} unlocked
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {isLoadingRewards ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : (
                  pagination.paginatedData.map((reward) => {
                    const RewardIcon = reward.icon;
                    return (
                      <div 
                        key={reward.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${getRarityColor(reward.rarity)} hover:shadow-md`}
                        data-testid={`reward-${reward.id}`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Reward Icon */}
                          <div className={`w-12 h-12 ${reward.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                            <RewardIcon className="h-6 w-6" />
                          </div>
                          
                          {/* Reward Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                              <Badge className={`text-xs ${getRarityBadgeColor(reward.rarity)}`}>
                                {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{reward.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>+{reward.value} {reward.type === 'coins' ? 'coins' : 'XP'}</span>
                              {reward.challengeSource && <span>• {reward.challengeSource}</span>}
                              {reward.dateEarned && (
                                <span>• Earned {reward.dateEarned.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-white/80" />
                        </div>
                      </div>
                    );
                  })
                )}

                {activeRewards.length > 0 && (
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
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-white/20/30 shadow-lg shadow-red-100/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">In Progress</h3>
                <Badge className="bg-orange-100 text-orange-700">
                  {progressRewards.length} available
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {isLoadingRewards ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : (
                  pagination.paginatedData.map((reward) => {
                    const RewardIcon = reward.icon;
                    const progress = reward.progressCurrent && reward.progressTotal 
                      ? (reward.progressCurrent / reward.progressTotal) * 100 
                      : 0;
                    
                    return (
                      <div 
                        key={reward.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${getRarityColor(reward.rarity)} hover:shadow-md`}
                        data-testid={`reward-progress-${reward.id}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Reward Icon */}
                          <div className={`w-12 h-12 ${reward.color} rounded-xl flex items-center justify-center text-white shadow-md relative`}>
                            <RewardIcon className="h-6 w-6" />
                            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                              <Lock className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          
                          {/* Reward Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                              <Badge className={`text-xs ${getRarityBadgeColor(reward.rarity)}`}>
                                {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                            
                            {/* Progress Bar */}
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1 text-xs">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">
                                  {reward.progressCurrent}/{reward.progressTotal}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Reward: +{reward.value} {reward.type === 'coins' ? 'coins' : 'XP'}</span>
                              {reward.challengeSource && <span>• {reward.challengeSource}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {activeRewards.length > 0 && (
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
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}