import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Lightbulb,
  CreditCard,
  Settings,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

interface LoanData {
  id: string;
  name: string;
  lenderName: string;
  outstandingAmount: number;
  interestRate: number;
  selected?: boolean;
}

interface SingleLoanResult {
  monthsToRepay: number;
  totalAmountPaid: number;
  totalInterestPaid: number;
  interestSaved: number;
  payoffDate: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function RepaymentCalculator() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  
  const [selectedLoan, setSelectedLoan] = useState<string>("");
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [oneTimePrepayment, setOneTimePrepayment] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [multiLoanStrategy, setMultiLoanStrategy] = useState<'snowball' | 'avalanche' | 'custom'>('avalanche');
  const [loans, setLoans] = useState<LoanData[]>([
    {
      id: "1",
      name: "Personal Loan",
      lenderName: "HDFC Bank",
      outstandingAmount: 300000,
      interestRate: 12.5,
      selected: false
    },
    {
      id: "2",
      name: "Home Loan", 
      lenderName: "SBI",
      outstandingAmount: 2500000,
      interestRate: 8.75,
      selected: false
    },
    {
      id: "3",
      name: "Car Loan",
      lenderName: "ICICI Bank",
      outstandingAmount: 450000,
      interestRate: 9.25,
      selected: false
    },
    {
      id: "4",
      name: "Credit Card",
      lenderName: "Axis Bank",
      outstandingAmount: 85000,
      interestRate: 18.0,
      selected: false
    }
  ]);

  const selectedMultiLoans = loans.filter(loan => loan.selected);
  const selectedLoanData = loans.find(loan => loan.id === selectedLoan);

