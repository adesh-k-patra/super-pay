import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Search,
  TrendingUp,
  Music,
  Trophy,
  Theater,
  ArrowRight,
  Star,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { TicketHeader } from "@/components/ui/ticket-header";

export default function EventSearch() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [eventFilter, setEventFilter] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams({
      query: searchQuery,
      category,
      city,
      date: format(date, "yyyy-MM-dd")
    });
    navigate(`/booking/event/results?${params.toString()}`);
  };

  const featuredEvents = [
    { 
      id: "1",
      name: "Arijit Singh Live Concert", 
      category: "Music", 
      city: "Mumbai", 
      icon: Music,
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
      rating: "4.8",
      price: 1999,
      date: "Oct 15, 2025",
      trending: true,
      eventDate: "2025-10-15"
    },
    { 
      id: "2",
      name: "IPL Finals 2025", 
      category: "Sports", 
      city: "Mumbai", 
      icon: Trophy,
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop",
      rating: "4.9",
      price: 2499,
      date: "Oct 20, 2025",
      trending: true,
      eventDate: "2025-10-20"
    },
    { 
      id: "3",
      name: "Stand-up Comedy Night", 
      category: "Comedy", 
      city: "Bangalore", 
      icon: Theater,
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&h=400&fit=crop",
      rating: "4.6",
      price: 799,
      date: "Oct 25, 2025",
      trending: false,
      eventDate: "2025-10-25"
    },
    { 
      id: "4",
      name: "Tech Conference 2025", 
      category: "Conference", 
      city: "Bangalore", 
      icon: Theater,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      rating: "4.7",
      price: 3999,
      date: "Nov 5, 2025",
      trending: true,
      eventDate: "2025-11-05"
    },
    { 
      id: "5",
      name: "Food & Music Carnival", 
      category: "Music", 
      city: "Delhi", 
      icon: Music,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop",
      rating: "4.5",
      price: 599,
      date: "Nov 10, 2025",
      trending: false,
      eventDate: "2025-11-10"
    },
    { 
      id: "6",
      name: "Theatre Play - Hamlet", 
      category: "Theatre", 
      city: "Mumbai", 
      icon: Theater,
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=400&fit=crop",
      rating: "4.4",
      price: 899,
      date: "Nov 15, 2025",
      trending: true,
      eventDate: "2025-11-15"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

      <TicketHeader 
        title="EVENT BOOKING" 
        subtitle="Find your experience"
        backPath="/pro-tools"
        ticketsPath="/all-tickets?type=events&status=all"
        ticketIcon={<Calendar className="h-5 w-5" />}
      />

      {/* Main Content */}
      <div className="pt-24 px-4 pb-24 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Search Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Search Input */}
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Event Name or Artist</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                    data-testid="input-search-event"
                  />
                </div>
              </div>

              {/* Category & City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white h-12" data-testid="select-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/20">
                      <SelectItem value="music" className="text-white">Music</SelectItem>
                      <SelectItem value="sports" className="text-white">Sports</SelectItem>
                      <SelectItem value="comedy" className="text-white">Comedy</SelectItem>
                      <SelectItem value="theater" className="text-white">Theater</SelectItem>
                      <SelectItem value="conference" className="text-white">Conference</SelectItem>
                      <SelectItem value="fitness" className="text-white">Fitness</SelectItem>
                      <SelectItem value="tech" className="text-white">Tech</SelectItem>
                      <SelectItem value="fashion" className="text-white">Fashion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white h-12" data-testid="select-city">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/20">
                      <SelectItem value="delhi" className="text-white">Delhi</SelectItem>
                      <SelectItem value="mumbai" className="text-white">Mumbai</SelectItem>
                      <SelectItem value="bangalore" className="text-white">Bangalore</SelectItem>
                      <SelectItem value="hyderabad" className="text-white">Hyderabad</SelectItem>
                      <SelectItem value="chennai" className="text-white">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date */}
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      className="w-full bg-transparent border-b border-white/20 rounded-none text-white h-12 flex items-center justify-start cursor-pointer hover:border-white/40 transition-colors"
                      data-testid="button-date-picker"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.currentTarget.click();
                        }
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/20">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none text-sm uppercase tracking-wider"
                data-testid="button-search-events"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Events
              </Button>
            </div>
          </div>

          {/* Featured Events with Tabs */}
          <div className="space-y-4">
            <Tabs value={eventFilter} onValueChange={setEventFilter} className="w-full">
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid="tab-all-events"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid="tab-trending-events"
                >
                  TRENDING
                </TabsTrigger>
                <TabsTrigger 
                  value="latest" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid="tab-latest-events"
                >
                  LATEST
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              {featuredEvents
                .filter(event => {
                  if (eventFilter === "trending") return event.trending;
                  if (eventFilter === "latest") {
                    const sortedByDate = [...featuredEvents].sort((a, b) => 
                      new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
                    );
                    return sortedByDate.slice(0, 6).includes(event);
                  }
                  return true;
                })
                .slice(0, 6)
                .map((event) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/event-detail/${event.id}`)}
                    className="group cursor-pointer"
                    data-testid={`card-event-${event.id}`}
                  >
                    <div className="relative overflow-hidden border border-white/20 hover:border-white/40 transition-all">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 border border-white/20">
                        <div className="flex items-center gap-1 text-xs text-white">
                          <Star className="h-3 w-3 fill-white" />
                          {event.rating}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                        <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
                          <Icon className="h-3 w-3" />
                          <span>{event.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <h3 className="text-sm font-light text-white line-clamp-1">{event.name}</h3>
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.city}</span>
                        </div>
                        <span className="font-medium text-white">₹{event.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
