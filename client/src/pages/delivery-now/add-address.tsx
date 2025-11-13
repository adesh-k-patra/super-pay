import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddAddress() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const existingAddresses = localStorage.getItem('deliveryAddresses');
    const addresses = existingAddresses ? JSON.parse(existingAddresses) : [];
    
    const newAddress = {
      id: Date.now().toString(),
      ...formData
    };
    
    addresses.push(newAddress);
    localStorage.setItem('deliveryAddresses', JSON.stringify(addresses));
    
    toast({
      title: "Success",
      description: "Address added successfully"
    });
    
    navigate("/delivery-now/addresses");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3 py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/delivery-now/addresses")}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <h1 className="text-sm font-bold tracking-wider uppercase">Add Delivery Address</h1>
        </div>
      </div>

      {/* Form */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Address Type
            </Label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  onClick={() => handleChange("type", type)}
                  className={`flex-1 rounded-none ${
                    formData.type === type
                      ? "bg-white text-black"
                      : "bg-white/5 border border-white/20 text-white hover:bg-white/10"
                  }`}
                  data-testid={`button-type-${type.toLowerCase()}`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none"
              data-testid="input-name"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none"
              data-testid="input-phone"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Complete Address
            </Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="House/Flat No., Street, Area"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none"
              data-testid="input-address"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              City & State
            </Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City, State"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none"
              data-testid="input-city"
            />
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
              Pincode
            </Label>
            <Input
              id="pincode"
              type="text"
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              placeholder="6-digit pincode"
              maxLength={6}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 rounded-none"
              data-testid="input-pincode"
            />
          </div>
        </form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full bg-white text-black hover:bg-white/90 h-14 text-base font-bold tracking-wider rounded-none"
            data-testid="button-save-address"
          >
            SAVE ADDRESS
          </Button>
        </div>
      </div>
    </div>
  );
}
