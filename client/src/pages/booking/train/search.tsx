import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TicketHeader } from "@/components/ui/ticket-header";
import {
  Train,
  Calendar as CalendarIcon,
  MapPin,
  ArrowRightLeft,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const indianStations = [
  { code: "NDLS", name: "New Delhi", station: "New Delhi Railway Station" },
  { code: "CSMT", name: "Mumbai", station: "Chhatrapati Shivaji Maharaj Terminus" },
  { code: "MAS", name: "Chennai", station: "Chennai Central" },
  { code: "SBC", name: "Bangalore", station: "Bangalore City Junction" },
  { code: "HWH", name: "Howrah", station: "Howrah Junction" },
  { code: "PNBE", name: "Patna", station: "Patna Junction" },
  { code: "LKO", name: "Lucknow", station: "Lucknow Charbagh" },
  { code: "JAT", name: "Jammu", station: "Jammu Tawi" },
  { code: "HYB", name: "Hyderabad", station: "Hyderabad Deccan" },
  { code: "ADI", name: "Ahmedabad", station: "Ahmedabad Junction" },
  { code: "PUNE", name: "Pune", station: "Pune Junction" },
  { code: "JP", name: "Jaipur", station: "Jaipur Junction" },
  { code: "BBS", name: "Bhubaneswar", station: "Bhubaneswar Railway Station" },
  { code: "TVC", name: "Trivandrum", station: "Thiruvananthapuram Central" },
  { code: "VSKP", name: "Visakhapatnam", station: "Visakhapatnam Junction" },
  { code: "GHY", name: "Guwahati", station: "Guwahati Railway Station" },
];

export default function TrainSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromPopover, setShowFromPopover] = useState(false);
  const [showToPopover, setShowToPopover] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["All"]);

  const trainClasses = [
    { value: "All", label: "All Classes" },
    { value: "1A", label: "1st AC (1A)" },
    { value: "2A", label: "2nd AC (2A)" },
    { value: "3A", label: "3rd AC (3A)" },
    { value: "SL", label: "Sleeper (SL)" },
    { value: "CC", label: "Chair Car (CC)" },
    { value: "2S", label: "Second Sitting (2S)" },
    { value: "3E", label: "3rd AC Economy (3E)" },
  ];

  const filteredFromStations = indianStations.filter(station =>
    station.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
    station.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
    station.station.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToStations = indianStations.filter(station =>
    station.name.toLowerCase().includes(toSearch.toLowerCase()) ||
    station.code.toLowerCase().includes(toSearch.toLowerCase()) ||
    station.station.toLowerCase().includes(toSearch.toLowerCase())
  );

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const toggleClass = (classValue: string) => {
    if (classValue === "All") {
      setSelectedClasses(["All"]);
    } else {
      const filtered = selectedClasses.filter(c => c !== "All");
      if (filtered.includes(classValue)) {
        const newClasses = filtered.filter(c => c !== classValue);
        setSelectedClasses(newClasses.length === 0 ? ["All"] : newClasses);
      } else {
        setSelectedClasses([...filtered, classValue]);
      }
    }
  };

  const handleSearch = () => {
    if (!from || !to) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select both source and destination stations",
        variant: "destructive"
      });
      return;
    }

    if (!departureDate) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select a journey date",
        variant: "destructive"
      });
      return;
    }

    const classesParam = selectedClasses.includes("All") ? "All" : selectedClasses.join(",");
    
    const params = new URLSearchParams({
      from,
      to,
      departureDate: format(departureDate, "yyyy-MM-dd"),
      classes: classesParam
    });

    navigate(`/booking/train/results?${params.toString()}`);
  };

  const selectedFrom = indianStations.find(s => s.code === from);
  const selectedTo = indianStations.find(s => s.code === to);

  return (
    <>
      <TicketHeader 
        title="BOOK TRAINS" 
        subtitle="Search & book your journey"
        backPath="/home"
        ticketsPath="/all-tickets?type=trains&status=all"
        ticketIcon={<Train className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-24 px-4 pb-32 w-full max-w-screen-lg mx-auto space-y-8">
          {/* From & To */}
          <div className="space-y-6">
            {/* From */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                FROM STATION
              </Label>
              <Popover open={showFromPopover} onOpenChange={setShowFromPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                      !from && "text-white/50"
                    )}
                    data-testid="button-from"
                  >
                    {selectedFrom ? (
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-light">{selectedFrom.code}</span>
                          <span className="text-xs text-white/60">{selectedFrom.name}</span>
                        </div>
                        <span className="text-xs text-white/40 font-light truncate w-full">{selectedFrom.station}</span>
                      </div>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="font-light">Select source station</span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                  <Input
                    placeholder="Search stations..."
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                    className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                    data-testid="input-from-search"
                  />
                  <div className="max-h-64 overflow-y-auto">
                    {filteredFromStations.map((station) => (
                      <button
                        key={station.code}
                        onClick={() => {
                          setFrom(station.code);
                          setFromSearch("");
                          setShowFromPopover(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                        data-testid={`option-from-${station.code}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-light text-white">{station.name}</div>
                            <div className="text-xs text-white/60 font-light">{station.station}</div>
                          </div>
                          <div className="text-lg font-light text-white/80">{station.code}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={swapLocations}
                className="bg-white/10 text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
                data-testid="button-swap"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                TO STATION
              </Label>
              <Popover open={showToPopover} onOpenChange={setShowToPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-auto min-h-[64px] py-3 px-4 hover:bg-transparent hover:border-white",
                      !to && "text-white/50"
                    )}
                    data-testid="button-to"
                  >
                    {selectedTo ? (
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-light">{selectedTo.code}</span>
                          <span className="text-xs text-white/60">{selectedTo.name}</span>
                        </div>
                        <span className="text-xs text-white/40 font-light truncate w-full">{selectedTo.station}</span>
                      </div>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="font-light">Select destination station</span>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] bg-black border-white/20 p-0" align="start">
                  <Input
                    placeholder="Search stations..."
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                    className="border-0 border-b border-white/20 rounded-none bg-transparent text-white px-4 py-3 h-auto"
                    data-testid="input-to-search"
                  />
                  <div className="max-h-64 overflow-y-auto">
                    {filteredToStations.map((station) => (
                      <button
                        key={station.code}
                        onClick={() => {
                          setTo(station.code);
                          setToSearch("");
                          setShowToPopover(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10"
                        data-testid={`option-to-${station.code}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-light text-white">{station.name}</div>
                            <div className="text-xs text-white/60 font-light">{station.station}</div>
                          </div>
                          <div className="text-lg font-light text-white/80">{station.code}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Journey Date */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" />
              JOURNEY DATE
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light",
                    !departureDate && "text-white/50"
                  )}
                  data-testid="button-departure-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "EEE, dd MMM yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Class Selection */}
          <div className="space-y-3">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <Train className="h-3 w-3" />
              TRAVEL CLASS
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {trainClasses.map((trainClass) => {
                const isSelected = selectedClasses.includes(trainClass.value);
                return (
                  <button
                    key={trainClass.value}
                    onClick={() => toggleClass(trainClass.value)}
                    className={cn(
                      "py-3 px-4 border transition-all text-xs tracking-wider font-light rounded-none",
                      isSelected
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                    )}
                    data-testid={`button-class-${trainClass.value}`}
                  >
                    {trainClass.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fixed Search Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
          <div className="w-full max-w-screen-lg mx-auto">
            <Button
              onClick={handleSearch}
              className="w-full bg-white text-black hover:bg-white/90 h-14 text-base tracking-wider font-light rounded-none"
              data-testid="button-search"
            >
              SEARCH TRAINS
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
