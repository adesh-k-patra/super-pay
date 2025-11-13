import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BottomBookingBarProps {
  totalAmount: number;
  itemCount: number;
  itemLabel?: string;
  buttonText?: string;
  onContinue: () => void;
  disabled?: boolean;
  showItemCount?: boolean;
  className?: string;
}

export function BottomBookingBar({
  totalAmount,
  itemCount,
  itemLabel = "items",
  buttonText = "Continue",
  onContinue,
  disabled = false,
  showItemCount = true,
  className,
}: BottomBookingBarProps) {
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 safe-area-bottom", className)}>
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex flex-col">
          {showItemCount && (
            <p className="text-sm text-white/60">
              {itemCount} {itemLabel}
            </p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ₹{totalAmount.toFixed(2)}
            </span>
            <span className="text-sm text-white/60">Total</span>
          </div>
        </div>
        
        <Button
          onClick={onContinue}
          disabled={disabled || itemCount === 0}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-continue-booking"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
