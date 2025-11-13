interface MiniStockChartProps {
  data: number[];
  change: number;
  height?: number;
}

export function MiniStockChart({ data, change, height = 40 }: MiniStockChartProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = change >= 0;
  const strokeColor = isPositive ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)';
  const fillColor = isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)';

  return (
    <svg 
      width="100" 
      height={height} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`gradient-${change}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <polyline
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${change})`}
      />
      
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
