import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUrlTab } from "@/hooks/use-url-tab";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Target,
  TrendingUp,
  Award,
  Trophy,
  CheckCircle,
  Star,
  Zap,
  Activity,
  Heart,
  Crown,
  Flame,
  Gift,
  RefreshCw,
  CreditCard,
  Plane,
  Receipt,
  ShoppingBag,
  Wallet,
  Users,
  Calendar,
  Coins,
  Percent,
  Tag,
  Ticket,
  Coffee,
  Bus,
  Building2,
  DollarSign,
  Smartphone,
  Clock,
  Shield,
  Info,
  Link2
} from "lucide-react";

interface FitnessChallenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  duration: number;
  category: "daily" | "weekly" | "monthly";
  difficulty: "easy" | "medium" | "hard";
  reward: number;
  icon: any;
  rewardDetails: {
    points: number;
    coupons?: string[];
    badges?: string[];
  };
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: number;
  isCurrentUser?: boolean;
  streak: number;
  category?: "run" | "walk" | "streak" | "rewards";
}

interface WonCoupon {
  id: string;
  couponName: string;
  challengeTitle: string;
  challengeId: string;
  icon: any;
  completedDate: string;
  validity: string;
  collected: boolean;
}

interface Marathon {
  id: string;
  name: string;
  location: string;
  organizer: string;
  date: string;
  distance: string;
  participantLimit: number;
  currentParticipants: number;
  description: string;
  registrationFee: number;
  rewards: {
    points: number;
    finisherMedal: boolean;
    certificate: boolean;
    coupons?: string[];
  };
  difficulty: "beginner" | "intermediate" | "advanced";
  terrainType: string;
  startTime: string;
  ageLimit: string;
  venue: string;
}

