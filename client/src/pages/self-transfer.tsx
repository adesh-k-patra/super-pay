import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  ArrowUpDown, 
  Wallet, 
  Building2, 
  CheckCircle,
  TrendingUp,
  Shield
} from "lucide-react";

// Account data
const USER_ACCOUNTS = [
  {
    id: "wallet",
    name: "Super Pay Wallet",
    accountNumber: "HEX-WALLET",
    balance: 15000,
    icon: Wallet,
    color: "bg-white/10"
  },
  {
    id: "hdfc",
    name: "HDFC Bank Savings",
    accountNumber: "****1234",
    balance: 45000,
    icon: Building2,
    color: "bg-white/10"
  },
  {
    id: "icici",
    name: "ICICI Bank Current",
    accountNumber: "****5678",
    balance: 89000,
    icon: Building2,
    color: "bg-white/10"
  },
  {
    id: "investment",
    name: "Investment Account",
    accountNumber: "INV-001",
    balance: 125000,
    icon: TrendingUp,
    color: "bg-white/10"
  }
];

export default function SelfTransfer() {
  const [, navigate] = useLocation();
  const [fromAccount, setFromAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/home");
  };

  const handleSwapAccounts = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  };

  const handleTransfer = () => {
    // Validation
    if (!fromAccount || !toAccount || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select both accounts and enter an amount",
        variant: "destructive"
      });
      return;
    }

    if (fromAccount === toAccount) {
      toast({
        title: "Invalid Selection",
        description: "Source and destination accounts must be different",
        variant: "destructive"
      });
      return;
    }

    const sourceAccount = USER_ACCOUNTS.find(acc => acc.id === fromAccount);
    const transferAmount = parseFloat(amount);

    if (sourceAccount && transferAmount > sourceAccount.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds in the selected account",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmTransfer = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Transfer Successful!",
        description: `₹${parseFloat(amount).toLocaleString()} transferred successfully`
      });
      
      // Reset form
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setShowConfirmDialog(false);
      
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Unable to process the transfer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const strValue = typeof value === 'string' ? value : value.toString();
    const decimalPlaces = strValue.includes('.') ? strValue.split('.')[1]?.length || 0 : 0;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(numValue);
  };

  const getAccountById = (id: string) => {
    return USER_ACCOUNTS.find(acc => acc.id === id);
  };

  const sourceAccountData = getAccountById(fromAccount);
  const destinationAccountData = getAccountById(toAccount);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SELF TRANSFER</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Transfer between accounts</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Amount Input Card - At Top */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center">
            <Label className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light block">Transfer Amount</Label>
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-white/60">₹</span>
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = value.split('.');
                  if (parts.length <= 2 && (!parts[1] || parts[1].length <= 2)) {
                    setAmount(value);
                  }
                }}
                placeholder="0"
                className="text-5xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none text-center pl-12 focus:border-white h-20 placeholder:text-white/20"
                data-testid="input-transfer-amount"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="h-4 w-4 text-white/60" />
              <span className="text-xs text-white/60 font-light tracking-wider">Secure Transfer</span>
            </div>
          </div>
        </div>

        {/* From Account Dropdown */}
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Building2 className="h-3 w-3" />
            From Account
          </Label>
          <Select value={fromAccount} onValueChange={setFromAccount}>
            <SelectTrigger className="w-full bg-black border-white/10 text-white rounded-none h-14 font-light tracking-wider">
              <SelectValue placeholder="Select source account" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10 rounded-none">
              {USER_ACCOUNTS.map((account) => (
                <SelectItem 
                  key={account.id} 
                  value={account.id}
                  className="text-white focus:bg-white/10 focus:text-white rounded-none"
                  data-testid={`option-from-${account.id}`}
                >
                  <div className="flex items-center gap-3 py-1">
                    <div className={cn("w-8 h-8 border border-white/10 flex items-center justify-center", account.color)}>
                      <account.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-light text-sm">{account.name}</p>
                      <p className="text-xs text-white/60">{account.accountNumber} • {formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwapAccounts}
            className="w-12 h-12 rounded-none bg-white/10 hover:bg-white/20 border border-white/10"
            disabled={!fromAccount || !toAccount}
            data-testid="button-swap-accounts"
          >
            <ArrowUpDown className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* To Account Dropdown */}
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Building2 className="h-3 w-3" />
            To Account
          </Label>
          <Select value={toAccount} onValueChange={setToAccount}>
            <SelectTrigger className="w-full bg-black border-white/10 text-white rounded-none h-14 font-light tracking-wider">
              <SelectValue placeholder="Select destination account" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10 rounded-none">
              {USER_ACCOUNTS.filter(acc => acc.id !== fromAccount).map((account) => (
                <SelectItem 
                  key={account.id} 
                  value={account.id}
                  className="text-white focus:bg-white/10 focus:text-white rounded-none"
                  data-testid={`option-to-${account.id}`}
                >
                  <div className="flex items-center gap-3 py-1">
                    <div className={cn("w-8 h-8 border border-white/10 flex items-center justify-center", account.color)}>
                      <account.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-light text-sm">{account.name}</p>
                      <p className="text-xs text-white/60">{account.accountNumber} • {formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Available Balance Card */}
        {sourceAccountData && (
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 border border-white/20 rounded-none p-2">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-light text-white mb-1 tracking-wider">Available Balance</h3>
                <p className="text-2xl text-white font-light" data-testid="text-available-balance">
                  {formatCurrency(sourceAccountData.balance)}
                </p>
                <p className="text-xs text-white/60 font-light mt-1">{sourceAccountData.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light text-white mb-1 tracking-wider">Secure Transfer</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Your transfer is secured with bank-grade encryption. Funds will be transferred instantly between accounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={handleTransfer}
          className="w-full h-14 bg-white text-black hover:bg-white/90 font-light text-base tracking-wider rounded-none"
          disabled={!fromAccount || !toAccount || !amount}
          data-testid="button-transfer"
        >
          Transfer {amount ? formatCurrency(parseFloat(amount)) : '₹0'}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm bg-black text-white border-white/10 rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-white text-center tracking-wider">Confirm Transfer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="text-4xl font-light text-white tracking-tight" data-testid="text-confirm-amount">
                {amount ? formatCurrency(parseFloat(amount)) : '₹0'}
              </div>
              
              {sourceAccountData && destinationAccountData && (
                <div className="space-y-3">
                  <div className="border border-white/10 p-4 bg-white/5 backdrop-blur-sm">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">From</p>
                    <div className="flex items-center gap-2">
                      <sourceAccountData.icon className="h-4 w-4 text-white/80" />
                      <span className="text-white font-light text-sm">{sourceAccountData.name}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{sourceAccountData.accountNumber}</p>
                  </div>
                  <div className="border border-white/10 p-4 bg-white/5 backdrop-blur-sm">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">To</p>
                    <div className="flex items-center gap-2">
                      <destinationAccountData.icon className="h-4 w-4 text-white/80" />
                      <span className="text-white font-light text-sm">{destinationAccountData.name}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{destinationAccountData.accountNumber}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isProcessing}
                data-testid="button-cancel-transfer"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                onClick={confirmTransfer}
                disabled={isProcessing}
                data-testid="button-confirm-transfer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
