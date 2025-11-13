import logoImage from "@assets/suss_1761330157607.png";

interface LoadingLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingLogo({ size = "md", className = "" }: LoadingLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-32 w-32"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Loading..." 
        className={`${sizeClasses[size]} animate-logo-float`}
      />
    </div>
  );
}
