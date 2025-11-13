import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  Activity,
  DollarSign,
  Calendar,
  Building,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Coins,
  Receipt,
  IndianRupee,
  CreditCard,
  Building2,
  Smartphone,
  Zap,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Target,
  PieChart,
  Wallet,
  Settings,
  Bell,
  Shield,
  User,
  MapPin,
  Hexagon
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "transaction" | "payment" | "login" | "setting_change" | "application" | "investment" | "loan_payment" | "bill_payment";
  title: string;
  description: string;
  amount?: number;
  category: "income" | "expense" | "neutral";
  timestamp: string;
  status: "completed" | "pending" | "failed";
  location?: string;
  device?: string;
  icon: string;
  reference?: string;
}

export default function MyActivity() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock activity data (in real app, this would come from APIs)
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "payment",
      title: "UPI Payment",
      description: "Paid to Starbucks Coffee",
      amount: 450,
      category: "expense",
      timestamp: "2024-12-29T14:30:00Z",
      status: "completed",
      location: "Bangalore, KA",
      device: "iPhone 15",
      icon: "smartphone",
      reference: "UPI123456"
    },
    {
      id: "2",
      type: "transaction",
      title: "Salary Credit",
      description: "Monthly salary from Tech Corp Ltd",
      amount: 85000,
      category: "income",
      timestamp: "2024-12-29T09:00:00Z",
      status: "completed",
      location: "Bangalore, KA",
      icon: "building"
    },
    {
      id: "3",
      type: "bill_payment",
      title: "Electricity Bill",
      description: "BESCOM electricity bill payment",
      amount: 2450,
      category: "expense",
      timestamp: "2024-12-28T19:45:00Z",
      status: "completed",
      location: "Bangalore, KA",
      icon: "zap"
    },
    {
      id: "4",
      type: "investment",
      title: "SIP Investment",
      description: "HDFC Top 100 Fund monthly SIP",
      amount: 5000,
      category: "expense",
      timestamp: "2024-12-28T10:15:00Z",
      status: "completed",
      icon: "pie-chart"
    },
    {
      id: "5",
      type: "loan_payment",
      title: "EMI Payment",
      description: "Home loan EMI - HDFC Bank",
      amount: 19250,
      category: "expense",
      timestamp: "2024-12-28T08:30:00Z",
      status: "completed",
      icon: "building2"
    },
    {
      id: "6",
      type: "login",
      title: "Account Login",
      description: "Successful login to your account",
      category: "neutral",
      timestamp: "2024-12-27T20:15:00Z",
      status: "completed",
      location: "Bangalore, KA",
      device: "MacBook Pro",
      icon: "user"
    },
    {
      id: "7",
      type: "setting_change",
      title: "Profile Updated",
      description: "Phone number changed successfully",
      category: "neutral",
      timestamp: "2024-12-27T16:22:00Z",
      status: "completed",
      location: "Bangalore, KA",
      device: "iPhone 15",
      icon: "settings"
    },
    {
      id: "8",
      type: "application",
      title: "Credit Card Application",
      description: "Applied for Premium Rewards Card",
      category: "neutral",
      timestamp: "2024-12-26T11:45:00Z",
      status: "pending",
      icon: "credit-card"
    },
    {
      id: "9",
      type: "transaction",
      title: "Fund Transfer",
      description: "Transfer to ICICI Savings Account",
      amount: 25000,
      category: "expense",
      timestamp: "2024-12-25T14:20:00Z",
      status: "completed",
      location: "Bangalore, KA",
      icon: "arrow-up-right"
    },
    {
      id: "10",
      type: "payment",
      title: "Card Payment Failed",
      description: "Payment to Amazon failed - insufficient funds",
      amount: 1299,
      category: "expense",
      timestamp: "2024-12-24T18:30:00Z",
      status: "failed",
      location: "Online",
      icon: "x-circle"
    }
  ];

  const totalTransactions = mockActivities.length;
  const completedTransactions = mockActivities.filter(activity => activity.status === "completed").length;
  const failedTransactions = mockActivities.filter(activity => activity.status === "failed").length;
  const pendingTransactions = mockActivities.filter(activity => activity.status === "pending").length;

  const totalAmountSpent = mockActivities
    .filter(activity => activity.category === "expense" && activity.status === "completed" && activity.amount)
    .reduce((sum, activity) => sum + (activity.amount || 0), 0);

  const totalAmountEarned = mockActivities
    .filter(activity => activity.category === "income" && activity.status === "completed" && activity.amount)
    .reduce((sum, activity) => sum + (activity.amount || 0), 0);

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case "smartphone": return Smartphone;
      case "building": return Building;
      case "zap": return Zap;
      case "pie-chart": return PieChart;
      case "building2": return Building2;
      case "user": return User;
      case "settings": return Settings;
      case "credit-card": return CreditCard;
      case "arrow-up-right": return ArrowUpRight;
      case "x-circle": return XCircle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    return "bg-white/10 text-white border-white/20 rounded-none";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "pending": return Clock;
      case "failed": return XCircle;
      default: return Clock;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "income": return TrendingUp;
      case "expense": return TrendingDown;
      case "neutral": return Activity;
      default: return Activity;
    }
  };

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "completed") return matchesSearch && activity.status === "completed";
    if (selectedTab === "pending") return matchesSearch && activity.status === "pending";
    return matchesSearch && activity.type === selectedTab;
  });

  const pagination = usePagination({
    data: filteredActivities,
    itemsPerPage: 10,
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
            <h1 className="text-base font-bold tracking-wider">MY ACTIVITY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Security & audit log</p>
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
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="activity-summary">
          <div className="space-y-6">
            {/* Activity Stats Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Spent This Period</p>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">{completedTransactions} Done</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-spent">
                {hideAmounts ? "₹••••••••" : `₹${(totalAmountSpent / 1000).toFixed(2)}K`}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-total-activities">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Activities</p>
                <p className="text-lg font-light text-white" data-testid="text-total-activities">
                  {totalTransactions}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Pending</p>
                <p className="text-lg font-light text-white">
                  {pendingTransactions}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Failed</p>
                <p className="text-lg font-light text-white">
                  {failedTransactions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-activities"
          />
        </div>

        {/* Activity Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all-activities">All</TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-payments">Payments</TabsTrigger>
              <TabsTrigger value="transaction" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-transactions">Transfer</TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-3">
                {pagination.paginatedData.map((activity) => {
                  const ActivityIconComponent = getActivityIcon(activity.icon);
                  const StatusIcon = getStatusIcon(activity.status);
                  const CategoryIcon = getCategoryIcon(activity.category);
                  
                  return (
                    <div
                      key={activity.id}
                      onClick={() => navigate(`/transaction-detail/${activity.id}`)}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      data-testid={`activity-${activity.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                            <ActivityIconComponent className="h-4 w-4 text-white/60" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-light text-white text-sm tracking-wide">{activity.title}</h4>
                            <p className="text-xs text-white/50">{activity.description}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          {activity.amount && (
                            <>
                              <p className="text-lg font-light text-white tracking-tight" data-testid={`text-amount-${activity.id}`}>
                                {activity.category === "income" ? "+" : "-"}
                                {hideAmounts ? "₹••••" : `₹${(activity.amount / 1000).toFixed(1)}K`}
                              </p>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                                {activity.status}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredActivities.length > 0 && (
                  <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    canGoNext={pagination.canGoNext}
                    canGoPrevious={pagination.canGoPrevious}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Activity Stats */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg" data-testid="activity-stats">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Activity Statistics</h4>
              <p className="text-xs text-white/60">
                {completedTransactions} completed, {pendingTransactions} pending, {failedTransactions} failed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white p-1"
                onClick={() => window.location.reload()}
                data-testid="button-refresh-activity"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}