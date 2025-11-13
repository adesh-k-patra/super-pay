import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Share, Calendar, Plane, MapPin, Clock, ArrowLeft } from "lucide-react";

export default function TravelConfirmation() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto mb-4">
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-white/80" strokeWidth={1} />
          </div>
          <h1 className="text-3xl font-light tracking-wider mb-2" data-testid="page-title">
            BOOKING CONFIRMED!
          </h1>
          <p className="text-white/60 text-xs uppercase tracking-widest font-light">Your travel booking has been successfully completed</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Booking Details */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Plane className="h-5 w-5 text-white" strokeWidth={1} />
            <h2 className="text-white text-lg font-light tracking-wider">BOOKING DETAILS</h2>
          </div>
          <div className="space-y-6">
            {/* Booking Reference */}
            <div className="bg-white/5 border border-white/20/20 rounded-none p-4">
              <div className="text-center">
                <p className="text-sm text-white/80 mb-1 uppercase tracking-wider">Booking Reference</p>
                <p className="text-2xl font-light text-white" data-testid="booking-reference">
                  TRV-2024-001234
                </p>
              </div>
            </div>

            {/* Journey Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-light text-white">06:00</p>
                    <p className="text-sm text-white/60">Mumbai</p>
                    <p className="text-xs text-white/40">BOM</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center text-white/60">
                      <Clock className="h-4 w-4 mr-1" strokeWidth={1} />
                      <span className="text-sm">2h 30m</span>
                    </div>
                    <p className="text-xs text-white/40">Non-stop</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-light text-white">08:30</p>
                    <p className="text-sm text-white/60">Delhi</p>
                    <p className="text-xs text-white/40">DEL</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Airline</p>
                  <p className="text-white font-light">IndiGo</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Flight</p>
                  <p className="text-white font-light">6E-234</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Class</p>
                  <p className="text-white font-light">Economy</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Date</p>
                  <p className="text-white font-light">Dec 15, 2024</p>
                </div>
              </div>
            </div>

            <Separator className="bg-white/20" />

            {/* Passenger Details */}
            <div>
              <h3 className="text-lg font-light text-white mb-3 uppercase tracking-wider">Passenger Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Name:</span>
                  <span className="text-white">John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Seat:</span>
                  <span className="text-white">12A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Baggage:</span>
                  <span className="text-white">15kg included</span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/20" />

            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-light text-white mb-3 uppercase tracking-wider">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Amount Paid:</span>
                  <span className="text-white font-light">₹4,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Payment Method:</span>
                  <span className="text-white">UPI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Transaction ID:</span>
                  <span className="text-white">TXN123456789</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white/5 border border-white/10 rounded-none p-6 mb-6">
          <h2 className="text-white text-lg font-light tracking-wider mb-4">IMPORTANT INFORMATION</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-white/80 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-white font-light">Check-in opens 2 hours before departure</p>
                <p className="text-white/60">Web check-in available from 4:00 AM on Dec 15, 2024</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-white/80 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-white font-light">Arrive at airport 2 hours early</p>
                <p className="text-white/60">For domestic flights, arrive at least 2 hours before departure</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Plane className="h-4 w-4 text-white/80 mt-0.5" strokeWidth={1} />
              <div>
                <p className="text-white font-light">Carry valid ID proof</p>
                <p className="text-white/60">Aadhar card, passport, or driving license required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            variant="outline"
            className="border-white/20 text-white rounded-none h-12"
            data-testid="button-download-ticket"
          >
            <Download className="h-4 w-4 mr-2" strokeWidth={1} />
            Download Ticket
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white rounded-none h-12"
            data-testid="button-share"
          >
            <Share className="h-4 w-4 mr-2" strokeWidth={1} />
            Share Details
          </Button>
          <Button
            onClick={() => navigate("/my-trips")}
            className="bg-white/10 hover:bg-white/15 text-white rounded-none h-12"
            data-testid="button-view-trips"
          >
            View My Trips
          </Button>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Button
            onClick={() => navigate("/travel-booking")}
            variant="link"
            className="text-white/80 hover:text-white/70"
            data-testid="button-book-another"
          >
            Book Another Trip
          </Button>
        </div>
      </div>
    </div>
  );
}
