import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Plane,
  Hotel,
  Car,
  Sparkles,
  CheckCircle,
  Shield,
  Utensils,
  Briefcase,
  Bus,
  Train,
  Image as ImageIcon,
  Video,
  Building2,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  ThumbsUp,
  Navigation,
  Award,
  TrendingUp,
  PlayCircle,
  Eye,
  Heart,
  Share2,
  DollarSign,
  Baby,
  Glasses,
  Music,
  PartyPopper
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDetailData {
  id: string;
  name: string;
  country: string;
  destinations: string[];
  days: number;
  nights: number;
  startDate: string;
  priceFrom: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  overview: string;
  keyAttractions: string[];
  inclusions: string[];
  exclusions: string[];
  availableClasses: {
    id: string;
    name: string;
    description: string;
    pricePerPerson: number;
    features: string[];
  }[];
  ageSuitability: string;
  tripSuitability?: Array<'family' | 'couple' | 'friends' | 'party' | 'solo'>;
  timeline: DayTimeline[];
  basePrice: number;
  taxes: number;
  fees: number;
  companyInfo: {
    name: string;
    description: string;
    location: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    established: string;
    totalTrips: number;
    rating: number;
    specialization: string[];
    certifications: string[];
  };
  customerReviews: Review[];
  previousTrips: PreviousTrip[];
  videos: VideoContent[];
}

interface DayTimeline {
  day: number;
  date: string;
  title: string;
  items: TimelineItem[];
}

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'meal' | 'transfer' | 'train';
  status: 'confirmed' | 'optional';
  price?: number;
  location?: string;
}

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  trip: string;
  comment: string;
  helpful: number;
  images?: string[];
}

interface PreviousTrip {
  id: string;
  name: string;
  date: string;
  participants: number;
  rating: number;
  highlights: string[];
  images: string[];
}

interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  url: string;
}

const MEAL_TIERS = [
  { id: "standard", name: "Standard", description: "Included meals & basic options", pricePerPerson: 0, features: ["3 meals/day", "Local cuisine", "Vegetarian options"] },
  { id: "premium", name: "Premium", description: "Gourmet options & local cuisines", pricePerPerson: 5000, features: ["All standard features", "Multi-cuisine options", "Special dietary accommodations", "Buffet breakfast"] },
  { id: "ultra-premium", name: "Ultra Premium", description: "Fine dining & bespoke options", pricePerPerson: 12000, features: ["All premium features", "Fine dining experiences", "Celebrity chef meals", "Private dining options", "Wine pairing"] }
];

const TRAVEL_COMPONENTS = [
  { id: "bus", name: "Bus", icon: Bus },
  { id: "car", name: "Car/Transfer", icon: Car },
  { id: "flight", name: "Flight", icon: Plane },
  { id: "train", name: "Train", icon: Train }
];

const TRAVEL_TIERS = [
  { id: "standard", name: "Standard", description: "Economy/Shared", pricePerPerson: 0, features: ["Economy class", "Shared transfers"] },
  { id: "premium", name: "Premium", description: "Comfort/Private", pricePerPerson: 25000, features: ["Premium class", "Private transfers", "Extra legroom"] },
  { id: "ultra-premium", name: "Ultra Premium", description: "Business/Luxury", pricePerPerson: 50000, features: ["Business/First class", "Luxury vehicles", "VIP treatment", "Lounge access"] }
];

