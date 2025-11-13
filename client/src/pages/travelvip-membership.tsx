import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Crown, 
  Calendar, 
  TrendingDown,
  Plane,
  Train,
  Bus,
  Hotel,
  Car,
  Ticket,
  Film,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import type { TravelVipMembership, TravelVipBenefitsUsage, TravelVipTransaction } from "@shared/schema";

export default function TravelVIPMembership() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const { data: membershipData, isLoading: membershipLoading } = useQuery<{ membership: TravelVipMembership | null }>({
    queryKey: ["/api/travelvip/membership"],
    enabled: isAuthenticated,
  });

  const { data: benefitsData } = useQuery<{ benefits: TravelVipBenefitsUsage[] }>({
    queryKey: ["/api/travelvip/benefits"],
    enabled: isAuthenticated,
  });

  const { data: transactionsData } = useQuery<{ transactions: TravelVipTransaction[] }>({
    queryKey: ["/api/travelvip/transactions"],
    enabled: isAuthenticated,
  });

  const membership = membershipData?.membership;
  const benefits = benefitsData?.benefits || [];
  const transactions = transactionsData?.transactions || [];

  const totalSavings = benefits.reduce((sum, b) => sum + parseFloat(b.savingsAmount || '0'), 0);

  const benefitIcons: Record<string, typeof Plane> = {
    flight: Plane,
    train: Train,
    bus: Bus,
    hotel: Hotel,
    car_rental: Car,
    cab: Ticket,
    metro: Ticket,
    event: Film,
    movie: Film,
  };

  const getBenefitIcon = (type: string) => {
    const Icon = benefitIcons[type] || CheckCircle;
    return Icon;
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getDaysRemaining = () => {
    if (!membership) return 0;
    const end = new Date(membership.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusColor = () => {
    if (!membership) return 'text-white/60';
    if (membership.status === 'active') return 'text-green-500';
    if (membership.status === 'expired') return 'text-red-500';
    return 'text-white/60';
  };

  const getStatusBadge = () => {
    if (!membership) return null;
    if (membership.status === 'active') {
      return (
        <Badge className="bg-green-500/20 text-green-500 border-green-500/30 rounded-none font-light text-xs">
          ACTIVE
        </Badge>
      );
    }
    if (membership.status === 'expired') {
      return (
        <Badge className="bg-red-500/20 text-red-500 border-red-500/30 rounded-none font-light text-xs">
          EXPIRED
        </Badge>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (membershipLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/travelvip')}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">MY TRAVELVIP</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-32 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
          <div className="border border-white/20 p-8 bg-white/5 backdrop-blur-sm text-center">
            <AlertCircle className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h2 className="text-xl font-light text-white mb-2">No Active Membership</h2>
            <p className="text-sm text-white/60 font-light mb-6">
              Subscribe to TravelVIP to unlock exclusive benefits across all your travels.
            </p>
            <Button
              onClick={() => navigate('/travelvip')}
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 font-light tracking-wider"
              data-testid="button-subscribe-now"
            >
              <Crown className="h-5 w-5 mr-2" />
              SUBSCRIBE NOW
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY TRAVELVIP</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Membership Dashboard</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Membership Status Card */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Crown className="h-20 w-20 text-yellow-500/10" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-xs text-yellow-500 uppercase tracking-widest font-light">VIP Member</span>
              </div>
              {getStatusBadge()}
            </div>
            <h2 className="text-2xl font-light text-white mb-1 tracking-wide uppercase">
              {membership.planType} Plan
            </h2>
            <p className="text-sm text-white/60 font-light mb-4">
              Member since {formatDate(membership.startDate)}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 font-light uppercase tracking-wider mb-1">Valid Until</p>
                <p className="text-base font-light text-white">{formatDate(membership.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 font-light uppercase tracking-wider mb-1">Days Remaining</p>
                <p className={`text-base font-light ${getStatusColor()}`}>{getDaysRemaining()} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm" data-testid="card-total-savings">
            <div className="bg-green-500/10 border border-green-500/20 rounded-none p-2 w-fit mb-3">
              <TrendingDown className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-white/40 font-light uppercase tracking-wider mb-1">Total Savings</p>
            <p className="text-2xl font-light text-green-500">₹{totalSavings.toFixed(0)}</p>
          </div>
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm" data-testid="card-benefits-used">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-none p-2 w-fit mb-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-white/40 font-light uppercase tracking-wider mb-1">Benefits Used</p>
            <p className="text-2xl font-light text-blue-500">{benefits.length}</p>
          </div>
        </div>

        {/* Auto-Renewal Status */}
        {membership.autoRenewal === 1 && (
          <div className="border border-green-500/30 p-4 bg-green-500/10 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-light text-green-500 mb-1">Auto-Renewal Active</p>
                <p className="text-xs text-white/60 font-light">
                  Your membership will automatically renew on {formatDate(membership.endDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Benefits Used */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white/60 text-xs uppercase tracking-widest font-light">Recent Benefits</h3>
            {benefits.length > 0 && (
              <span className="text-xs text-white/40 font-light">{benefits.length} total</span>
            )}
          </div>
          {benefits.length > 0 ? (
            <div className="space-y-2">
              {benefits.slice(0, 10).map((benefit, index) => {
                const Icon = getBenefitIcon(benefit.benefitType);
                return (
                  <div
                    key={benefit.id}
                    className="border-b border-white/10 p-4 hover:bg-white/5 transition-colors"
                    data-testid={`benefit-item-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 border border-white/20 rounded-none p-2">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-light text-white capitalize">
                            {benefit.benefitType.replace('_', ' ')}
                          </p>
                          <p className="text-sm font-light text-green-500">
                            +₹{parseFloat(benefit.savingsAmount || '0').toFixed(0)}
                          </p>
                        </div>
                        <p className="text-xs text-white/60 font-light capitalize">
                          {benefit.benefitCategory.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-white/40 font-light mt-1">
                          {format(new Date(benefit.usedAt), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-white/20 p-8 bg-white/5 backdrop-blur-sm text-center">
              <CheckCircle className="h-10 w-10 text-white/40 mx-auto mb-3" />
              <p className="text-sm text-white/60 font-light">
                No benefits used yet. Start booking to unlock your VIP perks!
              </p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="space-y-3">
          <h3 className="text-white/60 text-xs uppercase tracking-widest font-light">Transaction History</h3>
          {transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="border-b border-white/10 p-4"
                  data-testid={`transaction-item-${index}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-light text-white capitalize">
                      {transaction.transactionType}
                    </p>
                    <p className="text-sm font-light text-white">
                      ₹{parseFloat(transaction.amount).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/40 font-light">
                      {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                    </p>
                    <Badge className={`rounded-none font-light text-xs ${
                      transaction.status === 'success'
                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                        : 'bg-white/10 text-white/60 border-white/20'
                    }`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Settings Panel */}
        {showSettings && membership && (
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-light text-white tracking-wider mb-3">Membership Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <p className="text-sm font-light text-white mb-1">Auto-Renewal</p>
                  <p className="text-xs text-white/60 font-light">
                    {membership.autoRenewal === 1 ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Badge className={`rounded-none font-light text-xs ${
                  membership.autoRenewal === 1
                    ? 'bg-green-500/20 text-green-500 border-green-500/30'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}>
                  {membership.autoRenewal === 1 ? 'ON' : 'OFF'}
                </Badge>
              </div>
              {membership.status === 'active' && (
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 rounded-none h-12 font-light tracking-wider border border-red-500/20"
                  data-testid="button-cancel-membership"
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel your membership?')) {
                      // Handle cancellation
                    }
                  }}
                >
                  Cancel Membership
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-light text-white mb-3 tracking-wider">Need Help?</h3>
          <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
            Contact our VIP support team 24/7 for any membership-related queries or assistance with your bookings.
          </p>
          <Button
            variant="ghost"
            className="w-full text-white hover:bg-white/10 rounded-none h-12 font-light tracking-wider border border-white/20"
            data-testid="button-contact-support"
          >
            Contact Support
          </Button>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      {membership && membership.status !== 'active' && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <Button
            onClick={() => navigate('/travelvip')}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-renew-membership"
          >
            <Crown className="h-5 w-5 mr-2" />
            RENEW MEMBERSHIP
          </Button>
        </div>
      )}
    </div>
  );
}
