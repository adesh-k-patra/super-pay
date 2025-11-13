import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { 
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Building2,
  Hash,
  Clock
} from "lucide-react";

interface TransactionDetail {
  id: string;
  type: "received" | "paid" | "deposit" | "withdrawal" | "family_upi" | "insurance_premium" | "insurance_claim" | "insurance_refund" | "refund";
  title: string;
  amount: number;
  date: string;
  provider?: string;
  reference?: string;
  description: string;
  fromAccount?: string;
  toAccount?: string;
  transactionId: string;
  status: string;
  method?: string;
  memberName?: string;
  approverName?: string;
  requiresApproval?: boolean;
  familyAccountName?: string;
  policyNumber?: string;
  policyName?: string;
  claimNumber?: string;
  refundReason?: string;
  orderId?: string;
}

const MOCK_TRANSACTIONS: Record<string, TransactionDetail> = {
  "txn-001": {
    id: "txn-001",
    type: "deposit",
    title: "Wallet Deposit",
    amount: 15000,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "Google Pay",
    description: "Deposit to wallet via UPI",
    fromAccount: "UPI - Google Pay",
    toAccount: "Wallet",
    transactionId: "DEP" + Date.now().toString().slice(-10),
    status: "completed",
    method: "UPI - Google Pay"
  },
  "txn-002": {
    id: "txn-002",
    type: "deposit",
    title: "Wallet Deposit",
    amount: 25000,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "HDFC Bank",
    description: "Deposit to wallet via Bank Transfer",
    fromAccount: "Bank Transfer - HDFC",
    toAccount: "Wallet",
    transactionId: "DEP" + (Date.now() - 1).toString().slice(-10),
    status: "completed",
    method: "Bank Transfer - HDFC"
  },
  "txn-003": {
    id: "txn-003",
    type: "withdrawal",
    title: "Wallet Withdrawal",
    amount: 5000,
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "ICICI Bank",
    description: "Withdrawal from wallet to bank",
    fromAccount: "Wallet",
    toAccount: "Bank Transfer - ICICI",
    transactionId: "WDL" + (Date.now() - 2).toString().slice(-10),
    status: "completed",
    method: "Bank Transfer - ICICI"
  },
  "txn-004": {
    id: "txn-004",
    type: "deposit",
    title: "Wallet Deposit",
    amount: 10000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "Visa Card",
    description: "Deposit to wallet via Credit Card",
    fromAccount: "Credit Card - Visa",
    toAccount: "Wallet",
    transactionId: "DEP" + (Date.now() - 3).toString().slice(-10),
    status: "pending",
    method: "Credit Card - Visa"
  },
  "txn-005": {
    id: "txn-005",
    type: "withdrawal",
    title: "Wallet Withdrawal",
    amount: 8000,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "SBI Bank",
    description: "Withdrawal from wallet to bank",
    fromAccount: "Wallet",
    toAccount: "Bank Transfer - SBI",
    transactionId: "WDL" + (Date.now() - 4).toString().slice(-10),
    status: "completed",
    method: "Bank Transfer - SBI"
  },
  "txn-006": {
    id: "txn-006",
    type: "deposit",
    title: "Wallet Deposit",
    amount: 20000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "PhonePe",
    description: "Deposit to wallet via UPI",
    fromAccount: "UPI - PhonePe",
    toAccount: "Wallet",
    transactionId: "DEP" + (Date.now() - 5).toString().slice(-10),
    status: "completed",
    method: "UPI - PhonePe"
  },
  "txn-1": {
    id: "txn-1",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 500,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Coffee at Starbucks",
    memberName: "John Doe",
    familyAccountName: "Family Account",
    transactionId: "FUP" + Date.now().toString().slice(-10),
    status: "success",
    requiresApproval: false
  },
  "txn-2": {
    id: "txn-2",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 1200,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Grocery shopping",
    memberName: "John Doe",
    familyAccountName: "Family Account",
    transactionId: "FUP" + (Date.now() - 1).toString().slice(-10),
    status: "success",
    requiresApproval: false
  },
  "txn-3": {
    id: "txn-3",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 3500,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Restaurant dinner",
    memberName: "John Doe",
    familyAccountName: "Family Account",
    transactionId: "FUP" + (Date.now() - 2).toString().slice(-10),
    status: "success",
    requiresApproval: false
  },
  "txn-4": {
    id: "txn-4",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 450,
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Pharmacy purchase",
    memberName: "Jane Smith",
    familyAccountName: "Family Account",
    transactionId: "FUP" + (Date.now() - 3).toString().slice(-10),
    status: "success",
    requiresApproval: false
  },
  "txn-5": {
    id: "txn-5",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 2100,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Online shopping",
    memberName: "Jane Smith",
    familyAccountName: "Family Account",
    transactionId: "FUP" + (Date.now() - 4).toString().slice(-10),
    status: "success",
    requiresApproval: false
  },
  "txn-6": {
    id: "txn-6",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 300,
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Movie tickets",
    memberName: "Alex Johnson",
    approverName: "John Doe",
    familyAccountName: "Family Account",
    transactionId: "FUP" + (Date.now() - 5).toString().slice(-10),
    status: "success",
    requiresApproval: true
  },
  "txn-7": {
    id: "txn-7",
    type: "family_upi",
    title: "Family UPI Payment",
    amount: 800,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "Books purchase",
    memberName: "Alex Johnson",
    familyAccountName: "Family Account",
    transactionId: "FUP" + (Date.now() - 6).toString().slice(-10),
    status: "pending",
    requiresApproval: true
  },
  "txn-007": {
    id: "txn-007",
    type: "withdrawal",
    title: "Wallet Withdrawal",
    amount: 3000,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: "Axis Bank",
    description: "Withdrawal from wallet to bank",
    fromAccount: "Wallet",
    toAccount: "Bank Transfer - Axis",
    transactionId: "WDL" + (Date.now() - 6).toString().slice(-10),
    status: "failed",
    method: "Bank Transfer - Axis"
  },
  "received-1": {
    id: "received-1",
    type: "received",
    title: "Salary Credit",
    amount: 95000,
    date: "2024-12-01",
    provider: "Company XYZ",
    description: "Monthly Salary - November 2024",
    fromAccount: "Company XYZ Account",
    toAccount: "HDFC Bank ****1234",
    transactionId: "TXN202412010001",
    status: "completed"
  },
  "received-2": {
    id: "received-2",
    type: "received",
    title: "Freelance Payment",
    amount: 25000,
    date: "2024-11-28",
    provider: "Client ABC",
    description: "Project Delivery Payment",
    fromAccount: "Client ABC",
    toAccount: "HDFC Bank ****1234",
    transactionId: "TXN202411280002",
    status: "completed"
  },
  "received-3": {
    id: "received-3",
    type: "received",
    title: "Interest Credit",
    amount: 450,
    date: "2024-11-30",
    provider: "HDFC Bank",
    description: "Savings Account Interest",
    fromAccount: "HDFC Bank",
    toAccount: "HDFC Bank ****1234",
    transactionId: "TXN202411300003",
    status: "completed"
  },
  "emi-paid-1-1": {
    id: "emi-paid-1-1",
    type: "paid",
    title: "Home Loan EMI",
    amount: 12500,
    date: "2024-11-15",
    provider: "HDFC Bank",
    reference: "LN001",
    description: "Monthly EMI Payment",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "HDFC Bank - Loan Account",
    transactionId: "EMI202411150001",
    status: "completed"
  },
  "emi-paid-2-1": {
    id: "emi-paid-2-1",
    type: "paid",
    title: "Vehicle Loan EMI",
    amount: 9200,
    date: "2024-11-10",
    provider: "ICICI Bank",
    reference: "LN002",
    description: "Monthly EMI Payment",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "ICICI Bank - Loan Account",
    transactionId: "EMI202411100002",
    status: "completed"
  },
  "cc-paid-1": {
    id: "cc-paid-1",
    type: "paid",
    title: "HDFC Credit Card",
    amount: 7800,
    date: "2024-11-18",
    provider: "HDFC Bank",
    description: "Credit Card Bill Payment",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "HDFC Credit Card ****5678",
    transactionId: "CC202411180001",
    status: "completed"
  },
  "paid-1": {
    id: "paid-1",
    type: "paid",
    title: "Electricity Bill",
    amount: 2100,
    date: "2024-11-10",
    provider: "BESCOM",
    description: "Electricity Bill Payment",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "BESCOM",
    transactionId: "BILL202411100001",
    status: "completed"
  },
  "paid-2": {
    id: "paid-2",
    type: "paid",
    title: "Mobile Postpaid",
    amount: 799,
    date: "2024-11-08",
    provider: "Airtel",
    description: "Mobile Bill Payment",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "Airtel",
    transactionId: "BILL202411080002",
    status: "completed"
  },
  "ins-txn-1": {
    id: "ins-txn-1",
    type: "insurance_premium",
    title: "Premium Payment",
    amount: 25000,
    date: "2024-01-01",
    provider: "Star Health Insurance",
    description: "Annual premium payment for Family Health Shield policy",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "Star Health Insurance",
    transactionId: "INS202401010001",
    status: "success",
    method: "UPI",
    policyNumber: "HLTH-2024-001234",
    policyName: "Family Health Shield"
  },
  "ins-txn-2": {
    id: "ins-txn-2",
    type: "insurance_premium",
    title: "Premium Payment",
    amount: 15000,
    date: "2024-06-15",
    provider: "LIC of India",
    description: "Annual premium payment for Term Life Plus policy",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "LIC of India",
    transactionId: "INS202406150001",
    status: "success",
    method: "Bank Transfer",
    policyNumber: "LIFE-2023-005678",
    policyName: "Term Life Plus"
  },
  "ins-txn-3": {
    id: "ins-txn-3",
    type: "insurance_claim",
    title: "Claim Settlement",
    amount: 45000,
    date: "2024-08-20",
    provider: "Star Health Insurance",
    description: "Medical claim settlement for hospitalization",
    fromAccount: "Star Health Insurance",
    toAccount: "HDFC Bank ****1234",
    transactionId: "CLM202408200001",
    status: "success",
    policyNumber: "HLTH-2024-001234",
    policyName: "Family Health Shield",
    claimNumber: "CLM-2024-8901"
  },
  "ins-txn-4": {
    id: "ins-txn-4",
    type: "insurance_premium",
    title: "Premium Payment",
    amount: 12000,
    date: "2024-03-01",
    provider: "HDFC ERGO",
    description: "Annual premium payment for Comprehensive Car Insurance",
    fromAccount: "HDFC Bank ****1234",
    toAccount: "HDFC ERGO",
    transactionId: "INS202403010001",
    status: "success",
    method: "Credit Card",
    policyNumber: "VEH-2024-009876",
    policyName: "Comprehensive Car Insurance"
  },
  "ins-txn-5": {
    id: "ins-txn-5",
    type: "insurance_claim",
    title: "Claim Settlement",
    amount: 85000,
    date: "2024-09-20",
    provider: "HDFC ERGO",
    description: "Vehicle accident claim settlement",
    fromAccount: "HDFC ERGO",
    toAccount: "HDFC Bank ****1234",
    transactionId: "CLM202409200001",
    status: "success",
    policyNumber: "VEH-2024-009876",
    policyName: "Comprehensive Car Insurance",
    claimNumber: "CLM-2024-9012"
  },
  "refund-1": {
    id: "refund-1",
    type: "refund",
    title: "Swiggy Order Refund",
    amount: 450,
    date: "2024-12-06",
    provider: "Swiggy",
    description: "Refund for cancelled order",
    fromAccount: "Swiggy",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-001",
    status: "completed",
    method: "UPI",
    orderId: "SWG-001",
    refundReason: "Order cancelled by restaurant"
  },
  "refund-2": {
    id: "refund-2",
    type: "refund",
    title: "Zomato Refund",
    amount: 280,
    date: "2024-12-02",
    provider: "Zomato",
    description: "Refund for incorrect delivery",
    fromAccount: "Zomato",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-002",
    status: "completed",
    method: "UPI",
    orderId: "ZMT-002",
    refundReason: "Wrong item delivered"
  },
  "refund-3": {
    id: "refund-3",
    type: "refund",
    title: "Amazon Fresh Refund",
    amount: 320,
    date: "2024-11-29",
    provider: "Amazon Fresh",
    description: "Refund for damaged product",
    fromAccount: "Amazon Fresh",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-003",
    status: "completed",
    method: "UPI",
    orderId: "AMZ-002",
    refundReason: "Product quality issue"
  },
  "refund-4": {
    id: "refund-4",
    type: "refund",
    title: "Blinkit Refund",
    amount: 125,
    date: "2024-11-26",
    provider: "Blinkit",
    description: "Refund for out of stock item",
    fromAccount: "Blinkit",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-004",
    status: "completed",
    method: "UPI",
    orderId: "BLK-002",
    refundReason: "Item out of stock"
  },
  "refund-5": {
    id: "refund-5",
    type: "refund",
    title: "BigBasket Refund",
    amount: 540,
    date: "2024-11-21",
    provider: "BigBasket",
    description: "Refund for damaged items received",
    fromAccount: "BigBasket",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-005",
    status: "completed",
    method: "UPI",
    orderId: "BBK-002",
    refundReason: "Damaged items"
  },
  "refund-6": {
    id: "refund-6",
    type: "refund",
    title: "Dunzo Refund",
    amount: 90,
    date: "2024-11-19",
    provider: "Dunzo",
    description: "Refund for undelivered order",
    fromAccount: "Dunzo",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-006",
    status: "completed",
    method: "UPI",
    orderId: "DNZ-002",
    refundReason: "Delivery not received"
  },
  "refund-7": {
    id: "refund-7",
    type: "refund",
    title: "Zepto Refund",
    amount: 165,
    date: "2024-11-16",
    provider: "Zepto",
    description: "Refund for incorrect quantity",
    fromAccount: "Zepto",
    toAccount: "HDFC Bank ****1234",
    transactionId: "RFD-TX-007",
    status: "completed",
    method: "UPI",
    orderId: "ZPT-002",
    refundReason: "Wrong quantity"
  }
};

