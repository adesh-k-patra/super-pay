import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search,
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  TrendingUp,
  Plane,
  Hotel,
  Car,
  Ticket,
  Heart
} from "lucide-react";

interface TripCard {
  id: string;
  name: string;
  country: string;
  duration: string;
  days: number;
  nights: number;
  destinations: string[];
  priceFrom: number;
  rating: number;
  image: string;
  badges: string[];
  keyAttractions: string[];
  inclusions: string[];
  isTrending?: boolean;
}

const COUNTRIES = ["All Packages", "UK", "France", "Italy", "USA", "Asia", "Australia", "UAE"];

const MOCK_TRIPS: TripCard[] = [
  {
    id: "uk-winter-family",
    name: "Family UK Winter",
    country: "UK",
    duration: "8 Days / 7 Nights",
    days: 8,
    nights: 7,
    destinations: ["London", "Glasgow", "Edinburgh"],
    priceFrom: 185000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    badges: ["Family Friendly", "Winter Special"],
    keyAttractions: ["Warner Bros Studio", "Natural History Museum", "Edinburgh Castle"],
    inclusions: ["Flights", "4★ Hotels", "Private Transfers", "Breakfast", "Activity Tickets"],
    isTrending: true
  },
  {
    id: "paris-romance",
    name: "Romantic Paris Getaway",
    country: "France",
    duration: "5 Days / 4 Nights",
    days: 5,
    nights: 4,
    destinations: ["Paris", "Versailles"],
    priceFrom: 125000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    badges: ["Romantic", "Bestseller"],
    keyAttractions: ["Eiffel Tower", "Louvre Museum", "Palace of Versailles"],
    inclusions: ["Flights", "5★ Hotels", "Breakfast", "Seine Cruise"],
    isTrending: true
  },
  {
    id: "italy-food-tour",
    name: "Italian Culinary Journey",
    country: "Italy",
    duration: "7 Days / 6 Nights",
    days: 7,
    nights: 6,
    destinations: ["Rome", "Florence", "Venice"],
    priceFrom: 165000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    badges: ["Food & Wine", "Cultural"],
    keyAttractions: ["Colosseum", "Vatican City", "Grand Canal"],
    inclusions: ["Flights", "4★ Hotels", "Cooking Classes", "Wine Tasting"],
    isTrending: true
  },
  {
    id: "us-west-coast",
    name: "US West Coast Adventure",
    country: "USA",
    duration: "10 Days / 9 Nights",
    days: 10,
    nights: 9,
    destinations: ["Los Angeles", "San Francisco", "Las Vegas"],
    priceFrom: 245000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    badges: ["Adventure", "Popular"],
    keyAttractions: ["Golden Gate Bridge", "Hollywood Sign", "Grand Canyon"],
    inclusions: ["Flights", "4★ Hotels", "Car Rental", "Breakfast"]
  },
  {
    id: "asia-temple-trail",
    name: "Southeast Asia Temple Trail",
    country: "Asia",
    duration: "12 Days / 11 Nights",
    days: 12,
    nights: 11,
    destinations: ["Bangkok", "Siem Reap", "Bali"],
    priceFrom: 95000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80",
    badges: ["Cultural", "Budget Friendly"],
    keyAttractions: ["Angkor Wat", "Grand Palace", "Tanah Lot Temple"],
    inclusions: ["Flights", "3★ Hotels", "Guided Tours", "Breakfast"]
  },
  {
    id: "australia-outback",
    name: "Australian Outback Experience",
    country: "Australia",
    duration: "9 Days / 8 Nights",
    days: 9,
    nights: 8,
    destinations: ["Sydney", "Cairns", "Uluru"],
    priceFrom: 285000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    badges: ["Adventure", "Nature"],
    keyAttractions: ["Great Barrier Reef", "Uluru", "Sydney Opera House"],
    inclusions: ["Flights", "4★ Hotels", "Snorkeling", "Breakfast"]
  },
  {
    id: "uae-luxury",
    name: "Luxury Dubai & Abu Dhabi",
    country: "UAE",
    duration: "6 Days / 5 Nights",
    days: 6,
    nights: 5,
    destinations: ["Dubai", "Abu Dhabi"],
    priceFrom: 145000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    badges: ["Luxury", "Shopping"],
    keyAttractions: ["Burj Khalifa", "Sheikh Zayed Mosque", "Desert Safari"],
    inclusions: ["Flights", "5★ Hotels", "Desert Safari", "Breakfast"]
  },
  {
    id: "scotland-highlands",
    name: "Scottish Highlands Escape",
    country: "UK",
    duration: "6 Days / 5 Nights",
    days: 6,
    nights: 5,
    destinations: ["Edinburgh", "Inverness", "Isle of Skye"],
    priceFrom: 155000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1551980702-3cd5d7c0ce4d?w=800&q=80",
    badges: ["Nature", "Scenic"],
    keyAttractions: ["Edinburgh Castle", "Loch Ness", "Fairy Pools"],
    inclusions: ["Flights", "3★ Hotels", "Car Rental", "Breakfast"]
  }
];

const WISHLIST_STORAGE_KEY = 'trip-wishlist';

