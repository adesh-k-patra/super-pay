import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity,
  Volume2,
  Plus,
  X
} from "lucide-react";

interface PricePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  symbol: string;
  data: PricePoint[];
  currentPrice: number;
  change: number;
  changePercent: number;
  onTimeframeChange?: (timeframe: string) => void;
}

export function PriceChart({ 
  symbol, 
  data, 
  currentPrice, 
  change, 
  changePercent,
  onTimeframeChange 
}: PriceChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [showVolume, setShowVolume] = useState(true);
  const [indicators, setIndicators] = useState<string[]>(['MA']);
  const [showIndicatorDialog, setShowIndicatorDialog] = useState(false);

  const availableIndicators = [
    { id: 'MA', name: 'MA(20)', description: 'Moving Average' },
    { id: 'RSI', name: 'RSI', description: 'Relative Strength Index' },
    { id: 'MACD', name: 'MACD', description: 'Moving Average Convergence Divergence' },
    { id: 'BB', name: 'Bollinger Bands', description: 'Bollinger Bands' },
    { id: 'EMA', name: 'EMA(20)', description: 'Exponential Moving Average' },
    { id: 'STOCH', name: 'Stochastic', description: 'Stochastic Oscillator' },
  ];

  const toggleIndicator = (indicatorId: string) => {
    setIndicators(prev => {
      if (prev.includes(indicatorId)) {
        return prev.filter(i => i !== indicatorId);
      } else {
        if (prev.length >= 3) {
          return prev; // Max 3 indicators
        }
        return [...prev, indicatorId];
      }
    });
  };

  const timeframes = [
    { label: '1M', value: '1M' },
    { label: '5M', value: '5M' },
    { label: '10M', value: '10M' },
    { label: '30M', value: '30M' },
    { label: '1HR', value: '1HR' },
    { label: '3HR', value: '3HR' },
    { label: '1 DAY', value: '1D' },
    { label: '1 Week', value: '1W' },
    { label: '1 Month', value: '1MO' },
    { label: '1 Year', value: '1Y' },
    { label: '5 Yr', value: '5Y' },
    { label: 'YTD', value: 'YTD' }
  ];

  const chartHeight = 450;
  const volumeHeight = 100;

  // Calculate chart dimensions and scales
  const { minPrice, maxPrice, priceScale, volumeScale } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 100, priceScale: 1, volumeScale: 1 };
    
    const prices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
    const volumes = data.map(d => d.volume);
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const priceScale = chartHeight / (priceRange * 1.1); // Add 10% padding
    
    const maxVolume = Math.max(...volumes);
    const volumeScale = volumeHeight / maxVolume;
    
    return { minPrice, maxPrice, priceScale, volumeScale };
  }, [data, chartHeight, volumeHeight]);

  // Generate SVG path for line chart
  const linePath = useMemo(() => {
    if (data.length === 0) return '';
    
    const width = 100; // Using percentage width
    const xStep = width / (data.length - 1);
    
    return data.map((point, index) => {
      const x = index * xStep;
      const y = 100 - ((point.close - minPrice) * priceScale / chartHeight * 100);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data, minPrice, priceScale, chartHeight]);

  // Calculate moving average
  const movingAverage = useMemo(() => {
    if (data.length < 20) return [];
    
    const ma = [];
    for (let i = 19; i < data.length; i++) {
      const sum = data.slice(i - 19, i + 1).reduce((acc, point) => acc + point.close, 0);
      ma.push({
        x: i,
        y: sum / 20
      });
    }
    return ma;
  }, [data]);

  const maPath = useMemo(() => {
    if (movingAverage.length === 0) return '';
    
    const width = 100;
    const xStep = width / (data.length - 1);
    
    return movingAverage.map((point, index) => {
      const x = point.x * xStep;
      const y = 100 - ((point.y - minPrice) * priceScale / chartHeight * 100);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [movingAverage, data.length, minPrice, priceScale, chartHeight]);

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-card border border-border rounded-none p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">{symbol}</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">₹{currentPrice.toFixed(2)}</span>
              <Badge variant={isPositive ? 'default' : 'destructive'} className="text-xs">
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {isPositive ? '+' : ''}₹{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={(value) => setChartType(value as any)}>
            <SelectTrigger className="w-32" data-testid="select-chart-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Line
                </div>
              </SelectItem>
              <SelectItem value="candle">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Candle
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {timeframes.map((tf) => (
          <Button
            key={tf.value}
            variant={timeframe === tf.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTimeframeChange(tf.value)}
            className="min-w-[60px] h-8"
            data-testid={`button-timeframe-${tf.value}`}
          >
            {tf.label}
          </Button>
        ))}
      </div>

      {/* Technical Indicators */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Indicators:</span>
        {indicators.map(ind => {
          const indicator = availableIndicators.find(i => i.id === ind);
          return (
            <Badge 
              key={ind}
              variant="default"
              className="cursor-pointer text-xs flex items-center gap-1"
              data-testid={`indicator-${ind}`}
            >
              {indicator?.name}
              <X 
                className="h-3 w-3 hover:text-destructive" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleIndicator(ind);
                }}
              />
            </Badge>
          );
        })}
        {indicators.length < 3 && (
          <Dialog open={showIndicatorDialog} onOpenChange={setShowIndicatorDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 p-1" data-testid="button-add-indicator">
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add Indicator (Max 3)</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                {availableIndicators.map(indicator => {
                  const isActive = indicators.includes(indicator.id);
                  const canAdd = indicators.length < 3;
                  
                  return (
                    <div
                      key={indicator.id}
                      className={`p-3 border border-white/20 rounded-none cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-white/20 border-white/40' 
                          : canAdd 
                            ? 'hover:bg-white/10' 
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (isActive || canAdd) {
                          toggleIndicator(indicator.id);
                          if (!isActive && indicators.length >= 2) {
                            setShowIndicatorDialog(false);
                          }
                        }
                      }}
                      data-testid={`indicator-option-${indicator.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{indicator.name}</div>
                          <div className="text-xs text-white/60">{indicator.description}</div>
                        </div>
                        {isActive && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Chart Area */}
      <div className="relative bg-muted/20 rounded-none p-4" style={{ height: chartHeight + (showVolume ? volumeHeight + 20 : 0) }}>
        {/* Y-axis price labels - Transparent overlay on the left */}
        <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-white/90 py-4 pointer-events-none">
          <span className="px-1 font-medium drop-shadow-lg">₹{maxPrice.toFixed(2)}</span>
          <span className="px-1 font-medium drop-shadow-lg">₹{((maxPrice + minPrice) / 2).toFixed(2)}</span>
          <span className="px-1 font-medium drop-shadow-lg">₹{minPrice.toFixed(2)}</span>
        </div>

        <svg 
          className="w-full h-full pl-16" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          data-testid="price-chart-svg"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Volume bars (if enabled) */}
          {showVolume && data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const height = (point.volume * volumeScale / volumeHeight) * 20; // 20% of chart height for volume
            const y = 100 - height;
            
            return (
              <rect
                key={`volume-${index}`}
                x={x - 0.5}
                y={y}
                width="1"
                height={height}
                fill="currentColor"
                opacity="0.3"
                className="text-muted-foreground"
              />
            );
          })}

          {/* Price chart */}
          {chartType === 'line' ? (
            <>
              {/* Area under line */}
              <path
                d={`${linePath} L 100 100 L 0 100 Z`}
                fill={`url(#priceGradient)`}
                opacity="0.2"
              />
              
              {/* Price line */}
              <path
                d={linePath}
                fill="none"
                stroke={isPositive ? "#16a34a" : "#dc2626"}
                strokeWidth="0.5"
                className="drop-shadow-sm"
              />
            </>
          ) : (
            /* Candlestick chart */
            data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const openY = 100 - ((point.open - minPrice) * priceScale / chartHeight * 100);
              const closeY = 100 - ((point.close - minPrice) * priceScale / chartHeight * 100);
              const highY = 100 - ((point.high - minPrice) * priceScale / chartHeight * 100);
              const lowY = 100 - ((point.low - minPrice) * priceScale / chartHeight * 100);
              
              const isGreen = point.close >= point.open;
              const bodyHeight = Math.abs(closeY - openY);
              const bodyY = Math.min(openY, closeY);
              
              return (
                <g key={`candle-${index}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isGreen ? "#16a34a" : "#dc2626"}
                    strokeWidth="0.1"
                  />
                  {/* Body */}
                  <rect
                    x={x - 0.3}
                    y={bodyY}
                    width="0.6"
                    height={Math.max(bodyHeight, 0.1)}
                    fill={isGreen ? "#16a34a" : "#dc2626"}
                    opacity={isGreen ? 0.8 : 1}
                  />
                </g>
              );
            })
          )}

          {/* Moving Average (if enabled) */}
          {indicators.includes('MA') && (
            <path
              d={maPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.3"
              opacity="0.8"
            />
          )}

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "#16a34a" : "#dc2626"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isPositive ? "#16a34a" : "#dc2626"} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className={`h-8 ${showVolume ? 'text-primary' : 'text-muted-foreground'}`}
            data-testid="button-toggle-volume"
          >
            <Volume2 className="h-4 w-4 mr-1" />
            Volume
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>MA(20)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Price</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Open</div>
          <div className="font-medium">₹{data[0]?.open?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">High</div>
          <div className="font-medium text-green-600">₹{maxPrice.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Low</div>
          <div className="font-medium text-red-600">₹{minPrice.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="font-medium">{(data.reduce((sum, point) => sum + point.volume, 0) / 1000).toFixed(1)}K</div>
        </div>
      </div>
    </div>
  );
}