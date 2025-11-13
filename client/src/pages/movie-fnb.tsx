import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { FoodMenuItem } from "@shared/schema";

interface FoodItemWithQuantity extends FoodMenuItem {
  quantity: number;
}

export default function MovieFnB() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const redirectedRef = useRef(false);
  
  const bookingData = JSON.parse(sessionStorage.getItem("movieBooking") || "{}");
  const theaterId = bookingData.theaterId;
  const hasMovieId = !!bookingData.movieId;
  const hasShowtimeId = !!bookingData.showtimeId;
  const hasSelectedSeats = Array.isArray(bookingData.selectedSeats) && bookingData.selectedSeats.length > 0;

  const { data: foodMenuData, isLoading } = useQuery<{ success: boolean; foodMenu: FoodMenuItem[] }>({
    queryKey: ["/api/food-menu", theaterId],
    enabled: isAuthenticated && !!theaterId,
  });

  useEffect(() => {
    if (redirectedRef.current) return;

    if (!authLoading && !isAuthenticated) {
      redirectedRef.current = true;
      toast({
        title: "Login Required",
        description: "Please log in to continue booking.",
        variant: "destructive",
      });
      navigate(`/login?redirect=${encodeURIComponent(location)}`, { replace: true });
      return;
    }

    if (isAuthenticated && (!hasMovieId || !hasShowtimeId || !hasSelectedSeats)) {
      redirectedRef.current = true;
      navigate("/movies");
    }
  }, [isAuthenticated, authLoading, hasMovieId, hasShowtimeId, hasSelectedSeats, navigate, toast, location]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4 rounded-none" />
          <Skeleton className="h-96 w-full rounded-none" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const foodMenu = foodMenuData?.foodMenu || [];

  const categorizedMenu = foodMenu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FoodMenuItem[]>);

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      const newValue = Math.max(0, current + delta);
      if (newValue === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newValue };
    });
  };

  const selectedItemsList = foodMenu
    .filter(item => selectedItems[item.id])
    .map(item => ({ ...item, quantity: selectedItems[item.id] }));

  const foodTotal = selectedItemsList.reduce((sum, item) => 
    sum + (parseFloat(item.price) * item.quantity), 0
  );

  const handleSkip = () => {
    const updatedBooking = {
      ...bookingData,
      foodItems: [],
      foodAmount: 0,
    };
    sessionStorage.setItem("movieBooking", JSON.stringify(updatedBooking));
    navigate("/movies/checkout");
  };

  const handleProceedToCheckout = () => {
    if (selectedItemsList.length === 0) {
      handleSkip();
      return;
    }

    const updatedBooking = {
      ...bookingData,
      foodItems: selectedItemsList.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      foodAmount: foodTotal,
    };
    sessionStorage.setItem("movieBooking", JSON.stringify(updatedBooking));
    navigate("/movies/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6 rounded-none" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-none" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-none"
              onClick={() => navigate(`/movies/${bookingData.movieId}/seats/${bookingData.showtimeId}`)}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Food & Beverages</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {foodMenu.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-white/60 mb-3" />
            <p className="text-white/60 mb-4">No food items available for this theater</p>
            <Button className="rounded-none" onClick={handleSkip} data-testid="button-skip-no-items">
              Skip to Checkout
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categorizedMenu).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl font-bold mb-4" data-testid={`text-category-${category.toLowerCase()}`}>
                  {category}
                </h2>
                <div className="grid gap-4">
                  {items.map(item => {
                    const quantity = selectedItems[item.id] || 0;
                    return (
                      <Card key={item.id} className="rounded-none" data-testid={`card-food-item-${item.id}`}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {item.imageUrl && (
                              <div className="w-20 h-20 flex-shrink-0 rounded-none overflow-hidden bg-white/5">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  data-testid={`img-food-${item.id}`}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold" data-testid={`text-food-name-${item.id}`}>
                                    {item.name}
                                    {item.isCombo === 1 && (
                                      <Badge variant="secondary" className="ml-2 rounded-none">Combo</Badge>
                                    )}
                                  </h3>
                                  {item.description && (
                                    <p className="text-sm text-white/60 line-clamp-2 mt-1" data-testid={`text-food-desc-${item.id}`}>
                                      {item.description}
                                    </p>
                                  )}
                                  {item.comboItems && item.comboItems.length > 0 && (
                                    <p className="text-xs text-white/60 mt-1">
                                      {item.comboItems.join(" • ")}
                                    </p>
                                  )}
                                  <p className="text-lg font-bold mt-2" data-testid={`text-food-price-${item.id}`}>
                                    ₹{item.price}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {quantity === 0 ? (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="rounded-none"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  data-testid={`button-add-${item.id}`}
                                >
                                  Add
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2 border rounded-none">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    data-testid={`button-decrease-${item.id}`}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="font-medium min-w-[20px] text-center" data-testid={`text-quantity-${item.id}`}>
                                    {quantity}
                                  </span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    data-testid={`button-increase-${item.id}`}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t p-4 z-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              {selectedItemsList.length > 0 ? (
                <>
                  <p className="text-sm text-white/60" data-testid="text-items-count">
                    {selectedItemsList.length} item{selectedItemsList.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-bold" data-testid="text-food-total">
                    ₹{foodTotal.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-white/60">No items selected</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="rounded-none"
                onClick={handleSkip}
                data-testid="button-skip"
              >
                Skip
              </Button>
              <Button 
                className="rounded-none"
                onClick={handleProceedToCheckout}
                data-testid="button-proceed-to-checkout"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
