import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  X,
  Plane,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Seat {
  row: number;
  col: string;
  type: "window" | "middle" | "aisle";
  class: "economy" | "business" | "first";
  status: "available" | "selected" | "occupied";
  price: number;
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const columns = ["A", "B", "C", "D", "E", "F"];
  
  // Business class (rows 1-3)
  for (let row = 1; row <= 3; row++) {
    for (const col of ["A", "C", "D", "F"]) {
      seats.push({
        row,
        col,
        type: col === "A" || col === "F" ? "window" : "aisle",
        class: "business",
        status: Math.random() > 0.7 ? "occupied" : "available",
        price: 7500
      });
    }
  }

  // Economy class (rows 4-30)
  for (let row = 4; row <= 30; row++) {
    for (const col of columns) {
      seats.push({
        row,
        col,
        type: col === "A" || col === "F" ? "window" : (col === "C" || col === "D" ? "aisle" : "middle"),
        class: "economy",
        status: Math.random() > 0.6 ? "occupied" : "available",
        price: 4500
      });
    }
  }

  return seats;
};

export default function FlightSeatSelection() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const params = new URLSearchParams(window.location.search);
  const flightId = params.get("flightId") || "1";
  const adults = parseInt(params.get("adults") || "1");
  const children = parseInt(params.get("children") || "0");
  const totalPassengers = adults + children;

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedClass, setSelectedClass] = useState<"economy" | "business" | "first">("economy");

  const selectedSeats = seats.filter(s => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const toggleSeat = (seatId: string) => {
    const [row, col] = [parseInt(seatId.match(/\d+/)?.[0] || "0"), seatId.match(/[A-F]/)?.[0] || ""];
    
    setSeats(prevSeats => {
      const seat = prevSeats.find(s => s.row === row && s.col === col);
      if (!seat || seat.status === "occupied") return prevSeats;

      // Check if trying to select more seats than passengers
      const currentSelected = prevSeats.filter(s => s.status === "selected").length;
      if (seat.status === "available" && currentSelected >= totalPassengers) {
        toast({
          title: "Maximum seats selected",
          description: `You can only select ${totalPassengers} seat${totalPassengers !== 1 ? 's' : ''}`,
          variant: "destructive"
        });
        return prevSeats;
      }

      return prevSeats.map(s => {
        if (s.row === row && s.col === col) {
          return {
            ...s,
            status: s.status === "selected" ? "available" : "selected"
          };
        }
        return s;
      });
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        variant: "destructive"
      });
      return;
    }

    if (selectedSeats.length !== totalPassengers) {
      toast({
        title: "Incorrect number of seats",
        description: `Please select exactly ${totalPassengers} seat${totalPassengers !== 1 ? 's' : ''}`,
        variant: "destructive"
      });
      return;
    }

    const seatNumbers = selectedSeats.map(s => `${s.row}${s.col}`).join(",");
    navigate(`/flights/passenger-details?flightId=${flightId}&seats=${seatNumbers}&totalPrice=${totalPrice}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSeatsByClass = (className: "economy" | "business" | "first") => {
    return seats.filter(s => s.class === className);
  };

  const displaySeats = getSeatsByClass(selectedClass);
  const rows = Array.from(new Set(displaySeats.map(s => s.row))).sort((a, b) => a - b);
  const columns = selectedClass === "business" ? ["A", "C", "D", "F"] : ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/flights/results")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CHOOSE SEAT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Select {totalPassengers} seat{totalPassengers !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Class Selection */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5">
          <h3 className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light">Travel Class</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedClass("economy")}
              className={cn(
                "flex-1 py-3 border transition-all font-light tracking-wider",
                selectedClass === "economy"
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
              )}
              data-testid="button-class-economy"
            >
              Economy
            </button>
            <button
              onClick={() => setSelectedClass("business")}
              className={cn(
                "flex-1 py-3 border transition-all font-light tracking-wider",
                selectedClass === "business"
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
              )}
              data-testid="button-class-business"
            >
              Business
            </button>
          </div>
        </div>

        {/* Seat Legend */}
        <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-5">
          <h3 className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light">Seat Legend</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/10 border border-white/20"></div>
              <span className="text-white/60">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border-white flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-black" />
              </div>
              <span className="text-white/60">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                <X className="h-4 w-4 text-white/40" />
              </div>
              <span className="text-white/60">Occupied</span>
            </div>
          </div>
        </div>

        {/* Plane Front Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-white/40">
            <Plane className="h-5 w-5" />
            <span className="text-xs uppercase tracking-widest font-light">Front of plane</span>
          </div>
        </div>

        {/* Seat Map */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Column Headers */}
            <div className="flex justify-center mb-4">
              <div className="flex gap-2">
                {columns.slice(0, Math.ceil(columns.length / 2)).map(col => (
                  <div key={col} className="w-10 h-8 flex items-center justify-center text-xs text-white/60 font-light">
                    {col}
                  </div>
                ))}
                <div className="w-8"></div>
                {columns.slice(Math.ceil(columns.length / 2)).map(col => (
                  <div key={col} className="w-10 h-8 flex items-center justify-center text-xs text-white/60 font-light">
                    {col}
                  </div>
                ))}
              </div>
            </div>

            {/* Seat Rows */}
            <div className="space-y-2">
              {rows.map(row => (
                <div key={row} className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    {/* Left side seats */}
                    {columns.slice(0, Math.ceil(columns.length / 2)).map(col => {
                      const seat = displaySeats.find(s => s.row === row && s.col === col);
                      if (!seat) return <div key={col} className="w-10 h-10"></div>;
                      
                      return (
                        <button
                          key={`${row}${col}`}
                          onClick={() => toggleSeat(`${row}${col}`)}
                          disabled={seat.status === "occupied"}
                          className={cn(
                            "w-10 h-10 border transition-all text-xs font-light flex items-center justify-center",
                            seat.status === "available" && "bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20 text-white/80",
                            seat.status === "selected" && "bg-white border-white text-black",
                            seat.status === "occupied" && "bg-white/5 border-white/10 opacity-40 cursor-not-allowed"
                          )}
                          data-testid={`seat-${row}${col}`}
                        >
                          {seat.status === "selected" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : seat.status === "occupied" ? (
                            <X className="h-4 w-4 text-white/40" />
                          ) : (
                            seat.col
                          )}
                        </button>
                      );
                    })}

                    {/* Aisle */}
                    <div className="w-8 flex items-center justify-center">
                      <span className="text-xs text-white/40 font-light">{row}</span>
                    </div>

                    {/* Right side seats */}
                    {columns.slice(Math.ceil(columns.length / 2)).map(col => {
                      const seat = displaySeats.find(s => s.row === row && s.col === col);
                      if (!seat) return <div key={col} className="w-10 h-10"></div>;
                      
                      return (
                        <button
                          key={`${row}${col}`}
                          onClick={() => toggleSeat(`${row}${col}`)}
                          disabled={seat.status === "occupied"}
                          className={cn(
                            "w-10 h-10 border transition-all text-xs font-light flex items-center justify-center",
                            seat.status === "available" && "bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20 text-white/80",
                            seat.status === "selected" && "bg-white border-white text-black",
                            seat.status === "occupied" && "bg-white/5 border-white/10 opacity-40 cursor-not-allowed"
                          )}
                          data-testid={`seat-${row}${col}`}
                        >
                          {seat.status === "selected" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : seat.status === "occupied" ? (
                            <X className="h-4 w-4 text-white/40" />
                          ) : (
                            seat.col
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
            <h3 className="text-sm font-light text-white mb-4 tracking-wider uppercase">Selected Seats</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSeats.map(seat => (
                <Badge
                  key={`${seat.row}${seat.col}`}
                  className="bg-white text-black border-0 rounded-none px-3 py-2 text-sm"
                >
                  {seat.row}{seat.col}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">Total Price</p>
                <p className="text-2xl font-light text-white mt-1">{formatCurrency(totalPrice)}</p>
              </div>
              <p className="text-xs text-white/60">
                {selectedSeats.length} / {totalPassengers} seats selected
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={handleContinue}
          disabled={selectedSeats.length !== totalPassengers}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-continue"
        >
          <Users className="h-5 w-5 mr-2" />
          {selectedSeats.length > 0 
            ? `CONTINUE WITH ${selectedSeats.length} SEAT${selectedSeats.length !== 1 ? 'S' : ''}`
            : 'SELECT SEATS TO CONTINUE'
          }
        </Button>
      </div>
    </div>
  );
}
