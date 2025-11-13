import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Zap,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Download,
  Receipt,
  MapPin,
  Phone,
  DollarSign,
  FileText,
  Star,
  Info,
  Gift,
  Sparkles
} from "lucide-react";

interface BillDetail {
  id: string;
  serviceProvider: string;
  billType: string;
  consumerNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  billDate: string;
  status: string;
  address: string;
  serviceConnection: string;
  sanctionedLoad: string;
  meterNumber: string;
  billPeriod: string;
  previousReading: string;
  currentReading: string;
  unitsConsumed: string;
  ratePerUnit: string;
  energyCharges: number;
  fixedCharges: number;
  taxes: number;
  totalAmount: number;
  convenienceFee: number;
  paymentHistory: Array<{
    billMonth: string;
    amount: number;
    paidDate: string;
    status: string;
  }>;
  billDetails: {
    supplyType: string;
    tariffCategory: string;
    billingCycle: string;
    rebateEligible: boolean;
    rebateAmount: number;
    lastPaymentDate: string;
  };
}

const MOCK_BILL_DETAILS: Record<string, BillDetail> = {
  "kseb-001": {
    id: "kseb-001",
    serviceProvider: "Kerala State Electricity Board (KSEB)",
    billType: "electricity",
    consumerNumber: "1165197013517",
    customerName: "Rajesh Kumar",
    amount: 1563.00,
    dueDate: "2024-10-25",
    billDate: "2024-09-25",
    status: "pending",
    address: "TC 25/1234, Pattom, Thiruvananthapuram, Kerala - 695004",
    serviceConnection: "LT-I Domestic",
    sanctionedLoad: "3 KW",
    meterNumber: "12345678",
    billPeriod: "Sep 2024",
    previousReading: "25847",
    currentReading: "26125",
    unitsConsumed: "278",
    ratePerUnit: "4.80",
    energyCharges: 1334.40,
    fixedCharges: 75.00,
    taxes: 153.60,
    totalAmount: 1563.00,
    convenienceFee: 0.00,
    paymentHistory: [
      {
        billMonth: "Aug 2024",
        amount: 1245.50,
        paidDate: "2024-08-20",
        status: "paid"
      },
      {
        billMonth: "Jul 2024", 
        amount: 1387.80,
        paidDate: "2024-07-18",
        status: "paid"
      },
      {
        billMonth: "Jun 2024",
        amount: 1156.20,
        paidDate: "2024-06-22",
        status: "paid"
      }
    ],
    billDetails: {
      supplyType: "Single Phase",
      tariffCategory: "LT-I(A) - Domestic",
      billingCycle: "Monthly",
      rebateEligible: true,
      rebateAmount: 25.00,
      lastPaymentDate: "2024-08-20"
    }
  },
  "5": {
    id: "5",
    serviceProvider: "BESCOM",
    billType: "electricity",
    consumerNumber: "9876543210",
    customerName: "Joshua Kanatt",
    amount: 2100.00,
    dueDate: "2024-11-10",
    billDate: "2024-10-10",
    status: "paid",
    address: "123 Main Street, Bangalore, Karnataka - 560001",
    serviceConnection: "LT-I Domestic",
    sanctionedLoad: "5 KW",
    meterNumber: "87654321",
    billPeriod: "Oct 2024",
    previousReading: "15230",
    currentReading: "15580",
    unitsConsumed: "350",
    ratePerUnit: "5.20",
    energyCharges: 1820.00,
    fixedCharges: 100.00,
    taxes: 180.00,
    totalAmount: 2100.00,
    convenienceFee: 0.00,
    paymentHistory: [
      {
        billMonth: "Oct 2024",
        amount: 2100.00,
        paidDate: "2024-11-10",
        status: "paid"
      },
      {
        billMonth: "Sep 2024",
        amount: 1950.00,
        paidDate: "2024-10-08",
        status: "paid"
      },
      {
        billMonth: "Aug 2024",
        amount: 2250.00,
        paidDate: "2024-09-12",
        status: "paid"
      }
    ],
    billDetails: {
      supplyType: "Single Phase",
      tariffCategory: "LT-I(A) - Domestic",
      billingCycle: "Monthly",
      rebateEligible: false,
      rebateAmount: 0.00,
      lastPaymentDate: "2024-11-10"
    }
  },
  "elec-paid-001": {
    id: "elec-paid-001",
    serviceProvider: "BESCOM",
    billType: "electricity",
    consumerNumber: "9876543210",
    customerName: "Joshua Kanatt",
    amount: 2100.00,
    dueDate: "2024-11-10",
    billDate: "2024-10-10",
    status: "paid",
    address: "123 Main Street, Bangalore, Karnataka - 560001",
    serviceConnection: "LT-I Domestic",
    sanctionedLoad: "5 KW",
    meterNumber: "87654321",
    billPeriod: "Oct 2024",
    previousReading: "15230",
    currentReading: "15580",
    unitsConsumed: "350",
    ratePerUnit: "5.20",
    energyCharges: 1820.00,
    fixedCharges: 100.00,
    taxes: 180.00,
    totalAmount: 2100.00,
    convenienceFee: 0.00,
    paymentHistory: [
      {
        billMonth: "Oct 2024",
        amount: 2100.00,
        paidDate: "2024-11-10",
        status: "paid"
      },
      {
        billMonth: "Sep 2024",
        amount: 1950.00,
        paidDate: "2024-10-08",
        status: "paid"
      },
      {
        billMonth: "Aug 2024",
        amount: 2250.00,
        paidDate: "2024-09-12",
        status: "paid"
      }
    ],
    billDetails: {
      supplyType: "Single Phase",
      tariffCategory: "LT-I(A) - Domestic",
      billingCycle: "Monthly",
      rebateEligible: false,
      rebateAmount: 0.00,
      lastPaymentDate: "2024-11-10"
    }
  },
  "fastag-001": {
    id: "fastag-001",
    serviceProvider: "NHAI FASTag",
    billType: "fastag",
    consumerNumber: "KA01AB1234",
    customerName: "Joshua Kanatt",
    amount: 500.00,
    dueDate: "2024-11-15",
    billDate: "2024-10-15",
    status: "paid",
    address: "123 Main Street, Bangalore, Karnataka - 560001",
    serviceConnection: "FASTag Recharge",
    sanctionedLoad: "N/A",
    meterNumber: "N/A",
    billPeriod: "Oct 2024",
    previousReading: "N/A",
    currentReading: "N/A",
    unitsConsumed: "N/A",
    ratePerUnit: "N/A",
    energyCharges: 500.00,
    fixedCharges: 0.00,
    taxes: 0.00,
    totalAmount: 500.00,
    convenienceFee: 0.00,
    paymentHistory: [
      {
        billMonth: "Oct 2024",
        amount: 500.00,
        paidDate: "2024-11-15",
        status: "paid"
      },
      {
        billMonth: "Sep 2024",
        amount: 500.00,
        paidDate: "2024-10-10",
        status: "paid"
      },
      {
        billMonth: "Aug 2024",
        amount: 500.00,
        paidDate: "2024-09-08",
        status: "paid"
      }
    ],
    billDetails: {
      supplyType: "FASTag",
      tariffCategory: "Toll Payment",
      billingCycle: "Monthly",
      rebateEligible: false,
      rebateAmount: 0.00,
      lastPaymentDate: "2024-11-15"
    }
  }
};

