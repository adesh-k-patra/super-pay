import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { 
  ArrowLeft, Car, Calendar, Clock, Users, CreditCard, 
  Download, XCircle, Edit3, MapPin, User, Phone,
  CheckCircle, AlertCircle, Coffee, Utensils, Wifi, Briefcase
} from "lucide-react";
import { TravelBooking } from "@shared/schema";

export default function CabDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();

  const { data: bookingData, isLoading, error } = useQuery<TravelBooking & { passengers?: any[]; driver?: any }>({
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-4">
            <div className="h-8 w-32 bg-white/10 animate-pulse rounded" />
            <div className="h-64 bg-white/10 animate-pulse rounded-lg" />
            <div className="h-48 bg-white/10 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-white/60 mb-4">The booking you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/my-trips/cabs")} data-testid="button-back-list">
            Back to Cabs
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

  const driver = bookingData.driver || {
    name: 'TBA',
    phone: 'TBA',
    rating: 'N/A'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
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

        {/* Header Card */}
        <Card className="bg-white/5 border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
                  <Car className="h-8 w-8 text-white/80" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold" data-testid="text-booking-ref">
                      {bookingData.bookingReference}
                    </h1>
                    <Badge className={`${getStatusColor(bookingData.status)} border`} data-testid="badge-status">
                      {bookingData.status}
                    </Badge>
                  </div>
                  <div className="text-white/60 space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(bookingData.departureDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {bookingData.totalPassengers} Passenger{bookingData.totalPassengers > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-3xl font-bold text-white/80" data-testid="text-total-amount">
                  ${parseFloat(bookingData.totalAmount).toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-white/20" data-testid="button-download">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                  {bookingData.status === 'confirmed' && (
                    <>
                      <Button size="sm" variant="outline" className="border-white/20" data-testid="button-modify">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Modify
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white/80" data-testid="button-cancel">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cab Timeline */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Ride Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-white/80" />
                      <span className="text-xl font-bold" data-testid="text-from-location">{bookingData.fromLocation}</span>
                    </div>
                    <div className="text-white/60" data-testid="text-departure-time">
                      Pickup: {new Date(bookingData.departureDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="h-px bg-white/20 w-full" />
                      <Car className="h-5 w-5 text-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-1" />
                    </div>
                    <div className="text-center text-white/60 text-sm mt-2">
                      {bookingData.operatorName || bookingData.seatClass || 'Standard'}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className="text-xl font-bold" data-testid="text-to-location">{bookingData.toLocation}</span>
                      <MapPin className="h-4 w-4 text-white/80" />
                    </div>
                    <div className="text-white/60" data-testid="text-arrival-time">
                      Dropoff: {bookingData.arrivalTime ? new Date(bookingData.arrivalTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'TBA'}
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Vehicle Number</div>
                    <div className="font-semibold">{bookingData.vehicleNumber || 'TBA'}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Vehicle Type</div>
                    <div className="font-semibold flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      {bookingData.seatClass || 'Sedan'}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60">Pickup Address</div>
                    <div className="font-semibold">{bookingData.platform || bookingData.fromLocation}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Dropoff Address</div>
                    <div className="font-semibold">{bookingData.boardingGate || bookingData.toLocation}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg" data-testid="text-driver-name">{driver.name}</div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {driver.phone}
                      </span>
                      <span>⭐ {driver.rating}</span>
                    </div>
                  </div>
                  {bookingData.status === 'confirmed' && (
                    <Button size="sm" variant="outline" className="border-white/20/50 text-white/80" data-testid="button-contact-driver">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Passengers */}
            {bookingData.passengers && bookingData.passengers.length > 0 && (
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Passengers ({bookingData.passengers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookingData.passengers.map((passenger: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg" data-testid={`passenger-${index}`}>
                        <div>
                          <div className="font-semibold">{passenger.name}</div>
                          <div className="text-sm text-white/60">{passenger.age} years • {passenger.gender}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add-ons */}
            {addOns.length > 0 && (
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    Add-ons & Extras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {addOns.map((addon: any, index: number) => (
                      <div key={index} className="flex items-center justify-between" data-testid={`addon-${index}`}>
                        <div className="flex items-center gap-2">
                          {addon.type === 'meal' && <Utensils className="h-4 w-4 text-white/80" />}
                          {addon.type === 'wifi' && <Wifi className="h-4 w-4 text-white/80" />}
                          {addon.type === 'baggage' && <Briefcase className="h-4 w-4 text-white/80" />}
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-semibold">${parseFloat(addon.price || '0').toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fare Breakdown */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Fare Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Fare</span>
                  <span className="font-semibold" data-testid="text-base-fare">${fareBreakdown.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Taxes & Fees</span>
                  <span className="font-semibold" data-testid="text-taxes">${fareBreakdown.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Service Fee</span>
                  <span className="font-semibold" data-testid="text-fees">${fareBreakdown.fees.toFixed(2)}</span>
                </div>
                {addOns.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Add-ons</span>
                    <span className="font-semibold">
                      ${addOns.reduce((sum: number, addon: any) => sum + parseFloat(addon.price || '0'), 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-white/80">${parseFloat(bookingData.totalAmount).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div>
                    <div className="font-semibold">Before 1 hour</div>
                    <div className="text-white/60">100% refund</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div>
                    <div className="font-semibold">30 min - 1 hour before</div>
                    <div className="text-white/60">50% refund</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div>
                    <div className="font-semibold">Less than 30 minutes</div>
                    <div className="text-white/60">No refund</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white/80 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Travel Tip</div>
                    <div className="text-white/70">
                      Be ready at the pickup location 5 minutes before scheduled time.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
