import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SwapNowListing } from "@shared/schema";
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, Eye, MessageCircle, Package, Star, Truck, MapPin, Clock } from "lucide-react";

interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  listing?: {
    title: string;
    price: string;
    images: string[];
    status: string;
  };
}

export default function SwapNowMyListings() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [soldDialogOpen, setSoldDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SwapNowListing | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [soldPrice, setSoldPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [activeTab, setActiveTab] = useState("my-listings");

  const { data: listings = [], isLoading } = useQuery<SwapNowListing[]>({
    queryKey: ['/api/swap-now/my-listings'],
    enabled: !!user,
  });

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/swap-now/conversations'],
    enabled: !!user,
  });

  // Dummy data for purchases
  const dummyPurchases = [
    {
      id: "p1",
      userId: "seller1",
      title: "Sony WH-1000XM4 Wireless Headphones",
      description: "Premium noise canceling headphones in excellent condition",
      category: "electronics",
      condition: "like_new",
      price: "18000",
      isNegotiable: 0,
      images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop"],
      location: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
      status: "active",
      views: 156,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      purchaseStatus: "active",
      purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "p2",
      userId: "seller2",
      title: "Samsung 55\" 4K Smart TV",
      description: "Barely used, 1 year old Samsung QLED TV",
      category: "electronics",
      condition: "like_new",
      price: "45000",
      isNegotiable: 0,
      images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop"],
      location: "HSR Layout",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560102",
      status: "sold",
      views: 234,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      purchaseStatus: "completed",
      purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "p3",
      userId: "seller3",
      title: "Wooden Study Table with Drawer",
      description: "Solid wood study table in good condition",
      category: "furniture",
      condition: "good",
      price: "3500",
      isNegotiable: 0,
      images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop"],
      location: "Marathahalli",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560037",
      status: "sold",
      views: 89,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      purchaseStatus: "completed",
      purchaseDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Dummy data for my listings if empty
  const dummyListings: SwapNowListing[] = listings.length === 0 ? [
    {
      id: "1",
      userId: user?.id || "currentUser",
      title: "Canon EOS 1500D DSLR Camera with Lens",
      description: "Selling my Canon DSLR camera. Barely used, perfect for beginners. Includes 18-55mm lens, battery, charger, and bag.",
      category: "electronics",
      subCategory: null,
      condition: "like_new",
      price: "28000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop"],
      location: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      brand: "Canon",
      age: "< 6 months",
      warranty: null,
      accessories: "18-55mm lens, battery, charger, bag",
      status: "active",
      isFeatured: 0,
      views: 145,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: null,
    },
    {
      id: "2",
      userId: user?.id || "currentUser",
      title: "Dining Table Set - 6 Seater Wooden",
      description: "Beautiful teak wood dining table with 6 chairs. Excellent condition, barely used. Moving out of city.",
      category: "furniture",
      subCategory: null,
      condition: "like_new",
      price: "25000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop"],
      location: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
      brand: null,
      age: "1-2 years",
      warranty: null,
      accessories: null,
      status: "active",
      isFeatured: 0,
      views: 203,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: null,
    },
    {
      id: "3",
      userId: user?.id || "currentUser",
      title: "Mountain Bike - Firefox 29T",
      description: "Well maintained Firefox mountain bike. Perfect for trails and city rides. Includes helmet and lock.",
      category: "vehicles",
      subCategory: null,
      condition: "good",
      price: "12000",
      originalPrice: null,
      isNegotiable: 1,
      images: ["https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop"],
      location: "Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
      brand: "Firefox",
      age: "2-5 years",
      warranty: null,
      accessories: "helmet and lock",
      status: "sold",
      isFeatured: 0,
      views: 178,
      favoriteCount: 0,
      soldAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      soldPrice: "11500",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      updatedAt: null,
    },
  ] : listings;

  const deleteListingMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/swap-now/listings/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Deleted",
        description: "Listing has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/listings'] });
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    },
  });

  const markAsSoldMutation = useMutation({
    mutationFn: async ({ id, soldPrice }: { id: string; soldPrice: number }) => {
      return await apiRequest("POST", `/api/swap-now/listings/${id}/mark-sold`, { soldPrice });
    },
    onSuccess: () => {
      toast({
        title: "Marked as Sold",
        description: "Listing has been marked as sold",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/listings'] });
      setSoldDialogOpen(false);
      setSelectedListing(null);
      setSoldPrice("");
    },
  });

  const handleDelete = (listing: SwapNowListing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const handleTrackOrder = (purchase: any) => {
    setSelectedPurchase(purchase);
    setTrackDialogOpen(true);
  };

  const handleContactSeller = (purchase: any) => {
    navigate('/swap-now/messages');
    toast({
      title: "Opening Messages",
      description: "You can now chat with the seller",
    });
  };

  const handleRateSeller = (purchase: any) => {
    setSelectedPurchase(purchase);
    setRateDialogOpen(true);
  };

  const handleBuySimilar = (purchase: any) => {
    navigate(`/swap-now/explore?category=${purchase.category}`);
  };

  const submitRating = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Thank You!",
      description: "Your rating has been submitted successfully",
    });
    setRateDialogOpen(false);
    setRating(0);
    setReview("");
    setSelectedPurchase(null);
  };

  const handleMarkSold = (listing: SwapNowListing) => {
    setSelectedListing(listing);
    setSoldPrice(listing.price);
    setSoldDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedListing) {
      deleteListingMutation.mutate(selectedListing.id);
    }
  };

  const confirmMarkSold = () => {
    if (selectedListing && soldPrice) {
      markAsSoldMutation.mutate({
        id: selectedListing.id,
        soldPrice: parseFloat(soldPrice),
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(price));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Dummy conversations data
  const dummyConversations: Conversation[] = conversations.length === 0 ? [
    {
      id: "conv1",
      listingId: "1",
      buyerId: "buyer1",
      sellerId: user?.id || "currentUser",
      sellerName: "You",
      buyerName: "Rahul Sharma",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unreadCount: 2,
      listing: {
        title: "iPhone 13 Pro Max 256GB Pacific Blue",
        price: "65000",
        images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&h=500&fit=crop"],
        status: "active",
      },
    },
    {
      id: "conv2",
      listingId: "4",
      buyerId: user?.id || "currentUser",
      sellerId: "seller2",
      sellerName: "Priya Patel",
      buyerName: "You",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      listing: {
        title: "MacBook Air M1 2020 - 8GB RAM 256GB SSD",
        price: "52000",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop"],
        status: "active",
      },
    },
    {
      id: "conv3",
      listingId: "2",
      buyerId: "buyer3",
      sellerId: user?.id || "currentUser",
      sellerName: "You",
      buyerName: "Amit Kumar",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      listing: {
        title: "Royal Enfield Classic 350 - 2021 Model",
        price: "145000",
        images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=500&fit=crop"],
        status: "active",
      },
    },
  ] : conversations;

  const activeListings = dummyListings.filter(l => l.status === "active");
  const soldListings = dummyListings.filter(l => l.status === "sold");
  const activePurchases = dummyPurchases.filter(p => p.purchaseStatus === "active");
  const completedPurchases = dummyPurchases.filter(p => p.purchaseStatus === "completed");

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Please login to view your listings</p>
          <Button onClick={() => navigate("/login")} className="bg-white text-black hover:bg-white/90 rounded-none">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            onClick={() => navigate("/swap-now/explore")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-bold tracking-wider uppercase">My Activity</h1>
          </div>
          <Button
            onClick={() => navigate("/swap-now/new")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-new-listing"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0 mb-6">
            <TabsTrigger 
              value="my-listings" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-4 border-b-2 border-transparent"
              data-testid="tab-my-listings"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger 
              value="my-purchases" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-4 border-b-2 border-transparent"
              data-testid="tab-my-purchases"
            >
              My Purchases
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-4 border-b-2 border-transparent"
              data-testid="tab-messages"
            >
              Messages
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="my-listings" className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-white/40">Loading...</div>
              </div>
            ) : dummyListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="h-16 w-16 text-white/20 mb-4" />
                <p className="text-white/40 text-sm mb-4">You haven't posted any listings yet</p>
                <Button
                  onClick={() => navigate("/swap-now/new")}
                  className="bg-white text-black hover:bg-white/90 rounded-none"
                  data-testid="button-create-first"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Active Listings */}
                {activeListings.length > 0 && (
                  <div>
                    <div className="space-y-4">
                      {activeListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="border border-white/10 bg-white/5 p-4"
                          data-testid={`listing-${listing.id}`}
                        >
                          <div className="flex gap-4">
                            <div
                              onClick={() => navigate(`/swap-now/listings/${listing.id}`)}
                              className="w-24 h-24 bg-black/20 flex-shrink-0 cursor-pointer"
                            >
                              {listing.images && listing.images.length > 0 ? (
                                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Eye className="h-8 w-8 text-white/20" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-light mb-1 truncate">{listing.title}</h3>
                              <div className="text-lg font-semibold mb-2">{formatPrice(listing.price)}</div>
                              <div className="flex items-center gap-2 text-xs text-white/40">
                                <Eye className="h-3 w-3" />
                                <span>{listing.views || 0} views</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => navigate(`/swap-now/listings/${listing.id}/edit`)}
                              variant="ghost"
                              size="sm"
                              className="flex-1 border border-white/10 hover:bg-white/10 rounded-none"
                              data-testid={`button-edit-${listing.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleMarkSold(listing)}
                              variant="ghost"
                              size="sm"
                              className="flex-1 border border-white/10 hover:bg-white/10 rounded-none"
                              data-testid={`button-mark-sold-${listing.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Sold
                            </Button>
                            <Button
                              onClick={() => handleDelete(listing)}
                              variant="ghost"
                              size="sm"
                              className="border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-none"
                              data-testid={`button-delete-${listing.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sold Listings */}
                {soldListings.length > 0 && (
                  <div>
                    <div className="space-y-4">
                      {soldListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="border border-white/10 bg-white/5 p-4 opacity-60"
                          data-testid={`listing-sold-${listing.id}`}
                        >
                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-black/20 flex-shrink-0">
                              {listing.images && listing.images.length > 0 ? (
                                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Eye className="h-8 w-8 text-white/20" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-light mb-1 truncate">{listing.title}</h3>
                              <div className="text-lg font-semibold mb-1">
                                {formatPrice(listing.soldPrice || listing.price)}
                              </div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none text-xs">
                                SOLD
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* My Purchases Tab */}
          <TabsContent value="my-purchases" className="mt-0">
            <div className="space-y-8">
              {/* Active Purchases */}
              {activePurchases.length > 0 && (
                <div>
                  <h2 className="text-sm uppercase tracking-wider text-white/60 mb-4">
                    Active Orders ({activePurchases.length})
                  </h2>
                  <div className="space-y-4">
                    {activePurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="border border-white/10 bg-white/5 p-4"
                        data-testid={`purchase-${purchase.id}`}
                      >
                        <div className="flex gap-4">
                          <div
                            onClick={() => navigate(`/swap-now/listings/${purchase.id}`)}
                            className="w-24 h-24 bg-black/20 flex-shrink-0 cursor-pointer"
                          >
                            {purchase.images && purchase.images.length > 0 ? (
                              <img src={purchase.images[0]} alt={purchase.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-white/20" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-light mb-1 truncate">{purchase.title}</h3>
                            <div className="text-lg font-semibold mb-2">{formatPrice(purchase.price)}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-none text-xs">
                                IN TRANSIT
                              </Badge>
                            </div>
                            <div className="text-xs text-white/40">
                              Ordered on {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTrackOrder(purchase)}
                            className="flex-1 border border-white/10 hover:bg-white/10 rounded-none"
                            data-testid={`button-track-${purchase.id}`}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContactSeller(purchase)}
                            className="flex-1 border border-white/10 hover:bg-white/10 rounded-none"
                            data-testid={`button-contact-seller-${purchase.id}`}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Purchases */}
              {completedPurchases.length > 0 && (
                <div>
                  <h2 className="text-sm uppercase tracking-wider text-white/60 mb-4">
                    Completed ({completedPurchases.length})
                  </h2>
                  <div className="space-y-4">
                    {completedPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="border border-white/10 bg-white/5 p-4"
                        data-testid={`purchase-completed-${purchase.id}`}
                      >
                        <div className="flex gap-4">
                          <div
                            onClick={() => navigate(`/swap-now/listings/${purchase.id}`)}
                            className="w-24 h-24 bg-black/20 flex-shrink-0 cursor-pointer"
                          >
                            {purchase.images && purchase.images.length > 0 ? (
                              <img src={purchase.images[0]} alt={purchase.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-white/20" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-light mb-1 truncate">{purchase.title}</h3>
                            <div className="text-lg font-semibold mb-2">{formatPrice(purchase.price)}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none text-xs">
                                DELIVERED
                              </Badge>
                            </div>
                            <div className="text-xs text-white/40">
                              Delivered on {new Date(purchase.deliveryDate!).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRateSeller(purchase)}
                            className="flex-1 border border-white/10 hover:bg-white/10 rounded-none"
                            data-testid={`button-rate-${purchase.id}`}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Rate Seller
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBuySimilar(purchase)}
                            className="flex-1 border border-white/10 hover:bg-white/10 rounded-none"
                            data-testid={`button-buy-again-${purchase.id}`}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Buy Similar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePurchases.length === 0 && completedPurchases.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Package className="h-16 w-16 text-white/20 mb-4" />
                  <p className="text-white/40 text-sm mb-2">No purchases yet</p>
                  <p className="text-white/30 text-xs mb-4">Start browsing to find great deals</p>
                  <Button
                    onClick={() => navigate("/swap-now/explore")}
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-explore"
                  >
                    Explore Listings
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="mt-0">
            {dummyConversations.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No conversations yet</p>
                <p className="text-white/40 text-sm">Start chatting with sellers to see messages here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dummyConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => navigate(`/swap-now/messages?conversation=${conv.id}`)}
                    className="w-full bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all text-left rounded-sm"
                    data-testid={`conversation-${conv.id}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-14 h-14 bg-black/20 flex-shrink-0 rounded-sm overflow-hidden">
                        {conv.listing?.images?.[0] ? (
                          <img 
                            src={conv.listing.images[0]} 
                            alt={conv.listing.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm">
                            {conv.sellerId === user?.id ? conv.buyerName : conv.sellerName}
                          </h3>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs rounded-full h-5 px-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/60 truncate mb-1">{conv.listing?.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/80 font-semibold">
                            {formatPrice(conv.listing?.price || "0")}
                          </p>
                          <p className="text-xs text-white/40">{formatTime(conv.lastMessageAt)}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-md">
          {/* Header Section */}
          <div className="border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-light tracking-wide">Delete Listing</DialogTitle>
                <p className="text-xs text-white/40 uppercase tracking-wider">Permanent Action</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4 mb-6">
            <div className="border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Item to be deleted</p>
              <p className="text-white font-light">{selectedListing?.title}</p>
              <p className="text-sm text-white/60 mt-2">{formatPrice(selectedListing?.price || "0")}</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-xs">!</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-red-400 font-light mb-1">Warning: This cannot be undone</p>
                  <p className="text-xs text-white/60">Your listing will be permanently removed from the marketplace</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="ghost"
              className="flex-1 border border-white/20 hover:bg-white/5 rounded-none h-12 font-light tracking-wide"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteListingMutation.isPending}
              className="flex-1 bg-red-500 text-white hover:bg-red-600 rounded-none h-12 font-light tracking-wide disabled:opacity-50"
              data-testid="button-confirm-delete"
            >
              {deleteListingMutation.isPending ? "Deleting..." : "Delete Listing"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark as Sold Dialog */}
      <Dialog open={soldDialogOpen} onOpenChange={setSoldDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-md">
          {/* Header Section */}
          <div className="border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-light tracking-wide">Mark as Sold</DialogTitle>
                <p className="text-xs text-white/40 uppercase tracking-wider">Finalize Transaction</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-5 mb-6">
            <div className="border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Listing Details</p>
              <p className="text-white font-light mb-2">{selectedListing?.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-white/40">Listed Price:</span>
                <span className="text-sm text-white/70">{formatPrice(selectedListing?.price || "0")}</span>
              </div>
            </div>

            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5">
              <label className="text-xs text-white/60 uppercase tracking-widest font-light mb-3 block">Final Selling Price (₹)</label>
              <Input
                type="number"
                value={soldPrice}
                onChange={(e) => setSoldPrice(e.target.value)}
                placeholder="Enter final price"
                className="bg-white/5 border-white/10 text-white rounded-none h-12 text-lg"
                data-testid="input-sold-price"
              />
              <p className="text-xs text-white/40 mt-2">This will be recorded as your final transaction amount</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => setSoldDialogOpen(false)}
              variant="ghost"
              className="flex-1 border border-white/20 hover:bg-white/5 rounded-none h-12 font-light tracking-wide"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMarkSold}
              disabled={!soldPrice || markAsSoldMutation.isPending}
              className="flex-1 bg-green-700 text-white hover:bg-green-800 rounded-none h-12 font-light tracking-wide disabled:opacity-50"
              data-testid="button-confirm-sold"
            >
              {markAsSoldMutation.isPending ? "Updating..." : "Confirm Sale"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Track Order Dialog */}
      <Dialog open={trackDialogOpen} onOpenChange={setTrackDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-md">
          {/* Header Section */}
          <div className="border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Truck className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-light tracking-wide">Track Order</DialogTitle>
                <p className="text-xs text-white/40 uppercase tracking-wider">Delivery Status</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border border-white/10 bg-white/5 p-4 mb-6">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Item Purchased</p>
            <p className="text-white font-light mb-2">{selectedPurchase?.title}</p>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Ordered {new Date(selectedPurchase?.purchaseDate || Date.now()).toLocaleDateString()}</span>
              </div>
              <span>•</span>
              <span>{formatPrice(selectedPurchase?.price || "0")}</span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 mb-6">
            <p className="text-xs text-white/60 uppercase tracking-widest font-light mb-5">Shipment Progress</p>
            <div className="space-y-1">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-black" />
                  </div>
                  <div className="w-0.5 h-14 bg-green-500/50"></div>
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="font-light mb-1 text-white">Order Confirmed</h4>
                  <p className="text-xs text-green-400">Completed</p>
                  <p className="text-xs text-white/40 mt-1">{new Date(selectedPurchase?.purchaseDate || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-0.5 h-14 bg-white/20"></div>
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="font-light mb-1 text-white">In Transit</h4>
                  <p className="text-xs text-blue-400">Current Status</p>
                  <p className="text-xs text-white/40 mt-1">Est. delivery in 2-3 days</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white/40" />
                  </div>
                  <div className="w-0.5 h-14 bg-white/10"></div>
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="font-light mb-1 text-white/50">Out for Delivery</h4>
                  <p className="text-xs text-white/40">Pending</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white/40" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-light mb-1 text-white/50">Delivered</h4>
                  <p className="text-xs text-white/40">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Button
            onClick={() => setTrackDialogOpen(false)}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wide"
            data-testid="button-close-tracking"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Rate Seller Dialog */}
      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white max-w-md">
          {/* Header Section */}
          <div className="border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-light tracking-wide">Rate Seller</DialogTitle>
                <p className="text-xs text-white/40 uppercase tracking-wider">Share Your Experience</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border border-white/10 bg-white/5 p-4 mb-6">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Purchase Details</p>
            <p className="text-white font-light">{selectedPurchase?.title}</p>
            <p className="text-sm text-white/60 mt-1">{formatPrice(selectedPurchase?.price || "0")}</p>
          </div>

          {/* Rating Section */}
          <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 mb-5">
            <label className="text-xs text-white/60 uppercase tracking-widest font-light mb-4 block">Your Rating</label>
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110"
                  data-testid={`star-${star}`}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/20 hover:text-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-yellow-400 mt-2">
                {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </p>
            )}
          </div>

          {/* Review Section */}
          <div className="mb-6">
            <label className="text-xs text-white/60 uppercase tracking-widest font-light mb-3 block">
              Write a Review <span className="text-white/40">(Optional)</span>
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share details about your experience with this seller..."
              className="bg-white/5 border-white/10 text-white rounded-none min-h-[100px]"
              data-testid="input-review"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setRateDialogOpen(false);
                setRating(0);
                setReview("");
                setSelectedPurchase(null);
              }}
              variant="ghost"
              className="flex-1 border border-white/20 hover:bg-white/5 rounded-none h-12 font-light tracking-wide"
            >
              Cancel
            </Button>
            <Button
              onClick={submitRating}
              disabled={rating === 0}
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 rounded-none h-12 font-light tracking-wide disabled:opacity-50"
              data-testid="button-submit-rating"
            >
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
