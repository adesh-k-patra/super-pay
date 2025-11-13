import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface GlassIconBadgeProps {
  icon: LucideIcon;
  color?: string;
  shadow?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GlassIconBadge({ 
  icon: Icon, 
  color = "bg-blue-400", 
  shadow = "shadow-[0_8px_32px_rgba(59,130,246,0.3)]",
  size = "md",
  className 
}: GlassIconBadgeProps) {
  const sizes = {
    sm: "p-2 rounded-xl",
    md: "p-3 rounded-2xl",
    lg: "p-4 rounded-2xl"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7"
  };

  return (
    <div className={cn(color, shadow, sizes[size], "group-hover:scale-110 transition-transform duration-300", className)}>
      <Icon className={cn(iconSizes[size], "text-white drop-shadow-lg")} strokeWidth={1.5} />
    </div>
  );
}
