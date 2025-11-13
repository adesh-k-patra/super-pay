import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  Hotel,
  Calendar,
  Users,
  CreditCard,
  Shield,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const guestFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  specialRequests: z.string().optional()
});

type GuestFormData = z.infer<typeof guestFormSchema>;

export default function HotelGuestDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const hotelId = searchParams.get('hotelId') || '';
  const roomId = searchParams.get('roomId') || '';
  const roomType = searchParams.get('roomType') || '';
  const price = parseFloat(searchParams.get('price') || '0');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const rooms = searchParams.get('rooms') || '1';
  const guests = searchParams.get('guests') || '2';

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const subtotal = price * nights;
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya.sharma@example.com",
      phone: "9876543210",
      specialRequests: "Early check-in if possible"
    }
  });

  const onSubmit = async (data: GuestFormData) => {
    try {
      setIsSubmitting(true);
      
      const bookingData = {
        hotelId,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfRooms: parseInt(rooms),
        numberOfGuests: parseInt(guests),
        totalPrice: total.toString(),
        guestName: `${data.firstName} ${data.lastName}`,
        guestEmail: data.email,
        guestPhone: data.phone,
        specialRequests: data.specialRequests || '',
        status: 'confirmed',
        paymentStatus: 'pending'
      };

      const response = await apiRequest('POST', '/api/hotel-bookings', bookingData);
      const result = await response.json() as { success: boolean; booking: any };

      if (result.success && result.booking) {
        await queryClient.invalidateQueries({ queryKey: ['/api/hotel-bookings'] });
        
        // Navigate to payment page
        const paymentParams = new URLSearchParams({
          amount: total.toFixed(2),
          type: 'hotel',
          bookingId: result.booking.id,
          returnUrl: `/booking/hotel/success?bookingId=${result.booking.id}`
        });
        navigate(`/upi-payment?${paymentParams.toString()}`);
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
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
              navigate(`/booking/hotel/details?id=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&guests=${guests}`);
            }}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider">GUEST DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Almost There!</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Booking Summary Card */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-4">
              <Hotel className="h-3 w-3" />
              <span>Booking Summary</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start pb-3 border-b border-white/10">
                <div>
                  <p className="text-sm text-white/60 font-light mb-1">Room Type</p>
                  <p className="text-base font-light">{roomType}</p>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                  {rooms} Room{parseInt(rooms) > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-white/60 font-light mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Check-in</span>
                  </div>
                  <p className="text-sm font-light">{formatDate(checkIn)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-white/60 font-light mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Check-out</span>
                  </div>
                  <p className="text-sm font-light">{formatDate(checkOut)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/60 font-light">
                  <Users className="h-4 w-4" />
                  <span>Guests</span>
                </div>
                <p className="text-base font-light">{guests} Guest{parseInt(guests) > 1 ? 's' : ''}</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-light">Duration</span>
                <p className="text-base font-light">{nights} Night{nights > 1 ? 's' : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information Form */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-6">
              <User className="h-3 w-3" />
              <span>Primary Guest Information</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-xs font-light">First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            className="bg-white/10 border-white/20 rounded-none text-white placeholder:text-white/40 h-12 font-light"
                            data-testid="input-firstname"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-xs font-light">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            className="bg-white/10 border-white/20 rounded-none text-white placeholder:text-white/40 h-12 font-light"
                            data-testid="input-lastname"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs font-light flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john.doe@example.com"
                          className="bg-white/10 border-white/20 rounded-none text-white placeholder:text-white/40 h-12 font-light"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs font-light flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="9876543210"
                          className="bg-white/10 border-white/20 rounded-none text-white placeholder:text-white/40 h-12 font-light"
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Special Requests */}
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs font-light flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Special Requests (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Early check-in, high floor, etc..."
                          className="bg-white/10 border-white/20 rounded-none text-white placeholder:text-white/40 min-h-24 font-light resize-none"
                          data-testid="input-requests"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Price Breakdown Card */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-4">
              <CreditCard className="h-3 w-3" />
              <span>Price Breakdown</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60 font-light">
                  {formatPrice(price)} × {nights} night{nights > 1 ? 's' : ''}
                </span>
                <span className="text-base font-light">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-sm text-white/60 font-light">Taxes & Service Fees (12%)</span>
                <span className="text-base font-light">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-light">Total Amount</span>
                <span className="text-2xl font-light" data-testid="text-total">{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-white/5 border border-white/20 rounded-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-light mb-4">
              <Shield className="h-3 w-3" />
              <span>Important Information</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/70 font-light">Valid government ID required at check-in</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/70 font-light">Booking confirmation will be sent to your email</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/70 font-light">Free cancellation up to 24 hours before check-in</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="w-full max-w-screen-lg mx-auto">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50"
            data-testid="button-proceed-payment"
          >
            {isSubmitting ? "Processing..." : `PROCEED TO PAYMENT • ${formatPrice(total)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
