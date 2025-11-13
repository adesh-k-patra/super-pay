import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  User,
  Headphones,
  FileQuestion,
  MessageSquare,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  Shield
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  category: "contact" | "help" | "emergency";
  availability?: string;
  isAvailable?: boolean;
}

export default function Support() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [selectedTab, setSelectedTab] = useUrlTab("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/918547258015?text=Hello%20Kcredit%20Support", "_blank");
  };

  const handleCall = () => {
    window.open("tel:+918547258015");
  };

  const handleEmail = () => {
    window.open("mailto:support@kcredit.com");
  };

  const handleEmergencyCall = () => {
    window.open("tel:+911800123456");
  };

  const supportOptions: SupportOption[] = [
    {
      id: "whatsapp",
      title: "WhatsApp Support",
      description: "Chat with us on WhatsApp for instant help",
      icon: MessageCircle,
      action: handleWhatsAppSupport,
      category: "contact",
      availability: "24/7",
      isAvailable: true
    },
    {
      id: "call",
      title: "Call Support",
      description: "+91-8547258015",
      icon: Phone,
      action: handleCall,
      category: "contact",
      availability: "Mon-Sat, 9AM-6PM",
      isAvailable: true
    },
    {
      id: "email",
      title: "Email Support",
      description: "support@kcredit.com",
      icon: Mail,
      action: handleEmail,
      category: "contact",
      availability: "Response within 24 hrs",
      isAvailable: true
    },
    {
      id: "faq",
      title: "FAQs",
      description: "Find answers to common questions",
      icon: FileQuestion,
      action: () => {},
      category: "help",
      isAvailable: true
    },
    {
      id: "live-chat",
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageSquare,
      action: () => {},
      category: "help",
      availability: "Mon-Sat, 9AM-6PM",
      isAvailable: true
    },
    {
      id: "video-call",
      title: "Video Call Support",
      description: "Schedule a video call with expert",
      icon: Video,
      action: () => {},
      category: "help",
      availability: "By appointment",
      isAvailable: false
    },
    {
      id: "help-center",
      title: "Help Center",
      description: "Browse our knowledge base",
      icon: BookOpen,
      action: () => {},
      category: "help",
      isAvailable: true
    },
    {
      id: "loan-docs",
      title: "Loan Documents",
      description: "Access loan-related documents",
      icon: FileText,
      action: () => {},
      category: "help",
      isAvailable: true
    },
    {
      id: "fraud-alert",
      title: "Report Fraud",
      description: "Report suspicious activity",
      icon: Shield,
      action: () => {},
      category: "emergency",
      availability: "24/7",
      isAvailable: true
    },
    {
      id: "emergency",
      title: "Emergency Helpline",
      description: "1800-123-456 (24/7)",
      icon: Headphones,
      action: handleEmergencyCall,
      category: "emergency",
      availability: "24/7",
      isAvailable: true
    }
  ];

  const filteredOptions = useMemo(() => {
    let optionsToFilter: SupportOption[] = [];
    
    switch (selectedTab) {
      case "contact":
        optionsToFilter = supportOptions.filter(opt => opt.category === "contact");
        break;
      case "help":
        optionsToFilter = supportOptions.filter(opt => opt.category === "help");
        break;
      case "emergency":
        optionsToFilter = supportOptions.filter(opt => opt.category === "emergency");
        break;
      case "overview":
      default:
        optionsToFilter = supportOptions;
        break;
    }
    
    // Apply search filter
    if (searchQuery) {
      optionsToFilter = optionsToFilter.filter(opt => 
        opt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return optionsToFilter;
  }, [selectedTab, searchQuery]);

  const stats = {
    totalOptions: supportOptions.length,
    contactOptions: supportOptions.filter(opt => opt.category === "contact").length,
    helpOptions: supportOptions.filter(opt => opt.category === "help").length,
    emergencyOptions: supportOptions.filter(opt => opt.category === "emergency").length
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
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
            <h1 className="text-base font-bold tracking-wider uppercase">Support</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">We're here to help</p>
          </div>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6">
        {/* Overview Stats Card */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5">
          <div className="space-y-4">
            {/* Relationship Manager Section */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center bg-white/5">
                <User className="h-6 w-6 text-white/60" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold tracking-wide uppercase text-white">Rahul Kumar</h3>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Relationship Manager</p>
              </div>
              <Button
                onClick={handleCall}
                size="sm"
                className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-3"
                data-testid="button-call-rm"
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Response</p>
                <p className="text-sm font-light text-white">2 hours</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Available</p>
                <p className="text-sm font-light text-white">Mon-Sat</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Rating</p>
                <p className="text-sm font-light text-white">4.8/5.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search support options..."
            className="bg-white/5 border-white/10 text-white pl-10 h-11 placeholder:text-white/40 focus:bg-white/10 focus:border-white/20 rounded-none transition-colors"
            data-testid="input-search-support"
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-overview"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-contact"
            >
              Contact
            </TabsTrigger>
            <TabsTrigger 
              value="help" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-help"
            >
              Help
            </TabsTrigger>
            <TabsTrigger 
              value="emergency" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
              data-testid="tab-emergency"
            >
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {filteredOptions.length === 0 ? (
              <div className="border border-white/10 bg-white/5 p-12 text-center">
                <HelpCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No options found</h3>
                <p className="text-white/50 mb-4">Try a different search or category</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTab("overview");
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-none"
                  data-testid="button-clear-search"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={option.action}
                      className="w-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all text-left"
                      data-testid={`card-support-${option.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                            <OptionIcon className="h-5 w-5 text-white/60" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{option.title}</h4>
                              {option.isAvailable !== undefined && (
                                <Badge className={`${option.isAvailable ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-white/10 text-white/50 border-white/20'} text-[9px] px-1.5 py-0 h-4 rounded-none`}>
                                  {option.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-white/50 tracking-wide">{option.description}</p>
                            {option.availability && (
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{option.availability}</p>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-white/40 flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Office Hours Card */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white/60" />
            </div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-white">Support Hours</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[11px] text-white/50 uppercase tracking-widest">Monday - Friday</span>
              <span className="text-sm font-light text-white">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[11px] text-white/50 uppercase tracking-widest">Saturday</span>
              <span className="text-sm font-light text-white">10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] text-white/50 uppercase tracking-widest">Sunday</span>
              <span className="text-sm font-light text-white">Emergency only</span>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 border border-white/20 flex items-center justify-center bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-white">Emergency Helpline</h3>
          </div>
          <p className="text-[11px] text-white/50 tracking-wide mb-4">
            For urgent loan-related issues, contact our 24/7 emergency helpline
          </p>
          <Button
            onClick={handleEmergencyCall}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-11 font-semibold tracking-wide"
            data-testid="button-emergency-contact"
          >
            <Phone className="h-4 w-4 mr-2" />
            1800-123-456
          </Button>
        </div>
      </div>
    </div>
  );
}
