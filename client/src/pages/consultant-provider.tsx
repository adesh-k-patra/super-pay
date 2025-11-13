import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  CheckCircle2,
  Calendar,
  Clock,
  IndianRupee,
  Video,
  Home,
  Shield,
  Award,
  ChevronRight
} from "lucide-react";
import type { ConsultantProvider, ConsultantService, ConsultantReview } from "@shared/schema";
import professionalImage from "@assets/stock_images/professional_medical_189fe339.jpg";

export default function ConsultantProvider() {
  const params = useParams<{ providerId: string }>();
  const [, navigate] = useLocation();

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

  const handleBookService = (serviceId: string) => {
    navigate(`/consultant/booking/${serviceId}`);
  };

  if (loadingProvider || !provider) {
    return (
      <>
        <div className="min-h-screen bg-black pb-24">
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between py-4 px-4">
              <button
                onClick={() => window.history.back()}
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
            <div className="text-white/60">Loading provider details...</div>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-white/80"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider uppercase">Provider</h1>
            </div>
            <div className="w-5" />
          </div>
        </div>

        <div className="pt-20">
          {/* Provider Header */}
          <div className="px-4 py-6 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex gap-4 mb-4">
              {/* Provider Image */}
              <div className="w-28 h-28 shrink-0 overflow-hidden border border-white/10">
                <img
                  src={provider.profileImage || professionalImage}
                  alt={provider.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-light text-white tracking-wide mb-1 flex items-center gap-2">
                  {provider.name}
                  {provider.verified === 1 && (
                    <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0" strokeWidth={1} />
                  )}
                </h2>
                {provider.designation && (
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-3">{provider.designation}</p>
                )}
                
                {/* Rating and Stats */}
                <div className="flex items-center gap-3 mb-3">
                  {provider.rating && parseFloat(provider.rating) > 0 && (
                    <div className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-1">
                      <Star className="h-3 w-3 text-white fill-white" strokeWidth={1} />
                      <span className="text-white text-sm font-light">
                        {parseFloat(provider.rating).toFixed(1)}
                      </span>
                      {provider.totalReviews && provider.totalReviews > 0 && (
                        <span className="text-white/60 text-xs ml-1">
                          ({provider.totalReviews})
                        </span>
                      )}
                    </div>
                  )}
                  
                  {provider.totalBookings && provider.totalBookings > 0 && (
                    <span className="text-xs text-white/60 uppercase tracking-widest">
                      {provider.totalBookings} bookings
                    </span>
                  )}
                </div>

                {/* Availability Types */}
                <div className="flex gap-2 flex-wrap">
                  {provider.virtualAvailable === 1 && (
                    <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1">
                      <Video className="h-3 w-3" strokeWidth={1} />
                      Virtual
                    </span>
                  )}
                  {provider.inPersonAvailable === 1 && (
                    <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1">
                      <Home className="h-3 w-3" strokeWidth={1} />
                      In-Person
                    </span>
                  )}
                  {provider.isOnline === 1 && (
                    <span className="bg-green-500/20 text-green-300 text-[10px] px-2 py-1 uppercase tracking-widest">
                      Online Now
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Experience */}
            <div className="flex items-center gap-4 text-xs text-white/60 uppercase tracking-widest">
              {provider.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" strokeWidth={1} />
                  <span>{provider.city}</span>
                </div>
              )}
              {provider.experience && provider.experience > 0 && (
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" strokeWidth={1} />
                  <span>{provider.experience}+ years</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 pt-6 pb-6 space-y-4">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="services" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/60 data-[state=active]:text-white uppercase tracking-widest text-xs py-3"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/60 data-[state=active]:text-white uppercase tracking-widest text-xs py-3"
                >
                  About
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/60 data-[state=active]:text-white uppercase tracking-widest text-xs py-3"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-3 mt-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    data-testid={`card-service-${service.id}`}
                    className="border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-light text-white text-base tracking-wide mb-1">{service.title}</h3>
                        {service.description && (
                          <p className="text-white/60 text-xs tracking-wide line-clamp-2 mb-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Clock className="h-3 w-3" strokeWidth={1} />
                          <span className="uppercase tracking-widest">{service.duration} MIN</span>
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="text-white font-light text-2xl flex items-center">
                          <IndianRupee className="h-5 w-5" strokeWidth={1} />
                          {parseFloat(service.price).toFixed(0)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {service.virtualAvailable === 1 && (
                        <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest">
                          Virtual
                        </span>
                      )}
                      {service.inPersonAvailable === 1 && (
                        <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest">
                          In-Person
                        </span>
                      )}
                    </div>

                    <Button
                      data-testid={`button-book-service-${service.id}`}
                      onClick={() => handleBookService(service.id)}
                      className="w-full bg-white text-black hover:bg-white/90 uppercase tracking-wider text-sm font-semibold h-11"
                    >
                      <Calendar className="h-4 w-4 mr-2" strokeWidth={1.5} />
                      Book Now
                    </Button>
                  </div>
                ))}

                {services.length === 0 && (
                  <div className="border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-white/40 uppercase tracking-widest text-xs">No services available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about" className="space-y-4 mt-6">
                <div className="border border-white/10 bg-white/5 p-4 space-y-4">
                  {provider.bio && (
                    <div>
                      <h4 className="text-white font-semibold mb-2 uppercase tracking-wider text-sm">About</h4>
                      <p className="text-white/70 text-sm tracking-wide leading-relaxed">{provider.bio}</p>
                    </div>
                  )}

                  {provider.licenseNumber && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-semibold mb-2 uppercase tracking-wider text-sm">License</h4>
                      <p className="text-white/70 text-sm font-mono">{provider.licenseNumber}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Availability</h4>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Clock className="h-4 w-4" strokeWidth={1} />
                      <span className="tracking-wide">Check availability while booking</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-3 mt-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-white fill-white"
                                : "text-white/20"
                            }`}
                            strokeWidth={1}
                          />
                        ))}
                      </div>
                      <span className="text-white/40 text-xs uppercase tracking-widest">
                        {new Date(review.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                    {review.review && (
                      <p className="text-white/70 text-sm tracking-wide leading-relaxed">{review.review}</p>
                    )}
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-white/40 uppercase tracking-widest text-xs">No reviews yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
