import { 
  Search,
  Shield,
  MessageCircle,
  TrendingUp,
  Target,
  BookOpen,
  Users,
  Calculator,
  Zap,
  Activity
} from "lucide-react";

export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  advantages: string[];
  pricing: {
    trial: string;
    monthly: string;
    benefits: string[];
  };
  route: string;
  icon: any;
  status: "free" | "premium" | "new";
  features: string[];
  color: string;
  category: "finance" | "security" | "education" | "tools";
}

export const FEATURES_CONFIG: FeatureConfig[] = [
  {
    id: "marketplace",
    name: "Loan Finder",
    description: "Smart loan selection with 98% approval rate - search, compare, and apply to 15+ lenders instantly",
    advantages: [
      "Smart loan selection with 98% approval rate",
      "Save up to 40% on unwanted interest",
      "Get 2x higher loan eligibility instantly", 
      "Unlock 70% faster loan approvals"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹199/month",
      benefits: ["Smart matching", "Trust badges", "Instant comparison", "Best rate guarantees"]
    },
    route: "/marketplace",
    icon: Search,
    status: "free",
    features: ["Smart matching", "Trust badges", "Instant comparison"],
    color: "from-cyan-400 to-blue-500",
    category: "finance"
  },
  {
    id: "myreport",
    name: "CreditPro Report", 
    description: "Boost credit score by +30 points faster with deep personalized financial roadmap and AI insights",
    advantages: [
      "Boost credit score by +30 points faster",
      "Track spending & cut 30% wasteful costs",
      "Improve approval chances by 60%",
      "Smart alerts to save 15% on late fees"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹299/month",
      benefits: ["Credit score tracking", "Scenario simulator", "Weekly updates", "AI insights"]
    },
    route: "/myreport",
    icon: TrendingUp,
    status: "premium",
    features: ["Credit score tracking", "Scenario simulator", "Weekly updates"],
    color: "from-purple-400 to-purple-600",
    category: "finance"
  },
  {
    id: "mypath", 
    name: "Perfect Finance",
    description: "Pay debts 2x faster with smart planning - rejection to roadmap, turn setbacks into comebacks",
    advantages: [
      "Pay debts 2x faster with smart planning",
      "Get 0% rejection risk with tailored advice", 
      "Avoid penalties and save ₹10,000 yearly",
      "Increase savings rate by 40% yearly"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹399/month", 
      benefits: ["Rejection analysis", "Improvement plan", "Progress tracking", "Debt optimization"]
    },
    route: "/mypath",
    icon: Target,
    status: "free",
    features: ["Rejection analysis", "Improvement plan", "Progress tracking"],
    color: "from-green-400 to-green-600",
    category: "finance"
  },
  {
    id: "repayment-calculator",
    name: "Repayment Calculator",
    description: "Reduce EMIs by up to 35% with better plans - smart EMI planning with payoff simulations and debt strategies",
    advantages: [
      "Reduce EMIs by up to 35% with better plans",
      "Cut 20% extra expenses every month",
      "Save ₹5,000+ per month on hidden charges",
      "Manage finances smarter, save 50% more monthly"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹99/month",
      benefits: ["Payment scenarios", "Interest tracking", "Payoff timeline", "Debt optimization"]
    },
    route: "/repayment-calculator",
    icon: Calculator,
    status: "new",
    features: ["Payment scenarios", "Interest tracking", "Payoff timeline", "Debt optimization"],
    color: "from-blue-400 to-blue-600",
    category: "tools"
  },
  {
    id: "coach",
    name: "FinAdvisor",
    description: "AI Financial Coach - manage finances smarter, save 50% more monthly with 24/7 context-aware guidance",
    advantages: [
      "Manage finances smarter, save 50% more monthly",
      "Save 20% more on insurance premiums",
      "Secure 3x better loan offers instantly", 
      "Increase savings rate by 40% yearly"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹499/month",
      benefits: ["Personalized advice", "Context awareness", "Quick answers", "24/7 support"]
    },
    route: "/coach",
    icon: MessageCircle,
    status: "new",
    features: ["Personalized advice", "Context awareness", "Quick answers"],
    color: "from-purple-400 to-pink-500",
    category: "finance"
  },
  {
    id: "security",
    name: "Loan Spam Detector",
    description: "Avoid fraud & save 100% of your money - instant fraud detection for links, messages & screenshots",
    advantages: [
      "Avoid fraud & save 100% of your money",
      "Block 95% spam loan calls automatically",
      "Detect fake loan offers instantly",
      "Protect personal data from fraudsters"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹149/month",
      benefits: ["URL scanning", "Screenshot analysis", "Fraud alerts", "Call blocking"]
    },
    route: "/security",
    icon: Shield,
    status: "free",
    features: ["URL scanning", "Screenshot analysis", "Fraud alerts"],
    color: "from-emerald-400 to-green-500",
    category: "security"
  },
  {
    id: "learn",
    name: "Learn Karo",
    description: "Save 25% on annual card charges - financial education with creator content and smart money management techniques",
    advantages: [
      "Save 25% on annual card charges",
      "Learn smart money management techniques",
      "Master credit card rewards optimization",
      "Understand loan terms to avoid traps"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹199/month",
      benefits: ["Video courses", "Live sessions", "Creator content", "Financial tips"]
    },
    route: "/learn",
    icon: BookOpen,
    status: "free",
    features: ["Video courses", "Live sessions", "Creator content"],
    color: "from-red-400 to-red-600",
    category: "education"
  },
  {
    id: "creator-sessions",
    name: "Creator Connect",
    description: "Get 0% rejection risk with tailored advice - expert consultations and personal financial coaching with verified creators",
    advantages: [
      "Get 0% rejection risk with tailored advice",
      "Expert guidance from finance professionals",
      "Personalized solutions for your goals", 
      "Build wealth with proven strategies"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹999/session",
      benefits: ["1-on-1 coaching", "Expert guidance", "Custom plans", "Professional advice"]
    },
    route: "/creators",
    icon: Users,
    status: "premium",
    features: ["1-on-1 coaching", "Expert guidance", "Custom plans"],
    color: "from-indigo-400 to-indigo-600",
    category: "education"
  },
  {
    id: "fitness",
    name: "FitFinance",
    description: "Fitness-based financial wellness - earn better loan terms and insurance discounts through healthy lifestyle",
    advantages: [
      "Better loan terms with 0.5-1% interest rate reduction",
      "Up to 30% discount on health and life insurance",
      "Financial incentives encourage healthy behavior",
      "Holistic wellness addressing both financial and physical health"
    ],
    pricing: {
      trial: "₹15",
      monthly: "₹299/month",
      benefits: ["Fitness tracking", "Financial rewards", "Insurance discounts", "Loan benefits"]
    },
    route: "/fitness",
    icon: Activity,
    status: "new",
    features: ["Fitness tracking", "Financial rewards", "Insurance discounts"],
    color: "from-pink-400 to-red-500",
    category: "tools"
  }
];

