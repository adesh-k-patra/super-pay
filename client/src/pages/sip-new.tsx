import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock,
  DollarSign,
  Zap,
  Shield,
  Info,
  CheckCircle2
} from "lucide-react";

export default function SipNew() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  
  const [selectedFund, setSelectedFund] = useState<string>("");
  const [sipAmount, setSipAmount] = useState("500");
  const [frequency, setFrequency] = useState("monthly");
  const [sipDay, setSipDay] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endCondition, setEndCondition] = useState("until_cancelled");
  const [totalInstallments, setTotalInstallments] = useState("12");
  const [targetAmount, setTargetAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("auto_debit");
  const [autoEscalation, setAutoEscalation] = useState(false);
  const [escalationPercent, setEscalationPercent] = useState("10");

  // Fetch mutual funds
  const { data: fundsData, isLoading: fundsLoading } = useQuery({
    queryKey: ["/api/mutual-funds"],
    enabled: isAuthenticated,
  });

  // Create SIP mutation
  const createSipMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/sip/create", data);
    },
    onSuccess: () => {
      toast({
        title: "SIP Created Successfully",
        description: "Your systematic investment plan has been set up",
      });
      navigate("/investment");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create SIP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Set default start date to next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    setStartDate(nextMonth.toISOString().split('T')[0]);
  }, []);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  const funds = fundsData?.funds || [];
  const selectedFundData = funds.find((f: any) => f.id === selectedFund);

  const calculateProjectedValue = () => {
    if (!sipAmount || !totalInstallments) return 0;
    const amount = parseFloat(sipAmount);
    const months = endCondition === "fixed_installments" ? parseInt(totalInstallments) : 60;
    const expectedReturn = selectedFundData?.returns1Year || 12;
    const monthlyReturn = expectedReturn / 100 / 12;
    
    let futureValue = 0;
    for (let i = 0; i < months; i++) {
      futureValue = (futureValue + amount) * (1 + monthlyReturn);
    }
    return futureValue;
  };

  const handleSubmit = () => {
    if (!selectedFund) {
      toast({
        title: "Select a Fund",
        description: "Please select a mutual fund for your SIP",
        variant: "destructive",
      });
      return;
    }

    if (!sipAmount || parseFloat(sipAmount) < 500) {
      toast({
        title: "Invalid Amount",
        description: "Minimum SIP amount is ₹500",
        variant: "destructive",
      });
      return;
    }

    const sipData = {
      userId: user?.id,
      fundId: selectedFund,
      sipAmount: parseFloat(sipAmount),
      frequency,
      sipDay: parseInt(sipDay),
      startDate: new Date(startDate),
      endCondition,
      totalInstallments: endCondition === "fixed_installments" ? parseInt(totalInstallments) : null,
      targetAmount: endCondition === "target_amount" ? parseFloat(targetAmount) : null,
      paymentMethod,
      autoEscalation: autoEscalation ? 1 : 0,
      escalationPercent: autoEscalation ? parseFloat(escalationPercent) : null,
      escalationFrequency: autoEscalation ? "yearly" : null,
    };

    createSipMutation.mutate(sipData);
  };

  const projectedValue = calculateProjectedValue();
  const totalInvestment = parseFloat(sipAmount) * (endCondition === "fixed_installments" ? parseInt(totalInstallments) : 60);
  const expectedReturns = projectedValue - totalInvestment;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4 p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/investment")}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Start New SIP</h1>
            <p className="text-sm text-white/60">Systematic Investment Plan</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pt-20">
        {/* Select Fund */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-white/80" />
              Select Mutual Fund
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Choose Fund</Label>
              <Select value={selectedFund} onValueChange={setSelectedFund}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-fund">
                  <SelectValue placeholder="Select a mutual fund" />
                </SelectTrigger>
                <SelectContent>
                  {fundsLoading ? (
                    <SelectItem value="loading">Loading funds...</SelectItem>
                  ) : funds.length > 0 ? (
                    funds.map((fund: any) => (
                      <SelectItem key={fund.id} value={fund.id}>
                        {fund.fundName} - {fund.fundHouse}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-funds">No funds available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedFundData && (
              <div className="p-3 rounded-lg bg-white/5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">NAV</span>
                  <span className="text-white font-semibold">₹{parseFloat(selectedFundData.nav).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">1Y Returns</span>
                  <span className="text-white/80 font-semibold">+{parseFloat(selectedFundData.returns1Year || 0).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Min SIP</span>
                  <span className="text-white font-semibold">₹{parseFloat(selectedFundData.minSipAmount || 500).toFixed(0)}</span>
                </div>
                <Badge className={`${
                  selectedFundData.riskLevel === 'low' ? 'bg-white/10 text-white/80' :
                  selectedFundData.riskLevel === 'medium' ? 'bg-white/10 text-white/80' :
                  'bg-white/10 text-white/80'
                } border-0`}>
                  {selectedFundData.riskLevel} Risk
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SIP Amount */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-white/80" />
              SIP Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Monthly Investment Amount</Label>
              <Input
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(e.target.value)}
                placeholder="500"
                className="bg-white/5 border-white/20 text-white"
                data-testid="input-sip-amount"
              />
              <p className="text-xs text-white/50 mt-1">Minimum: ₹500</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["500", "1000", "2500", "5000"].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setSipAmount(amount)}
                  className={`${
                    sipAmount === amount
                      ? "bg-white/10 text-white border-white/20"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  }`}
                  data-testid={`button-preset-${amount}`}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequency & Schedule */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-white/80" />
              Frequency & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">SIP Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="28"
                  value={sipDay}
                  onChange={(e) => setSipDay(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-sip-day"
                />
              </div>

              <div>
                <Label className="text-white/80">Start Date</Label>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Select start date"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-start-date"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duration */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-white/80" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={endCondition} onValueChange={setEndCondition}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="until_cancelled" id="until_cancelled" data-testid="radio-until-cancelled" />
                <Label htmlFor="until_cancelled" className="text-white cursor-pointer">Until I cancel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed_installments" id="fixed_installments" data-testid="radio-fixed-installments" />
                <Label htmlFor="fixed_installments" className="text-white cursor-pointer">Fixed number of installments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="target_amount" id="target_amount" data-testid="radio-target-amount" />
                <Label htmlFor="target_amount" className="text-white cursor-pointer">Target amount</Label>
              </div>
            </RadioGroup>

            {endCondition === "fixed_installments" && (
              <div>
                <Label className="text-white/80">Number of Installments</Label>
                <Input
                  type="number"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                  placeholder="12"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-installments"
                />
              </div>
            )}

            {endCondition === "target_amount" && (
              <div>
                <Label className="text-white/80">Target Amount (₹)</Label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="100000"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-target-amount"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto Escalation */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-white/80" />
              Auto Escalation (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white/80">Enable Auto Escalation</Label>
              <input
                type="checkbox"
                checked={autoEscalation}
                onChange={(e) => setAutoEscalation(e.target.checked)}
                className="w-4 h-4"
                data-testid="checkbox-auto-escalation"
              />
            </div>

            {autoEscalation && (
              <div>
                <Label className="text-white/80">Annual Increase (%)</Label>
                <Input
                  type="number"
                  value={escalationPercent}
                  onChange={(e) => setEscalationPercent(e.target.value)}
                  placeholder="10"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-escalation-percent"
                />
                <p className="text-xs text-white/50 mt-1">Your SIP amount will increase by this percentage every year</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projection */}
        {selectedFund && sipAmount && (
          <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-white/80" />
                Projected Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Total Investment</span>
                <span className="text-white font-semibold">₹{totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Expected Value</span>
                <span className="text-white font-semibold">₹{projectedValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
              <Separator className="bg-white/20" />
              <div className="flex justify-between">
                <span className="text-white/70">Estimated Returns</span>
                <span className="text-white/80 font-bold">+₹{expectedReturns.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
              <p className="text-xs text-white/50 text-center mt-2">
                Based on historical returns. Actual returns may vary.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-white/80" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto_debit" id="auto_debit" data-testid="radio-auto-debit" />
                <Label htmlFor="auto_debit" className="text-white cursor-pointer">Auto Debit (e-Mandate)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" data-testid="radio-manual" />
                <Label htmlFor="manual" className="text-white cursor-pointer">Manual Payment</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-sm border-t border-white/10">
          <Button
            onClick={handleSubmit}
            disabled={createSipMutation.isPending || !selectedFund}
            className="w-full bg-white/10 hover:bg-white/15 text-white h-12"
            data-testid="button-create-sip"
          >
            {createSipMutation.isPending ? (
              "Creating SIP..."
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Create SIP
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
