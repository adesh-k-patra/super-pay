import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SwapNowListing } from "@shared/schema";
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  MapPin,
  Smartphone,
  ArrowLeft,
  Info,
  Eye
} from "lucide-react";

const categories = [
  { id: "all", label: "All", emoji: "🏷️" },
  { id: "electronics", label: "Electronics", emoji: "📱" },
  { id: "furniture", label: "Furniture", emoji: "🛋️" },
  { id: "vehicles", label: "Vehicles", emoji: "🚗" },
  { id: "fashion", label: "Fashion", emoji: "👕" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "others", label: "Others", emoji: "📦" },
];

export default function SwapNowExplore() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: listings = [], isLoading } = useQuery<SwapNowListing[]>({
    queryKey: ['/api/swap-now/listings', { category: selectedCategory !== "all" ? selectedCategory : undefined }],
  });

  // Dummy data for when there are no listings
  const dummyListings: SwapNowListing[] = listings.length === 0 ? [
    {
      id: "1",
      userId: "user1",
      title: "iPhone 13 Pro Max 256GB Pacific Blue",
      description: "Selling my iPhone 13 Pro Max in excellent condition. Minor scratches on the back. Battery health 92%. All accessories included.",
      category: "electronics",
      subCategory: null,
      condition: "like_new",
      price: "65000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=500&h=500&fit=crop"],
      location: "Sector 62, Noida",
      city: "Noida",
      state: "UP",
      pincode: "201301",
      brand: "Apple",
      age: null,
      warranty: null,
      accessories: null,
      status: "active",
      isFeatured: 0,
      views: 234,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      id: "2",
      userId: "user2",
      title: "Royal Enfield Classic 350 - 2021 Model",
      description: "Well maintained Royal Enfield Classic 350, black color. Single owner, all papers clear. Regularly serviced.",
      category: "vehicles",
      subCategory: null,
      condition: "good",
      price: "145000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500&h=500&fit=crop"],
      location: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
      brand: "Royal Enfield",
      age: "2-5 years",
      warranty: null,
      accessories: null,
      status: "active",
      isFeatured: 0,
      views: 567,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      id: "3",
      userId: "user3",
      title: "L-Shaped Sofa Set (6 Seater) with Center Table",
      description: "Grey fabric L-shaped sofa in excellent condition. Bought 6 months ago. Moving to new city, urgent sale needed.",
      category: "furniture",
      subCategory: null,
      condition: "like_new",
      price: "28000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&h=500&fit=crop"],
      location: "Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400058",
      brand: null,
      age: "< 6 months",
      warranty: null,
      accessories: null,
      status: "active",
      isFeatured: 0,
      views: 189,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      id: "4",
      userId: "user4",
      title: "MacBook Air M1 2020 - 8GB RAM 256GB SSD",
      description: "MacBook Air M1 chip, space grey color. Excellent condition with original charger and box. AppleCare valid till Dec 2024.",
      category: "electronics",
      subCategory: null,
      condition: "like_new",
      price: "52000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop"],
      location: "Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
      brand: "Apple",
      age: "2-5 years",
      warranty: "AppleCare till Dec 2024",
      accessories: null,
      status: "active",
      isFeatured: 0,
      views: 412,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      id: "5",
      userId: "user5",
      title: "Nike Air Jordan 1 Mid - Size 10 (Barely Used)",
      description: "Authentic Nike Air Jordan 1 Mid, worn only twice. Like new condition with original box and tags. No defects.",
      category: "fashion",
      subCategory: null,
      condition: "like_new",
      price: "8500",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500&h=500&fit=crop"],
      location: "CP",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      brand: "Nike",
      age: "< 6 months",
      warranty: null,
      accessories: null,
      status: "active",
      isFeatured: 0,
      views: 298,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      id: "6",
      userId: "user6",
      title: "PlayStation 5 with 2 Controllers + 5 Games",
      description: "PS5 disc version with original box. Includes 2 DualSense controllers and 5 games (Spider-Man, God of War, FIFA 23, etc.)",
      category: "electronics",
      subCategory: null,
      condition: "good",
      price: "48000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=500&h=500&fit=crop"],
      location: "Salt Lake",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      brand: "Sony",
      age: "1-2 years",
      warranty: null,
      accessories: "2 controllers, 5 games",
      status: "active",
      isFeatured: 0,
      views: 523,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: null,
    },
  ] : listings;

  const filteredListings = dummyListings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/pro-tools")}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
              <h1 className="text-base font-bold tracking-wider uppercase">SwapNow</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                Buy & Sell Used Goods
              </p>
            </div>
            <div className="flex -space-x-2">
              <Button
                onClick={() => navigate("/swap-now/info")}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-info"
              >
                <Info className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/swap-now/my-listings")}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-my-listings"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/swap-now/new-listing")}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-new-listing"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4 mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for items..."
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto scrollbar-hide border-t border-white/10 -mx-4 px-4">
          <div className="flex gap-0 min-w-max">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-4 border-b-2 transition-all duration-200 ease-in-out ${
                    isActive
                      ? "border-white text-white bg-white/10 scale-[1.06]"
                      : "border-transparent text-white/60 hover:text-white/90"
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-60 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white/40">Loading listings...</div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-white/40 text-sm mb-4">No items found</p>
            <Button
              onClick={() => navigate("/swap-now/new")}
              className="bg-white text-black hover:bg-white/90 rounded-none"
              data-testid="button-create-first-listing"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredListings.map((listing) => {
              return (
                <div
                  key={listing.id}
                  onClick={() => navigate(`/swap-now/listings/${listing.id}`)}
                  className="border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  data-testid={`listing-${listing.id}`}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-black/20">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Smartphone className="h-12 w-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <div className="bg-black/80 text-white px-2 py-1 flex items-center gap-1 text-[10px]" data-testid={`text-views-${listing.id}`}>
                        <Eye className="h-3 w-3" />
                        <span>{listing.views} Views</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-light text-white line-clamp-2 mb-2">
                      {listing.title}
                    </h3>
                    <div className="text-lg font-semibold text-white mb-2">
                      {formatPrice(listing.price)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-white/50">
                      <MapPin className="h-3 w-3" />
                      <span>{listing.city}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
