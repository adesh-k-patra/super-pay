import { differenceInDays } from "date-fns";

interface CouponValueParams {
  couponValue: number;
  couponValueType: string;
  couponBrand: string;
  couponCategory: string;
  expiryDate: string | Date;
  minAmount?: number;
  maxDiscount?: number;
}

// Brand reliability scores (1-10)
const BRAND_SCORES: Record<string, number> = {
  amazon: 10,
  flipkart: 9.5,
  myntra: 9,
  swiggy: 9.5,
  zomato: 9,
  makemytrip: 8.5,
  "booking.com": 8.5,
  uber: 9,
  paytm: 8.5,
  phonepe: 8.5,
  gpay: 9,
  "google pay": 9,
  netflix: 10,
  spotify: 9.5,
  prime: 10,
  hotstar: 9,
  // Add more as needed
};

// Category popularity scores (1-10)
const CATEGORY_SCORES: Record<string, number> = {
  food: 9,
  travel: 8.5,
  shopping: 9.5,
  bills: 7.5,
  entertainment: 8,
  all: 10, // Universal coupons are most valuable
};

/**
 * Calculate coupon value score (1-10) based on multiple factors:
 * - Worth/Value (30%): Actual monetary value of the coupon
 * - Brand Reliability (25%): How reliable and popular the brand is
 * - Category Demand (20%): How in-demand the category is
 * - Expiry/Freshness (15%): Days until expiry
 * - Usage Flexibility (10%): Min amount and restrictions
 */
export function calculateCouponValueScore(params: CouponValueParams): number {
  const {
    couponValue,
    couponValueType,
    couponBrand,
    couponCategory,
    expiryDate,
    minAmount,
    maxDiscount,
  } = params;

  // 1. Worth Score (0-10) - 30% weight
  let worthScore = 0;
  if (couponValueType === "percentage") {
    // Percentage discounts: scale based on percentage
    if (couponValue >= 50) worthScore = 10;
    else if (couponValue >= 40) worthScore = 9;
    else if (couponValue >= 30) worthScore = 8;
    else if (couponValue >= 20) worthScore = 7;
    else if (couponValue >= 15) worthScore = 6;
    else if (couponValue >= 10) worthScore = 5;
    else if (couponValue >= 5) worthScore = 3;
    else worthScore = 2;
    
    // Adjust based on max discount cap
    if (maxDiscount) {
      if (maxDiscount >= 2000) worthScore = Math.min(10, worthScore + 1);
      else if (maxDiscount < 200) worthScore = Math.max(1, worthScore - 2);
    }
  } else {
    // Fixed amount discounts: scale based on rupee value
    if (couponValue >= 2000) worthScore = 10;
    else if (couponValue >= 1500) worthScore = 9;
    else if (couponValue >= 1000) worthScore = 8.5;
    else if (couponValue >= 750) worthScore = 7.5;
    else if (couponValue >= 500) worthScore = 6.5;
    else if (couponValue >= 300) worthScore = 5.5;
    else if (couponValue >= 200) worthScore = 4.5;
    else if (couponValue >= 100) worthScore = 3.5;
    else if (couponValue >= 50) worthScore = 2.5;
    else worthScore = 1.5;
  }

  // 2. Brand Reliability Score (0-10) - 25% weight
  const brandLower = couponBrand.toLowerCase();
  let brandScore = BRAND_SCORES[brandLower] || 6; // Default to mid-tier

  // Check for partial matches
  if (brandScore === 6) {
    for (const [brand, score] of Object.entries(BRAND_SCORES)) {
      if (brandLower.includes(brand) || brand.includes(brandLower)) {
        brandScore = score;
        break;
      }
    }
  }

  // 3. Category Demand Score (0-10) - 20% weight
  const categoryLower = couponCategory.toLowerCase();
  const categoryScore = CATEGORY_SCORES[categoryLower] || 6;

  // 4. Expiry/Freshness Score (0-10) - 15% weight
  const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
  let expiryScore = 0;
  if (daysUntilExpiry >= 90) expiryScore = 10;
  else if (daysUntilExpiry >= 60) expiryScore = 9;
  else if (daysUntilExpiry >= 45) expiryScore = 8;
  else if (daysUntilExpiry >= 30) expiryScore = 7;
  else if (daysUntilExpiry >= 21) expiryScore = 6;
  else if (daysUntilExpiry >= 14) expiryScore = 5;
  else if (daysUntilExpiry >= 7) expiryScore = 3;
  else if (daysUntilExpiry >= 3) expiryScore = 2;
  else if (daysUntilExpiry >= 0) expiryScore = 1;
  else expiryScore = 0; // Expired

  // 5. Usage Flexibility Score (0-10) - 10% weight
  let flexibilityScore = 10; // Start with perfect score
  if (minAmount) {
    // Penalize based on minimum order requirement
    if (minAmount >= 5000) flexibilityScore = 4;
    else if (minAmount >= 3000) flexibilityScore = 5;
    else if (minAmount >= 2000) flexibilityScore = 6;
    else if (minAmount >= 1000) flexibilityScore = 7;
    else if (minAmount >= 500) flexibilityScore = 8;
    else if (minAmount >= 200) flexibilityScore = 9;
  }

  // Calculate weighted average
  const finalScore =
    worthScore * 0.3 +
    brandScore * 0.25 +
    categoryScore * 0.2 +
    expiryScore * 0.15 +
    flexibilityScore * 0.1;

  // Round to 1 decimal place and ensure it's between 1 and 10
  return Math.max(1, Math.min(10, Math.round(finalScore * 10) / 10));
}

/**
 * Get value score badge color and label
 */
export function getValueScoreBadge(score: number): {
  color: string;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  if (score >= 9) {
    return {
      color: "diamond",
      label: "Diamond",
      bgClass: "bg-purple-500/20",
      textClass: "text-purple-300",
      borderClass: "border-purple-500/30",
    };
  } else if (score >= 8) {
    return {
      color: "gold",
      label: "Gold",
      bgClass: "bg-yellow-500/20",
      textClass: "text-yellow-300",
      borderClass: "border-yellow-500/30",
    };
  } else if (score >= 6.5) {
    return {
      color: "silver",
      label: "Silver",
      bgClass: "bg-gray-400/20",
      textClass: "text-gray-300",
      borderClass: "border-gray-400/30",
    };
  } else if (score >= 5) {
    return {
      color: "bronze",
      label: "Bronze",
      bgClass: "bg-orange-600/20",
      textClass: "text-orange-400",
      borderClass: "border-orange-600/30",
    };
  } else {
    return {
      color: "basic",
      label: "Basic",
      bgClass: "bg-white/10",
      textClass: "text-white/60",
      borderClass: "border-white/20",
    };
  }
}
