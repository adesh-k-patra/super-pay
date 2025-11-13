import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Trophy, Sparkles, Gift, Gem, Crown, Award, Star, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import './animations.css';

import { ScratchCard } from './games/ScratchCard';
import { SpinWheel } from './games/SpinWheel';
import { SlotMachine } from './games/SlotMachine';
import { PickCard } from './games/PickCard';
import { Roulette } from './games/Roulette';
import { DiceRoll } from './games/DiceRoll';
import { MemoryMatch } from './games/MemoryMatch';
import { TargetShoot } from './games/TargetShoot';
import { NumberMatch } from './games/NumberMatch';

import { getRandomWin, getTierProperties, type Reward } from '@/lib/rewards/reward-engine';

type GameType = 'scratch' | 'spin' | 'slot' | 'card' | 'roulette' | 'dice' | 'memory' | 'target' | 'number';
type GameState = 'playing' | 'celebrating' | 'cardReveal' | 'lost';

const GAMES: GameType[] = ['scratch', 'spin', 'slot', 'card', 'roulette', 'dice', 'memory', 'target', 'number'];

interface EnhancedRewardPopupProps {
  isOpen: boolean;
  onClose: (reward: Reward | null) => void;
  onRedeem: (reward: Reward) => void;
}

export function EnhancedRewardPopup({ isOpen, onClose, onRedeem }: EnhancedRewardPopupProps) {
  const [gameType, setGameType] = useState<GameType>('scratch');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [reward, setReward] = useState<Reward | null>(null);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
      setGameType(randomGame);
      setGameState('playing');
      setReward(null);
      setConfetti([]);
    }
  }, [isOpen]);

  const handleGameComplete = (success: boolean) => {
    if (success) {
      const wonReward = getRandomWin();
      setReward(wonReward);
      
      if (wonReward) {
        // Stage 1: Celebration (500ms)
        setGameState('celebrating');
        
        // Generate confetti
        const colors = ['#EAB308', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981'];
        const newConfetti = Array.from({ length: 40 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setConfetti(newConfetti);
        
        // Stage 2: Card Reveal (after 500ms)
        setTimeout(() => {
          setGameState('cardReveal');
        }, 500);
      } else {
        setGameState('lost');
      }
    } else {
      setGameState('lost');
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <Gem className="h-6 w-6" />;
      case 'gold': return <Crown className="h-6 w-6" />;
      case 'silver': return <Award className="h-6 w-6" />;
      case 'bronze': return <Star className="h-6 w-6" />;
      default: return <Gift className="h-6 w-6" />;
    }
  };

  const handleClose = () => {
    onClose(reward);
  };

  const handleCollect = () => {
    if (reward) {
      onClose(reward);
    }
  };

  const handleUseNow = () => {
    if (reward) {
      onRedeem(reward);
      onClose(null);
    }
  };

  const renderGame = () => {
    // Celebrating state
    if (gameState === 'celebrating' && reward) {
      return (
        <div className="relative py-16 px-6 min-h-[400px] flex items-center justify-center">
          {/* Confetti */}
          {confetti.map(({ id, left, delay, color }) => (
            <div
              key={id}
              className="absolute top-0 w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                backgroundColor: color,
              }}
            />
          ))}

          {/* Trophy burst */}
          <div className="text-center animate-celebration">
            <div className={cn(
              "w-32 h-32 mx-auto rounded-full flex items-center justify-center relative mb-6",
              "bg-gradient-to-br from-green-400 via-emerald-500 to-green-600"
            )}
            style={{
              boxShadow: '0 20px 60px rgba(16,185,129,0.6), 0 0 100px rgba(16,185,129,0.4)'
            }}>
              <Trophy className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-5xl font-black bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
              🎉 WINNER! 🎉
            </h3>
          </div>
        </div>
      );
    }

    // Card reveal state
    if (gameState === 'cardReveal' && reward) {
      const tierProps = getTierProperties(reward.tier);
      
      return (
        <div className="relative py-8 px-4 min-h-[500px] flex flex-col items-center justify-center">
          {/* Confetti background (fading) */}
          {confetti.map(({ id, left, delay, color }) => (
            <div
              key={id}
              className="absolute top-0 w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                backgroundColor: color,
                opacity: 0.3,
              }}
            />
          ))}

          {/* Reward Card - Modern Design */}
          <div className="w-full max-w-md mx-auto animate-scaleIn">
            {/* Tier Badge */}
            <div className="flex justify-center mb-4">
              <div className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full border-2",
                `bg-gradient-to-r ${tierProps.gradient}`,
                tierProps.border
              )}
              style={{
                boxShadow: `0 10px 30px ${tierProps.glow.match(/rgba\([^)]+\)/)?.[0] || 'rgba(0,0,0,0.3)'}`
              }}>
                {getTierIcon(reward.tier)}
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  {tierProps.name} Tier
                </span>
              </div>
            </div>

            {/* Main Card */}
            <div className={cn(
              "relative overflow-hidden rounded-2xl border-2 p-8",
              "bg-gradient-to-br from-gray-900 via-black to-gray-900",
              tierProps.border
            )}
            style={{
              boxShadow: `0 20px 60px ${tierProps.glow.match(/rgba\([^)]+\)/)?.[0] || 'rgba(0,0,0,0.5)'}, 
                          0 0 100px ${tierProps.glow.match(/rgba\([^)]+\)/)?.[0] || 'rgba(0,0,0,0.3)'}`
            }}>
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
              
              {/* Content */}
              <div className="relative z-10 space-y-6 text-center">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center",
                    `bg-gradient-to-br ${tierProps.gradient}`
                  )}>
                    <Gift className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Reward Title */}
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-white leading-tight">
                    {reward.title}
                  </h4>
                  <p className="text-base text-white/80 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                {/* Value Display */}
                {reward.type === 'coupon' && (
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Reward Value</p>
                      <p className="text-2xl font-black text-white">
                        {reward.value.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                )}

                {/* Decorative sparkles */}
                <div className="flex justify-center gap-3 pt-2">
                  <Sparkles className="h-4 w-4 text-white/60 animate-pulse" />
                  <Sparkles className="h-5 w-5 text-white/80 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <Sparkles className="h-4 w-4 text-white/60 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {/* Use Now Button - Primary */}
              <Button
                onClick={handleUseNow}
                className={cn(
                  "w-full h-14 text-lg font-bold tracking-wide",
                  "bg-gradient-to-r text-white",
                  `${tierProps.gradient}`,
                  "hover:opacity-90 transition-all duration-300",
                  "rounded-xl border-2 border-white/20"
                )}
                style={{
                  boxShadow: `0 10px 40px ${tierProps.glow.match(/rgba\([^)]+\)/)?.[0] || 'rgba(0,0,0,0.3)'}`
                }}
                data-testid="button-use-now"
              >
                <Zap className="h-5 w-5 mr-2" />
                Use Now
              </Button>

              {/* Collect Button - Secondary */}
              <Button
                onClick={handleCollect}
                className={cn(
                  "w-full h-14 text-lg font-bold tracking-wide",
                  "bg-white/10 backdrop-blur-sm text-white",
                  "hover:bg-white/20 transition-all duration-300",
                  "rounded-xl border-2 border-white/20"
                )}
                data-testid="button-collect"
              >
                <Check className="h-5 w-5 mr-2" />
                Collect for Later
              </Button>
            </div>

            {/* Info text */}
            <p className="text-xs text-white/50 text-center mt-4">
              Choose "Use Now" to redeem immediately or "Collect" to save for later
            </p>
          </div>
        </div>
      );
    }

    // Lost state
    if (gameState === 'lost') {
      return (
        <div className="relative py-16 px-6 min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-center space-y-6 animate-scaleIn max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border-2 border-white/20">
              <Sparkles className="h-12 w-12 text-white/60" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-white">Almost There!</h3>
              <p className="text-white/70 text-lg">
                Better luck next time! Keep playing to win amazing rewards.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-6 text-base font-bold rounded-xl border-2 border-white/20 transition-all duration-300"
              data-testid="button-close-no-win"
            >
              Close
            </Button>
          </div>
        </div>
      );
    }

    // Playing state - render game
    switch (gameType) {
      case 'scratch': return <ScratchCard onComplete={handleGameComplete} />;
      case 'spin': return <SpinWheel onComplete={handleGameComplete} />;
      case 'slot': return <SlotMachine onComplete={handleGameComplete} />;
      case 'card': return <PickCard onComplete={handleGameComplete} />;
      case 'roulette': return <Roulette onComplete={handleGameComplete} />;
      case 'dice': return <DiceRoll onComplete={handleGameComplete} />;
      case 'memory': return <MemoryMatch onComplete={handleGameComplete} />;
      case 'target': return <TargetShoot onComplete={handleGameComplete} />;
      case 'number': return <NumberMatch onComplete={handleGameComplete} />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className={cn(
          "max-w-2xl w-[95vw] max-h-[95vh] bg-black border-2 text-white p-0 overflow-hidden rounded-2xl",
          "border-white/20"
        )}
        style={{
          boxShadow: '0 0 100px rgba(0,0,0,0.9), 0 0 60px rgba(255,255,255,0.1)'
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Reward Game</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-6 py-4 border-b-2 border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-lg border border-white/30">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-wide uppercase">Reward Challenge</h2>
                <p className="text-xs text-white/70 tracking-wide">Win Amazing Prizes!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              data-testid="button-close-game"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Game content */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(95vh - 80px)' }}>
          {renderGame()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
