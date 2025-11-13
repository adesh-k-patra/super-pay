import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketHeader } from "@/components/ui/ticket-header";
import {
  Film,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const popularMovies = [
  { id: "pathaan", name: "Pathaan", genre: "Action, Thriller", rating: "4.5", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop", trending: true, releaseDate: "2024-10-15" },
  { id: "jawan", name: "Jawan", genre: "Action, Thriller", rating: "4.8", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop", trending: true, releaseDate: "2024-11-01" },
  { id: "animal", name: "Animal", genre: "Action, Drama", rating: "4.2", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop", trending: false, releaseDate: "2024-09-10" },
  { id: "tiger3", name: "Tiger 3", genre: "Action, Thriller", rating: "4.3", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop", trending: true, releaseDate: "2024-10-20" },
  { id: "sam-bahadur", name: "Sam Bahadur", genre: "Biography, Drama", rating: "4.6", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop", trending: false, releaseDate: "2024-08-05" },
  { id: "12th-fail", name: "12th Fail", genre: "Drama, Biography", rating: "4.9", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop", trending: false, releaseDate: "2024-07-22" },
  { id: "dunki", name: "Dunki", genre: "Comedy, Drama", rating: "4.4", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop", trending: true, releaseDate: "2024-11-10" },
  { id: "salaar", name: "Salaar", genre: "Action, Thriller", rating: "4.5", image: "https://images.unsplash.com/photo-1574267432644-f610f5b88a71?w=400&h=600&fit=crop", trending: false, releaseDate: "2024-09-28" },
];

const popularCities = [
  { code: "DEL", name: "Delhi" },
  { code: "BOM", name: "Mumbai" },
  { code: "BLR", name: "Bangalore" },
  { code: "HYD", name: "Hyderabad" },
  { code: "CHN", name: "Chennai" },
  { code: "KOL", name: "Kolkata" },
  { code: "PUN", name: "Pune" },
  { code: "AMD", name: "Ahmedabad" },
];

export default function MovieSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [selectedMovie, setSelectedMovie] = useState("");
  const [movieSearch, setMovieSearch] = useState("");
  const [showMoviePopover, setShowMoviePopover] = useState(false);
  
  const [selectedCity, setSelectedCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showCityPopover, setShowCityPopover] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showPassengers, setShowPassengers] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [showTime, setShowTime] = useState("any");
  const [movieFilter, setMovieFilter] = useState("all");

  const filteredMovies = popularMovies.filter(movie =>
    movie.name.toLowerCase().includes(movieSearch.toLowerCase()) ||
    movie.genre.toLowerCase().includes(movieSearch.toLowerCase())
  );

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    city.code.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSearch = () => {
    if (!selectedMovie) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a movie",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCity) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a city",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams({
      movie: selectedMovie,
      city: selectedCity,
      date: format(selectedDate, "yyyy-MM-dd"),
      tickets: tickets.toString(),
      showTime
    });

    navigate(`/booking/movie/results?${params.toString()}`);
  };

  const selectedMovieData = popularMovies.find(m => m.id === selectedMovie);
  const selectedCityData = popularCities.find(c => c.code === selectedCity);

  return (
    <>
      <TicketHeader 
        title="BOOK MOVIES" 
        subtitle="Search & book your show"
        backPath="/home"
        ticketsPath="/all-tickets?type=movie&status=all"
        ticketIcon={<Film className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
          {/* Movie Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Film className="h-3 w-3" />
              SELECT MOVIE
            </Label>
            <Popover open={showMoviePopover} onOpenChange={setShowMoviePopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                    !selectedMovie && "text-white/50"
                  )}
                  data-testid="button-movie"
                >
                  {selectedMovieData ? (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-light">{selectedMovieData.name}</span>
                        <span className="text-xs text-white/60">★ {selectedMovieData.rating}</span>
                      </div>
                      <span className="text-xs text-white/40 font-light truncate w-full">{selectedMovieData.genre}</span>
                    </div>
                  ) : (
                    <span className="font-light">Select a movie</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search movies..."
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                    data-testid="input-movie-search"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredMovies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        setSelectedMovie(movie.id);
                        setMovieSearch("");
                        setShowMoviePopover(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                      data-testid={`option-movie-${movie.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-light text-white">{movie.name}</div>
                          <div className="text-xs text-white/60 font-light">{movie.genre}</div>
                        </div>
                        <div className="text-sm font-light text-white/80">★ {movie.rating}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              CITY
            </Label>
            <Popover open={showCityPopover} onOpenChange={setShowCityPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                    !selectedCity && "text-white/50"
                  )}
                  data-testid="button-city"
                >
                  {selectedCityData ? (
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-light">{selectedCityData.code}</span>
                        <span className="text-xs text-white/60">{selectedCityData.name}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="font-light">Select city</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                    data-testid="input-city-search"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city.code}
                      onClick={() => {
                        setSelectedCity(city.code);
                        setCitySearch("");
                        setShowCityPopover(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                      data-testid={`option-city-${city.code}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-light text-white">{city.name}</div>
                        </div>
                        <div className="text-lg font-light text-white/80">{city.code}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                DATE
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light",
                      !selectedDate && "text-white/50"
                    )}
                    data-testid="button-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "EEE, dd MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Show Time Preference */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Clock className="h-3 w-3" />
                SHOW TIME
              </Label>
              <Select value={showTime} onValueChange={setShowTime}>
                <SelectTrigger
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-0 font-light focus:border-white"
                  data-testid="select-showtime"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="any" className="text-white hover:bg-white/10" data-testid="option-showtime-any">Any Time</SelectItem>
                  <SelectItem value="morning" className="text-white hover:bg-white/10" data-testid="option-showtime-morning">Morning (Before 12 PM)</SelectItem>
                  <SelectItem value="afternoon" className="text-white hover:bg-white/10" data-testid="option-showtime-afternoon">Afternoon (12-4 PM)</SelectItem>
                  <SelectItem value="evening" className="text-white hover:bg-white/10" data-testid="option-showtime-evening">Evening (4-8 PM)</SelectItem>
                  <SelectItem value="night" className="text-white hover:bg-white/10" data-testid="option-showtime-night">Night (After 8 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Users className="h-3 w-3" />
              TICKETS
            </Label>
            <Popover open={showPassengers} onOpenChange={setShowPassengers}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light"
                  data-testid="button-tickets"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {tickets} Ticket{tickets !== 1 ? 's' : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-white/20 p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white font-light">Number of Tickets</div>
                      <div className="text-xs text-white/60 font-light">Maximum 10 tickets</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                        disabled={tickets <= 1}
                        className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                        data-testid="button-tickets-decrease"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-light" data-testid="text-tickets-count">{tickets}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTickets(Math.min(10, tickets + 1))}
                        disabled={tickets >= 10}
                        className="h-8 w-8 p-0 rounded-none bg-white/5 border-white/20"
                        data-testid="button-tickets-increase"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowPassengers(false)}
                    className="w-full bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-tickets-done"
                  >
                    DONE
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Movies Section with Tabs */}
          <div className="space-y-4">
            <Tabs value={movieFilter} onValueChange={setMovieFilter} className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10 rounded-none p-1 grid grid-cols-3">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/60 rounded-none tracking-wider font-light text-xs"
                  data-testid="tab-all-movies"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/60 rounded-none tracking-wider font-light text-xs"
                  data-testid="tab-trending-movies"
                >
                  TRENDING
                </TabsTrigger>
                <TabsTrigger 
                  value="latest" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-white/60 rounded-none tracking-wider font-light text-xs"
                  data-testid="tab-latest-movies"
                >
                  LATEST
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              {popularMovies
                .filter(movie => {
                  if (movieFilter === "trending") return movie.trending;
                  if (movieFilter === "latest") {
                    const sortedByDate = [...popularMovies].sort((a, b) => 
                      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
                    );
                    return sortedByDate.slice(0, 6).includes(movie);
                  }
                  return true;
                })
                .slice(0, 6)
                .map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  className="group cursor-pointer"
                  data-testid={`card-movie-${movie.id}`}
                >
                  <div className="relative overflow-hidden border border-white/20 hover:border-white/40 transition-all">
                    <img 
                      src={movie.image} 
                      alt={movie.name}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 border border-white/20">
                      <div className="flex items-center gap-1 text-xs text-white">
                        <Film className="h-3 w-3" />
                        {movie.rating}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="text-sm font-light text-white truncate">{movie.name}</h3>
                    <p className="text-xs text-white/50 truncate">{movie.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Search Button */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <Button
            onClick={handleSearch}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base tracking-wider font-light"
            data-testid="button-search-movies"
          >
            <Film className="mr-2 h-5 w-5" />
            SEARCH SHOWS
          </Button>
        </div>
      </div>
    </>
  );
}
