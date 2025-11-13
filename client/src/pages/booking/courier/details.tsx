import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Package as PackageIcon, User, Phone, Shield, IndianRupee, MapPin } from "lucide-react";

export default function CourierDetails() {
  const [, navigate] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);
  
  // Pickup details
  const [pickupContactName, setPickupContactName] = useState("");
  const [pickupContactPhone, setPickupContactPhone] = useState("");
  const [pickupInstructions, setPickupInstructions] = useState("");
  
  // Drop details
  const [dropContactName, setDropContactName] = useState("");
  const [dropContactPhone, setDropContactPhone] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  
  // Package details
  const [specialHandling, setSpecialHandling] = useState("");
  
  // COD option
  const [codRequired, setCodRequired] = useState(false);
  const [codAmount, setCodAmount] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('courierBooking');
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
  }, []);

  const handleContinue = () => {
    if (!pickupContactName || !pickupContactPhone || !dropContactName || !dropContactPhone) {
      return;
    }

    if (codRequired && (!codAmount || parseFloat(codAmount) <= 0)) {
      return;
    }

    const finalData = {
      ...bookingData,
      contactDetails: {
        pickupContactName,
        pickupContactPhone,
        pickupInstructions,
        dropContactName,
        dropContactPhone,
        deliveryInstructions,
        specialHandling
      },
      codRequired,
      codAmount: codRequired ? parseFloat(codAmount) : 0
    };

    localStorage.setItem('courierBooking', JSON.stringify(finalData));
    navigate("/booking/courier/confirm");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="relative flex items-center justify-center py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/booking/courier/vehicles")}
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider uppercase">Contact Details</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Enter contact info</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Booking Summary */}
        {bookingData && (
          <div className="mb-6 border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <PackageIcon className="h-4 w-4 text-white/60" strokeWidth={1} />
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Booking Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-white/40 uppercase tracking-widest">Vehicle</p>
                <p className="font-light">{bookingData.vehicle?.name}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-widest">Item Type</p>
                <p className="font-light capitalize">{bookingData.itemType?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-widest">Weight</p>
                <p className="font-light">{bookingData.weightKg} kg</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-widest">Est. Price</p>
                <p className="font-light">₹{Math.round(bookingData.pricing?.total || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pickup Contact Details */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-green-500" strokeWidth={1} />
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Pickup Contact</h3>
          </div>

          {bookingData && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Pickup Address</p>
              <p className="text-sm font-light">{bookingData.pickupLocation}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Contact Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                <Input
                  value={pickupContactName}
                  onChange={(e) => setPickupContactName(e.target.value)}
                  placeholder="Enter pickup contact name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                  data-testid="input-pickup-contact-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Contact Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                <Input
                  type="tel"
                  value={pickupContactPhone}
                  onChange={(e) => setPickupContactPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                  data-testid="input-pickup-contact-phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Pickup Instructions (Optional)
              </Label>
              <Textarea
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
                placeholder="Building/floor details, gate code, etc."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none min-h-[60px]"
                data-testid="input-pickup-instructions"
              />
            </div>
          </div>
        </div>

        {/* Drop Contact Details */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-red-500" strokeWidth={1} />
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Drop Contact</h3>
          </div>

          {bookingData && (
            <div className="mb-4 pb-4 border-b border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Drop Address</p>
              <p className="text-sm font-light">{bookingData.dropLocation}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Contact Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                <Input
                  value={dropContactName}
                  onChange={(e) => setDropContactName(e.target.value)}
                  placeholder="Enter drop contact name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                  data-testid="input-drop-contact-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Contact Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                <Input
                  type="tel"
                  value={dropContactPhone}
                  onChange={(e) => setDropContactPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                  data-testid="input-drop-contact-phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Delivery Instructions (Optional)
              </Label>
              <Textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Leave at doorstep, call before delivery, etc."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none min-h-[60px]"
                data-testid="input-delivery-instructions"
              />
            </div>
          </div>
        </div>

        {/* Special Handling */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-white/60" strokeWidth={1} />
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Special Handling</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Handling Instructions (Optional)
            </Label>
            <Textarea
              value={specialHandling}
              onChange={(e) => setSpecialHandling(e.target.value)}
              placeholder="Fragile, handle with care, keep upright, etc."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none min-h-[60px]"
              data-testid="input-special-handling"
            />
          </div>
        </div>

        {/* Cash on Delivery */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3 mb-4">
            <Checkbox
              id="cod"
              checked={codRequired}
              onCheckedChange={(checked) => setCodRequired(checked as boolean)}
              className="mt-1 border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-black"
              data-testid="checkbox-cod"
            />
            <div className="flex-1">
              <Label htmlFor="cod" className="text-sm font-semibold cursor-pointer flex items-center gap-2">
                <IndianRupee className="h-4 w-4" strokeWidth={1} />
                Cash on Delivery (COD)
              </Label>
              <p className="text-xs text-white/50 font-light mt-1">
                Collect cash from receiver at delivery
              </p>
            </div>
          </div>

          {codRequired && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                Amount to Collect (₹)
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" strokeWidth={1} />
                <Input
                  type="number"
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  placeholder="Enter amount to collect"
                  min="1"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none pl-11 h-12"
                  data-testid="input-cod-amount"
                />
              </div>
              <p className="text-xs text-white/40 font-light">
                COD charge: ₹{Math.max(20, parseFloat(codAmount || "0") * 0.02).toFixed(0)} (2% of collection amount)
              </p>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="mb-6 border border-white/10 bg-white/5 p-4">
          <h3 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-3">Important Notes</h3>
          <ul className="space-y-2 text-xs text-white/50 font-light">
            <li>• Driver will call the contact person before pickup/delivery</li>
            <li>• Please ensure someone is available at the provided time</li>
            <li>• Proof of delivery will be collected (OTP/Photo/Signature)</li>
            <li>• For fragile items, please mention in special handling instructions</li>
          </ul>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={handleContinue}
            disabled={
              !pickupContactName || 
              !pickupContactPhone || 
              !dropContactName || 
              !dropContactPhone ||
              (codRequired && (!codAmount || parseFloat(codAmount) <= 0))
            }
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-continue"
          >
            REVIEW BOOKING
          </Button>
        </div>
      </div>
    </div>
  );
}
