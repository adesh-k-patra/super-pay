import { useState } from 'react';
import { Sparkles, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScratchCardProps {
  onComplete: (success: boolean) => void;
}

export function ScratchCard({ onComplete }: ScratchCardProps) {
  const [scratchProgress, setScratchProgress] = useState(0);
  const [scratched, setScratched] = useState(false);

  const handleScratch = () => {
    if (scratched) return;
    
    const newProgress = Math.min(scratchProgress + 15, 100);
    setScratchProgress(newProgress);
    
    if (newProgress >= 100 && !scratched) {
      setScratched(true);
      setTimeout(() => onComplete(true), 500);
    }
  };

  return (
    <div className="space-y-6 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse3d" />
          Scratch to Reveal
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Tap repeatedly to uncover your prize!</p>
      </div>

      <div 
        className={cn(
          "relative h-80 cursor-pointer overflow-hidden",
          "transform transition-all duration-500",
          scratchProgress > 0 && "scale-105"
        )}
        onClick={handleScratch}
        data-testid="scratch-card"
      >
        {/* Hidden reward layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-8 flex items-center justify-center border-4 border-white/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),transparent_70%)]" />
          <div className="text-center space-y-6 relative z-10">
            <div className={cn(
              "w-28 h-28 mx-auto bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center",
              "border-4 border-white/40 backdrop-blur-sm",
              "shadow-[0_0_50px_rgba(255,255,255,0.5)]",
              scratchProgress > 50 && "animate-bounce3d"
            )}>
              <Gift className="h-16 w-16 text-white drop-shadow-2xl animate-float3d" />
            </div>
            <div className="space-y-2">
              <p className="text-white text-3xl font-black drop-shadow-lg tracking-wider">YOUR PRIZE!</p>
              <p className="text-white/90 text-sm font-light">Almost there...</p>
            </div>
          </div>
        </div>
        
        {/* Scratch overlay */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
            "border-4 border-white/30"
          )}
          style={{ opacity: 1 - scratchProgress / 100 }}
        >
          <div className="h-full flex items-center justify-center relative overflow-hidden">
            {/* Metallic shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4),transparent_50%)]" />
            
            <div className="text-center space-y-4 relative z-10">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-yellow-400 mx-auto animate-pulse3d drop-shadow-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-yellow-400/20 rounded-full animate-ping" />
                </div>
              </div>
              <p className="text-white text-2xl font-black tracking-widest drop-shadow-lg">SCRATCH HERE</p>
              <p className="text-white/90 text-sm font-light tracking-wide uppercase">Tap to reveal your fortune</p>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <div className="bg-black/50 backdrop-blur-md h-3 overflow-hidden border-2 border-white/30">
            <div 
              className={cn(
                "h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 transition-all duration-300",
                "shadow-[0_0_20px_rgba(234,179,8,0.8)]",
                "relative overflow-hidden"
              )}
              style={{ width: `${scratchProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-white text-xs font-bold text-center mt-2 tracking-wider">
            {scratchProgress}% REVEALED
          </p>
        </div>
      </div>
    </div>
  );
}
