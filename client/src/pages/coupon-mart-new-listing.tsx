import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Tag,
  ShoppingBag,
  Repeat,
  Sparkles,
  CheckCircle,
  Shield,
  Plus,
  X,
  Layers,
  TrendingDown,
  FileText,
  Search,
  Star,
  ChevronRight,
} from "lucide-react";
import { calculateCouponValueScore, getValueScoreBadge } from "@shared/coupon-value-calculator";
import type { TradeCouponRequirement } from "@shared/schema";

interface BookingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface SelectedCoupon {
  id: string;
  code: string;
  title: string;
  brand: string;
  category: string;
  value: number;
  valueType: string;
  expiryDate: string;
  valueScore: number;
}

interface TradeCard {
  id: string;
  category: string;
  brands: string[];
  minRating: number;
  maxRating: number;
}

const LISTING_STAGES: BookingStage[] = [
  { id: 'type', title: 'Listing Type', shortTitle: 'Type', icon: ShoppingBag, description: 'Cash In or Trade' },
  { id: 'select-coupons', title: 'Select Coupons', shortTitle: 'Coupons', icon: Layers, description: 'Choose coupons to list' },
  { id: 'buy-details', title: 'Buy Details', shortTitle: 'Details', icon: Sparkles, description: 'Set your terms' },
  { id: 'review', title: 'Review & Submit', shortTitle: 'Review', icon: CheckCircle, description: 'Confirm listing' },
];

const categories = [
  { id: "all", label: "All Categories" },
  { id: "food", label: "Food & Dining" },
  { id: "travel", label: "Travel" },
  { id: "shopping", label: "Shopping" },
  { id: "bills", label: "Bills & Recharge" },
  { id: "entertainment", label: "Entertainment" },
];

