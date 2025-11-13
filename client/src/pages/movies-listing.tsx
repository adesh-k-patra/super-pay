import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Clock, Star, Search, ArrowLeft, MapPin, Film, TrendingUp, Popcorn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Movie } from "@shared/schema";

export default function MoviesListing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const { data: moviesData, isLoading, error } = useQuery<{ success: boolean; movies: Movie[] }>({
    queryKey: ["/api/movies"],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const movies = moviesData?.movies || [];
  
  // Filter movies by search, genre, and language
  // Note: City is stored as user preference but not used for filtering since movies
  // aren't city-specific - cities are associated with theaters/showtimes instead
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genreFilter === "all" || movie.genre?.includes(genreFilter);
      const matchesLanguage = languageFilter === "all" || movie.language === languageFilter;
      return matchesSearch && matchesGenre && matchesLanguage;
    });
  }, [movies, searchTerm, genreFilter, languageFilter]);

  const genres = Array.from(new Set(movies.flatMap(m => m.genre || [])));
  const languages = Array.from(new Set(movies.map(m => m.language)));
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"];
  
  // Featured movies for banner (first 3)
  const featuredMovies = filteredMovies.slice(0, 3);

  const pagination = usePagination({
    data: filteredMovies,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/pro-tools")}
                className="rounded-none"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Film className="h-6 w-6" />
                  Book Movies
                </h1>
                <p className="text-sm text-white/60">Book tickets for latest movies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-white/60" />
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-36 rounded-none" data-testid="select-city-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all" data-testid="select-option-city-all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city} data-testid={`select-option-city-${city.toLowerCase()}`}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-none"
                data-testid="input-search-movies"
              />
            </div>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full sm:w-36 rounded-none" data-testid="select-language-filter">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" data-testid="select-option-language-all">All Languages</SelectItem>
                {languages.map(language => (
                  <SelectItem key={language} value={language} data-testid={`select-option-language-${language.toLowerCase()}`}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full sm:w-36 rounded-none" data-testid="select-genre-filter">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" data-testid="select-option-genre-all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre} data-testid={`select-option-genre-${genre.toLowerCase()}`}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Featured Movies Banner */}
        {featuredMovies.length > 0 && !searchTerm && !isLoading && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Now Showing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredMovies.map(movie => (
                <Card
                  key={`featured-${movie.id}`}
                  className="group cursor-pointer overflow-hidden border-white/10 rounded-none hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  data-testid={`card-featured-${movie.id}`}
                >
                  <div className="relative aspect-[16/9] bg-white/5 overflow-hidden">
                    {movie.bannerUrl ? (
                      <img
                        src={movie.bannerUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Popcorn className="h-12 w-12 text-white/60" />
                      </div>
                    )}
                    {movie.imdbRating && (
                      <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 flex items-center gap-1 rounded-none">
                        <Star className="h-3 w-3 fill-white text-white/80" />
                        <span className="text-xs font-bold text-white">{movie.imdbRating}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold text-lg">{movie.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genre?.map(g => (
                        <Badge key={g} variant="secondary" className="rounded-none text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>{movie.language}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {movie.duration} mins
                      </span>
                    </div>
                    <Button
                      className="w-full rounded-none mt-2"
                      data-testid={`button-book-featured-${movie.id}`}
                    >
                      Book Tickets
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Movies Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {searchTerm ? `Search Results (${filteredMovies.length})` : "All Movies"}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-none" />
                  <Skeleton className="h-4 w-3/4 rounded-none" />
                  <Skeleton className="h-3 w-1/2 rounded-none" />
                </div>
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="h-16 w-16 mx-auto text-white/60 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No movies found</h3>
              <p className="text-sm text-white/60">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {pagination.paginatedData.map((movie) => (
                <Card
                  key={movie.id}
                  className="group cursor-pointer overflow-hidden border-white/10 rounded-none hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  data-testid={`card-movie-${movie.id}`}
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-white/5">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-movie-poster-${movie.id}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Popcorn className="h-12 w-12 text-white/60" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-white text-white/80" />
                          <span data-testid={`text-rating-${movie.id}`}>{movie.imdbRating || movie.rating || "N/A"}</span>
                        </div>
                        <Badge variant="secondary" className="rounded-none text-xs">
                          {movie.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3 space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-1" data-testid={`text-movie-title-${movie.id}`}>
                      {movie.title}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-1" data-testid={`text-genre-${movie.id}`}>
                      {movie.genre?.join(", ") || "Drama"}
                    </p>
                    <Button
                      size="sm"
                      className="w-full rounded-none text-xs mt-2"
                      data-testid={`button-book-${movie.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movies/${movie.id}`);
                      }}
                    >
                      Book
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredMovies.length > 0 && !isLoading && (
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
        </div>
      </div>
    </div>
  );
}
