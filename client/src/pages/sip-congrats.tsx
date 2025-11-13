import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, FileText, TrendingUp, Calendar, ArrowLeft } from "lucide-react";

export default function SIPCongrats() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Confetti effect or celebration animation can be added here
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get("amount") || "5000";
  const sipId = urlParams.get("id") || "1";

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
          <div className="w-24 h-24 rounded-none bg-white/10 flex items-center justify-center animate-pulse">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-white">SIP Started Successfully!</h1>
          <p className="text-white/70">Your systematic investment plan is now active</p>
        </div>

        {/* Investment Details */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Monthly Investment</span>
              <span className="text-2xl font-light text-white">₹{parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Frequency</span>
              <span className="text-white">Monthly</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">First Payment</span>
              <span className="text-white">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Status</span>
              <span className="text-white/80 font-light">Active</span>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-light text-white mb-2">What's Next?</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• First installment will be auto-debited on the selected date</li>
                  <li>• You'll receive confirmation via email & SMS</li>
                  <li>• Track your SIP performance in "My SIPs" section</li>
                  <li>• You can pause or modify your SIP anytime</li>
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
