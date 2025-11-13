import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Repeat,
  Sparkles,
  CheckCircle,
  Loader2,
  FileText,
  TrendingDown,
  Package,
  AlertCircle,
  Shield,
  X,
  Plus,
} from "lucide-react";
import { getValueScoreBadge } from "@shared/coupon-value-calculator";

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
  termsConditions?: string;
  listingType: string;
  sellingPrice?: string;
  tradePreference?: string;
  tradeNote?: string;
  status: string;
  valueScore?: string;
}

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface TradeCard {
  id: string;
  category: string;
  minValue: number;
}

const LISTING_STAGES: BookingStage[] = [
  { id: 'type', title: 'Listing Type', shortTitle: 'Type', icon: ShoppingBag, description: 'Cash In or Trade' },
  { id: 'buy-details', title: 'Update Details', shortTitle: 'Details', icon: Sparkles, description: 'Update your terms' },
  { id: 'review', title: 'Review & Update', shortTitle: 'Review', icon: CheckCircle, description: 'Confirm changes' },
];

const categories = [
  { id: "any", label: "Any Category" },
  { id: "food", label: "Food & Dining" },
  { id: "travel", label: "Travel" },
  { id: "shopping", label: "Shopping" },
  { id: "bills", label: "Bills & Recharge" },
  { id: "entertainment", label: "Entertainment" },
];

