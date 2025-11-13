import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Building,
  Receipt,
  Car,
  Activity,
  Award,
  ShoppingBag,
  DollarSign,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  PieChart,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon: any;
}

export default function BudgetPlanner() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [budgetPeriod, setBudgetPeriod] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [monthlyIncome, setMonthlyIncome] = useState<number>(85000);
  const [hasChanges, setHasChanges] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "1", name: "Housing", budgeted: 35000, spent: 32000, icon: Building },
    { id: "2", name: "Food", budgeted: 12000, spent: 11200, icon: Receipt },
    { id: "3", name: "Transport", budgeted: 8000, spent: 9500, icon: Car },
    { id: "4", name: "Utilities", budgeted: 4000, spent: 3800, icon: Activity },
    { id: "5", name: "Entertainment", budgeted: 5000, spent: 4200, icon: Award }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = monthlyIncome - totalSpent;
  const budgetUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const updateCategory = (id: string, field: 'budgeted' | 'spent', value: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
    setHasChanges(true);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setHasChanges(true);
    toast({ title: "Category deleted", description: "Budget category removed successfully" });
  };

  const addCategory = () => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: "New Category",
      budgeted: 0,
      spent: 0,
      icon: DollarSign
    };
    setCategories([newCategory, ...categories]);
    setHasChanges(true);
    toast({ title: "Category added", description: "New budget category created" });
  };

  const saveBudget = () => {
    setHasChanges(false);
    toast({ title: "Budget Saved", description: "Your budget plan has been saved successfully" });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getPeriodLabel = () => {
    switch (budgetPeriod) {
      case 'daily': return 'Daily';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return 'Monthly';
    }
  };

  // Convert amounts based on period (all amounts stored as monthly, converted for display)
  const convertToPeriod = (monthlyAmount: number) => {
    switch (budgetPeriod) {
      case 'daily': return monthlyAmount / 30; // Monthly to daily
      case 'monthly': return monthlyAmount;
      case 'yearly': return monthlyAmount * 12; // Monthly to yearly
      default: return monthlyAmount;
    }
  };

  const convertFromPeriod = (amount: number) => {
    switch (budgetPeriod) {
      case 'daily': return amount * 30; // Daily to monthly
      case 'monthly': return amount;
      case 'yearly': return amount / 12; // Yearly to monthly
      default: return amount;
    }
  };

  // Convert all amounts for display
  const displayIncome = convertToPeriod(monthlyIncome);
  const displayTotalBudgeted = convertToPeriod(totalBudgeted);
  const displayTotalSpent = convertToPeriod(totalSpent);
  const displayRemaining = convertToPeriod(remaining);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-personal-finance-dashboard")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BUDGET PLANNER</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Manage your spending</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/budget-planner/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-budget-planner-info"
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
        {/* Summary Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-white/50 uppercase tracking-widest font-light">Budget Period</Label>
              <Select value={budgetPeriod} onValueChange={(value: "daily" | "monthly" | "yearly") => {
                setBudgetPeriod(value);
                setHasChanges(true);
              }}>
                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white rounded-none h-8" data-testid="select-budget-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 text-white">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-white/50 uppercase tracking-widest font-light">{getPeriodLabel()} Income</Label>
              <Input
                type="number"
                value={displayIncome}
                onChange={(e) => {
                  setMonthlyIncome(convertFromPeriod(Number(e.target.value)));
                  setHasChanges(true);
                }}
                className="w-32 bg-white/5 border-white/20 text-white text-right rounded-none h-8"
                data-testid="input-monthly-income"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Budgeted</p>
                <p className="text-lg font-light text-white" data-testid="text-total-budgeted">
                  {hideAmounts ? "₹••••" : formatCurrency(displayTotalBudgeted)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Spent</p>
                <p className="text-lg font-light text-white" data-testid="text-total-spent">
                  {hideAmounts ? "₹••••" : formatCurrency(displayTotalSpent)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Remaining</p>
                <p className={cn("text-lg font-light", remaining >= 0 ? 'text-white' : 'text-white/60')} data-testid="text-remaining">
                  {hideAmounts ? "₹••••" : formatCurrency(displayRemaining)}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest mb-2">
                <span>Budget Utilization</span>
                <span>{budgetUtilization.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5">
                <div 
                  className="bg-white h-1.5 transition-all duration-300"
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-categories"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-analytics"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="forecast" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-forecast"
            >
              Forecast
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
                const isOverBudget = category.spent > category.budgeted;

                return (
                  <div
                    key={category.id}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                    data-testid={`category-${category.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-white/60" />
                        </div>
                        <span className="text-sm text-white font-light">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light text-white">{hideAmounts ? "₹••••" : formatCurrency(convertToPeriod(category.spent))}</p>
                        <p className="text-[10px] text-white/50">of {hideAmounts ? "₹••••" : formatCurrency(convertToPeriod(category.budgeted))}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest mb-1">
                        <span>{isOverBudget ? 'Over Budget' : 'Progress'}</span>
                        <span>{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1">
                        <div 
                          className={cn("h-1 transition-all duration-300", isOverBudget ? "bg-white/60" : "bg-white")}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-[10px] text-white/50 uppercase tracking-widest font-light">Manage Categories</Label>
                <Button
                  onClick={addCategory}
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 rounded-none h-8 text-xs"
                  data-testid="button-add-category"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <div
                    key={category.id}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
                    data-testid={`category-edit-${category.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-white/60" />
                        </div>
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            setCategories(categories.map(cat => 
                              cat.id === category.id ? { ...cat, name: e.target.value } : cat
                            ));
                            setHasChanges(true);
                          }}
                          className="bg-transparent border-0 text-white font-light p-0 h-auto focus-visible:ring-0"
                          data-testid={`input-category-name-${category.id}`}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                        data-testid={`button-delete-${category.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-1 block">Budgeted</Label>
                        <Input
                          type="number"
                          value={convertToPeriod(category.budgeted)}
                          onChange={(e) => updateCategory(category.id, 'budgeted', convertFromPeriod(Number(e.target.value)))}
                          className="bg-white/5 border-white/20 text-white rounded-none h-8"
                          data-testid={`input-budgeted-${category.id}`}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-1 block">Spent</Label>
                        <Input
                          type="number"
                          value={convertToPeriod(category.spent)}
                          onChange={(e) => updateCategory(category.id, 'spent', convertFromPeriod(Number(e.target.value)))}
                          className="bg-white/5 border-white/20 text-white rounded-none h-8"
                          data-testid={`input-spent-${category.id}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-3">
              {/* Spending Breakdown */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Spending Breakdown</p>
                {categories.map((category) => {
                  const Icon = category.icon;
                  const percentage = (category.spent / totalSpent) * 100;

                  return (
                    <div key={category.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3 w-3 text-white/60" />
                          <span className="text-xs text-white/80">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-white font-light">{hideAmounts ? "₹••••" : formatCurrency(convertToPeriod(category.spent))}</span>
                          <span className="text-[10px] text-white/50 ml-2">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 h-1">
                        <div 
                          className="bg-white h-1 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Budget vs Actual */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Budget vs Actual</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center border border-white/10 p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3 text-white/60" />
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Budgeted</p>
                    </div>
                    <p className="text-xl font-light text-white">{hideAmounts ? "₹••••" : formatCurrency(displayTotalBudgeted)}</p>
                  </div>
                  <div className="text-center border border-white/10 p-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingDown className="h-3 w-3 text-white/60" />
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">Spent</p>
                    </div>
                    <p className="text-xl font-light text-white">{hideAmounts ? "₹••••" : formatCurrency(displayTotalSpent)}</p>
                  </div>
                </div>
              </div>

              {/* Savings Potential */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Savings Potential</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60">Income</span>
                    <span className="text-xs text-white font-light">{hideAmounts ? "₹••••" : formatCurrency(displayIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-xs text-white/60">Total Budget</span>
                    <span className="text-xs text-white font-light">{hideAmounts ? "₹••••" : formatCurrency(displayTotalBudgeted)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-white/60">Potential Savings</span>
                    <span className="text-xs text-white font-medium">{hideAmounts ? "₹••••" : formatCurrency(displayIncome - displayTotalBudgeted)}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="mt-6">
            <div className="space-y-3">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Budget Forecast Based on Current Spending</p>
                <p className="text-xs text-white/60 mb-4">Projections calculated based on your current {getPeriodLabel().toLowerCase()} spending patterns</p>
              </div>

              {/* 1 Year Forecast */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-light text-white uppercase tracking-wider">1 Year Forecast</h3>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹••••••" : formatCurrency(totalSpent * 12)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60">Projected Savings</span>
                  <span className="text-xs text-white font-light">
                    {hideAmounts ? "₹••••" : formatCurrency((monthlyIncome - totalSpent) * 12)}
                  </span>
                </div>
              </div>

              {/* 2 Year Forecast */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-light text-white uppercase tracking-wider">2 Year Forecast</h3>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹••••••" : formatCurrency(totalSpent * 24)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60">Projected Savings</span>
                  <span className="text-xs text-white font-light">
                    {hideAmounts ? "₹••••" : formatCurrency((monthlyIncome - totalSpent) * 24)}
                  </span>
                </div>
              </div>

              {/* 3 Year Forecast */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-light text-white uppercase tracking-wider">3 Year Forecast</h3>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹••••••" : formatCurrency(totalSpent * 36)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60">Projected Savings</span>
                  <span className="text-xs text-white font-light">
                    {hideAmounts ? "₹••••" : formatCurrency((monthlyIncome - totalSpent) * 36)}
                  </span>
                </div>
              </div>

              {/* 5 Year Forecast */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-light text-white uppercase tracking-wider">5 Year Forecast</h3>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹••••••" : formatCurrency(totalSpent * 60)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60">Projected Savings</span>
                  <span className="text-xs text-white font-light">
                    {hideAmounts ? "₹••••" : formatCurrency((monthlyIncome - totalSpent) * 60)}
                  </span>
                </div>
              </div>

              {/* 10 Year Forecast */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-light text-white uppercase tracking-wider">10 Year Forecast</h3>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹••••••" : formatCurrency(totalSpent * 120)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60">Projected Savings</span>
                  <span className="text-xs text-white font-light">
                    {hideAmounts ? "₹••••" : formatCurrency((monthlyIncome - totalSpent) * 120)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button - Fixed at bottom, only shows when changes made */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
            <Button
              onClick={saveBudget}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-sm font-light tracking-wider max-w-screen-lg mx-auto flex items-center justify-center"
              data-testid="button-save-budget"
            >
              <Save className="h-4 w-4 mr-2" />
              SAVE BUDGET
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
