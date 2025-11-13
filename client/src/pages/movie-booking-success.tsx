import { useEffect, useRef, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Armchair, 
  Download, 
  Home, 
  Ticket, 
  ArrowLeft,
  Clock,
  Receipt,
  FileText,
  CreditCard,
  Sparkles,
  Star,
  Gift,
  TrendingUp,
  Zap,
  Tag,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { MovieBooking } from "@shared/schema";

// Generate stable coupon codes based on booking reference
const generateStableCouponCode = (prefix: string, seed: string, length: number = 4) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const code = Math.abs(hash).toString(36).toUpperCase().substring(0, length);
  return `${prefix}${code.padEnd(length, '0')}`;
};

export default function MovieBookingSuccess() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);

  const { data: bookingData, isLoading } = useQuery<{ success: boolean; booking: MovieBooking }>({
    queryKey: ["/api/movie-bookings", bookingId],
  });

  const booking = bookingData?.booking;

  // Generate stable coupon codes
  const couponCodes = useMemo(() => {
    const seed = booking?.bookingReference || bookingId || Date.now().toString();
    return {
      movie: generateStableCouponCode('MOVIE', seed + '1'),
      fnb: generateStableCouponCode('FNB', seed + '2'),
      combo: generateStableCouponCode('COMBO', seed + '3'),
      premium: generateStableCouponCode('VIP', seed + '4', 3)
    };
  }, [booking?.bookingReference, bookingId]);

  useEffect(() => {
    if (booking) {
      const celebrationTimeout = setTimeout(() => {
        toast({
          title: "🎉 Booking Confirmed!",
          description: `Your booking ${booking.bookingReference} is confirmed!`,
        });
      }, 500);

      return () => clearTimeout(celebrationTimeout);
    }
  }, [booking, toast]);

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`ticket-${booking?.bookingReference}.pdf`);

      toast({
        title: "Download Started",
        description: "Your ticket is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-12 w-12 rounded-none mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-2 rounded-none" />
          <Skeleton className="h-4 w-48 mx-auto mb-8 rounded-none" />
          <Skeleton className="h-96 w-full max-w-2xl mx-auto rounded-none" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Booking not found</h2>
          <Button className="rounded-none" onClick={() => navigate("/movies")} data-testid="button-back-to-movies">
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  const foodItems = booking.foodItems as any[] || [];

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (date?: Date | string) => {
    return new Date(date || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalAmount = parseFloat(booking.totalAmount);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - UPI Payment Style */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BOOKING CONFIRMED</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Movie Tickets</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Success Message */}
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-400" data-testid="icon-success" />
            </div>
          </div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2" data-testid="text-success-title">
            Booking Successful!
          </h2>
          <p className="text-white/60 text-sm font-light" data-testid="text-success-message">
            Your movie tickets have been confirmed
          </p>
        </div>

        {/* Booking Information */}
        <div className="pb-6 border-b border-white/10" ref={ticketRef} data-testid="section-booking">
          <div className="flex items-center gap-2 mb-6">
            <Ticket className="h-5 w-5 text-white/60" />
            <h3 className="text-lg font-light tracking-wider text-white">Booking Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                <Receipt className="inline h-3 w-3 mr-1" />
                Booking Reference
              </Label>
              <p className="text-xl font-light text-white tracking-wider" data-testid="text-booking-reference">
                {booking.bookingReference}
              </p>
            </div>
            <div>
              <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                <FileText className="inline h-3 w-3 mr-1" />
                Booking Time
              </Label>
              <p className="text-sm font-light text-white" data-testid="text-booking-time">
                {booking.createdAt ? format(new Date(booking.createdAt), "dd MMM yyyy • hh:mm a") : "N/A"}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/20 my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-1" data-testid="text-movie-title">
                  {booking.movieTitle}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="h-4 w-4" />
                    <span data-testid="text-showtime">
                      {format(new Date(booking.showAt), "EEE, dd MMM yyyy • hh:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-theater">{booking.theaterName}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Armchair className="h-4 w-4" />
                  <span className="font-semibold">Seats</span>
                </div>
                <div className="flex flex-wrap gap-2" data-testid="container-seats">
                  {booking.seatNumbers?.map((seat) => (
                    <Badge key={seat} variant="secondary" className="rounded-none" data-testid={`badge-seat-${seat}`}>
                      {seat}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-white/60 mt-2" data-testid="text-seat-count">
                  {booking.totalSeats} seat{booking.totalSeats !== 1 ? "s" : ""}
                </p>
              </div>

              {foodItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Food & Beverages</h4>
                    <div className="space-y-1" data-testid="container-food">
                      {foodItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm" data-testid={`food-item-${idx}`}>
                          <span>{item.name} x {item.quantity}</span>
                          <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Ticket Amount</span>
                  <span data-testid="text-ticket-amount">₹{booking.ticketAmount}</span>
                </div>
                {parseFloat(booking.foodAmount || "0") > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Food & Beverages</span>
                    <span data-testid="text-food-amount">₹{booking.foodAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Convenience Fee</span>
                  <span data-testid="text-convenience-fee">₹{booking.convenienceFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span data-testid="text-total-amount">₹{booking.totalAmount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10" data-testid="payment-info">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Payment Method</span>
                  <span className="font-light capitalize text-white" data-testid="text-payment-method">
                    {booking.paymentMethod || "UPI"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Payment Status</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-none" data-testid="badge-payment-status">
                    {booking.paymentStatus || "PAID"}
                  </Badge>
                </div>
              </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-6 border-b border-white/10">
          <Button 
            className="flex-1 rounded-none" 
            variant="outline"
            onClick={handleDownloadTicket}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          <Button 
            className="flex-1 rounded-none" 
            variant="outline"
            onClick={() => navigate("/movie-bookings")}
            data-testid="button-view-bookings"
          >
            <Ticket className="h-4 w-4 mr-2" />
            View All Bookings
          </Button>
          <Button 
            className="flex-1 rounded-none"
            onClick={() => navigate("/movies")}
            data-testid="button-book-another"
          >
            <Home className="h-4 w-4 mr-2" />
            Book Another Movie
          </Button>
        </div>

        {/* Theater Directions */}
        <div className="pb-6" data-testid="section-theater-directions">
          <Button 
            variant="outline"
            className="w-full rounded-none"
            onClick={() => {
              const address = encodeURIComponent(booking.theaterName);
              window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
            }}
            data-testid="button-get-directions"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Get Directions to {booking.theaterName}
          </Button>
        </div>

        {/* Important Instructions */}
        <div className="pb-6">
          <h4 className="text-sm font-light text-white/60 uppercase tracking-widest mb-3">Important Instructions</h4>
          <ul className="text-sm text-white/80 space-y-2 font-light">
            <li>• Please arrive at the theater 15 minutes before showtime</li>
            <li>• Carry a valid ID proof for verification</li>
            <li>• Show this ticket or QR code at the entrance</li>
            <li>• Food items will be collected from the counter</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
