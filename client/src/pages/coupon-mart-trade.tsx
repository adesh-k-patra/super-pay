import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { getBrandImage } from "@/lib/brand-images";
import {
  ArrowLeft,
  Calendar,
  Tag,
  AlertCircle,
  Repeat,
  CheckCircle2,
  Info
} from "lucide-react";

interface Listing {
  id: string;
  userId: string;
  couponCode: string;
  couponTitle: string;
  couponBrand: string;
  couponCategory: string;
  couponType: string;
  couponValue: string;
  couponValueType: string;
  couponDescription?: string;
  expiryDate: string;
  minAmount?: string;
  maxDiscount?: string;
  tradePreference?: string;
  tradeNote?: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function CouponMartTrade() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/trade/:id");
  const { toast } = useToast();
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");
  const [offerNote, setOfferNote] = useState("");
  
  const listingId = params?.id || "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Fetch the listing we want to trade with
  const { data: targetListing, isLoading: listingLoading } = useQuery<Listing>({
    queryKey: ["/api/coupon-mart/listings", listingId],
    enabled: !!listingId,
  });

  // Fetch user's own listings that can be traded
  const { data: myListings = [], isLoading: myListingsLoading } = useQuery<Listing[]>({
    queryKey: ["/api/coupon-mart/my-listings"],
    enabled: isAuthenticated,
  });

  // Prevent trading with own listing
  useEffect(() => {
    if (targetListing && user && targetListing.userId === user.id) {
      toast({
        title: "Cannot Trade",
        description: "You cannot trade with your own listing.",
        variant: "destructive",
      });
      navigate("/coupon-mart");
    }
  }, [targetListing, user, navigate, toast]);

