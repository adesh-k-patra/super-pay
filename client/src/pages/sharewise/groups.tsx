import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sharewiseGroupFormSchema, type SharewiseGroup } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { z } from "zod";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Eye,
  EyeOff,
  TrendingUp,
  DollarSign,
  Calendar,
  Settings,
  Share2,
  QrCode,
  Trash2,
  Info,
  Edit,
  Wallet
} from "lucide-react";

type GroupWithMembers = SharewiseGroup & {
  members: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: Date;
    status: string;
  }>;
  totalExpenses?: number;
  yourBalance?: number;
  memberCount?: number;
};

type GroupFormData = z.infer<typeof sharewiseGroupFormSchema>;

export default function ShareWiseGroups() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithMembers | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: groups = [], isLoading } = useQuery<GroupWithMembers[]>({
    queryKey: ["/api/sharewise/groups"]
  });

  // Fetch all expenses from all groups
  const { data: allExpenses = [], isLoading: expensesLoading } = useQuery<any[]>({
    queryKey: ["/api/sharewise/expenses/all"],
    enabled: selectedTab === "transactions"
  });

  const form = useForm<GroupFormData>({
    resolver: zodResolver(sharewiseGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      groupType: "other",
      currency: "INR",
      groupColor: "#8B5CF6",
      groupPhoto: ""
    }
  });

  const editForm = useForm<GroupFormData>({
    resolver: zodResolver(sharewiseGroupFormSchema),
    defaultValues: {
      name: "",
      description: undefined,
      groupType: "other",
      currency: "INR",
      groupColor: "#8B5CF6",
      groupPhoto: undefined
    }
  });

  const createGroup = useMutation({
    mutationFn: async (data: GroupFormData) => {
      return await apiRequest("POST", "/api/sharewise/groups", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      toast({
        title: "Group Created",
        description: "Your group has been created successfully"
      });
      setCreateDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      });
    }
  });

  const updateGroup = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GroupFormData> }) => {
      return await apiRequest("PATCH", `/api/sharewise/groups/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      toast({
        title: "Group Updated",
        description: "Group has been updated successfully"
      });
      setEditDialogOpen(false);
      setSelectedGroup(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive"
      });
    }
  });

  const deleteGroup = useMutation({
    mutationFn: async (groupId: string) => {
      return await apiRequest("DELETE", `/api/sharewise/groups/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      toast({
        title: "Group Deleted",
        description: "The group has been deleted"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: GroupFormData) => {
    createGroup.mutate(data);
  };

  const onEditSubmit = (data: GroupFormData) => {
    if (selectedGroup) {
      updateGroup.mutate({ id: selectedGroup.id, data });
    }
  };

  const handleEditGroup = (group: GroupWithMembers) => {
    setSelectedGroup(group);
    editForm.reset({
      name: group.name,
      description: group.description === null ? undefined : group.description,
      groupType: group.groupType as any,
      currency: group.currency || "INR",
      groupColor: group.groupColor === null ? "#8B5CF6" : group.groupColor,
      groupPhoto: group.groupPhoto === null ? undefined : group.groupPhoto
    });
    setEditDialogOpen(true);
  };

  const handleShareGroup = (group: GroupWithMembers) => {
    setSelectedGroup(group);
    setShareDialogOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      deleteGroup.mutate(groupId);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchQuery === "" || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (selectedTab === "all") return !group.isArchived;
    if (selectedTab === "active") return !group.isArchived && (group.yourBalance !== 0 || (group.totalExpenses || 0) > 0);
    if (selectedTab === "transactions") return !group.isArchived; // Show all active groups for now
    if (selectedTab === "closed") return group.isArchived || (group.yourBalance === 0 && (group.totalExpenses || 0) === 0);
    return !group.isArchived;
  });

  const pagination = usePagination({
    data: filteredGroups,
    itemsPerPage: 10,
  });

  const activeGroups = groups.filter(g => !g.isArchived).length;
  const totalExpenses = groups.reduce((sum, g) => sum + (g.totalExpenses || 0), 0);
  const totalBalance = groups.reduce((sum, g) => sum + (g.yourBalance || 0), 0);
  const totalMembers = groups.reduce((sum, g) => sum + (g.memberCount || 0), 0);
  
  const totalReceivable = groups.reduce((sum, g) => {
    const balance = g.yourBalance || 0;
    return sum + (balance > 0 ? balance : 0);
  }, 0);
  
  const totalPayable = groups.reduce((sum, g) => {
    const balance = g.yourBalance || 0;
    return sum + (balance < 0 ? Math.abs(balance) : 0);
  }, 0);
  
  const totalGroupsCreated = groups.filter(g => g.createdBy === user?.id).length;

  const groupTypeColors: Record<string, string> = {
    trip: "#10B981",
    housemates: "#3B82F6",
    couple: "#EC4899",
    event: "#F59E0B",
    business: "#6366F1",
    other: "#8B5CF6"
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/pro-tools")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SHAREWISE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Expense Splitting</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/sharewise/groups/create")}
              className="text-white hover:text-black hover:bg-white p-2 rounded-none"
              data-testid="button-create-group-header"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/sharewise/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-info-header"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="groups-summary">
          {/* Stats Grid - 2x2 Layout */}
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 border-r border-white/10 pr-4" data-testid="card-total-receivable">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Receivable</p>
                </div>
                <p className="text-xl font-light text-green-400" data-testid="text-total-receivable">
                  {hideAmounts ? "₹••••" : `₹${totalReceivable.toFixed(0)}`}
                </p>
              </div>
              <div className="space-y-1 pl-0" data-testid="card-total-payable">
                <div className="flex items-center gap-2">
                  <Wallet className="h-3 w-3 text-red-400" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Payable</p>
                </div>
                <p className="text-xl font-light text-red-400" data-testid="text-total-payable">
                  {hideAmounts ? "₹••••" : `₹${totalPayable.toFixed(0)}`}
                </p>
              </div>
              <div className="space-y-1 border-r border-white/10 pr-4 pt-3" data-testid="card-total-groups">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-white/60" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Total Groups</p>
                </div>
                <p className="text-xl font-light text-white" data-testid="text-total-groups">
                  {activeGroups}
                </p>
              </div>
              <div className="space-y-1 pl-0 pt-3" data-testid="card-groups-created">
                <div className="flex items-center gap-2">
                  <Plus className="h-3 w-3 text-white/60" />
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Groups Created</p>
                </div>
                <p className="text-xl font-light text-white" data-testid="text-groups-created">
                  {totalGroupsCreated}
                </p>
              </div>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups by name or description..."
            className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
            data-testid="input-search-groups"
          />
        </div>

        {/* Groups Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all-groups">All</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-active">Active</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-transactions">Transactions</TabsTrigger>
              <TabsTrigger value="closed" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-closed">Closed</TabsTrigger>
            </TabsList>

            {/* All, Active, Closed tabs */}
            {["all", "active", "closed"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-white/60">Loading...</div>
                  </div>
                ) : pagination.paginatedData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-white/40" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No groups found</h3>
                    <p className="text-white/60 text-sm text-center mb-6">
                      Create your first group to start splitting expenses
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pagination.paginatedData.map((group) => (
                      <div
                        key={group.id}
                        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => navigate(`/sharewise/groups/${group.id}`)}
                        data-testid={`card-group-${group.id}`}
                      >
                        <div className="space-y-3">
                          {/* Group Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div 
                                className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: group.groupColor || "#8B5CF6" + "20" }}
                              >
                                {group.groupPhoto ? (
                                  <img src={group.groupPhoto} alt={group.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Users className="h-6 w-6 text-white/80" />
                                )}
                              </div>
                              <div className="space-y-1 flex-1">
                                <h4 className="font-light text-white text-sm tracking-wide">{group.name}</h4>
                                {group.description && (
                                  <p className="text-[10px] text-white/50 tracking-wide">{group.description}</p>
                                )}
                                <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest">
                                  <span>{group.memberCount || group.members.length} Members</span>
                                  <span>•</span>
                                  <span className="capitalize">{group.groupType}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-lg font-light text-white tracking-tight" data-testid={`text-balance-${group.id}`}>
                                {hideAmounts ? "₹••••" : `₹${((group.totalExpenses || 0) / 1000).toFixed(1)}K`}
                              </p>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                                Total Spend
                              </p>
                            </div>
                          </div>

                          {/* Group Stats */}
                          <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                            <div className="flex justify-between">
                              <span className="text-white/60">Payable:</span>
                              <span className="text-red-400 font-medium">
                                {hideAmounts ? "₹••••" : group.yourBalance && group.yourBalance < 0 ? `₹${Math.abs(group.yourBalance).toFixed(0)}` : "₹0"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Receivable:</span>
                              <span className="text-green-400 font-medium">
                                {hideAmounts ? "₹••••" : group.yourBalance && group.yourBalance > 0 ? `₹${group.yourBalance.toFixed(0)}` : "₹0"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pagination.totalPages > 1 && (
                      <div className="pt-4">
                        <PaginationControls {...pagination} onPageChange={pagination.goToPage} />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}

            {/* Transactions tab - All expenses from all groups */}
            <TabsContent value="transactions" className="mt-6">
              {expensesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-white/60">Loading transactions...</div>
                </div>
              ) : allExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Wallet className="h-8 w-8 text-white/40" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No transactions</h3>
                  <p className="text-white/60 text-sm text-center mb-6">
                    Add expenses to your groups to see transactions
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allExpenses.map((expense: any) => (
                    <div
                      key={expense.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      onClick={() => navigate(`/sharewise/groups/${expense.groupId}`)}
                      data-testid={`transaction-${expense.id}`}
                    >
                      <div className="space-y-3">
                        {/* Transaction Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-light text-white text-base mb-1">{expense.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-white/50 uppercase tracking-widest">
                              <span className="capitalize">{expense.category}</span>
                              <span>•</span>
                              <span>{expense.groupName}</span>
                            </div>
                            <p className="text-[10px] text-white/40 mt-1">
                              {expense.occurredAt ? new Date(expense.occurredAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-light text-white tracking-tight">
                              {hideAmounts ? "₹•••" : `₹${parseFloat(expense.amount).toFixed(0)}`}
                            </p>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">
                              {expense.currency || "INR"}
                            </p>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                          <div className="flex justify-between">
                            <span className="text-white/60">Paid by:</span>
                            <span className="text-white font-medium">{expense.paidByName || expense.paidBy?.slice(0, 8) || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Split:</span>
                            <span className="text-white font-medium">{expense.splitCount || 0} members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Group Dialog - Full Screen */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreateDialogOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-back-create"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">CREATE GROUP</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">New expense group</p>
              </div>
              <div className="w-9" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                <div className="px-4 py-6 space-y-6">
                  {/* General Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">General Details</h3>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Trip to Goa"
                              className="bg-white/5 border-white/10 text-white rounded-none h-12"
                              data-testid="input-create-group-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                              data-testid="input-create-group-description"
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
                      control={form.control}
                      name="groupType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-group-type">
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
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Currency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-currency">
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
                      control={form.control}
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
                                data-testid={`color-${color}`}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-black border-t border-white/10">
                  <Button
                    type="submit"
                    disabled={createGroup.isPending}
                    className="w-full bg-red-600 text-white hover:bg-red-700 rounded-none h-12 font-semibold uppercase tracking-wider border border-white/20"
                    data-testid="button-submit-create-group"
                  >
                    {createGroup.isPending ? "Creating..." : "Create Group"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog - Full Screen */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-black border-none text-white max-w-full h-full m-0 p-0 rounded-none max-h-screen overflow-hidden flex flex-col">
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between py-4 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditDialogOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-back-edit"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">EDIT GROUP</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Update group details</p>
              </div>
              <div className="w-9" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-0">
                <div className="px-4 py-6 space-y-6">
                  {/* General Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">General Details</h3>
                    <FormField
                      control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
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
                </div>

                {/* Fixed Bottom Button */}
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-black border-t border-white/10">
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

      {/* Share Group Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-wider">SHARE GROUP</DialogTitle>
            <p className="text-xs text-white/50 uppercase tracking-widest font-light">Invite members to join</p>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-6 py-4">
              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <QrCode className="h-40 w-40 text-black" />
                  </div>
                </div>
                <p className="text-xs text-white/60 text-center">Scan to join group</p>
              </div>

              {/* Invite Code */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 uppercase tracking-widest">Invite Code</p>
                <div className="flex gap-2">
                  <Input
                    value={selectedGroup.inviteCode}
                    readOnly
                    className="bg-white/5 border-white/10 text-white rounded-none h-12 font-mono"
                    data-testid="input-invite-code"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedGroup.inviteCode);
                      toast({ title: "Copied!", description: "Invite code copied to clipboard" });
                    }}
                    className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6"
                    data-testid="button-copy-code"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* Share Link */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 uppercase tracking-widest">Share Link</p>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.origin}/sharewise/join/${selectedGroup.inviteCode}`}
                    readOnly
                    className="bg-white/5 border-white/10 text-white rounded-none h-12"
                    data-testid="input-share-link"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sharewise/join/${selectedGroup.inviteCode}`);
                      toast({ title: "Copied!", description: "Share link copied to clipboard" });
                    }}
                    className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-6"
                    data-testid="button-copy-link"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
