import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ArrowLeft, Star, TrendingUp, Shield, Award, Gem, Search } from "lucide-react";

const diamondProviders = [
  {
    id: "debeers-diamond",
    name: "De Beers Lightbox",
    provider: "De Beers Group",
    minInvestment: 50000,
    grade: "VS-VVS Clarity",
    currentRate: 25000,
    rating: 4.9,
    features: ["Lab-Grown Diamonds", "IGI Certified", "Sustainable", "Premium Quality"],
    logo: "💎"
  },
  {
    id: "bluestone-diamond",
    name: "BlueStone Diamond Investment",
    provider: "BlueStone",
    minInvestment: 25000,
    grade: "SI-VS Clarity",
    currentRate: 22000,
    rating: 4.7,
    features: ["Certified Diamonds", "Buyback Option", "Exchange Benefits", "IGI/GIA Certified"],
    logo: "💍"
  },
  {
    id: "tanishq-diamond",
    name: "Tanishq Diamond Plan",
    provider: "Tanishq (Titan)",
    minInvestment: 30000,
    grade: "VS Clarity",
    currentRate: 24000,
    rating: 4.8,
    features: ["Tata Trust", "Exchange Scheme", "Premium Service", "Certified Quality"],
    logo: "✨"
  },
  {
    id: "caratlane-diamond",
    name: "CaratLane Diamond",
    provider: "CaratLane (Tanishq)",
    minInvestment: 20000,
    grade: "SI-VS Clarity",
    currentRate: 21000,
    rating: 4.6,
    features: ["100% Certified", "Lifetime Exchange", "IGI Certified", "Online Tracking"],
    logo: "👑"
  },
  {
    id: "igi-diamond",
    name: "IGI Certified Diamonds",
    provider: "International Gemological Institute",
    minInvestment: 40000,
    grade: "VVS-IF Clarity",
    currentRate: 28000,
    rating: 4.9,
    features: ["World Standard", "Highest Grade", "Investment Grade", "Global Recognition"],
    logo: "🔷"
  },
  {
    id: "pc-diamond",
    name: "PC Jeweller Diamond",
    provider: "PC Jeweller",
    minInvestment: 35000,
    grade: "VS Clarity",
    currentRate: 23000,
    rating: 4.5,
    features: ["Certified Quality", "Exchange Benefits", "Store Credit", "Wide Network"],
    logo: "💠"
  }
];

export default function DiamondProviders() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = diamondProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.grade.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-base font-bold tracking-wider">DIAMOND INVESTMENT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Choose Your Provider</p>
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
                placeholder="Search providers..."
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-providers"
              />
            </div>

            <div className="space-y-3">
              {filteredProviders.length > 0 ? pagination.paginatedData.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => navigate(`/investment/diamond/${provider.id}`)}
                  className="w-full p-5 border-b border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left"
                  data-testid={`card-diamond-provider-${provider.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-xl flex-shrink-0">
                          {provider.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-0.5 tracking-wide">{provider.name}</h3>
                          <p className="text-xs text-white/50 mb-2 font-light uppercase tracking-wider">{provider.provider}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60 font-light">{provider.grade}</span>
                            <span className="text-white/30">•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-white/60 fill-white/60" />
                              <span className="text-xs text-white/60">{provider.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-white/40 uppercase tracking-wider font-light">Rate</div>
                        <div className="text-lg font-bold text-white">₹{provider.currentRate}</div>
                        <div className="text-xs text-white/40 font-light">/carat</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="text-xs text-white/50 font-light">
                        Min. <span className="text-white font-medium">₹{provider.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {provider.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="text-xs text-white/50 font-light">• {feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO PROVIDERS FOUND</h3>
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
                <Award className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2 tracking-wide uppercase text-sm">Why Invest in Diamonds?</h4>
                  <ul className="space-y-1.5 text-sm text-white/60 font-light">
                    <li>• High value retention and appreciation potential</li>
                    <li>• Portable and compact wealth storage</li>
                    <li>• All diamonds are certified by IGI/GIA</li>
                    <li>• Exchange benefits and buyback guarantees</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="mt-6">
            <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
              <Gem className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO DIAMOND HOLDINGS</h3>
              <p className="text-white/40 text-sm font-light mb-4">You don't have any diamond investments yet</p>
              <Button
                onClick={() => navigate("/investment")}
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-start-investing"
              >
                Start Investing
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
              <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO PAYMENT HISTORY</h3>
              <p className="text-white/40 text-sm font-light">Your diamond purchase history will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
