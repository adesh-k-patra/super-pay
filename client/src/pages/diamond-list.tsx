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
  Gem,
  Plus
} from "lucide-react";

interface DiamondItem {
  id: string;
  name: string;
  type: string;
  pricePerCarat: number;
  change: number;
  clarity: string;
  provider: string;
  cut: string;
}

const DIAMOND_ITEMS: DiamondItem[] = [
  { id: "1", name: "Lab Grown Diamond", type: "Lab Grown", pricePerCarat: 25000, change: 2.1, clarity: "VS1", cut: "Excellent", provider: "BlueStone" },
  { id: "2", name: "Natural Diamond GIA", type: "Natural", pricePerCarat: 45000, change: -0.8, clarity: "VVS2", cut: "Very Good", provider: "Tanishq Diamonds" },
  { id: "3", name: "Lab Diamond Round", type: "Lab Grown", pricePerCarat: 22000, change: 1.5, clarity: "VS2", cut: "Excellent", provider: "CaratLane" },
  { id: "4", name: "Natural Diamond IGI", type: "Natural", pricePerCarat: 38000, change: 0.3, clarity: "VS1", cut: "Excellent", provider: "Kalyan Diamonds" },
  { id: "5", name: "Lab Diamond Cushion", type: "Lab Grown", pricePerCarat: 24000, change: -0.5, clarity: "VVS1", cut: "Very Good", provider: "Melorra" },
  { id: "6", name: "Natural Diamond EGL", type: "Natural", pricePerCarat: 42000, change: 1.8, clarity: "VVS2", cut: "Excellent", provider: "PC Jeweller" },
  { id: "7", name: "Lab Diamond Princess", type: "Lab Grown", pricePerCarat: 23500, change: 0.9, clarity: "VS1", cut: "Excellent", provider: "Malabar Diamonds" },
  { id: "8", name: "Diamond ETF", type: "ETF", pricePerCarat: 35000, change: -0.2, clarity: "Investment", cut: "N/A", provider: "Quantum Diamond Fund" },
  { id: "9", name: "Lab Diamond Emerald", type: "Lab Grown", pricePerCarat: 23000, change: 1.2, clarity: "VS2", cut: "Very Good", provider: "GRT Diamonds" },
  { id: "10", name: "Natural Diamond HRD", type: "Natural", pricePerCarat: 44000, change: 0.6, clarity: "VVS1", cut: "Excellent", provider: "Joyalukkas Diamonds" },
  { id: "11", name: "Lab Diamond Oval", type: "Lab Grown", pricePerCarat: 24500, change: 1.8, clarity: "VS1", cut: "Excellent", provider: "Giva Diamonds" },
  { id: "12", name: "Natural Diamond AGS", type: "Natural", pricePerCarat: 41000, change: -0.4, clarity: "VS1", cut: "Excellent", provider: "Senco Diamonds" },
  { id: "13", name: "Lab Diamond Pear", type: "Lab Grown", pricePerCarat: 22500, change: 1.4, clarity: "VS2", cut: "Very Good", provider: "BlueStone Pro" },
  { id: "14", name: "Natural Diamond", type: "Natural", pricePerCarat: 39000, change: 0.7, clarity: "VVS2", cut: "Excellent", provider: "Reliance Jewels" },
  { id: "15", name: "Lab Diamond Marquise", type: "Lab Grown", pricePerCarat: 23800, change: 1.1, clarity: "VS1", cut: "Excellent", provider: "Tata CliQ Luxury" },
  { id: "16", name: "Natural Diamond Certified", type: "Natural", pricePerCarat: 43000, change: -0.3, clarity: "VVS1", cut: "Excellent", provider: "Gitanjali Jewels" },
  { id: "17", name: "Lab Diamond Radiant", type: "Lab Grown", pricePerCarat: 24200, change: 1.6, clarity: "VS1", cut: "Very Good", provider: "Candere Diamonds" },
  { id: "18", name: "Natural Diamond Premium", type: "Natural", pricePerCarat: 46000, change: 0.5, clarity: "IF", cut: "Excellent", provider: "Tiffany & Co India" },
  { id: "19", name: "Lab Diamond Heart", type: "Lab Grown", pricePerCarat: 23200, change: 1.3, clarity: "VS2", cut: "Excellent", provider: "Zoya Diamonds" },
  { id: "20", name: "Diamond Investment Plan", type: "Fund", pricePerCarat: 36000, change: -0.1, clarity: "Investment", cut: "N/A", provider: "HDFC Diamond Fund" },
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

export default function DiamondList() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [holdings] = useState<string[]>(["1", "3", "7"]);
  const [liveDiamond, setLiveDiamond] = useState(DIAMOND_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDiamond(prevDiamond => prevDiamond.map(diamond => {
        const randomChange = (Math.random() - 0.5) * 0.4;
        const newChange = diamond.change + randomChange;
        const newPrice = diamond.pricePerCarat * (1 + randomChange / 100);
        return {
          ...diamond,
          pricePerCarat: Math.round(newPrice * 100) / 100,
          change: Math.round(newChange * 100) / 100
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredDiamond = useMemo(() => {
    let items = liveDiamond;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(diamond =>
        diamond.name.toLowerCase().includes(lowerQuery) ||
        diamond.provider.toLowerCase().includes(lowerQuery) ||
        diamond.type.toLowerCase().includes(lowerQuery)
      );
    }
    return items;
  }, [searchQuery, liveDiamond]);

  const holdingStats = useMemo(() => {
    const myHoldings = DIAMOND_ITEMS.filter(diamond => holdings.includes(diamond.id));
    const totalValue = myHoldings.reduce((sum, diamond) => sum + diamond.pricePerCarat * 0.5, 0);
    const totalChange = myHoldings.reduce((sum, diamond) => sum + (diamond.pricePerCarat * 0.5 * diamond.change / 100), 0);
    const changePercent = (totalChange / (totalValue - totalChange)) * 100;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: myHoldings.length
    };
  }, [holdings]);

  const pagination = usePagination({
    data: filteredDiamond,
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
            <h1 className="text-base font-bold tracking-wider">DIAMOND</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Invest in Lab & Natural Diamonds</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/diamond/add")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-diamond"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Portfolio Card */}
        <div className="px-4 pb-4">
          <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="diamond-summary">
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
              placeholder="Search diamonds by name, type, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-diamond"
            />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[280px]" />

      {/* Diamond Items List */}
      <div className="px-4 space-y-3">
        {pagination.paginatedData.map((diamond) => {
          const priceHistory = generatePriceHistory(diamond.id, diamond.pricePerCarat, diamond.change);
          const isPositive = diamond.change >= 0;
          
          return (
            <div
              key={diamond.id} 
              className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:from-white/15 hover:to-white/10 transition-all cursor-pointer"
              onClick={() => navigate(`/investment/diamond/${diamond.id}`)}
              data-testid={`card-diamond-${diamond.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-light text-white text-sm">{diamond.name}</h3>
                    <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20 font-light rounded-none">
                      {diamond.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/50 font-light mb-2">{diamond.provider} • {diamond.clarity} • {diamond.cut}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-lg font-light text-white">₹{diamond.pricePerCarat.toLocaleString()}</p>
                    <p className="text-xs text-white/50 font-light">/carat</p>
                  </div>
                  <Badge className={cn(
                    "rounded-none font-light text-xs",
                    isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {isPositive ? "+" : ""}{diamond.change.toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="w-24 h-16">
                  <MiniStockChart 
                    data={priceHistory} 
                    change={diamond.change}
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
