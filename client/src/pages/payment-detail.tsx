import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Share2, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Send,
  Receipt,
  CreditCard,
  Building2,
  User,
  Calendar,
  Hash,
  IndianRupee,
  Award,
  Shield,
  Info,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentDetail {
  id: string;
  transactionId: string;
  referenceNumber?: string;
  amount: number;
  fee?: number;
  totalAmount: number;
  status: 'success' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: {
    type: 'upi' | 'card' | 'bank_transfer';
    details: string;
    provider?: string;
  };
  recipient: {
    name: string;
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  sender: {
    name: string;
    upiId?: string;
    accountNumber?: string;
  };
  description: string;
  category: string;
  timestamp: string;
  completedAt?: string;
  failureReason?: string;
  cashbackEarned?: number;
  rewardsEarned?: number;
  refundDetails?: {
    amount: number;
    status: 'processing' | 'completed' | 'failed';
    reason: string;
    estimatedDate: string;
  };
  breakdown: {
    baseAmount: number;
    taxes?: number;
    discount?: number;
    convenience_fee?: number;
    total: number;
  };
  merchantDetails?: {
    name: string;
    category: string;
    logo?: string;
    mcc?: string;
    address?: string;
  };
  securityInfo?: {
    encrypted: boolean;
    location?: string;
    deviceId?: string;
  };
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return {
          icon: CheckCircle,
          text: status === 'success' ? 'Successful' : 'Completed',
          className: 'bg-white/5 text-white/80 border-white/20'
        };
      case 'failed':
      case 'cancelled':
        return {
          icon: XCircle,
          text: status === 'failed' ? 'Failed' : 'Cancelled',
          className: 'bg-white/5 text-red-800 border-white/20'
        };
      case 'pending':
      case 'processing':
        return {
          icon: Clock,
          text: status === 'pending' ? 'Pending' : 'Processing',
          className: 'bg-yellow-100 text-yellow-800 border-white/20'
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Unknown',
          className: 'bg-white/10 text-white border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={cn("flex items-center gap-1 px-3 py-1", config.className)}>
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}

// Transaction Header Component
function TransactionHeader({ payment, onBack, onShare, onDownload }: { 
  payment: PaymentDetail, 
  onBack: () => void, 
  onShare: () => void,
  onDownload: () => void
}) {
  const getHeaderGradient = (status: string) => {
    switch (status) {
      case 'success': return 'from-white/10 to-white/5';
      case 'failed': 
      case 'cancelled': return 'from-red-600 to-red-800';
      case 'pending': return 'from-yellow-600 to-yellow-800';
      default: return 'from-white/10 to-white/5';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'upi': return Send;
      case 'card': return CreditCard;
      case 'bank_transfer': return Building2;
      default: return Send;
    }
  };

  const TransactionIcon = getTransactionIcon(payment.paymentMethod.type);

  return (
    <div className={cn(
      "relative px-6 pt-12 pb-8 text-white overflow-hidden",
      `bg-gradient-to-br ${getHeaderGradient(payment.status)}`
    )}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-none -translate-x-48 -translate-y-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-none translate-x-36 translate-y-36 blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              onClick={onShare}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={onDownload}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
              data-testid="button-download"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="flex items-start gap-6">
          {/* Transaction Icon */}
          <div className="w-20 h-20 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/10">
            <TransactionIcon className="h-10 w-10 text-white" />
          </div>
          
          {/* Transaction Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white tracking-wider" data-testid="text-transaction-title">
                PAYMENT {payment.status.toUpperCase()}
              </h1>
              <StatusBadge status={payment.status} />
            </div>
            
            <p className="text-white/80 text-lg mb-4 leading-relaxed">
              {payment.description || `Payment to ${payment.recipient.name}`}
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">₹{payment.amount.toLocaleString()}</p>
                <p className="text-white/60 text-sm">Amount</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {new Date(payment.timestamp).toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </p>
                <p className="text-white/60 text-sm">Date</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {new Date(payment.timestamp).toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-white/60 text-sm">Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Transaction Details Grid
function TransactionDetailsGrid({ payment }: { payment: PaymentDetail }) {
  const [isCopied, setIsCopied] = useState('');
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(label);
    setTimeout(() => setIsCopied(''), 2000);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Transaction Details */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-primary" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{payment.transactionId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => copyToClipboard(payment.transactionId, 'Transaction ID')}
                  >
                    {isCopied === 'Transaction ID' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              {payment.referenceNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Reference Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{payment.referenceNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => copyToClipboard(payment.referenceNumber!, 'Reference Number')}
                    >
                      {isCopied === 'Reference Number' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Payment Method</span>
                <div className="text-right">
                  <p className="font-medium">{payment.paymentMethod.type.toUpperCase()}</p>
                  <p className="text-xs text-white/60">{payment.paymentMethod.details}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Category</span>
                <Badge variant="outline">{payment.category}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participant Details */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sender */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/60">From</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-none flex items-center justify-center">
                  <User className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="font-semibold">{payment.sender.name}</p>
                  {payment.sender.upiId && (
                    <p className="text-sm text-white/60">{payment.sender.upiId}</p>
                  )}
                  {payment.sender.accountNumber && (
                    <p className="text-xs text-white/60">••••••{payment.sender.accountNumber.slice(-4)}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="py-2">
              <Send className="h-4 w-4 text-white/60 mx-auto" />
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/60">To</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-none flex items-center justify-center">
                  <User className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="font-semibold">{payment.recipient.name}</p>
                  {payment.recipient.upiId && (
                    <p className="text-sm text-white/60">{payment.recipient.upiId}</p>
                  )}
                  {payment.recipient.accountNumber && (
                    <p className="text-xs text-white/60">••••••{payment.recipient.accountNumber.slice(-4)}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Breakdown */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <IndianRupee className="h-5 w-5 text-primary" />
              Amount Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Base Amount</span>
                <span className="font-medium">{formatCurrency(payment.breakdown.baseAmount)}</span>
              </div>
              
              {payment.breakdown.discount && payment.breakdown.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Discount</span>
                  <span className="text-white/80 font-medium">-{formatCurrency(payment.breakdown.discount)}</span>
                </div>
              )}
              
              {payment.breakdown.taxes && payment.breakdown.taxes > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Taxes</span>
                  <span className="font-medium">{formatCurrency(payment.breakdown.taxes)}</span>
                </div>
              )}
              
              {payment.fee && payment.fee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Transaction Fee</span>
                  <span className="font-medium">{formatCurrency(payment.fee)}</span>
                </div>
              )}
              
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Total Amount</span>
                <span className="text-base font-bold text-primary">{formatCurrency(payment.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white/10 rounded-none"></div>
                <div>
                  <p className="text-sm font-medium">Transaction Initiated</p>
                  <p className="text-xs text-white/60">
                    {new Date(payment.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              
              {payment.completedAt && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-none",
                    payment.status === 'success' ? 'bg-white/10' : 'bg-white/10'
                  )}></div>
                  <div>
                    <p className="text-sm font-medium">
                      Transaction {payment.status === 'success' ? 'Completed' : 'Failed'}
                    </p>
                    <p className="text-xs text-white/60">
                      {new Date(payment.completedAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
              
              {payment.status === 'pending' && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white/10 rounded-none animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">Processing Payment</p>
                    <p className="text-xs text-white/60">Usually takes 2-5 minutes</p>
                  </div>
                </div>
              )}
            </div>

            {payment.failureReason && (
              <div className="mt-4 p-3 bg-white/5 border border-white/20 rounded-none">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-white/80" />
                  <p className="text-sm font-medium text-red-800">Failure Reason</p>
                </div>
                <p className="text-sm text-white/80 mt-1">{payment.failureReason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rewards & Cashback */}
        {(payment.cashbackEarned || payment.rewardsEarned) && (
          <Card className="border-white/10 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                Rewards Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {payment.cashbackEarned && (
                  <div className="text-center p-4 bg-white/5 border border-white/20 rounded-none">
                    <p className="text-2xl font-bold text-white/80">+₹{payment.cashbackEarned.toFixed(2)}</p>
                    <p className="text-sm text-white/80 font-medium">Cashback Earned</p>
                  </div>
                )}
                {payment.rewardsEarned && (
                  <div className="text-center p-4 bg-white/5 border border-white/20 rounded-none">
                    <p className="text-2xl font-bold text-white/80">+{payment.rewardsEarned}</p>
                    <p className="text-sm text-white/80 font-medium">Reward Points</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Refund Information */}
        {payment.refundDetails && (
          <Card className="border-white/10 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-primary" />
                Refund Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-white/60">Refund Amount</p>
                  <p className="font-semibold">{formatCurrency(payment.refundDetails.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Status</p>
                  <StatusBadge status={payment.refundDetails.status} />
                </div>
                <div>
                  <p className="text-sm text-white/60">Reason</p>
                  <p className="font-medium">{payment.refundDetails.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Expected Date</p>
                  <p className="font-medium">
                    {new Date(payment.refundDetails.estimatedDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Support Actions */}
      <div className="mt-8">
        <Card className="border-white/10">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Need Help?</h3>
              <p className="text-white/60 text-sm">
                If you have any issues with this transaction, our support team is here to help
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Support
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Raise Dispute
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentDetail() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const transactionId = params.id;

  const { data: payment, isLoading, error } = useQuery<PaymentDetail>({
    queryKey: [`/api/transactions/${transactionId}`],
    enabled: !!transactionId
  });

  const handleShare = async () => {
    if (payment) {
      const shareText = `Payment Receipt\n₹${payment.amount.toLocaleString()} to ${payment.recipient.name}\nTransaction ID: ${payment.transactionId}\nStatus: ${payment.status.toUpperCase()}`;
      
      try {
        if (navigator.share) {
          await navigator.share({
            title: `Payment Receipt - ₹${payment.amount.toLocaleString()}`,
            text: shareText,
            url: window.location.href
          });
        } else {
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Receipt Copied",
            description: "Payment receipt copied to clipboard",
          });
        }
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to share receipt. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Receipt",
      description: "Receipt will be downloaded shortly",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-6 bg-white/5 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Payment Not Found</h2>
          <p className="text-white/60 mb-6">
            {error ? "Unable to load payment details. Please try again." : 
             "This payment record could not be found or may have been deleted."}
          </p>
          <Button
            onClick={() => navigate('/upi-history')}
            className="gap-2"
            data-testid="button-back-to-payments"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Transaction Header */}
      <TransactionHeader 
        payment={payment}
        onBack={() => navigate('/upi-history')}
        onShare={handleShare}
        onDownload={handleDownload}
      />
      
      {/* Transaction Details Grid */}
      <TransactionDetailsGrid payment={payment} />
    </div>
  );
}