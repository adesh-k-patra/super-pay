import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QRCode from "react-qr-code";
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Download, 
  Home, 
  Clock,
  Hotel,
  CreditCard,
  Info,
  Share2,
  Star,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelBooking {
  id: string;
  bookingReference: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfRooms: number;
  numberOfGuests: number;
  guestDetails: {
    primaryGuest: {
      name: string;
      email: string;
      phone: string;
    }
  };
  totalAmount: string;
  status: string;
  paymentStatus: string;
}

export default function HotelBookingSuccess() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get('bookingId') || '';
  const [showConfetti, setShowConfetti] = useState(true);

  const { data: bookingData, isLoading, isError } = useQuery<{ success: boolean; booking: HotelBooking }>({
    queryKey: [`/api/hotel-bookings/${bookingId}`],
    enabled: !!bookingId,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if no bookingId or if data loading fails after 3 seconds
  useEffect(() => {
    if (!bookingId || (isError && !isLoading)) {
      const timeout = setTimeout(() => {
        navigate("/home");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [bookingId, isError, isLoading, navigate]);

  const booking = bookingData?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto mb-4" />
          <p className="text-white/60 font-light">
            {isError || !bookingId ? "Booking not found. Redirecting..." : "Loading booking details..."}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hotel Booking Confirmation',
        text: `Booking confirmed at ${booking.hotelName}. Reference: ${booking.bookingReference}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Success Header with Animation */}
      <div className="relative pt-16 pb-12 px-4 text-center border-b border-white/10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
        
        <div className="relative z-10">
          <div className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 transition-all duration-500",
            showConfetti ? "bg-green-500/30 border-4 border-green-500/50 scale-110" : "bg-green-500/20 border-2 border-green-500/40"
          )}>
            <CheckCircle2 className={cn(
              "h-12 w-12 text-green-400 transition-all duration-500",
              showConfetti && "scale-110"
            )} />
          </div>
          <h1 className="text-3xl font-light tracking-wider mb-3">BOOKING CONFIRMED!</h1>
          <p className="text-white/60 font-light text-base">Your hotel reservation is confirmed</p>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Booking Reference Card with QR */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-none overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-3">
                  <Award className="h-3 w-3" />
                  <span>Booking Reference</span>
                </div>
                <p className="text-3xl font-light tracking-wider mb-2" data-testid="text-booking-reference">
                  {booking.bookingReference}
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none font-light">
                    {booking.status.toUpperCase()}
                  </Badge>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                    {booking.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="bg-white p-3 rounded-none">
                <QRCode 
                  value={`HOTEL-${booking.bookingReference}`} 
                  size={80}
                  level="M"
                />
              </div>
            </div>
            <p className="text-xs text-white/40 font-light text-center">
              Show this QR code at hotel check-in
            </p>
          </CardContent>
        </Card>

        {/* Hotel & Stay Details */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
              <Hotel className="h-3 w-3" />
              <span>Stay Details</span>
            </div>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/10">
                <p className="text-xl font-light tracking-wide mb-1">{booking.hotelName}</p>
                <p className="text-sm text-white/60 font-light">{booking.roomType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-white/60 font-light mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>Check-in</span>
                  </div>
                  <p className="text-sm font-light">{formatDate(booking.checkInDate)}</p>
                  <p className="text-xs text-white/40 font-light mt-1">After 2:00 PM</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-white/60 font-light mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>Check-out</span>
                  </div>
                  <p className="text-sm font-light">{formatDate(booking.checkOutDate)}</p>
                  <p className="text-xs text-white/40 font-light mt-1">Before 11:00 AM</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/60 font-light">
                  <Users className="h-4 w-4" />
                  <span>
                    {booking.numberOfRooms} Room • {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm font-light">
                  {booking.numberOfNights} Night{booking.numberOfNights > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
              <Users className="h-3 w-3" />
              <span>Primary Guest</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-none">
                <div className="bg-white/10 p-2 rounded-none">
                  <Users className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 font-light">Full Name</p>
                  <p className="font-light">{booking.guestDetails.primaryGuest.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-none">
                <div className="bg-white/10 p-2 rounded-none">
                  <Mail className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 font-light">Email Address</p>
                  <p className="font-light text-sm">{booking.guestDetails.primaryGuest.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-none">
                <div className="bg-white/10 p-2 rounded-none">
                  <Phone className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 font-light">Phone Number</p>
                  <p className="font-light">{booking.guestDetails.primaryGuest.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
              <CreditCard className="h-3 w-3" />
              <span>Payment Summary</span>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-base text-white/60 font-light">Total Amount Paid</span>
              <p className="text-3xl font-light">{formatPrice(booking.totalAmount)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light">
              <Info className="h-3 w-3" />
              <span>Important Information</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                <p className="text-white/70 font-light">
                  A confirmation email has been sent to <span className="text-white">{booking.guestDetails.primaryGuest.email}</span>
                </p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                <p className="text-white/70 font-light">
                  Please carry a valid government-issued ID proof at check-in
                </p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                <p className="text-white/70 font-light">
                  Free cancellation available up to 24 hours before check-in
                </p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                <p className="text-white/70 font-light">
                  For any assistance, contact hotel directly or our support team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => window.print()}
            className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-none h-12 font-light"
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            DOWNLOAD BOOKING DETAILS
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4 mr-2" />
              SHARE
            </Button>
            <Button
              onClick={() => navigate('/home')}
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-light"
              data-testid="button-home"
            >
              <Home className="h-4 w-4 mr-2" />
              GO HOME
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
