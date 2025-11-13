import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { MiniStockChart } from "@/components/ui/mini-stock-chart";
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus
} from "lucide-react";

interface SilverItem {
  id: string;
  name: string;
  type: string;
  pricePerGram: number;
  change: number;
  purity: string;
  provider: string;
}

const SILVER_ITEMS: SilverItem[] = [
  { id: "1", name: "99.9% Digital Silver", type: "Digital", pricePerGram: 82, change: 0.8, purity: "99.9%", provider: "Kalyan Jewellers" },
  { id: "2", name: "Silver Coin 10g", type: "Physical", pricePerGram: 80, change: -0.3, purity: "99.9%", provider: "Malabar Gold" },
  { id: "3", name: "Silver Bar 100g", type: "Physical", pricePerGram: 83, change: 1.2, purity: "99.9%", provider: "Muthoot Finance" },
  { id: "4", name: "Digital Silver", type: "Digital", pricePerGram: 81, change: 0.5, purity: "99.9%", provider: "PhonePe Silver" },
  { id: "5", name: "Silver Utensils", type: "Jewelry", pricePerGram: 85, change: -0.6, purity: "92.5%", provider: "Tanishq" },
  { id: "6", name: "Silver Biscuit", type: "Physical", pricePerGram: 82.5, change: 0.9, purity: "99.9%", provider: "Joyalukkas" },
  { id: "7", name: "Silver ETF", type: "ETF", pricePerGram: 81.5, change: -0.4, purity: "99.9%", provider: "SBI Silver ETF" },
  { id: "8", name: "Silver Jewelry", type: "Jewelry", pricePerGram: 84, change: 0.7, purity: "92.5%", provider: "GRT Jewellers" },
  { id: "9", name: "Digital Silver", type: "Digital", pricePerGram: 81.8, change: 0.6, purity: "99.9%", provider: "Paytm Silver" },
  { id: "10", name: "Silver Bar 50g", type: "Physical", pricePerGram: 82.8, change: 1.0, purity: "99.9%", provider: "PC Jeweller" },
  { id: "11", name: "Silver Coin 20g", type: "Physical", pricePerGram: 80.5, change: -0.2, purity: "99.9%", provider: "MMTC-PAMP" },
  { id: "12", name: "Digital Silver", type: "Digital", pricePerGram: 81.3, change: 0.7, purity: "99.9%", provider: "Google Pay Silver" },
  { id: "13", name: "Silver Anklet", type: "Jewelry", pricePerGram: 84.5, change: 0.4, purity: "92.5%", provider: "Senco Gold" },
  { id: "14", name: "Silver Bar 250g", type: "Physical", pricePerGram: 82.2, change: 1.1, purity: "99.9%", provider: "Augmont Silver" },
  { id: "15", name: "Silver Bracelet", type: "Jewelry", pricePerGram: 84.2, change: 0.3, purity: "92.5%", provider: "Bhima Jewellery" },
  { id: "16", name: "Silver Mutual Fund", type: "Fund", pricePerGram: 81.2, change: -0.5, purity: "99.9%", provider: "HDFC Silver Fund" },
  { id: "17", name: "Silver Bar 1kg", type: "Physical", pricePerGram: 82, change: 1.3, purity: "99.9%", provider: "Safegold Silver" },
  { id: "18", name: "Silver Necklace", type: "Jewelry", pricePerGram: 84.8, change: 0.5, purity: "92.5%", provider: "Reliance Jewels" },
  { id: "19", name: "Digital Silver", type: "Digital", pricePerGram: 81.6, change: 0.8, purity: "99.9%", provider: "Amazon Pay Silver" },
  { id: "20", name: "Silver Index Fund", type: "Fund", pricePerGram: 81.4, change: -0.3, purity: "99.9%", provider: "ICICI Silver Fund" },
];

