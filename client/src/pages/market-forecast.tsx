import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { PageTemplate } from "@/components/layout/page-template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  LineChart, 
  BarChart3, 
  PieChart,
  Globe,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Target,
  Activity,
  DollarSign,
  Percent,
  Building,
  Factory,
  Briefcase,
  Smartphone,
  Heart,
  Car,
  Home,
  Zap,
  RefreshCw,
  Info,
  Eye,
  Brain,
  Sparkles,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface SectorForecast {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  currentIndex: number;
  forecastIndex: number;
  change: number;
  changePercent: number;
  outlook: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  keyDrivers: string[];
  riskFactors: string[];
  timeframe: string;
}

interface EconomicIndicator {
  name: string;
  current: number;
  forecast: number;
  change: number;
  unit: string;
  importance: 'high' | 'medium' | 'low';
  trend: 'improving' | 'declining' | 'stable';
  description: string;
}

interface MarketEvent {
  date: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  type: 'earnings' | 'economic' | 'policy' | 'global';
  description: string;
  affected_sectors: string[];
}

const MarketForecast = () => {
  const [, navigate] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState("3months");
  const [selectedView, setSelectedView] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockSectorForecasts: SectorForecast[] = [
    {
      name: "Banking & Finance",
      icon: Building,
      currentIndex: 4567.89,
      forecastIndex: 4892.45,
      change: 324.56,
      changePercent: 7.1,
      outlook: 'bullish',
      confidence: 87,
      keyDrivers: [
        "Rising interest rates benefiting NIMs",
        "Credit growth momentum sustaining",
        "Reduced asset quality concerns",
        "Digital transformation initiatives"
      ],
      riskFactors: [
        "Global recession fears",
        "Corporate credit stress",
        "Regulatory changes"
      ],
      timeframe: "3 months"
    },
    {
      name: "Information Technology",
      icon: Smartphone,
      currentIndex: 28456.12,
      forecastIndex: 26834.87,
      change: -1621.25,
      changePercent: -5.7,
      outlook: 'bearish',
      confidence: 74,
      keyDrivers: [
        "AI and automation adoption",
        "Cloud migration continuing",
        "Digital transformation demand"
      ],
      riskFactors: [
        "Client budget optimization",
        "Margin pressure from wage inflation",
        "Slower deal closures",
        "Currency headwinds"
      ],
      timeframe: "3 months"
    },
    {
      name: "Healthcare & Pharma",
      icon: Heart,
      currentIndex: 12789.34,
      forecastIndex: 13567.23,
      change: 777.89,
      changePercent: 6.1,
      outlook: 'bullish',
      confidence: 82,
      keyDrivers: [
        "Strong generic drug demand",
        "CDMO business expansion",
        "Government healthcare initiatives",
        "Export market recovery"
      ],
      riskFactors: [
        "Regulatory price controls",
        "Raw material inflation",
        "Patent expiries"
      ],
      timeframe: "3 months"
    },
    {
      name: "Automobile",
      icon: Car,
      currentIndex: 8934.56,
      forecastIndex: 9876.54,
      change: 941.98,
      changePercent: 10.5,
      outlook: 'bullish',
      confidence: 79,
      keyDrivers: [
        "EV adoption accelerating",
        "Rural demand recovery",
        "Festive season boost",
        "Supply chain normalization"
      ],
      riskFactors: [
        "Commodity price volatility",
        "Semiconductor shortages",
        "Interest rate impacts"
      ],
      timeframe: "3 months"
    },
    {
      name: "FMCG",
      icon: Home,
      currentIndex: 43210.87,
      forecastIndex: 44567.32,
      change: 1356.45,
      changePercent: 3.1,
      outlook: 'neutral',
      confidence: 71,
      keyDrivers: [
        "Urban consumption pickup",
        "Premium product demand",
        "Distribution expansion"
      ],
      riskFactors: [
        "Rural consumption stress",
        "Input cost inflation",
        "Competition intensity"
      ],
      timeframe: "3 months"
    },
    {
      name: "Energy & Power",
      icon: Zap,
      currentIndex: 6789.12,
      forecastIndex: 7234.89,
      change: 445.77,
      changePercent: 6.6,
      outlook: 'bullish',
      confidence: 85,
      keyDrivers: [
        "Renewable energy expansion",
        "Coal shortage easing",
        "Power demand growth",
        "Government policy support"
      ],
      riskFactors: [
        "Global commodity volatility",
        "Environmental regulations",
        "Transmission bottlenecks"
      ],
      timeframe: "3 months"
    }
  ];

  const mockEconomicIndicators: EconomicIndicator[] = [
    {
      name: "GDP Growth Rate",
      current: 6.2,
      forecast: 6.8,
      change: 0.6,
      unit: "%",
      importance: 'high',
      trend: 'improving',
      description: "Strong domestic demand and export recovery driving growth"
    },
    {
      name: "CPI Inflation",
      current: 5.8,
      forecast: 5.2,
      change: -0.6,
      unit: "%",
      importance: 'high',
      trend: 'improving',
      description: "Food inflation moderating, core inflation stabilizing"
    },
    {
      name: "Repo Rate",
      current: 6.5,
      forecast: 6.75,
      change: 0.25,
      unit: "%",
      importance: 'high',
      trend: 'stable',
      description: "Gradual tightening cycle nearing end"
    },
    {
      name: "USD/INR",
      current: 83.25,
      forecast: 82.80,
      change: -0.45,
      unit: "",
      importance: 'medium',
      trend: 'improving',
      description: "Rupee strengthening on FII inflows and export growth"
    },
    {
      name: "Crude Oil (Brent)",
      current: 84.50,
      forecast: 78.00,
      change: -6.50,
      unit: "$/barrel",
      importance: 'medium',
      trend: 'improving',
      description: "Supply increase and demand moderation"
    },
    {
      name: "FII Net Inflows",
      current: -2.3,
      forecast: 1.8,
      change: 4.1,
      unit: "₹ Billion",
      importance: 'medium',
      trend: 'improving',
      description: "Improving sentiment and attractive valuations"
    }
  ];

  const mockMarketEvents: MarketEvent[] = [
    {
      date: "2024-02-15",
      title: "Q3 Earnings Season Begins",
      impact: 'high',
      type: 'earnings',
      description: "Major IT and banking companies to report quarterly results",
      affected_sectors: ["Banking", "IT", "Finance"]
    },
    {
      date: "2024-02-08",
      title: "RBI Monetary Policy Committee Meeting",
      impact: 'high',
      type: 'policy',
      description: "Interest rate decision and policy stance update",
      affected_sectors: ["Banking", "NBFC", "Real Estate"]
    },
    {
      date: "2024-02-20",
      title: "Union Budget Impact Analysis",
      impact: 'medium',
      type: 'policy',
      description: "Sector-wise budget allocation and policy changes",
      affected_sectors: ["Infrastructure", "Healthcare", "Defense"]
    },
    {
      date: "2024-02-28",
      title: "FOMC Meeting Minutes Release",
      impact: 'medium',
      type: 'global',
      description: "US Fed policy direction and global market impact",
      affected_sectors: ["IT", "Pharma", "Auto"]
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'bullish': return "text-white/80";
      case 'bearish': return "text-white/80";
      default: return "text-white/80";
    }
  };

  const getOutlookIcon = (outlook: string) => {
    switch (outlook) {
      case 'bullish': return <TrendingUp className="h-4 w-4" strokeWidth={1} />;
      case 'bearish': return <TrendingDown className="h-4 w-4" strokeWidth={1} />;
      default: return <Activity className="h-4 w-4" strokeWidth={1} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ChevronUp className="h-4 w-4 text-white/80" strokeWidth={1} />;
      case 'declining': return <ChevronDown className="h-4 w-4 text-white/80" strokeWidth={1} />;
      default: return <Activity className="h-4 w-4 text-white/80" strokeWidth={1} />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return "bg-white/10 text-white/80 border-white/20";
      case 'medium': return "bg-white/10 text-white/80 border-white/20";
      default: return "bg-white/10 text-white/80 border-white/20";
    }
  };

  return (
    <PageTemplate 
      title="Market Forecast" 
      subtitle="Comprehensive market outlook and predictions"
      backPath="/investment-predictions"
      headerActions={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/20"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh-forecast"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} strokeWidth={1} />
          </Button>
          <Button
            size="sm"
            className="bg-white/10 hover:bg-white/15 text-white rounded-none"
            onClick={() => navigate("/investment-predictions")}
            data-testid="button-ai-predictions"
          >
            <Brain className="h-4 w-4 mr-2" strokeWidth={1} />
            AI Predictions
          </Button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Forecast Summary Header */}
        <div className="bg-white/5 border border-white/10 rounded-none p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-none">
              <LineChart className="h-6 w-6 text-white/80" strokeWidth={1} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-light text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-white/80" strokeWidth={1} />
                MARKET OUTLOOK DASHBOARD
              </h2>
              <p className="text-white/60 text-xs uppercase tracking-wider">
                Advanced forecasting powered by economic models and market analysis
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60 uppercase tracking-wider">Forecast Period</div>
              <div className="font-light text-white/80">Next 3 Months</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-36 bg-white/5 border-white/20 text-white rounded-none" data-testid="select-timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 rounded-none">
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none p-1 bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none uppercase tracking-wider" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="sectors" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none uppercase tracking-wider" data-testid="tab-sectors">Sectors</TabsTrigger>
            <TabsTrigger value="economic" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none uppercase tracking-wider" data-testid="tab-economic">Economic</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-light text-xs rounded-none uppercase tracking-wider" data-testid="tab-events">Events</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Market Summary Cards */}
              <div className="bg-white/5 border border-white/10 rounded-none p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-white/80" strokeWidth={1} />
                  <h3 className="text-base font-light text-white uppercase tracking-wider">Overall Outlook</h3>
                </div>
                <div className="text-2xl font-light text-white/80 mb-2">Bullish</div>
                <div className="text-sm text-white/60 mb-3">
                  Strong fundamentals support positive outlook
                </div>
                <Progress value={74} className="h-2" />
                <div className="text-xs text-white/60 mt-1">74% confidence</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-none p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-white/80" strokeWidth={1} />
                  <h3 className="text-base font-light text-white uppercase tracking-wider">Nifty 50 Target</h3>
                </div>
                <div className="text-2xl font-light text-white/80 mb-2">22,800</div>
                <div className="text-sm text-white/60 mb-3">
                  Current: 21,456 (+6.3%)
                </div>
                <Progress value={63} className="h-2" />
                <div className="text-xs text-white/60 mt-1">3-month target</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-none p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-white/80" strokeWidth={1} />
                  <h3 className="text-base font-light text-white uppercase tracking-wider">Volatility Index</h3>
                </div>
                <div className="text-2xl font-light text-white/80 mb-2">16.8</div>
                <div className="text-sm text-white/60 mb-3">
                  Expected: 14.5-18.2 range
                </div>
                <Progress value={42} className="h-2" />
                <div className="text-xs text-white/60 mt-1">Moderate volatility</div>
              </div>
            </div>

            {/* Top Performing Sectors Preview */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-white" strokeWidth={1} />
                <h2 className="text-lg font-light text-white uppercase tracking-wider">Sector Performance Forecast</h2>
              </div>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-4">Expected sector returns over next 3 months</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSectorForecasts.slice(0, 6).map((sector, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-none p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <sector.icon className="h-4 w-4 text-white" />
                        <span className="font-light text-sm text-white">{sector.name}</span>
                      </div>
                      <Badge className={sector.outlook === 'bullish' ? 'bg-white/10 text-white/80 border-white/20' : sector.outlook === 'bearish' ? 'bg-white/10 text-white/80 border-white/20' : 'bg-white/10 text-white/80 border-white/20'}>
                        {sector.outlook}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-light text-lg",
                        sector.change >= 0 ? "text-white/80" : "text-white/80"
                      )}>
                        {sector.change >= 0 ? '+' : ''}{sector.changePercent}%
                      </span>
                      <span className="text-xs text-white/60">
                        {sector.confidence}% confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sectors Tab */}
          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockSectorForecasts.map((sector, index) => (
                <div key={index} className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all cursor-pointer rounded-none p-6" data-testid={`card-sector-${sector.name}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-none">
                        <sector.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-light text-white">{sector.name}</h3>
                        <p className="text-white/60 text-xs uppercase tracking-wider">{sector.timeframe} outlook</p>
                      </div>
                    </div>
                    <Badge 
                      className={`flex items-center gap-1 ${
                        sector.outlook === 'bullish' ? 'bg-white/10 text-white/80 border-white/20' : 
                        sector.outlook === 'bearish' ? 'bg-white/10 text-white/80 border-white/20' : 
                        'bg-white/10 text-white/80 border-white/20'
                      }`}
                    >
                      {getOutlookIcon(sector.outlook)}
                      {sector.outlook}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Price Targets */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider">Current Index</p>
                        <p className="text-lg font-light text-white">{sector.currentIndex.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider">Forecast Index</p>
                        <p className="text-lg font-light text-white">{sector.forecastIndex.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Change & Confidence */}
                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none">
                      <div className="flex items-center gap-2">
                        {sector.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-white/80" strokeWidth={1} />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-white/80" strokeWidth={1} />
                        )}
                        <span className={cn(
                          "font-light",
                          sector.change >= 0 ? "text-white/80" : "text-white/80"
                        )}>
                          {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)} ({sector.changePercent >= 0 ? '+' : ''}{sector.changePercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-light text-white">
                          {sector.confidence}% confident
                        </span>
                      </div>
                    </div>

                    {/* Key Drivers */}
                    <div className="space-y-2">
                      <p className="text-sm font-light text-white/80 uppercase tracking-wider">Key Drivers:</p>
                      <div className="space-y-1">
                        {sector.keyDrivers.slice(0, 2).map((driver, driverIndex) => (
                          <div key={driverIndex} className="flex items-start gap-2 text-xs">
                            <div className="w-1 h-1 rounded-none bg-white/10 mt-1.5 flex-shrink-0" />
                            <span className="text-white/60">{driver}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="space-y-2">
                      <p className="text-sm font-light text-white/80 uppercase tracking-wider">Risk Factors:</p>
                      <div className="space-y-1">
                        {sector.riskFactors.slice(0, 2).map((risk, riskIndex) => (
                          <div key={riskIndex} className="flex items-start gap-2 text-xs">
                            <div className="w-1 h-1 rounded-none bg-white/10 mt-1.5 flex-shrink-0" />
                            <span className="text-white/60">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Economic Indicators Tab */}
          <TabsContent value="economic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEconomicIndicators.map((indicator, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-none p-6" data-testid={`card-indicator-${indicator.name}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-light text-white">{indicator.name}</h3>
                    <Badge className={indicator.importance === 'high' ? 'bg-white/10 text-white/80 border-white/20' : indicator.importance === 'medium' ? 'bg-white/10 text-white/80 border-white/20' : 'bg-white/10 text-white/80 border-white/20'}>
                      {indicator.importance}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider">Current</p>
                        <p className="text-lg font-light text-white">{indicator.current}{indicator.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider">Forecast</p>
                        <p className="text-lg font-light text-white">{indicator.forecast}{indicator.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(indicator.trend)}
                        <span className={cn(
                          "font-light text-sm",
                          indicator.change >= 0 ? "text-white/80" : "text-white/80"
                        )}>
                          {indicator.change >= 0 ? '+' : ''}{indicator.change}{indicator.unit}
                        </span>
                      </div>
                      <span className="text-xs text-white/60 capitalize">
                        {indicator.trend}
                      </span>
                    </div>

                    <p className="text-xs text-white/60">{indicator.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Market Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {mockMarketEvents.map((event, index) => (
                <div key={index} className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6" data-testid={`card-event-${index}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-none">
                        <Calendar className="h-5 w-5 text-white" strokeWidth={1} />
                      </div>
                      <div className="text-xs text-white/60 text-center uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-light text-lg text-white">{event.title}</h3>
                          <p className="text-sm text-white/60">{event.description}</p>
                        </div>
                        <Badge className={getImpactColor(event.impact)}>
                          {event.impact} impact
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60 uppercase tracking-wider">Type:</span>
                          <Badge className="text-xs bg-white/10 text-white border-white/20">
                            {event.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60 uppercase tracking-wider">Sectors:</span>
                          <div className="flex gap-1">
                            {event.affected_sectors.slice(0, 3).map((sector, sectorIndex) => (
                              <Badge key={sectorIndex} className="text-xs bg-white/10 text-white border-white/20">
                                {sector}
                              </Badge>
                            ))}
                            {event.affected_sectors.length > 3 && (
                              <Badge className="text-xs bg-white/10 text-white border-white/20">
                                +{event.affected_sectors.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="bg-white/5 border border-blue-400/20 rounded-none p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" strokeWidth={1} />
            <div className="text-sm">
              <p className="font-light text-white/80 mb-1 uppercase tracking-wider">Market Forecast Disclaimer</p>
              <p className="text-white/70/80">
                These forecasts are based on current market conditions and economic models. 
                Market conditions can change rapidly, and past performance does not guarantee future results. 
                Please consider your risk tolerance and consult with financial advisors before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MarketForecast;
