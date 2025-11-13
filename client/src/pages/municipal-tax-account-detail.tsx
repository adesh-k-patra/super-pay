import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Calendar,
  CheckCircle,
  Trash2,
  Zap,
  AlertCircle,
  X,
  Pencil
} from "lucide-react";

const savedAccounts = [
  { id: "1", name: "Home Property", propertyId: "MH/BMC/12345", taxType: "Property Tax", city: "Mumbai", state: "Maharashtra", district: "Mumbai", municipality: "Brihanmumbai Municipal Corporation", billAmount: "₹15,000", dueAmount: 15000, dueDate: "31 Oct 2024", lastPaid: "10 Sep 2024" },
  { id: "2", name: "Shop", propertyId: "DL/MCD/67890", taxType: "Property Tax", city: "Delhi", state: "Delhi", district: "Central Delhi", municipality: "Municipal Corporation of Delhi", billAmount: "₹8,500", dueAmount: 8500, dueDate: "30 Oct 2024", lastPaid: "15 Sep 2024" },
  { id: "3", name: "Rental Property", propertyId: "KA/BBMP/54321", taxType: "Property Tax", city: "Bangalore", state: "Karnataka", district: "Bangalore Urban", municipality: "Bruhat Bengaluru Mahanagara Palike", billAmount: "₹12,000", dueAmount: 12000, dueDate: "28 Oct 2024", lastPaid: "05 Sep 2024" },
];

const allTransactions = [
  { id: "1", accountId: "1", amount: 15000, date: "10 Sep 2024", status: "Success", time: "10:30 AM", period: "Q2 2024" },
  { id: "2", accountId: "1", amount: 15000, date: "10 Jun 2024", status: "Success", time: "03:15 PM", period: "Q1 2024" },
  { id: "3", accountId: "2", amount: 8500, date: "15 Sep 2024", status: "Success", time: "02:45 PM", period: "Q2 2024" },
  { id: "4", accountId: "1", amount: 15000, date: "10 Mar 2024", status: "Success", time: "11:45 AM", period: "Q4 2023" },
  { id: "5", accountId: "3", amount: 12000, date: "05 Sep 2024", status: "Success", time: "04:20 PM", period: "Q2 2024" },
  { id: "6", accountId: "2", amount: 8500, date: "15 Jun 2024", status: "Success", time: "01:15 PM", period: "Q1 2024" },
];

const dueTaxes = [
  { id: "d1", accountId: "1", amount: 15000, dueDate: "31 Oct 2024", period: "Q3 2024" },
];

const taxAmounts = [
  { id: "a1", amount: 5000, label: "Partial Payment" },
  { id: "a2", amount: 15000, label: "Full Tax", recommended: true },
  { id: "a3", amount: 20000, label: "Extra Payment" },
  { id: "a4", amount: 30000, label: "Advance Payment" },
];

