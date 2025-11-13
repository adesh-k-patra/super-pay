import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  TrendingUp,
  Download, 
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
  Crown,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Lightbulb,
  Star,
  Plus,
  Minus,
  Brain,
  Sparkles,
  X,
  Clock,
  DollarSign as DollarSignIcon
} from "lucide-react";

interface LoanData {
  id: string;
  lenderName: string;
  loanType: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  currentEMI: number;
  remainingTenure: number;
  nextEMIDate: string;
}

interface CalculationResult {
  monthsToRepay: number;
  totalInstallments: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  amortizationSchedule: Array<{
    month: number;
    beginningBalance: number;
    payment: number;
    interest: number;
    principal: number;
    endingBalance: number;
  }>;
  finalPayoffDate: string;
  monthlySavings: number;
  interestSavings: number;
  timeSavings: number;
}

interface LoanRecommendation {
  type: 'close-first' | 'keep-open' | 'refinance' | 'consolidate';
  loanId: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  reason: string;
  savings: number;
}

interface RepaymentCalculatorProps {
  loans: LoanData[];
  onClose?: () => void;
  isStandalone?: boolean;
}

export function RepaymentCalculator({ loans, onClose, isStandalone = false }: RepaymentCalculatorProps) {
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<string>("");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<string>("");
  const [oneTimePrepayment, setOneTimePrepayment] = useState<string>("");
  const [payoffStrategy, setPayoffStrategy] = useState<"avalanche" | "snowball" | "custom">("avalanche");
  const [selectedTab, setSelectedTab] = useState("calculator");
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [recommendations, setRecommendations] = useState<LoanRecommendation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showLoanComparison, setShowLoanComparison] = useState(false);

  // Enhanced sample loan data with more details
  const defaultLoans: LoanData[] = [
    {
      id: "1",
      lenderName: "HDFC Bank",
      loanType: "Personal Loan",
      principalAmount: 500000,
      outstandingAmount: 320000,
      interestRate: 12.5,
      currentEMI: 18500,
      remainingTenure: 22,
      nextEMIDate: "2024-06-15"
    },
    {
      id: "2",
      lenderName: "SBI",
      loanType: "Vehicle Loan", 
      principalAmount: 800000,
      outstandingAmount: 500000,
      interestRate: 8.9,
      currentEMI: 16800,
      remainingTenure: 42,
      nextEMIDate: "2024-06-20"
    },
    {
      id: "3",
      lenderName: "Axis Bank",
      loanType: "Home Loan",
      principalAmount: 2500000,
      outstandingAmount: 2200000,
      interestRate: 7.25,
      currentEMI: 28500,
      remainingTenure: 180,
      nextEMIDate: "2024-06-10"
    },
    {
      id: "4",
      lenderName: "ICICI Bank",
      loanType: "Credit Card",
      principalAmount: 150000,
      outstandingAmount: 85000,
      interestRate: 18.0,
      currentEMI: 12500,
      remainingTenure: 8,
      nextEMIDate: "2024-06-05"
    }
  ];

  const availableLoans = loans.length > 0 ? loans : defaultLoans;

  useEffect(() => {
    if (availableLoans.length > 0 && selectedLoans.length === 0) {
      setSelectedLoans([availableLoans[0].id]);
    }
    generateRecommendations();
  }, [availableLoans]);

  const getSelectedLoansData = () => {
    return availableLoans.filter(loan => selectedLoans.includes(loan.id));
  };

  const getCurrentEMI = () => {
    const selected = getSelectedLoansData();
    return selected.reduce((sum, loan) => sum + loan.currentEMI, 0);
  };

  const getTotalOutstanding = () => {
    const selected = getSelectedLoansData();
    return selected.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  };

  const getHighestLoanAmount = () => {
    const selected = getSelectedLoansData();
    return Math.max(...selected.map(loan => loan.outstandingAmount));
  };

  const getLowestLoanAmount = () => {
    const selected = getSelectedLoansData();
    return Math.min(...selected.map(loan => loan.outstandingAmount));
  };

  const getWeightedInterestRate = () => {
    const selected = getSelectedLoansData();
    const totalOutstanding = getTotalOutstanding();
    
    if (totalOutstanding === 0) return 0;
    
    const weightedSum = selected.reduce((sum, loan) => {
      return sum + (loan.outstandingAmount * loan.interestRate);
    }, 0);
    
    return weightedSum / totalOutstanding;
  };

  const generateRecommendations = () => {
    const recs: LoanRecommendation[] = [];
    
    // Find highest interest rate loan
    const highestInterestLoan = availableLoans.reduce((prev, current) => 
      (prev.interestRate > current.interestRate) ? prev : current
    );
    
    // Find smallest balance loan
    const smallestLoan = availableLoans.reduce((prev, current) => 
      (prev.outstandingAmount < current.outstandingAmount) ? prev : current
    );

    // Recommendation: Close highest interest first
    if (highestInterestLoan.interestRate > 12) {
      recs.push({
        type: 'close-first',
        loanId: highestInterestLoan.id,
        title: `Close ${highestInterestLoan.loanType} First`,
        description: `Focus extra payments on this loan to save on high interest costs`,
        impact: 'high',
        reason: `Highest interest rate at ${highestInterestLoan.interestRate}%`,
        savings: Math.round(highestInterestLoan.outstandingAmount * 0.15)
      });
    }

    // Recommendation: Quick win with smallest loan
    if (smallestLoan.outstandingAmount < 200000) {
      recs.push({
        type: 'close-first',
        loanId: smallestLoan.id,
        title: `Quick Win: Close ${smallestLoan.loanType}`,
        description: `Small balance - close this for psychological momentum`,
        impact: 'medium',
        reason: `Lowest outstanding amount ₹${(smallestLoan.outstandingAmount/1000).toFixed(0)}K`,
        savings: Math.round(smallestLoan.currentEMI * 6)
      });
    }

    // Check for refinancing opportunities
    const highCostLoans = availableLoans.filter(loan => loan.interestRate > 10);
    if (highCostLoans.length > 0) {
      recs.push({
        type: 'refinance',
        loanId: highCostLoans[0].id,
        title: `Consider Refinancing ${highCostLoans[0].loanType}`,
        description: `Current rate ${highCostLoans[0].interestRate}% - you might get better rates`,
        impact: 'high',
        reason: 'Market rates have improved',
        savings: Math.round(highCostLoans[0].outstandingAmount * 0.02)
      });
    }

    setRecommendations(recs);
  };

  const calculateAdvancedRepayment = (
    selectedLoans: LoanData[],
    extraPayment: number,
    strategy: "avalanche" | "snowball" | "custom"
  ): CalculationResult => {
    let totalInterest = 0;
    let totalMonths = 0;
    let loansToProcess = [...selectedLoans];
    
    // Sort loans based on strategy
    if (strategy === "avalanche") {
      loansToProcess.sort((a, b) => b.interestRate - a.interestRate);
    } else if (strategy === "snowball") {
      loansToProcess.sort((a, b) => a.outstandingAmount - b.outstandingAmount);
    }

    let month = 0;
    let currentLoanIndex = 0;
    const schedule = [];
    
    while (currentLoanIndex < loansToProcess.length && month < 600) {
      month++;
      const currentLoan = loansToProcess[currentLoanIndex];
      const monthlyRate = currentLoan.interestRate / 100 / 12;
      
      let payment = currentLoan.currentEMI;
      if (currentLoanIndex === 0) {
        payment += extraPayment; // Apply extra payment to priority loan
      }
      
      const interestPayment = currentLoan.outstandingAmount * monthlyRate;
      const principalPayment = payment - interestPayment;
      
      currentLoan.outstandingAmount -= principalPayment;
      totalInterest += interestPayment;
      
      schedule.push({
        month,
        beginningBalance: currentLoan.outstandingAmount + principalPayment,
        payment,
        interest: interestPayment,
        principal: principalPayment,
        endingBalance: currentLoan.outstandingAmount
      });
      
      if (currentLoan.outstandingAmount <= 0) {
        currentLoanIndex++;
        if (currentLoanIndex < loansToProcess.length) {
          // Add closed loan's EMI to extra payment for next loan
          extraPayment += currentLoan.currentEMI;
        }
      }
    }

    const finalDate = new Date();
    finalDate.setMonth(finalDate.getMonth() + month);
    
    // Calculate original scenario for comparison
    const originalTotalInterest = selectedLoans.reduce((sum, loan) => {
      const monthlyRate = loan.interestRate / 100 / 12;
      return sum + (loan.outstandingAmount * monthlyRate * loan.remainingTenure);
    }, 0);

    const originalMonths = Math.max(...selectedLoans.map(loan => loan.remainingTenure));

    return {
      monthsToRepay: month,
      totalInstallments: month,
      totalInterestPaid: totalInterest,
      totalAmountPaid: getTotalOutstanding() + totalInterest,
      amortizationSchedule: schedule,
      finalPayoffDate: finalDate.toLocaleDateString(),
      monthlySavings: extraPayment,
      interestSavings: originalTotalInterest - totalInterest,
      timeSavings: originalMonths - month
    };
  };

  const handleCalculate = () => {
    try {
      setIsCalculating(true);
      
      const extraPayment = parseFloat(extraMonthlyPayment) || 0;
      const prepayment = parseFloat(oneTimePrepayment) || 0;
      
      const selectedLoansData = getSelectedLoansData();
      
      // Apply one-time prepayment to highest interest loan
      if (prepayment > 0 && selectedLoansData.length > 0) {
        const highestInterestLoan = selectedLoansData.reduce((prev, current) => 
          (prev.interestRate > current.interestRate) ? prev : current
        );
        highestInterestLoan.outstandingAmount = Math.max(0, highestInterestLoan.outstandingAmount - prepayment);
      }
      
      const result = calculateAdvancedRepayment(selectedLoansData, extraPayment, payoffStrategy);
      setResults(result);
      
    } catch (error) {
      alert(error instanceof Error ? error.message : "Calculation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  const getLoanSummaryStats = () => {
    return {
      totalLoans: availableLoans.length,
      totalOutstanding: availableLoans.reduce((sum, loan) => sum + loan.outstandingAmount, 0),
      highestAmount: Math.max(...availableLoans.map(loan => loan.outstandingAmount)),
      lowestAmount: Math.min(...availableLoans.map(loan => loan.outstandingAmount)),
      averageInterest: availableLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / availableLoans.length,
      totalEMI: availableLoans.reduce((sum, loan) => sum + loan.currentEMI, 0)
    };
  };

  const stats = getLoanSummaryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-50 pb-20">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-400/20 rounded-full translate-x-36 translate-y-36 blur-3xl"></div>
        
        <div className="relative z-10 pt-8 pb-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full backdrop-blur-sm"
                  data-testid="button-close-calculator"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-2xl">Smart Repayment Calculator</h1>
                  <p className="text-white/80 text-sm">Optimize your loan payoff strategy</p>
                </div>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>

          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalLoans}</div>
              <div className="text-white/80 text-sm">Active Loans</div>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">₹{(stats.totalOutstanding/100000).toFixed(1)}L</div>
              <div className="text-white/80 text-sm">Total Outstanding</div>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">{stats.averageInterest.toFixed(1)}%</div>
              <div className="text-white/80 text-sm">Avg Interest</div>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">₹{(stats.totalEMI/1000).toFixed(0)}K</div>
              <div className="text-white/80 text-sm">Total EMI</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* Modern Tab Navigation */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-2 mb-6 border border-red-200/30 shadow-xl">
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger 
                value="calculator" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
                data-testid="tab-calculator"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
                data-testid="tab-comparison"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare
              </TabsTrigger>
              <TabsTrigger 
                value="recommendations" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
                data-testid="tab-recommendations"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Advice
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <GlassmorphicCard className="bg-white/90 backdrop-blur-lg border border-red-200/30 shadow-xl">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    Loan Selection & Strategy
                  </h3>
                  
                  {/* Loan Selection */}
                  <div className="space-y-4 mb-6">
                    <Label className="text-sm font-semibold text-gray-700">Select Loans to Optimize</Label>
                    <div className="space-y-3">
                      {availableLoans.map((loan) => (
                        <div key={loan.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                          <Checkbox
                            id={loan.id}
                            checked={selectedLoans.includes(loan.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLoans([...selectedLoans, loan.id]);
                              } else {
                                setSelectedLoans(selectedLoans.filter(id => id !== loan.id));
                              }
                            }}
                            data-testid={`checkbox-loan-${loan.id}`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-800">{loan.loanType}</div>
                                <div className="text-sm text-gray-600">{loan.lenderName}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-red-600">₹{(loan.outstandingAmount/100000).toFixed(1)}L</div>
                                <div className="text-xs text-gray-500">{loan.interestRate}% APR</div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-gray-600">EMI: ₹{loan.currentEMI.toLocaleString()}</span>
                              <span className="text-gray-600">{loan.remainingTenure} months left</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategy Selection */}
                  <div className="space-y-4 mb-6">
                    <Label className="text-sm font-semibold text-gray-700">Payoff Strategy</Label>
                    <Select value={payoffStrategy} onValueChange={(value: any) => setPayoffStrategy(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avalanche">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="font-medium">Avalanche (Recommended)</div>
                              <div className="text-xs text-gray-600">Pay highest interest first - saves most money</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="snowball">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium">Snowball</div>
                              <div className="text-xs text-gray-600">Pay smallest balance first - quick wins</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-purple-500" />
                            <div>
                              <div className="font-medium">Custom Priority</div>
                              <div className="text-xs text-gray-600">Choose your own order</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Inputs */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPayment" className="text-sm font-semibold text-gray-700">
                        Current Monthly Payment
                      </Label>
                      <div className="mt-1 p-4 bg-green-50 rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">₹{getCurrentEMI().toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Combined EMI for selected loans</div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="extraPayment" className="text-sm font-semibold text-gray-700">
                        Extra Monthly Payment (₹)
                      </Label>
                      <Input
                        id="extraPayment"
                        type="number"
                        value={extraMonthlyPayment}
                        onChange={(e) => setExtraMonthlyPayment(e.target.value)}
                        placeholder="Enter extra monthly amount"
                        className="mt-1"
                        data-testid="input-extra-payment"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setExtraMonthlyPayment((getCurrentEMI() * 0.1).toString())}
                          data-testid="button-10-percent"
                        >
                          +10%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setExtraMonthlyPayment((getCurrentEMI() * 0.25).toString())}
                          data-testid="button-25-percent"
                        >
                          +25%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setExtraMonthlyPayment("5000")}
                          data-testid="button-5k"
                        >
                          +₹5K
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="prepayment" className="text-sm font-semibold text-gray-700">
                        One-time Prepayment (₹) - Optional
                      </Label>
                      <Input
                        id="prepayment"
                        type="number"
                        value={oneTimePrepayment}
                        onChange={(e) => setOneTimePrepayment(e.target.value)}
                        placeholder="Bonus, tax refund, windfall money"
                        className="mt-1"
                        data-testid="input-prepayment"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-blue-800 mb-2">Total Monthly Payment</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{(getCurrentEMI() + (parseFloat(extraMonthlyPayment) || 0)).toLocaleString()}
                      </div>
                      {parseFloat(extraMonthlyPayment) > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          ₹{getCurrentEMI().toLocaleString()} regular + ₹{(parseFloat(extraMonthlyPayment) || 0).toLocaleString()} extra
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    disabled={selectedLoans.length === 0 || isCalculating}
                    className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg"
                    data-testid="button-calculate"
                  >
                    {isCalculating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Calculating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Calculate Payoff Plan
                      </div>
                    )}
                  </Button>
                </div>
              </GlassmorphicCard>

              {/* Results Section */}
              <GlassmorphicCard className="bg-white/90 backdrop-blur-lg border border-red-200/30 shadow-xl">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Optimization Results
                  </h3>
                  
                  {results ? (
                    <div className="space-y-6">
                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="text-3xl font-bold text-green-600 mb-1">{results.monthsToRepay}</div>
                          <div className="text-sm text-gray-600">Months to Freedom</div>
                          {results.timeSavings > 0 && (
                            <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                              <ArrowDown className="h-3 w-3" />
                              {results.timeSavings} months faster
                            </div>
                          )}
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            ₹{(results.totalInterestPaid / 100000).toFixed(1)}L
                          </div>
                          <div className="text-sm text-gray-600">Total Interest</div>
                          {results.interestSavings > 0 && (
                            <div className="text-xs text-blue-600 mt-1 flex items-center justify-center gap-1">
                              <ArrowDown className="h-3 w-3" />
                              Save ₹{(results.interestSavings/1000).toFixed(0)}K
                            </div>
                          )}
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                          <div className="text-3xl font-bold text-orange-600 mb-1">
                            ₹{(results.totalAmountPaid / 100000).toFixed(1)}L
                          </div>
                          <div className="text-sm text-gray-600">Total Payment</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <div className="text-lg font-bold text-purple-600 mb-1">{results.finalPayoffDate}</div>
                          <div className="text-sm text-gray-600">Freedom Date</div>
                        </div>
                      </div>

                      {/* Savings Highlight */}
                      {(results.interestSavings > 0 || results.timeSavings > 0) && (
                        <div className="p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white">
                          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Congratulations! You'll Save:
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-2xl font-bold">₹{(results.interestSavings/1000).toFixed(0)}K</div>
                              <div className="text-green-100 text-sm">in interest costs</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{results.timeSavings}</div>
                              <div className="text-green-100 text-sm">months of payments</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loan Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-gray-600">Highest Loan Amount</div>
                          <div className="font-bold text-gray-800">₹{(getHighestLoanAmount()/100000).toFixed(1)}L</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-gray-600">Lowest Loan Amount</div>
                          <div className="font-bold text-gray-800">₹{(getLowestLoanAmount()/100000).toFixed(1)}L</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="flex-1" data-testid="button-export-plan">
                          <Download className="h-4 w-4 mr-2" />
                          Export Plan
                        </Button>
                        <Button variant="outline" className="flex-1" data-testid="button-share-strategy">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Strategy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calculator className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <div className="space-y-2">
                        <p className="font-medium">Ready to optimize your loans?</p>
                        <p className="text-sm">Select loans and set your extra payment amount to see powerful results</p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <GlassmorphicCard className="bg-white/90 backdrop-blur-lg border border-orange-200/30 shadow-xl">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <PieChart className="h-6 w-6 text-blue-600" />
                  Loan Portfolio Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Loan Comparison Table */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Individual Loan Comparison</h4>
                    <div className="space-y-3">
                      {availableLoans.map((loan) => (
                        <div key={loan.id} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-semibold text-gray-800">{loan.loanType}</div>
                              <div className="text-sm text-gray-600">{loan.lenderName}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{loan.interestRate}%</div>
                              <div className="text-xs text-gray-500">Interest Rate</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <div className="text-gray-600">Outstanding</div>
                              <div className="font-semibold">₹{(loan.outstandingAmount/100000).toFixed(1)}L</div>
                            </div>
                            <div>
                              <div className="text-gray-600">EMI</div>
                              <div className="font-semibold">₹{loan.currentEMI.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Tenure Left</div>
                              <div className="font-semibold">{loan.remainingTenure}m</div>
                            </div>
                          </div>
                          
                          {/* Priority indicator based on strategy */}
                          {loan.interestRate >= 12 && (
                            <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                              <div className="text-xs font-semibold text-red-700 flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3" />
                                High Interest - Pay First
                              </div>
                            </div>
                          )}
                          {loan.outstandingAmount < 200000 && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-xs font-semibold text-blue-700 flex items-center gap-2">
                                <Target className="h-3 w-3" />
                                Small Balance - Quick Win
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Summary */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Summary</h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Total Portfolio Value</div>
                        <div className="text-2xl font-bold text-blue-600">₹{(stats.totalOutstanding/100000).toFixed(1)}L</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-gray-600">Highest Amount</div>
                          <div className="font-bold text-green-600">₹{(stats.highestAmount/100000).toFixed(1)}L</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="text-xs text-gray-600">Lowest Amount</div>
                          <div className="font-bold text-orange-600">₹{(stats.lowestAmount/100000).toFixed(1)}L</div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Average Interest Rate</div>
                        <div className="text-xl font-bold text-purple-600">{stats.averageInterest.toFixed(1)}%</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Range: {Math.min(...availableLoans.map(l => l.interestRate))}% - {Math.max(...availableLoans.map(l => l.interestRate))}%
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Total Monthly Commitment</div>
                        <div className="text-xl font-bold text-gray-700">₹{stats.totalEMI.toLocaleString()}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Across {stats.totalLoans} active loans
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <GlassmorphicCard className="bg-white/90 backdrop-blur-lg border border-orange-200/30 shadow-xl">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                  AI-Powered Loan Strategy
                </h3>
                <p className="text-gray-600 mb-8">Smart recommendations based on your loan portfolio analysis</p>
                
                <div className="space-y-6">
                  {recommendations.map((rec, index) => (
                    <div 
                      key={index} 
                      className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                        rec.impact === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' :
                        rec.impact === 'medium' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' :
                        'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            rec.impact === 'high' ? 'bg-red-100' :
                            rec.impact === 'medium' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {rec.type === 'close-first' ? <Target className="h-5 w-5 text-red-600" /> :
                             rec.type === 'refinance' ? <TrendingDown className="h-5 w-5 text-blue-600" /> :
                             <Sparkles className="h-5 w-5 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-lg mb-2">{rec.title}</h4>
                            <p className="text-gray-700 mb-3">{rec.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className={`px-3 py-1 rounded-full font-medium ${
                                rec.impact === 'high' ? 'bg-red-100 text-red-700' :
                                rec.impact === 'medium' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {rec.impact.toUpperCase()} IMPACT
                              </div>
                              <div className="text-gray-600">{rec.reason}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">₹{(rec.savings/1000).toFixed(0)}K</div>
                          <div className="text-sm text-gray-600">Potential Savings</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Recommendation #{index + 1}
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          Apply Strategy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassmorphicCard>

            {/* Quick Actions */}
            <GlassmorphicCard className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
              <div className="p-6">
                <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Actions for Debt Freedom
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-800">Set up automatic extra payments</div>
                      <div className="text-purple-600">Even ₹1000 extra monthly makes a big difference</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-800">Use windfall money wisely</div>
                      <div className="text-purple-600">Apply bonuses and tax refunds to loans</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-800">Review rates annually</div>
                      <div className="text-purple-600">Refinance when you find better deals</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-800">Track progress monthly</div>
                      <div className="text-purple-600">Celebrate milestones to stay motivated</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}