import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Ticket, 
  Clock, 
  Users,
  DollarSign,
  QrCode,
  Film,
  Download
} from "lucide-react";
import { format } from "date-fns";
import type { MovieBooking } from "@shared/schema";

export default function MovieTicketDetail() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: bookingData, isLoading } = useQuery<{ success: boolean; booking: MovieBooking }>({
    queryKey: ["/api/movie-bookings", id],
    enabled: isAuthenticated && !!id,
  });

  const booking = bookingData?.booking;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-white/10 text-white/80 border-white/20";
      case "cancelled":
        return "bg-white/10 text-white/80 border-white/20";
      case "used":
        return "bg-white/10 text-white/80 border-white/20";
      default:
        return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-white/10 text-white/80";
      case "pending":
        return "bg-white/10 text-white/80";
      case "failed":
        return "bg-white/10 text-white/80";
      case "refunded":
        return "bg-white/10 text-white/80";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Skeleton className="h-8 w-48 mb-6 bg-white/10" />
          <Skeleton className="h-96 w-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Film className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-white/60 mb-6">The ticket you're looking for doesn't exist</p>
          <Button
            onClick={() => navigate("/my-movie-tickets")}
            className="bg-white text-black hover:bg-white/90 rounded-full px-6"
            data-testid="button-back-to-tickets"
          >
            View All Tickets
          </Button>
        </div>
      </div>
    );
  }

  const isPastShow = new Date(booking.showAt) < new Date();
  const foodItemsArray = booking.foodItems as any[] | null;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/my-movie-tickets")}
              className="text-white hover:bg-white/10 rounded-full"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Ticket Details</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* QR Code Section */}
        {booking.qrCode && (
          <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl mb-4">
                  <img 
                    src={booking.qrCode} 
                    alt="Booking QR Code" 
                    className="w-48 h-48"
                    data-testid="img-qr-code"
                  />
                </div>
                <p className="text-sm text-white/60 text-center mb-2">
                  Show this QR code at the theater entrance
                </p>
                <Badge className={getStatusColor(booking.status)} data-testid="badge-booking-status">
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Movie Information */}
        <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2" data-testid="text-movie-title">
                  {booking.movieTitle}
                </h2>
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span data-testid="text-theater-name">{booking.theaterName}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10 my-4" />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-white/60 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white/60">Show Date & Time</p>
                  <p className="font-semibold" data-testid="text-showtime">
                    {format(new Date(booking.showAt), "EEEE, dd MMMM yyyy")}
                  </p>
                  <p className="text-lg font-bold" data-testid="text-showtime-time">
                    {format(new Date(booking.showAt), "hh:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="h-5 w-5 text-white/60 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white/60">Seat Numbers</p>
                  <p className="font-semibold" data-testid="text-seat-numbers">
                    {booking.seatNumbers && booking.seatNumbers.length > 0 
                      ? booking.seatNumbers.join(", ") 
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-white/60 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white/60">Total Seats</p>
                  <p className="font-semibold" data-testid="text-total-seats">
                    {booking.totalSeats} seat{booking.totalSeats !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Information */}
        <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Booking Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Booking Reference</span>
                <span className="font-mono font-semibold" data-testid="text-booking-reference">
                  {booking.bookingReference}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/60">Booking Status</span>
                <Badge className={getStatusColor(booking.status)} data-testid="badge-status">
                  {booking.status}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/60">Payment Status</span>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)} data-testid="badge-payment-status">
                  {booking.paymentStatus}
                </Badge>
              </div>

              {booking.paymentMethod ? (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Payment Method</span>
                  <span className="font-semibold uppercase" data-testid="text-payment-method">
                    {booking.paymentMethod}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between items-center">
                <span className="text-white/60">Booked On</span>
                <span className="font-semibold" data-testid="text-created-at">
                  {format(new Date(booking.createdAt!), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Price Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Ticket Amount</span>
                <span className="font-semibold" data-testid="text-ticket-amount">
                  ₹{booking.ticketAmount}
                </span>
              </div>

              {booking.convenienceFee && parseFloat(booking.convenienceFee) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Convenience Fee</span>
                  <span className="font-semibold" data-testid="text-convenience-fee">
                    ₹{booking.convenienceFee}
                  </span>
                </div>
              )}

              {booking.foodAmount && parseFloat(booking.foodAmount) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Food & Beverages</span>
                  <span className="font-semibold" data-testid="text-food-amount">
                    ₹{booking.foodAmount}
                  </span>
                </div>
              )}

              <Separator className="bg-white/10" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-white/80" data-testid="text-total-amount">
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Items */}
        {foodItemsArray && foodItemsArray.length > 0 && (
          <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Food & Beverages</h3>
              <div className="space-y-3">
                {foodItemsArray.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold" data-testid={`text-food-name-${index}`}>
                        {item.name}
                      </p>
                      <p className="text-sm text-white/60" data-testid={`text-food-quantity-${index}`}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold" data-testid={`text-food-price-${index}`}>
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seat Categories */}
        {booking.seatCategories && Array.isArray(booking.seatCategories) && booking.seatCategories.length > 0 && (
          <Card className="bg-white/5 border-white/10 rounded-2xl mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Seat Categories</h3>
              <div className="space-y-3">
                {(booking.seatCategories as any[]).map((category: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold" data-testid={`text-category-name-${index}`}>
                        {category.categoryName}
                      </p>
                      <p className="text-sm text-white/60" data-testid={`text-category-quantity-${index}`}>
                        {category.quantity} seat{category.quantity !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="font-semibold" data-testid={`text-category-price-${index}`}>
                      ₹{category.price} each
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
