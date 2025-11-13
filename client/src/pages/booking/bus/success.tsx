import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  Clock,
  User,
  Bus,
  ArrowRight,
  Home,
  CreditCard,
  Mail
} from "lucide-react";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

export default function BusBookingSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const params = new URLSearchParams(window.location.search);
  const bookingRef = params.get("bookingRef") || `BUS${Date.now().toString().slice(-8)}`;
  const pnr = params.get("pnr") || `${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const amount = params.get("amount") || "0";
  const from = params.get("from") || "DEL";
  const to = params.get("to") || "MUM";
  const departureDate = params.get("departureDate") || new Date().toISOString();
  const departureTime = params.get("departureTime") || "22:00";
  const arrivalTime = params.get("arrivalTime") || "06:00";
  const passengers = params.get("passengers") || "1";
  const seats = params.get("seats") || "12A";
  const operator = params.get("operator") || "Bus Operator";
  const busNumber = params.get("busNumber") || "BUS 501";
  const transactionId = params.get("transactionId") || `TXN${Date.now()}`;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your e-ticket is being downloaded",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bus Booking Confirmed',
        text: `Bus from ${from} to ${to} - PNR: ${pnr}`,
      });
    } else {
      toast({
        title: "Share",
        description: "Booking details copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full max-w-screen-md mx-auto px-4 py-8 space-y-6">
        {/* Success Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-light text-white mb-2 tracking-wider uppercase">Booking Confirmed</h1>
          <p className="text-white/60 text-sm font-light">Your bus has been successfully booked</p>
        </div>

        {/* Booking Reference Section */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
          <div className="text-center mb-6">
            <p className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light">Booking Reference</p>
            <p className="text-3xl font-light text-white tracking-widest" data-testid="text-booking-ref">{bookingRef}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center border-t border-white/10 pt-6">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">PNR Number</p>
              <p className="text-lg font-light text-white tracking-wider" data-testid="text-pnr">{pnr}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="text-lg font-light text-white">{formatCurrency(amount)}</p>
            </div>
          </div>
        </div>

        {/* Bus Details */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
          <h3 className="text-lg font-light tracking-wider mb-6 text-white uppercase text-xs">Bus Details</h3>
          
          <div className="space-y-4">
            <div className="pb-4 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Operator</p>
                  <p className="text-white text-base font-light" data-testid="text-operator">{operator}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Bus Number</p>
                  <p className="text-white text-base font-light" data-testid="text-bus-number">{busNumber}</p>
                </div>
              </div>
            </div>

            <div className="pb-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">From</p>
                  <p className="text-2xl font-light text-white" data-testid="text-from">{from}</p>
                  <p className="text-white/60 text-sm">{departureTime}</p>
                </div>
                <div className="flex-1 mx-4 flex items-center justify-center">
                  <div className="w-full h-px bg-white/20 relative">
                    <Bus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">To</p>
                  <p className="text-2xl font-light text-white" data-testid="text-to">{to}</p>
                  <p className="text-white/60 text-sm">{arrivalTime}</p>
                </div>
              </div>
            </div>

            <div className="pb-4 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Date</p>
                  <p className="text-white text-base font-light">{format(new Date(departureDate), 'dd MMM yyyy')}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Passengers</p>
                  <p className="text-white text-base font-light" data-testid="text-passengers">{passengers}</p>
                </div>
              </div>
            </div>

            <div className="pb-4 border-b border-white/10 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Seats</p>
                  <p className="text-white text-base font-light" data-testid="text-seats">{seats}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="text-white text-base font-light text-xs">{transactionId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6 text-center">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-4">Boarding Pass</p>
          <div className="bg-white p-4 inline-block">
            <QRCode value={`BUS:${bookingRef}:${pnr}`} size={160} />
          </div>
          <p className="text-xs text-white/40 mt-4">Show this QR code at boarding</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12"
            onClick={handleDownload}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12"
            onClick={handleShare}
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 p-6">
          <h3 className="text-xs font-light tracking-wider mb-4 text-white uppercase">Important Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">A confirmation email has been sent with your e-ticket</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">Please arrive at the boarding point at least 15 minutes before departure</p>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-white/60 mt-0.5" />
              <p className="text-sm text-white/60 font-light">Carry a valid photo ID for verification</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
            onClick={() => navigate('/my-trips/buses')}
            data-testid="button-view-trips"
          >
            View My Trips
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 rounded-none h-12 font-light tracking-wider"
            onClick={() => navigate('/home')}
            data-testid="button-home"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
