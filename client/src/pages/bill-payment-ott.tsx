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
  subscriberNumber: string;
  provider: string;
  planAmount: string;
  renewalDate: string;
  logo: string;
}

interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  subscriberNumber: string;
  provider: string;
  amount: number;
  date: string;
  time: string;
  status: string;
}

const savedAccounts: SavedAccount[] = [
  { id: "1", name: "Netflix Premium", subscriberNumber: "NF1234567890", provider: "Netflix", planAmount: "₹649", renewalDate: "25 Oct 2024", logo: "📺" },
  { id: "2", name: "Prime Video", subscriberNumber: "PV9876543210", provider: "Amazon Prime", planAmount: "₹299", renewalDate: "28 Oct 2024", logo: "🎬" },
  { id: "3", name: "Hotstar Premium", subscriberNumber: "HS5555666677", provider: "Disney+ Hotstar", planAmount: "₹499", renewalDate: "30 Oct 2024", logo: "⭐" },
];

const allTransactions: Transaction[] = [
  { id: "1", accountId: "1", accountName: "Netflix Premium", subscriberNumber: "NF1234567890", provider: "Netflix", amount: 649, date: "15 Sep 2024", time: "10:30 AM", status: "Success" },
  { id: "2", accountId: "1", accountName: "Netflix Premium", subscriberNumber: "NF1234567890", provider: "Netflix", amount: 649, date: "10 Aug 2024", time: "03:15 PM", status: "Success" },
  { id: "3", accountId: "2", accountName: "Prime Video", subscriberNumber: "PV9876543210", provider: "Amazon Prime", amount: 299, date: "05 Aug 2024", time: "02:45 PM", status: "Success" },
  { id: "4", accountId: "1", accountName: "Netflix Premium", subscriberNumber: "NF1234567890", provider: "Netflix", amount: 649, date: "15 Jul 2024", time: "11:30 AM", status: "Success" },
  { id: "5", accountId: "3", accountName: "Hotstar Premium", subscriberNumber: "HS5555666677", provider: "Disney+ Hotstar", amount: 499, date: "10 Jul 2024", time: "04:20 PM", status: "Success" },
  { id: "6", accountId: "2", accountName: "Prime Video", subscriberNumber: "PV9876543210", provider: "Amazon Prime", amount: 299, date: "01 Jul 2024", time: "01:15 PM", status: "Success" },
];

export default function BillPaymentOTT() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");

  const recentTransactions = allTransactions.slice(0, 3);

  const handleAccountClick = (account: SavedAccount) => {
    navigate(`/ott-subscription/account/${account.id}`);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    navigate(`/ott-subscription/transaction/${transaction.id}`);
  };

  const handleAddNew = () => {
    navigate("/add-ott-account");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/bill-payment")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">OTT SUBSCRIPTION</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All Platforms</p>
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
        {/* OTT Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="ott-subscription-summary">
          <div className="space-y-6">
            {/* Total Subscriptions Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total OTT Subscriptions</p>
                <div className="flex items-center gap-2">
                  <Tv className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-ott-subscriptions">
                ₹{(recentTransactions.reduce((sum, t) => sum + t.amount, 0) / 1000).toFixed(1)}K
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-paid-subscriptions">
                <p className="text-lg font-light text-white" data-testid="text-paid-subscriptions">
                  {recentTransactions.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Paid</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-active-subscriptions">
                <p className="text-lg font-light text-white" data-testid="text-active-subscriptions">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Active</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Renewing</p>
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
              value="due" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-due"
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
                onClick={() => handleAccountClick(account)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-xl">
                      {account.logo}
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.provider} • {account.subscriberNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-white font-light">{account.planAmount}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Renewal: {account.renewalDate}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Due Tab */}
          <TabsContent value="due" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Upcoming Renewals</p>
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleAccountClick(account)}
                className="cursor-pointer border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4"
                data-testid={`card-due-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-xl">
                      {account.logo}
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.provider} • {account.subscriberNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-white font-light">{account.planAmount}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Renewal: {account.renewalDate}</p>
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
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{transaction.provider} • {transaction.subscriberNumber}</p>
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
