import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  BookOpen,
  Play,
  Clock,
  Star,
  Users,
  TrendingUp,
  Video,
  FileText,
  CheckCircle,
  GraduationCap,
  Target,
  Zap,
  Eye,
  Search,
  Filter
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "course";
  duration: string;
  creator: {
    name: string;
    verified: boolean;
  };
  rating: number;
  views: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  progress?: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: number;
  totalDuration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  completionRate: number;
  enrolled: number;
}

export default function Learn() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const mockContent: ContentItem[] = [
    {
      id: "content-1",
      title: "5 Credit Score Hacks That Actually Work",
      description: "Proven strategies to boost your credit score by 50+ points in 90 days",
      type: "video",
      duration: "12 min",
      creator: { name: "Kiran Anand", verified: true },
      rating: 4.8,
      views: 125000,
      category: "credit",
      level: "beginner",
      progress: 65
    },
    {
      id: "content-2",
      title: "EMI vs Lump Sum: Complete Analysis",
      description: "Data-driven comparison to help you make the right loan decision",
      type: "article",
      duration: "8 min read",
      creator: { name: "Priya Sharma", verified: true },
      rating: 4.9,
      views: 89000,
      category: "loans",
      level: "intermediate"
    },
    {
      id: "content-3",
      title: "Investment Basics Masterclass",
      description: "Complete beginner's guide to starting your investment journey",
      type: "course",
      duration: "3 hours",
      creator: { name: "Rohit Agarwal", verified: true },
      rating: 4.7,
      views: 67000,
      category: "investment",
      level: "beginner",
      progress: 30
    },
    {
      id: "content-4",
      title: "Tax Savings Strategies for 2024",
      description: "Expert tips to minimize tax liability and maximize returns",
      type: "course",
      duration: "2.5 hours",
      creator: { name: "Anjali Mehta", verified: true },
      rating: 4.6,
      views: 45000,
      category: "savings",
      level: "intermediate"
    }
  ];

  const mockLearningPaths: LearningPath[] = [
    {
      id: "path-1",
      title: "Credit Building Mastery",
      description: "Complete guide to building and maintaining excellent credit scores",
      courses: 6,
      totalDuration: "8 hours",
      difficulty: "beginner",
      completionRate: 85,
      enrolled: 12400
    },
    {
      id: "path-2",
      title: "Investment Fundamentals",
      description: "Learn the basics of investing in stocks, mutual funds, and more",
      courses: 8,
      totalDuration: "12 hours",
      difficulty: "intermediate",
      completionRate: 73,
      enrolled: 8900
    },
    {
      id: "path-3",
      title: "Loan Optimization Strategies",
      description: "Master EMI calculations, loan comparisons, and refinancing",
      courses: 5,
      totalDuration: "6 hours",
      difficulty: "intermediate",
      completionRate: 91,
      enrolled: 6700
    }
  ];

  const categories = [
    { id: "all", name: "All", count: mockContent.length },
    { id: "credit", name: "Credit", count: mockContent.filter(c => c.category === 'credit').length },
    { id: "loans", name: "Loans", count: mockContent.filter(c => c.category === 'loans').length },
    { id: "investment", name: "Investment", count: mockContent.filter(c => c.category === 'investment').length },
    { id: "savings", name: "Savings", count: mockContent.filter(c => c.category === 'savings').length }
  ];

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalItems = filteredContent.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedContent = filteredContent.slice(startIndex - 1, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "article": return FileText;
      case "course": return BookOpen;
      default: return BookOpen;
    }
  };

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
            <h1 className="text-base font-bold tracking-wider">LEARN & EARN</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Financial education hub</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-filter"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none font-light"
            data-testid="input-search"
          />
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-none font-light tracking-wide ${
                  selectedCategory === category.id
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                }`}
                data-testid={`button-category-${category.id}`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Total Courses</p>
            <p className="text-2xl font-light text-white tracking-tight">480+</p>
          </div>

          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">Students</p>
            <p className="text-2xl font-light text-white tracking-tight">50K+</p>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light">Learning Paths</h3>
            <span className="text-xs text-white/40 font-light">{mockLearningPaths.length} paths</span>
          </div>
          {mockLearningPaths.map((path) => (
            <div 
              key={path.id}
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => navigate(`/learn/path/${path.id}`)}
              data-testid={`card-path-${path.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-light text-white mb-1 tracking-wide">{path.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-2 font-light">{path.description}</p>
                  </div>
                  <Badge className="flex-shrink-0 bg-white/10 text-white/80 border-white/20 border text-[10px] uppercase tracking-widest rounded-none">
                    {path.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] text-white/50 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {path.courses} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {path.totalDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {path.enrolled.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                    <span>Completion Rate</span>
                    <span>{path.completionRate}%</span>
                  </div>
                  <Progress value={path.completionRate} className="h-1.5 bg-white/10 [&>div]:bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {selectedCategory === "all" ? "All Courses" : categories.find(c => c.id === selectedCategory)?.name + " Courses"}
            </h3>
            <span className="text-xs text-white/40 font-light">{filteredContent.length} courses</span>
          </div>
          
          {paginatedContent.map((item) => {
            const ContentIcon = getContentIcon(item.type);
            
            return (
              <div 
                key={item.id}
                className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => navigate(`/learn/${item.id}`)}
                data-testid={`card-content-${item.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <ContentIcon className="h-6 w-6 text-white/80" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-light text-white tracking-wide">{item.title}</h3>
                      <Badge className="bg-white/10 border-white/20 border text-[10px] flex-shrink-0 uppercase tracking-widest rounded-none">
                        {item.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/60 mb-3 line-clamp-2 font-light">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-[10px] text-white/50 uppercase tracking-widest mb-3">
                      <div className="flex items-center gap-1">
                        {item.creator.verified && <CheckCircle className="h-3 w-3 text-white/80" />}
                        <span>{item.creator.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{(item.views / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-white/80" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    {item.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1.5 bg-white/10 [&>div]:bg-emerald-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-light">No courses found</p>
              <p className="text-white/40 text-sm mt-2 font-light">Try a different search or category</p>
            </div>
          )}

          {filteredContent.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              canGoNext={currentPage < totalPages}
              canGoPrevious={currentPage > 1}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              className="mt-8"
            />
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
