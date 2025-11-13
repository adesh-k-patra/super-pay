import { ArrowLeft, Check, Shield, Zap, Clock, AlertTriangle, TrendingUp, Scan, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function SecurityInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Scan, 
      title: "AI-POWERED DETECTION", 
      desc: "Advanced machine learning algorithms analyze call patterns, message content, and links to detect fraudulent activities in real-time.",
      highlight: "98% accuracy rate"
    },
    { 
      icon: Phone, 
      title: "CALLER VERIFICATION", 
      desc: "Instant verification of phone numbers against RBI's registered lender database and TrueCaller spam reports.",
      highlight: "Real-time verification"
    },
    { 
      icon: MessageCircle, 
      title: "MESSAGE ANALYSIS", 
      desc: "Scans loan offer messages and links for suspicious patterns, fake company claims, and phishing attempts.",
      highlight: "Comprehensive scanning"
    },
    { 
      icon: ShieldCheck, 
      title: "FRAUD DATABASE", 
      desc: "Cross-references against our updated database of 50,000+ reported fraud cases and spam numbers.",
      highlight: "Updated daily"
    },
    { 
      icon: Clock, 
      title: "INSTANT REPORTS", 
      desc: "Get detailed fraud analysis reports within seconds with actionable recommendations and risk scores.",
      highlight: "< 5 seconds"
    },
  ];

  const howItWorks = [
    { title: "Data Collection", desc: "Input phone number, message, or link you want to verify" },
    { title: "Pattern Analysis", desc: "AI analyzes communication patterns and cross-checks databases" },
    { title: "Risk Assessment", desc: "Generates risk score based on multiple fraud indicators" },
    { title: "Detailed Report", desc: "Provides comprehensive report with company info and recommendations" },
    { title: "Community Protection", desc: "Your reports help protect others from similar scams" },
  ];

  const steps = [
    { step: "1", title: "Input Details", desc: "Enter phone number, paste message, or provide suspicious link" },
    { step: "2", title: "Scan & Analyze", desc: "Our AI scans against fraud databases and analyzes patterns" },
    { step: "3", title: "Get Report", desc: "Receive detailed report with trust score and company info" },
    { step: "4", title: "Take Action", desc: "Block number, report to authorities, or proceed safely" }
  ];

  const indicators = [
    { label: "Trust Score", desc: "Overall safety rating from 0-100", value: "0-100 scale" },
    { label: "Spam Reports", desc: "Number of community spam reports", value: "Real-time data" },
    { label: "Company Status", desc: "RBI registration and legal status", value: "Verified info" },
    { label: "Call Pattern", desc: "Frequency and timing of calls", value: "Behavioral analysis" },
    { label: "Message Content", desc: "Language, urgency, and claim analysis", value: "AI detection" },
    { label: "Link Safety", desc: "Website legitimacy and SSL verification", value: "URL scanning" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - Rental Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/security")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SECURITY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Fraud Detection Information</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        {/* Hero Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              FRAUD DETECTION
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              AI-Powered Loan Scam Protection
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              Instapay's <span className="font-medium text-white">Security Scanner</span> uses advanced AI to protect you from loan fraud, fake lenders, and financial scams. Verify callers, scan messages, and check links instantly.
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

        {/* How It Works - Card Style */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Check className="h-4 w-4" />
            How It Works
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {howItWorks.map((item, idx) => (
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
            Using Fraud Detection in 4 Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Get instant fraud analysis in less than 5 seconds</p>
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

        {/* Fraud Indicators - Multi-option Style */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Fraud Detection Indicators
          </label>
          <div className="space-y-0">
            {indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="w-full p-3 border-b border-white/10 hover:border-white/30 transition-all"
                data-testid={`indicator-${idx}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium tracking-wider text-xs text-white">{indicator.label}</h4>
                  <Badge className="rounded-none border bg-white/20 text-white border-white/30 font-light text-[10px] px-2 py-0.5">
                    {indicator.value}
                  </Badge>
                </div>
                <p className="text-[11px] text-white/50 font-light leading-relaxed">{indicator.desc}</p>
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
                This fraud detection tool is for informational purposes only. While we strive for accuracy, always verify lender credentials independently. Report suspected fraud to local authorities and TRAI (1800-110-420). Never share OTP, passwords, or personal banking details over calls or messages.
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
          onClick={() => navigate("/security")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-start-scanning"
        >
          START SCANNING FOR FRAUD
        </Button>
      </div>
    </div>
  );
}
