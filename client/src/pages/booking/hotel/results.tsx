import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Wifi, 
  UtensilsCrossed, 
  Car, 
  Dumbbell, 
  Filter, 
  SlidersHorizontal,
  Heart,
  TrendingUp,
  Award,
  Coffee,
  Waves,
  Wind,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Hotel {
  id: string;
  name: string;
  city: string;
  area: string;
  starRating: number;
  rating: number;
  totalReviews: number;
  images: string[];
  amenities: string[];
  propertyType: string;
  basePrice: number;
  originalPrice?: number;
  discount?: number;
  isTrending?: boolean;
  isRecommended?: boolean;
  tags: string[];
}

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "The Taj Mahal Palace",
    city: "Mumbai",
    area: "Colaba",
    starRating: 5,
    rating: 4.8,
    totalReviews: 3452,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 12500,
    originalPrice: 15000,
    discount: 17,
    isTrending: true,
    isRecommended: true,
    tags: ["Sea View", "Heritage", "Premium"]
  },
  {
    id: "2",
    name: "Oberoi Mumbai",
    city: "Mumbai",
    area: "Nariman Point",
    starRating: 5,
    rating: 4.7,
    totalReviews: 2891,
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool"],
    propertyType: "Luxury Hotel",
    basePrice: 11000,
    originalPrice: 13500,
    discount: 18,
    isRecommended: true,
    tags: ["Business", "Luxury", "City Center"]
  },
  {
    id: "3",
    name: "Trident BKC",
    city: "Mumbai",
    area: "Bandra Kurla Complex",
    starRating: 5,
    rating: 4.6,
    totalReviews: 1876,
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Bar"],
    propertyType: "Business Hotel",
    basePrice: 8500,
    isTrending: true,
    tags: ["Business District", "Modern", "Airport Nearby"]
  },
  {
    id: "4",
    name: "JW Marriott Juhu",
    city: "Mumbai",
    area: "Juhu Beach",
    starRating: 5,
    rating: 4.9,
    totalReviews: 4231,
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Beach"],
    propertyType: "Beach Resort",
    basePrice: 13500,
    originalPrice: 16000,
    discount: 15,
    isTrending: true,
    isRecommended: true,
    tags: ["Beach Front", "Family", "Luxury"]
  },
  {
    id: "5",
    name: "Hyatt Regency Mumbai",
    city: "Mumbai",
    area: "Santacruz East",
    starRating: 4,
    rating: 4.5,
    totalReviews: 2134,
    images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool"],
    propertyType: "Business Hotel",
    basePrice: 7500,
    tags: ["Airport", "Business", "Value for Money"]
  },
  {
    id: "6",
    name: "Novotel Juhu Beach",
    city: "Mumbai",
    area: "Juhu",
    starRating: 4,
    rating: 4.4,
    totalReviews: 1543,
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Pool", "Beach Access"],
    propertyType: "Beach Hotel",
    basePrice: 6500,
    originalPrice: 8000,
    discount: 19,
    tags: ["Beach", "Family Friendly", "Mid-Range"]
  },
  {
    id: "7",
    name: "ITC Grand Central",
    city: "Mumbai",
    area: "Parel",
    starRating: 5,
    rating: 4.8,
    totalReviews: 2987,
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Spa", "Bar"],
    propertyType: "Luxury Hotel",
    basePrice: 10500,
    isRecommended: true,
    tags: ["Central Location", "Luxury", "ITC Hotels"]
  },
  {
    id: "8",
    name: "Sofitel Mumbai BKC",
    city: "Mumbai",
    area: "BKC",
    starRating: 5,
    rating: 4.7,
    totalReviews: 1876,
    images: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 11500,
    originalPrice: 14000,
    discount: 18,
    isTrending: true,
    tags: ["French Luxury", "BKC", "Modern"]
  },
  {
    id: "9",
    name: "Taj Exotica Goa",
    city: "Goa",
    area: "Benaulim",
    starRating: 5,
    rating: 4.9,
    totalReviews: 5421,
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Beach"],
    propertyType: "Beach Resort",
    basePrice: 15000,
    originalPrice: 18000,
    discount: 17,
    isTrending: true,
    isRecommended: true,
    tags: ["Beach Front", "Luxury", "South Goa"]
  },
  {
    id: "10",
    name: "The Leela Goa",
    city: "Goa",
    area: "Cavelossim",
    starRating: 5,
    rating: 4.8,
    totalReviews: 4267,
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Beach"],
    propertyType: "Beach Resort",
    basePrice: 14500,
    originalPrice: 17000,
    discount: 15,
    isRecommended: true,
    tags: ["Beach Front", "Premium", "Family Friendly"]
  },
  {
    id: "11",
    name: "W Goa",
    city: "Goa",
    area: "Vagator",
    starRating: 5,
    rating: 4.7,
    totalReviews: 3892,
    images: ["https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Bar", "Beach"],
    propertyType: "Luxury Hotel",
    basePrice: 16000,
    isTrending: true,
    isRecommended: true,
    tags: ["Beach", "Party", "North Goa", "Modern"]
  },
  {
    id: "12",
    name: "Alila Diwa Goa",
    city: "Goa",
    area: "Majorda",
    starRating: 5,
    rating: 4.6,
    totalReviews: 2987,
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Beach Resort",
    basePrice: 11000,
    originalPrice: 13500,
    discount: 18,
    tags: ["South Goa", "Peaceful", "Beach Access"]
  },
  {
    id: "13",
    name: "Novotel Goa Candolim",
    city: "Goa",
    area: "Candolim",
    starRating: 4,
    rating: 4.5,
    totalReviews: 2156,
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Pool", "Beach Access"],
    propertyType: "Beach Hotel",
    basePrice: 7500,
    originalPrice: 9000,
    discount: 17,
    tags: ["North Goa", "Beach", "Mid-Range"]
  },
  {
    id: "14",
    name: "Zuri White Sands Goa",
    city: "Goa",
    area: "Varca",
    starRating: 5,
    rating: 4.7,
    totalReviews: 3421,
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Beach"],
    propertyType: "Beach Resort",
    basePrice: 12500,
    isTrending: true,
    tags: ["South Goa", "Beach Front", "Family"]
  },
  {
    id: "15",
    name: "Hard Rock Hotel Goa",
    city: "Goa",
    area: "Calangute",
    starRating: 4,
    rating: 4.6,
    totalReviews: 3187,
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Bar"],
    propertyType: "Beach Hotel",
    basePrice: 9000,
    originalPrice: 11000,
    discount: 18,
    isRecommended: true,
    tags: ["North Goa", "Entertainment", "Beach"]
  },
  {
    id: "16",
    name: "The Oberoi New Delhi",
    city: "Delhi",
    area: "Golf Course Road",
    starRating: 5,
    rating: 4.9,
    totalReviews: 4562,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 18000,
    originalPrice: 22000,
    discount: 18,
    isTrending: true,
    isRecommended: true,
    tags: ["Luxury", "Business", "Central Delhi"]
  },
  {
    id: "17",
    name: "The Leela Palace New Delhi",
    city: "Delhi",
    area: "Chanakyapuri",
    starRating: 5,
    rating: 4.8,
    totalReviews: 3987,
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 17000,
    originalPrice: 20000,
    discount: 15,
    isRecommended: true,
    tags: ["Premium", "Diplomatic", "Luxury"]
  },
  {
    id: "18",
    name: "ITC Maurya Delhi",
    city: "Delhi",
    area: "Diplomatic Enclave",
    starRating: 5,
    rating: 4.7,
    totalReviews: 3456,
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Bar"],
    propertyType: "Luxury Hotel",
    basePrice: 15000,
    isTrending: true,
    tags: ["ITC Hotels", "Business", "Diplomatic"]
  },
  {
    id: "19",
    name: "Taj Palace New Delhi",
    city: "Delhi",
    area: "Diplomatic Enclave",
    starRating: 5,
    rating: 4.6,
    totalReviews: 2987,
    images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 14000,
    originalPrice: 17000,
    discount: 18,
    tags: ["Heritage", "Luxury", "Central"]
  },
  {
    id: "20",
    name: "The Lodhi Delhi",
    city: "Delhi",
    area: "Lodhi Road",
    starRating: 5,
    rating: 4.9,
    totalReviews: 2654,
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 16500,
    originalPrice: 19000,
    discount: 13,
    isRecommended: true,
    tags: ["Boutique", "Modern", "Peaceful"]
  },
  {
    id: "21",
    name: "ITC Grand Bharat",
    city: "Delhi",
    area: "Gurgaon",
    starRating: 5,
    rating: 4.8,
    totalReviews: 1987,
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Golf"],
    propertyType: "Resort Hotel",
    basePrice: 19000,
    isTrending: true,
    tags: ["Golf Resort", "Premium", "Retreat"]
  },
  {
    id: "22",
    name: "The Taj West End",
    city: "Bangalore",
    area: "Race Course Road",
    starRating: 5,
    rating: 4.8,
    totalReviews: 3876,
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Heritage Hotel",
    basePrice: 12000,
    originalPrice: 14500,
    discount: 17,
    isRecommended: true,
    tags: ["Heritage", "Garden", "Luxury"]
  },
  {
    id: "23",
    name: "ITC Gardenia Bangalore",
    city: "Bangalore",
    area: "Residency Road",
    starRating: 5,
    rating: 4.7,
    totalReviews: 3245,
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Bar"],
    propertyType: "Luxury Hotel",
    basePrice: 11000,
    originalPrice: 13000,
    discount: 15,
    isTrending: true,
    tags: ["ITC Hotels", "Business", "Central"]
  },
  {
    id: "24",
    name: "The Oberoi Bangalore",
    city: "Bangalore",
    area: "MG Road",
    starRating: 5,
    rating: 4.9,
    totalReviews: 2987,
    images: ["https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 13500,
    isRecommended: true,
    tags: ["Premium", "City Center", "Modern"]
  },
  {
    id: "25",
    name: "The Leela Palace Bangalore",
    city: "Bangalore",
    area: "Old Airport Road",
    starRating: 5,
    rating: 4.8,
    totalReviews: 2654,
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 14000,
    originalPrice: 17000,
    discount: 18,
    isTrending: true,
    tags: ["Luxury", "Royal", "Premium"]
  },
  {
    id: "26",
    name: "JW Marriott Bangalore",
    city: "Bangalore",
    area: "Vittal Mallya Road",
    starRating: 5,
    rating: 4.6,
    totalReviews: 2345,
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Bar"],
    propertyType: "Business Hotel",
    basePrice: 10000,
    originalPrice: 12000,
    discount: 17,
    tags: ["Business", "City Center", "Modern"]
  },
  {
    id: "27",
    name: "Rambagh Palace",
    city: "Jaipur",
    area: "Bhawani Singh Road",
    starRating: 5,
    rating: 4.9,
    totalReviews: 5234,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Palace Hotel",
    basePrice: 22000,
    originalPrice: 26000,
    discount: 15,
    isTrending: true,
    isRecommended: true,
    tags: ["Royal Palace", "Heritage", "Luxury"]
  },
  {
    id: "28",
    name: "The Oberoi Rajvilas",
    city: "Jaipur",
    area: "Goner Road",
    starRating: 5,
    rating: 4.9,
    totalReviews: 3987,
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Resort Hotel",
    basePrice: 25000,
    isRecommended: true,
    tags: ["Luxury Resort", "Premium", "Royal"]
  },
  {
    id: "29",
    name: "Fairmont Jaipur",
    city: "Jaipur",
    area: "Riico Kukas",
    starRating: 5,
    rating: 4.7,
    totalReviews: 2876,
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Golf"],
    propertyType: "Luxury Hotel",
    basePrice: 14000,
    originalPrice: 17000,
    discount: 18,
    isTrending: true,
    tags: ["Modern Luxury", "Resort", "Golf"]
  },
  {
    id: "30",
    name: "ITC Rajputana Jaipur",
    city: "Jaipur",
    area: "Palace Road",
    starRating: 5,
    rating: 4.6,
    totalReviews: 2543,
    images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Bar"],
    propertyType: "Luxury Hotel",
    basePrice: 12000,
    originalPrice: 14500,
    discount: 17,
    tags: ["ITC Hotels", "Heritage", "Central"]
  },
  {
    id: "31",
    name: "The Lalit Jaipur",
    city: "Jaipur",
    area: "Jagatpura",
    starRating: 5,
    rating: 4.5,
    totalReviews: 1987,
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"],
    amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa"],
    propertyType: "Luxury Hotel",
    basePrice: 9500,
    originalPrice: 11500,
    discount: 17,
    tags: ["Modern", "Value", "Spacious"]
  }
];

