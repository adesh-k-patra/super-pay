import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Store, CreditCard, Check, Lock, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CreditUpiAccount } from "@shared/schema";
import QRCode from "react-qr-code";

export default function CreditUpiPay() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [merchantName, setMerchantName] = useState("");
  const [merchantUpi, setMerchantUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("shopping");
  const [description, setDescription] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: accountData } = useQuery<{ account: CreditUpiAccount | null }>({
    queryKey: ["/api/credit-upi/account"],
  });

  const account = accountData?.account;
  const availableLimit = parseFloat(account?.availableLimit || "0");

  const handlePay = async () => {
    if (!merchantName.trim()) {
      toast({
        title: "Error",
        description: "Please enter merchant name",
        variant: "destructive",
      });
      return;
    }

    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (payAmount > availableLimit) {
      toast({
        title: "Insufficient Credit",
        description: `You only have ₹${availableLimit.toLocaleString('en-IN')} available`,
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await apiRequest("POST", "/api/credit-upi/transaction", {
        merchantName: merchantName.trim(),
        merchantUpi: merchantUpi.trim() || undefined,
        amount: payAmount,
        category,
        description: description.trim() || undefined,
      });
      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Payment Failed",
          description: result.message || "Failed to process payment",
          variant: "destructive",
        });
        return;
      }

      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/credit-upi/account"] });
      queryClient.invalidateQueries({ queryKey: ["/api/credit-upi/transactions"] });
      
      setTimeout(() => {
        navigate("/credit-upi");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-2 border-white flex items-center justify-center mx-auto">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-light text-white tracking-wider uppercase">PAYMENT SUCCESSFUL</h2>
          <p className="text-white/70 font-light tracking-wider">Your payment has been processed successfully</p>
          <div className="text-3xl font-light text-white tracking-tight">₹{parseFloat(amount).toLocaleString('en-IN')}</div>
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
            <h1 className="text-base font-bold tracking-wider">MAKE PAYMENT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Pay Using Credit UPI</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Payment Amount Card with QR Code - UPI Payment Style */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <Label className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light block">Payment Amount</Label>
              <div className="relative max-w-md">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-white/60">₹</span>
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
                  className="text-5xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none pl-12 focus:border-white h-20 placeholder:text-white/20"
                  data-testid="input-amount"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <TrendingUp className="h-4 w-4 text-white/60" />
                <span className="text-xs text-white/60 font-light tracking-wider">
                  Available Credit: ₹{availableLimit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            
            {/* QR Code on Right */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white p-3 rounded-lg">
                <QRCode
                  value={`upi://pay?pa=${merchantUpi || 'merchant@upi'}&pn=${merchantName || 'Merchant'}&am=${amount || '0'}&cu=INR`}
                  size={120}
                  level="M"
                />
              </div>
              <p className="text-xs text-white/60 font-light tracking-wider text-center">Scan to Pay</p>
            </div>
          </div>
        </div>

        {/* Merchant Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="merchantName" className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Store className="h-3 w-3" />
              Merchant Name
            </Label>
            <Input
              id="merchantName"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="Enter merchant name"
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white placeholder:text-white/40 focus:border-white font-light h-12"
              data-testid="input-merchant-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantUpi" className="text-white/60 text-xs uppercase tracking-widest font-light">Merchant UPI ID (Optional)</Label>
            <Input
              id="merchantUpi"
              value={merchantUpi}
              onChange={(e) => setMerchantUpi(e.target.value)}
              placeholder="merchant@upi"
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white placeholder:text-white/40 focus:border-white font-light h-12"
              data-testid="input-merchant-upi"
            />
          </div>
        </div>

        {/* Category & Description */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white/60 text-xs uppercase tracking-widest font-light">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-transparent border-b-2 border-white/20 rounded-none text-white font-light focus:border-white h-12" data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 text-white">
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="bills">Bills & Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white/60 text-xs uppercase tracking-widest font-light">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note"
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white placeholder:text-white/40 focus:border-white font-light h-12"
              data-testid="input-description"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light text-white mb-1 tracking-wider">Important Note</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Credit UPI can only be used for Person-to-Merchant (P2M) transactions. P2P transfers, cash withdrawals, and investments are strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={handlePay}
          disabled={processing || !merchantName || !amount || parseFloat(amount) <= 0}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-pay-now"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2" />
              PROCESSING...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {amount && parseFloat(amount) > 0 ? `PAY ₹${parseFloat(amount).toLocaleString('en-IN')}` : 'ENTER AMOUNT'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
