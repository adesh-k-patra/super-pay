import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  Film,
  QrCode,
  Download
} from "lucide-react";
import { format } from "date-fns";
import type { MovieBooking } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function MovieBookings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: bookingsData, isLoading } = useQuery<{ success: boolean; bookings: MovieBooking[] }>({
    queryKey: ["/api/movie-bookings"],
    enabled: isAuthenticated,
  });

  const bookings = bookingsData?.bookings || [];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6 bg-white/10" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const now = new Date();
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.showAt) > now && booking.status === "confirmed"
  );
  const pastBookings = bookings.filter(booking => 
    new Date(booking.showAt) <= now || booking.status !== "confirmed"
  );

  const upcomingPagination = usePagination({
    data: upcomingBookings,
    itemsPerPage: 10,
  });

  const pastPagination = usePagination({
    data: pastBookings,
    itemsPerPage: 10,
  });

  const BookingCard = ({ booking }: { booking: MovieBooking }) => {
    const showDate = new Date(booking.showAt);
    const isPast = showDate <= now;

    return (
      <Card 
        className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
        onClick={() => navigate(`/movies/booking-success/${booking.id}`)}
        data-testid={`card-booking-${booking.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-20 bg-white/10 rounded flex items-center justify-center">
              {booking.qrCode ? (
                <img src={booking.qrCode} alt="QR Code" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              ) : (
                <QrCode className="h-8 w-8 text-white/60" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate mb-1" data-testid="text-movie-title">
                    {booking.movieTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{booking.theaterName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="h-3 w-3" />
                    <span>{format(showDate, "EEE, dd MMM yyyy • hh:mm a")}</span>
                  </div>
                </div>
                <Badge 
                  className={cn(
                    "ml-2",
                    booking.status === "confirmed" ? "bg-white/10 text-white/80 border-white/20/20" :
                    booking.status === "cancelled" ? "bg-white/10 text-white/80 border-white/20" :
                    "bg-white/10 text-white/60 border-white/10"
                  )}
                  data-testid="badge-status"
                >
                  {booking.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Ticket className="h-3 w-3" />
                    <span>{booking.totalSeats} seat{booking.totalSeats !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">₹{booking.totalAmount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Ref: {booking.bookingReference}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/movies")}
              className="flex-shrink-0 text-white hover:bg-white/10"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Movie Tickets</h1>
              <p className="text-sm text-white/60">View all your bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Film className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No movie bookings yet
            </h3>
            <p className="text-white/60 mb-6">
              Book your first movie ticket to get started
            </p>
            <Button 
              onClick={() => navigate("/movies")}
              className="bg-white text-black hover:bg-white/90"
              data-testid="button-browse-movies"
            >
              <Film className="h-4 w-4 mr-2" />
              Browse Movies
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
              <TabsTrigger 
                value="upcoming" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80"
                data-testid="tab-upcoming"
              >
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80"
                data-testid="tab-past"
              >
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3" data-testid="content-upcoming">
              {upcomingBookings.length > 0 ? (
                <>
                  {upcomingPagination.paginatedData.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                  
                  <PaginationControls
                    currentPage={upcomingPagination.currentPage}
                    totalPages={upcomingPagination.totalPages}
                    onPageChange={upcomingPagination.goToPage}
                    canGoNext={upcomingPagination.canGoNext}
                    canGoPrevious={upcomingPagination.canGoPrevious}
                    startIndex={upcomingPagination.startIndex}
                    endIndex={upcomingPagination.endIndex}
                    totalItems={upcomingPagination.totalItems}
                    className="mt-4"
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-white/60 mb-6">
                    Book your next movie experience
                  </p>
                  <Button 
                    onClick={() => navigate("/movies")}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    Browse Movies
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-3" data-testid="content-past">
              {pastBookings.length > 0 ? (
                <>
                  {pastPagination.paginatedData.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                  
                  <PaginationControls
                    currentPage={pastPagination.currentPage}
                    totalPages={pastPagination.totalPages}
                    onPageChange={pastPagination.goToPage}
                    canGoNext={pastPagination.canGoNext}
                    canGoPrevious={pastPagination.canGoPrevious}
                    startIndex={pastPagination.startIndex}
                    endIndex={pastPagination.endIndex}
                    totalItems={pastPagination.totalItems}
                    className="mt-4"
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No past bookings
                  </h3>
                  <p className="text-white/60">
                    Your completed bookings will appear here
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {bookings.length > 0 && (
        <div className="px-4 py-4 bg-white/5 border-t border-white/10 text-center text-sm text-white/60">
          <p>Tap on any booking to view full ticket details and QR code</p>
        </div>
      )}
    </div>
  );
}
