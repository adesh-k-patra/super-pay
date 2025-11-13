import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Lock, CheckCircle, Eye, EyeOff, Shield, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  upiId: string;
}

export default function BankTransferPayment() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const searchParams = new URLSearchParams(window.location.search);
  const recipientName = searchParams.get('recipientName') || '';
  const recipientAccount = searchParams.get('accountNumber') || '';
  const ifscCode = searchParams.get('ifscCode') || '';
  const bankName = searchParams.get('bankName') || '';
  const transferType = searchParams.get('transferType') || 'imps';
  
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('1');
  const [upiPin, setUpiPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);

  const mockBankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'HDFC Bank',
      accountNumber: '****1234',
      balance: 125000,
      upiId: 'user@hdfcbank'
    },
    {
      id: '2',
      bankName: 'ICICI Bank',
      accountNumber: '****5678',
      balance: 45000,
      upiId: 'user@icici'
    },
    {
      id: '3',
      bankName: 'SBI',
      accountNumber: '****9012',
      balance: 78000,
      upiId: 'user@sbi'
    }
  ];

  const selectedAccountData = mockBankAccounts.find(acc => acc.id === selectedAccount);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...upiPin];
      newPin[index] = value;
      setUpiPin(newPin);

      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !upiPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAmountClick = () => {
    if (showPinPopup) {
      setShowPinPopup(false);
    }
  };

  const handlePayButtonClick = () => {
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    if (!showPinPopup) {
      setShowPinPopup(true);
      setTimeout(() => {
        const firstPinInput = document.getElementById('pin-0');
        firstPinInput?.focus();
      }, 300);
    } else {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    const pin = upiPin.join('');
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit UPI PIN",
        variant: "destructive"
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAccountData || amountValue > selectedAccountData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Selected account has insufficient balance",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const transactionId = `BT${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      const successParams = new URLSearchParams({
        id: transactionId,
        type: 'bank-transfer',
        amount: amount,
        recipientName: recipientName,
        recipientAccount: recipientAccount,
        bankName: bankName,
        transferType: transferType,
        accountId: selectedAccount,
        senderBank: selectedAccountData.bankName,
        timestamp: timestamp
      });

      navigate(`/transaction-success?${successParams.toString()}`);
    }, 2000);
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

  const isAmountValid = amount && parseFloat(amount) > 0 && !isNaN(parseFloat(amount));

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/bank-transfer')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Bank Transfer</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Send money securely</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Recipient Info Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white/60" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-light text-white mb-1 tracking-wide">{recipientName}</h3>
              <p className="text-xs text-white/60 font-light">{bankName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Account</p>
              <p className="text-sm font-light text-white">{recipientAccount}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">IFSC Code</p>
              <p className="text-sm font-light text-white">{ifscCode}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">
              {transferType.toUpperCase()} Transfer
            </Badge>
          </div>
        </div>

        {/* Payment Amount Card */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center">
            <Label className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light block">Payment Amount</Label>
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
                onClick={handleAmountClick}
                placeholder="0"
                className="text-5xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none text-center pl-12 focus:border-white h-20 placeholder:text-white/20"
                data-testid="input-payment-amount"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <TrendingUp className="h-4 w-4 text-white/60" />
              <span className="text-xs text-white/60 font-light tracking-wider">Secure Transaction</span>
            </div>
          </div>
        </div>

        {/* Select Bank Account */}
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Building2 className="h-3 w-3" />
            Select Bank Account
          </Label>
          <div className="space-y-3">
            {mockBankAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account.id)}
                className={cn(
                  "w-full p-4 border-b transition-all text-left",
                  selectedAccount === account.id
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/30"
                )}
                data-testid={`account-option-${account.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "font-light tracking-wider transition-opacity",
                    selectedAccount === account.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                  )}>
                    {account.bankName}
                  </p>
                  <Badge className={cn(
                    "rounded-none border font-light text-xs",
                    selectedAccount === account.id 
                      ? "bg-white/20 text-white border-white/30" 
                      : "bg-white/10 text-white/60 border-white/20"
                  )}>
                    {account.accountNumber}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 font-light">{account.upiId}</p>
                  <p className={cn(
                    "text-sm font-light",
                    selectedAccount === account.id ? "text-white" : "text-white/60"
                  )} data-testid={`balance-${account.id}`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light text-white mb-1 tracking-wider">Secure Payment</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Your payment is secured with bank-grade encryption. UPI PIN is never stored or shared.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPinPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setShowPinPopup(false)}
          data-testid="popup-backdrop"
        />
      )}

      <div 
        className={cn(
          "fixed left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40 transition-all duration-300 ease-in-out",
          showPinPopup ? "bottom-20" : "-bottom-[400px]"
        )}
        data-testid="pin-popup"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Enter 4-Digit UPI PIN
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPin(!showPin)}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-7 px-2 font-light"
              data-testid="button-toggle-pin"
            >
              {showPin ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                id={`pin-${index}`}
                type={showPin ? "text" : "password"}
                maxLength={1}
                value={upiPin[index]}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className="w-16 h-16 text-center text-3xl font-light bg-transparent border-b-2 border-white/20 rounded-none text-white focus:border-white transition-colors"
                data-testid={`input-pin-${index}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <p className="text-xs text-white/60 font-light tracking-wider" data-testid="account-info">
              {selectedAccountData && `${selectedAccountData.bankName} • ${selectedAccountData.upiId}`}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={handlePayButtonClick}
          disabled={!isAmountValid || isProcessing || (showPinPopup && upiPin.join('').length !== 4)}
          className={cn(
            "w-full rounded-none h-14 text-base font-light tracking-wider transition-all",
            isAmountValid && !isProcessing
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          )}
          data-testid="button-pay"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2" />
              Processing Payment...
            </>
          ) : showPinPopup ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {`CONFIRM PAYMENT ${formatCurrency(amount)}`}
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {isAmountValid ? `PAY ${formatCurrency(amount)}` : 'ENTER AMOUNT'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
