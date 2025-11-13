import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hash, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberMatchProps {
  onComplete: (success: boolean) => void;
}

export function NumberMatch({ onComplete }: NumberMatchProps) {
  const [targetNumber] = useState(Math.floor(Math.random() * 20) + 10); // 10-29
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [availableNumbers] = useState(() => {
    // Generate random numbers including some that add up to target
    const nums: number[] = [];
    const target = Math.floor(Math.random() * 20) + 10;
    
    // Add numbers that sum to target
    const part1 = Math.floor(Math.random() * (target - 3)) + 2;
    const part2 = target - part1;
    nums.push(part1, part2);
    
    // Add random numbers
    while (nums.length < 12) {
      const num = Math.floor(Math.random() * 15) + 1;
      if (!nums.includes(num)) {
        nums.push(num);
      }
    }
    
    return nums.sort(() => Math.random() - 0.5);
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleNumberClick = (num: number) => {
    if (hasSubmitted) return;
    
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 4) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleSubmit = () => {
    if (selectedNumbers.length === 0 || hasSubmitted) return;
    
    setHasSubmitted(true);
    const sum = selectedNumbers.reduce((a, b) => a + b, 0);
    const difference = Math.abs(sum - targetNumber);
    
    setTimeout(() => {
      // Success if exact match or within 2
      const success = difference <= 2;
      onComplete(success);
    }, 1000);
  };

  const currentSum = selectedNumbers.reduce((a, b) => a + b, 0);
  const difference = currentSum - targetNumber;

  return (
    <div className="space-y-6 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Hash className="h-8 w-8 text-cyan-400 animate-pulse3d" />
          Number Match Challenge
          <Hash className="h-8 w-8 text-cyan-400 animate-pulse3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Add numbers to reach the target!</p>
      </div>

      {/* Target display */}
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-6 bg-gradient-to-br from-white/10 to-white/5 border-4 border-white/20">
          <div className="text-center space-y-2">
            <p className="text-white/60 text-xs uppercase tracking-widest">Target Number</p>
            <p className="text-white text-6xl font-black animate-pulse3d">{targetNumber}</p>
          </div>
        </div>
      </div>

      {/* Current sum display */}
      <div className={cn(
        "px-6 py-4 border-4 transition-all duration-300",
        difference === 0 && selectedNumbers.length > 0
          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          : Math.abs(difference) <= 2 && selectedNumbers.length > 0
          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
          : "bg-white/5 border-white/20"
      )}>
        <div className="text-center space-y-2">
          <p className="text-white/60 text-xs uppercase tracking-wider">Your Sum</p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-white text-4xl font-black">{currentSum}</p>
            {selectedNumbers.length > 0 && (
              <div className={cn(
                "text-sm font-bold px-3 py-1",
                difference === 0 ? "text-green-400" :
                difference > 0 ? "text-red-400" :
                "text-yellow-400"
              )}>
                {difference === 0 ? "✓ EXACT!" :
                 difference > 0 ? `+${difference}` :
                 `${difference}`}
              </div>
            )}
          </div>
          {selectedNumbers.length > 0 && (
            <div className="flex gap-1 justify-center flex-wrap">
              {selectedNumbers.map((num, i) => (
                <span key={i} className="text-white/60 text-sm">
                  {num}{i < selectedNumbers.length - 1 && ' +'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-4 gap-3">
        {availableNumbers.map((num, index) => {
          const isSelected = selectedNumbers.includes(num);
          
          return (
            <button
              key={index}
              onClick={() => handleNumberClick(num)}
              disabled={hasSubmitted}
              className={cn(
                "aspect-square border-4 transition-all duration-300",
                "flex items-center justify-center text-2xl font-black",
                "relative overflow-hidden preserve-3d",
                isSelected
                  ? "bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 border-cyan-400/50 scale-95 shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                  : "bg-gradient-to-br from-white/10 to-white/5 border-white/30 hover:border-white/50 hover:scale-105",
                hasSubmitted && "cursor-not-allowed opacity-50"
              )}
              data-testid={`number-${num}`}
            >
              {/* Shine effect */}
              {!hasSubmitted && !isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              
              <span className={cn(
                "relative z-10",
                isSelected ? "text-white" : "text-white/80"
              )}>
                {num}
              </span>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedNumbers.length === 0 || hasSubmitted}
        className={cn(
          "w-full py-8 text-xl font-black tracking-wider transition-all duration-300",
          selectedNumbers.length === 0 || hasSubmitted
            ? "bg-white/30 text-white/50 cursor-not-allowed border-2 border-white/20" 
            : "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white border-4 border-white/50 shadow-[0_10px_40px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_60px_rgba(6,182,212,0.6)] hover:scale-105"
        )}
        data-testid="button-submit-numbers"
      >
        {hasSubmitted ? (
          'SUBMITTED!'
        ) : selectedNumbers.length === 0 ? (
          'SELECT NUMBERS'
        ) : (
          <>
            <Sparkles className="inline h-6 w-6 mr-2" />
            CHECK MY ANSWER!
            <Sparkles className="inline h-6 w-6 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
