import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  Search, 
  Smartphone, 
  Tv, 
  Zap, 
  Car,
  Wifi,
  Shield,
  CreditCard,
  Home,
  Droplets,
  Flame,
  Phone,
  Truck,
  BookOpen,
  Star,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Banknote,
  ArrowLeft,
  Info
} from "lucide-react";

interface BillService {
  id: string;
  category: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  processingFee: string;
  processTime: string;
  rating: number;
  users: string;
  features: string[];
  cashback: string;
  isPopular?: boolean;
  isPremium?: boolean;
}

export default function BillsRecharge() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [processingFeeFilter, setProcessingFeeFilter] = useState("");

  const categories = [
    { id: "all", label: "All Services", icon: CreditCard },
    { id: "mobile", label: "Mobile", icon: Smartphone },
    { id: "dth", label: "DTH/TV", icon: Tv },
    { id: "electricity", label: "Electricity", icon: Zap },
    { id: "gas", label: "Gas", icon: Flame },
    { id: "water", label: "Water", icon: Droplets },
    { id: "internet", label: "Internet", icon: Wifi },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "loan", label: "Loan EMI", icon: Banknote },
    { id: "fastag", label: "FASTag", icon: Car },
    { id: "landline", label: "Landline", icon: Phone },
    { id: "transport", label: "Transport", icon: Truck },
    { id: "education", label: "Education", icon: BookOpen }
  ];

  const mockBillServices: BillService[] = [
    {
      id: "jio",
      category: "mobile",
      name: "Jio Mobile Recharge",
      provider: "Reliance Jio",
      icon: "📱",
      description: "Instant mobile recharge with exciting offers",
      processingFee: "Free",
      processTime: "Instant",
      rating: 4.8,
      users: "50M+",
      features: ["Instant recharge", "Special offers", "Data bonus"],
      cashback: "Up to ₹50",
      isPopular: true
    },
    {
      id: "airtel",
      category: "mobile", 
      name: "Airtel Mobile Recharge",
      provider: "Bharti Airtel",
      icon: "📱",
      description: "Quick recharge with best plans",
      processingFee: "Free",
      processTime: "Instant",
      rating: 4.7,
      users: "40M+",
      features: ["Quick recharge", "Best plans", "Unlimited calls"],
      cashback: "Up to ₹40"
    },
    {
      id: "vi",
      category: "mobile",
      name: "Vi Mobile Recharge", 
      provider: "Vodafone Idea",
      icon: "📱",
      description: "Seamless recharge experience",
      processingFee: "Free",
      processTime: "Instant", 
      rating: 4.5,
      users: "30M+",
      features: ["Easy recharge", "Data offers", "Voice benefits"],
      cashback: "Up to ₹30"
    },
    {
      id: "tata sky",
      category: "dth",
      name: "Tata Sky DTH",
      provider: "Tata Sky",
      icon: "📺",
      description: "Premium DTH service with HD channels",
      processingFee: "₹2",
      processTime: "5 mins",
      rating: 4.6,
      users: "25M+",
      features: ["HD channels", "Recording", "Multi-room"],
      cashback: "Up to ₹25",
      isPremium: true
    },
    {
      id: "dish tv",
      category: "dth",
      name: "Dish TV",
      provider: "Dish TV",
      icon: "📺", 
      description: "Affordable DTH with variety channels",
      processingFee: "₹1",
      processTime: "3 mins",
      rating: 4.4,
      users: "20M+",
      features: ["Variety channels", "Regional content", "Sports package"],
      cashback: "Up to ₹20"
    },
    {
      id: "mseb",
      category: "electricity",
      name: "MSEB Electricity",
      provider: "Maharashtra State Electricity Board",
      icon: "⚡",
      description: "Pay your electricity bill online",
      processingFee: "₹3",
      processTime: "24 hours",
      rating: 4.3,
      users: "15M+", 
      features: ["Online payment", "Bill history", "Due reminders"],
      cashback: "Up to ₹15"
    },
    {
      id: "bses",
      category: "electricity",
      name: "BSES Electricity",
      provider: "BSES",
      icon: "⚡",
      description: "Delhi electricity bill payment",
      processingFee: "₹2",
      processTime: "12 hours",
      rating: 4.4,
      users: "10M+",
      features: ["Quick payment", "E-receipt", "Auto-pay option"],
      cashback: "Up to ₹20"
    },
    {
      id: "airtel digital",
      category: "internet", 
      name: "Airtel Fiber",
      provider: "Bharti Airtel",
      icon: "🌐",
      description: "High-speed broadband bills",
      processingFee: "Free",
      processTime: "Instant",
      rating: 4.5,
      users: "8M+",
      features: ["High speed", "Unlimited data", "OTT benefits"],
      cashback: "Up to ₹35",
      isPopular: true
    },
    {
      id: "jiofiber",
      category: "internet",
      name: "JioFiber",
      provider: "Reliance Jio", 
      icon: "🌐",
      description: "Ultra-fast fiber internet bills",
      processingFee: "Free",
      processTime: "Instant",
      rating: 4.6,
      users: "12M+",
      features: ["Ultra-fast", "Free OTT apps", "Gaming benefits"],
      cashback: "Up to ₹45"
    },
    {
      id: "icici",
      category: "insurance",
      name: "ICICI Insurance",
      provider: "ICICI Lombard",
      icon: "🛡️",
      description: "Insurance premium payments",
      processingFee: "₹10",
      processTime: "1 hour",
      rating: 4.7,
      users: "5M+",
      features: ["Easy renewal", "Policy management", "Claim tracking"],
      cashback: "Up to ₹100",
      isPremium: true
    },
    {
      id: "hdfc", 
      category: "insurance",
      name: "HDFC Insurance",
      provider: "HDFC ERGO",
      icon: "🛡️",
      description: "Comprehensive insurance plans",
      processingFee: "₹8",
      processTime: "30 mins",
      rating: 4.6,
      users: "4M+",
      features: ["Multiple plans", "Easy claims", "24/7 support"],
      cashback: "Up to ₹80"
    },
    {
      id: "parivahan",
      category: "fastag",
      name: "Parivahan FASTag",
      provider: "Government of India",
      icon: "🚗",
      description: "Official FASTag recharge",
      processingFee: "₹1",
      processTime: "5 mins",
      rating: 4.5,
      users: "50M+",
      features: ["Official", "All toll plazas", "SMS alerts"],
      cashback: "Up to ₹10",
      isPopular: true
    }
  ];

  const getTypeColor = (category: string) => {
    const colors = {
      mobile: "bg-white/10",
      dth: "bg-white/10", 
      electricity: "bg-white/10",
      gas: "bg-white/10",
      water: "bg-white/10",
      internet: "bg-white/10",
      insurance: "bg-white/10",
      loan: "bg-white/10",
      fastag: "bg-white/10",
      landline: "bg-white/10",
      transport: "bg-white/10",
      education: "bg-amber-500"
    };
    return colors[category as keyof typeof colors] || "bg-white/10";
  };

  const filteredServices = mockBillServices.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFee = !processingFeeFilter || 
                      (processingFeeFilter === "free" && service.processingFee === "Free") ||
                      (processingFeeFilter === "low" && service.processingFee !== "Free");
    
    return matchesCategory && matchesSearch && matchesFee;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "rating": return b.rating - a.rating;
      case "popular": return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      case "cashback": return parseInt(b.cashback.match(/\d+/)?.[0] || "0") - parseInt(a.cashback.match(/\d+/)?.[0] || "0");
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedServices,
    goToPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: sortedServices,
    itemsPerPage: 10,
  });

  const handlePayBill = (service: BillService) => {
    navigate(`/bill-payment/${service.category}?service=${service.id}`);
  };

  const handleSelectService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    } else if (selectedServices.length < 3) {
      setSelectedServices(prev => [...prev, serviceId]);
    }
  };

  const formatCurrency = (amount: string) => {
    return amount;
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black border-b border-white/20 px-4 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="p-2 text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Bills & Recharge</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/bills-recharge/info")}
            className="p-2 text-white hover:bg-white/10"
            data-testid="button-bills-recharge-info"
          >
            <Info className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
      
      <div className="px-4 pt-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
          <Input
            placeholder="Search bills and recharge services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black border-white/30 text-white placeholder:text-white/40 focus:border-white rounded-none"
            data-testid="input-search-services"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm" 
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap h-9 px-4 rounded-none",
                selectedCategory === category.id
                  ? "bg-white text-black"
                  : "bg-black text-white border-white/20 hover:bg-white/10"
              )}
              data-testid={`button-category-${category.id}`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-black text-white border-white/20 hover:bg-white/10 rounded-none"
              data-testid="button-filters"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-9 bg-black text-white border-white/20 rounded-none" data-testid="select-sort">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="popular" className="text-white focus:bg-white/10">Popular</SelectItem>
                <SelectItem value="rating" className="text-white focus:bg-white/10">Rating</SelectItem>
                <SelectItem value="cashback" className="text-white focus:bg-white/10">Cashback</SelectItem>
                <SelectItem value="name" className="text-white focus:bg-white/10">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedServices.length > 0 && (
            <Button
              onClick={() => setShowCompare(true)}
              className="bg-white text-black hover:bg-white/90 rounded-none"
              size="sm"
              data-testid="button-compare"
            >
              Compare ({selectedServices.length})
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-black border border-white/20 rounded-none p-4 mb-6">
            <h3 className="font-semibold text-white mb-3">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Processing Fee</label>
                <Select value={processingFeeFilter} onValueChange={setProcessingFeeFilter}>
                  <SelectTrigger className="bg-black text-white border-white/20 rounded-none">
                    <SelectValue placeholder="Any fee" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="" className="text-white focus:bg-white/10">Any fee</SelectItem>
                    <SelectItem value="free" className="text-white focus:bg-white/10">Free</SelectItem>
                    <SelectItem value="low" className="text-white focus:bg-white/10">Low fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setProcessingFeeFilter("");
                  }}
                  className="bg-black text-white border border-white/20 hover:bg-white/10 rounded-none"
                  size="sm"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {paginatedServices.map((service) => (
            <div
              key={service.id}
              className={cn(
                "bg-black border rounded-none p-4 transition-all duration-300 hover:border-white/40 cursor-pointer relative",
                selectedServices.includes(service.id) 
                  ? "border-white/60" 
                  : "border-white/20"
              )}
              onClick={() => handleSelectService(service.id)}
              data-testid={`card-service-${service.id}`}
            >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg", getTypeColor(service.category))}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{service.name}</h3>
                  <p className="text-xs text-white/60">{service.provider}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {service.isPopular && (
                  <span className="bg-white/10 bg-white/10 text-xs px-2 py-1 rounded-none border bg-white/10">Popular</span>
                )}
                {service.isPremium && (
                  <span className="bg-white/10 bg-white/10 text-xs px-2 py-1 rounded-none border bg-white/10">Premium</span>
                )}
                
                {selectedServices.includes(service.id) && (
                  <CheckCircle className="h-5 w-5 bg-white/10" />
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-white/60 mb-3">{service.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 bg-white/10" />
                <span className="text-xs text-white">{service.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-white/60" />
                <span className="text-xs text-white/60">{service.users}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-white/60" />
                <span className="text-xs text-white/60">{service.processTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-3 w-3 text-white/60" />
                <span className="text-xs text-white/60">{service.processingFee}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-3">
              {service.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-none border border-white/20">
                  {feature}
                </span>
              ))}
            </div>

            {/* Cashback */}
            <div className="flex items-center justify-between">
              <span className="text-xs bg-white/10 font-medium">💰 {service.cashback}</span>
              <span className="text-xs text-white/60">Cashback</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayBill(service);
                }}
                className="flex-1 bg-white text-black hover:bg-white/90 text-xs h-8 rounded-none"
                data-testid={`button-pay-${service.id}`}
              >
                Pay Bill
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/bill-payment/${service.category}?service=${service.id}&view=details`);
                }}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 text-xs h-8 rounded-none"
                data-testid={`button-details-${service.id}`}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      </div>

      {sortedServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
          <p className="text-white/60">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-4xl bg-black text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Compare Services</DialogTitle>
          </DialogHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2 text-sm text-white/60">Feature</th>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <th key={serviceId} className="text-left p-2 min-w-48">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white text-sm", getTypeColor(service.category))}>
                            {service.icon}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{service.name}</p>
                            <p className="text-xs text-white/60">{service.provider}</p>
                          </div>
                        </div>
                      </th>
                    ) : null;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-white/60">Rating</td>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <td key={serviceId} className="p-2 font-semibold text-white">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-white bg-white/10" />
                          <span>{service.rating}</span>
                        </div>
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-white/60">Processing Fee</td>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <td key={serviceId} className="p-2 font-semibold text-white">
                        {service.processingFee}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-white/60">Process Time</td>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <td key={serviceId} className="p-2 font-semibold bg-white/10">
                        {service.processTime}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-white/60">Cashback</td>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <td key={serviceId} className="p-2 font-semibold bg-white/10">
                        {service.cashback}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 text-sm text-white/60">Users</td>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <td key={serviceId} className="p-2 font-semibold text-white">
                        {service.users}
                      </td>
                    ) : null;
                  })}
                </tr>
                <tr>
                  <td className="p-2 text-sm text-white/60">Action</td>
                  {selectedServices.map(serviceId => {
                    const service = mockBillServices.find(s => s.id === serviceId);
                    return service ? (
                      <td key={serviceId} className="p-2">
                        <Button
                          onClick={() => handlePayBill(service)}
                          size="sm"
                          className="bg-black text-white hover:bg-black/90"
                        >
                          Pay Bill
                        </Button>
                      </td>
                    ) : null;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => setSelectedServices([])}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-none"
            >
              Clear Selection
            </Button>
            <Button
              onClick={() => setShowCompare(false)}
              className="bg-white text-black hover:bg-white/90 rounded-none"
            >
              Close Comparison
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}