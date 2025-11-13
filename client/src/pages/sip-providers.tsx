import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ArrowLeft, Star, TrendingUp, Shield, Target, Search } from "lucide-react";

const sipProviders = [
  {
    id: "hdfc-midcap-sip",
    name: "HDFC Mid-Cap Opportunities Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Mid Cap",
    minAmount: 500,
    returns1y: 28.5,
    returns3y: 22.3,
    returns5y: 19.8,
    rating: 4.8,
    riskLevel: "High",
    features: ["Top Performer", "Low Expense Ratio", "Tax Efficient", "Long Track Record"],
    logo: "💎"
  },
  {
    id: "sbi-bluechip-sip",
    name: "SBI Bluechip Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Large Cap",
    minAmount: 500,
    returns1y: 18.5,
    returns3y: 16.2,
    returns5y: 14.5,
    rating: 4.7,
    riskLevel: "Medium",
    features: ["Stable Returns", "Large Cap Focus", "Dividend Option", "Low Volatility"],
    logo: "🏆"
  },
  {
    id: "icici-tech-sip",
    name: "ICICI Prudential Technology Fund",
    fundHouse: "ICICI Prudential MF",
    category: "Sectoral",
    minAmount: 1000,
    returns1y: 35.2,
    returns3y: 28.5,
    returns5y: 24.1,
    rating: 4.6,
    riskLevel: "Very High",
    features: ["Tech Focused", "High Growth", "Global Exposure", "Innovation Theme"],
    logo: "🚀"
  },
  {
    id: "axis-flexi-sip",
    name: "Axis Flexi Cap Fund",
    fundHouse: "Axis Mutual Fund",
    category: "Flexi Cap",
    minAmount: 500,
    returns1y: 22.3,
    returns3y: 19.5,
    returns5y: 17.8,
    rating: 4.8,
    riskLevel: "High",
    features: ["All Cap Investment", "Flexible Allocation", "Consistent Performer", "Award Winner"],
    logo: "⭐"
  },
  {
    id: "mirae-emerging-sip",
    name: "Mirae Asset Emerging Bluechip",
    fundHouse: "Mirae Asset MF",
    category: "Large & Mid Cap",
    minAmount: 1000,
    returns1y: 25.8,
    returns3y: 21.2,
    returns5y: 18.9,
    rating: 4.7,
    riskLevel: "High",
    features: ["Best Seller", "Quality Companies", "Korean Expertise", "Growth Focus"],
    logo: "🌟"
  },
  {
    id: "parag-flexi-sip",
    name: "Parag Parikh Flexi Cap Fund",
    fundHouse: "PPFAS Mutual Fund",
    category: "Flexi Cap",
    minAmount: 1000,
    returns1y: 20.5,
    returns3y: 18.3,
    returns5y: 16.7,
    rating: 4.9,
    riskLevel: "High",
    features: ["Global Investing", "Value Approach", "Contrarian Style", "Low Cost"],
    logo: "🌍"
  },
  {
    id: "kotak-smallcap-sip",
    name: "Kotak Small Cap Fund",
    fundHouse: "Kotak Mahindra MF",
    category: "Small Cap",
    minAmount: 1000,
    returns1y: 32.5,
    returns3y: 25.8,
    returns5y: 21.3,
    rating: 4.5,
    riskLevel: "Very High",
    features: ["High Growth Potential", "Small Cap Focus", "Active Management", "Wealth Creator"],
    logo: "💰"
  },
  {
    id: "axis-liquid-sip",
    name: "Axis Liquid Fund",
    fundHouse: "Axis Mutual Fund",
    category: "Liquid",
    minAmount: 1000,
    returns1y: 6.8,
    returns3y: 6.2,
    returns5y: 5.9,
    rating: 4.6,
    riskLevel: "Low",
    features: ["Capital Safety", "High Liquidity", "Emergency Fund", "Stable Returns"],
    logo: "💵"
  },
  {
    id: "sbi-contra-sip",
    name: "SBI Contra Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Contra",
    minAmount: 500,
    returns1y: 24.5,
    returns3y: 20.3,
    returns5y: 17.5,
    rating: 4.5,
    riskLevel: "High",
    features: ["Contrarian Strategy", "Undervalued Stocks", "Long-term Focus", "Value Investing"],
    logo: "🎯"
  },
  {
    id: "hdfc-balanced-sip",
    name: "HDFC Balanced Advantage Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Hybrid",
    minAmount: 500,
    returns1y: 16.5,
    returns3y: 14.8,
    returns5y: 13.2,
    rating: 4.7,
    riskLevel: "Medium",
    features: ["Balanced Approach", "Dynamic Allocation", "Tax Efficient", "Risk Managed"],
    logo: "⚖️"
  }
];

