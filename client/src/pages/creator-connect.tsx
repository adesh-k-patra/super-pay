import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { Creator } from "@shared/schema";
import { 
  ArrowLeft,
  Search,
  CheckCircle,
  Users,
  X,
  Crown,
  Star,
  TrendingUp,
  Award,
  MessageCircle,
  Calendar,
  Clock,
  DollarSign,
  Brain,
  Target,
  BarChart3,
  Video
} from "lucide-react";

interface CreatorFilters {
  q?: string;
  expertise?: string;
  isVerified?: string;
  isActive?: string;
}

export default function CreatorConnect() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Finance",
    "Credit", 
    "Tax",
    "Investment",
    "Insurance"
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Mock creators data
  const mockCreators: (Creator & { category: string })[] = [
    {
      id: "creator-1",
      userId: "user-1",
      displayName: "Rajesh Kumar",
      bio: "Senior Financial Advisor with 15+ years experience in investment planning and wealth management.",
      expertise: ["Finance", "Investment", "Wealth Management"],
      credentials: ["CFA", "CFP"],
      profileImageUrl: null,
      hourlyRate: "999",
      totalEarnings: "125000",
      averageRating: "4.9",
      totalSessions: 247,
      isVerified: 1,
      languages: ["English", "Hindi"],
      isActive: 1,
      timezone: "Asia/Kolkata",
      socialLinks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "Finance"
    },
    {
      id: "creator-2",
      userId: "user-2",
      displayName: "Priya Sharma",
      bio: "Credit card expert and rewards specialist. Helps optimize credit utilization and maximize cashback.",
      expertise: ["Credit Cards", "Rewards", "Credit Score"],
      credentials: ["Certified Credit Counselor"],
      profileImageUrl: null,
      hourlyRate: "1299",
      totalEarnings: "95000",
      averageRating: "4.8",
      totalSessions: 189,
      isVerified: 1,
      languages: ["English", "Hindi", "Marathi"],
      isActive: 1,
      timezone: "Asia/Kolkata",
      socialLinks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "Credit"
    },
    {
      id: "creator-3",
      userId: "user-3",
      displayName: "Amit Verma",
      bio: "Tax consultant and CA with 12+ years experience. Specializes in income tax planning and GST compliance.",
      expertise: ["Income Tax", "GST", "Tax Planning"],
      credentials: ["CA", "Tax Consultant"],
      profileImageUrl: null,
      hourlyRate: "899",
      totalEarnings: "78000",
      averageRating: "4.7",
      totalSessions: 156,
      isVerified: 1,
      languages: ["English", "Hindi"],
      isActive: 1,
      timezone: "Asia/Kolkata",
      socialLinks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "Tax"
    },
    {
      id: "creator-4",
      userId: "user-4",
      displayName: "Dr. Sneha Patel",
      bio: "Personal finance coach specializing in budgeting and financial goal setting for working professionals.",
      expertise: ["Budgeting", "Emergency Fund", "Financial Goals"],
      credentials: ["CFP", "Personal Finance Coach"],
      profileImageUrl: null,
      hourlyRate: "1599",
      totalEarnings: "142000",
      averageRating: "4.9",
      totalSessions: 134,
      isVerified: 1,
      languages: ["English", "Gujarati"],
      isActive: 1,
      timezone: "Asia/Kolkata",
      socialLinks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "Finance"
    },
    {
      id: "creator-5",
      userId: "user-5",
      displayName: "Vikram Singh",
      bio: "Investment advisor and portfolio manager. Specializes in mutual funds, stocks, and long-term wealth creation.",
      expertise: ["Mutual Funds", "Stocks", "Portfolio Management"],
      credentials: ["CFA", "Investment Advisor"],
      profileImageUrl: null,
      hourlyRate: "1199",
      totalEarnings: "87000",
      averageRating: "4.6",
      totalSessions: 98,
      isVerified: 1,
      languages: ["English", "Hindi", "Punjabi"],
      isActive: 1,
      timezone: "Asia/Kolkata",
      socialLinks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "Investment"
    },
    {
      id: "creator-6",
      userId: "user-6",
      displayName: "Kiran Shah",
      bio: "Insurance and financial protection specialist. Expertise in life insurance, health insurance, and risk management.",
      expertise: ["Insurance", "Risk Management", "Financial Protection"],
      credentials: ["Insurance Advisor", "Risk Analyst"],
      profileImageUrl: null,
      hourlyRate: "950",
      totalEarnings: "38000",
      averageRating: "4.3",
      totalSessions: 54,
      isVerified: 1,
      languages: ["English", "Hindi"],
      isActive: 1,
      timezone: "Asia/Kolkata",
      socialLinks: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "Insurance"
    }
  ];

  const filteredCreators = mockCreators.filter(creator => {
    const matchesCategory = activeCategory === "All" || creator.category === activeCategory;
    const matchesSearch = !searchQuery || 
      creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.bio && creator.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const pagination = usePagination({
    data: filteredCreators,
    itemsPerPage: 20,
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
            <h1 className="text-base font-bold tracking-wider">CREATOR CONNECT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Connect with financial experts</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-8 w-full max-w-screen-lg mx-auto">

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-none"
            data-testid="input-search"
          />
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`rounded-none ${
                  activeCategory === category
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                }`}
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-white/80 flex-shrink-0" />
              <span className="text-xs text-white/60 truncate">Total Experts</span>
            </div>
            <p className="text-xl font-bold text-white break-words">{mockCreators.length}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-white/80 flex-shrink-0" />
              <span className="text-xs text-white/60 truncate">Total Sessions</span>
            </div>
            <p className="text-xl font-bold text-white/80 break-words">
              {mockCreators.reduce((sum, c) => sum + (c.totalSessions || 0), 0)}
            </p>
          </div>
        </div>

        {/* Creators List */}
        <div className="space-y-4">
          <h3 className="text-[10px] text-white/50 uppercase tracking-widest font-light">
            {filteredCreators.length} {activeCategory === "All" ? "Experts" : activeCategory + " Experts"}
          </h3>
          
          {pagination.paginatedData.map((creator) => (
            <div 
              key={creator.id}
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => navigate(`/creator/${creator.id}`)}
              data-testid={`card-creator-${creator.id}`}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 border border-white/20">
                  <AvatarImage src={creator.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-white/10 text-white">
                    {getInitials(creator.displayName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-light tracking-wide text-white">{creator.displayName}</h3>
                      {creator.isVerified === 1 && (
                        <CheckCircle className="h-4 w-4 text-white/80 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-light tracking-wide">₹{creator.hourlyRate}/hr</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/60 font-light mb-3 line-clamp-2">{creator.bio || 'Expert financial advisor'}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/60 font-light">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-white/80" />
                      <span>{creator.averageRating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      <span>{creator.totalSessions} sessions</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {Array.isArray(creator.expertise) && creator.expertise.slice(0, 3).map((skill: string, index: number) => (
                      <Badge 
                        key={index} 
                        className="bg-white/10 text-white/80 border-blue-400/50 border text-xs font-light"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCreators.length > 0 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              className="mt-6"
            />
          )}

          {filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No creators found</p>
              <p className="text-white/40 text-sm mt-2">Try a different search or category</p>
            </div>
          )}
        </div>

        {/* Book Session CTA */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6 text-center">
          <MessageCircle className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h3 className="text-lg font-light tracking-wide text-white mb-2">Need Expert Advice?</h3>
          <p className="text-sm text-white/60 font-light mb-4">
            Book a 1-on-1 session with our financial experts and get personalized guidance
          </p>
          <Button 
            className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wide"
            onClick={() => filteredCreators.length > 0 && navigate(`/creator/${filteredCreators[0].id}`)}
            data-testid="button-book-session"
          >
            Book a Session
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
