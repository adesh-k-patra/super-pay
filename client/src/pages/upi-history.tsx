import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  History, 
  Send, 
  Receipt, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Search,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart,
  Download,
  ArrowLeft,
  Lock,
  LogIn
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { type UpiTransaction } from "@shared/schema";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function UpiHistory() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "analytics">("list");


  // Fetch UPI transactions only if authenticated
  const { data: transactions = [], isLoading, error } = useQuery<UpiTransaction[]>({
    queryKey: ['/api/upi/transactions'],
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: (failureCount, error: any) => {
      // Don't retry on 401 authentication errors
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    }
  });

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-6 max-w-md mx-auto">
          <div className="w-20 h-20 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wider mb-4">LOGIN REQUIRED</h2>
          <p className="text-white/60 mb-6">
            Please log in to view your UPI transaction history
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-white text-black hover:bg-white/90 font-semibold w-full h-12"
            data-testid="button-login"
          >
            <LogIn className="h-4 w-4 mr-2" />
            LOGIN NOW
          </Button>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t: UpiTransaction) => {
    // Filter by type
    const typeMatch = filter === "all" || 
      t.transactionType.replace('_payment', '').replace('_', '') === filter || 
      t.transactionType === filter;
    
    // Filter by search term
    const searchMatch = searchTerm === "" || 
      (t.recipientName && t.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.recipientUpiId && t.recipientUpiId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return typeMatch && searchMatch;
  });

  // Add pagination
  const {
    paginatedData: paginatedTransactions,
    currentPage,
    totalPages,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredTransactions,
    itemsPerPage: 20,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-white/80" />;
      case "failed": return <XCircle className="h-4 w-4 text-white/80" />;
      case "pending": return <Clock className="h-4 w-4 text-white/80" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    const transactionType = type.replace('_payment', '').replace('_', '');
    switch (transactionType) {
      case "payment": return <Send className="h-4 w-4 text-white/60" />;
      case "collect": return <Receipt className="h-4 w-4 text-white/60" />;
      case "bill": return <CreditCard className="h-4 w-4 text-white/60" />;
      default: return <Send className="h-4 w-4 text-white/60" />;
    }
  };

  // Calculate analytics
  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
  const successfulTransactions = filteredTransactions.filter(t => t.status === 'success').length;
  const successRate = totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(1) : 0;

  const filterOptions = [
    { value: "all", label: "ALL", icon: History },
    { value: "payment", label: "PAYMENTS", icon: Send },
    { value: "collect", label: "REQUESTS", icon: Receipt },
    { value: "bill", label: "BILLS", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base uppercase tracking-widest font-light">UPI HISTORY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Transaction history</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Analytics Overview */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 border border-white/10 bg-white/5">
              <p className="text-2xl font-bold text-white">{totalTransactions}</p>
              <p className="text-white/60 text-sm">Total Transactions</p>
            </div>
            <div className="text-center p-4 border border-white/10 bg-white/5">
              <p className="text-2xl font-bold text-white">₹{totalAmount.toLocaleString()}</p>
              <p className="text-white/60 text-sm">Total Amount</p>
            </div>
          </div>
          <div className="text-center p-4 border border-white/10 bg-white/5">
            <p className="text-2xl font-bold text-white/80">{successRate}%</p>
            <p className="text-white/60 text-sm">Success Rate</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-white/60 focus:ring-0 h-12 rounded-none"
            />
          </div>

          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "analytics")} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2 bg-black border border-white/10 rounded-none p-1">
              <TabsTrigger 
                value="list" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none transition-all duration-300 ease-out data-[state=active]:scale-105 data-[state=active]:animate-[bubble_0.4s_ease-out] hover:text-white"
              >
                TRANSACTIONS
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none transition-all duration-300 ease-out data-[state=active]:scale-105 data-[state=active]:animate-[bubble_0.4s_ease-out] hover:text-white"
              >
                ANALYTICS
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-none ${
                  filter === option.value 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "border border-white/10 text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <option.icon className="h-3 w-3" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border border-white/20 p-4 animate-pulse">
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12 border border-white/10 bg-white/5">
                <History className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">NO TRANSACTIONS FOUND</h3>
                <p className="text-white/60 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Start making UPI transactions to see them here"}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="bg-white text-black hover:bg-white/90 font-semibold rounded-none"
                >
                  CLEAR FILTERS
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="border border-white/10 bg-white/5 p-4 hover:border-white/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/payment-detail/${transaction.id}`)}
                      data-testid={`transaction-item-${transaction.id}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
                            {getTypeIcon(transaction.transactionType)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {transaction.recipientName || transaction.recipientUpiId || 'UPI Transaction'}
                            </h3>
                            <p className="text-white/60 text-sm">
                              {transaction.description || transaction.transactionType.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">₹{parseFloat(transaction.amount || '0').toLocaleString()}</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            {getStatusIcon(transaction.status)}
                            <span className="text-white/60 text-sm capitalize">{transaction.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                        <span className="text-white/60">
                          ID: {transaction.externalTransactionId?.slice(-6) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={totalItems}
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Transaction Type Breakdown */}
            <div className="border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="font-semibold text-white mb-4">TRANSACTION BREAKDOWN</h3>
              <div className="space-y-3">
                {filterOptions.slice(1).map((type) => {
                  const typeTransactions = transactions.filter(t => 
                    t.transactionType.includes(type.value === 'bill' ? 'bill' : type.value)
                  );
                  const typeAmount = typeTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
                  
                  return (
                    <div key={type.value} className="flex items-center justify-between p-3 border border-white/10 bg-black/20">
                      <div className="flex items-center gap-3">
                        <type.icon className="h-4 w-4 text-white/60" />
                        <span className="text-white">{type.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{typeAmount.toLocaleString()}</p>
                        <p className="text-white/60 text-xs">{typeTransactions.length} transactions</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="font-semibold text-white mb-4">MONTHLY PERFORMANCE</h3>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Detailed analytics coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={() => navigate("/upi-payment")}
            className="flex-1 bg-white text-black hover:bg-white/90 font-semibold h-12 rounded-none"
          >
            <Send className="h-4 w-4 mr-2" />
            NEW PAYMENT
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border border-white/10 text-white hover:bg-white/10 font-semibold h-12 rounded-none"
          >
            <Download className="h-4 w-4 mr-2" />
            EXPORT
          </Button>
        </div>
      </div>
    </div>
  );
}