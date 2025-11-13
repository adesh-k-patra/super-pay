import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import {
  Calendar,
  Clock,
  IndianRupee,
  Video,
  Home,
  CheckCircle2,
  XCircle,
  Clock4,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import type { ConsultantBooking } from "@shared/schema";

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  pending: { label: "Pending", icon: Clock4, className: "bg-yellow-500/20 text-yellow-300" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-green-500/20 text-green-300" },
  in_progress: { label: "In Progress", icon: Clock, className: "bg-blue-500/20 text-blue-300" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-green-500/20 text-green-300" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-500/20 text-red-300" },
};

// Dummy bookings data
const dummyBookings: ConsultantBooking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    providerId: "prov-2",
    serviceId: "srv-4",
    serviceType: "General Consultation",
    scheduledDate: new Date("2025-01-25"),
    scheduledTime: "10:00 AM",
    duration: 30,
    bookingType: "virtual",
    status: "confirmed",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    customerEmail: "rahul.sharma@example.com",
    basePrice: "500.00",
    taxAmount: "90.00",
    totalAmount: "590.00",
    paymentMode: "prepaid",
    createdAt: new Date("2025-01-15"),
  } as ConsultantBooking,
  {
    id: "booking-2",
    userId: "user-1",
    providerId: "prov-5",
    serviceId: "srv-11",
    serviceType: "Financial Planning",
    scheduledDate: new Date("2025-01-28"),
    scheduledTime: "02:30 PM",
    duration: 60,
    bookingType: "virtual",
    status: "pending",
    customerName: "Priya Patel",
    customerPhone: "+91 98765 43211",
    customerEmail: "priya.patel@example.com",
    basePrice: "1200.00",
    taxAmount: "216.00",
    totalAmount: "1416.00",
    paymentMode: "prepaid",
    createdAt: new Date("2025-01-20"),
  } as ConsultantBooking,
  {
    id: "booking-3",
    userId: "user-1",
    providerId: "prov-1",
    serviceId: "srv-1",
    serviceType: "Dental Checkup",
    scheduledDate: new Date("2025-01-10"),
    scheduledTime: "11:00 AM",
    duration: 45,
    bookingType: "in_person",
    status: "completed",
    customerName: "Amit Kumar",
    customerPhone: "+91 98765 43212",
    customerEmail: "amit.kumar@example.com",
    address: "123 MG Road",
    city: "Bangalore",
    pincode: "560001",
    basePrice: "800.00",
    travelFee: "100.00",
    taxAmount: "162.00",
    totalAmount: "1062.00",
    paymentMode: "prepaid",
    createdAt: new Date("2025-01-05"),
  } as ConsultantBooking,
  {
    id: "booking-4",
    userId: "user-1",
    providerId: "prov-3",
    serviceId: "srv-7",
    serviceType: "Legal Consultation",
    scheduledDate: new Date("2024-12-20"),
    scheduledTime: "03:00 PM",
    duration: 60,
    bookingType: "virtual",
    status: "completed",
    customerName: "Sneha Reddy",
    customerPhone: "+91 98765 43213",
    customerEmail: "sneha.reddy@example.com",
    basePrice: "1500.00",
    taxAmount: "270.00",
    totalAmount: "1770.00",
    paymentMode: "prepaid",
    createdAt: new Date("2024-12-15"),
  } as ConsultantBooking,
  {
    id: "booking-5",
    userId: "user-1",
    providerId: "prov-4",
    serviceId: "srv-9",
    serviceType: "Home Repair Service",
    scheduledDate: new Date("2024-12-28"),
    scheduledTime: "09:00 AM",
    duration: 120,
    bookingType: "in_person",
    status: "cancelled",
    customerName: "Vikram Singh",
    customerPhone: "+91 98765 43214",
    customerEmail: "vikram.singh@example.com",
    address: "456 Park Street",
    city: "Mumbai",
    pincode: "400001",
    basePrice: "2000.00",
    travelFee: "200.00",
    taxAmount: "396.00",
    totalAmount: "2596.00",
    paymentMode: "cod",
    createdAt: new Date("2024-12-22"),
  } as ConsultantBooking,
  {
    id: "booking-6",
    userId: "user-1",
    providerId: "prov-6",
    serviceId: "srv-13",
    serviceType: "Career Counseling",
    scheduledDate: new Date("2025-02-01"),
    scheduledTime: "04:00 PM",
    duration: 45,
    bookingType: "virtual",
    status: "confirmed",
    customerName: "Anjali Mehta",
    customerPhone: "+91 98765 43215",
    customerEmail: "anjali.mehta@example.com",
    basePrice: "700.00",
    taxAmount: "126.00",
    totalAmount: "826.00",
    paymentMode: "prepaid",
    createdAt: new Date("2025-01-22"),
  } as ConsultantBooking,
];

