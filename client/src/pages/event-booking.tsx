import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  Plus,
  Minus,
  Users,
  Ticket,
  Building2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketClass {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
  benefits: string[];
}

const ticketClasses: TicketClass[] = [
  {
    id: "vip",
    name: "VIP",
    price: 7999,
    available: 50,
    description: "Premium experience with exclusive benefits",
    benefits: ["Front row seats", "Meet & Greet", "Exclusive merchandise", "VIP lounge access"]
  },
  {
    id: "premium",
    name: "Premium",
    price: 3999,
    available: 200,
    description: "Enhanced seating with added perks",
    benefits: ["Premium seating", "Priority entry", "Complimentary drink"]
  },
  {
    id: "standard",
    name: "Standard",
    price: 1999,
    available: 500,
    description: "Standard seating with great view",
    benefits: ["Standard seating", "General entry"]
  },
  {
    id: "general",
    name: "General",
    price: 999,
    available: 1000,
    description: "General admission standing area",
    benefits: ["General admission", "Standing area"]
  }
];

export default function EventBooking() {
  const [, navigate] = useLocation();
  const { date, id } = useParams();
  const [quantities, setQuantities] = useState<Record<string, number>>({
    vip: 0,
    premium: 0,
    standard: 0,
    general: 0
  });

  const handleQuantityChange = (classId: string, delta: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[classId] || 0;
      const newQuantity = Math.max(0, Math.min(10, currentQuantity + delta));
      return { ...prev, [classId]: newQuantity };
    });
  };

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = Object.entries(quantities).reduce((sum, [classId, qty]) => {
    const ticketClass = ticketClasses.find(tc => tc.id === classId);
    return sum + (ticketClass?.price || 0) * qty;
  }, 0);

  const handleContinue = () => {
    if (totalTickets === 0) return;
    
    const selectedClasses = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([classId, qty]) => ({ classId, quantity: qty }));
    
    navigate(`/events/${id}/seats?date=${date}&tickets=${encodeURIComponent(JSON.stringify(selectedClasses))}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/events/${id}`)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SELECT TICKETS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Choose Your Seats</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Event Info */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 uppercase tracking-widest font-light">Ticket Classes</span>
          </div>
          <p className="text-sm text-white/60 font-light mb-4">
            Select ticket quantity for each class. Minimum 1 ticket required.
          </p>
        </div>

        {/* Ticket Classes */}
        <div className="space-y-4">
          {ticketClasses.map((ticketClass, index) => {
            const quantity = quantities[ticketClass.id] || 0;
            const isSelected = quantity > 0;

            return (
              <div
                key={ticketClass.id}
                className={cn(
                  "border-b pb-4 transition-all",
                  isSelected ? "border-white/20" : "border-white/10"
                )}
                data-testid={`ticket-class-${ticketClass.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "font-light tracking-wider text-lg",
                        isSelected ? "text-white" : "text-white/80"
                      )}>
                        {ticketClass.name}
                      </h3>
                      <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-xs px-2 py-0.5">
                        {ticketClass.available} Available
                      </Badge>
                    </div>
                    <p className="text-xs text-white/40 mb-2">{ticketClass.description}</p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {ticketClass.benefits.map((benefit, idx) => (
                        <Badge key={idx} className="bg-white/5 text-white/60 border-white/10 rounded-none text-xs px-2 py-0.5">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <p className="text-sm text-white/40">Price per ticket</p>
                    <p className={cn(
                      "text-xl font-light",
                      isSelected ? "text-white" : "text-white/60"
                    )}>
                      {formatCurrency(ticketClass.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleQuantityChange(ticketClass.id, -1)}
                      disabled={quantity === 0}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-10 w-10 p-0 disabled:opacity-30"
                      data-testid={`button-decrease-${ticketClass.id}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-light w-12 text-center" data-testid={`quantity-${ticketClass.id}`}>
                      {quantity}
                    </span>
                    <Button
                      onClick={() => handleQuantityChange(ticketClass.id, 1)}
                      disabled={quantity >= 10}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-10 w-10 p-0 disabled:opacity-30"
                      data-testid={`button-increase-${ticketClass.id}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {quantity > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                    <p className="text-sm text-white/40">Subtotal for {quantity} ticket{quantity > 1 ? 's' : ''}</p>
                    <p className="text-lg font-light text-white">{formatCurrency(ticketClass.price * quantity)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {totalTickets > 0 && (
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-white/60" />
              <span className="text-xs text-white/60 uppercase tracking-widest font-light">Booking Summary</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-white/60">Total Tickets</p>
                <p className="text-lg font-light">{totalTickets}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <p className="text-sm text-white/60">Total Amount</p>
                <p className="text-2xl font-light" data-testid="text-total-amount">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <div>
            <p className="text-white/60 text-sm font-light">{totalTickets} Ticket{totalTickets !== 1 ? 's' : ''} Selected</p>
            <p className="text-white text-2xl font-light">{formatCurrency(totalAmount)}</p>
          </div>
          <Button
            onClick={handleContinue}
            disabled={totalTickets === 0}
            className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none font-light tracking-wider disabled:opacity-50"
            data-testid="button-continue"
          >
            Continue to Seats
          </Button>
        </div>
      </div>
    </div>
  );
}
