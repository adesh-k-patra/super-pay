import { useState } from "react";
import { useParams, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  Circle,
  CheckCircle,
  Crown,
  Armchair,
  Sparkles
} from "lucide-react";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  language: string;
  genre: string[];
  duration: number;
  rating: string;
}

interface Theater {
  id: string;
  name: string;
  city: string;
  area: string;
}

interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  time: string;
  screen: string;
  format: string;
  language: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}

interface SeatSelection {
  row: number;
  seat: string;
  category: 'Premium' | 'Standard' | 'Economy';
  price: number;
}

const SEAT_PRICES = {
  Premium: 350,
  Standard: 250,
  Economy: 150
};

const getSeatCategory = (row: number): 'Premium' | 'Standard' | 'Economy' => {
  if (row <= 5) return 'Premium';
  if (row <= 15) return 'Standard';
  return 'Economy';
};

const generateSeats = () => {
  const seats = [];
  for (let row = 1; row <= 20; row++) {
    seats.push({ row, seats: ['A', 'B', 'C', 'D', 'E', 'F'] });
  }
  return seats;
};

const generateBookedSeats = (): string[] => {
  const bookedSeats: string[] = [];
  const totalBooked = 15 + Math.floor(Math.random() * 6);
  const allSeats: string[] = [];
  
  for (let row = 1; row <= 20; row++) {
    for (const seat of ['A', 'B', 'C', 'D', 'E', 'F']) {
      allSeats.push(`${row}${seat}`);
    }
  }
  
  const shuffled = allSeats.sort(() => Math.random() - 0.5);
  for (let i = 0; i < totalBooked && i < shuffled.length; i++) {
    bookedSeats.push(shuffled[i]);
  }
  
  return bookedSeats;
};

