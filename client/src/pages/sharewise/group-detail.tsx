import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sharewiseExpenseFormSchema, sharewiseSettlementFormSchema, sharewiseGroupFormSchema, type SharewiseGroup, type SharewiseExpense, type SharewiseGroupMember } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useUrlTab } from "@/hooks/use-url-tab";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  Share2,
  Receipt,
  Clock,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Send,
  Check,
  AlertCircle,
  MoreVertical,
  Eye,
  EyeOff,
  Download,
  Upload,
  Calculator,
  QrCode,
  Link as LinkIcon,
  Copy,
  CheckCircle
} from "lucide-react";
import QRCode from "react-qr-code";

type GroupWithMembers = SharewiseGroup & {
  members: (SharewiseGroupMember & {
    userName?: string;
  })[];
};

type ExpenseWithSplits = SharewiseExpense & {
  splits: Array<{
    id: string;
    userId: string;
    shareAmount: string;
    owesAmount: string;
    paidAmount: string;
    userName?: string;
    sharePercentage?: string | null;
    shareUnits?: number | null;
  }>;
  paidByName?: string;
};

type MemberBalance = {
  userId: string;
  userName: string;
  totalPaid: number;
  totalOwed: number;
  totalExpenses: number;
  netBalance: number;
};

type SettlementSuggestion = {
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  amount: number;
};

type CategoryAnalytics = {
  category: string;
  amount: number;
  count: number;
  percentage: number;
};

type ExpenseFormData = z.infer<typeof sharewiseExpenseFormSchema>;
type SettlementFormData = z.infer<typeof sharewiseSettlementFormSchema>;
type GroupFormData = z.infer<typeof sharewiseGroupFormSchema>;

const COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#6366F1', '#EF4444', '#14B8A6'];

