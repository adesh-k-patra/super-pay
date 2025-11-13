import { useState } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Star,
  User,
  Car,
  Shield,
  Award,
  Clock,
  MapPin,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface Review {
  id: string;
  passengerName: string;
  rating: number;
  date: string;
  comment: string;
  tripFrom: string;
  tripTo: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    passengerName: "Priya S.",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent driver! Very professional and punctual. The car was clean and the ride was smooth. Highly recommended!",
    tripFrom: "Connaught Place",
    tripTo: "IGI Airport"
  },
  {
    id: "2",
    passengerName: "Arjun K.",
    rating: 5,
    date: "1 week ago",
    comment: "Great experience. Driver was courteous and knew the best routes to avoid traffic. Will request again!",
    tripFrom: "Nehru Place",
    tripTo: "Cyber City"
  },
  {
    id: "3",
    passengerName: "Sneha M.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Good ride overall. Driver was professional and the car was clean.",
    tripFrom: "Hauz Khas",
    tripTo: "Saket"
  }
];

export default function DriverProfile() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useUrlTab("overview");

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';

  // Mock driver data
  const driver = {
    id: id,
    name: "Rajesh Kumar",
    rating: 4.8,
    totalRatings: 1243,
    totalTrips: 1243,
    yearsOfExperience: 8,
    completionRate: 98.5,
    acceptanceRate: 95.2,
    cancellationRate: 1.5,
    phone: "+91 98765 43210",
    joinedDate: "January 2017",
    languages: ["Hindi", "English", "Punjabi"],
    specializations: ["Airport transfers", "Long distance", "City tours"],
    vehicleMake: "Maruti",
    vehicleModel: "Swift Dzire",
    vehicleNumber: "DL 01 AB 1234",
    vehicleColor: "White",
    vehicleYear: 2022,
    photo: null,
    badges: [
      { name: "Top Rated", icon: <Star className="h-4 w-4" />, color: "text-yellow-400" },
      { name: "Safety First", icon: <Shield className="h-4 w-4" />, color: "text-blue-400" },
      { name: "Expert Driver", icon: <Award className="h-4 w-4" />, color: "text-purple-400" }
    ],
    ratingDistribution: {
      5: 85,
      4: 12,
      3: 2,
      2: 0.5,
      1: 0.5
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.history.length > 1) {
                  goBack();
                } else {
                  navigate("/booking/cab/results");
                }
              }}
              className="text-white hover:bg-white/10 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold tracking-wider">DRIVER PROFILE</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Driver Header */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-32 h-32 bg-white/10 border-2 border-white/30 rounded-full flex items-center justify-center mb-4">
              <User className="h-16 w-16 text-white/60" />
            </div>
            <h2 className="text-3xl font-bold mb-2" data-testid="text-driver-name">{driver.name}</h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold" data-testid="text-rating">{driver.rating}</span>
              </div>
              <span className="text-white/50">•</span>
              <span className="text-white/60">{driver.totalRatings} ratings</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500 mb-4">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified Driver
            </Badge>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {driver.badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-2"
                data-testid={`badge-${idx}`}
              >
                <div className={badge.color}>{badge.icon}</div>
                <span className="text-sm text-white/80">{badge.name}</span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-trips">{driver.totalTrips}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-experience">{driver.yearsOfExperience}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Years</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-completion">{driver.completionRate}%</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Completion</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full bg-white/5 border border-white/10 grid grid-cols-3">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10" data-testid="tab-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="data-[state=active]:bg-white/10" data-testid="tab-vehicle">
              Vehicle
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-white/10" data-testid="tab-reviews">
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Rating Distribution */}
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
                Rating Breakdown
              </h3>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-white">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={driver.ratingDistribution[star as keyof typeof driver.ratingDistribution]} 
                        className="h-2 bg-white/10"
                      />
                    </div>
                    <div className="w-12 text-right text-sm text-white/60">
                      {driver.ratingDistribution[star as keyof typeof driver.ratingDistribution]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
                Performance Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white/60">
                    <TrendingUp className="h-4 w-4" />
                    <span>Acceptance Rate</span>
                  </div>
                  <span className="text-white font-medium">{driver.acceptanceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="h-4 w-4" />
                    <span>Completion Rate</span>
                  </div>
                  <span className="text-white font-medium">{driver.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="h-4 w-4" />
                    <span>Cancellation Rate</span>
                  </div>
                  <span className="text-white font-medium">{driver.cancellationRate}%</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
                Additional Information
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white/50 mb-1">Member since</p>
                  <p className="text-white">{driver.joinedDate}</p>
                </div>
                <Separator className="bg-white/10" />
                <div>
                  <p className="text-white/50 mb-2">Languages spoken</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.languages.map((lang, idx) => (
                      <Badge key={idx} className="bg-white/10 text-white border-white/20">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div>
                  <p className="text-white/50 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.specializations.map((spec, idx) => (
                      <Badge key={idx} className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Vehicle Tab */}
          <TabsContent value="vehicle" className="space-y-6 mt-6">
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-white/10 border border-white/20">
                  <Car className="h-10 w-10 text-white/60" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {driver.vehicleMake} {driver.vehicleModel}
                  </h3>
                  <p className="text-white/60 mb-3">{driver.vehicleColor} • {driver.vehicleYear}</p>
                  <div className="text-xl font-mono font-bold text-white" data-testid="text-vehicle-number">
                    {driver.vehicleNumber}
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10 mb-6" />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Vehicle Type</p>
                  <p className="text-white font-medium">Sedan</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Fuel Type</p>
                  <p className="text-white font-medium">Petrol</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Seating</p>
                  <p className="text-white font-medium">4 Passengers</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Transmission</p>
                  <p className="text-white font-medium">Manual</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Features</p>
                <div className="flex flex-wrap gap-2">
                  {["Air Conditioning", "GPS Navigation", "USB Charging", "Music System", "Clean & Sanitized"].map((feature, idx) => (
                    <Badge key={idx} className="bg-white/10 text-white border-white/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4 mt-6">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white/5 border border-white/10 p-6" data-testid={`review-${review.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white/60" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{review.passengerName}</p>
                      <p className="text-xs text-white/50">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 px-3 py-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-medium">{review.rating}</span>
                  </div>
                </div>
                
                <p className="text-white/80 mb-3">{review.comment}</p>
                
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <MapPin className="h-3 w-3" />
                  <span>{review.tripFrom} → {review.tripTo}</span>
                </div>
              </div>
            ))}

            {MOCK_REVIEWS.length === 0 && (
              <div className="text-center py-12 bg-white/5 border border-white/10">
                <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No reviews yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
