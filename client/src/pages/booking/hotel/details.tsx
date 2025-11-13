import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  UtensilsCrossed,
  Car,
  Dumbbell,
  Waves,
  Wind,
  Coffee,
  Clock,
  Users,
  Bed,
  Maximize,
  Check,
  Share2,
  Heart,
  Navigation,
  Phone,
  Mail,
  Sparkles,
  Award,
  ShieldCheck,
  Info,
  Camera,
  MessageSquare,
  ThumbsUp,
  User,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock hotel detail data
const getMockHotelDetail = (id: string) => {
  const hotels: Record<string, any> = {
    "1": {
      id: "1",
      name: "The Taj Mahal Palace",
      city: "Mumbai",
      area: "Colaba",
      address: "Apollo Bunder, Colaba, Mumbai, Maharashtra 400001",
      starRating: 5,
      rating: 4.8,
      totalReviews: 3452,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
      ],
      amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Bar", "Room Service", "Concierge", "Laundry"],
      propertyType: "Luxury Hotel",
      description: "Experience timeless luxury at The Taj Mahal Palace, Mumbai's most iconic hotel. With stunning views of the Arabian Sea and the Gateway of India, this heritage property combines old-world charm with modern amenities.",
      highlights: [
        "UNESCO World Heritage site view",
        "Award-winning restaurants",
        "Jiva Spa with traditional Indian therapies",
        "24/7 butler service",
        "Heritage architecture dating to 1903"
      ],
      reviews: [
        {
          id: 1,
          userName: "Rajesh Kumar",
          rating: 5,
          date: "2024-09-15",
          comment: "Absolutely phenomenal experience! The heritage charm combined with modern luxury is unmatched. The sea view from our room was breathtaking.",
          helpful: 24
        },
        {
          id: 2,
          userName: "Sarah Williams",
          rating: 5,
          date: "2024-09-10",
          comment: "The Taj never disappoints. Impeccable service, stunning architecture, and the location is perfect for exploring Mumbai. The breakfast spread was incredible!",
          helpful: 18
        },
        {
          id: 3,
          userName: "Amit Patel",
          rating: 4,
          date: "2024-09-05",
          comment: "Great hotel with rich history. Rooms are well-maintained and the staff is very courteous. A bit pricey but worth it for special occasions.",
          helpful: 12
        },
        {
          id: 4,
          userName: "Emily Chen",
          rating: 5,
          date: "2024-08-28",
          comment: "The Jiva Spa was absolutely divine! Best hotel spa experience I've ever had. The therapists were highly skilled and professional.",
          helpful: 15
        },
        {
          id: 5,
          userName: "Vikram Singh",
          rating: 5,
          date: "2024-08-20",
          comment: "Perfect for a romantic getaway. The ambiance is magical, especially in the evening. The Gateway of India view from the terrace is stunning.",
          helpful: 9
        }
      ],
      checkInTime: "15:00",
      checkOutTime: "12:00",
      rooms: [
        {
          id: "r1",
          roomType: "Deluxe Sea View",
          bedType: "King Bed",
          maxOccupancy: 2,
          roomSize: 450,
          basePrice: 12500,
          images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"],
          amenities: ["Sea View", "Mini Bar", "Smart TV", "Coffee Maker"],
          available: 5
        },
        {
          id: "r2",
          roomType: "Palace Suite",
          bedType: "King Bed + Sofa Bed",
          maxOccupancy: 4,
          roomSize: 800,
          basePrice: 25000,
          images: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800"],
          amenities: ["Sea View", "Living Room", "Dining Area", "Butler Service"],
          available: 2
        },
        {
          id: "r3",
          roomType: "Heritage Grand Suite",
          bedType: "King Bed",
          maxOccupancy: 3,
          roomSize: 1200,
          basePrice: 45000,
          images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"],
          amenities: ["Sea View", "2 Bedrooms", "Private Terrace", "Jacuzzi"],
          available: 1
        }
      ],
      policies: [
        "Check-in from 3:00 PM, Check-out until 12:00 PM",
        "Early check-in and late check-out subject to availability",
        "Valid ID proof required at check-in",
        "Pets not allowed",
        "Smoking not allowed in rooms"
      ],
      contactPhone: "+91 22 6665 3366",
      contactEmail: "reservations@tajhotels.com"
    },
    "2": {
      id: "2",
      name: "Oberoi Mumbai",
      city: "Mumbai",
      area: "Nariman Point",
      address: "Nariman Point, Mumbai, Maharashtra 400021",
      starRating: 5,
      rating: 4.7,
      totalReviews: 2891,
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
      ],
      amenities: ["WiFi", "Restaurant", "Parking", "Gym", "Pool", "Spa", "Business Center"],
      propertyType: "Luxury Hotel",
      description: "The Oberoi Mumbai offers unparalleled luxury in the heart of the business district. With panoramic ocean views and world-class service, it's perfect for both business and leisure travelers.",
      highlights: [
        "Panoramic Arabian Sea views",
        "Multiple award-winning restaurants",
        "State-of-the-art spa",
        "Business center with meeting rooms",
        "Close to business district"
      ],
      reviews: [
        {
          id: 1,
          userName: "Priya Sharma",
          rating: 5,
          date: "2024-09-12",
          comment: "Outstanding service and beautiful ocean views. The spa is world-class!",
          helpful: 16
        },
        {
          id: 2,
          userName: "David Lee",
          rating: 4,
          date: "2024-09-08",
          comment: "Great business hotel with excellent meeting facilities. Very professional staff.",
          helpful: 11
        }
      ],
      checkInTime: "14:00",
      checkOutTime: "12:00",
      rooms: [
        {
          id: "r1",
          roomType: "Luxury Room Ocean View",
          bedType: "King Bed",
          maxOccupancy: 2,
          roomSize: 500,
          basePrice: 11000,
          images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"],
          amenities: ["Ocean View", "Work Desk", "Smart TV", "Mini Bar"],
          available: 8
        },
        {
          id: "r2",
          roomType: "Premier Suite",
          bedType: "King Bed",
          maxOccupancy: 3,
          roomSize: 750,
          basePrice: 18000,
          images: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800"],
          amenities: ["Ocean View", "Separate Living Room", "Butler Service"],
          available: 3
        }
      ],
      policies: [
        "Check-in from 2:00 PM, Check-out until 12:00 PM",
        "Photo ID and credit card required at check-in",
        "No pets allowed",
        "Non-smoking property"
      ],
      contactPhone: "+91 22 6632 5757",
      contactEmail: "reservations@oberoihotels.com"
    }
  };
  return hotels[id] || hotels["1"];
};

