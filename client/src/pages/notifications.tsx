import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import type { Notification } from "@shared/schema";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { 
  ArrowLeft, 
  Bell,
  CheckCircle,
  DollarSign,
  FileText,
  Gift,
  Clock,
  ChevronDown,
  LayoutGrid,
  CreditCard,
  Receipt,
  Smartphone,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: "1",
      userId: "user-1",
      type: "payment",
      title: "EMI Payment Due Today",
      message: "Your EMI payment of ₹11,250 is due today. Avoid late fees by paying now.",
      isRead: 0,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { amount: 11250, loanId: "1", emiId: "emi-1", navigateTo: "/emi/emi-1", dueDate: "30 Dec 2024", provider: "HDFC Bank" }
    },
    {
      id: "2", 
      userId: "user-1",
      type: "approval",
      title: "Loan Application Approved",
      message: "Congratulations! Your personal loan of ₹3,00,000 has been approved.",
      isRead: 0,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      metadata: { amount: 300000, applicationNumber: "PL-2024-007", loanId: "loan-1", navigateTo: "/loan/loan-1", dueDate: "28 Dec 2024", provider: "ICICI Bank" }
    },
    {
      id: "3",
      userId: "user-1", 
      type: "document",
      title: "KYC Verification Required",
      message: "Complete your KYC by uploading Aadhaar & PAN to unlock all features.",
      isRead: 0,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      metadata: { documentsRequired: ["aadhaar", "pan"], navigateTo: "/kyc-application", dueDate: "27 Dec 2024" }
    },
    {
      id: "4",
      userId: "user-1",
      type: "reminder",
      title: "Credit Score Updated",
      message: "Your credit score improved by 14 points! View detailed analysis.",
      isRead: 1,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      metadata: { creditScore: 742, previousScore: 728, navigateTo: "/myreport", dueDate: "25 Dec 2024" }
    },
    {
      id: "5",
      userId: "user-1",
      type: "payment",
      title: "Electricity Bill",
      message: "Your electricity bill of ₹2,450 is due on 15th Jan.",
      isRead: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metadata: { amount: 2450, billType: "electricity", navigateTo: "/bill-payment/electricity", dueDate: "10 Dec 2024", provider: "BESCOM" }
    },
    {
      id: "6",
      userId: "user-1",
      type: "transaction", 
      title: "Flight Booking Confirmed",
      message: "Your flight to Mumbai on 20th Jan is confirmed. PNR: 8K3J9L.",
      isRead: 1,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      metadata: { bookingRef: "8K3J9L", pnr: "8K3J9L", navigateTo: "/my-trips", dueDate: "20 Dec 2024", provider: "IndiGo" }
    },
    {
      id: "7",
      userId: "user-1",
      type: "payment",
      title: "Water Bill",
      message: "Your water bill payment is due.",
      isRead: 0,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      metadata: { amount: 650, fundName: "Axis Bluechip Fund", navigateTo: "/investment/sip", dueDate: "20 Dec 2024", provider: "BWSSB" }
    },
    {
      id: "8",
      userId: "user-1",
      type: "payment",
      title: "Cash Park Interest Earned",
      message: "You earned ₹8,500 interest in your savings jar.",
      isRead: 0,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      metadata: { amount: 8500, jarId: "8a2a466d-850e-42a2-8ba1-51786e88e427", navigateTo: "/cash-park/jar/8a2a466d-850e-42a2-8ba1-51786e88e427", dueDate: "18 Dec 2024", provider: "Cash Park" }
    },
    {
      id: "9",
      userId: "user-1",
      type: "promotion",
      title: "Earn 500 Reward Points",
      message: "Complete 3 bill payments this month and get 500 bonus points + ₹100 cashback!",
      isRead: 0,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      metadata: { offerCode: "BILL500", validUntil: "2025-01-31", navigateTo: "/my-rewards", dueDate: "31 Dec 2024" }
    },
    {
      id: "10",
      userId: "user-1",
      type: "payment",
      title: "Card Payment Due",
      message: "Your credit card payment of ₹1,299 is due soon.",
      isRead: 0,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metadata: { amount: 1299, cardId: "card-1", navigateTo: "/my-cards/card-1", dueDate: "15 Dec 2024", provider: "HDFC Bank" }
    },
    {
      id: "11",
      userId: "user-1",
      type: "payment",
      title: "Gas Bill",
      message: "IGL gas bill payment is due.",
      isRead: 0,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      metadata: { amount: 890, transactionId: "UPI2025011512345", navigateTo: "/upi-history", dueDate: "12 Dec 2024", provider: "IGL" }
    },
    {
      id: "12",
      userId: "user-1",
      type: "payment",
      title: "Fixed Deposit Matured",
      message: "Your fixed deposit of ₹500,000 has matured.",
      isRead: 0,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      metadata: { amount: 500, fdId: "fd-1", navigateTo: "/fixed-deposits/fd-1", dueDate: "25 Dec 2024", provider: "ICICI Bank" }
    },
  ];

  const { data: notifications = mockNotifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: isAuthenticated,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockNotifications;
    },
    initialData: mockNotifications,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment": return DollarSign;
      case "document": return FileText;
      case "reminder": return Clock;
      case "approval": return CheckCircle;
      case "promotion": return Gift;
      case "transaction": return TrendingUp;
      default: return Bell;
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "payment": return "💰";
      case "document": return "📄";
      case "reminder": return "⏰";
      case "approval": return "✅";
      case "promotion": return "🎁";
      case "transaction": return "📈";
      default: return "🔔";
    }
  };

  const formatTime = (date: string | Date | null) => {
    if (!date) return "Unknown time";
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.isRead === 0) {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.metadata && typeof notification.metadata === 'object' && 'navigateTo' in notification.metadata) {
      const navigateTo = notification.metadata.navigateTo as string;
      if (navigateTo) {
        navigate(navigateTo);
      }
    }
  };

  // Filter notifications by category
  let filteredNotifications = notifications.filter(notification => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "payments") return notification.type === "payment" || notification.type === "transaction";
    if (selectedCategory === "approvals") return notification.type === "approval";
    if (selectedCategory === "documents") return notification.type === "document";
    if (selectedCategory === "promotions") return notification.type === "promotion";
    if (selectedCategory === "reminders") return notification.type === "reminder";
    return notification.type === selectedCategory;
  });

  // Filter by status
  filteredNotifications = filteredNotifications.filter(notification => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "unread") return notification.isRead === 0;
    if (selectedStatus === "read") return notification.isRead === 1;
    return true;
  });

  const pagination = usePagination({
    data: filteredNotifications,
    itemsPerPage: 20,
  });

  const unreadCount = notifications.filter(n => n.isRead === 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-b-2 border-white rounded-none"></div>
          </div>
          <p className="text-white/60 font-light tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="bg-white/10 text-white hover:bg-white/20 rounded-none h-10 w-10 p-0"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold tracking-wider">ALL NOTIFICATIONS</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-filter"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-white/20 text-white" align="end">
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("all")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("unread")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Unread Only
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("read")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Read Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="pt-16">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="px-0">
          <div className="sticky top-[64px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 overflow-x-auto">
            <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto">
              <TabsTrigger 
                value="all" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-all"
              >
                <span className="text-lg">🔔</span>
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-payments"
              >
                <span className="text-lg">💰</span>
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-approvals"
              >
                <span className="text-lg">✅</span>
                <span>Approvals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-documents"
              >
                <span className="text-lg">📄</span>
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger 
                value="promotions" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-promotions"
              >
                <span className="text-lg">🎁</span>
                <span>Promotions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-reminders"
              >
                <span className="text-lg">⏰</span>
                <span>Reminders</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-0 px-4 py-6">
            {/* Status Filter */}
            <div className="mb-6">
              <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
                <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="tab-status-all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent flex items-center gap-1 justify-center"
                    data-testid="tab-status-unread"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    Unread
                  </TabsTrigger>
                  <TabsTrigger 
                    value="read" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent flex items-center gap-1 justify-center"
                    data-testid="tab-status-read"
                  >
                    <ArrowDownRight className="h-3 w-3" />
                    Read
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Notification List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl text-center">
                  <p className="text-white/60 font-light tracking-wider">No notifications found</p>
                </div>
              ) : (
                pagination.paginatedData.map((notification) => {
                  const metadata = notification.metadata as any;
                  const amount = metadata?.amount;
                  const dueDate = metadata?.dueDate;
                  const provider = metadata?.provider;
                  
                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full p-5 border-b border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left"
                      data-testid={`notification-${notification.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="text-3xl flex-shrink-0">{getTypeEmoji(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-light tracking-wider text-sm text-white">{notification.title}</h3>
                              <Badge className={
                                notification.isRead === 0 
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/20 rounded-none" 
                                  : "bg-white/10 text-white/60 border-white/20 rounded-none"
                              }>
                                {notification.isRead === 0 ? "unread" : "read"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              {dueDate && (
                                <span className="text-white/50 font-light">
                                  Due: {dueDate}
                                </span>
                              )}
                              {provider && (
                                <>
                                  <span className="text-white/30">•</span>
                                  <span className="text-white/40 font-light">{provider}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0 ml-3">
                          {amount && (
                            <p className="font-light text-base text-white" data-testid={`amount-${notification.id}`}>
                              ₹{amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              {filteredNotifications.length > 0 && (
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