const MOCK_TRIP_DATA: Record<string, TripDetailData> = {
  "us-west-coast": {
    id: "us-west-coast",
    name: "US West Coast Adventure",
    country: "USA",
    destinations: ["Los Angeles", "San Francisco", "Las Vegas"],
    days: 10,
    nights: 9,
    startDate: "2025-01-05",
    priceFrom: 245000,
    rating: 4.6,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=800&q=80",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&q=80"
    ],
    overview: "Epic road trip along the West Coast! Experience the glitz of LA, the tech hub of San Francisco, and the entertainment capital Las Vegas. Includes car rental and flexibility to explore at your own pace. Perfect for adventurers seeking the ultimate American experience.",
    keyAttractions: ["Golden Gate Bridge", "Hollywood Sign", "Grand Canyon", "Alcatraz Island", "Las Vegas Strip", "Santa Monica Pier"],
    inclusions: ["Round-trip flights", "4-star hotels", "Car rental (9 days)", "Daily breakfast", "Grand Canyon tour", "City guides"],
    exclusions: ["Travel insurance", "Fuel costs", "Parking fees", "Meals (except breakfast)", "Personal expenses", "Optional activities"],
    availableClasses: [
      {
        id: "economy",
        name: "Economy Standard",
        description: "Great value for budget travelers",
        pricePerPerson: 0,
        features: ["Economy flights", "3-star hotels", "Compact car rental", "Basic breakfast"]
      },
      {
        id: "comfort",
        name: "Comfort Plus",
        description: "Enhanced travel experience",
        pricePerPerson: 35000,
        features: ["Premium Economy flights", "4-star hotels", "Mid-size car rental", "Buffet breakfast", "Welcome kit"]
      },
      {
        id: "business",
        name: "Business Class",
        description: "Premium comfort throughout",
        pricePerPerson: 85000,
        features: ["Business class flights", "5-star hotels", "Luxury SUV rental", "Fine dining breakfast", "Priority services", "Lounge access"]
      },
      {
        id: "first",
        name: "First Class Luxury",
        description: "Ultimate VIP experience",
        pricePerPerson: 150000,
        features: ["First class flights", "Luxury hotels", "Premium vehicle with driver", "Gourmet meals", "Concierge service", "Private tours"]
      }
    ],
    ageSuitability: "Suitable for all ages",
    tripSuitability: ['friends', 'party'],
    timeline: [
      {
        day: 1,
        date: "5th Jan",
        title: "Arrival in Los Angeles",
        items: [
          { id: "d1-1", time: "10:00", title: "Flight Departure", description: "Emirates • Direct • Business Class • 15h", type: "flight", status: "confirmed", price: 75000 },
          { id: "d1-2", time: "14:00", title: "Arrive LAX", description: "Los Angeles International Airport • Terminal B", type: "flight", status: "confirmed", location: "Los Angeles" },
          { id: "d1-3", time: "15:30", title: "Hotel Check-in", description: "Hilton Los Angeles Downtown, 4★ • Deluxe King Room", type: "hotel", status: "confirmed", price: 10000, location: "Downtown LA" },
          { id: "d1-4", time: "19:00", title: "Welcome Dinner", description: "Rooftop dining with city views • American cuisine", type: "meal", status: "optional", price: 3500 }
        ]
      },
      {
        day: 2,
        date: "6th Jan",
        title: "Hollywood & Beverly Hills",
        items: [
          { id: "d2-1", time: "08:00", title: "Breakfast at Hotel", description: "Buffet breakfast included", type: "meal", status: "confirmed" },
          { id: "d2-2", time: "09:00", title: "Pick up Rental Car", description: "SUV for 9 days • Insurance included", type: "car", status: "confirmed", price: 25000 },
          { id: "d2-3", time: "10:00", title: "Hollywood Tour", description: "Walk of Fame, Chinese Theatre, Hollywood Sign viewpoint", type: "activity", status: "confirmed", price: 5000 },
          { id: "d2-4", time: "15:00", title: "Beverly Hills Shopping", description: "Rodeo Drive • Self-guided exploration", type: "activity", status: "optional" },
          { id: "d2-5", time: "19:00", title: "Dinner Recommendation", description: "The Ivy - Celebrity hotspot", type: "meal", status: "optional", price: 4500 }
        ]
      },
      {
        day: 3,
        date: "7th Jan",
        title: "Santa Monica & Venice Beach",
        items: [
          { id: "d3-1", time: "09:00", title: "Santa Monica Pier", description: "Pacific Park • Beach activities • 3 hours", type: "activity", status: "confirmed", price: 2000 },
          { id: "d3-2", time: "13:00", title: "Lunch at The Deck", description: "Beachfront dining • Seafood specialties", type: "meal", status: "optional", price: 2500 },
          { id: "d3-3", time: "15:00", title: "Venice Beach Boardwalk", description: "Street performers • Shopping • Muscle Beach", type: "activity", status: "confirmed" },
          { id: "d3-4", time: "18:00", title: "Sunset at Malibu", description: "Drive to Malibu Beach for sunset views", type: "activity", status: "optional" }
        ]
      }
    ],
    basePrice: 245000,
    taxes: 18000,
    fees: 3000,
    companyInfo: {
      name: "Global Adventures Travel Co.",
      description: "Premier international travel company specializing in curated experiences across the Americas, Europe, and Asia. With over 15 years of expertise, we create unforgettable journeys tailored to your dreams.",
      location: "New York, USA",
      address: "1234 Fifth Avenue, Suite 500, New York, NY 10001",
      phone: "+1 (212) 555-0199",
      email: "info@globaladventures.com",
      website: "www.globaladventures.com",
      established: "2009",
      totalTrips: 15000,
      rating: 4.8,
      specialization: ["Adventure Travel", "Luxury Tours", "Cultural Experiences", "Wildlife Safaris", "Beach Getaways"],
      certifications: ["IATA Certified", "ASTA Member", "ISO 9001:2015", "Better Business Bureau A+ Rating", "TripAdvisor Certificate of Excellence"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5,
        date: "December 2024",
        trip: "US West Coast Adventure",
        comment: "Absolutely phenomenal! The itinerary was perfectly paced, hotels were luxurious, and the car rental made exploring so easy. Highlight was definitely the Grand Canyon tour. Our guide was knowledgeable and friendly. Highly recommend for anyone wanting to see the best of the West Coast!",
        helpful: 124,
        images: ["https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80"]
      },
      {
        id: "r2",
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?u=michael",
        rating: 4,
        date: "November 2024",
        trip: "US West Coast Adventure",
        comment: "Great trip overall! San Francisco was my favorite city. The Golden Gate Bridge at sunset was breathtaking. Only minor complaint was some of the driving distances were longer than expected. But the flexibility of having our own car made up for it.",
        helpful: 89,
        images: []
      },
      {
        id: "r3",
        name: "Emily Rodriguez",
        avatar: "https://i.pravatar.cc/150?u=emily",
        rating: 5,
        date: "October 2024",
        trip: "US West Coast Adventure",
        comment: "Best vacation ever! Las Vegas was incredible, and the shows were world-class. The hotel recommendations were spot-on. Customer service was excellent throughout. Already planning our next trip with Global Adventures!",
        helpful: 156,
        images: ["https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=400&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"]
      },
      {
        id: "r4",
        name: "David Kim",
        avatar: "https://i.pravatar.cc/150?u=david",
        rating: 4,
        date: "September 2024",
        trip: "US West Coast Adventure",
        comment: "Wonderful experience! The trip was well-organized and the accommodations were comfortable. Hollywood tour was fascinating. Would have liked more time in San Francisco, but overall very satisfied with the package.",
        helpful: 67
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Summer West Coast Explorer",
        date: "June 2024",
        participants: 24,
        rating: 4.7,
        highlights: ["Yosemite National Park", "Big Sur Coastline", "Wine Country Tour"],
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"]
      },
      {
        id: "pt2",
        name: "West Coast Family Adventure",
        date: "March 2024",
        participants: 18,
        rating: 4.9,
        highlights: ["Disneyland", "Universal Studios", "Beach Activities"],
        images: ["https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=400&q=80"]
      },
      {
        id: "pt3",
        name: "Luxury West Coast Getaway",
        date: "December 2023",
        participants: 12,
        rating: 5.0,
        highlights: ["First Class Travel", "5-Star Hotels", "Private Tours"],
        images: ["https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "West Coast Highlights",
        thumbnail: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80",
        duration: "3:45",
        views: 15234,
        url: "#"
      },
      {
        id: "v2",
        title: "Golden Gate Bridge Experience",
        thumbnail: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80",
        duration: "2:18",
        views: 8932,
        url: "#"
      },
      {
        id: "v3",
        title: "Las Vegas by Night",
        thumbnail: "https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=400&q=80",
        duration: "4:12",
        views: 12456,
        url: "#"
      }
    ]
  },
  "romantic-paris": {
    id: "romantic-paris",
    name: "Romantic Paris Getaway",
    country: "France",
    destinations: ["Paris", "Versailles"],
    days: 5,
    nights: 4,
    startDate: "2024-11-20",
    priceFrom: 125000,
    rating: 4.8,
    reviewCount: 256,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80",
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80",
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&q=80"
    ],
    overview: "Experience the magic of Paris with your loved one! Stroll along the Seine, visit iconic landmarks like the Eiffel Tower, explore the charming streets of Montmartre, and enjoy world-class cuisine. Perfect romantic getaway for couples.",
    keyAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe", "Versailles Palace", "Champs-Élysées"],
    inclusions: ["Round-trip flights", "4-star boutique hotel", "Daily breakfast", "Seine River cruise", "Versailles day trip", "City transport pass"],
    exclusions: ["Travel insurance", "Lunch & dinner", "Personal expenses", "Optional tours", "Tips"],
    availableClasses: [
      {
        id: "economy",
        name: "Economy Standard",
        description: "Comfortable and affordable",
        pricePerPerson: 0,
        features: ["Economy flights", "3-star hotel", "Breakfast included", "City tour"]
      },
      {
        id: "comfort",
        name: "Deluxe",
        description: "Enhanced romantic experience",
        pricePerPerson: 25000,
        features: ["Premium Economy flights", "4-star boutique hotel", "Champagne breakfast", "Private Seine cruise"]
      },
      {
        id: "business",
        name: "Luxury Romance",
        description: "Ultimate romantic luxury",
        pricePerPerson: 55000,
        features: ["Business class flights", "5-star hotel", "Fine dining breakfast", "Private tours", "Couples spa session"]
      }
    ],
    ageSuitability: "Adults only - Romantic getaway",
    tripSuitability: ['couple'],
    timeline: [
      {
        day: 1,
        date: "20th Nov",
        title: "Arrival in Paris",
        items: [
          { id: "d1-1", time: "08:00", title: "Flight Departure", description: "Air France • Direct • 9h 30m", type: "flight", status: "confirmed", price: 45000 },
          { id: "d1-2", time: "18:30", title: "Arrive Paris CDG", description: "Charles de Gaulle Airport", type: "flight", status: "confirmed", location: "Paris" },
          { id: "d1-3", time: "20:00", title: "Hotel Check-in", description: "Boutique Hotel Le Marais, 4★ • Romantic Suite", type: "hotel", status: "confirmed", price: 8000, location: "Le Marais" },
          { id: "d1-4", time: "21:00", title: "Welcome Dinner", description: "Traditional French bistro • Wine pairing", type: "meal", status: "optional", price: 4500 }
        ]
      },
      {
        day: 2,
        date: "21st Nov",
        title: "Iconic Paris",
        items: [
          { id: "d2-1", time: "08:00", title: "Breakfast", description: "Croissants & coffee at hotel", type: "meal", status: "confirmed" },
          { id: "d2-2", time: "10:00", title: "Eiffel Tower Visit", description: "Skip-the-line tickets • Top floor access", type: "activity", status: "confirmed", price: 3000 },
          { id: "d2-3", time: "14:00", title: "Lunch at Café de l'Homme", description: "Eiffel Tower view restaurant", type: "meal", status: "optional", price: 5000 },
          { id: "d2-4", time: "16:00", title: "Seine River Cruise", description: "1-hour romantic cruise with champagne", type: "activity", status: "confirmed", price: 2500 }
        ]
      },
      {
        day: 3,
        date: "22nd Nov",
        title: "Versailles Day Trip",
        items: [
          { id: "d3-1", time: "09:00", title: "Transfer to Versailles", description: "Private car transfer", type: "transfer", status: "confirmed", price: 3500 },
          { id: "d3-2", time: "10:30", title: "Palace of Versailles", description: "Guided tour of palace and gardens", type: "activity", status: "confirmed", price: 4000 },
          { id: "d3-3", time: "13:00", title: "Lunch in Gardens", description: "Le Petite Venise restaurant", type: "meal", status: "optional", price: 3500 },
          { id: "d3-4", time: "18:00", title: "Return to Paris", description: "Evening at leisure", type: "transfer", status: "confirmed" }
        ]
      }
    ],
    basePrice: 125000,
    taxes: 9500,
    fees: 2000,
    companyInfo: {
      name: "European Romance Tours",
      description: "Specialists in romantic European getaways. We create unforgettable experiences for couples with attention to every romantic detail.",
      location: "Paris, France",
      address: "12 Rue de Rivoli, 75001 Paris, France",
      phone: "+33 1 23 45 67 89",
      email: "info@europeanceromance.com",
      website: "www.europeanromance.com",
      established: "2005",
      totalTrips: 8500,
      rating: 4.9,
      specialization: ["Romantic Getaways", "Honeymoons", "Anniversary Trips", "City Tours", "Cultural Experiences"],
      certifications: ["IATA Certified", "French Tourism Board Approved", "ISO 9001:2015", "TripAdvisor Excellence Award"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Emma & James",
        avatar: "https://i.pravatar.cc/150?u=emma",
        rating: 5,
        date: "October 2024",
        trip: "Romantic Paris Getaway",
        comment: "Perfect honeymoon! Every detail was magical. The hotel was charming, the Seine cruise at sunset was breathtaking, and our guide at Versailles was wonderful. Paris is truly the city of love!",
        helpful: 98,
        images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80"]
      },
      {
        id: "r2",
        name: "Sophie Martin",
        avatar: "https://i.pravatar.cc/150?u=sophie",
        rating: 5,
        date: "September 2024",
        trip: "Romantic Paris Getaway",
        comment: "Celebrated our 10th anniversary with this trip. The attention to romantic details was outstanding. Champagne on arrival, rose petals, candlelit dinner recommendations - simply perfect!",
        helpful: 76
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Spring in Paris",
        date: "April 2024",
        participants: 16,
        rating: 4.9,
        highlights: ["Cherry blossoms", "Art galleries", "Romantic cafés"],
        images: ["https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Paris Love Story",
        thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
        duration: "2:45",
        views: 12450,
        url: "#"
      }
    ]
  },
  "uk-winter-family": {
    id: "uk-winter-family",
    name: "Family UK Winter",
    country: "UK",
    destinations: ["London", "Glasgow", "Edinburgh"],
    days: 8,
    nights: 7,
    startDate: "2024-12-20",
    priceFrom: 185000,
    rating: 4.8,
    reviewCount: 289,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80"
    ],
    overview: "Perfect family winter adventure across the UK! Visit London's iconic landmarks, explore Edinburgh Castle, and enjoy winter festivities in Glasgow.",
    keyAttractions: ["Warner Bros Studio", "Natural History Museum", "Edinburgh Castle", "London Eye", "Winter Markets"],
    inclusions: ["Round-trip flights", "4★ Hotels", "Private Transfers", "Breakfast", "Activity Tickets"],
    exclusions: ["Travel insurance", "Lunch & dinner", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Economy Standard", description: "Great family value", pricePerPerson: 0, features: ["Economy flights", "3-star hotels", "Breakfast"] },
      { id: "comfort", name: "Comfort Plus", description: "Enhanced family comfort", pricePerPerson: 30000, features: ["Premium Economy", "4-star hotels", "Family activities"] }
    ],
    ageSuitability: "Family Friendly - All ages",
    tripSuitability: ['family'],
    timeline: [
      {
        day: 1,
        date: "20th Dec",
        title: "Arrival in London",
        items: [
          { id: "d1-1", time: "06:00", title: "Flight Departure", description: "British Airways • Direct • 9h", type: "flight", status: "confirmed", price: 55000 },
          { id: "d1-2", time: "15:00", title: "Arrive London Heathrow", description: "Welcome to the UK!", type: "flight", status: "confirmed", location: "London" },
          { id: "d1-3", time: "17:00", title: "Hotel Check-in", description: "Premier Inn London, 4★ • Family Room", type: "hotel", status: "confirmed", price: 12000, location: "Central London" },
          { id: "d1-4", time: "19:00", title: "Welcome Dinner", description: "Traditional British pub dinner", type: "meal", status: "confirmed", price: 4000 }
        ]
      },
      {
        day: 2,
        date: "21st Dec",
        title: "London Winter Wonderland",
        items: [
          { id: "d2-1", time: "09:00", title: "Breakfast at Hotel", description: "Full English breakfast included", type: "meal", status: "confirmed" },
          { id: "d2-2", time: "10:00", title: "Warner Bros Studio Tour", description: "Harry Potter Studio Experience • 4 hours", type: "activity", status: "confirmed", price: 8000 },
          { id: "d2-3", time: "15:00", title: "Winter Wonderland", description: "Hyde Park Christmas market and activities", type: "activity", status: "confirmed", price: 3000 },
          { id: "d2-4", time: "18:00", title: "Dinner at Covent Garden", description: "Family-friendly restaurant", type: "meal", status: "optional", price: 5000 }
        ]
      },
      {
        day: 3,
        date: "22nd Dec",
        title: "London Landmarks",
        items: [
          { id: "d3-1", time: "09:30", title: "London Eye", description: "30-minute capsule ride with views", type: "activity", status: "confirmed", price: 3500 },
          { id: "d3-2", time: "11:30", title: "Natural History Museum", description: "Dinosaurs and interactive exhibits", type: "activity", status: "confirmed" },
          { id: "d3-3", time: "14:00", title: "Lunch at Borough Market", description: "Street food exploration", type: "meal", status: "optional", price: 2500 },
          { id: "d3-4", time: "16:00", title: "Tower of London", description: "Crown Jewels tour", type: "activity", status: "confirmed", price: 4500 }
        ]
      },
      {
        day: 4,
        date: "23rd Dec",
        title: "Train to Edinburgh",
        items: [
          { id: "d4-1", time: "10:00", title: "Train to Edinburgh", description: "LNER • First Class • 4h 30m", type: "train", status: "confirmed", price: 15000 },
          { id: "d4-2", time: "14:30", title: "Arrive Edinburgh", description: "Transfer to hotel", type: "transfer", status: "confirmed", location: "Edinburgh" },
          { id: "d4-3", time: "16:00", title: "Hotel Check-in", description: "Radisson Blu Edinburgh, 4★ • Family Suite", type: "hotel", status: "confirmed", price: 11000, location: "Edinburgh City" },
          { id: "d4-4", time: "18:00", title: "Edinburgh Christmas Market", description: "Princes Street Gardens market", type: "activity", status: "confirmed", price: 2000 }
        ]
      },
      {
        day: 5,
        date: "24th Dec",
        title: "Edinburgh Castle & Old Town",
        items: [
          { id: "d5-1", time: "09:00", title: "Edinburgh Castle Tour", description: "Guided family tour • 2 hours", type: "activity", status: "confirmed", price: 5000 },
          { id: "d5-2", time: "12:00", title: "Royal Mile Walk", description: "Historic street with shops", type: "activity", status: "confirmed" },
          { id: "d5-3", time: "15:00", title: "Camera Obscura", description: "Interactive science museum", type: "activity", status: "confirmed", price: 3000 },
          { id: "d5-4", time: "19:00", title: "Christmas Eve Dinner", description: "Traditional Scottish dinner", type: "meal", status: "optional", price: 6000 }
        ]
      }
    ],
    basePrice: 185000,
    taxes: 15000,
    fees: 5000,
    companyInfo: {
      name: "UK Family Tours",
      description: "Specialists in UK family travel",
      location: "London, UK",
      address: "123 Family Street, London",
      phone: "+44 20 1234 5678",
      email: "info@ukfamilytours.com",
      website: "www.ukfamilytours.com",
      established: "2010",
      totalTrips: 5000,
      rating: 4.8,
      specialization: ["Family Travel", "Educational Tours"],
      certifications: ["UK Tourism Board", "Family Travel Association"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "The Williams Family",
        avatar: "https://i.pravatar.cc/150?u=williams",
        rating: 5,
        date: "November 2024",
        trip: "Family UK Winter",
        comment: "Perfect family Christmas trip! Kids absolutely loved Warner Bros Studio and the winter markets. Edinburgh was magical covered in snow. Highly recommend for families!",
        helpful: 89,
        images: ["https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80"]
      },
      {
        id: "r2",
        name: "Sarah Thompson",
        avatar: "https://i.pravatar.cc/150?u=sarah-t",
        rating: 4,
        date: "December 2023",
        trip: "Family UK Winter",
        comment: "Wonderful experience! Edinburgh Castle was breathtaking and the kids had so much fun at the Christmas markets. Hotels were comfortable and family-friendly.",
        helpful: 56
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "UK Winter Wonderland - Group 12",
        date: "December 2023",
        participants: 20,
        rating: 4.9,
        highlights: ["Harry Potter Studio Tour", "Edinburgh Hogmanay preparation", "Winter markets", "Family ice skating"],
        images: ["https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "UK Winter Magic",
        thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80",
        duration: "4:15",
        views: 8650,
        url: "#"
      }
    ]
  },
  "paris-romance": {
    id: "paris-romance",
    name: "Romantic Paris Getaway",
    country: "France",
    destinations: ["Paris", "Versailles"],
    days: 5,
    nights: 4,
    startDate: "2024-11-20",
    priceFrom: 125000,
    rating: 4.9,
    reviewCount: 256,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80"
    ],
    overview: "Experience the magic of Paris with your loved one! Perfect romantic getaway.",
    keyAttractions: ["Eiffel Tower", "Louvre Museum", "Palace of Versailles"],
    inclusions: ["Flights", "5★ Hotels", "Breakfast", "Seine Cruise"],
    exclusions: ["Travel insurance", "Lunch & dinner", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Economy Standard", description: "Comfortable and affordable", pricePerPerson: 0, features: ["Economy flights", "3-star hotel"] },
      { id: "comfort", name: "Deluxe", description: "Enhanced romantic experience", pricePerPerson: 25000, features: ["Premium Economy", "4-star boutique hotel"] }
    ],
    ageSuitability: "Adults only - Romantic getaway",
    tripSuitability: ['couple'],
    timeline: [
      {
        day: 1,
        date: "20th Nov",
        title: "Arrival in Paris",
        items: [
          { id: "d1-1", time: "08:00", title: "Flight Departure", description: "Air France • Direct • 9h 30m", type: "flight", status: "confirmed", price: 45000 },
          { id: "d1-2", time: "18:30", title: "Arrive Paris CDG", description: "Charles de Gaulle Airport", type: "flight", status: "confirmed", location: "Paris" },
          { id: "d1-3", time: "20:00", title: "Hotel Check-in", description: "Boutique Hotel Le Marais, 4★ • Romantic Suite", type: "hotel", status: "confirmed", price: 8000, location: "Le Marais" },
          { id: "d1-4", time: "21:00", title: "Welcome Dinner", description: "Traditional French bistro • Wine pairing", type: "meal", status: "optional", price: 4500 }
        ]
      },
      {
        day: 2,
        date: "21st Nov",
        title: "Iconic Paris",
        items: [
          { id: "d2-1", time: "08:00", title: "Breakfast", description: "Croissants & coffee at hotel", type: "meal", status: "confirmed" },
          { id: "d2-2", time: "10:00", title: "Eiffel Tower Visit", description: "Skip-the-line tickets • Top floor access", type: "activity", status: "confirmed", price: 3000 },
          { id: "d2-3", time: "14:00", title: "Lunch at Café de l'Homme", description: "Eiffel Tower view restaurant", type: "meal", status: "optional", price: 5000 },
          { id: "d2-4", time: "16:00", title: "Seine River Cruise", description: "1-hour romantic cruise with champagne", type: "activity", status: "confirmed", price: 2500 }
        ]
      },
      {
        day: 3,
        date: "22nd Nov",
        title: "Art & Culture",
        items: [
          { id: "d3-1", time: "09:00", title: "Louvre Museum", description: "Guided tour with Mona Lisa", type: "activity", status: "confirmed", price: 3500 },
          { id: "d3-2", time: "13:00", title: "Lunch at Le Fumoir", description: "Elegant café near Louvre", type: "meal", status: "optional", price: 4000 },
          { id: "d3-3", time: "15:00", title: "Montmartre Walk", description: "Sacré-Cœur & artists' quarter", type: "activity", status: "confirmed" },
          { id: "d3-4", time: "19:00", title: "Romantic Dinner", description: "Moulin Rouge area restaurant", type: "meal", status: "optional", price: 7000 }
        ]
      }
    ],
    basePrice: 125000,
    taxes: 12000,
    fees: 4000,
    companyInfo: {
      name: "European Romance Tours",
      description: "Romantic travel specialists",
      location: "Paris, France",
      address: "456 Romance Ave, Paris",
      phone: "+33 1 2345 6789",
      email: "info@europeanromance.com",
      website: "www.europeanromance.com",
      established: "2005",
      totalTrips: 8500,
      rating: 4.9,
      specialization: ["Romantic Getaways", "Honeymoons"],
      certifications: ["IATA Certified", "French Tourism Board"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Emma & James",
        avatar: "https://i.pravatar.cc/150?u=emma",
        rating: 5,
        date: "October 2024",
        trip: "Romantic Paris Getaway",
        comment: "Perfect honeymoon! Every detail was magical. The hotel was charming, the Seine cruise at sunset was breathtaking, and our guide at Versailles was wonderful. Paris is truly the city of love!",
        helpful: 98,
        images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80"]
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Spring in Paris",
        date: "April 2024",
        participants: 16,
        rating: 4.9,
        highlights: ["Cherry blossoms", "Art galleries", "Romantic cafés"],
        images: ["https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Paris Love Story",
        thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
        duration: "2:45",
        views: 12450,
        url: "#"
      }
    ]
  },
  "italy-food-tour": {
    id: "italy-food-tour",
    name: "Italian Culinary Journey",
    country: "Italy",
    destinations: ["Rome", "Florence", "Venice"],
    days: 7,
    nights: 6,
    startDate: "2025-01-10",
    priceFrom: 165000,
    rating: 4.7,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
      "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80"
    ],
    overview: "Culinary adventure through Italy! Experience authentic Italian cuisine, cooking classes, and wine tasting.",
    keyAttractions: ["Colosseum", "Vatican City", "Grand Canal", "Tuscan Vineyards"],
    inclusions: ["Flights", "4★ Hotels", "Cooking Classes", "Wine Tasting"],
    exclusions: ["Travel insurance", "Some meals", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Food Explorer", description: "Essential culinary experience", pricePerPerson: 0, features: ["Economy flights", "3-star hotels", "Basic cooking class"] },
      { id: "comfort", name: "Gourmet Plus", description: "Enhanced food journey", pricePerPerson: 35000, features: ["Premium flights", "4-star hotels", "Master chef classes"] }
    ],
    ageSuitability: "Adults and food lovers",
    tripSuitability: ['couple', 'friends'],
    timeline: [
      {
        day: 1,
        date: "10th Jan",
        title: "Arrival in Rome",
        items: [
          { id: "d1-1", time: "09:00", title: "Flight Departure", description: "Emirates • Direct • 10h", type: "flight", status: "confirmed", price: 50000 },
          { id: "d1-2", time: "19:00", title: "Arrive Rome FCO", description: "Leonardo da Vinci Airport", type: "flight", status: "confirmed", location: "Rome" },
          { id: "d1-3", time: "21:00", title: "Hotel Check-in", description: "Hotel Artemide, 4★ • Deluxe Room", type: "hotel", status: "confirmed", price: 9000, location: "Rome Centre" },
          { id: "d1-4", time: "22:00", title: "Light Italian Dinner", description: "Traditional trattoria nearby", type: "meal", status: "optional", price: 3500 }
        ]
      },
      {
        day: 2,
        date: "11th Jan",
        title: "Rome Culinary Tour",
        items: [
          { id: "d2-1", time: "09:00", title: "Market Tour", description: "Campo de' Fiori market with chef", type: "activity", status: "confirmed", price: 2500 },
          { id: "d2-2", time: "11:00", title: "Pasta Making Class", description: "Learn to make fresh pasta from scratch", type: "activity", status: "confirmed", price: 5000 },
          { id: "d2-3", time: "13:00", title: "Lunch - Your Creations", description: "Enjoy the pasta you made", type: "meal", status: "confirmed" },
          { id: "d2-4", time: "16:00", title: "Gelato Tasting", description: "Visit 3 best gelaterias", type: "activity", status: "confirmed", price: 1500 },
          { id: "d2-5", time: "19:00", title: "Roman Street Food Tour", description: "Discover local favorites", type: "activity", status: "confirmed", price: 4000 }
        ]
      },
      {
        day: 3,
        date: "12th Jan",
        title: "Rome Sightseeing & Food",
        items: [
          { id: "d3-1", time: "08:00", title: "Colosseum Tour", description: "Skip-the-line guided tour", type: "activity", status: "confirmed", price: 4500 },
          { id: "d3-2", time: "12:00", title: "Traditional Lunch", description: "Authentic Roman cuisine", type: "meal", status: "confirmed", price: 5500 },
          { id: "d3-3", time: "15:00", title: "Vatican Museums", description: "Including Sistine Chapel", type: "activity", status: "confirmed", price: 5000 },
          { id: "d3-4", time: "19:00", title: "Wine & Cheese Pairing", description: "Italian wine masterclass", type: "activity", status: "confirmed", price: 4500 }
        ]
      },
      {
        day: 4,
        date: "13th Jan",
        title: "Travel to Florence",
        items: [
          { id: "d4-1", time: "10:00", title: "Train to Florence", description: "High-speed train • 1h 30m", type: "train", status: "confirmed", price: 8000 },
          { id: "d4-2", time: "12:00", title: "Arrive Florence", description: "Transfer to hotel", type: "transfer", status: "confirmed", location: "Florence" },
          { id: "d4-3", time: "14:00", title: "Hotel Check-in", description: "Hotel Brunelleschi, 4★", type: "hotel", status: "confirmed", price: 9500, location: "Florence Centre" },
          { id: "d4-4", time: "16:00", title: "Florence Food Tour", description: "Taste local specialties", type: "activity", status: "confirmed", price: 4500 }
        ]
      }
    ],
    basePrice: 165000,
    taxes: 13000,
    fees: 4500,
    companyInfo: {
      name: "Italian Food Tours",
      description: "Culinary travel specialists",
      location: "Rome, Italy",
      address: "789 Culinary St, Rome",
      phone: "+39 06 1234 5678",
      email: "info@italianfoodtours.com",
      website: "www.italianfoodtours.com",
      established: "2008",
      totalTrips: 6000,
      rating: 4.7,
      specialization: ["Food Tours", "Wine Tasting", "Cooking Classes"],
      certifications: ["Italian Tourism Board", "Culinary Association"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Marco Rossi",
        avatar: "https://i.pravatar.cc/150?u=marco",
        rating: 5,
        date: "December 2024",
        trip: "Italian Culinary Journey",
        comment: "The best food tour ever! Making pasta from scratch was incredible, and the wine tasting in Tuscany was unforgettable. Our chef guide was passionate and knowledgeable. Highly recommend for food lovers!",
        helpful: 142,
        images: ["https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80"]
      },
      {
        id: "r2",
        name: "Lisa Anderson",
        avatar: "https://i.pravatar.cc/150?u=lisa",
        rating: 5,
        date: "November 2024",
        trip: "Italian Culinary Journey",
        comment: "Amazing culinary adventure! Every meal was spectacular. The gelato tasting and market tour were highlights. Perfect blend of cooking, culture, and sightseeing.",
        helpful: 87
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Taste of Italy - Group 18",
        date: "October 2024",
        participants: 14,
        rating: 4.8,
        highlights: ["Truffle hunting in Tuscany", "Pizza making in Naples", "Limoncello tasting", "Chef-led market tours"],
        images: ["https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Italian Food Journey",
        thumbnail: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80",
        duration: "5:30",
        views: 16780,
        url: "#"
      }
    ]
  },
  "asia-temple-trail": {
    id: "asia-temple-trail",
    name: "Southeast Asia Temple Trail",
    country: "Asia",
    destinations: ["Bangkok", "Siem Reap", "Bali"],
    days: 12,
    nights: 11,
    startDate: "2025-02-01",
    priceFrom: 95000,
    rating: 4.7,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80",
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80"
    ],
    overview: "Explore ancient temples and rich cultures across Southeast Asia. Visit Angkor Wat, Grand Palace, and Tanah Lot.",
    keyAttractions: ["Angkor Wat", "Grand Palace", "Tanah Lot Temple", "Floating Markets"],
    inclusions: ["Flights", "3★ Hotels", "Guided Tours", "Breakfast"],
    exclusions: ["Travel insurance", "Lunch & dinner", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Budget Explorer", description: "Affordable temple journey", pricePerPerson: 0, features: ["Economy flights", "3-star hotels", "Group tours"] },
      { id: "comfort", name: "Culture Plus", description: "Enhanced cultural experience", pricePerPerson: 25000, features: ["Better flights", "4-star hotels", "Private guides"] }
    ],
    ageSuitability: "Suitable for all ages",
    tripSuitability: ['family', 'friends', 'solo'],
    timeline: [
      {
        day: 1,
        date: "Feb 1, 2025",
        title: "Arrival in Bangkok",
        items: [
          { id: "d1-1", type: "flight", time: "10:00 AM", location: "Suvarnabhumi Airport", title: "Arrival & Transfer", description: "Meet and greet at airport, transfer to hotel", status: "confirmed" },
          { id: "d1-2", type: "hotel", time: "1:00 PM", location: "Bangkok", title: "Hotel Check-in", description: "Check-in at 4-star hotel in central Bangkok", status: "confirmed" },
          { id: "d1-3", type: "activity", time: "7:00 PM", location: "Chao Phraya River", title: "Welcome Dinner Cruise", description: "Traditional Thai dinner on Chao Phraya River cruise", status: "confirmed", price: 2500 }
        ]
      },
      {
        day: 2,
        date: "Feb 2, 2025",
        title: "Bangkok Temples Tour",
        items: [
          { id: "d2-1", type: "activity", time: "8:00 AM", location: "Grand Palace", title: "Grand Palace Visit", description: "Explore the stunning Grand Palace and Temple of the Emerald Buddha", status: "confirmed", price: 1500 },
          { id: "d2-2", type: "meal", time: "12:30 PM", location: "Rattanakosin", title: "Thai Lunch", description: "Authentic Thai cuisine near the temples", status: "confirmed" },
          { id: "d2-3", type: "activity", time: "2:00 PM", location: "Wat Pho", title: "Wat Pho Temple", description: "Visit the Temple of the Reclining Buddha", status: "confirmed", price: 500 }
        ]
      },
      {
        day: 3,
        date: "Feb 3, 2025",
        title: "Bangkok to Siem Reap",
        items: [
          { id: "d3-1", type: "flight", time: "9:00 AM", location: "Bangkok Airport", title: "Flight to Siem Reap", description: "Short flight to Cambodia", status: "confirmed" },
          { id: "d3-2", type: "hotel", time: "12:00 PM", location: "Siem Reap", title: "Hotel Check-in", description: "Check-in at boutique hotel near Angkor", status: "confirmed" },
          { id: "d3-3", type: "activity", time: "4:00 PM", location: "Angkor Wat", title: "Angkor Wat Sunset", description: "First glimpse of Angkor Wat at sunset", status: "confirmed", price: 3000 }
        ]
      }
    ],
    basePrice: 95000,
    taxes: 8000,
    fees: 3000,
    companyInfo: {
      name: "Asia Discoveries",
      description: "Southeast Asia specialists",
      location: "Bangkok, Thailand",
      address: "101 Temple Road, Bangkok",
      phone: "+66 2 123 4567",
      email: "info@asiadiscoveries.com",
      website: "www.asiadiscoveries.com",
      established: "2012",
      totalTrips: 9000,
      rating: 4.7,
      specialization: ["Temple Tours", "Cultural Experiences"],
      certifications: ["Thailand Tourism", "Asia Travel Association"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Priya Sharma",
        avatar: "https://i.pravatar.cc/150?u=priya",
        rating: 5,
        date: "Dec 15, 2024",
        trip: "Southeast Asia Temple Trail",
        comment: "Absolutely incredible journey! The temples were breathtaking and our guide was extremely knowledgeable. Angkor Wat at sunrise was a life-changing experience. Highly recommend!",
        images: ["https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=200&q=80"],
        helpful: 24
      },
      {
        id: "r2",
        name: "David Chen",
        avatar: "https://i.pravatar.cc/150?u=david",
        rating: 4,
        date: "Nov 22, 2024",
        trip: "Southeast Asia Temple Trail",
        comment: "Great cultural experience! The organization was excellent and hotels were comfortable. Only minor issue was the tight schedule on some days. Overall, a wonderful trip.",
        images: [],
        helpful: 18
      },
      {
        id: "r3",
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5,
        date: "Oct 30, 2024",
        trip: "Southeast Asia Temple Trail",
        comment: "Perfect blend of culture, history, and relaxation. The floating markets in Bangkok and the ancient temples in Siem Reap were highlights. Would do it again!",
        images: ["https://images.unsplash.com/photo-1528181304800-259b08848526?w=200&q=80"],
        helpful: 31
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Southeast Asia Temple Trail - Group 42",
        date: "Nov 2024",
        participants: 18,
        rating: 4.8,
        highlights: [
          "Explored 12 ancient temples across 3 countries",
          "Traditional Thai cooking class experience",
          "Sunrise at Angkor Wat ceremony",
          "Balinese temple blessing ceremony"
        ],
        images: [
          "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=200&q=80",
          "https://images.unsplash.com/photo-1528181304800-259b08848526?w=200&q=80"
        ]
      },
      {
        id: "pt2",
        name: "Southeast Asia Temple Trail - Group 41",
        date: "Oct 2024",
        participants: 22,
        rating: 4.9,
        highlights: [
          "Met with local Buddhist monks",
          "Traditional blessing at Grand Palace",
          "Elephant sanctuary visit in Bali",
          "Authentic Khmer cuisine tasting"
        ],
        images: [
          "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=200&q=80"
        ]
      },
      {
        id: "pt3",
        name: "Southeast Asia Temple Trail - Group 40",
        date: "Sep 2024",
        participants: 16,
        rating: 4.7,
        highlights: [
          "Participated in water festival celebrations",
          "Private boat tour of floating markets",
          "Yoga session at Tanah Lot Temple",
          "Cultural dance performance in Ubud"
        ],
        images: []
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Angkor Wat Sunrise Experience",
        thumbnail: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80",
        duration: "3:42",
        views: 12450,
        url: "#"
      },
      {
        id: "v2",
        title: "Grand Palace Bangkok Tour",
        thumbnail: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
        duration: "5:18",
        views: 8920,
        url: "#"
      },
      {
        id: "v3",
        title: "Bali Temple Highlights",
        thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
        duration: "4:35",
        views: 6780,
        url: "#"
      }
    ]
  },
  "australia-outback": {
    id: "australia-outback",
    name: "Australian Outback Experience",
    country: "Australia",
    destinations: ["Sydney", "Cairns", "Uluru"],
    days: 9,
    nights: 8,
    startDate: "2025-03-01",
    priceFrom: 285000,
    rating: 4.8,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80"
    ],
    overview: "Adventure through Australia's iconic landscapes! Experience Sydney, Great Barrier Reef, and the sacred Uluru.",
    keyAttractions: ["Great Barrier Reef", "Uluru", "Sydney Opera House", "Blue Mountains"],
    inclusions: ["Flights", "4★ Hotels", "Snorkeling", "Breakfast"],
    exclusions: ["Travel insurance", "Lunch & dinner", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Outback Explorer", description: "Essential Australian adventure", pricePerPerson: 0, features: ["Economy flights", "3-star hotels", "Group tours"] },
      { id: "comfort", name: "Adventure Plus", description: "Enhanced outback experience", pricePerPerson: 45000, features: ["Premium flights", "4-star hotels", "Private excursions"] }
    ],
    ageSuitability: "Suitable for all ages",
    tripSuitability: ['family', 'friends'],
    timeline: [
      {
        day: 1,
        date: "1st Mar",
        title: "Arrival in Sydney",
        items: [
          { id: "d1-1", time: "06:00", title: "Flight Departure", description: "Qantas • Direct • 14h", type: "flight", status: "confirmed", price: 95000 },
          { id: "d1-2", time: "20:00", title: "Arrive Sydney", description: "Kingsford Smith Airport", type: "flight", status: "confirmed", location: "Sydney" },
          { id: "d1-3", time: "22:00", title: "Hotel Check-in", description: "Shangri-La Sydney, 4★ • Harbour View", type: "hotel", status: "confirmed", price: 18000, location: "The Rocks" }
        ]
      },
      {
        day: 2,
        date: "2nd Mar",
        title: "Sydney Icons",
        items: [
          { id: "d2-1", time: "09:00", title: "Sydney Opera House Tour", description: "Behind-the-scenes guided tour", type: "activity", status: "confirmed", price: 4500 },
          { id: "d2-2", time: "11:00", title: "Harbour Bridge Climb", description: "3-hour bridge climb experience", type: "activity", status: "confirmed", price: 12000 },
          { id: "d2-3", time: "15:00", title: "Bondi Beach Visit", description: "Coastal walk and beach time", type: "activity", status: "confirmed" },
          { id: "d2-4", time: "19:00", title: "Seafood Dinner", description: "Sydney Fish Market", type: "meal", status: "optional", price: 6500 }
        ]
      },
      {
        day: 3,
        date: "3rd Mar",
        title: "Blue Mountains Day Trip",
        items: [
          { id: "d3-1", time: "08:00", title: "Blue Mountains Tour", description: "Full day guided tour • Three Sisters", type: "activity", status: "confirmed", price: 8000 },
          { id: "d3-2", time: "12:00", title: "Lunch in Katoomba", description: "Mountain view restaurant", type: "meal", status: "confirmed", price: 3500 },
          { id: "d3-3", time: "14:00", title: "Scenic World", description: "Railway, cableway & walkway", type: "activity", status: "confirmed", price: 5000 },
          { id: "d3-4", time: "18:00", title: "Return to Sydney", description: "Evening free", type: "transfer", status: "confirmed" }
        ]
      },
      {
        day: 4,
        date: "4th Mar",
        title: "Flight to Cairns",
        items: [
          { id: "d4-1", time: "10:00", title: "Flight to Cairns", description: "Domestic flight • 3h", type: "flight", status: "confirmed", price: 15000 },
          { id: "d4-2", time: "14:00", title: "Arrive Cairns", description: "Transfer to hotel", type: "transfer", status: "confirmed", location: "Cairns" },
          { id: "d4-3", time: "16:00", title: "Hotel Check-in", description: "Pullman Reef Casino, 4★", type: "hotel", status: "confirmed", price: 14000, location: "Cairns City" },
          { id: "d4-4", time: "18:00", title: "Cairns Esplanade", description: "Lagoon pool and night markets", type: "activity", status: "confirmed" }
        ]
      },
      {
        day: 5,
        date: "5th Mar",
        title: "Great Barrier Reef",
        items: [
          { id: "d5-1", time: "08:00", title: "Reef Day Cruise", description: "Full day snorkeling adventure", type: "activity", status: "confirmed", price: 15000 },
          { id: "d5-2", time: "10:00", title: "Snorkeling Session 1", description: "Outer reef exploration", type: "activity", status: "confirmed" },
          { id: "d5-3", time: "12:00", title: "Buffet Lunch on Boat", description: "Fresh seafood buffet", type: "meal", status: "confirmed" },
          { id: "d5-4", time: "14:00", title: "Snorkeling Session 2", description: "Different reef location", type: "activity", status: "confirmed" }
        ]
      }
    ],
    basePrice: 285000,
    taxes: 25000,
    fees: 8000,
    companyInfo: {
      name: "Aussie Adventures",
      description: "Australian outback specialists",
      location: "Sydney, Australia",
      address: "202 Outback Ave, Sydney",
      phone: "+61 2 9876 5432",
      email: "info@aussieadventures.com",
      website: "www.aussieadventures.com",
      established: "2015",
      totalTrips: 4500,
      rating: 4.8,
      specialization: ["Outback Tours", "Wildlife Experiences"],
      certifications: ["Australian Tourism", "Adventure Travel Association"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Jessica Lee",
        avatar: "https://i.pravatar.cc/150?u=jessica",
        rating: 5,
        date: "January 2025",
        trip: "Australian Outback Experience",
        comment: "Absolutely incredible! The Great Barrier Reef snorkeling was a dream come true. Sydney was stunning and the Blue Mountains were breathtaking. Professional guides throughout. Worth every penny!",
        helpful: 112,
        images: ["https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80"]
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Aussie Adventure - Group 8",
        date: "December 2024",
        participants: 15,
        rating: 4.9,
        highlights: ["Great Barrier Reef diving", "Outback camping", "Wildlife encounters", "Sydney Harbour cruise"],
        images: ["https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Great Barrier Reef Adventure",
        thumbnail: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80",
        duration: "6:20",
        views: 24560,
        url: "#"
      }
    ]
  },
  "uae-luxury": {
    id: "uae-luxury",
    name: "Luxury Dubai & Abu Dhabi",
    country: "UAE",
    destinations: ["Dubai", "Abu Dhabi"],
    days: 6,
    nights: 5,
    startDate: "2025-01-15",
    priceFrom: 145000,
    rating: 4.9,
    reviewCount: 421,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80"
    ],
    overview: "Experience ultimate luxury in UAE! Visit Burj Khalifa, Sheikh Zayed Mosque, and enjoy a thrilling desert safari.",
    keyAttractions: ["Burj Khalifa", "Sheikh Zayed Mosque", "Desert Safari", "Dubai Mall"],
    inclusions: ["Flights", "5★ Hotels", "Desert Safari", "Breakfast"],
    exclusions: ["Travel insurance", "Lunch & dinner", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Luxury Standard", description: "Essential luxury experience", pricePerPerson: 0, features: ["Economy flights", "4-star hotels", "Standard safari"] },
      { id: "comfort", name: "Ultra Luxury", description: "Premium UAE experience", pricePerPerson: 55000, features: ["Business class", "5-star hotels", "VIP experiences"] }
    ],
    ageSuitability: "Suitable for all ages",
    tripSuitability: ['family', 'couple', 'friends'],
    timeline: [
      {
        day: 1,
        date: "15th Jan",
        title: "Arrival in Dubai",
        items: [
          { id: "d1-1", time: "07:00", title: "Flight Departure", description: "Emirates • Direct • 4h", type: "flight", status: "confirmed", price: 42000 },
          { id: "d1-2", time: "11:00", title: "Arrive Dubai", description: "Dubai International Airport", type: "flight", status: "confirmed", location: "Dubai" },
          { id: "d1-3", time: "13:00", title: "Hotel Check-in", description: "Atlantis The Palm, 5★ • Ocean View Suite", type: "hotel", status: "confirmed", price: 25000, location: "Palm Jumeirah" },
          { id: "d1-4", time: "16:00", title: "Aquaventure Waterpark", description: "Free access for hotel guests", type: "activity", status: "confirmed" },
          { id: "d1-5", time: "19:00", title: "Welcome Dinner", description: "Nobu restaurant at Atlantis", type: "meal", status: "optional", price: 8000 }
        ]
      },
      {
        day: 2,
        date: "16th Jan",
        title: "Dubai Highlights",
        items: [
          { id: "d2-1", time: "10:00", title: "Burj Khalifa Visit", description: "Level 124 & 125 • Skip-the-line", type: "activity", status: "confirmed", price: 5000 },
          { id: "d2-2", time: "12:00", title: "Dubai Mall Exploration", description: "World's largest shopping mall", type: "activity", status: "confirmed" },
          { id: "d2-3", time: "14:00", title: "Lunch at At.mosphere", description: "Burj Khalifa restaurant", type: "meal", status: "optional", price: 12000 },
          { id: "d2-4", time: "18:00", title: "Desert Safari", description: "Dune bashing, camel ride, BBQ dinner", type: "activity", status: "confirmed", price: 6500 }
        ]
      },
      {
        day: 3,
        date: "17th Jan",
        title: "Abu Dhabi Day Trip",
        items: [
          { id: "d3-1", time: "08:00", title: "Transfer to Abu Dhabi", description: "Private car • 1h 30m", type: "car", status: "confirmed", price: 4000 },
          { id: "d3-2", time: "10:00", title: "Sheikh Zayed Mosque", description: "Grand Mosque guided tour", type: "activity", status: "confirmed", price: 3000 },
          { id: "d3-3", time: "13:00", title: "Lunch at Emirates Palace", description: "5-star hotel dining", type: "meal", status: "optional", price: 9000 },
          { id: "d3-4", time: "15:00", title: "Louvre Abu Dhabi", description: "Art museum visit", type: "activity", status: "confirmed", price: 3500 },
          { id: "d3-5", time: "18:00", title: "Return to Dubai", description: "Evening at leisure", type: "car", status: "confirmed" }
        ]
      },
      {
        day: 4,
        date: "18th Jan",
        title: "Luxury & Shopping",
        items: [
          { id: "d4-1", time: "10:00", title: "Gold Souk Visit", description: "Traditional gold market", type: "activity", status: "confirmed" },
          { id: "d4-2", time: "12:00", title: "Spice Souk", description: "Aromatic spice market", type: "activity", status: "confirmed" },
          { id: "d4-3", time: "14:00", title: "Lunch Cruise", description: "Dubai Marina yacht lunch", type: "meal", status: "confirmed", price: 7500 },
          { id: "d4-4", time: "17:00", title: "Helicopter Tour", description: "15-minute city tour", type: "activity", status: "optional", price: 18000 }
        ]
      }
    ],
    basePrice: 145000,
    taxes: 12000,
    fees: 5000,
    companyInfo: {
      name: "UAE Luxury Tours",
      description: "Luxury travel specialists",
      location: "Dubai, UAE",
      address: "303 Luxury Blvd, Dubai",
      phone: "+971 4 123 4567",
      email: "info@uaeluxurytours.com",
      website: "www.uaeluxurytours.com",
      established: "2010",
      totalTrips: 12000,
      rating: 4.9,
      specialization: ["Luxury Travel", "Desert Safaris"],
      certifications: ["UAE Tourism", "Luxury Travel Association"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Ahmed Al-Sayed",
        avatar: "https://i.pravatar.cc/150?u=ahmed",
        rating: 5,
        date: "December 2024",
        trip: "Luxury Dubai & Abu Dhabi",
        comment: "Ultimate luxury experience! Atlantis was spectacular, the desert safari was thrilling, and Sheikh Zayed Mosque was absolutely stunning. Every detail was perfect. Highly recommend!",
        helpful: 156,
        images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80"]
      },
      {
        id: "r2",
        name: "Maria Garcia",
        avatar: "https://i.pravatar.cc/150?u=maria",
        rating: 5,
        date: "November 2024",
        trip: "Luxury Dubai & Abu Dhabi",
        comment: "Incredible trip! Burj Khalifa views were breathtaking, shopping was amazing, and the service everywhere was world-class. Perfect for a luxury getaway.",
        helpful: 98
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "UAE Luxury Experience - Group 22",
        date: "October 2024",
        participants: 12,
        rating: 5.0,
        highlights: ["Private yacht tour", "VIP shopping experience", "Michelin-star dining", "Helicopter city tour"],
        images: ["https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Dubai Luxury Highlights",
        thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80",
        duration: "4:50",
        views: 31240,
        url: "#"
      }
    ]
  },
  "scotland-highlands": {
    id: "scotland-highlands",
    name: "Scottish Highlands Escape",
    country: "UK",
    destinations: ["Edinburgh", "Inverness", "Isle of Skye"],
    days: 6,
    nights: 5,
    startDate: "2025-04-01",
    priceFrom: 155000,
    rating: 4.6,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1551980702-3cd5d7c0ce4d?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1551980702-3cd5d7c0ce4d?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
    ],
    overview: "Explore the stunning Scottish Highlands! Visit Edinburgh Castle, Loch Ness, and the magical Isle of Skye.",
    keyAttractions: ["Edinburgh Castle", "Loch Ness", "Fairy Pools", "Highland Scenery"],
    inclusions: ["Flights", "3★ Hotels", "Car Rental", "Breakfast"],
    exclusions: ["Travel insurance", "Fuel costs", "Lunch & dinner", "Personal expenses"],
    availableClasses: [
      { id: "economy", name: "Highland Explorer", description: "Scenic Highland adventure", pricePerPerson: 0, features: ["Economy flights", "3-star hotels", "Compact car"] },
      { id: "comfort", name: "Highland Plus", description: "Enhanced Scottish experience", pricePerPerson: 30000, features: ["Premium flights", "4-star hotels", "SUV rental"] }
    ],
    ageSuitability: "Suitable for all ages",
    tripSuitability: ['family', 'friends', 'solo'],
    timeline: [
      {
        day: 1,
        date: "1st Apr",
        title: "Arrival in Edinburgh",
        items: [
          { id: "d1-1", time: "08:00", title: "Flight Departure", description: "British Airways • Direct • 9h", type: "flight", status: "confirmed", price: 52000 },
          { id: "d1-2", time: "17:00", title: "Arrive Edinburgh", description: "Edinburgh Airport", type: "flight", status: "confirmed", location: "Edinburgh" },
          { id: "d1-3", time: "19:00", title: "Hotel Check-in", description: "The Balmoral Hotel, 5★ • Deluxe Room", type: "hotel", status: "confirmed", price: 15000, location: "Edinburgh Centre" },
          { id: "d1-4", time: "20:30", title: "Scottish Dinner", description: "Traditional haggis welcome meal", type: "meal", status: "optional", price: 4500 }
        ]
      },
      {
        day: 2,
        date: "2nd Apr",
        title: "Edinburgh Exploration",
        items: [
          { id: "d2-1", time: "09:00", title: "Edinburgh Castle Tour", description: "Guided historical tour • 2 hours", type: "activity", status: "confirmed", price: 4000 },
          { id: "d2-2", time: "11:30", title: "Royal Mile Walk", description: "Historic street exploration", type: "activity", status: "confirmed" },
          { id: "d2-3", time: "13:00", title: "Lunch at The Witchery", description: "Gothic restaurant by castle", type: "meal", status: "optional", price: 5000 },
          { id: "d2-4", time: "15:00", title: "Holyrood Palace", description: "Royal residence tour", type: "activity", status: "confirmed", price: 3500 },
          { id: "d2-5", time: "18:00", title: "Arthur's Seat Hike", description: "Sunset views of Edinburgh", type: "activity", status: "optional" }
        ]
      },
      {
        day: 3,
        date: "3rd Apr",
        title: "Drive to Inverness",
        items: [
          { id: "d3-1", time: "09:00", title: "Pick up Rental Car", description: "SUV for 4 days • Full insurance", type: "car", status: "confirmed", price: 18000 },
          { id: "d3-2", time: "10:00", title: "Drive to Loch Ness", description: "Scenic Highland drive • 3h 30m", type: "car", status: "confirmed" },
          { id: "d3-3", time: "14:00", title: "Loch Ness Cruise", description: "Monster hunting boat tour", type: "activity", status: "confirmed", price: 4500 },
          { id: "d3-4", time: "16:00", title: "Urquhart Castle", description: "Ruined castle exploration", type: "activity", status: "confirmed", price: 3000 },
          { id: "d3-5", time: "18:00", title: "Arrive Inverness", description: "Hotel check-in • Evening free", type: "hotel", status: "confirmed", price: 12000, location: "Inverness" }
        ]
      },
      {
        day: 4,
        date: "4th Apr",
        title: "Isle of Skye Day Trip",
        items: [
          { id: "d4-1", time: "08:00", title: "Drive to Isle of Skye", description: "2h 30m scenic drive", type: "car", status: "confirmed" },
          { id: "d4-2", time: "11:00", title: "Fairy Pools Walk", description: "Crystal clear pools hike", type: "activity", status: "confirmed" },
          { id: "d4-3", time: "13:00", title: "Lunch in Portree", description: "Colorful harbor town", type: "meal", status: "optional", price: 3500 },
          { id: "d4-4", time: "15:00", title: "Old Man of Storr", description: "Iconic rock formation", type: "activity", status: "confirmed" },
          { id: "d4-5", time: "18:00", title: "Return to Inverness", description: "Evening drive back", type: "car", status: "confirmed" }
        ]
      }
    ],
    basePrice: 155000,
    taxes: 13000,
    fees: 4000,
    companyInfo: {
      name: "Scottish Highland Tours",
      description: "Highland travel specialists",
      location: "Edinburgh, Scotland",
      address: "404 Highland Way, Edinburgh",
      phone: "+44 131 234 5678",
      email: "info@scotlandhighlands.com",
      website: "www.scotlandhighlands.com",
      established: "2007",
      totalTrips: 7500,
      rating: 4.6,
      specialization: ["Highland Tours", "Nature Experiences"],
      certifications: ["Scotland Tourism", "UK Travel Association"]
    },
    customerReviews: [
      {
        id: "r1",
        name: "Robert MacLeod",
        avatar: "https://i.pravatar.cc/150?u=robert",
        rating: 5,
        date: "September 2024",
        trip: "Scottish Highlands Escape",
        comment: "Absolutely magical! The Highlands are breathtaking, Loch Ness was mysterious, and the Isle of Skye was beyond beautiful. Perfect for nature lovers. The freedom of the rental car made it even better!",
        helpful: 134,
        images: ["https://images.unsplash.com/photo-1551980702-3cd5d7c0ce4d?w=400&q=80"]
      },
      {
        id: "r2",
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?u=emma-w",
        rating: 4,
        date: "August 2024",
        trip: "Scottish Highlands Escape",
        comment: "Wonderful Highland adventure! Edinburgh Castle was impressive and the scenery was stunning. Weather can be unpredictable, but that's part of the Scottish charm!",
        helpful: 78
      }
    ],
    previousTrips: [
      {
        id: "pt1",
        name: "Highlands Explorer - Group 14",
        date: "July 2024",
        participants: 16,
        rating: 4.7,
        highlights: ["Whisky distillery tour", "Highland cattle encounter", "Bagpipe performance", "Castle explorations"],
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Scottish Highlands Beauty",
        thumbnail: "https://images.unsplash.com/photo-1551980702-3cd5d7c0ce4d?w=400&q=80",
        duration: "5:45",
        views: 19850,
        url: "#"
      }
    ]
  }
};

