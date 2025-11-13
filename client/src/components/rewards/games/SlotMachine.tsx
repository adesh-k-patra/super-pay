import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlotMachineProps {
  onComplete: (success: boolean) => void;
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣', '🔔', '🎰'];

export function SlotMachine({ onComplete }: SlotMachineProps) {
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState([0, 0, 0]);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setHasSpun(true);
    
    let spinCount = 0;
    const interval = setInterval(() => {
      setSlots([
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length)
      ]);
      spinCount++;
      
      if (spinCount > 30) {
        clearInterval(interval);
        
        const winChance = Math.random();
        let finalSlots: number[];
        let success: boolean;
        
        if (winChance > 0.95) {
          // Jackpot - triple 7s
          finalSlots = [6, 6, 6];
          success = true;
        } else if (winChance > 0.75) {
          // High win - triple match
          const match = Math.floor(Math.random() * SYMBOLS.length);
          finalSlots = [match, match, match];
          success = true;
        } else if (winChance > 0.45) {
          // Medium win - double match
          const match = Math.floor(Math.random() * SYMBOLS.length);
          finalSlots = [match, match, Math.floor(Math.random() * SYMBOLS.length)];
          success = true;
        } else if (winChance > 0.20) {
          // Low win - at least one special
          finalSlots = [
            Math.random() > 0.5 ? 5 : Math.floor(Math.random() * SYMBOLS.length),
            Math.floor(Math.random() * SYMBOLS.length),
            Math.floor(Math.random() * SYMBOLS.length)
          ];
          success = true;
        } else {
          // No win
          finalSlots = [
            Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 4) + 1,
            Math.floor(Math.random() * 4) + 2
          ];
          success = false;
        }
        
        setSlots(finalSlots);
        setSpinning(false);
        setTimeout(() => onComplete(success), 800);
      }
    }, 80);
  };

  return (
    <div className="space-y-8 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Flame className="h-8 w-8 text-red-400 animate-glow" />
          Digital Slot Machine
          <Flame className="h-8 w-8 text-red-400 animate-glow" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Match the symbols to win!</p>
      </div>

      <div className="relative">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-red-500/20 via-yellow-500/20 to-purple-500/20 blur-3xl" />
        
        {/* Machine frame */}
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 border-4 border-white/30 shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.1)]">
          {/* Top decoration */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-4 border-white/40 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.6)]">
            <span className="text-black text-xl font-black tracking-wider">SLOTS</span>
          </div>
          
          {/* Slots display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {slots.map((slotIndex, i) => (
              <div
                key={i}
                className={cn(
                  "relative aspect-square bg-gradient-to-br from-white via-gray-100 to-gray-200",
                  "border-4 border-gray-800 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]",
                  "overflow-hidden"
                )}
              >
                {/* Spinning animation background */}
                {spinning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-slotSpin" />
                )}
                
                {/* Symbol */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  spinning && "animate-slotSpin"
                )}>
                  <span className={cn(
                    "text-6xl transition-all duration-300",
                    !spinning && slots[0] === slots[1] && slots[1] === slots[2] && "animate-bounce3d scale-110"
                  )}>
                    {SYMBOLS[slotIndex]}
                  </span>
                </div>
                
                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
          
          {/* Win indicators */}
          {!spinning && hasSpun && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 transition-all duration-500",
                    slots[0] === slots[1] && slots[1] === slots[2]
                      ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.8)]"
                      : (i < 2 && slots[i] === slots[i + 1])
                      ? "bg-gradient-to-r from-green-400 via-green-500 to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                      : "bg-white/20"
                  )}
                />
              ))}
            </div>
          )}
          
          {/* Decorative lights */}
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full",
                  spinning
                    ? "bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                    : "bg-white/20"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={spinning || hasSpun}
        className={cn(
          "w-full py-8 text-xl font-black tracking-wider transition-all duration-300",
          spinning || hasSpun
            ? "bg-white/30 text-white/50 cursor-not-allowed border-2 border-white/20" 
            : "bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white hover:from-red-600 hover:via-red-700 hover:to-red-600 border-4 border-red-400/50 shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_60px_rgba(239,68,68,0.6)] hover:scale-105"
        )}
        data-testid="button-spin-slots"
      >
        {spinning ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            SPINNING...
          </div>
        ) : hasSpun ? (
          'SPUN!'
        ) : (
          <>
            <Zap className="inline h-6 w-6 mr-2" />
            PULL LEVER!
            <Zap className="inline h-6 w-6 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
