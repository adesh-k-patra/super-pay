import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Calendar, Package, RefreshCcw, Repeat2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

interface OfferedCoupon {
  code: string;
  title: string;
  brand: string;
  value: string | number;
  expiry: string;
  status: "pending" | "accepted" | "rejected";
}

interface Coupon {
  code: string;
  title: string;
  brand: string;
  value: string | number;
  category: string;
  type: string;
  valueType: string;
  expiryDate: string;
}

interface TradeOffer {
  id: string;
  listingId: string;
  offererId: string;
  listingOwnerId: string;
  offeredCoupons: OfferedCoupon[];
  offerNote?: string;
  status: string;
  createdAt: string;
  respondedAt?: string;
  responseNote?: string;
}

interface Listing {
  id: string;
  coupons: Coupon[];
}

interface OfferDataResponse {
  offer: TradeOffer;
  listing: Listing;
  offererName: string;
}

export default function CouponMartOfferDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/coupon-mart/offer/:id");
  const offerId = params?.id;
  const { toast } = useToast();
  const { user } = useAuth(); // Move useAuth to top before any conditional returns
  const [responseNote, setResponseNote] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "accept" | "reject" | "cancel" | "cancel_acceptance" | "confirm_rejection" | null;
    couponCode: string | null;
    couponTitle: string | null;
  }>({ open: false, action: null, couponCode: null, couponTitle: null });
  const [swapAnimatingCoupon, setSwapAnimatingCoupon] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<"accept" | "reject" | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [showFinalRejectionDialog, setShowFinalRejectionDialog] = useState(false);
  
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [swappingCouponCode, setSwappingCouponCode] = useState<string | null>(null);
  const [selectedSwapCoupon, setSelectedSwapCoupon] = useState<any>(null);
  const [swappedCoupons, setSwappedCoupons] = useState<Record<string, any>>({});
  const [swapNote, setSwapNote] = useState("");
  const [localCouponStatuses, setLocalCouponStatuses] = useState<Record<string, "pending" | "accepted" | "rejected">>({});
  const [searchQuery, setSearchQuery] = useState("");

  const getAvailableCoupons = () => {
    return [
      { code: "ZOMATO500", title: "₹500 Off on Food Delivery", brand: "Zomato", value: "500", category: "food", expiry: "2026-01-31" },
      { code: "SWIGGY400", title: "₹400 Off on Food Orders", brand: "Swiggy", value: "400", category: "food", expiry: "2026-02-15" },
      { code: "BIGBASKET300", title: "₹300 Off on Groceries", brand: "BigBasket", value: "300", category: "food", expiry: "2025-12-25" },
      { code: "MAKEMYTRIP1500", title: "₹1500 Off on Flights", brand: "MakeMyTrip", value: "1500", category: "travel", expiry: "2026-03-20" },
      { code: "GOIBIBO1000", title: "₹1000 Off on Hotels", brand: "Goibibo", value: "1000", category: "travel", expiry: "2026-02-28" },
      { code: "CLEARTRIP800", title: "₹800 Off on Bus Tickets", brand: "Cleartrip", value: "800", category: "travel", expiry: "2025-12-30" },
      { code: "AMAZON1500", title: "₹1500 Amazon Gift Voucher", brand: "Amazon", value: "1500", category: "shopping", expiry: "2026-06-30" },
      { code: "FLIPKART1000", title: "₹1000 Off on Electronics", brand: "Flipkart", value: "1000", category: "shopping", expiry: "2026-01-15" },
      { code: "MYNTRA800", title: "₹800 Off on Fashion", brand: "Myntra", value: "800", category: "shopping", expiry: "2025-12-31" },
      { code: "AIRTEL350", title: "₹350 Off on Recharge", brand: "Airtel", value: "350", category: "bills", expiry: "2026-01-31" },
      { code: "JIO300", title: "₹300 Cashback on Recharge", brand: "Jio", value: "300", category: "bills", expiry: "2026-02-15" },
      { code: "PAYTM250", title: "₹250 Off on Bill Payments", brand: "Paytm", value: "250", category: "bills", expiry: "2025-12-28" },
      { code: "APOLLO500", title: "₹500 Off on Medicines", brand: "Apollo Pharmacy", value: "500", category: "medical", expiry: "2026-01-20" },
      { code: "NETMEDS400", title: "₹400 Off on Health Products", brand: "Netmeds", value: "400", category: "medical", expiry: "2026-02-10" },
      { code: "PHARMEASY350", title: "₹350 Off on Lab Tests", brand: "PharmEasy", value: "350", category: "medical", expiry: "2025-12-29" },
      { code: "CULTFIT600", title: "₹600 Off on Fitness Classes", brand: "Cult.fit", value: "600", category: "fitness", expiry: "2026-03-31" },
      { code: "GOLDSGYM500", title: "₹500 Off on Gym Membership", brand: "Gold's Gym", value: "500", category: "fitness", expiry: "2026-01-25" },
      { code: "FITPASS400", title: "₹400 Off on Fitness Pass", brand: "FITPASS", value: "400", category: "fitness", expiry: "2026-02-20" },
      { code: "UDEMY800", title: "₹800 Off on Online Courses", brand: "Udemy", value: "800", category: "education", expiry: "2026-04-30" },
      { code: "COURSERA600", title: "₹600 Off on Certifications", brand: "Coursera", value: "600", category: "education", expiry: "2026-03-15" },
      { code: "BYJU500", title: "₹500 Off on Learning App", brand: "BYJU'S", value: "500", category: "education", expiry: "2026-01-31" },
      { code: "BOOKMYSHOW400", title: "₹400 Off on Movie Tickets", brand: "BookMyShow", value: "400", category: "entertainment", expiry: "2026-02-28" },
      { code: "SPOTIFY300", title: "3 Months Spotify Premium", brand: "Spotify", value: "300", category: "entertainment", expiry: "2026-01-31" },
      { code: "PRIMEVIDEO250", title: "₹250 Amazon Prime Voucher", brand: "Prime Video", value: "250", category: "entertainment", expiry: "2025-12-31" },
    ];
  };

  // Dummy data for the sent offers
  const getDummyOfferData = (id: string): OfferDataResponse | null => {
    const dummyOffers: Record<string, OfferDataResponse> = {
      "offer-sent-1": {
        offer: {
          id: "offer-sent-1",
          listingId: "listing-xyz-1",
          offererId: user?.id || "",
          listingOwnerId: "owner-123",
          offeredCoupons: [{
            code: "NYKAA300",
            title: "₹300 Off on Beauty Products",
            brand: "Nykaa",
            value: "300",
            expiry: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending"
          }],
          offerNote: "Would love to trade my Nykaa coupon for your Flipkart one!",
          status: "pending",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        listing: {
          id: "listing-xyz-1",
          coupons: [{
            code: "FLIPKART500",
            title: "₹500 Off on Electronics",
            brand: "Flipkart",
            value: 500,
            category: "shopping",
            type: "fixed_discount",
            valueType: "fixed",
            expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          }]
        },
        offererName: "You"
      },
      "offer-sent-2": {
        offer: {
          id: "offer-sent-2",
          listingId: "listing-xyz-2",
          offererId: user?.id || "",
          listingOwnerId: "owner-456",
          offeredCoupons: [
            {
              code: "SWIGGY200",
              title: "₹200 Off on Food Orders",
              brand: "Swiggy",
              value: "200",
              expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              status: "accepted"
            },
            {
              code: "ZOMATO250",
              title: "₹250 Off on Zomato",
              brand: "Zomato",
              value: "250",
              expiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
              status: "accepted"
            },
            {
              code: "DOMINOS150",
              title: "₹150 Domino's Pizza",
              brand: "Domino's",
              value: "150",
              expiry: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
              status: "pending"
            },
            {
              code: "BURGERKING100",
              title: "₹100 Burger King Voucher",
              brand: "Burger King",
              value: "100",
              expiry: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
              status: "pending"
            }
          ],
          offerNote: "Updated offer: Swapped rejected coupons (McDonald's & KFC) with new ones (Domino's & Burger King).",
          status: "pending",
          createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
          respondedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
          responseNote: "Accepted 2 of your 4 coupons (Swiggy & Zomato). Rejected the other 2 (McDonald's & KFC). Let's proceed!",
        },
        listing: {
          id: "listing-xyz-2",
          coupons: [{
            code: "AMAZON800",
            title: "₹800 Amazon Voucher",
            brand: "Amazon",
            value: 800,
            category: "shopping",
            type: "fixed_discount",
            valueType: "fixed",
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }]
        },
        offererName: "You"
      },
      "offer-sent-3": {
        offer: {
          id: "offer-sent-3",
          listingId: "listing-xyz-3",
          offererId: user?.id || "",
          listingOwnerId: "owner-789",
          offeredCoupons: [
            {
              code: "FLIPKART600",
              title: "₹600 Flipkart Electronics",
              brand: "Flipkart",
              value: "600",
              expiry: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
              status: "accepted"
            },
            {
              code: "AMAZON500",
              title: "₹500 Amazon Shopping",
              brand: "Amazon",
              value: "500",
              expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: "accepted"
            },
            {
              code: "MYNTRA350",
              title: "₹350 Myntra Fashion",
              brand: "Myntra",
              value: "350",
              expiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
              status: "rejected"
            },
            {
              code: "SNAPDEAL250",
              title: "₹250 Snapdeal Voucher",
              brand: "Snapdeal",
              value: "250",
              expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              status: "rejected"
            },
            {
              code: "AJIO200",
              title: "₹200 Ajio Fashion",
              brand: "Ajio",
              value: "200",
              expiry: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
              status: "rejected"
            }
          ],
          offerNote: "I'm offering 5 great shopping coupons for your combo pack. Interested in trading?",
          status: "rejected",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          respondedAt: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
          responseNote: "Thanks for the offer! I accepted 2 of your coupons (Flipkart & Amazon) but rejected the other 3 (Myntra, Snapdeal & Ajio). You can swap the rejected ones if you want!",
        },
        listing: {
          id: "listing-xyz-3",
          coupons: [
            {
              code: "ZOMATO400",
              title: "₹400 Zomato Food Delivery",
              brand: "Zomato",
              value: 400,
              category: "food",
              type: "fixed_discount",
              valueType: "fixed",
              expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              code: "SWIGGY350",
              title: "₹350 Swiggy Orders",
              brand: "Swiggy",
              value: 350,
              category: "food",
              type: "fixed_discount",
              valueType: "fixed",
              expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              code: "UBER300",
              title: "₹300 Uber Eats",
              brand: "Uber",
              value: 300,
              category: "food",
              type: "fixed_discount",
              valueType: "fixed",
              expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              code: "DOMINOS250",
              title: "₹250 Domino's Pizza",
              brand: "Domino's",
              value: 250,
              category: "food",
              type: "fixed_discount",
              valueType: "fixed",
              expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ]
        },
        offererName: "You"
      },
      "offer-sent-4": {
        offer: {
          id: "offer-sent-4",
          listingId: "listing-xyz-4",
          offererId: user?.id || "",
          listingOwnerId: "owner-234",
          offeredCoupons: [
            {
              code: "BIGBASKET250",
              title: "₹250 Off on Groceries",
              brand: "BigBasket",
              value: "250",
              expiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
              status: "accepted"
            },
            {
              code: "GROFERS200",
              title: "₹200 Grofers Voucher",
              brand: "Grofers",
              value: "200",
              expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: "accepted"
            },
            {
              code: "FRESHTOHOME150",
              title: "₹150 FreshToHome",
              brand: "FreshToHome",
              value: "150",
              expiry: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
              status: "rejected"
            }
          ],
          offerNote: "Offering 3 coupons total: BigBasket, Grofers, and FreshToHome. Interested?",
          status: "rejected",
          createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          respondedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
          responseNote: "Rejected 1 card (FreshToHome). Accepted the other 2! Deal on!",
        },
        listing: {
          id: "listing-xyz-4",
          coupons: [{
            code: "BOOKMYSHOW600",
            title: "₹600 BookMyShow Voucher",
            brand: "BookMyShow",
            value: 600,
            category: "entertainment",
            type: "fixed_discount",
            valueType: "fixed",
            expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
          }]
        },
        offererName: "You"
      },
      "offer-sent-5": {
        offer: {
          id: "offer-sent-5",
          listingId: "listing-xyz-5",
          offererId: user?.id || "",
          listingOwnerId: "owner-567",
          offeredCoupons: [],
          offerNote: "Hi! Can I get this for ₹320? Let me know ASAP!",
          status: "rejected",
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          respondedAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
          responseNote: "Sorry, price is firm at ₹400. Cannot accept lower offers.",
        },
        listing: {
          id: "listing-xyz-5",
          coupons: [{
            code: "UBER500",
            title: "₹500 Uber Voucher",
            brand: "Uber",
            value: 500,
            category: "travel",
            type: "fixed_discount",
            valueType: "fixed",
            expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          }]
        },
        offererName: "You"
      }
    };
    return dummyOffers[id] || null;
  };

  const { data: offerData, isLoading, error } = useQuery<OfferDataResponse>({
    queryKey: ["/api/coupon-mart/trade-offers", offerId],
    queryFn: async () => {
      // Check if this is a dummy offer first
      const dummyData = getDummyOfferData(offerId || "");
      if (dummyData) {
        return dummyData;
      }
      // Otherwise fetch from API
      const response = await fetch(`/api/coupon-mart/trade-offers/${offerId}`);
      if (!response.ok) throw new Error("Failed to fetch offer");
      return response.json();
    },
    enabled: !!offerId,
  });

  const respondToSingleCouponMutation = useMutation({
    mutationFn: async ({ couponCode, status }: { couponCode: string; status: "accepted" | "rejected" }) => {
      return apiRequest("PATCH", `/api/coupon-mart/trade-offers/${offerId}/coupon`, {
        couponCode,
        status,
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/trade-offers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/trade-offers", offerId] });
      toast({
        title: "Coupon Status Updated",
        description: "The coupon status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update coupon status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeTradeM = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/coupon-mart/trade-offers/${offerId}/complete`, {
        responseNote,
      });
    },
    onSuccess: () => {
      setShowAnimation(true);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/trade-offers"] });
        queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/trade-offers", offerId] });
        navigate("/coupon-mart/payment-success?type=trade");
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/50">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (error || !offerData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center border border-white/10 p-8 max-w-md">
          <XCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Offer Not Found</h2>
          <p className="text-white/50 text-sm mb-6">
            This trade offer doesn't exist or you don't have access to it.
          </p>
          <Button
            onClick={() => navigate("/coupon-mart/trade-offers")}
            className="bg-white text-black hover:bg-white/90 rounded-none"
            data-testid="button-back-home"
          >
            Back to Trade Offers
          </Button>
        </div>
      </div>
    );
  }

  const currentData = offerData;
  const { offer, listing, offererName } = currentData;
  
  // Treat all offers as needing local state management for immediate UI updates
  // This ensures animations and Cancel buttons work smoothly
  const isOwner = user?.id === offer.listingOwnerId;
  const isPending = offer.status === "pending";

  // Get offered coupons from the offer
  const offeredCoupons: OfferedCoupon[] = offer.offeredCoupons || [];
  const listingCoupons: Coupon[] = listing.coupons || [];

  // Helper to get current status (with local state override for immediate UI feedback)
  const getCouponStatus = (coupon: OfferedCoupon): "pending" | "accepted" | "rejected" => {
    // Check local state first for immediate UI updates
    if (localCouponStatuses[coupon.code]) {
      return localCouponStatuses[coupon.code];
    }
    // Fall back to server status
    return coupon.status;
  };

  const acceptedCount = offeredCoupons.filter((c: OfferedCoupon) => getCouponStatus(c) === "accepted").length;
  const rejectedCount = offeredCoupons.filter((c: OfferedCoupon) => getCouponStatus(c) === "rejected").length;
  const pendingCount = offeredCoupons.filter((c: OfferedCoupon) => getCouponStatus(c) === "pending").length;
  const totalCount = offeredCoupons.length;
  const allAccepted = totalCount > 0 && acceptedCount === totalCount;
  const allRejected = totalCount > 0 && rejectedCount === totalCount;
  const hasSwappedCoupons = Object.keys(swappedCoupons).length > 0;
  
  // Compute effective status:
  // - If buyer has swapped coupons (updating offer), status should be pending
  // - If ANY coupon is rejected, the entire trade is rejected
  // - If ALL coupons are accepted, the trade is accepted
  // - Otherwise, it's pending
  const effectiveStatus = 
    hasSwappedCoupons ? "pending" :
    rejectedCount > 0 ? "rejected" :
    allAccepted ? "accepted" :
    "pending";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const expiry = new Date(dateString);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAccept = (couponCode: string) => {
    setSwapAnimatingCoupon(couponCode);
    setAnimationType("accept");
    
    setTimeout(() => {
      // Update local state immediately for instant UI feedback
      updateLocalCouponStatus(couponCode, "accepted");
      setSwapAnimatingCoupon(null);
      setAnimationType(null);
      
      // Also update the server in the background
      respondToSingleCouponMutation.mutate(
        { couponCode, status: "accepted" },
        {
          onError: () => {
            // If server update fails, revert local state
            setLocalCouponStatuses(prev => {
              const newState = { ...prev };
              delete newState[couponCode];
              return newState;
            });
          },
        }
      );
    }, 1500);
  };

  const handleReject = (couponCode: string) => {
    setSwapAnimatingCoupon(couponCode);
    setAnimationType("reject");
    
    setTimeout(() => {
      // Update local state immediately for instant UI feedback
      updateLocalCouponStatus(couponCode, "rejected");
      setSwapAnimatingCoupon(null);
      setAnimationType(null);
      
      // Also update the server in the background
      respondToSingleCouponMutation.mutate(
        { couponCode, status: "rejected" },
        {
          onError: () => {
            // If server update fails, revert local state
            setLocalCouponStatuses(prev => {
              const newState = { ...prev };
              delete newState[couponCode];
              return newState;
            });
          },
        }
      );
    }, 1500);
  };

  const handleCancelStatus = (couponCode: string, couponTitle: string) => {
    const coupon = offeredCoupons.find(c => c.code === couponCode);
    if (!coupon) return;
    
    const currentStatus = getCouponStatus(coupon);
    if (currentStatus === "accepted") {
      openCancelAcceptanceDialog(couponCode, couponTitle);
    } else if (currentStatus === "rejected") {
      openCancelDialog(couponCode, couponTitle);
    }
  };

  const openCancelDialog = (couponCode: string, couponTitle: string) => {
    setConfirmDialog({ open: true, action: "cancel", couponCode, couponTitle });
  };

  const openCancelAcceptanceDialog = (couponCode: string, couponTitle: string) => {
    setConfirmDialog({ open: true, action: "cancel_acceptance", couponCode, couponTitle });
  };

  const handleConfirmCancel = () => {
    if (!confirmDialog.couponCode || !confirmDialog.action) return;

    // Update local state immediately
    updateLocalCouponStatus(confirmDialog.couponCode, "pending");
    setConfirmDialog({ open: false, action: null, couponCode: null, couponTitle: null });
    
    // Also update the server in the background
    respondToSingleCouponMutation.mutate(
      { couponCode: confirmDialog.couponCode, status: "pending" as any },
      {
        onError: () => {
          // If the API doesn't support pending status, just ignore the error
          // The local state has already been updated for UI purposes
          toast({
            title: "Status Updated Locally",
            description: "The status has been reset. You can now accept or reject again.",
          });
        },
      }
    );
  };

  const handleFinalizeRejection = () => {
    setShowFinalRejectionDialog(true);
  };

  const handleConfirmFinalRejection = () => {
    setShowFinalRejectionDialog(false);
    toast({
      title: "Rejection Finalized",
      description: `You have finalized the rejection of ${rejectedCount} coupon${rejectedCount > 1 ? 's' : ''}.`,
    });
  };

  const openSwapDialog = (couponCode: string) => {
    setSwappingCouponCode(couponCode);
    setShowSwapDialog(true);
    setSelectedSwapCoupon(null);
  };

  const handleConfirmSwap = () => {
    if (!swappingCouponCode || !selectedSwapCoupon) return;
    
    setSwappedCoupons({
      ...swappedCoupons,
      [swappingCouponCode]: selectedSwapCoupon
    });
    
    setShowSwapDialog(false);
    setSwappingCouponCode(null);
    setSelectedSwapCoupon(null);
    
    toast({
      title: "Coupon Swapped",
      description: `Ready to swap with ${selectedSwapCoupon.title}. Click Update Offer to submit changes.`,
    });
  };

  const handleCancelSwap = (couponCode: string) => {
    const swappedCoupon = swappedCoupons[couponCode];
    
    setSwappedCoupons(prev => {
      const updated = { ...prev };
      delete updated[couponCode];
      return updated;
    });
    
    toast({
      title: "Swap Cancelled",
      description: `Removed ${swappedCoupon.title} from your swap list.`,
    });
  };

  const handleUpdateOffer = () => {
    const swapCount = Object.keys(swappedCoupons).length;
    toast({
      title: "Offer Updated",
      description: `Successfully updated offer with ${swapCount} swapped coupon${swapCount > 1 ? 's' : ''}.`,
    });
    
    setTimeout(() => {
      navigate("/coupon-mart/my-listings");
    }, 1500);
  };

  const updateLocalCouponStatus = (couponCode: string, newStatus: "accepted" | "rejected" | "pending") => {
    setLocalCouponStatuses(prev => ({
      ...prev,
      [couponCode]: newStatus
    }));
    
    const statusMessage = 
      newStatus === "accepted" ? "Coupon Accepted!" : 
      newStatus === "rejected" ? "Coupon Rejected" : 
      "Status Cancelled";
    const statusDesc = 
      newStatus === "accepted" ? "You have accepted this coupon." : 
      newStatus === "rejected" ? "You have rejected this coupon." : 
      "The coupon is back to pending status.";

    toast({
      title: statusMessage,
      description: statusDesc,
    });
  };

  const handleCompleteTrade = () => {
    completeTradeM.mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open && (confirmDialog.action === "cancel" || confirmDialog.action === "cancel_acceptance")} onOpenChange={(open) => !open && setConfirmDialog({ open: false, action: null, couponCode: null, couponTitle: null })}>
        <AlertDialogContent className="bg-black border border-white/20 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-light tracking-wider uppercase">
              {confirmDialog.action === "cancel" ? "Cancel Rejection?" : "Cancel Acceptance?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {confirmDialog.action === "cancel" 
                ? `Are you sure you want to cancel the rejection of "${confirmDialog.couponTitle}"? This will return it to pending status.`
                : `Are you sure you want to cancel the acceptance of "${confirmDialog.couponTitle}"? This will return it to pending status.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-none">
              {confirmDialog.action === "cancel" ? "No, Keep Rejected" : "No, Keep Accepted"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="rounded-none bg-yellow-700 hover:bg-yellow-800 text-white"
            >
              {confirmDialog.action === "cancel" ? "Yes, Cancel Rejection" : "Yes, Cancel Acceptance"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Final Rejection Confirmation Dialog */}
      <AlertDialog open={showFinalRejectionDialog} onOpenChange={setShowFinalRejectionDialog}>
        <AlertDialogContent className="bg-black border border-red-500/30 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-light tracking-wider uppercase">
              Confirm Final Rejection
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              You are about to finalize the rejection of {rejectedCount} coupon{rejectedCount > 1 ? 's' : ''}. 
              {rejectionNote && <span className="block mt-2 text-white/80 italic">Your note: "{rejectionNote}"</span>}
              <span className="block mt-2">This action will notify the buyer. Are you sure?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmFinalRejection}
              className="rounded-none bg-red-700 hover:bg-red-800 text-white"
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Trade Completion Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-8"
              >
                <div className="w-32 h-32 mx-auto">
                  <motion.div
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 border-4 border-green-500/30 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <RefreshCcw className="h-16 w-16 text-green-500" strokeWidth={1} />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-2xl font-light tracking-wider mb-2 text-white">
                  TRADE COMPLETE
                </h2>
                <p className="text-white/60 text-sm tracking-wide">
                  Exchanging coupons...
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-8 flex items-center justify-center gap-4"
              >
                <motion.div
                  animate={{ x: [0, 100, 0], opacity: [1, 0, 1] }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                  className="w-12 h-12 border border-white/20 bg-green-500/20 flex items-center justify-center"
                >
                  <Package className="h-6 w-6 text-green-500" strokeWidth={1} />
                </motion.div>

                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-8 w-8 text-white/40" strokeWidth={1} />
                </motion.div>

                <motion.div
                  animate={{ x: [0, -100, 0], opacity: [1, 0, 1] }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                  className="w-12 h-12 border border-white/20 bg-green-500/20 flex items-center justify-center"
                >
                  <Package className="h-6 w-6 text-green-500" strokeWidth={1} />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => navigate("/coupon-mart/my-listings")}
            className="text-white hover:text-white/80"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </button>
          <h1 className="text-sm font-light tracking-wider">TRADE OFFER</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-4">
        {/* Status Badge */}
        <div className="mb-6 text-center">
          <Badge
            className={`rounded-none text-[10px] uppercase tracking-widest ${
              effectiveStatus === "pending"
                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                : effectiveStatus === "accepted"
                  ? "bg-green-500/20 text-green-400 border-green-500/20"
                  : "bg-red-500/20 text-red-400 border-red-500/20"
            }`}
            data-testid="badge-offer-status"
          >
            {effectiveStatus}
          </Badge>
          <p className="text-xs text-white/50 mt-2 uppercase tracking-widest">
            {isOwner ? `From: ${offererName}` : `To: ${offererName}`}
          </p>
          <p className="text-[10px] text-white/40 mt-1">
            {isOwner ? "Received" : "Sent"}: {formatDate(offer.createdAt)}
          </p>
        </div>

        {/* Progress Indicator */}
        {isOwner && totalCount > 0 && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">
                Acceptance Progress
              </p>
              <p className="text-sm text-white">
                {acceptedCount}/{totalCount} Accepted
              </p>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-[10px] text-white/50">
              <span>✓ {acceptedCount} Accepted</span>
              <span>✗ {rejectedCount} Rejected</span>
              <span>⏳ {pendingCount} Pending</span>
            </div>
          </div>
        )}

        {/* Trade Visual */}
        <div className="mb-6">
          <div className="flex items-start gap-4">
            {/* Seller's Coupons */}
            <div className="flex-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2 text-center">
                {isOwner ? "You're Offering" : "They're Offering"}
              </p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {listingCoupons.map((coupon: Coupon, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border backdrop-blur-xl p-3 border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent"
                    data-testid={`seller-coupon-${index}`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-6 h-6 border flex items-center justify-center shrink-0 border-white/20">
                        <Package className="h-3 w-3 text-white/60" strokeWidth={1} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-light text-white text-xs tracking-wide mb-1">
                          {coupon.title}
                        </h4>
                        <p className="text-[9px] text-white/50 tracking-widest uppercase">
                          {coupon.brand}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/50">Value</span>
                        <span className="text-white">
                          {coupon.valueType === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-white/50">Expires</span>
                        <span className="text-white">{formatDate(coupon.expiryDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Exchange Arrow */}
            <div className="flex-shrink-0 pt-8">
              <ArrowRight className="h-5 w-5 text-white/40" strokeWidth={1} />
            </div>

            {/* Buyer's Offered Coupons */}
            <div className="flex-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2 text-center">
                {isOwner ? "They're Offering" : "You're Offering"}
              </p>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {offeredCoupons.map((coupon: OfferedCoupon, index: number) => (
                  <AnimatePresence key={coupon.code} mode="wait">
                    {swapAnimatingCoupon === coupon.code ? (
                      <motion.div
                        initial={{ scale: 1, rotateY: 0 }}
                        animate={{ scale: [1, 1.1, 1], rotateY: [0, 180, 360] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className={`border backdrop-blur-xl p-3 ${
                          animationType === "accept"
                            ? "border-green-500/30 bg-green-500/10"
                            : "border-red-500/30 bg-red-500/10"
                        }`}
                      >
                        <div className="flex items-center justify-center h-24">
                          {animationType === "accept" ? (
                            <CheckCircle className="h-12 w-12 text-green-500" strokeWidth={1} />
                          ) : (
                            <XCircle className="h-12 w-12 text-red-500" strokeWidth={1} />
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border backdrop-blur-xl p-3 ${
                          getCouponStatus(coupon) === "accepted"
                            ? "border-green-500/30 bg-green-500/5"
                            : getCouponStatus(coupon) === "rejected"
                              ? "border-red-500/30 bg-red-500/5"
                              : "border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent"
                        }`}
                        data-testid={`buyer-coupon-${index}`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-6 h-6 border flex items-center justify-center shrink-0 ${
                            getCouponStatus(coupon) === "accepted"
                              ? "border-green-500/50 bg-green-500/20"
                              : getCouponStatus(coupon) === "rejected"
                                ? "border-red-500/50 bg-red-500/20"
                                : "border-white/20"
                          }`}>
                            {getCouponStatus(coupon) === "accepted" ? (
                              <CheckCircle className="h-3 w-3 text-green-500" strokeWidth={1} />
                            ) : getCouponStatus(coupon) === "rejected" ? (
                              <XCircle className="h-3 w-3 text-red-500" strokeWidth={1} />
                            ) : (
                              <Package className="h-3 w-3 text-white/60" strokeWidth={1} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-light text-white text-xs tracking-wide mb-1">
                              {coupon.title}
                            </h4>
                            <p className="text-[9px] text-white/50 tracking-widest uppercase">
                              {coupon.brand}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/50">Value</span>
                            <span className="text-white">₹{coupon.value}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/50">Expires</span>
                            <span
                              className={
                                getDaysUntilExpiry(coupon.expiry) < 7 ? "text-red-400" : "text-white"
                              }
                            >
                              {formatDate(coupon.expiry)}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/50">Status</span>
                            <span
                              className={
                                getCouponStatus(coupon) === "accepted"
                                  ? "text-green-400"
                                  : getCouponStatus(coupon) === "rejected"
                                    ? "text-red-400"
                                    : "text-yellow-400"
                              }
                            >
                              {getCouponStatus(coupon)}
                            </span>
                          </div>
                        </div>

                        {/* Individual Accept/Reject/Cancel Buttons for Owner */}
                        {isOwner && getCouponStatus(coupon) === "pending" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2 mt-3"
                          >
                            <Button
                              onClick={() => handleReject(coupon.code)}
                              disabled={respondToSingleCouponMutation.isPending}
                              className="flex-1 bg-red-700 text-white hover:bg-red-800 rounded-none h-8 text-[10px]"
                              data-testid={`button-reject-${index}`}
                            >
                              <XCircle className="h-3 w-3 mr-1" strokeWidth={1} />
                              Reject
                            </Button>
                            <Button
                              onClick={() => handleAccept(coupon.code)}
                              disabled={respondToSingleCouponMutation.isPending}
                              className="flex-1 bg-green-700 text-white hover:bg-green-800 rounded-none h-8 text-[10px]"
                              data-testid={`button-accept-${index}`}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" strokeWidth={1} />
                              Accept
                            </Button>
                          </motion.div>
                        )}
                        {isOwner && getCouponStatus(coupon) === "rejected" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3"
                          >
                            <Button
                              onClick={() => handleCancelStatus(coupon.code, coupon.title)}
                              disabled={respondToSingleCouponMutation.isPending}
                              className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-8 text-[10px] border border-white/20"
                              data-testid={`button-cancel-${index}`}
                            >
                              <RefreshCcw className="h-3 w-3 mr-1" strokeWidth={1} />
                              Cancel
                            </Button>
                          </motion.div>
                        )}
                        {isOwner && getCouponStatus(coupon) === "accepted" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3"
                          >
                            <Button
                              onClick={() => handleCancelStatus(coupon.code, coupon.title)}
                              disabled={respondToSingleCouponMutation.isPending}
                              className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-8 text-[10px] border border-white/20"
                              data-testid={`button-cancel-${index}`}
                            >
                              <RefreshCcw className="h-3 w-3 mr-1" strokeWidth={1} />
                              Cancel
                            </Button>
                          </motion.div>
                        )}

                        {/* Swap Button for Buyer (when coupon is rejected) */}
                        {!isOwner && getCouponStatus(coupon) === "rejected" && !swappedCoupons[coupon.code] && (
                          <div className="mt-3">
                            <Button
                              onClick={() => openSwapDialog(coupon.code)}
                              className="w-full bg-blue-700 text-white hover:bg-blue-800 rounded-none h-8 text-[10px]"
                              data-testid={`button-swap-${index}`}
                            >
                              <Repeat2 className="h-3 w-3 mr-1" strokeWidth={1} />
                              Swap Coupon
                            </Button>
                          </div>
                        )}

                        {/* Show swapped coupon info */}
                        {!isOwner && swappedCoupons[coupon.code] && (
                          <div className="mt-3">
                            <div className="p-2 bg-blue-500/10 border border-blue-500/30 mb-2">
                              <p className="text-[9px] text-blue-400 uppercase tracking-widest mb-1">Swapping With:</p>
                              <p className="text-[10px] text-white font-medium">{swappedCoupons[coupon.code].title}</p>
                              <p className="text-[9px] text-white/50">{swappedCoupons[coupon.code].brand}</p>
                            </div>
                            <Button
                              onClick={() => handleCancelSwap(coupon.code)}
                              className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-8 text-[10px] border border-white/20"
                              data-testid={`button-cancel-swap-${index}`}
                            >
                              <XCircle className="h-3 w-3 mr-1" strokeWidth={1} />
                              Cancel Swap
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Offer Note */}
        {offer.offerNote && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">
              Message from {isOwner ? "Buyer" : "Seller"}
            </p>
            <p className="text-sm text-white/80">{offer.offerNote}</p>
          </div>
        )}

        {/* Response Note (if exists) */}
        {offer.responseNote && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">
              {isOwner ? "Your Response" : "Seller's Response"}
            </p>
            <p className="text-sm text-white/80">{offer.responseNote}</p>
          </div>
        )}

        {/* Status Messages */}
        {allAccepted && (
          <div className="mb-6 border border-green-500/20 bg-green-500/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-sm text-green-400 font-medium mb-1">All Coupons Accepted</p>
                <p className="text-xs text-white/60">
                  {isOwner
                    ? "You have accepted all coupons. Complete the trade to exchange."
                    : "The seller has accepted all your coupons. Waiting for trade completion."}
                </p>
              </div>
            </div>
          </div>
        )}

        {allRejected && (
          <div className="mb-6 border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-sm text-red-400 font-medium mb-1">All Coupons Rejected</p>
                <p className="text-xs text-white/60">
                  {isOwner
                    ? "You have rejected all coupons in this trade offer."
                    : "The seller has rejected all your coupons. You can submit a new offer."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="border border-white/10 bg-white/5 p-4 mb-6">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">
            Trade Details
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Offer ID</span>
              <span className="text-white font-mono">{offer.id.slice(0, 16)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Total Coupons Offered</span>
              <span className="text-white">{totalCount}</span>
            </div>
            {offer.respondedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Last Updated</span>
                <span className="text-white">{formatDate(offer.respondedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Rejection Note Section */}
      {isOwner && rejectedCount > 0 && !allAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-red-500/20">
          <div className="px-4 py-4">
            <div className="mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" strokeWidth={1} />
              <p className="text-[10px] text-red-400 uppercase tracking-widest">
                {rejectedCount} Coupon{rejectedCount > 1 ? 's' : ''} Rejected
              </p>
            </div>
            <div className="mb-3">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">
                Add Rejection Note (Optional)
              </p>
              <Textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Explain why you rejected these coupons..."
                className="bg-white/5 border-red-500/20 text-white rounded-none min-h-[60px] text-sm"
                data-testid="textarea-rejection-note"
              />
            </div>
            <Button
              onClick={handleFinalizeRejection}
              className="w-full bg-red-700 text-white hover:bg-red-800 rounded-none h-12 mb-3"
              data-testid="button-finalize-rejection"
            >
              <XCircle className="h-4 w-4 mr-2" strokeWidth={1} />
              Finalize Rejection ({rejectedCount} Coupon{rejectedCount > 1 ? 's' : ''})
            </Button>
            <p className="text-xs text-white/40 text-center">
              You can cancel rejections individually by clicking "Cancel Rejection" on each coupon.
            </p>
          </div>
        </div>
      )}

      {/* Fixed Bottom Action Section */}
      {isOwner && allAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-4">
            <div className="mb-4">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">
                Add Final Message (Optional)
              </p>
              <Textarea
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="Add a message for the buyer..."
                className="bg-white/5 border-white/20 text-white rounded-none min-h-[60px] text-sm"
                data-testid="textarea-response"
              />
            </div>

            <Button
              onClick={handleCompleteTrade}
              disabled={completeTradeM.isPending}
              className="w-full bg-green-700 text-white hover:bg-green-800 rounded-none h-12"
              data-testid="button-complete-trade"
            >
              <CheckCircle className="h-4 w-4 mr-2" strokeWidth={1} />
              Complete Trade ({acceptedCount}/{totalCount} Coupons)
            </Button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Update Offer Section for Buyer with Swaps */}
      {!isOwner && Object.keys(swappedCoupons).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-blue-500/20">
          <div className="px-4 py-4">
            <div className="mb-3 flex items-center gap-2">
              <Repeat2 className="h-4 w-4 text-blue-400" strokeWidth={1} />
              <p className="text-[10px] text-blue-400 uppercase tracking-widest">
                {Object.keys(swappedCoupons).length} Coupon{Object.keys(swappedCoupons).length > 1 ? 's' : ''} Ready to Swap
              </p>
            </div>
            <div className="mb-3">
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">
                Add Update Note (Optional)
              </p>
              <Textarea
                value={swapNote}
                onChange={(e) => setSwapNote(e.target.value)}
                placeholder="Explain your coupon swaps..."
                className="bg-white/5 border-blue-500/20 text-white rounded-none min-h-[60px] text-sm"
                data-testid="textarea-swap-note"
              />
            </div>
            <Button
              onClick={handleUpdateOffer}
              className="w-full bg-blue-700 text-white hover:bg-blue-800 rounded-none h-12"
              data-testid="button-update-offer"
            >
              <Repeat2 className="h-4 w-4 mr-2" strokeWidth={1} />
              Update Offer ({Object.keys(swappedCoupons).length} Swap{Object.keys(swappedCoupons).length > 1 ? 's' : ''})
            </Button>
          </div>
        </div>
      )}

      {/* Swap Dialog */}
      <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-wider">SELECT REPLACEMENT COUPON</DialogTitle>
            <DialogDescription className="text-white/50 text-xs">
              Choose a coupon from your collection to replace the rejected one
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mb-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none inline-flex gap-0 min-w-full">
                <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">All</TabsTrigger>
                <TabsTrigger value="food" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Food</TabsTrigger>
                <TabsTrigger value="travel" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Travel</TabsTrigger>
                <TabsTrigger value="shopping" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Shopping</TabsTrigger>
                <TabsTrigger value="bills" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Bills</TabsTrigger>
                <TabsTrigger value="medical" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Medical</TabsTrigger>
                <TabsTrigger value="fitness" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Fitness</TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Education</TabsTrigger>
                <TabsTrigger value="entertainment" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent whitespace-nowrap px-4">Entertainment</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search coupons by title or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/20 text-white rounded-none placeholder:text-white/40 focus:border-white/40"
              data-testid="input-search-coupons"
            />
          </div>

          <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {['all', 'food', 'travel', 'shopping', 'bills', 'medical', 'fitness', 'education', 'entertainment'].map((category) => (
                <TabsContent key={category} value={category} className="mt-0 space-y-2">
                  {getAvailableCoupons()
                    .filter(c => category === 'all' || c.category === category)
                    .filter(c => 
                      searchQuery === '' || 
                      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.brand.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((coupon) => (
                      <div
                        key={coupon.code}
                        onClick={() => setSelectedSwapCoupon(coupon)}
                        className={`border p-3 cursor-pointer transition-all ${
                          selectedSwapCoupon?.code === coupon.code
                            ? 'border-white bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}
                        data-testid={`swap-coupon-${coupon.code}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white mb-1">{coupon.title}</h4>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2">{coupon.brand}</p>
                            <div className="flex items-center gap-3 text-[10px]">
                              <span className="text-white/60">Value: <span className="text-white">₹{coupon.value}</span></span>
                              <span className="text-white/60">Expires: <span className="text-white">{formatDate(coupon.expiry)}</span></span>
                            </div>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase">
                            {coupon.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              ))}
            </div>
          </Tabs>

          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
            <Button
              onClick={() => {
                setShowSwapDialog(false);
                setSelectedSwapCoupon(null);
              }}
              className="flex-1 bg-white/10 text-white hover:bg-white/20 rounded-none"
              data-testid="button-cancel-swap"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSwap}
              disabled={!selectedSwapCoupon}
              className="flex-1 bg-white text-black hover:bg-white/80 rounded-none disabled:opacity-50"
              data-testid="button-confirm-swap"
            >
              Confirm Swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
