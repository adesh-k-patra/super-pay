import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { getBrandImage } from "@/lib/brand-images";
import {
  ArrowLeft,
  Plus,
  ShoppingBag,
  Repeat,
  Clock,
  Tag,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Filter,
  Info,
  Search,
  List,
  Sparkles
} from "lucide-react";
import { getValueScoreBadge } from "@shared/coupon-value-calculator";

interface CouponData {
  code: string;
  title: string;
  brand: string;
  category: string;
  type: string;
  value: number | string;
  valueType: string;
  description?: string;
  images?: string[];
  expiryDate: string;
  minAmount?: number | string | null;
  maxDiscount?: number | string | null;
  termsConditions?: string;
  valueScore: number | string;
}

interface Listing {
  id: string;
  userId: string;
  coupons: CouponData[];
  totalCouponCount: number;
  totalFaceValue?: string;
  primaryCategory: string;
  couponCategory?: string;
  listingNote?: string;
  listingType: string;
  sellingPrice?: string;
  tradePreference?: string;
  tradeNote?: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function CouponMart() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: marketplaceListings = [] } = useQuery<Listing[]>({
    queryKey: ["/api/coupon-mart/listings", { category: categoryFilter !== "all" ? categoryFilter : undefined, status: "active" }],
  });

  const filteredListings = marketplaceListings.filter(listing => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return listing.coupons.some(coupon => 
        coupon.title.toLowerCase().includes(search) ||
        coupon.brand.toLowerCase().includes(search) ||
        coupon.description?.toLowerCase().includes(search)
      ) || listing.listingNote?.toLowerCase().includes(search);
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const days = differenceInDays(new Date(dateString), new Date());
    return days;
  };

  const isExpiringSoon = (dateString: string) => {
    const days = getDaysUntilExpiry(dateString);
    return days <= 7 && days > 0;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: "all", label: "All", icon: Tag },
    { id: "combo", label: "Combo", icon: Tag },
    { id: "food", label: "Food", icon: Tag },
    { id: "travel", label: "Travel", icon: Tag },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
    { id: "bills", label: "Bills", icon: Tag },
    { id: "medical", label: "Medical", icon: Tag },
    { id: "fitness", label: "Fitness", icon: Tag },
    { id: "education", label: "Education", icon: Tag },
    { id: "entertainment", label: "Entertainment", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate("/pro-tools")}
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">COUPON MART</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Coupon Marketplace</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/coupon-mart/info")}
              className="text-white hover:text-white/80"
              data-testid="button-header-info"
            >
              <Info className="h-5 w-5" strokeWidth={1} />
            </button>
            <button
              onClick={() => navigate("/coupon-mart/my-listings")}
              className="text-white hover:text-white/80"
              data-testid="button-header-my-listings"
            >
              <List className="h-5 w-5" strokeWidth={1} />
            </button>
            <button
              onClick={() => navigate("/coupon-mart/new-listing")}
              className="text-white hover:text-white/80"
              data-testid="button-header-new-listing"
            >
              <Plus className="h-5 w-5" strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-6">
        {/* Search & Filter Section */}
        <div className="px-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search coupons..."
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-white/10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`shrink-0 px-4 pb-3 text-[10px] font-light tracking-widest whitespace-nowrap transition-colors border-b-2 uppercase ${
                  categoryFilter === cat.id
                    ? "border-white text-white"
                    : "border-transparent text-white/50 hover:text-white/70"
                }`}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Coupons Section */}
        <div className="px-4 py-3 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-wider uppercase">Featured Coupons</h2>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="border border-white/20 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                data-testid="button-scroll-left"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1} />
              </button>
              <button
                onClick={scrollRight}
                className="border border-white/20 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                data-testid="button-scroll-right"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1} />
              </button>
            </div>
          </div>
          
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {filteredListings.slice(0, 6).map((listing) => {
              if (!listing.coupons || listing.coupons.length === 0) return null;
              const daysLeft = getDaysUntilExpiry(listing.coupons[0].expiryDate);
              const expiring = isExpiringSoon(listing.coupons[0].expiryDate);
              const valueScore = listing.coupons[0].valueScore ? parseFloat(listing.coupons[0].valueScore.toString()) : 5.0;
              const valueBadge = getValueScoreBadge(valueScore);
              
              return (
                <div
                  key={listing.id}
                  onClick={() => navigate(`/coupon-mart/listing/${listing.id}`)}
                  className="shrink-0 w-72 border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl cursor-pointer hover:border-white/20 transition-all"
                  data-testid={`card-featured-${listing.id}`}
                >
                  {/* Coupon Image */}
                  <div className="aspect-video bg-white/5 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={getBrandImage(listing.coupons[0]?.brand || "", listing.coupons[0]?.category || "") || ""}
                      alt={listing.coupons[0]?.title || ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`rounded-none text-[10px] ${valueBadge.bgClass} ${valueBadge.textClass} ${valueBadge.borderClass}`}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        {valueScore.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                            {listing.listingType}
                          </Badge>
                          {listing.totalCouponCount > 1 && (
                            <Badge className="bg-white text-black border-white rounded-none text-[10px] font-bold">
                              COMBO × {listing.totalCouponCount}
                            </Badge>
                          )}
                          {listing.totalCouponCount > 1 && listing.totalCouponCount <= 5 && (
                            <span className="text-[8px] text-green-400">MAX 5 CARDS</span>
                          )}
                        </div>
                        <h3 className="font-light text-white text-base tracking-wide line-clamp-2">{listing.coupons[0]?.title || ""}</h3>
                        <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{listing.coupons[0]?.brand || ""}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-light text-white">
                          {listing.coupons[0]?.valueType === "percentage" 
                            ? `${listing.coupons[0]?.value}%` 
                            : `₹${listing.coupons[0]?.value}`}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="h-3 w-3" strokeWidth={1} />
                          <span className={expiring ? "text-red-400" : ""}>
                            {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Eye className="h-3 w-3" strokeWidth={1} />
                          <span>{listing.views}</span>
                        </div>
                      </div>

                      {listing.listingType === "sell" && listing.sellingPrice && (
                        <div className="flex items-center justify-between bg-white/5 p-2">
                          <span className="text-xs text-white/60 uppercase tracking-widest">Price</span>
                          <span className="text-base font-light text-white">₹{listing.sellingPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Listings Grid */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-wider uppercase">All Coupons</h2>
            <p className="text-xs text-white/50">{filteredListings.length} listings</p>
          </div>

          <div className="space-y-3">
            {filteredListings.length === 0 ? (
              <div className="border border-white/10 p-12 text-center" data-testid="empty-listings">
                <Tag className="h-12 w-12 text-white/20 mx-auto mb-3" strokeWidth={1} />
                <p className="text-white/50 text-sm">No coupons found</p>
              </div>
            ) : (
              filteredListings.map((listing) => {
                if (!listing.coupons || listing.coupons.length === 0) return null;
                const daysLeft = getDaysUntilExpiry(listing.coupons[0].expiryDate);
                const expiring = isExpiringSoon(listing.coupons[0].expiryDate);
                const valueScore = listing.coupons[0].valueScore ? parseFloat(listing.coupons[0].valueScore.toString()) : 5.0;
                const valueBadge = getValueScoreBadge(valueScore);
                
                return (
                  <div
                    key={listing.id}
                    onClick={() => navigate(`/coupon-mart/listing/${listing.id}`)}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                    data-testid={`card-listing-${listing.id}`}
                  >
                    <div className="flex gap-4">
                      {/* Brand Image and Score */}
                      <div className="w-24 shrink-0 space-y-2">
                        <div className="w-24 h-24 bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 relative">
                          <img
                            src={getBrandImage(listing.coupons[0]?.brand || "", listing.coupons[0]?.category || "") || ""}
                            alt={listing.coupons[0]?.title || ""}
                            className="w-full h-full object-cover"
                          />
                          {listing.totalCouponCount > 1 && (
                            <div className="absolute top-1 right-1 bg-green-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                              ×{listing.totalCouponCount}
                            </div>
                          )}
                        </div>
                        <Badge className={`rounded-none text-sm font-semibold ${valueBadge.bgClass} ${valueBadge.textClass} ${valueBadge.borderClass} w-full justify-center`}>
                          <Sparkles className="h-4 w-4 mr-1" />
                          {valueScore.toFixed(1)}
                        </Badge>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                                {listing.listingType}
                              </Badge>
                              {listing.totalCouponCount > 1 && (
                                <Badge className="bg-white text-black border-white rounded-none text-[10px] font-bold">
                                  COMBO × {listing.totalCouponCount}
                                </Badge>
                              )}
                              <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                                {listing.couponCategory || listing.coupons[0]?.category}
                              </Badge>
                              {expiring && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/20 rounded-none text-[10px] uppercase">
                                  Expiring Soon
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-light text-white text-base tracking-wide">{listing.coupons[0]?.title || ""}</h4>
                            <p className="text-xs text-white/50 uppercase tracking-widest">{listing.coupons[0]?.brand || ""}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-light text-white">
                              {listing.coupons[0]?.valueType === "percentage" 
                                ? `${listing.coupons[0]?.value}%` 
                                : `₹${listing.coupons[0]?.value}`}
                            </div>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">
                              {listing.coupons[0]?.type.replace("_", " ")}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2 text-white/60">
                              <Calendar className="h-3 w-3" strokeWidth={1} />
                              <span className={expiring ? "text-red-400" : ""}>
                                Expires: {formatDate(listing.coupons[0].expiryDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60">
                              <Eye className="h-3 w-3" strokeWidth={1} />
                              <span>{listing.views} views</span>
                            </div>
                          </div>

                          {listing.listingType === "sell" && listing.sellingPrice && (
                            <div className="flex items-center justify-between bg-white/5 p-2">
                              <span className="text-xs text-white/60 uppercase tracking-widest">Price</span>
                              <span className="text-base font-light text-white">₹{listing.sellingPrice}</span>
                            </div>
                          )}

                          {listing.listingType === "trade" && listing.tradePreference && (
                            <div className="bg-white/5 p-2">
                              <span className="text-xs text-white/60 uppercase tracking-widest block mb-1">Looking For</span>
                              <p className="text-xs text-white line-clamp-2">{listing.tradePreference}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
