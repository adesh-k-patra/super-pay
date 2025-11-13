import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowDownLeft, Plus, Filter, Download, Calendar, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { CashParkTransaction } from "@shared/schema";
import { format } from "date-fns";

export default function CashParkTransactions() {
  const [, navigate] = useLocation();
  const [filterType, setFilterType] = useState<"all" | "deposit" | "withdrawal">("all");

  const { data: transactionsData, isLoading } = useQuery<{ transactions: CashParkTransaction[] }>({
    queryKey: ["/api/cash-park/transactions"],
  });

  const transactions = transactionsData?.transactions || [];

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === "all") return true;
    if (filterType === "deposit") return transaction.transactionType === "deposit";
    if (filterType === "withdrawal") return transaction.transactionType === "withdrawal";
    return true;
  });

  const pagination = usePagination({
    data: filteredTransactions,
    itemsPerPage: 20,
  });

  const totalDeposits = transactions
    .filter(t => t.transactionType === "deposit")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const totalWithdrawals = transactions
    .filter(t => t.transactionType === "withdrawal")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-light tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cash-park")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">ALL TRANSACTIONS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Cash Park History</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 border border-white/30 bg-white/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" strokeWidth={1} />
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Added</p>
                <p className="text-lg font-light text-white tracking-tight">
                  ₹{totalDeposits.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 border border-white/30 bg-white/10 flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5 text-white" strokeWidth={1} />
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Withdrawn</p>
                <p className="text-lg font-light text-white tracking-tight">
                  ₹{totalWithdrawals.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterType("all")}
            className={`rounded-none ${filterType === "all" ? "border-b-2 border-white text-white" : "text-white/50"}`}
            data-testid="filter-all"
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterType("deposit")}
            className={`rounded-none ${filterType === "deposit" ? "border-b-2 border-white text-white" : "text-white/50"}`}
            data-testid="filter-deposits"
          >
            Deposits
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterType("withdrawal")}
            className={`rounded-none ${filterType === "withdrawal" ? "border-b-2 border-white text-white" : "text-white/50"}`}
            data-testid="filter-withdrawals"
          >
            Withdrawals
          </Button>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="border border-white/10 bg-white/5 p-12 text-center">
            <Coins className="h-16 w-16 text-white/40 mx-auto mb-4" strokeWidth={1} />
            <p className="text-white/60 font-light tracking-wider mb-1 text-lg">No transactions yet</p>
            <p className="text-sm text-white/40 font-light">
              {filterType === "all" 
                ? "Start adding money to your jars" 
                : `No ${filterType}s found`}
            </p>
          </div>
        ) : (
          <div className="space-y-0 border border-white/10">
            {pagination.paginatedData.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b border-white/10 last:border-b-0 p-4 flex items-center justify-between hover:bg-white/5 transition-all"
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border flex items-center justify-center flex-shrink-0 ${
                    transaction.transactionType === 'deposit' 
                      ? 'border-white/30 bg-white/10' 
                      : 'border-white/20 bg-white/5'
                  }`}>
                    {transaction.transactionType === 'deposit' ? (
                      <Plus className="h-6 w-6 text-white" strokeWidth={1} />
                    ) : (
                      <ArrowDownLeft className="h-6 w-6 text-white" strokeWidth={1} />
                    )}
                  </div>
                  <div>
                    <div className="font-light text-white tracking-wider mb-1 capitalize">
                      {transaction.transactionType}
                      {transaction.jarId && (
                        <span className="text-white/40 ml-2 text-xs">
                          • Jar ID: {transaction.jarId}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 font-light">
                      {transaction.createdAt && format(new Date(transaction.createdAt), 'dd MMM yyyy, hh:mm a')}
                    </div>
                    {transaction.description && (
                      <div className="text-xs text-white/30 font-light mt-1">
                        {transaction.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-light tracking-wider mb-1 ${
                    transaction.transactionType === 'deposit' ? 'text-white' : 'text-white/80'
                  }`}>
                    {transaction.transactionType === 'deposit' ? '+' : '-'}₹{parseFloat(transaction.amount || "0").toLocaleString('en-IN')}
                  </div>
                  {transaction.status && (
                    <Badge 
                      className={`text-[10px] uppercase tracking-widest rounded-none ${
                        transaction.status === 'success' 
                          ? 'bg-white/10 text-white border-white/20' 
                          : 'bg-white/5 text-white/60 border-white/10'
                      }`}
                    >
                      {transaction.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {filteredTransactions.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.goToPage}
                canGoNext={pagination.canGoNext}
                canGoPrevious={pagination.canGoPrevious}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
                className="mt-6 mb-6 px-4"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
