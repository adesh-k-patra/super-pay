import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Star, CheckCircle, Award, Shield, CreditCard, Gift, Users, Building, DollarSign, FileText, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useUrlTab } from "@/hooks/use-url-tab";
import { cn } from "@/lib/utils";

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
    employmentTypes: string[];
  };
  documentsRequired: string[];
  rating: number;
  reviews: number;
  tags: string[];
  processingTime: string;
  cardNetwork: string;
  additionalInfo: string;
}

const mockCardData: Record<string, CreditCardOffer> = {
  "slice-super": {
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
    keyFeatures: [
      "2% cashback on all spends",
      "Zero forex charges on international transactions",
      "Instant approval with minimal documentation",
      "No income proof required for initial limit",
      "Digital card available instantly",
      "EMI conversion on transactions above ₹2,500"
    ],
    benefits: [
      "Unlimited 2% cashback with no category restrictions",
      "No hidden charges or annual fees",
      "Easy EMI conversion facility",
      "Complimentary travel insurance up to ₹1L",
      "24/7 customer support",
      "Fraud protection and purchase protection"
    ],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      minSalary: 15000,
      minCreditScore: 650,
      employmentTypes: ["Salaried", "Self-employed", "Student"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Selfie for KYC", "Bank Statement (optional)"],
    rating: 4.6,
    reviews: 45320,
    tags: ["Popular", "Zero Fees", "Instant Approval"],
    processingTime: "Instant",
    cardNetwork: "Visa",
    additionalInfo: "Perfect for young professionals and students. Get started with minimal documentation and enjoy unlimited cashback on all your spends."
  },
  "jupiter-edge": {
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
    keyFeatures: [
      "UPI-enabled credit card",
      "2% rewards on UPI spends",
      "Zero joining and annual fee",
      "Digital-first experience",
      "Instant virtual card",
      "Contactless payments"
    ],
    benefits: [
      "Instant digital card on approval",
      "No annual maintenance charges",
      "Reward points on UPI transactions",
      "Bill payment rewards",
      "Complimentary lounge access (4 times/year)",
      "Lost card liability protection"
    ],
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 60,
      minSalary: 20000,
      minCreditScore: 700,
      employmentTypes: ["Salaried", "Self-employed"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip", "Bank Statement (3 months)"],
    rating: 4.5,
    reviews: 32450,
    tags: ["UPI Enabled", "Digital", "Lifetime Free"],
    processingTime: "24 hours",
    cardNetwork: "RuPay",
    additionalInfo: "India's first UPI credit card. Seamlessly integrated with UPI for convenient digital payments."
  },
  "hdfc-regalia": {
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
    keyFeatures: [
      "Domestic & international lounge access",
      "Buy 1 Get 1 on movie tickets",
      "Accelerated rewards on travel bookings",
      "Golf privileges at premium courses",
      "Complimentary Zomato Pro membership",
      "Exclusive hotel upgrades and discounts"
    ],
    benefits: [
      "Unlimited domestic airport lounge access",
      "International lounge access (6 times/year)",
      "Travel insurance coverage up to ₹3L",
      "Hotel privileges and upgrades",
      "24/7 concierge services",
      "Lost card liability protection"
    ],
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 60,
      minSalary: 100000,
      minCreditScore: 750,
      employmentTypes: ["Salaried", "Self-employed", "Professional"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof (Salary Slips/ITR)", "Bank Statement (6 months)"],
    rating: 4.8,
    reviews: 52340,
    tags: ["Premium", "Travel", "Lounge"],
    processingTime: "7-10 days",
    cardNetwork: "Visa",
    additionalInfo: "HDFC Regalia is a premium credit card designed for discerning travelers and lifestyle enthusiasts. Enjoy world-class benefits, accelerated rewards, and exclusive privileges."
  },
  "navi-credit": {
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
    keyFeatures: [
      "5% cashback on groceries",
      "2% cashback on fuel purchases",
      "1% on all other spends",
      "Zero forex markup on international transactions",
      "Instant credit limit increase eligibility",
      "EMI conversion facility"
    ],
    benefits: [
      "High cashback rates on essential categories",
      "Fuel surcharge waiver on transactions above ₹400",
      "Complimentary airport lounge access (4 times/year)",
      "Purchase protection insurance",
      "Zero liability on fraudulent transactions",
      "Easy online account management"
    ],
    eligibilityCriteria: {
      minAge: 23,
      maxAge: 65,
      minSalary: 25000,
      minCreditScore: 720,
      employmentTypes: ["Salaried", "Self-employed"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Bank Statement (3 months)"],
    rating: 4.4,
    reviews: 28950,
    tags: ["Cashback", "Fuel", "Low Interest"],
    processingTime: "3-5 days",
    cardNetwork: "Mastercard",
    additionalInfo: "Navi Credit Card offers exceptional cashback on everyday spending. Perfect for those who want to maximize savings on groceries, fuel, and regular purchases."
  },
  "evencred-rewards": {
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
    keyFeatures: [
      "10X rewards on select categories",
      "Complimentary lounge access (8 times/year)",
      "Zero forex charges on international transactions",
      "24/7 concierge services",
      "Priority customer support",
      "Milestone benefits on annual spends"
    ],
    benefits: [
      "Premium rewards program with accelerated earning",
      "Travel benefits and insurance coverage",
      "Exclusive lifestyle offers and experiences",
      "Global acceptance at millions of merchants",
      "Reward points never expire",
      "Flexible redemption options"
    ],
    eligibilityCriteria: {
      minAge: 25,
      maxAge: 60,
      minSalary: 40000,
      minCreditScore: 750,
      employmentTypes: ["Salaried", "Self-employed", "Professional"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Address Proof", "Bank Statement (6 months)"],
    rating: 4.7,
    reviews: 38720,
    tags: ["Premium", "Rewards", "10X Points"],
    processingTime: "5-7 days",
    cardNetwork: "Visa",
    additionalInfo: "EvenCred Rewards Card is designed for those who love dining out and shopping. Earn accelerated rewards and enjoy premium travel benefits."
  },
  "icici-platinum": {
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
    keyFeatures: [
      "Shopping offers & discounts on partner merchants",
      "Fuel surcharge waiver up to ₹250/month",
      "Easy EMI conversion facility",
      "Contactless payment enabled",
      "Exclusive dining offers",
      "Movie ticket discounts"
    ],
    benefits: [
      "E-commerce discounts and cashback offers",
      "Dining offers at premium restaurants",
      "Movie benefits - Buy 1 Get 1 on weekdays",
      "Insurance coverage on purchases",
      "Lost card liability protection",
      "Global customer assistance"
    ],
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 65,
      minSalary: 25000,
      minCreditScore: 700,
      employmentTypes: ["Salaried", "Self-employed"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip", "Bank Statement (3 months)"],
    rating: 4.3,
    reviews: 41250,
    tags: ["Shopping", "Fuel", "EMI"],
    processingTime: "5-7 days",
    cardNetwork: "Visa",
    additionalInfo: "ICICI Platinum offers great value for online shoppers. Enjoy exclusive discounts, fuel savings, and easy EMI conversion on your purchases."
  },
  "axis-ace": {
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
    keyFeatures: [
      "5% cashback on bills & recharges via Google Pay",
      "4% cashback on dining at partner restaurants",
      "2% cashback on groceries at supermarkets",
      "1% cashback on all other spends",
      "Zero forex markup on international spends",
      "Contactless payment enabled"
    ],
    benefits: [
      "High cashback on utilities and bill payments",
      "Dining benefits at 4000+ restaurants",
      "Zero liability on lost card",
      "Reward redemption flexibility",
      "Instant cashback - no redemption needed",
      "24/7 customer support"
    ],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      minSalary: 20000,
      minCreditScore: 680,
      employmentTypes: ["Salaried", "Self-employed"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Address Proof"],
    rating: 4.5,
    reviews: 48920,
    tags: ["Cashback", "Popular", "Google Pay"],
    processingTime: "3-5 days",
    cardNetwork: "Visa",
    additionalInfo: "Axis Bank ACE is perfect for maximizing cashback on everyday expenses. Get up to 5% cashback on bill payments through Google Pay."
  },
  "sbi-simplyclick": {
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
    keyFeatures: [
      "10X rewards on partner merchants (Amazon, BookMyShow, etc.)",
      "1X reward points on other spends",
      "Annual movie vouchers worth ₹2000",
      "Fuel surcharge waiver on transactions above ₹400",
      "Easy reward redemption",
      "Contactless payment enabled"
    ],
    benefits: [
      "Accelerated rewards on online shopping",
      "Complimentary movie tickets",
      "Dining offers at select restaurants",
      "Gift vouchers and merchandise",
      "Fuel savings on every transaction",
      "Contactless payments for convenience"
    ],
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 70,
      minSalary: 20000,
      minCreditScore: 700,
      employmentTypes: ["Salaried", "Self-employed"]
    },
    documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip", "Bank Statement (3 months)"],
    rating: 4.2,
    reviews: 36780,
    tags: ["Shopping", "Online", "Movie Benefits"],
    processingTime: "7-10 days",
    cardNetwork: "Visa",
    additionalInfo: "SBI SimplyCLICK is ideal for online shoppers. Earn 10X rewards on partner merchants and enjoy complimentary movie benefits throughout the year."
  }
};

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
  
  if (issuerLower.includes('slice')) {
    return {
      gradient: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-cyan-800/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-emerald-700 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>Slice</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Card</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('jupiter')) {
    return {
      gradient: 'bg-gradient-to-br from-amber-600 via-yellow-700 to-orange-800',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-transparent to-orange-800/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-amber-700 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>Jupiter</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Bank</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('navi')) {
    return {
      gradient: 'bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-transparent to-purple-800/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-indigo-700 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>Navi</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Fintech</p>
        </>
      )
    };
  }
  
  if (issuerLower.includes('evencred')) {
    return {
      gradient: 'bg-gradient-to-br from-violet-600 via-fuchsia-700 to-pink-800',
      overlays: (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-transparent to-pink-800/30 opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-700/20 rounded-full blur-3xl translate-y-28 -translate-x-28" />
        </>
      ),
      logo: (
        <>
          <div className="mb-2 ml-auto">
            <div className="bg-white px-3 py-1.5 rounded">
              <p className="text-violet-700 text-lg font-bold tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>EvenCred</p>
            </div>
          </div>
          <p className="text-white/95 text-[9px] font-light tracking-wider">Card</p>
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

const getNetworkColor = (network: string) => {
  switch (network.toLowerCase()) {
    case "visa": return "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600";
    case "mastercard": return "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600";
    case "rupay": return "bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600";
    case "amex": return "bg-gradient-to-br from-slate-700 via-slate-600 to-gray-700";
    default: return "bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-600";
  }
};

export default function CreditCardDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");

  const card = mockCardData[id || ""] || mockCardData["slice-super"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!card) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Card not found</h2>
          <Button onClick={() => navigate("/credit-card-marketplace")} className="rounded-none bg-white text-black hover:bg-white/90">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleApply = () => {
    navigate(`/credit-card-application?cardId=${card.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            onClick={() => navigate("/credit-card-marketplace")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-base font-bold tracking-wider uppercase">{card.cardName}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{card.providerName}</p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="px-4 pb-4">
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-2xl">
                  {card.providerLogo}
                </div>
                <div>
                  <h2 className="text-white font-light text-base tracking-wide">{card.providerName}</h2>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-white fill-current" />
                    <span className="text-white/60 text-xs">{card.rating} ({card.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Interest Rate</p>
                <p className="text-white font-light text-2xl tracking-tight">{card.interestRate}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Joining Fee</p>
                <p className="text-white font-light text-sm">{card.joiningFee === 0 ? 'FREE' : formatCurrency(card.joiningFee)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Annual Fee</p>
                <p className="text-white font-light text-sm">{card.annualFee === 0 ? 'FREE' : formatCurrency(card.annualFee)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Credit Limit</p>
                <p className="text-white font-light text-sm">{card.creditLimit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[240px] px-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="eligibility" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-eligibility"
            >
              Eligibility
            </TabsTrigger>
            <TabsTrigger 
              value="benefits" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-benefits"
            >
              Benefits
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-features"
            >
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            {/* Realistic Credit Card with 3D Effect */}
            <div className="perspective-1000">
              <div className={cn(
                "relative h-60 p-7 flex flex-col justify-between overflow-hidden rounded-2xl",
                "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(255,255,255,0.1)_inset,0_-2px_8px_rgba(0,0,0,0.2)_inset]",
                "border border-white/10",
                "transform transition-transform hover:scale-[1.02]",
                getBrandTheme(card.providerName).gradient || getNetworkColor(card.cardNetwork)
              )}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(255,255,255,0.1) inset, 0 -2px 8px rgba(0,0,0,0.2) inset, 0 1px 1px rgba(255,255,255,0.15) inset'
              }}>
                {/* Brand-specific overlays */}
                {getBrandTheme(card.providerName).overlays}
                
                <div className="relative z-10">
                  {/* Top section - Chip and Card Type */}
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
                        <p className="text-white/90 text-[11px] uppercase font-semibold tracking-widest">{card.cardType}</p>
                        <p className="text-white/90 text-sm font-medium tracking-wide">{card.category}</p>
                      </div>
                    </div>
                    {/* Organization logo and name */}
                    <div className="text-right">
                      {getBrandTheme(card.providerName).logo}
                    </div>
                  </div>

                  {/* Card number with realistic spacing */}
                  <div className="mt-6 mb-4">
                    <p className="text-white text-xl sm:text-2xl font-mono tracking-[0.3em] drop-shadow-md">•••• •••• •••• ••••</p>
                  </div>

                  {/* Bottom section - Name on left, Network on right */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/60 text-[8px] uppercase tracking-widest font-light mb-0.5">Card Holder</p>
                      <p className="text-white/95 text-sm font-medium tracking-wider uppercase">Your Name</p>
                      <p className="text-white/70 text-[10px] mt-1">Valid Thru: MM/YY</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-white font-semibold text-2xl uppercase tracking-wider drop-shadow-lg">{card.cardNetwork}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">About this Card</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {card.additionalInfo || `${card.cardName} by ${card.providerName} offers exceptional value with competitive rates and benefits. Perfect for your everyday spending needs.`}
              </p>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <Badge key={index} className="bg-white/20 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Card Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Card Type</p>
                    <p className="text-sm text-white">{card.cardType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Card Network</p>
                    <p className="text-sm text-white">{card.cardNetwork}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Processing Time</p>
                    <p className="text-sm text-white">{card.processingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Welcome Bonus</p>
                    <p className="text-sm text-white">{card.welcomeBonus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Reward Rate</p>
                    <p className="text-sm text-white">{card.rewardRate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Fee Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Joining Fee</span>
                  <span className="text-base text-white font-light">
                    {card.joiningFee === 0 ? 'FREE' : formatCurrency(card.joiningFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Annual Fee</span>
                  <span className="text-base text-white font-light">
                    {card.annualFee === 0 ? 'FREE' : formatCurrency(card.annualFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">Fee Waiver</span>
                  <span className="text-base text-white font-light">{card.feeWaiver}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="mt-6 space-y-4">
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Eligibility Criteria</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Age Range</p>
                    <p className="text-sm text-white">{card.eligibilityCriteria.minAge} - {card.eligibilityCriteria.maxAge} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Minimum Monthly Income</p>
                    <p className="text-sm text-white">{formatCurrency(card.eligibilityCriteria.minSalary)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Minimum Credit Score</p>
                    <p className="text-sm text-white">{card.eligibilityCriteria.minCreditScore}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Employment Type</p>
                    <p className="text-sm text-white">{card.eligibilityCriteria.employmentTypes.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Required Documents</h3>
              <div className="grid grid-cols-1 gap-2">
                {card.documentsRequired.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10">
                    <FileText className="h-4 w-4 text-white/60 flex-shrink-0" />
                    <span className="text-sm text-white/70">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Eligibility Tips</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <span className="text-white/60 mt-0.5">•</span>
                  <span className="text-white/70 text-sm font-light">
                    Ensure your credit score is above {card.eligibilityCriteria.minCreditScore} for better approval chances
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <span className="text-white/60 mt-0.5">•</span>
                  <span className="text-white/70 text-sm font-light">
                    Have all required documents ready before applying
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <span className="text-white/60 mt-0.5">•</span>
                  <span className="text-white/70 text-sm font-light">
                    Maintain a stable income and employment history
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-6 space-y-4">
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Card Benefits</h3>
              <div className="space-y-2">
                {card.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-white flex-shrink-0" />
                    <span className="text-sm text-white/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Why Choose This Card</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <CheckCircle className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-light">
                    {card.feeWaiver === "Lifetime free" ? "Zero joining and annual fees" : `Affordable fees with ${card.feeWaiver.toLowerCase()}`}
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <CheckCircle className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-light">
                    Excellent rewards program with {card.rewardRate.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <CheckCircle className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-light">
                    Fast approval process - {card.processingTime.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-6 space-y-4">
            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Key Features</h3>
              <div className="space-y-2">
                {card.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Additional Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Interest Rate</p>
                  <p className="text-base font-light text-white">{card.interestRate}% p.m.</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Credit Limit</p>
                  <p className="text-base font-light text-white">{card.creditLimit}</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Card Network</p>
                  <p className="text-base font-light text-white">{card.cardNetwork}</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1.5">Category</p>
                  <p className="text-base font-light text-white capitalize">{card.category}</p>
                </div>
              </div>
            </div>

            <div className="border border-white/30 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4">
              <h3 className="text-white font-light text-sm tracking-wide uppercase mb-3">Security Features</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-light">
                    Zero liability on fraudulent transactions
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-light">
                    Chip & PIN technology for secure payments
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white/5">
                  <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-light">
                    SMS & email alerts for all transactions
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-screen-lg mx-auto">
          <Button 
            onClick={handleApply}
            className="w-full bg-white text-black hover:bg-white/90 font-light h-12 rounded-none tracking-widest text-xs uppercase"
            data-testid="button-apply-card"
          >
            Apply for Credit Card
          </Button>
        </div>
      </div>
    </div>
  );
}
