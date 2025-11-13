import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Search,
  Heart,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateCatalogProducts, generateHotelVendors } from "@/data/delivery-now";
import { format } from "date-fns";

type WishlistCategory = 'all' | 'hotel-food' | 'supermart' | 'medicine' | 'electronics' | 'beauty' | 'pet' | 'home';

interface WishlistItem {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'vendor';
  price?: number;
  rating?: number;
  image?: string;
  vendorName?: string;
  brand?: string;
  addedAt: string;
  description?: string;
  productId?: string;
  distance?: string;
}

const generateDummyWishlistItems = (): WishlistItem[] => {
  const items: WishlistItem[] = [];
  
  const hotels = generateHotelVendors().slice(0, 3);
  hotels.forEach((hotel, idx) => {
    items.push({
      id: `vendor-food-${hotel.id}`,
      name: hotel.name,
      category: 'hotel-food',
      type: 'vendor',
      rating: hotel.rating,
      image: hotel.image,
      description: hotel.cuisines.join(', '),
      distance: hotel.distance,
      addedAt: new Date(Date.now() - idx * 86400000).toISOString()
    });
  });
  
  const supermartProducts = generateCatalogProducts('supermart', 8);
  supermartProducts.forEach((product, idx) => {
    items.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      category: 'supermart',
      type: 'product',
      price: product.price,
      rating: product.rating,
      image: product.image,
      brand: product.brand,
      description: product.description,
      addedAt: new Date(Date.now() - (idx + 3) * 86400000).toISOString()
    });
  });
  
  const medicineProducts = generateCatalogProducts('medicine', 6);
  medicineProducts.forEach((product, idx) => {
    items.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      category: 'medicine',
      type: 'product',
      price: product.price,
      rating: product.rating,
      image: product.image,
      brand: product.brand,
      description: product.description,
      addedAt: new Date(Date.now() - (idx + 11) * 86400000).toISOString()
    });
  });
  
  const electronicsProducts = generateCatalogProducts('electronics', 10);
  electronicsProducts.forEach((product, idx) => {
    items.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      category: 'electronics',
      type: 'product',
      price: product.price,
      rating: product.rating,
      image: product.image,
      brand: product.brand,
      description: product.description,
      addedAt: new Date(Date.now() - (idx + 17) * 86400000).toISOString()
    });
  });
  
  const beautyProducts = generateCatalogProducts('beauty', 5);
  beautyProducts.forEach((product, idx) => {
    items.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      category: 'beauty',
      type: 'product',
      price: product.price,
      rating: product.rating,
      image: product.image,
      brand: product.brand,
      description: product.description,
      addedAt: new Date(Date.now() - (idx + 27) * 86400000).toISOString()
    });
  });
  
  const petProducts = generateCatalogProducts('pet', 7);
  petProducts.forEach((product, idx) => {
    items.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      category: 'pet',
      type: 'product',
      price: product.price,
      rating: product.rating,
      image: product.image,
      brand: product.brand,
      description: product.description,
      addedAt: new Date(Date.now() - (idx + 32) * 86400000).toISOString()
    });
  });
  
  const homeProducts = generateCatalogProducts('home', 6);
  homeProducts.forEach((product, idx) => {
    items.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      category: 'home',
      type: 'product',
      price: product.price,
      rating: product.rating,
      image: product.image,
      brand: product.brand,
      description: product.description,
      addedAt: new Date(Date.now() - (idx + 39) * 86400000).toISOString()
    });
  });
  
  return items;
};

