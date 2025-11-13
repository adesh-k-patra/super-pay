import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bus,
  ArrowLeft,
  Armchair,
  Users,
  ChevronRight,
  Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type SeatStatus = "available" | "booked" | "selected" | "ladies";

interface Seat {
  id: string;
  row: number;
  column: number;
  status: SeatStatus;
  price: number;
  deck: "lower" | "upper";
}

export default function BusSeatSelection() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const busId = params.get("busId") || "1";
  const operator = params.get("operator") || "VRL Travels";
  const from = params.get("from") || "DEL";
  const to = params.get("to") || "MUM";
  const departureDate = params.get("departureDate") || "";
  const departureTime = params.get("departureTime") || "22:00";
  const arrivalTime = params.get("arrivalTime") || "06:00";
  const duration = params.get("duration") || "8h";
  const baseFare = parseFloat(params.get("fare") || "800");

  // Generate seat layout
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const totalRows = 12;
    
    // Lower deck - standard seating layout
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= 4; col++) {
        // Skip column 2 (aisle) in most rows
        if (col === 2 && row > 1) continue;
        
        const seatNum = `L${row}${String.fromCharCode(64 + col)}`;
        const random = Math.random();
        let status: SeatStatus = "available";
        
        // Randomly assign some seats as booked, ladies, or available
        if (random < 0.3) status = "booked";
        else if (random < 0.4 && col === 4) status = "ladies";
        
        seats.push({
          id: seatNum,
          row,
          column: col,
          status,
          price: baseFare + (row <= 2 ? 50 : 0), // Premium for front seats
          deck: "lower"
        });
      }
    }

    // Upper deck - sleeper layout
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 4; col++) {
        if (col === 2 && row > 1) continue;
        
        const seatNum = `U${row}${String.fromCharCode(64 + col)}`;
        const random = Math.random();
        let status: SeatStatus = "available";
        
        if (random < 0.25) status = "booked";
        else if (random < 0.35 && col === 4) status = "ladies";
        
        seats.push({
          id: seatNum,
          row,
          column: col,
          status,
          price: baseFare + 150, // Sleeper premium
          deck: "upper"
        });
      }
    }

    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedDeck, setSelectedDeck] = useState<"lower" | "upper">("lower");

  const selectedSeats = seats.filter(s => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const toggleSeat = (seatId: string) => {
    setSeats(seats.map(seat => {
      if (seat.id === seatId) {
        if (seat.status === "booked" || seat.status === "ladies") {
          toast({
            title: "SEAT UNAVAILABLE",
            description: seat.status === "ladies" ? "This seat is reserved for ladies" : "This seat is already booked",
            variant: "destructive"
          });
          return seat;
        }
        return {
          ...seat,
          status: seat.status === "selected" ? "available" : "selected"
        };
      }
      return seat;
    }));
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "NO SEAT SELECTED",
        description: "Please select at least one seat",
        variant: "destructive"
      });
      return;
    }

    const queryParams = new URLSearchParams({
      busId,
      operator,
      from,
      to,
      departureDate,
      departureTime,
      arrivalTime,
      duration,
      seats: selectedSeats.map(s => s.id).join(","),
      passengers: selectedSeats.length.toString(),
      totalPrice: totalPrice.toString()
    });

    navigate(`/booking/bus/passenger-details?${queryParams.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentDeckSeats = seats.filter(s => s.deck === selectedDeck);
  const maxRow = Math.max(...currentDeckSeats.map(s => s.row));
  const maxCol = 4;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/bus/results")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SELECT SEATS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              Choose your preferred seats
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Bus Info */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-light text-white">{operator}</h3>
              <p className="text-xs text-white/60 font-light">{selectedDeck === "lower" ? "Semi-Sleeper AC" : "Sleeper AC"}</p>
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

        {/* Deck Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDeck("lower")}
            className={cn(
              "flex-1 py-3 border transition-all text-xs tracking-wider font-light rounded-none",
              selectedDeck === "lower"
                ? "bg-white text-black border-white"
                : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
            )}
            data-testid="button-deck-lower"
          >
            LOWER DECK
          </button>
          <button
            onClick={() => setSelectedDeck("upper")}
            className={cn(
              "flex-1 py-3 border transition-all text-xs tracking-wider font-light rounded-none",
              selectedDeck === "upper"
                ? "bg-white text-black border-white"
                : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
            )}
            data-testid="button-deck-upper"
          >
            UPPER DECK (SLEEPER)
          </button>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-sm"></div>
            <span className="text-white/60 font-light">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border-2 border-white rounded-sm"></div>
            <span className="text-white/60 font-light">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-sm"></div>
            <span className="text-white/60 font-light">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-500/20 border border-pink-500/40 rounded-sm"></div>
            <span className="text-white/60 font-light">Ladies</span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
          {/* Driver Section */}
          <div className="flex items-center justify-end mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-white/40" />
              <span className="text-xs text-white/40 uppercase tracking-wider font-light">Driver</span>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="space-y-2">
            {Array.from({ length: maxRow }, (_, rowIndex) => {
              const row = rowIndex + 1;
              return (
                <div key={row} className="flex gap-2 justify-center">
                  {Array.from({ length: maxCol }, (_, colIndex) => {
                    const col = colIndex + 1;
                    
                    // Aisle space
                    if (col === 2 && row > 1) {
                      return (
                        <div key={`aisle-${row}-${col}`} className="w-12 flex items-center justify-center">
                          <div className="text-white/20 text-xs font-light">
                            ╎
                          </div>
                        </div>
                      );
                    }

                    const seat = currentDeckSeats.find(s => s.row === row && s.column === col);
                    if (!seat) return <div key={`empty-${row}-${col}`} className="w-12"></div>;

                    const isSelected = seat.status === "selected";
                    const isBooked = seat.status === "booked";
                    const isLadies = seat.status === "ladies";
                    const isAvailable = seat.status === "available";

                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id)}
                        disabled={isBooked}
                        className={cn(
                          "w-12 h-12 border rounded-sm transition-all relative group",
                          isSelected && "bg-white border-2 border-white scale-105 shadow-lg shadow-white/20",
                          isAvailable && "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40",
                          isBooked && "bg-white/5 border-white/10 cursor-not-allowed opacity-50",
                          isLadies && "bg-pink-500/20 border-pink-500/40 hover:bg-pink-500/30"
                        )}
                        data-testid={`seat-${seat.id}`}
                      >
                        <Armchair className={cn(
                          "h-6 w-6 mx-auto",
                          isSelected && "text-black",
                          isAvailable && "text-white/60",
                          isBooked && "text-white/30",
                          isLadies && "text-pink-400"
                        )} />
                        <span className={cn(
                          "absolute bottom-0 left-0 right-0 text-[8px] font-light",
                          isSelected && "text-black",
                          isAvailable && "text-white/60",
                          isBooked && "text-white/30",
                          isLadies && "text-pink-400"
                        )}>
                          {seat.id}
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          <p className="text-xs text-white font-light">{seat.id}</p>
                          <p className="text-xs text-white/60 font-light">{formatCurrency(seat.price)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4">
            <h3 className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seat => (
                <Badge
                  key={seat.id}
                  className="bg-white text-black border-white text-sm font-light rounded-none px-3 py-1"
                >
                  {seat.id}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="w-full max-w-screen-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider font-light">Total Fare</p>
                <p className="text-2xl font-light text-white">{formatCurrency(totalPrice)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-wider font-light">Seats Selected</p>
                <p className="text-2xl font-light text-white">{selectedSeats.length}</p>
              </div>
            </div>
            <Button
              onClick={handleProceed}
              className="w-full bg-white text-black hover:bg-white/90 h-12 font-light tracking-wider rounded-none"
              data-testid="button-proceed"
            >
              PROCEED TO PASSENGER DETAILS
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
