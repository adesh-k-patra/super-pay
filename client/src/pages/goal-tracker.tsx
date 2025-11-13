import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Plus,
  Target,
  Award,
  Calendar,
  Building,
  Clock,
  Coins,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle,
  TrendingUp,
  Check,
  Info
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: any;
  duration: 'daily' | 'weekly' | 'yearly' | 'anytime';
  priority: 'high' | 'medium' | 'low';
  type: 'saving' | 'spending';
}

const categoryIcons: Record<string, any> = {
  emergency: Award,
  vacation: Calendar,
  education: Building,
  retirement: Clock,
  purchase: Coins,
  other: Target
};

export default function GoalTracker() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("weekly");
  const [selectedDateSegment, setSelectedDateSegment] = useState("");
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      targetAmount: 500000,
      currentAmount: 285000,
      deadline: "2024-12-31",
      category: "emergency",
      icon: Award,
      duration: 'yearly',
      priority: 'high',
      type: 'saving'
    },
    {
      id: "2",
      title: "European Vacation",
      targetAmount: 200000,
      currentAmount: 125000,
      deadline: "2025-06-15",
      category: "vacation",
      icon: Calendar,
      duration: 'anytime',
      priority: 'medium',
      type: 'spending'
    },
    {
      id: "3",
      title: "Car Purchase",
      targetAmount: 1200000,
      currentAmount: 750000,
      deadline: "2025-03-31",
      category: "purchase",
      icon: Coins,
      duration: 'yearly',
      priority: 'high',
      type: 'spending'
    }
  ]);

  const [newGoal, setNewGoal] = useState<{
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: string;
    duration: 'daily' | 'weekly' | 'yearly' | 'anytime';
    priority: 'high' | 'medium' | 'low';
    type: 'saving' | 'spending';
  }>({
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    category: "other",
    duration: "anytime",
    priority: "medium",
    type: "saving"
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const addGoal = () => {
    if (!newGoal.title || newGoal.targetAmount <= 0) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount,
      deadline: newGoal.deadline,
      category: newGoal.category,
      icon: categoryIcons[newGoal.category],
      duration: newGoal.duration,
      priority: newGoal.priority,
      type: newGoal.type
    };

    setGoals([goal, ...goals]);
    setNewGoal({ title: "", targetAmount: 0, currentAmount: 0, deadline: "", category: "other", duration: "anytime", priority: "medium", type: "saving" });
    setIsDialogOpen(false);
    toast({ title: "Goal Added", description: "Your financial goal has been added successfully" });
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: amount } : goal
    ));
    toast({ title: "Progress Updated", description: "Goal progress has been updated" });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({ title: "Goal Deleted", description: "Goal has been removed" });
  };

  const markAsCompleted = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: goal.targetAmount } : goal
    ));
    toast({ title: "Goal Completed!", description: "Congratulations on achieving your goal!" });
  };

  const redoGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: 0 } : goal
    ));
    toast({ title: "Goal Reactivated", description: "Goal has been moved back to active" });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getFilteredGoals = () => {
    if (dateFilter === 'daily') {
      return goals.filter(goal => goal.duration === 'daily');
    } else if (dateFilter === 'weekly') {
      return goals.filter(goal => goal.duration === 'weekly');
    } else if (dateFilter === 'monthly') {
      return goals;
    } else if (dateFilter === 'yearly') {
      return goals.filter(goal => goal.duration === 'yearly');
    }
    return goals;
  };

  const filteredGoals = getFilteredGoals();
  const totalTargetAmount = filteredGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = filteredGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const activeGoals = goals.filter(goal => {
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    return progress < 100;
  });

  const completedGoals = goals.filter(goal => {
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    return progress >= 100;
  });

  const generateDateSegments = () => {
    const today = new Date();
    
    if (dateFilter === "daily") {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const period = i < 12 ? "AM" : "PM";
        hours.push(`${hour}${period}`);
      }
      return hours;
    } else if (dateFilter === "weekly") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days;
    } else if (dateFilter === "monthly") {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const dates = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        dates.push(`${i} ${day}`);
      }
      return dates;
    } else {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months;
    }
  };

  const dateSegments = generateDateSegments();

  const renderGoalCard = (goal: Goal, isCompleted: boolean = false) => {
    const Icon = goal.icon;
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const handleAddAmount = (inputElement: HTMLInputElement) => {
      if (inputElement.value && Number(inputElement.value) > 0) {
        const newAmount = goal.currentAmount + Number(inputElement.value);
        updateGoalProgress(goal.id, newAmount);
        inputElement.value = '';
      }
    };

    return (
      <div
        key={goal.id}
        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5 hover:border-white/20 transition-all"
        data-testid={`goal-${goal.id}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
              <Icon className="h-4 w-4 text-white/60" />
            </div>
            <div>
              <h4 className="font-light text-white text-sm tracking-wide">{goal.title}</h4>
              <div className="flex gap-2 mt-1">
                <span className={cn(
                  "text-[9px] uppercase tracking-wider px-1.5 py-0.5 border",
                  goal.priority === 'high' ? "border-white/40 text-white/80" :
                  goal.priority === 'medium' ? "border-white/30 text-white/60" :
                  "border-white/20 text-white/40"
                )}>
                  {goal.priority}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-white/20 text-white/50">
                  {goal.duration}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-white/20 text-white/50">
                  {goal.type}
                </span>
              </div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Due: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              {daysLeft >= 0 && (
                <p className="text-[10px] text-white/40 mt-1">{daysLeft} days left</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-light text-white" data-testid={`text-target-${goal.id}`}>
              {hideAmounts ? "₹••••••" : formatCurrency(goal.targetAmount)}
            </p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Target</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
            <span>{progress.toFixed(0)}% Complete</span>
            <span data-testid={`text-current-${goal.id}`}>
              {hideAmounts ? "₹••••••" : formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5">
            <div 
              className="bg-white h-1.5 transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
          {!isCompleted ? (
            <>
              <Input
                type="number"
                placeholder="Add amount"
                className="flex-1 bg-white/5 border-white/20 text-white rounded-none h-8 text-sm"
                data-testid={`input-update-${goal.id}`}
                id={`input-${goal.id}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAmount(e.currentTarget as HTMLInputElement);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const input = document.getElementById(`input-${goal.id}`) as HTMLInputElement;
                  if (input) {
                    handleAddAmount(input);
                  }
                }}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none h-8 border border-white/20"
                data-testid={`button-add-amount-${goal.id}`}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsCompleted(goal.id)}
                className="text-white/60 hover:text-white hover:bg-white/10 px-3 rounded-none h-8"
                data-testid={`button-complete-${goal.id}`}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Complete</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteGoal(goal.id)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none h-8"
                data-testid={`button-delete-${goal.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => redoGoal(goal.id)}
                className="flex-1 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
                data-testid={`button-redo-${goal.id}`}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-xs uppercase tracking-wider">Redo Goal</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteGoal(goal.id)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none h-8"
                data-testid={`button-delete-${goal.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">GOAL TRACKER</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Track your financial goals</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/goal-tracker/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-goal-tracker-info"
            >
              <Info className="h-4 w-4" />
            </Button>
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
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Overall Progress Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="space-y-4">
            {/* Date Filter Dropdown */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Overall Progress</p>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white rounded-none h-8" data-testid="select-goal-date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 text-white">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-light text-white" data-testid="text-overall-progress">
                {overallProgress.toFixed(0)}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Current</p>
                <p className="text-lg font-light text-white" data-testid="text-total-current">
                  {hideAmounts ? "₹••••••" : formatCurrency(totalCurrentAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Target</p>
                <p className="text-lg font-light text-white" data-testid="text-total-target">
                  {hideAmounts ? "₹••••••" : formatCurrency(totalTargetAmount)}
                </p>
              </div>
            </div>

            <div className="w-full bg-white/10 h-2">
              <div 
                className="bg-white h-2 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Goal Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12"
              data-testid="button-add-goal"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD NEW GOAL
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-light tracking-wider">NEW FINANCIAL GOAL</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Goal Title</Label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="bg-white/5 border-white/20 text-white rounded-none"
                  placeholder="Enter goal name"
                  data-testid="input-goal-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none" data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 text-white">
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Type</Label>
                  <Select value={newGoal.type} onValueChange={(value: "saving" | "spending") => setNewGoal({ ...newGoal, type: value })}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none" data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 text-white">
                      <SelectItem value="saving">Saving</SelectItem>
                      <SelectItem value="spending">Spending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Duration</Label>
                  <Select value={newGoal.duration} onValueChange={(value: "daily" | "weekly" | "yearly" | "anytime") => setNewGoal({ ...newGoal, duration: value })}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none" data-testid="select-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 text-white">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value: "high" | "medium" | "low") => setNewGoal({ ...newGoal, priority: value })}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none" data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 text-white">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Target Amount</Label>
                  <Input
                    type="number"
                    value={newGoal.targetAmount || ""}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    className="bg-white/5 border-white/20 text-white rounded-none"
                    data-testid="input-target-amount"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Current Amount</Label>
                  <Input
                    type="number"
                    value={newGoal.currentAmount || ""}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                    className="bg-white/5 border-white/20 text-white rounded-none"
                    data-testid="input-current-amount"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Deadline</Label>
                <DatePicker
                  value={newGoal.deadline}
                  onChange={(date) => setNewGoal({ ...newGoal, deadline: date })}
                  placeholder="Select deadline"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-deadline"
                />
              </div>

              <Button
                onClick={addGoal}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-save-goal"
              >
                ADD GOAL
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-active"
            >
              Active ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-completed"
            >
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>

          {/* Horizontal Scrollable Date Segments */}
          <div className="mt-4">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2">
                {dateSegments.map((segment, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDateSegment(segment)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 border text-xs uppercase tracking-wider transition-all",
                      selectedDateSegment === segment
                        ? "border-white bg-white text-black"
                        : "border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white"
                    )}
                    data-testid={`goal-date-segment-${index}`}
                  >
                    {segment}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Goals Tab */}
          <TabsContent value="active" className="mt-6">
            <div className="space-y-3">
              {activeGoals.length > 0 ? (
                activeGoals.map(goal => renderGoalCard(goal, false))
              ) : (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-12 text-center">
                  <Target className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 font-light mb-1">No active goals</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Click "Add New Goal" to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Completed Goals Tab */}
          <TabsContent value="completed" className="mt-6">
            <div className="space-y-3">
              {completedGoals.length > 0 ? (
                completedGoals.map(goal => renderGoalCard(goal, true))
              ) : (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 font-light mb-1">No completed goals yet</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Keep working towards your goals!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
