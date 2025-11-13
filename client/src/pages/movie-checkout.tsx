import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, MapPin, Armchair, ShoppingCart, CreditCard, Wallet, Building, Tag, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import type { MovieShowtime, Movie } from "@shared/schema";

export default function MovieCheckout() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>("wallet");
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const redirectedRef = useRef(false);

  const bookingData = JSON.parse(sessionStorage.getItem("movieBooking") || "{}");
  const { movieId, showtimeId, selectedSeats, totalAmount, foodItems, foodAmount } = bookingData;

  const { data: showtimeData, isLoading: showtimeLoading } = useQuery<{ success: boolean; showtime: MovieShowtime }>({
    queryKey: ["/api/showtimes", showtimeId],
    enabled: isAuthenticated && !!showtimeId,
  });

  const { data: movieData } = useQuery<{ success: boolean; movie: Movie }>({
    queryKey: ["/api/movies", movieId],
    enabled: isAuthenticated && !!movieId,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/movie-bookings", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/movie-bookings"] });
      sessionStorage.removeItem("movieBooking");
      toast({
        title: "Booking Confirmed!",
        description: "Your movie tickets have been booked successfully.",
      });
      navigate(`/movies/booking-success/${data.booking.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (redirectedRef.current) return;

    if (!authLoading && !isAuthenticated) {
      redirectedRef.current = true;
      toast({
        title: "Login Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      navigate(`/login?redirect=${encodeURIComponent(location)}`, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, toast, location]);

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

  const showtime = showtimeData?.showtime;
  const movie = movieData?.movie;

  const ticketAmount = selectedSeats?.reduce((sum: number, seat: any) => sum + parseFloat(seat.price), 0) || 0;
  const convenienceFee = ticketAmount * 0.05;
  const subtotal = ticketAmount + (foodAmount || 0) + convenienceFee;
  const appliedDiscount = Math.min(discount, subtotal);
  const finalTotal = Math.max(subtotal - appliedDiscount, 0);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "MOVIE50") {
      setDiscount(50);
      toast({
        title: "Coupon Applied!",
        description: "You saved ₹50 on this booking.",
      });
    } else if (code === "FIRST100") {
      setDiscount(100);
      toast({
        title: "Coupon Applied!",
        description: "You saved ₹100 on this booking.",
      });
    } else if (code) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
  };

  const handleConfirmBooking = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    const bookingPayload = {
      showtimeId,
      movieTitle: movie?.title || "Unknown Movie",
      theaterName: bookingData.theaterName || "Unknown Theater",
      showAt: showtime?.showAt,
      seatNumbers: selectedSeats?.map((s: any) => s.seatNumber) || [],
      seatCategories: selectedSeats?.map((s: any) => ({
        categoryId: s.categoryId,
        categoryName: s.categoryName,
        quantity: 1,
        price: s.price,
      })) || [],
      totalSeats: selectedSeats?.length || 0,
      ticketAmount: ticketAmount.toFixed(2),
      convenienceFee: convenienceFee.toFixed(2),
      foodAmount: (foodAmount || 0).toFixed(2),
      totalAmount: finalTotal.toFixed(2),
      foodItems: foodItems || [],
      paymentMethod,
      paymentStatus: "paid",
      status: "confirmed",
    };

    createBookingMutation.mutate(bookingPayload);
  };

  if (showtimeLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6 rounded-none" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-none" />
            <Skeleton className="h-32 w-full rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (!showtime || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Booking</h2>
          <Button className="rounded-none" onClick={() => navigate("/movies")} data-testid="button-back-to-movies">
            Back to Movies
          </Button>
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
              onClick={() => navigate("/movies/fnb")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6 rounded-none" data-testid="card-booking-summary">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-24 h-36 flex-shrink-0 rounded-none overflow-hidden bg-white/5">
                <img 
                  src={movie.posterUrl || "/placeholder-movie.jpg"} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                  data-testid="img-movie-poster"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2" data-testid="text-movie-title">{movie.title}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="h-4 w-4" />
                    <span data-testid="text-showtime-date">
                      {format(new Date(showtime.showAt), "EEE, dd MMM yyyy • hh:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-theater-name">{bookingData.theaterName || "Theater"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-none" data-testid="badge-screen">{showtime.screen}</Badge>
                    <Badge variant="outline" className="rounded-none" data-testid="badge-format">{showtime.format}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Armchair className="h-4 w-4" />
                <span className="font-semibold">Seats</span>
              </div>
              <div className="flex flex-wrap gap-2" data-testid="container-seats">
                {selectedSeats?.map((seat: any) => (
                  <Badge key={seat.id} variant="secondary" className="rounded-none" data-testid={`badge-seat-${seat.seatNumber}`}>
                    {seat.seatNumber}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-white/60 mt-2" data-testid="text-seat-count">
                {selectedSeats?.length || 0} seat{selectedSeats?.length !== 1 ? "s" : ""}
              </p>
            </div>

            {foodItems && foodItems.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="font-semibold">Food & Beverages</span>
                  </div>
                  <div className="space-y-1" data-testid="container-food-items">
                    {foodItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm" data-testid={`food-item-${idx}`}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 rounded-none" data-testid="card-coupon-code">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Apply Coupon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="rounded-none"
                data-testid="input-coupon-code"
              />
              {discount > 0 ? (
                <Button 
                  variant="outline"
                  className="rounded-none"
                  onClick={handleRemoveCoupon}
                  data-testid="button-remove-coupon"
                >
                  Remove
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="rounded-none"
                  onClick={handleApplyCoupon}
                  data-testid="button-apply-coupon"
                >
                  Apply
                </Button>
              )}
            </div>
            {discount > 0 && (
              <p className="text-sm text-green-600 mt-2 font-medium" data-testid="text-coupon-success">
                Coupon applied! You saved ₹{appliedDiscount.toFixed(2)}
              </p>
            )}
            <p className="text-xs text-white/60 mt-2">
              Try codes: MOVIE50, FIRST100
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 rounded-none" data-testid="card-payment-method">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-none cursor-pointer hover:bg-accent" data-testid="radio-payment-wallet">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <div>
                    <p className="font-medium">InCred Wallet</p>
                    <p className="text-xs text-white/60">Pay using your wallet balance</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-none cursor-pointer hover:bg-accent" data-testid="radio-payment-upi">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-xs text-white/60">Pay via UPI apps</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-none cursor-pointer hover:bg-accent" data-testid="radio-payment-card">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-xs text-white/60">Pay using your card</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="rounded-none" data-testid="card-price-breakdown">
          <CardHeader>
            <CardTitle>Price Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60" data-testid="text-label-tickets">Ticket Amount ({selectedSeats?.length || 0} ticket{selectedSeats?.length !== 1 ? "s" : ""})</span>
              <span data-testid="text-ticket-amount">₹{ticketAmount.toFixed(2)}</span>
            </div>
            {foodAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-white/60" data-testid="text-label-food">Food & Beverages</span>
                <span data-testid="text-food-amount">₹{foodAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/60" data-testid="text-label-convenience">Convenience Fee (5%)</span>
              <span data-testid="text-convenience-fee">₹{convenienceFee.toFixed(2)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span data-testid="text-label-discount">Coupon Discount</span>
                <span data-testid="text-discount-amount">-₹{appliedDiscount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span data-testid="text-label-total">Total Amount</span>
              <span data-testid="text-total-amount">₹{finalTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-amber-200 bg-amber-50/50" data-testid="card-cancellation-policy">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 mb-1">Cancellation Policy</p>
                <ul className="text-amber-800 space-y-1 list-disc list-inside">
                  <li>Cancellations are allowed up to 20 minutes before the show</li>
                  <li>Cancellation charges: ₹50 + convenience fee (non-refundable)</li>
                  <li>Food & beverage items are non-refundable</li>
                  <li>Refund will be credited within 5-7 working days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t p-4 z-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">Total Amount</p>
              <p className="text-2xl font-bold" data-testid="text-footer-total">₹{finalTotal.toFixed(2)}</p>
            </div>
            <Button 
              size="lg"
              className="rounded-none"
              onClick={handleConfirmBooking}
              disabled={createBookingMutation.isPending}
              data-testid="button-confirm-booking"
            >
              {createBookingMutation.isPending ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
