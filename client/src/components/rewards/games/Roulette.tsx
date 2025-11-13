import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Disc, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RouletteProps {
  onComplete: (success: boolean) => void;
}

const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export function Roulette({ onComplete }: RouletteProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setHasSpun(true);
    setResult(null);
    
    setTimeout(() => {
      const winProbability = Math.random();
      let winningNumber;
      
      if (winProbability > 0.92) {
        // Jackpot - lucky numbers
        winningNumber = [7, 17, 21, 27, 32][Math.floor(Math.random() * 5)];
      } else if (winProbability > 0.65) {
        // High win - red numbers
        winningNumber = RED_NUMBERS[Math.floor(Math.random() * RED_NUMBERS.length)];
      } else if (winProbability > 0.30) {
        // Medium win - even numbers
        winningNumber = (Math.floor(Math.random() * 18) + 1) * 2;
      } else {
        // Low/No win - random
        winningNumber = Math.floor(Math.random() * 37);
      }
      
      setResult(winningNumber);
      setSpinning(false);
      
      setTimeout(() => {
        const success = winningNumber > 0;
        onComplete(success);
      }, 1500);
    }, 4500);
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-green-600';
    return RED_NUMBERS.includes(num) ? 'bg-red-600' : 'bg-black';
  };

  return (
    <div className="space-y-8 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Disc className="h-8 w-8 text-red-400 animate-spin3d" />
          Lucky Roulette
          <Disc className="h-8 w-8 text-red-400 animate-spin3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Spin the wheel of fortune!</p>
      </div>

      <div className="relative py-8">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-500/20 via-green-500/20 to-black/20 rounded-full blur-3xl animate-pulse3d" />
        
        {/* Roulette wheel */}
        <div className="relative w-80 h-80 mx-auto">
          {/* Outer rim */}
          <div className="absolute inset-0 rounded-full border-8 border-yellow-600 shadow-[0_0_50px_rgba(202,138,4,0.6),inset_0_0_40px_rgba(0,0,0,0.8)]">
            {/* Spinning wheel */}
            <div 
              className={cn(
                "absolute inset-4 rounded-full overflow-hidden preserve-3d",
                spinning && "animate-rouletteSpin"
              )}
              style={{
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.9)'
              }}
            >
              {/* Segments */}
              {NUMBERS.map((num, i) => {
                const angle = (360 / NUMBERS.length) * i;
                const isRed = RED_NUMBERS.includes(num);
                const isGreen = num === 0;
                
                return (
                  <div
                    key={num}
                    className={cn(
                      "absolute inset-0",
                      isGreen ? "bg-green-600" : isRed ? "bg-red-600" : "bg-gray-900"
                    )}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: 'polygon(50% 50%, 100% 0, 100% 2.8%)',
                      transformOrigin: 'center'
                    }}
                  >
                    <div 
                      className="absolute top-6 right-2 text-white text-xs font-bold"
                      style={{ 
                        transform: `rotate(${-angle}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      {num}
                    </div>
                  </div>
                );
              })}
              
              {/* Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 border-4 border-yellow-900 shadow-[0_0_30px_rgba(234,179,8,0.6)] flex items-center justify-center">
                <Sparkles className={cn(
                  "h-8 w-8 text-white",
                  spinning && "animate-spin3d"
                )} />
              </div>
            </div>
          </div>
          
          {/* Ball indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <div className={cn(
              "w-4 h-4 rounded-full bg-white border-2 border-gray-800",
              "shadow-[0_0_15px_rgba(255,255,255,0.8)]",
              spinning && "animate-bounce3d"
            )} />
          </div>
        </div>
        
        {/* Result display */}
        {result !== null && !spinning && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 animate-popIn3d">
            <div className={cn(
              "px-8 py-4 rounded-lg border-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]",
              getNumberColor(result),
              "border-white/40"
            )}>
              <div className="text-center">
                <p className="text-white/70 text-xs tracking-widest uppercase mb-1">Result</p>
                <p className="text-white text-4xl font-black">{result}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={handleSpin}
        disabled={spinning || hasSpun}
        className={cn(
          "w-full py-8 text-xl font-black tracking-wider transition-all duration-300 mt-16",
          spinning || hasSpun
            ? "bg-white/30 text-white/50 cursor-not-allowed border-2 border-white/20" 
            : "bg-gradient-to-r from-red-600 via-green-600 to-black text-white border-4 border-white/50 shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_60px_rgba(255,255,255,0.5)] hover:scale-105"
        )}
        data-testid="button-spin-roulette"
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
            <Sparkles className="inline h-6 w-6 mr-2" />
            SPIN THE WHEEL!
            <Sparkles className="inline h-6 w-6 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
