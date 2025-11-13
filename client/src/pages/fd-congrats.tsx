import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, FileText, Building2, Calendar, ArrowLeft } from "lucide-react";

export default function FDCongrats() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Confetti effect or celebration animation can be added here
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get("amount") || "10000";
  const tenure = urlParams.get("tenure") || "12";
  const fdId = urlParams.get("id") || "1";

  const maturityDate = new Date(Date.now() + parseInt(tenure) * 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-none bg-white/10 flex items-center justify-center animate-pulse border border-white/20">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-white">FD Opened Successfully!</h1>
          <p className="text-white/70">Your fixed deposit has been confirmed</p>
        </div>

        {/* FD Details */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Deposit Amount</span>
              <span className="text-2xl font-light text-white">₹{parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Tenure</span>
              <span className="text-white">{tenure} Months</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Maturity Date</span>
              <span className="text-white">{maturityDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Status</span>
              <span className="text-white font-light">Active</span>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-light text-white mb-2">What's Next?</h3>
                <ul className="space-y-2 text-sm text-white/70 font-light">
                  <li>• FD certificate will be emailed within 24 hours</li>
                  <li>• Interest will be credited as per chosen frequency</li>
                  <li>• Maturity amount will be auto-credited on maturity date</li>
                  <li>• You can view FD details anytime in "My FDs"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/home")}
            className="w-full bg-white text-black hover:bg-white/90 h-12 font-light"
            data-testid="button-go-home"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Home
          </Button>

          <Button
            onClick={() => navigate("/investment")}
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 h-12 font-light"
            data-testid="button-explore-investments"
          >
            Explore More Investments
          </Button>
        </div>
      </div>
    </div>
  );
}
