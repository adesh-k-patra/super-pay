import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Train,
  ArrowLeft,
  Users,
  MinusCircle,
  PlusCircle,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ClassBooking {
  class: string;
  passengers: number;
  price: number;
  available: number;
}

export default function TrainClassSelection() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const trainId = params.get("trainId") || "";
  const trainNumber = params.get("trainNumber") || "";
  const trainName = params.get("trainName") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") || "";
  const departureTime = params.get("departureTime") || "";
  const arrivalTime = params.get("arrivalTime") || "";
  const duration = params.get("duration") || "";

  // Available classes for this train
  const availableClasses = [
    { class: "1A", name: "First AC", price: 2500, available: 15 },
    { class: "2A", name: "Second AC", price: 1500, available: 45 },
    { class: "3A", name: "Third AC", price: 1000, available: 67 },
    { class: "SL", name: "Sleeper", price: 400, available: 120 },
    { class: "CC", name: "Chair Car", price: 800, available: 30 },
    { class: "2S", name: "Second Sitting", price: 200, available: 0, waitlist: 15 },
    { class: "3E", name: "3AC Economy", price: 850, available: 25 },
  ];

  const [classBookings, setClassBookings] = useState<ClassBooking[]>([]);

  const addClassBooking = (classInfo: typeof availableClasses[0]) => {
    const existing = classBookings.find(b => b.class === classInfo.class);
    if (existing) {
      toast({
        title: "ALREADY ADDED",
        description: `${classInfo.name} is already in your booking`,
        variant: "destructive"
      });
      return;
    }

    setClassBookings([...classBookings, {
      class: classInfo.class,
      passengers: 1,
      price: classInfo.price,
      available: classInfo.available
    }]);
  };

  const removeClassBooking = (classCode: string) => {
    setClassBookings(classBookings.filter(b => b.class !== classCode));
  };

  const updatePassengerCount = (classCode: string, delta: number) => {
    setClassBookings(classBookings.map(b => {
      if (b.class === classCode) {
        const newCount = Math.max(1, Math.min(b.available, b.passengers + delta));
        return { ...b, passengers: newCount };
      }
      return b;
    }));
  };

  const totalPassengers = classBookings.reduce((sum, b) => sum + b.passengers, 0);
  const totalPrice = classBookings.reduce((sum, b) => sum + (b.price * b.passengers), 0);

  const handleProceed = () => {
    if (classBookings.length === 0) {
      toast({
        title: "NO CLASS SELECTED",
        description: "Please select at least one travel class",
        variant: "destructive"
      });
      return;
    }

    const bookingsData = classBookings.map(b => ({
      class: b.class,
      passengers: b.passengers,
      price: b.price
    }));

    const queryParams = new URLSearchParams({
      trainId,
      trainNumber,
      trainName,
      from,
      to,
      departureDate,
      departureTime,
      arrivalTime,
      duration,
      bookings: JSON.stringify(bookingsData),
      totalPassengers: totalPassengers.toString(),
      totalPrice: totalPrice.toString()
    });

    navigate(`/booking/train/passenger-details?${queryParams.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/train/results")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SELECT CLASS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Choose travel class & passengers
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Train Info */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-light text-white">{trainName}</h3>
              <p className="text-xs text-white/60 font-light">{trainNumber}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-white font-light">{departureTime}</p>
              <p className="text-xs text-white/60">{from}</p>
            </div>
            <div className="flex-1 mx-4 text-center">
              <p className="text-xs text-white/60">{duration}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-light">{arrivalTime}</p>
              <p className="text-xs text-white/60">{to}</p>
            </div>
          </div>
        </div>

        {/* Available Classes */}
        <div className="space-y-3">
          <h2 className="text-sm font-light text-white tracking-wider uppercase">Available Classes</h2>
          
          {availableClasses.map((classInfo) => {
            const isAdded = classBookings.some(b => b.class === classInfo.class);
            
            return (
              <div
                key={classInfo.class}
                className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-light text-white">{classInfo.name}</span>
                      <Badge className="bg-white/10 text-white border-white/20 text-xs font-light rounded-none">
                        {classInfo.class}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/60 font-light">{formatCurrency(classInfo.price)}</span>
                      <span className="text-white/40">•</span>
                      <span className={cn(
                        "font-light",
                        classInfo.available > 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {classInfo.available > 0
                          ? `${classInfo.available} Available`
                          : `Waitlist ${classInfo.waitlist || 0}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {!isAdded ? (
                    <Button
                      onClick={() => addClassBooking(classInfo)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 rounded-none"
                      disabled={classInfo.available === 0}
                      data-testid={`button-add-${classInfo.class}`}
                    >
                      ADD
                    </Button>
                  ) : (
                    <Button
                      onClick={() => removeClassBooking(classInfo.class)}
                      variant="outline"
                      size="sm"
                      className="border-red-400/20 text-red-400 hover:bg-red-400/10 rounded-none"
                      data-testid={`button-remove-${classInfo.class}`}
                    >
                      REMOVE
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Classes */}
        {classBookings.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
              <Users className="h-4 w-4" />
              Selected Classes
            </h2>

            {classBookings.map((booking) => (
              <div
                key={booking.class}
                className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-white text-black text-xs font-light rounded-none mb-2">
                      {booking.class}
                    </Badge>
                    <p className="text-sm text-white/60 font-light">
                      {formatCurrency(booking.price)} per person
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-light text-white">
                      {formatCurrency(booking.price * booking.passengers)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60 uppercase tracking-wider font-light">
                    Number of Passengers
                  </span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePassengerCount(booking.class, -1)}
                      disabled={booking.passengers <= 1}
                      className="h-8 w-8 p-0 rounded-none text-white hover:bg-white/10"
                      data-testid={`button-decrease-${booking.class}`}
                    >
                      <MinusCircle className="h-5 w-5" />
                    </Button>
                    <span className="text-xl font-light text-white min-w-[40px] text-center" data-testid={`text-count-${booking.class}`}>
                      {booking.passengers}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePassengerCount(booking.class, 1)}
                      disabled={booking.passengers >= booking.available}
                      className="h-8 w-8 p-0 rounded-none text-white hover:bg-white/10"
                      data-testid={`button-increase-${booking.class}`}
                    >
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Important Information */}
        <div className="border border-yellow-500/20 bg-yellow-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-yellow-500 font-light">Important Information</p>
              <ul className="text-xs text-white/60 font-light space-y-1 list-disc list-inside">
                <li>Berth/Seat allocation will be done automatically by IRCTC</li>
                <li>You can book multiple classes in one booking</li>
                <li>Passengers in each class will be assigned consecutive berths when possible</li>
                <li>Carry a valid photo ID for verification during journey</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {classBookings.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="w-full max-w-screen-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider font-light">Total</p>
                <p className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-wider font-light">Passengers</p>
                <p className="text-2xl font-light text-white">{totalPassengers}</p>
              </div>
            </div>
            <Button
              onClick={handleProceed}
              className="w-full bg-white text-black hover:bg-white/90 h-12 font-light tracking-wider rounded-none"
              data-testid="button-proceed"
            >
              CONTINUE TO PASSENGER DETAILS
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
