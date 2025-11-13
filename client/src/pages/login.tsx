import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { OtpInput } from "@/components/ui/otp-input";
import { cn } from "@/lib/utils";
import { verifyOtp } from "@/lib/auth";
import { 
  Smartphone, 
  Shield, 
  CheckCircle, 
  Zap, 
  Lock,
  ArrowRight,
  TrendingUp,
  Wallet,
  Globe,
  Clock,
  Hexagon,
  Quote,
  Send,
  Receipt,
  Plane,
  Banknote,
  Umbrella,
  Check
} from "lucide-react";
import { SiVisa, SiMastercard, SiPaypal, SiStripe, SiAmazon, SiGoogle } from "react-icons/si";
import logoImage from "@assets/suss_1761330157607.png";
import { LoadingLogo } from "@/components/ui/loading-logo";

// Types
interface Feature {
  icon: any;
  title: string;
  description: string;
}

interface Quote {
  text: string;
  author: string;
}

// Internal Components
function BrandHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Logo */}
      <div className="relative mb-6">
        <div className="w-24 h-24 flex items-center justify-center">
          <img 
            src={logoImage} 
            alt="Super Pay Logo" 
            className="h-20 w-20 animate-logo-float"
          />
        </div>
      </div>
      
      {/* Brand Name */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light text-white tracking-wider">
          Super Pay
        </h1>
        <p className="text-white/60 font-light tracking-widest text-xs uppercase">
          Next-Gen Super UPI App
        </p>
      </div>
    </div>
  );
}

