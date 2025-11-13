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
import { 
  ArrowLeft,
  Wallet,
  CreditCard,
  Building2,
  Shield,
  TrendingUp,
  DollarSign,
  Info,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MutualFundBuyPage() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const fundId = params.id;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [amount, setAmount] = useState("5000");
  const [investmentType, setInvestmentType] = useState("lumpsum");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Mock fund data - in real app, this would come from API
  const fund = {
    name: "HDFC Top 100 Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Large Cap",
    nav: 652.35,
    minInvestment: 5000,
    returns1y: 15.2,
    returns3y: 17.5,
    riskLevel: "Moderate"
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const calculateReturns = () => {
    const amt = parseFloat(amount) || 0;
    const units = amt / fund.nav;
    const expectedReturn = fund.returns1y / 100;
    const futureNav = fund.nav * (1 + expectedReturn);
    const futureValue = units * futureNav;
    return {
      units: units.toFixed(3),
      currentValue: amt,
      expectedValue: futureValue,
      returns: futureValue - amt
    };
  };

  const projections = calculateReturns();

  const handleBuy = () => {
    navigate(`/mutual-fund/congrats?id=${fundId}&amount=${amount}`);
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
            <h1 className="text-xl font-bold">Buy Mutual Fund</h1>
            <p className="text-sm text-white/60">Complete your investment</p>
          </div>
        </div>
      </div>

      <div className="pt-24 p-4 space-y-6">
        {/* Fund Summary Card */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-none bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{fund.name}</h3>
                <p className="text-sm text-white/70">{fund.fundHouse}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white/10 text-white border-0 text-xs font-light">
                    {fund.category}
                  </Badge>
                  <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                    NAV: ₹{fund.nav}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Type */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Investment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={investmentType} onValueChange={setInvestmentType}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="lumpsum" id="lumpsum" data-testid="radio-lumpsum" />
                <Label htmlFor="lumpsum" className="text-white cursor-pointer">One-time Investment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sip" id="sip" data-testid="radio-sip" />
                <Label htmlFor="sip" className="text-white cursor-pointer">SIP (Systematic Investment Plan)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Investment Amount */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-white" />
              Investment Amount
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
                placeholder={fund.minInvestment.toString()}
                data-testid="input-amount"
              />
              <p className="text-xs text-white/50 mt-1">Minimum: ₹{fund.minInvestment}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[5000, 10000, 25000, 50000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                  className={cn(
                    "text-xs",
                    amount === preset.toString()
                      ? "bg-white/20 text-white border-white/40"
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

        {/* Payment Method */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 text-white" />
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

        {/* Investment Summary */}
        <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 rounded-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-white" />
              Investment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Units Allocated</span>
              <span className="text-white font-semibold">{projections.units}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Current NAV</span>
              <span className="text-white font-semibold">₹{fund.nav}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Expected Value (1Y)</span>
              <span className="text-white font-semibold">₹{projections.expectedValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex justify-between">
              <span className="text-white/70">Estimated Returns</span>
              <span className="text-white font-light">+₹{projections.returns.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <p className="text-xs text-white/50 text-center mt-2">
              Based on {fund.returns1y}% annual returns. Actual returns may vary.
            </p>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Secure & Regulated</h4>
                <p className="text-sm text-white/70">Your investment is protected by SEBI regulations and industry-standard security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleBuy}
          className="w-full bg-white/10 hover:bg-white/20 text-white h-14 text-base font-light border border-white/20 rounded-none"
          data-testid="button-confirm-purchase"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm & Invest
        </Button>
      </div>
    </div>
  );
}
