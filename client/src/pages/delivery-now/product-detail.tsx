import { useState, useMemo, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { WishlistNotification } from "@/components/ui/wishlist-notification";
import { 
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  X,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Clock
} from "lucide-react";
import { generateCatalogProducts, generateReviews, type Product, type ProductReview } from "@/data/delivery-now";
import { useToast } from "@/hooks/use-toast";

export function ProductDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [match, params] = useRoute("/delivery-now/:category/product/:id");
  const { toggleItem, isInWishlist } = useWishlist();
  const category = params?.category || "electronics";
  const productId = params?.id || "";
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  const allProducts = useMemo(() => generateCatalogProducts(category, 100), [category]);
  const product = useMemo(() => allProducts.find(p => p.id === productId), [allProducts, productId]);
  const reviews = useMemo(() => product ? generateReviews(product.id, 12) : [], [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
          <h2 className="text-xl font-bold mb-2">Product not found</h2>
          <Button onClick={() => navigate(`/delivery-now/${category}`)} className="bg-white text-black hover:bg-white/90 rounded-none mt-4" data-testid="button-back-to-catalog">
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const averageRating = product.rating || 4.2;
  const totalReviews = product.totalReviews || reviews.length;

  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });
    return breakdown;
  }, [reviews]);

  const addToCart = () => {
    const savedCart = localStorage.getItem('deliveryCart');
    let cart: any = savedCart ? JSON.parse(savedCart) : { items: {}, products: [] };

    if (cart.category && cart.category !== category) {
      toast({
        title: "Different Category",
        description: "Please clear your cart to add items from a different category.",
        variant: "destructive"
      });
      return;
    }

    cart = {
      vendorId: `catalog_${category}`,
      vendorName: getCategoryName(category),
      category: category,
      items: {
        ...cart.items,
        [product.id]: (cart.items[product.id] || 0) + quantity
      },
      products: cart.products.find((p: any) => p.id === product.id) ? cart.products : [...cart.products, product],
      type: 'catalog'
    };

    localStorage.setItem('deliveryCart', JSON.stringify(cart));
    
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to cart`,
    });

    navigate("/delivery-now/cart");
  };

  const buyNow = () => {
    const cart = {
      vendorId: `catalog_${category}`,
      vendorName: getCategoryName(category),
      category: category,
      items: { [product.id]: quantity },
      products: [product],
      type: 'catalog'
    };

    localStorage.setItem('deliveryCart', JSON.stringify(cart));
    navigate("/delivery-now/checkout");
  };

  const getCategoryName = (cat: string): string => {
    const names: Record<string, string> = {
      "supermart": "Supermart",
      "medicine": "Medicine",
      "electronics": "Electronics",
      "beauty": "Beauty & Personal Care",
      "pet": "Pet Supplies",
      "home": "Home & Kitchen"
    };
    return names[cat] || cat.toUpperCase();
  };

  const isProductInWishlist = isInWishlist(productId);

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      type: 'product',
      category: category as any,
      name: product.name,
      price: product.price
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <WishlistNotification />
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={goBack} 
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <h1 className="text-sm font-bold tracking-wider absolute left-1/2 -translate-x-1/2 max-w-[50%] truncate" data-testid="header-product-name">
            {product.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleWishlist}
              className="text-white hover:text-white/80"
              data-testid="button-wishlist"
            >
              <Heart className={`h-5 w-5 ${isProductInWishlist ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={1} />
            </button>
            <button className="text-white hover:text-white/80" data-testid="button-share">
              <Share2 className="h-5 w-5" strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-lg mx-auto">
        {/* Product Images with Carousel */}
        <div className="px-4 py-6">
          <ImageCarousel 
            images={images}
            productName={product.name}
            showThumbnails={true}
            testIdPrefix={`product-${product.id}`}
          />
        </div>

        {/* Product Info */}
        <div className="px-4 py-4 border-t border-white/10">
          {product.brand && (
            <p className="text-xs text-white/50 uppercase tracking-widest mb-2">{product.brand}</p>
          )}
          <h1 className="text-2xl font-bold mb-2 tracking-wide" data-testid="text-product-name">{product.name}</h1>
          <p className="text-sm text-white/60 mb-4 font-light">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-white text-white" strokeWidth={1} />
              <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-white/50">{totalReviews.toLocaleString()} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold" data-testid="text-price">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-white/40 line-through">₹{product.originalPrice}</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-none text-xs font-bold px-2 py-0.5">
                  {product.discount}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <>
                <Check className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                <span className="text-sm text-green-400 font-semibold">In Stock</span>
                {product.stockCount && product.stockCount < 10 && (
                  <span className="text-xs text-orange-400">Only {product.stockCount} left!</span>
                )}
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-400" strokeWidth={1.5} />
                <span className="text-sm text-red-400 font-semibold">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="mb-6">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 border border-white/20 bg-white/5 px-4 py-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-white/80 hover:text-white disabled:opacity-30"
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1} />
                  </button>
                  <span className="text-lg font-bold min-w-[40px] text-center" data-testid="text-quantity">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                    disabled={quantity >= (product.stockCount || 10)}
                    className="text-white/80 hover:text-white disabled:opacity-30"
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 border border-white/10 bg-white/5">
            <div className="text-center">
              <Truck className="h-5 w-5 text-white/60 mx-auto mb-1" strokeWidth={1} />
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Free Delivery</p>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 text-white/60 mx-auto mb-1" strokeWidth={1} />
              <p className="text-[10px] text-white/50 uppercase tracking-widest">30 Min Delivery</p>
            </div>
            <div className="text-center">
              <Shield className="h-5 w-5 text-white/60 mx-auto mb-1" strokeWidth={1} />
              <p className="text-[10px] text-white/50 uppercase tracking-widest">{product.returnPolicy || '7 Days Return'}</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-4 py-6 border-t border-white/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 rounded-none h-auto p-0 border border-white/10">
              <TabsTrigger value="overview" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-black text-xs uppercase tracking-widest py-3" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-black text-xs uppercase tracking-widest py-3" data-testid="tab-specs">
                Specs
              </TabsTrigger>
              <TabsTrigger value="manufacturer" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-black text-xs uppercase tracking-widest py-3" data-testid="tab-manufacturer">
                Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-black text-xs uppercase tracking-widest py-3" data-testid="tab-reviews">
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-widest">About This Product</h3>
                  <p className="text-sm text-white/70 font-light leading-relaxed">{product.description}</p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-widest">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                          <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                          <span className="font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.warranty && (
                  <div className="p-4 border border-white/10 bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-white/60" strokeWidth={1} />
                      <h4 className="text-xs font-semibold uppercase tracking-widest">Warranty</h4>
                    </div>
                    <p className="text-sm text-white/70 font-light">{product.warranty}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="mt-6">
              {product.specifications ? (
                <div className="border border-white/10 bg-white/5">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between p-4 ${idx !== 0 ? 'border-t border-white/10' : ''}`}
                      data-testid={`spec-${key.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="text-sm text-white/50 font-light">{key}</span>
                      <span className="text-sm font-semibold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-white/10 bg-white/5">
                  <Package className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-sm text-white/60">No specifications available</p>
                </div>
              )}
            </TabsContent>

            {/* Manufacturer Details Tab */}
            <TabsContent value="manufacturer" className="mt-6">
              <div className="space-y-4">
                {product.manufacturer && (
                  <div className="border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-widest">Manufacturer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Company</span>
                        <span className="font-semibold">{product.manufacturer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Country of Origin</span>
                        <span className="font-semibold">{product.manufacturer.country}</span>
                      </div>
                      {product.manufacturer.address && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Address</span>
                          <span className="font-semibold text-right">{product.manufacturer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {product.brand && (
                  <div className="border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-widest">Brand</h3>
                    <p className="text-sm font-semibold">{product.brand}</p>
                  </div>
                )}

                <div className="border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-widest">Return & Exchange Policy</h3>
                  <p className="text-sm text-white/70 font-light">{product.returnPolicy || "7 Days return policy available. Item should be unused and in original packaging."}</p>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'fill-white text-white' : 'text-white/20'}`} 
                            strokeWidth={1}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/50">{totalReviews} reviews</p>
                    </div>

                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-white/50 w-8">{rating} ★</span>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-white transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/50 w-12 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest">Customer Reviews</h3>
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-white/10 bg-white/5 p-4" data-testid={`review-${review.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold mb-1">{review.userName}</p>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${star <= review.rating ? 'fill-white text-white' : 'text-white/20'}`} 
                                strokeWidth={1}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-white/40">{review.date}</span>
                      </div>
                      <p className="text-sm text-white/70 font-light mb-3">{review.comment}</p>
                      <button className="text-xs text-white/50 hover:text-white flex items-center gap-1">
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      {product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 z-50">
          <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-3">
            <Button
              onClick={addToCart}
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 h-14 text-base font-bold tracking-wider rounded-none"
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" strokeWidth={1.5} />
              ADD TO CART
            </Button>
            <Button
              onClick={buyNow}
              className="bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none"
              data-testid="button-buy-now"
            >
              BUY NOW ₹{product.price * quantity}
              <ChevronRight className="h-5 w-5 ml-2" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
