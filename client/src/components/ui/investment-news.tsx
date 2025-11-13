import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Newspaper,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Calendar,
  User,
  BarChart3,
  Target,
  Shield,
  AlertTriangle,
  BookOpen,
  Star
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  category: 'earnings' | 'market' | 'regulatory' | 'analyst' | 'company';
  imageUrl?: string;
  url: string;
}

interface AnalysisPoint {
  id: string;
  type: 'pro' | 'con';
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

interface AnalystRating {
  firm: string;
  analyst: string;
  rating: 'buy' | 'hold' | 'sell';
  targetPrice: number;
  currentPrice: number;
  date: string;
  reasoning: string;
}

interface InvestmentNewsProps {
  symbol: string;
  news: NewsItem[];
  analysis: AnalysisPoint[];
  analystRatings: AnalystRating[];
  technicalAnalysis: {
    trend: 'bullish' | 'bearish' | 'neutral';
    support: number;
    resistance: number;
    rsi: number;
    recommendation: string;
  };
}

export function InvestmentNews({ 
  symbol, 
  news, 
  analysis, 
  analystRatings,
  technicalAnalysis 
}: InvestmentNewsProps) {
  const [activeTab, setActiveTab] = useState("news");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All News" },
    { value: "earnings", label: "Earnings" },
    { value: "market", label: "Market" },
    { value: "analyst", label: "Analyst" },
    { value: "regulatory", label: "Regulatory" }
  ];

