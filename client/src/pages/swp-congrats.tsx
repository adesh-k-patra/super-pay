import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, TrendingDown, ArrowLeft } from "lucide-react";

export default function SWPCongrats() {
  const [, navigate] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get("amount") || "5000";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex justify-center">
          <div className="bg-white/10 border border-white/20 rounded-none p-6 animate-pulse">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-white tracking-wider">SWP Started Successfully!</h1>
          <p className="text-white/60 font-light">Your systematic withdrawal plan is now active</p>
        </div>

        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-none space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-xs uppercase tracking-widest font-light">Withdrawal Amount</span>
            <span className="text-2xl font-light text-white">₹{parseFloat(amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60 font-light">Frequency</span>
            <span className="text-white font-light">Monthly</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60 font-light">Status</span>
            <span className="text-white font-light">Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer rounded-none p-5 text-center" onClick={() => navigate("/investment/swp")}>
            <div className="bg-white/10 border border-white/20 rounded-none p-3 inline-block mb-2">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-white font-light tracking-wider">My SWPs</p>
          </div>
          <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer rounded-none p-5 text-center" onClick={() => navigate("/investment")}>
            <div className="bg-white/10 border border-white/20 rounded-none p-3 inline-block mb-2">
              <Home className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-white font-light tracking-wider">Investments</p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/home")}
          className="w-full bg-white text-black hover:bg-white/90 h-12 font-light tracking-wider rounded-none"
          data-testid="button-go-home"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
