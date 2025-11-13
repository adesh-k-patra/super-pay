import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, Star, TrendingDown, Shield, Banknote, Search, TrendingUp } from "lucide-react";
import { swpPlans } from "@/data/swp-plans";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const extendedSwpPlans = [
  ...swpPlans,
  {
    id: "hdfc-swp",
    name: "HDFC Balanced Advantage SWP",
    fundHouse: "HDFC Mutual Fund",
    category: "Hybrid",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Quarterly"],
    nav: 245.80,
    rating: 4.8,
    features: ["Tax Efficient", "Flexible Withdrawal", "Auto-Rebalancing", "Low Expense Ratio"],
    logo: "💰"
  },
  {
    id: "icici-swp",
    name: "ICICI Prudential Equity & Debt SWP",
    fundHouse: "ICICI Prudential MF",
    category: "Balanced Hybrid",
    minWithdrawal: 500,
    frequency: ["Monthly", "Quarterly", "Annual"],
    nav: 198.45,
    rating: 4.7,
    features: ["Regular Income", "Capital Appreciation", "Diversified Portfolio", "Professional Management"],
    logo: "📊"
  },
  {
    id: "sbi-swp",
    name: "SBI Conservative Hybrid SWP",
    fundHouse: "SBI Mutual Fund",
    category: "Conservative Hybrid",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Quarterly"],
    nav: 156.90,
    rating: 4.6,
    features: ["Low Risk", "Steady Withdrawals", "Capital Protection Focus", "Debt Heavy"],
    logo: "🏦"
  },
  {
    id: "axis-swp",
    name: "Axis Equity Hybrid SWP",
    fundHouse: "Axis Mutual Fund",
    category: "Aggressive Hybrid",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Bi-Monthly"],
    nav: 267.35,
    rating: 4.7,
    features: ["Growth + Income", "Equity Oriented", "Tax Benefits", "High Returns"],
    logo: "📈"
  },
  {
    id: "kotak-swp",
    name: "Kotak Balanced Advantage SWP",
    fundHouse: "Kotak Mahindra MF",
    category: "Balanced Advantage",
    minWithdrawal: 500,
    frequency: ["Monthly", "Quarterly"],
    nav: 189.60,
    rating: 4.8,
    features: ["Dynamic Asset Allocation", "Risk Managed", "Consistent Withdrawals", "Tax Optimized"],
    logo: "⚖️"
  },
  {
    id: "franklin-swp",
    name: "Franklin India Equity Hybrid SWP",
    fundHouse: "Franklin Templeton MF",
    category: "Equity Hybrid",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Quarterly"],
    nav: 234.75,
    rating: 4.5,
    features: ["Retirement Income", "Long-term Wealth", "Professional Picks", "Flexible Options"],
    logo: "🎯"
  },
  {
    id: "aditya-swp",
    name: "Aditya Birla SL Balanced Advantage SWP",
    fundHouse: "Aditya Birla Sun Life MF",
    category: "Balanced Advantage",
    minWithdrawal: 1000,
    frequency: ["Monthly", "Quarterly"],
    nav: 212.40,
    rating: 4.6,
    features: ["Smart Withdrawals", "Market Adaptive", "Long Track Record", "Reliable Returns"],
    logo: "🌅"
  },
  {
    id: "mirae-swp",
    name: "Mirae Asset Hybrid Equity SWP",
    fundHouse: "Mirae Asset MF",
    category: "Hybrid Equity",
    minWithdrawal: 500,
    frequency: ["Monthly"],
    nav: 198.20,
    rating: 4.7,
    features: ["Korean Expertise", "Growth Focus", "Regular Payouts", "Modern Portfolio"],
    logo: "🚀"
  }
];

const swpHoldings = [
  { id: "1", name: "SBI Equity Regular Income", fund: "Balanced Advantage Fund", frequency: "Monthly", withdrawal: "8,000", nextWithdrawal: "Nov 05, 2024", balance: "5,45,000", status: "Active", currentValue: 545000, invested: 530000 },
  { id: "2", name: "HDFC Pension Withdrawal", fund: "Hybrid Equity Fund", frequency: "Quarterly", withdrawal: "25,000", nextWithdrawal: "Dec 01, 2024", balance: "8,20,000", status: "Active", currentValue: 820000, invested: 800000 }
];

