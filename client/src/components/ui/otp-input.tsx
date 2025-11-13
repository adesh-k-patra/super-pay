import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  className?: string;
}

export function OtpInput({ value, onChange, length = 4, className }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newValue = [...value];
    newValue[index] = digit.slice(-1);
    onChange(newValue);

    // Auto-focus next input with animation
    if (digit && index < length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 50);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const digits = pastedData.slice(0, length).split("");
    
    const newValue = Array(length).fill("");
    digits.forEach((digit, index) => {
      newValue[index] = digit;
    });
    
    onChange(newValue);
    
    const nextIndex = Math.min(digits.length, length - 1);
    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
    }, 100);
  };

  return (
    <div className={cn("flex justify-center gap-4", className)} data-testid="otp-input-container">
      {Array.from({ length }, (_, index) => {
        const hasValue = value[index];
        const isFocused = focusedIndex === index;
        const isComplete = hasValue;
        
        return (
          <div key={index} className="relative">
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              className={cn(
                "w-14 h-14 text-center text-xl font-bold rounded-none transition-all duration-300",
                "backdrop-blur-sm shadow-lg relative",
                "focus:outline-none focus:ring-0",
                !hasValue && !isFocused && "border-white/30 bg-white/10 text-white",
                !hasValue && isFocused && "border-purple-400 bg-white/20 shadow-xl transform scale-105 text-white",
                hasValue && "border-purple-400 bg-purple-500/20 text-white shadow-xl",
                "hover:border-purple-300 hover:bg-white/15 hover:shadow-xl"
              )}
              style={{
                background: hasValue ? `rgba(168, 85, 247, 0.2)` : isFocused ? `rgba(255, 255, 255, 0.2)` : `rgba(255, 255, 255, 0.1)`,
                borderColor: hasValue ? `rgb(168, 85, 247)` : isFocused ? `rgb(168, 85, 247)` : `rgba(255, 255, 255, 0.3)`,
                boxShadow: isFocused 
                  ? `0 0 0 4px rgba(168, 85, 247, 0.25), 0 8px 25px -5px rgba(0, 0, 0, 0.3)` 
                  : hasValue 
                    ? `0 0 0 3px rgba(168, 85, 247, 0.15), 0 4px 12px -2px rgba(168, 85, 247, 0.2)`
                    : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              data-testid={`otp-input-${index}`}
            />
            {/* Success indicator */}
            {isComplete && (
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center animate-bounce-subtle"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--green-500)), hsl(var(--green-600)))`,
                  border: `2px solid hsl(var(--white))`
                }}
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {/* Focus indicator */}
            {isFocused && (
              <div 
                className="absolute inset-0 rounded-none animate-pulse pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--red-500) / 0.1), hsl(var(--red-600) / 0.05))`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
