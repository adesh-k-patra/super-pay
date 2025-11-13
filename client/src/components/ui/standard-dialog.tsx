import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface StandardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl"
};

export function StandardDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children,
  maxWidth = "md"
}: StandardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-gradient-to-br from-black via-black/95 to-black/90 border border-white/20 text-white rounded-none ${maxWidthClasses[maxWidth]} max-h-[85vh] overflow-y-auto backdrop-blur-xl`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
            <DialogTitle className="text-white text-xl font-semibold tracking-wide">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-white/60 font-light leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-6">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ClickableDialogCardProps {
  onClick?: () => void;
  children: ReactNode;
  testId?: string;
  className?: string;
}

export function ClickableDialogCard({ onClick, children, testId, className = "" }: ClickableDialogCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:border-white/40 hover:bg-white/10 transition-all ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
