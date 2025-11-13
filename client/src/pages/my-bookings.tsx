import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Booking } from "@shared/schema";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Video,
  MessageCircle,
  User,
  Star,
  CheckCircle,
  XCircle,
  RotateCcw,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface BookingWithCreator extends Booking {
  creator: {
    id: string;
    displayName: string;
    profileImageUrl?: string;
    averageRating: string;
    isVerified: number;
  };
  session: {
    id: string;
    title: string;
    sessionType: string;
  };
}

export default function MyBookings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch user's bookings
  const { data: bookings = [], isLoading, error } = useQuery<BookingWithCreator[]>({
    queryKey: ["/api/bookings/user"],
    enabled: isAuthenticated,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return apiRequest("PATCH", `/api/bookings/${bookingId}`, {
        status: "cancelled",
        cancelReason: "Cancelled by user"
      });
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      setCancelBookingId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-4 py-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 dark:bg-gray-700 rounded-none"></div>
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const now = new Date();
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.scheduledAt) > now && ["confirmed", "pending"].includes(booking.status)
  );
  const pastBookings = bookings.filter(booking => 
    new Date(booking.scheduledAt) <= now || ["completed", "cancelled"].includes(booking.status)
  );

  const upcomingPagination = usePagination({
    data: upcomingBookings,
    itemsPerPage: 10,
  });

  const pastPagination = usePagination({
    data: pastBookings,
    itemsPerPage: 10,
  });

  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
  };

  const confirmCancelBooking = () => {
    if (cancelBookingId) {
      cancelBookingMutation.mutate(cancelBookingId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-white/5 text-white/80 border-white/20"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-white/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "completed":
        return <Badge className="bg-white/5 text-white/80 border-white/20"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-white/5 text-red-800 border-white/20"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const BookingCard = ({ booking }: { booking: BookingWithCreator }) => (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={booking.creator.profileImageUrl || undefined} />
            <AvatarFallback className="bg-white/5 dark:bg-red-900 text-white/80 dark:text-white/80">
              {booking.creator.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {booking.session.title}
                  </h3>
                  {booking.creator.isVerified === 1 && (
                    <CheckCircle className="h-4 w-4 text-white/80" />
                  )}
                </div>
                <p className="text-sm text-white/60 dark:text-white/40">
                  with {booking.creator.displayName}
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-white/60 dark:text-white/40 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>₹{parseFloat(booking.price).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{parseFloat(booking.creator.averageRating).toFixed(1)} rating</span>
              </div>
            </div>

            {booking.notes && (
              <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span className="text-white/60 dark:text-white/40">Notes: </span>
                <span className="text-gray-900 dark:text-white">{booking.notes}</span>
              </div>
            )}

            <div className="flex gap-2">
              {booking.status === "confirmed" && booking.meetingUrl && (
                <Button size="sm" asChild className="bg-white/10 hover:bg-white/10 text-white">
                  <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4 mr-1" />
                    Join Meeting
                  </a>
                </Button>
              )}
              
              {booking.status === "confirmed" && new Date(booking.scheduledAt) > now && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCancelBooking(booking.id)}
                  className="text-white/80 border-white/20 hover:bg-white/5"
                  data-testid={`button-cancel-${booking.id}`}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate(`/creators/${booking.creator.id}`)}
                data-testid={`button-view-creator-${booking.creator.id}`}
              >
                <User className="h-4 w-4 mr-1" />
                View Creator
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/creators")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Bookings
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookings yet
            </h3>
            <p className="text-white/60 dark:text-white/40 mb-6">
              Book your first session with a financial expert to get started.
            </p>
            <Button 
              onClick={() => navigate("/creators")}
              className="bg-white/10 hover:bg-red-700 text-white"
              data-testid="button-browse-creators"
            >
              Browse Creators
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-none p-1">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none transition-all duration-300 ease-out data-[state=active]:scale-105 data-[state=active]:animate-[bubble_0.4s_ease-out] hover:text-white">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none transition-all duration-300 ease-out data-[state=active]:scale-105 data-[state=active]:animate-[bubble_0.4s_ease-out] hover:text-white">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 data-[state=active]:animate-[fadeInUp_0.3s_ease-out]">
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
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-white/60 dark:text-white/40 mb-4">
                    Schedule your next session with a financial expert.
                  </p>
                  <Button 
                    onClick={() => navigate("/creators")}
                    className="bg-white/10 hover:bg-red-700 text-white"
                  >
                    Book a Session
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 data-[state=active]:animate-[fadeInUp_0.3s_ease-out]">
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
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No past bookings
                  </h3>
                  <p className="text-white/60 dark:text-white/40">
                    Your completed and cancelled sessions will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={cancelBookingId !== null} onOpenChange={() => setCancelBookingId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-white/80" />
              Cancel Booking
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-white/80 dark:text-gray-300">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCancelBookingId(null)}
                className="flex-1"
              >
                Keep Booking
              </Button>
              <Button 
                onClick={confirmCancelBooking}
                disabled={cancelBookingMutation.isPending}
                className="flex-1 bg-white/10 hover:bg-red-700 text-white"
                data-testid="button-confirm-cancel"
              >
                {cancelBookingMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}