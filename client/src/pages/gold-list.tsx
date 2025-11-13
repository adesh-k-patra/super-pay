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
  Coins,
  Plus
} from "lucide-react";

interface GoldItem {
  id: string;
  name: string;
  type: string;
  pricePerGram: number;
  change: number;
  purity: string;
  provider: string;
}

const GOLD_ITEMS: GoldItem[] = [
  { id: "1", name: "24K Digital Gold", type: "Digital", pricePerGram: 6250, change: 1.2, purity: "99.99%", provider: "Kalyan Jewellers" },
  { id: "2", name: "22K Gold Coin", type: "Physical", pricePerGram: 5800, change: -0.5, purity: "91.67%", provider: "Muthoot Finance" },
  { id: "3", name: "24K Gold Bar 10g", type: "Physical", pricePerGram: 6280, change: 0.8, purity: "99.99%", provider: "Malabar Gold" },
  { id: "4", name: "Digital Gold SGB", type: "Sovereign", pricePerGram: 6150, change: 2.1, purity: "99.99%", provider: "Joyalukkas" },
  { id: "5", name: "22K Gold Jewelry", type: "Jewelry", pricePerGram: 5950, change: 0.3, purity: "91.67%", provider: "Tanishq" },
  { id: "6", name: "24K Gold Biscuit", type: "Physical", pricePerGram: 6300, change: 1.5, purity: "99.99%", provider: "MMTC-PAMP" },
  { id: "7", name: "Gold ETF", type: "ETF", pricePerGram: 6200, change: -0.8, purity: "99.99%", provider: "SBI Gold ETF" },
  { id: "8", name: "Digital Gold", type: "Digital", pricePerGram: 6240, change: 0.9, purity: "99.99%", provider: "PhonePe Gold" },
  { id: "9", name: "24K Gold Bar 20g", type: "Physical", pricePerGram: 6270, change: 1.1, purity: "99.99%", provider: "PC Jeweller" },
  { id: "10", name: "22K Gold Ring", type: "Jewelry", pricePerGram: 5920, change: 0.6, purity: "91.67%", provider: "GRT Jewellers" },
  { id: "11", name: "24K Digital Gold", type: "Digital", pricePerGram: 6245, change: 1.3, purity: "99.99%", provider: "Paytm Gold" },
  { id: "12", name: "Gold Mutual Fund", type: "Fund", pricePerGram: 6180, change: -0.3, purity: "99.99%", provider: "HDFC Gold Fund" },
  { id: "13", name: "24K Gold Coin 8g", type: "Physical", pricePerGram: 6290, change: 0.7, purity: "99.99%", provider: "Senco Gold" },
  { id: "14", name: "22K Gold Bracelet", type: "Jewelry", pricePerGram: 5940, change: 0.4, purity: "91.67%", provider: "Bhima Jewellery" },
  { id: "15", name: "24K Gold Bar 50g", type: "Physical", pricePerGram: 6265, change: 1.4, purity: "99.99%", provider: "Augmont Gold" },
  { id: "16", name: "Digital Gold", type: "Digital", pricePerGram: 6235, change: 1.0, purity: "99.99%", provider: "Google Pay Gold" },
  { id: "17", name: "Gold Sovereign Bond", type: "Sovereign", pricePerGram: 6155, change: 2.0, purity: "99.99%", provider: "RBI SGB" },
  { id: "18", name: "22K Gold Necklace", type: "Jewelry", pricePerGram: 5960, change: 0.5, purity: "91.67%", provider: "Reliance Jewels" },
  { id: "19", name: "24K Gold Bar 100g", type: "Physical", pricePerGram: 6260, change: 1.2, purity: "99.99%", provider: "Safegold" },
  { id: "20", name: "Gold Index Fund", type: "Fund", pricePerGram: 6190, change: -0.4, purity: "99.99%", provider: "ICICI Gold Fund" },
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

export default function GoldList() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [holdings] = useState<string[]>(["1", "3", "4"]);
  const [liveGold, setLiveGold] = useState(GOLD_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGold(prevGold => prevGold.map(gold => {
        const randomChange = (Math.random() - 0.5) * 0.3;
        const newChange = gold.change + randomChange;
        const newPrice = gold.pricePerGram * (1 + randomChange / 100);
        return {
          ...gold,
          pricePerGram: Math.round(newPrice * 100) / 100,
          change: Math.round(newChange * 100) / 100
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredGold = useMemo(() => {
    let items = liveGold;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(gold =>
        gold.name.toLowerCase().includes(lowerQuery) ||
        gold.provider.toLowerCase().includes(lowerQuery) ||
        gold.type.toLowerCase().includes(lowerQuery)
      );
    }
    return items;
  }, [searchQuery, liveGold]);

  const pagination = usePagination({
    data: filteredGold,
    itemsPerPage: 15,
  });

  const holdingStats = useMemo(() => {
    const myHoldings = GOLD_ITEMS.filter(gold => holdings.includes(gold.id));
    const totalValue = myHoldings.reduce((sum, gold) => sum + gold.pricePerGram * 10, 0);
    const totalChange = myHoldings.reduce((sum, gold) => sum + (gold.pricePerGram * 10 * gold.change / 100), 0);
    const changePercent = (totalChange / (totalValue - totalChange)) * 100;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: myHoldings.length
    };
  }, [holdings]);

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
            <h1 className="text-base font-bold tracking-wider">GOLD</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Invest in Digital & Physical Gold</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/gold/add")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-gold"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Portfolio Card */}
        <div className="px-4 pb-4">
          <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="gold-summary">
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
              placeholder="Search gold by name, type, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-gold"
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[280px]" />

      {/* Gold Items List */}
      <div className="px-4 space-y-3">
        {pagination.paginatedData.map((gold) => {
          const priceHistory = generatePriceHistory(gold.id, gold.pricePerGram, gold.change);
          const isPositive = gold.change >= 0;
          
          return (
            <div
              key={gold.id} 
              className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 transition-all cursor-pointer"
              onClick={() => navigate(`/investment/gold/${gold.id}`)}
              data-testid={`card-gold-${gold.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-light text-white text-sm">{gold.name}</h3>
                    <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20 font-light rounded-none">
                      {gold.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 font-light mb-2">{gold.provider} • {gold.purity}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-lg font-light text-white">₹{gold.pricePerGram.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">/gram</p>
                  </div>
                  <Badge className={cn(
                    "rounded-none font-light text-xs",
                    isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {isPositive ? "+" : ""}{gold.change.toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="w-24 h-16">
                  <MiniStockChart 
                    data={priceHistory} 
                    change={gold.change}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredGold.length > 0 && (
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
