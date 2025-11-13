import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  Plane, 
  Bus, 
  Train,
  Car,
  Navigation,
  Package,
  Search,
  Calendar,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  X,
  Clock,
  CheckCircle2,
  Grid3x3,
  List,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { TravelBooking } from "@shared/schema";
import { useState } from "react";

interface TravelListProps {
  serviceType: "flight" | "train" | "bus" | "cab" | "metro" | "rental";
}

const serviceConfig = {
  flight: {
    title: "Flight Bookings",
    icon: Plane,
    color: "text-white/80",
    bgColor: "bg-white/5",
    borderColor: "border-blue-400/20",
  },
  train: {
    title: "Train Bookings",
    icon: Train,
    color: "text-white/80",
    bgColor: "bg-white/5",
    borderColor: "border-white/20/20",
  },
  bus: {
    title: "Bus Bookings",
    icon: Bus,
    color: "text-white/80",
    bgColor: "bg-white/5",
    borderColor: "border-orange-400/20",
  },
  cab: {
    title: "Cab Bookings",
    icon: Car,
    color: "text-white/80",
    bgColor: "bg-white/5",
    borderColor: "border-white/20/20",
  },
  metro: {
    title: "Metro Bookings",
    icon: Navigation,
    color: "text-white/80",
    bgColor: "bg-white/5",
    borderColor: "border-purple-400/20",
  },
  rental: {
    title: "Rental Bookings",
    icon: Package,
    color: "text-white/80",
    bgColor: "bg-white/10/10",
    borderColor: "border-pink-400/20",
  },
};

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-white/10 text-white/80 border-white/20';
    case 'pending': return 'bg-white/10 text-white/80 border-white/20';
    case 'cancelled': return 'bg-white/10 text-white/80 border-white/20';
    case 'completed': return 'bg-white/10 text-white/80 border-white/20';
    default: return 'bg-white/10 text-white/80 border-white/20';
  }
}

function formatDate(dateString: Date | string | null) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateString: Date | string | null) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function calculateDuration(departureTime: string | null, arrivalTime: string | null): string {
  if (!departureTime || !arrivalTime) return 'N/A';
  
  // Parse times as HH:MM
  const [depHour, depMin] = departureTime.split(':').map(Number);
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
  
  // Calculate total minutes
  const depTotalMin = depHour * 60 + depMin;
  const arrTotalMin = arrHour * 60 + arrMin;
  
  // Calculate difference (handle next day arrival)
  let diffMin = arrTotalMin - depTotalMin;
  if (diffMin < 0) diffMin += 24 * 60; // Next day
  
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;
  return `${hours}h ${minutes}m`;
}

function calculateArrivalDate(departureDate: Date | string | null, departureTime: string | null, arrivalTime: string | null): Date | null {
  if (!departureDate || !departureTime || !arrivalTime) return null;
  
  const depDate = new Date(departureDate);
  const [depHour, depMin] = departureTime.split(':').map(Number);
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
  
  const depTotalMin = depHour * 60 + depMin;
  const arrTotalMin = arrHour * 60 + arrMin;
  
  // If arrival time is less than departure time, it's the next day
  const arrivalDate = new Date(depDate);
  if (arrTotalMin < depTotalMin) {
    arrivalDate.setDate(arrivalDate.getDate() + 1);
  }
  
  // Set the actual arrival time (hours and minutes)
  arrivalDate.setHours(arrHour, arrMin, 0, 0);
  
  return arrivalDate;
}

