import { ArrowLeft, Check, ShoppingBag, Shield, Zap, Calendar, Clock, AlertTriangle, Repeat, TrendingUp, FileText, Star, Lock, Tag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function SwapNowInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: ShoppingBag, 
      title: "BUY & SELL USED GOODS", 
      desc: "Purchase pre-owned items at great prices or list your own items for sale. Easy transactions with secure chat and offer negotiation.",
      highlight: "Best prices"
    },
    { 
      icon: Package, 
      title: "WIDE CATEGORIES", 
      desc: "From electronics and furniture to vehicles and fashion - find or sell anything. Browse by category to discover what you need.",
      highlight: "All categories"
    },
    { 
      icon: Shield, 
      title: "SECURE MESSAGING", 
      desc: "Chat directly with buyers and sellers. Negotiate prices, ask questions, and finalize deals safely through our platform.",
      highlight: "100% secure"
    },
    { 
      icon: TrendingUp, 
      title: "MAKE OFFERS", 
      desc: "Don't like the price? Make an offer! Negotiate directly with sellers and get the best deal possible on items you want.",
      highlight: "Negotiate freely"
    },
    { 
      icon: Star, 
      title: "QUALITY LISTINGS", 
      desc: "All listings include detailed descriptions, condition ratings, and multiple images. Know exactly what you're buying.",
      highlight: "Detailed info"
    },
    { 
      icon: Lock, 
      title: "SAFE TRANSACTIONS", 
      desc: "Meet in person at safe locations. Inspect items before buying. We provide guidelines to ensure safe exchanges.",
      highlight: "Safety first"
    },
  ];

  const steps = [
    { step: "1", title: "Browse Items", desc: "Search by category, location, or keyword" },
    { step: "2", title: "Chat with Seller", desc: "Ask questions and negotiate price" },
    { step: "3", title: "Meet & Inspect", desc: "Meet at safe location and check item" },
    { step: "4", title: "Complete Deal", desc: "Exchange cash and mark as sold" }
  ];

  const terms = [
    { label: "Listing Fee", desc: "Free to list items on SwapNow", value: "₹0" },
    { label: "Transaction Fee", desc: "No platform fees for transactions", value: "Free" },
    { label: "Item Condition", desc: "Sellers must accurately describe condition", value: "Mandatory" },
    { label: "Meeting Safety", desc: "Always meet in public places during daytime", value: "Recommended" },
    { label: "Payment Methods", desc: "Cash recommended for in-person transactions", value: "Cash preferred" },
    { label: "Dispute Resolution", desc: "Report issues and we'll assist in resolution", value: "24/7 support" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/swap-now/explore")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SWAPNOW</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Information & Features</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              SWAPNOW MARKETPLACE
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Buy & Sell Pre-Owned Items. Save Money. Earn Cash.
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">SWAPNOW</span> is India's trusted marketplace for buying and selling used goods. From electronics and furniture to vehicles and fashion, find great deals or turn your unused items into cash.
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
            How It Works - 4 Simple Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Start buying or selling in minutes</p>
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
            Terms & Guidelines
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
            Why Choose SWAPNOW
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Save Money", desc: "Get quality used items at fraction of cost" },
                { title: "Earn Cash", desc: "Sell unused items and make extra money" },
                { title: "Easy Listing", desc: "List items in seconds with photos and details" },
                { title: "Direct Chat", desc: "Communicate directly with buyers and sellers" },
                { title: "Safe Meetings", desc: "Meet in person at safe public locations" },
                { title: "Local Deals", desc: "Find items near you and avoid shipping hassles" },
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
              <h3 className="text-sm font-medium text-white tracking-wider uppercase">Safety Guidelines</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                SWAPNOW is a platform connecting buyers and sellers. Always meet in public places during daylight hours. Inspect items thoroughly before purchase. Never share personal banking information. For high-value items, consider meeting at police stations or bank branches. Report any suspicious activity immediately.
              </p>
              <p className="text-[11px] text-white/50 font-light">
                For support, contact us at <span className="text-white">support@instapay.com</span> or call <span className="text-white">1800-XXX-XXXX</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={() => navigate("/swap-now/explore")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          START BROWSING
        </Button>
      </div>
    </div>
  );
}