export default function CouponMartNewListing() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const scrollableContentRef = useRef<HTMLDivElement>(null);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Listing Type + Note
  const [listingType, setListingType] = useState<"sell" | "trade">("sell");
  const [additionalNote, setAdditionalNote] = useState("");

  // Step 2: Coupon Selection (min 1, max 5)
  const [selectedCoupons, setSelectedCoupons] = useState<SelectedCoupon[]>([]);
  const [showCouponSelector, setShowCouponSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Step 3a: Cash In - Buy Details
  const [sellingPrice, setSellingPrice] = useState("");
  const [enableAutoDecrease, setEnableAutoDecrease] = useState(false);
  const [offerStartDays, setOfferStartDays] = useState("7");
  const [dailyDecreasePercent, setDailyDecreasePercent] = useState("2");

  // Step 3b: Trade - Buy Details (max 8 cards)
  const [tradeCards, setTradeCards] = useState<TradeCard[]>([
    { id: "1", category: "", brands: [], minRating: 0, maxRating: 10 }
  ]);
  
  // Brand search for trade cards
  const [brandSearchQuery, setBrandSearchQuery] = useState<{[key: string]: string}>({});
  const [showBrandSelector, setShowBrandSelector] = useState<{[key: string]: boolean}>({});
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<string | null>(null);
  const [openBrandSelectorId, setOpenBrandSelectorId] = useState<string | null>(null);

  const currentStage = LISTING_STAGES[currentStageIndex];
  const progressPercentage = ((currentStageIndex + 1) / LISTING_STAGES.length) * 100;
  
  // Get available brands by category
  const getBrandsByCategory = (categoryId: string) => {
    if (!categoryId || categoryId === 'any') {
      return Array.from(new Set(mockUserCoupons.map(c => c.brand)));
    }
    return Array.from(new Set(
      mockUserCoupons
        .filter(c => c.category === categoryId)
        .map(c => c.brand)
    ));
  };

  // Mock user's coupons - in production this would come from API
  const mockUserCoupons: SelectedCoupon[] = [
    {
      id: "1",
      code: "SWIGGY500",
      title: "₹500 Off on Swiggy",
      brand: "Swiggy",
      category: "food",
      value: 500,
      valueType: "fixed",
      expiryDate: "2025-12-31",
      valueScore: 8.5
    },
    {
      id: "2",
      code: "AMAZON20",
      title: "20% Off on Amazon",
      brand: "Amazon",
      category: "shopping",
      value: 20,
      valueType: "percentage",
      expiryDate: "2025-11-30",
      valueScore: 7.8
    },
    {
      id: "3",
      code: "UBER100",
      title: "₹100 Off on Uber",
      brand: "Uber",
      category: "travel",
      value: 100,
      valueType: "fixed",
      expiryDate: "2025-10-31",
      valueScore: 6.5
    },
    {
      id: "4",
      code: "ZOMATO300",
      title: "₹300 Off on Zomato",
      brand: "Zomato",
      category: "food",
      value: 300,
      valueType: "fixed",
      expiryDate: "2026-01-15",
      valueScore: 9.2
    },
    {
      id: "5",
      code: "FLIPKART15",
      title: "15% Off on Flipkart",
      brand: "Flipkart",
      category: "shopping",
      value: 15,
      valueType: "percentage",
      expiryDate: "2025-12-20",
      valueScore: 7.2
    },
    {
      id: "6",
      code: "NETFLIX200",
      title: "₹200 Off on Netflix",
      brand: "Netflix",
      category: "entertainment",
      value: 200,
      valueType: "fixed",
      expiryDate: "2025-11-15",
      valueScore: 7.5
    },
    {
      id: "7",
      code: "AIRTEL50",
      title: "₹50 Off on Airtel Recharge",
      brand: "Airtel",
      category: "bills",
      value: 50,
      valueType: "fixed",
      expiryDate: "2025-12-25",
      valueScore: 6.8
    },
    {
      id: "8",
      code: "DOMINOS250",
      title: "₹250 Off on Domino's Pizza",
      brand: "Dominos",
      category: "food",
      value: 250,
      valueType: "fixed",
      expiryDate: "2025-11-20",
      valueScore: 8.0
    },
    {
      id: "9",
      code: "MYNTRA30",
      title: "30% Off on Myntra Fashion",
      brand: "Myntra",
      category: "shopping",
      value: 30,
      valueType: "percentage",
      expiryDate: "2025-12-15",
      valueScore: 8.2
    },
    {
      id: "10",
      code: "OLA150",
      title: "₹150 Off on Ola Rides",
      brand: "Ola",
      category: "travel",
      value: 150,
      valueType: "fixed",
      expiryDate: "2025-11-10",
      valueScore: 7.0
    },
    {
      id: "11",
      code: "MAKEMYTRIP500",
      title: "₹500 Off on MakeMyTrip",
      brand: "MakeMyTrip",
      category: "travel",
      value: 500,
      valueType: "fixed",
      expiryDate: "2025-12-31",
      valueScore: 8.8
    },
    {
      id: "12",
      code: "JIO100",
      title: "₹100 Off on Jio Recharge",
      brand: "Jio",
      category: "bills",
      value: 100,
      valueType: "fixed",
      expiryDate: "2025-11-25",
      valueScore: 7.3
    },
    {
      id: "13",
      code: "PRIME150",
      title: "₹150 Off on Prime Video",
      brand: "Prime Video",
      category: "entertainment",
      value: 150,
      valueType: "fixed",
      expiryDate: "2025-12-10",
      valueScore: 7.8
    },
    {
      id: "14",
      code: "STARBUCKS200",
      title: "₹200 Off on Starbucks",
      brand: "Starbucks",
      category: "food",
      value: 200,
      valueType: "fixed",
      expiryDate: "2025-11-30",
      valueScore: 7.5
    },
    {
      id: "15",
      code: "AJIO25",
      title: "25% Off on Ajio",
      brand: "Ajio",
      category: "shopping",
      value: 25,
      valueType: "percentage",
      expiryDate: "2025-12-05",
      valueScore: 7.9
    },
    {
      id: "16",
      code: "BOOKMYSHOW300",
      title: "₹300 Off on BookMyShow",
      brand: "BookMyShow",
      category: "entertainment",
      value: 300,
      valueType: "fixed",
      expiryDate: "2025-12-20",
      valueScore: 8.5
    },
    {
      id: "17",
      code: "GOIBIBO400",
      title: "₹400 Off on Goibibo",
      brand: "Goibibo",
      category: "travel",
      value: 400,
      valueType: "fixed",
      expiryDate: "2025-11-28",
      valueScore: 8.3
    },
    {
      id: "18",
      code: "VI75",
      title: "₹75 Off on Vi Recharge",
      brand: "Vi",
      category: "bills",
      value: 75,
      valueType: "fixed",
      expiryDate: "2025-12-15",
      valueScore: 7.0
    },
    {
      id: "19",
      code: "NYKAA20",
      title: "20% Off on Nykaa",
      brand: "Nykaa",
      category: "shopping",
      value: 20,
      valueType: "percentage",
      expiryDate: "2025-11-22",
      valueScore: 7.6
    },
    {
      id: "20",
      code: "PIZZAHUT350",
      title: "₹350 Off on Pizza Hut",
      brand: "Pizza Hut",
      category: "food",
      value: 350,
      valueType: "fixed",
      expiryDate: "2025-12-18",
      valueScore: 8.4
    },
    {
      id: "21",
      code: "RAPIDO80",
      title: "₹80 Off on Rapido",
      brand: "Rapido",
      category: "travel",
      value: 80,
      valueType: "fixed",
      expiryDate: "2025-11-15",
      valueScore: 6.8
    },
    {
      id: "22",
      code: "SPOTIFY100",
      title: "₹100 Off on Spotify Premium",
      brand: "Spotify",
      category: "entertainment",
      value: 100,
      valueType: "fixed",
      expiryDate: "2025-12-01",
      valueScore: 7.2
    },
    {
      id: "23",
      code: "TATASKY60",
      title: "₹60 Off on Tata Sky",
      brand: "Tata Sky",
      category: "bills",
      value: 60,
      valueType: "fixed",
      expiryDate: "2025-11-18",
      valueScore: 6.9
    },
    {
      id: "24",
      code: "MEESHO35",
      title: "35% Off on Meesho",
      brand: "Meesho",
      category: "shopping",
      value: 35,
      valueType: "percentage",
      expiryDate: "2025-12-22",
      valueScore: 8.1
    },
    {
      id: "25",
      code: "KFC200",
      title: "₹200 Off on KFC",
      brand: "KFC",
      category: "food",
      value: 200,
      valueType: "fixed",
      expiryDate: "2025-11-26",
      valueScore: 7.7
    },
  ];

  const filteredCoupons = selectedCategory === "all" 
    ? mockUserCoupons 
    : mockUserCoupons.filter(c => c.category === selectedCategory);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollableContentRef.current) {
      scrollableContentRef.current.scrollTop = 0;
    }
  }, [currentStageIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openCategoryDropdown) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-testid^="select-coupon-category"]') && 
            !target.closest('[data-testid^="option-category"]')) {
          setOpenCategoryDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCategoryDropdown]);

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

    // Validate coupon selection
    if (currentStage.id === 'select-coupons') {
      if (selectedCoupons.length === 0) {
        toast({
          title: "Selection Required",
          description: "Please select at least 1 coupon",
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
          card.category && (card.brands.length > 0 || card.minRating > 0 || card.maxRating < 10)
        );
        if (!hasValidCard) {
          toast({
            title: "Trade Requirements Missing",
            description: "Please specify at least one valid card requirement (category with brands or rating range)",
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

  const handleCouponToggle = (coupon: SelectedCoupon) => {
    if (selectedCoupons.find(c => c.id === coupon.id)) {
      setSelectedCoupons(selectedCoupons.filter(c => c.id !== coupon.id));
    } else {
      if (selectedCoupons.length >= 5) {
        toast({
          title: "Maximum Reached",
          description: "You can only select up to 5 coupons",
          variant: "destructive"
        });
        return;
      }
      setSelectedCoupons([...selectedCoupons, coupon]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedCoupons.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least 1 coupon",
        variant: "destructive"
      });
      return;
    }
    setShowCouponSelector(false);
  };

  const handleRemoveCoupon = (couponId: string) => {
    setSelectedCoupons(selectedCoupons.filter(c => c.id !== couponId));
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
      category: "",
      brands: [],
      minRating: 0,
      maxRating: 10
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

  const getCategoryLabel = (categoryId: string) => {
    if (!categoryId || categoryId === '') return 'Select Category';
    if (categoryId === 'any') return 'Any Category';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.label : 'Select Category';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare coupons array for the new schema
      const coupons = selectedCoupons.map(coupon => ({
        code: coupon.code,
        title: coupon.title,
        brand: coupon.brand,
        category: coupon.category,
        type: "discount",
        value: coupon.value,
        valueType: coupon.valueType,
        description: null,
        images: [],
        expiryDate: coupon.expiryDate,
        minAmount: null,
        maxDiscount: null,
        termsConditions: null,
        valueScore: coupon.valueScore,
      }));

      // Calculate total face value
      const totalFaceValue = selectedCoupons.reduce((sum, coupon) => {
        if (coupon.valueType === 'fixed') {
          return sum + coupon.value;
        }
        return sum;
      }, 0);

      // Create a single listing with multiple coupons
      const listingData: any = {
        coupons,
        totalCouponCount: selectedCoupons.length,
        totalFaceValue: totalFaceValue > 0 ? totalFaceValue.toString() : null,
        primaryCategory: selectedCoupons[0]?.category || "all",
        listingNote: additionalNote || null,
        listingType,
        sellingPrice: null,
        tradePreference: null,
        tradeNote: null,
        status: "active",
        visibility: "public",
      };

      if (listingType === "sell" && sellingPrice) {
        listingData.sellingPrice = parseFloat(sellingPrice).toString();
      } else if (listingType === "trade") {
        const validTradeCards = tradeCards.filter(card => card.category);
        if (validTradeCards.length > 0) {
          listingData.tradePreference = validTradeCards.map(card => card.category).join(", ");
          listingData.tradeNote = additionalNote || null;
          
          listingData.tradeCouponRequirements = validTradeCards.map((card, index) => ({
            couponNumber: index + 1,
            isRequired: index === 0,
            category: card.category,
            brands: card.brands,
            minRating: card.minRating,
            maxRating: card.maxRating
          }));
        }
      }

      await apiRequest("POST", "/api/coupon-mart/listings", listingData);

      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/listings"] });
      navigate("/coupon-mart/listing-success");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStageContent = () => {
    switch (currentStage.id) {
      case 'type':
        return (
          <div className="space-y-4">
            {/* Listing Type Selection */}
            <div className="bg-black border border-white/10 shadow-xl">
              <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Select Listing Type *</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setListingType("sell")}
                    className={cn(
                      "border transition-all text-center relative overflow-hidden group",
                      listingType === "sell"
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                    )}
                    data-testid="button-type-sell"
                  >
                    <div className="p-6">
                      <div className={cn(
                        "w-14 h-14 mx-auto mb-3 border flex items-center justify-center transition-colors",
                        listingType === "sell" 
                          ? "bg-black border-black" 
                          : "bg-white/5 border-white/10 group-hover:bg-white/10"
                      )}>
                        <ShoppingBag className={cn(
                          "h-7 w-7",
                          listingType === "sell" ? "text-white" : "text-white/80"
                        )} />
                      </div>
                      <div className={cn(
                        "text-lg font-medium mb-1",
                        listingType === "sell" ? "text-black" : "text-white"
                      )}>
                        Cash In
                      </div>
                      <div className={cn(
                        "text-xs leading-relaxed",
                        listingType === "sell" ? "text-black/70" : "text-white/50"
                      )}>
                        Buyers can purchase with cash/UPI
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setListingType("trade")}
                    className={cn(
                      "border transition-all text-center relative overflow-hidden group",
                      listingType === "trade"
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                    )}
                    data-testid="button-type-trade"
                  >
                    <div className="p-6">
                      <div className={cn(
                        "w-14 h-14 mx-auto mb-3 border flex items-center justify-center transition-colors",
                        listingType === "trade" 
                          ? "bg-black border-black" 
                          : "bg-white/5 border-white/10 group-hover:bg-white/10"
                      )}>
                        <Repeat className={cn(
                          "h-7 w-7",
                          listingType === "trade" ? "text-white" : "text-white/80"
                        )} />
                      </div>
                      <div className={cn(
                        "text-lg font-medium mb-1",
                        listingType === "trade" ? "text-black" : "text-white"
                      )}>
                        Trade
                      </div>
                      <div className={cn(
                        "text-xs leading-relaxed",
                        listingType === "trade" ? "text-black/70" : "text-white/50"
                      )}>
                        Trade for other coupons
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Note */}
            <div className="bg-black border border-white/10 shadow-xl">
              <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-white/40" />
                  <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Additional Note (Optional)</h3>
                </div>
              </div>
              <div className="p-5">
                <Textarea
                  value={additionalNote}
                  onChange={(e) => {
                    if (e.target.value.length <= 150) {
                      setAdditionalNote(e.target.value);
                    }
                  }}
                  placeholder="Add any special instructions or notes about your listing..."
                  className="bg-white/[0.02] border-white/[0.05] text-white rounded-none min-h-[100px] resize-none focus:bg-white/[0.04] focus:border-white/10 transition-colors placeholder:text-white/30"
                  data-testid="input-additional-note"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="text-xs text-white/40">
                    Maximum 150 characters
                  </p>
                  <p className={cn(
                    "text-xs font-mono",
                    additionalNote.length > 140 ? "text-yellow-400" : "text-white/40"
                  )}>
                    {additionalNote.length}/150
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'select-coupons':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider">
                  Selected Coupons ({selectedCoupons.length}/5)
                </Label>
                <p className="text-xs text-white/40 mt-1">Minimum 1, Maximum 5</p>
              </div>
              <Button
                onClick={() => setShowCouponSelector(true)}
                className="bg-white text-black hover:bg-white/90 rounded-none h-9 text-xs"
                data-testid="button-select-coupons"
              >
                <Plus className="h-3 w-3 mr-1" />
                {selectedCoupons.length > 0 ? "Edit Selection" : "Select Coupons"}
              </Button>
            </div>

            {selectedCoupons.length === 0 ? (
              <div className="border border-white/20 border-dashed p-12 text-center">
                <Tag className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm mb-1">No coupons selected</p>
                <p className="text-white/40 text-xs">Click "Select Coupons" to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCoupons.map((coupon, index) => {
                  const valueBadge = getValueScoreBadge(coupon.valueScore);
                  return (
                    <div
                      key={coupon.id}
                      className="bg-black border border-white/10 shadow-xl overflow-hidden"
                      data-testid={`selected-coupon-${coupon.id}`}
                    >
                      {/* Header */}
                      <div className="border-b border-white/10 bg-white/[0.02] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <span className="flex items-center justify-center w-6 h-6 bg-white/5 border border-white/10 text-white/60 text-xs font-mono flex-shrink-0">
                              {index + 1}
                            </span>
                            <h3 className="text-white font-medium text-sm truncate flex-1">
                              {coupon.title}
                            </h3>
                            <Badge className={cn(
                              "rounded-none text-[10px] px-2 py-0.5 font-medium flex-shrink-0",
                              valueBadge.bgClass,
                              valueBadge.textClass,
                              valueBadge.borderClass
                            )}>
                              {coupon.valueScore.toFixed(1)}
                            </Badge>
                          </div>
                          <button
                            onClick={() => handleRemoveCoupon(coupon.id)}
                            className="text-white/40 hover:text-white hover:bg-white/10 p-1.5 border border-white/10 transition-all flex-shrink-0"
                            data-testid={`button-remove-${coupon.id}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                          <span className="font-medium">{coupon.brand}</span>
                          <span>•</span>
                          <span className="font-mono text-white/40">{coupon.code}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                            <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Value</p>
                            <p className="text-white font-medium text-sm">
                              {coupon.valueType === 'fixed' ? '₹' : ''}{coupon.value}{coupon.valueType === 'percentage' ? '%' : ''}
                            </p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                            <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Expires</p>
                            <p className="text-white font-medium text-sm">{coupon.expiryDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'buy-details':
        return (
          <div className="space-y-4">
            {listingType === "sell" ? (
              <>
                {/* Selling Price */}
                <div className="bg-black border border-white/10 shadow-xl">
                  <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                    <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Selling Price (₹) *</h3>
                  </div>
                  <div className="p-5">
                    <Input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="Enter total price for all coupons"
                      className="bg-white/[0.02] border-white/[0.05] text-white rounded-none h-14 text-2xl font-light focus:bg-white/[0.04] focus:border-white/10 transition-colors placeholder:text-white/20"
                      data-testid="input-selling-price"
                    />
                    <div className="mt-4 pt-4 border-t border-white/[0.05]">
                      <p className="text-xs text-white/50">
                        Set a competitive price for all {selectedCoupons.length} coupon{selectedCoupons.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auto Decrease Option */}
                <div className="bg-black border border-white/10 shadow-xl">
                  {/* Header */}
                  <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <TrendingDown className="h-5 w-5 text-white/70" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Auto-Decrease Price</h3>
                          <p className="text-[10px] text-white/40 mt-0.5">Smart pricing based on expiry</p>
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
                  </div>

                  {/* Content */}
                  {enableAutoDecrease && (
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white/[0.02] border border-white/[0.05] p-3">
                          <Label className="text-white/40 text-[10px] uppercase tracking-wider mb-2 block">
                            Start Days Before
                          </Label>
                          <select
                            value={offerStartDays}
                            onChange={(e) => setOfferStartDays(e.target.value)}
                            className="w-full bg-transparent border-0 text-white text-base font-medium p-0 focus:outline-none focus:ring-0"
                            data-testid="select-offer-start-days"
                          >
                            {[1, 2, 3, 5, 7, 10, 15, 20, 30].map(day => (
                              <option key={day} value={day} className="bg-black">{day} day{day !== 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-3">
                          <Label className="text-white/40 text-[10px] uppercase tracking-wider mb-2 block">
                            Daily Decrease
                          </Label>
                          <select
                            value={dailyDecreasePercent}
                            onChange={(e) => setDailyDecreasePercent(e.target.value)}
                            className="w-full bg-transparent border-0 text-white text-base font-medium p-0 focus:outline-none focus:ring-0"
                            data-testid="select-daily-decrease"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(percent => (
                              <option key={percent} value={percent} className="bg-black">{percent}%</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.05] p-4">
                        <p className="text-xs text-white/50 leading-relaxed">
                          <span className="text-white/70 font-medium">Example:</span> Price will decrease by <span className="text-white font-medium">{dailyDecreasePercent}%</span> per day starting <span className="text-white font-medium">{offerStartDays} days</span> before the earliest expiry date
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Trade Coupon Requirements */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-white/60 text-xs uppercase tracking-wider">
                        Trade Coupon Requirements
                      </Label>
                      <p className="text-xs text-white/40 mt-1">Maximum 8 coupons</p>
                    </div>
                    {tradeCards.length < 8 && (
                      <Button
                        onClick={handleAddTradeCard}
                        className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none h-8 text-xs"
                        data-testid="button-add-coupon"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Coupon
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {tradeCards.map((card, index) => {
                      const availableBrands = getBrandsByCategory(card.category);
                      const searchQuery = brandSearchQuery[card.id] || '';
                      const filteredBrands = availableBrands.filter(brand => 
                        brand.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      return (
                        <div
                          key={card.id}
                          className="border border-white/20 p-5 bg-black/80"
                          data-testid={`trade-coupon-${card.id}`}
                        >
                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-white text-sm font-light tracking-wider uppercase">
                                Coupon {index + 1}
                              </span>
                              {index === 0 && (
                                <span className="text-white/50 text-xs">(Required)</span>
                              )}
                            </div>
                            {index > 0 && (
                              <button
                                onClick={() => handleRemoveTradeCard(card.id)}
                                className="text-white/60 hover:text-white transition-colors"
                                data-testid={`button-remove-coupon-${card.id}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="space-y-4">
                            {/* Category Selection */}
                            <div>
                              <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                                Category
                              </Label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setOpenCategoryDropdown(openCategoryDropdown === card.id ? null : card.id)}
                                  className="w-full bg-white/10 border border-white/20 text-white rounded-none h-12 px-4 pr-10 focus:outline-none focus:border-white focus:bg-white/15 transition-all cursor-pointer text-sm font-light hover:bg-white/15 flex items-center justify-between"
                                  data-testid={`select-coupon-category-${card.id}`}
                                >
                                  <span className={card.category && card.category !== '' ? 'text-white' : 'text-white/40'}>
                                    {getCategoryLabel(card.category)}
                                  </span>
                                  <svg className={`h-4 w-4 text-white/60 transition-transform ${openCategoryDropdown === card.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4"/>
                                  </svg>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {openCategoryDropdown === card.id && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 z-50 max-h-64 overflow-y-auto">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTradeCards(tradeCards.map(c => 
                                          c.id === card.id ? { ...c, category: 'any', brands: [] } : c
                                        ));
                                        setBrandSearchQuery({...brandSearchQuery, [card.id]: ''});
                                        setOpenCategoryDropdown(null);
                                      }}
                                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm border-b border-white/10"
                                      data-testid={`option-category-any-${card.id}`}
                                    >
                                      Any Category
                                    </button>
                                    {categories.filter(c => c.id !== "all").map((cat) => (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                          setTradeCards(tradeCards.map(c => 
                                            c.id === card.id ? { ...c, category: cat.id, brands: [] } : c
                                          ));
                                          setBrandSearchQuery({...brandSearchQuery, [card.id]: ''});
                                          setOpenCategoryDropdown(null);
                                        }}
                                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm border-b border-white/10 last:border-0"
                                        data-testid={`option-category-${cat.id}-${card.id}`}
                                      >
                                        {cat.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Brands - Shows only when category is selected */}
                            {card.category && card.category !== "" && (
                              <div>
                                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                                  Brands {card.brands.length > 0 && <span className="text-white/40">({card.brands.length})</span>}
                                </Label>

                                {/* Button to open brand selector */}
                                <button
                                  type="button"
                                  onClick={() => setOpenBrandSelectorId(card.id)}
                                  className="w-full bg-white/10 border border-white/20 text-white rounded-none h-12 px-4 focus:outline-none focus:border-white focus:bg-white/15 transition-all text-sm font-light hover:bg-white/15 flex items-center justify-between"
                                  data-testid={`button-select-brands-${card.id}`}
                                >
                                  <span className={card.brands.length > 0 ? 'text-white' : 'text-white/40'}>
                                    {card.brands.length > 0 ? `${card.brands.length} brand${card.brands.length !== 1 ? 's' : ''} selected` : 'Select brands (optional)'}
                                  </span>
                                  <ChevronRight className="h-4 w-4 text-white/60" />
                                </button>

                                {/* Selected Brands Preview */}
                                {card.brands.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {card.brands.map((brand) => (
                                      <Badge 
                                        key={brand}
                                        className="bg-white/10 border-0 text-white/80 rounded-none px-2 py-0.5 text-xs"
                                      >
                                        {brand}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Coupon Rating Range Slider */}
                            <div className="mt-8">
                              <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                                Coupon Rating (out of 10)
                              </Label>
                              <div className="space-y-3">
                                <Slider
                                  value={[card.minRating, card.maxRating]}
                                  onValueChange={(value) => {
                                    handleUpdateTradeCard(card.id, 'minRating', value[0]);
                                    handleUpdateTradeCard(card.id, 'maxRating', value[1]);
                                  }}
                                  min={0}
                                  max={10}
                                  step={0.5}
                                  className="w-full"
                                  data-testid={`slider-rating-${card.id}`}
                                />
                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white/40 text-xs">Min:</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                      <span className="text-white text-base font-light">{card.minRating.toFixed(1)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white/40 text-xs">Max:</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                      <span className="text-white text-base font-light">{card.maxRating.toFixed(1)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            {/* Listing Type */}
            <div className="bg-black border border-white/10 shadow-xl">
              <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Listing Type</h3>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                    {listingType === 'sell' ? <ShoppingBag className="h-6 w-6 text-white/80" /> : <Repeat className="h-6 w-6 text-white/80" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-base font-medium mb-0.5">{listingType === 'sell' ? 'Cash In' : 'Trade'}</p>
                    <p className="text-white/50 text-xs">
                      {listingType === 'sell' ? 'Buyers can purchase with cash/UPI' : 'Trade with other coupon holders'}
                    </p>
                  </div>
                </div>
                {additionalNote && (
                  <div className="mt-4 pt-4 border-t border-white/[0.05] bg-white/[0.01] -mx-5 px-5 -mb-5 pb-5">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Additional Note</p>
                    <p className="text-white/70 text-sm leading-relaxed">{additionalNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Coupons */}
            <div className="bg-black border border-white/10 shadow-xl">
              <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">Selected Coupons</h3>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {selectedCoupons.map((coupon, index) => (
                    <div key={coupon.id} className="bg-white/[0.02] border border-white/[0.05] p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/40 text-xs font-mono">#{index + 1}</span>
                            <h4 className="text-white text-sm font-medium truncate">{coupon.title}</h4>
                          </div>
                          <p className="text-white/50 text-xs">{coupon.brand} • <span className="font-mono">{coupon.code}</span></p>
                        </div>
                        <Badge className={cn(
                          "rounded-none text-[10px] flex-shrink-0",
                          getValueScoreBadge(coupon.valueScore).bgClass,
                          getValueScoreBadge(coupon.valueScore).textClass
                        )}>
                          {coupon.valueScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between items-center">
                  <span className="text-white/50 text-xs uppercase tracking-widest">Total Coupons</span>
                  <span className="text-white text-2xl font-light">{selectedCoupons.length}</span>
                </div>
              </div>
            </div>

            {/* Buy Details */}
            <div className="bg-black border border-white/10 shadow-xl">
              <div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
                <h3 className="text-xs font-medium tracking-widest text-white/50 uppercase">
                  {listingType === 'sell' ? 'Pricing Details' : 'Trade Requirements'}
                </h3>
              </div>
              <div className="p-5">
                {listingType === 'sell' ? (
                  <>
                    <div className="bg-white/[0.02] border border-white/[0.05] p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm uppercase tracking-wider">Selling Price</span>
                        <span className="text-white text-3xl font-light">₹{sellingPrice}</span>
                      </div>
                    </div>
                    {enableAutoDecrease && (
                      <div className="mt-3 bg-white/[0.02] border border-white/[0.05] p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                            <TrendingDown className="h-4 w-4 text-white/70" />
                          </div>
                          <span className="text-sm text-white font-medium">Auto-Decrease Enabled</span>
                        </div>
                        <div className="text-xs text-white/50 space-y-2 pl-10">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                            <p>Starts {offerStartDays} days before expiry</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                            <p>Decreases by {dailyDecreasePercent}% per day</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Looking for:</p>
                    {tradeCards.filter(card => card.category).map((card, index) => (
                      <div key={card.id} className="bg-white/[0.02] border border-white/[0.05] p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-white/40 text-xs font-mono">#{index + 1}</span>
                            <p className="text-white text-sm font-medium">
                              {card.category === 'any' ? 'Any Category' : categories.find(c => c.id === card.category)?.label}
                            </p>
                          </div>
                          {(card.minRating > 0 || card.maxRating < 10) && (
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-yellow-400 font-medium">{card.minRating.toFixed(1)}-{card.maxRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        {card.brands.length > 0 && (
                          <div className="pt-3 border-t border-white/[0.05]">
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Brands</p>
                            <div className="flex flex-wrap gap-2">
                              {card.brands.map((brand) => (
                                <Badge 
                                  key={brand}
                                  className="bg-white/5 border border-white/10 text-white/70 rounded-none px-2.5 py-1 text-xs font-normal"
                                >
                                  {brand}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/coupon-mart")}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">CREATE LISTING</h1>
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
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Listing Progress</span>
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
                {selectedCoupons.length > 0 ? `${selectedCoupons.length} Coupon${selectedCoupons.length !== 1 ? 's' : ''}` : 'New Listing'}
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
            onClick={currentStageIndex === LISTING_STAGES.length - 1 ? handleSubmit : handleNextStage}
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-next"
          >
            {currentStageIndex === LISTING_STAGES.length - 1 ? (
              isSubmitting ? "CREATING..." : "CREATE LISTING"
            ) : (
              <>
                NEXT
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Coupon Selector Dialog */}
      <Dialog open={showCouponSelector} onOpenChange={setShowCouponSelector}>
        <DialogContent className="bg-black border border-white/20 text-white w-[90vw] sm:w-full max-w-md p-0 rounded-none flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 border-b border-white/10">
            <DialogHeader className="px-5 pt-5 pb-4">
              <DialogTitle className="text-white text-lg font-light tracking-wider text-center">
                SELECT COUPONS
              </DialogTitle>
              <p className="text-xs text-white/60 mt-2 text-center">
                {selectedCoupons.length} of 5 selected • Min 1, Max 5
              </p>
            </DialogHeader>
            
            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <div className="px-5 pb-3 overflow-x-auto">
                <TabsList className="bg-transparent inline-flex gap-2 h-auto p-0 w-max">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="rounded-none border border-white/20 data-[state=active]:bg-white data-[state=active]:text-black bg-white/5 text-white/60 text-xs px-3 py-1.5 whitespace-nowrap"
                      data-testid={`tab-category-${cat.id}`}
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Coupon List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm">No coupons in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCoupons.map((coupon) => {
                  const isSelected = selectedCoupons.some(c => c.id === coupon.id);
                  const valueBadge = getValueScoreBadge(coupon.valueScore);

                  return (
                    <button
                      key={coupon.id}
                      onClick={() => handleCouponToggle(coupon)}
                      className={cn(
                        "w-full border text-left transition-all relative overflow-hidden group",
                        isSelected
                          ? "bg-gradient-to-br from-white/15 to-white/5 border-white shadow-lg"
                          : "bg-gradient-to-br from-white/5 to-transparent border-white/20 hover:border-white/40 hover:from-white/10"
                      )}
                      data-testid={`coupon-option-${coupon.id}`}
                    >
                      {/* Selection Indicator Bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                      )}
                      
                      <div className="p-3.5 pl-4">
                        {/* Top Row: Brand & Checkbox */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                              <Tag className="h-4 w-4 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium text-sm mb-0.5 truncate">{coupon.brand}</h3>
                              <p className="text-white/40 text-xs font-mono truncate">{coupon.code}</p>
                            </div>
                          </div>
                          <div className={cn(
                            "w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
                            isSelected ? "border-white bg-white" : "border-white/40 group-hover:border-white/60"
                          )}>
                            {isSelected && <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />}
                          </div>
                        </div>

                        {/* Title */}
                        <div className="mb-2.5 pl-11">
                          <p className="text-white text-sm leading-snug">{coupon.title}</p>
                        </div>

                        {/* Bottom Row: Value, Score & Expiry */}
                        <div className="flex items-center justify-between text-xs pl-11">
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 font-medium">
                              {coupon.valueType === 'fixed' ? '₹' : ''}{coupon.value}{coupon.valueType === 'percentage' ? '%' : ''} OFF
                            </span>
                            <Badge className={cn(
                              "rounded-none text-[9px] px-1 py-0",
                              valueBadge.bgClass,
                              valueBadge.textClass,
                              valueBadge.borderClass
                            )}>
                              {coupon.valueScore.toFixed(1)}
                            </Badge>
                          </div>
                          <div className="text-white/40 text-xs">
                            {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Buttons - Fixed */}
          <div className="flex-shrink-0 bg-black border-t border-white/10 px-5 py-4">
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCouponSelector(false)}
                variant="outline"
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none h-11 text-sm"
                data-testid="button-cancel-selection"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedCoupons.length === 0}
                className="flex-1 bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 rounded-none h-11 text-sm font-medium"
                data-testid="button-confirm-selection"
              >
                Confirm {selectedCoupons.length > 0 && `(${selectedCoupons.length})`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Brand Selector Dialog */}
      {openBrandSelectorId && (() => {
        const currentCard = tradeCards.find(c => c.id === openBrandSelectorId);
        if (!currentCard) return null;
        
        const availableBrands = currentCard.category === 'any' 
          ? [] 
          : getBrandsByCategory(currentCard.category);
        const searchQuery = brandSearchQuery[openBrandSelectorId] || '';
        const filteredBrands = availableBrands.filter(brand => 
          brand.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <Dialog open={true} onOpenChange={() => setOpenBrandSelectorId(null)}>
            <DialogContent className="bg-black border border-white/20 text-white w-[90vw] sm:w-full max-w-md p-0 rounded-none flex flex-col h-[75vh] sm:h-auto sm:max-h-[75vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 border-b border-white/10">
                <DialogHeader className="px-5 pt-5 pb-4">
                  <DialogTitle className="text-white text-lg font-light tracking-wider text-center">
                    SELECT BRANDS
                  </DialogTitle>
                  <p className="text-xs text-white/60 mt-2 text-center">
                    {currentCard.brands.length} selected • Optional
                  </p>
                </DialogHeader>
                
                {/* Search */}
                <div className="px-5 pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      type="text"
                      placeholder="Search brands..."
                      value={searchQuery}
                      onChange={(e) => setBrandSearchQuery({...brandSearchQuery, [openBrandSelectorId]: e.target.value})}
                      className="pl-10 bg-white/5 border-white/10 text-white rounded-none h-10 focus:outline-none placeholder:text-white/40 text-sm"
                      data-testid={`input-search-brands-dialog-${openBrandSelectorId}`}
                    />
                  </div>
                </div>
              </div>

              {/* Brand List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {filteredBrands.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="h-10 w-10 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No brands found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredBrands.map((brand) => {
                      const isSelected = currentCard.brands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className={cn(
                            "flex items-center gap-3 p-3 border transition-all cursor-pointer rounded-none",
                            isSelected 
                              ? "bg-white/10 text-white border-white/20" 
                              : "bg-transparent text-white/80 border-white/10 hover:bg-white/5 hover:border-white/20"
                          )}
                          data-testid={`option-brand-dialog-${openBrandSelectorId}-${brand}`}
                        >
                          <div className={cn(
                            "w-5 h-5 border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-all",
                            isSelected 
                              ? "bg-white border-white" 
                              : "bg-transparent border-white/40"
                          )}>
                            {isSelected && <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />}
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const newBrands = isSelected
                                ? currentCard.brands.filter(b => b !== brand)
                                : [...currentCard.brands, brand];
                              handleUpdateTradeCard(openBrandSelectorId, 'brands', newBrands);
                            }}
                            className="sr-only"
                          />
                          <span className="text-sm flex-1">{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Buttons - Fixed */}
              <div className="flex-shrink-0 bg-black border-t border-white/10 px-5 py-4">
                <Button
                  onClick={() => setOpenBrandSelectorId(null)}
                  className="w-full bg-white text-black hover:bg-white/90 rounded-none h-11 text-sm font-medium"
                  data-testid="button-confirm-brands"
                >
                  Done {currentCard.brands.length > 0 && `(${currentCard.brands.length})`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
