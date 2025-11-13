import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft,
  Play,
  Clock,
  Star,
  Users,
  CheckCircle,
  BookOpen,
  Award,
  ExternalLink,
  DollarSign,
  Calendar
} from "lucide-react";

export default function LearnContentDetail() {
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const contentId = params?.id || "content-1";
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const mockContent = {
    "content-1": {
      id: "content-1",
      title: "5 Credit Score Hacks That Actually Work",
      description: "Proven strategies to boost your credit score by 50+ points in 90 days",
      type: "video",
      duration: "12 min",
      creator: {
        name: "Kiran Anand",
        verified: true,
        followers: "125K",
        expertise: "Credit Score Expert"
      },
      rating: 4.8,
      views: 125000,
      enrolled: 8450,
      category: "Credit Management",
      level: "beginner",
      thumbnail: "📊",
      price: 0,
      completionReward: "50 XP Points",
      modules: [
        { id: 1, title: "Understanding Credit Scores", duration: "3 min", completed: true },
        { id: 2, title: "Payment History Optimization", duration: "2 min", completed: true },
        { id: 3, title: "Credit Utilization Strategies", duration: "3 min", completed: false },
        { id: 4, title: "Managing Credit Mix", duration: "2 min", completed: false },
        { id: 5, title: "Dispute Resolution", duration: "2 min", completed: false }
      ],
      keyTakeaways: [
        "Pay bills on time for 6 months straight - adds 40+ points",
        "Keep credit utilization below 30% - adds 15-20 points",
        "Dispute errors on credit report - can add 30-50 points",
        "Become authorized user on old account - instant 10-15 points",
        "Mix of credit types shows responsibility - adds 10 points"
      ],
      whatYouLearn: [
        "How to read and understand your credit report",
        "Strategies to improve payment history",
        "Optimizing credit utilization ratio",
        "Disputing errors effectively",
        "Building a healthy credit mix"
      ],
      sourceUrl: "https://youtube.com/watch?v=creditscores",
      bookingAmount: 100,
      hasBooking: true
    }
  };

  const content = mockContent[contentId as keyof typeof mockContent] || mockContent["content-1"];
  const completedModules = content.modules.filter(m => m.completed).length;
  const progressPercent = (completedModules / content.modules.length) * 100;

  if (!isAuthenticated || authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/learn")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">COURSE DETAIL</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Card */}
        <Card className="bg-white/5 border border-white/10 rounded-none overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 text-center">
              <div className="text-6xl mb-4">{content.thumbnail}</div>
              <Badge className="bg-white/10 text-white/80 border-white/20 border mb-3">
                {content.category}
              </Badge>
              <h1 className="text-2xl font-bold text-white mb-2">{content.title}</h1>
              <p className="text-white/60 text-sm mb-4">{content.description}</p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-white/80 fill-white" />
                  <span>{content.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{(content.enrolled / 1000).toFixed(1)}K enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{content.duration}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Your Progress</span>
              <span className="text-sm text-white/80">{completedModules}/{content.modules.length} completed</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/10 [&>div]:bg-white/10" />
          </CardContent>
        </Card>

        {/* Creator Info */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center text-xl font-bold">
                {content.creator.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{content.creator.name}</h3>
                  {content.creator.verified && (
                    <CheckCircle className="h-4 w-4 text-white/80" />
                  )}
                </div>
                <p className="text-xs text-white/60">{content.creator.expertise}</p>
                <p className="text-xs text-white/40">{content.creator.followers} followers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Course Modules</h3>
          {content.modules.map((module, index) => (
            <Card 
              key={module.id}
              className="bg-white/5 border border-white/10 rounded-none hover:bg-white/10 transition-all"
              data-testid={`module-${module.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 border flex items-center justify-center flex-shrink-0 ${
                    module.completed 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/5 border-white/20'
                  }`}>
                    {module.completed ? (
                      <CheckCircle className="h-5 w-5 text-white/80" />
                    ) : (
                      <span className="text-white/60 font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${module.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{module.duration}</span>
                      {module.completed && (
                        <Badge className="bg-white/10 text-white/80 border-white/20 border text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Takeaways */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Key Takeaways</h3>
            <div className="space-y-2">
              {content.keyTakeaways.map((takeaway, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-white/80 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">{takeaway}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What You'll Learn */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">What You'll Learn</h3>
            <div className="space-y-2">
              {content.whatYouLearn.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-white/80 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Reward */}
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/20 rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-white/80" />
              <div>
                <p className="text-sm text-white/80">Complete this course to earn</p>
                <p className="text-lg font-bold text-white/80">{content.completionReward}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 z-40">
        <div className="max-w-screen-lg mx-auto space-y-2">
          <Button 
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-bold"
            onClick={() => window.open(content.sourceUrl, '_blank')}
            data-testid="button-visit-source"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Visit Source
          </Button>
          
          {content.hasBooking && (
            <Button 
              className="w-full bg-white/10 hover:bg-emerald-600 text-white rounded-none h-12 font-bold"
              onClick={() => navigate(`/creators/${contentId}`)}
              data-testid="button-book-session"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Session - ${content.bookingAmount}
            </Button>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
