import { useState } from "react";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Bell,
  Shield,
  Eye,
  Lock,
  Fingerprint,
  CreditCard,
  TrendingUp,
  Calendar,
  Smartphone,
  Zap,
  Mail,
  MessageSquare,
  Vibrate,
  Moon,
  Globe,
  Wallet,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Database,
  CloudOff,
  Sparkles,
  BarChart3,
  Target,
  Award,
  Gift,
  Users,
  Activity
} from "lucide-react";

interface SettingItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: string;
}

export default function Settings() {
  const [, navigate] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
  ];

  const [settings, setSettings] = useState<SettingItem[]>([
    // Security & Privacy
    {
      id: "biometric",
      label: "Biometric Login",
      description: "Use fingerprint or face ID",
      enabled: true,
      category: "security"
    },
    {
      id: "two-factor",
      label: "Two-Factor Authentication",
      description: "Extra security for login",
      enabled: true,
      category: "security"
    },
    {
      id: "auto-lock",
      label: "Auto Lock",
      description: "Lock app after inactivity",
      enabled: true,
      category: "security"
    },
    {
      id: "hide-balance",
      label: "Hide Balances by Default",
      description: "Blur amounts on app open",
      enabled: false,
      category: "security"
    },
    {
      id: "transaction-pin",
      label: "Transaction PIN",
      description: "Require PIN for payments",
      enabled: true,
      category: "security"
    },

    // Notifications
    {
      id: "push-notifications",
      label: "Push Notifications",
      description: "Receive app notifications",
      enabled: true,
      category: "notifications"
    },
    {
      id: "payment-alerts",
      label: "Payment Alerts",
      description: "Notify on transactions",
      enabled: true,
      category: "notifications"
    },
    {
      id: "investment-updates",
      label: "Investment Updates",
      description: "Market & portfolio alerts",
      enabled: true,
      category: "notifications"
    },
    {
      id: "bill-reminders",
      label: "Bill Reminders",
      description: "Due date notifications",
      enabled: true,
      category: "notifications"
    },
    {
      id: "booking-updates",
      label: "Booking Updates",
      description: "Travel & event reminders",
      enabled: true,
      category: "notifications"
    },
    {
      id: "offer-alerts",
      label: "Offers & Rewards",
      description: "Deals and cashback alerts",
      enabled: false,
      category: "notifications"
    },
    {
      id: "email-notifications",
      label: "Email Notifications",
      description: "Receive updates via email",
      enabled: true,
      category: "notifications"
    },
    {
      id: "sms-alerts",
      label: "SMS Alerts",
      description: "Transaction SMS alerts",
      enabled: true,
      category: "notifications"
    },

    // Payment & Transactions
    {
      id: "upi-autopay",
      label: "UPI AutoPay",
      description: "Recurring payments",
      enabled: true,
      category: "payments"
    },
    {
      id: "quick-pay",
      label: "Quick Pay",
      description: "Skip confirmation for small amounts",
      enabled: false,
      category: "payments"
    },
    {
      id: "credit-upi",
      label: "Credit UPI",
      description: "Pay via credit line",
      enabled: true,
      category: "payments"
    },
    {
      id: "save-cards",
      label: "Save Cards",
      description: "Store card details securely",
      enabled: true,
      category: "payments"
    },
    {
      id: "international-payments",
      label: "International Payments",
      description: "Enable cross-border transactions",
      enabled: false,
      category: "payments"
    },

    // Investments
    {
      id: "auto-invest",
      label: "Auto Invest (SIP)",
      description: "Automatic investment deduction",
      enabled: true,
      category: "investments"
    },
    {
      id: "market-alerts",
      label: "Market Alerts",
      description: "Price & trend notifications",
      enabled: true,
      category: "investments"
    },
    {
      id: "dividend-reinvest",
      label: "Dividend Reinvestment",
      description: "Auto reinvest dividends",
      enabled: false,
      category: "investments"
    },
    {
      id: "portfolio-sync",
      label: "Portfolio Sync",
      description: "Sync across devices",
      enabled: true,
      category: "investments"
    },

    // Bills & Recharge
    {
      id: "auto-bill-pay",
      label: "Auto Bill Pay",
      description: "Pay bills automatically",
      enabled: false,
      category: "bills"
    },
    {
      id: "bill-due-alerts",
      label: "Bill Due Alerts",
      description: "Reminder before due date",
      enabled: true,
      category: "bills"
    },
    {
      id: "recharge-suggestions",
      label: "Smart Recharge Suggestions",
      description: "AI-based recharge reminders",
      enabled: true,
      category: "bills"
    },

    // Bookings & Travel
    {
      id: "travel-insurance",
      label: "Travel Insurance Auto-add",
      description: "Add insurance to bookings",
      enabled: false,
      category: "bookings"
    },
    {
      id: "travel-alerts",
      label: "Travel Alerts",
      description: "Flight, train updates",
      enabled: true,
      category: "bookings"
    },
    {
      id: "save-travelers",
      label: "Save Traveler Details",
      description: "Quick booking access",
      enabled: true,
      category: "bookings"
    },

    // Rewards & Offers
    {
      id: "cashback",
      label: "Cashback Program",
      description: "Earn on transactions",
      enabled: true,
      category: "rewards"
    },
    {
      id: "referral-rewards",
      label: "Referral Rewards",
      description: "Earn by referring friends",
      enabled: true,
      category: "rewards"
    },
    {
      id: "loyalty-points",
      label: "Loyalty Points",
      description: "Collect & redeem points",
      enabled: true,
      category: "rewards"
    },

    // Advanced Features
    {
      id: "analytics",
      label: "Financial Analytics",
      description: "Track spending patterns",
      enabled: true,
      category: "advanced"
    },
    {
      id: "ai-insights",
      label: "AI Financial Insights",
      description: "Smart recommendations",
      enabled: true,
      category: "advanced"
    },
    {
      id: "budget-tracking",
      label: "Budget Tracking",
      description: "Monitor monthly budgets",
      enabled: true,
      category: "advanced"
    },
    {
      id: "goal-tracking",
      label: "Goal Tracking",
      description: "Track financial goals",
      enabled: true,
      category: "advanced"
    },
    {
      id: "expense-categorization",
      label: "Auto Expense Categorization",
      description: "AI expense sorting",
      enabled: true,
      category: "advanced"
    },

    // Data & Storage
    {
      id: "auto-backup",
      label: "Auto Backup",
      description: "Cloud backup of data",
      enabled: true,
      category: "data"
    },
    {
      id: "offline-mode",
      label: "Offline Mode",
      description: "Access data offline",
      enabled: false,
      category: "data"
    },
    {
      id: "data-sync",
      label: "Data Sync",
      description: "Sync across devices",
      enabled: true,
      category: "data"
    }
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const categories = [
    { 
      id: "language", 
      label: "Language & Region", 
      icon: Globe,
      description: "Language preferences"
    },
    { 
      id: "security", 
      label: "Security & Privacy", 
      icon: Shield,
      description: "Protect your account"
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell,
      description: "Manage alerts"
    },
    { 
      id: "payments", 
      label: "Payments & Transactions", 
      icon: CreditCard,
      description: "Payment settings"
    },
    { 
      id: "investments", 
      label: "Investments", 
      icon: TrendingUp,
      description: "Investment preferences"
    },
    { 
      id: "bills", 
      label: "Bills & Recharge", 
      icon: Zap,
      description: "Bill payment options"
    },
    { 
      id: "bookings", 
      label: "Bookings & Travel", 
      icon: Calendar,
      description: "Travel preferences"
    },
    { 
      id: "rewards", 
      label: "Rewards & Offers", 
      icon: Gift,
      description: "Rewards program"
    },
    { 
      id: "advanced", 
      label: "Advanced Features", 
      icon: Sparkles,
      description: "Smart tools"
    },
    { 
      id: "data", 
      label: "Data & Storage", 
      icon: Database,
      description: "Data management"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-9 w-9 p-0 transition-all duration-200 text-xs"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold tracking-wider uppercase text-white">Settings</h1>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Settings Info Card */}
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/10 border border-white/20 p-2.5">
              <Shield className="h-5 w-5 text-white stroke-[1]" />
            </div>
            <div>
              <h2 className="text-lg font-light text-white">App Settings</h2>
              <p className="text-xs text-white/60">Customize your experience</p>
            </div>
          </div>
          <p className="text-sm text-white/70 font-light">
            Manage your preferences, security, notifications, and app behavior. Changes are saved automatically.
          </p>
        </div>

        {/* Settings by Category */}
        {categories.map((category) => {
          const categorySettings = settings.filter(s => s.category === category.id);
          const Icon = category.icon;
          
          return (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-4 w-4 text-white/60" strokeWidth={1} />
                <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">{category.label}</h2>
              </div>
              
              {/* Language Settings - Special Section */}
              {category.id === "language" && (
                <div className="space-y-2">
                  <div className="bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-light text-white text-sm mb-1">App Language</p>
                        <p className="text-xs text-white/60">Select your preferred language</p>
                      </div>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white rounded-none" data-testid="select-language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20 rounded-none">
                          {languages.map((lang) => (
                            <SelectItem 
                              key={lang.code} 
                              value={lang.code}
                              className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                              data-testid={`language-${lang.code}`}
                            >
                              {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Settings */}
              {category.id !== "language" && (
                <div className="space-y-2">
                  {categorySettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="font-light text-white text-sm mb-1">{setting.label}</p>
                          <p className="text-xs text-white/60">{setting.description}</p>
                        </div>
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={() => toggleSetting(setting.id)}
                          className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20"
                          data-testid={`switch-${setting.id}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-light">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/security")}
              className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex flex-col gap-3 backdrop-blur-xl text-left"
              data-testid="button-security"
            >
              <div className="bg-white/10 border border-white/20 p-2.5">
                <Lock className="h-5 w-5 text-white stroke-[1]" />
              </div>
              <div>
                <p className="font-light text-white text-sm mb-1">Security Center</p>
                <p className="text-xs text-white/60">Manage passwords & PINs</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/profile-about")}
              className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-all flex flex-col gap-3 backdrop-blur-xl text-left"
              data-testid="button-about"
            >
              <div className="bg-white/10 border border-white/20 p-2.5">
                <AlertCircle className="h-5 w-5 text-white stroke-[1]" />
              </div>
              <div>
                <p className="font-light text-white text-sm mb-1">About</p>
                <p className="text-xs text-white/60">App info & version</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