  const createTradeOfferMutation = useMutation({
    mutationFn: async (data: {
      listingId: string;
      offererId: string;
      listingOwnerId: string;
      offeredCouponCode: string;
      offeredCouponTitle: string;
      offeredCouponBrand: string;
      offeredCouponValue: string;
      offeredCouponExpiry: string;
      offerNote?: string;
    }) => {
      return apiRequest("POST", "/api/coupon-mart/trade-offer", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/trade-offers"] });
      toast({
        title: "Trade Offer Sent",
        description: "Your trade offer has been sent successfully. The seller will be notified.",
      });
      navigate("/coupon-mart");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send trade offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitTradeOffer = () => {
    if (!selectedCouponId) {
      toast({
        title: "Select a Coupon",
        description: "Please select a coupon to offer for trade.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id || !targetListing) return;

    const selectedCoupon = myListings.find(l => l.id === selectedCouponId);
    if (!selectedCoupon) return;

    createTradeOfferMutation.mutate({
      listingId: targetListing.id,
      offererId: user.id,
      listingOwnerId: targetListing.userId,
      offeredCouponCode: selectedCoupon.couponCode,
      offeredCouponTitle: selectedCoupon.couponTitle,
      offeredCouponBrand: selectedCoupon.couponBrand,
      offeredCouponValue: selectedCoupon.couponValue,
      offeredCouponExpiry: selectedCoupon.expiryDate,
      offerNote: offerNote || undefined,
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    return differenceInDays(new Date(dateString), new Date());
  };

  const isExpiringSoon = (dateString: string) => {
    const days = getDaysUntilExpiry(dateString);
    return days <= 7 && days > 0;
  };

  // Filter coupons that match the seller's trade preferences
  const getMatchingCoupons = () => {
    if (!targetListing?.tradePreference) {
      // If no preference specified, show all active coupons
      return myListings.filter(
        l => l.status === "active" && getDaysUntilExpiry(l.expiryDate) > 0
      );
    }

    const preference = targetListing.tradePreference.toLowerCase();
    return myListings.filter(listing => {
      if (listing.status !== "active") return false;
      if (getDaysUntilExpiry(listing.expiryDate) <= 0) return false;

      // Check if brand or category matches the preference
      const brand = listing.couponBrand.toLowerCase();
      const category = listing.couponCategory.toLowerCase();
      const title = listing.couponTitle.toLowerCase();

      return (
        preference.includes(brand) ||
        preference.includes(category) ||
        brand.includes(preference) ||
        category.includes(preference) ||
        title.includes(preference)
      );
    });
  };

  const matchingCoupons = getMatchingCoupons();
  const otherCoupons = myListings.filter(
    l => !matchingCoupons.includes(l) && l.status === "active" && getDaysUntilExpiry(l.expiryDate) > 0
  );

  if (listingLoading || myListingsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!targetListing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-white/40" strokeWidth={1} />
          <p className="text-white/60">Listing not found</p>
          <Button
            onClick={() => navigate("/coupon-mart")}
            className="mt-4 bg-white text-black hover:bg-white/90"
          >
            Back to Coupon Mart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate(`/coupon-mart/listing/${listingId}`)}
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <h1 className="text-sm font-bold tracking-wider absolute left-1/2 -translate-x-1/2">
            PROPOSE TRADE
          </h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 px-4 space-y-6">
        {/* What They Want */}
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5" strokeWidth={1} />
            They're Looking For
          </h2>
          <Card className="bg-white/5 border-white/10 rounded-none p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base font-light text-white mb-1">
                    {targetListing.couponTitle}
                  </h3>
                  <p className="text-xs text-white/50 uppercase tracking-widest">
                    {targetListing.couponBrand}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-light text-white">
                    {targetListing.couponValueType === "percentage"
                      ? `${targetListing.couponValue}%`
                      : `₹${targetListing.couponValue}`}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase">Value</p>
                </div>
              </div>

              {targetListing.tradePreference && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                    Preferred Trade
                  </p>
                  <p className="text-sm text-white/80">{targetListing.tradePreference}</p>
                </div>
              )}

              {targetListing.tradeNote && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Note</p>
                  <p className="text-sm text-white/60">{targetListing.tradeNote}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Your Matching Coupons */}
        {matchingCoupons.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1} />
              Matching Coupons ({matchingCoupons.length})
            </h2>
            <div className="space-y-3">
              {matchingCoupons.map((coupon) => {
                const daysLeft = getDaysUntilExpiry(coupon.expiryDate);
                const expiring = isExpiringSoon(coupon.expiryDate);

                return (
                  <Card
                    key={coupon.id}
                    onClick={() => setSelectedCouponId(coupon.id)}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedCouponId === coupon.id
                        ? "bg-white/10 border-white"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    } rounded-none`}
                    data-testid={`card-coupon-${coupon.id}`}
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/20 rounded-none text-[10px] uppercase">
                              Match
                            </Badge>
                            {expiring && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/20 rounded-none text-[10px] uppercase">
                                {daysLeft}d Left
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-base font-light text-white mb-1">
                            {coupon.couponTitle}
                          </h3>
                          <p className="text-xs text-white/50 uppercase tracking-widest">
                            {coupon.couponBrand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-light text-white">
                            {coupon.couponValueType === "percentage"
                              ? `${coupon.couponValue}%`
                              : `₹${coupon.couponValue}`}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase">Value</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-white/40 uppercase tracking-widest">
                          Expires
                        </span>
                        <span className={`text-xs font-semibold ${expiring ? "text-red-400" : "text-white/60"}`}>
                          {format(new Date(coupon.expiryDate), "dd MMM yyyy")}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Available Coupons */}
        {otherCoupons.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4 flex items-center gap-2">
              <Info className="h-3.5 w-3.5" strokeWidth={1} />
              Other Coupons ({otherCoupons.length})
            </h2>
            <div className="space-y-3">
              {otherCoupons.map((coupon) => {
                const daysLeft = getDaysUntilExpiry(coupon.expiryDate);
                const expiring = isExpiringSoon(coupon.expiryDate);

                return (
                  <Card
                    key={coupon.id}
                    onClick={() => setSelectedCouponId(coupon.id)}
                    className={`cursor-pointer transition-all border ${
                      selectedCouponId === coupon.id
                        ? "bg-white/10 border-white"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    } rounded-none`}
                    data-testid={`card-coupon-${coupon.id}`}
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {expiring && (
                            <div className="mb-2">
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/20 rounded-none text-[10px] uppercase">
                                {daysLeft}d Left
                              </Badge>
                            </div>
                          )}
                          <h3 className="text-base font-light text-white mb-1">
                            {coupon.couponTitle}
                          </h3>
                          <p className="text-xs text-white/50 uppercase tracking-widest">
                            {coupon.couponBrand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-light text-white">
                            {coupon.couponValueType === "percentage"
                              ? `${coupon.couponValue}%`
                              : `₹${coupon.couponValue}`}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase">Value</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-white/40 uppercase tracking-widest">
                          Expires
                        </span>
                        <span className={`text-xs font-semibold ${expiring ? "text-red-400" : "text-white/60"}`}>
                          {format(new Date(coupon.expiryDate), "dd MMM yyyy")}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Coupons Available */}
        {matchingCoupons.length === 0 && otherCoupons.length === 0 && (
          <Card className="bg-white/5 border-white/10 rounded-none p-8">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-white/40" strokeWidth={1} />
              <div>
                <h3 className="text-base font-light text-white mb-2">No Coupons Available</h3>
                <p className="text-sm text-white/60">
                  You don't have any active coupons to trade. Create a listing first to start trading.
                </p>
              </div>
              <Button
                onClick={() => navigate("/coupon-mart/new-listing")}
                className="bg-white text-black hover:bg-white/90 rounded-none"
                data-testid="button-create-listing"
              >
                Create Listing
              </Button>
            </div>
          </Card>
        )}

        {/* Add Note */}
        {(matchingCoupons.length > 0 || otherCoupons.length > 0) && (
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Add a Note (Optional)
            </h2>
            <Textarea
              value={offerNote}
              onChange={(e) => setOfferNote(e.target.value)}
              placeholder="Add any additional information about your offer..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none min-h-[100px] focus:border-white/30"
              data-testid="input-offer-note"
            />
          </div>
        )}

        {/* Info Box */}
        <Card className="bg-blue-500/10 border-blue-500/20 rounded-none p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" strokeWidth={1} />
            <div>
              <p className="text-sm font-semibold text-blue-400 mb-1">How Trading Works</p>
              <p className="text-xs text-blue-300/80 leading-relaxed">
                Select one of your coupons to offer in exchange. The seller will review your offer 
                and can accept or reject it. Both coupon codes will be revealed only after the trade is accepted.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Action */}
      {(matchingCoupons.length > 0 || otherCoupons.length > 0) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <Button
            onClick={handleSubmitTradeOffer}
            disabled={!selectedCouponId || createTradeOfferMutation.isPending}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-submit-trade-offer"
          >
            {createTradeOfferMutation.isPending ? (
              "Sending Offer..."
            ) : (
              <>
                <Repeat className="h-5 w-5 mr-2" strokeWidth={1} />
                Send Trade Offer
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
