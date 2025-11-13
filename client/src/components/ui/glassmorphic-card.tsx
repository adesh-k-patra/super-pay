import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassmorphicCardProps {
  children: ReactNode;
  variant?: "default" | "red" | "green" | "blue" | "yellow" | "purple" | "teal";
  gradient?: boolean;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassmorphicCard({ 
  children, 
  variant = "default", 
  gradient = false,
  className, 
  hover = false,
  onClick 
}: GlassmorphicCardProps) {
  const getVariantClass = () => {
    if (gradient) {
      switch (variant) {
        case "red": return "card-gradient-red";
        case "green": return "card-gradient-green";
        case "blue": return "card-gradient-blue";
        case "yellow": return "card-gradient-yellow";
        case "purple": return "card-gradient-purple";
        case "teal": return "card-gradient-teal";
        default: return "glassmorphic";
      }
    } else {
      switch (variant) {
        case "red": return "glassmorphic-red";
        case "green": return "glassmorphic-green";
        case "blue": return "glassmorphic-blue";
        case "yellow": return "glassmorphic-yellow";
        case "purple": return "glassmorphic-purple";
        case "teal": return "glassmorphic-teal";
        default: return "glassmorphic";
      }
    }
  };

  return (
    <div
      className={cn(
        "rounded-none p-4 transition-all duration-300",
        getVariantClass(),
        hover && onClick && "card-3d cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]",
        hover && !onClick && "card-3d hover:shadow-xl hover:-translate-y-1",
        !hover && onClick && "cursor-pointer transform hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
      data-testid={`glassmorphic-card-${variant}`}
    >
      {children}
    </div>
  );
}
