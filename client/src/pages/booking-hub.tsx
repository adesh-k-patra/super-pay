import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { AnimatedGrid, AnimatedCard } from "@/components/ui/animated-content";
import { SlideUp } from "@/components/ui/page-transition";
import { 
  Plane, 
  Bus, 
  Train,
  Car,
  Navigation,
  Package,
  Search,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  ArrowLeft,
  ChevronRight
} from "lucide-react";

interface ServiceCard {
  id: string;
  type: "flight" | "bus" | "train" | "cab" | "metro" | "rental";
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  trending: boolean;
  path: string;
}

const services: ServiceCard[] = [
  {
    id: "flight",
    type: "flight",
    title: "Flight Booking",
    description: "Book domestic and international flights",
    icon: Plane,
    color: "bg-white/10",
    bgColor: "bg-white/5",
    borderColor: "bg-white/10",
    features: ["Instant Booking", "Best Prices", "Multiple Airlines"],
    trending: true,
    path: "/booking/flight/search"
  },
  {
    id: "train",
    type: "train",
    title: "Train Booking",
    description: "Reserve train tickets across India",
    icon: Train,
    color: "bg-white/10",
    bgColor: "bg-white/5",
    borderColor: "bg-white/10",
    features: ["IRCTC Integration", "Tatkal Booking", "PNR Status"],
    trending: false,
    path: "/booking/train/search"
  },
  {
    id: "bus",
    type: "bus",
    title: "Bus Booking",
    description: "Book intercity and interstate buses",
    icon: Bus,
    color: "bg-white/10",
    bgColor: "bg-white/5",
    borderColor: "bg-white/10",
    features: ["AC/Non-AC", "Sleeper/Seater", "Live Tracking"],
    trending: false,
    path: "/booking/bus/search"
  },
  {
    id: "cab",
    type: "cab",
    title: "Cab Booking",
    description: "Book instant rides and outstation cabs",
    icon: Car,
    color: "bg-white/10",
    bgColor: "bg-white/5",
    borderColor: "bg-white/10",
    features: ["Instant Rides", "Safety First", "24/7 Available"],
    trending: true,
    path: "/booking/cab/search"
  },
  {
    id: "metro",
    type: "metro",
    title: "Metro Booking",
    description: "Book metro cards and passes",
    icon: Navigation,
    color: "bg-white/10",
    bgColor: "bg-white/5",
    borderColor: "bg-white/10",
    features: ["Smart Cards", "Monthly Pass", "QR Tickets"],
    trending: false,
    path: "/booking/metro/search"
  },
  {
    id: "rental",
    type: "rental",
    title: "Vehicle Rental",
    description: "Rent cars, bikes for hours or days",
    icon: Package,
    color: "bg-white/10",
    bgColor: "bg-white/10",
    borderColor: "bg-white/10",
    features: ["Self Drive", "Hourly/Daily", "All Brands"],
    trending: true,
    path: "/booking/rental/search"
  }
];

export default function BookingHub() {
  const [, navigate] = useLocation();

  const pagination = usePagination({
    data: services,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-wider" data-testid="page-title">
                  BOOK YOUR TRAVEL
                </h1>
                <p className="text-white/60">Choose your preferred mode of transportation</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/my-bookings")}
              className="bg-white/10 hover:bg-white/15 text-white rounded-none"
              data-testid="button-my-bookings"
            >
              My Bookings
            </Button>
          </div>

          {/* Quick Search */}
          <Card className="bg-black border-white/20 rounded-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-white/60">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      placeholder="Enter origin city"
                      className="bg-white/5 border-white/20 text-white pl-10 rounded-none"
                      data-testid="input-from"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-white/60">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      placeholder="Enter destination city"
                      className="bg-white/5 border-white/20 text-white pl-10 rounded-none"
                      data-testid="input-to"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <SlideUp delay={0.1} className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Choose Service</h2>
          <p className="text-white/60">Select how you want to travel</p>
        </SlideUp>

        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" delay={0.2}>
          {pagination.paginatedData.map((service) => {
            const Icon = service.icon;
            return (
              <AnimatedCard key={service.id}>
              <Card 
                className={`bg-black ${service.borderColor} border rounded-none hover:border-white/40 transition-all cursor-pointer group relative overflow-hidden`}
                onClick={() => navigate(service.path)}
                data-testid={`card-${service.type}`}
              >
                {service.trending && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white/10 border bg-white/10 px-3 py-1 rounded-none flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 bg-white/10" />
                      <span className="text-xs bg-white/10 font-medium">Trending</span>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className={`p-4 ${service.bgColor} ${service.borderColor} border rounded-none w-fit mb-4`}>
                    <Icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                  <CardDescription className="text-white/60">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
                        <Star className="h-3 w-3 text-white/40" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${service.bgColor} ${service.color} border ${service.borderColor} hover:bg-white/5 rounded-none`}
                    variant="outline"
                    data-testid={`button-book-${service.type}`}
                  >
                    Book {service.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              </AnimatedCard>
            );
          })}
        </AnimatedGrid>

          {services.length > 0 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              className="mt-6"
            />
          )}
        </div>

        {/* Recent Bookings Quick Access */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Bookings</h2>
              <p className="text-white/60">Quick access to your latest travel plans</p>
            </div>
            <Button
              variant="outline"
              className="border-white/20 text-white rounded-none"
              onClick={() => navigate("/my-bookings")}
              data-testid="button-view-all-bookings"
            >
              View All
            </Button>
          </div>

          <Card className="bg-black border-white/20 rounded-none">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-none">
                  <Calendar className="h-12 w-12 text-white/40" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Recent Bookings</h3>
                  <p className="text-white/60 mb-4">Start booking your travel to see them here</p>
                  <Button
                    onClick={() => navigate("/booking/flight/search")}
                    className="bg-white/10 hover:bg-white/15 text-white rounded-none"
                    data-testid="button-start-booking"
                  >
                    Start Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
