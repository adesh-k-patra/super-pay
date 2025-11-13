/**
 * Market utilities for investment features
 * Provides color coding, formatting, and market data helpers
 */

/**
 * Get color class for market-wide price changes
 * Green if up, Red if down
 */
export function getMarketChangeColor(changePercent: number): string {
  return changePercent >= 0 ? "text-green-500" : "text-red-500";
}

/**
 * Get color class for user holdings
 * Compares current price against user's average buy price
 */
export function getHoldingChangeColor(currentPrice: number, avgPrice: number): string {
  const change = currentPrice - avgPrice;
  return change >= 0 ? "text-green-500" : "text-red-500";
}

/**
 * Get background color class for market-wide price changes (for badges, etc.)
 */
export function getMarketChangeBgColor(changePercent: number): string {
  return changePercent >= 0 ? "bg-green-500/10" : "bg-red-500/10";
}

/**
 * Get background color class for holdings
 */
export function getHoldingChangeBgColor(currentPrice: number, avgPrice: number): string {
  const change = currentPrice - avgPrice;
  return change >= 0 ? "bg-green-500/10" : "bg-red-500/10";
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, hideAmounts: boolean = false): string {
  if (hideAmounts) return "****";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format currency with decimals
 */
export function formatCurrencyWithDecimals(amount: number, decimals: number = 2, hideAmounts: boolean = false): string {
  if (hideAmounts) return "****";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Format percentage change
 */
export function formatPercentChange(changePercent: number): string {
  const sign = changePercent >= 0 ? "+" : "";
  return `${sign}${changePercent.toFixed(2)}%`;
}

/**
 * Calculate percentage change between two prices
 */
export function calculatePercentChange(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

/**
 * Get today's date for baseline data
 */
export function getTodayBaseline(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Generate a deterministic baseline price from today's date and symbol
 * This ensures consistent "today's data" across refreshes
 */
export function getTodayBaselinePrice(symbol: string, defaultPrice: number): number {
  const today = getTodayBaseline();
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + today.getTime();
  
  // Generate a pseudo-random number between 0 and 1 based on seed
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  
  // Add -2% to +2% variation to the default price
  const variation = (random - 0.5) * 0.04;
  return defaultPrice * (1 + variation);
}

/**
 * Get color classes for trend icon
 */
export function getMarketTrendIconColor(changePercent: number): string {
  return changePercent >= 0 ? "text-green-500" : "text-red-500";
}

/**
 * Get color classes for holding trend icon
 */
export function getHoldingTrendIconColor(currentPrice: number, avgPrice: number): string {
  const change = currentPrice - avgPrice;
  return change >= 0 ? "text-green-500" : "text-red-500";
}
