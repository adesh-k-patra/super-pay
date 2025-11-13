import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  CheckCircle,
  Home,
  Calendar,
  Hash,
  Building2,
  FileText,
  CreditCard,
  Clock,
  Award,
  DollarSign,
  Phone,
  Mail,
  Percent
} from "lucide-react";

export default function CreditCardCongratulations() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const cardDetails = {
    cardType: "Premium Rewards Card",
    cardNumber: "XXXX-XXXX-XXXX-" + Math.floor(1000 + Math.random() * 9000),
    applicationNumber: "CC-APP-" + Date.now().toString().slice(-10),
    creditLimit: "₹2,00,000",
    annualFee: "₹500 + GST",
    joiningBonus: "5,000 reward points",
    processingTime: "5-7 business days",
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    provider: "SuperPay Bank",
    applicationId: "APP" + Date.now().toString().slice(-8)
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">APPLICATION SUBMITTED</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Credit Card
            </p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Success Status Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-2 border-green-400/30 bg-green-400/10 flex items-center justify-center animate-pulse">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
            <p className="text-lg text-white/80 font-light">
              Your credit card application has been submitted successfully
            </p>
            <Badge className="bg-green-500/10 text-green-400 border-green-400/20 rounded-none">
              <CheckCircle className="h-3 w-3 mr-1" />
              Application Submitted
            </Badge>
          </div>
        </div>

        {/* Application Information */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Application Details</p>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Card Type</span>
              </div>
              <span className="text-sm text-white font-light">{cardDetails.cardType}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Application Number</span>
              </div>
              <span className="text-sm text-white font-light font-mono">{cardDetails.applicationNumber}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Application ID</span>
              </div>
              <span className="text-sm text-white font-light font-mono">{cardDetails.applicationId}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Bank</span>
              </div>
              <span className="text-sm text-white font-light">{cardDetails.provider}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Credit Limit</span>
              </div>
              <span className="text-sm text-white font-semibold">{cardDetails.creditLimit}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Annual Fee</span>
              </div>
              <span className="text-sm text-white font-light">{cardDetails.annualFee}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Joining Bonus</span>
              </div>
              <span className="text-sm text-white font-light">{cardDetails.joiningBonus}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Application Date</span>
              </div>
              <span className="text-sm text-white font-light">{cardDetails.date}</span>
            </div>

            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Processing Time</span>
              </div>
              <span className="text-sm text-white font-light">{cardDetails.processingTime}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">What's Next?</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10">
              <FileText className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Document Verification</p>
                <p className="text-xs text-white/60 font-light">
                  Our team will verify your documents within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10">
              <Clock className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Approval & Card Dispatch</p>
                <p className="text-xs text-white/60 font-light">
                  Your card will be dispatched to your registered address in {cardDetails.processingTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10">
              <Award className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Status Updates</p>
                <p className="text-xs text-white/60 font-light">
                  We'll keep you updated via SMS and email at every stage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-4">
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium mb-2">Important Note</p>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Please ensure you activate your credit card as soon as you receive it. You'll receive a welcome kit with activation instructions along with your card.
              </p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 mb-32">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Need Help?</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-white/40" />
              <span className="text-white/60">Support:</span>
              <span className="text-white font-light">1800-XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-white/40" />
              <span className="text-white/60">Email:</span>
              <span className="text-white font-light">cards@superpay.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/my-cards")}
              className="flex-1 bg-white text-black hover:bg-white/90 py-6 rounded-none font-semibold transition-all duration-300"
              data-testid="button-view-cards"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              View My Cards
            </Button>
            
            <Button
              onClick={() => navigate("/home")}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 py-6 rounded-none font-semibold transition-all duration-300"
              data-testid="button-go-home"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
