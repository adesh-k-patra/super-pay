import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { cn } from "@/lib/utils";
import { LoadingLogo } from "@/components/ui/loading-logo";
import { 
  ArrowLeft,
  Users,
  Gift,
  Copy,
  Share2,
  Trophy,
  Star,
  TrendingUp,
  CheckCircle,
  Target,
  Crown,
  Award,
  Zap,
  DollarSign,
  UserPlus,
  Link,
  Phone,
  Mail,
  MessageCircle,
  Smartphone,
  QrCode,
  Download,
  Coins,
  Calendar,
  BarChart3,
  Activity,
  RefreshCw,
  AlertCircle,
  Loader2,
  Check,
  ExternalLink,
  Info,
  Plus,
  Sparkles,
  Flame,
  Rocket,
  Medal,
  Shield,
  ChevronRight,
  TrendingDown,
  Clock,
  Eye,
  Share,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Hash,
  MapPin,
  Percent,
  Settings,
  Bell,
  Heart,
  ThumbsUp,
  MessageSquare,
  Send,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  CircleDollarSign,
  Wallet,
  Hexagon
} from "lucide-react";

import type { ReferralProgram, ReferralTransaction } from "@shared/schema";

// Enhanced interfaces for advanced features
interface ReferralAnalytics {
  conversionRate: number;
  averageEarningsPerReferral: number;
  topPerformingChannel: string;
  optimalSharingTime: string;
  weeklyGrowthRate: number;
  monthlyProjection: number;
  socialEngagementScore: number;
  referralFunnelData: {
    stage: string;
    count: number;
    conversionRate: number;
  }[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
  reward: number;
}

interface SocialChannel {
  name: string;
  icon: any;
  color: string;
  description: string;
  enabled: boolean;
  clicks: number;
  conversions: number;
}

interface ReferralChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  deadline: string;
  active: boolean;
  category: string;
}

// Mock data for enhanced features
const mockReferralAnalytics: ReferralAnalytics = {
  conversionRate: 68.5,
  averageEarningsPerReferral: 750,
  topPerformingChannel: "WhatsApp",
  optimalSharingTime: "7-9 PM",
  weeklyGrowthRate: 15.3,
  monthlyProjection: 12500,
  socialEngagementScore: 8.7,
  referralFunnelData: [
    { stage: "Code Shared", count: 45, conversionRate: 100 },
    { stage: "Clicked Link", count: 38, conversionRate: 84.4 },
    { stage: "Started Signup", count: 32, conversionRate: 84.2 },
    { stage: "Completed Signup", count: 28, conversionRate: 87.5 },
    { stage: "First Transaction", count: 24, conversionRate: 85.7 }
  ]
};

const mockAchievements: Achievement[] = [
  {
    id: "first-referral",
    title: "First Success",
    description: "Complete your first successful referral",
    icon: Star,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    category: "milestone",
    reward: 500
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Share on 5 different platforms",
    icon: Share2,
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    category: "social",
    reward: 750
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 7-day sharing streak",
    icon: Flame,
    unlocked: false,
    progress: 4,
    maxProgress: 7,
    category: "consistency",
    reward: 1000
  },
  {
    id: "top-performer",
    title: "Top Performer",
    description: "Achieve 80% conversion rate",
    icon: Trophy,
    unlocked: true,
    progress: 68.5,
    maxProgress: 80,
    category: "performance",
    reward: 1500
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Share before 9 AM for 5 days",
    icon: Clock,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    category: "timing",
    reward: 600
  },
  {
    id: "viral-champion",
    title: "Viral Champion",
    description: "Get 50 successful referrals",
    icon: Rocket,
    unlocked: false,
    progress: 24,
    maxProgress: 50,
    category: "milestone",
    reward: 5000
  }
];

