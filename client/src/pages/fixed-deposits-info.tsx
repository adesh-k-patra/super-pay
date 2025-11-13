import { ArrowLeft, Check, Building2, Shield, Zap, DollarSign, Clock, AlertTriangle, TrendingUp, Target, Percent, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function FixedDepositsInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Percent, 
      title: "COMPETITIVE INTEREST RATES", 
      desc: "Earn up to 8.25% annual interest on fixed deposits from top banks and financial institutions.",
      highlight: "Up to 8.25% p.a."
    },
    { 
      icon: Shield, 
      title: "100% SECURE DEPOSITS", 
      desc: "Your deposits are insured and backed by RBI-regulated banks with guaranteed returns.",
      highlight: "RBI protected"
    },
    { 
      icon: Building2, 
      title: "MULTIPLE BANK OPTIONS", 
      desc: "Choose from 20+ leading banks including HDFC, SBI, ICICI, and more for best rates.",
      highlight: "20+ banks"
    },
    { 
      icon: DollarSign, 
      title: "TAX SAVING OPTIONS", 
      desc: "Save up to ₹1.5L under Section 80C with tax-saving fixed deposit schemes.",
      highlight: "80C benefits"
    },
    { 
      icon: Clock, 
      title: "FLEXIBLE TENURE", 
      desc: "Choose tenure from 7 days to 10 years based on your financial goals and requirements.",
      highlight: "7 days - 10 years"
    },
  ];

  const steps = [
    { step: "1", title: "Choose FD", desc: "Select from 20+ banks with best interest rates" },
    { step: "2", title: "Enter Amount", desc: "Invest minimum ₹1000 or more as per bank terms" },
    { step: "3", title: "Select Tenure", desc: "Pick duration from 7 days to 10 years" },
    { step: "4", title: "Complete KYC", desc: "Submit documents and start earning interest!" }
  ];

  const terms = [
    { label: "Minimum Deposit", desc: "Starting investment amount", value: "₹1,000" },
    { label: "Interest Rate Range", desc: "Annual percentage rate offered", value: "6.5% - 8.25%" },
    { label: "Senior Citizen Bonus", desc: "Additional interest for seniors", value: "+0.5% p.a." },
    { label: "Premature Withdrawal", desc: "Early withdrawal with penalty", value: "Available" },
    { label: "Tax Deduction", desc: "Section 80C benefit on tax saver FD", value: "Up to ₹1.5L" },
    { label: "Auto Renewal", desc: "Automatic renewal at maturity", value: "Available" },
  ];

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
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FIXED DEPOSITS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Information & Features</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        {/* Hero Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              FIXED DEPOSITS
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Secure Investment with Guaranteed Returns
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">Fixed Deposits</span> offer safe and guaranteed returns on your investments. Compare rates from 20+ banks, choose flexible tenure, and earn up to 8.25% interest with complete security.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Key Features
          </label>
          <div className="space-y-0">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="w-full p-4 border-b border-white/10 hover:border-white/30 transition-all"
                  data-testid={`feature-${idx}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 border border-white/20 rounded-none p-2.5 flex-shrink-0">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h4 className="text-sm font-medium uppercase tracking-wider text-white">{feature.title}</h4>
                        <Badge className="rounded-none border bg-white/10 text-white/60 border-white/20 font-light text-[10px] px-2 py-0.5">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-xs font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Use */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Get Started in 4 Simple Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Open your FD in minutes with instant approval</p>
          <div className="grid grid-cols-2 gap-3">
            {steps.map((item, idx) => (
              <div key={idx} className="border border-white/10 p-3" data-testid={`step-${item.step}`}>
                <div className="space-y-2">
                  <div className="w-8 h-8 border border-white/30 bg-white/5 flex items-center justify-center text-sm font-light">
                    {item.step}
                  </div>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-white">{item.title}</h4>
                  <p className="text-white/60 text-[11px] font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Terms & Conditions
          </label>
          <div className="space-y-0">
            {terms.map((term, idx) => (
              <div
                key={idx}
                className="w-full p-3 border-b border-white/10 hover:border-white/30 transition-all"
                data-testid={`term-${idx}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium tracking-wider text-xs text-white">{term.label}</h4>
                  <Badge className="rounded-none border bg-white/20 text-white border-white/30 font-light text-[10px] px-2 py-0.5">
                    {term.value}
                  </Badge>
                </div>
                <p className="text-[11px] text-white/50 font-light leading-relaxed">{term.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Summary */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Check className="h-4 w-4" />
            Why Choose Fixed Deposits
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Guaranteed Returns", desc: "Fixed interest rate assured throughout tenure" },
                { title: "Low Risk Investment", desc: "DICGC insured up to ₹5 lakh per bank" },
                { title: "Tax Benefits", desc: "Save taxes with 80C compliant FDs" },
                { title: "Senior Citizen Bonus", desc: "Extra 0.5% interest for senior citizens" },
                { title: "Loan Against FD", desc: "Get instant loan up to 90% of FD value" },
                { title: "Flexible Payout", desc: "Choose monthly, quarterly or maturity payout" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-medium uppercase tracking-wider text-xs text-white">{item.title}</h5>
                    <p className="text-white/60 text-[11px] font-light mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-white tracking-wider uppercase">Important Notice</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Interest rates are subject to change based on RBI monetary policy. Premature withdrawal may attract penalty charges. Tax deduction available only on 5-year tax-saver FDs. Please verify bank credentials before investing.
              </p>
              <p className="text-[11px] text-white/50 font-light">
                For queries, contact support at <span className="text-white">support@instapay.com</span> or call <span className="text-white">1800-XXX-XXXX</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={() => navigate("/fixed-deposits")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          EXPLORE FIXED DEPOSITS
        </Button>
      </div>
    </div>
  );
}
