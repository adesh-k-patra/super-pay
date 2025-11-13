import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Brain, 
  Target, 
  TrendingUp, 
  Clock,
  Sparkles,
  Wallet,
  PieChart,
  Coins,
  Building2,
  Star,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  Edit,
  Shield
} from "lucide-react";

const InvestmentPredictions = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [riskLevel, setRiskLevel] = useState<number>(50);
  const [returnExpectation, setReturnExpectation] = useState<number>(12);
  const [duration, setDuration] = useState<number>(12);
  
  const [showResults, setShowResults] = useState(false);
  const [aiAllocation, setAiAllocation] = useState<any>(null);

  const calculateAIAllocation = () => {
    const getRiskBasedAllocation = (risk: number) => {
      let stocksPercent = 0;
      let goldPercent = 0;
      let bondsPercent = 0;
      let mutualFundsPercent = 0;
      let silverPercent = 0;

      if (risk <= 33) {
        bondsPercent = 50;
        goldPercent = 25;
        mutualFundsPercent = 15;
        stocksPercent = 7;
        silverPercent = 3;
      } else if (risk <= 66) {
        mutualFundsPercent = 35;
        stocksPercent = 25;
        bondsPercent = 20;
        goldPercent = 15;
        silverPercent = 5;
      } else {
        stocksPercent = 50;
        mutualFundsPercent = 25;
        goldPercent = 15;
        bondsPercent = 7;
        silverPercent = 3;
      }

      return {
        stocks: Math.round((stocksPercent * investmentAmount) / 100),
        stocksPercent,
        mutualFunds: Math.round((mutualFundsPercent * investmentAmount) / 100),
        mutualFundsPercent,
        gold: Math.round((goldPercent * investmentAmount) / 100),
        goldPercent,
        bonds: Math.round((bondsPercent * investmentAmount) / 100),
        bondsPercent,
        silver: Math.round((silverPercent * investmentAmount) / 100),
        silverPercent,
      };
    };

    const allocation = getRiskBasedAllocation(riskLevel);
    const expectedReturn = ((returnExpectation * investmentAmount) / 100);
    const totalValueAfterDuration = investmentAmount + (expectedReturn * (duration / 12));
    
    setAiAllocation({
      ...allocation,
      totalAmount: investmentAmount,
      riskLevel: riskLevel <= 33 ? "Conservative" : riskLevel <= 66 ? "Moderate" : "Aggressive",
      expectedReturn,
      totalValueAfterDuration,
      duration,
      returnPercent: returnExpectation,
    });
    
    setShowResults(true);
  };

  const investMutation = useMutation({
    mutationFn: async (allocationData: any) => {
      return apiRequest("POST", "/api/ai-investment", allocationData);
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful",
        description: "Your AI-powered portfolio has been created",
      });
      navigate("/investment");
    },
  });

  const handleConfirmInvestment = () => {
    investMutation.mutate(aiAllocation);
  };

  const handleEdit = () => {
    setShowResults(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAllocationItems = () => {
    if (!aiAllocation) return [];
    
    return [
      { name: "Stocks", amount: aiAllocation.stocks, percent: aiAllocation.stocksPercent, icon: TrendingUp, borderColor: "border-white/20" },
      { name: "Mutual Funds", amount: aiAllocation.mutualFunds, percent: aiAllocation.mutualFundsPercent, icon: Shield, borderColor: "border-white/20/20" },
      { name: "Gold", amount: aiAllocation.gold, percent: aiAllocation.goldPercent, icon: Coins, borderColor: "border-yellow-500/20" },
      { name: "Bonds", amount: aiAllocation.bonds, percent: aiAllocation.bondsPercent, icon: Building2, borderColor: "border-white/20" },
      { name: "Silver", amount: aiAllocation.silver, percent: aiAllocation.silverPercent, icon: Star, borderColor: "border-gray-400/20" },
    ].filter(item => item.amount > 0);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">AI INVESTMENT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Powered by AI</p>
          </div>
          {showResults ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-edit"
            >
              <Edit className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-10"></div>
          )}
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {!showResults ? (
          <>
            {/* AI Header Card */}
            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/10 border border-white/20 rounded-none p-4">
                  <Brain className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-light text-white mb-1 tracking-wider">AI-Powered Investment</h2>
                  <p className="text-white/60 text-sm font-light">Let our AI create a personalized portfolio based on your preferences and goals</p>
                </div>
              </div>
              <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Engine Active
              </Badge>
            </div>

            {/* Investment Form */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Investment Details</h2>
              
              {/* Investment Amount */}
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-white/60 flex items-center gap-2 text-xs uppercase tracking-widest font-light">
                  <Wallet className="h-3 w-3" />
                  Investment Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-light text-lg">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
                    className="pl-10 bg-white/5 border-white/10 text-white text-lg h-14 font-light rounded-none focus:border-white/40"
                    placeholder="Enter amount"
                    data-testid="input-investment-amount"
                  />
                </div>
                <p className="text-xs text-white/40 font-light">Minimum: ₹5,000 • Recommended: ₹10,000+</p>
              </div>

              {/* Risk Level */}
              <div className="space-y-3">
                <Label className="text-white/60 flex items-center justify-between text-xs uppercase tracking-widest font-light">
                  <span className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    Risk Tolerance
                  </span>
                  <Badge className={cn(
                    "text-xs font-light rounded-none",
                    riskLevel <= 33 ? "bg-white/10 text-white/80 border-white/20" :
                    riskLevel <= 66 ? "bg-white/10 text-white/80 border-white/20" :
                    "bg-white/10 text-white/80 border-white/20"
                  )}>
                    {riskLevel <= 33 ? "Low Risk" : riskLevel <= 66 ? "Medium Risk" : "High Risk"}
                  </Badge>
                </Label>
                <Slider
                  value={[riskLevel]}
                  onValueChange={([value]) => setRiskLevel(value)}
                  max={100}
                  step={1}
                  className="w-full"
                  data-testid="slider-risk"
                />
                <div className="flex justify-between text-xs text-white/40 font-light">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              {/* Return Expectation */}
              <div className="space-y-3">
                <Label className="text-white/60 flex items-center justify-between text-xs uppercase tracking-widest font-light">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Expected Annual Return
                  </span>
                  <span className="text-white font-light text-lg">{returnExpectation}%</span>
                </Label>
                <Slider
                  value={[returnExpectation]}
                  onValueChange={([value]) => setReturnExpectation(value)}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                  data-testid="slider-return"
                />
                <div className="flex justify-between text-xs text-white/40 font-light">
                  <span>5% (Conservative)</span>
                  <span>15% (Balanced)</span>
                  <span>30% (Aggressive)</span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label className="text-white/60 flex items-center justify-between text-xs uppercase tracking-widest font-light">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Investment Duration
                  </span>
                  <span className="text-white font-light text-lg">{duration} months</span>
                </Label>
                <Slider
                  value={[duration]}
                  onValueChange={([value]) => setDuration(value)}
                  max={120}
                  min={6}
                  step={6}
                  className="w-full"
                  data-testid="slider-duration"
                />
                <div className="flex justify-between text-xs text-white/40 font-light">
                  <span>6 months</span>
                  <span>3 years</span>
                  <span>10 years</span>
                </div>
              </div>
            </div>

          </>
        ) : (
          <>
            {/* Results Header */}
            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/10 border border-white/20 rounded-none p-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-light text-white mb-1 tracking-wider">Portfolio Generated!</h2>
                  <p className="text-white/60 text-sm font-light">AI has created a personalized portfolio based on your preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                  {aiAllocation?.riskLevel} Risk
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                  {aiAllocation?.duration} months
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                  {aiAllocation?.returnPercent}% target return
                </Badge>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Initial Investment</p>
                <p className="text-3xl font-light text-white" data-testid="text-initial-amount">{formatCurrency(aiAllocation?.totalAmount)}</p>
              </div>
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Projected Value</p>
                <p className="text-3xl font-light text-white" data-testid="text-projected-value">{formatCurrency(aiAllocation?.totalValueAfterDuration)}</p>
                <p className="text-sm text-white/60 mt-1 font-light">
                  +{formatCurrency(aiAllocation?.totalValueAfterDuration - aiAllocation?.totalAmount)}
                </p>
              </div>
            </div>

            {/* Portfolio Allocation */}
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <PieChart className="h-3 w-3" />
                Portfolio Allocation
              </h2>
              {getAllocationItems().map((item) => (
                <div
                  key={item.name}
                  className={cn("p-4 border bg-white/5 backdrop-blur-sm rounded-none", item.borderColor)}
                  data-testid={`allocation-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 border border-white/20 rounded-none p-2">
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-light text-white tracking-wider">{item.name}</p>
                        <p className="text-sm text-white/60 font-light">{item.percent}% allocation</p>
                      </div>
                    </div>
                    <p className="text-xl font-light text-white">{formatCurrency(item.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fixed Generate Button (shown when not in results state) */}
      {!showResults && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-screen-lg mx-auto">
            <Button
              onClick={calculateAIAllocation}
              className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-light tracking-wider rounded-none"
              disabled={investmentAmount < 5000}
              data-testid="button-generate-portfolio"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate AI Portfolio
            </Button>
          </div>
        </div>
      )}

      {/* Fixed Invest Now Button (only shown in results state) */}
      {showResults && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-screen-lg mx-auto">
            <Button
              onClick={handleConfirmInvestment}
              className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-light tracking-wider rounded-none"
              disabled={investMutation.isPending}
              data-testid="button-invest-now"
            >
              {investMutation.isPending ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Invest Now - {formatCurrency(aiAllocation?.totalAmount)}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPredictions;
