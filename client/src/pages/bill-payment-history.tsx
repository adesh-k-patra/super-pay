import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Smartphone, 
  Tv, 
  Zap, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Eye,
  CreditCard,
  Activity,
  DollarSign,
  Receipt
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface BillPaymentHistory {
  id: string;
  serviceProvider: string;
  billType: string;
  accountNumber: string;
  amount: string;
  status: string;
  paidDate: string;
  transactionId: string;
  cashbackEarned: string;
  referenceNumber: string;
}

const mockBillHistory: BillPaymentHistory[] = [
  {
    id: "bp-001",
    serviceProvider: "Airtel",
    billType: "mobile",
    accountNumber: "9876543210",
    amount: "599.00",
    status: "success",
    paidDate: "2024-01-28T10:30:00Z",
    transactionId: "TXN001234567890",
    cashbackEarned: "11.98",
    referenceNumber: "REF123456789"
  },
  {
    id: "bp-002", 
    serviceProvider: "Tata Sky",
    billType: "dth",
    accountNumber: "1234567890",
    amount: "350.00",
    status: "success",
    paidDate: "2024-01-25T14:15:00Z",
    transactionId: "TXN001234567891",
    cashbackEarned: "7.00",
    referenceNumber: "REF123456790"
  },
  {
    id: "bp-003",
    serviceProvider: "MSEB",
    billType: "electricity",
    accountNumber: "987654321012",
    amount: "2450.00",
    status: "success", 
    paidDate: "2024-01-20T09:45:00Z",
    transactionId: "TXN001234567892",
    cashbackEarned: "49.00",
    referenceNumber: "REF123456791"
  },
  {
    id: "bp-004",
    serviceProvider: "Jio",
    billType: "mobile",
    accountNumber: "9123456789",
    amount: "999.00",
    status: "success",
    paidDate: "2024-01-18T16:20:00Z",
    transactionId: "TXN001234567893",
    cashbackEarned: "19.98",
    referenceNumber: "REF123456792"
  },
  {
    id: "bp-005",
    serviceProvider: "Dish TV",
    billType: "dth",
    accountNumber: "2345678901",
    amount: "299.00",
    status: "success",
    paidDate: "2024-01-15T11:30:00Z",
    transactionId: "TXN001234567894",
    cashbackEarned: "5.98",
    referenceNumber: "REF123456793"
  },
  {
    id: "bp-006",
    serviceProvider: "BSES",
    billType: "electricity",
    accountNumber: "876543210987",
    amount: "1850.00",
    status: "success",
    paidDate: "2024-01-12T13:45:00Z",
    transactionId: "TXN001234567895",
    cashbackEarned: "37.00",
    referenceNumber: "REF123456794"
  },
  {
    id: "bp-007",
    serviceProvider: "Vi",
    billType: "mobile",
    accountNumber: "8765432109",
    amount: "449.00",
    status: "success",
    paidDate: "2024-01-10T08:15:00Z",
    transactionId: "TXN001234567896",
    cashbackEarned: "8.98",
    referenceNumber: "REF123456795"
  },
  {
    id: "bp-008",
    serviceProvider: "Sun Direct",
    billType: "dth",
    accountNumber: "3456789012",
    amount: "420.00",
    status: "success",
    paidDate: "2024-01-08T19:30:00Z",
    transactionId: "TXN001234567897",
    cashbackEarned: "8.40",
    referenceNumber: "REF123456796"
  }
];

