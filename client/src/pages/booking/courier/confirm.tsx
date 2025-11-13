import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Navigation, Package as PackageIcon, User, Shield, Calendar, ChevronRight, IndianRupee, CreditCard, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CourierConfirm() {
  const [, navigate] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("online");

  useEffect(() => {
    const saved = localStorage.getItem('courierBooking');
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
  }, []);

  const handleConfirmBooking = () => {
    if (!bookingData) return;

    const bookingId = `COU${Date.now()}`;
    const pricing = bookingData.pricing || {};
    
    const finalBooking = {
      ...bookingData,
      bookingId,
      paymentMethod,
      totalAmount: Math.round(pricing.total || 0),
      status: paymentMethod === "online" ? "pending_payment" : "confirmed",
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('currentCourierBooking', JSON.stringify(finalBooking));
    
    if (paymentMethod === "online") {
      const paymentParams = new URLSearchParams({
        amount: finalBooking.totalAmount.toString(),
        transactionType: 'courier-booking',
        bookingId: bookingId,
        returnUrl: `/booking/courier/tracking/${bookingId}`
      });

      navigate(`/upi-payment?${paymentParams.toString()}`);
    } else {
      // For COD, go directly to tracking
      navigate(`/booking/courier/tracking/${bookingId}`);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Loading booking details...</p>
      </div>
    );
  }

  const { vehicle, contactDetails, pricing = {} } = bookingData;
  const totalAmount = Math.round(pricing.total || 0);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="relative flex items-center justify-center py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking/courier/details")}
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider uppercase">Confirm Booking</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Review & Pay</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Booking Type Badge */}
        {bookingData.bookingType === "scheduled" && (
          <div className="mb-4">
            <Badge className="bg-white/20 text-white border-white/30 rounded-none text-xs px-3 py-1 font-light tracking-widest">
              <Calendar className="h-3 w-3 mr-1" strokeWidth={1} />
              SCHEDULED BOOKING
            </Badge>
          </div>
        )}

        {/* Route Details */}
        <div className="mb-6 border border-white/10 bg-white/5 p-5">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Route Details</h3>
          
          {/* Route Section */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-6 mb-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-1">Pickup</p>
                  <p className="font-light text-sm truncate">{bookingData.pickupLocation}</p>
                  {contactDetails?.pickupContactName && (
                    <p className="text-xs text-white/50 mt-1">
                      {contactDetails.pickupContactName} • {contactDetails.pickupContactPhone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-1">Drop</p>
                  <p className="font-light text-sm truncate">{bookingData.dropLocation}</p>
                  {contactDetails?.dropContactName && (
                    <p className="text-xs text-white/50 mt-1">
                      {contactDetails.dropContactName} • {contactDetails.dropContactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Distance Badge */}
            <div className="flex items-center gap-2">
              <div className="border-l border-white/20 h-4 ml-1"></div>
              <div className="text-xs text-white/60 font-light">
                <span className="text-white/40 uppercase tracking-widest text-[10px]">Distance: </span>
                <span className="text-white font-semibold">{pricing.estimatedDistance || 0} km</span>
              </div>
            </div>
          </div>

          {/* Package Details Section */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-light mb-3">Package Details</p>
            
            <div className="grid grid-cols-3 gap-4 text-xs mb-3">
              <div>
                <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Item Type</p>
                <p className="font-light capitalize">{bookingData.itemType?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Quantity</p>
                <p className="font-light">{bookingData.quantity || 1}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Weight</p>
                <p className="font-light">{bookingData.weightKg} kg</p>
              </div>
            </div>

            {(bookingData.dimensionsLCm || bookingData.dimensionsWCm || bookingData.dimensionsHCm) && (
              <div className="text-xs">
                <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Dimensions (L×W×H)</p>
                <p className="font-light">
                  {bookingData.dimensionsLCm || '—'} × {bookingData.dimensionsWCm || '—'} × {bookingData.dimensionsHCm || '—'} cm
                </p>
              </div>
            )}
          </div>

          {bookingData.bookingType === "scheduled" && (
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-1">Scheduled For</p>
              <p className="font-light text-sm">{bookingData.scheduledDate} at {bookingData.scheduledTime}</p>
            </div>
          )}
        </div>

        {/* Vehicle & Package Details */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Vehicle</h3>
            <p className="text-sm font-semibold uppercase tracking-wider">{vehicle?.name}</p>
            <p className="text-xs text-white/50 font-light mt-0.5">{vehicle?.eta}</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Package</h3>
            <p className="text-sm font-light capitalize">{bookingData.itemType?.replace('_', ' ')}</p>
            <p className="text-xs text-white/50 font-light mt-0.5">{bookingData.weightKg} kg • {bookingData.quantity} item(s)</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-light">
              <span className="text-white/60">Base Fare</span>
              <span>₹{pricing.basePrice || 0}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Distance ({pricing.estimatedDistance || 0} km × ₹{vehicle?.pricePerKm || 0})</span>
              <span>₹{Math.round(pricing.distanceCharge || 0)}</span>
            </div>
            <div className="flex justify-between font-light">
              <span className="text-white/60">Platform Fee</span>
              <span>₹{pricing.platformFee || 0}</span>
            </div>
            {bookingData.insuranceRequired && pricing.insuranceCharge > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">Insurance (₹{bookingData.insuranceValue?.toLocaleString()})</span>
                <span>₹{Math.round(pricing.insuranceCharge)}</span>
              </div>
            )}
            {bookingData.codRequired && bookingData.codAmount > 0 && (
              <div className="flex justify-between font-light">
                <span className="text-white/60">COD Charges (₹{bookingData.codAmount?.toLocaleString()})</span>
                <span>₹{Math.max(20, bookingData.codAmount * 0.02).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between font-light">
              <span className="text-white/60">GST (18%)</span>
              <span>₹{Math.round(pricing.gst || 0)}</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between text-base">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold" data-testid="text-total-amount">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Insurance/COD Info */}
        {(bookingData.insuranceRequired || bookingData.codRequired) && (
          <div className="mb-6 space-y-3">
            {bookingData.insuranceRequired && (
              <div className="flex items-start gap-3 border border-green-500/30 bg-green-500/10 p-4">
                <Shield className="h-4 w-4 text-green-400 shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <p className="text-sm font-semibold text-green-300 mb-1">Insured Shipment</p>
                  <p className="text-xs text-green-300/80 font-light">Covered up to ₹{bookingData.insuranceValue?.toLocaleString()}</p>
                </div>
              </div>
            )}
            {bookingData.codRequired && (
              <div className="flex items-start gap-3 border border-blue-500/30 bg-blue-500/10 p-4">
                <IndianRupee className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <p className="text-sm font-semibold text-blue-300 mb-1">Cash on Delivery</p>
                  <p className="text-xs text-blue-300/80 font-light">Collect ₹{bookingData.codAmount?.toLocaleString()} from receiver</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Method */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">Payment Method</h3>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`w-full p-4 border transition-all flex items-center gap-3 ${
                paymentMethod === "online"
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              data-testid="button-payment-online"
            >
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                paymentMethod === "online" ? "border-white" : "border-white/40"
              }`}>
                {paymentMethod === "online" && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
              <CreditCard className="h-5 w-5 text-white/60" strokeWidth={1} />
              <div className="text-left flex-1">
                <p className="text-sm font-semibold uppercase tracking-wider">Online Payment</p>
                <p className="text-xs text-white/50 font-light">UPI, Cards, Wallets</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`w-full p-4 border transition-all flex items-center gap-3 ${
                paymentMethod === "cod"
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              data-testid="button-payment-cod"
            >
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                paymentMethod === "cod" ? "border-white" : "border-white/40"
              }`}>
                {paymentMethod === "cod" && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
              <IndianRupee className="h-5 w-5 text-white/60" strokeWidth={1} />
              <div className="text-left flex-1">
                <p className="text-sm font-semibold uppercase tracking-wider">Cash on Delivery</p>
                <p className="text-xs text-white/50 font-light">Pay driver after delivery</p>
              </div>
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-3">Terms & Conditions</h3>
          <ul className="space-y-2 text-xs text-white/50 font-light">
            <li>• Cancellation charges may apply after driver assignment</li>
            <li>• Package will be inspected for prohibited items</li>
            <li>• Delivery time is estimated and may vary based on traffic</li>
            <li>• Proof of delivery is mandatory for completion</li>
            <li>• For fragile items, proper packaging is customer's responsibility</li>
          </ul>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={handleConfirmBooking}
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none"
            data-testid="button-confirm-pay"
          >
            <div className="flex items-center justify-between w-full px-2">
              <span>{paymentMethod === "online" ? "PAY & CONFIRM" : "CONFIRM BOOKING"}</span>
              <div className="flex items-center gap-2">
                <span>₹{totalAmount}</span>
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
