import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  Award,
  Calculator,
  Shield,
  TrendingUp,
  FileText,
  CreditCard,
  Phone,
  Calendar,
  Bell,
  BarChart3,
  Target,
  Crown,
  Zap,
  Star,
  ArrowRight,
  Gift,
  Lock,
  Eye,
  Clock,
  Download
} from "lucide-react";

export default function LoanConfirmation() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");

  // Featured tools and services with pricing
  const featuredTools = [
    {
      id: "credit-monitor",
      name: "Credit Score Monitor",
      description: "Real-time credit score tracking & alerts",
      freeFeatures: ["Monthly score update", "Basic insights"],
      proFeatures: ["Daily updates", "Detailed analysis", "Score improvement tips"],
      freePrice: "Free",
      proPrice: "₹99/month",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "emi-optimizer",
      name: "EMI Optimizer Pro",
      description: "AI-powered EMI planning & optimization",
      freeFeatures: ["Basic EMI calculator"],
      proFeatures: ["Smart restructuring", "Payment reminders", "Tax benefits tracker"],
      freePrice: "Free",
      proPrice: "₹149/month",
      icon: Calculator,
      color: "from-white/10 to-white/5"
    },
    {
      id: "loan-guard",
      name: "LoanGuard Insurance",
      description: "Protect your loans with comprehensive coverage",
      freeFeatures: ["Basic information"],
      proFeatures: ["Complete coverage", "Claim assistance", "Family protection"],
      freePrice: "Not available",
      proPrice: "₹199/month",
      icon: Shield,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "financial-advisor",
      name: "AI Financial Advisor",
      description: "24/7 personalized financial guidance",
      freeFeatures: ["Basic chatbot"],
      proFeatures: ["AI advisor", "Investment planning", "Goal tracking"],
      freePrice: "Limited",
      proPrice: "₹299/month",
      icon: Award,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const handleUpgradeToPro = () => {
    toast({
      title: "Upgrade to Pro",
      description: "Redirecting to subscription management...",
    });
    navigate("/pro-tools");
  };

  const handleUseTool = (toolId: string, isPro: boolean) => {
    if (isPro && selectedPlan === "free") {
      toast({
        title: "Upgrade Required",
        description: "This feature is available with Pro subscription.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Tool Activated",
      description: `Opening ${toolId} for you...`,
    });

    // Navigate to specific tool based on toolId
    switch(toolId) {
      case "credit-monitor":
        navigate("/credit-score");
        break;
      case "emi-optimizer":
        navigate("/emi-calculator");
        break;
      case "loan-guard":
        navigate("/insurance");
        break;
      case "financial-advisor":
        navigate("/coach");
        break;
      default:
        navigate("/pro-tools");
    }
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Success Header */}
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 pt-8 pb-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            size="sm"
            className="text-white p-2 hover:bg-white/10 rounded-none border border-white/10"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-none flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Application Submitted!</h1>
            <p className="text-white/60 text-sm">Your loan application is being processed</p>
          </div>
          <div className="w-12"></div> {/* Spacer for centered title */}
        </div>
      </div>

      {/* Application Status */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-white/5 rounded-none p-5 shadow-lg border border-white/10 mb-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-2">What's Next?</h2>
            <p className="text-white/60 text-sm">Track your application and explore our premium tools</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-none">
              <FileText className="h-6 w-6 text-white/60 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Document Review</p>
              <p className="text-xs text-white/60">1-2 hours</p>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-none">
              <Phone className="h-6 w-6 text-white/60 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Verification Call</p>
              <p className="text-xs text-white/60">Same day</p>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/10 rounded-none">
              <CreditCard className="h-6 w-6 text-white/60 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Fund Transfer</p>
              <p className="text-xs text-white/60">24 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Subscription Banner */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-none p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-none translate-x-6 -translate-y-6"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-white" />
              <span className="font-bold">Kcredit Pro</span>
              <Badge className="bg-white text-black text-xs rounded-none">Limited Offer</Badge>
            </div>
            <p className="text-white/60 text-sm mb-3">Unlock premium tools and save ₹2,000+ monthly</p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">₹499/month</div>
              <Button
                onClick={handleUpgradeToPro}
                className="bg-white text-black hover:bg-white/90 font-semibold px-4 py-2 rounded-none"
                data-testid="button-upgrade-pro"
              >
                Upgrade Now
                <Sparkles className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="px-4 mb-4">
        <div className="bg-white/5 rounded-none p-4 shadow-lg border border-white/10">
          <h3 className="font-bold text-white mb-3 text-center">Choose Your Experience</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setSelectedPlan("free")}
              variant={selectedPlan === "free" ? "default" : "outline"}
              className={`p-3 rounded-none font-medium ${
                selectedPlan === "free" 
                  ? "bg-white/10 text-white border-white/20" 
                  : "border-white/10 text-white/60 hover:bg-white/5"
              }`}
              data-testid="button-select-free"
            >
              <div className="text-center">
                <p className="font-semibold">Free Plan</p>
                <p className="text-xs opacity-80">Basic features</p>
              </div>
            </Button>
            <Button
              onClick={() => setSelectedPlan("pro")}
              variant={selectedPlan === "pro" ? "default" : "outline"}
              className={`p-3 rounded-none font-medium relative ${
                selectedPlan === "pro" 
                  ? "bg-white text-black" 
                  : "border-white/10 text-white/60 hover:bg-white/5"
              }`}
              data-testid="button-select-pro"
            >
              <Crown className="h-3 w-3 absolute top-1 right-1" />
              <div className="text-center">
                <p className="font-semibold">Pro Plan</p>
                <p className="text-xs opacity-80">All features</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Tools Cards */}
      <div className="px-4 space-y-4">
        <h3 className="font-bold text-white text-lg">Explore Financial Tools</h3>
        
        {featuredTools.map((tool) => {
          const Icon = tool.icon;
          const isProOnly = tool.freePrice === "Not available" || tool.freePrice === "Limited";
          const showProFeatures = selectedPlan === "pro";
          
          return (
            <div 
              key={tool.id}
              className="bg-white/5 rounded-none p-4 shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300"
              data-testid={`tool-card-${tool.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-none flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{tool.name}</h4>
                    <p className="text-white/60 text-xs">{tool.description}</p>
                  </div>
                </div>
                {isProOnly && (
                  <Crown className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Features Comparison */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-none p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white/60">Free Plan</span>
                      <span className="text-sm font-bold text-white">{tool.freePrice}</span>
                    </div>
                    <div className="space-y-1">
                      {tool.freeFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-white/60" />
                          <span className="text-xs text-white/60">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 border border-white/20 rounded-none p-3 relative">
                    {selectedPlan === "pro" && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-white/20 rounded-none flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-black" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">Pro Plan</span>
                      <span className="text-sm font-bold text-white">{tool.proPrice}</span>
                    </div>
                    <div className="space-y-1">
                      {tool.proFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-white" />
                          <span className="text-xs text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUseTool(tool.id, false)}
                  variant="outline"
                  disabled={isProOnly}
                  className={`flex-1 text-sm py-2 rounded-none ${
                    isProOnly 
                      ? "opacity-50 cursor-not-allowed border-white/10 text-white/40" 
                      : "border-white/10 text-white hover:bg-white/10"
                  }`}
                  data-testid={`button-use-free-${tool.id}`}
                >
                  {isProOnly ? (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Pro Only
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Try Free
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleUseTool(tool.id, true)}
                  className="flex-1 bg-white text-black hover:bg-white/90 text-sm py-2 rounded-none"
                  data-testid={`button-use-pro-${tool.id}`}
                >
                  {selectedPlan === "pro" ? (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      Use Now
                    </>
                  ) : (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Get Pro
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Subscription Benefits */}
      <div className="px-4 mt-6 mb-4">
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-none p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-none translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-none -translate-x-4 translate-y-4"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-6 w-6 text-white" />
              <h3 className="text-xl font-bold">Kcredit Pro Benefits</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 border border-white/10 rounded-none p-3">
                <BarChart3 className="h-5 w-5 mb-2 text-white" />
                <p className="text-sm font-semibold">Advanced Analytics</p>
                <p className="text-xs text-white/60">Real-time insights & reports</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-none p-3">
                <Target className="h-5 w-5 mb-2 text-white" />
                <p className="text-sm font-semibold">Goal Tracking</p>
                <p className="text-xs text-white/60">AI-powered financial planning</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-none p-3">
                <Bell className="h-5 w-5 mb-2 text-white" />
                <p className="text-sm font-semibold">Smart Alerts</p>
                <p className="text-xs text-white/60">Never miss a payment</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-none p-3">
                <Gift className="h-5 w-5 mb-2 text-white" />
                <p className="text-sm font-semibold">Exclusive Offers</p>
                <p className="text-xs text-white/60">Special rates & cashbacks</p>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-none p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">Save ₹2,400/month</p>
                  <p className="text-xs text-white/60">Average savings with Pro tools</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">₹499</p>
                  <p className="text-xs text-white/60 line-through">₹999</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/home")}
                variant="outline"
                className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-none"
                data-testid="button-continue-free"
              >
                Continue Free
              </Button>
              <Button
                onClick={handleUpgradeToPro}
                className="flex-1 bg-white text-black hover:bg-white/90 font-bold rounded-none"
                data-testid="button-upgrade-now"
              >
                Upgrade to Pro
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}