import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Calendar,
  Award,
  Lightbulb,
  Zap,
  Star,
  Crown,
  Shield,
  Trophy,
  Check,
  RefreshCw
} from "lucide-react";

interface ImprovementArea {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  estimatedPoints: number;
  timeframe: string;
  status: "pending" | "in_progress" | "completed";
  icon: any;
  steps: {
    title: string;
    description: string;
    completed: boolean;
  }[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  rewards: string[];
  icon: any;
}

export default function MyPath() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [overallProgress, setOverallProgress] = useState(68);
  const [improvements, setImprovements] = useState<ImprovementArea[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    setImprovements(mockImprovements);
  }, []);

  const toggleStep = (improvementId: string, stepIndex: number) => {
    setImprovements(prevImprovements =>
      prevImprovements.map(improvement => {
        if (improvement.id === improvementId) {
          const newSteps = [...improvement.steps];
          newSteps[stepIndex] = {
            ...newSteps[stepIndex],
            completed: !newSteps[stepIndex].completed
          };
          return { ...improvement, steps: newSteps };
        }
        return improvement;
      })
    );
  };

  const mockImprovements: ImprovementArea[] = [
    {
      id: "credit-utilization",
      title: "Reduce Credit Utilization",
      description: "Lower your credit card usage below 30% to boost score",
      impact: "high",
      estimatedPoints: 45,
      timeframe: "2-3 months",
      status: "in_progress",
      icon: CreditCard,
      steps: [
        { title: "Pay down current balances", description: "Target 25% utilization", completed: true },
        { title: "Set up balance alerts", description: "Get notified at 25% usage", completed: true },
        { title: "Increase credit limits", description: "Request limit increases", completed: false }
      ]
    },
    {
      id: "payment-history",
      title: "Perfect Payment History", 
      description: "Maintain 100% on-time payments for all accounts",
      impact: "high",
      estimatedPoints: 35,
      timeframe: "6 months",
      status: "pending",
      icon: CheckCircle,
      steps: [
        { title: "Set up autopay", description: "For all credit accounts", completed: false },
        { title: "Create payment calendar", description: "Track all due dates", completed: false },
        { title: "Build payment buffer", description: "Emergency payment fund", completed: false }
      ]
    },
    {
      id: "credit-age",
      title: "Improve Credit Age",
      description: "Keep old accounts open and avoid unnecessary inquiries", 
      impact: "medium",
      estimatedPoints: 25,
      timeframe: "Long term",
      status: "pending",
      icon: Calendar,
      steps: [
        { title: "Keep oldest accounts active", description: "Use them occasionally", completed: false },
        { title: "Avoid closing old cards", description: "Unless annual fees are high", completed: true },
        { title: "Space out new applications", description: "Wait 6+ months between", completed: false }
      ]
    }
  ];

  const mockMilestones: Milestone[] = [
    {
      id: "excellent-score",
      title: "Reach 750+ Score",
      description: "Join the excellent credit tier",
      targetDate: new Date(2024, 8, 15),
      progress: 85,
      rewards: ["Lower interest rates", "Premium credit cards", "Better loan terms"],
      icon: Trophy
    },
    {
      id: "debt-freedom",
      title: "Become Debt Free", 
      description: "Pay off all high-interest debt",
      targetDate: new Date(2024, 11, 31),
      progress: 45,
      rewards: ["Financial freedom", "Monthly savings", "Peace of mind"],
      icon: Shield
    }
  ];

  const { data: pathData } = useQuery({
    queryKey: ["/api/mypath"],
    enabled: isAuthenticated,
    queryFn: async () => ({
      completedSteps: 8,
      totalSteps: 15,
      overallProgress: overallProgress,
      userPoints: 350
    }),
  });

  if (!isAuthenticated || authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MY PATH</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Credit improvement roadmap</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Progress Section */}
        <div className="relative border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
          <div className="space-y-6">
            {/* Overall Progress Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Overall Progress</p>
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60 font-light">{overallProgress}% Complete</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-overall-progress">
                {overallProgress}%
              </p>
              <Progress value={overallProgress} className="h-2 bg-white/10 [&>div]:bg-white" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-xp-points">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">XP Points</p>
                <p className="text-lg font-light text-white" data-testid="text-xp-points">
                  {pathData?.userPoints || 350}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-tasks-completed">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Completed</p>
                <p className="text-lg font-light text-white" data-testid="text-tasks-completed">
                  {pathData?.completedSteps || 8}/{pathData?.totalSteps || 15}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Remaining</p>
                <p className="text-lg font-light text-white">
                  {(pathData?.totalSteps || 15) - (pathData?.completedSteps || 8)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-light tracking-wide text-white uppercase">Priority Improvements</h3>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{improvements.length} Areas</p>
          </div>
          {improvements.map((area) => {
            const AreaIcon = area.icon;
            const completedSteps = area.steps.filter(s => s.completed).length;
            const progressPercent = (completedSteps / area.steps.length) * 100;
            
            return (
              <div 
                key={area.id}
                className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5"
                data-testid={`card-improvement-${area.id}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <AreaIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-light text-white tracking-wide">{area.title}</h3>
                      <Badge className="flex-shrink-0 border border-white/20 bg-white/10 text-white/80 text-[10px] uppercase tracking-widest rounded-none">
                        {area.impact === 'high' ? <Zap className="w-3 h-3 mr-1" /> :
                         area.impact === 'medium' ? <Star className="w-3 h-3 mr-1" /> :
                         <Lightbulb className="w-3 h-3 mr-1" />}
                        {area.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 font-light mb-3">{area.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-3 font-light">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-white/80" />
                        +{area.estimatedPoints} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {area.timeframe}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest font-light">
                        <span>Progress</span>
                        <span>{completedSteps}/{area.steps.length}</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5 bg-white/10 [&>div]:bg-white" />
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2 ml-16 pt-3 border-t border-white/10">
                  {area.steps.map((step, stepIndex) => (
                    <div 
                      key={stepIndex} 
                      className="flex items-start gap-3 text-sm cursor-pointer hover:bg-white/5 p-2 transition-colors"
                      onClick={() => toggleStep(area.id, stepIndex)}
                      data-testid={`step-${area.id}-${stepIndex}`}
                    >
                      <div className={`w-4 h-4 border flex items-center justify-center mt-0.5 flex-shrink-0 cursor-pointer ${
                        step.completed ? 'bg-white border-white' : 'border-white/40 hover:border-white/60'
                      }`}>
                        {step.completed && <Check className="h-3 w-3 text-black" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-light tracking-wide ${step.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-white/40 font-light">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-light tracking-wide text-white uppercase">Milestones</h3>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{mockMilestones.length} Goals</p>
          </div>
          {mockMilestones.map((milestone) => {
            const MilestoneIcon = milestone.icon;
            
            return (
              <div 
                key={milestone.id}
                className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-5"
                data-testid={`card-milestone-${milestone.id}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MilestoneIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-light text-white tracking-wide mb-1">{milestone.title}</h3>
                    <p className="text-sm text-white/60 font-light mb-3">{milestone.description}</p>
                    <div className="flex items-center gap-1 text-xs text-white/60 mb-3 font-light">
                      <Calendar className="h-3 w-3" />
                      <span>Target: {milestone.targetDate.toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest font-light">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-1.5 bg-white/10 [&>div]:bg-white" />
                    </div>
                  </div>
                </div>
                <div className="ml-16 pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2">Rewards</p>
                  {milestone.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-white/60 font-light">
                      <Crown className="h-3 w-3 text-white/80" />
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
