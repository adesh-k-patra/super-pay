import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Armchair,
  Monitor,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'normal' | 'premium' | 'vip';
  isBooked: boolean;
  price: number;
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 20; i++) {
      let type: 'normal' | 'premium' | 'vip' = 'normal';
      let price = 1999;
      
      if (rowIndex < 2) {
        type = 'vip';
        price = 7999;
      } else if (rowIndex < 4) {
        type = 'premium';
        price = 3999;
      }
      
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        isBooked: Math.random() > 0.7,
        price
      });
    }
  });
  
  return seats;
};

export default function EventSeatSelection() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const date = searchParams.get('date') || '';
  const ticketsParam = searchParams.get('tickets') || '[]';
  
  const [seats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const ticketClasses = JSON.parse(decodeURIComponent(ticketsParam));
  const totalTicketsNeeded = ticketClasses.reduce((sum: number, tc: any) => sum + tc.quantity, 0);

  const handleSeatClick = (seatId: string, seat: Seat) => {
    if (seat.isBooked) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else if (prev.length < totalTicketsNeeded) {
        return [...prev, seatId];
      } else {
        toast({
          title: "Seat Limit Reached",
          description: `You can only select ${totalTicketsNeeded} seats`,
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length !== totalTicketsNeeded) {
      toast({
        title: "Incomplete Selection",
        description: `Please select exactly ${totalTicketsNeeded} seats`,
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/event-passenger-details?eventId=${id}&date=${date}&seats=${encodeURIComponent(JSON.stringify(selectedSeats))}&tickets=${ticketsParam}`);
  };

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (seat.isBooked) return 'bg-white/10 cursor-not-allowed';
    if (isSelected) return 'bg-white text-black';
    if (seat.type === 'vip') return 'bg-purple-500/20 hover:bg-purple-500/40 border-purple-500/40';
    if (seat.type === 'premium') return 'bg-blue-500/20 hover:bg-blue-500/40 border-blue-500/40';
    return 'bg-white/10 hover:bg-white/20 border-white/20';
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/events/${id}/booking?date=${date}`)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SELECT SEATS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {selectedSeats.length} of {totalTicketsNeeded} Selected
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Screen */}
        <div className="border-b border-white/10 pb-6">
          <div className="bg-gradient-to-b from-white/20 to-transparent p-3 mb-6">
            <Monitor className="h-6 w-6 mx-auto text-white/60" />
            <p className="text-center text-xs text-white/40 mt-2 uppercase tracking-wider">Stage</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 justify-center pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 border border-white/20"></div>
            <span className="text-xs text-white/60">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white text-black border border-white"></div>
            <span className="text-xs text-white/60">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 border border-white/10"></div>
            <span className="text-xs text-white/60">Booked</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="overflow-x-auto pb-6">
          <div className="min-w-max">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-white/40 w-4">{row}</span>
                <div className="flex gap-2">
                  {seats.filter(s => s.row === row).map(seat => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id, seat)}
                        disabled={seat.isBooked}
                        className={cn(
                          "w-8 h-8 border transition-all flex items-center justify-center text-xs",
                          getSeatColor(seat, isSelected)
                        )}
                        data-testid={`seat-${seat.id}`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs text-white/40 w-4">{row}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <div>
            <p className="text-white/60 text-sm font-light">Selected Seats</p>
            <p className="text-white text-xl font-light">
              {selectedSeats.length} / {totalTicketsNeeded}
            </p>
          </div>
          <Button
            onClick={handleContinue}
            disabled={selectedSeats.length !== totalTicketsNeeded}
            className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none font-light tracking-wider disabled:opacity-50"
            data-testid="button-continue"
          >
            Continue to Details
          </Button>
        </div>
      </div>
    </div>
  );
}
