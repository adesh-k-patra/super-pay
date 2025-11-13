import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Share2,
  Repeat
} from "lucide-react";

const allTransactions = [
  { id: "1", accountId: "1", accountName: "Personal Car", vehicleNumber: "MH 01 AB 1234", fastagId: "FT123456789", provider: "ICICI Bank", amount: 500, date: "15 Sep 2024", time: "10:30 AM", status: "Success", transactionId: "TXN123456789001", paymentMethod: "UPI", tollName: "Mumbai Pune Expressway", location: "Lonavala" },
  { id: "2", accountId: "1", accountName: "Personal Car", vehicleNumber: "MH 01 AB 1234", fastagId: "FT123456789", provider: "ICICI Bank", amount: 250, date: "10 Aug 2024", time: "03:15 PM", status: "Success", transactionId: "TXN123456789002", paymentMethod: "UPI", tollName: "Ahmedabad Vadodara", location: "Nadiad" },
  { id: "3", accountId: "2", accountName: "Office Car", vehicleNumber: "MH 02 CD 5678", fastagId: "FT987654321", provider: "HDFC Bank", amount: 350, date: "05 Aug 2024", time: "02:45 PM", status: "Success", transactionId: "TXN123456789003", paymentMethod: "UPI", tollName: "Delhi Jaipur Highway", location: "Gurgaon" },
];

export default function FASTagRechargeTransaction() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/fastag-recharge/transaction/:id");

  const transaction = allTransactions.find(txn => txn.id === params?.id) || allTransactions[0];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fastag")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">TRANSACTION DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">FASTag Recharge</p>
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
              <span className="text-white/60 font-light">Vehicle Number</span>
              <span className="text-white font-light">{transaction.vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">FASTag ID</span>
              <span className="text-white font-light">{transaction.fastagId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Provider</span>
              <span className="text-white font-light">{transaction.provider}</span>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Transaction Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Toll Name</span>
              <span className="text-white font-light">{transaction.tollName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-light">Location</span>
              <span className="text-white font-light">{transaction.location}</span>
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

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="grid grid-cols-2 gap-3 w-full max-w-screen-lg mx-auto">
          <Button
            onClick={() => {
              const paymentParams = new URLSearchParams({
                transactionType: 'fastag-recharge',
                amount: transaction.amount.toString(),
                accountName: transaction.accountName,
                vehicleNumber: transaction.vehicleNumber,
                fastagId: transaction.fastagId,
                returnUrl: '/fastag'
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
