import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Copy,
  CheckCircle2
} from "lucide-react";

interface Transaction {
  id: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  transactionType: string;
  amount?: string;
  revealedCode: string;
  status: string;
  createdAt: string;
}

export default function CouponMartTransactions() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: transactions } = useQuery<{ purchased: Transaction[]; sold: Transaction[] }>({
    queryKey: ["/api/coupon-mart/transactions"],
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate("/coupon-mart")}
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <h1 className="text-sm font-bold tracking-wider">TRANSACTIONS</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 space-y-6">
        {/* Purchased */}
        {transactions?.purchased && transactions.purchased.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-wider uppercase text-white/60">Purchased</h2>
            {transactions.purchased.map((tx) => (
              <div
                key={tx.id}
                className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4"
                data-testid={`transaction-${tx.id}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20 rounded-none text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={1} />
                      PURCHASED
                    </Badge>
                    <span className="text-xs text-white/50">{formatDate(tx.createdAt)}</span>
                  </div>
                  
                  <div className="bg-white/5 p-3 space-y-2 border border-white/10">
                    <span className="text-xs text-white/60 uppercase tracking-widest block">Coupon Code</span>
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-lg font-mono text-white font-light flex-1 break-all">
                        {tx.revealedCode}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCode(tx.revealedCode)}
                        className="text-white/60 hover:text-white hover:bg-white/10 h-8 shrink-0"
                      >
                        <Copy className="h-4 w-4" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                  
                  {tx.amount && parseFloat(tx.amount) > 0 && (
                    <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                      <span className="text-white/60">Amount Paid</span>
                      <span className="text-white font-light">₹{tx.amount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sold */}
        {transactions?.sold && transactions.sold.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-wider uppercase text-white/60">Sold</h2>
            {transactions.sold.map((tx) => (
              <div
                key={tx.id}
                className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20 rounded-none text-[10px]">
                      <TrendingUp className="h-3 w-3 mr-1" strokeWidth={1} />
                      SOLD
                    </Badge>
                    <span className="text-xs text-white/50">{formatDate(tx.createdAt)}</span>
                  </div>
                  
                  {tx.amount && parseFloat(tx.amount) > 0 && (
                    <div className="flex justify-between border-t border-white/10 pt-3">
                      <span className="text-sm text-white/60">Amount Received</span>
                      <span className="text-base font-light text-white">₹{tx.amount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!transactions?.purchased?.length && !transactions?.sold?.length) && (
          <div className="border border-white/10 p-12 text-center mt-8" data-testid="empty-transactions">
            <ShoppingBag className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
            <p className="text-white/50 text-sm mb-4">No transactions yet</p>
            <Button
              onClick={() => navigate("/coupon-mart")}
              className="bg-white text-black hover:bg-white/90 rounded-none"
            >
              Browse Marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