export default function HotelResults() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const city = searchParams.get('city') || 'Mumbai';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const rooms = searchParams.get('rooms') || '1';
  const guests = searchParams.get('guests') || '2';

  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const filteredHotels = useMemo(() => mockHotels.filter(hotel => 
    (!filterStars || hotel.starRating === filterStars) &&
    hotel.city.toLowerCase() === city.toLowerCase()
  ), [filterStars, city]);

  const sortedHotels = useMemo(() => [...filteredHotels].sort((a, b) => {
    if (sortBy === 'recommended') {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return b.rating - a.rating;
    }
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (sortBy === 'price-high') return b.basePrice - a.basePrice;
    return 0;
  }), [filteredHotels, sortBy]);

  const pagination = usePagination({
    data: sortedHotels,
    itemsPerPage: 10,
  });

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      'WiFi': Wifi,
      'Restaurant': UtensilsCrossed,
      'Parking': Car,
      'Gym': Dumbbell,
      'Pool': Waves,
      'Spa': Sparkles,
      'Bar': Coffee,
      'Beach': Wind,
    };
    return icons[amenity] || Wifi;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleHotelClick = (hotelId: string) => {
    const params = new URLSearchParams({
      id: hotelId,
      checkIn,
      checkOut,
      rooms,
      guests
    });
    navigate(`/booking/hotel/details?${params.toString()}`);
  };

  const toggleFavorite = (hotelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hotelId)) {
        newSet.delete(hotelId);
      } else {
        newSet.add(hotelId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/booking/hotel/search')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider">{city.toUpperCase()}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {sortedHotels.length} Hotels • {nights} Night{nights > 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Filters Bar */}
        <div className="px-4 pb-4 space-y-3">
          {/* Star Rating Filter */}
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterStars(null)}
              className={cn(
                "border rounded-none text-xs font-light whitespace-nowrap",
                !filterStars ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"
              )}
              data-testid="filter-all"
            >
              All
            </Button>
            {[5, 4, 3].map(stars => (
              <Button
                key={stars}
                variant="ghost"
                size="sm"
                onClick={() => setFilterStars(stars)}
                className={cn(
                  "border rounded-none text-xs font-light whitespace-nowrap",
                  filterStars === stars ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/40"
                )}
                data-testid={`filter-${stars}-star`}
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                {stars} Star
              </Button>
            ))}
          </div>

          {/* Sort Tabs */}
          <Tabs value={sortBy} onValueChange={(val) => setSortBy(val as any)} className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger 
                value="recommended" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-recommended"
              >
                Recommended
              </TabsTrigger>
              <TabsTrigger 
                value="rating" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-rating"
              >
                Rating
              </TabsTrigger>
              <TabsTrigger 
                value="price-low" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-price-low"
              >
                Price: Low
              </TabsTrigger>
              <TabsTrigger 
                value="price-high" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-price-high"
              >
                Price: High
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Hotels List */}
      <div className="pt-52 px-4 space-y-4">
        {sortedHotels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 font-light">No hotels found in {city}</p>
            <Button
              onClick={() => navigate('/booking/hotel/search')}
              className="mt-4 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-none"
            >
              Try Another City
            </Button>
          </div>
        ) : (
          pagination.paginatedData.map((hotel) => {
            const totalPrice = hotel.basePrice * nights;
            const isFavorite = favorites.has(hotel.id);

            return (
              <Card
                key={hotel.id}
                onClick={() => handleHotelClick(hotel.id)}
                className="bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-white/30 transition-all cursor-pointer"
                data-testid={`hotel-card-${hotel.id}`}
              >
                <CardContent className="p-0">
                  {/* Hotel Image */}
                  <div className="relative h-48">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {hotel.isRecommended && (
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-0 rounded-none text-xs px-2 py-1">
                          <Award className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      {hotel.isTrending && (
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-0 rounded-none text-xs px-2 py-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => toggleFavorite(hotel.id, e)}
                      className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white hover:bg-black/70 rounded-none h-9 w-9"
                      data-testid={`button-favorite-${hotel.id}`}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-white")} />
                    </Button>

                    {/* Discount Badge */}
                    {hotel.discount && (
                      <Badge className="absolute bottom-3 left-3 bg-green-500/90 text-white border-0 rounded-none text-xs px-2 py-1">
                        {hotel.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Hotel Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-light tracking-wide text-white" data-testid={`text-hotel-name-${hotel.id}`}>
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          {[...Array(hotel.starRating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-white/80 fill-white/80" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="font-light">{hotel.area}, {hotel.city}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <div className="bg-white/10 px-2 py-0.5 rounded-none">
                            <span className="text-white font-light">{hotel.rating}</span>
                          </div>
                          <Star className="h-3 w-3 text-white/60 fill-white/60" />
                        </div>
                        <span className="text-xs text-white/40 font-light">
                          {hotel.totalReviews.toLocaleString()} reviews
                        </span>
                        <Badge className="bg-white/5 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                          {hotel.propertyType}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        {hotel.tags.map((tag, idx) => (
                          <Badge key={idx} className="bg-white/5 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Amenities */}
                      <div className="flex gap-3 flex-wrap">
                        {hotel.amenities.slice(0, 5).map((amenity, idx) => {
                          const Icon = getAmenityIcon(amenity);
                          return (
                            <div key={idx} className="flex items-center gap-1 text-white/60">
                              <Icon className="h-3 w-3" />
                              <span className="text-xs font-light">{amenity}</span>
                            </div>
                          );
                        })}
                        {hotel.amenities.length > 5 && (
                          <span className="text-xs text-white/40 font-light">
                            +{hotel.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="pt-3 border-t border-white/10 flex items-end justify-between">
                      <div>
                        {hotel.originalPrice && (
                          <p className="text-xs text-white/40 line-through font-light">
                            {formatPrice(hotel.originalPrice * nights)}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-light text-white" data-testid={`text-price-${hotel.id}`}>
                            {formatPrice(totalPrice)}
                          </p>
                          <p className="text-xs text-white/40 font-light">
                            for {nights} night{nights > 1 ? 's' : ''}
                          </p>
                        </div>
                        <p className="text-xs text-white/60 font-light mt-0.5">
                          + taxes & fees
                        </p>
                      </div>
                      <Button
                        className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 font-light"
                        data-testid={`button-select-${hotel.id}`}
                      >
                        SELECT
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {sortedHotels.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6 mb-6"
          />
        )}
      </div>
    </div>
  );
}