const generatePriceHistory = (id: string, currentPrice: number, change: number) => {
  const points = 20;
  const data: number[] = [];
  const previousPrice = currentPrice / (1 + change / 100);
  const priceDiff = currentPrice - previousPrice;
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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

export default function SilverList() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [holdings] = useState<string[]>(["1", "3", "6"]);
  const [liveSilver, setLiveSilver] = useState(SILVER_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSilver(prevSilver => prevSilver.map(silver => {
        const randomChange = (Math.random() - 0.5) * 0.3;
        const newChange = silver.change + randomChange;
        const newPrice = silver.pricePerGram * (1 + randomChange / 100);
        return {
          ...silver,
          pricePerGram: Math.round(newPrice * 100) / 100,
          change: Math.round(newChange * 100) / 100
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredSilver = useMemo(() => {
    let items = liveSilver;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(silver =>
        silver.name.toLowerCase().includes(lowerQuery) ||
        silver.provider.toLowerCase().includes(lowerQuery) ||
        silver.type.toLowerCase().includes(lowerQuery)
      );
    }
    return items;
  }, [searchQuery, liveSilver]);

  const holdingStats = useMemo(() => {
    const myHoldings = SILVER_ITEMS.filter(silver => holdings.includes(silver.id));
    const totalValue = myHoldings.reduce((sum, silver) => sum + silver.pricePerGram * 100, 0);
    const totalChange = myHoldings.reduce((sum, silver) => sum + (silver.pricePerGram * 100 * silver.change / 100), 0);
    const changePercent = (totalChange / (totalValue - totalChange)) * 100;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: myHoldings.length
    };
  }, [holdings]);

  const pagination = usePagination({
    data: filteredSilver,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SILVER</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Invest in Digital & Physical Silver</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/silver/add")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-silver"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Portfolio Card */}
        <div className="px-4 pb-4">
          <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="silver-summary">
            <div className="space-y-6">
              {/* Total Portfolio Display */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Portfolio Value</p>
                <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-portfolio">
                  ₹{Number(holdingStats.totalValue).toLocaleString()}
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="space-y-1 text-center">
                  <p className="text-lg font-light text-white" data-testid="text-holdings-count">
                    {holdingStats.holdings}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Holdings</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className={cn(
                    "text-lg font-light",
                    Number(holdingStats.changePercent) >= 0 ? "text-green-400" : "text-red-400"
                  )} data-testid="text-todays-change">
                    {Number(holdingStats.changePercent) >= 0 ? "+" : ""}{holdingStats.changePercent}%
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Today's Change</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className={cn(
                    "text-lg font-light",
                    Number(holdingStats.changePercent) >= 0 ? "text-green-400" : "text-red-400"
                  )} data-testid="text-todays-pnl">
                    {Number(holdingStats.changePercent) >= 0 ? "+" : ""}₹{holdingStats.totalChange}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">P&L</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search silver by name, type, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-silver"
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[280px]" />

      {/* Silver Items List */}
      <div className="px-4 space-y-3">
        {pagination.paginatedData.map((silver) => {
          const priceHistory = generatePriceHistory(silver.id, silver.pricePerGram, silver.change);
          const isPositive = silver.change >= 0;
          
          return (
            <div
              key={silver.id} 
              className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 transition-all cursor-pointer"
              onClick={() => navigate(`/investment/silver/${silver.id}`)}
              data-testid={`card-silver-${silver.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-light text-white text-sm">{silver.name}</h3>
                    <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20 font-light rounded-none">
                      {silver.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 font-light mb-2">{silver.provider} • {silver.purity}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-lg font-light text-white">₹{silver.pricePerGram.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">/gram</p>
                  </div>
                  <Badge className={cn(
                    "rounded-none font-light text-xs",
                    isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {isPositive ? "+" : ""}{silver.change.toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="w-24 h-16">
                  <MiniStockChart 
                    data={priceHistory} 
                    change={silver.change}
                  />
                </div>
              </div>
            </div>
          );
        })}

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
      </div>
    </div>
  );
}
