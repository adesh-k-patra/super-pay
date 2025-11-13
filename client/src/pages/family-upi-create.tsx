import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TicketHeader } from "@/components/ui/ticket-header";
import { BankAccountPicker } from "@/components/ui/bank-account-picker";
import { Users, CreditCard, Lock, Hash, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function FamilyUpiCreate() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    familyName: "",
    upiId: "",
    linkedBankAccountId: "",
    pin: "",
    confirmPin: "",
    monthlyLimit: "500000",
    dailyLimit: "100000"
  });

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Fetch linked bank accounts
  const { data: bankAccountsData } = useQuery<{ accounts: any[] }>({
    queryKey: ['/api/bank-accounts'],
  });

  // Dummy bank accounts
  const dummyBankAccounts = [
    {
      id: 'dummy-1',
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      accountType: 'Savings'
    },
    {
      id: 'dummy-2',
      accountNumber: '9876543210',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0009876',
      accountType: 'Current'
    },
    {
      id: 'dummy-3',
      accountNumber: '5555666677',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0005555',
      accountType: 'Savings'
    },
    {
      id: 'dummy-4',
      accountNumber: '4444333322',
      bankName: 'Axis Bank',
      ifscCode: 'UTIB0004444',
      accountType: 'Savings'
    }
  ];

  const apiAccounts = (bankAccountsData?.accounts || []).map(acc => ({
    id: acc.id,
    accountNumber: acc.accountNumber,
    bankName: acc.bankName,
    ifscCode: acc.ifscCode,
    accountType: acc.accountType
  }));

  const linkedBankAccounts = [...dummyBankAccounts, ...apiAccounts];

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validate PIN
      if (!data.pin || data.pin.length !== 4) {
        throw new Error("PIN must be 4 digits");
      }
      if (data.pin !== data.confirmPin) {
        throw new Error("PINs do not match");
      }

      const selectedBank = linkedBankAccounts.find(acc => acc.id === data.linkedBankAccountId);
      if (!selectedBank) {
        throw new Error("Please select a bank account");
      }

      const accountData = {
        familyName: data.familyName,
        upiId: data.upiId,
        bankName: selectedBank.bankName,
        accountNumber: selectedBank.accountNumber,
        ifscCode: selectedBank.ifscCode,
        monthlyLimit: data.monthlyLimit,
        dailyLimit: data.dailyLimit,
        pin: data.pin
      };

      return await apiRequest('POST', '/api/family-upi/accounts', accountData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-upi/accounts'] });
      toast({
        title: "SUCCESS",
        description: "Family UPI account created successfully",
      });
      navigate('/family-upi');
    },
    onError: (error: Error) => {
      toast({
        title: "ERROR",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!formData.familyName) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please enter a family name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.upiId) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please enter a UPI ID",
        variant: "destructive"
      });
      return;
    }

    if (!formData.linkedBankAccountId) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a linked bank account",
        variant: "destructive"
      });
      return;
    }

    if (!formData.pin || formData.pin.length !== 4) {
      toast({
        title: "INVALID PIN",
        description: "PIN must be 4 digits",
        variant: "destructive"
      });
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      toast({
        title: "PIN MISMATCH",
        description: "PINs do not match",
        variant: "destructive"
      });
      return;
    }

    createAccountMutation.mutate(formData);
  };

  return (
    <>
      <TicketHeader 
        title="CREATE FAMILY UPI" 
        subtitle="Set up a shared UPI account"
        backPath="/family-upi"
        ticketIcon={<Users className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white pb-24">
        <div className="pt-24 px-4 pb-8 w-full max-w-screen-lg mx-auto space-y-8">
          {/* Family Name */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Users className="h-3 w-3" />
              FAMILY NAME
            </Label>
            <Input
              value={formData.familyName}
              onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
              placeholder="e.g., My Family, Joint Account"
              className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto min-h-[64px] text-xl font-light px-4 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid="input-family-name"
            />
          </div>

          {/* UPI ID */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Hash className="h-3 w-3" />
              UPI ID
            </Label>
            <Input
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              placeholder="family@upi"
              className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto min-h-[64px] text-xl font-light px-4 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid="input-upi-id"
            />
          </div>

          {/* Bank Account Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <CreditCard className="h-3 w-3" />
              LINKED BANK ACCOUNT
            </Label>
            <BankAccountPicker
              accounts={linkedBankAccounts}
              value={formData.linkedBankAccountId}
              onValueChange={(value) => setFormData({ ...formData, linkedBankAccountId: value })}
              placeholder="Select a linked bank account"
              testId="select-bank-account"
            />
            {linkedBankAccounts.length === 0 ? (
              <p className="text-xs text-white/60 font-light mt-2">
                No bank accounts linked. <button
                  onClick={() => navigate('/my-bank-accounts')}
                  className="text-white underline hover:text-white/80 font-medium transition-colors"
                  data-testid="link-add-bank"
                >
                  Link a bank account
                </button>
              </p>
            ) : (
              <p className="text-xs text-white/50 font-light mt-2">
                Don't see your bank? <button
                  onClick={() => navigate('/my-bank-accounts')}
                  className="text-white/80 underline hover:text-white font-medium transition-colors"
                  data-testid="link-add-bank-more"
                >
                  Add new account
                </button>
              </p>
            )}
          </div>

          {/* Spending Limits */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <DollarSign className="h-3 w-3" />
                DAILY LIMIT
              </Label>
              <Input
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
                placeholder="100000"
                type="number"
                className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto min-h-[64px] text-xl font-light px-4 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                data-testid="input-daily-limit"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <DollarSign className="h-3 w-3" />
                MONTHLY LIMIT
              </Label>
              <Input
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                placeholder="500000"
                type="number"
                className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto min-h-[64px] text-xl font-light px-4 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                data-testid="input-monthly-limit"
              />
            </div>
          </div>

          {/* PIN Section */}
          <div className="border-t border-white/10 pt-8 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Security PIN</h3>
              <p className="text-xs text-white/50 font-light">Create a 4-digit PIN to secure this account</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Lock className="h-3 w-3" />
                CREATE PIN
              </Label>
              <div className="relative">
                <Input
                  value={formData.pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData({ ...formData, pin: value });
                  }}
                  placeholder="••••"
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto min-h-[64px] text-2xl font-light px-4 tracking-[0.5em] focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  data-testid="input-pin"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white uppercase tracking-wider"
                >
                  {showPin ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Lock className="h-3 w-3" />
                CONFIRM PIN
              </Label>
              <div className="relative">
                <Input
                  value={formData.confirmPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData({ ...formData, confirmPin: value });
                  }}
                  placeholder="••••"
                  type={showConfirmPin ? "text" : "password"}
                  maxLength={4}
                  className={cn(
                    "bg-transparent border-0 border-b-2 rounded-none h-auto min-h-[64px] text-2xl font-light px-4 tracking-[0.5em] focus-visible:ring-0 focus-visible:ring-offset-0",
                    formData.confirmPin && formData.pin !== formData.confirmPin 
                      ? "border-red-500/50 focus-visible:border-red-500" 
                      : "border-white/20 focus-visible:border-white"
                  )}
                  data-testid="input-confirm-pin"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white uppercase tracking-wider"
                >
                  {showConfirmPin ? "HIDE" : "SHOW"}
                </button>
              </div>
              {formData.confirmPin && formData.pin !== formData.confirmPin && (
                <p className="text-xs text-red-500 font-light">PINs do not match</p>
              )}
            </div>
          </div>

        </div>

        {/* Submit Button - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
          <div className="w-full max-w-screen-lg mx-auto">
            <Button
              onClick={handleSubmit}
              disabled={createAccountMutation.isPending}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-16 text-base font-medium uppercase tracking-wider"
              data-testid="button-create-account"
            >
              {createAccountMutation.isPending ? "CREATING ACCOUNT..." : "CREATE FAMILY UPI ACCOUNT"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