export default function BillPaymentHistory() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [activeTab, setActiveTab] = useUrlTab("dashboard");

  const { data: billHistory = mockBillHistory, isLoading } = useQuery<BillPaymentHistory[]>({
    queryKey: ['/api/bill-payment/history'],
    queryFn: async () => {
      return mockBillHistory;
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mobile": return <Smartphone className="h-4 w-4 text-white/80" />;
      case "dth": return <Tv className="h-4 w-4 text-white/80" />;
      case "electricity": return <Zap className="h-4 w-4 text-white/80" />;
      default: return <CheckCircle className="h-4 w-4 text-white/80" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mobile": return "bg-white/10 border-white/20";
      case "dth": return "bg-white/10 border-white/20";
      case "electricity": return "bg-white/10 border-white/20";
      default: return "bg-white/10 border-white/20";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredHistory = billHistory.filter((payment) => {
    const matchesSearch = payment.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.accountNumber.includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || payment.billType === selectedCategory;
    
    let matchesMonth = true;
    if (selectedMonth !== "all") {
      const paymentDate = new Date(payment.paidDate);
      const currentYear = new Date().getFullYear();
      const monthMatch = selectedMonth === `${currentYear}-${(paymentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      matchesMonth = monthMatch;
    }
    
    return matchesSearch && matchesCategory && matchesMonth;
  });

  const pagination = usePagination({
    data: filteredHistory,
    itemsPerPage: 10,
  });

  const analytics = {
    totalSpent: billHistory.reduce((sum, payment) => sum + parseFloat(payment.amount), 0),
    totalCashback: billHistory.reduce((sum, payment) => sum + parseFloat(payment.cashbackEarned), 0),
    totalTransactions: billHistory.length,
    categoryBreakdown: billHistory.reduce((acc, payment) => {
      acc[payment.billType] = (acc[payment.billType] || 0) + parseFloat(payment.amount);
      return acc;
    }, {} as Record<string, number>),
    monthlySpending: billHistory.reduce((acc, payment) => {
      const month = new Date(payment.paidDate).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + parseFloat(payment.amount);
      return acc;
    }, {} as Record<string, number>)
  };

  const months = [
    { value: "all", label: "All Months" },
    { value: "2024-12", label: "December 2024" },
    { value: "2024-11", label: "November 2024" },
    { value: "2024-10", label: "October 2024" },
    { value: "2024-09", label: "September 2024" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-b-2 border-white rounded-none"></div>
          </div>
          <p className="text-white/60 font-light tracking-wider">Loading bill payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            onClick={() => navigate("/bill-payment")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back-history"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BILL PAYMENT HISTORY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Track your payments</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 pb-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white/10 rounded-none flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <div className="text-2xl font-light text-white">₹{Math.round(analytics.totalSpent).toLocaleString()}</div>
                <div className="text-white/60 text-xs uppercase tracking-widest font-light">Total Spent</div>
              </div>
            </div>
          </div>
          
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white/10 rounded-none flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <div className="text-2xl font-light text-white">₹{Math.round(analytics.totalCashback).toLocaleString()}</div>
                <div className="text-white/60 text-xs uppercase tracking-widest font-light">Cashback Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-none p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none"
              data-testid="tab-dashboard"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none"
              data-testid="tab-history"
            >
              <Receipt className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <p className="text-lg font-light text-white">{analytics.totalTransactions}</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest font-light">Total Bills</p>
                  </div>
                </div>
              </div>

              <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <p className="text-lg font-light text-white">{((analytics.totalCashback / analytics.totalSpent) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest font-light">Cashback Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <h3 className="text-white flex items-center gap-2 mb-4 font-light tracking-wide">
                <PieChart className="h-5 w-5" />
                Category Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.categoryBreakdown).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-none flex items-center justify-center ${getTypeColor(category)}`}>
                        {getTypeIcon(category)}
                      </div>
                      <span className="text-white font-light capitalize">{category} Bills</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-light">₹{Math.round(amount).toLocaleString()}</div>
                      <div className="text-xs text-white/60 font-light">{((amount / analytics.totalSpent) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <h3 className="text-white flex items-center gap-2 mb-4 font-light tracking-wide">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {billHistory.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-none flex items-center justify-center ${getTypeColor(payment.billType)}`}>
                        {getTypeIcon(payment.billType)}
                      </div>
                      <div>
                        <div className="text-white text-sm font-light">{payment.serviceProvider}</div>
                        <div className="text-white/60 text-xs font-light">{formatTime(payment.paidDate)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-light">₹{payment.amount}</div>
                      <div className="text-white/80 text-xs font-light">+₹{payment.cashbackEarned}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setActiveTab("history")}
                variant="outline"
                size="sm"
                className="w-full mt-4 border-white/30 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
              >
                View All History
              </Button>
            </div>
          </TabsContent>

          {/* History Tab Content */}
          <TabsContent value="history" className="mt-6">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40 rounded-none"
                      data-testid="input-search-bills"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger 
                      className="bg-white/10 border-white/20 text-white rounded-none"
                      data-testid="select-category-filter"
                    >
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 rounded-none">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="dth">DTH</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger 
                      className="bg-white/10 border-white/20 text-white rounded-none"
                      data-testid="select-month-filter"
                    >
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20 rounded-none">
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 rounded-none font-light tracking-wider flex items-center gap-2" 
                    data-testid="button-download-history"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Payment History List */}
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12 border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                    <Receipt className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-light text-white mb-2">No bills found</h3>
                    <p className="text-white/60 font-light">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  pagination.paginatedData.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 transition-all cursor-pointer"
                      onClick={() => navigate(`/bill-payment-details/${payment.id}`)}
                      data-testid={`payment-item-${payment.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-none flex items-center justify-center ${getTypeColor(payment.billType)}`}>
                            {getTypeIcon(payment.billType)}
                          </div>
                          <div>
                            <h3 className="font-light text-white tracking-wide">{payment.serviceProvider}</h3>
                            <p className="text-sm text-white/60 font-light">{payment.accountNumber}</p>
                            <p className="text-xs text-white/40 font-light">{formatTime(payment.paidDate)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-light text-white">₹{payment.amount}</p>
                          <p className="text-sm text-white/80 font-light">+₹{payment.cashbackEarned} cashback</p>
                          <Badge className="text-xs mt-1 bg-white/10 text-white/80 border-white/20 rounded-none">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-white/30 text-white hover:bg-white/10 text-xs rounded-none font-light tracking-wider"
                          onClick={() => navigate(`/bill-payment-details/${payment.id}`)}
                          data-testid={`button-view-details-${payment.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-white text-black hover:bg-white/90 text-xs rounded-none font-light tracking-wider"
                          onClick={() => navigate(`/bill-payment?provider=${payment.serviceProvider}`)}
                          data-testid={`button-pay-again-${payment.id}`}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay Again
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {filteredHistory.length > 0 && (
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
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
