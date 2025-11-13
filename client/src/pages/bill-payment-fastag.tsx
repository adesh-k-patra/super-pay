import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Car,
  Plus,
  ChevronRight,
  Calendar
} from "lucide-react";

interface SavedAccount {
  id: string;
  name: string;
  vehicleNumber: string;
  fastagId: string;
  bank: string;
  balance: string;
}

interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  vehicleNumber: string;
  fastagId: string;
  amount: number;
  date: string;
  time: string;
  status: string;
}

const savedAccounts: SavedAccount[] = [
  { id: "1", name: "Personal Car", vehicleNumber: "MH 02 AB 1234", fastagId: "1234567890", bank: "HDFC Bank", balance: "₹850" },
  { id: "2", name: "Office Car", vehicleNumber: "DL 01 CD 5678", fastagId: "9876543210", bank: "ICICI Bank", balance: "₹1,200" },
  { id: "3", name: "Bike", vehicleNumber: "MH 12 EF 9012", fastagId: "5555666677", bank: "Paytm Payments Bank", balance: "₹450" },
  { id: "4", name: "Delivery Van", vehicleNumber: "GJ 05 XY 3456", fastagId: "1122334455", bank: "Axis Bank", balance: "₹650" },
  { id: "5", name: "Company Truck", vehicleNumber: "KA 03 PQ 7890", fastagId: "9988776655", bank: "SBI", balance: "₹2,500" },
  { id: "6", name: "Family SUV", vehicleNumber: "TN 09 RS 2468", fastagId: "4433221100", bank: "Kotak Mahindra Bank", balance: "₹1,100" },
  { id: "7", name: "Scooter", vehicleNumber: "UP 16 TU 1357", fastagId: "7766554433", bank: "Airtel Payments Bank", balance: "₹300" },
];

const allTransactions: Transaction[] = [
  { id: "1", accountId: "1", accountName: "Personal Car", vehicleNumber: "MH 02 AB 1234", fastagId: "1234567890", amount: 500, date: "15 Sep 2024", time: "10:30 AM", status: "Success" },
  { id: "2", accountId: "1", accountName: "Personal Car", vehicleNumber: "MH 02 AB 1234", fastagId: "1234567890", amount: 1000, date: "10 Aug 2024", time: "03:15 PM", status: "Success" },
  { id: "3", accountId: "2", accountName: "Office Car", vehicleNumber: "DL 01 CD 5678", fastagId: "9876543210", amount: 1500, date: "20 Sep 2024", time: "02:45 PM", status: "Success" },
  { id: "4", accountId: "1", accountName: "Personal Car", vehicleNumber: "MH 02 AB 1234", fastagId: "1234567890", amount: 500, date: "15 Jul 2024", time: "11:45 AM", status: "Success" },
  { id: "5", accountId: "3", accountName: "Bike", vehicleNumber: "MH 12 EF 9012", fastagId: "5555666677", amount: 300, date: "10 Sep 2024", time: "04:20 PM", status: "Success" },
  { id: "6", accountId: "2", accountName: "Office Car", vehicleNumber: "DL 01 CD 5678", fastagId: "9876543210", amount: 1500, date: "20 Aug 2024", time: "01:15 PM", status: "Success" },
  { id: "7", accountId: "4", accountName: "Delivery Van", vehicleNumber: "GJ 05 XY 3456", fastagId: "1122334455", amount: 800, date: "22 Aug 2024", time: "09:30 AM", status: "Success" },
  { id: "8", accountId: "5", accountName: "Company Truck", vehicleNumber: "KA 03 PQ 7890", fastagId: "9988776655", amount: 2000, date: "28 Jul 2024", time: "02:15 PM", status: "Success" },
  { id: "9", accountId: "6", accountName: "Family SUV", vehicleNumber: "TN 09 RS 2468", fastagId: "4433221100", amount: 1200, date: "05 Aug 2024", time: "11:00 AM", status: "Success" },
  { id: "10", accountId: "7", accountName: "Scooter", vehicleNumber: "UP 16 TU 1357", fastagId: "7766554433", amount: 400, date: "18 Jul 2024", time: "04:45 PM", status: "Success" },
  { id: "11", accountId: "1", accountName: "Personal Car", vehicleNumber: "MH 02 AB 1234", fastagId: "1234567890", amount: 600, date: "02 Jul 2024", time: "10:20 AM", status: "Success" },
  { id: "12", accountId: "3", accountName: "Bike", vehicleNumber: "MH 12 EF 9012", fastagId: "5555666677", amount: 350, date: "12 Jun 2024", time: "03:50 PM", status: "Success" },
];

export default function BillPaymentFASTag() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");

  const recentTransactions = allTransactions.slice(0, 3);

  const handleAccountClick = (accountId: string) => {
    navigate(`/fastag-recharge/${accountId}`);
  };

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/fastag-recharge/transaction/${transactionId}`);
  };

  const handleAddNew = () => {
    navigate("/add-fastag-account");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FASTAG RECHARGE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All Banks</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddNew}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-new"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* FASTag Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="fastag-summary">
          <div className="space-y-6">
            {/* Total Recharges Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Recharges</p>
                <div className="flex items-center gap-2">
                  <Car className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-fastag-recharges">
                ₹{(recentTransactions.reduce((sum, t) => sum + t.amount, 0) / 1000).toFixed(1)}K
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-recharge-count">
                <p className="text-lg font-light text-white" data-testid="text-recharge-count">
                  {recentTransactions.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Recharges</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-vehicles">
                <p className="text-lg font-light text-white" data-testid="text-vehicles">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Vehicles</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  ₹{recentTransactions.length > 0 ? Math.round(recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length) : 0}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Avg Amount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-recent"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="accounts" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-accounts"
            >
              Accounts
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Recent Tab */}
          <TabsContent value="recent" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Accounts & Transactions</p>
            {savedAccounts.slice(0, 2).map((account) => (
              <div
                key={account.id}
                onClick={() => handleAccountClick(account.id)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-recent-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Car className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.vehicleNumber} • {account.bank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-white font-light">{account.balance}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Balance</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction.id)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-recent-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.vehicleNumber}</p>
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

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Saved Accounts</p>
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleAccountClick(account.id)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Car className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.vehicleNumber} • {account.bank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-white font-light">{account.balance}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Balance</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Transactions</p>
            {allTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction.id)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.vehicleNumber}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                        {transaction.status}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
