import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  ArrowLeft,
  Car,
  Star,
  Users,
  Fuel,
  Settings,
  MapPin,
  Shield,
  Calendar,
  Clock,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Key,
  Navigation,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  Heart
} from "lucide-react";
import { format } from "date-fns";

interface RentalVehicle {
  id: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  hourlyRate: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  rating: string;
  totalRatings: number;
  images: string[] | null;
  features: string[] | null;
  city: string;
  registrationNumber: string;
  insuranceValidity: string;
  isActive: number;
  description: string | null;
}

interface RentalReview {
  id: string;
  overallRating: number;
  vehicleConditionRating: number | null;
  cleanlinessRating: number | null;
  serviceRating: number | null;
  reviewText: string | null;
  userName: string;
  createdAt: string;
}

export default function RentalVehicleDetail() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useUrlTab("overview");

  const params = new URLSearchParams(window.location.search);
  const vehicleId = params.get('vehicleId') || '';
  const pickupLocationId = params.get('pickupLocationId') || '';
  const dropoffLocationId = params.get('dropoffLocationId') || '';
  const pickupDate = params.get('pickupDate') || '';
  const pickupTime = params.get('pickupTime') || '';
  const dropoffDate = params.get('dropoffDate') || '';
  const dropoffTime = params.get('dropoffTime') || '';
  const rentalType = params.get('rentalType') || 'daily';

  const { data: vehicleData, isLoading: vehicleLoading } = useQuery({
    queryKey: [`/api/rental/vehicles/${vehicleId}`],
    enabled: !!vehicleId,
  });

  const { data: reviewsData } = useQuery({
    queryKey: [`/api/rental/reviews/vehicle/${vehicleId}`],
    enabled: !!vehicleId,
  });

  const vehicle = (vehicleData as any)?.vehicle as RentalVehicle;
  const reviews = ((reviewsData as any)?.reviews || []) as RentalReview[];

  const getRateForType = () => {
    if (!vehicle) return { rate: '0', label: '/day' };
    switch (rentalType) {
      case 'hourly': return { rate: vehicle.hourlyRate, label: '/hour' };
      case 'daily': return { rate: vehicle.dailyRate, label: '/day' };
      case 'weekly': return { rate: vehicle.weeklyRate, label: '/week' };
      case 'monthly': return { rate: vehicle.monthlyRate, label: '/month' };
      default: return { rate: vehicle.dailyRate, label: '/day' };
    }
  };

  const calculateDuration = () => {
    if (!pickupDate || !dropoffDate) return { value: 1, unit: 'day' };
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);
    const hours = Math.round((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60));
    
    if (rentalType === 'hourly') return { value: hours, unit: 'hour' };
    if (rentalType === 'weekly') return { value: Math.ceil(hours / (24 * 7)), unit: 'week' };
    if (rentalType === 'monthly') return { value: Math.ceil(hours / (24 * 30)), unit: 'month' };
    return { value: Math.ceil(hours / 24), unit: 'day' };
  };

  const calculateTotal = () => {
    if (!vehicle) return 0;
    const { rate } = getRateForType();
    const { value } = calculateDuration();
    return parseFloat(rate) * value;
  };

  const handleBookNow = () => {
    const checkoutParams = new URLSearchParams({
      vehicleId: vehicleId,
      pickupLocationId,
      dropoffLocationId,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      rentalType,
    });
    navigate(`/rental-checkout?${checkoutParams.toString()}`);
  };

  if (vehicleLoading || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 animate-pulse text-white/80 mx-auto mb-4" />
          <p className="text-white/60">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  const { rate, label } = getRateForType();
  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/rental-booking')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold tracking-wider">VEHICLE DETAILS</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
            data-testid="button-favorite"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-16">
        {/* Vehicle Image Gallery */}
        <div className="relative aspect-video bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" />
          <Car className="h-24 w-24 text-white/80 relative z-10" />
          {vehicle.images && vehicle.images.length > 0 && (
            <Badge className="absolute bottom-4 right-4 bg-black/60 text-white border-white/20 backdrop-blur-sm">
              <ImageIcon className="h-3 w-3 mr-1" />
              {vehicle.images.length} Photos
            </Badge>
          )}
        </div>

        {/* Vehicle Info */}
        <div className="px-4 -mt-6 relative z-10">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/10 text-white/80 border-white/20 rounded-full text-xs">
                    {vehicle.category}
                  </Badge>
                  <Badge className="bg-white/10 text-white/70 border-white/20 rounded-full text-xs">
                    {vehicle.vehicleType}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="text-sm text-white/50">
                  {vehicle.year} • {vehicle.registrationNumber}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-gradient-to-br from-white/10 to-white/5/20 border border-emerald-400/30 px-3 py-2 rounded-xl">
                <Star className="h-5 w-5 text-white/80 fill-current" />
                <div className="text-left">
                  <div className="text-lg font-bold text-white/80 leading-none">{vehicle.rating}</div>
                  <div className="text-[10px] text-emerald-300/70">{vehicle.totalRatings} reviews</div>
                </div>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <Users className="h-5 w-5 text-white/80 mx-auto mb-1" />
                <p className="text-xs text-white/50">Seats</p>
                <p className="font-bold">{vehicle.seatingCapacity}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <Fuel className="h-5 w-5 text-white/80 mx-auto mb-1" />
                <p className="text-xs text-white/50">Fuel</p>
                <p className="font-bold text-sm">{vehicle.fuelType}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <Settings className="h-5 w-5 text-white/80 mx-auto mb-1" />
                <p className="text-xs text-white/50">Transmission</p>
                <p className="font-bold text-xs">{vehicle.transmission}</p>
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {vehicle.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/70 bg-white/5 rounded-full">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white/5 border border-white/10 w-full h-auto p-1 rounded-xl grid grid-cols-3">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 rounded-lg text-xs"
                data-testid="tab-overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 rounded-lg text-xs"
                data-testid="tab-reviews"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="terms" 
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70 rounded-lg text-xs"
                data-testid="tab-terms"
              >
                Terms
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {vehicle.description && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-white/80" />
                    About this vehicle
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-white/80" />
                  What's Included
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">Comprehensive insurance coverage</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">24/7 roadside assistance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">Keyless entry with digital unlock</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">GPS tracking for your safety</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">Free cancellation up to 48 hours before</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-white/80" />
                  Documents Required
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">Valid driving license (original)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">Government ID proof (Aadhar/Passport/PAN)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white/80 mt-0.5" />
                    <span className="text-white/70">Recent selfie for verification</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl p-4" data-testid={`review-${review.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-xs text-white/50">
                          {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 border border-emerald-400/30 px-2 py-1 rounded-lg">
                        <Star className="h-3.5 w-3.5 text-white/80 fill-current" />
                        <span className="text-sm font-bold text-white/80">{review.overallRating}.0</span>
                      </div>
                    </div>
                    {review.reviewText && (
                      <p className="text-sm text-white/70 leading-relaxed">{review.reviewText}</p>
                    )}
                    {(review.vehicleConditionRating || review.cleanlinessRating || review.serviceRating) && (
                      <div className="flex gap-4 mt-3 text-xs">
                        {review.vehicleConditionRating && (
                          <div className="text-white/60">
                            Condition: <span className="text-white font-semibold">{review.vehicleConditionRating}/5</span>
                          </div>
                        )}
                        {review.cleanlinessRating && (
                          <div className="text-white/60">
                            Cleanliness: <span className="text-white font-semibold">{review.cleanlinessRating}/5</span>
                          </div>
                        )}
                        {review.serviceRating && (
                          <div className="text-white/60">
                            Service: <span className="text-white font-semibold">{review.serviceRating}/5</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-white/50">
                  <Star className="h-12 w-12 mx-auto mb-3 text-white/20" />
                  <p>No reviews yet for this vehicle</p>
                </div>
              )}
            </TabsContent>

            {/* Terms Tab */}
            <TabsContent value="terms" className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-white/80" />
                  Usage Limits & Rules
                </h3>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <span>Free kilometers: 150 km/day (additional ₹10/km)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <span>Fuel: Return with same fuel level as pickup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <span>No smoking inside vehicle</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <span>No pets allowed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <span>Late return: ₹500/hour penalty</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-white/80" />
                  Cancellation Policy
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">48+ hours before pickup</p>
                      <p className="text-white/60">100% refund (no questions asked)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white/80 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">24-48 hours before</p>
                      <p className="text-white/60">50% refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-white/80 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Less than 24 hours</p>
                      <p className="text-white/60">No refund</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-blue-100">Security Deposit</p>
                    <p className="text-blue-200/80 leading-relaxed">
                      A refundable security deposit of ₹{(parseFloat(vehicle.dailyRate) * 2).toFixed(0)} will be blocked on your card and released within 7 days after trip completion.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black to-transparent border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 mb-0.5">Total for {duration.value} {duration.unit}{duration.value > 1 ? 's' : ''}</p>
              <p className="text-2xl font-bold text-white flex items-baseline gap-1">
                ₹{calculateTotal().toFixed(0)}
                <span className="text-sm font-normal text-white/50">{label}</span>
              </p>
            </div>
            <Button 
              onClick={handleBookNow}
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 text-base font-bold shadow-lg shadow-white/20"
              disabled={!pickupDate || !dropoffDate || !pickupLocationId || !dropoffLocationId}
              data-testid="button-book-now"
            >
              Book Now
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
          {(!pickupDate || !dropoffDate || !pickupLocationId || !dropoffLocationId) && (
            <p className="text-xs text-white/80 text-center">
              Please select pickup/dropoff details from the search page
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
