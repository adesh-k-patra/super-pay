import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Theater,
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  Star,
  Users,
  ArrowRight
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function EventResults() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  
  const query = params.get("query") || "";
  const initialDate = params.get("date") || format(new Date(), "yyyy-MM-dd");

  const [selectedDate, setSelectedDate] = useState(initialDate);

  const mockEvents = [
    { id: "1", name: "Rock Music Festival 2025", category: "Music", venue: "Phoenix Marketcity", date: selectedDate, time: "7:00 PM", duration: "4 hours", price: 1500, rating: 4.8, attendees: 5000 },
    { id: "2", name: "Stand-Up Comedy Night", category: "Comedy", venue: "Blue Frog", date: selectedDate, time: "8:00 PM", duration: "2 hours", price: 800, rating: 4.6, attendees: 300 },
    { id: "3", name: "Tech Conference 2025", category: "Conference", venue: "NSCI Dome", date: selectedDate, time: "9:00 AM", duration: "8 hours", price: 2500, rating: 4.9, attendees: 2000 }
  ];

  const generateDateTabs = () => {
    const baseDate = new Date(initialDate);
    const dates = [];
    for (let i = 0; i <= 6; i++) {
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
    data: mockEvents,
    itemsPerPage: 10,
  });

  const handleSelectEvent = (eventId: string) => {
    navigate(`/booking/event/${selectedDate}/${eventId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/event/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">AVAILABLE EVENTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{query || "All Events"}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-4 w-full max-w-screen-lg mx-auto">
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

        {pagination.paginatedData.map((event) => (
          <div
            key={event.id}
            onClick={() => handleSelectEvent(event.id)}
            className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 hover:border-white/40 transition-all cursor-pointer"
            data-testid={`event-card-${event.id}`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-light text-white tracking-wider">{event.name}</h3>
                  <p className="text-xs text-white/60 font-light">{event.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white/60">{event.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">{formatCurrency(event.price)}</p>
                  <p className="text-xs text-white/60 font-light">per ticket</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="h-4 w-4" />
                  <span>{event.time} • {event.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Badge variant="outline" className="bg-white/5 border-white/20 text-white/60 rounded-none text-xs font-light">
                  <Theater className="h-3 w-3 mr-1" />
                  {event.category}
                </Badge>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectEvent(event.id);
                  }}
                  className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                  data-testid={`button-book-${event.id}`}
                >
                  BOOK NOW
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {mockEvents.length > 0 && (
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
    </div>
  );
}
