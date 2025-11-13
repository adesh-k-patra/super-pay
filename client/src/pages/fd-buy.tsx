import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Wallet,
  CreditCard,
  Building2,
  Shield,
  TrendingUp,
  DollarSign,
  Info,
  CheckCircle,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FDBuy() {
  const [, navigate] = useLocation();
  const params = useParams();
  const fdId = params.id;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [amount, setAmount] = useState("10000");
  const [tenure, setTenure] = useState("12");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Mock FD data - in real app, this would come from API
  const fd = {
    name: "HDFC Bank Fixed Deposit",
    bank: "HDFC Bank",
    interestRate: 7.5,
    minDeposit: 10000,
    tenures: [
      { months: 6, rate: 7.0 },
      { months: 12, rate: 7.5 },
      { months: 24, rate: 7.75 },
      { months: 36, rate: 8.0 },
      { months: 60, rate: 8.25 }
    ]
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const calculateReturns = () => {
    const principal = parseFloat(amount) || 0;
    const selectedTenure = fd.tenures.find(t => t.months.toString() === tenure) || fd.tenures[1];
    const rate = selectedTenure.rate / 100;
    const time = selectedTenure.months / 12;
    
    // Simple interest calculation
    const interest = principal * rate * time;
    const maturityAmount = principal + interest;
    
    return {
      principal,
      interest,
      maturityAmount,
      rate: selectedTenure.rate,
      months: selectedTenure.months
    };
  };

  const projections = calculateReturns();

  const handleBuy = () => {
    navigate(`/fd/congrats?id=${fdId}&amount=${amount}&tenure=${tenure}`);
  };

  if (!isAuthenticated || authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4 p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fixed-deposits")}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Open Fixed Deposit</h1>
            <p className="text-sm text-white/60">Secure your future with guaranteed returns</p>
          </div>
        </div>
      </div>

      <div className="pt-24 p-4 space-y-6">
        {/* FD Summary Card */}
        <Card className="bg-gradient-to-br from-orange-500/20 to-amber-500/10 border bg-white/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 bg-white/10" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{fd.name}</h3>
                <p className="text-sm text-white/70">{fd.bank}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white/10 bg-white/10 border-0 text-xs">
                    Fixed Deposit
                  </Badge>
                  <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                    Up to {Math.max(...fd.tenures.map(t => t.rate))}% Returns
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Amount */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 bg-white/10" />
              Deposit Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/20 text-white mt-2"
                placeholder={fd.minDeposit.toString()}
                data-testid="input-amount"
              />
              <p className="text-xs text-white/50 mt-1">Minimum: ₹{fd.minDeposit.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[10000, 25000, 50000, 100000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className={cn(
                    "text-xs",
                    amount === preset.toString()
                      ? "bg-white/10 text-white bg-white/10"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  )}
                  data-testid={`button-preset-${preset}`}
                >
                  ₹{(preset / 1000).toFixed(0)}K
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tenure Selection */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 bg-white/10" />
              Select Tenure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={tenure} onValueChange={setTenure}>
              {fd.tenures.map((t) => (
                <div key={t.months} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={t.months.toString()} id={`tenure-${t.months}`} data-testid={`radio-tenure-${t.months}`} />
                    <Label htmlFor={`tenure-${t.months}`} className="text-white cursor-pointer">
                      {t.months} Months {t.months >= 12 && `(${(t.months / 12).toFixed(0)} Year${t.months > 12 ? 's' : ''})`}
                    </Label>
                  </div>
                  <Badge className="bg-white/10 bg-white/10 border-0">
                    {t.rate}% p.a.
                  </Badge>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 bg-white/10" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="upi" id="upi" data-testid="radio-upi" />
                <Label htmlFor="upi" className="text-white cursor-pointer flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  UPI / Wallet
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                <Label htmlFor="card" className="text-white cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Debit / Credit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="netbanking" id="netbanking" data-testid="radio-netbanking" />
                <Label htmlFor="netbanking" className="text-white cursor-pointer flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Net Banking
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Maturity Details */}
        <Card className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5 bg-white/10" />
              Maturity Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Principal Amount</span>
              <span className="text-white font-semibold">₹{projections.principal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Interest Rate</span>
              <span className="text-white font-semibold">{projections.rate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Tenure</span>
              <span className="text-white font-semibold">{projections.months} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Interest Earned</span>
              <span className="bg-white/10 font-semibold">₹{projections.interest.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex justify-between">
              <span className="text-white/70">Maturity Amount</span>
              <span className="text-white font-bold text-lg">₹{projections.maturityAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <p className="text-xs text-white/50 text-center mt-2">
              Maturity date: {new Date(Date.now() + projections.months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 bg-white/10 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">DICGC Insured</h4>
                <p className="text-sm text-white/70">Your deposit is insured up to ₹5 lakh by Deposit Insurance and Credit Guarantee Corporation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleBuy}
          className="w-full bg-white/10 hover:bg-white/10 text-white h-14 text-base font-semibold"
          data-testid="button-confirm-purchase"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm & Open FD
        </Button>
      </div>
    </div>
  );
}
