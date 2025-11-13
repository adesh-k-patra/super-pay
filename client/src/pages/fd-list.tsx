import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MiniStockChart } from "@/components/ui/mini-stock-chart";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Building2,
  Plus
} from "lucide-react";

interface FDItem {
  id: string;
  name: string;
  bank: string;
  type: string;
  interestRate: number;
  change: number;
  tenure: string;
  minAmount: number;
  rating: string;
}

const FD_ITEMS: FDItem[] = [
  { id: "1", name: "HDFC Bank FD", bank: "HDFC Bank", type: "Regular", interestRate: 7.5, change: 0.2, tenure: "1 Year", minAmount: 10000, rating: "AAA" },
  { id: "2", name: "SBI Senior Citizen FD", bank: "State Bank of India", type: "Senior Citizen", interestRate: 8.25, change: -0.1, tenure: "5 Years", minAmount: 5000, rating: "AAA" },
  { id: "3", name: "ICICI Bank Tax Saver FD", bank: "ICICI Bank", type: "Tax Saver", interestRate: 7.75, change: 0.3, tenure: "5 Years", minAmount: 100, rating: "AAA" },
  { id: "4", name: "Axis Bank Short Term FD", bank: "Axis Bank", type: "Regular", interestRate: 7.0, change: -0.15, tenure: "6 Months", minAmount: 5000, rating: "AA+" },
  { id: "5", name: "Kotak Mahindra FD", bank: "Kotak Mahindra", type: "Regular", interestRate: 7.25, change: 0.25, tenure: "2 Years", minAmount: 10000, rating: "AAA" },
  { id: "6", name: "YES Bank Corporate FD", bank: "YES Bank", type: "Corporate", interestRate: 8.5, change: -0.2, tenure: "3 Years", minAmount: 100000, rating: "AA" },
  { id: "7", name: "Punjab National Bank FD", bank: "PNB", type: "Regular", interestRate: 7.65, change: 0.15, tenure: "1 Year", minAmount: 1000, rating: "AAA" },
  { id: "8", name: "IndusInd Bank FD", bank: "IndusInd Bank", type: "Regular", interestRate: 7.85, change: -0.05, tenure: "18 Months", minAmount: 10000, rating: "AA+" },
];

const generateRateHistory = (id: string, currentRate: number, change: number) => {
  const points = 20;
  const data: number[] = [];
  const previousRate = currentRate - change;
  const rateDiff = currentRate - previousRate;
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const baseRate = previousRate + (rateDiff * progress);
    const randomVariation = (seededRandom(i) - 0.5) * currentRate * 0.01;
    data.push(baseRate + randomVariation);
  }
  data[data.length - 1] = currentRate;
  return data;
};

export default function FDList() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [holdings] = useState<string[]>(["1", "3", "5"]);
  const [liveFD, setLiveFD] = useState(FD_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveFD(prevFD => prevFD.map(fd => {
        const randomChange = (Math.random() - 0.5) * 0.05;
        const newChange = fd.change + randomChange;
        const newRate = fd.interestRate + randomChange;
        return {
          ...fd,
          interestRate: Math.round(newRate * 100) / 100,
          change: Math.round(newChange * 100) / 100
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredFD = useMemo(() => {
    let items = liveFD;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(fd =>
        fd.name.toLowerCase().includes(lowerQuery) ||
        fd.bank.toLowerCase().includes(lowerQuery) ||
        fd.type.toLowerCase().includes(lowerQuery)
      );
    }
    return items;
  }, [searchQuery, liveFD]);

  const pagination = usePagination({
    data: filteredFD,
    itemsPerPage: 15,
  });

  const holdingStats = useMemo(() => {
    const myHoldings = FD_ITEMS.filter(fd => holdings.includes(fd.id));
    const totalValue = myHoldings.reduce((sum, fd) => sum + fd.minAmount * 5, 0);
    const totalReturns = myHoldings.reduce((sum, fd) => sum + (fd.minAmount * 5 * fd.interestRate / 100), 0);
    const changePercent = (totalReturns / totalValue) * 100;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalReturns.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: myHoldings.length
    };
  }, [holdings]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-5 w-5 bg-white/10" />
            Fixed Deposits
          </h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/fd/add")}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-add-fd"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Portfolio Card */}
        <div className="px-6 pb-4">
          <Card className="bg-white/5 border border-white/10 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Portfolio Value</p>
                  <p className="text-xl font-bold text-white mt-1">₹{Number(holdingStats.totalValue).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 uppercase tracking-wider">Annual Returns</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    {Number(holdingStats.changePercent) >= 0 ? <TrendingUp className="h-4 w-4 bg-white/10" /> : <TrendingDown className="h-4 w-4 bg-white/10" />}
                    <p className={cn(
                      "text-xl font-bold",
                      Number(holdingStats.changePercent) >= 0 ? "bg-white/10" : "bg-white/10"
                    )}>
                      {Number(holdingStats.changePercent) >= 0 ? "+" : ""}{holdingStats.changePercent}%
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/50 uppercase tracking-wider">Holdings</p>
                  <p className="text-xl font-bold text-white mt-1">{holdingStats.holdings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Box */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search FDs by bank, type, or tenure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-fd"
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[280px]" />

      {/* FD Items List */}
      <div className="px-4 space-y-3">
        {pagination.paginatedData.map((fd) => {
          const rateHistory = generateRateHistory(fd.id, fd.interestRate, fd.change);
          const isPositive = fd.change >= 0;
          
          return (
            <Card 
              key={fd.id} 
              className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => navigate(`/investment/fd/${fd.id}`)}
              data-testid={`card-fd-${fd.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{fd.bank}</h3>
                      <Badge variant="outline" className="text-xs bg-white/10 bg-white/10 bg-white/10">
                        {fd.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/50 mb-2">{fd.tenure} • Rating: {fd.rating}</p>
                    <div className="flex items-baseline gap-3">
                      <div>
                        <p className="text-xs text-white/50">Interest Rate</p>
                        <p className="text-lg font-bold bg-white/10">{fd.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Min Amount</p>
                        <p className="text-sm font-semibold text-white">₹{fd.minAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {isPositive ? <TrendingUp className="h-3 w-3 bg-white/10" /> : <TrendingDown className="h-3 w-3 bg-white/10" />}
                      <p className={cn(
                        "text-sm font-semibold",
                        isPositive ? "bg-white/10" : "bg-white/10"
                      )}>
                        {isPositive ? "+" : ""}{fd.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-24 h-16">
                    <MiniStockChart 
                      data={rateHistory} 
                      color={isPositive ? "#4ade80" : "#f87171"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredFD.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6 mb-6"
          />
        )}
      </div>
    </div>
  );
}
