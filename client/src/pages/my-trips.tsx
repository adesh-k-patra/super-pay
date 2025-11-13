import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import { 
  Plane, 
  Bus, 
  Train,
  Car,
  Navigation,
  Package,
  Search,
  ArrowLeft,
  ChevronRight,
  Hotel,
  Film,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Plus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { TravelBooking } from "@shared/schema";
import { cn } from "@/lib/utils";

const serviceIcons: Record<string, React.ElementType> = {
  flight: Plane,
  train: Train,
  bus: Bus,
  cab: Car,
  taxi: Car,
  metro: Navigation,
  rental: Package,
  hotel: Hotel,
  movie: Film,
  event: Ticket,
  trip: Package
};

const SERVICE_FILTERS = [
  { id: "all", label: "All", emoji: "📋" },
  { id: "trip", label: "Trip Now", emoji: "🌍" },
  { id: "bus", label: "Bus", emoji: "🚌" },
  { id: "train", label: "Train", emoji: "🚆" },
  { id: "flight", label: "Flight", emoji: "✈️" },
  { id: "taxi", label: "Taxi", emoji: "🚕" },
  { id: "rental", label: "Rental", emoji: "🚗" },
  { id: "hotel", label: "Hotel", emoji: "🏨" },
  { id: "movie", label: "Movie", emoji: "🎬" },
  { id: "event", label: "Event", emoji: "🎉" },
  { id: "metro", label: "Metro", emoji: "🚇" }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-white/10 text-white border-white/20';
    case 'pending': return 'bg-white/5 text-white/80 border-white/10';
    case 'cancelled': return 'bg-white/5 text-white/60 border-white/10';
    case 'completed': return 'bg-white/10 text-white border-white/20';
    default: return 'bg-white/5 text-white/60 border-white/10';
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

export default function MyTrips() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useUrlTab("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [tripFilter, setTripFilter] = useState("all");

  const { data: bookingsData, isLoading } = useQuery<{ bookings: (TravelBooking & { passengers?: any[] })[] }>({
    queryKey: ['/api/travel/my-bookings'],
  });

  const MOCK_BOOKINGS = [
    {
      id: 1,
      bookingReference: "FL2025-001",
      serviceType: "flight",
      fromLocation: "Mumbai (BOM)",
      toLocation: "Delhi (DEL)",
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      price: 8500,
      passengers: [{ name: "John Doe", age: 32 }],
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop",
      trending: true,
      bookedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      bookingReference: "TR2025-045",
      serviceType: "train",
      fromLocation: "New Delhi",
      toLocation: "Jaipur",
      departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "confirmed",
      price: 650,
      passengers: [{ name: "Jane Smith", age: 28 }],
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=250&fit=crop",
      trending: false,
      bookedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2.5,
      bookingReference: "TRP2025-001",
      serviceType: "trip",
      fromLocation: "US West Coast Adventure",
      toLocation: "Los Angeles → San Francisco → Las Vegas",
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      price: 245000,
      passengers: [{ name: "John Doe", age: 32 }, { name: "Sarah Doe", age: 30 }],
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop",
      trending: true,
      bookedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2.6,
      bookingReference: "TRP2025-002",
      serviceType: "trip",
      fromLocation: "Romantic Paris Getaway",
      toLocation: "Paris → Versailles",
      departureDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "completed",
      price: 125000,
      passengers: [{ name: "Jane Smith", age: 28 }, { name: "Mike Brown", age: 31 }],
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      bookingReference: "BUS2025-789",
      serviceType: "bus",
      fromLocation: "Bangalore",
      toLocation: "Chennai",
      departureDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "completed",
      price: 950,
      passengers: [{ name: "Alex Kumar", age: 35 }],
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      bookingReference: "CAB2025-456",
      serviceType: "cab",
      fromLocation: "Pune Airport",
      toLocation: "Koregaon Park",
      departureDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "confirmed",
      price: 450,
      passengers: [{ name: "Sarah Lee", age: 29 }]
    },
    {
      id: 5,
      bookingReference: "HT2025-123",
      serviceType: "hotel",
      fromLocation: "Goa Beach Resort",
      toLocation: "Goa Beach Resort",
      departureDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      price: 12500,
      passengers: [{ name: "Mike Wilson", age: 42 }, { name: "Emily Wilson", age: 38 }],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      bookingReference: "MV2025-789",
      serviceType: "movie",
      fromLocation: "PVR Cinemas",
      toLocation: "PVR Cinemas Phoenix",
      departureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "confirmed",
      price: 1200,
      passengers: [{ name: "David Brown", age: 26 }],
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop"
    },
    {
      id: 7,
      bookingReference: "EV2025-234",
      serviceType: "event",
      fromLocation: "National Stadium",
      toLocation: "National Stadium",
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "confirmed",
      price: 2500,
      passengers: [{ name: "Lisa Anderson", age: 31 }],
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop"
    },
    {
      id: 8,
      bookingReference: "MT2025-567",
      serviceType: "metro",
      fromLocation: "Rajiv Chowk",
      toLocation: "Connaught Place",
      departureDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "completed",
      price: 40,
      passengers: [{ name: "Raj Patel", age: 24 }]
    },
    {
      id: 9,
      bookingReference: "RN2025-890",
      serviceType: "rental",
      fromLocation: "Bangalore Car Rentals",
      toLocation: "Mysore",
      departureDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      price: 3500,
      passengers: [{ name: "Priya Sharma", age: 30 }]
    },
    {
      id: 10,
      bookingReference: "FL2025-999",
      serviceType: "flight",
      fromLocation: "Kolkata (CCU)",
      toLocation: "Mumbai (BOM)",
      departureDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "completed",
      price: 7800,
      passengers: [{ name: "Amit Gupta", age: 45 }]
    },
    {
      id: 11,
      bookingReference: "TR2025-111",
      serviceType: "train",
      fromLocation: "Chennai Central",
      toLocation: "Bangalore City",
      departureDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      returnDate: null,
      status: "cancelled",
      price: 580,
      passengers: [{ name: "Neha Reddy", age: 27 }]
    }
  ];

  const bookings = bookingsData?.bookings && bookingsData.bookings.length > 0 
    ? bookingsData.bookings 
    : MOCK_BOOKINGS as any;

  const filteredBookings = bookings.filter((booking: any) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      booking.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Service filter
    if (serviceFilter !== "all") {
      const normalizedService = booking.serviceType.toLowerCase();
      const normalizedFilter = serviceFilter.toLowerCase();
      
      if (normalizedFilter === "taxi" && normalizedService !== "cab" && normalizedService !== "taxi") {
        return false;
      } else if (normalizedFilter !== "taxi" && normalizedService !== normalizedFilter) {
        return false;
      }
    }

    // Status/Tab filter
    const departureDate = new Date(booking.departureDate);
    const now = new Date();
    
    if (activeTab === "active") {
      return booking.status === 'confirmed' && departureDate > now;
    }
    
    if (activeTab === "completed") {
      return booking.status === 'completed' || booking.status === 'cancelled' || 
             (booking.status === 'confirmed' && departureDate <= now);
    }
    
    return true;
  });

  // Pagination calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedBookings = filteredBookings.slice(startIndex - 1, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, serviceFilter]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider" data-testid="page-title">MY TRIPS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Bookings & Travel</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-add-booking"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-xl mx-auto">
        {/* Search Box */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-4 border border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm px-6 py-4 hover:border-white/30 transition-all duration-300">
            <Search className="h-5 w-5 text-white/60 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips, locations, or services..."
              className="flex-1 bg-transparent text-white text-base placeholder:text-white/40 focus:outline-none font-light tracking-wide"
              data-testid="input-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex-shrink-0 text-white/50 hover:text-white transition-colors"
                data-testid="button-clear-search"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            )}
          </div>
        </div>

        {/* Main Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-all"
            >
              ALL
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-active"
            >
              ACTIVE
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-completed"
            >
              COMPLETED
            </TabsTrigger>
          </TabsList>

          {/* Service Type Filter */}
          <Tabs value={serviceFilter} onValueChange={setServiceFilter} className="mt-4">
            <div className="sticky top-[85px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 overflow-x-auto">
              <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto px-4">
                {SERVICE_FILTERS.map((service) => {
                  return (
                    <TabsTrigger 
                      key={service.id}
                      value={service.id}
                      className="flex flex-col items-center gap-1.5 pb-3 px-4 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                      data-testid={`tab-filter-${service.id}`}
                    >
                      <span className="text-lg">{service.emoji}</span>
                      <span>{service.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </Tabs>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-white/10 w-1/2"></div>
                        <div className="h-8 bg-white/10"></div>
                        <div className="h-4 bg-white/10 w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedBookings.map((booking: any) => {
                    const Icon = serviceIcons[booking.serviceType] || Plane;
                    const getBookingRoute = (booking: any) => {
                      switch (booking.serviceType) {
                        case 'trip':
                          if (booking.id === 2.5) return '/trip-detail/us-west-coast';
                          if (booking.id === 2.6) return '/trip-detail/romantic-paris';
                          return `/trip/${booking.id}`;
                        case 'flight':
                          return '/booking/flight/search';
                        case 'bus':
                          return '/booking/bus/search';
                        case 'train':
                          return '/booking/train/search';
                        case 'hotel':
                          return '/booking/hotel/search';
                        case 'movie':
                          return '/booking/movie/search';
                        case 'event':
                          return '/booking/event/search';
                        case 'cab':
                        case 'taxi':
                          return '/booking/cab';
                        case 'metro':
                          return '/metro-booking';
                        case 'rental':
                          return '/rental-booking';
                        default:
                          return `/ticket-detail/${booking.id}`;
                      }
                    };
                    return (
                      <div
                        key={booking.id}
                        onClick={() => navigate(`/ticket-detail/${booking.id}`)}
                        className="group border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:border-white/30 transition-all cursor-pointer overflow-hidden"
                        data-testid={`card-booking-${booking.id}`}
                      >
                        {/* Image Header */}
                        {(booking as any).image && (
                          <div className="relative overflow-hidden h-40">
                            <img 
                              src={(booking as any).image} 
                              alt={booking.serviceType}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <Badge className={`${getStatusColor(booking.status)} rounded-none border text-xs`}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                              <div className="p-1.5 bg-white/20 backdrop-blur-sm border border-white/20">
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-light text-white tracking-wider uppercase text-xs">{booking.serviceType}</h3>
                                <p className="text-[10px] text-white/70">{booking.bookingReference}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-light text-white truncate">{booking.fromLocation}</p>
                              <p className="text-xs text-white/50">{formatTime(booking.departureDate)}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-white/30 mx-2 flex-shrink-0" />
                            <div className="text-right flex-1 min-w-0">
                              <p className="text-base font-light text-white truncate">{booking.toLocation}</p>
                              <p className="text-xs text-white/50">{booking.arrivalTime || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-white/60 pt-2 border-t border-white/10">
                            <Calendar className="h-3 w-3" />
                            <span className="font-light text-xs">{formatDate(booking.departureDate)}</span>
                          </div>

                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-xs text-white/50">Total Amount</p>
                                <p className="text-lg font-light text-white">₹{booking.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-white text-black rounded-none hover:bg-white/90 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/ticket-detail/${booking.id}`);
                                }}
                                data-testid={`button-view-ticket-${booking.id}`}
                              >
                                View Tickets
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-white/20 text-white rounded-none hover:bg-white/10 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(getBookingRoute(booking));
                                }}
                                data-testid={`button-view-details-${booking.id}`}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {filteredBookings.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  canGoNext={currentPage < totalPages}
                  canGoPrevious={currentPage > 1}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={totalItems}
                  className="mt-8"
                />
              )}

              {filteredBookings.length === 0 && (
                <div className="border border-white/20 p-12 text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
                  <Clock className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No trips found</h3>
                  <p className="text-white/60 mb-6">
                    {searchQuery ? "Try adjusting your search query" : 
                     serviceFilter !== "all" ? "No bookings found for this service" :
                     activeTab === "active" ? "You don't have any active bookings" :
                     activeTab === "completed" ? "You don't have any completed bookings" :
                     "Start booking your next journey"}
                  </p>
                  <Button
                    onClick={() => navigate("/home")}
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-book-trip"
                  >
                    Book a Trip
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
