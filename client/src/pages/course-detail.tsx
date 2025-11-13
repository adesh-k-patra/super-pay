import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { GlassmorphicCard } from "@/components/ui/glassmorphic-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Star,
  Clock,
  Users,
  Award,
  CheckCircle,
  Play,
  BookOpen,
  Download,
  Share2,
  Bookmark,
  Crown,
  TrendingUp,
  Target,
  Globe,
  Calendar,
  Heart,
  User
} from "lucide-react";

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  creator: {
    name: string;
    avatar: string;
    bio: string;
    expertise: string;
    followers: string;
    coursesCount: number;
    verified: boolean;
  };
  price?: number;
  originalPrice?: number;
  isPaid?: boolean;
  isTrial?: boolean;
  duration: string;
  rating: number;
  reviews: number;
  enrolled: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  lastUpdated: string;
  curriculum: {
    title: string;
    duration: string;
    lessons: {
      title: string;
      duration: string;
      type: "video" | "text" | "quiz";
      isFree?: boolean;
    }[];
  }[];
  benefits: string[];
  requirements: string[];
  certificate: boolean;
}

export default function CourseDetail() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/course/:id");
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Mock course data based on course ID
  const courseId = params ? params.id : "";
  const mockCourse: CourseDetail = {
    id: courseId,
    title: "Master Credit Building: From 650 to 850 in 6 Months",
    description: "Comprehensive course to improve your credit score using proven strategies",
    fullDescription: "This comprehensive course will teach you everything you need to know about building and maintaining an excellent credit score. Learn from industry experts who have helped thousands achieve their credit goals.",
    creator: {
      name: "Karan Anand",
      avatar: "KA",
      bio: "Karan is a certified financial planner with 12+ years of experience helping Indians build wealth. His YouTube channel has over 2M subscribers who trust his practical, no-nonsense financial advice.",
      expertise: "Credit Expert & Financial Coach",
      followers: "2.1M",
      coursesCount: 8,
      verified: true
    },
    price: 2499,
    originalPrice: 4999,
    isPaid: true,
    isTrial: false,
    duration: "4.5 hours",
    rating: 4.8,
    reviews: 1247,
    enrolled: 12580,
    level: "Beginner",
    language: "Hindi & English",
    lastUpdated: "December 2024",
    curriculum: [
      {
        title: "Credit Score Fundamentals",
        duration: "45 min",
        lessons: [
          { title: "What is CIBIL Score?", duration: "8 min", type: "video", isFree: true },
          { title: "Factors Affecting Your Score", duration: "12 min", type: "video", isFree: true },
          { title: "Reading Your Credit Report", duration: "10 min", type: "video" },
          { title: "Common Credit Myths", duration: "15 min", type: "text" }
        ]
      },
      {
        title: "Credit Building Strategies",
        duration: "90 min", 
        lessons: [
          { title: "Credit Card Optimization", duration: "20 min", type: "video" },
          { title: "Loan Management Techniques", duration: "25 min", type: "video" },
          { title: "Building Credit History", duration: "30 min", type: "video" },
          { title: "Advanced Credit Hacks", duration: "15 min", type: "video" }
        ]
      },
      {
        title: "Monitoring & Maintenance",
        duration: "60 min",
        lessons: [
          { title: "Monthly Credit Monitoring", duration: "15 min", type: "video" },
          { title: "Dispute Process", duration: "20 min", type: "video" },
          { title: "Long-term Strategy", duration: "25 min", type: "video" }
        ]
      }
    ],
    benefits: [
      "Increase credit score by 100-200 points",
      "Get approved for better loan rates",
      "Learn insider banking secrets",
      "Lifetime course access",
      "Community access with 12K+ members",
      "Monthly live Q&A sessions"
    ],
    requirements: [
      "Basic understanding of banking",
      "Smartphone or computer",
      "Willingness to take action"
    ],
    certificate: true
  };

  const paginationCurriculum = usePagination({
    data: mockCourse.curriculum,
    itemsPerPage: 20,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 pt-8 pb-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => navigate("/learn")}
            variant="ghost"
            size="sm"
            className="text-white p-2"
            data-testid="button-back-to-learn"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">Course Details</h1>
            <p className="text-white/80 text-sm">Learn from the best</p>
          </div>
          <Button
            onClick={() => setIsBookmarked(!isBookmarked)}
            variant="ghost" 
            size="sm"
            className="text-white p-2"
            data-testid="button-bookmark-course"
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-yellow-300' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 -mt-2 space-y-6">
        {/* Course Overview */}
        <GlassmorphicCard className="bg-white shadow-xl border-2 border-white/20/50">
          <div className="relative">
            {/* Course Thumbnail */}
            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-8xl border-2 border-white/20 shadow-inner mb-4">
              📚
            </div>
            
            {/* Pricing Badge */}
            <div className="absolute top-4 right-4">
              {!mockCourse.isPaid ? (
                <Badge className="bg-white/10 text-white px-3 py-2 text-sm rounded-xl shadow-lg">
                  FREE COURSE
                </Badge>
              ) : mockCourse.isTrial ? (
                <Badge className="bg-white/10 text-white px-3 py-2 text-sm rounded-xl shadow-lg">
                  FREE TRIAL
                </Badge>
              ) : (
                <div className="space-y-1">
                  <Badge className="bg-white/10 text-white px-3 py-2 text-sm rounded-xl shadow-lg">
                    ₹{mockCourse.price}
                  </Badge>
                  {mockCourse.originalPrice && (
                    <p className="text-gray-500 text-xs text-center line-through">₹{mockCourse.originalPrice}</p>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{mockCourse.title}</h1>
            <p className="text-gray-700 mb-4">{mockCourse.fullDescription}</p>
            
            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-white/80" />
                  <span className="text-lg font-bold text-yellow-700">{mockCourse.rating}</span>
                </div>
                <p className="text-xs text-gray-600">{mockCourse.reviews} reviews</p>
              </div>
              
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-white/80" />
                  <span className="text-lg font-bold text-blue-700">{(mockCourse.enrolled / 1000).toFixed(1)}K</span>
                </div>
                <p className="text-xs text-gray-600">enrolled</p>
              </div>
              
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-white/80" />
                  <span className="text-lg font-bold text-white/80">{mockCourse.duration}</span>
                </div>
                <p className="text-xs text-gray-600">total content</p>
              </div>
              
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="h-4 w-4 text-white/80" />
                  <span className="text-lg font-bold text-purple-700">{mockCourse.level}</span>
                </div>
                <p className="text-xs text-gray-600">difficulty</p>
              </div>
            </div>

            {/* Join Course Button */}
            <Button 
              className="w-full h-14 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white font-bold text-lg rounded-xl shadow-xl border-2 border-white/20/30 transition-all duration-300 transform hover:scale-[1.02]"
              data-testid="button-join-course"
            >
              <div className="flex items-center justify-center gap-3">
                <Play className="h-5 w-5" />
                <span>
                  {!mockCourse.isPaid ? "Start Free Course" :
                   mockCourse.isTrial ? "Start Free Trial" :
                   `Join Course - ₹${mockCourse.price}`}
                </span>
                {!mockCourse.isPaid && <Crown className="h-5 w-5 text-white/70" />}
              </div>
            </Button>
          </div>
        </GlassmorphicCard>

        {/* Creator Profile */}
        <GlassmorphicCard className="bg-white shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-6 w-6 text-white/80" />
            About the Creator
          </h3>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {mockCourse.creator.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-bold text-gray-900">{mockCourse.creator.name}</h4>
                {mockCourse.creator.verified && (
                  <Badge className="bg-white/5 text-white/80 text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <p className="text-white/80 font-semibold text-sm mb-2">{mockCourse.creator.expertise}</p>
              <p className="text-gray-700 text-sm mb-3">{mockCourse.creator.bio}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full">
                  <Users className="h-4 w-4 text-white/80" />
                  <span className="font-semibold text-blue-700">{mockCourse.creator.followers} followers</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full">
                  <BookOpen className="h-4 w-4 text-white/80" />
                  <span className="font-semibold text-white/80">{mockCourse.creator.coursesCount} courses</span>
                </div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Course Curriculum */}
        <GlassmorphicCard className="bg-white shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-white/80" />
            Course Curriculum
          </h3>
          
          <div className="space-y-3">
            {paginationCurriculum.paginatedData.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{module.title}</h4>
                    <Badge className="bg-white/5 text-white/80 text-xs">
                      {module.duration}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          lesson.type === 'video' ? 'bg-white/5 text-white/80' :
                          lesson.type === 'quiz' ? 'bg-white/5 text-white/80' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {lesson.type === 'video' ? <Play className="h-4 w-4" /> :
                           lesson.type === 'quiz' ? <Target className="h-4 w-4" /> :
                           <BookOpen className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                      {lesson.isFree && (
                        <Badge className="bg-white/5 text-white/80 text-xs">
                          FREE
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {mockCourse.curriculum.length > 0 && (
              <PaginationControls
                currentPage={paginationCurriculum.currentPage}
                totalPages={paginationCurriculum.totalPages}
                onPageChange={paginationCurriculum.goToPage}
                canGoNext={paginationCurriculum.canGoNext}
                canGoPrevious={paginationCurriculum.canGoPrevious}
                startIndex={paginationCurriculum.startIndex}
                endIndex={paginationCurriculum.endIndex}
                totalItems={paginationCurriculum.totalItems}
                className="mt-6"
              />
            )}
          </div>
        </GlassmorphicCard>

        {/* What You'll Learn */}
        <GlassmorphicCard className="bg-white shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-white/80" />
            What You'll Learn
          </h3>
          
          <div className="grid gap-3">
            {mockCourse.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/20">
                <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Course Requirements */}
        <GlassmorphicCard className="bg-white shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
          
          <div className="space-y-2">
            {mockCourse.requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white/10 rounded-full"></div>
                <p className="text-gray-700 text-sm">{req}</p>
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Course Details */}
        <GlassmorphicCard className="bg-white shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Course Details</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-semibold text-gray-900">{mockCourse.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-semibold text-gray-900">{mockCourse.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Certificate:</span>
                <span className="font-semibold text-white/80">
                  {mockCourse.certificate ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">{mockCourse.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Updated:</span>
                <span className="font-semibold text-gray-900">{mockCourse.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Access:</span>
                <span className="font-semibold text-white/80">Lifetime</span>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full h-16 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white font-bold text-lg rounded-xl shadow-xl border-2 border-white/20/30 transition-all duration-300 transform hover:scale-[1.02]"
            data-testid="button-enroll-course"
          >
            <div className="flex items-center justify-center gap-3">
              <Play className="h-6 w-6" />
              <span>
                {!mockCourse.isPaid ? "Start Learning Free" :
                 mockCourse.isTrial ? "Start Free Trial" :
                 `Enroll Now - ₹${mockCourse.price}`}
              </span>
              {!mockCourse.isPaid && <Crown className="h-6 w-6 text-white/70" />}
            </div>
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50" data-testid="button-share-course">
              <Share2 className="h-4 w-4 mr-2" />
              Share Course
            </Button>
            <Button variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50" data-testid="button-download-info">
              <Download className="h-4 w-4 mr-2" />
              Course Info
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}