export default function TransactionDetail() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { goBack } = useNavigationHistory();

  const transaction = MOCK_TRANSACTIONS[id || ""] || MOCK_TRANSACTIONS["received-1"];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const amountColor = (transaction.type === "received" || transaction.type === "deposit" || transaction.type === "insurance_claim" || transaction.type === "insurance_refund" || transaction.type === "refund") ? "text-green-400" : "text-red-400";
  const amountSign = (transaction.type === "received" || transaction.type === "deposit" || transaction.type === "insurance_claim" || transaction.type === "insurance_refund" || transaction.type === "refund") ? "+" : transaction.type === "family_upi" ? "" : "-";
  const icon = (transaction.type === "received" || transaction.type === "deposit" || transaction.type === "insurance_claim" || transaction.type === "insurance_refund" || transaction.type === "refund") ? ArrowDownRight : ArrowUpRight;
  const IconComponent = icon;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">TRANSACTION DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {transaction.type === "deposit" ? "Wallet Deposit" : 
               transaction.type === "withdrawal" ? "Wallet Withdrawal" :
               transaction.type === "family_upi" ? "Family UPI Payment" :
               transaction.type === "insurance_premium" ? "Insurance Premium" :
               transaction.type === "insurance_claim" ? "Insurance Claim" :
               transaction.type === "insurance_refund" ? "Insurance Refund" :
               transaction.type === "refund" ? "Refund Received" :
               transaction.type === "received" ? "Money Received" : "Money Sent"}
            </p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Transaction Status Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-16 h-16 border-2 ${(transaction.type === "received" || transaction.type === "refund" || transaction.type === "deposit" || transaction.type === "insurance_claim" || transaction.type === "insurance_refund") ? "border-green-400/30 bg-green-400/10" : "border-red-400/30 bg-red-400/10"} flex items-center justify-center`}>
              <IconComponent className={`h-8 w-8 ${amountColor}`} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className={`text-4xl font-light tracking-tight ${amountColor}`}>
              {amountSign}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-sm text-white/60 font-light">{transaction.title}</p>
            <Badge className={
              transaction.status === "completed" || transaction.status === "success"
                ? "bg-green-500/10 text-green-400 border-green-400/20 rounded-none"
                : transaction.status === "pending"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/20 rounded-none"
                : "bg-red-500/10 text-red-400 border-red-400/20 rounded-none"
            }>
              {transaction.status === "completed" || transaction.status === "success" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : transaction.status === "pending" ? (
                <Clock className="h-3 w-3 mr-1" />
              ) : null}
              {transaction.status}
            </Badge>
          </div>
        </div>

        {/* Transaction Information */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Transaction Information</p>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Date</span>
              </div>
              <span className="text-sm text-white font-light">{formatDate(transaction.date)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Transaction ID</span>
              </div>
              <span className="text-sm text-white font-light font-mono">{transaction.transactionId}</span>
            </div>

            {transaction.provider && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Provider</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.provider}</span>
              </div>
            )}

            {transaction.reference && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Reference</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.reference}</span>
              </div>
            )}

            {transaction.memberName && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Member</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.memberName}</span>
              </div>
            )}

            {transaction.familyAccountName && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Family Account</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.familyAccountName}</span>
              </div>
            )}

            {transaction.requiresApproval && transaction.approverName && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Approved By</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.approverName}</span>
              </div>
            )}

            {transaction.policyNumber && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Policy Number</span>
                </div>
                <span className="text-sm text-white font-light font-mono">{transaction.policyNumber}</span>
              </div>
            )}

            {transaction.policyName && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Policy Name</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.policyName}</span>
              </div>
            )}

            {transaction.claimNumber && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Claim Number</span>
                </div>
                <span className="text-sm text-white font-light font-mono">{transaction.claimNumber}</span>
              </div>
            )}

            {transaction.method && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Payment Method</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.method}</span>
              </div>
            )}

            {transaction.orderId && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Order ID</span>
                </div>
                <span className="text-sm text-white font-light font-mono">{transaction.orderId}</span>
              </div>
            )}

            {transaction.refundReason && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <span className="text-sm text-white/60">Refund Reason</span>
                </div>
                <span className="text-sm text-white font-light">{transaction.refundReason}</span>
              </div>
            )}

            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Description</span>
              </div>
              <span className="text-sm text-white font-light text-right">{transaction.description}</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Account Details</p>
          
          <div className="space-y-3">
            {transaction.fromAccount && (
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">From Account</p>
                <p className="text-sm text-white font-light">{transaction.fromAccount}</p>
              </div>
            )}

            {transaction.toAccount && (
              <div className="space-y-1 pt-2">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">To Account</p>
                <p className="text-sm text-white font-light">{transaction.toAccount}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
        <Button
          onClick={() => window.history.back()}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light tracking-wider"
          data-testid="button-back-to-history"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
