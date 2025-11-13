import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PickCardProps {
  onComplete: (success: boolean) => void;
}

const CARD_BACK = '🎴';
const REWARDS = ['💎', '👑', '⭐', '🎁', '🎯'];

export function PickCard({ onComplete }: PickCardProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [cardValues, setCardValues] = useState<number[]>([]);

  const handleCardPick = (index: number) => {
    if (selectedCard !== null) return;
    
    // Generate card values with at least one good reward
    const values = Array(5).fill(0).map(() => Math.floor(Math.random() * REWARDS.length));
    // Ensure at least one high value card
    values[Math.floor(Math.random() * 5)] = Math.random() > 0.5 ? 0 : 1;
    setCardValues(values);
    
    setSelectedCard(index);
    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);
    
    setTimeout(() => {
      // Reveal all other cards
      setRevealedCards([true, true, true, true, true]);
    }, 800);
    
    setTimeout(() => {
      const success = values[index] <= 2; // Top 3 symbols are wins
      onComplete(success);
    }, 2000);
  };

  return (
    <div className="space-y-8 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Gift className="h-8 w-8 text-purple-400 animate-pulse3d" />
          Pick Your Mystery Card
          <Gift className="h-8 w-8 text-purple-400 animate-pulse3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Choose wisely - one card holds your fortune!</p>
      </div>

      <div className="grid grid-cols-5 gap-3 px-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              "aspect-[2/3] cursor-pointer preserve-3d transition-all duration-500",
              selectedCard === null && "hover:scale-110 hover:-translate-y-2",
              selectedCard === index && "scale-110 -translate-y-4"
            )}
            onClick={() => handleCardPick(index)}
            data-testid={`card-${index}`}
          >
            <div
              className={cn(
                "relative w-full h-full preserve-3d transition-transform duration-700",
                revealedCards[index] && "animate-cardFlip"
              )}
            >
              {/* Card front (revealed) */}
              <div
                className={cn(
                  "absolute inset-0 backface-hidden border-4 flex items-center justify-center",
                  "bg-gradient-to-br overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]",
                  selectedCard === index 
                    ? cardValues[index] <= 2
                      ? "from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300/50 shadow-[0_0_40px_rgba(234,179,8,0.8)]"
                      : "from-blue-500 via-blue-600 to-blue-700 border-blue-400/50"
                    : cardValues.length > 0
                    ? cardValues[index] <= 2
                      ? "from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300/50"
                      : "from-gray-500 via-gray-600 to-gray-700 border-gray-400/50"
                    : "from-purple-500 via-purple-600 to-purple-700 border-purple-400/50"
                )}
                style={{
                  transform: revealedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  opacity: revealedCards[index] ? 1 : 0
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                {cardValues.length > 0 && (
                  <span className={cn(
                    "text-5xl transform",
                    selectedCard === index && cardValues[index] <= 2 && "animate-bounce3d"
                  )} style={{ transform: 'scaleX(-1)' }}>
                    {REWARDS[cardValues[index]]}
                  </span>
                )}
              </div>
              
              {/* Card back */}
              <div
                className={cn(
                  "absolute inset-0 backface-hidden border-4 border-white/40",
                  "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800",
                  "flex items-center justify-center overflow-hidden",
                  "shadow-[0_0_30px_rgba(0,0,0,0.8)]",
                  selectedCard === null && "hover:border-purple-300/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                )}
                style={{
                  transform: revealedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  opacity: !revealedCards[index] ? 1 : 0
                }}
              >
                {/* Pattern background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                
                {/* Card number */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-4xl">{CARD_BACK}</span>
                  <div className="w-8 h-1 bg-white/40" />
                  <span className="text-lg font-black text-white/80">{index + 1}</span>
                </div>
                
                {/* Corner decorations */}
                <Sparkles className="absolute top-2 left-2 h-4 w-4 text-white/60" />
                <Sparkles className="absolute bottom-2 right-2 h-4 w-4 text-white/60" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCard !== null && (
        <div className="text-center">
          <p className="text-white/70 text-sm tracking-wider uppercase animate-pulse">
            Revealing all cards...
          </p>
        </div>
      )}
    </div>
  );
}
