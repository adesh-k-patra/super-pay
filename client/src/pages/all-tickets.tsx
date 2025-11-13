import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Plus,
  Plane, 
  Bus, 
  Train, 
  Film, 
  Calendar,
  Hotel,
  Car,
  Navigation,
  Ticket as TicketIcon,
  Clock,
  Search,
  MapPin,
  Building,
  LayoutGrid,
  Trophy
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type BookingType = 'all' | 'hotels' | 'events' | 'taxi' | 'flights' | 'rentals' | 'trains' | 'movie' | 'metro' | 'bus' | 'tripnow' | 'marathons';
type BookingStatus = 'all' | 'active' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  type: 'hotels' | 'events' | 'taxi' | 'flights' | 'rentals' | 'trains' | 'movie' | 'metro' | 'bus' | 'tripnow' | 'marathons';
  from?: string;
  to?: string;
  title?: string;
  date: string;
  time: string;
  status: 'active' | 'completed' | 'cancelled';
  bookingId: string;
  location?: string;
  seats?: string;
  price?: number;
  serviceName?: string;
}

// Mock data - in production, fetch from API
const mockBookings: Booking[] = [
  {
    id: "1",
    type: "flights",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    date: "2025-01-20",
    time: "14:30",
    status: "active",
    bookingId: "FL123456",
    seats: "2A, 2B",
    price: 8500,
    serviceName: "Air India AI-860"
  },
  {
    id: "2",
    type: "movie",
    title: "Inception",
    location: "PVR Cinemas, Connaught Place",
    date: "2025-01-18",
    time: "19:00",
    status: "active",
    bookingId: "MV789012",
    seats: "E5, E6",
    price: 600
  },
  {
    id: "3",
    type: "bus",
    from: "Bangalore",
    to: "Chennai",
    date: "2025-01-15",
    time: "22:00",
    status: "completed",
    bookingId: "BS345678",
    seats: "12, 13",
    price: 1200,
    serviceName: "VRL Travels"
  },
  {
    id: "4",
    type: "metro",
    from: "Rajiv Chowk",
    to: "Noida Sector 18",
    date: "2025-01-10",
    time: "09:15",
    status: "completed",
    bookingId: "MT901234",
    seats: "1",
    price: 60
  },
  {
    id: "5",
    type: "hotels",
    title: "Taj Hotel, Mumbai",
    location: "Colaba, Mumbai",
    date: "2025-02-05",
    time: "14:00",
    status: "active",
    bookingId: "HT456789",
    price: 12000,
    serviceName: "Deluxe Room"
  },
  {
    id: "6",
    type: "trains",
    from: "Mumbai Central",
    to: "Ahmedabad",
    date: "2025-01-25",
    time: "06:30",
    status: "active",
    bookingId: "TR234567",
    seats: "A1-23, A1-24",
    price: 1800,
    serviceName: "Shatabdi Express"
  },
  {
    id: "7",
    type: "taxi",
    from: "Airport",
    to: "Home",
    date: "2025-01-12",
    time: "18:45",
    status: "completed",
    bookingId: "TX890123",
    price: 450,
    serviceName: "Uber Premium"
  },
  {
    id: "8",
    type: "events",
    title: "Sunburn Festival",
    location: "Goa",
    date: "2025-02-20",
    time: "16:00",
    status: "active",
    bookingId: "EV567890",
    seats: "GA-001, GA-002",
    price: 5000
  },
  {
    id: "9",
    type: "rentals",
    title: "Honda City",
    location: "Delhi",
    date: "2025-01-30",
    time: "10:00",
    status: "active",
    bookingId: "RN123890",
    price: 3500,
    serviceName: "3 Days Rental"
  },
  {
    id: "10",
    type: "flights",
    from: "Bangalore (BLR)",
    to: "Goa (GOI)",
    date: "2024-12-28",
    time: "11:20",
    status: "cancelled",
    bookingId: "FL987654",
    seats: "15A",
    price: 4200,
    serviceName: "IndiGo 6E-365"
  },
  {
    id: "11",
    type: "marathons",
    title: "Mumbai Marathon 2025",
    location: "Mumbai, Maharashtra",
    date: "2025-01-15",
    time: "06:00",
    status: "active",
    bookingId: "MA123456",
    price: 2500,
    serviceName: "Full Marathon 42.2 km"
  },
  {
    id: "12",
    type: "marathons",
    title: "Delhi Half Marathon",
    location: "New Delhi",
    date: "2024-11-30",
    time: "07:00",
    status: "completed",
    bookingId: "MA789012",
    price: 1500,
    serviceName: "Half Marathon 21.1 km"
  }
];

