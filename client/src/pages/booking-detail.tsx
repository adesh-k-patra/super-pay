import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, Download, Edit, XCircle, Clock, MapPin, 
  Users, Package, CreditCard, AlertCircle, Plane,
  Train, Bus, Car, Navigation, Key
} from "lucide-react";

type ServiceType = 'flight' | 'train' | 'bus' | 'cab' | 'metro' | 'rental';

interface BookingDetailProps {
  serviceType: ServiceType;
}

const serviceConfig = {
  flight: {
    icon: Plane,
    title: "Flight Details",
    backRoute: "/my-trips/flights",
    statusColors: {
      confirmed: "bg-white/10 text-white/80 border-white/20",
      pending: "bg-white/10 text-white/80 border-white/20",
      cancelled: "bg-white/10 text-white/80 border-white/20",
      completed: "bg-white/10 text-white/80 border-white/20"
    }
  },
  train: {
    icon: Train,
    title: "Train Details",
    backRoute: "/my-trips/trains",
    statusColors: {
      confirmed: "bg-white/10 text-white/80 border-white/20",
      pending: "bg-white/10 text-white/80 border-white/20",
      cancelled: "bg-white/10 text-white/80 border-white/20",
      completed: "bg-white/10 text-white/80 border-white/20"
    }
  },
  bus: {
    icon: Bus,
    title: "Bus Details",
    backRoute: "/my-trips/buses",
    statusColors: {
      confirmed: "bg-white/10 text-white/80 border-white/20",
      pending: "bg-white/10 text-white/80 border-white/20",
      cancelled: "bg-white/10 text-white/80 border-white/20",
      completed: "bg-white/10 text-white/80 border-white/20"
    }
  },
  cab: {
    icon: Car,
    title: "Cab Details",
    backRoute: "/my-trips/cabs",
    statusColors: {
      confirmed: "bg-white/10 text-white/80 border-white/20",
      pending: "bg-white/10 text-white/80 border-white/20",
      cancelled: "bg-white/10 text-white/80 border-white/20",
      completed: "bg-white/10 text-white/80 border-white/20"
    }
  },
  metro: {
    icon: Navigation,
    title: "Metro Details",
    backRoute: "/my-trips/metros",
    statusColors: {
      confirmed: "bg-white/10 text-white/80 border-white/20",
      pending: "bg-white/10 text-white/80 border-white/20",
      cancelled: "bg-white/10 text-white/80 border-white/20",
      completed: "bg-white/10 text-white/80 border-white/20"
    }
  },
  rental: {
    icon: Key,
    title: "Rental Details",
    backRoute: "/my-trips/rentals",
    statusColors: {
      confirmed: "bg-white/10 text-white/80 border-white/20",
      pending: "bg-white/10 text-white/80 border-white/20",
      cancelled: "bg-white/10 text-white/80 border-white/20",
      completed: "bg-white/10 text-white/80 border-white/20"
    }
  }
};

function formatDate(dateString: Date | string | null) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function calculateArrivalDate(departureDate: Date | string | null, departureTime: string | null, arrivalTime: string | null): Date | null {
  if (!departureDate || !departureTime || !arrivalTime) return null;
  
  const depDate = new Date(departureDate);
  const [depHour, depMin] = departureTime.split(':').map(Number);
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
  
  const depTotalMin = depHour * 60 + depMin;
  const arrTotalMin = arrHour * 60 + arrMin;
  
  const arrivalDate = new Date(depDate);
  if (arrTotalMin < depTotalMin) {
    arrivalDate.setDate(arrivalDate.getDate() + 1);
  }
  
  arrivalDate.setHours(arrHour, arrMin, 0, 0);
  
  return arrivalDate;
}

function calculateDuration(departureTime: string | null, arrivalTime: string | null): string {
  if (!departureTime || !arrivalTime) return 'N/A';
  
  const [depHour, depMin] = departureTime.split(':').map(Number);
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
  
  const depTotalMin = depHour * 60 + depMin;
  const arrTotalMin = arrHour * 60 + arrMin;
  
  let diffMin = arrTotalMin - depTotalMin;
  if (diffMin < 0) diffMin += 24 * 60;
  
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;
  return `${hours}h ${minutes}m`;
}

