import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SelectTransactionConfirmation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  Package,
  Home,
  Star,
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function InvestmentCongrats() {
  const [, navigate] = useLocation();
  const [confetti, setConfetti] = useState(true);

  // Get transaction ID from URL
  const params = new URLSearchParams(window.location.search);
  const txnId = params.get("id");

  // Fetch transaction confirmation details
  const { data: transaction, isLoading } = useQuery<SelectTransactionConfirmation>({
    queryKey: ["/api/transaction-confirmation", txnId],
    enabled: !!txnId,
  });

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Transaction not found</p>
          <Button onClick={() => navigate("/investment")} data-testid="button-go-home">
            Go to Investments
          </Button>
        </div>
      </div>
    );
  }

  const isSell = transaction.transactionType === "sell";
  const isProfitable = transaction.isProfitable === 1;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'stock':
        return '📈';
      case 'mutual_fund':
        return '📊';
      case 'gold':
        return '🪙';
      case 'silver':
        return '⚪';
      case 'diamond':
        return '💎';
      default:
        return '💼';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative overflow-hidden">
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      {/* Animated Background */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 animate-bounce">
            <Sparkles className="h-8 w-8 text-white/80 opacity-60" />
          </div>
          <div className="absolute top-20 right-20 animate-bounce delay-100">
            <Star className="h-6 w-6 text-white/80 opacity-60" />
          </div>
          <div className="absolute top-40 right-10 animate-bounce delay-200">
            <Sparkles className="h-10 w-10 text-white/80 opacity-60" />
          </div>
          <div className="absolute top-60 left-20 animate-bounce delay-300">
            <Star className="h-8 w-8 text-white/80 opacity-60" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 animate-scale-in">
          <div className={cn(
            "w-24 h-24 rounded-none flex items-center justify-center",
            isSell && isProfitable ? "bg-white/10" :
            isSell && !isProfitable ? "bg-white/10" :
            "bg-white/10"
          )}>
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Congratulations Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2" data-testid="text-congrats-title">
            {transaction.congratsMessage || (isSell ? "Successfully Sold!" : "🎉 Congratulations!")}
          </h1>
          <p className="text-white/60 text-lg">
            {isSell ? "Your investment has been sold" : "Your investment order has been executed"}
          </p>
        </div>

        {/* Transaction Summary Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md mb-6 rounded-none">
          <CardContent className="p-6">
            {/* Asset Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getAssetIcon(transaction.assetType)}</div>
                <div>
                  <h2 className="text-xl font-light text-white" data-testid="text-asset-name">
                    {transaction.assetName}
                  </h2>
                  {transaction.symbol && (
                    <p className="text-white/60 text-sm">{transaction.symbol}</p>
                  )}
                  {transaction.vendorName && (
                    <Badge className="mt-1 bg-white/10 text-white border-white/20">
                      {transaction.vendorName}
                    </Badge>
                  )}
                </div>
              </div>
              <Badge className={cn(
                "text-lg px-4 py-2",
                isSell ? "bg-white/10 text-white/70 border-white/20" :
                "bg-white/10 text-white/70 border-white/20"
              )} data-testid="badge-transaction-type">
                {isSell ? "SOLD" : "BOUGHT"}
              </Badge>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-none p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-white/60" />
                  <p className="text-sm text-white/60">Quantity</p>
                </div>
                <p className="text-lg font-light text-white" data-testid="text-quantity">
                  {parseFloat(transaction.quantity).toFixed(transaction.unit === 'grams' ? 3 : 2)} {transaction.unit}
                </p>
              </div>

              <div className="bg-white/5 rounded-none p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-white/60" />
                  <p className="text-sm text-white/60">{isSell ? "Sell" : "Purchase"} Price</p>
                </div>
                <p className="text-lg font-light text-white" data-testid="text-price">
                  {formatCurrency(parseFloat(isSell ? transaction.sellPrice || "0" : transaction.purchasePrice))}
                </p>
              </div>

              <div className="bg-white/5 rounded-none p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <p className="text-sm text-white/60">Date</p>
                </div>
                <p className="text-lg font-light text-white" data-testid="text-date">
                  {formatDate(transaction.executedAt)}
                </p>
              </div>

              <div className="bg-white/5 rounded-none p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/60" />
                  <p className="text-sm text-white/60">Time</p>
                </div>
                <p className="text-lg font-light text-white" data-testid="text-time">
                  {formatTime(transaction.executedAt)}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-white/5 rounded-none p-4 mb-4">
              <p className="text-sm text-white/60 mb-1">Total Amount</p>
              <p className="text-2xl font-light text-white" data-testid="text-total-amount">
                {formatCurrency(parseFloat(transaction.totalAmount || "0"))}
              </p>
              {transaction.fees && parseFloat(transaction.fees) > 0 && (
                <p className="text-xs text-white/50 mt-1">
                  Including fees: {formatCurrency(parseFloat(transaction.fees || "0"))}
                </p>
              )}
            </div>

            {/* Profit/Loss for Sell Orders */}
            {isSell && transaction.profitLoss && (
              <div className={cn(
                "rounded-none p-4",
                isProfitable ? "bg-white/5" : "bg-white/5"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isProfitable ? (
                      <TrendingUp className="h-5 w-5 text-white/80" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-white/80" />
                    )}
                    <p className="text-sm text-white/60">
                      {isProfitable ? "Profit" : "Loss"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xl font-light",
                      isProfitable ? "text-white/80" : "text-white/80"
                    )} data-testid="text-profit-loss">
                      {isProfitable ? "+" : ""}{formatCurrency(parseFloat(transaction.profitLoss))}
                    </p>
                    {transaction.profitLossPercent && (
                      <p className={cn(
                        "text-sm",
                        isProfitable ? "text-white/80/80" : "text-white/80/80"
                      )}>
                        ({isProfitable ? "+" : ""}{parseFloat(transaction.profitLossPercent).toFixed(2)}%)
                      </p>
                    )}
                  </div>
                </div>
                {transaction.holdingPeriodDays && (
                  <p className="text-xs text-white/50 mt-2">
                    Held for {transaction.holdingPeriodDays} days • {transaction.taxClassification === 'long_term' ? 'Long-term' : 'Short-term'} gains
                  </p>
                )}
              </div>
            )}

            {/* Payment & Delivery Info */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              {transaction.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Payment Method</span>
                  <span className="text-white capitalize" data-testid="text-payment-method">
                    {transaction.paymentMethod}
                  </span>
                </div>
              )}
              {transaction.deliveryType && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Delivery Type</span>
                  <span className="text-white capitalize" data-testid="text-delivery-type">
                    {transaction.deliveryType}
                  </span>
                </div>
              )}
              {transaction.settlementDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Settlement Date</span>
                  <span className="text-white" data-testid="text-settlement-date">
                    {formatDate(transaction.settlementDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none font-light"
            onClick={() => {/* Download receipt */}}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none font-light"
            onClick={() => {/* Share */}}
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-white text-black hover:bg-white/90 rounded-none font-light"
            onClick={() => navigate("/investment")}
            data-testid="button-view-portfolio"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            View Portfolio
          </Button>
          <Button
            variant="ghost"
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-none font-light"
            onClick={() => navigate("/home")}
            data-testid="button-go-home-bottom"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>
        </div>

        {/* Order ID */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">
            Order ID: <span className="font-mono" data-testid="text-order-id">{transaction.orderId}</span>
          </p>
          {transaction.upiTransactionId && (
            <p className="text-xs text-white/40 mt-1">
              UPI Txn ID: <span className="font-mono" data-testid="text-upi-txn-id">{transaction.upiTransactionId}</span>
            </p>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
