import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Star,
  Users,
  Fuel,
  Gauge,
  Edit,
  Search
} from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  seats: number;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  pricePerHour: number;
  available: boolean;
  features: string[];
}

// Vehicle images mapping
const VEHICLE_IMAGES: Record<string, string> = {
  'Swift': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop',
  'City': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
  'Creta': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop'
};

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Swift',
    brand: 'Maruti Suzuki',
    category: 'hatchback',
    image: VEHICLE_IMAGES['Swift'],
    rating: 4.5,
    reviews: 320,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Manual',
    pricePerDay: 1200,
    pricePerHour: 100,
    available: true,
    features: ['ABS', 'AC', 'Bluetooth']
  },
  {
    id: '2',
    name: 'City',
    brand: 'Honda',
    category: 'sedan',
    image: VEHICLE_IMAGES['City'],
    rating: 4.7,
    reviews: 450,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 2000,
    pricePerHour: 150,
    available: true,
    features: ['ABS', 'AC', 'Sunroof', 'Bluetooth']
  },
  {
    id: '3',
    name: 'Creta',
    brand: 'Hyundai',
    category: 'suv',
    image: VEHICLE_IMAGES['Creta'],
    rating: 4.8,
    reviews: 580,
    seats: 5,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    pricePerDay: 2800,
    pricePerHour: 200,
    available: true,
    features: ['ABS', 'AC', 'Sunroof', 'Bluetooth', 'Cruise Control']
  }
];

export default function RentalBrowse() {
  const [location, navigate] = useLocation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [filterFuel, setFilterFuel] = useState("all");
  const [filterTransmission, setFilterTransmission] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Parse search params
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const category = searchParams.get('category') || '';

  useEffect(() => {
    let filtered = [...MOCK_VEHICLES];

    if (category) {
      filtered = filtered.filter(v => v.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(query) || 
        v.brand.toLowerCase().includes(query)
      );
    }

    if (filterFuel !== "all") {
      filtered = filtered.filter(v => v.fuelType.toLowerCase() === filterFuel);
    }

    if (filterTransmission !== "all") {
      filtered = filtered.filter(v => v.transmission.toLowerCase() === filterTransmission);
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setVehicles(filtered);
  }, [sortBy, filterFuel, filterTransmission, category, searchQuery]);

  const pagination = usePagination({
    data: vehicles,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/rental/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">AVAILABLE CARS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{vehicles.length} cars found</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/rental/search")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-edit"
          >
            <Edit className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Box */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search cars by brand or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-11 pl-10 pr-4 rounded-none focus:border-white"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      <div className="pt-32 px-4 space-y-4 max-w-screen-lg mx-auto">
        {/* Filters & Sort */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-none">
          <div className="grid grid-cols-3 gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-transparent border-white/20 text-white h-10 text-xs" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="recommended" className="text-white">Recommended</SelectItem>
                <SelectItem value="price-low" className="text-white">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="text-white">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="text-white">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterFuel} onValueChange={setFilterFuel}>
              <SelectTrigger className="bg-transparent border-white/20 text-white h-10 text-xs" data-testid="select-fuel">
                <SelectValue placeholder="Fuel" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all" className="text-white">All Fuel</SelectItem>
                <SelectItem value="petrol" className="text-white">Petrol</SelectItem>
                <SelectItem value="diesel" className="text-white">Diesel</SelectItem>
                <SelectItem value="electric" className="text-white">Electric</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTransmission} onValueChange={setFilterTransmission}>
              <SelectTrigger className="bg-transparent border-white/20 text-white h-10 text-xs" data-testid="select-transmission">
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all" className="text-white">All</SelectItem>
                <SelectItem value="manual" className="text-white">Manual</SelectItem>
                <SelectItem value="automatic" className="text-white">Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="space-y-4">
          {pagination.paginatedData.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white/5 border border-white/10 rounded-none hover:border-white/20 transition-all overflow-hidden"
              data-testid={`vehicle-card-${vehicle.id}`}
            >
              {/* Vehicle Image */}
              <div className="relative h-48 bg-white/10 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-6xl">🚗</div>';
                  }}
                />
                <Badge className="absolute top-3 right-3 bg-black/80 text-white border-white/20 rounded-none px-3 py-1">
                  {vehicle.category}
                </Badge>
              </div>

              <div className="p-4 space-y-3">
                {/* Vehicle Name & Rating */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-light mb-1">{vehicle.brand} {vehicle.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{vehicle.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{vehicle.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-white/60" />
                    <span className="font-light">{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Fuel className="h-4 w-4 text-white/60" />
                    <span className="font-light">{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge className="h-4 w-4 text-white/60" />
                    <span className="font-light">{vehicle.transmission}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature) => (
                    <Badge 
                      key={feature} 
                      className="bg-white/5 text-white/60 border-white/10 text-xs font-light rounded-none"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Price & Book Button */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-2xl font-light">₹{vehicle.pricePerDay}</div>
                    <div className="text-xs text-white/60">per day</div>
                  </div>
                  <Button
                    onClick={() => navigate(`/booking/rental/details?vehicleId=${vehicle.id}`)}
                    className="bg-white text-black hover:bg-white/90 h-10 px-6 rounded-none font-light tracking-wider"
                    data-testid={`button-view-${vehicle.id}`}
                  >
                    VIEW DETAILS
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {vehicles.length > 0 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              className="mt-6"
            />
          )}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No vehicles found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
