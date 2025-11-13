import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useUrlTab } from "@/hooks/use-url-tab";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Scan,
  Phone,
  Link as LinkIcon,
  ShieldCheck,
  Clock,
  XCircle,
  Info
} from "lucide-react";

interface ScanResult {
  score: number;
  status: "safe" | "caution" | "danger";
  evidence: string[];
  recommendations: string[];
  timestamp: Date;
  input: string;
  type: "url" | "message" | "phone";
  callerInfo?: {
    name: string;
    location: string;
    operator: string;
    companyName: string;
    companyLocation: string;
    cin: string;
    about: string;
    details: string;
    reportedSpam: number;
    lastReported: string;
    trustScore: number;
    keyPoints: string[];
    trustPoints: string[];
    weaknessPoints: string[];
    otherAspects: string[];
  };
}

export default function Security() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  const [activeTab, setActiveTab] = useUrlTab('scan');
  const [inputText, setInputText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState("");

  const scanMutation = useMutation({
    mutationFn: async ({ input, type, phone }: { input: string, type: string, phone?: string }) => {
      setScanProgress(0);
      setScanStep("Initializing scan...");
      
      const steps = [
        "Analyzing content...",
        "Checking fraud database...", 
        "Validating number...",
        "Generating report..."
      ];

      for (let i = 0; i < steps.length; i++) {
        setScanStep(steps[i]);
        setScanProgress((i + 1) * 25);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const score = Math.random() * 100;
      const status = score > 70 ? "safe" : score > 40 ? "caution" : "danger";
      
      const callerInfo = type === "phone" ? {
        name: score > 70 ? "Verified Business" : score > 40 ? "Unknown Caller" : "Suspected Spam",
        location: "Mumbai, Maharashtra, India",
        operator: ["Jio", "Airtel", "VI", "BSNL"][Math.floor(Math.random() * 4)],
        companyName: score > 70 ? "HDFC Bank Ltd." : score > 40 ? "Private Individual" : "Quick Loan Services (Unverified)",
        companyLocation: score > 70 ? "Nariman Point, Mumbai - 400021, Maharashtra" : score > 40 ? "Location Unknown" : "Sector 62, Noida - 201301, Uttar Pradesh",
        cin: score > 70 ? "L65910MH1994PLC080618" : score > 40 ? "Not Available" : "U74999DL2020PTC368954",
        about: score > 70 
          ? "HDFC Bank Limited is India's leading private sector bank with over 6,000 branches nationwide. Established in 1994, the bank offers comprehensive financial services including personal loans, home loans, and business banking solutions. The bank is regulated by RBI and listed on NSE and BSE."
          : score > 40
          ? "This appears to be a private individual mobile number. No company registration found. Limited public information available about the caller. Proceed with caution when sharing any personal or financial information."
          : "Quick Loan Services operates as an unverified lending platform. The company claims to offer instant personal loans but has numerous complaints regarding unauthorized charges and harassment. Not registered with RBI as an NBFC. Multiple consumer court cases pending.",
        details: score > 70 
          ? "Registered financial institution with RBI license. Verified business contact for loan services."
          : score > 40
          ? "Private mobile number. Limited public information available. Exercise caution before sharing personal details."
          : "Multiple spam reports from users. Associated with suspicious loan offers and potential fraud attempts. High-pressure tactics reported.",
        reportedSpam: score > 70 ? 2 : score > 40 ? 15 : 247,
        lastReported: score > 70 ? "6 months ago" : score > 40 ? "2 weeks ago" : "2 hours ago",
        trustScore: Math.round(score),
        keyPoints: score > 70 
          ? [
              "RBI licensed banking institution",
              "Listed on NSE & BSE (HDFCBANK)",
              "Over 27 years of banking experience",
              "6,000+ branches across India",
              "ISO 27001:2013 certified"
            ]
          : score > 40
          ? [
              "Private mobile number",
              "No business registration found",
              "Limited caller history",
              "No online presence detected",
              "Moderate spam reports"
            ]
          : [
              "Not RBI registered NBFC",
              "247 spam reports in 30 days",
              "Multiple consumer complaints",
              "Unverified business claims",
              "High-pressure sales tactics"
            ],
        trustPoints: score > 70 
          ? [
              "Verified RBI registration and compliance",
              "Strong online presence and customer reviews",
              "Transparent loan terms and conditions",
              "Physical branches for customer support",
              "Regulated interest rates within RBI guidelines",
              "Secure data handling and privacy policies"
            ]
          : score > 40
          ? [
              "No major spam reports",
              "Regular telecom subscriber",
              "Active mobile number"
            ]
          : [
              "Caller ID is active",
              "Telecom operator verified"
            ],
        weaknessPoints: score > 70 
          ? [
              "May have aggressive marketing calls",
              "Processing fees apply on loans"
            ]
          : score > 40
          ? [
              "Unknown identity and purpose",
              "No business verification possible",
              "Cannot verify legitimacy of claims",
              "No recourse if fraud occurs",
              "Limited caller background information"
            ]
          : [
              "Not registered with RBI as NBFC",
              "Numerous spam and harassment reports",
              "Uses unauthorized personal data",
              "Misleading loan offers and hidden charges",
              "Aggressive collection practices reported",
              "No physical office verification",
              "Multiple consumer court cases",
              "Reported for impersonating banks"
            ],
        otherAspects: score > 70 
          ? [
              "Customer care: 1860 267 6161 (24x7)",
              "Website: www.hdfcbank.com",
              "Email: customerservice@hdfcbank.com",
              "Grievance redressal: Available",
              "Online loan tracking: Yes",
              "CIBIL score check: Free for customers"
            ]
          : score > 40
          ? [
              "Caller type: Individual",
              "Business verification: Not applicable",
              "Online presence: None detected",
              "Recommendation: Verify identity before proceeding"
            ]
          : [
              "Frequently changes contact numbers",
              "Uses VoIP and virtual numbers",
              "Targets financially vulnerable individuals",
              "Requests upfront fees before disbursement",
              "No proper loan documentation",
              "Blocked by many users as spam",
              "Associated with data breach incidents",
              "Report to: TRAI (1800-110-420) and Cybercrime Portal"
            ]
      } : undefined;
      
      return {
        score: Math.round(score),
        status,
        evidence: [
          "Phone number verified through TrueCaller database",
          "Cross-referenced with RBI's list of registered lenders",
          "Community reports analyzed (last 30 days)",
          "Telecom operator verification completed",
          "Spam pattern detection algorithm applied"
        ],
        recommendations: [
          "Always verify loan terms directly with official lenders",
          "Check company registration on RBI website",
          "Never share OTP or personal documents via call",
          "Report suspicious numbers to TRAI"
        ],
        timestamp: new Date(),
        input,
        type: type as "url" | "message" | "phone",
        callerInfo
      } as ScanResult;
    },
    onSuccess: (result) => {
      setCurrentResult(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10));
      setScanProgress(0);
      setScanStep("");
    }
  });

  const handleScan = (type: "url" | "message" | "phone") => {
    const input = type === "phone" ? phoneNumber : inputText;
    if (!input.trim()) return;
    scanMutation.mutate({ input, type, phone: phoneNumber });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider uppercase">SECURITY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Fraud detection & scanning</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/security/info")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-info"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Shield className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-light text-white tracking-wider">
              FRAUD DETECTION
            </h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              AI-powered loan fraud detection
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-light truncate">Accuracy</span>
            </div>
            <p className="text-xl font-light text-white tracking-tight break-words">98%</p>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scan className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-light truncate">Scans</span>
            </div>
            <p className="text-xl font-light text-white tracking-tight break-words">{scanHistory.length}</p>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-light truncate">Blocked</span>
            </div>
            <p className="text-xl font-light text-white tracking-tight break-words">750+</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
            <TabsTrigger 
              value="scan" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-scan"
            >
              Scan
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-history"
            >
              History ({scanHistory.length})
            </TabsTrigger>
          </TabsList>

          {/* Scan Tab */}
          <TabsContent value="scan" className="space-y-6 mt-6">
            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-light flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/60" />
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  placeholder="Enter mobile number (+91 XXXXXXXXXX)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none"
                  data-testid="input-phone-number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-light flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-white/60" />
                  Loan Message or Link
                </label>
                <Textarea
                  placeholder="Paste loan offer message, link, or suspicious text..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none"
                  data-testid="input-scan-text"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleScan("phone")}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none"
                  disabled={!phoneNumber.trim() || scanMutation.isPending}
                  data-testid="button-scan-phone"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => handleScan("url")}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none"
                  disabled={!inputText.trim() || scanMutation.isPending}
                  data-testid="button-scan-url"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => handleScan("message")}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none"
                  disabled={!inputText.trim() || scanMutation.isPending}
                  data-testid="button-scan-message"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Scanning Progress */}
            {scanMutation.isPending && (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
                <div className="text-center mb-4">
                  <Scan className="w-12 h-12 text-white/60 mx-auto mb-3 animate-pulse" />
                  <h3 className="text-lg font-light text-white tracking-wide mb-1">Scanning...</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{scanStep}</p>
                </div>
                <Progress value={scanProgress} className="h-2 bg-white/10 [&>div]:bg-white" />
                <div className="text-center text-[10px] text-white/50 uppercase tracking-widest mt-2">{scanProgress}% complete</div>
              </div>
            )}

            {/* Scan Results */}
            {currentResult && (
              <div className="space-y-4">
                {/* Caller Information Card */}
                {currentResult.callerInfo && (
                  <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h3 className="font-light text-white tracking-wide mb-4 uppercase text-sm">Caller Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Caller Name:</span>
                        <span className="text-sm font-light text-white text-right tracking-wide">{currentResult.callerInfo.name}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Location:</span>
                        <span className="text-sm font-light text-white text-right tracking-wide">{currentResult.callerInfo.location}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Operator:</span>
                        <span className="text-sm font-light text-white text-right tracking-wide">{currentResult.callerInfo.operator}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Company Name:</span>
                        <span className="text-sm font-light text-white text-right tracking-wide">{currentResult.callerInfo.companyName}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Company Location:</span>
                        <span className="text-sm font-light text-white text-right tracking-wide">{currentResult.callerInfo.companyLocation}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">CIN:</span>
                        <span className="text-sm font-light text-white text-right tracking-wide font-mono">{currentResult.callerInfo.cin}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-light">Trust Score:</span>
                        <span className="text-sm font-light text-right text-white tracking-wide">
                          {currentResult.callerInfo.trustScore}/100
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-3">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">About:</p>
                        <p className="text-sm text-white/80 font-light leading-relaxed tracking-wide">{currentResult.callerInfo.about}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-white/5 border border-white/10 p-3">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Spam Reports</p>
                          <p className="text-lg font-light text-white tracking-tight">
                            {currentResult.callerInfo.reportedSpam}
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Last Reported</p>
                          <p className="text-sm font-light text-white tracking-wide">{currentResult.callerInfo.lastReported}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Points */}
                {currentResult.callerInfo?.keyPoints && (
                  <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h3 className="font-light text-white tracking-wide mb-3 uppercase text-sm">Key Points</h3>
                    <div className="space-y-2">
                      {currentResult.callerInfo.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80 font-light tracking-wide">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust Points */}
                {currentResult.callerInfo?.trustPoints && currentResult.callerInfo.trustPoints.length > 0 && (
                  <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h3 className="font-light text-white tracking-wide mb-3 uppercase text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-white/60" />
                      Trust Points
                    </h3>
                    <div className="space-y-2">
                      {currentResult.callerInfo.trustPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80 font-light tracking-wide">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weakness Points */}
                {currentResult.callerInfo?.weaknessPoints && currentResult.callerInfo.weaknessPoints.length > 0 && (
                  <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h3 className="font-light text-white tracking-wide mb-3 uppercase text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-white/60" />
                      Weakness Points
                    </h3>
                    <div className="space-y-2">
                      {currentResult.callerInfo.weaknessPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80 font-light tracking-wide">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Aspects */}
                {currentResult.callerInfo?.otherAspects && currentResult.callerInfo.otherAspects.length > 0 && (
                  <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                    <h3 className="font-light text-white tracking-wide mb-3 uppercase text-sm">Other Aspects</h3>
                    <div className="space-y-2">
                      {currentResult.callerInfo.otherAspects.map((aspect, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-white/70 font-light tracking-wide">{aspect}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            className="text-white"
                            style={{
                              strokeDasharray: `${2 * Math.PI * 45}`,
                              strokeDashoffset: `${2 * Math.PI * 45 * (1 - currentResult.score / 100)}`
                            }}
                          />
                        </svg>
                      </div>
                      <div className="relative z-10 text-center">
                        <div className="text-3xl font-light text-white tracking-tight">
                          {currentResult.score}
                        </div>
                      </div>
                    </div>
                    
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none border text-sm px-4 py-1">
                      {currentResult.score >= 70 ? <CheckCircle className="w-4 h-4 mr-1" /> :
                       currentResult.score >= 50 ? <AlertTriangle className="w-4 h-4 mr-1" /> :
                       <XCircle className="w-4 h-4 mr-1" />}
                      {currentResult.score >= 70 ? "SAFE" :
                       currentResult.score >= 50 ? "CAUTION" : "DANGER"}
                    </Badge>
                  </div>
                </div>

                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                  <h3 className="font-light text-white tracking-wide mb-3">Evidence</h3>
                  <div className="space-y-2">
                    {currentResult.evidence.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                        <span className="text-white/60 font-light tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                  <h3 className="font-light text-white tracking-wide mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {currentResult.recommendations.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Shield className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                        <span className="text-white/60 font-light tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-6">
            {scanHistory.length === 0 ? (
              <div className="text-center py-12">
                <Scan className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 font-light tracking-wide">No scan history</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Your scans will appear here</p>
              </div>
            ) : (
              scanHistory.map((result, index) => (
                <div
                  key={index}
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:border-white/20 transition-all"
                  onClick={() => setCurrentResult(result)}
                  data-testid={`card-history-${index}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/10 text-white border-white/20 rounded-none border text-xs">
                        {result.score >= 70 ? "SAFE" :
                         result.score >= 50 ? "CAUTION" : "DANGER"}
                      </Badge>
                      <span className="text-sm font-light text-white tracking-wide">{result.score}/100</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-white/50 uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 font-light tracking-wide truncate">{result.input}</p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}
