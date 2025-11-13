import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  ArrowRight,
  Users, 
  Calendar,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Eye,
  Trash2,
  Edit,
  Plus,
  DollarSign,
  Activity
} from "lucide-react";
import type { FamilyUpiAccount, FamilyUpiTransaction, FamilyUpiMember } from "@shared/schema";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AccountDetails = {
  account: FamilyUpiAccount;
  stats: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    totalSpent: string;
    dailySpent: string;
    monthlySpent: string;
    limitUtilization: number;
  };
  recentTransactions: Array<FamilyUpiTransaction & { memberName: string }>;
};

type TransactionWithMember = FamilyUpiTransaction & { 
  memberName: string; 
  approverName?: string;
};

type MemberAnalytics = {
  member: FamilyUpiMember;
  stats: {
    totalTransactions: number;
    totalSpent: string;
    avgTransactionAmount: string;
    todayTransactions: number;
    todaySpent: string;
    last7DaysTransactions: number;
    last7DaysSpent: string;
    transactionsByDay: Array<{ date: string; count: number; amount: string }>;
  };
  transactions: TransactionWithMember[];
};

// Dummy member data
const DUMMY_MEMBERS: MemberAnalytics[] = [
  {
    member: {
      id: "member-1",
      familyAccountId: "account-1",
      memberId: "user-1",
      memberName: "John Doe",
      memberPhone: "+91 98765 43210",
      relationship: "Self",
      role: "admin",
      canApprove: 1,
      canView: 1,
      spendingLimit: "50000",
      isActive: 1,
      joinedAt: new Date()
    },
    stats: {
      totalTransactions: 45,
      totalSpent: "125000",
      avgTransactionAmount: "2777",
      todayTransactions: 3,
      todaySpent: "1500",
      last7DaysTransactions: 12,
      last7DaysSpent: "15000",
      transactionsByDay: []
    },
    transactions: [
      {
        id: "txn-1",
        familyAccountId: "account-1",
        initiatedBy: "member-1",
        upiTransactionId: null,
        amount: "500",
        description: "Coffee at Starbucks",
        transactionType: "payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        memberName: "John Doe"
      },
      {
        id: "txn-2",
        familyAccountId: "account-1",
        initiatedBy: "member-1",
        upiTransactionId: null,
        amount: "1200",
        description: "Grocery shopping",
        transactionType: "payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        memberName: "John Doe"
      },
      {
        id: "txn-3",
        familyAccountId: "account-1",
        initiatedBy: "member-1",
        upiTransactionId: null,
        amount: "3500",
        description: "Restaurant dinner",
        transactionType: "payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        memberName: "John Doe"
      }
    ]
  },
  {
    member: {
      id: "member-2",
      familyAccountId: "account-1",
      memberId: "user-2",
      memberName: "Jane Smith",
      memberPhone: "+91 98765 43211",
      relationship: "spouse",
      role: "member",
      canApprove: 0,
      canView: 1,
      spendingLimit: "30000",
      isActive: 1,
      joinedAt: new Date()
    },
    stats: {
      totalTransactions: 28,
      totalSpent: "45000",
      avgTransactionAmount: "1607",
      todayTransactions: 2,
      todaySpent: "850",
      last7DaysTransactions: 8,
      last7DaysSpent: "8500",
      transactionsByDay: []
    },
    transactions: [
      {
        id: "txn-4",
        familyAccountId: "account-1",
        initiatedBy: "member-2",
        upiTransactionId: null,
        amount: "450",
        description: "Pharmacy purchase",
        transactionType: "payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        memberName: "Jane Smith"
      },
      {
        id: "txn-5",
        familyAccountId: "account-1",
        initiatedBy: "member-2",
        upiTransactionId: null,
        amount: "2100",
        description: "Online shopping",
        transactionType: "payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        memberName: "Jane Smith"
      }
    ]
  },
  {
    member: {
      id: "member-3",
      familyAccountId: "account-1",
      memberId: null,
      memberName: "Alex Johnson",
      memberPhone: null,
      relationship: "child",
      role: "member",
      canApprove: 0,
      canView: 0,
      spendingLimit: "10000",
      isActive: 1,
      joinedAt: new Date()
    },
    stats: {
      totalTransactions: 15,
      totalSpent: "8500",
      avgTransactionAmount: "567",
      todayTransactions: 1,
      todaySpent: "300",
      last7DaysTransactions: 5,
      last7DaysSpent: "2500",
      transactionsByDay: []
    },
    transactions: [
      {
        id: "txn-6",
        familyAccountId: "account-1",
        initiatedBy: "member-3",
        upiTransactionId: null,
        amount: "300",
        description: "Movie tickets",
        transactionType: "payment",
        status: "success",
        requiresApproval: 1,
        approvedBy: "member-1",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        memberName: "Alex Johnson",
        approverName: "John Doe"
      },
      {
        id: "txn-7",
        familyAccountId: "account-1",
        initiatedBy: "member-3",
        upiTransactionId: null,
        amount: "800",
        description: "Books purchase",
        transactionType: "payment",
        status: "pending",
        requiresApproval: 1,
        approvedBy: null,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        memberName: "Alex Johnson"
      }
    ]
  }
];