export default function AllTickets() {
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState<BookingType>("all");
  const [activeStatusTab, setActiveStatusTab] = useState<BookingStatus>("all");

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') as BookingType;
    const statusParam = params.get('status') as BookingStatus;
    
    if (typeParam && ['all', 'hotels', 'events', 'taxi', 'flights', 'rentals', 'trains', 'movie', 'metro', 'bus', 'tripnow', 'marathons'].includes(typeParam)) {
      setActiveTypeTab(typeParam);
    }
    if (statusParam && ['all', 'active', 'completed', 'cancelled'].includes(statusParam)) {
      setActiveStatusTab(statusParam);
    }
  }, [location]);

  const bookingTypes = [
    { value: 'all' as BookingType, label: 'All', emoji: '📋' },
    { value: 'tripnow' as BookingType, label: 'Trip Now', emoji: '🌍' },
    { value: 'marathons' as BookingType, label: 'Marathons', emoji: '🏃' },
    { value: 'hotels' as BookingType, label: 'Hotels', emoji: '🏨' },
    { value: 'events' as BookingType, label: 'Events', emoji: '🎉' },
    { value: 'taxi' as BookingType, label: 'Taxi', emoji: '🚕' },
    { value: 'flights' as BookingType, label: 'Flights', emoji: '✈️' },
    { value: 'rentals' as BookingType, label: 'Rentals', emoji: '🚗' },
    { value: 'trains' as BookingType, label: 'Trains', emoji: '🚆' },
    { value: 'movie' as BookingType, label: 'Movie', emoji: '🎬' },
    { value: 'metro' as BookingType, label: 'Metro', emoji: '🚇' },
    { value: 'bus' as BookingType, label: 'Bus', emoji: '🚌' }
  ];

  const getBookingIcon = (type: Booking['type']) => {
    const icons = {
      hotels: '🏨',
      events: '🎉',
      taxi: '🚕',
      flights: '✈️',
      rentals: '🚗',
      trains: '🚆',
      movie: '🎬',
      metro: '🚇',
      bus: '🚌',
      tripnow: '🌍',
      marathons: '🏃'
    };
    return icons[type] || '🎫';
  };

  const getBookingTypeLabel = (type: Booking['type']) => {
    return bookingTypes.find(t => t.value === type)?.label || type;
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-400 border-green-400/20 rounded-none text-[10px]">Active</Badge>;
      case 'completed':
        return <Badge className="bg-white/10 text-white/40 border-white/20 rounded-none text-[10px]">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/30 rounded-none text-[10px]">Cancelled</Badge>;
    }
  };

  // Filter bookings
  const filteredBookings = mockBookings.filter(booking => {
    const matchesType = activeTypeTab === 'all' || booking.type === activeTypeTab;
    const matchesStatus = activeStatusTab === 'all' || booking.status === activeStatusTab;
    const matchesSearch = 
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const pagination = usePagination({
    data: filteredBookings,
    itemsPerPage: 10,
  });

  // Stats
  const stats = {
    total: mockBookings.length,
    active: mockBookings.filter(b => b.status === 'active').length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
    cancelled: mockBookings.filter(b => b.status === 'cancelled').length
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <button
      onClick={() => navigate(`/ticket-detail/${booking.id}`)}
      className="w-full p-5 border border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left"
      data-testid={`booking-${booking.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-3xl flex-shrink-0">{getBookingIcon(booking.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <h3 className="font-light tracking-wider text-sm text-white">
                  {booking.title || `${booking.from} → ${booking.to}`}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-white/50 font-light">
                  {format(new Date(booking.date), "dd MMM yyyy")} • {booking.time}
                </span>
                {booking.serviceName && (
                  <>
                    <span className="text-white/30">•</span>
                    <span className="text-white/40 font-light">{booking.serviceName}</span>
                  </>
                )}
              </div>
              {booking.location && (
                <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booking.location}
                </p>
              )}
              {booking.seats && (
                <div className="mt-1 text-xs text-white/50 font-light">
                  Seats: {booking.seats}
                </div>
              )}
            </div>
          </div>
          
          {booking.price && (
            <div className="text-right flex-shrink-0 ml-3">
              <p className="font-light text-base text-white" data-testid={`text-price-${booking.id}`}>
                ₹{booking.price.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/30 font-light">
            ID: {booking.bookingId}
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-6">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            onClick={() => navigate("/pro-tools")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider">MY BOOKINGS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All your tickets</p>
          </div>
          <Button
            onClick={() => navigate("/booking")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-new-booking"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20">
        {/* Search Bar */}
        <div className="mb-6 px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search-bookings"
            />
          </div>
        </div>

        {/* Icon-based Tab Navigation */}
        <Tabs value={activeTypeTab} onValueChange={(v) => setActiveTypeTab(v as BookingType)}>
          <div className="sticky top-[85px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 overflow-x-auto">
            <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto">
              {bookingTypes.map((type) => {
                return (
                  <TabsTrigger 
                    key={type.value}
                    value={type.value}
                    className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                    data-testid={`tab-type-${type.value}`}
                  >
                    <span className="text-lg">{type.emoji}</span>
                    <span>{type.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value={activeTypeTab} className="mt-0 px-4 py-6">
            {/* Status Filter */}
            <div className="mb-6">
              <Tabs value={activeStatusTab} onValueChange={(v) => setActiveStatusTab(v as BookingStatus)}>
                <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="tab-status-all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="active" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="tab-status-active"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="tab-status-completed"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cancelled" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="tab-status-cancelled"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Booking List */}
            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl text-center">
                  <TicketIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-white mb-2">No bookings found</h3>
                  <p className="text-white/60 font-light mb-4">
                    {searchTerm ? "Try adjusting your search" : "Start booking your next trip"}
                  </p>
                  <Button
                    onClick={() => navigate("/booking")}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
                    data-testid="button-book-now"
                  >
                    Book Now
                  </Button>
                </div>
              ) : (
                <>
                  {pagination.paginatedData.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </>
              )}

              {filteredBookings.length > 0 && pagination.totalPages > 1 && (
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                  canGoNext={pagination.canGoNext}
                  canGoPrevious={pagination.canGoPrevious}
                  startIndex={pagination.startIndex}
                  endIndex={pagination.endIndex}
                  totalItems={pagination.totalItems}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
