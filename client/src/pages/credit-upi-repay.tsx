import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Check, Wallet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { CreditUpiAccount } from "@shared/schema";

export default function CreditUpiRepay() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [repaymentType, setRepaymentType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");

  const { data: accountData } = useQuery<{ account: CreditUpiAccount | null }>({
    queryKey: ["/api/credit-upi/account"],
  });

  const account = accountData?.account;
  const outstandingAmount = parseFloat(account?.outstandingAmount || "0");
  const creditLimit = parseFloat(account?.creditLimit || "0");
  const availableLimit = parseFloat(account?.availableLimit || "0");

  const handleRepaymentTypeChange = (value: string) => {
    setRepaymentType(value as "full" | "partial");
    if (value === "full") {
      setAmount(outstandingAmount.toString());
    } else {
      setAmount("");
    }
  };


  if (outstandingAmount === 0) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/credit-upi")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">REPAY OUTSTANDING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Pay Back Credit</p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-24 px-4 space-y-6 max-w-2xl mx-auto">
          <div className="border border-white/20 bg-white/5 backdrop-blur-xl p-12 text-center space-y-4">
            <Check className="h-16 w-16 mx-auto text-white" />
            <h2 className="text-2xl font-light text-white tracking-wider uppercase" data-testid="text-no-outstanding">NO OUTSTANDING BALANCE</h2>
            <p className="text-white/70 font-light tracking-wider">You don't have any outstanding amount to repay</p>
            <Button
              onClick={() => navigate("/credit-upi")}
              className="bg-white text-black hover:bg-white/90 rounded-none px-8 py-3 font-light tracking-wider mt-4"
              data-testid="button-go-back"
            >
              GO BACK TO DASHBOARD
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/credit-upi")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">REPAY OUTSTANDING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Pay Back Credit</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-2xl mx-auto">
        <div className="border border-white/20 bg-white/5 backdrop-blur-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60 uppercase tracking-widest font-light">Outstanding Amount</div>
            <div className="text-4xl font-light text-white tracking-tight" data-testid="text-outstanding-amount">
              ₹{outstandingAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60 font-light">
            <Calendar className="h-4 w-4" />
            <span className="tracking-wider">Repay by the 16th of each month to avoid interest charges</span>
          </div>
        </div>

        <div className="border border-white/20 bg-white/5 backdrop-blur-xl p-8 space-y-6">
          <div className="space-y-4">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Repayment Type</Label>
            <RadioGroup value={repaymentType} onValueChange={handleRepaymentTypeChange} data-testid="radio-repayment-type">
              <div className="border-b border-white/20 bg-white/5 p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="full" id="full" className="border-white/40 text-white" />
                  <Label htmlFor="full" className="text-white flex-1 cursor-pointer font-light">
                    <div className="tracking-wider uppercase text-sm">Pay Full Amount</div>
                    <div className="text-xs text-white/60 mt-1 tracking-wider font-light">Pay ₹{outstandingAmount.toLocaleString('en-IN')} - Avoid all interest charges</div>
                  </Label>
                </div>
              </div>

              <div className="border-b border-white/20 bg-white/5 p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="partial" id="partial" className="border-white/40 text-white" />
                  <Label htmlFor="partial" className="text-white flex-1 cursor-pointer font-light">
                    <div className="tracking-wider uppercase text-sm">Pay Partial Amount</div>
                    <div className="text-xs text-white/60 mt-1 tracking-wider font-light">Pay any amount up to ₹{outstandingAmount.toLocaleString('en-IN')}</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white/60 text-xs uppercase tracking-widest font-light">Amount to Pay</Label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-white/60">₹</span>
              <Input
                id="amount"
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
                disabled={repaymentType === "full"}
                className="text-4xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none pl-10 focus:border-white h-16 placeholder:text-white/20 disabled:opacity-50"
                data-testid="input-amount"
              />
            </div>
            {repaymentType === "partial" && amount && parseFloat(amount) > 0 && (
              <p className="text-sm text-white/60 font-light tracking-wider">
                Remaining balance: ₹{(outstandingAmount - parseFloat(amount)).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <div className="border border-white/20 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm font-light">
              <span className="text-white/60 tracking-wider uppercase text-xs">Current Available Limit</span>
              <span className="text-white">₹{availableLimit.toLocaleString('en-IN')}</span>
            </div>
            {amount && parseFloat(amount) > 0 && (
              <div className="flex items-center justify-between text-sm font-light">
                <span className="text-white/60 tracking-wider uppercase text-xs">After Repayment</span>
                <span className="text-white">
                  ₹{(availableLimit + parseFloat(amount)).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-5">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light text-white mb-1 tracking-wider uppercase">Interest-Free Period</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                All utilized funds are interest-free if repaid in full by the 16th of each month. Interest begins accruing only after the due date.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={() => {
            const repayAmount = parseFloat(amount);
            if (!repayAmount || repayAmount <= 0) {
              toast({
                title: "Error",
                description: "Please enter a valid amount",
                variant: "destructive",
              });
              return;
            }

            if (repayAmount > outstandingAmount) {
              toast({
                title: "Error",
                description: "Repayment amount cannot exceed outstanding balance",
                variant: "destructive",
              });
              return;
            }

            navigate(`/upi-payment?amount=${repayAmount}&transactionType=credit-upi-repayment&repaymentType=${repaymentType}&returnUrl=/credit-upi`);
          }}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-pay-now"
        >
          <Wallet className="mr-2 h-5 w-5" />
          {amount && parseFloat(amount) > 0 ? `PAY NOW ₹${parseFloat(amount).toLocaleString('en-IN')}` : 'ENTER AMOUNT'}
        </Button>
      </div>
    </div>
  );
}
