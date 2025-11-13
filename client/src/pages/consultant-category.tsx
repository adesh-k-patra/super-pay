import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Star,
  MapPin,
  Shield,
  Clock,
  CheckCircle2,
  Video,
  Home,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConsultantCategory, ConsultantProvider } from "@shared/schema";
import doctorImage from "@assets/stock_images/professional_medical_189fe339.jpg";
import businessImage from "@assets/stock_images/professional_busines_5064da4b.jpg";
import serviceImage from "@assets/stock_images/professional_service_fc34e515.jpg";

const placeholderImages = [doctorImage, businessImage, serviceImage];

export default function ConsultantCategory() {
  const params = useParams<{ categoryId: string }>();
  const [, navigate] = useLocation();
  const [sortBy, setSortBy] = useState<"rating" | "price" | "distance">("rating");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const { data: category } = useQuery<ConsultantCategory>({
    queryKey: [`/api/consultant/categories/${params.categoryId}`],
    enabled: !!params.categoryId,
  });

  const { data: providers = [], isLoading } = useQuery<ConsultantProvider[]>({
    queryKey: [`/api/consultant/providers?categoryId=${params.categoryId}`],
    enabled: !!params.categoryId,
  });

  const filteredProviders = providers
    .filter(p => !showVerifiedOnly || p.verified === 1)
    .sort((a, b) => {
      if (sortBy === "rating") {
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      }
      return 0;
    });

  const handleProviderClick = (providerId: string) => {
    navigate(`/consultant/provider/${providerId}`);
  };

  if (isLoading || !category) {
    return (
      <>
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
            <div className="text-white/60">Loading providers...</div>
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
              onClick={() => navigate("/consultant/explore")}
              className="text-white hover:text-white/80"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider uppercase">{category.name}</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {filteredProviders.length} Providers
              </p>
            </div>
            <div className="w-5" />
          </div>
        </div>

        <div className="pt-20 px-4 pb-6 space-y-6">
          {/* Category Description */}
          {category.description && (
            <div className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
              <p className="text-sm text-white/70 tracking-wide">{category.description}</p>
            </div>
          )}

          {/* Filter Bar */}
          <div className="space-y-3">
            {/* Verified Filter Toggle */}
            <button
              data-testid="button-filter-verified"
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className={cn(
                "w-full px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-colors border flex items-center justify-center gap-2",
                showVerifiedOnly
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
              )}
            >
              <Shield className="h-3 w-3" strokeWidth={1.5} />
              Verified Providers Only
            </button>

            {/* Sort Options */}
            <div className="flex gap-2">
              <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as "rating" | "price" | "distance")} className="flex-1">
                <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none">
                  <TabsTrigger
                    value="rating"
                    className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70 flex-1"
                    data-testid="button-sort-rating"
                  >
                    <Star className="h-3 w-3 mr-1" strokeWidth={1.5} />
                    Top Rated
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <button
                data-testid="button-filter-available"
                className="flex-1 px-4 pb-3 text-[10px] font-light uppercase tracking-widest text-white/30 border-b-2 border-transparent cursor-not-allowed flex items-center justify-center gap-1"
                disabled
              >
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                Available Now
              </button>
            </div>
          </div>

          {/* Provider List */}
          <div className="space-y-3">
            {filteredProviders.map((provider, index) => {
              const imageIndex = index % placeholderImages.length;
              return (
                <div
                  key={provider.id}
                  data-testid={`card-provider-${provider.id}`}
                  onClick={() => handleProviderClick(provider.id)}
                  className="border border-white/10 bg-white/5 hover:border-white/20 cursor-pointer transition-all"
                >
                  <div className="flex gap-4 p-4">
                    {/* Provider Image */}
                    <div className="w-24 h-24 shrink-0 overflow-hidden bg-white/5">
                      <img
                        src={provider.profileImage || placeholderImages[imageIndex]}
                        alt={provider.name}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-light text-white text-base tracking-wide mb-1 flex items-center gap-2">
                            {provider.name}
                            {provider.verified === 1 && (
                              <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0" strokeWidth={1} />
                            )}
                          </h3>
                          {provider.designation && (
                            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">{provider.designation}</p>
                          )}
                        </div>
                        
                        {provider.rating && parseFloat(provider.rating) > 0 && (
                          <div className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-1 flex-shrink-0">
                            <Star className="h-3 w-3 text-white fill-white" strokeWidth={1} />
                            <span className="text-white text-sm font-light">
                              {parseFloat(provider.rating).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
                        {provider.experience && provider.experience > 0 && (
                          <span className="uppercase tracking-widest">{provider.experience}+ YRS</span>
                        )}
                        {provider.totalBookings && provider.totalBookings > 0 && (
                          <span className="uppercase tracking-widest">{provider.totalBookings} BOOKINGS</span>
                        )}
                      </div>

                      {/* Location */}
                      {provider.city && (
                        <div className="flex items-center gap-1 text-white/60 text-xs mb-2">
                          <MapPin className="h-3 w-3" strokeWidth={1} />
                          <span className="uppercase tracking-widest">{provider.city}</span>
                        </div>
                      )}

                      {/* Availability Badges */}
                      <div className="flex gap-2 flex-wrap">
                        {provider.virtualAvailable === 1 && (
                          <span className="bg-white/10 text-white border-0 text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1">
                            <Video className="h-3 w-3" strokeWidth={1} />
                            Virtual
                          </span>
                        )}
                        {provider.inPersonAvailable === 1 && (
                          <span className="bg-white/10 text-white border-0 text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1">
                            <Home className="h-3 w-3" strokeWidth={1} />
                            In-Person
                          </span>
                        )}
                        {provider.isOnline === 1 && (
                          <span className="bg-green-500/20 text-green-300 border-0 text-[10px] px-2 py-1 uppercase tracking-widest">
                            Online Now
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <ChevronRight className="h-5 w-5 text-white/40" strokeWidth={1} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProviders.length === 0 && (
            <div className="border border-white/10 bg-white/5 p-12 text-center">
              <div className="text-white/40 mb-2 uppercase tracking-widest text-xs">No providers found</div>
              <p className="text-white/60 text-xs uppercase tracking-widest">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