// Helper function to get feature by ID
export const getFeatureById = (id: string): FeatureConfig | undefined => {
  return FEATURES_CONFIG.find(feature => feature.id === id);
};

// Helper function to get features by category
export const getFeaturesByCategory = (category: string): FeatureConfig[] => {
  return FEATURES_CONFIG.filter(feature => feature.category === category);
};

// Helper function to get premium features
export const getPremiumFeatures = (): FeatureConfig[] => {
  return FEATURES_CONFIG.filter(feature => feature.status === "premium");
};

// Helper function to get free features  
export const getFreeFeatures = (): FeatureConfig[] => {
  return FEATURES_CONFIG.filter(feature => feature.status === "free");
};

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  monthly: {
    price: "₹599",
    originalPrice: "₹750", 
    savings: "₹151",
    period: "month",
    features: [
      "All 9 premium features unlocked",
      "Priority customer support",
      "Advanced analytics & insights", 
      "Cancel anytime"
    ]
  },
  yearly: {
    price: "₹5,999",
    originalPrice: "₹7,188",
    savings: "₹1,189", 
    period: "year",
    features: [
      "All 9 premium features unlocked",
      "Priority customer support", 
      "Advanced analytics & insights",
      "Early access to new features",
      "2 months free included"
    ]
  },
  trial: {
    price: "₹15",
    period: "one-time",
    description: "Trial for all premium features"
  }
};