import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Users, Plane, ChevronDown, TrendingUp, Clock, Star } from "lucide-react";
import { z } from "zod";

const flightSearchSchema = z.object({
  tripType: z.enum(["oneway", "roundtrip"]),
  from: z.string().min(1, "Origin is required"),
  to: z.string().min(1, "Destination is required"),
  departDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  passengers: z.string().min(1, "Number of passengers is required"),
  class: z.string().min(1, "Travel class is required"),
});

type FlightSearchForm = z.infer<typeof flightSearchSchema>;

const POPULAR_ROUTES = [
  { from: "Delhi", to: "Mumbai", fromCode: "DEL", toCode: "BOM", price: "₹3,499" },
  { from: "Bangalore", to: "Delhi", fromCode: "BLR", toCode: "DEL", price: "₹4,299" },
  { from: "Mumbai", to: "Goa", fromCode: "BOM", toCode: "GOI", price: "₹2,899" },
  { from: "Chennai", to: "Bangalore", fromCode: "MAA", toCode: "BLR", price: "₹2,199" },
];

const POPULAR_CITIES = [
  { name: "Delhi", code: "DEL" },
  { name: "Mumbai", code: "BOM" },
  { name: "Bangalore", code: "BLR" },
  { name: "Goa", code: "GOI" },
  { name: "Chennai", code: "MAA" },
  { name: "Kolkata", code: "CCU" },
  { name: "Hyderabad", code: "HYD" },
  { name: "Pune", code: "PNQ" },
];

export default function FlightSearchNew() {
  const [, navigate] = useLocation();
  const [selectedTripType, setSelectedTripType] = useState<"oneway" | "roundtrip">("oneway");

  const form = useForm<FlightSearchForm>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      tripType: "oneway",
      from: "",
      to: "",
      departDate: "",
      returnDate: "",
      passengers: "1",
      class: "Economy",
    },
  });

  const onSubmit = (data: FlightSearchForm) => {
    const params = new URLSearchParams({
      from: data.from,
      to: data.to,
      departDate: data.departDate,
      ...(data.returnDate && { returnDate: data.returnDate }),
      passengers: data.passengers,
      class: data.class,
      tripType: data.tripType,
    });
    navigate(`/flights/results?${params.toString()}`);
  };

  const handlePopularRouteClick = (route: typeof POPULAR_ROUTES[0]) => {
    form.setValue("from", route.fromCode);
    form.setValue("to", route.toCode);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BOOK FLIGHTS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Search & compare</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 space-y-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/10 border border-white/20">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-light tracking-wider">Find Best Flight Deals</h2>
              <p className="text-xs text-white/60 font-light uppercase tracking-wider">Instant booking & lowest fares</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/5 border border-white/10 p-3">
              <TrendingUp className="h-4 w-4 text-white/60 mb-1" />
              <p className="text-xs text-white/80 font-light">Best Price</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <Clock className="h-4 w-4 text-white/60 mb-1" />
              <p className="text-xs text-white/80 font-light">Quick Booking</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <Star className="h-4 w-4 text-white/60 mb-1" />
              <p className="text-xs text-white/80 font-light">Best Airlines</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Trip Type */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-4">
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs mb-3 block">Trip Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedTripType(value as "oneway" | "roundtrip");
                        }}
                        value={field.value}
                        className="grid grid-cols-2 gap-3"
                      >
                        <div>
                          <RadioGroupItem value="oneway" id="oneway" className="peer sr-only" />
                          <label
                            htmlFor="oneway"
                            className="flex items-center justify-center border border-white/20 bg-white/5 p-3 cursor-pointer transition-all peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-black"
                            data-testid="radio-oneway"
                          >
                            <span className="text-sm font-light tracking-wider">One Way</span>
                          </label>
                        </div>
                        <div>
                          <RadioGroupItem value="roundtrip" id="roundtrip" className="peer sr-only" />
                          <label
                            htmlFor="roundtrip"
                            className="flex items-center justify-center border border-white/20 bg-white/5 p-3 cursor-pointer transition-all peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-black"
                            data-testid="radio-roundtrip"
                          >
                            <span className="text-sm font-light tracking-wider">Round Trip</span>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Origin & Destination */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-4 space-y-3">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs">From</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          {...field}
                          list="from-cities"
                          placeholder="Enter origin city"
                          className="bg-white/5 border-white/10 text-white rounded-none pl-10"
                          data-testid="input-from"
                        />
                        <datalist id="from-cities">
                          {POPULAR_CITIES.map((city) => (
                            <option key={city.code} value={city.code}>{city.name}</option>
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs">To</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          {...field}
                          list="to-cities"
                          placeholder="Enter destination city"
                          className="bg-white/5 border-white/10 text-white rounded-none pl-10"
                          data-testid="input-to"
                        />
                        <datalist id="to-cities">
                          {POPULAR_CITIES.map((city) => (
                            <option key={city.code} value={city.code}>{city.name}</option>
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-4">
              <div className={`grid ${selectedTripType === "roundtrip" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                <FormField
                  control={form.control}
                  name="departDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs">Departure</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          min={getTomorrowDate()}
                          placeholder="Select departure date"
                          className="bg-white/5 border-white/10 text-white"
                          data-testid="input-depart-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTripType === "roundtrip" && (
                  <FormField
                    control={form.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs">Return</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            min={form.watch("departDate") || getTomorrowDate()}
                            placeholder="Select return date"
                            className="bg-white/5 border-white/10 text-white"
                            data-testid="input-return-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Passengers & Class */}
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-4 space-y-3">
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs">Passengers</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none pl-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={String(num)}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 font-light uppercase tracking-wider text-xs">Class</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                          <SelectItem value="Economy">Economy</SelectItem>
                          <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="First Class">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider py-6"
              data-testid="button-search-flights"
            >
              <Plane className="h-5 w-5 mr-2" />
              Search Flights
            </Button>
          </form>
        </Form>

        {/* Popular Routes */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-xs text-white/60 font-light uppercase tracking-wider mb-3">Popular Routes</h3>
          <div className="space-y-2">
            {POPULAR_ROUTES.map((route, index) => (
              <button
                key={index}
                onClick={() => handlePopularRouteClick(route)}
                className="w-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 p-4 hover:border-white/20 transition-all"
                data-testid={`route-${route.fromCode}-${route.toCode}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-sm font-light text-white">{route.from}</p>
                      <p className="text-xs text-white/50">{route.fromCode}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/40" />
                    <div className="text-left">
                      <p className="text-sm font-light text-white">{route.to}</p>
                      <p className="text-xs text-white/50">{route.toCode}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
                    {route.price}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
