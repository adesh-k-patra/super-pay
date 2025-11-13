import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  ArrowLeft,
  Smartphone,
  ChevronRight,
  Calendar,
  Zap,
  AlertCircle,
  X
} from "lucide-react";

export default function MobileRechargeDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/mobile-recharge/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("details");
  const [isDueCardVisible, setIsDueCardVisible] = useState(true);

  // Mock account data based on ID
  const account = {
    id: params?.id,
    name: "Personal",
    number: "98765 43210",
    operator: "Airtel",
    type: "Prepaid",
    balance: "₹45.20",
    lastRecharge: "15 Sep 2024",
    validity: "28 days remaining",
    dueAmount: 199,
    dueDate: "20 Oct 2024"
  };

  const accountTransactions = [
    { id: 1, amount: 199, date: "15 Sep 2024", status: "Success", plan: "2GB/day - 28 days", time: "10:30 AM" },
    { id: 2, amount: 479, date: "10 Aug 2024", status: "Success", plan: "1.5GB/day - 56 days", time: "03:15 PM" },
    { id: 3, amount: 199, date: "15 Jul 2024", status: "Success", plan: "2GB/day - 28 days", time: "11:45 AM" },
    { id: 4, amount: 299, date: "10 Jun 2024", status: "Success", plan: "1.5GB/day - 28 days", time: "09:20 AM" },
  ];

  const handleRecharge = () => {
    navigate("/mobile-recharge/new");
  };

  const handleTransactionClick = (transaction: any) => {
    navigate(`/mobile-recharge/transaction/${transaction.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider">ACCOUNT DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{account.name}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Account Info Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 border border-white/20 flex items-center justify-center">
              <Smartphone className="h-7 w-7 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-light text-xl tracking-wide mb-1">{account.name}</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator} • {account.type}</p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
              Active
            </Badge>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Mobile Number</span>
              <span className="text-white font-light">{account.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Current Balance</span>
              <span className="text-white font-light">{account.balance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Last Recharge</span>
              <span className="text-white font-light">{account.lastRecharge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Validity</span>
              <span className="text-white font-light">{account.validity}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-details"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6 space-y-4">
            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
              <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Account Name</span>
                  <span className="text-white font-light">{account.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Operator</span>
                  <span className="text-white font-light">{account.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Connection Type</span>
                  <span className="text-white font-light">{account.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Number</span>
                  <span className="text-white font-light">{account.number}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recharge History</p>
            {accountTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.plan}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      {transaction.status}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {isDueCardVisible && account.dueAmount && (
        <div className="px-4 pb-4">
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4 flex items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="h-5 w-5 text-white/60 mt-1" />
              <div>
                <h3 className="text-sm font-light text-white tracking-wide mb-2">Due Payment</h3>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-white">₹{account.dueAmount}</p>
                  <p className="text-white/60 text-xs">Due Date: <span className="text-white font-light">{account.dueDate}</span></p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  transactionType: 'mobile-recharge',
                  amount: account.dueAmount.toString(),
                  accountName: account.name,
                  mobileNumber: account.number,
                  operator: account.operator,
                  returnUrl: `/mobile-recharge/${account.id}`
                });
                navigate(`/upi-payment?${params.toString()}`);
              }}
              className="bg-red-500 hover:bg-red-600 text-white h-10 px-10 font-light tracking-wide rounded-none min-w-[100px]"
              data-testid="button-pay-due"
            >
              Pay
            </Button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={() => {
            if (isDueCardVisible && account.dueAmount) {
              const params = new URLSearchParams({
                transactionType: 'mobile-recharge',
                amount: account.dueAmount.toString(),
                accountName: account.name,
                mobileNumber: account.number,
                operator: account.operator,
                returnUrl: `/mobile-recharge/${account.id}`
              });
              navigate(`/upi-payment?${params.toString()}`);
            } else {
              handleRecharge();
            }
          }}
          className="w-full bg-white/10 hover:bg-white/15 text-white h-12 font-light text-base tracking-wide rounded-none flex items-center justify-center gap-2"
          data-testid="button-recharge"
        >
          <Zap className="h-4 w-4" />
          Recharge Now
        </Button>
      </div>
    </div>
  );
}