  const filteredNews = selectedCategory === "all" 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const pros = analysis.filter(item => item.type === 'pro');
  const cons = analysis.filter(item => item.type === 'con');

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'buy': return 'text-green-600';
      case 'sell': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white/5 rounded-none p-1 border border-white/10">
          <TabsTrigger 
            value="news" 
            data-testid="tab-news"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 font-medium text-sm rounded-none transition-all duration-200"
          >
            <Newspaper className="h-4 w-4 mr-2" />
            News
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            data-testid="tab-analysis"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 font-medium text-sm rounded-none transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="ratings" 
            data-testid="tab-ratings"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 font-medium text-sm rounded-none transition-all duration-200"
          >
            <Star className="h-4 w-4 mr-2" />
            Ratings
          </TabsTrigger>
          <TabsTrigger 
            value="technical" 
            data-testid="tab-technical"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 font-medium text-sm rounded-none transition-all duration-200"
          >
            <Target className="h-4 w-4 mr-2" />
            Technical
          </TabsTrigger>
        </TabsList>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-4 mt-6">
          {/* News List */}
          <div className="grid gap-4">
            {filteredNews.map((item) => (
              <div
                key={item.id} 
                className="bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-white/20 transition-all duration-300 group" 
                data-testid={`news-${item.id}`}
              >
                <div className="flex gap-0">
                  {item.imageUrl && (
                    <div className="w-48 h-48 bg-white/5 flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            className={`text-xs font-semibold rounded-none ${
                              item.impact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              item.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {item.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge 
                            className={`text-xs font-semibold rounded-none flex items-center gap-1 ${
                              item.sentiment === 'positive' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              item.sentiment === 'negative' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}
                          >
                            {item.sentiment === 'positive' ? <TrendingUp className="h-3 w-3" /> : 
                             item.sentiment === 'negative' ? <TrendingDown className="h-3 w-3" /> : null}
                            {item.sentiment.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-xl text-white leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <div className="flex items-center gap-2">
                          <Newspaper className="h-4 w-4" />
                          <span className="font-medium text-white/70">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatTimeAgo(item.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{item.author}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 px-4 text-xs font-semibold bg-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none border border-white/20" 
                        asChild
                      >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          Read More
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Summary Overview */}
          <div className="bg-white/5 border border-white/10 rounded-none p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-none">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-semibold text-white">Investment Analysis Summary</div>
                <div className="text-sm text-white/60 mt-1">
                  {pros.length} positive factors • {cons.length} risk factors
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="bg-white/5 border border-green-500/30 rounded-none overflow-hidden">
              <div className="bg-green-500/10 border-b border-green-500/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-500/20 rounded-none">
                    <ThumbsUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-400">Investment Strengths</div>
                    <div className="text-xs text-white/60 mt-1">{pros.length} compelling reasons to invest</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                {pros.map((pro, index) => (
                  <div 
                    key={pro.id} 
                    className="group p-4 bg-green-500/5 border-l-4 border-green-500/50 hover:border-green-500 hover:bg-green-500/10 transition-all duration-200 rounded-none" 
                    data-testid={`pro-${pro.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-none bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
                            {index + 1}
                          </div>
                          <h4 className="font-bold text-base text-white group-hover:text-green-400 transition-colors">{pro.title}</h4>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed pl-8">{pro.description}</p>
                      </div>
                      <Badge 
                        className={`text-xs font-semibold uppercase rounded-none ${
                          pro.importance === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          pro.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {pro.importance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="bg-white/5 border border-red-500/30 rounded-none overflow-hidden">
              <div className="bg-red-500/10 border-b border-red-500/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/20 rounded-none">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-red-400">Risk Factors</div>
                    <div className="text-xs text-white/60 mt-1">{cons.length} important considerations</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                {cons.map((con, index) => (
                  <div 
                    key={con.id} 
                    className="group p-4 bg-red-500/5 border-l-4 border-red-500/50 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 rounded-none" 
                    data-testid={`con-${con.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-none bg-red-500/20 flex items-center justify-center text-xs font-bold text-red-400">
                            {index + 1}
                          </div>
                          <h4 className="font-bold text-base text-white group-hover:text-red-400 transition-colors">{con.title}</h4>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed pl-8">{con.description}</p>
                      </div>
                      <Badge 
                        className={`text-xs font-semibold uppercase rounded-none ${
                          con.importance === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          con.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {con.importance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-none p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/70">
                <span className="font-semibold text-white">Investment Disclaimer:</span> This analysis is for informational purposes only and should not be considered as financial advice. Always conduct your own research and consult with a financial advisor before making investment decisions.
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analyst Ratings Tab */}
        <TabsContent value="ratings" className="space-y-6 mt-6">
          {/* Ratings Summary */}
          <div className="bg-white/5 border border-white/10 rounded-none overflow-hidden">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-none">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Analyst Ratings Overview</h3>
                  <p className="text-sm text-white/60 mt-1">{analystRatings.length} professional ratings from leading firms</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {['buy', 'hold', 'sell'].map(type => {
                  const count = analystRatings.filter(r => r.rating === type).length;
                  const percentage = ((count / analystRatings.length) * 100).toFixed(0);
                  return (
                    <div key={type} className={`relative overflow-hidden border-2 ${
                      type === 'buy' ? 'border-green-500/40 bg-green-500/10' : 
                      type === 'sell' ? 'border-red-500/40 bg-red-500/10' : 
                      'border-yellow-500/40 bg-yellow-500/10'
                    } rounded-none p-5`}>
                      <div className="relative z-10">
                        <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{
                          color: type === 'buy' ? '#4ade80' : type === 'sell' ? '#f87171' : '#facc15'
                        }}>{type}</div>
                        <div className={`text-4xl font-bold mb-1 ${
                          type === 'buy' ? 'text-green-400' : 
                          type === 'sell' ? 'text-red-400' : 
                          'text-yellow-400'
                        }`}>{count}</div>
                        <div className="text-xs text-white/50">{percentage}% of analysts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Analyst Ratings List */}
          <div className="space-y-4">
            {analystRatings.map((rating, index) => {
              const upside = ((rating.targetPrice - rating.currentPrice) / rating.currentPrice * 100).toFixed(1);
              const isPositive = parseFloat(upside) > 0;
              
              return (
                <div 
                  key={index} 
                  className="bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-white/20 transition-all duration-300 group" 
                  data-testid={`rating-${index}`}
                >
                  <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-none flex items-center justify-center border border-white/20">
                          <span className="font-bold text-white text-xl">
                            {rating.firm.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-white group-hover:text-white/90 transition-colors">{rating.firm}</h4>
                          <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              <span>{rating.analyst}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatTimeAgo(rating.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        className={`text-sm font-bold px-5 py-2 rounded-none border-2 ${
                          rating.rating === 'buy' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                          rating.rating === 'sell' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        }`}
                      >
                        {rating.rating.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-none">
                          <BookOpen className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Analysis</div>
                            <p className="text-sm text-white/80 leading-relaxed">{rating.reasoning}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                          <div className="text-xs text-white/50 font-medium mb-2">Target Price</div>
                          <div className="text-3xl font-bold text-white">₹{rating.targetPrice}</div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <div className="text-xs text-white/50 font-medium">Current</div>
                            <div className="text-base font-semibold text-white/70">₹{rating.currentPrice}</div>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-none border-2 ${
                          isPositive ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
                        }`}>
                          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{
                            color: isPositive ? '#4ade80' : '#f87171'
                          }}>
                            {isPositive ? 'Upside Potential' : 'Downside Risk'}
                          </div>
                          <div className="flex items-center gap-2">
                            {isPositive ? 
                              <TrendingUp className="h-6 w-6 text-green-400" /> : 
                              <TrendingDown className="h-6 w-6 text-red-400" />
                            }
                            <span className={`text-3xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {upside}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Technical Analysis Tab */}
        <TabsContent value="technical" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Overview */}
            <div className="bg-white/5 border border-white/10 rounded-none overflow-hidden">
              <div className="bg-white/5 border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-none">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Technical Overview</h3>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none">
                  <span className="text-sm text-white/60">Trend</span>
                  <Badge 
                    className={`text-xs font-semibold rounded-none ${
                      technicalAnalysis.trend === 'bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                      technicalAnalysis.trend === 'bearish' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    {technicalAnalysis.trend.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none">
                  <span className="text-sm text-white/60">Support</span>
                  <span className="font-semibold text-white">₹{technicalAnalysis.support}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none">
                  <span className="text-sm text-white/60">Resistance</span>
                  <span className="font-semibold text-white">₹{technicalAnalysis.resistance}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none">
                  <span className="text-sm text-white/60">RSI</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{technicalAnalysis.rsi}</span>
                    <Badge 
                      className={`text-xs font-semibold rounded-none ${
                        technicalAnalysis.rsi > 70 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                        technicalAnalysis.rsi < 30 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {technicalAnalysis.rsi > 70 ? 'Overbought' : 
                       technicalAnalysis.rsi < 30 ? 'Oversold' : 'Neutral'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white/5 border border-white/10 rounded-none overflow-hidden">
              <div className="bg-white/5 border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-none">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Recommendation</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="p-4 bg-white/5 border border-white/10 rounded-none mb-4">
                  <p className="text-sm text-white/70 leading-relaxed">{technicalAnalysis.recommendation}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-none">
                    <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-white/70">Technical analysis is based on historical data</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-none">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-white/70">Past performance doesn't guarantee future results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}