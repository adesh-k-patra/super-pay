import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Clock, Calendar, Building, Receipt, TrendingDown, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreditUpiTransaction } from "@shared/schema";
import { format } from "date-fns";

export default function CreditUpiTransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: transactionData, isLoading } = useQuery<{ transaction: CreditUpiTransaction }>({
    queryKey: ["/api/credit-upi/transaction", id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  const transaction = transactionData?.transaction;

  if (!transaction) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Receipt className="h-16 w-16 text-white/30 mb-4" />
        <h2 className="text-xl font-light text-white mb-2">Transaction Not Found</h2>
        <Button 
          onClick={() => navigate("/credit-upi")} 
          className="mt-4 bg-white text-black hover:bg-white/90 rounded-none"
        >
          Back to Credit UPI
        </Button>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-white/50" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-white/20 text-white/70 border-white/30";
    }
  };

  const formatCurrency = (amount: string | number) => {
    return `₹${parseFloat(amount.toString()).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            onClick={() => navigate("/credit-upi")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-light tracking-wider uppercase">Transaction Details</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Amount Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Amount Paid</p>
          <h2 className="text-4xl font-light text-white mb-4">-{formatCurrency(transaction.amount || "0")}</h2>
          <div className="flex items-center justify-center gap-2">
            {getStatusIcon()}
            <Badge className={`${getStatusColor()} rounded-none uppercase tracking-widest text-[10px] border`}>
              {transaction.status}
            </Badge>
          </div>
        </div>

        {/* Merchant Information */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-white font-light text-sm tracking-wide uppercase mb-4">Merchant Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-white/40" />
                <span className="text-[11px] text-white/50 uppercase tracking-widest">Merchant Name</span>
              </div>
              <span className="text-white font-light">{transaction.merchantName}</span>
            </div>
            {transaction.merchantUpi && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-white/40" />
                  <span className="text-[11px] text-white/50 uppercase tracking-widest">Merchant UPI</span>
                </div>
                <span className="text-white font-light font-mono text-sm">{transaction.merchantUpi}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="h-4 w-4 text-white/40" />
                <span className="text-[11px] text-white/50 uppercase tracking-widest">Category</span>
              </div>
              <Badge className="bg-white/10 text-white/70 border-white/20 rounded-none uppercase tracking-widest text-[10px]">
                {transaction.category || "shopping"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-white font-light text-sm tracking-wide uppercase mb-4">Transaction Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] text-white/50 uppercase tracking-widest">Transaction ID</span>
              <span className="text-white font-light font-mono text-sm">{transaction.transactionId}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] text-white/50 uppercase tracking-widest">Date & Time</span>
              <span className="text-white font-light">
                {transaction.createdAt && format(new Date(transaction.createdAt), 'dd MMM yyyy, hh:mm a')}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] text-white/50 uppercase tracking-widest">Transaction Type</span>
              <span className="text-white font-light capitalize">{transaction.transactionType || "payment"}</span>
            </div>
            {transaction.description && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50 uppercase tracking-widest">Description</span>
                <span className="text-white font-light text-right max-w-[200px]">{transaction.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Balance Information */}
        {(transaction.balanceBefore || transaction.balanceAfter) && (
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
            <h3 className="text-white font-light text-sm tracking-wide uppercase mb-4">Balance Information</h3>
            <div className="space-y-4">
              {transaction.balanceBefore && (
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[11px] text-white/50 uppercase tracking-widest">Balance Before</span>
                  <span className="text-white font-light">{formatCurrency(transaction.balanceBefore)}</span>
                </div>
              )}
              {transaction.balanceAfter && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/50 uppercase tracking-widest">Balance After</span>
                  <span className="text-white font-light">{formatCurrency(transaction.balanceAfter)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EMI Information */}
        {transaction.emiConverted === 1 && (
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
            <h3 className="text-white font-light text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              EMI Conversion
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] text-white/50 uppercase tracking-widest">EMI Status</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-none uppercase tracking-widest text-[10px]">
                  Converted
                </Badge>
              </div>
              {transaction.emiMonths && (
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[11px] text-white/50 uppercase tracking-widest">EMI Duration</span>
                  <span className="text-white font-light">{transaction.emiMonths} Months</span>
                </div>
              )}
              {transaction.emiMonths && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/50 uppercase tracking-widest">Monthly EMI</span>
                  <span className="text-white font-light">
                    {formatCurrency(parseFloat(transaction.amount || "0") / transaction.emiMonths)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white/70 text-sm font-light mb-1">Secure Transaction</p>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                This transaction was processed securely through Credit UPI. All your financial data is encrypted and protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
