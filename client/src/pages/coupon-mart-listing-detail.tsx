import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, differenceInDays } from "date-fns";
import { getBrandImage } from "@/lib/brand-images";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Tag,
  User,
  Star,
  ShoppingBag,
  Repeat,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { getValueScoreBadge } from "@shared/coupon-value-calculator";
import { cn } from "@/lib/utils";
import type { TradeCouponRequirement } from "@shared/schema";

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
  listingNote?: string;
  listingType: string;
  sellingPrice?: string;
  tradePreference?: string;
  tradeNote?: string;
  tradeCategory?: string;
  tradeCouponsRequired?: number;
  tradeMinValueScore?: string;
  tradeMaxValueScore?: string;
  tradeCouponRequirements?: TradeCouponRequirement[];
  status: string;
  views: number;
  createdAt: string;
}

export default function CouponMartListingDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/listing/:id");
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "trade">("overview");
  const [isCheckingTrade, setIsCheckingTrade] = useState(false);
  const [tradeCheckResult, setTradeCheckResult] = useState<{
    hasMatches: boolean;
    matchCount?: number;
    requirements?: string[];
    missingRequirements?: string[];
  } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const listingId = params?.id || "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: listing, isLoading, error } = useQuery<Listing>({
    queryKey: ["/api/coupon-mart/listings", listingId],
    enabled: !!listingId,
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

  const cancelListingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/coupon-mart/listings/${listingId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings", listingId] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings"] });
      toast({
        title: "Listing Cancelled",
        description: "Your listing has been successfully cancelled.",
      });
      setShowCancelDialog(false);
      navigate("/coupon-mart");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyNow = () => {
    if (!listing) return;
    
    if (listing.listingType === "sell") {
      navigate(`/coupon-mart/payment/${listing.id}`);
    } else {
      navigate(`/coupon-mart/trade/${listing.id}`);
    }
  };

  const handleCancelListing = () => {
    cancelListingMutation.mutate();
  };

  const handlePrevCoupon = () => {
    if (currentCouponIndex > 0) {
      setCurrentCouponIndex(currentCouponIndex - 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextCoupon = () => {
    if (listing && currentCouponIndex < listing.coupons.length - 1) {
      setCurrentCouponIndex(currentCouponIndex + 1);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCheckTradeAvailability = async () => {
    setIsCheckingTrade(true);
    setTradeCheckResult(null);
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock result - in production this would check against user's coupons
    const mockResult = {
      hasMatches: Math.random() > 0.3,
      matchCount: Math.floor(Math.random() * 5) + 1,
      requirements: ["Food & Dining category", "Minimum value score: 7.0", "At least 1 coupon"],
      missingRequirements: Math.random() > 0.5 ? ["Need higher value score coupons"] : []
    };
    
    setTradeCheckResult(mockResult);
    setIsCheckingTrade(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/50">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing || !listing.coupons || listing.coupons.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center border border-white/10 p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Listing Not Found</h2>
          <p className="text-white/50 text-sm mb-6">
            This listing doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/coupon-mart")}
            className="bg-white text-black hover:bg-white/90 rounded-none"
            data-testid="button-back-home"
          >
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const currentCoupon = listing.coupons[currentCouponIndex];
  const daysLeft = getDaysUntilExpiry(currentCoupon.expiryDate);
  const expiring = isExpiringSoon(currentCoupon.expiryDate);
  const isOwner = user?.id === listing.userId;
  
  const valueScore = currentCoupon.valueScore ? parseFloat(currentCoupon.valueScore.toString()) : 5.0;
  const valueBadge = getValueScoreBadge(valueScore);
  const totalCoupons = listing.coupons.length;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate("/coupon-mart")}
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider">COUPON BUNDLE</h1>
            {totalCoupons > 1 && (
              <p className="text-[10px] text-white/50">{totalCoupons} Coupons</p>
            )}
          </div>
          <div className="w-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16" ref={scrollContainerRef}>
        {/* Multiple Coupons Navigation */}
        {totalCoupons > 1 && (
          <div className="px-4 pt-4 pb-2">
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-white/60" />
                  <span className="text-xs text-white/60 uppercase tracking-wider">
                    Coupon {currentCouponIndex + 1} of {totalCoupons}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevCoupon}
                    disabled={currentCouponIndex === 0}
                    className={cn(
                      "border border-white/20 bg-white/5 p-1.5 transition-colors",
                      currentCouponIndex === 0 
                        ? "opacity-30 cursor-not-allowed" 
                        : "hover:bg-white/10"
                    )}
                    data-testid="button-prev-coupon"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1} />
                  </button>
                  <button
                    onClick={handleNextCoupon}
                    disabled={currentCouponIndex === totalCoupons - 1}
                    className={cn(
                      "border border-white/20 bg-white/5 p-1.5 transition-colors",
                      currentCouponIndex === totalCoupons - 1
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-white/10"
                    )}
                    data-testid="button-next-coupon"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1} />
                  </button>
                </div>
              </div>
              
              {/* Dot Indicators */}
              <div className="flex gap-1.5 justify-center">
                {listing.coupons.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCouponIndex(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === currentCouponIndex
                        ? "bg-white w-6"
                        : "bg-white/30 w-1.5 hover:bg-white/50"
                    )}
                    data-testid={`indicator-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image */}
        <div className="px-4 py-4">
          <ImageCarousel
            images={[getBrandImage(currentCoupon.brand, currentCoupon.category) || ""]}
            productName={currentCoupon.title}
            showThumbnails={false}
            testIdPrefix="coupon"
          />
        </div>

        {/* Content */}
        <div className="px-4">
          {listing.listingType === "trade" ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "overview" | "trade")} className="w-full">
              <TabsList className="bg-transparent w-full grid grid-cols-2 gap-0 h-auto p-0 border-b border-white/10">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 data-[state=active]:border-white data-[state=inactive]:border-transparent data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent text-white/60 data-[state=active]:text-white py-3 text-sm uppercase tracking-wider"
                  data-testid="tab-overview"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="trade"
                  className="rounded-none border-b-2 data-[state=active]:border-white data-[state=inactive]:border-transparent data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent text-white/60 data-[state=active]:text-white py-3 text-sm uppercase tracking-wider"
                  data-testid="tab-trade"
                >
                  Trade
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                  {listing.listingType}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                  {currentCoupon.category}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                  {currentCoupon.type.replace("_", " ")}
                </Badge>
                <Badge className={`rounded-none text-[10px] ${valueBadge.bgClass} ${valueBadge.textClass} ${valueBadge.borderClass}`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {valueScore.toFixed(1)}/10
                </Badge>
                {expiring && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/20 rounded-none text-[10px] uppercase">
                    Expiring Soon
                  </Badge>
                )}
                {listing.status !== "active" && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 rounded-none text-[10px] uppercase">
                    {listing.status}
                  </Badge>
                )}
              </div>

              {/* Title & Brand */}
              <div>
                <h1 className="text-2xl font-light tracking-tight mb-2">{currentCoupon.title}</h1>
                <p className="text-sm text-white/60 uppercase tracking-widest">{currentCoupon.brand}</p>
              </div>

              {/* Value */}
              <div className="border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-white/5 to-transparent">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-3">Coupon Value</p>
                  <div className="text-4xl font-light text-white tracking-tight">
                    {currentCoupon.valueType === "percentage"
                      ? `${currentCoupon.value}% OFF`
                      : `₹${currentCoupon.value}`}
                  </div>
                </div>
                {(currentCoupon.maxDiscount || currentCoupon.minAmount) && (
                  <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
                    {currentCoupon.maxDiscount && (
                      <div className="p-3 bg-white/[0.02]">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Max Discount</p>
                        <p className="text-sm font-semibold text-white">₹{currentCoupon.maxDiscount}</p>
                      </div>
                    )}
                    {currentCoupon.minAmount && (
                      <div className={`p-3 bg-white/[0.02] ${!currentCoupon.maxDiscount ? 'col-span-2' : ''}`}>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Min Order Value</p>
                        <p className="text-sm font-semibold text-white">₹{currentCoupon.minAmount}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {(currentCoupon.description || listing.listingNote) && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Description</h3>
                  <p className="text-sm text-white/70 font-light leading-relaxed">
                    {currentCoupon.description || listing.listingNote}
                  </p>
                </div>
              )}

              {/* Key Details */}
              <div className="border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Expires On</span>
                  <span className={`text-sm font-semibold flex items-center gap-2 ${expiring ? "text-red-400" : ""}`}>
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1} />
                    {formatDate(currentCoupon.expiryDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Days Left</span>
                  <span className={`text-sm font-semibold ${expiring ? "text-red-400" : daysLeft < 0 ? "text-red-500" : ""}`}>
                    {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? "Today" : "Expired"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Views</span>
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5" strokeWidth={1} />
                    {listing.views}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Listed On</span>
                  <span className="text-sm font-semibold">
                    {formatDate(listing.createdAt)}
                  </span>
                </div>
              </div>

              {/* Bundle Info */}
              {totalCoupons > 1 && (
                <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4" strokeWidth={1} />
                    Bundle Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 uppercase tracking-widest">Total Coupons</span>
                      <span className="text-sm font-semibold">{totalCoupons}</span>
                    </div>
                    {listing.totalFaceValue && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50 uppercase tracking-widest">Total Face Value</span>
                        <span className="text-sm font-semibold">₹{listing.totalFaceValue}</span>
                      </div>
                    )}
                    {listing.listingType === "sell" && listing.sellingPrice && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-white/50 uppercase tracking-widest">Bundle Price</span>
                        <span className="text-lg font-light text-white">₹{listing.sellingPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* All Coupons in Bundle */}
              {totalCoupons > 1 && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3">All Coupons in Bundle</h3>
                  <div className="space-y-2">
                    {listing.coupons.map((coupon, index) => {
                      const couponValueScore = coupon.valueScore ? parseFloat(coupon.valueScore.toString()) : 5.0;
                      const couponBadge = getValueScoreBadge(couponValueScore);
                      return (
                        <div
                          key={index}
                          className={cn(
                            "border border-white/10 bg-white/5 p-3 transition-colors cursor-pointer",
                            currentCouponIndex === index && "border-white/30 bg-white/10"
                          )}
                          onClick={() => setCurrentCouponIndex(index)}
                          data-testid={`bundle-coupon-${index}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-white/40">#{index + 1}</span>
                                <h4 className="text-sm text-white font-medium">{coupon.title}</h4>
                              </div>
                              <p className="text-xs text-white/50">{coupon.brand} • {coupon.code}</p>
                            </div>
                            <Badge className={cn(
                              "rounded-none text-[9px]",
                              couponBadge.bgClass,
                              couponBadge.textClass
                            )}>
                              {couponValueScore.toFixed(1)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {!isOwner && (
                <div className="border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" strokeWidth={1} />
                    Seller Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 uppercase tracking-widest">Seller ID</span>
                      <span className="text-sm font-mono text-white/80">{listing.userId.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-white text-white" strokeWidth={1} />
                      <span className="text-sm text-white/60">Verified Seller</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Listing Type Specific Info */}
              {listing.listingType === "sell" && listing.sellingPrice && totalCoupons === 1 && (
                <div className="border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60 uppercase tracking-widest">Selling Price</span>
                    <span className="text-2xl font-light text-white">₹{listing.sellingPrice}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    Save {Math.round(((parseFloat(currentCoupon.value.toString()) - parseFloat(listing.sellingPrice)) / parseFloat(currentCoupon.value.toString())) * 100)}% on this coupon
                  </p>
                </div>
              )}

              {/* Terms & Conditions */}
              {currentCoupon.termsConditions && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" strokeWidth={1} />
                    Terms & Conditions
                  </h3>
                  <div className="border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/60 leading-relaxed">
                      {currentCoupon.termsConditions}
                    </p>
                  </div>
                </div>
              )}

              {/* Important Note */}
              {!isOwner && (
                <div className="border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" strokeWidth={1} />
                    <div>
                      <p className="text-sm font-semibold text-yellow-400 mb-1">Important</p>
                      <p className="text-xs text-yellow-300/80">
                        {totalCoupons > 1 
                          ? `All ${totalCoupons} coupon codes will be revealed after successful ${listing.listingType === "sell" ? "payment" : "trade"}. Make sure to verify expiry dates and terms before proceeding.`
                          : `Coupon code will be revealed only after successful ${listing.listingType === "sell" ? "payment" : "trade"}. Make sure to verify the expiry date and terms before proceeding.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Trade Tab */}
            <TabsContent value="trade" className="mt-6 space-y-6">
                {/* Trade Coupon Requirements */}
                {listing.tradeCouponRequirements && Array.isArray(listing.tradeCouponRequirements) && listing.tradeCouponRequirements.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-[#0a0a0a] border border-white/5 p-6">
                        <h3 className="text-sm font-bold tracking-wider uppercase mb-2 flex items-center gap-2 text-white">
                          <Repeat className="h-4 w-4" strokeWidth={1} />
                          Trade Coupon Requirements
                        </h3>
                        <p className="text-xs text-white/40 mb-6">
                          You need to have the following coupons to complete this trade:
                        </p>
                        <div className="space-y-3">
                          {listing.tradeCouponRequirements.map((req: TradeCouponRequirement, index: number) => (
                            <div 
                              key={index}
                              className="bg-black border border-white/10 p-5"
                              data-testid={`trade-requirement-${index}`}
                            >
                              {/* Requirement Header */}
                              <div className="flex items-start justify-between mb-5 pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white uppercase tracking-wide">
                                    Requirement {index + 1}
                                  </span>
                                  {req.isRequired && (
                                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 rounded-none text-[9px] uppercase px-2 py-0.5">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {/* Requirement Details Grid */}
                              <div className="space-y-3">
                                {/* Category */}
                                {req.category && (
                                  <div className="bg-[#0a0a0a] border border-white/5 p-4">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Category</p>
                                    <Badge className="bg-white/5 text-white border-white/10 rounded-none text-sm uppercase px-3 py-1.5">
                                      {req.category === 'food' ? 'Food & Dining' : 
                                       req.category === 'travel' ? 'Travel' :
                                       req.category === 'shopping' ? 'Shopping' :
                                       req.category === 'fitness' ? 'Fitness' :
                                       req.category === 'bills' ? 'Bills & Recharge' :
                                       req.category === 'entertainment' ? 'Entertainment' :
                                       req.category === 'any' ? 'Any Category' : req.category}
                                    </Badge>
                                  </div>
                                )}
                                
                                {/* Brands */}
                                {req.brands && req.brands.length > 0 && (
                                  <div className="bg-[#0a0a0a] border border-white/5 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Brands</p>
                                      <span className="text-[10px] text-white/30">({req.brands.length} accepted)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {req.brands.map((brand: string, brandIndex: number) => (
                                        <span 
                                          key={brandIndex}
                                          className="bg-white/5 text-white/90 border border-white/10 text-xs px-3 py-1.5 font-medium"
                                          data-testid={`brand-${index}-${brandIndex}`}
                                        >
                                          {brand}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Rating */}
                                {(req.minRating !== undefined || req.maxRating !== undefined) && (
                                  <div className="bg-[#0a0a0a] border border-white/5 p-4">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">Coupon Rating (out of 10)</p>
                                    <div className="flex items-center gap-4">
                                      <div className="text-center shrink-0">
                                        <p className="text-[10px] text-white/30 uppercase mb-2">Min</p>
                                        <span className="text-2xl text-white font-bold font-mono">
                                          {req.minRating || 0}
                                        </span>
                                      </div>
                                      <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                                        <div 
                                          className="h-full bg-white/40"
                                          style={{ 
                                            width: `${((req.maxRating || 10) / 10) * 100}%`
                                          }}
                                        />
                                      </div>
                                      <div className="text-center shrink-0">
                                        <p className="text-[10px] text-white/30 uppercase mb-2">Max</p>
                                        <span className="text-2xl text-white font-bold font-mono">
                                          {req.maxRating || 10}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {listing.tradeNote && (
                          <div className="mt-5 pt-5 border-t border-white/10">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Additional Note</p>
                            <p className="text-sm text-white/60 leading-relaxed">{listing.tradeNote}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0a0a0a] border border-white/5 p-6">
                      <h3 className="text-sm font-bold tracking-wider uppercase mb-2 flex items-center gap-2 text-white">
                        <Repeat className="h-4 w-4" strokeWidth={1} />
                        Trade Requirements
                      </h3>
                      <p className="text-xs text-white/40 mb-6">
                        You need to have coupons matching the following criteria to complete this trade:
                      </p>
                      
                      <div className="bg-black border border-white/10 p-5 space-y-3">
                        {/* Number of Coupons */}
                        {listing.tradeCouponsRequired && (
                          <div className="bg-[#0a0a0a] border border-white/5 p-4">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Number of Coupons</p>
                            <p className="text-lg text-white font-bold">{listing.tradeCouponsRequired} coupon(s) required</p>
                          </div>
                        )}
                        
                        {/* Category */}
                        {listing.tradeCategory && (
                          <div className="bg-[#0a0a0a] border border-white/5 p-4">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Category</p>
                            <Badge className="bg-white/5 text-white border-white/10 rounded-none text-sm uppercase px-3 py-1.5">
                              {listing.tradeCategory === 'food' ? 'Food & Dining' : 
                               listing.tradeCategory === 'travel' ? 'Travel' :
                               listing.tradeCategory === 'shopping' ? 'Shopping' :
                               listing.tradeCategory === 'fitness' ? 'Fitness' :
                               listing.tradeCategory === 'bills' ? 'Bills & Recharge' :
                               listing.tradeCategory === 'entertainment' ? 'Entertainment' : listing.tradeCategory}
                            </Badge>
                          </div>
                        )}
                        
                        {/* Brands/Looking For */}
                        {listing.tradePreference && (
                          <div className="bg-[#0a0a0a] border border-white/5 p-4">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Looking For</p>
                            <p className="text-sm text-white/90 leading-relaxed">{listing.tradePreference}</p>
                          </div>
                        )}
                        
                        {/* Rating */}
                        {(listing.tradeMinValueScore !== undefined || listing.tradeMaxValueScore !== undefined) && (
                          <div className="bg-[#0a0a0a] border border-white/5 p-4">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">Coupon Rating (out of 10)</p>
                            <div className="flex items-center gap-4">
                              <div className="text-center shrink-0">
                                <p className="text-[10px] text-white/30 uppercase mb-2">Min</p>
                                <span className="text-2xl text-white font-bold font-mono">
                                  {listing.tradeMinValueScore || 0}
                                </span>
                              </div>
                              <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                                <div 
                                  className="h-full bg-white/40"
                                  style={{ 
                                    width: `${((listing.tradeMaxValueScore || 10) / 10) * 100}%`
                                  }}
                                />
                              </div>
                              <div className="text-center shrink-0">
                                <p className="text-[10px] text-white/30 uppercase mb-2">Max</p>
                                <span className="text-2xl text-white font-bold font-mono">
                                  {listing.tradeMaxValueScore || 10}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {listing.tradeNote && (
                        <div className="mt-5 pt-5 border-t border-white/10">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Additional Note</p>
                          <p className="text-sm text-white/60 leading-relaxed">{listing.tradeNote}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Trade Check Results */}
                  {tradeCheckResult && (
                    <div className="space-y-4">
                      {/* Overall Match Summary */}
                      <div className="bg-[#0a0a0a] border-2 border-white/20 p-5">
                        <h3 className="text-sm font-bold tracking-wider uppercase mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" strokeWidth={1} />
                          Availability Check Results
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {tradeCheckResult.hasMatches ? (
                              <CheckCircle2 className="h-7 w-7 text-green-400" strokeWidth={2} />
                            ) : (
                              <XCircle className="h-7 w-7 text-red-400" strokeWidth={2} />
                            )}
                            <div>
                              <h4 className={cn(
                                "text-lg font-bold uppercase tracking-wide",
                                tradeCheckResult.hasMatches ? "text-green-400" : "text-red-400"
                              )}>
                                {tradeCheckResult.hasMatches ? "✓ Trade Possible" : "✗ Cannot Trade"}
                              </h4>
                              <p className="text-xs text-white/50 uppercase tracking-widest">
                                {tradeCheckResult.hasMatches ? "You have matching coupons" : "Requirements not satisfied"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "text-3xl font-bold font-mono",
                              tradeCheckResult.hasMatches ? "text-green-400" : "text-red-400"
                            )}>
                              {tradeCheckResult.matchCount || 0}/{listing.tradeCouponRequirements?.length || listing.tradeCouponsRequired || 1}
                            </div>
                            <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                              Requirements Met
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Individual Requirement Check Cards */}
                      <div className="border border-white/20 bg-white/5 p-5">
                        <h3 className="text-sm font-bold tracking-wider uppercase mb-4">
                          Coupons Available for Each Requirement
                        </h3>
                        <div className="space-y-3">
                          {listing.tradeCouponRequirements && listing.tradeCouponRequirements.map((req: TradeCouponRequirement, index: number) => {
                            const reqHasMatch = tradeCheckResult.requirements?.some(r => 
                              r.toLowerCase().includes(`coupon ${req.couponNumber || index + 1}`) ||
                              r.toLowerCase().includes(`requirement ${index + 1}`)
                            );
                            
                            return (
                              <div 
                                key={index}
                                className={cn(
                                  "border-2 p-4",
                                  reqHasMatch ? "bg-green-500/5 border-green-500/40" : "bg-red-500/5 border-red-500/40"
                                )}
                              >
                                {/* Requirement Header with Status */}
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-bold text-white uppercase tracking-wide">
                                        Requirement {index + 1}
                                      </span>
                                      {req.isRequired && (
                                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 rounded-sm text-[9px] uppercase px-2">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-white/50">
                                      {req.category && `${req.category === 'food' ? 'Food & Dining' : 
                                       req.category === 'travel' ? 'Travel' :
                                       req.category === 'shopping' ? 'Shopping' :
                                       req.category === 'fitness' ? 'Fitness' :
                                       req.category === 'bills' ? 'Bills & Recharge' :
                                       req.category === 'entertainment' ? 'Entertainment' : req.category}`}
                                      {req.brands && req.brands.length > 0 && ` • ${req.brands.join(', ')}`}
                                      {(req.minRating !== undefined || req.maxRating !== undefined) && ` • Rating: ${req.minRating || 0}-${req.maxRating || 10}/10`}
                                    </p>
                                  </div>
                                  {reqHasMatch ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" strokeWidth={2} />
                                  ) : (
                                    <XCircle className="h-6 w-6 text-red-400 shrink-0" strokeWidth={2} />
                                  )}
                                </div>

                                {/* Coupon Availability Status */}
                                {reqHasMatch ? (
                                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded">
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" strokeWidth={2} />
                                      <div>
                                        <p className="text-sm text-green-400 font-semibold mb-1">
                                          ✓ Coupons Available
                                        </p>
                                        <p className="text-xs text-white/70">
                                          You have coupons in your collection that match this requirement. Click "Propose Trade" below to see and select your matching coupons.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded">
                                    <div className="flex items-start gap-2">
                                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
                                      <div>
                                        <p className="text-sm text-red-400 font-semibold mb-1">
                                          ✗ No Matching Coupons
                                        </p>
                                        <p className="text-xs text-white/70">
                                          You don't have any coupons in your collection that satisfy this requirement.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* What to Offer */}
                  <div className="border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-bold tracking-wider uppercase mb-3">What They're Offering</h3>
                    <div className="space-y-3">
                      {listing.coupons.map((coupon, index) => {
                        const couponValueScore = coupon.valueScore ? parseFloat(coupon.valueScore.toString()) : 5.0;
                        const couponBadge = getValueScoreBadge(couponValueScore);
                        return (
                          <div key={index} className="border border-white/10 bg-white/[0.02] p-3">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm text-white font-medium mb-1">{coupon.title}</h4>
                                <p className="text-xs text-white/50">{coupon.brand}</p>
                              </div>
                              <Badge className={cn(
                                "rounded-none text-[9px]",
                                couponBadge.bgClass,
                                couponBadge.textClass
                              )}>
                                {couponValueScore.toFixed(1)}
                              </Badge>
                            </div>
                            <div className="text-xs text-white/40">
                              Value: {coupon.valueType === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`} • 
                              Expires: {formatDate(coupon.expiryDate)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
            </TabsContent>
          </Tabs>
        ) : (
            <div className="mt-6 space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                  {listing.listingType}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                  {currentCoupon.category}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                  {currentCoupon.type.replace("_", " ")}
                </Badge>
                <Badge className={`rounded-none text-[10px] ${valueBadge.bgClass} ${valueBadge.textClass} ${valueBadge.borderClass}`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {valueScore.toFixed(1)}/10
                </Badge>
                {expiring && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/20 rounded-none text-[10px] uppercase">
                    Expiring Soon
                  </Badge>
                )}
                {listing.status !== "active" && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 rounded-none text-[10px] uppercase">
                    {listing.status}
                  </Badge>
                )}
              </div>

              {/* Title & Brand */}
              <div>
                <h1 className="text-2xl font-light tracking-tight mb-2">{currentCoupon.title}</h1>
                <p className="text-sm text-white/60 uppercase tracking-widest">{currentCoupon.brand}</p>
              </div>

              {/* Value */}
              <div className="border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-white/5 to-transparent">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-3">Coupon Value</p>
                  <div className="text-4xl font-light text-white tracking-tight">
                    {currentCoupon.valueType === "percentage"
                      ? `${currentCoupon.value}% OFF`
                      : `₹${currentCoupon.value}`}
                  </div>
                </div>
                {(currentCoupon.maxDiscount || currentCoupon.minAmount) && (
                  <div className="border-t border-white/10 grid grid-cols-2 divide-x divide-white/10">
                    {currentCoupon.maxDiscount && (
                      <div className="p-3 bg-white/[0.02]">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Max Discount</p>
                        <p className="text-sm font-semibold text-white">₹{currentCoupon.maxDiscount}</p>
                      </div>
                    )}
                    {currentCoupon.minAmount && (
                      <div className={`p-3 bg-white/[0.02] ${!currentCoupon.maxDiscount ? 'col-span-2' : ''}`}>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Min Order Value</p>
                        <p className="text-sm font-semibold text-white">₹{currentCoupon.minAmount}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {(currentCoupon.description || listing.listingNote) && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3">Description</h3>
                  <p className="text-sm text-white/70 font-light leading-relaxed">
                    {currentCoupon.description || listing.listingNote}
                  </p>
                </div>
              )}

              {/* Key Details */}
              <div className="border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Expires On</span>
                  <span className={`text-sm font-semibold flex items-center gap-2 ${expiring ? "text-red-400" : ""}`}>
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1} />
                    {formatDate(currentCoupon.expiryDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Days Left</span>
                  <span className={`text-sm font-semibold ${expiring ? "text-red-400" : daysLeft < 0 ? "text-red-500" : ""}`}>
                    {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? "Today" : "Expired"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Views</span>
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5" strokeWidth={1} />
                    {listing.views}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Listed On</span>
                  <span className="text-sm font-semibold">
                    {formatDate(listing.createdAt)}
                  </span>
                </div>
              </div>

              {/* Bundle Info */}
              {totalCoupons > 1 && (
                <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4" strokeWidth={1} />
                    Bundle Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 uppercase tracking-widest">Total Coupons</span>
                      <span className="text-sm font-semibold">{totalCoupons}</span>
                    </div>
                    {listing.totalFaceValue && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50 uppercase tracking-widest">Total Face Value</span>
                        <span className="text-sm font-semibold">₹{listing.totalFaceValue}</span>
                      </div>
                    )}
                    {listing.listingType === "sell" && listing.sellingPrice && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-white/50 uppercase tracking-widest">Bundle Price</span>
                        <span className="text-lg font-light text-white">₹{listing.sellingPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* All Coupons in Bundle */}
              {totalCoupons > 1 && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3">All Coupons in Bundle</h3>
                  <div className="space-y-2">
                    {listing.coupons.map((coupon, index) => {
                      const couponValueScore = coupon.valueScore ? parseFloat(coupon.valueScore.toString()) : 5.0;
                      const couponBadge = getValueScoreBadge(couponValueScore);
                      return (
                        <div
                          key={index}
                          className={cn(
                            "border border-white/10 bg-white/5 p-3 transition-colors cursor-pointer",
                            currentCouponIndex === index && "border-white/30 bg-white/10"
                          )}
                          onClick={() => setCurrentCouponIndex(index)}
                          data-testid={`bundle-coupon-${index}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-white/40">#{index + 1}</span>
                                <h4 className="text-sm text-white font-medium">{coupon.title}</h4>
                              </div>
                              <p className="text-xs text-white/50">{coupon.brand} • {coupon.code}</p>
                            </div>
                            <Badge className={cn(
                              "rounded-none text-[9px]",
                              couponBadge.bgClass,
                              couponBadge.textClass
                            )}>
                              {couponValueScore.toFixed(1)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {!isOwner && (
                <div className="border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" strokeWidth={1} />
                    Seller Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 uppercase tracking-widest">Seller ID</span>
                      <span className="text-sm font-mono text-white/80">{listing.userId.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-white text-white" strokeWidth={1} />
                      <span className="text-sm text-white/60">Verified Seller</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Listing Type Specific Info */}
              {listing.listingType === "sell" && listing.sellingPrice && totalCoupons === 1 && (
                <div className="border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60 uppercase tracking-widest">Selling Price</span>
                    <span className="text-2xl font-light text-white">₹{listing.sellingPrice}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    Save {Math.round(((parseFloat(currentCoupon.value.toString()) - parseFloat(listing.sellingPrice)) / parseFloat(currentCoupon.value.toString())) * 100)}% on this coupon
                  </p>
                </div>
              )}

              {/* Terms & Conditions */}
              {currentCoupon.termsConditions && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" strokeWidth={1} />
                    Terms & Conditions
                  </h3>
                  <div className="border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/60 leading-relaxed">
                      {currentCoupon.termsConditions}
                    </p>
                  </div>
                </div>
              )}

              {/* Important Note */}
              {!isOwner && (
                <div className="border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" strokeWidth={1} />
                    <div>
                      <p className="text-sm font-semibold text-yellow-400 mb-1">Important</p>
                      <p className="text-xs text-yellow-300/80">
                        {totalCoupons > 1 
                          ? `All ${totalCoupons} coupon codes will be revealed after successful ${listing.listingType === "sell" ? "payment" : "trade"}. Make sure to verify expiry dates and terms before proceeding.`
                          : `Coupon code will be revealed only after successful ${listing.listingType === "sell" ? "payment" : "trade"}. Make sure to verify the expiry date and terms before proceeding.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action */}
      {!isOwner && listing.status === "active" && daysLeft > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          {listing.listingType === "trade" && activeTab === "trade" ? (
            <Button
              onClick={handleCheckTradeAvailability}
              disabled={isCheckingTrade}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light uppercase tracking-wider disabled:opacity-50"
              data-testid="button-check-trade"
            >
              {isCheckingTrade ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" strokeWidth={1} />
                  CHECKING AVAILABILITY...
                </>
              ) : (
                <>
                  <Repeat className="h-5 w-5 mr-2" strokeWidth={1} />
                  CHECK AVAILABILITY FOR TRADE
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleBuyNow}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light uppercase tracking-wider"
              data-testid="button-buy-now"
            >
              {listing.listingType === "sell" ? (
                <>
                  <ShoppingBag className="h-5 w-5 mr-2" strokeWidth={1} />
                  BUY {totalCoupons > 1 ? "BUNDLE" : "NOW"} - ₹{listing.sellingPrice}
                </>
              ) : (
                <>
                  <Repeat className="h-5 w-5 mr-2" strokeWidth={1} />
                  PROPOSE TRADE
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/coupon-mart/edit-listing/${listing.id}`)}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none h-12"
              data-testid="button-modify-listing"
            >
              Modify Listing
            </Button>
            {listing.status === "active" && (
              <Button
                onClick={() => setShowCancelDialog(true)}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-none h-12"
                data-testid="button-cancel-listing"
              >
                Cancel Listing
              </Button>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-black border border-white/20 text-white rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-light tracking-tight">Cancel Listing</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to cancel this listing? This action cannot be undone and your listing will be removed from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-none"
              data-testid="button-cancel-dialog-close"
            >
              Keep Listing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelListing}
              disabled={cancelListingMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 rounded-none"
              data-testid="button-confirm-cancel-listing"
            >
              {cancelListingMutation.isPending ? "Cancelling..." : "Yes, Cancel Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
