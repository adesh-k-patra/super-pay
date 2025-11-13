import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { cn } from "@/lib/utils";
import type { FastagAccount, UserVehicle, FastagTransaction } from "@shared/schema";
import { 
  ArrowLeft,
  Car,
  Bike,
  Truck,
  Wallet,
  RefreshCw,
  History,
  Settings,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  Download,
  Shield,
  Bell,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";

export default function FastagDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const accountId = params.accountId;
  const { toast } = useToast();
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useUrlTab("overview");

  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType?.toLowerCase()) {
      case 'bike':
      case 'motorcycle':
        return <Bike className="h-8 w-8" />;
      case 'truck':
      case 'commercial':
        return <Truck className="h-8 w-8" />;
      case 'car':
      default:
        return <Car className="h-8 w-8" />;
    }
  };

  // Fetch account details
  const { data: accountsData, isLoading: accountsLoading } = useQuery<{ accounts: FastagAccount[] }>({
    queryKey: ["/api/fastag/accounts"],
  });

  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery<{ vehicles: UserVehicle[] }>({
    queryKey: ["/api/vehicles"],
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery<{ transactions: FastagTransaction[] }>({
    queryKey: ["/api/fastag/transactions"],
  });

  const accounts = accountsData?.accounts || [];
  const vehicles = vehiclesData?.vehicles || [];
  const allTransactions = transactionsData?.transactions || [];

  const account = accounts.find(acc => acc.id === accountId);
  const vehicle = vehicles.find(v => v.id === account?.vehicleId);
  const accountTransactions = allTransactions.filter(txn => txn.fastagAccountId === accountId);

  const sortedTransactions = [...accountTransactions].sort((a, b) => 
    new Date(b.transactionDate!).getTime() - new Date(a.transactionDate!).getTime()
  );

  const recentTransactions = sortedTransactions.slice(0, 10);

  if (accountsLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <Skeleton className="h-20 w-full bg-white/10 mb-4" />
        <Skeleton className="h-40 w-full bg-white/10 mb-4" />
        <Skeleton className="h-60 w-full bg-white/10" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/fastag")}
          className="text-white/80 hover:text-white mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to FASTag
        </Button>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-white/60">FASTag account not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const balance = parseFloat(account.balance || "0");
  const minBalance = parseFloat(account.minBalance || "100");
  const isLowBalance = balance < minBalance;
  const vehicleTypeLabel = vehicle?.vehicleType === 'bike' ? 'Two-Wheeler' :
                           vehicle?.vehicleType === 'commercial' ? 'Commercial' : 'Four-Wheeler';

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "recharge":
        return <ArrowUpRight className="h-4 w-4 bg-white/10" />;
      case "toll_payment":
        return <ArrowDownRight className="h-4 w-4 bg-white/10" />;
      case "refund":
        return <ArrowUpRight className="h-4 w-4 bg-white/10" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "recharge":
        return "bg-white/10";
      case "toll_payment":
        return "bg-white/10";
      case "refund":
        return "bg-white/10";
      default:
        return "text-white";
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const totalRecharges = accountTransactions.filter(t => t.transactionType === 'recharge')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalTollPayments = accountTransactions.filter(t => t.transactionType === 'toll_payment')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const transactionCount = accountTransactions.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">FASTag Details</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Header Card */}
        <Card className="bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-blue-600/30 border-2 border-white/10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/40 to-purple-500/40 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    {getVehicleIcon(vehicle?.vehicleType)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/10 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-wide mb-1">
                    {vehicle?.vehicleNumber || 'N/A'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-white/30 text-white/80 bg-white/10">
                      {vehicleTypeLabel}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs border-0 font-semibold",
                        account.status === "active" ? "bg-white/10 text-white/70 border bg-white/10" : "bg-white/10/30 text-gray-300"
                      )}
                    >
                      {account.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHideBalance(!hideBalance)}
                className="border-white/20 text-white/80 hover:bg-white/10"
                data-testid="button-toggle-balance"
              >
                {hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-white/70 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                <CreditCard className="h-3.5 w-3.5" />
                <span className="font-mono font-semibold">{account.fastagNumber}</span>
                <span>•</span>
                <span className="font-medium">{account.bankName}</span>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Current Balance</span>
                  {isLowBalance && (
                    <Badge className="bg-white/10 bg-white/10 text-xs border bg-white/10 font-semibold animate-pulse">
                      Low Balance
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-5xl font-bold tracking-tight mb-2",
                  isLowBalance ? "bg-white/10" : "text-white",
                  hideBalance && "blur-md select-none"
                )}>
                  ₹{balance.toFixed(2)}
                </p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isLowBalance ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-white/10 to-blue-500"
                    )}
                    style={{width: `${Math.min((balance / (minBalance * 3)) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 bg-white/10 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">₹{totalRecharges.toFixed(0)}</p>
              <p className="text-xs text-white/60 mt-1">Total Recharged</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-6 w-6 bg-white/10 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">₹{totalTollPayments.toFixed(0)}</p>
              <p className="text-xs text-white/60 mt-1">Toll Payments</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <History className="h-6 w-6 bg-white/10 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{transactionCount}</p>
              <p className="text-xs text-white/60 mt-1">Transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-none p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Auto Recharge Status */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <RefreshCw className="h-5 w-5" />
                  Auto-Recharge Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {account.autoRechargeEnabled === 1 ? (
                  <div className="p-4 bg-gradient-to-r from-white/10/10 to-transparent rounded-xl border bg-white/10">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <RefreshCw className="h-5 w-5 bg-white/10" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold bg-white/10 mb-1">Auto-Recharge Enabled</p>
                        <p className="text-sm text-white/70">
                          Your FASTag will be automatically recharged with ₹{account.autoRechargeAmount} 
                          when balance drops below ₹{account.autoRechargeThreshold}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                    <p className="text-sm text-white/60 mb-3">Auto-recharge is not enabled</p>
                    <Button
                      size="sm"
                      className="bg-white/10 hover:bg-white/15"
                      onClick={() => setActiveTab('settings')}
                      data-testid="button-enable-auto-recharge"
                    >
                      Enable Auto-Recharge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <History className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('transactions')}
                    className="bg-white/10 hover:text-white/70"
                    data-testid="button-view-all"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentTransactions.slice(0, 5).map((txn) => (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                        data-testid={`transaction-${txn.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            {getTransactionIcon(txn.transactionType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {txn.transactionType === 'recharge' ? 'Recharge' : 
                               txn.transactionType === 'toll_payment' ? 'Toll Payment' : 'Refund'}
                            </p>
                            <p className="text-xs text-white/60">
                              {formatDate(txn.transactionDate!)} • {formatTime(txn.transactionDate!)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-base font-bold", getTransactionColor(txn.transactionType))}>
                            {txn.transactionType === 'toll_payment' ? '-' : '+'}₹{parseFloat(txn.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full bg-white/10" />
                    ))}
                  </div>
                ) : sortedTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 mb-2">No transactions yet</p>
                    <p className="text-sm text-white/40">Your transaction history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedTransactions.map((txn) => {
                      const isDebit = txn.transactionType === 'toll_payment';
                      
                      return (
                        <Card
                          key={txn.id}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          data-testid={`transaction-detail-${txn.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                  {getTransactionIcon(txn.transactionType)}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-white mb-1">
                                    {txn.transactionType === 'recharge' ? 'FASTag Recharge' : 
                                     txn.transactionType === 'toll_payment' ? 'Toll Payment' : 'Refund'}
                                  </p>
                                  {txn.tollPlazaName && (
                                    <div className="flex items-center gap-1 text-xs text-white/70 mb-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{txn.tollPlazaName}</span>
                                      {txn.tollPlazaLocation && <span>• {txn.tollPlazaLocation}</span>}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-white/60">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(txn.transactionDate!)} • {formatTime(txn.transactionDate!)}</span>
                                  </div>
                                  <p className="text-xs text-white/50 mt-1">Ref: {txn.transactionReference}</p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className={cn("text-xl font-bold mb-1", getTransactionColor(txn.transactionType))}>
                                  {isDebit ? '-' : '+'}₹{parseFloat(txn.amount).toFixed(2)}
                                </p>
                                <Badge
                                  variant={txn.status === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {txn.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {(txn.balanceBefore || txn.balanceAfter) && (
                              <div className="pt-3 border-t border-white/10">
                                <div className="flex justify-between text-xs text-white/60">
                                  <span>Balance Before: ₹{parseFloat(txn.balanceBefore || "0").toFixed(2)}</span>
                                  <span>Balance After: ₹{parseFloat(txn.balanceAfter || "0").toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Auto-Recharge Settings */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Auto-Recharge Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 bg-white/10" />
                    <div>
                      <Label htmlFor="auto-recharge" className="text-white font-medium">Enable Auto-Recharge</Label>
                      <p className="text-xs text-white/60 mt-0.5">Automatically recharge when balance is low</p>
                    </div>
                  </div>
                  <Switch
                    id="auto-recharge"
                    checked={account.autoRechargeEnabled === 1}
                    onCheckedChange={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Auto-recharge settings will be available soon",
                      });
                    }}
                    data-testid="switch-auto-recharge"
                  />
                </div>

                {account.autoRechargeEnabled === 1 && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="recharge-amount" className="text-white">Recharge Amount</Label>
                      <Input
                        id="recharge-amount"
                        type="number"
                        defaultValue={account.autoRechargeAmount || ""}
                        className="bg-black border-white/20 text-white"
                        data-testid="input-recharge-amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold-amount" className="text-white">Trigger When Balance Below</Label>
                      <Input
                        id="threshold-amount"
                        type="number"
                        defaultValue={account.autoRechargeThreshold || ""}
                        className="bg-black border-white/20 text-white"
                        data-testid="input-threshold-amount"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 bg-white/10" />
                    <div>
                      <Label htmlFor="low-balance" className="text-white font-medium">Low Balance Alerts</Label>
                      <p className="text-xs text-white/60 mt-0.5">Get notified when balance is low</p>
                    </div>
                  </div>
                  <Switch id="low-balance" defaultChecked data-testid="switch-low-balance" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 bg-white/10" />
                    <div>
                      <Label htmlFor="toll-alerts" className="text-white font-medium">Toll Payment Alerts</Label>
                      <p className="text-xs text-white/60 mt-0.5">Get notified for each toll payment</p>
                    </div>
                  </div>
                  <Switch id="toll-alerts" defaultChecked data-testid="switch-toll-alerts" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 bg-white/10" />
                    <div>
                      <Label htmlFor="recharge-success" className="text-white font-medium">Recharge Confirmations</Label>
                      <p className="text-xs text-white/60 mt-0.5">Get notified when recharge is successful</p>
                    </div>
                  </div>
                  <Switch id="recharge-success" defaultChecked data-testid="switch-recharge-success" />
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">FASTag Number</span>
                  <span className="text-white font-mono font-semibold">{account.fastagNumber}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Bank Name</span>
                  <span className="text-white font-semibold">{account.bankName}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Issue Date</span>
                  <span className="text-white">{account.issueDate ? formatDate(account.issueDate) : 'N/A'}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Expiry Date</span>
                  <span className="text-white">{account.expiryDate ? formatDate(account.expiryDate) : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl"
            onClick={() => {
              toast({
                title: "Recharge",
                description: "Redirecting to recharge page...",
              });
              navigate("/fastag");
            }}
            data-testid="button-recharge-now"
          >
            <Wallet className="h-5 w-5 mr-2" />
            Recharge Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              toast({
                title: "Download Statement",
                description: "This feature will be available soon",
              });
            }}
            data-testid="button-download-statement"
          >
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