export default function MunicipalTaxAccountDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/municipal-tax/account/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("recent");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isDueCardVisible, setIsDueCardVisible] = useState(true);

  const account = savedAccounts.find(acc => acc.id === params?.id) || savedAccounts[0];
  const accountRecentTransactions = allTransactions.filter(txn => txn.accountId === params?.id).slice(0, 3);
  const accountAllTransactions = allTransactions.filter(txn => txn.accountId === params?.id);
  const accountDueTaxes = dueTaxes.filter(txn => txn.accountId === params?.id);

  const handlePayTax = () => {
    setPaymentDialogOpen(true);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleProceedToPayment = () => {
    const payAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    if (!payAmount) {
      toast({
        title: "Select Amount",
        description: "Please select or enter an amount to proceed",
        variant: "destructive",
      });
      return;
    }

    setPaymentDialogOpen(false);
    
    const paymentParams = new URLSearchParams({
      transactionType: 'municipal-tax',
      amount: payAmount.toString(),
      accountName: account.name,
      propertyId: account.propertyId,
      taxType: account.taxType,
      city: account.city,
      returnUrl: `/municipal-tax/account/${account.id}`
    });
    
    navigate(`/upi-payment?${paymentParams.toString()}`);
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: `${account.name} has been removed from your saved accounts`,
    });
    setDeleteDialogOpen(false);
    navigate("/municipal-tax");
  };

  const handleTransactionClick = (transaction: any) => {
    navigate(`/municipal-tax/transaction/${transaction.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/municipal-tax")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">ACCOUNT DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{account.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams({
                  edit: 'true',
                  id: account.id,
                  name: account.name,
                  propertyNumber: account.propertyId,
                  taxType: account.taxType,
                  state: account.state,
                  district: account.district,
                  municipality: account.municipality
                });
                navigate(`/add-municipal-account?${params.toString()}`);
              }}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-edit"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAccount}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-delete"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 border border-white/20 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white/60" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-light text-xl tracking-wide mb-1">{account.name}</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{account.taxType} • {account.city}</p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
              Active
            </Badge>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Property ID</span>
              <span className="text-white font-light">{account.propertyId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Current Tax</span>
              <span className="text-white font-light">{account.billAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Due Date</span>
              <span className="text-white font-light">{account.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Last Paid</span>
              <span className="text-white font-light">{account.lastPaid}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-recent"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Recent Payments & Due Bills</p>
            
            {/* Due Taxes */}
            {accountDueTaxes.length > 0 && accountDueTaxes.map((tax) => (
              <div
                key={tax.id}
                className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4"
                data-testid={`card-due-${tax.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{tax.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{tax.period}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-white/40" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Due: {tax.dueDate}</p>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      const params = new URLSearchParams({
                        transactionType: 'municipal-tax',
                        amount: tax.amount.toString(),
                        accountName: account.name,
                        propertyId: account.propertyId,
                        taxType: account.taxType,
                        city: account.city,
                        returnUrl: `/municipal-tax/account/${account.id}`
                      });
                      navigate(`/upi-payment?${params.toString()}`);
                    }}
                    className="bg-white hover:bg-white/90 text-black h-9 px-6 rounded-none text-xs font-light tracking-wide"
                    data-testid={`button-pay-${tax.id}`}
                  >
                    Pay
                  </Button>
                </div>
              </div>
            ))}

            {/* Recent Transactions */}
            {accountRecentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.period}</p>
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

          <TabsContent value="transactions" className="mt-6 space-y-3">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Transaction History</p>
            {accountAllTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20 transition-all p-4"
                data-testid={`card-transaction-history-${transaction.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-light tracking-wide">₹{transaction.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{transaction.period}</p>
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
                  <p className="text-lg font-medium text-white">₹{account.dueAmount.toLocaleString()}</p>
                  <p className="text-white/60 text-xs">Due Date: <span className="text-white font-light">{account.dueDate}</span></p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  transactionType: 'municipal-tax',
                  amount: account.dueAmount.toString(),
                  accountName: account.name,
                  propertyId: account.propertyId,
                  taxType: account.taxType,
                  city: account.city,
                  returnUrl: `/municipal-tax/account/${account.id}`
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

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={() => {
            if (isDueCardVisible && account.dueAmount) {
              const params = new URLSearchParams({
                transactionType: 'municipal-tax',
                amount: account.dueAmount.toString(),
                accountName: account.name,
                propertyId: account.propertyId,
                taxType: account.taxType,
                city: account.city,
                returnUrl: `/municipal-tax/account/${account.id}`
              });
              navigate(`/upi-payment?${params.toString()}`);
            } else {
              handlePayTax();
            }
          }}
          className="w-full bg-white hover:bg-white/90 text-black h-12 font-light text-base tracking-wide rounded-none flex items-center justify-center gap-2"
          data-testid="button-pay-now"
        >
          <Zap className="h-4 w-4" />
          Pay Now
        </Button>
      </div>

      {/* Payment Amount Selection Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-xl tracking-wide">Select Payment Amount</DialogTitle>
            <DialogDescription className="text-white/50 text-[10px] uppercase tracking-widest">
              Choose amount for {account.propertyId}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-3">
            {taxAmounts.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAmountSelect(option.amount)}
                className={`cursor-pointer border ${
                  selectedAmount === option.amount
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent hover:border-white/20"
                } transition-all p-4`}
                data-testid={`card-amount-${option.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-2xl font-light text-white tracking-tight">₹{option.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{option.label}</p>
                  </div>
                  {option.recommended && (
                    <Badge className="bg-white/20 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                      Recommended
                    </Badge>
                  )}
                  {selectedAmount === option.amount && (
                    <CheckCircle className="h-5 w-5 text-white ml-2" />
                  )}
                </div>
              </div>
            ))}

            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Custom Amount</p>
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-none"
                data-testid="input-custom-amount"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                setPaymentDialogOpen(false);
                setSelectedAmount(null);
                setCustomAmount("");
              }}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-none"
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              disabled={!selectedAmount && !customAmount}
              className="flex-1 bg-white hover:bg-white/90 text-black rounded-none disabled:opacity-50"
              data-testid="button-proceed-payment"
            >
              Pay ₹{customAmount ? parseInt(customAmount).toLocaleString() : selectedAmount?.toLocaleString() || 0}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-light text-xl tracking-wide">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 text-sm">
              Are you sure you want to delete "{account.name}" ({account.propertyId})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 hover:bg-white/15 text-white border-white/20 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccount}
              className="bg-white hover:bg-white/90 text-black rounded-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
