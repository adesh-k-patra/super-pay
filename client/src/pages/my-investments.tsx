import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  Eye,
  EyeOff,
  Award,
  Coins,
  Clock,
  Star,
  Gem,
  ArrowLeftRight,
  Search
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface Investment {
  id: string;
  name: string;
  category: "mutual_fund" | "stock" | "sip" | "gold" | "fixed_deposit" | "crypto" | "swp" | "stp" | "silver" | "diamond";
  amount: number;
  currentValue: number;
  units: number;
  averagePrice: number;
  currentPrice: number;
  investmentDate: string;
  lastUpdated: string;
  returns: number;
  returnsPercentage: number;
  status: "active" | "closed" | "paused";
  sipAmount?: number;
  sipDate?: number;
  maturityDate?: string;
  riskLevel: "low" | "medium" | "high";
  vendor: string;
}

export default function MyInvestments() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const mockInvestments: Investment[] = [
    {
      id: "1",
      name: "HDFC Top 100 Fund",
      category: "mutual_fund",
      amount: 50000,
      currentValue: 62500,
      units: 850.25,
      averagePrice: 58.82,
      currentPrice: 73.53,
      investmentDate: "2022-01-15",
      lastUpdated: "2024-12-29",
      returns: 12500,
      returnsPercentage: 25.0,
      status: "active",
      riskLevel: "medium",
      vendor: "Groww"
    },
    {
      id: "2",
      name: "Axis Bluechip Fund SIP",
      category: "sip",
      amount: 120000,
      currentValue: 145800,
      units: 2890.45,
      averagePrice: 41.52,
      currentPrice: 50.43,
      investmentDate: "2021-06-10",
      lastUpdated: "2024-12-29",
      returns: 25800,
      returnsPercentage: 21.5,
      status: "active",
      sipAmount: 5000,
      sipDate: 15,
      riskLevel: "medium",
      vendor: "Paytm Money"
    },
    {
      id: "3",
      name: "Reliance Industries Ltd",
      category: "stock",
      amount: 75000,
      currentValue: 82500,
      units: 30,
      averagePrice: 2500,
      currentPrice: 2750,
      investmentDate: "2023-03-20",
      lastUpdated: "2024-12-29",
      returns: 7500,
      returnsPercentage: 10.0,
      status: "active",
      riskLevel: "high",
      vendor: "Zerodha"
    },
    {
      id: "4",
      name: "Digital Gold",
      category: "gold",
      amount: 25000,
      currentValue: 27750,
      units: 4.95,
      averagePrice: 5050.51,
      currentPrice: 5606.06,
      investmentDate: "2023-08-12",
      lastUpdated: "2024-12-29",
      returns: 2750,
      returnsPercentage: 11.0,
      status: "active",
      riskLevel: "low",
      vendor: "PhonePe"
    },
    {
      id: "5",
      name: "ICICI Bank FD",
      category: "fixed_deposit",
      amount: 100000,
      currentValue: 107500,
      units: 1,
      averagePrice: 100000,
      currentPrice: 107500,
      investmentDate: "2023-01-01",
      lastUpdated: "2024-12-29",
      returns: 7500,
      returnsPercentage: 7.5,
      status: "active",
      maturityDate: "2025-01-01",
      riskLevel: "low",
      vendor: "ICICI Direct"
    },
    {
      id: "6",
      name: "Bitcoin (BTC)",
      category: "crypto",
      amount: 50000,
      currentValue: 58000,
      units: 0.015,
      averagePrice: 3333333.33,
      currentPrice: 3866666.67,
      investmentDate: "2023-05-10",
      lastUpdated: "2024-12-29",
      returns: 8000,
      returnsPercentage: 16.0,
      status: "active",
      riskLevel: "high",
      vendor: "WazirX"
    }
  ];

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnsPercentage = (totalReturns / totalInvested) * 100;
  
  const activeInvestments = mockInvestments.filter(inv => inv.status === "active").length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mutual_fund": return PieChart;
      case "sip": return Target;
      case "stock": return BarChart3;
      case "gold": return Award;
      case "fixed_deposit": return Clock;
      case "crypto": return Coins;
      case "swp": return TrendingDown;
      case "stp": return ArrowLeftRight;
      case "silver": return Star;
      case "diamond": return Gem;
      default: return DollarSign;
    }
  };

  const filteredInvestments = mockInvestments.filter(inv => {
    const matchesSearch = 
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedTab === "all") return true;
    return inv.category === selectedTab;
  });

  const pagination = usePagination({
    data: filteredInvestments,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY INVESTMENTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Portfolio & holdings</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="investment-summary">
          <div className="space-y-6">
            {/* Main Stats Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Current Value</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">{activeInvestments} Active</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-current-value">
                {hideAmounts ? "₹••••••••" : `₹${(totalCurrentValue / 100000).toFixed(1)}L`}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-invested">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Invested</p>
                <p className="text-lg font-light text-white" data-testid="text-total-invested">
                  {hideAmounts ? "₹••••" : `₹${(totalInvested / 100000).toFixed(1)}L`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-returns">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Returns</p>
                <p className="text-lg font-light text-white" data-testid="text-total-returns">
                  {hideAmounts ? "₹••••" : `₹${(totalReturns / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-return-percentage">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">% Return</p>
                <p className="text-lg font-light text-white" data-testid="text-return-percentage">
                  {totalReturnsPercentage >= 0 ? "+" : ""}{totalReturnsPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search investments by name, vendor, or category..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-investments"
          />
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="stock" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-stocks">Stocks</TabsTrigger>
              <TabsTrigger value="mutual_fund" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-mutual-funds">MF</TabsTrigger>
              <TabsTrigger value="sip" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-sip">SIP</TabsTrigger>
            </TabsList>

{["all", "stock", "mutual_fund", "sip"].map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-6">
                <div className="space-y-3">
                  {pagination.paginatedData.map((inv) => {
                    const CategoryIcon = getCategoryIcon(inv.category);
                    
                    return (
                      <div
                        key={inv.id}
                        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set('returnTo', '/my-investments');
                          params.set('returnTab', selectedTab);
                          navigate(`/investment-detail/${inv.id}?${params.toString()}`);
                        }}
                        data-testid={`card-investment-${inv.id}`}
                      >
                        <div className="space-y-3">
                          {/* Investment Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                                <CategoryIcon className="h-4 w-4 text-white/60" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-light text-white text-sm tracking-wide">{inv.name}</h4>
                                <p className="text-[10px] text-white/50 tracking-widest uppercase">{inv.vendor}</p>
                                <p className="text-xs text-white/40">{inv.units} units</p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-lg font-light text-white tracking-tight" data-testid={`text-value-${inv.id}`}>
                                {hideAmounts ? "₹••••••" : `₹${(inv.currentValue / 1000).toFixed(1)}K`}
                              </p>
                              <div className="flex items-center gap-1 justify-end">
                                {inv.returnsPercentage >= 0 ? (
                                  <TrendingUp className="h-3 w-3 text-white/60" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-white/60" />
                                )}
                                <p className={cn("text-[10px] uppercase tracking-widest", inv.returnsPercentage >= 0 ? "text-white/60" : "text-white/60")}>
                                  {inv.returnsPercentage >= 0 ? "+" : ""}{inv.returnsPercentage.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Investment Details */}
                          <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/60">Invested:</span>
                                <span className="text-white font-medium">
                                  {hideAmounts ? "₹•••" : `₹${(inv.amount / 1000).toFixed(0)}K`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Returns:</span>
                                <span className={cn("font-medium", inv.returns >= 0 ? "text-white" : "text-white")}>
                                  {hideAmounts ? "₹•••" : `₹${(inv.returns / 1000).toFixed(1)}K`}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-white/60">Avg Price:</span>
                                <span className="text-white font-medium">
                                  {hideAmounts ? "₹•••" : `₹${inv.averagePrice.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Current:</span>
                                <span className="text-white font-medium">
                                  {hideAmounts ? "₹•••" : `₹${inv.currentPrice.toFixed(2)}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredInvestments.length > 0 && (
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
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