export default function MovieSeatSelection() {
  const { id: movieId } = useParams();
  const [, navigate] = useWouterLocation();
  
  const searchParams = new URLSearchParams(window.location.search);
  const showtimeId = searchParams.get('showtimeId') || '';
  const theaterId = searchParams.get('theaterId') || '';

  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [bookedSeats] = useState<string[]>(() => generateBookedSeats());
  const [currentStage] = useState(1);

  const seatLayout = generateSeats();

  const { data: movieData } = useQuery<{ success: boolean; movie: Movie }>({
    queryKey: ["/api/movies", movieId],
  });

  const { data: showtimeData } = useQuery<{ success: boolean; showtime: Showtime }>({
    queryKey: ["/api/showtimes", showtimeId],
  });

  const { data: theaterData } = useQuery<{ success: boolean; theater: Theater }>({
    queryKey: ["/api/theaters", theaterId],
  });

  const movie = movieData?.movie;
  const showtime = showtimeData?.showtime;
  const theater = theaterData?.theater;

  const handleSeatClick = (row: number, seat: string) => {
    const seatKey = `${row}${seat}`;
    
    if (bookedSeats.includes(seatKey)) {
      return;
    }

    const existingSeat = selectedSeats.find(s => s.row === row && s.seat === seat);

    if (existingSeat) {
      setSelectedSeats(selectedSeats.filter(s => !(s.row === row && s.seat === seat)));
    } else {
      const category = getSeatCategory(row);
      const price = SEAT_PRICES[category];
      setSelectedSeats([...selectedSeats, { row, seat, category, price }]);
    }
  };

  const isSeatSelected = (row: number, seat: string) => {
    return selectedSeats.some(s => s.row === row && s.seat === seat);
  };

  const isSeatBooked = (row: number, seat: string) => {
    return bookedSeats.includes(`${row}${seat}`);
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    
    const seatInfo = selectedSeats.map(s => `${s.row}${s.seat}`).join(',');
    const seatDetails = selectedSeats.map(s => ({ 
      seatId: `${s.row}${s.seat}`, 
      categoryId: s.category.toLowerCase(), 
      categoryName: s.category, 
      price: s.price 
    }));
    
    navigate(`/movie-passenger-details?movieId=${movieId}&showtimeId=${showtimeId}&theaterId=${theaterId}&seats=${seatInfo}&seatDetails=${encodeURIComponent(JSON.stringify(seatDetails))}&totalSeats=${selectedSeats.length}&totalAmount=${totalPrice}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/movies/${movieId}`)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SELECT SEATS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Choose your seats</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="fixed top-[73px] left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 py-3">
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            {['Select Show', 'Select Seats', 'Payment'].map((stage, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                    index === currentStage 
                      ? 'border-white bg-white text-black' 
                      : index < currentStage
                        ? 'border-white/40 bg-white/40 text-white'
                        : 'border-white/20 bg-transparent text-white/40'
                  }`} data-testid={`stage-${index}`}>
                    {index < currentStage ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <span className={`text-xs font-light ${
                    index === currentStage ? 'text-white' : 'text-white/40'
                  }`}>
                    {stage}
                  </span>
                </div>
                {index < 2 && (
                  <div className="flex-1 h-px bg-white/20 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed top-[138px] left-0 right-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="space-y-2">
            <h2 className="text-lg font-light tracking-wider" data-testid="text-movie-title">
              {movie?.title || 'Loading...'}
            </h2>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span data-testid="text-theater-name">{theater?.name || 'Loading...'}</span>
              <span className="text-white/30">|</span>
              <span data-testid="text-screen">{showtime?.screen || 'Screen 1'}</span>
              <span className="text-white/30">|</span>
              <span data-testid="text-showtime">{showtime?.time || '10:30 AM'}</span>
              <span className="text-white/30">|</span>
              <Badge className="bg-white/20 text-white border-0 rounded-none text-xs px-2 py-0.5" data-testid="badge-format">
                {showtime?.format || '2D'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-52 px-4 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-white/20" />
              <span className="text-white/60">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-white" />
              <span className="text-white/60">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-white/5 fill-white/5" />
              <span className="text-white/60">Booked</span>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-white/60">Premium (1-5) - {formatCurrency(SEAT_PRICES.Premium)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Armchair className="h-4 w-4 text-blue-500" />
              <span className="text-white/60">Standard (6-15) - {formatCurrency(SEAT_PRICES.Standard)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-white/60">Economy (16-20) - {formatCurrency(SEAT_PRICES.Economy)}</span>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <div className="inline-block border-b-4 border-white/20 px-16 py-2">
            <span className="text-xs text-white/60 uppercase tracking-widest" data-testid="text-screen-indicator">Screen</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto py-4">
          <div className="space-y-2">
              {seatLayout.map((rowData) => {
                const category = getSeatCategory(rowData.row);
                let categoryColor = 'text-white/40';
                if (category === 'Premium') categoryColor = 'text-yellow-500/60';
                else if (category === 'Standard') categoryColor = 'text-blue-500/60';
                else categoryColor = 'text-green-500/60';

                return (
                  <div key={rowData.row} className="flex items-center gap-2">
                    <span className={`text-xs w-8 font-light ${categoryColor}`} data-testid={`text-row-${rowData.row}`}>
                      {rowData.row}
                    </span>
                    <div className="flex gap-1 flex-1 justify-center">
                      {rowData.seats.map((seat) => {
                        const selected = isSeatSelected(rowData.row, seat);
                        const booked = isSeatBooked(rowData.row, seat);
                        return (
                          <button
                            key={seat}
                            onClick={() => handleSeatClick(rowData.row, seat)}
                            disabled={booked}
                            className={`w-8 h-8 border text-xs font-light transition-all ${
                              booked
                                ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                                : selected
                                  ? "bg-white text-black border-white"
                                  : "bg-white/20 border-white/20 text-white hover:bg-white/30"
                            }`}
                            data-testid={`seat-${rowData.row}${seat}`}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                    <span className={`text-xs w-8 font-light text-right ${categoryColor}`}>
                      {rowData.row}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Selected Seats</span>
              <span className="text-sm text-white font-light" data-testid="text-selected-count">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSeats.map((seat, index) => (
                <Badge
                  key={index}
                  className="bg-white/20 text-white border-0 rounded-none text-xs px-2 py-1"
                  data-testid={`badge-seat-${index}`}
                >
                  {seat.row}{seat.seat} ({seat.category})
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-base font-light tracking-wider">Total Amount</span>
              <span className="text-xl font-light" data-testid="text-total-price">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={handleProceedToPayment}
          disabled={selectedSeats.length === 0}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none py-6 text-sm font-medium tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-proceed-payment"
        >
          CONTINUE TO PASSENGER DETAILS
        </Button>
      </div>
    </div>
  );
}
