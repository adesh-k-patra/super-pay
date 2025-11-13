import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Navigation, Calendar, Clock, Package as PackageIcon, Weight, Ruler, List } from "lucide-react";

const ITEM_TYPES = [
  { value: "documents", label: "Documents", description: "Papers, letters", maxWeight: 5 },
  { value: "parcels", label: "Parcels", description: "Boxes, packages", maxWeight: 20 },
  { value: "groceries", label: "Groceries", description: "Food items", maxWeight: 30 },
  { value: "furniture", label: "Furniture", description: "Home furniture", maxWeight: 500 },
  { value: "appliances", label: "Appliances", description: "Electronics", maxWeight: 800 },
  { value: "heavy_items", label: "Heavy Items", description: "Construction", maxWeight: 2000 },
];

export default function CourierSearch() {
  const [, navigate] = useLocation();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [bookingType, setBookingType] = useState<"ondemand" | "scheduled">("ondemand");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  // Package details
  const [itemType, setItemType] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [dimensionsL, setDimensionsL] = useState("");
  const [dimensionsW, setDimensionsW] = useState("");
  const [dimensionsH, setDimensionsH] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleContinue = () => {
    if (!pickupLocation || !dropLocation || !itemType || !weightKg) {
      return;
    }

    const searchData = {
      pickupLocation,
      dropLocation,
      bookingType,
      scheduledDate: bookingType === "scheduled" ? scheduledDate : undefined,
      scheduledTime: bookingType === "scheduled" ? scheduledTime : undefined,
      itemType,
      packageDescription,
      weightKg: parseFloat(weightKg),
      dimensionsLCm: dimensionsL ? parseFloat(dimensionsL) : undefined,
      dimensionsWCm: dimensionsW ? parseFloat(dimensionsW) : undefined,
      dimensionsHCm: dimensionsH ? parseFloat(dimensionsH) : undefined,
      quantity: parseInt(quantity) || 1,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('courierSearch', JSON.stringify(searchData));
    navigate("/booking/courier/vehicles");
  };

  const selectedItemType = ITEM_TYPES.find(t => t.value === itemType);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="relative flex items-center justify-center py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking")}
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider uppercase">Pick & Drop</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Courier Delivery</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-shipments")}
            className="absolute right-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-shipments"
          >
            <List className="h-5 w-5" strokeWidth={1} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Booking Type Selector */}
        <div className="mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setBookingType("ondemand")}
              className={`flex-1 p-4 border transition-all ${
                bookingType === "ondemand"
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              data-testid="button-booking-now"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  bookingType === "ondemand" ? "border-white" : "border-white/40"
                }`}>
                  {bookingType === "ondemand" && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">On-Demand</h3>
                  <p className="text-xs text-white/50 font-light">Instant pickup</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setBookingType("scheduled")}
              className={`flex-1 p-4 border transition-all ${
                bookingType === "scheduled"
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              data-testid="button-booking-scheduled"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  bookingType === "scheduled" ? "border-white" : "border-white/40"
                }`}>
                  {bookingType === "scheduled" && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Scheduled</h3>
                  <p className="text-xs text-white/50 font-light">Plan ahead</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Location Inputs */}
        <div className="mb-6 space-y-4">
          {/* Pickup Location */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Pickup Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
              <Input
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup address"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                data-testid="input-pickup-location"
              />
            </div>
          </div>

          {/* Drop Location */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Drop Location
            </Label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
              <Input
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                placeholder="Enter drop address"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                data-testid="input-drop-location"
              />
            </div>
          </div>

          {/* Scheduled Date & Time */}
          {bookingType === "scheduled" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white/5 border-white/20 text-white focus:border-white/40 rounded-none pl-11 h-12"
                    data-testid="input-scheduled-date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-white/5 border-white/20 text-white focus:border-white/40 rounded-none pl-11 h-12"
                    data-testid="input-scheduled-time"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Package Details Section */}
        <div className="mb-6 border-t border-white/10 pt-6">
          <h2 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-4">
            Package Details
          </h2>
          
          <div className="space-y-4">
            {/* Item Type */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Item Type
              </Label>
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger 
                  className="bg-white/5 border-white/20 text-white focus:border-white/40 rounded-none h-12"
                  data-testid="select-item-type"
                >
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {ITEM_TYPES.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                      data-testid={`option-item-type-${type.value}`}
                    >
                      <div>
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-xs text-white/50">{type.description} • Max {type.maxWeight}kg</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Package Description */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Package Description
              </Label>
              <Textarea
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="Describe your package (e.g., Electronics box, 2 laptops)"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none min-h-[80px]"
                data-testid="input-package-description"
              />
            </div>

            {/* Weight and Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  Weight (kg)
                </Label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                  <Input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="0.1"
                    max={selectedItemType?.maxWeight || 2000}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                    data-testid="input-weight"
                  />
                </div>
                {selectedItemType && (
                  <p className="text-xs text-white/40">Max: {selectedItemType.maxWeight} kg</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  Quantity
                </Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  min="1"
                  max="99"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none h-12"
                  data-testid="input-quantity"
                />
              </div>
            </div>

            {/* Dimensions (Optional) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Dimensions (Optional)
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" strokeWidth={1} />
                  <Input
                    type="number"
                    value={dimensionsL}
                    onChange={(e) => setDimensionsL(e.target.value)}
                    placeholder="L (cm)"
                    step="0.1"
                    min="0"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-9 h-11"
                    data-testid="input-length"
                  />
                </div>
                <Input
                  type="number"
                  value={dimensionsW}
                  onChange={(e) => setDimensionsW(e.target.value)}
                  placeholder="W (cm)"
                  step="0.1"
                  min="0"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none h-11"
                  data-testid="input-width"
                />
                <Input
                  type="number"
                  value={dimensionsH}
                  onChange={(e) => setDimensionsH(e.target.value)}
                  placeholder="H (cm)"
                  step="0.1"
                  min="0"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none h-11"
                  data-testid="input-height"
                />
              </div>
              <p className="text-xs text-white/40">Length × Width × Height in centimeters</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <PackageIcon className="h-4 w-4 text-white/60 shrink-0 mt-0.5" strokeWidth={1} />
            <div>
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-2">
                What We Deliver
              </h3>
              <ul className="space-y-1.5 text-xs text-white/50 font-light">
                <li>• Documents & parcels (up to 20 kg)</li>
                <li>• Groceries & food items (up to 30 kg)</li>
                <li>• Furniture & home appliances (up to 800 kg)</li>
                <li>• Heavy items (up to 2000 kg)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-lg font-bold mb-1">10 min</div>
            <div className="text-[10px] text-white/50 font-light uppercase">Avg Pickup</div>
          </div>
          <div className="border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-lg font-bold mb-1">100%</div>
            <div className="text-[10px] text-white/50 font-light uppercase">Insured</div>
          </div>
          <div className="border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-lg font-bold mb-1">24/7</div>
            <div className="text-[10px] text-white/50 font-light uppercase">Available</div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={handleContinue}
            disabled={
              !pickupLocation || 
              !dropLocation || 
              !itemType ||
              !weightKg ||
              (bookingType === "scheduled" && (!scheduledDate || !scheduledTime))
            }
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-continue"
          >
            SELECT VEHICLE
          </Button>
        </div>
      </div>
    </div>
  );
}
