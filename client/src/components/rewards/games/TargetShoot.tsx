import { useState, useEffect } from 'react';
import { Target, Crosshair, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TargetShootProps {
  onComplete: (success: boolean) => void;
}

export function TargetShoot({ onComplete }: TargetShootProps) {
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; hit: boolean }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (!gameStarted) {
      // Start game after a short delay
      setTimeout(() => {
        setGameStarted(true);
        spawnTarget();
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameEnded(true);
          clearInterval(timer);
          setTimeout(() => {
            const success = score >= 3; // Need to hit at least 3 targets
            onComplete(success);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, score]);

  const spawnTarget = () => {
    const newTarget = {
      id: Date.now(),
      x: Math.random() * 70 + 10, // 10% to 80% from left
      y: Math.random() * 60 + 10, // 10% to 70% from top
      hit: false,
    };

    setTargets((prev) => [...prev, newTarget]);

    // Remove target after 1.2 seconds if not hit
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
    }, 1200);

    // Spawn next target
    if (!gameEnded) {
      setTimeout(() => {
        if (!gameEnded) spawnTarget();
      }, 600);
    }
  };

  const handleTargetHit = (targetId: number) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, hit: true } : t))
    );
    setScore((prev) => prev + 1);

    // Remove hit target after animation
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== targetId));
    }, 300);
  };

  return (
    <div className="space-y-6 perspective-container">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Target className="h-8 w-8 text-red-400 animate-pulse3d" />
          Target Shooter
          <Target className="h-8 w-8 text-red-400 animate-pulse3d" />
        </h3>
        <p className="text-white/60 text-sm tracking-wider uppercase">Hit as many targets as you can!</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="px-6 py-2 bg-white/10 border border-white/20">
            <p className="text-white/60 text-xs uppercase tracking-wider">Score</p>
            <p className="text-white text-3xl font-black">{score}</p>
          </div>
          <div className={cn(
            "px-6 py-2 border",
            timeLeft <= 2 ? "bg-red-500/20 border-red-500/50" : "bg-white/10 border-white/20"
          )}>
            <p className="text-white/60 text-xs uppercase tracking-wider">Time</p>
            <p className={cn(
              "text-3xl font-black",
              timeLeft <= 2 ? "text-red-400 animate-pulse" : "text-white"
            )}>
              {timeLeft}s
            </p>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="relative h-96 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-4 border-white/20 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Crosshair cursor */}
        <div className="absolute inset-0 cursor-crosshair" />

        {/* Targets */}
        {targets.map((target) => (
          <div
            key={target.id}
            className={cn(
              "absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer",
              target.hit ? "animate-cardReveal" : "animate-targetPulse"
            )}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
            }}
            onClick={() => !target.hit && handleTargetHit(target.id)}
            data-testid={`target-${target.id}`}
          >
            {target.hit ? (
              <div className="w-full h-full flex items-center justify-center">
                <Zap className="h-12 w-12 text-yellow-400 animate-bounce3d drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
              </div>
            ) : (
              <div className="w-full h-full relative">
                {/* Target circles */}
                <div className="absolute inset-0 rounded-full bg-red-600 border-4 border-white/80 shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
                <div className="absolute inset-[20%] rounded-full bg-white border-2 border-red-600" />
                <div className="absolute inset-[40%] rounded-full bg-red-600" />
                
                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Crosshair className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Game over overlay */}
        {gameEnded && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-popIn3d">
            <div className="text-center space-y-4">
              <div className={cn(
                "w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4",
                score >= 5
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300/50"
                  : score >= 3
                  ? "bg-gradient-to-br from-green-500 to-green-700 border-green-400/50"
                  : "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400/50"
              )}>
                <Target className="h-12 w-12 text-white" />
              </div>
              <div>
                <p className="text-white text-2xl font-black mb-2">Time's Up!</p>
                <p className="text-white/80 text-lg">
                  {score >= 5 ? '🎯 Sharpshooter!' : score >= 3 ? '✨ Nice Shooting!' : '👍 Good Try!'}
                </p>
                <p className="text-white/60 text-sm mt-2">Final Score: {score}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
