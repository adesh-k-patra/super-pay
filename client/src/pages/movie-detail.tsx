import { useState, useEffect } from "react";
import { useParams, useLocation as useWouterLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Play,
  Calendar,
  Clock,
  Globe,
  Film,
  ChevronRight,
  User,
  Sparkles,
  Image as ImageIcon,
  Video,
  ThumbsUp,
  MessageSquare,
  Trash2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl?: string;
  language: string;
  genre: string[];
  duration: number;
  rating: string;
  imdbRating: string;
  releaseDate: Date;
  cast?: { name: string; role: string; image?: string }[];
  crew?: { name: string; role: string }[];
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  verified: boolean;
  isCurrentUser?: boolean;
}

const mockPosters = [
  { id: 1, url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600", type: "poster" },
  { id: 2, url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600", type: "poster" },
  { id: 3, url: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&h=400", type: "banner" },
  { id: 4, url: "https://images.unsplash.com/photo-1574267432644-f0e86b1b82bb?w=800&h=400", type: "banner" }
];

const mockTrailers = [
  { 
    id: 1, 
    title: "Official Trailer", 
    thumbnail: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400", 
    duration: "2:45",
    views: "12M"
  },
  { 
    id: 2, 
    title: "Teaser", 
    thumbnail: "https://images.unsplash.com/photo-1574267432644-f0e86b1b82bb?w=400", 
    duration: "1:30",
    views: "8M"
  },
  { 
    id: 3, 
    title: "Behind The Scenes", 
    thumbnail: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400", 
    duration: "5:12",
    views: "3M"
  },
  { 
    id: 4, 
    title: "Making Video", 
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400", 
    duration: "8:20",
    views: "2M"
  }
];

const mockReviews: Review[] = [
  { 
    id: "1", 
    user: "Rajesh Kumar", 
    rating: 4.5, 
    comment: "Outstanding performance! Shah Rukh Khan delivers one of his career-best performances. The action sequences are jaw-dropping and the emotional moments hit hard.", 
    date: "2024-12-20",
    likes: 234,
    verified: true
  },
  { 
    id: "2", 
    user: "Priya Sharma", 
    rating: 5, 
    comment: "Absolute masterpiece! Atlee has crafted a brilliant social drama wrapped in a commercial entertainer. Must watch for every cinema lover.", 
    date: "2024-12-19",
    likes: 456,
    verified: true
  },
  { 
    id: "3", 
    user: "Amit Patel", 
    rating: 4, 
    comment: "Great story with powerful message. The supporting cast is excellent and Vijay Sethupathi is menacing as the villain.", 
    date: "2024-12-18",
    likes: 189,
    verified: false
  }
];

export default function MovieDetail() {
  const { id } = useParams();
  const [, navigate] = useWouterLocation();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("about");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  const { data: movieData, isLoading } = useQuery<{ success: boolean; movie: Movie }>({
    queryKey: ["/api/movies", id],
  });

  const movie = movieData?.movie;

  // Load reviews from localStorage on mount
  useEffect(() => {
    if (id) {
      const savedReviews = localStorage.getItem(`reviews_${id}`);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        // Initialize with mock reviews
        setReviews(mockReviews);
      }

      // Load liked reviews
      const savedLikedReviews = localStorage.getItem(`liked_reviews_${id}`);
      if (savedLikedReviews) {
        setLikedReviews(new Set(JSON.parse(savedLikedReviews)));
      }
    }
  }, [id]);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (id && reviews.length > 0) {
      localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id]);

  // Save liked reviews to localStorage
  useEffect(() => {
    if (id && likedReviews.size > 0) {
      localStorage.setItem(`liked_reviews_${id}`, JSON.stringify(Array.from(likedReviews)));
    }
  }, [likedReviews, id]);

  const handleAddReview = () => {
    if (!newReviewComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment for your review",
        variant: "destructive"
      });
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      user: "You",
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString(),
      likes: 0,
      verified: false,
      isCurrentUser: true
    };

    setReviews([newReview, ...reviews]);
    setNewReviewComment("");
    setNewReviewRating(5);
    setIsReviewDialogOpen(false);
    
    toast({
      title: "Review Posted",
      description: "Your review has been added successfully"
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
    toast({
      title: "Review Deleted",
      description: "Your review has been removed"
    });
  };

  const handleLikeReview = (reviewId: string) => {
    const isLiked = likedReviews.has(reviewId);
    
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          likes: isLiked ? review.likes - 1 : review.likes + 1
        };
      }
      return review;
    }));

    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60 font-light tracking-wider">Loading Movie Details...</p>
        </div>
      </div>
    );
  }

  const releaseYear = new Date(movie.releaseDate).getFullYear();
  const formattedReleaseDate = format(new Date(movie.releaseDate), "MMMM dd, yyyy");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Banner */}
      <div className="relative h-[60vh] md:h-[70vh]">
        {/* Background Banner */}
        <div className="absolute inset-0">
          <img 
            src={movie.bannerUrl || movie.posterUrl} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="flex items-center justify-between p-4 md:p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/booking/movie/search")}
              className="rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/20"
                data-testid="button-favorite"
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: movie.title,
                      text: `Check out ${movie.title} - ${movie.description.substring(0, 100)}...`,
                      url: window.location.href
                    });
                  }
                }}
                className="rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/20"
                data-testid="button-share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {/* Poster */}
              <div className="w-40 md:w-52 flex-shrink-0">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded-lg border-2 border-white/20 shadow-2xl"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 rounded-md px-3 py-1">
                    {movie.rating}
                  </Badge>
                  <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20 rounded-md px-3 py-1">
                    {releaseYear}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight" data-testid="text-movie-title">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{movie.imdbRating}</span>
                    <span className="text-white/60">/10 IMDb</span>
                  </div>
                  <div className="h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-white/80" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-white/80" />
                    <span>{formattedReleaseDate}</span>
                  </div>
                  <div className="h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-white/80" />
                    <span>{movie.language}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-6">
                  {movie.genre?.map((g, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 rounded-full px-4 py-1.5 hover:bg-white/20 transition-all cursor-pointer"
                    >
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-4">
                  {movie.trailerUrl && (
                    <Button
                      variant="outline"
                      className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 rounded-full px-8 py-6 text-base"
                      data-testid="button-watch-trailer"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Trailer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none h-auto p-0 justify-start gap-6 mb-6">
            <TabsTrigger 
              value="about" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 hover:text-white transition-all pb-3 text-sm font-medium"
              data-testid="tab-about"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="cast" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 hover:text-white transition-all pb-3 text-sm font-medium"
              data-testid="tab-cast"
            >
              Cast & Crew
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 hover:text-white transition-all pb-3 text-sm font-medium"
              data-testid="tab-gallery"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 hover:text-white transition-all pb-3 text-sm font-medium"
              data-testid="tab-reviews"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-0">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Synopsis */}
                <div>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    Synopsis
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Release Date</div>
                    <div className="text-base font-medium">{formattedReleaseDate}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Duration</div>
                    <div className="text-base font-medium">{formatDuration(movie.duration)}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Language</div>
                    <div className="text-base font-medium">{movie.language}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Rating</div>
                    <div className="text-base font-medium">{movie.rating}</div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* IMDb Rating Card */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold">{movie.imdbRating}</div>
                      <div className="text-white/60 text-xs">IMDb Rating</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                      style={{ width: `${(parseFloat(movie.imdbRating) / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre?.map((g, idx) => (
                      <Badge 
                        key={idx} 
                        className="bg-white/10 text-white border-white/20 rounded-md px-3 py-1 text-xs hover:bg-white/20 transition-all"
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cast & Crew Tab */}
          <TabsContent value="cast" className="mt-0">
            {movie.cast && movie.cast.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Star Cast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.cast.map((actor, idx) => (
                    <div 
                      key={idx} 
                      className="group cursor-pointer"
                      data-testid={`cast-${idx}`}
                    >
                      <div className="relative mb-2 overflow-hidden rounded-lg aspect-[3/4] bg-white/5 border border-white/10">
                        {actor.image ? (
                          <img 
                            src={actor.image} 
                            alt={actor.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-12 w-12 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors truncate">
                        {actor.name}
                      </h4>
                      <p className="text-xs text-white/60 truncate">{actor.role}</p>
                    </div>
                  ))}
                </div>

                {movie.crew && movie.crew.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Crew</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {movie.crew.map((member, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                          <div className="text-white/50 text-xs mb-1">{member.role}</div>
                          <div className="text-sm font-medium">{member.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No cast information available</p>
              </div>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-0">
            <div className="space-y-8">
              {/* Trailers */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Video className="h-4 w-4 text-red-400" />
                  Trailers & Videos
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mockTrailers.map((trailer) => (
                    <div 
                      key={trailer.id} 
                      className="group cursor-pointer"
                      data-testid={`trailer-${trailer.id}`}
                    >
                      <div className="relative mb-2 overflow-hidden rounded-lg aspect-video bg-black">
                        <img 
                          src={trailer.thumbnail} 
                          alt={trailer.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:bg-white/30 group-hover:scale-110 transition-all">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white border-0 rounded-md text-xs px-2 py-0.5">
                          {trailer.duration}
                        </Badge>
                        <Badge className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white border-0 rounded-md text-xs px-2 py-0.5">
                          {trailer.views} views
                        </Badge>
                      </div>
                      <h4 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors truncate">
                        {trailer.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posters */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-400" />
                  Posters & Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mockPosters.map((poster) => (
                    <div 
                      key={poster.id} 
                      className="group cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5"
                      data-testid={`poster-${poster.id}`}
                    >
                      <img 
                        src={poster.url} 
                        alt={`Poster ${poster.id}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  User Reviews
                </h2>
                <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full text-sm px-4 py-2 h-auto" data-testid="button-write-review">
                      Write Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">Write Your Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm text-white/70 mb-2 block">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setNewReviewRating(rating)}
                              className="transition-all"
                              data-testid={`rating-${rating}`}
                            >
                              <Star
                                className={cn(
                                  "h-6 w-6",
                                  rating <= newReviewRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-white/30"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-white/70 mb-2 block">Your Review</label>
                        <Textarea
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="Share your thoughts about this movie..."
                          className="bg-white/5 border-white/20 text-white min-h-[120px] resize-none"
                          data-testid="textarea-review"
                        />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsReviewDialogOpen(false);
                            setNewReviewComment("");
                            setNewReviewRating(5);
                          }}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddReview}
                          className="bg-white text-black hover:bg-white/90"
                          data-testid="button-submit-review"
                        >
                          Post Review
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                    data-testid={`review-${review.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-base">
                          {review.user[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">{review.user}</h4>
                            {review.verified && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full px-2 py-0 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-white/50">
                            {format(new Date(review.date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-2.5 py-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{review.rating}</span>
                        </div>
                        {review.isCurrentUser && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            data-testid={`button-delete-review-${review.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/70 leading-relaxed mb-3">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <button
                        onClick={() => handleLikeReview(review.id)}
                        className={cn(
                          "flex items-center gap-1.5 hover:text-white transition-colors",
                          likedReviews.has(review.id) && "text-blue-400"
                        )}
                        data-testid={`button-like-review-${review.id}`}
                      >
                        <ThumbsUp className={cn(
                          "h-3.5 w-3.5",
                          likedReviews.has(review.id) && "fill-blue-400"
                        )} />
                        <span>{review.likes} helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Book Now Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => {
              navigate(`/booking/movie/results?movie=${encodeURIComponent(movie.title)}&city=DEL&date=${new Date().toISOString().split('T')[0]}`);
            }}
            className="w-full bg-white text-black hover:bg-white/90 rounded-full h-14 text-base font-semibold"
            data-testid="button-book-now"
          >
            <Film className="mr-2 h-5 w-5" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