export default function SIPProviders() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = sipProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.fundHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pagination = usePagination({
    data: filteredProviders,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SIP PLANS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Systematic Investment Plans</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 p-4 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Portfolio Value</p>
            <p className="text-xl font-light text-white">₹99.9K</p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Today's Change</p>
            <p className="text-xl font-light text-green-400">+0.53%</p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Today's Profit</p>
            <p className="text-xl font-light text-green-400">+₹530</p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Holdings</p>
            <p className="text-xl font-light text-white">5</p>
          </div>
        </div>

        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger value="explore" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-explore">
              Explore
            </TabsTrigger>
            <TabsTrigger value="holdings" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-holdings">
              Holdings
            </TabsTrigger>
            <TabsTrigger value="pay-history" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-pay-history">
              Pay History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SIP plans..."
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-providers"
              />
            </div>

            <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <div className="flex gap-3">
                <Target className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-light text-white mb-1 tracking-wider">BUILD WEALTH SYSTEMATICALLY</h3>
                  <p className="text-sm text-white/40 font-light">Start investing with as little as ₹500 per month and grow your wealth over time</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredProviders.length > 0 ? pagination.paginatedData.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => navigate(`/investment/sip/${provider.id}`)}
                  className="w-full p-5 border-b border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left"
                  data-testid={`card-sip-provider-${provider.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-xl flex-shrink-0">
                          {provider.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-0.5 tracking-wide">{provider.name}</h3>
                          <p className="text-xs text-white/50 mb-2 font-light uppercase tracking-wider">{provider.fundHouse}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs font-light">
                              {provider.category}
                            </Badge>
                            <Badge className={`rounded-none text-xs font-light ${
                              provider.riskLevel === 'Low' ? 'bg-white/10 text-white border-white/20' :
                              provider.riskLevel === 'Medium' ? 'bg-white/15 text-white border-white/20' :
                              provider.riskLevel === 'High' ? 'bg-white/20 text-white border-white/30' :
                              'bg-white/25 text-white border-white/40'
                            }`}>
                              {provider.riskLevel} Risk
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-white/60 fill-white/60" />
                              <span className="text-xs text-white/60">{provider.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-white/40 uppercase tracking-wider font-light">1Y Returns</div>
                        <div className="text-lg font-bold text-white">{provider.returns1y}%</div>
                        <div className="text-xs text-white/40 font-light">p.a.</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="text-xs text-white/50 font-light">
                        Min. <span className="text-white font-medium">₹{provider.minAmount}</span>/month
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-white/50 font-light">
                          3Y: <span className="text-white">{provider.returns3y}%</span>
                        </div>
                        <div className="text-xs text-white/50 font-light">
                          5Y: <span className="text-white">{provider.returns5y}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO PLANS FOUND</h3>
                  <p className="text-white/40 text-sm font-light">Try adjusting your search query</p>
                </div>
              )}
            </div>

            {filteredProviders.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.goToPage}
                canGoNext={pagination.canGoNext}
                canGoPrevious={pagination.canGoPrevious}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
                className="mt-6"
              />
            )}

            <div className="border border-white/20 p-6 bg-white/5">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2 tracking-wide uppercase text-sm">Why Start a SIP?</h4>
                  <ul className="space-y-1.5 text-sm text-white/60 font-light">
                    <li>• Rupee cost averaging reduces market timing risk</li>
                    <li>• Build wealth with small monthly investments</li>
                    <li>• Power of compounding over long term</li>
                    <li>• Disciplined and automated investing</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="mt-6">
            <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
              <Target className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO SIP HOLDINGS</h3>
              <p className="text-white/40 text-sm font-light mb-4">You don't have any active SIPs yet</p>
              <Button
                onClick={() => navigate("/investment")}
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-start-investing"
              >
                Start SIP
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
              <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO PAYMENT HISTORY</h3>
              <p className="text-white/40 text-sm font-light">Your SIP payment history will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
