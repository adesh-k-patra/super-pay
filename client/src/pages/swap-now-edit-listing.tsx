import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swapNowListingFormSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SwapNowListing } from "@shared/schema";
import { ArrowLeft, Upload, X, Smartphone, Sofa, Car, Shirt, Book, Dumbbell, Home, Building2, MapPin, Shield, CheckCircle, Tag, FileText, Check, ArrowRight } from "lucide-react";
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
const fashionSubCategories = ["Men's Clothing", "Women's Clothing", "Footwear", "Accessories", "Watches"];
const realEstateTypes = ["Apartment", "Villa", "Plot", "Commercial", "Agricultural Land", "Residential Land"];

interface ListingStage {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const LISTING_STAGES: ListingStage[] = [
  { id: 'category', title: 'Category', shortTitle: 'Category', icon: Tag, description: 'Item category' },
  { id: 'details', title: 'Basic Information', shortTitle: 'Details', icon: FileText, description: 'Photos and description' },
  { id: 'pricing', title: 'Pricing & Location', shortTitle: 'Pricing', icon: MapPin, description: 'Price and location' },
  { id: 'review', title: 'Review & Update', shortTitle: 'Review', icon: CheckCircle, description: 'Review your changes' }
];

export default function SwapNowEditListing() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/swap-now/listings/:id/edit");
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const listingId = params?.id;

  const { data: listing, isLoading } = useQuery<SwapNowListing>({
    queryKey: ['/api/swap-now/listings', listingId],
    enabled: !!listingId,
  });

  const form = useForm<z.infer<typeof swapNowListingFormSchema>>({
    resolver: zodResolver(swapNowListingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "electronics",
      subCategory: "",
      condition: "good",
      price: 0,
      isNegotiable: 1,
      images: [],
      location: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (listing) {
      form.reset({
        title: listing.title,
        description: listing.description,
        category: listing.category as "electronics" | "furniture" | "vehicles" | "fashion" | "books" | "sports" | "home" | "real_estate_land" | "real_estate_rent" | "real_estate_buy" | "others",
        subCategory: listing.subCategory ?? "",
        condition: listing.condition as "new" | "like_new" | "good" | "fair" | "poor",
        price: parseFloat(listing.price),
        originalPrice: listing.originalPrice ? parseFloat(listing.originalPrice) : undefined,
        isNegotiable: listing.isNegotiable ?? 1,
        images: listing.images || [],
        location: listing.location,
        city: listing.city,
        state: listing.state ?? "",
        pincode: listing.pincode ?? "",
        brand: listing.brand || "",
        age: listing.age || "",
        warranty: listing.warranty || "",
        accessories: listing.accessories || "",
      });
      setImages(listing.images || []);
    }
  }, [listing, form]);

  const updateListingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof swapNowListingFormSchema>) => {
      return await apiRequest("PATCH", `/api/swap-now/listings/${listingId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your listing has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/listings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/my-listings'] });
      navigate(`/swap-now/listings/${listingId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (url && images.length < 5) {
      const newImages = [...images, url];
      setImages(newImages);
      form.setValue("images", newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue("images", newImages);
  };

  const handleNextStep = () => {
    if (step < 4) {
      let canProceed = false;
      
      if (step === 2) {
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
    updateListingMutation.mutate(data);
  };

  const getSubCategories = () => {
    const category = form.watch("category");
    switch (category) {
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

  if (isLoading || !listing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </div>
    );
  }

  const selectedCategory = form.watch("category");
  const isRealEstate = selectedCategory?.startsWith("real_estate");
  
  const canContinueToStep3 = () => {
    const values = form.getValues();
    return !!(values.title && values.description && images.length > 0);
  };

  const canContinueToStep4 = () => {
    const values = form.getValues();
    return !!(values.price > 0 && values.location && values.city && values.pincode);
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
              onClick={() => navigate(`/swap-now/listings/${listingId}`)}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">EDIT LISTING</h1>
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
      <div className="pt-48 px-4 space-y-6 w-full max-w-screen-lg mx-auto pb-40">
        {/* Listing Info Card */}
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = categories.find(c => c.value === selectedCategory)?.icon || Home;
              return <Icon className="h-5 w-5 text-white/60" />;
            })()}
            <div>
              <p className="text-white font-light text-sm">{listing.title}</p>
              <p className="text-white/60 text-xs">{categories.find(c => c.value === selectedCategory)?.label}</p>
            </div>
          </div>
        </div>

        {/* Stage Title */}
        <div className="space-y-2">
          <div className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <currentStage.icon className="h-3 w-3" />
            {currentStage.title}
          </div>
          <p className="text-xs text-white/40 font-light">{currentStage.description}</p>
        </div>

        {/* Step 2: Basic Info & Images */}
        {step === 2 && (
          <Form {...form}>
            <form className="space-y-6">
              {/* Images */}
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-4 w-4 text-white/60" />
                  <span className="text-xs text-white/60 uppercase tracking-widest font-light">Photos ({images.length}/5)</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover border border-white/10" />
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
                  {images.length < 5 && (
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

              {/* Basic Information */}
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-4">
                <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Basic Information</h3>
                
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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

              {/* Category-Specific Details */}
              {selectedCategory === "electronics" && (
                <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Electronics Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Brand</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., Apple, Samsung" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-brand" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Age</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-age">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/10 text-white">
                              {ageOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
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
                          <Input {...field} placeholder="E.g., 6 months, 1 year" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-warranty" />
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
                          <Input {...field} placeholder="E.g., Charger, Box, Case" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-accessories" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {selectedCategory === "vehicles" && (
                <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Vehicle Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Brand/Make</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., Royal Enfield" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-brand" />
                          </FormControl>
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
                <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-4">
                  <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Property Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">
                            {selectedCategory === "real_estate_land" ? "Land Area (sq ft)" : "Area (sq ft)"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="E.g., 1200" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-brand" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">
                            {selectedCategory === "real_estate_land" ? "Land Type" : "Property Age"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={selectedCategory === "real_estate_land" ? "E.g., Residential" : "E.g., 5 years"} className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-age" />
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
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Amenities/Features</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g., Parking, Security, Swimming Pool, Gym" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-accessories" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                
                <div className="grid grid-cols-2 gap-4">
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
                            className="bg-white/5 border-white/10 text-white rounded-none h-12" 
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
                          <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Original Price (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                              placeholder="Optional" 
                              className="bg-white/5 border-white/10 text-white rounded-none h-12" 
                              data-testid="input-original-price" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

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

              {/* Location */}
              <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl space-y-4">
                <h3 className="text-xs text-white/60 uppercase tracking-widest font-light">Location</h3>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Address/Area *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., MG Road, Near Metro Station" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">City *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-city" />
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
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">State</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="State" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-wider font-light">Pincode *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Pincode" className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="input-pincode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        )}

        {/* Step 4: Review & Update */}
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
                {step === 2 ? `${images.length} photo${images.length !== 1 ? 's' : ''} added` : step === 3 ? "Set price and location" : "Ready to update"}
              </p>
              <p className="text-sm text-white font-light">
                {categories.find(c => c.value === selectedCategory)?.label}
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
                form.handleSubmit(onSubmit)();
              } else {
                handleNextStep();
              }
            }}
            disabled={
              (step === 2 && !canContinueToStep3()) ||
              (step === 3 && !canContinueToStep4()) ||
              (step === 4 && updateListingMutation.isPending)
            }
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50"
            data-testid="button-next"
          >
            {step === 4 ? (
              updateListingMutation.isPending ? "UPDATING..." : "UPDATE LISTING"
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