export default function TripNow() {
  const [, navigate] = useLocation();
  const [selectedCountry, setSelectedCountry] = useState("All Packages");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        setWishlistIds(new Set(items.map((item: any) => item.id)));
      } catch (e) {
        console.error('Failed to parse trip wishlist', e);
      }
    }
  }, []);

  const filteredTrips = MOCK_TRIPS.filter(trip => {
    const matchesCountry = selectedCountry === "All Packages" || trip.country === selectedCountry;
    const matchesSearch = searchQuery === "" || 
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesSearch;
  });

  const trendingTrips = filteredTrips.filter(trip => trip.isTrending);
  const otherTrips = filteredTrips.filter(trip => !trip.isTrending);

  const handleTripClick = (tripId: string) => {
    navigate(`/trip-detail/${tripId}`);
  };

  const toggleWishlist = (trip: TripCard, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    let items = stored ? JSON.parse(stored) : [];
    
    const isInWishlist = wishlistIds.has(trip.id);
    
    if (isInWishlist) {
      items = items.filter((item: any) => item.id !== trip.id);
      setWishlistIds(prev => {
        const updated = new Set(prev);
        updated.delete(trip.id);
        return updated;
      });
    } else {
      const wishlistItem = {
        id: trip.id,
        name: trip.name,
        country: trip.country,
        duration: trip.duration,
        destinations: trip.destinations,
        priceFrom: trip.priceFrom,
        rating: trip.rating,
        image: trip.image,
        addedAt: Date.now()
      };
      items.push(wishlistItem);
      setWishlistIds(prev => {
        const updated = new Set(prev);
        updated.add(trip.id);
        return updated;
      });
    }
    
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">TRIP NOW</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">End-to-End Packages</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/trip-wishlist')}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none relative"
              data-testid="button-wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.size > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistIds.size}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/all-tickets?type=tripnow')}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-my-trips"
            >
              <Ticket className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Country Tabs */}
        <div className="overflow-x-auto hide-scrollbar">
          <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none justify-start px-4">
              {COUNTRIES.map((country) => (
                <TabsTrigger
                  key={country}
                  value={country}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent px-4 whitespace-nowrap"
                  data-testid={`tab-${country.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {country}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="pt-48 px-4 space-y-6 max-w-screen-xl mx-auto">
        {/* Trending Trips - Horizontal Scroll */}
        {trendingTrips.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold tracking-wider">TRENDING TRIPS</h2>
            </div>
            <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
              <div className="flex gap-4 pb-2">
                {trendingTrips.map((trip) => (
                  <Card
                    key={trip.id}
                    onClick={() => handleTripClick(trip.id)}
                    className="bg-white/5 border border-white/20 rounded-none cursor-pointer hover:bg-white/10 transition-all flex-shrink-0 w-[280px]"
                    data-testid={`trending-trip-${trip.id}`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => toggleWishlist(trip, e)}
                        className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm p-1.5 hover:bg-black/80 transition-colors rounded-full"
                        data-testid={`button-wishlist-${trip.id}`}
                      >
                        <Heart 
                          className={`h-4 w-4 ${wishlistIds.has(trip.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                          strokeWidth={1.5}
                        />
                      </button>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {trip.badges.slice(0, 1).map((badge, idx) => (
                          <Badge
                            key={idx}
                            className="bg-yellow-500/90 text-black border-0 rounded-none text-[10px] px-2 py-0.5"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-xs font-medium">{trip.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold text-base mb-2 line-clamp-1">{trip.name}</h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{trip.destinations.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div>
                          <p className="text-white/60 text-[10px]">From</p>
                          <p className="text-white font-semibold text-lg">₹{trip.priceFrom.toLocaleString()}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 rounded-none h-8 px-3"
                          data-testid={`button-view-${trip.id}`}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Trips - 2 Column Grid */}
        {otherTrips.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-wider">OTHER TRIPS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherTrips.map((trip) => (
                <Card
                  key={trip.id}
                  onClick={() => handleTripClick(trip.id)}
                  className="bg-white/5 border border-white/20 rounded-none cursor-pointer hover:bg-white/10 transition-all"
                  data-testid={`trip-${trip.id}`}
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => toggleWishlist(trip, e)}
                        className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm p-1 hover:bg-black/80 transition-colors rounded-full"
                        data-testid={`button-wishlist-${trip.id}`}
                      >
                        <Heart 
                          className={`h-3 w-3 ${wishlistIds.has(trip.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                          strokeWidth={1.5}
                        />
                      </button>
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5">
                        <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-[10px] font-medium">{trip.rating}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{trip.name}</h3>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center gap-1.5 text-white/60 text-xs">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{trip.destinations.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/60 text-xs">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Plane className="h-3 w-3 text-white/40" />
                          <Hotel className="h-3 w-3 text-white/40" />
                          <Car className="h-3 w-3 text-white/40" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {trip.badges.slice(0, 1).map((badge, idx) => (
                          <Badge
                            key={idx}
                            className="bg-white/10 text-white border-white/20 rounded-none text-[9px] px-1.5 py-0"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <p className="text-white/60 text-[10px]">From</p>
                        <p className="text-white font-semibold text-base">₹{trip.priceFrom.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No trips found</p>
            <p className="text-white/40 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
