import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Home,
  Download,
  Share2,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Ticket,
  Mail,
  Phone,
  Sparkles,
  Gift,
  Tag,
  Coins,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventBookingConfirmation() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const [confetti, setConfetti] = useState(true);

  const searchParams = new URLSearchParams(window.location.search);
  const bookingDataStr = searchParams.get("data");
  const bookingData = bookingDataStr ? JSON.parse(decodeURIComponent(bookingDataStr)) : null;

  const [booking] = useState(() => {
    const bookingId = `BKG${Date.now()}`;
    return {
      id: bookingId,
      eventName: "Arijit Singh Live in Concert",
      venue: "DY Patil Stadium, Mumbai",
      date: "2025-10-15",
      time: "19:00",
      ...bookingData,
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(bookingId),
      confirmationEmail: bookingData?.email || "your.email@example.com",
      rewards: {
        points: Math.floor((bookingData?.total || 0) * 0.1),
        cashback: (bookingData?.total || 0) * 0.02,
        coupon: {
          code: `EVENT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          value: 500,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  const addToCalendar = () => {
    const event = {
      title: booking.eventName,
      description: `Event booking confirmation: ${booking.id}`,
      location: booking.venue,
      start: new Date(`${booking.date}T${booking.time}`).toISOString(),
      end: new Date(new Date(`${booking.date}T${booking.time}`).getTime() + 4 * 60 * 60 * 1000).toISOString()
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${event.start.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.end.replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event.ics';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pb-32 relative overflow-hidden">
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      {/* Confetti Animation */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <Sparkles
              key={i}
              className={cn(
                "absolute h-6 w-6 text-white/80 opacity-60 animate-bounce",
                i % 2 === 0 ? "text-white/80" : "text-white/80"
              )}
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 animate-scale-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-success-title">
            🎉 Booking Confirmed!
          </h1>
          <p className="text-white/70 text-lg">
            Your tickets are ready. See you at the event!
          </p>
        </div>

        {/* QR Code Ticket */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border-white/20 backdrop-blur-md mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Badge className="bg-white/10 text-white border-0 mb-3">
                <Ticket className="h-3 w-3 mr-1" />
                E-Ticket
              </Badge>
              <h2 className="text-xl font-bold text-white mb-1">{booking.eventName}</h2>
              <p className="text-white/60 text-sm">Booking ID: {booking.id}</p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-lg p-4 mb-4 mx-auto w-fit">
              <img
                src={booking.qrCode}
                alt="Ticket QR Code"
                className="w-48 h-48"
                data-testid="img-qr-code"
              />
            </div>

            <div className="bg-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-medium">{booking.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-medium">{formatDate(booking.date)}</p>
                  <p className="text-white/60 text-sm">{booking.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-medium capitalize">{booking.ticketType} × {booking.quantity}</p>
                  <p className="text-white/80 font-bold">{formatPrice(booking.total)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">🎁 Rewards Earned!</h3>
                <p className="text-sm text-white/80">Thank you for booking with us</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-white/80" />
                  <span className="text-white font-medium">Reward Points</span>
                </div>
                <span className="text-white/80 font-bold" data-testid="text-points">
                  +{booking.rewards.points} pts
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-white/80" />
                  <span className="text-white font-medium">Cashback Earned</span>
                </div>
                <span className="text-white/80 font-bold" data-testid="text-cashback">
                  +{formatPrice(booking.rewards.cashback)}
                </span>
              </div>

              <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-white/40">
                <div className="text-center mb-2">
                  <p className="text-white/80 text-sm mb-1">Bonus Coupon</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-amber-400" />
                    <p className="text-xl font-mono font-bold text-white" data-testid="text-coupon-code">
                      {booking.rewards.coupon.code}
                    </p>
                  </div>
                  <p className="text-white/80 font-bold">{formatPrice(booking.rewards.coupon.value)} OFF</p>
                </div>
                <p className="text-xs text-white/60 text-center">
                  Valid until {formatDate(booking.rewards.coupon.validUntil)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Confirmation Sent</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white" data-testid="text-email">{booking.confirmationEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-white/60 text-sm">Phone</p>
                  <p className="text-white" data-testid="text-phone">{booking.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col h-auto py-3"
            onClick={() => {}}
            data-testid="button-download"
          >
            <Download className="h-5 w-5 mb-1" />
            <span className="text-xs">Download</span>
          </Button>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col h-auto py-3"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Event Booking',
                  text: `I just booked tickets for ${booking.eventName}!`,
                  url: window.location.href
                });
              }
            }}
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5 mb-1" />
            <span className="text-xs">Share</span>
          </Button>
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col h-auto py-3"
            onClick={addToCalendar}
            data-testid="button-add-calendar"
          >
            <CalendarIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Add to Calendar</span>
          </Button>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-12"
            onClick={() => navigate("/booking/event/search")}
            data-testid="button-browse-events"
          >
            Browse Events
          </Button>
          <Button
            className="bg-white text-black hover:bg-white/90 h-12"
            onClick={() => navigate("/home")}
            data-testid="button-go-home"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
