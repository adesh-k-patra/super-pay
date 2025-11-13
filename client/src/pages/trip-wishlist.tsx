import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Search,
  Heart,
  MapPin,
  Clock,
  Star,
  Trash2
} from "lucide-react";

interface TripWishlistItem {
  id: string;
  name: string;
  country: string;
  duration: string;
  destinations: string[];
  priceFrom: number;
  rating: number;
  image: string;
  addedAt: number;
}

const STORAGE_KEY = 'trip-wishlist';

const DUMMY_WISHLIST_DATA: TripWishlistItem[] = [
  {
    id: "uk-winter-family",
    name: "Family UK Winter",
    country: "UK",
    duration: "8 Days / 7 Nights",
    destinations: ["London", "Glasgow", "Edinburgh"],
    priceFrom: 185000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    addedAt: Date.now() - 86400000
  },
  {
    id: "paris-romance",
    name: "Romantic Paris Getaway",
    country: "France",
    duration: "5 Days / 4 Nights",
    destinations: ["Paris", "Versailles"],
    priceFrom: 125000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    addedAt: Date.now() - 172800000
  },
  {
    id: "italy-food-tour",
    name: "Italian Culinary Journey",
    country: "Italy",
    duration: "7 Days / 6 Nights",
    destinations: ["Rome", "Florence", "Venice"],
    priceFrom: 165000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    addedAt: Date.now() - 259200000
  },
  {
    id: "uae-luxury",
    name: "Luxury Dubai & Abu Dhabi",
    country: "UAE",
    duration: "6 Days / 5 Nights",
    destinations: ["Dubai", "Abu Dhabi"],
    priceFrom: 145000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    addedAt: Date.now() - 345600000
  },
  {
    id: "australia-outback",
    name: "Australian Outback Experience",
    country: "Australia",
    duration: "9 Days / 8 Nights",
    destinations: ["Sydney", "Cairns", "Uluru"],
    priceFrom: 285000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    addedAt: Date.now() - 432000000
  }
];

export default function TripWishlist() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistItems, setWishlistItems] = useState<TripWishlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWishlistItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse trip wishlist', e);
      }
    } else {
      setWishlistItems(DUMMY_WISHLIST_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_WISHLIST_DATA));
    }
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return wishlistItems;
    
    return wishlistItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destinations.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [wishlistItems, searchTerm]);

  const handleRemoveItem = (id: string) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleTripClick = (tripId: string) => {
    navigate(`/trip-detail/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/trip-now")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">TRIP WISHLIST</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Trip' : 'Trips'} Saved
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-none h-11"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-36 px-4 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="border border-white/10 p-12 text-center mt-8 bg-white/5" data-testid="empty-wishlist">
            <Heart className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
            <p className="text-white/50 text-sm mb-2">
              {searchTerm ? `No trips found for "${searchTerm}"` : 'No trips in your wishlist'}
            </p>
            <p className="text-xs text-white/40 mb-4">
              {searchTerm ? 'Try a different search' : 'Browse trips and add them to your wishlist'}
            </p>
            <Button
              onClick={() => navigate("/trip-now")}
              className="bg-white text-black hover:bg-white/90 rounded-none"
              data-testid="button-browse-trips"
            >
              Browse Trips
            </Button>
          </div>
        ) : (
          filteredItems.map((trip) => (
            <Card
              key={trip.id}
              className="bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all overflow-hidden group"
              data-testid={`wishlist-trip-${trip.id}`}
            >
              <div className="flex gap-4 p-4">
                <div 
                  className="relative w-28 h-28 flex-shrink-0 overflow-hidden cursor-pointer"
                  onClick={() => handleTripClick(trip.id)}
                >
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5">
                    <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-white text-[10px] font-medium">{trip.rating}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleTripClick(trip.id)}
                  >
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{trip.name}</h3>
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] mb-2">
                      {trip.country}
                    </Badge>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white/60 text-xs">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">{trip.destinations.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/60 text-xs">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div>
                      <p className="text-white/60 text-[10px]">From</p>
                      <p className="text-white font-semibold text-base">₹{trip.priceFrom.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(trip.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-none h-8 px-3"
                      data-testid={`button-remove-${trip.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" strokeWidth={1} />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
