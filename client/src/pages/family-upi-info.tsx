import { ArrowLeft, Check, Users, Shield, Zap, DollarSign, Clock, AlertTriangle, TrendingUp, Target, UserPlus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function FamilyUpiInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Users, 
      title: "MULTI-SIGNATORY SUPPORT", 
      desc: "Create shared UPI accounts with family members for better expense management and transparency.",
      highlight: "Up to 3 accounts"
    },
    { 
      icon: Shield, 
      title: "PARENTAL OVERSIGHT", 
      desc: "Set spending limits, approve transactions, and monitor family member activities in real-time.",
      highlight: "Full control"
    },
    { 
      icon: DollarSign, 
      title: "SPENDING LIMITS", 
      desc: "Configure daily and monthly spending limits for each family member to manage expenses.",
      highlight: "Custom limits"
    },
    { 
      icon: Eye, 
      title: "TRANSACTION VISIBILITY", 
      desc: "Track all family transactions with detailed history and member-wise spending reports.",
      highlight: "Complete transparency"
    },
    { 
      icon: UserPlus, 
      title: "EASY MEMBER MANAGEMENT", 
      desc: "Add, remove, or modify family member permissions and roles with a few taps.",
      highlight: "Simple setup"
    },
  ];

  const steps = [
    { step: "1", title: "Create Account", desc: "Set up a Family UPI account linked to your bank" },
    { step: "2", title: "Add Members", desc: "Invite family members with specific roles and limits" },
    { step: "3", title: "Set Permissions", desc: "Configure approval rights and spending limits" },
    { step: "4", title: "Start Sharing", desc: "Begin sharing expenses with family seamlessly!" }
  ];

  const terms = [
    { label: "Maximum Accounts", desc: "Total family UPI accounts you can create", value: "3 Accounts" },
    { label: "Members per Account", desc: "Maximum members in each account", value: "Unlimited" },
    { label: "Daily Limit", desc: "Customizable per member", value: "Up to ₹1L" },
    { label: "Monthly Limit", desc: "Customizable per account", value: "Up to ₹5L" },
    { label: "Transaction Fees", desc: "No charges for family UPI payments", value: "Free" },
    { label: "Approval System", desc: "Configure who can approve transactions", value: "Flexible" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/family-upi")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FAMILY UPI</h1>
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
              FAMILY UPI
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Shared Account Management
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">Family UPI</span> enables you to create shared payment accounts with family members. Set spending limits, approve transactions, and maintain complete visibility over family expenses.
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
          <p className="text-white/50 text-[11px] font-light">Set up your family UPI account in minutes</p>
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
            Why Choose Family UPI
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Shared Responsibility", desc: "Distribute expenses among family members easily" },
                { title: "Better Control", desc: "Set limits and approve transactions as needed" },
                { title: "Complete Visibility", desc: "Track all family spending in one place" },
                { title: "Secure Access", desc: "Bank-grade security with role-based permissions" },
                { title: "Zero Charges", desc: "No additional fees for family UPI accounts" },
                { title: "Easy Management", desc: "Add or remove members anytime" },
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
                Family UPI accounts are subject to NPCI guidelines. All members must comply with KYC requirements. The account owner is ultimately responsible for all transactions. Ensure you only add trusted family members to your account.
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
          onClick={() => navigate("/family-upi")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          GET STARTED WITH FAMILY UPI
        </Button>
      </div>
    </div>
  );
}
