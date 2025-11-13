import { cn } from "@/lib/utils";

interface GlassHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassHeader({ children, className }: GlassHeaderProps) {
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10",
      className
    )}>
      {children}
    </div>
  );
}
