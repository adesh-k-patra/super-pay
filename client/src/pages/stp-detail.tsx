import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { ArrowLeft, Wallet, ArrowRightLeft, Shield, Star, CheckCircle } from "lucide-react";
import { getSTPPlan } from "@/data/stp-plans";

export default function STPDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const stpId = params.id;
  const stp = getSTPPlan(stpId || "");
  const [selectedTab, setSelectedTab] = useUrlTab("overview");

  if (!stp) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white/60 mb-4 font-light">STP Plan not found</p>
          <Button onClick={() => navigate("/investment/stp")} className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
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
            <h1 className="text-base font-bold tracking-wider uppercase">STP Details</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Transfer Plan</p>
          </div>
          <Button
            onClick={() => navigate(`/investment/stp/${stpId}/buy`)}
            className="bg-white text-black hover:bg-white/90 rounded-none font-light text-sm"
            data-testid="button-start-stp"
          >
            Start
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="stp-summary">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
                <ArrowRightLeft className="h-6 w-6 text-white/60" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-light text-white mb-1 tracking-wide">{stp.name}</h2>
                <p className="text-white/60 mb-2 font-light text-sm">{stp.fundHouse}</p>
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light text-[10px] uppercase tracking-widest">{stp.category}</Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(stp.rating) ? 'text-white fill-white' : 'text-white/20'}`} />
                    ))}
                    <span className="text-sm text-white/80 ml-1 font-light">{stp.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-features">Features</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-3">
              {/* Transfer Route */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Transfer Route</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-white/60 text-[10px] mb-1 uppercase tracking-widest font-light">From</div>
                    <div className="text-white font-light text-sm">{stp.fromFund}</div>
                  </div>
                  <ArrowRightLeft className="h-5 w-5 text-white/60" />
                  <div className="flex-1">
                    <div className="text-white/60 text-[10px] mb-1 uppercase tracking-widest font-light">To</div>
                    <div className="text-white font-light text-sm">{stp.toFund}</div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Key Features</h3>
                <div className="space-y-2">
                  {stp.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-3 w-3 text-white/60" />
                      <span className="text-white/80 font-light text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEBI Info */}
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white/60" />
                  </div>
                  <div>
                    <h4 className="font-light text-white mb-1 tracking-wide text-sm">SEBI Registered</h4>
                    <p className="text-xs text-white/60 font-light">This plan is regulated by SEBI and managed by professional fund managers</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="mt-6 space-y-3">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Why Choose This STP?</h3>
                <div className="space-y-2">
                  {stp.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-3 w-3 text-white/60 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 font-light text-sm flex-1">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5">
                <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-3">Benefits</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-3 w-3 text-white/60 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 font-light text-sm flex-1">Systematic wealth transfer between funds</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-3 w-3 text-white/60 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 font-light text-sm flex-1">Risk mitigation through gradual investment</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-3 w-3 text-white/60 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 font-light text-sm flex-1">Automated fund management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-3 w-3 text-white/60 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 font-light text-sm flex-1">Professional fund selection and timing</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={() => navigate(`/investment/stp/${stpId}/buy`)}
            className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-light tracking-wider rounded-none"
            data-testid="button-buy-stp"
          >
            <Wallet className="h-5 w-5 mr-2" />
            START STP
          </Button>
        </div>
      </div>
    </div>
  );
}
