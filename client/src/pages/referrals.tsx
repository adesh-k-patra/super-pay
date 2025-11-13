import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Users,
  Share2,
  Copy,
  Gift,
  TrendingUp,
  Crown,
  Star,
  DollarSign,
  Calendar,
  Award,
  Sparkles,
  Send,
  MessageCircle,
  Mail,
  Download,
  CheckCircle,
  Clock,
  Plus,
  Info
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface Referral {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinDate: string;
  status: 'pending' | 'verified' | 'active';
  rewardEarned: number;
  level: number;
  totalSpent: number;
  avatar?: string;
}

interface ReferralReward {
  id: string;
  type: 'signup' | 'first_transaction' | 'milestone' | 'bonus';
  amount: number;
  description: string;
  earnedDate: string;
  referralId: string;
  status: 'pending' | 'credited';
}

export default function Referrals() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useUrlTab('overview');
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch referrals data
  const { data: referralsData, isLoading } = useQuery({
    queryKey: ['/api/referrals'],
    enabled: isAuthenticated,
  });

  // Mock referrals data
  const mockReferrals: Referral[] = [
    {
      id: "ref-1",
      name: "John Smith",
      email: "john@example.com",
      phoneNumber: "+91 98765 43210",
      joinDate: "2024-12-15",
      status: "active",
      rewardEarned: 500,
      level: 2,
      totalSpent: 25000,
      avatar: "👨‍💼"
    },
    {
      id: "ref-2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phoneNumber: "+91 87654 32109",
      joinDate: "2024-12-20",
      status: "verified",
      rewardEarned: 250,
      level: 1,
      totalSpent: 8000,
      avatar: "👩‍💻"
    },
    {
      id: "ref-3",
      name: "Mike Wilson",
      email: "mike@example.com",
      phoneNumber: "+91 76543 21098",
      joinDate: "2024-12-28",
      status: "pending",
      rewardEarned: 0,
      level: 0,
      totalSpent: 0,
      avatar: "👨‍🎓"
    }
  ];

  const mockRewards: ReferralReward[] = [
    {
      id: "rew-1",
      type: "first_transaction",
      amount: 500,
      description: "John Smith completed first investment",
      earnedDate: "2024-12-20",
      referralId: "ref-1",
      status: "credited"
    },
    {
      id: "rew-2",
      type: "signup",
      amount: 250,
      description: "Sarah Johnson signed up successfully",
      earnedDate: "2024-12-21",
      referralId: "ref-2",
      status: "credited"
    },
    {
      id: "rew-3",
      type: "signup",
      amount: 250,
      description: "Mike Wilson signed up",
      earnedDate: "2024-12-28",
      referralId: "ref-3",
      status: "pending"
    }
  ];

  const referrals = (referralsData as any)?.referrals || mockReferrals;
  const rewards = (referralsData as any)?.rewards || mockRewards;

  const paginationReferrals = usePagination({
    data: referrals,
    itemsPerPage: 20,
  });

  const paginationRewards = usePagination({
    data: rewards,
    itemsPerPage: 20,
  });

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-none animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your referrals...</p>
        </div>
      </div>
    );
  }

  const totalEarnings = rewards.filter((r: ReferralReward) => r.status === 'credited').reduce((sum: number, r: ReferralReward) => sum + r.amount, 0);
  const pendingEarnings = rewards.filter((r: ReferralReward) => r.status === 'pending').reduce((sum: number, r: ReferralReward) => sum + r.amount, 0);
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r: Referral) => r.status === 'active').length;

  const referralCode = "KCREDIT2024USER";
  const referralLink = `https://kcredit.app/join/${referralCode}`;

  const shareReferral = (method: string) => {
    const message = `Join KCredit using my referral code ${referralCode} and get ₹250 bonus! Download: ${referralLink}`;
    
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Join KCredit&body=${encodeURIComponent(message)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(message);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/investment")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">My Referrals</h1>
              <p className="text-sm text-white/60">Invite friends & earn rewards</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/referrals/info")}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-referrals-info"
          >
            <Info className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => setShowShareModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-4 pb-4">
          <div className="flex bg-white/5 rounded-none p-1">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('overview')}
              data-testid="tab-overview"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'friends' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('friends')}
              data-testid="tab-friends"
            >
              Friends ({totalReferrals})
            </Button>
            <Button
              variant={activeTab === 'rewards' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('rewards')}
              data-testid="tab-rewards"
            >
              Rewards ({rewards.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-40 p-4 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Earnings Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-white/10 to-white/5 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs text-green-100">Total Earned</span>
                  </div>
                  <p className="text-lg font-bold">₹{totalEarnings.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs text-orange-100">Pending</span>
                  </div>
                  <p className="text-lg font-bold">₹{pendingEarnings.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-xs text-blue-100">Friends</span>
                  </div>
                  <p className="text-lg font-bold">{totalReferrals}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs text-purple-100">Active</span>
                  </div>
                  <p className="text-lg font-bold">{activeReferrals}</p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Code */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-none border border-purple-200 dark:border-purple-800">
                  <div className="flex-1">
                    <p className="text-sm text-white/60 mb-1">Your referral code</p>
                    <p className="text-2xl font-bold text-purple-600 font-mono">{referralCode}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('copy')}
                    data-testid="button-copy-code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('whatsapp')}
                    className="h-auto py-3 flex flex-col gap-1"
                    data-testid="button-share-whatsapp"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('sms')}
                    className="h-auto py-3 flex flex-col gap-1"
                    data-testid="button-share-sms"
                  >
                    <Send className="h-4 w-4 text-white/80" />
                    <span className="text-xs">SMS</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('email')}
                    className="h-auto py-3 flex flex-col gap-1"
                    data-testid="button-share-email"
                  >
                    <Mail className="h-4 w-4 text-red-600" />
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReferral('copy')}
                    className="h-auto py-3 flex flex-col gap-1"
                    data-testid="button-copy-link"
                  >
                    <Copy className="h-4 w-4 text-purple-600" />
                    <span className="text-xs">Copy</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none">
              <CardHeader>
                <CardTitle className="text-lg">How Referrals Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5/30 rounded-none">
                    <div className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center mx-auto mb-3">
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Share</h3>
                    <p className="text-sm text-white/60">Share your referral code with friends</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5/30 rounded-none">
                    <div className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Join</h3>
                    <p className="text-sm text-white/60">Friends sign up using your code</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5/30 rounded-none">
                    <div className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center mx-auto mb-3">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Earn</h3>
                    <p className="text-sm text-white/60">Get rewards for each successful referral</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-none border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-white/80 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Reward Structure</h4>
                      <ul className="text-sm text-yellow-700 dark:text-white/70 space-y-1">
                        <li>• ₹250 when friend signs up</li>
                        <li>• ₹500 when friend makes first investment</li>
                        <li>• ₹1000 bonus for every 5 active referrals</li>
                        <li>• Special rewards for top referrers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-4">
            {referrals.length === 0 ? (
              <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-white/60/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No referrals yet</h3>
                  <p className="text-white/60 mb-4">Start inviting friends to earn rewards</p>
                  <Button onClick={() => setShowShareModal(true)} data-testid="button-invite-friends">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Friends
                  </Button>
                </CardContent>
              </Card>
            ) : (
              (paginationReferrals.paginatedData as Referral[]).map((referral) => (
                <Card key={referral.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-none flex items-center justify-center text-white text-lg">
                          {referral.avatar || referral.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{referral.name}</h3>
                            <Badge 
                              variant={
                                referral.status === 'active' ? 'secondary' :
                                referral.status === 'verified' ? 'default' : 'outline'
                              }
                              className="text-xs"
                            >
                              {referral.status}
                            </Badge>
                            {referral.level > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Level {referral.level}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-white/60">{referral.email}</p>
                          <p className="text-xs text-white/60">
                            Joined: {new Date(referral.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ₹{referral.rewardEarned.toLocaleString()}
                        </p>
                        <p className="text-xs text-white/60">
                          Spent: ₹{referral.totalSpent.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {referrals.length > 0 && (
              <PaginationControls
                currentPage={paginationReferrals.currentPage}
                totalPages={paginationReferrals.totalPages}
                onPageChange={paginationReferrals.goToPage}
                canGoNext={paginationReferrals.canGoNext}
                canGoPrevious={paginationReferrals.canGoPrevious}
                startIndex={paginationReferrals.startIndex}
                endIndex={paginationReferrals.endIndex}
                totalItems={paginationReferrals.totalItems}
                className="mt-6"
              />
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-4">
            {rewards.length === 0 ? (
              <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none">
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-white/60/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No rewards yet</h3>
                  <p className="text-white/60">Invite friends to start earning rewards</p>
                </CardContent>
              </Card>
            ) : (
              (paginationRewards.paginatedData as ReferralReward[]).map((reward) => (
                <Card key={reward.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-none flex items-center justify-center text-white",
                          reward.status === 'credited' ? "bg-white/10" : "bg-white/10"
                        )}>
                          {reward.status === 'credited' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white">{reward.description}</h3>
                            <Badge 
                              variant={reward.status === 'credited' ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              {reward.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60">
                            {new Date(reward.earnedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          "text-lg font-bold",
                          reward.status === 'credited' ? "text-green-600" : "text-orange-600"
                        )}>
                          +₹{reward.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {rewards.length > 0 && (
              <PaginationControls
                currentPage={paginationRewards.currentPage}
                totalPages={paginationRewards.totalPages}
                onPageChange={paginationRewards.goToPage}
                canGoNext={paginationRewards.canGoNext}
                canGoPrevious={paginationRewards.canGoPrevious}
                startIndex={paginationRewards.startIndex}
                endIndex={paginationRewards.endIndex}
                totalItems={paginationRewards.totalItems}
                className="mt-6"
              />
            )}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}