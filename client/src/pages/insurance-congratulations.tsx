import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  CheckCircle,
  Shield,
  Calendar,
  Hash,
  Building2,
  FileText,
  Home,
  CreditCard,
  Clock,
  Award,
  User,
  Mail,
  Phone
} from "lucide-react";

export default function InsuranceCongratulations() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const insuranceDetails = {
    policyType: "Car Insurance",
    policyNumber: "INS-" + Date.now().toString().slice(-10),
    coverage: "₹5,00,000",
    premium: "₹12,000/year",
    tenure: "1 Year",
    paymentMode: "Annually",
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    provider: "SuperPay Insurance",
    transactionId: "TXN" + Date.now().toString().slice(-8)
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
            <h1 className="text-base font-bold tracking-wider">INSURANCE PURCHASED</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Policy Active
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
              Your insurance has been purchased successfully
            </p>
            <Badge className="bg-green-500/10 text-green-400 border-green-400/20 rounded-none">
              <Shield className="h-3 w-3 mr-1" />
              Policy Active
            </Badge>
          </div>
        </div>

        {/* Policy Information */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Policy Details</p>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Policy Type</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.policyType}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Policy Number</span>
              </div>
              <span className="text-sm text-white font-light font-mono">{insuranceDetails.policyNumber}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Provider</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.provider}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Coverage Amount</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.coverage}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Premium</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.premium}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Policy Tenure</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.tenure}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Payment Mode</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.paymentMode}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Purchase Date</span>
              </div>
              <span className="text-sm text-white font-light">{insuranceDetails.date}</span>
            </div>

            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Transaction ID</span>
              </div>
              <span className="text-sm text-white font-light font-mono">{insuranceDetails.transactionId}</span>
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
                <p className="text-sm text-white font-medium mb-1">Policy Documents</p>
                <p className="text-xs text-white/60 font-light">
                  Your policy documents will be sent to your registered email within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10">
              <Clock className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Coverage Active</p>
                <p className="text-xs text-white/60 font-light">
                  Your insurance coverage is active immediately from today
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10">
              <Award className="h-5 w-5 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Premium Reminders</p>
                <p className="text-xs text-white/60 font-light">
                  We'll remind you before your next premium payment is due
                </p>
              </div>
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
              <span className="text-white font-light">support@superpay.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/my-insurance")}
              className="flex-1 bg-white text-black hover:bg-white/90 py-6 rounded-none font-semibold transition-all duration-300"
              data-testid="button-view-insurance"
            >
              <Shield className="h-5 w-5 mr-2" />
              View My Insurance
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