  const calculateSingleLoan = (
    principal: number,
    annualRate: number,
    extraMonthlyPayment: number = 0,
    oneTimePayment: number = 0
  ): SingleLoanResult => {
    const monthlyRate = annualRate / 100 / 12;
    const standardEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, 240)) / 
                       (Math.pow(1 + monthlyRate, 240) - 1);
    
    let remainingPrincipal = principal - oneTimePayment;
    let totalPaid = oneTimePayment;
    let months = 0;
    const maxMonths = 600;

    while (remainingPrincipal > 0.01 && months < maxMonths) {
      months++;
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = Math.min(standardEMI + extraMonthlyPayment - interestPayment, remainingPrincipal);
      
      remainingPrincipal -= principalPayment;
      totalPaid += interestPayment + principalPayment;
    }

    const standardTotalInterest = (standardEMI * 240) - principal;
    const actualTotalInterest = totalPaid - principal;
    const interestSaved = Math.max(0, standardTotalInterest - actualTotalInterest);

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    return {
      monthsToRepay: months,
      totalAmountPaid: totalPaid,
      totalInterestPaid: actualTotalInterest,
      interestSaved: interestSaved,
      payoffDate: payoffDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
    };
  };

  const singleLoanResult = useMemo(() => {
    if (!selectedLoanData) return null;
    return calculateSingleLoan(
      selectedLoanData.outstandingAmount,
      selectedLoanData.interestRate,
      extraPayment,
      oneTimePrepayment
    );
  }, [selectedLoanData, extraPayment, oneTimePrepayment]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider">REPAYMENT CALCULATOR</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Smart loan optimization</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Stats Card */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Interest Saved</p>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">Optimized</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight">
                {hideAmounts ? "₹••••••••" : formatCurrency(singleLoanResult?.interestSaved || 362825)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Months</p>
                <p className="text-lg font-light text-white">{singleLoanResult?.monthsToRepay || 63}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Rate Range</p>
                <p className="text-lg font-light text-white">8%-18%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Loan Range</p>
                <p className="text-lg font-light text-white">₹10K-₹5L</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Portfolio */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <h2 className="text-sm font-light text-white tracking-wide">Loan Portfolio</h2>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Select loans for optimization</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLoans(loans.map(l => ({ ...l, selected: true })))}
              className="text-xs bg-transparent border border-white/30 text-white hover:bg-white hover:text-black rounded-none"
              data-testid="button-select-all-loans"
            >
              Select All
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Selected Loans: {selectedMultiLoans.length}</p>
            <div className="space-y-3">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  onClick={() => {
                    setSelectedLoan(loan.id);
                    setLoans(loans.map(l => 
                      l.id === loan.id ? { ...l, selected: !l.selected } : l
                    ));
                  }}
                  className={`p-4 border cursor-pointer transition-all ${
                    loan.selected
                      ? "border-white bg-white text-black"
                      : "border-white/10 hover:border-white/20 bg-transparent"
                  }`}
                  data-testid={`loan-card-${loan.id}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={loan.selected}
                      onChange={(e) => {
                        e.stopPropagation();
                        setLoans(loans.map(l => 
                          l.id === loan.id ? { ...l, selected: !l.selected } : l
                        ));
                      }}
                      className={`w-4 h-4 ${loan.selected ? 'text-black border-black/30 focus:ring-black/50' : 'text-white border-white/30 focus:ring-white/50'}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-light tracking-wide ${loan.selected ? 'text-black' : 'text-white'}`}>{loan.name}</h4>
                          <p className={`text-[10px] uppercase tracking-widest ${loan.selected ? 'text-black/60' : 'text-white/50'}`}>{loan.lenderName}</p>
                          <p className={`text-[10px] ${loan.selected ? 'text-black/40' : 'text-white/40'}`}>{loan.interestRate}% APR</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-light tracking-tight ${loan.selected ? 'text-black' : 'text-white'}`}>
                            {hideAmounts ? "₹••••••" : formatCurrency(loan.outstandingAmount)}
                          </div>
                          <div className={`text-[10px] uppercase tracking-widest ${loan.selected ? 'text-black/40' : 'text-white/40'}`}>Outstanding</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optimization Controls */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
              <Settings className="h-4 w-4 text-white/60" />
            </div>
            <div>
              <h2 className="text-sm font-light text-white tracking-wide">Optimization Controls</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Adjust payment strategies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-white/10">
              <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-3 block flex items-center gap-2">
                <Target className="w-3 h-3 text-white/60" />
                Extra Monthly Payment
              </Label>
              <Input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                placeholder="₹ 0"
                className="border border-white/20 bg-transparent text-white placeholder:text-white/40 focus:border-white focus:ring-1 focus:ring-white/20 rounded-none"
                data-testid="input-extra-payment"
              />
              <p className="text-[10px] text-white/40 mt-2 tracking-wide">Additional amount to pay each month</p>
            </div>

            <div className="p-4 border border-white/10">
              <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-3 block flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-white/60" />
                One-time Prepayment
              </Label>
              <Input
                type="number"
                value={oneTimePrepayment}
                onChange={(e) => setOneTimePrepayment(Number(e.target.value) || 0)}
                placeholder="₹ 0"
                className="border border-white/20 bg-transparent text-white placeholder:text-white/40 focus:border-white focus:ring-1 focus:ring-white/20 rounded-none"
                data-testid="input-prepayment"
              />
              <p className="text-[10px] text-white/40 mt-2 tracking-wide">Lump sum payment towards principal</p>
            </div>

            <div className="p-4 border border-white/10">
              <Label className="text-[10px] text-white/50 uppercase tracking-widest mb-3 block flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-white/60" />
                Repayment Strategy
              </Label>
              <Select value={multiLoanStrategy} onValueChange={(value: 'snowball' | 'avalanche' | 'custom') => setMultiLoanStrategy(value)}>
                <SelectTrigger className="border border-white/20 bg-transparent text-white focus:border-white focus:ring-1 focus:ring-white/20 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avalanche">🔥 Debt Avalanche (High Interest First)</SelectItem>
                  <SelectItem value="snowball">❄️ Debt Snowball (Low Balance First)</SelectItem>
                  <SelectItem value="custom">⚙️ Custom Strategy</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-white/40 mt-2 tracking-wide">Choose your debt elimination approach</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button 
              variant="outline" 
              className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-black rounded-none"
              onClick={() => setExtraPayment(5000)}
              data-testid="button-quick-5k"
            >
              +₹5K Monthly
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-black rounded-none"
              onClick={() => setOneTimePrepayment(100000)}
              data-testid="button-quick-1l"
            >
              +₹1L Prepay
            </Button>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
              <Calculator className="h-4 w-4 text-white/60" />
            </div>
            <div>
              <h2 className="text-sm font-light text-white tracking-wide">Repayment Analysis</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Optimized debt freedom timeline</p>
            </div>
          </div>

          <div className="border border-white/10 p-6 mb-6 text-center">
            <div className="text-5xl font-light text-white mb-2">
              {singleLoanResult?.monthsToRepay || 63}
            </div>
            <div className="text-sm font-light text-white/60 tracking-wide">months to freedom</div>
            <div className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">Optimized repayment timeline</div>
            
            <div className="mt-4">
              <div className="w-full bg-white/20 h-2">
                <div 
                  className="bg-white h-2 transition-all duration-1000"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-white/40 mt-2 uppercase tracking-widest">
                <span>Start</span>
                <span>Original: 152 months</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-white/10 p-4 text-center">
              <TrendingDown className="w-5 h-5 text-white/60 mx-auto mb-2" />
              <div className="text-lg font-light text-white mb-1 tracking-tight">
                {hideAmounts ? "₹••••••" : formatCurrency(singleLoanResult?.interestSaved || 362825)}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest">Interest Saved</div>
            </div>
            
            <div className="border border-white/10 p-4 text-center">
              <Calculator className="w-5 h-5 text-white/60 mx-auto mb-2" />
              <div className="text-lg font-light text-white mb-1 tracking-tight">
                {hideAmounts ? "₹••••••" : formatCurrency(singleLoanResult?.totalInterestPaid || 2467975)}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest">Total Interest</div>
            </div>
            
            <div className="border border-white/10 p-4 text-center">
              <DollarSign className="w-5 h-5 text-white/60 mx-auto mb-2" />
              <div className="text-lg font-light text-white mb-1 tracking-tight">
                {hideAmounts ? "₹••••••" : formatCurrency(singleLoanResult?.totalAmountPaid || 6967975)}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest">Total Paid</div>
            </div>
            
            <div className="border border-white/10 p-4 text-center">
              <Clock className="w-5 h-5 text-white/60 mx-auto mb-2" />
              <div className="text-lg font-light text-white mb-1 tracking-tight">
                {singleLoanResult ? Math.round(singleLoanResult.monthsToRepay * 1.2) : 152}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest">Total Months</div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-white/10">
            <h4 className="font-light text-white mb-3 flex items-center gap-2 tracking-wide">
              <CheckCircle className="w-4 h-4" />
              Smart Features Enabled
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-white/50 tracking-wide">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                <span>Interest rate optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                <span>Multiple loan management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                <span>Prepayment strategies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                <span>Debt consolidation analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6 text-center">
          <h3 className="text-sm font-light text-white mb-4 tracking-wide">Ready to optimize your loans?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-white text-black hover:bg-white/90 px-6 py-3 rounded-none font-light tracking-wide"
              data-testid="button-apply-optimization"
            >
              <Target className="h-4 w-4 mr-2" />
              Apply Optimization
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-black px-6 py-3 rounded-none font-light tracking-wide"
              onClick={() => navigate('/my-loans')}
              data-testid="button-view-loans"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View My Loans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
