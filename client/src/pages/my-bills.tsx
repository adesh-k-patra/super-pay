import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  ArrowLeft,
  Receipt,
  Zap,
  Smartphone,
  Wifi,
  Tv,
  Droplets,
  Car,
  Coffee,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Filter,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  RefreshCw,
  DollarSign,
  Target,
  Activity,
  Hexagon,
  Users,
  Share2
} from "lucide-react";

interface BillItem {
  id: string;
  billType: string;
  provider: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "failed";
  category: "electricity" | "mobile" | "internet" | "dth" | "water" | "gas" | "insurance" | "subscription";
  lastPaidDate?: string;
  paymentMethod?: string;
  autoPayEnabled: boolean;
  reminderEnabled: boolean;
  recurringAmount?: number;
  nextDueDate?: string;
  penaltyAmount?: number;
  daysPastDue?: number;
  splitWith?: { name: string; amount: number; status: "pending" | "paid" }[];
  isSplit: boolean;
  myShare?: number;
}

export default function MyBills() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock bills data (in real app, this would come from APIs)
  const mockBills: BillItem[] = [
    {
      id: "1",
      billType: "Electricity Bill",
      provider: "BESCOM",
      accountNumber: "123456789",
      amount: 2450,
      dueDate: "2025-01-05",
      status: "pending",
      category: "electricity",
      autoPayEnabled: false,
      reminderEnabled: true,
      recurringAmount: 2200,
      nextDueDate: "2025-02-05",
      isSplit: true,
      myShare: 1225,
      splitWith: [
        { name: "Rahul", amount: 1225, status: "pending" }
      ]
    },
    {
      id: "2",
      billType: "Mobile Postpaid",
      provider: "Airtel",
      accountNumber: "9876543210",
      amount: 599,
      dueDate: "2025-01-02",
      status: "overdue",
      category: "mobile",
      daysPastDue: 2,
      penaltyAmount: 50,
      autoPayEnabled: false,
      reminderEnabled: true,
      recurringAmount: 599,
      nextDueDate: "2025-02-02",
      isSplit: false
    },
    {
      id: "3",
      billType: "Internet Broadband",
      provider: "ACT Fibernet",
      accountNumber: "ACT123456",
      amount: 999,
      dueDate: "2024-12-28",
      status: "paid",
      category: "internet",
      lastPaidDate: "2024-12-27",
      paymentMethod: "UPI",
      autoPayEnabled: true,
      reminderEnabled: false,
      recurringAmount: 999,
      nextDueDate: "2025-01-28",
      isSplit: true,
      myShare: 333,
      splitWith: [
        { name: "Priya", amount: 333, status: "paid" },
        { name: "Amit", amount: 333, status: "paid" }
      ]
    },
    {
      id: "4",
      billType: "DTH Recharge",
      provider: "Tata Sky",
      accountNumber: "100123456789",
      amount: 356,
      dueDate: "2025-01-10",
      status: "pending",
      category: "dth",
      autoPayEnabled: true,
      reminderEnabled: true,
      recurringAmount: 356,
      nextDueDate: "2025-02-10",
      isSplit: false
    },
    {
      id: "5",
      billType: "LPG Gas Cylinder",
      provider: "Bharat Gas",
      accountNumber: "BG123456789",
      amount: 853,
      dueDate: "2025-01-08",
      status: "pending",
      category: "gas",
      autoPayEnabled: false,
      reminderEnabled: true,
      isSplit: false
    },
    {
      id: "6",
      billType: "Car Insurance",
      provider: "HDFC ERGO",
      accountNumber: "POL123456789",
      amount: 12500,
      dueDate: "2025-03-15",
      status: "pending",
      category: "insurance",
      autoPayEnabled: false,
      reminderEnabled: true,
      isSplit: false
    }
  ];

  const totalPending = mockBills.filter(bill => bill.status === "pending").reduce((sum, bill) => sum + bill.amount, 0);
  const totalOverdue = mockBills.filter(bill => bill.status === "overdue").reduce((sum, bill) => sum + (bill.amount + (bill.penaltyAmount || 0)), 0);
  const pendingCount = mockBills.filter(bill => bill.status === "pending").length;
  const overdueCount = mockBills.filter(bill => bill.status === "overdue").length;
  const autoPayCount = mockBills.filter(bill => bill.autoPayEnabled).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "electricity": return Zap;
      case "mobile": return Smartphone;
      case "internet": return Wifi;
      case "dth": return Tv;
      case "water": return Droplets;
      case "gas": return Coffee;
      case "insurance": return Car;
      case "subscription": return CreditCard;
      default: return Receipt;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-white/10 text-white border-white/20 rounded-none";
      case "pending": return "bg-white/10 text-white border-white/20 rounded-none";
      case "overdue": return "bg-white/10 text-white border-white/20 rounded-none";
      case "failed": return "bg-white/10 text-white border-white/20 rounded-none";
      default: return "bg-white/10 text-white border-white/20 rounded-none";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return CheckCircle;
      case "pending": return Clock;
      case "overdue": return AlertTriangle;
      case "failed": return XCircle;
      default: return Clock;
    }
  };

  const filteredBills = mockBills.filter(bill => {
    const matchesSearch = bill.billType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.accountNumber.includes(searchQuery);
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && bill.status === selectedTab;
  });

  // Pagination calculations
  const totalItems = filteredBills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedBills = filteredBills.slice(startIndex - 1, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTab]);

  const toggleAutoPay = (billId: string) => {
    toast({
      title: "Auto-Pay Updated",
      description: "Auto-pay setting has been updated successfully"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
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
            <h1 className="text-base font-bold tracking-wider">MY BILLS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Upcoming & paid bills</p>
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
        {/* Bills Summary */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="bills-overview">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Bills This Month</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">{pendingCount} pending</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-bills">
                {hideAmounts ? "₹••••••••" : `₹${((totalPending + totalOverdue) / 1000).toFixed(1)}K`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-pending-bills">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Pending</p>
                <p className="text-lg font-light text-white" data-testid="text-pending-amount">
                  {hideAmounts ? "₹••••" : `₹${(totalPending / 1000).toFixed(1)}K`}
                </p>
                <p className="text-[10px] text-white/40" data-testid="text-pending-count">{pendingCount} bills</p>
              </div>
              <div className="space-y-1" data-testid="card-overdue-bills">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Overdue</p>
                <p className="text-lg font-light text-white" data-testid="text-overdue-amount">
                  {hideAmounts ? "₹••••" : `₹${(totalOverdue / 1000).toFixed(1)}K`}
                </p>
                <p className="text-[10px] text-white/40" data-testid="text-overdue-count">{overdueCount} bills</p>
              </div>
              <div className="space-y-1" data-testid="card-autopay-status">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Auto-Pay</p>
                <p className="text-lg font-light text-white" data-testid="text-autopay-count">
                  {autoPayCount}/{mockBills.length}
                </p>
                <p className="text-[10px] text-white/40">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bills or providers..."
              className="bg-white/5 border-white/10 text-white pl-10"
              data-testid="input-search-bills"
            />
          </div>
        </div>

        {/* Bills Tabs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Bills & Payments</h3>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-white/5 border border-white/10 w-full h-auto p-1 rounded-none flex flex-wrap justify-center gap-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none flex-1 min-w-[80px]" data-testid="tab-all-bills">All ({mockBills.length})</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none flex-1 min-w-[80px]" data-testid="tab-pending-bills">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="overdue" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none flex-1 min-w-[80px]" data-testid="tab-overdue-bills">Overdue ({overdueCount})</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none flex-1 min-w-[80px]" data-testid="tab-paid-bills">Paid</TabsTrigger>
            </TabsList>

{["all", "pending", "overdue", "paid"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-4">
              <div className="space-y-4">
                {paginatedBills.map((bill) => {
                  const CategoryIcon = getCategoryIcon(bill.category);
                  const StatusIcon = getStatusIcon(bill.status);
                  const isOverdue = bill.status === "overdue";
                  
                  return (
                    <div
                      key={bill.id}
                      className="bg-white/5 border border-white/10 p-4 hover:bg-white/5 transition-all duration-200 rounded-lg w-full"
                      data-testid={`bill-${bill.id}`}
                    >
                      <div className="space-y-4 w-full">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 w-full">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 border border-white/60 flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="h-5 w-5 text-white/60" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-white text-sm break-words">{bill.billType}</h4>
                              <p className="text-xs text-white/60 break-words">{bill.provider}</p>
                              <p className="text-xs text-white/40 truncate">A/c: {bill.accountNumber}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge className={cn("text-xs px-2 py-0 border", getStatusColor(bill.status))}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {bill.status.toUpperCase()}
                                </Badge>
                                {isOverdue && bill.daysPastDue && (
                                  <Badge className="text-xs px-2 py-0 bg-white/10 text-white border-white/20 rounded-none">
                                    {bill.daysPastDue} days late
                                  </Badge>
                                )}
                                {bill.isSplit && (
                                  <Badge className="text-xs px-2 py-0 bg-white/10 text-white border-white/20 rounded-none">
                                    <Users className="h-3 w-3 mr-1" />
                                    Split with {bill.splitWith?.length || 0}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold whitespace-nowrap text-white">
                              {hideAmounts ? "₹••••" : `₹${bill.amount.toLocaleString()}`}
                            </p>
                            {isOverdue && bill.penaltyAmount && (
                              <p className="text-xs text-white/60 whitespace-nowrap">
                                +₹{bill.penaltyAmount} penalty
                              </p>
                            )}
                            <p className="text-xs text-white/60 whitespace-nowrap">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Payment Info */}
                        {bill.lastPaidDate && (
                          <div className="border-t border-white/10 pt-3">
                            <div className="flex justify-between text-xs text-white/60">
                              <span>Last paid: {new Date(bill.lastPaidDate).toLocaleDateString()}</span>
                              {bill.paymentMethod && <span>via {bill.paymentMethod}</span>}
                            </div>
                          </div>
                        )}

                        {/* Split Bill Details */}
                        {bill.isSplit && bill.splitWith && (
                          <div className="border-t border-white/10 pt-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-white/60 flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Your share:
                                </span>
                                <span className="text-sm font-semibold text-white">
                                  {hideAmounts ? "₹••••" : `₹${bill.myShare?.toLocaleString()}`}
                                </span>
                              </div>
                              <div className="space-y-1">
                                {bill.splitWith.map((person, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <span className="text-white/60">{person.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white/60">
                                        {hideAmounts ? "₹•••" : `₹${person.amount.toLocaleString()}`}
                                      </span>
                                      <Badge className="text-xs px-1 py-0 bg-white/10 text-white border-white/20 rounded-none">
                                        {person.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Auto-Pay Toggle */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={bill.autoPayEnabled}
                                onCheckedChange={() => toggleAutoPay(bill.id)}
                                className="scale-75"
                              />
                              <span className="text-xs text-white/60">Auto-Pay</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1"
                                onClick={() => toast({ title: "Reminder", description: "Reminder settings updated" })}
                              >
                                {bill.reminderEnabled ? 
                                  <Bell className="h-3 w-3 text-white/60" /> : 
                                  <BellOff className="h-3 w-3 text-white/40" />
                                }
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              className="bg-white text-black hover:bg-white/90 text-xs px-3 py-1 rounded-none"
                              data-testid={`pay-${bill.id}`}
                            >
                              Pay Now
                            </Button>
                            {!bill.isSplit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/60 hover:text-white hover:bg-white/10 text-xs px-3 py-1 rounded-none"
                                onClick={() => toast({ title: "Split Bill", description: "Split bill feature will allow you to share this bill with others" })}
                                data-testid={`split-${bill.id}`}
                              >
                                <Share2 className="h-3 w-3 mr-1" />
                                Split Bill
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/60 hover:text-white text-xs px-3 py-1 rounded-none"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredBills.length > 0 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    canGoNext={currentPage < totalPages}
                    canGoPrevious={currentPage > 1}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={totalItems}
                    className="mt-8"
                  />
                )}
              </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => navigate("/bill-payment")}
              className="bg-white text-black hover:bg-white/90 h-12 justify-start rounded-none"
              data-testid="button-pay-bills"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pay New Bill
            </Button>
            <Button
              onClick={() => navigate("/bill-payment/mobile")}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/10"
              data-testid="button-mobile-recharge"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile Recharge
            </Button>
            <Button
              onClick={() => navigate("/bill-payment/electricity")}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/10"
              data-testid="button-electricity-bill"
            >
              <Zap className="h-4 w-4 mr-2" />
              Electricity Bill
            </Button>
          </div>
        </div>

        {/* Bill Reminders */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Upcoming Bills</h4>
              <p className="text-xs text-white/60">
                {mockBills.filter(bill => bill.status === "pending").length} bills due this month
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white p-1"
                onClick={() => navigate("/bill-reminder")}
                data-testid="button-bill-calendar"
              >
                <Calendar className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white p-1"
                onClick={() => window.location.reload()}
                data-testid="button-refresh-bills"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}