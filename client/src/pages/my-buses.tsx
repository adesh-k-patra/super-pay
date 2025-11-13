import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, Search, Calendar, MapPin, Clock, Users, ArrowRight, ArrowLeft } from "lucide-react";
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

export default function MyBuses() {
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
        title: "Error loading buses",
        description: "Failed to fetch bus bookings. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const allBookings = bookingsData?.bookings || [];
  const buses = allBookings.filter(b => b.serviceType === 'bus');

  const filteredBuses = buses.filter(booking => {
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.bookingReference?.toLowerCase().includes(query) ||
        booking.fromLocation.toLowerCase().includes(query) ||
        booking.toLocation.toLowerCase().includes(query) ||
        booking.operatorName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (sortBy === "date") return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
    if (sortBy === "price-low") return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
    if (sortBy === "price-high") return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
    return 0;
  });

  const pagination = usePagination({
    data: sortedBuses,
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
            <div className="p-3 bg-white/10 border border-white/20 rounded-none">
              <Bus className="h-8 w-8 text-white" strokeWidth={1} />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white tracking-wider uppercase">My Buses</h1>
              <p className="text-white/60 text-xs uppercase tracking-widest font-light">{buses.length} bus{buses.length !== 1 ? 'es' : ''} found</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-none mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" strokeWidth={1} />
              <Input
                placeholder="Search by PNR, location, or operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-none"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white rounded-none" data-testid="select-status">
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
                <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white rounded-none" data-testid="select-sort">
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
              <div key={i} className="bg-white/5 border border-white/10 rounded-none p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-white/10 rounded-none w-1/3"></div>
                  <div className="h-8 bg-white/10 rounded-none"></div>
                </div>
              </div>
            ))}
          </div>
        ) : pagination.paginatedData.length > 0 ? (
          <div className="grid gap-4">
            {pagination.paginatedData.map((bus) => (
              <div
                key={bus.id}
                className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none hover:border-white/40 transition-all cursor-pointer p-6"
                onClick={() => navigate(`/my-trips/buses/${bus.id}`)}
                data-testid={`card-bus-${bus.id}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 border border-white/20 rounded-none">
                          <Bus className="h-5 w-5 text-white/80" strokeWidth={1} />
                        </div>
                        <div>
                          <h3 className="font-light text-lg text-white">{bus.operatorName || 'Bus'}</h3>
                          <p className="text-sm text-white/50 uppercase tracking-wider">PNR: {bus.bookingReference}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(bus.status)} border rounded-none uppercase tracking-wider text-xs`}>
                        {bus.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-2xl font-light text-white">{formatTime(bus.departureDate)}</p>
                        <p className="text-white/60 flex items-center gap-1 mt-1 text-sm">
                          <MapPin className="h-3 w-3" strokeWidth={1} />
                          {bus.fromLocation}
                        </p>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white/40">
                          <div className="h-px bg-white/20 flex-1"></div>
                          <Clock className="h-4 w-4" strokeWidth={1} />
                          <div className="h-px bg-white/20 flex-1"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-light text-white">{bus.arrivalTime || formatTime(bus.departureDate)}</p>
                        <p className="text-white/60 flex items-center gap-1 mt-1 text-sm">
                          <MapPin className="h-3 w-3" strokeWidth={1} />
                          {bus.toLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" strokeWidth={1} />
                        {formatDate(bus.departureDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" strokeWidth={1} />
                        {bus.totalPassengers} Passenger{bus.totalPassengers !== 1 ? 's' : ''}
                      </div>
                      {bus.seatClass && (
                        <div className="px-2 py-1 bg-white/10 rounded-none text-xs uppercase tracking-wider">
                          {bus.seatClass}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-white/50 mb-1 uppercase tracking-wider">Total Amount</p>
                      <p className="text-2xl font-light text-white">₹{parseFloat(bus.totalAmount).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white rounded-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/my-trips/booking/${bus.id}`);
                      }}
                      data-testid={`button-view-${bus.id}`}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {sortedBuses.length > 0 && (
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

        {sortedBuses.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-none p-12 text-center">
            <Bus className="h-16 w-16 text-white/20 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-light text-white mb-2">No buses found</h3>
            <p className="text-white/60">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't booked any buses yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
