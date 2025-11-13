import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Search,
  Gift,
  ShoppingBag,
  Star,
  Percent,
  Clock,
  Tag,
  Zap,
  Heart,
  TrendingUp,
  Users,
  Crown,
  Sparkles,
  Target,
  Coffee,
  Utensils,
  Gamepad2,
  Headphones,
  Shirt,
  Smartphone
} from "lucide-react";

// Gift Cards and Coupons Data
interface GiftCard {
  id: string;
  brand: string;
  title: string;
  description: string;
  category: string;
  cashback: number;
  originalPrice: number;
  discountedPrice: number;
  validTill: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  rating: number;
  usersCount: string;
  isPopular: boolean;
  isTrending: boolean;
  tags: string[];
}

const GIFT_CARDS: GiftCard[] = [
  {
    id: "amazon",
    brand: "Amazon",
    title: "Amazon Gift Card",
    description: "Shop everything on Amazon with instant gift cards",
    category: "Shopping",
    cashback: 5,
    originalPrice: 1000,
    discountedPrice: 950,
    validTill: "2025-12-31",
    icon: ShoppingBag,
    color: "text-white/80",
    gradient: "from-orange-500/20 to-orange-600/10",
    rating: 4.8,
    usersCount: "2.5M+",
    isPopular: true,
    isTrending: true,
    tags: ["Shopping", "Electronics", "Books"]
  },
  {
    id: "flipkart",
    brand: "Flipkart",
    title: "Flipkart Gift Voucher",
    description: "India's largest online marketplace vouchers",
    category: "Shopping",
    cashback: 8,
    originalPrice: 500,
    discountedPrice: 460,
    validTill: "2025-11-30",
    icon: Gift,
    color: "text-white/80",
    gradient: "from-white/10 to-white/5",
    rating: 4.6,
    usersCount: "1.8M+",
    isPopular: true,
    isTrending: false,
    tags: ["Shopping", "Fashion", "Electronics"]
  },
  {
    id: "myntra",
    brand: "Myntra",
    title: "Myntra Fashion Card",
    description: "Latest fashion trends and styles voucher",
    category: "Fashion",
    cashback: 12,
    originalPrice: 2000,
    discountedPrice: 1760,
    validTill: "2025-12-15",
    icon: Shirt,
    color: "text-white/80",
    gradient: "from-pink-500/20 to-pink-600/10",
    rating: 4.7,
    usersCount: "950K+",
    isPopular: true,
    isTrending: true,
    tags: ["Fashion", "Clothing", "Accessories"]
  },
  {
    id: "swiggy",
    brand: "Swiggy",
    title: "Swiggy Food Voucher",
    description: "Order your favorite meals and snacks",
    category: "Food",
    cashback: 10,
    originalPrice: 300,
    discountedPrice: 270,
    validTill: "2025-10-31",
    icon: Utensils,
    color: "text-white/80",
    gradient: "from-orange-600/20 to-red-500/10",
    rating: 4.4,
    usersCount: "3.2M+",
    isPopular: false,
    isTrending: true,
    tags: ["Food", "Delivery", "Restaurant"]
  },
  {
    id: "zomato",
    brand: "Zomato",
    title: "Zomato Dining Card",
    description: "Discover great food and dining experiences",
    category: "Food",
    cashback: 8,
    originalPrice: 500,
    discountedPrice: 460,
    validTill: "2025-11-20",
    icon: Coffee,
    color: "text-white/80",
    gradient: "from-red-500/20 to-red-600/10",
    rating: 4.3,
    usersCount: "2.1M+",
    isPopular: false,
    isTrending: false,
    tags: ["Food", "Dining", "Restaurant"]
  },
  {
    id: "bigbasket",
    brand: "BigBasket",
    title: "BigBasket Grocery Card",
    description: "Fresh groceries delivered to your doorstep",
    category: "Grocery",
    cashback: 6,
    originalPrice: 1000,
    discountedPrice: 940,
    validTill: "2025-12-31",
    icon: ShoppingBag,
    color: "text-white/80",
    gradient: "from-white/10/20 to-white/5/10",
    rating: 4.5,
    usersCount: "1.2M+",
    isPopular: false,
    isTrending: false,
    tags: ["Grocery", "Fresh", "Daily Needs"]
  },
  {
    id: "croma",
    brand: "Croma",
    title: "Croma Electronics Card",
    description: "Latest gadgets and electronics voucher",
    category: "Electronics",
    cashback: 7,
    originalPrice: 3000,
    discountedPrice: 2790,
    validTill: "2025-12-10",
    icon: Smartphone,
    color: "text-white/80",
    gradient: "from-indigo-500/20 to-purple-500/10",
    rating: 4.2,
    usersCount: "680K+",
    isPopular: false,
    isTrending: false,
    tags: ["Electronics", "Gadgets", "Technology"]
  },
  {
    id: "bookmyshow",
    brand: "BookMyShow",
    title: "BookMyShow Entertainment",
    description: "Movies, events and entertainment voucher",
    category: "Entertainment",
    cashback: 15,
    originalPrice: 500,
    discountedPrice: 425,
    validTill: "2025-11-30",
    icon: Sparkles,
    color: "text-white/80",
    gradient: "from-purple-500/20 to-purple-600/10",
    rating: 4.6,
    usersCount: "1.5M+",
    isPopular: true,
    isTrending: true,
    tags: ["Movies", "Events", "Entertainment"]
  }
];

