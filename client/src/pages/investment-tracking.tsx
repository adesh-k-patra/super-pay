import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Calendar,
  Target,
  DollarSign,
  PieChart,
  BarChart3,
  Clock,
  Repeat,
  Star,
  Plus,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Filter
} from "lucide-react";

interface PortfolioItem {
  id: string;
  fundName: string;
  fundHouse: string;
  fundLogo: string;
  category: string;
  investmentType: "SIP" | "Lump Sum";
  currentValue: number;
  investedAmount: number;
  units: number;
  currentNAV: number;
  avgNAV: number;
  returns: number;
  returnsPercentage: number;
  sipAmount?: number;
  sipDate?: number;
  nextSIPDate?: string;
  startDate: string;
  goal?: string;
  targetAmount?: number;
  duration?: string;
  status: "active" | "paused" | "completed";
  dayChange: number;
  dayChangePercentage: number;
}

// Mock portfolio data
const mockPortfolio: PortfolioItem[] = [
  {
    id: "pf-1",
    fundName: "Axis Bluechip Fund",
    fundHouse: "Axis Mutual Fund",
    fundLogo: "🏛️",
    category: "Large Cap",
    investmentType: "SIP",
    currentValue: 28750,
    investedAmount: 25000,
    units: 548.96,
    currentNAV: 52.35,
    avgNAV: 45.52,
    returns: 3750,
    returnsPercentage: 15.0,
    sipAmount: 5000,
    sipDate: 15,
    nextSIPDate: "15 Jan 2025",
    startDate: "15 Jun 2024",
    goal: "Retirement Planning",
    targetAmount: 500000,
    duration: "5 years",
    status: "active",
    dayChange: 125,
    dayChangePercentage: 0.44
  },
  {
    id: "pf-2",
    fundName: "HDFC Small Cap Fund",
    fundHouse: "HDFC Mutual Fund",
    fundLogo: "🏦",
    category: "Small Cap",
    investmentType: "SIP",
    currentValue: 22100,
    investedAmount: 18000,
    units: 279.56,
    currentNAV: 78.94,
    avgNAV: 64.38,
    returns: 4100,
    returnsPercentage: 22.8,
    sipAmount: 3000,
    sipDate: 10,
    nextSIPDate: "10 Jan 2025",
    startDate: "10 Aug 2024",
    goal: "Child's Education",
    targetAmount: 200000,
    duration: "8 years",
    status: "active",
    dayChange: -85,
    dayChangePercentage: -0.38
  },
  {
    id: "pf-3",
    fundName: "ICICI Prudential Liquid Fund",
    fundHouse: "ICICI Prudential MF",
    fundLogo: "🏪",
    category: "Liquid Fund",
    investmentType: "Lump Sum",
    currentValue: 51680,
    investedAmount: 50000,
    units: 163.52,
    currentNAV: 315.82,
    avgNAV: 305.73,
    returns: 1680,
    returnsPercentage: 3.36,
    startDate: "20 Sep 2024",
    goal: "Emergency Fund",
    status: "active",
    dayChange: 25,
    dayChangePercentage: 0.05
  },
  {
    id: "pf-4",
    fundName: "SBI Gold ETF",
    fundHouse: "SBI Mutual Fund",
    fundLogo: "🥇",
    category: "Gold ETF",
    investmentType: "SIP",
    currentValue: 9250,
    investedAmount: 8000,
    units: 201.48,
    currentNAV: 45.92,
    avgNAV: 39.72,
    returns: 1250,
    returnsPercentage: 15.6,
    sipAmount: 2000,
    sipDate: 5,
    nextSIPDate: "05 Jan 2025",
    startDate: "05 Oct 2024",
    status: "active",
    dayChange: 45,
    dayChangePercentage: 0.49
  }
];

