import { useState, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Clock,
  IndianRupee,
  Video,
  Home,
  Shield,
  Award,
  User,
  Heart,
  Share2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ConsultantProvider, ConsultantService, ConsultantReview, ConsultantAvailability } from "@shared/schema";
import professionalImage from "@assets/stock_images/professional_medical_189fe339.jpg";

export default function ConsultantDetail() {
  const params = useParams<{ providerId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const { data: provider, isLoading: loadingProvider } = useQuery<ConsultantProvider>({
    queryKey: [`/api/consultant/providers/${params.providerId}`],
    enabled: !!params.providerId,
  });

  const { data: services = [] } = useQuery<ConsultantService[]>({
    queryKey: [`/api/consultant/providers/${params.providerId}/services`],
    enabled: !!params.providerId,
  });

  const { data: reviews = [] } = useQuery<ConsultantReview[]>({
    queryKey: [`/api/consultant/providers/${params.providerId}/reviews`],
    enabled: !!params.providerId,
  });

  const { data: availability = [] } = useQuery<ConsultantAvailability[]>({
    queryKey: [`/api/consultant/providers/${params.providerId}/availability`],
    enabled: !!params.providerId,
  });

  // Transform availability data into time slots - memoized to prevent regeneration
  const timeSlots = useMemo(() => {
    const slots: Array<{
      id: string;
      date: string;
      time: string;
      displayDate: string;
      displayTime: string;
      available: boolean;
    }> = [];
    const today = new Date();
    
    if (availability.length === 0) {
      // If no availability data, generate default slots for next 7 days
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Morning slots (9 AM - 12 PM)
        for (let hour = 9; hour < 12; hour++) {
          slots.push({
            id: `${dateStr}-${hour}:00`,
            date: dateStr,
            time: `${hour}:00`,
            displayDate: format(date, 'EEE, MMM dd'),
            displayTime: `${hour}:00 - ${hour + 1}:00`,
            available: true
          });
        }
        
        // Afternoon slots (2 PM - 6 PM)
        for (let hour = 14; hour < 18; hour++) {
          slots.push({
            id: `${dateStr}-${hour}:00`,
            date: dateStr,
            time: `${hour}:00`,
            displayDate: format(date, 'EEE, MMM dd'),
            displayTime: `${hour}:00 - ${hour + 1}:00`,
            available: true
          });
        }
      }
      return slots;
    }

    // Map availability records to time slots for the next 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find recurring availability for this day of week
      const recurringSlots = availability.filter(avail => 
        avail.dayOfWeek === dayOfWeek && 
        avail.isRecurring === 1 && 
        avail.isActive === 1
      );
      
      // Find specific date availability
      const specificSlots = availability.filter(avail => 
        avail.specificDate && 
        format(new Date(avail.specificDate), 'yyyy-MM-dd') === dateStr &&
        avail.isActive === 1
      );
      
      // Combine recurring and specific slots
      const daySlots = [...recurringSlots, ...specificSlots];
      
      daySlots.forEach(avail => {
        const timeStr = avail.startTime;
        const endTimeStr = avail.endTime;
        
        slots.push({
          id: `${dateStr}-${timeStr}`,
          date: dateStr,
          time: timeStr,
          displayDate: format(date, 'EEE, MMM dd'),
          displayTime: `${timeStr} - ${endTimeStr}`,
          available: true // Active slots are available
        });
      });
    }
    
    return slots;
  }, [availability]);

  const toggleSlot = (slotId: string) => {
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedService) {
        throw new Error("Please select a service");
      }
      if (selectedSlots.length === 0) {
        throw new Error("Please select at least one time slot");
      }
      if (!contactName || !contactPhone) {
        throw new Error("Please provide contact details");
      }

      return apiRequest("POST", "/api/consultant/bookings", {
        providerId: params.providerId,
        serviceId: selectedService,
        timeSlots: selectedSlots,
        requirements: additionalRequirements,
        contactName,
        contactPhone,
        contactEmail
      });
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Sent",
        description: "The consultant will confirm your booking soon.",
      });
      navigate("/consultant/history");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    bookingMutation.mutate();
  };

  if (loadingProvider || !provider) {
    return (
      <div className="min-h-screen bg-black pb-24">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <button
              onClick={() => navigate("/consultant/explore")}
              className="text-white hover:text-white/80"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">LOADING...</h1>
            </div>
            <div className="w-5" />
          </div>
        </div>
        <div className="pt-20 flex items-center justify-center h-96">
          <div className="text-white/60">Loading consultant details...</div>
        </div>
      </div>
    );
  }

  const selectedServiceData = services.find(s => s.id === selectedService);
  const totalPrice = selectedServiceData ? parseFloat(selectedServiceData.price) * selectedSlots.length : 0;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header with Provider Image */}
      <div className="relative h-80">
        <img
          src={provider.profileImage || professionalImage}
          alt={provider.name}
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/consultant/explore")}
            className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70 rounded-none"
              data-testid="button-favorite"
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-white text-white/80")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: provider.name,
                    text: `Check out ${provider.name} - ${provider.designation}`,
                    url: window.location.href
                  });
                }
              }}
              className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70 rounded-none"
              data-testid="button-share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Provider Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            {provider.verified === 1 && (
              <Badge className="bg-white/10 text-white border-0 rounded-none">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {provider.isOnline === 1 && (
              <Badge className="bg-green-500/20 text-green-300 border-0 rounded-none">
                Online Now
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-light tracking-wider mb-2" data-testid="text-consultant-name">
            {provider.name}
          </h1>
          {provider.designation && (
            <p className="text-white/60 text-sm uppercase tracking-widest mb-3">{provider.designation}</p>
          )}
          <div className="flex items-center gap-4 text-sm">
            {provider.rating && parseFloat(provider.rating) > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-white/80 fill-white" />
                <span>{parseFloat(provider.rating).toFixed(1)}</span>
                {provider.totalReviews && (
                  <span className="text-white/60">({provider.totalReviews})</span>
                )}
              </div>
            )}
            {provider.experience && provider.experience > 0 && (
              <div className="flex items-center gap-1 text-white/80">
                <Award className="h-4 w-4" />
                <span>{provider.experience}+ years</span>
              </div>
            )}
            {provider.totalBookings && provider.totalBookings > 0 && (
              <div className="flex items-center gap-1 text-white/80">
                <User className="h-4 w-4" />
                <span>{provider.totalBookings} bookings</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Info */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardContent className="p-4 space-y-4">
            {/* Location */}
            {provider.city && (
              <>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Location</p>
                    <p className="text-white font-light">{provider.city}</p>
                    {provider.address && (
                      <p className="text-white/60 text-sm mt-1">{provider.address}</p>
                    )}
                  </div>
                </div>
                <Separator className="bg-white/10" />
              </>
            )}

            {/* Experience */}
            {provider.experience && provider.experience > 0 && (
              <>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-white font-light">{provider.experience}+ Years</p>
                  </div>
                </div>
                <Separator className="bg-white/10" />
              </>
            )}

            {/* Contact Info */}
            {(provider.phone || provider.email) && (
              <>
                <div className="space-y-3">
                  {provider.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-white font-light">{provider.phone}</p>
                      </div>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Email</p>
                        <p className="text-white font-light">{provider.email}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Separator className="bg-white/10" />
              </>
            )}

            {/* Working Hours */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Working Hours</p>
                <p className="text-white font-light">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-white/60 text-sm mt-1">Saturday: 10:00 AM - 2:00 PM</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Consultation Modes */}
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Consultation Mode</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {provider.virtualAvailable === 1 && (
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                      <Video className="h-3 w-3 mr-1" />
                      Virtual
                    </Badge>
                  )}
                  {provider.inPersonAvailable === 1 && (
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                      <Home className="h-3 w-3 mr-1" />
                      In-Person
                    </Badge>
                  )}
                </div>
                <p className="text-white/70 text-sm font-light">
                  {provider.virtualAvailable === 1 && provider.inPersonAvailable === 1
                    ? "Hybrid - Available for both online and in-person consultations"
                    : provider.virtualAvailable === 1
                    ? "Online Only - Virtual consultations available"
                    : "Offline Only - In-person consultations available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 rounded-none">
            <TabsTrigger value="about" className="flex-1 rounded-none" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 rounded-none" data-testid="tab-reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4 mt-4">
            <Card className="bg-white/5 border-white/10 rounded-none">
              <CardContent className="p-4 space-y-4">
                {provider.bio && (
                  <div>
                    <h4 className="text-white font-semibold mb-2 uppercase tracking-wider text-sm">About</h4>
                    <p className="text-white/70 text-sm tracking-wide leading-relaxed">{provider.bio}</p>
                  </div>
                )}

                {provider.licenseNumber && (
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white font-semibold mb-2 uppercase tracking-wider text-sm">License Number</h4>
                    <p className="text-white/70 text-sm font-mono">{provider.licenseNumber}</p>
                  </div>
                )}

                <Separator className="bg-white/10" />

                <div>
                  <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {provider.phone && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Phone className="h-4 w-4" />
                        <span className="font-light">{provider.phone}</span>
                      </div>
                    )}
                    {provider.email && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail className="h-4 w-4" />
                        <span className="font-light">{provider.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-3 mt-4">
            {reviews.length > 0 && (
              <Card className="bg-white/5 border-white/10 rounded-none mb-4">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-light text-white mb-1">{parseFloat(provider.rating || "0").toFixed(1)}</div>
                      <div className="text-white/60 text-xs uppercase tracking-widest">Average Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-light text-white mb-1">{provider.totalReviews || reviews.length}</div>
                      <div className="text-white/60 text-xs uppercase tracking-widest">Total Reviews</div>
                    </div>
                    <div>
                      <div className="text-2xl font-light text-white mb-1">
                        {reviews.filter(r => r.rating >= 4).length}
                      </div>
                      <div className="text-white/60 text-xs uppercase tracking-widest">4+ Stars</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {reviews.map((review) => (
              <Card key={review.id} className="bg-white/5 border-white/10 rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white font-light mb-1">User {review.userId.slice(0, 8)}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < review.rating ? "text-white fill-white" : "text-white/20"
                            )}
                            strokeWidth={1}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-white/40 text-xs uppercase tracking-widest">
                      {new Date(review.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                  {review.review && (
                    <p className="text-white/70 text-sm tracking-wide leading-relaxed mb-3">{review.review}</p>
                  )}
                  {review.providerResponse && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="text-white/60 text-xs uppercase tracking-widest mb-2">Response from Provider</div>
                      <p className="text-white/60 text-sm tracking-wide leading-relaxed">{review.providerResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {reviews.length === 0 && (
              <Card className="bg-white/5 border-white/10 rounded-none">
                <CardContent className="p-12 text-center">
                  <p className="text-white/40 uppercase tracking-widest text-xs">No reviews yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Book Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        {selectedService && selectedSlots.length > 0 ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-light">Total ({selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''})</p>
              <p className="text-white text-2xl font-light flex items-center" data-testid="text-total-price">
                <IndianRupee className="h-5 w-5" />
                {totalPrice.toFixed(0)}
              </p>
            </div>
            <Button
              className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none font-light tracking-wider"
              onClick={handleBooking}
              disabled={bookingMutation.isPending}
              data-testid="button-book-now"
            >
              {bookingMutation.isPending ? "BOOKING..." : "BOOK NOW"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none font-light tracking-wider"
            onClick={() => {
              if (services.length > 0) {
                navigate(`/consultant/booking/${services[0].id}`);
              } else {
                toast({
                  title: "No Services Available",
                  description: "This consultant has no services available at the moment.",
                  variant: "destructive"
                });
              }
            }}
            data-testid="button-book-consultation"
          >
            BOOK CONSULTATION
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