export default function Fitness() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useUrlTab("challenges");
  const [challengeFilter, setChallengeFilter] = useState<"all" | "daily" | "weekly" | "monthly">("all");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"all" | "run" | "walk" | "streak" | "rewards">("all");
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set(["daily-bill", "weekly-travel"]));
  const [joinedMarathons, setJoinedMarathons] = useState<Set<string>>(new Set(["marathon-1"]));
  const [collectedCoupons, setCollectedCoupons] = useState<Set<string>>(new Set(["won-1", "won-3"]));
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [showCollectDialog, setShowCollectDialog] = useState(false);
  const [showViewCouponDialog, setShowViewCouponDialog] = useState(false);
  const [showFitnessAppsDialog, setShowFitnessAppsDialog] = useState(false);
  const [connectedApps, setConnectedApps] = useState<Set<string>>(new Set());
  const [showMarathonDetailsDialog, setShowMarathonDetailsDialog] = useState(false);
  const [showJoinMarathonDialog, setShowJoinMarathonDialog] = useState(false);
  const [showLeaveMarathonDialog, setShowLeaveMarathonDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<FitnessChallenge | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<WonCoupon | null>(null);
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const mockChallenges: FitnessChallenge[] = [
    // DAILY FITNESS CHALLENGES
    {
      id: "daily-steps-10k",
      title: "Walk 10,000 Steps",
      description: "Complete 10,000 steps today",
      targetValue: 10000,
      currentValue: 6543,
      duration: 1,
      category: "daily",
      difficulty: "easy",
      reward: 50,
      icon: Activity,
      rewardDetails: {
        points: 50,
        coupons: ["₹50 Wallet Cashback"],
        badges: ["Daily Walker"]
      }
    },
    {
      id: "daily-run-5k",
      title: "Run 5 Kilometers",
      description: "Complete a 5km run today",
      targetValue: 5,
      currentValue: 3.2,
      duration: 1,
      category: "daily",
      difficulty: "medium",
      reward: 100,
      icon: Zap,
      rewardDetails: {
        points: 100,
        coupons: ["₹100 Sports Coupon", "20% Off Gym Membership"],
        badges: ["Daily Runner"]
      }
    },
    {
      id: "daily-sprint-1k",
      title: "Sprint 1 Kilometer",
      description: "Complete a 1km sprint run today",
      targetValue: 1,
      currentValue: 0.8,
      duration: 1,
      category: "daily",
      difficulty: "hard",
      reward: 150,
      icon: Flame,
      rewardDetails: {
        points: 150,
        coupons: ["₹150 Health Store Voucher", "Free Protein Shake"],
        badges: ["Speed Demon"]
      }
    },

    // WEEKLY FITNESS CHALLENGES
    {
      id: "weekly-steps-70k",
      title: "70,000 Steps This Week",
      description: "Walk 70,000 steps over 7 days",
      targetValue: 70000,
      currentValue: 45230,
      duration: 7,
      category: "weekly",
      difficulty: "medium",
      reward: 300,
      icon: Target,
      rewardDetails: {
        points: 300,
        coupons: ["₹200 Fitness Store", "30% Off Running Shoes"],
        badges: ["Weekly Walker Champion"]
      }
    },
    {
      id: "weekly-run-25k",
      title: "Run 25 Kilometers",
      description: "Complete 25km of running this week",
      targetValue: 25,
      currentValue: 18.5,
      duration: 7,
      category: "weekly",
      difficulty: "hard",
      reward: 500,
      icon: Award,
      rewardDetails: {
        points: 500,
        coupons: ["₹500 Sports Gear", "Free Fitness Assessment"],
        badges: ["Distance Runner", "Cardio King"]
      }
    },

    // STREAK CHALLENGES
    {
      id: "streak-walk-10days",
      title: "10-Day Walking Streak",
      description: "Walk 10,000 steps daily for 10 consecutive days",
      targetValue: 10,
      currentValue: 6,
      duration: 10,
      category: "weekly",
      difficulty: "hard",
      reward: 1000,
      icon: Flame,
      rewardDetails: {
        points: 1000,
        coupons: ["₹500 Wellness Voucher", "₹300 Food Delivery", "Free Yoga Class"],
        badges: ["Consistency Master", "10-Day Walker"]
      }
    },
    {
      id: "streak-run-10days",
      title: "10-Day Running Streak",
      description: "Run 5km daily for 10 consecutive days",
      targetValue: 10,
      currentValue: 4,
      duration: 10,
      category: "monthly",
      difficulty: "hard",
      reward: 2000,
      icon: Trophy,
      rewardDetails: {
        points: 2000,
        coupons: ["₹1000 Amazon Voucher", "₹500 Sports Store", "Free Personal Training Session"],
        badges: ["Elite Runner", "10-Day Champion", "Fitness Legend"]
      }
    },
    {
      id: "streak-sprint-10days",
      title: "10-Day Sprint Streak",
      description: "Sprint 1km daily for 10 consecutive days",
      targetValue: 10,
      currentValue: 2,
      duration: 10,
      category: "monthly",
      difficulty: "hard",
      reward: 3000,
      icon: Crown,
      rewardDetails: {
        points: 3000,
        coupons: ["₹1500 Fitness Bundle", "₹1000 Health Store", "Free 3-Month Gym Membership"],
        badges: ["Sprint Master", "Speed King", "Ultimate Athlete"]
      }
    },

    // MONTHLY FITNESS CHALLENGES
    {
      id: "monthly-steps-300k",
      title: "300,000 Steps This Month",
      description: "Walk 300,000 steps in 30 days",
      targetValue: 300000,
      currentValue: 156780,
      duration: 30,
      category: "monthly",
      difficulty: "hard",
      reward: 2500,
      icon: Star,
      rewardDetails: {
        points: 2500,
        coupons: ["₹1000 Travel Voucher", "₹500 Shopping", "₹500 Food Delivery"],
        badges: ["Monthly Walking Legend", "Step Master"]
      }
    },
    {
      id: "monthly-run-100k",
      title: "Run 100 Kilometers",
      description: "Complete 100km of running this month",
      targetValue: 100,
      currentValue: 67.4,
      duration: 30,
      category: "monthly",
      difficulty: "hard",
      reward: 5000,
      icon: Crown,
      rewardDetails: {
        points: 5000,
        coupons: ["₹2000 Amazon Gift Card", "₹1500 Fitness Equipment", "₹1000 Wellness Package", "Free Marathon Entry"],
        badges: ["Centurion Runner", "Marathon Warrior", "Fitness Elite"]
      }
    }
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    { id: "1", name: "Alex Chen", score: 12890, rank: 1, change: 0, streak: 28, category: "run" },
    { id: "2", name: "Sarah Johnson", score: 11756, rank: 2, change: 2, streak: 21, category: "walk" },
    { id: "3", name: "Mike Rodriguez", score: 10634, rank: 3, change: -1, streak: 15, category: "run" },
    { id: "4", name: "You", score: 9398, rank: 4, change: 1, isCurrentUser: true, streak: 12, category: "walk" },
    { id: "5", name: "Emma Wilson", score: 8156, rank: 5, change: -2, streak: 9, category: "streak" },
    { id: "6", name: "David Kim", score: 7823, rank: 6, change: 3, streak: 18, category: "run" },
    { id: "7", name: "Lisa Martinez", score: 7512, rank: 7, change: 0, streak: 14, category: "rewards" },
    { id: "8", name: "James Taylor", score: 7289, rank: 8, change: -1, streak: 10, category: "walk" },
    { id: "9", name: "Maria Garcia", score: 6945, rank: 9, change: 2, streak: 22, category: "streak" },
    { id: "10", name: "Chris Anderson", score: 6734, rank: 10, change: -3, streak: 8, category: "rewards" }
  ];

  const mockWonCoupons: WonCoupon[] = [
    {
      id: "won-1",
      couponName: "₹200 Fitness Store",
      challengeTitle: "70,000 Steps This Week",
      challengeId: "weekly-steps-70k",
      icon: Target,
      completedDate: "Oct 18, 2025",
      validity: "Valid until Nov 18, 2025",
      collected: true
    },
    {
      id: "won-2",
      couponName: "30% Off Running Shoes",
      challengeTitle: "70,000 Steps This Week",
      challengeId: "weekly-steps-70k",
      icon: Target,
      completedDate: "Oct 18, 2025",
      validity: "Valid until Nov 18, 2025",
      collected: false
    },
    {
      id: "won-3",
      couponName: "₹500 Sports Gear",
      challengeTitle: "Run 25 Kilometers",
      challengeId: "weekly-run-25k",
      icon: Award,
      completedDate: "Oct 15, 2025",
      validity: "Valid until Nov 15, 2025",
      collected: true
    },
    {
      id: "won-4",
      couponName: "Free Fitness Assessment",
      challengeTitle: "Run 25 Kilometers",
      challengeId: "weekly-run-25k",
      icon: Award,
      completedDate: "Oct 15, 2025",
      validity: "Valid until Nov 15, 2025",
      collected: false
    },
    {
      id: "won-5",
      couponName: "₹50 Wallet Cashback",
      challengeTitle: "Walk 10,000 Steps",
      challengeId: "daily-steps-10k",
      icon: Activity,
      completedDate: "Oct 22, 2025",
      validity: "Valid until Nov 22, 2025",
      collected: false
    }
  ];

  const mockMarathons: Marathon[] = [
    {
      id: "marathon-1",
      name: "Mumbai Marathon 2025",
      location: "Mumbai, Maharashtra",
      organizer: "Adidas Running India",
      date: "January 15, 2025",
      distance: "42.2 km (Full Marathon)",
      participantLimit: 5000,
      currentParticipants: 3847,
      description: "Join India's most prestigious full marathon event organized by Adidas. Experience the spirit of Mumbai while running through iconic landmarks.",
      registrationFee: 2500,
      rewards: {
        points: 5000,
        finisherMedal: true,
        certificate: true,
        coupons: ["₹2000 Adidas Voucher", "₹1000 Sports Nutrition", "Free Race Kit"]
      },
      difficulty: "advanced",
      terrainType: "Road - Flat & Fast",
      startTime: "6:00 AM",
      ageLimit: "18+",
      venue: "Gateway of India, Mumbai"
    },
    {
      id: "marathon-2",
      name: "Delhi Half Marathon",
      location: "New Delhi",
      organizer: "Nike Run Club",
      date: "November 30, 2024",
      distance: "21.1 km (Half Marathon)",
      participantLimit: 3000,
      currentParticipants: 2156,
      description: "Run through the heart of the capital city in this Nike-organized half marathon. Perfect for intermediate runners looking to challenge themselves.",
      registrationFee: 1500,
      rewards: {
        points: 3000,
        finisherMedal: true,
        certificate: true,
        coupons: ["₹1500 Nike Store Voucher", "₹500 Health Supplement"]
      },
      difficulty: "intermediate",
      terrainType: "Road - Mixed Terrain",
      startTime: "7:00 AM",
      ageLimit: "16+",
      venue: "Jawaharlal Nehru Stadium"
    },
    {
      id: "marathon-3",
      name: "Bangalore 10K Run",
      location: "Bangalore, Karnataka",
      organizer: "Puma Sports India",
      date: "December 8, 2024",
      distance: "10 km",
      participantLimit: 2000,
      currentParticipants: 1523,
      description: "A beginner-friendly 10K run organized by Puma through the tech capital's scenic routes. Great for first-time marathon runners.",
      registrationFee: 800,
      rewards: {
        points: 1500,
        finisherMedal: true,
        certificate: true,
        coupons: ["₹800 Puma Voucher", "Free Energy Drink Pack"]
      },
      difficulty: "beginner",
      terrainType: "Road - Gentle Hills",
      startTime: "6:30 AM",
      ageLimit: "14+",
      venue: "Cubbon Park, Bangalore"
    },
    {
      id: "marathon-4",
      name: "Hyderabad Night Marathon",
      location: "Hyderabad, Telangana",
      organizer: "Reebok Fitness",
      date: "January 20, 2025",
      distance: "21.1 km (Half Marathon)",
      participantLimit: 4000,
      currentParticipants: 2891,
      description: "Experience the unique thrill of running under the stars in this Reebok-organized night marathon through Hyderabad's illuminated streets.",
      registrationFee: 1800,
      rewards: {
        points: 3500,
        finisherMedal: true,
        certificate: true,
        coupons: ["₹1800 Reebok Store Credit", "₹700 Fitness Gear", "Glow Running Kit"]
      },
      difficulty: "intermediate",
      terrainType: "Road - Urban Night Route",
      startTime: "8:00 PM",
      ageLimit: "18+",
      venue: "HITEC City, Hyderabad"
    },
    {
      id: "marathon-5",
      name: "Pune Trail Marathon",
      location: "Pune, Maharashtra",
      organizer: "Decathlon Sports",
      date: "February 5, 2025",
      distance: "25 km (Trail)",
      participantLimit: 1500,
      currentParticipants: 987,
      description: "Challenge yourself with this Decathlon-organized trail marathon through the scenic Western Ghats. Perfect for adventure-seeking runners.",
      registrationFee: 2000,
      rewards: {
        points: 4000,
        finisherMedal: true,
        certificate: true,
        coupons: ["₹2000 Decathlon Voucher", "₹1000 Adventure Gear", "Trail Running Guide"]
      },
      difficulty: "advanced",
      terrainType: "Trail - Hilly & Technical",
      startTime: "5:30 AM",
      ageLimit: "18+",
      venue: "Sinhagad Fort Base, Pune"
    },
    {
      id: "marathon-6",
      name: "Chennai Beach Run",
      location: "Chennai, Tamil Nadu",
      organizer: "Asics India",
      date: "December 15, 2024",
      distance: "10 km",
      participantLimit: 2500,
      currentParticipants: 1845,
      description: "Run along the beautiful Marina Beach in this Asics-organized coastal marathon. Enjoy the sea breeze while achieving your fitness goals.",
      registrationFee: 900,
      rewards: {
        points: 1800,
        finisherMedal: true,
        certificate: true,
        coupons: ["₹900 Asics Voucher", "₹400 Beach Fitness Kit"]
      },
      difficulty: "beginner",
      terrainType: "Beach - Sandy & Coastal",
      startTime: "6:00 AM",
      ageLimit: "14+",
      venue: "Marina Beach, Chennai"
    }
  ];

  const fitnessApps = [
    {
      id: "strava",
      name: "Strava",
      description: "Track running & cycling",
      icon: Activity
    },
    {
      id: "google-fit",
      name: "Google Fit",
      description: "Activity & health tracking",
      icon: Heart
    },
    {
      id: "apple-health",
      name: "Apple Health",
      description: "Comprehensive health data",
      icon: Activity
    },
    {
      id: "fitbit",
      name: "Fitbit",
      description: "Steps, sleep & fitness",
      icon: Zap
    },
    {
      id: "garmin",
      name: "Garmin Connect",
      description: "Advanced sports tracking",
      icon: Target
    },
    {
      id: "nike-run",
      name: "Nike Run Club",
      description: "Running & training plans",
      icon: Flame
    },
    {
      id: "adidas",
      name: "Adidas Running",
      description: "Track runs & workouts",
      icon: TrendingUp
    },
    {
      id: "samsung-health",
      name: "Samsung Health",
      description: "All-in-one health app",
      icon: Heart
    },
    {
      id: "myfitnesspal",
      name: "MyFitnessPal",
      description: "Nutrition & fitness tracking",
      icon: Activity
    },
    {
      id: "peloton",
      name: "Peloton",
      description: "Workouts & classes",
      icon: Trophy
    }
  ];

  const handleConnectApp = (appId: string) => {
    setConnectedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  };

  const { data: challenges = mockChallenges } = useQuery({
    queryKey: ["/api/fitness/challenges"],
    enabled: isAuthenticated,
    queryFn: async () => mockChallenges,
  });

  const { data: leaderboard = mockLeaderboard } = useQuery({
    queryKey: ["/api/fitness/leaderboard"],
    enabled: isAuthenticated,
    queryFn: async () => mockLeaderboard,
  });

  const handleJoinChallenge = (challenge: FitnessChallenge) => {
    setSelectedChallenge(challenge);
    setShowJoinDialog(true);
  };

  const confirmJoinChallenge = () => {
    if (selectedChallenge) {
      setJoinedChallenges(prev => new Set(Array.from(prev).concat(selectedChallenge.id)));
    }
    setShowJoinDialog(false);
    setSelectedChallenge(null);
  };

  const handleLeaveChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => {
      const newSet = new Set(prev);
      newSet.delete(challengeId);
      return newSet;
    });
  };

  const handleViewMarathonDetails = (marathon: Marathon) => {
    setSelectedMarathon(marathon);
    setShowMarathonDetailsDialog(true);
  };

  const handleJoinMarathon = (marathon: Marathon) => {
    setSelectedMarathon(marathon);
    setShowJoinMarathonDialog(true);
  };

  const confirmJoinMarathon = () => {
    if (selectedMarathon) {
      setJoinedMarathons(prev => new Set(Array.from(prev).concat(selectedMarathon.id)));
    }
    setShowJoinMarathonDialog(false);
    setSelectedMarathon(null);
  };

  const handleLeaveMarathon = (marathon: Marathon) => {
    setSelectedMarathon(marathon);
    setShowLeaveMarathonDialog(true);
  };

  const confirmLeaveMarathon = () => {
    if (selectedMarathon) {
      setJoinedMarathons(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedMarathon.id);
        return newSet;
      });
      setShowLeaveMarathonDialog(false);
      setShowRefundDialog(true);
      setTimeout(() => {
        setSelectedMarathon(null);
      }, 300);
    }
  };

  const handleCollectCoupon = (coupon: WonCoupon) => {
    setSelectedCoupon(coupon);
    setShowCollectDialog(true);
  };

  const confirmCollectCoupon = () => {
    if (selectedCoupon) {
      setCollectedCoupons(prev => new Set(Array.from(prev).concat(selectedCoupon.id)));
    }
    setShowCollectDialog(false);
    setTimeout(() => setSelectedCoupon(null), 300);
  };

  const filteredChallenges = challengeFilter === "all" 
    ? challenges 
    : challenges.filter(c => c.category === challengeFilter);

  const filteredLeaderboard = leaderboardFilter === "all"
    ? leaderboard
    : leaderboard.filter(l => l.category === leaderboardFilter);

  const currentUser = leaderboard.find(entry => entry.isCurrentUser);

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const activeChallengesCount = challenges.filter(c => joinedChallenges.has(c.id)).length;
  const completedChallengesCount = 34;

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
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider">FIT FINANCE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Feel The Change</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFitnessAppsDialog(true)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-connect-apps"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/fitness/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-info"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="space-y-4">
            {/* Top Section - Primary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Total Steps</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-light text-white tracking-tight">156,780</p>
                </div>
                <p className="text-[10px] text-white/40 font-light">This month</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Rank</p>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-white/60" />
                  <p className="text-3xl font-light text-white tracking-tight">#4</p>
                </div>
                <p className="text-[10px] text-white/40 font-light">Global ranking</p>
              </div>
            </div>

            {/* Daily Activity Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Daily Run</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-light text-white">5.2</p>
                  <span className="text-xs text-white/50">Km</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Daily Steps</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-light text-white">8,542</p>
                </div>
              </div>
            </div>

            {/* Bottom Section - Streak and Rewards */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Streak</p>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-white/60" />
                  <p className="text-lg font-light text-white">12</p>
                </div>
                <p className="text-[9px] text-white/40 font-light">days</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Rewards Won</p>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-white/60" />
                  <p className="text-lg font-light text-white">{mockWonCoupons.length}</p>
                </div>
                <p className="text-[9px] text-white/40 font-light">coupons</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Rewards</p>
                <div className="flex items-center gap-1">
                  <Gift className="h-4 w-4 text-white/60" />
                  <p className="text-lg font-light text-white">3</p>
                </div>
                <p className="text-[9px] text-white/40 font-light">collected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger 
                value="challenges" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                data-testid="tab-challenges"
              >
                Challenges
              </TabsTrigger>
              <TabsTrigger 
                value="marathons" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                data-testid="tab-marathons"
              >
                Marathon
              </TabsTrigger>
              <TabsTrigger 
                value="leaderboard" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                data-testid="tab-leaderboard"
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger 
                value="rewards" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                data-testid="tab-rewards"
              >
                Rewards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-4 mt-6">
              {filteredChallenges.map((challenge) => {
                const ChallengeIcon = challenge.icon;
                const progress = (challenge.currentValue / challenge.targetValue) * 100;
                const isJoined = joinedChallenges.has(challenge.id);
                const isCompleted = progress >= 100;
                
                return (
                  <div 
                    key={challenge.id}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
                    data-testid={`card-challenge-${challenge.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
                        <ChallengeIcon className="h-6 w-6 text-white/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-light text-white tracking-wide mb-1">{challenge.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={cn(
                                "border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest",
                                challenge.category === "daily" ? "bg-white/10 text-white/60 border-white/30" :
                                challenge.category === "weekly" ? "bg-white/10 text-white/60 border-white/25" :
                                "bg-white/10 text-white/60 border-white/20"
                              )}>
                                {challenge.category}
                              </Badge>
                              <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest">
                                <Tag className="h-3 w-3 mr-1" />
                                {challenge.rewardDetails.coupons?.length || 1} {challenge.rewardDetails.coupons?.length === 1 ? 'Coupon' : 'Coupons'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-white/50 font-light mb-3">{challenge.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                            <span>{challenge.currentValue} / {challenge.targetValue}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className={cn(
                            "h-1.5 bg-white/10",
                            isCompleted ? "[&>div]:bg-white" : "[&>div]:bg-white/50"
                          )} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {isJoined ? (
                              isCompleted ? (
                                <Button
                                  disabled
                                  variant="ghost"
                                  className="bg-white/5 border border-white/20 text-white/40 rounded-none h-9 text-xs uppercase tracking-widest cursor-not-allowed"
                                  data-testid={`button-completed-${challenge.id}`}
                                >
                                  <CheckCircle className="h-3 w-3 mr-2" />
                                  Completed
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleLeaveChallenge(challenge.id)}
                                  variant="ghost"
                                  className="bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-9 text-xs uppercase tracking-widest"
                                  data-testid={`button-leave-${challenge.id}`}
                                >
                                  Leave
                                </Button>
                              )
                            ) : (
                              <Button
                                onClick={() => handleJoinChallenge(challenge)}
                                className="bg-white text-black hover:bg-white/90 rounded-none h-9 text-xs uppercase tracking-widest"
                                data-testid={`button-join-${challenge.id}`}
                              >
                                Join
                              </Button>
                            )}
                            <Button
                              onClick={() => {
                                setSelectedChallenge(challenge);
                                setShowRewardDialog(true);
                              }}
                              variant="ghost"
                              className="bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-9 text-xs uppercase tracking-widest"
                              data-testid={`button-view-reward-${challenge.id}`}
                            >
                              <Gift className="h-3 w-3 mr-2" />
                              View Reward
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="marathons" className="space-y-4 mt-6">
              {mockMarathons.map((marathon) => {
                const isJoined = joinedMarathons.has(marathon.id);
                const spotsLeft = marathon.participantLimit - marathon.currentParticipants;
                const fillPercentage = (marathon.currentParticipants / marathon.participantLimit) * 100;
                
                return (
                  <div 
                    key={marathon.id}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl overflow-hidden"
                    data-testid={`card-marathon-${marathon.id}`}
                  >
                    <div className="space-y-0">
                      <div className="flex items-start gap-4 p-4">
                        <div className="w-14 h-14 border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-7 w-7 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-light text-white tracking-wide mb-1 text-base">{marathon.name}</h3>
                          <p className="text-xs text-white/50 font-light mb-2 flex items-center gap-1.5">
                            <Building2 className="h-3 w-3 text-white/40" />
                            {marathon.organizer}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={cn(
                              "border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest",
                              marathon.difficulty === "beginner" ? "bg-green-500/10 text-green-400/80 border-green-500/30" :
                              marathon.difficulty === "intermediate" ? "bg-yellow-500/10 text-yellow-400/80 border-yellow-500/30" :
                              "bg-red-500/10 text-red-400/80 border-red-500/30"
                            )}>
                              {marathon.difficulty}
                            </Badge>
                            <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest">
                              {marathon.distance}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-0 border-y border-white/10">
                        <div className="border-r border-white/10 bg-white/5 p-3 text-center">
                          <Calendar className="h-3.5 w-3.5 text-white/40 mx-auto mb-1" />
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Date</p>
                          <p className="text-xs text-white/80 font-light">{marathon.date.split('-').slice(1).join('/')}</p>
                        </div>
                        <div className="border-r border-white/10 bg-white/5 p-3 text-center">
                          <Clock className="h-3.5 w-3.5 text-white/40 mx-auto mb-1" />
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Time</p>
                          <p className="text-xs text-white/80 font-light">{marathon.startTime}</p>
                        </div>
                        <div className="bg-white/5 p-3 text-center">
                          <DollarSign className="h-3.5 w-3.5 text-white/40 mx-auto mb-1" />
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Entry Fee</p>
                          <p className="text-xs text-white/80 font-light">₹{marathon.registrationFee}</p>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-widest">
                            <span>{spotsLeft} spots left</span>
                            <span>{Math.round(fillPercentage)}% Full</span>
                          </div>
                          <Progress value={fillPercentage} className="h-1.5 bg-white/10 [&>div]:bg-white/50" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {isJoined ? (
                            <Button
                              onClick={() => handleLeaveMarathon(marathon)}
                              variant="ghost"
                              className="bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700 rounded-none h-9 text-xs uppercase tracking-widest"
                              data-testid={`button-leave-marathon-${marathon.id}`}
                            >
                              Leave Marathon
                            </Button>
                          ) : (
                            <Button
                              onClick={() => navigate(`/booking/event/${marathon.date}/${marathon.id}`)}
                              className="bg-white text-black hover:bg-white/90 rounded-none h-9 text-xs uppercase tracking-widest"
                              data-testid={`button-join-marathon-${marathon.id}`}
                              disabled={spotsLeft === 0}
                            >
                              {spotsLeft === 0 ? 'Full' : 'Join'}
                            </Button>
                          )}
                          <Button
                            onClick={() => navigate(`/event-detail/${marathon.id}`)}
                            variant="ghost"
                            className="bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-9 text-xs uppercase tracking-widest"
                            data-testid={`button-view-details-${marathon.id}`}
                          >
                            <Info className="h-3 w-3 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4 mt-6 pb-32">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {[
                  { id: "all", label: "All" },
                  { id: "run", label: "Run" },
                  { id: "walk", label: "Walk" },
                  { id: "streak", label: "Streak" },
                  { id: "rewards", label: "Rewards" }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    onClick={() => setLeaderboardFilter(filter.id as any)}
                    variant="ghost"
                    className={cn(
                      "flex-shrink-0 rounded-none h-8 text-xs uppercase tracking-widest border",
                      leaderboardFilter === filter.id
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/70 border-white/20 hover:bg-white/10 hover:text-white"
                    )}
                    data-testid={`filter-${filter.id}`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredLeaderboard.map((entry) => (
                  <div 
                    key={entry.id}
                    className={`border ${
                      entry.isCurrentUser 
                        ? 'border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent' 
                        : 'border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent'
                    } backdrop-blur-xl p-4`}
                    data-testid={`card-leaderboard-${entry.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center font-light text-lg ${
                        entry.rank === 1 ? 'text-white' :
                        entry.rank === 2 ? 'text-white/90' :
                        entry.rank === 3 ? 'text-white/80' :
                        'text-white/60'
                      }`}>
                        #{entry.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-light text-white tracking-wide">{entry.name}</h3>
                          {entry.rank <= 3 && (
                            <Trophy className="h-4 w-4 text-white/60" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-white/50 uppercase tracking-widest">
                          <span>{entry.score.toLocaleString()} pts</span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-white/60" />
                            {entry.streak} days
                          </span>
                        </div>
                      </div>
                      {entry.change !== 0 && (
                        <Badge className={`${
                          entry.change > 0 
                            ? 'bg-white/10 text-white/60 border-white/30' 
                            : 'bg-white/10 text-white/60 border-white/20'
                        } border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest`}>
                          {entry.change > 0 ? '+' : ''}{entry.change}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {currentUser && (
                <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 bg-black">
                  <div className="border-2 border-white/30 bg-gradient-to-br from-white/20 via-white/10 to-black backdrop-blur-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center font-light text-lg text-white bg-white/10 border border-white/20">
                        #{currentUser.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white tracking-wide">{currentUser.name}</h3>
                          <Badge className="bg-white/20 text-white border-white/30 border text-[10px] rounded-none uppercase tracking-widest">
                            YOU
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-white/70 uppercase tracking-widest">
                          <span>{currentUser.score.toLocaleString()} pts</span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-white" />
                            {currentUser.streak} days
                          </span>
                        </div>
                      </div>
                      {currentUser.change !== 0 && (
                        <Badge className={`${
                          currentUser.change > 0 
                            ? 'bg-white/20 text-white border-white/40' 
                            : 'bg-white/10 text-white/60 border-white/20'
                        } border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest`}>
                          {currentUser.change > 0 ? '+' : ''}{currentUser.change}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4 mt-6">
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Earned Coupons</p>
                    <p className="text-2xl font-light text-white">{mockWonCoupons.length}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-white/40" />
                </div>
                
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-xs text-white/60 font-light">
                    Complete fitness challenges to earn exclusive coupons. Each challenge rewards you with valuable coupons for sports gear, wellness services, and more. All earned coupons are automatically saved to <span className="text-white font-normal">My Coupons</span> for easy access.
                  </p>
                  <Button
                    onClick={() => navigate("/profile/coupons")}
                    variant="ghost"
                    className="w-full bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded-none h-9 text-xs uppercase tracking-widest flex items-center justify-between"
                    data-testid="button-my-coupons"
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      View My Coupons
                    </span>
                    <ArrowLeft className="h-3 w-3 rotate-180" />
                  </Button>
                </div>
              </div>

              {mockWonCoupons.length === 0 ? (
                <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-8 text-center">
                  <Trophy className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-white/60 mb-2">No Coupons Earned Yet</h3>
                  <p className="text-sm text-white/40 font-light">
                    Complete fitness challenges to earn exclusive coupons and rewards
                  </p>
                </div>
              ) : (
                mockWonCoupons.map((coupon) => {
                  const CouponIcon = coupon.icon;
                  
                  return (
                    <div 
                      key={coupon.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
                      data-testid={`card-reward-${coupon.id}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 border border-white/30 bg-white/10 flex items-center justify-center flex-shrink-0">
                            <CouponIcon className="h-7 w-7 text-white/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white tracking-wide mb-1.5 text-base">{coupon.couponName}</h3>
                            <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest">
                              <Trophy className="h-3 w-3 mr-1" />
                              From Challenge
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-3.5 w-3.5 text-white/40 flex-shrink-0" />
                            <span className="text-white/70 font-light">{coupon.challengeTitle}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-white/50">
                              <Calendar className="h-3 w-3 text-white/40" />
                              <span className="font-light">{coupon.completedDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/50">
                              <Clock className="h-3 w-3 text-white/40" />
                              <span className="font-light truncate">{coupon.validity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          {collectedCoupons.has(coupon.id) ? (
                            <Button
                              onClick={() => {
                                setSelectedCoupon(coupon);
                                setShowViewCouponDialog(true);
                              }}
                              variant="ghost"
                              className="w-full bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-9 text-xs uppercase tracking-widest"
                              data-testid={`button-view-${coupon.id}`}
                            >
                              View
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleCollectCoupon(coupon)}
                              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-9 text-xs uppercase tracking-widest"
                              data-testid={`button-collect-${coupon.id}`}
                            >
                              Collect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center">JOIN CHALLENGE</DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto border border-white/20 flex items-center justify-center">
                  {selectedChallenge.icon && <selectedChallenge.icon className="h-8 w-8 text-white/60" />}
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedChallenge.title}</h3>
                <p className="text-sm text-white/50 font-light">{selectedChallenge.description}</p>
              </div>
              
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Reward</p>
                    <p className="text-lg font-light text-white">
                      {selectedChallenge.rewardDetails.coupons?.length || 0} {selectedChallenge.rewardDetails.coupons?.length === 1 ? 'Coupon' : 'Coupons'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-lg font-light text-white">{selectedChallenge.duration} days</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowJoinDialog(false)}
                  variant="ghost"
                  className="flex-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-cancel-join"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmJoinChallenge}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-confirm-join"
                >
                  Join Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">CHALLENGE REWARDS</DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto border border-white/20 flex items-center justify-center">
                  {selectedChallenge.icon && <selectedChallenge.icon className="h-8 w-8 text-white/60" />}
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedChallenge.title}</h3>
                <p className="text-sm text-white/50 font-light">{selectedChallenge.description}</p>
              </div>
              
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 space-y-4">
                {selectedChallenge.rewardDetails.coupons && selectedChallenge.rewardDetails.coupons.length > 0 && (
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Reward Coupons</p>
                    <div className="space-y-2">
                      {selectedChallenge.rewardDetails.coupons.map((coupon, index) => (
                        <div key={index} className="flex items-start gap-2 bg-white/5 border border-white/10 p-3">
                          <Tag className="h-4 w-4 text-white/60 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-white font-light">{coupon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedChallenge.rewardDetails.badges && selectedChallenge.rewardDetails.badges.length > 0 && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-3">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedChallenge.rewardDetails.badges.map((badge, index) => (
                        <Badge key={index} className="bg-white/10 text-white/70 border-white/20 border text-[10px] rounded-none uppercase tracking-widest">
                          <Trophy className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-xs text-white/60 text-center font-light">
                  Complete this challenge to unlock all rewards and earn your badges!
                </p>
              </div>

              <Button
                onClick={() => setShowRewardDialog(false)}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-10 text-xs uppercase tracking-widest"
                data-testid="button-close-reward"
              >
                Got It
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCollectDialog} onOpenChange={setShowCollectDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Collect Coupon</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto border-2 border-white/30 bg-white/10 flex items-center justify-center animate-bounce">
                  <selectedCoupon.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedCoupon.couponName}</h3>
                <p className="text-sm text-white/60 font-light">From: {selectedCoupon.challengeTitle}</p>
              </div>
              
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="h-4 w-4 text-white/50" />
                    <span>Completed {selectedCoupon.completedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock className="h-4 w-4 text-white/50" />
                    <span>{selectedCoupon.validity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-xs text-white/60 text-center font-light">
                  Collect this coupon to save it to <span className="text-white font-normal">My Coupons</span> for easy access and usage.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCollectDialog(false)}
                  variant="ghost"
                  className="flex-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-cancel-collect"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmCollectCoupon}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-confirm-collect"
                >
                  Collect Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showViewCouponDialog} onOpenChange={setShowViewCouponDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Coupon Details</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto border-2 border-white/30 bg-white/10 flex items-center justify-center">
                  <selectedCoupon.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedCoupon.couponName}</h3>
                <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] flex-shrink-0 rounded-none uppercase tracking-widest">
                  <Trophy className="h-3 w-3 mr-1" />
                  From Challenge
                </Badge>
              </div>
              
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-white/40 flex-shrink-0" />
                  <span className="text-white/70 font-light">{selectedCoupon.challengeTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Calendar className="h-4 w-4 text-white/50" />
                  <span>Completed {selectedCoupon.completedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock className="h-4 w-4 text-white/50" />
                  <span>{selectedCoupon.validity}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-xs text-white/60 text-center font-light">
                  This coupon has been collected and is available in <span className="text-white font-normal">My Coupons</span> for usage.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowViewCouponDialog(false)}
                  variant="ghost"
                  className="flex-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-close-view"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowViewCouponDialog(false);
                    navigate("/profile/coupons");
                  }}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-goto-my-coupons"
                >
                  Go to My Coupons
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showJoinMarathonDialog} onOpenChange={setShowJoinMarathonDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Join Marathon</DialogTitle>
          </DialogHeader>
          {selectedMarathon && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto border-2 border-white/30 bg-white/10 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedMarathon.name}</h3>
                <p className="text-sm text-white/60 font-light">{selectedMarathon.location}</p>
              </div>
              
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-white/70 font-light">{selectedMarathon.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-white/70 font-light">{selectedMarathon.distance}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Start Time</p>
                    <p className="text-white/70 font-light">{selectedMarathon.startTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Fee</p>
                    <p className="text-white/70 font-light">₹{selectedMarathon.registrationFee}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Rewards</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] rounded-none uppercase tracking-widest">
                      <Coins className="h-3 w-3 mr-1" />
                      {selectedMarathon.rewards.points} Points
                    </Badge>
                    {selectedMarathon.rewards.finisherMedal && (
                      <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] rounded-none uppercase tracking-widest">
                        <Trophy className="h-3 w-3 mr-1" />
                        Medal
                      </Badge>
                    )}
                    {selectedMarathon.rewards.certificate && (
                      <Badge className="bg-white/10 text-white/60 border-white/20 border text-[10px] rounded-none uppercase tracking-widest">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-xs text-white/60 text-center font-light">
                  Registration fee of ₹{selectedMarathon.registrationFee} will be charged upon joining this marathon.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowJoinMarathonDialog(false)}
                  variant="ghost"
                  className="flex-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-cancel-join-marathon"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmJoinMarathon}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-confirm-join-marathon"
                >
                  Join Marathon
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showMarathonDetailsDialog} onOpenChange={setShowMarathonDetailsDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Marathon Details</DialogTitle>
          </DialogHeader>
          {selectedMarathon && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto border-2 border-white/30 bg-white/10 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedMarathon.name}</h3>
                <Badge className={cn(
                  "border text-[10px] rounded-none uppercase tracking-widest",
                  selectedMarathon.difficulty === "beginner" ? "bg-green-500/10 text-green-400/80 border-green-500/30" :
                  selectedMarathon.difficulty === "intermediate" ? "bg-yellow-500/10 text-yellow-400/80 border-yellow-500/30" :
                  "bg-red-500/10 text-red-400/80 border-red-500/30"
                )}>
                  {selectedMarathon.difficulty}
                </Badge>
              </div>

              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 space-y-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm text-white/70 font-light leading-relaxed">{selectedMarathon.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Event Details</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Organized By</p>
                        <p className="text-sm text-white/70 font-light">{selectedMarathon.organizer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Location</p>
                        <p className="text-sm text-white/70 font-light">{selectedMarathon.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Plane className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Venue</p>
                        <p className="text-sm text-white/70 font-light">{selectedMarathon.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Date & Time</p>
                        <p className="text-sm text-white/70 font-light">{selectedMarathon.date} at {selectedMarathon.startTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Activity className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Distance & Terrain</p>
                        <p className="text-sm text-white/70 font-light">{selectedMarathon.distance} - {selectedMarathon.terrainType}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Age Limit</p>
                        <p className="text-sm text-white/70 font-light">{selectedMarathon.ageLimit}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Registration Fee</p>
                        <p className="text-sm text-white/70 font-light">₹{selectedMarathon.registrationFee}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-white/40 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Participants</p>
                        <p className="text-sm text-white/70 font-light">
                          {selectedMarathon.currentParticipants} / {selectedMarathon.participantLimit} registered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Rewards & Benefits</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-white/40" />
                      <p className="text-sm text-white/70 font-light">{selectedMarathon.rewards.points} Fitness Points</p>
                    </div>
                    {selectedMarathon.rewards.finisherMedal && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-white/40" />
                        <p className="text-sm text-white/70 font-light">Finisher Medal</p>
                      </div>
                    )}
                    {selectedMarathon.rewards.certificate && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-white/40" />
                        <p className="text-sm text-white/70 font-light">Digital Certificate</p>
                      </div>
                    )}
                    {selectedMarathon.rewards.coupons && selectedMarathon.rewards.coupons.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Coupon Rewards</p>
                        <div className="space-y-2">
                          {selectedMarathon.rewards.coupons.map((coupon, index) => (
                            <div key={index} className="flex items-start gap-2 bg-white/5 border border-white/10 p-2">
                              <Tag className="h-3.5 w-3.5 text-white/60 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-white/70 font-light">{coupon}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowMarathonDetailsDialog(false)}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-10 text-xs uppercase tracking-widest"
                data-testid="button-close-marathon-details"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaveMarathonDialog} onOpenChange={setShowLeaveMarathonDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Leave Marathon</DialogTitle>
          </DialogHeader>
          {selectedMarathon && (
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto border-2 border-red-500/30 bg-red-500/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{selectedMarathon.name}</h3>
                <p className="text-sm text-white/60 font-light">Organized by {selectedMarathon.organizer}</p>
              </div>
              
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
                <p className="text-sm text-white/70 font-light text-center">
                  Are you sure you want to leave this marathon? Your registration will be cancelled and you will receive a full refund.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowLeaveMarathonDialog(false)}
                  variant="ghost"
                  className="flex-1 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-cancel-leave"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmLeaveMarathon}
                  className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-none h-10 uppercase tracking-widest"
                  data-testid="button-confirm-leave"
                >
                  Yes, Leave Marathon
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Cancellation Successful</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto border-2 border-green-500/30 bg-green-500/10 flex items-center justify-center animate-bounce">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-light text-white tracking-wide">Registration Cancelled</h3>
            </div>
            
            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <p className="text-sm text-white/70 font-light text-center leading-relaxed">
                Your marathon registration has been successfully cancelled. Your payment will be reflected back to your account shortly.
              </p>
            </div>

            <Button
              onClick={() => setShowRefundDialog(false)}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-10 uppercase tracking-widest"
              data-testid="button-close-refund"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFitnessAppsDialog} onOpenChange={setShowFitnessAppsDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider text-center uppercase">Connect Fitness Apps</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-3">
              <p className="text-xs text-white/60 font-light text-center">
                Connect your favorite fitness apps to sync your activity data and earn rewards automatically
              </p>
            </div>
            
            {fitnessApps.map((app) => {
              const AppIcon = app.icon;
              const isConnected = connectedApps.has(app.id);
              
              return (
                <div 
                  key={app.id}
                  className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4"
                  data-testid={`card-fitness-app-${app.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                      <AppIcon className="h-6 w-6 text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-light text-white tracking-wide text-sm mb-0.5">{app.name}</h3>
                      <p className="text-[10px] text-white/50 font-light">{app.description}</p>
                    </div>
                    <Button
                      onClick={() => handleConnectApp(app.id)}
                      className={cn(
                        "rounded-none h-8 text-xs uppercase tracking-widest flex-shrink-0",
                        isConnected
                          ? "bg-white/10 border border-white/30 text-white/70 hover:bg-white/15"
                          : "bg-white text-black hover:bg-white/90"
                      )}
                      data-testid={`button-connect-${app.id}`}
                    >
                      {isConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              );
            })}

            <Button
              onClick={() => setShowFitnessAppsDialog(false)}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-10 text-xs uppercase tracking-widest mt-4"
              data-testid="button-close-fitness-apps"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