export default function InvestmentTracking() {
  const [, navigate] = useLocation();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Fetch real portfolio data from API
  const { data: portfolioData, isLoading, error } = useQuery({
    queryKey: ['/api/investments/portfolio'],
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });

  // Transform API data to match PortfolioItem interface
  const portfolioItems: PortfolioItem[] = useMemo(() => {
    if (!portfolioData || !Array.isArray(portfolioData) || portfolioData.length === 0) return [];
    
    return portfolioData.map((investment: any) => ({
      id: investment.id,
      fundName: investment.instrumentName,
      fundHouse: investment.investmentType === 'mutual_funds' ? 'Mutual Fund' : 
                 investment.investmentType === 'stocks' ? 'Direct Stock' : 'Investment',
      fundLogo: investment.investmentType === 'stocks' ? '📈' : 
                investment.investmentType === 'mutual_funds' ? '🏛️' : '💼',
      category: investment.category || 'General',
      investmentType: investment.quantity > 100 ? 'SIP' : 'Lump Sum', // Simplified logic
      currentValue: parseFloat(investment.currentValue || investment.totalInvested || '0'),
      investedAmount: parseFloat(investment.totalInvested || '0'),
      units: parseFloat(investment.quantity || '0'),
      currentNAV: parseFloat(investment.currentPrice || investment.avgPrice || '0'),
      avgNAV: parseFloat(investment.avgPrice || '0'),
      returns: parseFloat(investment.gainLoss || '0'),
      returnsPercentage: parseFloat(investment.gainLossPercentage || '0'),
      startDate: new Date(investment.createdAt).toLocaleDateString('en-IN'),
      status: investment.isActive ? 'active' : 'paused',
      dayChange: parseFloat(investment.gainLoss || '0') * 0.1, // Simplified day change
      dayChangePercentage: parseFloat(investment.gainLossPercentage || '0') * 0.1
    }));
  }, [portfolioData]);

  // Use real data if available, otherwise fallback to mock data
  const portfolio = portfolioItems.length > 0 ? portfolioItems : mockPortfolio;

  // Calculate portfolio totals
  const portfolioSummary = useMemo(() => {
    const filteredPortfolio = portfolio.filter(item => {
      const categoryMatch = selectedCategory === "all" || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const statusMatch = !showOnlyActive || item.status === "active";
      return categoryMatch && statusMatch;
    });

    const totalInvested = filteredPortfolio.reduce((sum, item) => sum + item.investedAmount, 0);
    const totalCurrent = filteredPortfolio.reduce((sum, item) => sum + item.currentValue, 0);
    const totalReturns = totalCurrent - totalInvested;
    const totalReturnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
    const totalDayChange = filteredPortfolio.reduce((sum, item) => sum + item.dayChange, 0);
    const totalDayChangePercentage = totalCurrent > 0 ? (totalDayChange / (totalCurrent - totalDayChange)) * 100 : 0;

    return {
      totalInvested,
      totalCurrent,
      totalReturns,
      totalReturnsPercentage,
      totalDayChange,
      totalDayChangePercentage,
      activeCount: filteredPortfolio.filter(item => item.status === "active").length,
      sipCount: filteredPortfolio.filter(item => item.investmentType === "SIP" && item.status === "active").length
    };
  }, [selectedCategory, showOnlyActive, portfolio]);

  const filteredPortfolio = portfolio.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const statusMatch = !showOnlyActive || item.status === "active";
    return categoryMatch && statusMatch;
  });

  const formatCurrency = (amount: number, hideValue = false) => {
    if (hideValue) return "₹****";
    
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${Math.abs(amount).toLocaleString()}`;
    }
  };

  const getReturnColor = (returnValue: number) => {
    return returnValue >= 0 ? "text-white/80" : "text-white/80";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-white/10 text-white/80 border-white/20";
      case "paused": return "bg-white/10 text-white/80 border-white/20/30";
      case "completed": return "bg-white/10 text-white/80 border-blue-400/30";
      default: return "bg-white/10/20 text-white/80 border-gray-400/30";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state with fallback to mock data
  if (error) {
    // Using fallback data
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/investment")}
              className="border-white/20 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-wider" data-testid="page-title">
                PORTFOLIO TRACKER
              </h1>
              <p className="text-white/60">Monitor your investment performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideAmounts(!hideAmounts)}
              className="border-white/20 text-white"
              data-testid="button-toggle-visibility"
            >
              {hideAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white"
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-black border-white/20 rounded-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-white/60 mb-2">Portfolio Value</p>
              <p className="text-2xl font-bold text-white" data-testid="total-portfolio-value">
                {formatCurrency(portfolioSummary.totalCurrent, hideAmounts)}
              </p>
              <div className={`flex items-center justify-center gap-1 mt-2 ${getReturnColor(portfolioSummary.totalDayChange)}`}>
                {portfolioSummary.totalDayChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm">
                  {formatCurrency(portfolioSummary.totalDayChange, hideAmounts)} ({portfolioSummary.totalDayChangePercentage.toFixed(2)}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-white/20 rounded-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-white/60 mb-2">Total Invested</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(portfolioSummary.totalInvested, hideAmounts)}
              </p>
              <p className="text-sm text-white/60 mt-2">
                {portfolioSummary.activeCount} Active Investments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-white/20 rounded-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-white/60 mb-2">Total Returns</p>
              <p className={`text-2xl font-bold ${getReturnColor(portfolioSummary.totalReturns)}`}>
                {portfolioSummary.totalReturns >= 0 ? "+" : ""}{formatCurrency(portfolioSummary.totalReturns, hideAmounts)}
              </p>
              <p className={`text-sm mt-2 ${getReturnColor(portfolioSummary.totalReturns)}`}>
                {portfolioSummary.totalReturnsPercentage >= 0 ? "+" : ""}{portfolioSummary.totalReturnsPercentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-white/20 rounded-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-white/60 mb-2">Active SIPs</p>
              <p className="text-2xl font-bold text-white/80">{portfolioSummary.sipCount}</p>
              <p className="text-sm text-white/60 mt-2">Monthly Investments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center gap-4 mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-black border-white/20 text-white rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="large">Large Cap</SelectItem>
              <SelectItem value="small">Small Cap</SelectItem>
              <SelectItem value="debt">Debt Funds</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="liquid">Liquid Funds</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showOnlyActive ? "default" : "outline"}
            onClick={() => setShowOnlyActive(!showOnlyActive)}
            className={`${showOnlyActive ? "bg-white/10" : "border-white/20 text-white"} rounded-none`}
            data-testid="button-filter-active"
          >
            <Filter className="h-4 w-4 mr-2" />
            Active Only
          </Button>

          <div className="ml-auto">
            <Button
              onClick={() => navigate("/investment")}
              className="bg-white/10 hover:bg-white/15 text-white rounded-none"
              data-testid="button-add-investment"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>
        </div>

        {/* Investment Holdings */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Your Holdings</h3>
          {filteredPortfolio.map((item) => (
            <Card key={item.id} className="bg-black border-white/20 rounded-none hover:border-white/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white text-xl">
                      {item.fundLogo}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.fundName}</h4>
                      <p className="text-white/80 text-sm">{item.fundHouse}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className="bg-white/10 text-white/80 border-blue-400/30">
                          {item.category}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.toUpperCase()}
                        </Badge>
                        <Badge className="bg-white/10 text-white/80 border-purple-400/30">
                          {item.investmentType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(item.currentValue, hideAmounts)}
                    </p>
                    <div className={`flex items-center gap-1 ${getReturnColor(item.dayChange)}`}>
                      {item.dayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span className="text-sm">
                        {item.dayChange >= 0 ? "+" : ""}{formatCurrency(item.dayChange, hideAmounts)} ({item.dayChangePercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-sm">Invested</p>
                    <p className="text-white font-medium">{formatCurrency(item.investedAmount, hideAmounts)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Returns</p>
                    <p className={`font-medium ${getReturnColor(item.returns)}`}>
                      {item.returns >= 0 ? "+" : ""}{formatCurrency(item.returns, hideAmounts)} ({item.returnsPercentage.toFixed(1)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Units</p>
                    <p className="text-white font-medium">{item.units.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Avg NAV</p>
                    <p className="text-white font-medium">₹{item.avgNAV.toFixed(2)}</p>
                  </div>
                </div>

                {item.investmentType === "SIP" && item.status === "active" && (
                  <div className="p-3 bg-white/5 border border-blue-400/20 rounded-none mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4 text-white/80" />
                        <span className="text-white/80 font-medium">Next SIP: {item.nextSIPDate}</span>
                      </div>
                      <span className="text-white font-medium">₹{item.sipAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {item.goal && (
                  <div className="p-3 bg-white/5 border border-purple-400/20 rounded-none mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-white/80" />
                        <span className="text-white/80 font-medium">{item.goal}</span>
                      </div>
                      {item.targetAmount && (
                        <span className="text-white text-sm">Target: {formatCurrency(item.targetAmount, hideAmounts)}</span>
                      )}
                    </div>
                    {item.targetAmount && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white">{((item.currentValue / item.targetAmount) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(item.currentValue / item.targetAmount) * 100} 
                          className="h-2 bg-white/10"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white rounded-none"
                    data-testid={`button-view-${item.id}`}
                  >
                    View Details
                  </Button>
                  {item.investmentType === "SIP" && item.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-400/20 text-white/80 hover:bg-white/5 rounded-none"
                      data-testid={`button-manage-sip-${item.id}`}
                    >
                      Manage SIP
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20/20 text-white/80 hover:bg-white/5 rounded-none"
                    data-testid={`button-invest-more-${item.id}`}
                  >
                    Invest More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-black border-white/20 rounded-none">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="border-white/20 text-white rounded-none h-16 flex-col"
                data-testid="button-download-statement"
              >
                <Download className="h-5 w-5 mb-1" />
                Download Statement
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white rounded-none h-16 flex-col"
                data-testid="button-tax-harvesting"
              >
                <BarChart3 className="h-5 w-5 mb-1" />
                Tax Harvesting
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white rounded-none h-16 flex-col"
                data-testid="button-rebalance"
              >
                <PieChart className="h-5 w-5 mb-1" />
                Rebalance Portfolio
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white rounded-none h-16 flex-col"
                data-testid="button-sip-calendar"
              >
                <Calendar className="h-5 w-5 mb-1" />
                SIP Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}