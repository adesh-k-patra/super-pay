import { useState, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  X,
  Store,
  UtensilsCrossed,
  IndianRupee,
  Leaf,
  Drumstick,
  Cake,
  IceCream,
  Coffee,
  Cookie,
  Sunrise,
  Sun,
  Moon,
  Heart,
  ShoppingBag
} from "lucide-react";

type FoodCategory = 'all' | 'veg' | 'non-veg' | 'cakes' | 'desserts' | 'beverages' | 'snacks' | 'breakfast' | 'lunch' | 'dinner';

// Generate comprehensive vendor data (150+ vendors across all categories)
const generateVendors = () => {
  const vendors: Record<string, any[]> = {
    "hotel-food": [],
    "supermart": [],
    "medicine": [],
    "electronics": [],
    "beauty": [],
    "pet": [],
    "home": []
  };

  // Hotel Food - 40 vendors
  const cuisines = [
    ["North Indian", "Punjabi"], ["South Indian", "Kerala"], ["Chinese", "Asian"], ["Italian", "Pizza"],
    ["Mughlai", "Tandoor"], ["Bengali", "Fish"], ["Rajasthani", "Thali"], ["Hyderabadi", "Biryani"],
    ["Continental", "European"], ["Mexican", "Tex-Mex"], ["Japanese", "Sushi"], ["Thai", "Asian Fusion"],
    ["Mediterranean", "Greek"], ["Fast Food", "Burgers"], ["Desserts", "Ice Cream"], ["Cafe", "Snacks"],
    ["Bakery", "Cakes"], ["Kerala", "Coastal"], ["Chettinad", "Spicy"], ["Street Food", "Chaat"],
    ["Healthy", "Salads"], ["Vegan", "Plant Based"], ["Seafood", "Coastal"], ["Andhra", "Spicy"],
    ["Gujarati", "Traditional"], ["Kashmiri", "Wazwan"], ["Goan", "Seafood"], ["American", "Diner"],
    ["Korean", "BBQ"], ["Lebanese", "Middle Eastern"], ["Vietnamese", "Pho"], ["Malaysian", "Asian"],
    ["Turkish", "Kebabs"], ["Biryani", "Rice"], ["BBQ", "Grills"], ["Sandwich", "Wraps"],
    ["Momos", "Tibetan"], ["Paratha", "Indian Bread"], ["Rolls", "Wraps"], ["Tea", "Beverages"]
  ];
  
  const names = [
    "The Great Punjab", "South Spice", "Dragon Wok", "Pizza Paradise", "Mughal Darbar",
    "Bengali Bites", "Royal Rajasthani", "Biryani Blues", "Continental Corner", "Taco Town",
    "Sushi Station", "Thai Temptations", "Mediterranean Magic", "Burger Crown", "Sweet Dreams",
    "Cafe Delight", "Baker's Dozen", "Kerala Kitchen", "Chettinad Chronicles", "Street Food Express",
    "Healthy Hub", "Green Garden", "Ocean Delights", "Andhra Spice", "Gujarat Thali House",
    "Kashmir Crown", "Goa Vibes", "American Diner", "Seoul Kitchen", "Beirut Bites",
    "Hanoi Pho House", "Spice Malaysia", "Istanbul Kebabs", "Biryani Palace", "BBQ Nation",
    "Sandwich Co", "Momo Magic", "Paratha Point", "Roll Express", "Chai Shai"
  ];

  // Assign food categories to vendors
  const foodCategories = ['veg', 'non-veg', 'cakes', 'desserts', 'beverages', 'snacks', 'breakfast', 'lunch', 'dinner'];
  
  for (let i = 0; i < 40; i++) {
    const isVeg = i % 3 === 0;
    const vendorCategories = [];
    
    // All vendors can serve lunch and dinner
    vendorCategories.push('lunch', 'dinner');
    
    // Assign specific categories
    if (i < 15 && isVeg) vendorCategories.push('veg');
    if (i >= 15 && i < 30) vendorCategories.push('non-veg');
    if (i >= 14 && i < 17) vendorCategories.push('cakes');
    if (i >= 14 && i < 20) vendorCategories.push('desserts');
    if (i >= 15 && i < 25) vendorCategories.push('beverages');
    if (i >= 19 && i < 30) vendorCategories.push('snacks');
    if (i >= 0 && i < 25) vendorCategories.push('breakfast');
    
    vendors["hotel-food"].push({
      id: `${i + 1}`,
      name: names[i],
      slug: names[i].toLowerCase().replace(/ /g, '-'),
      cuisines: cuisines[i],
      foodCategories: vendorCategories,
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      totalRatings: Math.floor(300 + Math.random() * 4000),
      deliveryTime: `${20 + Math.floor(Math.random() * 25)}-${30 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.random() > 0.4 ? Math.floor(Math.random() * 40) : 0,
      minOrder: 100 + Math.floor(Math.random() * 200),
      costForTwo: 300 + Math.floor(Math.random() * 500),
      isVeg: isVeg ? 1 : 0,
      isPremium: i % 4 === 0 ? 1 : 0,
      tags: i % 5 === 0 ? ["Bestseller"] : (i % 7 === 0 ? ["Trending"] : []),
      offers: Math.random() > 0.3 ? [`${30 + Math.floor(Math.random() * 40)}% OFF up to ₹${50 + Math.floor(Math.random() * 150)}`] : [],
      distance: (0.5 + Math.random() * 4).toFixed(1) + " km",
      isOpen: Math.random() > 0.15 ? 1 : 0,
      menuCount: 45 + Math.floor(Math.random() * 105)
    });
  }

  // Supermart - 25 vendors
  const supermarts = ["QuickMart", "FreshMart", "DailyMart", "GroceryHub", "SuperMart24", "VeggieWorld", "OrganicStore", "FreshBasket", "NeighborMart", "CityMart", "ValueMart", "HyperMart", "EasyMart", "SmartMart", "LocalMart", "TrendyMart", "UrbanMart", "PrimeMart", "EliteMart", "FreshStop", "QuickStop", "MegaMart", "FamilyMart", "ChoiceMart", "TrustMart"];
  for (let i = 0; i < 25; i++) {
    vendors["supermart"].push({
      id: `${100 + i + 1}`,
      name: supermarts[i] + (i < 10 ? " Express" : " Daily"),
      slug: supermarts[i].toLowerCase(),
      cuisines: i % 2 === 0 ? ["Groceries", "Daily Essentials"] : ["Fruits & Vegetables", "Dairy"],
      foodCategories: [],
      rating: parseFloat((3.9 + Math.random() * 1.0).toFixed(1)),
      totalRatings: Math.floor(500 + Math.random() * 2000),
      deliveryTime: `${8 + Math.floor(Math.random() * 7)} min`,
      deliveryFee: 0,
      minOrder: 50 + Math.floor(Math.random() * 100),
      costForTwo: 300 + Math.floor(Math.random() * 400),
      isVeg: 1,
      isPremium: i % 5 === 0 ? 1 : 0,
      tags: i % 6 === 0 ? ["10-min delivery"] : (i % 8 === 0 ? ["Organic", "Fresh"] : []),
      offers: [`Flat ${10 + Math.floor(Math.random() * 15)}% OFF on first order`],
      distance: (0.3 + Math.random() * 2).toFixed(1) + " km",
      isOpen: 1
    });
  }

  // Medicine - 20 vendors
  const pharmacies = ["HealthPlus", "MediCare", "WellnessRx", "CarePharmacy", "MedExpress", "PharmEasy", "LifeCare", "PlusHealth", "QuickMeds", "TrueMeds", "CityPharmacy", "Apollo24x7", "NetMeds", "1mg", "PharmaCare", "HealthHub", "MediWorld", "CarePlus", "LifeLine", "WellBeingRx"];
  for (let i = 0; i < 20; i++) {
    vendors["medicine"].push({
      id: `${200 + i + 1}`,
      name: pharmacies[i] + " Pharmacy",
      slug: pharmacies[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Medicines", "Healthcare"] : (i % 3 === 1 ? ["Medicines", "Baby Care"] : ["Medicines", "Wellness"]),
      foodCategories: [],
      rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
      totalRatings: Math.floor(1000 + Math.random() * 3000),
      deliveryTime: `${15 + Math.floor(Math.random() * 15)} min`,
      deliveryFee: 0,
      minOrder: 0,
      costForTwo: 200 + Math.floor(Math.random() * 300),
      isVeg: 1,
      isPremium: i % 4 === 0 ? 1 : 0,
      tags: i % 3 === 0 ? ["Verified", "24x7"] : ["Verified"],
      offers: [`${10 + Math.floor(Math.random() * 15)}% OFF on orders above ₹${300 + Math.floor(Math.random() * 400)}`],
      distance: (0.5 + Math.random() * 3).toFixed(1) + " km",
      isOpen: 1
    });
  }

  // Electronics - 20 vendors
  const electronics = ["TechZone", "GadgetHub", "ElectroWorld", "DigitalStore", "TechMart", "MobileZone", "SmartTech", "EliteElectronics", "TechBazar", "DigitalBay", "GadgetGuru", "TechSavvy", "ElectroMart", "UrbanTech", "TechPark", "ByteStore", "CircuitCity", "TechNest", "PixelStore", "DeviceHub"];
  for (let i = 0; i < 20; i++) {
    vendors["electronics"].push({
      id: `${300 + i + 1}`,
      name: electronics[i],
      slug: electronics[i].toLowerCase(),
      cuisines: i % 4 === 0 ? ["Mobile", "Accessories"] : (i % 4 === 1 ? ["Laptops", "Computers"] : (i % 4 === 2 ? ["Audio", "Headphones"] : ["Gadgets", "Electronics"])),
      foodCategories: [],
      rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
      totalRatings: Math.floor(400 + Math.random() * 1500),
      deliveryTime: `${25 + Math.floor(Math.random() * 25)} min`,
      deliveryFee: Math.random() > 0.3 ? 40 + Math.floor(Math.random() * 30) : 0,
      minOrder: 200 + Math.floor(Math.random() * 300),
      costForTwo: 1500 + Math.floor(Math.random() * 2500),
      isVeg: 1,
      isPremium: i % 5 === 0 ? 1 : 0,
      tags: i % 6 === 0 ? ["Bestseller"] : (i % 8 === 0 ? ["Trending"] : []),
      offers: [`Up to ${20 + Math.floor(Math.random() * 30)}% OFF on select items`],
      distance: (1.0 + Math.random() * 3.5).toFixed(1) + " km",
      isOpen: Math.random() > 0.1 ? 1 : 0
    });
  }

  // Beauty - 20 vendors
  const beauty = ["GlowUp", "BeautyBliss", "CharmStudio", "GlamourZone", "PureBeauty", "RadiantStore", "LuxeBeauty", "StyleStudio", "EleganceHub", "BeautyBay", "GlossyStore", "ChicBeauty", "AuraBeauty", "VogueCosmetics", "DivaStore", "BeautyNest", "GraceCosmetics", "ShineStore", "BlushBeauty", "GlowStore"];
  for (let i = 0; i < 20; i++) {
    vendors["beauty"].push({
      id: `${400 + i + 1}`,
      name: beauty[i] + " Beauty",
      slug: beauty[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Cosmetics", "Skincare"] : (i % 3 === 1 ? ["Makeup", "Beauty"] : ["Wellness", "Personal Care"]),
      foodCategories: [],
      rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
      totalRatings: Math.floor(600 + Math.random() * 2000),
      deliveryTime: `${18 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.random() > 0.5 ? 20 + Math.floor(Math.random() * 30) : 0,
      minOrder: 150 + Math.floor(Math.random() * 200),
      costForTwo: 600 + Math.floor(Math.random() * 800),
      isVeg: 1,
      isPremium: i % 4 === 0 ? 1 : 0,
      tags: i % 7 === 0 ? ["Trending"] : [],
      offers: i % 3 === 0 ? ["Buy 2 Get 1 Free"] : [`Flat ₹${50 + Math.floor(Math.random() * 100)} OFF above ₹${500 + Math.floor(Math.random() * 500)}`],
      distance: (0.8 + Math.random() * 3).toFixed(1) + " km",
      isOpen: 1
    });
  }

  // Pet - 15 vendors
  const pet = ["PawsPerfect", "PetParadise", "FurryFriends", "PetWorld", "AnimalCare", "PetLove", "TailWaggers", "HappyPaws", "PetPalace", "FurBabies", "PetHub", "CritterCare", "PetStore", "AnimalHaven", "PawsNClaws"];
  for (let i = 0; i < 15; i++) {
    vendors["pet"].push({
      id: `${500 + i + 1}`,
      name: pet[i],
      slug: pet[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Pet Food", "Pet Toys"] : (i % 3 === 1 ? ["Pet Care", "Grooming"] : ["Pet Supplies", "Accessories"]),
      foodCategories: [],
      rating: parseFloat((4.0 + Math.random() * 0.8).toFixed(1)),
      totalRatings: Math.floor(300 + Math.random() * 1000),
      deliveryTime: `${22 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.random() > 0.4 ? 30 + Math.floor(Math.random() * 30) : 0,
      minOrder: 150 + Math.floor(Math.random() * 150),
      costForTwo: 500 + Math.floor(Math.random() * 600),
      isVeg: 1,
      isPremium: i % 5 === 0 ? 1 : 0,
      tags: i % 6 === 0 ? ["Trusted"] : [],
      offers: [`${10 + Math.floor(Math.random() * 20)}% OFF on first order`],
      distance: (1.0 + Math.random() * 3).toFixed(1) + " km",
      isOpen: 1
    });
  }

  // Home & Kitchen - 15 vendors
  const home = ["HomeEssentials", "KitchenWorld", "HomeDecor", "LivingSpace", "KitchenHub", "HomeStyle", "DecorStore", "InteriorShop", "KitchenCraft", "HomeMart", "LivingStore", "HomeComfort", "KitchenPlus", "DecorNest", "HomeBliss"];
  for (let i = 0; i < 15; i++) {
    vendors["home"].push({
      id: `${600 + i + 1}`,
      name: home[i] + " Store",
      slug: home[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Kitchen", "Home Decor"] : (i % 3 === 1 ? ["Furniture", "Decor"] : ["Appliances", "Home"]),
      foodCategories: [],
      rating: parseFloat((3.9 + Math.random() * 0.9).toFixed(1)),
      totalRatings: Math.floor(400 + Math.random() * 1200),
      deliveryTime: `${30 + Math.floor(Math.random() * 25)} min`,
      deliveryFee: Math.random() > 0.3 ? 40 + Math.floor(Math.random() * 40) : 0,
      minOrder: 250 + Math.floor(Math.random() * 250),
      costForTwo: 1000 + Math.floor(Math.random() * 1500),
      isVeg: 1,
      isPremium: i % 5 === 0 ? 1 : 0,
      tags: [],
      offers: [`Flat ${10 + Math.floor(Math.random() * 20)}% OFF`],
      distance: (1.5 + Math.random() * 3).toFixed(1) + " km",
      isOpen: Math.random() > 0.1 ? 1 : 0
    });
  }

  return vendors;
};

const categoryVendors: Record<string, any[]> = generateVendors();

const categoryInfo: Record<string, { name: string; description: string; icon: any }> = {
  "hotel-food": { name: "Restaurant Food", description: "Delicious meals from top restaurants", icon: UtensilsCrossed },
  "supermart": { name: "Supermart", description: "Groceries in 10 minutes", icon: Store },
  "medicine": { name: "Medicine", description: "Pharmacy & healthcare", icon: Store },
  "electronics": { name: "Electronics", description: "Gadgets & accessories", icon: Store },
  "beauty": { name: "Beauty & Personal Care", description: "Cosmetics & wellness", icon: Store },
  "pet": { name: "Pet Supplies", description: "For your furry friends", icon: Store },
  "home": { name: "Home & Kitchen", description: "Home essentials", icon: Store }
};

export default function FoodDeliveryListing() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [, params] = useRoute("/delivery-now/:category");
  const category = params?.category || "hotel-food";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<FoodCategory>("all");

  const info = categoryInfo[category] || categoryInfo["hotel-food"];
  const vendors = categoryVendors[category] || [];

  // Filter vendors based on search and food category
  const filteredVendors = useMemo(() => {
    let filtered = [...vendors];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.cuisines.some((c: string) => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Food category filter (only for hotel-food)
    if (category === "hotel-food" && selectedFoodCategory !== "all") {
      filtered = filtered.filter(v => 
        v.foodCategories && v.foodCategories.includes(selectedFoodCategory)
      );
    }
    
    return filtered;
  }, [vendors, searchTerm, selectedFoodCategory, category]);

  const VendorCard = ({ vendor }: { vendor: any }) => {
    return (
      <button
        onClick={() => navigate(`/delivery-now/${category}/vendor/${vendor.slug}`)}
        className="w-full p-0 border border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left overflow-hidden group"
        data-testid={`vendor-${vendor.id}`}
      >
        <div className="flex flex-col gap-3 p-4">
          {/* Header Zone */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-2xl flex-shrink-0">
                🍔
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold tracking-wide text-base text-white/90 truncate" data-testid={`text-vendor-name-${vendor.id}`}>
                  {vendor.name}
                </h3>
                <p className="text-xs text-white/50 truncate">{vendor.cuisines.join(" • ")}</p>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-3.5 w-3.5 text-white fill-white" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-white" data-testid={`text-rating-${vendor.id}`}>{vendor.rating}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-wider">
                {vendor.totalRatings.toLocaleString()} ratings
              </p>
            </div>
          </div>

          {/* Middle Zone - Details */}
          <div className="flex items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span data-testid={`text-delivery-time-${vendor.id}`}>{vendor.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span data-testid={`text-distance-${vendor.id}`}>{vendor.distance}</span>
            </div>
            {vendor.isVeg === 1 && (
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 border border-green-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500" />
                </div>
                <span className="text-green-500">VEG</span>
              </div>
            )}
          </div>

          {/* Tags and Offers */}
          {(vendor.tags.length > 0 || vendor.offers.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {vendor.isPremium === 1 && (
                <Badge className="bg-white text-black border-0 rounded-none text-[10px] px-2 py-0.5 font-bold">
                  PREMIUM
                </Badge>
              )}
              {vendor.tags.map((tag: string, idx: number) => (
                <Badge 
                  key={idx} 
                  className="bg-white/10 text-white border-white/20 rounded-none text-[10px] px-2 py-0.5"
                  data-testid={`badge-tag-${vendor.id}-${idx}`}
                >
                  {tag}
                </Badge>
              ))}
              {vendor.offers.length > 0 && (
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-400/20 rounded-none text-[10px] px-2 py-0.5" data-testid={`text-offer-${vendor.id}`}>
                  {vendor.offers[0]}
                </Badge>
              )}
            </div>
          )}

          {/* Footer Zone */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-white/60" strokeWidth={1.5} />
              <span className="text-xs text-white/80" data-testid={`text-cost-for-two-${vendor.id}`}>
                {vendor.costForTwo.toLocaleString()} for two
              </span>
            </div>
            
            {!vendor.isOpen && (
              <Badge className="bg-red-500/10 text-red-400 border-red-400/20 rounded-none text-[10px]" data-testid={`text-status-${vendor.id}`}>
                CLOSED
              </Badge>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold tracking-wider uppercase">{info.name}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/delivery-now/wishlist?category=${category}`)}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
              data-testid="button-wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/delivery-now/orders?category=${category}`)}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
              data-testid="button-orders"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
            <Input
              type="text"
              placeholder="SEARCH RESTAURANTS"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 placeholder:text-xs placeholder:tracking-widest placeholder:font-light focus:border-white/30 rounded-none h-10"
              data-testid="input-search-vendors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation (only for hotel-food) */}
      {category === "hotel-food" && (
        <div className="pt-24">
          <Tabs value={selectedFoodCategory} onValueChange={(value) => setSelectedFoodCategory(value as FoodCategory)} className="px-0">
            <div className="sticky top-[110px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 overflow-x-auto">
              <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto">
                <TabsTrigger 
                  value="all" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-all"
                >
                  <span className="text-lg">🍽️</span>
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="veg" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-veg"
                >
                  <Leaf className="h-5 w-5" strokeWidth={1.5} />
                  <span>Veg</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="non-veg" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-non-veg"
                >
                  <Drumstick className="h-5 w-5" strokeWidth={1.5} />
                  <span>Non-Veg</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cakes" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-cakes"
                >
                  <Cake className="h-5 w-5" strokeWidth={1.5} />
                  <span>Cakes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="desserts" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-desserts"
                >
                  <IceCream className="h-5 w-5" strokeWidth={1.5} />
                  <span>Desserts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="beverages" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-beverages"
                >
                  <Coffee className="h-5 w-5" strokeWidth={1.5} />
                  <span>Beverages</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="snacks" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-snacks"
                >
                  <Cookie className="h-5 w-5" strokeWidth={1.5} />
                  <span>Snacks</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="breakfast" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-breakfast"
                >
                  <Sunrise className="h-5 w-5" strokeWidth={1.5} />
                  <span>Breakfast</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="lunch" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-lunch"
                >
                  <Sun className="h-5 w-5" strokeWidth={1.5} />
                  <span>Lunch</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="dinner" 
                  className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all whitespace-nowrap"
                  data-testid="tab-dinner"
                >
                  <Moon className="h-5 w-5" strokeWidth={1.5} />
                  <span>Dinner</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={selectedFoodCategory} className="mt-8 px-4">
              {filteredVendors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border border-white/10 bg-white/5">
                  <Store className="h-16 w-16 text-white/20 mb-4" strokeWidth={1} />
                  <h2 className="text-lg font-bold mb-2 tracking-wide">No restaurants found</h2>
                  <p className="text-white/60 text-center mb-6 text-sm font-light">
                    {searchTerm ? `No results for "${searchTerm}"` : "Try another category"}
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFoodCategory("all");
                    }}
                    className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 font-semibold tracking-wider text-xs" 
                    data-testid="button-reset-filters"
                  >
                    VIEW ALL
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-xs text-white/60 uppercase tracking-widest">
                      {filteredVendors.length} {filteredVendors.length === 1 ? 'restaurant' : 'restaurants'} found
                    </p>
                  </div>
                  <div className="space-y-3">
                    {filteredVendors.map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* For non-hotel-food categories, show simple listing */}
      {category !== "hotel-food" && (
        <div className="pt-24 px-4 py-6">
          {filteredVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-white/10 bg-white/5">
              <Store className="h-16 w-16 text-white/20 mb-4" strokeWidth={1} />
              <h2 className="text-lg font-bold mb-2 tracking-wide">No results found</h2>
              <p className="text-white/60 text-center mb-6 text-sm font-light">
                {searchTerm ? `No results for "${searchTerm}"` : "No vendors available"}
              </p>
              {searchTerm && (
                <Button 
                  onClick={() => setSearchTerm("")}
                  className="bg-white text-black hover:bg-white/90 rounded-none h-10 px-6 font-semibold tracking-wider text-xs" 
                  data-testid="button-reset-search"
                >
                  CLEAR SEARCH
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-xs text-white/60 uppercase tracking-widest">
                  {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
                </p>
              </div>
              <div className="space-y-3">
                {filteredVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
