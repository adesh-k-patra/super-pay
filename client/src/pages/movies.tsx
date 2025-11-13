import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { TicketHeader } from "@/components/ui/ticket-header";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  Film,
  Filter,
  TrendingUp,
  Heart,
  Play,
  Sparkles,
  ChevronRight,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import type { Movie } from "@shared/schema";

export default function Movies() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: moviesData, isLoading } = useQuery<{ success: boolean; movies: Movie[] }>({
    queryKey: ["/api/movies"],
  });

  const movies = moviesData?.movies || [];

  const genres = [
    { id: "all", name: "All Movies", icon: Film },
    { id: "Action", name: "Action", icon: Flame },
    { id: "Comedy", name: "Comedy", icon: Sparkles },
    { id: "Drama", name: "Drama", icon: Film },
    { id: "Horror", name: "Horror", icon: Film },
    { id: "Romance", name: "Romance", icon: Heart },
    { id: "Thriller", name: "Thriller", icon: Film },
    { id: "Sci-Fi", name: "Sci-Fi", icon: Film },
  ];

  const filteredMovies = movies.filter(movie => {
    const matchesGenre = selectedGenre === "all" || movie.genre?.includes(selectedGenre);
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const trendingMovies = filteredMovies.filter(movie => movie.imdbRating && parseFloat(movie.imdbRating) >= 8.0).slice(0, 6);
  
  // Pagination for movies
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedMovies,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: filteredMovies,
    itemsPerPage: 10,
  });

  const toggleFavorite = (movieId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleMovieClick = (movieId: string) => {
    const currentDate = format(new Date(), "yyyy-MM-dd");
    navigate(`/booking/movie/${currentDate}/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <TicketHeader 
        title="DISCOVER MOVIES" 
        subtitle="Book tickets for latest movies"
        backPath="/pro-tools"
        ticketsPath="/movie-bookings"
        ticketIcon={<Film className="h-5 w-5" />}
      />
      
      {/* Header Filters */}
      <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 pb-4">
        <div className="p-4">
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-none"
              data-testid="input-search"
            />
          </div>

          {/* Location & Filter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4" />
              <span>{selectedCity}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-white/5 text-white border-white/20 rounded-none"
              data-testid="button-filter"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>

          {/* Genre Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => {
              const Icon = genre.icon;
              return (
                <Button
                  key={genre.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGenre(genre.id)}
                  className={cn(
                    "flex-shrink-0 h-9 rounded-none",
                    selectedGenre === genre.id
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                  )}
                  data-testid={`genre-${genre.id}`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {genre.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="p-4 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-none bg-white/5" />
            ))}
          </div>
        ) : (
          <>
            {/* Trending Section */}
            {trendingMovies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-light tracking-wider uppercase mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-white/60" />
                  Trending Now
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {trendingMovies.map((movie) => (
                    <Card
                      key={movie.id}
                      className="flex-shrink-0 w-48 bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all rounded-none"
                      onClick={() => handleMovieClick(movie.id)}
                      data-testid={`trending-movie-${movie.id}`}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={movie.posterUrl || "/placeholder-poster.jpg"}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-white/10 text-white border-0 rounded-none backdrop-blur-sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-light tracking-wider text-white text-sm line-clamp-1">{movie.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-white/80 fill-white" />
                              <span className="text-xs text-white">{movie.imdbRating}</span>
                            </div>
                            <span className="text-white/60 text-xs">•</span>
                            <span className="text-xs text-white/60">{movie.language}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Now Showing Movies */}
            <h2 className="text-lg font-light tracking-wider uppercase mb-4 flex items-center gap-2">
              <Film className="h-5 w-5 text-white/60" />
              Now Showing ({filteredMovies.length})
            </h2>
            {paginatedMovies.map((movie) => (
              <Card
                key={movie.id}
                className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all rounded-none"
                onClick={() => handleMovieClick(movie.id)}
                data-testid={`movie-card-${movie.id}`}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-28 h-40 flex-shrink-0 overflow-hidden">
                    <img
                      src={movie.posterUrl || "/placeholder-poster.jpg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-light tracking-wider text-white text-lg line-clamp-1">{movie.title}</h3>
                        <Badge className="mt-1 bg-white/10 text-white/60 border-white/20 rounded-none text-xs">
                          {movie.rating}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 rounded-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(movie.id);
                        }}
                        data-testid={`button-favorite-${movie.id}`}
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5",
                            favorites.has(movie.id) ? "fill-white text-white/80" : "text-white/60"
                          )}
                        />
                      </Button>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-white" />
                          <span>{movie.imdbRating} IMDB</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{movie.duration} min</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>{movie.language}</span>
                        {movie.genre && movie.genre.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{movie.genre.slice(0, 2).join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/movies/${movie.id}`);
                        }}
                        className="text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-none p-0 h-auto"
                        data-testid={`button-details-${movie.id}`}
                      >
                        View Details
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovieClick(movie.id);
                        }}
                        className="h-8 rounded-none border-white/20 text-white hover:bg-white/10"
                        data-testid={`button-book-${movie.id}`}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Pagination Controls */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
            />

            {filteredMovies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 font-light">No movies found</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
