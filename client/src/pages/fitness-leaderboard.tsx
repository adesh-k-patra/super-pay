import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  Award,
  Target,
  Calendar
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: number; // position change from last week
  avatar?: string;
  level: number;
  totalChallenges: number;
  isCurrentUser?: boolean;
}

export default function FitnessLeaderboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("weekly");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Mock leaderboard data - extended version
  const mockWeeklyLeaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Alex Chen",
      score: 2890,
      rank: 1,
      change: 0,
      level: 25,
      totalChallenges: 47,
      isCurrentUser: false
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      score: 2756,
      rank: 2,
      change: 2,
      level: 23,
      totalChallenges: 42,
      isCurrentUser: false
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      score: 2634,
      rank: 3,
      change: -1,
      level: 22,
      totalChallenges: 39,
      isCurrentUser: false
    },
    {
      id: "4",
      name: "You",
      score: 2398,
      rank: 4,
      change: 1,
      level: 19,
      totalChallenges: 34,
      isCurrentUser: true
    },
    {
      id: "5",
      name: "Emma Wilson",
      score: 2156,
      rank: 5,
      change: -2,
      level: 18,
      totalChallenges: 31,
      isCurrentUser: false
    },
    {
      id: "6",
      name: "David Kim",
      score: 2089,
      rank: 6,
      change: 3,
      level: 17,
      totalChallenges: 28,
      isCurrentUser: false
    },
    {
      id: "7",
      name: "Lisa Thompson",
      score: 1965,
      rank: 7,
      change: -1,
      level: 16,
      totalChallenges: 25,
      isCurrentUser: false
    },
    {
      id: "8",
      name: "James Park",
      score: 1834,
      rank: 8,
      change: 0,
      level: 15,
      totalChallenges: 23,
      isCurrentUser: false
    },
    {
      id: "9",
      name: "Maria Garcia",
      score: 1723,
      rank: 9,
      change: 2,
      level: 14,
      totalChallenges: 21,
      isCurrentUser: false
    },
    {
      id: "10",
      name: "Ryan Davis",
      score: 1612,
      rank: 10,
      change: -3,
      level: 13,
      totalChallenges: 19,
      isCurrentUser: false
    }
  ];

  const mockAllTimeLeaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      score: 15890,
      rank: 1,
      change: 1,
      level: 35,
      totalChallenges: 156,
      isCurrentUser: false
    },
    {
      id: "2",
      name: "Alex Chen",
      score: 14756,
      rank: 2,
      change: -1,
      level: 33,
      totalChallenges: 142,
      isCurrentUser: false
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      score: 13634,
      rank: 3,
      change: 0,
      level: 31,
      totalChallenges: 128,
      isCurrentUser: false
    },
    {
      id: "4",
      name: "Emma Wilson",
      score: 12456,
      rank: 4,
      change: 2,
      level: 29,
      totalChallenges: 115,
      isCurrentUser: false
    },
    {
      id: "5",
      name: "David Kim",
      score: 11234,
      rank: 5,
      change: -1,
      level: 27,
      totalChallenges: 103,
      isCurrentUser: false
    },
    {
      id: "6",
      name: "You",
      score: 10398,
      rank: 6,
      change: 1,
      level: 25,
      totalChallenges: 89,
      isCurrentUser: true
    },
    {
      id: "7",
      name: "Lisa Thompson",
      score: 9765,
      rank: 7,
      change: -2,
      level: 23,
      totalChallenges: 87,
      isCurrentUser: false
    },
    {
      id: "8",
      name: "James Park",
      score: 8934,
      rank: 8,
      change: 0,
      level: 21,
      totalChallenges: 76,
      isCurrentUser: false
    },
    {
      id: "9",
      name: "Maria Garcia",
      score: 8123,
      rank: 9,
      change: 1,
      level: 19,
      totalChallenges: 68,
      isCurrentUser: false
    },
    {
      id: "10",
      name: "Ryan Davis",
      score: 7612,
      rank: 10,
      change: -1,
      level: 17,
      totalChallenges: 62,
      isCurrentUser: false
    }
  ];

  // Fetch leaderboard data
  const { data: weeklyLeaderboard = mockWeeklyLeaderboard, isLoading: weeklyLoading } = useQuery({
    queryKey: ["/api/fitness/leaderboard/weekly"],
    enabled: isAuthenticated,
    queryFn: async () => mockWeeklyLeaderboard,
  });

  const { data: allTimeLeaderboard = mockAllTimeLeaderboard, isLoading: allTimeLoading } = useQuery({
    queryKey: ["/api/fitness/leaderboard/all"],
    enabled: isAuthenticated,
    queryFn: async () => mockAllTimeLeaderboard,
  });

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-white/80" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-white/80" />;
    return <Minus className="h-3 w-3 text-white/80" />;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank === 2) return <Medal className="h-4 w-4" />;
    if (rank === 3) return <Star className="h-4 w-4" />;
    return rank;
  };

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'bg-white/10 text-white';
    if (rank === 2) return 'bg-white/10 text-white';
    if (rank === 3) return 'bg-white/10 text-white';
    return 'bg-white/10 text-white/80';
  };

  const currentUserData = selectedTab === "weekly" 
    ? weeklyLeaderboard.find(entry => entry.isCurrentUser)
    : allTimeLeaderboard.find(entry => entry.isCurrentUser);

  const activeLeaderboard = selectedTab === "weekly" ? weeklyLeaderboard : allTimeLeaderboard;
  const isLoadingLeaderboard = selectedTab === "weekly" ? weeklyLoading : allTimeLoading;

  const pagination = usePagination({
    data: activeLeaderboard,
    itemsPerPage: 10,
  });

  useEffect(() => {
    pagination.goToPage(1);
  }, [selectedTab]);

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
            <h1 className="text-white text-2xl font-bold">Fitness Leaderboard</h1>
            <p className="text-white/80 text-sm">Track your rank and compete with others</p>
          </div>
        </div>

        {/* Your Position Cards */}
        {currentUserData && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Current Rank Card */}
            <GlassmorphicCard variant="red" gradient={true} hover={true} className="shadow-lg shadow-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center shadow-md">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">#{currentUserData.rank}</div>
                  <div className="text-red-100 text-xs font-medium">Your Rank</div>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Score Card */}
            <GlassmorphicCard variant="yellow" gradient={true} hover={true} className="shadow-lg shadow-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{currentUserData.score.toLocaleString()}</div>
                  <div className="text-yellow-100 text-xs font-medium">Your Score</div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        )}

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-3">
          {/* Level */}
          <GlassmorphicCard variant="purple" gradient={true} hover={true} className="shadow-lg shadow-purple-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">Level {currentUserData?.level || 19}</div>
              <div className="text-purple-100 text-xs font-medium leading-tight">Your Level</div>
            </div>
          </GlassmorphicCard>

          {/* Total Challenges */}
          <GlassmorphicCard variant="green" gradient={true} hover={true} className="shadow-lg shadow-green-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{currentUserData?.totalChallenges || 34}</div>
              <div className="text-green-100 text-xs font-medium leading-tight">Challenges</div>
            </div>
          </GlassmorphicCard>

          {/* Rank Change */}
          <GlassmorphicCard variant="blue" gradient={true} hover={true} className="shadow-lg shadow-blue-500/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                {getChangeIcon(currentUserData?.change || 0)}
              </div>
              <div className="text-lg font-bold text-white">{Math.abs(currentUserData?.change || 0)}</div>
              <div className="text-blue-100 text-xs font-medium leading-tight">Rank Change</div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Leaderboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-none p-1">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-weekly">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-all">
              <Trophy className="h-4 w-4 mr-2" />
              All Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-white/20/30 shadow-lg shadow-red-100/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">This Week's Top Performers</h3>
                <Badge className="bg-yellow-100 text-yellow-700">
                  Last 7 days
                </Badge>
              </div>
              
              <div className="space-y-3">
                {isLoadingLeaderboard ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : (
                  pagination.paginatedData.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        entry.isCurrentUser 
                          ? 'bg-white/5 border border-white/20' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      data-testid={`leaderboard-entry-${entry.id}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadgeClass(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className={`font-medium ${entry.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                              {entry.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              Level {entry.level} • {entry.totalChallenges} challenges
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Score and Change */}
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{entry.score.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {getChangeIcon(entry.change)}
                          <span className={`${
                            entry.change > 0 ? 'text-white/80' : 
                            entry.change < 0 ? 'text-white/80' : 
                            'text-white/80'
                          }`}>
                            {entry.change !== 0 ? Math.abs(entry.change) : 'No change'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {activeLeaderboard.length > 0 && (
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

          <TabsContent value="all" className="space-y-4">
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl border border-white/20/30 shadow-lg shadow-red-100/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">All-Time Champions</h3>
                <Badge className="bg-white/5 text-purple-700">
                  Overall rankings
                </Badge>
              </div>
              
              <div className="space-y-3">
                {isLoadingLeaderboard ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : (
                  pagination.paginatedData.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        entry.isCurrentUser 
                          ? 'bg-white/5 border border-white/20' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      data-testid={`leaderboard-entry-${entry.id}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadgeClass(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className={`font-medium ${entry.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                              {entry.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              Level {entry.level} • {entry.totalChallenges} challenges
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Score and Change */}
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{entry.score.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {getChangeIcon(entry.change)}
                          <span className={`${
                            entry.change > 0 ? 'text-white/80' : 
                            entry.change < 0 ? 'text-white/80' : 
                            'text-white/80'
                          }`}>
                            {entry.change !== 0 ? Math.abs(entry.change) : 'No change'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {activeLeaderboard.length > 0 && (
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