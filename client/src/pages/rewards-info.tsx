import { ArrowLeft, Check, Trophy, Shield, Zap, DollarSign, Clock, AlertTriangle, TrendingUp, Gift, Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function RewardsInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Trophy, 
      title: "EARN ON EVERY TRANSACTION", 
      desc: "Get reward points on UPI payments, bill payments, recharges, and all financial transactions.",
      highlight: "Every payment"
    },
    { 
      icon: Gift, 
      title: "EXCITING REWARDS", 
      desc: "Redeem points for gift vouchers, cashback, mobile recharges, and premium subscriptions.",
      highlight: "100+ options"
    },
    { 
      icon: Star, 
      title: "TIER SYSTEM", 
      desc: "Unlock higher tiers (Gold, Platinum, Diamond) for better rewards and exclusive benefits.",
      highlight: "4 tiers"
    },
    { 
      icon: Coins, 
      title: "INSTANT REDEMPTION", 
      desc: "Redeem your points anytime with instant processing and no minimum threshold.",
      highlight: "Real-time"
    },
    { 
      icon: DollarSign, 
      title: "BONUS POINTS", 
      desc: "Get bonus points on special days, festivals, and using specific payment methods.",
      highlight: "Extra rewards"
    },
  ];

  const steps = [
    { step: "1", title: "Make Payments", desc: "Pay bills, recharge, or transfer money" },
    { step: "2", title: "Earn Points", desc: "Get reward points on every transaction" },
    { step: "3", title: "Choose Reward", desc: "Select from 100+ redemption options" },
    { step: "4", title: "Redeem Instantly", desc: "Get your reward delivered instantly!" }
  ];

  const terms = [
    { label: "Earning Rate", desc: "Points earned per ₹100 spent", value: "5 Points" },
    { label: "Redemption Value", desc: "Each point worth in rupees", value: "₹1" },
    { label: "Minimum Redemption", desc: "Minimum points needed to redeem", value: "100 Points" },
    { label: "Point Validity", desc: "Rewards points expiry period", value: "1 Year" },
    { label: "Tier Benefits", desc: "Higher tiers earn more points", value: "Up to 3x" },
    { label: "Bonus Offers", desc: "Special occasion bonus points", value: "Frequent" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/rewards")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">REWARDS</h1>
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
              REWARDS
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Earn & Redeem on Every Transaction
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">Rewards</span> program lets you earn points on every transaction. Redeem for gift vouchers, cashback, recharges, and more from 100+ brands. Unlock higher tiers for better rewards.
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
          <p className="text-white/50 text-[11px] font-light">Start earning rewards today</p>
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
            Why Choose Rewards
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Earn on Everything", desc: "Get points on all transactions" },
                { title: "Instant Redemption", desc: "Redeem anytime with no waiting" },
                { title: "Multiple Options", desc: "100+ brands to choose from" },
                { title: "Tier Benefits", desc: "Unlock better rewards as you grow" },
                { title: "No Expiry Pressure", desc: "Points valid for 1 year" },
                { title: "Bonus Points", desc: "Extra rewards on special occasions" },
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
                Reward points are subject to terms and conditions. Points expire after 1 year from earning date. Redemption options and values may change without notice. Some transactions may not be eligible for rewards. Tier benefits are based on transaction volume.
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
          onClick={() => navigate("/rewards")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          START EARNING REWARDS
        </Button>
      </div>
    </div>
  );
}
