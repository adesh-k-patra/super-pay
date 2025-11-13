import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Download, 
  Share, 
  Calendar, 
  TrendingUp, 
  Clock,
  DollarSign,
  Target,
  Star,
  Shield,
  Building,
  Copy,
  Mail,
  Bell,
  ArrowLeft
} from "lucide-react";

export default function MutualFundConfirmation() {
  const [, navigate] = useLocation();

  // Mock data - would normally come from the investment flow
  const investmentDetails = {
    fundName: "Axis Bluechip Fund",
    fundHouse: "Axis Mutual Fund",
    fundLogo: "🏛️",
    investmentType: "SIP",
    amount: 5000,
    frequency: "Monthly",
    duration: "5 years",
    expectedReturns: 14.2,
    folio: "AFB12345678",
    orderNumber: "ORD202412150001",
    transactionId: "TXN5f7a8b9c0d",
    unitAllotted: 95.46,
    nav: 52.35,
    totalInvestment: 300000, // 5000 * 12 * 5
    expectedValue: 485000,
    totalGains: 185000,
    sipDate: 15,
    startDate: "15 Dec 2024",
    maturityDate: "15 Dec 2029",
    status: "Confirmed"
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could show a toast notification here
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider mb-2" data-testid="page-title">
            INVESTMENT CONFIRMED!
          </h1>
          <p className="text-white/60">Your mutual fund investment has been successfully set up</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Investment Summary */}
        <Card className="bg-black border-white/20 rounded-none mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="h-5 w-5" />
              Investment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Reference */}
            <div className="bg-white/10 border border-white/20 rounded-none p-4">
              <div className="text-center">
                <p className="text-sm text-white/60 mb-1 font-light">Order Reference</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-white" data-testid="order-reference">
                    {investmentDetails.orderNumber}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(investmentDetails.orderNumber)}
                    className="text-white hover:text-white/80"
                    data-testid="button-copy-order"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Fund Information */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-none flex items-center justify-center text-white text-2xl border border-white/20">
                {investmentDetails.fundLogo}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{investmentDetails.fundName}</h3>
                <p className="text-white/80">{investmentDetails.fundHouse}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-white/10 text-white border-white/20 font-light rounded-none">
                    Large Cap Fund
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-white fill-current" />
                    <span className="text-white">4.5</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">₹{investmentDetails.nav}</p>
                <p className="text-sm text-white/60">NAV</p>
              </div>
            </div>

            <Separator className="bg-white/20" />

            {/* Investment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm">Investment Type</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <p className="text-white font-medium">{investmentDetails.investmentType}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">Monthly Amount</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-white" />
                    <p className="text-white font-medium">₹{investmentDetails.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">SIP Frequency</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-white" />
                    <p className="text-white font-medium">{investmentDetails.frequency}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">Investment Duration</p>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-white" />
                    <p className="text-white font-medium">{investmentDetails.duration}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm">Folio Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{investmentDetails.folio}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(investmentDetails.folio)}
                      className="text-white hover:text-white/80"
                      data-testid="button-copy-folio"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">SIP Date</p>
                  <p className="text-white font-medium">{investmentDetails.sipDate}th of every month</p>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">First SIP</p>
                  <p className="text-white font-medium">{investmentDetails.startDate}</p>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm">Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{investmentDetails.transactionId}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(investmentDetails.transactionId)}
                      className="text-white hover:text-white/80"
                      data-testid="button-copy-transaction"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Projection */}
        <Card className="bg-black border-white/20 rounded-none mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Investment Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white/10 border border-white/20 rounded-none">
                <p className="text-2xl font-light text-white">{formatCurrency(investmentDetails.totalInvestment)}</p>
                <p className="text-sm text-white/60 font-light">Total Investment</p>
                <p className="text-xs text-white/60 mt-1">Over {investmentDetails.duration}</p>
              </div>
              
              <div className="p-4 bg-white/10 border border-white/20 rounded-none">
                <p className="text-2xl font-light text-white">{formatCurrency(investmentDetails.expectedValue)}</p>
                <p className="text-sm text-white/60 font-light">Expected Value</p>
                <p className="text-xs text-white/60 mt-1">At {investmentDetails.expectedReturns}% CAGR</p>
              </div>
              
              <div className="p-4 bg-white/10 border border-white/20 rounded-none">
                <p className="text-2xl font-light text-white">{formatCurrency(investmentDetails.totalGains)}</p>
                <p className="text-sm text-white/60 font-light">Expected Gains</p>
                <p className="text-xs text-white/60 mt-1">Potential wealth creation</p>
              </div>
              
              <div className="p-4 bg-white/10 border border-white/20 rounded-none">
                <p className="text-2xl font-light text-white">
                  {((investmentDetails.totalGains / investmentDetails.totalInvestment) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-white/60 font-light">Total Returns</p>
                <p className="text-xs text-white/60 mt-1">Growth percentage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-black border-white/20 rounded-none mb-6">
          <CardHeader>
            <CardTitle className="text-white">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-white mt-0.5" />
              <div>
                <p className="text-white font-medium">Next SIP Deduction</p>
                <p className="text-white/60">Your first SIP will be debited on {investmentDetails.startDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="h-4 w-4 text-white mt-0.5" />
              <div>
                <p className="text-white font-medium">SMS & Email Alerts</p>
                <p className="text-white/60">You'll receive confirmations for each SIP installment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-white mt-0.5" />
              <div>
                <p className="text-white font-medium">Investment Tracking</p>
                <p className="text-white/60">Monitor your investment performance in the portfolio section</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            variant="outline"
            className="border-white/20 text-white rounded-none h-12"
            data-testid="button-download-confirmation"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Confirmation
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white rounded-none h-12"
            data-testid="button-share"
          >
            <Share className="h-4 w-4 mr-2" />
            Share Details
          </Button>
          <Button
            onClick={() => navigate("/investment")}
            className="bg-white/10 hover:bg-white/20 text-white rounded-none h-12 border border-white/20 font-light"
            data-testid="button-explore-more"
          >
            Explore More Funds
          </Button>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-2">
          <Button
            onClick={() => navigate("/investment")}
            variant="link"
            className="text-white/80 hover:text-white/70"
            data-testid="button-portfolio"
          >
            View Portfolio
          </Button>
          <br />
          <Button
            onClick={() => navigate("/home")}
            variant="link"
            className="text-white/60 hover:text-white/80"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}