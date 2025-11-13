import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, MapPin, Ticket, ChevronRight, Film } from "lucide-react";
import { format } from "date-fns";
import type { MovieBooking } from "@shared/schema";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function MyMovieTickets() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: bookingsData, isLoading } = useQuery<{ success: boolean; bookings: MovieBooking[] }>({
    queryKey: ["/api/movie-bookings/user"],
    enabled: isAuthenticated,
  });

  const bookings = bookingsData?.bookings || [];
  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.showAt) >= now);
  const pastBookings = bookings.filter(b => new Date(b.showAt) < now);

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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6 bg-white/10" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="text-white hover:bg-white/10 rounded-full"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Movie Tickets</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Movie Tickets</h2>
            <p className="text-white/60 mb-6">You haven't booked any movie tickets yet</p>
            <Button
              onClick={() => navigate("/movies")}
              className="bg-white text-black hover:bg-white/90 rounded-full px-6"
              data-testid="button-browse-movies"
            >
              Browse Movies
            </Button>
          </div>
        ) : (
          <>
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Upcoming Shows
                </h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      onClick={() => navigate(`/movie-ticket/${booking.id}`)}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-xl overflow-hidden"
                      data-testid={`card-booking-${booking.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1" data-testid={`text-movie-title-${booking.id}`}>
                              {booking.movieTitle}
                            </h3>
                            <p className="text-sm text-white/60" data-testid={`text-theater-${booking.id}`}>
                              {booking.theaterName}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)} data-testid={`badge-status-${booking.id}`}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Calendar className="h-4 w-4" />
                            <span data-testid={`text-showtime-${booking.id}`}>
                              {format(new Date(booking.showAt), "EEE, dd MMM yyyy • hh:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Ticket className="h-4 w-4" />
                            <span data-testid={`text-seats-${booking.id}`}>
                              {booking.seatNumbers && booking.seatNumbers.length > 0 ? booking.seatNumbers.join(", ") : "N/A"} • {booking.totalSeats} seat{booking.totalSeats !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div>
                            <p className="text-xs text-white/60">Booking ID</p>
                            <p className="text-sm font-mono" data-testid={`text-booking-ref-${booking.id}`}>
                              {booking.bookingReference}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/60">Total Amount</p>
                            <p className="text-lg font-bold" data-testid={`text-amount-${booking.id}`}>
                              ₹{booking.totalAmount}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Past Shows
                </h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      onClick={() => navigate(`/movie-ticket/${booking.id}`)}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer rounded-xl opacity-70 hover:opacity-100"
                      data-testid={`card-past-booking-${booking.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1" data-testid={`text-past-movie-title-${booking.id}`}>
                              {booking.movieTitle}
                            </h3>
                            <p className="text-sm text-white/60" data-testid={`text-past-theater-${booking.id}`}>
                              {booking.theaterName}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)} data-testid={`badge-past-status-${booking.id}`}>
                            {booking.status === "used" ? "completed" : booking.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Calendar className="h-4 w-4" />
                            <span data-testid={`text-past-showtime-${booking.id}`}>
                              {format(new Date(booking.showAt), "EEE, dd MMM yyyy • hh:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Ticket className="h-4 w-4" />
                            <span data-testid={`text-past-seats-${booking.id}`}>
                              {booking.seatNumbers && booking.seatNumbers.length > 0 ? booking.seatNumbers.join(", ") : "N/A"} • {booking.totalSeats} seat{booking.totalSeats !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div>
                            <p className="text-xs text-white/60">Booking ID</p>
                            <p className="text-sm font-mono" data-testid={`text-past-booking-ref-${booking.id}`}>
                              {booking.bookingReference}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-white/40" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
