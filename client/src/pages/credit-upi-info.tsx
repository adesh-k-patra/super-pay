import { ArrowLeft, Check, CreditCard, Shield, Zap, DollarSign, Clock, AlertTriangle, TrendingUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function CreditUpiInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Zap, 
      title: "INSTANT ACCESS", 
      desc: "Credit limit is linked directly to your Instapay UPI ID. Use it the moment you need it, 24/7, with zero waiting time.",
      highlight: "No pre-authorization required"
    },
    { 
      icon: CreditCard, 
      title: "USE ANYWHERE", 
      desc: "Works with any Person-to-Merchant (P2M) UPI QR or online merchant. Pay for groceries, fuel, shopping instantly.",
      highlight: "50M+ merchants across India"
    },
    { 
      icon: DollarSign, 
      title: "PAY ONLY FOR USE", 
      desc: "Interest is charged only on the amount utilized and the duration for which it is outstanding.",
      highlight: "Zero maintenance charges"
    },
    { 
      icon: Shield, 
      title: "DEDICATED UPI PIN", 
      desc: "Set a unique 6-digit UPI PIN specifically for Credit UPI transactions. Enhanced security with encryption.",
      highlight: "Never stored on servers"
    },
    { 
      icon: Clock, 
      title: "FLEXIBLE REPAYMENT", 
      desc: "Choose to repay the outstanding amount in full monthly or convert larger spends into easy EMIs.",
      highlight: "15-day grace period"
    },
  ];

  const eligibility = [
    { title: "Citizenship", desc: "Must be an Indian Citizen with valid identity proof" },
    { title: "Age", desc: "18 years or older (up to 65 years for new applications)" },
    { title: "Credit Profile", desc: "Minimum CIBIL Score of 730 is highly recommended" },
    { title: "KYC", desc: "Valid PAN and Aadhaar linked to registered mobile number" },
    { title: "Bank Account", desc: "Active UPI-linked bank account with 6 months history" },
    { title: "Income Proof", desc: "Last 3 months salary slips or ITR for past 6 months" },
  ];

  const steps = [
    { step: "1", title: "Check Offer", desc: "View your pre-approved limit based on credit score and income" },
    { step: "2", title: "Verify & Consent", desc: "Complete Aadhaar OTP verification and e-signature" },
    { step: "3", title: "Link Account", desc: "Credit Line automatically linked to your UPI ID" },
    { step: "4", title: "Set PIN", desc: "Set 6-digit UPI PIN. Credit line is now active!" }
  ];

  const fees = [
    { label: "Credit Limit", desc: "Pre-sanctioned limit, reviewed monthly", value: "₹1,000 to ₹1,00,000" },
    { label: "Annual Fee", desc: "Waived if annual spending > ₹25,000", value: "₹499" },
    { label: "Processing Fee", desc: "One-time charge upon activation", value: "1.5% of limit" },
    { label: "Interest Rate", desc: "APR on utilized amount if not repaid", value: "18% to 36% p.a." },
    { label: "Late Payment", desc: "Charged if payment not received by due", value: "3% (Min. ₹200)" },
    { label: "EMI Conversion", desc: "For transactions above ₹5,000", value: "Lower APR rate" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - Rental Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/credit-upi")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CREDIT UPI</h1>
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
              CREDIT UPI
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Your Pre-Approved Credit, Instant Access
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              Instapay, in partnership with Innovate Bank, brings you <span className="font-medium text-white">Instapay Credit UPI</span>—a digital-first line of credit seamlessly integrated into your UPI app.
            </p>
          </div>
        </div>

        {/* Key Features - Multi-option Style */}
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

        {/* Eligibility - Card Style */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Check className="h-4 w-4" />
            Eligibility Criteria
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eligibility.map((item, idx) => (
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

        {/* Onboarding Steps - Cardless Grid */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Instant Onboarding in 4 Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">100% digital process in less than 3 minutes for pre-approved users</p>
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

        {/* Repayment Cycle - Card Style */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Repayment Cycle & Grace Period
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-3">
            <div className="space-y-1">
              <h5 className="font-medium text-xs uppercase tracking-wider text-white">Billing Date</h5>
              <p className="text-white/60 text-[11px] font-light leading-relaxed">Statement generated on <span className="text-white font-medium">1st of every month</span> with complete transaction details</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-medium text-xs uppercase tracking-wider text-white">Due Date</h5>
              <p className="text-white/60 text-[11px] font-light leading-relaxed"><span className="text-white font-medium">15-day grace period</span> to repay. Due date is the <span className="text-white font-medium">16th</span> of each month</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-medium text-xs uppercase tracking-wider text-white">Interest-Free Period</h5>
              <p className="text-white/60 text-[11px] font-light leading-relaxed">Utilized funds are <span className="text-white font-medium">interest-free if repaid in full by due date</span></p>
            </div>
          </div>
        </div>

        {/* Fees - Multi-option Style */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Conditions & Fees
          </label>
          <div className="space-y-0">
            {fees.map((fee, idx) => (
              <div
                key={idx}
                className="w-full p-3 border-b border-white/10 hover:border-white/30 transition-all"
                data-testid={`fee-${idx}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium tracking-wider text-xs text-white">{fee.label}</h4>
                  <Badge className="rounded-none border bg-white/20 text-white border-white/30 font-light text-[10px] px-2 py-0.5">
                    {fee.value}
                  </Badge>
                </div>
                <p className="text-[11px] text-white/50 font-light leading-relaxed">{fee.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice - Card Style */}
        <div className="border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-white tracking-wider uppercase">Important Notice</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Credit UPI is a line of credit and must be repaid as per agreed terms. Failure to repay on time may affect your credit score and result in additional charges. Please borrow responsibly and only what you can repay.
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
          onClick={() => navigate("/credit-upi")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-activate"
        >
          CHECK ELIGIBILITY & ACTIVATE
        </Button>
      </div>
    </div>
  );
}
