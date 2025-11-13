import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";

export default function NotFound() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      goBack();
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Content Area */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-white/60" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-5xl font-light text-white mb-3 tracking-wider">404</h1>
            <h2 className="text-xl font-light text-white/80 mb-4 uppercase tracking-widest">Page Not Found</h2>
            
            <p className="text-base text-white/60 font-light leading-relaxed">
              This is one page which we don't want you to see
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons - Black & White Theme */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="grid grid-cols-2 gap-3 max-w-screen-lg mx-auto">
          <Button
            onClick={handleBack}
            className="bg-black text-white border border-white/20 hover:bg-white/5 h-12 font-light tracking-wide rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => navigate("/home")}
            className="bg-white text-black hover:bg-white/90 h-12 font-light tracking-wide rounded-none"
            data-testid="button-go-home"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