const CATEGORIES = [
  { id: "all", name: "All", count: GIFT_CARDS.length },
  { id: "Shopping", name: "Shopping", count: GIFT_CARDS.filter(c => c.category === "Shopping").length },
  { id: "Fashion", name: "Fashion", count: GIFT_CARDS.filter(c => c.category === "Fashion").length },
  { id: "Food", name: "Food", count: GIFT_CARDS.filter(c => c.category === "Food").length },
  { id: "Electronics", name: "Electronics", count: GIFT_CARDS.filter(c => c.category === "Electronics").length },
  { id: "Entertainment", name: "Entertainment", count: GIFT_CARDS.filter(c => c.category === "Entertainment").length }
];

const QUICK_FILTERS = [
  { id: "popular", name: "Popular", icon: Star },
  { id: "trending", name: "Trending", icon: TrendingUp },
  { id: "high_cashback", name: "High Cashback", icon: Percent },
  { id: "expiring_soon", name: "Expiring Soon", icon: Clock }
];

export default function GiftCoupons() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useUrlTab("gift-cards");
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/home");
  };

  const handleBuyGiftCard = (giftCard: GiftCard) => {
    toast({
      title: "Redirecting to Purchase",
      description: `Opening ${giftCard.brand} gift card purchase page`,
    });
    // For now, show success message - in real app would navigate to purchase flow
    // Could navigate to existing payment flow: navigate(`/payment-detail/${giftCard.id}`)
  };

  const handleWishlist = (giftCardId: string, brandName: string) => {
    toast({
      title: "Added to Wishlist",
      description: `${brandName} gift card saved to your wishlist`,
    });
  };

  const getFilteredCards = () => {
    let filtered = GIFT_CARDS;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(card => 
        card.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Quick filter
    switch (selectedFilter) {
      case "popular":
        filtered = filtered.filter(card => card.isPopular);
        break;
      case "trending":
        filtered = filtered.filter(card => card.isTrending);
        break;
      case "high_cashback":
        filtered = filtered.filter(card => card.cashback >= 10);
        break;
      case "expiring_soon":
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        filtered = filtered.filter(card => {
          const validDate = new Date(card.validTill);
          return validDate > now && validDate <= thirtyDaysFromNow;
        });
        break;
    }

    return filtered;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredCards = getFilteredCards();

  const pagination = usePagination({
    data: filteredCards,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">GIFT CARDS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Buy Gift Cards & Coupons</p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            placeholder="Search brands and offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-black border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-white/40 focus:ring-0 h-12"
            data-testid="input-search-gifts"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
            className={cn(
              "whitespace-nowrap h-8 text-xs",
              selectedFilter === "all"
                ? "bg-white text-black"
                : "border-white/20 text-white/80 hover:bg-white/10"
            )}
            data-testid="button-filter-all"
          >
            All Offers
          </Button>
          {QUICK_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                "whitespace-nowrap h-8 text-xs flex items-center gap-1",
                selectedFilter === filter.id
                  ? "bg-white text-black"
                  : "border-white/20 text-white/80 hover:bg-white/10"
              )}
              data-testid={`button-filter-${filter.id}`}
            >
              <filter.icon className="h-3 w-3" />
              {filter.name}
            </Button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "whitespace-nowrap h-8 text-xs",
                selectedCategory === category.id
                  ? "bg-white text-black"
                  : "border-white/20 text-white/80 hover:bg-white/10"
              )}
              data-testid={`button-category-${category.id}`}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Popular & Trending Section */}
        {selectedCategory === "all" && selectedFilter === "all" && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-white/80" />
              Popular & Trending
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {GIFT_CARDS.filter(card => card.isPopular || card.isTrending).slice(0, 4).map((card) => (
                <Card key={card.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:bg-white/10 transition-colors relative overflow-hidden">
                  <CardContent className="p-4">
                    {(card.isPopular || card.isTrending) && (
                      <div className="absolute top-2 right-2">
                        {card.isTrending && (
                          <Badge variant="secondary" className="bg-white/10 text-white/80 border-0 text-xs">
                            🔥 Trending
                          </Badge>
                        )}
                        {card.isPopular && !card.isTrending && (
                          <Badge variant="secondary" className="bg-white/10 text-white/80 border-0 text-xs">
                            ⭐ Popular
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r mb-3",
                      card.gradient
                    )}>
                      <card.icon className={cn("h-6 w-6", card.color)} />
                    </div>
                    
                    <h3 className="font-semibold text-white text-sm mb-1">{card.brand}</h3>
                    <p className="text-xs text-white/60 mb-3 leading-tight">{card.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/10 text-white/80 border-0 text-xs">
                          {card.cashback}% Cashback
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-white/80 fill-current" />
                          <span className="text-xs text-white/80">{card.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white/60 line-through">{formatCurrency(card.originalPrice)}</p>
                          <p className="text-sm font-bold text-white">{formatCurrency(card.discountedPrice)}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBuyGiftCard(card)}
                          className="bg-white text-black hover:bg-white/90 text-xs h-7 px-3"
                          data-testid={`button-buy-${card.id}`}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Gift Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {selectedCategory === "all" ? "All Gift Cards" : `${selectedCategory} Cards`}
            </h2>
            <p className="text-sm text-white/60">{filteredCards.length} offers</p>
          </div>
          
          <div className="space-y-4">
            {pagination.paginatedData.map((card) => (
              <Card key={card.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl hover:bg-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r",
                        card.gradient
                      )}>
                        <card.icon className={cn("h-7 w-7", card.color)} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{card.brand}</h3>
                          {card.isPopular && (
                            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0 text-xs">
                              Popular
                            </Badge>
                          )}
                          {card.isTrending && (
                            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0 text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/80 mb-2">{card.title}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Percent className="h-3 w-3 text-white/80" />
                            <span className="text-xs text-white/80 font-medium">{card.cashback}% Cashback</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-white/80 fill-current" />
                            <span className="text-xs text-white/80">{card.rating} • {card.usersCount} users</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-white/60" />
                            <span className="text-xs text-white/60">Valid till {new Date(card.validTill).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-sm text-white/60 line-through">{formatCurrency(card.originalPrice)}</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(card.discountedPrice)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWishlist(card.id, card.brand)}
                          className="border-white/20 text-white/80 hover:bg-white/10 w-9 h-8 p-0"
                          data-testid={`button-wishlist-${card.id}`}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBuyGiftCard(card)}
                          className="bg-white text-black hover:bg-white/90 text-sm h-8 px-4"
                          data-testid={`button-buy-card-${card.id}`}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCards.length > 0 && (
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

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Gift Cards Found</h3>
            <p className="text-white/60 mb-4">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : "No gift cards match your selected filters"
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedFilter("all");
              }}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}