import { useState } from "react";
import { useLocation } from "wouter";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { ArrowLeft, Gift, IndianRupee, Star, Trophy, Target, Zap, Wallet, CreditCard, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type UpiTransaction, type UpiReward } from "@shared/schema";

interface RewardsStats {
  totalCashback: number;
  totalPoints: number;
  totalTransactions: number;
  totalRewards: number;
  availableOffers: number;
  thisMonthCashback: number;
}

interface UpiOffer {
  id: string;
  title: string;
  description: string;
  type: "cashback" | "points" | "discount";
  value: string;
  minAmount: number;
  validUntil: Date;
  category: string;
  isActive: boolean;
  terms?: string;
  maxCashback?: number;
}

export default function UpiRewards() {
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("rewards");

  // Fetch UPI rewards data
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<UpiTransaction[]>({
    queryKey: ['/api/upi/transactions']
  });

  const { data: rewards = [], isLoading: rewardsLoading } = useQuery<UpiReward[]>({
    queryKey: ['/api/upi/rewards']
  });

  // Fetch available UPI offers
  const { data: offers = [], isLoading: offersLoading } = useQuery<UpiOffer[]>({
    queryKey: ['/api/upi/offers'],
    select: (data: any) => data || []
  });

  // Calculate rewards statistics
  const calculateStats = (): RewardsStats => {
    const totalCashback = transactions.reduce((sum, t) => 
      sum + parseFloat(t.cashbackEarned || '0'), 0
    );
    const totalPoints = transactions.reduce((sum, t) => sum + (t.pointsEarned || 0), 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthCashback = transactions
      .filter(t => new Date(t.createdAt || '') >= thisMonth)
      .reduce((sum, t) => sum + parseFloat(t.cashbackEarned || '0'), 0);

    return {
      totalCashback,
      totalPoints,
      totalTransactions: transactions.length,
      totalRewards: rewards.length,
      availableOffers: offers.filter(o => o.isActive).length,
      thisMonthCashback
    };
  };

  const stats = calculateStats();

  // Fallback offers if API doesn't return any
  const fallbackOffers: UpiOffer[] = offers.length === 0 ? [
    {
      id: "default-1",
      title: "Welcome Bonus",
      description: "Get started with UPI payments",
      type: "cashback",
      value: "1%",
      minAmount: 100,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: "All",
      isActive: true
    }
  ] : offers;

  const pagination = usePagination({
    data: fallbackOffers,
    itemsPerPage: 20,
  });

  const getOfferIcon = (type: string) => {
    switch (type) {
      case "cashback": return <IndianRupee className="h-4 w-4" />;
      case "points": return <Star className="h-4 w-4" />;
      case "discount": return <Target className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getOfferColor = (type: string) => {
    switch (type) {
      case "cashback": return "bg-white/10";
      case "points": return "bg-white/10";
      case "discount": return "bg-white/10";
      default: return "bg-slate-500";
    }
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-black text-white pb-20 lg:pb-4">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back-upi-rewards"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base uppercase tracking-widest font-light">UPI REWARDS</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Cashback & offers</p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
          {/* Stats Overview */}
          <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">

              <Gift className="h-6 w-6 text-white/60" />
              <h2 className="text-lg font-semibold text-white">REWARDS SUMMARY</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Total Cashback */}
              <div className="bg-black/20 border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center bg-white/5">
                    <IndianRupee className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">₹{stats.totalCashback.toFixed(2)}</div>
                    <div className="text-white/60 text-xs">Total Cashback</div>
                  </div>
                </div>
              </div>

              {/* Total Points */}
              <div className="bg-black/20 border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center bg-white/5">
                    <Star className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{stats.totalPoints}</div>
                    <div className="text-white/60 text-xs">Points Earned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {/* This Month Cashback */}
              <div className="bg-black/20 border border-white/10 p-3">
                <div className="text-center">
                  <div className="w-6 h-6 border border-white/10 flex items-center justify-center mx-auto mb-2 bg-white/5">
                    <Wallet className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white">₹{stats.thisMonthCashback.toFixed(2)}</div>
                  <div className="text-white/60 text-xs">This Month</div>
                </div>
              </div>

              {/* Total Transactions */}
              <div className="bg-black/20 border border-white/10 p-3">
                <div className="text-center">
                  <div className="w-6 h-6 border border-white/10 flex items-center justify-center mx-auto mb-2 bg-white/5">
                    <CreditCard className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white">{stats.totalTransactions}</div>
                  <div className="text-white/60 text-xs">Transactions</div>
                </div>
              </div>

              {/* Available Offers */}
              <div className="bg-black/20 border border-white/10 p-3">
                <div className="text-center">
                  <div className="w-6 h-6 border border-white/10 flex items-center justify-center mx-auto mb-2 bg-white/5">
                    <Gift className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-sm font-bold text-white">{stats.availableOffers}</div>
                  <div className="text-white/60 text-xs">Offers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black border border-white/10 rounded-none p-1">
              <TabsTrigger value="rewards" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-rewards">
                <Trophy className="h-4 w-4 mr-2" />
                My Rewards
              </TabsTrigger>
              <TabsTrigger value="offers" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-offers">
                <Gift className="h-4 w-4 mr-2" />
                Offers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Earned Rewards</h3>
                  <Badge className="bg-white/10 text-white/80 border-white/20/50">
                    {transactions.filter(t => parseFloat(t.cashbackEarned || '0') > 0).length} earned
                  </Badge>
                </div>
                
                {transactionsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 text-white mx-auto mb-4 animate-spin" />
                    <p className="text-white/60">Loading rewards...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions
                      .filter(t => parseFloat(t.cashbackEarned || '0') > 0 || (t.pointsEarned || 0) > 0)
                      .slice(0, 10)
                      .map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/10" data-testid={`reward-transaction-${transaction.id}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/5 border border-white/20 flex items-center justify-center">
                              <IndianRupee className="h-5 w-5 text-white/80" />
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">
                                {transaction.description || 'UPI Transaction'}
                              </p>
                              <p className="text-white/60 text-xs">
                                ₹{parseFloat(transaction.amount).toLocaleString()} • {new Date(transaction.createdAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {parseFloat(transaction.cashbackEarned || '0') > 0 && (
                              <p className="text-white/80 font-semibold text-sm">
                                +₹{parseFloat(transaction.cashbackEarned || '0').toFixed(2)}
                              </p>
                            )}
                            {(transaction.pointsEarned || 0) > 0 && (
                              <p className="text-white/80 font-semibold text-xs">
                                +{transaction.pointsEarned} points
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    
                    {transactions.filter(t => parseFloat(t.cashbackEarned || '0') > 0 || (t.pointsEarned || 0) > 0).length === 0 && (
                      <div className="text-center py-12">
                        <Trophy className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">No rewards earned yet</p>
                        <p className="text-white/40 text-sm mt-2">Start using UPI to earn cashback and points</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="offers" className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Available Offers</h3>
                  <Badge className="bg-white/10 text-white/80 border-white/20/50">
                    {stats.availableOffers} active
                  </Badge>
                </div>
                
                {offersLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 text-white mx-auto mb-4 animate-spin" />
                    <p className="text-white/60">Loading offers...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pagination.paginatedData.map((offer) => (
                    <div key={offer.id} className="p-4 border border-white/10 bg-black/20 hover:border-white/30 transition-all" data-testid={`offer-${offer.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 ${getOfferColor(offer.type)} border border-white/10 flex items-center justify-center text-white`}>
                            {getOfferIcon(offer.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white text-sm">{offer.title}</h4>
                              <Badge variant="outline" className="text-xs border-white/10 text-white/60">
                                {offer.category}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm mb-2">{offer.description}</p>
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              {offer.minAmount > 0 && <span>Min: ₹{offer.minAmount}</span>}
                              <span>Valid until: {offer.validUntil.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{offer.value}</div>
                          <Badge variant={offer.isActive ? "default" : "secondary"} className="text-xs mt-1 bg-white/10 text-white/80 border-white/20/50">
                            {offer.isActive ? "Active" : "Expired"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    ))}

                    {fallbackOffers.length > 0 && (
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
                    
                    {fallbackOffers.length === 0 && (
                      <div className="text-center py-12">
                        <Gift className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">No active offers</p>
                        <p className="text-white/40 text-sm mt-2">Check back later for new cashback offers</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageShell>
  );
}