import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Minus,
  Plus,
  Ticket,
  Users,
  ShoppingBag,
  Coffee,
  CheckCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be 10 digits").max(10),
  ticketType: z.string(),
  quantity: z.number().min(1).max(10),
  addOns: z.array(z.string()).optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface TicketTier {
  id: string;
  name: string;
  price: number;
  available: number;
  benefits: string[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export default function EventTicketSelection() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [selectedTier, setSelectedTier] = useState<string>("standard");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  const ticketTiers: TicketTier[] = [
    {
      id: "vip",
      name: "VIP",
      price: 7999,
      available: 50,
      benefits: ["Front row seats", "Meet & Greet", "Exclusive merchandise", "VIP lounge access"]
    },
    {
      id: "premium",
      name: "Premium",
      price: 3999,
      available: 200,
      benefits: ["Premium seating", "Priority entry", "Complimentary drink"]
    },
    {
      id: "standard",
      name: "Standard",
      price: 1999,
      available: 500,
      benefits: ["Standard seating", "General entry"]
    },
    {
      id: "general",
      name: "General",
      price: 999,
      available: 1000,
      benefits: ["General admission", "Standing area"]
    }
  ];

  const addOns: AddOn[] = [
    { id: "merch", name: "Official Merchandise Pack", price: 1499, icon: "🎁" },
    { id: "fnb", name: "F&B Combo (Popcorn + Drink)", price: 499, icon: "🍿" },
    { id: "parking", name: "Premium Parking", price: 299, icon: "🚗" },
    { id: "lounge", name: "Lounge Access", price: 999, icon: "☕" }
  ];

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      ticketType: selectedTier,
      quantity: quantity,
      addOns: []
    }
  });

  const selectedTierData = ticketTiers.find(t => t.id === selectedTier);

  const calculateTotal = () => {
    const ticketCost = (selectedTierData?.price || 0) * quantity;
    const addOnsCost = Array.from(selectedAddOns).reduce((sum, id) => {
      const addOn = addOns.find(a => a.id === id);
      return sum + (addOn?.price || 0) * quantity;
    }, 0);
    return ticketCost + addOnsCost;
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const onSubmit = (data: RegistrationForm) => {
    const bookingData = {
      ...data,
      ticketType: selectedTier,
      quantity,
      addOns: Array.from(selectedAddOns),
      total: calculateTotal()
    };

    navigate(`/events/${id}/confirmation?data=${encodeURIComponent(JSON.stringify(bookingData))}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/events/${id}`)}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Select Tickets</h1>
            <p className="text-sm text-white/60">Choose your ticket tier & add-ons</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Ticket Tiers */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Ticket className="h-5 w-5 bg-white/10" />
            Ticket Tiers
          </h2>
          <RadioGroup value={selectedTier} onValueChange={setSelectedTier}>
            <div className="space-y-3">
              {ticketTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedTier === tier.id
                      ? "bg-white/10 bg-white/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                  onClick={() => setSelectedTier(tier.id)}
                  data-testid={`tier-${tier.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={tier.id} id={tier.id} />
                        <div>
                          <Label htmlFor={tier.id} className="text-white font-semibold cursor-pointer">
                            {tier.name}
                          </Label>
                          <p className="text-white/60 text-sm">{tier.available} tickets available</p>
                        </div>
                      </div>
                      <p className="bg-white/10 font-bold text-lg">{formatPrice(tier.price)}</p>
                    </div>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle className="h-3 w-3 bg-white/10" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Quantity */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 bg-white/10" />
            Number of Tickets
          </h2>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Quantity</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    data-testid="button-decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-12 text-center" data-testid="text-quantity">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    data-testid="button-increase"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add-ons */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 bg-white/10" />
            Add-ons & Extras (Optional)
          </h2>
          <div className="space-y-3">
            {addOns.map((addOn) => (
              <Card
                key={addOn.id}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedAddOns.has(addOn.id)
                    ? "bg-white/10 bg-white/10"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
                onClick={() => toggleAddOn(addOn.id)}
                data-testid={`addon-${addOn.id}`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{addOn.icon}</span>
                    <div>
                      <p className="text-white font-medium">{addOn.name}</p>
                      <p className="bg-white/10 text-sm">{formatPrice(addOn.price)} per ticket</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    selectedAddOns.has(addOn.id)
                      ? "bg-white/10 bg-white/10"
                      : "border-white/40"
                  )}>
                    {selectedAddOns.has(addOn.id) && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Amount</p>
              <p className="text-white text-2xl font-bold" data-testid="text-total">
                {formatPrice(calculateTotal())}
              </p>
            </div>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-white/10 hover:bg-white/10 text-white h-12 px-8"
              data-testid="button-proceed"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
