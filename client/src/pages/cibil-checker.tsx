import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  Crown,
  Calculator,
  BarChart3,
  Percent,
  Calendar,
  Trophy,
  DollarSign,
  Brain,
  CreditCard,
  Phone,
  KeyRound,
  Building,
  Wrench,
  Activity,
  PieChart,
  X,
  BookOpen,
  Users,
  Zap,
  Eye
} from "lucide-react";

export default function CibilChecker() {
  const [scoreData, setScoreData] = useState<any>(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Mock last CIBIL score data
  const lastScore = {
    score: 765,
    lastUpdated: '15 Jan 2024'
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setOtpLoading(true);
    
    setTimeout(() => {
      setOtpSent(true);
      setModalStep(2);
      setOtpLoading(false);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${phoneNumber}`,
      });
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 4-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setOtpLoading(true);
    
    setTimeout(() => {
      setIsProcessing(true);
      setShowCheckModal(false);
    }, 1000);
    
    setTimeout(() => {
      const mockScore = 785;
      setScoreData({
        score: mockScore,
        grade: mockScore >= 750 ? 'Excellent' : mockScore >= 650 ? 'Good' : 'Fair',
        factors: [
          { factor: 'Payment History', impact: 'Positive', percentage: 92 },
          { factor: 'Credit Utilization', impact: 'Positive', percentage: 28 },
          { factor: 'Credit Age', impact: 'Positive', percentage: 68 },
          { factor: 'Credit Mix', impact: 'Positive', percentage: 75 },
        ],
        suggestions: [
          'Keep your credit utilization below 30%',
          'Pay all EMIs and credit card bills on time',
          'Maintain a healthy mix of secured and unsecured credit',
        ]
      });
      
      setIsProcessing(false);
      setOtpLoading(false);
      
      toast({
        title: "CIBIL Score Retrieved",
        description: `Your credit score is ${mockScore}! Excellent credit health.`,
      });
    }, 4000);
  };

  const resetModal = () => {
    setShowCheckModal(false);
    setModalStep(1);
    setPhoneNumber("");
    setOtp("");
    setOtpSent(false);
    setOtpLoading(false);
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-white/80';
    if (score >= 650) return 'text-white/80';
    return 'text-white/80';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 750) return <Award className="h-8 w-8" />;
    if (score >= 650) return <Target className="h-8 w-8" />;
    return <AlertCircle className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">CREDIT SCORE</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Shield className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              CREDIT HEALTH
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              Monitor your financial score
            </p>
          </div>
        </div>

        {/* Current Score Card */}
        {!scoreData ? (
          <>
            <Card className="bg-white/5 border border-white/10 rounded-none" data-testid="card-current-score">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto border-2 flex items-center justify-center ${
                    lastScore.score >= 750 ? 'border-white/20' : 
                    lastScore.score >= 650 ? 'border-white/20' : 'border-white/20'
                  }`}>
                    {getScoreIcon(lastScore.score)}
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-2">Your Current CIBIL Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(lastScore.score)}`}>
                      {lastScore.score}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <span className="text-white/60">Last Updated: {lastScore.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-white/80" />
                      <span className="text-white/80 font-semibold">+15</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-white/80 flex-shrink-0" />
                  <span className="text-xs text-white/60 truncate">Credit Utilization</span>
                </div>
                <p className="text-xl font-bold text-white/80 break-words">28%</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-white/80 flex-shrink-0" />
                  <span className="text-xs text-white/60 truncate">Payment History</span>
                </div>
                <p className="text-xl font-bold text-white/80 break-words">98%</p>
              </div>
            </div>

            {/* Check Score Button */}
            <Button
              onClick={() => setShowCheckModal(true)}
              className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none"
              data-testid="button-check-score"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Check Latest CIBIL Score
            </Button>
          </>
        ) : (
          <>
            {/* Score Result Card */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto border-2 flex items-center justify-center ${
                    scoreData.score >= 750 ? 'border-white/20' : 
                    scoreData.score >= 650 ? 'border-white/20' : 'border-white/20'
                  }`}>
                    {getScoreIcon(scoreData.score)}
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-2">Your Updated Credit Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(scoreData.score)}`}>
                      {scoreData.score}
                    </p>
                    <Badge className={`mt-3 ${
                      scoreData.score >= 750 ? 'bg-white/10 text-white/80 border-white/20' :
                      scoreData.score >= 650 ? 'bg-white/10 text-white/80 border-white/20' :
                      'bg-white/10 text-white/80 border-white/20'
                    } border`}>
                      {scoreData.grade}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5" />
                  Credit Score Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreData.factors.map((factor: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{factor.factor}</span>
                      <span className="text-sm text-white/60">{factor.percentage}%</span>
                    </div>
                    <Progress value={factor.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scoreData.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-white/80 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">{suggestion}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setScoreData(null);
                  resetModal();
                }}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-none"
                data-testid="button-check-again"
              >
                Check Again
              </Button>
              <Button
                onClick={() => navigate("/marketplace")}
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-apply-loan"
              >
                Apply for Loan
              </Button>
            </div>
          </>
        )}

        {/* Score Range Info */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5" />
              Understanding Your Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white">300-549</span>
              <Badge className="bg-white/10 text-white/80 border-white/20 border">Poor</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white">550-649</span>
              <Badge className="bg-white/10 text-white/80 border-white/20 border">Average</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white">650-749</span>
              <Badge className="bg-white/10 text-white/80 border-white/20 border">Good</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white">750-900</span>
              <Badge className="bg-white/10 text-white/80 border-white/20 border">Excellent</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP Modal */}
      <Dialog open={showCheckModal} onOpenChange={resetModal}>
        <DialogContent className="bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verify Your Identity
            </DialogTitle>
          </DialogHeader>
          
          {modalStep === 1 ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-white/80">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none"
                  data-testid="input-phone"
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-send-otp"
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-white/80">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none"
                  data-testid="input-otp"
                />
                <p className="text-xs text-white/60 mt-2">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>
              <Button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-verify-otp"
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                onClick={() => setModalStep(1)}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-none"
              >
                Change Number
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="bg-black border border-white/10 text-white">
          <div className="text-center py-8">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-white">Fetching Your Credit Score</p>
            <p className="text-sm text-white/60 mt-2">Please wait...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
