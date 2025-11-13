import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Plus,
  Receipt,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Heart,
  Tv,
  DollarSign,
  Calendar,
  Trash2,
  Eye,
  EyeOff,
  TrendingDown,
  TrendingUp,
  BarChart3,
  PieChart,
  Info
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  icon: any;
}

const categoryIcons: Record<string, any> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  housing: Home,
  healthcare: Heart,
  entertainment: Tv,
  other: DollarSign
};

export default function ExpenseTracker() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("day");
  const [selectedDateSegment, setSelectedDateSegment] = useState("");
  
  const defaultExpenses: Expense[] = [
    { id: "1", title: "Grocery Shopping", amount: 4500, category: "food", date: "2025-11-04", icon: Utensils },
    { id: "2", title: "Uber Ride", amount: 350, category: "transport", date: "2025-11-04", icon: Car },
    { id: "3", title: "Online Shopping", amount: 2800, category: "shopping", date: "2025-11-03", icon: ShoppingBag },
    { id: "4", title: "Electricity Bill", amount: 1200, category: "housing", date: "2025-11-03", icon: Home },
    { id: "5", title: "Restaurant Dinner", amount: 1800, category: "food", date: "2025-11-02", icon: Utensils },
    { id: "6", title: "Movie Tickets", amount: 600, category: "entertainment", date: "2025-11-02", icon: Tv },
    { id: "7", title: "Metro Card Recharge", amount: 500, category: "transport", date: "2025-11-01", icon: Car },
    { id: "8", title: "Coffee Shop", amount: 250, category: "food", date: "2025-11-01", icon: Utensils },
    { id: "9", title: "Medicines", amount: 850, category: "healthcare", date: "2025-10-31", icon: Heart },
    { id: "10", title: "Water Bill", amount: 400, category: "housing", date: "2025-10-30", icon: Home },
    { id: "11", title: "Clothing Store", amount: 3500, category: "shopping", date: "2025-10-29", icon: ShoppingBag },
    { id: "12", title: "Pizza Delivery", amount: 680, category: "food", date: "2025-10-28", icon: Utensils },
    { id: "13", title: "Gym Membership", amount: 2000, category: "healthcare", date: "2025-10-27", icon: Heart },
    { id: "14", title: "Netflix Subscription", amount: 649, category: "entertainment", date: "2025-10-26", icon: Tv },
    { id: "15", title: "Auto Rickshaw", amount: 180, category: "transport", date: "2025-10-25", icon: Car },
    { id: "16", title: "Birthday Gift", amount: 1500, category: "other", date: "2025-10-24", icon: DollarSign },
    { id: "17", title: "Breakfast at Cafe", amount: 420, category: "food", date: "2025-10-23", icon: Utensils },
    { id: "18", title: "Internet Bill", amount: 999, category: "housing", date: "2025-10-22", icon: Home },
    { id: "19", title: "Book Store", amount: 750, category: "shopping", date: "2025-10-21", icon: ShoppingBag },
    { id: "20", title: "Concert Tickets", amount: 2500, category: "entertainment", date: "2025-10-20", icon: Tv },
    { id: "21", title: "Dental Checkup", amount: 1200, category: "healthcare", date: "2025-10-19", icon: Heart },
    { id: "22", title: "Gas Station", amount: 3000, category: "transport", date: "2025-10-18", icon: Car },
    { id: "23", title: "Lunch with Friends", amount: 950, category: "food", date: "2025-10-17", icon: Utensils },
    { id: "24", title: "Electronics Store", amount: 5500, category: "shopping", date: "2025-10-16", icon: ShoppingBag },
    { id: "25", title: "House Rent", amount: 15000, category: "housing", date: "2025-10-15", icon: Home },
    { id: "26", title: "Spa Treatment", amount: 2800, category: "healthcare", date: "2025-10-14", icon: Heart },
    { id: "27", title: "Streaming Service", amount: 299, category: "entertainment", date: "2025-10-13", icon: Tv },
    { id: "28", title: "Taxi Fare", amount: 450, category: "transport", date: "2025-10-12", icon: Car },
    { id: "29", title: "Ice Cream Parlor", amount: 320, category: "food", date: "2025-10-11", icon: Utensils },
    { id: "30", title: "Furniture Purchase", amount: 8500, category: "housing", date: "2025-10-10", icon: Home },
    { id: "31", title: "Gaming Console", amount: 12000, category: "entertainment", date: "2025-09-15", icon: Tv },
    { id: "32", title: "Pharmacy", amount: 650, category: "healthcare", date: "2025-08-20", icon: Heart },
    { id: "33", title: "Fast Food", amount: 380, category: "food", date: "2025-07-22", icon: Utensils },
    { id: "34", title: "Car Service", amount: 4500, category: "transport", date: "2025-06-25", icon: Car },
    { id: "35", title: "Phone Accessories", amount: 1200, category: "shopping", date: "2025-05-28", icon: ShoppingBag },
    { id: "36", title: "Charity Donation", amount: 2000, category: "other", date: "2025-04-15", icon: DollarSign },
  ];

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0,
    category: "other",
    date: new Date().toISOString().split('T')[0]
  });

  // Load expenses from localStorage on mount and when returning to page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const loadExpenses = () => {
      const stored = localStorage.getItem('expenses');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Restore icons
        const withIcons = parsed.map((e: Expense) => ({
          ...e,
          icon: categoryIcons[e.category]
        }));
        setExpenses(withIcons);
      } else {
        // Initialize with default data
        localStorage.setItem('expenses', JSON.stringify(defaultExpenses));
        setExpenses(defaultExpenses);
      }
    };

    loadExpenses();

    // Reload expenses when window gains focus (after returning from detail page)
    const handleFocus = () => loadExpenses();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, navigate]);

  const addExpense = () => {
    if (!newExpense.title || newExpense.amount <= 0) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date,
      icon: categoryIcons[newExpense.category]
    };

    const updated = [expense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
    setNewExpense({ title: "", amount: 0, category: "other", date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
    toast({ title: "Expense Added", description: "Your expense has been recorded successfully" });
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(expense => expense.id !== id);
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
    toast({ title: "Expense Deleted", description: "Expense has been removed" });
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    
    if (dateFilter === "day") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= today;
      });
    } else if (dateFilter === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth;
      });
    } else if (dateFilter === "yearly") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfYear;
      });
    }
    return expenses;
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const pagination = usePagination({
    data: filteredExpenses,
    itemsPerPage: 20,
  });

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryStats = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    icon: categoryIcons[category]
  })).sort((a, b) => b.amount - a.amount);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const generateDateSegments = () => {
    const today = new Date();
    
    if (dateFilter === "day") {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const period = i < 12 ? "AM" : "PM";
        hours.push(`${hour}${period}`);
      }
      return hours;
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
            <h1 className="text-base font-bold tracking-wider">EXPENSE TRACKER</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Track your spending</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/expense-tracker/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-expense-tracker-info"
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
        {/* Total Expenses Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <Label className="text-[10px] text-white/50 uppercase tracking-widest font-light">Period</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white rounded-none h-8" data-testid="select-date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 text-white">
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Total Expenses</p>
              <p className="text-4xl font-light text-white" data-testid="text-total-expenses">
                {hideAmounts ? "₹••••••" : formatCurrency(totalExpenses)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <TrendingDown className="h-4 w-4 text-white/60" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest">{filteredExpenses.length} Transactions</span>
            </div>
          </div>
        </div>

        {/* Add Expense Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12"
              data-testid="button-add-expense"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD EXPENSE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-light tracking-wider">NEW EXPENSE</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Description</Label>
                <Input
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="bg-white/5 border-white/20 text-white rounded-none"
                  placeholder="Enter expense description"
                  data-testid="input-expense-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Amount</Label>
                  <Input
                    type="number"
                    value={newExpense.amount || ""}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="bg-white/5 border-white/20 text-white rounded-none"
                    data-testid="input-expense-amount"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Date</Label>
                  <DatePicker
                    value={newExpense.date}
                    onChange={(date) => setNewExpense({ ...newExpense, date })}
                    placeholder="Select date"
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-expense-date"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Category</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none" data-testid="select-expense-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 text-white">
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="housing">Housing & Utilities</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={addExpense}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-save-expense"
              >
                ADD EXPENSE
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tabs - Same design as personal finance dashboard */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-all"
            >
              All Expenses
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-categories"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-insights"
            >
              Insights
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
                    data-testid={`date-segment-${index}`}
                  >
                    {segment}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* All Expenses Tab */}
          <TabsContent value="all" className="mt-6">
            <div className="space-y-3">
              {filteredExpenses.length > 0 ? (
                pagination.paginatedData.map((expense) => {
                  const Icon = expense.icon;
                  return (
                    <div
                      key={expense.id}
                      onClick={() => navigate(`/expense-tracker/${expense.id}`)}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      data-testid={`expense-${expense.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-white/60" />
                          </div>
                          <div>
                            <h4 className="font-light text-white text-sm">{expense.title}</h4>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest capitalize">{expense.category}</p>
                            <p className="text-[10px] text-white/40 mt-1">{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-light text-white" data-testid={`expense-amount-${expense.id}`}>
                            {hideAmounts ? "₹••••" : formatCurrency(expense.amount)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteExpense(expense.id);
                            }}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none h-8 w-8"
                            data-testid={`button-delete-${expense.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-12 text-center">
                  <Receipt className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 font-light mb-1">No expenses recorded</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Click "Add Expense" to get started</p>
                </div>
              )}

              {filteredExpenses.length > 0 && (
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

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-6">
            <div className="space-y-3">
              {categoryStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.category}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                    data-testid={`category-${stat.category}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-white/60" />
                        </div>
                        <span className="text-sm text-white font-light capitalize">{stat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-light text-white" data-testid={`amount-${stat.category}`}>
                          {hideAmounts ? "₹••••" : formatCurrency(stat.amount)}
                        </p>
                        <p className="text-[10px] text-white/50">{stat.percentage.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 h-1">
                      <div 
                        className="bg-white h-1 transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-6">
            <div className="space-y-3">
              {/* Top Category */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Top Spending Category</p>
                {categoryStats.length > 0 && (() => {
                  const TopIcon = categoryStats[0].icon;
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                          {TopIcon && <TopIcon className="h-5 w-5 text-white/60" />}
                        </div>
                        <div>
                          <p className="text-base font-light text-white capitalize">{categoryStats[0].category}</p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">{categoryStats[0].percentage.toFixed(1)}% of total</p>
                        </div>
                      </div>
                      <p className="text-xl font-light text-white">{hideAmounts ? "₹••••" : formatCurrency(categoryStats[0].amount)}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Spending Stats */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Spending Statistics</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-xs text-white/60">Total Transactions</span>
                    <span className="text-xs text-white font-light">{filteredExpenses.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-xs text-white/60">Average Transaction</span>
                    <span className="text-xs text-white font-light">{hideAmounts ? "₹••••" : formatCurrency(totalExpenses / filteredExpenses.length || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-xs text-white/60">Categories Used</span>
                    <span className="text-xs text-white font-light">{categoryStats.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Total Spent</span>
                    <span className="text-xs text-white font-medium">{hideAmounts ? "₹••••" : formatCurrency(totalExpenses)}</span>
                  </div>
                </div>
              </div>

              {/* Recent Trend */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Recent Activity</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-white/60" />
                    <span className="text-xs text-white/80">Last 7 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-white/60" />
                    <span className="text-xs text-white/60">Tracking expenses</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
