import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package as PackageIcon, MapPin, User, Shield, Truck, Navigation, Download, Share2, Eye } from "lucide-react";

export default function CourierSuccess() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/booking/courier/success/:id");
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('currentCourierBooking');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.bookingId === params?.id) {
        setBooking(data);
        setIsLoading(false);
      } else {
        // Booking ID doesn't match, show message and redirect after 2 seconds
        setIsLoading(false);
        const timeout = setTimeout(() => {
          navigate("/booking");
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      // No booking data found, show message and redirect after 2 seconds
      setIsLoading(false);
      const timeout = setTimeout(() => {
        navigate("/booking");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [params?.id, navigate]);

  if (isLoading || !booking || !booking.vehicle) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <PackageIcon className="h-12 w-12 text-white/40 mx-auto mb-4 animate-pulse" strokeWidth={1} />
          <p className="text-white/60 mb-4">
            {!booking ? "Booking not found. Redirecting..." : "Loading booking details..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-green-900/30 to-black pt-12 pb-8 px-4">
        <div className="max-w-screen-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-wide">Booking Confirmed!</h1>
          <p className="text-white/60 text-sm font-light mb-4">
            Your courier booking has been confirmed
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2">
            <span className="text-xs text-white/40 uppercase tracking-widest">Booking ID:</span>
            <span className="text-sm font-bold tracking-wider" data-testid="text-booking-id">{booking.bookingId}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 w-full max-w-screen-lg mx-auto">
        {/* Next Steps */}
        <div className="mb-6 flex items-start gap-3 border border-green-500/30 bg-green-500/10 p-4">
          <Truck className="h-4 w-4 text-green-400 shrink-0 mt-0.5" strokeWidth={1} />
          <div>
            <p className="text-sm font-semibold text-green-300 mb-1">Driver Being Assigned</p>
            <p className="text-xs text-green-300/80 font-light">You'll be notified once a driver accepts your booking. Expected pickup in {booking.vehicle.eta}</p>
          </div>
        </div>

        {/* Route Details */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Route Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-white/40 text-xs uppercase tracking-widest font-light mb-0.5">Pickup</p>
                <p className="font-light">{booking.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-white/40 text-xs uppercase tracking-widest font-light mb-0.5">Drop</p>
                <p className="font-light">{booking.dropLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Package */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-white/60" strokeWidth={1} />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Vehicle</h3>
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-1">{booking.vehicle.name}</p>
            <p className="text-xs text-white/50 font-light">{booking.vehicle.description}</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <PackageIcon className="h-4 w-4 text-white/60" strokeWidth={1} />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Package</h3>
            </div>
            <p className="text-sm font-semibold capitalize mb-1">{booking.itemType?.replace('_', ' ')}</p>
            <p className="text-xs text-white/50 font-light">{booking.weightKg} kg • {booking.quantity || 1} item(s)</p>
          </div>
        </div>

        {/* Contact Details */}
        {booking.contactDetails && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-3 w-3 text-white/60" strokeWidth={1} />
                  <span className="text-xs text-white/40 uppercase tracking-widest">Sender</span>
                </div>
                <p className="text-sm font-light mb-0.5">{booking.contactDetails.pickupContactName}</p>
                <p className="text-xs text-white/50 font-light">{booking.contactDetails.pickupContactPhone}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-3 w-3 text-white/60" strokeWidth={1} />
                  <span className="text-xs text-white/40 uppercase tracking-widest">Receiver</span>
                </div>
                <p className="text-sm font-light mb-0.5">{booking.contactDetails.dropContactName}</p>
                <p className="text-xs text-white/50 font-light">{booking.contactDetails.dropContactPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-light">
              <span className="text-white/60">Base Fare</span>
              <span>₹{booking.pricing?.basePrice || booking.vehicle.basePrice}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Distance ({booking.pricing?.estimatedDistance || 0} km)</span>
              <span>₹{Math.round(booking.pricing?.distanceCharge || 0)}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Platform Fee</span>
              <span>₹{booking.pricing?.platformFee || 0}</span>
            </div>
            {booking.insuranceRequired && booking.insuranceCharge > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">Insurance (₹{booking.insuranceValue?.toLocaleString()})</span>
                <span>₹{Math.round(booking.insuranceCharge)}</span>
              </div>
            )}
            {booking.codRequired && booking.codAmount > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">COD Charges</span>
                <span>₹{Math.max(20, booking.codAmount * 0.02).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between font-light">
              <span className="text-white/60">GST (18%)</span>
              <span>₹{Math.round(booking.pricing?.gst || 0)}</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between text-base">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold" data-testid="text-total-paid">₹{booking.totalAmount}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-none text-[10px] px-2 py-0.5 font-light tracking-widest">
              {booking.paymentMethod === "online" ? "PAYMENT SUCCESSFUL" : "COD CONFIRMED"}
            </Badge>
          </div>
        </div>

        {/* Insurance Info */}
        {booking.insuranceRequired && (
          <div className="mb-6 flex items-start gap-3 border border-white/10 bg-white/5 p-4">
            <Shield className="h-4 w-4 text-white/60 shrink-0 mt-0.5" strokeWidth={1} />
            <div>
              <p className="text-xs font-semibold text-white uppercase tracking-widest mb-1">Insured Shipment</p>
              <p className="text-xs text-white/50 font-light">Covered up to ₹{booking.insuranceValue?.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate(`/booking/courier/tracking/${booking.bookingId}`)}
            className="w-full bg-white text-black hover:bg-white/90 h-12 font-semibold tracking-wider rounded-none"
            data-testid="button-track-shipment"
          >
            <Eye className="h-4 w-4 mr-2" strokeWidth={1.5} />
            TRACK SHIPMENT
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                alert("Receipt downloaded!");
              }}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-widest"
              data-testid="button-download"
            >
              <Download className="h-4 w-4 mr-2" strokeWidth={1} />
              RECEIPT
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                alert("Share functionality");
              }}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-widest"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4 mr-2" strokeWidth={1} />
              SHARE
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 z-50">
        <div className="max-w-screen-lg mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/booking")}
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-14 font-semibold tracking-wider"
            data-testid="button-back-to-booking"
          >
            <PackageIcon className="h-5 w-5 mr-2" strokeWidth={1.5} />
            BOOK AGAIN
          </Button>
          <Button
            onClick={() => navigate("/booking/courier/tracking/" + booking.bookingId)}
            className="flex-1 bg-white text-black hover:bg-white/90 h-14 font-semibold tracking-wider rounded-none"
            data-testid="button-view-tracking"
          >
            <Truck className="h-5 w-5 mr-2" strokeWidth={1.5} />
            VIEW TRACKING
          </Button>
        </div>
      </div>
    </div>
  );
}
