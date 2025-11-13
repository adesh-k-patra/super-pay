import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Share2,
  Repeat
} from "lucide-react";

export default function MobileRechargeTransaction() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/mobile-recharge/transaction/:id");

  // Mock transaction data
  const transaction = {
    id: params?.id,
    accountName: "Personal",
    number: "98765 43210",
    operator: "Airtel",
    amount: 199,
    plan: "2GB/day - 28 days",
    date: "15 Sep 2024",
    time: "10:30 AM",
    status: "Success",
    transactionId: "TXN123456789012",
    paymentMethod: "UPI",
    validity: "28 days",
    data: "2GB/day",
    calls: "Unlimited",
    sms: "100/day"
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/mobile-recharge")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">TRANSACTION DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Mobile Recharge</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Status Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 text-center">
          <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white/80" />
          </div>
          <h2 className="text-3xl font-light text-white tracking-tight mb-2">₹{transaction.amount}</h2>
          <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
            {transaction.status}
          </Badge>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mt-4">
            {transaction.date} • {transaction.time}
          </p>
        </div>

        {/* Account Details */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Account Name</span>
              <span className="text-white font-light">{transaction.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Mobile Number</span>
              <span className="text-white font-light">{transaction.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Operator</span>
              <span className="text-white font-light">{transaction.operator}</span>
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Plan Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Plan</span>
              <span className="text-white font-light">{transaction.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Validity</span>
              <span className="text-white font-light">{transaction.validity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Data</span>
              <span className="text-white font-light">{transaction.data}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Calls</span>
              <span className="text-white font-light">{transaction.calls}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">SMS</span>
              <span className="text-white font-light">{transaction.sms}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Payment Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Transaction ID</span>
              <span className="text-white font-light">{transaction.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Payment Method</span>
              <span className="text-white font-light">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Amount Paid</span>
              <span className="text-white font-light">₹{transaction.amount}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="grid grid-cols-2 gap-3 w-full max-w-screen-lg mx-auto">
          <Button
            onClick={() => {
              const paymentParams = new URLSearchParams({
                transactionType: 'mobile-recharge',
                amount: transaction.amount.toString(),
                accountName: transaction.accountName,
                accountNumber: transaction.number,
                operator: transaction.operator,
                planDetails: transaction.plan,
                returnUrl: '/mobile-recharge'
              });
              navigate(`/upi-payment?${paymentParams.toString()}`);
            }}
            className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 hover:border-white/20 h-12 font-light tracking-wide rounded-none"
            data-testid="button-recharge-again"
          >
            <Repeat className="h-4 w-4 mr-2" />
            Recharge Again
          </Button>
          <Button
            className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 hover:border-white/20 h-12 font-light tracking-wide rounded-none"
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
