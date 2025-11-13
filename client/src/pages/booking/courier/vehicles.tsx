import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bike, Car, Truck, Package as PackageIcon, Shield, Clock, Info } from "lucide-react";

interface Vehicle {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: any;
  maxWeightKg: number;
  maxDimensions: string;
  basePrice: number;
  pricePerKm: number;
  eta: string;
  features: string[];
}

export default function CourierVehicles() {
  const [, navigate] = useLocation();
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [searchData, setSearchData] = useState<any>(null);
  const [insuranceRequired, setInsuranceRequired] = useState(false);
  const [insuranceValue, setInsuranceValue] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('courierSearch');
    if (saved) {
      const data = JSON.parse(saved);
      setSearchData(data);
      
      // Set default insurance value based on item type
      if (data.itemType === 'appliances' || data.itemType === 'furniture') {
        setInsuranceValue(50000);
      } else if (data.itemType === 'heavy_items') {
        setInsuranceValue(100000);
      } else {
        setInsuranceValue(10000);
      }
    }
  }, []);

  const vehicles: Vehicle[] = [
    {
      id: "bike",
      code: "bike",
      name: "Bike",
      description: "Small parcels & documents",
      icon: Bike,
      maxWeightKg: 5,
      maxDimensions: "40×30×20 cm",
      basePrice: 49,
      pricePerKm: 8,
      eta: "10-15 mins",
      features: ["GPS Tracking", "Fastest", "Best for documents"]
    },
    {
      id: "auto",
      code: "auto",
      name: "Auto",
      description: "Medium parcels & boxes",
      icon: Car,
      maxWeightKg: 150,
      maxDimensions: "80×60×60 cm",
      basePrice: 89,
      pricePerKm: 12,
      eta: "15-20 mins",
      features: ["GPS Tracking", "Covered", "Best for parcels"]
    },
    {
      id: "mini_truck",
      code: "mini_truck",
      name: "Mini Truck",
      description: "Furniture & large items",
      icon: Truck,
      maxWeightKg: 800,
      maxDimensions: "180×120×120 cm",
      basePrice: 299,
      pricePerKm: 18,
      eta: "20-30 mins",
      features: ["GPS Tracking", "Helper Included", "Large items"]
    },
    {
      id: "truck_2ton",
      code: "truck_2ton",
      name: "2-Ton Truck",
      description: "Heavy & bulk items",
      icon: Truck,
      maxWeightKg: 2000,
      maxDimensions: "280×180×180 cm",
      basePrice: 699,
      pricePerKm: 25,
      eta: "30-45 mins",
      features: ["GPS Tracking", "2 Helpers", "Heaviest loads"]
    }
  ];

  // Filter vehicles based on package weight
  const availableVehicles = searchData
    ? vehicles.filter(v => v.maxWeightKg >= (searchData.weightKg || 0))
    : vehicles;

  const estimatedDistance = 8.5; // Mock distance - would be calculated from actual locations

  const calculatePricing = (vehicle: Vehicle) => {
    const basePrice = vehicle.basePrice;
    const distanceCharge = vehicle.pricePerKm * estimatedDistance;
    const platformFee = 10;
    const gst = (basePrice + distanceCharge + platformFee) * 0.18;
    
    let insuranceCharge = 0;
    if (insuranceRequired && insuranceValue > 0) {
      // 0.5% of insured value with minimum ₹20
      insuranceCharge = Math.max(20, insuranceValue * 0.005);
    }

    const subtotal = basePrice + distanceCharge + platformFee + insuranceCharge;
    const total = subtotal + gst;

    return {
      basePrice,
      distanceCharge,
      platformFee,
      insuranceCharge,
      gst,
      subtotal,
      total,
      estimatedDistance
    };
  };

  const handleContinue = () => {
    if (!selectedVehicle) return;

    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;

    const pricing = calculatePricing(vehicle);
    
    const bookingData = {
      ...searchData,
      vehicle: {
        ...vehicle,
        vehicleType: vehicle.code
      },
      pricing,
      insuranceRequired,
      insuranceValue: insuranceRequired ? insuranceValue : 0,
      insuranceCharge: insuranceRequired ? pricing.insuranceCharge : 0
    };

    localStorage.setItem('courierBooking', JSON.stringify(bookingData));
    navigate("/booking/courier/details");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="relative flex items-center justify-center py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking/courier/search")}
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider uppercase">Select Vehicle</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Choose based on your needs</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Route Info */}
        {searchData && (
          <div className="mb-6 border border-white/10 bg-white/5 p-5">
            {/* Route Section */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-6 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-1">Pickup</p>
                    <p className="font-light text-sm truncate">{searchData.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-1">Drop</p>
                    <p className="font-light text-sm truncate">{searchData.dropLocation}</p>
                  </div>
                </div>
              </div>
              
              {/* Distance Badge */}
              <div className="flex items-center gap-2">
                <div className="border-l border-white/20 h-4 ml-1"></div>
                <div className="text-xs text-white/60 font-light">
                  <span className="text-white/40 uppercase tracking-widest text-[10px]">Distance: </span>
                  <span className="text-white font-semibold">{estimatedDistance} km</span>
                </div>
              </div>
            </div>

            {/* Package Details Section */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-light mb-3">Package Details</p>
              
              <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                <div>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Item Type</p>
                  <p className="font-light capitalize">{searchData.itemType?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Quantity</p>
                  <p className="font-light">{searchData.quantity || 1}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Weight</p>
                  <p className="font-light">{searchData.weightKg} kg</p>
                </div>
              </div>

              {(searchData.dimensionsLCm || searchData.dimensionsWCm || searchData.dimensionsHCm) && (
                <div className="text-xs">
                  <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Dimensions (L×W×H)</p>
                  <p className="font-light">
                    {searchData.dimensionsLCm || '—'} × {searchData.dimensionsWCm || '—'} × {searchData.dimensionsHCm || '—'} cm
                  </p>
                </div>
              )}
            </div>

            {searchData.bookingType === "scheduled" && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-1">Scheduled For</p>
                <p className="font-light text-sm">{searchData.scheduledDate} at {searchData.scheduledTime}</p>
              </div>
            )}
          </div>
        )}

        {/* Insurance Option */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="insurance"
              checked={insuranceRequired}
              onCheckedChange={(checked) => setInsuranceRequired(checked as boolean)}
              className="mt-0.5 border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-black"
              data-testid="checkbox-insurance"
            />
            <div className="flex-1">
              <Label htmlFor="insurance" className="text-sm font-semibold cursor-pointer">
                Add Insurance Protection
              </Label>
              <p className="text-xs text-white/50 font-light mt-1">
                Cover up to ₹{insuranceValue.toLocaleString()} against damage or loss
              </p>
              {insuranceRequired && (
                <p className="text-xs text-white/60 mt-2">
                  Insurance charge: ₹{Math.max(20, insuranceValue * 0.005).toFixed(0)}
                </p>
              )}
            </div>
            <Shield className="h-5 w-5 text-white/40 shrink-0" strokeWidth={1} />
          </div>
        </div>

        {/* Vehicle Options */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xs text-white/60 uppercase tracking-widest font-light mb-4">
            Available Vehicles ({availableVehicles.length})
          </h2>
          {availableVehicles.map((vehicle) => {
            const Icon = vehicle.icon;
            const isSelected = selectedVehicle === vehicle.id;
            const pricing = calculatePricing(vehicle);
            const isRecommended = searchData && vehicle.maxWeightKg >= searchData.weightKg && 
                                 vehicle.maxWeightKg <= searchData.weightKg * 2;

            return (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`border cursor-pointer transition-all p-4 relative ${
                  isSelected
                    ? "border-white bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
                data-testid={`vehicle-${vehicle.id}`}
              >
                {isRecommended && (
                  <div className="absolute top-0 right-0 bg-white text-black text-xs px-3 py-1 font-bold uppercase tracking-wider">
                    Recommended
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Radio Button */}
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mt-1 shrink-0 ${
                    isSelected ? "border-white" : "border-white/40"
                  }`}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Vehicle Icon */}
                  <div className="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-white/80" strokeWidth={1} />
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">{vehicle.name}</h3>
                        <p className="text-xs text-white/50 font-light">{vehicle.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₹{Math.round(pricing.total)}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider">Est. Total</div>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-white/40 uppercase tracking-wider text-[10px]">Max Weight</div>
                        <div className="font-light">{vehicle.maxWeightKg} kg</div>
                      </div>
                      <div>
                        <div className="text-white/40 uppercase tracking-wider text-[10px]">Max Size</div>
                        <div className="font-light text-[10px]">{vehicle.maxDimensions}</div>
                      </div>
                      <div>
                        <div className="text-white/40 uppercase tracking-wider text-[10px]">ETA</div>
                        <div className="font-light">{vehicle.eta}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {vehicle.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="text-[10px] px-2 py-0.5 border border-white/20 bg-white/5 uppercase tracking-wider"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown - Show when selected */}
                    {isSelected && (
                      <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                        <div className="flex justify-between text-white/60">
                          <span>Base fare</span>
                          <span>₹{pricing.basePrice}</span>
                        </div>
                        <div className="flex justify-between text-white/60">
                          <span>Distance ({pricing.estimatedDistance} km × ₹{vehicle.pricePerKm})</span>
                          <span>₹{pricing.distanceCharge.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-white/60">
                          <span>Platform fee</span>
                          <span>₹{pricing.platformFee}</span>
                        </div>
                        {insuranceRequired && (
                          <div className="flex justify-between text-white/60">
                            <span>Insurance</span>
                            <span>₹{pricing.insuranceCharge.toFixed(0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-white/60">
                          <span>GST (18%)</span>
                          <span>₹{pricing.gst.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-white pt-1.5 border-t border-white/10">
                          <span>Total Amount</span>
                          <span>₹{Math.round(pricing.total)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-white/10 bg-white/5 p-3 text-center">
            <Shield className="h-5 w-5 text-white/60 mx-auto mb-2" strokeWidth={1} />
            <div className="text-[10px] text-white/50 font-light uppercase tracking-wider">Insured</div>
          </div>
          <div className="border border-white/10 bg-white/5 p-3 text-center">
            <Clock className="h-5 w-5 text-white/60 mx-auto mb-2" strokeWidth={1} />
            <div className="text-[10px] text-white/50 font-light uppercase tracking-wider">Real-time</div>
          </div>
          <div className="border border-white/10 bg-white/5 p-3 text-center">
            <PackageIcon className="h-5 w-5 text-white/60 mx-auto mb-2" strokeWidth={1} />
            <div className="text-[10px] text-white/50 font-light uppercase tracking-wider">Proof of Delivery</div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-continue"
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  );
}
