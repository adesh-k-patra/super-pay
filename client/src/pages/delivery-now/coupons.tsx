import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";

export default function FoodCoupons() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/delivery-now/checkout")} className="text-white" data-testid="button-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Coupons & Offers</h1>
      </div>
      <div className="flex flex-col items-center justify-center h-[70vh] px-4">
        <Tag className="h-16 w-16 text-white/20 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No coupons available</h2>
        <p className="text-white/60 text-center">Check back later for exciting offers</p>
      </div>
    </div>
  );
}
