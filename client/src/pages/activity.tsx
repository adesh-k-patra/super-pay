import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Activity as ActivityIcon,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Building2,
  PieChart,
  Receipt,
  Gift,
  Plane,
  Zap,
  DollarSign,
  Eye,
  EyeOff,
  Download,
  RefreshCw
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'payment' | 'investment' | 'loan' | 'bill' | 'reward' | 'transfer' | 'deposit' | 'withdrawal';
  title: string;
  description: string;
  amount: number;
  direction: 'in' | 'out';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  category: string;
  transactionId: string;
  icon: any;
  color: string;
}

export default function Activity() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [hideAmounts, setHideAmounts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch activity data
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['/api/activity'],
    enabled: isAuthenticated,
  });

  // Mock activity data
  const mockActivity: ActivityItem[] = [
    {
      id: "act-1",
      type: "investment",
      title: "SIP Investment",
      description: "HDFC Top 100 Fund - Monthly SIP",
      amount: 5000,
      direction: "out",
      status: "completed",
      date: "2024-12-30",
      time: "14:30",
      category: "Investment",
      transactionId: "INV123456789",
      icon: PieChart,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-2",
      type: "payment",
      title: "UPI Payment",
      description: "Paid to John Doe",
      amount: 2500,
      direction: "out",
      status: "completed",
      date: "2024-12-30",
      time: "12:15",
      category: "Transfer",
      transactionId: "UPI123456789",
      icon: Smartphone,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-3",
      type: "bill",
      title: "Electricity Bill",
      description: "BESCOM - December 2024",
      amount: 2450,
      direction: "out",
      status: "completed",
      date: "2024-12-29",
      time: "18:45",
      category: "Bill Payment",
      transactionId: "BILL123456789",
      icon: Zap,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-4",
      type: "deposit",
      title: "Salary Credit",
      description: "Monthly Salary - December",
      amount: 85000,
      direction: "in",
      status: "completed",
      date: "2024-12-28",
      time: "09:00",
      category: "Salary",
      transactionId: "SAL123456789",
      icon: Building2,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-5",
      type: "reward",
      title: "Cashback Earned",
      description: "UPI Payment Reward",
      amount: 150,
      direction: "in",
      status: "completed",
      date: "2024-12-28",
      time: "12:20",
      category: "Cashback",
      transactionId: "RWD123456789",
      icon: Gift,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-6",
      type: "loan",
      title: "Home Loan EMI",
      description: "HDFC Home Loan - EMI #45",
      amount: 35000,
      direction: "out",
      status: "completed",
      date: "2024-12-27",
      time: "10:30",
      category: "EMI",
      transactionId: "EMI123456789",
      icon: Building2,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-7",
      type: "transfer",
      title: "Money Transfer",
      description: "Transfer to savings account",
      amount: 25000,
      direction: "out",
      status: "completed",
      date: "2024-12-26",
      time: "16:20",
      category: "Transfer",
      transactionId: "TRF123456789",
      icon: ArrowUpRight,
      color: "bg-white/5 border border-white/10"
    },
    {
      id: "act-8",
      type: "payment",
      title: "Credit Card Payment",
      description: "HDFC Regalia Card Bill",
      amount: 15000,
      direction: "out",
      status: "pending",
      date: "2024-12-26",
      time: "14:15",
      category: "Card Payment",
      transactionId: "CC123456789",
      icon: CreditCard,
      color: "bg-white/5 border border-white/10"
    }
  ];

  const activities = (activityData as ActivityItem[]) || mockActivity;

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-none animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-light tracking-wider">Loading your activity...</p>
        </div>
      </div>
    );
  }

  // Filter activities
  const filteredActivities = activities.filter((activity: ActivityItem) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || activity.type === selectedCategory;
    
    let matchesPeriod = true;
    if (selectedPeriod !== "all") {
      const activityDate = new Date(activity.date);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (selectedPeriod) {
        case "today":
          matchesPeriod = diffDays === 0;
          break;
        case "week":
          matchesPeriod = diffDays <= 7;
          break;
        case "month":
          matchesPeriod = diffDays <= 30;
          break;
        default:
          matchesPeriod = true;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPeriod;
  });

  // Pagination
  const pagination = usePagination({
    data: filteredActivities,
    itemsPerPage: 10,
  });

  // Calculate totals
  const totalInflow = filteredActivities
    .filter((a: ActivityItem) => a.direction === 'in' && a.status === 'completed')
    .reduce((sum: number, a: ActivityItem) => sum + a.amount, 0);
    
  const totalOutflow = filteredActivities
    .filter((a: ActivityItem) => a.direction === 'out' && a.status === 'completed')
    .reduce((sum: number, a: ActivityItem) => sum + a.amount, 0);

  const categories = [
    { value: "all", label: "All Activities" },
    { value: "payment", label: "Payments" },
    { value: "investment", label: "Investments" },
    { value: "bill", label: "Bills" },
    { value: "loan", label: "Loans" },
    { value: "reward", label: "Rewards" },
    { value: "transfer", label: "Transfers" }
  ];

  const periods = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/investment")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider text-white">My Activity</h1>
              <p className="text-xs text-white/50 font-light tracking-widest uppercase">{filteredActivities.length} transactions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideAmounts(!hideAmounts)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-toggle-amounts"
            >
              {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/export-activity")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-export"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 rounded-none focus:border-white/40"
              data-testid="input-search"
            />
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-2 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger data-testid="select-period">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="pt-24 p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-white" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Money In</span>
            </div>
            <p className="text-xl font-light text-white">
              {hideAmounts ? "₹••••••" : `₹${totalInflow.toLocaleString()}`}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Money Out</span>
            </div>
            <p className="text-xl font-light text-white">
              {hideAmounts ? "₹••••••" : `₹${totalOutflow.toLocaleString()}`}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-white" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Net Flow</span>
            </div>
            <p className="text-xl font-light text-white">
              {hideAmounts ? "₹••••••" : `₹${(totalInflow - totalOutflow).toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-8 text-center">
              <ActivityIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-light text-white mb-2">No activity found</h3>
              <p className="text-white/60 text-sm">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            pagination.paginatedData.map((activity: ActivityItem) => {
              const ActivityIconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="bg-white/5 border border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-white/10"
                  onClick={() => navigate(`/transaction/${activity.id}`)}
                  data-testid={`card-activity-${activity.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-none flex items-center justify-center text-white",
                        activity.color
                      )}>
                        <ActivityIconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-light text-white">{activity.title}</h3>
                          <Badge 
                            variant={
                              activity.status === 'completed' ? 'secondary' :
                              activity.status === 'pending' ? 'default' : 'destructive'
                            }
                            className="text-xs rounded-none"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/40">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">{activity.time}</span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">{activity.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-light text-white">
                        {activity.direction === 'in' ? '+' : '-'}
                        {hideAmounts ? "₹••••" : `₹${activity.amount.toLocaleString()}`}
                      </p>
                      <p className="text-xs text-white/60">{activity.category}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
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

      <BottomNavigation />
    </div>
  );
}