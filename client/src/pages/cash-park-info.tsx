import { ArrowLeft, Check, PiggyBank, Shield, Zap, DollarSign, Clock, AlertTriangle, TrendingUp, Target, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function CashParkInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: TrendingUp, 
      title: "HIGH INTEREST RATE", 
      desc: "Earn 7.25% annual interest on your savings, higher than regular savings accounts.",
      highlight: "7.25% p.a."
    },
    { 
      icon: Coins, 
      title: "MULTIPLE JARS", 
      desc: "Organize your savings into different jars for various goals - vacation, emergency fund, shopping.",
      highlight: "Unlimited jars"
    },
    { 
      icon: DollarSign, 
      title: "100% LIQUIDITY", 
      desc: "Withdraw anytime without penalties or lock-in periods. Your money is always accessible.",
      highlight: "Zero lock-in"
    },
    { 
      icon: Shield, 
      title: "BANK-GRADE SECURITY", 
      desc: "Your funds are protected with bank-grade encryption and monitored 24/7 for security.",
      highlight: "RBI regulated"
    },
    { 
      icon: Clock, 
      title: "DAILY INTEREST", 
      desc: "Interest is calculated daily and credited automatically to your jars.",
      highlight: "Auto-credited"
    },
  ];

  const steps = [
    { step: "1", title: "Set UPI PIN", desc: "Set a secure 6-digit PIN for Cash Park transactions" },
    { step: "2", title: "Create Jars", desc: "Create multiple jars for different savings goals" },
    { step: "3", title: "Add Money", desc: "Deposit money using UPI from your bank account" },
    { step: "4", title: "Earn Interest", desc: "Watch your savings grow with daily interest credits!" }
  ];

  const terms = [
    { label: "Interest Rate", desc: "Annual percentage rate on all balances", value: "7.25% p.a." },
    { label: "Minimum Balance", desc: "No minimum balance required", value: "₹0" },
    { label: "Withdrawal", desc: "Instant withdrawal to main account", value: "Free" },
    { label: "Lock-in Period", desc: "No lock-in, withdraw anytime", value: "None" },
    { label: "Interest Credit", desc: "Calculated daily, credited automatically", value: "Daily" },
    { label: "Maximum Jars", desc: "Create unlimited jars for goals", value: "Unlimited" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cash-park")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CASH PARK</h1>
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
              CASH PARK
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Smart Savings with Multiple Jars
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">Cash Park</span> helps you organize and grow your savings by creating multiple jars for different goals. Earn high interest while maintaining complete liquidity and access to your funds.
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
          <p className="text-white/50 text-[11px] font-light">Start saving smarter in less than 2 minutes</p>
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

        {/* Interest & Benefits */}
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
            Why Choose Cash Park
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Flexible Savings", desc: "Create jars for any goal - vacation, emergency, shopping" },
                { title: "High Returns", desc: "Earn 7.25% interest, better than savings accounts" },
                { title: "Complete Control", desc: "Withdraw anytime without penalties" },
                { title: "Daily Interest", desc: "Watch your money grow every single day" },
                { title: "Zero Fees", desc: "No maintenance charges or hidden fees" },
                { title: "Secure", desc: "Bank-grade security with RBI regulation" },
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
                Interest rates are subject to change based on market conditions. Early withdrawal before 7 days may result in lower interest rates. Your deposits are insured and backed by partner banks regulated by RBI.
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
          onClick={() => navigate("/cash-park")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          GET STARTED WITH CASH PARK
        </Button>
      </div>
    </div>
  );
}
