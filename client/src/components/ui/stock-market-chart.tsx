import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, CreditCard, DollarSign } from "lucide-react";

interface DataPoint {
  date: string;
  score: number;
  change: number;
  reason: string;
  category: "payment" | "utilization" | "inquiry" | "account" | "other";
  impact: "positive" | "negative" | "neutral";
  details: string;
}

interface StockMarketChartProps {
  data: DataPoint[];
  height?: number;
  theme?: "red" | "blue" | "green";
  showTooltip?: boolean;
}

export function StockMarketChart({ 
  data, 
  height = 200, 
  theme = "red",
  showTooltip = true 
}: StockMarketChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const minScore = Math.min(...data.map(d => d.score)) - 20;
  const maxScore = Math.max(...data.map(d => d.score)) + 20;
  const scoreRange = maxScore - minScore;

  // Theme colors
  const themeColors = {
    red: {
      line: "hsl(0 0% 98%)",
      gradient: "from-white/20 to-transparent",
      positive: "#16a34a",
      negative: "hsl(0 0% 65%)",
      neutral: "#6b7280"
    },
    blue: {
      line: "hsl(0 0% 98%)",
      gradient: "from-white/20 to-transparent",
      positive: "#16a34a",
      negative: "hsl(0 0% 65%)",
      neutral: "#6b7280"
    },
    green: {
      line: "hsl(0 0% 98%)",
      gradient: "from-white/20 to-transparent",
      positive: "#16a34a",
      negative: "hsl(0 0% 65%)",
      neutral: "#6b7280"
    }
  };

  const colors = themeColors[theme];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "payment":
        return <DollarSign className="h-3 w-3" />;
      case "utilization":
        return <CreditCard className="h-3 w-3" />;
      case "inquiry":
        return <AlertTriangle className="h-3 w-3" />;
      case "account":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getImpactColor = (impact: string) => {
    return impact === "positive" ? colors.positive : 
           impact === "negative" ? colors.negative : colors.neutral;
  };

  // Generate SVG path for the chart line
  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxScore - point.score) / scoreRange) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full" data-testid="stock-market-chart">
      {/* Chart Container */}
      <div className="relative bg-card rounded-xl border border-border p-4">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Credit Score Timeline</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full bg-muted-foreground`}></div>
              <span>Negative</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full bg-gray-400`}></div>
              <span>Neutral</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative" style={{ height }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="0.2"
              />
            ))}

            {/* Area under curve */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill="url(#areaGradient)"
              className="opacity-30"
            />

            {/* Main line */}
            <path
              d={pathData}
              fill="none"
              stroke={colors.line}
              strokeWidth="0.8"
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxScore - point.score) / scoreRange) * 100;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={hoveredIndex === index ? "1.5" : "1"}
                  fill={getImpactColor(point.impact)}
                  stroke="white"
                  strokeWidth="0.5"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setSelectedPoint(point);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setSelectedPoint(null);
                  }}
                  data-testid={`chart-point-${index}`}
                />
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.line} stopOpacity="0.3" />
                <stop offset="100%" stopColor={colors.line} stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground -ml-12">
            <span>{maxScore}</span>
            <span>{Math.round(minScore + scoreRange * 0.75)}</span>
            <span>{Math.round(minScore + scoreRange * 0.5)}</span>
            <span>{Math.round(minScore + scoreRange * 0.25)}</span>
            <span>{minScore}</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {data.map((point, index) => {
            if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
              return (
                <span key={index} className="text-center">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
              );
            }
            return null;
          })}
        </div>

        {/* Tooltip */}
        {showTooltip && selectedPoint && (
          <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs z-10" data-testid="chart-tooltip">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className={`p-1 rounded`} 
                style={{ backgroundColor: getImpactColor(selectedPoint.impact) + '20', color: getImpactColor(selectedPoint.impact) }}
              >
                {getCategoryIcon(selectedPoint.category)}
              </div>
              <div>
                <div className="font-semibold text-foreground flex items-center gap-1">
                  {selectedPoint.score}
                  {selectedPoint.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : selectedPoint.change < 0 ? (
                    <TrendingDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Minus className="h-3 w-3 text-gray-400" />
                  )}
                  <span className={`text-xs ${
                    selectedPoint.change > 0 ? 'text-green-600' : 
                    selectedPoint.change < 0 ? 'text-muted-foreground' : 'text-gray-500'
                  }`}>
                    {selectedPoint.change > 0 ? '+' : ''}{selectedPoint.change}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(selectedPoint.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-foreground mb-1">
              {selectedPoint.reason}
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedPoint.details}
            </div>
          </div>
        )}
      </div>

      {/* Recent Events Summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.slice(-3).reverse().map((event, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-3" data-testid={`recent-event-${index}`}>
            <div className="flex items-center gap-2 mb-1">
              <div 
                className={`p-1 rounded text-white`} 
                style={{ backgroundColor: getImpactColor(event.impact) }}
              >
                {getCategoryIcon(event.category)}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">{event.score}</span>
                {event.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : event.change < 0 ? (
                  <TrendingDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Minus className="h-3 w-3 text-gray-400" />
                )}
                <span className={`text-xs ${
                  event.change > 0 ? 'text-green-600' : 
                  event.change < 0 ? 'text-muted-foreground' : 'text-gray-500'
                }`}>
                  {event.change > 0 ? '+' : ''}{event.change}
                </span>
              </div>
            </div>
            <div className="text-xs font-medium text-foreground">{event.reason}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(event.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}