export default function BookingDetail({ serviceType }: BookingDetailProps) {
  const [, params] = useRoute("/my-trips/:type/:id");
  const [, navigate] = useLocation();
  const config = serviceConfig[serviceType];
  const Icon = config.icon;
  
  const bookingId = params?.id ? parseInt(params.id) : null;

  const { data: booking, isLoading } = useQuery({
    queryKey: ['/api/bookings', bookingId],
    enabled: !!bookingId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded-none w-1/4"></div>
            <div className="h-64 bg-white/10 rounded-none"></div>
            <div className="h-48 bg-white/10 rounded-none"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          <Alert className="bg-white/10 border-white/20 rounded-none">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Booking not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const arrivalDate = calculateArrivalDate(booking.departureDate, booking.departureTime, booking.arrivalTime);
  const duration = calculateDuration(booking.departureTime, booking.arrivalTime);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(config.backRoute)}
            className="text-white/70 hover:text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {config.title.replace(' Details', 's')}
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/10"
              data-testid="button-download"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {booking.status === 'confirmed' && (
              <>
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                  data-testid="button-modify"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modify
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white/80 hover:bg-white/10"
                  data-testid="button-cancel"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Booking Status Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="h-8 w-8 text-white" strokeWidth={1} />
              <div>
                <h2 className="text-2xl font-light text-white tracking-wide" data-testid="text-booking-id">
                  Booking #{booking.id}
                </h2>
                <p className="text-sm text-white/60 font-light">
                  Booked on {formatDate(booking.createdAt || booking.departureDate)}
                </p>
              </div>
            </div>
            <Badge 
              className={`${config.statusColors[booking.status as keyof typeof config.statusColors]} rounded-none font-light`}
              data-testid="badge-status"
            >
              {booking.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Journey Details */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Journey Details
            </h3>
          </div>
          <div className="space-y-6">
            {/* Route */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-white/60 mb-1">From</p>
                <p className="text-xl font-semibold" data-testid="text-from">{booking.fromLocation}</p>
                <p className="text-sm text-white/70">{formatDate(booking.departureDate)}</p>
                <p className="text-lg text-white/80" data-testid="text-departure-time">
                  {booking.departureTime}
                </p>
              </div>
              
              <div className="flex flex-col items-center px-4">
                <Clock className="h-5 w-5 text-white/40 mb-1" />
                <p className="text-sm text-white/60" data-testid="text-duration">{duration}</p>
                <div className="w-24 h-0.5 bg-gradient-to-r from-white/10 to-white/5 my-2"></div>
              </div>
              
              <div className="flex-1 text-right">
                <p className="text-sm text-white/60 mb-1">To</p>
                <p className="text-xl font-semibold" data-testid="text-to">{booking.toLocation}</p>
                <p className="text-sm text-white/70">{formatDate(arrivalDate)}</p>
                <p className="text-lg text-white/80" data-testid="text-arrival-time">
                  {booking.arrivalTime}
                </p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Additional Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {booking.serviceNumber && (
                <div>
                  <p className="text-sm text-white/60 mb-1">{serviceType === 'flight' ? 'Flight' : serviceType === 'train' ? 'Train' : 'Service'} Number</p>
                  <p className="font-medium" data-testid="text-service-number">{booking.serviceNumber}</p>
                </div>
              )}
              {booking.className && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Class</p>
                  <p className="font-medium" data-testid="text-class">{booking.className}</p>
                </div>
              )}
              {booking.seatNumber && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Seat</p>
                  <p className="font-medium" data-testid="text-seat">{booking.seatNumber}</p>
                </div>
              )}
              {booking.pnr && (
                <div>
                  <p className="text-sm text-white/60 mb-1">PNR</p>
                  <p className="font-medium" data-testid="text-pnr">{booking.pnr}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        {booking.passengers && booking.passengers.length > 0 && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Users className="h-4 w-4" />
                Passenger Details ({booking.passengers.length})
              </h3>
            </div>
            <div>
              <div className="space-y-3">
                {booking.passengers.map((passenger: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    data-testid={`passenger-${index}`}
                  >
                    <div>
                      <p className="font-medium" data-testid={`text-passenger-name-${index}`}>
                        {passenger.name}
                      </p>
                      <p className="text-sm text-white/60">
                        {passenger.age} years • {passenger.gender}
                      </p>
                    </div>
                    {passenger.seatNumber && (
                      <Badge variant="outline" className="border-white/20">
                        Seat {passenger.seatNumber}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add-ons */}
        {booking.addOns && booking.addOns.length > 0 && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                <Package className="h-4 w-4" />
                Add-ons
              </h3>
            </div>
            <div>
              <div className="space-y-2">
                {booking.addOns.map((addon: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    data-testid={`addon-${index}`}
                  >
                    <div>
                      <p className="font-medium">{addon.name}</p>
                      {addon.description && (
                        <p className="text-sm text-white/60">{addon.description}</p>
                      )}
                    </div>
                    <p className="font-semibold text-white/80">
                      ${addon.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fare Breakdown */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Fare Breakdown
            </h3>
          </div>
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Base Fare</span>
                <span data-testid="text-base-fare">
                  ${((booking.totalAmount || 0) * 0.85).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Taxes & Fees</span>
                <span data-testid="text-taxes">
                  ${((booking.totalAmount || 0) * 0.15).toFixed(2)}
                </span>
              </div>
              {booking.addOns && booking.addOns.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70">Add-ons</span>
                  <span data-testid="text-addons-total">
                    ${booking.addOns.reduce((sum: number, addon: any) => sum + addon.price, 0).toFixed(2)}
                  </span>
                </div>
              )}
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-white/80" data-testid="text-total-amount">
                  ${(booking.totalAmount || 0).toFixed(2)}
                </span>
              </div>
              {booking.refundAmount && booking.refundAmount > 0 && (
                <div className="flex justify-between text-white/80">
                  <span>Refund Amount</span>
                  <span data-testid="text-refund-amount">
                    ${booking.refundAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-white/80" />
              Cancellation & Refund Policy
            </h3>
          </div>
          <div>
            <div className="space-y-3 text-white/70">
              {booking.refundable ? (
                <>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white/10 rounded-full"></span>
                    This booking is <span className="text-white/80 font-medium">refundable</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Full refund if cancelled 24+ hours before departure</li>
                    <li>50% refund if cancelled 12-24 hours before departure</li>
                    <li>25% refund if cancelled 6-12 hours before departure</li>
                    <li>No refund if cancelled within 6 hours of departure</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white/10 rounded-full"></span>
                    This booking is <span className="text-white/80 font-medium">non-refundable</span>
                  </p>
                  <p>
                    No refund will be provided if this booking is cancelled. 
                    However, you may be able to modify your booking subject to availability and fare difference.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
