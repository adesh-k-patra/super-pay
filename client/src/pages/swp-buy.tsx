import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Calendar, TrendingDown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSWPPlan } from "@/data/swp-plans";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

export default function SWPBuy() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const swp = getSWPPlan(params.id || "");
  const [withdrawalAmount, setWithdrawalAmount] = useState("5000");
  const [frequency, setFrequency] = useState(swp?.frequency[0] || "Monthly");

  if (!swp) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4 font-light">SWP Plan not found</p>
          <Button onClick={() => navigate("/investment/swp")} className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleBuy = () => {
    const queryParams = new URLSearchParams({
      transactionType: 'swp',
      amount: withdrawalAmount,
      frequency: frequency,
      planId: params.id || '',
      returnUrl: '/investment/swp'
    });
    navigate(`/upi-payment?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SETUP SWP</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Configure Plan</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8">
        {/* Withdrawal Amount */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 border border-white/20 rounded-none p-2">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Withdrawal Amount</Label>
          </div>
          <div>
            <Input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-14 text-lg font-light rounded-none focus:border-white/40"
              placeholder="Enter amount"
              data-testid="input-amount"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 25000].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setWithdrawalAmount(preset.toString())}
                className={cn(
                  "text-xs rounded-none font-light",
                  withdrawalAmount === preset.toString()
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                )}
                data-testid={`button-preset-${preset}`}
              >
                ₹{preset/1000}K
              </Button>
            ))}
          </div>
        </div>

        {/* Withdrawal Frequency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 border border-white/20 rounded-none p-2">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Withdrawal Frequency</Label>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-none p-5 backdrop-blur-sm">
            <RadioGroup value={frequency} onValueChange={setFrequency}>
              {swp.frequency.map((freq, idx) => (
                <div key={freq} className={cn("flex items-center space-x-2", idx < swp.frequency.length - 1 && "mb-3")}>
                  <RadioGroupItem value={freq} id={freq.toLowerCase()} data-testid={`radio-${freq.toLowerCase()}`} />
                  <Label htmlFor={freq.toLowerCase()} className="text-white cursor-pointer font-light">{freq}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleBuy}
          className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-light tracking-wider rounded-none"
          data-testid="button-confirm-purchase"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm & Start SWP
        </Button>
      </div>
    </div>
  );
}
