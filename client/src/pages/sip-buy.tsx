import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { getSIPPlan } from "@/data/sip-plans";
import { 
  ArrowLeft,
  Wallet,
  CreditCard,
  Building2,
  Shield,
  Calendar,
  TrendingUp,
  DollarSign,
  Info,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SIPBuy() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const sipId = `sip-${params.id}`;
  const sip = getSIPPlan(sipId);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [amount, setAmount] = useState(sip?.minSipAmount.toString() || "500");
  const [frequency, setFrequency] = useState("Monthly");
  const [duration, setDuration] = useState("until_cancelled");
  const [installments, setInstallments] = useState("12");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [autoDebit, setAutoDebit] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!sip) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4">SIP Plan not found</p>
          <Button onClick={() => navigate("/investment/sip")} className="bg-white text-black hover:bg-white/90">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const calculateMonthlyReturns = () => {
    const amt = parseFloat(amount) || 0;
    const months = duration === "until_cancelled" ? 60 : parseInt(installments);
    const totalInvested = amt * months;
    const expectedReturn = sip.returns5y / 100;
    const years = months / 12;
    const futureValue = totalInvested * Math.pow(1 + expectedReturn, years);
    return {
      totalInvested,
      expectedValue: futureValue,
      returns: futureValue - totalInvested
    };
  };

  const projections = calculateMonthlyReturns();

  const handleBuy = () => {
    navigate(`/investment/sip/congrats?id=${params.id}&amount=${amount}`);
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
            onClick={goBack}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-light">Buy SIP</h1>
            <p className="text-sm text-white/60">Complete your investment</p>
          </div>
        </div>
      </div>

      <div className="pt-24 p-4 space-y-6">
        {/* SIP Summary Card */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-none bg-white/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-white/80" />
              </div>
              <div className="flex-1">
                <h3 className="font-light text-white mb-1">{sip.name}</h3>
                <p className="text-sm text-white/70">{sip.fundHouse}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                    {sip.category}
                  </Badge>
                  <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                    {sip.returns1y}% Returns
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Amount */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-white/80" />
              Investment Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Monthly SIP Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/20 text-white mt-2"
                placeholder={sip.minSipAmount.toString()}
                data-testid="input-amount"
              />
              <p className="text-xs text-white/50 mt-1">Minimum: ₹{sip.minSipAmount}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[sip.minSipAmount, 1000, 2500, 5000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className={cn(
                    "text-xs",
                    amount === preset.toString()
                      ? "bg-white/10 text-white border-emerald-500"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  )}
                  data-testid={`button-preset-${preset}`}
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequency & Duration */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-white/80" />
              Frequency & Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80 mb-2 block">Payment Frequency</Label>
              <RadioGroup value={frequency} onValueChange={setFrequency}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Monthly" id="monthly" data-testid="radio-monthly" />
                  <Label htmlFor="monthly" className="text-white cursor-pointer">Monthly (Recommended)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Quarterly" id="quarterly" data-testid="radio-quarterly" />
                  <Label htmlFor="quarterly" className="text-white cursor-pointer">Quarterly</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-white/80 mb-2 block">Duration</Label>
              <RadioGroup value={duration} onValueChange={setDuration}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="until_cancelled" id="perpetual" data-testid="radio-perpetual" />
                  <Label htmlFor="perpetual" className="text-white cursor-pointer">Until I Cancel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" data-testid="radio-fixed" />
                  <Label htmlFor="fixed" className="text-white cursor-pointer">Fixed Installments</Label>
                </div>
              </RadioGroup>
              
              {duration === "fixed" && (
                <Input
                  type="number"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="bg-white/5 border-white/20 text-white mt-2"
                  placeholder="12"
                  data-testid="input-installments"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 text-white/80" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" data-testid="radio-upi" />
                <Label htmlFor="upi" className="text-white cursor-pointer flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  UPI / Wallet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
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

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none">
              <Label className="text-white/80">Enable Auto Debit</Label>
              <input
                type="checkbox"
                checked={autoDebit}
                onChange={(e) => setAutoDebit(e.target.checked)}
                className="w-4 h-4"
                data-testid="checkbox-auto-debit"
              />
            </div>
          </CardContent>
        </Card>

        {/* Projected Returns */}
        <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-white/80" />
              Projected Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Total Investment</span>
              <span className="text-white font-light">₹{projections.totalInvested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Expected Value</span>
              <span className="text-white font-light">₹{projections.expectedValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex justify-between">
              <span className="text-white/70">Estimated Returns</span>
              <span className="text-white/80 font-light">+₹{projections.returns.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <p className="text-xs text-white/50 text-center mt-2">
              Based on {sip.returns5y}% annual returns. Actual returns may vary.
            </p>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-light text-white mb-1">Secure & Safe</h4>
                <p className="text-sm text-white/70">Your investment is protected by industry-standard security measures and regulated by SEBI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleBuy}
          className="w-full bg-white/10 hover:bg-emerald-600 text-white h-14 text-base font-light"
          data-testid="button-confirm-purchase"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm & Start SIP
        </Button>
      </div>
    </div>
  );
}