export default function SWPList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = extendedSwpPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.fundHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pagination = usePagination({
    data: filteredPlans,
    itemsPerPage: 10,
  });

  const holdingStats = useMemo(() => {
    const totalValue = swpHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = swpHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalChange = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: swpHoldings.length
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
            <h1 className="text-base font-bold tracking-wider">SWP PLANS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Systematic Withdrawal</p>
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
                placeholder="Search SWP plans by name, fund house, or category..."
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-swp"
              />
            </div>

            <div className="space-y-0 border-t border-white/10">
              {filteredPlans.length > 0 ? pagination.paginatedData.map((plan) => (
                <div 
                  key={plan.id}
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3"
                  onClick={() => navigate(`/investment/swp/${plan.id}`)}
                  data-testid={`card-swp-${plan.id}`}
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
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">NAV</p>
                            <p className="text-base font-medium text-white">₹{plan.nav}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Min. Withdrawal</p>
                            <p className="text-base font-medium text-white">₹{plan.minWithdrawal}</p>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="text-[10px] bg-white/10 text-white/70 border-white/20 rounded-sm px-1.5 py-0">
                          {plan.category}
                        </Badge>
                      </div>
                    </div>
                    <Banknote className="h-5 w-5 text-white/40 flex-shrink-0 mt-1" />
                  </div>
                </div>
              )) : (
                <div className="border border-white/20 p-12 text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">No plans found</h3>
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
                  <h4 className="font-light text-white mb-2 tracking-wider">Why SWP?</h4>
                  <ul className="space-y-1 text-xs text-white/60 font-light">
                    <li>• Create regular income from your investments</li>
                    <li>• Tax-efficient compared to traditional income sources</li>
                    <li>• Remaining corpus continues to grow</li>
                    <li>• Flexible withdrawal frequency and amount</li>
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
                { id: "1", name: "SBI Equity Regular Income", fund: "Balanced Advantage Fund", frequency: "Monthly", withdrawal: "8,000", nextWithdrawal: "Nov 05, 2024", balance: "5,45,000", status: "Active" },
                { id: "2", name: "HDFC Pension Withdrawal", fund: "Hybrid Equity Fund", frequency: "Quarterly", withdrawal: "25,000", nextWithdrawal: "Dec 01, 2024", balance: "8,20,000", status: "Active" }
              ].map((holding) => (
                <div 
                  key={holding.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/investment/swp/${holding.id}`)}
                  data-testid={`swp-holding-${holding.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{holding.name}</h3>
                      <p className="text-xs text-white/50">{holding.fund}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm px-1.5 py-0">
                      {holding.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Withdrawal</p>
                      <p className="text-sm font-medium text-white">₹{holding.withdrawal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Balance</p>
                      <p className="text-sm font-medium text-white">₹{holding.balance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Next Date</p>
                      <p className="text-sm font-medium text-white">{holding.nextWithdrawal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {[
                { id: "1", date: "Oct 05, 2024", plan: "SBI Equity Regular Income", type: "Withdrawal", amount: "8,000", status: "Completed" },
                { id: "2", date: "Sep 05, 2024", plan: "SBI Equity Regular Income", type: "Withdrawal", amount: "8,000", status: "Completed" },
                { id: "3", date: "Sep 01, 2024", plan: "HDFC Pension Withdrawal", type: "Withdrawal", amount: "25,000", status: "Completed" },
                { id: "4", date: "Aug 05, 2024", plan: "SBI Equity Regular Income", type: "Withdrawal", amount: "8,000", status: "Completed" },
                { id: "5", date: "Jun 01, 2024", plan: "HDFC Pension Withdrawal", type: "Withdrawal", amount: "25,000", status: "Completed" }
              ].map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/transaction-detail/${payment.id}`)}
                  data-testid={`swp-payment-${payment.id}`}
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