export default function TravelList({ serviceType }: TravelListProps) {
  const [, navigate] = useLocation();
  const config = serviceConfig[serviceType];
  const Icon = config.icon;

  // View state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [density, setDensity] = useState<'compact' | 'detailed'>('detailed');
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("departure");

  const { data: bookingsData, isLoading } = useQuery<{ bookings: (TravelBooking & { passengers?: any[] })[] }>({
    queryKey: ['/api/travel/my-bookings'],
  });

  const allBookings = bookingsData?.bookings || [];

  // Filter bookings by service type and applied filters
  const filteredBookings = allBookings
    .filter(booking => booking.serviceType === serviceType)
    .filter(booking => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          booking.fromLocation.toLowerCase().includes(query) ||
          booking.toLocation.toLowerCase().includes(query) ||
          booking.bookingReference.toLowerCase().includes(query) ||
          booking.operatorName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Price filter
      const price = parseFloat(booking.totalAmount);
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Refundable filter
      if (refundableOnly && booking.paymentStatus === 'non_refundable') return false;

      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(booking.status)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "departure") {
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      }
      if (sortBy === "price-low") {
        return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
      }
      if (sortBy === "price-high") {
        return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
      }
      if (sortBy === "duration") {
        // Parse times and calculate duration in minutes for sorting
        const getDurationMinutes = (depTime: string | null, arrTime: string | null) => {
          if (!depTime || !arrTime) return 0;
          const [depH, depM] = depTime.split(':').map(Number);
          const [arrH, arrM] = arrTime.split(':').map(Number);
          let diff = (arrH * 60 + arrM) - (depH * 60 + depM);
          if (diff < 0) diff += 24 * 60;
          return diff;
        };
        const durationA = getDurationMinutes(a.departureTime, a.arrivalTime);
        const durationB = getDurationMinutes(b.departureTime, b.arrivalTime);
        return durationA - durationB;
      }
      return 0;
    });

  const pagination = usePagination({
    data: filteredBookings,
    itemsPerPage: 10,
  });

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 100000]);
    setRefundableOnly(false);
    setSelectedStatuses([]);
    setSortBy("departure");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/my-trips")}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={`p-3 ${config.bgColor} ${config.borderColor} border`}>
                  <Icon className={`h-6 w-6 ${config.color}`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-wider" data-testid="page-title">
                    {config.title.toUpperCase()}
                  </h1>
                  <p className="text-white/60">
                    Showing {pagination.startIndex}-{pagination.endIndex} of {pagination.totalItems} bookings
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className={`border-white/20 text-white ${viewMode === 'list' ? 'bg-white/10' : ''}`}
                onClick={() => setViewMode('list')}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`border-white/20 text-white ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
                onClick={() => setViewMode('grid')}
                data-testid="button-view-grid"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card className="bg-white/5 border-white/20 sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-white/60 hover:text-white h-8"
                      data-testid="button-reset-filters"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label className="text-white">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        placeholder="Location, operator, ref..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border-white/20 text-white pl-10"
                        data-testid="input-search"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-white flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={100000}
                      step={1000}
                      className="w-full"
                      data-testid="slider-price-range"
                    />
                  </div>

                  {/* Refundable Only */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="refundable" className="text-white">
                      Refundable Only
                    </Label>
                    <Switch
                      id="refundable"
                      checked={refundableOnly}
                      onCheckedChange={setRefundableOnly}
                      data-testid="switch-refundable"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <Label className="text-white">Status</Label>
                    <div className="space-y-2">
                      {['confirmed', 'pending', 'completed', 'cancelled'].map(status => {
                        const isSelected = selectedStatuses.includes(status);
                        return (
                          <Button
                            key={status}
                            variant="outline"
                            size="sm"
                            className={`w-full justify-start ${
                              isSelected
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-white/5 border-white/20 text-white/60'
                            }`}
                            onClick={() => toggleStatus(status)}
                            data-testid={`button-filter-status-${status}`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <Label className="text-white">Sort By</Label>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start ${
                          sortBy === "departure"
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-white/5 border-white/20 text-white/60'
                        }`}
                        onClick={() => setSortBy("departure")}
                        data-testid="button-sort-departure"
                      >
                        Departure Time
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start ${
                          sortBy === "price-low"
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-white/5 border-white/20 text-white/60'
                        }`}
                        onClick={() => setSortBy("price-low")}
                        data-testid="button-sort-price-low"
                      >
                        Price: Low to High
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start ${
                          sortBy === "price-high"
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-white/5 border-white/20 text-white/60'
                        }`}
                        onClick={() => setSortBy("price-high")}
                        data-testid="button-sort-price-high"
                      >
                        Price: High to Low
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full justify-start ${
                          sortBy === "duration"
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-white/5 border-white/20 text-white/60'
                        }`}
                        onClick={() => setSortBy("duration")}
                        data-testid="button-sort-duration"
                      >
                        Duration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-white/5 border-white/20">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                        <div className="h-8 bg-white/10 rounded"></div>
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              <>
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {pagination.paginatedData.map((booking) => (
                  <Card
                    key={booking.id}
                    className="bg-white/5 border-white/20 hover:border-white/40 transition-all cursor-pointer"
                    onClick={() => navigate(`/booking/${booking.serviceType}/${booking.id}`)}
                    data-testid={`card-booking-${booking.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-lg text-white">
                              {booking.operatorName}
                            </CardTitle>
                            <Badge className={`${getStatusColor(booking.status)} border`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-white/50 text-sm">
                            {booking.bookingReference}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Route */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">{booking.fromLocation}</p>
                          <p className="text-sm text-white/60">{formatTime(booking.departureDate)}</p>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <ChevronRight className="h-5 w-5 text-white/30" />
                          <p className="text-xs text-white/50 mt-1">
                            {calculateDuration(booking.departureTime, booking.arrivalTime)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{booking.toLocation}</p>
                          <p className="text-sm text-white/60">{booking.arrivalTime || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(booking.departureDate)}</span>
                      </div>

                      {/* Details */}
                      {density === 'detailed' && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {booking.seatClass && (
                            <div>
                              <p className="text-white/40">Class</p>
                              <p className="text-white">{booking.seatClass}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-white/40">Passengers</p>
                            <p className="text-white">{booking.totalPassengers}</p>
                          </div>
                        </div>
                      )}

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <p className="text-xs text-white/50">Total Amount</p>
                          <p className="text-2xl font-bold text-white">₹{booking.totalAmount}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/booking/${booking.serviceType}/${booking.id}`);
                          }}
                          data-testid={`button-view-details-${booking.id}`}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
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
              </>
            ) : (
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 ${config.bgColor} ${config.borderColor} border`}>
                      <Icon className={`h-12 w-12 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        No {serviceType} bookings found
                      </h3>
                      <p className="text-white/60 mb-4">
                        Try adjusting your filters or book a new trip
                      </p>
                      <Button
                        onClick={() => navigate("/my-trips")}
                        className="bg-white/10 hover:bg-white/15 text-white"
                        data-testid="button-back-to-hub"
                      >
                        Back to My Trips
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
