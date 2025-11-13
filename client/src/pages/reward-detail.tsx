import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Star, 
  Gift, 
  CheckCircle,
  Clock,
  Award,
  Coins,
  Zap,
  ShoppingBag,
  Crown,
  TrendingUp,
  Users,
  Share2,
  RefreshCw,
  AlertCircle,
  Trophy,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  MapPin,
  Phone,
  Building2,
  Info,
  ChevronRight,
  Hexagon,
  Target
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RewardDetail {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
  value: number;
  validUntil: string;
  terms: string[];
  eligibilityRequirements: {
    minTransactions?: number;
    minSpending?: number;
    tierLevel?: string;
    specialConditions?: string[];
  };
  redemptionHistory?: {
    date: string;
    status: 'completed' | 'pending' | 'expired';
    transactionId?: string;
  }[];
  isRedeemed: boolean;
  isEligible: boolean;
  merchant?: {
    name: string;
    logo: string;
    category: string;
    rating: number;
    outlets: number;
    website?: string;
    phone?: string;
    address?: string;
  };
  redemptionOptions?: {
    type: 'voucher' | 'cashback' | 'gift_card' | 'direct_discount';
    methods: string[];
    deliveryTime: string;
    expiryDays: number;
  };
  analytics?: {
    popularityScore: number;
    redemptionRate: number;
    userSatisfaction: number;
    trendingRank?: number;
  };
}

