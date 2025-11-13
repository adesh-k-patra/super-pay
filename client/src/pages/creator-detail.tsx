import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Creator } from "@shared/schema";
import {
  ArrowLeft,
  CheckCircle,
  Play,
  Calendar,
  ExternalLink,
  Eye,
  ThumbsUp,
  Star,
  Award,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Users,
  Brain,
  Globe,
  Clock,
  Target,
  Badge as BadgeIcon
} from "lucide-react";

export default function CreatorDetail() {
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const creatorId = params?.id || "creator-1";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Simplified creator data
  const mockCreator: Creator = {
    id: creatorId,
    userId: "user-1",
    displayName: "Rajesh Kumar",
    bio: "Senior Financial Advisor with 15+ years experience in investment planning and wealth management. Expert in helping clients achieve financial goals through personalized strategies and comprehensive planning.",
    expertise: ["Finance", "Investment", "Wealth Management"],
    credentials: ["CFA", "CFP"],
    profileImageUrl: null,
    hourlyRate: "1250",
    totalEarnings: "250000",
    averageRating: "4.9",
    totalSessions: 347,
    isVerified: 1,
    languages: ["English", "Hindi"],
    isActive: 1,
    timezone: "Asia/Kolkata",
    socialLinks: {
      linkedin: "https://linkedin.com/in/rajeshkumar",
      twitter: "https://twitter.com/rajeshkumar",
      youtube: "https://youtube.com/@rajeshkumar",
      website: "https://rajeshkumar.com"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const youtubeVideos = [
    {
      id: "1",
      videoId: "dQw4w9WgXcQ",
      title: "Top 5 Investment Strategies for Beginners in 2024",
      duration: "12:34",
      views: "25K views",
      publishedAt: "3 days ago",
      likes: "1.2K"
    },
    {
      id: "2", 
      videoId: "jNQXAC9IVRw",
      title: "How to Build Wealth in Your 20s - Complete Guide",
      duration: "18:22",
      views: "43K views",
      publishedAt: "1 week ago",
      likes: "2.1K"
    },
    {
      id: "3",
      videoId: "9bZkp7q19f0",
      title: "Tax Planning Masterclass 2024 - Save Lakhs in Taxes",
      duration: "25:15",
      views: "31K views", 
      publishedAt: "2 weeks ago",
      likes: "1.8K"
    },
    {
      id: "4",
      videoId: "6h3RJhoqgK8",
      title: "Mutual Funds vs Direct Stocks - Which is Better?",
      duration: "14:45",
      views: "18K views",
      publishedAt: "3 weeks ago",
      likes: "920"
    }
  ];

  const socialLinksData = mockCreator.socialLinks as Record<string, string> | null;
  const socialLinks = [
    { platform: "LinkedIn", url: socialLinksData?.linkedin || "#", icon: "💼", color: "bg-white/10" },
    { platform: "Twitter", url: socialLinksData?.twitter || "#", icon: "🐦", color: "bg-sky-500" },
    { platform: "YouTube", url: socialLinksData?.youtube || "#", icon: "📺", color: "bg-white/10" },
    { platform: "Website", url: socialLinksData?.website || "#", icon: "🌐", color: "bg-gray-700" }
  ];

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Modern Header */}
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 pt-8 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-none -translate-y-16 translate-x-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-none translate-y-12 -translate-x-12 blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/creator-connect")}
              variant="ghost"
              size="sm"
              className="text-white p-2 hover:bg-white/20 rounded-none transition-colors"
              data-testid="button-back-creators"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg uppercase tracking-wider">Expert Profile</h2>
              <p className="text-white/60 text-xs uppercase tracking-widest">Professional consultation & guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Profile Hero */}
      <div className="px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-none -translate-y-16 translate-x-16 blur-2xl"></div>
          
          <div className="relative z-10">
            {/* Expert Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-light text-white uppercase tracking-widest">Expert Profile</h2>
                <p className="text-xs text-white/60">Verified professional advisor</p>
              </div>
              <div className="flex items-center gap-2">
                {mockCreator.isVerified === 1 && (
                  <div className="bg-white/10 text-white/80 border border-white/20 text-xs px-3 py-1 rounded-none flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                )}
                <div className="bg-white/10 text-white/80 border border-white/20/30 text-xs px-3 py-1 rounded-none flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {mockCreator.averageRating}
                </div>
              </div>
            </div>
            
            {/* Expert Card */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-4 ring-red-200 shadow-lg">
                  <AvatarImage src={mockCreator.profileImageUrl || undefined} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-white/10 to-white/5 text-white font-bold text-2xl">
                    {mockCreator.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/10 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{mockCreator.displayName}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.isArray(mockCreator.expertise) && mockCreator.expertise.slice(0, 2).map((skill: string, index: number) => (
                    <span key={index} className="bg-white/5 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {mockCreator.totalSessions} sessions
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ₹{parseInt(mockCreator.hourlyRate || "0").toLocaleString()}/hr
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {Array.isArray(mockCreator.languages) ? mockCreator.languages.join(", ") : "English"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mt-4 p-4 bg-white/60 rounded-xl border border-gray-200/50">
              <p className="text-sm text-white/80 leading-relaxed">
                {mockCreator.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Expert Performance Metrics - Similar to Credit Health Dashboard */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <p className="text-xs text-white/60">Expert Rating</p>
                <p className="text-sm font-bold text-white">{mockCreator.averageRating}/5.0</p>
              </div>
            </div>
            <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-full w-fit">
              Excellent
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <p className="text-xs text-white/60">Total Sessions</p>
                <p className="text-sm font-bold text-white">{mockCreator.totalSessions}</p>
              </div>
            </div>
            <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-full w-fit">
              Experienced
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <p className="text-xs text-white/60">Hourly Rate</p>
                <p className="text-sm font-bold text-white">₹{parseInt(mockCreator.hourlyRate || "0").toLocaleString()}</p>
              </div>
            </div>
            <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-full w-fit">
              Premium
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white/80" />
              </div>
              <div>
                <p className="text-xs text-white/60">Success Rate</p>
                <p className="text-sm font-bold text-white">96%</p>
              </div>
            </div>
            <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-full w-fit">
              Outstanding
            </div>
          </div>
        </div>

        {/* Professional Details - Similar to CIBIL Analytics */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-none">
          <h3 className="text-sm font-bold mb-3 text-white flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Professional Background
          </h3>
          <div className="space-y-4">
            {/* Expertise */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/80">Areas of Expertise</span>
                <span className="text-xs text-gray-500">{Array.isArray(mockCreator.expertise) ? mockCreator.expertise.length : 0} specializations</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(mockCreator.expertise) && mockCreator.expertise.map((skill: string, index: number) => (
                  <span key={index} className="bg-gradient-to-r from-red-50 to-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Credentials */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/80">Professional Credentials</span>
                <span className="text-xs text-white/80 bg-white/5 px-2 py-0.5 rounded-full">Verified</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(mockCreator.credentials) && mockCreator.credentials.map((cred: string, index: number) => (
                  <span key={index} className="bg-gradient-to-r from-white/5 to-white/5 text-white/80 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20/50 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {cred}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white/80">Languages</span>
                <span className="text-xs text-white/80 bg-white/5 px-2 py-0.5 rounded-full">Multilingual</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(mockCreator.languages) && mockCreator.languages.map((lang: string, index: number) => (
                  <span key={index} className="bg-gradient-to-r from-red-50 to-pink-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20/50">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Connect & Follow - Modern Design */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-none">
          <h3 className="text-sm font-bold mb-3 text-white flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Connect & Follow
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-red-50 hover:border-red-300 transition-all duration-300"
                data-testid={`button-social-${link.platform.toLowerCase()}`}
              >
                <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center text-white text-sm shadow-sm`}>
                  {link.icon}
                </div>
                <span className="font-medium text-white/80 text-xs">{link.platform}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Latest Content & Resources */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-none">
          <h3 className="text-sm font-bold mb-3 text-white flex items-center gap-2">
            <Play className="h-4 w-4" />
            Latest Educational Content
          </h3>
          <div className="space-y-2">
            {youtubeVideos.slice(0, 3).map((video) => (
              <a 
                key={video.id}
                href={`https://youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-300 transition-all duration-300"
                data-testid={`video-${video.id}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs line-clamp-1">{video.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {video.likes}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-white/80 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Book Session - Modern CTA */}
        <div className="bg-gradient-to-br from-red-50 via-red-50 to-red-100 rounded-2xl p-6 border border-white/20/50 shadow-lg mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Book Expert Session</h3>
            <p className="text-white/60 text-sm mb-4">Get personalized guidance from {mockCreator.displayName}</p>
            
            <div className="bg-white/70 backdrop-blur rounded-xl p-4 mb-4 border border-white/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Session Rate:</span>
                <span className="font-bold text-gray-900">₹{parseInt(mockCreator.hourlyRate || "0").toLocaleString()}/hour</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-white/60">Response Time:</span>
                <span className="text-white/80 font-medium">Within 2 hours</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-book-session"
            >
              <Calendar className="h-5 w-5 mr-3" />
              Book Session Now
            </Button>
            
            <p className="text-xs text-gray-500 mt-3">Secure payment • Instant confirmation • 24/7 support</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}