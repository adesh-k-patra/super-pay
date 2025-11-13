import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  withHeaderSpacing?: boolean;
  customSpacing?: string;
}

/**
 * PageShell component provides consistent spacing and layout structure across all pages.
 * 
 * @param withHeaderSpacing - Adds consistent spacing below header/banner sections (default: true)
 * @param customSpacing - Override the default header spacing with custom spacing
 * @param className - Additional classes to apply to the wrapper
 */
export function PageShell({ 
  children, 
  className, 
  withHeaderSpacing = true, 
  customSpacing 
}: PageShellProps) {
  const headerSpacing = customSpacing || "pt-8 lg:pt-12"; // Consistent spacing below headers
  
  return (
    <div 
      className={cn(
        "w-full",
        withHeaderSpacing && headerSpacing,
        className
      )}
      data-testid="page-shell"
    >
      {children}
    </div>
  );
}

/**
 * HeaderSpacer component provides just the spacing without wrapper
 * Use this when you only need to add space below a header
 */
export function HeaderSpacer({ 
  className, 
  spacing = "h-8 lg:h-12" 
}: { 
  className?: string; 
  spacing?: string; 
}) {
  return (
    <div 
      className={cn(spacing, className)} 
      data-testid="header-spacer"
    />
  );
}