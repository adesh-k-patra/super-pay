import { useState, useMemo, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { WishlistNotification } from "@/components/ui/wishlist-notification";
import { 
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Share2,
  Heart,
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Info,
  TrendingUp,
  Award,
  ChevronDown,
  Percent,
  ChevronRight,
  Gift,
  MessageSquare,
  ImageIcon,
  Calendar,
  ShoppingBag,
  ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateHotelVendors, generateHotelMenuProducts, type HotelVendor, type VendorOffer, type VendorReview } from "@/data/delivery-now";

export default function VendorDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [, params] = useRoute("/delivery-now/:category/vendor/:id");
  const { toggleItem, isInWishlist } = useWishlist();
  
  const [selectedTab, setSelectedTab] = useState("overview");
  const [menuTab, setMenuTab] = useState<string>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const vendorIdOrSlug = params?.id || "1";
  const category = params?.category || "hotel-food";
  
  // Get vendor data
  const allVendors = useMemo(() => generateHotelVendors(), []);
  const vendor: HotelVendor = useMemo(() => 
    allVendors.find(v => v.id === vendorIdOrSlug || v.slug === vendorIdOrSlug) || allVendors[0],
    [allVendors, vendorIdOrSlug]
  );

  // Get products for this vendor
  const products = useMemo(() => generateHotelMenuProducts(vendor.id), [vendor.id]);

  // Get unique menu categories
  const menuCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["all", "trending", ...Array.from(cats)];
  }, [products]);

  // Filter products based on menu tab and search
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (menuTab === "trending") {
      filtered = filtered.filter(p => p.isBestseller);
    } else if (menuTab !== "all") {
      filtered = filtered.filter(p => p.category === menuTab);
    }
    
    return filtered;
  }, [products, searchTerm, menuTab]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  // Cart functions
  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, count]) => {
    const product = products.find(p => p.id === itemId);
    if (product) {
      return sum + product.price * count;
    }
    const offer = vendor.detailedOffers?.find(o => o.id === itemId);
    if (offer && offer.discountedPrice) {
      return sum + offer.discountedPrice * count;
    }
    return sum;
  }, 0);

  // Wishlist functions
  const handleToggleWishlist = () => {
    toggleItem({
      id: vendor.id,
      type: 'vendor',
      category: category as any,
      name: vendor.name,
      rating: vendor.rating,
      vendorName: vendor.name
    });
  };

  const handleToggleProductWishlist = (product: any) => {
    toggleItem({
      id: product.id,
      type: 'product',
      category: category as any,
      name: product.name,
      price: product.price,
      vendorName: vendor.name
    });
  };

  const isVendorInWishlist = isInWishlist(vendor.id);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <WishlistNotification />
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button 
            onClick={goBack} 
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <h1 className="text-sm font-bold tracking-wider absolute left-1/2 -translate-x-1/2">
            {vendor.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleWishlist}
              className="text-white hover:text-white/80"
              data-testid="button-wishlist-vendor"
            >
              <Heart 
                className={`h-5 w-5 ${isVendorInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
                strokeWidth={1} 
              />
            </button>
            <button className="text-white hover:text-white/80" data-testid="button-share">
              <Share2 className="h-5 w-5" strokeWidth={1} />
            </button>
            <button
              onClick={() => navigate(`/delivery-now/wishlist?category=${category}`)}
              className="text-white hover:text-white/80"
              data-testid="button-wishlist-page"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section with Image Carousel */}
        <div className="px-4 py-6">
          <ImageCarousel 
            images={vendor.images || [vendor.image]}
            productName={vendor.name}
            showThumbnails={true}
            testIdPrefix="vendor"
          />
          
          {/* Key Details */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-4 w-4 fill-white text-white" strokeWidth={1} />
                <span className="text-lg font-bold">{vendor.rating}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-widest">
                {vendor.totalRatings} ratings
              </p>
            </div>
            <div className="border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-white/60" strokeWidth={1} />
                <span className="text-sm font-bold">{vendor.deliveryTime}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-widest">Delivery</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-4 w-4 text-white/60" strokeWidth={1} />
                <span className="text-sm font-bold">{vendor.distance}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-widest">Distance</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <TabsList className="bg-transparent border-none w-full h-auto p-0 rounded-none flex justify-start overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/40 font-light text-xs uppercase tracking-widest rounded-none py-4 px-6 border-b-2 border-transparent whitespace-nowrap"
                data-testid="tab-overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="menu"
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/40 font-light text-xs uppercase tracking-widest rounded-none py-4 px-6 border-b-2 border-transparent whitespace-nowrap"
                data-testid="tab-menu"
              >
                Menu
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/40 font-light text-xs uppercase tracking-widest rounded-none py-4 px-6 border-b-2 border-transparent whitespace-nowrap"
                data-testid="tab-offers"
              >
                Offers
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/40 font-light text-xs uppercase tracking-widest rounded-none py-4 px-6 border-b-2 border-transparent whitespace-nowrap"
                data-testid="tab-reviews"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/40 font-light text-xs uppercase tracking-widest rounded-none py-4 px-6 border-b-2 border-transparent whitespace-nowrap"
                data-testid="tab-gallery"
              >
                Gallery
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="px-4 py-6 space-y-6">
              {/* Summary */}
              {vendor.summary && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" strokeWidth={1} />
                    About
                  </h3>
                  <p className="text-sm text-white/70 font-light leading-relaxed">
                    {vendor.summary}
                  </p>
                </div>
              )}

              {/* Started & Listed Dates */}
              <div className="border border-white/10 bg-white/5 p-4 space-y-3">
                {vendor.startedOn && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Started On</span>
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1} />
                      {vendor.startedOn}
                    </span>
                  </div>
                )}
                {vendor.listedOn && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Listed On</span>
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1} />
                      {vendor.listedOn}
                    </span>
                  </div>
                )}
              </div>

              {/* Recognition */}
              {vendor.recognition && vendor.recognition.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" strokeWidth={1} />
                    Recognition
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.recognition.map((badge, index) => (
                      <Badge 
                        key={index}
                        className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-none text-xs px-3 py-1.5 font-light"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Details */}
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" strokeWidth={1} />
                  Ratings & Reviews
                </h3>
                <div className="border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <div className="text-4xl font-bold">{vendor.rating}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-white" strokeWidth={1} />
                        <Star className="h-4 w-4 fill-white" strokeWidth={1} />
                        <Star className="h-4 w-4 fill-white" strokeWidth={1} />
                        <Star className="h-4 w-4 fill-white" strokeWidth={1} />
                        <Star className="h-4 w-4 fill-white/30" strokeWidth={1} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/60 font-light">
                        Based on {vendor.totalRatings.toLocaleString()} ratings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Details */}
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Details</h3>
                <div className="border border-white/10 bg-white/5 divide-y divide-white/10">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Cuisines</span>
                    <span className="text-sm font-semibold">{vendor.cuisines.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Cost for two</span>
                    <span className="text-sm font-semibold">₹{vendor.costForTwo}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Min order</span>
                    <span className="text-sm font-semibold">₹{vendor.minOrder}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Delivery fee</span>
                    <span className="text-sm font-semibold">
                      {vendor.deliveryFee === 0 ? "FREE" : `₹${vendor.deliveryFee}`}
                    </span>
                  </div>
                  {vendor.menuCount && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-xs text-white/50 uppercase tracking-widest">Menu Items</span>
                      <span className="text-sm font-semibold">{vendor.menuCount}+</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="mt-0">
            {/* Search Bar */}
            <div className="sticky top-[calc(64px+52px)] z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                <Input
                  type="text"
                  placeholder="SEARCH MENU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 placeholder:text-xs placeholder:tracking-widest placeholder:font-light focus:border-white/30 rounded-none h-10"
                  data-testid="input-search-menu"
                />
              </div>
            </div>

            {/* Menu Category Tabs */}
            <div className="sticky top-[calc(64px+52px+56px)] z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {menuCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMenuTab(cat)}
                    className={`shrink-0 px-4 py-2 text-xs font-semibold tracking-wider whitespace-nowrap transition-colors border ${
                      menuTab === cat
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                    }`}
                    data-testid={`button-menu-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 py-6 space-y-6">
              {Object.entries(groupedProducts).map(([categoryName, items]) => (
                <div key={categoryName}>
                  <h2 className="text-sm font-bold tracking-wider uppercase mb-4 pb-2 border-b border-white/10">
                    {categoryName}
                    <span className="ml-2 text-[10px] text-white/40 font-light">({items.length})</span>
                  </h2>
                  
                  <div className="space-y-4">
                    {items.map((product) => (
                      <div
                        key={product.id}
                        className="border border-white/10 bg-white/5 p-4"
                        data-testid={`card-product-${product.id}`}
                      >
                        <div className="flex gap-4">
                          {/* Product Image Carousel */}
                          {product.images && product.images.length > 0 && (
                            <div className="w-32 shrink-0">
                              <ImageCarousel
                                images={product.images}
                                productName={product.name}
                                showThumbnails={false}
                                testIdPrefix={`product-${product.id}`}
                                className="!aspect-square"
                              />
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              {product.isVeg === 1 ? (
                                <div className="w-4 h-4 border border-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-0.5">
                                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-semibold">{product.name}</h3>
                                  {product.isBestseller && (
                                    <TrendingUp className="h-3 w-3 text-orange-400" strokeWidth={1} />
                                  )}
                                  <button
                                    onClick={() => handleToggleProductWishlist(product)}
                                    className="ml-auto text-white/50 hover:text-white"
                                    data-testid={`button-wishlist-product-${product.id}`}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                                      strokeWidth={1}
                                    />
                                  </button>
                                </div>
                                <p className="text-xs text-white/50 font-light mb-2 line-clamp-2">
                                  {product.description}
                                </p>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <p className="text-lg font-bold">₹{product.price}</p>
                                    {product.originalPrice && product.discount && (
                                      <>
                                        <p className="text-xs text-white/40 line-through">
                                          ₹{product.originalPrice}
                                        </p>
                                        <Badge className="bg-green-500/90 text-white text-[9px] px-1.5 py-0 rounded-none font-bold h-4">
                                          {product.discount}% OFF
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                  {product.rating && (
                                    <div className="flex items-center gap-1 text-[10px] text-white/60">
                                      <Star className="h-3 w-3 fill-white/60" strokeWidth={1} />
                                      <span>{product.rating}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Add to Cart Button */}
                                <div className="flex items-center gap-2">
                                  <AnimatePresence mode="wait">
                                    {cart[product.id] ? (
                                      <motion.div 
                                        key="quantity-controls"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5"
                                      >
                                        <button 
                                          onClick={() => removeFromCart(product.id)} 
                                          data-testid={`button-decrement-${product.id}`}
                                          className="text-white/80 hover:text-white"
                                        >
                                          <Minus className="h-3.5 w-3.5" strokeWidth={1} />
                                        </button>
                                        <span className="text-white font-bold text-sm min-w-[24px] text-center" data-testid={`text-quantity-${product.id}`}>
                                          {cart[product.id]}
                                        </span>
                                        <button 
                                          onClick={() => addToCart(product.id)} 
                                          data-testid={`button-increment-${product.id}`}
                                          className="text-white/80 hover:text-white"
                                        >
                                          <Plus className="h-3.5 w-3.5" strokeWidth={1} />
                                        </button>
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key="add-button"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                      >
                                        <Button
                                          size="sm"
                                          onClick={() => addToCart(product.id)}
                                          className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-6 font-semibold tracking-wider text-xs"
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 border border-white/10 bg-white/5">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-sm text-white/60 font-semibold mb-2">No items found</p>
                  <p className="text-xs text-white/40 font-light">Try searching for something else</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="mt-0">
            <div className="px-4 py-6 space-y-4">
              {vendor.detailedOffers && vendor.detailedOffers.length > 0 ? (
                vendor.detailedOffers.map((offer: VendorOffer, index: number) => (
                  <div
                    key={offer.id}
                    className="border border-white/10 bg-white/5 p-4"
                    data-testid={`offer-card-${index}`}
                  >
                    <div className="flex gap-4">
                      {/* Offer Image Carousel */}
                      {offer.images && offer.images.length > 0 && (
                        <div className="w-32 shrink-0">
                          <ImageCarousel
                            images={offer.images}
                            productName={offer.title}
                            showThumbnails={false}
                            testIdPrefix={`offer-${offer.id}`}
                            className="!aspect-square"
                          />
                        </div>
                      )}
                      
                      {/* Offer Details */}
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          {offer.isVeg === 1 ? (
                            <div className="w-4 h-4 border border-green-500 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-semibold">{offer.title}</h3>
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[9px] px-1.5 py-0 rounded-none font-bold h-4 uppercase">
                                {offer.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-white/50 font-light mb-2 line-clamp-2">
                              {offer.description}
                            </p>
                            
                            {/* Offer Items List */}
                            {offer.items && offer.items.length > 0 && (
                              <div className="mb-3 space-y-1">
                                {offer.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-white/60">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-bold">₹{offer.discountedPrice}</p>
                                {offer.originalPrice && offer.discountedPrice && (
                                  <>
                                    <p className="text-xs text-white/40 line-through">
                                      ₹{offer.originalPrice}
                                    </p>
                                    <Badge className="bg-green-500/90 text-white text-[9px] px-1.5 py-0 rounded-none font-bold h-4">
                                      {Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}% OFF
                                    </Badge>
                                  </>
                                )}
                              </div>
                              {offer.rating && (
                                <div className="flex items-center gap-1 text-[10px] text-white/60">
                                  <Star className="h-3 w-3 fill-white/60" strokeWidth={1} />
                                  <span>{offer.rating}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Add to Cart Button */}
                            <div className="flex items-center gap-2">
                              <AnimatePresence mode="wait">
                                {cart[offer.id] ? (
                                  <motion.div 
                                    key="quantity-controls"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5"
                                  >
                                    <button 
                                      onClick={() => removeFromCart(offer.id)} 
                                      data-testid={`button-decrement-${offer.id}`}
                                      className="text-white/80 hover:text-white"
                                    >
                                      <Minus className="h-3.5 w-3.5" strokeWidth={1} />
                                    </button>
                                    <span className="text-white font-bold text-sm min-w-[24px] text-center" data-testid={`text-quantity-${offer.id}`}>
                                      {cart[offer.id]}
                                    </span>
                                    <button 
                                      onClick={() => addToCart(offer.id)} 
                                      data-testid={`button-increment-${offer.id}`}
                                      className="text-white/80 hover:text-white"
                                    >
                                      <Plus className="h-3.5 w-3.5" strokeWidth={1} />
                                    </button>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="add-button"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                  >
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(offer.id)}
                                      className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-6 font-semibold tracking-wider text-xs"
                                      data-testid={`button-add-${offer.id}`}
                                    >
                                      ADD
                                    </Button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-white/10 bg-white/5">
                  <Gift className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-sm text-white/60 font-semibold mb-2">No offers available</p>
                  <p className="text-xs text-white/40 font-light">Check back later for exciting deals</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0">
            <div className="px-4 py-6 space-y-4">
              {vendor.reviews && vendor.reviews.length > 0 ? (
                vendor.reviews.map((review: VendorReview, index: number) => (
                  <div 
                    key={review.id}
                    className="border border-white/10 bg-white/5 p-4"
                    data-testid={`review-card-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold">{review.userName}</h4>
                        <p className="text-xs text-white/40 font-light">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1">
                        <Star className="h-3 w-3 fill-white text-white" strokeWidth={1} />
                        <span className="text-xs font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 font-light leading-relaxed mb-3">
                      {review.comment}
                    </p>
                    <button className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
                      <ThumbsUp className="h-3 w-3" strokeWidth={1} />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-white/10 bg-white/5">
                  <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-sm text-white/60 font-semibold mb-2">No reviews yet</p>
                  <p className="text-xs text-white/40 font-light">Be the first to review</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-0">
            <div className="px-4 py-6">
              {vendor.gallery && vendor.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {vendor.gallery.map((image, index) => (
                    <div 
                      key={index}
                      className="aspect-square bg-white/5 border border-white/10 overflow-hidden"
                      data-testid={`gallery-image-${index}`}
                    >
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-white/10 bg-white/5">
                  <ImageIcon className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-sm text-white/60 font-semibold mb-2">No gallery images</p>
                  <p className="text-xs text-white/40 font-light">Images will appear here soon</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 px-4 pb-4 z-50 bg-gradient-to-t from-black via-black to-transparent pt-6"
          >
            <Button
              onClick={() => {
                const allProducts = [
                  ...products,
                  ...(vendor.detailedOffers || []).map(offer => ({
                    id: offer.id,
                    name: offer.title,
                    description: offer.description,
                    price: offer.discountedPrice || 0,
                    originalPrice: offer.originalPrice,
                    image: offer.images?.[0] || '',
                    images: offer.images,
                    category: offer.type || 'Offer',
                    isVeg: offer.isVeg,
                    rating: offer.rating,
                    isBestseller: false
                  }))
                ];
                
                localStorage.setItem('deliveryCart', JSON.stringify({
                  vendorId: vendor.id,
                  vendorName: vendor.name,
                  category: category,
                  items: cart,
                  products: allProducts,
                  type: 'vendor'
                }));
                navigate("/delivery-now/cart");
              }}
              className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none shadow-2xl border border-white/20"
              data-testid="button-view-cart"
            >
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                  <span>{cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>₹{cartTotal}</span>
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </div>
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
