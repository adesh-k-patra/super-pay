import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Bus,
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Calendar as CalendarIcon,
  Info
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import SeatSelectionDialog from "@/components/seat-selection-dialog";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface BusOption {
  id: string;
  operator: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  rating: number;
  amenities: string[];
}

const mockBuses: BusOption[] = [
  {
    id: "1",
    operator: "Volvo Travels",
    type: "AC Sleeper",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h 0m",
    price: 1200,
    seatsAvailable: 15,
    rating: 4.5,
    amenities: ["wifi", "charging", "blanket"]
  },
  {
    id: "2",
    operator: "Red Bus Express",
    type: "AC Seater",
    departureTime: "23:30",
    arrivalTime: "07:30",
    duration: "8h 0m",
    price: 900,
    seatsAvailable: 20,
    rating: 4.2,
    amenities: ["wifi", "charging"]
  },
  {
    id: "3",
    operator: "VRL Travels",
    type: "AC Sleeper",
    departureTime: "21:00",
    arrivalTime: "05:00",
    duration: "8h 0m",
    price: 1100,
    seatsAvailable: 10,
    rating: 4.3,
    amenities: ["wifi", "charging", "blanket", "water"]
  },
];

export default function BusResults() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  
  const from = params.get("from") || "DEL";
  const to = params.get("to") || "MUM";
  const initialDate = params.get("departureDate") || format(new Date(), "yyyy-MM-dd");
  const passengers = parseInt(params.get("passengers") || "1");

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showBusDetails, setShowBusDetails] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  // Generate date tabs (2 days before, today, 3 days after)
  const generateDateTabs = () => {
    const baseDate = new Date(initialDate);
    const dates = [];
    for (let i = -2; i <= 3; i++) {
      const date = addDays(baseDate, i);
      dates.push({
        date: format(date, "yyyy-MM-dd"),
        day: format(date, "EEE"),
        dayNum: format(date, "dd"),
        month: format(date, "MMM")
      });
    }
    return dates;
  };

  const dateTabs = generateDateTabs();

  const pagination = usePagination({
    data: mockBuses,
    itemsPerPage: 10,
  });

  const handleSelectSeats = (busId: string) => {
    navigate(`/booking/bus/${selectedDate}/${busId}`);
  };

  const handleShowBusDetails = (busId: string) => {
    setSelectedBus(busId);
    setShowBusDetails(true);
  };

  const selectedBusDetails = mockBuses.find(b => b.id === selectedBus);

  const handleSeatSelectionContinue = (seats: string[], totalPrice: number) => {
    navigate(`/booking/bus/${selectedDate}/${selectedBus}`);
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
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/bus/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">AVAILABLE BUSES</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {from} → {to}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-4 w-full max-w-screen-lg mx-auto">
        {/* Journey Info */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-white/60" />
              <span className="text-white/80">{from} → {to}</span>
            </div>
            <div className="text-white/60">{new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Date Selection Tab Bar */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {dateTabs.map((dateTab) => (
              <button
                key={dateTab.date}
                onClick={() => setSelectedDate(dateTab.date)}
                className={cn(
                  "flex-shrink-0 px-4 py-3 border transition-all rounded-none min-w-[80px]",
                  selectedDate === dateTab.date
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                )}
                data-testid={`button-date-${dateTab.date}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-light">{dateTab.day}</span>
                  <span className="text-xl font-light">{dateTab.dayNum}</span>
                  <span className="text-[10px] uppercase tracking-wider font-light">{dateTab.month}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bus List */}
        {pagination.paginatedData.map((bus) => (
          <div
            key={bus.id}
            onClick={() => handleShowBusDetails(bus.id)}
            className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 hover:border-white/40 transition-all cursor-pointer"
            data-testid={`bus-card-${bus.id}`}
          >
            <div className="space-y-4">
              {/* Operator Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-light text-white tracking-wider">{bus.operator}</h3>
                  <p className="text-xs text-white/60 font-light">{bus.type}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white/60">{bus.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{formatCurrency(bus.price)}</p>
                  <p className="text-xs text-white/60 font-light">per seat</p>
                </div>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xl font-light text-white">{bus.departureTime}</p>
                  <p className="text-xs text-white/60">{from}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <Clock className="h-4 w-4 text-white/40" />
                  <p className="text-xs text-white/60 mt-1">{bus.duration}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xl font-light text-white">{bus.arrivalTime}</p>
                  <p className="text-xs text-white/60">{to}</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-3">
                {bus.amenities.includes("wifi") && (
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none text-xs font-light">
                    <Wifi className="h-3 w-3 mr-1" />
                    WiFi
                  </Badge>
                )}
                {bus.amenities.includes("charging") && (
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none text-xs font-light">
                    Charging
                  </Badge>
                )}
                {bus.amenities.includes("blanket") && (
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none text-xs font-light">
                    Blanket
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Users className="h-4 w-4" />
                  <span>{bus.seatsAvailable} seats available</span>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSeats(bus.id);
                  }}
                  className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                  data-testid={`button-select-seats-${bus.id}`}
                >
                  SELECT SEATS
                </Button>
              </div>
            </div>
          </div>
        ))}

        {mockBuses.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6 mb-6"
          />
        )}
      </div>

      {/* Bus Details Dialog */}
      <Dialog open={showBusDetails} onOpenChange={setShowBusDetails}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wider">Bus Details</DialogTitle>
            <DialogDescription className="text-white/60">
              Complete information about the selected bus
            </DialogDescription>
          </DialogHeader>
          {selectedBusDetails && (
            <div className="space-y-6">
              {/* Operator Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-light text-white tracking-wider">{selectedBusDetails.operator}</div>
                    <p className="text-sm text-white/60 font-light">{selectedBusDetails.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white/60">{selectedBusDetails.rating} Rating</span>
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="text-xs text-white/60 uppercase tracking-widest font-light">Journey Details</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50">Departure</p>
                    <p className="text-lg font-light text-white">{selectedBusDetails.departureTime}</p>
                    <p className="text-xs text-white/60">{from}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Arrival</p>
                    <p className="text-lg font-light text-white">{selectedBusDetails.arrivalTime}</p>
                    <p className="text-xs text-white/60">{to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {selectedBusDetails.duration}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="text-xs text-white/60 uppercase tracking-widest font-light">Pricing</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Price per seat</span>
                  <span className="text-2xl font-light text-white">{formatCurrency(selectedBusDetails.price)}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="text-xs text-white/60 uppercase tracking-widest font-light">Amenities</div>
                <div className="flex flex-wrap gap-2">
                  {selectedBusDetails.amenities.includes("wifi") && (
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none">
                      <Wifi className="h-3 w-3 mr-1" />
                      WiFi
                    </Badge>
                  )}
                  {selectedBusDetails.amenities.includes("charging") && (
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none">
                      Charging Points
                    </Badge>
                  )}
                  {selectedBusDetails.amenities.includes("blanket") && (
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none">
                      Blanket
                    </Badge>
                  )}
                  {selectedBusDetails.amenities.includes("water") && (
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none">
                      Water Bottle
                    </Badge>
                  )}
                </div>
              </div>

              {/* Seats Available */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Users className="h-4 w-4" />
                  <span>{selectedBusDetails.seatsAvailable} seats available</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => {
                  setShowBusDetails(false);
                  handleSelectSeats(selectedBusDetails.id);
                }}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                data-testid="button-select-seats-dialog"
              >
                SELECT SEATS
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Seat Selection Dialog */}
      <SeatSelectionDialog
        open={showSeatSelection}
        onOpenChange={setShowSeatSelection}
        totalPassengers={passengers}
        onContinue={handleSeatSelectionContinue}
        serviceType="bus"
      />
    </div>
  );
}
