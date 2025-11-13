import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Calendar,
  Award,
  Coins,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Building,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Settings,
  Download,
  IndianRupee,
  Banknote,
  Receipt,
  Percent,
  Calculator,
  Hexagon,
  Edit2,
  Trash2
} from "lucide-react";

interface FinanceMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  category: "income" | "expense" | "investment" | "loan" | "saving";
  period: "monthly" | "yearly";
}

interface GoalItem {
  id: number;
  userId: string;
  goalName: string;
  goalType: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  status: string;
  priority?: string | null;
  monthlyContribution?: number | null;
  description?: string | null;
  createdAt?: string;
}

interface AssetItem {
  id: string;
  name: string;
  value: number;
  type: "cash" | "investment" | "property" | "vehicle";
}

interface LiabilityItem {
  id: string;
  name: string;
  value: number;
  type: "loan" | "credit_card" | "emi";
}

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  icon: any;
}

export default function MyPersonalFinanceDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [incomeChange, setIncomeChange] = useState<number>(0);
  const [expenseChange, setExpenseChange] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);
  const [projectionCalculated, setProjectionCalculated] = useState(false);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [deleteGoalOpen, setDeleteGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    goalName: "",
    goalType: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    status: "",
    priority: "",
    monthlyContribution: "",
    description: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock goals data
  const mockGoals: GoalItem[] = [
    {
      id: 1,
      userId: user?.id || "1a39f980-d52b-4a4c-b09f-ee7880d79c72",
      goalName: "Emergency Fund",
      goalType: "emergency",
      targetAmount: 300000,
      currentAmount: 180000,
      targetDate: "2025-12-31",
      status: "on_track"
    },
    {
      id: 2,
      userId: user?.id || "1a39f980-d52b-4a4c-b09f-ee7880d79c72",
      goalName: "Dream Vacation",
      goalType: "vacation",
      targetAmount: 150000,
      currentAmount: 95000,
      targetDate: "2025-06-30",
      status: "on_track"
    },
    {
      id: 3,
      userId: user?.id || "1a39f980-d52b-4a4c-b09f-ee7880d79c72",
      goalName: "Higher Education",
      goalType: "education",
      targetAmount: 500000,
      currentAmount: 520000,
      targetDate: "2024-08-31",
      status: "completed"
    },
    {
      id: 4,
      userId: user?.id || "1a39f980-d52b-4a4c-b09f-ee7880d79c72",
      goalName: "Retirement Fund",
      goalType: "retirement",
      targetAmount: 2000000,
      currentAmount: 450000,
      targetDate: "2045-12-31",
      status: "behind"
    },
    {
      id: 5,
      userId: user?.id || "1a39f980-d52b-4a4c-b09f-ee7880d79c72",
      goalName: "New Laptop",
      goalType: "purchase",
      targetAmount: 80000,
      currentAmount: 35000,
      targetDate: "2025-03-31",
      status: "on_track"
    }
  ];

  // Initialize goals from mock data
  useEffect(() => {
    setGoals(mockGoals);
  }, []);

  // Mock finance data (in real app, this would come from APIs)
  const mockMetrics: FinanceMetric[] = [
    {
      id: "1",
      title: "Monthly Income",
      value: 85000,
      change: 5.2,
      changeType: "increase",
      category: "income",
      period: "monthly"
    },
    {
      id: "2", 
      title: "Monthly Expenses",
      value: 52000,
      change: -3.8,
      changeType: "decrease",
      category: "expense",
      period: "monthly"
    },
    {
      id: "3",
      title: "Monthly Savings",
      value: 33000,
      change: 15.5,
      changeType: "increase",
      category: "saving",
      period: "monthly"
    },
    {
      id: "4",
      title: "Investment Portfolio",
      value: 425000,
      change: 8.7,
      changeType: "increase",
      category: "investment",
      period: "yearly"
    }
  ];

  const handleEditGoal = (goal: GoalItem) => {
    setSelectedGoal(goal);
    setEditFormData({
      goalName: goal.goalName,
      goalType: goal.goalType,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : "",
      status: goal.status,
      priority: goal.priority || "",
      monthlyContribution: goal.monthlyContribution?.toString() || "",
      description: goal.description || ""
    });
    setEditGoalOpen(true);
  };

  const handleDeleteGoal = (goal: GoalItem) => {
    setSelectedGoal(goal);
    setDeleteGoalOpen(true);
  };

  const handleUpdateGoal = () => {
    if (!selectedGoal) return;
    
    // Update the goal in the local state
    setGoals(goals.map(g => 
      g.id === selectedGoal.id 
        ? {
            ...g,
            goalName: editFormData.goalName,
            goalType: editFormData.goalType,
            targetAmount: parseFloat(editFormData.targetAmount) || 0,
            currentAmount: parseFloat(editFormData.currentAmount) || 0,
            targetDate: editFormData.targetDate,
            status: editFormData.status,
            priority: editFormData.priority || null,
            monthlyContribution: parseFloat(editFormData.monthlyContribution) || null,
            description: editFormData.description || null
          }
        : g
    ));
    
    setEditGoalOpen(false);
    toast({ title: "Goal Updated", description: "Your goal has been updated successfully" });
  };

  const handleConfirmDelete = () => {
    if (!selectedGoal) return;
    
    setGoals(goals.filter(g => g.id !== selectedGoal.id));
    setDeleteGoalOpen(false);
    toast({ title: "Goal Deleted", description: "Your goal has been deleted successfully" });
  };

  const mockAssets: AssetItem[] = [
    { id: "1", name: "Savings Account", value: 150000, type: "cash" },
    { id: "2", name: "Mutual Funds", value: 280000, type: "investment" },
    { id: "3", name: "Stocks", value: 145000, type: "investment" },
    { id: "4", name: "Property", value: 8500000, type: "property" },
    { id: "5", name: "Vehicle", value: 650000, type: "vehicle" }
  ];

  const mockLiabilities: LiabilityItem[] = [
    { id: "1", name: "Home Loan", value: 4200000, type: "loan" },
    { id: "2", name: "Car Loan", value: 185000, type: "loan" },
    { id: "3", name: "Credit Card", value: 42000, type: "credit_card" }
  ];

  const mockBudget: BudgetItem[] = [
    { id: "1", category: "Housing", budgeted: 35000, spent: 32000, icon: Building },
    { id: "2", category: "Food", budgeted: 12000, spent: 11200, icon: Receipt },
    { id: "3", category: "Transport", budgeted: 8000, spent: 9500, icon: CreditCard },
    { id: "4", category: "Utilities", budgeted: 4000, spent: 3800, icon: Activity },
    { id: "5", category: "Entertainment", budgeted: 5000, spent: 4200, icon: Award }
  ];

  const totalAssets = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = mockLiabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const totalBudgeted = mockBudget.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = mockBudget.reduce((sum, item) => sum + item.spent, 0);

  const totalIncome = 85000;
  const totalExpenses = 52000;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = (netSavings / totalIncome) * 100;

  // Scenario planner calculations
  const calculateScenario = () => {
    setProjectionCalculated(true);
    toast({ title: "Scenario Calculated", description: "Your financial projection has been updated" });
  };

  const projectedIncome = totalIncome + incomeChange;
  const projectedExpenses = totalExpenses + expenseChange;
  const projectedMonthlySavings = projectedIncome - projectedExpenses;
  const yearlyNetWorthChange = (projectedMonthlySavings * 12) + oneTimeInvestment;
  const projectedGoalProgress = yearlyNetWorthChange > 0 ? ((yearlyNetWorthChange / netWorth) * 100) : 0;
  const projectedDebtReduction = oneTimeInvestment > 0 ? Math.min(oneTimeInvestment * 0.3, totalLiabilities * 0.1) : 0;

  // Generate 12-month projection
  const monthlyProjections = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const cumulativeSavings = projectedMonthlySavings * month;
    const cumulativeNetWorth = netWorth + oneTimeInvestment + cumulativeSavings;
    return {
      month,
      income: projectedIncome,
      expenses: projectedExpenses,
      savings: projectedMonthlySavings,
      cumulativeSavings,
      netWorth: cumulativeNetWorth
    };
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "income": return TrendingUp;
      case "expense": return TrendingDown;
      case "investment": return PieChart;
      case "loan": return CreditCard;
      case "saving": return Wallet;
      default: return DollarSign;
    }
  };

  const getGoalIcon = (goalType: string | null | undefined) => {
    if (!goalType) return Target;
    const type = goalType.toLowerCase();
    switch (type) {
      case "emergency": return Award;
      case "emergency fund": return Award;
      case "vacation": return Calendar;
      case "travel": return Calendar;
      case "education": return Building;
      case "retirement": return Clock;
      case "purchase": return Coins;
      case "savings": return Wallet;
      case "investment": return PieChart;
      default: return Target;
    }
  };

  const getStatusColor = (status: string) => {
    return "bg-white/10 text-white border-white/20 rounded-none";
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
            <h1 className="text-base font-bold tracking-wider">PERSONAL FINANCE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Budget, goals & insights</p>
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
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="finance-summary">
          <div className="space-y-6">
            {/* Net Worth Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Net Worth</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">+8.5%</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-net-worth">
                {hideAmounts ? "₹••••••••" : `₹${(netWorth / 100000).toFixed(2)}L`}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-monthly-income">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Income</p>
                <p className="text-lg font-light text-white" data-testid="text-monthly-income">
                  {hideAmounts ? "₹••••" : `₹${(totalIncome / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-monthly-expenses">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Expenses</p>
                <p className="text-lg font-light text-white" data-testid="text-monthly-expenses">
                  {hideAmounts ? "₹••••" : `₹${(totalExpenses / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Savings</p>
                <p className="text-lg font-light text-white">
                  {hideAmounts ? "₹••••" : `₹${(netSavings / 1000).toFixed(0)}K`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-5 gap-0">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="networth" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-networth">Worth</TabsTrigger>
              <TabsTrigger value="budget" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-budget">Budget</TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-goals">Goals</TabsTrigger>
              <TabsTrigger value="planner" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-planner">Planner</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-3">
                {mockMetrics.map((metric) => {
                  const CategoryIcon = getCategoryIcon(metric.category);
                  const isPositiveChange = metric.changeType === "increase";
                  
                  return (
                    <div
                      key={metric.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                      data-testid={`metric-${metric.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                            <CategoryIcon className="h-4 w-4 text-white/60" />
                          </div>
                          <div>
                            <h4 className="font-light text-white text-sm tracking-wide">{metric.title}</h4>
                            <p className="text-[10px] text-white/50 capitalize tracking-widest">{metric.period}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-light text-white tracking-tight" data-testid={`text-value-${metric.id}`}>
                            {hideAmounts ? "₹••••••" : `₹${(metric.value / 1000).toFixed(0)}K`}
                          </p>
                          <div className="flex items-center justify-end gap-1">
                            {isPositiveChange ? 
                              <ArrowUpRight className="h-3 w-3 text-white/50" /> : 
                              <ArrowDownRight className="h-3 w-3 text-white/50" />
                            }
                            <span className="text-[10px] font-light text-white/50" data-testid={`text-change-${metric.id}`}>
                              {Math.abs(metric.change)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
              {goals.length === 0 ? (
                <div className="text-center py-8 text-white/50">No goals yet. Create one to get started!</div>
              ) : (
                <div className="space-y-3">
                  {goals.map((goal: any) => {
                    const GoalIcon = getGoalIcon(goal.goalType);
                    const targetAmt = parseFloat(goal.targetAmount) || 0;
                    const currentAmt = parseFloat(goal.currentAmount) || 0;
                    const progress = targetAmt > 0 ? (currentAmt / targetAmt) * 100 : 0;
                    const isCompleted = goal.status === "completed";
                    
                    return (
                      <div
                        key={goal.id}
                        className={cn(
                          "border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5 hover:border-white/20 transition-all",
                          isCompleted && "border-white/30 bg-white/5"
                        )}
                        data-testid={`goal-${goal.id}`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                                <GoalIcon className="h-4 w-4 text-white/60" />
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-light text-white text-sm tracking-wide">{goal.goalName}</h4>
                                  {isCompleted && (
                                    <Badge className="bg-white/20 text-white text-[10px] px-2 py-0 h-5 border-white/30" data-testid={`badge-completed-${goal.id}`}>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Achieved
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[10px] text-white/50 tracking-widest uppercase">
                                  {goal.targetDate ? `Due: ${new Date(goal.targetDate).toLocaleDateString()}` : "No deadline"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="text-right space-y-1">
                                <p className="text-lg font-light text-white tracking-tight" data-testid={`text-goal-target-${goal.id}`}>
                                  {hideAmounts ? "₹••••••" : `₹${(targetAmt / 1000).toFixed(0)}K`}
                                </p>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest">Target</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditGoal(goal)}
                                  className="h-7 w-7 p-0 hover:bg-white/10"
                                  data-testid={`button-edit-goal-${goal.id}`}
                                >
                                  <Edit2 className="h-3 w-3 text-white/60" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteGoal(goal)}
                                  className="h-7 w-7 p-0 hover:bg-white/10"
                                  data-testid={`button-delete-goal-${goal.id}`}
                                >
                                  <Trash2 className="h-3 w-3 text-white/60" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                              <span>{progress.toFixed(0)}% Complete</span>
                              <span data-testid={`text-goal-current-${goal.id}`}>
                                {hideAmounts ? "₹••••••" : `₹${(currentAmt / 1000).toFixed(0)}K`}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5">
                              <div 
                                className={cn(
                                  "h-1.5 transition-all duration-300",
                                  isCompleted ? "bg-white" : "bg-white/60"
                                )}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                                data-testid={`progress-goal-${goal.id}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="networth" className="mt-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Assets</p>
                  {mockAssets.map((asset) => (
                    <div key={asset.id} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4" data-testid={`asset-${asset.id}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white font-light tracking-wide">{asset.name}</span>
                        <span className="text-lg font-light text-white tracking-tight">
                          {hideAmounts ? "₹••••••" : `₹${(asset.value / 100000).toFixed(2)}L`}
                        </span>
                      </div>
                      <Progress value={(asset.value / totalAssets) * 100} className="h-1" />
                      <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">{((asset.value / totalAssets) * 100).toFixed(1)}% of total</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Liabilities</p>
                  {mockLiabilities.map((liability) => (
                    <div key={liability.id} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4" data-testid={`liability-${liability.id}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white font-light tracking-wide">{liability.name}</span>
                        <span className="text-lg font-light text-white tracking-tight">
                          {hideAmounts ? "₹••••••" : `₹${(liability.value / 100000).toFixed(2)}L`}
                        </span>
                      </div>
                      <Progress value={(liability.value / totalLiabilities) * 100} className="h-1" />
                      <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">{((liability.value / totalLiabilities) * 100).toFixed(1)}% of total</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="mt-6">
              <div className="space-y-4">
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/50 uppercase tracking-widest">Total Spent / Budgeted</span>
                      <span className="text-lg font-light text-white tracking-tight">
                        {hideAmounts ? "₹•••• / ₹••••" : `₹${(totalSpent / 1000).toFixed(0)}K / ₹${(totalBudgeted / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                    <Progress value={(totalSpent / totalBudgeted) * 100} className="h-1.5" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{((totalSpent / totalBudgeted) * 100).toFixed(1)}% used</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockBudget.map((item) => {
                    const Icon = item.icon;
                    const isOverBudget = item.spent > item.budgeted;
                    return (
                      <div key={item.id} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4" data-testid={`budget-${item.id}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-white/60" />
                            </div>
                            <span className="text-sm text-white font-light tracking-wide">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <p className={cn("text-lg font-light text-white tracking-tight", isOverBudget && "text-white")}>
                              {hideAmounts ? "₹•••" : `₹${(item.spent / 1000).toFixed(1)}K`}
                            </p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">of {hideAmounts ? "₹•••" : `₹${(item.budgeted / 1000).toFixed(1)}K`}</p>
                          </div>
                        </div>
                        <Progress value={Math.min((item.spent / item.budgeted) * 100, 100)} className={cn("h-1", isOverBudget && "[&>div]:bg-white")} />
                        <p className={cn("text-[10px] mt-1.5 uppercase tracking-widest", isOverBudget ? "text-white" : "text-white/40")}>
                          {((item.spent / item.budgeted) * 100).toFixed(1)}% {isOverBudget && "over budget"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="planner" className="mt-6">
              <div className="space-y-4">
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6" data-testid="scenario-planner">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-white/60" />
                    </div>
                    <h3 className="text-sm font-light text-white tracking-wide">Financial Scenario Planner</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Income Change (monthly)</label>
                      <input 
                        type="number" 
                        value={incomeChange || ''}
                        onChange={(e) => setIncomeChange(Number(e.target.value) || 0)}
                        placeholder="+5000 or -5000"
                        className="w-full bg-black/20 border border-white/20 text-white p-3 text-sm font-light placeholder:text-white/30 focus:outline-none focus:border-white/40"
                        data-testid="input-income-scenario"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Expense Change (monthly)</label>
                      <input 
                        type="number" 
                        value={expenseChange || ''}
                        onChange={(e) => setExpenseChange(Number(e.target.value) || 0)}
                        placeholder="+2000 or -2000"
                        className="w-full bg-black/20 border border-white/20 text-white p-3 text-sm font-light placeholder:text-white/30 focus:outline-none focus:border-white/40"
                        data-testid="input-expense-scenario"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">One-time Investment</label>
                      <input 
                        type="number" 
                        value={oneTimeInvestment || ''}
                        onChange={(e) => setOneTimeInvestment(Number(e.target.value) || 0)}
                        placeholder="50000"
                        className="w-full bg-black/20 border border-white/20 text-white p-3 text-sm font-light placeholder:text-white/30 focus:outline-none focus:border-white/40"
                        data-testid="input-investment-scenario"
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-white text-black hover:bg-white/90 h-11 font-light tracking-wide"
                      onClick={calculateScenario}
                      data-testid="button-calculate-scenario"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Impact
                    </Button>
                  </div>
                  
                  {projectionCalculated && (
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">12-Month Projection</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/80 border border-white/10 p-4" data-testid="projection-networth-change">
                          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest">Net Worth Change</p>
                          <p className={cn("text-lg font-light text-white tracking-tight", yearlyNetWorthChange >= 0 ? "text-white" : "text-white")}>
                            {hideAmounts ? (yearlyNetWorthChange >= 0 ? "+₹•••" : "-₹•••") : 
                              `${yearlyNetWorthChange >= 0 ? '+' : ''}₹${(Math.abs(yearlyNetWorthChange) / 100000).toFixed(1)}L`}
                          </p>
                        </div>
                        <div className="bg-black/80 border border-white/10 p-4" data-testid="projection-monthly-savings">
                          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest">Monthly Savings</p>
                          <p className={cn("text-lg font-light text-white tracking-tight", projectedMonthlySavings >= 0 ? "text-white" : "text-white")}>
                            {hideAmounts ? "₹•••" : `₹${(projectedMonthlySavings / 1000).toFixed(0)}K`}
                          </p>
                        </div>
                        <div className="bg-black/80 border border-white/10 p-4" data-testid="projection-goal-progress">
                          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest">Goal Progress</p>
                          <p className="text-lg font-light text-white tracking-tight">
                            +{projectedGoalProgress.toFixed(1)}%
                          </p>
                        </div>
                        <div className="bg-black/80 border border-white/10 p-4" data-testid="projection-debt-reduction">
                          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest">Debt Reduction</p>
                          <p className="text-lg font-light text-white tracking-tight">
                            {hideAmounts ? "₹•••" : `₹${(projectedDebtReduction / 100000).toFixed(1)}L`}
                          </p>
                        </div>
                      </div>

                      <div className="border border-white/10 bg-black/10">
                        <div className="p-4 border-b border-white/10">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">Monthly Breakdown</p>
                        </div>
                        <div>
                          <table className="w-full text-xs">
                            <thead className="bg-black/50 border-b border-white/10">
                              <tr>
                                <th className="text-center py-2 px-4 text-[10px] text-white/50 uppercase tracking-widest font-light">Month</th>
                                <th className="text-center py-2 px-6 text-[10px] text-white/50 uppercase tracking-widest font-light">Savings</th>
                                <th className="text-center py-2 px-4 text-[10px] text-white/50 uppercase tracking-widest font-light">Net Worth</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthlyProjections.map((proj, idx) => (
                                <tr key={idx} className="border-b border-white/10 hover:bg-white/5" data-testid={`projection-month-${proj.month}`}>
                                  <td className="py-2 px-4 text-center text-white/80 font-light">Month {proj.month}</td>
                                  <td className={cn("py-2 px-6 text-center font-light", proj.savings >= 0 ? "text-white" : "text-white")}>
                                    {hideAmounts ? "₹•••" : `₹${(proj.savings / 1000).toFixed(0)}K`}
                                  </td>
                                  <td className="py-2 px-4 text-center font-light text-white">
                                    {hideAmounts ? "₹••••" : `₹${(proj.netWorth / 100000).toFixed(1)}L`}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={editGoalOpen} onOpenChange={setEditGoalOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goalName" className="text-white/70">Goal Name</Label>
              <Input
                id="goalName"
                value={editFormData.goalName}
                onChange={(e) => setEditFormData({ ...editFormData, goalName: e.target.value })}
                className="bg-black/50 border-white/20 text-white"
                data-testid="input-edit-goal-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalType" className="text-white/70">Goal Type</Label>
              <Input
                id="goalType"
                value={editFormData.goalType}
                onChange={(e) => setEditFormData({ ...editFormData, goalType: e.target.value })}
                className="bg-black/50 border-white/20 text-white"
                data-testid="input-edit-goal-type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAmount" className="text-white/70">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                value={editFormData.targetAmount}
                onChange={(e) => setEditFormData({ ...editFormData, targetAmount: e.target.value })}
                className="bg-black/50 border-white/20 text-white"
                data-testid="input-edit-target-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentAmount" className="text-white/70">Current Amount</Label>
              <Input
                id="currentAmount"
                type="number"
                value={editFormData.currentAmount}
                onChange={(e) => setEditFormData({ ...editFormData, currentAmount: e.target.value })}
                className="bg-black/50 border-white/20 text-white"
                data-testid="input-edit-current-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate" className="text-white/70">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={editFormData.targetDate}
                onChange={(e) => setEditFormData({ ...editFormData, targetDate: e.target.value })}
                className="bg-black/50 border-white/20 text-white"
                data-testid="input-edit-target-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white/70">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger className="bg-black/50 border-white/20 text-white" data-testid="select-edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 text-white">
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="behind">Behind</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditGoalOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateGoal}
              className="bg-white text-black hover:bg-white/90"
              data-testid="button-save-edit"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Goal Dialog */}
      <AlertDialog open={deleteGoalOpen} onOpenChange={setDeleteGoalOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Goal</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{selectedGoal?.goalName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10" data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-white text-black hover:bg-white/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}