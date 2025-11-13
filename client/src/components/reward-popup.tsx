import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Gift, 
  Sparkles, 
  Trophy, 
  Zap, 
  X,
  Star,
  Coins,
  Ticket,
  Award,
  Crown,
  CircleDollarSign,
  Flame,
  Gem
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getValueScoreBadge } from "@shared/coupon-value-calculator";

interface Reward {
  type: 'coupon' | 'points' | 'freebie';
  value: number;
  title: string;
  description: string;
  tier?: 'gold' | 'silver' | 'bronze' | 'diamond';
}

interface RewardPopupProps {
  isOpen: boolean;
  onClose: (reward: Reward | null) => void;
  onRedeem: (reward: Reward) => void;
}

type GameType = 'scratch' | 'spin' | 'slot' | 'card' | 'coin' | 'tap' | 'puzzle';

const GAME_TYPES: GameType[] = ['scratch', 'spin', 'slot', 'card', 'coin', 'tap', 'puzzle'];

export function RewardPopup({ isOpen, onClose, onRedeem }: RewardPopupProps) {
  const [gameType, setGameType] = useState<GameType>('scratch');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [reward, setReward] = useState<Reward | null>(null);

  // Scratch card
  const [scratchProgress, setScratchProgress] = useState(0);

  // Spin wheel
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Slot machine
  const [slots, setSlots] = useState([0, 0, 0]);
  const [slotSpinning, setSlotSpinning] = useState(false);

  // Card pick
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false, false]);

  // Coin flip
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [userChoice, setUserChoice] = useState<'heads' | 'tails' | null>(null);

  // Tap game
  const [tapTargetVisible, setTapTargetVisible] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [tapStarted, setTapStarted] = useState(false);
  const tapTargetVisibleRef = useRef(false);

  // Puzzle
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [puzzleQuestion, setPuzzleQuestion] = useState({ q: '', a: '' });

  useEffect(() => {
    if (isOpen) {
      const randomGame = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
      setGameType(randomGame);
      resetGame();
      
      // For tap game, start after a delay
      if (randomGame === 'tap') {
        setTimeout(() => startTapGame(), 1000);
      }
      
      // For puzzle, generate question
      if (randomGame === 'puzzle') {
        generatePuzzle();
      }
    }
  }, [isOpen]);

  const resetGame = () => {
    setGameState('playing');
    setReward(null);
    setScratchProgress(0);
    setSpinning(false);
    setRotation(0);
    setSlots([0, 0, 0]);
    setSlotSpinning(false);
    setSelectedCard(null);
    setRevealedCards([false, false, false, false, false]);
    setCoinFlipping(false);
    setCoinResult(null);
    setUserChoice(null);
    setTapTargetVisible(false);
    setTapStarted(false);
    setPuzzleAnswer('');
  };

  const generateReward = (winLevel: 'high' | 'medium' | 'low' | 'none'): Reward | null => {
    if (winLevel === 'none') return null;

    const rewards = {
      high: [
        { type: 'coupon' as const, value: 9.5, title: '50% Off Coupon', description: 'Premium brands, valid 60 days', tier: 'diamond' as const },
        { type: 'coupon' as const, value: 9, title: '₹1000 Off Coupon', description: 'Min purchase ₹2000', tier: 'gold' as const },
        { type: 'coupon' as const, value: 8.5, title: '₹500 Off Coupon', description: 'Min purchase ₹1000', tier: 'gold' as const },
        { type: 'points' as const, value: 1000, title: '1000 Reward Points', description: 'Added to your account', tier: 'gold' as const },
      ],
      medium: [
        { type: 'coupon' as const, value: 7, title: '30% Off Coupon', description: 'On your next purchase', tier: 'silver' as const },
        { type: 'coupon' as const, value: 6, title: '₹300 Off Coupon', description: 'Min purchase ₹600', tier: 'silver' as const },
        { type: 'coupon' as const, value: 5.5, title: 'Free Shipping Voucher', description: 'On next 3 orders', tier: 'silver' as const },
        { type: 'points' as const, value: 500, title: '500 Reward Points', description: 'Added to your account', tier: 'silver' as const },
      ],
      low: [
        { type: 'coupon' as const, value: 4, title: '15% Off Coupon', description: 'On your next purchase', tier: 'bronze' as const },
        { type: 'coupon' as const, value: 3, title: '₹100 Off Coupon', description: 'Min purchase ₹500', tier: 'bronze' as const },
        { type: 'points' as const, value: 200, title: '200 Reward Points', description: 'Added to your account', tier: 'bronze' as const },
        { type: 'freebie' as const, value: 2, title: 'Lucky Draw Entry', description: 'Win up to ₹10,000', tier: 'bronze' as const },
      ]
    };

    const levelRewards = rewards[winLevel];
    return levelRewards[Math.floor(Math.random() * levelRewards.length)];
  };

  // Scratch Card
  const handleScratch = () => {
    const newProgress = Math.min(scratchProgress + 20, 100);
    setScratchProgress(newProgress);
    
    if (newProgress >= 100) {
      const winChance = Math.random();
      const winLevel = winChance > 0.7 ? 'high' : winChance > 0.4 ? 'medium' : 'low';
      const wonReward = generateReward(winLevel);
      setReward(wonReward);
      setGameState(wonReward ? 'won' : 'lost');
    }
  };

  // Spin Wheel
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    
    const winChance = Math.random();
    const winLevel = winChance > 0.6 ? 'high' : winChance > 0.3 ? 'medium' : 'low';
    const spins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = spins * 360 + (winLevel === 'high' ? 0 : winLevel === 'medium' ? 120 : 240);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      const wonReward = generateReward(winLevel);
      setReward(wonReward);
      setGameState(wonReward ? 'won' : 'lost');
      setSpinning(false);
    }, 3000);
  };

  // Slot Machine
  const handleSlotSpin = () => {
    if (slotSpinning) return;
    setSlotSpinning(true);
    
    let spinCount = 0;
    const interval = setInterval(() => {
      setSlots([
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9)
      ]);
      spinCount++;
      
      if (spinCount > 20) {
        clearInterval(interval);
        const winChance = Math.random();
        let finalSlots;
        let winLevel: 'high' | 'medium' | 'low' | 'none';
        
        if (winChance > 0.9) {
          finalSlots = [7, 7, 7];
          winLevel = 'high';
        } else if (winChance > 0.6) {
          const match = Math.floor(Math.random() * 9);
          finalSlots = [match, match, Math.floor(Math.random() * 9)];
          winLevel = 'medium';
        } else if (winChance > 0.3) {
          finalSlots = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
          winLevel = 'low';
        } else {
          finalSlots = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
          winLevel = 'none';
        }
        
        setSlots(finalSlots);
        const wonReward = generateReward(winLevel);
        setReward(wonReward);
        setGameState(wonReward ? 'won' : 'lost');
        setSlotSpinning(false);
      }
    }, 100);
  };

  // Card Pick
  const handleCardPick = (index: number) => {
    if (selectedCard !== null) return;
    
    setSelectedCard(index);
    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);
    
    const winChance = Math.random();
    const winLevel = winChance > 0.6 ? 'high' : winChance > 0.3 ? 'medium' : 'low';
    const wonReward = generateReward(winLevel);
    
    setTimeout(() => {
      setReward(wonReward);
      setGameState(wonReward ? 'won' : 'lost');
    }, 500);
  };

  // Coin Flip
  const handleCoinFlip = (choice: 'heads' | 'tails') => {
    if (coinFlipping || userChoice) return;
    
    setUserChoice(choice);
    setCoinFlipping(true);
    
    setTimeout(() => {
      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinResult(result);
      setCoinFlipping(false);
      
      const won = result === choice;
      const winLevel = won ? 'medium' : 'low';
      const wonReward = generateReward(winLevel);
      
      setTimeout(() => {
        setReward(wonReward);
        setGameState(wonReward ? 'won' : 'lost');
      }, 1000);
    }, 2000);
  };

  // Tap Game
  const startTapGame = () => {
    setTapStarted(true);
    const x = Math.random() * 200 + 50;
    const y = Math.random() * 200 + 50;
    setTapPosition({ x, y });
    setTapTargetVisible(true);
    tapTargetVisibleRef.current = true;
    
    setTimeout(() => {
      if (tapTargetVisibleRef.current) {
        setTapTargetVisible(false);
        tapTargetVisibleRef.current = false;
        const wonReward = generateReward('low');
        setReward(wonReward);
        setGameState('lost');
      }
    }, 2000);
  };

  const handleTap = () => {
    if (!tapTargetVisible) return;
    
    setTapTargetVisible(false);
    tapTargetVisibleRef.current = false;
    const wonReward = generateReward('high');
    setReward(wonReward);
    setGameState('won');
  };

  // Puzzle
  const generatePuzzle = () => {
    const puzzles = [
      { q: '5 + 3 = ?', a: '8' },
      { q: '10 - 4 = ?', a: '6' },
      { q: '6 × 2 = ?', a: '12' },
      { q: '15 ÷ 3 = ?', a: '5' },
      { q: '7 + 8 = ?', a: '15' },
    ];
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setPuzzleQuestion(puzzle);
  };

  const handlePuzzleSubmit = () => {
    const correct = puzzleAnswer.trim() === puzzleQuestion.a;
    const winLevel = correct ? 'high' : 'low';
    const wonReward = generateReward(winLevel);
    setReward(wonReward);
    setGameState(wonReward ? 'won' : 'lost');
  };

  const getTierColor = (tier?: 'gold' | 'silver' | 'bronze' | 'diamond') => {
    switch (tier) {
      case 'diamond': return 'from-purple-500 via-pink-500 to-purple-600';
      case 'gold': return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 'silver': return 'from-gray-300 via-gray-400 to-gray-500';
      case 'bronze': return 'from-orange-500 via-orange-600 to-orange-700';
      default: return 'from-blue-500 via-blue-600 to-blue-700';
    }
  };

  const getTierIcon = (tier?: 'gold' | 'silver' | 'bronze' | 'diamond') => {
    switch (tier) {
      case 'diamond': return <Gem className="h-6 w-6" />;
      case 'gold': return <Crown className="h-6 w-6" />;
      case 'silver': return <Award className="h-6 w-6" />;
      case 'bronze': return <Star className="h-6 w-6" />;
      default: return <Gift className="h-6 w-6" />;
    }
  };

  const getTierGlow = (tier?: 'gold' | 'silver' | 'bronze' | 'diamond') => {
    switch (tier) {
      case 'diamond': return 'shadow-[0_0_30px_rgba(168,85,247,0.6)]';
      case 'gold': return 'shadow-[0_0_30px_rgba(234,179,8,0.6)]';
      case 'silver': return 'shadow-[0_0_30px_rgba(209,213,219,0.6)]';
      case 'bronze': return 'shadow-[0_0_30px_rgba(249,115,22,0.6)]';
      default: return 'shadow-[0_0_30px_rgba(59,130,246,0.6)]';
    }
  };

  const renderGame = () => {
    if (gameState !== 'playing') {
      return (
        <div className="text-center py-8 space-y-6 relative">
          {gameState === 'won' && reward ? (
            <>
              {/* Animated background effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse", getTierGlow(reward.tier))} />
                <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                <div className="absolute top-20 right-10 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
              </div>

              {/* Trophy icon with 3D effect */}
              <div className="relative z-10">
                <div className={cn(
                  "w-24 h-24 mx-auto rounded-full flex items-center justify-center relative",
                  "bg-gradient-to-br from-green-400 via-emerald-500 to-green-600",
                  "shadow-[0_10px_40px_rgba(16,185,129,0.6)]",
                  "transform hover:scale-110 transition-transform duration-300",
                  "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-white/40 before:to-transparent before:opacity-60",
                  "animate-bounce"
                )}>
                  <Trophy className="h-12 w-12 text-white relative z-10 drop-shadow-lg" />
                </div>
              </div>

              {/* Title with gradient */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                  🎉 Congratulations! 🎉
                </h3>
                <p className="text-white/80 text-lg font-light">You won an amazing reward!</p>
              </div>
              
              {/* Reward card with 3D effect */}
              <div className="relative">
                <div className={cn(
                  "mx-auto max-w-sm p-6 rounded-2xl bg-gradient-to-br relative overflow-hidden",
                  getTierColor(reward.tier),
                  getTierGlow(reward.tier),
                  "text-white transform hover:scale-105 transition-all duration-300",
                  "border-2 border-white/20"
                )}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 bg-black/20 px-3 py-2 rounded-full backdrop-blur-sm">
                        {getTierIcon(reward.tier)}
                        <span className="text-sm font-bold uppercase tracking-wider">{reward.tier || 'Reward'}</span>
                      </div>
                      {reward.type === 'coupon' && (
                        <div className="bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
                          <span className="text-lg font-bold">{reward.value}/10</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-2xl font-bold mb-2 drop-shadow-lg">{reward.title}</h4>
                    <p className="text-sm text-white/90 leading-relaxed">{reward.description}</p>
                  </div>
                </div>
              </div>

              {/* Redeem button with 3D effect */}
              <Button
                onClick={() => {
                  onRedeem(reward);
                  onClose(null);
                }}
                className={cn(
                  "bg-white text-black hover:bg-white/90 rounded-xl px-8 py-6 text-lg font-bold",
                  "shadow-[0_10px_30px_rgba(255,255,255,0.3)]",
                  "transform hover:scale-105 hover:shadow-[0_15px_40px_rgba(255,255,255,0.4)]",
                  "transition-all duration-300"
                )}
                data-testid="button-redeem-reward"
              >
                <Ticket className="h-5 w-5 mr-2" />
                REDEEM NOW
              </Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border-2 border-white/20">
                <Sparkles className="h-10 w-10 text-white/60" />
              </div>
              <h3 className="text-xl font-bold text-white">Better luck next time!</h3>
              {reward && (
                <div className="mx-auto max-w-sm p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-white/80 font-medium">{reward.title}</p>
                  <p className="text-sm text-white/60">{reward.description}</p>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    switch (gameType) {
      case 'scratch':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                Scratch to Reveal
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Tap multiple times to reveal your prize!</p>
            </div>
            <div 
              className="relative h-72 rounded-2xl cursor-pointer overflow-hidden shadow-[0_10px_40px_rgba(168,85,247,0.4)] transform hover:scale-105 transition-transform duration-300"
              onClick={handleScratch}
              data-testid="scratch-card"
            >
              {/* Hidden reward */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                    <Gift className="h-12 w-12 text-white drop-shadow-lg animate-bounce" />
                  </div>
                  <p className="text-white text-2xl font-bold drop-shadow-lg">Your Prize!</p>
                </div>
              </div>
              
              {/* Scratch overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 transition-opacity duration-300"
                style={{ opacity: 1 - scratchProgress / 100 }}
              >
                <div className="h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.3),transparent_70%)]" />
                  <div className="text-center space-y-3 relative z-10">
                    <Sparkles className="h-12 w-12 text-yellow-400 mx-auto animate-pulse" />
                    <p className="text-white text-xl font-bold tracking-wider drop-shadow-lg">SCRATCH HERE</p>
                    <p className="text-white/80 text-sm">Tap to reveal</p>
                  </div>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/30 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-white/20">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                    style={{ width: `${scratchProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'spin':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
                Spin the Wheel
                <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Test your luck with a spin!</p>
            </div>
            <div className="relative py-8">
              {/* Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-500/30 to-red-500/30 rounded-full blur-3xl" />
              
              {/* Wheel */}
              <div 
                className="w-64 h-64 mx-auto rounded-full border-8 border-white/30 relative overflow-hidden shadow-[0_10px_50px_rgba(234,179,8,0.4)] bg-gradient-to-br from-gray-800 to-gray-900"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute inset-0",
                      i % 2 === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-gradient-to-br from-red-500 to-red-700"
                    )}
                    style={{
                      transform: `rotate(${i * 60}deg)`,
                      clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)'
                    }}
                  />
                ))}
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-200 border-4 border-gray-800 shadow-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg"></div>
              </div>
            </div>
            <Button
              onClick={handleSpin}
              disabled={spinning}
              className={cn(
                "w-full rounded-xl py-6 text-lg font-bold transition-all duration-300",
                spinning 
                  ? "bg-white/50 text-black/50 cursor-not-allowed" 
                  : "bg-white text-black hover:bg-white/90 shadow-[0_5px_20px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.4)] transform hover:scale-105"
              )}
              data-testid="button-spin"
            >
              <Zap className="h-5 w-5 mr-2 inline" />
              {spinning ? 'SPINNING...' : 'SPIN NOW'}
            </Button>
          </div>
        );

      case 'slot':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Flame className="h-6 w-6 text-red-400 animate-pulse" />
                Digital Slot Machine
                <Flame className="h-6 w-6 text-red-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Pull the lever and match the numbers!</p>
            </div>
            
            {/* Slot machine container with 3D effect */}
            <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 rounded-2xl shadow-[0_10px_50px_rgba(220,38,38,0.4)] border-4 border-yellow-600/50">
              <div className="flex justify-center gap-3 mb-4">
                {slots.map((num, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-20 h-28 bg-gradient-to-b from-gray-900 to-black border-4 border-yellow-600/80 rounded-xl flex items-center justify-center relative overflow-hidden",
                      "shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]",
                      slotSpinning && "animate-pulse"
                    )}
                  >
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent" />
                    <span className={cn(
                      "text-5xl font-bold relative z-10",
                      num === 7 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" : "text-white"
                    )}>
                      {num}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Prizes legend with icons */}
              <div className="text-center text-sm space-y-1 bg-black/30 p-3 rounded-lg border border-yellow-600/30">
                <p className="text-yellow-400 font-bold flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4" />
                  777 = MEGA PRIZE! 50% Off
                </p>
                <p className="text-white/80">Two matching = Good Prize</p>
                <p className="text-white/60">No match = Consolation Prize</p>
              </div>
            </div>
            
            <Button
              onClick={handleSlotSpin}
              disabled={slotSpinning}
              className={cn(
                "w-full rounded-xl py-6 text-lg font-bold transition-all duration-300",
                slotSpinning 
                  ? "bg-white/50 text-black/50 cursor-not-allowed" 
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-[0_5px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_8px_30px_rgba(234,179,8,0.6)] transform hover:scale-105"
              )}
              data-testid="button-slot-spin"
            >
              <Zap className="h-5 w-5 mr-2 inline" />
              {slotSpinning ? 'SPINNING...' : 'PULL LEVER'}
            </Button>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Gift className="h-6 w-6 text-blue-400 animate-pulse" />
                Pick a Mystery Card
                <Gift className="h-6 w-6 text-blue-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Choose wisely! One card holds your prize</p>
            </div>
            <div className="grid grid-cols-5 gap-3 py-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => handleCardPick(i)}
                  disabled={selectedCard !== null}
                  className={cn(
                    "aspect-[3/4] rounded-xl transition-all duration-300 relative group",
                    "border-2",
                    revealedCards[i]
                      ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.6)] scale-110"
                      : "bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 border-blue-400/50 hover:scale-110 hover:shadow-[0_10px_30px_rgba(59,130,246,0.5)]",
                    selectedCard !== null && !revealedCards[i] && "opacity-30 scale-95"
                  )}
                  data-testid={`card-${i}`}
                >
                  {/* Card shine effect */}
                  {!revealedCards[i] && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  <div className="h-full flex items-center justify-center">
                    {revealedCards[i] ? (
                      <Gift className="h-10 w-10 text-white drop-shadow-lg animate-bounce" />
                    ) : (
                      <span className="text-4xl font-bold text-white drop-shadow-lg">?</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'coin':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Coins className="h-6 w-6 text-yellow-400 animate-pulse" />
                Coin Flip Challenge
                <Coins className="h-6 w-6 text-yellow-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Will luck be on your side?</p>
            </div>
            
            <div className="flex justify-center py-8 relative">
              {/* Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/30 rounded-full blur-3xl" />
              
              {/* Coin */}
              <div className={cn(
                "w-36 h-36 rounded-full flex items-center justify-center text-white font-bold text-4xl relative z-10",
                "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600",
                "shadow-[0_10px_40px_rgba(234,179,8,0.6)]",
                "border-4 border-yellow-300",
                coinFlipping && "animate-spin"
              )}>
                {/* Inner circle effect */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 border-2 border-yellow-400 flex items-center justify-center">
                  {coinResult ? (
                    <span className="drop-shadow-lg">{coinResult.toUpperCase().charAt(0)}</span>
                  ) : (
                    <CircleDollarSign className="h-16 w-16 drop-shadow-lg" />
                  )}
                </div>
              </div>
            </div>

            {!userChoice ? (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleCoinFlip('heads')}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl py-6 text-lg font-bold shadow-[0_5px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.6)] transform hover:scale-105 transition-all duration-300"
                  data-testid="button-heads"
                >
                  HEADS
                </Button>
                <Button
                  onClick={() => handleCoinFlip('tails')}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-xl py-6 text-lg font-bold shadow-[0_5px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.6)] transform hover:scale-105 transition-all duration-300"
                  data-testid="button-tails"
                >
                  TAILS
                </Button>
              </div>
            ) : (
              <div className="text-center bg-white/10 border border-white/20 rounded-xl p-4">
                <p className="text-white text-lg font-medium">You chose: <span className="text-yellow-400 font-bold">{userChoice.toUpperCase()}</span></p>
                <p className="text-white/60 text-sm mt-1">Flipping coin...</p>
              </div>
            )}
          </div>
        );

      case 'tap':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Zap className="h-6 w-6 text-green-400 animate-pulse" />
                Quick Tap Challenge!
                <Zap className="h-6 w-6 text-green-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Tap the coin before it vanishes!</p>
            </div>
            
            <div className="relative h-72 bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(16,185,129,0.3)]">
              {/* Background grid effect */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border border-white/20" />
                  ))}
                </div>
              </div>
              
              {tapTargetVisible && (
                <button
                  onClick={handleTap}
                  className="absolute w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.8)] border-4 border-yellow-300 animate-pulse transform hover:scale-110 transition-transform duration-200"
                  style={{
                    left: `${tapPosition.x}px`,
                    top: `${tapPosition.y}px`,
                  }}
                  data-testid="tap-target"
                >
                  <Coins className="h-10 w-10 text-white drop-shadow-lg" />
                </button>
              )}
              {!tapStarted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                      <Zap className="h-8 w-8 text-green-400 animate-pulse" />
                    </div>
                    <p className="text-white/80 text-lg font-medium">Get ready...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'puzzle':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-purple-400 animate-pulse" />
                Quick Math Puzzle
                <Star className="h-6 w-6 text-purple-400 animate-pulse" />
              </h3>
              <p className="text-white/60 text-sm">Solve the equation to unlock your reward!</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/30 rounded-2xl p-8 shadow-[0_10px_40px_rgba(168,85,247,0.3)]">
              <p className="text-5xl font-bold text-center text-white mb-8 drop-shadow-lg">{puzzleQuestion.q}</p>
              <input
                type="text"
                value={puzzleAnswer}
                onChange={(e) => setPuzzleAnswer(e.target.value)}
                className="w-full bg-black/30 border-2 border-white/30 rounded-xl px-6 py-4 text-white text-center text-3xl font-bold backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300"
                placeholder="?"
                data-testid="input-puzzle-answer"
              />
            </div>

            <Button
              onClick={handlePuzzleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl py-6 text-lg font-bold shadow-[0_5px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.6)] transform hover:scale-105 transition-all duration-300"
              data-testid="button-submit-puzzle"
            >
              <Star className="h-5 w-5 mr-2 inline" />
              SUBMIT ANSWER
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(reward)}>
      <DialogContent className="bg-black border-white/20 text-white max-w-md">
        <button
          onClick={() => onClose(reward)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          data-testid="button-close-reward"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        <div className="mt-6">
          {gameState === 'playing' && (
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Claim Your Reward!</h2>
              <p className="text-white/60 text-sm">Play to win exclusive prizes</p>
            </div>
          )}
          
          {renderGame()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
