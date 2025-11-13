import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Smartphone,
  Plus,
  ChevronRight,
  Clock
} from "lucide-react";

interface SavedAccount {
  id: string;
  name: string;
  number: string;
  operator: string;
  type: "Prepaid" | "Postpaid";
}

interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  number: string;
  operator: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  plan: string;
}

const savedAccounts: SavedAccount[] = [
  { id: "1", name: "Personal", number: "98765 43210", operator: "Airtel", type: "Prepaid" },
  { id: "2", name: "Work Phone", number: "91234 56789", operator: "Jio", type: "Postpaid" },
  { id: "3", name: "Mom's Number", number: "98888 77777", operator: "Vi", type: "Prepaid" },
  { id: "4", name: "Dad's Phone", number: "98777 66666", operator: "BSNL", type: "Prepaid" },
  { id: "5", name: "Sister", number: "91111 22222", operator: "Airtel", type: "Postpaid" },
  { id: "6", name: "Emergency", number: "98555 44444", operator: "Jio", type: "Prepaid" },
  { id: "7", name: "Office 2", number: "91999 88888", operator: "Vi", type: "Postpaid" },
];

const allTransactions: Transaction[] = [
  { id: "1", accountId: "1", accountName: "Personal", number: "98765 43210", operator: "Airtel", amount: 199, date: "15 Sep 2024", time: "10:30 AM", status: "Success", plan: "2GB/day - 28 days" },
  { id: "2", accountId: "1", accountName: "Personal", number: "98765 43210", operator: "Airtel", amount: 479, date: "10 Aug 2024", time: "03:15 PM", status: "Success", plan: "1.5GB/day - 56 days" },
  { id: "3", accountId: "2", accountName: "Work Phone", number: "91234 56789", operator: "Jio", amount: 299, date: "05 Aug 2024", time: "02:45 PM", status: "Success", plan: "1.5GB/day - 28 days" },
  { id: "4", accountId: "1", accountName: "Personal", number: "98765 43210", operator: "Airtel", amount: 199, date: "15 Jul 2024", time: "11:30 AM", status: "Success", plan: "2GB/day - 28 days" },
  { id: "5", accountId: "3", accountName: "Mom's Number", number: "98888 77777", operator: "Vi", amount: 399, date: "10 Jul 2024", time: "04:20 PM", status: "Success", plan: "2.5GB/day - 56 days" },
  { id: "6", accountId: "2", accountName: "Work Phone", number: "91234 56789", operator: "Jio", amount: 499, date: "01 Jul 2024", time: "01:15 PM", status: "Success", plan: "75GB Monthly - Postpaid" },
  { id: "7", accountId: "4", accountName: "Dad's Phone", number: "98777 66666", operator: "BSNL", amount: 99, date: "18 Sep 2024", time: "09:00 AM", status: "Success", plan: "1GB/day - 28 days" },
  { id: "8", accountId: "5", accountName: "Sister", number: "91111 22222", operator: "Airtel", amount: 599, date: "12 Sep 2024", time: "02:30 PM", status: "Success", plan: "Postpaid 299 Plan" },
  { id: "9", accountId: "6", accountName: "Emergency", number: "98555 44444", operator: "Jio", amount: 155, date: "08 Sep 2024", time: "07:15 PM", status: "Success", plan: "1.5GB/day - 24 days" },
  { id: "10", accountId: "7", accountName: "Office 2", number: "91999 88888", operator: "Vi", amount: 449, date: "22 Aug 2024", time: "11:00 AM", status: "Success", plan: "Postpaid 449 Plan" },
  { id: "11", accountId: "3", accountName: "Mom's Number", number: "98888 77777", operator: "Vi", amount: 399, date: "25 Jun 2024", time: "03:45 PM", status: "Success", plan: "2.5GB/day - 56 days" },
];

export default function BillPaymentMobile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");

  const recentTransactions = allTransactions.slice(0, 3);

  const handleAccountClick = (account: SavedAccount) => {
    navigate(`/mobile-recharge/account/${account.id}`);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    navigate(`/mobile-recharge/transaction/${transaction.id}`);
  };

  const handleAddNew = () => {
    navigate("/add-mobile-account");
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
            <h1 className="text-base font-bold tracking-wider">MOBILE RECHARGE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Prepaid & Postpaid</p>
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
        {/* Mobile Recharge Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="mobile-recharge-summary">
          <div className="space-y-6">
            {/* Total Recharges Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Recharges</p>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-recharges">
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
              <div className="space-y-1 text-center" data-testid="card-active-numbers">
                <p className="text-lg font-light text-white" data-testid="text-active-numbers">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Numbers</p>
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
            {savedAccounts.slice(0, 3).map((account) => (
              <div
                key={account.id}
                onClick={() => navigate(`/mobile-recharge/${account.id}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator} • {account.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      {account.type}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
            {recentTransactions.slice(0, 2).map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => navigate(`/mobile-recharge/${transaction.accountId}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-recent-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">{transaction.accountName}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{transaction.number}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-white font-light tracking-tight text-lg">₹{transaction.amount}</p>
                      <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest mt-1">
                        {transaction.status}
                      </Badge>
                    </div>
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
                onClick={() => navigate(`/mobile-recharge/account/${account.id}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator} • {account.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      {account.type}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6 space-y-3">
            {allTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">{transaction.accountName}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{transaction.number}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-white font-light tracking-tight text-lg">₹{transaction.amount}</p>
                      <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] uppercase tracking-widest mt-1">
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
