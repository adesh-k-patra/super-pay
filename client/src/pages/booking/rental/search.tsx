import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketHeader } from "@/components/ui/ticket-header";
import { useToast } from "@/hooks/use-toast";
import {
  Car,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

const CITIES = [
  { id: '1', name: 'Delhi', locations: ['Connaught Place', 'Airport', 'Nehru Place', 'Saket'] },
  { id: '2', name: 'Mumbai', locations: ['Andheri', 'Bandra', 'Airport', 'Powai'] },
  { id: '3', name: 'Bangalore', locations: ['Koramangala', 'Indiranagar', 'Airport', 'MG Road'] },
  { id: '4', name: 'Hyderabad', locations: ['Hitech City', 'Gachibowli', 'Airport', 'Banjara Hills'] },
  { id: '5', name: 'Chennai', locations: ['T Nagar', 'Anna Nagar', 'Airport', 'OMR'] }
];

const VEHICLE_CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', icon: '🚗', examples: 'Swift, i10, Alto' },
  { id: 'sedan', name: 'Sedan', icon: '🚙', examples: 'Dzire, City, Verna' },
  { id: 'suv', name: 'SUV', icon: '🚐', examples: 'Creta, Seltos, XUV' },
  { id: 'luxury', name: 'Luxury', icon: '🏎️', examples: 'BMW, Audi, Mercedes' }
];

const TIME_OPTIONS = [
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30",
  "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

export default function RentalSearch() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [selectedCity, setSelectedCity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [sameDropLocation, setSameDropLocation] = useState(true);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropDate, setDropDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState("");

  const selectedCityData = CITIES.find(c => c.id === selectedCity);

  const handleSearch = () => {
    if (!selectedCity || !pickupLocation) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select city and pickup location",
        variant: "destructive"
      });
      return;
    }

    if (!pickupDate || !pickupTime) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select pickup date and time",
        variant: "destructive"
      });
      return;
    }

    if (!dropDate || !dropTime) {
      toast({
        title: "MISSING INFORMATION",
        description: "Please select drop date and time",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams({
      city: selectedCity,
      pickupLocation,
      dropLocation: sameDropLocation ? pickupLocation : dropLocation,
      pickupDate: format(pickupDate, "yyyy-MM-dd"),
      dropDate: format(dropDate, "yyyy-MM-dd"),
      pickupTime,
      dropTime,
      ...(vehicleCategory && { category: vehicleCategory })
    });

    navigate(`/booking/rental/browse?${params.toString()}`);
  };

  return (
    <>
      <TicketHeader 
        title="RENT A CAR" 
        subtitle="Self-drive rentals"
        backPath="/home"
        ticketsPath="/all-tickets?type=rentals&status=all"
        ticketIcon={<Car className="h-5 w-5" />}
      />

      <div className="min-h-screen bg-black text-white">
        <div className="pt-24 px-4 pb-24 w-full max-w-screen-lg mx-auto space-y-8">
          
          {/* City Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              CITY
            </Label>
            <Select value={selectedCity} onValueChange={(city) => {
              setSelectedCity(city);
              setPickupLocation("");
              setDropLocation("");
            }}>
              <SelectTrigger
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white"
                data-testid="select-city"
              >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                {CITIES.map((city) => (
                  <SelectItem 
                    key={city.id} 
                    value={city.id}
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              PICKUP LOCATION
            </Label>
            <Select 
              value={pickupLocation} 
              onValueChange={setPickupLocation}
              disabled={!selectedCity}
            >
              <SelectTrigger
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white disabled:opacity-50"
                data-testid="select-pickup"
              >
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                {selectedCityData?.locations.map((location) => (
                  <SelectItem 
                    key={location} 
                    value={location}
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Same Drop Location Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSameDropLocation(!sameDropLocation)}
              className={cn(
                "h-5 w-5 rounded border-2 transition-colors flex items-center justify-center",
                sameDropLocation ? "bg-white border-white" : "border-white/40"
              )}
              data-testid="checkbox-same-location"
            >
              {sameDropLocation && (
                <svg className="h-3 w-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
            <Label className="text-sm font-light cursor-pointer" onClick={() => setSameDropLocation(!sameDropLocation)}>
              Return to same location
            </Label>
          </div>

          {/* Drop Location (if different) */}
          {!sameDropLocation && (
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                DROP LOCATION
              </Label>
              <Select 
                value={dropLocation} 
                onValueChange={setDropLocation}
                disabled={!selectedCity}
              >
                <SelectTrigger
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white disabled:opacity-50"
                  data-testid="select-drop"
                >
                  <SelectValue placeholder="Select drop location" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {selectedCityData?.locations.map((location) => (
                    <SelectItem 
                      key={location} 
                      value={location}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Pickup Date & Time */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                PICKUP DATE
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light",
                      !pickupDate && "text-white/50"
                    )}
                    data-testid="button-pickup-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "dd MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={setPickupDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Clock className="h-3 w-3" />
                PICKUP TIME
              </Label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white"
                  data-testid="select-pickup-time"
                >
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 max-h-60">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem 
                      key={time} 
                      value={time}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drop Date & Time */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                DROP DATE
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left bg-transparent border-b-2 border-white/20 rounded-none h-14 px-4 hover:bg-transparent hover:border-white font-light",
                      !dropDate && "text-white/50"
                    )}
                    data-testid="button-drop-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dropDate ? format(dropDate, "dd MMM yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={dropDate}
                    onSelect={setDropDate}
                    disabled={(date) => {
                      const minDate = pickupDate || new Date();
                      return date < minDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                <Clock className="h-3 w-3" />
                DROP TIME
              </Label>
              <Select value={dropTime} onValueChange={setDropTime}>
                <SelectTrigger
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-14 px-4 font-light focus:border-white"
                  data-testid="select-drop-time"
                >
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 max-h-60">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem 
                      key={time} 
                      value={time}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle Category (Optional) */}
          <div className="space-y-3">
            <Label className="text-xs text-white/60 uppercase tracking-widest font-light block">
              VEHICLE TYPE (OPTIONAL)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {VEHICLE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setVehicleCategory(category.id === vehicleCategory ? "" : category.id)}
                  className={cn(
                    "p-4 border transition-all rounded-none text-left",
                    vehicleCategory === category.id
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white border-white/20 hover:border-white/40"
                  )}
                  data-testid={`button-category-${category.id}`}
                >
                  <span className="text-2xl mb-2 block">{category.icon}</span>
                  <div className="text-sm font-light mb-1">{category.name}</div>
                  <div className="text-xs opacity-60">{category.examples}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Fixed Search Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 p-4">
          <div className="w-full max-w-screen-lg mx-auto">
            <Button
              onClick={handleSearch}
              className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-none font-light text-base tracking-widest"
              data-testid="button-search"
            >
              FIND CARS
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
