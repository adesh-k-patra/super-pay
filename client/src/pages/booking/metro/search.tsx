import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Train,
  MapPin,
  Calendar as CalendarIcon,
  ArrowRight,
  Search,
  TrendingUp,
  Navigation
} from "lucide-react";
import { format } from "date-fns";
import { TicketHeader } from "@/components/ui/ticket-header";

export default function MetroSearch() {
  const [, navigate] = useLocation();
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<"single" | "return">("single");

  const handleSearch = () => {
    const params = new URLSearchParams({
      from: fromStation,
      to: toStation,
      date: format(date, "yyyy-MM-dd"),
      passengers: passengers.toString(),
      tripType
    });
    navigate(`/booking/metro/results?${params.toString()}`);
  };

  const featuredRoutes = [
    { from: "Rajiv Chowk", to: "Huda City Center", line: "Yellow Line", fare: "₹50" },
    { from: "Kashmere Gate", to: "HUDA City Centre", line: "Yellow Line", fare: "₹55" },
    { from: "Dwarka Sector 21", to: "Vaishali", line: "Blue Line", fare: "₹60" },
    { from: "Botanical Garden", to: "Noida City Centre", line: "Magenta Line", fare: "₹45" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

      <TicketHeader 
        title="METRO BOOKING" 
        subtitle="Quick transit"
        backPath="/pro-tools"
        ticketsPath="/all-tickets?type=metro&status=all"
        ticketIcon={<Navigation className="h-5 w-5" />}
      />

      {/* Main Content */}
      <div className="pt-24 px-4 pb-24 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Search Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Trip Type Tabs */}
              <Tabs value={tripType} onValueChange={(v) => setTripType(v as "single" | "return")} className="w-full">
                <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-2 gap-0">
                  <TabsTrigger 
                    value="single" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="button-single-trip"
                  >
                    Single Journey
                  </TabsTrigger>
                  <TabsTrigger 
                    value="return" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="button-return-trip"
                  >
                    Return Journey
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* From Station */}
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">From Station</Label>
                <Select value={fromStation} onValueChange={setFromStation}>
                  <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white h-12" data-testid="select-from-station">
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/20">
                    <SelectItem value="Rajiv Chowk" className="text-white">Rajiv Chowk</SelectItem>
                    <SelectItem value="Kashmere Gate" className="text-white">Kashmere Gate</SelectItem>
                    <SelectItem value="Dwarka Sector 21" className="text-white">Dwarka Sector 21</SelectItem>
                    <SelectItem value="Botanical Garden" className="text-white">Botanical Garden</SelectItem>
                    <SelectItem value="Huda City Center" className="text-white">Huda City Center</SelectItem>
                    <SelectItem value="Vaishali" className="text-white">Vaishali</SelectItem>
                    <SelectItem value="Noida City Centre" className="text-white">Noida City Centre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* To Station */}
              <div>
                <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">To Station</Label>
                <Select value={toStation} onValueChange={setToStation}>
                  <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white h-12" data-testid="select-to-station">
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/20">
                    <SelectItem value="Rajiv Chowk" className="text-white">Rajiv Chowk</SelectItem>
                    <SelectItem value="Kashmere Gate" className="text-white">Kashmere Gate</SelectItem>
                    <SelectItem value="Dwarka Sector 21" className="text-white">Dwarka Sector 21</SelectItem>
                    <SelectItem value="Botanical Garden" className="text-white">Botanical Garden</SelectItem>
                    <SelectItem value="Huda City Center" className="text-white">Huda City Center</SelectItem>
                    <SelectItem value="Vaishali" className="text-white">Vaishali</SelectItem>
                    <SelectItem value="Noida City Centre" className="text-white">Noida City Centre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Passengers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Travel Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        className="w-full bg-transparent border-b border-white/20 rounded-none text-white h-12 flex items-center justify-start cursor-pointer hover:border-white/40 transition-colors"
                        data-testid="button-date-picker"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.currentTarget.click();
                          }
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/20">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Passengers</Label>
                  <Select value={passengers.toString()} onValueChange={(v) => setPassengers(parseInt(v))}>
                    <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white h-12" data-testid="select-passengers">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/20">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()} className="text-white">
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!fromStation || !toStation}
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none text-sm uppercase tracking-wider disabled:opacity-30"
                data-testid="button-search-metro"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Metro
              </Button>
            </div>
          </div>

          {/* Featured Routes - Cardless Border Design */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white" />
              <h3 className="text-sm font-light tracking-wider text-white uppercase">Popular Routes</h3>
            </div>
            <div className="space-y-3">
              {featuredRoutes.map((route, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFromStation(route.from);
                    setToStation(route.to);
                  }}
                  className="w-full p-4 border-b-2 border-white/20 hover:border-white transition-all text-left group"
                  data-testid={`featured-route-${idx}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 border border-white/20 p-2 group-hover:bg-white/10 transition-all">
                        <Train className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-light">{route.from} → {route.to}</p>
                        <p className="text-xs text-white/60">{route.line}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-white/80 font-light">{route.fare}</p>
                      <ArrowRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
