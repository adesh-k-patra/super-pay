import { ArrowLeft, Check, Heart, Trophy, Target, Zap, Calendar, AlertTriangle, Activity, Star, Gift, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function FitnessInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Target, 
      title: "DAILY CHALLENGES", 
      desc: "Complete daily, weekly, and monthly fitness challenges to stay active and earn exclusive rewards.",
      highlight: "Fresh daily"
    },
    { 
      icon: Trophy, 
      title: "EARN COUPONS", 
      desc: "Win valuable coupons from sports brands, wellness services, gyms, and health products by completing challenges.",
      highlight: "Real rewards"
    },
    { 
      icon: Activity, 
      title: "TRACK PROGRESS", 
      desc: "Monitor your fitness journey with progress tracking, personal records, and achievement milestones.",
      highlight: "Visual insights"
    },
    { 
      icon: Star, 
      title: "LEADERBOARD", 
      desc: "Compete with others, climb the rankings, and showcase your fitness dedication to the community.",
      highlight: "Global competition"
    },
    { 
      icon: Flame, 
      title: "STREAK SYSTEM", 
      desc: "Build consistency with daily streaks. The longer your streak, the better the rewards you unlock.",
      highlight: "Bonus multipliers"
    },
    { 
      icon: Gift, 
      title: "EXCLUSIVE BADGES", 
      desc: "Collect achievement badges and unlock special perks as you reach new fitness milestones.",
      highlight: "Unique achievements"
    },
  ];

  const steps = [
    { step: "1", title: "Browse Challenges", desc: "Choose from daily, weekly, or monthly fitness goals" },
    { step: "2", title: "Join & Track", desc: "Start tracking your progress in real-time" },
    { step: "3", title: "Complete Goals", desc: "Hit your targets and earn rewards" },
    { step: "4", title: "Collect Coupons", desc: "Redeem exclusive coupons and benefits!" }
  ];

  const terms = [
    { label: "Challenge Types", desc: "Daily, weekly, and monthly fitness goals", value: "3 categories" },
    { label: "Reward Collection", desc: "Automatically saved to My Coupons upon completion", value: "Instant access" },
    { label: "Coupon Validity", desc: "Most coupons valid for 30 days after earning", value: "30 days" },
    { label: "Challenge Limits", desc: "Join unlimited challenges simultaneously", value: "No limits" },
    { label: "Progress Tracking", desc: "Real-time updates as you work towards goals", value: "Live tracking" },
    { label: "Leaderboard", desc: "Updated daily based on completed challenges and points", value: "Daily refresh" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fitness")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FIT FINANCE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Information & Features</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              FIT FINANCE
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Stay Fit. Get Rewarded. Build Healthy Financial Habits.
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">FIT FINANCE</span> combines your fitness journey with financial rewards. Complete app fitness challenges, earn exclusive coupons, and build consistency through our gamified wellness system. Every step counts towards better health and savings.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Zap className="h-4 w-4" />
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
            <Calendar className="h-4 w-4" />
            Get Started in 4 Simple Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Start earning rewards in under a minute</p>
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
            <Heart className="h-4 w-4" />
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
            Why Choose FIT FINANCE
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Real Rewards", desc: "Earn genuine coupons from top brands" },
                { title: "Stay Motivated", desc: "Gamified challenges keep you engaged" },
                { title: "Build Habits", desc: "Daily streaks encourage consistency" },
                { title: "Save Money", desc: "Get discounts on fitness and wellness products" },
                { title: "Community Support", desc: "Join leaderboards and compete with others" },
                { title: "Flexible Goals", desc: "Choose challenges that fit your lifestyle" },
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
                FIT FINANCE is a gamified wellness program designed to encourage healthy app usage habits while rewarding you with exclusive coupons. Challenge completion and rewards are subject to verification. Coupons are provided by partner brands and subject to their terms and conditions. Please consult healthcare professionals for personalized fitness advice.
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
          onClick={() => navigate("/fitness")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          START CHALLENGES
        </Button>
      </div>
    </div>
  );
}
