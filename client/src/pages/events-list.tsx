import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { TicketHeader } from "@/components/ui/ticket-header";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Music,
  Trophy,
  Theater,
  Palette,
  Filter,
  Map,
  List,
  Bell,
  Star,
  TrendingUp,
  Heart,
  Users,
  PartyPopper,
  Mic2,
  Film,
  Sparkles,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";

interface Event {
  id: string;
  title: string;
  category: string;
  image: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  price: number;
  rating: number;
  attendees: number;
  isTrending: boolean;
  tags: string[];
}

export default function EventsList() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = [
    { id: "all", name: "All Events", icon: List },
    { id: "concerts", name: "Music Concerts", icon: Music },
    { id: "sports", name: "Match Tickets", icon: Trophy },
    { id: "gala", name: "Gala Events", icon: Crown },
    { id: "shows", name: "Shows", icon: Mic2 },
    { id: "theater", name: "Plays & Theater", icon: Theater },
    { id: "exhibitions", name: "Exhibitions", icon: Palette },
    { id: "health", name: "Health", icon: Heart },
    { id: "tech", name: "Tech Events", icon: Sparkles },
    { id: "conferences", name: "Conferences", icon: Users },
    { id: "fashion", name: "Fashion", icon: PartyPopper },
    { id: "others", name: "Others", icon: Film },
  ];

  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Arijit Singh Live in Concert",
      category: "concerts",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      venue: "DY Patil Stadium",
      city: "Mumbai",
      date: "2025-10-15",
      time: "19:00",
      price: 1999,
      rating: 4.8,
      attendees: 15000,
      isTrending: true,
      tags: ["Bollywood", "Live Music", "Popular"]
    },
    {
      id: "2",
      title: "IPL Finals 2025",
      category: "sports",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      venue: "Wankhede Stadium",
      city: "Mumbai",
      date: "2025-10-20",
      time: "15:00",
      price: 2499,
      rating: 4.9,
      attendees: 33000,
      isTrending: true,
      tags: ["Cricket", "IPL", "Finals"]
    },
    {
      id: "3",
      title: "Hamilton - The Musical",
      category: "theater",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
      venue: "NCPA Theatre",
      city: "Mumbai",
      date: "2025-10-18",
      time: "20:00",
      price: 3499,
      rating: 4.7,
      attendees: 800,
      isTrending: false,
      tags: ["Broadway", "Musical", "Drama"]
    },
    {
      id: "4",
      title: "India Art Fair 2025",
      category: "exhibitions",
      image: "https://images.unsplash.com/photo-1531243826780-b6a6c3e0f2d6?w=800",
      venue: "NSCI Dome",
      city: "Mumbai",
      date: "2025-10-25",
      time: "10:00",
      price: 499,
      rating: 4.5,
      attendees: 5000,
      isTrending: false,
      tags: ["Art", "Contemporary", "Exhibition"]
    },
    {
      id: "5",
      title: "Charity Gala Night 2025",
      category: "gala",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da1e318?w=800",
      venue: "Taj Palace Hotel",
      city: "Mumbai",
      date: "2025-10-22",
      time: "18:00",
      price: 5999,
      rating: 4.9,
      attendees: 500,
      isTrending: true,
      tags: ["Charity", "Luxury", "Networking"]
    },
    {
      id: "6",
      title: "DJ Night with Martin Garrix",
      category: "concerts",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      venue: "Phoenix Marketcity",
      city: "Bangalore",
      date: "2025-10-28",
      time: "21:00",
      price: 2999,
      rating: 4.8,
      attendees: 8000,
      isTrending: true,
      tags: ["EDM", "DJ", "Party"]
    },
    {
      id: "7",
      title: "Stand-Up Comedy Special",
      category: "shows",
      image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
      venue: "Comedy Store",
      city: "Delhi",
      date: "2025-10-17",
      time: "20:00",
      price: 799,
      rating: 4.6,
      attendees: 300,
      isTrending: false,
      tags: ["Comedy", "Entertainment", "Laughter"]
    },
    {
      id: "8",
      title: "Food & Wine Festival",
      category: "others",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      venue: "Bombay Exhibition Centre",
      city: "Mumbai",
      date: "2025-10-30",
      time: "12:00",
      price: 1299,
      rating: 4.5,
      attendees: 3000,
      isTrending: false,
      tags: ["Food", "Wine", "Festival"]
    },
    {
      id: "9",
      title: "India vs Australia Test Match",
      category: "sports",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
      venue: "Eden Gardens",
      city: "Kolkata",
      date: "2025-11-05",
      time: "09:30",
      price: 1499,
      rating: 4.8,
      attendees: 45000,
      isTrending: true,
      tags: ["Cricket", "Test Match", "International"]
    },
    {
      id: "10",
      title: "Magic Show Extravaganza",
      category: "shows",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
      venue: "Shanmukhananda Hall",
      city: "Mumbai",
      date: "2025-10-21",
      time: "18:00",
      price: 599,
      rating: 4.4,
      attendees: 600,
      isTrending: false,
      tags: ["Magic", "Family", "Entertainment"]
    }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pagination = usePagination({
    data: filteredEvents,
    itemsPerPage: 12,
  });

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <TicketHeader 
        title="DISCOVER EVENTS" 
        subtitle="Find & book amazing events"
        backPath="/travel-booking"
        ticketsPath="/all-tickets"
        ticketIcon={<Calendar className="h-5 w-5" />}
      />
      
      {/* Header Filters */}
      <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 pb-4">
        <div className="p-4">
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              type="text"
              placeholder="Search events, venues, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-none"
              data-testid="input-search"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-8 rounded-none",
                  viewMode === "list" ? "bg-white/10 text-white" : "bg-white/5 text-white border-white/20"
                )}
                data-testid="button-list-view"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={cn(
                  "h-8 rounded-none",
                  viewMode === "map" ? "bg-white/10 text-white" : "bg-white/5 text-white border-white/20"
                )}
                data-testid="button-map-view"
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
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

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex-shrink-0 h-9 rounded-none",
                    selectedCategory === cat.id
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                  )}
                  data-testid={`category-${cat.id}`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List/Map */}
      <div className="p-4 space-y-4">
        {viewMode === "list" ? (
          <>
            {/* Trending Carousel */}
            {filteredEvents.some(e => e.isTrending) && (
              <div className="mb-6">
                <h2 className="text-lg font-light tracking-wider uppercase mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-white/60" />
                  Trending Now
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {filteredEvents.filter(e => e.isTrending).map((event) => (
                    <Card
                      key={event.id}
                      className="flex-shrink-0 w-72 bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all rounded-none"
                      onClick={() => navigate(`/events/${event.id}`)}
                      data-testid={`trending-event-${event.id}`}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-white/10 text-white border-0 rounded-none backdrop-blur-sm">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-light tracking-wider text-white mb-2 line-clamp-1">{event.title}</h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-white/60 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.venue}, {event.city}
                          </p>
                          <p className="text-white/60 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(event.date)}
                          </p>
                          <p className="text-white/80 font-light">From {formatPrice(event.price)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Events */}
            <h2 className="text-lg font-light tracking-wider uppercase mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-white/60" />
              All Events ({filteredEvents.length})
            </h2>
            {pagination.paginatedData.map((event) => (
              <Card
                key={event.id}
                className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all rounded-none"
                onClick={() => navigate(`/events/${event.id}`)}
                data-testid={`event-card-${event.id}`}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-light tracking-wider text-white text-lg line-clamp-1">{event.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 rounded-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event.id);
                        }}
                        data-testid={`button-favorite-${event.id}`}
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5",
                            favorites.has(event.id) ? "fill-white text-white/80" : "text-white/60"
                          )}
                        />
                      </Button>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-white/60 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.venue}, {event.city}
                      </p>
                      <p className="text-white/60 text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.date)} • {event.time}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-white/80 fill-white" />
                          <span className="text-sm text-white">{event.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <Users className="h-4 w-4" />
                          {event.attendees.toLocaleString()}+
                        </div>
                      </div>
                      <p className="text-white/80 font-light">From {formatPrice(event.price)}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {event.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} className="bg-white/10 text-white/60 border-white/20 text-xs rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 font-light">No events found</p>
              </div>
            )}
          </>
        ) : (
          <div className="h-[500px] bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 font-light">Map view coming soon</p>
            </div>
          </div>
        )}

        {filteredEvents.length > 0 && (
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

      <BottomNavigation />
    </div>
  );
}
