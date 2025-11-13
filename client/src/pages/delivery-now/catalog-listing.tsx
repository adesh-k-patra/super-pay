import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WishlistNotification } from "@/components/ui/wishlist-notification";
import { 
  Search,
  ArrowLeft,
  Star,
  X,
  SlidersHorizontal,
  ShoppingCart,
  ChevronRight,
  Package,
  Heart,
  ShoppingBag
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCatalogProducts } from "@/data/delivery-now";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  [productId: string]: number;
}

export function CatalogListing() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [match, params] = useRoute("/delivery-now/:category");
  const { toggleItem, isInWishlist } = useWishlist();
  const category = params?.category || "supermart";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [sortBy, setSortBy] = useState<"popularity" | "price-low" | "price-high" | "rating">("popularity");
  const [cart, setCart] = useState<CartItem>(() => {
    const saved = localStorage.getItem('deliveryCart');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.category === category) return data.items || {};
    }
    return {};
  });

  // Ref for tab elements to scroll selected tab to center
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Generate products for the category
  const allProducts = useMemo(() => generateCatalogProducts(category, 50), [category]);

  // Get unique subcategories
  const subcategories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category));
    return ["all", "offers", ...Array.from(cats)];
  }, [allProducts]);

  // Category display names
  const categoryNames: Record<string, string> = {
    "supermart": "Supermart",
    "medicine": "Medicine",
    "electronics": "Electronics",
    "beauty": "Beauty & Personal Care",
    "pet": "Pet Supplies",
    "home": "Home & Kitchen"
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Subcategory filter
    if (selectedSubcategory === "offers") {
      filtered = filtered.filter(p => p.discount && p.discount > 0);
    } else if (selectedSubcategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedSubcategory);
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter(p => {
        if (priceFilter === "low") return p.price < 200;
        if (priceFilter === "medium") return p.price >= 200 && p.price < 1000;
        if (priceFilter === "high") return p.price >= 1000;
        return true;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // popularity (default order)
    });

    return sorted;
  }, [allProducts, searchQuery, selectedSubcategory, priceFilter, sortBy]);

  // Cart functions
  const addToCart = (productId: string) => {
    setCart(prev => {
      const newCart = {
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      };
      // Persist to localStorage
      localStorage.setItem('deliveryCart', JSON.stringify({
        vendorId: `catalog_${category}`,
        vendorName: categoryNames[category],
        category: category,
        items: newCart,
        products: allProducts,
        type: 'catalog'
      }));
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      // Persist to localStorage
      localStorage.setItem('deliveryCart', JSON.stringify({
        vendorId: `catalog_${category}`,
        vendorName: categoryNames[category],
        category: category,
        items: newCart,
        products: allProducts,
        type: 'catalog'
      }));
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = allProducts.find(p => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  // Scroll selected tab to center
  useEffect(() => {
    const selectedTab = tabRefs.current[selectedSubcategory];
    if (selectedTab) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedSubcategory]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <WishlistNotification />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-6">
          <button 
            onClick={goBack} 
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-lg font-bold tracking-wide text-center mt-1" data-testid="text-category-name">
              {categoryNames[category] || category.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/delivery-now/wishlist?category=${category}`)}
              className="text-white/50 hover:text-white transition-colors"
              data-testid="button-wishlist-page"
            >
              <Heart className="h-5 w-5" strokeWidth={1} />
            </button>
            <button
              onClick={() => navigate(`/delivery-now/orders?category=${category}`)}
              className="text-white/50 hover:text-white transition-colors"
              data-testid="button-orders"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/30" strokeWidth={1} />
            <Input
              placeholder={`Search in ${categoryNames[category]}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-none"
              data-testid="input-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" strokeWidth={1} />
              </button>
            )}
          </div>
        </div>

        {/* Subcategory Tabs */}
        <div className="pb-3">
          <Tabs value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <div className="overflow-x-auto hide-scrollbar">
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none flex gap-0 px-4">
                {subcategories.map((subcat) => (
                  <TabsTrigger
                    key={subcat}
                    value={subcat}
                    ref={(el) => tabRefs.current[subcat] = el}
                    className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70 whitespace-nowrap px-4 flex-shrink-0"
                    data-testid={`button-subcategory-${subcat}`}
                  >
                    {subcat.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex items-center gap-2 px-4 pb-3">
          {/* Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white rounded-none h-9 px-4"
                data-testid="button-open-filters"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" strokeWidth={1} />
                FILTERS
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-black text-white border-white/10 rounded-none">
              <SheetHeader>
                <SheetTitle className="text-white font-bold tracking-wide">FILTERS</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Price Filter */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 tracking-wide">PRICE RANGE</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: "all", label: "All" },
                      { value: "low", label: "Under ₹200" },
                      { value: "medium", label: "₹200-₹1000" },
                      { value: "high", label: "Above ₹1000" }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setPriceFilter(value as any)}
                        className={`px-3 py-2 text-xs border font-semibold tracking-wider ${
                          priceFilter === value
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white/70 border-white/20"
                        }`}
                        data-testid={`button-price-${value}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 tracking-wide">SORT BY</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "popularity", label: "Popularity" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "rating", label: "Rating" }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setSortBy(value as any)}
                        className={`px-3 py-2 text-xs border font-semibold tracking-wider ${
                          sortBy === value
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white/70 border-white/20"
                        }`}
                        data-testid={`button-sort-${value}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Active filters count */}
          <div className="flex-1 text-xs text-white/50 font-light">
            {filteredProducts.length} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const isProductInWishlist = isInWishlist(product.id);
              
              return (
              <div
                key={product.id}
                className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                data-testid={`card-product-${product.id}`}
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-square bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/delivery-now/${category}/product/${product.id}`)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.isBestseller && (
                    <Badge className="absolute top-2 left-2 bg-white text-black text-[10px] px-2 py-0.5 rounded-none font-bold tracking-wider">
                      BESTSELLER
                    </Badge>
                  )}
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem({
                        id: product.id,
                        type: 'product',
                        category: category as any,
                        name: product.name,
                        price: product.price
                      });
                    }}
                    data-testid={`button-wishlist-${product.id}`}
                  >
                    <Heart 
                      className={`h-3.5 w-3.5 ${isProductInWishlist ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                      strokeWidth={1} 
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-1 font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5">
                      <Star className="h-2.5 w-2.5 fill-white text-white" strokeWidth={1} />
                      <span className="text-[10px] font-semibold">{product.rating}</span>
                    </div>
                  </div>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      {product.originalPrice && product.discount ? (
                        <>
                          <div className="flex items-center gap-1">
                            <span className="text-base font-bold" data-testid={`text-price-${product.id}`}>₹{product.price}</span>
                            <span className="text-xs text-white/40 line-through">₹{product.originalPrice}</span>
                          </div>
                          <Badge className="bg-green-500/90 text-white text-[9px] px-1.5 py-0 rounded-none font-bold h-4 w-fit">
                            {product.discount}% OFF
                          </Badge>
                        </>
                      ) : (
                        <div className="text-base font-bold" data-testid={`text-price-${product.id}`}>
                          ₹{product.price}
                        </div>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {cart[product.id] ? (
                        <motion.div 
                          key="quantity-controls"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="flex items-center gap-2 border border-white/20 bg-white/5 px-2 py-1"
                        >
                          <button 
                            onClick={() => removeFromCart(product.id)} 
                            data-testid={`button-decrement-${product.id}`}
                            className="text-white/80 hover:text-white"
                          >
                            <X className="h-3 w-3" strokeWidth={1} />
                          </button>
                          <motion.span 
                            key={cart[product.id]}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                            className="text-xs font-bold min-w-[16px] text-center" 
                            data-testid={`text-quantity-${product.id}`}
                          >
                            {cart[product.id]}
                          </motion.span>
                          <button 
                            onClick={() => addToCart(product.id)} 
                            data-testid={`button-increment-${product.id}`}
                            className="text-white/80 hover:text-white"
                          >
                            <ChevronRight className="h-3 w-3" strokeWidth={1} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="add-button"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Button
                            size="sm"
                            onClick={() => addToCart(product.id)}
                            className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-3 text-xs font-bold tracking-wider"
                            data-testid={`button-add-${product.id}`}
                          >
                            ADD
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border border-white/10 bg-white/5">
            <Package className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
            <p className="text-sm text-white/60 font-semibold mb-2">No products found</p>
            <p className="text-xs text-white/40 font-light">Try adjusting your filters or search</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 px-4 pb-4 z-50 bg-gradient-to-t from-black via-black to-transparent pt-6"
          >
            <div className="max-w-screen-lg mx-auto">
              <Button
                onClick={() => {
                  localStorage.setItem('deliveryCart', JSON.stringify({
                    vendorId: `catalog_${category}`,
                    vendorName: categoryNames[category],
                    category: category,
                    items: cart,
                    products: allProducts
                  }));
                  navigate("/delivery-now/cart");
                }}
                className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none shadow-2xl border border-white/20"
                data-testid="button-view-cart"
              >
                <div className="flex items-center justify-between w-full px-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                    >
                      {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      key={cartTotal}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                    >
                      ₹{cartTotal}
                    </motion.span>
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
