import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { getBrandImage } from "@/lib/brand-images";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Eye,
  Tag,
  Trash2,
  ShoppingBag,
  Copy,
  Check,
  Sparkles,
  Inbox,
  Send,
  Loader2,
  Ticket
} from "lucide-react";
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
  listingNote?: string;
  listingType: string;
  sellingPrice?: string;
  tradePreference?: string;
  status: string;
  views: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  transactionType: string;
  amount: string;
  revealedCode: string;
  status: string;
  createdAt: string;
}

interface PurchasedCoupon extends Transaction {
  listing?: Listing;
}

interface TradeOffer {
  id: string;
  listingId: string;
  offererId: string;
  listingOwnerId: string;
  offeredCouponCode: string;
  offeredCouponTitle: string;
  offeredCouponBrand: string;
  offeredCouponValue: string;
  offeredCouponExpiry: string;
  offerNote?: string;
  status: string;
  responseNote?: string;
  createdAt: string;
  respondedAt?: string;
  listing?: Listing;
  offererName?: string;
  listingCode?: string;
  offerType?: 'trade' | 'cash';
  cashAmount?: string;
}

export default function CouponMartListings() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { data: myListings = [], isLoading: listingsLoading } = useQuery<Listing[]>({
    queryKey: ["/api/coupon-mart/my-listings"],
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery<{ purchased: Transaction[]; sold: Transaction[] }>({
    queryKey: ["/api/coupon-mart/transactions"],
  });

  const { data: tradeOffersData, isLoading: offersLoading } = useQuery<{ sent: TradeOffer[]; received: TradeOffer[] }>({
    queryKey: ["/api/coupon-mart/trade-offers"],
  });

  // Dummy data for My Listings
  const dummyMyListings: Listing[] = [
    {
      id: "my-listing-1",
      userId: user?.id || "",
      coupons: [{
        code: "AMAZON500OFF",
        title: "₹500 Off on Electronics",
        brand: "Amazon",
        category: "shopping",
        type: "fixed_discount",
        value: 500,
        valueType: "fixed",
        description: "Get flat ₹500 off on electronics above ₹2000",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        minAmount: 2000,
        valueScore: 8.5,
        images: []
      }],
      totalCouponCount: 1,
      primaryCategory: "shopping",
      listingType: "sell",
      sellingPrice: "425",
      status: "active",
      views: 156,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "my-listing-2",
      userId: user?.id || "",
      coupons: [{
        code: "SWIGGY40",
        title: "40% Off on Food Delivery",
        brand: "Swiggy",
        category: "food",
        type: "percentage_discount",
        value: 40,
        valueType: "percentage",
        description: "Save 40% on your next Swiggy order",
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        minAmount: 300,
        maxDiscount: 150,
        valueScore: 7.8,
        images: []
      }],
      totalCouponCount: 1,
      primaryCategory: "food",
      listingType: "trade",
      tradePreference: "Travel or Shopping coupons",
      status: "active",
      views: 89,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "my-listing-3",
      userId: user?.id || "",
      coupons: [
        {
          code: "FLIPKART1000",
          title: "₹1000 Off on Home Appliances",
          brand: "Flipkart",
          category: "shopping",
          type: "fixed_discount",
          value: 1000,
          valueType: "fixed",
          expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          minAmount: 5000,
          valueScore: 9.2,
          images: []
        },
        {
          code: "FLIPKART500",
          title: "₹500 Off on Fashion",
          brand: "Flipkart",
          category: "shopping",
          type: "fixed_discount",
          value: 500,
          valueType: "fixed",
          expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          minAmount: 2000,
          valueScore: 8.1,
          images: []
        }
      ],
      totalCouponCount: 2,
      totalFaceValue: "1500",
      primaryCategory: "shopping",
      listingType: "sell",
      sellingPrice: "1200",
      listingNote: "Combo deal - 2 Flipkart coupons!",
      status: "active",
      views: 234,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Dummy data for Purchased Coupons
  const dummyPurchasedCoupons: PurchasedCoupon[] = [
    {
      id: "purchase-1",
      listingId: "listing-purchased-1",
      buyerId: user?.id || "",
      sellerId: "seller-123",
      transactionType: "purchase",
      amount: "350",
      revealedCode: "UBER50RIDE",
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      listing: {
        id: "listing-purchased-1",
        userId: "seller-123",
        coupons: [{
          code: "UBER50RIDE",
          title: "₹50 Off on Uber Rides",
          brand: "Uber",
          category: "travel",
          type: "fixed_discount",
          value: 50,
          valueType: "fixed",
          expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          valueScore: 7.5,
          images: []
        }],
        totalCouponCount: 1,
        primaryCategory: "travel",
        listingType: "sell",
        sellingPrice: "35",
        status: "sold",
        views: 78,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: "purchase-2",
      listingId: "listing-purchased-2",
      buyerId: user?.id || "",
      sellerId: "seller-456",
      transactionType: "purchase",
      amount: "280",
      revealedCode: "MYNTRA30OFF",
      status: "completed",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      listing: {
        id: "listing-purchased-2",
        userId: "seller-456",
        coupons: [{
          code: "MYNTRA30OFF",
          title: "30% Off on Fashion",
          brand: "Myntra",
          category: "shopping",
          type: "percentage_discount",
          value: 30,
          valueType: "percentage",
          expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
          maxDiscount: 500,
          valueScore: 8.2,
          images: []
        }],
        totalCouponCount: 1,
        primaryCategory: "shopping",
        listingType: "sell",
        sellingPrice: "280",
        status: "sold",
        views: 145,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: "purchase-3",
      listingId: "listing-purchased-3",
      buyerId: user?.id || "",
      sellerId: "seller-789",
      transactionType: "purchase",
      amount: "180",
      revealedCode: "ZOMATO200",
      status: "completed",
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      listing: {
        id: "listing-purchased-3",
        userId: "seller-789",
        coupons: [{
          code: "ZOMATO200",
          title: "₹200 Off on Food Orders",
          brand: "Zomato",
          category: "food",
          type: "fixed_discount",
          value: 200,
          valueType: "fixed",
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          minAmount: 500,
          valueScore: 8.7,
          images: []
        }],
        totalCouponCount: 1,
        primaryCategory: "food",
        listingType: "sell",
        sellingPrice: "180",
        status: "sold",
        views: 201,
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];

  // Dummy data for Received Offers
  const dummyReceivedOffers: TradeOffer[] = [
    {
      id: "offer-received-1",
      listingId: "my-listing-1",
      offererId: "user-abc123",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "BOOKMYSHOW200",
      offeredCouponTitle: "₹200 Off on Movie Tickets",
      offeredCouponBrand: "BookMyShow",
      offeredCouponValue: "200",
      offeredCouponExpiry: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Hi! I'd love to trade my BookMyShow coupon for your Amazon one. Perfect for movie nights!",
      status: "pending",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      offererName: "Priya Sharma",
      listingCode: "COUP-001",
      offerType: "trade",
      listing: dummyMyListings[0]
    },
    {
      id: "offer-received-2",
      listingId: "my-listing-2",
      offererId: "user-def456",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "",
      offeredCouponTitle: "",
      offeredCouponBrand: "",
      offeredCouponValue: "",
      offeredCouponExpiry: "",
      offerNote: "Can I buy this for ₹250 cash? Need it urgently for tonight's dinner order!",
      status: "pending",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      offererName: "Rahul Verma",
      listingCode: "COUP-002",
      offerType: "cash",
      cashAmount: "250",
      listing: dummyMyListings[1]
    },
    {
      id: "offer-received-3",
      listingId: "my-listing-3",
      offererId: "user-ghi789",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "MAKEMYTRIP500",
      offeredCouponTitle: "₹500 Off on Flights",
      offeredCouponBrand: "MakeMyTrip",
      offeredCouponValue: "500",
      offeredCouponExpiry: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Great combo! I have a travel coupon if you're interested.",
      status: "accepted",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      responseNote: "Perfect! Let's trade.",
      offererName: "Anjali Mehta",
      listingCode: "COUP-003",
      offerType: "trade",
      listing: dummyMyListings[2]
    },
    {
      id: "offer-received-4",
      listingId: "my-listing-1",
      offererId: "user-jkl012",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "AJIO400",
      offeredCouponTitle: "₹400 Off on Fashion",
      offeredCouponBrand: "Ajio",
      offeredCouponValue: "400",
      offeredCouponExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "I have an Ajio coupon worth ₹400. Interested in trading?",
      status: "pending",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      offererName: "Vikram Singh",
      listingCode: "COUP-004",
      offerType: "trade",
      listing: dummyMyListings[0]
    },
    {
      id: "offer-received-5",
      listingId: "my-listing-2",
      offererId: "user-mno345",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "DUNZO100",
      offeredCouponTitle: "₹100 Off on Quick Delivery",
      offeredCouponBrand: "Dunzo",
      offeredCouponValue: "100",
      offeredCouponExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Would love to exchange! My Dunzo coupon for your Swiggy one.",
      status: "rejected",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
      responseNote: "Sorry, value doesn't match. Looking for higher value coupons.",
      offererName: "Sneha Patel",
      listingCode: "COUP-005",
      offerType: "trade",
      listing: dummyMyListings[1]
    },
    {
      id: "offer-received-6",
      listingId: "my-listing-3",
      offererId: "user-pqr678",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "",
      offeredCouponTitle: "",
      offeredCouponBrand: "",
      offeredCouponValue: "",
      offeredCouponExpiry: "",
      offerNote: "I can pay ₹1100 cash. Please accept!",
      status: "pending",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      offererName: "Karan Gupta",
      listingCode: "COUP-006",
      offerType: "cash",
      cashAmount: "1100",
      listing: dummyMyListings[2]
    },
    {
      id: "offer-received-7",
      listingId: "my-listing-1",
      offererId: "user-stu901",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "OLA75",
      offeredCouponTitle: "₹75 Off on Rides",
      offeredCouponBrand: "Ola",
      offeredCouponValue: "75",
      offeredCouponExpiry: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Quick trade? I need Amazon coupon by tomorrow!",
      status: "rejected",
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      responseNote: "Not interested in travel coupons at the moment.",
      offererName: "Deepika Reddy",
      listingCode: "COUP-007",
      offerType: "trade",
      listing: dummyMyListings[0]
    },
    {
      id: "offer-received-8",
      listingId: "my-listing-2",
      offererId: "user-vwx234",
      listingOwnerId: user?.id || "",
      offeredCouponCode: "",
      offeredCouponTitle: "",
      offeredCouponBrand: "",
      offeredCouponValue: "",
      offeredCouponExpiry: "",
      offerNote: "₹350 cash offer. Let me know ASAP!",
      status: "accepted",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      responseNote: "Deal! Thanks for the offer.",
      offererName: "Arjun Nair",
      listingCode: "COUP-008",
      offerType: "cash",
      cashAmount: "350",
      listing: dummyMyListings[1]
    }
  ];

  // Dummy data for Sent Offers
  const dummySentOffers: TradeOffer[] = [
    {
      id: "offer-sent-1",
      listingId: "listing-xyz-1",
      offererId: user?.id || "",
      listingOwnerId: "owner-123",
      offeredCouponCode: "NYKAA300",
      offeredCouponTitle: "₹300 Off on Beauty Products",
      offeredCouponBrand: "Nykaa",
      offeredCouponValue: "300",
      offeredCouponExpiry: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Would love to trade my Nykaa coupon for your Flipkart one!",
      status: "pending",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      offererName: user?.name || "You",
      listingCode: "COUP-101",
      offerType: "trade"
    },
    {
      id: "offer-sent-2",
      listingId: "listing-xyz-2",
      offererId: user?.id || "",
      listingOwnerId: "owner-456",
      offeredCouponCode: "SWIGGY200",
      offeredCouponTitle: "₹200 Off on Food Orders",
      offeredCouponBrand: "Swiggy",
      offeredCouponValue: "200",
      offeredCouponExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Updated offer: Swapped rejected coupons (McDonald's & KFC) with new ones (Domino's & Burger King).",
      status: "pending",
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      responseNote: "Accepted 2 of your 4 coupons (Swiggy & Zomato). Rejected the other 2 (McDonald's & KFC). Let's proceed!",
      offererName: user?.name || "You",
      listingCode: "COUP-102",
      offerType: "trade"
    },
    {
      id: "offer-sent-3",
      listingId: "listing-xyz-3",
      offererId: user?.id || "",
      listingOwnerId: "owner-789",
      offeredCouponCode: "",
      offeredCouponTitle: "",
      offeredCouponBrand: "",
      offeredCouponValue: "",
      offeredCouponExpiry: "",
      offerNote: "₹550 cash for all 4 coupons in the bundle. Please consider!",
      status: "rejected",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
      responseNote: "Sorry, I rejected all 4 cards from your offer. Looking for better value. Thanks anyway!",
      offererName: user?.name || "You",
      listingCode: "COUP-103",
      offerType: "cash",
      cashAmount: "550"
    },
    {
      id: "offer-sent-4",
      listingId: "listing-xyz-4",
      offererId: user?.id || "",
      listingOwnerId: "owner-234",
      offeredCouponCode: "BIGBASKET250",
      offeredCouponTitle: "₹250 Off on Groceries",
      offeredCouponBrand: "BigBasket",
      offeredCouponValue: "250",
      offeredCouponExpiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      offerNote: "Offering 3 coupons total: BigBasket, Grofers, and FreshToHome. Interested?",
      status: "rejected",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      responseNote: "Rejected 1 card (FreshToHome). Accepted the other 2! Deal on!",
      offererName: user?.name || "You",
      listingCode: "COUP-104",
      offerType: "trade"
    },
    {
      id: "offer-sent-5",
      listingId: "listing-xyz-5",
      offererId: user?.id || "",
      listingOwnerId: "owner-567",
      offeredCouponCode: "",
      offeredCouponTitle: "",
      offeredCouponBrand: "",
      offeredCouponValue: "",
      offeredCouponExpiry: "",
      offerNote: "Hi! Can I get this for ₹320? Let me know ASAP!",
      status: "rejected",
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
      responseNote: "Sorry, price is firm at ₹400. Cannot accept lower offers.",
      offererName: user?.name || "You",
      listingCode: "COUP-105",
      offerType: "cash",
      cashAmount: "320"
    }
  ];

  // Use dummy data as fallback
  const displayMyListings = myListings.length > 0 ? myListings : dummyMyListings;
  
  const purchasedTransactions = transactionsData?.purchased || [];
  const sentOffers = dummySentOffers; // Always use dummy data
  const receivedOffers = (tradeOffersData?.received && tradeOffersData.received.length > 0) ? tradeOffersData.received : dummyReceivedOffers;

  const { data: purchasedCoupons = [], isLoading: purchasedLoading } = useQuery<PurchasedCoupon[]>({
    queryKey: ["/api/coupon-mart/purchased-details"],
    queryFn: async () => {
      const couponsWithDetails = await Promise.all(
        purchasedTransactions.map(async (transaction) => {
          try {
            const response = await fetch(`/api/coupon-mart/listings/${transaction.listingId}`);
            const listing = await response.json();
            return { ...transaction, listing };
          } catch (error) {
            return transaction;
          }
        })
      );
      return couponsWithDetails;
    },
    enabled: purchasedTransactions.length > 0,
  });

  const displayPurchasedCoupons = purchasedCoupons.length > 0 ? purchasedCoupons : dummyPurchasedCoupons;

  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      return apiRequest("DELETE", `/api/coupon-mart/listings/${listingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupon-mart/my-listings"] });
      toast({
        title: "Deleted",
        description: "Listing removed successfully",
      });
      setListingToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    },
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

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (listingsLoading || transactionsLoading || offersLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-white/60" />
          <p className="text-white/60 text-sm">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
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
          <h1 className="text-sm font-bold tracking-wider">MY COUPEX</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile/coupons")}
              className="text-white hover:text-white/80"
              data-testid="button-my-coupons"
            >
              <Ticket className="h-5 w-5" strokeWidth={1} />
            </button>
            <button
              onClick={() => navigate("/coupon-mart/new-listing")}
              className="text-white hover:text-white/80"
              data-testid="button-new-listing"
            >
              <Plus className="h-5 w-5" strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4">
        <Tabs defaultValue="my-listings" className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0 mb-6">
            <TabsTrigger 
              value="my-listings" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-my-listings"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger 
              value="purchased" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-purchased"
            >
              Purchased
            </TabsTrigger>
            <TabsTrigger 
              value="offers" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-offers"
            >
              Offers
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="my-listings" className="mt-0">
            {displayMyListings.length === 0 ? (
              <div className="border border-white/10 p-12 text-center mt-8" data-testid="empty-listings">
                <Tag className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
                <p className="text-white/50 text-sm mb-4">You haven't listed any coupons yet</p>
                <Button
                  onClick={() => navigate("/coupon-mart/new-listing")}
                  className="bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-create-first-listing"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">
                  {displayMyListings.length} {displayMyListings.length === 1 ? "listing" : "listings"}
                </p>
                <div className="space-y-3">
                  {displayMyListings.map((listing) => {
                    if (!listing.coupons || listing.coupons.length === 0) return null;
                    const coupon = listing.coupons[0];
                    const daysLeft = getDaysUntilExpiry(coupon.expiryDate);
                    const expiring = isExpiringSoon(coupon.expiryDate);
                    const valueScore = coupon.valueScore ? parseFloat(coupon.valueScore.toString()) : 5.0;
                    const valueBadge = getValueScoreBadge(valueScore);

                    return (
                      <div
                        key={listing.id}
                        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => navigate(`/coupon-mart/listing/${listing.id}`)}
                        data-testid={`card-listing-${listing.id}`}
                      >
                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-16 h-16 border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                                <img
                                  src={getBrandImage(coupon.brand, coupon.category) || ""}
                                  alt={coupon.brand}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-1 flex-1">
                                <h4 className="font-light text-white text-sm tracking-wide">{coupon.title}</h4>
                                <p className="text-[10px] text-white/50 tracking-widest uppercase">{coupon.brand}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`rounded-none text-[9px] uppercase ${
                                    listing.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/20" :
                                    listing.status === "sold" ? "bg-white/20 text-white border-white/20" :
                                    "bg-white/10 text-white/60 border-white/10"
                                  }`}>
                                    {listing.status}
                                  </Badge>
                                  <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-[9px] uppercase">
                                    {listing.listingType}
                                  </Badge>
                                  {listing.totalCouponCount > 1 && (
                                    <Badge className="bg-white text-black border-white rounded-none text-[9px] font-bold">
                                      COMBO × {listing.totalCouponCount}
                                    </Badge>
                                  )}
                                  {expiring && listing.status === "active" && (
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/20 rounded-none text-[9px] uppercase">
                                      Expiring Soon
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-lg font-light text-white tracking-tight">
                                {coupon.valueType === "percentage"
                                  ? `${coupon.value}%`
                                  : `₹${coupon.value}`}
                              </p>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Value</p>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span className={expiring ? "text-red-400" : ""}>Exp: {formatDate(coupon.expiryDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Eye className="h-3 w-3" />
                                <span>{listing.views} views</span>
                              </div>
                            </div>
                            
                            {listing.listingType === "sell" && listing.sellingPrice && (
                              <div className="flex justify-between items-center bg-white/5 p-2">
                                <span className="text-[10px] text-white/50 uppercase tracking-widest">Selling Price</span>
                                <span className="text-sm font-light text-white">₹{listing.sellingPrice}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <Badge className={`rounded-none text-[9px] ${valueBadge.bgClass} ${valueBadge.textClass} ${valueBadge.borderClass}`}>
                                <Sparkles className="h-3 w-3 mr-1" />
                                {valueScore.toFixed(1)}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          {listing.status === "active" && (
                            <div className="pt-2 border-t border-white/10">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setListingToDelete(listing.id);
                                }}
                                size="sm"
                                className="w-full bg-red-700 text-white hover:bg-red-800 border border-red-600 rounded-none h-9"
                                data-testid={`button-delete-${listing.id}`}
                              >
                                <Trash2 className="h-4 w-4 mr-2" strokeWidth={1} />
                                Delete Listing
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          {/* Purchased Coupons Tab */}
          <TabsContent value="purchased" className="mt-0">
            {purchasedLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/60 mb-3" />
                <p className="text-white/60 text-sm">Loading purchased coupons...</p>
              </div>
            ) : displayPurchasedCoupons.length === 0 ? (
              <div className="border border-white/10 p-12 text-center mt-8" data-testid="empty-purchased">
                <ShoppingBag className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
                <p className="text-white/50 text-sm mb-2">No purchased coupons yet</p>
                <p className="text-xs text-white/40 mb-4">Browse the marketplace to buy coupons</p>
                <Button
                  onClick={() => navigate("/coupon-mart")}
                  className="bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-browse-coupons"
                >
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">
                  {displayPurchasedCoupons.length} {displayPurchasedCoupons.length === 1 ? "coupon" : "coupons"}
                </p>
                <div className="space-y-3">
                  {displayPurchasedCoupons.map((purchase) => {
                    const listing = purchase.listing;
                    if (!listing || !listing.coupons || listing.coupons.length === 0) return null;
                    
                    const coupon = listing.coupons[0];
                    const daysLeft = getDaysUntilExpiry(coupon.expiryDate);
                    const expiring = isExpiringSoon(coupon.expiryDate);
                    const isExpired = daysLeft < 0;

                    return (
                      <div
                        key={purchase.id}
                        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
                        data-testid={`card-purchased-${purchase.id}`}
                      >
                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-16 h-16 border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                                <img
                                  src={getBrandImage(coupon.brand, coupon.category) || ""}
                                  alt={coupon.brand}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-1 flex-1">
                                <h4 className="font-light text-white text-sm tracking-wide">{coupon.title}</h4>
                                <p className="text-[10px] text-white/50 tracking-widest uppercase">{coupon.brand}</p>
                                <Badge className={`rounded-none text-[9px] uppercase ${
                                  isExpired ? "bg-red-500/20 text-red-400 border-red-500/20" :
                                  expiring ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" :
                                  "bg-green-500/20 text-green-400 border-green-500/20"
                                }`}>
                                  {isExpired ? "Expired" : expiring ? "Expiring" : "Active"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-lg font-light text-white tracking-tight">
                                {coupon.valueType === "percentage"
                                  ? `${coupon.value}%`
                                  : `₹${coupon.value}`}
                              </p>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Value</p>
                            </div>
                          </div>

                          {/* Coupon Code */}
                          <div className="bg-white/10 border border-white/20 p-3 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Coupon Code</p>
                                <p className="text-base font-mono font-light text-white tracking-wider break-all">{purchase.revealedCode}</p>
                              </div>
                              <Button
                                onClick={() => copyToClipboard(purchase.revealedCode, purchase.id)}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-white hover:bg-white/10 rounded-none h-9 px-3 shrink-0"
                                data-testid={`button-copy-${purchase.id}`}
                              >
                                {copiedCode === purchase.id ? (
                                  <Check className="h-4 w-4 text-green-400" strokeWidth={1} />
                                ) : (
                                  <Copy className="h-4 w-4" strokeWidth={1} />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Transaction Details */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                              <div>
                                <p className="mb-1">Purchased</p>
                                <p className="text-white">{formatDate(purchase.createdAt)}</p>
                              </div>
                              <div className="text-right">
                                <p className="mb-1">Expires</p>
                                <p className={expiring || isExpired ? "text-red-400" : "text-white"}>
                                  {formatDate(coupon.expiryDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-white/5 p-2">
                              <span className="text-[10px] text-white/50 uppercase tracking-widest">Amount Paid</span>
                              <span className="text-sm font-light text-white">₹{purchase.amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="mt-0">
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0 mb-6">
                <TabsTrigger 
                  value="received" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid="tab-received-offers"
                >
                  <Inbox className="h-3 w-3 mr-1" />
                  Received
                </TabsTrigger>
                <TabsTrigger 
                  value="sent" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid="tab-sent-offers"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Sent
                </TabsTrigger>
              </TabsList>

              {/* Received Offers Tab */}
              <TabsContent value="received" className="mt-0">
                {receivedOffers.length === 0 ? (
                  <div className="border border-white/10 p-12 text-center mt-8" data-testid="empty-received-offers">
                    <Inbox className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-white/50 text-sm mb-2">No offers received yet</p>
                    <p className="text-xs text-white/40">Trade offers from other users will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">
                      {receivedOffers.length} {receivedOffers.length === 1 ? "offer" : "offers"}
                    </p>
                    {receivedOffers.map((offer) => {
                      const listing = offer.listing;
                      const coupon = listing?.coupons?.[0];

                      return (
                        <div
                          key={offer.id}
                          onClick={() => navigate(`/coupon-mart/offer/${offer.id}`)}
                          className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:border-white/20 transition-colors"
                          data-testid={`card-received-offer-${offer.id}`}
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-light text-white text-sm tracking-wide">
                                  {coupon?.title || 'Your Listing'}
                                </h4>
                                <p className="text-[10px] text-white/50 tracking-widest uppercase">
                                  From: {offer.offererName || 'Unknown User'}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`rounded-none text-[9px] uppercase ${
                                    offer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                                    offer.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                    'bg-red-500/20 text-red-400 border-red-500/20'
                                  }`}>
                                    {offer.status}
                                  </Badge>
                                  <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-[9px] uppercase">
                                    {offer.offerType === 'cash' ? 'Cash Offer' : 'Trade Offer'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <p className="text-lg font-light text-white tracking-tight">
                                  {offer.offerType === 'cash' ? `₹${offer.cashAmount}` : `₹${offer.offeredCouponValue}`}
                                </p>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest">Offer</p>
                              </div>
                            </div>

                            {/* Offer Details */}
                            <div className="space-y-2 pt-2 border-t border-white/10">
                              <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                                <span>{formatDate(offer.createdAt)}</span>
                                {offer.respondedAt && (
                                  <span>Responded: {formatDate(offer.respondedAt)}</span>
                                )}
                              </div>

                              {offer.offerType === 'trade' && offer.offeredCouponTitle && (
                                <div className="bg-white/5 p-2 border-t border-white/10">
                                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Offered Coupon</p>
                                  <p className="text-xs text-white">{offer.offeredCouponTitle}</p>
                                  <p className="text-[10px] text-white/50 mt-1">{offer.offeredCouponBrand}</p>
                                </div>
                              )}

                              {offer.offerNote && (
                                <div className="bg-white/5 p-2">
                                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Note</p>
                                  <p className="text-xs text-white/80 italic">"{offer.offerNote}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Sent Offers Tab */}
              <TabsContent value="sent" className="mt-0">
                {sentOffers.length === 0 ? (
                  <div className="border border-white/10 p-12 text-center mt-8" data-testid="empty-sent-offers">
                    <Send className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
                    <p className="text-white/50 text-sm mb-2">No offers sent yet</p>
                    <p className="text-xs text-white/40">Browse listings and make trade offers</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">
                      {sentOffers.length} {sentOffers.length === 1 ? "offer" : "offers"}
                    </p>
                    {sentOffers.map((offer) => (
                      <div
                        key={offer.id}
                        onClick={() => navigate(`/coupon-mart/offer/${offer.id}`)}
                        className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 cursor-pointer hover:border-white/20 transition-colors"
                        data-testid={`card-sent-offer-${offer.id}`}
                      >
                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <h4 className="font-light text-white text-sm tracking-wide">
                                Listing #{offer.listingCode || offer.listingId.slice(0, 8)}
                              </h4>
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">
                                Your Offer
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`rounded-none text-[9px] uppercase ${
                                  offer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                                  offer.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                  'bg-red-500/20 text-red-400 border-red-500/20'
                                }`}>
                                  {offer.status}
                                </Badge>
                                <Badge className="bg-white/10 text-white/60 border-white/10 rounded-none text-[9px] uppercase">
                                  {offer.offerType === 'cash' ? 'Cash Offer' : 'Trade Offer'}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-lg font-light text-white tracking-tight">
                                {offer.offerType === 'cash' ? `₹${offer.cashAmount}` : `₹${offer.offeredCouponValue}`}
                              </p>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">Offer</p>
                            </div>
                          </div>

                          {/* Offer Details */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                              <span>Sent: {formatDate(offer.createdAt)}</span>
                              {offer.respondedAt && (
                                <span>Responded: {formatDate(offer.respondedAt)}</span>
                              )}
                            </div>

                            {offer.offerType === 'trade' && offer.offeredCouponTitle && (
                              <div className="bg-white/5 p-2 border-t border-white/10">
                                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">You Offered</p>
                                <p className="text-xs text-white">{offer.offeredCouponTitle}</p>
                                <p className="text-[10px] text-white/50 mt-1">{offer.offeredCouponBrand}</p>
                              </div>
                            )}

                            {offer.responseNote && (
                              <div className="bg-white/5 p-2">
                                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Response</p>
                                <p className="text-xs text-white/80 italic">"{offer.responseNote}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!listingToDelete} onOpenChange={(open) => !open && setListingToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. Your listing will be permanently removed from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => listingToDelete && deleteListingMutation.mutate(listingToDelete)}
              className="bg-red-500 text-white hover:bg-red-600 rounded-none"
              data-testid="confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
