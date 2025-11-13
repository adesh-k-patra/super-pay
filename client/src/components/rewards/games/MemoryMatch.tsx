import { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryMatchProps {
  onComplete: (success: boolean) => void;
}

const SYMBOLS = ['💎', '👑', '⭐', '🎁', '🎯', '🔥', '💰', '🏆'];

export function MemoryMatch({ onComplete }: MemoryMatchProps) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Create pairs of symbols
    const symbols = SYMBOLS.slice(0, 4);
    const pairs = [...symbols, ...symbols];
    // Shuffle
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    
    // Show all cards for 2 seconds
    setFlipped(shuffled.map((_, i) => i));
    setTimeout(() => {
      setFlipped([]);
    }, 2000);
  }, []);

  const handleCardClick = (index: number) => {
    if (isChecking || flipped.includes(index) || matched.includes(index) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Match found
        setMatched([...matched, first, second]);
        setFlipped([]);
        setIsChecking(false);

        // Check if game is complete
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            const success = moves < 8; // Success if completed in less than 8 moves
            onComplete(success);
          }, 800);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-pink-400 animate-pulse3d" />
          Memory Match Challenge
          <Brain className="h-8 w-8 text-pink-400 animate-pulse3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Find all matching pairs!</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="px-4 py-2 bg-white/10 border border-white/20">
            <p className="text-white/60 text-xs uppercase tracking-wider">Moves</p>
            <p className="text-white text-2xl font-bold">{moves}</p>
          </div>
          <div className="px-4 py-2 bg-white/10 border border-white/20">
            <p className="text-white/60 text-xs uppercase tracking-wider">Found</p>
            <p className="text-white text-2xl font-bold">{matched.length / 2}/{cards.length / 2}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 px-4 py-6">
        {cards.map((symbol, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);

          return (
            <div
              key={index}
              className={cn(
                "aspect-square cursor-pointer preserve-3d transition-all duration-300",
                !isFlipped && "hover:scale-105"
              )}
              onClick={() => handleCardClick(index)}
              data-testid={`memory-card-${index}`}
            >
              <div
                className={cn(
                  "relative w-full h-full preserve-3d transition-transform duration-500",
                  isFlipped && "animate-cardFlip"
                )}
              >
                {/* Card front (symbol) */}
                <div
                  className={cn(
                    "absolute inset-0 backface-hidden border-4 flex items-center justify-center",
                    "bg-gradient-to-br overflow-hidden",
                    isMatched
                      ? "from-green-500 via-green-600 to-green-700 border-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                      : "from-purple-500 via-purple-600 to-purple-700 border-purple-400/50",
                    isMatched && "animate-pulse3d"
                  )}
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    opacity: isFlipped ? 1 : 0
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                  <span className="text-5xl relative z-10" style={{ transform: 'scaleX(-1)' }}>
                    {symbol}
                  </span>
                </div>

                {/* Card back */}
                <div
                  className={cn(
                    "absolute inset-0 backface-hidden border-4 border-white/40",
                    "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
                    "flex items-center justify-center overflow-hidden",
                    "shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                  )}
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    opacity: !isFlipped ? 1 : 0
                  }}
                >
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                      backgroundSize: '15px 15px'
                    }} />
                  </div>

                  {/* Question mark */}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-4xl text-white/80 font-black">?</span>
                  </div>

                  {/* Shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {matched.length === cards.length && (
        <div className="text-center animate-popIn3d">
          <p className="text-white text-xl font-bold">
            {moves < 6 ? '🎉 Perfect Match!' : moves < 8 ? '✨ Great Job!' : '👍 Complete!'}
          </p>
        </div>
      )}
    </div>
  );
}
