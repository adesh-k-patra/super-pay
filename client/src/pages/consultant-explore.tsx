import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  ArrowLeft,
  Star,
  MapPin,
  Shield,
  CheckCircle2,
  Video,
  Home,
  Stethoscope,
  Scissors,
  Car,
  ChefHat,
  Wrench,
  Dumbbell,
  BookOpen,
  PartyPopper,
  Monitor,
  SlidersHorizontal,
  Ticket,
  Info,
  TrendingUp,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConsultantCategory, ConsultantProvider } from "@shared/schema";
import doctorImage from "@assets/stock_images/professional_medical_189fe339.jpg";
import businessImage from "@assets/stock_images/professional_busines_5064da4b.jpg";
import serviceImage from "@assets/stock_images/professional_service_fc34e515.jpg";

const categoryIcons: Record<string, any> = {
  "Stethoscope": Stethoscope,
  "Scissors": Scissors,
  "Car": Car,
  "ChefHat": ChefHat,
  "Wrench": Wrench,
  "Dumbbell": Dumbbell,
  "BookOpen": BookOpen,
  "PartyPopper": PartyPopper,
  "Monitor": Monitor,
};

// Category emoji mapping for colorful icons
const categoryEmojis: Record<string, string> = {
  "cat-1": "🏥", // Medical
  "cat-2": "💪", // Health & Wellness
  "cat-3": "💅", // Personal Care & Beauty
  "cat-4": "🏠", // Home, Repair & Electronics
  "cat-5": "🚗", // Automotive & Mobility
  "cat-6": "💼", // Professional & Business Services
  "cat-7": "🍽️", // Food & Hospitality
  "cat-8": "📚", // Education & Training
  "cat-9": "🎉", // Entertainment & Events
};

const placeholderImages = [doctorImage, businessImage, serviceImage];

// Map tab names from URL to category IDs
const tabToCategoryMap: Record<string, string> = {
  "all": "all",
  "medical": "cat-1",
  "health-wellness": "cat-2",
  "personal-care": "cat-3",
  "home-repair": "cat-4",
  "automotive": "cat-5",
  "professional": "cat-6",
  "food-hospitality": "cat-7",
  "education": "cat-8",
  "entertainment": "cat-9",
};

