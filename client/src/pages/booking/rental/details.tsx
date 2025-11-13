import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Star,
  Users,
  Fuel,
  Gauge,
  Shield,
  CheckCircle,
  Snowflake,
  Music,
  Navigation,
  Settings
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

const vehicle = {
  id: '1',
  name: 'Swift',
  brand: 'Maruti Suzuki',
  category: 'Hatchback',
  rating: 4.5,
  reviews: 320,
  seats: 5,
  fuelType: 'Petrol',
  transmission: 'Manual',
  pricePerDay: 1200,
  pricePerHour: 100,
  features: {
    safety: ['ABS', 'Airbags (2)', 'Child Lock', 'Rear Parking Sensors'],
    comfort: ['AC', 'Power Windows', 'Power Steering', 'Central Locking'],
    entertainment: ['Bluetooth', 'USB Charging', 'Speakers'],
    other: ['Fuel Efficient', 'GPS Navigation', 'Well Maintained']
  },
  specifications: {
    'Engine': '1.2L Petrol',
    'Power': '82 bhp',
    'Mileage': '22 km/l',
    'Fuel Tank': '42 liters',
    'Boot Space': '268 liters',
    'Ground Clearance': '163 mm'
  },
  included: [
    'Unlimited kilometers',
    'Basic insurance',
    '24/7 roadside assistance',
    'Free home delivery'
  ],
  notIncluded: [
    'Fuel charges',
    'State tax (if applicable)',
    'Parking & tolls',
    'Additional driver charges'
  ]
};

export default function RentalDetails() {
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/booking/rental/browse")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CAR DETAILS</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20">
        {/* Vehicle Image */}
        <div className="bg-white/10 h-64 flex items-center justify-center border-b border-white/10">
          <div className="text-9xl">🚗</div>
        </div>

        <div className="px-4 py-6 space-y-6 max-w-screen-lg mx-auto">
          {/* Vehicle Header */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-light mb-2">{vehicle.brand} {vehicle.name}</h2>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{vehicle.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{vehicle.reviews} reviews</span>
                </div>
              </div>
              <Badge className="bg-white/10 text-white border-white/20 rounded-none px-3 py-1">
                {vehicle.category}
              </Badge>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 border border-white/10 rounded-none">
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-white/60" />
                <div className="text-xs text-white/60">SEATS</div>
                <div className="font-light mt-1">{vehicle.seats}</div>
              </div>
              <div className="text-center border-x border-white/10">
                <Fuel className="h-5 w-5 mx-auto mb-2 text-white/60" />
                <div className="text-xs text-white/60">FUEL</div>
                <div className="font-light mt-1">{vehicle.fuelType}</div>
              </div>
              <div className="text-center">
                <Gauge className="h-5 w-5 mx-auto mb-2 text-white/60" />
                <div className="text-xs text-white/60">TYPE</div>
                <div className="font-light mt-1">{vehicle.transmission}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full bg-white/5 border border-white/10 rounded-none h-12">
              <TabsTrigger 
                value="overview" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none font-light"
                data-testid="tab-overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none font-light"
                data-testid="tab-specs"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none font-light"
                data-testid="tab-pricing"
              >
                Pricing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Features */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-none">
                <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Features</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-light mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Safety
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.safety.map((feature) => (
                        <Badge key={feature} className="bg-white/5 text-white/80 border-white/10 text-xs rounded-none">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-light mb-2 flex items-center gap-2">
                      <Snowflake className="h-4 w-4" />
                      Comfort
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.comfort.map((feature) => (
                        <Badge key={feature} className="bg-white/5 text-white/80 border-white/10 text-xs rounded-none">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-light mb-2 flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Entertainment
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.entertainment.map((feature) => (
                        <Badge key={feature} className="bg-white/5 text-white/80 border-white/10 text-xs rounded-none">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Included/Not Included */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-none">
                  <h4 className="text-xs uppercase tracking-widest text-green-500 mb-3">Included</h4>
                  <div className="space-y-2">
                    {vehicle.included.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="font-light text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-none">
                  <h4 className="text-xs uppercase tracking-widest text-red-500 mb-3">Not Included</h4>
                  <div className="space-y-2">
                    {vehicle.notIncluded.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <div className="h-4 w-4 flex-shrink-0 mt-0.5">✕</div>
                        <span className="font-light text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-none">
                <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Technical Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(vehicle.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/60 text-sm">{key}</span>
                      <span className="font-light text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-none space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">Rental Pricing</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 border border-white/10 rounded-none text-center">
                    <div className="text-xs text-white/60 mb-2">HOURLY RATE</div>
                    <div className="text-3xl font-light">₹{vehicle.pricePerHour}</div>
                    <div className="text-xs text-white/60 mt-1">per hour</div>
                  </div>

                  <div className="bg-white/5 p-4 border border-white/10 rounded-none text-center">
                    <div className="text-xs text-white/60 mb-2">DAILY RATE</div>
                    <div className="text-3xl font-light">₹{vehicle.pricePerDay}</div>
                    <div className="text-xs text-white/60 mt-1">per day</div>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-none">
                  <div className="text-sm font-light mb-2">Additional Information</div>
                  <ul className="space-y-1 text-xs text-white/60">
                    <li>• Security deposit: ₹5,000 (refundable)</li>
                    <li>• Extra km: ₹8/km (after 300km/day)</li>
                    <li>• Delivery charges: ₹200 (within city)</li>
                    <li>• Cancellation: Free up to 24 hours before</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fixed Bottom - Book Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 p-4">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-light">₹{vehicle.pricePerDay}</div>
            <div className="text-xs text-white/60">per day</div>
          </div>
          <Button
            onClick={() => navigate(`/booking/rental/book?vehicleId=${vehicle.id}`)}
            className="bg-white text-black hover:bg-white/90 h-14 px-8 rounded-none font-light tracking-widest flex-1"
            data-testid="button-book"
          >
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
