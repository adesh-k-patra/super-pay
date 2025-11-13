import { ReactNode, HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Utility function for consistent currency formatting
export function formatINR(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
import { 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  IndianRupee,
  Plus,
  Eye,
  Edit,
  ChevronRight,
  Shield,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  Activity,
  Target,
  Award,
  Gift,
  Users,
  Settings
} from "lucide-react";

// Page Layout Components
interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function PageContainer({ children, maxWidth = "2xl", className, ...props }: PageContainerProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  }[maxWidth];

  return (
    <div 
      className={cn("min-h-screen bg-white dark:bg-gray-900", className)}
      {...props}
    >
      <div className={cn("mx-auto px-4 py-6", maxWidthClass)}>
        {children}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2" data-testid="page-title">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300 text-lg" data-testid="page-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// Financial Data Components
interface FinancialSummaryCardProps {
  title: string;
  amount: string | number;
  trend?: {
    direction: "up" | "down";
    percentage: number;
    period: string;
  };
  icon: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  onClick?: () => void;
}

export function FinancialSummaryCard({ 
  title, 
  amount, 
  trend, 
  icon, 
  color = "blue",
  onClick 
}: FinancialSummaryCardProps) {
  const colorConfig = {
    blue: {
      iconBg: "bg-blue-500 dark:bg-blue-600",
      iconText: "text-white",
      cardHover: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
    },
    green: {
      iconBg: "bg-green-500 dark:bg-green-600", 
      iconText: "text-white",
      cardHover: "hover:bg-green-50 dark:hover:bg-green-900/20"
    },
    purple: {
      iconBg: "bg-purple-500 dark:bg-purple-600",
      iconText: "text-white", 
      cardHover: "hover:bg-purple-50 dark:hover:bg-purple-900/20"
    },
    orange: {
      iconBg: "bg-orange-500 dark:bg-orange-600",
      iconText: "text-white",
      cardHover: "hover:bg-orange-50 dark:hover:bg-orange-900/20"
    },
    red: {
      iconBg: "bg-red-500 dark:bg-red-600",
      iconText: "text-white",
      cardHover: "hover:bg-red-50 dark:hover:bg-red-900/20"
    }
  }[color];

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1",
        onClick && colorConfig.cardHover
      )}
      onClick={onClick}
      data-testid={`financial-summary-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {typeof amount === "string" && amount.includes("₹") ? amount : formatINR(amount)}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  trend.direction === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {trend.percentage}% {trend.period}
                </span>
              </div>
            )}
          </div>
          <div 
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              colorConfig.iconBg
            )}
          >
            <div className={colorConfig.iconText}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Status and Progress Components
interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, variant = "default", size = "md" }: StatusBadgeProps) {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600",
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-600",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-600", 
    danger: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-600",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-600"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <Badge 
      className={cn(
        "font-medium border rounded-lg",
        variants[variant],
        sizes[size]
      )}
      data-testid={`status-badge-${status.toLowerCase()}`}
    >
      {status}
    </Badge>
  );
}

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  description?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

export function ProgressCard({ title, current, total, description, color = "blue" }: ProgressCardProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  const colorConfig = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400", 
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400"
  }[color];

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <span className={cn("text-sm font-medium", colorConfig)}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>{formatINR(current)}</span>
            <span>{formatINR(total)}</span>
          </div>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Action Components
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  disabled?: boolean;
}

export function QuickActionCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  color = "blue",
  disabled = false 
}: QuickActionCardProps) {
  const colorConfig = {
    blue: "hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300",
    green: "hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-600 text-green-700 dark:text-green-300",
    purple: "hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300",
    orange: "hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-600 text-orange-700 dark:text-orange-300",
    red: "hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-600 text-red-700 dark:text-red-300"
  }[color];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-2 bg-white dark:bg-gray-800",
        "hover:shadow-md hover:-translate-y-1",
        !disabled && colorConfig,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={!disabled ? onClick : undefined}
      data-testid={`quick-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        <ChevronRight className="h-4 w-4 mx-auto mt-3 text-gray-400 dark:text-gray-500" />
      </CardContent>
    </Card>
  );
}

// Data Display Components
interface DataListItemProps {
  label: string;
  value: string | ReactNode;
  subValue?: string;
  action?: ReactNode;
  onClick?: () => void;
}

export function DataListItem({ label, value, subValue, action, onClick }: DataListItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-4 px-6 border-b border-gray-100 dark:border-gray-700",
        onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
      onClick={onClick}
      data-testid={`data-list-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {subValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          {typeof value === "string" ? (
            <p className="font-semibold text-gray-900 dark:text-gray-100">{value}</p>
          ) : value}
        </div>
        {action && action}
        {onClick && <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12" data-testid="empty-state">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="gap-2" data-testid="button-empty-action">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Section Components
interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          )}
        </div>
        {action && action}
      </div>
      {children}
    </div>
  );
}