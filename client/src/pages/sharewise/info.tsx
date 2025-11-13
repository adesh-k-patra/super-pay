import { ArrowLeft, Check, Users, Shield, Zap, DollarSign, Clock, AlertTriangle, TrendingUp, Target, BarChart3, Activity, Split, Calculator, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ShareWiseInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Users, 
      title: "GROUP EXPENSE MANAGEMENT", 
      desc: "Create unlimited groups for trips, roommates, events, or any shared expenses with friends and family.",
      highlight: "Unlimited groups"
    },
    { 
      icon: Split, 
      title: "SMART SPLIT OPTIONS", 
      desc: "Split equally, by percentage, exact amounts, or custom shares. Multiple split types for every situation.",
      highlight: "Flexible splits"
    },
    { 
      icon: Calculator, 
      title: "AUTOMATIC CALCULATIONS", 
      desc: "Instantly see who owes whom with simplified settlement suggestions that minimize transactions.",
      highlight: "Auto-balance"
    },
    { 
      icon: Receipt, 
      title: "EXPENSE TRACKING", 
      desc: "Add expenses with categories, notes, and attachments. Track every shared cost in one place.",
      highlight: "Detailed tracking"
    },
    { 
      icon: BarChart3, 
      title: "GROUP ANALYTICS", 
      desc: "View spending trends, category breakdowns, and individual contributions with visual charts.",
      highlight: "Smart insights"
    },
    { 
      icon: Clock, 
      title: "SETTLEMENT HISTORY", 
      desc: "Complete settlement tracking with payment methods, dates, and automatic balance updates.",
      highlight: "Full history"
    },
  ];

  const steps = [
    { step: "1", title: "Create Group", desc: "Start a new group with a name and description" },
    { step: "2", title: "Add Members", desc: "Invite friends and family to join your group" },
    { step: "3", title: "Track Expenses", desc: "Add shared costs as they happen" },
    { step: "4", title: "Settle Up", desc: "See balances and record payments easily!" }
  ];

  const terms = [
    { label: "Groups", desc: "Create unlimited expense groups", value: "Unlimited" },
    { label: "Members", desc: "Add multiple people per group", value: "Unlimited" },
    { label: "Expense Categories", desc: "Food, transport, accommodation, utilities, etc.", value: "15+ categories" },
    { label: "Split Methods", desc: "Equal, percentage, exact amount, custom", value: "4 methods" },
    { label: "Settlement Tracking", desc: "Complete payment history with notes", value: "Full tracking" },
    { label: "Data Security", desc: "Your financial data is encrypted and private", value: "Bank-grade" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sharewise/groups")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SHAREWISE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Information & Features</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              SHAREWISE
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Split Bills. Track Expenses. Settle Easily.
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">ShareWise</span> makes splitting shared expenses effortless. Create groups, add expenses, and see who owes what instantly. Perfect for trips, roommates, couples, and friends sharing costs.
            </p>
          </div>
        </div>

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

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Get Started in 4 Simple Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Start tracking shared expenses in under 2 minutes</p>
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

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Check className="h-4 w-4" />
            Why Choose ShareWise
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "No More Awkwardness", desc: "Clear records of who owes what" },
                { title: "Save Time", desc: "Automatic calculations and balances" },
                { title: "Stay Organized", desc: "All shared expenses in one place" },
                { title: "Fair Splits", desc: "Multiple ways to divide costs fairly" },
                { title: "Complete Privacy", desc: "Your data is secure and encrypted" },
                { title: "Easy Settlements", desc: "Simplified payment suggestions" },
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

        <div className="border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-white tracking-wider uppercase">Important Notice</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                ShareWise is a tool to help you track and split shared expenses among trusted friends and family. It does not process actual payments or transfers. Users are responsible for settling balances through their preferred payment methods. All expense data is stored securely and is only visible to group members.
              </p>
              <p className="text-[11px] text-white/50 font-light">
                For queries, contact support at <span className="text-white">support@instapay.com</span> or call <span className="text-white">1800-XXX-XXXX</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={() => navigate("/sharewise/groups")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          START SPLITTING
        </Button>
      </div>
    </div>
  );
}
