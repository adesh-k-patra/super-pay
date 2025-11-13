import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swapNowListingFormSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Smartphone, Sofa, Car, Shirt, Book, Dumbbell, Home, Building2, MapPin, Check, CheckCircle, Shield, ArrowRight, Tag, FileText, Image as ImageIcon, Star } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const categories = [
  { value: "electronics", label: "Electronics", icon: Smartphone },
  { value: "furniture", label: "Furniture", icon: Sofa },
  { value: "vehicles", label: "Vehicles", icon: Car },
  { value: "fashion", label: "Fashion", icon: Shirt },
  { value: "books", label: "Books", icon: Book },
  { value: "sports", label: "Sports & Fitness", icon: Dumbbell },
  { value: "home", label: "Home & Garden", icon: Home },
  { value: "real_estate_land", label: "Land for Sale", icon: MapPin },
  { value: "real_estate_rent", label: "Rent Home/Property", icon: Building2 },
  { value: "real_estate_buy", label: "Buy Home/Property", icon: Building2 },
  { value: "others", label: "Others", icon: Home },
];

const conditions = [
  { value: "new", label: "Brand New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const ageOptions = [
  { value: "< 6 months", label: "Less than 6 months" },
  { value: "6-12 months", label: "6-12 months" },
  { value: "1-2 years", label: "1-2 years" },
  { value: "2-5 years", label: "2-5 years" },
  { value: "> 5 years", label: "More than 5 years" },
];

const electronicsSubCategories = ["Mobile", "Laptop", "Tablet", "Camera", "TV", "Audio", "Gaming", "Accessories"];
const furnitureSubCategories = ["Sofa", "Bed", "Dining Table", "Wardrobe", "Desk", "Chair", "Storage"];
const vehiclesSubCategories = ["Bike", "Scooter", "Car", "Bicycle", "Electric Vehicle"];
const fashionSubCategories = ["Men's Clothing", "Women's Clothing", "Footwear", "Watches", "Accessories", "Bags"];

// Subcategory-specific field configurations
const SUBCATEGORY_FIELDS: Record<string, any> = {
  // ELECTRONICS
  "Mobile": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Apple, Samsung, OnePlus" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., iPhone 14 Pro, Galaxy S23" },
      { name: "storage", label: "Storage", type: "select", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
      { name: "ram", label: "RAM", type: "select", options: ["4GB", "6GB", "8GB", "12GB", "16GB"] },
      { name: "battery", label: "Battery Health", type: "text", placeholder: "E.g., 85%, Good" },
      { name: "accessories", label: "Accessories", type: "text", placeholder: "E.g., Charger, Box, Earphones" },
      { name: "boxAvailability", label: "Box Available", type: "select", options: ["Yes", "No"] },
      { name: "warranty", label: "Warranty", type: "text", placeholder: "E.g., 6 months remaining" },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  "Laptop": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Dell, HP, MacBook" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., XPS 13, MacBook Pro" },
      { name: "processor", label: "Processor", type: "text", placeholder: "E.g., Intel i7, M2" },
      { name: "ram", label: "RAM", type: "select", options: ["4GB", "8GB", "16GB", "32GB", "64GB"] },
      { name: "storage", label: "Storage", type: "text", placeholder: "E.g., 512GB SSD" },
      { name: "graphics", label: "Graphics Card", type: "text", placeholder: "E.g., NVIDIA RTX 3060" },
      { name: "screenSize", label: "Screen Size", type: "text", placeholder: "E.g., 15.6 inch" },
      { name: "boxAvailability", label: "Box Available", type: "select", options: ["Yes", "No"] },
      { name: "warranty", label: "Warranty", type: "text", placeholder: "E.g., 1 year remaining" },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  "Camera": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Canon, Nikon, Sony" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., EOS R5, A7 III" },
      { name: "cameraType", label: "Type", type: "select", options: ["DSLR", "Mirrorless", "Point & Shoot", "Action Camera"] },
      { name: "megapixels", label: "Megapixels", type: "text", placeholder: "E.g., 24MP, 45MP" },
      { name: "lens", label: "Lens Included", type: "text", placeholder: "E.g., 24-70mm f/2.8" },
      { name: "shutterCount", label: "Shutter Count", type: "text", placeholder: "E.g., 5000 clicks" },
      { name: "accessories", label: "Accessories", type: "text", placeholder: "E.g., Bag, Memory card, Extra battery" },
      { name: "boxAvailability", label: "Box Available", type: "select", options: ["Yes", "No"] },
      { name: "warranty", label: "Warranty", type: "text", placeholder: "E.g., 1 year remaining" },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  
  // FASHION
  "Watches": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Rolex, Casio, Titan" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., Submariner, G-Shock" },
      { name: "strapType", label: "Strap Type", type: "select", options: ["Metal", "Leather", "Rubber", "Fabric", "Ceramic"] },
      { name: "dialType", label: "Dial Type", type: "select", options: ["Analog", "Digital", "Analog-Digital", "Smartwatch"] },
      { name: "dialColor", label: "Dial Color", type: "text", placeholder: "E.g., Black, Silver, Blue" },
      { name: "waterResistance", label: "Water Resistance", type: "text", placeholder: "E.g., 50m, 100m, Not water resistant" },
      { name: "boxAvailability", label: "Box Available", type: "select", options: ["Yes", "No"] },
      { name: "warranty", label: "Warranty", type: "text", placeholder: "E.g., 6 months remaining" },
      { name: "documents", label: "Documents", type: "select", options: ["Bill Available", "No Bill", "Warranty Card Available"] },
    ]
  },
  "Footwear": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Nike, Adidas, Puma" },
      { name: "size", label: "Size", type: "text", placeholder: "E.g., UK 9, US 10, EU 42" },
      { name: "shoeType", label: "Type", type: "select", options: ["Sneakers", "Running Shoes", "Formal Shoes", "Casual Shoes", "Sports Shoes", "Sandals", "Boots"] },
      { name: "color", label: "Color", type: "text", placeholder: "E.g., Black, White, Blue" },
      { name: "material", label: "Material", type: "select", options: ["Leather", "Synthetic", "Canvas", "Mesh", "Suede"] },
      { name: "boxAvailability", label: "Box Available", type: "select", options: ["Yes", "No"] },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  "Men's Clothing": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Zara, H&M, Nike" },
      { name: "clothingType", label: "Type", type: "select", options: ["Shirt", "T-Shirt", "Jeans", "Trousers", "Jacket", "Sweater", "Suit", "Ethnic Wear"] },
      { name: "size", label: "Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
      { name: "color", label: "Color", type: "text", placeholder: "E.g., Black, Blue, White" },
      { name: "material", label: "Material", type: "text", placeholder: "E.g., Cotton, Denim, Wool" },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  "Women's Clothing": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Zara, H&M, Forever 21" },
      { name: "clothingType", label: "Type", type: "select", options: ["Dress", "Top", "Jeans", "Skirt", "Kurti", "Saree", "Lehenga", "Jacket"] },
      { name: "size", label: "Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL"] },
      { name: "color", label: "Color", type: "text", placeholder: "E.g., Black, Red, Blue" },
      { name: "material", label: "Material", type: "text", placeholder: "E.g., Cotton, Silk, Polyester" },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  "Bags": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Louis Vuitton, Gucci, Nike" },
      { name: "bagType", label: "Type", type: "select", options: ["Backpack", "Handbag", "Sling Bag", "Laptop Bag", "Travel Bag", "Clutch", "Tote Bag"] },
      { name: "material", label: "Material", type: "select", options: ["Leather", "Synthetic Leather", "Canvas", "Nylon", "Polyester"] },
      { name: "color", label: "Color", type: "text", placeholder: "E.g., Black, Brown, Beige" },
      { name: "boxAvailability", label: "Box/Dust Bag Available", type: "select", options: ["Yes", "No"] },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  
  // VEHICLES
  "Bike": {
    fields: [
      { name: "brand", label: "Brand/Make", type: "text", placeholder: "E.g., Honda, Royal Enfield, Yamaha" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., Activa, Classic 350, R15" },
      { name: "year", label: "Year", type: "text", placeholder: "E.g., 2021" },
      { name: "engineCapacity", label: "Engine Capacity", type: "text", placeholder: "E.g., 350cc, 125cc" },
      { name: "kmDriven", label: "KM Driven", type: "text", placeholder: "E.g., 15000 km" },
      { name: "ownership", label: "Ownership", type: "select", options: ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"] },
      { name: "insurance", label: "Insurance", type: "select", options: ["Valid", "Expired", "Not Available"] },
      { name: "documents", label: "Documents", type: "select", options: ["All Papers Clear", "RC Available", "Insurance Valid", "NOC Available"] },
    ]
  },
  "Scooter": {
    fields: [
      { name: "brand", label: "Brand/Make", type: "text", placeholder: "E.g., Honda Activa, TVS Jupiter" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., Activa 6G, Jupiter 125" },
      { name: "year", label: "Year", type: "text", placeholder: "E.g., 2022" },
      { name: "engineCapacity", label: "Engine Capacity", type: "text", placeholder: "E.g., 110cc, 125cc" },
      { name: "kmDriven", label: "KM Driven", type: "text", placeholder: "E.g., 8000 km" },
      { name: "ownership", label: "Ownership", type: "select", options: ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"] },
      { name: "insurance", label: "Insurance", type: "select", options: ["Valid", "Expired", "Not Available"] },
      { name: "documents", label: "Documents", type: "select", options: ["All Papers Clear", "RC Available", "Insurance Valid"] },
    ]
  },
  "Car": {
    fields: [
      { name: "brand", label: "Brand/Make", type: "text", placeholder: "E.g., Maruti Suzuki, Hyundai, Honda" },
      { name: "model", label: "Model", type: "text", placeholder: "E.g., Swift, i20, City" },
      { name: "year", label: "Year", type: "text", placeholder: "E.g., 2020" },
      { name: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
      { name: "kmDriven", label: "KM Driven", type: "text", placeholder: "E.g., 45000 km" },
      { name: "ownership", label: "Ownership", type: "select", options: ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"] },
      { name: "transmission", label: "Transmission", type: "select", options: ["Manual", "Automatic", "AMT", "CVT", "DCT"] },
      { name: "seatingCapacity", label: "Seating Capacity", type: "select", options: ["2", "4", "5", "7", "8+"] },
      { name: "insurance", label: "Insurance", type: "select", options: ["Valid", "Expired", "Not Available"] },
      { name: "documents", label: "Documents", type: "select", options: ["All Papers Clear", "RC Available", "Insurance Valid", "NOC Available"] },
    ]
  },
  "Bicycle": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., Hero, Firefox, Trek" },
      { name: "bicycleType", label: "Type", type: "select", options: ["Mountain Bike", "Road Bike", "Hybrid", "BMX", "Electric Bike", "Kids Bike"] },
      { name: "gears", label: "Gears", type: "text", placeholder: "E.g., 21-speed, Single speed" },
      { name: "frameSize", label: "Frame Size", type: "text", placeholder: "E.g., 26 inch, 29 inch" },
      { name: "frameMaterial", label: "Frame Material", type: "select", options: ["Steel", "Aluminum", "Carbon Fiber", "Alloy"] },
      { name: "accessories", label: "Accessories", type: "text", placeholder: "E.g., Helmet, Lock, Lights" },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  
  // FURNITURE
  "Sofa": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., IKEA, Urban Ladder, Godrej" },
      { name: "sofaType", label: "Type", type: "select", options: ["2-Seater", "3-Seater", "5-Seater", "L-Shaped", "Recliner", "Sofa Bed"] },
      { name: "material", label: "Material", type: "select", options: ["Leather", "Fabric", "Velvet", "Rexine", "Wooden"] },
      { name: "color", label: "Color", type: "text", placeholder: "E.g., Brown, Gray, Beige" },
      { name: "dimensions", label: "Dimensions", type: "text", placeholder: "E.g., 6ft x 3ft" },
      { name: "assembly", label: "Assembly Required", type: "select", options: ["Yes", "No", "Already Assembled"] },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
  "Bed": {
    fields: [
      { name: "brand", label: "Brand", type: "text", placeholder: "E.g., IKEA, Durian, Pepperfry" },
      { name: "bedSize", label: "Size", type: "select", options: ["Single", "Double", "Queen", "King"] },
      { name: "material", label: "Material", type: "select", options: ["Wood", "Metal", "Upholstered", "Engineered Wood"] },
      { name: "mattressIncluded", label: "Mattress Included", type: "select", options: ["Yes", "No"] },
      { name: "storage", label: "Storage", type: "select", options: ["With Storage", "Without Storage"] },
      { name: "documents", label: "Bill Available", type: "select", options: ["Yes", "No"] },
    ]
  },
};
const realEstateTypes = ["Apartment", "Villa", "Plot", "Commercial", "Agricultural Land", "Residential Land"];

interface ListingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const LISTING_STAGES: ListingStage[] = [
  { id: 'category', title: 'Select Category', shortTitle: 'Category', icon: Tag, description: 'Choose item category' },
  { id: 'details', title: 'Basic Information', shortTitle: 'Details', icon: FileText, description: 'Add photos and description' },
  { id: 'pricing', title: 'Pricing & Location', shortTitle: 'Pricing', icon: MapPin, description: 'Set price and location' },
  { id: 'review', title: 'Review & Publish', shortTitle: 'Review', icon: CheckCircle, description: 'Review your listing' }
];

const POPULAR_BRANDS: Record<string, string[]> = {
  electronics: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Oppo", "Vivo", "Sony", "LG", "Dell", "HP", "Lenovo", "Asus", "Acer", "Canon", "Nikon", "JBL", "Boat", "Bose"],
  vehicles: ["Honda", "Hero", "Bajaj", "TVS", "Royal Enfield", "Yamaha", "Suzuki", "KTM", "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Ford"],
  furniture: ["IKEA", "Godrej", "Durian", "Urban Ladder", "Pepperfry", "Nilkamal", "Custom/Local"],
  fashion: ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levis", "Woodland", "Custom"],
};

export default function SwapNowNewListing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string>>({});

  const form = useForm<z.infer<typeof swapNowListingFormSchema>>({
    resolver: zodResolver(swapNowListingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "electronics",
      subCategory: "",
      condition: "good",
      price: 0,
      originalPrice: undefined,
      isNegotiable: 1,
      images: [],
      coverImageIndex: 0,
      location: "",
      city: "",
      state: "",
      pincode: "",
      brand: "",
      age: "",
      warranty: "",
      accessories: "",
      totalSquareFeet: "",
      usableSquareFeet: "",
      facilities: [],
      nearbyLocations: "",
      furnishingLevel: "",
      usageLevel: "",
      productUsageLevel: "",
      buyDate: "",
      billAvailability: "",
      issues: "",
      attributes: {},
    },
  });

  // Watch form values for reactive validation
  const watchedValues = form.watch();

  const createListingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof swapNowListingFormSchema>) => {
      console.log("Sending listing data to API:", data);
      return await apiRequest("POST", "/api/swap-now/listings", data);
    },
    onSuccess: () => {
      console.log("Listing created successfully!");
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/my-listings'] });
      navigate("/swap-now/listing-success");
    },
    onError: (error: any) => {
      console.error("Error creating listing:", error);
      const errorMessage = error?.message || "Failed to create listing. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = 10 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => {
          const newImages = [...prev, result];
          form.setValue("images", newImages);
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    });

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue("images", newImages);
    
    if (coverImageIndex === index) {
      setCoverImageIndex(0);
      form.setValue("coverImageIndex", 0);
    } else if (coverImageIndex > index) {
      const newCoverIndex = coverImageIndex - 1;
      setCoverImageIndex(newCoverIndex);
      form.setValue("coverImageIndex", newCoverIndex);
    }
  };

  const handleSetCoverImage = (index: number) => {
    setCoverImageIndex(index);
    form.setValue("coverImageIndex", index);
  };

  const handleBrandSelect = (brand: string) => {
    form.setValue("brand", brand);
    setBrandSearch(brand);
    setShowBrandSuggestions(false);
  };

  const handleCategorySelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    form.setValue("category", categoryValue as "electronics" | "furniture" | "vehicles" | "fashion" | "books" | "sports" | "home" | "real_estate_land" | "real_estate_rent" | "real_estate_buy" | "others");
    
    if (categoryValue.startsWith("real_estate")) {
      form.setValue("condition", "good");
    }
    
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    setStep(2);
  };

  const handleNextStep = () => {
    if (step < 4) {
      let canProceed = false;
      
      if (step === 1) {
        canProceed = selectedCategory !== "";
      } else if (step === 2) {
        canProceed = canContinueToStep3();
      } else if (step === 3) {
        canProceed = canContinueToStep4();
      }
      
      if (canProceed) {
        if (!completedSteps.includes(step)) {
          setCompletedSteps([...completedSteps, step]);
        }
        setStep(step + 1);
      }
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const isAccessible = completedSteps.includes(stepIndex + 1) || stepIndex + 1 <= step;
    if (isAccessible && stepIndex + 1 <= step) {
      setStep(stepIndex + 1);
    }
  };

  const onSubmit = (data: z.infer<typeof swapNowListingFormSchema>) => {
    const submissionData = {
      ...data,
      attributes: dynamicFieldValues,
    };
    console.log("Form submitted with data:", submissionData);
    createListingMutation.mutate(submissionData);
  };

  const getSubCategories = () => {
    switch (selectedCategory) {
      case "electronics": return electronicsSubCategories;
      case "furniture": return furnitureSubCategories;
      case "vehicles": return vehiclesSubCategories;
      case "fashion": return fashionSubCategories;
      case "real_estate_land":
      case "real_estate_rent":
      case "real_estate_buy":
        return realEstateTypes;
      default: return [];
    }
  };

  const isRealEstate = selectedCategory?.startsWith("real_estate");

  // Reactive validation functions using watched values
  const canContinueToStep3 = () => {
    return !!(
      watchedValues.title?.trim() && 
      watchedValues.description?.trim() && 
      images.length > 0
    );
  };

  const canContinueToStep4 = () => {
    return !!(
      watchedValues.price > 0 && 
      watchedValues.location?.trim() && 
      watchedValues.city?.trim() && 
      watchedValues.pincode?.trim()
    );
  };

  const currentStage = LISTING_STAGES[step - 1];
  const progressPercentage = (step / LISTING_STAGES.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - UPI Payment Style */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => step === 1 ? navigate("/swap-now/explore") : setStep(step - 1)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">CREATE LISTING</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Swap Now Marketplace</p>
            </div>

            <Badge className="bg-black border border-white/30 text-white rounded-none">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          {/* Progress Section - UPI Payment Style */}
          <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs uppercase tracking-widest font-light">Listing Progress</span>
              <span className="text-white font-light text-xs tracking-wider">
                Step {step} of {LISTING_STAGES.length}
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-1 mb-4">
              <div 
                className="bg-white h-1 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Stage Tracker - UPI Payment Style */}
            <div className="flex items-center justify-between">
              {LISTING_STAGES.map((stage, index) => {
                const isCompleted = completedSteps.includes(index + 1);
                const isCurrent = index === step - 1;
                const isAccessible = isCompleted || index + 1 < step;
                
                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div
                      onClick={() => handleStepClick(index)}
                      className={`w-8 h-8 border-b-2 flex items-center justify-center text-xs font-light transition-all duration-200 ${
                        isCompleted 
                          ? 'border-white bg-white/5 text-white cursor-pointer' 
                          : isCurrent 
                            ? 'border-white bg-white/5 text-white' 
                            : isAccessible
                              ? 'border-white/20 bg-transparent text-white/60 cursor-pointer hover:bg-white/5'
                              : 'border-white/10 bg-transparent text-white/30'
                      }`}
                      data-testid={`stage-${stage.id}`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`text-[10px] mt-2 text-center transition-colors uppercase tracking-wider font-light ${
                      isCurrent ? 'text-white' : 'text-white/40'
                    }`}>
                      {stage.shortTitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-56 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Stage Title */}
        <div className="space-y-2">
          <div className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <currentStage.icon className="h-3 w-3" />
            {currentStage.title}
          </div>
          <p className="text-xs text-white/40 font-light">{currentStage.description}</p>
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat.value)}
                    className="border border-white/10 bg-white/5 p-4 hover:border-white/30 hover:bg-white/10 transition-all group backdrop-blur-sm"
                    data-testid={`button-category-${cat.value}`}
                  >
                    <Icon className="h-7 w-7 text-white/70 group-hover:text-white mb-2 mx-auto" strokeWidth={1.5} />
                    <div className="text-xs font-light text-center text-white/80">{cat.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info & Images */}
        {step === 2 && (
          <Form {...form}>
            <form className="space-y-6">
              {/* Selected Category Display */}
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = categories.find(c => c.value === selectedCategory)?.icon || Home;
                      return <Icon className="h-5 w-5 text-white/60" />;
                    })()}
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Category</p>
                      <p className="font-light">{categories.find(c => c.value === selectedCategory)?.label}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-white/60 hover:text-white bg-transparent hover:bg-white/10 h-8 rounded-none"
                    data-testid="button-change-category"
                  >
                    Change
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-white/60" />
                    <span className="text-xs text-white/60 uppercase tracking-widest font-light">Photos ({images.length}/10)</span>
                  </div>
                  {images.length > 0 && (
                    <span className="text-xs text-white/40">Tap star to set cover</span>
                  )}
                </div>
                <p className="text-sm text-white/40 font-light mb-4">Add at least one photo of your item</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                
                <div className="grid grid-cols-3 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover border border-white/10" />
                      
                      {coverImageIndex === index && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 text-xs font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Cover
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {coverImageIndex !== index && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(index)}
                            className="bg-white text-black px-3 py-1.5 text-xs hover:bg-white/90 flex items-center gap-1"
                            data-testid={`button-set-cover-${index}`}
                          >
                            <Star className="h-3 w-3" />
                            Set Cover
                          </button>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-black/80 p-1.5 hover:bg-black border border-white/20 rounded-sm"
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="aspect-square border border-dashed border-white/20 flex flex-col items-center justify-center hover:bg-white/5 gap-2"
                      data-testid="button-add-image"
                    >
                      <Upload className="h-6 w-6 text-white/40" />
                      <span className="text-xs text-white/40">Add Photo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description - Cardless */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder={isRealEstate ? "E.g., 3BHK Apartment in Prime Location" : "E.g., iPhone 13 Pro Max 256GB"} 
                          className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                          data-testid="input-title" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder={isRealEstate ? "Describe the property details, amenities, nearby facilities..." : "Describe your item in detail, condition, reason for selling..."} 
                          className="bg-white/5 border-white/10 text-white rounded-none min-h-[120px]" 
                          data-testid="input-description" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {getSubCategories().length > 0 && (
                  <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">
                          {isRealEstate ? "Property Type" : "Sub Category"}
                        </FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSubCategory(value);
                          setDynamicFieldValues({});
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-subcategory">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-white/10 text-white">
                            {getSubCategories().map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!isRealEstate && (
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Condition *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-condition">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-white/10 text-white">
                            {conditions.map((cond) => (
                              <SelectItem key={cond.value} value={cond.value}>
                                {cond.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Dynamic Subcategory-Specific Fields */}
              {selectedSubCategory && SUBCATEGORY_FIELDS[selectedSubCategory] && (
                <div className="space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light flex items-center gap-2">
                    <Star className="h-3 w-3" />
                    {selectedSubCategory} Specific Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {SUBCATEGORY_FIELDS[selectedSubCategory].fields.map((fieldConfig: any) => (
                      <div key={fieldConfig.name} className={fieldConfig.type === "textarea" ? "col-span-2" : ""}>
                        {fieldConfig.type === "text" ? (
                          <div>
                            <label className="text-xs text-white/60 uppercase tracking-wider font-light block mb-2">
                              {fieldConfig.label}
                            </label>
                            <Input 
                              value={dynamicFieldValues[fieldConfig.name] || ""}
                              onChange={(e) => setDynamicFieldValues({ ...dynamicFieldValues, [fieldConfig.name]: e.target.value })}
                              placeholder={fieldConfig.placeholder}
                              className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                              data-testid={`input-${fieldConfig.name}`}
                            />
                          </div>
                        ) : fieldConfig.type === "select" ? (
                          <div>
                            <label className="text-xs text-white/60 uppercase tracking-wider font-light block mb-2">
                              {fieldConfig.label}
                            </label>
                            <Select 
                              value={dynamicFieldValues[fieldConfig.name] || ""}
                              onValueChange={(value) => setDynamicFieldValues({ ...dynamicFieldValues, [fieldConfig.name]: value })}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid={`select-${fieldConfig.name}`}>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-white/10 text-white">
                                {fieldConfig.options.map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category-Specific Details - Cardless */}
              {selectedCategory === "electronics" && (
                <div className="space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Electronics Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Brand</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Search or enter brand name..." 
                                className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                                data-testid="input-brand"
                                value={brandSearch || field.value}
                                onChange={(e) => {
                                  setBrandSearch(e.target.value);
                                  field.onChange(e.target.value);
                                  setShowBrandSuggestions(true);
                                }}
                                onFocus={() => setShowBrandSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                              />
                            </FormControl>
                            {showBrandSuggestions && brandSearch && POPULAR_BRANDS[selectedCategory] && (
                              <div className="absolute z-10 w-full mt-1 bg-black border border-white/20 max-h-48 overflow-y-auto shadow-xl">
                                {POPULAR_BRANDS[selectedCategory]
                                  .filter(brand => brand.toLowerCase().includes(brandSearch.toLowerCase()))
                                  .slice(0, 8)
                                  .map((brand) => (
                                    <button
                                      key={brand}
                                      type="button"
                                      onClick={() => handleBrandSelect(brand)}
                                      className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                      data-testid={`button-brand-${brand}`}
                                    >
                                      {brand}
                                    </button>
                                  ))}
                                {POPULAR_BRANDS[selectedCategory].filter(brand => 
                                  brand.toLowerCase().includes(brandSearch.toLowerCase())
                                ).length === 0 && (
                                  <div className="px-4 py-3 text-sm text-white/40">
                                    No matches. Press Enter to use "{brandSearch}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productUsageLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Product Usage Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-product-usage">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10 text-white">
                              <SelectItem value="brand_new">Brand New</SelectItem>
                              <SelectItem value="unused">Unused</SelectItem>
                              <SelectItem value="semi_used">Semi-used</SelectItem>
                              <SelectItem value="heavy_used">Heavy Used</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buyDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Buy Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-buy-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billAvailability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Bill Available</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-bill-availability">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10 text-white">
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="warranty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Warranty</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g., 6 months remaining" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-warranty" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accessories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Accessories Included</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g., Charger, Box, Earphones" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-accessories" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Issues (if any)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Mention any defects, scratches, or problems..." className="bg-white/5 border-white/10 text-white rounded-none min-h-[80px]" data-testid="input-issues" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {selectedCategory === "vehicles" && (
                <div className="space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Vehicle Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Brand/Make</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Search or enter brand..." 
                                className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                                data-testid="input-brand"
                                value={brandSearch || field.value}
                                onChange={(e) => {
                                  setBrandSearch(e.target.value);
                                  field.onChange(e.target.value);
                                  setShowBrandSuggestions(true);
                                }}
                                onFocus={() => setShowBrandSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                              />
                            </FormControl>
                            {showBrandSuggestions && brandSearch && POPULAR_BRANDS[selectedCategory] && (
                              <div className="absolute z-10 w-full mt-1 bg-black border border-white/20 max-h-48 overflow-y-auto shadow-xl">
                                {POPULAR_BRANDS[selectedCategory]
                                  .filter(brand => brand.toLowerCase().includes(brandSearch.toLowerCase()))
                                  .slice(0, 8)
                                  .map((brand) => (
                                    <button
                                      key={brand}
                                      type="button"
                                      onClick={() => handleBrandSelect(brand)}
                                      className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                      data-testid={`button-brand-${brand}`}
                                    >
                                      {brand}
                                    </button>
                                  ))}
                                {POPULAR_BRANDS[selectedCategory].filter(brand => 
                                  brand.toLowerCase().includes(brandSearch.toLowerCase())
                                ).length === 0 && (
                                  <div className="px-4 py-3 text-sm text-white/40">
                                    No matches. Press Enter to use "{brandSearch}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Age/Year</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., 2021" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-age" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="accessories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Additional Info</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g., KM driven, ownership, accessories" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-accessories" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {isRealEstate && (
                <div className="space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Property Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalSquareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Total Square Feet</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., 1500" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-total-sqft" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usableSquareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Usable Square Feet</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., 1200" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-usable-sqft" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="facilities"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light mb-3 block">Facilities</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "two_wheel_parking", label: "Two Wheeler Parking" },
                            { id: "four_wheel_parking", label: "Four Wheeler Parking" },
                            { id: "balcony", label: "Balcony" },
                            { id: "gym", label: "Gym" },
                            { id: "swimming_pool", label: "Swimming Pool" },
                            { id: "security", label: "Security/Gated" },
                            { id: "power_backup", label: "Power Backup" },
                            { id: "elevator", label: "Elevator" },
                          ].map((facility) => (
                            <FormField
                              key={facility.id}
                              control={form.control}
                              name="facilities"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(facility.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        field.onChange(
                                          checked
                                            ? [...current, facility.id]
                                            : current.filter((val) => val !== facility.id)
                                        );
                                      }}
                                      className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                      data-testid={`checkbox-facility-${facility.id}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm text-white/80 font-light cursor-pointer">
                                    {facility.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nearbyLocations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Nearby Locations</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="E.g., Metro station 500m, School 1km, Hospital 2km, Shopping mall..." className="bg-white/5 border-white/10 text-white rounded-none min-h-[80px]" data-testid="input-nearby-locations" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="furnishingLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Furnishing Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-furnishing">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10 text-white">
                              <SelectItem value="furnished">Furnished</SelectItem>
                              <SelectItem value="semi_furnished">Semi-furnished</SelectItem>
                              <SelectItem value="unfurnished">Unfurnished</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usageLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Usage Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-usage">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10 text-white">
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="semi_used">Semi-used</SelectItem>
                              <SelectItem value="well_used">Well Used</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
        )}

        {/* Step 3: Pricing & Location */}
        {step === 3 && (
          <Form {...form}>
            <form className="space-y-6">
              {/* Pricing */}
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-4">
                <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Pricing</h3>
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">
                        {isRealEstate ? (selectedCategory === "real_estate_rent" ? "Rent per Month (₹) *" : "Price (₹) *") : "Selling Price (₹) *"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                          placeholder="0" 
                          className="bg-white/5 border-white/10 text-white rounded-none h-12 text-lg" 
                          data-testid="input-price" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isRealEstate && (
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Original Price (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                            value={field.value || ""} 
                            placeholder="0" 
                            className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                            data-testid="input-original-price" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="isNegotiable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light mb-3 block">Negotiation</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => field.onChange(1)}
                          className={cn(
                            "border p-4 transition-all text-left",
                            field.value === 1 
                              ? "border-white bg-white/10" 
                              : "border-white/10 bg-white/5 hover:border-white/30"
                          )}
                          data-testid="button-negotiable-yes"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-light">Negotiable</span>
                            {field.value === 1 && <Check className="h-4 w-4" />}
                          </div>
                          <p className="text-xs text-white/60">Price can be discussed</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange(0)}
                          className={cn(
                            "border p-4 transition-all text-left",
                            field.value === 0 
                              ? "border-white bg-white/10" 
                              : "border-white/10 bg-white/5 hover:border-white/30"
                          )}
                          data-testid="button-negotiable-no"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-light">Fixed Price</span>
                            {field.value === 0 && <Check className="h-4 w-4" />}
                          </div>
                          <p className="text-xs text-white/60">Price is final</p>
                        </button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Location - Cardless */}
              <div className="space-y-4">
                <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Location</h3>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Address/Locality *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., Koramangala, Bangalore" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">City *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g., Bangalore" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">State *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g., Karnataka" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Pincode *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., 560034" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-pincode" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}

        {/* Step 4: Review & Publish */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Listing Summary */}
            <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
              <h3 className="text-xs text-white/60 uppercase tracking-widest font-light mb-4">Listing Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Title</p>
                  <p className="text-white font-light">{form.getValues().title || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-white font-light">{categories.find(c => c.value === selectedCategory)?.label}</p>
                </div>
                
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Price</p>
                  <p className="text-white font-light text-xl">₹{form.getValues().price.toLocaleString()}</p>
                  {form.getValues().isNegotiable === 1 && (
                    <p className="text-xs text-white/60">Negotiable</p>
                  )}
                </div>
                
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-white font-light">{form.getValues().city}, {form.getValues().state}</p>
                </div>

                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Photos</p>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {images.map((url, index) => (
                      <img key={index} src={url} alt={`Preview ${index + 1}`} className="w-full aspect-square object-cover border border-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Navigation Footer - UPI Payment Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-light uppercase tracking-wider">
                {step === 1 ? "Select category" : step === 2 ? `${images.length} photo${images.length !== 1 ? 's' : ''} added` : step === 3 ? "Set price and location" : "Ready to publish"}
              </p>
              <p className="text-sm text-white font-light">
                {selectedCategory && categories.find(c => c.value === selectedCategory)?.label}
              </p>
            </div>
            {form.getValues().price > 0 && (
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-widest font-light">Price</p>
                <p className="text-xl font-light text-white">₹{form.getValues().price.toLocaleString()}</p>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              if (step === 4) {
                console.log("Attempting to submit form...");
                console.log("Form errors:", form.formState.errors);
                console.log("Form values:", form.getValues());
                form.handleSubmit(
                  onSubmit,
                  (errors) => {
                    console.error("Form validation failed:", errors);
                    const errorFields = Object.keys(errors).map(field => {
                      const message = errors[field as keyof typeof errors]?.message;
                      return message ? `${field}: ${message}` : field;
                    });
                    toast({
                      title: "Validation Error",
                      description: errorFields.length > 0 
                        ? errorFields.join(", ") 
                        : "Please check all required fields are filled correctly.",
                      variant: "destructive",
                    });
                  }
                )();
              } else {
                handleNextStep();
              }
            }}
            disabled={
              (step === 1 && !selectedCategory) ||
              (step === 2 && !canContinueToStep3()) ||
              (step === 3 && !canContinueToStep4()) ||
              (step === 4 && createListingMutation.isPending)
            }
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50"
            data-testid="button-next"
          >
            {step === 4 ? (
              createListingMutation.isPending ? "PUBLISHING..." : "PUBLISH LISTING"
            ) : (
              <>
                NEXT
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
