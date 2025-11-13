import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinWheelProps {
  onComplete: (success: boolean) => void;
}

const SEGMENTS = [
  { color: 'from-red-500 to-red-600', label: 'MEGA', value: 'jackpot' },
  { color: 'from-blue-500 to-blue-600', label: 'GREAT', value: 'high' },
  { color: 'from-yellow-500 to-yellow-600', label: 'GOOD', value: 'medium' },
  { color: 'from-green-500 to-green-600', label: 'NICE', value: 'low' },
  { color: 'from-purple-500 to-purple-600', label: 'WIN', value: 'low' },
  { color: 'from-pink-500 to-pink-600', label: 'BONUS', value: 'medium' },
  { color: 'from-orange-500 to-orange-600', label: 'PRIZE', value: 'high' },
  { color: 'from-indigo-500 to-indigo-600', label: 'REWARD', value: 'low' },
];

export function SpinWheel({ onComplete }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setHasSpun(true);
    
    const winProbability = Math.random();
    const targetSegment = winProbability > 0.85 ? 0 : // Jackpot
                         winProbability > 0.60 ? Math.random() > 0.5 ? 1 : 6 : // High
                         winProbability > 0.30 ? Math.random() > 0.5 ? 2 : 5 : // Medium
                         Math.random() > 0.5 ? 3 : Math.random() > 0.5 ? 4 : 7; // Low
    
    const spins = 8 + Math.floor(Math.random() * 4);
    const segmentAngle = 360 / SEGMENTS.length;
    const finalRotation = spins * 360 + (targetSegment * segmentAngle) + (segmentAngle / 2);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSpinning(false);
      const success = SEGMENTS[targetSegment].value !== 'none';
      setTimeout(() => onComplete(success), 1000);
    }, 4000);
  };

  return (
    <div className="space-y-8 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-yellow-400 animate-glow" />
          Spin the Fortune Wheel
          <Zap className="h-8 w-8 text-yellow-400 animate-glow" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">One spin to win big!</p>
      </div>

      <div className="relative py-12">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500/20 via-red-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse3d" />
        
        {/* Wheel container */}
        <div className="relative w-80 h-80 mx-auto">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
            <div className="relative">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[28px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            </div>
          </div>
          
          {/* Wheel */}
          <div 
            className={cn(
              "w-full h-full rounded-full border-8 border-white/40 relative overflow-hidden",
              "shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(255,255,255,0.2)]",
              "preserve-3d"
            )}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {SEGMENTS.map((segment, i) => {
              const angle = (360 / SEGMENTS.length) * i;
              return (
                <div
                  key={i}
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    segment.color
                  )}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(50% 50%, 100% 0, 100% 12.5%)',
                    transformOrigin: 'center'
                  }}
                >
                  <div 
                    className="absolute top-8 right-4 text-white text-xs font-black tracking-wider transform -rotate-90 drop-shadow-lg"
                    style={{ transform: `rotate(${-angle + 22.5}deg)`, transformOrigin: 'center' }}
                  >
                    {segment.label}
                  </div>
                </div>
              );
            })}
            
            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-200 border-8 border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
              <Sparkles className={cn(
                "h-10 w-10 text-yellow-600",
                spinning && "animate-spin3d"
              )} />
            </div>
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
            : "bg-white text-black hover:bg-white/90 border-4 border-white/50 shadow-[0_10px_40px_rgba(255,255,255,0.4)] hover:shadow-[0_15px_60px_rgba(255,255,255,0.6)] hover:scale-105"
        )}
        data-testid="button-spin"
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
            SPIN NOW!
            <Sparkles className="inline h-6 w-6 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