export default function DeliveryWishlist() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category') as WishlistCategory;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<WishlistCategory>(
    categoryParam && ['all', 'hotel-food', 'supermart', 'medicine', 'electronics', 'beauty', 'pet', 'home'].includes(categoryParam) 
      ? categoryParam 
      : "all"
  );
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'price'>('recent');
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(generateDummyWishlistItems());

  const getCategoryEmoji = (category: string) => {
    switch(category) {
      case 'hotel-food': return '🍔';
      case 'supermart': return '🛒';
      case 'medicine': return '💊';
      case 'electronics': return '📱';
      case 'beauty': return '💄';
      case 'pet': return '🐾';
      case 'home': return '🏠';
      default: return '📦';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'hotel-food': return 'Hotel Food';
      case 'supermart': return 'Supermart';
      case 'medicine': return 'Medicine';
      case 'electronics': return 'Electronics';
      case 'beauty': return 'Beauty';
      case 'pet': return 'Pet';
      case 'home': return 'Home';
      default: return category;
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = wishlistItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
    
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });
    
    return filtered;
  }, [selectedCategory, searchTerm, wishlistItems, sortBy]);

  const pagination = usePagination({
    data: filteredItems,
    itemsPerPage: 10,
  });

  const handleItemClick = (item: WishlistItem) => {
    if (item.type === 'product') {
      navigate(`/delivery-now/${item.category}/product/${item.productId || item.id}`);
    } else if (item.type === 'vendor') {
      const vendorId = item.id.replace('vendor-food-', '');
      navigate(`/delivery-now/${item.category}/vendor/${vendorId}`);
    }
  };

  const handleRemoveItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const WishlistCard = ({ item }: { item: WishlistItem }) => {
    return (
      <div
        onClick={() => handleItemClick(item)}
        className="w-full p-0 border border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left overflow-hidden group cursor-pointer"
        data-testid={`wishlist-item-${item.id}`}
      >
        <div className="flex flex-col gap-3 p-4">
          {/* Header Zone */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-2xl flex-shrink-0">
                {getCategoryEmoji(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold tracking-wide text-base text-white/90 truncate">
                  {item.name}
                </h3>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              {item.price && (
                <>
                  <p className="font-semibold text-lg text-white leading-tight" data-testid={`text-price-${item.id}`}>
                    ₹{item.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/40 font-light uppercase tracking-wider mt-0.5">
                    {item.type === 'vendor' ? 'Restaurant' : 'Product'}
                  </p>
                </>
              )}
              {!item.price && item.type === 'vendor' && (
                <>
                  <p className="text-[10px] text-white/40 font-light uppercase tracking-wider">
                    Restaurant
                  </p>
                  {item.distance && (
                    <p className="text-xs text-white/60 font-light mt-1">
                      {item.distance}
                    </p>
                  )}
                </>
              )}
              {item.distance && item.type === 'vendor' && item.price && (
                <p className="text-xs text-white/60 font-light mt-1">
                  {item.distance}
                </p>
              )}
            </div>
          </div>

          {/* Middle Zone - Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="font-light">
                Added on {format(new Date(item.addedAt), "dd MMM yyyy")}
              </span>
            </div>
            
            {(item.description || item.brand) && (
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 text-[11px] text-white/60 font-light">
                  {item.brand || item.description}
                </span>
              </div>
            )}
          </div>

          {/* Footer Zone */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-[10px] font-light tracking-widest">
              {getCategoryLabel(item.category).toUpperCase()}
            </Badge>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.rating && (
                <span className="text-[10px] text-white/30 font-light uppercase tracking-wider">
                  ★ {item.rating.toFixed(1)}
                </span>
              )}
              <button
                onClick={(e) => handleRemoveItem(item.id, e)}
                className="p-1.5 hover:bg-red-500/10 rounded-full transition-colors"
                data-testid={`button-remove-${item.id}`}
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" strokeWidth={1} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold tracking-wider">WISHLIST</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-sort-filter"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-white/20 text-white" align="end">
              <DropdownMenuItem 
                onClick={() => setSortBy("recent")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Recently Added
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("name")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy("price")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Price (High to Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
            <Input
              type="text"
              placeholder="SEARCH WISHLIST"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 placeholder:text-xs placeholder:tracking-widest placeholder:font-light focus:border-white/30 rounded-none h-10"
              data-testid="input-search-wishlist"
            />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="pt-24">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as WishlistCategory)} className="px-0">
          <div className="sticky top-[110px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 overflow-x-auto">
            <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto">
              <TabsTrigger 
                value="all" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-all"
              >
                <span className="text-lg">❤️</span>
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger 
                value="hotel-food" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-hotel-food"
              >
                <span className="text-lg">🍔</span>
                <span>Hotel Food</span>
              </TabsTrigger>
              <TabsTrigger 
                value="supermart" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-supermart"
              >
                <span className="text-lg">🛒</span>
                <span>Supermart</span>
              </TabsTrigger>
              <TabsTrigger 
                value="medicine" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-medicine"
              >
                <span className="text-lg">💊</span>
                <span>Medicine</span>
              </TabsTrigger>
              <TabsTrigger 
                value="electronics" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-electronics"
              >
                <span className="text-lg">📱</span>
                <span>Electronics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="beauty" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-beauty"
              >
                <span className="text-lg">💄</span>
                <span>Beauty</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pet" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-pet"
              >
                <span className="text-lg">🐾</span>
                <span>Pet</span>
              </TabsTrigger>
              <TabsTrigger 
                value="home" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-home"
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-8 px-4">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-white/10 bg-white/5">
                <Heart className="h-16 w-16 text-white/20 mb-4" strokeWidth={1} />
                <h2 className="text-lg font-bold mb-2 tracking-wide">No items in wishlist</h2>
                <p className="text-white/60 text-center mb-6 text-sm font-light">
                  {searchTerm ? `No results for "${searchTerm}"` : "Start adding items to your wishlist"}
                </p>
                <Button 
                  onClick={() => navigate("/delivery-now")} 
                  className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 font-semibold tracking-wider text-xs" 
                  data-testid="button-browse-now"
                >
                  BROWSE NOW
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {pagination.paginatedData.map((item) => (
                    <WishlistCard key={item.id} item={item} />
                  ))}
                </div>

                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                  canGoNext={pagination.canGoNext}
                  canGoPrevious={pagination.canGoPrevious}
                  startIndex={pagination.startIndex}
                  endIndex={pagination.endIndex}
                  totalItems={pagination.totalItems}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
