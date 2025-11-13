import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Target, 
  Calculator,
  Shield,
  DollarSign,
  Clock,
  PieChart,
  AlertCircle,
  CheckCircle,
  Star,
  Info,
  Zap
} from "lucide-react";

interface MutualFund {
  id: string;
  productName: string;
  fundHouse: string;
  fundLogo: string;
  category: string;
  subcategory: string;
  nav: number;
  returns1y: number;
  returns3y: number;
  returns5y: number;
  expenseRatio: number;
  minInvestment: number;
  minSIP: number;
  aum: number;
  riskLevel: "low" | "medium" | "high";
  rating: number;
  benchmarkIndex: string;
  fundManager: string;
  exitLoad: string;
  lockInPeriod: string;
}

// Mock data - would normally come from props or API
const mockFund: MutualFund = {
  id: "mf-1",
  productName: "Axis Bluechip Fund",
  fundHouse: "Axis Mutual Fund",
  fundLogo: "🏛️",
  category: "equity",
  subcategory: "Large Cap",
  nav: 52.35,
  returns1y: 12.5,
  returns3y: 14.2,
  returns5y: 16.8,
  expenseRatio: 1.05,
  minInvestment: 5000,
  minSIP: 500,
  aum: 45000,
  riskLevel: "medium",
  rating: 4.5,
  benchmarkIndex: "NIFTY 100",
  fundManager: "Shreyash Devalkar",
  exitLoad: "1% if redeemed before 1 year",
  lockInPeriod: "Nil"
};

