import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ALL_STOCKS, STOCK_DOMAINS, getStocksByDomain } from "@/data/stocks-data";
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
  BarChart3,
  Plus
} from "lucide-react";

// Generate stock price history for visualization (deterministic based on symbol)
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

export default function StocksList() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("holdings");
  const [watchlist] = useState<string[]>(["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN"]);
  const [liveStocks, setLiveStocks] = useState(ALL_STOCKS);

  // Update stock prices every 1 second to simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStocks(prevStocks => prevStocks.map(stock => {
        const randomChange = (Math.random() - 0.5) * 0.5;
        const newChange = stock.change + randomChange;
        const newPrice = stock.price * (1 + randomChange / 100);
        
        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(newChange * 100) / 100
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = useMemo(() => {
    let stocks = selectedDomain === "holdings" || selectedDomain === "watchlist"
      ? liveStocks.filter(stock => watchlist.includes(stock.symbol))
      : liveStocks.filter(stock => {
          const domain = STOCK_DOMAINS.find(d => d.id === selectedDomain);
          return domain ? stock.domain === selectedDomain : false;
        });
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      stocks = stocks.filter(stock =>
        stock.name.toLowerCase().includes(lowerQuery) ||
        stock.symbol.toLowerCase().includes(lowerQuery)
      );
    }
    
    return stocks;
  }, [selectedDomain, searchQuery, watchlist, liveStocks]);

  const pagination = usePagination({
    data: filteredStocks,
    itemsPerPage: 20,
  });

  // Calculate holding stats
  const holdingStats = useMemo(() => {
    const holdings = ALL_STOCKS.filter(stock => watchlist.includes(stock.symbol));
    const totalValue = holdings.reduce((sum, stock) => sum + stock.price * 10, 0); // Assume 10 shares each
    const totalChange = holdings.reduce((sum, stock) => sum + (stock.price * 10 * stock.change / 100), 0);
    const changePercent = (totalChange / (totalValue - totalChange)) * 100;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: holdings.length
    };
  }, [watchlist]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-bold tracking-wider uppercase">Stocks</h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment/stocks/add")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-stock"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Holdings Stats */}
        <div className="px-6 pb-4">
          <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="stocks-summary">
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

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search stocks by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-stocks"
            />
          </div>
        </div>

        {/* Domain Filters - Horizontal Scrollable */}
        <div className="px-6 py-2 overflow-x-auto scrollbar-hide flex items-center">
          <div className="flex items-center gap-2 min-w-max">
            <Button
              variant={selectedDomain === "holdings" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain("holdings")}
              className={cn(
                "whitespace-nowrap rounded-none",
                selectedDomain === "holdings"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              )}
              data-testid="filter-domain-holdings"
            >
              Holdings ({watchlist.length})
            </Button>
            <Button
              variant={selectedDomain === "watchlist" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain("watchlist")}
              className={cn(
                "whitespace-nowrap rounded-none",
                selectedDomain === "watchlist"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              )}
              data-testid="filter-domain-watchlist"
            >
              <Star className="h-3 w-3 mr-1" />
              Watchlist ({watchlist.length})
            </Button>
            {STOCK_DOMAINS.map((domain) => (
              <Button
                key={domain.id}
                variant={selectedDomain === domain.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDomain(domain.id)}
                className={cn(
                  "whitespace-nowrap rounded-none",
                  selectedDomain === domain.id
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                )}
                data-testid={`filter-domain-${domain.id}`}
              >
                {domain.label} {domain.count > 0 && `(${domain.count})`}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-[360px] px-4">
        {/* Stocks Grid */}
        <div className="space-y-1">
          {pagination.paginatedData.map((stock) => (
            <div
              key={stock.symbol}
              className="border border-white/10 p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => navigate(`/stocks/${stock.symbol}`)}
              data-testid={`card-stock-${stock.symbol}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{stock.symbol}</h3>
                    <Badge className="bg-white/10 text-white border-white/20 text-xs rounded-none font-light">
                      {STOCK_DOMAINS.find(d => d.id === stock.domain)?.label || stock.domain}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/60 mb-2 truncate">{stock.name}</p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {stock.marketCap}
                    </span>
                    <span>Vol: {stock.volume}</span>
                  </div>
                </div>
                
                {/* Mini Chart */}
                <div className="flex-shrink-0">
                  <MiniStockChart 
                    data={generatePriceHistory(stock.symbol, stock.price, stock.change)} 
                    change={stock.change}
                    height={40}
                  />
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-light text-white mb-2">₹{stock.price.toLocaleString()}</p>
                  <div className={cn(
                    "flex items-center gap-1 justify-end mb-2",
                    stock.change >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-light">
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-8 rounded-none",
                      watchlist.includes(stock.symbol) 
                        ? "text-white/80 hover:text-white/70 hover:bg-white/5" 
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Add to watchlist
                    }}
                    data-testid={`button-watchlist-${stock.symbol}`}
                  >
                    <Star className={cn("h-4 w-4", watchlist.includes(stock.symbol) && "fill-current")} />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredStocks.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 mb-2">No stocks found</p>
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
          className="mb-6"
        />
      </div>
    </div>
  );
}