export default function TripDetailNew() {
  const { tripId } = useParams<{ tripId: string }>();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useUrlTab("overview");
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 });
  
  // Customization state
  const [selectedClass, setSelectedClass] = useState("economy");
  const [selectedMealTier, setSelectedMealTier] = useState("standard");
  const [travelTiers, setTravelTiers] = useState({
    bus: "standard",
    car: "premium",
    flight: "premium",
    train: "standard"
  });
  const [selectedDay, setSelectedDay] = useState(1);

  const trip = tripId ? MOCK_TRIP_DATA[tripId] : null;

  if (!trip) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Trip not found</h2>
          <p className="text-white/60 mb-4">The trip you're looking for doesn't exist</p>
          <Button onClick={() => navigate("/trip-now")} className="bg-white/10 hover:bg-white/15 rounded-none">
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const getTimelineIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      case 'activity': return <Sparkles className="h-4 w-4" />;
      case 'meal': return <Utensils className="h-4 w-4" />;
      case 'transfer': return <Navigation className="h-4 w-4" />;
      case 'train': return <Train className="h-4 w-4" />;
    }
  };

  // Calculate total price with customizations
  const classPrice = trip.availableClasses.find(c => c.id === selectedClass)?.pricePerPerson || 0;
  const mealTierPrice = MEAL_TIERS.find(t => t.id === selectedMealTier)?.pricePerPerson || 0;
  const totalMealPrice = mealTierPrice * (travelers.adults + travelers.children);

  let travelUpgradeTotal = 0;
  Object.entries(travelTiers).forEach(([component, tier]) => {
    const tierData = TRAVEL_TIERS.find(t => t.id === tier);
    if (tierData && tier !== "standard") {
      travelUpgradeTotal += tierData.pricePerPerson * (travelers.adults + travelers.children);
    }
  });

  const totalPrice = (trip.basePrice + classPrice + mealTierPrice) * (travelers.adults + travelers.children) + trip.taxes + trip.fees + travelUpgradeTotal;

  const handleBook = () => {
    const params = new URLSearchParams({
      adults: travelers.adults.toString(),
      children: travelers.children.toString(),
      class: selectedClass,
      mealTier: selectedMealTier,
      totalPrice: totalPrice.toString()
    });
    navigate(`/trip-booking/${trip.id}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header with Hero Image */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trip-now')}
            className="absolute top-4 left-4 text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-xl"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-xl">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-xl">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xl px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-white text-sm font-medium">{trip.rating}</span>
                <span className="text-white/60 text-xs">({trip.reviewCount})</span>
              </div>
              <Badge className="bg-white/20 backdrop-blur-xl text-white border-0 rounded-full text-xs">
                {trip.country}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-xl text-white border-0 rounded-full text-xs">
                {trip.days}D/{trip.nights}N
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-wide mb-2">{trip.name}</h1>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MapPin className="h-4 w-4" />
              <span>{trip.destinations.join(' → ')}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="overflow-x-auto hide-scrollbar">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none justify-start px-4">
                {[
                  { value: "overview", label: "Overview" },
                  { value: "class", label: "Class" },
                  { value: "premium", label: "Travel Premium" },
                  { value: "timeline", label: "Timeline" },
                  { value: "gallery", label: "Gallery" },
                  { value: "videos", label: "Videos" },
                  { value: "company", label: "Company" },
                  { value: "reviews", label: "Reviews" },
                  { value: "previous-trips", label: "Previous Trips" }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent px-4 whitespace-nowrap"
                    data-testid={`tab-${tab.value}`}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[240px] px-4 pb-6 space-y-6 max-w-screen-lg mx-auto">
        <Tabs value={activeTab} className="space-y-6">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* Cardless: About This Trip */}
            <div className="space-y-4">
              <h3 className="text-white text-base font-semibold tracking-wider">ABOUT THIS TRIP</h3>
              <p className="text-white/80 text-sm leading-relaxed">{trip.overview}</p>
              
              <Separator className="bg-white/10" />
              
              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">Duration</p>
                      <p className="text-white text-sm font-medium">{trip.days}D / {trip.nights}N</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">Destinations</p>
                      <p className="text-white text-sm font-medium">{trip.destinations.length} Cities</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">Start Date</p>
                      <p className="text-white text-sm font-medium">{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">Rating</p>
                      <p className="text-white text-sm font-medium">{trip.rating} ({trip.reviewCount})</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Suitability Section */}
              {trip.tripSuitability && trip.tripSuitability.length > 0 && (
                <>
                  <Separator className="bg-white/10" />
                  <div>
                    <h4 className="text-white text-sm font-semibold tracking-wider mb-3">PERFECT FOR</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {trip.tripSuitability.map((type) => {
                        const suitabilityConfig = {
                          family: { icon: Baby, label: 'Family Friendly' },
                          couple: { icon: Heart, label: 'Couple Friendly' },
                          friends: { icon: Users, label: 'Friends' },
                          party: { icon: PartyPopper, label: 'Party Vibes' },
                          solo: { icon: Glasses, label: 'Solo Travelers' }
                        };
                        const config = suitabilityConfig[type];
                        const Icon = config.icon;
                        
                        return (
                          <div key={type} className="bg-white/5 border border-white/20 p-3 flex items-center gap-3">
                            <Icon className="h-5 w-5 flex-shrink-0 text-white" strokeWidth={1.5} />
                            <span className="text-sm font-medium text-white">{config.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Card: Key Attractions */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white text-base font-semibold tracking-wider">KEY ATTRACTIONS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {trip.keyAttractions.map((attraction, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{attraction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/10 border border-white/20 rounded-none">
                <CardHeader>
                  <CardTitle className="text-white text-sm font-semibold tracking-wider flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" fill="currentColor" />
                    </div>
                    INCLUDED
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trip.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-white flex-shrink-0 mt-0.5" />
                        <span className="text-white text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border border-white/10 rounded-none">
                <CardHeader>
                  <CardTitle className="text-white text-sm font-semibold tracking-wider flex items-center gap-2">
                    <div className="w-5 h-5 border border-white/40 flex items-center justify-center">
                      <span className="text-white/60 text-xs">✕</span>
                    </div>
                    EXCLUDED
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trip.exclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-white/40 text-xs flex-shrink-0 mt-0.5">✕</span>
                        <span className="text-white/60 text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Available Class Tab */}
          <TabsContent value="class" className="space-y-6 mt-0">
            <div className="space-y-3">
              <div className="mb-4">
                <h3 className="text-white text-base font-semibold tracking-wider">CHOOSE YOUR TRAVEL CLASS</h3>
                <p className="text-white/60 text-xs mt-2">Select the comfort level that suits your journey</p>
              </div>
              <RadioGroup value={selectedClass} onValueChange={setSelectedClass}>
                <div className="space-y-3">
                  {trip.availableClasses.map((travelClass) => (
                    <button
                      key={travelClass.id}
                      onClick={() => setSelectedClass(travelClass.id)}
                      className={cn(
                        "w-full p-4 border-b transition-all text-left",
                        selectedClass === travelClass.id 
                          ? "border-white bg-white/5" 
                          : "border-white/10 hover:border-white/30"
                      )}
                    >
                      <RadioGroupItem 
                        value={travelClass.id} 
                        id={`class-${travelClass.id}`} 
                        className="sr-only" 
                      />
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className={cn(
                            "font-light tracking-wider text-base mb-1 transition-opacity",
                            selectedClass === travelClass.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                          )}>{travelClass.name}</h4>
                          <p className="text-white/40 text-xs font-light">{travelClass.description}</p>
                        </div>
                        <div className="text-right">
                          {travelClass.pricePerPerson > 0 ? (
                            <>
                              <p className={cn(
                                "font-light text-lg",
                                selectedClass === travelClass.id ? "text-white" : "text-white/60"
                              )}>+₹{travelClass.pricePerPerson.toLocaleString()}</p>
                              <p className="text-white/40 text-xs font-light">per person</p>
                            </>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none font-light text-xs">
                              Included
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {travelClass.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-white/60" />
                            <span className="text-white/70 text-xs font-light">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          {/* Travel Level Premium Tab */}
          <TabsContent value="premium" className="space-y-6 mt-0">
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-white text-base font-semibold tracking-wider flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  CUSTOMIZE YOUR TRAVEL EXPERIENCE
                </h3>
                <p className="text-white/60 text-xs mt-2 font-light">Select premium levels for different travel modes based on {travelers.adults + travelers.children} traveler(s)</p>
              </div>
              
              {TRAVEL_COMPONENTS.map((component) => {
                const Icon = component.icon;
                const currentTier = TRAVEL_TIERS.find(t => t.id === travelTiers[component.id as keyof typeof travelTiers]);
                return (
                  <div key={component.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white/80" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-light tracking-wider">{component.name}</p>
                          <p className="text-white/60 text-xs font-light">{currentTier?.description}</p>
                        </div>
                      </div>
                    </div>
                    <RadioGroup 
                      value={travelTiers[component.id as keyof typeof travelTiers]} 
                      onValueChange={(value) => setTravelTiers(prev => ({ ...prev, [component.id]: value }))}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {TRAVEL_TIERS.map((tier) => (
                          <div key={tier.id} className="relative">
                            <RadioGroupItem 
                              value={tier.id} 
                              id={`${component.id}-${tier.id}`} 
                              className="peer sr-only" 
                            />
                            <Label 
                              htmlFor={`${component.id}-${tier.id}`}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 border cursor-pointer transition-all h-full",
                                travelTiers[component.id as keyof typeof travelTiers] === tier.id
                                  ? "bg-white text-black border-white"
                                  : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40"
                              )}
                            >
                              <span className="text-xs font-light mb-1">{tier.name}</span>
                              <span className="text-[10px] opacity-80 text-center leading-tight font-light">{tier.description}</span>
                              <span className="text-[10px] mt-2 font-light">
                                {tier.pricePerPerson === 0 ? "Included" : `+₹${tier.pricePerPerson.toLocaleString()}`}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {currentTier?.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/5 p-2">
                          <CheckCircle className="h-3 w-3 text-white/60 flex-shrink-0" />
                          <span className="text-white/70 text-xs font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="bg-white/10" />
                  </div>
                );
              })}

              {/* Meal Customization */}
              <div className="space-y-3 pt-4">
                <h4 className="text-white font-semibold tracking-wider flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  MEAL PREFERENCES
                </h4>
                <RadioGroup value={selectedMealTier} onValueChange={setSelectedMealTier}>
                  <div className="space-y-3">
                    {MEAL_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedMealTier(tier.id)}
                        className={cn(
                          "w-full p-4 border-b cursor-pointer transition-all text-left",
                          selectedMealTier === tier.id
                            ? "bg-white/5 border-white"
                            : "border-white/10 hover:border-white/30"
                        )}
                      >
                        <RadioGroupItem value={tier.id} id={`meal-${tier.id}`} className="sr-only" />
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className={cn(
                              "text-sm font-light tracking-wider transition-opacity",
                              selectedMealTier === tier.id ? "text-white opacity-100" : "text-white/60 opacity-60"
                            )}>{tier.name}</p>
                            <p className="text-white/40 text-xs font-light">{tier.description}</p>
                          </div>
                          {tier.pricePerPerson > 0 ? (
                            <div className="text-right">
                              <p className={cn(
                                "font-light",
                                selectedMealTier === tier.id ? "text-white" : "text-white/60"
                              )}>+₹{tier.pricePerPerson.toLocaleString()}</p>
                              <p className="text-white/40 text-xs font-light">per person</p>
                            </div>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-none font-light text-xs">Included</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {tier.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-white/60" />
                              <span className="text-white/70 text-xs font-light">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6 mt-0">
            {/* Horizontal Day Selector */}
            <div className="sticky top-[260px] z-40 bg-black/95 backdrop-blur-xl border-y border-white/10 -mx-4 px-4 py-3">
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-2">
                  {trip.timeline.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day.day)}
                      className={cn(
                        "flex-shrink-0 px-4 py-3 border transition-all min-w-[100px]",
                        selectedDay === day.day
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                      )}
                      data-testid={`button-day-${day.day}`}
                    >
                      <div className="text-center">
                        <div className="text-xs font-light uppercase">Day {day.day}</div>
                        <div className="text-sm font-medium mt-1">{day.date}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Day Content */}
            {trip.timeline.filter(day => day.day === selectedDay).map((dayData) => (
              <div key={dayData.day} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Day {dayData.day}</h3>
                    <p className="text-white/60 text-sm">{dayData.title}</p>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                    {dayData.items.length} Activities
                  </Badge>
                </div>

                {/* Timeline Items */}
                <div className="space-y-4">
                  {dayData.items.map((item, idx) => (
                    <div key={item.id} className={cn(
                      "relative pl-8",
                      idx !== dayData.items.length - 1 && "pb-8"
                    )}>
                      {/* Timeline Line */}
                      {idx !== dayData.items.length - 1 && (
                        <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-white/20" />
                      )}
                      
                      {/* Timeline Dot */}
                      <div className={cn(
                        "absolute left-0 w-8 h-8 border-2 flex items-center justify-center",
                        item.status === 'confirmed' 
                          ? "bg-white/10 border-white" 
                          : "bg-white/5 border-white/40"
                      )}>
                        {getTimelineIcon(item.type)}
                      </div>

                      {/* Content */}
                      <Card className="bg-white/5 border border-white/10 rounded-none">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-white/60" />
                                <span className="text-xs text-white/60 font-light">{item.time}</span>
                              </div>
                              {item.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-white/60" />
                                  <span className="text-xs text-white/60">{item.location}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={cn(
                              "border rounded-none text-[10px]",
                              item.status === 'confirmed'
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            )}>
                              {item.status}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                          <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
                          {item.price && (
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                              <span className="text-xs text-white/60">Price</span>
                              <span className="text-sm text-white font-medium">₹{item.price.toLocaleString()}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6 mt-0">
            <div className="grid grid-cols-2 gap-4">
              {trip.images.map((image, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden group cursor-pointer">
                  <img 
                    src={image} 
                    alt={`${trip.name} - ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6 mt-0">
            <div className="grid gap-4">
              {trip.videos.map((video) => (
                <div key={video.id} className="overflow-hidden group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden bg-white/5 border border-white/10">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <PlayCircle className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xl px-2 py-1 text-white text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="pt-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-medium mb-1">{video.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-white/60">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{video.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6 mt-0">
            {/* Cardless: Company Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white text-xl font-bold mb-2">{trip.companyInfo.name}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white text-sm font-medium">{trip.companyInfo.rating}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4 bg-white/20" />
                    <span className="text-white/60 text-sm">{trip.companyInfo.totalTrips.toLocaleString()}+ trips</span>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                  Est. {trip.companyInfo.established}
                </Badge>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{trip.companyInfo.description}</p>
            </div>

            {/* Cardless: Contact Info */}
            <div className="space-y-4">
              <Separator className="bg-white/10" />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-white/60" />
                    <div>
                      <p className="text-white/60 text-xs">Location</p>
                      <p className="text-white text-sm">{trip.companyInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-white/60" />
                    <div>
                      <p className="text-white/60 text-xs">Address</p>
                      <p className="text-white text-sm">{trip.companyInfo.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-white/60" />
                    <div>
                      <p className="text-white/60 text-xs">Phone</p>
                      <p className="text-white text-sm">{trip.companyInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-white/60" />
                    <div>
                      <p className="text-white/60 text-xs">Email</p>
                      <p className="text-white text-sm">{trip.companyInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-white/60" />
                    <div>
                      <p className="text-white/60 text-xs">Website</p>
                      <p className="text-white text-sm">{trip.companyInfo.website}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Specializations */}
            <Card className="bg-white/5 border border-white/10 rounded-none">
              <CardHeader>
                <CardTitle className="text-white text-sm font-semibold">SPECIALIZATIONS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trip.companyInfo.specialization.map((spec, idx) => (
                    <Badge key={idx} className="bg-white/10 text-white border-white/20 rounded-none">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cardless: Certifications */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-base tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4" />
                CERTIFICATIONS
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {trip.companyInfo.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span className="text-white/80 text-xs">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6 mt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-white text-base font-semibold tracking-wider">CUSTOMER REVIEWS</h3>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-white text-xl font-bold">{trip.rating}</span>
                  <span className="text-white/60 text-sm">({trip.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="space-y-4">
                {trip.customerReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-white/5 border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium text-sm">{review.name}</h4>
                          <span className="text-white/60 text-xs">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3 w-3",
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-white/20"
                                )}
                              />
                            ))}
                          </div>
                          <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[10px]">
                            {review.trip}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-3">{review.comment}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="w-20 h-20 object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Previous Trips Tab */}
          <TabsContent value="previous-trips" className="space-y-6 mt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-white text-base font-semibold tracking-wider">PREVIOUS TRIPS</h3>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                  {trip.previousTrips.length} Trips Completed
                </Badge>
              </div>

              {/* Timeline-based design for previous trips */}
              <div className="space-y-6">
                {trip.previousTrips.map((previousTrip, idx) => (
                  <div 
                    key={previousTrip.id} 
                    className={cn(
                      "relative pl-8",
                      idx !== trip.previousTrips.length - 1 && "pb-6"
                    )}
                  >
                    {/* Timeline Line */}
                    {idx !== trip.previousTrips.length - 1 && (
                      <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-white/20" />
                    )}
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-0 w-8 h-8 bg-white/10 border-2 border-white flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white/5 border border-white/10 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-base mb-1">{previousTrip.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-white/60 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{previousTrip.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{previousTrip.participants} participants</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-white text-sm font-medium">{previousTrip.rating}</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-3">
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Trip Highlights</p>
                        <div className="grid grid-cols-1 gap-2">
                          {previousTrip.highlights.map((highlight, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2 text-sm text-white/80">
                              <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Images */}
                      {previousTrip.images && previousTrip.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                          {previousTrip.images.map((img, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={img}
                              alt={`${previousTrip.name} ${imgIdx + 1}`}
                              className="w-32 h-32 object-cover flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-screen-lg mx-auto">
          {/* Full Width Book Now Button */}
          <Button
            onClick={handleBook}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 font-light tracking-widest text-sm uppercase"
            data-testid="button-book-trip"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
