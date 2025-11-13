import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plane, 
  Bus, 
  Train, 
  Car,
  Navigation,
  Package,
  Calendar, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Plus
} from "lucide-react";

interface Booking {
  id: string;
  type: "flight" | "bus" | "train" | "cab" | "metro" | "rental";
  reference: string;
  from: string;
  fromCode?: string;
  to: string;
  toCode?: string;
  operator: string;
  route?: string;
  date: string;
  time: string;
  duration?: string;
  passengers: number;
  amount: number;
  status: "completed" | "upcoming" | "cancelled";
  vehicleType?: string;
  vehicleNumber?: string;
  fareBreakdown: {
    baseFare: number;
    taxes: number;
    convenienceFee: number;
  };
}

const mockBookings: Booking[] = [
  {
    id: "BKG-2024-001234",
    type: "flight",
    reference: "BKG-2024-001234",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Delhi",
    toCode: "DEL",
    operator: "IndiGo",
    route: "6E-234",
    date: "2024-12-15",
    time: "06:00",
    duration: "2h 30m",
    passengers: 1,
    amount: 4500,
    status: "upcoming",
    fareBreakdown: {
      baseFare: 3800,
      taxes: 550,
      convenienceFee: 150
    }
  },
  {
    id: "BKG-2024-001200",
    type: "cab",
    reference: "BKG-2024-001200",
    from: "Airport",
    to: "Home",
    operator: "Ola",
    date: "2024-10-25",
    time: "14:30",
    duration: "45m",
    passengers: 2,
    amount: 450,
    status: "completed",
    vehicleType: "Sedan",
    vehicleNumber: "MH 02 AB 1234",
    fareBreakdown: {
      baseFare: 380,
      taxes: 50,
      convenienceFee: 20
    }
  },
  {
    id: "BKG-2024-001180",
    type: "rental",
    reference: "BKG-2024-001180",
    from: "Mumbai",
    to: "Pune",
    operator: "Zoomcar",
    date: "2024-10-20",
    time: "08:00",
    duration: "24h",
    passengers: 4,
    amount: 2800,
    status: "completed",
    vehicleType: "SUV",
    vehicleNumber: "MH 01 CD 5678",
    fareBreakdown: {
      baseFare: 2400,
      taxes: 300,
      convenienceFee: 100
    }
  },
  {
    id: "BKG-2024-001123",
    type: "train",
    reference: "BKG-2024-001123",
    from: "Delhi",
    fromCode: "NDLS",
    to: "Kolkata",
    toCode: "HWH",
    operator: "Indian Railways",
    route: "Rajdhani Express",
    date: "2024-11-28",
    time: "16:35",
    duration: "17h 10m",
    passengers: 2,
    amount: 6800,
    status: "completed",
    fareBreakdown: {
      baseFare: 6200,
      taxes: 450,
      convenienceFee: 150
    }
  },
  {
    id: "BKG-2024-001089",
    type: "bus",
    reference: "BKG-2024-001089",
    from: "Bangalore",
    fromCode: "BLR",
    to: "Chennai",
    toCode: "CHN",
    operator: "VRL Travels",
    route: "VRL-456",
    date: "2024-10-22",
    time: "23:30",
    duration: "6h 45m",
    passengers: 1,
    amount: 1200,
    status: "completed",
    fareBreakdown: {
      baseFare: 1050,
      taxes: 100,
      convenienceFee: 50
    }
  },
  {
    id: "BKG-2024-000987",
    type: "flight",
    reference: "BKG-2024-000987",
    from: "Chennai",
    fromCode: "MAA",
    to: "Mumbai",
    toCode: "BOM",
    operator: "Air India",
    route: "AI-671",
    date: "2024-09-18",
    time: "14:20",
    duration: "1h 55m",
    passengers: 1,
    amount: 5200,
    status: "cancelled",
    fareBreakdown: {
      baseFare: 4500,
      taxes: 600,
      convenienceFee: 100
    }
  },
  {
    id: "BKG-2024-000950",
    type: "metro",
    reference: "BKG-2024-000950",
    from: "Central Station",
    to: "Airport",
    operator: "Delhi Metro",
    route: "Blue Line",
    date: "2024-10-15",
    time: "09:00",
    duration: "35m",
    passengers: 1,
    amount: 60,
    status: "completed",
    fareBreakdown: {
      baseFare: 50,
      taxes: 5,
      convenienceFee: 5
    }
  }
];

