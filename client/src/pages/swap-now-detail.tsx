import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { OfferDialog } from "@/components/swap-now/offer-dialog";
import { getFieldsForListing, groupFields } from "@/lib/listing-fields-config";
import type { SwapNowListing } from "@shared/schema";
import {
  ArrowLeft,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Tag,
  Package,
  Clock,
  Eye,
  User,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  Star,
  DollarSign,
  MessageCircle,
  ShoppingBag,
  Shield
} from "lucide-react";

export default function SwapNowDetail() {
  const [, params] = useRoute("/swap-now/listings/:id");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const listingId = params?.id;

  const { data: listing, isLoading } = useQuery<SwapNowListing>({
    queryKey: ['/api/swap-now/listings', listingId],
    enabled: !!listingId,
  });

  // Fetch seller's other listings
  const { data: sellerListings = [] } = useQuery<SwapNowListing[]>({
    queryKey: ['/api/swap-now/listings', 'seller', listing?.userId],
    enabled: !!listing?.userId,
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Listing link copied to clipboard",
      });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite ? "Listing removed from your favorites" : "Listing added to your favorites",
    });
  };

  const handleConnect = () => {
    // Direct navigation to messages page with conv1
    navigate("/swap-now/messages?conversation=conv1");
  };

  const handleMakeOffer = () => {
    // Navigate to messages page with conv1 and open offer dialog
    navigate("/swap-now/messages?conversation=conv1&openOffer=true");
  };

  const handleOfferSent = () => {
    // Navigate to messages after offer is sent
    navigate("/swap-now/messages?conversation=conv1");
  };

  if (isLoading || !listing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="text-white/40 text-xs">Loading listing...</div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(price));
  };

  const getConditionBadge = (condition: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      new: { label: "Brand New", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      like_new: { label: "Like New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      good: { label: "Good", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      fair: { label: "Fair", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
      poor: { label: "Poor", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    return badges[condition] || badges.good;
  };

  const getRelativeTime = (date: Date | string | null) => {
    if (!date) return "Recently";
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  const condition = getConditionBadge(listing.condition);
  const images = listing.images || [];
  const isOwner = user?.id === listing.userId;
  const isRealEstate = listing.category?.startsWith('real_estate');

  // Get all fields for this listing
  const allFields = getFieldsForListing(listing.category, listing.subCategory || undefined);
  const groupedFields = groupFields(allFields);

  // Combine listing data with attributes
  const listingData = {
    ...listing,
    ...(listing.attributes as object || {}),
  };

  // Filter seller's other listings
  const otherSellerListings = sellerListings
    .filter(l => l.id !== listing.id && l.status === 'active')
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-3">
          <Button
            onClick={() => navigate("/swap-now/explore")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-favorite"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="pt-14">
        <div className="relative aspect-square bg-black">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
                data-testid={`img-listing-${currentImageIndex}`}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm p-2 hover:bg-black/80"
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm p-2 hover:bg-black/80"
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 cursor-pointer transition-all ${
                          index === currentImageIndex ? "bg-white w-6" : "bg-white/40 w-1.5"
                        } rounded-full`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <Package className="h-20 w-20 text-white/20" />
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {listing.isFeatured === 1 && (
              <Badge className="bg-yellow-500/90 text-black border-0 text-[10px] px-2 py-0.5 font-bold backdrop-blur-sm">
                <Star className="h-2.5 w-2.5 mr-1" />
                FEATURED
              </Badge>
            )}
            {listing.isNegotiable === 1 && (
              <Badge className="bg-white/90 text-black border-0 text-[10px] px-2 py-0.5 font-semibold backdrop-blur-sm">
                <DollarSign className="h-2.5 w-2.5 mr-1" />
                NEGOTIABLE
              </Badge>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide bg-white/5">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border transition-all ${
                  index === currentImageIndex ? 'border-white' : 'border-white/20'
                }`}
                data-testid={`button-thumbnail-${index}`}
              >
                <img src={img} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price & Title Summary */}
      <div className="px-4 py-4 space-y-3 border-b border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1.5">
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-price">
                {formatPrice(listing.price)}
              </h1>
              {listing.originalPrice && parseFloat(listing.originalPrice) > parseFloat(listing.price) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/40 line-through">
                    {formatPrice(listing.originalPrice)}
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                    {Math.round(((parseFloat(listing.originalPrice) - parseFloat(listing.price)) / parseFloat(listing.originalPrice)) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </div>
            <h2 className="text-base font-normal leading-snug mb-2" data-testid="text-title">{listing.title}</h2>
          </div>
          <Badge className={`${condition.color} border text-[10px] px-2 py-1`}>
            {condition.label}
          </Badge>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between py-2 px-3 bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/80">
            <MapPin className="h-3 w-3 text-white/60" />
            <span className="text-xs font-medium" data-testid="text-location">{listing.location}, {listing.city}</span>
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="text-xs" data-testid="text-views">{listing.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs" data-testid="text-posted">{getRelativeTime(listing.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 border border-white/20 text-[10px]">
            <Tag className="h-3 w-3 text-white/60" />
            <span className="capitalize font-medium" data-testid="text-category">
              {listing.category.replace(/_/g, ' ')}
            </span>
          </div>
          {listing.subCategory && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 text-[10px]">
              <span className="text-white/80" data-testid="text-subcategory">{listing.subCategory}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/30 text-[10px]">
            <CheckCircle2 className="h-2.5 w-2.5 text-green-400" />
            <span className="text-green-400 capitalize font-medium" data-testid="text-status">
              {listing.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-black border-b border-white/10 rounded-none h-14 p-0">
          <TabsTrigger 
            value="overview" 
            className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-none border-b-2 border-transparent data-[state=active]:border-white text-xs font-semibold uppercase tracking-wider"
            data-testid="tab-overview"
          >
            <Package className="h-3.5 w-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="seller" 
            className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 rounded-none border-b-2 border-transparent data-[state=active]:border-white text-xs font-semibold uppercase tracking-wider"
            data-testid="tab-seller"
          >
            <User className="h-3.5 w-3.5 mr-1.5" />
            Seller Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="px-4 py-4 space-y-4 mt-0">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Description
            </h3>
            <div className="bg-white/5 border border-white/10 p-3">
              <p className="text-white/90 text-xs leading-relaxed" data-testid="text-description">{listing.description}</p>
            </div>
          </div>

          {/* Known Issues */}
          {listing.issues && listing.issues.trim() && (
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-orange-400/80 font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                Known Issues
              </h3>
              <div className="bg-orange-500/10 border border-orange-500/30 p-3">
                <p className="text-orange-200 text-xs leading-relaxed" data-testid="text-issues">{listing.issues}</p>
              </div>
            </div>
          )}

          {/* Dynamic Field Groups */}
          {Object.entries(groupedFields).map(([groupName, fields]) => (
            <div key={groupName} className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
                {groupName === 'Specifications' && <Package className="h-3 w-3" />}
                {groupName === 'Documentation' && <FileText className="h-3 w-3" />}
                {groupName === 'Property Details' && <Building2 className="h-3 w-3" />}
                {groupName === 'Included Items' && <ShoppingBag className="h-3 w-3" />}
                {groupName}
              </h3>
              <div className="bg-white/5 border border-white/10">
                <div className="divide-y divide-white/10">
                  {fields.map((field) => {
                    const value = listingData[field.key as keyof typeof listingData];
                    if (!value) return null;

                    const displayValue = field.format ? field.format(value) : String(value);
                    if (!displayValue) return null;

                    // Special handling for facilities (array)
                    if (field.key === 'facilities' && Array.isArray(value)) {
                      return (
                        <div key={field.key} className="flex flex-col px-3 py-2.5 hover:bg-white/5 transition-colors">
                          <span className="text-white/60 text-xs font-medium mb-2">{field.label}</span>
                          <div className="flex flex-wrap gap-1.5" data-testid="list-facilities">
                            {value.map((facility: string, idx: number) => (
                              <Badge key={idx} className="bg-white/10 text-white border-white/20 text-[10px] px-1.5 py-0">
                                {facility.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key} className="flex justify-between items-center px-3 py-2.5 hover:bg-white/5 transition-colors">
                        <span className="text-white/60 text-xs font-medium">{field.label}</span>
                        <span className="text-white text-xs font-semibold text-right max-w-[60%]" data-testid={`text-${field.key}`}>
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Location */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              Location Details
            </h3>
            <div className="bg-white/5 border border-white/10">
              <div className="divide-y divide-white/10">
                <div className="flex justify-between items-center px-3 py-2.5">
                  <span className="text-white/60 text-xs font-medium">Area</span>
                  <span className="text-white text-xs font-semibold" data-testid="text-area">{listing.location}</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2.5">
                  <span className="text-white/60 text-xs font-medium">City</span>
                  <span className="text-white text-xs font-semibold" data-testid="text-city">{listing.city}</span>
                </div>
                {listing.state && (
                  <div className="flex justify-between items-center px-3 py-2.5">
                    <span className="text-white/60 text-xs font-medium">State</span>
                    <span className="text-white text-xs font-semibold" data-testid="text-state">{listing.state}</span>
                  </div>
                )}
                {listing.pincode && (
                  <div className="flex justify-between items-center px-3 py-2.5">
                    <span className="text-white/60 text-xs font-medium">Pincode</span>
                    <span className="text-white text-xs font-semibold" data-testid="text-pincode">{listing.pincode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Seller Details Tab */}
        <TabsContent value="seller" className="px-4 py-4 space-y-4 mt-0">
          {/* Seller Info */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
              <User className="h-3 w-3" />
              Seller Information
            </h3>
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-white/60" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white" data-testid="text-seller-name">Seller Name</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="h-3 w-3 text-green-400" />
                    <span className="text-[10px] text-green-400">Verified Seller</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div className="text-center">
                  <div className="text-base font-bold text-white" data-testid="text-seller-listings">{sellerListings.length}</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-white">4.8</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-white">95%</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Listings by Seller */}
          {otherSellerListings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
                <ShoppingBag className="h-3 w-3" />
                Other Listings by This Seller
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {otherSellerListings.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/swap-now/listings/${item.id}`)}
                    className="bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                    data-testid={`card-seller-listing-${item.id}`}
                  >
                    <div className="aspect-square bg-black relative">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <Package className="h-8 w-8 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-bold text-white mb-0.5" data-testid={`text-seller-listing-price-${item.id}`}>
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-[10px] text-white/80 line-clamp-2" data-testid={`text-seller-listing-title-${item.id}`}>
                        {item.title}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-2.5 w-2.5 text-white/40" />
                        <span className="text-[9px] text-white/60">{item.city}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherSellerListings.length === 0 && (
            <div className="text-center py-8 text-white/60 text-xs">
              No other listings from this seller
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Fixed Bottom CTA Buttons */}
      {!isOwner && listing.status === 'active' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-3">
          <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
            <Button
              onClick={handleConnect}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none h-12 font-semibold text-sm"
              data-testid="button-connect"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Connect
            </Button>
            <Button
              onClick={handleMakeOffer}
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-semibold text-sm"
              data-testid="button-make-offer"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Make Offer
            </Button>
          </div>
        </div>
      )}

      {/* Offer Dialog */}
      <OfferDialog
        open={offerDialogOpen}
        onOpenChange={setOfferDialogOpen}
        listingId={listing.id}
        listingPrice={listing.price}
        listingTitle={listing.title}
        onOfferSent={handleOfferSent}
      />
    </div>
  );
}
