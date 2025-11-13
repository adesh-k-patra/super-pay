import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  TrendingUp,
  Shield,
  Search,
  Repeat,
  Star,
  Plus
} from "lucide-react";

const sipPlans = [
  { id: "hdfc-sip", name: "HDFC Top 100 Fund", fundHouse: "HDFC Mutual Fund", category: "Large Cap", minAmount: 500, returns: "15.2%", rating: 4.8, logo: "📈" },
  { id: "icici-sip", name: "ICICI Prudential Bluechip Fund", fundHouse: "ICICI Prudential MF", category: "Large Cap", minAmount: 1000, returns: "14.8%", rating: 4.7, logo: "💼" },
  { id: "sbi-sip", name: "SBI Small Cap Fund", fundHouse: "SBI Mutual Fund", category: "Small Cap", minAmount: 500, returns: "18.5%", rating: 4.6, logo: "🚀" },
  { id: "axis-sip", name: "Axis Mid Cap Fund", fundHouse: "Axis Mutual Fund", category: "Mid Cap", minAmount: 1000, returns: "17.2%", rating: 4.7, logo: "📊" },
  { id: "kotak-sip", name: "Kotak Equity Opportunities Fund", fundHouse: "Kotak Mahindra MF", category: "Multi Cap", minAmount: 1000, returns: "16.3%", rating: 4.8, logo: "⭐" },
  { id: "franklin-sip", name: "Franklin India Flexi Cap Fund", fundHouse: "Franklin Templeton MF", category: "Flexi Cap", minAmount: 500, returns: "15.9%", rating: 4.5, logo: "💹" },
  { id: "dsp-sip", name: "DSP Small Cap Fund", fundHouse: "DSP Mutual Fund", category: "Small Cap", minAmount: 1000, returns: "19.1%", rating: 4.7, logo: "🎯" },
  { id: "nippon-sip", name: "Nippon India Large Cap Fund", fundHouse: "Nippon India MF", category: "Large Cap", minAmount: 500, returns: "14.5%", rating: 4.6, logo: "🏛️" },
  { id: "aditya-sip", name: "Aditya Birla Sun Life Tax Relief", fundHouse: "Aditya Birla MF", category: "ELSS", minAmount: 500, returns: "13.8%", rating: 4.5, logo: "🌟" },
  { id: "uti-sip", name: "UTI Nifty Index Fund", fundHouse: "UTI Mutual Fund", category: "Index Fund", minAmount: 500, returns: "12.5%", rating: 4.4, logo: "📉" },
  { id: "tata-sip", name: "Tata Digital India Fund", fundHouse: "Tata Mutual Fund", category: "Sectoral", minAmount: 500, returns: "20.3%", rating: 4.6, logo: "💻" },
  { id: "mirae-sip", name: "Mirae Asset Large Cap Fund", fundHouse: "Mirae Asset MF", category: "Large Cap", minAmount: 1000, returns: "15.7%", rating: 4.7, logo: "🏆" },
];

const sipHoldings = [
  { id: "1", name: "HDFC Mid-Cap Opportunities Fund", fundHouse: "HDFC Mutual Fund", amount: "5,000", frequency: "Monthly", nextPayment: "Feb 05, 2024", totalInvested: 180000, currentValue: 215000, status: "Active" },
  { id: "2", name: "SBI Bluechip Fund", fundHouse: "SBI Mutual Fund", amount: "10,000", frequency: "Monthly", nextPayment: "Feb 10, 2024", totalInvested: 240000, currentValue: 285000, status: "Active" },
  { id: "3", name: "ICICI Prudential Technology Fund", fundHouse: "ICICI Prudential", amount: "3,000", frequency: "Monthly", nextPayment: "Feb 15, 2024", totalInvested: 54000, currentValue: 68000, status: "Active" }
];

