import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showBackButton = true, 
  backPath,
  className = "",
  children 
}: PageHeaderProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/home");
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border backdrop-blur-sm ${className}`}>
      <div className="px-4 py-6">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="p-2 rounded-none hover:bg-muted"
              data-testid="button-back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-page-subtitle">
                {subtitle}
              </p>
            )}
          </div>
          
          {children && (
            <div className="flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}