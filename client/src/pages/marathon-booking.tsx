import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  Minus,
  Users,
  Trophy,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Target,
  Utensils,
  Camera,
  Shirt,
  Droplet,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Additional {
  id: string;
  name: string;
  price: number;
  icon: any;
  description: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
}

const additionals: Additional[] = [
  {
    id: "food",
    name: "Food Package",
    price: 299,
    icon: Utensils,
    description: "Energy bars, fruits & refreshments"
  },
  {
    id: "photos",
    name: "Professional Photos",
    price: 499,
    icon: Camera,
    description: "High-quality race photos"
  },
  {
    id: "tshirt",
    name: "Marathon T-Shirt",
    price: 399,
    icon: Shirt,
    description: "Premium event t-shirt"
  },
  {
    id: "hydration",
    name: "Hydration Pack",
    price: 349,
    icon: Droplet,
    description: "Water bottle & electrolyte pack"
  }
];

const mockMarathon = {
  id: "marathon-1",
  name: "Mumbai Marathon 2025",
  organizer: "Adidas",
  location: "Mumbai",
  date: "January 15, 2025",
  time: "06:00 AM",
  distance: "42.2 KM",
  venue: "Gateway of India",
  registrationFee: 1500
};

export default function MarathonBooking() {
  const [, navigate] = useLocation();
  const { marathonId } = useParams();
  const [numberOfRunners, setNumberOfRunners] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Record<string, number>>({});
  const [members, setMembers] = useState<Member[]>([{
    id: "1",
    name: "",
    email: "",
    phone: "",
    age: 0
  }]);
  const [showAddMember, setShowAddMember] = useState(false);

  const handleRunnersChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(100, numberOfRunners + delta));
    setNumberOfRunners(newCount);
    
    // Adjust members array
    if (newCount > members.length) {
      const newMembers = [...members];
      for (let i = members.length; i < newCount; i++) {
        newMembers.push({
          id: String(i + 1),
          name: "",
          email: "",
          phone: "",
          age: 0
        });
      }
      setMembers(newMembers);
    } else if (newCount < members.length) {
      setMembers(members.slice(0, newCount));
    }
  };

  const handleAdditionalChange = (additionalId: string, delta: number) => {
    setSelectedAdditionals(prev => {
      const currentQty = prev[additionalId] || 0;
      const newQty = Math.max(0, Math.min(numberOfRunners, currentQty + delta));
      if (newQty === 0) {
        const { [additionalId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [additionalId]: newQty };
    });
  };

  const updateMember = (index: number, field: keyof Member, value: string | number) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
      setNumberOfRunners(Math.max(1, numberOfRunners - 1));
    }
  };

  const registrationTotal = mockMarathon.registrationFee * numberOfRunners;
  const additionalsTotal = Object.entries(selectedAdditionals).reduce((sum, [addId, qty]) => {
    const additional = additionals.find(a => a.id === addId);
    return sum + (additional?.price || 0) * qty;
  }, 0);
  const totalAmount = registrationTotal + additionalsTotal;

  const handleProceedToPayment = () => {
    // Validate members
    const isValid = members.every(m => m.name && m.email && m.age > 0);
    if (!isValid) {
      alert("Please fill in all member details");
      return;
    }
    // Navigate to payment
    navigate(`/marathons/${marathonId}/payment`);
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
            onClick={() => navigate('/fitness?tab=marathons')}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">MARATHON BOOKING</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Register Now</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Marathon Info */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 border border-white/30 bg-white/10 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-6 w-6 text-white/70" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-light text-white tracking-wide mb-1">{mockMarathon.name}</h2>
              <p className="text-sm text-white/60 font-light flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-white/40" />
                Organized by <span className="text-white/80">{mockMarathon.organizer}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="h-3.5 w-3.5 text-white/40" />
              <span>{mockMarathon.date}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="h-3.5 w-3.5 text-white/40" />
              <span>{mockMarathon.time}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="h-3.5 w-3.5 text-white/40" />
              <span>{mockMarathon.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Target className="h-3.5 w-3.5 text-white/40" />
              <span>{mockMarathon.distance}</span>
            </div>
          </div>
        </div>

        {/* Number of Runners */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 uppercase tracking-widest font-light">Number of Runners</span>
          </div>
          <div className="flex items-center justify-between border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm text-white/60 font-light mb-1">Total Runners</p>
              <p className="text-2xl font-light text-white">{numberOfRunners}</p>
              <p className="text-xs text-white/40 mt-1">Maximum 100 runners</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleRunnersChange(-1)}
                disabled={numberOfRunners === 1}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-10 w-10 p-0 disabled:opacity-30"
                data-testid="button-decrease-runners"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-3xl font-light w-16 text-center" data-testid="text-runner-count">
                {numberOfRunners}
              </span>
              <Button
                onClick={() => handleRunnersChange(1)}
                disabled={numberOfRunners >= 100}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-10 w-10 p-0 disabled:opacity-30"
                data-testid="button-increase-runners"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center text-sm">
            <span className="text-white/50">Registration Fee (₹{mockMarathon.registrationFee} × {numberOfRunners})</span>
            <span className="text-white font-light">{formatCurrency(registrationTotal)}</span>
          </div>
        </div>

        {/* Additionals */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 uppercase tracking-widest font-light">Additional Services</span>
          </div>
          <div className="space-y-3">
            {additionals.map((additional) => {
              const Icon = additional.icon;
              const quantity = selectedAdditionals[additional.id] || 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={additional.id}
                  className={cn(
                    "border p-4 transition-all",
                    isSelected ? "border-white/20 bg-white/5" : "border-white/10 bg-transparent"
                  )}
                  data-testid={`additional-${additional.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-white/60" />
                      </div>
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-light tracking-wider text-base mb-1",
                          isSelected ? "text-white" : "text-white/80"
                        )}>
                          {additional.name}
                        </h3>
                        <p className="text-xs text-white/40 mb-2">{additional.description}</p>
                        <p className={cn(
                          "text-sm font-light",
                          isSelected ? "text-white" : "text-white/60"
                        )}>
                          {formatCurrency(additional.price)} per person
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-sm text-white/50">Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleAdditionalChange(additional.id, -1)}
                        disabled={quantity === 0}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-9 w-9 p-0 disabled:opacity-30"
                        data-testid={`button-decrease-${additional.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-light w-10 text-center" data-testid={`quantity-${additional.id}`}>
                        {quantity}
                      </span>
                      <Button
                        onClick={() => handleAdditionalChange(additional.id, 1)}
                        disabled={quantity >= numberOfRunners}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-9 w-9 p-0 disabled:opacity-30"
                        data-testid={`button-increase-${additional.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {quantity > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                      <p className="text-sm text-white/40">Subtotal for {quantity} item{quantity > 1 ? 's' : ''}</p>
                      <p className="text-base font-light text-white">{formatCurrency(additional.price * quantity)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {additionalsTotal > 0 && (
            <div className="mt-3 flex justify-between items-center text-sm pt-3 border-t border-white/10">
              <span className="text-white/50">Additionals Total</span>
              <span className="text-white font-light">{formatCurrency(additionalsTotal)}</span>
            </div>
          )}
        </div>

        {/* Member Details */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-white/60" />
              <span className="text-xs text-white/60 uppercase tracking-widest font-light">Member Details</span>
            </div>
            <Badge className="bg-white/10 text-white/60 border-white/20 rounded-none text-xs">
              {members.length} / 100 max
            </Badge>
          </div>
          
          <div className="space-y-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="border border-white/10 bg-white/5 p-4"
                data-testid={`member-${index}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light text-white uppercase tracking-widest">
                    Runner {index + 1}
                  </h3>
                  {members.length > 1 && (
                    <Button
                      onClick={() => removeMember(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-none h-8"
                      data-testid={`button-remove-member-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`} className="text-xs text-white/60 uppercase tracking-widest">
                      Full Name *
                    </Label>
                    <Input
                      id={`name-${index}`}
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      placeholder="Enter full name"
                      className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                      data-testid={`input-name-${index}`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`email-${index}`} className="text-xs text-white/60 uppercase tracking-widest">
                      Email Address *
                    </Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={member.email}
                      onChange={(e) => updateMember(index, 'email', e.target.value)}
                      placeholder="email@example.com"
                      className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                      data-testid={`input-email-${index}`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`phone-${index}`} className="text-xs text-white/60 uppercase tracking-widest">
                      Phone Number *
                    </Label>
                    <Input
                      id={`phone-${index}`}
                      type="tel"
                      value={member.phone}
                      onChange={(e) => updateMember(index, 'phone', e.target.value)}
                      placeholder="+91 1234567890"
                      className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                      data-testid={`input-phone-${index}`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`age-${index}`} className="text-xs text-white/60 uppercase tracking-widest">
                      Age *
                    </Label>
                    <Input
                      id={`age-${index}`}
                      type="number"
                      value={member.age || ''}
                      onChange={(e) => updateMember(index, 'age', parseInt(e.target.value) || 0)}
                      placeholder="Age"
                      min="1"
                      max="120"
                      className="bg-white/5 border-white/20 text-white rounded-none focus:border-white/40"
                      data-testid={`input-age-${index}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-2xl font-light text-white">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-white/40">
                {numberOfRunners} runner{numberOfRunners > 1 ? 's' : ''} + {Object.keys(selectedAdditionals).length} additional{Object.keys(selectedAdditionals).length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={handleProceedToPayment}
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 px-8 text-sm uppercase tracking-widest"
              data-testid="button-proceed-payment"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
