import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Building2, 
  Send, 
  Shield,
  Plus,
  Clock,
  CheckCircle,
  User,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";

const bankTransferSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  accountNumber: z.string().min(8, "Valid account number is required").regex(/^\d+$/, "Account number must contain only digits"),
  confirmAccountNumber: z.string().min(8, "Please confirm account number"),
  ifscCode: z.string().min(11, "Valid IFSC code is required").regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  bankName: z.string().min(2, "Bank name is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0").max(1000000, "Maximum limit exceeded"),
  description: z.string().optional(),
  transferType: z.enum(["imps", "neft", "rtgs"]),
  senderAccountId: z.string().min(1, "Please select sender account")
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"]
});

type BankTransfer = z.infer<typeof bankTransferSchema>;

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  accountType: string;
  isPrimary: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  addedOn: string;
}

interface RecentTransfer {
  id: string;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  transferType: string;
}

interface Transaction {
  id: string;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  amount: number;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  transferType: string;
  transactionId: string;
  description?: string;
}

export default function BankTransfer() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddBeneficiaryDialog, setShowAddBeneficiaryDialog] = useState(false);
  const [transferData, setTransferData] = useState<BankTransfer | null>(null);
  const [selectedTab, setSelectedTab] = useState("recent");

  const { data: bankAccounts = [] } = useQuery<BankAccount[]>({
    queryKey: ['/api/user/bank-accounts'],
    placeholderData: [
      {
        id: "hdfc_savings",
        accountNumber: "****1234",
        bankName: "HDFC Bank Savings",
        balance: 45000,
        accountType: "savings",
        isPrimary: true
      },
      {
        id: "icici_current",
        accountNumber: "****5678",
        bankName: "ICICI Bank Current",
        balance: 89000,
        accountType: "current",
        isPrimary: false
      },
      {
        id: "sbi_salary",
        accountNumber: "****9012",
        bankName: "SBI Salary Account",
        balance: 32000,
        accountType: "salary",
        isPrimary: false
      }
    ]
  });

  const mockBeneficiaries: Beneficiary[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      accountNumber: "****8765",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      addedOn: "2024-10-01"
    },
    {
      id: "2",
      name: "Priya Sharma",
      accountNumber: "****4321",
      ifscCode: "ICIC0005678",
      bankName: "ICICI Bank",
      addedOn: "2024-09-15"
    },
    {
      id: "3",
      name: "Amit Patel",
      accountNumber: "****9999",
      ifscCode: "SBIN0001111",
      bankName: "State Bank of India",
      addedOn: "2024-08-20"
    }
  ];

  const mockRecentTransfers: RecentTransfer[] = [
    {
      id: "1",
      beneficiaryName: "Rajesh Kumar",
      accountNumber: "****8765",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      amount: 15000,
      date: "2024-10-07",
      status: "completed",
      transferType: "IMPS"
    },
    {
      id: "2",
      beneficiaryName: "Priya Sharma",
      accountNumber: "****4321",
      ifscCode: "ICIC0005678",
      bankName: "ICICI Bank",
      amount: 25000,
      date: "2024-10-05",
      status: "completed",
      transferType: "NEFT"
    },
    {
      id: "3",
      beneficiaryName: "Amit Patel",
      accountNumber: "****9999",
      ifscCode: "SBIN0001111",
      bankName: "State Bank of India",
      amount: 50000,
      date: "2024-10-03",
      status: "completed",
      transferType: "RTGS"
    },
    {
      id: "4",
      beneficiaryName: "Sarah Johnson",
      accountNumber: "****1122",
      ifscCode: "ICIC0009876",
      bankName: "ICICI Bank",
      amount: 8000,
      date: "2024-10-01",
      status: "completed",
      transferType: "IMPS"
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: "1",
      beneficiaryName: "Rajesh Kumar",
      accountNumber: "****8765",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      amount: 15000,
      date: "2024-10-07",
      time: "14:35",
      status: "completed",
      transferType: "IMPS",
      transactionId: "BT202410071435",
      description: "Monthly rent payment"
    },
    {
      id: "2",
      beneficiaryName: "Priya Sharma",
      accountNumber: "****4321",
      ifscCode: "ICIC0005678",
      bankName: "ICICI Bank",
      amount: 25000,
      date: "2024-10-05",
      time: "10:20",
      status: "completed",
      transferType: "NEFT",
      transactionId: "BT202410051020",
      description: "Business payment"
    },
    {
      id: "3",
      beneficiaryName: "Amit Patel",
      accountNumber: "****9999",
      ifscCode: "SBIN0001111",
      bankName: "State Bank of India",
      amount: 50000,
      date: "2024-10-03",
      time: "16:45",
      status: "completed",
      transferType: "RTGS",
      transactionId: "BT202410031645"
    },
    {
      id: "4",
      beneficiaryName: "Sarah Johnson",
      accountNumber: "****1122",
      ifscCode: "ICIC0009876",
      bankName: "ICICI Bank",
      amount: 8000,
      date: "2024-10-01",
      time: "09:15",
      status: "completed",
      transferType: "IMPS",
      transactionId: "BT202410010915",
      description: "Payment for services"
    },
    {
      id: "5",
      beneficiaryName: "Vikram Singh",
      accountNumber: "****3344",
      ifscCode: "HDFC0002222",
      bankName: "HDFC Bank",
      amount: 12000,
      date: "2024-09-28",
      time: "11:30",
      status: "completed",
      transferType: "NEFT",
      transactionId: "BT202409281130"
    }
  ];

  const form = useForm<BankTransfer>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      recipientName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      bankName: "",
      amount: "" as any,
      description: "",
      transferType: "imps",
      senderAccountId: ""
    }
  });

  const onSubmit = (data: BankTransfer) => {
    setTransferData(data);
    setShowConfirmDialog(true);
  };

  const confirmTransfer = async () => {
    if (!transferData) return;

    try {
      toast({
        title: "Transfer Initiated",
        description: `Bank transfer of ₹${transferData.amount.toLocaleString()} has been initiated successfully.`
      });
      setShowConfirmDialog(false);
      navigate("/upi-history");
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Unable to process the transfer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-white/60";
      case "pending":
        return "text-white/60";
      case "failed":
        return "text-white/60";
      default:
        return "text-white/60";
    }
  };

  const handleRecentTransferClick = (transfer: RecentTransfer) => {
    const params = new URLSearchParams({
      recipientName: transfer.beneficiaryName,
      accountNumber: transfer.accountNumber,
      ifscCode: transfer.ifscCode,
      bankName: transfer.bankName,
      transferType: transfer.transferType.toLowerCase()
    });
    navigate(`/bank-transfer-payment?${params.toString()}`);
  };

  const handleBeneficiaryClick = (beneficiary: Beneficiary) => {
    const params = new URLSearchParams({
      recipientName: beneficiary.name,
      accountNumber: beneficiary.accountNumber,
      ifscCode: beneficiary.ifscCode,
      bankName: beneficiary.bankName,
      transferType: 'imps'
    });
    navigate(`/bank-transfer-payment?${params.toString()}`);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    navigate(`/bank-transfer-detail/${transaction.id}`);
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
            <h1 className="text-base font-bold tracking-wider uppercase">Bank Transfer</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Send money securely</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddBeneficiaryDialog(true)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-beneficiary"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Financial Summary Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="payment-summary">
          <div className="space-y-6">
            {/* Total Transfers Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total Transferred</p>
                <div className="flex items-center gap-2">
                  <Send className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This Month</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-transferred">
                ₹{(mockRecentTransfers.reduce((sum, t) => sum + t.amount, 0) / 1000).toFixed(0)}K
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1 text-center" data-testid="card-transfer-count">
                <p className="text-lg font-light text-white" data-testid="text-transfer-count">
                  {mockRecentTransfers.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Transfers</p>
              </div>
              <div className="space-y-1 text-center" data-testid="card-beneficiaries">
                <p className="text-lg font-light text-white" data-testid="text-beneficiaries">
                  {mockBeneficiaries.length}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Beneficiaries</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-light text-white">
                  ₹{mockRecentTransfers.length > 0 ? (mockRecentTransfers.reduce((sum, t) => sum + t.amount, 0) / mockRecentTransfers.length / 1000).toFixed(0) : 0}K
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Avg Transfer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-recent"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="beneficiaries" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-beneficiaries"
            >
              Beneficiaries
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" 
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Recent Transfers Tab */}
          <TabsContent value="recent" className="mt-6">
            <div className="space-y-3">
              {mockRecentTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                  data-testid={`transfer-${transfer.id}`}
                  onClick={() => handleRecentTransferClick(transfer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <h4 className="font-light text-white text-sm tracking-wide">{transfer.beneficiaryName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-white/50 capitalize tracking-widest">{transfer.transferType}</p>
                          <span className="text-white/30">•</span>
                          <p className="text-[10px] text-white/50 tracking-widest">{new Date(transfer.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-light text-white tracking-tight" data-testid={`text-amount-${transfer.id}`}>
                          ₹{(transfer.amount / 1000).toFixed(0)}K
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <CheckCircle className={`h-3 w-3 ${getStatusColor(transfer.status)}`} />
                          <span className={`text-[10px] font-light uppercase tracking-widest ${getStatusColor(transfer.status)}`}>
                            {transfer.status}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Beneficiaries Tab */}
          <TabsContent value="beneficiaries" className="mt-6">
            <div className="space-y-3">
              {mockBeneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                  data-testid={`beneficiary-${beneficiary.id}`}
                  onClick={() => handleBeneficiaryClick(beneficiary)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <h4 className="font-light text-white text-sm tracking-wide">{beneficiary.name}</h4>
                        <p className="text-[10px] text-white/50 tracking-widest mt-1">{beneficiary.bankName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-light text-white tracking-tight">{beneficiary.accountNumber}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{beneficiary.ifscCode}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                  data-testid={`transaction-${transaction.id}`}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                        <Send className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <h4 className="font-light text-white text-sm tracking-wide">{transaction.beneficiaryName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">{transaction.transactionId}</p>
                          <span className="text-white/30">•</span>
                          <p className="text-[10px] text-white/50 tracking-widest">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-light text-white tracking-tight" data-testid={`text-transaction-amount-${transaction.id}`}>
                          ₹{(transaction.amount / 1000).toFixed(0)}K
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">
                            {transaction.transferType}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Beneficiary Dialog */}
      <Dialog open={showAddBeneficiaryDialog} onOpenChange={setShowAddBeneficiaryDialog}>
        <DialogContent className="bg-black border border-white/10 text-white rounded-none">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Beneficiary</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form id="add-beneficiary-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Beneficiary Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter recipient full name"
                        className="bg-white/5 border-white/10 text-white rounded-none"
                        data-testid="input-recipient-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Account Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter account number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={20}
                        className="bg-white/5 border-white/10 text-white rounded-none"
                        data-testid="input-account-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Confirm Account Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Re-enter account number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={20}
                        className="bg-white/5 border-white/10 text-white rounded-none"
                        data-testid="input-confirm-account-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">IFSC Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. HDFC0001234"
                        maxLength={11}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        className="bg-white/5 border-white/10 text-white rounded-none"
                        data-testid="input-ifsc-code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Bank Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. HDFC Bank"
                        className="bg-white/5 border-white/10 text-white rounded-none"
                        data-testid="input-bank-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddBeneficiaryDialog(false)}
                  className="flex-1 border-white/10 text-white hover:bg-white/10 rounded-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-save-beneficiary"
                  onClick={() => {
                    toast({
                      title: "Beneficiary Added",
                      description: "New beneficiary has been added successfully."
                    });
                    setShowAddBeneficiaryDialog(false);
                  }}
                >
                  Add Beneficiary
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-black border border-white/10 text-white rounded-none">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Transfer</DialogTitle>
          </DialogHeader>
          
          {transferData && (
            <div className="space-y-4">
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">To</span>
                    <span className="text-white font-medium">{transferData.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Account</span>
                    <span className="text-white">****{transferData.accountNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Bank</span>
                    <span className="text-white">{transferData.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount</span>
                    <span className="text-white font-bold">{formatCurrency(transferData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Mode</span>
                    <span className="text-white">{transferData.transferType.toUpperCase()}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 border-white/10 text-white hover:bg-white/10 rounded-none"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmTransfer}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-confirm-transfer"
                >
                  Confirm Transfer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
