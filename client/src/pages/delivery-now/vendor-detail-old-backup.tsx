import { useState, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Share2,
  Heart,
  Search,
  Leaf,
  Plus,
  Minus,
  ShoppingCart,
  Info,
  TrendingUp,
  Award,
  ChevronDown,
  Percent,
  ChevronRight,
  X,
  ClipboardList,
  ImageIcon,
  MessageSquare,
  Gift,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

// Generate comprehensive product data (700+ products across all vendors)
const generateProducts = () => {
  const products: Record<string, any[]> = {};

  // Hotel Food Products (IDs 1-40, ~5-6 products each)
  const hotelFoodItems = [
    { name: "Butter Chicken", desc: "Rich creamy tomato curry", price: 320, veg: 0, cat: "Main Course" },
    { name: "Paneer Tikka", desc: "Grilled cottage cheese cubes", price: 280, veg: 1, cat: "Starters" },
    { name: "Dal Makhani", desc: "Creamy black lentils", price: 220, veg: 1, cat: "Main Course" },
    { name: "Tandoori Roti", desc: "Whole wheat bread", price: 30, veg: 1, cat: "Breads" },
    { name: "Chicken Biryani", desc: "Aromatic rice with chicken", price: 380, veg: 0, cat: "Rice & Biryani" },
    { name: "Gulab Jamun", desc: "Sweet milk balls", price: 80, veg: 1, cat: "Desserts" },
    { name: "Veg Manchurian", desc: "Crispy veg balls in sauce", price: 240, veg: 1, cat: "Starters" },
    { name: "Chicken 65", desc: "Spicy fried chicken", price: 300, veg: 0, cat: "Starters" },
    { name: "Naan", desc: "Soft leavened bread", price: 40, veg: 1, cat: "Breads" },
    { name: "Veg Biryani", desc: "Mixed vegetables rice", price: 280, veg: 1, cat: "Rice & Biryani" }
  ];

  for (let i = 1; i <= 40; i++) {
    const vendorProducts = [];
    const numProducts = 5 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numProducts; j++) {
      const item = hotelFoodItems[j % hotelFoodItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 100);
      const hasDiscount = Math.random() > 0.6;
      const discountPercent = hasDiscount ? [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: item.veg,
        category: item.cat,
        isBestseller: Math.random() > 0.7,
        rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  // Supermart Products (IDs 101-125, ~4-5 products each)
  const supermartItems = [
    { name: "Fresh Milk 1L", desc: "Farm fresh dairy milk", price: 60, cat: "Dairy" },
    { name: "Brown Bread", desc: "Whole wheat bread loaf", price: 45, cat: "Bakery" },
    { name: "Organic Bananas", desc: "Fresh yellow bananas", price: 50, cat: "Fruits" },
    { name: "Tomatoes 1kg", desc: "Fresh red tomatoes", price: 40, cat: "Vegetables" },
    { name: "Basmati Rice 1kg", desc: "Premium quality rice", price: 120, cat: "Groceries" },
    { name: "Mineral Water 1L", desc: "Purified drinking water", price: 20, cat: "Beverages" },
    { name: "Fresh Eggs 6pcs", desc: "Farm fresh eggs", price: 80, cat: "Dairy" },
    { name: "Green Tea", desc: "Premium green tea bags", price: 150, cat: "Beverages" }
  ];

  for (let i = 101; i <= 125; i++) {
    const vendorProducts = [];
    const numProducts = 4 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numProducts; j++) {
      const item = supermartItems[j % supermartItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 20);
      const hasDiscount = Math.random() > 0.5;
      const discountPercent = hasDiscount ? [10, 15, 20, 25, 30, 40][Math.floor(Math.random() * 6)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: 1,
        category: item.cat,
        isBestseller: Math.random() > 0.8,
        rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  // Medicine Products (IDs 201-220, ~4-5 products each)
  const medicineItems = [
    { name: "Paracetamol 500mg", desc: "Pain & fever relief tablets", price: 20, cat: "Pain Relief" },
    { name: "Cough Syrup", desc: "Relief from cough & cold", price: 85, cat: "Cold & Flu" },
    { name: "Vitamin C Tablets", desc: "Immunity booster", price: 150, cat: "Vitamins" },
    { name: "Hand Sanitizer", desc: "Germ protection gel", price: 120, cat: "Healthcare" },
    { name: "Face Masks", desc: "Disposable masks pack of 10", price: 80, cat: "Healthcare" },
    { name: "Antacid Tablets", desc: "Quick acidity relief", price: 40, cat: "Digestive" },
    { name: "Bandages Pack", desc: "Sterile bandages", price: 60, cat: "First Aid" }
  ];

  for (let i = 201; i <= 220; i++) {
    const vendorProducts = [];
    const numProducts = 4 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numProducts; j++) {
      const item = medicineItems[j % medicineItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 30);
      const hasDiscount = Math.random() > 0.5;
      const discountPercent = hasDiscount ? [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: 1,
        category: item.cat,
        isBestseller: Math.random() > 0.75,
        rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  // Electronics Products (IDs 301-320, ~4 products each)
  const electronicsItems = [
    { name: "Wireless Earbuds", desc: "Bluetooth 5.0 earbuds", price: 1500, cat: "Audio" },
    { name: "Phone Case", desc: "Protective silicone case", price: 250, cat: "Accessories" },
    { name: "Power Bank 10000mAh", desc: "Fast charging power bank", price: 1200, cat: "Accessories" },
    { name: "USB Type-C Cable", desc: "Fast charging cable 1m", price: 200, cat: "Accessories" },
    { name: "Screen Protector", desc: "Tempered glass protector", price: 150, cat: "Accessories" },
    { name: "Wireless Mouse", desc: "Ergonomic wireless mouse", price: 600, cat: "Computer" }
  ];

  for (let i = 301; i <= 320; i++) {
    const vendorProducts = [];
    for (let j = 0; j < 4; j++) {
      const item = electronicsItems[j % electronicsItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 300);
      const hasDiscount = Math.random() > 0.5;
      const discountPercent = hasDiscount ? [15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 6)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: 1,
        category: item.cat,
        isBestseller: Math.random() > 0.75,
        rating: parseFloat((3.9 + Math.random() * 1.0).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  // Beauty Products (IDs 401-420, ~4 products each)
  const beautyItems = [
    { name: "Face Cream", desc: "Moisturizing day cream", price: 450, cat: "Skincare" },
    { name: "Lipstick", desc: "Matte finish long lasting", price: 350, cat: "Makeup" },
    { name: "Hair Serum", desc: "Smoothing & shine serum", price: 280, cat: "Hair Care" },
    { name: "Face Wash", desc: "Deep cleansing face wash", price: 220, cat: "Skincare" },
    { name: "Perfume", desc: "Long lasting fragrance", price: 800, cat: "Fragrance" },
    { name: "Nail Polish", desc: "Quick dry nail polish", price: 150, cat: "Makeup" }
  ];

  for (let i = 401; i <= 420; i++) {
    const vendorProducts = [];
    for (let j = 0; j < 4; j++) {
      const item = beautyItems[j % beautyItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 150);
      const hasDiscount = Math.random() > 0.5;
      const discountPercent = hasDiscount ? [15, 20, 25, 30, 40][Math.floor(Math.random() * 5)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: 1,
        category: item.cat,
        isBestseller: Math.random() > 0.8,
        rating: parseFloat((4.1 + Math.random() * 0.8).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  // Pet Products (IDs 501-515, ~4 products each)
  const petItems = [
    { name: "Dog Food 3kg", desc: "Premium dog food", price: 650, cat: "Pet Food" },
    { name: "Cat Litter 5kg", desc: "Odor control litter", price: 400, cat: "Pet Care" },
    { name: "Chew Toy", desc: "Durable chew toy", price: 180, cat: "Pet Toys" },
    { name: "Pet Shampoo", desc: "Gentle pet shampoo", price: 250, cat: "Pet Care" },
    { name: "Treat Biscuits", desc: "Healthy pet treats", price: 150, cat: "Pet Food" }
  ];

  for (let i = 501; i <= 515; i++) {
    const vendorProducts = [];
    for (let j = 0; j < 4; j++) {
      const item = petItems[j % petItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 100);
      const hasDiscount = Math.random() > 0.5;
      const discountPercent = hasDiscount ? [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: 1,
        category: item.cat,
        isBestseller: Math.random() > 0.75,
        rating: parseFloat((4.0 + Math.random() * 0.8).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  // Home & Kitchen Products (IDs 601-615, ~4 products each)
  const homeItems = [
    { name: "Kitchen Knife Set", desc: "Stainless steel knife set", price: 1200, cat: "Kitchen" },
    { name: "Storage Containers", desc: "Airtight containers set", price: 450, cat: "Kitchen" },
    { name: "Bed Sheets", desc: "Cotton bed sheet set", price: 800, cat: "Home Decor" },
    { name: "Table Lamp", desc: "Modern LED table lamp", price: 950, cat: "Home Decor" },
    { name: "Non-Stick Pan", desc: "Premium non-stick pan", price: 750, cat: "Kitchen" }
  ];

  for (let i = 601; i <= 615; i++) {
    const vendorProducts = [];
    for (let j = 0; j < 4; j++) {
      const item = homeItems[j % homeItems.length];
      const basePrice = item.price + Math.floor((Math.random() - 0.5) * 200);
      const hasDiscount = Math.random() > 0.5;
      const discountPercent = hasDiscount ? [15, 20, 25, 30, 40][Math.floor(Math.random() * 5)] : 0;
      const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
      
      vendorProducts.push({
        id: `p${i}_${j + 1}`,
        name: item.name,
        description: item.desc,
        price: basePrice,
        originalPrice: originalPrice,
        discount: discountPercent > 0 ? discountPercent : undefined,
        isVeg: 1,
        category: item.cat,
        isBestseller: Math.random() > 0.8,
        rating: parseFloat((4.0 + Math.random() * 0.8).toFixed(1))
      });
    }
    products[`${i}`] = vendorProducts;
  }

  return products;
};

// Generate vendor data matching listing.tsx
const generateVendorData = () => {
  const allVendors: any[] = [];

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

  for (let i = 0; i < 40; i++) {
    allVendors.push({
      id: `${i + 1}`,
      name: names[i],
      slug: names[i].toLowerCase().replace(/ /g, '-'),
      cuisines: cuisines[i],
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      totalRatings: Math.floor(300 + Math.random() * 4000),
      deliveryTime: `${20 + Math.floor(Math.random() * 25)}-${30 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.random() > 0.4 ? Math.floor(Math.random() * 40) : 0,
      minOrder: 100 + Math.floor(Math.random() * 200),
      costForTwo: 300 + Math.floor(Math.random() * 500),
      distance: (0.5 + Math.random() * 4).toFixed(1) + " km",
      address: "Sector 18, Noida, Uttar Pradesh",
      isPremium: i % 4 === 0 ? 1 : 0,
      offers: Math.random() > 0.3 ? [`${30 + Math.floor(Math.random() * 40)}% OFF up to ₹${50 + Math.floor(Math.random() * 150)}`, "Free Delivery"] : ["Free Delivery"],
      isOpen: Math.random() > 0.15 ? 1 : 0
    });
  }

  // Supermart - 25 vendors (matching listing.tsx)
  const supermarts = ["QuickMart", "FreshMart", "DailyMart", "GroceryHub", "SuperMart24", "VeggieWorld", "OrganicStore", "FreshBasket", "NeighborMart", "CityMart", "ValueMart", "HyperMart", "EasyMart", "SmartMart", "LocalMart", "TrendyMart", "UrbanMart", "PrimeMart", "EliteMart", "FreshStop", "QuickStop", "MegaMart", "FamilyMart", "ChoiceMart", "TrustMart"];
  for (let i = 0; i < 25; i++) {
    allVendors.push({
      id: `${100 + i + 1}`,
      name: supermarts[i] + (i < 10 ? " Express" : " Daily"),
      slug: supermarts[i].toLowerCase(),
      cuisines: i % 2 === 0 ? ["Groceries", "Daily Essentials"] : ["Fruits & Vegetables", "Dairy"],
      rating: parseFloat((3.9 + Math.random() * 1.0).toFixed(1)),
      totalRatings: Math.floor(500 + Math.random() * 2000),
      deliveryTime: `${8 + Math.floor(Math.random() * 7)} min`,
      deliveryFee: 0,
      minOrder: 50 + Math.floor(Math.random() * 100),
      costForTwo: 300 + Math.floor(Math.random() * 400),
      distance: (0.3 + Math.random() * 2).toFixed(1) + " km",
      address: "Noida, Uttar Pradesh",
      isPremium: i % 5 === 0 ? 1 : 0,
      offers: [`Flat ${10 + Math.floor(Math.random() * 15)}% OFF on first order`],
      isOpen: 1
    });
  }

  // Medicine - 20 vendors (matching listing.tsx)
  const pharmacies = ["HealthPlus", "MediCare", "WellnessRx", "CarePharmacy", "MedExpress", "PharmEasy", "LifeCare", "PlusHealth", "QuickMeds", "TrueMeds", "CityPharmacy", "Apollo24x7", "NetMeds", "1mg", "PharmaCare", "HealthHub", "MediWorld", "CarePlus", "LifeLine", "WellBeingRx"];
  for (let i = 0; i < 20; i++) {
    allVendors.push({
      id: `${200 + i + 1}`,
      name: pharmacies[i] + " Pharmacy",
      slug: pharmacies[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Medicines", "Healthcare"] : (i % 3 === 1 ? ["Medicines", "Baby Care"] : ["Medicines", "Wellness"]),
      rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
      totalRatings: Math.floor(1000 + Math.random() * 3000),
      deliveryTime: `${15 + Math.floor(Math.random() * 15)} min`,
      deliveryFee: 0,
      minOrder: 0,
      costForTwo: 200 + Math.floor(Math.random() * 300),
      distance: (0.5 + Math.random() * 3).toFixed(1) + " km",
      address: "Noida, Uttar Pradesh",
      isPremium: i % 4 === 0 ? 1 : 0,
      offers: [`${10 + Math.floor(Math.random() * 15)}% OFF on orders above ₹${300 + Math.floor(Math.random() * 400)}`],
      isOpen: 1
    });
  }

  // Electronics - 20 vendors (matching listing.tsx)
  const electronics = ["TechZone", "GadgetHub", "ElectroWorld", "DigitalStore", "TechMart", "MobileZone", "SmartTech", "EliteElectronics", "TechBazar", "DigitalBay", "GadgetGuru", "TechSavvy", "ElectroMart", "UrbanTech", "TechPark", "ByteStore", "CircuitCity", "TechNest", "PixelStore", "DeviceHub"];
  for (let i = 0; i < 20; i++) {
    allVendors.push({
      id: `${300 + i + 1}`,
      name: electronics[i],
      slug: electronics[i].toLowerCase(),
      cuisines: i % 4 === 0 ? ["Mobile", "Accessories"] : (i % 4 === 1 ? ["Laptops", "Computers"] : (i % 4 === 2 ? ["Audio", "Headphones"] : ["Gadgets", "Electronics"])),
      rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
      totalRatings: Math.floor(400 + Math.random() * 1500),
      deliveryTime: `${25 + Math.floor(Math.random() * 25)} min`,
      deliveryFee: Math.random() > 0.3 ? 40 + Math.floor(Math.random() * 30) : 0,
      minOrder: 200 + Math.floor(Math.random() * 300),
      costForTwo: 1500 + Math.floor(Math.random() * 2500),
      distance: (1.0 + Math.random() * 3.5).toFixed(1) + " km",
      address: "Noida, Uttar Pradesh",
      isPremium: i % 5 === 0 ? 1 : 0,
      offers: [`Up to ${20 + Math.floor(Math.random() * 30)}% OFF on select items`],
      isOpen: Math.random() > 0.1 ? 1 : 0
    });
  }

  // Beauty - 20 vendors (matching listing.tsx)
  const beauty = ["GlowUp", "BeautyBliss", "CharmStudio", "GlamourZone", "PureBeauty", "RadiantStore", "LuxeBeauty", "StyleStudio", "EleganceHub", "BeautyBay", "GlossyStore", "ChicBeauty", "AuraBeauty", "VogueCosmetics", "DivaStore", "BeautyNest", "GraceCosmetics", "ShineStore", "BlushBeauty", "GlowStore"];
  for (let i = 0; i < 20; i++) {
    allVendors.push({
      id: `${400 + i + 1}`,
      name: beauty[i] + " Beauty",
      slug: beauty[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Cosmetics", "Skincare"] : (i % 3 === 1 ? ["Makeup", "Beauty"] : ["Wellness", "Personal Care"]),
      rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
      totalRatings: Math.floor(600 + Math.random() * 2000),
      deliveryTime: `${18 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.random() > 0.5 ? 20 + Math.floor(Math.random() * 30) : 0,
      minOrder: 150 + Math.floor(Math.random() * 200),
      costForTwo: 600 + Math.floor(Math.random() * 800),
      distance: (0.8 + Math.random() * 3).toFixed(1) + " km",
      address: "Noida, Uttar Pradesh",
      isPremium: i % 4 === 0 ? 1 : 0,
      offers: i % 3 === 0 ? ["Buy 2 Get 1 Free"] : [`Flat ₹${50 + Math.floor(Math.random() * 100)} OFF above ₹${500 + Math.floor(Math.random() * 500)}`],
      isOpen: 1
    });
  }

  // Pet - 15 vendors (matching listing.tsx)
  const pet = ["PawsPerfect", "PetParadise", "FurryFriends", "PetWorld", "AnimalCare", "PetLove", "TailWaggers", "HappyPaws", "PetPalace", "FurBabies", "PetHub", "CritterCare", "PetStore", "AnimalHaven", "PawsNClaws"];
  for (let i = 0; i < 15; i++) {
    allVendors.push({
      id: `${500 + i + 1}`,
      name: pet[i],
      slug: pet[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Pet Food", "Pet Toys"] : (i % 3 === 1 ? ["Pet Care", "Grooming"] : ["Pet Supplies", "Accessories"]),
      rating: parseFloat((4.0 + Math.random() * 0.8).toFixed(1)),
      totalRatings: Math.floor(300 + Math.random() * 1000),
      deliveryTime: `${22 + Math.floor(Math.random() * 20)} min`,
      deliveryFee: Math.random() > 0.4 ? 30 + Math.floor(Math.random() * 30) : 0,
      minOrder: 150 + Math.floor(Math.random() * 150),
      costForTwo: 500 + Math.floor(Math.random() * 600),
      distance: (1.0 + Math.random() * 3).toFixed(1) + " km",
      address: "Noida, Uttar Pradesh",
      isPremium: i % 5 === 0 ? 1 : 0,
      offers: [`${10 + Math.floor(Math.random() * 20)}% OFF on first order`],
      isOpen: 1
    });
  }

  // Home & Kitchen - 15 vendors (matching listing.tsx)
  const home = ["HomeEssentials", "KitchenWorld", "HomeDecor", "LivingSpace", "KitchenHub", "HomeStyle", "DecorStore", "InteriorShop", "KitchenCraft", "HomeMart", "LivingStore", "HomeComfort", "KitchenPlus", "DecorNest", "HomeBliss"];
  for (let i = 0; i < 15; i++) {
    allVendors.push({
      id: `${600 + i + 1}`,
      name: home[i] + " Store",
      slug: home[i].toLowerCase(),
      cuisines: i % 3 === 0 ? ["Kitchen", "Home Decor"] : (i % 3 === 1 ? ["Furniture", "Decor"] : ["Appliances", "Home"]),
      rating: parseFloat((3.9 + Math.random() * 0.9).toFixed(1)),
      totalRatings: Math.floor(400 + Math.random() * 1200),
      deliveryTime: `${30 + Math.floor(Math.random() * 25)} min`,
      deliveryFee: Math.random() > 0.3 ? 40 + Math.floor(Math.random() * 40) : 0,
      minOrder: 250 + Math.floor(Math.random() * 250),
      costForTwo: 1000 + Math.floor(Math.random() * 1500),
      distance: (1.5 + Math.random() * 3).toFixed(1) + " km",
      address: "Noida, Uttar Pradesh",
      isPremium: i % 5 === 0 ? 1 : 0,
      offers: [`Flat ${10 + Math.floor(Math.random() * 20)}% OFF`],
      isOpen: Math.random() > 0.1 ? 1 : 0
    });
  }

  return allVendors;
};

const vendorProducts: Record<string, any[]> = generateProducts();
const allVendors = generateVendorData();

export default function FoodVendorDetail() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [, params] = useRoute("/delivery-now/:category/vendor/:id");
  const [selectedTab, setSelectedTab] = useUrlTab("menu");
  const [menuTab, setMenuTab] = useState<string>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Sector 18, Noida");
  const [locationSearch, setLocationSearch] = useState("");

  const vendorIdOrSlug = params?.id || "1";
  const vendor = allVendors.find(v => v.id === vendorIdOrSlug || v.slug === vendorIdOrSlug) || allVendors[0];

  const products = vendorProducts[vendor.id] || vendorProducts["1"];

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["all", "offers", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory === "offers") {
      filtered = filtered.filter(p => p.discount && p.discount > 0);
    } else if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const groupedProducts = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [productId, count]) => {
    const product = products.find(p => p.id === productId);
    return sum + (product?.price || 0) * count;
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-sm font-bold tracking-wider mt-1">{vendor.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/delivery-now/orders?category=${params?.category || "hotel-food"}`)}
              className="text-white/40 hover:text-white transition-colors"
              data-testid="button-orders"
            >
              <ClipboardList className="h-5 w-5" strokeWidth={1} />
            </button>
            <Sheet open={locationSheetOpen} onOpenChange={setLocationSheetOpen}>
              <SheetTrigger asChild>
                <button 
                  className="text-white/40 hover:text-white transition-colors"
                  data-testid="button-location"
                >
                  <MapPin className="h-5 w-5" strokeWidth={1} />
                </button>
              </SheetTrigger>
            <SheetContent side="bottom" className="bg-black text-white border-white/10 rounded-none">
              <SheetHeader>
                <SheetTitle className="text-white font-bold tracking-wide">SELECT LOCATION</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/30" strokeWidth={1} />
                  <Input
                    placeholder="Search for area, street, locality..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-none"
                    data-testid="input-location-search"
                  />
                  {locationSearch && (
                    <button
                      onClick={() => setLocationSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      data-testid="button-clear-location-search"
                    >
                      <X className="h-4 w-4" strokeWidth={1} />
                    </button>
                  )}
                </div>
                {locationSearch && (
                  <button
                    onClick={() => {
                      setSelectedLocation(locationSearch);
                      setLocationSheetOpen(false);
                      setLocationSearch("");
                    }}
                    className="w-full text-left px-4 py-3 border bg-white/5 border-white/20 text-white hover:bg-white/10 mb-3"
                    data-testid="button-use-searched-location"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" strokeWidth={1} />
                      <span className="text-sm font-semibold">Use "{locationSearch}"</span>
                    </div>
                  </button>
                )}
                <div className="space-y-3">
                  {[
                    "Sector 18, Noida",
                    "Sector 62, Noida",
                    "Sector 15, Noida",
                    "Greater Noida",
                    "Noida Extension"
                  ]
                    .filter((location) =>
                      location.toLowerCase().includes(locationSearch.toLowerCase())
                    )
                    .map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location);
                          setLocationSheetOpen(false);
                          setLocationSearch("");
                        }}
                        className={`w-full text-left px-4 py-3 border ${
                          selectedLocation === location
                            ? "bg-white text-black border-white"
                            : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                        }`}
                        data-testid={`button-location-${location.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" strokeWidth={1} />
                          <span className="text-sm font-semibold">{location}</span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 w-full max-w-screen-lg mx-auto">
        {/* Vendor Info */}
        <div className="px-4 py-6 border-b border-white/10">
          <div className="flex items-center gap-4 mb-4">
            {vendor.isPremium === 1 && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 rounded-none text-[10px] px-2 py-0.5 font-light tracking-widest">
                <Award className="h-2.5 w-2.5 mr-1" strokeWidth={1} />
                PREMIUM
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-4 w-4 fill-white text-white" strokeWidth={1} />
                <span className="text-lg font-bold">{vendor.rating}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-widest">{vendor.totalRatings} ratings</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-white/60" strokeWidth={1} />
                <span className="text-sm font-bold">{vendor.deliveryTime}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-widest">Delivery time</p>
            </div>
            <div className="border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-4 w-4 text-white/60" strokeWidth={1} />
                <span className="text-sm font-bold">{vendor.distance}</span>
              </div>
              <p className="text-[10px] text-white/40 font-light uppercase tracking-widest">Distance</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-white/60 font-light">
              <span className="uppercase tracking-widest text-[10px]">Cost for two</span>
              <span className="font-semibold">₹{vendor.costForTwo}</span>
            </div>
            <div className="flex items-center justify-between text-white/60 font-light">
              <span className="uppercase tracking-widest text-[10px]">Min order</span>
              <span className="font-semibold">₹{vendor.minOrder}</span>
            </div>
            <div className="flex items-center justify-between text-white/60 font-light">
              <span className="uppercase tracking-widest text-[10px]">Delivery fee</span>
              <span className="font-semibold">{vendor.deliveryFee === 0 ? "FREE" : `₹${vendor.deliveryFee}`}</span>
            </div>
          </div>

          {vendor.offers && vendor.offers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] text-white/60 font-light uppercase tracking-widest mb-2">Offers</p>
              <div className="space-y-2">
                {vendor.offers.map((offer: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Percent className="h-3 w-3 text-orange-400 shrink-0" strokeWidth={1} />
                    <span className="text-orange-300 font-light">{offer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="sticky top-20 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-4 pt-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
            <Input
              type="text"
              placeholder="SEARCH MENU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 placeholder:text-xs placeholder:tracking-widest placeholder:font-light focus:border-white/30 rounded-none h-10"
              data-testid="input-search-menu"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-none h-8 text-xs font-light tracking-widest ${
                  selectedCategory === cat
                    ? "bg-white text-black"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                }`}
                data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat === "all" ? "ALL" : cat.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6 space-y-6">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-sm font-bold tracking-wider uppercase mb-4 pb-2 border-b border-white/10">
                {category}
                <span className="ml-2 text-[10px] text-white/40 font-light">({items.length})</span>
              </h2>
              
              <div className="space-y-0">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="border-b border-white/10 pb-4 mb-4 last:border-0"
                    data-testid={`card-product-${product.id}`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1">
                          {product.isVeg === 1 ? (
                            <div className="w-4 h-4 border border-green-500 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-semibold">{product.name}</h3>
                              {product.isBestseller && (
                                <TrendingUp className="h-3 w-3 text-orange-400" strokeWidth={1} />
                              )}
                            </div>
                            <p className="text-xs text-white/50 font-light mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-bold">₹{product.price}</p>
                                {product.originalPrice && product.discount && (
                                  <>
                                    <p className="text-xs text-white/40 line-through">₹{product.originalPrice}</p>
                                    <Badge className="bg-green-500/90 text-white text-[9px] px-1.5 py-0 rounded-none font-bold h-4">
                                      {product.discount}% OFF
                                    </Badge>
                                  </>
                                )}
                              </div>
                              {product.rating && (
                                <div className="flex items-center gap-1 text-[10px] text-white/60">
                                  <Star className="h-3 w-3 fill-white/60" strokeWidth={1} />
                                  <span>{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <AnimatePresence mode="wait">
                          {cart[product.id] ? (
                            <motion.div 
                              key="quantity-controls"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-2"
                            >
                              <button 
                                onClick={() => removeFromCart(product.id)} 
                                data-testid={`button-decrement-${product.id}`}
                                className="text-white/80 hover:text-white"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1} />
                              </button>
                              <motion.span 
                                key={cart[product.id]}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                                className="text-white font-bold text-sm min-w-[24px] text-center" 
                                data-testid={`text-quantity-${product.id}`}
                              >
                                {cart[product.id]}
                              </motion.span>
                              <button 
                                onClick={() => addToCart(product.id)} 
                                data-testid={`button-increment-${product.id}`}
                                className="text-white/80 hover:text-white"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1} />
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="add-button"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="bg-white text-black hover:bg-white/90 rounded-none h-9 px-6 font-semibold tracking-wider"
                                data-testid={`button-add-${product.id}`}
                              >
                                ADD
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 border border-white/10 bg-white/5">
              <Search className="h-12 w-12 text-white/20 mx-auto mb-4" strokeWidth={1} />
              <p className="text-sm text-white/60 font-semibold mb-2">No items found</p>
              <p className="text-xs text-white/40 font-light">Try searching for something else</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 px-4 pb-4 z-50 bg-gradient-to-t from-black via-black to-transparent pt-6"
          >
            <div className="max-w-screen-lg mx-auto">
              <Button
                onClick={() => {
                  localStorage.setItem('deliveryCart', JSON.stringify({
                    vendorId: vendor.id,
                    vendorName: vendor.name,
                    category: params?.category || "hotel-food",
                    items: cart,
                    products: products,
                    type: 'hotel'
                  }));
                  navigate("/delivery-now/cart");
                }}
                className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none shadow-2xl border border-white/20"
                data-testid="button-view-cart"
              >
                <div className="flex items-center justify-between w-full px-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                    >
                      {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      key={cartTotal}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                    >
                      ₹{cartTotal}
                    </motion.span>
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" strokeWidth={1.5} />
                  </div>
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
