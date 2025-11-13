import { useState, useEffect } from 'react';

interface Reward {
  type: 'coupon' | 'points' | 'freebie';
  value: number;
  title: string;
  description: string;
  tier?: 'gold' | 'silver' | 'bronze' | 'diamond';
  timestamp: number;
}

const STORAGE_KEY = 'pending_reward';

export function useRewardState() {
  const [pendingReward, setPendingReward] = useState<Reward | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const reward = JSON.parse(stored);
        setPendingReward(reward);
      } catch (e) {
        console.error('Failed to parse pending reward', e);
      }
    }
  }, []);

  const savePendingReward = (reward: Reward) => {
    const rewardWithTimestamp = {
      ...reward,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rewardWithTimestamp));
    setPendingReward(rewardWithTimestamp);
  };

  const clearPendingReward = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPendingReward(null);
  };

  const hasPendingReward = (): boolean => {
    return pendingReward !== null;
  };

  return {
    pendingReward,
    savePendingReward,
    clearPendingReward,
    hasPendingReward
  };
}
