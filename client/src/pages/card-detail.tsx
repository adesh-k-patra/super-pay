import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Building,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Lock,
  Unlock,
  Zap,
  Shield,
  Target,
  Activity,
  BarChart3,
  Coins,
  Receipt,
  IndianRupee,
  Percent,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Hexagon
} from "lucide-react";

interface CreditCardItem {
  id: string;
  cardNumber: string;
  cardName: string;
  cardType: "credit" | "debit" | "prepaid";
  bankName: string;
  cardIssuer?: string;
  cardLevel?: string;
  cardNetwork: "visa" | "mastercard" | "rupay" | "amex";
  status: "active" | "blocked" | "expired" | "inactive";
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
  minimumDue?: number;
  totalDue?: number;
  dueDate?: string;
  issueDate?: string;
  lastTransaction?: string;
  rewardPoints?: number;
  cashback?: number;
  expiryDate: string;
  isBlocked: boolean;
  isPrimaryCard: boolean;
  monthlySpend: number;
  totalPaid?: number;
  annualFee?: number;
  interestRate?: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  category: string;
  status: "completed" | "pending" | "failed";
}

interface RewardTask {
  id: string;
  description: string;
  completed: boolean;
  target?: number;
  current?: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  currentPoints: number;
  category: string;
  expiryDate?: string;
  tasks: RewardTask[];
  rewardType: "cashback" | "voucher" | "discount" | "product";
  rewardValue: string;
}

