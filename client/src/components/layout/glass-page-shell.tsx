import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNavigation } from "@/components/ui/bottom-navigation";

interface GlassPageShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  headerActions?: ReactNode;
  showBottomNav?: boolean;
  className?: string;
  headerClassName?: string;
}

export function GlassPageShell({
  children,
  title,
  subtitle,
  showBackButton = true,
  showNotifications = true,
  headerActions,
  showBottomNav = true,
  className,
  headerClassName
}: GlassPageShellProps) {
  const [, navigate] = useLocation();

  return (
    <div className={cn("min-h-screen bg-black text-white", showBottomNav ? "pb-32" : "pb-8")}>
      {/* Fixed Header */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10",
        headerClassName
      )}>
        <div className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3 flex-1">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    navigate("/home");
                  }
                }}
                className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
                data-testid="button-back"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {title && (
              <div className="flex-1">
                <h1 className="text-lg font-bold tracking-wider">{title}</h1>
                {subtitle && (
                  <p className="text-[10px] text-white/50 font-light tracking-widest uppercase">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {showNotifications && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/notifications")}
                className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("pt-20 px-4 w-full max-w-screen-lg mx-auto", className)}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
