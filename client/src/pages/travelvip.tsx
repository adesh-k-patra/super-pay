import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Crown, 
  Plane, 
  Train, 
  Bus, 
  Hotel, 
  Car, 
  Film, 
  Calendar,
  CheckCircle,
  Star,
  MapPin,
  Percent,
  Shield,
  Clock,
  XCircle,
  Gift,
  Sparkles,
  Briefcase,
  Coffee,
  Luggage,
  Ticket
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { TravelVipMembership } from "@shared/schema";

interface TravelFeature {
  title: string;
  description: string;
  icon: typeof CheckCircle;
}

interface PlanBenefits {
  flight: TravelFeature[];
  bus: TravelFeature[];
  train: TravelFeature[];
  hotel: TravelFeature[];
  metro: TravelFeature[];
  rental: TravelFeature[];
  taxi: TravelFeature[];
  movie: TravelFeature[];
  event: TravelFeature[];
}

export default function TravelVIP() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'silver' | 'gold' | 'platinum'>('gold');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'flight' | 'bus' | 'train' | 'hotel' | 'metro' | 'rental' | 'taxi' | 'movie' | 'event'>('all');

  const { data: membership } = useQuery<{ membership: TravelVipMembership | null }>({
    queryKey: ["/api/travelvip/membership"],
    enabled: isAuthenticated,
  });

  const hasActiveMembership = membership?.membership?.status === 'active';

  const plans = [
    {
      id: 'basic' as const,
      name: 'BASIC',
      price: 199,
      duration: '/month',
      discount: 'Up to 10% off',
    },
    {
      id: 'silver' as const,
      name: 'SILVER',
      price: 299,
      duration: '/month',
      discount: 'Up to 15% off',
      popular: true,
    },
    {
      id: 'gold' as const,
      name: 'GOLD',
      price: 499,
      duration: '/month',
      discount: 'Up to 20% off',
      badge: 'BEST VALUE',
    },
    {
      id: 'platinum' as const,
      name: 'PLATINUM',
      price: 799,
      duration: '/month',
      discount: 'Up to 25% off',
      badge: 'PREMIUM',
    },
  ];

  const categories = [
    { id: 'all' as const, name: 'All', icon: Sparkles },
    { id: 'flight' as const, name: 'Flight', icon: Plane },
    { id: 'bus' as const, name: 'Bus', icon: Bus },
    { id: 'train' as const, name: 'Train', icon: Train },
    { id: 'hotel' as const, name: 'Hotel', icon: Hotel },
    { id: 'metro' as const, name: 'Metro', icon: Train },
    { id: 'rental' as const, name: 'Rental', icon: Car },
    { id: 'taxi' as const, name: 'Taxi', icon: MapPin },
    { id: 'movie' as const, name: 'Movie', icon: Film },
    { id: 'event' as const, name: 'Event', icon: Calendar },
  ];

  const planBenefits: PlanBenefits = {
    flight: [
      { title: 'Flight Discount', description: 'Up to 20% off on all domestic and international flights', icon: Percent },
      { title: 'Airport Lounge Access', description: 'Complimentary access to 200+ airport lounges worldwide', icon: Coffee },
      { title: 'Priority Check-in', description: 'Skip the queue with priority check-in counters', icon: Ticket },
      { title: 'Early Booking', description: 'Get access to early bird tickets 48 hours before public sale', icon: Clock },
      { title: 'Free Cancellation', description: 'Cancel or reschedule flights with zero penalty fees', icon: XCircle },
      { title: 'Extra Baggage', description: 'Complimentary 5kg extra baggage allowance', icon: Luggage },
      { title: 'Travel Insurance', description: 'Free travel insurance up to ₹10 lakhs per trip', icon: Shield },
      { title: 'Seat Selection', description: 'Free seat selection for all bookings', icon: CheckCircle },
    ],
    bus: [
      { title: 'Bus Discount', description: 'Up to 15% off on all intercity and local bus bookings', icon: Percent },
      { title: 'Seat Selection Priority', description: 'Choose your preferred seats before other passengers', icon: Ticket },
      { title: 'Express Boarding', description: 'Priority boarding for all bus journeys', icon: Clock },
      { title: 'Free Cancellation', description: 'Cancel up to 2 hours before departure with no charges', icon: XCircle },
      { title: 'Extra Services', description: 'Complimentary blankets and refreshments on select routes', icon: Gift },
      { title: 'Travel Insurance', description: 'Basic travel insurance included for all journeys', icon: Shield },
    ],
    train: [
      { title: 'Train Discount', description: 'Up to 12% off on railway bookings (AC classes)', icon: Percent },
      { title: 'Priority Seat Alerts', description: 'Get notified first when waitlisted tickets get confirmed', icon: Clock },
      { title: 'AC Upgrade Discounts', description: 'Discounted upgrades from sleeper to AC classes', icon: Sparkles },
      { title: 'Express Boarding Help', description: 'Station assistance for boarding and luggage', icon: Briefcase },
      { title: 'Free Cancellation', description: 'Flexible cancellation with minimal charges', icon: XCircle },
      { title: 'Porter Service', description: 'Complimentary porter service at major stations', icon: Luggage },
    ],
    hotel: [
      { title: 'Hotel Discount', description: 'Up to 20% off on all hotel and resort bookings', icon: Percent },
      { title: 'Late Check-out', description: 'Complimentary late check-out till 2 PM (subject to availability)', icon: Clock },
      { title: 'Early Check-in', description: 'Check-in as early as 9 AM at no extra cost', icon: Clock },
      { title: 'Breakfast Upgrade', description: 'Free breakfast upgrade to buffet for 2 guests', icon: Coffee },
      { title: 'Room Upgrade', description: 'Subject-to-availability room upgrades on long stays', icon: Sparkles },
      { title: 'Free Cancellation', description: 'Cancel bookings up to 24 hours before check-in', icon: XCircle },
      { title: 'Remote Check-in', description: 'Skip the front desk with express check-in via app', icon: Ticket },
      { title: 'Special Amenities', description: 'Welcome drinks and complimentary WiFi', icon: Gift },
    ],
    metro: [
      { title: 'Metro Discounts', description: 'Up to 10% off on metro cards and passes', icon: Percent },
      { title: 'Fast-lane Entry', description: 'Priority entry lanes at major metro stations', icon: Clock },
      { title: 'Digital Metro Passes', description: 'Convenient digital passes on your phone', icon: Ticket },
      { title: 'Multi-city Coverage', description: 'Valid across all major metro cities in India', icon: MapPin },
      { title: 'Monthly Subscriptions', description: 'Save more with monthly unlimited travel passes', icon: Star },
    ],
    rental: [
      { title: 'Rental Discount', description: 'Up to 18% off on car and bike rental bookings', icon: Percent },
      { title: 'Priority Pickup', description: 'Skip the queue and get your vehicle faster', icon: Clock },
      { title: 'Free Extras', description: 'Complimentary child seats, GPS, and phone mounts', icon: Gift },
      { title: 'Extended Coverage', description: 'Enhanced insurance coverage at no additional cost', icon: Shield },
      { title: 'Fuel Credit', description: 'Get ₹500 fuel credit on rentals over 3 days', icon: Sparkles },
      { title: 'Free Cancellation', description: 'Cancel up to 6 hours before pickup with no penalty', icon: XCircle },
    ],
    taxi: [
      { title: 'Taxi Discount', description: 'Up to 15% off on all cab and auto bookings', icon: Percent },
      { title: 'Priority Pickup', description: 'Get matched with drivers faster during peak hours', icon: Clock },
      { title: 'Premium Vehicles', description: 'Access to premium sedan and SUV categories', icon: Car },
      { title: 'City Day Passes', description: 'Unlimited rides within city limits for a fixed price', icon: Ticket },
      { title: 'No Surge Pricing', description: 'Protected from surge pricing during peak times', icon: Shield },
    ],
    movie: [
      { title: 'Movie Ticket Discount', description: 'Up to 25% off on all movie tickets', icon: Percent },
      { title: 'Pre-sale Access', description: 'Book tickets 24 hours before public release', icon: Clock },
      { title: 'Premium Seats', description: 'Access to exclusive member-only premium seating', icon: Ticket },
      { title: 'F&B Discounts', description: 'Get 20% off on popcorn, drinks, and snacks', icon: Coffee },
      { title: 'Free Cancellation', description: 'Cancel tickets up to 2 hours before showtime', icon: XCircle },
      { title: 'Concierge Booking', description: 'Personal assistance for group bookings', icon: Sparkles },
    ],
    event: [
      { title: 'Event Ticket Discount', description: 'Up to 20% off on concerts, shows, and sports events', icon: Percent },
      { title: 'Early Bird Access', description: 'Get first access to tickets before public sale', icon: Clock },
      { title: 'VIP Seating', description: 'Access to VIP and premium seating categories', icon: Star },
      { title: 'Skip-the-line Entry', description: 'Express entry lanes at all major events', icon: Ticket },
      { title: 'Exclusive Merchandise', description: 'Get exclusive member-only event merchandise', icon: Gift },
      { title: 'Free Cancellation', description: 'Cancel or transfer tickets up to 7 days before event', icon: XCircle },
    ],
  };

  const getAllBenefits = () => {
    const allFeatures: TravelFeature[] = [];
    Object.entries(planBenefits).forEach(([category, features]) => {
      allFeatures.push(...features);
    });
    return allFeatures;
  };

  const getDisplayedBenefits = () => {
    if (selectedCategory === 'all') {
      return getAllBenefits();
    }
    return planBenefits[selectedCategory] || [];
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      const params = new URLSearchParams({
        amount: plan.price.toString(),
        transactionType: 'travelvip',
        planType: selectedPlan,
        returnUrl: '/travelvip/membership'
      });
      navigate(`/upi-payment?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-semibold tracking-widest uppercase">TravelVIP</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Premium Membership</p>
          </div>
          <div className="w-10">
            {hasActiveMembership && (
              <Badge className="bg-white/20 text-white border-white/30 rounded-none font-light text-[10px]">
                ACTIVE
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Header Info */}
        <div className="border-b border-white/10 p-6 bg-white/5">
          <div className="flex gap-3 mb-4">
            <Crown className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1} />
            <div>
              <h2 className="font-semibold text-white mb-1 tracking-wider uppercase text-sm">All-in-One Travel Membership</h2>
              <p className="text-xs text-white/40 font-light">Unlock exclusive benefits across flights, hotels, trains, buses, and more</p>
            </div>
          </div>
        </div>

        {/* Plans Horizontal Tabs */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 font-light">Select Plan</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`min-w-[140px] p-4 border transition-all ${
                  selectedPlan === plan.id
                    ? 'border-white bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
                data-testid={`plan-${plan.id}`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-xs font-semibold text-white tracking-widest uppercase">{plan.name}</p>
                    {plan.badge && (
                      <Badge className="bg-white/20 text-white border-white/30 rounded-none font-light text-[8px] px-1 py-0">
                        {plan.badge}
                      </Badge>
                    )}
                    {plan.popular && (
                      <Badge className="bg-white/20 text-white border-white/30 rounded-none font-light text-[8px] px-1 py-0">
                        POPULAR
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xl font-light text-white">₹{plan.price}</span>
                    <span className="text-[10px] text-white/40 font-light uppercase">{plan.duration}</span>
                  </div>
                  <p className="text-[10px] text-white/50 font-light">{plan.discount}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 font-light">Categories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 border transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'border-white bg-white text-black'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  data-testid={`category-${category.id}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1} />
                  <span className="text-xs font-light uppercase tracking-wider">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Benefits List */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 font-light">
            {selectedCategory === 'all' ? 'All Benefits' : `${categories.find(c => c.id === selectedCategory)?.name} Benefits`}
          </h3>
          <div className="space-y-3">
            {getDisplayedBenefits().map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="border-b border-white/10 p-5 bg-white/5 hover:bg-white/10 transition-all"
                  data-testid={`benefit-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-white/20 flex items-center justify-center flex-shrink-0 bg-black/80">
                      <Icon className="h-5 w-5 text-white/60" strokeWidth={1} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white mb-1 tracking-wide uppercase">{benefit.title}</h4>
                      <p className="text-xs text-white/50 font-light">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <div className="border border-white/20 p-6 bg-white/5">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1} />
            <div>
              <h4 className="font-semibold text-white mb-2 tracking-wide uppercase text-sm">Why TravelVIP?</h4>
              <ul className="space-y-1.5 text-sm text-white/60 font-light">
                <li>• Save up to ₹6,000 annually on travel expenses</li>
                <li>• Priority access and faster services across all bookings</li>
                <li>• Flexible cancellation policies with minimal charges</li>
                <li>• 24/7 premium customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        {hasActiveMembership ? (
          <Button
            onClick={() => navigate('/travelvip/membership')}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-sm font-light tracking-widest uppercase"
            data-testid="button-view-membership"
          >
            <Crown className="h-5 w-5 mr-2" strokeWidth={1} />
            View My Membership
          </Button>
        ) : (
          <Button
            onClick={handleSubscribe}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-sm font-light tracking-widest uppercase"
            data-testid="button-subscribe"
          >
            <Crown className="h-5 w-5 mr-2" strokeWidth={1} />
            Subscribe for ₹{plans.find(p => p.id === selectedPlan)?.price}
          </Button>
        )}
      </div>
    </div>
  );
}
