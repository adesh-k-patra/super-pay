import { ReactNode, useEffect, useRef, useState } from "react";
import { BottomNavigation } from "@/components/ui/bottom-navigation";

interface PageShellProps {
  children: ReactNode;
  topSlot?: ReactNode;
  tabsSlot?: ReactNode;
  className?: string;
}

export function PageShell({ children, topSlot, tabsSlot, className = "" }: PageShellProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const [topHeight, setTopHeight] = useState(0);

  useEffect(() => {
    if (topRef.current) {
      const updateHeight = () => {
        const height = topRef.current?.offsetHeight || 0;
        setTopHeight(height);
        document.documentElement.style.setProperty('--top-stats-h', `${height}px`);
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [topSlot]);

  useEffect(() => {
    // Set CSS variables for consistent spacing
    document.documentElement.style.setProperty('--bottom-nav-h', '64px');
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      {/* Sticky Top Section */}
      {topSlot && (
        <header 
          ref={topRef}
          className="sticky top-0 z-40"
        >
          {topSlot}
        </header>
      )}

      {/* Sticky Tabs Section (if provided) */}
      {tabsSlot && (
        <nav 
          className="sticky z-30"
          style={{ top: `${topHeight}px` }}
          aria-label="Page navigation"
        >
          {tabsSlot}
        </nav>
      )}

      {/* Scrollable Content Area */}
      <main id="main" className="flex-1 pb-20" role="main">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}