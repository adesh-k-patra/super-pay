import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Share2,
  RotateCcw
} from "lucide-react";

const allTransactions = [
  { id: "1", accountId: "1", accountName: "Personal", number: "98765 43210", operator: "Airtel", amount: 199, plan: "2GB/day - 28 days", date: "15 Sep 2024", time: "10:30 AM", status: "Success", transactionId: "TXN123456789001", paymentMethod: "UPI", validity: "28 days", data: "2GB/day", calls: "Unlimited", sms: "100/day" },
  { id: "2", accountId: "1", accountName: "Personal", number: "98765 43210", operator: "Airtel", amount: 479, plan: "1.5GB/day - 56 days", date: "10 Aug 2024", time: "03:15 PM", status: "Success", transactionId: "TXN123456789002", paymentMethod: "UPI", validity: "56 days", data: "1.5GB/day", calls: "Unlimited", sms: "100/day" },
  { id: "3", accountId: "2", accountName: "Work Phone", number: "91234 56789", operator: "Jio", amount: 299, plan: "1.5GB/day - 28 days", date: "05 Aug 2024", time: "02:45 PM", status: "Success", transactionId: "TXN123456789003", paymentMethod: "UPI", validity: "28 days", data: "1.5GB/day", calls: "Unlimited", sms: "100/day" },
  { id: "4", accountId: "1", accountName: "Personal", number: "98765 43210", operator: "Airtel", amount: 199, plan: "2GB/day - 28 days", date: "15 Jul 2024", time: "11:30 AM", status: "Success", transactionId: "TXN123456789004", paymentMethod: "UPI", validity: "28 days", data: "2GB/day", calls: "Unlimited", sms: "100/day" },
  { id: "5", accountId: "3", accountName: "Mom's Number", number: "98888 77777", operator: "Vi", amount: 399, plan: "2.5GB/day - 56 days", date: "10 Jul 2024", time: "04:20 PM", status: "Success", transactionId: "TXN123456789005", paymentMethod: "UPI", validity: "56 days", data: "2.5GB/day", calls: "Unlimited", sms: "100/day" },
  { id: "6", accountId: "2", accountName: "Work Phone", number: "91234 56789", operator: "Jio", amount: 499, plan: "75GB Monthly - Postpaid", date: "01 Jul 2024", time: "01:15 PM", status: "Success", transactionId: "TXN123456789006", paymentMethod: "UPI", validity: "Monthly", data: "75GB", calls: "Unlimited", sms: "100/day" },
];

export default function MobileTransactionDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/mobile-recharge/transaction/:id");

  const transaction = allTransactions.find(txn => txn.id === params?.id) || allTransactions[0];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate("/mobile-recharge")}
            className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 hover:border-white/20 h-12 font-light tracking-wide rounded-none"
            data-testid="button-recharge-again"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
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
