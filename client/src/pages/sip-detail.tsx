import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { getSIPPlan } from "@/data/sip-plans";
import { 
  ArrowLeft,
  TrendingUp,
  Star,
  Clock,
  Shield,
  Award,
  Target,
  CheckCircle,
  ChevronRight,
  DollarSign,
  BarChart3,
  Users,
  Calendar,
  Wallet,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SIPDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const sipId = params.id as string;
  const sip = getSIPPlan(sipId);
  const [selectedTab, setSelectedTab] = useUrlTab("overview");

  if (!sip) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4">SIP Plan not found</p>
          <Button onClick={() => navigate("/investment")} className="bg-white text-black hover:bg-white/90 rounded-none">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">SIP Details</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Systematic Investment Plan</p>
          </div>
          
          <Button
            onClick={() => navigate(`/investment/sip/${sipId.replace('sip-', '')}/buy`)}
            className="bg-white text-black hover:bg-white/90 rounded-none font-light text-sm"
            data-testid="button-start-sip"
          >
            Start
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="sip-summary">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-white/60" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-light text-white mb-1 tracking-wide">{sip.name}</h2>
                <p className="text-white/60 mb-2 font-light text-sm">{sip.fundHouse}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">{sip.category}</Badge>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">{sip.riskLevel}</Badge>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={cn(
                          "h-3 w-3",
                          star <= sip.rating ? "text-white fill-white" : "text-white/20"
                        )} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Current NAV</p>
                <p className="text-xl font-light text-white">₹{sip.navPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Min SIP</p>
                <p className="text-xl font-light text-white">₹{sip.minSipAmount}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">1Y Returns</p>
                <p className="text-xl font-light text-white">{sip.returns1y}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="manager" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-manager">Manager</TabsTrigger>
              <TabsTrigger value="benefits" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-benefits">Benefits</TabsTrigger>
              <TabsTrigger value="holdings" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-holdings">Holdings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-3">
              {/* About This SIP */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">About This SIP</h3>
                <p className="text-white/70 font-light text-sm mb-4">{sip.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">AUM</p>
                    <p className="text-sm font-light text-white">{sip.aum}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Expense Ratio</p>
                    <p className="text-sm font-light text-white">{sip.expenseRatio}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Lock-in Period</p>
                    <p className="text-sm font-light text-white">{sip.lockInPeriod}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Auto Debit</p>
                    <p className="text-sm font-light text-white">{sip.autoDebit ? "Available" : "Not Available"}</p>
                  </div>
                </div>
              </div>

              {/* Historical Returns */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Historical Returns</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-white/60 font-light">1 Year</span>
                      <span className="text-sm text-white font-light">{sip.returns1y}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5">
                      <div 
                        className="bg-white h-1.5 transition-all duration-300"
                        style={{ width: `${Math.min(sip.returns1y * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-white/60 font-light">3 Years</span>
                      <span className="text-sm text-white font-light">{sip.returns3y}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5">
                      <div 
                        className="bg-white h-1.5 transition-all duration-300"
                        style={{ width: `${Math.min(sip.returns3y * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-white/60 font-light">5 Years</span>
                      <span className="text-sm text-white font-light">{sip.returns5y}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5">
                      <div 
                        className="bg-white h-1.5 transition-all duration-300"
                        style={{ width: `${Math.min(sip.returns5y * 3, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ideal For */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Ideal For</h3>
                <div className="space-y-2">
                  {sip.idealFor.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-white/60" />
                      <p className="text-sm text-white/80 font-light">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Frequency */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Investment Frequency</h3>
                <div className="flex gap-2 flex-wrap">
                  {sip.frequency.map((freq) => (
                    <Badge key={freq} className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">
                      {freq}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Fund Manager Tab */}
            <TabsContent value="manager" className="mt-6 space-y-3">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-white mb-1">{sip.fundManager.name}</h3>
                    <p className="text-sm text-white/60 font-light mb-2">{sip.fundManager.expertise}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">
                        <Award className="h-3 w-3 mr-1" />
                        {sip.fundManager.experience}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Professional Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/60 font-light mb-2 uppercase tracking-widest">Experience</p>
                    <p className="text-sm text-white/80 font-light">{sip.fundManager.experience} in fund management with proven track record of consistent returns</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 font-light mb-2 uppercase tracking-widest">Expertise</p>
                    <p className="text-sm text-white/80 font-light">Specializes in {sip.fundManager.expertise} with deep understanding of market dynamics</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="mt-6 space-y-3">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Why Choose This SIP?</h3>
                <div className="space-y-2">
                  {sip.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-3 w-3 text-white/60 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/80 font-light flex-1">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <div className="flex items-start gap-4">
                  <Info className="h-5 w-5 text-white/60 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-light text-white mb-2">SIP Calculator</h4>
                    <p className="text-sm text-white/70 font-light mb-4">
                      Investing ₹{sip.recommendedAmount.toLocaleString()} monthly for 10 years at {sip.returns5y}% annual returns
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Total Investment</p>
                        <p className="text-lg font-light text-white">₹{(sip.recommendedAmount * 12 * 10).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-1">Est. Returns</p>
                        <p className="text-lg font-light text-white">₹{(sip.recommendedAmount * 12 * 10 * (1 + sip.returns5y/100)).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Holdings Tab */}
            <TabsContent value="holdings" className="mt-6 space-y-3">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-4">Top Holdings</h3>
                <div className="space-y-3">
                  {sip.topHoldings.map((holding, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-white/80 font-light">{holding.name}</p>
                        <p className="text-sm font-light text-white">{holding.percentage}%</p>
                      </div>
                      <div className="w-full bg-white/10 h-1.5">
                        <div 
                          className="bg-white h-1.5 transition-all duration-300"
                          style={{ width: `${holding.percentage * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-screen-lg mx-auto">
          <Button 
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light tracking-wider"
            onClick={() => navigate(`/investment/sip/${sipId.replace('sip-', '')}/buy`)}
            data-testid="button-buy-sip"
          >
            <Wallet className="h-5 w-5 mr-2" />
            BUY SIP
          </Button>
        </div>
      </div>
    </div>
  );
}
