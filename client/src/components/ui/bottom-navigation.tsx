import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  TrendingUp,
  QrCode,
  Grid3X3,
  User,
  Calculator,
  Target,
  BookOpen,
  Zap,
  Sparkles,
  Crown,
  Activity,
  X,
  Plus,
  DollarSign,
  Percent,
  Search,
  Clock,
  MessageCircle,
  Shield,
  Users,
  Star,
  Calendar
} from "lucide-react";

export function BottomNavigation() {
  const [location, navigate] = useLocation();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCibilTool, setShowCibilTool] = useState(false);
  const [showQuickTools, setShowQuickTools] = useState(false);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const quickToolsRef = useRef<HTMLDivElement>(null);
  
  // Calculator states
  const [loanAmount, setLoanAmount] = useState("500000");
  const [interestRate, setInterestRate] = useState("12");
  const [tenure, setTenure] = useState("24");
  const [emi, setEmi] = useState(0);
  
  // CIBIL states
  const [cibilScore, setCibilScore] = useState(750);
  const [creditUtilization, setCreditUtilization] = useState(35);
  
  // Only show bottom navigation on specific pages and their sub-routes
  const allowedPages = ['/home', '/', '/pro-tools', '/upi-scanner', '/booking'];
  const allowedPrefixes = ['/investment', '/my-', '/booking/', '/movies', '/events', '/edit-profile'];
  
  const shouldShowNav = allowedPages.includes(location) || 
    allowedPrefixes.some(prefix => location.startsWith(prefix));
  
  if (!shouldShowNav) {
    return null;
  }

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const time = parseFloat(tenure);
    
    if (principal && rate && time) {
      const emiAmount = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      setEmi(Math.round(emiAmount));
    }
  };

  const getCibilScoreColor = (score: number) => {
    if (score >= 750) return "text-primary";
    if (score >= 650) return "text-primary";
    return "text-primary";
  };

  const getCibilScoreStatus = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  // Focus management for Quick Tools modal
  useEffect(() => {
    if (showQuickTools) {
      // Focus the modal and trap focus
      if (quickToolsRef.current) {
        quickToolsRef.current.focus();
      }
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowQuickTools(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    } else {
      // Restore focus to trigger button when modal closes
      if (toolsButtonRef.current) {
        toolsButtonRef.current.focus();
      }
    }
  }, [showQuickTools]);

  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/home",
      isActive: location === "/home" || location === "/"
    },
    { 
      icon: TrendingUp, 
      label: "Invest", 
      path: "/investment",
      isActive: location.startsWith("/investment")
    },
    { 
      icon: QrCode, 
      label: "Pay", 
      path: "/upi-scanner",
      isActive: location === "/upi-scanner",
      isScanButton: true
    },
    { 
      icon: Calendar, 
      label: "Book", 
      path: "/booking",
      isActive: location === "/booking" || location.startsWith("/booking/") || location.startsWith("/my-trips") || location.startsWith("/movies") || location.startsWith("/events")
    },
    { 
      icon: User, 
      label: "Tools", 
      path: "/pro-tools",
      isActive: location === "/pro-tools" || location.startsWith("/pro-tools/") || location.startsWith("/my-") || location.startsWith("/edit-profile")
    }
  ];

  const quickTools = [
    {
      icon: Calculator,
      label: "EMI Calculator",
      description: "Calculate loan EMI",
      action: () => setShowCalculator(true)
    },
    {
      icon: Search,
      label: "Loan Finder",
      description: "Smart loan matching",
      action: () => navigate("/marketplace")
    },
    {
      icon: TrendingUp,
      label: "CreditPro Report",
      description: "AI credit insights",
      action: () => navigate("/myreport")
    },
    {
      icon: Calculator,
      label: "Repayment Calculator",
      description: "Smart EMI planning",
      action: () => navigate("/repayment-calculator")
    },
    {
      icon: MessageCircle,
      label: "FinAdvisor",
      description: "AI financial coach",
      action: () => navigate("/coach")
    },
    {
      icon: Activity,
      label: "FitFinance",
      description: "Fitness meets finance",
      action: () => navigate("/fitness")
    },
    {
      icon: TrendingUp,
      label: "Credit Score",
      description: "Free analysis & report",
      action: () => navigate("/cibil-checker")
    },
    {
      icon: Shield,
      label: "Loan Spam Detector",
      description: "Fraud protection",
      action: () => navigate("/security")
    },
    {
      icon: BookOpen,
      label: "Learn Karo",
      description: "Financial education",
      action: () => navigate("/learn")
    },
    {
      icon: Users,
      label: "Creator Connect",
      description: "Expert consultations",
      action: () => navigate("/creators")
    },
    {
      icon: Target,
      label: "Perfect Finance",
      description: "Credit improvement",
      action: () => navigate("/mypath")
    },
    {
      icon: Grid3X3,
      label: "Pro Tools",
      description: "Premium features",
      action: () => navigate("/pro-tools")
    }
  ];

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-[9999] lg:hidden" 
        aria-label="Primary bottom navigation"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999 }}
      >
        {/* Modern Black & White Navigation with Enhanced Design */}
        <div className="bg-[hsl(220,15%,12%)] backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]" style={{ backgroundColor: 'hsl(220, 15%, 12%)', minHeight: '70px' }}>
          {/* Navigation Items */}
          <div className="flex items-center justify-around px-4 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={item.isScanButton ? "relative flex-1 flex flex-col items-center" : "relative flex-1"}>
                  {item.isScanButton ? (
                    // Prominent Scan Button with Modern Design and Animation
                    <>
                      <Button
                        onClick={() => navigate(item.path)}
                        className="relative w-16 h-16 rounded-none bg-white text-black border-2 border-white/30 hover:bg-white/95 hover:scale-105 transition-all duration-300 mb-1 shadow-lg hover:shadow-xl active:scale-95"
                        data-testid="scan-pay-button"
                        aria-label="Scan & Pay"
                      >
                        <Icon className="h-7 w-7 animate-scan-icon" strokeWidth={1.5} aria-hidden="true" />
                      </Button>
                      <span className="text-[10px] font-light text-white/80 mt-1 leading-tight uppercase tracking-widest">{item.label}</span>
                    </>
                  ) : (
                    <Button
                      onClick={() => navigate(item.path)}
                      variant="ghost"
                      aria-current={item.isActive ? "page" : undefined}
                      aria-label={`Navigate to ${item.label}`}
                      className={`w-full flex flex-col items-center gap-2 h-16 rounded-none transition-all duration-300 group ${
                        item.isActive 
                          ? "text-white" 
                          : "text-white/40 hover:text-white/80"
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className="relative mt-1">
                        <Icon 
                          className={`h-5 w-5 transition-all duration-300 ${
                            item.isActive 
                              ? 'animate-nav-icon-active' 
                              : 'group-hover:scale-110 group-active:scale-95'
                          }`} 
                          strokeWidth={item.isActive ? 1.5 : 1} 
                          aria-hidden="true" 
                        />
                        {item.isActive && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-none animate-pulse"></div>
                        )}
                      </div>
                      <span className={`text-[10px] font-light leading-tight uppercase tracking-widest transition-all duration-300 ${
                        item.isActive ? 'font-medium' : ''
                      }`}>{item.label}</span>
                      {item.isActive && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-[2px] bg-white rounded-none animate-slide-down"></div>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern Quick Tools Panel */}
        {showQuickTools && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={() => setShowQuickTools(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowQuickTools(false);
              }
            }}
          >
            <div 
              ref={quickToolsRef}
              id="quick-tools-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-tools-title"
              tabIndex={-1}
              className="absolute bottom-20 left-4 right-4 bg-[hsl(220,15%,12%)] backdrop-blur-xl border-2 border-white/20 p-6 max-h-[70vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 id="quick-tools-title" className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="h-5 w-5 text-white" strokeWidth={1} aria-hidden="true" />
                    Quick Tools
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                      <Crown className="h-3 w-3 mr-1" aria-hidden="true" />
                      Premium
                    </Badge>
                    <Button
                      onClick={() => setShowQuickTools(false)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-none text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      data-testid="close-quick-tools"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                  {quickTools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <Button
                        key={tool.label}
                        onClick={() => {
                          tool.action();
                          setShowQuickTools(false);
                        }}
                        variant="ghost"
                        className="bg-white/5 border-2 border-white/10 h-auto p-5 flex flex-col items-center gap-3 rounded-none hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-300 group"
                      >
                        <div className="bg-white/10 w-12 h-12 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                          <ToolIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={1} aria-hidden="true" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-light text-white mb-1 uppercase tracking-wider group-hover:font-normal transition-all duration-300">{tool.label}</div>
                          <div className="text-[10px] text-white/50 leading-relaxed font-light">{tool.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* EMI Calculator Modal */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="neu-card-inset w-10 h-10 rounded-none flex items-center justify-center">
                <Calculator className="h-5 w-5 text-foreground" />
              </div>
              <DialogTitle>EMI Calculator</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Loan Amount */}
            <div>
              <label htmlFor="loan-amount" className="block text-sm font-medium text-foreground mb-2">
                Loan Amount
              </label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-lg"
                aria-describedby="loan-amount-help"
              />
              <p id="loan-amount-help" className="text-sm text-muted-foreground mt-1">₹{parseInt(loanAmount || "0").toLocaleString()}</p>
            </div>

            {/* Interest Rate */}
            <div>
              <label htmlFor="interest-rate" className="block text-sm font-medium text-foreground mb-2">
                Interest Rate (% per annum)
              </label>
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter rate"
                className="text-lg"
                inputMode="decimal"
              />
            </div>

            {/* Tenure */}
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-foreground mb-2">
                Tenure (months)
              </label>
              <Input
                id="tenure"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="Enter tenure"
                className="text-lg"
                inputMode="numeric"
                aria-describedby="tenure-help"
              />
              <p id="tenure-help" className="text-sm text-muted-foreground mt-1">{Math.round(parseInt(tenure || "0") / 12)} years {parseInt(tenure || "0") % 12} months</p>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateEMI}
              className="neu-button bg-primary text-primary-foreground py-3"
            >
              Calculate EMI
            </Button>

            {/* Result */}
            {emi > 0 && (
              <div className="neu-card p-4 bg-primary/5">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{emi.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly EMI</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">
                      ₹{(emi * parseInt(tenure)).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Total Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">
                      ₹{((emi * parseInt(tenure)) - parseInt(loanAmount)).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Total Interest</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CIBIL Score Tool Modal */}
      <Dialog open={showCibilTool} onOpenChange={setShowCibilTool}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="neu-card-inset w-10 h-10 rounded-none flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-foreground" />
              </div>
              <DialogTitle>CIBIL Score Checker</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current Score Display */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-muted rounded-none"></div>
                <div 
                  className="absolute inset-0 rounded-none bg-primary"
                  style={{
                    background: `conic-gradient(from 0deg, ${
                      cibilScore >= 750 ? '#10b981' : 
                      cibilScore >= 650 ? '#f59e0b' : '#ef4444'
                    } ${(cibilScore / 900) * 360}deg, #e5e7eb 0deg)`
                  }}
                ></div>
                <div className="absolute inset-2 bg-white rounded-none flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getCibilScoreColor(cibilScore)}`}>
                      {cibilScore}
                    </div>
                    <div className="text-xs text-muted-foreground">CIBIL</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className={`text-lg font-semibold ${getCibilScoreColor(cibilScore)}`}>
                  {getCibilScoreStatus(cibilScore)} Credit Score
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: Today
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-none">
                <h4 className="font-semibold text-foreground mb-3">Score Factors</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment History</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-none">
                        <div className="w-4/5 h-2 bg-green-400 rounded-none"></div>
                      </div>
                      <span className="text-sm font-medium text-primary">Good</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Credit Utilization</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-none">
                        <div className="w-2/5 h-2 bg-yellow-500 rounded-none"></div>
                      </div>
                      <span className="text-sm font-medium text-primary">{creditUtilization}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Credit Age</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-none">
                        <div className="w-3/5 h-2 bg-blue-400 rounded-none"></div>
                      </div>
                      <span className="text-sm font-medium text-primary">3.2 yrs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="neu-card p-4 bg-primary/5">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Improvement Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Reduce credit utilization below 30%</li>
                  <li>• Pay all bills before due date</li>
                  <li>• Don't close old credit accounts</li>
                  <li>• Monitor credit report regularly</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/mypath")}
                className="flex-1 neu-button bg-primary text-primary-foreground"
              >
                Improve Score
              </Button>
              <Button
                onClick={() => navigate("/myreport")}
                variant="outline"
                className="flex-1"
              >
                Full Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}