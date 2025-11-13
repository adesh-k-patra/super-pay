// Centralized data module for Delivery Now with images
import foodImage1 from '@assets/stock_images/indian_food_butter_c_2b560b7a.jpg';
import foodImage2 from '@assets/stock_images/indian_food_butter_c_852d4a6a.jpg';
import foodImage3 from '@assets/stock_images/indian_food_butter_c_981bab2c.jpg';
import foodImage4 from '@assets/stock_images/indian_food_butter_c_c0ef2e3b.jpg';
import foodImage5 from '@assets/stock_images/indian_food_butter_c_4bc4a992.jpg';

import groceryImage1 from '@assets/stock_images/grocery_store_fresh__959e0c3f.jpg';
import groceryImage2 from '@assets/stock_images/grocery_store_fresh__26c84fa0.jpg';
import groceryImage3 from '@assets/stock_images/grocery_store_fresh__5656fd50.jpg';
import groceryImage4 from '@assets/stock_images/grocery_store_fresh__9426173b.jpg';
import groceryImage5 from '@assets/stock_images/grocery_store_fresh__a627d3f4.jpg';

import medicineImage1 from '@assets/stock_images/pharmacy_medicine_pi_d6dd89fd.jpg';
import medicineImage2 from '@assets/stock_images/pharmacy_medicine_pi_62f0e405.jpg';
import medicineImage3 from '@assets/stock_images/pharmacy_medicine_pi_7356dd9a.jpg';
import medicineImage4 from '@assets/stock_images/pharmacy_medicine_pi_4a011ce8.jpg';
import medicineImage5 from '@assets/stock_images/pharmacy_medicine_pi_7fa303eb.jpg';

import electronicsImage1 from '@assets/stock_images/electronics_gadgets__bef723fc.jpg';
import electronicsImage2 from '@assets/stock_images/electronics_gadgets__c2fb8ea0.jpg';
import electronicsImage3 from '@assets/stock_images/electronics_gadgets__014701a5.jpg';
import electronicsImage4 from '@assets/stock_images/electronics_gadgets__1c110a05.jpg';
import electronicsImage5 from '@assets/stock_images/electronics_gadgets__c7ecc430.jpg';

import beautyImage1 from '@assets/stock_images/beauty_cosmetics_ski_15d4d9e8.jpg';
import beautyImage2 from '@assets/stock_images/beauty_cosmetics_ski_70cabdc8.jpg';
import beautyImage3 from '@assets/stock_images/beauty_cosmetics_ski_44d80c95.jpg';
import beautyImage4 from '@assets/stock_images/beauty_cosmetics_ski_043380f5.jpg';
import beautyImage5 from '@assets/stock_images/beauty_cosmetics_ski_54d04a2a.jpg';

import petImage1 from '@assets/stock_images/pet_dog_food_toys_su_886fec70.jpg';
import petImage2 from '@assets/stock_images/pet_dog_food_toys_su_bae1918e.jpg';
import petImage3 from '@assets/stock_images/pet_dog_food_toys_su_2c40d879.jpg';

import homeImage1 from '@assets/stock_images/home_kitchen_utensil_9993415b.jpg';
import homeImage2 from '@assets/stock_images/home_kitchen_utensil_adae52e5.jpg';
import homeImage3 from '@assets/stock_images/home_kitchen_utensil_e5624871.jpg';

import restaurantImage1 from '@assets/stock_images/restaurant_hotel_foo_21461548.jpg';
import restaurantImage2 from '@assets/stock_images/restaurant_hotel_foo_b46a38e5.jpg';
import restaurantImage3 from '@assets/stock_images/restaurant_hotel_foo_bda318a2.jpg';

// Image arrays for easy access
const foodImages = [foodImage1, foodImage2, foodImage3, foodImage4, foodImage5];
const groceryImages = [groceryImage1, groceryImage2, groceryImage3, groceryImage4, groceryImage5];
const medicineImages = [medicineImage1, medicineImage2, medicineImage3, medicineImage4, medicineImage5];
const electronicsImages = [electronicsImage1, electronicsImage2, electronicsImage3, electronicsImage4, electronicsImage5];
const beautyImages = [beautyImage1, beautyImage2, beautyImage3, beautyImage4, beautyImage5];
const petImages = [petImage1, petImage2, petImage3];
const homeImages = [homeImage1, homeImage2, homeImage3];
const restaurantImages = [restaurantImage1, restaurantImage2, restaurantImage3];

