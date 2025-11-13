import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { cn } from "@/lib/utils";
import { TOP_FIXED_DEPOSITS, calculateFDMaturity } from "@/data/fixed-deposits";
import {
  ArrowLeft,
  Building2,
  Calculator,
  Percent,
  Calendar,
  BadgeIndianRupee,
  TrendingUp,
  Shield,
  Award,
  Check,
  AlertCircle,
  X,
  Clock,
  FileText,
  Download,
  CreditCard,
  Wallet
} from "lucide-react";

export default function FixedDepositDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const fdId = params.fdId;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useUrlTab("overview");
  const [calcPrincipal, setCalcPrincipal] = useState("100000");
  const [calcTenure, setCalcTenure] = useState("12");
  const [calcInterestType, setCalcInterestType] = useState<"simple" | "compound">("compound");
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  // Get FD data from imported data file
  const fdData = fdId ? TOP_FIXED_DEPOSITS[fdId] : null;
  
  // If invalid fdId, redirect back to fixed deposits list
  useEffect(() => {
    if (fdId && !fdData) {
      toast({
        title: "FD Not Found",
        description: "The requested fixed deposit was not found.",
        variant: "destructive",
      });
      navigate("/fixed-deposits");
    }
  }, [fdId, fdData, navigate, toast]);
  
  // Compounding frequency mapping
  const compoundingMap: Record<string, string> = {
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'half-yearly': 'Half-Yearly',
    'half_yearly': 'Half-Yearly',
    'annually': 'Annually',
    'yearly': 'Yearly',
  };
  
  // Generate tenure options based on FD's main tenure
  const generateTenureOptions = (mainTenure: number) => {
    const options = [12, 18, 24, 36, 48, 60];
    if (!options.includes(mainTenure) && mainTenure > 0) {
      options.push(mainTenure);
      options.sort((a, b) => a - b);
    }
    return options;
  };
  
  // Mock FD data (in real app, fetch from API)
  const fdScheme = fdData ? {
    id: fdData.id,
    bankName: fdData.bankName,
    bankLogo: fdData.bankLogo,
    fdName: `${fdData.bankName} ${fdData.fdType}`,
    fdType: fdData.fdType.toLowerCase(),
    interestRate: fdData.interestRate,
    seniorCitizenRate: fdData.seniorCitizenRate,
    minAmount: fdData.minDeposit,
    maxAmount: fdData.maxDeposit,
    minTenure: fdData.tenure,
    maxTenure: fdData.tenure,
    tenureOptions: generateTenureOptions(fdData.tenure),
    compoundingFrequency: fdData.compoundingFrequency.toLowerCase(),
    compoundingFrequencyTitle: compoundingMap[fdData.compoundingFrequency.toLowerCase()] || 'Quarterly',
    interestPayoutFrequency: fdData.payoutType.toLowerCase().replace(/\s+/g, '_'),
    prematureWithdrawalAllowed: fdData.prematureWithdrawal ? 1 : 0,
    prematureWithdrawalPenalty: parseFloat(fdData.prematureWithdrawalPenalty) || 1.0,
    loanAgainstFdAllowed: 1,
    loanPercentage: 90,
    tdsApplicable: fdData.tdsCertificate ? 1 : 0,
    nomineeRequired: fdData.nominationFacility ? 1 : 0,
    autoRenewal: fdData.autoRenewal ? 1 : 0,
    rating: fdData.rating,
    features: fdData.benefits,
    fdCategory: fdData.interestRate >= 7.5 ? "best_rates" : "top_rated",
  } : {
    id: fdId || "1",
    bankName: "HDFC Bank",
    bankLogo: "",
    fdName: "HDFC Regular Fixed Deposit",
    fdType: "regular",
    interestRate: 7.25,
    seniorCitizenRate: 7.75,
    minAmount: 5000,
    maxAmount: 10000000,
    minTenure: 7,
    maxTenure: 120,
    tenureOptions: [12, 24, 36, 60, 120],
    compoundingFrequency: "quarterly",
    compoundingFrequencyTitle: "Quarterly",
    interestPayoutFrequency: "at_maturity",
    prematureWithdrawalAllowed: 1,
    prematureWithdrawalPenalty: 1.0,
    loanAgainstFdAllowed: 1,
    loanPercentage: 90,
    tdsApplicable: 1,
    nomineeRequired: 1,
    autoRenewal: 0,
    rating: 4.8,
    features: [
      "Premature withdrawal allowed",
      "Loan facility up to 90% of FD value",
      "Auto-renewal option available",
      "Nomination facility available",
      "Flexible tenure options",
      "Competitive interest rates",
      "Safe and secure investment",
      "Government insured up to ₹5 lakh"
    ],
    fdCategory: "top_rated",
  };

  // User's FD investments (mock data)
  const userFDs = [
    {
      id: "ufd1",
      fdNumber: "FD123456789",
      principalAmount: 100000,
      interestRate: 7.25,
      tenure: 12,
      maturityAmount: 107250,
      interestEarned: 7250,
      startDate: "2024-01-15",
      maturityDate: "2025-01-15",
      status: "active",
      autoRenewal: 0,
    },
  ];

  // Calculator logic using imported function
  const calculateMaturityAmount = () => {
    const P = parseFloat(calcPrincipal) || 0;
    const tenure = parseInt(calcTenure);
    
    if (calcInterestType === "compound") {
      // Use the imported calculation function with properly mapped compounding frequency
      const result = calculateFDMaturity(
        P,
        fdScheme.interestRate,
        tenure,
        fdScheme.compoundingFrequencyTitle
      );
      
      return {
        maturity: result.maturityAmount,
        interest: result.interestEarned,
        principal: P
      };
    } else {
      // Simple interest
      const r = fdScheme.interestRate / 100;
      const t = tenure / 12;
      const interest = P * r * t;
      const maturity = P + interest;
      
      return {
        maturity: Math.round(maturity),
        interest: Math.round(interest),
        principal: P
      };
    }
  };

  const calculatedAmounts = calculateMaturityAmount();

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
          <div className="flex-1 text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">FD Details</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Fixed Deposit Plan</p>
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="p-4 pb-24 space-y-6">
        {/* Bank Header Card */}
        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/20 rounded-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 border border-white/20 rounded-none">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white" data-testid="text-bank-name">
                    {fdScheme.bankName}
                  </h2>
                  <p className="text-sm text-white/70" data-testid="text-fd-name">
                    {fdScheme.fdName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-none border border-white/20">
                <Award className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-semibold" data-testid="text-rating">
                  {fdScheme.rating}
                </span>
              </div>
            </div>

            {/* Interest Rates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-none border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-white/60" />
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Regular Rate</p>
                </div>
                <p className="text-3xl font-bold text-white" data-testid="text-interest-rate">
                  {fdScheme.interestRate}%
                </p>
                <p className="text-xs text-white/50 mt-1 font-light">per annum</p>
              </div>
              {fdScheme.seniorCitizenRate && (
                <div className="bg-white/5 p-4 rounded-none border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-white/60" />
                    <p className="text-xs text-white/60 uppercase tracking-widest font-light">Senior Citizen</p>
                  </div>
                  <p className="text-3xl font-bold text-white" data-testid="text-senior-rate">
                    {fdScheme.seniorCitizenRate}%
                  </p>
                  <p className="text-xs text-white/50 mt-1 font-light">per annum</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-none p-1 h-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-calculator"
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger
              value="my-fds"
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-my-fds"
            >
              My FDs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Key Details */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Key Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Minimum Amount</p>
                    <p className="text-white font-bold" data-testid="text-min-amount">
                      ₹{fdScheme.minAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Maximum Amount</p>
                    <p className="text-white font-bold" data-testid="text-max-amount">
                      ₹{fdScheme.maxAmount?.toLocaleString() || "No limit"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Minimum Tenure</p>
                    <p className="text-white font-bold" data-testid="text-min-tenure">
                      {fdScheme.minTenure} months
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Maximum Tenure</p>
                    <p className="text-white font-bold" data-testid="text-max-tenure">
                      {fdScheme.maxTenure} months
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Compounding</p>
                    <p className="text-white font-bold capitalize" data-testid="text-compounding">
                      {fdScheme.compoundingFrequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Interest Payout</p>
                    <p className="text-white font-bold capitalize" data-testid="text-payout">
                      {fdScheme.interestPayoutFrequency?.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Features & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fdScheme.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 bg-white/10 border border-white/20 rounded-none mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-white/80 font-light" data-testid={`text-feature-${index}`}>{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                {fdScheme.prematureWithdrawalAllowed === 1 && (
                  <div>
                    <p className="font-semibold text-white/90 mb-1">Premature Withdrawal</p>
                    <p>Allowed with a penalty of {fdScheme.prematureWithdrawalPenalty}% on interest earned</p>
                  </div>
                )}
                {fdScheme.loanAgainstFdAllowed === 1 && (
                  <div>
                    <p className="font-semibold text-white/90 mb-1">Loan Against FD</p>
                    <p>Available up to {fdScheme.loanPercentage}% of the FD value</p>
                  </div>
                )}
                {fdScheme.tdsApplicable === 1 && (
                  <div>
                    <p className="font-semibold text-white/90 mb-1">TDS Applicability</p>
                    <p>TDS is deducted if interest earned exceeds ₹40,000 per year (₹50,000 for senior citizens)</p>
                  </div>
                )}
                {fdScheme.nomineeRequired === 1 && (
                  <div>
                    <p className="font-semibold text-white/90 mb-1">Nomination</p>
                    <p>Nominee details are mandatory for amounts above ₹5,00,000</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="mt-6 space-y-6">
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  FD Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Principal Amount */}
                <div className="space-y-2">
                  <Label className="text-white/70">Principal Amount (₹)</Label>
                  <Input
                    type="number"
                    value={calcPrincipal}
                    onChange={(e) => setCalcPrincipal(e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-lg font-bold"
                    data-testid="input-principal"
                  />
                  <p className="text-xs text-white/50">
                    Min: ₹{fdScheme.minAmount.toLocaleString()} | Max: ₹{fdScheme.maxAmount?.toLocaleString()}
                  </p>
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <Label className="text-white/70">Tenure (months)</Label>
                  <Select value={calcTenure} onValueChange={setCalcTenure}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-tenure">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      {fdScheme.tenureOptions.map((tenure) => (
                        <SelectItem key={tenure} value={tenure.toString()}>
                          {tenure} months ({(tenure / 12).toFixed(1)} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Interest Type */}
                <div className="space-y-2">
                  <Label className="text-white/70">Interest Type</Label>
                  <Select value={calcInterestType} onValueChange={(v: any) => setCalcInterestType(v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-interest-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="simple">Simple Interest</SelectItem>
                      <SelectItem value="compound">Compound Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-white/10" />

                {/* Results */}
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-none border border-white/20">
                    <p className="text-white/60 text-sm mb-2 uppercase tracking-widest font-light">Principal Amount</p>
                    <p className="text-2xl font-bold text-white" data-testid="text-calc-principal">
                      ₹{calculatedAmounts.principal.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-none border border-white/20">
                    <p className="text-white/60 text-sm mb-2 uppercase tracking-widest font-light">Interest Earned</p>
                    <p className="text-2xl font-bold text-white" data-testid="text-calc-interest">
                      ₹{calculatedAmounts.interest.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-none border border-white/20">
                    <p className="text-white/60 text-sm mb-2 uppercase tracking-widest font-light">Maturity Amount</p>
                    <p className="text-3xl font-bold text-white" data-testid="text-calc-maturity">
                      ₹{calculatedAmounts.maturity.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center text-xs text-white/50 mt-4">
                    <p>Interest Rate: {fdScheme.interestRate}% p.a.</p>
                    <p>Compounding: {fdScheme.compoundingFrequency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My FDs Tab */}
          <TabsContent value="my-fds" className="mt-6 space-y-6">
            {userFDs.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60 mb-2">No active FDs</p>
                  <p className="text-sm text-white/40 mb-4">Start investing in fixed deposits for guaranteed returns</p>
                  <Button
                    onClick={() => setBuyDialogOpen(true)}
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-invest-empty"
                  >
                    Invest Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {userFDs.map((fd) => (
                  <Card key={fd.id} className="bg-white/5 border border-white/10 rounded-none" data-testid={`card-user-fd-${fd.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-white/50 text-xs mb-1">FD Number</p>
                          <p className="text-white font-bold" data-testid={`text-fd-number-${fd.id}`}>
                            {fd.fdNumber}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            fd.status === "active"
                              ? "bg-white/10 text-white border-white/20"
                              : "bg-white/10 text-white/50 border-white/20"
                          )}
                          data-testid={`badge-status-${fd.id}`}
                        >
                          {fd.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-white/50 text-xs mb-1">Principal</p>
                          <p className="text-white font-bold" data-testid={`text-principal-${fd.id}`}>
                            ₹{fd.principalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs mb-1">Maturity Amount</p>
                          <p className="text-white font-bold" data-testid={`text-maturity-${fd.id}`}>
                            ₹{fd.maturityAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs mb-1">Interest Rate</p>
                          <p className="text-white font-bold" data-testid={`text-rate-${fd.id}`}>
                            {fd.interestRate}% p.a.
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs mb-1">Tenure</p>
                          <p className="text-white font-bold" data-testid={`text-tenure-${fd.id}`}>
                            {fd.tenure} months
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-white/10 my-4" />

                      <div className="flex items-center justify-between text-sm mb-4">
                        <div>
                          <p className="text-white/50 text-xs mb-1">Maturity Date</p>
                          <p className="text-white font-semibold" data-testid={`text-maturity-date-${fd.id}`}>
                            {new Date(fd.maturityDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs mb-1">Days Remaining</p>
                          <p className="text-white font-semibold">
                            {Math.ceil((new Date(fd.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 rounded-none text-xs"
                          data-testid={`button-pay-${fd.id}`}
                          onClick={() => setPayDialogOpen(true)}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Pay Interest
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 rounded-none text-xs"
                          data-testid={`button-download-${fd.id}`}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Certificate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 rounded-none text-xs"
                          data-testid={`button-close-${fd.id}`}
                          onClick={() => setCloseDialogOpen(true)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Close
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="bg-black border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Invest in Fixed Deposit</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete the details to invest in {fdScheme.bankName} Fixed Deposit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white/70">Investment Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                defaultValue={calcPrincipal}
                className="bg-white/5 border-white/10 text-white mt-2"
                data-testid="input-buy-amount"
              />
            </div>
            <div>
              <Label className="text-white/70">Tenure</Label>
              <Select defaultValue="12">
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2" data-testid="select-buy-tenure">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {fdScheme.tenureOptions.map((tenure) => (
                    <SelectItem key={tenure} value={tenure.toString()}>
                      {tenure} months
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/70">Payment Method</Label>
              <Select defaultValue="upi">
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2" data-testid="select-payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="upi">UPI Payment</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBuyDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-cancel-buy"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Investment Initiated",
                  description: "Processing your FD investment...",
                });
                setBuyDialogOpen(false);
              }}
              className="bg-white text-black hover:bg-white/90"
              data-testid="button-confirm-buy"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Proceed to Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="bg-black border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Pay Interest</DialogTitle>
            <DialogDescription className="text-white/60">
              Make an additional payment or pay interest dues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white/70">Payment Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="bg-white/5 border-white/10 text-white mt-2"
                data-testid="input-pay-amount"
              />
            </div>
            <div>
              <Label className="text-white/70">Payment Method</Label>
              <Select defaultValue="upi">
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2" data-testid="select-pay-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="upi">UPI Payment</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-cancel-pay"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Payment Successful",
                  description: "Your payment has been processed",
                });
                setPayDialogOpen(false);
              }}
              className="bg-white text-black hover:bg-white/90"
              data-testid="button-confirm-pay"
            >
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="bg-black border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-white/60" />
              Close Fixed Deposit
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to close this FD before maturity? Premature closure will attract a penalty.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 text-sm">
            <div className="bg-white/5 p-3 rounded-none border border-white/20">
              <p className="text-white font-semibold mb-1">Penalty Charges</p>
              <p className="text-white/70">
                {fdScheme.prematureWithdrawalPenalty}% penalty on interest earned will be deducted
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/10">
              <p className="text-white/70">
                You will receive the principal amount along with reduced interest after penalty deduction.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCloseDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-cancel-close"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "FD Closed",
                  description: "Your fixed deposit has been closed successfully",
                  variant: "destructive",
                });
                setCloseDialogOpen(false);
              }}
              className="bg-white text-black hover:bg-white/90 rounded-none"
              data-testid="button-confirm-close"
            >
              Close FD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={() => setBuyDialogOpen(true)}
            className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-light tracking-wider rounded-none"
            data-testid="button-invest-now"
          >
            <BadgeIndianRupee className="h-5 w-5 mr-2" />
            INVEST NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
