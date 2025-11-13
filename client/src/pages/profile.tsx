import { useState, useEffect, useCallback } from "react";
import { LoadingLogo } from "@/components/ui/loading-logo";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { 
  User, 
  TrendingUp,
  Eye,
  EyeOff,
  CreditCard,
  Gift,
  Receipt,
  BarChart3,
  PieChart,
  Building2,
  Plane,
  Calendar,
  History,
  ChevronRight,
  Activity,
  Shield,
  Camera,
  Wallet,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Crown,
  Star,
  Link2,
  Copy,
  Download,
  Edit3,
  Percent,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  QrCode,
  HelpCircle,
  Send,
  PiggyBank,
  DollarSign,
  Coins,
  Banknote,
  Smartphone,
  Droplet,
  Lightbulb,
  Zap,
  Wifi,
  Car,
  Train,
  Hotel,
  Ticket,
  Globe,
  Bike,
  Map,
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Sparkles,
  Truck,
  TrendingDown,
  Target,
  Briefcase,
  Calculator,
  FileText,
  Heart,
  Film,
  PartyPopper,
  Dumbbell,
  BookOpen,
  Wrench,
  Gem,
  Newspaper,
  AlertCircle,
  ArrowRight
} from "lucide-react";

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  value?: string;
  subtitle?: string;
  badge?: string;
  isNew?: boolean;
  color?: string;
  shadow?: string;
}

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [hideAmounts, setHideAmounts] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [fadeOutLoading, setFadeOutLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const profileStats = {
    walletBalance: 245600,
    totalInvestments: 1850000,
    activeLoans: 2,
    todaysSpend: 2450,
    netWorth: 2850000,
    creditScore: 785,
    kycStatus: "verified",
    membershipTier: "Gold",
    rewardPoints: 8450
  };

  const formatCurrency = useCallback((amount: number) => {
    if (hideAmounts) return "₹••••••";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, [hideAmounts]);

  const formatCompact = useCallback((amount: number) => {
    if (hideAmounts) return "••••";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  }, [hideAmounts]);

  const profileSections: ProfileSection[] = [
    {
      id: "about",
      title: "About",
      description: "Identity & KYC details",
      icon: User,
      route: "/profile/about",
      badge: profileStats.kycStatus === "verified" ? "Verified" : "Pending"
    },
    {
      id: "edit-profile",
      title: "Edit Profile",
      description: "Update personal info",
      icon: Edit3,
      route: "/edit-profile"
    },
    {
      id: "my-loans",
      title: "My Loans",
      description: "All loans & repayments",
      icon: Building2,
      route: "/my-loans",
      value: `${profileStats.activeLoans} active`,
      subtitle: "View details"
    },
    {
      id: "my-investments",
      title: "My Investments",
      description: "Portfolio & holdings",
      icon: PieChart,
      route: "/my-investments",
      value: formatCompact(profileStats.totalInvestments),
      subtitle: "Manage portfolio"
    },
    {
      id: "my-bills",
      title: "My Bills",
      description: "Upcoming & paid bills",
      icon: Receipt,
      route: "/my-bills",
      badge: "4 pending"
    },
    {
      id: "my-trips",
      title: "My Bookings",
      description: "Travel history & bookings",
      icon: Plane,
      route: "/all-tickets"
    },
    {
      id: "my-emis",
      title: "My EMIs",
      description: "EMI dashboard",
      icon: Calendar,
      route: "/my-emis"
    },
    {
      id: "personal-finance",
      title: "Personal Finance",
      description: "Budget, goals & insights",
      icon: BarChart3,
      route: "/my-personal-finance-dashboard",
      value: formatCompact(profileStats.netWorth),
      subtitle: "Net worth"
    },
    {
      id: "pay-history",
      title: "Pay History",
      description: "All transactions",
      icon: History,
      route: "/my-pay-history"
    },
    {
      id: "my-cards",
      title: "My Cards",
      description: "Saved cards",
      icon: CreditCard,
      route: "/my-cards",
      badge: "4 cards"
    },
    {
      id: "bank-accounts",
      title: "Bank Accounts",
      description: "Linked accounts & UPI",
      icon: Wallet,
      route: "/my-bank-accounts"
    },
    {
      id: "my-insurance",
      title: "My Insurance",
      description: "All insurance policies",
      icon: Shield,
      route: "/my-insurance",
      badge: "2 active"
    },
    {
      id: "activity",
      title: "Activity",
      description: "Security & audit log",
      icon: Activity,
      route: "/my-activity"
    },
    {
      id: "rewards",
      title: "My Rewards",
      description: "Points & benefits",
      icon: Award,
      route: "/my-rewards",
      value: `${profileStats.rewardPoints} pts`,
      subtitle: "Redeem now"
    },
    {
      id: "referrals",
      title: "My Referrals",
      description: "Invite & earn",
      icon: Users,
      route: "/my-referrals",
      isNew: true
    },
    {
      id: "coupons",
      title: "Coupons & Cashbacks",
      description: "Active offers",
      icon: Percent,
      route: "/profile/coupons",
      badge: "3 active"
    },
    {
      id: "stock-history",
      title: "Stock Purchase History",
      description: "Trade history & P/L",
      icon: TrendingUp,
      route: "/profile/stock-history"
    }
  ];

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(user?.email + "@paytm" || "");
    toast({
      title: "UPI ID Copied",
      description: "UPI ID copied to clipboard",
    });
  };

  const handleDownloadProfile = () => {
    toast({
      title: "Download Started",
      description: "Your profile PDF is being generated",
    });
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    setShowLoadingScreen(true);
    
    const fadeOutTimer = setTimeout(() => {
      setFadeOutLoading(true);
    }, 3500);

    const hideTimer = setTimeout(() => {
      setShowLoadingScreen(false);
      logout();
      navigate("/login");
    }, 4000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">
      {/* Premium Loading Screen Overlay */}
      {showLoadingScreen && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center animate-soft-fade-in ${
            fadeOutLoading ? 'animate-soft-fade-out' : ''
          }`}
          data-testid="loading-screen-logout"
        >
          {/* Base Layer - Radial Gradient with Noise */}
          <div className="absolute inset-0 bg-black noise-overlay">
            <div className="absolute inset-0 bg-gradient-radial from-white/3 via-black to-black animate-radial-glow" />
          </div>

          {/* Mid Layer - Icon Particles Container */}
          <div className="relative flex items-center justify-center">
            {/* Icon Particle Layer - Floating App Icons (50+) */}
            {(() => {
              const floatingIcons = [
                // Payment & UPI
                QrCode, Send, Receipt, Wallet, CreditCard, PiggyBank, DollarSign, Coins, Banknote,
                // Bills & Utilities
                Smartphone, Droplet, Lightbulb, Zap, Wifi, Building2, Car,
                // Travel & Booking
                Plane, Train, Hotel, Calendar, Ticket, Map, Globe, Bike,
                // Food & Shopping
                UtensilsCrossed, ShoppingCart, Pill, Sparkles, Truck, Gift,
                // Finance & Investment
                TrendingUp, TrendingDown, BarChart3, PieChart, Target, Briefcase, Calculator,
                // Tools & Services
                Shield, FileText, Users, Activity, Bell, Heart, Award,
                // Entertainment & Lifestyle
                Film, PartyPopper, Dumbbell, BookOpen, Wrench, Crown,
                // Pro Tools & Analytics
                Gem, Newspaper, AlertCircle, Eye, EyeOff, ArrowRight, ChevronRight
              ];
              
              return [...Array(50)].map((_, i) => {
                const IconComponent = floatingIcons[i % floatingIcons.length];
                const angle = (i * 7.2) * Math.PI / 180;
                const layer = Math.floor(i / 10);
                const radius = 200 + layer * 110;
                const spiralOffset = (i % 10) * 36;
                const x = Math.cos(angle + spiralOffset * Math.PI / 180) * radius;
                const y = Math.sin(angle + spiralOffset * Math.PI / 180) * radius;
                const rotation = (i * 72) % 360;
                
                return (
                  <div
                    key={i}
                    className="absolute animate-particle-drift"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: '-12px',
                      marginTop: '-12px',
                      animationDelay: `${i * 40}ms`,
                      '--drift-x': `${x}px`,
                      '--drift-y': `${y}px`,
                      '--rotation': `${rotation}deg`,
                    } as React.CSSProperties}
                  >
                    <IconComponent className="h-5 w-5 text-white/50" strokeWidth={1.5} />
                  </div>
                );
              });
            })()}

            {/* Logo Layer - Center Focus with Entrance */}
            <div className="relative z-10 animate-logo-entrance" style={{ animationDelay: '150ms' }}>
              <div className="relative">
                {/* Glow Effect Behind Logo */}
                <div className="absolute inset-0 blur-3xl bg-white/15 rounded-full scale-150 animate-radial-glow" />
                <LoadingLogo size="xl" />
              </div>
            </div>
          </div>

          {/* Typography Layer - Brand Name */}
          <div className="absolute bottom-1/3 left-0 right-0 text-center">
            <h1 
              className="text-3xl font-light text-white tracking-widest animate-letter-reveal"
              style={{ animationDelay: '550ms' }}
            >
              Super Pay
            </h1>
            <p 
              className="text-xs text-white/60 font-light uppercase tracking-widest mt-2 animate-letter-reveal"
              style={{ animationDelay: '700ms' }}
            >
              Next-Gen Super UPI App
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-9 w-9 p-0"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-wider uppercase text-white">Profile</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-9 w-9 p-0"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogoutClick}
              className="bg-white/10 text-white hover:bg-white/20 rounded-none h-9 w-9 p-0"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Profile Header Card - Glassmorphic */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-light">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0 bg-white text-black hover:bg-white/90"
                data-testid="button-edit-photo"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-light text-white truncate">{user?.name || "User"}</h2>
                {profileStats.kycStatus === "verified" && (
                  <Badge className="bg-white/10 text-white border-white/20 h-5 rounded-none">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                  <Crown className="h-3 w-3 mr-1" />
                  {profileStats.membershipTier}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                  <Star className="h-3 w-3 mr-1" />
                  {profileStats.rewardPoints} pts
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{user?.phone || "+91 98765 43210"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/upi-qr")}
                className="h-9 w-9 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-show-qr-profile"
              >
                <QrCode className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHideAmounts(!hideAmounts)}
                className="h-9 w-9 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-toggle-amounts"
              >
                {hideAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-xl font-light text-white" data-testid="text-wallet-balance">
                {formatCompact(profileStats.walletBalance)}
              </p>
              <p className="text-xs text-white/60 uppercase tracking-widest font-light mt-1">Wallet Balance</p>
            </div>
            <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-xl font-light text-white" data-testid="text-investments">
                {formatCompact(profileStats.totalInvestments)}
              </p>
              <p className="text-xs text-white/60 uppercase tracking-widest font-light mt-1">Investments</p>
            </div>
            <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-xl font-light text-white" data-testid="text-active-loans">
                {profileStats.activeLoans}
              </p>
              <p className="text-xs text-white/60 uppercase tracking-widest font-light mt-1">Active Loans</p>
            </div>
            <div className="bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
              <p className="text-xl font-light text-white" data-testid="text-todays-spend">
                {formatCompact(profileStats.todaysSpend)}
              </p>
              <p className="text-xs text-white/60 uppercase tracking-widest font-light mt-1">Today's Spend</p>
            </div>
          </div>

          {/* UPI & Actions */}
          <div className="flex items-center justify-between bg-black/80 border border-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Link2 className="h-4 w-4 text-white/60 flex-shrink-0" />
              <span className="text-sm text-white/80 truncate">{user?.email}@paytm</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyUPI}
                className="h-7 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-copy-upi"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownloadProfile}
                className="h-7 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-none"
                data-testid="button-download-pdf"
              >
                <Download className="h-3 w-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Financial</h2>
          <div className="grid grid-cols-2 gap-3">
            {profileSections
              .filter(s => ['my-loans', 'my-investments', 'my-emis', 'personal-finance', 'pay-history', 'my-cards', 'bank-accounts', 'my-insurance', 'stock-history'].includes(s.id))
              .map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigate(section.route)}
                  className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex flex-col gap-3 backdrop-blur-xl text-left"
                  data-testid={`button-${section.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 border border-white/20 p-2.5">
                      <section.icon className="h-5 w-5 text-white stroke-[1]" />
                    </div>
                    {section.badge && (
                      <Badge className="bg-white/10 text-white border-white/20 text-xs h-5 px-2 rounded-none">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-light text-white text-sm mb-1">{section.title}</p>
                    <p className="text-xs text-white/60">{section.description}</p>
                    {section.value && (
                      <p className="text-sm font-light text-white/90 mt-2">{section.value}</p>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Account & Settings Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Account & Settings</h2>
          <div className="grid grid-cols-2 gap-3">
            {profileSections
              .filter(s => ['about', 'edit-profile', 'activity'].includes(s.id))
              .map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigate(section.route)}
                  className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex flex-col gap-3 backdrop-blur-xl text-left"
                  data-testid={`button-${section.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 border border-white/20 p-2.5">
                      <section.icon className="h-5 w-5 text-white stroke-[1]" />
                    </div>
                    {section.badge && (
                      <Badge className="bg-white/10 text-white border-white/20 text-xs h-5 px-2 rounded-none">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-light text-white text-sm mb-1">{section.title}</p>
                    <p className="text-xs text-white/60">{section.description}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Services Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Services & Travel</h2>
          <div className="grid grid-cols-2 gap-3">
            {profileSections
              .filter(s => ['my-bills', 'my-trips'].includes(s.id))
              .map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigate(section.route)}
                  className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex flex-col gap-3 backdrop-blur-xl text-left"
                  data-testid={`button-${section.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 border border-white/20 p-2.5">
                      <section.icon className="h-5 w-5 text-white stroke-[1]" />
                    </div>
                    {section.badge && (
                      <Badge className="bg-white/10 text-white border-white/20 text-xs h-5 px-2 rounded-none">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-light text-white text-sm mb-1">{section.title}</p>
                    <p className="text-xs text-white/60">{section.description}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Rewards & Offers Section - Black & White Cards */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Rewards & Offers</h2>
          <div className="grid grid-cols-2 gap-3">
            {profileSections
              .filter(s => ['rewards', 'referrals', 'coupons'].includes(s.id))
              .map((section) => (
                <button
                  key={section.id}
                  onClick={() => navigate(section.route)}
                  className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex flex-col gap-3 backdrop-blur-xl text-left"
                  data-testid={`button-${section.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 border border-white/20 p-2.5">
                      <section.icon className="h-5 w-5 text-white stroke-[1]" />
                    </div>
                    {section.isNew && (
                      <Badge className="bg-white/10 text-white border-white/20 text-xs h-5 px-2 rounded-none">
                        New
                      </Badge>
                    )}
                    {section.badge && (
                      <Badge className="bg-white/10 text-white border-white/20 text-xs h-5 px-2 rounded-none">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-light text-white text-sm mb-1">{section.title}</p>
                    <p className="text-xs text-white/60">{section.description}</p>
                    {section.value && (
                      <p className="text-sm font-light text-white/90 mt-2">{section.value}</p>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Support & Help Section */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Support & Help</h2>
          <button
            onClick={() => navigate("/support")}
            className="w-full bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex items-center justify-between backdrop-blur-xl text-left"
            data-testid="button-support"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/10 border border-white/20 p-2.5">
                <HelpCircle className="h-5 w-5 text-white stroke-[1]" />
              </div>
              <div>
                <p className="font-light text-white text-sm mb-1">Help & Support</p>
                <p className="text-xs text-white/60">Get help with your account</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40" />
          </button>
        </div>
      </div>

      <BottomNavigation />

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to login again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="border-white/20 text-white hover:bg-white/10 rounded-none"
              data-testid="button-cancel-logout"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              className="bg-red-600/90 backdrop-blur-xl border border-red-500/50 text-white hover:bg-red-700/90 rounded-none"
              data-testid="button-confirm-logout"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