export default function ConsultantHistory() {
  const [, navigate] = useLocation();

  const { data: apiBookings = [], isLoading } = useQuery<ConsultantBooking[]>({
    queryKey: ["/api/consultant/bookings"],
  });

  // Use dummy data if API returns empty array
  const bookings = apiBookings.length > 0 ? apiBookings : dummyBookings;

  const upcomingBookings = bookings.filter(
    b => b.status === "confirmed" || b.status === "pending"
  );
  const pastBookings = bookings.filter(
    b => b.status === "completed" || b.status === "cancelled"
  );

  const handleViewDetails = (bookingId: string) => {
    navigate(`/consultant/booking/confirmation/${bookingId}`);
  };

  const handleRebook = (serviceId: string) => {
    navigate(`/consultant/booking/${serviceId}`);
  };

  const renderBookingCard = (booking: ConsultantBooking) => {
    const statusInfo = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;

    return (
      <div
        key={booking.id}
        data-testid={`card-booking-${booking.id}`}
        className="border border-white/10 bg-white/5 p-4"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-light text-white text-base tracking-wide mb-1">{booking.serviceType}</h3>
            <p className="text-white/60 text-xs uppercase tracking-widest">
              ID: {booking.id.slice(0, 8)}
            </p>
          </div>
          <span className={`${statusInfo.className} border-0 text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" strokeWidth={1} />
            {statusInfo.label}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="h-4 w-4" strokeWidth={1} />
            <span className="text-xs uppercase tracking-widest">
              {format(new Date(booking.scheduledDate), "dd MMM yyyy")}
            </span>
            <span className="mx-1 text-white/40">•</span>
            <Clock className="h-4 w-4" strokeWidth={1} />
            <span className="text-xs font-mono">{booking.scheduledTime}</span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            {booking.bookingType === "virtual" ? (
              <>
                <Video className="h-4 w-4" strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">Virtual</span>
              </>
            ) : (
              <>
                <Home className="h-4 w-4" strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">In-Person</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-white font-light">
            <IndianRupee className="h-4 w-4" strokeWidth={1} />
            <span className="font-mono">{parseFloat(booking.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            data-testid={`button-view-details-${booking.id}`}
            onClick={() => handleViewDetails(booking.id)}
            className="flex-1 border border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs uppercase tracking-widest py-2 px-4 flex items-center justify-center gap-2"
          >
            View Details
            <ChevronRight className="h-3 w-3" strokeWidth={1} />
          </button>
          {booking.status === "completed" && (
            <button
              data-testid={`button-rebook-${booking.id}`}
              onClick={() => handleRebook(booking.serviceId)}
              className="flex-1 bg-white text-black hover:bg-white/90 text-xs uppercase tracking-widest py-2 px-4 font-semibold"
            >
              Rebook
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-black pb-24">
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between py-4 px-4">
              <button
                onClick={() => navigate("/consultant/explore")}
                className="text-white hover:text-white/80"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1} />
              </button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">MY BOOKINGS</h1>
              </div>
              <div className="w-5" />
            </div>
          </div>
          <div className="pt-20 flex items-center justify-center h-96">
            <div className="text-white/60">Loading bookings...</div>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <button
              onClick={() => navigate("/consultant/explore")}
              className="text-white hover:text-white/80"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">MY BOOKINGS</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {bookings.length} Total
              </p>
            </div>
            <div className="w-5" />
          </div>
        </div>

        <div className="pt-20 px-4 pb-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none p-0 h-auto mb-6">
              <TabsTrigger
                value="upcoming"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/60 data-[state=active]:text-white uppercase tracking-widest text-xs py-3"
              >
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent text-white/60 data-[state=active]:text-white uppercase tracking-widest text-xs py-3"
              >
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3 mt-0">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(renderBookingCard)
              ) : (
                <div className="border border-white/10 bg-white/5 p-12 text-center">
                  <Clock4 className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-white/40 mb-1 uppercase tracking-widest text-xs">No upcoming bookings</p>
                  <p className="text-white/60 text-xs tracking-wide mb-6">
                    Book a service to get started
                  </p>
                  <Button
                    data-testid="button-explore-services"
                    onClick={() => navigate("/consultant/explore")}
                    className="bg-white text-black hover:bg-white/90 uppercase tracking-wider text-sm font-semibold h-11"
                  >
                    Explore Services
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-3 mt-0">
              {pastBookings.length > 0 ? (
                pastBookings.map(renderBookingCard)
              ) : (
                <div className="border border-white/10 bg-white/5 p-12 text-center">
                  <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-white/40 uppercase tracking-widest text-xs">No past bookings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