// Enhanced Product type with detailed specifications
export interface ProductSpecification {
  [key: string]: string | number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  isVeg?: number;
  category: string;
  isBestseller?: boolean;
  rating: number;
  totalReviews?: number;
  brand?: string;
  inStock?: boolean;
  stockCount?: number;
  specifications?: ProductSpecification;
  features?: string[];
  manufacturer?: {
    name: string;
    country: string;
    address?: string;
  };
  warranty?: string;
  returnPolicy?: string;
  tags?: string[];
}

export interface VendorOffer {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'combo' | 'freebie' | 'trio' | 'quad';
  originalPrice?: number;
  discountedPrice?: number;
  items?: string[];
  image?: string;
  images?: string[];
  rating?: number;
  isVeg?: number;
}

export interface VendorReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export interface HotelVendor {
  id: string;
  name: string;
  slug: string;
  image: string;
  images?: string[];
  gallery?: string[];
  cuisines: string[];
  rating: number;
  totalRatings: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  costForTwo: number;
  distance: string;
  address: string;
  isPremium: number;
  offers: string[];
  detailedOffers?: VendorOffer[];
  isOpen: number;
  isVeg?: number;
  tags?: string[];
  startedOn?: string;
  listedOn?: string;
  recognition?: string[];
  summary?: string;
  reviews?: VendorReview[];
  menuCount?: number;
}

// Helper to get random image from array
const getRandomImage = (images: string[]) => images[Math.floor(Math.random() * images.length)];

// Helper to get multiple images from array
const getMultipleImages = (images: string[], count: number = 3) => {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, images.length));
};

// Generate sample reviews
export const generateReviews = (productId: string, count: number = 5): ProductReview[] => {
  const reviewTemplates = [
    { comment: "Excellent quality product! Totally worth the price.", rating: 5 },
    { comment: "Good product, fast delivery. Satisfied with the purchase.", rating: 4 },
    { comment: "Average product. Expected better quality for the price.", rating: 3 },
    { comment: "Very good! Highly recommended. Will buy again.", rating: 5 },
    { comment: "Nice product with decent quality. Value for money.", rating: 4 },
    { comment: "Perfect! Exactly as described. Very happy with this.", rating: 5 },
    { comment: "Good but could be better. Packaging was damaged.", rating: 3 },
    { comment: "Amazing product! Exceeded my expectations completely.", rating: 5 },
    { comment: "Decent purchase. Works as expected.", rating: 4 },
    { comment: "Not satisfied. Quality is subpar for the price.", rating: 2 },
  ];

  const names = ["Rahul S", "Priya M", "Amit K", "Sneha P", "Vikram R", "Ananya T", "Rohan G", "Divya L", "Karan B", "Meera N"];
  
  const reviews: ProductReview[] = [];
  for (let i = 0; i < count; i++) {
    const template = reviewTemplates[i % reviewTemplates.length];
    reviews.push({
      id: `review_${productId}_${i + 1}`,
      userName: names[i % names.length],
      rating: template.rating,
      comment: template.comment,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      helpful: Math.floor(Math.random() * 50),
    });
  }
  return reviews.sort((a, b) => b.rating - a.rating);
};