// Hero Header Component
function RewardHeader({ reward, onBack, onShare }: { 
  reward: RewardDetail, 
  onBack: () => void, 
  onShare: () => void 
}) {
  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-white/10 to-white/5';
      case 'rare': return 'from-white/10 to-white/5';
      case 'epic': return 'from-purple-600 to-purple-800';
      case 'legendary': return 'from-yellow-600 to-yellow-800';
      default: return 'from-white/10 to-white/5';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shopping': return ShoppingBag;
      case 'cashback': return Coins;
      case 'premium': return Crown;
      case 'food': return Gift;
      default: return Award;
    }
  };

  const CategoryIcon = getCategoryIcon(reward.category);

  return (
    <div className={cn(
      "relative px-6 pt-12 pb-8 text-white overflow-hidden",
      `bg-gradient-to-br ${getRarityGradient(reward.rarity)}`
    )}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-none -translate-x-48 -translate-y-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-none translate-x-36 translate-y-36 blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              onClick={onShare}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="flex items-start gap-6">
          {/* Reward Icon */}
          <div className="w-20 h-20 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/10">
            <CategoryIcon className="h-10 w-10 text-white" />
          </div>
          
          {/* Reward Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white tracking-wider" data-testid="text-reward-title">
                {reward.title}
              </h1>
              {reward.analytics?.trendingRank && reward.analytics.trendingRank <= 5 && (
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  #{reward.analytics.trendingRank}
                </Badge>
              )}
            </div>
            <p className="text-white/80 text-lg mb-4 leading-relaxed">
              {reward.description}
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">₹{reward.value.toLocaleString()}</p>
                <p className="text-white/60 text-sm">Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{reward.pointsRequired.toLocaleString()}</p>
                <p className="text-white/60 text-sm">Points Required</p>
              </div>
              <div className="text-center">
                <Badge className={cn(
                  "text-sm font-medium px-3 py-1",
                  reward.rarity === 'legendary' ? "bg-white/10 text-white/70 border-white/20" :
                  reward.rarity === 'epic' ? "bg-white/10 text-purple-300 border-white/20" :
                  reward.rarity === 'rare' ? "bg-white/10 text-white/70 border-white/20" :
                  "bg-white/10/20 text-gray-300 border-gray-500/30"
                )}>
                  {reward.rarity.toUpperCase()}
                </Badge>
                <p className="text-white/60 text-sm mt-1">Rarity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Redemption Section Component
function RedemptionSection({ reward, userPoints }: { reward: RewardDetail, userPoints: number }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const redeemMutation = useMutation({
    mutationFn: (method: string) => apiRequest(`/api/rewards/${reward.id}/redeem`, 'POST', { method }),
    onSuccess: () => {
      toast({
        title: "Reward Redeemed Successfully!",
        description: "Your reward will be processed within 24 hours. Check your email for confirmation.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/rewards/${reward.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/loyalty-coins'] });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Unable to redeem reward. Please try again.",
        variant: "destructive"
      });
    }
  });

  const progressPercentage = Math.min((userPoints / reward.pointsRequired) * 100, 100);
  const remainingPoints = Math.max(reward.pointsRequired - userPoints, 0);
  const canRedeem = userPoints >= reward.pointsRequired && reward.isEligible && !reward.isRedeemed;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Card className="border-white/10 backdrop-blur-sm bg-white/5/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Target className="h-6 w-6 text-primary" />
            Redemption Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">Your Progress</span>
              <span className="text-sm font-bold text-white">
                {progressPercentage.toFixed(0)}% Complete
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3" 
              data-testid="progress-redemption"
            />
            {remainingPoints > 0 && (
              <p className="text-sm text-white/60 text-center">
                {remainingPoints.toLocaleString()} more points needed to redeem
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            {reward.isRedeemed ? (
              <div className="text-center p-6 bg-white/5 border border-white/20 rounded-none">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-white/80" />
                <h3 className="text-lg font-semibold text-white/80">Already Redeemed</h3>
                <p className="text-sm text-white/80 mt-1">Check your email for voucher details</p>
              </div>
            ) : (
              <Button
                onClick={() => redeemMutation.mutate('points')}
                disabled={!canRedeem || redeemMutation.isPending}
                className={cn(
                  "w-full h-14 text-lg font-semibold transition-all",
                  canRedeem 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-white/5 text-white/60 cursor-not-allowed"
                )}
                data-testid="button-redeem"
              >
                {redeemMutation.isPending ? (
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Processing Redemption...
                  </div>
                ) : !reward.isEligible ? (
                  "Not Eligible"
                ) : remainingPoints > 0 ? (
                  `Need ${remainingPoints.toLocaleString()} More Points`
                ) : (
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Redeem Now
                  </div>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Details Grid Component
function DetailsGrid({ reward }: { reward: RewardDetail }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Merchant Information */}
        {reward.merchant && (
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                Merchant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-none flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{reward.merchant.name}</h3>
                  <p className="text-sm text-white/60">{reward.merchant.category}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-white/80 fill-current" />
                  <span className="font-medium">{reward.merchant.rating}</span>
                </div>
                <span className="text-sm text-white/60">
                  {reward.merchant.outlets}+ outlets
                </span>
              </div>
              
              {reward.merchant.website && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.open(reward.merchant!.website, '_blank')}
                  data-testid="button-visit-merchant"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Analytics */}
        {reward.analytics && (
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                Reward Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Popularity</span>
                  <span className="font-medium">{reward.analytics.popularityScore}/100</span>
                </div>
                <Progress value={reward.analytics.popularityScore} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Redemption Rate</span>
                  <span className="font-medium">{reward.analytics.redemptionRate}%</span>
                </div>
                <Progress value={reward.analytics.redemptionRate} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Satisfaction</span>
                  <span className="font-medium">{reward.analytics.userSatisfaction}/100</span>
                </div>
                <Progress value={reward.analytics.userSatisfaction} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terms & Conditions */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reward.terms.map((term, index) => (
                <li key={index} className="text-sm text-white/60 flex items-start gap-2">
                  <div className="w-1 h-1 bg-white/5-foreground rounded-none mt-2 flex-shrink-0"></div>
                  {term}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Eligibility Requirements */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reward.eligibilityRequirements.minTransactions && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Min Transactions</span>
                <span className="font-medium">{reward.eligibilityRequirements.minTransactions}</span>
              </div>
            )}
            {reward.eligibilityRequirements.minSpending && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Min Spending</span>
                <span className="font-medium">₹{reward.eligibilityRequirements.minSpending.toLocaleString()}</span>
              </div>
            )}
            {reward.eligibilityRequirements.tierLevel && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Tier Level</span>
                <Badge variant="secondary">{reward.eligibilityRequirements.tierLevel}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RewardDetail() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const rewardId = params.id;
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { data: reward, isLoading, error } = useQuery<RewardDetail>({
    queryKey: [`/api/rewards/${rewardId}`],
    enabled: !!rewardId
  });

  const { data: userPoints = 2450 } = useQuery<number>({
    queryKey: ['/api/loyalty-coins']
  });

  // Mock data fallback
  const mockReward: RewardDetail = {
    id: rewardId || "1",
    title: "Amazon Gift Voucher",
    description: "Premium shopping voucher for Amazon India with unlimited access to millions of products across electronics, fashion, books, and more.",
    pointsRequired: 2500,
    category: "shopping",
    rarity: 'epic',
    imageUrl: "/images/amazon-voucher.jpg",
    value: 500,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    terms: [
      "Valid for 12 months from date of issue",
      "Cannot be redeemed for cash value",
      "Not transferable to another account",
      "Valid only on Amazon.in platform",
      "Cannot be combined with other promotional codes"
    ],
    eligibilityRequirements: {
      minTransactions: 10,
      minSpending: 5000,
      tierLevel: "Silver",
      specialConditions: ["Account must be verified", "Minimum age 18 years"]
    },
    isRedeemed: false,
    isEligible: true,
    merchant: {
      name: "Amazon India",
      logo: "/images/amazon-logo.png",
      category: "E-commerce",
      rating: 4.5,
      outlets: 1000,
      website: "https://amazon.in",
      phone: "1800-419-7355",
      address: "Bangalore, Karnataka, India"
    },
    redemptionOptions: {
      type: 'voucher',
      methods: ['email', 'sms', 'app_notification'],
      deliveryTime: "Instant",
      expiryDays: 365
    },
    analytics: {
      popularityScore: 87,
      redemptionRate: 65,
      userSatisfaction: 92,
      trendingRank: 3
    }
  };

  const activeReward = (reward && Object.keys(reward).length > 0) ? reward : mockReward;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: activeReward.title,
          text: `Check out this amazing reward: ${activeReward.title} - Only ${activeReward.pointsRequired} points!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Link Copied",
          description: "Reward link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share reward. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-6 bg-white/5 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !activeReward) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Reward Not Found</h2>
          <p className="text-white/60 mb-6">
            This reward might have been removed or is temporarily unavailable.
          </p>
          <Button
            onClick={() => navigate('/rewards')}
            className="gap-2"
            data-testid="button-back-to-rewards"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Rewards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Header */}
      <RewardHeader 
        reward={activeReward}
        onBack={() => navigate('/rewards')}
        onShare={handleShare}
      />
      
      {/* Redemption Section */}
      <RedemptionSection 
        reward={activeReward}
        userPoints={userPoints}
      />
      
      {/* Details Grid */}
      <DetailsGrid reward={activeReward} />
    </div>
  );
}