const mockSocialChannels: SocialChannel[] = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-white",
    description: "Share with friends and family",
    enabled: true,
    clicks: 156,
    conversions: 18
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-white",
    description: "Share to your story or DM",
    enabled: true,
    clicks: 89,
    conversions: 12
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "text-white",
    description: "Post or share with friends",
    enabled: true,
    clicks: 67,
    conversions: 8
  },
  {
    name: "Twitter",
    icon: Twitter,
    color: "text-white/60",
    description: "Tweet your referral",
    enabled: false,
    clicks: 34,
    conversions: 4
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-white/60",
    description: "Share professionally",
    enabled: false,
    clicks: 23,
    conversions: 3
  },
  {
    name: "SMS",
    icon: Phone,
    color: "text-white",
    description: "Send via text message",
    enabled: true,
    clicks: 112,
    conversions: 15
  }
];

const mockReferralChallenges: ReferralChallenge[] = [
  {
    id: "weekend-warrior",
    title: "Weekend Warrior",
    description: "Get 3 referrals this weekend",
    target: 3,
    progress: 1,
    reward: 2000,
    deadline: "2025-09-30",
    active: true,
    category: "time-limited"
  },
  {
    id: "social-master",
    title: "Social Media Master",
    description: "Share on all platforms this week",
    target: 6,
    progress: 4,
    reward: 1500,
    deadline: "2025-10-05",
    active: true,
    category: "engagement"
  },
  {
    id: "conversion-king",
    title: "Conversion Champion",
    description: "Achieve 90% conversion rate",
    target: 90,
    progress: 68.5,
    reward: 3000,
    deadline: "2025-10-15",
    active: true,
    category: "performance"
  }
];

// Utility functions
const formatINR = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Exact BrandHeader component from login page
function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex flex-col items-center space-y-6 mb-8">
      {/* Logo */}
      <div className="relative">
        <div className="w-20 h-20 border-2 border-white rounded-none flex items-center justify-center">
          <Hexagon className="h-10 w-10 text-white stroke-2" />
        </div>
      </div>
      
      {/* Brand Name */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-wider">
          Super Pay
        </h1>
        <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
          {subtitle || "Next-Gen Finance"}
        </p>
      </div>
    </div>
  );
}