// Generate hotel food vendors (40 vendors)
export const generateHotelVendors = (): HotelVendor[] => {
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

  const recognitionOptions = [
    ["Best Restaurant 2023", "Top Rated"],
    ["Customer's Choice", "Featured Restaurant"],
    ["Award Winner", "5 Star Rated"],
    ["Premium Partner", "Certified Excellent"],
    ["Top 100 Restaurants"],
    ["Must Try", "Highly Recommended"],
  ];

  const summaries = [
    "Experience authentic flavors crafted with love and finest ingredients. Our chefs bring years of expertise to create memorable dining experiences.",
    "Serving delicious meals since years, we pride ourselves on quality, taste, and customer satisfaction. Every dish tells a story.",
    "A perfect blend of tradition and innovation. We use locally sourced ingredients to bring you the freshest meals every time.",
    "Your go-to destination for exceptional food and service. We believe in creating not just meals, but lasting memories.",
    "Passionate about food, committed to excellence. Each dish is prepared with attention to detail and authentic recipes.",
  ];

  const vendors: HotelVendor[] = [];
  for (let i = 0; i < 40; i++) {
    const vendorImages = getMultipleImages(restaurantImages, 3);
    const galleryImages = getMultipleImages([...restaurantImages, ...foodImages], 6);
    const yearStarted = 2015 + Math.floor(Math.random() * 8);
    const monthStarted = Math.floor(Math.random() * 12) + 1;
    const yearListed = yearStarted + Math.floor(Math.random() * 3);
    
    const detailedOffers: VendorOffer[] = [];
    
    // Combo offer
    const comboItems = ["2 Burgers", "2 Fries", "2 Coke"];
    detailedOffers.push({
      id: `combo_${i + 1}`,
      title: "Combo Deal",
      description: "Delicious combo meal perfect for sharing",
      type: 'combo',
      items: comboItems,
      originalPrice: 499,
      discountedPrice: 349,
      images: getMultipleImages(foodImages, 2),
      rating: parseFloat((4.0 + Math.random() * 0.8).toFixed(1)),
      isVeg: i % 2 === 0 ? 1 : 0
    });
    
    // Trio offer
    const trioItems = ["1 Pizza (Medium)", "Garlic Bread", "Cold Drink"];
    detailedOffers.push({
      id: `trio_${i + 1}`,
      title: "Trio Special",
      description: "Three favorites bundled together",
      type: 'trio',
      items: trioItems,
      originalPrice: 699,
      discountedPrice: 499,
      images: getMultipleImages(foodImages, 2),
      rating: parseFloat((4.2 + Math.random() * 0.6).toFixed(1)),
      isVeg: i % 3 === 0 ? 1 : 0
    });
    
    // Quad offer
    const quadItems = ["2 Main Course", "2 Breads", "1 Dessert", "2 Beverages"];
    detailedOffers.push({
      id: `quad_${i + 1}`,
      title: "Quad Feast",
      description: "Complete meal for the whole family",
      type: 'quad',
      items: quadItems,
      originalPrice: 999,
      discountedPrice: 749,
      images: getMultipleImages(foodImages, 2),
      rating: parseFloat((4.3 + Math.random() * 0.5).toFixed(1)),
      isVeg: 0
    });

    const reviews: VendorReview[] = [];
    const reviewCount = 3 + Math.floor(Math.random() * 5);
    for (let j = 0; j < reviewCount; j++) {
      reviews.push({
        id: `review_vendor_${i + 1}_${j + 1}`,
        userName: ["Rahul S", "Priya M", "Amit K", "Sneha P", "Vikram R", "Ananya T"][j % 6],
        rating: [5, 5, 4, 4, 4, 3][j % 6],
        comment: [
          "Absolutely amazing food! The quality and taste are exceptional. Will order again!",
          "Great service and delicious meals. Highly recommend this restaurant.",
          "Good food but delivery took longer than expected. Overall satisfied.",
          "Excellent! Fresh ingredients and authentic flavors. Worth every penny.",
          "Nice experience. The packaging was impressive and food was hot.",
          "Decent food. Could improve portion sizes but taste was good."
        ][j % 6],
        date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        helpful: Math.floor(Math.random() * 100),
      });
    }

    vendors.push({
      id: `${i + 1}`,
      name: names[i],
      slug: names[i].toLowerCase().replace(/ /g, '-'),
      image: vendorImages[0],
      images: vendorImages,
      gallery: galleryImages,
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
      detailedOffers: detailedOffers,
      isOpen: Math.random() > 0.15 ? 1 : 0,
      isVeg: i % 3 === 0 ? 1 : 0,
      tags: i % 5 === 0 ? ["Bestseller"] : (i % 7 === 0 ? ["Trending"] : []),
      startedOn: `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthStarted - 1]} ${yearStarted}`,
      listedOn: `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Math.floor(Math.random() * 12)]} ${yearListed}`,
      recognition: recognitionOptions[i % recognitionOptions.length],
      summary: summaries[i % summaries.length],
      reviews: reviews,
      menuCount: 45 + Math.floor(Math.random() * 105)
    });
  }
  return vendors;
};

