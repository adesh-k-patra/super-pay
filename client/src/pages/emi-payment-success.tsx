import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Share2,
  Home,
  CreditCard,
  Mail,
  Clock,
  ArrowRight,
  Building2,
  Calendar
} from "lucide-react";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

export default function EmiPaymentSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get("transactionId") || `TXN${Date.now()}`;
  const amount = params.get("amount") || "0";
  const loanId = params.get("loanId") || "";
  const lenderName = params.get("lenderName") || "Bank";
  const loanType = params.get("loanType") || "Loan";
  const emiNumber = params.get("emiNumber") || "1";
  const dueDate = params.get("dueDate") || new Date().toISOString();
  const upiId = params.get("upiId") || "";
  const paymentMethod = params.get("paymentMethod") || "UPI";

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your payment receipt is being downloaded",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EMI Payment Successful',
        text: `EMI payment of ${formatCurrency(amount)} completed successfully - Transaction ID: ${transactionId}`,
      });
    } else {
      toast({
        title: "Share",
        description: "Payment details copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full max-w-screen-md mx-auto px-4 py-8 space-y-6">
        {/* Success Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-light text-white mb-2 tracking-wider uppercase">Payment Successful</h1>
          <p className="text-white/60 text-sm font-light">Your EMI payment has been processed successfully</p>
        </div>

        {/* Transaction ID & Amount Section */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
          <div className="text-center mb-6">
            <p className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light">Transaction ID</p>
            <p className="text-2xl font-light text-white tracking-widest" data-testid="text-transaction-id">{transactionId}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center border-t border-white/10 pt-6">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="text-2xl font-light text-white" data-testid="text-amount">{formatCurrency(amount)}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Payment Time</p>
              <p className="text-lg font-light text-white">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* EMI Details */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
          <h3 className="text-lg font-light tracking-wider mb-6 text-white uppercase text-xs">EMI Details</h3>
          
          <div className="space-y-4">
            <div className="pb-4 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Loan Type</p>
                  <p className="text-white text-base font-light capitalize" data-testid="text-loan-type">{loanType}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">EMI Number</p>
                  <p className="text-white text-base font-light" data-testid="text-emi-number">#{emiNumber}</p>
                </div>
              </div>
            </div>

            <div className="pb-4 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Lender</p>
                  <p className="text-white text-base font-light" data-testid="text-lender">{lenderName}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Due Date</p>
                  <p className="text-white text-base font-light">
                    {new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pb-4 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-white text-base font-light">{paymentMethod}</p>
                </div>
                {upiId && (
                  <div className="flex-1 text-right">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">UPI ID</p>
                    <p className="text-white text-base font-light text-xs">{upiId}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Payment Date</p>
                  <p className="text-white text-base font-light">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' })}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Status</p>
                  <p className="text-green-500 text-base font-light">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 text-center">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-4">Payment Receipt</p>
          <div className="bg-white p-4 inline-block">
            <QRCode value={`EMI:${transactionId}:${amount}:${loanId}`} size={160} />
          </div>
          <p className="text-xs text-white/40 mt-4">Scan to verify payment details</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12"
            onClick={handleDownload}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12"
            onClick={handleShare}
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
          <h3 className="text-xs font-light tracking-wider mb-4 text-white uppercase">Important Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">A confirmation email and SMS has been sent with your payment receipt</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">Payment will be reflected in your account within 1-2 business days</p>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">Save this receipt for your records and future reference</p>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">For any queries, contact your lender's customer service</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
            onClick={() => navigate('/my-emis')}
            data-testid="button-view-emis"
          >
            View My EMIs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-wider"
            onClick={() => navigate('/home')}
            data-testid="button-home"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
