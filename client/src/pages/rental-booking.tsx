import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Car,
  Bike,
  MapPin,
  Calendar,
  Star,
  Users,
  Fuel,
  Settings,
  Loader2,
  Bus,
  Clock,
  Filter,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { format } from "date-fns";

interface RentalVehicle {
  id: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  hourlyRate: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  rating: string;
  totalRatings: number;
  images: string[] | null;
  features: string[] | null;
  city: string;
  registrationNumber: string;
  insuranceValidity: string;
  isActive: number;
}

interface RentalLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  landmark: string | null;
  latitude: string | null;
  longitude: string | null;
}

export default function RentalBooking() {
  const [, navigate] = useLocation();

  const [vehicleType, setVehicleType] = useState<"" | "car" | "bike" | "scooter" | "traveller">("");
  const [selectedCity, setSelectedCity] = useState("");
  const [category, setCategory] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>();
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [rentalType, setRentalType] = useState<"hourly" | "daily" | "weekly" | "monthly">("daily");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("any");
  const [transmissionFilter, setTransmissionFilter] = useState("any");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/rental/vehicles"],
  });

  const { data: locationsData } = useQuery({
    queryKey: ["/api/rental/locations"],
  });

  const vehicles = ((vehiclesData as any)?.vehicles || []) as RentalVehicle[];
  const locations = ((locationsData as any)?.locations || []) as RentalLocation[];

  const cities = Array.from(new Set([...vehicles.map(v => v.city), ...locations.map(l => l.city)])).filter(Boolean);
  const categories = Array.from(new Set(vehicles.map(v => v.category))).filter(Boolean);

  const cityLocations = selectedCity 
    ? locations.filter(l => l.city === selectedCity)
    : locations;

  const filteredVehicles = !hasSearched ? [] : vehicles.filter(v => {
    if (vehicleType && v.vehicleType !== vehicleType) return false;
    if (selectedCity && v.city !== selectedCity) return false;
    if (category && v.category !== category) return false;
    if (fuelTypeFilter && fuelTypeFilter !== "any" && v.fuelType !== fuelTypeFilter) return false;
    if (transmissionFilter && transmissionFilter !== "any" && v.transmission !== transmissionFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesBrand = v.brand.toLowerCase().includes(search);
      const matchesModel = v.model.toLowerCase().includes(search);
      if (!matchesBrand && !matchesModel) return false;
    }
    return v.isActive === 1;
  });

  const handleSearch = () => {
    setHasSearched(true);
    const resultsSection = document.querySelector('[data-testid="vehicles-section"]');
    resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isSearchDisabled = !selectedCity || !pickupDate || !dropoffDate;

  const handleVehicleSelect = (vehicle: RentalVehicle) => {
    const params = new URLSearchParams({
      vehicleId: vehicle.id,
      pickupLocationId: pickupLocationId || "",
      dropoffLocationId: dropoffLocationId || "",
      pickupDate: pickupDate ? format(pickupDate, "yyyy-MM-dd") : "",
      pickupTime: pickupTime || "",
      dropoffDate: dropoffDate ? format(dropoffDate, "yyyy-MM-dd") : "",
      dropoffTime: dropoffTime || "",
      rentalType: rentalType || "daily",
    });
    navigate(`/rental-detail?${params.toString()}`);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="h-5 w-5" />;
      case 'bike': return <Bike className="h-5 w-5" />;
      case 'scooter': return <Bike className="h-5 w-5" />;
      case 'traveller': return <Bus className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const getRateForType = (vehicle: RentalVehicle) => {
    switch (rentalType) {
      case 'hourly': return { rate: vehicle.hourlyRate, label: '/hr' };
      case 'daily': return { rate: vehicle.dailyRate, label: '/day' };
      case 'weekly': return { rate: vehicle.weeklyRate, label: '/wk' };
      case 'monthly': return { rate: vehicle.monthlyRate, label: '/mo' };
      default: return { rate: vehicle.dailyRate, label: '/day' };
    }
  };

  if (vehiclesLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-lg font-medium text-white/80">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/pro-tools")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">RENTALS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Self Drive</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-rental-bookings")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 text-xs rounded-full"
            data-testid="button-my-bookings"
          >
            My Trips
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Top Search Bar with Filter */}
        <div className="flex items-center gap-3 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vehicles..."
              className="bg-transparent border-b border-white/20 rounded-none pl-10 text-white placeholder:text-white/40 focus:border-white h-12"
              data-testid="input-search"
            />
          </div>
          
          {/* Filter Popup */}
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border border-white/20 hover:bg-white/10 rounded-full h-12 w-12"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-white/20 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-light tracking-wider">FILTERS</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <Label className="text-white/60 text-xs uppercase tracking-widest">Fuel Type</Label>
                  <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                    <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 h-12 font-light focus:border-white transition-colors" data-testid="select-fuel-type">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/20 rounded-lg">
                      <SelectItem value="any" className="text-white hover:bg-white/10 focus:bg-white/10">Any</SelectItem>
                      <SelectItem value="Petrol" className="text-white hover:bg-white/10 focus:bg-white/10">Petrol</SelectItem>
                      <SelectItem value="Diesel" className="text-white hover:bg-white/10 focus:bg-white/10">Diesel</SelectItem>
                      <SelectItem value="Electric" className="text-white hover:bg-white/10 focus:bg-white/10">Electric</SelectItem>
                      <SelectItem value="CNG" className="text-white hover:bg-white/10 focus:bg-white/10">CNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-white/60 text-xs uppercase tracking-widest">Transmission</Label>
                  <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
                    <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 h-12 font-light focus:border-white transition-colors" data-testid="select-transmission">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/20 rounded-lg">
                      <SelectItem value="any" className="text-white hover:bg-white/10 focus:bg-white/10">Any</SelectItem>
                      <SelectItem value="Manual" className="text-white hover:bg-white/10 focus:bg-white/10">Manual</SelectItem>
                      <SelectItem value="Automatic" className="text-white hover:bg-white/10 focus:bg-white/10">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    setFuelTypeFilter("any");
                    setTransmissionFilter("any");
                  }}
                  className="w-full bg-white/10 text-white hover:bg-white/20 rounded-none h-12"
                  data-testid="button-clear-filters"
                >
                  CLEAR FILTERS
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicle Type Selector */}
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest">Vehicle Type</Label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: '', label: 'All', icon: Car },
              { value: 'car', label: 'Cars', icon: Car },
              { value: 'bike', label: 'Bikes', icon: Bike },
              { value: 'traveller', label: 'Travelers', icon: Bus }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setVehicleType(type.value as any)}
                className={`flex flex-col items-center gap-2 p-4 border-b transition-all ${
                  vehicleType === type.value
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
                data-testid={`button-type-${type.value || 'all'}`}
              >
                <type.icon className={`h-5 w-5 transition-opacity ${
                  vehicleType === type.value ? 'opacity-100' : 'opacity-40'
                }`} />
                <span className={`text-xs font-light transition-opacity ${
                  vehicleType === type.value ? 'opacity-100' : 'opacity-40'
                }`}>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rental Duration */}
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest">Duration</Label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setRentalType(type.value as any)}
                className={`p-3 border-b text-xs transition-all ${
                  rentalType === type.value
                    ? 'border-white bg-white/5 opacity-100'
                    : 'border-white/10 hover:border-white/30 opacity-40'
                }`}
                data-testid={`button-rental-${type.value}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location and Category */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-widest">City</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 h-12 font-light focus:border-white transition-colors" data-testid="select-city">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/20 rounded-lg">
                {cities.map((city: string) => (
                  <SelectItem key={city} value={city} className="text-white hover:bg-white/10 focus:bg-white/10">{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-widest">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 h-12 font-light focus:border-white transition-colors" data-testid="select-category">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/20 rounded-lg">
                {categories.map((cat: string) => (
                  <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10 focus:bg-white/10">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pickup Date & Time */}
        <div className="space-y-2">
          <Label className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Pickup
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 hover:bg-white/5 h-12 font-light justify-start text-left"
                  data-testid="input-pickup-date"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {pickupDate ? format(pickupDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/20" align="start">
                <CalendarComponent
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="bg-transparent border-b border-white/20 rounded-none text-white h-12 font-light"
              data-testid="input-pickup-time"
            />
          </div>
        </div>

        {/* Dropoff Date & Time */}
        <div className="space-y-2">
          <Label className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Dropoff
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 hover:bg-white/5 h-12 font-light justify-start text-left"
                  data-testid="input-dropoff-date"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dropoffDate ? format(dropoffDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/20" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dropoffDate}
                  onSelect={setDropoffDate}
                  disabled={(date) => date < (pickupDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="bg-transparent border-b border-white/20 rounded-none text-white h-12 font-light"
              data-testid="input-dropoff-time"
            />
          </div>
        </div>

        {/* Pickup & Dropoff Locations */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Pickup Location
            </Label>
            <Select value={pickupLocationId} onValueChange={setPickupLocationId}>
              <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 h-12 font-light focus:border-white transition-colors" data-testid="select-pickup-location">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/20 rounded-lg">
                {cityLocations.map((loc: RentalLocation) => (
                  <SelectItem key={loc.id} value={loc.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Dropoff Location
            </Label>
            <Select value={dropoffLocationId} onValueChange={setDropoffLocationId}>
              <SelectTrigger className="bg-transparent border-b border-white/20 rounded-none text-white hover:border-white/40 h-12 font-light focus:border-white transition-colors" data-testid="select-dropoff-location">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/20 rounded-lg">
                {cityLocations.map((loc: RentalLocation) => (
                  <SelectItem key={loc.id} value={loc.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vehicle Options */}
        {hasSearched && (
          <div className="space-y-4 pt-8 border-t border-white/10" data-testid="vehicles-section">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-white/60">Available Vehicles</h2>
              <Badge variant="outline" className="border-white/30 text-white/80 bg-transparent rounded-none px-3 font-light">
                {filteredVehicles.length}
              </Badge>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 border border-white/10">
                <Car className="h-16 w-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 text-sm">No vehicles available for selected criteria</p>
              </div>
            ) : (
              filteredVehicles.map((vehicle: RentalVehicle) => {
              const { rate, label } = getRateForType(vehicle);
              return (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className="cursor-pointer border-b border-white/10 pb-6 hover:border-white/30 transition-all"
                  data-testid={`card-vehicle-${vehicle.id}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] border-white/30 text-white/60 bg-transparent rounded-none px-2 py-0.5 font-light uppercase tracking-wider">
                          {vehicle.category}
                        </Badge>
                      </div>
                      <h3 className="font-light text-lg mb-1">{vehicle.brand} {vehicle.model}</h3>
                      <p className="text-xs text-white/40">
                        {vehicle.year} • {vehicle.registrationNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-3 w-3 text-white fill-white" />
                        <span className="text-sm font-light">{vehicle.rating}</span>
                      </div>
                      <p className="text-2xl font-light">₹{rate}</p>
                      <p className="text-xs text-white/40">{label}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/60">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs">{vehicle.seatingCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Fuel className="h-3.5 w-3.5" />
                      <span className="text-xs">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Settings className="h-3.5 w-3.5" />
                      <span className="text-xs">{vehicle.transmission}</span>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Search Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/20 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button 
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 h-16 rounded-none text-lg font-light tracking-widest transition-all"
            data-testid="button-search-vehicles"
          >
            <Search className="h-5 w-5 mr-2" />
            {hasSearched ? `VIEW ${filteredVehicles.length} VEHICLES` : 'SEARCH VEHICLES'}
          </Button>
        </div>
      </div>
    </div>
  );
}