export default function SipList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Large Cap", "Mid Cap", "Small Cap", "Multi Cap", "Flexi Cap", "ELSS", "Index Fund", "Sectoral"];

  const filteredPlans = useMemo(() => {
    let plans = sipPlans;
    
    if (selectedCategory !== "All") {
      plans = plans.filter(plan => plan.category === selectedCategory);
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      plans = plans.filter(plan =>
        plan.name.toLowerCase().includes(lowerQuery) ||
        plan.fundHouse.toLowerCase().includes(lowerQuery) ||
        plan.category.toLowerCase().includes(lowerQuery)
      );
    }
    return plans;
  }, [searchQuery, selectedCategory]);

  const pagination = usePagination({
    data: filteredPlans,
    itemsPerPage: 10,
  });

  const holdingStats = useMemo(() => {
    const totalValue = sipHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = sipHoldings.reduce((sum, h) => sum + h.totalInvested, 0);
    const totalChange = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: sipHoldings.length
    };
  }, []);

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
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Systematic Investment</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/sip/new")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-new-sip"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Portfolio Value</p>
            <p className="text-xl font-light text-white">₹{Number(holdingStats.totalValue).toLocaleString()}</p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Today's Change</p>
            <p className={cn("text-xl font-light", Number(holdingStats.changePercent) >= 0 ? "text-green-400" : "text-red-400")}>
              {Number(holdingStats.changePercent) >= 0 ? "+" : ""}{holdingStats.changePercent}%
            </p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Today's Profit</p>
            <p className={cn("text-xl font-light", Number(holdingStats.totalChange) >= 0 ? "text-green-400" : "text-red-400")}>
              {Number(holdingStats.totalChange) >= 0 ? "+" : "-"}₹{Math.abs(Number(holdingStats.totalChange)).toLocaleString()}
            </p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Holdings</p>
            <p className="text-xl font-light text-white">{holdingStats.holdings}</p>
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
                placeholder="Search SIP plans by name, fund house, or category..."
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-sip"
              />
            </div>

            {/* Category Filter */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 text-xs uppercase tracking-widest font-light border transition-all whitespace-nowrap",
                      selectedCategory === category
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    )}
                    data-testid={`filter-category-${category.toLowerCase().replace(' ', '-')}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-0 border-t border-white/10">
              {filteredPlans.length > 0 ? pagination.paginatedData.map((plan) => (
                <div 
                  key={plan.id}
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3"
                  onClick={() => navigate(`/investment/sip/${plan.id}`)}
                  data-testid={`card-sip-${plan.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">
                        {plan.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white text-sm truncate">{plan.name}</h3>
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-white fill-white" />
                            <span className="text-xs text-white/80">{plan.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-white/50 mb-3">{plan.fundHouse}</p>
                        
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Min. SIP</p>
                            <p className="text-base font-medium text-white">₹{plan.minAmount}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Returns</p>
                            <p className="text-base font-medium text-green-400">{plan.returns}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Category</p>
                            <p className="text-xs font-medium text-white truncate">{plan.category}</p>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="text-[10px] bg-white/10 text-white/70 border-white/20 rounded-sm px-1.5 py-0">
                          {plan.category}
                        </Badge>
                      </div>
                    </div>
                    <Repeat className="h-5 w-5 text-white/40 flex-shrink-0 mt-1" />
                  </div>
                </div>
              )) : (
                <div className="border border-white/20 p-12 text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No SIP plans found</h3>
                  <p className="text-white/60">Try adjusting your search query</p>
                </div>
              )}
            </div>

            <div className="bg-white/10 border border-white/10 p-5 backdrop-blur-sm rounded-none">
              <div className="flex gap-3">
                <div className="bg-white/10 border border-white/20 rounded-none p-2 flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-light text-white mb-2 tracking-wider">Why SIP?</h4>
                  <ul className="space-y-1 text-xs text-white/60 font-light">
                    <li>• Build wealth through disciplined investing</li>
                    <li>• Benefit from rupee cost averaging</li>
                    <li>• Start with as little as ₹500 per month</li>
                    <li>• Automated monthly investments</li>
                  </ul>
                </div>
              </div>
            </div>

            {filteredPlans.length > 0 && (
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
          </TabsContent>

          <TabsContent value="holdings" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {sipHoldings.map((holding) => (
                <div 
                  key={holding.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/sip-detail/${holding.id}`)}
                  data-testid={`sip-holding-${holding.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{holding.name}</h3>
                      <p className="text-xs text-white/50">{holding.fundHouse}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm px-1.5 py-0">
                      {holding.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Monthly SIP</p>
                      <p className="text-sm font-medium text-white">₹{holding.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Invested</p>
                      <p className="text-sm font-medium text-white">₹{holding.totalInvested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Current Value</p>
                      <p className="text-sm font-medium text-green-400">₹{holding.currentValue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Frequency</p>
                      <p className="text-xs text-white">{holding.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Next Payment</p>
                      <p className="text-xs text-white">{holding.nextPayment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {[
                { id: "1", date: "Feb 05, 2024", plan: "HDFC Mid-Cap Opportunities Fund", type: "SIP Payment", amount: "5,000", status: "Success" },
                { id: "2", date: "Feb 10, 2024", plan: "SBI Bluechip Fund", type: "SIP Payment", amount: "10,000", status: "Success" },
                { id: "3", date: "Feb 15, 2024", plan: "ICICI Prudential Technology Fund", type: "SIP Payment", amount: "3,000", status: "Success" },
                { id: "4", date: "Jan 05, 2024", plan: "HDFC Mid-Cap Opportunities Fund", type: "SIP Payment", amount: "5,000", status: "Success" },
                { id: "5", date: "Jan 10, 2024", plan: "SBI Bluechip Fund", type: "SIP Payment", amount: "10,000", status: "Success" }
              ].map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/transaction-detail/${payment.id}`)}
                  data-testid={`sip-payment-${payment.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{payment.plan}</h3>
                      <p className="text-xs text-white/50">{payment.date}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm px-1.5 py-0">
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/50">{payment.type}</p>
                    <p className="text-base font-medium text-white">₹{payment.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
