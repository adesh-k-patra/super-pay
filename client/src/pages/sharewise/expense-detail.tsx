import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Trash2, User, Calendar, DollarSign, Tag } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const editExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.enum(["groceries", "utilities", "rent", "housing", "transport", "food", "entertainment", "accommodation", "other"]),
  notes: z.string().optional(),
  occurredAt: z.string().optional(),
});

type EditExpenseData = z.infer<typeof editExpenseSchema>;

export default function ExpenseDetail() {
  const { groupId, expenseId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: expense, isLoading } = useQuery({
    queryKey: [`/api/sharewise/groups/${groupId}/expenses/${expenseId}`],
    enabled: !!groupId && !!expenseId
  });

  const form = useForm<EditExpenseData>({
    resolver: zodResolver(editExpenseSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "other",
      notes: "",
      occurredAt: "",
    },
  });

  const updateExpense = useMutation({
    mutationFn: async (data: EditExpenseData) => {
      return await apiRequest(`/api/sharewise/expenses/${expenseId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sharewise/groups/${groupId}/expenses/${expenseId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/sharewise/groups/${groupId}/expenses`] });
      toast({
        title: "Expense Updated",
        description: "Expense has been updated successfully",
      });
      setEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/sharewise/expenses/${expenseId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/sharewise/groups/${groupId}/expenses`] });
      toast({
        title: "Expense Deleted",
        description: "Expense has been deleted successfully",
      });
      navigate(`/sharewise/groups/${groupId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = () => {
    if (expense) {
      form.reset({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        notes: expense.notes || "",
        occurredAt: expense.occurredAt ? format(new Date(expense.occurredAt), "yyyy-MM-dd'T'HH:mm") : "",
      });
      setEditDialogOpen(true);
    }
  };

  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this expense? This action cannot be undone.")) {
      deleteExpense.mutate();
    }
  };

  const onSubmit = (data: EditExpenseData) => {
    updateExpense.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Expense not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/sharewise/groups/${groupId}`)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Expense Details</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Transaction info</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6">
        {/* Expense Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-light text-white">{expense.title}</h2>
              <p className="text-3xl font-semibold text-white mt-2">₹{parseFloat(expense.amount).toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/50 uppercase tracking-widest">Date</p>
                </div>
                <p className="text-sm text-white">{expense.occurredAt ? format(new Date(expense.occurredAt), 'MMM dd, yyyy') : 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/50 uppercase tracking-widest">Category</p>
                </div>
                <p className="text-sm text-white capitalize">{expense.category}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/50 uppercase tracking-widest">Paid By</p>
                </div>
                <p className="text-sm text-white">Member {expense.paidBy.slice(0, 8)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/50 uppercase tracking-widest">Split Type</p>
                </div>
                <p className="text-sm text-white capitalize">{expense.splitType}</p>
              </div>
            </div>

            {expense.notes && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Notes</p>
                <p className="text-sm text-white/80">{expense.notes}</p>
              </div>
            )}

            {expense.attachmentUrl && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Receipt</p>
                {expense.attachmentType === 'image' ? (
                  <div className="bg-white/5 border border-white/10 p-2">
                    <img 
                      src={expense.attachmentUrl} 
                      alt="Receipt" 
                      className="max-w-full h-auto rounded"
                      data-testid="expense-receipt-image"
                    />
                  </div>
                ) : (
                  <a 
                    href={expense.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white underline"
                    data-testid="expense-receipt-pdf"
                  >
                    📄 View PDF Receipt
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Splits */}
        {expense.splits && expense.splits.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">Split Details</h3>
            {expense.splits.map((split: any) => (
              <div
                key={split.id}
                className="border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Member {split.userId.slice(0, 8)}</p>
                    <p className="text-xs text-white/50 mt-1">Share: ₹{parseFloat(split.shareAmount).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">₹{parseFloat(split.owesAmount).toFixed(2)}</p>
                    <p className="text-xs text-white/50">Owes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={handleEditClick}
            className="flex-1 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-12"
            data-testid="button-edit-expense"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={handleDeleteClick}
            disabled={deleteExpense.isPending}
            className="flex-1 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-none h-12"
            data-testid="button-delete-expense"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteExpense.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Expense</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="Expense title"
                        data-testid="input-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="0.00"
                        data-testid="input-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/20">
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occurredAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        className="bg-white/5 border-white/20 text-white"
                        data-testid="input-occurred-at"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="Additional notes (optional)"
                        data-testid="input-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditDialogOpen(false)}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateExpense.isPending}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-save"
                >
                  {updateExpense.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
