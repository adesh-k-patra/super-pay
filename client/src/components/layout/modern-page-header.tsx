import { ArrowLeft, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModernPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightActions?: React.ReactNode;
  className?: string;
}

export function ModernPageHeader({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  rightActions,
  className
}: ModernPageHeaderProps) {
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-11 w-11 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            {/* Brand Logo */}
            <div className="w-9 h-9 border border-white/30 flex items-center justify-center">
              <Hexagon className="h-5 w-5 text-white/60" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
              {subtitle && (
                <p className="text-xs text-white/60 font-medium tracking-wider uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {rightActions && (
          <div className="flex items-center gap-2">
            {rightActions}
          </div>
        )}
      </div>
    </div>
  );
}