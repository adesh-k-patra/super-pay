import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  Share2,
  Heart,
  Info,
  Music,
  ImageIcon,
  Video,
  Bell,
  Navigation,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock event data - in production this would come from API
const getMockEvent = (id: string) => {
  const events: Record<string, any> = {
    "1": {
      id: "1",
      title: "Arijit Singh Live in Concert",
      category: "Music Concert",
      images: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
      ],
      venue: "DY Patil Stadium",
      city: "Mumbai",
      address: "D.Y. Patil Sports Stadium, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
      date: "2025-10-15",
      time: "19:00",
      endTime: "23:00",
      price: 1999,
      rating: 4.8,
      totalReviews: 2341,
      attendees: 15000,
      description: "Get ready for an unforgettable evening with the voice that has captured millions of hearts! Arijit Singh brings his magic to Mumbai for a spectacular live concert featuring all your favorite hits.",
      highlights: [
        "Live performance of chart-topping hits",
        "Special acoustic session",
        "Meet & greet packages available",
        "F&B and merchandise stalls",
        "Parking available"
      ],
      artists: [
        { name: "Arijit Singh", role: "Main Artist", image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400" },
        { name: "Pritam", role: "Music Director", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" }
      ],
      ticketTiers: [
        { id: 'vip', name: "VIP", price: 7999, available: 50, description: "Front row seats with exclusive meet & greet" },
        { id: 'premium', name: "Premium", price: 3999, available: 200, description: "Premium seating with complimentary food" },
        { id: 'standard', name: "Standard", price: 1999, available: 500, description: "General seating with great view" },
        { id: 'general', name: "General", price: 999, available: 1000, description: "Standing area" }
      ],
      tags: ["Bollywood", "Live Music", "Popular", "Romantic"],
      organizer: "InCred Events",
      contactEmail: "events@incredapp.com",
      contactPhone: "+91 98765 43210",
      website: "www.incredevents.com"
    },
    "2": {
      id: "2",
      title: "IPL Finals 2025",
      category: "Sports",
      images: [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
      ],
      venue: "Wankhede Stadium",
      city: "Mumbai",
      address: "Wankhede Stadium, D Road, Churchgate, Mumbai, Maharashtra 400020",
      date: "2025-10-20",
      time: "15:00",
      endTime: "23:00",
      price: 2499,
      rating: 4.9,
      totalReviews: 5432,
      attendees: 33000,
      description: "Witness the most thrilling cricket match of the year! The IPL Finals 2025 brings you edge-of-your-seat action as the top two teams battle it out for the championship trophy.",
      highlights: [
        "Live cricket action with top players",
        "Food stalls and beverages available",
        "Large screens for better viewing",
        "Souvenir merchandise",
        "Parking and metro connectivity"
      ],
      artists: [],
      ticketTiers: [
        { id: 'platinum', name: "Platinum", price: 8999, available: 100, description: "Premium pavilion with AC lounge" },
        { id: 'gold', name: "Gold", price: 4999, available: 500, description: "Covered seating with great view" },
        { id: 'silver', name: "Silver", price: 2499, available: 1000, description: "Open seating" },
        { id: 'general', name: "General", price: 999, available: 2000, description: "Standing area" }
      ],
      tags: ["Cricket", "IPL", "Finals", "Sports"],
      organizer: "BCCI",
      contactEmail: "ipl@bcci.tv",
      contactPhone: "+91 22 1234 5678",
      website: "www.iplt20.com"
    },
    "marathon-1": {
      id: "marathon-1",
      title: "Mumbai Marathon 2025",
      category: "Marathon",
      images: [
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
      ],
      venue: "Gateway of India, Mumbai",
      city: "Mumbai",
      address: "Gateway of India, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
      date: "2025-01-15",
      time: "06:00",
      endTime: "12:00",
      price: 2500,
      rating: 4.9,
      totalReviews: 3847,
      attendees: 5000,
      description: "Join India's most prestigious full marathon event organized by Adidas. Experience the spirit of Mumbai while running through iconic landmarks.",
      highlights: [
        "Full Marathon 42.2 km",
        "Finisher Medal & Certificate",
        "Race Kit with Premium T-Shirt",
        "Refreshments at every 5 km",
        "Medical Support & Ambulances"
      ],
      artists: [],
      ticketTiers: [
        { id: 'runner', name: "Runner Registration", price: 2500, available: 1153, description: "Complete marathon registration with race kit" }
      ],
      tags: ["Marathon", "Running", "Sports", "Fitness"],
      organizer: "Adidas Running India",
      contactEmail: "marathons@adidas.com",
      contactPhone: "+91 22 9876 5432",
      website: "www.adidasrunning.com"
    },
    "marathon-2": {
      id: "marathon-2",
      title: "Delhi Half Marathon",
      category: "Marathon",
      images: [
        "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      ],
      venue: "Jawaharlal Nehru Stadium",
      city: "New Delhi",
      address: "Jawaharlal Nehru Stadium, Pragati Vihar, New Delhi, Delhi 110003",
      date: "2024-11-30",
      time: "07:00",
      endTime: "11:00",
      price: 1500,
      rating: 4.7,
      totalReviews: 2156,
      attendees: 3000,
      description: "Run through the heart of the capital city in this Nike-organized half marathon. Perfect for intermediate runners looking to challenge themselves.",
      highlights: [
        "Half Marathon 21.1 km",
        "Finisher Medal & Certificate",
        "Nike Race Kit",
        "Hydration Stations",
        "Timing Chip & Live Tracking"
      ],
      artists: [],
      ticketTiers: [
        { id: 'runner', name: "Runner Registration", price: 1500, available: 844, description: "Complete half marathon registration" }
      ],
      tags: ["Marathon", "Running", "Sports", "Half Marathon"],
      organizer: "Nike Run Club",
      contactEmail: "events@nike.com",
      contactPhone: "+91 11 8765 4321",
      website: "www.nikerunclub.com"
    }
  };
  return events[id] || events["1"];
};

export default function EventDetail() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);

  const event = getMockEvent(id || "1");
  
  const totalAvailable = event.ticketTiers.reduce((sum: number, tier: any) => sum + tier.available, 0);
  const isMarathon = event.category === "Marathon";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleContinueBooking = () => {
    const formattedDate = format(new Date(event.date), 'MMMM d, yyyy');
    navigate(`/booking/event/${encodeURIComponent(formattedDate)}/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header with Image */}
      <div className="relative h-96">
        <img
          src={event.images[0]}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking/event/search")}
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
                    title: event.title,
                    text: `Check out this amazing event: ${event.title}`,
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

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-2 bg-white/10 text-white border-0 rounded-none">{event.category}</Badge>
          <h1 className="text-3xl font-light tracking-wider mb-2" data-testid="text-event-title">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-white/80 fill-white" />
              <span>{event.rating}</span>
              <span className="text-white/60">({event.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Users className="h-4 w-4" />
              <span>{event.attendees.toLocaleString()}+ going</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 border border-white/20">
              <Ticket className="h-4 w-4 text-white/80" />
              <span className="text-white font-light">{totalAvailable.toLocaleString()} {isMarathon ? 'spots' : 'seats'} left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Info */}
        <Card className="bg-white/5 border-white/10 rounded-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-white/80 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-light">{formatDate(event.date)}</p>
                <p className="text-white/60 text-sm">{event.time} - {event.endTime}</p>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-white/80 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-light">{event.venue}</p>
                <p className="text-white/60 text-sm">{event.address}</p>
                <Button
                  variant="link"
                  className="text-white/80 p-0 h-auto mt-1 font-light"
                  onClick={() => {}}
                  data-testid="button-get-directions"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Get Directions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Badge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-white/10 text-white border-white/20 rounded-none">
            <MapPin className="h-3 w-3 mr-1" />
            {event.city}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 rounded-none">
            <TabsTrigger value="about" className="flex-1 rounded-none">About</TabsTrigger>
            {event.artists.length > 0 && (
              <TabsTrigger value="artists" className="flex-1 rounded-none">Artists</TabsTrigger>
            )}
            <TabsTrigger value="tickets" className="flex-1 rounded-none">Tickets</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 rounded-none">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-light tracking-wider mb-2 uppercase text-white/60">Description</h3>
              <p className="text-white/70 leading-relaxed font-light">{event.description}</p>
            </div>

            <Separator className="bg-white/10" />

            <div>
              <h3 className="text-lg font-light tracking-wider mb-3 uppercase text-white/60">Event Highlights</h3>
              <ul className="space-y-2">
                {event.highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-white/70 font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="bg-white/10" />

            <div>
              <h3 className="text-lg font-light tracking-wider mb-2 uppercase text-white/60">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <Badge key={tag} className="bg-white/10 text-white border-white/20 rounded-none">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div>
              <h3 className="text-lg font-light tracking-wider mb-3 uppercase text-white/60">Organizer</h3>
              <Card className="bg-white/5 border-white/10 rounded-none">
                <CardContent className="p-4">
                  <p className="text-white font-light mb-3">{event.organizer}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <Mail className="h-4 w-4" />
                      <span className="font-light">{event.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Phone className="h-4 w-4" />
                      <span className="font-light">{event.contactPhone}</span>
                    </div>
                    {event.website && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Globe className="h-4 w-4" />
                        <span className="font-light">{event.website}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {event.artists.length > 0 && (
            <TabsContent value="artists" className="space-y-3 mt-4">
              {event.artists.map((artist: any, index: number) => (
                <Card key={index} className="bg-white/5 border-white/10 rounded-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-light tracking-wider">{artist.name}</p>
                      <p className="text-white/60 text-sm font-light">{artist.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )}

          <TabsContent value="tickets" className="space-y-3 mt-4">
            {event.ticketTiers.map((tier: any) => (
              <Card key={tier.id} className="bg-white/5 border-white/10 rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-light tracking-wider">{tier.name}</h4>
                      <p className="text-white/60 text-sm font-light">{tier.description}</p>
                    </div>
                    <Badge className={cn(
                      "rounded-none",
                      tier.available > 100 ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
                    )}>
                      {tier.available} left
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-white text-xl font-light">{formatPrice(tier.price)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {event.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square overflow-hidden">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Notify Me */}
        <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/20 rounded-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-white font-light">Get Notified</p>
                <p className="text-white/60 text-sm font-light">Receive updates about this event</p>
              </div>
            </div>
            <Button
              variant={notifyMe ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifyMe(!notifyMe)}
              className={cn(
                "rounded-none",
                notifyMe ? "bg-white/10 text-white" : "bg-white/5 border-white/20 text-white"
              )}
              data-testid="button-notify-me"
            >
              {notifyMe ? "Enabled" : "Enable"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/60 text-sm font-light">Starting from</p>
            <p className="text-white text-2xl font-light" data-testid="text-price">
              {formatPrice(event.price)}
            </p>
          </div>
          <Button
            className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none font-light tracking-wider"
            onClick={handleContinueBooking}
            data-testid="button-book-now"
          >
            BOOK NOW
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
