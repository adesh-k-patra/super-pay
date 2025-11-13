import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
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
import type { FamilyUpiAccount } from "@shared/schema";

export default function FamilyUpiEdit() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/family-upi/edit/:id");
  const { toast } = useToast();

  const [showPin, setShowPin] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [initialBankAccountId, setInitialBankAccountId] = useState("");

  const [formData, setFormData] = useState({
    familyName: "",
    upiId: "",
    linkedBankAccountId: "",
    monthlyLimit: "",
    dailyLimit: ""
  });

  // Fetch account details
  const { data: familyAccounts = [] } = useQuery<FamilyUpiAccount[]>({
    queryKey: ['/api/family-upi/accounts'],
  });

  const account = familyAccounts.find(acc => acc.id === params?.id);

  // Fetch linked bank accounts
  const { data: bankAccountsData } = useQuery<{ accounts: any[] }>({
    queryKey: ['/api/bank-accounts'],
  });

  const linkedBankAccounts = (bankAccountsData?.accounts || []).map(acc => ({
    id: acc.id,
    accountNumber: acc.accountNumber,
    bankName: acc.bankName,
    ifscCode: acc.ifscCode,
    accountType: acc.accountType
  }));

  // Initialize form data when account is loaded
  useEffect(() => {
    if (account) {
      const linkedBank = linkedBankAccounts.find(acc => 
        acc.bankName === account.bankName && 
        acc.accountNumber === account.accountNumber
      );

      const bankId = linkedBank?.id || "";
      setInitialBankAccountId(bankId);
      setFormData({
        familyName: account.familyName || "",
        upiId: account.upiId || "",
        linkedBankAccountId: bankId,
        monthlyLimit: account.monthlyLimit || "500000",
        dailyLimit: account.dailyLimit || "100000"
      });
    }
  }, [account, linkedBankAccounts]);

  const verifyPinMutation = useMutation({
    mutationFn: async (pin: string) => {
      // In a real app, verify PIN against stored hash
      // For now, we'll simulate verification
      if (pin.length !== 4) {
        throw new Error("Invalid PIN");
      }
      return { verified: true };
    },
    onSuccess: () => {
      setPinVerified(true);
      toast({
        title: "VERIFIED",
        description: "PIN verified successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "VERIFICATION FAILED",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateAccountMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!params?.id) throw new Error("Account ID not found");

      const selectedBank = linkedBankAccounts.find(acc => acc.id === data.linkedBankAccountId);
      
      const updateData: any = {
        familyName: data.familyName,
        upiId: data.upiId,
        monthlyLimit: data.monthlyLimit,
        dailyLimit: data.dailyLimit
      };

      // Check if bank account changed from initial selection
      if (selectedBank && data.linkedBankAccountId !== initialBankAccountId) {
        updateData.bankName = selectedBank.bankName;
        updateData.accountNumber = selectedBank.accountNumber;
        updateData.ifscCode = selectedBank.ifscCode;
      }

      return await apiRequest('PATCH', `/api/family-upi/accounts/${params.id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-upi/accounts'] });
      toast({
        title: "SUCCESS",
        description: "Family UPI account updated successfully",
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

  const handleVerifyPin = () => {
    if (!enteredPin || enteredPin.length !== 4) {
      toast({
        title: "INVALID PIN",
        description: "Please enter a 4-digit PIN",
        variant: "destructive"
      });
      return;
    }

    verifyPinMutation.mutate(enteredPin);
  };

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

    updateAccountMutation.mutate(formData);
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-none animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-light tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pinVerified) {
    return (
      <>
        <TicketHeader 
          title="VERIFY PIN" 
          subtitle="Enter your PIN to continue"
          backPath="/family-upi"
          ticketIcon={<Lock className="h-5 w-5" />}
        />

        <div className="min-h-screen bg-black text-white">
          <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="bg-white/10 border border-white/20 p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Security Verification</h2>
              <p className="text-sm text-white/60 font-light">
                Enter your 4-digit PIN to edit<br />
                <span className="text-white font-medium">{account.familyName}</span>
              </p>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center justify-center gap-2">
                <Lock className="h-3 w-3" />
                ENTER PIN
              </Label>
              <div className="relative">
                <Input
                  value={enteredPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setEnteredPin(value);
                  }}
                  placeholder="••••"
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-auto min-h-[64px] text-2xl font-light px-4 tracking-[0.5em] text-center focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  data-testid="input-verify-pin"
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

            <div className="pt-6 max-w-md mx-auto">
              <Button
                onClick={handleVerifyPin}
                disabled={verifyPinMutation.isPending}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-16 text-base font-medium uppercase tracking-wider"
                data-testid="button-verify-pin"
              >
                {verifyPinMutation.isPending ? "VERIFYING..." : "VERIFY PIN"}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TicketHeader 
        title="EDIT FAMILY UPI" 
        subtitle="Update account details"
        backPath="/family-upi"
        ticketIcon={<Users className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
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

          {/* Submit Button */}
          <div className="pt-6 space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={updateAccountMutation.isPending}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-16 text-base font-medium uppercase tracking-wider"
              data-testid="button-update-account"
            >
              {updateAccountMutation.isPending ? "UPDATING..." : "UPDATE FAMILY UPI ACCOUNT"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
