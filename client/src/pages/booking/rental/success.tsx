import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Download,
  Share2,
  Home,
  MapPin,
  Clock,
  Key
} from "lucide-react";

export default function RentalSuccess() {
  const [, navigate] = useLocation();

  const booking = {
    bookingId: 'RNT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    vehicle: {
      brand: 'Maruti Suzuki',
      name: 'Swift',
      category: 'Hatchback',
      number: 'DL 8C 1234'
    },
    pickup: {
      date: '15 Oct 2024',
      time: '10:00 AM',
      location: 'Connaught Place, Delhi'
    },
    drop: {
      date: '17 Oct 2024',
      time: '10:00 AM',
      location: 'Connaught Place, Delhi'
    },
    driver: {
      name: 'John Doe',
      license: 'DL-1420110012345'
    },
    payment: {
      rental: 2400,
      gst: 120,
      deposit: 5000,
      total: 7520,
      method: 'UPI'
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-48">
      {/* Success Animation */}
      <div className="relative pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent"></div>
        <div className="relative text-center">
          <div className="inline-block p-6 rounded-full bg-green-500/20 mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-light mb-2 tracking-wider">BOOKING CONFIRMED</h1>
          <p className="text-white/60 mb-2">Your rental is all set!</p>
          <p className="text-sm text-white/40">Booking ID: {booking.bookingId}</p>
        </div>
      </div>

      <div className="px-4 space-y-6 max-w-screen-lg mx-auto">
        {/* Vehicle Details */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-light mb-1">
                {booking.vehicle.brand} {booking.vehicle.name}
              </h2>
              <p className="text-sm text-white/60">{booking.vehicle.number}</p>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 rounded-none px-3 py-1">
              {booking.vehicle.category}
            </Badge>
          </div>

          <div className="bg-white/5 p-4 rounded-none flex items-center justify-center gap-3">
            <Key className="h-5 w-5 text-yellow-500" />
            <div className="text-center">
              <div className="text-sm font-light">Digital Key Available</div>
              <div className="text-xs text-white/60">Access via app on pickup date</div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Trip Details</h3>
          
          <div className="space-y-4">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-white/60 mb-1">PICKUP</div>
                <div className="font-light">{booking.pickup.location}</div>
                <div className="text-sm text-white/60 mt-1 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {booking.pickup.date} at {booking.pickup.time}
                </div>
              </div>
            </div>

            {/* Drop */}
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-white/60 mb-1">DROP</div>
                <div className="font-light">{booking.drop.location}</div>
                <div className="text-sm text-white/60 mt-1 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {booking.drop.date} at {booking.drop.time}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Driver Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Name</span>
              <span className="font-light">{booking.driver.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">License Number</span>
              <span className="font-light font-mono">{booking.driver.license}</span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Payment Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Rental Charges</span>
              <span className="font-light">₹{booking.payment.rental}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">GST (5%)</span>
              <span className="font-light">₹{booking.payment.gst}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Security Deposit</span>
              <span className="font-light">₹{booking.payment.deposit}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="font-light text-lg">Total Paid</span>
              <span className="text-3xl font-light">₹{booking.payment.total}</span>
            </div>
            <div className="text-xs text-center text-white/60 pt-2">
              Paid via {booking.payment.method}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-none">
          <h4 className="text-xs uppercase tracking-widest text-blue-500 mb-3">Important Information</h4>
          <div className="space-y-2 text-sm text-white/80">
            <p>• Bring original driving license at pickup</p>
            <p>• Security deposit refunded within 7 days</p>
            <p>• Contact support for any changes</p>
            <p>• Download booking details for reference</p>
          </div>
        </div>

      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-12 rounded-none font-light"
              data-testid="button-download"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-12 rounded-none font-light"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Home Button */}
          <Button
            onClick={() => navigate("/home")}
            className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-none font-light text-base tracking-widest"
            data-testid="button-home"
          >
            <Home className="h-5 w-5 mr-2" />
            GO TO HOME
          </Button>
        </div>
      </div>
    </div>
  );
}
