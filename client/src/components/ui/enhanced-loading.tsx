import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { Progress } from "./progress";
import { Card } from "./card";

// Enhanced Card Skeleton for loan cards, dashboard cards, etc.
export function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className={cn("p-6 space-y-4", className)} {...props}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-16" />
      </div>
    </Card>
  );
}

// Loan Detail Skeleton
export function LoanDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="glassmorphic-red-header p-6 space-y-4">
        <Skeleton className="h-8 w-2/3 bg-white/20" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/20" />
            <Skeleton className="h-6 w-3/4 bg-white/20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/20" />
            <Skeleton className="h-6 w-3/4 bg-white/20" />
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="grid gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// List Item Skeleton (for loans, transactions, etc.)
export function ListItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Enhanced Loading Spinner with text
interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-testid"?: string;
}

export function LoadingSpinner({ text = "Loading...", size = "md", className, "data-testid": testId }: LoadingSpinnerProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 }, 
    lg: { width: 64, height: 64 }
  };

  const { width, height } = sizes[size];

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)} data-testid={testId}>
      <div className="relative" style={{ width, height }}>
        {/* Outer rotating hexagon */}
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '3s' }}
          width={width}
          height={height}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            fill="none"
            stroke="url(#hexGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Inner counter-rotating hexagon */}
        <svg
          className="absolute inset-0"
          style={{ 
            animation: 'spin 2s linear infinite reverse',
          }}
          width={width}
          height={height}
          viewBox="0 0 100 100"
        >
          <polygon
            points="50,20 75,35 75,65 50,80 25,65 25,35"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>

        {/* Center pulsing dot */}
        <svg
          className="absolute inset-0"
          width={width}
          height={height}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="hsl(var(--primary))"
            className="animate-pulse"
          />
        </svg>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Enhanced Progress Loading with steps
interface ProgressLoadingProps {
  progress: number;
  step?: string;
  totalSteps?: number;
  currentStep?: number;
  className?: string;
}

export function ProgressLoading({ 
  progress, 
  step, 
  totalSteps, 
  currentStep, 
  className 
}: ProgressLoadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {step || "Processing..."}
          </span>
          {totalSteps && currentStep && (
            <span className="text-muted-foreground">
              {currentStep}/{totalSteps}
            </span>
          )}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-right text-xs text-muted-foreground">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

// Pulsing Dots Loader
export function PulsingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 bg-primary rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}

// Loading Overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, text, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <LoadingSpinner text={text} size="lg" />
        </div>
      )}
    </div>
  );
}

// Button Loading State
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({ 
  isLoading, 
  loadingText, 
  children, 
  disabled, 
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200",
        className
      )}
    >
      {isLoading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
}