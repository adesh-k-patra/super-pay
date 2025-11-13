import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, CheckCircle, User, Building2, Clock, CreditCard } from "lucide-react";

interface TransactionDetail {
  id: string;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  amount: number;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  transferType: string;
  transactionId: string;
  description?: string;
  senderAccount: string;
  senderBank: string;
}

export default function BankTransferDetail() {
  const [, navigate] = useLocation();
  const params = useParams();
  const transactionId = params.id;

  const mockTransactionDetails: Record<string, TransactionDetail> = {
    "1": {
      id: "1",
      beneficiaryName: "Rajesh Kumar",
      accountNumber: "****8765",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      amount: 15000,
      date: "2024-10-07",
      time: "14:35",
      status: "completed",
      transferType: "IMPS",
      transactionId: "BT202410071435",
      description: "Monthly rent payment",
      senderAccount: "****1234",
      senderBank: "HDFC Bank Savings"
    },
    "2": {
      id: "2",
      beneficiaryName: "Priya Sharma",
      accountNumber: "****4321",
      ifscCode: "ICIC0005678",
      bankName: "ICICI Bank",
      amount: 25000,
      date: "2024-10-05",
      time: "10:20",
      status: "completed",
      transferType: "NEFT",
      transactionId: "BT202410051020",
      description: "Business payment",
      senderAccount: "****1234",
      senderBank: "HDFC Bank Savings"
    },
    "3": {
      id: "3",
      beneficiaryName: "Amit Patel",
      accountNumber: "****9999",
      ifscCode: "SBIN0001111",
      bankName: "State Bank of India",
      amount: 50000,
      date: "2024-10-03",
      time: "16:45",
      status: "completed",
      transferType: "RTGS",
      transactionId: "BT202410031645",
      senderAccount: "****1234",
      senderBank: "HDFC Bank Savings"
    },
    "4": {
      id: "4",
      beneficiaryName: "Sarah Johnson",
      accountNumber: "****1122",
      ifscCode: "ICIC0009876",
      bankName: "ICICI Bank",
      amount: 8000,
      date: "2024-10-01",
      time: "09:15",
      status: "completed",
      transferType: "IMPS",
      transactionId: "BT202410010915",
      description: "Payment for services",
      senderAccount: "****1234",
      senderBank: "HDFC Bank Savings"
    },
    "5": {
      id: "5",
      beneficiaryName: "Vikram Singh",
      accountNumber: "****3344",
      ifscCode: "HDFC0002222",
      bankName: "HDFC Bank",
      amount: 12000,
      date: "2024-09-28",
      time: "11:30",
      status: "completed",
      transferType: "NEFT",
      transactionId: "BT202409281130",
      senderAccount: "****1234",
      senderBank: "HDFC Bank Savings"
    }
  };

  const transaction = transactionId ? mockTransactionDetails[transactionId] : null;

  if (!transaction) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4 font-light">Transaction not found</p>
          <Button onClick={() => navigate("/bank-transfer")} className="bg-white text-black hover:bg-white/90 rounded-none font-light">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-white" />;
      case "pending":
        return <Clock className="h-6 w-6 text-white" />;
      case "failed":
        return <Clock className="h-6 w-6 text-white" />;
      default:
        return <CheckCircle className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/bank-transfer")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Transaction Details</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Bank Transfer</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Status Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
              {getStatusIcon()}
            </div>
          </div>
          <p className="text-4xl font-light text-white mb-2">{formatCurrency(transaction.amount)}</p>
          <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-xs uppercase tracking-widest">
            {transaction.status}
          </Badge>
        </div>

        {/* Beneficiary Details */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Beneficiary Details</h3>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white/60" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-light text-white mb-1 tracking-wide">{transaction.beneficiaryName}</h4>
              <p className="text-xs text-white/60 font-light">{transaction.bankName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Account Number</p>
              <p className="text-sm font-light text-white">{transaction.accountNumber}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">IFSC Code</p>
              <p className="text-sm font-light text-white">{transaction.ifscCode}</p>
            </div>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Transaction Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-sm text-white/60 font-light">Transaction ID</span>
              <span className="text-sm font-light text-white">{transaction.transactionId}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-sm text-white/60 font-light">Transfer Type</span>
              <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">
                {transaction.transferType}
              </Badge>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-sm text-white/60 font-light">Date & Time</span>
              <span className="text-sm font-light text-white">{new Date(transaction.date).toLocaleDateString()} {transaction.time}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-sm text-white/60 font-light">From Account</span>
              <span className="text-sm font-light text-white">{transaction.senderAccount}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-sm text-white/60 font-light">Bank</span>
              <span className="text-sm font-light text-white">{transaction.senderBank}</span>
            </div>
            {transaction.description && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-light">Description</span>
                <span className="text-sm font-light text-white">{transaction.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-wider"
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-wider"
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
