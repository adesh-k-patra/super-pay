import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Video,
  Home,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Download,
  Share2,
  Building
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useUrlTab } from "@/hooks/use-url-tab";
import QRCode from "react-qr-code";
import type { ConsultantBooking } from "@shared/schema";

// Dummy bookings data (same as in history page)
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

export default function ConsultantConfirmation() {
  const params = useParams<{ bookingId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useUrlTab("overview");

  const { data: apiBooking, isLoading } = useQuery<ConsultantBooking>({
    queryKey: [`/api/consultant/bookings/${params.bookingId}`],
    enabled: !!params.bookingId,
  });

  // Use API booking if available, otherwise find from dummy data
  const booking = apiBooking || dummyBookings.find(b => b.id === params.bookingId);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Booking Confirmed`,
          text: `Booking ID: ${booking?.id.slice(0, 12)} - ${booking?.serviceType}`,
        });
        toast({
          title: "SHARED SUCCESSFULLY",
          description: "Booking details shared successfully",
        });
      } else {
        await navigator.clipboard.writeText(`Booking ID: ${booking?.id.slice(0, 12)}`);
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
      description: "Downloading your booking confirmation...",
    });
  };

  if (isLoading || !booking) {
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
                <h1 className="text-base font-bold tracking-wider">LOADING...</h1>
              </div>
              <div className="w-5" />
            </div>
          </div>
          <div className="pt-20 flex items-center justify-center h-96">
            <div className="text-white/60">Loading...</div>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-32">
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
              <h1 className="text-base font-bold tracking-wider">BOOKING CONFIRMED</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {booking.serviceType}
              </p>
            </div>
            <div className="w-5" />
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
                value="details" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                data-testid="tab-details"
              >
                Details
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Success Message */}
              <div className="border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6 text-center">
                <div className="w-16 h-16 border-2 border-green-500/20 bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-400" strokeWidth={1} />
                </div>
                <h2 className="text-xl font-light text-white tracking-wide mb-2">Booking Confirmed</h2>
                <p className="text-white/70 text-sm uppercase tracking-widest">
                  Service Successfully Booked
                </p>
              </div>

              {/* Booking ID */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Booking ID</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-base font-light text-white tracking-wider font-mono" data-testid="text-booking-id">
                    {booking.id.slice(0, 12)}
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
                  <span className="bg-green-500/20 text-green-300 text-[10px] px-2 py-1 uppercase tracking-widest">
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Service</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-base font-light text-white" data-testid="text-service">
                    {booking.serviceType}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-white/40" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Date</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-sm font-light text-white" data-testid="text-date">
                      {format(new Date(booking.scheduledDate), "dd MMM yyyy")}
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
                      {booking.scheduledTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Type */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {booking.bookingType === "virtual" ? (
                    <Video className="h-4 w-4 text-white/40" />
                  ) : (
                    <Home className="h-4 w-4 text-white/40" />
                  )}
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Type</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white">
                    {booking.bookingType === "virtual" ? "Virtual Consultation" : "In-Person Service"}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Duration</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-sm font-light text-white" data-testid="text-duration">
                    {booking.duration} minutes
                  </p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-white/5 border border-white/10 p-6">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-light mb-2">Total Amount</p>
                <p className="text-3xl font-light text-white" data-testid="text-price">
                  <span className="inline-flex items-center">
                    <IndianRupee className="h-6 w-6" strokeWidth={1} />
                    {parseFloat(booking.totalAmount || "0").toFixed(2)}
                  </span>
                </p>
              </div>
            </TabsContent>

            {/* QR Code Tab */}
            <TabsContent value="qr" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-white p-6 rounded-none mb-6">
                  <QRCode
                    value={`BOOKING:${booking.id}:${booking.serviceType}`}
                    size={200}
                    data-testid="qr-code"
                  />
                </div>
                <p className="text-sm text-white/60 text-center mb-2">Scan this QR code for verification</p>
                <p className="text-xs text-white/40 font-mono">{booking.id.slice(0, 12)}</p>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-0 space-y-6">
              {/* Customer Details */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Customer Details</p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-xs text-white/60 mb-1">Name</p>
                    <p className="text-sm font-light text-white" data-testid="text-customer-name">
                      {booking.customerName}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-xs text-white/60 mb-1">Phone</p>
                    <p className="text-sm font-light text-white font-mono" data-testid="text-customer-phone">
                      {booking.customerPhone}
                    </p>
                  </div>

                  {booking.customerEmail && (
                    <div className="bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-white/60 mb-1">Email</p>
                      <p className="text-sm font-light text-white" data-testid="text-customer-email">
                        {booking.customerEmail}
                      </p>
                    </div>
                  )}

                  {booking.bookingType === "in_person" && booking.address && (
                    <div className="bg-white/5 border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-white/60" />
                        <p className="text-xs text-white/60">Service Address</p>
                      </div>
                      <p className="text-sm font-light text-white leading-relaxed">
                        {booking.address}
                        {booking.city && `, ${booking.city}`}
                        {booking.pincode && ` - ${booking.pincode}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Payment Summary</p>
                </div>
                
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 space-y-3">
                  <div className="flex justify-between text-sm text-white/70">
                    <span className="uppercase tracking-widest text-xs">Service Charge</span>
                    <span className="flex items-center font-mono">
                      <IndianRupee className="h-3 w-3" strokeWidth={1} />
                      {parseFloat(booking.basePrice || "0").toFixed(2)}
                    </span>
                  </div>
                  
                  {booking.travelFee && parseFloat(booking.travelFee) > 0 && (
                    <div className="flex justify-between text-sm text-white/70">
                      <span className="uppercase tracking-widest text-xs">Travel Fee</span>
                      <span className="flex items-center font-mono">
                        <IndianRupee className="h-3 w-3" strokeWidth={1} />
                        {parseFloat(booking.travelFee || "0").toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-white/70">
                    <span className="uppercase tracking-widest text-xs">Tax (GST)</span>
                    <span className="flex items-center font-mono">
                      <IndianRupee className="h-3 w-3" strokeWidth={1} />
                      {parseFloat(booking.taxAmount || "0").toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-semibold text-base">
                    <span className="uppercase tracking-wider">Total Paid</span>
                    <span className="flex items-center font-mono">
                      <IndianRupee className="h-5 w-5" strokeWidth={1} />
                      {parseFloat(booking.totalAmount || "0").toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest">
                      {booking.paymentMode === "prepaid" ? "Prepaid" : "Pay at Service"}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="grid grid-cols-2 gap-3 max-w-screen-lg mx-auto">
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
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
