import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getAllMutualFunds } from "@/data/mutual-funds";
import { MiniStockChart } from "@/components/ui/mini-stock-chart";
import { usePagination } from "@/hooks/use-pagination";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Plus,
  Shield,
  PieChart
} from "lucide-react";

const generatePriceHistory = (symbol: string, currentPrice: number, change: number) => {
  const points = 20;
  const data: number[] = [];
  const previousPrice = currentPrice / (1 + change / 100);
  const priceDiff = currentPrice - previousPrice;
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const basePrice = previousPrice + (priceDiff * progress);
    const randomVariation = (seededRandom(i) - 0.5) * currentPrice * 0.015;
    data.push(basePrice + randomVariation);
  }
  data[data.length - 1] = currentPrice;
  return data;
};

const mutualFundHoldings = [
  { id: "MF001", name: "HDFC Equity Growth Fund", units: "523.45", nav: "285.50", currentValue: 149384, invested: 125000, returns: "+19.51%", color: "text-green-400" },
  { id: "MF003", name: "ICICI Bluechip Fund", units: "312.80", nav: "195.30", currentValue: 61089, invested: 60000, returns: "+1.82%", color: "text-green-400" },
  { id: "MF005", name: "SBI Large Cap Fund", units: "450.20", nav: "142.75", currentValue: 64266, invested: 58000, returns: "+10.80%", color: "text-green-400" }
];

export default function MutualFundsList() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [holdings] = useState<string[]>(["MF001", "MF003", "MF005"]);
  const [liveFunds, setLiveFunds] = useState(getAllMutualFunds());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFunds(prevFunds => prevFunds.map(fund => {
        const randomChange = (Math.random() - 0.5) * 0.3;
        const newChange = fund.changePercent + randomChange;
        const newPrice = fund.currentPrice * (1 + randomChange / 100);
        return {
          ...fund,
          currentPrice: Math.round(newPrice * 100) / 100,
          changePercent: Math.round(newChange * 100) / 100
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredFunds = useMemo(() => {
    let funds = liveFunds;
    
    if (selectedCategory !== "All") {
      funds = funds.filter(fund => fund.subcategory === selectedCategory);
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      funds = funds.filter(fund =>
        fund.instrumentName.toLowerCase().includes(lowerQuery) ||
        fund.fundHouse.toLowerCase().includes(lowerQuery) ||
        fund.category.toLowerCase().includes(lowerQuery)
      );
    }
    return funds;
  }, [searchQuery, selectedCategory, liveFunds]);

  const pagination = usePagination({
    data: filteredFunds,
    itemsPerPage: 15,
  });

  const holdingStats = useMemo(() => {
    const totalValue = mutualFundHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = mutualFundHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalChange = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: mutualFundHoldings.length
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
            <h1 className="text-base font-bold tracking-wider">MUTUAL FUNDS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Invest in Top Funds</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/mutual-fund/add")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-fund"
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
                placeholder="Search funds by name, house, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-funds"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-6 gap-0">
                {["All", "Flexi Cap", "Multi Cap", "Large Cap", "Mid Cap", "Small Cap"].map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                    data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="space-y-3">
              {pagination.paginatedData.map((fund) => {
                const priceHistory = generatePriceHistory(fund.symbol, fund.currentPrice, fund.changePercent);
                const isPositive = fund.changePercent >= 0;
                
                return (
                  <div 
                    key={fund.symbol}
                    className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3"
                    onClick={() => navigate(`/investment-detail/${fund.symbol}`)}
                    data-testid={`card-fund-${fund.symbol}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-white text-sm truncate">{fund.instrumentName}</h3>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "h-3 w-3",
                                  star <= fund.rating ? "text-white/80 fill-white" : "text-white/20"
                                )} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-xs text-white/50 font-light">{fund.fundHouse}</p>
                          <Badge variant="outline" className="text-[10px] bg-white/10 text-white/70 border-white/20 font-light rounded-sm px-1.5 py-0">
                            {fund.category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">NAV</p>
                            <p className="text-base font-medium text-white">₹{fund.currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">1Y Return</p>
                            <p className="text-base font-medium text-white">{fund.returns1y}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Change</p>
                            <Badge className={cn(
                              "rounded-none font-light text-xs",
                              isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                            )}>
                              {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                              {isPositive ? "+" : ""}{fund.changePercent.toFixed(2)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-20 h-12 flex-shrink-0">
                        <MiniStockChart 
                          data={priceHistory}
                          change={fund.changePercent}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredFunds.length === 0 && (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO FUNDS FOUND</h3>
                  <p className="text-white/40 text-sm font-light">Try adjusting your search query</p>
                </div>
              )}
            </div>

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
          </TabsContent>

          <TabsContent value="holdings" className="mt-6 space-y-4">
            <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Portfolio Value</p>
                  <p className="text-2xl font-light text-white mt-1">₹{Number(holdingStats.totalValue).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Today's Change</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    {Number(holdingStats.changePercent) >= 0 ? <TrendingUp className="h-4 w-4 text-white" /> : <TrendingDown className="h-4 w-4 text-white" />}
                    <p className={cn(
                      "text-lg font-light",
                      Number(holdingStats.changePercent) >= 0 ? "text-white" : "text-white"
                    )}>
                      {Number(holdingStats.changePercent) >= 0 ? "+" : ""}{holdingStats.changePercent}%
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/60 uppercase tracking-widest font-light">Holdings</p>
                  <p className="text-2xl font-light text-white mt-1">{holdingStats.holdings}</p>
                </div>
              </div>
            </div>

            <div className="space-y-0 border-t border-white/10">
              {mutualFundHoldings.map((holding) => (
                <div 
                  key={holding.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/investment-detail/${holding.id}`)}
                  data-testid={`holding-${holding.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{holding.name}</h3>
                      <p className="text-xs text-white/50">{holding.units} units</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-base font-medium", holding.color)}>{holding.returns}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Current NAV</p>
                      <p className="text-sm font-medium text-white">₹{holding.nav}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Invested</p>
                      <p className="text-sm font-medium text-white">₹{holding.invested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Current Value</p>
                      <p className="text-sm font-medium text-white">₹{holding.currentValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {[
                { id: "1", date: "Oct 15, 2024", fund: "HDFC Equity Growth Fund", type: "SIP", amount: "5,000", status: "Success" },
                { id: "2", date: "Oct 10, 2024", fund: "ICICI Bluechip Fund", type: "SIP", amount: "3,000", status: "Success" },
                { id: "3", date: "Oct 05, 2024", fund: "SBI Large Cap Fund", type: "Lumpsum", amount: "25,000", status: "Success" },
                { id: "4", date: "Sep 15, 2024", fund: "HDFC Equity Growth Fund", type: "SIP", amount: "5,000", status: "Success" },
                { id: "5", date: "Sep 10, 2024", fund: "ICICI Bluechip Fund", type: "SIP", amount: "3,000", status: "Success" }
              ].map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/transaction-detail/${payment.id}`)}
                  data-testid={`payment-${payment.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{payment.fund}</h3>
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
