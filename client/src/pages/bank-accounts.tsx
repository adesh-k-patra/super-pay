import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Activity,
  Send,
  Download,
  Settings,
  Smartphone,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Wallet
} from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'savings' | 'current' | 'fd' | 'rd';
  balance: number;
  branch: string;
  ifscCode: string;
  isDefault: boolean;
  status: 'active' | 'inactive' | 'frozen';
  openingDate: string;
  lastTransactionDate: string;
  minBalance: number;
  interestRate?: number;
  maturityDate?: string;
  maturityAmount?: number;
  monthlyInstallment?: number;
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  balance: number;
  category: string;
}

export default function BankAccounts() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [hideBalances, setHideBalances] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Fetch bank accounts data
  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['/api/accounts'],
    enabled: isAuthenticated,
  });

  // Fetch recent transactions
  const { data: transactionsData } = useQuery({
    queryKey: ['/api/transactions/recent'],
    enabled: isAuthenticated,
  });

  // Mock bank accounts data
  const mockAccounts: BankAccount[] = [
    {
      id: "acc-1",
      bankName: "HDFC Bank",
      accountNumber: "50100123456789",
      accountType: "savings",
      balance: 285000,
      branch: "Koramangala, Bangalore",
      ifscCode: "HDFC0001234",
      isDefault: true,
      status: "active",
      openingDate: "2020-03-15",
      lastTransactionDate: "2024-12-30",
      minBalance: 10000,
      interestRate: 3.5
    },
    {
      id: "acc-2",
      bankName: "ICICI Bank",
      accountNumber: "402301234567890",
      accountType: "current",
      balance: 150000,
      branch: "HSR Layout, Bangalore",
      ifscCode: "ICIC0004023",
      isDefault: false,
      status: "active",
      openingDate: "2021-06-10",
      lastTransactionDate: "2024-12-29",
      minBalance: 25000,
      interestRate: 0
    },
    {
      id: "acc-3",
      bankName: "SBI",
      accountNumber: "30012345678901",
      accountType: "fd",
      balance: 500000,
      branch: "Whitefield, Bangalore",
      ifscCode: "SBIN0003001",
      isDefault: false,
      status: "active",
      openingDate: "2023-08-20",
      lastTransactionDate: "2023-08-20",
      minBalance: 0,
      interestRate: 7.2,
      maturityDate: "2025-08-20",
      maturityAmount: 572000
    }
  ];

  // Mock transactions data
  const mockTransactions: Transaction[] = [
    {
      id: "txn-1",
      accountId: "acc-1",
      type: "credit",
      amount: 50000,
      description: "Salary Credit - December",
      date: "2024-12-30",
      balance: 285000,
      category: "Salary"
    },
    {
      id: "txn-2",
      accountId: "acc-1",
      type: "debit",
      amount: 25000,
      description: "Home Loan EMI",
      date: "2024-12-28",
      balance: 235000,
      category: "EMI"
    },
    {
      id: "txn-3",
      accountId: "acc-2",
      type: "credit",
      amount: 120000,
      description: "Client Payment",
      date: "2024-12-29",
      balance: 150000,
      category: "Business"
    }
  ];

  const accounts = (accountsData as BankAccount[]) || mockAccounts;
  const transactions = (transactionsData as Transaction[]) || mockTransactions;

  const totalBalance = accounts.reduce((sum: number, account: BankAccount) => sum + account.balance, 0);
  const activeAccounts = accounts.filter((account: BankAccount) => account.status === 'active').length;

  const pagination = usePagination({
    data: accounts,
    itemsPerPage: 20,
  });

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading your accounts...</p>
        </div>
      </div>
    );
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'savings': return 'text-white/80 border-white/10';
      case 'current': return 'text-white/80 border-white/10';
      case 'fd': return 'text-white/80 border-white/10';
      case 'rd': return 'text-white/80 border-white/10';
      default: return 'text-white/60 border-white/10';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'savings': return Building2;
      case 'current': return Activity;
      case 'fd': return TrendingUp;
      case 'rd': return Calendar;
      default: return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
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
            <h1 className="text-base font-bold tracking-wider">BANK ACCOUNTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Manage Your Accounts</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideBalances(!hideBalances)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-balances"
          >
            {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 backdrop-blur-xl p-4 rounded-none" data-testid="card-total-balance">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-white/80 flex-shrink-0" />
              <span className="text-xs text-white/60 truncate">Total Balance</span>
            </div>
            <p className="text-xl font-bold text-white break-words" data-testid="text-total-balance">
              {hideBalances ? "₹••••••••" : `₹${(totalBalance / 100000).toFixed(1)}L`}
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 backdrop-blur-xl p-4 rounded-none" data-testid="card-active-accounts">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-white/80 flex-shrink-0" />
              <span className="text-xs text-white/60 truncate">Active Accounts</span>
            </div>
            <p className="text-xl font-bold text-white/80 break-words" data-testid="text-active-accounts">
              {activeAccounts}
            </p>
          </div>
        </div>

        {/* Add Account Button */}
        <Button
          onClick={() => navigate("/add-account")}
          className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none"
          data-testid="button-add-account"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Account
        </Button>

        {/* Accounts List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Accounts</h3>
          {pagination.paginatedData.map((account: BankAccount) => {
            const AccountTypeIcon = getAccountTypeIcon(account.accountType);
            const isExpanded = selectedAccount === account.id;
            
            return (
              <Card 
                key={account.id} 
                className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 backdrop-blur-xl rounded-none hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => setSelectedAccount(isExpanded ? null : account.id)}
                data-testid={`card-account-${account.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <AccountTypeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-white">{account.bankName}</h3>
                          {account.isDefault && (
                            <Badge className="bg-white/10 text-white/80 border-0 text-xs">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/60">
                          •••• {account.accountNumber.slice(-4)} • {account.accountType.toUpperCase()}
                        </p>
                        <Badge className={cn(
                          "mt-2 text-xs border",
                          getAccountTypeColor(account.accountType)
                        )}>
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-white">
                        {hideBalances ? "₹••••••" : `₹${(account.balance / 1000).toFixed(0)}K`}
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        {account.interestRate}% p.a.
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      {/* Account Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/60 text-xs mb-1">Branch</p>
                          <p className="text-white font-medium">{account.branch}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">IFSC Code</p>
                          <p className="text-white font-medium">{account.ifscCode}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">Opening Date</p>
                          <p className="text-white font-medium">{new Date(account.openingDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">Min Balance</p>
                          <p className="text-white font-medium">₹{account.minBalance.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* FD/RD Specific Details */}
                      {(account.accountType === 'fd' || account.accountType === 'rd') && (
                        <div className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 backdrop-blur-xl p-3 rounded-none">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {account.maturityDate && (
                              <div>
                                <p className="text-white/60 text-xs mb-1">Maturity Date</p>
                                <p className="text-white font-medium">{new Date(account.maturityDate).toLocaleDateString()}</p>
                              </div>
                            )}
                            {account.maturityAmount && (
                              <div>
                                <p className="text-white/60 text-xs mb-1">Maturity Amount</p>
                                <p className="text-white/80 font-medium">
                                  {hideBalances ? "₹••••••" : `₹${(account.maturityAmount / 100000).toFixed(1)}L`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/10 border-white/10 hover:bg-white/20 text-white rounded-none text-xs"
                          data-testid={`button-transfer-${account.id}`}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/10 border-white/10 hover:bg-white/20 text-white rounded-none text-xs"
                          data-testid={`button-statement-${account.id}`}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Statement
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/10 border-white/10 hover:bg-white/20 text-white rounded-none text-xs"
                          data-testid={`button-manage-${account.id}`}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6"
          />
        </div>

        {/* Recent Transactions */}
        <Card className="bg-gradient-to-br from-white/5 via-transparent to-transparent border border-white/10 backdrop-blur-xl rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Activity className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {transactions.slice(0, 5).map((transaction: Transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 border flex items-center justify-center",
                    transaction.type === 'credit' 
                      ? "bg-white/5 border-white/10" 
                      : "bg-white/5 border-white/10"
                  )}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5 text-white/80" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-white/80" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{transaction.description}</p>
                    <p className="text-xs text-white/60">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-medium",
                    transaction.type === 'credit' ? "text-white/80" : "text-white/80"
                  )}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {hideBalances ? "₹••••" : `₹${transaction.amount.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-white/60">
                    Bal: {hideBalances ? "₹••••" : `₹${(transaction.balance / 1000).toFixed(0)}K`}
                  </p>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/transactions")}
              className="w-full mt-3 bg-white/10 border-white/10 hover:bg-white/20 text-white rounded-none"
              data-testid="button-view-all-transactions"
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