// Generate hotel food menu products
export const generateHotelMenuProducts = (vendorId: string): Product[] => {
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
    { name: "Veg Biryani", desc: "Mixed vegetables rice", price: 280, veg: 1, cat: "Rice & Biryani" },
    { name: "Malai Kofta", desc: "Cottage cheese dumplings in cream", price: 290, veg: 1, cat: "Main Course" },
    { name: "Tandoori Chicken", desc: "Grilled chicken with spices", price: 350, veg: 0, cat: "Starters" },
    { name: "Samosa (2 pcs)", desc: "Crispy fried pastry", price: 60, veg: 1, cat: "Snacks" },
    { name: "Masala Dosa", desc: "Crispy rice crepe with potato", price: 140, veg: 1, cat: "South Indian" },
    { name: "Raita", desc: "Yogurt with cucumber", price: 70, veg: 1, cat: "Sides" },
  ];

  const products: Product[] = [];
  const numProducts = 8 + Math.floor(Math.random() * 7); // 8-14 products
  for (let j = 0; j < numProducts; j++) {
    const item = hotelFoodItems[j % hotelFoodItems.length];
    const productImages = getMultipleImages(foodImages, 3);
    const basePrice = item.price + Math.floor((Math.random() - 0.5) * 100);
    const hasDiscount = Math.random() > 0.6;
    const discountPercent = hasDiscount ? [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)] : 0;
    const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPercent / 100)) : undefined;
    
    products.push({
      id: `p${vendorId}_${j + 1}`,
      name: item.name,
      description: item.desc,
      price: basePrice,
      originalPrice: originalPrice,
      discount: discountPercent > 0 ? discountPercent : undefined,
      image: productImages[0],
      images: productImages,
      isVeg: item.veg,
      category: item.cat,
      isBestseller: Math.random() > 0.7,
      rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
      totalReviews: Math.floor(20 + Math.random() * 200),
      inStock: true,
      stockCount: Math.floor(20 + Math.random() * 50),
    });
  }
  return products;
};

