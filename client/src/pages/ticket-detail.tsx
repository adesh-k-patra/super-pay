import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  Download, 
  Share2,
  Plane, 
  Bus, 
  Train, 
  Film, 
  Calendar,
  Hotel,
  Car,
  Navigation,
  MapPin,
  Clock,
  Ticket as TicketIcon,
  Users,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Video,
  Home as HomeIcon,
  IndianRupee
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import QRCode from "react-qr-code";
import type { ConsultantBooking } from "@shared/schema";

// Mock booking data - in production, fetch from API
const getMockBooking = (id: string) => {
  const bookings: Record<string, any> = {
    "1": {
      id: "1",
      type: "flights",
      from: "Delhi (DEL)",
      to: "Mumbai (BOM)",
      date: "2025-01-20",
      time: "14:30",
      arrivalTime: "16:45",
      status: "active",
      bookingId: "FL123456",
      seats: "2A, 2B",
      price: 8500,
      serviceName: "Air India AI-860",
      passengers: [
        { name: "John Doe", age: 35, gender: "Male", seat: "2A" },
        { name: "Jane Doe", age: 32, gender: "Female", seat: "2B" }
      ],
      contactEmail: "john.doe@example.com",
      contactPhone: "+91 98765 43210",
      companyName: "Air India Limited",
      companyLocation: "Airlines House, 113, Gurudwara Rakabganj Road, New Delhi - 110001",
      companyPhone: "+91 1800 180 1407",
      companyEmail: "customer.relations@airindia.in",
      companyWebsite: "https://www.airindia.com"
    },
    "2": {
      id: "2",
      type: "movie",
      title: "Inception",
      location: "PVR Cinemas, Connaught Place",
      date: "2025-01-18",
      time: "19:00",
      status: "active",
      bookingId: "MV789012",
      seats: "E5, E6",
      price: 600,
      screen: "Audi 3",
      serviceName: "Premium Seats",
      companyName: "PVR Cinemas",
      companyLocation: "1st Floor, Regal Building, Connaught Place, New Delhi - 110001",
      companyPhone: "+91 11 4299 1000",
      companyEmail: "customercare@pvrcinemas.com",
      companyWebsite: "https://www.pvrcinemas.com"
    },
    "3": {
      id: "3",
      type: "bus",
      from: "Bangalore",
      to: "Chennai",
      date: "2025-01-15",
      time: "22:00",
      arrivalTime: "06:30",
      status: "completed",
      bookingId: "BS345678",
      seats: "12, 13",
      price: 1200,
      serviceName: "VRL Travels - Volvo A/C",
      companyName: "VRL Travels Private Limited",
      companyLocation: "VRL Complex, Hubli - 580032, Karnataka",
      companyPhone: "+91 836 237 1737",
      companyEmail: "info@vrllogistics.com",
      companyWebsite: "https://www.vrltravel.com"
    },
    "4": {
      id: "4",
      type: "metro",
      from: "Rajiv Chowk",
      to: "Noida Sector 18",
      date: "2025-01-10",
      time: "09:15",
      status: "completed",
      bookingId: "MT901234",
      seats: "1",
      price: 60,
      companyName: "Delhi Metro Rail Corporation",
      companyLocation: "Metro Bhawan, Fire Brigade Lane, Barakhamba Road, New Delhi - 110001",
      companyPhone: "+91 11 2341 7910",
      companyEmail: "customercare@delhimetrorail.com",
      companyWebsite: "https://www.delhimetrorail.com"
    },
    "5": {
      id: "5",
      type: "hotels",
      title: "Taj Hotel, Mumbai",
      location: "Colaba, Mumbai",
      date: "2025-02-05",
      checkOutDate: "2025-02-08",
      time: "14:00",
      status: "active",
      bookingId: "HT456789",
      price: 12000,
      serviceName: "Deluxe Room",
      rooms: 1,
      guests: 2,
      nights: 3,
      companyName: "The Taj Mahal Palace Mumbai",
      companyLocation: "Apollo Bandar, Colaba, Mumbai - 400001, Maharashtra",
      companyPhone: "+91 22 6665 3366",
      companyEmail: "tajmumbai.reservations@tajhotels.com",
      companyWebsite: "https://www.tajhotels.com"
    },
    "6": {
      id: "6",
      type: "trains",
      from: "Mumbai Central",
      to: "Ahmedabad",
      date: "2025-01-25",
      time: "06:30",
      arrivalTime: "12:45",
      status: "active",
      bookingId: "TR234567",
      seats: "A1-23, A1-24",
      price: 1800,
      serviceName: "Shatabdi Express",
      companyName: "Indian Railways",
      companyLocation: "Rail Bhawan, Raisina Road, New Delhi - 110001",
      companyPhone: "139 (Railway Enquiry)",
      companyEmail: "care@indianrail.gov.in",
      companyWebsite: "https://www.indianrailways.gov.in"
    },
    "7": {
      id: "7",
      type: "taxi",
      from: "Airport",
      to: "Home",
      date: "2025-01-12",
      time: "18:45",
      status: "completed",
      bookingId: "TX890123",
      price: 450,
      serviceName: "Uber Premium",
      companyName: "Uber India Systems Private Limited",
      companyLocation: "Uber India, Laskar Hosur Road, Bangalore - 560030",
      companyPhone: "+91 80 4680 5555",
      companyEmail: "support@uber.com",
      companyWebsite: "https://www.uber.com"
    },
    "8": {
      id: "8",
      type: "events",
      title: "Sunburn Festival",
      location: "Goa",
      date: "2025-02-20",
      time: "16:00",
      status: "active",
      bookingId: "EV567890",
      seats: "GA-001, GA-002",
      price: 5000,
      companyName: "Sunburn Events Pvt Ltd",
      companyLocation: "Vagator, Anjuna, North Goa - 403509, Goa",
      companyPhone: "+91 22 6707 9000",
      companyEmail: "info@sunburn.in",
      companyWebsite: "https://www.sunburn.in"
    },
    "9": {
      id: "9",
      type: "rentals",
      title: "Honda City",
      location: "Delhi",
      date: "2025-01-30",
      time: "10:00",
      returnDate: "2025-02-02",
      status: "active",
      bookingId: "RN123890",
      price: 3500,
      serviceName: "3 Days Rental",
      companyName: "Zoomcar India Private Limited",
      companyLocation: "Embassy Tech Village, Outer Ring Road, Bangalore - 560103",
      companyPhone: "+91 80 4715 5666",
      companyEmail: "support@zoomcar.com",
      companyWebsite: "https://www.zoomcar.com"
    },
    "10": {
      id: "10",
      type: "flights",
      from: "Bangalore (BLR)",
      to: "Goa (GOI)",
      date: "2024-12-28",
      time: "11:20",
      status: "cancelled",
      bookingId: "FL987654",
      seats: "15A",
      price: 4200,
      serviceName: "IndiGo 6E-365",
      companyName: "InterGlobe Aviation Limited (IndiGo)",
      companyLocation: "Upper Ground Floor, Thapar House, Gate No. 2, Western Wing, 124 Janpath, New Delhi - 110001",
      companyPhone: "+91 124 6173 838",
      companyEmail: "customer.relations@goindigo.in",
      companyWebsite: "https://www.goindigo.in"
    }
  };
  return bookings[id];
};

