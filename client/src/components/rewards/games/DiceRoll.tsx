import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dices, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiceRollProps {
  onComplete: (success: boolean) => void;
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export function DiceRoll({ onComplete }: DiceRollProps) {
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState([0, 0]);
  const [hasRolled, setHasRolled] = useState(false);

  const handleRoll = () => {
    if (rolling || hasRolled) return;
    setRolling(true);
    setHasRolled(true);
    
    let rollCount = 0;
    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6)
      ]);
      rollCount++;
      
      if (rollCount > 20) {
        clearInterval(interval);
        
        const winProbability = Math.random();
        let finalDice: number[];
        let success: boolean;
        
        if (winProbability > 0.95) {
          // Jackpot - double 6s
          finalDice = [5, 5];
          success = true;
        } else if (winProbability > 0.70) {
          // High win - doubles
          const value = Math.floor(Math.random() * 6);
          finalDice = [value, value];
          success = true;
        } else if (winProbability > 0.40) {
          // Medium win - sum >= 9
          finalDice = [4 + Math.floor(Math.random() * 2), 4 + Math.floor(Math.random() * 2)];
          success = true;
        } else if (winProbability > 0.20) {
          // Low win - any even sum
          const d1 = Math.floor(Math.random() * 6);
          const d2 = (d1 % 2 === 0) ? Math.floor(Math.random() * 3) * 2 : Math.floor(Math.random() * 3) * 2 + 1;
          finalDice = [d1, d2];
          success = (d1 + d2 + 2) % 2 === 0;
        } else {
          // No win
          finalDice = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)];
          success = false;
        }
        
        setDice(finalDice);
        setRolling(false);
        
        setTimeout(() => {
          onComplete(success);
        }, 1000);
      }
    }, 100);
  };

  const total = dice[0] + dice[1] + 2;
  const isDouble = dice[0] === dice[1];

  return (
    <div className="space-y-8 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Dices className="h-8 w-8 text-blue-400 animate-pulse3d" />
          Lucky Dice Roll
          <Dices className="h-8 w-8 text-blue-400 animate-pulse3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Roll for your reward!</p>
      </div>

      <div className="relative py-12">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        
        {/* Dice container */}
        <div className="relative flex justify-center gap-8">
          {dice.map((value, i) => (
            <div
              key={i}
              className={cn(
                "w-32 h-32 preserve-3d",
                rolling && "animate-diceBounce"
              )}
              style={{
                animationDelay: `${i * 0.1}s`
              }}
            >
              <div
                className={cn(
                  "w-full h-full bg-gradient-to-br from-white via-gray-100 to-gray-200",
                  "border-4 border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.8)]",
                  "flex items-center justify-center preserve-3d",
                  "relative overflow-hidden",
                  !rolling && isDouble && "animate-pulse3d"
                )}
              >
                {/* Dots reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Dice face */}
                <span className={cn(
                  "text-7xl text-gray-800 drop-shadow-lg relative z-10",
                  !rolling && "transition-all duration-300"
                )}>
                  {DICE_FACES[value]}
                </span>
                
                {/* Corner highlights */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/50 rounded-full" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Result display */}
        {!rolling && hasRolled && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md animate-popIn3d">
            <div className={cn(
              "px-6 py-4 border-4 mx-auto w-fit",
              "shadow-[0_0_30px_rgba(0,0,0,0.6)]",
              isDouble
                ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-yellow-300/50 shadow-[0_0_40px_rgba(234,179,8,0.7)]"
                : total >= 10
                ? "bg-gradient-to-r from-green-500 via-green-600 to-green-500 border-green-400/50"
                : total % 2 === 0
                ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 border-blue-400/50"
                : "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 border-gray-500/50"
            )}>
              <div className="text-center space-y-1">
                <p className="text-white/80 text-xs tracking-widest uppercase">
                  {isDouble ? '🎉 DOUBLE!' : total >= 10 ? '⭐ HIGH ROLL!' : total % 2 === 0 ? '✨ EVEN!' : 'Total'}
                </p>
                <p className="text-white text-4xl font-black">{total}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleRoll}
        disabled={rolling || hasRolled}
        className={cn(
          "w-full py-8 text-xl font-black tracking-wider transition-all duration-300 mt-8",
          rolling || hasRolled
            ? "bg-white/30 text-white/50 cursor-not-allowed border-2 border-white/20" 
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-4 border-white/50 shadow-[0_10px_40px_rgba(147,51,234,0.4)] hover:shadow-[0_15px_60px_rgba(147,51,234,0.6)] hover:scale-105"
        )}
        data-testid="button-roll-dice"
      >
        {rolling ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            ROLLING...
          </div>
        ) : hasRolled ? (
          'ROLLED!'
        ) : (
          <>
            <Sparkles className="inline h-6 w-6 mr-2" />
            ROLL THE DICE!
            <Sparkles className="inline h-6 w-6 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