// Generate catalog products for non-hotel categories with detailed specifications
export const generateCatalogProducts = (category: string, count: number): Product[] => {
  const products: Product[] = [];
  let items: any[] = [];
  let images: string[] = [];

  switch (category) {
    case 'supermart':
      images = groceryImages;
      items = [
        { name: "Fresh Milk 1L", desc: "Farm fresh dairy milk", price: 60, cat: "Dairy", brand: "Amul" },
        { name: "Brown Bread", desc: "Whole wheat bread loaf", price: 45, cat: "Bakery", brand: "Britannia" },
        { name: "Organic Bananas", desc: "Fresh yellow bananas 1kg", price: 50, cat: "Fruits", brand: "Fresh Harvest" },
        { name: "Tomatoes 1kg", desc: "Fresh red tomatoes", price: 40, cat: "Vegetables", brand: "Local Farm" },
        { name: "Basmati Rice 1kg", desc: "Premium quality rice", price: 120, cat: "Groceries", brand: "India Gate" },
        { name: "Mineral Water 1L", desc: "Purified drinking water", price: 20, cat: "Beverages", brand: "Bisleri" },
        { name: "Toor Dal 1kg", desc: "Premium quality lentils", price: 140, cat: "Pulses", brand: "Tata Sampann" },
        { name: "Sunflower Oil 1L", desc: "Refined cooking oil", price: 180, cat: "Cooking Essentials", brand: "Fortune" },
      ];
      break;
    case 'medicine':
      images = medicineImages;
      items = [
        { 
          name: "Paracetamol 500mg", 
          desc: "Pain & fever relief tablets - Pack of 15", 
          price: 20, 
          cat: "Pain Relief", 
          brand: "Crocin",
          specs: { "Pack Size": "15 Tablets", "Composition": "Paracetamol 500mg", "Usage": "Adults: 1-2 tablets every 4-6 hours" }
        },
        { 
          name: "Cough Syrup 100ml", 
          desc: "Relief from cough & cold", 
          price: 85, 
          cat: "Cold & Flu", 
          brand: "Benadryl",
          specs: { "Volume": "100ml", "Type": "Expectorant", "Age Group": "Adults & Children 6+" }
        },
        { 
          name: "Vitamin C Tablets", 
          desc: "Immunity booster - 30 tablets", 
          price: 150, 
          cat: "Vitamins", 
          brand: "HealthVit",
          specs: { "Pack Size": "30 Tablets", "Strength": "500mg", "Benefits": "Immunity, Antioxidant" }
        },
        { 
          name: "Hand Sanitizer 200ml", 
          desc: "70% alcohol-based gel", 
          price: 120, 
          cat: "Healthcare", 
          brand: "Dettol",
          specs: { "Volume": "200ml", "Alcohol Content": "70%", "Features": "Kills 99.9% germs" }
        },
        { 
          name: "Face Masks Pack", 
          desc: "3-layer surgical masks - 10 pieces", 
          price: 80, 
          cat: "Healthcare", 
          brand: "3M",
          specs: { "Pack Size": "10 Masks", "Type": "Surgical", "Layers": "3-Ply", "BFE": "≥95%" }
        },
      ];
      break;
    case 'electronics':
      images = electronicsImages;
      items = [
        { 
          name: "Wireless Earbuds Pro", 
          desc: "Premium Bluetooth 5.3 TWS earbuds with noise cancellation", 
          price: 2499, 
          originalPrice: 4999,
          cat: "Audio", 
          brand: "boAt",
          specs: { 
            "Bluetooth": "5.3", 
            "Battery Life": "40 Hours", 
            "Driver": "10mm Dynamic", 
            "Water Resistance": "IPX5",
            "Noise Cancellation": "Active ANC",
            "Charging": "Type-C Fast Charging"
          },
          features: ["Active Noise Cancellation", "Touch Controls", "Voice Assistant", "Fast Charging", "IPX5 Water Resistant"],
          warranty: "1 Year Manufacturer Warranty"
        },
        { 
          name: "Premium Phone Case", 
          desc: "Military-grade drop protection with camera guard", 
          price: 399, 
          originalPrice: 799,
          cat: "Accessories", 
          brand: "Spigen",
          specs: { 
            "Material": "TPU + Polycarbonate", 
            "Protection": "Military Grade MIL-STD 810G",
            "Features": "Raised Bezels, Anti-Slip Grip",
            "Compatibility": "iPhone 14/15/16 Series"
          },
          features: ["Military Grade Protection", "Wireless Charging Compatible", "Precise Cutouts", "Raised Camera Protection"],
          warranty: "6 Months Warranty"
        },
        { 
          name: "Power Bank 20000mAh", 
          desc: "Ultra-fast 65W PD charging with LED display", 
          price: 1799, 
          originalPrice: 3499,
          cat: "Accessories", 
          brand: "Mi",
          specs: { 
            "Capacity": "20000mAh", 
            "Input": "Type-C 65W PD",
            "Output": "Triple Port (2xUSB-A + 1xType-C)",
            "Max Output": "65W",
            "Display": "LED Battery Indicator"
          },
          features: ["65W Fast Charging", "3 Device Charging", "LED Display", "12-Layer Protection"],
          warranty: "1 Year Warranty"
        },
        { 
          name: "USB Type-C Cable 1.2m", 
          desc: "Braided fast charging cable with 100W support", 
          price: 299, 
          originalPrice: 599,
          cat: "Accessories", 
          brand: "Anker",
          specs: { 
            "Length": "1.2 meters", 
            "Max Power": "100W",
            "Data Transfer": "480Mbps",
            "Material": "Nylon Braided",
            "Connector": "Type-C to Type-C"
          },
          features: ["100W Fast Charging", "Tangle-Free Design", "20000+ Bend Lifespan"],
          warranty: "18 Months Warranty"
        },
        { 
          name: "Tempered Glass Screen Protector", 
          desc: "9H hardness with oleophobic coating", 
          price: 199, 
          originalPrice: 499,
          cat: "Accessories", 
          brand: "Nillkin",
          specs: { 
            "Hardness": "9H", 
            "Thickness": "0.33mm",
            "Clarity": "99.9% HD Clear",
            "Features": "Anti-Fingerprint, Case Friendly"
          },
          features: ["9H Hardness", "Anti-Fingerprint", "Bubble-Free Installation", "Edge to Edge Protection"],
          warranty: "Lifetime Replacement"
        },
        { 
          name: "Smartwatch Series 7", 
          desc: "AMOLED display with health tracking & 100+ sports modes", 
          price: 3499, 
          originalPrice: 6999,
          cat: "Wearables", 
          brand: "Noise",
          specs: { 
            "Display": "1.39\" AMOLED", 
            "Battery": "7 Days",
            "Water Resistance": "IP68",
            "Sensors": "Heart Rate, SpO2, Sleep",
            "Sports Modes": "100+",
            "Connectivity": "Bluetooth 5.2"
          },
          features: ["24/7 Heart Rate Monitor", "SpO2 Tracking", "Sleep Analysis", "100+ Sports Modes", "Smart Notifications"],
          warranty: "1 Year Warranty"
        },
      ];
      break;
    case 'beauty':
      images = beautyImages;
      items = [
        { 
          name: "Anti-Aging Face Cream", 
          desc: "Advanced retinol & hyaluronic acid formula", 
          price: 699, 
          originalPrice: 1299,
          cat: "Skincare", 
          brand: "Olay",
          specs: { 
            "Key Ingredients": "Retinol, Hyaluronic Acid, Vitamin E",
            "Skin Type": "All Skin Types",
            "Volume": "50g",
            "Benefits": "Anti-Aging, Moisturizing, Firming"
          },
          features: ["Reduces Fine Lines", "Deeply Moisturizes", "Dermatologist Tested", "Non-Greasy Formula"],
          manufacturer: { name: "Procter & Gamble", country: "India" },
          returnPolicy: "7 Days Return"
        },
        { 
          name: "Matte Lipstick - Ruby Red", 
          desc: "Long-lasting matte finish with vitamin E", 
          price: 449, 
          originalPrice: 799,
          cat: "Makeup", 
          brand: "Maybelline",
          specs: { 
            "Finish": "Matte",
            "Shade": "Ruby Red",
            "Weight": "3.9g",
            "Features": "Vitamin E Enriched, 16HR Stay"
          },
          features: ["16 Hour Wear", "Non-Drying Formula", "Rich Pigmentation", "Smooth Application"],
          manufacturer: { name: "L'Oréal India", country: "India" },
          returnPolicy: "No Return (Hygiene)"
        },
        { 
          name: "Hair Growth Serum", 
          desc: "Biotin & keratin infused hair strengthening serum", 
          price: 549, 
          originalPrice: 999,
          cat: "Hair Care", 
          brand: "WOW",
          specs: { 
            "Key Ingredients": "Biotin, Keratin, Argan Oil",
            "Volume": "100ml",
            "Hair Type": "All Hair Types",
            "Usage": "Apply on scalp daily"
          },
          features: ["Promotes Hair Growth", "Strengthens Roots", "Reduces Hair Fall", "Natural Ingredients"],
          manufacturer: { name: "WOW Skin Science", country: "India" },
          returnPolicy: "7 Days Return"
        },
        { 
          name: "Charcoal Face Wash", 
          desc: "Deep pore cleansing with activated charcoal", 
          price: 299, 
          originalPrice: 499,
          cat: "Skincare", 
          brand: "Nivea",
          specs: { 
            "Key Ingredient": "Activated Charcoal",
            "Volume": "150ml",
            "Skin Type": "Oily & Combination",
            "pH": "5.5"
          },
          features: ["Deep Cleansing", "Oil Control", "Blackhead Removal", "Paraben Free"],
          manufacturer: { name: "Beiersdorf India", country: "India" },
          returnPolicy: "7 Days Return"
        },
        { 
          name: "Luxury Perfume EDP", 
          desc: "Floral & woody notes - 100ml", 
          price: 1299, 
          originalPrice: 2499,
          cat: "Fragrance", 
          brand: "Bella Vita",
          specs: { 
            "Type": "Eau De Parfum",
            "Volume": "100ml",
            "Notes": "Top: Bergamot, Middle: Rose, Base: Sandalwood",
            "Longevity": "8-10 Hours"
          },
          features: ["Long Lasting Fragrance", "Premium Glass Bottle", "Luxury Scent", "Perfect for Gifting"],
          manufacturer: { name: "ITC Limited", country: "India" },
          returnPolicy: "No Return (Hygiene)"
        },
      ];
      break;
    case 'pet':
      images = petImages;
      items = [
        { 
          name: "Premium Dog Food 3kg", 
          desc: "Chicken & rice formula for adult dogs", 
          price: 849, 
          originalPrice: 1199,
          cat: "Pet Food", 
          brand: "Pedigree",
          specs: { 
            "Weight": "3kg",
            "Flavor": "Chicken & Rice",
            "Age": "Adult (1-7 years)",
            "Protein": "21%",
            "Features": "High Protein, Omega 6, Calcium"
          },
          features: ["Complete Nutrition", "Strong Bones & Teeth", "Healthy Skin & Coat", "No Added Artificial Colors"],
          manufacturer: { name: "Mars Petcare", country: "India" }
        },
        { 
          name: "Cat Litter Odor Control 5kg", 
          desc: "Premium clumping cat litter", 
          price: 599, 
          originalPrice: 899,
          cat: "Pet Care", 
          brand: "Catsan",
          specs: { 
            "Weight": "5kg",
            "Type": "Clumping",
            "Material": "Bentonite Clay",
            "Odor Control": "Advanced"
          },
          features: ["99% Dust Free", "Superior Odor Control", "Easy to Clean", "Long Lasting"],
          manufacturer: { name: "Mars Petcare", country: "India" }
        },
        { 
          name: "Durable Chew Toy", 
          desc: "Non-toxic rubber chew toy for dogs", 
          price: 249, 
          originalPrice: 449,
          cat: "Pet Toys", 
          brand: "Petstages",
          specs: { 
            "Material": "Natural Rubber",
            "Size": "Medium",
            "Suitable For": "Dogs 10-25kg",
            "Features": "Non-Toxic, Dental Health"
          },
          features: ["Promotes Dental Health", "Reduces Anxiety", "Durable & Safe", "Easy to Clean"],
          manufacturer: { name: "Petstages India", country: "USA" }
        },
        { 
          name: "Pet Shampoo 500ml", 
          desc: "pH-balanced gentle shampoo for dogs & cats", 
          price: 349, 
          originalPrice: 599,
          cat: "Pet Care", 
          brand: "Himalaya",
          specs: { 
            "Volume": "500ml",
            "pH": "6.5",
            "Type": "Herbal",
            "Suitable For": "Dogs & Cats"
          },
          features: ["pH Balanced", "Natural Ingredients", "Anti-Tick Formula", "Tear-Free"],
          manufacturer: { name: "Himalaya Wellness", country: "India" }
        },
      ];
      break;
    case 'home':
      images = homeImages;
      items = [
        { 
          name: "Premium Knife Set 6-Piece", 
          desc: "Professional German stainless steel knives", 
          price: 1899, 
          originalPrice: 3499,
          cat: "Kitchen", 
          brand: "Prestige",
          specs: { 
            "Material": "German Stainless Steel",
            "Pieces": "6 (Chef, Bread, Utility, Paring, Scissors, Block)",
            "Blade": "High Carbon Steel",
            "Handle": "Ergonomic Design"
          },
          features: ["Razor Sharp Edge", "Rust Resistant", "Ergonomic Handle", "Wooden Storage Block"],
          manufacturer: { name: "TTK Prestige", country: "India" },
          warranty: "2 Years Warranty"
        },
        { 
          name: "Airtight Containers Set", 
          desc: "BPA-free plastic containers - Set of 10", 
          price: 699, 
          originalPrice: 1199,
          cat: "Kitchen", 
          brand: "Tupperware",
          specs: { 
            "Material": "Food Grade Plastic",
            "Pieces": "10 (Various Sizes)",
            "Features": "Airtight, Microwave Safe, BPA Free",
            "Capacity Range": "300ml to 2L"
          },
          features: ["100% Airtight", "Microwave & Freezer Safe", "Stain Resistant", "Easy to Clean"],
          manufacturer: { name: "Tupperware India", country: "India" },
          warranty: "Lifetime Warranty"
        },
        { 
          name: "Cotton Bed Sheet Set", 
          desc: "300 TC premium cotton double bedsheet with 2 pillow covers", 
          price: 1299, 
          originalPrice: 2499,
          cat: "Home Decor", 
          brand: "Bombay Dyeing",
          specs: { 
            "Material": "100% Cotton",
            "Thread Count": "300 TC",
            "Size": "Double (230x250cm)",
            "Includes": "1 Bedsheet + 2 Pillow Covers"
          },
          features: ["Soft & Breathable", "Fade Resistant", "Machine Washable", "Premium Quality"],
          manufacturer: { name: "Bombay Dyeing", country: "India" },
          returnPolicy: "7 Days Return"
        },
        { 
          name: "LED Table Lamp", 
          desc: "Modern touch-control dimmable desk lamp", 
          price: 1499, 
          originalPrice: 2999,
          cat: "Home Decor", 
          brand: "Philips",
          specs: { 
            "Power": "12W LED",
            "Brightness": "Dimmable (3 Levels)",
            "Color Temperature": "3000K-6000K",
            "Features": "Touch Control, USB Charging Port"
          },
          features: ["Energy Efficient", "Eye-Care Technology", "Modern Design", "USB Charging Port"],
          manufacturer: { name: "Philips India", country: "India" },
          warranty: "2 Years Warranty"
        },
      ];
      break;
    default:
      images = groceryImages;
      items = [
        { name: "Sample Product", desc: "Sample description", price: 100, cat: "General", brand: "Generic" },
      ];
  }

  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const productImages = getMultipleImages(images, 4);
    const basePrice = item.price + Math.floor((Math.random() - 0.5) * 50);
    
    let finalPrice = basePrice;
    let originalPrice = item.originalPrice;
    let discount = 0;
    
    if (originalPrice) {
      discount = Math.round(((originalPrice - basePrice) / originalPrice) * 100);
    } else if (Math.random() > 0.5) {
      const discountPercent = [10, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 7)];
      originalPrice = Math.round(basePrice / (1 - discountPercent / 100));
      discount = discountPercent;
    }
    
    products.push({
      id: `${category}_${i + 1}`,
      name: item.name,
      description: item.desc,
      price: finalPrice,
      originalPrice: originalPrice,
      discount: discount > 0 ? discount : undefined,
      image: productImages[0],
      images: productImages,
      category: item.cat,
      brand: item.brand,
      isBestseller: Math.random() > 0.8,
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      totalReviews: Math.floor(50 + Math.random() * 500),
      inStock: Math.random() > 0.1,
      stockCount: Math.floor(5 + Math.random() * 50),
      isVeg: 1,
      specifications: item.specs || undefined,
      features: item.features || undefined,
      manufacturer: item.manufacturer || undefined,
      warranty: item.warranty || undefined,
      returnPolicy: item.returnPolicy || "7 Days Return",
      tags: discount > 30 ? ["Great Deal"] : (Math.random() > 0.7 ? ["Top Rated"] : undefined)
    });
  }
  return products;
};

// Get product by ID
export const getProductById = (category: string, productId: string): Product | undefined => {
  const products = generateCatalogProducts(category, 100);
  return products.find(p => p.id === productId);
};