export default function ShareWiseGroupDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/sharewise/groups/:id");
  const [, navigate] = useLocation();
  const groupId = params?.id;
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [hideAmounts, setHideAmounts] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [settleUpOpen, setSettleUpOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithSplits | null>(null);
  const [expenseDetailOpen, setExpenseDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberHistoryOpen, setMemberHistoryOpen] = useState(false);
  const [newMemberUserId, setNewMemberUserId] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; userName: string } | null>(null);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [hiddenMembers, setHiddenMembers] = useState<Set<string>>(new Set());
  const [transactionHiddenMembers, setTransactionHiddenMembers] = useState<Map<string, Set<string>>>(new Map());
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  const { data: group, isLoading: groupLoading } = useQuery<GroupWithMembers>({
    queryKey: ["/api/sharewise/groups", groupId],
    enabled: !!groupId
  });

  const { data: expenses = [] } = useQuery<ExpenseWithSplits[]>({
    queryKey: ["/api/sharewise/groups", groupId, "expenses"],
    enabled: !!groupId
  });

  const { data: balances = [] } = useQuery<MemberBalance[]>({
    queryKey: ["/api/sharewise/groups", groupId, "balances"],
    enabled: !!groupId
  });

  const { data: settlements = [] } = useQuery<SettlementSuggestion[]>({
    queryKey: ["/api/sharewise/groups", groupId, "settlement-suggestions"],
    enabled: !!groupId
  });

  const { data: categoryAnalytics = [] } = useQuery<CategoryAnalytics[]>({
    queryKey: ["/api/sharewise/groups", groupId, "category-analytics"],
    enabled: !!groupId
  });

  const expenseForm = useForm<ExpenseFormData>({
    resolver: zodResolver(sharewiseExpenseFormSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "other",
      notes: "",
      splitType: "equal",
      paidBy: user?.id || "",
      splits: [],
      items: []
    }
  });

  const settlementForm = useForm<SettlementFormData>({
    resolver: zodResolver(sharewiseSettlementFormSchema),
    defaultValues: {
      fromUserId: "",
      toUserId: "",
      amount: "",
      method: "cash",
      notes: ""
    }
  });

  const editGroupForm = useForm<GroupFormData>({
    resolver: zodResolver(sharewiseGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      groupType: "other",
      groupColor: "#8B5CF6",
      currency: "INR",
      groupPhoto: ""
    }
  });

  const splitType = expenseForm.watch("splitType");

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const uploadReceipt = async (file: File): Promise<{ url: string; type: string } | null> => {
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      setUploadingReceipt(true);
      const response = await fetch('/api/sharewise/upload-receipt', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return { url: data.url, type: data.type };
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast({ title: "Upload Error", description: "Failed to upload receipt", variant: "destructive" });
      return null;
    } finally {
      setUploadingReceipt(false);
    }
  };

  const addExpense = useMutation({
    mutationFn: async (data: { expense: any; splits: any[] }) => {
      let attachmentData = {};
      
      // Upload receipt if one was selected
      if (receiptFile) {
        const uploadResult = await uploadReceipt(receiptFile);
        if (uploadResult) {
          attachmentData = {
            attachmentUrl: uploadResult.url,
            attachmentType: uploadResult.type
          };
        }
      }
      
      return await apiRequest("POST", `/api/sharewise/groups/${groupId}/expenses`, {
        expense: {
          ...data.expense,
          ...attachmentData
        },
        splits: data.splits
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups", groupId] });
      toast({ title: "Expense Added", description: "The expense has been added successfully" });
      setAddExpenseOpen(false);
      expenseForm.reset();
      setReceiptFile(null);
      setReceiptPreview(null);
      navigate("/sharewise/groups");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add expense", variant: "destructive" });
    }
  });

  const recordSettlement = useMutation({
    mutationFn: async (data: SettlementFormData) => {
      return await apiRequest("POST", `/api/sharewise/groups/${groupId}/settlements`, {
        ...data,
        groupId: groupId,
        createdBy: user?.id,
        currency: group?.currency || "INR"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups", groupId] });
      toast({ title: "Settlement Recorded", description: "Payment has been recorded" });
      setSettleUpOpen(false);
      settlementForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to record settlement", variant: "destructive" });
    }
  });

  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("POST", `/api/sharewise/groups/${groupId}/members`, {
        userId,
        role: "member"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups", groupId] });
      toast({ title: "Member Added", description: "New member has been added to the group" });
      setNewMemberUserId("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    }
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("DELETE", `/api/sharewise/groups/${groupId}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups", groupId] });
      toast({ title: "Member Removed", description: "Member has been removed from the group" });
      setRemoveMemberDialogOpen(false);
      setMemberToRemove(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
    }
  });

  const leaveGroup = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/sharewise/groups/${groupId}/members/${user?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      toast({ title: "Left Group", description: "You have left the group successfully" });
      navigate("/sharewise/groups");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to leave group", variant: "destructive" });
    }
  });

  const updateGroup = useMutation({
    mutationFn: async (data: GroupFormData) => {
      return await apiRequest("PATCH", `/api/sharewise/groups/${groupId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups", groupId] });
      toast({ title: "Group Updated", description: "Group has been updated successfully" });
      setEditGroupOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update group", variant: "destructive" });
    }
  });

  const deleteExpense = useMutation({
    mutationFn: async (expenseId: string) => {
      return await apiRequest("DELETE", `/api/sharewise/expenses/${expenseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups", groupId] });
      toast({ title: "Expense Deleted", description: "The expense has been deleted" });
      setExpenseDetailOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete expense", variant: "destructive" });
    }
  });

  const deleteGroup = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/sharewise/groups/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      toast({ title: "Group Deleted", description: "The group has been deleted successfully" });
      navigate("/sharewise/groups");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete group", variant: "destructive" });
    }
  });

  const onEditGroupSubmit = (data: GroupFormData) => {
    updateGroup.mutate(data);
  };

  const onExpenseSubmit = (data: ExpenseFormData) => {
    const { splits, items, ...expenseData } = data;
    const totalAmount = parseFloat(data.amount);
    const allMembers = group?.members || [];
    const members = allMembers.filter(m => selectedMembers.has(m.userId));
    
    // Validate that at least one member is selected
    if (members.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select at least one member to split the expense with",
        variant: "destructive"
      });
      return;
    }
    
    // Validate splits for non-equal types
    if (data.splitType === "exact") {
      if (!splits || splits.length === 0 || splits.length !== members.length) {
        toast({
          title: "Invalid Split",
          description: "Please configure split amounts for all members",
          variant: "destructive"
        });
        return;
      }
      
      // Check for empty or invalid values (must be strictly positive)
      const hasInvalidValues = splits.some(split => !split.shareAmount || isNaN(parseFloat(split.shareAmount)) || parseFloat(split.shareAmount) <= 0);
      if (hasInvalidValues) {
        toast({
          title: "Invalid Split",
          description: "Please enter valid amounts for all members (must be positive numbers greater than zero)",
          variant: "destructive"
        });
        return;
      }
      
      const splitTotal = splits.reduce((sum, split) => sum + parseFloat(split.shareAmount || "0"), 0);
      if (Math.abs(splitTotal - totalAmount) > 0.01) {
        toast({
          title: "Invalid Split",
          description: `Split amounts (₹${splitTotal.toFixed(2)}) must equal total (₹${totalAmount.toFixed(2)})`,
          variant: "destructive"
        });
        return;
      }
    }
    
    if (data.splitType === "percentage") {
      if (!splits || splits.length === 0 || splits.length !== members.length) {
        toast({
          title: "Invalid Split",
          description: "Please configure percentages for all members",
          variant: "destructive"
        });
        return;
      }
      
      // Check for empty or invalid values (must be strictly positive)
      const hasInvalidValues = splits.some(split => !split.sharePercentage || isNaN(parseFloat(split.sharePercentage)) || parseFloat(split.sharePercentage) <= 0);
      if (hasInvalidValues) {
        toast({
          title: "Invalid Split",
          description: "Please enter valid percentages for all members (must be positive numbers greater than zero)",
          variant: "destructive"
        });
        return;
      }
      
      const percentageTotal = splits.reduce((sum, split) => sum + parseFloat(split.sharePercentage || "0"), 0);
      if (Math.abs(percentageTotal - 100) > 0.01) {
        toast({
          title: "Invalid Split",
          description: `Percentages must total 100% (currently ${percentageTotal.toFixed(1)}%)`,
          variant: "destructive"
        });
        return;
      }
    }
    
    if (data.splitType === "shares") {
      if (!splits || splits.length === 0 || splits.length !== members.length) {
        toast({
          title: "Invalid Split",
          description: "Please configure share counts for all members",
          variant: "destructive"
        });
        return;
      }
      
      // Check for empty or invalid values (must be strictly positive)
      const hasInvalidValues = splits.some(split => {
        const units = Number(split.shareUnits);
        return split.shareUnits === undefined || isNaN(units) || units <= 0;
      });
      if (hasInvalidValues) {
        toast({
          title: "Invalid Split",
          description: "Please enter valid share counts for all members (must be positive numbers greater than zero)",
          variant: "destructive"
        });
        return;
      }
      
      const totalShares = splits.reduce((sum, split) => sum + Number(split.shareUnits || 0), 0);
      if (totalShares <= 0) {
        toast({
          title: "Invalid Split",
          description: "Total shares must be greater than zero",
          variant: "destructive"
        });
        return;
      }
    }
    
    let formattedSplits;
    
    // Calculate splits based on split type
    if (data.splitType === "equal") {
      // Equal split: divide equally among all members
      const sharePerMember = totalAmount / members.length;
      formattedSplits = members.map(member => ({
        expenseId: "",
        userId: member.userId,
        shareAmount: sharePerMember.toFixed(2),
        sharePercentage: null,
        shareUnits: null,
        paidAmount: member.userId === data.paidBy ? data.amount : "0",
        owesAmount: member.userId === data.paidBy ? "0" : sharePerMember.toFixed(2)
      }));
    } else if (data.splitType === "exact" && splits && splits.length > 0) {
      // Exact amounts: use provided amounts
      formattedSplits = splits.map(split => ({
        expenseId: "",
        userId: split.userId,
        shareAmount: split.shareAmount || "0",
        sharePercentage: null,
        shareUnits: null,
        paidAmount: split.userId === data.paidBy ? data.amount : "0",
        owesAmount: split.userId === data.paidBy ? "0" : (split.shareAmount || "0")
      }));
    } else if (data.splitType === "percentage" && splits && splits.length > 0) {
      // Percentage: calculate amount based on percentage
      formattedSplits = splits.map(split => {
        const percentage = parseFloat(split.sharePercentage || "0");
        const shareAmount = (totalAmount * percentage / 100).toFixed(2);
        return {
          expenseId: "",
          userId: split.userId,
          shareAmount,
          sharePercentage: split.sharePercentage,
          shareUnits: null,
          paidAmount: split.userId === data.paidBy ? data.amount : "0",
          owesAmount: split.userId === data.paidBy ? "0" : shareAmount
        };
      });
    } else if (data.splitType === "shares" && splits && splits.length > 0) {
      // Shares: calculate amount based on share units
      const totalShares = splits.reduce((sum, split) => sum + Number(split.shareUnits || 0), 0);
      const amountPerShare = totalShares > 0 ? totalAmount / totalShares : 0;
      formattedSplits = splits.map(split => {
        const shareAmount = (Number(split.shareUnits || 0) * amountPerShare).toFixed(2);
        return {
          expenseId: "",
          userId: split.userId,
          shareAmount,
          sharePercentage: null,
          shareUnits: split.shareUnits,
          paidAmount: split.userId === data.paidBy ? data.amount : "0",
          owesAmount: split.userId === data.paidBy ? "0" : shareAmount
        };
      });
    } else {
      // Default to equal split
      const sharePerMember = totalAmount / members.length;
      formattedSplits = members.map(member => ({
        expenseId: "",
        userId: member.userId,
        shareAmount: sharePerMember.toFixed(2),
        sharePercentage: null,
        shareUnits: null,
        paidAmount: member.userId === data.paidBy ? data.amount : "0",
        owesAmount: member.userId === data.paidBy ? "0" : sharePerMember.toFixed(2)
      }));
    }

    addExpense.mutate({
      expense: expenseData,
      splits: formattedSplits
    });
  };

  const onSettlementSubmit = (data: SettlementFormData) => {
    recordSettlement.mutate(data);
  };

  const handleViewExpense = (expense: ExpenseWithSplits) => {
    setSelectedExpense(expense);
    setHiddenMembers(new Set());
    setExpenseDetailOpen(true);
  };

  const toggleMemberVisibility = (userId: string) => {
    setHiddenMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const getRecalculatedSplits = (expense: ExpenseWithSplits) => {
    if (!expense) return [];
    
    const visibleSplits = expense.splits.filter(split => !hiddenMembers.has(split.userId));
    const hiddenSplits = expense.splits.filter(split => hiddenMembers.has(split.userId));
    
    if (visibleSplits.length === 0 || hiddenMembers.size === 0) {
      return expense.splits;
    }
    
    const totalHiddenAmount = hiddenSplits.reduce((sum, split) => sum + parseFloat(split.shareAmount), 0);
    const redistributedPerMember = totalHiddenAmount / visibleSplits.length;
    
    return expense.splits.map(split => {
      if (hiddenMembers.has(split.userId)) {
        return split;
      }
      return {
        ...split,
        shareAmount: (parseFloat(split.shareAmount) + redistributedPerMember).toFixed(2)
      };
    });
  };

  const toggleTransactionMemberVisibility = (expenseId: string, userId: string) => {
    setTransactionHiddenMembers(prev => {
      const newMap = new Map(prev);
      const currentHidden = newMap.get(expenseId) || new Set();
      const newSet = new Set(currentHidden);
      
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      
      if (newSet.size === 0) {
        newMap.delete(expenseId);
      } else {
        newMap.set(expenseId, newSet);
      }
      
      return newMap;
    });
  };

  const getTransactionRecalculatedSplits = (expense: ExpenseWithSplits) => {
    if (!expense) return [];
    
    const hiddenSet = transactionHiddenMembers.get(expense.id) || new Set();
    const visibleSplits = expense.splits.filter(split => !hiddenSet.has(split.userId));
    const hiddenSplits = expense.splits.filter(split => hiddenSet.has(split.userId));
    
    if (visibleSplits.length === 0 || hiddenSet.size === 0) {
      return expense.splits;
    }
    
    const totalHiddenAmount = hiddenSplits.reduce((sum, split) => sum + parseFloat(split.shareAmount), 0);
    const redistributedPerMember = totalHiddenAmount / visibleSplits.length;
    
    return expense.splits.map(split => {
      if (hiddenSet.has(split.userId)) {
        return split;
      }
      return {
        ...split,
        shareAmount: (parseFloat(split.shareAmount) + redistributedPerMember).toFixed(2)
      };
    });
  };

  const handleViewMemberHistory = (userId: string) => {
    setSelectedMember(userId);
    setMemberHistoryOpen(true);
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/sharewise/join/${group?.inviteCode || groupId}`;
    navigator.clipboard.writeText(inviteUrl);
    setLinkCopied(true);
    toast({
      title: "Link Copied",
      description: "Group invite link copied to clipboard"
    });
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (groupLoading || !group) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const yourBalance = balances.find(b => b.userId === user?.id)?.netBalance || 0;
  const totalPayable = yourBalance < 0 ? Math.abs(yourBalance) : 0;
  const totalReceivable = yourBalance > 0 ? yourBalance : 0;
  const memberExpenses = expenses.filter(exp => selectedMember && (exp.paidBy === selectedMember || exp.splits.some(s => s.userId === selectedMember)));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sharewise/groups")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider truncate" data-testid="text-group-name">{group.name}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{group.members.length} members</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-share-qr"
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-copy-link"
            >
              {linkCopied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (group) {
                  editGroupForm.reset({
                    name: group.name,
                    description: group.description || "",
                    groupType: (group.groupType || "other") as any,
                    groupColor: group.groupColor || "#8B5CF6",
                    currency: group.currency || "INR",
                    groupPhoto: group.groupPhoto || ""
                  });
                  setEditGroupOpen(true);
                }
              }}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-edit-group"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Group Stats Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="group-stats">
          {/* Key Metric - Total Spending */}
          <div className="text-center pb-6 mb-6 border-b border-white/20">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Total Spending</p>
            <p className="text-5xl font-light text-white">
              {hideAmounts ? "₹••••" : `₹${(totalExpenses / 1000).toFixed(1)}K`}
            </p>
          </div>
          
          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Payable</p>
              <p className="text-xl font-light text-red-400">
                {hideAmounts ? "₹••••" : `₹${(totalPayable / 1000).toFixed(1)}K`}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Receivable</p>
              <p className="text-xl font-light text-green-400">
                {hideAmounts ? "₹••••" : `₹${(totalReceivable / 1000).toFixed(1)}K`}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Transactions</p>
              <p className="text-xl font-light text-white">{expenses.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Members</p>
              <p className="text-xl font-light text-white">{group.members.length}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => {
              setSelectedMembers(new Set(group.members.map(m => m.userId)));
              setAddExpenseOpen(true);
            }}
            className="bg-white text-black hover:bg-white/90 rounded-none h-10 flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-xs"
            data-testid="button-add-expense"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
          <Button
            onClick={() => setSettleUpOpen(true)}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 flex items-center justify-center gap-2 border border-white/10 font-semibold uppercase tracking-wider text-xs"
            data-testid="button-settle-up"
          >
            <DollarSign className="h-4 w-4" />
            <span>Settle</span>
          </Button>
          <Button
            onClick={() => setManageMembersOpen(true)}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 flex items-center justify-center gap-2 border border-white/10 font-semibold uppercase tracking-wider text-xs"
            data-testid="button-manage-members"
          >
            <Users className="h-4 w-4" />
            <span>Members</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-members">Members</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Recent Expenses</h3>
            </div>

            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5">
                <Receipt className="h-12 w-12 text-white/40 mb-4" />
                <p className="text-white/60">No expenses yet</p>
                <p className="text-white/40 text-sm">Add your first expense to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 10).map((expense) => (
                  <div
                    key={expense.id}
                    className="border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => handleViewExpense(expense)}
                    data-testid={`expense-${expense.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-light text-white text-sm">{expense.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest capitalize">{expense.category}</p>
                          <span className="text-white/50">•</span>
                          <p className="text-[10px] text-white/50">Paid by {expense.paidByName || expense.paidBy.slice(0, 8)}</p>
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">{expense.occurredAt ? new Date(expense.occurredAt).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-light text-white">{hideAmounts ? "₹•••" : `₹${parseFloat(expense.amount).toFixed(2)}`}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">{expense.currency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Members & Balances</h3>
              <Button
                onClick={() => setManageMembersOpen(true)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-none text-xs"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Add Member
              </Button>
            </div>

            <div className="space-y-3">
              {balances.map((balance) => {
                const memberExpenseCount = expenses.filter(exp => 
                  exp.paidBy === balance.userId || exp.splits.some(s => s.userId === balance.userId)
                ).length;
                
                return (
                  <div
                    key={balance.userId}
                    className="border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all"
                    data-testid={`member-${balance.userId}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                          <span className="text-base font-medium">{balance.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-light text-white text-base">{balance.userName || `User ${balance.userId.slice(0, 8)}`}</h4>
                            {group.createdBy === balance.userId && (
                              <span className="text-[10px] px-2 py-0.5 bg-white/10 border border-white/20 text-white/60 uppercase tracking-wider">Owner</span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/40 mt-1">{memberExpenseCount} {memberExpenseCount === 1 ? 'expense' : 'expenses'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-light ${balance.netBalance > 0 ? 'text-green-400' : balance.netBalance < 0 ? 'text-red-400' : 'text-white'}`}>
                          {hideAmounts ? "₹••••" : `₹${Math.abs(balance.netBalance).toFixed(0)}`}
                        </p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">
                          {balance.netBalance > 0 ? "Gets back" : balance.netBalance < 0 ? "Owes" : "Settled"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Paid</p>
                        <p className="text-sm font-medium text-white">{hideAmounts ? "₹•••" : `₹${balance.totalPaid.toFixed(0)}`}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Share</p>
                        <p className="text-sm font-medium text-white">{hideAmounts ? "₹•••" : `₹${balance.totalOwed.toFixed(0)}`}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Expenses</p>
                        <p className="text-sm font-medium text-white">{balance.totalExpenses}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                      <Button
                        onClick={() => handleViewMemberHistory(balance.userId)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 bg-white/10 text-white hover:bg-white/20 rounded-none h-9 text-xs flex items-center justify-center"
                        data-testid={`button-view-history-${balance.userId}`}
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        View History
                      </Button>
                      {user?.id === balance.userId ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeaveGroupDialogOpen(true);
                          }}
                          size="sm"
                          className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-none h-9 text-xs flex items-center justify-center"
                          data-testid={`button-leave-${balance.userId}`}
                        >
                          <UserMinus className="h-3 w-3 mr-1" />
                          Leave
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMemberToRemove({ userId: balance.userId, userName: balance.userName });
                            setRemoveMemberDialogOpen(true);
                          }}
                          size="sm"
                          className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-none h-9 text-xs flex items-center justify-center"
                          data-testid={`button-remove-${balance.userId}`}
                        >
                          <UserMinus className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">All Transactions</h3>
            </div>

            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5">
                <Clock className="h-12 w-12 text-white/40 mb-4" />
                <p className="text-white/60">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const hiddenSet = transactionHiddenMembers.get(expense.id) || new Set();
                  const recalculatedSplits = getTransactionRecalculatedSplits(expense);
                  const visibleCount = expense.splits.filter(s => !hiddenSet.has(s.userId)).length;
                  
                  return (
                    <div
                      key={expense.id}
                      className="border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all"
                      data-testid={`transaction-${expense.id}`}
                    >
                      <div className="space-y-3">
                        <div 
                          className="flex items-start justify-between cursor-pointer"
                          onClick={() => handleViewExpense(expense)}
                        >
                          <div className="flex-1">
                            <h4 className="font-light text-white text-sm">{expense.title}</h4>
                            <p className="text-[10px] text-white/40 mt-1">{expense.occurredAt ? new Date(expense.occurredAt).toLocaleString() : "N/A"}</p>
                          </div>
                          <p className="text-lg font-light text-white">{hideAmounts ? "₹•••" : `₹${parseFloat(expense.amount).toFixed(2)}`}</p>
                        </div>
                        
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-[10px] text-white/50 mb-2 uppercase tracking-widest">
                            Split Among {visibleCount} Members
                            {hiddenSet.size > 0 && <span className="text-white/40"> ({hiddenSet.size} hidden)</span>}
                          </p>
                          <div className="space-y-2">
                            {recalculatedSplits.map((split) => {
                              const isHidden = hiddenSet.has(split.userId);
                              return (
                                <div 
                                  key={split.id}
                                  className={`flex items-center justify-between bg-white/5 border border-white/10 px-3 py-2 transition-all ${isHidden ? 'opacity-40' : ''}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTransactionMemberVisibility(expense.id, split.userId);
                                      }}
                                      className="p-0 h-6 w-6 hover:bg-white/10 rounded-none"
                                      data-testid={`button-toggle-transaction-member-${expense.id}-${split.userId}`}
                                    >
                                      {isHidden ? <Eye className="h-3 w-3 text-white/60" /> : <EyeOff className="h-3 w-3 text-white/60" />}
                                    </Button>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                                      <span className="text-xs font-medium">{split.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                                    </div>
                                    <span className="text-xs text-white font-light">{split.userName || split.userId.slice(0, 8)}</span>
                                  </div>
                                  <span className={`text-sm font-light ${isHidden ? 'line-through text-white/40' : 'text-white'}`}>
                                    {hideAmounts ? "₹••" : `₹${parseFloat(split.shareAmount).toFixed(0)}`}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Total Expenses</p>
                <p className="text-2xl font-light text-white">{expenses.length}</p>
              </div>
              <div className="border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Avg per Expense</p>
                <p className="text-2xl font-light text-white">
                  {hideAmounts ? "₹•••" : expenses.length > 0 ? `₹${(expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0) / expenses.length).toFixed(0)}` : "₹0"}
                </p>
              </div>
            </div>

            {/* Category-wise Spending */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Spending by Category</h3>
              
              {categoryAnalytics.length > 0 ? (
                <>
                  {/* Category Bar Chart */}
                  <div className="bg-white/5 border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={categoryAnalytics} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                        <YAxis dataKey="category" type="category" stroke="rgba(255,255,255,0.5)" width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                          formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Amount']}
                        />
                        <Bar dataKey="amount" fill="#ffffff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Detailed Category Breakdown */}
                  <div className="space-y-2">
                    {categoryAnalytics.map((cat) => (
                      <div key={cat.category} className="border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base capitalize font-light text-white">{cat.category}</span>
                          <span className="text-xl font-light text-white">{hideAmounts ? "₹•••" : `₹${cat.amount.toFixed(0)}`}</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 mb-3">
                          <div className="bg-white h-2" style={{ width: `${cat.percentage}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Expenses</p>
                            <p className="text-white font-medium">{cat.count}</p>
                          </div>
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Percentage</p>
                            <p className="text-white font-medium">{cat.percentage.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Avg/Expense</p>
                            <p className="text-white font-medium">{hideAmounts ? "₹•••" : `₹${(cat.amount / cat.count).toFixed(0)}`}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5">
                  <BarChart className="h-12 w-12 text-white/40 mb-4" />
                  <p className="text-white/60">No category data</p>
                </div>
              )}
            </div>

            {/* Member-wise Spending */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Spending by Member</h3>
              
              {balances.length > 0 ? (
                <>
                  {/* Member Bar Chart */}
                  <div className="bg-white/5 border border-white/10 p-4">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={balances}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="userName" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                          formatter={(value: number) => [`₹${value.toFixed(0)}`, '']}
                        />
                        <Legend wrapperStyle={{ color: '#fff' }} />
                        <Bar dataKey="totalPaid" fill="#ffffff" name="Paid" />
                        <Bar dataKey="totalOwed" fill="#666666" name="Share" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Detailed Member Breakdown */}
                  <div className="space-y-2">
                    {balances.map((balance) => (
                      <div key={balance.userId} className="border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                              <span className="text-sm font-medium">{balance.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                            </div>
                            <span className="text-base font-light text-white">{balance.userName || `User ${balance.userId.slice(0, 8)}`}</span>
                          </div>
                          <span className={`text-xl font-light ${balance.netBalance > 0 ? 'text-white' : balance.netBalance < 0 ? 'text-white/60' : 'text-white/40'}`}>
                            {balance.netBalance > 0 ? '+' : ''}{hideAmounts ? "₹•••" : `₹${balance.netBalance.toFixed(0)}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-xs">
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Paid</p>
                            <p className="text-white font-medium">{hideAmounts ? "₹•••" : `₹${balance.totalPaid.toFixed(0)}`}</p>
                          </div>
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Share</p>
                            <p className="text-white font-medium">{hideAmounts ? "₹•••" : `₹${balance.totalOwed.toFixed(0)}`}</p>
                          </div>
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Expenses</p>
                            <p className="text-white font-medium">{balance.totalExpenses}</p>
                          </div>
                          <div>
                            <p className="text-white/50 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-white font-medium">{balance.netBalance > 0 ? 'Gets' : balance.netBalance < 0 ? 'Owes' : 'Even'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5">
                  <BarChart className="h-12 w-12 text-white/40 mb-4" />
                  <p className="text-white/60">No member data</p>
                </div>
              )}
            </div>

            {/* Expense Distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Expense Distribution</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Highest Expense</p>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹•••" : expenses.length > 0 ? `₹${Math.max(...expenses.map(e => parseFloat(e.amount))).toFixed(0)}` : "₹0"}
                  </p>
                </div>
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Lowest Expense</p>
                  <p className="text-xl font-light text-white">
                    {hideAmounts ? "₹•••" : expenses.length > 0 ? `₹${Math.min(...expenses.map(e => parseFloat(e.amount))).toFixed(0)}` : "₹0"}
                  </p>
                </div>
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Most Active Member</p>
                  <p className="text-sm font-light text-white">
                    {balances.length > 0 ? balances.reduce((max, b) => b.totalExpenses > max.totalExpenses ? b : max).userName : 'N/A'}
                  </p>
                </div>
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Top Category</p>
                  <p className="text-sm font-light text-white capitalize">
                    {categoryAnalytics.length > 0 ? categoryAnalytics[0].category : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Expense Dialog - Full Screen */}
      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Create a new expense for the group</DialogDescription>
          </DialogHeader>
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddExpenseOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">ADD EXPENSE</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Split among members</p>
              </div>
              <div className="w-9" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <Form {...expenseForm}>
              <form id="add-expense-form" onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-0"
              >
                <div className="px-4 py-6 space-y-6">
                  {/* Basic Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">Basic Details</h3>
                    <FormField
                      control={expenseForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Description *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Dinner at restaurant" className="bg-white/5 border-white/10 text-white rounded-none h-11" data-testid="input-expense-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={expenseForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Amount *</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white rounded-none h-11" data-testid="input-expense-amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-11" data-testid="select-category">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black border-white/10">
                                <SelectItem value="groceries">Groceries</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="food">Food & Dining</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="accommodation">Accommodation</SelectItem>
                                <SelectItem value="housing">Housing</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={expenseForm.control}
                      name="paidBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Paid By *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-11" data-testid="select-paid-by">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10">
                              {group.members.map((member) => (
                                <SelectItem key={member.userId} value={member.userId}>
                                  {member.userName || `User ${member.userId.slice(0, 8)}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Member Selection Section */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">Select Members</h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMembers(new Set(group.members.map(m => m.userId)))}
                          className="text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
                          data-testid="button-select-all-members"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMembers(new Set())}
                          className="text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8"
                          data-testid="button-deselect-all-members"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {group.members.map((member) => {
                        const isSelected = selectedMembers.has(member.userId);
                        return (
                          <div
                            key={member.userId}
                            onClick={() => {
                              const newSet = new Set(selectedMembers);
                              if (isSelected) {
                                newSet.delete(member.userId);
                              } else {
                                newSet.add(member.userId);
                              }
                              setSelectedMembers(newSet);
                            }}
                            className={`flex items-center gap-3 p-3 border border-white/10 cursor-pointer transition-all ${
                              isSelected ? 'bg-white/10 border-white/20' : 'bg-white/5 hover:bg-white/8'
                            }`}
                            data-testid={`member-checkbox-${member.userId}`}
                          >
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              isSelected ? 'bg-white border-white' : 'border-white/40'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-black" />}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                              <span className="text-sm font-medium">{member.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                            </div>
                            <span className="text-sm text-white font-light">{member.userName || `User ${member.userId.slice(0, 8)}`}</span>
                          </div>
                        );
                      })}
                    </div>
                    {selectedMembers.size === 0 && (
                      <p className="text-xs text-red-400">Please select at least one member to split the expense with</p>
                    )}
                    {selectedMembers.size > 0 && (
                      <p className="text-xs text-white/50">{selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} selected</p>
                    )}
                  </div>

                  {/* Split Configuration Section */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">Split Configuration</h3>
                    <FormField
                      control={expenseForm.control}
                      name="splitType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Split Method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-11" data-testid="select-split-type">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10">
                              <SelectItem value="equal">Split Equally</SelectItem>
                              <SelectItem value="exact">Exact Amounts</SelectItem>
                              <SelectItem value="percentage">By Percentage</SelectItem>
                              <SelectItem value="shares">By Shares</SelectItem>
                              <SelectItem value="itemized">Itemized</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Split Details */}
                    {splitType !== "equal" && splitType !== "itemized" && (
                      <div className="space-y-3 border border-white/10 bg-white/5 p-4 rounded">
                        <p className="text-xs text-white/50 uppercase tracking-widest">
                          {splitType === "exact" && "Enter exact amount for each selected member"}
                          {splitType === "percentage" && "Enter percentage for each selected member (must total 100%)"}
                          {splitType === "shares" && "Enter shares for each selected member"}
                        </p>
                        {group.members.filter(m => selectedMembers.has(m.userId)).map((member, index) => (
                          <div key={member.userId} className="flex items-center gap-3">
                            <span className="text-sm text-white flex-1">{member.userName || `User ${member.userId.slice(0, 8)}`}</span>
                            {splitType === "exact" && (
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => {
                                  const splits = expenseForm.getValues("splits") || [];
                                  const newSplits = [...splits];
                                  newSplits[index] = {
                                    ...newSplits[index],
                                    userId: member.userId,
                                    shareAmount: e.target.value
                                  };
                                  expenseForm.setValue("splits", newSplits);
                                }}
                                className="bg-white/5 border-white/10 text-white rounded-none h-10 w-32"
                                data-testid={`input-split-amount-${index}`}
                              />
                            )}
                            {splitType === "percentage" && (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  step="1"
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  onChange={(e) => {
                                    const splits = expenseForm.getValues("splits") || [];
                                    const newSplits = [...splits];
                                    newSplits[index] = {
                                      ...newSplits[index],
                                      userId: member.userId,
                                      sharePercentage: e.target.value
                                    };
                                    expenseForm.setValue("splits", newSplits);
                                  }}
                                  className="bg-white/5 border-white/10 text-white rounded-none h-10 w-24"
                                  data-testid={`input-split-percentage-${index}`}
                                />
                                <span className="text-white/60">%</span>
                              </div>
                            )}
                            {splitType === "shares" && (
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                placeholder="0"
                                onChange={(e) => {
                                  const splits = expenseForm.getValues("splits") || [];
                                  const newSplits = [...splits];
                                  newSplits[index] = {
                                    ...newSplits[index],
                                    userId: member.userId,
                                    shareUnits: parseInt(e.target.value) || 0
                                  };
                                  expenseForm.setValue("splits", newSplits);
                                }}
                                className="bg-white/5 border-white/10 text-white rounded-none h-10 w-24"
                                data-testid={`input-split-shares-${index}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Details Section */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">Additional Details</h3>
                    <FormField
                      control={expenseForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ""} placeholder="Add any additional details..." className="bg-white/5 border-white/10 text-white resize-none rounded-none" rows={3} data-testid="input-expense-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Receipt Upload */}
                    <div className="space-y-3">
                      <label className="text-xs text-white/50 uppercase tracking-widest block">Receipt/Proof of Purchase (Optional)</label>
                      
                      {!receiptFile ? (
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleReceiptChange}
                            className="bg-white/5 border-white/10 text-white rounded-none h-16 file:mr-4 file:px-4 file:py-2 file:rounded-none file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-white/90"
                            data-testid="input-receipt-upload"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {receiptPreview ? (
                            <div className="border border-white/10 bg-white/5 p-4 rounded-none">
                              <img src={receiptPreview} alt="Receipt preview" className="max-h-64 w-full object-contain" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-sm text-white/80 bg-white/5 p-4 border border-white/10">
                              <Upload className="h-5 w-5 text-white/60" />
                              <p className="flex-1 truncate">{receiptFile.name}</p>
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setReceiptFile(null);
                              setReceiptPreview(null);
                            }}
                            className="w-full border border-white/10 text-white/60 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 rounded-none h-10 text-xs"
                            data-testid="button-remove-receipt"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Receipt
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Padding for fixed footer */}
                  <div className="h-20" />
                </div>
              </form>
            </Form>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t border-white/10 bg-black p-4">
            <Button 
              type="submit" 
              form="add-expense-form"
              disabled={addExpense.isPending || uploadingReceipt} 
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-semibold uppercase tracking-wider"
              data-testid="button-submit-add-expense"
            >
              {uploadingReceipt ? "Uploading..." : addExpense.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settle Up Dialog */}
      <Dialog open={settleUpOpen} onOpenChange={setSettleUpOpen}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-wider uppercase">Settle Up</DialogTitle>
            <DialogDescription className="text-xs text-white/50 uppercase tracking-widest font-light">Pay via UPI</DialogDescription>
          </DialogHeader>

          <Form {...settlementForm}>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formValues = settlementForm.getValues();
              const amount = parseFloat(formValues.amount);
              
              if (!amount || amount <= 0) {
                toast({
                  title: "Invalid Amount",
                  description: "Please enter a valid amount",
                  variant: "destructive"
                });
                return;
              }

              const fromMember = group.members.find(m => m.userId === formValues.fromUserId);
              const toMember = group.members.find(m => m.userId === formValues.toUserId);
              
              const paymentParams = new URLSearchParams({
                amount: amount.toString(),
                transactionType: 'sharewise-settlement',
                groupId: group.id,
                fromUserId: formValues.fromUserId,
                toUserId: formValues.toUserId,
                fromUserName: fromMember?.userName || 'User',
                toUserName: toMember?.userName || 'User',
                groupName: group.name,
                returnUrl: `/sharewise/group/${group.id}`
              });
              
              navigate(`/upi-payment?${paymentParams.toString()}`);
            }} className="space-y-5 pt-2">
              <FormField
                control={settlementForm.control}
                name="fromUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50 uppercase tracking-widest">From (Payer)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-settlement-from">
                          <SelectValue placeholder="Select payer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/10">
                        {group.members.map((member) => (
                          <SelectItem key={member.userId} value={member.userId}>{member.userName || `User ${member.userId.slice(0, 8)}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={settlementForm.control}
                name="toUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50 uppercase tracking-widest">To (Receiver)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-settlement-to">
                          <SelectValue placeholder="Select receiver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/10">
                        {group.members.map((member) => (
                          <SelectItem key={member.userId} value={member.userId}>{member.userName || `User ${member.userId.slice(0, 8)}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={settlementForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Amount (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00"
                        className="bg-white/5 border-white/10 text-white rounded-none h-12 text-lg"
                        data-testid="input-settlement-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSettleUpOpen(false)} 
                  className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none h-12"
                  data-testid="button-cancel-settlement"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-12 font-semibold uppercase tracking-wider"
                  data-testid="button-pay-settlement"
                >
                  Pay ₹{settlementForm.watch('amount') || '0'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Manage Members Dialog - Full Screen */}
      <Dialog open={manageMembersOpen} onOpenChange={setManageMembersOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Manage Members</DialogTitle>
            <DialogDescription>Add or remove group members</DialogDescription>
          </DialogHeader>
          
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setManageMembersOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">MANAGE MEMBERS</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{group.members.length} members in this group</p>
              </div>
              <div className="w-9" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              {/* Current Members Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Current Members</h3>
                <div className="space-y-3">
                  {balances.map((balance) => {
                    const member = group.members.find(m => m.userId === balance.userId);
                    const isOwner = group.createdBy === balance.userId;
                    
                    return (
                      <div key={balance.userId} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                              <span className="text-base font-medium">{balance.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-light text-white text-base">{balance.userName || `User ${balance.userId.slice(0, 8)}`}</h4>
                                {isOwner && (
                                  <span className="text-[10px] px-2 py-0.5 bg-white/10 border border-white/20 text-white/60 uppercase tracking-wider">Owner</span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/40 mt-1 capitalize">{member?.role || "member"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-light ${balance.netBalance > 0 ? 'text-green-400' : balance.netBalance < 0 ? 'text-red-400' : 'text-white'}`}>
                              {hideAmounts ? "₹••••" : `₹${Math.abs(balance.netBalance).toFixed(0)}`}
                            </p>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">
                              {balance.netBalance > 0 ? "Gets back" : balance.netBalance < 0 ? "Owes" : "Settled"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Paid</p>
                            <p className="text-sm font-medium text-white">{hideAmounts ? "₹•••" : `₹${balance.totalPaid.toFixed(0)}`}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Share</p>
                            <p className="text-sm font-medium text-white">{hideAmounts ? "₹•••" : `₹${balance.totalOwed.toFixed(0)}`}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Expenses</p>
                            <p className="text-sm font-medium text-white">{balance.totalExpenses}</p>
                          </div>
                        </div>

                        {!isOwner && user?.id !== balance.userId && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setMemberToRemove({ userId: balance.userId, userName: balance.userName || `User ${balance.userId.slice(0, 8)}` });
                              setRemoveMemberDialogOpen(true);
                            }}
                            className="w-full mt-3 border-t border-white/10 bg-red-600 text-white hover:bg-red-700 rounded-none h-10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            Remove Member
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Add New Member Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Add New Member</h3>
                <p className="text-xs text-white/40">Share the group link or invite code to add members</p>
                <div className="flex gap-3">
                  <Input
                    value={newMemberUserId}
                    onChange={(e) => setNewMemberUserId(e.target.value)}
                    placeholder="Enter user ID or phone"
                    className="bg-white/5 border-white/10 text-white rounded-none h-12 flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newMemberUserId.trim()) {
                        addMember.mutate(newMemberUserId.trim());
                      }
                    }}
                    disabled={!newMemberUserId.trim() || addMember.isPending}
                    className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 font-semibold uppercase tracking-wider"
                  >
                    {addMember.isPending ? "..." : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Button */}
          <div className="flex-shrink-0 border-t border-white/10 bg-black p-4">
            <Button
              onClick={() => setManageMembersOpen(false)}
              className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-12 font-semibold uppercase tracking-wider border border-white/10"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Detail Dialog - Full Screen */}
      <Dialog open={expenseDetailOpen} onOpenChange={setExpenseDetailOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>View expense information and split details</DialogDescription>
          </DialogHeader>
          
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpenseDetailOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">EXPENSE DETAILS</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">View information & split</p>
              </div>
              <div className="w-9" />
            </div>
          </div>

          {/* Scrollable Content */}
          {selectedExpense && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-6 space-y-6">
                {/* Expense Header Card */}
                <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-light text-white">{selectedExpense.title}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-light text-white">{hideAmounts ? "₹••••" : `₹${parseFloat(selectedExpense.amount).toFixed(0)}`}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{selectedExpense.currency}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Category</p>
                      <p className="text-base text-white font-light capitalize">{selectedExpense.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Date</p>
                      <p className="text-base text-white font-light">{selectedExpense.occurredAt ? new Date(selectedExpense.occurredAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Paid By</p>
                      <p className="text-base text-white font-light">{selectedExpense.paidByName || selectedExpense.paidBy}</p>
                    </div>
                  </div>
                </div>

                {/* Split Details Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">
                    Split Among {(selectedExpense?.splits || []).filter(s => !hiddenMembers.has(s.userId)).length} Members
                    {hiddenMembers.size > 0 && <span className="text-white/40"> ({hiddenMembers.size} hidden)</span>}
                  </h3>
                  <div className="space-y-2">
                    {(() => {
                      const recalculatedSplits = getRecalculatedSplits(selectedExpense);
                      return recalculatedSplits.map((split) => {
                        const isHidden = hiddenMembers.has(split.userId);
                        return (
                          <div 
                            key={split.id} 
                            className={`border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 transition-all ${isHidden ? 'opacity-40' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleMemberVisibility(split.userId)}
                                  className="p-1 h-8 w-8 hover:bg-white/10 rounded-none"
                                  data-testid={`button-toggle-member-${split.userId}`}
                                >
                                  {isHidden ? <Eye className="h-4 w-4 text-white/60" /> : <EyeOff className="h-4 w-4 text-white/60" />}
                                </Button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                                  <span className="text-sm font-medium">{split.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                                </div>
                                <p className="text-white font-light">{split.userName || split.userId.slice(0, 8)}</p>
                              </div>
                              <p className={`text-xl font-light ${isHidden ? 'line-through text-white/40' : 'text-white'}`}>
                                {hideAmounts ? "₹•••" : `₹${parseFloat(split.shareAmount).toFixed(0)}`}
                              </p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Notes Section */}
                {selectedExpense.notes && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Notes</h3>
                    <div className="border border-white/10 bg-white/5 p-4">
                      <p className="text-white/80 leading-relaxed">{selectedExpense.notes}</p>
                    </div>
                  </div>
                )}

                {/* Receipt Section */}
                {selectedExpense.attachmentUrl && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Receipt</h3>
                    <div className="border border-white/10 bg-white/5 p-4">
                      {selectedExpense.attachmentType === 'image' ? (
                        <img src={selectedExpense.attachmentUrl} alt="Receipt" className="max-h-64 mx-auto rounded" />
                      ) : (
                        <div className="flex items-center gap-3 p-3">
                          <Upload className="h-5 w-5 text-white/60" />
                          <a href={selectedExpense.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white underline">
                            View Attachment
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fixed Bottom Buttons */}
          {selectedExpense && (
            <div className="flex-shrink-0 border-t border-white/10 bg-black p-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    setExpenseDetailOpen(false);
                    expenseForm.reset({
                      title: selectedExpense.title,
                      amount: selectedExpense.amount,
                      category: selectedExpense.category as any,
                      paidBy: selectedExpense.paidBy,
                      splitType: selectedExpense.splitType as any,
                      notes: selectedExpense.notes || "",
                      splits: selectedExpense.splits.map(s => ({
                        userId: s.userId,
                        shareAmount: s.shareAmount,
                        sharePercentage: s.sharePercentage || undefined,
                        shareUnits: s.shareUnits || undefined
                      })),
                      items: []
                    });
                    setAddExpenseOpen(true);
                    toast({
                      title: "Edit Mode",
                      description: "Expense loaded for editing. Note: Changes will create a new expense."
                    });
                  }}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/10 rounded-none h-12 font-semibold uppercase tracking-wider"
                  data-testid="button-edit-expense"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if (window.confirm("Delete this expense? This action cannot be undone.")) {
                      deleteExpense.mutate(selectedExpense.id);
                    }
                  }}
                  className="bg-red-600 text-white hover:bg-red-700 border border-red-600 rounded-none h-12 font-semibold uppercase tracking-wider"
                  data-testid="button-delete-expense"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Member History Dialog - Full Screen */}
      <Dialog open={memberHistoryOpen} onOpenChange={setMemberHistoryOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Member History</DialogTitle>
            <DialogDescription>View member expense history</DialogDescription>
          </DialogHeader>
          
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMemberHistoryOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">MEMBER HISTORY</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Expense details</p>
              </div>
              <div className="w-9" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              {/* Member Profile Card */}
              {selectedMember && (() => {
                const memberBalance = balances.find(b => b.userId === selectedMember);
                return memberBalance ? (
                  <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border-2 border-white/20">
                        <span className="text-2xl font-medium">{memberBalance.userName?.charAt(0)?.toUpperCase() || "?"}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-light text-white">{memberBalance.userName || `User ${selectedMember.slice(0, 8)}`}</h2>
                        <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                          {memberBalance.netBalance > 0 ? "Gets back" : memberBalance.netBalance < 0 ? "Owes" : "Settled"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-light ${memberBalance.netBalance > 0 ? 'text-green-400' : memberBalance.netBalance < 0 ? 'text-red-400' : 'text-white'}`}>
                          {hideAmounts ? "₹••••" : `₹${Math.abs(memberBalance.netBalance).toFixed(0)}`}
                        </p>
                      </div>
                    </div>

                    {/* Member Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Paid</p>
                        <p className="text-lg font-light text-white">{hideAmounts ? "₹•••" : `₹${memberBalance.totalPaid.toFixed(0)}`}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Share</p>
                        <p className="text-lg font-light text-white">{hideAmounts ? "₹•••" : `₹${memberBalance.totalOwed.toFixed(0)}`}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Expenses</p>
                        <p className="text-lg font-light text-white">{memberBalance.totalExpenses}</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Expenses List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium uppercase tracking-widest text-white/60">Transaction History</h3>
                
                {memberExpenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-white/10 bg-white/5">
                    <Receipt className="h-12 w-12 text-white/40 mb-4" />
                    <p className="text-white/60">No expenses for this member</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memberExpenses.map((expense) => {
                      const isPayer = expense.paidBy === selectedMember;
                      const memberSplit = expense.splits.find(s => s.userId === selectedMember);
                      
                      return (
                        <div
                          key={expense.id}
                          className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                          onClick={() => handleViewExpense(expense)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-light text-white text-base">{expense.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-white/50 uppercase tracking-widest capitalize">{expense.category}</p>
                                <span className="text-white/50">•</span>
                                <p className="text-[10px] text-white/50">{expense.occurredAt ? new Date(expense.occurredAt).toLocaleDateString() : "N/A"}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-light text-white">{hideAmounts ? "₹•••" : `₹${parseFloat(expense.amount).toFixed(0)}`}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Amount Paid</p>
                              <p className={`text-sm font-medium ${isPayer ? 'text-green-400' : 'text-white/60'}`}>
                                {isPayer ? (hideAmounts ? "₹•••" : `₹${parseFloat(expense.amount).toFixed(0)}`) : "₹0"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Your Share</p>
                              <p className={`text-sm font-medium ${!isPayer ? 'text-red-400' : 'text-white/60'}`}>
                                {hideAmounts ? "₹••" : `₹${memberSplit ? parseFloat(memberSplit.shareAmount).toFixed(0) : "0"}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Button */}
          <div className="flex-shrink-0 border-t border-white/10 bg-black p-4">
            <Button
              onClick={() => setMemberHistoryOpen(false)}
              className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-12 font-semibold uppercase tracking-wider border border-white/10"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Group Dialog - QR Code & Link */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-black border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-wider">SHARE GROUP</DialogTitle>
            <DialogDescription className="text-xs text-white/50 uppercase tracking-widest font-light">Invite members via link or QR code</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            {/* Invite Code Display */}
            {group?.inviteCode && (
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Invite Code</p>
                <p className="text-2xl font-bold tracking-[0.3em] text-white">{group.inviteCode}</p>
              </div>
            )}

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-6 rounded-lg">
                <QRCode
                  value={`${window.location.origin}/sharewise/join/${group?.inviteCode || groupId}`}
                  size={200}
                  level="H"
                  data-testid="qr-code"
                />
              </div>
              <p className="text-xs text-white/60 text-center">Scan this QR code to join the group</p>
            </div>

            {/* Copy Link */}
            <div className="space-y-2">
              <p className="text-xs text-white/50 uppercase tracking-widest">Group Link</p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/sharewise/join/${group?.inviteCode || groupId}`}
                  readOnly
                  className="bg-white/5 border-white/10 text-white rounded-none h-12 flex-1 text-xs"
                  data-testid="input-share-link"
                />
                <Button
                  onClick={handleCopyLink}
                  className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6 flex items-center gap-2"
                  data-testid="button-copy-link-dialog"
                >
                  {linkCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Invite Code */}
            {group.inviteCode && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-widest">Invite Code</p>
                <div className="bg-white/5 border border-white/10 p-4 text-center">
                  <p className="text-2xl font-bold tracking-[0.3em] text-white">{group.inviteCode}</p>
                  <p className="text-xs text-white/50 mt-2">Share this code with others</p>
                </div>
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={() => setShareDialogOpen(false)}
              className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-12 border border-white/10"
              data-testid="button-close-share"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog - Full Screen */}
      <Dialog open={editGroupOpen} onOpenChange={setEditGroupOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update group details</DialogDescription>
          </DialogHeader>
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditGroupOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-back-edit-group"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">EDIT GROUP</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Update group details</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteGroupDialogOpen(true)}
                className="text-white/60 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-none"
                data-testid="button-delete-group"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <Form {...editGroupForm}>
              <form onSubmit={editGroupForm.handleSubmit(onEditGroupSubmit)} className="space-y-0 h-full flex flex-col">
                <div className="px-4 py-6 space-y-6 flex-1">
                  {/* General Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">General Details</h3>
                    <FormField
                      control={editGroupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Trip to Goa"
                              className="bg-white/5 border-white/10 text-white rounded-none h-12"
                              data-testid="input-edit-group-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editGroupForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value || ""}
                              placeholder="Weekend trip with friends"
                              className="bg-white/5 border-white/10 text-white resize-none rounded-none"
                              rows={3}
                              data-testid="input-edit-group-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Settings Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">Settings</h3>
                    <FormField
                      control={editGroupForm.control}
                      name="groupType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-edit-group-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10">
                              <SelectItem value="trip">Trip</SelectItem>
                              <SelectItem value="housemates">Housemates</SelectItem>
                              <SelectItem value="couple">Couple</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editGroupForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Currency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-edit-currency">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10">
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editGroupForm.control}
                      name="groupColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Color</FormLabel>
                          <div className="grid grid-cols-6 gap-3">
                            {["#8B5CF6", "#10B981", "#3B82F6", "#EC4899", "#F59E0B", "#6366F1"].map(color => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => field.onChange(color)}
                                className={`h-12 border-2 transition-all ${field.value === color ? 'border-white scale-110' : 'border-white/20'}`}
                                style={{ backgroundColor: color }}
                                data-testid={`edit-color-${color}`}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bottom Padding for fixed footer */}
                  <div className="h-20" />
                </div>

                {/* Fixed Bottom Button */}
                <div className="flex-shrink-0 border-t border-white/10 bg-black p-4">
                  <Button
                    type="submit"
                    disabled={updateGroup.isPending}
                    className="w-full bg-red-600 text-white hover:bg-red-700 rounded-none h-12 font-semibold uppercase tracking-wider border border-white/20"
                    data-testid="button-submit-edit-group"
                  >
                    {updateGroup.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={removeMemberDialogOpen} onOpenChange={setRemoveMemberDialogOpen}>
        <AlertDialogContent className="bg-black border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-wider">Remove Member</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to remove <span className="font-semibold text-white">{memberToRemove?.userName}</span> from the group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/10 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (memberToRemove) {
                  removeMember.mutate(memberToRemove.userId);
                }
                setRemoveMemberDialogOpen(false);
                setMemberToRemove(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700 rounded-none"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Group Confirmation Dialog */}
      <AlertDialog open={leaveGroupDialogOpen} onOpenChange={setLeaveGroupDialogOpen}>
        <AlertDialogContent className="bg-black border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-wider">Leave Group</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to leave <span className="font-semibold text-white">{group?.name}</span>? You will no longer have access to the group's expenses and settlements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/10 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                leaveGroup.mutate();
                setLeaveGroupDialogOpen(false);
              }}
              className="bg-red-600 text-white hover:bg-red-700 rounded-none"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Group Confirmation Dialog */}
      <AlertDialog open={deleteGroupDialogOpen} onOpenChange={setDeleteGroupDialogOpen}>
        <AlertDialogContent className="bg-black border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-wider">Delete Group</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete <span className="font-semibold text-white">{group?.name}</span>? This will permanently delete all expenses, settlements, and member data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/10 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteGroup.mutate();
                setDeleteGroupDialogOpen(false);
              }}
              className="bg-red-600 text-white hover:bg-red-700 rounded-none"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
