import { useState, useEffect, useMemo } from "react";
import { getTodayBaselinePrice } from "@/lib/market-utils";

/**
 * Interface for market data items
 */
export interface LiveMarketDataItem {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  [key: string]: any;
}

/**
 * Hook for simulated real-time market data updates
 * 
 * @param initialData - Array of market data items with symbol and price
 * @param enabled - Whether to enable live updates (default: true)
 * @param updateInterval - Update interval in milliseconds (default: 1000ms = 1 second)
 * @param maxDrift - Maximum drift percentage from baseline (default: 5%)
 * @returns Array of market data items with live updates
 */
export function useLiveMarketData<T extends LiveMarketDataItem>(
  initialData: T[],
  enabled: boolean = true,
  updateInterval: number = 1000,
  maxDrift: number = 5
): T[] {
  // Create a stable key that includes both symbols and prices to detect backend changes
  const dataKey = useMemo(() => 
    initialData.map(d => `${d.symbol}:${d.price}`).join('|'),
    [initialData]
  );
  
  // Initialize with today's baseline
  const [liveData, setLiveData] = useState<T[]>([]);
  const [initializedKey, setInitializedKey] = useState<string>('');

  // Initialize or re-initialize when data changes (symbols or prices)
  useEffect(() => {
    if (dataKey !== initializedKey) {
      setLiveData(initialData.map(item => {
        const todayBaseline = getTodayBaselinePrice(item.symbol, item.price);
        
        return {
          ...item,
          price: todayBaseline,
          baseline: todayBaseline,
          cumulativeChange: 0,
          change: item.change || 0,
          changePercent: item.changePercent || 0
        } as T;
      }));
      setInitializedKey(dataKey);
    }
  }, [dataKey, initializedKey, initialData]);

  // Update prices every second with bounded drift
  useEffect(() => {
    if (!enabled || liveData.length === 0) return;
    
    const interval = setInterval(() => {
      setLiveData(prevData => 
        prevData.map(item => {
          // Small random tick change: -0.25% to +0.25% per second
          const tickChange = (Math.random() - 0.5) * 0.5;
          const newCumulativeChange = (item.cumulativeChange || 0) + tickChange;
          
          // Bound cumulative drift to ±maxDrift% of baseline
          const boundedChange = Math.max(-maxDrift, Math.min(maxDrift, newCumulativeChange));
          const newPrice = (item.baseline || item.price) * (1 + boundedChange / 100);
          
          // Calculate the change from original price
          const originalPrice = item.baseline || item.price;
          const changePercent = ((newPrice - originalPrice) / originalPrice) * 100;
          
          return {
            ...item,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat((newPrice - originalPrice).toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            cumulativeChange: boundedChange
          } as T;
        })
      );
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enabled, liveData, updateInterval, maxDrift]);

  return liveData;
}

/**
 * Hook for single asset live updates
 */
export function useLiveSingleAsset<T extends LiveMarketDataItem>(
  initialAsset: T | null,
  enabled: boolean = true
): T | null {
  const dataArray = useMemo(() => 
    initialAsset ? [initialAsset] : [], 
    [initialAsset]
  );
  
  const liveArray = useLiveMarketData(dataArray, enabled);
  
  return liveArray.length > 0 ? liveArray[0] : null;
}