function FeatureTicker({ features, currentFeature }: { features: Feature[], currentFeature: number }) {
  const getVisibleFeatures = () => {
    const total = features.length;
    const prev = (currentFeature - 1 + total) % total;
    const next = (currentFeature + 1) % total;
    return [prev, currentFeature, next];
  };

  const [prev, current, next] = getVisibleFeatures();
  
  return (
    <div className="w-full mb-6">
      <div className="relative h-32 overflow-hidden" role="region" aria-roledescription="feature carousel">
        <div className="flex items-center justify-center gap-2 h-full px-4">
          {/* Left Feature (Smaller) */}
          <div className="flex-shrink-0 w-24 opacity-40 scale-75 transition-all duration-700 ease-out transform">
            <div className="border border-white/20 p-2 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-lg">
              <div className="w-8 h-8 mx-auto border border-white/30 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 mb-1">
                {(() => {
                  const IconComponent = features[prev].icon;
                  return <IconComponent className="h-4 w-4 text-white stroke-1" />;
                })()}
              </div>
              <p className="text-[10px] text-white text-center font-light truncate">{features[prev].title}</p>
            </div>
          </div>

          {/* Center Feature (Larger) */}
          <div className="flex-shrink-0 w-40 scale-100 transition-all duration-700 ease-out transform">
            <div className="border-2 border-white/30 p-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-lg shadow-lg">
              <div className="w-12 h-12 mx-auto border border-white/30 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 mb-2">
                {(() => {
                  const IconComponent = features[current].icon;
                  return <IconComponent className="h-6 w-6 text-white stroke-1" />;
                })()}
              </div>
              <h3 className="font-light text-white text-xs tracking-wider text-center mb-1">{features[current].title}</h3>
              <p className="text-[10px] text-white/60 font-light text-center leading-snug">{features[current].description}</p>
            </div>
          </div>

          {/* Right Feature (Smaller) */}
          <div className="flex-shrink-0 w-24 opacity-40 scale-75 transition-all duration-700 ease-out transform">
            <div className="border border-white/20 p-2 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-lg">
              <div className="w-8 h-8 mx-auto border border-white/30 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 mb-1">
                {(() => {
                  const IconComponent = features[next].icon;
                  return <IconComponent className="h-4 w-4 text-white stroke-1" />;
                })()}
              </div>
              <p className="text-[10px] text-white text-center font-light truncate">{features[next].title}</p>
            </div>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-2">
          {features.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-6 h-1 transition-colors",
                index === currentFeature ? "bg-white" : "bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuoteRotator({ quotes, currentQuote }: { quotes: Quote[], currentQuote: number }){
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return (
    <div className="w-full mb-8">
      <div className="border border-white/20 p-3 text-center relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-lg" aria-live="polite" role="region" aria-roledescription="quote carousel">
        <Quote className="h-3 w-3 text-white/40 mx-auto mb-2" />
        
        {/* Crossfade Animation Container */}
        <div className="relative h-10">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 flex flex-col justify-center transition-opacity duration-500",
                index === currentQuote ? "opacity-100" : "opacity-0"
              )}
              style={{
                transitionDuration: prefersReducedMotion ? '0ms' : '500ms'
              }}
            >
              <blockquote className="text-xs text-white font-light italic leading-relaxed">
                "{quote.text}"
              </blockquote>
              <cite className="text-[10px] text-white/60 font-light tracking-wider">
                — {quote.author}
              </cite>
            </div>
          ))}
        </div>
        
        {prefersReducedMotion && (
          <div className="flex justify-center gap-2 mt-2">
            {quotes.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-6 h-1 cursor-pointer transition-colors",
                  index === currentQuote ? "bg-white" : "bg-white/20"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TrustedBy() {
  const brands = [
    { icon: Wallet, name: "PayFast" },
    { icon: Shield, name: "SecurePay" },
    { icon: Zap, name: "QuickPay" },
    { icon: Globe, name: "GlobalPay" },
    { icon: TrendingUp, name: "SmartPay" },
    { icon: CheckCircle, name: "TrustPay" },
  ];

  return (
    <div className="w-full mb-6">
      <p className="text-white/40 text-xs font-light uppercase tracking-widest text-center mb-4">
        Trusted by
      </p>
      <div className="border border-white/20 bg-gradient-to-br from-white/5 to-black/50 backdrop-blur-xl rounded-lg p-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <brand.icon className="h-6 w-6 text-white" />
              <span className="text-white text-xs font-light">{brand.name}</span>
              {index < brands.length - 1 && (
                <div className="w-px h-4 bg-white/20 ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionTray({ 
  step, 
  phone, 
  setPhone, 
  otp, 
  setOtp,
  isLoading, 
  handleSendOtp, 
  handleVerifyOtp, 
  handleResendOtp, 
  resendTimer, 
  setStep 
}: any) {
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/20 p-5 z-50 transition-transform duration-500",
        step === 2 ? "animate-slide-up" : ""
      )}
      style={{ paddingBottom: `calc(20px + env(safe-area-inset-bottom))` }}
    >
      <div className="max-w-md mx-auto">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-light text-white/60 block uppercase tracking-widest">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pl-4 pointer-events-none">
                  <Smartphone className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60 font-light">+91</span>
                </div>
                <Input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]*"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="pl-20 h-14 text-lg border-b-2 border-white/30 bg-transparent rounded-none text-white placeholder:text-white/40 focus:border-white focus:bg-transparent focus:outline-none transition-colors font-light"
                  data-testid="input-phone"
                />
              </div>
            </div>
            
            <Button
              onClick={handleSendOtp}
              disabled={isLoading || phone.length !== 10}
              className="w-full h-14 text-base font-light tracking-wider bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-none"
              data-testid="button-send-otp"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <LoadingLogo size="sm" />
                  SENDING OTP...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  CONTINUE TO Super Pay
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            <p className="text-center text-xs text-white/60 font-light">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-xs text-white/60 font-light uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock className="h-3 w-3" />
                Enter 4-Digit OTP
              </p>
              <p className="text-white/60 text-sm font-light">
                Sent to +91 {phone.slice(0, 2)}•••{phone.slice(-2)}
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="password"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-16 h-16 text-center text-3xl font-light bg-transparent border-b-2 border-white/20 rounded-none text-white focus:border-white transition-colors"
                  data-testid={`input-otp-${index}`}
                />
              ))}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.some((digit: string) => !digit)}
                className="w-full h-14 text-base font-light tracking-wider bg-white text-black hover:bg-white/90 transition-colors rounded-none"
                data-testid="button-verify-otp"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <LoadingLogo size="sm" />
                    VERIFYING...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    VERIFY & JOIN Super Pay
                  </div>
                )}
              </Button>
              
              <div className="flex justify-between text-sm">
                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-white/60 hover:text-white p-0 h-auto font-light"
                  data-testid="button-resend-otp"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-white/60 hover:text-white p-0 h-auto font-light"
                  data-testid="button-change-number"
                >
                  Change number
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [step, setStep] = useState(1); // 1 = phone input, 2 = OTP verification
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setResendTimer(60);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 4 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp({ phone, otp: otpString });
      
      if (response.success && response.user) {
        login(response.user);
        sessionStorage.setItem('justLoggedIn', 'true');
        toast({
          title: "Login Successful",
          description: "Welcome to Super Pay!"
        });
        
        // Start fade out transition
        setIsTransitioning(true);
        
        // Wait for fade out then navigate (total 4s)
        setTimeout(() => {
          navigate("/home");
        }, 4000);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Verification Failed",
        description: errorMessage.includes("Invalid phone number or OTP format") 
          ? "Please check your OTP and try again"
          : "Something went wrong. Please try again",
        variant: "destructive",
      });
      
      setOtp(Array(4).fill(""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    toast({
      title: "OTP Sent",
      description: "New OTP has been sent to your mobile number",
    });
  };

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Features data
  const features = [
    {
      icon: Send,
      title: "Money Transfers",
      description: "Send money instantly to anyone, anywhere in India"
    },
    {
      icon: Receipt,
      title: "Bills & Recharges",
      description: "Pay bills and recharge mobile, DTH, and more"
    },
    {
      icon: Plane,
      title: "Travel Bookings",
      description: "Book flights, hotels, and plan your perfect trip"
    },
    {
      icon: TrendingUp,
      title: "Invest Now",
      description: "Stock, Crypto, Mutual Funds, Fixed Deposits"
    },
    {
      icon: Umbrella,
      title: "Insurance",
      description: "Protect yourself with comprehensive insurance plans"
    },
    {
      icon: Banknote,
      title: "Loan",
      description: "Get instant loans with competitive interest rates"
    }
  ];

  // Auto-scroll features every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Quotes data
  const quotes = [
    {
      text: "Money is a tool. Used properly, it can build empires.",
      author: "Warren Buffett"
    },
    {
      text: "The future of money is digital.",
      author: "Bill Gates"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "The best investment you can make is in yourself.",
      author: "Warren Buffett"
    },
    {
      text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
      author: "Dave Ramsey"
    }
  ];

  // Auto-scroll quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className={cn(
      "min-h-screen bg-black text-white flex flex-col relative overflow-hidden",
      isTransitioning && "animate-fade-out"
    )}>
      {/* Developer Credit */}
      <div className="fixed top-6 left-0 right-0 z-40">
        <p className="text-white text-sm font-light tracking-widest text-center">
          Developed by: <span className="font-semibold text-white">Joshua J Kanatt</span>
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-24 pb-8 flex flex-col justify-start">
        <div className="max-w-md mx-auto w-full space-y-6 mt-20">
          
          {/* Brand Header */}
          <BrandHeader />

          {/* Features Ticker */}
          <FeatureTicker features={features} currentFeature={currentFeature} />

          {/* Quote Section */}
          <QuoteRotator quotes={quotes} currentQuote={currentQuote} />

          {/* Trusted By Section */}
          <TrustedBy />
          
        </div>
      </div>

      {/* Action Tray */}
      <ActionTray 
        step={step}
        phone={phone}
        setPhone={setPhone}
        otp={otp}
        setOtp={setOtp}
        isLoading={isLoading}
        handleSendOtp={handleSendOtp}
        handleVerifyOtp={handleVerifyOtp}
        handleResendOtp={handleResendOtp}
        resendTimer={resendTimer}
        setStep={setStep}
      />
    </div>
  );
}