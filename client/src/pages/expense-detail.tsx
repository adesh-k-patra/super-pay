import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Receipt,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Heart,
  Tv
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  housing: Home,
  healthcare: Heart,
  entertainment: Tv,
  other: DollarSign
};

const categoryColors: Record<string, string> = {
  food: "from-orange-500/20 to-orange-900/20 border-orange-500/30",
  transport: "from-blue-500/20 to-blue-900/20 border-blue-500/30",
  shopping: "from-purple-500/20 to-purple-900/20 border-purple-500/30",
  housing: "from-green-500/20 to-green-900/20 border-green-500/30",
  healthcare: "from-red-500/20 to-red-900/20 border-red-500/30",
  entertainment: "from-pink-500/20 to-pink-900/20 border-pink-500/30",
  other: "from-gray-500/20 to-gray-900/20 border-gray-500/30"
};

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  icon?: any;
}

export default function ExpenseDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/expense-tracker/:id");
  const { toast } = useToast();
  
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: 0,
    category: "other",
    date: ""
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Load expense from localStorage
    const expensesStr = localStorage.getItem('expenses');
    if (expensesStr) {
      const expenses = JSON.parse(expensesStr);
      const found = expenses.find((e: Expense) => e.id === params?.id);
      if (found) {
        setExpense(found);
        setEditForm({
          title: found.title,
          amount: found.amount,
          category: found.category,
          date: found.date
        });
      } else {
        toast({ title: "Error", description: "Expense not found", variant: "destructive" });
        navigate("/expense-tracker");
      }
    } else {
      toast({ title: "Error", description: "No expenses found", variant: "destructive" });
      navigate("/expense-tracker");
    }
  }, [isAuthenticated, navigate, params?.id, toast]);

  if (!expense) {
    return null;
  }

  const Icon = categoryIcons[expense.category];
  const colorClass = categoryColors[expense.category];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.title || editForm.amount <= 0) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const expensesStr = localStorage.getItem('expenses');
    if (expensesStr) {
      const expenses = JSON.parse(expensesStr);
      const updatedExpenses = expenses.map((e: Expense) => 
        e.id === expense.id 
          ? { 
              ...e, 
              title: editForm.title, 
              amount: editForm.amount,
              category: editForm.category,
              date: editForm.date,
              icon: categoryIcons[editForm.category]
            }
          : e
      );
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      // Update local state
      setExpense({
        ...expense,
        title: editForm.title,
        amount: editForm.amount,
        category: editForm.category,
        date: editForm.date,
        icon: categoryIcons[editForm.category]
      });
      
      setIsEditDialogOpen(false);
      toast({ title: "Success", description: "Expense updated successfully" });
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const expensesStr = localStorage.getItem('expenses');
    if (expensesStr) {
      const expenses = JSON.parse(expensesStr);
      const updatedExpenses = expenses.filter((e: Expense) => e.id !== expense.id);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      toast({ title: "Success", description: "Expense deleted successfully" });
      navigate("/expense-tracker");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/expense-tracker")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">EXPENSE DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Transaction Info</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Amount Card */}
        <div className={`border bg-gradient-to-br ${colorClass} backdrop-blur-xl p-8`}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-2 border-white/30 flex items-center justify-center">
              <Icon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Amount Spent</p>
            <p className="text-5xl font-light text-white mb-2" data-testid="text-expense-amount">
              {formatCurrency(expense.amount)}
            </p>
            <Badge className="bg-white/20 text-white border-white/30 rounded-none font-light text-xs capitalize">
              {expense.category}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-white mb-2">{expense.title}</h2>
        </div>

        {/* Details Card */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-white/60" />
                <span className="text-xs text-white/60 uppercase tracking-wider">Date</span>
              </div>
              <span className="text-sm text-white font-light">
                {new Date(expense.date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-white/60" />
                <span className="text-xs text-white/60 uppercase tracking-wider">Category</span>
              </div>
              <span className="text-sm text-white font-light capitalize">{expense.category}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider">EDIT EXPENSE</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Description</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="bg-white/5 border-white/20 text-white rounded-none"
                placeholder="Enter expense description"
                data-testid="input-edit-title"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Amount</Label>
                <Input
                  type="number"
                  value={editForm.amount || ""}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                  className="bg-white/5 border-white/20 text-white rounded-none"
                  data-testid="input-edit-amount"
                />
              </div>
              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Date</Label>
                <DatePicker
                  value={editForm.date}
                  onChange={(date) => setEditForm({ ...editForm, date })}
                  placeholder="Select date"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-edit-date"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-2 block">Category</Label>
              <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white rounded-none" data-testid="select-edit-category">
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
              onClick={handleSaveEdit}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none"
              data-testid="button-save-edit"
            >
              SAVE CHANGES
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-light tracking-wider">DELETE EXPENSE</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-none">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 rounded-none"
              data-testid="button-confirm-delete"
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-3">
          <Button
            onClick={handleEdit}
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none h-12"
            data-testid="button-edit"
          >
            <Edit className="h-4 w-4 mr-2" />
            EDIT
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-none h-12"
            data-testid="button-delete"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            DELETE
          </Button>
        </div>
      </div>
    </div>
  );
}
