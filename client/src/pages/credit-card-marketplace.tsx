import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Search,
  Filter,
  Star,
  CheckCircle,
  X,
  CreditCard,
  Building,
  Eye,
  Gift,
  Zap,
  TrendingUp,
  Percent,
  Shield,
  Sparkles,
  ShoppingBag,
  Plane,
  Wallet
} from "lucide-react";

interface CreditCardOffer {
  id: string;
  providerName: string;
  providerLogo: string;
  cardName: string;
  cardType: string;
  category: string;
  joiningFee: number;
  annualFee: number;
  feeWaiver: string;
  creditLimit: string;
  interestRate: number;
  rewardRate: string;
  welcomeBonus: string;
  keyFeatures: string[];
  benefits: string[];
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    minSalary: number;
    minCreditScore: number;
  };
  documentsRequired: string[];
  rating: number;
  views: number;
  applications: number;
  tags: string[];
  isPremium: boolean;
  isPopular: boolean;
  processingTime: string;
}

export default function CreditCardMarketplace() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCompare, setShowCompare] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const mockCreditCards: CreditCardOffer[] = [
    {
      id: "slice-super",
      providerName: "Slice",
      providerLogo: "💳",
      cardName: "Slice Super Card",
      cardType: "Credit",
      category: "rewards",
      joiningFee: 0,
      annualFee: 0,
      feeWaiver: "Lifetime free",
      creditLimit: "Up to ₹10L",
      interestRate: 3.0,
      rewardRate: "2% on all spends",
      welcomeBonus: "₹500 cashback on first transaction",
      keyFeatures: ["2% cashback on all spends", "Zero forex charges", "Instant approval", "No income proof required"],
      benefits: ["Unlimited cashback", "No hidden charges", "EMI facility", "Travel insurance"],
      eligibilityCriteria: { minAge: 18, maxAge: 65, minSalary: 15000, minCreditScore: 650 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Selfie"],
      rating: 4.6,
      views: 45320,
      applications: 8240,
      tags: ["Popular", "Zero Fees"],
      isPremium: false,
      isPopular: true,
      processingTime: "Instant"
    },
    {
      id: "jupiter-edge",
      providerName: "Jupiter",
      providerLogo: "🌟",
      cardName: "Jupiter Edge CSB Bank RuPay Credit Card",
      cardType: "Credit",
      category: "rewards",
      joiningFee: 0,
      annualFee: 0,
      feeWaiver: "Lifetime free",
      creditLimit: "Up to ₹3L",
      interestRate: 3.5,
      rewardRate: "Up to 2% rewards",
      welcomeBonus: "1000 reward points",
      keyFeatures: ["UPI-enabled credit card", "2% rewards on UPI spends", "Zero joining fee", "Digital-first experience"],
      benefits: ["Instant digital card", "No annual fee", "Reward points on UPI", "Bill payment rewards"],
      eligibilityCriteria: { minAge: 21, maxAge: 60, minSalary: 20000, minCreditScore: 700 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip"],
      rating: 4.5,
      views: 32450,
      applications: 6120,
      tags: ["UPI Enabled", "Digital"],
      isPremium: false,
      isPopular: true,
      processingTime: "24 hours"
    },
    {
      id: "navi-credit",
      providerName: "Navi",
      providerLogo: "🚀",
      cardName: "Navi Credit Card",
      cardType: "Credit",
      category: "cashback",
      joiningFee: 0,
      annualFee: 500,
      feeWaiver: "Waived on ₹50k annual spend",
      creditLimit: "Up to ₹5L",
      interestRate: 2.95,
      rewardRate: "5% cashback on top categories",
      welcomeBonus: "₹1000 cashback",
      keyFeatures: ["5% cashback on groceries", "2% on fuel", "1% on all other spends", "Zero forex markup"],
      benefits: ["High cashback rates", "Fuel surcharge waiver", "Airport lounge access", "Purchase protection"],
      eligibilityCriteria: { minAge: 23, maxAge: 65, minSalary: 25000, minCreditScore: 720 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Bank Statement"],
      rating: 4.4,
      views: 28950,
      applications: 5340,
      tags: ["Cashback", "Fuel"],
      isPremium: false,
      isPopular: false,
      processingTime: "3-5 days"
    },
    {
      id: "evencred-rewards",
      providerName: "EvenCred",
      providerLogo: "⚡",
      cardName: "EvenCred Rewards Card",
      cardType: "Credit",
      category: "rewards",
      joiningFee: 999,
      annualFee: 999,
      feeWaiver: "Waived on ₹1L annual spend",
      creditLimit: "Up to ₹8L",
      interestRate: 3.2,
      rewardRate: "10X rewards on dining & shopping",
      welcomeBonus: "5000 reward points",
      keyFeatures: ["10X rewards on select categories", "Complimentary lounge access", "Zero forex charges", "Concierge services"],
      benefits: ["Premium rewards program", "Travel benefits", "Lifestyle offers", "Global acceptance"],
      eligibilityCriteria: { minAge: 25, maxAge: 60, minSalary: 40000, minCreditScore: 750 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Address Proof"],
      rating: 4.7,
      views: 38720,
      applications: 7450,
      tags: ["Premium", "Rewards"],
      isPremium: true,
      isPopular: true,
      processingTime: "5-7 days"
    },
    {
      id: "hdfc-regalia",
      providerName: "HDFC Bank",
      providerLogo: "🏦",
      cardName: "HDFC Regalia",
      cardType: "Premium",
      category: "travel",
      joiningFee: 2500,
      annualFee: 2500,
      feeWaiver: "Waived on ₹3L annual spend",
      creditLimit: "Up to ₹10L",
      interestRate: 3.49,
      rewardRate: "4 reward points per ₹150",
      welcomeBonus: "10000 reward points",
      keyFeatures: ["Domestic & international lounge access", "Buy 1 Get 1 on movie tickets", "Accelerated rewards", "Golf privileges"],
      benefits: ["Airport lounge access", "Travel insurance", "Hotel privileges", "Concierge services"],
      eligibilityCriteria: { minAge: 21, maxAge: 60, minSalary: 100000, minCreditScore: 750 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Bank Statement"],
      rating: 4.8,
      views: 52340,
      applications: 9820,
      tags: ["Premium", "Travel", "Lounge"],
      isPremium: true,
      isPopular: true,
      processingTime: "7-10 days"
    },
    {
      id: "icici-platinum",
      providerName: "ICICI Bank",
      providerLogo: "🏪",
      cardName: "ICICI Platinum",
      cardType: "Credit",
      category: "shopping",
      joiningFee: 500,
      annualFee: 500,
      feeWaiver: "Waived on ₹30k annual spend",
      creditLimit: "Up to ₹5L",
      interestRate: 3.5,
      rewardRate: "2 reward points per ₹100",
      welcomeBonus: "2500 reward points",
      keyFeatures: ["Shopping offers & discounts", "Fuel surcharge waiver", "Easy EMI conversion", "Contactless payment"],
      benefits: ["E-commerce discounts", "Dining offers", "Movie benefits", "Insurance coverage"],
      eligibilityCriteria: { minAge: 21, maxAge: 65, minSalary: 25000, minCreditScore: 700 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip"],
      rating: 4.3,
      views: 41250,
      applications: 7890,
      tags: ["Shopping", "Fuel"],
      isPremium: false,
      isPopular: false,
      processingTime: "5-7 days"
    },
    {
      id: "axis-ace",
      providerName: "Axis Bank",
      providerLogo: "🔷",
      cardName: "Axis Bank ACE",
      cardType: "Credit",
      category: "cashback",
      joiningFee: 499,
      annualFee: 499,
      feeWaiver: "Waived on ₹2L annual spend",
      creditLimit: "Up to ₹4L",
      interestRate: 3.6,
      rewardRate: "5% cashback on bill payments",
      welcomeBonus: "₹500 e-gift voucher",
      keyFeatures: ["5% cashback on bills & recharges", "4% on dining", "2% on groceries", "1% on other spends"],
      benefits: ["High cashback on utilities", "Dining benefits", "Zero liability on lost card", "Reward redemption flexibility"],
      eligibilityCriteria: { minAge: 18, maxAge: 70, minSalary: 20000, minCreditScore: 680 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof"],
      rating: 4.5,
      views: 48920,
      applications: 8650,
      tags: ["Cashback", "Popular"],
      isPremium: false,
      isPopular: true,
      processingTime: "3-5 days"
    },
    {
      id: "sbi-simplyclick",
      providerName: "SBI Card",
      providerLogo: "🏛️",
      cardName: "SBI SimplyCLICK",
      cardType: "Credit",
      category: "shopping",
      joiningFee: 499,
      annualFee: 499,
      feeWaiver: "Waived on ₹1L annual spend",
      creditLimit: "Up to ₹3L",
      interestRate: 3.5,
      rewardRate: "10X rewards on online shopping",
      welcomeBonus: "2000 reward points",
      keyFeatures: ["10X rewards on partner merchants", "1X on other spends", "Annual movie vouchers", "Fuel surcharge waiver"],
      benefits: ["E-commerce rewards", "Dining offers", "Gift vouchers", "Contactless payments"],
      eligibilityCriteria: { minAge: 21, maxAge: 70, minSalary: 20000, minCreditScore: 700 },
      documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip", "Bank Statement"],
      rating: 4.2,
      views: 36780,
      applications: 6540,
      tags: ["Shopping", "Online"],
      isPremium: false,
      isPopular: false,
      processingTime: "7-10 days"
    }
  ];

  const categories = [
    { id: "all", name: "ALL CARDS", icon: CreditCard },
    { id: "rewards", name: "REWARDS", icon: Gift },
    { id: "cashback", name: "CASHBACK", icon: Percent },
    { id: "travel", name: "TRAVEL", icon: Plane },
    { id: "shopping", name: "SHOPPING", icon: ShoppingBag },
    { id: "lifestyle", name: "LIFESTYLE", icon: Sparkles }
  ];

  const filteredCards = useMemo(() => {
    let cards = mockCreditCards.filter((card) => {
      const matchesCategory = selectedCategory === "all" || card.category === selectedCategory;
      const matchesSearch = card.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.cardName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "rate-low") {
      cards = [...cards].sort((a, b) => a.interestRate - b.interestRate);
    } else if (sortBy === "rate-high") {
      cards = [...cards].sort((a, b) => b.interestRate - a.interestRate);
    } else if (sortBy === "rating") {
      cards = [...cards].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popularity") {
      cards = [...cards].sort((a, b) => b.applications - a.applications);
    }

    return cards;
  }, [mockCreditCards, selectedCategory, searchQuery, sortBy]);

  const totalItems = filteredCards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const paginatedCards = useMemo(() => filteredCards.slice(startIndex - 1, endIndex), [filteredCards, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else if (prev.length < 3) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const handleApplyCard = (cardId: string) => {
    navigate(`/credit-card-application?cardId=${cardId}`);
  };

  const handleViewDetails = (cardId: string) => {
    navigate(`/credit-card-detail/${cardId}`);
  };

  const compareCards = mockCreditCards.filter(card => selectedCards.includes(card.id));

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CREDIT CARD MARKETPLACE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Compare & apply for cards</p>
          </div>
          <div className="flex gap-2">
            {selectedCards.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompare(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none relative"
                data-testid="button-compare"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedCards.length}
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-cards")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-my-cards"
            >
              <CreditCard className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search cards, banks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
            data-testid="input-search-cards"
          />
        </div>

        <div className="space-y-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-6 gap-4">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                  data-testid={`tab-${category.id}`}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-4">
          {paginatedCards.map((card) => (
            <div 
              key={card.id} 
              className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6 hover:border-white/20 transition-all"
              data-testid={`card-${card.id}`}
            >
              <div className="mb-6 pb-5 border-b border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <Checkbox
                    checked={selectedCards.includes(card.id)}
                    onCheckedChange={() => handleCardSelection(card.id)}
                    className="border-white/20"
                    disabled={!selectedCards.includes(card.id) && selectedCards.length >= 3}
                    data-testid={`checkbox-compare-${card.id}`}
                  />
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-2xl bg-white/5">
                    {card.providerLogo}
                  </div>
                  <div>
                    <h3 className="font-light text-white text-lg tracking-wide mb-1">{card.providerName}</h3>
                    <p className="text-[11px] text-white/60 uppercase tracking-widest">{card.cardName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-20">
                  {card.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] border-white/20 text-white/70 rounded-none uppercase tracking-widest px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-white/10">
                <div className="space-y-2">
                  <p className="text-[11px] text-white/50 uppercase tracking-widest">Joining Fee</p>
                  <p className="text-xl font-light text-white tracking-tight">
                    {card.joiningFee === 0 ? 'FREE' : `₹${card.joiningFee}`}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-white/50 uppercase tracking-widest">Annual Fee</p>
                  <p className="text-xl font-light text-white tracking-tight">
                    {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee}`}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-white/50 uppercase tracking-widest">Reward Rate</p>
                  <p className="text-base font-light text-white tracking-tight">{card.rewardRate}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-white/50 uppercase tracking-widest">Credit Limit</p>
                  <p className="text-base font-light text-white tracking-tight">{card.creditLimit}</p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-[11px] text-white/50 uppercase tracking-widest mb-3">Key Features</p>
                <div className="flex flex-col gap-2">
                  {card.keyFeatures.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-[11px] text-white/70 tracking-wide">
                      <CheckCircle className="h-4 w-4 text-white/50 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-white/60" />
                    <span className="text-[11px] text-white/60 tracking-widest">{card.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-white/60" />
                    <span className="text-[11px] text-white/60 tracking-widest">{card.views.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-[11px] text-white/50 uppercase tracking-widest">Processing: {card.processingTime}</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleApplyCard(card.id)}
                  className="flex-1 bg-white text-black hover:bg-white/90 font-light h-11 rounded-none tracking-widest text-[10px] uppercase"
                  data-testid={`button-apply-${card.id}`}
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleViewDetails(card.id)}
                  className="flex-1 border border-white/20 text-white hover:bg-white/10 font-light h-11 rounded-none tracking-widest text-[10px] uppercase"
                  data-testid={`button-details-${card.id}`}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {filteredCards.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              canGoNext={currentPage < totalPages}
              canGoPrevious={currentPage > 1}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              className="mt-8"
            />
          )}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-16 border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
            <Search className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-base font-light text-white mb-2 uppercase tracking-widest">No Cards Found</h3>
            <p className="text-[10px] text-white/50 mb-6 uppercase tracking-widest">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-white text-black hover:bg-white/90 font-light rounded-none tracking-widest text-[10px] uppercase h-11"
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="bg-black border-white/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-light text-lg uppercase tracking-widest">
              Compare Credit Cards
            </DialogTitle>
            <DialogDescription className="text-white/50 text-xs uppercase tracking-widest">
              Side-by-side comparison of selected cards
            </DialogDescription>
          </DialogHeader>
          
          {compareCards.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-[11px] font-light text-white/50 uppercase tracking-widest w-48">
                      Features
                    </th>
                    {compareCards.map((card) => (
                      <th key={card.id} className="p-4 border-l border-white/10">
                        <div className="flex flex-col items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCardSelection(card.id)}
                            className="text-white/60 hover:text-white p-1 self-end"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="text-2xl">{card.providerLogo}</div>
                          <div className="text-center">
                            <p className="text-white font-light text-sm mb-1">{card.providerName}</p>
                            <p className="text-white/50 text-xs uppercase tracking-widest">{card.cardName}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Joining Fee</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {card.joiningFee === 0 ? 'FREE' : `₹${card.joiningFee}`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Annual Fee</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {card.annualFee === 0 ? 'FREE' : `₹${card.annualFee}`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Interest Rate</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {card.interestRate}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Credit Limit</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {card.creditLimit}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Reward Rate</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {card.rewardRate}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Min Salary</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        ₹{card.eligibilityCriteria.minSalary.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Min Credit Score</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center text-white font-light">
                        {card.eligibilityCriteria.minCreditScore}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Rating</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10 text-center">
                        <div className="flex items-center justify-center gap-1 text-white font-light">
                          <Star className="h-3 w-3" />
                          {card.rating}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Key Features</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10">
                        <div className="space-y-2">
                          {card.keyFeatures.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-white/50 mt-0.5 flex-shrink-0" />
                              <span className="text-white/70 text-xs text-left">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-[11px] text-white/50 uppercase tracking-widest font-light">Action</td>
                    {compareCards.map((card) => (
                      <td key={card.id} className="p-4 border-l border-white/10">
                        <Button
                          onClick={() => handleApplyCard(card.id)}
                          className="w-full bg-white text-black hover:bg-white/90 font-light h-9 rounded-none tracking-widest text-xs uppercase"
                        >
                          Apply Now
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-sm">Select cards to compare</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