export default function ConsultantExplore() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "bookings">("rating");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minBookings, setMinBookings] = useState<number>(0);

  // Read tab from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && tabToCategoryMap[tabParam]) {
      setSelectedCategory(tabToCategoryMap[tabParam]);
    }
  }, []);

  const { data: categories = [], isLoading: loadingCategories } = useQuery<ConsultantCategory[]>({
    queryKey: ["/api/consultant/categories"],
  });

  const { data: allProviders = [], isLoading: loadingProviders } = useQuery<ConsultantProvider[]>({
    queryKey: ["/api/consultant/providers"],
  });

  const { data: bookings = [] } = useQuery<any[]>({
    queryKey: ["/api/consultant/bookings"],
  });

  // Get unique locations from providers
  const locations = Array.from(new Set(allProviders.map(p => p.city).filter(Boolean)));

  // Get selected category data
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const subcategories = (selectedCategoryData?.subcategories as string[]) || [];

  const filteredProviders = allProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || provider.categoryId === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || provider.subcategory === selectedSubcategory;
    const matchesLocation = selectedLocation === "all" || provider.city === selectedLocation;
    const matchesRating = selectedRating === "all" || 
      (selectedRating === "4+" && parseFloat(provider.rating || "0") >= 4) ||
      (selectedRating === "3+" && parseFloat(provider.rating || "0") >= 3);
    const matchesBookings = (provider.totalBookings || 0) >= minBookings;
    const providerPrice = parseFloat(provider.startingPrice || "0");
    const matchesPrice = providerPrice >= priceRange[0] && providerPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesSubcategory && matchesLocation && matchesRating && matchesBookings && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "rating") {
      return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
    } else if (sortBy === "experience") {
      return (b.experience || 0) - (a.experience || 0);
    } else {
      return (b.totalBookings || 0) - (a.totalBookings || 0);
    }
  });

  // Get trending providers (top rated with most bookings)
  const trendingProviders = [...allProviders]
    .sort((a, b) => {
      const scoreA = parseFloat(a.rating || "0") * (a.totalBookings || 0);
      const scoreB = parseFloat(b.rating || "0") * (b.totalBookings || 0);
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const handleProviderClick = (providerId: string) => {
    navigate(`/consultant/detail/${providerId}`);
  };

  if (loadingCategories) {
    return (
      <>
        <div className="min-h-screen bg-black pb-24">
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between py-4 px-4">
              <button
                onClick={() => navigate("/pro-tools")}
                className="text-white hover:text-white/80"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1} />
              </button>
              <div className="text-center">
                <h1 className="text-base font-bold tracking-wider">BOOKSURE</h1>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Expert Services</p>
              </div>
              <div className="w-5" />
            </div>
          </div>
          <div className="pt-20 flex items-center justify-center h-96">
            <div className="text-white/60">Loading...</div>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <button
              onClick={() => navigate("/pro-tools")}
              className="text-white hover:text-white/80"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-base font-bold tracking-wider">BOOKSURE</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Expert Services</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/consultant/info")}
                className="text-white hover:text-white/80"
                data-testid="button-info"
              >
                <Info className="h-5 w-5" strokeWidth={1} />
              </button>

              <button 
                onClick={() => navigate("/consultant/history")}
                className="text-white hover:text-white/80 relative"
                data-testid="button-bookings"
              >
                <Ticket className="h-5 w-5" strokeWidth={1} />
                {bookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Search and Filters */}
        <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 pb-4">
          <div className="pt-4 px-4">
            {/* Location Selector */}
            <div className="mb-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full bg-white/5 border-white/20 text-white rounded-none h-11" data-testid="select-location">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-white/40" />
                    <SelectValue placeholder="SELECT LOCATION" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20 rounded-none">
                  <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">
                    ALL LOCATIONS
                  </SelectItem>
                  {locations.map((location) => (
                    <SelectItem 
                      key={location} 
                      value={location || ""}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      {(location || "").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar with Filter */}
            <div className="relative mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search consultants, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
                  data-testid="input-search"
                />
              </div>
              
              {/* Filter Sheet */}
              <Sheet open={showFilterMenu} onOpenChange={setShowFilterMenu}>
                <SheetTrigger asChild>
                  <button
                    className={cn(
                      "shrink-0 px-4 h-12 transition-colors border flex items-center gap-2",
                      showFilterMenu
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white border-white/20 hover:border-white/40"
                    )}
                    data-testid="button-filter-menu"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full bg-black border-white/20 p-0 rounded-t-lg">
                  <SheetHeader className="border-b border-white/10 px-4 py-4">
                    <SheetTitle className="text-white uppercase tracking-wider text-left">FILTERS</SheetTitle>
                  </SheetHeader>
                  
                  <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Category Filter */}
                    <div>
                      <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Category</label>
                      <Select value={selectedCategory} onValueChange={(value) => {
                        setSelectedCategory(value);
                        setSelectedSubcategory("all");
                      }}>
                        <SelectTrigger className="w-full bg-black border-white/20 text-white" data-testid="select-category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="all" className="text-white hover:bg-white/10">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id}
                              className="text-white hover:bg-white/10"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subcategory Filter */}
                    {selectedCategory !== "all" && subcategories.length > 0 && (
                      <div>
                        <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Subcategory</label>
                        <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                          <SelectTrigger className="w-full bg-black border-white/20 text-white" data-testid="select-subcategory">
                            <SelectValue placeholder="Select Subcategory" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-white/20">
                            <SelectItem value="all" className="text-white hover:bg-white/10">All Subcategories</SelectItem>
                            {subcategories.map((subcat, idx) => (
                              <SelectItem 
                                key={idx} 
                                value={subcat}
                                className="text-white hover:bg-white/10"
                              >
                                {subcat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Sort By */}
                    <div>
                      <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Sort By</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortBy("rating")}
                          className={cn(
                            "flex-1 px-3 py-2 text-xs uppercase tracking-wider transition-colors border",
                            sortBy === "rating"
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                          )}
                          data-testid="button-sort-rating"
                        >
                          Rating
                        </button>
                        <button
                          onClick={() => setSortBy("experience")}
                          className={cn(
                            "flex-1 px-3 py-2 text-xs uppercase tracking-wider transition-colors border",
                            sortBy === "experience"
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                          )}
                          data-testid="button-sort-experience"
                        >
                          Experience
                        </button>
                        <button
                          onClick={() => setSortBy("bookings")}
                          className={cn(
                            "flex-1 px-3 py-2 text-xs uppercase tracking-wider transition-colors border",
                            sortBy === "bookings"
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                          )}
                          data-testid="button-sort-bookings"
                        >
                          Bookings
                        </button>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Minimum Rating</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRating("all")}
                          className={cn(
                            "flex-1 px-3 py-2 text-xs uppercase tracking-wider transition-colors border",
                            selectedRating === "all"
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                          )}
                          data-testid="button-rating-all"
                        >
                          All
                        </button>
                        <button
                          onClick={() => setSelectedRating("3+")}
                          className={cn(
                            "flex-1 px-3 py-2 text-xs uppercase tracking-wider transition-colors border",
                            selectedRating === "3+"
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                          )}
                          data-testid="button-rating-3"
                        >
                          3+ ⭐
                        </button>
                        <button
                          onClick={() => setSelectedRating("4+")}
                          className={cn(
                            "flex-1 px-3 py-2 text-xs uppercase tracking-wider transition-colors border",
                            selectedRating === "4+"
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                          )}
                          data-testid="button-rating-4"
                        >
                          4+ ⭐
                        </button>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-white/60 text-xs uppercase tracking-widest mb-3 block">
                        Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                      </label>
                      <Slider
                        min={0}
                        max={5000}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="w-full"
                        data-testid="slider-price-range"
                      />
                      <div className="flex justify-between mt-2 text-white/40 text-xs">
                        <span>₹0</span>
                        <span>₹5000</span>
                      </div>
                    </div>

                    {/* Min Bookings Filter */}
                    <div>
                      <label className="text-white/60 text-xs uppercase tracking-widest mb-3 block">
                        Minimum Bookings: {minBookings}
                      </label>
                      <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={[minBookings]}
                        onValueChange={(value) => setMinBookings(value[0])}
                        className="w-full"
                        data-testid="slider-min-bookings"
                      />
                      <div className="flex justify-between mt-2 text-white/40 text-xs">
                        <span>0</span>
                        <span>500+</span>
                      </div>
                    </div>

                    {/* Reset Filters */}
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubcategory("all");
                        setSortBy("rating");
                        setSelectedRating("all");
                        setPriceRange([0, 5000]);
                        setMinBookings(0);
                        setSelectedLocation("all");
                      }}
                      className="w-full px-4 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors uppercase tracking-wider text-xs"
                      data-testid="button-reset-filters"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Main Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedSubcategory("all");
            }} className="w-full mb-3">
              <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none p-0 h-auto overflow-x-auto overflow-y-hidden flex-nowrap justify-start gap-1 scrollbar-hide">
                <TabsTrigger
                  value="all"
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                  data-testid="tab-all"
                >
                  <span className="text-lg">🌐</span>
                  <span>All</span>
                </TabsTrigger>
                {categories.map((category) => {
                  const emoji = categoryEmojis[category.id] || "📋";
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                      data-testid={`tab-${category.id}`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span>{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* Subcategory Tabs - Only show when a main category is selected */}
            {selectedCategory !== "all" && subcategories.length > 0 && (
              <div className="overflow-x-auto scrollbar-hide border-b border-white/10">
                <div className="flex gap-0">
                  <button
                    onClick={() => setSelectedSubcategory("all")}
                    className={cn(
                      "shrink-0 px-4 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors",
                      selectedSubcategory === "all"
                        ? "border-white text-white"
                        : "border-transparent text-white/60"
                    )}
                    data-testid="subcategory-all"
                  >
                    All
                  </button>
                  {subcategories.map((subcat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSubcategory(subcat)}
                      className={cn(
                        "shrink-0 px-4 py-3 text-xs uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap",
                        selectedSubcategory === subcat
                          ? "border-white text-white"
                          : "border-transparent text-white/60"
                      )}
                      data-testid={`subcategory-${idx}`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-6 space-y-6">
          {/* Trending Section */}
          {selectedCategory === "all" && trendingProviders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-5 w-5 text-orange-500" strokeWidth={1} />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Trending Now</h2>
              </div>
              
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 pb-2">
                  {trendingProviders.map((provider, index) => {
                    const imageIndex = index % placeholderImages.length;
                    return (
                      <div
                        key={provider.id}
                        onClick={() => handleProviderClick(provider.id)}
                        className="shrink-0 w-40 border border-white/10 bg-white/5 hover:border-white/20 cursor-pointer transition-all"
                        data-testid={`trending-provider-${provider.id}`}
                      >
                        <div className="w-full h-40 overflow-hidden bg-white/5">
                          <img
                            src={provider.profileImage || placeholderImages[imageIndex]}
                            alt={provider.name}
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="h-3 w-3 text-orange-500" strokeWidth={1} />
                            <span className="text-orange-500 text-[10px] uppercase tracking-widest">Trending</span>
                          </div>
                          <h3 className="font-light text-white text-sm tracking-wide mb-1 truncate">
                            {provider.name}
                          </h3>
                          {provider.designation && (
                            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-2 truncate">
                              {provider.designation}
                            </p>
                          )}
                          {provider.rating && parseFloat(provider.rating) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-white fill-white" strokeWidth={1} />
                              <span className="text-white text-xs font-light">
                                {parseFloat(provider.rating).toFixed(1)}
                              </span>
                              <span className="text-white/40 text-xs">
                                ({provider.totalBookings})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* All Consultants Section */}
          <div className="space-y-3">
            {selectedCategory === "all" && (
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
                All Consultants
              </h2>
            )}
            
            {loadingProviders ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white/60">Loading consultants...</div>
              </div>
            ) : filteredProviders.length > 0 ? (
              filteredProviders.map((provider, index) => {
                const imageIndex = index % placeholderImages.length;
                return (
                  <div
                    key={provider.id}
                    data-testid={`card-provider-${provider.id}`}
                    onClick={() => handleProviderClick(provider.id)}
                    className="border border-white/10 bg-white/5 hover:border-white/20 cursor-pointer transition-all"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Provider Image */}
                      <div className="w-24 h-24 shrink-0 overflow-hidden bg-white/5">
                        <img
                          src={provider.profileImage || placeholderImages[imageIndex]}
                          alt={provider.name}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>

                      {/* Provider Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-light text-white text-base tracking-wide mb-1 flex items-center gap-2">
                              {provider.name}
                              {provider.verified === 1 && (
                                <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0" strokeWidth={1} />
                              )}
                            </h3>
                            {provider.designation && (
                              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">{provider.designation}</p>
                            )}
                          </div>
                          
                          {provider.rating && parseFloat(provider.rating) > 0 && (
                            <div className="flex items-center gap-1 border border-white/10 bg-white/5 px-2 py-1 flex-shrink-0">
                              <Star className="h-3 w-3 text-white fill-white" strokeWidth={1} />
                              <span className="text-white text-sm font-light">
                                {parseFloat(provider.rating).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
                          {provider.experience && provider.experience > 0 && (
                            <span className="uppercase tracking-widest">{provider.experience}+ YRS</span>
                          )}
                          {provider.totalBookings && provider.totalBookings > 0 && (
                            <span className="uppercase tracking-widest">{provider.totalBookings} BOOKINGS</span>
                          )}
                        </div>

                        {/* Location */}
                        {provider.city && (
                          <div className="flex items-center gap-1 text-white/60 text-xs mb-2">
                            <MapPin className="h-3 w-3" strokeWidth={1} />
                            <span className="uppercase tracking-widest">{provider.city}</span>
                          </div>
                        )}

                        {/* Availability Badges */}
                        <div className="flex gap-2 flex-wrap">
                          {provider.virtualAvailable === 1 && (
                            <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1">
                              <Video className="h-3 w-3" strokeWidth={1} />
                              Virtual
                            </span>
                          )}
                          {provider.inPersonAvailable === 1 && (
                            <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest flex items-center gap-1">
                              <Home className="h-3 w-3" strokeWidth={1} />
                              In-Person
                            </span>
                          )}
                          {provider.isOnline === 1 && (
                            <span className="bg-green-500/20 text-green-300 text-[10px] px-2 py-1 uppercase tracking-widest">
                              Online Now
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Footer */}
                    <div className="border-t border-white/10 px-4 py-3 bg-white/[0.02] flex items-center justify-between">
                      <p className="text-white/60 text-xs uppercase tracking-widest">
                        {provider.totalBookings || 0} Bookings
                      </p>
                      <p className="text-white/60 text-xs uppercase tracking-widest">
                        Starting at <span className="text-white font-normal">₹{provider.startingPrice || "299"}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="border border-white/10 bg-white/5 p-12 text-center">
                <div className="text-white/40 mb-2 uppercase tracking-widest text-xs">No consultants found</div>
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Info Banner */}
            <div className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 mt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-white flex-shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1 uppercase tracking-wider">
                    100% Verified Professionals
                  </h4>
                  <p className="text-white/60 text-xs tracking-wide">
                    All service providers are background checked and verified for your safety
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