export default function FamilyUpiDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberAnalytics | null>(null);
  const [newLimit, setNewLimit] = useState("");
  const [localMemberData, setLocalMemberData] = useState<MemberAnalytics[]>(DUMMY_MEMBERS);
  const [showDeleteFamilyDialog, setShowDeleteFamilyDialog] = useState(false);

  // Fetch account details with dummy data
  const { data: accountDetails } = useQuery<AccountDetails>({
    queryKey: ['/api/family-upi/accounts', id, 'details'],
    enabled: isAuthenticated && !!id,
    placeholderData: {
      account: {
        id: id || "account-1",
        userId: "user-1",
        familyName: "Family Account",
        upiId: "family@upi",
        bankName: "HDFC Bank",
        accountNumber: "1234",
        ifscCode: "HDFC0001234",
        memberCount: 3,
        monthlyLimit: "100000",
        dailyLimit: "25000",
        totalSpent: "178500",
        availableBalance: "50000",
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      stats: {
        totalTransactions: 88,
        successfulTransactions: 85,
        failedTransactions: 3,
        totalSpent: "178500",
        dailySpent: "2650",
        monthlySpent: "45000",
        limitUtilization: 45
      },
      recentTransactions: []
    }
  });

  // Use local member analytics state
  const memberAnalytics = localMemberData;

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteMember = (memberId: string) => {
    setMemberToDelete(memberId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      // Remove member from local state
      setLocalMemberData(prev => prev.filter(m => m.member.id !== memberToDelete));
      
      toast({
        title: "Member Deleted",
        description: "Family member has been removed successfully",
      });
      
      // If the deleted member was selected, switch to "all"
      if (selectedMember === memberToDelete) {
        setSelectedMember("all");
      }
    }
    setShowDeleteDialog(false);
    setMemberToDelete(null);
  };

  const handleEditLimit = (member: MemberAnalytics) => {
    setEditingMember(member);
    setNewLimit(member.member.spendingLimit || "");
    setShowLimitDialog(true);
  };

  const saveLimit = () => {
    if (editingMember && newLimit) {
      // Update member's spending limit in local state
      setLocalMemberData(prev => prev.map(m => 
        m.member.id === editingMember.member.id
          ? {
              ...m,
              member: {
                ...m.member,
                spendingLimit: newLimit
              }
            }
          : m
      ));
      
      toast({
        title: "Limit Updated",
        description: `Spending limit updated to ${formatCurrency(newLimit)}`,
      });
    }
    setShowLimitDialog(false);
    setEditingMember(null);
    setNewLimit("");
  };

  const handleEditFamily = () => {
    navigate(`/family-upi/edit/${id}`);
  };

  const handleDeleteFamily = () => {
    setShowDeleteFamilyDialog(true);
  };

  const confirmDeleteFamily = () => {
    toast({
      title: "Family Account Deleted",
      description: "Family UPI account has been deleted successfully",
    });
    setShowDeleteFamilyDialog(false);
    navigate('/family-upi');
  };

  // Get filtered transactions based on selected member
  const getFilteredTransactions = () => {
    if (selectedMember === "all") {
      return memberAnalytics.flatMap(m => m.transactions).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    const member = memberAnalytics.find(m => m.member.id === selectedMember);
    return member?.transactions || [];
  };

  const filteredTransactions = getFilteredTransactions();

  // Get selected member stats
  const getSelectedMemberStats = () => {
    if (selectedMember === "all") {
      return {
        totalSpent: memberAnalytics.reduce((acc, m) => acc + parseFloat(m.stats.totalSpent), 0).toString(),
        totalTransactions: memberAnalytics.reduce((acc, m) => acc + m.stats.totalTransactions, 0),
        todaySpent: memberAnalytics.reduce((acc, m) => acc + parseFloat(m.stats.todaySpent), 0).toString(),
      };
    }
    const member = memberAnalytics.find(m => m.member.id === selectedMember);
    return member?.stats || { totalSpent: "0", totalTransactions: 0, todaySpent: "0" };
  };

  const selectedStats = getSelectedMemberStats();

  if (!id) {
    return null;
  }

  const selectedMemberData = selectedMember !== "all" 
    ? memberAnalytics.find(m => m.member.id === selectedMember) 
    : null;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        {/* Account Info Header with Edit/Delete Buttons */}
        <div className="flex items-center gap-4 p-4 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/family-upi')}
            className="text-white hover:bg-white/10 p-2 h-9 w-9 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white tracking-wide" data-testid="text-account-name">
              {accountDetails?.account.familyName || 'Family UPI'}
            </h1>
            <p className="text-xs text-white/50 font-light tracking-wider" data-testid="text-upi-id">
              {accountDetails?.account.upiId}
            </p>
          </div>
          {/* Show Edit Family / Delete Family when All Members is selected */}
          {selectedMember === "all" && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditFamily}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 h-9 w-9 rounded-none border border-white/20 transition-all"
                data-testid="button-edit-family"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteFamily}
                className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10 p-2 h-9 w-9 rounded-none border border-red-400/30 transition-all"
                data-testid="button-delete-family"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          {/* Show Edit Limit / Delete Member when a specific member is selected */}
          {selectedMemberData && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditLimit(selectedMemberData)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 h-9 w-9 rounded-none border border-white/20 transition-all"
                data-testid={`button-edit-limit-header`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {selectedMemberData.member.role !== "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteMember(selectedMemberData.member.id)}
                  className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10 p-2 h-9 w-9 rounded-none border border-red-400/30 transition-all"
                  data-testid={`button-delete-member-header`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Member Tabs - Horizontal Scroll */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            <button
              onClick={() => setSelectedMember("all")}
              className={cn(
                "px-4 py-2 text-sm font-light border rounded-none transition-all whitespace-nowrap",
                selectedMember === "all"
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
              )}
              data-testid="tab-all-members"
            >
              <Users className="h-3 w-3 inline mr-2" />
              All Members
            </button>
            {memberAnalytics.map((data) => (
              <button
                key={data.member.id}
                onClick={() => setSelectedMember(data.member.id)}
                className={cn(
                  "px-4 py-2 text-sm font-light border rounded-none transition-all whitespace-nowrap flex items-center gap-2",
                  selectedMember === data.member.id
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
                )}
                data-testid={`tab-member-${data.member.id}`}
              >
                {data.member.memberName}
                {data.member.role === "admin" && (
                  <Shield className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/60 border border-white/10 p-4" data-testid="card-total-spent">
            <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Total Spent</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(selectedStats.totalSpent)}</p>
          </div>
          <div className="bg-black/60 border border-white/10 p-4" data-testid="card-transactions">
            <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Transactions</p>
            <p className="text-xl font-semibold text-white">{selectedStats.totalTransactions}</p>
          </div>
          <div className="bg-black/60 border border-white/10 p-4" data-testid="card-today">
            <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Today</p>
            <p className="text-xl font-semibold text-white">{formatCurrency(selectedStats.todaySpent)}</p>
          </div>
        </div>

        {/* All Members Overview (only show when All Members is selected) */}
        {selectedMember === "all" && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2 mb-3">
              <Users className="h-3 w-3" />
              Family Members
            </h3>
            <div className="space-y-3">
              {memberAnalytics.map((data) => (
                <div 
                  key={data.member.id}
                  className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-5"
                  data-testid={`member-card-${data.member.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-medium text-white">{data.member.memberName}</h4>
                        <Badge className="bg-black/60 text-white border-white/40 rounded-none text-xs font-light px-2 py-0.5">
                          <Shield className="h-3 w-3 mr-1" />
                          {data.member.role}
                        </Badge>
                        {data.member.relationship && (
                          <Badge className="bg-white/10 text-white border-white/30 rounded-none text-xs font-light px-2 py-0.5">
                            {data.member.relationship}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/60 font-light">
                        <span>{data.stats.totalTransactions} transactions</span>
                        <span className="text-white/40">•</span>
                        <span>{formatCurrency(data.stats.totalSpent)} spent</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLimit(data)}
                        className="text-white/70 hover:text-white hover:bg-white/10 p-2 h-8 w-8 rounded-none border border-white/20 transition-all"
                        data-testid={`button-edit-limit-${data.member.id}`}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {data.member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMember(data.member.id)}
                          className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10 p-2 h-8 w-8 rounded-none border border-red-400/30 transition-all"
                          data-testid={`button-delete-${data.member.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Spending Limit Progress */}
                  <div className="space-y-2 pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/60 font-light">Monthly Limit</p>
                      <p className="text-sm text-white font-medium">{formatCurrency(data.member.spendingLimit || "0")}</p>
                    </div>
                    <div className="h-2 bg-black/40 overflow-hidden rounded-sm border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-white to-white/80 transition-all duration-500"
                        style={{ 
                          width: `${Math.min((parseFloat(data.stats.totalSpent) / parseFloat(data.member.spendingLimit || "1")) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/70">
                      <span className="font-medium">{formatCurrency(data.stats.totalSpent)} used</span>
                      <span className="font-light">
                        {(data.member.spendingLimit && parseFloat(data.member.spendingLimit) > 0) 
                          ? `${((parseFloat(data.stats.totalSpent) / parseFloat(data.member.spendingLimit)) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Member Details Card (only show when specific member is selected) */}
        {selectedMemberData && (
          <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 border border-white/30 p-3 rounded-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2">{selectedMemberData.member.memberName}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-black/60 text-white border-white/40 rounded-none text-xs font-light px-3 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {selectedMemberData.member.role}
                  </Badge>
                  {selectedMemberData.member.relationship && (
                    <Badge className="bg-white/10 text-white border-white/30 rounded-none text-xs font-light px-3 py-1">
                      {selectedMemberData.member.relationship}
                    </Badge>
                  )}
                  {selectedMemberData.member.canApprove === 1 && (
                    <Badge className="bg-white/10 text-white border-white/30 rounded-none text-xs font-light px-3 py-1">
                      Can Approve
                    </Badge>
                  )}
                  {selectedMemberData.member.canView === 1 && (
                    <Badge className="bg-white/10 text-white border-white/30 rounded-none text-xs font-light px-3 py-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Can View
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Spending Limit Progress */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60 font-light uppercase tracking-widest">Monthly Spending Limit</p>
                <p className="text-base text-white font-semibold">{formatCurrency(selectedMemberData.member.spendingLimit || "0")}</p>
              </div>
              <div className="h-3 bg-black/40 overflow-hidden rounded-sm border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-white to-white/80 transition-all duration-500"
                  style={{ 
                    width: `${Math.min((parseFloat(selectedMemberData.stats.totalSpent) / parseFloat(selectedMemberData.member.spendingLimit || "1")) * 100, 100)}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-white/70">
                <span className="font-medium">{formatCurrency(selectedMemberData.stats.totalSpent)} spent</span>
                <span className="font-light">
                  {(selectedMemberData.member.spendingLimit && parseFloat(selectedMemberData.member.spendingLimit) > 0) 
                    ? `${((parseFloat(selectedMemberData.stats.totalSpent) / parseFloat(selectedMemberData.member.spendingLimit)) * 100).toFixed(1)}% used`
                    : '0% used'
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
              <Activity className="h-3 w-3" />
              Transaction Timeline
            </h3>
            <span className="text-xs text-white/40">{filteredTransactions.length} transactions</span>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-12 text-center rounded-sm">
              <Activity className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 font-light">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((txn) => (
                <div 
                  key={txn.id}
                  onClick={() => navigate(`/transaction-detail/${txn.id}`)}
                  className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-5 hover:from-white/10 hover:to-white/15 hover:border-white/30 transition-all cursor-pointer group"
                  data-testid={`transaction-${txn.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base font-medium text-white group-hover:text-white/90 transition-colors">
                          {txn.description || 'Transaction'}
                        </h4>
                        <Badge className={cn(
                          "rounded-none text-xs font-light px-2 py-0.5",
                          txn.status === 'success' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                          txn.status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                        )}>
                          {txn.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/60 font-light">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {txn.memberName}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(txn.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(txn.createdAt)}
                        </span>
                      </div>
                      {txn.requiresApproval === 1 && (
                        <p className="text-xs text-white/50 mt-2 flex items-center gap-1.5">
                          <Shield className="h-3 w-3" />
                          {txn.approverName ? `Approved by ${txn.approverName}` : 'Requires approval'}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-xl font-semibold text-white">{formatCurrency(txn.amount || '0')}</p>
                      <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[500px] bg-black/95 backdrop-blur-xl text-white border-red-400/30 rounded-none p-0 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-b border-red-400/20 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-3">
                <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-sm">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  Delete Member
                  <p className="text-xs text-white/50 font-light normal-case tracking-wide mt-1">
                    Remove from family account
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-400/20 p-4">
              <p className="text-sm text-white/90 font-light leading-relaxed">
                Are you sure you want to remove this family member? This action cannot be undone.
              </p>
            </div>
            <div className="space-y-2 text-xs text-white/60 font-light">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-400/60 rounded-full"></span>
                All transaction history will be preserved
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-400/60 rounded-full"></span>
                Member access will be immediately revoked
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-red-400/20 p-6 bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40 rounded-none font-light h-12 tracking-wide transition-all"
                data-testid="button-cancel-delete"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-none font-light h-12 tracking-wide transition-all"
                data-testid="button-confirm-delete"
              >
                Delete Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Limit Dialog */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="sm:max-w-[500px] bg-black/95 backdrop-blur-xl text-white border-white/30 rounded-none p-0 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 border-b border-white/20 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-3">
                <div className="p-3 bg-white/10 border border-white/30 rounded-sm">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  Edit Spending Limit
                  <p className="text-xs text-white/50 font-light normal-case tracking-wide mt-1">
                    for {editingMember?.member.memberName}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Current Limit Display */}
            {editingMember && (
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Current Limit</p>
                <p className="text-2xl font-semibold text-white">
                  {formatCurrency(editingMember.member.spendingLimit || "0")}
                </p>
              </div>
            )}

            {/* New Limit Input */}
            <div className="space-y-3">
              <label className="text-[10px] text-white/60 uppercase tracking-widest font-light">
                New Monthly Limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl font-light">₹</span>
                <Input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="bg-gradient-to-br from-white/10 to-white/5 border-white/30 text-white rounded-none font-light h-14 text-2xl pl-10 focus:border-white/50 focus:bg-white/15 transition-all"
                  placeholder="0"
                  data-testid="input-new-limit"
                />
              </div>
              <p className="text-xs text-white/40 font-light">
                This limit will apply to all future transactions for this member
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-white/20 p-6 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLimitDialog(false)}
                className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40 rounded-none font-light h-12 tracking-wide transition-all"
                data-testid="button-cancel-limit"
              >
                Cancel
              </Button>
              <Button
                onClick={saveLimit}
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-none font-light h-12 tracking-wide transition-all"
                data-testid="button-save-limit"
              >
                Save Limit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Family Confirmation Dialog */}
      <Dialog open={showDeleteFamilyDialog} onOpenChange={setShowDeleteFamilyDialog}>
        <DialogContent className="sm:max-w-[500px] bg-black/95 backdrop-blur-xl text-white border-red-400/30 rounded-none p-0 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-b border-red-400/20 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-wider text-white uppercase flex items-center gap-3">
                <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-sm">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  Delete Family Account
                  <p className="text-xs text-white/50 font-light normal-case tracking-wide mt-1">
                    Permanent deletion
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-400/20 p-4">
              <p className="text-sm text-white/90 font-light leading-relaxed">
                Are you sure you want to delete this family UPI account? This is a permanent action that cannot be undone.
              </p>
            </div>
            <div className="space-y-2 text-xs text-white/60 font-light">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-400/60 rounded-full"></span>
                All members will be removed from the account
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-400/60 rounded-full"></span>
                Transaction history will be deleted
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-400/60 rounded-full"></span>
                This action cannot be reversed
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-red-400/20 p-6 bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteFamilyDialog(false)}
                className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40 rounded-none font-light h-12 tracking-wide transition-all"
                data-testid="button-cancel-delete-family"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteFamily}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-none font-light h-12 tracking-wide transition-all"
                data-testid="button-confirm-delete-family"
              >
                Delete Family Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