const getBookingIcon = (type: string) => {
  const icons: Record<string, any> = {
    flights: Plane,
    bus: Bus,
    trains: Train,
    movie: Film,
    events: Calendar,
    hotels: Hotel,
    taxi: Car,
    metro: Navigation,
    rentals: Building
  };
  const Icon = icons[type] || TicketIcon;
  return <Icon className="h-5 w-5" />;
};

export default function TicketDetail() {
  const [, params] = useRoute("/ticket-detail/:id");
  const [, navigate] = useLocation();
  const { toast} = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTab, setActiveTab] = useUrlTab("overview");

  // Try to fetch consultant booking first
  const { data: consultantBooking, isLoading: isLoadingConsultant } = useQuery<ConsultantBooking>({
    queryKey: ["/api/consultant/bookings", params?.id],
    enabled: !!params?.id,
  });

  // Get provider data if it's a consultant booking
  const { data: provider } = useQuery({
    queryKey: ["/api/consultant/providers", consultantBooking?.providerId],
    enabled: !!consultantBooking?.providerId,
  });

  const booking = consultantBooking || getMockBooking(params?.id || "");
  const isConsultantBooking = !!consultantBooking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <TicketIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
          <h2 className="text-xl font-light mb-2">Booking not found</h2>
          <Button
            onClick={() => navigate("/all-tickets")}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-none mt-4"
            data-testid="button-back-to-tickets"
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Booking ${booking.bookingId}`,
          text: `My booking details for ${booking.title || `${booking.from} to ${booking.to}`}`,
        });
        toast({
          title: "SHARED SUCCESSFULLY",
          description: "Booking details shared successfully",
        });
      } else {
        await navigator.clipboard.writeText(`Booking ID: ${booking.bookingId}`);
        toast({
          title: "COPIED TO CLIPBOARD",
          description: "Booking details copied to clipboard",
        });
      }
    } catch (error) {
      // Error sharing - silently handled
    }
  };

  const handleDownload = () => {
    toast({
      title: "DOWNLOADING",
      description: "Downloading your ticket...",
    });
  };

  const handleCancel = () => {
    setShowCancelDialog(false);
    toast({
      title: "BOOKING CANCELLED",
      description: "Your booking has been cancelled successfully",
      variant: "destructive",
    });
  };

  const getStatusBadge = () => {
    switch(booking.status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none">Active</Badge>;
      case 'completed':
        return <Badge className="bg-white/10 text-white/40 border-white/20 rounded-none">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 rounded-none">Cancelled</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - Cardless */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/all-tickets")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">TICKET DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0 mb-6">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="qr" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-qr"
            >
              QR Code
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-contact"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Booking ID */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TicketIcon className="h-4 w-4 text-white/40" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Booking ID</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-base font-light text-white tracking-wider font-mono" data-testid="text-booking-id">
                  {booking.bookingId}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-white/40" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Status</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                {getStatusBadge()}
              </div>
            </div>

            {/* Price */}
            {booking.price && (
              <div className="bg-white/5 border border-white/10 p-6">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light mb-2">Total Amount</p>
                <p className="text-3xl font-light text-white" data-testid="text-price">
                  ₹{booking.price.toLocaleString()}
                </p>
              </div>
            )}

            {/* Journey/Event Details */}
            {booking.from && booking.to ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-white/40" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">From</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-sm font-light text-white" data-testid="text-from">
                      {booking.from}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-white/40" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">To</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-sm font-light text-white" data-testid="text-to">
                      {booking.to}
                    </p>
                  </div>
                </div>
              </div>
            ) : booking.title ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Venue/Title</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-base font-light text-white" data-testid="text-title">
                    {booking.title}
                  </p>
                  {booking.location && (
                    <p className="text-xs text-white/60 mt-1" data-testid="text-location">{booking.location}</p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Date</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-date">
                    {format(new Date(booking.date), "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Time</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-time">
                    {booking.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Name */}
            {booking.serviceName && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Service</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-service">
                    {booking.serviceName}
                  </p>
                </div>
              </div>
            )}

            {/* Seats */}
            {booking.seats && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TicketIcon className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Seats</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-seats">
                    {booking.seats}
                  </p>
                </div>
              </div>
            )}

            {/* Passengers */}
            {booking.passengers && booking.passengers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Passengers</p>
                </div>
                <div className="border border-white/10 bg-white/5">
                  {booking.passengers.map((passenger: any, index: number) => (
                    <div key={index} className={`p-4 ${index !== booking.passengers.length - 1 ? 'border-b border-white/10' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-light text-white" data-testid={`text-passenger-name-${index}`}>
                            {passenger.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-white/60">
                            <span>{passenger.age} yrs</span>
                            <span>{passenger.gender}</span>
                            {passenger.seat && <span>Seat: {passenger.seat}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Details */}
            {(booking.contactEmail || booking.contactPhone) && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Contact Details</p>
                </div>
                <div className="space-y-3">
                  {booking.contactEmail && (
                    <div className="bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-white/60 mb-1">Email</p>
                      <p className="text-sm font-light text-white" data-testid="text-contact-email">
                        {booking.contactEmail}
                      </p>
                    </div>
                  )}
                  {booking.contactPhone && (
                    <div className="bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-white/60 mb-1">Phone</p>
                      <p className="text-sm font-light text-white" data-testid="text-contact-phone">
                        {booking.contactPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-white p-6 rounded-none mb-6">
                <QRCode
                  value={`BOOKING:${booking.bookingId}:${booking.type}`}
                  size={200}
                  data-testid="qr-code"
                />
              </div>
              <p className="text-sm text-white/60 text-center mb-2">Scan this QR code at the venue</p>
              <p className="text-xs text-white/40 font-mono">{booking.bookingId}</p>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-0 space-y-6">
            {/* Company Name */}
            {booking.companyName && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Company Name</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-base font-light text-white" data-testid="text-company-name">
                    {booking.companyName}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {booking.companyLocation && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Location</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-sm font-light text-white leading-relaxed" data-testid="text-company-location">
                    {booking.companyLocation}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Numbers */}
            {booking.companyPhone && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Contact Number</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <a 
                    href={`tel:${booking.companyPhone}`}
                    className="text-sm font-light text-white hover:text-white/80 transition-colors"
                    data-testid="link-company-phone"
                  >
                    {booking.companyPhone}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {booking.companyEmail && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Email</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <a 
                    href={`mailto:${booking.companyEmail}`}
                    className="text-sm font-light text-white hover:text-white/80 transition-colors break-all"
                    data-testid="link-company-email"
                  >
                    {booking.companyEmail}
                  </a>
                </div>
              </div>
            )}

            {/* Visit Website Button */}
            {booking.companyWebsite && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Website</p>
                </div>
                <Button
                  onClick={() => window.open(booking.companyWebsite, '_blank')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none font-light tracking-wider"
                  data-testid="button-visit-website"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="grid grid-cols-3 gap-3 max-w-screen-lg mx-auto">
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-none font-light"
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-none font-light"
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {booking.status === 'active' && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-none font-light"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-zinc-950 border-white/20 rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-light">Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-none">
              No, Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 text-white hover:bg-red-600 rounded-none"
              data-testid="button-confirm-cancel"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
