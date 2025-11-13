import { TravelRoute, TravelSchedule } from "@shared/schema";

export interface TravelSearchResult {
  id: string;
  operator: string;
  operatorLogo: string;
  routeNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice?: number;
  seatClass: string;
  amenities: string[];
  rating: number;
  stops: string;
  baggage?: string;
  refundable: boolean;
  availableSeats: number;
  serviceType: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
}

export interface TravelApiService {
  searchFlights(from: string, to: string, date: string, passengers: number): Promise<TravelSearchResult[]>;
  searchTrains(from: string, to: string, date: string, passengers: number): Promise<TravelSearchResult[]>;
  searchBuses(from: string, to: string, date: string, passengers: number): Promise<TravelSearchResult[]>;
  getPopularCities(serviceType: string): Promise<string[]>;
}

class MockTravelApiService implements TravelApiService {
  
  async searchFlights(from: string, to: string, date: string, passengers: number): Promise<TravelSearchResult[]> {
    // In production, this would call real flight APIs like Amadeus, Duffel, etc.
    return [
      {
        id: "FL001",
        operator: "IndiGo",
        operatorLogo: "🛩️",
        routeNumber: "6E-234",
        departure: "06:00",
        arrival: "08:30",
        duration: "2h 30m",
        price: 4500,
        originalPrice: 5200,
        seatClass: "Economy",
        amenities: ["wifi", "meals", "entertainment"],
        rating: 4.2,
        stops: "Non-stop",
        baggage: "15kg",
        refundable: true,
        availableSeats: 12,
        serviceType: "flight",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      },
      {
        id: "FL002",
        operator: "Air India",
        operatorLogo: "✈️",
        routeNumber: "AI-612",
        departure: "09:15",
        arrival: "11:55",
        duration: "2h 40m",
        price: 5800,
        originalPrice: 6500,
        seatClass: "Economy",
        amenities: ["wifi", "meals"],
        rating: 4.0,
        stops: "Non-stop",
        baggage: "15kg",
        refundable: false,
        availableSeats: 8,
        serviceType: "flight",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      },
      {
        id: "FL003",
        operator: "SpiceJet",
        operatorLogo: "🌶️",
        routeNumber: "SG-892",
        departure: "14:20",
        arrival: "16:45",
        duration: "2h 25m",
        price: 3900,
        originalPrice: 4800,
        seatClass: "Economy",
        amenities: ["wifi"],
        rating: 3.8,
        stops: "Non-stop",
        baggage: "15kg",
        refundable: true,
        availableSeats: 15,
        serviceType: "flight",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      }
    ];
  }

  async searchTrains(from: string, to: string, date: string, passengers: number): Promise<TravelSearchResult[]> {
    // In production, this would integrate with IRCTC API or Indian Rail API
    return [
      {
        id: "TR001",
        operator: "Indian Railways",
        operatorLogo: "🚂",
        routeNumber: "12951 - Rajdhani Express",
        departure: "16:00",
        arrival: "06:15+1",
        duration: "14h 15m",
        price: 2800,
        originalPrice: 3200,
        seatClass: "3AC",
        amenities: ["ac", "meals", "bedding"],
        rating: 4.1,
        stops: "4 stops",
        refundable: true,
        availableSeats: 20,
        serviceType: "train",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      },
      {
        id: "TR002",
        operator: "Indian Railways",
        operatorLogo: "🚂",
        routeNumber: "12302 - Kolkata Rajdhani",
        departure: "17:00",
        arrival: "10:05+1",
        duration: "17h 5m",
        price: 3400,
        originalPrice: 3800,
        seatClass: "2AC",
        amenities: ["ac", "meals", "bedding", "blanket"],
        rating: 4.3,
        stops: "3 stops",
        refundable: true,
        availableSeats: 5,
        serviceType: "train",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      }
    ];
  }

  async searchBuses(from: string, to: string, date: string, passengers: number): Promise<TravelSearchResult[]> {
    // In production, this would integrate with redBus API
    return [
      {
        id: "BS001",
        operator: "VRL Travels",
        operatorLogo: "🚌",
        routeNumber: "VRL-456",
        departure: "21:30",
        arrival: "06:15+1",
        duration: "8h 45m",
        price: 1200,
        originalPrice: 1500,
        seatClass: "Sleeper",
        amenities: ["ac", "wifi", "blanket"],
        rating: 4.0,
        stops: "2 stops",
        refundable: true,
        availableSeats: 8,
        serviceType: "bus",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      },
      {
        id: "BS002",
        operator: "SRS Travels",
        operatorLogo: "🚐",
        routeNumber: "SRS-789",
        departure: "22:00",
        arrival: "07:30+1",
        duration: "9h 30m",
        price: 980,
        originalPrice: 1200,
        seatClass: "Semi-Sleeper",
        amenities: ["ac", "wifi"],
        rating: 3.9,
        stops: "3 stops",
        refundable: false,
        availableSeats: 12,
        serviceType: "bus",
        fromLocation: from,
        toLocation: to,
        departureDate: date
      }
    ];
  }

  async getPopularCities(serviceType: string): Promise<string[]> {
    const popularCities = {
      flight: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"],
      bus: ["Mumbai", "Pune", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Goa", "Nashik"],
      train: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur"]
    };
    
    return popularCities[serviceType as keyof typeof popularCities] || [];
  }
}

// For production, you would create different implementations:
// class AmadeusFlightService, class RedBusService, class IRCTCService, etc.

export const travelApiService = new MockTravelApiService();