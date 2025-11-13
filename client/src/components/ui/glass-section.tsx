import { cn } from "@/lib/utils";

interface GlassSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "gradient";
}

export function GlassSection({ children, className, variant = "default" }: GlassSectionProps) {
  const variants = {
    default: "border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl",
    dark: "border border-white/20 bg-black/40 backdrop-blur-sm",
    gradient: "border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl"
  };

  return (
    <div className={cn(variants[variant], "p-6", className)}>
      {children}
    </div>
  );
}
