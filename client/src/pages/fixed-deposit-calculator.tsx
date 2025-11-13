import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp, BadgeIndianRupee, Calendar, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPOUNDING_FREQUENCIES = [
  { value: "monthly", label: "Monthly", times: 12 },
  { value: "quarterly", label: "Quarterly", times: 4 },
  { value: "half-yearly", label: "Half Yearly", times: 2 },
  { value: "annually", label: "Annually", times: 1 }
];

export default function FixedDepositCalculator() {
  const [, navigate] = useLocation();
  const [principal, setPrincipal] = useState("100000");
  const [interestRate, setInterestRate] = useState("7.5");
  const [tenure, setTenure] = useState("12");
  const [compoundingFrequency, setCompoundingFrequency] = useState("quarterly");
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);

  const calculateMaturityAmount = () => {
    const P = parseFloat(principal) || 0;
    const r = parseFloat(interestRate) || 0;
    const adjustedRate = isSeniorCitizen ? r + 0.5 : r;
    const t = parseFloat(tenure) || 0;
    
    const freq = COMPOUNDING_FREQUENCIES.find(f => f.value === compoundingFrequency);
    const n = freq?.times || 4;
    
    // Compound Interest Formula: A = P(1 + r/n)^(n*t)
    const amount = P * Math.pow((1 + (adjustedRate / 100) / n), (n * t / 12));
    const interest = amount - P;
    
    return {
      maturityAmount: amount,
      totalInterest: interest,
      principalAmount: P,
      effectiveRate: adjustedRate
    };
  };

  const result = calculateMaturityAmount();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fixed-deposits")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FD CALCULATOR</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Calculate Returns</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Calculator Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-white/10 border border-white/20">
            <Calculator className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Principal Amount */}
        <div className="space-y-2">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
            <BadgeIndianRupee className="h-3 w-3" />
            Principal Amount
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-light text-white/60">₹</span>
            <Input
              type="text"
              inputMode="numeric"
              value={principal}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setPrincipal(value);
              }}
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 pl-10 text-xl font-light focus:border-white"
              data-testid="input-principal"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
            <Percent className="h-3 w-3" />
            Annual Interest Rate
          </Label>
          <div className="relative">
            <Input
              type="text"
              inputMode="decimal"
              value={interestRate}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                const parts = value.split('.');
                if (parts.length <= 2 && (!parts[1] || parts[1].length <= 2)) {
                  setInterestRate(value);
                }
              }}
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 pr-10 text-xl font-light focus:border-white"
              data-testid="input-rate"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-light text-white/60">%</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="space-y-2">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Tenure (Months)
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            value={tenure}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setTenure(value);
            }}
            className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 text-xl font-light focus:border-white"
            data-testid="input-tenure"
          />
        </div>

        {/* Compounding Frequency */}
        <div className="space-y-2">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
            <TrendingUp className="h-3 w-3" />
            Compounding Frequency
          </Label>
          <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
            <SelectTrigger
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 font-light focus:border-white"
              data-testid="select-frequency"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              {COMPOUNDING_FREQUENCIES.map((freq) => (
                <SelectItem 
                  key={freq.value} 
                  value={freq.value}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {freq.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Senior Citizen Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <div>
            <Label className="text-sm text-white font-light">Senior Citizen</Label>
            <p className="text-xs text-white/50 mt-1">Additional 0.5% interest</p>
          </div>
          <button
            onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
            className={cn(
              "h-6 w-11 rounded-none border-2 transition-colors relative",
              isSeniorCitizen ? "bg-white border-white" : "border-white/40"
            )}
            data-testid="toggle-senior-citizen"
          >
            <div
              className={cn(
                "h-4 w-4 bg-black transition-transform absolute top-0.5",
                isSeniorCitizen ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Results Section */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-6">
          <h2 className="text-lg font-light tracking-wider text-center uppercase text-white/80">
            Maturity Details
          </h2>

          <div className="text-center py-4 border-b border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-widest font-light mb-2">Maturity Amount</p>
            <p className="text-4xl font-light text-white tracking-tight" data-testid="text-maturity-amount">
              {formatCurrency(result.maturityAmount)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-light mb-2">Invested Amount</p>
              <p className="text-2xl font-light text-white" data-testid="text-principal">
                {formatCurrency(result.principalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-light mb-2">Total Interest</p>
              <p className="text-2xl font-light text-white" data-testid="text-interest">
                {formatCurrency(result.totalInterest)}
              </p>
            </div>
          </div>

          {isSeniorCitizen && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 font-light">Effective Rate (Senior Citizen)</span>
                <span className="text-white font-light">{result.effectiveRate}% p.a.</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tenure Options */}
        <div className="space-y-3">
          <Label className="text-xs text-white/60 uppercase tracking-widest font-light block">
            Quick Select Tenure
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {[12, 24, 36, 60].map((months) => (
              <button
                key={months}
                onClick={() => setTenure(months.toString())}
                className={cn(
                  "py-3 border transition-all text-xs tracking-wider font-light rounded-none",
                  tenure === months.toString()
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid={`button-tenure-${months}`}
              >
                {months}M
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setPrincipal("100000");
              setInterestRate("7.5");
              setTenure("12");
              setCompoundingFrequency("quarterly");
              setIsSeniorCitizen(false);
            }}
            className="border-white/20 text-white hover:bg-white/10 rounded-none h-14 font-light tracking-wider"
            data-testid="button-reset"
          >
            RESET
          </Button>
          <Button
            onClick={() => navigate("/fixed-deposits")}
            className="bg-white text-black hover:bg-white/90 rounded-none h-14 font-light tracking-wider"
            data-testid="button-view-schemes"
          >
            VIEW FD SCHEMES
          </Button>
        </div>
      </div>
    </div>
  );
}
