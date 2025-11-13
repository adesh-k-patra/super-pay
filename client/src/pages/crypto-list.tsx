import { useState, useMemo, type MouseEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MiniStockChart } from "@/components/ui/mini-stock-chart";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ArrowLeft, Search, TrendingUp, TrendingDown, Star, Plus } from "lucide-react";

const CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin", price: 4235670.50, change: 2.45 },
  { symbol: "ETH", name: "Ethereum", price: 182450.75, change: -1.23 },
  { symbol: "BNB", name: "Binance Coin", price: 28540.00, change: 3.67 },
  { symbol: "SOL", name: "Solana", price: 9450.25, change: 5.12 },
  { symbol: "ADA", name: "Cardano", price: 32.80, change: -0.45 },
  { symbol: "XRP", name: "Ripple", price: 45.60, change: 1.89 },
  { symbol: "DOT", name: "Polkadot", price: 425.30, change: -2.34 },
  { symbol: "DOGE", name: "Dogecoin", price: 5.25, change: 8.92 },
  { symbol: "AVAX", name: "Avalanche", price: 2850.00, change: 4.56 },
  { symbol: "MATIC", name: "Polygon", price: 68.90, change: -1.78 },
];

// Generate crypto price history for visualization (deterministic based on symbol)
const generatePriceHistory = (symbol: string, currentPrice: number, change: number) => {
  const points = 20;
  const data: number[] = [];
  
  // Calculate the previous price based on the change percentage
  const previousPrice = currentPrice / (1 + change / 100);
  const priceDiff = currentPrice - previousPrice;
  
  // Use symbol hash for consistent randomness
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
  
  // Ensure last point is exactly the current price
  data[data.length - 1] = currentPrice;
  
  return data;
};

export default function CryptoList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>(["BTC", "ETH", "BNB"]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredCryptos = useMemo(() => {
    let cryptos = selectedFilter === "holdings" || selectedFilter === "watchlist"
      ? CRYPTOS.filter(crypto => watchlist.includes(crypto.symbol))
      : CRYPTOS;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      cryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(lowerQuery) ||
        crypto.symbol.toLowerCase().includes(lowerQuery)
      );
    }
    
    return cryptos;
  }, [selectedFilter, searchQuery, watchlist]);

  const pagination = usePagination({
    data: filteredCryptos,
    itemsPerPage: 15,
  });

  // Calculate holding stats
  const holdingStats = useMemo(() => {
    const holdings = CRYPTOS.filter(crypto => watchlist.includes(crypto.symbol));
    const totalValue = holdings.reduce((sum, crypto) => sum + crypto.price * 0.5, 0); // Assume 0.5 units each
    const totalChange = holdings.reduce((sum, crypto) => sum + (crypto.price * 0.5 * crypto.change / 100), 0);
    const changePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: holdings.length
    };
  }, [watchlist]);

  const toggleWatchlist = (symbol: string, e: MouseEvent) => {
    e.stopPropagation();
    setWatchlist(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-bold tracking-wider uppercase">Crypto</h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/crypto/add")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-crypto"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Holdings Stats */}
        <div className="px-6 pb-4">
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/60 font-light">Portfolio Value</p>
                <p className="text-xl font-light text-white mt-1">₹{Number(holdingStats.totalValue).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-white/60 font-light">Today's Change</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  {Number(holdingStats.changePercent) >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                  <p className={cn(
                    "text-xl font-light",
                    Number(holdingStats.changePercent) >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {Number(holdingStats.changePercent) >= 0 ? "+" : ""}{holdingStats.changePercent}%
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-white/60 font-light">Holdings</p>
                <p className="text-xl font-light text-white mt-1">{holdingStats.holdings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search cryptocurrencies by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-crypto"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max">
            <Button
              variant={selectedFilter === "holdings" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("holdings")}
              className={cn(
                "whitespace-nowrap rounded-none",
                selectedFilter === "holdings"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              )}
              data-testid="filter-holdings"
            >
              Holdings ({watchlist.length})
            </Button>
            <Button
              variant={selectedFilter === "watchlist" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("watchlist")}
              className={cn(
                "whitespace-nowrap rounded-none",
                selectedFilter === "watchlist"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              )}
              data-testid="filter-watchlist"
            >
              <Star className="h-3 w-3 mr-1" />
              Watchlist ({watchlist.length})
            </Button>
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className={cn(
                "whitespace-nowrap rounded-none",
                selectedFilter === "all"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              )}
              data-testid="filter-all"
            >
              All Cryptos
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-[270px] px-4 pb-4">
        <div className="space-y-2">
          {pagination.paginatedData.map((crypto) => (
            <div
              key={crypto.symbol}
              className="border border-white/10 p-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => navigate(`/crypto/${crypto.symbol}`)}
              data-testid={`card-crypto-${crypto.symbol}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white mb-1">{crypto.symbol}</p>
                  <p className="text-sm text-white/60">{crypto.name}</p>
                </div>
                
                {/* Mini Chart */}
                <div className="flex-shrink-0">
                  <MiniStockChart 
                    data={generatePriceHistory(crypto.symbol, crypto.price, crypto.change)} 
                    change={crypto.change}
                    height={40}
                  />
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="font-light text-white mb-1">₹{crypto.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex items-center gap-1",
                      crypto.change >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {crypto.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span className="text-sm font-light">
                        {crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-8 p-2 rounded-none",
                        watchlist.includes(crypto.symbol) 
                          ? "text-white/80 hover:text-white/70 hover:bg-white/5" 
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      )}
                      onClick={(e) => toggleWatchlist(crypto.symbol, e)}
                      data-testid={`button-watchlist-${crypto.symbol}`}
                    >
                      <Star className={cn("h-4 w-4", watchlist.includes(crypto.symbol) && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCryptos.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 mb-2">No cryptocurrencies found</p>
              <p className="text-sm text-white/40">Try adjusting your search or filter</p>
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
      </div>
    </div>
  );
}
