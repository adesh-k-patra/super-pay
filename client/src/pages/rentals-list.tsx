import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Search, Calendar, MapPin, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import type { TravelBooking } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function RentalsList() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const { data: bookingsData, isLoading, error } = useQuery<{ bookings: (TravelBooking & { passengers?: any[] })[] }>({
    queryKey: ['/api/travel/my-bookings'],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading rentals",
        description: "Failed to fetch rental bookings. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const allBookings = bookingsData?.bookings || [];
  const rentals = allBookings.filter(b => b.serviceType === 'rental');

  const filteredRentals = rentals.filter(booking => {
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.bookingReference?.toLowerCase().includes(query) ||
        booking.pickupAddress?.toLowerCase().includes(query) ||
        booking.vehicleType?.toLowerCase().includes(query) ||
        booking.vehicleNumber?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedRentals = [...filteredRentals].sort((a, b) => {
    if (sortBy === "date") return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
    if (sortBy === "price-low") return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
    if (sortBy === "price-high") return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
    return 0;
  });

  const pagination = usePagination({
    data: sortedRentals,
    itemsPerPage: 10,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-white/10 text-white/80 border-white/20';
      case 'pending': return 'bg-white/10 text-white/80 border-white/20';
      case 'cancelled': return 'bg-white/10 text-white/80 border-white/20';
      case 'completed': return 'bg-white/10 text-white/80 border-white/20';
      default: return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-trips")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 border border-white/20">
              <Key className="h-8 w-8 text-white" strokeWidth={1} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wider">MY RENTALS</h1>
              <p className="text-white/60 text-xs uppercase tracking-widest font-light">{rentals.length} rental{rentals.length !== 1 ? 's' : ''} found</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 mb-6 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search by booking ref, vehicle, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-white/10 rounded-none w-1/3"></div>
                  <div className="h-8 bg-white/10 rounded-none"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedRentals.length > 0 ? (
          <div className="grid gap-4">
            {pagination.paginatedData.map((rental) => (
              <div
                key={rental.id}
                className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl hover:border-white/40 transition-all cursor-pointer p-6"
                onClick={() => navigate(`/my-trips/rentals/${rental.id}`)}
                data-testid={`card-rental-${rental.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/20 border border-amber-500/30 rounded">
                            <Key className="h-5 w-5 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-white">{rental.vehicleType || 'Vehicle Rental'}</h3>
                            <p className="text-sm text-white/50">Ref: {rental.bookingReference}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(rental.status)} border`}>
                          {rental.status}
                        </Badge>
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-amber-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-white/50 mb-1">Pickup Location</p>
                            <p className="text-white">{rental.pickupAddress || rental.fromLocation}</p>
                          </div>
                        </div>
                        {rental.rentalDuration && (
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-amber-400" />
                            <div>
                              <p className="text-xs text-white/50 mb-1">Duration</p>
                              <p className="text-white">{rental.rentalDuration} hours</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-white/60 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(rental.departureDate)} at {formatTime(rental.departureDate)}
                        </div>
                        {rental.vehicleNumber && (
                          <div className="px-2 py-1 bg-white/10 rounded text-xs">
                            {rental.vehicleNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-white/50 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-white">₹{parseFloat(rental.totalAmount).toLocaleString()}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-white/20 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-trips/booking/${rental.id}`);
                        }}
                        data-testid={`button-view-${rental.id}`}
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <Key className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No rentals found</h3>
            <p className="text-white/60">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't booked any vehicle rentals yet"}
            </p>
          </div>
        )}

        {sortedRentals.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}