export default function HotelDetails() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const hotelId = searchParams.get('id') || '1';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const rooms = searchParams.get('rooms') || '1';
  const guests = searchParams.get('guests') || '2';

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedRoom, setExpandedRoom] = useState<any | null>(null);
  const [expandedRoomImageIndex, setExpandedRoomImageIndex] = useState(0);

  const hotel = getMockHotelDetail(hotelId);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      'WiFi': Wifi,
      'Restaurant': UtensilsCrossed,
      'Parking': Car,
      'Gym': Dumbbell,
      'Pool': Waves,
      'Spa': Sparkles,
      'Bar': Coffee,
      'Beach': Wind,
      'Room Service': Check,
      'Concierge': Award,
      'Laundry': Check,
      'Business Center': Check
    };
    return icons[amenity] || Check;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRoomSelect = (roomId: string) => {
    const room = hotel.rooms.find((r: any) => r.id === roomId);
    if (room) {
      setExpandedRoom(room);
      setExpandedRoomImageIndex(0);
    }
  };

  const handleBookRoom = (room: any) => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      rooms,
      guests
    });
    navigate(`/booking/hotel/book?${params.toString()}`);
  };

  const handleBook = () => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      rooms,
      guests
    });
    navigate(`/booking/hotel/book?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const city = params.get('checkIn') ? `?city=${hotel.city}&checkIn=${params.get('checkIn')}&checkOut=${params.get('checkOut')}&rooms=${params.get('rooms')}&guests=${params.get('guests')}` : '';
              navigate(`/booking/hotel/results${city}`);
            }}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider uppercase">{hotel.name.substring(0, 20)}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {nights} Night{nights > 1 ? 's' : ''} • {rooms} Room{parseInt(rooms) > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-favorite"
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-white")} />
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-80 mt-16">
        <img
          src={hotel.images[currentImageIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Image Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {hotel.images.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
              )}
              data-testid={`image-dot-${idx}`}
            />
          ))}
        </div>

        {/* Hotel Name Overlay */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(hotel.starRating)].map((_: any, i: number) => (
              <Star key={i} className="h-4 w-4 text-white fill-white" />
            ))}
          </div>
          <h2 className="text-2xl font-light tracking-wide mb-1">{hotel.name}</h2>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            <span className="font-light">{hotel.area}, {hotel.city}</span>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 py-6 pb-24">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-6 gap-0 mb-6">
            <TabsTrigger 
              value="overview" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rooms" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-rooms"
            >
              Rooms
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-photos"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-reviews"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="amenities" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-amenities"
            >
              Amenities
            </TabsTrigger>
            <TabsTrigger 
              value="policies" 
              className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
              data-testid="tab-policies"
            >
              Policies
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Rating Card */}
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 px-3 py-2 rounded-none">
                      <p className="text-2xl font-light">{hotel.rating}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_: any, i: number) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(hotel.rating) ? "text-white fill-white" : "text-white/30"
                            )} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-white/60 font-light">
                        {hotel.totalReviews.toLocaleString()} reviews
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    {hotel.propertyType}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                  <Info className="h-3 w-3" />
                  <span>About this property</span>
                </div>
                <p className="text-white/80 font-light leading-relaxed">{hotel.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                  <Award className="h-3 w-3" />
                  <span>Property Highlights</span>
                </div>
                <div className="space-y-2">
                  {hotel.highlights.map((highlight: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80 font-light">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                  <MapPin className="h-3 w-3" />
                  <span>Location</span>
                </div>
                <p className="text-white/80 font-light">{hotel.address}</p>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-none font-light">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Check-in/out Times */}
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-2">
                      <Clock className="h-3 w-3" />
                      <span>Check-in</span>
                    </div>
                    <p className="text-lg font-light">{hotel.checkInTime}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-2">
                      <Clock className="h-3 w-3" />
                      <span>Check-out</span>
                    </div>
                    <p className="text-lg font-light">{hotel.checkOutTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-4">
            {hotel.rooms.map((room: any) => {
              const totalPrice = room.basePrice * nights;

              return (
                <Card
                  key={room.id}
                  className="bg-white/5 border rounded-none overflow-hidden transition-all cursor-pointer border-white/20 hover:border-white/40"
                  onClick={() => handleRoomSelect(room.id)}
                  data-testid={`room-card-${room.id}`}
                >
                  <CardContent className="p-0">
                    <div className="relative h-48">
                      <img
                        src={room.images[0]}
                        alt={room.roomType}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {room.available <= 3 && (
                        <Badge className="absolute top-3 right-3 bg-red-500/90 text-white border-0 rounded-none text-xs px-2 py-1">
                          Only {room.available} left
                        </Badge>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-2">{room.roomType}</h3>
                        
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-white/60">
                            <Bed className="h-4 w-4" />
                            <span className="text-xs font-light">{room.bedType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60">
                            <Users className="h-4 w-4" />
                            <span className="text-xs font-light">{room.maxOccupancy} Guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60">
                            <Maximize className="h-4 w-4" />
                            <span className="text-xs font-light">{room.roomSize} sq ft</span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {room.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                            <Badge key={idx} className="bg-white/5 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 3 && (
                            <Badge className="bg-white/5 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                              +{room.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-white/40 font-light mb-1">
                            {nights} night{nights > 1 ? 's' : ''}
                          </p>
                          <p className="text-2xl font-light">{formatPrice(totalPrice)}</p>
                          <p className="text-xs text-white/60 font-light">+ taxes & fees</p>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="grid grid-cols-2 gap-3">
              {hotel.galleryImages.map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden bg-white/5 border border-white/10 rounded-none cursor-pointer hover:border-white/30 transition-all"
                  onClick={() => {
                    setCurrentImageIndex(idx % hotel.images.length);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  data-testid={`gallery-image-${idx}`}
                >
                  <img
                    src={image}
                    alt={`${hotel.name} - Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {/* Reviews Summary */}
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-light mb-1">{hotel.rating}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_: any, i: number) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(hotel.rating) ? "text-white fill-white" : "text-white/30"
                          )} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-white/60 font-light">
                      Based on {hotel.totalReviews.toLocaleString()} reviews
                    </p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-white/20" />
                </div>
              </CardContent>
            </Card>

            {/* Individual Reviews */}
            {hotel.reviews?.map((review: any) => (
              <Card key={review.id} className="bg-white/5 border border-white/20 rounded-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                        <User className="h-5 w-5 text-white/60" />
                      </div>
                      <div>
                        <p className="text-white font-light">{review.userName}</p>
                        <p className="text-xs text-white/40">{formatDate(review.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-none">
                      <Star className="h-3 w-3 text-white fill-white" />
                      <span className="text-sm font-light">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/80 font-light leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white h-auto p-0 font-light text-xs"
                      data-testid={`review-helpful-${review.id}`}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities">
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {hotel.amenities.map((amenity: string, idx: number) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-none">
                        <Icon className="h-5 w-5 text-white/60" />
                        <span className="text-sm font-light text-white/80">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies">
            <Card className="bg-white/5 border border-white/20 rounded-none">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Hotel Policies</span>
                </div>
                <div className="space-y-3">
                  {hotel.policies.map((policy: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <Check className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/80 font-light">{policy}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Expanded Room Dialog */}
      <Dialog open={!!expandedRoom} onOpenChange={(open) => !open && setExpandedRoom(null)}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {expandedRoom && (
            <>
              {/* Close Button */}
              <button
                onClick={() => setExpandedRoom(null)}
                className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-sm p-2 border border-white/20 hover:bg-black/90 transition-all"
                data-testid="button-close-room-dialog"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Room Images Carousel */}
              <div className="relative h-80 bg-white/5">
                <img
                  src={expandedRoom.images[expandedRoomImageIndex] || expandedRoom.images[0]}
                  alt={expandedRoom.roomType}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {expandedRoom.available <= 3 && (
                  <Badge className="absolute top-4 left-4 bg-red-500/90 text-white border-0 rounded-none text-xs px-3 py-1.5">
                    Only {expandedRoom.available} left
                  </Badge>
                )}

                {/* Image Navigation */}
                {expandedRoom.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setExpandedRoomImageIndex((prev) => 
                        prev === 0 ? expandedRoom.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm p-2 border border-white/20 hover:bg-black/80 transition-all"
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={() => setExpandedRoomImageIndex((prev) => 
                        (prev + 1) % expandedRoom.images.length
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm p-2 border border-white/20 hover:bg-black/80 transition-all"
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>

                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {expandedRoom.images.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setExpandedRoomImageIndex(idx)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            idx === expandedRoomImageIndex ? "bg-white w-6" : "bg-white/50"
                          )}
                          data-testid={`room-image-dot-${idx}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Room Details */}
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-light tracking-wide mb-2">{expandedRoom.roomType}</h2>
                  <p className="text-white/60 text-sm font-light">{hotel.name}</p>
                </div>

                {/* Room Specs Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10">
                  <div className="text-center">
                    <Bed className="h-5 w-5 text-white/60 mx-auto mb-2" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Bed Type</p>
                    <p className="text-sm font-light text-white">{expandedRoom.bedType}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 text-white/60 mx-auto mb-2" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Max Guests</p>
                    <p className="text-sm font-light text-white">{expandedRoom.maxOccupancy}</p>
                  </div>
                  <div className="text-center">
                    <Maximize className="h-5 w-5 text-white/60 mx-auto mb-2" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Room Size</p>
                    <p className="text-sm font-light text-white">{expandedRoom.roomSize} sq ft</p>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Room Amenities</p>
                  <div className="grid grid-cols-2 gap-2">
                    {expandedRoom.amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10">
                        <Check className="h-4 w-4 text-white/60 flex-shrink-0" />
                        <span className="text-sm font-light text-white/80">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-4 bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 font-light mb-1">
                        {nights} night{nights > 1 ? 's' : ''}
                      </p>
                      <p className="text-3xl font-light text-white">{formatPrice(expandedRoom.basePrice * nights)}</p>
                      <p className="text-xs text-white/60 font-light mt-1">+ taxes & fees</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 font-light">per night</p>
                      <p className="text-xl font-light text-white">{formatPrice(expandedRoom.basePrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <Button
                  onClick={() => handleBookRoom(expandedRoom)}
                  className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
                  data-testid="button-book-expanded-room"
                >
                  BOOK NOW
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fixed Bottom Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={handleBook}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-book-hotel"
          >
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
