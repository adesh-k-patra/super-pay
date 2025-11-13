import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plane, Bus, Train, Clock, MapPin, User, Phone, Mail } from "lucide-react";

export default function TravelBookingDetails() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const [passengerInfo, setPassengerInfo] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const handleBookingConfirmation = () => {
    navigate("/travel-payment");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/travel-booking")}
            className="border-white/20 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1} />
          </Button>
          <div>
            <h1 className="text-3xl font-light tracking-wider" data-testid="page-title">
              BOOKING DETAILS
            </h1>
            <p className="text-white/60 text-xs uppercase tracking-widest font-light">Complete your travel booking</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Journey Summary */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-white" strokeWidth={1} />
            <h2 className="text-white text-lg font-light tracking-wider">JOURNEY SUMMARY</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-light text-white">06:00</p>
                  <p className="text-sm text-white/60">Mumbai</p>
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
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-light text-white">₹4,500</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">per person</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>IndiGo • 6E-234</span>
              <span>Economy</span>
              <span>Refundable</span>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-white" strokeWidth={1} />
            <h2 className="text-white text-lg font-light tracking-wider">PASSENGER INFORMATION</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80 text-xs uppercase tracking-wider">Title</Label>
                <Select value={passengerInfo.title} onValueChange={(value) => setPassengerInfo(prev => ({ ...prev, title: value }))}>
                  <SelectTrigger className="bg-black border-white/20 text-white rounded-none">
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20 rounded-none">
                    <SelectItem value="Mr" className="text-white">Mr</SelectItem>
                    <SelectItem value="Ms" className="text-white">Ms</SelectItem>
                    <SelectItem value="Mrs" className="text-white">Mrs</SelectItem>
                    <SelectItem value="Dr" className="text-white">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs uppercase tracking-wider">First Name</Label>
                <Input
                  value={passengerInfo.firstName}
                  onChange={(e) => setPassengerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-black border-white/20 text-white rounded-none"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs uppercase tracking-wider">Last Name</Label>
                <Input
                  value={passengerInfo.lastName}
                  onChange={(e) => setPassengerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-black border-white/20 text-white rounded-none"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-white" strokeWidth={1} />
            <h2 className="text-white text-lg font-light tracking-wider">CONTACT INFORMATION</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80 text-xs uppercase tracking-wider">Email</Label>
                <Input
                  type="email"
                  value={passengerInfo.email}
                  onChange={(e) => setPassengerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-black border-white/20 text-white rounded-none"
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs uppercase tracking-wider">Phone Number</Label>
                <Input
                  type="tel"
                  value={passengerInfo.phone}
                  onChange={(e) => setPassengerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-black border-white/20 text-white rounded-none"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-none p-6 mb-6">
          <h2 className="text-white text-lg font-light tracking-wider mb-4">PRICE BREAKDOWN</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-white">
              <span>Base fare (1 passenger)</span>
              <span>₹3,800</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Taxes & fees</span>
              <span>₹700</span>
            </div>
            <Separator className="bg-white/20" />
            <div className="flex justify-between text-xl font-light text-white">
              <span>Total Amount</span>
              <span>₹4,500</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleBookingConfirmation}
          disabled={!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email || !passengerInfo.phone}
          className="w-full bg-white/10 hover:bg-white/15 text-white rounded-none h-12 text-lg"
          data-testid="button-continue-payment"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
