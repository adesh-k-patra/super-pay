import { ArrowLeft, Check, TrendingUp, Clock, AlertTriangle, CreditCard, Building, Award, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

export default function MyReportInfo() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();

  const features = [
    { 
      icon: BarChart3, 
      title: "COMPREHENSIVE ANALYSIS", 
      desc: "Get detailed insights into your credit score, payment history, credit utilization, and all active accounts in one consolidated report.",
      highlight: "850-point scale"
    },
    { 
      icon: TrendingUp, 
      title: "SCORE IMPROVEMENT TIPS", 
      desc: "Receive personalized recommendations to improve your credit score by up to 30 points within 90 days.",
      highlight: "+30 points boost"
    },
    { 
      icon: Shield, 
      title: "FRAUD ALERTS", 
      desc: "Get instant notifications about suspicious activities, unauthorized inquiries, and potential identity theft attempts.",
      highlight: "Real-time monitoring"
    },
    { 
      icon: CreditCard, 
      title: "DEBT MANAGEMENT", 
      desc: "Track all loans, credit cards, and EMIs with smart insights on reducing debt and improving repayment efficiency.",
      highlight: "All accounts tracked"
    },
    { 
      icon: Clock, 
      title: "MONTHLY UPDATES", 
      desc: "Automatically updated credit report every month with trend analysis and progress tracking over time.",
      highlight: "Auto-refresh"
    },
  ];

  const howItWorks = [
    { title: "Data Aggregation", desc: "Pulls credit data from CIBIL, Experian, and Equifax bureaus" },
    { title: "Score Calculation", desc: "Analyzes payment history, credit mix, and utilization patterns" },
    { title: "Risk Assessment", desc: "Identifies factors negatively impacting your credit health" },
    { title: "Personalized Tips", desc: "Generates actionable recommendations for score improvement" },
    { title: "Progress Tracking", desc: "Monitors changes and helps you achieve financial goals" },
  ];

  const steps = [
    { step: "1", title: "Access Report", desc: "View your comprehensive credit analysis and current score" },
    { step: "2", title: "Review Insights", desc: "Check payment history, utilization, and account details" },
    { step: "3", title: "Follow Tips", desc: "Implement personalized recommendations to boost score" },
    { step: "4", title: "Track Progress", desc: "Monitor improvements and achieve better financial health" }
  ];

  const indicators = [
    { label: "Credit Score", desc: "Your overall creditworthiness rating", value: "300 to 850" },
    { label: "Payment History", desc: "On-time payment track record percentage", value: "0% to 100%" },
    { label: "Credit Utilization", desc: "Percentage of credit limit currently used", value: "Below 30% ideal" },
    { label: "Account Age", desc: "Average age of all credit accounts", value: "Years/Months" },
    { label: "Hard Inquiries", desc: "Number of credit checks in last 12 months", value: "Count" },
    { label: "Credit Mix", desc: "Variety of loan and card types", value: "Diversity score" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - Rental Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CREDIT REPORT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">CreditPro Information</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        {/* Hero Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              CREDITPRO REPORT
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Boost Your Credit Score +30 Points
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              Instapay's <span className="font-medium text-white">CreditPro Report</span> provides comprehensive credit analysis with personalized recommendations to improve your financial health and unlock better loan rates.
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
            <TrendingUp className="h-4 w-4" />
            Using CreditPro in 4 Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Track and improve your credit score effectively</p>
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

        {/* Credit Indicators - Multi-option Style */}
        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Credit Score Factors
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
                Credit reports are sourced from authorized credit bureaus (CIBIL, Experian, Equifax). Scores may vary slightly between bureaus. Improving your credit score requires consistent financial discipline and responsible credit behavior. Results may vary based on individual financial circumstances.
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
          onClick={() => navigate("/myreport")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-view-report"
        >
          VIEW MY CREDIT REPORT
        </Button>
      </div>
    </div>
  );
}
