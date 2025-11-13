import { ArrowLeft, Check, ShoppingBag, Shield, Zap, Calendar, Clock, AlertTriangle, Repeat, TrendingUp, FileText, Star, Lock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function CouponMartInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: ShoppingBag, 
      title: "BUY & SELL COUPONS", 
      desc: "Purchase unused coupons at discounted prices or list your own coupons for cash. Easy transactions with instant code delivery.",
      highlight: "Instant access"
    },
    { 
      icon: Repeat, 
      title: "TRADE COUPONS", 
      desc: "Exchange your unwanted coupons for the ones you actually need. Direct trades with other users without any fees.",
      highlight: "Zero fees"
    },
    { 
      icon: Shield, 
      title: "SECURE TRANSACTIONS", 
      desc: "Coupon codes are revealed only after successful payment confirmation. Your money and codes are protected.",
      highlight: "100% secure"
    },
    { 
      icon: TrendingUp, 
      title: "VALUE SCORING", 
      desc: "AI-powered value scores help you identify the best deals. Know the true worth before you buy or trade.",
      highlight: "Smart ratings"
    },
    { 
      icon: Star, 
      title: "VERIFIED LISTINGS", 
      desc: "All listings are verified and monitored. Report suspicious activity and we take immediate action.",
      highlight: "Trusted platform"
    },
    { 
      icon: Lock, 
      title: "CODE PROTECTION", 
      desc: "Advanced encryption keeps your coupon codes safe. Codes are only revealed after successful payment.",
      highlight: "Encrypted codes"
    },
  ];

  const steps = [
    { step: "1", title: "Browse Coupons", desc: "Find coupons by brand, category, or value" },
    { step: "2", title: "Buy or Trade", desc: "Choose to purchase with cash or trade" },
    { step: "3", title: "Pay Securely", desc: "Complete transaction via UPI or card" },
    { step: "4", title: "Get Code", desc: "Receive coupon code instantly!" }
  ];

  const terms = [
    { label: "Transaction Fee", desc: "Small platform fee for each transaction", value: "2.5% only" },
    { label: "Code Validity", desc: "Sellers must guarantee code validity", value: "Mandatory" },
    { label: "Refund Policy", desc: "Full refund if code doesn't work", value: "100% refund" },
    { label: "Listing Duration", desc: "Active listings stay live until sold", value: "No expiry" },
    { label: "Payment Methods", desc: "UPI, cards, net banking, and wallets", value: "All supported" },
    { label: "Privacy", desc: "Your personal and payment data is encrypted", value: "Bank-grade" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/coupon-mart")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">COUPON MART</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Information & Features</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              COUPON MART
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Buy, Sell & Trade Coupons. Save More. Earn More.
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">COUPON MART</span> is India's first coupon marketplace where you can buy unused coupons at discounted prices, sell your unwanted vouchers for cash, or trade them with other users for coupons you actually need.
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
            <Clock className="h-4 w-4" />
            Get Started in 4 Simple Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Start saving money in under 2 minutes</p>
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
            <FileText className="h-4 w-4" />
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
            Why Choose COUPON MART
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Save Money", desc: "Get premium coupons at fraction of cost" },
                { title: "Earn Cash", desc: "Sell unwanted coupons and make money" },
                { title: "Smart Trades", desc: "Exchange coupons without spending cash" },
                { title: "Instant Delivery", desc: "Get coupon codes immediately" },
                { title: "Verified Codes", desc: "All codes are checked and verified" },
                { title: "24/7 Support", desc: "Get help anytime with our support team" },
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
                COUPON MART is a marketplace connecting buyers and sellers of coupons. While we verify listings and monitor transactions, users are responsible for checking coupon validity before purchase. Always verify the terms and conditions of each coupon with the respective brand. Refunds are processed only if the coupon code is invalid or expired.
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
          onClick={() => navigate("/coupon-mart")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          START SHOPPING
        </Button>
      </div>
    </div>
  );
}