export default function CouponMartEditListing() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/edit-listing/:id");
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  
  const listingId = params?.id || "";
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form states
  const [listingType, setListingType] = useState<"sell" | "trade">("sell");
  const [additionalNote, setAdditionalNote] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [enableAutoDecrease, setEnableAutoDecrease] = useState(false);
  const [offerStartDays, setOfferStartDays] = useState("7");
  const [dailyDecreasePercent, setDailyDecreasePercent] = useState("2");
  const [tradeCards, setTradeCards] = useState<TradeCard[]>([
    { id: "1", category: "", minValue: 0 }
  ]);

  const currentStage = LISTING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / LISTING_STAGES.length) * 100;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: listing, isLoading } = useQuery<Listing>({
    queryKey: ["/api/coupon-mart/listings", listingId],
    enabled: !!listingId,
  });

  useEffect(() => {
    if (listing) {
      if (listing.userId !== user?.id) {
        toast({
          title: "Unauthorized",
          description: "You can only edit your own listings",
          variant: "destructive",
        });
        navigate("/coupon-mart");
        return;
      }

      // Pre-fill form with existing data
      setListingType(listing.listingType as "sell" | "trade");
      setAdditionalNote(listing.couponDescription || listing.tradeNote || "");
      setSellingPrice(listing.sellingPrice || "");
      
      if (listing.tradePreference) {
        const preferences = listing.tradePreference.split(", ").filter(Boolean);
        const cards = preferences.map((pref, index) => ({
          id: (index + 1).toString(),
          category: pref.toLowerCase(),
          minValue: 100,
        }));
        setTradeCards(cards.length > 0 ? cards : [{ id: "1", category: "", minValue: 0 }]);
      }
    }
  }, [listing, user, navigate, toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  const updateListingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/coupon-mart/listings/${listingId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings", listingId] });
      toast({
        title: "Success!",
        description: "Your listing has been updated successfully",
      });
      navigate("/coupon-mart/my-listings");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    },
  });

  const handleNextStage = () => {
    // Validate listing type
    if (currentStage.id === 'type') {
      if (!listingType) {
        toast({
          title: "Selection Required",
          description: "Please select a listing type",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate buy details
    if (currentStage.id === 'buy-details') {
      if (listingType === 'sell' && !sellingPrice) {
        toast({
          title: "Price Required",
          description: "Please enter a selling price",
          variant: "destructive"
        });
        return;
      }
      if (listingType === 'trade') {
        const hasValidCard = tradeCards.some(card => 
          card.category && card.minValue > 0
        );
        if (!hasValidCard) {
          toast({
            title: "Trade Requirements Missing",
            description: "Please specify at least one valid card requirement",
            variant: "destructive"
          });
          return;
        }
      }
    }

    if (!completedStages.includes(currentStageIndex)) {
      setCompletedStages([...completedStages, currentStageIndex]);
    }
    if (currentStageIndex < LISTING_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handleStageClick = (stageIndex: number) => {
    if (completedStages.includes(stageIndex) || stageIndex <= currentStageIndex) {
      setCurrentStageIndex(stageIndex);
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAddTradeCard = () => {
    if (tradeCards.length >= 8) {
      toast({
        title: "Maximum Reached",
        description: "You can only add up to 8 card requirements",
        variant: "destructive"
      });
      return;
    }
    const newId = (tradeCards.length + 1).toString();
    setTradeCards([...tradeCards, {
      id: newId,
      category: "any",
      minValue: 0
    }]);
  };

  const handleRemoveTradeCard = (id: string) => {
    if (tradeCards.length > 1) {
      setTradeCards(tradeCards.filter(card => card.id !== id));
    }
  };

  const handleUpdateTradeCard = (id: string, field: keyof TradeCard, value: any) => {
    setTradeCards(tradeCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSubmit = () => {
    const updateData: any = {
      listingType,
      couponDescription: additionalNote || null,
    };

    if (listingType === "sell") {
      updateData.sellingPrice = sellingPrice ? parseFloat(sellingPrice) : null;
      updateData.tradePreference = null;
      updateData.tradeNote = null;
    } else if (listingType === "trade") {
      const validTradeCards = tradeCards.filter(card => card.category && card.minValue > 0);
      if (validTradeCards.length > 0) {
        updateData.tradePreference = validTradeCards.map(card => card.category).join(", ");
        updateData.tradeNote = additionalNote || null;
      }
      updateData.sellingPrice = null;
    }

    updateListingMutation.mutate(updateData);
    setShowConfirmDialog(false);
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'type':
        return (
          <div className="space-y-6">
            {/* Coupon Info Display */}
            {listing && (
              <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-white/60" strokeWidth={1} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-light text-white text-lg tracking-wide mb-1">
                      {listing.couponTitle}
                    </h3>
                    <p className="text-xs text-white/50 tracking-widest uppercase">
                      {listing.couponBrand}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Value</p>
                    <p className="text-white font-light">
                      {listing.couponValueType === "percentage"
                        ? `${listing.couponValue}%`
                        : `₹${listing.couponValue}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Expires</p>
                    <p className="text-white font-light">
                      {new Date(listing.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Listing Type Selection */}
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-3 block">
                Select Listing Type *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setListingType("sell")}
                  className={cn(
                    "border p-6 transition-all text-center",
                    listingType === "sell"
                      ? "bg-white text-black border-white"
                      : "bg-white/5 border-white/20 hover:border-white/40"
                  )}
                  data-testid="button-type-sell"
                >
                  <ShoppingBag className={cn(
                    "h-8 w-8 mx-auto mb-2",
                    listingType === "sell" ? "text-black" : "text-white"
                  )} />
                  <div className="text-xl font-light mb-1">Cash In</div>
                  <div className="text-xs">Buyers can purchase with cash/UPI</div>
                </button>
                <button
                  onClick={() => setListingType("trade")}
                  className={cn(
                    "border p-6 transition-all text-center",
                    listingType === "trade"
                      ? "bg-white text-black border-white"
                      : "bg-white/5 border-white/20 hover:border-white/40"
                  )}
                  data-testid="button-type-trade"
                >
                  <Repeat className={cn(
                    "h-8 w-8 mx-auto mb-2",
                    listingType === "trade" ? "text-black" : "text-white"
                  )} />
                  <div className="text-xl font-light mb-1">Trade</div>
                  <div className="text-xs">Trade for other coupons</div>
                </button>
              </div>
            </div>

            {/* Additional Note */}
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Additional Note (Optional)
              </Label>
              <Textarea
                value={additionalNote}
                onChange={(e) => {
                  if (e.target.value.length <= 150) {
                    setAdditionalNote(e.target.value);
                  }
                }}
                placeholder="Add any special instructions or notes about your listing..."
                className="bg-white/5 border-white/10 text-white rounded-none min-h-[100px] resize-none"
                data-testid="input-additional-note"
              />
              <p className="text-xs text-white/40 mt-1 text-right">
                {additionalNote.length}/150 characters
              </p>
            </div>
          </div>
        );

      case 'buy-details':
        return (
          <div className="space-y-6">
            {listingType === "sell" ? (
              <>
                {/* Selling Price */}
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                    Selling Price (₹) *
                  </Label>
                  <Input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="Enter total price"
                    className="bg-white/5 border-white/10 text-white rounded-none h-12 text-lg"
                    data-testid="input-selling-price"
                  />
                  <p className="text-xs text-white/40 mt-2">
                    Set a competitive price for this coupon
                  </p>
                </div>

                {/* Auto Decrease Option */}
                <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <Label className="text-white text-sm font-medium block">Auto-Decrease Price</Label>
                        <p className="text-[10px] text-white/40">Smart pricing based on expiry</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEnableAutoDecrease(!enableAutoDecrease)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
                        enableAutoDecrease ? "bg-white" : "bg-white/20"
                      )}
                      data-testid="toggle-auto-decrease"
                    >
                      <span className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform",
                        enableAutoDecrease ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                      )} />
                    </button>
                  </div>

                  {/* Content */}
                  {enableAutoDecrease && (
                    <div className="px-4 py-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/10 p-2.5">
                          <Label className="text-white/50 text-[9px] uppercase tracking-wider mb-1.5 block">
                            Start Before Expiry
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              max="30"
                              value={offerStartDays}
                              onChange={(e) => setOfferStartDays(e.target.value)}
                              className="bg-transparent border-0 text-white p-0 h-auto text-lg font-light focus-visible:ring-0"
                              data-testid="input-start-days"
                            />
                            <span className="text-white/60 text-xs">days</span>
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-2.5">
                          <Label className="text-white/50 text-[9px] uppercase tracking-wider mb-1.5 block">
                            Daily Decrease
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={dailyDecreasePercent}
                              onChange={(e) => setDailyDecreasePercent(e.target.value)}
                              className="bg-transparent border-0 text-white p-0 h-auto text-lg font-light focus-visible:ring-0"
                              data-testid="input-decrease-percent"
                            />
                            <span className="text-white/60 text-xs">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 border-t border-white/10 p-3 -mx-4 -mb-3">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">How it works</p>
                        <p className="text-xs text-white/60">
                          Price will automatically decrease by {dailyDecreasePercent}% per day, starting {offerStartDays} days before expiry
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Trade Cards */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-wider">
                        Trade Requirements ({tradeCards.length}/8)
                      </Label>
                      <p className="text-xs text-white/40 mt-1">Maximum 8 cards</p>
                    </div>
                    {tradeCards.length < 8 && (
                      <Button
                        onClick={handleAddTradeCard}
                        className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none h-8 text-xs"
                        data-testid="button-add-card"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Card
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {tradeCards.map((card, index) => (
                      <div
                        key={card.id}
                        className="border border-white/20 p-4 bg-gradient-to-br from-white/5 to-transparent"
                        data-testid={`trade-card-${card.id}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Label className="text-white text-sm">
                            Card {index + 1} {index === 0 && <span className="text-white/60 text-xs">(Required)</span>}
                          </Label>
                          {index > 0 && (
                            <button
                              onClick={() => handleRemoveTradeCard(card.id)}
                              className="text-white/60 hover:text-white p-1"
                              data-testid={`button-remove-card-${card.id}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                              Category
                            </Label>
                            <select
                              value={card.category}
                              onChange={(e) => handleUpdateTradeCard(card.id, 'category', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 text-white rounded-none h-10 px-3"
                              data-testid={`select-card-category-${card.id}`}
                            >
                              <option value="">Select</option>
                              <option value="any">Any</option>
                              {categories.filter(c => c.id !== "any").map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                              Min Value (₹)
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={card.minValue || ""}
                              onChange={(e) => handleUpdateTradeCard(card.id, 'minValue', parseFloat(e.target.value) || 0)}
                              placeholder={index === 0 ? "Required" : "Any"}
                              className="bg-white/5 border-white/10 text-white rounded-none h-10"
                              data-testid={`input-min-value-${card.id}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            {/* Listing Type */}
            <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5">
              <h3 className="text-sm font-light tracking-wider mb-3 text-white uppercase">Listing Type</h3>
              <div className="flex items-center gap-3">
                {listingType === 'sell' ? <ShoppingBag className="h-5 w-5 text-white/60" /> : <Repeat className="h-5 w-5 text-white/60" />}
                <div>
                  <p className="text-white font-light">{listingType === 'sell' ? 'Cash In' : 'Trade'}</p>
                  <p className="text-white/60 text-xs">
                    {listingType === 'sell' ? 'Buyers can purchase with cash/UPI' : 'Trade with other coupon holders'}
                  </p>
                </div>
              </div>
              {additionalNote && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Note</p>
                  <p className="text-white/80 text-sm">{additionalNote}</p>
                </div>
              )}
            </div>

            {/* Coupon Info */}
            {listing && (
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5">
                <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Coupon Details</h3>
                <div className="pb-3 border-b border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white/80 text-sm">{listing.couponTitle}</p>
                      <p className="text-white/40 text-xs mt-1">{listing.couponBrand} • {listing.couponCode}</p>
                    </div>
                    {listing.valueScore && (
                      <Badge className={cn(
                        "rounded-none text-[10px]",
                        getValueScoreBadge(parseFloat(listing.valueScore)).bgClass,
                        getValueScoreBadge(parseFloat(listing.valueScore)).textClass
                      )}>
                        {parseFloat(listing.valueScore).toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Value</p>
                    <p className="text-white font-light">
                      {listing.couponValueType === "percentage"
                        ? `${listing.couponValue}%`
                        : `₹${listing.couponValue}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Expires</p>
                    <p className="text-white font-light">
                      {new Date(listing.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Buy Details */}
            <div className="border border-white/20 p-5 bg-white/5">
              <h3 className="text-sm font-light tracking-wider mb-4 text-white uppercase">Buy Details</h3>
              <div className="space-y-3">
                {listingType === 'sell' ? (
                  <>
                    <div className="flex justify-between text-white/80">
                      <span className="text-sm">Selling Price</span>
                      <span className="font-light text-lg">₹{sellingPrice}</span>
                    </div>
                    {enableAutoDecrease && (
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-4 w-4 text-white/60" />
                          <span className="text-sm text-white/60">Auto-Decrease Enabled</span>
                        </div>
                        <div className="text-xs text-white/40 space-y-1">
                          <p>• Starts {offerStartDays} days before expiry</p>
                          <p>• Decreases by {dailyDecreasePercent}% per day</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="text-sm text-white/60 mb-2">Looking for:</div>
                    {tradeCards.filter(card => card.category && card.minValue > 0).map((card, index) => (
                      <div key={card.id} className="text-xs text-white/80 ml-3 mb-1">
                        {index + 1}. {card.category === 'any' ? 'Any Category' : categories.find(c => c.id === card.category)?.label} - Min ₹{card.minValue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <p className="text-sm text-yellow-400 font-medium mb-1">Important</p>
                  <p className="text-xs text-white/60">
                    Updating your listing will immediately change how it appears to buyers. Make sure all details are correct before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading || !listing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-white/60" />
          <p className="text-white/60 text-sm">Loading listing details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/coupon-mart/my-listings")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">EDIT LISTING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">COUPON MART</p>
            </div>

            <Badge className="bg-black border border-white/30 text-white rounded-none">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          {/* Progress Section */}
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Update Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {currentStageIndex + 1} of {LISTING_STAGES.length}
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-1 mb-4">
              <div 
                className="bg-white h-1 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Stage Tracker */}
            <div className="flex items-center justify-between">
              {LISTING_STAGES.map((stage, index) => {
                const isCompleted = completedStages.includes(index);
                const isCurrent = index === currentStageIndex;
                const isAccessible = isCompleted || index <= currentStageIndex;
                
                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div
                      onClick={() => isAccessible && handleStageClick(index)}
                      className={`w-8 h-8 border-b-2 flex items-center justify-center text-xs font-light transition-all duration-200 ${
                        isCompleted 
                          ? 'border-white bg-white/5 text-white cursor-pointer' 
                          : isCurrent 
                            ? 'border-white bg-white/5 text-white' 
                            : isAccessible
                              ? 'border-white/20 bg-transparent text-white/60 cursor-pointer hover:bg-white/5'
                              : 'border-white/10 bg-transparent text-white/30'
                      }`}
                      data-testid={`stage-${stage.id}`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`text-[10px] mt-2 text-center transition-colors uppercase tracking-wider font-light ${
                      isCurrent ? 'text-white' : 'text-white/40'
                    }`}>
                      {stage.shortTitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollableContentRef} className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Stage Title */}
        <div className="space-y-2">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <currentStage.icon className="h-3 w-3" />
            {currentStage.title}
          </Label>
          <p className="text-xs text-white/40 font-light">{currentStage.description}</p>
        </div>
          
        {/* Stage Content */}
        <div className="space-y-3">
          {renderStageContent()}
        </div>
      </div>

      {/* Fixed Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light">
                {listing.couponBrand}
              </p>
              <p className="text-sm text-white font-light">
                {currentStage.title}
              </p>
            </div>
            {listingType === 'sell' && sellingPrice && (
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-widest font-light">Price</p>
                <p className="text-xl font-light text-white">₹{sellingPrice}</p>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              if (currentStageIndex === LISTING_STAGES.length - 1) {
                setShowConfirmDialog(true);
              } else {
                handleNextStage();
              }
            }}
            disabled={updateListingMutation.isPending}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === LISTING_STAGES.length - 1 ? (
              updateListingMutation.isPending ? "UPDATING..." : "UPDATE LISTING"
            ) : (
              <>
                NEXT
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-black border border-white/20 text-white w-[90vw] sm:w-full max-w-md p-0 rounded-none">
          <div className="flex-shrink-0 border-b border-white/10">
            <DialogHeader className="px-5 pt-5 pb-4">
              <DialogTitle className="text-white text-lg font-light tracking-wider text-center">
                CONFIRM UPDATE
              </DialogTitle>
              <DialogDescription className="text-white/60 text-sm text-center mt-2">
                Are you sure you want to update this listing? This will immediately change how it appears to buyers.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-4">
            <div className="border border-white/20 bg-white/5 p-4">
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">You're updating:</p>
              <p className="text-white font-light">{listing.couponTitle}</p>
              <p className="text-white/60 text-xs mt-1">{listing.couponBrand}</p>
            </div>
          </div>

          <div className="flex-shrink-0 bg-black border-t border-white/10 px-5 py-4">
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmDialog(false)}
                variant="outline"
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none h-11 text-sm"
                data-testid="button-cancel-update"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={updateListingMutation.isPending}
                className="flex-1 bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 rounded-none h-11 text-sm font-medium"
                data-testid="button-confirm-update"
              >
                {updateListingMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm Update"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
