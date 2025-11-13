import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FinancialDashboardTemplate, KpiCard } from "@/components/layout/financial-page-templates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Shield, 
  CreditCard,
  Activity,
  Settings,
  RefreshCw,
  Wallet,
  Car,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Lightbulb
} from "lucide-react";
import type { FinancialAnalytics } from "@shared/schema";

export default function FinancialHealth() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: financialAnalytics, isLoading, isError, error } = useQuery<FinancialAnalytics>({
    queryKey: ['/api/financial-analytics'],
    select: (data: any) => data || null
  });

  const mockFinancialHealthData = {
    overallHealthScore: 78,
    creditScore: 750,
    creditScoreChange: +15,
    lastUpdated: "2024-02-15",
    
    monthlyIncome: 125000,
    monthlyExpenses: 85000,
    savingsRate: 32.0,
    debtToIncomeRatio: 28.5,
    emergencyFundMonths: 4.2,
    investmentAllocation: 22.5,
    
    trends: {
      spendingTrend: -8.2,
      savingsTrend: +12.5,
      investmentTrend: +15.3,
      creditUtilizationTrend: -5.8
    },
    
    goals: [
      { id: 1, name: "Emergency Fund", target: 500000, current: 350000, progress: 70, status: "on_track" },
      { id: 2, name: "Retirement Savings", target: 2000000, current: 450000, progress: 22.5, status: "needs_attention" },
      { id: 3, name: "Home Down Payment", target: 1500000, current: 1200000, progress: 80, status: "ahead" },
      { id: 4, name: "Debt Reduction", target: 200000, current: 157000, progress: 65, status: "on_track" }
    ],
    
    spendingBreakdown: [
      { category: "Housing", amount: 35000, percentage: 41.2, trend: +2.1, status: "high" },
      { category: "Food", amount: 18000, percentage: 21.2, trend: -5.3, status: "normal" },
      { category: "Transportation", amount: 12000, percentage: 14.1, trend: +8.7, status: "normal" },
      { category: "Entertainment", amount: 8500, percentage: 10.0, trend: -12.4, status: "low" },
      { category: "Healthcare", amount: 6500, percentage: 7.6, trend: +3.2, status: "normal" },
      { category: "Others", amount: 5000, percentage: 5.9, trend: 0, status: "normal" }
    ],
    
    creditHealth: {
      utilization: 22,
      onTimePayments: 98.5,
      accountAge: 8.2,
      creditMix: "excellent",
      recentInquiries: 1,
      totalAccounts: 7,
      activeLoans: 2
    },
    
    recommendations: [
      {
        id: 1,
        category: "Savings",
        priority: "high",
        title: "Increase Emergency Fund",
        description: "Your emergency fund covers 4.2 months. Aim for 6 months of expenses.",
        impact: "High security improvement",
        action: "Set up automated transfer of ₹15,000 monthly",
        icon: Shield
      },
      {
        id: 2,
        category: "Credit",
        priority: "medium",
        title: "Optimize Credit Utilization",
        description: "Keep credit utilization below 20% to improve credit score.",
        impact: "15-20 point credit score boost",
        action: "Pay down ₹25,000 on highest utilized card",
        icon: CreditCard
      },
      {
        id: 3,
        category: "Investment",
        priority: "medium",
        title: "Increase Investment Allocation",
        description: "Current investment rate is 22.5%. Aim for 25-30% for wealth building.",
        impact: "₹2.5L additional annual growth",
        action: "Increase SIP by ₹5,000 monthly",
        icon: TrendingUp
      },
      {
        id: 4,
        category: "Spending",
        priority: "low",
        title: "Review Transportation Costs",
        description: "Transportation costs increased 8.7% this month. Review for optimization.",
        impact: "Save ₹3,000 monthly",
        action: "Explore alternative commute options",
        icon: Car
      }
    ]
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/financial-analytics'] });
  };

  const healthData = {
    ...mockFinancialHealthData,
    overallHealthScore: financialAnalytics?.financialHealthScore ?? mockFinancialHealthData.overallHealthScore,
    monthlyIncome: financialAnalytics?.totalIncome != null ? parseFloat(financialAnalytics.totalIncome) : mockFinancialHealthData.monthlyIncome,
    monthlyExpenses: financialAnalytics?.totalExpenses != null ? parseFloat(financialAnalytics.totalExpenses) : mockFinancialHealthData.monthlyExpenses,
    savingsRate: financialAnalytics?.savingsRate != null ? parseFloat(financialAnalytics.savingsRate) : mockFinancialHealthData.savingsRate,
    
    ...(financialAnalytics?.totalSavings != null && {
      savings: parseFloat(financialAnalytics.totalSavings)
    }),
    ...(financialAnalytics?.totalInvestments != null && {
      investments: parseFloat(financialAnalytics.totalInvestments)
    }),
    ...(financialAnalytics?.investmentGains != null && {
      investmentGains: parseFloat(financialAnalytics.investmentGains)
    })
  };

  if (isLoading) {
    return (
      <FinancialDashboardTemplate
        title="Financial Health"
        subtitle="Loading your financial wellness data..."
        showBackButton={true}
        backPath="/view-all-services"
        kpiCards={
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/10 animate-pulse rounded-none" />
            ))}
          </>
        }
        headerActions={<div className="w-32 h-8 bg-white/10 animate-pulse rounded-none" />}
        mainContent={
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/10 animate-pulse rounded-none" />
            ))}
          </div>
        }
      />
    );
  }

  if (isError) {
    return (
      <FinancialDashboardTemplate
        title="Financial Health"
        subtitle="Unable to load financial data"
        showBackButton={true}
        backPath="/view-all-services"
        kpiCards={<div />}
        headerActions={
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/20 p-2"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1} />
          </Button>
        }
        mainContent={
          <div className="bg-white/5 border border-white/10 rounded-none p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-none flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white/80" strokeWidth={1} />
              </div>
              <h3 className="text-lg font-light text-white mb-2 uppercase tracking-wider">
                Unable to Load Financial Data
              </h3>
              <p className="text-white/60 mb-4">
                We're having trouble connecting to your financial data. Please try again.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={handleRefresh}
                  className="mr-2"
                  data-testid="button-retry"
                >
                  <RefreshCw className="h-4 w-4 mr-2" strokeWidth={1} />
                  Retry
                </Button>
                <Button
                  onClick={() => navigate('/view-all-services')}
                  variant="outline"
                  data-testid="button-back-services"
                >
                  Back to Services
                </Button>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-white/10 text-white/80 border-white/20";
      case "medium": return "bg-white/10 text-white/80 border-white/20";
      case "low": return "bg-white/10 text-white/80 border-white/20";
      default: return "bg-white/10 text-white/80 border-white/20";
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "ahead": return "text-white/80";
      case "on_track": return "text-white/80";
      case "needs_attention": return "text-white/80";
      case "behind": return "text-white/80";
      default: return "text-white/80";
    }
  };

  const kpiCards = (
    <>
      <KpiCard
        title="Health Score"
        value={`${healthData.overallHealthScore}/100`}
        icon={<Activity className="h-5 w-5" strokeWidth={1} />}
        iconBgColor={healthData.overallHealthScore >= 80 ? "bg-white/10" : healthData.overallHealthScore >= 60 ? "bg-white/10" : "bg-white/10"}
        iconColor={healthData.overallHealthScore >= 80 ? "text-white/80" : healthData.overallHealthScore >= 60 ? "text-white/80" : "text-white/80"}
        data-testid="card-health-score"
      />
      <KpiCard
        title="Credit Score"
        value={healthData.creditScore.toString()}
        icon={<Shield className="h-5 w-5" strokeWidth={1} />}
        iconBgColor="bg-white/10"
        iconColor="text-white/80"
        trend={{ value: healthData.creditScoreChange, isPositive: healthData.creditScoreChange > 0 }}
        data-testid="card-credit-score"
      />
      <KpiCard
        title="Savings Rate"
        value={`${healthData.savingsRate}%`}
        icon={<Wallet className="h-5 w-5" strokeWidth={1} />}
        iconBgColor={healthData.trends.savingsTrend > 0 ? "bg-white/10" : "bg-white/10"}
        iconColor={healthData.trends.savingsTrend > 0 ? "text-white/80" : "text-white/80"}
        trend={{ value: healthData.trends.savingsTrend, isPositive: healthData.trends.savingsTrend > 0 }}
        data-testid="card-savings-rate"
      />
      <KpiCard
        title="Debt-to-Income"
        value={`${healthData.debtToIncomeRatio}%`}
        icon={<CreditCard className="h-5 w-5" strokeWidth={1} />}
        iconBgColor={healthData.debtToIncomeRatio < 30 ? "bg-white/10" : "bg-white/10"}
        iconColor={healthData.debtToIncomeRatio < 30 ? "text-white/80" : "text-white/80"}
        data-testid="card-debt-ratio"
      />
    </>
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => navigate('/myreport')}
        variant="ghost"
        size="sm"
        className="text-white/80 hover:text-white hover:bg-white/20 p-2"
        data-testid="button-detailed-report"
      >
        <FileText className="h-4 w-4" strokeWidth={1} />
      </Button>
      <Button
        onClick={handleRefresh}
        variant="ghost"
        size="sm"
        className="text-white/80 hover:text-white hover:bg-white/20 p-2"
        data-testid="button-refresh"
      >
        <RefreshCw className="h-4 w-4" strokeWidth={1} />
      </Button>
      <Button
        onClick={() => navigate('/security')}
        variant="ghost"
        size="sm"
        className="text-white/80 hover:text-white hover:bg-white/20 p-2"
        data-testid="button-settings"
      >
        <Settings className="h-4 w-4" strokeWidth={1} />
      </Button>
    </div>
  );

  const creditHealthSection = (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-5 w-5 text-white" strokeWidth={1} />
        <h2 className="text-white text-lg font-light tracking-wider">CREDIT HEALTH MONITOR</h2>
        <Badge className="bg-white/10 text-white/80 border-white/20">Excellent</Badge>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-light text-white">{healthData.creditHealth.utilization}%</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">Utilization</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-white">{healthData.creditHealth.onTimePayments}%</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">On-Time Payments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-white">{healthData.creditHealth.accountAge}</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">Avg Account Age (years)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-white">{healthData.creditHealth.totalAccounts}</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">Total Accounts</p>
          </div>
        </div>
        
        <div className="border border-white/10 rounded-none p-4 bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-light text-white">Credit Score Trend</span>
            <Badge className="bg-white/10 text-white/80 border-white/20">+{healthData.creditScoreChange} this month</Badge>
          </div>
          <div className="text-xs text-white/60">
            Your credit score improved by {healthData.creditScoreChange} points. Keep maintaining low utilization and on-time payments.
          </div>
        </div>
      </div>
    </div>
  );

  const financialGoalsSection = (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-5 w-5 text-white" strokeWidth={1} />
        <h2 className="text-white text-lg font-light tracking-wider">FINANCIAL GOALS PROGRESS</h2>
      </div>
      <div className="space-y-4">
        {healthData.goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-light text-white">{goal.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${getGoalStatusColor(goal.status)}`}>
                  {goal.progress}%
                </span>
                <span className="text-sm text-white/60">
                  {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </span>
              </div>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );

  const spendingAnalysisSection = (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6">
      <div className="flex items-center gap-3 mb-6">
        <PieChart className="h-5 w-5 text-white" strokeWidth={1} />
        <h2 className="text-white text-lg font-light tracking-wider">SPENDING ANALYSIS</h2>
      </div>
      <div className="space-y-4">
        {healthData.spendingBreakdown.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-none">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white/10 rounded-none"></div>
              <div>
                <p className="font-light text-white">{category.category}</p>
                <p className="text-sm text-white/60">{category.percentage}% of total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-light text-white">{formatCurrency(category.amount)}</p>
              <div className="flex items-center gap-1">
                {category.trend > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-white/80" strokeWidth={1} />
                ) : category.trend < 0 ? (
                  <ArrowDownRight className="h-3 w-3 text-white/80" strokeWidth={1} />
                ) : null}
                <span className={`text-xs ${category.trend > 0 ? 'text-white/80' : category.trend < 0 ? 'text-white/80' : 'text-white/60'}`}>
                  {category.trend !== 0 ? formatPercentage(Math.abs(category.trend)) : '0%'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const recommendationsSection = (
    <div className="bg-white/5 border border-white/10 rounded-none p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-5 w-5 text-white" strokeWidth={1} />
        <h2 className="text-white text-lg font-light tracking-wider">IMPROVEMENT RECOMMENDATIONS</h2>
      </div>
      <div className="space-y-4">
        {healthData.recommendations.map((rec) => {
          const IconComponent = rec.icon;
          return (
            <div key={rec.id} className="border border-white/10 rounded-none p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-white" strokeWidth={1} />
                  </div>
                  <div>
                    <h4 className="font-light text-white">{rec.title}</h4>
                    <p className="text-sm text-white/60">{rec.description}</p>
                  </div>
                </div>
                <Badge className={getPriorityColor(rec.priority)}>
                  {rec.priority}
                </Badge>
              </div>
              
              <div className="pl-13 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light text-white uppercase tracking-wider">Impact:</span>
                  <span className="text-sm text-white/60">{rec.impact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light text-white uppercase tracking-wider">Action:</span>
                  <span className="text-sm text-white/60">{rec.action}</span>
                </div>
                <Button size="sm" className="mt-2" data-testid={`button-action-${rec.id}`}>
                  Take Action
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const mainContent = (
    <div className="space-y-6">
      {creditHealthSection}
      {financialGoalsSection}
      {spendingAnalysisSection}
      {recommendationsSection}
    </div>
  );

  return (
    <FinancialDashboardTemplate
      title="Financial Health"
      subtitle="Complete financial wellness monitoring"
      showBackButton={true}
      backPath="/view-all-services"
      kpiCards={kpiCards}
      headerActions={headerActions}
      mainContent={mainContent}
    />
  );
}