const MOCK_BILL_DETAIL = MOCK_BILL_DETAILS["kseb-001"];

export default function BillDetail() {
  const [, navigate] = useLocation();
  const { billId } = useParams<{ billId: string }>();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { data: billData = MOCK_BILL_DETAILS[billId || "kseb-001"] || MOCK_BILL_DETAIL, isLoading } = useQuery<BillDetail>({
    queryKey: ['/api/bill-payment/detail', billId],
    enabled: !!billId
  });

  const handleBack = () => {
    navigate("/bill-payment");
  };

  const handlePayBill = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: `Bill payment of ₹${billData.amount.toFixed(2)} completed successfully`,
      });
      
      setShowPaymentDialog(false);
      navigate("/upi-history");
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyConsumerNumber = () => {
    navigator.clipboard.writeText(billData.consumerNumber);
    toast({
      title: "Copied!",
      description: "Consumer number copied to clipboard",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(billData.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysUntilDue = getDaysUntilDue();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-none animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-light tracking-wider">Loading bill details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BILL DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{billData.serviceProvider}</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-download"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Bill Status & Amount - Card Based */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-none backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-none flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-base font-semibold tracking-wide">Electricity Bill</h2>
                  <p className="text-white/60 text-xs font-light">Consumer: {billData.consumerNumber}</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "font-light rounded-none border",
                  daysUntilDue < 0 ? "bg-red-500/20 text-red-400 border-red-500/30" :
                  daysUntilDue <= 3 ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                  "bg-green-500/20 text-green-400 border-green-500/30"
                )}
              >
                {daysUntilDue < 0 ? "Overdue" : 
                 daysUntilDue === 0 ? "Due Today" :
                 `${daysUntilDue} days left`}
              </Badge>
            </div>
            
            <div className="text-center py-4 border-t border-white/10">
              <p className="text-4xl font-light text-white mb-2 tracking-tight">
                {formatCurrency(billData.totalAmount)}
              </p>
              <p className="text-white/60 text-sm font-light tracking-wide uppercase">Amount Due</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-1">Bill Date</p>
                <p className="text-white font-medium">{new Date(billData.billDate).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-1">Due Date</p>
                <p className="text-white font-medium">{new Date(billData.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumer Details - Cardless Design */}
        <div className="space-y-3">
          <h3 className="text-white text-sm flex items-center gap-2 font-semibold tracking-wider uppercase">
            <User className="h-4 w-4" />
            Consumer Details
          </h3>
          <div className="border-l-2 border-white/20 pl-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Consumer Name</span>
              <span className="text-white font-medium">{billData.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Consumer Number</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{billData.consumerNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyConsumerNumber}
                  className="p-1 h-auto text-white/60 hover:text-white rounded-none"
                  data-testid="button-copy-consumer"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-white/60 text-xs mb-1 font-light uppercase tracking-wide">Service Address</p>
              <p className="text-white text-sm leading-relaxed font-light">{billData.address}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Connection Type</span>
              <span className="text-white font-medium">{billData.serviceConnection}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Sanctioned Load</span>
              <span className="text-white font-medium">{billData.sanctionedLoad}</span>
            </div>
          </div>
        </div>

        {/* Usage Details - Card Based */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-white text-sm flex items-center gap-2 font-semibold tracking-wider uppercase">
              <FileText className="h-4 w-4" />
              Usage Details - {billData.billPeriod}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 border border-white/10">
                <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-1">Previous</p>
                <p className="text-white font-semibold text-lg">{billData.previousReading}</p>
              </div>
              <div className="text-center p-3 bg-white/5 border border-white/10">
                <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-1">Current</p>
                <p className="text-white font-semibold text-lg">{billData.currentReading}</p>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <p className="text-3xl font-light text-white">{billData.unitsConsumed}</p>
              <p className="text-white/60 text-xs font-light tracking-wider uppercase mt-1">Units Consumed</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-white/60 text-sm font-light">Meter Number</span>
              <span className="text-white font-medium">{billData.meterNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Rate per Unit</span>
              <span className="text-white font-medium">₹{billData.ratePerUnit}</span>
            </div>
          </CardContent>
        </Card>

        {/* Bill Breakdown - Cardless Design */}
        <div className="space-y-3">
          <h3 className="text-white text-sm flex items-center gap-2 font-semibold tracking-wider uppercase">
            <Receipt className="h-4 w-4" />
            Bill Breakdown
          </h3>
          <div className="border-l-2 border-white/20 pl-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Energy Charges</span>
              <span className="text-white font-medium">{formatCurrency(billData.energyCharges)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Fixed Charges</span>
              <span className="text-white font-medium">{formatCurrency(billData.fixedCharges)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm font-light">Taxes & Duties</span>
              <span className="text-white font-medium">{formatCurrency(billData.taxes)}</span>
            </div>
            {billData.billDetails.rebateEligible && (
              <div className="flex justify-between items-center">
                <span className="text-green-400/80 text-sm font-light">Rebate (Early Payment)</span>
                <span className="text-green-400 font-medium">-{formatCurrency(billData.billDetails.rebateAmount)}</span>
              </div>
            )}
            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold tracking-wide uppercase text-sm">Total Amount</span>
                <span className="text-white font-bold text-xl">{formatCurrency(billData.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History - Card Based */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-white text-sm flex items-center gap-2 font-semibold tracking-wider uppercase">
              <Clock className="h-4 w-4" />
              Payment History
            </h3>
            <div className="space-y-3">
              {billData.paymentHistory.map((payment: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 last:border-white/20">
                  <div>
                    <p className="text-white font-medium text-sm">{payment.billMonth}</p>
                    <p className="text-white/60 text-xs font-light">Paid on {new Date(payment.paidDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatCurrency(payment.amount)}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-green-400 text-xs font-light">Paid</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Fixed Bottom Buttons */}
      {billData.status === "pending" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <Button
            onClick={() => setShowPaymentDialog(true)}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 font-light tracking-wider text-lg"
            data-testid="button-pay-now"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay {formatCurrency(billData.totalAmount)}
          </Button>
        </div>
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-sm bg-black text-white border-white/20 rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider text-white">Confirm Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-white/5 rounded-none">
              <p className="text-2xl font-light text-white">{formatCurrency(billData.totalAmount)}</p>
              <p className="text-white/60 text-sm font-light">Kerala State Electricity Board</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Consumer Number</span>
                <span className="text-white font-light">{billData.consumerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Customer Name</span>
                <span className="text-white font-light">{billData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 font-light">Due Date</span>
                <span className="text-white font-light">{new Date(billData.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
                onClick={() => setShowPaymentDialog(false)}
                disabled={isProcessing}
                data-testid="button-cancel-payment"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                onClick={handlePayBill}
                disabled={isProcessing}
                data-testid="button-confirm-payment"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-none animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
