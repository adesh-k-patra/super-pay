import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Tv,
  Plus,
  ChevronRight,
  Calendar
} from "lucide-react";

interface SavedAccount {
  id: string;
  name: string;
  subscriberId: string;
  operator: string;
  packageName: string;
  balance: string;
}

interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  subscriberId: string;
  operator: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  plan: string;
}

const savedAccounts: SavedAccount[] = [
  { id: "1", name: "Home DTH", subscriberId: "1234567890", operator: "Tata Play", packageName: "Sports Pack", balance: "₹450" },
  { id: "2", name: "Parents DTH", subscriberId: "9876543210", operator: "Airtel Digital TV", packageName: "Family Pack", balance: "₹320" },
  { id: "3", name: "Office", subscriberId: "5555666677", operator: "Dish TV", packageName: "News Pack", balance: "₹250" },
  { id: "4", name: "Living Room", subscriberId: "1111222233", operator: "Sun Direct", packageName: "Premium HD", balance: "₹680" },
  { id: "5", name: "Bedroom", subscriberId: "4444555566", operator: "Tata Play", packageName: "Entertainment", balance: "₹420" },
  { id: "6", name: "Guest Room", subscriberId: "7777888899", operator: "Airtel Digital TV", packageName: "Basic Pack", balance: "₹190" },
  { id: "7", name: "Kids Room", subscriberId: "9999000011", operator: "Dish TV", packageName: "Kids Special", balance: "₹299" },
];

const dueAccounts = [
  { id: "1", accountId: "1", accountName: "Home DTH", subscriberId: "1234567890", operator: "Tata Play", packageName: "Sports Pack", balance: "₹450", dueDate: "25 Oct 2024" },
  { id: "2", accountId: "2", accountName: "Parents DTH", subscriberId: "9876543210", operator: "Airtel Digital TV", packageName: "Family Pack", balance: "₹320", dueDate: "20 Oct 2024" },
];

const allTransactions: Transaction[] = [
  { id: "1", accountId: "1", accountName: "Home DTH", subscriberId: "1234567890", operator: "Tata Play", amount: 499, date: "15 Sep 2024", time: "10:30 AM", status: "Success", plan: "Sports HD Pack - Monthly" },
  { id: "2", accountId: "1", accountName: "Home DTH", subscriberId: "1234567890", operator: "Tata Play", amount: 399, date: "10 Aug 2024", time: "03:15 PM", status: "Success", plan: "Basic Pack - Monthly" },
  { id: "3", accountId: "2", accountName: "Parents DTH", subscriberId: "9876543210", operator: "Airtel Digital TV", amount: 599, date: "18 Sep 2024", time: "02:45 PM", status: "Success", plan: "Family Entertainment Pack" },
  { id: "4", accountId: "1", accountName: "Home DTH", subscriberId: "1234567890", operator: "Tata Play", amount: 499, date: "15 Jul 2024", time: "11:45 AM", status: "Success", plan: "Sports HD Pack - Monthly" },
  { id: "5", accountId: "3", accountName: "Office", subscriberId: "5555666677", operator: "Dish TV", amount: 299, date: "10 Sep 2024", time: "04:20 PM", status: "Success", plan: "News & Current Affairs" },
  { id: "6", accountId: "2", accountName: "Parents DTH", subscriberId: "9876543210", operator: "Airtel Digital TV", amount: 599, date: "18 Aug 2024", time: "01:15 PM", status: "Success", plan: "Family Entertainment Pack" },
  { id: "7", accountId: "4", accountName: "Living Room", subscriberId: "1111222233", operator: "Sun Direct", amount: 699, date: "20 Sep 2024", time: "05:00 PM", status: "Success", plan: "Premium HD - Monthly" },
  { id: "8", accountId: "5", accountName: "Bedroom", subscriberId: "4444555566", operator: "Tata Play", amount: 449, date: "16 Sep 2024", time: "12:30 PM", status: "Success", plan: "Entertainment Pack" },
  { id: "9", accountId: "6", accountName: "Guest Room", subscriberId: "7777888899", operator: "Airtel Digital TV", amount: 199, date: "11 Sep 2024", time: "09:15 AM", status: "Success", plan: "Basic Pack - Monthly" },
  { id: "10", accountId: "7", accountName: "Kids Room", subscriberId: "9999000011", operator: "Dish TV", amount: 349, date: "08 Sep 2024", time: "07:45 PM", status: "Success", plan: "Kids Special Pack" },
  { id: "11", accountId: "3", accountName: "Office", subscriberId: "5555666677", operator: "Dish TV", amount: 299, date: "28 Aug 2024", time: "02:20 PM", status: "Success", plan: "News & Current Affairs" },
];

export default function BillPaymentDTH() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");

  const recentTransactions = allTransactions.slice(0, 3);

  const handleAccountClick = (account: SavedAccount) => {
    navigate(`/dth-recharge/account/${account.id}`);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    navigate(`/dth-recharge/transaction/${transaction.id}`);
  };

  const handleAddNew = () => {
    navigate("/add-dth-account");
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
            <h1 className="text-base font-bold tracking-wider">DTH RECHARGE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All Operators</p>
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
        {/* DTH Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="dth-summary">
          <div className="space-y-6">
            {/* Total DTH Spend Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total DTH Spend</p>
                <div className="flex items-center gap-2">
                  <Tv className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-dth-spend">
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
              <div className="space-y-1 text-center" data-testid="card-active-accounts">
                <p className="text-lg font-light text-white" data-testid="text-active-accounts">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Accounts</p>
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Due Recharges & Recent Activity</p>
            {dueAccounts.slice(0, 2).map((account) => (
              <div
                key={account.id}
                onClick={() => navigate(`/dth-recharge/${account.accountId}`)}
                className="cursor-pointer border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4"
                data-testid={`card-recent-due-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">{account.balance}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{account.accountName} • {account.operator}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Due: {account.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      Due
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => navigate(`/dth-recharge/${transaction.accountId}`)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-recent-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.operator}</p>
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
                onClick={() => handleAccountClick(account)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Tv className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.operator} • {account.subscriberId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className="text-white/70 font-light">{account.balance}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{account.packageName}</p>
                    </div>
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
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{transaction.operator} • {transaction.subscriberId}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white font-light">₹{transaction.amount}</p>
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
