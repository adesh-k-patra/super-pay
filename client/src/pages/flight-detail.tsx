import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { 
  ArrowLeft, Plane, Calendar, Clock, Users, CreditCard, 
  Download, XCircle, Edit3, MapPin, Briefcase, ChevronRight,
  Coffee, Utensils, Wifi, CheckCircle, AlertCircle
} from "lucide-react";
import { TravelBooking } from "@shared/schema";

export default function FlightDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();

  const { data: bookingData, isLoading, error } = useQuery<TravelBooking & { passengers?: any[] }>({
    queryKey: ['/api/travel/bookings', id],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading booking",
        description: "Failed to fetch booking details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-4">
            <div className="h-8 w-32 bg-white/10 animate-pulse rounded-none" />
            <div className="h-64 bg-white/10 animate-pulse rounded-none" />
            <div className="h-48 bg-white/10 animate-pulse rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-white/80 mx-auto mb-4" strokeWidth={1} />
          <h2 className="text-2xl font-light mb-2">Booking Not Found</h2>
          <p className="text-white/60 mb-4 font-light">The booking you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/my-trips/flights")} data-testid="button-back-list">
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-white/10 text-white/80 border-white/20';
      case 'pending': return 'bg-white/10 text-white/80 border-white/20';
      case 'cancelled': return 'bg-white/10 text-white/80 border-white/20';
      case 'completed': return 'bg-white/10 text-white/80 border-white/20';
      default: return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const fareBreakdown = {
    baseFare: parseFloat(bookingData.baseAmount || '0'),
    taxes: parseFloat(bookingData.taxes || '0'),
    fees: parseFloat(bookingData.fees || '0'),
  };

  const addOns = (bookingData as any).addOns || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Header */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 border border-white/20 rounded-none">
                <Plane className="h-8 w-8 text-white/80" strokeWidth={1} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-light tracking-wide" data-testid="text-booking-ref">
                    {bookingData.bookingReference}
                  </h1>
                  <Badge className={`${getStatusColor(bookingData.status)} border rounded-none font-light`} data-testid="badge-status">
                    {bookingData.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-white/60 space-y-1 font-light">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" strokeWidth={1} />
                    {new Date(bookingData.departureDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" strokeWidth={1} />
                    {bookingData.totalPassengers} Passenger{bookingData.totalPassengers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-3xl font-light text-white/80" data-testid="text-total-amount">
                ${parseFloat(bookingData.totalAmount).toFixed(2)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/20" data-testid="button-download">
                  <Download className="h-4 w-4 mr-2" strokeWidth={1} />
                  Receipt
                </Button>
                {bookingData.status === 'confirmed' && (
                  <>
                    <Button size="sm" variant="outline" className="border-white/20" data-testid="button-modify">
                      <Edit3 className="h-4 w-4 mr-2" strokeWidth={1} />
                      Modify
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white/80" data-testid="button-cancel">
                      <XCircle className="h-4 w-4 mr-2" strokeWidth={1} />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Timeline */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                  <Plane className="h-4 w-4" strokeWidth={1} />
                  Flight Details
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-white/80" strokeWidth={1} />
                      <span className="text-xl font-semibold" data-testid="text-from-location">{bookingData.fromLocation}</span>
                    </div>
                    <div className="text-white/60 font-light" data-testid="text-departure-time">
                      {new Date(bookingData.departureDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="h-px bg-white/20 w-full" />
                      <Plane className="h-5 w-5 text-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black px-1" strokeWidth={1} />
                    </div>
                    <div className="text-center text-white/60 text-sm mt-2 font-light">
                      {bookingData.operatorName || 'Direct Flight'}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className="text-xl font-semibold" data-testid="text-to-location">{bookingData.toLocation}</span>
                      <MapPin className="h-4 w-4 text-white/80" strokeWidth={1} />
                    </div>
                    <div className="text-white/60 font-light" data-testid="text-arrival-time">
                      {bookingData.arrivalTime ? new Date(bookingData.arrivalTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'TBA'}
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-widest font-light">Flight Number</div>
                    <div className="font-medium">{bookingData.vehicleNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-widest font-light">Class</div>
                    <div className="font-medium flex items-center gap-1">
                      <Briefcase className="h-4 w-4" strokeWidth={1} />
                      {bookingData.seatClass || 'Economy'}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-widest font-light">Terminal</div>
                    <div className="font-medium">Terminal {bookingData.platform || '1'}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-widest font-light">Gate</div>
                    <div className="font-medium">Gate {bookingData.boardingGate || 'TBA'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers */}
            {bookingData.passengers && bookingData.passengers.length > 0 && (
              <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                    <Users className="h-4 w-4" strokeWidth={1} />
                    Passengers ({bookingData.passengers.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {bookingData.passengers.map((passenger: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-none" data-testid={`passenger-${index}`}>
                      <div>
                        <div className="font-medium">{passenger.name}</div>
                        <div className="text-sm text-white/60 font-light">{passenger.age} years • {passenger.gender}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white/60 text-xs uppercase tracking-widest font-light">Seat</div>
                        <div className="font-medium">{passenger.seatNumber || 'TBA'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {addOns.length > 0 && (
              <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                    <Coffee className="h-4 w-4" strokeWidth={1} />
                    Add-ons & Extras
                  </h3>
                </div>
                <div className="space-y-3">
                  {addOns.map((addon: any, index: number) => (
                    <div key={index} className="flex items-center justify-between" data-testid={`addon-${index}`}>
                      <div className="flex items-center gap-2">
                        {addon.type === 'meal' && <Utensils className="h-4 w-4 text-white/80" strokeWidth={1} />}
                        {addon.type === 'wifi' && <Wifi className="h-4 w-4 text-white/80" strokeWidth={1} />}
                        {addon.type === 'baggage' && <Briefcase className="h-4 w-4 text-white/80" strokeWidth={1} />}
                        <span className="font-light">{addon.name}</span>
                      </div>
                      <span className="font-medium">${parseFloat(addon.price || '0').toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fare Breakdown */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                  <CreditCard className="h-4 w-4" strokeWidth={1} />
                  Fare Breakdown
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Base Fare</span>
                  <span className="font-medium" data-testid="text-base-fare">${fareBreakdown.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Taxes & Fees</span>
                  <span className="font-medium" data-testid="text-taxes">${fareBreakdown.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 font-light">Service Fee</span>
                  <span className="font-medium" data-testid="text-fees">${fareBreakdown.fees.toFixed(2)}</span>
                </div>
                {addOns.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60 font-light">Add-ons</span>
                    <span className="font-medium">
                      ${addOns.reduce((sum: number, addon: any) => sum + parseFloat(addon.price || '0'), 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-white/80">${parseFloat(bookingData.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-white/60 font-light flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" strokeWidth={1} />
                  Cancellation Policy
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-white/80 mt-0.5" strokeWidth={1} />
                  <div>
                    <div className="font-medium">Before 24 hours</div>
                    <div className="text-white/60 font-light">100% refund</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-white/80 mt-0.5" strokeWidth={1} />
                  <div>
                    <div className="font-medium">12-24 hours before</div>
                    <div className="text-white/60 font-light">50% refund</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-white/80 mt-0.5" strokeWidth={1} />
                  <div>
                    <div className="font-medium">Less than 12 hours</div>
                    <div className="text-white/60 font-light">No refund</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-white/5 border border-white/20 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-white/80 mt-0.5" strokeWidth={1} />
                <div className="text-sm">
                  <div className="font-medium mb-1">Travel Tip</div>
                  <div className="text-white/70 font-light">
                    Arrive at the airport at least 2 hours before departure for domestic flights.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
