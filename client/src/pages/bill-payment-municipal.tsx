import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  Plus,
  ChevronRight,
  Calendar
} from "lucide-react";

interface SavedAccount {
  id: string;
  name: string;
  propertyId: string;
  taxType: string;
  city: string;
  billAmount: string;
  dueDate: string;
}

interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  propertyId: string;
  city: string;
  amount: number;
  date: string;
  time: string;
  status: string;
}

const savedAccounts: SavedAccount[] = [
  { id: "1", name: "Home Property", propertyId: "MH/BMC/12345", taxType: "Property Tax", city: "Mumbai", billAmount: "₹15,000", dueDate: "31 Oct 2024" },
  { id: "2", name: "Shop", propertyId: "DL/MCD/67890", taxType: "Property Tax", city: "Delhi", billAmount: "₹8,500", dueDate: "30 Oct 2024" },
  { id: "3", name: "Rental Property", propertyId: "KA/BBMP/54321", taxType: "Property Tax", city: "Bangalore", billAmount: "₹12,000", dueDate: "28 Oct 2024" },
];

const recentTransactions: Transaction[] = [
  { id: "1", accountId: "1", accountName: "Home Property", propertyId: "MH/BMC/12345", city: "Mumbai", amount: 15000, date: "10 Sep 2024", time: "10:30 AM", status: "Paid" },
  { id: "2", accountId: "2", accountName: "Shop", propertyId: "DL/MCD/67890", city: "Delhi", amount: 8500, date: "15 Sep 2024", time: "02:45 PM", status: "Paid" },
  { id: "3", accountId: "1", accountName: "Home Property", propertyId: "MH/BMC/12345", city: "Mumbai", amount: 15000, date: "10 Jun 2024", time: "03:15 PM", status: "Paid" },
];

const allTransactions: Transaction[] = [
  ...recentTransactions,
  { id: "4", accountId: "1", accountName: "Home Property", propertyId: "MH/BMC/12345", city: "Mumbai", amount: 15000, date: "10 Mar 2024", time: "11:45 AM", status: "Paid" },
  { id: "5", accountId: "3", accountName: "Rental Property", propertyId: "KA/BBMP/54321", city: "Bangalore", amount: 12000, date: "05 Sep 2024", time: "04:20 PM", status: "Paid" },
  { id: "6", accountId: "2", accountName: "Shop", propertyId: "DL/MCD/67890", city: "Delhi", amount: 8500, date: "15 Jun 2024", time: "01:15 PM", status: "Paid" },
];

const duePayments = [
  { id: "d1", accountId: "1", accountName: "Home Property", propertyId: "MH/BMC/12345", city: "Mumbai", amount: 15000, dueDate: "31 Oct 2024" },
  { id: "d2", accountId: "2", accountName: "Shop", propertyId: "DL/MCD/67890", city: "Delhi", amount: 8500, dueDate: "30 Oct 2024" },
  { id: "d3", accountId: "3", accountName: "Rental Property", propertyId: "KA/BBMP/54321", city: "Bangalore", amount: 12000, dueDate: "28 Oct 2024" },
];

export default function BillPaymentMunicipal() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");

  const handleAccountClick = (accountId: string) => {
    navigate(`/municipal-tax/account/${accountId}`);
  };

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/municipal-tax/transaction/${transactionId}`);
  };

  const handleAddNew = () => {
    navigate("/add-municipal-account");
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
            <h1 className="text-base font-bold tracking-wider">MUNICIPAL TAX</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Property Tax</p>
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
        {/* Municipal Tax Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="municipal-tax-summary">
          <div className="space-y-6">
            {/* Total Tax Due Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Tax Due</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Quarter</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-tax-due">
                ₹{(duePayments.reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}K
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-paid-taxes">
                <p className="text-lg font-light text-white" data-testid="text-paid-taxes">
                  {recentTransactions.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Paid</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-properties">
                <p className="text-lg font-light text-white" data-testid="text-properties">
                  {savedAccounts.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Properties</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  {duePayments.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Pending</p>
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
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-all"
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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Payments & Due Bills</p>
            {duePayments.slice(0, 2).map((payment) => (
              <div
                key={payment.id}
                onClick={() => handleAccountClick(payment.accountId)}
                className="cursor-pointer border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4"
                data-testid={`card-recent-due-${payment.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{payment.accountName} • {payment.city}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Due: {payment.dueDate}</p>
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
                onClick={() => handleAccountClick(transaction.accountId)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-recent-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.accountName} • {transaction.city}</p>
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

          {/* All Tab */}
          <TabsContent value="all" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">All Accounts</p>
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleAccountClick(account.id)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-all-account-${account.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-white font-light tracking-wide">{account.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.city} • {account.propertyId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-white font-light">{account.billAmount}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Due: {account.dueDate}</p>
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
                    <p className="text-white font-light tracking-wide">{transaction.accountName}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">{transaction.city} • {transaction.propertyId}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white font-light">₹{transaction.amount.toLocaleString()}</p>
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
