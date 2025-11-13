import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { ArrowLeft, MapPin, Calendar, Users, Search, Building2, Star, TrendingUp, Sparkles, Hotel, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketHeader } from "@/components/ui/ticket-header";

interface PopularDestination {
  city: string;
  country: string;
  image: string;
  hotels: number;
  startingPrice: number;
  trending?: boolean;
}

const popularDestinations: PopularDestination[] = [
  {
    city: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    hotels: 1200,
    startingPrice: 1499,
    trending: true
  },
  {
    city: "Mumbai",
    country: "India",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
    hotels: 2500,
    startingPrice: 1999
  },
  {
    city: "Delhi",
    country: "India",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    hotels: 2100,
    startingPrice: 1799,
    trending: true
  },
  {
    city: "Jaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    hotels: 850,
    startingPrice: 1299
  },
  {
    city: "Bangalore",
    country: "India",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
    hotels: 1800,
    startingPrice: 1599
  },
  {
    city: "Udaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
    hotels: 450,
    startingPrice: 2499,
    trending: true
  }
];

const quickSearchOptions = [
  { label: "Budget Hotels", icon: Hotel, filter: "budget" },
  { label: "Luxury Stays", icon: Sparkles, filter: "luxury" },
  { label: "Top Rated", icon: Star, filter: "rated" },
  { label: "Business Hotels", icon: Building2, filter: "business" }
];

export default function HotelSearch() {
  const [, navigate] = useLocation();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) {
      return;
    }

    const params = new URLSearchParams({
      city: destination,
      checkIn,
      checkOut,
      rooms: rooms.toString(),
      guests: guests.toString()
    });
    
    navigate(`/booking/hotel/results?${params.toString()}`);
  };

  const handleDestinationClick = (city: string) => {
    setDestination(city);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(dayAfter.toISOString().split('T')[0]);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <TicketHeader 
        title="HOTEL SEARCH" 
        subtitle="Find Your Perfect Stay"
        backPath="/home"
        ticketsPath="/all-tickets?type=hotels&status=all"
        ticketIcon={<Hotel className="h-5 w-5" />}
      />

      <div className="pt-20 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Search Form Card */}
        <div className="px-4 mb-8">
          <Card className="bg-white/5 border border-white/20 rounded-none backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              {/* Destination */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                  <MapPin className="h-3 w-3" />
                  <span>Destination</span>
                </div>
                <Input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter city name..."
                  className="bg-white/10 border-white/20 rounded-none text-white placeholder:text-white/40 focus:border-white h-12 text-base font-light"
                  data-testid="input-destination"
                />
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                    <Calendar className="h-3 w-3" />
                    <span>Check-in</span>
                  </div>
                  <DatePicker
                    value={checkIn}
                    onChange={setCheckIn}
                    min={getTodayDate()}
                    placeholder="Select check-in date"
                    className="bg-white/10 border-white/20 text-white"
                    data-testid="input-checkin"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                    <Calendar className="h-3 w-3" />
                    <span>Check-out</span>
                  </div>
                  <DatePicker
                    value={checkOut}
                    onChange={setCheckOut}
                    min={checkIn || getTomorrowDate()}
                    placeholder="Select check-out date"
                    className="bg-white/10 border-white/20 text-white"
                    data-testid="input-checkout"
                  />
                </div>
              </div>

              {/* Rooms and Guests Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                    <Hotel className="h-3 w-3" />
                    <span>Rooms</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-none h-12 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                      data-testid="button-decrease-rooms"
                    >
                      -
                    </Button>
                    <span className="text-lg font-light" data-testid="text-rooms">{rooms}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRooms(rooms + 1)}
                      className="text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                      data-testid="button-increase-rooms"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
                    <Users className="h-3 w-3" />
                    <span>Guests</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-none h-12 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                      data-testid="button-decrease-guests"
                    >
                      -
                    </Button>
                    <span className="text-lg font-light" data-testid="text-guests">{guests}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGuests(guests + 1)}
                      className="text-white hover:bg-white/10 rounded-none h-8 w-8 p-0"
                      data-testid="button-increase-guests"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={!destination || !checkIn || !checkOut}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-search"
              >
                <Search className="h-5 w-5 mr-2" />
                SEARCH HOTELS
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Search Options */}
        <div className="px-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 uppercase tracking-widest font-light">Quick Filters</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickSearchOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.filter}
                  className="bg-white/5 border border-white/10 rounded-none p-4 hover:border-white/30 transition-all cursor-pointer"
                  data-testid={`filter-${option.filter}`}
                >
                  <Icon className="h-5 w-5 text-white/60 mb-2" />
                  <p className="text-sm font-light text-white/80">{option.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="px-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 uppercase tracking-widest font-light">Popular Destinations</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularDestinations.map((dest) => (
              <div
                key={dest.city}
                onClick={() => handleDestinationClick(dest.city)}
                className="relative group cursor-pointer overflow-hidden rounded-none"
                data-testid={`destination-${dest.city.toLowerCase()}`}
              >
                <div className="relative h-48">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {dest.trending && (
                    <Badge className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white border-0 rounded-none text-xs px-2 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-light tracking-wide mb-1">{dest.city}</h3>
                    <p className="text-xs text-white/60 mb-2">{dest.hotels} Hotels</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-white/60">Starting from</span>
                      <span className="text-sm font-light">{formatPrice(dest.startingPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
