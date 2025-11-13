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
  ArrowLeft, Key, Calendar, Clock, Users, CreditCard, 
  Download, XCircle, Edit3, MapPin, Car, Gauge, Fuel,
  CheckCircle, AlertCircle, Coffee, Utensils, Wifi, Briefcase
} from "lucide-react";
import { TravelBooking } from "@shared/schema";

export default function RentalDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();

  const { data: bookingData, isLoading, error } = useQuery<TravelBooking & { passengers?: any[]; vehicle?: any }>({
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-white/60 mb-4">The booking you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/my-trips/rentals")} data-testid="button-back-list">
            Back to Rentals
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
      case 'completed': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const fareBreakdown = {
    baseFare: parseFloat(bookingData.baseAmount || '0'),
    taxes: parseFloat(bookingData.taxes || '0'),
    fees: parseFloat(bookingData.fees || '0'),
  };

  const addOns = (bookingData as any).addOns || [];

  const vehicle = bookingData.vehicle || {
    type: bookingData.seatClass || 'Sedan',
    model: 'N/A',
    fuelType: 'Petrol',
    transmission: 'Manual'
  };

  const rentalDuration = () => {
    if (bookingData.arrivalTime) {
      const start = new Date(bookingData.departureDate);
      const end = new Date(bookingData.arrivalTime);
      const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}hr` : ''}`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return 'TBA';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 text-white">
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
                <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                  <Key className="h-8 w-8 text-amber-400" />
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
                      <Clock className="h-4 w-4" />
                      Duration: {rentalDuration()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-3xl font-bold text-amber-400" data-testid="text-total-amount">
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
            {/* Rental Timeline */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Rental Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-amber-400" />
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
                      <Key className="h-5 w-5 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-1" />
                    </div>
                    <div className="text-center text-white/60 text-sm mt-2">
                      {rentalDuration()}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span className="text-xl font-bold" data-testid="text-to-location">{bookingData.toLocation || bookingData.fromLocation}</span>
                      <MapPin className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="text-white/60" data-testid="text-arrival-time">
                      Return: {bookingData.arrivalTime ? new Date(bookingData.arrivalTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'TBA'}
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Rental Company</div>
                    <div className="font-semibold">{bookingData.operatorName || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Duration</div>
                    <div className="font-semibold flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {rentalDuration()}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60">Pickup Location</div>
                    <div className="font-semibold">{bookingData.platform || bookingData.fromLocation}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Return Location</div>
                    <div className="font-semibold">{bookingData.boardingGate || bookingData.toLocation || bookingData.fromLocation}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center justify-center">
                      <Car className="h-8 w-8 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg" data-testid="text-vehicle-type">{vehicle.type}</div>
                      <div className="text-sm text-white/60">{vehicle.model}</div>
                    </div>
                  </div>
                  
                  <Separator className="bg-white/20" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-amber-400" />
                      <div>
                        <div className="text-white/60">Fuel Type</div>
                        <div className="font-semibold">{vehicle.fuelType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-amber-400" />
                      <div>
                        <div className="text-white/60">Transmission</div>
                        <div className="font-semibold">{vehicle.transmission}</div>
                      </div>
                    </div>
                    {bookingData.vehicleNumber && (
                      <div className="col-span-2">
                        <div className="text-white/60">Vehicle Number</div>
                        <div className="font-semibold">{bookingData.vehicleNumber}</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passengers */}
            {bookingData.passengers && bookingData.passengers.length > 0 && (
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Driver & Passengers ({bookingData.passengers.length})
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
                        {index === 0 && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            Primary Driver
                          </Badge>
                        )}
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
                          {addon.type === 'meal' && <Utensils className="h-4 w-4 text-amber-400" />}
                          {addon.type === 'wifi' && <Wifi className="h-4 w-4 text-amber-400" />}
                          {addon.type === 'baggage' && <Briefcase className="h-4 w-4 text-amber-400" />}
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
                  <span className="text-white/60">Base Rental</span>
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
                  <span className="text-amber-400">${parseFloat(bookingData.totalAmount).toFixed(2)}</span>
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
                    <div className="font-semibold">Before 48 hours</div>
                    <div className="text-white/60">100% refund</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div>
                    <div className="font-semibold">24-48 hours before</div>
                    <div className="text-white/60">50% refund</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-white/80 mt-0.5" />
                  <div>
                    <div className="font-semibold">Less than 24 hours</div>
                    <div className="text-white/60">No refund</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Important</div>
                    <div className="text-white/70">
                      Please carry your valid driving license and ID proof for vehicle pickup.
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
