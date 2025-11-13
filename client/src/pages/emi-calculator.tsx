import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator,
  ArrowLeft,
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  IndianRupee,
  FileText,
  Download
} from "lucide-react";

export default function EmiCalculator() {
  const [, navigate] = useLocation();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(24);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Calculate EMI using formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / (12 * 100); // Monthly interest rate
    const time = loanTenure;

    if (rate === 0) {
      const calculatedEMI = principal / time;
      setEmi(calculatedEMI);
      setTotalAmount(principal);
      setTotalInterest(0);
    } else {
      const calculatedEMI = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      const calculatedTotalAmount = calculatedEMI * time;
      const calculatedTotalInterest = calculatedTotalAmount - principal;
      
      setEmi(calculatedEMI);
      setTotalAmount(calculatedTotalAmount);
      setTotalInterest(calculatedTotalInterest);
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount));
  };

  const generateAmortizationSchedule = () => {
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    
    for (let month = 1; month <= loanTenure; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance = balance - principalPayment;
      
      schedule.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, balance))
      });
    }
    return schedule;
  };

  const schedule = generateAmortizationSchedule();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 border border-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-wider">EMI CALCULATOR</h1>
          </div>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wider mb-2">CALCULATE YOUR EMI</h2>
          <p className="text-white/60">Plan your loan payments with precision</p>
        </div>

        {/* Calculator Form */}
        <div className="bg-black border border-white/20 p-6 mb-6">
          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-medium tracking-wider">LOAN AMOUNT</label>
                <div className="flex items-center gap-2 text-white">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-bold">{formatCurrency(loanAmount)}</span>
                </div>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                max={10000000}
                min={50000}
                step={50000}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>₹50K</span>
                <span>₹1Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-medium tracking-wider">INTEREST RATE</label>
                <div className="flex items-center gap-2 text-white">
                  <Percent className="h-4 w-4" />
                  <span className="font-bold">{interestRate}%</span>
                </div>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                max={30}
                min={1}
                step={0.1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>1%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-medium tracking-wider">LOAN TENURE</label>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  <span className="font-bold">{loanTenure} months</span>
                </div>
              </div>
              <Slider
                value={[loanTenure]}
                onValueChange={(value) => setLoanTenure(value[0])}
                max={360}
                min={6}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>6 months</span>
                <span>30 years</span>
              </div>
            </div>
          </div>
        </div>

        {/* EMI Results */}
        <div className="bg-black border border-white/20 p-6 mb-6">
          <h3 className="font-semibold text-white mb-4 tracking-wider">CALCULATION RESULTS</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="text-center p-4 border border-white/20">
              <p className="text-white/60 text-sm mb-1">Monthly EMI</p>
              <p className="text-3xl font-bold text-white">₹{formatCurrency(emi)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-white/20">
                <p className="text-white/60 text-sm mb-1">Total Interest</p>
                <p className="text-xl font-bold text-white/80">₹{formatCurrency(totalInterest)}</p>
              </div>
              <div className="text-center p-4 border border-white/20">
                <p className="text-white/60 text-sm mb-1">Total Amount</p>
                <p className="text-xl font-bold text-white">₹{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Breakdown Chart Visual */}
          <div className="flex items-center gap-4 p-4 border border-white/20">
            <PieChart className="h-8 w-8 text-white/60" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm">Principal Amount</span>
                <span className="text-white font-semibold">₹{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Interest Amount</span>
                <span className="text-white/80 font-semibold">₹{formatCurrency(totalInterest)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Loan Amounts */}
        <div className="bg-black border border-white/20 p-6 mb-6">
          <h3 className="font-semibold text-white mb-4 tracking-wider">QUICK SELECT</h3>
          <div className="grid grid-cols-3 gap-3">
            {[100000, 500000, 1000000, 2000000, 5000000, 10000000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setLoanAmount(amount)}
                className="border border-white/30 text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium h-10"
                data-testid={`button-quick-amount-${amount}`}
              >
                ₹{amount >= 100000 ? `${amount/100000}L` : `${amount/1000}K`}
              </Button>
            ))}
          </div>
        </div>

        {/* Amortization Preview */}
        <div className="bg-black border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white tracking-wider">PAYMENT SCHEDULE</h3>
            <Button
              variant="outline"
              size="sm"
              className="border border-white/30 text-white/80 hover:text-white hover:bg-white/10 font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              DOWNLOAD
            </Button>
          </div>
          
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 p-3 border-b border-white/20 text-sm font-medium text-white/80">
            <div>Month</div>
            <div>EMI</div>
            <div>Principal</div>
            <div>Interest</div>
            <div>Balance</div>
          </div>
          
          {/* Show first 6 months */}
          <div className="max-h-64 overflow-y-auto">
            {schedule.slice(0, 6).map((payment) => (
              <div key={payment.month} className="grid grid-cols-5 gap-2 p-3 border-b border-white/10 text-sm">
                <div className="text-white">{payment.month}</div>
                <div className="text-white">₹{formatCurrency(payment.emi)}</div>
                <div className="text-white/80">₹{formatCurrency(payment.principal)}</div>
                <div className="text-white/80">₹{formatCurrency(payment.interest)}</div>
                <div className="text-white/80">₹{formatCurrency(payment.balance)}</div>
              </div>
            ))}
          </div>
          
          {loanTenure > 6 && (
            <div className="text-center pt-3">
              <p className="text-white/60 text-sm">... and {loanTenure - 6} more payments</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate("/loan-application")}
            className="flex-1 bg-white text-black hover:bg-white/90 font-semibold h-12"
          >
            <FileText className="h-4 w-4 mr-2" />
            APPLY FOR LOAN
          </Button>
          <Button 
            onClick={() => navigate("/marketplace")}
            variant="outline" 
            className="flex-1 border border-white/30 text-white hover:bg-white/10 font-semibold h-12"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            COMPARE OFFERS
          </Button>
        </div>
      </div>
    </div>
  );
}