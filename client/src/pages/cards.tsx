import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  Lock,
  Unlock,
  Settings,
  MoreVertical,
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  ShoppingBag,
  Receipt,
  Zap,
  Info
} from "lucide-react";

interface CreditCard {
  id: string;
  bank: string;
  cardNumber: string;
  cardName: string;
  cardType: 'credit' | 'debit';
  totalLimit: number;
  usedAmount: number;
  availableLimit: number;
  dueDate: string;
  minimumDue: number;
  totalDue: number;
  rewardPoints: number;
  status: 'active' | 'blocked' | 'expired';
  expiryDate: string;
  isBlocked: boolean;
  cardColor: string;
}

export default function Cards() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [hideCardNumbers, setHideCardNumbers] = useState(true);

  // Fetch cards data
  const { data: cardsData, isLoading } = useQuery({
    queryKey: ['/api/cards'],
    enabled: isAuthenticated,
  });

  // Mock cards data
  const mockCards: CreditCard[] = [
    {
      id: "card-1",
      bank: "HDFC Bank",
      cardNumber: "4532 1234 5678 9012",
      cardName: "HDFC Regalia",
      cardType: "credit",
      totalLimit: 500000,
      usedAmount: 45000,
      availableLimit: 455000,
      dueDate: "15 Jan 2025",
      minimumDue: 4500,
      totalDue: 45000,
      rewardPoints: 12500,
      status: "active",
      expiryDate: "12/28",
      isBlocked: false,
      cardColor: "bg-gradient-to-br from-white/10 to-white/5"
    },
    {
      id: "card-2",
      bank: "SBI Card",
      cardNumber: "5123 4567 8901 2345",
      cardName: "SBI SimplyCLICK",
      cardType: "credit",
      totalLimit: 300000,
      usedAmount: 28000,
      availableLimit: 272000,
      dueDate: "22 Jan 2025",
      minimumDue: 2800,
      totalDue: 28000,
      rewardPoints: 8400,
      status: "active",
      expiryDate: "08/27",
      isBlocked: false,
      cardColor: "bg-gradient-to-br from-white/10 to-white/5"
    },
    {
      id: "card-3",
      bank: "ICICI Bank",
      cardNumber: "4111 1111 1111 1234",
      cardName: "ICICI Debit Card",
      cardType: "debit",
      totalLimit: 100000,
      usedAmount: 0,
      availableLimit: 85000,
      dueDate: "-",
      minimumDue: 0,
      totalDue: 0,
      rewardPoints: 450,
      status: "active",
      expiryDate: "03/26",
      isBlocked: false,
      cardColor: "bg-gradient-to-br from-white/10 to-white/5"
    }
  ];

  const cards = (cardsData as CreditCard[]) || mockCards;

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-none animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-light tracking-wider">Loading your cards...</p>
        </div>
      </div>
    );
  }

  const totalCreditLimit = cards.filter((c: CreditCard) => c.cardType === 'credit').reduce((sum: number, card: CreditCard) => sum + card.totalLimit, 0);
  const totalUsedAmount = cards.filter((c: CreditCard) => c.cardType === 'credit').reduce((sum: number, card: CreditCard) => sum + card.usedAmount, 0);
  const totalRewardPoints = cards.reduce((sum: number, card: CreditCard) => sum + card.rewardPoints, 0);

  const pagination = usePagination({
    data: cards,
    itemsPerPage: 20,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/investment")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider text-white">My Cards</h1>
              <p className="text-xs text-white/50 font-light tracking-widest uppercase">{cards.length} cards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cards/info")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-cards-info"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideCardNumbers(!hideCardNumbers)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-toggle-numbers"
            >
              {hideCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/add-card")}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              data-testid="button-add-card"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-white/80" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Total Limit</span>
            </div>
            <p className="text-xl font-light text-white">
              {hideCardNumbers ? "₹••••••" : `₹${(totalCreditLimit / 100000).toFixed(1)}L`}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-white/80" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Used Amount</span>
            </div>
            <p className="text-xl font-light text-white">
              {hideCardNumbers ? "₹••••••" : `₹${(totalUsedAmount / 1000).toFixed(0)}K`}
            </p>
            <p className="text-xs text-white/40 mt-1">
              {((totalUsedAmount / totalCreditLimit) * 100).toFixed(1)}% utilized
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-white/80" />
              <span className="text-xs text-white/60 uppercase tracking-wider">Reward Points</span>
            </div>
            <p className="text-xl font-light text-white">{totalRewardPoints.toLocaleString()}</p>
            <p className="text-xs text-white/80 mt-1">≈ ₹{(totalRewardPoints * 0.25).toFixed(0)} value</p>
          </div>
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Your Cards</h2>
          {pagination.paginatedData.map((card: CreditCard) => (
            <Card key={card.id} className="bg-white/5 border border-white/10 rounded-none overflow-hidden">
              <CardContent className="p-0">
                {/* Card Visual */}
                <div className={cn("relative p-6 text-white", card.cardColor)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm">{card.bank}</p>
                      <p className="text-lg font-semibold">{card.cardName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={card.cardType === 'credit' ? 'secondary' : 'outline'} 
                        className="text-xs"
                      >
                        {card.cardType.toUpperCase()}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-white/80 hover:text-white p-1">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xl font-mono tracking-wider">
                        {hideCardNumbers ? "**** **** **** " + card.cardNumber.slice(-4) : card.cardNumber}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs">Expires</p>
                        <p className="text-sm font-medium">{card.expiryDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.isBlocked ? (
                          <Lock className="h-4 w-4 text-white/80" />
                        ) : (
                          <Unlock className="h-4 w-4 text-white/80" />
                        )}
                        <CreditCard className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-4 bg-black/40">
                  {card.cardType === 'credit' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider">Available Limit</p>
                        <p className="text-sm font-light text-white">
                          {hideCardNumbers ? "₹••••••" : `₹${card.availableLimit.toLocaleString()}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider">Due Date</p>
                        <p className="text-sm font-light text-white">{card.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider">Total Due</p>
                        <p className="text-sm font-light text-white">
                          {hideCardNumbers ? "₹••••••" : `₹${card.totalDue.toLocaleString()}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider">Reward Points</p>
                        <p className="text-sm font-light text-white">{card.rewardPoints.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none" data-testid={`button-pay-${card.id}`}>
                      <Receipt className="h-4 w-4 mr-2" />
                      {card.cardType === 'credit' ? 'Pay Bill' : 'View Statement'}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none" data-testid={`button-manage-${card.id}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    {card.cardType === 'credit' && (
                      <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none" data-testid={`button-redeem-${card.id}`}>
                        <Zap className="h-4 w-4 mr-2" />
                        Redeem
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6"
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}