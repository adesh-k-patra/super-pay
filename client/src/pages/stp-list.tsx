import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, Star, ArrowRightLeft, Shield, TrendingUp, TrendingDown, Search, ArrowLeftRight } from "lucide-react";
import { stpPlans } from "@/data/stp-plans";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const extendedStpPlans = [
  ...stpPlans,
  {
    id: "hdfc-stp",
    name: "HDFC Liquid to Equity STP",
    fundHouse: "HDFC Mutual Fund",
    fromFund: "HDFC Liquid Fund",
    toFund: "HDFC Top 100 Fund",
    category: "Liquid to Equity",
    minTransfer: 500,
    frequency: ["Daily", "Weekly", "Monthly"],
    rating: 4.8,
    features: ["Rupee Cost Averaging", "Risk Mitigation", "Auto Transfer", "Market Timing"],
    logo: "🔄"
  },
  {
    id: "icici-stp",
    name: "ICICI Debt to Equity STP",
    fundHouse: "ICICI Prudential MF",
    fromFund: "ICICI Ultra Short Term",
    toFund: "ICICI Bluechip Fund",
    category: "Debt to Equity",
    minTransfer: 1000,
    frequency: ["Weekly", "Monthly"],
    rating: 4.7,
    features: ["Gradual Entry", "Lower Risk", "Flexible Frequency", "Tax Efficient"],
    logo: "💹"
  },
  {
    id: "sbi-stp",
    name: "SBI Liquid to Hybrid STP",
    fundHouse: "SBI Mutual Fund",
    fromFund: "SBI Liquid Fund",
    toFund: "SBI Equity Hybrid Fund",
    category: "Liquid to Hybrid",
    minTransfer: 500,
    frequency: ["Daily", "Monthly"],
    rating: 4.6,
    features: ["Safe Entry", "Balanced Approach", "Systematic Transfer", "Cost Averaging"],
    logo: "🎯"
  },
  {
    id: "axis-stp",
    name: "Axis Liquid to Flexi Cap STP",
    fundHouse: "Axis Mutual Fund",
    fromFund: "Axis Liquid Fund",
    toFund: "Axis Flexi Cap Fund",
    category: "Liquid to Flexi Cap",
    minTransfer: 1000,
    frequency: ["Weekly", "Monthly"],
    rating: 4.7,
    features: ["Flexible Allocation", "Market Neutral", "Automated Process", "Wealth Building"],
    logo: "🚀"
  },
  {
    id: "kotak-stp",
    name: "Kotak Money Market to Equity STP",
    fundHouse: "Kotak Mahindra MF",
    fromFund: "Kotak Money Market",
    toFund: "Kotak Standard Multicap",
    category: "Money Market to Equity",
    minTransfer: 500,
    frequency: ["Daily", "Weekly", "Monthly"],
    rating: 4.8,
    features: ["Daily STP Option", "Ultra Safe Start", "Growth Potential", "Zero Exit Load"],
    logo: "⚡"
  },
  {
    id: "franklin-stp",
    name: "Franklin Ultra Short to Equity STP",
    fundHouse: "Franklin Templeton MF",
    fromFund: "Franklin Ultra Short Bond",
    toFund: "Franklin India Equity",
    category: "Ultra Short to Equity",
    minTransfer: 1000,
    frequency: ["Monthly", "Quarterly"],
    rating: 4.5,
    features: ["Smart Migration", "Professional Management", "Risk Managed", "Long-term Focus"],
    logo: "📈"
  },
  {
    id: "mirae-stp",
    name: "Mirae Asset Liquid to Emerging Bluechip STP",
    fundHouse: "Mirae Asset MF",
    fromFund: "Mirae Asset Cash Management",
    toFund: "Mirae Emerging Bluechip",
    category: "Liquid to Large & Mid Cap",
    minTransfer: 1000,
    frequency: ["Daily", "Weekly", "Monthly"],
    rating: 4.7,
    features: ["Best Seller Combo", "Growth Oriented", "Systematic Approach", "High Returns Potential"],
    logo: "🌟"
  },
  {
    id: "parag-stp",
    name: "PPFAS Liquid to Flexi Cap STP",
    fundHouse: "PPFAS Mutual Fund",
    fromFund: "PPFAS Liquid Fund",
    toFund: "Parag Parikh Flexi Cap",
    category: "Liquid to Flexi Cap",
    minTransfer: 1000,
    frequency: ["Monthly"],
    rating: 4.8,
    features: ["Global Exposure", "Value Investing", "Contrarian Approach", "Low Expense"],
    logo: "🌍"
  }
];

