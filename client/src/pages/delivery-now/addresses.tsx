import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function FoodAddresses() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const savedAddresses = localStorage.getItem('deliveryAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('deliveryAddresses', JSON.stringify(updatedAddresses));
    toast({
      title: "Address deleted",
      description: "The address has been removed"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/delivery-now/checkout")}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1} />
            </Button>
            <h1 className="text-sm font-bold tracking-wider uppercase">Delivery Addresses</h1>
          </div>
          <Button
            onClick={() => navigate("/delivery-now/add-address")}
            className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-3 text-xs font-semibold tracking-widest"
            data-testid="button-add-address"
          >
            <Plus className="h-3 w-3 mr-1" strokeWidth={1.5} />
            ADD NEW
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <MapPin className="h-16 w-16 text-white/20 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-bold mb-2 tracking-wide">No saved addresses</h2>
            <p className="text-white/50 text-center mb-6 text-sm font-light">
              Add a delivery address to get started
            </p>
            <Button 
              onClick={() => navigate("/delivery-now/add-address")}
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 font-semibold tracking-wider"
              data-testid="button-add-first-address"
            >
              <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
              ADD ADDRESS
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border border-white/10 bg-white/5 p-4"
                data-testid={`address-${address.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-white/30 rounded-none text-[10px] px-2 py-0 font-light tracking-widest">
                        {address.type.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-semibold">{address.name}</span>
                    </div>
                    <p className="text-xs text-white/60 font-light mb-1">{address.address}</p>
                    <p className="text-xs text-white/60 font-light mb-1">{address.city} - {address.pincode}</p>
                    <p className="text-xs text-white/60 font-light">Phone: {address.phone}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-white/40 hover:text-red-400 transition-colors p-2"
                    data-testid={`button-delete-${address.id}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