export default function TravelBookings() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useUrlTab("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(new Set());

  const toggleBookingExpanded = (bookingId: string) => {
    setExpandedBookings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const getTypeIcon = (type: Booking["type"]) => {
    switch (type) {
      case "flight": return <Plane className="h-4 w-4" />;
      case "bus": return <Bus className="h-4 w-4" />;
      case "train": return <Train className="h-4 w-4" />;
      case "cab": return <Car className="h-4 w-4" />;
      case "metro": return <Navigation className="h-4 w-4" />;
      case "rental": return <Package className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-white/80" />;
      case "upcoming": return <AlertCircle className="h-4 w-4 text-white/80" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-white/80" />;
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "completed": return "bg-white/5 text-white/80 border-white/20/20";
      case "upcoming": return "bg-white/5 text-white/80 border-blue-400/20";
      case "cancelled": return "bg-white/5 text-white/80 border-white/20/20";
    }
  };

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = activeTab === "all" || booking.status === activeTab;
    const matchesService = serviceFilter === "all" || booking.type === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const pagination = usePagination({
    data: filteredBookings,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
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
              <div>
                <h1 className="text-3xl font-bold tracking-wider" data-testid="page-title">
                  MY BOOKINGS
                </h1>
                <p className="text-white/60">Manage your travel bookings and tickets</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/my-trips")}
              className="bg-white/10 hover:bg-white/15 text-white rounded-none"
              data-testid="button-new-booking"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination or booking reference"
                className="bg-black border-white/20 text-white pl-10 rounded-none"
                data-testid="input-search"
              />
            </div>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px] bg-black border-white/20 text-white rounded-none" data-testid="select-service-filter">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="cab">Cab</SelectItem>
                <SelectItem value="metro">Metro</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-black border border-white/20 rounded-none p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-all">
              All ({mockBookings.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-upcoming">
              Upcoming ({mockBookings.filter(b => b.status === "upcoming").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-completed">
              Completed ({mockBookings.filter(b => b.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none" data-testid="tab-cancelled">
              Cancelled ({mockBookings.filter(b => b.status === "cancelled").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredBookings.length === 0 ? (
              <Card className="bg-black border-white/20 rounded-none">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-white/40" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
                      <p className="text-white/60 mb-4">
                        {searchQuery || serviceFilter !== "all" 
                          ? "Try adjusting your filters" 
                          : "You haven't made any bookings yet"}
                      </p>
                      <Button
                        onClick={() => navigate("/my-trips")}
                        className="bg-white/10 hover:bg-white/15 text-white rounded-none"
                        data-testid="button-new-booking-empty"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pagination.paginatedData.map((booking) => (
                  <Card 
                    key={booking.id} 
                    className="bg-black border-white/20 rounded-none hover:border-white/40 transition-colors"
                    data-testid={`booking-card-${booking.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 border border-blue-400/20 rounded-none">
                            {getTypeIcon(booking.type)}
                          </div>
                          <div>
                            <p className="text-sm text-white/60 uppercase tracking-wider">
                              {booking.type} • {booking.reference}
                            </p>
                            <p className="text-white font-medium">
                              {booking.operator} {booking.route && `- ${booking.route}`}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          className={`${getStatusColor(booking.status)} rounded-none border`}
                          data-testid={`status-${booking.status}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        {/* Route */}
                        <div className="md:col-span-2">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-xl font-bold text-white">{booking.time}</p>
                              <p className="text-sm text-white/60">{booking.from}</p>
                              {booking.fromCode && <p className="text-xs text-white/40">{booking.fromCode}</p>}
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="flex items-center text-white/60">
                                <div className="flex-1 border-t border-white/20"></div>
                                {booking.duration && (
                                  <div className="px-3 text-xs">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {booking.duration}
                                  </div>
                                )}
                                <div className="flex-1 border-t border-white/20"></div>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold text-white">
                                {booking.duration ? "Arrival" : booking.to}
                              </p>
                              <p className="text-sm text-white/60">{booking.to}</p>
                              {booking.toCode && <p className="text-xs text-white/40">{booking.toCode}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-white/60">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(booking.date).toLocaleDateString('en-IN', { 
                              weekday: 'short', 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center text-sm text-white/60">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.passengers} Passenger{booking.passengers > 1 ? 's' : ''}
                          </div>
                          {booking.vehicleType && (
                            <p className="text-sm text-white/60">
                              Vehicle: <span className="text-white">{booking.vehicleType}</span>
                            </p>
                          )}
                          {booking.vehicleNumber && (
                            <p className="text-sm text-white/60">
                              {booking.vehicleNumber}
                            </p>
                          )}
                        </div>

                        {/* Amount and Actions */}
                        <div className="flex flex-col justify-between">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">₹{booking.amount.toLocaleString()}</p>
                            <p className="text-sm text-white/60">Total amount</p>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white rounded-none flex-1"
                              onClick={() => navigate(`/booking/${booking.id}`)}
                              data-testid={`button-view-${booking.id}`}
                            >
                              View Details
                            </Button>
                            {booking.status === "upcoming" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20/20 text-white/80 hover:bg-white/5 rounded-none flex-1"
                                onClick={() => navigate(`/booking/${booking.id}/cancel`)}
                                data-testid={`button-cancel-${booking.id}`}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Fare Breakdown */}
                      <Separator className="my-4 bg-white/10" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookingExpanded(booking.id)}
                        className="w-full text-white/60 hover:text-white rounded-none flex items-center justify-between"
                        data-testid={`button-expand-${booking.id}`}
                      >
                        <span className="text-sm">Fare Breakdown</span>
                        {expandedBookings.has(booking.id) ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>

                      {expandedBookings.has(booking.id) && (
                        <div className="mt-4 border border-white/20 p-4 rounded-none" data-testid={`fare-breakdown-${booking.id}`}>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Base Fare</span>
                              <span className="text-white">₹{booking.fareBreakdown.baseFare.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Taxes & Surcharges</span>
                              <span className="text-white">₹{booking.fareBreakdown.taxes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/60">Convenience Fee</span>
                              <span className="text-white">₹{booking.fareBreakdown.convenienceFee.toLocaleString()}</span>
                            </div>
                            <Separator className="bg-white/10 my-2" />
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-white">Total</span>
                              <span className="text-white">₹{booking.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                  onPrevious={pagination.previousPage}
                  onNext={pagination.nextPage}
                  className="mt-6"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
