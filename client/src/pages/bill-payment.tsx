import { useState } from "react";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Search,
  Smartphone, 
  Tv, 
  Zap, 
  Droplets,
  Car,
  Home,
  Wifi,
  Building2,
  Receipt,
  ChevronRight
} from "lucide-react";

const BILL_CATEGORIES = [
  {
    id: "mobile",
    title: "Mobile Recharge",
    subtitle: "Prepaid & Postpaid",
    icon: Smartphone,
    route: "/mobile-recharge",
    gradient: "from-blue-500/10 to-blue-600/5"
  },
  {
    id: "electricity",
    title: "Electricity Bill",
    subtitle: "All states supported",
    icon: Zap,
    route: "/electricity-bill",
    gradient: "from-yellow-500/10 to-yellow-600/5"
  },
  {
    id: "dth",
    title: "DTH Recharge",
    subtitle: "TV & Set-top box",
    icon: Tv,
    route: "/dth-recharge",
    gradient: "from-purple-500/10 to-purple-600/5"
  },
  {
    id: "gas",
    title: "Gas Bill",
    subtitle: "Pipeline gas bill",
    icon: Home,
    route: "/gas-bill",
    gradient: "from-orange-500/10 to-orange-600/5"
  },
  {
    id: "water",
    title: "Water Bill",
    subtitle: "Municipal water",
    icon: Droplets,
    route: "/water-bill",
    gradient: "from-cyan-500/10 to-cyan-600/5"
  },
  {
    id: "broadband",
    title: "Broadband",
    subtitle: "Internet & WiFi",
    icon: Wifi,
    route: "/broadband-bill",
    gradient: "from-green-500/10 to-green-600/5"
  },
  {
    id: "fastag",
    title: "FASTag Recharge",
    subtitle: "Toll payments",
    icon: Car,
    route: "/fastag",
    gradient: "from-pink-500/10 to-pink-600/5"
  },
  {
    id: "municipal",
    title: "Municipal Tax",
    subtitle: "Property & other taxes",
    icon: Building2,
    route: "/municipal-tax",
    gradient: "from-red-500/10 to-red-600/5"
  },
  {
    id: "ott",
    title: "OTT Subscription",
    subtitle: "Netflix, Prime & more",
    icon: Tv,
    route: "/ott-subscription",
    gradient: "from-indigo-500/10 to-indigo-600/5"
  }
];

const SAVED_BILLS = [
  {
    id: "1",
    title: "Kerala Electricity (KSEB)",
    accountNumber: "1165197013517",
    amount: 1563,
    dueDate: "25 Oct",
    status: "due",
    category: "electricity"
  },
  {
    id: "2", 
    title: "Jio Mobile",
    accountNumber: "9876543210",
    amount: 599,
    dueDate: "15 Nov",
    status: "upcoming",
    category: "mobile"
  },
  {
    id: "3",
    title: "Tata Play DTH",
    accountNumber: "1234567890",
    amount: 350,
    dueDate: "20 Nov",
    status: "upcoming",
    category: "dth"
  },
  {
    id: "4",
    title: "Mahanagar Gas",
    accountNumber: "9988776655",
    amount: 890,
    dueDate: "22 Oct",
    status: "due",
    category: "gas"
  },
  {
    id: "5",
    title: "ACT Fibernet",
    accountNumber: "ACT123456",
    amount: 799,
    dueDate: "10 Oct",
    status: "paid",
    category: "broadband"
  }
];

export default function BillPayment() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useUrlTab("all");

  const billStats = {
    all: SAVED_BILLS.length,
    paid: SAVED_BILLS.filter(b => b.status === "paid").length,
    upcoming: SAVED_BILLS.filter(b => b.status === "upcoming").length,
    due: SAVED_BILLS.filter(b => b.status === "due").length
  };

  const filteredCategories = BILL_CATEGORIES.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBills = SAVED_BILLS.filter(bill => {
    if (activeTab === "all") return true;
    if (activeTab === "my-bills") return true;
    if (activeTab === "recent") return bill.status === "paid";
    if (activeTab === "due") return bill.status === "due";
    return true;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = BILL_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || Receipt;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
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
            <h1 className="text-base font-bold tracking-wider uppercase">Bills & Recharge</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">All Services</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-bills")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-my-bills"
          >
            <Receipt className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search bills & services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-11 rounded-none h-12 focus:border-white placeholder:text-white/30"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Bill Stats Card */}
        <div className="mb-6 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-2xl font-light text-white">{billStats.all}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mt-1">All</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-2xl font-light text-green-400">{billStats.paid}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Paid</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-2xl font-light text-blue-400">{billStats.upcoming}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Upcoming</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-2xl font-light text-red-400">{billStats.due}</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Due</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger 
                value="all" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-all"
              >
                All Services
              </TabsTrigger>
              <TabsTrigger 
                value="my-bills" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-my-bills"
              >
                My Bills
              </TabsTrigger>
              <TabsTrigger 
                value="recent" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-recent"
              >
                Recent
              </TabsTrigger>
              <TabsTrigger 
                value="due" 
                className="relative data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent transition-all duration-200 ease-in-out data-[state=active]:scale-[1.06] data-[state=active]:font-medium hover:text-white/70"
                data-testid="tab-due"
              >
                Due Soon
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content based on active tab */}
        {activeTab === "all" && (
          <div className="space-y-4">
            <h2 className="text-xs text-white/60 uppercase tracking-widest font-light mb-4">All Services</h2>
            <div className="grid grid-cols-2 gap-4">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => navigate(category.route)}
                    className="relative group overflow-hidden"
                    data-testid={`category-${category.id}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:from-white/[0.12] group-hover:to-white/[0.04]"></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500"></div>
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
                    <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 group-hover:bg-white/20 transition-all duration-500"></div>
                    
                    <div className="relative p-6 flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150"></div>
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
                          <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
                          <Icon className="relative h-6 w-6 text-white transform group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-light tracking-wide text-white uppercase mb-1">{category.title}</h3>
                        <p className="text-[10px] text-white/50 font-light uppercase tracking-wider">{category.subtitle}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" strokeWidth={1} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(activeTab === "my-bills" || activeTab === "recent" || activeTab === "due") && (
          <div className="space-y-3">
            <h2 className="text-xs text-white/60 uppercase tracking-widest font-light mb-4">
              {activeTab === "my-bills" ? "My Bills" : activeTab === "recent" ? "Recent Bills" : "Due Soon"}
            </h2>
            {filteredBills.length === 0 ? (
              <div className="text-center py-12 border border-white/10 bg-white/5">
                <Receipt className="h-12 w-12 text-white/20 mx-auto mb-3" strokeWidth={1} />
                <p className="text-white/40 font-light">No bills found</p>
              </div>
            ) : (
              filteredBills.map((bill) => {
                const Icon = getCategoryIcon(bill.category);
                return (
                  <button
                    key={bill.id}
                    onClick={() => navigate(`/bill-detail/${bill.id}`)}
                    className="w-full border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-white/30 transition-all p-4"
                    data-testid={`bill-${bill.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center border border-white/20 bg-white/5">
                        <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-light text-white mb-1">{bill.title}</h3>
                        <p className="text-[10px] text-white/40 font-light">{bill.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-light text-white mb-1">{formatCurrency(bill.amount)}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`rounded-none text-[10px] font-light ${
                            bill.status === "paid" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            bill.status === "due" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}>
                            {bill.status.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-white/40">{bill.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