export default function MutualFundBuy() {
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const { toast } = useToast();
  
  const [investmentType, setInvestmentType] = useState("sip");
  const [amount, setAmount] = useState("5000");
  const [sipFrequency, setSipFrequency] = useState("monthly");
  const [sipDuration, setSipDuration] = useState("5");
  const [goalBased, setGoalBased] = useState(false);
  const [investmentGoal, setInvestmentGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [folio, setFolio] = useState("new");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get fund ID from route parameters, default to a real backend symbol
  const fundId = params.id || 'mf-1';

  // Fetch real fund data from API
  const { data: fundData, isLoading, error } = useQuery({
    queryKey: ['/api/investments/details', fundId],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/investments/details/${fundId}`);
        const data = await response.json();
        return data;
      } catch (error) {
        // Failed to fetch fund data - will use fallback
        throw error;
      }
    },
    staleTime: 60000, // Cache for 1 minute
    retry: 1,
  });

  // Transform API data to match MutualFund interface, fallback to mock data
  const fund: MutualFund = fundData ? {
    id: fundData.symbol || fundId,
    productName: fundData.name || 'Unknown Fund',
    fundHouse: fundData.fundHouse || 'Fund House',
    fundLogo: '🏛️',
    category: 'equity',
    subcategory: fundData.category || 'Large Cap',
    nav: fundData.nav || fundData.currentPrice || 52.35,
    returns1y: fundData.returns1y || 12.5,
    returns3y: fundData.returns3y || 14.2,
    returns5y: fundData.returns5y || 16.8,
    expenseRatio: fundData.expenseRatio || 1.05,
    minInvestment: fundData.minInvestment || 5000,
    minSIP: 500,
    aum: fundData.aum ? parseFloat(fundData.aum) : 45000,
    riskLevel: fundData.riskLevel || 'medium',
    rating: 4.5,
    benchmarkIndex: 'NIFTY 100',
    fundManager: 'Fund Manager',
    exitLoad: '1% if redeemed before 1 year',
    lockInPeriod: 'Nil'
  } : mockFund;

  // Investment purchase mutation
  const investmentMutation = useMutation({
    mutationFn: async (investmentData: any) => {
      const response = await apiRequest('POST', '/api/investments/buy', investmentData);
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Investment Successful!",
        description: `Successfully invested in ${fund.productName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/investments/portfolio'] });
      navigate('/investment-tracking');
    },
    onError: (error) => {
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Calculate projections
  const monthlyAmount = investmentType === "sip" ? parseFloat(amount) || 0 : 0;
  const lumpSumAmount = investmentType === "lump-sum" ? parseFloat(amount) || 0 : 0;
  const duration = parseInt(sipDuration) || 1;
  const expectedReturn = fund.returns3y / 100;

  const calculateSIPProjections = () => {
    if (investmentType === "sip" && monthlyAmount > 0) {
      const months = duration * 12;
      const monthlyRate = expectedReturn / 12;
      const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const totalInvestment = monthlyAmount * months;
      const totalGains = futureValue - totalInvestment;
      
      return {
        totalInvestment,
        futureValue,
        totalGains,
        gainPercentage: (totalGains / totalInvestment) * 100
      };
    } else if (investmentType === "lump-sum" && lumpSumAmount > 0) {
      const futureValue = lumpSumAmount * Math.pow(1 + expectedReturn, duration);
      const totalGains = futureValue - lumpSumAmount;
      
      return {
        totalInvestment: lumpSumAmount,
        futureValue,
        totalGains,
        gainPercentage: (totalGains / lumpSumAmount) * 100
      };
    }
    
    return {
      totalInvestment: 0,
      futureValue: 0,
      totalGains: 0,
      gainPercentage: 0
    };
  };

  const projections = calculateSIPProjections();

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "text-white bg-white/10 border-white/20";
      case "high": return "text-white bg-white/10 border-white/20";
      default: return "text-white bg-white/10 border-white/20";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const handleInvest = () => {
    if (!isValidAmount()) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment amount is ₹${investmentType === "sip" ? fund.minSIP : fund.minInvestment}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    const investmentData = {
      symbol: fund.id,
      investmentType: 'mutual_funds',
      investmentAmount: parseFloat(amount),
      price: fund.nav,
      category: fund.subcategory,
      riskLevel: fund.riskLevel
    };

    investmentMutation.mutate(investmentData, {
      onSettled: () => {
        setIsProcessing(false);
      }
    });
  };

  const isValidAmount = () => {
    const minAmount = investmentType === "sip" ? fund.minSIP : fund.minInvestment;
    return parseFloat(amount) >= minAmount;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading fund details...</p>
        </div>
      </div>
    );
  }

  // Error state with fallback to mock data
  // Silently use fallback data if API fails

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/investment")}
            className="border-white/20 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-wider" data-testid="page-title">
              INVEST NOW
            </h1>
            <p className="text-white/60">Complete your mutual fund investment</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Investment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fund Details Card */}
            <Card className="bg-black border-white/20 rounded-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/10 rounded-none flex items-center justify-center text-white text-2xl border border-white/20">
                    {fund.fundLogo}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{fund.productName}</h2>
                    <p className="text-white/80">{fund.fundHouse}</p>
                    <p className="text-white/60 text-sm">{fund.subcategory} • {fund.benchmarkIndex}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={`${getRiskColor(fund.riskLevel)} rounded-none border`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {fund.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-white fill-current" />
                        <span className="text-white font-medium">{fund.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">₹{fund.nav}</p>
                    <p className="text-sm text-white/60">NAV</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-none">
                    <p className="text-white font-light">{fund.returns1y}%</p>
                    <p className="text-xs text-white/60">1Y Returns</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-none">
                    <p className="text-white font-light">{fund.returns3y}%</p>
                    <p className="text-xs text-white/60">3Y Returns</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-none">
                    <p className="text-white font-light">{fund.expenseRatio}%</p>
                    <p className="text-xs text-white/60">Expense Ratio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Type Selection */}
            <Card className="bg-black border-white/20 rounded-none">
              <CardHeader>
                <CardTitle className="text-white">Investment Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={investmentType} onValueChange={setInvestmentType} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border border-white/20 rounded-none">
                    <RadioGroupItem value="sip" id="sip" />
                    <div className="flex-1">
                      <Label htmlFor="sip" className="text-white font-medium cursor-pointer flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Systematic Investment Plan (SIP)
                      </Label>
                      <p className="text-sm text-white/60 mt-1">
                        Invest regularly to benefit from rupee cost averaging
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Minimum: ₹{fund.minSIP}/month
                      </p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 font-light rounded-none">Recommended</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-white/20 rounded-none">
                    <RadioGroupItem value="lump-sum" id="lump-sum" />
                    <div className="flex-1">
                      <Label htmlFor="lump-sum" className="text-white font-medium cursor-pointer flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Lump Sum Investment
                      </Label>
                      <p className="text-sm text-white/60 mt-1">
                        Invest a one-time amount immediately
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Minimum: ₹{fund.minInvestment}
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Investment Amount */}
            <Card className="bg-black border-white/20 rounded-none">
              <CardHeader>
                <CardTitle className="text-white">Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white/80">
                    {investmentType === "sip" ? "Monthly SIP Amount" : "Investment Amount"}
                  </Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={investmentType === "sip" ? `Min ₹${fund.minSIP}` : `Min ₹${fund.minInvestment}`}
                    className="bg-black border-white/20 text-white rounded-none mt-2"
                    data-testid="input-investment-amount"
                  />
                  {!isValidAmount() && amount && (
                    <p className="text-white/80 text-sm mt-1">
                      Minimum amount is ₹{investmentType === "sip" ? fund.minSIP : fund.minInvestment}
                    </p>
                  )}
                </div>

                {investmentType === "sip" && (
                  <>
                    <div>
                      <Label className="text-white/80">SIP Frequency</Label>
                      <Select value={sipFrequency} onValueChange={setSipFrequency}>
                        <SelectTrigger className="bg-black border-white/20 text-white rounded-none mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white/80">Investment Duration</Label>
                      <Select value={sipDuration} onValueChange={setSipDuration}>
                        <SelectTrigger className="bg-black border-white/20 text-white rounded-none mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Year</SelectItem>
                          <SelectItem value="2">2 Years</SelectItem>
                          <SelectItem value="3">3 Years</SelectItem>
                          <SelectItem value="5">5 Years</SelectItem>
                          <SelectItem value="10">10 Years</SelectItem>
                          <SelectItem value="15">15 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {investmentType === "lump-sum" && (
                  <div>
                    <Label className="text-white/80">Investment Duration (for projection)</Label>
                    <Select value={sipDuration} onValueChange={setSipDuration}>
                      <SelectTrigger className="bg-black border-white/20 text-white rounded-none mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                        <SelectItem value="15">15 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Goal-Based Investment */}
            <Card className="bg-black border-white/20 rounded-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal-Based Investment
                  <Badge className="bg-white/10 text-white border-white/20 ml-2 font-light rounded-none">Optional</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={goalBased}
                    onChange={(e) => setGoalBased(e.target.checked)}
                    className="rounded-none border-white/20 bg-white/5 text-white"
                    data-testid="checkbox-goal-based"
                  />
                  <Label className="text-white/80">Set investment goal for better planning</Label>
                </div>

                {goalBased && (
                  <>
                    <div>
                      <Label className="text-white/80">Investment Goal</Label>
                      <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
                        <SelectTrigger className="bg-black border-white/20 text-white rounded-none mt-2">
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retirement">Retirement Planning</SelectItem>
                          <SelectItem value="child-education">Child's Education</SelectItem>
                          <SelectItem value="home-purchase">Home Purchase</SelectItem>
                          <SelectItem value="vacation">Dream Vacation</SelectItem>
                          <SelectItem value="emergency">Emergency Fund</SelectItem>
                          <SelectItem value="wealth-creation">Wealth Creation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white/80">Target Amount</Label>
                      <Input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="Enter target amount"
                        className="bg-black border-white/20 text-white rounded-none mt-2"
                        data-testid="input-target-amount"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Folio Selection */}
            <Card className="bg-black border-white/20 rounded-none">
              <CardHeader>
                <CardTitle className="text-white">Folio Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={folio} onValueChange={setFolio} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new-folio" />
                    <Label htmlFor="new-folio" className="text-white/80">Create new folio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing-folio" />
                    <Label htmlFor="existing-folio" className="text-white/80">Use existing folio</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Investment Summary Sidebar */}
          <div className="space-y-6">
            {/* Investment Projection */}
            <Card className="bg-black border-white/20 rounded-none sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Investment Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">
                      {investmentType === "sip" ? "Monthly Investment" : "One-time Investment"}
                    </span>
                    <span className="text-white font-medium">₹{parseFloat(amount || "0").toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Duration</span>
                    <span className="text-white font-medium">{duration} years</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Expected Returns</span>
                    <span className="text-white font-medium">{fund.returns3y}% p.a.</span>
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Total Investment</span>
                    <span className="text-white font-medium">{formatCurrency(projections.totalInvestment)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Expected Value</span>
                    <span className="text-white/80 font-bold text-lg">{formatCurrency(projections.futureValue)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Total Gains</span>
                    <span className="text-white font-light">{formatCurrency(projections.totalGains)}</span>
                  </div>

                  <div className="p-3 bg-white/10 border border-white/20 rounded-none">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-white" />
                      <span className="text-white font-light text-sm">Wealth Growth</span>
                    </div>
                    <p className="text-white font-light text-xl">+{projections.gainPercentage.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Projections are indicative</span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Info className="h-4 w-4" />
                    <span>Subject to market risks</span>
                  </div>
                </div>

                <Button
                  onClick={handleInvest}
                  disabled={!isValidAmount() || isProcessing}
                  className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none h-12 text-lg mt-6 border border-white/20 font-light"
                  data-testid="button-invest-now"
                >
                  {isProcessing ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Invest Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-white/60 text-center">
                  By investing, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}