const stpHoldings = [
  { id: "1", name: "HDFC Debt to Equity STP", from: "Liquid Fund", to: "Equity Fund", frequency: "Monthly", amount: "10,000", nextTransfer: "Nov 01, 2024", status: "Active", currentValue: 52000, invested: 50000 },
  { id: "2", name: "ICICI Balanced STP", from: "Conservative Fund", to: "Growth Fund", frequency: "Weekly", amount: "5,000", nextTransfer: "Oct 22, 2024", status: "Active", currentValue: 48500, invested: 47500 }
];

export default function STPList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = extendedStpPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.fundHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.fromFund.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.toFund.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pagination = usePagination({
    data: filteredPlans,
    itemsPerPage: 10,
  });

  const holdingStats = useMemo(() => {
    const totalValue = stpHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = stpHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalChange = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: stpHoldings.length
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
            <h1 className="text-base font-bold tracking-wider">STP PLANS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Systematic Transfer</p>
          </div>
          <div className="w-10"></div>
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
                placeholder="Search STP plans by name, fund house, or category..."
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-stp"
              />
            </div>

            <div className="space-y-0 border-t border-white/10">
              {filteredPlans.length > 0 ? pagination.paginatedData.map((plan) => (
                <div 
                  key={plan.id}
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3"
                  onClick={() => navigate(`/investment/stp/${plan.id}`)}
                  data-testid={`card-stp-${plan.id}`}
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
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">From Fund</p>
                            <p className="text-xs text-white font-medium truncate">{plan.fromFund}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">To Fund</p>
                            <p className="text-xs text-white font-medium truncate">{plan.toFund}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] bg-white/10 text-white/70 border-white/20 rounded-sm px-1.5 py-0">
                            {plan.category}
                          </Badge>
                          <p className="text-xs text-white/50">Min: <span className="text-white font-medium">₹{plan.minTransfer}</span></p>
                        </div>
                      </div>
                    </div>
                    <ArrowRightLeft className="h-5 w-5 text-white/40 flex-shrink-0 mt-1" />
                  </div>
                </div>
              )) : (
                <div className="border border-white/20 p-12 text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No STP plans found</h3>
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
                  <h4 className="font-light text-white mb-2 tracking-wider">Why STP?</h4>
                  <ul className="space-y-1 text-xs text-white/60 font-light">
                    <li>• Benefit from rupee cost averaging</li>
                    <li>• Gradual shift from debt to equity funds</li>
                    <li>• Reduce market timing risk</li>
                    <li>• Automated systematic transfers</li>
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
              {[
                { id: "1", name: "HDFC Debt to Equity STP", from: "Liquid Fund", to: "Equity Fund", frequency: "Monthly", amount: "10,000", nextTransfer: "Nov 01, 2024", status: "Active" },
                { id: "2", name: "ICICI Balanced STP", from: "Conservative Fund", to: "Growth Fund", frequency: "Weekly", amount: "5,000", nextTransfer: "Oct 22, 2024", status: "Active" }
              ].map((holding) => (
                <div 
                  key={holding.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/investment/stp/${holding.id}`)}
                  data-testid={`stp-holding-${holding.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{holding.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-white/50">{holding.from}</p>
                        <ArrowRightLeft className="h-3 w-3 text-white/40" />
                        <p className="text-xs text-white/50">{holding.to}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm px-1.5 py-0">
                      {holding.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Transfer Amount</p>
                      <p className="text-sm font-medium text-white">₹{holding.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Frequency</p>
                      <p className="text-sm font-medium text-white">{holding.frequency}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Next Transfer</p>
                      <p className="text-sm font-medium text-white">{holding.nextTransfer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {[
                { id: "1", date: "Oct 15, 2024", plan: "HDFC Debt to Equity STP", type: "Transfer", amount: "10,000", status: "Completed" },
                { id: "2", date: "Oct 14, 2024", plan: "ICICI Balanced STP", type: "Transfer", amount: "5,000", status: "Completed" },
                { id: "3", date: "Oct 08, 2024", plan: "ICICI Balanced STP", type: "Transfer", amount: "5,000", status: "Completed" },
                { id: "4", date: "Oct 01, 2024", plan: "HDFC Debt to Equity STP", type: "Transfer", amount: "10,000", status: "Completed" },
                { id: "5", date: "Sep 15, 2024", plan: "HDFC Debt to Equity STP", type: "Transfer", amount: "10,000", status: "Completed" }
              ].map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/transaction-detail/${payment.id}`)}
                  data-testid={`stp-payment-${payment.id}`}
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
