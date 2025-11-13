import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Car,
  Bike,
  Calendar,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  CircleDot,
  Loader2,
  Eye,
  EyeOff,
  Bus
} from "lucide-react";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface RentalBooking {
  id: string;
  bookingReference: string;
  vehicleId: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: Date;
  dropoffDate: Date;
  totalAmount: string;
  securityDeposit: string;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

interface RentalVehicle {
  id: string;
  vehicleName: string;
  vehicleType: string;
  brand: string;
  model: string;
  city: string;
}

interface RentalLocation {
  id: string;
  locationName: string;
  city: string;
}

export default function MyRentalBookings() {
  const [, navigate] = useLocation();
  const [depositVisible, setDepositVisible] = useState(true);

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/rental/bookings"],
  });

  const { data: vehiclesData } = useQuery({
    queryKey: ["/api/rental/vehicles"],
  });

  const { data: locationsData } = useQuery({
    queryKey: ["/api/rental/locations"],
  });

  const bookings = ((bookingsData as any)?.bookings || []) as RentalBooking[];
  const vehicles = ((vehiclesData as any)?.vehicles || []) as RentalVehicle[];
  const locations = ((locationsData as any)?.locations || []) as RentalLocation[];

  const getVehicle = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getLocation = (locationId: string) => {
    return locations.find(l => l.id === locationId);
  };

  const activeBookings = bookings.filter(b => 
    b.status === "confirmed" || b.status === "ongoing"
  );
  
  const completedBookings = bookings.filter(b => 
    b.status === "completed"
  );
  
  const cancelledBookings = bookings.filter(b => 
    b.status === "cancelled"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'ongoing':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'completed':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'cancelled':
        return 'bg-white/10 text-white/80 border-white/20';
      default:
        return 'bg-white/20 text-white border-white/50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'pending':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'failed':
        return 'bg-white/10 text-white/80 border-white/20';
      default:
        return 'bg-white/20 text-white border-white/50';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="h-5 w-5" />;
      case 'bike': return <Bike className="h-5 w-5" />;
      case 'traveller': return <Bus className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const calculateDays = (pickup: Date, dropoff: Date) => {
    const days = Math.ceil((new Date(dropoff).getTime() - new Date(pickup).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

  const renderBookingCard = (booking: RentalBooking) => {
    const vehicle = getVehicle(booking.vehicleId);
    const pickupLocation = getLocation(booking.pickupLocationId);
    const dropoffLocation = getLocation(booking.dropoffLocationId);
    if (!vehicle) return null;

    const days = calculateDays(booking.pickupDate, booking.dropoffDate);

    return (
      <Card 
        key={booking.id} 
        className="bg-white/5 border border-white/10 rounded-none"
        data-testid={`card-booking-${booking.id}`}
      >
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Booking Reference</p>
              <p className="text-lg font-bold font-mono">{booking.bookingReference}</p>
            </div>
            <Badge className={`${getStatusColor(booking.status)} border rounded-none text-xs`}>
              {booking.status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-white/60 flex items-center justify-center flex-shrink-0">
              {getVehicleIcon(vehicle.vehicleType)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{vehicle.vehicleName}</h3>
              <p className="text-sm text-white/60">
                {vehicle.brand} {vehicle.model}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm bg-white/5 p-3 rounded-none">
            <div>
              <div className="flex items-center gap-1 text-white/50 mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Pickup</span>
              </div>
              <p className="font-semibold">
                {format(new Date(booking.pickupDate), "dd MMM yyyy")}
              </p>
              <p className="text-xs text-white/60">
                {format(new Date(booking.pickupDate), "h:mm a")}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-white/50 mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Dropoff</span>
              </div>
              <p className="font-semibold">
                {format(new Date(booking.dropoffDate), "dd MMM yyyy")}
              </p>
              <p className="text-xs text-white/60">
                {format(new Date(booking.dropoffDate), "h:mm a")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {pickupLocation && (
              <div className="flex items-start gap-2">
                <CircleDot className="h-4 w-4 text-white/80 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-white/50">Pickup Location</p>
                  <p className="text-sm font-medium">{pickupLocation.locationName}, {pickupLocation.city}</p>
                </div>
              </div>
            )}
            {dropoffLocation && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-white/80 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-white/50">Dropoff Location</p>
                  <p className="text-sm font-medium">{dropoffLocation.locationName}, {dropoffLocation.city}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Duration</span>
              <div className="flex items-center gap-1 font-semibold">
                <Clock className="h-4 w-4" />
                {days} {days === 1 ? 'day' : 'days'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Rental Amount</span>
              <span className="text-xl font-bold text-white/80">₹{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-white/60">
                <Shield className="h-3 w-3" />
                Security Deposit
              </div>
              <span className="font-semibold text-white/80">
                {depositVisible ? `₹${booking.securityDeposit}` : '••••'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-sm font-medium">Payment Status</span>
              <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} border rounded-none text-xs`}>
                {booking.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          {booking.status === "confirmed" && (
            <div className="bg-white/5 border border-emerald-400/20 p-3 rounded-none flex items-start gap-2 text-sm">
              <CheckCircle className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-100">Booking Confirmed</p>
                <p className="text-emerald-200/80 text-xs">
                  Your vehicle is reserved and ready for pickup
                </p>
              </div>
            </div>
          )}

          {booking.status === "ongoing" && (
            <div className="bg-white/5 border border-blue-400/20 p-3 rounded-none flex items-start gap-2 text-sm">
              <Clock className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-100">Rental Ongoing</p>
                <p className="text-blue-200/80 text-xs">
                  Please return the vehicle by the dropoff date
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-white/40 pt-2 border-t border-white/10">
            Booked on {format(new Date(booking.createdAt), "dd MMM yyyy, h:mm a")}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (bookingsLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none">
          <CardContent className="p-12 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-white/80 mb-4" />
            <p className="text-lg font-medium text-white">Loading bookings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/rental-booking")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">MY RENTAL BOOKINGS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDepositVisible(!depositVisible)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-toggle-deposit"
          >
            {depositVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Car className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              RENTAL BOOKINGS
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              {bookings.length} total bookings
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 w-full h-auto p-1 rounded-none grid grid-cols-3">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-sm rounded-none"
              data-testid="tab-active"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-sm rounded-none"
              data-testid="tab-completed"
            >
              <Clock className="h-4 w-4 mr-1" />
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-sm rounded-none"
              data-testid="tab-cancelled"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancelled
            </TabsTrigger>
          </TabsList>

          {/* Active Bookings Tab */}
          <TabsContent value="active" className="space-y-3">
            {activeBookings.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <Car className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Active Bookings</h3>
                  <p className="text-white/60 mb-6">Book a vehicle rental to see it here</p>
                  <Button 
                    onClick={() => navigate("/rental-booking")} 
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-book-vehicle"
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Book Vehicle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeBookings.map(renderBookingCard)
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-3">
            {completedBookings.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Completed Bookings</h3>
                  <p className="text-white/60">Your past rentals will appear here</p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map(renderBookingCard)
            )}
          </TabsContent>

          {/* Cancelled Tab */}
          <TabsContent value="cancelled" className="space-y-3">
            {cancelledBookings.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <XCircle className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Cancelled Bookings</h3>
                  <p className="text-white/60">Cancelled bookings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
