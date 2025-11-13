import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Calculator, Zap, Target, TrendingUp } from "lucide-react";

export default function EligibilityCheck() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleQuickCheck = async () => {
    if (!monthlyIncome || !employmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const income = parseFloat(monthlyIncome);
      const eligible = income >= 25000;
      const maxAmount = eligible ? Math.min(income * 50, 1000000) : 0;
      
      setResult({
        eligible,
        maxAmount,
        interestRate: eligible ? "13.99" : null,
        processingTime: "2-3 hours",
        creditScore: creditScore || "750",
      });
      
      setIsLoading(false);
      
      if (eligible) {
        toast({
          title: "Great News! 🎉",
          description: `You're eligible for up to ₹${(maxAmount / 100000).toFixed(1)}L`,
        });
      }
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">ELIGIBILITY</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Target className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              LOAN ELIGIBILITY
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              Check in seconds • No impact on score
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 p-4 rounded-none text-center">
            <Zap className="h-5 w-5 bg-white/10 mx-auto mb-2" />
            <p className="text-xs text-white/60 mb-1">Instant</p>
            <p className="text-xs font-bold text-white">Results</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-none text-center">
            <CheckCircle className="h-5 w-5 bg-white/10 mx-auto mb-2" />
            <p className="text-xs text-white/60 mb-1">No Impact</p>
            <p className="text-xs font-bold text-white">On Score</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-none text-center">
            <TrendingUp className="h-5 w-5 bg-white/10 mx-auto mb-2" />
            <p className="text-xs text-white/60 mb-1">Up to</p>
            <p className="text-xs font-bold text-white">₹10L</p>
          </div>
        </div>

        {!result && (
          <Card className="bg-white/5 border border-white/10 rounded-none">
            <CardContent className="p-6 space-y-5">
              <div>
                <Label className="block text-white/80 text-sm font-medium mb-2 tracking-wider uppercase text-xs">
                  Monthly Income *
                </Label>
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="Enter your monthly income"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none h-12"
                  data-testid="input-monthly-income"
                />
              </div>

              <div>
                <Label className="block text-white/80 text-sm font-medium mb-2 tracking-wider uppercase text-xs">
                  Employment Type *
                </Label>
                <Select onValueChange={setEmploymentType}>
                  <SelectTrigger 
                    className="bg-white/5 border-white/10 text-white rounded-none h-12"
                    data-testid="select-employment"
                  >
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-white/80 text-sm font-medium mb-2 tracking-wider uppercase text-xs">
                  Credit Score (Optional)
                </Label>
                <Input
                  type="number"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  placeholder="Enter if known"
                  max="900"
                  min="300"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none h-12"
                  data-testid="input-credit-score"
                />
                <p className="text-white/40 text-xs mt-2">
                  Don't worry if you don't know - we'll check for you
                </p>
              </div>

              <Button
                onClick={handleQuickCheck}
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none font-semibold tracking-wider"
                data-testid="button-check-eligibility"
              >
                {isLoading ? "Checking Eligibility..." : "Check Eligibility"}
              </Button>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-4">
            {result.eligible ? (
              <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-none">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 border-2 bg-white/10 rounded-none flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 bg-white/10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wider">
                        Congratulations! You're Eligible
                      </h3>
                      <p className="text-white/60 mb-4 text-sm">
                        You can get a loan up to
                      </p>
                      <p className="text-4xl font-bold bg-white/10 mb-2" data-testid="max-loan-amount">
                        {formatCurrency(result.maxAmount)}
                      </p>
                      <Badge className="bg-white/10 bg-white/10 bg-white/10 border">
                        Starting from {result.interestRate}% p.a.
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Processing Time</p>
                      <p className="font-semibold text-white">{result.processingTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Credit Score</p>
                      <p className="font-semibold text-white">{result.creditScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-none">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 border-2 bg-white/10 rounded-none flex items-center justify-center mx-auto">
                      <span className="bg-white/10 text-2xl">😔</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wider">
                        Not Eligible Right Now
                      </h3>
                      <p className="text-white/60 mb-4 text-sm">
                        Based on your current income, you're not eligible for a loan at this time.
                      </p>
                      <Badge className="bg-white/10 bg-white/10 bg-white/10 border">
                        Minimum requirement: ₹25,000/month
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-3">
              {result.eligible && (
                <Button
                  onClick={() => navigate("/loan-application")}
                  className="bg-white text-black hover:bg-white/90 h-12 rounded-none font-semibold tracking-wider"
                  data-testid="button-apply-now"
                >
                  Apply Now
                </Button>
              )}
              
              <Button
                onClick={() => navigate("/emi-calculator")}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white h-12 rounded-none font-semibold tracking-wider"
                data-testid="button-calculate-emi"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate EMI
              </Button>
              
              <Button
                onClick={() => setResult(null)}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5 h-12 rounded-none"
                data-testid="button-check-again"
              >
                Check Again
              </Button>
            </div>
          </div>
        )}

        {/* Why Choose Us */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider">Why Choose Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 bg-white/10 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Instant Approval</p>
                  <p className="text-white/60 text-sm">Get approved in minutes with minimal documentation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 bg-white/10 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Best Interest Rates</p>
                  <p className="text-white/60 text-sm">Starting from 11.99% p.a. with flexible tenure</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 bg-white/10 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">No Hidden Charges</p>
                  <p className="text-white/60 text-sm">Transparent pricing with zero surprises</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
