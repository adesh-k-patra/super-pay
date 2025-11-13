/**
 * Professional Financial Page Templates
 * 
 * This module provides standardized, reusable page templates for financial applications.
 * All templates follow fintech UX heuristics and maintain consistent design patterns.
 * 
 * TEMPLATE USAGE GUIDE:
 * 
 * 1. FinancialDashboardTemplate - For overview pages with analytics
 *    Usage: KPI metrics → Analytics charts → Filters → Data tables/cards
 *    Example: UPI History, Investment Portfolio, Loan Dashboard
 * 
 * 2. TransactionListTemplate - For transaction histories
 *    Usage: Simple header → Filters → Transaction list with pagination
 *    Example: Bill Payment History, Transaction Logs
 * 
 * 3. DetailPageTemplate - For individual item details
 *    Usage: Header → Hero section → Detail sections → Actions sidebar
 *    Example: Loan Details, Investment Details, Reward Details
 * 
 * 4. SettingsTemplate - For user settings and configuration
 *    Usage: Header → Tabs → Settings sections/forms
 *    Example: Profile Settings, Account Preferences
 * 
 * DESIGN PRINCIPLES:
 * - Sharp corners and defined edges (no gradients, solid backgrounds)
 * - Consistent spacing using design token system
 * - Professional color scheme with semantic status colors
 * - Accessibility-first with proper test IDs and ARIA labels
 * - Responsive design with mobile-first approach
 */

import { ReactNode } from "react";
import { PageShell } from "./page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

// =============================================================================
// FINANCIAL DASHBOARD TEMPLATE
// Hero section + KPI cards + analytics + main content
// =============================================================================

interface FinancialDashboardTemplateProps {
  title: string;
  subtitle?: string;
  heroBackground?: string;
  heroBackgroundClass?: string;
  kpiCards?: ReactNode;
  analyticsSection?: ReactNode;
  filtersSection?: ReactNode;
  mainContent: ReactNode;
  headerActions?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export function FinancialDashboardTemplate({
  title,
  subtitle,
  heroBackground = "hsl(var(--red-600))",
  heroBackgroundClass = "bg-red-600",
  kpiCards,
  analyticsSection,
  filtersSection,
  mainContent,
  headerActions,
  className = "",
  showBackButton = true,
  backPath = "/"
}: FinancialDashboardTemplateProps) {
  const [, navigate] = useLocation();

  return (
    <PageShell className={className}>
      <div className="min-h-screen bg-muted">
        {/* Hero Status Band */}
        <div 
          className={cn(
            "px-4 pt-12 pb-6 relative overflow-hidden text-white",
            heroBackgroundClass
          )}
          style={{ backgroundColor: heroBackground }}
        >
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/20 rounded-full translate-x-36 translate-y-36 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {showBackButton && (
                  <Button
                    onClick={() => navigate(backPath)}
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 backdrop-blur-sm transition-all"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <h1 className="text-white font-semibold text-xl">{title}</h1>
                  {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
                </div>
              </div>
              {headerActions && (
                <div className="flex items-center gap-2">
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 space-y-6">
          {/* KPI Strip */}
          {kpiCards && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards}
            </div>
          )}

          {/* Analytics Section */}
          {analyticsSection && analyticsSection}

          {/* Filters Section */}
          {filtersSection && (
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                {filtersSection}
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <div className="space-y-4">
            {mainContent}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// =============================================================================
// KPI CARD COMPONENT
// Reusable metric card for financial data
// =============================================================================

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  trend,
  onClick,
  className = "",
  'data-testid': dataTestId
}: KpiCardProps) {
  return (
    <Card 
      className={cn(
        "transition-shadow duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBgColor)}>
              <div className={iconColor}>
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1">
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground/80">{subtitle}</p>}
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// TRANSACTION LIST TEMPLATE
// Standard layout for transaction histories and lists
// =============================================================================

interface TransactionListTemplateProps {
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  filtersSection?: ReactNode;
  transactions: ReactNode;
  emptyState?: ReactNode;
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export function TransactionListTemplate({
  title,
  subtitle,
  headerActions,
  filtersSection,
  transactions,
  emptyState,
  isLoading = false,
  loadingComponent,
  className = "",
  showBackButton = true,
  backPath = "/"
}: TransactionListTemplateProps) {
  const [, navigate] = useLocation();

  return (
    <PageShell className={className}>
      <div className="min-h-screen bg-background">
        {/* Simple Header */}
        <div className="bg-card border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  onClick={() => navigate(backPath)}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="font-semibold text-lg">{title}</h1>
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
              </div>
            </div>
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 space-y-6">
          {/* Filters */}
          {filtersSection && (
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                {filtersSection}
              </CardContent>
            </Card>
          )}

          {/* Content */}
          {isLoading ? (
            loadingComponent || (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {transactions}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && emptyState && emptyState}
        </div>
      </div>
    </PageShell>
  );
}

// =============================================================================
// DETAIL PAGE TEMPLATE
// For detailed views of individual items (loans, investments, etc.)
// =============================================================================

interface DetailPageTemplateProps {
  title: string;
  subtitle?: string;
  heroSection?: ReactNode;
  primaryActions?: ReactNode;
  secondaryActions?: ReactNode;
  detailSections: ReactNode[];
  sidebar?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export function DetailPageTemplate({
  title,
  subtitle,
  heroSection,
  primaryActions,
  secondaryActions,
  detailSections,
  sidebar,
  className = "",
  showBackButton = true,
  backPath = "/"
}: DetailPageTemplateProps) {
  const [, navigate] = useLocation();

  return (
    <PageShell className={className}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  onClick={() => navigate(backPath)}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="font-semibold text-lg">{title}</h1>
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {secondaryActions}
              {primaryActions}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {heroSection && (
          <div className="px-4 lg:px-8 py-6 bg-muted/30">
            {heroSection}
          </div>
        )}

        {/* Main Content */}
        <div className="px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detail Sections */}
            <div className="lg:col-span-2 space-y-6">
              {detailSections.map((section, index) => (
                <div key={index}>{section}</div>
              ))}
            </div>

            {/* Sidebar */}
            {sidebar && (
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  {sidebar}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// =============================================================================
// ANALYTICS CARD COMPONENT
// Reusable analytics card with chart placeholder
// =============================================================================

interface AnalyticsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function AnalyticsCard({
  title,
  description,
  children,
  actions,
  className = "",
  'data-testid': dataTestId
}: AnalyticsCardProps) {
  return (
    <Card className={cn("border-border shadow-sm", className)} data-testid={dataTestId}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// SETTINGS/PROFILE TEMPLATE
// For user settings and profile management
// =============================================================================

interface SettingsTemplateProps {
  title: string;
  subtitle?: string;
  tabs?: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  sections?: ReactNode[];
  className?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export function SettingsTemplate({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  sections,
  className = "",
  showBackButton = true,
  backPath = "/"
}: SettingsTemplateProps) {
  const [, navigate] = useLocation();

  return (
    <PageShell className={className}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b px-4 py-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                onClick={() => navigate(backPath)}
                variant="ghost"
                size="sm"
                className="p-2"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="font-semibold text-lg">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        {tabs && (
          <div className="border-b bg-card">
            <div className="px-4">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={cn(
                      "py-4 text-sm font-medium border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    data-testid={`tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 lg:px-8 py-6">
          {tabs ? (
            <div>
              {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
          ) : sections ? (
            <div className="max-w-2xl space-y-6">
              {sections.map((section, index) => (
                <div key={index}>{section}</div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}