export default function Referral() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Enhanced state management
  const [selectedTab, setSelectedTab] = useUrlTab("dashboard");
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [analyticsView, setAnalyticsView] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Data fetching with mock fallbacks
  const { 
    data: referralProgram, 
    isLoading: programLoading, 
    error: programError 
  } = useQuery<ReferralProgram>({
    queryKey: ['/api/referral/program'],
    enabled: isAuthenticated,
  });

  const { 
    data: referralTransactions = [], 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useQuery<ReferralTransaction[]>({
    queryKey: ['/api/referral/transactions'],
    enabled: isAuthenticated,
  });

  // Mock data fallbacks
  const mockReferralProgram = {
    id: '1',
    userId: user?.id || '1',
    referralCode: 'SUPERPAY2024',
    totalReferrals: 24,
    successfulReferrals: 18,
    referralTier: 'silver',
    totalBonus: 13500,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-09-29T00:00:00Z'
  };

  const mockReferralTransactions = [
    {
      id: '1',
      userId: '1',
      referralCode: 'SUPERPAY2024',
      bonusAmount: '750',
      status: 'completed' as const,
      createdAt: '2024-09-25T00:00:00Z',
      updatedAt: '2024-09-25T00:00:00Z'
    },
    {
      id: '2', 
      userId: '1',
      referralCode: 'SUPERPAY2024',
      bonusAmount: '500',
      status: 'pending' as const,
      createdAt: '2024-09-28T00:00:00Z',
      updatedAt: '2024-09-28T00:00:00Z'
    }
  ];

  // Use actual data or fallback to mock data
  const activeReferralProgram = referralProgram || mockReferralProgram;
  const activeReferralTransactions = referralTransactions.length > 0 ? referralTransactions : mockReferralTransactions;

  // Memoized calculations
  const calculatedStats = useMemo(() => {
    const totalReferrals = activeReferralProgram?.totalReferrals || 0;
    const successfulReferrals = activeReferralProgram?.successfulReferrals || 0;
    const pendingReferrals = totalReferrals - successfulReferrals;
    const totalEarnings = activeReferralTransactions.reduce((sum, t) => sum + parseFloat(t.bonusAmount || '0'), 0);
    const successRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0;
    
    return {
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      totalEarnings,
      successRate
    };
  }, [activeReferralProgram, activeReferralTransactions]);

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return { 
          name: 'BRONZE', 
          color: 'text-white', 
          bgColor: 'bg-white/10', 
          borderColor: 'border-white/20',
          icon: Award,
          reward: '500 pts',
          nextTier: 'Silver (5 referrals)'
        };
      case 'silver':
        return { 
          name: 'SILVER', 
          color: 'text-white', 
          bgColor: 'bg-white/10', 
          borderColor: 'border-white/20',
          icon: Star,
          reward: '750 pts',
          nextTier: 'Gold (15 referrals)'
        };
      case 'gold':
        return { 
          name: 'GOLD', 
          color: 'text-white', 
          bgColor: 'bg-white/10', 
          borderColor: 'border-white/20',
          icon: Trophy,
          reward: '1000 pts',
          nextTier: 'Platinum (30 referrals)'
        };
      case 'platinum':
        return { 
          name: 'PLATINUM', 
          color: 'text-white', 
          bgColor: 'bg-white/10', 
          borderColor: 'border-white/20',
          icon: Crown,
          reward: '1500 pts',
          nextTier: 'Max tier achieved!'
        };
      default:
        return { 
          name: 'BRONZE', 
          color: 'text-white', 
          bgColor: 'bg-white/10', 
          borderColor: 'border-white/20',
          icon: Award,
          reward: '500 pts',
          nextTier: 'Silver (5 referrals)'
        };
    }
  };

  const tierInfo = getTierInfo(activeReferralProgram?.referralTier || 'silver');
  const TierIcon = tierInfo.icon;

  const handleCopyCode = async () => {
    if (activeReferralProgram?.referralCode) {
      try {
        await navigator.clipboard.writeText(activeReferralProgram.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Referral Code Copied",
          description: "Your referral code has been copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Unable to copy referral code. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async (method: string) => {
    const referralUrl = `${window.location.origin}/register?ref=${activeReferralProgram?.referralCode}`;
    const shareText = `Join me on Super Pay! Use my referral code: ${activeReferralProgram?.referralCode} to get exclusive rewards. ${referralUrl}`;
    
    try {
      switch (method) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'sms':
          window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'email':
          window.open(`mailto:?subject=Join me on Super Pay&body=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'Join Super Pay',
              text: shareText,
              url: referralUrl
            });
          } else {
            await navigator.clipboard.writeText(shareText);
            toast({
              title: "Link Copied",
              description: "Referral link copied to clipboard",
            });
          }
          break;
      }
      
      toast({
        title: "Shared Successfully",
        description: `Referral shared via ${method}`,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share referral. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Loading Component
  const LoadingSection = ({ height = "h-32" }: { height?: string }) => (
    <div className={`border border-white/20 p-6 flex items-center justify-center ${height} rounded-none`} data-testid="loading-section">
      <LoadingLogo size="md" />
    </div>
  );

  // Error Component  
  const ErrorSection = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
    <div className="border border-white/20 p-6 text-center rounded-none" data-testid="error-section">
      <AlertCircle className="h-12 w-12 text-white mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2" data-testid="text-error-title">Error Loading Data</h3>
      <p className="text-white/60 mb-6" data-testid="text-error-message">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-white text-black hover:bg-white/90 font-medium rounded-none"
          data-testid="button-retry-error"
          aria-label="Retry loading data"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          TRY AGAIN
        </Button>
      )}
    </div>
  );

  if (programLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center" data-testid="page-loading">
        <div className="text-center">
          <LoadingLogo size="lg" className="mb-4" />
          <p className="text-white/60">Loading referral program...</p>
        </div>
      </div>
    );
  }

  if (programError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6" data-testid="page-error">
        <ErrorSection 
          message="We couldn't load your referral information. Please check your connection and try again." 
          onRetry={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/referral/program'] });
            queryClient.invalidateQueries({ queryKey: ['/api/referral/transactions'] });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20" data-testid="page-referral">
      {/* Exact Login Page BrandHeader */}
      <GlassmorphicCard className="w-full p-8 text-center rounded-none">
        <BrandHeader subtitle="Referral Program" />
      </GlassmorphicCard>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8 px-6">
        <GlassmorphicCard className="p-4 text-center rounded-none">
          <CircleDollarSign className="h-6 w-6 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white" data-testid="text-total-earned">
            {formatINR(calculatedStats.totalEarnings)}
          </p>
          <p className="text-white/60 text-xs">Total Earned</p>
        </GlassmorphicCard>
        
        <GlassmorphicCard className="p-4 text-center rounded-none">
          <Users className="h-6 w-6 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white" data-testid="text-successful-referrals">
            {calculatedStats.successfulReferrals}
          </p>
          <p className="text-white/60 text-xs">Successful</p>
        </GlassmorphicCard>
        
        <GlassmorphicCard className="p-4 text-center rounded-none">
          <TrendingUp className="h-6 w-6 text-white mx-auto mb-2" />
          <p className="text-2xl font-bold text-white" data-testid="text-conversion-rate">
            {mockReferralAnalytics.conversionRate}%
          </p>
          <p className="text-white/60 text-xs">Success Rate</p>
        </GlassmorphicCard>
      </div>

      {/* Current Tier Status */}
      <GlassmorphicCard className="mx-6 mb-8 p-6 rounded-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-white/20 rounded-none">
              <TierIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-white">{tierInfo.name}</p>
              <p className="text-white/60 text-sm">{tierInfo.reward} per referral</p>
            </div>
          </div>
          <Badge className="border border-white/20 bg-white/10 text-white rounded-none">
            Level {tierInfo.name === 'BRONZE' ? '1' : tierInfo.name === 'SILVER' ? '2' : tierInfo.name === 'GOLD' ? '3' : '4'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Progress to {tierInfo.nextTier.split('(')[0]}</span>
            <span className="text-white/80">{calculatedStats.successfulReferrals}/25</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-none">
            <div 
              className="h-2 bg-white rounded-none transition-all duration-500"
              style={{ width: `${Math.min((calculatedStats.successfulReferrals / 25) * 100, 100)}%` }}
            />
          </div>
        </div>
      </GlassmorphicCard>

      {/* Main Content */}
      <div className="px-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20 rounded-none p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Dashboard</TabsTrigger>
            <TabsTrigger value="share" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Share</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Rewards</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Referral Code Section */}
            <GlassmorphicCard className="p-6 text-center rounded-none" data-testid="section-referral-code">
              <h2 className="text-2xl font-bold text-white mb-4" data-testid="heading-your-code">
                YOUR REFERRAL CODE
              </h2>
              
              <div className="border border-white/20 rounded-none p-6 mb-6">
                <p className="text-4xl font-bold text-white tracking-wider mb-2 font-mono" data-testid="text-referral-code">
                  {activeReferralProgram?.referralCode || 'SUPERPAY2024'}
                </p>
                <p className="text-white/60 text-sm">Share this code to earn rewards</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleCopyCode}
                  className="bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-copy-code"
                  aria-label="Copy referral code"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'COPIED!' : 'COPY CODE'}
                </Button>
                
                <Button 
                  onClick={() => handleShare('native')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-none"
                  data-testid="button-share"
                  aria-label="Share referral code"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  SHARE
                </Button>
              </div>
            </GlassmorphicCard>

            {/* Recent Activity */}
            <GlassmorphicCard className="p-6 rounded-none">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Referrals
              </h3>
              
              {activeReferralTransactions.length > 0 ? (
                <div className="space-y-3">
                  {activeReferralTransactions.slice(0, 3).map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 border border-white/20 rounded-none"
                      data-testid={`transaction-${transaction.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-white/20 rounded-none flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium" data-testid={`text-transaction-code-${transaction.id}`}>
                            Referral: {transaction.referralCode}
                          </p>
                          <p className="text-white/60 text-sm" data-testid={`text-transaction-date-${transaction.id}`}>
                            {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold" data-testid={`text-transaction-points-${transaction.id}`}>
                          +{formatINR(parseFloat(transaction.bonusAmount || '0'))}
                        </p>
                        <Badge className={cn(
                          "text-xs rounded-none border",
                          transaction.status === 'completed' 
                            ? 'border-white/40 bg-white/10 text-white' 
                            : 'border-white/20 bg-white/5 text-white/60'
                        )} data-testid={`badge-transaction-status-${transaction.id}`}>
                          {transaction.status === 'completed' ? 'COMPLETED' : 'PENDING'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-white/20 rounded-none" data-testid="empty-state-no-activity">
                  <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Referrals Yet</h4>
                  <p className="text-white/60 mb-4">Start sharing your code to see activity here</p>
                  <Button 
                    onClick={() => setSelectedTab('share')}
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                  >
                    START SHARING
                  </Button>
                </div>
              )}
            </GlassmorphicCard>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share" className="space-y-6 mt-6">
            {/* Share Options */}
            <GlassmorphicCard className="p-6 rounded-none">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Your Code
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {mockSocialChannels.map((channel, index) => {
                  const IconComponent = channel.icon;
                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "p-4 border border-white/20 rounded-none transition-all",
                        channel.enabled ? "cursor-pointer hover:border-white/40" : "opacity-50"
                      )}
                      onClick={() => channel.enabled && handleShare(channel.name.toLowerCase())}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className={cn("h-6 w-6", channel.color)} />
                          <div>
                            <h4 className="text-white font-semibold">{channel.name}</h4>
                            <p className="text-white/60 text-sm">{channel.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{channel.conversions}</p>
                          <p className="text-white/60 text-xs">conversions</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 border border-white/20 rounded-none">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Smart Sharing Tip
                </h4>
                <p className="text-white/60 text-sm">
                  🎯 Your best performing channel is {mockReferralAnalytics.topPerformingChannel}. 
                  Share during {mockReferralAnalytics.optimalSharingTime} for maximum engagement!
                </p>
              </div>
            </GlassmorphicCard>

            {/* QR Code Section */}
            <GlassmorphicCard className="p-6 text-center rounded-none">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code
              </h3>
              
              <div className="w-40 h-40 border border-white/20 rounded-none mx-auto mb-4 flex items-center justify-center">
                <QrCode className="h-20 w-20 text-white/60" />
              </div>
              
              <p className="text-white/60 text-sm mb-4">
                Let others scan this code to get your referral link
              </p>
              
              <Button 
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-download-qr"
              >
                <Download className="h-4 w-4 mr-2" />
                DOWNLOAD QR
              </Button>
            </GlassmorphicCard>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6 mt-6">
            {/* Active Challenges */}
            <GlassmorphicCard className="p-6 rounded-none">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Active Challenges
              </h3>
              
              <div className="space-y-4">
                {mockReferralChallenges.filter(c => c.active).map((challenge, index) => {
                  const progressPercentage = (challenge.progress / challenge.target) * 100;
                  
                  return (
                    <div key={index} className="p-4 border border-white/20 rounded-none">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-bold">{challenge.title}</h4>
                          <p className="text-white/60 text-sm">{challenge.description}</p>
                        </div>
                        <Badge className="border border-white/20 bg-white/10 text-white rounded-none">
                          {formatINR(challenge.reward)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white/60">{challenge.progress}/{challenge.target}</span>
                        </div>
                        <div className="w-full bg-white/20 h-2 rounded-none">
                          <div 
                            className="h-2 bg-white rounded-none transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white">{progressPercentage.toFixed(1)}% complete</span>
                          <span className="text-white/50">Ends: {new Date(challenge.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassmorphicCard>

            {/* Achievements */}
            <GlassmorphicCard className="p-6 rounded-none">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Achievements
              </h3>
              
              <div className="grid gap-4">
                {mockAchievements.map((achievement, index) => {
                  const AchievementIcon = achievement.icon;
                  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
                  
                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "p-4 border rounded-none",
                        achievement.unlocked 
                          ? 'border-white/40 bg-white/5' 
                          : 'border-white/20'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 border rounded-none",
                          achievement.unlocked 
                            ? 'border-white/40 bg-white/10' 
                            : 'border-white/20'
                        )}>
                          <AchievementIcon className={cn(
                            "h-6 w-6",
                            achievement.unlocked 
                              ? 'text-white' 
                              : 'text-white/40'
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-bold">{achievement.title}</h4>
                            {achievement.unlocked && (
                              <Badge className="border border-white/20 bg-white/10 text-white text-xs rounded-none">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Unlocked
                              </Badge>
                            )}
                          </div>
                          <p className="text-white/60 text-sm mb-2">{achievement.description}</p>
                          
                          {!achievement.unlocked && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Progress</span>
                                <span className="text-white/60">{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <div className="w-full bg-white/20 h-2 rounded-none">
                                <div 
                                  className="h-2 bg-white rounded-none transition-all duration-500"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <Badge className="border border-white/20 bg-white/10 text-white/60 text-xs rounded-none">
                              {achievement.category}
                            </Badge>
                            <span className="text-white font-semibold text-sm">+{formatINR(achievement.reward)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassmorphicCard>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassmorphicCard className="p-6 rounded-none">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Performance Trends
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Weekly Growth Rate</span>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-4 w-4 text-white" />
                      <span className="text-white font-bold">{mockReferralAnalytics.weeklyGrowthRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Conversion Rate</span>
                    <span className="text-white font-bold">{mockReferralAnalytics.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Social Engagement</span>
                    <span className="text-white font-bold">{mockReferralAnalytics.socialEngagementScore}/10</span>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6 rounded-none">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Earnings Forecast
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Monthly Projection</span>
                    <span className="text-white font-bold">{formatINR(mockReferralAnalytics.monthlyProjection)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Avg per Referral</span>
                    <span className="text-white font-bold">{formatINR(mockReferralAnalytics.averageEarningsPerReferral)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Potential This Week</span>
                    <span className="text-white font-bold">{formatINR(Math.round(mockReferralAnalytics.monthlyProjection / 4))}</span>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>

            {/* Referral Funnel Analytics */}
            <GlassmorphicCard className="p-6 rounded-none">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Referral Funnel Performance
              </h4>
              
              <div className="space-y-4">
                {mockReferralAnalytics.referralFunnelData.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-white font-bold">{stage.count}</span>
                        <span className="text-white/60 text-sm ml-2">({stage.conversionRate}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-none">
                      <div 
                        className="h-2 bg-white rounded-none transition-all duration-500"
                        style={{ width: `${stage.conversionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>

            {/* Channel Performance */}
            <GlassmorphicCard className="p-6 rounded-none">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Channel Performance
              </h4>
              
              <div className="space-y-3">
                {mockSocialChannels.map((channel, index) => {
                  const IconComponent = channel.icon;
                  const conversionRate = channel.clicks > 0 ? (channel.conversions / channel.clicks * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border border-white/20 rounded-none">
                      <div className="flex items-center gap-3">
                        <IconComponent className={cn("h-5 w-5", channel.color)} />
                        <span className="text-white font-medium">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{channel.conversions} conversions</p>
                        <p className="text-white/60 text-sm">{conversionRate}% rate</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassmorphicCard>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}