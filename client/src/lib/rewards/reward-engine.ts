export type RewardTier = 'diamond' | 'gold' | 'silver' | 'bronze';
export type RewardType = 'coupon' | 'points' | 'freebie';
export type WinLevel = 'jackpot' | 'high' | 'medium' | 'low' | 'none';

export interface Reward {
  type: RewardType;
  value: number;
  title: string;
  description: string;
  tier: RewardTier;
  timestamp?: number;
}

/**
 * Calculate tier based on coupon value out of 10
 * Diamond: 9-10
 * Gold: 7-8.9
 * Silver: 5-6.9
 * Bronze: 0-4.9
 */
export function calculateTier(value: number): RewardTier {
  if (value >= 9) return 'diamond';
  if (value >= 7) return 'gold';
  if (value >= 5) return 'silver';
  return 'bronze';
}

/**
 * Get tier display properties
 */
export function getTierProperties(tier: RewardTier) {
  const properties = {
    diamond: {
      name: 'Diamond',
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      textGradient: 'from-purple-400 via-pink-400 to-purple-500',
      glow: 'shadow-[0_0_40px_rgba(168,85,247,0.7),0_0_80px_rgba(236,72,153,0.5)]',
      border: 'border-purple-400/50',
      icon: '💎',
      emoji: '🔮',
    },
    gold: {
      name: 'Gold',
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      textGradient: 'from-yellow-300 via-yellow-400 to-yellow-500',
      glow: 'shadow-[0_0_40px_rgba(234,179,8,0.7),0_0_80px_rgba(234,179,8,0.5)]',
      border: 'border-yellow-400/50',
      icon: '👑',
      emoji: '⭐',
    },
    silver: {
      name: 'Silver',
      gradient: 'from-gray-300 via-gray-400 to-gray-500',
      textGradient: 'from-gray-200 via-gray-300 to-gray-400',
      glow: 'shadow-[0_0_40px_rgba(209,213,219,0.7),0_0_80px_rgba(209,213,219,0.5)]',
      border: 'border-gray-300/50',
      icon: '🥈',
      emoji: '✨',
    },
    bronze: {
      name: 'Bronze',
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      textGradient: 'from-orange-400 via-orange-500 to-orange-600',
      glow: 'shadow-[0_0_40px_rgba(249,115,22,0.7),0_0_80px_rgba(249,115,22,0.5)]',
      border: 'border-orange-400/50',
      icon: '🥉',
      emoji: '🎁',
    },
  };

  return properties[tier];
}

/**
 * Generate reward based on win level
 */
export function generateReward(winLevel: WinLevel): Reward | null {
  if (winLevel === 'none') return null;

  const rewardPools = {
    jackpot: [
      { type: 'coupon' as const, value: 10, title: '₹2000 Mega Voucher', description: 'Premium brands, min purchase ₹3000, valid 90 days' },
      { type: 'coupon' as const, value: 9.5, title: '70% Off Super Coupon', description: 'Applicable on all categories, valid 60 days' },
      { type: 'points' as const, value: 9.8, title: '5000 Elite Points', description: 'Bonus reward points added instantly' },
    ],
    high: [
      { type: 'coupon' as const, value: 9, title: '₹1000 Off Coupon', description: 'Min purchase ₹2000, valid 60 days' },
      { type: 'coupon' as const, value: 8.5, title: '50% Off Premium Coupon', description: 'Top brands only, valid 45 days' },
      { type: 'coupon' as const, value: 8, title: '₹750 Off Coupon', description: 'Min purchase ₹1500, valid 60 days' },
      { type: 'points' as const, value: 8.2, title: '2500 Reward Points', description: 'Premium bonus points added to account' },
    ],
    medium: [
      { type: 'coupon' as const, value: 7, title: '₹500 Off Coupon', description: 'Min purchase ₹1000, valid 30 days' },
      { type: 'coupon' as const, value: 6.5, title: '35% Off Coupon', description: 'On your next purchase, valid 45 days' },
      { type: 'coupon' as const, value: 6, title: '₹300 Off Coupon', description: 'Min purchase ₹700, valid 30 days' },
      { type: 'points' as const, value: 6.5, title: '1000 Reward Points', description: 'Bonus points credited instantly' },
      { type: 'coupon' as const, value: 5.5, title: 'Free Delivery Pass', description: '5 free deliveries, valid 30 days' },
    ],
    low: [
      { type: 'coupon' as const, value: 4.5, title: '₹200 Off Coupon', description: 'Min purchase ₹500, valid 15 days' },
      { type: 'coupon' as const, value: 4, title: '20% Off Coupon', description: 'On your next purchase, valid 30 days' },
      { type: 'coupon' as const, value: 3.5, title: '₹100 Off Coupon', description: 'Min purchase ₹400, valid 15 days' },
      { type: 'points' as const, value: 3, title: '500 Reward Points', description: 'Bonus points added to account' },
      { type: 'freebie' as const, value: 2.5, title: 'Lucky Draw Entry', description: 'Win up to ₹50,000 in prizes' },
    ],
  };

  const pool = rewardPools[winLevel];
  const selected = pool[Math.floor(Math.random() * pool.length)];
  
  return {
    ...selected,
    tier: calculateTier(selected.value),
  };
}

/**
 * Determine win level from probability
 */
export function determineWinLevel(probability: number): WinLevel {
  if (probability >= 0.98) return 'jackpot';  // 2% chance
  if (probability >= 0.85) return 'high';     // 13% chance
  if (probability >= 0.50) return 'medium';   // 35% chance
  if (probability >= 0.20) return 'low';      // 30% chance
  return 'none';                               // 20% chance
}

/**
 * Get random win based on game difficulty
 */
export function getRandomWin(gameDifficulty: 'easy' | 'medium' | 'hard' = 'medium'): Reward | null {
  let probability = Math.random();
  
  // Adjust probability based on difficulty
  if (gameDifficulty === 'easy') {
    probability = probability * 0.7 + 0.3; // Shift towards higher values
  } else if (gameDifficulty === 'hard') {
    probability = probability * 0.6; // Shift towards lower values
  }
  
  const winLevel = determineWinLevel(probability);
  return generateReward(winLevel);
}