const getBrandTheme = (issuer?: string) => {
  const issuerLower = issuer?.toLowerCase() || '';
  
  if (issuerLower.includes('hdfc')) {
    return {
      gradient: 'bg-gradient-to-br from-red-700 via-red-800 to-red-900',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-transparent to-red-900/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
          </div>
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-red-700 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>HDFC</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Bank</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('icici')) {
    return {
      gradient: 'bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-transparent to-orange-800/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-orange-600 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>ICICI</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Bank</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('sbi') || issuerLower.includes('state bank')) {
    return {
      gradient: 'bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-blue-900/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-blue-800 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>SBI</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Bank</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('axis')) {
    return {
      gradient: 'bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-transparent to-purple-900/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-purple-700 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>AXIS</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Bank</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('kotak')) {
    return {
      gradient: 'bg-gradient-to-br from-red-600 via-red-700 to-red-800',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-red-800/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-red-600 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>KOTAK</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Mahindra Bank</p>
        </>
      )
    };
  }
  
  // Default theme for unknown issuers
  return {
    gradient: '',
    overlays: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full blur-3xl translate-y-20 -translate-x-20" />
      </>
    ),
    logo: issuer ? (
      <>
        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-1 ml-auto">
          <p className="text-white/90 text-xs font-semibold">{issuer.substring(0, 2).toUpperCase()}</p>
        </div>
        <p className="text-white/90 text-[10px] font-medium tracking-wide">{issuer}</p>
      </>
    ) : null
  };
};

export default function CardDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const params = useParams();
  const cardId = params.cardId;
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock cards data (in real app, this would come from APIs)
  const mockCards: CreditCardItem[] = [
    {
      id: "card-1",
      cardNumber: "****1234",
      cardName: "Premium Credit Card",
      cardType: "credit",
      bankName: "HDFC Bank",
      cardIssuer: "HDFC Bank Ltd.",
      cardLevel: "Platinum",
      cardNetwork: "visa",
      status: "active",
      balance: 0,
      creditLimit: 200000,
      availableCredit: 165000,
      minimumDue: 8500,
      totalDue: 35000,
      dueDate: "2025-01-15",
      issueDate: "2023-01-10",
      lastTransaction: "2024-12-28",
      rewardPoints: 12500,
      cashback: 2450,
      expiryDate: "12/28",
      isBlocked: false,
      isPrimaryCard: true,
      monthlySpend: 35000,
      totalPaid: 145000,
      annualFee: 999,
      interestRate: 3.5
    },
    {
      id: "card-2",
      cardNumber: "****5678",
      cardName: "Salary Account Debit",
      cardType: "debit",
      bankName: "ICICI Bank",
      cardNetwork: "mastercard",
      status: "active",
      balance: 45000,
      lastTransaction: "2024-12-29",
      rewardPoints: 1250,
      expiryDate: "03/27",
      isBlocked: false,
      isPrimaryCard: false,
      monthlySpend: 18000
    },
    {
      id: "card-3",
      cardNumber: "****9012",
      cardName: "Business Platinum",
      cardType: "credit",
      bankName: "Axis Bank",
      cardNetwork: "mastercard",
      status: "active",
      balance: 0,
      creditLimit: 500000,
      availableCredit: 425000,
      minimumDue: 15000,
      dueDate: "2025-01-20",
      lastTransaction: "2024-12-27",
      rewardPoints: 25000,
      cashback: 3200,
      expiryDate: "08/26",
      isBlocked: false,
      isPrimaryCard: false,
      monthlySpend: 75000,
      annualFee: 2999
    },
    {
      id: "card-4",
      cardNumber: "****3456",
      cardName: "Travel Rewards Card",
      cardType: "credit",
      bankName: "SBI",
      cardNetwork: "rupay",
      status: "blocked",
      balance: 0,
      creditLimit: 100000,
      availableCredit: 0,
      minimumDue: 0,
      lastTransaction: "2024-12-10",
      rewardPoints: 8500,
      expiryDate: "05/25",
      isBlocked: true,
      isPrimaryCard: false,
      monthlySpend: 0,
      annualFee: 499
    }
  ];

  const card = mockCards.find(c => c.id === cardId);

  const mockTransactions: Transaction[] = [
    {
      id: "paid-1",
      date: "2024-12-29",
      description: "Amazon Purchase",
      amount: 3500,
      type: "debit",
      category: "Shopping",
      status: "completed"
    },
    {
      id: "paid-2",
      date: "2024-12-28",
      description: "Swiggy Food Order",
      amount: 850,
      type: "debit",
      category: "Food",
      status: "completed"
    },
    {
      id: "received-1",
      date: "2024-12-27",
      description: "Salary Credit",
      amount: 85000,
      type: "credit",
      category: "Income",
      status: "completed"
    },
    {
      id: "txn-001",
      date: "2024-12-26",
      description: "Uber Ride",
      amount: 450,
      type: "debit",
      category: "Travel",
      status: "completed"
    },
    {
      id: "txn-002",
      date: "2024-12-25",
      description: "Flipkart Purchase",
      amount: 12500,
      type: "debit",
      category: "Shopping",
      status: "completed"
    }
  ];

  // Mock spending data by category
  const categorySpending = [
    { category: "Shopping", amount: 45000, percentage: 35, color: "#10b981" },
    { category: "Food & Dining", amount: 28000, percentage: 22, color: "#f59e0b" },
    { category: "Travel", amount: 22000, percentage: 17, color: "#3b82f6" },
    { category: "Entertainment", amount: 18000, percentage: 14, color: "#8b5cf6" },
    { category: "Bills & Utilities", amount: 15000, percentage: 12, color: "#ef4444" }
  ];

  // Mock monthly spending trend
  const monthlySpending = [
    { month: "Jul", amount: 42000 },
    { month: "Aug", amount: 38000 },
    { month: "Sep", amount: 45000 },
    { month: "Oct", amount: 52000 },
    { month: "Nov", amount: 48000 },
    { month: "Dec", amount: 35000 }
  ];

  const pagination = usePagination({
    data: mockTransactions,
    itemsPerPage: 20,
  });

  const handleBlockCard = () => {
    toast({
      title: card?.isBlocked ? "Card Unblocked" : "Card Blocked",
      description: card?.isBlocked ? "Your card has been unblocked successfully" : "Your card has been blocked successfully"
    });
  };

  const handleSetPrimary = () => {
    toast({
      title: "Primary Card Set",
      description: "This card is now your primary card"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-white/80 border-white/20 bg-white/5";
      case "blocked": return "text-white/80 border-white/20 bg-white/5";
      case "expired": return "text-white/80 border-white/20 bg-white/5";
      case "inactive": return "text-white/60 border-white/10 bg-white/5";
      default: return "text-white border-white/10 bg-white/5";
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case "visa": return "from-blue-600 via-blue-500 to-purple-600";
      case "mastercard": return "from-orange-500 via-red-500 to-pink-600";
      case "rupay": return "from-emerald-600 via-green-500 to-teal-600";
      case "amex": return "from-slate-700 via-slate-600 to-gray-700";
      default: return "from-indigo-600 via-purple-500 to-pink-600";
    }
  };

  if (!card) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <XCircle className="h-16 w-16 text-white/80 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Card Not Found</h2>
          <p className="text-white/60 mb-6">The card you're looking for doesn't exist</p>
          <Button 
            onClick={() => navigate("/my-cards")} 
            className="bg-white text-black hover:bg-white/90"
            data-testid="button-back-to-cards"
          >
            Back to Cards
          </Button>
        </div>
      </div>
    );
  }

  const creditUtilization = card.creditLimit ? ((card.creditLimit - (card.availableCredit || 0)) / card.creditLimit) * 100 : 0;

  const mockRewards: Reward[] = [
    {
      id: "reward-1",
      title: "₹500 Cashback Reward",
      description: "Get ₹500 cashback on completing all tasks",
      pointsRequired: 5000,
      currentPoints: card.rewardPoints || 0,
      category: "Cashback",
      expiryDate: "2025-03-31",
      rewardType: "cashback",
      rewardValue: "₹500",
      tasks: [
        { id: "task-1", description: "Spend ₹10,000 in a month", completed: true, target: 10000, current: 35000 },
        { id: "task-2", description: "Make 5 online transactions", completed: true, target: 5, current: 8 },
        { id: "task-3", description: "Pay bill on time for 3 months", completed: false, target: 3, current: 2 }
      ]
    },
    {
      id: "reward-2",
      title: "Amazon Gift Voucher",
      description: "₹1000 Amazon gift voucher for premium members",
      pointsRequired: 10000,
      currentPoints: card.rewardPoints || 0,
      category: "Voucher",
      expiryDate: "2025-06-30",
      rewardType: "voucher",
      rewardValue: "₹1000",
      tasks: [
        { id: "task-4", description: "Spend ₹50,000 cumulative", completed: true, target: 50000, current: 145000 },
        { id: "task-5", description: "Maintain credit score above 750", completed: true },
        { id: "task-6", description: "Use card for international transactions", completed: false }
      ]
    },
    {
      id: "reward-3",
      title: "30% Movie Ticket Discount",
      description: "Get 30% off on movie tickets at BookMyShow",
      pointsRequired: 2000,
      currentPoints: card.rewardPoints || 0,
      category: "Entertainment",
      expiryDate: "2025-02-28",
      rewardType: "discount",
      rewardValue: "30%",
      tasks: [
        { id: "task-7", description: "Make 3 entertainment category purchases", completed: true, target: 3, current: 5 },
        { id: "task-8", description: "Activate entertainment offers", completed: true }
      ]
    },
    {
      id: "reward-4",
      title: "Airport Lounge Access",
      description: "Complimentary airport lounge access for 2 visits",
      pointsRequired: 15000,
      currentPoints: card.rewardPoints || 0,
      category: "Travel",
      rewardType: "product",
      rewardValue: "2 Visits",
      tasks: [
        { id: "task-9", description: "Spend ₹2,00,000 in 6 months", completed: false, target: 200000, current: 145000 },
        { id: "task-10", description: "Book flight tickets using card", completed: true },
        { id: "task-11", description: "Enroll in travel rewards program", completed: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CARD DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{card.cardNumber}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Realistic Credit Card with 3D Effect */}
        <div className="perspective-1000">
          <div className={cn(
            "relative h-60 p-7 flex flex-col justify-between overflow-hidden rounded-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(255,255,255,0.1)_inset,0_-2px_8px_rgba(0,0,0,0.2)_inset]",
            "border border-white/10",
            "transform transition-transform hover:scale-[1.02]",
            getBrandTheme(card.cardIssuer).gradient || getNetworkColor(card.cardNetwork)
          )}
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(255,255,255,0.1) inset, 0 -2px 8px rgba(0,0,0,0.2) inset, 0 1px 1px rgba(255,255,255,0.15) inset'
          }}>
            {/* Brand-specific overlays */}
            {getBrandTheme(card.cardIssuer).overlays}
            
            <div className="relative z-10">
              {/* Top section - Chip and Organization */}
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {/* EMV Chip with realistic 3D effect */}
                  <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-400/90 to-yellow-600/90 relative overflow-hidden shadow-md"
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.3) inset'
                    }}>
                    <div className="absolute inset-0.5 grid grid-cols-4 grid-rows-3 gap-[1px] p-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-yellow-700/40 rounded-[1px]" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-white/90 text-[11px] uppercase font-semibold tracking-widest">{card.cardType}</p>
                      <Badge className={cn("rounded-sm font-light text-[9px] border-0 px-2", getStatusColor(card.status))}>
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </Badge>
                    </div>
                    {card.cardLevel && (
                      <p className="text-white/90 text-sm font-medium tracking-wide">{card.cardLevel}</p>
                    )}
                  </div>
                </div>
                {/* Organization logo and name */}
                <div className="text-right">
                  {getBrandTheme(card.cardIssuer).logo}
                </div>
              </div>

              {/* Card number with realistic spacing */}
              <div className="mt-6 mb-4">
                <p className="text-white text-xl sm:text-2xl font-mono tracking-[0.3em] drop-shadow-md">{card.cardNumber}</p>
              </div>

              {/* Bottom section - Name on left, Network on right */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/60 text-[8px] uppercase tracking-widest font-light mb-0.5">Card Holder</p>
                  <p className="text-white/95 text-sm font-medium tracking-wider uppercase">Joshua J Kanatt</p>
                  <p className="text-white/70 text-[10px] mt-1">Valid Thru: {card.expiryDate}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-white font-semibold text-2xl uppercase tracking-wider drop-shadow-lg">{card.cardNetwork}</p>
                  {card.isPrimaryCard && (
                    <Badge className="bg-white/20 text-white border-white/30 rounded-md font-light text-[9px] shadow-sm">
                      <Star className="h-2.5 w-2.5 mr-0.5 fill-white" />
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-rewards">Rewards</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-0 mt-6">
            {/* Payment Due - Card Style (if applicable) */}
            {card.cardType === "credit" && card.dueDate && (
              <div className="border border-white/20 bg-black p-5 mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-white" />
                    <h3 className="text-[11px] text-white uppercase tracking-widest font-light">Payment Due</h3>
                  </div>
                  <p className="text-[10px] text-white/60">{new Date(card.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Total Due</p>
                    <p className="text-lg font-light text-white tracking-tight">
                      {hideAmounts ? "₹••••••" : `₹${(card.totalDue! / 1000).toFixed(1)}K`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Minimum Due</p>
                    <p className="text-lg font-light text-white tracking-tight">
                      {hideAmounts ? "₹•••••" : `₹${(card.minimumDue! / 1000).toFixed(1)}K`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Credit Details - Card Layout */}
            {card.cardType === "credit" && (
              <div className="pt-0 mb-16">
                <h3 className="text-[11px] text-white uppercase tracking-widest font-light mb-4">Credit Details</h3>
                
                <div className="border border-white/20 bg-black p-4">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="border-r border-white/10 pr-4">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Total Limit</p>
                      <p className="text-xl font-light text-white tracking-tight" data-testid="text-credit-limit">
                        {hideAmounts ? "₹••••••" : `₹${(card.creditLimit! / 100000).toFixed(1)}L`}
                      </p>
                    </div>
                    <div className="pl-0">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Available</p>
                      <p className="text-xl font-light text-white tracking-tight" data-testid="text-available-credit">
                        {hideAmounts ? "₹••••••" : `₹${(card.availableCredit! / 100000).toFixed(1)}L`}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] text-white/40 uppercase tracking-widest">Utilization</span>
                      <span className="text-xs font-light text-white">{creditUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 overflow-hidden">
                      <div 
                        className="h-1.5 transition-all duration-300 bg-white"
                        style={{ width: `${creditUtilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div className="border-r border-white/10 pr-4">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-sm font-light text-white">
                        {hideAmounts ? "₹••••••" : `₹${(card.totalPaid! / 1000).toFixed(0)}K`}
                      </p>
                    </div>
                    {card.interestRate && (
                      <div className="pl-0">
                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Interest Rate</p>
                        <p className="text-sm font-light text-white">{card.interestRate}% p.m.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {card.cardType === "debit" && (
              <div className="py-5 border-t border-white/10">
                <h3 className="text-[11px] text-white/70 uppercase tracking-widest font-light mb-3 px-1">Balance</h3>
                <div className="space-y-0.5 px-1">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest">Available Balance</p>
                  <p className="text-xl font-light text-white tracking-tight" data-testid="text-balance">
                    {hideAmounts ? "₹••••••" : `₹${(card.balance / 1000).toFixed(1)}K`}
                  </p>
                </div>
              </div>
            )}

            {/* Card Information - Card Layout */}
            <div className="pt-4 mb-16">
              <h3 className="text-[11px] text-white uppercase tracking-widest font-light mb-4">Card Information</h3>
              
              <div className="border border-white/20 bg-black p-4">
                <div className="space-y-0">
                  {card.cardIssuer && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">Issuer</p>
                      <p className="text-xs text-white font-light">{card.cardIssuer}</p>
                    </div>
                  )}
                  {card.cardLevel && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">Card Level</p>
                      <p className="text-xs text-white font-light">{card.cardLevel}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Card Type</p>
                    <p className="text-xs text-white font-light capitalize">{card.cardType}</p>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Network</p>
                    <p className="text-xs text-white font-light uppercase">{card.cardNetwork}</p>
                  </div>
                  {card.issueDate && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest">Issue Date</p>
                      <p className="text-xs text-white font-light">{new Date(card.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Expiry Date</p>
                    <p className="text-xs text-white font-light">{card.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending - Card with Grid Layout */}
            <div className="pt-4 mb-16">
              <h3 className="text-[11px] text-white uppercase tracking-widest font-light mb-4">Spending & Fees</h3>
              
              <div className="border border-white/20 bg-black">
                <div className="p-4 border-b border-white/10">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-2">This Month's Spending</p>
                  <p className="text-xl font-light text-white" data-testid="text-monthly-spend">
                    {hideAmounts ? "₹••••••" : `₹${(card.monthlySpend / 1000).toFixed(1)}K`}
                  </p>
                </div>
                
                <div className="grid grid-cols-2">
                  {card.annualFee && (
                    <div className="p-4 border-r border-white/10">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Annual Fee</p>
                      <p className="text-sm font-light text-white">₹{card.annualFee.toLocaleString()}</p>
                    </div>
                  )}
                  {card.lastTransaction && (
                    <div className={cn("p-4", !card.annualFee && "col-span-2")}>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Last Transaction</p>
                      <p className="text-sm font-light text-white">{new Date(card.lastTransaction).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rewards - Card Style */}
            <div className="border border-white/20 bg-black p-5 pt-9">
              <h3 className="text-[11px] text-white/70 uppercase tracking-widest font-light mb-4">Rewards</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest">Points</p>
                  <p className="text-base font-light text-white" data-testid="text-reward-points">
                    {hideAmounts ? "•••••" : card.rewardPoints?.toLocaleString()}
                  </p>
                </div>
                {card.cashback && (
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Cashback</p>
                    <p className="text-base font-light text-white" data-testid="text-cashback">
                      {hideAmounts ? "₹•••" : `₹${(card.cashback / 1000).toFixed(1)}K`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4 mt-6">
            <h3 className="text-white font-light tracking-wider mb-4 px-1">Available Rewards</h3>
            
            <div className="space-y-3">
              {mockRewards.map((reward) => {
                const progress = (reward.currentPoints / reward.pointsRequired) * 100;
                const completedTasks = reward.tasks.filter(t => t.completed).length;
                const totalTasks = reward.tasks.length;
                const allTasksCompleted = completedTasks === totalTasks;
                
                return (
                  <div
                    key={reward.id}
                    onClick={() => setSelectedReward(reward)}
                    className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5 cursor-pointer hover:bg-white/10 transition-all"
                    data-testid={`reward-${reward.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-light text-white mb-1">{reward.title}</h4>
                        <p className="text-xs text-white/50 font-light">{reward.description}</p>
                      </div>
                      <Badge className={cn(
                        "ml-3 text-[10px] rounded-sm border-0 font-light",
                        reward.rewardType === "cashback" ? "bg-green-500/20 text-green-400" :
                        reward.rewardType === "voucher" ? "bg-blue-500/20 text-blue-400" :
                        reward.rewardType === "discount" ? "bg-purple-500/20 text-purple-400" :
                        "bg-orange-500/20 text-orange-400"
                      )}>
                        {reward.category}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40 font-light">Points Progress</span>
                        <span className="text-white font-light">
                          {reward.currentPoints.toLocaleString()} / {reward.pointsRequired.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-white/10" />
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Tasks</span>
                        <Badge className={cn(
                          "text-[10px] rounded-sm border-0 font-light",
                          allTasksCompleted ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/70"
                        )}>
                          {completedTasks}/{totalTasks} Complete
                        </Badge>
                      </div>
                      {reward.expiryDate && (
                        <div className="text-xs text-white/40 font-light">
                          Expires: {new Date(reward.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-6">
            <h3 className="text-white font-light tracking-wider mb-4 px-1">Spending Analytics</h3>
            
            {/* Financial Summary Cards */}
            {card.cardType === "credit" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Remaining Limit</p>
                  <p className="text-2xl font-light text-white">
                    {hideAmounts ? "₹••••••" : `₹${((card.availableCredit || 0) / 1000).toFixed(0)}K`}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    of ₹{((card.creditLimit || 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-2xl font-light text-white">
                    {hideAmounts ? "₹••••••" : `₹${((card.totalPaid || 0) / 1000).toFixed(0)}K`}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Lifetime</p>
                </div>
              </div>
            )}

            {/* Category Spending Breakdown */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
              <h4 className="text-sm text-white/70 uppercase tracking-widest font-light mb-4">Spending by Category</h4>
              <div className="space-y-4">
                {categorySpending.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm text-white font-light">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white font-light">
                          {hideAmounts ? "₹•••••" : `₹${(cat.amount / 1000).toFixed(1)}K`}
                        </p>
                        <p className="text-xs text-white/40">{cat.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50 uppercase tracking-widest">Total Spending</span>
                  <span className="text-xl font-light text-white">
                    {hideAmounts ? "₹••••••" : `₹${(categorySpending.reduce((sum, cat) => sum + cat.amount, 0) / 1000).toFixed(1)}K`}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Spending Trend */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
              <h4 className="text-sm text-white/70 uppercase tracking-widest font-light mb-5">Monthly Trend (Last 6 Months)</h4>
              
              <div className="space-y-3">
                {monthlySpending.map((month, index) => {
                  const maxAmount = Math.max(...monthlySpending.map(m => m.amount));
                  const barWidth = (month.amount / maxAmount) * 100;
                  
                  return (
                    <div key={month.month} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50 w-12">{month.month}</span>
                        <span className="text-white font-light">
                          {hideAmounts ? "₹•••••" : `₹${(month.amount / 1000).toFixed(1)}K`}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-6 rounded-sm overflow-hidden">
                        <div 
                          className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {barWidth > 20 && (
                            <span className="text-xs text-white font-light opacity-80">
                              {hideAmounts ? "" : `₹${(month.amount / 1000).toFixed(0)}K`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Average Monthly</p>
                  <p className="text-lg font-light text-white">
                    {hideAmounts ? "₹••••" : `₹${(monthlySpending.reduce((sum, m) => sum + m.amount, 0) / monthlySpending.length / 1000).toFixed(1)}K`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Highest Month</p>
                  <p className="text-lg font-light text-white">
                    {hideAmounts ? "₹••••" : `₹${(Math.max(...monthlySpending.map(m => m.amount)) / 1000).toFixed(1)}K`}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            {card.cardType === "credit" && (
              <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
                <h4 className="text-sm text-white/70 uppercase tracking-widest font-light mb-4">Other Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-white/50">Credit Utilization</span>
                    <span className="text-sm text-white font-light">{creditUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-sm text-white/50">Used Credit</span>
                    <span className="text-sm text-white font-light">
                      {hideAmounts ? "₹••••" : `₹${((card.creditLimit! - card.availableCredit!) / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                  {card.interestRate && (
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-white/50">Interest Rate (p.m.)</span>
                      <span className="text-sm text-white font-light">{card.interestRate}%</span>
                    </div>
                  )}
                  {card.annualFee && (
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-white/50">Annual Fee</span>
                      <span className="text-sm text-white font-light">₹{card.annualFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-white/50">Reward Points Balance</span>
                    <span className="text-sm text-white font-light">{card.rewardPoints?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-0 mt-6">
            <h3 className="text-white font-light tracking-wider mb-4 px-1">Recent Transactions</h3>
            
            <div className="space-y-0">
              {pagination.paginatedData.map((txn, index) => (
                <div 
                  key={txn.id}
                  onClick={() => navigate(`/transaction-detail/${txn.id}`)}
                  className={cn(
                    "flex items-center justify-between p-4 transition-all hover:bg-white/5 cursor-pointer",
                    "bg-gradient-to-r",
                    txn.type === "credit" 
                      ? "from-emerald-950/40 via-emerald-950/20 to-transparent hover:from-emerald-950/50 hover:via-emerald-950/30" 
                      : "from-white/5 via-white/3 to-transparent hover:from-white/8 hover:via-white/5",
                    index === 0 && "border-t border-white/10",
                    "border-b border-white/10"
                  )}
                  data-testid={`transaction-${txn.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                      "w-11 h-11 flex items-center justify-center rounded-full",
                      txn.type === "credit" 
                        ? "bg-emerald-500/20 border border-emerald-500/30" 
                        : "bg-white/10 border border-white/20"
                    )}>
                      {txn.type === "credit" ? (
                        <ArrowDownRight className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-white/80" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light text-white truncate">{txn.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-white/50 font-light">{new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <span className="text-white/30">•</span>
                        <p className="text-xs text-white/50 font-light">{txn.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className={cn(
                        "text-base font-light",
                        txn.type === "credit" ? "text-emerald-400" : "text-white"
                      )}>
                        {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                      </p>
                      <Badge 
                        className={cn(
                          "text-[10px] mt-1 rounded-sm font-light border-0",
                          txn.status === "completed" ? "bg-white/10 text-white/70" :
                          txn.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                          "bg-red-500/20 text-red-400"
                        )}
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.goToPage}
                canGoNext={pagination.canGoNext}
                canGoPrevious={pagination.canGoPrevious}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                totalItems={pagination.totalItems}
              />
            </div>

            <Button 
              variant="ghost" 
              className="w-full text-white hover:bg-white/10 rounded-none font-light tracking-wider mt-4 border border-white/10"
              data-testid="button-view-all-transactions"
            >
              View All Transactions
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </TabsContent>
        </Tabs>

        {/* Reward Detail Dialog */}
        <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
          <DialogContent className="bg-black border border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-light tracking-wider">{selectedReward?.title}</DialogTitle>
              <DialogDescription className="text-sm text-white/50">
                {selectedReward?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedReward && (
              <div className="space-y-5 mt-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <p className="text-sm text-white/50 mb-1">Reward Value</p>
                    <p className="text-2xl font-light text-white">{selectedReward.rewardValue}</p>
                  </div>
                  <Badge className={cn(
                    "text-xs rounded-sm border-0 font-light px-3 py-1",
                    selectedReward.rewardType === "cashback" ? "bg-green-500/20 text-green-400" :
                    selectedReward.rewardType === "voucher" ? "bg-blue-500/20 text-blue-400" :
                    selectedReward.rewardType === "discount" ? "bg-purple-500/20 text-purple-400" :
                    "bg-orange-500/20 text-orange-400"
                  )}>
                    {selectedReward.rewardType.toUpperCase()}
                  </Badge>
                </div>

                {selectedReward.expiryDate && (
                  <div className="pb-4 border-b border-white/10">
                    <p className="text-xs text-white/40">
                      Valid until: {new Date(selectedReward.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/50">Points Progress</span>
                    <span className="text-white font-light">
                      {selectedReward.currentPoints.toLocaleString()} / {selectedReward.pointsRequired.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(selectedReward.currentPoints / selectedReward.pointsRequired) * 100} 
                    className="h-2 bg-white/10" 
                  />
                  <p className="text-xs text-white/40 text-right">
                    {selectedReward.currentPoints >= selectedReward.pointsRequired ? 
                      "Points requirement met!" : 
                      `${(selectedReward.pointsRequired - selectedReward.currentPoints).toLocaleString()} points needed`
                    }
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <h4 className="text-sm font-light text-white/70 mb-3 uppercase tracking-widest">Tasks to Complete</h4>
                  <div className="space-y-3">
                    {selectedReward.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-start gap-3 p-3 bg-white/5 border border-white/10"
                      >
                        <div className="mt-0.5">
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-light",
                            task.completed ? "text-white line-through" : "text-white/90"
                          )}>
                            {task.description}
                          </p>
                          {task.target && task.current !== undefined && (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-white/40">Progress</span>
                                <span className="text-white/60">{task.current.toLocaleString()} / {task.target.toLocaleString()}</span>
                              </div>
                              <Progress 
                                value={(task.current / task.target) * 100} 
                                className="h-1 bg-white/10" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-white text-black hover:bg-white/90 font-light tracking-wider"
                  onClick={() => {
                    const completedTasks = selectedReward.tasks.filter(t => t.completed).length;
                    const totalTasks = selectedReward.tasks.length;
                    const pointsReached = selectedReward.currentPoints >= selectedReward.pointsRequired;
                    
                    if (completedTasks === totalTasks && pointsReached) {
                      toast({
                        title: "Reward Claimed!",
                        description: `Your ${selectedReward.rewardValue} reward has been claimed successfully.`
                      });
                      setSelectedReward(null);
                    } else {
                      toast({
                        title: "Cannot Claim",
                        description: "Complete all tasks and earn required points to claim this reward.",
                        variant: "destructive"
                      });
                    }
                  }}
                  data-testid="button-claim-reward"
                >
                  {selectedReward.tasks.filter(t => t.completed).length === selectedReward.tasks.length && 
                   selectedReward.currentPoints >= selectedReward.pointsRequired ? 
                    "Claim Reward" : 
                    "Complete Tasks to Claim"
                  }
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Sticky Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="h-12 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
            onClick={() => {
              if (card?.totalDue && card.totalDue > 0) {
                navigate(`/upi-payment?amount=${card.totalDue}&transactionType=credit-card-bill&cardNumber=${card.cardNumber}&cardName=${card.cardName}&bankName=${card.bankName}&returnUrl=/cards/${cardId}`);
              } else {
                toast({ title: "No Bill Due", description: "You don't have any outstanding bill to pay" });
              }
            }}
            data-testid="button-pay-bill"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay Bill
          </Button>
          <Button
            variant="outline"
            className="h-12 border-white/20 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
            onClick={() => toast({ title: "Statement", description: "Downloading statement..." })}
            data-testid="button-download-statement-main"
          >
            <Download className="h-5 w-5 mr-2" />
            Statement
          </Button>
        </div>
      </div>
    </div>
  );
}
